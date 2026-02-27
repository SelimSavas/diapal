import { useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getNews } from '../lib/news'
import { getFeaturedStory } from '../lib/stories'

const HOME_NEWS_COUNT = 3

const iconSize = 32

function EasyAccessIcon({ type }: { type: string }) {
  const className = 'shrink-0'
  switch (type) {
    case 'book':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M8 7h8" /><path d="M8 11h6" />
        </svg>
      )
    case 'document':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
        </svg>
      )
    case 'recipe':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      )
    case 'sparkles':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" /><path d="M3 5h4" /><path d="M19 17v4" /><path d="M17 19h4" />
        </svg>
      )
    case 'megaphone':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      )
    case 'calculator':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <path d="M8 6h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" />
          <path d="M16 10h.01" /><path d="M16 14h.01" />
        </svg>
      )
    case 'chart':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      )
    case 'clipboard':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />
        </svg>
      )
    case 'pill':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>
      )
    case 'checkCircle':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
      )
    case 'trophy':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      )
    case 'doctor':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <path d="M15 11h6" /><path d="M18 8v6" />
        </svg>
      )
    case 'forum':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    case 'mail':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      )
    case 'heart':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      )
    case 'building':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
        </svg>
      )
    case 'help':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      )
    case 'contact':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      )
    case 'message':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      )
    case 'lock':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    case 'fileText':
      return (
        <svg className={className} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
        </svg>
      )
    default:
      return null
  }
}

const ALL_SECTIONS = [
  {
    title: 'İçerik',
    to: '/icerik',
    items: [
      { to: '/bilgi', label: 'Diyabet Bilgisi', iconType: 'book' },
      { to: '/makaleler', label: 'Makaleler', iconType: 'document' },
      { to: '/tarifler', label: 'Tarifler', iconType: 'recipe' },
      { to: '/hikayeler', label: 'Hikayeler', iconType: 'sparkles' },
      { to: '/haberler-duyurular', label: 'Haberler ve Duyurular', iconType: 'megaphone' },
    ],
  },
  {
    title: 'Araçlar',
    to: '/araclar',
    items: [
      { to: '/karbonhidrat-sayaci', label: 'KH Sayacı', iconType: 'calculator' },
      { to: '/hba1c-tahminleyici', label: 'HbA1c Tahmini', iconType: 'chart' },
      { to: '/olcum-gunlugu', label: 'Ölçüm Günlüğü', iconType: 'clipboard' },
      { to: '/ilac-hatirlatici', label: 'İlaç Hatırlatıcı', iconType: 'pill' },
      { to: '/gunluk-gorevler', label: 'Günlük Görevler', iconType: 'checkCircle' },
      { to: '/meydan-okumalar', label: 'Meydan Okumalar', iconType: 'trophy' },
    ],
  },
  {
    title: 'Platform',
    to: '/platform',
    items: [
      { to: '/doktorlar', label: 'Doktor Bul', iconType: 'doctor' },
      { to: '/forum', label: 'Forum', iconType: 'forum' },
      { to: '/mesajlar', label: 'Mesajlar', iconType: 'mail' },
      { to: '/favorilerim', label: 'Favorilerim', iconType: 'heart' },
    ],
  },
  {
    title: 'Kurumsal',
    to: '/kurumsal',
    items: [
      { to: '/bilgi', label: 'Biz Kimiz?', iconType: 'building' },
      { to: '/sss', label: 'SSS', iconType: 'help' },
      { to: '/iletisim', label: 'Bize Ulaşın', iconType: 'contact' },
      { to: '/geri-bildirim', label: 'Geri bildirim', iconType: 'message' },
      { to: '/gizlilik', label: 'Gizlilik', iconType: 'lock' },
      { to: '/kullanim-sartlari', label: 'Kullanım Şartları', iconType: 'fileText' },
    ],
  },
]

