export type FeedbackType = 'sorun' | 'oneri'

export type FeedbackItem = {
  id: string
  type: FeedbackType
  subject: string
  message: string
  email: string
  createdAt: string
}

const KEY = 'diapal_feedback'

function load(): FeedbackItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function save(items: FeedbackItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function addFeedback(type: FeedbackType, subject: string, message: string, email: string): FeedbackItem {
  const items = load()
  const item: FeedbackItem = {
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type,
    subject,
    message,
    email,
    createdAt: new Date().toISOString(),
  }
  items.unshift(item)
  save(items)
  return item
}

export function getFeedbackList(): FeedbackItem[] {
  return load()
}
