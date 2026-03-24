import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  IconApple,
  IconChartBar,
  IconCheckCircle,
  IconClipboard,
  IconPill,
  IconSparkles,
} from '../components/UiIcons'

const items: {
  to: string
  label: string
  description: string
  Icon: ComponentType<{ className?: string }>
  gradient: string
}[] = [
  {
    to: '/karbonhidrat-sayaci',
    label: 'KH Sayacı',
    description: 'Yediğiniz yemeklerin karbonhidrat değerini hesaplayın. Tip 1\'de insülin dozunu planlamanıza yardımcı olur.',
    Icon: IconApple,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    to: '/hba1c-tahminleyici',
    label: 'HbA1c Tahminleyicisi',
    description: 'Günlük ölçümlerinize göre tahmini HbA1c değerinizi görün. 3 aylık kan şekeri ortalaması.',
    Icon: IconChartBar,
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    to: '/olcum-gunlugu',
    label: 'Ölçüm Günlüğü',
    description: 'Kan şekeri ölçümlerinizi kaydedin, takip edin. Zaman içinde trendleri gözlemleyin.',
    Icon: IconClipboard,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    to: '/ilac-hatirlatici',
    label: 'İlaç Hatırlatıcı',
    description: 'İlaç ve insülin dozlarınızı unutmayın. Kişiselleştirilmiş hatırlatmalar.',
    Icon: IconPill,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    to: '/gunluk-gorevler',
    label: 'Günlük Görevler',
    description: 'Her gün küçük hedeflerle ilerleyin. Su, yürüyüş, beslenme ve rozetler.',
    Icon: IconCheckCircle,
    gradient: 'from-diapal-500 to-emerald-600',
  },
  {
    to: '/meydan-okumalar',
    label: 'Meydan Okumalar',
    description: 'Uzun vadeli meydan okumalara katılın, puan toplayın ve rozetler kazanın.',
    Icon: IconSparkles,
    gradient: 'from-rose-500 to-pink-600',
  },
]

export default function Araclar() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-br from-diapal-700 via-diapal-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-diapal-100 text-sm font-600 uppercase tracking-wider mb-2">Menü tanıtımı</p>
          <h1 className="text-3xl md:text-4xl font-800 tracking-tight">Araçlar</h1>
          <p className="mt-4 text-diapal-50 text-lg max-w-2xl">
            Günlük diyabet yönetiminizi kolaylaştıran uygulamalar: karbonhidrat sayacı, HbA1c tahmini, ölçüm günlüğü, ilaç hatırlatıcı, günlük görevler ve meydan okumalar.
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
                  Kullan
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
