import { supabase } from './supabaseClient'

export type ChallengeIconKey = 'droplet' | 'walk' | 'leaf' | 'clipboard' | 'moon' | 'apple'

export type DailyChallenge = {
  id: string
  title: string
  description: string
  iconKey: ChallengeIconKey
  points: number
}

export type Badge = {
  id: string
  name: string
  description: string
  requirement: string
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: 'su', title: 'Bugün 2 litre su iç', description: 'Hidrasyon kan şekeri yönetimine yardımcı olur.', iconKey: 'droplet', points: 10 },
  { id: 'yuruyus', title: 'Bugün 30 dk yürüyüş', description: 'Düzenli hareket insülin duyarlılığını destekler.', iconKey: 'walk', points: 15 },
  { id: 'sebze', title: 'Bir öğünde sebze ağırlıklı tabak', description: 'Lif ve vitamin için renkli sebzeler.', iconKey: 'leaf', points: 8 },
  { id: 'olcum', title: 'Kan şekerini kaydet', description: 'Ölçümlerini Diapal\'da veya defterde işaretle.', iconKey: 'clipboard', points: 5 },
  { id: 'uyku', title: '7–8 saat uyku', description: 'Uyku kalitesi kan şekeri dengesini etkiler.', iconKey: 'moon', points: 10 },
  { id: 'atistirma', title: 'Sağlıklı ara öğün seç', description: 'Bir ara öğünde meyve, ceviz veya yoğurt.', iconKey: 'apple', points: 8 },
]

