import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../context/AuthContext'
import {
  isEmailVerificationConfigured,
  savePendingRegistration,
  sendVerificationEmail,
  verifyCodeAndConsume,
  clearPendingRegistration,
  getPendingRegistration,
} from '../lib/emailVerification'

const DIABETES_TYPE_OPTIONS = [
  { id: 1, label: 'Tip 1 Diyabet', value: 'type_1' },
  { id: 2, label: 'Tip 2 Diyabet', value: 'type_2' },
  { id: 3, label: 'Prediyabet (Gizli Şeker)', value: 'prediabetes' },
  { id: 4, label: 'Gebelik Diyabeti (Gestasyonel)', value: 'gestational' },
  { id: 5, label: 'LADA (Tip 1.5)', value: 'lada' },
  { id: 6, label: 'MODY', value: 'mody' },
  { id: 7, label: 'Yakın / Ebeveyn', value: 'caregiver' },
  { id: 8, label: 'Diğer / Bilmiyorum', value: 'other' },
]

const DOCTOR_BRANCH_OPTIONS = [
  { id: 'endocrinology', label: 'Endokrinoloji Uzmanı' },
  { id: 'internal', label: 'İç Hastalıkları Uzmanı' },
  { id: 'family', label: 'Aile Hekimi' },
  { id: 'pedi_endocrinology', label: 'Çocuk Endokrinolojisi' },
  { id: 'dietitian', label: 'Diyetisyen' },
  { id: 'psych', label: 'Psikolog / Psikolojik Danışman' },
  { id: 'nurse', label: 'Diyabet Hemşiresi' },
  { id: 'other', label: 'Diğer sağlık profesyoneli' },
]

type Step = 'form' | 'verify'

