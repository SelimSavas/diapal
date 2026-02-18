import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getNews } from '../lib/news'
import { getFeaturedStory } from '../lib/stories'

const HOME_NEWS_COUNT = 3

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleToolClick = (path: string) => {
    if (user) navigate(path)
    else navigate('/kayit')
  }

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-diapal-700 via-diapal-600 to-emerald-500 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 relative">
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
                  to="/kayit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 min-h-[48px] text-sm font-600 text-white shadow-sm hover:bg-slate-800 active:bg-slate-700 transition-colors touch-manipulation"
                >
                  Diapal’a ücretsiz katıl
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/doktorlar"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-4 py-3 min-h-[48px] text-xs md:text-sm font-500 text-diapal-50 hover:border-white hover:text-white active:bg-white/10 transition-colors touch-manipulation"
                >
                  Önce doktorları incele
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
                    alt="Doktorun diyabet ölçüm cihazı ile hastanın şekerini ölçmesi"
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

          <div className="mt-8 md:mt-10 grid sm:grid-cols-2 gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => handleToolClick('/karbonhidrat-sayaci')}
              className="group text-left rounded-xl border border-white/20 bg-white/10 backdrop-blur p-4 md:p-5 hover:bg-white/20 hover:border-white/30 transition-all shadow"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 text-lg">
                  🍽️
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-600 uppercase tracking-wider text-emerald-200/90">
                    Üyelere özel
                  </span>
                  <h3 className="mt-0.5 text-base font-700 text-white group-hover:text-emerald-50 transition-colors">
                    Akıllı Karbonhidrat Sayacı
                  </h3>
                  <p className="mt-1.5 text-xs text-diapal-100 leading-snug">
                    Yediğin yemeği yaz veya fotoğrafını yükle; tahmini karbonhidrat ve kalori al. Tip 1’de insülin dozunu planlamanda yardımcı.
                  </p>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-500 text-white/90 group-hover:gap-1.5 transition-all">
                    {user ? 'Araca git' : 'Kullanmak için kayıt ol'}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleToolClick('/hba1c-tahminleyici')}
              className="group text-left rounded-xl border border-white/20 bg-white/10 backdrop-blur p-4 md:p-5 hover:bg-white/20 hover:border-white/30 transition-all shadow"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 text-lg">
                  📊
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-600 uppercase tracking-wider text-emerald-200/90">
                    Üyelere özel
                  </span>
                  <h3 className="mt-0.5 text-base font-700 text-white group-hover:text-emerald-50 transition-colors">
                    HbA1c Tahminleyicisi
                  </h3>
                  <p className="mt-1.5 text-xs text-diapal-100 leading-snug">
                    Günlük ölçümlerini gir; 3 aylık ortalama şekere göre tahmini HbA1c değerini gör.
                  </p>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-500 text-white/90 group-hover:gap-1.5 transition-all">
                    {user ? 'Araca git' : 'Kullanmak için kayıt ol'}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
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
              Binlerce hasta ve aile Diapal'da bilgi alıyor, doktorlarla iletişim kuruyor ve forumda birbirine destek oluyor. Hesap oluştur, ücretsiz katıl.
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
            <Link
              to="/kayit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation"
            >
              Ücretsiz Kayıt Ol
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
