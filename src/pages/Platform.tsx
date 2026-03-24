import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { IconChatBubble, IconHeart, IconMail, IconUserMd } from '../components/UiIcons'

const items: {
  to: string
  label: string
  description: string
  Icon: ComponentType<{ className?: string }>
  gradient: string
}[] = [
  {
    to: '/doktorlar',
    label: 'Doktor Bul',
    description: 'Diyabet alanında uzman doktorları keşfedin. Branş, şehir ve çevrimiçi randevu seçenekleriyle arayın.',
    Icon: IconUserMd,
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    to: '/forum',
    label: 'Forum',
    description: 'Toplulukla soru sorun, deneyim paylaşın. Kategorilere göre tartışmalara katılın.',
    Icon: IconChatBubble,
    gradient: 'from-diapal-500 to-emerald-600',
  },
  {
    to: '/mesajlar',
    label: 'Mesajlar',
    description: 'Doktorlarınızla veya platform üyeleriyle güvenli mesajlaşma. Randevu ve takip için.',
    Icon: IconMail,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    to: '/favorilerim',
    label: 'Favorilerim',
    description: 'Beğendiğiniz makaleleri, tarifleri ve doktorları tek yerden yönetin.',
    Icon: IconHeart,
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
          {items.map(({ to, label, description, Icon, gradient }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col sm:flex-row gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-diapal-200 transition-all text-left"
            >
              <div
                className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
              >
                <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-700 text-slate-900 group-hover:text-diapal-600 transition-colors">
                  {label}
                </h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{description}</p>
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
