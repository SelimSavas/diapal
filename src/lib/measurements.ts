/**
 * Kan şekeri ölçüm günlüğü – kullanıcı bazlı, localStorage.
 */

export type MeasurementType = 'aclik' | 'tokluk' | 'diger'

export type Measurement = {
  id: string
  userId: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  value: number // mg/dL
  type: MeasurementType
  note?: string
  createdAt: string // ISO
}

const STORAGE_KEY = 'diapal_measurements'

function loadAll(): Measurement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(data: Measurement[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getMeasurementsForUser(userId: string): Measurement[] {
  return loadAll()
    .filter((m) => m.userId === userId)
    .sort((a, b) => {
      const d = a.date.localeCompare(b.date)
      return d !== 0 ? d : a.time.localeCompare(b.time)
    })
    .reverse()
}

export function addMeasurement(
  userId: string,
  input: { date: string; time: string; value: number; type: MeasurementType; note?: string }
): Measurement {
  const all = loadAll()
  const m: Measurement = {
    id: crypto.randomUUID(),
    userId,
    date: input.date,
    time: input.time,
    value: input.value,
    type: input.type,
    note: input.note?.trim() || undefined,
    createdAt: new Date().toISOString(),
  }
  all.push(m)
  saveAll(all)
  return m
}

export function deleteMeasurement(userId: string, id: string): boolean {
  const all = loadAll()
  const idx = all.findIndex((m) => m.userId === userId && m.id === id)
  if (idx === -1) return false
  all.splice(idx, 1)
  saveAll(all)
  return true
}

export const MEASUREMENT_TYPE_LABELS: Record<MeasurementType, string> = {
  aclik: 'Açlık',
  tokluk: 'Tokluk',
  diger: 'Diğer',
}
