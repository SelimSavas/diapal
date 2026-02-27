import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNewsAsync } from '../lib/news'
import type { NewsItem } from '../lib/news'

export default function HaberlerDuyurular() {
  const [filter, setFilter] = useState<'all' | 'haber' | 'duyuru'>('all')
  const [allNews, setAllNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getNewsAsync().then((list) => {
      setAllNews(list)
      setLoading(false)
    })
  }, [])
  const news = useMemo(
    () => allNews.filter((n) => filter === 'all' || n.type === filter),
    [allNews, filter]
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          Haberler ve Duyurular
        </h1>
        <p className="mt-2 text-slate-600">
          Diapal platform haberleri ve resmi duyurular.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-500 transition-colors ${
            filter === 'all' ? 'bg-diapal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tümü
        </button>
        <button
          type="button"
          onClick={() => setFilter('haber')}
          className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-500 transition-colors ${
            filter === 'haber' ? 'bg-diapal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Haberler
        </button>
        <button
          type="button"
          onClick={() => setFilter('duyuru')}
          className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-500 transition-colors ${
            filter === 'duyuru' ? 'bg-diapal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Duyurular
        </button>
      </div>

      {loading ? (
        <p className="text-center text-slate-500 py-12">Yükleniyor...</p>
      ) : (
      <ul className="space-y-6">
        {news.map((item) => (
          <li key={item.id}>
            <Link
              to={`/haberler-duyurular/${item.slug}`}
              className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-diapal-200 hover:shadow-md transition-all"
            >
              <span className={`text-xs font-600 px-2.5 py-1 rounded-lg ${
                item.type === 'haber' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-800'
              }`}>
                {item.type === 'haber' ? 'Haber' : 'Duyuru'}
              </span>
              <h2 className="mt-3 text-xl font-700 text-slate-900">{item.title}</h2>
              <p className="mt-2 text-slate-600 text-sm">{item.excerpt}</p>
              <p className="mt-3 text-xs text-slate-500">{new Date(item.date).toLocaleDateString('tr-TR')}</p>
            </Link>
          </li>
        ))}
      </ul>

      )}
      {!loading && news.length === 0 && (
        <p className="text-center text-slate-500 py-12">Bu kategoride kayıt yok.</p>
      )}
    </div>
  )
}
