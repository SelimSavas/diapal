import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProgressForDisplay, BADGES } from '../lib/challenges'
import { supabase } from '../lib/supabaseClient'
import {
  getDoctorProfile,
  upsertDoctorProfile,
  getPatientsForDoctor,
  type DoctorPatientRow,
} from '../lib/doctorProfiles'

export default function Profil() {
  const navigate = useNavigate()
  const { user, deleteAccount, logout } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConsent, setDeleteConsent] = useState(false)
  const [goalsLoading, setGoalsLoading] = useState(false)
  const [goalsSaving, setGoalsSaving] = useState(false)
  const [hba1cTarget, setHba1cTarget] = useState('')
  const [stepsTarget, setStepsTarget] = useState('')
  const [carbsLimit, setCarbsLimit] = useState('')
  const [waterTargetMl, setWaterTargetMl] = useState('')
  const [moodSaving, setMoodSaving] = useState(false)
  const [mood, setMood] = useState(3)
  const [stress, setStress] = useState(3)
  const [sleepQuality, setSleepQuality] = useState(3)
  const [moodNote, setMoodNote] = useState('')
  const [lastMoodText, setLastMoodText] = useState<string | null>(null)
  const [doctorBio, setDoctorBio] = useState('')
  const [doctorPhone, setDoctorPhone] = useState('')
  const [doctorOnline, setDoctorOnline] = useState(true)
  const [doctorProfileSaving, setDoctorProfileSaving] = useState(false)
  const [patients, setPatients] = useState<DoctorPatientRow[]>([])
  const [patientsLoading, setPatientsLoading] = useState(false)

  useEffect(() => {
    if (!user) navigate('/giris', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    if (!user || user.role !== 'hasta') return
    const load = async () => {
      try {
        setGoalsLoading(true)
        const { data: goals } = await supabase
          .from('patient_goals')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
        if (goals) {
          setHba1cTarget(goals.hba1c_target != null ? String(goals.hba1c_target) : '')
          setStepsTarget(goals.steps_target != null ? String(goals.steps_target) : '')
          setCarbsLimit(goals.carbs_limit != null ? String(goals.carbs_limit) : '')
          setWaterTargetMl(goals.water_target_ml != null ? String(goals.water_target_ml) : '')
        }
        const { data: moods } = await supabase
          .from('moods')
          .select('mood, recorded_at')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: false })
          .limit(1)
        if (moods && moods.length > 0) {
          const m = moods[0]
          const when = new Date(m.recorded_at as string)
          const label = when.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
          const moodLabel = m.mood <= 2 ? 'düşük' : m.mood === 3 ? 'orta' : 'iyi'
          setLastMoodText(`${label} tarihinde kendini ${moodLabel} hissettiğini belirtmişsin.`)
        } else {
          setLastMoodText(null)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setGoalsLoading(false)
      }
    }
    load()
  }, [user])

  useEffect(() => {
    if (!user || user.role !== 'doktor') return
    let cancelled = false
    getDoctorProfile(user.id).then((p) => {
      if (cancelled) return
      if (p) {
        setDoctorBio(p.bio ?? '')
        setDoctorPhone(p.phone ?? '')
        setDoctorOnline(p.online)
      }
    })
    setPatientsLoading(true)
    getPatientsForDoctor(user.id).then((list) => {
      if (!cancelled) {
        setPatients(list)
        setPatientsLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [user])

  const handleSaveGoals = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== 'hasta') return
    try {
      setGoalsSaving(true)
      await supabase.from('patient_goals').upsert({
        user_id: user.id,
        hba1c_target: hba1cTarget ? Number(hba1cTarget) : null,
        steps_target: stepsTarget ? Number(stepsTarget) : null,
        carbs_limit: carbsLimit ? Number(carbsLimit) : null,
        water_target_ml: waterTargetMl ? Number(waterTargetMl) : null,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setGoalsSaving(false)
    }
  }

  const handleSaveDoctorProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== 'doktor') return
    setDoctorProfileSaving(true)
    try {
      await upsertDoctorProfile(user.id, {
        bio: doctorBio.trim() || null,
        phone: doctorPhone.trim() || null,
        online: doctorOnline,
      })
    } finally {
      setDoctorProfileSaving(false)
    }
  }

  const handleSaveMood = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== 'hasta') return
    try {
      setMoodSaving(true)
      await supabase.from('moods').insert({
        user_id: user.id,
        mood,
        stress,
        sleep_quality: sleepQuality,
        note: moodNote.trim() || null,
      })
      setMoodNote('')
      setLastMoodText('Bugünkü ruh halini kaydettin. Küçük adımlarla devam etmen çok değerli.')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setMoodSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Giriş yapılıyor...
      </div>
    )
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || '?'
  const progress = getProgressForDisplay(user.id)
  const earnedBadges = BADGES.filter((b) => progress.earnedBadges.includes(b.id))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h1 className="text-3xl font-800 text-slate-900 mb-8">Profilim</h1>

      {user.role === 'admin' ? (
        <div className="space-y-8">
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-700 text-2xl">
                {initial}
              </div>
              <div>
                <h2 className="text-xl font-700 text-slate-900">Yönetici</h2>
                <p className="text-slate-600">Makale, haber, forum ve geri bildirim yönetimi.</p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-800 font-600 hover:bg-amber-200"
              >
                Yönetim paneline git
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => { logout(); navigate('/', { replace: true }) }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-500 hover:bg-slate-100"
              >
                Çıkış yap
              </button>
            </div>
          </section>
        </div>
      ) : user.role === 'hasta' ? (
        <div className="space-y-8">
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-diapal-100 flex items-center justify-center text-diapal-600 font-700 text-2xl">
                {initial}
              </div>
              <div>
                <h2 className="text-xl font-700 text-slate-900">Üye profili</h2>
                <p className="text-slate-600">Bilgilerini güncelle, doktorlarla iletişim kur, forumda paylaş.</p>
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-500 text-slate-600">Ad soyad</label>
                <p className="text-slate-900 font-500">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-500 text-slate-600">E-posta</label>
                <p className="text-slate-900 font-500">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-500 text-slate-600">Hesap türü</label>
                <p className="text-slate-900 font-500">Üye</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/profil/duzenle"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-diapal-100 text-diapal-700 font-500 hover:bg-diapal-200 transition-colors"
              >
                Profili düzenle
              </Link>
              <button
                type="button"
                onClick={() => { logout(); navigate('/', { replace: true }) }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-500 hover:bg-slate-100 transition-colors"
              >
                Çıkış yap
              </button>
            </div>
          </section>
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-lg font-700 text-slate-900 mb-2">Hedeflerim</h3>
            <p className="text-sm text-slate-600 mb-4">
              Hekiminle birlikte belirlediğin hedefleri buraya yaz. Bu değerler sadece senin hesabınla ilişkilidir.
            </p>
            <form onSubmit={handleSaveGoals} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-500 text-slate-600 mb-1">
                  HbA1c hedefi (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min={5}
                  max={12}
                  value={hba1cTarget}
                  onChange={(e) => setHba1cTarget(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  placeholder="Örn. 7.0"
                />
              </div>
              <div>
                <label className="block text-xs font-500 text-slate-600 mb-1">
                  Günlük adım hedefi</label>
                <input
                  type="number"
                  min={0}
                  value={stepsTarget}
                  onChange={(e) => setStepsTarget(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  placeholder="Örn. 8000"
                />
              </div>
              <div>
                <label className="block text-xs font-500 text-slate-600 mb-1">
                  Günlük KH limiti (g)</label>
                <input
                  type="number"
                  min={0}
                  value={carbsLimit}
                  onChange={(e) => setCarbsLimit(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  placeholder="Örn. 180"
                />
              </div>
              <div>
                <label className="block text-xs font-500 text-slate-600 mb-1">
                  Günlük su hedefi (ml)</label>
                <input
                  type="number"
                  min={0}
                  value={waterTargetMl}
                  onChange={(e) => setWaterTargetMl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  placeholder="Örn. 2000"
                />
              </div>
              <div className="sm:col-span-2 flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500">
                  {goalsLoading ? 'Hedefler yükleniyor...' : 'Hedefleri istediğin zaman güncelleyebilirsin.'}
                </span>
                <button
                  type="submit"
                  disabled={goalsSaving}
                  className="px-4 py-2.5 rounded-xl bg-diapal-600 text-white text-sm font-600 hover:bg-diapal-700 disabled:opacity-60 disabled:pointer-events-none"
                >
                  {goalsSaving ? 'Kaydediliyor…' : 'Hedefleri kaydet'}
                </button>
              </div>
            </form>
          </section>
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-lg font-700 text-slate-900 mb-2">Bugünkü ruh halin</h3>
            <p className="text-sm text-slate-600 mb-4">
              Kendini bugün nasıl hissettiğini kısaca işaretle. Bu alan sadece senin için; doktorunla paylaşmak istersen birlikte bakabilirsiniz.
            </p>
            {lastMoodText && (
              <p className="text-xs text-slate-500 mb-3">
                {lastMoodText}
              </p>
            )}
            <form onSubmit={handleSaveMood} className="space-y-4">
              <div>
                <label className="flex justify-between text-xs font-500 text-slate-600 mb-1">
                  <span>Genel ruh hali</span>
                  <span className="text-slate-500 text-[11px]">1: çok zor · 5: çok iyi</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="flex justify-between text-xs font-500 text-slate-600 mb-1">
                  <span>Stres düzeyi</span>
                  <span className="text-slate-500 text-[11px]">1: çok düşük · 5: çok yüksek</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="flex justify-between text-xs font-500 text-slate-600 mb-1">
                  <span>Uyku kalitesi</span>
                  <span className="text-slate-500 text-[11px]">1: çok kötü · 5: çok iyi</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-500 text-slate-600 mb-1">
                  Not (isteğe bağlı)</label>
                <textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Bugün seni zorlayan veya iyi hissettiren bir şey var mı?"
                />
              </div>
              <button
                type="submit"
                disabled={moodSaving}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-600 hover:bg-emerald-700 disabled:opacity-60 disabled:pointer-events-none"
              >
                {moodSaving ? 'Kaydediliyor…' : 'Bugünü kaydet'}
              </button>
            </form>
          </section>
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-lg font-700 text-slate-900 mb-4">Hızlı erişim</h3>
            <div className="flex flex-wrap gap-3">
              <Link to="/doktorlar" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-500 hover:bg-slate-200">
                Doktor bul
              </Link>
              <Link to="/forum" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-500 hover:bg-slate-200">
                Forum
              </Link>
              <Link to="/bilgi" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-500 hover:bg-slate-200">
                Diyabet bilgisi
              </Link>
              <Link to="/karbonhidrat-sayaci" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-500 hover:bg-slate-200">
                KH Sayacı
              </Link>
              <Link to="/hba1c-tahminleyici" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-500 hover:bg-slate-200">
                HbA1c Tahmini
              </Link>
              <Link to="/gunluk-gorevler" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-500 hover:bg-slate-200">
                Günlük görevler
              </Link>
              <Link to="/olcum-gunlugu" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-500 hover:bg-slate-200">
                Ölçüm günlüğü
              </Link>
              <Link to="/ilac-hatirlatici" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-500 hover:bg-slate-200">
                İlaç hatırlatıcı
              </Link>
            </div>
          </section>
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-lg font-700 text-slate-900 mb-2">Kazanılan rozetler</h3>
            <p className="text-sm text-slate-600 mb-4">
              Meydan okumaları tamamlayarak kazandığın rozetler.
            </p>
            {earnedBadges.length === 0 ? (
              <p className="text-slate-500 text-sm mb-3">Henüz rozet kazanmadın.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {earnedBadges.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 min-w-0"
                    title={b.description}
                  >
                    <span className="text-2xl shrink-0">{b.icon}</span>
                    <div className="min-w-0">
                      <p className="font-600 text-slate-900 text-sm truncate">{b.name}</p>
                      <p className="text-xs text-slate-500 truncate">{b.requirement}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/meydan-okumalar"
              className="mt-4 inline-block text-sm font-500 text-diapal-600 hover:underline"
            >
              Meydan okumalar sayfasına git →
            </Link>
          </section>
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm border-rose-100">
            <h3 className="text-lg font-700 text-slate-900 mb-2">Hesap silme</h3>
            <p className="text-sm text-slate-600 mb-4">
              Hesabınızı ve ilişkili verilerinizi kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz (KVKK kapsamında).
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 text-sm font-500 hover:bg-rose-50"
            >
              Hesabımı sil
            </button>
          </section>
        </div>
      ) : (
        <div className="space-y-8">
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-diapal-100 flex items-center justify-center text-diapal-600 font-700 text-2xl">
                {initial}
              </div>
              <div>
                <h2 className="text-xl font-700 text-slate-900">Doktor profili</h2>
                <p className="text-slate-600">Profilini yönet, danışan mesajlarına ve randevu taleplerine yanıt ver.</p>
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-500 text-slate-600">Ad soyad</label>
                <p className="text-slate-900 font-500">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-500 text-slate-600">E-posta</label>
                <p className="text-slate-900 font-500">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-500 text-slate-600">Branş</label>
                <p className="text-slate-900 font-500">{user.branch || '—'}</p>
              </div>
              <div>
                <label className="block text-sm font-500 text-slate-600">Şehir</label>
                <p className="text-slate-900 font-500">{user.city || '—'}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/profil/duzenle"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-diapal-100 text-diapal-700 font-500 hover:bg-diapal-200 transition-colors"
              >
                Profili düzenle
              </Link>
              <button
                type="button"
                onClick={() => { logout(); navigate('/', { replace: true }) }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-500 hover:bg-slate-100 transition-colors"
              >
                Çıkış yap
              </button>
            </div>
          </section>
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-lg font-700 text-slate-900 mb-2">Profil özeti (Supabase)</h3>
            <p className="text-slate-600 text-sm mb-4">Biyografi ve iletişim bilgilerinizi güncelleyin; danışan listesinde görünsün.</p>
            <form onSubmit={handleSaveDoctorProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-500 text-slate-600 mb-1">Biyografi / kısa tanıtım</label>
                <textarea
                  value={doctorBio}
                  onChange={(e) => setDoctorBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  placeholder="Uzmanlık alanınız, deneyim, çalışma şekliniz..."
                />
              </div>
              <div>
                <label className="block text-xs font-500 text-slate-600 mb-1">İletişim (telefon / e-posta)</label>
                <input
                  type="text"
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  placeholder="Örn. +90 212 XXX XX XX"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={doctorOnline}
                  onChange={(e) => setDoctorOnline(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">Online danışmanlık veriyorum</span>
              </label>
              <button
                type="submit"
                disabled={doctorProfileSaving}
                className="px-4 py-2.5 rounded-xl bg-diapal-600 text-white text-sm font-600 hover:bg-diapal-700 disabled:opacity-60"
              >
                {doctorProfileSaving ? 'Kaydediliyor…' : 'Kaydet'}
              </button>
            </form>
          </section>
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-lg font-700 text-slate-900 mb-4">Takip ettiğim danışanlar</h3>
            <p className="text-slate-600 text-sm mb-4">Mesajlaşmaya başladığınız danışanlar burada listelenir.</p>
            {patientsLoading ? (
              <p className="text-slate-500 text-sm">Yükleniyor...</p>
            ) : patients.length === 0 ? (
              <p className="text-slate-500 text-sm">Henüz danışan yok. Danışan mesajlaşmaya başladığında burada görünecek.</p>
            ) : (
              <ul className="space-y-2">
                {patients.map((row) => (
                  <li key={row.patientId} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
                    <span className="font-500 text-slate-900">{row.patientName}</span>
                    <Link
                      to="/mesajlar"
                      state={{ patientId: row.patientId, patientName: row.patientName }}
                      className="text-sm font-500 text-diapal-600 hover:underline"
                    >
                      Mesajlaş
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-lg font-700 text-slate-900 mb-2">Kazanılan rozetler</h3>
            <p className="text-sm text-slate-600 mb-4">Meydan okumaları tamamlayarak kazandığın rozetler.</p>
            {earnedBadges.length === 0 ? (
              <p className="text-slate-500 text-sm mb-3">Henüz rozet kazanmadın.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {earnedBadges.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 min-w-0" title={b.description}>
                    <span className="text-2xl shrink-0">{b.icon}</span>
                    <div className="min-w-0">
                      <p className="font-600 text-slate-900 text-sm truncate">{b.name}</p>
                      <p className="text-xs text-slate-500 truncate">{b.requirement}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/meydan-okumalar" className="mt-4 inline-block text-sm font-500 text-diapal-600 hover:underline">Meydan okumalar sayfasına git →</Link>
          </section>
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm border-rose-100">
            <h3 className="text-lg font-700 text-slate-900 mb-2">Hesap silme</h3>
            <p className="text-sm text-slate-600 mb-4">Hesabınızı kalıcı olarak silebilirsiniz (KVKK). Bu işlem geri alınamaz.</p>
            <button type="button" onClick={() => setShowDeleteModal(true)} className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 text-sm font-500 hover:bg-rose-50">
              Hesabımı sil
            </button>
          </section>
        </div>
      )}

      {showDeleteModal && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-700 text-slate-900">Hesabımı sil</h3>
            <p className="mt-2 text-sm text-slate-600">
              Hesabınız ve ilişkili verileriniz silinecektir. Bu işlem geri alınamaz. KVKK kapsamında kişisel verilerin silinmesi talebiniz işleme alınacaktır.
            </p>
            <label className="mt-4 flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={deleteConsent} onChange={(e) => setDeleteConsent(e.target.checked)} className="mt-1 rounded border-slate-300" />
              <span className="text-sm text-slate-700">Kişisel verilerimin silinmesini ve hesabımın kalıcı olarak kapatılmasını onaylıyorum.</span>
            </label>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => { setShowDeleteModal(false); setDeleteConsent(false) }} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-500">
                İptal
              </button>
              <button
                type="button"
                disabled={!deleteConsent}
                onClick={() => {
                  if (!deleteConsent) return
                  deleteAccount(user.id)
                  setShowDeleteModal(false)
                  navigate('/', { replace: true })
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-600 hover:bg-rose-700 disabled:opacity-50"
              >
                Hesabı sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
