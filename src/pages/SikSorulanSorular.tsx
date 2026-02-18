import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FAQ_ITEMS } from '../lib/faq'

const byCategory = FAQ_ITEMS.reduce<Record<string, typeof FAQ_ITEMS>>((acc, item) => {
  if (!acc[item.category]) acc[item.category] = []
  acc[item.category].push(item)
  return acc
}, {})

const FAQ_SECTIONS = Object.entries(byCategory).map(([category, items]) => ({ category, items }))

export default function SikSorulanSorular() {
  const [openKey, setOpenKey] = useState<string | null>(null)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900 tracking-tight">
          Sık Sorulan Sorular
        </h1>
        <p className="mt-3 text-slate-600">
          Diapal ve özellikleri hakkında merak ettiklerinizin yanıtları.
        </p>
      </header>

      <div className="space-y-10">
        {FAQ_SECTIONS.map(({ category, items }) => (
          <section key={category}>
            <h2 className="text-lg font-700 text-slate-900 mb-4">{category}</h2>
            <ul className="space-y-2">
              {items.map((item, i) => {
                const key = `${category}-${i}-${item.q.slice(0, 20)}`
                const isOpen = openKey === key
                return (
                  <li key={key} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3 text-sm font-500 text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <span>{item.q}</span>
                      <span className={`shrink-0 text-diapal-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-12 text-center text-slate-500 text-sm">
        Cevabını bulamadın mı?{' '}
        <Link to="/iletisim" className="text-diapal-600 font-500 hover:underline">İletişime geç</Link>
      </p>
    </div>
  )
}
