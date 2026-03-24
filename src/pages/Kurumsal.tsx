import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  IconBuilding,
  IconChatBubble,
  IconDocumentText,
  IconLockClosed,
  IconMail,
  IconQuestionMarkCircle,
} from '../components/UiIcons'

const items: {
  to: string
  label: string
  description: string
  Icon: ComponentType<{ className?: string }>
  gradient: string
}[] = [
  {
    to: '/bilgi',
    label: 'Biz Kimiz?',
    description: 'Diapal’ın misyonu, ekibi ve diyabet alanındaki vizyonu hakkında bilgi edinin.',
    Icon: IconBuilding,
    gradient: 'from-slate-600 to-slate-700',
  },
  {
    to: '/sss',
    label: 'SSS',
    description: 'Sıkça sorulan sorular ve yanıtları. Platform kullanımı ve diyabet hakkında pratik bilgiler.',
    Icon: IconQuestionMarkCircle,
    gradient: 'from-sky-500 to-sky-600',
  },
  {
    to: '/iletisim',
    label: 'Bize Ulaşın',
    description: 'Sorularınız, önerileriniz veya iş birlikleri için iletişim bilgileri ve form.',
    Icon: IconMail,
    gradient: 'from-diapal-500 to-diapal-600',
  },
  {
    to: '/geri-bildirim',
    label: 'Geri bildirim',
    description: 'Deneyiminizi paylaşın. Geri bildirimleriniz platformu geliştirmemize yardımcı olur.',
    Icon: IconChatBubble,
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    to: '/gizlilik',
    label: 'Gizlilik',
    description: 'Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu. KVKK uyumu.',
    Icon: IconLockClosed,
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    to: '/kullanim-sartlari',
    label: 'Kullanım Şartları',
    description: 'Platform kullanım koşulları, sorumluluklar ve kullanıcı hakları.',
    Icon: IconDocumentText,
    gradient: 'from-amber-500 to-amber-600',
  },
]

export default function Kurumsal() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-slate-300 text-sm font-600 uppercase tracking-wider mb-2">Menü tanıtımı</p>
          <h1 className="text-3xl md:text-4xl font-800 tracking-tight">Kurumsal</h1>
          <p className="mt-4 text-slate-300 text-lg max-w-2xl">
            Biz kimiz, nasıl iletişime geçersiniz, gizlilik ve kullanım şartları. Diapal hakkında kurumsal bilgiler tek sayfada.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map(({ to, label, description, Icon, gradient }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col sm:flex-row gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left"
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
                  Oku
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
