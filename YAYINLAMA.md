# Diapal’i ücretsiz yayınlama (geliştirici ekibine göstermek için)

## Seçenek 1: Vercel (en hızlı, önerilen)

**Ücretsiz**, kredi kartı gerekmez. Birkaç dakikada canlı link alırsınız.

### A) Vercel’e GitHub ile bağlayarak (kalıcı, her push’ta güncellenir)

1. Projeyi GitHub’a yükleyin:
   - [github.com/new](https://github.com/new) → Yeni repo oluşturun (örn. `diapal`)
   - Bilgisayarınızda:
   ```bash
   cd /home/slm/diapal
   git init
   git add .
   git commit -m "Diapal - ilk sürüm"
   git remote add origin https://github.com/KULLANICI_ADIN/diapal.git
   git branch -M main
   git push -u origin main
   ```

2. [vercel.com](https://vercel.com) → **Sign Up** (GitHub ile giriş yapın).

3. **Add New…** → **Project** → `diapal` reposunu **Import** edin.

4. **Deploy**’a tıklayın. Bitince size `https://diapal-xxxx.vercel.app` gibi bir link verilir. Bu linki arkadaşlarınızla / ekiple paylaşın.

### B) Sadece bilgisayardan, Git kullanmadan (tek seferlik deneme)

1. [vercel.com](https://vercel.com) → Giriş yapın (GitHub ile üye olabilirsiniz).

2. Bilgisayarınızda Vercel CLI kurun ve giriş yapın:
   ```bash
   npm i -g vercel
   cd /home/slm/diapal
   vercel
   ```
3. Sorulan sorularda Enter’a basın (varsayılanlar yeterli). En sonda size bir **Preview URL** verilir; bu linki paylaşın.

---

## Seçenek 2: Netlify Drop (sürükle-bırak)

1. Önce projeyi bilgisayarınızda derleyin:
   ```bash
   cd /home/slm/diapal
   npm run build
   ```
2. [app.netlify.com](https://app.netlify.com) → **Sign up** (e-posta veya GitHub).
3. **Sites** → **Add new site** → **Deploy manually**.
4. `dist` klasörünü sürükleyip bırakın (veya **Browse to upload** ile `dist` seçin).
5. Yayınlanan site linki sayfada görünür; bu linki paylaşın.

**Not:** Netlify’da SPA için `dist` içine bir `_redirects` dosyası eklemek gerekebilir (tüm yolları `index.html`’e yönlendirmek için). Gerekirse söyleyin, ekleyelim.

---

## Özet

| Yöntem              | Süre    | Link kalıcı mı?     |
|---------------------|--------|----------------------|
| Vercel + GitHub     | ~5 dk  | Evet, her push’ta güncellenir |
| Vercel CLI          | ~2 dk  | Evet, tek seferlik deploy     |
| Netlify Drop        | ~3 dk  | Evet, manuel yükleme          |

**Geliştirici ekibine göstermek için:** Vercel + GitHub (Seçenek 1A) en mantıklısı; link hep aynı kalır, repoya her push’ta otomatik yeniden yayınlanır.
