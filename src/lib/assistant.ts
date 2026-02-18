/**
 * Diapal Asistan – Kullanıcı mesajına göre tarif önerisi üretir.
 * Tıbbi tavsiye vermez; sadece yaşam kalitesi ve beslenme fikirleri sunar.
 */

import type { Recipe, RecipeCategory } from './recipes'
import { getRecipesByCategory, getCategoryLabel, searchRecipes } from './recipes'

const DISCLAIMER =
  'Bu öneriler genel bilgi amaçlıdır; tıbbi tavsiye yerine geçmez. Beslenme planınız için doktor veya diyetisyeninize danışın.'

// Anahtar kelimelere göre kategori eşlemesi (küçük harf)
const KEYWORDS: Record<RecipeCategory, string[]> = {
  ara_ogun: [
    'ara öğün', 'araogun', 'atıştırmalık', 'atistirma', 'atıştırma', 'öğün arası',
    'ne yiyebilirim', 'ne yemeliyim', 'atıştırmak', 'acıktım', 'atistirmalik',
    'snack', 'ara ogun', 'küçük öğün',
  ],
  kahvalti: [
    'kahvaltı', 'kahvalti', 'sabah', 'sabah ne yemeliyim', 'breakfast',
  ],
  ana_yemek: [
    'ana yemek', 'öğle', 'akşam', 'yemek', 'yemek öner', 'tarif', 'ne pişirsem',
    'ne yemek yapsam', 'ana yemek öner', 'ogle', 'aksam', 'yemek fikri',
  ],
  corba: [
    'çorba', 'corba', 'çorba öner', 'hafif çorba', 'sıcak çorba',
  ],
  salata: [
    'salata', 'yeşillik', 'yeşil salata', 'hafif salata', 'yanında ne olur',
  ],
  tatli: [
    'tatlı', 'tatli', 'tatlı fikri', 'tatlı öner', 'şeker ihtiyacı', 'tatli yiyebilir miyim',
    'hafif tatlı', 'dessert',
  ],
  icecek: [
    'içecek', 'icecek', 'ne içebilirim', 'içecek öner', 'susadım', 'serinletici',
    'sıcak içecek', 'drink',
  ],
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ıiİI]/g, 'i')
    .replace(/[ğgĞG]/g, 'g')
    .replace(/[üuÜU]/g, 'u')
    .replace(/[şsŞS]/g, 's')
    .replace(/[çcÇC]/g, 'c')
    .replace(/[öoÖO]/g, 'o')
    .trim()
}

function detectCategory(userMessage: string): RecipeCategory | null {
  const normalized = normalize(userMessage)
  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some((kw) => normalized.includes(normalize(kw)))) {
      return category as RecipeCategory
    }
  }
  return null
}

/** Kullanıcı mesajına göre asistan yanıtı (tarif önerileri + uyarı). */
export function getAssistantReply(userMessage: string): string {
  const trimmed = userMessage.trim()
  if (!trimmed) {
    return 'Merhaba! Diyabetle yaşamda beslenme ve günlük hayatla ilgili sorularınızı yanıtlayabilirim. Örneğin: "Ara öğünde ne yiyebilirim?" veya "Kahvaltı için önerin var mı?" Yazın, size tarif fikirleri sunayım. Bu öneriler tıbbi tavsiye değildir; doktor veya diyetisyeninize danışın.'
  }

  // Önce anahtar kelimeden kategori bul
  const category = detectCategory(trimmed)
  let recipes: Recipe[] = []

  if (category) {
    recipes = getRecipesByCategory(category)
  }

  // Kategori bulunamadıysa veya az sonuç varsa genel arama
  if (recipes.length === 0) {
    const searched = searchRecipes(trimmed)
    if (searched.length > 0) recipes = searched
  }

  // Hâlâ yoksa genel öneri
  if (recipes.length === 0) {
    return `"${trimmed}" için net bir kategori bulamadım. Şunları deneyebilirsiniz: "Ara öğünde ne yiyebilirim?", "Kahvaltı önerisi", "Çorba tarifi", "Hafif tatlı fikri". Bu öneriler tıbbi tavsiye değildir; beslenme planınız için doktor veya diyetisyeninize danışın.`
  }

  // En fazla 4 tarif öner
  const toShow = recipes.slice(0, 4)
  const categoryLabel = category ? getCategoryLabel(category) : 'Tarif'
  const lines: string[] = [
    `${categoryLabel} için birkaç fikir:`,
    '',
    ...toShow.map((r) => `• **${r.name}**: ${r.shortDesc}`),
    '',
    DISCLAIMER,
  ]
  return lines.join('\n')
}