export default function Kayit() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [step, setStep] = useState<Step>(() =>
    isEmailVerificationConfigured() && getPendingRegistration() ? 'verify' : 'form'
  )
  const [role, setRole] = useState<UserRole>('hasta')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [diabetesType, setDiabetesType] = useState('')
  const [branch, setBranch] = useState('')
  const [otherBranch, setOtherBranch] = useState('')
  const [city, setCity] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const pendingEmail = step === 'verify' ? getPendingRegistration()?.email ?? '' : ''

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (role === 'doktor' && !branch) {
      setError('Lütfen branş / uzmanlık seçin.')
      return
    }
    const branchValue =
      role === 'doktor'
        ? branch === 'other'
          ? otherBranch.trim()
          : DOCTOR_BRANCH_OPTIONS.find((opt) => opt.id === branch)?.label ?? ''
        : undefined
    const diabetesValue = role === 'doktor' ? undefined : diabetesType
    // E-posta doğrulama pasif: .env yoksa doğrudan kayıt
    if (!isEmailVerificationConfigured()) {
      const result = register({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        role,
        ...(diabetesValue && { diabetesType: diabetesValue }),
        ...(role === 'doktor' && { branch: branchValue, city: city.trim() }),
      })
      if (result.ok) navigate('/profil')
      else setError(result.error ?? 'Kayıt oluşturulamadı.')
      return
    }
    setSending(true)
    try {
      const codeSent = savePendingRegistration({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        password,
        role,
        ...(diabetesValue && { diabetesType: diabetesValue }),
        ...(role === 'doktor' && { branch: branchValue, city: city.trim() }),
      })
      await sendVerificationEmail(email.trim(), codeSent)
      setStep('verify')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Doğrulama e-postası gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setSending(false)
    }
  }

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const pending = verifyCodeAndConsume(code)
    if (!pending) {
      setError('Kod hatalı veya süresi dolmuş. Yeni kod için kayıt adımına dönüp tekrar gönderin.')
      return
    }
    const result = register(
      pending.role === 'doktor'
        ? {
            email: pending.email,
            password: pending.password,
            name: pending.name,
            role: pending.role,
            branch: pending.branch?.trim(),
            city: pending.city?.trim(),
          }
        : {
            email: pending.email,
            password: pending.password,
            name: pending.name,
            role: pending.role,
            ...(pending.diabetesType && { diabetesType: pending.diabetesType }),
          }
    )
    if (result.ok) {
      navigate('/profil')
    } else {
      setError(result.error ?? 'Kayıt oluşturulamadı.')
    }
  }

  const handleBackToForm = () => {
    clearPendingRegistration()
    setStep('form')
    setCode('')
    setError('')
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-800 text-slate-900">
          {step === 'verify' && isEmailVerificationConfigured() ? 'E-postanı doğrula' : 'Kayıt ol'}
        </h1>
        <p className="mt-2 text-slate-600">
          {step === 'verify' && isEmailVerificationConfigured()
            ? `${pendingEmail} adresine gönderilen 6 haneli kodu girin.`
            : 'Diapal topluluğuna katıl — üye veya doktor olarak profil oluştur.'}
        </p>
      </div>

      <div className="flex rounded-xl border border-slate-200 p-1 mb-8 bg-slate-50">
        <button
          type="button"
          onClick={() => setRole('hasta')}
          className={`flex-1 py-3 min-h-[44px] rounded-lg text-sm font-600 transition-colors touch-manipulation ${
            role === 'hasta' ? 'bg-white text-diapal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 active:bg-slate-100'
          }`}
        >
          Üye
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

      {step === 'verify' && isEmailVerificationConfigured() ? (
        <form onSubmit={handleSubmitCode} className="space-y-5">
          <div>
            <label htmlFor="code" className="block text-sm font-500 text-slate-700 mb-1.5">
              Doğrulama kodu
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
              placeholder="000000"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition text-center text-xl tracking-[0.4em] font-600"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Kod 10 dakika geçerlidir. Gelmediyse spam klasörünü kontrol edin.
            </p>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation"
          >
            Doğrula ve hesap oluştur
          </button>
          <button
            type="button"
            onClick={handleBackToForm}
            className="w-full py-3 min-h-[44px] rounded-xl border border-slate-200 text-slate-600 font-500 hover:bg-slate-50 transition-colors"
          >
            Geri — e-posta değiştir
          </button>
        </form>
      ) : (
      <form onSubmit={handleSubmitForm} className="space-y-5">
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
                Branş / Uzmanlık
              </label>
              <select
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition bg-white"
              >
                <option value="">Seçiniz</option>
                {DOCTOR_BRANCH_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {branch === 'other' && (
              <div>
                <label htmlFor="otherBranch" className="block text-sm font-500 text-slate-700 mb-1.5">
                  Uzmanlık / Rol açıklaması
                </label>
                <input
                  id="otherBranch"
                  type="text"
                  value={otherBranch}
                  onChange={(e) => setOtherBranch(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition"
                  placeholder="Örn. Klinik Psikolog, Psikolojik Danışman vb."
                />
              </div>
            )}
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
        {role === 'hasta' && (
          <div>
            <label htmlFor="diabetesType" className="block text-sm font-500 text-slate-700 mb-1.5">
              Diyabet türü / tipi <span className="text-rose-500">*</span>
            </label>
            <select
              id="diabetesType"
              value={diabetesType}
              onChange={(e) => setDiabetesType(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none transition bg-white"
            >
              <option value="">Seçiniz</option>
              {DIABETES_TYPE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
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
          disabled={sending}
          className="w-full py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation disabled:opacity-60 disabled:pointer-events-none"
        >
          {sending ? 'Kod gönderiliyor…' : role === 'doktor' ? 'Doktor hesabı oluştur' : isEmailVerificationConfigured() ? 'Kod gönder' : 'Hesap oluştur'}
        </button>
      </form>
      )}
      <p className="mt-6 text-center text-slate-600 text-sm">
        Zaten hesabın var mı?{' '}
        <Link to="/giris" className="text-diapal-600 font-500 hover:underline">Giriş yap</Link>
      </p>
    </div>
  )
}
