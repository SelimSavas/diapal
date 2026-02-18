import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getTopics,
  getReplyCount,
  getTopicLikeCount,
  isTopicLikedBy,
  toggleTopicLike,
  sortTopics,
  searchTopics,
  FORUM_CATEGORIES,
  formatRelativeDate,
  type ForumTopic,
  type ForumSort,
} from '../lib/forum'

const ALL_CATEGORIES = ['Tümü', ...FORUM_CATEGORIES]
const SORT_OPTIONS: { value: ForumSort; label: string }[] = [
  { value: 'newest', label: 'En yeni' },
  { value: 'replies', label: 'En çok yanıt' },
  { value: 'likes', label: 'En çok beğenilen' },
]

export default function Forum() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [sort, setSort] = useState<ForumSort>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [topics] = useState<ForumTopic[]>(() => getTopics())
  const [, setLikeVersion] = useState(0)

  const filteredTopics = useMemo(() => {
    let list = selectedCategory === 'Tümü' ? topics : topics.filter((t) => t.category === selectedCategory)
    list = searchTopics(list, searchQuery)
    return sortTopics(list, sort)
  }, [topics, selectedCategory, sort, searchQuery])

  const handleNewTopic = () => {
    if (user) navigate('/forum/yeni')
    else navigate('/kayit')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
            Forum
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Deneyimlerini paylaş, sorularını sor. Topluluk burada.
          </p>
        </div>
        <button
          type="button"
          onClick={handleNewTopic}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation"
        >
          Yeni konu aç
        </button>
      </div>

      <div className="mb-4">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Konu veya yazar ara..."
          className="w-full max-w-md rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-diapal-500 focus:ring-2 focus:ring-diapal-100 outline-none"
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-500 transition-colors touch-manipulation ${
                selectedCategory === cat
                  ? 'bg-diapal-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-diapal-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 shrink-0">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSort(opt.value)}
              className={`px-3 py-2 rounded-lg text-sm font-500 ${
                sort === opt.value ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {filteredTopics.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Bu kategoride henüz konu yok. İlk konuyu sen aç!
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const replyCount = getReplyCount(topic.id)
              const likeCount = getTopicLikeCount(topic.id)
              const liked = user ? isTopicLikedBy(topic.id, user.id) : false
              return (
                <div key={topic.id} className="flex items-center gap-2 p-4 sm:p-5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <Link to={`/forum/${topic.id}`} className="block">
                      <h2 className="font-600 text-slate-900 hover:text-diapal-700">{topic.title}</h2>
                      <p className="text-sm text-slate-500 mt-1">
                        {topic.authorName} · {topic.category} · {formatRelativeDate(topic.createdAt)}
                      </p>
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 shrink-0">
                    <span>{replyCount} yanıt</span>
                    {user ? (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); toggleTopicLike(topic.id, user.id); setLikeVersion((v) => v + 1) }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${liked ? 'text-rose-600 bg-rose-50' : 'hover:bg-slate-100'}`}
                      >
                        <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                        {likeCount > 0 && <span>{likeCount}</span>}
                      </button>
                    ) : (
                      <span className="flex items-center gap-1">{likeCount > 0 && <span>{likeCount} beğeni</span>}</span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