export default function Home() {
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoScrollPaused = useRef(false)
  const pauseUntil = useRef(0)

  const autoScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || autoScrollPaused.current || Date.now() < pauseUntil.current) return
    const segmentWidth = el.scrollWidth / 2
    if (segmentWidth <= 0) return
    el.scrollLeft += 1
    if (el.scrollLeft >= segmentWidth - 1) el.scrollLeft = 0
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const interval = setInterval(autoScroll, 35)
    const pause = () => {
      autoScrollPaused.current = true
      pauseUntil.current = Date.now() + 1200
    }
    const resume = () => {
      autoScrollPaused.current = false
    }
    el.addEventListener('touchstart', pause)
    el.addEventListener('wheel', pause)
    el.addEventListener('mousedown', pause)
    el.addEventListener('mouseenter', resume)
    const t = setInterval(() => {
      if (Date.now() >= pauseUntil.current) autoScrollPaused.current = false
    }, 500)
    return () => {
      clearInterval(interval)
      clearInterval(t)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('wheel', pause)
      el.removeEventListener('mousedown', pause)
      el.removeEventListener('mouseenter', resume)
    }
  }, [autoScroll])

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-diapal-700 via-diapal-600 to-emerald-500 text-white">
        <div className="max-w-[1250px] h-[500px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 relative">
          <div className="grid gap-8 sm:gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-500 text-emerald-50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Diyabet yolculuğunda beraberiz
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-800 tracking-tight text-white leading-tight">
                  Diyabette yalnız değilsin
                </h1>
                <p className="text-base md:text-lg text-diapal-50 leading-relaxed max-w-xl">
                  Diapal, diyabetle yaşayanları alanında uzman doktorlarla ve destekleyici bir toplulukla bir araya getirir.
                  Bilgi, randevu ve paylaşım tek bir yerde.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={user ? '/doktorlar' : '/kayit'}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 min-h-[48px] text-sm font-600 text-white shadow-sm hover:bg-slate-800 active:bg-slate-700 transition-colors touch-manipulation"
                >
                  {user ? 'Doktor Bul' : 'Diapal’a ücretsiz katıl'}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to={user ? '/forum' : '/doktorlar'}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-4 py-3 min-h-[48px] text-xs md:text-sm font-500 text-diapal-50 hover:border-white hover:text-white active:bg-white/10 transition-colors touch-manipulation"
                >
                  {user ? 'Forum' : 'Önce doktorları incele'}
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-diapal-50/90">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Gerçek doktor profilleri
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  Topluluk forumu
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Türkçe bilgi merkezi
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 -z-10 bg-gradient-to-tr from-diapal-200/60 via-white to-diapal-50 blur-3xl" />
              <figure className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between border-b border-slate-100/80 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-2xl bg-diapal-600/10 flex items-center justify-center text-xs font-700 text-diapal-700">
                      HbA1c
                    </span>
                    <div>
                      <p className="text-xs font-500 text-slate-900">Kontrol randevusu</p>
                      <p className="text-[11px] text-slate-500">Endokrinoloji • 15 dk görüntülü</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-500 text-emerald-700">
                    İyi seyir
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="/hero-patient-doctor.png"
                    alt="Doktorun diyabet ölçüm cihazı ile danışanın şekerini ölçmesi"
                    className="h-56 w-full object-cover md:h-64"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-slate-900/80 p-3 backdrop-blur">
                    <div className="flex items-center justify-between text-xs text-slate-100">
                      <div>
                        <p className="font-500">Son ölçüm</p>
                        <p className="mt-0.5 text-[11px] text-slate-300">Açlık glukozu</p>
                      </div>
                      <div className="flex items-end gap-1">
                        <span className="text-lg font-700 text-emerald-300">95</span>
                        <span className="text-[11px] text-slate-300">mg/dL</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-200">
                          Hedef aralıkta
                        </span>
                        <span className="text-[11px] text-slate-400">Diapal notu ile kaydedildi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </div>

        {/* Tam genişlik kaydırma şeridi – sitenin solundan sağına */}
        <div
          ref={scrollRef}
          data-hide-scrollbar
          className="w-full overflow-x-auto overflow-y-hidden scroll-smooth touch-pan-x py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex flex-nowrap gap-4 md:gap-5 pl-4 pr-4 md:pl-6 md:pr-6" style={{ width: 'max-content' }}>
            {[1, 2].map((copy) =>
              ALL_SECTIONS.map((section) =>
                section.items.map((item) => (
                  <Link
                    key={`${copy}-${section.title}-${item.to}`}
                    to={item.to}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all text-center shrink-0 w-[100px] md:w-[120px]"
                  >
                    <span className="flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
                      <EasyAccessIcon type={item.iconType} />
                    </span>
                    <span className="text-xs md:text-sm font-600 text-white leading-tight line-clamp-2">
                      {item.label}
                    </span>
                  </Link>
                ))
              )
            )}
          </div>
        </div>
        <style>{`
          [data-hide-scrollbar]::-webkit-scrollbar { display: none; }
        `}</style>
      </section>

      {/* Haberler ve Duyurular – görselleriyle */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <div>
              <span className="inline-block rounded-full bg-slate-100 text-slate-600 text-xs font-600 uppercase tracking-wider px-4 py-1.5 mb-3">
                Haberler & Duyurular
              </span>
              <h2 className="text-2xl md:text-3xl font-800 text-slate-900 tracking-tight">
                Son haberler
              </h2>
            </div>
            <Link
              to="/haberler-duyurular"
              className="text-diapal-600 font-600 text-sm hover:text-diapal-700 flex items-center gap-1"
            >
              Tümünü gör
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getNews().slice(0, HOME_NEWS_COUNT).map((item) => (
              <Link
                key={item.id}
                to={`/haberler-duyurular/${item.slug}`}
                className="group block rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-diapal-200 transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <span className={`text-xs font-600 px-2 py-0.5 rounded ${item.type === 'haber' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-800'}`}>
                    {item.type === 'haber' ? 'Haber' : 'Duyuru'}
                  </span>
                  <h3 className="mt-2 font-700 text-slate-900 line-clamp-2 group-hover:text-diapal-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{item.excerpt}</p>
                  <p className="mt-3 text-xs text-slate-500">{new Date(item.date).toLocaleDateString('tr-TR')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-diapal-100 text-diapal-700 text-xs font-600 uppercase tracking-wider px-4 py-1.5 mb-5">
              Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-800 text-slate-900 tracking-tight">
              Diapal ile neler yapabilirsin?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
              Bilgi, uzman erişimi ve topluluk desteği tek bir platformda.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: 'Diyabet bilgisi',
                description: 'Tip 1, Tip 2, beslenme, egzersiz ve günlük yaşam hakkında güvenilir kaynaklar.',
                to: '/bilgi',
                icon: '📚',
                accent: 'from-sky-500 to-sky-600',
                bg: 'bg-sky-50',
                border: 'border-sky-100',
                hover: 'hover:border-sky-200',
              },
              {
                title: 'Doktorlarla buluş',
                description: 'Endokrinoloji ve diyabet uzmanlarına ulaş, randevu ve danışmanlık al.',
                to: '/doktorlar',
                icon: '👨‍⚕️',
                accent: 'from-diapal-500 to-diapal-600',
                bg: 'bg-diapal-50',
                border: 'border-diapal-100',
                hover: 'hover:border-diapal-200',
              },
              {
                title: 'Forum & topluluk',
                description: 'Deneyimlerini paylaş, sorularını sor, aynı yolda yürüyenlerle tanış.',
                to: '/forum',
                icon: '💬',
                accent: 'from-emerald-500 to-emerald-600',
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
                hover: 'hover:border-emerald-200',
              },
            ].map(({ title, description, to, icon, accent, bg, border, hover }) => (
              <Link
                key={to}
                to={to}
                className={`group relative block rounded-2xl border-2 ${border} ${bg} p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99] ${hover}`}
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-2xl shadow-lg`}>
                  {icon}
                </div>
                <h3 className="mt-6 text-xl font-700 text-slate-900 group-hover:text-slate-800 transition-colors">
                  {title}
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed text-[15px]">
                  {description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-600 text-slate-700 group-hover:gap-3 transition-all">
                  Keşfet
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-warm-50 border-y border-warm-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-700 text-slate-900">
              Toplulukta sen de varsın
            </h2>
            <p className="mt-4 text-slate-600">
              Diyabetle yaşayan binlerce kişi ve aile Diapal'da bilgi alıyor, doktorlarla iletişim kuruyor ve forumda birbirine destek oluyor. Hesap oluştur, ücretsiz katıl.
            </p>
          </div>

          {(() => {
            const feat = getFeaturedStory()
            return feat ? (
              <div key="featured" className="mt-10 max-w-2xl mx-auto">
                <Link
                  to="/hikayeler"
                  className="block rounded-2xl border-2 border-diapal-200 bg-white p-6 shadow-sm hover:border-diapal-300 hover:shadow-md transition-all"
                >
                  <span className="inline-block rounded-full bg-diapal-100 text-diapal-700 text-xs font-700 uppercase tracking-wider px-3 py-1 mb-3">
                    Ayın motivasyonu
                  </span>
                  <h3 className="text-lg font-700 text-slate-900">{feat.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{feat.authorName}</p>
                  <p className="mt-3 text-slate-600 text-sm line-clamp-2">{feat.body}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-500 text-diapal-600">
                    Hikayeleri oku →
                  </span>
                </Link>
              </div>
            ) : null
          })()}

          <div className="mt-10 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-600 text-slate-700">Forum · Son konular</span>
                <Link to="/forum" className="text-xs font-500 text-diapal-600 hover:text-diapal-700">
                  Tümünü gör
                </Link>
              </div>
              <ul className="divide-y divide-slate-100">
                {[
                  { title: 'Tip 2 tanısı yeni aldım, nereden başlamalıyım?', author: 'Ayşe K.', replies: 12, category: 'Yeni tanı' },
                  { title: 'Diyet listesi paylaşan var mı?', author: 'Mehmet D.', replies: 24, category: 'Beslenme' },
                  { title: 'Sensör kullananlar deneyimlerini yazabilir mi?', author: 'Zeynep A.', replies: 8, category: 'Teknoloji' },
                  { title: 'İş yerinde ölçüm ve insülin için öneriler', author: 'Can Y.', replies: 5, category: 'Günlük yaşam' },
                ].map((topic, i) => (
                  <li key={i}>
                    <Link
                      to="/forum"
                      className="block px-4 py-3.5 hover:bg-slate-50 transition-colors text-left"
                    >
                      <p className="text-sm font-500 text-slate-900 line-clamp-1">{topic.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {topic.author} · {topic.category} · {topic.replies} yanıt
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            {user ? (
              <Link
                to="/profil"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation"
              >
                Profilime git
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <Link
                to="/kayit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation"
              >
                Ücretsiz Kayıt Ol
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
