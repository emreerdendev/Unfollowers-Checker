/*!
 * Instagram Unfollower — paste into the browser console on instagram.com
 * Runs entirely in your own browser using your own Instagram session.
 * No data is sent to any server.
 */
(() => {
  "use strict";

  if (location.hostname !== "www.instagram.com") {
    alert("Open https://www.instagram.com first, then paste this script again.");
    return;
  }

  const APP_ID = "uc-app";
  const STYLE_ID = "uc-style";
  const STORAGE_KEY = "uc_prefs_v1";
  // Preferences saved by earlier versions of this panel; read once as a fallback
  // so updating the script doesn't reset the user's settings/layout.
  const LEGACY_STORAGE_KEY = "iu_state_v3";
  // An interrupted scan is saved here so it can resume where it stopped.
  const CHECKPOINT_KEY = "uc_scan_checkpoint_v1";
  // The non-followers of the last completed scan (shown again without rescanning).
  const LAST_SCAN_KEY = "uc_last_scan_v1";
  const SAVED_SCAN_TTL = 24 * 60 * 60 * 1000;

  // Instagram's own web-client identifiers; requests without them are treated
  // as non-browser traffic and are refused far more often.
  const IG_APP_ID = "936619743392459";
  const IG_ASBD_ID = "129477";
  const IG_HEADERS = {
    "x-ig-app-id": IG_APP_ID,
    "x-asbd-id": IG_ASBD_ID,
    "x-requested-with": "XMLHttpRequest"
  };
  // Instagram's web app unfollows through this GraphQL mutation. The legacy REST
  // endpoints (/api/v1/friendships/destroy, /web/friendships/.../unfollow) now
  // often answer 200 without actually unfollowing, so they're only a fallback
  // when the page's session tokens can't be found.
  const UNFOLLOW_DOC_ID = "27789106940691111";
  const UNFOLLOW_FRIENDLY_NAME = "usePolarisUnfollowMutation";

  // Conservative defaults: slower = safer against Instagram's rate limiting and
  // action blocks. Users can still tune these in settings.
  const DEFAULT_TIMINGS = {
    scanDelayMin: 1000,
    scanDelayMax: 2000,
    scanPauseEveryPages: 6,
    scanPauseMs: 10000,
    usersPerRequest: 50,
    unfollowDelayMin: 6000,
    unfollowDelayMax: 12000,
    unfollowPauseEvery: 4,
    unfollowPauseMs: 300000
  };
  // Instagram caps a friendship-list page at 200 users.
  const MAX_USERS_PER_REQUEST = 200;
  // ± jitter added to the long scan pause so it never repeats on a fixed beat.
  const SCAN_PAUSE_JITTER_MS = 4000;

  // Ordered list of supported languages; the header button cycles through them.
  const LANGS = ["en", "tr", "de", "fr", "es"];

  const PANEL_WIDTH = 500;
  const PANEL_MIN_WIDTH = 320;
  const PANEL_MIN_HEIGHT = 320;
  const PANEL_MARGIN = 18;
  const MAX_RETRIES = 3;
  // A 429 during the scan is waited out this many times (30s, 60s, …) before
  // the scan stops and keeps its checkpoint for a later resume.
  const RATE_LIMIT_RETRIES = 2;
  const RATE_LIMIT_COOLDOWN_MS = 30000;

  const I18N = {
    en: {
      title: "Instagram Unfollower",
      subtitle: "See who doesn't follow you back",
      welcomeTitle: "Ready when you are",
      welcomeBody: "Your followers are loaded first, then everyone you follow is checked against them. Nothing is changed on your account during the scan.",
      scanBtn: "Scan now",
      scanning: "Scanning",
      loadingFollowing: "Step 2 of 2: checking the people you follow",
      loadingFollowers: "Step 1 of 2: loading your followers",
      paused: "Paused",
      pause: "Pause",
      resume: "Resume",
      cancel: "Cancel",
      ofTotal: "{current} of {total}",
      scanCompletedToast: "{count} non-followers found",
      scanFailed: "Scan failed",
      retry: "Try again",
      goBack: "Back to results",
      search: "Search by name or username",
      filterVerified: "Verified",
      filterPrivate: "Private",
      filterNoAvatar: "No profile picture",
      filterShowHidden: "Hidden users",
      foundCount: "{count} non-followers",
      foundOne: "1 non-follower",
      foundNone: "Nice — everyone you follow follows you back.",
      noMatches: "No users match your filters.",
      hide: "Hide",
      unhide: "Unhide",
      hideTooltip: "Hide from this list",
      unhideTooltip: "Show again",
      openProfile: "Open profile",
      copy: "Copy",
      copyAll: "Copy all",
      copiedToast: "Copied {count} usernames",
      selectAll: "Select all",
      selectNone: "Clear",
      selectedCount: "{count} selected",
      unfollow: "Unfollow",
      unfollowConfirmTitle: "Unfollow {count} users?",
      unfollowConfirmBody: "This will run slowly to protect your account from rate limiting. You can pause at any time, but already-completed unfollows cannot be reversed from this tool.",
      unfollowConfirmBtn: "Yes, unfollow {count}",
      unfollowing: "Unfollowing",
      currently: "Currently",
      nextActionIn: "Next action in {seconds}s",
      cooldownIn: "Cooldown — {seconds}s",
      scanPause: "Long pause — {seconds}s",
      idle: "Ready",
      unfollowDoneTitle: "Done",
      unfollowDoneBody: "{ok} unfollowed, {fail} failed",
      doneRemoved: "Unfollowed ({count})",
      doneFailed: "Failed ({count})",
      settings: "Settings",
      settingsTitle: "Timing settings",
      settingsBody: "Lower delays make Instagram more likely to throttle or block your account. Keep these conservative.",
      minScanDelay: "Min scan delay (ms)",
      maxScanDelay: "Max scan delay (ms)",
      scanPauseEvery: "Long pause every N pages",
      scanPauseLength: "Long pause length (ms)",
      minUnfollowDelay: "Min unfollow delay (ms)",
      maxUnfollowDelay: "Max unfollow delay (ms)",
      unfollowPauseEvery: "Cooldown every N unfollows",
      unfollowPauseLength: "Cooldown length (ms)",
      restoreDefaults: "Restore defaults",
      save: "Save",
      saved: "Settings saved",
      cookieMissing: "Could not read your login cookie. Make sure you're signed in to Instagram.",
      csrfMissing: "Could not read your session. Make sure you're signed in to Instagram.",
      requestFailed: "Request failed: {status}",
      tooManyRequests: "Instagram is rate-limiting requests. Try again later or increase delays in settings.",
      rateLimitPaused: "Instagram is rate-limiting you. Paused automatically — wait a few minutes, then press Resume.",
      keepTabOpen: "Keep this tab and browser open — closing it stops the process.",
      close: "Close",
      minimize: "Minimize",
      expand: "Expand",
      theme: "Theme",
      themeSystem: "Theme: system",
      themeLight: "Theme: light",
      themeDark: "Theme: dark",
      language: "Language",
      selectVerified: "Select verified",
      selectPrivate: "Select private",
      selectNoPhoto: "Select no photo",
      retryFailed: "Retry failed ({count})",
      pillScanning: "Scanning {current}/{total}",
      pillUnfollowing: "Unfollowing {current}/{total}",
      pillResults: "{count} non-followers",
      pillIdle: "Open",
      scanNotice: "Large accounts can take a while. If Instagram interrupts the scan, your progress is saved — wait a bit, then resume instead of starting over.",
      countFollowers: "{current} followers loaded",
      countFollowing: "{current} accounts checked",
      liveFound: "Non-followers found so far: {count}",
      usersPerRequest: "Users requested per page",
      sessionExpired: "Instagram signed you out. Sign in again, paste the script again and resume — the scan continues where it stopped.",
      scanBlocked: "Instagram temporarily refused list requests for this account. Wait a few hours, then resume.",
      networkError: "The connection dropped. Check your network and resume.",
      limitedList: "Instagram is limiting this list right now, so the results can't be confirmed. Wait a while, then resume.",
      blockedPaused: "Instagram blocked this action for now. Paused automatically — wait a few hours before resuming, or cancel.",
      keepTabVisible: "Keep this tab in front — browsers slow down background tabs a lot.",
      resumeScan: "Resume scan",
      startOver: "Start over",
      resumeHint: "A previous scan stopped partway. Continue from there instead of starting again.",
      partialTitle: "Scan stopped partway",
      partialBody: "{loaded} of the accounts you follow were checked. The non-followers below are confirmed; resume to check the rest.",
      showLastScan: "Show last result ({count}, {age})",
      lastScanNotice: "This list is from a scan {age}. Rescan for the current state.",
      rescan: "Rescan",
      reasonStillFollowing: "Instagram answered, but you still follow this account",
      reasonUnconfirmed: "Instagram answered, but the unfollow couldn't be confirmed",
      reasonRejected: "Instagram rejected the request",
      reasonNetwork: "Connection error"
    },
    tr: {
      title: "Instagram Takip Etmeyenler",
      subtitle: "Seni geri takip etmeyenleri gör",
      welcomeTitle: "Hazır olduğunda başlat",
      welcomeBody: "Önce takipçilerin yüklenir, ardından takip ettiğin herkes onlarla karşılaştırılır. Tarama sırasında hesabında hiçbir şey değişmez.",
      scanBtn: "Taramayı başlat",
      scanning: "Taranıyor",
      loadingFollowing: "Adım 2/2: Takip ettiklerin kontrol ediliyor",
      loadingFollowers: "Adım 1/2: Takipçilerin yükleniyor",
      paused: "Duraklatıldı",
      pause: "Duraklat",
      resume: "Devam et",
      cancel: "İptal",
      ofTotal: "{current} / {total}",
      scanCompletedToast: "{count} takip etmeyen bulundu",
      scanFailed: "Tarama başarısız",
      retry: "Tekrar dene",
      goBack: "Sonuçlara dön",
      search: "İsim veya kullanıcı adı ara",
      filterVerified: "Onaylı",
      filterPrivate: "Gizli",
      filterNoAvatar: "Profil resmi yok",
      filterShowHidden: "Gizlenen kullanıcılar",
      foundCount: "{count} takip etmeyen",
      foundOne: "1 takip etmeyen",
      foundNone: "Harika — takip ettiğin herkes seni takip ediyor.",
      noMatches: "Filtrelerinle eşleşen kullanıcı yok.",
      hide: "Gizle",
      unhide: "Göster",
      hideTooltip: "Bu listeden gizle",
      unhideTooltip: "Tekrar göster",
      openProfile: "Profili aç",
      copy: "Kopyala",
      copyAll: "Tümünü kopyala",
      copiedToast: "{count} kullanıcı adı kopyalandı",
      selectAll: "Tümünü seç",
      selectNone: "Temizle",
      selectedCount: "{count} seçili",
      unfollow: "Takibi bırak",
      unfollowConfirmTitle: "{count} kullanıcının takibi bırakılsın mı?",
      unfollowConfirmBody: "Hesabını korumak için işlem yavaş çalışır. İstediğin zaman duraklatabilirsin, ama tamamlanan işlemler bu araçtan geri alınamaz.",
      unfollowConfirmBtn: "Evet, {count} kişiyi bırak",
      unfollowing: "Takip bırakılıyor",
      currently: "Şu an",
      nextActionIn: "Sonraki işlem {seconds} sn sonra",
      cooldownIn: "Mola — {seconds} sn",
      scanPause: "Uzun mola — {seconds} sn",
      idle: "Hazır",
      unfollowDoneTitle: "Tamamlandı",
      unfollowDoneBody: "{ok} başarılı, {fail} başarısız",
      doneRemoved: "Takibi bırakıldı ({count})",
      doneFailed: "Başarısız ({count})",
      settings: "Ayarlar",
      settingsTitle: "Hız ayarları",
      settingsBody: "Düşük gecikmeler Instagram'ın hesabını kısıtlamasına neden olabilir. Yavaş tut.",
      minScanDelay: "Min tarama gecikmesi (ms)",
      maxScanDelay: "Maks tarama gecikmesi (ms)",
      scanPauseEvery: "Her N sayfada uzun mola",
      scanPauseLength: "Uzun mola süresi (ms)",
      minUnfollowDelay: "Min takip bırakma gecikmesi (ms)",
      maxUnfollowDelay: "Maks takip bırakma gecikmesi (ms)",
      unfollowPauseEvery: "Her N takip bırakmada mola",
      unfollowPauseLength: "Mola süresi (ms)",
      restoreDefaults: "Varsayılana dön",
      save: "Kaydet",
      saved: "Ayarlar kaydedildi",
      cookieMissing: "Giriş çerezi okunamadı. Instagram'a giriş yaptığından emin ol.",
      csrfMissing: "Oturumun okunamadı. Instagram'a giriş yaptığından emin ol.",
      requestFailed: "İstek başarısız: {status}",
      tooManyRequests: "Instagram istekleri kısıtlıyor. Sonra dene veya ayarlardan gecikmeleri artır.",
      rateLimitPaused: "Instagram seni kısıtlıyor. Otomatik duraklatıldı — birkaç dakika bekleyip Devam et'e bas.",
      keepTabOpen: "Bu sekmeyi ve tarayıcıyı kapatma — kapatırsan işlem durur.",
      close: "Kapat",
      minimize: "Küçült",
      expand: "Aç",
      theme: "Tema",
      themeSystem: "Tema: sistem",
      themeLight: "Tema: açık",
      themeDark: "Tema: koyu",
      language: "Dil",
      selectVerified: "Onaylıları seç",
      selectPrivate: "Gizlileri seç",
      selectNoPhoto: "Fotoğrafsızları seç",
      retryFailed: "Başarısızları dene ({count})",
      pillScanning: "Taranıyor {current}/{total}",
      pillUnfollowing: "Bırakılıyor {current}/{total}",
      pillResults: "{count} takip etmeyen",
      pillIdle: "Aç",
      scanNotice: "Büyük hesaplarda tarama biraz sürebilir. Instagram taramayı keserse ilerlemen kaydedilir — baştan başlamak yerine biraz bekleyip devam et.",
      countFollowers: "{current} takipçi yüklendi",
      countFollowing: "{current} hesap kontrol edildi",
      liveFound: "Şu ana kadar bulunan: {count}",
      usersPerRequest: "Sayfa başına istenen kullanıcı",
      sessionExpired: "Instagram oturumunu kapattı. Tekrar giriş yap, kodu yeniden yapıştır ve devam et — tarama kaldığı yerden sürer.",
      scanBlocked: "Instagram bu hesap için liste isteklerini geçici olarak reddetti. Birkaç saat bekleyip devam et.",
      networkError: "Bağlantı koptu. Ağını kontrol edip devam et.",
      limitedList: "Instagram şu an bu listeyi kısıtlıyor, bu yüzden sonuçlar doğrulanamıyor. Bir süre bekleyip devam et.",
      blockedPaused: "Instagram bu işlemi şimdilik engelledi. Otomatik duraklatıldı — devam etmeden önce birkaç saat bekle ya da iptal et.",
      keepTabVisible: "Bu sekmeyi önde tut — tarayıcılar arka plandaki sekmeleri çok yavaşlatır.",
      resumeScan: "Taramaya devam et",
      startOver: "Baştan başla",
      resumeHint: "Önceki tarama yarıda kaldı. Baştan başlamak yerine kaldığı yerden devam edebilirsin.",
      partialTitle: "Tarama yarıda kaldı",
      partialBody: "Takip ettiğin hesaplardan {loaded} tanesi kontrol edildi. Aşağıdakiler kesin olarak seni takip etmiyor; kalanlar için taramaya devam et.",
      showLastScan: "Son sonucu göster ({count}, {age})",
      lastScanNotice: "Bu liste {age} yapılan bir taramadan. Güncel durum için yeniden tara.",
      rescan: "Yeniden tara",
      reasonStillFollowing: "Instagram yanıt verdi ama bu hesabı hâlâ takip ediyorsun",
      reasonUnconfirmed: "Instagram yanıt verdi ama takipten çıkma doğrulanamadı",
      reasonRejected: "Instagram isteği reddetti",
      reasonNetwork: "Bağlantı hatası"
    },
    de: {
      title: "Instagram Unfollower",
      subtitle: "Sieh, wer dir nicht zurückfolgt",
      welcomeTitle: "Bereit, wenn du es bist",
      welcomeBody: "Zuerst werden deine Follower geladen, dann wird jeder, dem du folgst, mit ihnen abgeglichen. Während des Scans wird an deinem Konto nichts geändert.",
      scanBtn: "Jetzt scannen",
      scanning: "Wird gescannt",
      loadingFollowing: "Schritt 2 von 2: Prüfe die Personen, denen du folgst",
      loadingFollowers: "Schritt 1 von 2: Lade deine Follower",
      paused: "Pausiert",
      pause: "Pause",
      resume: "Fortsetzen",
      cancel: "Abbrechen",
      ofTotal: "{current} von {total}",
      scanCompletedToast: "{count} Nicht-Follower gefunden",
      scanFailed: "Scan fehlgeschlagen",
      retry: "Erneut versuchen",
      goBack: "Zurück zu den Ergebnissen",
      search: "Nach Name oder Benutzername suchen",
      filterVerified: "Verifiziert",
      filterPrivate: "Privat",
      filterNoAvatar: "Kein Profilbild",
      filterShowHidden: "Ausgeblendete Nutzer",
      foundCount: "{count} Nicht-Follower",
      foundOne: "1 Nicht-Follower",
      foundNone: "Super — alle, denen du folgst, folgen dir zurück.",
      noMatches: "Keine Nutzer entsprechen deinen Filtern.",
      hide: "Ausblenden",
      unhide: "Einblenden",
      hideTooltip: "Aus dieser Liste ausblenden",
      unhideTooltip: "Wieder anzeigen",
      openProfile: "Profil öffnen",
      copy: "Kopieren",
      copyAll: "Alle kopieren",
      copiedToast: "{count} Benutzernamen kopiert",
      selectAll: "Alle auswählen",
      selectNone: "Leeren",
      selectedCount: "{count} ausgewählt",
      unfollow: "Entfolgen",
      unfollowConfirmTitle: "{count} Nutzern entfolgen?",
      unfollowConfirmBody: "Dies läuft langsam, um dein Konto vor Rate-Limits zu schützen. Du kannst jederzeit pausieren, aber bereits abgeschlossene Entfolgungen können mit diesem Tool nicht rückgängig gemacht werden.",
      unfollowConfirmBtn: "Ja, {count} entfolgen",
      unfollowing: "Wird entfolgt",
      currently: "Aktuell",
      nextActionIn: "Nächste Aktion in {seconds}s",
      cooldownIn: "Abkühlung — {seconds}s",
      scanPause: "Lange Pause — {seconds}s",
      idle: "Bereit",
      unfollowDoneTitle: "Fertig",
      unfollowDoneBody: "{ok} entfolgt, {fail} fehlgeschlagen",
      doneRemoved: "Entfolgt ({count})",
      doneFailed: "Fehlgeschlagen ({count})",
      settings: "Einstellungen",
      settingsTitle: "Timing-Einstellungen",
      settingsBody: "Niedrigere Verzögerungen erhöhen das Risiko, dass Instagram dein Konto drosselt oder sperrt. Halte sie konservativ.",
      minScanDelay: "Min. Scan-Verzögerung (ms)",
      maxScanDelay: "Max. Scan-Verzögerung (ms)",
      scanPauseEvery: "Lange Pause alle N Seiten",
      scanPauseLength: "Länge der langen Pause (ms)",
      minUnfollowDelay: "Min. Entfolgen-Verzögerung (ms)",
      maxUnfollowDelay: "Max. Entfolgen-Verzögerung (ms)",
      unfollowPauseEvery: "Abkühlung alle N Entfolgungen",
      unfollowPauseLength: "Abkühlungsdauer (ms)",
      restoreDefaults: "Standard wiederherstellen",
      save: "Speichern",
      saved: "Einstellungen gespeichert",
      cookieMissing: "Login-Cookie konnte nicht gelesen werden. Stelle sicher, dass du bei Instagram angemeldet bist.",
      csrfMissing: "Deine Sitzung konnte nicht gelesen werden. Stelle sicher, dass du bei Instagram angemeldet bist.",
      requestFailed: "Anfrage fehlgeschlagen: {status}",
      tooManyRequests: "Instagram drosselt die Anfragen. Versuche es später oder erhöhe die Verzögerungen in den Einstellungen.",
      rateLimitPaused: "Instagram drosselt dich. Automatisch pausiert — warte ein paar Minuten und drücke dann Fortsetzen.",
      keepTabOpen: "Lass diesen Tab und den Browser offen — beim Schließen stoppt der Vorgang.",
      close: "Schließen",
      minimize: "Minimieren",
      expand: "Öffnen",
      theme: "Design",
      themeSystem: "Design: System",
      themeLight: "Design: Hell",
      themeDark: "Design: Dunkel",
      language: "Sprache",
      selectVerified: "Verifizierte wählen",
      selectPrivate: "Private wählen",
      selectNoPhoto: "Ohne Bild wählen",
      retryFailed: "Fehlgeschlagene erneut ({count})",
      pillScanning: "Scannen {current}/{total}",
      pillUnfollowing: "Entfolgen {current}/{total}",
      pillResults: "{count} Nicht-Follower",
      pillIdle: "Öffnen",
      scanNotice: "Große Konten können etwas dauern. Unterbricht Instagram den Scan, bleibt dein Fortschritt gespeichert — warte kurz und setze dann fort, statt neu zu beginnen.",
      countFollowers: "{current} Follower geladen",
      countFollowing: "{current} Konten geprüft",
      liveFound: "Bisher gefundene Nicht-Follower: {count}",
      usersPerRequest: "Angefragte Nutzer pro Seite",
      sessionExpired: "Instagram hat dich abgemeldet. Melde dich erneut an, füge das Skript erneut ein und setze fort — der Scan macht dort weiter, wo er aufgehört hat.",
      scanBlocked: "Instagram lehnt Listenanfragen für dieses Konto vorübergehend ab. Warte ein paar Stunden und setze dann fort.",
      networkError: "Die Verbindung wurde unterbrochen. Prüfe dein Netzwerk und setze fort.",
      limitedList: "Instagram schränkt diese Liste gerade ein, daher können die Ergebnisse nicht bestätigt werden. Warte eine Weile und setze dann fort.",
      blockedPaused: "Instagram hat diese Aktion vorerst blockiert. Automatisch pausiert — warte ein paar Stunden, bevor du fortsetzt, oder brich ab.",
      keepTabVisible: "Lass diesen Tab im Vordergrund — Browser verlangsamen Hintergrund-Tabs stark.",
      resumeScan: "Scan fortsetzen",
      startOver: "Neu beginnen",
      resumeHint: "Ein vorheriger Scan wurde unterbrochen. Setze ihn dort fort, statt neu zu beginnen.",
      partialTitle: "Scan unterbrochen",
      partialBody: "{loaded} der Konten, denen du folgst, wurden geprüft. Die Nicht-Follower unten sind bestätigt; setze fort, um den Rest zu prüfen.",
      showLastScan: "Letztes Ergebnis zeigen ({count}, {age})",
      lastScanNotice: "Diese Liste stammt aus einem Scan {age}. Scanne erneut für den aktuellen Stand.",
      rescan: "Erneut scannen",
      reasonStillFollowing: "Instagram hat geantwortet, aber du folgst diesem Konto noch",
      reasonUnconfirmed: "Instagram hat geantwortet, aber das Entfolgen konnte nicht bestätigt werden",
      reasonRejected: "Instagram hat die Anfrage abgelehnt",
      reasonNetwork: "Verbindungsfehler"
    },
    fr: {
      title: "Instagram Unfollower",
      subtitle: "Voyez qui ne vous suit pas en retour",
      welcomeTitle: "Prêt quand vous l'êtes",
      welcomeBody: "Vos abonnés sont chargés d'abord, puis chaque personne que vous suivez est comparée à eux. Rien n'est modifié sur votre compte pendant l'analyse.",
      scanBtn: "Analyser maintenant",
      scanning: "Analyse en cours",
      loadingFollowing: "Étape 2 sur 2 : vérification des personnes que vous suivez",
      loadingFollowers: "Étape 1 sur 2 : chargement de vos abonnés",
      paused: "En pause",
      pause: "Pause",
      resume: "Reprendre",
      cancel: "Annuler",
      ofTotal: "{current} sur {total}",
      scanCompletedToast: "{count} non-abonnés trouvés",
      scanFailed: "Échec de l'analyse",
      retry: "Réessayer",
      goBack: "Retour aux résultats",
      search: "Rechercher par nom ou identifiant",
      filterVerified: "Vérifié",
      filterPrivate: "Privé",
      filterNoAvatar: "Sans photo de profil",
      filterShowHidden: "Utilisateurs masqués",
      foundCount: "{count} non-abonnés",
      foundOne: "1 non-abonné",
      foundNone: "Parfait — tout le monde que vous suivez vous suit en retour.",
      noMatches: "Aucun utilisateur ne correspond à vos filtres.",
      hide: "Masquer",
      unhide: "Afficher",
      hideTooltip: "Masquer de cette liste",
      unhideTooltip: "Afficher à nouveau",
      openProfile: "Ouvrir le profil",
      copy: "Copier",
      copyAll: "Tout copier",
      copiedToast: "{count} identifiants copiés",
      selectAll: "Tout sélectionner",
      selectNone: "Effacer",
      selectedCount: "{count} sélectionné(s)",
      unfollow: "Ne plus suivre",
      unfollowConfirmTitle: "Ne plus suivre {count} utilisateurs ?",
      unfollowConfirmBody: "L'opération est lente pour protéger votre compte des limitations. Vous pouvez mettre en pause à tout moment, mais les désabonnements déjà effectués ne peuvent pas être annulés depuis cet outil.",
      unfollowConfirmBtn: "Oui, ne plus suivre {count}",
      unfollowing: "Désabonnement",
      currently: "Actuellement",
      nextActionIn: "Prochaine action dans {seconds}s",
      cooldownIn: "Pause — {seconds}s",
      scanPause: "Longue pause — {seconds}s",
      idle: "Prêt",
      unfollowDoneTitle: "Terminé",
      unfollowDoneBody: "{ok} désabonnés, {fail} échoués",
      doneRemoved: "Désabonnés ({count})",
      doneFailed: "Échoués ({count})",
      settings: "Paramètres",
      settingsTitle: "Réglages de cadence",
      settingsBody: "Des délais plus courts augmentent le risque qu'Instagram limite ou bloque votre compte. Restez prudent.",
      minScanDelay: "Délai d'analyse min (ms)",
      maxScanDelay: "Délai d'analyse max (ms)",
      scanPauseEvery: "Longue pause toutes les N pages",
      scanPauseLength: "Durée de la longue pause (ms)",
      minUnfollowDelay: "Délai de désabonnement min (ms)",
      maxUnfollowDelay: "Délai de désabonnement max (ms)",
      unfollowPauseEvery: "Pause toutes les N désabonnements",
      unfollowPauseLength: "Durée de la pause (ms)",
      restoreDefaults: "Réinitialiser",
      save: "Enregistrer",
      saved: "Paramètres enregistrés",
      cookieMissing: "Impossible de lire le cookie de connexion. Assurez-vous d'être connecté à Instagram.",
      csrfMissing: "Impossible de lire votre session. Assurez-vous d'être connecté à Instagram.",
      requestFailed: "Échec de la requête : {status}",
      tooManyRequests: "Instagram limite les requêtes. Réessayez plus tard ou augmentez les délais dans les paramètres.",
      rateLimitPaused: "Instagram vous limite. Mis en pause automatiquement — attendez quelques minutes puis appuyez sur Reprendre.",
      keepTabOpen: "Gardez cet onglet et le navigateur ouverts — les fermer arrête le processus.",
      close: "Fermer",
      minimize: "Réduire",
      expand: "Ouvrir",
      theme: "Thème",
      themeSystem: "Thème : système",
      themeLight: "Thème : clair",
      themeDark: "Thème : sombre",
      language: "Langue",
      selectVerified: "Sélectionner vérifiés",
      selectPrivate: "Sélectionner privés",
      selectNoPhoto: "Sélectionner sans photo",
      retryFailed: "Réessayer les échecs ({count})",
      pillScanning: "Analyse {current}/{total}",
      pillUnfollowing: "Désabonnement {current}/{total}",
      pillResults: "{count} non-abonnés",
      pillIdle: "Ouvrir",
      scanNotice: "Les grands comptes peuvent prendre du temps. Si Instagram interrompt l'analyse, votre progression est enregistrée — patientez un peu puis reprenez au lieu de recommencer.",
      countFollowers: "{current} abonnés chargés",
      countFollowing: "{current} comptes vérifiés",
      liveFound: "Non-abonnés trouvés jusqu'ici : {count}",
      usersPerRequest: "Utilisateurs demandés par page",
      sessionExpired: "Instagram vous a déconnecté. Reconnectez-vous, collez à nouveau le script et reprenez — l'analyse continue là où elle s'est arrêtée.",
      scanBlocked: "Instagram refuse temporairement les requêtes de liste pour ce compte. Attendez quelques heures puis reprenez.",
      networkError: "La connexion a été interrompue. Vérifiez votre réseau et reprenez.",
      limitedList: "Instagram limite cette liste en ce moment, les résultats ne peuvent donc pas être confirmés. Patientez un moment puis reprenez.",
      blockedPaused: "Instagram a bloqué cette action pour le moment. Mis en pause automatiquement — attendez quelques heures avant de reprendre, ou annulez.",
      keepTabVisible: "Gardez cet onglet au premier plan — les navigateurs ralentissent fortement les onglets en arrière-plan.",
      resumeScan: "Reprendre l'analyse",
      startOver: "Recommencer",
      resumeHint: "Une analyse précédente s'est arrêtée en cours de route. Reprenez-la au lieu de recommencer.",
      partialTitle: "Analyse interrompue",
      partialBody: "{loaded} des comptes que vous suivez ont été vérifiés. Les non-abonnés ci-dessous sont confirmés ; reprenez pour vérifier le reste.",
      showLastScan: "Afficher le dernier résultat ({count}, {age})",
      lastScanNotice: "Cette liste provient d'une analyse {age}. Relancez l'analyse pour l'état actuel.",
      rescan: "Relancer",
      reasonStillFollowing: "Instagram a répondu, mais vous suivez toujours ce compte",
      reasonUnconfirmed: "Instagram a répondu, mais le désabonnement n'a pas pu être confirmé",
      reasonRejected: "Instagram a refusé la requête",
      reasonNetwork: "Erreur de connexion"
    },
    es: {
      title: "Instagram Unfollower",
      subtitle: "Mira quién no te sigue de vuelta",
      welcomeTitle: "Listo cuando tú lo estés",
      welcomeBody: "Primero se cargan tus seguidores y luego se compara con ellos a cada persona que sigues. No se cambia nada en tu cuenta durante el análisis.",
      scanBtn: "Analizar ahora",
      scanning: "Analizando",
      loadingFollowing: "Paso 2 de 2: comprobando a las personas que sigues",
      loadingFollowers: "Paso 1 de 2: cargando tus seguidores",
      paused: "En pausa",
      pause: "Pausar",
      resume: "Reanudar",
      cancel: "Cancelar",
      ofTotal: "{current} de {total}",
      scanCompletedToast: "{count} no seguidores encontrados",
      scanFailed: "Error en el análisis",
      retry: "Intentar de nuevo",
      goBack: "Volver a los resultados",
      search: "Buscar por nombre o usuario",
      filterVerified: "Verificado",
      filterPrivate: "Privado",
      filterNoAvatar: "Sin foto de perfil",
      filterShowHidden: "Usuarios ocultos",
      foundCount: "{count} no seguidores",
      foundOne: "1 no seguidor",
      foundNone: "Genial — todos a los que sigues te siguen de vuelta.",
      noMatches: "Ningún usuario coincide con tus filtros.",
      hide: "Ocultar",
      unhide: "Mostrar",
      hideTooltip: "Ocultar de esta lista",
      unhideTooltip: "Mostrar de nuevo",
      openProfile: "Abrir perfil",
      copy: "Copiar",
      copyAll: "Copiar todo",
      copiedToast: "{count} nombres de usuario copiados",
      selectAll: "Seleccionar todo",
      selectNone: "Limpiar",
      selectedCount: "{count} seleccionados",
      unfollow: "Dejar de seguir",
      unfollowConfirmTitle: "¿Dejar de seguir a {count} usuarios?",
      unfollowConfirmBody: "Esto se ejecuta lentamente para proteger tu cuenta de los límites de Instagram. Puedes pausar en cualquier momento, pero a quienes ya dejaste de seguir no se puede revertir desde esta herramienta.",
      unfollowConfirmBtn: "Sí, dejar de seguir a {count}",
      unfollowing: "Dejando de seguir",
      currently: "Actualmente",
      nextActionIn: "Próxima acción en {seconds}s",
      cooldownIn: "Enfriamiento — {seconds}s",
      scanPause: "Pausa larga — {seconds}s",
      idle: "Listo",
      unfollowDoneTitle: "Hecho",
      unfollowDoneBody: "{ok} dejados de seguir, {fail} fallidos",
      doneRemoved: "Dejados de seguir ({count})",
      doneFailed: "Fallidos ({count})",
      settings: "Ajustes",
      settingsTitle: "Ajustes de ritmo",
      settingsBody: "Retrasos más cortos aumentan la probabilidad de que Instagram limite o bloquee tu cuenta. Mantenlos conservadores.",
      minScanDelay: "Retraso mín. de análisis (ms)",
      maxScanDelay: "Retraso máx. de análisis (ms)",
      scanPauseEvery: "Pausa larga cada N páginas",
      scanPauseLength: "Duración de la pausa larga (ms)",
      minUnfollowDelay: "Retraso mín. al dejar de seguir (ms)",
      maxUnfollowDelay: "Retraso máx. al dejar de seguir (ms)",
      unfollowPauseEvery: "Enfriamiento cada N dejados de seguir",
      unfollowPauseLength: "Duración del enfriamiento (ms)",
      restoreDefaults: "Restaurar valores",
      save: "Guardar",
      saved: "Ajustes guardados",
      cookieMissing: "No se pudo leer la cookie de inicio de sesión. Asegúrate de haber iniciado sesión en Instagram.",
      csrfMissing: "No se pudo leer tu sesión. Asegúrate de haber iniciado sesión en Instagram.",
      requestFailed: "La solicitud falló: {status}",
      tooManyRequests: "Instagram está limitando las solicitudes. Inténtalo más tarde o aumenta los retrasos en los ajustes.",
      rateLimitPaused: "Instagram te está limitando. Pausado automáticamente — espera unos minutos y pulsa Reanudar.",
      keepTabOpen: "Mantén esta pestaña y el navegador abiertos — cerrarlos detiene el proceso.",
      close: "Cerrar",
      minimize: "Minimizar",
      expand: "Abrir",
      theme: "Tema",
      themeSystem: "Tema: sistema",
      themeLight: "Tema: claro",
      themeDark: "Tema: oscuro",
      language: "Idioma",
      selectVerified: "Seleccionar verificados",
      selectPrivate: "Seleccionar privados",
      selectNoPhoto: "Seleccionar sin foto",
      retryFailed: "Reintentar fallidos ({count})",
      pillScanning: "Analizando {current}/{total}",
      pillUnfollowing: "Dejando de seguir {current}/{total}",
      pillResults: "{count} no seguidores",
      pillIdle: "Abrir",
      scanNotice: "Las cuentas grandes pueden tardar. Si Instagram interrumpe el análisis, tu progreso se guarda — espera un poco y reanuda en lugar de empezar de nuevo.",
      countFollowers: "{current} seguidores cargados",
      countFollowing: "{current} cuentas comprobadas",
      liveFound: "No seguidores encontrados hasta ahora: {count}",
      usersPerRequest: "Usuarios solicitados por página",
      sessionExpired: "Instagram cerró tu sesión. Vuelve a iniciar sesión, pega el script otra vez y reanuda — el análisis continúa donde se detuvo.",
      scanBlocked: "Instagram rechaza temporalmente las solicitudes de listas para esta cuenta. Espera unas horas y luego reanuda.",
      networkError: "Se perdió la conexión. Revisa tu red y reanuda.",
      limitedList: "Instagram está limitando esta lista ahora mismo, así que los resultados no se pueden confirmar. Espera un rato y luego reanuda.",
      blockedPaused: "Instagram bloqueó esta acción por ahora. Pausado automáticamente — espera unas horas antes de reanudar, o cancela.",
      keepTabVisible: "Mantén esta pestaña en primer plano — los navegadores ralentizan mucho las pestañas en segundo plano.",
      resumeScan: "Reanudar análisis",
      startOver: "Empezar de nuevo",
      resumeHint: "Un análisis anterior se detuvo a medias. Continúa desde ahí en lugar de empezar de nuevo.",
      partialTitle: "Análisis interrumpido",
      partialBody: "Se comprobaron {loaded} de las cuentas que sigues. Los no seguidores de abajo están confirmados; reanuda para comprobar el resto.",
      showLastScan: "Ver el último resultado ({count}, {age})",
      lastScanNotice: "Esta lista es de un análisis {age}. Vuelve a analizar para ver el estado actual.",
      rescan: "Volver a analizar",
      reasonStillFollowing: "Instagram respondió, pero sigues a esta cuenta",
      reasonUnconfirmed: "Instagram respondió, pero no se pudo confirmar que dejaste de seguir",
      reasonRejected: "Instagram rechazó la solicitud",
      reasonNetwork: "Error de conexión"
    }
  };

  const SVG = {
    minimize: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="7.25" width="10" height="1.5" rx="0.75" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    gear: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm6.7 2.5a6.7 6.7 0 0 0-.1-1.1l1.4-1.1-1.5-2.6-1.7.7a6.6 6.6 0 0 0-1.9-1.1L10.5 1h-3l-.4 1.8a6.6 6.6 0 0 0-1.9 1.1l-1.7-.7L1.9 5.8 3.3 6.9a6.7 6.7 0 0 0 0 2.2L1.9 10.2l1.5 2.6 1.7-.7a6.6 6.6 0 0 0 1.9 1.1L7.5 15h3l.4-1.8a6.6 6.6 0 0 0 1.9-1.1l1.7.7 1.5-2.6-1.4-1.1c.1-.4.1-.7.1-1.1z"/></svg>',
    open: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M6 3h7v7M13 3L6.5 9.5M9 13H3V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path fill="currentColor" d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2zm6 11l1 2.8L22 17l-3 .8L18 21l-1-3.2L14 17l3-1.2 1-2.8z"/></svg>',
    alert: '<svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path fill="currentColor" d="M12 2 1 21h22L12 2zm0 6 7.5 13h-15L12 8zm-1 4v4h2v-4h-2zm0 5v2h2v-2h-2z"/></svg>',
    check: '<svg viewBox="0 0 16 16" width="36" height="36" aria-hidden="true"><path fill="currentColor" d="M14 4.5L6 12.5l-4-4L3 7.5l3 3 7-7z"/></svg>',
    sun: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="3" fill="currentColor"/><g stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M13 3l-1.1 1.1M4.1 11.9 3 13"/></g></svg>',
    moon: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M6 1.4A6.6 6.6 0 1 0 14.6 10 5.2 5.2 0 0 1 6 1.4z"/></svg>',
    auto: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="9" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 14h5M8 11.5V14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>'
  };

  const persisted = loadStored();

  const state = {
    mode: "idle",
    scanPaused: false,
    scanCancelled: false,
    unfollowPaused: false,
    unfollowCancelled: false,
    progress: { current: 0, total: 0, label: "loadingFollowers", note: "" },
    waitUntil: 0,
    waitReason: "",
    users: [],
    selected: new Set(),
    hidden: new Set(Array.isArray(persisted.hidden) ? persisted.hidden.map(String) : []),
    log: [],
    search: "",
    filters: { verified: true, private: true, noAvatar: true, showHidden: false, ...(persisted.filters || {}) },
    timings: loadTimings(persisted.timings),
    panelPos: persisted.panelPos || null,
    // Persisted panel size (user can resize from any edge/corner). Null = default.
    panelSize: (persisted.panelSize && Number.isFinite(persisted.panelSize.w) && Number.isFinite(persisted.panelSize.h)) ? persisted.panelSize : null,
    minimized: Boolean(persisted.minimized),
    language: LANGS.includes(persisted.language) ? persisted.language : "en",
    // User preference: 'system' follows the OS; 'light'/'dark' force a theme.
    theme: persisted.theme === "light" || persisted.theme === "dark" ? persisted.theme : "system",
    // Transient: which quick-select shortcut is active ('all'|'verified'|'private'|'no-photo'|null).
    // While one is active, the others are disabled and it acts as a "clear" toggle.
    selectMode: null,
    // i18n key of the warning shown while an unfollow run is auto-paused because
    // Instagram pushed back ("rateLimitPaused" | "blockedPaused"), else "".
    pauseReason: "",
    // A saved, unfinished scan (see createCheckpoint), or null.
    checkpoint: loadCheckpoint(),
    // True when the results come from a scan that stopped partway.
    partial: false,
    // Set when the results are a cached earlier scan rather than a fresh one.
    staleNotice: "",
    error: ""
  };

  let countdownTimer = null;
  let toastTimer = null;
  // Set once the panel is closed: every running loop checks it and stops, so a
  // closed panel never keeps scanning or unfollowing in the background.
  let destroyed = false;
  let activeRequest = null;
  let sessionTokens = null;

  function readJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      /* storage may be disabled or full; ignore */
      return false;
    }
  }

  function removeKey(key) {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }

  function loadStored() {
    const current = readJSON(STORAGE_KEY);
    if (current && typeof current === "object") return current;
    const legacy = readJSON(LEGACY_STORAGE_KEY);
    return legacy && typeof legacy === "object" ? legacy : {};
  }

  // Merge saved timings over the defaults, dropping anything that isn't a sane
  // non-negative number (a hand-edited or corrupted value must never turn into
  // a zero delay or a NaN sleep).
  function loadTimings(saved) {
    const timings = { ...DEFAULT_TIMINGS };
    for (const key of Object.keys(timings)) {
      const value = saved?.[key];
      if (Number.isFinite(value) && value >= 0) timings[key] = value;
    }
    timings.usersPerRequest = clamp(Math.round(timings.usersPerRequest) || DEFAULT_TIMINGS.usersPerRequest, 1, MAX_USERS_PER_REQUEST);
    return timings;
  }

  function persist() {
    writeJSON(STORAGE_KEY, {
      hidden: [...state.hidden],
      timings: state.timings,
      filters: state.filters,
      panelPos: state.panelPos,
      panelSize: state.panelSize,
      minimized: state.minimized,
      language: state.language,
      theme: state.theme
    });
  }

  // --- Scan checkpoint (resume after an interruption) ------------------------
  // Both lists are paged with a cursor; after every page we save what we have
  // plus the next cursor, so a rate limit, sign-out or closed tab costs nothing.
  function createCheckpoint(viewerId) {
    return {
      viewerId: String(viewerId),
      savedAt: Date.now(),
      followerIds: [],
      followerNames: [],
      followersCursor: "",
      followersDone: false,
      following: [],
      followingCursor: "",
      followingDone: false,
      stopReason: ""
    };
  }

  function loadCheckpoint() {
    const saved = readJSON(CHECKPOINT_KEY);
    if (!saved || typeof saved !== "object" || !saved.viewerId) return null;
    if (!Array.isArray(saved.followerIds) || !Array.isArray(saved.following)) return null;
    if (Date.now() - Number(saved.savedAt || 0) > SAVED_SCAN_TTL) return null;
    if (saved.followersDone && saved.followingDone) return null;
    if (!saved.followerIds.length && !saved.following.length) return null;
    if (String(saved.viewerId) !== String(getCookie("ds_user_id"))) return null;
    return { ...createCheckpoint(saved.viewerId), ...saved };
  }

  function saveCheckpoint(checkpoint) {
    if (!checkpoint) return;
    checkpoint.savedAt = Date.now();
    writeJSON(CHECKPOINT_KEY, checkpoint);
  }

  function clearCheckpoint() {
    state.checkpoint = null;
    state.partial = false;
    removeKey(CHECKPOINT_KEY);
  }

  // --- Last completed scan (shown again without rescanning) -----------------
  function saveLastScan(savedAt = Date.now()) {
    writeJSON(LAST_SCAN_KEY, {
      viewerId: getCookie("ds_user_id"),
      savedAt,
      users: state.users.filter((u) => !u.follows_viewer)
    });
  }

  function loadLastScan() {
    const saved = readJSON(LAST_SCAN_KEY);
    if (!saved || !Array.isArray(saved.users) || !saved.viewerId) return null;
    if (String(saved.viewerId) !== String(getCookie("ds_user_id"))) return null;
    if (Date.now() - Number(saved.savedAt || 0) > SAVED_SCAN_TTL) return null;
    return saved;
  }

  function showLastScan() {
    const saved = loadLastScan();
    if (!saved) return renderBody();
    state.users = saved.users.map((user) => ({ ...user, follows_viewer: false }));
    state.selected.clear();
    state.selectMode = null;
    state.partial = false;
    state.staleNotice = t("lastScanNotice", { age: timeAgo(saved.savedAt) });
    state.mode = "results";
    renderBody();
  }

  function timeAgo(timestamp) {
    const minutes = Math.max(1, Math.round((Date.now() - Number(timestamp)) / 60000));
    try {
      const format = new Intl.RelativeTimeFormat(state.language, { numeric: "auto" });
      return minutes < 60 ? format.format(-minutes, "minute") : format.format(-Math.round(minutes / 60), "hour");
    } catch {
      return minutes < 60 ? `${minutes} min` : `${Math.round(minutes / 60)} h`;
    }
  }

  function formatCount(value) {
    try {
      return (Number(value) || 0).toLocaleString(state.language);
    } catch {
      return String(Number(value) || 0);
    }
  }

  function t(key, vars) {
    const dict = I18N[state.language] || I18N.en;
    const template = dict[key] ?? I18N.en[key] ?? key;
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
  }

  function cleanupExisting() {
    if (typeof window.__ucCleanup === "function") {
      try { window.__ucCleanup(); } catch { /* ignore */ }
    }
    document.getElementById(APP_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function mount() {
    const root = document.createElement("div");
    root.id = APP_ID;
    document.body.appendChild(root);
    window.__ucCleanup = unmount;
    prefersDark.addEventListener("change", onSystemThemeChange);
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibilityChange);
    renderShell();
    applyTheme();
  }

  function unmount() {
    if (destroyed) return;
    destroyed = true;
    // Stop any running scan/unfollow loop and the request in flight.
    state.scanCancelled = true;
    state.unfollowCancelled = true;
    state.scanPaused = false;
    state.unfollowPaused = false;
    activeRequest?.abort();
    stopCountdown();
    if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
    prefersDark.removeEventListener("change", onSystemThemeChange);
    window.removeEventListener("beforeunload", onBeforeUnload);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    document.getElementById(APP_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();
    if (window.__ucCleanup === unmount) window.__ucCleanup = null;
  }

  // Browsers heavily throttle timers in background tabs, so a scan in a hidden
  // tab crawls. Surface that instead of looking stuck.
  function visibilityNote() {
    return document.hidden ? t("keepTabVisible") : "";
  }

  function onVisibilityChange() {
    if (state.mode !== "scanning") return;
    state.progress.note = visibilityNote();
    updateProgressDOM();
  }

  // Warn before leaving while a scan/unfollow is running — closing the tab or
  // browser stops the operation mid-way.
  function onBeforeUnload(event) {
    if (state.mode === "scanning" || state.mode === "unfollowing") {
      event.preventDefault();
      event.returnValue = "";
      return "";
    }
  }

  function renderShell() {
    const root = document.getElementById(APP_ID);
    if (!root) return;
    if (state.minimized) {
      root.innerHTML = `
        <button class="uc-pill" data-action="expand" type="button" aria-label="${escapeAttr(t("expand"))}">
          <span class="uc-pill-dot ${pillStateClass()}"></span>
          <span data-pill-label>${escapeHTML(pillLabel())}</span>
        </button>
      `;
      root.querySelector("[data-action='expand']")?.addEventListener("click", () => setMinimized(false));
      applyPanelPosition();
      applyTheme();
      return;
    }
    root.innerHTML = `
      <section class="uc-panel" role="dialog" aria-label="${escapeAttr(t("title"))}">
        <header class="uc-header" data-drag>
          <div class="uc-brand">
            <span class="uc-brand-dot"></span>
            <div class="uc-brand-text">
              <strong>${escapeHTML(t("title"))}</strong>
              <span data-subtitle>${escapeHTML(t("subtitle"))}</span>
            </div>
          </div>
          <div class="uc-header-actions">
            <button type="button" data-action="settings" aria-label="${escapeAttr(t("settings"))}" title="${escapeAttr(t("settings"))}">${SVG.gear}</button>
            <button type="button" data-action="theme" aria-label="${escapeAttr(t("theme"))}" title="${escapeAttr(t(themeTitleKey()))}">${themeIcon()}</button>
            <button type="button" data-action="language" aria-label="${escapeAttr(t("language"))}" title="${escapeAttr(t("language"))}"><span data-lang>${escapeHTML(state.language.toUpperCase())}</span></button>
            <button type="button" data-action="minimize" aria-label="${escapeAttr(t("minimize"))}" title="${escapeAttr(t("minimize"))}">${SVG.minimize}</button>
            <button type="button" data-action="close" aria-label="${escapeAttr(t("close"))}" title="${escapeAttr(t("close"))}">${SVG.close}</button>
          </div>
        </header>
        <div class="uc-body" data-body></div>
        <div class="uc-resize uc-resize--n" data-resize="n"></div>
        <div class="uc-resize uc-resize--s" data-resize="s"></div>
        <div class="uc-resize uc-resize--e" data-resize="e"></div>
        <div class="uc-resize uc-resize--w" data-resize="w"></div>
        <div class="uc-resize uc-resize--ne" data-resize="ne"></div>
        <div class="uc-resize uc-resize--nw" data-resize="nw"></div>
        <div class="uc-resize uc-resize--se" data-resize="se"></div>
        <div class="uc-resize uc-resize--sw" data-resize="sw"></div>
      </section>
    `;
    bindHeader(root);
    bindDrag(root.querySelector("[data-drag]"));
    bindResize(root.querySelector(".uc-panel"));
    applyPanelPosition();
    applyTheme();
    renderBody();
  }

  function bindHeader(root) {
    root.querySelector("[data-action='close']")?.addEventListener("click", () => unmount());
    root.querySelector("[data-action='minimize']")?.addEventListener("click", () => setMinimized(true));
    root.querySelector("[data-action='settings']")?.addEventListener("click", showSettings);
    root.querySelector("[data-action='theme']")?.addEventListener("click", cycleTheme);
    root.querySelector("[data-action='language']")?.addEventListener("click", cycleLanguage);
  }

  // Only the results list justifies a fixed (resizable) height. Every other view
  // — idle, scan/unfollow progress, AND the unfollow-done summary — hugs its
  // content so there's no large empty area below. The done list scrolls within
  // its own max-height when it's long.
  function modeUsesFixedHeight() {
    return state.mode === "results";
  }

  // Apply the persisted panel size: width always, height only for list views.
  function applyPanelSize() {
    const node = document.querySelector(`#${APP_ID} .uc-panel`);
    if (!node) return;
    if (state.panelSize) {
      const maxW = Math.max(PANEL_MIN_WIDTH, window.innerWidth - 16);
      node.style.width = clamp(state.panelSize.w, PANEL_MIN_WIDTH, maxW) + "px";
      if (modeUsesFixedHeight()) {
        const maxH = Math.max(PANEL_MIN_HEIGHT, window.innerHeight - 16);
        node.style.height = clamp(state.panelSize.h, PANEL_MIN_HEIGHT, maxH) + "px";
      } else {
        node.style.height = "auto";
      }
    } else {
      node.style.height = "auto";
    }
  }

  function applyPanelPosition() {
    const root = document.getElementById(APP_ID);
    if (!root) return;
    const node = root.querySelector(".uc-panel") || root.querySelector(".uc-pill");
    if (!node) return;
    if (node.classList.contains("uc-panel")) applyPanelSize();
    const pos = state.panelPos;
    if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
      const max = panelBounds(node);
      node.style.left = clamp(pos.x, 0, max.x) + "px";
      node.style.top = clamp(pos.y, 0, max.y) + "px";
      node.style.right = "auto";
      node.style.bottom = "auto";
    } else {
      node.style.left = "auto";
      node.style.top = "auto";
      node.style.right = PANEL_MARGIN + "px";
      node.style.bottom = PANEL_MARGIN + "px";
    }
  }

  function panelBounds(node) {
    const rect = node.getBoundingClientRect();
    return {
      x: Math.max(0, window.innerWidth - rect.width),
      y: Math.max(0, window.innerHeight - rect.height)
    };
  }

  function bindDrag(handle) {
    if (!handle) return;
    const panel = handle.closest(".uc-panel");
    if (!panel) return;
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;
    let dragging = false;

    handle.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      dragging = true;
      const rect = panel.getBoundingClientRect();
      originX = rect.left;
      originY = rect.top;
      startX = event.clientX;
      startY = event.clientY;
      panel.style.left = originX + "px";
      panel.style.top = originY + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      handle.setPointerCapture(event.pointerId);
      handle.classList.add("uc-dragging");
    });

    handle.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const max = panelBounds(panel);
      const x = clamp(originX + (event.clientX - startX), 0, max.x);
      const y = clamp(originY + (event.clientY - startY), 0, max.y);
      panel.style.left = x + "px";
      panel.style.top = y + "px";
    });

    const stop = (event) => {
      if (!dragging) return;
      dragging = false;
      handle.releasePointerCapture?.(event.pointerId);
      handle.classList.remove("uc-dragging");
      const rect = panel.getBoundingClientRect();
      state.panelPos = { x: rect.left, y: rect.top };
      persist();
    };
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }

  // Make the panel resizable from any edge or corner. Each handle adjusts width
  // and/or height (and shifts left/top when dragging the top/left edges so the
  // opposite edge stays put). The chosen size is clamped and persisted.
  function bindResize(panel) {
    if (!panel) return;
    panel.querySelectorAll("[data-resize]").forEach((handle) => {
      const dir = handle.getAttribute("data-resize");
      let startX = 0, startY = 0, x0 = 0, y0 = 0, w0 = 0, h0 = 0, resizing = false;

      handle.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        event.stopPropagation();
        resizing = true;
        const rect = panel.getBoundingClientRect();
        x0 = rect.left; y0 = rect.top; w0 = rect.width; h0 = rect.height;
        startX = event.clientX; startY = event.clientY;
        // Pin the panel to explicit left/top so edge resizes can move it.
        panel.style.left = x0 + "px";
        panel.style.top = y0 + "px";
        panel.style.right = "auto";
        panel.style.bottom = "auto";
        panel.style.maxWidth = "none";
        panel.style.maxHeight = "none";
        handle.setPointerCapture(event.pointerId);
        panel.classList.add("uc-resizing");
      });

      handle.addEventListener("pointermove", (event) => {
        if (!resizing) return;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        const maxW = Math.max(PANEL_MIN_WIDTH, window.innerWidth - 8);
        const maxH = Math.max(PANEL_MIN_HEIGHT, window.innerHeight - 8);
        let w = w0, h = h0, left = x0, top = y0;

        if (dir.includes("e")) w = clamp(w0 + dx, PANEL_MIN_WIDTH, maxW);
        if (dir.includes("s")) h = clamp(h0 + dy, PANEL_MIN_HEIGHT, maxH);
        if (dir.includes("w")) {
          w = clamp(w0 - dx, PANEL_MIN_WIDTH, Math.min(maxW, x0 + w0));
          left = x0 + (w0 - w);
        }
        if (dir.includes("n")) {
          h = clamp(h0 - dy, PANEL_MIN_HEIGHT, Math.min(maxH, y0 + h0));
          top = y0 + (h0 - h);
        }

        panel.style.width = w + "px";
        panel.style.height = h + "px";
        panel.style.left = Math.max(0, left) + "px";
        panel.style.top = Math.max(0, top) + "px";
      });

      const stop = (event) => {
        if (!resizing) return;
        resizing = false;
        handle.releasePointerCapture?.(event.pointerId);
        panel.classList.remove("uc-resizing");
        const rect = panel.getBoundingClientRect();
        state.panelSize = { w: Math.round(rect.width), h: Math.round(rect.height) };
        state.panelPos = { x: rect.left, y: rect.top };
        persist();
      };
      handle.addEventListener("pointerup", stop);
      handle.addEventListener("pointercancel", stop);
    });
  }

  function setMinimized(value) {
    state.minimized = Boolean(value);
    persist();
    renderShell();
  }

  function pillLabel() {
    if (state.mode === "scanning") {
      return t("pillScanning", {
        current: formatCount(state.progress.current),
        total: state.progress.total ? formatCount(state.progress.total) : "?"
      });
    }
    if (state.mode === "unfollowing") {
      return t("pillUnfollowing", { current: state.progress.current, total: state.progress.total });
    }
    if (state.mode === "results" && state.users.length) {
      return t("pillResults", { count: nonFollowers().length });
    }
    return t("pillIdle");
  }

  function pillStateClass() {
    if (state.mode === "scanning" || state.mode === "unfollowing") return "uc-pill-dot--active";
    if (state.error) return "uc-pill-dot--error";
    return "";
  }

  function renderBody() {
    const body = document.querySelector(`#${APP_ID} [data-body]`);
    if (!body) return;
    if (state.mode === "scanning") {
      body.innerHTML = renderScanView();
      bindScan(body);
    } else if (state.mode === "results") {
      body.innerHTML = renderResultsView();
      bindResults(body);
    } else if (state.mode === "unfollowing" || state.mode === "unfollowDone") {
      body.innerHTML = renderUnfollowView();
      bindUnfollow(body);
    } else {
      body.innerHTML = renderIdleView();
      bindIdle(body);
    }
    // Re-evaluate the panel height: fixed for list views, auto for short ones.
    applyPanelSize();
    if (state.mode === "scanning" || state.mode === "unfollowing") startCountdown();
    else stopCountdown();
  }

  function renderIdleView() {
    const checkpoint = state.checkpoint;
    const resumeActions = checkpoint ? `
      <div class="uc-welcome-actions">
        <button type="button" class="uc-btn uc-btn--primary uc-btn--lg" data-action="resume-scan">${escapeHTML(t("resumeScan"))}</button>
        <button type="button" class="uc-btn uc-btn--ghost" data-action="restart-scan">${escapeHTML(t("startOver"))}</button>
      </div>` : "";
    if (state.error) {
      return `
        <div class="uc-welcome">
          <div class="uc-welcome-icon uc-welcome-icon--error">${SVG.alert}</div>
          <h2>${escapeHTML(t("scanFailed"))}</h2>
          <p>${escapeHTML(state.error)}</p>
          ${checkpoint ? resumeActions : `<button type="button" class="uc-btn uc-btn--primary" data-action="scan">${escapeHTML(t("retry"))}</button>`}
        </div>
      `;
    }
    if (checkpoint) {
      return `
        <div class="uc-welcome">
          <div class="uc-welcome-icon">${SVG.sparkle}</div>
          <h2>${escapeHTML(t("welcomeTitle"))}</h2>
          <p>${escapeHTML(t("resumeHint"))}</p>
          ${checkpoint.stopReason ? `<p>${escapeHTML(checkpoint.stopReason)}</p>` : ""}
          ${resumeActions}
        </div>
      `;
    }
    const last = loadLastScan();
    return `
      <div class="uc-welcome">
        <div class="uc-welcome-icon">${SVG.sparkle}</div>
        <h2>${escapeHTML(t("welcomeTitle"))}</h2>
        <p>${escapeHTML(t("welcomeBody"))}</p>
        <p class="uc-welcome-note">${escapeHTML(t("scanNotice"))}</p>
        <div class="uc-welcome-actions">
          <button type="button" class="uc-btn uc-btn--primary uc-btn--lg" data-action="scan">${escapeHTML(t("scanBtn"))}</button>
          ${last ? `<button type="button" class="uc-btn uc-btn--ghost" data-action="show-last">${escapeHTML(t("showLastScan", { count: formatCount(last.users.length), age: timeAgo(last.savedAt) }))}</button>` : ""}
        </div>
      </div>
    `;
  }

  function bindIdle(body) {
    body.querySelector("[data-action='scan']")?.addEventListener("click", () => startScan());
    body.querySelector("[data-action='show-last']")?.addEventListener("click", showLastScan);
    bindScanResume(body);
  }

  function bindScanResume(body) {
    body.querySelector("[data-action='resume-scan']")?.addEventListener("click", () => startScan({ resume: true }));
    body.querySelector("[data-action='restart-scan']")?.addEventListener("click", () => {
      clearCheckpoint();
      startScan();
    });
  }

  // "1,234 followers loaded" / "1,234 of 2,000" depending on what we know.
  function progressCounter() {
    const { current, total, label } = state.progress;
    if (total) return t("ofTotal", { current: formatCount(current), total: formatCount(total) });
    return t(label === "loadingFollowing" ? "countFollowing" : "countFollowers", { current: formatCount(current) });
  }

  // While the following list loads, non-followers can already be counted
  // (the follower list is complete by then).
  function liveFoundLabel() {
    if (state.progress.label !== "loadingFollowing") return "";
    return t("liveFound", { count: formatCount(nonFollowers().length) });
  }

  function renderScanView() {
    const { current, total, label, note } = state.progress;
    const percent = total ? Math.min(100, Math.round((current / total) * 100)) : 0;
    const live = liveFoundLabel();
    return `
      <div class="uc-progress">
        <div class="uc-progress-head">
          <h2 data-progress-label>${escapeHTML(state.scanPaused ? t("paused") : t(label))}</h2>
          <p data-progress-note>${escapeHTML(note)}</p>
        </div>
        <div class="uc-bar${total ? "" : " uc-bar--indeterminate"}" data-bar><span data-progress-bar style="width:${percent}%"></span></div>
        <div class="uc-progress-meta">
          <span data-progress-counter>${escapeHTML(progressCounter())}</span>
          <span data-countdown class="uc-muted"></span>
        </div>
        <div class="uc-live" data-live-found ${live ? "" : "hidden"}>${escapeHTML(live)}</div>
        <div class="uc-warn uc-warn--soft">${escapeHTML(t("keepTabOpen"))}</div>
        <div class="uc-progress-actions">
          <button type="button" class="uc-btn" data-action="pause-scan">${escapeHTML(t(state.scanPaused ? "resume" : "pause"))}</button>
          <button type="button" class="uc-btn uc-btn--ghost" data-action="cancel-scan">${escapeHTML(t("cancel"))}</button>
        </div>
      </div>
    `;
  }

  function bindScan(body) {
    body.querySelector("[data-action='pause-scan']")?.addEventListener("click", () => {
      state.scanPaused = !state.scanPaused;
      const btn = body.querySelector("[data-action='pause-scan']");
      if (btn) btn.textContent = t(state.scanPaused ? "resume" : "pause");
      const label = body.querySelector("[data-progress-label]");
      if (label) label.textContent = state.scanPaused ? t("paused") : t(state.progress.label);
    });
    body.querySelector("[data-action='cancel-scan']")?.addEventListener("click", () => {
      state.scanCancelled = true;
      state.scanPaused = false;
      activeRequest?.abort();
    });
  }

  function renderResultsView() {
    const display = getDisplayUsers();
    const totalNonFollowers = nonFollowers().length;
    let summary;
    if (totalNonFollowers === 0) summary = t("foundNone");
    else if (totalNonFollowers === 1) summary = t("foundOne");
    else summary = t("foundCount", { count: totalNonFollowers });

    // Chip visibility is based on the whole pool (not the active filters/search),
    // so a category's chip is shown only when that category exists at all.
    const pool = getPool();

    return `
      <div class="uc-results">
        ${renderResultsNotice()}
        <div class="uc-results-summary">${escapeHTML(summary)}</div>
        <div class="uc-search-row">
          <input
            class="uc-search"
            type="search"
            data-search
            placeholder="${escapeAttr(t("search"))}"
            value="${escapeAttr(state.search)}"
            autocomplete="off"
            spellcheck="false"
          >
        </div>
        <div class="uc-filters">
          ${filterChip("verified", t("filterVerified"), pool.some((u) => u.is_verified))}
          ${filterChip("private", t("filterPrivate"), pool.some((u) => u.is_private))}
          ${filterChip("noAvatar", t("filterNoAvatar"), pool.some((u) => isDefaultAvatar(u)))}
          ${filterChip("showHidden", t("filterShowHidden"), state.hidden.size > 0 || state.filters.showHidden)}
        </div>
        <div class="uc-list" data-list>${renderUserList(display)}</div>
        <div class="uc-actionbar">
          <div class="uc-actionbar-left">
            <span class="uc-select-group" data-select-group>${renderSelectButtons()}</span>
            <span class="uc-muted" data-selected-label>${escapeHTML(t("selectedCount", { count: state.selected.size }))}</span>
          </div>
          <div class="uc-actionbar-right">
            <button type="button" class="uc-btn uc-btn--small" data-action="copy" ${display.length ? "" : "disabled"}>${escapeHTML(state.selected.size ? t("copy") : t("copyAll"))}</button>
            <button type="button" class="uc-btn uc-btn--danger uc-btn--small" data-action="unfollow" ${state.selected.size ? "" : "disabled"}>${escapeHTML(t("unfollow"))}${state.selected.size ? " (" + state.selected.size + ")" : ""}</button>
          </div>
        </div>
      </div>
    `;
  }

  // A banner above the results when they're not a fresh, complete scan: either
  // the scan stopped partway (offer to resume) or the list is a cached one.
  function renderResultsNotice() {
    const checkpoint = state.checkpoint;
    if (state.partial && checkpoint) {
      return `
        <div class="uc-notice" role="status">
          <strong>${escapeHTML(t("partialTitle"))}</strong>
          <p>${escapeHTML(t("partialBody", { loaded: formatCount(checkpoint.following.length) }))}</p>
          ${checkpoint.stopReason ? `<p class="uc-notice-reason">${escapeHTML(checkpoint.stopReason)}</p>` : ""}
          <div class="uc-notice-actions">
            <button type="button" class="uc-btn uc-btn--primary uc-btn--small" data-action="resume-scan">${escapeHTML(t("resumeScan"))}</button>
            <button type="button" class="uc-btn uc-btn--ghost uc-btn--small" data-action="restart-scan">${escapeHTML(t("startOver"))}</button>
          </div>
        </div>`;
    }
    if (state.staleNotice) {
      return `
        <div class="uc-notice" role="status">
          <p>${escapeHTML(state.staleNotice)}</p>
          <div class="uc-notice-actions">
            <button type="button" class="uc-btn uc-btn--small" data-action="scan">${escapeHTML(t("rescan"))}</button>
          </div>
        </div>`;
    }
    return "";
  }

  // The quick-select buttons (Select all / verified / private / no-photo). They
  // behave as one exclusive group: activating one selects exactly its matches,
  // turns that button into a "Clear" toggle, and disables the others until
  // cleared. Visibility is based on the filtered set WITHOUT search, so typing a
  // non-matching query never makes the buttons vanish. A button is shown only
  // when its category has at least one (filter-respecting) match.
  function renderSelectButtons() {
    const display = getDisplayNoSearch();
    const defs = [
      { mode: "all", action: "select-all", label: "selectAll", show: display.length > 0 },
      { mode: "verified", action: "select-verified", label: "selectVerified", show: display.some((u) => u.is_verified) },
      { mode: "private", action: "select-private", label: "selectPrivate", show: display.some((u) => u.is_private) },
      { mode: "no-photo", action: "select-no-photo", label: "selectNoPhoto", show: display.some((u) => isDefaultAvatar(u)) },
    ];
    const active = state.selectMode;
    return defs
      .filter((d) => d.show)
      .map((d) => {
        const isActive = active === d.mode;
        const disabled = active && !isActive;
        const ghost = d.mode === "all" ? "" : " uc-btn--ghost";
        return `<button type="button" class="uc-btn uc-btn--small${ghost}" data-action="${d.action}"${disabled ? " disabled" : ""}>${escapeHTML(isActive ? t("selectNone") : t(d.label))}</button>`;
      })
      .join("");
  }

  // Quick-select group behaviour: activating one selects exactly its matches in
  // the filtered list (ignoring the search box, to match the buttons' own
  // visibility) and turns it into a "Clear" toggle; the others disable until
  // cleared. Clicking the active one again clears the selection.
  const SELECT_PREDS = {
    all: () => true,
    verified: (u) => u.is_verified,
    private: (u) => u.is_private,
    "no-photo": (u) => isDefaultAvatar(u),
  };

  function bindSelectButtons(body) {
    const apply = (mode) => {
      if (state.selectMode === mode) {
        state.selected.clear();
        state.selectMode = null;
      } else {
        state.selected = new Set(getDisplayNoSearch().filter(SELECT_PREDS[mode]).map((u) => u.id));
        state.selectMode = mode;
      }
      renderBody();
    };
    body.querySelector("[data-action='select-all']")?.addEventListener("click", () => apply("all"));
    body.querySelector("[data-action='select-verified']")?.addEventListener("click", () => apply("verified"));
    body.querySelector("[data-action='select-private']")?.addEventListener("click", () => apply("private"));
    body.querySelector("[data-action='select-no-photo']")?.addEventListener("click", () => apply("no-photo"));
  }

  // Re-render just the quick-select buttons in place (used after a search edit,
  // so the search input keeps focus instead of a full re-render).
  function refreshSelectButtons(body) {
    const group = body.querySelector("[data-select-group]");
    if (!group) return;
    group.innerHTML = renderSelectButtons();
    bindSelectButtons(body);
  }

  function filterChip(key, label, visible = true) {
    // Hide a chip when its category doesn't exist in the current pool.
    if (!visible) return "";
    const active = state.filters[key];
    return `
      <button type="button" class="uc-chip ${active ? "uc-chip--on" : ""}" data-filter="${escapeAttr(key)}" aria-pressed="${active ? "true" : "false"}">
        <span class="uc-chip-tick">${active ? SVG.check : ""}</span>
        ${escapeHTML(label)}
      </button>
    `;
  }

  function renderUserList(display) {
    if (!display.length) {
      return `<div class="uc-list-empty">${escapeHTML(t("noMatches"))}</div>`;
    }
    return display.map(renderUserRow).join("");
  }

  function renderUserRow(user) {
    const hidden = state.hidden.has(user.id);
    const checked = state.selected.has(user.id);
    const tags = [];
    if (user.is_verified) tags.push(`<span class="uc-tag uc-tag--brand">${escapeHTML(t("filterVerified"))}</span>`);
    if (user.is_private) tags.push(`<span class="uc-tag">${escapeHTML(t("filterPrivate"))}</span>`);
    return `
      <div class="uc-row ${hidden ? "uc-row--hidden" : ""} ${checked ? "uc-row--selected" : ""}" data-row="${escapeAttr(user.id)}" role="button" tabindex="0">
        <input type="checkbox" class="uc-row-check" data-select="${escapeAttr(user.id)}" ${checked ? "checked" : ""} aria-label="${escapeAttr(user.username)}">
        <img class="uc-avatar" src="${escapeAttr(user.profile_pic_url || "")}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
        <div class="uc-row-text">
          <div class="uc-row-name">
            <a href="/${encodeURIComponent(user.username)}/" target="_blank" rel="noopener noreferrer" data-stop>@${escapeHTML(user.username)}</a>
            ${tags.join(" ")}
          </div>
          <div class="uc-row-sub">${escapeHTML(user.full_name || "")}</div>
        </div>
        <div class="uc-row-actions">
          <a class="uc-icon-btn" href="/${encodeURIComponent(user.username)}/" target="_blank" rel="noopener noreferrer" data-stop title="${escapeAttr(t("openProfile"))}" aria-label="${escapeAttr(t("openProfile"))}">${SVG.open}</a>
          <button type="button" class="uc-icon-btn uc-text-btn" data-hide="${escapeAttr(user.id)}" data-stop title="${escapeAttr(hidden ? t("unhideTooltip") : t("hideTooltip"))}">${escapeHTML(hidden ? t("unhide") : t("hide"))}</button>
        </div>
      </div>
    `;
  }

  function bindResults(body) {
    const search = body.querySelector("[data-search]");
    if (search) {
      search.addEventListener("input", (event) => {
        state.search = event.target.value;
        const list = body.querySelector("[data-list]");
        if (list) list.innerHTML = renderUserList(getDisplayUsers());
        // If a quick-select was active, searching changes the visible set, so the
        // grouping is stale: drop the mode and re-enable the buttons in place
        // (without a full re-render, to keep the search input focused).
        if (state.selectMode) {
          state.selectMode = null;
          refreshSelectButtons(body);
        }
      });
    }

    body.querySelectorAll("[data-filter]").forEach((el) => {
      el.addEventListener("click", () => {
        const key = el.getAttribute("data-filter");
        state.filters[key] = !state.filters[key];
        // Changing what's visible invalidates an active quick-select grouping.
        state.selectMode = null;
        persist();
        renderBody();
      });
    });

    bindRows(body);
    bindSelectButtons(body);

    body.querySelector("[data-action='copy']")?.addEventListener("click", copyUsernames);
    body.querySelector("[data-action='unfollow']")?.addEventListener("click", confirmUnfollow);
    body.querySelector("[data-action='scan']")?.addEventListener("click", () => startScan());
    bindScanResume(body);
  }

  // Row interactions are delegated to the body element, which survives every
  // renderBody() (only its innerHTML changes). Bind them once per body, or each
  // re-render stacks another listener and a single click toggles a row twice.
  function bindRows(body) {
    if (body.ucRowsBound) return;
    body.ucRowsBound = true;

    body.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-select]");
      if (!checkbox) return;
      const id = checkbox.getAttribute("data-select");
      if (checkbox.checked) state.selected.add(id);
      else state.selected.delete(id);
      // A manual tweak breaks the quick-select grouping → drop the mode and
      // re-render so the disabled buttons come back.
      if (state.selectMode) { state.selectMode = null; renderBody(); return; }
      const row = checkbox.closest("[data-row]");
      if (row) row.classList.toggle("uc-row--selected", checkbox.checked);
      updateSelectedLabel(body);
    });

    body.addEventListener("click", (event) => {
      const hideBtn = event.target.closest("[data-hide]");
      if (hideBtn) {
        event.preventDefault();
        event.stopPropagation();
        const id = hideBtn.getAttribute("data-hide");
        if (state.hidden.has(id)) state.hidden.delete(id);
        else { state.hidden.add(id); state.selected.delete(id); }
        state.selectMode = null;
        persist();
        renderBody();
        return;
      }
      if (event.target.closest("[data-stop]")) {
        event.stopPropagation();
        return;
      }
      const row = event.target.closest("[data-row]");
      if (!row || event.target.closest(".uc-row-check")) return;
      const id = row.getAttribute("data-row");
      const checkbox = row.querySelector("[data-select]");
      if (!checkbox) return;
      if (state.selected.has(id)) {
        state.selected.delete(id);
        checkbox.checked = false;
      } else {
        state.selected.add(id);
        checkbox.checked = true;
      }
      if (state.selectMode) { state.selectMode = null; renderBody(); return; }
      row.classList.toggle("uc-row--selected", checkbox.checked);
      updateSelectedLabel(body);
    });

    body.addEventListener("keydown", (event) => {
      if (event.key !== " " && event.key !== "Enter") return;
      const row = event.target.closest("[data-row]");
      if (!row || event.target.tagName === "INPUT" || event.target.tagName === "A" || event.target.tagName === "BUTTON") return;
      event.preventDefault();
      row.click();
    });
  }

  function updateSelectedLabel(body) {
    const root = body || document.querySelector(`#${APP_ID} [data-body]`);
    if (!root) return;
    const label = root.querySelector("[data-selected-label]");
    if (label) label.textContent = t("selectedCount", { count: state.selected.size });
    const unfollowBtn = root.querySelector("[data-action='unfollow']");
    if (unfollowBtn) {
      unfollowBtn.disabled = state.selected.size === 0;
      unfollowBtn.textContent = t("unfollow") + (state.selected.size ? " (" + state.selected.size + ")" : "");
    }
    const copyBtn = root.querySelector("[data-action='copy']");
    if (copyBtn) copyBtn.textContent = state.selected.size ? t("copy") : t("copyAll");
  }

  function renderUnfollowView() {
    const total = state.progress.total;
    const done = state.progress.current;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const isDone = state.mode === "unfollowDone";
    const removed = state.log.filter((e) => e.ok);
    const failed = state.log.filter((e) => !e.ok);
    const last = state.log[state.log.length - 1];
    const summary = isDone
      ? t("unfollowDoneBody", { ok: removed.length, fail: failed.length })
      : t("ofTotal", { current: done, total });

    // The done state lists exactly who was unfollowed (and who failed, with the
    // reason) in a scrollable area, so the user can review the outcome. The
    // in-progress state shows the live row.
    const resultList = isDone
      ? `
        <div class="uc-done-list">
          ${removed.length ? `
            <div class="uc-done-section">${escapeHTML(t("doneRemoved", { count: removed.length }))}</div>
            ${removed.map(doneRow).join("")}
          ` : ""}
          ${failed.length ? `
            <div class="uc-done-section">${escapeHTML(t("doneFailed", { count: failed.length }))}</div>
            ${failed.map(doneRow).join("")}
          ` : ""}
        </div>`
      : (last ? `
          <div class="uc-current">
            <span class="uc-muted">${escapeHTML(t("currently"))}</span>
            <strong>@${escapeHTML(last.user.username)}</strong>
            <span class="uc-tag ${last.ok ? "uc-tag--green" : "uc-tag--red"}" title="${escapeAttr(last.reason)}">${last.ok ? "✓" : "✕"}</span>
          </div>` : "");

    return `
      <div class="uc-progress ${isDone ? "uc-progress--done" : ""}">
        <div class="uc-progress-head">
          <h2>${escapeHTML(isDone ? t("unfollowDoneTitle") : (state.unfollowPaused ? t("paused") : t("unfollowing")))}</h2>
          <p data-progress-note>${escapeHTML(state.progress.note || "")}</p>
        </div>
        <div class="uc-bar"><span data-progress-bar style="width:${percent}%"></span></div>
        <div class="uc-progress-meta">
          <span>${escapeHTML(summary)}</span>
          <span data-countdown class="uc-muted"></span>
        </div>
        ${resultList}
        ${state.mode === "unfollowing" && state.pauseReason ? `<div class="uc-warn">${escapeHTML(t(state.pauseReason))}</div>` : ""}
        ${state.mode === "unfollowing" ? `<div class="uc-warn uc-warn--soft">${escapeHTML(t("keepTabOpen"))}</div>` : ""}
        <div class="uc-progress-actions">
          ${state.mode === "unfollowing" ? `
            <button type="button" class="uc-btn" data-action="pause-unfollow">${escapeHTML(t(state.unfollowPaused ? "resume" : "pause"))}</button>
            <button type="button" class="uc-btn uc-btn--ghost" data-action="cancel-unfollow">${escapeHTML(t("cancel"))}</button>
          ` : `
            ${failed.length ? `<button type="button" class="uc-btn uc-btn--danger" data-action="retry-failed">${escapeHTML(t("retryFailed", { count: failed.length }))}</button>` : ""}
            <button type="button" class="uc-btn uc-btn--primary" data-action="back-results">${escapeHTML(t("goBack"))}</button>
          `}
        </div>
      </div>
    `;
  }

  // A compact, non-interactive row for the unfollow-done summary list.
  function doneRow({ user, ok, reason }) {
    return `
      <div class="uc-done-row">
        <img class="uc-avatar uc-avatar--sm" src="${escapeAttr(user.profile_pic_url || "")}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
        <div class="uc-done-text">
          <a class="uc-done-name" href="/${encodeURIComponent(user.username)}/" target="_blank" rel="noopener noreferrer">@${escapeHTML(user.username)}</a>
          ${!ok && reason ? `<span class="uc-done-reason">${escapeHTML(reason)}</span>` : ""}
        </div>
        <span class="uc-tag ${ok ? "uc-tag--green" : "uc-tag--red"}">${ok ? "✓" : "✕"}</span>
      </div>`;
  }

  function bindUnfollow(body) {
    body.querySelector("[data-action='pause-unfollow']")?.addEventListener("click", () => {
      state.unfollowPaused = !state.unfollowPaused;
      renderBody();
    });
    body.querySelector("[data-action='cancel-unfollow']")?.addEventListener("click", () => {
      state.unfollowCancelled = true;
      state.unfollowPaused = false;
      activeRequest?.abort();
    });
    body.querySelector("[data-action='back-results']")?.addEventListener("click", () => {
      state.mode = "results";
      state.log = [];
      state.unfollowCancelled = false;
      renderBody();
    });
    body.querySelector("[data-action='retry-failed']")?.addEventListener("click", () => {
      const retryTargets = state.log.filter((e) => !e.ok).map((e) => e.user);
      if (retryTargets.length) startUnfollow(retryTargets);
    });
  }

  // --- Scan --------------------------------------------------------------------
  // Instagram no longer exposes a "follows you back" flag on the following list,
  // so the scan loads two lists and diffs them: first your followers, then the
  // people you follow (each checked against the followers as it arrives).
  async function startScan(options = {}) {
    if (destroyed || state.mode === "scanning" || state.mode === "unfollowing") return;
    state.error = "";
    state.mode = "scanning";
    state.scanPaused = false;
    state.scanCancelled = false;
    state.users = [];
    state.selected.clear();
    state.selectMode = null;
    state.log = [];
    state.partial = false;
    state.staleNotice = "";
    state.progress = { current: 0, total: 0, label: "loadingFollowers", note: visibilityNote() };

    let checkpoint = null;
    try {
      const sessErr = sessionError();
      if (sessErr) throw scanError("session", t(sessErr));
      const viewerId = getCookie("ds_user_id");
      const previous = options.resume ? state.checkpoint : null;
      checkpoint = previous && previous.viewerId === String(viewerId) ? previous : createCheckpoint(viewerId);
      checkpoint.stopReason = "";
      state.checkpoint = checkpoint;
      renderBody();

      const counts = await fetchViewerCounts(viewerId);

      if (!checkpoint.followersDone) {
        await loadList(checkpoint, viewerId, "followers", counts.followers);
        if (state.scanCancelled || destroyed) return stopScan(checkpoint);
        checkpoint.followersCursor = "";
        checkpoint.followersDone = true;
        saveCheckpoint(checkpoint);
      }

      if (!checkpoint.followingDone) {
        state.users = withFollowBack(checkpoint.following, checkpoint);
        await loadList(checkpoint, viewerId, "following", counts.following);
        if (state.scanCancelled || destroyed) return stopScan(checkpoint);
        checkpoint.followingCursor = "";
        checkpoint.followingDone = true;
      }

      showResults(checkpoint, true);
      clearCheckpoint();
    } catch (error) {
      if (destroyed) return;
      if (state.scanCancelled || error?.kind === "cancelled") return stopScan(checkpoint);
      console.error("[uc] scan failed:", error);
      const message = error?.message || t("scanFailed");
      if (checkpoint) {
        checkpoint.stopReason = message;
        saveCheckpoint(checkpoint);
      }
      // Followers are complete, so every non-follower found so far is certain:
      // show them now and offer to resume the rest later.
      if (checkpoint?.followersDone && checkpoint.following.length) return showResults(checkpoint, false);
      state.error = message;
      state.mode = "idle";
      renderBody();
    }
  }

  function stopScan(checkpoint) {
    if (destroyed) return;
    state.scanCancelled = false;
    if (checkpoint?.followersDone && checkpoint.following.length) {
      saveCheckpoint(checkpoint);
      return showResults(checkpoint, false);
    }
    if (checkpoint && !checkpoint.followerIds.length && !checkpoint.following.length) clearCheckpoint();
    else saveCheckpoint(checkpoint);
    resetToIdle();
  }

  function showResults(checkpoint, complete) {
    state.users = withFollowBack(checkpoint.following, checkpoint);
    state.partial = !complete;
    state.staleNotice = "";
    state.mode = "results";
    if (complete) {
      saveLastScan();
      toast(t("scanCompletedToast", { count: nonFollowers().length }));
    }
    renderBody();
  }

  function resetToIdle() {
    state.mode = "idle";
    state.users = [];
    state.scanCancelled = false;
    state.error = "";
    renderBody();
  }

  function setScanProgress(current, total, label) {
    state.progress = { current, total: total || 0, label, note: visibilityNote() };
    updateProgressDOM();
  }

  // Follower / following totals, only used to draw a real progress bar. Best
  // effort: if Instagram doesn't answer, the bar is simply indeterminate.
  async function fetchViewerCounts(viewerId) {
    try {
      const response = await fetch(`/api/v1/users/${encodeURIComponent(viewerId)}/info/`, {
        credentials: "include",
        headers: IG_HEADERS
      });
      const user = response.ok ? (await response.json())?.user : null;
      return {
        followers: Number(user?.follower_count) || 0,
        following: Number(user?.following_count) || 0
      };
    } catch {
      return { followers: 0, following: 0 };
    }
  }

  function followerEntries(checkpoint) {
    const names = checkpoint.followerNames || [];
    return checkpoint.followerIds.map((id, index) => ({ id: String(id), username: names[index] || "" }));
  }

  // Mark each followed account with whether it follows back. Matches by id, and
  // by username as a fallback (ids are occasionally returned in another form).
  function withFollowBack(following, checkpoint) {
    const keys = new Set();
    for (const follower of followerEntries(checkpoint)) {
      keys.add(follower.id);
      if (follower.username) keys.add("@" + follower.username.toLowerCase());
    }
    return following.map((user) => ({
      ...user,
      follows_viewer: keys.has(String(user.id)) || (Boolean(user.username) && keys.has("@" + user.username.toLowerCase()))
    }));
  }

  // Load one list ("followers" | "following") page by page into the checkpoint,
  // continuing from its saved cursor.
  async function loadList(checkpoint, viewerId, kind, total) {
    const isFollowing = kind === "following";
    const cursorKey = isFollowing ? "followingCursor" : "followersCursor";
    const label = isFollowing ? "loadingFollowing" : "loadingFollowers";
    const seed = isFollowing ? checkpoint.following : followerEntries(checkpoint);

    const onPage = (results, nextCursor) => {
      if (isFollowing) {
        checkpoint.following = results;
        state.users = withFollowBack(results, checkpoint);
      } else {
        checkpoint.followerIds = results.map((u) => u.id);
        checkpoint.followerNames = results.map((u) => u.username);
      }
      checkpoint[cursorKey] = nextCursor;
      saveCheckpoint(checkpoint);
      setScanProgress(results.length, total, label);
    };

    setScanProgress(seed.length, total, label);
    try {
      await fetchFriendshipList(viewerId, kind, onPage, { cursor: checkpoint[cursorKey], seed });
    } catch (error) {
      // A saved cursor can expire between sessions. Restart just this list once
      // instead of failing the whole scan.
      if (error?.kind !== "http" || error.status !== 400 || !checkpoint[cursorKey]) throw error;
      console.warn(`[uc] saved ${kind} cursor was rejected, reloading that list`);
      checkpoint[cursorKey] = "";
      if (isFollowing) checkpoint.following = [];
      else { checkpoint.followerIds = []; checkpoint.followerNames = []; }
      setScanProgress(0, total, label);
      await fetchFriendshipList(viewerId, kind, onPage, {});
    }
  }

  function friendshipListUrl(viewerId, kind, cursor) {
    const count = clamp(Math.round(state.timings.usersPerRequest) || DEFAULT_TIMINGS.usersPerRequest, 1, MAX_USERS_PER_REQUEST);
    const base = `/api/v1/friendships/${encodeURIComponent(viewerId)}/${kind}/?count=${count}`;
    return cursor ? `${base}&max_id=${encodeURIComponent(cursor)}` : base;
  }

  async function fetchFriendshipList(viewerId, kind, onPage, { cursor = "", seed = [] } = {}) {
    const byId = new Map(seed.map((user) => [String(user.id), user]));
    const seenCursors = new Set(cursor ? [cursor] : []);
    let page = 0;

    while (true) {
      await waitWhile(() => state.scanPaused && !state.scanCancelled);
      if (state.scanCancelled || destroyed) return;

      const json = await igFetch(friendshipListUrl(viewerId, kind, cursor));
      if (state.scanCancelled || destroyed) return;
      if (!Array.isArray(json?.users)) throw scanError("http", t("scanFailed"));
      // Instagram flags lists it is deliberately truncating; diffing those would
      // report people who do follow you as non-followers.
      if (json.should_limit_list_of_followers === true || json.should_limit_list_of_followings === true) {
        throw scanError("limited", t("limitedList"));
      }

      const users = json.users.map(normalizeUser).filter((u) => u.id && u.username);
      for (const user of users) byId.set(user.id, user);

      const nextCursor = json.next_max_id == null ? "" : String(json.next_max_id);
      const finished = json.has_more === false || !nextCursor;
      // Guard against a list that claims more pages but gives no way to reach
      // them, or loops back to a cursor we've already seen.
      if (finished && json.has_more === true) throw scanError("http", t("scanFailed"));
      if (!finished && (!users.length || seenCursors.has(nextCursor))) throw scanError("http", t("scanFailed"));

      onPage([...byId.values()], finished ? "" : nextCursor);
      if (finished) return;

      seenCursors.add(nextCursor);
      cursor = nextCursor;
      page += 1;
      await sleepWithCountdown(randomBetween(state.timings.scanDelayMin, state.timings.scanDelayMax), "nextActionIn");
      if (state.timings.scanPauseEveryPages > 0 && page % state.timings.scanPauseEveryPages === 0) {
        const jitter = randomBetween(-SCAN_PAUSE_JITTER_MS, SCAN_PAUSE_JITTER_MS);
        await sleepWithCountdown(Math.max(0, state.timings.scanPauseMs + jitter), "scanPause");
      }
    }
  }

  // Instagram's web client sends the CSRF token on list reads too.
  function csrfHeader() {
    const csrf = getCookie("csrftoken");
    return csrf ? { "x-csrftoken": csrf } : {};
  }

  function scanError(kind, message, status = 0) {
    const error = new Error(message);
    error.kind = kind;
    error.status = status;
    return error;
  }

  function parseJSON(text) {
    try {
      // Some Instagram/Facebook endpoints prefix JSON with an anti-hijacking guard.
      return JSON.parse(String(text || "").replace(/^for \(;;\);/, ""));
    } catch {
      return null;
    }
  }

  // Shared fetch for the scan. Classifies failures so the caller can react:
  // "session" (signed out), "rate" (429), "blocked" (action block/checkpoint),
  // "network", "http", "cancelled". Network errors and 5xx retry with backoff;
  // a 429 gets a couple of long cooldowns, and blocks stop immediately —
  // hammering either only extends Instagram's restriction. The checkpoint makes
  // stopping cheap.
  async function igFetch(url, init = {}) {
    let attempt = 0;
    let rateAttempt = 0;
    while (true) {
      if (destroyed || state.scanCancelled) throw scanError("cancelled", "cancelled");
      const controller = new AbortController();
      activeRequest = controller;
      let response;
      try {
        response = await fetch(url, {
          credentials: "include",
          ...init,
          headers: { ...IG_HEADERS, ...csrfHeader(), ...(init.headers || {}) },
          signal: controller.signal
        });
      } catch {
        if (destroyed || state.scanCancelled) throw scanError("cancelled", "cancelled");
        if (attempt >= MAX_RETRIES) throw scanError("network", t("networkError"));
        await sleepWithCountdown(Math.min(30000, 3000 * Math.pow(2, attempt)), "cooldownIn");
        attempt += 1;
        continue;
      } finally {
        if (activeRequest === controller) activeRequest = null;
      }

      const json = parseJSON(await response.text().catch(() => ""));
      const message = json ? String(json.message || json.error_type || "") : "";
      if (response.status === 401 || json?.require_login || /login_required/i.test(message)) {
        throw scanError("session", t("sessionExpired"), response.status);
      }
      if (response.status === 429 || /rate.?limit|too many requests|please wait a few minutes/i.test(message)) {
        if (rateAttempt >= RATE_LIMIT_RETRIES) throw scanError("rate", t("tooManyRequests"), response.status);
        rateAttempt += 1;
        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        await sleepWithCountdown(Math.max(retryAfter, RATE_LIMIT_COOLDOWN_MS * rateAttempt), "cooldownIn");
        continue;
      }
      if (response.status === 403 || json?.spam || json?.challenge || json?.checkpoint_url || json?.feedback_required ||
          /feedback_required|checkpoint_required|challenge_required/i.test(message)) {
        throw scanError("blocked", t("scanBlocked"), response.status);
      }
      if (response.status >= 500) {
        if (attempt >= MAX_RETRIES) throw scanError("http", t("requestFailed", { status: response.status }), response.status);
        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        await sleepWithCountdown(retryAfter || Math.min(60000, 5000 * Math.pow(2, attempt)), "cooldownIn");
        attempt += 1;
        continue;
      }
      if (response.ok) {
        // A 200 with HTML instead of JSON is Instagram's login page.
        if (!json || typeof json !== "object") throw scanError("session", t("sessionExpired"), response.status);
        if (json.status && json.status !== "ok") throw scanError("http", t("scanFailed"), response.status);
        return json;
      }
      throw scanError("http", t("requestFailed", { status: response.status }), response.status);
    }
  }

  function parseRetryAfter(value) {
    if (!value) return 0;
    const seconds = Number(value);
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
    const date = Date.parse(value);
    if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
    return 0;
  }

  // --- Unfollow ----------------------------------------------------------------
  function confirmUnfollow() {
    if (!state.selected.size) return;
    const count = state.selected.size;
    showDialog({
      title: t("unfollowConfirmTitle", { count }),
      body: t("unfollowConfirmBody"),
      confirmLabel: t("unfollowConfirmBtn", { count }),
      destructive: true,
      onConfirm: () => startUnfollow(state.users.filter((u) => state.selected.has(u.id)))
    });
  }

  async function startUnfollow(targets) {
    if (destroyed || state.mode === "scanning" || state.mode === "unfollowing") return;
    targets = (targets || []).filter(Boolean);
    if (!targets.length) return;
    const sessErr = sessionError();
    if (sessErr) {
      toast(t(sessErr));
      return;
    }

    state.mode = "unfollowing";
    state.unfollowPaused = false;
    state.unfollowCancelled = false;
    state.pauseReason = "";
    state.log = [];
    state.progress = { current: 0, total: targets.length, label: "unfollowing", note: "" };
    renderBody();

    let processed = 0;
    let signedOut = false;
    for (let i = 0; i < targets.length; i += 1) {
      await waitWhile(() => state.unfollowPaused && !state.unfollowCancelled);
      if (state.unfollowCancelled || destroyed) break;

      const user = targets[i];
      let outcome;
      try {
        outcome = await unfollowUser(user);
      } catch (error) {
        console.error("[uc] unfollow failed for", user.username, error);
        outcome = { ok: false, kind: "network", reason: t("reasonNetwork") };
      }
      if (destroyed) return;
      if (state.unfollowCancelled) break;

      // Instagram pushed back: auto-pause instead of hammering on, surface a
      // clear warning, and retry the SAME user once the user resumes.
      if (outcome.kind === "rate" || outcome.kind === "blocked") {
        console.warn("[uc] Instagram refused the unfollow:", outcome.reason);
        state.pauseReason = outcome.kind === "rate" ? "rateLimitPaused" : "blockedPaused";
        state.unfollowPaused = true;
        renderBody();
        await waitWhile(() => state.unfollowPaused && !state.unfollowCancelled);
        if (state.unfollowCancelled || destroyed) break;
        state.pauseReason = "";
        i -= 1;
        continue;
      }
      // Signed out: nothing else can succeed until the user signs in again.
      if (outcome.kind === "session") {
        signedOut = true;
        break;
      }

      state.log.push({ user, ok: outcome.ok, reason: outcome.reason || "" });
      if (outcome.ok) {
        state.selected.delete(user.id);
        const userRef = state.users.find((u) => u.id === user.id);
        if (userRef) userRef.unfollowed = true;
      }
      processed += 1;
      state.progress = { current: processed, total: targets.length, label: "unfollowing", note: "" };
      renderBody();

      const isLast = i === targets.length - 1;
      if (!isLast) {
        await sleepWithCountdown(randomBetween(state.timings.unfollowDelayMin, state.timings.unfollowDelayMax), "nextActionIn");
        if (state.timings.unfollowPauseEvery > 0 && (i + 1) % state.timings.unfollowPauseEvery === 0) {
          await sleepWithCountdown(state.timings.unfollowPauseMs, "cooldownIn");
        }
      }
    }
    if (destroyed) return;

    state.users = state.users.filter((u) => !u.unfollowed);
    syncSavedScan();
    state.mode = "unfollowDone";
    state.unfollowPaused = false;
    state.pauseReason = "";
    state.waitUntil = 0;
    state.waitReason = "";
    if (signedOut) state.progress.note = t("cookieMissing");
    renderBody();
  }

  // Drop unfollowed accounts from the saved scan (checkpoint or last result), so
  // resuming or reopening it doesn't show them again.
  function syncSavedScan() {
    if (state.checkpoint) {
      const unfollowed = new Set(state.log.filter((e) => e.ok).map((e) => e.user.id));
      state.checkpoint.following = state.checkpoint.following.filter((u) => !unfollowed.has(u.id));
      saveCheckpoint(state.checkpoint);
      return;
    }
    const last = loadLastScan();
    if (last) saveLastScan(last.savedAt);
  }

  // The fb_dtsg / lsd tokens Instagram's web app sends with every GraphQL
  // mutation. Read from the page's module registry, then from its HTML, and as
  // a last resort from a fresh copy of the home page.
  async function getSessionTokens() {
    if (sessionTokens) return sessionTokens;
    try {
      const req = window.require;
      if (typeof req === "function") {
        const dtsg = req("DTSGInitialData")?.token;
        const lsd = req("LSD")?.token;
        if (dtsg && lsd) {
          sessionTokens = { dtsg, lsd, revision: String(req("SiteData")?.client_revision || "") };
          return sessionTokens;
        }
      }
    } catch {
      /* module registry unavailable; fall back to the HTML */
    }
    sessionTokens = tokensFromHtml(document.documentElement?.innerHTML || "");
    if (!sessionTokens) {
      try {
        const response = await fetch("/", { credentials: "include" });
        sessionTokens = tokensFromHtml(await response.text());
      } catch (error) {
        console.warn("[uc] could not read Instagram session tokens:", error);
      }
    }
    return sessionTokens;
  }

  function tokensFromHtml(html) {
    const dtsg = /"DTSGInitialData",\[\],\{"token":"([^"]+)"/.exec(html)?.[1] || /"dtsg":\{"token":"([^"]+)"/.exec(html)?.[1];
    const lsd = /"LSD",\[\],\{"token":"([^"]+)"/.exec(html)?.[1];
    if (!dtsg || !lsd) return null;
    return { dtsg, lsd, revision: /"client_revision":(\d+)/.exec(html)?.[1] || "" };
  }

  // Checksum Instagram expects next to fb_dtsg.
  function jazoest(token) {
    let sum = 0;
    for (let i = 0; i < token.length; i += 1) sum += token.charCodeAt(i);
    return `2${sum}`;
  }

  // Unfollow one account and make sure it actually happened. Returns
  // { ok, kind, reason } where kind is "rate" | "blocked" | "session" when
  // Instagram refused the action as a whole, or "" otherwise.
  async function unfollowUser(user) {
    const csrf = getCookie("csrftoken");
    if (!csrf) return { ok: false, kind: "session", reason: t("csrfMissing") };
    const tokens = await getSessionTokens();
    const outcome = tokens ? await unfollowViaGraphQL(user, csrf, tokens) : await unfollowViaRest(user, csrf);
    if (!outcome.ok || outcome.confirmed) return outcome;

    // Instagram accepted the request without echoing the new friendship state:
    // double-check against the following list before reporting success.
    const still = await isStillFollowing(user);
    if (still === false) return { ok: true, kind: "", reason: "" };
    const reason = t(still ? "reasonStillFollowing" : "reasonUnconfirmed");
    console.warn("[uc]", user.username, reason);
    return { ok: false, kind: "", reason };
  }

  async function unfollowViaGraphQL(user, csrf, tokens) {
    const params = {
      av: getCookie("ds_user_id") || "",
      __d: "www",
      __user: "0",
      __a: "1",
      __comet_req: "7",
      fb_dtsg: tokens.dtsg,
      jazoest: jazoest(tokens.dtsg),
      lsd: tokens.lsd,
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: UNFOLLOW_FRIENDLY_NAME,
      variables: JSON.stringify({
        target_user_id: String(user.id),
        container_module: "profile",
        nav_chain: "PolarisProfilePostsTabRoot:profilePage:1:via_cold_start"
      }),
      server_timestamps: "true",
      doc_id: UNFOLLOW_DOC_ID
    };
    if (tokens.revision) {
      params.__rev = tokens.revision;
      params.__spin_r = tokens.revision;
    }
    return postUnfollow("/api/graphql", new URLSearchParams(params).toString(), {
      "x-csrftoken": csrf,
      "x-fb-friendly-name": UNFOLLOW_FRIENDLY_NAME,
      "x-fb-lsd": tokens.lsd
    });
  }

  async function unfollowViaRest(user, csrf) {
    return postUnfollow(`/api/v1/friendships/destroy/${encodeURIComponent(user.id)}/`, "", {
      "x-csrftoken": csrf,
      "x-requested-with": "XMLHttpRequest"
    });
  }

  async function postUnfollow(url, body, headers) {
    const controller = new AbortController();
    activeRequest = controller;
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "x-ig-app-id": IG_APP_ID,
          "x-asbd-id": IG_ASBD_ID,
          ...headers
        },
        body,
        signal: controller.signal
      });
    } catch {
      return { ok: false, kind: "network", reason: t("reasonNetwork") };
    } finally {
      if (activeRequest === controller) activeRequest = null;
    }
    return evaluateUnfollowResponse(response.status, await response.text().catch(() => ""));
  }

  // Never trust a 200 alone: Instagram answers 200 for rejected mutations too,
  // with the real outcome (errors, action blocks, friendship state) in the body.
  function evaluateUnfollowResponse(status, text) {
    const payload = parseJSON(text);
    const message = [
      payload?.message,
      payload?.errorSummary,
      payload?.errors ? JSON.stringify(payload.errors) : "",
      payload?.error ? JSON.stringify(payload.error) : ""
    ].filter(Boolean).join(" ");

    if (status === 401 || payload?.require_login === true || /login_required/i.test(message)) {
      return { ok: false, kind: "session", reason: message || `HTTP ${status}` };
    }
    if (status === 429 || /rate.?limit|too many requests|please wait a few minutes/i.test(message)) {
      return { ok: false, kind: "rate", reason: message || `HTTP ${status}` };
    }
    if (status === 403 || payload?.feedback_required === true || payload?.spam === true ||
        /feedback_required|checkpoint_required|challenge_required|action_blocked|try again later/i.test(message)) {
      return { ok: false, kind: "blocked", reason: message || `HTTP ${status}` };
    }
    if (status < 200 || status >= 300 || !payload) {
      return { ok: false, kind: "", reason: t("reasonRejected") + (status >= 300 ? ` (HTTP ${status})` : "") };
    }
    if (payload.errors || payload.error || payload.status === "fail") {
      return { ok: false, kind: "", reason: message || t("reasonRejected") };
    }
    const friendship = findFriendshipStatus(payload);
    if (friendship && (friendship.following === true || friendship.outgoing_request === true)) {
      return { ok: false, kind: "", reason: t("reasonStillFollowing") };
    }
    return { ok: true, kind: "", reason: "", confirmed: friendship?.following === false };
  }

  function findFriendshipStatus(node) {
    if (!node || typeof node !== "object") return undefined;
    if (node.friendship_status && typeof node.friendship_status === "object") return node.friendship_status;
    for (const value of Object.values(node)) {
      const found = findFriendshipStatus(value);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  // true / false when Instagram's following search answers, null when unknown.
  async function isStillFollowing(user) {
    const viewerId = getCookie("ds_user_id");
    if (!viewerId) return null;
    const url = `/api/v1/friendships/${encodeURIComponent(viewerId)}/following/?count=12&query=${encodeURIComponent(user.username)}&search_surface=follow_list_page`;
    try {
      const response = await fetch(url, { credentials: "include", headers: { ...IG_HEADERS, ...csrfHeader() } });
      if (!response.ok) return null;
      const json = parseJSON(await response.text());
      if (!Array.isArray(json?.users)) return null;
      const target = user.username.toLowerCase();
      return json.users.some((raw) => {
        const found = normalizeUser(raw);
        return found.id === String(user.id) || found.username.toLowerCase() === target;
      });
    } catch {
      return null;
    }
  }

  async function copyUsernames() {
    const display = getDisplayUsers();
    const target = state.selected.size
      ? display.filter((u) => state.selected.has(u.id))
      : display;
    if (!target.length) return;
    const text = target.map((u) => u.username).sort().join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast(t("copiedToast", { count: target.length }));
    } catch (error) {
      console.error("[uc] copy failed:", error);
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast(t("copiedToast", { count: target.length })); }
      catch { /* give up */ }
      ta.remove();
    }
  }

  function showSettings() {
    const fields = [
      ["scanDelayMin", "minScanDelay", 100],
      ["scanDelayMax", "maxScanDelay", 100],
      ["scanPauseEveryPages", "scanPauseEvery", 1],
      ["scanPauseMs", "scanPauseLength", 1000],
      ["usersPerRequest", "usersPerRequest", 1, 1, MAX_USERS_PER_REQUEST],
      ["unfollowDelayMin", "minUnfollowDelay", 1000],
      ["unfollowDelayMax", "maxUnfollowDelay", 1000],
      ["unfollowPauseEvery", "unfollowPauseEvery", 1],
      ["unfollowPauseMs", "unfollowPauseLength", 1000]
    ];
    const formHTML = fields.map(([key, label, step, min = 0, max]) => `
      <label class="uc-field">
        <span>${escapeHTML(t(label))}</span>
        <input type="number" min="${min}"${max ? ` max="${max}"` : ""} step="${step}" data-setting="${escapeAttr(key)}" value="${Number(state.timings[key])}">
      </label>
    `).join("");

    showDialog({
      title: t("settingsTitle"),
      body: t("settingsBody"),
      contentHTML: `<div class="uc-form">${formHTML}</div>`,
      confirmLabel: t("save"),
      extraButton: { label: t("restoreDefaults"), action: "restore" },
      onConfirm: (dialog) => {
        dialog.querySelectorAll("[data-setting]").forEach((input) => {
          const key = input.getAttribute("data-setting");
          const val = Number(input.value);
          const min = Number(input.min || 0);
          const max = input.max ? Number(input.max) : Infinity;
          // Out-of-range or empty values keep the current setting.
          if (input.value !== "" && Number.isFinite(val) && val >= min && val <= max) state.timings[key] = val;
        });
        persist();
        toast(t("saved"));
      },
      onExtra: (dialog) => {
        Object.assign(state.timings, DEFAULT_TIMINGS);
        dialog.querySelectorAll("[data-setting]").forEach((input) => {
          const key = input.getAttribute("data-setting");
          input.value = state.timings[key];
        });
      }
    });
  }

  function showDialog({ title, body, contentHTML, confirmLabel, destructive, extraButton, onConfirm, onExtra }) {
    document.querySelector(`#${APP_ID} .uc-overlay`)?.remove();
    const titleId = `${APP_ID}-dialog-title`;
    const previouslyFocused = document.activeElement;
    const overlay = document.createElement("div");
    overlay.className = "uc-overlay";
    overlay.innerHTML = `
      <div class="uc-dialog" role="dialog" aria-modal="true" aria-labelledby="${titleId}" tabindex="-1">
        <h3 id="${titleId}">${escapeHTML(title)}</h3>
        ${body ? `<p>${escapeHTML(body)}</p>` : ""}
        ${contentHTML || ""}
        <div class="uc-dialog-actions">
          ${extraButton ? `<button type="button" class="uc-btn uc-btn--ghost uc-btn--small" data-extra>${escapeHTML(extraButton.label)}</button>` : ""}
          <button type="button" class="uc-btn uc-btn--small" data-cancel>${escapeHTML(t("cancel"))}</button>
          <button type="button" class="uc-btn uc-btn--small ${destructive ? "uc-btn--danger" : "uc-btn--primary"}" data-confirm>${escapeHTML(confirmLabel)}</button>
        </div>
      </div>
    `;
    document.getElementById(APP_ID)?.appendChild(overlay);
    const dialog = overlay.querySelector(".uc-dialog");
    const close = () => {
      document.removeEventListener("keydown", onKeyDown, true);
      overlay.remove();
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus();
    };
    // Escape closes; Tab stays inside the dialog (Instagram's page would
    // otherwise receive focus behind the overlay).
    function onKeyDown(event) {
      if (!document.contains(overlay)) return document.removeEventListener("keydown", onKeyDown, true);
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = [...dialog.querySelectorAll("button, input")].filter((el) => !el.disabled);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    overlay.querySelector("[data-cancel]").addEventListener("click", close);
    overlay.querySelector("[data-confirm]").addEventListener("click", () => {
      try { onConfirm?.(dialog); } finally { close(); }
    });
    if (extraButton && onExtra) {
      overlay.querySelector("[data-extra]").addEventListener("click", () => onExtra(dialog));
    }
    // A destructive confirm starts on Cancel so a stray Enter can't trigger it.
    (dialog.querySelector("input") || (destructive ? overlay.querySelector("[data-cancel]") : dialog)).focus();
  }

  function cycleLanguage() {
    const i = LANGS.indexOf(state.language);
    state.language = LANGS[(i + 1) % LANGS.length];
    persist();
    renderShell();
  }

  // --- Theme (light / dark / system) -----------------------------------------
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function resolvedTheme() {
    if (state.theme === "light" || state.theme === "dark") return state.theme;
    return prefersDark.matches ? "dark" : "light";
  }

  function applyTheme() {
    document.getElementById(APP_ID)?.classList.toggle("uc-theme-light", resolvedTheme() === "light");
  }

  function cycleTheme() {
    // system -> light -> dark -> system
    state.theme = state.theme === "system" ? "light" : state.theme === "light" ? "dark" : "system";
    persist();
    renderShell();
  }

  function themeIcon() {
    if (state.theme === "light") return SVG.sun;
    if (state.theme === "dark") return SVG.moon;
    return SVG.auto;
  }

  function themeTitleKey() {
    return state.theme === "light" ? "themeLight" : state.theme === "dark" ? "themeDark" : "themeSystem";
  }

  function onSystemThemeChange() {
    if (state.theme === "system") applyTheme();
  }

  function getDisplayUsers() {
    const query = state.search.trim().toLowerCase();
    return getDisplayNoSearch()
      .filter((u) => !query || (u.username + " " + (u.full_name || "")).toLowerCase().includes(query));
  }

  // The non-followers visible after the hidden/showHidden + category filters,
  // but WITHOUT the search query. Used to decide which quick-select buttons to
  // show, so typing a non-matching search never makes the buttons disappear.
  function getDisplayNoSearch() {
    return getPool()
      .filter((u) => state.filters.verified || !u.is_verified)
      .filter((u) => state.filters.private || !u.is_private)
      .filter((u) => state.filters.noAvatar || !isDefaultAvatar(u))
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  // The base population: people you follow who don't follow back, respecting only
  // the hidden/showHidden toggle. Used to decide which filter chips are relevant
  // (a chip is shown only if that category exists at all), independent of the
  // category filters or search.
  // Everyone you follow who doesn't follow back and isn't hidden.
  function nonFollowers() {
    return state.users.filter((u) => !u.follows_viewer && !state.hidden.has(u.id));
  }

  function getPool() {
    return state.users
      .filter((u) => !u.follows_viewer)
      .filter((u) => state.filters.showHidden ? state.hidden.has(u.id) : !state.hidden.has(u.id));
  }

  function normalizeUser(raw) {
    return {
      // The friendship APIs carry the numeric id as pk_id / pk; `id` is only a
      // fallback. Using the same order for both lists keeps the diff consistent.
      id: String(raw.pk_id ?? raw.pk ?? raw.id ?? "").trim(),
      username: String(raw.username || ""),
      full_name: String(raw.full_name || ""),
      profile_pic_url: String(raw.profile_pic_url || raw.profile_pic_url_hd || ""),
      is_verified: Boolean(raw.is_verified),
      is_private: Boolean(raw.is_private),
      follows_viewer: Boolean(raw.follows_viewer ?? raw.friendship_status?.followed_by ?? raw.followed_by)
    };
  }

  function dedupe(list) {
    const seen = new Set();
    return list.filter((u) => {
      if (!u.id || seen.has(u.id)) return false;
      seen.add(u.id);
      return true;
    });
  }

  function isDefaultAvatar(user) {
    const url = user.profile_pic_url || "";
    return !url || /44884218_345707102882519|464760996_1254146839119862/.test(url);
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  // Verify the user is logged in before any network work. Distinguishes a
  // missing/expired session from a rate-limit so we can guide the user correctly.
  // NOTE: Instagram's `sessionid` cookie is HttpOnly, so it's never visible to
  // document.cookie — we must NOT check it here or logged-in users always fail.
  // `ds_user_id` (the viewer id) and `csrftoken` are readable and sufficient.
  // Returns an i18n error key if something's wrong, else null.
  function sessionError() {
    if (!getCookie("ds_user_id")) return "cookieMissing";
    if (!getCookie("csrftoken")) return "csrfMissing";
    return null;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
  }

  function randomBetween(min, max) {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  }

  async function waitWhile(predicate, interval = 200) {
    while (predicate()) await sleep(interval);
  }

  async function sleepWithCountdown(ms, reasonKey) {
    state.waitUntil = Date.now() + ms;
    state.waitReason = reasonKey;
    updateCountdownDOM();
    const start = Date.now();
    while (Date.now() - start < ms) {
      if (state.scanCancelled || state.unfollowCancelled) break;
      await sleep(Math.min(250, ms - (Date.now() - start)));
      if (state.scanPaused || state.unfollowPaused) {
        const pauseStart = Date.now();
        await waitWhile(() => state.scanPaused || state.unfollowPaused);
        state.waitUntil += Date.now() - pauseStart;
        updateCountdownDOM();
      }
    }
    state.waitUntil = 0;
    state.waitReason = "";
    updateCountdownDOM();
  }

  function startCountdown() {
    if (countdownTimer) return;
    countdownTimer = setInterval(updateCountdownDOM, 500);
  }

  function stopCountdown() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  function updateCountdownDOM() {
    const node = document.querySelector(`#${APP_ID} [data-countdown]`);
    if (!node) return;
    if (!state.waitUntil) {
      node.textContent = "";
      return;
    }
    const remaining = Math.max(0, Math.ceil((state.waitUntil - Date.now()) / 1000));
    const reason = state.waitReason || "nextActionIn";
    node.textContent = t(reason, { seconds: remaining });
  }

  function updateProgressDOM() {
    const root = document.querySelector(`#${APP_ID} [data-body]`);
    if (!root) return;
    const { current, total, label, note } = state.progress;
    const percent = total ? Math.min(100, Math.round((current / total) * 100)) : 0;
    const bar = root.querySelector("[data-progress-bar]");
    if (bar) bar.style.width = percent + "%";
    root.querySelector("[data-bar]")?.classList.toggle("uc-bar--indeterminate", !total);
    const counter = root.querySelector("[data-progress-counter]");
    if (counter) counter.textContent = progressCounter();
    const live = root.querySelector("[data-live-found]");
    if (live) {
      const text = liveFoundLabel();
      live.textContent = text;
      live.hidden = !text;
    }
    const labelEl = root.querySelector("[data-progress-label]");
    if (labelEl) labelEl.textContent = state.scanPaused ? t("paused") : t(label);
    const noteEl = root.querySelector("[data-progress-note]");
    if (noteEl) noteEl.textContent = note || "";
    if (state.minimized) {
      const pillLabelEl = document.querySelector(`#${APP_ID} [data-pill-label]`);
      if (pillLabelEl) pillLabelEl.textContent = pillLabel();
    }
  }

  function toast(message) {
    const root = document.getElementById(APP_ID);
    if (!root) return;
    root.querySelector(".uc-toast")?.remove();
    if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
    const node = document.createElement("div");
    node.className = "uc-toast";
    node.textContent = message;
    root.appendChild(node);
    toastTimer = setTimeout(() => { node.remove(); toastTimer = null; }, 3500);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));
  }

  function escapeAttr(value) {
    return escapeHTML(value);
  }

  const CSS = `
    #${APP_ID}, #${APP_ID} * { box-sizing: border-box; }
    /* Dark palette (default) — mirrors the website's brand greens (oklch hue 150)
       and surface tokens so the panel matches the site's design language. */
    #${APP_ID} {
      --uc-bg: oklch(0.18 0.005 250);
      --uc-bg-2: oklch(0.22 0.006 250);
      --uc-bg-3: oklch(0.26 0.007 250);
      --uc-line: oklch(0.30 0.008 250);
      --uc-line-strong: oklch(0.38 0.009 250);
      --uc-text: oklch(0.97 0 0);
      --uc-muted: oklch(0.72 0.01 250);
      --uc-accent: oklch(0.70 0.17 150);
      --uc-accent-2: oklch(0.78 0.16 150);
      --uc-accent-ink: oklch(0.18 0.005 250);
      --uc-danger: #ef4444;
      --uc-success: oklch(0.70 0.17 150);
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2147483647;
      color: var(--uc-text);
      font: 14px/1.45 'Inter Variable', Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    }
    /* Light palette — mirrors the site's light surface + brand tokens. */
    #${APP_ID}.uc-theme-light {
      --uc-bg: oklch(0.98 0.003 250);
      --uc-bg-2: oklch(0.96 0.004 250);
      --uc-bg-3: oklch(0.92 0.006 250);
      --uc-line: oklch(0.87 0.008 250);
      --uc-line-strong: oklch(0.80 0.010 250);
      --uc-text: oklch(0.22 0.01 250);
      --uc-muted: oklch(0.50 0.01 250);
      --uc-accent: oklch(0.60 0.17 150);
      --uc-accent-2: oklch(0.68 0.16 150);
      --uc-accent-ink: #ffffff;
      --uc-danger: #dc2626;
      --uc-success: oklch(0.60 0.17 150);
    }
    #${APP_ID} > * { pointer-events: auto; }
    #${APP_ID} button, #${APP_ID} input, #${APP_ID} a { font: inherit; color: inherit; }
    #${APP_ID} a { text-decoration: none; }
    #${APP_ID} button { cursor: pointer; }

    #${APP_ID} .uc-panel {
      position: absolute;
      width: ${PANEL_WIDTH}px;
      max-width: calc(100vw - 24px);
      max-height: calc(100vh - 24px);
      display: flex;
      flex-direction: column;
      background: var(--uc-bg);
      border: 1px solid var(--uc-line);
      border-radius: 12px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3);
      overflow: hidden;
      animation: uc-pop 0.18s ease-out;
    }
    #${APP_ID} .uc-panel.uc-resizing { user-select: none; }
    /* Resize handles: thin strips on the 4 edges, small squares on the 4 corners. */
    #${APP_ID} .uc-resize { position: absolute; z-index: 5; touch-action: none; }
    #${APP_ID} .uc-resize--n { top: -3px; left: 8px; right: 8px; height: 8px; cursor: ns-resize; }
    #${APP_ID} .uc-resize--s { bottom: -3px; left: 8px; right: 8px; height: 8px; cursor: ns-resize; }
    #${APP_ID} .uc-resize--e { right: -3px; top: 8px; bottom: 8px; width: 8px; cursor: ew-resize; }
    #${APP_ID} .uc-resize--w { left: -3px; top: 8px; bottom: 8px; width: 8px; cursor: ew-resize; }
    #${APP_ID} .uc-resize--ne { top: -4px; right: -4px; width: 14px; height: 14px; cursor: nesw-resize; }
    #${APP_ID} .uc-resize--nw { top: -4px; left: -4px; width: 14px; height: 14px; cursor: nwse-resize; }
    #${APP_ID} .uc-resize--se { bottom: -4px; right: -4px; width: 14px; height: 14px; cursor: nwse-resize; }
    #${APP_ID} .uc-resize--sw { bottom: -4px; left: -4px; width: 14px; height: 14px; cursor: nesw-resize; }
    @keyframes uc-pop {
      from { opacity: 0; transform: translateY(8px) scale(0.985); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    #${APP_ID} .uc-header {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 12px 12px 14px;
      border-bottom: 1px solid var(--uc-line);
      cursor: grab;
      user-select: none;
      background: linear-gradient(180deg, color-mix(in srgb, var(--uc-text) 3%, transparent), transparent);
    }
    #${APP_ID} .uc-header.uc-dragging { cursor: grabbing; }
    #${APP_ID} .uc-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
    #${APP_ID} .uc-brand-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--uc-accent);
      flex-shrink: 0;
    }
    #${APP_ID} .uc-brand-text { min-width: 0; }
    #${APP_ID} .uc-brand-text strong { display: block; font-size: 14px; font-weight: 600; }
    #${APP_ID} .uc-brand-text span { display: block; font-size: 11px; color: var(--uc-muted); }
    #${APP_ID} .uc-header-actions { display: flex; gap: 4px; flex-shrink: 0; }
    #${APP_ID} .uc-header-actions button {
      width: 28px;
      height: 28px;
      display: grid;
      place-items: center;
      border: none;
      background: transparent;
      border-radius: 6px;
      color: var(--uc-muted);
      transition: background 0.15s, color 0.15s;
      font-size: 11px;
      font-weight: 600;
    }
    #${APP_ID} .uc-header-actions button:hover { background: var(--uc-bg-2); color: var(--uc-text); }
    #${APP_ID} .uc-header-actions svg { display: block; }

    #${APP_ID} .uc-body {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    #${APP_ID} .uc-welcome {
      padding: 28px 22px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    #${APP_ID} .uc-welcome-icon {
      width: 64px;
      height: 64px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: color-mix(in srgb, var(--uc-accent) 15%, transparent);
      color: var(--uc-accent);
      margin-bottom: 4px;
    }
    #${APP_ID} .uc-welcome-icon--error { background: color-mix(in srgb, var(--uc-danger) 15%, transparent); color: var(--uc-danger); }
    #${APP_ID} .uc-welcome h2 { margin: 0; font-size: 17px; font-weight: 600; }
    #${APP_ID} .uc-welcome p { margin: 0; color: var(--uc-muted); font-size: 13px; max-width: 300px; }
    #${APP_ID} .uc-welcome .uc-welcome-note { font-size: 12px; }
    #${APP_ID} .uc-welcome-actions { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    #${APP_ID} [hidden] { display: none !important; }

    #${APP_ID} .uc-btn {
      border: 1px solid var(--uc-line);
      background: var(--uc-bg-2);
      color: var(--uc-text);
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s, border-color 0.15s, transform 0.05s;
    }
    #${APP_ID} .uc-btn:hover:not(:disabled) { background: var(--uc-bg-3); border-color: var(--uc-line-strong); }
    #${APP_ID} .uc-btn:active:not(:disabled) { transform: scale(0.98); }
    #${APP_ID} .uc-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    #${APP_ID} .uc-btn--primary { background: var(--uc-accent); border-color: var(--uc-accent); color: var(--uc-accent-ink); }
    #${APP_ID} .uc-btn--primary:hover:not(:disabled) { background: var(--uc-accent-2); border-color: var(--uc-accent-2); }
    #${APP_ID} .uc-btn--danger { background: var(--uc-danger); border-color: var(--uc-danger); color: #fff; }
    #${APP_ID} .uc-btn--danger:hover:not(:disabled) { background: color-mix(in srgb, var(--uc-danger) 85%, white); border-color: color-mix(in srgb, var(--uc-danger) 85%, white); }
    #${APP_ID} .uc-btn--ghost { background: transparent; }
    #${APP_ID} .uc-btn--lg { padding: 10px 20px; font-size: 14px; margin-top: 8px; }
    #${APP_ID} .uc-btn--small { padding: 6px 10px; font-size: 12px; }

    #${APP_ID} .uc-progress { padding: 22px 20px; display: flex; flex-direction: column; gap: 14px; }
    #${APP_ID} .uc-progress-head h2 { margin: 0; font-size: 15px; font-weight: 600; }
    #${APP_ID} .uc-progress-head p { margin: 4px 0 0; color: var(--uc-muted); font-size: 12px; min-height: 1em; }
    #${APP_ID} .uc-bar {
      height: 6px;
      border-radius: 3px;
      background: color-mix(in srgb, var(--uc-text) 8%, transparent);
      overflow: hidden;
    }
    #${APP_ID} .uc-bar > span {
      display: block;
      height: 100%;
      background: var(--uc-accent);
      transition: width 0.3s ease;
    }
    #${APP_ID} .uc-progress-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }
    #${APP_ID} .uc-progress-actions { display: flex; gap: 8px; }
    #${APP_ID} .uc-current {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      background: var(--uc-bg-2);
      border-radius: 8px;
      font-size: 12px;
    }
    #${APP_ID} .uc-current strong { font-weight: 600; }
    /* Done state hugs its content (no fixed panel height), so the panel shrinks to
       fit the summary. A long list scrolls within its own max-height instead of
       growing the panel past the screen. */
    #${APP_ID} .uc-progress--done { flex: 0 1 auto; min-height: 0; }
    #${APP_ID} .uc-done-list {
      flex: 0 1 auto;
      max-height: 50vh;
      overflow-y: auto;
      overscroll-behavior: contain;
      margin: 0 -20px;
      border-top: 1px solid var(--uc-line);
      border-bottom: 1px solid var(--uc-line);
    }
    #${APP_ID} .uc-done-section {
      position: sticky;
      top: 0;
      padding: 8px 20px 4px;
      background: var(--uc-bg);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--uc-muted);
    }
    #${APP_ID} .uc-done-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 20px;
    }
    #${APP_ID} .uc-avatar--sm { width: 28px; height: 28px; }
    #${APP_ID} .uc-done-name {
      flex: 1 1 auto;
      min-width: 0;
      font-size: 13px;
      font-weight: 500;
      color: var(--uc-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #${APP_ID} .uc-done-name:hover { color: var(--uc-accent-2); }
    #${APP_ID} .uc-warn {
      padding: 8px 10px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 1.4;
      background: color-mix(in srgb, var(--uc-danger) 14%, transparent);
      border: 1px solid color-mix(in srgb, var(--uc-danger) 35%, transparent);
      color: var(--uc-text);
    }
    /* Results that aren't a fresh, complete scan (stopped partway / cached). */
    #${APP_ID} .uc-notice {
      flex-shrink: 0;
      margin: 12px 16px 0;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 1.45;
      background: color-mix(in srgb, var(--uc-accent) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--uc-accent) 30%, transparent);
    }
    #${APP_ID} .uc-notice strong { display: block; margin-bottom: 2px; font-size: 13px; font-weight: 600; }
    #${APP_ID} .uc-notice p { margin: 0; color: var(--uc-muted); }
    #${APP_ID} .uc-notice .uc-notice-reason { margin-top: 4px; color: var(--uc-text); }
    #${APP_ID} .uc-notice-actions { display: flex; gap: 8px; margin-top: 8px; }
    #${APP_ID} .uc-live { font-size: 13px; font-weight: 600; color: var(--uc-accent-2); }
    #${APP_ID} .uc-bar--indeterminate > span { width: 30% !important; animation: uc-slide 1.4s ease-in-out infinite; }
    @keyframes uc-slide {
      from { transform: translateX(-100%); }
      to { transform: translateX(340%); }
    }
    #${APP_ID} .uc-done-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
    #${APP_ID} .uc-done-reason {
      font-size: 11px;
      color: var(--uc-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #${APP_ID} .uc-warn--soft {
      background: color-mix(in srgb, var(--uc-accent) 12%, transparent);
      border-color: color-mix(in srgb, var(--uc-accent) 30%, transparent);
      color: var(--uc-text);
    }

    #${APP_ID} .uc-results {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    #${APP_ID} .uc-results-summary {
      padding: 12px 16px 4px;
      font-size: 13px;
      color: var(--uc-muted);
    }
    #${APP_ID} .uc-search-row {
      padding: 8px 16px;
    }
    #${APP_ID} .uc-search {
      width: 100%;
      height: 36px;
      padding: 0 12px;
      border: 1px solid var(--uc-line);
      border-radius: 8px;
      background: var(--uc-bg-2);
      color: var(--uc-text);
      outline: none;
      transition: border-color 0.15s;
    }
    #${APP_ID} .uc-search:focus { border-color: var(--uc-accent); }
    /* Replace the faint native clear (×) with a clearly-visible themed glyph that
       shows a pointer cursor and brightens on hover. */
    #${APP_ID} .uc-search::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      cursor: pointer;
      background-color: var(--uc-muted);
      -webkit-mask: no-repeat center / 12px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 4l8 8M12 4l-8 8' stroke='black' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E");
      mask: no-repeat center / 12px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 4l8 8M12 4l-8 8' stroke='black' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E");
      transition: background-color 0.15s;
    }
    #${APP_ID} .uc-search::-webkit-search-cancel-button:hover { background-color: var(--uc-text); }

    #${APP_ID} .uc-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 16px 10px;
    }
    #${APP_ID} .uc-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border: 1px solid var(--uc-line);
      border-radius: 999px;
      background: transparent;
      color: var(--uc-muted);
      font-size: 12px;
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    #${APP_ID} .uc-chip:hover { border-color: var(--uc-line-strong); color: var(--uc-text); }
    #${APP_ID} .uc-chip--on { background: color-mix(in srgb, var(--uc-accent) 12%, transparent); border-color: color-mix(in srgb, var(--uc-accent) 50%, transparent); color: var(--uc-accent-2); }
    #${APP_ID} .uc-chip-tick { display: inline-grid; place-items: center; width: 12px; height: 12px; }
    #${APP_ID} .uc-chip-tick svg { width: 12px; height: 12px; }

    #${APP_ID} .uc-list {
      flex: 1 1 auto;
      min-height: 100px;
      overflow-y: auto;
      overscroll-behavior: contain;
      border-top: 1px solid var(--uc-line);
      border-bottom: 1px solid var(--uc-line);
    }
    #${APP_ID} .uc-list-empty {
      padding: 30px 20px;
      text-align: center;
      color: var(--uc-muted);
      font-size: 13px;
    }
    #${APP_ID} .uc-row {
      display: grid;
      grid-template-columns: 18px 36px 1fr auto;
      gap: 10px;
      padding: 8px 16px;
      align-items: center;
      cursor: pointer;
      border-bottom: 1px solid var(--uc-line);
      transition: background 0.1s;
    }
    #${APP_ID} .uc-row:hover { background: color-mix(in srgb, var(--uc-text) 4%, transparent); }
    #${APP_ID} .uc-row:focus-visible { outline: none; background: color-mix(in srgb, var(--uc-accent) 6%, transparent); }
    #${APP_ID} .uc-row--selected { background: color-mix(in srgb, var(--uc-accent) 8%, transparent); }
    #${APP_ID} .uc-row--selected:hover { background: color-mix(in srgb, var(--uc-accent) 12%, transparent); }
    #${APP_ID} .uc-row:last-child { border-bottom: none; }
    #${APP_ID} .uc-row--hidden { opacity: 0.55; }
    #${APP_ID} .uc-row-check {
      width: 16px;
      height: 16px;
      accent-color: var(--uc-accent);
      cursor: pointer;
      margin: 0;
    }
    #${APP_ID} .uc-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      background: var(--uc-bg-3);
    }
    #${APP_ID} .uc-row-text { min-width: 0; }
    #${APP_ID} .uc-row-name {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 13px;
      font-weight: 500;
    }
    #${APP_ID} .uc-row-name a { color: var(--uc-text); }
    #${APP_ID} .uc-row-name a:hover { color: var(--uc-accent-2); }
    #${APP_ID} .uc-row-sub {
      font-size: 12px;
      color: var(--uc-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #${APP_ID} .uc-row-actions {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    #${APP_ID} .uc-icon-btn {
      display: inline-grid;
      place-items: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: var(--uc-muted);
      transition: background 0.15s, color 0.15s;
    }
    #${APP_ID} .uc-icon-btn:hover { background: var(--uc-bg-2); color: var(--uc-text); }
    #${APP_ID} .uc-text-btn {
      width: auto;
      padding: 0 8px;
      font-size: 11px;
      font-weight: 500;
    }
    #${APP_ID} .uc-tag {
      display: inline-flex;
      align-items: center;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      background: color-mix(in srgb, var(--uc-text) 8%, transparent);
      color: var(--uc-muted);
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    #${APP_ID} .uc-tag--brand { background: color-mix(in srgb, var(--uc-accent) 12%, transparent); border: 1px solid color-mix(in srgb, var(--uc-accent) 30%, transparent); color: var(--uc-accent-2); }
    #${APP_ID} .uc-tag--green { background: color-mix(in srgb, var(--uc-success) 15%, transparent); color: var(--uc-success); }
    #${APP_ID} .uc-tag--red { background: color-mix(in srgb, var(--uc-danger) 15%, transparent); color: var(--uc-danger); }

    #${APP_ID} .uc-actionbar {
      flex-shrink: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--uc-bg);
      border-top: 1px solid var(--uc-line);
    }
    #${APP_ID} .uc-actionbar-left,
    #${APP_ID} .uc-actionbar-right {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    #${APP_ID} .uc-select-group { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    #${APP_ID} .uc-muted { color: var(--uc-muted); font-size: 12px; }

    #${APP_ID} .uc-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      display: grid;
      place-items: center;
      padding: 20px;
      z-index: 1;
    }
    #${APP_ID} .uc-dialog {
      width: 100%;
      max-width: 380px;
      background: var(--uc-bg);
      border: 1px solid var(--uc-line);
      border-radius: 12px;
      padding: 18px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.55);
    }
    #${APP_ID} .uc-dialog h3 { margin: 0 0 8px; font-size: 16px; }
    #${APP_ID} .uc-dialog p { margin: 0 0 14px; color: var(--uc-muted); font-size: 13px; }
    #${APP_ID} .uc-dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
    #${APP_ID} .uc-dialog-actions [data-extra] { margin-right: auto; }
    #${APP_ID} .uc-form { display: grid; gap: 8px; max-height: 50vh; overflow-y: auto; padding-right: 4px; }
    #${APP_ID} .uc-field { display: grid; grid-template-columns: 1fr 110px; align-items: center; gap: 10px; font-size: 12px; color: var(--uc-muted); }
    #${APP_ID} .uc-field input {
      height: 32px;
      padding: 0 10px;
      border: 1px solid var(--uc-line);
      border-radius: 6px;
      background: var(--uc-bg-2);
      color: var(--uc-text);
      outline: none;
    }
    #${APP_ID} .uc-field input:focus { border-color: var(--uc-accent); }

    #${APP_ID} .uc-toast {
      position: absolute;
      left: 50%;
      bottom: 12px;
      transform: translateX(-50%);
      padding: 8px 14px;
      background: var(--uc-bg-2);
      border: 1px solid var(--uc-line);
      border-radius: 999px;
      font-size: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.35);
      pointer-events: none;
      animation: uc-pop 0.18s ease-out;
    }

    #${APP_ID} .uc-pill {
      position: absolute;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: var(--uc-bg);
      border: 1px solid var(--uc-line);
      color: var(--uc-text);
      border-radius: 999px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.4);
      font-size: 12px;
      font-weight: 500;
      transition: background 0.15s;
      cursor: pointer;
    }
    #${APP_ID} .uc-pill:hover { background: var(--uc-bg-2); }
    #${APP_ID} .uc-pill-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--uc-muted);
    }
    #${APP_ID} .uc-pill-dot--active { background: var(--uc-accent); animation: uc-pulse 1.4s infinite; }
    #${APP_ID} .uc-pill-dot--error { background: var(--uc-danger); }
    @keyframes uc-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @media (max-width: 480px) {
      #${APP_ID} .uc-panel {
        width: calc(100vw - 16px) !important;
        max-height: calc(100vh - 16px) !important;
        left: 8px !important;
        right: 8px !important;
        top: 8px !important;
        bottom: 8px !important;
      }
      #${APP_ID} .uc-list { max-height: none; flex: 1 1 auto; }
    }
  `;

  cleanupExisting();
  injectStyles();
  mount();
})();
