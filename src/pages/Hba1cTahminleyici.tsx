import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type Measurement = {
  id: string
  date: string
  value: number
  context: 'aclik' | 'tokluk' | 'gece' | 'diger'
}

const CONTEXT_LABELS: Record<Measurement['context'], string> = {
  aclik: 'Açlık',
  tokluk: 'Tokluk',
  gece: 'Gece',
  diger: 'Diğer',
}

// Tahmini HbA1c: ortalama glukoz (mg/dL) -> HbA1c (%)
// Formül: HbA1c ≈ (ortalama_glukoz + 46.7) / 28.7 (ADA uyumlu yaklaşım)
function estimateHba1c(avgGlucose: number): number {
  return Math.round(((avgGlucose + 46.7) / 28.7) * 10) / 10
}

export default function Hba1cTahminleyici() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [measurements, setMeasurements] = useState<Measurement[]>(() => {
    try {
      const raw = localStorage.getItem('diapal_hba1c_measurements')
      if (!raw) return []
      return JSON.parse(raw)
    } catch {
      return []
    }
  })
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [value, setValue] = useState('')
  const [context, setContext] = useState<Measurement['context']>('aclik')

  useEffect(() => {
    if (!user) navigate('/kayit', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    if (measurements.length > 0) {
      localStorage.setItem('diapal_hba1c_measurements', JSON.stringify(measurements))
    } else {
      localStorage.removeItem('diapal_hba1c_measurements')
    }
  }, [measurements])

  const addMeasurement = (e: React.FormEvent) => {
    e.preventDefault()
    const v = Number(value.replace(',', '.'))
    if (!v || v <= 0 || v > 500) return
    setMeasurements((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        date,
        value: v,
        context,
      },
    ])
    setValue('')
  }

  const removeMeasurement = (id: string) => {
    setMeasurements((prev) => prev.filter((m) => m.id !== id))
  }

  const { avgGlucose, estimatedHba1c, count } = useMemo(() => {
    if (measurements.length === 0) return { avgGlucose: 0, estimatedHba1c: null, count: 0 }
    const sum = measurements.reduce((s, m) => s + m.value, 0)
    const avg = sum / measurements.length
    return {
      avgGlucose: Math.round(avg * 10) / 10,
      estimatedHba1c: estimateHba1c(avg),
      count: measurements.length,
    }
  }, [measurements])

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-700 text-slate-900">Üyelere özel</h1>
          <p className="mt-3 text-slate-600">
            HbA1c Tahminleyicisi'ni kullanmak için kayıt olmanız gerekiyor.
          </p>
          <Link
            to="/kayit"
            className="mt-6 inline-block rounded-xl bg-diapal-600 px-6 py-3 text-white font-600 hover:bg-diapal-700 transition-colors"
          >
            Kayıt ol
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-diapal-100 text-diapal-800 px-3 py-1 text-xs font-600 mb-4">
          Üyelere özel
        </div>
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          HbA1c Tahminleyicisi
        </h1>
        <p className="mt-2 text-slate-600">
          Günlük kan şekeri ölçümlerini gir; son 3 aylık dönemi yansıtan tahmini HbA1c değerini gör. Bu araç bilgilendirme amaçlıdır; tanı ve tedavi için mutlaka laboratuvar sonucu ve hekiminize danışın.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
        <h2 className="text-lg font-700 text-slate-900 mb-4">Ölçüm ekle</h2>
        <form onSubmit={addMeasurement} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[120px]">
            <label className="block text-xs font-500 text-slate-600 mb-1">Tarih</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-diapal-500 focus:ring-2 focus:ring-diapal-100 outline-none"
            />
          </div>
          <div className="min-w-[100px]">
            <label className="block text-xs font-500 text-slate-600 mb-1">Değer (mg/dL)</label>
            <input
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Örn. 120"
              min={1}
              max={500}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-diapal-500 focus:ring-2 focus:ring-diapal-100 outline-none"
            />
          </div>
          <div className="min-w-[110px]">
            <label className="block text-xs font-500 text-slate-600 mb-1">Bağlam</label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value as Measurement['context'])}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-diapal-500 focus:ring-2 focus:ring-diapal-100 outline-none"
            >
              {(['aclik', 'tokluk', 'gece', 'diger'] as const).map((k) => (
                <option key={k} value={k}>{CONTEXT_LABELS[k]}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-diapal-600 px-4 py-2.5 text-sm font-600 text-white hover:bg-diapal-700 transition-colors"
          >
            Ekle
          </button>
        </form>
      </section>

      {measurements.length > 0 && (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
            <h2 className="text-lg font-700 text-slate-900 mb-4">Kayıtlı ölçümler ({measurements.length})</h2>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {[...measurements].reverse().map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-sm"
                >
                  <span className="text-slate-700">{m.date}</span>
                  <span className="font-600 text-slate-900">{m.value} mg/dL</span>
                  <span className="text-slate-500 text-xs">{CONTEXT_LABELS[m.context]}</span>
                  <button
                    type="button"
                    onClick={() => removeMeasurement(m.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                    aria-label="Sil"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setMeasurements([])}
              className="mt-3 text-sm text-slate-500 hover:text-rose-600 transition-colors"
            >
              Tümünü temizle
            </button>
          </section>

          <section className="rounded-2xl border-2 border-diapal-200 bg-diapal-50 p-6 shadow-sm">
            <h2 className="text-lg font-700 text-diapal-900 mb-4">Tahmini sonuç</h2>
            <p className="text-slate-600 text-sm mb-4">
              {count} ölçüme göre ortalama kan şekerin ve buna dayalı tahmini HbA1c aşağıdadır. Daha fazla ölçüm (özellikle farklı günler ve açlık/tokluk) tahmini güçlendirir.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white border border-diapal-100 p-4">
                <p className="text-xs font-500 text-diapal-700">Ortalama kan şekeri</p>
                <p className="text-2xl font-800 text-slate-900 mt-1">{avgGlucose} <span className="text-sm font-500">mg/dL</span></p>
              </div>
              <div className="rounded-xl bg-white border border-diapal-100 p-4">
                <p className="text-xs font-500 text-diapal-700">Tahmini HbA1c (3 aylık)</p>
                <p className="text-2xl font-800 text-diapal-700 mt-1">{estimatedHba1c} <span className="text-sm font-500">%</span></p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-600">
              Bu hesaplama tıbbi tanı yerine geçmez. Resmi HbA1c sonucu için laboratuvar testi yaptırın ve hekiminizle değerlendirin.
            </p>
          </section>
        </>
      )}

      {measurements.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          <p>Henüz ölçüm eklemediniz. Yukarıdaki formdan tarih ve değer girerek ekleyin; tahmini HbA1c otomatik hesaplanacaktır.</p>
        </div>
      )}
    </div>
  )
}
