import type { Guide } from './types'

export const tr: Guide[] = [
  {
    slug: 'see-who-unfollowed-you-on-instagram',
    title: 'Instagram’da Seni Geri Takip Etmeyenleri Görme Yolu',
    description:
      'Instagram seni takipten çıkanları göstermez. Şifreni bir uygulamaya vermeden, seni geri takip etmeyen herkesi ücretsiz listelemenin yolu.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          'Instagram biri seni takipten çıktığında bildirim göndermez ve seni geri takip etmeyenlerin hazır bir listesi de yoktur. Bunu öğrenmenin tek yolu iki listeyi karşılaştırmaktır: takip ettiğin hesaplar ve seni takip eden hesaplar.',
          'Küçük bir hesapta bunu elle yapabilirsin ama birkaç yüz kişiyi geçince pratik olmaz. Bu rehber, uygulama yüklemeden ve şifreni kimseye vermeden bunu ücretsiz ve otomatik olarak yapmanın yolunu gösteriyor.',
        ],
      },
      {
        heading: 'Neye ihtiyacın var?',
        bullets: [
          'Chrome, Edge, Firefox veya Safari gibi bir masaüstü tarayıcısı olan bir bilgisayar.',
          'O tarayıcıda instagram.com’a giriş yapmış olman.',
          'Yaklaşık beş dakika. Büyük hesapların taranması daha uzun sürer.',
        ],
      },
      {
        heading: 'Adım adım',
        steps: [
          'Unfollowers Checker’ın Instagram sayfasını aç ve “Kodu kopyala” düğmesine bas.',
          'Aynı tarayıcıda instagram.com’a git ve giriş yapmış olduğundan emin ol.',
          'Geliştirici konsolunu aç: Windows ve Linux’ta F12 veya Ctrl+Shift+J, Mac’te Cmd+Option+J. Ardından Console sekmesine tıkla.',
          'Script’i yapıştır ve Enter’a bas. Sayfanın köşesinde bir panel açılır.',
          '“Taramayı başlat”a bas. Panel önce takipçilerini yükler, sonra takip ettiğin herkesi onlarla karşılaştırır ve seni geri takip etmeyen herkesi listeler.',
          'İstersen hesapları seçip takipten çık. Panel istekleri aralıklı gönderir ve her takipten çıkmayı Instagram üzerinden doğrular.',
        ],
      },
      {
        heading: 'Neden uygulama değil de konsol script’i?',
        paragraphs: [
          'Instagram’ın takipçi listeleri için herkese açık bir API’si yok. Bunu vaat eden uygulamalar genelde kullanıcı adını ve şifreni ister ve kendi sunucularında giriş yapar; bu da hesabını riske atar.',
          'instagram.com üzerinde çalıştırdığın bir script, zaten giriş yaptığın oturumu kullanır. Şifren tarayıcından hiç çıkmaz ve üçüncü taraf bir sunucuya hiçbir şey gönderilmez. Script açık kaynaktır; çalıştırmadan önce tam olarak ne yaptığını okuyabilirsin.',
        ],
      },
      {
        heading: 'İpuçları',
        bullets: [
          'Tarama yarıda kalırsa paneli yeniden aç: ilerleme her sayfadan sonra kaydedilir, baştan başlamak yerine kaldığın yerden devam edersin.',
          'Varsayılan süreleri değiştirme. Normal kullanım gibi görünmesi için bilerek yavaş tutuldular.',
          'Tek oturumda yüzlerce hesabı takipten çıkarma. Büyük temizlikleri birkaç güne yay.',
        ],
      },
    ],
  },
  {
    slug: 'are-instagram-unfollower-apps-safe',
    title: 'Instagram Takip Etmeyenler Uygulamaları Güvenli mi?',
    description:
      'Birçok “beni kim takipten çıktı” uygulaması Instagram şifreni ister. Riskli bir aracı güvenli olandan nasıl ayırırsın ve işlem engeli riskini nasıl azaltırsın?',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          '“Instagram beni kim takipten çıktı” diye aradığında onlarca uygulama çıkar. Bazıları zararsızdır, bazıları ise hesabını gerçekten riske atar. Fark genelde tek bir şeye dayanır: aracın senden ne istediğine.',
        ],
      },
      {
        heading: 'Tehlike işaretleri',
        bullets: [
          'Instagram şifreni istiyor. Senin yerine giriş yapan üçüncü bir taraf şüpheli olarak işaretlenebilir ve o oturumla ne yaptığı üzerinde hiçbir kontrolün olmaz.',
          'Listenin sadece bir kısmını gösterip geri kalanı için abonelik istiyor.',
          'Profilini veya hikayelerini kimin görüntülediğini göstereceğini vaat ediyor. Instagram bu veriyi paylaşmaz, yani bu iddia doğru değildir.',
          'Kimin yaptığı, neyi sakladığı ve verilerinin nereye gittiği belli değil.',
        ],
      },
      {
        heading: 'Daha güvenli yöntemler',
        bullets: [
          'instagram.com’da kendi tarayıcı oturumunda çalışan araçlar; böylece şifren cihazından hiç çıkmaz.',
          'Instagram’ın kendin indirdiğin resmi veri dışa aktarımıyla çalışan araçlar.',
          'Herkesin kodu okuyup ne yaptığını doğrulayabildiği açık kaynak araçlar.',
        ],
      },
      {
        heading: 'İşlem engelinden kaçınmak',
        paragraphs: [
          'Şifreni hiç görmeyen bir araç bile çok hızlı işlem yaparsa Instagram’ın sınırlarına takılabilir. Bu durumda Instagram takip etme ve takipten çıkma gibi işlemleri geçici olarak engelleyebilir.',
        ],
        bullets: [
          'Takipten çıkma işlemini küçük gruplar halinde ve her hesap arasında bekleyerek yap.',
          'Instagram bir uyarı gösterirse dur ve devam etmeden önce bir iki gün bekle.',
          'Aynı anda birden fazla otomasyon aracı çalıştırma.',
        ],
      },
      {
        heading: 'Unfollowers Checker bunu nasıl ele alıyor?',
        paragraphs: [
          'Unfollowers Checker kendi tarayıcı oturumunda bir script olarak çalışır, şifreni asla istemez ve kendi sunucularına hiçbir şey göndermez. Rastgele beklemeler ve molalar ekler, Instagram yavaşlamasını istediğinde kendiliğinden durur ve her takipten çıkmayı doğrular. Her otomatik işlem biraz risk taşır; bu yüzden dikkatli kullan.',
        ],
      },
    ],
  },
  {
    slug: 'bluesky-who-doesnt-follow-you-back',
    title: 'Bluesky’da Seni Geri Takip Etmeyenleri Bulma',
    description:
      'Bluesky’da takip ettiğin ama seni geri takip etmeyen hesapları ücretsiz listelemenin ve Bluesky’ın resmi girişiyle toplu takipten çıkmanın hızlı yolu.',
    published: '2026-11-13',
    platform: 'bluesky',
    sections: [
      {
        paragraphs: [
          'Bluesky takipçi ve takip edilen sayılarını gösterir ama hangi hesabın listelerden birinde eksik olduğunu göstermez. Bluesky’da takip listeleri herkese açık olduğu için bunları giriş yapmadan karşılaştırabilirsin.',
        ],
      },
      {
        heading: 'Adım adım',
        steps: [
          'Unfollowers Checker’ın Bluesky sayfasını aç.',
          'Kullanıcı adını gir; örneğin isim.bsky.social ya da kendi alan adın. bsky.app profil linkini de yapıştırabilirsin.',
          'Kontrol et’e bas. Takip ettiğin ama seni geri takip etmeyen her hesabı görürsün.',
          'Takipten çıkmak için “Bluesky ile giriş yap”a bas. Giriş Bluesky’ın resmi OAuth’uyla yapılır; şifre ya da uygulama şifresi yazmazsın.',
          'İstediğin hesapları seç ve “Seçilenleri bırak”a bas.',
        ],
      },
      {
        heading: 'Bilmekte fayda var',
        bullets: [
          'Sadece kendi hesabını değil, herhangi bir açık hesabı kontrol edebilirsin. Takipten çıkma ise yalnızca kendi hesabını etkiler.',
          'Hiçbir şey saklanmaz: listeler o tek istek için çekilir, karşılaştırılır ve döndürülür.',
          'Çok büyük hesaplar belirli bir sınıra kadar karşılaştırılır, bu yüzden sonuçları kısmi olabilir.',
        ],
      },
    ],
  },
  {
    slug: 'download-your-x-twitter-archive',
    title: 'X (Twitter) Veri Arşivini İndirme Rehberi',
    description:
      'Adım adım: X veri arşivini talep et, içindeki following.js ve follower.js dosyalarını bul ve X API’si olmadan seni geri takip etmeyenleri gör.',
    published: '2026-11-13',
    platform: 'twitter',
    sections: [
      {
        paragraphs: [
          'X artık araçların takipçi listelerini okuyabileceği ücretsiz bir yol sunmuyor, ama kendi listelerine yine de ulaşabilirsin: X her hesabın verilerinin bir arşivini indirmesine izin veriyor. Seni geri takip etmeyenleri bulmak için bu arşivdeki iki dosya, following.js ve follower.js, yeterli.',
        ],
      },
      {
        heading: 'Arşivi talep et',
        steps: [
          'X’te Daha fazla menüsünü (ya da profil menünü) aç ve Ayarlar ve gizlilik bölümüne git.',
          'Hesabın’ı, ardından Verilerinin bir arşivini indir’i seç.',
          'Şifreni onayla. X ayrıca e-postana veya telefonuna bir doğrulama kodu gönderebilir.',
          'Arşiv talep et düğmesine bas.',
        ],
      },
      {
        heading: 'Hazırlanmasını bekle',
        paragraphs: [
          'X arşivi arka planda hazırlar. Bu genelde yaklaşık bir gün sürer, büyük hesaplarda bazen daha uzun. Hazır olduğunda bir e-posta ve uygulama içi bildirim alırsın; indirme bağlantısı birkaç gün boyunca geçerli kalır.',
        ],
      },
      {
        heading: 'İki dosyayı bul',
        steps: [
          'Arşivi (.zip dosyası) indir ve arşivden çıkar.',
          'İçindeki data klasörünü aç.',
          'following.js ve follower.js dosyalarını bul. Büyük hesaplarda following-part1.js gibi ek parçalar olabilir; onları da sakla.',
        ],
      },
      {
        heading: 'Karşılaştır',
        paragraphs: [
          'Unfollowers Checker’ın X sayfasını aç ve iki dosyayı (varsa parça dosyalarıyla birlikte) sayfaya sürükle. Karşılaştırma tamamen tarayıcında yapılır; dosyalar hiçbir yere yüklenmez. Her sonuç X’teki profile bağlantı verir, takibi oradan bırakabilirsin.',
        ],
      },
      {
        heading: 'Bilmekte fayda var',
        bullets: [
          'Arşiv kullanıcı adlarını değil, yalnızca hesap ID’lerini içerir; bu yüzden sonuçlarda ID’ler görünür. Birine tıklayınca doğru profil açılır.',
          'Arşiv o anın bir kopyasıdır. Daha sonra tekrar kontrol etmek için yeni bir arşiv talep et.',
          'Arşivin geri kalanı (gönderiler, mesajlar, ayarlar) okunmaz; yalnızca iki takip dosyası kullanılır.',
        ],
      },
    ],
  },
  {
    slug: 'github-who-doesnt-follow-you-back',
    title: 'GitHub’da Seni Geri Takip Etmeyenleri Görme Yolu',
    description:
      'GitHub seni geri takip etmeyenleri göstermez. Herhangi bir kullanıcı adı için onları ücretsiz listelemenin ve kendi hesabından toplu takipten çıkmanın yolu.',
    published: '2026-11-13',
    platform: 'github',
    sections: [
      {
        paragraphs: [
          'GitHub kaç kişinin seni takip ettiğini ve senin kaç kişiyi takip ettiğini gösterir ama hangi hesabın listelerden birinde eksik olduğunu göstermez. GitHub’da takip listeleri herkese açık olduğu için bunlar giriş yapmadan karşılaştırılabilir.',
        ],
      },
      {
        heading: 'Adım adım',
        steps: [
          'Unfollowers Checker’ın GitHub sayfasını aç.',
          'Bir GitHub kullanıcı adı yaz; kendininkini ya da başka birininkini. Profil linki de olur.',
          'Kontrol et’e bas. O kullanıcının takip ettiği ama onu geri takip etmeyen her hesabı görürsün.',
          'Kendi listeni temizlemek için üstteki Giriş yap’a bas. Giriş GitHub’ın resmi OAuth’uyla yapılır; erişim token’ı sunucuda kalır.',
          'İstediğin hesapları seç ve Seçilenleri bırak’a bas.',
        ],
      },
      {
        heading: 'Bilmekte fayda var',
        bullets: [
          'Herhangi bir açık hesabı görüntülemek için giriş gerekmez. Takipten çıkma ise yalnızca kendi hesabını etkiler ve önce onayını ister.',
          'Hiçbir şey saklanmaz: listeler o tek istek için çekilir, karşılaştırılır ve döndürülür.',
          'Çok büyük hesaplar belirli bir sınıra kadar karşılaştırılır, bu yüzden sonuçları kısmi olabilir; böyle bir durumda sayfa bunu sana söyler.',
        ],
      },
    ],
  },
  {
    slug: 'instagram-action-blocked',
    title: 'Instagram “İşlem Engellendi” Hatası: Anlamı ve Çözümü',
    description:
      'Instagram takip etme ve takipten çıkma gibi işlemleri neden engeller, bu engel genelde ne kadar sürer, ne işe yarar ve takip listeni temizlerken bundan nasıl kaçınırsın?',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          '“İşlem engellendi” (ya da “Daha sonra tekrar dene”), Instagram’ın bir şeyi çok fazla ve çok hızlı yapan hesaplara koyduğu geçici bir kısıtlamadır. Genelde takip etme, takipten çıkma, beğenme veya yorum yapma gibi işlemleri etkiler; uygulamanın geri kalanı çalışmaya devam eder.',
        ],
      },
      {
        heading: 'Neden olur?',
        bullets: [
          'Kısa sürede çok sayıda takip etme veya takipten çıkma; bu otomatik bir işlem gibi görünür.',
          'Instagram bir işlemi reddettikten hemen sonra aynı işlemi tekrarlamak.',
          'Senin yerine giriş yapan ya da senin adına işlem yapan üçüncü taraf uygulamalar.',
          'Instagram’ın daha yakından izlediği yeni ya da yakın zamanda değiştirilmiş bir hesap.',
        ],
      },
      {
        heading: 'Ne kadar sürer?',
        paragraphs: [
          'Instagram kesin sınırları veya süreleri açıklamaz. Çoğu engel birkaç saat ile birkaç gün içinde kalkar. Engelliyken tekrar denemek genelde süreyi uzatır.',
        ],
      },
      {
        heading: 'Ne yapmalısın?',
        steps: [
          'Engellenen işlemi bırak ve tekrar tekrar denemeye devam etme.',
          'Bekle; yeniden denemeden önce en az bir gün geçmesine izin ver.',
          'Ayarlar → Uygulamalar ve internet siteleri bölümüne bak; tanımadığın ya da artık kullanmadığın uygulamaları kaldır.',
          'Hesabını başka birinin kullandığını düşünüyorsan şifreni değiştir ve iki faktörlü kimlik doğrulamayı aç.',
          'Mesaj bunun bir hata olduğunu söylüyorsa, bunu Instagram’a aynı pencereden bildirebilirsin.',
        ],
      },
      {
        heading: 'Engellenmeden takipten çıkmak',
        bullets: [
          'Takipten çıkma işlemini küçük gruplar halinde ve her hesap arasında bekleyerek yap.',
          'Büyük bir temizliği birkaç güne yay.',
          'Şifreni isteyen araçlardan uzak dur.',
        ],
      },
      {
        heading: 'Unfollowers Checker bunu nasıl ele alıyor?',
        paragraphs: [
          'Unfollowers Checker’ın Instagram paneli kendi tarayıcı oturumunda çalışır, rastgele beklemeler ve molalar ekler ve Instagram yavaşlamasını istediğinde kendiliğinden durur. Her otomatik işlem biraz risk taşır; bu yüzden varsayılan süreleri değiştirme.',
        ],
      },
    ],
  },
]
