import { useState } from 'react'

const categories = [
  { id: 'genel', label: 'Genel Bilgi' },
  { id: 'tip1', label: 'Tip 1 Diyabet' },
  { id: 'tip2', label: 'Tip 2 Diyabet' },
  { id: 'beslenme', label: 'Beslenme' },
  { id: 'egzersiz', label: 'Egzersiz' },
  { id: 'yasam', label: 'Günlük Yaşam' },
]

type BilgiArticle = { title: string; content: string[] }

const articles: Record<string, BilgiArticle[]> = {
  genel: [
    {
      title: 'Diyabet nedir?',
      content: [
        'Diyabet, kan şekerinin (glikoz) sürekli yüksek seyretmesiyle karakterize kronik bir metabolizma hastalığıdır. Vücudumuz yediğimiz besinlerden, özellikle karbonhidratlardan glikoz üretir. Glikoz, hücrelerimizin enerji kaynağıdır; ancak hücrelere girebilmesi için pankreastan salgılanan insülin hormonuna ihtiyaç vardır. İnsülin üretiminin azalması, hiç olmaması veya vücudun insülini etkili kullanamaması (insülin direnci) durumunda kan şekeri yükselir ve diyabet ortaya çıkar.',
        'Diyabet, dünya genelinde milyonlarca insanı etkileyen ve yaşam boyu takip gerektiren bir sağlık sorunudur. Erken tanı ve düzenli tedavi ile kan şekeri kontrol altında tutulabilir; kontrolsüz diyabet ise kalp-damar hastalıkları, böbrek yetmezliği, görme kaybı, sinir hasarı ve ayak yaraları gibi ciddi komplikasyonlara yol açabilir. Bu nedenle diyabetin ne olduğunu anlamak, belirtilerini bilmek ve düzenli sağlık kontrollerine gitmek büyük önem taşır.',
        'Diyabetin tek bir nedeni yoktur; genetik yatkınlık, hareketsiz yaşam, sağlıksız beslenme, fazla kilo, ileri yaş ve bazı enfeksiyonlar gibi birçok faktör rol oynayabilir. Tip 1 ve Tip 2 diyabetin oluşum mekanizmaları farklıdır; ancak her iki tipte de hedef, kan şekerini mümkün olduğunca hedef aralıkta tutmak ve uzun vadeli sağlığı korumaktır. Bu sayfadaki bilgiler yalnızca eğitim amaçlıdır; tanı ve tedavi için mutlaka bir hekime başvurulmalıdır.',
      ],
    },
    {
      title: 'Diyabet türleri',
      content: [
        'Diyabet, başlıca Tip 1, Tip 2 ve gebelik diyabeti olmak üzere farklı türlere ayrılır. Ayrıca tek gen mutasyonlarına bağlı MODY (Maturity Onset Diabetes of the Young), pankreas hastalıklarına veya ilaç kullanımına bağlı diyabet gibi daha nadir tipler de vardır. Hangi türde olduğunuz, tedavi seçeneklerinizi ve takip sıklığınızı belirleyeceği için doğru tanı çok önemlidir.',
        'Tip 1 diyabet, genellikle çocukluk veya genç erişkinlikte ortaya çıkan ve pankreastaki beta hücrelerinin bağışıklık sistemi tarafından tahrip edilmesiyle insülin üretiminin durması sonucu gelişir. Tip 2 diyabet ise daha çok yetişkinlerde görülür; insülin direnci ve zamanla insülin salgısının yetersiz kalması söz konusudur. Gebelik diyabeti, hamilelik sırasında ilk kez tespit edilen kan şekeri yüksekliğidir ve doğumdan sonra düzelebilir veya Tip 2 diyabete dönüşebilir.',
        'Her diyabet türünde tedavi ve yaşam tarzı önerileri farklılık gösterebilir. Örneğin Tip 1 diyabette yaşam boyu insülin kullanımı gerekirken, Tip 2 diyabette önce beslenme, egzersiz ve ağızdan alınan ilaçlarla başlanabilir. Tanı ve tedavi planınızı mutlaka bir endokrinoloji veya iç hastalıkları uzmanı ile birlikte oluşturmalısınız.',
      ],
    },
    {
      title: 'Belirtiler ve tanı',
      content: [
        'Diyabetin klasik belirtileri arasında sık idrara çıkma (poliüri), aşırı susama (polidipsi), açıklanamayan kilo kaybı, sürekli yorgunluk, bulanık görme ve yaraların geç iyileşmesi sayılabilir. Özellikle Tip 1 diyabette bu belirtiler hızla gelişebilir; Tip 2 diyabette ise yıllar içinde sessizce ilerleyebilir ve bazen tesadüfen yapılan bir kan tahlilinde ortaya çıkabilir.',
        'Tanı, açlık kan şekeri, oral glukoz tolerans testi (OGTT) veya HbA1c (son 2–3 aylık ortalama kan şekeri) ölçümüyle konur. Açlık kan şekerinin 126 mg/dL ve üzeri olması, OGTT’de 2. saat kan şekerinin 200 mg/dL ve üzeri olması veya HbA1c’nin %6,5 ve üzeri olması diyabet tanısı koydurur. Bu testlerin tekrarlanması ve hekim değerlendirmesi gerekebilir.',
        'Erken tanı, komplikasyonların önlenmesi açısından hayati öneme sahiptir. Ailenizde diyabet öyküsü varsa, fazla kiloluysanız veya yukarıdaki belirtilerden herhangi birini yaşıyorsanız, bir sağlık kuruluşuna başvurarak kan şekeri ölçümü yaptırmanız önerilir.',
      ],
    },
    {
      title: 'Diyabette komplikasyonlar ve korunma',
      content: [
        'Uzun süre kontrolsüz kalan diyabet, vücudun birçok organ ve sisteminde hasara yol açabilir. Makrovasküler komplikasyonlar arasında kalp krizi, inme ve bacak damar tıkanıklıkları sayılır. Mikrovasküler komplikasyonlar ise böbrek yetmezliği (diyabetik nefropati), göz hasarı (diyabetik retinopati) ve sinir hasarı (nöropati) şeklinde kendini gösterir. Ayaklarda his kaybı ve yara açılması da diyabete bağlı ciddi sorunlardandır.',
        'Komplikasyonlardan korunmanın en etkili yolu kan şekerini, tansiyonu ve kolesterolü hedef aralıkta tutmaktır. Düzenli HbA1c ölçümü, göz ve böbrek kontrolleri, ayak muayenesi ve kalp-damar riskinin değerlendirilmesi, hekiminizle yapacağınız periyodik takiplerin bir parçası olmalıdır.',
        'Sağlıklı beslenme, düzenli egzersiz, ilaç veya insülin tedavisine uyum ve sigaradan uzak durmak, uzun vadeli sağlığınızı korumada büyük rol oynar. Bu bilgiler genel bilgilendirme amaçlıdır; kişiye özel risk ve önlemler için mutlaka hekiminize danışın.',
      ],
    },
  ],
  tip1: [
    {
      title: 'Tip 1 diyabet nedir?',
      content: [
        'Tip 1 diyabet, pankreastaki insülin üreten beta hücrelerinin, vücudun kendi bağışıklık sistemi tarafından yanlışlıkla tahrip edilmesi sonucu gelişen otoimmün bir hastalıktır. Bu nedenle vücut ya çok az insülin üretir ya da hiç üretmez. İnsülin olmadan glikoz hücrelere giremez ve kanda birikerek kan şekerini yükseltir. Tip 1 diyabet genellikle çocukluk veya genç erişkinlik döneminde ortaya çıkar; ancak her yaşta da görülebilir.',
        'Hastalığın nedeni tam olarak bilinmemekle birlikte genetik yatkınlık ve çevresel tetikleyiciler (bazı viral enfeksiyonlar gibi) üzerinde durulmaktadır. Tip 1 diyabet, yaşam tarzı veya kiloyla doğrudan ilişkili değildir; yani “şeker yediği için” veya “kilo aldığı için” Tip 1 diyabet olunmaz. Tanı konduktan sonra yaşam boyu insülin tedavisi gerekir.',
        'Tip 1 diyabetli bireyler, günlük insülin enjeksiyonları veya insülin pompası kullanımı, düzenli kan şekeri ölçümü ve karbonhidrat sayımı ile sağlıklı ve aktif bir yaşam sürebilir. Eğitim ve destek, hastalıkla başa çıkmada çok önemlidir; bu nedenle diyabet ekibi (hekim, diyetisyen, diyabet eğitim hemşiresi) ile iş birliği yapmak büyük fayda sağlar.',
      ],
    },
    {
      title: 'İnsülin tedavisi',
      content: [
        'Tip 1 diyabette pankreas yeterli insülin üretmediği için dışarıdan insülin vermek zorunludur. İnsülin, enjeksiyon veya pompa yoluyla cilt altına (subkutan) uygulanır; ağızdan alınan bir insülin formu henüz yaygın kullanımda değildir. İnsülinler etki sürelerine göre hızlı etkili (prandiyal), kısa etkili, orta etkili ve uzun etkili (bazal) olarak sınıflandırılır. Hekiminiz, günlük rutininize ve kan şekeri ölçümlerinize göre size uygun bir rejim planlar.',
        'Günümüzde birçok Tip 1 diyabetli, “bazal-bolus” rejimi kullanır: günde bir veya iki kez uzun etkili insülin (bazal) ile gün boyu temel ihtiyacı karşılarken, öğünlerde hızlı etkili insülin (bolus) ile yemekle alınan karbonhidrata göre doz ayarlanır. Bu sayede daha esnek beslenme ve daha iyi kan şekeri kontrolü mümkün olabilir. İnsülin pompası kullananlarda ise sürekli küçük miktarda hızlı etkili insülin verilir; öğünlerde ek doz (bolus) yapılır.',
        'İnsülin dozunu asla kendi başınıza bırakmamalı veya büyük ölçüde değiştirmemelisiniz. Hipoglisemi (düşük kan şekeri) ve hiperglisemi (yüksek kan şekeri) belirtilerini öğrenmek, doz ve öğün zamanlamasını hekiminizle birlikte gözden geçirmek ve düzenli kontrollere gitmek tedavinin güvenli ve etkili olması için şarttır.',
      ],
    },
    {
      title: 'Kan şekeri takibi ve hedefler',
      content: [
        'Tip 1 diyabette kan şekerini düzenli ölçmek, tedavinin etkinliğini anlamanın ve hem hipoglisemiyi hem de yüksek kan şekerini önlemenin temelidir. Günümüzde parmak ucundan ölçüm yapan glukometrelerin yanı sıra, sürekli glukoz izleme (CGM) sistemleri de kullanılmaktadır. CGM, interstisyel sıvıdaki glikozu ölçerek eğilimleri gösterir ve alarmlarla düşük-yüksek uyarısı verebilir; ancak kalibrasyon ve hekim önerisi önemlidir.',
        'Hedef kan şekeri aralıkları kişiye göre değişebilir. Genel olarak açlık veya ön öğün kan şekeri 80–130 mg/dL, öğünden 1–2 saat sonra 180 mg/dL’nin altında tutulmaya çalışılır. HbA1c hedefi çoğu yetişkin için %7’nin altıdır; yaş, hipoglisemi riski ve eşlik eden hastalıklara göre hekiminiz farklı bir hedef belirleyebilir. Çocuklarda hedefler yaşa göre değişir.',
        'Ölçüm sonuçlarını bir deftere veya uygulamaya kaydetmek, hekiminizle paylaşmak ve insülin dozu, öğün içeriği ve egzersizle ilişkilendirmek, tedavinin ince ayarını kolaylaştırır. Ani düşüş veya yükselişlerde mutlaka hekiminize veya diyabet ekibinize danışın.',
      ],
    },
    {
      title: 'Hipoglisemi ve hiperglisemi',
      content: [
        'Hipoglisemi (kan şekerinin 70 mg/dL’nin altına düşmesi), titreme, terleme, açlık, sinirlilik, bulanık görme ve konsantrasyon güçlüğü gibi belirtilerle kendini gösterir. Şiddetli hipoglisemide bilinç kaybı ve nöbet gelişebilir. Hızlı etkili karbonhidrat (örneğin 3–4 kesme şeker, meyve suyu veya glukoz tableti) alınması ve 15 dakika sonra kan şekerinin tekrar ölçülmesi önerilir. Sık hipoglisemi yaşıyorsanız doz ve öğün düzeni mutlaka hekiminizle gözden geçirilmelidir.',
        'Hiperglisemi (kan şekerinin hedefin üzerinde olması) ise yeterli insülin olmaması, hastalık, stres veya fazla karbonhidrat alımı gibi nedenlerle ortaya çıkabilir. Uzun süre yüksek kan şekeri, ketoasidoz (özellikle Tip 1’de tehlikeli) veya uzun vadede organ hasarı riskini artırır. Yüksek ölçümlerde insülin dozunu kendi başınıza büyük değişikliklerle oynamak yerine hekiminize danışmanız güvenli olacaktır.',
        'Hem hipo hem hiperglisemi belirtilerini tanımak, yanınızda hızlı karbonhidrat ve acil iletişim bilgileri bulundurmak ve ailenizin/çevrenizin bu konuda bilgilendirilmesi, güvenliğiniz açısından çok önemlidir.',
      ],
    },
  ],
  tip2: [
    {
      title: 'Tip 2 diyabet nedir?',
      content: [
        'Tip 2 diyabet, vücudun insülini etkili kullanamaması (insülin direnci) ve zamanla pankreasın da yeterli insülin üretememesi sonucu gelişen en yaygın diyabet türüdür. Genellikle yetişkinlikte, özellikle 45 yaş sonrasında görülür; ancak hareketsiz yaşam ve obezitenin artışıyla birlikte gençlerde ve çocuklarda da görülme sıklığı artmaktadır. Genetik yatkınlık, fazla kilo (özellikle karın bölgesinde), hareketsizlik ve sağlıksız beslenme önemli risk faktörleridir.',
        'İnsülin direnci, hücrelerin insüline yanıtının zayıflaması demektir; pankreas daha fazla insülin salgılayarak bunu telafi etmeye çalışır. Yıllar içinde pankreas yorulabilir ve salgı yetersiz kalabilir; bu noktada kan şekeri yükselmeye başlar. Tip 2 diyabet sıklıkla yavaş ve sessiz ilerlediği için belirtiler hafif olabilir veya geç fark edilebilir; bu nedenle risk taşıyan kişilerde tarama önemlidir.',
        'Tip 2 diyabet tedavisinde öncelik yaşam tarzı değişiklikleridir: sağlıklı beslenme, düzenli fiziksel aktivite ve kilo yönetimi. Bunlar yeterli olmazsa ağızdan alınan antidiyabetik ilaçlar veya GLP-1 agonistleri eklenebilir; gerektiğinde insülin tedavisi de başlanabilir. Erken tanı ve tedavi ile komplikasyon riski azaltılabilir.',
      ],
    },
    {
      title: 'Yaşam tarzı değişiklikleri',
      content: [
        'Tip 2 diyabet tedavisinde beslenme, egzersiz ve kilo yönetimi ilaç kadar önemli bir yer tutar. Dengeli, düzenli öğünlerle beslenmek, basit şeker ve işlenmiş gıdaları azaltmak, tam tahıllar, sebze, meyve (porsiyon kontrolüyle), yağsız protein ve sağlıklı yağlara yer vermek kan şekeri kontrolünü kolaylaştırır. Bir diyetisyenle kişiye özel plan yapmak çok faydalıdır.',
        'Haftada en az 150 dakika orta tempoda aerobik aktivite (yürüyüş, yüzme, bisiklet vb.) ve haftada 2–3 gün kuvvet egzersizleri önerilir. Egzersiz, insülin duyarlılığını artırır ve kan şekerini düşürür; ancak ilaç veya insülin kullananlarda hipoglisemi riski olabileceği için hekim ve diyabet ekibi ile uygun egzersiz planı oluşturulmalıdır.',
        'Kilo vermek (özellikle bel çevresindeki fazla yağın azalması) insülin direncini belirgin şekilde iyileştirebilir. Küçük adımlarla başlamak, sürdürülebilir alışkanlıklar edinmek ve kendinizi cezalandırmadan ilerlemek önemlidir. Yaşam tarzı değişiklikleri bazen tek başına kan şekerini hedefe indirebilir; yeterli olmazsa ilaç tedavisi hekiminiz tarafından planlanır.',
      ],
    },
    {
      title: 'İlaç tedavisi',
      content: [
        'Tip 2 diyabette kullanılan ağızdan alınan ilaçlar (oral antidiyabetikler) farklı mekanizmalarla çalışır: metformin, karaciğerden glikoz çıkışını azaltır ve dokuların insüline duyarlılığını artırır; genellikle ilk seçenek olarak önerilir. Sülfonilüreler pankreastan insülin salgısını artırır; glinidler kısa etkili insülin salgılatıcıdır. DPP-4 inhibitörleri ve SGLT2 inhibitörleri de kan şekerini düşürür; SGLT2 inhibitörlerinin kalp ve böbrek koruyucu etkileri nedeniyle bazı hastalarda özellikle tercih edilir. GLP-1 reseptör agonistleri hem kan şekerini düşürür hem de kilo kaybına yardımcı olabilir; enjeksiyon formları mevcuttur.',
        'Zamanla pankreas yeterli insülin üretemez hale gelirse veya ilaçlarla hedefe ulaşılamıyorsa insülin tedavisi eklenebilir. İnsülin, Tip 2 diyabette de güvenle kullanılır; “artık insüline geçtim, her şey bitti” gibi bir düşünce doğru değildir. Hekiminiz, mevcut ilaçlarınızı, böbrek ve karaciğer fonksiyonlarınızı ve eşlik eden hastalıklarınızı dikkate alarak size uygun tedaviyi seçer.',
        'İlaçları reçeteye uygun ve düzenli kullanmak, yan etkileri takip etmek ve periyodik kontrollerle kan şekeri ve HbA1c’yi değerlendirmek tedavinin başarısı için gereklidir. Kendi kendinize ilacı kesmek veya dozu değiştirmek tehlikeli olabilir; her türlü değişiklik hekiminizle yapılmalıdır.',
      ],
    },
    {
      title: 'Tip 2 diyabette özel durumlar',
      content: [
        'Tip 2 diyabetli birçok kişide hipertansiyon ve yüksek kolesterol (dislipidemi) de bulunur. Bu üçü birlikte kalp-damar riskini artırdığı için tansiyon ve kolesterol hedefleri de tedavi planına dahil edilir. Böbrek fonksiyonları düzenli takip edilmeli; böbrek hasarı varsa bazı ilaçlar dozlanır veya değiştirilir. Göz dibi muayenesi (diyabetik retinopati taraması) yılda en az bir kez önerilir.',
        'Hamile kalmayı planlayan veya hamile kalan Tip 2 diyabetli kadınlarda kan şekeri hedefleri sıkılaştırılır ve kullanılan ilaçların gebelikte güvenliliği gözden geçirilir; metformin ve insülin genellikle güvenli kabul edilir. Ameliyat, ciddi enfeksiyon veya stres durumlarında kan şekeri yükselebilir; bu dönemlerde ilaç/insülin ayarı hekim kontrolünde yapılmalıdır.',
        'Tip 2 diyabet yaşam boyu süren bir durumdur; ancak doğru tedavi ve yaşam tarzı ile kaliteli ve sağlıklı bir yaşam sürülebilir. Kendinizi iyi hissettiğinizde bile kontrollerinizi aksatmayın ve hekiminizle iletişimde kalın.',
      ],
    },
  ],
  beslenme: [
    {
      title: 'Diyabette beslenme ilkeleri',
      content: [
        'Diyabette beslenmenin amacı, kan şekerini mümkün olduğunca hedef aralıkta tutarken vücudun ihtiyacı olan enerji ve besin öğelerini karşılamak, ideal vücut ağırlığını korumak veya ulaşmak ve kalp-damar sağlığını desteklemektir. Bunun için düzenli ve dengeli öğünler, karbonhidratın kaliteli kaynaklardan ve porsiyon kontrolüyle alınması, yeterli lif, yağsız protein ve sağlıklı yağlar önerilir.',
        'Karbonhidratlar kan şekerini doğrudan etkiler; bu nedenle “karbonhidrat sayımı” veya “porsiyon kontrolü” birçok diyabetli için faydalıdır. Tam tahıllar (bulgur, yulaf, tam buğday ekmeği), kuru baklagiller, sebzeler ve meyveler (porsiyonuna dikkat ederek) tercih edilebilir; rafine şeker, beyaz un ve şekerli içecekler sınırlandırılmalıdır. Öğünleri atlamamak ve gün içine yaymak kan şekerindeki ani iniş çıkışları azaltır.',
        'Kişiye özel kalori ve karbonhidrat ihtiyacı yaşa, kiloya, aktiviteye ve tedavi türüne göre değişir. Bu nedenle bir diyetisyenle çalışmak, hem günlük planı oluşturmak hem de okul/iş ve sosyal yaşama uyum sağlamak açısından çok değerlidir. Bu bilgiler genel rehber niteliğindedir; bireysel diyet planı için mutlaka bir uzmana danışın.',
      ],
    },
    {
      title: 'Glisemik indeks ve glisemik yük',
      content: [
        'Glisemik indeks (Gİ), bir besinin yenildikten sonra kan şekerini ne kadar hızlı ve ne kadar yükselttiğini, saf glikoza kıyasla (100 kabul edilir) 0–100 arası bir skorla ifade eder. Düşük Gİ’li besinler (örneğin birçok sebze, kuru baklagiller, yulaf) kan şekerini daha yavaş yükseltir; yüksek Gİ’li besinler (beyaz ekmek, patates püresi, şekerli içecekler) ise hızlı yükseltir. Diyabetli bireylerde düşük veya orta Gİ’li besinlere ağırlık vermek, kan şekeri dalgalanmalarını azaltmada yardımcı olabilir.',
        'Ancak Gİ tek başına yeterli değildir; porsiyon büyüklüğü de önemlidir. Glisemik yük (GY), hem Gİ hem de tüketilen karbonhidrat miktarını dikkate alır; böylece bir öğünün kan şekerine etkisi daha gerçekçi tahmin edilebilir. Pratikte “her şeyi yasaklamak” yerine, porsiyonu kontrol etmek ve düşük Gİ’li seçenekleri tercih etmek dengeli bir yaklaşımdır.',
        'Pişirme yöntemi, olgunluk (meyve için) ve besinlerin birlikte tüketilmesi de Gİ’yi etkiler. Örneğin protein ve lif içeren bir öğün, karbonhidratın emilimini yavaşlatabilir. Diyetisyeniniz, günlük menünüzde Gİ ve GY kavramlarını nasıl kullanacağınızı size öğretebilir.',
      ],
    },
    {
      title: 'Örnek menü fikirleri ve pratik ipuçları',
      content: [
        'Kahvaltıda yulaf lapası, tam buğday ekmeği ile peynir-domates-salatalık, yumurta veya omlet gibi protein ve lif içeren seçenekler; ara öğünde bir porsiyon meyve, ceviz veya yoğurt tercih edilebilir. Öğle ve akşam yemeklerinde tabağın yarısını sebze, çeyreğini tam tahıl veya kuru baklagil, çeyreğini yağsız et/tavuk/balık veya yumurta ile doldurmak basit ve etkili bir modeldir. Tatlı ihtiyacı için sütlü tatlılar (şekersiz veya tatlandırıcılı), meyve veya küçük porsiyon kuru meyve ve ceviz düşünülebilir.',
        'Dışarıda yemek yerken soslu ve kızartma yerine ızgara veya buğulama, salata ve tam tahıllı seçeneklere yönelmek; porsiyonu paylaşmak veya yarım porsiyon istemek faydalı olabilir. Alkol tüketiyorsanız ölçülü olmak ve hipoglisemi riskine karşı yemekle birlikte almak önemlidir; hekiminize danışın.',
        'Tuzu azaltmak (tansiyon için), bol su içmek ve öğünleri düzenli saatlerde yemek de genel sağlık ve kan şekeri dengesi için önemlidir. Bu öneriler genel bilgilendirme amaçlıdır; kişiye özel menü için mutlaka bir diyetisyenle çalışın.',
      ],
    },
    {
      title: 'Lif, protein ve yağlar',
      content: [
        'Lif (posalı besinler), sindirimi yavaşlatarak kan şekerinin daha kontrollü yükselmesine yardımcı olur; ayrıca tokluk hissini artırır ve bağırsak sağlığı için faydalıdır. Sebzeler, meyveler (kabuklu), tam tahıllar, kuru baklagiller ve kuruyemişler iyi lif kaynaklarıdır. Günlük 25–30 gram lif hedeflenebilir; ani artış gaz ve şişkinlik yapabileceği için kademeli artırmak iyidir.',
        'Protein, kas ve dokuların yapı taşıdır ve öğünlerde tokluk sağlar. Yağsız et, tavuk, balık, yumurta, süt ürünleri, kuru baklagiller ve tofu gibi kaynaklar önerilir. Diyabetli bireylerde de protein ihtiyacı sağlıklı yetişkinlerle benzerdir; böbrek hastalığı varsa hekim veya diyetisyen protein miktarını ayarlayabilir.',
        'Yağlar enerji kaynağıdır ve bazı vitaminlerin emilimi için gereklidir. Zeytinyağı, fındık, ceviz, avokado gibi doymamış yağlar tercih edilmeli; doymuş yağ (tereyağı, kırmızı et yağı) ve trans yağlar sınırlandırılmalıdır. Porsiyon kontrolü yağ için de geçerlidir; aşırı yağ alımı kilo artışına ve kan şekeri dengesini zorlaştırabilir.',
      ],
    },
  ],
  egzersiz: [
    {
      title: 'Egzersiz ve diyabet',
      content: [
        'Düzenli fiziksel aktivite, diyabet yönetiminin temel taşlarından biridir. Egzersiz, kasların glikozu kullanmasını artırarak kan şekerini düşürür, insülin duyarlılığını iyileştirir, kalp-damar sağlığını destekler ve kilo kontrolüne yardımcı olur. Haftada en az 150 dakika orta tempoda aerobik aktivite (örn. hızlı yürüyüş, yüzme, bisiklet) ve haftada 2–3 gün kuvvet antrenmanı genel öneriler arasındadır.',
        'Egzersize başlamadan önce hekiminize danışmak önemlidir; özellikle kalp hastalığı, yüksek tansiyon, retinopati veya nöropati gibi durumlar varsa bazı aktiviteler kısıtlanabilir veya uyarlanabilir. İnsülin veya insülin salgılatıcı ilaç kullananlarda egzersiz sırasında veya sonrasında hipoglisemi riski olabileceği için kan şekeri ölçümü ve gerekirse atıştırmalık planı yapılmalıdır.',
        'Egzersizi hayatınıza yavaş yavaş ekleyin; 10–15 dakika yürüyüşle başlayıp süreyi ve tempoyu kademeli artırmak sürdürülebilir olur. Sevdiğiniz bir aktiviteyi seçmek motivasyonu artırır. Bu bilgiler genel rehber niteliğindedir; kişiye özel egzersiz programı için hekim ve gerekirse fizyoterapist ile çalışın.',
      ],
    },
    {
      title: 'Egzersiz öncesi, sırası ve sonrası',
      content: [
        'Egzersizden önce kan şekerinizi ölçmeniz faydalıdır. Genel olarak 100 mg/dL’nin altındaysanız hafif bir atıştırmalık (meyve, kraker, küçük sandviç) almanız önerilir; 250 mg/dL’nin üzerinde ve keton varsa (Tip 1’de) egzersiz ertelenebilir. İnsülin kullanıyorsanız, yoğun egzersizden 1–2 saat önce insülin dozunun azaltılması hekiminiz tarafından önerilebilir; bu kişiye özeldir.',
        'Egzersiz sırasında yanınızda hızlı etkili karbonhidrat (glukoz tableti, meyve suyu) ve su bulundurun. Uzun süreli aktivitede ara ara kan şekeri ölçümü yapabilir veya CGM kullanıyorsanız eğilimi takip edebilirsiniz. Susuz kalmamak için yeterli sıvı alın; özellikle sıcak havalarda dikkat edin.',
        'Egzersiz sonrası kan şekeri bir süre daha düşmeye devam edebilir (gecikmiş hipoglisemi). Bu nedenle 1–2 saat sonra tekrar ölçüm yapmak ve gerekirse atıştırmalık almak güvenli olur. Deneyimlerinizi (süre, tür, kan şekeri değişimi) not ederek hekiminizle paylaşmanız, egzersiz-insülin/ilaç dengesinin ayarlanmasına yardımcı olur.',
      ],
    },
    {
      title: 'Hangi sporlar uygun?',
      content: [
        'Yürüyüş, en erişilebilir ve güvenli aktivitelerden biridir; tempoyu kendinize göre ayarlayabilirsiniz. Yüzme ve su içi egzersizler eklem yükünü azaltır; kalp ve kasları çalıştırır. Bisiklet (açık havada veya sabit) da uygun bir seçenektir. Dans, hafif koşu, merdiven çıkma ve kuvvet antrenmanı (ağırlık, direnç bantları) da eklenebilir; kuvvet antrenmanı kas kütlesini artırarak insülin duyarlılığını destekler.',
        'Retinopati (göz dibi kanaması riski) varsa ağır kaldırma, baş aşağı eğilme ve ani sıçrama gerektiren sporlardan kaçınılması önerilir. Nöropati (ayaklarda his kaybı) varsa ayakları zedeleyebilecek aktivitelerden uzak durulmalı; yüzme ve bisiklet genellikle daha güvenlidir. Ayak bakımı ve uygun ayakkabı her zaman önemlidir.',
        'Hekiminiz ve mümkünse bir egzersiz uzmanı ile birlikte sizin için güvenli ve keyifli bir program oluşturun. Küçük adımlarla başlayıp düzenli hale getirmek, “mükemmel” bir programı bir günde yapmaya çalışmaktan daha değerlidir.',
      ],
    },
    {
      title: 'Günlük hareket ve oturma süresi',
      content: [
        'Sadece “spor” yapmak yetmez; gün içinde uzun süre hareketsiz kalmak (oturma) kan şekeri ve kalp sağlığı üzerinde olumsuz etki yapabilir. Mümkünse her 30–60 dakikada bir kısa süre ayağa kalkmak, kısa yürüyüşler yapmak veya basit germe hareketleri eklemek faydalıdır. Asansör yerine merdiven kullanmak, kısa mesafelerde araç yerine yürümek günlük hareketi artırır.',
        'İş yerinde veya evde masa başı çalışıyorsanız, telefonla konuşurken yürümek, toplantıları ayakta yapmak veya ayakta çalışma masası kullanmak gibi seçenekler düşünülebilir. Günlük adım sayısı hedefi (örneğin 7.000–10.000 adım) motivasyon sağlayabilir; ancak hedefi kendinize göre ayarlayın ve aşamalı artırın.',
        'Diyabetle yaşamda hareket, beslenme ve ilaç/insülin tedavisi birlikte ele alınmalıdır. Bu sayfadaki bilgiler genel niteliktedir; kişiye özel egzersiz önerileri için mutlaka hekiminize danışın.',
      ],
    },
  ],
  yasam: [
    {
      title: 'İş ve okul hayatı',
      content: [
        'Diyabet, çalışma veya eğitim hayatınıza engel değildir; ancak düzenli öğün, ilaç/insülin zamanlaması ve gerekirse kan şekeri ölçümü için uygun ortam ve zaman yaratmak gerekir. İşvereniniz veya okul yönetiminizle diyabetiniz hakkında paylaşım yapıp yapmamak size kalmıştır; ancak acil durumlarda (hipoglisemi vb.) yakın çalışma arkadaşlarınızın veya öğretmenlerin bilmesi güvenliğiniz açısından faydalı olabilir.',
        'Türkiye’de diyabetli bireylerin çalışma hayatında ayrımcılığa uğramaması ve gerekli düzenlemelerin yapılması konusunda yasal düzenlemeler bulunmaktadır. İlaç veya insülin saklama (buzdolabı, çekmece), öğün molası ve kan şekeri ölçümü için uygun bir alan talep etmek makul isteklerdir. Stres ve düzensiz mesai kan şekerini etkileyebilir; mümkün olduğunca düzenli uyku ve öğün planı sürdürülmeye çalışılmalıdır.',
        'Okul çağındaki çocuklarda aile, okul ve sağlık ekibi iş birliği önemlidir. Çocuğun insülin/öğün zamanları, hipoglisemi belirtileri ve acil müdahale konusunda okul personelinin bilgilendirilmesi güvenli bir ortam sağlar. Bu bilgiler genel rehber niteliğindedir; haklarınız ve iş yerinde yapılabilecek düzenlemeler için ilgili mevzuat ve hekiminizle görüşmeniz önerilir.',
      ],
    },
    {
      title: 'Seyahat',
      content: [
        'Diyabetle seyahat etmek planlama ile sorunsuz hale getirilebilir. İlaç ve insülinleri el bagajında taşıyın; uçakta bagaj kaybı veya soğuk/ısı hasarı riskine karşı yanınızda bulunması güvenlidir. İnsülin ve glukometre için doktor raporu veya reçete örneği taşımak, güvenlik kontrolünde veya sınırda sorun yaşamanızı önleyebilir. İnsülin soğuk zincirde saklanmalı; seyahat sırasında soğuk torba veya termos kullanılabilir.',
        'Zaman dilimi değişiminde insülin doz saatleri hekiminizle önceden konuşulmalıdır; kısa veya uzun etkili insülin kullanımına göre farklı stratejiler uygulanır. Yemek düzeni değişecekse atıştırmalık (kraker, meyve, glukoz tableti) taşıyın; hipoglisemi riskine karşı yanınızda hızlı karbonhidrat olsun. Seyahat sigortası yaptırırken diyabetin belirtilmesi ve acil durum kapsamı kontrol edilmelidir.',
        'Tatil boyunca da ölçüm ve ilaç/insülin düzeninizi mümkün olduğunca sürdürün; aşırı yemek veya alkol kan şekerini bozabilir. Bu bilgiler genel niteliktedir; uzun seyahat ve doz ayarları için mutlaka hekiminize danışın.',
      ],
    },
    {
      title: 'Psikolojik destek ve duygusal sağlık',
      content: [
        'Diyabetle yaşamak bazen stres, kaygı, yorgunluk veya “diyabet yorgunluğu” (sürekli takip ve karar verme yükü) getirebilir. Bu duygular normaldir ve birçok diyabetli birey zaman zaman benzer şeyler hisseder. Kendinizi suçlamak veya “yeterince iyi yönetemiyorum” diye düşünmek yerine, destek almak ve küçük hedeflerle ilerlemek daha sağlıklıdır.',
        'Aile, arkadaş veya diyabet destek gruplarıyla konuşmak rahatlatıcı olabilir. Gerekirse bir psikolog veya psikiyatrist ile görüşmek, özellikle depresyon veya anksiyete belirtileri varsa çok faydalıdır. Duygusal iyi oluş, kan şekeri kontrolü ve tedaviye uyumu da olumlu etkiler.',
        'Diyabet ekibiniz (hekim, hemşire, diyetisyen) sadece kan şekeri ve ilaç değil, yaşam kalitenizi de önemsemelidir. Zorlandığınızda onlara açıkça söylemekten çekinmeyin. Bu sayfadaki bilgiler bilgilendirme amaçlıdır; ruh sağlığı ihtiyaçlarınız için mutlaka bir ruh sağlığı uzmanına başvurabilirsiniz.',
      ],
    },
    {
      title: 'Aile ve sosyal çevre',
      content: [
        'Diyabet sadece bireyi değil, aileyi ve yakın çevreyi de etkiler. Ailenizin diyabet, belirtiler (özellikle hipoglisemi) ve acil durumda ne yapılacağı konusunda bilgilendirilmesi güvenlik açısından önemlidir. Evde şeker ölçümü, insülin veya ilaç saatleri konusunda anlayışlı bir ortam olması tedaviye uyumu kolaylaştırır.',
        'Sosyal ortamlarda yemek ve içecek seçimleri bazen zor olabilir. “Hayır, teşekkürler” demek veya porsiyonu küçük tutmak sizin hakkınız; açıklama yapmak zorunda değilsiniz. Yakın arkadaşlarınıza diyabetinizi anlatırsanız, restoran seçiminde veya aktivite planlamasında size daha kolay eşlik edebilirler.',
        'Çocuk veya ergen diyabetli bireylerde aile desteği ve okul-arkadaş çevresiyle uyum özellikle önemlidir. Bu bilgiler genel rehber niteliğindedir; aile danışmanlığı veya destek grupları hakkında hekiminizden veya diyabet derneklerinden bilgi alabilirsiniz.',
      ],
    },
  ],
}

export default function Bilgi() {
  const [activeCategory, setActiveCategory] = useState('genel')
  const list = articles[activeCategory] ?? articles.genel

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          Diyabet bilgisi
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Güvenilir, anlaşılır kaynaklarla diyabet hakkında bilgilen. İçerikler bilgilendirme amaçlıdır; tedavi kararları için mutlaka hekiminize danışın.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveCategory(id)}
            className={`px-4 py-2 rounded-xl text-sm font-500 transition-colors ${
              activeCategory === id
                ? 'bg-diapal-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-diapal-300 hover:text-diapal-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {list.map((item, i) => (
          <article
            key={i}
            className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm"
          >
            <h2 className="text-xl font-700 text-slate-900 mb-6">{item.title}</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              {item.content.map((para, j) => (
                <p key={j} className="mb-0">{para}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
