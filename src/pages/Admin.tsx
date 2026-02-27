import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getFeedbackList } from '../lib/feedback'
import {
  getTopics,
  getRepliesForTopic,
  deleteTopic,
  deleteReply,
  formatRelativeDate,
  type ForumTopic,
  type ForumReply,
} from '../lib/forum'
import { ARTICLE_CATEGORIES, type ArticleCategory } from '../lib/articles'
import {
  getAdminArticles,
  getAdminNews,
  getAdminRecipes,
  addAdminArticle,
  addAdminNews,
  addAdminRecipe,
  updateAdminArticle,
  updateAdminNews,
  updateAdminRecipe,
  deleteAdminArticle,
  deleteAdminNews,
  deleteAdminRecipe,
  getSiteSettings,
  setSiteSetting,
  type AdminArticle,
  type AdminNewsItem,
  type AdminRecipe,
} from '../lib/adminContent'
import { getCategoryLabel, type RecipeCategory } from '../lib/recipes'

const RECIPE_CATEGORIES: { id: RecipeCategory; label: string }[] = [
  { id: 'ara_ogun', label: 'Ara öğün' },
  { id: 'kahvalti', label: 'Kahvaltı' },
  { id: 'ana_yemek', label: 'Ana yemek' },
  { id: 'corba', label: 'Çorba' },
  { id: 'salata', label: 'Salata' },
  { id: 'tatli', label: 'Tatlı' },
  { id: 'icecek', label: 'İçecek' },
]

