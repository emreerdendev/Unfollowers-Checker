import type { Guide } from './types'

export const de: Guide[] = [
  {
    slug: 'see-who-unfollowed-you-on-instagram',
    title: 'Instagram: So siehst du, wer dir nicht zurückfolgt',
    description:
      'Instagram zeigt nicht, wer dir entfolgt hat. So listest du kostenlos alle auf, die dir nicht zurückfolgen – ohne einer App dein Passwort zu geben.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          'Instagram benachrichtigt dich nicht, wenn dir jemand entfolgt, und es gibt keine eingebaute Liste der Personen, die dir nicht zurückfolgen. Herausfinden kannst du es nur, indem du zwei Listen vergleichst: die Konten, denen du folgst, und die Konten, die dir folgen.',
          'Bei einem kleinen Konto geht das noch von Hand, aber ab ein paar Hundert wird es unpraktisch. Diese Anleitung zeigt dir einen kostenlosen Weg, das automatisch zu erledigen – ohne eine App zu installieren und ohne dein Passwort an irgendjemanden weiterzugeben.',
        ],
      },
      {
        heading: 'Was du brauchst',
        bullets: [
          'Einen Computer mit einem Desktop-Browser wie Chrome, Edge, Firefox oder Safari.',
          'Du musst in diesem Browser bei instagram.com angemeldet sein.',
          'Etwa fünf Minuten. Bei größeren Konten dauert der Scan länger.',
        ],
      },
      {
        heading: 'Schritt für Schritt',
        steps: [
          'Öffne die Instagram-Seite von Unfollowers Checker und klicke auf „Code kopieren“.',
          'Gehe im selben Browser auf instagram.com und stelle sicher, dass du angemeldet bist.',
          'Öffne die Entwicklerkonsole: F12 oder Strg+Umschalt+J unter Windows und Linux, Cmd+Option+J auf dem Mac. Klicke auf den Tab „Console“.',
          'Füge das Skript ein und drücke Enter. In der Ecke der Seite erscheint ein Panel.',
          'Klicke auf „Jetzt scannen“. Das Panel lädt deine Follower, gleicht dann alle, denen du folgst, mit ihnen ab und listet alle auf, die dir nicht zurückfolgen.',
          'Optional kannst du Konten auswählen und ihnen entfolgen. Das Panel verteilt die Anfragen zeitlich und prüft jedes Entfolgen bei Instagram nach.',
        ],
      },
      {
        heading: 'Warum ein Konsolen-Skript statt einer App?',
        paragraphs: [
          'Instagram hat keine öffentliche API für Follower-Listen. Apps, die das versprechen, verlangen meist deinen Benutzernamen und dein Passwort und melden sich auf ihren eigenen Servern an – das bringt dein Konto in Gefahr.',
          'Ein Skript, das du auf instagram.com ausführst, nutzt die Sitzung, mit der du ohnehin angemeldet bist. Dein Passwort verlässt nie deinen Browser, und nichts wird an einen Server von Drittanbietern gesendet. Das Skript ist Open Source, du kannst also genau nachlesen, was es tut, bevor du es ausführst.',
        ],
      },
      {
        heading: 'Tipps',
        bullets: [
          'Bricht der Scan mittendrin ab, öffne das Panel erneut: Der Fortschritt wird nach jeder Seite gespeichert, du kannst also weitermachen, statt von vorn zu beginnen.',
          'Behalte die Standard-Timings bei. Sie sind bewusst langsam, damit es wie normale Nutzung aussieht.',
          'Entfolge nicht Hunderten Konten auf einmal. Verteile große Aufräumaktionen auf ein paar Tage.',
        ],
      },
    ],
  },
  {
    slug: 'are-instagram-unfollower-apps-safe',
    title:
      'Sind Instagram-Unfollower-Apps sicher? Das solltest du zuerst prüfen',
    description:
      'Viele „Wer hat mir entfolgt“-Apps verlangen dein Instagram-Passwort. So erkennst du riskante von sicheren Tools und senkst das Risiko einer Aktionssperre.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          'Wer nach „Wer hat mir auf Instagram entfolgt“ sucht, findet Dutzende Apps. Manche sind harmlos, andere bringen dein Konto ernsthaft in Gefahr. Der Unterschied liegt meist an einer Sache: was das Tool von dir verlangt.',
        ],
      },
      {
        heading: 'Warnsignale',
        bullets: [
          'Es verlangt dein Instagram-Passwort. Wenn sich ein Drittanbieter als du anmeldet, kann das als verdächtig eingestuft werden, und du hast keine Kontrolle darüber, was er mit der Sitzung macht.',
          'Es zeigt nur einen Teil der Liste und will ein Abo, um den Rest „freizuschalten“.',
          'Es verspricht zu zeigen, wer dein Profil oder deine Storys angesehen hat. Instagram gibt diese Daten nicht heraus, die Behauptung ist also falsch.',
          'Es ist unklar, wer dahintersteckt, was gespeichert wird oder wohin deine Daten gehen.',
        ],
      },
      {
        heading: 'Sicherere Wege',
        bullets: [
          'Tools, die in deiner eigenen Browser-Sitzung auf instagram.com laufen, sodass dein Passwort nie dein Gerät verlässt.',
          'Tools, die mit dem offiziellen Datenexport von Instagram arbeiten, den du selbst herunterlädst.',
          'Open-Source-Tools, bei denen jeder den Code lesen und prüfen kann, was er tut.',
        ],
      },
      {
        heading: 'Eine Aktionssperre vermeiden',
        paragraphs: [
          'Auch ein Tool, das dein Passwort nie sieht, kann die Limits von Instagram auslösen, wenn es zu schnell handelt. Instagram kann dann Aktionen wie Folgen und Entfolgen vorübergehend sperren.',
        ],
        bullets: [
          'Entfolge in kleinen Gruppen, mit Pausen zwischen den einzelnen Konten.',
          'Hör auf, wenn Instagram eine Warnung anzeigt, und warte ein bis zwei Tage, bevor du weitermachst.',
          'Nutze nicht mehrere Automatisierungs-Tools gleichzeitig.',
        ],
      },
      {
        heading: 'So geht Unfollowers Checker damit um',
        paragraphs: [
          'Unfollowers Checker läuft als Skript in deiner eigenen Browser-Sitzung, fragt nie nach deinem Passwort und sendet nichts an eigene Server. Es fügt zufällige Verzögerungen und Abkühlphasen ein, pausiert automatisch, wenn Instagram um eine Verlangsamung bittet, und prüft jedes Entfolgen nach. Jede automatisierte Aktivität birgt ein gewisses Risiko, nutze es also mit Bedacht.',
        ],
      },
    ],
  },
  {
    slug: 'bluesky-who-doesnt-follow-you-back',
    title: 'Bluesky: So findest du heraus, wer dir nicht zurückfolgt',
    description:
      'Ein schneller, kostenloser Weg, die Bluesky-Konten aufzulisten, die dir nicht zurückfolgen – und ihnen per offizieller Bluesky-Anmeldung gesammelt zu entfolgen.',
    published: '2026-11-13',
    platform: 'bluesky',
    sections: [
      {
        paragraphs: [
          'Bluesky zeigt dir, wie viele Follower du hast und wie vielen du folgst, aber nicht, wer in der einen oder anderen Liste fehlt. Da Follow-Listen auf Bluesky öffentlich sind, kannst du sie ohne Anmeldung vergleichen.',
        ],
      },
      {
        heading: 'Schritt für Schritt',
        steps: [
          'Öffne die Bluesky-Seite von Unfollowers Checker.',
          'Gib dein Handle ein, zum Beispiel name.bsky.social oder deine eigene Domain. Du kannst auch deinen bsky.app-Profillink einfügen.',
          'Klicke auf „Prüfen“. Du siehst alle Konten, denen du folgst, die dir aber nicht zurückfolgen.',
          'Zum Entfolgen klicke auf „Mit Bluesky anmelden“. Die Anmeldung nutzt das offizielle OAuth von Bluesky, du gibst also nie ein Passwort oder App-Passwort ein.',
          'Wähle die gewünschten Konten aus und klicke auf „Ausgewählte entfolgen“.',
        ],
      },
      {
        heading: 'Gut zu wissen',
        bullets: [
          'Du kannst jedes öffentliche Handle prüfen, nicht nur dein eigenes. Entfolgen betrifft immer nur dein eigenes Konto.',
          'Nichts wird gespeichert: Die Listen werden für diese eine Anfrage abgerufen, verglichen und zurückgegeben.',
          'Sehr große Konten werden bis zu einer Grenze verglichen, ihre Ergebnisse können daher unvollständig sein.',
        ],
      },
    ],
  },
  {
    slug: 'download-your-x-twitter-archive',
    title: 'So lädst du dein X-(Twitter-)Datenarchiv herunter',
    description:
      'Schritt für Schritt: Fordere dein X-Datenarchiv an, finde following.js und follower.js darin und sieh, wer dir nicht zurückfolgt – ganz ohne X-API.',
    published: '2026-11-13',
    platform: 'twitter',
    sections: [
      {
        paragraphs: [
          'X bietet Tools keinen kostenlosen Zugriff mehr auf Follower-Listen, aber deine eigenen Listen bekommst du trotzdem: Jedes Konto kann bei X ein Archiv seiner Daten herunterladen. Zwei Dateien in diesem Archiv, following.js und follower.js, reichen aus, um herauszufinden, wer dir nicht zurückfolgt.',
        ],
      },
      {
        heading: 'Archiv anfordern',
        steps: [
          'Öffne auf X „Mehr“ (oder dein Profilmenü) und gehe zu „Einstellungen und Datenschutz“.',
          'Wähle „Dein Konto“ und dann „Archiv deiner Daten herunterladen“.',
          'Bestätige dein Passwort. X schickt dir eventuell zusätzlich einen Bestätigungscode per E-Mail oder auf dein Telefon.',
          'Klicke auf „Archiv anfordern“.',
        ],
      },
      {
        heading: 'Abwarten',
        paragraphs: [
          'X erstellt das Archiv im Hintergrund. Das dauert meist etwa einen Tag, bei großen Konten manchmal länger. Sobald es bereit ist, bekommst du eine E-Mail und eine Benachrichtigung in der App, und der Download bleibt ein paar Tage lang verfügbar.',
        ],
      },
      {
        heading: 'Die zwei Dateien finden',
        steps: [
          'Lade das Archiv (eine .zip-Datei) herunter und entpacke es.',
          'Öffne darin den Ordner data.',
          'Suche following.js und follower.js. Große Konten haben eventuell weitere Teile wie following-part1.js – behalte diese ebenfalls.',
        ],
      },
      {
        heading: 'Vergleichen',
        paragraphs: [
          'Öffne die X-Seite von Unfollowers Checker und zieh die beiden Dateien (und eventuelle Teildateien) darauf. Der Vergleich läuft komplett in deinem Browser – die Dateien werden nie hochgeladen. Jedes Ergebnis verlinkt auf das Profil bei X, wo du entfolgen kannst.',
        ],
      },
      {
        heading: 'Gut zu wissen',
        bullets: [
          'Das Archiv enthält nur Konto-IDs, keine Benutzernamen, daher zeigen die Ergebnisse IDs. Ein Klick darauf öffnet das richtige Profil.',
          'Das Archiv ist eine Momentaufnahme. Um später erneut zu prüfen, fordere ein neues an.',
          'Der Rest des Archivs (Posts, Nachrichten, Einstellungen) wird nicht gelesen – nur die beiden Follow-Dateien werden verwendet.',
        ],
      },
    ],
  },
  {
    slug: 'github-who-doesnt-follow-you-back',
    title: 'GitHub: So siehst du, wer dir nicht zurückfolgt',
    description:
      'GitHub zeigt nicht, wer dir nicht zurückfolgt. So listest du sie kostenlos für jeden Benutzernamen auf – und entfolgst ihnen gesammelt von deinem eigenen Konto.',
    published: '2026-11-13',
    platform: 'github',
    sections: [
      {
        paragraphs: [
          'GitHub zeigt, wie viele Personen dir folgen und wie vielen du folgst, aber nicht, wer in der einen oder anderen Liste fehlt. Da Follow-Listen auf GitHub öffentlich sind, lassen sie sich ohne Anmeldung vergleichen.',
        ],
      },
      {
        heading: 'Schritt für Schritt',
        steps: [
          'Öffne die GitHub-Seite von Unfollowers Checker.',
          'Gib einen GitHub-Benutzernamen ein – deinen oder den von jemand anderem. Ein Profillink funktioniert auch.',
          'Klicke auf „Prüfen“. Du siehst alle Konten, denen dieser Nutzer folgt, die ihm aber nicht zurückfolgen.',
          'Um deine eigene Liste aufzuräumen, klicke oben auf „Anmelden“. Die Anmeldung nutzt das offizielle OAuth von GitHub; das Zugriffstoken bleibt auf dem Server.',
          'Wähle die gewünschten Konten aus und klicke auf „Ausgewählte entfolgen“.',
        ],
      },
      {
        heading: 'Gut zu wissen',
        bullets: [
          'Zum Ansehen eines öffentlichen Kontos ist keine Anmeldung nötig. Entfolgen betrifft immer nur dein eigenes Konto und muss vorher von dir bestätigt werden.',
          'Nichts wird gespeichert: Die Listen werden für diese eine Anfrage abgerufen, verglichen und zurückgegeben.',
          'Sehr große Konten werden bis zu einer Grenze verglichen, ihre Ergebnisse können daher unvollständig sein – die Seite weist dich darauf hin.',
        ],
      },
    ],
  },
  {
    slug: 'instagram-action-blocked',
    title:
      'Instagram „Aktion blockiert“: Was es bedeutet und was du tun kannst',
    description:
      'Warum Instagram Aktionen wie Folgen und Entfolgen sperrt, wie lange das meist dauert, was hilft – und wie du es beim Aufräumen deiner Following-Liste vermeidest.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          '„Aktion blockiert“ (oder „Versuche es später erneut“) ist eine vorübergehende Einschränkung, die Instagram einem Konto auferlegt, das etwas zu oft und zu schnell tut. Sie betrifft meist Aktionen wie Folgen, Entfolgen, Liken oder Kommentieren, während der Rest der App weiter funktioniert.',
        ],
      },
      {
        heading: 'Warum es passiert',
        bullets: [
          'Viele Follows oder Unfollows in kurzer Zeit, was automatisiert wirkt.',
          'Eine Aktion zu wiederholen, direkt nachdem Instagram sie abgelehnt hat.',
          'Apps von Drittanbietern, die sich als du anmelden oder in deinem Namen handeln.',
          'Ein neues oder kürzlich geändertes Konto, das Instagram genauer beobachtet.',
        ],
      },
      {
        heading: 'Wie lange es dauert',
        paragraphs: [
          'Instagram veröffentlicht keine genauen Limits oder Zeiträume. Die meisten Sperren werden innerhalb von Stunden bis zu ein paar Tagen aufgehoben. Wer es während der Sperre weiter versucht, verlängert sie eher.',
        ],
      },
      {
        heading: 'Was du tun kannst',
        steps: [
          'Stoppe die blockierte Aktion und versuche es nicht immer wieder.',
          'Warte – gib dem Ganzen mindestens einen Tag, bevor du es erneut versuchst.',
          'Prüfe Einstellungen → Apps und Websites und entferne jede App, die du nicht kennst oder nicht mehr nutzt.',
          'Wenn du glaubst, dass jemand anderes dein Konto genutzt hat, ändere dein Passwort und aktiviere die Zwei-Faktor-Authentifizierung.',
          'Wenn du meinst, dass es sich um einen Fehler handelt, kannst du das Instagram direkt im Dialog mitteilen.',
        ],
      },
      {
        heading: 'Entfolgen, ohne gesperrt zu werden',
        bullets: [
          'Entfolge in kleinen Gruppen, mit Pausen zwischen den einzelnen Konten.',
          'Verteile eine große Aufräumaktion auf mehrere Tage.',
          'Meide Tools, die nach deinem Passwort fragen.',
        ],
      },
      {
        heading: 'So geht Unfollowers Checker damit um',
        paragraphs: [
          'Das Instagram-Panel von Unfollowers Checker läuft in deiner eigenen Browser-Sitzung, fügt zufällige Verzögerungen und Abkühlphasen ein und pausiert automatisch, wenn Instagram um eine Verlangsamung bittet. Jede automatisierte Aktivität birgt ein gewisses Risiko, behalte also die Standard-Timings bei.',
        ],
      },
    ],
  },
]
