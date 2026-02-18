import { Link } from 'react-router-dom'

export default function KullanimSartlari() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900 tracking-tight">
          Kullanım Şartları
        </h1>
        <p className="mt-2 text-slate-600 text-sm">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </p>
      </header>

      <article className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">1. Kabul</h2>
          <p>
            Diapal platformunu kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız platformu kullanmayınız.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">2. Hizmetin niteliği</h2>
          <p>
            Diapal, diyabetle ilgili bilgilendirme, topluluk desteği, doktor listesi ve çeşitli araçlar (karbonhidrat sayacı, HbA1c tahminleyici, günlük görevler vb.) sunar. Platform teşhis, tedavi veya tıbbi tavsiye yerine geçmez. Sağlık kararlarınız için mutlaka hekiminize veya diyetisyeninize danışın.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">3. Hesap ve güvenlik</h2>
          <p>
            Kayıt sırasında verdiğiniz bilgilerin doğru olması ve şifrenizi gizli tutmanız sizin sorumluluğunuzdadır. Hesabınız üzerinden yapılan işlemlerden siz sorumlusunuz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">4. Kullanıcı davranışı</h2>
          <p>
            Forum ve diğer alanlarda yasalara, başkalarının haklarına ve saygıya uygun davranmanız beklenir. Hakaret, yanıltıcı bilgi, spam veya zararlı içerik yasaktır. İhlal durumunda içerik kaldırılabilir ve hesabınız askıya alınabilir veya sonlandırılabilir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">5. Fikri mülkiyet</h2>
          <p>
            Diapal’a ait marka, logo ve içeriklerin izinsiz kullanımı yasaktır. Paylaştığınız içeriklerin size ait veya paylaşım yetkiniz olduğundan emin olun.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">6. Sorumluluk sınırı</h2>
          <p>
            Platform “olduğu gibi” sunulmaktadır. Diapal, kullanımdan doğan dolaylı veya doğrudan zararlardan, veri kaybından veya tıbbi sonuçlardan sorumlu tutulamaz. Araçlardaki tahminler ve bilgiler bilgilendirme amaçlıdır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">7. Değişiklikler</h2>
          <p>
            Kullanım şartları ve gizlilik politikası güncellenebilir. Önemli değişiklikler sitede veya e-posta ile duyurulur. Kullanıma devam etmeniz güncel şartları kabul anlamına gelir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-700 text-slate-900 mt-8 mb-2">8. İletişim</h2>
          <p>
            Sorularınız için: diapal@gmail.com veya sitedeki iletişim formu.
          </p>
        </section>
      </article>

      <p className="mt-10 text-center text-slate-500 text-sm">
        <Link to="/" className="text-diapal-600 font-500 hover:underline">Ana sayfaya dön</Link>
        {' · '}
        <Link to="/gizlilik" className="text-diapal-600 font-500 hover:underline">Gizlilik politikası</Link>
      </p>
    </div>
  )
}
