import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDoctors, DOCTOR_FILTERS } from '../lib/doctors'
import { getDoctorAvatarUrls } from '../lib/doctorProfiles'
import { isFavorite, toggleFavorite } from '../lib/favorites'

function DoctorAvatar({ name, url, size = 'md' }: { name: string; url?: string | null; size?: 'md' | 'lg' }) {
  const initial = name.split(/\s+/).filter(Boolean).pop()?.[0] ?? name[0] ?? 'D'
  const wrap =
    size === 'lg'
      ? 'w-20 h-20 text-2xl'
      : 'w-14 h-14 text-lg'
  if (url?.trim()) {
    return (
      <div className={`${wrap} rounded-full overflow-hidden bg-diapal-100 shrink-0 ring-2 ring-white shadow-sm`}>
        <img src={url.trim()} alt="" className="w-full h-full object-cover" />
      </div>
    )
  }
  return (
    <div className={`${wrap} rounded-full bg-diapal-100 flex items-center justify-center text-diapal-600 font-700 shrink-0`}>
      {initial}
    </div>
  )
}

export default function Doktorlar() {
  const { user } = useAuth()
  const [selectedFilter, setSelectedFilter] = useState('Tümü')
  const [favVersion, setFavVersion] = useState(0)
  const [avatarById, setAvatarById] = useState<Record<string, string | null>>({})

  const doctors = useMemo(() => {
    const list = getDoctors()
    if (selectedFilter === 'Tümü') return list
    if (selectedFilter === 'Online') return list.filter((d) => d.online)
    return list.filter((d) => d.branch.includes(selectedFilter))
  }, [selectedFilter, favVersion])

  useEffect(() => {
    const ids = doctors.map((d) => d.id)
    if (ids.length === 0) {
      setAvatarById({})
      return
    }
    getDoctorAvatarUrls(ids).then(setAvatarById)
  }, [doctors])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          Doktor bul
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Diyabet ve endokrinoloji alanında uzman doktorlarla tanış, randevu al veya danışmanlık iste.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {DOCTOR_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setSelectedFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-500 transition-colors ${
              selectedFilter === f
                ? 'bg-diapal-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-diapal-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {doctors.map((doc) => {
          const isFav = user ? isFavorite(user.id, 'doctor', String(doc.id)) : false
          return (
            <div
              key={doc.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex gap-4">
                <DoctorAvatar name={doc.name} url={avatarById[doc.id]} />
                <div>
                  <h2 className="text-lg font-700 text-slate-900">{doc.name}</h2>
                  <p className="text-slate-600 text-sm">{doc.branch}</p>
                  <p className="text-slate-500 text-sm">{doc.city}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {doc.online && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Online</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 items-center">
                {user && (
                  <button
                    type="button"
                    onClick={() => { toggleFavorite(user.id, 'doctor', String(doc.id)); setFavVersion((v) => v + 1) }}
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
                <Link
                  to={`/doktorlar/${doc.id}`}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-500 hover:bg-slate-50"
                >
                  Profil
                </Link>
                <Link
                  to={user ? `/doktorlar/${doc.id}` : '/giris'}
                  className="px-4 py-2 rounded-lg bg-diapal-600 text-white text-sm font-500 hover:bg-diapal-700"
                >
                  Randevu / Mesaj
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-center text-slate-500 text-sm">
        Doktor hesapları yönetici tarafından oluşturulur; profil fotoğrafı ve bilgileri doktor panelinden güncellenebilir.
      </p>
    </div>
  )
}
