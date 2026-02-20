import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const quickAccess = [
  { to: '/icerik', label: 'Genel bakış' },
  { to: '/bilgi', label: 'Diyabet Bilgisi' },
  { to: '/makaleler', label: 'Makaleler' },
  { to: '/tarifler', label: 'Tarifler' },
  { to: '/hikayeler', label: 'Hikayeler' },
  { to: '/haberler-duyurular', label: 'Haberler ve Duyurular' },
]

const tools = [
  { to: '/araclar', label: 'Genel bakış' },
  { to: '/karbonhidrat-sayaci', label: 'KH Sayacı' },
  { to: '/hba1c-tahminleyici', label: 'HbA1c Tahmini' },
  { to: '/olcum-gunlugu', label: 'Ölçüm Günlüğü' },
  { to: '/ilac-hatirlatici', label: 'İlaç Hatırlatıcı' },
  { to: '/gunluk-gorevler', label: 'Günlük Görevler' },
  { to: '/meydan-okumalar', label: 'Meydan Okumalar' },
]

const platform = [
  { to: '/platform', label: 'Genel bakış' },
  { to: '/doktorlar', label: 'Doktor Bul' },
  { to: '/forum', label: 'Forum' },
  { to: '/mesajlar', label: 'Mesajlar' },
  { to: '/favorilerim', label: 'Favorilerim' },
]

const corporate = [
  { to: '/kurumsal', label: 'Genel bakış' },
  { to: '/bilgi', label: 'Biz Kimiz?' },
  { to: '/sss', label: 'SSS' },
  { to: '/iletisim', label: 'Bize Ulaşın' },
  { to: '/geri-bildirim', label: 'Geri bildirim' },
  { to: '/gizlilik', label: 'Gizlilik' },
  { to: '/kullanim-sartlari', label: 'Kullanım Şartları' },
]

const socials = [
  { name: 'Instagram', href: '#', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { name: 'Facebook', href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { name: 'Twitter', href: '#', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { name: 'YouTube', href: '#', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { name: 'LinkedIn', href: '#', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
]

function NavColumn({ title, items }: { title: string; items: { to: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-700 text-white uppercase tracking-wider mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {items.map(({ to, label }) => (
          <li key={to}>
            <Link to={to} className="text-sm text-slate-400 hover:text-white transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !consent) return
    setSubmitted(true)
    setEmail('')
    setConsent(false)
  }

  return (
    <footer className="bg-slate-900 text-slate-300 pb-[env(safe-area-inset-bottom)]">
      {/* Üst şerit: slogan + CTA */}
      <div className="border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-slate-400 text-sm md:text-base font-500">
            Diyabetteki dostun — bilgi, uzman ve topluluk tek platformda.
          </p>
          {user ? (
            <Link
              to="/profil"
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-diapal-600 text-white px-5 py-2.5 text-sm font-600 hover:bg-diapal-500 transition-colors"
            >
              Profilim
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <Link
              to="/kayit"
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-diapal-600 text-white px-5 py-2.5 text-sm font-600 hover:bg-diapal-500 transition-colors"
            >
              Ücretsiz Katıl
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Hızlı Erişim + Kurumsal + Sosyal + Bülten */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="inline-flex items-center min-h-[44px] hover:opacity-90 transition-opacity">
              <span className="h-10 flex items-center max-w-[140px]">
                <img src="/logo.png" alt="Diapal" className="max-h-full w-auto object-contain object-center" />
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-400 max-w-xs leading-relaxed">
              Diyabet hastaları ve uzmanları bir araya getiren, bilgi ve dayanışma platformu.
            </p>
          </div>
          <NavColumn title="İçerik" items={quickAccess} />
          <NavColumn title="Araçlar" items={tools} />
          <NavColumn title="Platform" items={platform} />
          <NavColumn title="Kurumsal" items={corporate} />
          <div>
            <h3 className="text-sm font-700 text-white uppercase tracking-wider mb-4">Takip Edin</h3>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 text-slate-300 hover:bg-diapal-600 hover:text-white transition-colors"
                  aria-label={s.name}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* e-Bülten */}
        <div className="mt-10 pt-8 border-t border-slate-700">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h3 className="text-sm font-700 text-white uppercase tracking-wider mb-2">e-Bülten Al</h3>
              <p className="text-sm text-slate-400 mb-4">
                Yeni içerik ve duyurulardan haberdar olun.
              </p>
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  className="flex-1 min-w-0 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500"
                  required
                />
                <button
                  type="submit"
                  disabled={submitted}
                  className="shrink-0 rounded-xl bg-diapal-600 px-5 py-2.5 text-sm font-600 text-white hover:bg-diapal-500 disabled:opacity-50 transition-colors"
                >
                  {submitted ? 'Gönderildi' : 'Abone Ol'}
                </button>
              </form>
              <label className="mt-3 flex items-start gap-2 cursor-pointer max-w-md">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 rounded border-slate-600 bg-slate-800 text-diapal-500 focus:ring-diapal-500"
                />
                <span className="text-xs text-slate-500">
                  <Link to="/gizlilik" className="text-slate-400 hover:text-white underline">Kişisel verilerin işlenmesine ilişkin Aydınlatma Metni</Link>
                  ’ni okudum, kabul ediyorum.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Alt çizgi */}
        <div className="mt-10 pt-8 border-t border-slate-700 text-sm text-slate-500">
          © {new Date().getFullYear()} Diapal. Tüm hakları saklıdır. Bu site bilgilendirme amaçlıdır; tıbbi karar için mutlaka hekiminize danışın.
        </div>
      </div>
    </footer>
  )
}
