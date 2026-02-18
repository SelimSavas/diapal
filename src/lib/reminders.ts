/**
 * İlaç / hatırlatıcı – kullanıcı bazlı, localStorage.
 */

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 Pazar

export type Reminder = {
  id: string
  userId: string
  name: string
  time: string // HH:mm
  days: DayOfWeek[] // boş = her gün
  enabled: boolean
  createdAt: string
}

const STORAGE_KEY = 'diapal_reminders'
const DAY_NAMES: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6]
const DAY_LABELS: Record<DayOfWeek, string> = {
  0: 'Paz',
  1: 'Pzt',
  2: 'Sal',
  3: 'Çar',
  4: 'Per',
  5: 'Cum',
  6: 'Cmt',
}

function loadAll(): Reminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(data: Reminder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getRemindersForUser(userId: string): Reminder[] {
  return loadAll()
    .filter((r) => r.userId === userId)
    .sort((a, b) => a.time.localeCompare(b.time))
}

export function getTodaysReminders(userId: string): Reminder[] {
  const today = new Date().getDay() as DayOfWeek
  return getRemindersForUser(userId).filter(
    (r) => r.enabled && (r.days.length === 0 || r.days.includes(today))
  )
}

export function addReminder(
  userId: string,
  input: { name: string; time: string; days?: DayOfWeek[] }
): Reminder {
  const all = loadAll()
  const r: Reminder = {
    id: crypto.randomUUID(),
    userId,
    name: input.name.trim(),
    time: input.time,
    days: input.days && input.days.length > 0 ? input.days : [],
    enabled: true,
    createdAt: new Date().toISOString(),
  }
  all.push(r)
  saveAll(all)
  return r
}

export function toggleReminder(userId: string, id: string): boolean {
  const all = loadAll()
  const r = all.find((x) => x.userId === userId && x.id === id)
  if (!r) return false
  r.enabled = !r.enabled
  saveAll(all)
  return true
}

export function deleteReminder(userId: string, id: string): boolean {
  const all = loadAll()
  const idx = all.findIndex((r) => r.userId === userId && r.id === id)
  if (idx === -1) return false
  all.splice(idx, 1)
  saveAll(all)
  return true
}

export { DAY_NAMES, DAY_LABELS }
