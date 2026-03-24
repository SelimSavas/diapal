import { supabase } from './supabaseClient'

export type DoctorProfile = {
  userId: string
  bio: string | null
  phone: string | null
  avatarUrl: string | null
  online: boolean
  updatedAt: string
}

export type DoctorPatientRow = {
  doctorId: string
  patientId: string
  patientName: string
  createdAt: string
}

export async function getDoctorProfile(userId: string): Promise<DoctorProfile | null> {
  const { data, error } = await supabase
    .from('doctor_profiles')
    .select('user_id, bio, phone, avatar_url, online, updated_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data) return null
  return {
    userId: data.user_id,
    bio: data.bio ?? null,
    phone: data.phone ?? null,
    avatarUrl: (data as { avatar_url?: string | null }).avatar_url ?? null, // sütun migration sonrası
    online: data.online ?? true,
    updatedAt: data.updated_at,
  }
}

export async function upsertDoctorProfile(
  userId: string,
  fields: { bio?: string | null; phone?: string | null; avatarUrl?: string | null; online?: boolean }
): Promise<void> {
  const payload: Record<string, unknown> = {
    user_id: userId,
    updated_at: new Date().toISOString(),
  }
  if (fields.bio !== undefined) payload.bio = fields.bio
  if (fields.phone !== undefined) payload.phone = fields.phone
  if (fields.avatarUrl !== undefined) payload.avatar_url = fields.avatarUrl
  if (fields.online !== undefined) payload.online = fields.online
  await supabase.from('doctor_profiles').upsert(payload, { onConflict: 'user_id' })
}

/** Liste kartları için: birden fazla doktorun avatar URL’lerini tek sorguda alır */
export async function getDoctorAvatarUrls(userIds: string[]): Promise<Record<string, string | null>> {
  if (userIds.length === 0) return {}
  const { data, error } = await supabase
    .from('doctor_profiles')
    .select('user_id, avatar_url')
    .in('user_id', userIds)
  if (error) return {}
  const out: Record<string, string | null> = {}
  for (const r of data ?? []) {
    out[r.user_id as string] = (r.avatar_url as string | null) ?? null
  }
  return out
}

export async function getPatientsForDoctor(doctorId: string): Promise<DoctorPatientRow[]> {
  const { data, error } = await supabase
    .from('doctor_patients')
    .select('doctor_id, patient_id, patient_name, created_at')
    .eq('doctor_id', doctorId)
    .order('created_at', { ascending: false })
  if (error) return []
  return (data ?? []).map((r) => ({
    doctorId: r.doctor_id,
    patientId: r.patient_id,
    patientName: r.patient_name,
    createdAt: r.created_at,
  }))
}

/** Üye–doktor mesajlaşması başladığında ilişkiyi kaydet (idempotent). */
export async function ensureDoctorPatient(
  doctorId: string,
  patientId: string,
  patientName: string
): Promise<void> {
  await supabase.from('doctor_patients').upsert(
    {
      doctor_id: doctorId,
      patient_id: patientId,
      patient_name: patientName,
    },
    { onConflict: 'doctor_id,patient_id' }
  )
}
