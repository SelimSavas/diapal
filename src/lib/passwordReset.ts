import emailjs from '@emailjs/browser'
import { getEmailJsPublicKey, getEmailJsServiceId } from './emailVerification'

const TOKENS_KEY = 'diapal_pw_reset_tokens'
/** Tek kullanımlık bağlantı; süre dolunca geçersiz */
const RESET_EXPIRY_MS = 60 * 60 * 1000

type ResetEntry = { token: string; email: string; expiresAt: number }

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

/**
 * Aynı e-posta için önceki bekleyen sıfırlama jetonlarını siler, yenisini ekler.
 * @returns sıfırlama URL’sinde kullanılacak jeton
 */
export function createPasswordResetToken(email: string): string {
  const token = crypto.randomUUID()
  const normalized = email.trim()
  let list = loadList()
  list = list.filter((e) => e.email.toLowerCase() !== normalized.toLowerCase())
  list.push({ token, email: normalized, expiresAt: Date.now() + RESET_EXPIRY_MS })
  saveList(list)
  return token
}

/** Jeton hâlâ geçerliyse e-postayı döner; kaydı silmez (form hatalarında jeton korunur). */
export function peekValidPasswordResetEmail(token: string): string | null {
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

/** Şifre güncellendikten sonra jetonu listeden kaldırır (tek kullanımlık). */
export function removePasswordResetToken(token: string): void {
  const trimmed = token.trim()
  if (!trimmed) return
  const list = loadList().filter((e) => e.token !== trimmed)
  saveList(list)
}

/**
 * EmailJS şablonunda {{to_email}} ve/veya {{email}}, {{reset_link}} kullanın.
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
  })
}
