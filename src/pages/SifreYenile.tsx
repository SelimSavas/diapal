import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PasswordInput } from '../components/PasswordField'
import { useAuth } from '../context/AuthContext'

export default function SifreYenile() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { completePasswordReset } = useAuth()
  const token = searchParams.get('token')?.trim() ?? ''

  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!token) {
      setError('Geçerli bir sıfırlama bağlantısı kullanın.')
      return
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
      return
    }
    if (password !== password2) {
      setError('Şifreler eşleşmiyor.')
      return
    }
    setSaving(true)
    const result = completePasswordReset(token, password)
    setSaving(false)
    if (result.ok) {
      navigate('/giris', { replace: true, state: { passwordResetOk: true } })
    } else {
      setError(result.error ?? 'Şifre güncellenemedi.')
    }
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 md:py-20">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <h1 className="text-xl font-700 text-slate-900">Bağlantı geçersiz</h1>
          <p className="mt-3 text-slate-600 text-sm">
            Şifre sıfırlama bağlantısı eksik veya hatalı. Lütfen e-postadaki bağlantıyı kullanın veya yeni sıfırlama isteyin.
          </p>
          <Link to="/sifremi-unuttum" className="mt-6 inline-block text-diapal-600 font-600 hover:underline">
            Şifremi unuttum
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-800 text-slate-900">Yeni şifre</h1>
        <p className="mt-2 text-slate-600">Hesabınız için yeni bir şifre belirleyin.</p>
      </div>
      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="newpw" className="block text-sm font-500 text-slate-700 mb-1.5">
            Yeni şifre
          </label>
          <PasswordInput
            id="newpw"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition"
            placeholder="En az 6 karakter"
          />
        </div>
        <div>
          <label htmlFor="newpw2" className="block text-sm font-500 text-slate-700 mb-1.5">
            Yeni şifre (tekrar)
          </label>
          <PasswordInput
            id="newpw2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition"
            placeholder="Tekrar girin"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation disabled:opacity-60"
        >
          {saving ? 'Kaydediliyor…' : 'Şifreyi güncelle'}
        </button>
      </form>
      <p className="mt-6 text-center text-slate-600 text-sm">
        <Link to="/giris" className="text-diapal-600 font-500 hover:underline">Giriş sayfasına dön</Link>
      </p>
    </div>
  )
}
