import { supabase } from './supabaseClient'

export type ForumTopic = {
  id: string
  title: string
  category: string
  authorId: string
  authorName: string
  body: string
  createdAt: string
}

export type ForumReply = {
  id: string
  topicId: string
  authorId: string
  authorName: string
  body: string
  createdAt: string
}

export async function getTopics(): Promise<ForumTopic[]> {
  const { data, error } = await supabase
    .from('forum_topics')
    .select('id, title, category, author_id, author_name, body, created_at')
    .order('created_at', { ascending: false })
  if (error) {
    console.error(error)
    return []
  }
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    authorId: r.author_id,
    authorName: r.author_name,
    body: r.body,
    createdAt: r.created_at,
  }))
}

export type ForumTopicWithMeta = ForumTopic & { bestReplyId?: string | null }

export async function getTopic(id: string): Promise<ForumTopicWithMeta | undefined> {
  const { data, error } = await supabase
    .from('forum_topics')
    .select('id, title, category, author_id, author_name, body, created_at, best_reply_id')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return undefined
  return {
    id: data.id,
    title: data.title,
    category: data.category,
    authorId: data.author_id,
    authorName: data.author_name,
    body: data.body,
    createdAt: data.created_at,
    bestReplyId: data.best_reply_id ?? undefined,
  }
}

export async function getRepliesForTopic(topicId: string): Promise<ForumReply[]> {
  const { data, error } = await supabase
    .from('forum_replies')
    .select('id, topic_id, author_id, author_name, body, created_at')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true })
  if (error) {
    console.error(error)
    return []
  }
  return (data ?? []).map((r) => ({
    id: r.id,
    topicId: r.topic_id,
    authorId: r.author_id,
    authorName: r.author_name,
    body: r.body,
    createdAt: r.created_at,
  }))
}

export async function getReplyCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('forum_replies').select('topic_id')
  if (error) return {}
  const counts: Record<string, number> = {}
  for (const r of data ?? []) {
    counts[r.topic_id] = (counts[r.topic_id] ?? 0) + 1
  }
  return counts
}

export function getReplyCount(_topicId: string): number {
  return 0
}

export async function addTopic(topic: Omit<ForumTopic, 'id' | 'createdAt'>): Promise<ForumTopic> {
  const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const { error } = await supabase.from('forum_topics').insert({
    id,
    title: topic.title,
    category: topic.category,
    author_id: topic.authorId,
    author_name: topic.authorName,
    body: topic.body,
  })
  if (error) throw error
  return {
    ...topic,
    id,
    createdAt: new Date().toISOString(),
  }
}

