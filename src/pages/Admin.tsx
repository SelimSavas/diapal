import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getFeedbackList } from '../lib/feedback'
import { getTopics, getRepliesForTopic, deleteTopic, deleteReply, formatRelativeDate } from '../lib/forum'
import { getAllArticles, addAdminArticle, ARTICLE_CATEGORIES, type ArticleCategory } from '../lib/articles'
import { getNews, addAdminNews } from '../lib/news'

type Tab = 'makaleler' | 'haberler' | 'forum' | 'geri-bildirim'

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('makaleler')
  const [feedbackList, setFeedbackList] = useState(() => getFeedbackList())
  const [topics, setTopics] = useState(() => getTopics())

  useEffect(() => {
    if (!user) {
      navigate('/giris', { replace: true })
      return
    }
    if (user.role !== 'admin') {
      navigate('/', { replace: true })
      return
    }
  }, [user, navigate])

  useEffect(() => {
    if (user?.role === 'admin') {
      setFeedbackList(getFeedbackList())
      setTopics(getTopics())
    }
  }, [user?.role, tab])

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Yetkiniz yok veya giriş yapılıyor...
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h1 className="text-3xl font-800 text-slate-900 mb-2">Yönetim paneli</h1>
      <p className="text-slate-600 mb-8">Makale ve haber ekleme, forum moderasyonu, geri bildirimler.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {(['makaleler', 'haberler', 'forum', 'geri-bildirim'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-500 ${
              tab === t ? 'bg-diapal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t === 'makaleler' && 'Makaleler'}
            {t === 'haberler' && 'Haberler'}
            {t === 'forum' && 'Forum'}
            {t === 'geri-bildirim' && 'Geri bildirimler'}
          </button>
        ))}
      </div>

      {tab === 'makaleler' && (
        <AdminMakaleler
          articles={getAllArticles()}
          onAdd={() => setTab('makaleler')}
        />
      )}
      {tab === 'haberler' && (
        <AdminHaberler
          news={getNews()}
          onAdd={() => setTab('haberler')}
        />
      )}
      {tab === 'forum' && (
        <AdminForum
          topics={topics}
          onUpdate={() => setTopics(getTopics())}
        />
      )}
      {tab === 'geri-bildirim' && (
        <div className="space-y-4">
          {feedbackList.length === 0 ? (
            <p className="text-slate-500">Henüz geri bildirim yok.</p>
          ) : (
            feedbackList.map((fb) => (
              <div key={fb.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-600 text-diapal-600">
                    {fb.type === 'sorun' ? 'Sorun' : 'Öneri'} · {new Date(fb.createdAt).toLocaleString('tr-TR')}
                  </span>
                </div>
                {fb.subject && <p className="font-600 text-slate-900 mt-1">{fb.subject}</p>}
                <p className="text-slate-600 text-sm mt-1">{fb.message}</p>
                {fb.email && <p className="text-slate-500 text-xs mt-2">E-posta: {fb.email}</p>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function AdminMakaleler({ articles }: { articles: ReturnType<typeof getAllArticles>; onAdd?: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState<ArticleCategory>('beslenme')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [readMinutes, setReadMinutes] = useState(5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addAdminArticle({ title, excerpt, category, content, date, readMinutes })
    setTitle('')
    setExcerpt('')
    setContent('')
    setShowForm(false)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 rounded-xl bg-diapal-600 text-white text-sm font-600 hover:bg-diapal-700"
      >
        {showForm ? 'Formu kapat' : '+ Yeni makale'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlık" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
          <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Özet" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
          <select value={category} onChange={(e) => setCategory(e.target.value as ArticleCategory)} className="px-4 py-2 rounded-lg border border-slate-200">
            {ARTICLE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-4 py-2 rounded-lg border border-slate-200" />
          <input type="number" min={1} value={readMinutes} onChange={(e) => setReadMinutes(Number(e.target.value))} placeholder="Okuma dk" className="px-4 py-2 rounded-lg border border-slate-200 w-24" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="İçerik (metin)" rows={6} className="w-full px-4 py-2 rounded-lg border border-slate-200 resize-none" />
          <button type="submit" className="px-4 py-2 rounded-xl bg-diapal-600 text-white font-600">Kaydet</button>
        </form>
      )}
      <ul className="space-y-2">
        {articles.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
            <Link to={`/makaleler/${a.slug}`} className="text-diapal-600 hover:underline font-500">{a.title}</Link>
            <span className="text-slate-500 text-sm">{a.date}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AdminHaberler({ news }: { news: ReturnType<typeof getNews>; onAdd?: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [type, setType] = useState<'haber' | 'duyuru'>('duyuru')
  const [image, setImage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addAdminNews({ title, excerpt, body, date, type, image: image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=340&fit=crop' })
    setTitle('')
    setExcerpt('')
    setBody('')
    setShowForm(false)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 rounded-xl bg-diapal-600 text-white text-sm font-600 hover:bg-diapal-700"
      >
        {showForm ? 'Formu kapat' : '+ Yeni haber/duyuru'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlık" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
          <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Özet" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
          <select value={type} onChange={(e) => setType(e.target.value as 'haber' | 'duyuru')} className="px-4 py-2 rounded-lg border border-slate-200">
            <option value="haber">Haber</option>
            <option value="duyuru">Duyuru</option>
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-4 py-2 rounded-lg border border-slate-200" />
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Görsel URL (isteğe bağlı)" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="İçerik" rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 resize-none" />
          <button type="submit" className="px-4 py-2 rounded-xl bg-diapal-600 text-white font-600">Kaydet</button>
        </form>
      )}
      <ul className="space-y-2">
        {news.map((n) => (
          <li key={n.id} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
            <Link to={`/haberler-duyurular/${n.slug}`} className="text-diapal-600 hover:underline font-500">{n.title}</Link>
            <span className="text-slate-500 text-sm">{n.date} · {n.type}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AdminForum({ topics, onUpdate }: { topics: ReturnType<typeof getTopics>; onUpdate: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleDeleteTopic = (id: string) => {
    if (confirm('Bu konuyu ve tüm yanıtları silmek istediğinize emin misiniz?')) {
      deleteTopic(id)
      onUpdate()
      setExpandedId(null)
    }
  }

  const handleDeleteReply = (replyId: string) => {
    if (confirm('Bu yanıtı silmek istiyor musunuz?')) {
      deleteReply(replyId)
      onUpdate()
    }
  }

  return (
    <div className="space-y-4">
      {topics.map((t) => (
        <div key={t.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-600 text-slate-900">{t.title}</p>
              <p className="text-sm text-slate-500">{t.authorName} · {t.category} · {formatRelativeDate(t.createdAt)}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-500"
              >
                {expandedId === t.id ? 'Yanıtları gizle' : 'Yanıtlar'}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTopic(t.id)}
                className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-sm font-500 hover:bg-rose-200"
              >
                Konuyu sil
              </button>
            </div>
          </div>
          {expandedId === t.id && (
            <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-2">
              {getRepliesForTopic(t.id).map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-white border border-slate-100">
                  <p className="text-sm text-slate-700 flex-1">{r.body.slice(0, 80)}{r.body.length > 80 ? '…' : ''}</p>
                  <span className="text-xs text-slate-500">{r.authorName}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteReply(r.id)}
                    className="text-rose-600 text-sm font-500 hover:underline"
                  >
                    Sil
                  </button>
                </div>
              ))}
              {getRepliesForTopic(t.id).length === 0 && <p className="text-slate-500 text-sm">Yanıt yok.</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
