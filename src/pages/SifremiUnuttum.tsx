import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getSupportEmail, getSupportMailtoHref } from '../config/site'
import { useAuth } from '../context/AuthContext'
import { isPasswordResetEmailConfigured } from '../lib/passwordReset'

export default function SifremiUnuttum() {
  const { requestPasswordReset } = useAuth()
  const supportEmail = getSupportEmail()
  const destekSifreMailto = getSupportMailtoHref('Diapal şifre sıfırlama yardımı')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const emailConfigured = isPasswordResetEmailConfigured()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = email.trim()
    if (!trimmed) {
      setError('E-posta adresinizi girin.')
      return
    }
    setLoading(true)
    const result = await requestPasswordReset(trimmed)
    setLoading(false)
    if (result.ok) {
      setSent(true)
    } else {
      setError(result.error ?? 'İşlem tamamlanamadı.')
    }
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 md:py-20">
        <div className="rounded-2xl border border-diapal-200 bg-diapal-50 p-8 text-center">
          <h1 className="text-xl font-700 text-slate-900">E-posta gönderildi</h1>
          <p className="mt-3 text-slate-600 text-sm">
            Bu adresle kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı <strong>{email.trim()}</strong> adresine gönderildi. Gelen kutunuzu ve istenmeyen posta klasörünü kontrol edin.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Bağlantı gelmezse birkaç dakika bekleyin, gelen kutusu / spam klasörünü kontrol edin veya{' '}
            <a href={destekSifreMailto} className="text-diapal-600 font-500 hover:underline break-all">
              {supportEmail}
            </a>{' '}
            adresinden yazın.{' '}
            <Link to="/iletisim" className="text-diapal-600 font-500 hover:underline">İletişim</Link>
          </p>
          <Link to="/giris" className="mt-6 inline-block text-diapal-600 font-600 hover:underline">
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-800 text-slate-900">Şifremi unuttum</h1>
        <p className="mt-2 text-slate-600">
          E-posta adresinizi girin; size şifre sıfırlama bağlantısı gönderelim.
        </p>
      </div>
      {!emailConfigured && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-600">E-posta gönderimi yapılandırılmadı</p>
          <p className="mt-1 text-amber-800/90">
            Geliştirici olarak proje kökünde <code className="text-xs bg-amber-100/80 px-1 rounded">.env</code> dosyasına{' '}
            <code className="text-xs bg-amber-100/80 px-1 rounded">VITE_EMAILJS_PUBLIC_KEY</code>,{' '}
            <code className="text-xs bg-amber-100/80 px-1 rounded">VITE_EMAILJS_SERVICE_ID</code> ve şifre sıfırlama şablonu için{' '}
            <code className="text-xs bg-amber-100/80 px-1 rounded">VITE_EMAILJS_TEMPLATE_ID_RESET</code> ekleyin. EmailJS panelinde yeni bir şablon oluşturup içinde{' '}
            <code className="text-xs bg-amber-100/80 px-1 rounded">{'{{to_email}}'}</code> ve{' '}
            <code className="text-xs bg-amber-100/80 px-1 rounded">{'{{reset_link}}'}</code> alanlarını kullanın.
          </p>
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-500 text-slate-700 mb-1.5">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition"
            placeholder="ornek@email.com"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? 'Gönderiliyor…' : 'Sıfırlama bağlantısı gönder'}
        </button>
      </form>
      <p className="mt-4 text-center text-slate-500 text-sm">
        Sorun yaşarsanız:{' '}
        <a href={destekSifreMailto} className="text-diapal-600 font-500 hover:underline break-all">
          {supportEmail}
        </a>
      </p>
      <p className="mt-2 text-center text-slate-600 text-sm">
        <Link to="/giris" className="text-diapal-600 font-500 hover:underline">Giriş sayfasına dön</Link>
      </p>
    </div>
  )
}
