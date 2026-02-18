import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SifremiUnuttum() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = email.trim()
    if (!trimmed) {
      setError('E-posta adresinizi girin.')
      return
    }
    // Demo: gerçek uygulamada backend'e istek atılır, e-posta gönderilir
    setSent(true)
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 md:py-20">
        <div className="rounded-2xl border border-diapal-200 bg-diapal-50 p-8 text-center">
          <h1 className="text-xl font-700 text-slate-900">E-posta gönderildi</h1>
          <p className="mt-3 text-slate-600 text-sm">
            Şifre sıfırlama bağlantısı <strong>{email.trim()}</strong> adresine gönderildi. Gelen kutunuzu ve istenmeyen posta klasörünü kontrol edin.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Bağlantı gelmezse birkaç dakika bekleyin veya <Link to="/iletisim" className="text-diapal-600 font-500 hover:underline">bizimle iletişime geçin</Link>.
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
          className="w-full py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation"
        >
          Sıfırlama bağlantısı gönder
        </button>
      </form>
      <p className="mt-6 text-center text-slate-600 text-sm">
        <Link to="/giris" className="text-diapal-600 font-500 hover:underline">Giriş sayfasına dön</Link>
      </p>
    </div>
  )
}
