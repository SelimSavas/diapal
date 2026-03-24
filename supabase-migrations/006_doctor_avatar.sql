-- Doktor profil fotoğrafı (URL)
alter table if exists doctor_profiles
  add column if not exists avatar_url text;
