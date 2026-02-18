import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getStories, getFeaturedStory, addStory } from '../lib/stories'
import type { Story } from '../lib/stories'

export default function Hikayeler() {
  const { user } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const featured = getFeaturedStory()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setStories(getStories())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim() || !body.trim()) return
    addStory({
      authorId: user.id,
      authorName: user.name,
      title: title.trim(),
      body: body.trim(),
      isAnonymous,
    })
    setTitle('')
    setBody('')
    setIsAnonymous(false)
    setShowForm(false)
    setSubmitted(true)
    setStories(getStories())
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          Hikayeler
        </h1>
        <p className="mt-2 text-slate-600">
          Diyabetle yaşayanların deneyimleri. Okuyun, ilham alın; istersen siz de anlatın.
        </p>
      </header>

      {featured && (
        <section className="mb-10 rounded-2xl border-2 border-diapal-200 bg-gradient-to-br from-diapal-50 to-white p-6 md:p-8">
          <span className="inline-block rounded-full bg-diapal-600 text-white text-xs font-700 uppercase tracking-wider px-3 py-1 mb-4">
            Ayın motivasyonu
          </span>
          <h2 className="text-xl md:text-2xl font-800 text-slate-900">{featured.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{featured.authorName} · {new Date(featured.createdAt).toLocaleDateString('tr-TR')}</p>
          <p className="mt-4 text-slate-700 leading-relaxed whitespace-pre-wrap">{featured.body}</p>
        </section>
      )}

      {user && (
        <div className="mb-8">
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-5 py-3 rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700"
            >
              Hikayeni paylaş
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-700 text-slate-900 mb-4">Yeni hikaye</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-500 text-slate-700 mb-1">Başlık *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: Tip 1 ile 10 yıl"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-500 text-slate-700 mb-1">Hikayeniz *</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    placeholder="Deneyimlerinizi kısaca paylaşın..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 resize-y"
                    required
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-600">Anonim olarak paylaş</span>
                </label>
                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2.5 rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700">
                    Gönder
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600">
                    İptal
                  </button>
                </div>
              </div>
            </form>
          )}
          {submitted && !showForm && (
            <p className="mt-4 text-sm text-diapal-700 font-500">Hikayeniz eklendi.</p>
          )}
        </div>
      )}

      {!user && (
        <p className="mb-8 text-slate-600 text-sm">
          Hikaye paylaşmak için{' '}
          <Link to="/giris" className="text-diapal-600 font-500 hover:underline">giriş yapın</Link>
          {' '}veya{' '}
          <Link to="/kayit" className="text-diapal-600 font-500 hover:underline">kayıt olun</Link>.
        </p>
      )}

      <div className="space-y-6">
        {stories.length === 0 ? (
          <p className="text-center text-slate-500 py-12">Henüz hikaye paylaşılmadı. İlk hikayeyi siz yazın!</p>
        ) : (
          stories.map((s) => (
            <article
              key={s.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-700 text-slate-900">{s.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{s.authorName} · {new Date(s.createdAt).toLocaleDateString('tr-TR')}</p>
              <p className="mt-4 text-slate-700 whitespace-pre-wrap leading-relaxed">{s.body}</p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
