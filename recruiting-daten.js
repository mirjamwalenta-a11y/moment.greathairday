// Recruiting-Cockpit: Daten und Regeln.
// Genutzt von recruiting-cockpit.html und index.html (Hinweis auf der Startseite).
// Alles bleibt nur in diesem Browser (localStorage) — keine Übertragung an einen Server.

var RC_KEYS = {
  aufgaben: 'ghd_rc_aufgaben',     // { [aufgabenId]: { erledigt:'YYYY-MM-DD', spaeter:'YYYY-MM-DD' } }
  bewerber: 'ghd_rc_bewerber',     // [{ id, name, tel, rolle, quelle, notiz, status, erstellt, statusSeit }]
  kontakte: 'ghd_rc_kontakte'      // [{ id, art, name, tel, link, notiz, zuletzt }]
};

// Feste Aufgaben mit Rhythmus (Tage) und optionaler Saison (Monate 1–12).
// prio: kleiner = wichtiger. Pro Woche werden höchstens RC_PRO_WOCHE fällige Aufgaben gezeigt.
var RC_PRO_WOCHE = 4;
var RC_AUFGABEN = [
  { id:'post-woche', prio:1, intervall:7,
    titel:'Recruiting-Post dieser Woche',
    text:'Eine Idee aus „Ideen für Social Media“ auswählen, Foto dazu, posten. Danach in der Story teilen.',
    link:{ label:'Idee aussuchen', href:'index.html?zeige=recruiting' } },
  { id:'ams-stelle', prio:2, intervall:28,
    titel:'AMS: Stelle melden oder erneuern',
    text:'Stylist:in und Lehrstelle beim AMS melden (eJob-Room bzw. Lehrstellenbörse oder über deine AMS-Betreuung). Inserate laufen ab — alle 4 Wochen prüfen. Gehaltsangabe laut KV nicht vergessen.',
    link:{ label:'AMS öffnen', href:'https://www.ams.at' } },
  { id:'schule', prio:2, intervall:14, saison:[9,10,11,1,2,3],
    titel:'Eine Schule anrufen oder anschreiben',
    text:'Eine Mittelschule oder Polytechnische Schule in der Nähe: Schnuppertage anbieten. Danach unter Kontakte „Heute gemeldet“ tippen.',
    link:{ label:'E-Mail-Vorlage', href:'bewerber-vorlagen.html#schulen' } },
  { id:'team-fragen', prio:3, intervall:30,
    titel:'Team fragen: Kennt ihr jemanden?',
    text:'Die meisten guten Leute kommen über Empfehlungen. Diese Nachricht in die Team-Gruppe schicken:',
    kopieren:'Hallo ihr Lieben! Wir suchen weiter Verstärkung: einen Lehrling und gern auch eine:n Friseur:in. Kennt ihr jemanden — in der Familie, im Freundeskreis, bei den Kund:innen? Teilt gern unseren letzten Post in eurer Story. Danke! Mirjam' },
  { id:'facebook', prio:3, intervall:14,
    titel:'In einer lokalen Facebook-Gruppe posten',
    text:'Z. B. eine Margareten- oder Wien-Jobgruppe. Vorher die Gruppenregeln lesen. Gut geeignet: „Wir suchen unseren nächsten Lehrling“ oder „Quereinstieg“.',
    link:{ label:'Text holen', href:'index.html?zeige=recruiting' } },
  { id:'google', prio:3, intervall:14,
    titel:'Google-Beitrag „Wir stellen ein“',
    text:'Im Google-Unternehmensprofil einen Beitrag mit Foto und Bewerbungs-Link veröffentlichen. Viele suchen direkt nach „Friseur Lehrstelle Wien“.' },
  { id:'fruehere', prio:4, intervall:90, nurWenn:'absagen',
    titel:'Frühere Bewerber:innen noch einmal anschreiben',
    text:'Wer damals nicht gepasst hat oder abgesagt hat, ist heute vielleicht bereit. Unter Bewerber:innen „Absage“ durchschauen.',
    link:{ label:'Bewerber:innen', href:'#bewerber' } },
  { id:'ams-erwachsene', prio:4, intervall:90,
    titel:'AMS-Betreuung fragen: Erwachsene für eine Lehre?',
    text:'Nach Personen fragen, die umschulen oder als Erwachsene eine Lehre machen möchten, und nach möglichen Förderungen für deinen Betrieb.' },
  { id:'aushang', prio:5, intervall:60,
    titel:'Aushang im Schaufenster erneuern',
    text:'Ein A4-Aushang mit QR-Code zur Bewerbung. Nach ein paar Wochen sieht man ihn nicht mehr — Spruch und Farbe wechseln.',
    link:{ label:'Aushang gestalten', href:'sprueche.html' } },
  { id:'innung', prio:5, intervall:120,
    titel:'Innung oder Berufsschule fragen',
    text:'Gibt es Lehrlinge, die ihren Lehrbetrieb wechseln möchten? Bei der Innung und der Berufsschule kurz nachfragen und deine Lehrstelle bekannt machen.' },
  { id:'profil', prio:5, intervall:90,
    titel:'Instagram-Bio und Highlight „Karriere“ prüfen',
    text:'Steht der Bewerbungs-Link in der Bio? Gibt es ein Highlight mit Team, Schnuppertag und Gehalt? Ist der angeheftete Post noch aktuell?' }
];

var RC_STATUS = [
  { id:'neu',        label:'Neu',              farbe:'#a13a3a' },
  { id:'kontaktiert',label:'Gemeldet',         farbe:'#8A7346' },
  { id:'termin',     label:'Schnuppern / Gespräch', farbe:'#2E5D4B' },
  { id:'zusage',     label:'Zusage',           farbe:'#2E5D4B' },
  { id:'absage',     label:'Absage',           farbe:'#5B5750' }
];

