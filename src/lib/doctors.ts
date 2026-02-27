export type Doctor = {
  id: string
  name: string
  branch: string
  city: string
  online: boolean
  rating: number
  bio?: string
  phone?: string
}

export const DOCTOR_FILTERS = ['Tümü', 'Endokrinoloji', 'İç Hastalıkları', 'Online'] as const

const USERS_KEY = 'diapal_users'

type StoredUser = {
  id: string
  name: string
  role: 'hasta' | 'doktor' | 'admin'
  branch?: string
  city?: string
}

const SEED_DOCTORS: Doctor[] = [
  {
    id: 'seed_1',
    name: 'Dr. Ayşe Yılmaz',
    branch: 'Endokrinoloji',
    city: 'İstanbul',
    online: true,
    rating: 4.9,
    bio: 'Diyabet ve tiroid hastalıkları üzerine uzman. 15 yıllık deneyim.',
    phone: '+90 212 XXX XX XX',
  },
  {
    id: 'seed_2',
    name: 'Dr. Mehmet Kaya',
    branch: 'İç Hastalıkları',
    city: 'Ankara',
    online: true,
    rating: 4.8,
    bio: 'İç hastalıkları ve diyabet takibi. Online danışmanlık veriyorum.',
    phone: '+90 312 XXX XX XX',
  },
  {
    id: 'seed_3',
    name: 'Dr. Zeynep Demir',
    branch: 'Endokrinoloji',
    city: 'İzmir',
    online: false,
    rating: 4.7,
    bio: 'Endokrinoloji ve metabolizma hastalıkları.',
    phone: '+90 232 XXX XX XX',
  },
  {
    id: 'seed_4',
    name: 'Dr. Can Öztürk',
    branch: 'Endokrinoloji',
    city: 'İstanbul',
    online: true,
    rating: 5.0,
    bio: 'Tip 1 ve Tip 2 diyabet, insülin pompası deneyimi.',
    phone: '+90 212 XXX XX XX',
  },
]

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function getDoctors(): Doctor[] {
  const users = loadUsers()
  const doctors = users.filter((u) => u.role === 'doktor')
  if (doctors.length === 0) return SEED_DOCTORS
  return doctors.map((u) => ({
    id: u.id,
    name: u.name,
    branch: u.branch || 'Doktor',
    city: u.city || '',
    online: true,
    rating: 5,
  }))
}

export function getDoctorById(id: string): Doctor | undefined {
  return getDoctors().find((d) => d.id === id)
}
