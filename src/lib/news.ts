/**
 * Haberler ve Duyurular – statik seed veri.
 */

export type NewsItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  date: string
  type: 'haber' | 'duyuru'
  image: string
}

const NEWS: NewsItem[] = [
  {
    id: '1',
    slug: 'diapal-yeni-donem',
    title: 'Diapal yeni dönemde sizinle',
    excerpt: 'Platformumuzdaki güncellemeler ve yeni özellikler hakkında bilgi edinin.',
    date: '2025-02-15',
    type: 'haber',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=340&fit=crop',
    body: `Diapal olarak diyabetle yaşayanların yanında olmaya devam ediyoruz. Bu dönemde ölçüm günlüğü, ilaç hatırlatıcı, makaleler ve hikayeler bölümlerini hizmetinize sunduk.

**Yakında**
Daha iyi bir deneyim için geri bildirimlerinizi bekliyoruz. İletişim sayfasından bize ulaşabilirsiniz.

*Bu metin bilgilendirme amaçlıdır; tıbbi karar için hekiminize danışın.*`,
  },
  {
    id: '2',
    slug: 'gunluk-gorevler-sol-panel',
    title: 'Günlük görevler artık her sayfada',
    excerpt: 'Günlük görevlere sol alttaki panelden tüm sayfalardan ulaşabilirsiniz.',
    date: '2025-02-14',
    type: 'duyuru',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=340&fit=crop',
    body: `Günlük meydan okumalarınızı (su, yürüyüş, sebze vb.) takip etmek artık daha kolay. Sitede sol alt köşedeki "Günlük Görevler" panelini açarak ilerlemenizi görebilir ve görevleri işaretleyebilirsiniz.

Tam sayfa ve rozetler için Günlük Görevler sayfasını da kullanmaya devam edebilirsiniz.`,
  },
  {
    id: '3',
    slug: 'forum-kurallari',
    title: 'Forum kullanım kuralları güncellendi',
    excerpt: 'Topluluk forumunda saygılı ve güvenli bir ortam için kurallarımızı gözden geçirin.',
    date: '2025-02-10',
    type: 'duyuru',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=340&fit=crop',
    body: `Forumumuzda herkesin kendini rahat hissetmesi için kullanım şartları ve forum kurallarını güncelledik. Lütfen paylaşımlarınızda saygılı dil kullanın; tıbbi tavsiye yerine deneyimlerinizi paylaşın.

Sorularınız için SSS veya iletişim sayfamızdan bize ulaşabilirsiniz.`,
  },
  {
    id: '4',
    slug: 'haberler-sayfasi-acildi',
    title: 'Haberler ve Duyurular sayfası açıldı',
    excerpt: 'Platform haberleri ve duyuruları artık tek bir sayfada.',
    date: '2025-02-17',
    type: 'duyuru',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=340&fit=crop',
    body: `Diapal haberleri ve resmi duyuruları artık "Haberler ve Duyurular" sayfasından takip edebilirsiniz. Yeni duyurular burada yayımlanacaktır.`,
  },
]

const ADMIN_NEWS_KEY = 'diapal_admin_news'

function loadAdminNews(): NewsItem[] {
  try {
    const raw = localStorage.getItem(ADMIN_NEWS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveAdminNews(items: NewsItem[]) {
  localStorage.setItem(ADMIN_NEWS_KEY, JSON.stringify(items))
}

const allNews = (): NewsItem[] => [...NEWS, ...loadAdminNews()]

export function getNews(): NewsItem[] {
  return allNews().sort((a, b) => b.date.localeCompare(a.date))
}

export function getNewsBySlug(slug: string): NewsItem | null {
  return allNews().find((n) => n.slug === slug) ?? null
}

export function getNewsById(id: string): NewsItem | null {
  return allNews().find((n) => n.id === id) ?? null
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

export function addAdminNews(data: Omit<NewsItem, 'id' | 'slug'>): NewsItem {
  const list = loadAdminNews()
  const slug = slugify(data.title)
  const id = `nw_${Date.now()}`
  const item: NewsItem = { ...data, id, slug: `${slug}-${id.slice(-6)}` }
  list.push(item)
  saveAdminNews(list)
  return item
}

/** Statik + Supabase admin haber/duyuru (public sayfalar için). */
export async function getNewsAsync(): Promise<NewsItem[]> {
  const { getAdminNews } = await import('./adminContent')
  const admin = await getAdminNews()
  const combined: NewsItem[] = [...NEWS, ...admin]
  return combined.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getNewsBySlugAsync(slug: string): Promise<NewsItem | null> {
  const all = await getNewsAsync()
  return all.find((n) => n.slug === slug) ?? null
}
