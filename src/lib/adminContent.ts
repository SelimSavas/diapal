import { supabase } from './supabaseClient'
import type { ArticleCategory } from './articles'
import type { RecipeCategory } from './recipes'

export type AdminArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: ArticleCategory
  content: string
  date: string
  readMinutes: number
}

export type AdminNewsItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  date: string
  type: 'haber' | 'duyuru'
  image: string
}

export type AdminRecipe = {
  id: string
  name: string
  category: RecipeCategory
  shortDesc: string
  tags: string[]
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ---- Makaleler
export async function getAdminArticles(): Promise<AdminArticle[]> {
  const { data, error } = await supabase
    .from('admin_articles')
    .select('id, slug, title, excerpt, category, content, date, read_minutes')
    .order('date', { ascending: false })
  if (error) return []
  return (data ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? '',
    category: r.category as ArticleCategory,
    content: r.content,
    date: r.date,
    readMinutes: r.read_minutes ?? 5,
  }))
}

export async function getAdminArticleById(id: string): Promise<AdminArticle | null> {
  const { data, error } = await supabase
    .from('admin_articles')
    .select('id, slug, title, excerpt, category, content, date, read_minutes')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return null
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt ?? '',
    category: data.category as ArticleCategory,
    content: data.content,
    date: data.date,
    readMinutes: data.read_minutes ?? 5,
  }
}

export async function addAdminArticle(
  input: Omit<AdminArticle, 'id' | 'slug'>
): Promise<AdminArticle> {
  const id = `adm_${Date.now()}`
  const slug = `${slugify(input.title)}-${id.slice(-6)}`
  const { error } = await supabase.from('admin_articles').insert({
    id,
    slug,
    title: input.title,
    excerpt: input.excerpt || null,
    category: input.category,
    content: input.content,
    date: input.date,
    read_minutes: input.readMinutes ?? 5,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
  return { ...input, id, slug, readMinutes: input.readMinutes ?? 5 }
}

export async function updateAdminArticle(
  id: string,
  input: Partial<Omit<AdminArticle, 'id'>>
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.title != null) payload.title = input.title
  if (input.excerpt != null) payload.excerpt = input.excerpt
  if (input.category != null) payload.category = input.category
  if (input.content != null) payload.content = input.content
  if (input.date != null) payload.date = input.date
  if (input.readMinutes != null) payload.read_minutes = input.readMinutes
  if (input.slug != null) payload.slug = input.slug
  const { error } = await supabase.from('admin_articles').update(payload).eq('id', id)
  if (error) throw error
}

export async function deleteAdminArticle(id: string): Promise<void> {
  const { error } = await supabase.from('admin_articles').delete().eq('id', id)
  if (error) throw error
}

// ---- Haberler / Duyurular
export async function getAdminNews(): Promise<AdminNewsItem[]> {
  const { data, error } = await supabase
    .from('admin_news')
    .select('id, slug, title, excerpt, body, date, type, image')
    .order('date', { ascending: false })
  if (error) return []
  return (data ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? '',
    body: r.body,
    date: r.date,
    type: r.type as 'haber' | 'duyuru',
    image: r.image ?? '',
  }))
}

export async function addAdminNews(
  input: Omit<AdminNewsItem, 'id' | 'slug'>
): Promise<AdminNewsItem> {
  const id = `nw_${Date.now()}`
  const slug = `${slugify(input.title)}-${id.slice(-6)}`
  const { error } = await supabase.from('admin_news').insert({
    id,
    slug,
    title: input.title,
    excerpt: input.excerpt || null,
    body: input.body,
    date: input.date,
    type: input.type,
    image: input.image || null,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
  return { ...input, id, slug }
}

export async function updateAdminNews(
  id: string,
  input: Partial<Omit<AdminNewsItem, 'id'>>
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.title != null) payload.title = input.title
  if (input.excerpt != null) payload.excerpt = input.excerpt
  if (input.body != null) payload.body = input.body
  if (input.date != null) payload.date = input.date
  if (input.type != null) payload.type = input.type
  if (input.image != null) payload.image = input.image
  if (input.slug != null) payload.slug = input.slug
  const { error } = await supabase.from('admin_news').update(payload).eq('id', id)
  if (error) throw error
}

export async function deleteAdminNews(id: string): Promise<void> {
  const { error } = await supabase.from('admin_news').delete().eq('id', id)
  if (error) throw error
}

// ---- Yemek tarifleri
export async function getAdminRecipes(): Promise<AdminRecipe[]> {
  const { data, error } = await supabase
    .from('admin_recipes')
    .select('id, name, category, short_desc, tags')
    .order('name')
  if (error) return []
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category as RecipeCategory,
    shortDesc: r.short_desc ?? '',
    tags: Array.isArray(r.tags) ? r.tags : [],
  }))
}

export async function addAdminRecipe(
  input: Omit<AdminRecipe, 'id'>
): Promise<AdminRecipe> {
  const id = `rec_${Date.now()}`
  const { error } = await supabase.from('admin_recipes').insert({
    id,
    name: input.name,
    category: input.category,
    short_desc: input.shortDesc || null,
    tags: input.tags ?? [],
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
  return { ...input, id }
}

export async function updateAdminRecipe(
  id: string,
  input: Partial<Omit<AdminRecipe, 'id'>>
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.name != null) payload.name = input.name
  if (input.category != null) payload.category = input.category
  if (input.shortDesc != null) payload.short_desc = input.shortDesc
  if (input.tags != null) payload.tags = input.tags
  const { error } = await supabase.from('admin_recipes').update(payload).eq('id', id)
  if (error) throw error
}

export async function deleteAdminRecipe(id: string): Promise<void> {
  const { error } = await supabase.from('admin_recipes').delete().eq('id', id)
  if (error) throw error
}

// ---- Site ayarları
export async function getSiteSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('site_settings').select('key, value')
  if (error) return {}
  const out: Record<string, string> = {}
  for (const r of data ?? []) {
    out[r.key] = r.value ?? ''
  }
  return out
}

export async function setSiteSetting(key: string, value: string): Promise<void> {
  await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' })
}
