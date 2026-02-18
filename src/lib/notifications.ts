/**
 * Bildirim merkezi – kullanıcı bazlı, localStorage.
 */

export type NotificationType = 'forum_reply' | 'hatirlatma' | 'duyuru'

export type Notification = {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  link: string
  read: boolean
  createdAt: string
}

const STORAGE_KEY = 'diapal_notifications'

function loadAll(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(data: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getNotifications(userId: string): Notification[] {
  return loadAll()
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getUnreadCount(userId: string): number {
  return getNotifications(userId).filter((n) => !n.read).length
}

export function addNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  link: string
): Notification {
  const all = loadAll()
  const n: Notification = {
    id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    userId,
    type,
    title,
    body,
    link,
    read: false,
    createdAt: new Date().toISOString(),
  }
  all.push(n)
  saveAll(all)
  return n
}

export function markAsRead(userId: string, id: string): void {
  const all = loadAll()
  const n = all.find((x) => x.userId === userId && x.id === id)
  if (n) n.read = true
  saveAll(all)
}

export function markAllAsRead(userId: string): void {
  const all = loadAll()
  all.forEach((n) => { if (n.userId === userId) n.read = true })
  saveAll(all)
}