var RC_ROLLEN = ['Lehrling', 'Schnuppern', 'Friseur:in', 'Quereinstieg'];
var RC_QUELLEN = ['Instagram', 'TikTok', 'Facebook', 'Google', 'Empfehlung', 'Schule', 'AMS', 'Aushang', 'Formular', 'Anderes'];
var RC_KONTAKT_ARTEN = [
  { id:'schule',   label:'Schule',              intervall:120 },
  { id:'ams',      label:'AMS',                 intervall:60 },
  { id:'innung',   label:'Innung / Berufsschule', intervall:120 },
  { id:'gruppe',   label:'Facebook-Gruppe',     intervall:30 },
  { id:'person',   label:'Person / Netzwerk',   intervall:90 },
  { id:'sonstiges',label:'Sonstiges',           intervall:90 }
];

// Absagen werden nach dieser Zeit zum Löschen vorgeschlagen (wie im Datenschutz-Text des Formulars)
var RC_LOESCHEN_NACH_TAGEN = 180;

function rcLade(key, leer) {
  try { return JSON.parse(localStorage.getItem(RC_KEYS[key])) || leer; } catch { return leer; }
}
function rcSpeichere(key, wert) {
  try { localStorage.setItem(RC_KEYS[key], JSON.stringify(wert)); } catch {}
}

function rcHeute() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function rcTageSeit(datum) {
  if (!datum) return Infinity;
  const [j, m, t] = datum.split('-').map(Number);
  const a = new Date(j, m - 1, t), h = new Date();
  h.setHours(0, 0, 0, 0);
  return Math.round((h - a) / 86400000);
}
function rcPlusTage(tage) {
  const d = new Date(); d.setDate(d.getDate() + tage);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// Fällige Aufgaben, nach Wichtigkeit sortiert
function rcFaelligeAufgaben() {
  const stand = rcLade('aufgaben', {});
  const monat = new Date().getMonth() + 1;
  const heute = rcHeute();
  const hatAbsagen = rcLade('bewerber', []).some(b => b.status === 'absage');
  return RC_AUFGABEN.filter(a => {
    if (a.saison && !a.saison.includes(monat)) return false;
    if (a.nurWenn === 'absagen' && !hatAbsagen) return false;
    const s = stand[a.id] || {};
    if (s.spaeter && s.spaeter > heute) return false;
    return rcTageSeit(s.erledigt) >= a.intervall;
  }).sort((x, y) => x.prio - y.prio);
}

// Montag der laufenden Woche als YYYY-MM-DD
function rcWochenStart() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// Wochenplan: höchstens RC_PRO_WOCHE Aufgaben pro Woche (Mo–So), erledigte zählen mit.
// Sind alle erledigt, ist die Woche geschafft; neue kommen ab Montag.
function rcWochenAufgaben() {
  const stand = rcLade('aufgaben', {});
  const montag = rcWochenStart();
  const erledigt = RC_AUFGABEN.filter(a => ((stand[a.id] || {}).erledigt || '') >= montag);
  const faellig = rcFaelligeAufgaben();
  const plaetze = Math.max(0, RC_PRO_WOCHE - erledigt.length);
  return { erledigt, offen: faellig.slice(0, plaetze), weitere: Math.max(0, faellig.length - plaetze) };
}

// Hinweis-Stufe für eine Bewerberin / einen Bewerber: null | { stufe:'rot'|'gelb', text }
function rcBewerberHinweis(b) {
  const tage = rcTageSeit(b.statusSeit);
  if (b.status === 'neu') {
    if (tage >= 1) return { stufe:'rot', text: tage === 1 ? 'Wartet seit gestern auf Antwort' : `Wartet seit ${tage} Tagen auf Antwort` };
    return { stufe:'gelb', text:'Heute noch melden' };
  }
  if (b.status === 'kontaktiert' && tage >= 4) return { stufe:'gelb', text:`Seit ${tage} Tagen keine Rückmeldung — nachfragen?` };
  if (b.status === 'termin' && tage >= 7) return { stufe:'gelb', text:'Wie war\'s? Rückmeldung geben' };
  return null;
}

// Aufgabe von außen als erledigt markieren (z. B. Recruiting-Post in Moment als „Gepostet“ markiert)
function rcAufgabeErledigen(id) {
  const stand = rcLade('aufgaben', {});
  const heute = rcHeute();
  if ((stand[id] || {}).erledigt === heute) return;
  stand[id] = { ...(stand[id] || {}), vorher: (stand[id] || {}).erledigt || null, erledigt: heute };
  rcSpeichere('aufgaben', stand);
}

function rcAufgabeDieseWocheErledigt(id) {
  return (((rcLade('aufgaben', {})[id]) || {}).erledigt || '') >= rcWochenStart();
}

// Kurzfassung für die Startseite
function rcZusammenfassung() {
  const bewerber = rcLade('bewerber', []);
  return {
    aufgaben: rcWochenAufgaben().offen.length,
    warten: bewerber.filter(b => { const h = rcBewerberHinweis(b); return h && h.stufe === 'rot'; }).length
  };
}

// Telefonnummer für WhatsApp-Links: 0664 … → 43664 …
function rcWaNummer(tel) {
  let n = String(tel || '').replace(/[^\d+]/g, '');
  if (n.startsWith('+')) n = n.slice(1);
  else if (n.startsWith('00')) n = n.slice(2);
  else if (n.startsWith('0')) n = '43' + n.slice(1);
  return n;
}
