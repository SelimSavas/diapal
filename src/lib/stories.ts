/**
 * Kullanıcı hikayeleri – localStorage.
 */

export type Story = {
  id: string
  authorId: string
  authorName: string
  title: string
  body: string
  createdAt: string
  isAnonymous: boolean
}

const STORAGE_KEY = 'diapal_stories'

function loadAll(): Story[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(data: Story[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getStories(): Story[] {
  return loadAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function addStory(input: {
  authorId: string
  authorName: string
  title: string
  body: string
  isAnonymous: boolean
}): Story {
  const all = loadAll()
  const s: Story = {
    id: crypto.randomUUID(),
    authorId: input.authorId,
    authorName: input.isAnonymous ? 'Anonim' : input.authorName,
    title: input.title.trim(),
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    isAnonymous: input.isAnonymous,
  }
  all.push(s)
  saveAll(all)
  return s
}

export function getStoryById(id: string): Story | null {
  return loadAll().find((s) => s.id === id) ?? null
}

/** Öne çıkan / ayın motivasyonu – en son eklenen hikaye. */
export function getFeaturedStory(): Story | null {
  const all = getStories()
  return all.length > 0 ? all[0] : null
}
