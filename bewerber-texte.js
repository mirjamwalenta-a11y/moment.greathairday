// Gemeinsame Bewerber-Texte für bewerber-vorlagen.html und recruiting-cockpit.html.
// Gleicher Speicher-Schlüssel wie index.html (Bewerbungs-Link im Mitarbeiter:innen-Screen)
var BEWERBUNG_LINK = (() => { try { return localStorage.getItem('ghd_bewerbungslink'); } catch { return null; } })()
  || 'https://www.greathairday.at/karriere/';
var ADRESSE = 'A great hair day, Rechte Wienzeile 47, 1050 Wien';
var TELEFON = '01 5863130';

// {name}, {datum}, {uhrzeit}, {link} werden aus den Feldern bzw. dem Bewerbungs-Link ersetzt
var ANTWORTEN = [
  { id:'danke', titel:'Danke, ist angekommen', wann:'Sofort nach jeder Bewerbung, für alle',
    text:`Hallo {name},

danke für deine Bewerbung bei A great hair day! Ich habe sie bekommen und melde mich in den nächsten zwei Tagen telefonisch bei dir.

Liebe Grüße
Mirjam` },
  { id:'schnuppern', titel:'Einladung zum Schnuppern', wann:'Lehrlinge',
    text:`Hallo {name},

schön, dass du dich für eine Lehre bei uns interessierst! Magst du zum Schnuppern kommen?

Mein Vorschlag: {datum} um {uhrzeit}
Adresse: ${ADRESSE}

Du musst noch nichts können, wir zeigen dir alles. Bitte mitnehmen: bequeme Schuhe und eine Jause. Wenn du an einem Schultag kommst, frag bitte in deiner Schule nach dem Formular für die Freistellung.

Passt dir der Termin? Wenn deine Eltern Fragen haben, können sie mich gern anrufen: ${TELEFON}

Liebe Grüße
Mirjam` },
  { id:'kennenlernen', titel:'Einladung zum Kennenlernen', wann:'Fachkräfte',
    text:`Hallo {name},

danke für dein Interesse an unserem Team! Ich würde dich gern kennenlernen, ganz unkompliziert bei uns im Salon. Dauert etwa eine halbe Stunde, und du bekommst gleich einen Eindruck von unserem Alltag.

Mein Vorschlag: {datum} um {uhrzeit}
Adresse: ${ADRESSE}

Passt dir das? Sonst schick mir gern einen anderen Termin.

Liebe Grüße
Mirjam` },
  { id:'nachfragen', titel:'Kurz nachfragen', wann:'Wenn nach 3 bis 4 Tagen keine Antwort kam',
    text:`Hallo {name},

ich wollte nur kurz nachfragen, ob meine Nachricht angekommen ist. Hast du noch Interesse? Ein kurzes Ja oder Nein reicht völlig.

Liebe Grüße
Mirjam` },
  { id:'nach-schnuppern', titel:'Schön war\'s – wie geht\'s weiter', wann:'Nach einem guten Schnuppertag',
    text:`Hallo {name},

danke, dass du bei uns warst! Es war richtig schön mit dir, und wir können uns gut vorstellen, dass du deine Lehre bei uns machst.

Als Nächstes würde ich gern mit dir und deinen Eltern sprechen. Wann passt es euch? Ein Infoblatt für deine Eltern schicke ich dir gleich mit.

Liebe Grüße
Mirjam` },
  { id:'absage', titel:'Freundliche Absage', wann:'Wenn es diesmal nicht passt',
    text:`Hallo {name},

danke für dein Interesse und deine Zeit. Wir haben uns diesmal für eine andere Person entschieden. Das war keine leichte Entscheidung.

Ich wünsche dir für deinen weiteren Weg alles Gute. Wenn du magst, melde ich mich, falls wieder etwas frei wird.

Liebe Grüße
Mirjam` },
];

