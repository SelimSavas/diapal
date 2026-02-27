import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getRecipesAsync,
  getCategoryLabel,
  searchRecipes,
  type Recipe,
  type RecipeCategory,
} from '../lib/recipes'
import { isFavorite, toggleFavorite } from '../lib/favorites'

const ALL_CATEGORIES: { id: RecipeCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'ara_ogun', label: 'Ara öğün' },
  { id: 'kahvalti', label: 'Kahvaltı' },
  { id: 'ana_yemek', label: 'Ana yemek' },
  { id: 'corba', label: 'Çorba' },
  { id: 'salata', label: 'Salata' },
  { id: 'tatli', label: 'Tatlı' },
  { id: 'icecek', label: 'İçecek' },
]

export default function Tarifler() {
  const { user } = useAuth()
  const [category, setCategory] = useState<RecipeCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [favVersion, setFavVersion] = useState(0)
  useEffect(() => {
    getRecipesAsync().then((list) => {
      setAllRecipes(list)
      setLoading(false)
    })
  }, [])
  const list = useMemo(() => {
    let items: Recipe[] = category === 'all' ? allRecipes : allRecipes.filter((r) => r.category === category)
    if (query.trim()) items = searchRecipes(query.trim(), items)
    return items
  }, [allRecipes, category, query, favVersion])

  const handleToggleFav = (id: string) => {
    if (!user) return
    toggleFavorite(user.id, 'recipe', id)
    setFavVersion((v) => v + 1)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          Diyabet dostu tarifler
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Sağlıklı ara öğün, kahvaltı, ana yemek ve daha fazlası. Tıbbi tavsiye yerine yaşam kalitesini destekleyen fikirler.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tarif veya malzeme ara..."
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-diapal-500 focus:ring-2 focus:ring-diapal-100 outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {ALL_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-500 transition-colors ${
              category === c.id ? 'bg-diapal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-diapal-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-slate-500 py-12">Yükleniyor...</p>
      ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((r) => {
          const isFav = user ? isFavorite(user.id, 'recipe', r.id) : false
          return (
            <div
              key={r.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-600 text-diapal-700 bg-diapal-100 px-2.5 py-1 rounded-lg shrink-0">
                  {getCategoryLabel(r.category)}
                </span>
                {user && (
                  <button
                    type="button"
                    onClick={() => handleToggleFav(r.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-rose-500 transition-colors"
                    aria-label={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                  >
                    {isFav ? (
                      <svg className="w-5 h-5 fill-rose-500 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    )}
                  </button>
                )}
              </div>
              <h2 className="mt-3 text-lg font-700 text-slate-900">{r.name}</h2>
              <p className="mt-2 text-sm text-slate-600 flex-1">{r.shortDesc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      )}
      {!loading && list.length === 0 && (
        <p className="text-center text-slate-500 py-12">Bu kriterlere uygun tarif bulunamadı.</p>
      )}
    </div>
  )
}
