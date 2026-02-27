export type MeasurementType = 'aclik' | 'tokluk' | 'diger'

export type Measurement = {
  id: string
  userId?: string
  value: number
  type: MeasurementType
  date: string
  time: string
  note?: string
  createdAt?: string
}

export const MEASUREMENT_TYPE_LABELS: Record<MeasurementType, string> = {
  aclik: 'Açlık',
  tokluk: 'Tokluk',
  diger: 'Diğer',
}