export const BADGES: Badge[] = [
  { id: 'ilk_adim', name: 'İlk Adım', description: 'İlk görevi tamamladın.', requirement: '1 görev' },
  { id: 'su_ustasi', name: 'Su İçme Ustası', description: 'Su görevini 7 gün tamamladın.', requirement: 'Su x7' },
  { id: 'yuruyuscu', name: 'Yürüyüşçü', description: 'Yürüyüş görevini 5 gün tamamladın.', requirement: 'Yürüyüş x5' },
  { id: 'uclu', name: 'Üçlü', description: 'Bir günde 3 görev tamamladın.', requirement: '3 görev/1 gün' },
  { id: 'besli', name: 'Beşli', description: 'Bir günde 5 görev tamamladın.', requirement: '5 görev/1 gün' },
  { id: 'hafta', name: 'Haftanın Yıldızı', description: '7 gün üst üste en az 1 görev tamamladın.', requirement: '7 gün streak' },
  { id: 'saglik', name: 'Sağlık Elçisi', description: 'Toplam 30 görev tamamladın.', requirement: '30 görev' },
  { id: 'bes_gorev', name: 'Beş Görev', description: 'Toplam 5 görev tamamladın.', requirement: '5 görev' },
  { id: 'on_gorev', name: 'Onluk', description: 'Toplam 10 görev tamamladın.', requirement: '10 görev' },
  { id: 'yirmi_gorev', name: 'Yirmi Kahraman', description: 'Toplam 20 görev tamamladın.', requirement: '20 görev' },
  { id: 'elli_gorev', name: 'Elli Yıldız', description: 'Toplam 50 görev tamamladın.', requirement: '50 görev' },
  { id: 'yuz_gorev', name: 'Yüzler Kulübü', description: 'Toplam 100 görev tamamladın.', requirement: '100 görev' },
  { id: 'ikiyuz_gorev', name: 'İki Yüz', description: 'Toplam 200 görev tamamladın.', requirement: '200 görev' },
  { id: 'ucuz_gorev', name: 'Üç Yüz', description: 'Toplam 300 görev tamamladın.', requirement: '300 görev' },
  { id: 'besyuz_gorev', name: 'Beş Yüz', description: 'Toplam 500 görev tamamladın.', requirement: '500 görev' },
  { id: 'bin_gorev', name: 'Binler', description: 'Toplam 1000 görev tamamladın.', requirement: '1000 görev' },
  { id: 'uc_gun_seri', name: 'Üç Gün', description: '3 gün üst üste görev tamamladın.', requirement: '3 gün streak' },
  { id: 'on_dort_seri', name: 'İki Hafta', description: '14 gün üst üste görev tamamladın.', requirement: '14 gün streak' },
  { id: 'yirmi_bir_seri', name: 'Üç Hafta', description: '21 gün üst üste görev tamamladın.', requirement: '21 gün streak' },
  { id: 'otuz_seri', name: 'Bir Ay', description: '30 gün üst üste görev tamamladın.', requirement: '30 gün streak' },
  { id: 'altmis_seri', name: 'İki Ay', description: '60 gün üst üste görev tamamladın.', requirement: '60 gün streak' },
  { id: 'doksan_seri', name: 'Üç Ay', description: '90 gün üst üste görev tamamladın.', requirement: '90 gün streak' },
  { id: 'su_on_dort', name: 'Su İkinci Hafta', description: 'Su görevini 14 gün tamamladın.', requirement: 'Su x14' },
  { id: 'su_otuz', name: 'Su Ayı', description: 'Su görevini 30 gün tamamladın.', requirement: 'Su x30' },
  { id: 'su_elli', name: 'Su Uzmanı', description: 'Su görevini 50 gün tamamladın.', requirement: 'Su x50' },
  { id: 'su_yuz', name: 'Su Efsanesi', description: 'Su görevini 100 gün tamamladın.', requirement: 'Su x100' },
  { id: 'yuruyus_on', name: 'Yürüyüş Onlu', description: 'Yürüyüş görevini 10 gün tamamladın.', requirement: 'Yürüyüş x10' },
  { id: 'yuruyus_yirmi', name: 'Yürüyüş Yirmi', description: 'Yürüyüş görevini 20 gün tamamladın.', requirement: 'Yürüyüş x20' },
  { id: 'yuruyus_otuz', name: 'Yürüyüş Ayı', description: 'Yürüyüş görevini 30 gün tamamladın.', requirement: 'Yürüyüş x30' },
  { id: 'yuruyus_elli', name: 'Yürüyüş Ustası', description: 'Yürüyüş görevini 50 gün tamamladın.', requirement: 'Yürüyüş x50' },
  { id: 'altili', name: 'Altılı', description: 'Bir günde 6 görev tamamladın.', requirement: '6 görev/1 gün' },
  { id: 'sebze_yedi', name: 'Sebze Haftası', description: 'Sebze görevini 7 gün tamamladın.', requirement: 'Sebze x7' },
  { id: 'sebze_on_dort', name: 'Sebze İkinci Hafta', description: 'Sebze görevini 14 gün tamamladın.', requirement: 'Sebze x14' },
  { id: 'sebze_otuz', name: 'Sebze Ayı', description: 'Sebze görevini 30 gün tamamladın.', requirement: 'Sebze x30' },
  { id: 'olcum_yedi', name: 'Ölçüm Haftası', description: 'Ölçüm görevini 7 gün tamamladın.', requirement: 'Ölçüm x7' },
  { id: 'olcum_on_dort', name: 'Ölçüm İkinci Hafta', description: 'Ölçüm görevini 14 gün tamamladın.', requirement: 'Ölçüm x14' },
  { id: 'olcum_otuz', name: 'Ölçüm Ayı', description: 'Ölçüm görevini 30 gün tamamladın.', requirement: 'Ölçüm x30' },
  { id: 'uyku_yedi', name: 'Uyku Haftası', description: 'Uyku görevini 7 gün tamamladın.', requirement: 'Uyku x7' },
  { id: 'uyku_on_dort', name: 'Uyku İkinci Hafta', description: 'Uyku görevini 14 gün tamamladın.', requirement: 'Uyku x14' },
  { id: 'uyku_otuz', name: 'Uyku Ayı', description: 'Uyku görevini 30 gün tamamladın.', requirement: 'Uyku x30' },
  { id: 'atistirma_yedi', name: 'Ara Öğün Haftası', description: 'Ara öğün görevini 7 gün tamamladın.', requirement: 'Ara öğün x7' },
  { id: 'atistirma_on_dort', name: 'Ara Öğün İkinci Hafta', description: 'Ara öğün görevini 14 gün tamamladın.', requirement: 'Ara öğün x14' },
  { id: 'atistirma_otuz', name: 'Ara Öğün Ayı', description: 'Ara öğün görevini 30 gün tamamladın.', requirement: 'Ara öğün x30' },
  { id: 'dortlu', name: 'Dörtlü', description: 'Bir günde 4 görev tamamladın.', requirement: '4 görev/1 gün' },
  { id: 'sabah_ci', name: 'Sabahçı', description: 'Erken saatte ilk görevi tamamladın.', requirement: 'Sabah görevi' },
  { id: 'gece_kusu', name: 'Gece Kuşu', description: 'Uyku görevini 10 kez tamamladın.', requirement: 'Uyku x10' },
  { id: 'diyet_dostu', name: 'Diyet Dostu', description: 'Sebze ve ara öğün görevlerini 5 kez tamamladın.', requirement: 'Sebze + Ara öğün x5' },
  { id: 'hareket_ruhu', name: 'Hareket Ruhu', description: 'Yürüyüş görevini 15 kez tamamladın.', requirement: 'Yürüyüş x15' },
  { id: 'hidrasyon_krali', name: 'Hidrasyon Kralı', description: 'Su görevini 21 gün tamamladın.', requirement: 'Su x21' },
  { id: 'duzenli_olcum', name: 'Düzenli Ölçüm', description: 'Ölçüm görevini 21 gün tamamladın.', requirement: 'Ölçüm x21' },
  { id: 'yildiz_avcisi', name: 'Yıldız Avcısı', description: 'Toplam 15 görev tamamladın.', requirement: '15 görev' },
  { id: 'kahraman_25', name: 'Kahraman 25', description: 'Toplam 25 görev tamamladın.', requirement: '25 görev' },
  { id: 'elit_40', name: 'Elit 40', description: 'Toplam 40 görev tamamladın.', requirement: '40 görev' },
  { id: 'usta_60', name: 'Usta 60', description: 'Toplam 60 görev tamamladın.', requirement: '60 görev' },
  { id: 'efsane_70', name: 'Efsane 70', description: 'Toplam 70 görev tamamladın.', requirement: '70 görev' },
  { id: 'destan_80', name: 'Destan 80', description: 'Toplam 80 görev tamamladın.', requirement: '80 görev' },
  { id: 'efsane_90', name: 'Efsane 90', description: 'Toplam 90 görev tamamladın.', requirement: '90 görev' },
  { id: 'kral_150', name: 'Kral 150', description: 'Toplam 150 görev tamamladın.', requirement: '150 görev' },
  { id: 'imparator_250', name: 'İmparator 250', description: 'Toplam 250 görev tamamladın.', requirement: '250 görev' },
  { id: 'efsane_400', name: 'Efsane 400', description: 'Toplam 400 görev tamamladın.', requirement: '400 görev' },
  { id: 'tanri_750', name: 'Tanrı 750', description: 'Toplam 750 görev tamamladın.', requirement: '750 görev' },
  { id: 'denge_ustasi', name: 'Denge Ustası', description: 'Tüm görev türlerinden en az 3 tamamladın.', requirement: 'Tüm türler x3' },
  { id: 'cok_yonlu', name: 'Çok Yönlü', description: '5 farklı günde en az 2 görev tamamladın.', requirement: '5 gün x2 görev' },
  { id: 'kararli', name: 'Kararlı', description: '5 gün üst üste görev tamamladın.', requirement: '5 gün streak' },
  { id: 'demir_irade', name: 'Demir İrade', description: '10 gün üst üste görev tamamladın.', requirement: '10 gün streak' },
  { id: 'celik_displin', name: 'Çelik Disiplin', description: '45 gün üst üste görev tamamladın.', requirement: '45 gün streak' },
  { id: 'yarim_yil', name: 'Yarım Yıl', description: '180 gün üst üste görev tamamladın.', requirement: '180 gün streak' },
  { id: 'yil_seri', name: 'Yıl Serisi', description: '365 gün üst üste görev tamamladın.', requirement: '365 gün streak' },
  { id: 'ilk_hafta', name: 'İlk Hafta', description: '7 gün içinde toplam 14 görev tamamladın.', requirement: '7 günde 14 görev' },
  { id: 'super_hafta', name: 'Süper Hafta', description: '7 gün üst üste tam görev (6/6) tamamladın.', requirement: '7 gün tam' },
  { id: 'ayin_yildizi', name: 'Ayın Yıldızı', description: 'Bir ayda 60 görev tamamladın.', requirement: 'Ayda 60 görev' },
  { id: 'hizli_baslangic', name: 'Hızlı Başlangıç', description: 'İlk 3 günde 5 görev tamamladın.', requirement: '3 günde 5 görev' },
  { id: 'maratoncu', name: 'Maratoncu', description: 'Toplam 42 görev tamamladın.', requirement: '42 görev' },
  { id: 'yuz_seri', name: 'Yüz Gün', description: '100 gün üst üste görev tamamladın.', requirement: '100 gün streak' },
  { id: 'tam_takim', name: 'Tam Takım', description: 'Bir günde 6 farklı görev tamamladın.', requirement: '6/6 bir gün' },
  { id: 'su_perisi', name: 'Su Perisi', description: 'Su görevini 7 gün üst üste tamamladın.', requirement: 'Su 7 gün streak' },
  { id: 'yuruyus_efsanesi', name: 'Yürüyüş Efsanesi', description: 'Yürüyüş görevini 100 gün tamamladın.', requirement: 'Yürüyüş x100' },
  { id: 'sebze_sever', name: 'Sebze Sever', description: 'Sebze görevini 21 gün tamamladın.', requirement: 'Sebze x21' },
  { id: 'olcum_tutkunu', name: 'Ölçüm Tutkunu', description: 'Ölçüm görevini 21 gün tamamladın.', requirement: 'Ölçüm x21' },
  { id: 'uyku_efsanesi', name: 'Uyku Efsanesi', description: 'Uyku görevini 21 gün tamamladın.', requirement: 'Uyku x21' },
  { id: 'atistirma_uzmani', name: 'Ara Öğün Uzmanı', description: 'Ara öğün görevini 21 gün tamamladın.', requirement: 'Ara öğün x21' },
  { id: 'gunes_doğumu', name: 'Güneş Doğumu', description: '7 gün üst üste en az 2 görev tamamladın.', requirement: '7 gün x2' },
  { id: 'ay_isi', name: 'Ay Işığı', description: 'Uyku görevini 14 gün tamamladın.', requirement: 'Uyku x14' },
  { id: 'yesil_el', name: 'Yeşil El', description: 'Sebze görevini 10 gün tamamladın.', requirement: 'Sebze x10' },
  { id: 'kan_sukuru', name: 'Kan Şekeri Takipçisi', description: 'Ölçüm görevini 10 gün tamamladın.', requirement: 'Ölçüm x10' },
  { id: 'atistirma_bes', name: 'Ara Öğün Beş', description: 'Ara öğün görevini 5 gün tamamladın.', requirement: 'Ara öğün x5' },
  { id: 'uyku_bes', name: 'Uyku Beş', description: 'Uyku görevini 5 gün tamamladın.', requirement: 'Uyku x5' },
  { id: 'sebze_bes', name: 'Sebze Beş', description: 'Sebze görevini 5 gün tamamladın.', requirement: 'Sebze x5' },
  { id: 'olcum_bes', name: 'Ölçüm Beş', description: 'Ölçüm görevini 5 gün tamamladın.', requirement: 'Ölçüm x5' },
  { id: 'diyabet_kahramani', name: 'Diyabet Kahramanı', description: 'Toplam 75 görev tamamladın.', requirement: '75 görev' },
  { id: 'saglik_savascisi', name: 'Sağlık Savaşçısı', description: 'Toplam 120 görev tamamladın.', requirement: '120 görev' },
  { id: 'altin_150', name: 'Altın 150', description: 'Toplam 150 görev tamamladın.', requirement: '150 görev' },
  { id: 'gumus_200', name: 'Gümüş 200', description: 'Toplam 200 görev tamamladın.', requirement: '200 görev' },
  { id: 'bronz_350', name: 'Bronz 350', description: 'Toplam 350 görev tamamladın.', requirement: '350 görev' },
  { id: 'platin_600', name: 'Platin 600', description: 'Toplam 600 görev tamamladın.', requirement: '600 görev' },
  { id: 'elmas_900', name: 'Elmas 900', description: 'Toplam 900 görev tamamladın.', requirement: '900 görev' },
  { id: 'baslangic_yildizi', name: 'Başlangıç Yıldızı', description: 'İlk 5 görevi tamamladın.', requirement: '5 görev' },
  { id: 'orta_seviye', name: 'Orta Seviye', description: 'Toplam 35 görev tamamladın.', requirement: '35 görev' },
  { id: 'ileri_seviye', name: 'İleri Seviye', description: 'Toplam 45 görev tamamladın.', requirement: '45 görev' },
  { id: 'uzman_seviye', name: 'Uzman Seviye', description: 'Toplam 55 görev tamamladın.', requirement: '55 görev' },
  { id: 'ustasi_seviye', name: 'Ustası Seviye', description: 'Toplam 65 görev tamamladın.', requirement: '65 görev' },
  { id: 'efsanevi_seviye', name: 'Efsanevi Seviye', description: 'Toplam 85 görev tamamladın.', requirement: '85 görev' },
  { id: 'mitik_seviye', name: 'Mitik Seviye', description: 'Toplam 95 görev tamamladın.', requirement: '95 görev' },
  { id: 'son_sinir', name: 'Son Sınır', description: 'Toplam 110 görev tamamladın.', requirement: '110 görev' },
  { id: 'ufuk_acici', name: 'Ufuk Açıcı', description: 'Toplam 130 görev tamamladın.', requirement: '130 görev' },
  { id: 'sonsuz_yolcu', name: 'Sonsuz Yolcu', description: 'Toplam 175 görev tamamladın.', requirement: '175 görev' },
  { id: 'zirve_450', name: 'Zirve 450', description: 'Toplam 450 görev tamamladın.', requirement: '450 görev' },
  { id: 'gokyuzu_550', name: 'Gökyüzü 550', description: 'Toplam 550 görev tamamladın.', requirement: '550 görev' },
  { id: 'yildizlar_650', name: 'Yıldızlar 650', description: 'Toplam 650 görev tamamladın.', requirement: '650 görev' },
  { id: 'evren_850', name: 'Evren 850', description: 'Toplam 850 görev tamamladın.', requirement: '850 görev' },
  { id: 'bin_bir_gece', name: 'Bin Bir Gece', description: 'Toplam 1001 görev tamamladın.', requirement: '1001 görev' },
  { id: 'iki_bin', name: 'İki Bin', description: 'Toplam 2000 görev tamamladın.', requirement: '2000 görev' },
  { id: 'bes_bin', name: 'Beş Bin', description: 'Toplam 5000 görev tamamladın.', requirement: '5000 görev' },
  { id: 'on_bin', name: 'On Bin', description: 'Toplam 10000 görev tamamladın.', requirement: '10000 görev' },
]

