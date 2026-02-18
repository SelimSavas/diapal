import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getRemindersForUser,
  getTodaysReminders,
  addReminder,
  toggleReminder,
  deleteReminder,
  DAY_NAMES,
  DAY_LABELS,
  type DayOfWeek,
} from '../lib/reminders'

export default function IlacHatirlatici() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reminders, setReminders] = useState(getRemindersForUser(user?.id ?? ''))
  const [todayList, setTodayList] = useState(getTodaysReminders(user?.id ?? ''))
  const [name, setName] = useState('')
  const [time, setTime] = useState('08:00')
  const [days, setDays] = useState<DayOfWeek[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/kayit', { replace: true })
      return
    }
    setReminders(getRemindersForUser(user.id))
    setTodayList(getTodaysReminders(user.id))
  }, [user, navigate])

  const refresh = () => {
    if (!user) return
    setReminders(getRemindersForUser(user.id))
    setTodayList(getTodaysReminders(user.id))
  }

  const toggleDay = (d: DayOfWeek) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !name.trim()) return
    addReminder(user.id, { name: name.trim(), time, days: days.length > 0 ? days : undefined })
    setName('')
    setTime('08:00')
    setDays([])
    setShowForm(false)
    refresh()
  }

  const handleToggle = (id: string) => {
    if (!user) return
    toggleReminder(user.id, id)
    refresh()
  }

  const handleDelete = (id: string) => {
    if (!user) return
    deleteReminder(user.id, id)
    refresh()
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-700 text-slate-900">Üyelere özel</h1>
          <p className="mt-3 text-slate-600">İlaç hatırlatıcı için giriş yapın.</p>
          <Link to="/kayit" className="mt-6 inline-block rounded-xl bg-diapal-600 px-6 py-3 text-white font-600 hover:bg-diapal-700">
            Kayıt ol
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-diapal-100 text-diapal-800 px-3 py-1 text-xs font-600 mb-4">
          Üyelere özel
        </div>
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          İlaç hatırlatıcı
        </h1>
        <p className="mt-2 text-slate-600">
          İlaç veya ölçüm saatlerinizi ekleyin. Tarayıcı bildirimleri ileride açılabilir; şimdilik liste ile takip edebilirsiniz.
        </p>
      </header>

      <section className="rounded-2xl border border-diapal-200 bg-diapal-50/50 p-5 mb-6">
        <h2 className="text-lg font-700 text-slate-900 mb-3">Bugünkü hatırlatmalar</h2>
        {todayList.length === 0 ? (
          <p className="text-slate-600 text-sm">Bugün için kayıtlı hatırlatma yok.</p>
        ) : (
          <ul className="space-y-2">
            {todayList.map((r) => (
              <li key={r.id} className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-diapal-200 text-diapal-800 font-600 text-sm">
                  {r.time}
                </span>
                <span className="font-500 text-slate-900">{r.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-700 text-slate-900">Tüm hatırlatmalar</h2>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl bg-diapal-600 text-white text-sm font-600 hover:bg-diapal-700"
          >
            {showForm ? 'İptal' : '+ Ekle'}
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleAdd} className="p-5 border-b border-slate-100 space-y-4">
            <div>
              <label className="block text-xs font-500 text-slate-500 mb-1">İlaç / hatırlatma adı</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Sabah insülini, Metformin"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-500 text-slate-500 mb-1">Saat</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-500 text-slate-500 mb-2">Günler (boş = her gün)</label>
              <div className="flex flex-wrap gap-2">
                {DAY_NAMES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-500 ${
                      days.includes(d) ? 'bg-diapal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {DAY_LABELS[d]}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="px-4 py-2.5 rounded-xl bg-diapal-600 text-white text-sm font-600 hover:bg-diapal-700">
              Kaydet
            </button>
          </form>
        )}
        {reminders.length === 0 ? (
          <p className="p-6 text-slate-500 text-sm">Henüz hatırlatma eklemediniz.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {reminders.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="font-600 text-slate-900 tabular-nums">{r.time}</span>
                  <span className={r.enabled ? 'text-slate-900' : 'text-slate-400 line-through'}>{r.name}</span>
                  {r.days.length > 0 && (
                    <span className="text-xs text-slate-500">
                      {r.days.map((d) => DAY_LABELS[d]).join(', ')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggle(r.id)}
                    className={`px-2 py-1 rounded text-xs font-500 ${r.enabled ? 'bg-slate-200 text-slate-700' : 'bg-diapal-100 text-diapal-700'}`}
                  >
                    {r.enabled ? 'Kapat' : 'Aç'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="text-slate-400 hover:text-rose-600 text-sm"
                    aria-label="Sil"
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 text-center">
        <Link to="/profil" className="text-diapal-600 font-500 hover:underline">← Profile dön</Link>
      </p>
    </div>
  )
}
