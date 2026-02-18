export type Doctor = {
  id: number
  name: string
  branch: string
  city: string
  online: boolean
  rating: number
  bio?: string
  phone?: string
}

export const DOCTOR_FILTERS = ['Tümü', 'Endokrinoloji', 'İç Hastalıkları', 'Online'] as const

export const MOCK_DOCTORS: Doctor[] = [
  { id: 1, name: 'Dr. Ayşe Yılmaz', branch: 'Endokrinoloji', city: 'İstanbul', online: true, rating: 4.9, bio: 'Diyabet ve tiroid hastalıkları üzerine uzman. 15 yıllık deneyim.', phone: '+90 212 XXX XX XX' },
  { id: 2, name: 'Dr. Mehmet Kaya', branch: 'İç Hastalıkları', city: 'Ankara', online: true, rating: 4.8, bio: 'İç hastalıkları ve diyabet takibi. Online danışmanlık veriyorum.', phone: '+90 312 XXX XX XX' },
  { id: 3, name: 'Dr. Zeynep Demir', branch: 'Endokrinoloji', city: 'İzmir', online: false, rating: 4.7, bio: 'Endokrinoloji ve metabolizma hastalıkları.', phone: '+90 232 XXX XX XX' },
  { id: 4, name: 'Dr. Can Öztürk', branch: 'Endokrinoloji', city: 'İstanbul', online: true, rating: 5.0, bio: 'Tip 1 ve Tip 2 diyabet, insülin pompası deneyimi.', phone: '+90 212 XXX XX XX' },
]

export function getDoctors(): Doctor[] {
  return MOCK_DOCTORS
}

export function getDoctorById(id: string | number): Doctor | undefined {
  const n = typeof id === 'string' ? parseInt(id, 10) : id
  return MOCK_DOCTORS.find((d) => d.id === n)
}
