# Diapal — Diyabetteki Dostun

Diyabet hastaları ve doktorları bir araya getiren, tamamen Türkçe web platformu.

## Özellikler

- **Ana sayfa** — Tanıtım, güven veren mesaj ve hızlı erişim
- **Diyabet bilgisi** — Kategorilere ayrılmış bilgi sayfaları (Tip 1, Tip 2, beslenme, egzersiz, günlük yaşam)
- **Doktor bul** — Uzman listesi, filtreler (branş, şehir, online)
- **Forum** — Kategori bazlı topluluk tartışmaları
- **Kayıt / Giriş** — Hasta veya doktor olarak profil oluşturma
- **Profil** — Hasta ve doktor için ayrı profil sayfaları

## Teknolojiler

- React 19 + TypeScript
- Vite 7
- React Router
- Tailwind CSS v4

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:5173](http://localhost:5173) adresini açın.

## Derleme

```bash
npm run build
npm run preview   # production önizleme
```

## Proje yapısı

- `src/components/` — Layout, Header, Footer
- `src/pages/` — Ana Sayfa, Bilgi, Doktorlar, Forum, Giriş, Kayıt, Profil
- `src/index.css` — Tailwind ve tema (Diapal renkleri)

Bu proje bilgilendirme ve arayüz demo amaçlıdır. Canlı kullanım için backend (kimlik doğrulama, veritabanı, forum API) eklenmelidir.
