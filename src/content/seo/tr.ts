import type { SeoContent } from './types'

export const tr: SeoContent = {
  home: {
    title: 'Unfollowers Checker — Seni Geri Takip Etmeyenleri Bul',
    description:
      'Instagram, X (Twitter), GitHub, Bluesky, GitLab ve Mastodon’da seni geri takip etmeyenleri bul. Ücretsiz ve açık kaynak; şifre istemez, veri saklamaz.',
    heading: 'Seni geri takip etmeyenleri her platformda bul',
    intro: [
      'Unfollowers Checker, takip ettiğin hesaplarla seni takip eden hesapları karşılaştırır ve seni geri takip etmeyen herkesi listeler. Instagram, X (Twitter), GitHub, Bluesky, GitLab ve Mastodon’da çalışır.',
      'Ücretsiz ve açık kaynaktır, şifreni asla istemez ve verilerini saklamaz. GitHub, Bluesky, GitLab, Mastodon ve Instagram’da seçtiğin hesapları toplu olarak takipten de çıkarabilirsin.',
    ],
    faq: [
      {
        q: 'Hangi platformlar destekleniyor?',
        a: 'Instagram, X (Twitter), GitHub, Bluesky, GitLab ve Mastodon. Başlamak için sayfanın üstünden bir platform seç.',
      },
      {
        q: 'Takipten çıkarma da yapabiliyor muyum?',
        a: 'Evet; GitHub, Bluesky, GitLab, Mastodon ve Instagram’da. İstediğin hesapları seçip tek seferde takipten çıkabilirsin. X’in bunun için ücretsiz bir API’si olmadığından X’te her sonuç profile bağlanır ve takipten çıkma işlemini X’te yaparsın.',
      },
    ],
  },

  platforms: {
    github: {
      title: 'GitHub Takip Etmeyenler — Geri Takip Etmeyenleri Bul',
      description:
        'Herhangi bir GitHub kullanıcı adını gir, geri takip etmeyenleri gör. Ücretsiz ve açık kaynak. GitHub ile giriş yaparak kendi hesabından toplu takipten çık.',
      heading: 'GitHub’da seni geri takip etmeyenleri gör',
      intro: [
        'Bir GitHub kullanıcı adı yaz; Unfollowers Checker, o hesabın takip edip de onu geri takip etmeyen herkesi listeler. Görüntüleme GitHub’ın herkese açık API’siyle yapılır, giriş yapman gerekmez ve her açık kullanıcı için çalışır.',
        'Kendi listeni temizlemek için GitHub ile giriş yap (resmi OAuth), hesapları seç ve toplu olarak takipten çık.',
      ],
      faq: [
        {
          q: 'GitHub takipçilerini kontrol etmek için giriş yapmam gerekiyor mu?',
          a: 'Hayır. GitHub’da takipçi ve takip listeleri herkese açıktır, bu yüzden giriş yapmadan herhangi bir kullanıcı adını kontrol edebilirsin. Giriş sadece kendi hesabından takipten çıkmak için gerekir.',
        },
        {
          q: 'GitHub girişi hangi izinleri istiyor?',
          a: 'Yalnızca GitHub’ın senin adına takip etme ve takipten çıkma için istediği izni. Erişim anahtarı sunucuda kalır, tarayıcına asla gönderilmez.',
        },
        {
          q: 'Binlerce takipçisi olan hesaplarda çalışıyor mu?',
          a: 'Evet. Çok büyük hesaplar belirli bir sınıra kadar karşılaştırılır; bu durumda sonuçlar kısmi olabilir ve sayfa bunu sana belirtir.',
        },
      ],
    },
    bluesky: {
      title: 'Bluesky Takip Etmeyenler — Geri Takip Etmeyenleri Bul',
      description:
        'Bluesky’da seni geri takip etmeyen hesapları gör. Herhangi bir kullanıcı adını gir, giriş gerekmez. Bluesky ile giriş yapıp toplu takipten çık. Ücretsiz.',
      heading: 'Bluesky’da seni geri takip etmeyenleri gör',
      intro: [
        'isim.bsky.social gibi bir Bluesky kullanıcı adı gir; Unfollowers Checker o hesabın takip edip de onu geri takip etmeyen herkesi listeler. Bluesky’ın herkese açık AT Protocol API’sini kullandığı için görüntülemek için giriş gerekmez.',
        'Bluesky’ın resmi OAuth’uyla giriş yaparak seçtiğin hesapları kendi profilinden toplu olarak takipten çıkarabilirsin.',
      ],
      faq: [
        {
          q: 'Özel alan adlı kullanıcı adlarıyla çalışıyor mu?',
          a: 'Evet. isminiz.com gibi özel alan adları dahil her Bluesky kullanıcı adı çalışır. bsky.app profil linkini de yapıştırabilirsin.',
        },
        {
          q: 'Uygulama şifresi (app password) gerekiyor mu?',
          a: 'Hayır. Giriş Bluesky’ın resmi OAuth akışıyla yapılır; bu siteye hiçbir şifre ya da uygulama şifresi yazmazsın.',
        },
        {
          q: 'Başkasının Bluesky hesabını kontrol edebilir miyim?',
          a: 'Evet, Bluesky’da takip listeleri herkese açıktır. Takipten çıkarma ise yalnızca kendi hesabını etkiler.',
        },
      ],
    },
    gitlab: {
      title: 'GitLab Takip Etmeyenler — Geri Takip Etmeyenleri Bul',
      description:
        'GitLab ile giriş yap, gitlab.com’da seni geri takip etmeyenleri gör ve toplu olarak takipten çık. Ücretsiz, açık kaynak, hiçbir veri saklanmaz.',
      heading: 'GitLab’de seni geri takip etmeyenleri gör',
      intro: [
        'GitLab takipçi listelerini gizli tutar, bu yüzden Unfollowers Checker önce GitLab ile giriş yapmanı ister. Ardından kendi listeni yükler ve takip ettiğin ama seni geri takip etmeyen herkesi gösterir.',
        'İstediğin hesapları seçip tek seferde takipten çıkabilirsin. gitlab.com ile çalışır, ücretli plan gerekmez.',
      ],
      faq: [
        {
          q: 'GitLab için neden giriş yapmam gerekiyor?',
          a: 'GitLab’ın API’si takipçi listelerini yalnızca giriş yapmış kullanıcılara verir; bu yüzden giriş yapmadan bir hesaba bakmak mümkün değil. Sadece kendi hesabını kontrol edebilirsin.',
        },
        {
          q: 'Kendi sunucumdaki (self-hosted) GitLab ile çalışıyor mu?',
          a: 'Henüz değil. Şu an gitlab.com destekleniyor.',
        },
      ],
    },
    mastodon: {
      title: 'Mastodon Takip Etmeyenler — Geri Takip Etmeyenleri Bul',
      description:
        'kullanici@sunucu biçiminde bir kullanıcı adı gir, Mastodon’da geri takip etmeyenleri gör. Her sunucuda çalışır, görüntülemek için giriş gerekmez. Ücretsiz.',
      heading: 'Mastodon’da seni geri takip etmeyenleri gör',
      intro: [
        'kullanici@sunucu biçiminde bir Mastodon kullanıcı adı gir; Unfollowers Checker o hesabın takip edip de onu geri takip etmeyen herkesi listeler. Görüntüleme her sunucudaki hesaplar için çalışır.',
        'Seçtiğin hesapları toplu olarak takipten çıkarmak için giriş yap. Giriş ve takipten çıkma şu an mastodon.social’da çalışıyor.',
      ],
      faq: [
        {
          q: 'Hangi Mastodon sunucuları destekleniyor?',
          a: 'Görüntüleme, takip listelerini herkese açık tutan her sunucuda çalışır. Giriş yapma ve takipten çıkma şu an mastodon.social’da çalışıyor.',
        },
        {
          q: 'Hesap takip listelerini gizlemişse ne olur?',
          a: 'Bazı Mastodon kullanıcıları kimi takip ettiklerini ya da kimin onları takip ettiğini gizler. Bu durumda listeler okunamaz ve kontrol yapılamaz.',
        },
      ],
    },
    instagram: {
      title: 'Instagram Takip Etmeyenler — Ücretsiz, Şifresiz Kontrol',
      description:
        'Instagram’da seni geri takip etmeyenleri gör ve toplu takipten çık. Kendi tarayıcı oturumunda çalışır: şifre yok, uygulama yok, sunucuya hiçbir şey gitmez.',
      heading: 'Instagram’da seni geri takip etmeyenleri gör',
      intro: [
        'Instagram seni kimin geri takip etmediğini göstermez. Unfollowers Checker sana, instagram.com açıkken tarayıcı konsoluna yapıştıracağın küçük bir script verir. Script takipçilerini ve takip ettiklerini kendi oturumunla yükler ve seni geri takip etmeyen herkesi listeler.',
        'Şifreni asla yazmazsın ve sunucularımıza hiçbir şey gönderilmez. Açılan panelden arama ve filtreleme yapabilir, seçtiğin hesapları her biri arasında temkinli beklemelerle gruplar halinde takipten çıkabilirsin.',
      ],
      faq: [
        {
          q: 'Instagram beni kimin takipten çıktığını gösteriyor mu?',
          a: 'Hayır. Instagram seni takipten çıkanları ya da geri takip etmeyenleri bildirmez veya listelemez. Bu tür araçlar takipçi ve takip listelerini karşılaştırarak bunu bulur.',
        },
        {
          q: 'Kullanmak güvenli mi?',
          a: 'Şifreni kimseyle paylaşmazsın ve script yalnızca kendi tarayıcından Instagram ile konuşur. İşlemler arasına rastgele beklemeler koyar ve Instagram yavaşlamasını istediğinde kendiliğinden durur. Her otomatik işlem biraz risk taşır; varsayılan süreleri değiştirme ve tek seferde yüzlerce hesabı takipten çıkarma.',
        },
        {
          q: 'Neden konsola script yapıştırıyorum?',
          a: 'Instagram’ın herkese açık bir takipçi API’si yok. Script’i instagram.com’da çalıştırmak, zaten giriş yapmış olduğun oturumu kullanmasını sağlar; böylece şifre ya da üçüncü taraf giriş gerekmez. Script açık kaynaktır, çalıştırmadan önce okuyabilirsin.',
        },
        {
          q: 'Telefonda çalışıyor mu?',
          a: 'Geliştirici araçları olan bir masaüstü tarayıcı gerekir; örneğin bilgisayarda Chrome, Edge, Firefox veya Safari.',
        },
        {
          q: 'Tarama yarıda kesilirse ne olur?',
          a: 'İlerleme her sayfadan sonra kaydedilir. Instagram taramayı keserse paneli yeniden aç ve baştan başlamak yerine kaldığın yerden devam et.',
        },
      ],
    },
    twitter: {
      title: 'X (Twitter) Takip Etmeyenler — Geri Takip Etmeyenleri Bul',
      description:
        'Resmi X veri arşivinle X’te (Twitter) seni geri takip etmeyenleri bul. Karşılaştırma tarayıcında yapılır, dosyaların cihazından hiç çıkmaz.',
      heading: 'X’te (Twitter) seni geri takip etmeyenleri gör',
      intro: [
        'X’in takipçi listeleri için ücretsiz bir API’si olmadığından Unfollowers Checker bunun yerine resmi X veri arşivini kullanır. Arşivdeki following.js ve follower.js dosyalarını yükle; sayfa takip ettiğin ama seni geri takip etmeyen her hesabı listeler.',
        'Her şey tarayıcında çalışır: dosyalar cihazında okunup karşılaştırılır, hiçbir yere yüklenmez. Her sonuç profile bağlanır, böylece X’te takipten çıkabilirsin.',
      ],
      faq: [
        {
          q: 'X veri arşivimi nasıl indiririm?',
          a: 'X’te Ayarlar → Hesabın → Verilerinin arşivini indir yolunu izle. X’in arşivi hazırlaması genelde bir gün kadar sürer. Arşivi zipten çıkar ve data klasöründe following.js ile follower.js dosyalarını bul.',
        },
        {
          q: 'Neden kullanıcı adları yerine sayısal ID’ler görünüyor?',
          a: 'X’in arşivi kullanıcı adlarını değil, yalnızca hesap ID’lerini içerir. Her sonuca tıkladığında X’te doğru profil açılır.',
        },
        {
          q: 'Buradan takipten çıkabilir miyim?',
          a: 'X’te hayır, çünkü bunun için ücretsiz bir API yok. Listeden her profili açıp X’te takipten çık.',
        },
      ],
    },
  },

  general: [
    {
      q: 'Unfollowers Checker ücretsiz mi?',
      a: 'Evet, tamamen ücretsiz; reklam ya da sınır yok. GitHub’da açık kaynaktır.',
    },
    {
      q: 'Şifremi istiyor musunuz?',
      a: 'Asla. Giriş gereken yerlerde her platformun resmi OAuth’u kullanılır. Instagram kendi tarayıcı oturumunda çalışır, X ise indirdiğin arşivle çalışır.',
    },
    {
      q: 'Verilerimi saklıyor musunuz?',
      a: 'Hayır. Veritabanı yok. Listeler o tek istek için çekilir, karşılaştırılır ve döndürülür; tercihlerin tarayıcının yerel depolamasında kalır.',
    },
  ],

  guides: {
    title: 'Rehberler — Unfollowers Checker',
    description:
      'Instagram, Bluesky ve diğer platformlarda seni geri takip etmeyenleri bulma ve takip listeni güvenle temizleme üzerine adım adım rehberler.',
    heading: 'Rehberler',
    intro:
      'Seni geri takip etmeyenleri bulmak ve takip listeni güvenle temizlemek için pratik, adım adım rehberler.',
  },

  faq: {
    title: 'Sık Sorulan Sorular — Unfollowers Checker',
    description:
      'Unfollowers Checker hakkında: Instagram, X, GitHub, Bluesky, GitLab ve Mastodon’da nasıl çalışır, güvenli mi, neyi saklar?',
    heading: 'Sık sorulan sorular',
    intro:
      'Her platformda nasıl çalıştığı, neyin saklandığı ve güvende kalmanın yolları.',
    general: 'Genel',
  },

  notFound: {
    title: 'Sayfa bulunamadı',
    body: 'Bu sayfa yok ya da taşınmış. Bunun yerine ana sayfadan bir platform seç.',
    backHome: 'Ana sayfaya git',
  },
}
