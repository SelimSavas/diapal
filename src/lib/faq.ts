/**
 * SSS verisi – arama ve SSS sayfası için ortak.
 */

export type FAQItem = { q: string; a: string; category: string }

export const FAQ_ITEMS: FAQItem[] = [
  { category: 'Genel', q: 'Diapal nedir?', a: 'Diapal, diyabetle yaşayanları bilgi, uzman erişimi ve topluluk desteğiyle buluşturan bir platformdur. Diyabet bilgisi, doktor bulma, forum, karbonhidrat sayacı, HbA1c tahminleyici ve günlük görevler gibi araçlar sunar.' },
  { category: 'Genel', q: 'Diapal ücretsiz mi?', a: 'Evet. Kayıt olup tüm temel özelliklerden ücretsiz faydalanabilirsiniz.' },
  { category: 'Genel', q: 'Diapal tıbbi hizmet veriyor mu?', a: 'Hayır. Diapal bilgilendirme, motivasyon ve topluluk desteği sunar.' },
  { category: 'Hesap ve üyelik', q: 'Nasıl kayıt olurum?', a: 'Sağ üstten "Kayıt Ol"a tıklayın. E-posta, şifre ve ad soyad girin.' },
  { category: 'Hesap ve üyelik', q: 'Şifremi unuttum, ne yapmalıyım?', a: 'Giriş sayfasındaki "Şifremi unuttum" bağlantısını kullanın veya iletişim formu üzerinden yazın.' },
  { category: 'Hesap ve üyelik', q: 'Hesabımı silebilir miyim?', a: 'Evet. Profil sayfasından "Hesabımı sil" ile KVKK kapsamında hesabınızı silebilirsiniz.' },
  { category: 'Araçlar', q: 'Karbonhidrat sayacı nasıl çalışır?', a: 'Yediğiniz yemekleri arayıp porsiyon seçerek tahmini karbonhidrat ve kalori alırsınız.' },
  { category: 'Araçlar', q: 'HbA1c tahminleyici ne işe yarar?', a: 'Girdiğiniz kan şekeri ölçümlerine göre tahmini HbA1c değeri verir.' },
  { category: 'Araçlar', q: 'Günlük görevler ve rozetler nedir?', a: 'Su içme, yürüyüş, sebze tüketimi gibi günlük hedefleri işaretleyerek puan ve rozet kazanırsınız.' },
  { category: 'Forum ve topluluk', q: 'Forumda kimler yazabilir?', a: 'Kayıtlı üyeler konu açabilir ve yanıt yazabilir.' },
  { category: 'Forum ve topluluk', q: 'İçeriklerim silinebilir mi?', a: 'Kullanım şartlarına aykırı içerikler moderasyonla kaldırılabilir.' },
  { category: 'Gizlilik ve güvenlik', q: 'Verilerim nerede tutuluyor?', a: 'Şu an demo aşamasında veriler tarayıcınızda (localStorage) saklanabilir.' },
  { category: 'Gizlilik ve güvenlik', q: 'Kişisel verilerimi nasıl talep edebilirim?', a: 'Gizlilik politikamızda belirtilen haklarınız için iletişim formu veya e-posta ile başvurabilirsiniz.' },
]
