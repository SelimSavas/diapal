import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProgressForDisplay, BADGES } from '../lib/challenges'

export default function Profil() {
  const navigate = useNavigate()
  const { user, deleteAccount, logout } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConsent, setDeleteConsent] = useState(false)

  useEffect(() => {
    if (!user) navigate('/giris', { replace: true })
  }, [user, navigate])

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
                <h2 className="text-xl font-700 text-slate-900">Hasta profili</h2>
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
                <p className="text-slate-900 font-500">Hasta</p>
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
                <p className="text-slate-600">Profilini yönet, hasta mesajlarına ve randevu taleplerine yanıt ver.</p>
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
            <h3 className="text-lg font-700 text-slate-900 mb-4">Hasta mesajları & randevular</h3>
            <p className="text-slate-600 text-sm">Bu bölüm gerçek uygulamada gelen mesaj ve randevu taleplerini listeler.</p>
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
