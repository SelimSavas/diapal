import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../context/AuthContext'

export default function Kayit() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [role, setRole] = useState<UserRole>('hasta')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [branch, setBranch] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = register({
      email,
      password,
      name,
      role,
      ...(role === 'doktor' && { branch: branch.trim(), city: city.trim() }),
    })
    if (result.ok) {
      navigate('/profil')
    } else {
      setError(result.error ?? 'Kayıt oluşturulamadı.')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-800 text-slate-900">Kayıt ol</h1>
        <p className="mt-2 text-slate-600">Diapal topluluğuna katıl — hasta veya doktor olarak profil oluştur.</p>
      </div>

      <div className="flex rounded-xl border border-slate-200 p-1 mb-8 bg-slate-50">
        <button
          type="button"
          onClick={() => setRole('hasta')}
          className={`flex-1 py-3 min-h-[44px] rounded-lg text-sm font-600 transition-colors touch-manipulation ${
            role === 'hasta' ? 'bg-white text-diapal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 active:bg-slate-100'
          }`}
        >
          Hasta
        </button>
        <button
          type="button"
          onClick={() => setRole('doktor')}
          className={`flex-1 py-3 min-h-[44px] rounded-lg text-sm font-600 transition-colors touch-manipulation ${
            role === 'doktor' ? 'bg-white text-diapal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 active:bg-slate-100'
          }`}
        >
          Doktor
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-500 text-slate-700 mb-1.5">
            {role === 'doktor' ? 'Ad soyad (örn. Dr. Ayşe Yılmaz)' : 'Ad soyad'}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition"
            placeholder={role === 'doktor' ? 'Dr. Ad Soyad' : 'Ad Soyad'}
          />
        </div>
        {role === 'doktor' && (
          <>
            <div>
              <label htmlFor="branch" className="block text-sm font-500 text-slate-700 mb-1.5">
                Branş
              </label>
              <input
                id="branch"
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition"
                placeholder="Örn. Endokrinoloji"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-500 text-slate-700 mb-1.5">
                Şehir
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition"
                placeholder="Örn. İstanbul"
              />
            </div>
          </>
        )}
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
          <label htmlFor="password" className="block text-sm font-500 text-slate-700 mb-1.5">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition"
            placeholder="En az 6 karakter"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation"
        >
          {role === 'doktor' ? 'Doktor hesabı oluştur' : 'Hesap oluştur'}
        </button>
      </form>
      <p className="mt-6 text-center text-slate-600 text-sm">
        Zaten hesabın var mı?{' '}
        <Link to="/giris" className="text-diapal-600 font-500 hover:underline">Giriş yap</Link>
      </p>
    </div>
  )
}
