-- Doktor profili (bio, iletişim, online)
create table if not exists doctor_profiles (
  user_id text primary key,
  bio text,
  phone text,
  online boolean default true,
  updated_at timestamptz default now()
);

-- Doktor–hasta eşleşmesi (mesajlaşma veya randevu ile oluşur)
create table if not exists doctor_patients (
  doctor_id text not null,
  patient_id text not null,
  patient_name text not null,
  created_at timestamptz default now(),
  primary key (doctor_id, patient_id)
);

create index if not exists idx_doctor_patients_doctor on doctor_patients(doctor_id);
create index if not exists idx_doctor_patients_patient on doctor_patients(patient_id);
