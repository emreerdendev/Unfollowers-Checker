import type { SeoContent } from './types'

export const de: SeoContent = {
  home: {
    title: 'Unfollowers Checker — Wer folgt dir nicht zurück?',
    description:
      'Kostenloses Open-Source-Tool: Finde Konten, die dir auf Instagram, X (Twitter), GitHub, Bluesky, GitLab und Mastodon nicht zurückfolgen. Ohne Passwort.',
    heading: 'Finde heraus, wer dir nicht zurückfolgt – auf jeder Plattform',
    intro: [
      'Unfollowers Checker vergleicht die Konten, denen du folgst, mit den Konten, die dir folgen, und listet alle auf, die dir nicht zurückfolgen. Es funktioniert mit Instagram, X (Twitter), GitHub, Bluesky, GitLab und Mastodon.',
      'Es ist kostenlos und Open Source, fragt nie nach deinem Passwort und speichert keine Daten. Auf GitHub, Bluesky, GitLab, Mastodon und Instagram kannst du ausgewählten Konten auch gesammelt entfolgen.',
    ],
    faq: [
      {
        q: 'Welche Plattformen werden unterstützt?',
        a: 'Instagram, X (Twitter), GitHub, Bluesky, GitLab und Mastodon. Wähle oben auf der Seite eine Plattform aus.',
      },
      {
        q: 'Kann ich damit auch entfolgen?',
        a: 'Ja, auf GitHub, Bluesky, GitLab, Mastodon und Instagram. Wähle die Konten aus und entfolge ihnen in einem Schritt. X bietet dafür keine kostenlose API; dort verlinkt jedes Ergebnis auf das Profil, und du entfolgst direkt auf X.',
      },
    ],
  },

  platforms: {
    github: {
      title: 'GitHub Unfollowers — Wer folgt dir auf GitHub nicht zurück?',
      description:
        'Gib einen GitHub-Benutzernamen ein und sieh, wer nicht zurückfolgt. Kostenlos und Open Source. Mit GitHub anmelden, um gesammelt zu entfolgen.',
      heading: 'Sieh, wer dir auf GitHub nicht zurückfolgt',
      intro: [
        'Gib einen GitHub-Benutzernamen ein, und Unfollowers Checker listet alle Konten auf, denen er folgt, die ihm aber nicht zurückfolgen. Dafür wird die öffentliche GitHub-API genutzt – ohne Anmeldung und für jeden öffentlichen Nutzer.',
        'Um deine eigene Liste aufzuräumen, melde dich mit GitHub an (offizielles OAuth), wähle die Konten aus und entfolge ihnen gesammelt.',
      ],
      faq: [
        {
          q: 'Muss ich mich anmelden, um GitHub-Follower zu prüfen?',
          a: 'Nein. Follower- und Following-Listen sind auf GitHub öffentlich. Anmelden musst du dich nur, um mit deinem eigenen Konto zu entfolgen.',
        },
        {
          q: 'Welche Berechtigungen fragt die GitHub-Anmeldung an?',
          a: 'Nur die Berechtigung, die GitHub zum Folgen und Entfolgen in deinem Namen verlangt. Das Zugriffstoken bleibt auf dem Server und erreicht nie deinen Browser.',
        },
        {
          q: 'Funktioniert es auch bei Konten mit Tausenden Followern?',
          a: 'Ja. Sehr große Konten werden bis zu einer Grenze verglichen; die Ergebnisse können dann unvollständig sein, worauf die Seite hinweist.',
        },
      ],
    },
    bluesky: {
      title: 'Bluesky Unfollowers — Wer folgt dir auf Bluesky nicht zurück?',
      description:
        'Sieh, welche Bluesky-Konten dir nicht zurückfolgen – ohne Anmeldung. Mit Bluesky anmelden, um ihnen gesammelt zu entfolgen. Kostenlos und Open Source.',
      heading: 'Sieh, wer dir auf Bluesky nicht zurückfolgt',
      intro: [
        'Gib ein Bluesky-Handle wie name.bsky.social ein, und Unfollowers Checker listet alle Konten auf, die nicht zurückfolgen. Die Daten kommen aus der öffentlichen AT-Protocol-API von Bluesky, eine Anmeldung ist zum Ansehen nicht nötig.',
        'Melde dich mit dem offiziellen Bluesky-OAuth an, um ausgewählten Konten von deinem Profil aus gesammelt zu entfolgen.',
      ],
      faq: [
        {
          q: 'Funktioniert es mit eigenen Domain-Handles?',
          a: 'Ja. Jedes Bluesky-Handle funktioniert, auch eigene Domains wie deinname.de. Du kannst auch einen bsky.app-Profillink einfügen.',
        },
        {
          q: 'Brauche ich ein App-Passwort?',
          a: 'Nein. Die Anmeldung läuft über das offizielle OAuth von Bluesky – du gibst hier nie ein Passwort oder App-Passwort ein.',
        },
        {
          q: 'Kann ich das Konto einer anderen Person prüfen?',
          a: 'Ja, Follow-Listen sind auf Bluesky öffentlich. Entfolgen betrifft immer nur dein eigenes Konto.',
        },
      ],
    },
    gitlab: {
      title: 'GitLab Follower — Wer folgt dir auf GitLab nicht zurück?',
      description:
        'Melde dich mit GitLab an, sieh, wer dir auf gitlab.com nicht zurückfolgt, und entfolge gesammelt. Kostenlos, Open Source, nichts wird gespeichert.',
      heading: 'Sieh, wer dir auf GitLab nicht zurückfolgt',
      intro: [
        'GitLab hält Follower-Listen privat, daher bittet dich Unfollowers Checker zuerst um eine Anmeldung mit GitLab. Danach lädt es deine eigene Liste und zeigt alle, denen du folgst, die dir aber nicht zurückfolgen.',
        'Wähle die gewünschten Konten aus und entfolge ihnen in einem Schritt. Es funktioniert mit gitlab.com und braucht keinen bezahlten Plan.',
      ],
      faq: [
        {
          q: 'Warum muss ich mich bei GitLab anmelden?',
          a: 'Die GitLab-API gibt Follower-Listen nur an angemeldete Nutzer heraus. Deshalb kannst du nur dein eigenes Konto prüfen.',
        },
        {
          q: 'Funktioniert es mit selbst gehostetem GitLab?',
          a: 'Noch nicht. Aktuell wird gitlab.com unterstützt.',
        },
      ],
    },
    mastodon: {
      title: 'Mastodon Unfollowers — Wer folgt dir nicht zurück?',
      description:
        'Gib ein Handle im Format user@instanz ein und sieh, wer auf Mastodon nicht zurückfolgt. Funktioniert mit jeder Instanz, ohne Anmeldung. Kostenlos.',
      heading: 'Sieh, wer dir auf Mastodon nicht zurückfolgt',
      intro: [
        'Gib ein Mastodon-Handle im Format user@instanz ein, und Unfollowers Checker listet alle Konten auf, die nicht zurückfolgen. Das Ansehen funktioniert für Konten auf jeder Instanz.',
        'Melde dich an, um ausgewählten Konten gesammelt zu entfolgen. Anmeldung und Entfolgen funktionieren derzeit auf mastodon.social.',
      ],
      faq: [
        {
          q: 'Welche Mastodon-Instanzen werden unterstützt?',
          a: 'Ansehen funktioniert auf jeder Instanz, die Follow-Listen öffentlich anzeigt. Anmeldung und Entfolgen funktionieren derzeit auf mastodon.social.',
        },
        {
          q: 'Was ist, wenn ein Konto seine Follow-Listen verbirgt?',
          a: 'Manche Mastodon-Nutzer verbergen, wem sie folgen oder wer ihnen folgt. Dann können die Listen nicht gelesen werden und die Prüfung ist nicht möglich.',
        },
      ],
    },
    instagram: {
      title: 'Instagram Unfollowers Checker — Kostenlos, ohne Passwort',
      description:
        'Sieh, wer dir auf Instagram nicht zurückfolgt, und entfolge gesammelt. Läuft in deiner eigenen Browser-Sitzung: kein Passwort, keine App, kein Server.',
      heading: 'Sieh, wer dir auf Instagram nicht zurückfolgt',
      intro: [
        'Instagram zeigt nicht an, wer dir nicht zurückfolgt. Unfollowers Checker gibt dir ein kleines Skript, das du auf instagram.com in die Browser-Konsole einfügst. Es lädt deine Follower und die Konten, denen du folgst, mit deiner eigenen Sitzung und listet alle auf, die dir nicht zurückfolgen.',
        'Du gibst nie dein Passwort ein, und nichts wird an unsere Server gesendet. Im Panel kannst du suchen, filtern und ausgewählten Konten in Etappen entfolgen – mit vorsichtigen Pausen dazwischen.',
      ],
      faq: [
        {
          q: 'Zeigt Instagram, wer mir entfolgt ist?',
          a: 'Nein. Instagram benachrichtigt dich nicht und zeigt keine Liste der Personen, die dir entfolgt sind oder nicht zurückfolgen. Tools wie dieses vergleichen dafür deine Follower- und Following-Listen.',
        },
        {
          q: 'Ist die Nutzung sicher?',
          a: 'Du teilst nie dein Passwort, und das Skript spricht nur aus deinem eigenen Browser mit Instagram. Es baut zufällige Pausen ein und hält automatisch an, wenn Instagram zum Verlangsamen auffordert. Jede automatisierte Aktivität birgt ein gewisses Risiko – behalte die Standardzeiten bei und entfolge nicht Hunderten Konten auf einmal.',
        },
        {
          q: 'Warum füge ich ein Skript in die Konsole ein?',
          a: 'Instagram hat keine öffentliche Follower-API. Auf instagram.com nutzt das Skript deine bestehende Sitzung, sodass weder Passwort noch Drittanbieter-Login nötig sind. Das Skript ist Open Source; du kannst es vorher lesen.',
        },
        {
          q: 'Funktioniert es auf dem Handy?',
          a: 'Es braucht einen Desktop-Browser mit Entwicklertools, etwa Chrome, Edge, Firefox oder Safari auf einem Computer.',
        },
        {
          q: 'Was passiert, wenn der Scan mittendrin abbricht?',
          a: 'Der Fortschritt wird nach jeder Seite gespeichert. Öffne das Panel erneut und mach dort weiter, wo du aufgehört hast.',
        },
      ],
    },
    twitter: {
      title: 'X (Twitter) Unfollowers — Wer folgt dir nicht zurück?',
      description:
        'Finde mit deinem offiziellen X-Datenarchiv heraus, wer dir auf X (Twitter) nicht zurückfolgt. Der Vergleich läuft im Browser, Dateien bleiben auf deinem Gerät.',
      heading: 'Sieh, wer dir auf X (Twitter) nicht zurückfolgt',
      intro: [
        'X bietet keine kostenlose API für Follower-Listen, daher nutzt Unfollowers Checker dein offizielles X-Datenarchiv. Lade daraus following.js und follower.js hoch, und die Seite listet alle Konten auf, denen du folgst, die dir aber nicht zurückfolgen.',
        'Alles läuft in deinem Browser: Die Dateien werden lokal gelesen und verglichen und nie hochgeladen. Jedes Ergebnis verlinkt auf das Profil, damit du auf X entfolgen kannst.',
      ],
      faq: [
        {
          q: 'Wie bekomme ich mein X-Datenarchiv?',
          a: 'Gehe auf X zu Einstellungen → Dein Konto → Archiv deiner Daten herunterladen. Die Vorbereitung dauert meist etwa einen Tag. Entpacke es und suche following.js und follower.js im Ordner data.',
        },
        {
          q: 'Warum sehe ich Zahlen-IDs statt Benutzernamen?',
          a: 'Das X-Archiv enthält nur Konto-IDs, keine Benutzernamen. Ein Klick auf ein Ergebnis öffnet das richtige Profil auf X.',
        },
        {
          q: 'Kann ich hier entfolgen?',
          a: 'Auf X nicht, da es dafür keine kostenlose API gibt. Öffne jedes Profil aus der Liste und entfolge auf X.',
        },
      ],
    },
  },

  general: [
    {
      q: 'Ist Unfollowers Checker kostenlos?',
      a: 'Ja, komplett kostenlos, ohne Werbung und ohne Limits. Es ist Open Source auf GitHub.',
    },
    {
      q: 'Fragt ihr nach meinem Passwort?',
      a: 'Niemals. Wo eine Anmeldung nötig ist, wird das offizielle OAuth der Plattform genutzt. Instagram läuft in deiner eigenen Browser-Sitzung, X arbeitet mit deinem heruntergeladenen Archiv.',
    },
    {
      q: 'Speichert ihr meine Daten?',
      a: 'Nein. Es gibt keine Datenbank. Listen werden für die eine Anfrage abgerufen, verglichen und zurückgegeben; deine Einstellungen bleiben im lokalen Speicher deines Browsers.',
    },
  ],

  guides: {
    title: 'Anleitungen — Unfollowers Checker',
    description:
      'Schritt-für-Schritt-Anleitungen rund um Follower, die nicht zurückfolgen.',
    heading: 'Anleitungen',
    intro: 'Praktische Schritt-für-Schritt-Anleitungen.',
  },

  faq: {
    title: 'Häufige Fragen — Unfollowers Checker',
    description:
      'Antworten zu Unfollowers Checker: wie es auf Instagram, X, GitHub, Bluesky, GitLab und Mastodon funktioniert, ob es sicher ist und was es speichert.',
    heading: 'Häufige Fragen',
    intro:
      'Wie es auf jeder Plattform funktioniert, was gespeichert wird und wie du sicher bleibst.',
    general: 'Allgemein',
  },

  notFound: {
    title: 'Seite nicht gefunden',
    body: 'Diese Seite gibt es nicht oder sie wurde verschoben. Wähle stattdessen auf der Startseite eine Plattform.',
    backHome: 'Zur Startseite',
  },
}
