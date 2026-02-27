/**
 * Tarif veritabanı – Diapal Asistan için.
 * Tıbbi tavsiye değil; yaşam kalitesini destekleyen fikirler.
 */

export type RecipeCategory =
  | 'ara_ogun'
  | 'kahvalti'
  | 'ana_yemek'
  | 'corba'
  | 'salata'
  | 'tatli'
  | 'icecek'

export type Recipe = {
  id: string
  name: string
  category: RecipeCategory
  shortDesc: string
  tags: string[]
}

export const RECIPES: Recipe[] = [
  // Ara öğün
  { id: 'r1', name: 'Yoğurt + Ceviz + Tarçın', category: 'ara_ogun', shortDesc: 'Bir kase yoğurt, 2–3 ceviz, üzerine tarçın. Pratik ve doyurucu.', tags: ['pratik', 'protein', 'yoğurt'] },
  { id: 'r2', name: 'Elma dilimleri + Fıstık ezmesi', category: 'ara_ogun', shortDesc: 'Yarım elma dilimlenir, az miktar fıstık ezmesi ile. Lif ve protein.', tags: ['meyve', 'pratik'] },
  { id: 'r3', name: 'Haşlanmış yumurta', category: 'ara_ogun', shortDesc: '1 haşlanmış yumurta, tuz ve baharat. Taşınabilir ara öğün.', tags: ['protein', 'pratik'] },
  { id: 'r4', name: 'Salatalık + Beyaz peynir', category: 'ara_ogun', shortDesc: 'Birkaç dilim salatalık, küp peynir. Serinletici ve hafif.', tags: ['sebze', 'protein'] },
  { id: 'r5', name: 'Kefir + Yulaf ezmesi', category: 'ara_ogun', shortDesc: 'Bir bardak kefir, 1–2 yemek kaşığı yulaf. Probiyotik ve lif.', tags: ['yoğurt', 'yulaf'] },
  { id: 'r6', name: 'Humus + Çiğ sebze', category: 'ara_ogun', shortDesc: '2–3 yemek kaşığı humus, havuç veya salatalık çubukları.', tags: ['bakliyat', 'sebze'] },
  // Kahvaltı
  { id: 'r7', name: 'Yulaf lapası', category: 'kahvalti', shortDesc: 'Yulaf, süt veya su, tarçın, ceviz. İsteğe muz veya çilek.', tags: ['yulaf', 'pratik'] },
  { id: 'r8', name: 'Omlet + Yeşillik', category: 'kahvalti', shortDesc: '2 yumurta omlet, domates, biber, maydanoz.', tags: ['protein', 'sebze'] },
  { id: 'r9', name: 'Peynir + Domates + Zeytin', category: 'kahvalti', shortDesc: 'Beyaz peynir, dilim domates, birkaç zeytin, tam buğday ekmek.', tags: ['protein', 'klasik'] },
  { id: 'r10', name: 'Avokado + Yumurta', category: 'kahvalti', shortDesc: 'Yarım avokado üzerine poşe veya rafadan yumurta.', tags: ['sağlıklı yağ', 'protein'] },
  // Ana yemek
  { id: 'r11', name: 'Izgara tavuk + Bulgur pilavı', category: 'ana_yemek', shortDesc: 'Izgara göğüs, az yağlı bulgur pilavı, yanında salata.', tags: ['tavuk', 'tam tahıl'] },
  { id: 'r12', name: 'Mercimek yemeği', category: 'ana_yemek', shortDesc: 'Kırmızı veya yeşil mercimek, soğan, domates, az yağ.', tags: ['bakliyat', 'vejetaryen'] },
  { id: 'r13', name: 'Fırın balık + Sebze', category: 'ana_yemek', shortDesc: 'Levrek veya somon, fırında; yanında buharda brokoli.', tags: ['balık', 'sebze'] },
  { id: 'r14', name: 'Kuru fasulye + Pilav', category: 'ana_yemek', shortDesc: 'Geleneksel kuru fasulye, az porsiyon pilav, salata.', tags: ['bakliyat', 'klasik'] },
  { id: 'r15', name: 'Kabak mücver', category: 'ana_yemek', shortDesc: 'Rendelenmiş kabak, yumurta, az un, fırında veya tavada.', tags: ['sebze', 'hafif'] },
  // Çorba
  { id: 'r16', name: 'Mercimek çorbası', category: 'corba', shortDesc: 'Kırmızı mercimek, soğan, havuç, kimyon. Lif ve protein.', tags: ['bakliyat', 'klasik'] },
  { id: 'r17', name: 'Yoğurtlu çorba (Yayla)', category: 'corba', shortDesc: 'Yoğurt, pirinç veya bulgur, nane. Serinletici.', tags: ['yoğurt', 'hafif'] },
  { id: 'r18', name: 'Sebze çorbası', category: 'corba', shortDesc: 'Havuç, kabak, patates, domates; blendırlı veya püre.', tags: ['sebze', 'hafif'] },
  { id: 'r19', name: 'Tavuk suyu çorba', category: 'corba', shortDesc: 'Tavuk suyu, şehriye veya pirinç, havuç, maydanoz.', tags: ['tavuk', 'hafif'] },
  // Salata
  { id: 'r20', name: 'Mevsim yeşil salata', category: 'salata', shortDesc: 'Marul, roka, domates, salatalık, zeytinyağı–limon.', tags: ['yeşillik', 'pratik'] },
  { id: 'r21', name: 'Cacık', category: 'salata', shortDesc: 'Yoğurt, salatalık, sarımsak, nane. Yan yemek veya ara öğün.', tags: ['yoğurt', 'sebze'] },
  { id: 'r22', name: 'Havuç + Yoğurt salatası', category: 'salata', shortDesc: 'Rendelenmiş havuç, yoğurt, az sarımsak.', tags: ['sebze', 'yoğurt'] },
  { id: 'r23', name: 'Nohutlu salata', category: 'salata', shortDesc: 'Haşlanmış nohut, domates, salatalık, maydanoz, zeytinyağı.', tags: ['bakliyat', 'protein'] },
  // Tatlı (hafif fikirler)
  { id: 'r24', name: 'Tarçınlı elma', category: 'tatli', shortDesc: 'Fırında veya mikrodalgada elma, tarçın. Sade veya az yoğurt.', tags: ['meyve', 'pratik'] },
  { id: 'r25', name: 'Yoğurt + Meyve', category: 'tatli', shortDesc: 'Yoğurt, çilek veya böğürtlen, az ceviz.', tags: ['yoğurt', 'meyve'] },
  { id: 'r26', name: 'Sütlü kahve (şekersiz)', category: 'tatli', shortDesc: 'Sütlü Türk kahvesi veya latte, şekersiz. Keyif için.', tags: ['içecek', 'pratik'] },
  { id: 'r27', name: 'Kuru kayısı + Ceviz', category: 'tatli', shortDesc: '2–3 kuru kayısı, 2 ceviz. Küçük porsiyon tatlı ihtiyacı.', tags: ['meyve', 'kuruyemiş'] },
  // İçecek
  { id: 'r28', name: 'Ayran', category: 'icecek', shortDesc: 'Doğal yoğurt, su, az tuz. Serinletici ve protein.', tags: ['yoğurt', 'pratik'] },
  { id: 'r29', name: 'Şekersiz limonata', category: 'icecek', shortDesc: 'Taze limon, su, nane. İsteğe az bal veya tatlandırıcı.', tags: ['meyve', 'serinletici'] },
  { id: 'r30', name: 'Bitki çayı', category: 'icecek', shortDesc: 'Ihlamur, yeşil çay, papatya. Şekersiz tüketim.', tags: ['çay', 'sıcak'] },
  { id: 'r31', name: 'Smoothie (meyve + yoğurt)', category: 'icecek', shortDesc: 'Bir avuç çilek veya muz, yoğurt, az süt. Ara öğün alternatifi.', tags: ['meyve', 'yoğurt'] },
]

const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  ara_ogun: 'Ara öğün',
  kahvalti: 'Kahvaltı',
  ana_yemek: 'Ana yemek',
  corba: 'Çorba',
  salata: 'Salata',
  tatli: 'Tatlı',
  icecek: 'İçecek',
}

export function getCategoryLabel(cat: RecipeCategory): string {
  return CATEGORY_LABELS[cat]
}

export function getRecipesByCategory(category: RecipeCategory): Recipe[] {
  return RECIPES.filter((r) => r.category === category)
}

export function getRecipesByTag(tag: string): Recipe[] {
  const t = tag.toLowerCase()
  return RECIPES.filter((r) => r.tags.some((tag) => tag.toLowerCase().includes(t) || t.includes(tag.toLowerCase())))
}

export function searchRecipes(query: string, pool: Recipe[] = RECIPES): Recipe[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return pool.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.shortDesc.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q))
  )
}

/** Statik + Supabase admin tarifler (public sayfalar için). */
export async function getRecipesAsync(): Promise<Recipe[]> {
  const { getAdminRecipes } = await import('./adminContent')
  const admin = await getAdminRecipes()
  return [...RECIPES, ...admin]
}