type Tab = 'makaleler' | 'haberler' | 'tarifler' | 'forum' | 'geri-bildirim' | 'site'

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('makaleler')
  const [feedbackList, setFeedbackList] = useState(() => getFeedbackList())
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [topicsLoading, setTopicsLoading] = useState(false)

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

  const loadForum = useCallback(() => {
    setTopicsLoading(true)
    getTopics().then((t) => {
      setTopics(t)
      setTopicsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (user?.role === 'admin' && tab === 'forum') {
      loadForum()
    }
    if (tab === 'geri-bildirim') {
      setFeedbackList(getFeedbackList())
    }
  }, [user?.role, tab, loadForum])

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Yetkiniz yok veya giriş yapılıyor...
      </div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'makaleler', label: 'Makaleler' },
    { id: 'haberler', label: 'Haber & Duyuru' },
    { id: 'tarifler', label: 'Yemek Tarifleri' },
    { id: 'forum', label: 'Forum' },
    { id: 'geri-bildirim', label: 'Geri bildirim' },
    { id: 'site', label: 'Site ayarları' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h1 className="text-3xl font-800 text-slate-900 mb-2">Yönetim paneli</h1>
      <p className="text-slate-600 mb-8">
        Haber, duyuru, makale, yemek tarifi ekleyin; forumu ve site ayarlarını yönetin.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-500 ${
              tab === t.id ? 'bg-diapal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'makaleler' && <AdminMakaleler />}
      {tab === 'haberler' && <AdminHaberler />}
      {tab === 'tarifler' && <AdminTarifler />}
      {tab === 'forum' && (
        <AdminForum
          topics={topics}
          loading={topicsLoading}
          onUpdate={loadForum}
        />
      )}
      {tab === 'geri-bildirim' && (
        <div className="space-y-4">
          {feedbackList.length === 0 ? (
            <p className="text-slate-500">Henüz geri bildirim yok.</p>
          ) : (
            feedbackList.map((fb) => (
              <div key={fb.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-600 text-diapal-600">
                  {fb.type === 'sorun' ? 'Sorun' : 'Öneri'} · {new Date(fb.createdAt).toLocaleString('tr-TR')}
                </span>
                {fb.subject && <p className="font-600 text-slate-900 mt-1">{fb.subject}</p>}
                <p className="text-slate-600 text-sm mt-1">{fb.message}</p>
                {fb.email && <p className="text-slate-500 text-xs mt-2">E-posta: {fb.email}</p>}
              </div>
            ))
          )}
        </div>
      )}
      {tab === 'site' && <AdminSiteAyarlari />}
    </div>
  )
}

function AdminMakaleler() {
  const [list, setList] = useState<AdminArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState<ArticleCategory>('beslenme')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [readMinutes, setReadMinutes] = useState(5)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    getAdminArticles().then((data) => {
      setList(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => { load() }, [load])

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setTitle('')
    setExcerpt('')
    setCategory('beslenme')
    setContent('')
    setDate(new Date().toISOString().slice(0, 10))
    setReadMinutes(5)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateAdminArticle(editingId, { title, excerpt, category, content, date, readMinutes })
      } else {
        await addAdminArticle({ title, excerpt, category, content, date, readMinutes })
      }
      resetForm()
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (a: AdminArticle) => {
    setEditingId(a.id)
    setTitle(a.title)
    setExcerpt(a.excerpt)
    setCategory(a.category)
    setContent(a.content)
    setDate(a.date)
    setReadMinutes(a.readMinutes)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu makaleyi silmek istediğinize emin misiniz?')) return
    await deleteAdminArticle(id)
    load()
    if (editingId === id) resetForm()
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => { resetForm(); setShowForm(!showForm) }}
        className="mb-4 px-4 py-2 rounded-xl bg-diapal-600 text-white text-sm font-600 hover:bg-diapal-700"
      >
        {showForm ? 'Formu kapat' : '+ Yeni makale'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
          <h3 className="text-lg font-700 text-slate-900">
            {editingId ? 'Makaleyi düzenle' : 'Yeni makale ekle'}
          </h3>
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
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-diapal-600 text-white font-600 disabled:opacity-60">
              {saving ? 'Kaydediliyor…' : editingId ? 'Güncelle' : 'Kaydet'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-500 hover:bg-slate-50">
                İptal
              </button>
            )}
          </div>
        </form>
      )}
      {loading ? <p className="text-slate-500">Yükleniyor...</p> : (
        <ul className="space-y-2">
          {list.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
              <Link to={`/makaleler/${a.slug}`} className="text-diapal-600 hover:underline font-500">{a.title}</Link>
              <span className="text-slate-500 text-sm">{a.date}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleEdit(a)} className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm font-500 hover:bg-slate-200">Düzenle</button>
                <button type="button" onClick={() => handleDelete(a.id)} className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 text-sm font-500 hover:bg-rose-100">Sil</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && list.length === 0 && <p className="text-slate-500">Henüz admin makalesi yok. Yukarıdan ekleyin.</p>}
    </div>
  )
}

function AdminHaberler() {
  const [list, setList] = useState<AdminNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [type, setType] = useState<'haber' | 'duyuru'>('duyuru')
  const [image, setImage] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    getAdminNews().then((data) => {
      setList(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => { load() }, [load])

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setTitle('')
    setExcerpt('')
    setBody('')
    setDate(new Date().toISOString().slice(0, 10))
    setType('duyuru')
    setImage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      const imageUrl = image.trim() || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=340&fit=crop'
      if (editingId) {
        await updateAdminNews(editingId, { title, excerpt, body, date, type, image: imageUrl })
      } else {
        await addAdminNews({ title, excerpt, body, date, type, image: imageUrl })
      }
      resetForm()
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (n: AdminNewsItem) => {
    setEditingId(n.id)
    setTitle(n.title)
    setExcerpt(n.excerpt)
    setBody(n.body)
    setDate(n.date)
    setType(n.type)
    setImage(n.image)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu haberi/duyuruyu silmek istediğinize emin misiniz?')) return
    await deleteAdminNews(id)
    load()
    if (editingId === id) resetForm()
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => { resetForm(); setShowForm(!showForm) }}
        className="mb-4 px-4 py-2 rounded-xl bg-diapal-600 text-white text-sm font-600 hover:bg-diapal-700"
      >
        {showForm ? 'Formu kapat' : '+ Yeni haber / duyuru'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
          <h3 className="text-lg font-700 text-slate-900">
            {editingId ? 'Haber / duyuruyu düzenle' : 'Yeni haber veya duyuru ekle'}
          </h3>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlık" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
          <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Özet" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
          <select value={type} onChange={(e) => setType(e.target.value as 'haber' | 'duyuru')} className="px-4 py-2 rounded-lg border border-slate-200">
            <option value="haber">Haber</option>
            <option value="duyuru">Duyuru</option>
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-4 py-2 rounded-lg border border-slate-200" />
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Görsel URL (isteğe bağlı)" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="İçerik" rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 resize-none" />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-diapal-600 text-white font-600 disabled:opacity-60">
              {saving ? 'Kaydediliyor…' : editingId ? 'Güncelle' : 'Kaydet'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-500 hover:bg-slate-50">
                İptal
              </button>
            )}
          </div>
        </form>
      )}
      {loading ? <p className="text-slate-500">Yükleniyor...</p> : (
        <ul className="space-y-2">
          {list.map((n) => (
            <li key={n.id} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
              <Link to={`/haberler-duyurular/${n.slug}`} className="text-diapal-600 hover:underline font-500">{n.title}</Link>
              <span className="text-slate-500 text-sm">{n.date} · {n.type}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleEdit(n)} className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm font-500 hover:bg-slate-200">Düzenle</button>
                <button type="button" onClick={() => handleDelete(n.id)} className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 text-sm font-500 hover:bg-rose-100">Sil</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && list.length === 0 && <p className="text-slate-500">Henüz haber/duyuru yok. Yukarıdan ekleyin.</p>}
    </div>
  )
}

function AdminTarifler() {
  const [list, setList] = useState<AdminRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<RecipeCategory>('ara_ogun')
  const [shortDesc, setShortDesc] = useState('')
  const [tagsStr, setTagsStr] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    getAdminRecipes().then((data) => {
      setList(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => { load() }, [load])

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setName('')
    setCategory('ara_ogun')
    setShortDesc('')
    setTagsStr('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const tags = tagsStr.split(/[,\s]+/).filter(Boolean)
    setSaving(true)
    try {
      if (editingId) {
        await updateAdminRecipe(editingId, { name, category, shortDesc, tags })
      } else {
        await addAdminRecipe({ name, category, shortDesc, tags })
      }
      resetForm()
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (r: AdminRecipe) => {
    setEditingId(r.id)
    setName(r.name)
    setCategory(r.category)
    setShortDesc(r.shortDesc)
    setTagsStr(r.tags.join(', '))
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu tarifi silmek istediğinize emin misiniz?')) return
    await deleteAdminRecipe(id)
    load()
    if (editingId === id) resetForm()
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => { resetForm(); setShowForm(!showForm) }}
        className="mb-4 px-4 py-2 rounded-xl bg-diapal-600 text-white text-sm font-600 hover:bg-diapal-700"
      >
        {showForm ? 'Formu kapat' : '+ Yeni yemek tarifi'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
          <h3 className="text-lg font-700 text-slate-900">
            {editingId ? 'Tarifi düzenle' : 'Yeni yemek tarifi ekle'}
          </h3>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Tarif adı" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
          <input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="Kısa açıklama" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
          <select value={category} onChange={(e) => setCategory(e.target.value as RecipeCategory)} className="px-4 py-2 rounded-lg border border-slate-200">
            {RECIPE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="Etiketler (virgül veya boşlukla ayırın)" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-diapal-600 text-white font-600 disabled:opacity-60">
              {saving ? 'Kaydediliyor…' : editingId ? 'Güncelle' : 'Kaydet'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-500 hover:bg-slate-50">
                İptal
              </button>
            )}
          </div>
        </form>
      )}
      {loading ? <p className="text-slate-500">Yükleniyor...</p> : (
        <ul className="space-y-2">
          {list.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
              <span className="font-500 text-slate-900">{r.name}</span>
              <span className="text-slate-500 text-sm">{getCategoryLabel(r.category)}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleEdit(r)} className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm font-500 hover:bg-slate-200">Düzenle</button>
                <button type="button" onClick={() => handleDelete(r.id)} className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 text-sm font-500 hover:bg-rose-100">Sil</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && list.length === 0 && <p className="text-slate-500">Henüz admin tarifi yok. Yukarıdan ekleyin. (Statik tarifler sitede görünmeye devam eder.)</p>}
    </div>
  )
}

function AdminForum({
  topics,
  loading,
  onUpdate,
}: {
  topics: ForumTopic[]
  loading: boolean
  onUpdate: () => void
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replies, setReplies] = useState<Record<string, ForumReply[]>>({})

  const loadReplies = async (topicId: string) => {
    const r = await getRepliesForTopic(topicId)
    setReplies((prev) => ({ ...prev, [topicId]: r }))
  }

  const handleDeleteTopic = async (id: string) => {
    if (!confirm('Bu konuyu ve tüm yanıtları silmek istediğinize emin misiniz?')) return
    await deleteTopic(id)
    onUpdate()
    setExpandedId(null)
  }

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('Bu yanıtı silmek istiyor musunuz?')) return
    await deleteReply(replyId)
    onUpdate()
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-slate-500">Yükleniyor...</p>
      ) : (
        topics.map((t) => (
          <div key={t.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-600 text-slate-900">{t.title}</p>
                <p className="text-sm text-slate-500">{t.authorName} · {t.category} · {formatRelativeDate(t.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setExpandedId(expandedId === t.id ? null : t.id)
                    if (expandedId !== t.id) loadReplies(t.id)
                  }}
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
                {!(replies[t.id]?.length) ? (
                  <p className="text-slate-500 text-sm">Yükleniyor veya yanıt yok.</p>
                ) : (
                  replies[t.id].map((r) => (
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
                  ))
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

function AdminSiteAyarlari() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const keys = ['site_name', 'site_description', 'footer_text', 'logo_url']

  useEffect(() => {
    getSiteSettings().then((data) => {
      setSettings(data)
      setLoading(false)
    })
  }, [])

  const handleSave = async (key: string, value: string) => {
    setSaving(true)
    await setSiteSetting(key, value)
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaving(false)
  }

  const labels: Record<string, string> = {
    site_name: 'Site adı',
    site_description: 'Site açıklaması',
    footer_text: 'Footer metni',
    logo_url: 'Logo URL',
  }

  if (loading) return <p className="text-slate-500">Yükleniyor...</p>

  return (
    <div className="space-y-6 max-w-xl">
      <p className="text-slate-600 text-sm">Site genelinde kullanılabilecek metinler. (Şu an sadece kayıt; ileride header/footer’da gösterebilirsiniz.)</p>
      {keys.map((key) => (
        <div key={key}>
          <label className="block text-sm font-500 text-slate-700 mb-1">{labels[key] ?? key}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={settings[key] ?? ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200"
              placeholder={labels[key]}
            />
            <button
              type="button"
              onClick={() => handleSave(key, settings[key] ?? '')}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-diapal-600 text-white text-sm font-600 disabled:opacity-60"
            >
              Kaydet
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
