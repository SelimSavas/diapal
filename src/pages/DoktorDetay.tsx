import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDoctorById } from '../lib/doctors'
import { getDoctorProfile } from '../lib/doctorProfiles'
import { isFavorite, toggleFavorite } from '../lib/favorites'

export default function DoktorDetay() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const doctor = id ? getDoctorById(id) : undefined
  const [profileBio, setProfileBio] = useState<string | null>(null)
  const [profilePhone, setProfilePhone] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getDoctorProfile(id).then((p) => {
      if (p) {
        setProfileBio(p.bio)
        setProfilePhone(p.phone)
      } else {
        setProfileBio(null)
        setProfilePhone(null)
      }
    })
  }, [id])

  const [randevuSent, setRandevuSent] = useState(false)
  const [mesajSent, setMesajSent] = useState(false)
  const [randevuDate, setRandevuDate] = useState('')
  const [randevuNote, setRandevuNote] = useState('')
  const [mesajBody, setMesajBody] = useState('')
  const [, setFavVersion] = useState(0)

  const isFav = user && doctor ? isFavorite(user.id, 'doctor', String(doctor.id)) : false

  const handleRandevu = (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctor) return
    // Mock: just show success
    setRandevuSent(true)
    setRandevuDate('')
    setRandevuNote('')
  }

  const handleMesaj = (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctor || !mesajBody.trim()) return
    setMesajSent(true)
    setMesajBody('')
  }

  const handleToggleFav = () => {
    if (!user || !doctor) return
    toggleFavorite(user.id, 'doctor', String(doctor.id))
    setFavVersion((v) => v + 1)
  }

  if (!doctor) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-600">Doktor bulunamadı.</p>
        <Link to="/doktorlar" className="mt-4 inline-block text-diapal-600 font-500 hover:underline">
          Doktor listesine dön
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <Link to="/doktorlar" className="text-sm text-diapal-600 font-500 hover:underline mb-6 inline-block">
        ← Doktor listesine dön
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-diapal-100 flex items-center justify-center text-diapal-600 font-700 text-2xl shrink-0">
              {doctor.name.split(' ')[1]?.[0] ?? 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-800 text-slate-900">{doctor.name}</h1>
                {user && (
                  <button
                    type="button"
                    onClick={handleToggleFav}
                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-rose-500"
                    aria-label={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                  >
                    {isFav ? (
                      <svg className="w-5 h-5 fill-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    )}
                  </button>
                )}
              </div>
              <p className="text-slate-600 font-500">{doctor.branch}</p>
              <p className="text-slate-500 text-sm">{doctor.city}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-amber-600 font-500 text-sm">★ {doctor.rating}</span>
                {doctor.online && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Online</span>
                )}
              </div>
              {(doctor.bio || profileBio) && <p className="mt-4 text-slate-600">{doctor.bio || profileBio}</p>}
              {(doctor.phone || profilePhone) && <p className="mt-2 text-sm text-slate-500">İletişim: {doctor.phone || profilePhone}</p>}
            </div>
          </div>
        </div>

        {/* Randevu talep et */}
        <div className="border-t border-slate-200 p-6 md:p-8">
          <h2 className="text-lg font-700 text-slate-900 mb-4">Randevu talep et</h2>
          {randevuSent ? (
            <p className="text-green-600 font-500">Randevu talebiniz alındı. Doktorumuz en kısa sürede dönüş yapacaktır.</p>
          ) : user ? (
            <form onSubmit={handleRandevu} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-500 text-slate-700 mb-1">Tercih ettiğiniz tarih</label>
                <input
                  type="date"
                  value={randevuDate}
                  onChange={(e) => setRandevuDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-500 text-slate-700 mb-1">Not (isteğe bağlı)</label>
                <textarea
                  value={randevuNote}
                  onChange={(e) => setRandevuNote(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 resize-none"
                  placeholder="Kısa not..."
                />
              </div>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700">
                Randevu talebi gönder
              </button>
            </form>
          ) : (
            <p className="text-slate-600">Randevu veya mesaj göndermek için giriş yapın.</p>
          )}
        </div>

        {/* Canlı sohbet / Mesaj at */}
        <div className="border-t border-slate-200 p-6 md:p-8">
          <h2 className="text-lg font-700 text-slate-900 mb-4">Mesajlaşma</h2>
          {user ? (
            <>
              <p className="text-slate-600 text-sm mb-4">
                {doctor.name} ile canlı sohbet başlatabilir veya kısa mesaj bırakabilirsiniz.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/mesajlar', { state: { doctorId: doctor.id, doctorName: doctor.name } })}
                  className="px-5 py-2.5 rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700"
                >
                  Canlı sohbet başlat
                </button>
              </div>
              <form onSubmit={handleMesaj} className="mt-6 space-y-4 max-w-md">
                <label className="block text-sm font-500 text-slate-700">Kısa mesaj bırak (isteğe bağlı)</label>
                <textarea
                  value={mesajBody}
                  onChange={(e) => setMesajBody(e.target.value)}
                  rows={3}
                  placeholder="Mesajınızı yazın..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 resize-none"
                />
                <button
                  type="submit"
                  disabled={!mesajBody.trim()}
                  className="px-5 py-2.5 rounded-xl border border-diapal-300 text-diapal-700 font-600 hover:bg-diapal-50 disabled:opacity-50"
                >
                  Gönder
                </button>
              </form>
              {mesajSent && <p className="text-green-600 font-500 text-sm mt-2">Mesajınız gönderildi.</p>}
            </>
          ) : (
            <p className="text-slate-600">Mesajlaşmak için giriş yapın.</p>
          )}
        </div>
      </div>
    </div>
  )
}