export type UserChallengeProgress = {
  completedToday: string[]
  history: { date: string; challengeIds: string[] }[]
  earnedBadges: string[]
}

const TODAY = new Date().toISOString().slice(0, 10)

// Basit bellek içi cache: her kullanıcı için son progress
const progressCache = new Map<string, UserChallengeProgress>()

async function loadProgressFromDb(userId: string): Promise<UserChallengeProgress> {
  if (progressCache.has(userId)) {
    return ensureToday(progressCache.get(userId)!)
  }
  const { data, error } = await supabase
    .from('user_challenges_progress')
    .select('progress')
    .eq('user_id', userId)
    .maybeSingle()

  let progress: UserChallengeProgress

  if (error || !data || !data.progress) {
    progress = { completedToday: [], history: [], earnedBadges: [] }
  } else {
    progress = data.progress as UserChallengeProgress
  }

  const ensured = ensureToday(progress)
  const newBadges = computeNewBadges(ensured)
  if (newBadges.length > 0) {
    ensured.earnedBadges = [...new Set([...ensured.earnedBadges, ...newBadges])]
    await saveProgressToDb(userId, ensured)
  } else {
    progressCache.set(userId, ensured)
  }
  return ensured
}

async function saveProgressToDb(userId: string, data: UserChallengeProgress): Promise<void> {
  progressCache.set(userId, data)
  await supabase.from('user_challenges_progress').upsert({
    user_id: userId,
    progress: data,
    updated_at: new Date().toISOString(),
  })
}

