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

const TOPICS_KEY = 'diapal_forum_topics'
const REPLIES_KEY = 'diapal_forum_replies'

const SEED_TOPICS: ForumTopic[] = [
  { id: '1', title: 'Tip 2 tanısı yeni aldım, nereden başlamalıyım?', category: 'Yeni tanı', authorId: 'seed1', authorName: 'Ayşe K.', body: 'Merhaba, bir hafta önce Tip 2 tanısı aldım. Beslenme ve ilaç konusunda nereden başlamamı önerirsiniz? Teşekkürler.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', title: 'Diyet listesi paylaşan var mı?', category: 'Beslenme', authorId: 'seed2', authorName: 'Mehmet D.', body: 'Diyabete uygun örnek bir haftalık diyet listesi paylaşabilecek var mı?', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', title: 'Sensör kullananlar deneyimlerini yazabilir mi?', category: 'Teknoloji & cihazlar', authorId: 'seed3', authorName: 'Zeynep A.', body: 'Sürekli glukoz ölçüm sensörü kullanmayı düşünüyorum. Deneyimi olanlar avantaj ve dezavantajları yazar mı?', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '4', title: 'İş yerinde ölçüm ve insülin için öneriler', category: 'Günlük yaşam', authorId: 'seed4', authorName: 'Can Y.', body: 'Ofiste kan şekeri ölçümü ve insülin yapmak zor geliyor. Nasıl organize ettiniz?', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
]

const SEED_REPLIES: ForumReply[] = [
  { id: 'r1', topicId: '1', authorId: 'seed2', authorName: 'Mehmet D.', body: 'Önce bir diyetisyen ve endokrinoloji randevusu al. İlaçları düzenli kullan, ölçümleri kaydet. Bu sitedeki Diyabet Bilgisi bölümü de işine yarar.', createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r2', topicId: '1', authorId: 'seed3', authorName: 'Zeynep A.', body: 'Ben de yeni tanı aldığımda çok panikledim. Zamanla alışıyorsun, kendine iyi bak.', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
]

function loadTopics(): ForumTopic[] {
  try {
    const raw = localStorage.getItem(TOPICS_KEY)
    if (raw) return JSON.parse(raw)
    localStorage.setItem(TOPICS_KEY, JSON.stringify(SEED_TOPICS))
    return SEED_TOPICS
  } catch {
    return SEED_TOPICS
  }
}

function loadReplies(): ForumReply[] {
  try {
    const raw = localStorage.getItem(REPLIES_KEY)
    if (raw) return JSON.parse(raw)
    localStorage.setItem(REPLIES_KEY, JSON.stringify(SEED_REPLIES))
    return SEED_REPLIES
  } catch {
    return SEED_REPLIES
  }
}

export function getTopics(): ForumTopic[] {
  return loadTopics()
}

export function getTopic(id: string): ForumTopic | undefined {
  return loadTopics().find((t) => t.id === id)
}

export function getRepliesForTopic(topicId: string): ForumReply[] {
  return loadReplies().filter((r) => r.topicId === topicId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function getReplyCount(topicId: string): number {
  return loadReplies().filter((r) => r.topicId === topicId).length
}

export function addTopic(topic: Omit<ForumTopic, 'id' | 'createdAt'>): ForumTopic {
  const topics = loadTopics()
  const newTopic: ForumTopic = {
    ...topic,
    id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  }
  topics.unshift(newTopic)
  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics))
  return newTopic
}

export function addReply(reply: Omit<ForumReply, 'id' | 'createdAt'>): ForumReply {
  const replies = loadReplies()
  const newReply: ForumReply = {
    ...reply,
    id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  }
  replies.push(newReply)
  localStorage.setItem(REPLIES_KEY, JSON.stringify(replies))
  return newReply
}

export function deleteTopic(topicId: string): boolean {
  const topics = loadTopics().filter((t) => t.id !== topicId)
  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics))
  const replies = loadReplies().filter((r) => r.topicId !== topicId)
  localStorage.setItem(REPLIES_KEY, JSON.stringify(replies))
  const m = loadMeta()
  delete m.topicLikes[topicId]
  delete m.bestAnswer[topicId]
  delete m.subscriptions[topicId]
  saveMeta(m)
  return true
}

