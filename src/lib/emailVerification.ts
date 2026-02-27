import emailjs from '@emailjs/browser'

const PENDING_KEY = 'diapal_pending_verification'
const CODE_EXPIRY_MINUTES = 10

export type PendingRegistration = {
  email: string
  name: string
  password: string
  role: 'hasta' | 'doktor'
  diabetesType?: string
  branch?: string
  city?: string
  code: string
  expiresAt: number
}

function getPublicKey(): string {
  const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  if (!key) throw new Error('VITE_EMAILJS_PUBLIC_KEY tanımlı değil. .env dosyasını kontrol edin.')
  return key
}

function getServiceId(): string {
  const id = import.meta.env.VITE_EMAILJS_SERVICE_ID
  if (!id) throw new Error('VITE_EMAILJS_SERVICE_ID tanımlı değil. .env dosyasını kontrol edin.')
  return id
}

function getTemplateId(): string {
  const id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  if (!id) throw new Error('VITE_EMAILJS_TEMPLATE_ID tanımlı değil. .env dosyasını kontrol edin.')
  return id
}

export function isEmailVerificationConfigured(): boolean {
  return !!(
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY &&
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  )
}

/** 6 haneli doğrulama kodu üretir */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/** Bekleyen kaydı localStorage'a yazar */
export function savePendingRegistration(data: Omit<PendingRegistration, 'code' | 'expiresAt'>): string {
  const code = generateVerificationCode()
  const expiresAt = Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000
  const pending: PendingRegistration = { ...data, code, expiresAt }
  localStorage.setItem(PENDING_KEY, JSON.stringify(pending))
  return code
}

/** Bekleyen kaydı okur; süresi dolmuşsa null döner */
export function getPendingRegistration(): PendingRegistration | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    if (!raw) return null
    const pending = JSON.parse(raw) as PendingRegistration
    if (Date.now() > pending.expiresAt) {
      localStorage.removeItem(PENDING_KEY)
      return null
    }
    return pending
  } catch {
    return null
  }
}

/** Doğrulama kodunu kontrol eder; doğruysa bekleyen kaydı siler ve veriyi döner */
export function verifyCodeAndConsume(code: string): PendingRegistration | null {
  const pending = getPendingRegistration()
  if (!pending || pending.code !== code.trim()) return null
  localStorage.removeItem(PENDING_KEY)
  return pending
}

/** Bekleyen kaydı iptal eder (kullanıcı geri dönüp yeniden kayıt olabilir) */
export function clearPendingRegistration(): void {
  localStorage.removeItem(PENDING_KEY)
}

/**
 * E-posta ile doğrulama kodu gönderir.
 * EmailJS şablonunda {{to_email}} ve {{code}} kullanın.
 */
export async function sendVerificationEmail(toEmail: string, code: string): Promise<void> {
  const publicKey = getPublicKey()
  const serviceId = getServiceId()
  const templateId = getTemplateId()

  emailjs.init(publicKey)

  await emailjs.send(serviceId, templateId, {
    to_email: toEmail,
    code,
  })
}
