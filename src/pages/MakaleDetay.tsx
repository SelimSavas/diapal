import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getArticleBySlug } from '../lib/articles'
import { ARTICLE_CATEGORIES } from '../lib/articles'
import { isFavorite, toggleFavorite } from '../lib/favorites'

export default function MakaleDetay() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const article = slug ? getArticleBySlug(slug) : null
  const [isFav, setIsFav] = useState(() => (user && article ? isFavorite(user.id, 'article', article.id) : false))

  const handleToggleFav = () => {
    if (!user || !article) return
    const next = toggleFavorite(user.id, 'article', article.id)
    setIsFav(next)
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-600">Makale bulunamadı.</p>
        <Link to="/makaleler" className="mt-4 inline-block text-diapal-600 font-500 hover:underline">
          Makalelere dön
        </Link>
      </div>
    )
  }

  const categoryLabel = ARTICLE_CATEGORIES.find((c) => c.id === article.category)?.label ?? article.category

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <Link to="/makaleler" className="text-sm text-diapal-600 font-500 hover:underline mb-6 inline-block">
        ← Makalelere dön
      </Link>
      <header className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-600 text-diapal-700 bg-diapal-100 px-2.5 py-1 rounded-lg">
            {categoryLabel}
          </span>
          {user && (
            <button
              type="button"
              onClick={handleToggleFav}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-rose-500"
              aria-label={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            >
              {isFav ? (
                <svg className="w-5 h-5 fill-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              )}
            </button>
          )}
        </div>
        <h1 className="mt-4 text-3xl md:text-4xl font-800 text-slate-900 tracking-tight">
          {article.title}
        </h1>
        <p className="mt-2 text-slate-500 text-sm">
          {new Date(article.date).toLocaleDateString('tr-TR')} · {article.readMinutes} dk okuma
        </p>
      </header>
      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
        {article.content.split('\n\n').map((para, i) => {
          if (para.startsWith('**') && para.endsWith('**')) {
            return <h2 key={i} className="text-lg font-700 text-slate-900 mt-6 mb-2">{para.slice(2, -2)}</h2>
          }
          return <p key={i} className="mb-4">{para}</p>
        })}
      </div>
      <p className="mt-10 pt-6 border-t border-slate-200 text-sm text-slate-500">
        Bu metin bilgilendirme amaçlıdır. Tedavi ve beslenme kararları için mutlaka hekiminize veya diyetisyeninize danışın.
      </p>
      <p className="mt-4">
        <Link to="/makaleler" className="text-diapal-600 font-500 hover:underline">← Makalelere dön</Link>
      </p>
    </article>
  )
}