export async function ensureProgressLoaded(userId: string): Promise<UserChallengeProgress> {
  return loadProgressFromDb(userId)
}

export function getProgressForDisplay(userId: string): UserChallengeProgress {
  const cached = progressCache.get(userId)
  if (!cached) {
    return { completedToday: [], history: [], earnedBadges: [] }
  }
  return ensureToday(cached)
}

export function getTotalPoints(progress: UserChallengeProgress): number {
  const pointsMap: Record<string, number> = {}
  DAILY_CHALLENGES.forEach((c) => { pointsMap[c.id] = c.points })
  return progress.history.reduce(
    (sum, h) => sum + h.challengeIds.reduce((s, id) => s + (pointsMap[id] ?? 10), 0),
    0
  )
}

function ensureToday(progress: UserChallengeProgress): UserChallengeProgress {
  const lastHistory = progress.history[progress.history.length - 1]
  if (lastHistory && lastHistory.date !== TODAY) {
    return {
      completedToday: [],
      history: progress.history,
      earnedBadges: progress.earnedBadges,
    }
  }
  return progress
}

export function toggleChallenge(userId: string, challengeId: string): UserChallengeProgress {
  const base: UserChallengeProgress =
    progressCache.get(userId) ?? { completedToday: [], history: [], earnedBadges: [] }
  const progress = ensureToday(base)
  const completedToday = progress.completedToday.includes(challengeId)
    ? progress.completedToday.filter((id) => id !== challengeId)
    : [...progress.completedToday, challengeId]

  let history = progress.history
  const todayEntry = history.find((h) => h.date === TODAY)
  if (todayEntry) {
    history = history.map((h) =>
      h.date === TODAY ? { ...h, challengeIds: completedToday } : h
    )
  } else {
    history = [...history, { date: TODAY, challengeIds: completedToday }]
  }

  const updated: UserChallengeProgress = { ...progress, completedToday, history }

  const newBadges = computeNewBadges(updated)
  if (newBadges.length > 0) {
    updated.earnedBadges = [...new Set([...updated.earnedBadges, ...newBadges])]
  }
  progressCache.set(userId, updated)
  // Veritabanına asenkron kaydet
  void saveProgressToDb(userId, updated)
  return updated
}

