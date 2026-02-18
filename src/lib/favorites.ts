export type FavoriteType = 'article' | 'recipe' | 'doctor'

export type FavoriteItem = { type: FavoriteType; id: string }

const STORAGE_KEY = 'diapal_favorites'

function getKey(userId: string): string {
  return `${STORAGE_KEY}_${userId}`
}

function load(userId: string): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(getKey(userId))
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function save(userId: string, items: FavoriteItem[]): void {
  localStorage.setItem(getKey(userId), JSON.stringify(items))
}

export function getFavorites(userId: string): FavoriteItem[] {
  return load(userId)
}

export function isFavorite(userId: string, type: FavoriteType, id: string): boolean {
  return load(userId).some((f) => f.type === type && f.id === id)
}

export function toggleFavorite(userId: string, type: FavoriteType, id: string): boolean {
  const items = load(userId)
  const idx = items.findIndex((f) => f.type === type && f.id === id)
  if (idx >= 0) {
    items.splice(idx, 1)
    save(userId, items)
    return false
  }
  items.push({ type, id })
  save(userId, items)
  return true
}

export function addFavorite(userId: string, type: FavoriteType, id: string): void {
  if (isFavorite(userId, type, id)) return
  const items = load(userId)
  items.push({ type, id })
  save(userId, items)
}

export function removeFavorite(userId: string, type: FavoriteType, id: string): void {
  const items = load(userId).filter((f) => !(f.type === type && f.id === id))
  save(userId, items)
}
