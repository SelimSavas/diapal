import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getTopic,
  getRepliesForTopic,
  addReply,
  formatRelativeDate,
  setBestAnswer,
  getReplyLikeCountsForTopic,
  getRepliesLikedByUserForTopic,
  toggleReplyLike,
  isSubscribed,
  toggleSubscription,
} from '../lib/forum'
import { addNotification } from '../lib/notifications'

export default function ForumTopic() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [topic, setTopic] = useState<Awaited<ReturnType<typeof getTopic>>>(undefined)
  const [replies, setReplies] = useState<Awaited<ReturnType<typeof getRepliesForTopic>>>([])
  const [replyLikeCounts, setReplyLikeCounts] = useState<Record<string, number>>({})
  const [repliesLikedByUser, setRepliesLikedByUser] = useState<Set<string>>(new Set())
  const [subscribed, setSubscribed] = useState(false)
  const [replyBody, setReplyBody] = useState('')
  const [loading, setLoading] = useState(!!id)
  const [submitting, setSubmitting] = useState(false)
  const [metaVersion, setMetaVersion] = useState(0)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    const load = async () => {
      const [t, r, likeCounts] = await Promise.all([
        getTopic(id),
        getRepliesForTopic(id),
        getReplyLikeCountsForTopic(id),
      ])
      if (cancelled) return
      setTopic(t)
      setReplies(r)
      setReplyLikeCounts(likeCounts)
      if (user) {
        const [liked, sub] = await Promise.all([
          getRepliesLikedByUserForTopic(user.id, id),
          isSubscribed(id, user.id),
        ])
        if (!cancelled) {
          setRepliesLikedByUser(liked)
          setSubscribed(sub)
        }
      } else {
        setRepliesLikedByUser(new Set())
        setSubscribed(false)
      }
    }
    load().finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id, user?.id, metaVersion])

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !id || !replyBody.trim() || !topic) return
    setSubmitting(true)
    try {
      await addReply({
        topicId: id,
        authorId: user.id,
        authorName: user.name,
        body: replyBody.trim(),
      })
      if (topic.authorId !== user.id) {
        addNotification(
          topic.authorId,
          'forum_reply',
          'Yeni forum yanıtı',
          `${user.name} konunuza yanıt yazdı: "${replyBody.trim().slice(0, 50)}${replyBody.trim().length > 50 ? '…' : ''}"`,
          `/forum/${id}`
        )
      }
      const next = await getRepliesForTopic(id)
      setReplies(next)
      setReplyBody('')
      setMetaVersion((v) => v + 1)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-600">Yükleniyor...</p>
      </div>
    )
  }
  if (!topic) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-600">Konu bulunamadı.</p>
        <Link to="/forum" className="mt-4 inline-block text-diapal-600 font-500 hover:underline">
          Foruma dön
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <Link to="/forum" className="text-sm text-diapal-600 font-500 hover:underline mb-6 inline-block">
        ← Foruma dön
      </Link>

      <article className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-600 text-diapal-700 bg-diapal-100 px-2.5 py-1 rounded-lg">
              {topic.category}
            </span>
            {user && (
              <button
                type="button"
                onClick={async () => { if (id) { await toggleSubscription(id, user.id); setSubscribed(await isSubscribed(id, user.id)); setMetaVersion((v) => v + 1) } }}
                className={`text-sm font-500 px-3 py-1.5 rounded-lg ${subscribed ? 'bg-diapal-100 text-diapal-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {subscribed ? 'Takip ediliyor ✓' : 'Konuyu takip et'}
              </button>
            )}
          </div>
          <h1 className="mt-3 text-xl md:text-2xl font-700 text-slate-900">
            {topic.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {topic.authorName} · {formatRelativeDate(topic.createdAt)}
          </p>
        </div>
        <div className="p-5 md:p-6">
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {topic.body}
          </p>
        </div>
      </article>

      {replies.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-700 text-slate-900 mb-4">
            Yanıtlar ({replies.length})
          </h2>
          <ul className="space-y-4">
            {replies.map((reply) => {
              const bestAnswerId = topic.bestReplyId ?? null
              const isBest = bestAnswerId === reply.id
              const likeCount = replyLikeCounts[reply.id] ?? 0
              const liked = user ? repliesLikedByUser.has(reply.id) : false
              const isTopicAuthor = user?.id === topic.authorId
              return (
                <li
                  key={reply.id}
                  className={`rounded-2xl border p-5 shadow-sm ${isBest ? 'border-diapal-300 bg-diapal-50/50' : 'border-slate-200 bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-600 text-slate-900">{reply.authorName}</p>
                        {isBest && (
                          <span className="text-xs font-600 text-diapal-700 bg-diapal-100 px-2 py-0.5 rounded-lg">
                            En iyi yanıt
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{formatRelativeDate(reply.createdAt)}</p>
                      <p className="mt-3 text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {reply.body}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isTopicAuthor && !isBest && (
                        <button
                          type="button"
                          onClick={async () => { await setBestAnswer(topic.id, reply.id); setMetaVersion((v) => v + 1) }}
                          className="text-xs font-500 text-diapal-600 hover:underline"
                        >
                          En iyi yanıt seç
                        </button>
                      )}
                      {isTopicAuthor && isBest && (
                        <button
                          type="button"
                          onClick={async () => { await setBestAnswer(topic.id, null); setMetaVersion((v) => v + 1) }}
                          className="text-xs font-500 text-slate-500 hover:underline"
                        >
                          Kaldır
                        </button>
                      )}
                      {user && (
                        <button
                          type="button"
                          onClick={async () => { await toggleReplyLike(reply.id, user.id); setMetaVersion((v) => v + 1) }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${liked ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                          <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                          {likeCount > 0 && <span>{likeCount}</span>}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmitReply} className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-700 text-slate-900 mb-4">Yanıt yaz</h2>
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            required
            rows={4}
            placeholder="Düşünceni yaz..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-diapal-500 focus:ring-2 focus:ring-diapal-100 outline-none resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !replyBody.trim()}
            className="mt-4 px-5 py-2.5 rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      ) : (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-slate-600">Yanıt yazmak için giriş yapmalısın.</p>
          <Link to="/kayit" className="mt-4 inline-block rounded-xl bg-diapal-600 px-5 py-2.5 text-white font-600 hover:bg-diapal-700">
            Kayıt ol / Giriş yap
          </Link>
        </div>
      )}
    </div>
  )
}
