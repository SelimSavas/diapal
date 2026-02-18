import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getFavorites, removeFavorite, type FavoriteItem, type FavoriteType } from '../lib/favorites'
import { RECIPES, getCategoryLabel } from '../lib/recipes'
import { getDoctorById } from '../lib/doctors'
import { getAllArticles } from '../lib/articles'

export default function Favorilerim() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<FavoriteItem[]>([])

  useEffect(() => {
    if (!user) {
      navigate('/giris', { replace: true })
      return
    }
    setItems(getFavorites(user.id))
  }, [user, navigate])

  const handleRemove = (type: FavoriteType, id: string) => {
    if (!user) return
    removeFavorite(user.id, type, id)
    setItems(getFavorites(user.id))
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Giriş yapılıyor...
      </div>
    )
  }

  const articles = getAllArticles()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h1 className="text-3xl font-800 text-slate-900 mb-2">Favorilerim</h1>
      <p className="text-slate-600 mb-8">Kaydettiğin makale, tarif ve doktorlar.</p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center text-slate-600">
          Henüz favori eklemedin. Makaleler, tarifler veya doktor sayfalarından kalp ikonuna tıklayarak ekleyebilirsin.
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link to="/makaleler" className="text-diapal-600 font-500 hover:underline">Makaleler</Link>
            <Link to="/tarifler" className="text-diapal-600 font-500 hover:underline">Tarifler</Link>
            <Link to="/doktorlar" className="text-diapal-600 font-500 hover:underline">Doktor bul</Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((fav) => {
            if (fav.type === 'article') {
              const a = articles.find((x) => x.id === fav.id || x.slug === fav.id)
              if (!a) return null
              return (
                <li key={`article-${fav.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
                  <Link to={`/makaleler/${a.slug}`} className="flex-1 min-w-0">
                    <span className="text-xs font-600 text-sky-600">Makale</span>
                    <p className="font-600 text-slate-900 mt-0.5">{a.title}</p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove('article', fav.id)}
                    className="shrink-0 p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Favorilerden çıkar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </li>
              )
            }
            if (fav.type === 'recipe') {
              const r = RECIPES.find((x) => x.id === fav.id)
              if (!r) return null
              return (
                <li key={`recipe-${fav.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
                  <Link to="/tarifler" className="flex-1 min-w-0">
                    <span className="text-xs font-600 text-diapal-600">Tarif</span>
                    <p className="font-600 text-slate-900 mt-0.5">{r.name}</p>
                    <p className="text-xs text-slate-500">{getCategoryLabel(r.category)}</p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove('recipe', fav.id)}
                    className="shrink-0 p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Favorilerden çıkar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </li>
              )
            }
            if (fav.type === 'doctor') {
              const d = getDoctorById(fav.id)
              if (!d) return null
              return (
                <li key={`doctor-${fav.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
                  <Link to={`/doktorlar/${d.id}`} className="flex-1 min-w-0">
                    <span className="text-xs font-600 text-emerald-600">Doktor</span>
                    <p className="font-600 text-slate-900 mt-0.5">{d.name}</p>
                    <p className="text-xs text-slate-500">{d.branch} · {d.city}</p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove('doctor', fav.id)}
                    className="shrink-0 p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Favorilerden çıkar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </li>
              )
            }
            return null
          })}
        </ul>
      )}
    </div>
  )
}
