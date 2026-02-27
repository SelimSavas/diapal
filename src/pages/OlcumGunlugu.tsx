import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'
import {
  MEASUREMENT_TYPE_LABELS,
  type Measurement,
  type MeasurementType,
} from '../lib/measurements'
import { apiGet, apiPost } from '../lib/api'

export default function OlcumGunlugu() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [list, setList] = useState<Measurement[]>([])
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState('08:00')
  const [value, setValue] = useState('')
  const [type, setType] = useState<MeasurementType>('aclik')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/kayit', { replace: true })
      return
    }
    const load = async () => {
      try {
        setLoading(true)
        const rows = await apiGet<
          { id: number; valueMgDl: number; measuredAt: number; context?: string | null; note?: string | null }[]
        >(user.id, '/api/me/measurements')
        const mapped: Measurement[] = rows.map((r) => {
          const d = new Date(r.measuredAt)
          const dateStr = d.toISOString().slice(0, 10)
          const timeStr = d.toTimeString().slice(0, 5)
          return {
            id: String(r.id),
            userId: user.id,
            date: dateStr,
            time: timeStr,
            value: r.valueMgDl,
            type: (r.context as MeasurementType) || 'diger',
            note: r.note || undefined,
            createdAt: new Date(r.measuredAt).toISOString(),
          }
        })
        // En yeni en üstte
        mapped.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
        setList(mapped)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, navigate])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const v = Number(value.replace(',', '.'))
    if (!v || v <= 0 || v > 500) return
    try {
      setSaving(true)
      const [year, month, day] = date.split('-').map(Number)
      const [hour, minute] = time.split(':').map(Number)
      const measuredAt = new Date(year, (month || 1) - 1, day || 1, hour || 0, minute || 0).getTime()
      await apiPost(user.id, '/api/me/measurements', {
        valueMgDl: v,
        measuredAt,
        context: type,
        note: note.trim() || undefined,
      })
      // Optimistic update: prepend new record
      setList((prev) => [
        {
          id: `temp_${Date.now()}`,
          userId: user.id,
          date,
          time,
          value: v,
          type,
          note: note.trim() || undefined,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])
      setValue('')
      setNote('')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: string) => {
    // Şimdilik backend'de silme endpoint'i yok; sadece önyüzden gizleyelim.
    setList((prev) => prev.filter((m) => m.id !== id))
  }

  const chartData = list
    .slice(0, 30)
    .reverse()
    .map((m) => ({
      label: `${m.date} ${m.time}`,
      short: m.date.slice(5),
      value: m.value,
    }))

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-700 text-slate-900">Üyelere özel</h1>
          <p className="mt-3 text-slate-600">Ölçüm günlüğü için giriş yapın.</p>
          <Link to="/kayit" className="mt-6 inline-block rounded-xl bg-diapal-600 px-6 py-3 text-white font-600 hover:bg-diapal-700">
            Kayıt ol
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-diapal-100 text-diapal-800 px-3 py-1 text-xs font-600 mb-4">
          Üyelere özel
        </div>
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          Ölçüm günlüğü
        </h1>
        <p className="mt-2 text-slate-600">
          Kan şekeri ölçümlerinizi kaydedin; grafikle takip edin. Veriler güvenli bir veritabanında saklanır; tedavi kararı için hekiminize danışın.
        </p>
      </header>

      <form onSubmit={handleAdd} className="rounded-2xl border border-slate-200 bg-white p-5 mb-6 shadow-sm">
        <h2 className="text-lg font-700 text-slate-900 mb-4">Yeni ölçüm ekle</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-500 text-slate-500 mb-1">Tarih</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
              required
            />
          </div>
          <div>
            <label className="block text-xs font-500 text-slate-500 mb-1">Değer (mg/dL)</label>
            <input
              type="number"
              min={1}
              max={500}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Örn. 95"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-500 text-slate-500 mb-1">Tür</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MeasurementType)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            >
              {(Object.keys(MEASUREMENT_TYPE_LABELS) as MeasurementType[]).map((k) => (
                <option key={k} value={k}>{MEASUREMENT_TYPE_LABELS[k]}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-500 text-slate-500 mb-1">Not (isteğe bağlı)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Örn. Kahvaltı sonrası"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 px-4 py-2.5 rounded-xl bg-diapal-600 text-white text-sm font-600 hover:bg-diapal-700 disabled:opacity-60 disabled:pointer-events-none"
        >
          {saving ? 'Kaydediliyor…' : 'Ekle'}
        </button>
      </form>

      {chartData.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6 shadow-sm">
          <h2 className="text-lg font-700 text-slate-900 mb-4">Son ölçümler (grafik)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip formatter={(v) => (v != null ? [`${v} mg/dL`, 'Değer'] : null)} labelFormatter={(_, payload) => payload[0]?.payload?.label} />
                <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <h2 className="text-lg font-700 text-slate-900 px-5 py-4 border-b border-slate-100">
          Kayıtlar
        </h2>
        {loading ? (
          <p className="p-6 text-slate-500 text-sm">Yükleniyor...</p>
        ) : list.length === 0 ? (
          <p className="p-6 text-slate-500 text-sm">Henüz ölçüm eklemediniz.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {list.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-slate-50">
                <div>
                  <span className="font-600 text-slate-900">{m.value} mg/dL</span>
                  <span className="ml-2 text-xs text-slate-500">{MEASUREMENT_TYPE_LABELS[m.type]}</span>
                  <p className="text-xs text-slate-500 mt-0.5">{m.date} {m.time}{m.note ? ` · ${m.note}` : ''}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  className="text-slate-400 hover:text-rose-600 text-sm"
                  aria-label="Sil"
                >
                  Sil
                </button>
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
