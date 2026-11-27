// Jahresplan: wiederkehrende Anlässe für Aktionen.
// Genutzt von index.html (Heute-Empfehlung rechtzeitig vorher) und jahresplan.html (Übersicht fürs ganze Jahr).
// Keine Kundendaten: gespeichert wird nur, welche Anlässe in welchem Jahr erledigt/weggeklickt sind (lokal im Browser).
// datum(jahr) → Date des Anlasses; vorlauf = ab so vielen Tagen vorher erinnern;
// id = Aktions-Vorlage in sprueche.html (?aktion=id); symbol = goldenes Symbol aus aktion-symbole.js
const SAISON_KEY = 'ghd_saison_erledigt_v1';
function nterSonntag(jahr, monat, n) {           // z. B. Muttertag = 2. Sonntag im Mai
  const d = new Date(jahr, monat, 1);
  d.setDate(1 + ((7 - d.getDay()) % 7) + (n - 1) * 7);
  return d;
}
function blackFriday(jahr) {                     // Freitag nach dem 4. Donnerstag im November
  const d = new Date(jahr, 10, 1);
  d.setDate(1 + ((11 - d.getDay()) % 7) + 21 + 1);
  return d;
}
function ostersonntag(jahr) {                   // Gauß'sche Osterformel (gregorianisch)
  const a = jahr % 19, b = Math.floor(jahr / 100), c = jahr % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monat = Math.floor((h + l - 7 * m + 114) / 31), tag = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(jahr, monat - 1, tag);
}
function ersterMontag(jahr, monat) {             // Schulstart Wien = 1. Montag im September
  const d = new Date(jahr, monat, 1);
  d.setDate(1 + ((8 - d.getDay()) % 7));
  return d;
}
const SAISON_ANLAESSE = [
  { id:'valentinstag', name:'Valentinstag', symbol:'herz', titel:'Valentinstags-Gutschein vorbereiten', datum: j => new Date(j, 1, 14), vorlauf: 21, warum:'Gutscheine sind ein beliebtes Geschenk. Wer jetzt davon erfährt, denkt rechtzeitig an euch.' },
  { id:'fruehling', name:'Frühlingsbeginn', symbol:'blume', titel:'Frühlings-Aktion vorbereiten', datum: j => new Date(j, 2, 20), vorlauf: 21, warum:'Im Frühling wollen viele eine Veränderung. Jetzt ist ein guter Zeitpunkt für Farbe und Strähnen.' },
  { id:'ostern', name:'Ostern', symbol:'hase', titel:'Oster-Aktion vorbereiten', datum: j => ostersonntag(j), vorlauf: 21, warum:'Vor Ostern wollen viele frisch ins Frühjahr starten, und Gutscheine sind ein beliebtes Geschenk fürs Osternest.' },
  { id:'hochzeit', name:'Beginn der Hochzeitssaison', symbol:'ringe', titel:'Brautstyling zeigen', datum: j => new Date(j, 4, 1), vorlauf: 30, warum:'Brautpaare planen früh. Wer jetzt sieht, dass ihr Brautstyling macht, bucht rechtzeitig einen Probetermin.' },
  { id:'muttertag', name:'Muttertag', symbol:'blume', titel:'Muttertags-Gutschein vorbereiten', datum: j => nterSonntag(j, 4, 2), vorlauf: 21, warum:'Ein Gutschein ist ein schönes Geschenk. Mit Vorlauf haben alle Zeit, ihn zu besorgen.' },
  { id:'sommer', name:'Sommerbeginn', symbol:'sonne', titel:'Sommer-Aktion vorbereiten', datum: j => new Date(j, 5, 21), vorlauf: 21, warum:'Sonne und Salzwasser strapazieren das Haar. Jetzt passt der Hinweis auf Sommerpflege.' },
  { id:'schulstart', name:'Schulstart', symbol:'stift', titel:'Kinderhaarschnitte zum Schulstart zeigen', datum: j => ersterMontag(j, 8), vorlauf: 21, warum:'Vor Schulbeginn wollen viele Familien noch einen Termin für die Kinder.' },
  { id:'herbst', name:'Herbstbeginn', symbol:'blatt', titel:'Herbst-Aktion vorbereiten', datum: j => new Date(j, 8, 23), vorlauf: 21, warum:'Nach dem Sommer braucht das Haar Pflege. Ein guter Moment für eine Herbst-Aktion.' },
  { id:'halloween', name:'Halloween', symbol:'kuerbis', titel:'Halloween-Post vorbereiten', datum: j => new Date(j, 9, 31), vorlauf: 14, warum:'Rund um Halloween ist ein augenzwinkernder Post ein guter Anlass, an Herbst-Termine zu erinnern.' },
  { id:'blackfriday', name:'Black Friday', symbol:'preisschild', titel:'Black-Friday-Aktion vorbereiten', datum: j => blackFriday(j), vorlauf: 14, warum:'Rund um Black Friday suchen viele nach Angeboten, und die ersten Weihnachtsgeschenke werden gekauft. Ein guter Moment für Pflege-Sets und Gutscheine.' },
  { id:'nikolaus', name:'Nikolaus', symbol:'stiefel', titel:'Nikolaus-Gutscheine zeigen', datum: j => new Date(j, 11, 6), vorlauf: 14, warum:'Ein Gutschein oder Pflege-Set passt gut in den Nikolausstiefel. Jetzt ist Zeit, daran zu erinnern.' },
  { id:'weihnachten', name:'Weihnachten', symbol:'tannenbaum', titel:'Weihnachts-Gutscheine vorbereiten', datum: j => new Date(j, 11, 24), vorlauf: 35, warum:'Gutscheine und Pflege-Sets werden früh gekauft. Jetzt daran erinnern, dass es sie bei euch gibt.' },
  { id:'ballsaison', name:'Silvester & Ballsaison', symbol:'sekt', titel:'Frisuren für Silvester und Ball zeigen', datum: j => new Date(j, 11, 31), vorlauf: 35, warum:'Für Silvester und die Wiener Ballsaison werden Aufsteck- und Styling-Termine früh gebucht.' },
  { id:'winter', name:'Mitte Jänner', symbol:'schneeflocke', titel:'Winter-Pflege zeigen', datum: j => new Date(j, 0, 15), vorlauf: 14, warum:'Im Jänner macht die Heizungsluft das Haar trocken. Passende Pflege ist jetzt ein Thema.' },
];
function ladeSaisonErledigt() {
  try { return JSON.parse(localStorage.getItem(SAISON_KEY)) || []; } catch { return []; }
}
function merkeSaisonErledigt(schluessel) {
  try { localStorage.setItem(SAISON_KEY, JSON.stringify([...ladeSaisonErledigt(), schluessel].slice(-60))); } catch {}
}
