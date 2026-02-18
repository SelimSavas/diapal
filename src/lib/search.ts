/**
 * Site genelinde arama – makale, forum, SSS.
 */

import { getAllArticles } from './articles'
import { getTopics } from './forum'
import { FAQ_ITEMS } from './faq'

export type SearchResultGroup = 'makale' | 'forum' | 'sss'

export type SearchResult = {
  type: SearchResultGroup
  id: string
  title: string
  excerpt: string
  url: string
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ıiİI]/g, 'i')
    .replace(/[ğgĞG]/g, 'g')
    .replace(/[üuÜU]/g, 'u')
    .replace(/[şsŞS]/g, 's')
    .replace(/[çcÇC]/g, 'c')
    .replace(/[öoÖO]/g, 'o')
}

export function searchSite(query: string): SearchResult[] {
  const q = normalize(query.trim())
  if (q.length < 2) return []

  const results: SearchResult[] = []

  const articles = getAllArticles()
  for (const a of articles) {
    if (normalize(a.title).includes(q) || normalize(a.excerpt).includes(q) || normalize(a.content).includes(q)) {
      results.push({
        type: 'makale',
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        url: `/makaleler/${a.slug}`,
      })
    }
  }

  const topics = getTopics()
  for (const t of topics) {
    if (normalize(t.title).includes(q) || normalize(t.body).includes(q)) {
      results.push({
        type: 'forum',
        id: t.id,
        title: t.title,
        excerpt: t.body.slice(0, 120) + (t.body.length > 120 ? '…' : ''),
        url: `/forum/${t.id}`,
      })
    }
  }

  for (let i = 0; i < FAQ_ITEMS.length; i++) {
    const item = FAQ_ITEMS[i]
    if (normalize(item.q).includes(q) || normalize(item.a).includes(q)) {
      results.push({
        type: 'sss',
        id: `sss-${i}`,
        title: item.q,
        excerpt: item.a.slice(0, 120) + (item.a.length > 120 ? '…' : ''),
        url: '/sss',
      })
    }
  }

  return results.slice(0, 15)
}
