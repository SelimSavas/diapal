/**
 * Makale / blog içerikleri – statik seed veri.
 */

export type ArticleCategory = 'beslenme' | 'egzersiz' | 'tip1' | 'tip2' | 'yasam' | 'teknoloji'

export type Article = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: ArticleCategory
  content: string
  date: string
  readMinutes: number
}

export const ARTICLE_CATEGORIES: { id: ArticleCategory; label: string }[] = [
  { id: 'beslenme', label: 'Beslenme' },
  { id: 'egzersiz', label: 'Egzersiz' },
  { id: 'tip1', label: 'Tip 1 Diyabet' },
  { id: 'tip2', label: 'Tip 2 Diyabet' },
  { id: 'yasam', label: 'Günlük Yaşam' },
  { id: 'teknoloji', label: 'Teknoloji' },
]

const ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'diyabette-beslenme-ilkeleri',
    title: 'Diyabette beslenme ilkeleri',
    excerpt: 'Dengeli öğünler, karbonhidrat sayımı ve porsiyon kontrolü hakkında temel bilgiler.',
    category: 'beslenme',
    date: '2025-01-15',
    readMinutes: 5,
    content: `Diyabetle yaşamda beslenme, kan şekeri kontrolünün temel taşlarından biridir. Bu yazıda genel ilkeleri özetliyoruz; kişiye özel plan için mutlaka bir diyetisyen veya hekiminizle çalışın.

**Dengeli öğünler**
Öğünleri atlamamak, gün içinde düzenli aralıklarla yemek kan şekerini daha stabil tutar. Üç ana öğün ve ihtiyaca göre ara öğünler birçok kişide işe yarar.

**Karbonhidrat sayımı**
Karbonhidratlar kan şekerini doğrudan etkiler. Porsiyon ve tür önemlidir. Tam tahıllar, sebzeler ve meyveler lifle birlikte geldiği için glisemik yanıtı yumuşatabilir.

**Porsiyon kontrolü**
Tabak modeli: tabağın yarısı sebze, çeyreği protein, çeyreği karbonhidratlı gıda olabilir. Porsiyon ölçüleri kişiye göre değişir; diyetisyeninizle netleştirin.

**Özet**
Beslenme kişiye özeldir. Bu metin yalnızca bilgilendirme amaçlıdır; tedavi ve diyet planı için hekim ve diyetisyeninize danışın.`,
  },
  {
    id: '2',
    slug: 'egzersiz-ve-kan-sekeri',
    title: 'Egzersiz ve kan şekeri',
    excerpt: 'Düzenli hareketin diyabet kontrolüne etkisi ve dikkat edilmesi gerekenler.',
    category: 'egzersiz',
    date: '2025-01-20',
    readMinutes: 4,
    content: `Düzenli fiziksel aktivite, insülin duyarlılığını artırır ve kan şekeri kontrolüne yardımcı olur. Bu yazıda genel önerileri bulacaksınız; kendi programınızı hekiminizle oluşturun.

**Ne tür egzersiz?**
Yürüyüş, yüzme, bisiklet, hafif kuvvet antrenmanı birçok kişi için uygundur. Süre ve yoğunluk sağlık durumunuza göre ayarlanmalıdır.

**Öncesi ve sonrası**
Egzersiz öncesi ve sonrası kan şekeri ölçümü özellikle insülin kullananlar için önemlidir. Hipoglisemi riskine karşı yanınızda atıştırmalık bulundurun.

**Özet**
Egzersiz programı kişiye özeldir. Bu metin bilgilendirme amaçlıdır; spora başlamadan önce hekiminize danışın.`,
  },
  {
    id: '3',
    slug: 'tip-1-diyabet-nedir',
    title: 'Tip 1 diyabet nedir?',
    excerpt: 'Tip 1 diyabetin tanımı, belirtileri ve tedavi yaklaşımı hakkında kısa bilgi.',
    category: 'tip1',
    date: '2025-02-01',
    readMinutes: 4,
    content: `Tip 1 diyabet, pankreasın insülin üreten hücrelerinin bağışıklık sistemi tarafından hasarlanması sonucu gelişen bir durumdur. Genellikle çocukluk veya genç erişkinlikte tanı konur.

**Belirtiler**
Aşırı susama, sık idrara çıkma, yorgunluk, kilo kaybı ve bulanık görme sık görülen belirtilerdir. Tanı kan şekeri ve HbA1c testleriyle konur.

**Tedavi**
Yaşam boyu insülin tedavisi gerekir. Kan şekeri takibi, karbonhidrat sayımı ve düzenli kontroller tedavinin parçasıdır.

**Özet**
Bu metin yalnızca bilgilendirme amaçlıdır. Tanı ve tedavi için mutlaka bir hekime başvurun.`,
  },
  {
    id: '4',
    slug: 'glisemik-indeks-pratik',
    title: 'Glisemik indeks: pratik rehber',
    excerpt: 'Besinlerin kan şekerini nasıl etkilediğini anlamak için glisemik indeks kavramı.',
    category: 'beslenme',
    date: '2025-02-10',
    readMinutes: 5,
    content: `Glisemik indeks (Gİ), bir besinin kan şekerini ne kadar hızlı yükselttiğini gösteren bir ölçüttür. Düşük Gİ’li besinler genelde daha yavaş emilir.

**Pratikte**
Tam tahıllar, baklagiller, birçok sebze ve bazı meyveler orta-düşük Gİ’e sahiptir. Rafine şeker ve beyaz unlu ürünler genelde yüksek Gİ’e sahiptir. Öğün içinde lif, protein ve yağ Gİ’i yumuşatabilir.

**Dikkat**
Gİ tek başına yeterli değildir; porsiyon ve toplam karbonhidrat da önemlidir. Diyet planınızı diyetisyeninizle yapın.

**Özet**
Bu metin bilgilendirme amaçlıdır; beslenme kararları için hekim ve diyetisyeninize danışın.`,
  },
  {
    id: '5',
    slug: 'is-yerinde-diyabet-yonetimi',
    title: 'İş yerinde diyabet yönetimi',
    excerpt: 'Çalışırken ölçüm, insülin ve ara öğün için pratik ipuçları.',
    category: 'yasam',
    date: '2025-02-15',
    readMinutes: 4,
    content: `Diyabetle çalışma hayatı, planlama ve birkaç pratik alışkanlıkla daha rahat yönetilebilir.

**Ölçüm ve ilaç**
Ölçüm cihazı ve ilacınızı her zaman yanınızda bulundurun. Çekmece veya çantada küçük bir “acil set” (atıştırmalık, şeker) işe yarar.

**Ara öğün**
Öğün atlamamak için yanınızda sağlıklı atıştırmalıklar taşıyın. Yoğurt, ceviz, meyve gibi seçenekler pratik olabilir.

**İletişim**
İhtiyaç halinde yakın iş arkadaşınıza veya insan kaynaklarına durumunuzu özetleyebilirsiniz; zorunlu değildir ama acil durumda yardım kolaylaşır.

**Özet**
Bu metin bilgilendirme amaçlıdır. Kişisel tedavi planınız için hekiminize danışın.`,
  },
  {
    id: '6',
    slug: 'sensor-ve-pompa-destekleri',
    title: 'Sensör ve pompa destekleri',
    excerpt: 'Sürekli glukoz ölçümü ve insülin pompası hakkında kısa bilgi.',
    category: 'teknoloji',
    date: '2025-02-20',
    readMinutes: 5,
    content: `Teknoloji, diyabet yönetiminde giderek daha fazla yer alıyor. Bu yazı genel bilgi amaçlıdır; cihaz seçimi ve kullanımı hekiminizle yapılmalıdır.

**Sürekli glukoz ölçümü (CGM)**
Sensörler cilt altı sıvıdaki glukozu ölçer ve trendleri gösterir. Hipoglisemi ve yüksek şeker uyarıları birçok kişide faydalıdır.

**İnsülin pompası**
Pompa, bazal ve öğün öncesi insülin verir. Kullanımı eğitim gerektirir; hekim ve hemşire ile takip önemlidir.

**Özet**
Cihazlar kişiye özel seçilir. Bu metin bilgilendirme amaçlıdır; karar için hekiminize danışın.`,
  },
]

const ADMIN_ARTICLES_KEY = 'diapal_admin_articles'

function loadAdminArticles(): Article[] {
  try {
    const raw = localStorage.getItem(ADMIN_ARTICLES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveAdminArticles(items: Article[]) {
  localStorage.setItem(ADMIN_ARTICLES_KEY, JSON.stringify(items))
}

const allArticles = (): Article[] => [...ARTICLES, ...loadAdminArticles()]

export function getAllArticles(): Article[] {
  return allArticles().sort((a, b) => b.date.localeCompare(a.date))
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return allArticles().filter((a) => a.category === category)
}

export function getArticleBySlug(slug: string): Article | null {
  return allArticles().find((a) => a.slug === slug) ?? null
}

export function getArticleById(id: string): Article | null {
  return allArticles().find((a) => a.id === id) ?? null
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

export function addAdminArticle(data: Omit<Article, 'id' | 'slug'>): Article {
  const list = loadAdminArticles()
  const slug = slugify(data.title)
  const id = `adm_${Date.now()}`
  const article: Article = { ...data, id, slug: `${slug}-${id.slice(-6)}` }
  list.push(article)
  saveAdminArticles(list)
  return article
}