export function deleteReply(replyId: string): boolean {
  const replies = loadReplies().filter((r) => r.id !== replyId)
  localStorage.setItem(REPLIES_KEY, JSON.stringify(replies))
  const m = loadMeta()
  delete m.replyLikes[replyId]
  saveMeta(m)
  return true
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

// --- Likes, best answer, subscriptions (localStorage meta)
const META_KEY = 'diapal_forum_meta'

type ForumMeta = {
  topicLikes: Record<string, string[]>
  replyLikes: Record<string, string[]>
  bestAnswer: Record<string, string>
  subscriptions: Record<string, string[]>
}

function loadMeta(): ForumMeta {
  try {
    const raw = localStorage.getItem(META_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { topicLikes: {}, replyLikes: {}, bestAnswer: {}, subscriptions: {} }
}

function saveMeta(m: ForumMeta): void {
  localStorage.setItem(META_KEY, JSON.stringify(m))
}

export function getTopicLikeCount(topicId: string): number {
  const m = loadMeta()
  return (m.topicLikes[topicId] || []).length
}

export function isTopicLikedBy(topicId: string, userId: string): boolean {
  const m = loadMeta()
  return (m.topicLikes[topicId] || []).includes(userId)
}

export function toggleTopicLike(topicId: string, userId: string): boolean {
  const m = loadMeta()
  const arr = m.topicLikes[topicId] || []
  const idx = arr.indexOf(userId)
  if (idx >= 0) {
    arr.splice(idx, 1)
  } else {
    arr.push(userId)
  }
  m.topicLikes[topicId] = arr
  saveMeta(m)
  return arr.includes(userId)
}

export function getReplyLikeCount(replyId: string): number {
  const m = loadMeta()
  return (m.replyLikes[replyId] || []).length
}

export function isReplyLikedBy(replyId: string, userId: string): boolean {
  const m = loadMeta()
  return (m.replyLikes[replyId] || []).includes(userId)
}

export function toggleReplyLike(replyId: string, userId: string): boolean {
  const m = loadMeta()
  const arr = m.replyLikes[replyId] || []
  const idx = arr.indexOf(userId)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(userId)
  m.replyLikes[replyId] = arr
  saveMeta(m)
  return arr.includes(userId)
}

export function getBestAnswerReplyId(topicId: string): string | null {
  const m = loadMeta()
  return m.bestAnswer[topicId] || null
}

export function setBestAnswer(topicId: string, replyId: string | null): void {
  const m = loadMeta()
  if (replyId) m.bestAnswer[topicId] = replyId
  else delete m.bestAnswer[topicId]
  saveMeta(m)
}

export function isSubscribed(topicId: string, userId: string): boolean {
  const m = loadMeta()
  return (m.subscriptions[topicId] || []).includes(userId)
}

export function toggleSubscription(topicId: string, userId: string): boolean {
  const m = loadMeta()
  const arr = m.subscriptions[topicId] || []
  const idx = arr.indexOf(userId)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(userId)
  m.subscriptions[topicId] = arr
  saveMeta(m)
  return arr.includes(userId)
}

export type ForumSort = 'newest' | 'replies' | 'likes'

export function sortTopics(topics: ForumTopic[], sort: ForumSort): ForumTopic[] {
  const replies = loadReplies()
  const count = (t: ForumTopic) => replies.filter((r) => r.topicId === t.id).length
  if (sort === 'newest') {
    return [...topics].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  if (sort === 'likes') {
    return [...topics].sort((a, b) => getTopicLikeCount(b.id) - getTopicLikeCount(a.id))
  }
  return [...topics].sort((a, b) => count(b) - count(a))
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
