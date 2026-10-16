// Hashtag-Sets: die eine Stelle für alle festen Hashtags dieser App.
// Genutzt von sprueche.html, haarkompass-post.html, index.html (KI-Regeln und
// Ersatz-Texte) und hashtags.html (Übersicht zum Kopieren).
// Hier ändern → gilt überall. Reine Daten, nichts wird gespeichert oder gesendet.

// Grundset, das an jeden Salon-Post kommt. Bis zum Instagram-Limit von 5
// bleibt Platz für 2 Hashtags zum Thema.
var HT_SALON = '#GreatHairDay #Friseur #Wien';
// Vereins-Posts: keine Salon-Hashtags (Salon und Verein nicht vermischen)
var HT_HAARNETZWERK = '#Haarnetzwerk #Friseurunternehmer #Friseurbranche #Österreich';

// Wie viele Hashtags pro Post sinnvoll sind (Instagram zeigt höchstens 5)
var HT_LIMIT = { instagram: 5, facebook: 2 };

// Ergänzung je Thema (Schlüssel = Spruch-Kategorie in sprueche.html)
var HT_THEMEN = {
  maenner:    '#Herrenschnitt',
  kinder:     '#Kinderhaarschnitt',
  pflege:     '#Haarpflege',
  styling:    '#Haarstyling',
  kopfhaut:   '#Kopfhaut #Kopfhautpflege',
  haartyp:    '#Haarpflege',
  beruf:      '#Friseurhandwerk #Friseurleben',
  team:       '#Team #Friseurteam',
  lehrstelle: '#Lehrstelle #Friseurlehre #Ausbildung',
  stylist:    '#FriseurJob #Jobs #Team'
};

// HaarKompass-Posts: Ergänzung zum Grundset
var HT_HAARKOMPASS = { pflege: '#Haarpflege #HaarKompass', styling: '#Haarstyling' };

// Recruiting-Sets (für die Übersicht; Lehrlings-Posts auf der Startseite nutzen dieselben Begriffe)
var HT_RECRUITING = {
  lehre:     '#lehrstellewien #friseurlehre #lehrlingwien #friseurwien',
  matura:    '#lehrenachmatura #friseurlehre #lehrstellewien',
  quereinstieg: '#quereinstieg #friseurwien #neustart',
  schnuppern: '#schnuppern #lehrstellewien #friseurlehre'
};

// Gruppen für die Übersicht in hashtags.html
var HT_GRUPPEN = [
  { titel: 'Grundsets', sets: [
    { name: 'Salon (kommt an jeden Post)', tags: HT_SALON },
    { name: 'Haarnetzwerk (statt Salon-Set)', tags: HT_HAARNETZWERK }
  ]},
  { titel: 'Themen', sets: [
    { name: 'Männer', tags: HT_THEMEN.maenner },
    { name: 'Kinder', tags: HT_THEMEN.kinder },
    { name: 'Pflege', tags: HT_HAARKOMPASS.pflege },
    { name: 'Styling', tags: HT_THEMEN.styling },
    { name: 'Kopfhaut', tags: HT_THEMEN.kopfhaut },
    { name: 'Beruf', tags: HT_THEMEN.beruf },
    { name: 'Team', tags: HT_THEMEN.team }
  ]},
  { titel: 'Mitarbeiter:innen finden', sets: [
    { name: 'Lehrstelle', tags: HT_THEMEN.lehrstelle },
    { name: 'Lehre in Wien', tags: HT_RECRUITING.lehre },
    { name: 'Lehre nach der Matura', tags: HT_RECRUITING.matura },
    { name: 'Quereinstieg', tags: HT_RECRUITING.quereinstieg },
    { name: 'Schnuppertag', tags: HT_RECRUITING.schnuppern },
    { name: 'Stylist:in gesucht', tags: HT_THEMEN.stylist }
  ]}
];

// Alle Hashtags aus einem Text als Liste
function htListe(text) {
  return String(text || '').match(/#[\p{L}\p{N}_]+/gu) || [];
}

// Mehrere Sets zu einer Zeile verbinden, doppelte (gleich bis auf Groß/Klein) nur einmal
function htVerbinde() {
  var gesehen = {}, aus = [];
  for (var i = 0; i < arguments.length; i++) {
    htListe(arguments[i]).forEach(function (t) {
      var k = t.toLowerCase();
      if (!gesehen[k]) { gesehen[k] = true; aus.push(t); }
    });
  }
  return aus.join(' ');
}

// Wie htVerbinde, aber höchstens `max` Hashtags (die vorderen Sets haben Vorrang)
function htPost(max) {
  var teile = Array.prototype.slice.call(arguments, 1);
  return htListe(htVerbinde.apply(null, teile)).slice(0, max).join(' ');
}
