/** Varsayılan destek / şifre sıfırlama iletişim adresi (Gmail + EmailJS gönderici olarak kullanılabilir). */
const DEFAULT_SUPPORT_EMAIL = 'diapalorg@gmail.com'

/** Arayüzde gösterilen ve mailto: için kullanılan destek e-postası. `.env` ile override: VITE_SUPPORT_EMAIL */
export function getSupportEmail(): string {
  const v = import.meta.env.VITE_SUPPORT_EMAIL
  if (typeof v === 'string' && v.includes('@')) return v.trim()
  return DEFAULT_SUPPORT_EMAIL
}

export function getSupportMailtoHref(subject?: string): string {
  const email = getSupportEmail()
  if (!subject) return `mailto:${email}`
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`
}
