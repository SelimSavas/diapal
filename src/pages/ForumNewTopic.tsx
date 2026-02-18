import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addTopic, FORUM_CATEGORIES } from '../lib/forum'

export default function ForumNewTopic() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(FORUM_CATEGORIES[0])
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!user) {
    navigate('/kayit', { replace: true })
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    setSubmitting(true)
    const topic = addTopic({
      title: title.trim(),
      category,
      authorId: user.id,
      authorName: user.name,
      body: body.trim(),
    })
    setSubmitting(false)
    navigate(`/forum/${topic.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <Link to="/forum" className="text-sm text-diapal-600 font-500 hover:underline mb-6 inline-block">
        ← Foruma dön
      </Link>

      <h1 className="text-2xl md:text-3xl font-800 text-slate-900 mb-8">
        Yeni konu aç
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-500 text-slate-700 mb-1.5">
            Başlık
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder="Konunun başlığını yaz"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-diapal-500 focus:ring-2 focus:ring-diapal-100 outline-none"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-500 text-slate-700 mb-1.5">
            Kategori
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-diapal-500 focus:ring-2 focus:ring-diapal-100 outline-none"
          >
            {FORUM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-500 text-slate-700 mb-1.5">
            İçerik
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={6}
            placeholder="Konuyu detaylı yaz..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-diapal-500 focus:ring-2 focus:ring-diapal-100 outline-none resize-y min-h-[120px]"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Açılıyor...' : 'Konuyu aç'}
          </button>
          <Link
            to="/forum"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-500 hover:bg-slate-50 transition-colors"
          >
            İptal
          </Link>
        </div>
      </form>
    </div>
  )
}
