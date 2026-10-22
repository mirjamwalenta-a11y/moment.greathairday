// Inhalte der Instagram-Mappe (instagram.html).
// Neues Karussell: am einfachsten in Moment über „Neues Karussell“ (wird
// dann auf dem Gerät gespeichert). Fest hier ablegen: Bilder nach
// bilder/karussells/<id>/folie-01.png …, Quelle nach vorlagen/karussell-<id>.html,
// Eintrag mit `daten` (Folientexte, damit „Bearbeiten“ geht) hier ergänzen.
// Alles hier ist für öffentliche Posts gedacht: dieses Repo ist öffentlich.

const KARUSSELLS = [
  {
    id: 'alpha-cooling',
    titel: 'Alpha Cooling',
    profil: 'Alpha-Cooling-Profil (anpinnen), optional als Collab im Salon-Profil',
    erstellt: '2026-10-22',
    folien: 8,
    caption: `Zwei Minuten Kälte, ohne dass du frierst oder dich ausziehst.

So läuft Alpha Cooling bei mir im Salon in Wien-Margareten ab: Du legst deine Handflächen auf gekühlte Flächen, dazu kommt ein sanfter Unterdruck. Die Idee kennt man vom Eisbad, nur angenehmer.

Viele empfinden es als erfrischend, zum Beispiel im Mittagstief oder nach dem Sport. Du kannst es einzeln buchen oder an deinen Friseurtermin anhängen. Speichere dir das Karussell für deinen nächsten Besuch.

Hast du schon einmal ein Eisbad ausprobiert?

Mirjam

#GreatHairDay #Wien #AlphaCooling`,
    daten: {"kontext": "salon", "folien": [{"typ": "titel", "kicker": "Alpha Cooling", "titel": "2 Minuten Kälte, ohne dass du frierst", "unter": "So läuft Alpha Cooling ab."}, {"typ": "dunkel", "kicker": "Die Idee", "titel": "Man kennt sie vom Eisbad oder der Kältekammer.", "text": "Alpha Cooling ist die angenehme, unkomplizierte Variante."}, {"typ": "punkt", "nr": 1, "kicker": "So geht’s", "titel": "Hände auflegen", "text": "Du legst deine Handflächen auf gekühlte Flächen. Dazu kommt ein sanfter Unterdruck."}, {"typ": "punkt", "nr": 2, "kicker": "Das Gefühl", "titel": "Kühl, nicht eisig", "text": "Die Flächen haben etwa 4 bis 5 °C. Kein Brennen und kein Pochen wie nach einem Schneeball in der Hand."}, {"typ": "punkt", "nr": 3, "kicker": "Im Körper", "titel": "Die Kühle verteilt sich", "text": "Gekühlt werden nur die Handflächen. Über das Blut verteilt sich die Kühle im Körper."}, {"typ": "punkt", "nr": 4, "kicker": "Die Dauer", "titel": "Etwa 2 Minuten", "text": "Ohne Ausziehen, ohne Frieren, ohne Nässe."}, {"typ": "punkt", "nr": 5, "kicker": "Wann", "titel": "Wann es gut passt", "text": "Viele empfinden es als erfrischend, zum Beispiel im Mittagstief oder nach dem Sport. Einzeln buchbar oder nach deinem Friseurtermin."}, {"typ": "liste", "kicker": "Zum Speichern", "titel": "Alpha Cooling auf einen Blick", "punkte": ["Handflächen auf gekühlte Flächen", "Etwa 4 bis 5 °C, angenehm kühl", "Die Kühle verteilt sich im Körper", "Etwa 2 Minuten", "Ohne Ausziehen, Frieren oder Nässe"]}]},
    alt: 'Titelbild in Beige und Gold mit dem Text „2 Minuten Kälte, ohne dass du frierst. So läuft Alpha Cooling ab.“ und der Unterschrift Mirjam Walenta, A Great Hair Day.'
  },
  {
    id: 'balayage',
    titel: '5 Fragen vor deiner Balayage',
    profil: 'Salon-Profil (anpinnen)',
    erstellt: '2026-10-22',
    folien: 8,
    caption: `Fünf Fragen, die du vor deiner Balayage klären solltest.

Eine Balayage begleitet dich viele Wochen. Ob sie zu dir passt, entscheidet sich oft schon im Gespräch davor, nicht erst beim Färben.

Im Karussell findest du die Fragen, über die wir in meinem Salon in Wien-Margareten vor jeder Balayage sprechen. Speichere sie dir für deinen nächsten Termin.

Welche Frage hättest du dir vor deiner letzten Farbe gern gestellt?

Mirjam

#GreatHairDay #Wien #Balayage`,
    daten: {"kontext": "salon", "folien": [{"typ": "titel", "kicker": "Vor dem Färben", "titel": "5 Fragen vor deiner Balayage", "unter": "Damit das Ergebnis zu dir passt."}, {"typ": "dunkel", "kicker": "Warum", "titel": "Eine Balayage wächst lange mit dir.", "text": "Ein gutes Gespräch vorher erspart dir später eine Korrektur."}, {"typ": "punkt", "nr": 1, "kicker": "Frage 1", "titel": "Wie hell soll es werden?", "text": "Bring ein Foto mit. „Etwas heller“ bedeutet für jede etwas anderes."}, {"typ": "punkt", "nr": 2, "kicker": "Frage 2", "titel": "Wie oft willst du nachfärben?", "text": "Eine Balayage wächst weicher heraus als klassische Strähnen. Sag, wie viel Pflege du dir wünschst."}, {"typ": "punkt", "nr": 3, "kicker": "Frage 3", "titel": "Was war schon in deinem Haar?", "text": "Frühere Farbe oder Tönung verändert, wie das Haar aufhellt. Auch wenn sie Jahre her ist."}, {"typ": "punkt", "nr": 4, "kicker": "Frage 4", "titel": "Wie trägst du dein Haar im Alltag?", "text": "Offen, gebunden, glatt oder gelockt: Danach richtet sich, wo die hellen Partien sitzen."}, {"typ": "punkt", "nr": 5, "kicker": "Frage 5", "titel": "Wie viel Zeit hast du an dem Tag?", "text": "Eine Balayage braucht Ruhe. Plane den Termin so, dass du nicht auf die Uhr schauen musst."}, {"typ": "liste", "kicker": "Zum Speichern", "titel": "5 Fragen vor deiner Balayage", "punkte": ["Wie hell soll es werden?", "Wie oft willst du nachfärben?", "Was war schon in deinem Haar?", "Wie trägst du dein Haar im Alltag?", "Wie viel Zeit hast du an dem Tag?"]}]},
    alt: 'Titelbild in Beige und Gold mit dem Text „5 Fragen vor deiner Balayage. Damit das Ergebnis zu dir passt.“ und der Unterschrift Mirjam Walenta, A Great Hair Day.'
  }
];

