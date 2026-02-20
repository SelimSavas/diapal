import { Link } from 'react-router-dom'

const items = [
  {
    to: '/doktorlar',
    label: 'Doktor Bul',
    description: 'Diyabet alanında uzman doktorları keşfedin. Branş, şehir ve çevrimiçi randevu seçenekleriyle arayın.',
    icon: '👨‍⚕️',
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    to: '/forum',
    label: 'Forum',
    description: 'Toplulukla soru sorun, deneyim paylaşın. Kategorilere göre tartışmalara katılın.',
    icon: '💬',
    gradient: 'from-diapal-500 to-emerald-600',
  },
  {
    to: '/mesajlar',
    label: 'Mesajlar',
    description: 'Doktorlarınızla veya platform üyeleriyle güvenli mesajlaşma. Randevu ve takip için.',
    icon: '✉️',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    to: '/favorilerim',
    label: 'Favorilerim',
    description: 'Beğendiğiniz makaleleri, tarifleri ve doktorları tek yerden yönetin.',
    icon: '❤️',
    gradient: 'from-rose-500 to-pink-600',
  },
]

export default function Platform() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-br from-diapal-600 via-diapal-500 to-sky-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-white/80 text-sm font-600 uppercase tracking-wider mb-2">Menü tanıtımı</p>
          <h1 className="text-3xl md:text-4xl font-800 tracking-tight">Platform</h1>
          <p className="mt-4 text-diapal-50 text-lg max-w-2xl">
            Doktor bulma, forum, mesajlaşma ve favoriler. Diapal’ın topluluk ve iletişim özellikleriyle diyabet yolculuğunuzda yanınızdayız.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex flex-col sm:flex-row gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-diapal-200 transition-all text-left"
            >
              <div
                className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl sm:text-3xl shadow-lg`}
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-700 text-slate-900 group-hover:text-diapal-600 transition-colors">
                  {item.label}
                </h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{item.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-600 text-diapal-600 group-hover:gap-2 transition-all">
                  Git
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
