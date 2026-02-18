import { Link } from 'react-router-dom'

export default function Gizlilik() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900 tracking-tight">
          Gizlilik Politikası
        </h1>
        <p className="mt-2 text-slate-600 text-sm">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </p>
      </header>

      <article className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">1. Veri sorumlusu</h2>
          <p>
            Diapal platformu kapsamında kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri sorumlusu sıfatıyla Diapal tarafından işlenmektedir. İletişim: diapal@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">2. İşlenen veriler</h2>
          <p>
            Kimlik (ad, soyad), iletişim (e-posta), hesap bilgileri (şifre, hash’lenmiş saklanır), platform kullanım verileri (giriş kayıtları, araç kullanımı), forum ve içerik paylaşımlarınız, iletişim formu ve destek talepleriniz işlenebilir. Özel nitelikli sağlık verisi toplamıyoruz; kullanıcıların kendi girdiği ölçüm/ilaç bilgileri yalnızca size özel araçlarda tutulabilir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">3. Amaç ve hukuki sebep</h2>
          <p>
            Verileriniz; hesap oluşturma, hizmet sunumu, iletişim, destek, güvenlik, yasal yükümlülükler ve meşru menfaat kapsamında, KVKK’da belirtilen hukuki sebeplere dayanılarak işlenir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">4. Aktarım</h2>
          <p>
            Verileriniz yalnızca yasal zorunluluk veya hizmet altyapısı (sunucu, e-posta sağlayıcı vb.) gereği, gerekli önlemler alınarak aktarılabilir. Yurt dışı aktarımda KVKK’daki usuller uygulanır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">5. Saklama süresi</h2>
          <p>
            Verileriniz, hizmetin sunulması ve yasal saklama süreleri boyunca saklanır. Hesap silme talebinde, yasal süreler dışında verileriniz silinir veya anonim hale getirilir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">6. Haklarınız</h2>
          <p>
            KVKK md. 11 uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içi/yurt dışında aktarıldığı 3. kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize sonuç doğuran işlemler itiraz etme ve Kanun’da öngörülen şartlarda zararın giderilmesini talep etme haklarına sahipsiniz. Başvurularınızı diapal@gmail.com veya iletişim formu üzerinden iletebilirsiniz; en kısa sürede yanıtlanacaktır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">7. Güvenlik</h2>
          <p>
            Verilerinizin güvenliği için teknik ve idari tedbirler alınmaktadır. Platform bilgilendirme amaçlıdır; tıbbi karar ve tedavi için mutlaka hekiminize danışın.
          </p>
        </section>
      </article>

      <p className="mt-10 text-center text-slate-500 text-sm">
        <Link to="/" className="text-diapal-600 font-500 hover:underline">Ana sayfaya dön</Link>
        {' · '}
        <Link to="/kullanim-sartlari" className="text-diapal-600 font-500 hover:underline">Kullanım şartları</Link>
      </p>
    </div>
  )
}
