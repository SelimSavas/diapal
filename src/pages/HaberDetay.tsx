import { useParams, Link } from 'react-router-dom'
import { getNewsBySlug } from '../lib/news'

export default function HaberDetay() {
  const { slug } = useParams<{ slug: string }>()
  const item = slug ? getNewsBySlug(slug) : null

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-600">Haber veya duyuru bulunamadı.</p>
        <Link to="/haberler-duyurular" className="mt-4 inline-block text-diapal-600 font-500 hover:underline">
          Haberler ve Duyurulara dön
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <Link to="/haberler-duyurular" className="text-sm text-diapal-600 font-500 hover:underline mb-6 inline-block">
        ← Haberler ve Duyurulara dön
      </Link>
      <header className="mb-8">
        <span className={`text-xs font-600 px-2.5 py-1 rounded-lg ${
          item.type === 'haber' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-800'
        }`}>
          {item.type === 'haber' ? 'Haber' : 'Duyuru'}
        </span>
        <h1 className="mt-4 text-3xl md:text-4xl font-800 text-slate-900 tracking-tight">
          {item.title}
        </h1>
        <p className="mt-2 text-slate-500 text-sm">
          {new Date(item.date).toLocaleDateString('tr-TR')}
        </p>
      </header>
      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
        {item.body.split('\n\n').map((para, i) => {
          if (para.startsWith('**') && para.endsWith('**')) {
            return <h2 key={i} className="text-lg font-700 text-slate-900 mt-6 mb-2">{para.slice(2, -2)}</h2>
          }
          if (para.startsWith('*') && para.endsWith('*')) {
            return <p key={i} className="mb-4 text-slate-500 italic">{para.slice(1, -1)}</p>
          }
          return <p key={i} className="mb-4">{para}</p>
        })}
      </div>
      <p className="mt-10">
        <Link to="/haberler-duyurular" className="text-diapal-600 font-500 hover:underline">← Haberler ve Duyurulara dön</Link>
      </p>
    </article>
  )
}
