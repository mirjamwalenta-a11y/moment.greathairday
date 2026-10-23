// ════════════════════════════════════════════
// EIGENE SÄTZE (gemeinsam für index.html und sprueche.html)
// ════════════════════════════════════════════
// Die Sätze, die Mirjam unter „Vorlagen“ bearbeitet. Gespeichert wird nur
// auf dem Gerät (localStorage „ghd_sprueche“); ohne eigene Liste gelten diese.
const EIGENE_SAETZE_STANDARD = [
  {val:'s0', label:'Bei uns musst du dich nicht erklären.'},
  {val:'s1', label:'Vertrauen wächst still. Seit über 30 Jahren.'},
  {val:'s2', label:'Schneide die Vergangenheit ab. Entdecke deinen neuen Stil.'},
  {val:'s3', label:'Wer aufhört zu lernen, hört auf zu wachsen.'},
  {val:'s4', label:'Qualität ist keine Entscheidung. Sie ist eine Haltung.'},
  {val:'s5', label:'Äußeres und inneres Wohlbefinden gehören zusammen.'},
  {val:'s6', label:'Eine Stunde bei uns — und du gehst anders raus.'},
  {val:'s7', label:'Manche Kund:innen kommen seit 30 Jahren. Das sagt mehr als jede Werbung.'},
];

function eigeneSaetzeLaden() {
  try { return JSON.parse(localStorage.getItem('ghd_sprueche')) || EIGENE_SAETZE_STANDARD; }
  catch (_) { return EIGENE_SAETZE_STANDARD; }
}