export async function addReply(reply: Omit<ForumReply, 'id' | 'createdAt'>): Promise<ForumReply> {
  const id = `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const { error } = await supabase.from('forum_replies').insert({
    id,
    topic_id: reply.topicId,
    author_id: reply.authorId,
    author_name: reply.authorName,
    body: reply.body,
  })
  if (error) throw error
  return {
    ...reply,
    id,
    createdAt: new Date().toISOString(),
  }
}

export async function deleteTopic(topicId: string): Promise<boolean> {
  const { error } = await supabase.from('forum_topics').delete().eq('id', topicId)
  return !error
}

export async function deleteReply(replyId: string): Promise<boolean> {
  const { error } = await supabase.from('forum_replies').delete().eq('id', replyId)
  return !error
}

export const FORUM_CATEGORIES = [
  'Yeni tanı',
  'Beslenme',
  'İlaç & insülin',
  'Günlük yaşam',
  'Teknoloji & cihazlar',
  'Aile & psikoloji',
]

export function formatRelativeDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Az önce'
  if (diffMins < 60) return `${diffMins} dk önce`
  if (diffHours < 24) return `${diffHours} saat önce`
  if (diffDays < 7) return `${diffDays} gün önce`
  return d.toLocaleDateString('tr-TR')
}

// --- Likes, best answer, subscriptions (Supabase)

export async function getTopicLikeCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('forum_topic_likes').select('topic_id')
  if (error) return {}
  const counts: Record<string, number> = {}
  for (const r of data ?? []) {
    counts[r.topic_id] = (counts[r.topic_id] ?? 0) + 1
  }
  return counts
}

export async function getTopicsLikedByUser(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('forum_topic_likes')
    .select('topic_id')
    .eq('user_id', userId)
  if (error) return new Set()
  return new Set((data ?? []).map((r) => r.topic_id))
}

export async function toggleTopicLike(topicId: string, userId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from('forum_topic_likes')
    .select('topic_id')
    .eq('topic_id', topicId)
    .eq('user_id', userId)
    .maybeSingle()
  if (existing) {
    await supabase.from('forum_topic_likes').delete().eq('topic_id', topicId).eq('user_id', userId)
    return false
  }
  await supabase.from('forum_topic_likes').insert({ topic_id: topicId, user_id: userId })
  return true
}

export async function getReplyLikeCountsForTopic(topicId: string): Promise<Record<string, number>> {
  const { data: replies } = await supabase.from('forum_replies').select('id').eq('topic_id', topicId)
  const replyIds = (replies ?? []).map((r) => r.id)
  if (replyIds.length === 0) return {}
  const { data: likes, error } = await supabase.from('forum_reply_likes').select('reply_id').in('reply_id', replyIds)
  if (error) return {}
  const counts: Record<string, number> = {}
  for (const r of likes ?? []) {
    counts[r.reply_id] = (counts[r.reply_id] ?? 0) + 1
  }
  return counts
}

export async function getRepliesLikedByUserForTopic(userId: string, topicId: string): Promise<Set<string>> {
  const { data: replyIds } = await supabase.from('forum_replies').select('id').eq('topic_id', topicId)
  const ids = (replyIds ?? []).map((r) => r.id)
  if (ids.length === 0) return new Set()
  const { data, error } = await supabase
    .from('forum_reply_likes')
    .select('reply_id')
    .eq('user_id', userId)
    .in('reply_id', ids)
  if (error) return new Set()
  return new Set((data ?? []).map((r) => r.reply_id))
}

export async function toggleReplyLike(replyId: string, userId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from('forum_reply_likes')
    .select('reply_id')
    .eq('reply_id', replyId)
    .eq('user_id', userId)
    .maybeSingle()
  if (existing) {
    await supabase.from('forum_reply_likes').delete().eq('reply_id', replyId).eq('user_id', userId)
    return false
  }
  await supabase.from('forum_reply_likes').insert({ reply_id: replyId, user_id: userId })
  return true
}

export async function getBestAnswerReplyId(topicId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('forum_topics')
    .select('best_reply_id')
    .eq('id', topicId)
    .maybeSingle()
  if (error || !data?.best_reply_id) return null
  return data.best_reply_id
}

export async function setBestAnswer(topicId: string, replyId: string | null): Promise<void> {
  const payload = replyId ? { best_reply_id: replyId } : { best_reply_id: null }
  await supabase.from('forum_topics').update(payload).eq('id', topicId)
}

export async function isSubscribed(topicId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('forum_topic_subscriptions')
    .select('topic_id')
    .eq('topic_id', topicId)
    .eq('user_id', userId)
    .maybeSingle()
  return !!data
}

export async function toggleSubscription(topicId: string, userId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from('forum_topic_subscriptions')
    .select('topic_id')
    .eq('topic_id', topicId)
    .eq('user_id', userId)
    .maybeSingle()
  if (existing) {
    await supabase.from('forum_topic_subscriptions').delete().eq('topic_id', topicId).eq('user_id', userId)
    return false
  }
  await supabase.from('forum_topic_subscriptions').insert({ topic_id: topicId, user_id: userId })
  return true
}

export type ForumSort = 'newest' | 'replies' | 'likes'

export function sortTopics(
  topics: ForumTopic[],
  sort: ForumSort,
  replyCounts?: Record<string, number>,
  topicLikeCounts?: Record<string, number>
): ForumTopic[] {
  const replyCount = (t: ForumTopic) => (replyCounts ? (replyCounts[t.id] ?? 0) : 0)
  const likeCount = (t: ForumTopic) => (topicLikeCounts ? (topicLikeCounts[t.id] ?? 0) : 0)
  if (sort === 'newest') {
    return [...topics].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  if (sort === 'likes') {
    return [...topics].sort((a, b) => likeCount(b) - likeCount(a))
  }
  return [...topics].sort((a, b) => replyCount(b) - replyCount(a))
}

export function searchTopics(topics: ForumTopic[], query: string): ForumTopic[] {
  const q = query.trim().toLowerCase()
  if (!q) return topics
  return topics.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.body.toLowerCase().includes(q) ||
      t.authorName.toLowerCase().includes(q)
  )
}
