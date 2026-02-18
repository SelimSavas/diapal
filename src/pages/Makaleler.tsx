import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getAllArticles,
  getArticlesByCategory,
  ARTICLE_CATEGORIES,
  type ArticleCategory,
} from '../lib/articles'
import { isFavorite, toggleFavorite } from '../lib/favorites'

export default function Makaleler() {
  const { user } = useAuth()
  const [category, setCategory] = useState<ArticleCategory | 'all'>('all')
  const [, setFavVersion] = useState(0)
  const articles = category === 'all' ? getAllArticles() : getArticlesByCategory(category)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          Makaleler
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Diyabet, beslenme, egzersiz ve günlük yaşam hakkında bilgilendirici yazılar. İçerikler genel bilgi amaçlıdır; tedavi için hekiminize danışın.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-500 transition-colors touch-manipulation ${
            category === 'all' ? 'bg-diapal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tümü
        </button>
        {ARTICLE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-500 transition-colors touch-manipulation ${
              category === c.id ? 'bg-diapal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => {
          const isFav = user ? isFavorite(user.id, 'article', a.id) : false
          return (
            <div
              key={a.id}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-diapal-200 hover:shadow-md transition-all"
            >
              {user && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); toggleFavorite(user.id, 'article', a.id); setFavVersion((v) => v + 1) }}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-rose-500"
                  aria-label={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                >
                  {isFav ? (
                    <svg className="w-5 h-5 fill-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  )}
                </button>
              )}
              <Link to={`/makaleler/${a.slug}`} className="block">
                <span className="text-xs font-600 text-diapal-700 bg-diapal-100 px-2.5 py-1 rounded-lg">
                  {ARTICLE_CATEGORIES.find((c) => c.id === a.category)?.label ?? a.category}
                </span>
                <h2 className="mt-3 text-lg font-700 text-slate-900 line-clamp-2">{a.title}</h2>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{a.excerpt}</p>
                <p className="mt-3 text-xs text-slate-500">{a.readMinutes} dk okuma</p>
              </Link>
            </div>
          )
        })}
      </div>

      {articles.length === 0 && (
        <p className="text-center text-slate-500 py-12">Bu kategoride henüz makale yok.</p>
      )}
    </div>
  )
}
