import emailjs from '@emailjs/browser'
import { getEmailJsPublicKey, getEmailJsServiceId } from './emailVerification'

const TOKENS_KEY = 'diapal_pw_reset_tokens'
const USED_NONCES_KEY = 'diapal_pw_reset_used_nonces'
/** İmzalı bağlantı geçerliliği (ms) */
const RESET_EXPIRY_MS = 60 * 60 * 1000

type ResetEntry = { token: string; email: string; expiresAt: number }

type SignedPayload = { e: string; x: number; n: string }

function getResetSecret(): string {
  const s = import.meta.env.VITE_PASSWORD_RESET_SECRET
  if (typeof s === 'string' && s.length >= 16) return s
  /** Üretimde mutlaka .env ile 16+ karakter rastgele bir değer verin */
  return 'diapal-dev-reset-secret-change-me'
}

function loadList(): ResetEntry[] {
  try {
    const raw = localStorage.getItem(TOKENS_KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as ResetEntry[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function saveList(list: ResetEntry[]): void {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(list))
}

function getResetTemplateId(): string {
  const id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RESET
  if (!id) {
    throw new Error('VITE_EMAILJS_TEMPLATE_ID_RESET tanımlı değil. .env dosyasını kontrol edin.')
  }
  return id
}

/** Kayıt + doğrulama kodu ile aynı EmailJS hesabı; ek şablon kimliği gerekir. */
export function isPasswordResetEmailConfigured(): boolean {
  return !!(
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY &&
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RESET
  )
}

function utf8ToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function utf8FromBase64Url(s: string): string {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

async function hmacSha256Base64Url(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  const bytes = new Uint8Array(sig)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * İmzalı jeton — localStorage’a bağlı değil; e-postadaki linke başka cihazdan tıklanınca da çalışır.
 */
export async function createPasswordResetToken(email: string): Promise<string> {
  const normalized = email.trim()
  const payload: SignedPayload = {
    e: normalized,
    x: Date.now() + RESET_EXPIRY_MS,
    n: crypto.randomUUID(),
  }
  const json = JSON.stringify(payload)
  const sig = await hmacSha256Base64Url(json, getResetSecret())
  return `${utf8ToBase64Url(json)}.${sig}`
}

function isNonceUsed(n: string): boolean {
  try {
    const raw = localStorage.getItem(USED_NONCES_KEY)
    const arr: string[] = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) && arr.includes(n)
  } catch {
    return false
  }
}

function markNonceUsed(n: string): void {
  try {
    const raw = localStorage.getItem(USED_NONCES_KEY)
    const arr: string[] = raw ? JSON.parse(raw) : []
    if (!Array.isArray(arr)) return
    if (!arr.includes(n)) {
      arr.push(n)
      while (arr.length > 800) arr.shift()
      localStorage.setItem(USED_NONCES_KEY, JSON.stringify(arr))
    }
  } catch {
    /* ignore */
  }
}

/** Eski sürüm: sadece aynı tarayıcıda UUID + localStorage */
function peekValidPasswordResetEmailLegacy(token: string): string | null {
  const trimmed = token.trim()
  if (!trimmed) return null
  const list = loadList()
  const entry = list.find((e) => e.token === trimmed)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    const next = list.filter((e) => e.token !== trimmed)
    saveList(next)
    return null
  }
  return entry.email
}

async function verifySignedToken(token: string): Promise<{ email: string; nonce: string } | null> {
  const trimmed = token.trim()
  const dot = trimmed.lastIndexOf('.')
  if (dot <= 0) return null
  const payloadB64 = trimmed.slice(0, dot)
  const sigPart = trimmed.slice(dot + 1)
  let json: string
  try {
    json = utf8FromBase64Url(payloadB64)
  } catch {
    return null
  }
  const expected = await hmacSha256Base64Url(json, getResetSecret())
  if (sigPart !== expected) return null
  let payload: SignedPayload
  try {
    payload = JSON.parse(json) as SignedPayload
  } catch {
    return null
  }
  if (!payload.e || !payload.n || typeof payload.x !== 'number') return null
  if (Date.now() > payload.x) return null
  if (isNonceUsed(payload.n)) return null
  return { email: payload.e, nonce: payload.n }
}

/**
 * Jeton geçerliyse e-posta döner (imzalı veya eski localStorage).
 */
export async function verifyPasswordResetToken(token: string): Promise<{ email: string; nonce?: string } | null> {
  const trimmed = token.trim()
  if (!trimmed) return null

  if (trimmed.includes('.')) {
    const v = await verifySignedToken(trimmed)
    if (v) return { email: v.email, nonce: v.nonce }
    return null
  }

  const legacy = peekValidPasswordResetEmailLegacy(trimmed)
  if (legacy) return { email: legacy }
  return null
}

/** Şifre güncellendikten sonra (eski UUID akışı). */
export function removePasswordResetToken(token: string): void {
  const trimmed = token.trim()
  if (!trimmed) return
  const list = loadList().filter((e) => e.token !== trimmed)
  saveList(list)
}

export function markPasswordResetNonceUsed(nonce: string): void {
  markNonceUsed(nonce)
}

/**
 * EmailJS şablonunda {{to_email}} ve/veya {{email}}, {{reset_link}} ve isteğe bağlı {{reset_url}} (aynı link).
 */
export async function sendPasswordResetEmail(toEmail: string, resetLink: string): Promise<void> {
  const publicKey = getEmailJsPublicKey()
  const serviceId = getEmailJsServiceId()
  const templateId = getResetTemplateId()
  emailjs.init(publicKey)
  await emailjs.send(serviceId, templateId, {
    to_email: toEmail,
    email: toEmail,
    reset_link: resetLink,
    reset_url: resetLink,
  })
}
