import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Giris() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = login(email.trim(), password)
    if (result.ok) {
      navigate('/profil')
    } else {
      setError(result.error ?? 'Giriş yapılamadı.')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-800 text-slate-900">Giriş yap</h1>
        <p className="mt-2 text-slate-600">Hesabına giriş yaparak Diapal'dan faydalanmaya devam et.</p>
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
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-500 text-slate-700 mb-1.5">
              Şifre
            </label>
            <Link to="/sifremi-unuttum" className="text-xs text-diapal-600 font-500 hover:underline">
              Şifremi unuttum
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation"
        >
          Giriş yap
        </button>
      </form>
      <p className="mt-6 text-center text-slate-600 text-sm">
        Hesabın yok mu?{' '}
        <Link to="/kayit" className="text-diapal-600 font-500 hover:underline">Kayıt ol</Link>
      </p>
    </div>
  )
}