// Profil-Check vom 2026-10-22 (Raster: .claude/skills/ig-profile/rubric.json).
// Punkte mit ~ waren auf den Screenshots nicht ganz zu sehen.
const PROFILE = [
  {
    id: 'salon',
    name: 'Mirjam Walenta – A Great Hair Day',
    aufgabe: 'Geschäft: Friseursalon, für Kund:innen in Wien',
    punkte: '~45',
    namensfeld: ['Mirjam | Friseurin Wien 1050', 'Friseursalon Wien Margareten', 'Mirjam Walenta | Friseur Wien'],
    bio: `Haarschnitt, Farbe und Balayage in Wien-Margareten. Ich nehme mir Zeit für deine Beratung.
Eigener Salon seit 1993 · Ausbilderin der Innung
Termin ↓`,
    hinweis: 'Die Auszeichnungen (Radio Wien, Anton-Benya-Preis) passen gut in ein Highlight „Über mich“.',
    todo: [
      'Namensfeld ändern (eine Variante oben)',
      'Bio ersetzen',
      'Nur noch den Buchungslink drinlassen (stylisten.eu/pranz)',
      'Kategorie auf „Friseursalon“ ändern',
      '3 Beiträge anpinnen: Vorher/Nachher, Balayage-Karussell, Vorstellung',
      'Highlights umbenennen: Ergebnisse, Preise, Team, Ausbildung, Alpha Cooling, Anfahrt („Buisness“ ist ein Tippfehler)',
      'Highlight „Alpha Cooling“ mit Verweis aufs Alpha-Profil',
      'An den meisten Tagen eine Story'
    ]
  },
  {
    id: 'alpha',
    name: 'Mit der Kraft der Kälte (Alpha Cooling)',
    aufgabe: 'Geschäft: Alpha Cooling im Salon',
    punkte: '~37',
    namensfeld: ['Alpha Cooling Wien | Mirjam', 'Alpha Cooling in Wien 1050'],
    bio: `Alpha Cooling in Wien-Margareten: 2 Minuten Kälte über die Handflächen, ohne Ausziehen und ohne Frieren.
Einzeln oder nach deinem Friseurtermin ↓`,
    warnung: true,
    hinweis: 'Keine Wirkversprechen wie Verjüngung oder Langlebigkeit, auch nicht in übernommenen Herstellergrafiken.',
    todo: [
      'Namensfeld ändern (eine Variante oben)',
      'Bio ersetzen',
      'Link zur Buchung statt zum YouTube-Video',
      'Alpha-Cooling-Karussell posten und anpinnen',
      'Beiträge mit „Verjüngungskur“ und „Langlebigkeit“ überarbeiten oder archivieren',
      'Profilfoto gut erkennbar machen'
    ]
  },
  {
    id: 'privat',
    name: 'Mirjam Walenta (persönlich)',
    aufgabe: 'Persönlich: Fitness, Pilates, Trainerin',
    punkte: '~31',
    namensfeld: ['Mirjam | Pilates & Fitness', 'Mirjam Walenta | Fitness Wien', 'Mirjam | Trainerin Wien'],
    bio: `Bewegung, die in einen vollen Arbeitstag passt. So schaffe ich das als Friseurunternehmerin.
Pilates- und Fitnesstrainerin · Functional Strength`,
    hinweis: 'Die erste Bio-Zeile ist ein Vorschlag. Passt sie nicht zu dem, was du zeigst, einfach anpassen lassen.',
    todo: [
      'Namensfeld ändern (eine Variante oben)',
      'Bio ersetzen',
      'Gesichtsfoto statt M-Logo',
      'Waldbilder lösen, 3 Fitness-Beiträge anpinnen',
      'Highlights: Pilates, Übungen, Über mich („Buisness“ ist ein Tippfehler)',
      'Keine Salon-Beiträge mehr in diesem Profil'
    ]
  }
];