function computeNewBadges(progress: UserChallengeProgress): string[] {
  const earned: string[] = []
  const totalCompleted = progress.history.reduce((s, h) => s + h.challengeIds.length, 0)
  const suCount = progress.history.reduce((s, h) => s + (h.challengeIds.includes('su') ? 1 : 0), 0)
  const yuruyusCount = progress.history.reduce((s, h) => s + (h.challengeIds.includes('yuruyus') ? 1 : 0), 0)
  const sebzeCount = progress.history.reduce((s, h) => s + (h.challengeIds.includes('sebze') ? 1 : 0), 0)
  const olcumCount = progress.history.reduce((s, h) => s + (h.challengeIds.includes('olcum') ? 1 : 0), 0)
  const uykuCount = progress.history.reduce((s, h) => s + (h.challengeIds.includes('uyku') ? 1 : 0), 0)
  const atistirmaCount = progress.history.reduce((s, h) => s + (h.challengeIds.includes('atistirma') ? 1 : 0), 0)
  const maxInOneDay = Math.max(0, ...progress.history.map((h) => h.challengeIds.length))
  const streak = getCurrentStreak(progress.history)

  const check = (id: string, cond: boolean) => { if (cond && !progress.earnedBadges.includes(id)) earned.push(id) }

  check('ilk_adim', totalCompleted >= 1)
  check('su_ustasi', suCount >= 7)
  check('yuruyuscu', yuruyusCount >= 5)
  check('uclu', maxInOneDay >= 3)
  check('besli', maxInOneDay >= 5)
  check('hafta', streak >= 7)
  check('saglik', totalCompleted >= 30)
  check('bes_gorev', totalCompleted >= 5)
  check('on_gorev', totalCompleted >= 10)
  check('yirmi_gorev', totalCompleted >= 20)
  check('elli_gorev', totalCompleted >= 50)
  check('yuz_gorev', totalCompleted >= 100)
  check('ikiyuz_gorev', totalCompleted >= 200)
  check('ucuz_gorev', totalCompleted >= 300)
  check('besyuz_gorev', totalCompleted >= 500)
  check('bin_gorev', totalCompleted >= 1000)
  check('uc_gun_seri', streak >= 3)
  check('on_dort_seri', streak >= 14)
  check('yirmi_bir_seri', streak >= 21)
  check('otuz_seri', streak >= 30)
  check('altmis_seri', streak >= 60)
  check('doksan_seri', streak >= 90)
  check('su_on_dort', suCount >= 14)
  check('su_otuz', suCount >= 30)
  check('su_elli', suCount >= 50)
  check('su_yuz', suCount >= 100)
  check('yuruyus_on', yuruyusCount >= 10)
  check('yuruyus_yirmi', yuruyusCount >= 20)
  check('yuruyus_otuz', yuruyusCount >= 30)
  check('yuruyus_elli', yuruyusCount >= 50)
  check('altili', maxInOneDay >= 6)
  check('dortlu', maxInOneDay >= 4)
  check('sebze_yedi', sebzeCount >= 7)
  check('sebze_on_dort', sebzeCount >= 14)
  check('sebze_otuz', sebzeCount >= 30)
  check('olcum_yedi', olcumCount >= 7)
  check('olcum_on_dort', olcumCount >= 14)
  check('olcum_otuz', olcumCount >= 30)
  check('uyku_yedi', uykuCount >= 7)
  check('uyku_on_dort', uykuCount >= 14)
  check('uyku_otuz', uykuCount >= 30)
  check('atistirma_yedi', atistirmaCount >= 7)
  check('atistirma_on_dort', atistirmaCount >= 14)
  check('atistirma_otuz', atistirmaCount >= 30)
  check('gece_kusu', uykuCount >= 10)
  check('hidrasyon_krali', suCount >= 21)
  check('duzenli_olcum', olcumCount >= 21)
  check('yildiz_avcisi', totalCompleted >= 15)
  check('kahraman_25', totalCompleted >= 25)
  check('elit_40', totalCompleted >= 40)
  check('usta_60', totalCompleted >= 60)
  check('efsane_70', totalCompleted >= 70)
  check('destan_80', totalCompleted >= 80)
  check('efsane_90', totalCompleted >= 90)
  check('kral_150', totalCompleted >= 150)
  check('imparator_250', totalCompleted >= 250)
  check('efsane_400', totalCompleted >= 400)
  check('tanri_750', totalCompleted >= 750)
  check('kararli', streak >= 5)
  check('demir_irade', streak >= 10)
  check('celik_displin', streak >= 45)
  check('yarim_yil', streak >= 180)
  check('yil_seri', streak >= 365)
  check('yuz_seri', streak >= 100)
  check('tam_takim', maxInOneDay >= 6)
  check('yuruyus_efsanesi', yuruyusCount >= 100)
  check('sebze_sever', sebzeCount >= 21)
  check('olcum_tutkunu', olcumCount >= 21)
  check('uyku_efsanesi', uykuCount >= 21)
  check('atistirma_uzmani', atistirmaCount >= 21)
  check('ay_isi', uykuCount >= 14)
  check('yesil_el', sebzeCount >= 10)
  check('kan_sukuru', olcumCount >= 10)
  check('atistirma_bes', atistirmaCount >= 5)
  check('uyku_bes', uykuCount >= 5)
  check('sebze_bes', sebzeCount >= 5)
  check('olcum_bes', olcumCount >= 5)
  check('diyabet_kahramani', totalCompleted >= 75)
  check('saglik_savascisi', totalCompleted >= 120)
  check('altin_150', totalCompleted >= 150)
  check('gumus_200', totalCompleted >= 200)
  check('bronz_350', totalCompleted >= 350)
  check('platin_600', totalCompleted >= 600)
  check('elmas_900', totalCompleted >= 900)
  check('baslangic_yildizi', totalCompleted >= 5)
  check('orta_seviye', totalCompleted >= 35)
  check('ileri_seviye', totalCompleted >= 45)
  check('uzman_seviye', totalCompleted >= 55)
  check('ustasi_seviye', totalCompleted >= 65)
  check('efsanevi_seviye', totalCompleted >= 85)
  check('mitik_seviye', totalCompleted >= 95)
  check('son_sinir', totalCompleted >= 110)
  check('ufuk_acici', totalCompleted >= 130)
  check('sonsuz_yolcu', totalCompleted >= 175)
  check('zirve_450', totalCompleted >= 450)
  check('gokyuzu_550', totalCompleted >= 550)
  check('yildizlar_650', totalCompleted >= 650)
  check('evren_850', totalCompleted >= 850)
  check('bin_bir_gece', totalCompleted >= 1001)
  check('iki_bin', totalCompleted >= 2000)
  check('bes_bin', totalCompleted >= 5000)
  check('on_bin', totalCompleted >= 10000)
  check('maratoncu', totalCompleted >= 42)

  return earned
}

export function getCurrentStreak(history: { date: string; challengeIds: string[] }[]): number {
  const dates = [...history]
    .filter((h) => h.challengeIds.length > 0)
    .map((h) => h.date)
    .sort()
    .reverse()
  if (dates.length === 0) return 0
  const sorted = [...new Set(dates)].sort().reverse()
  let streak = 0
  let expect = TODAY
  for (const d of sorted) {
    if (d !== expect) break
    streak++
    const next = new Date(expect)
    next.setDate(next.getDate() - 1)
    expect = next.toISOString().slice(0, 10)
  }
  return streak
}
