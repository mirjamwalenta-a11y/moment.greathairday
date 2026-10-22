// ════════════════════════════════════════════
// KI-CHECK, HOOK-PUNKTE & CAPTION-PRÜFUNG
// ════════════════════════════════════════════
// Läuft komplett im Browser, schickt nichts weg. Drei Teile:
//   1. „Klingt das nach KI?“: Floskeln, Strukturmuster, Gedankenstrich-Ketten
//      und unsichtbare Zeichen finden; Floskeln mit einfachem Ersatz auf
//      Knopfdruck aufräumen (Wortliste in ki-check-daten.js).
//   2. Hook-Punkte für die erste Zeile: Länge, konkret, Anfang, Ansprache.
//   3. Caption-Prüfung: was der Feed vor „… mehr“ zeigt, Hashtags, Links,
//      Bitten, Emoji, Suchbegriffe.
// Alles sind Faustregeln, kein Online-KI-Detektor und keine
// Reichweiten-Vorhersage.
//
// Umsetzung der Prüfregeln aus „instagram-agent-skill“ (ig-human, ig-reel,
// ig-caption) in der deutschen Fassung von MakersLab, angepasst an Mirjams
// ruhigen Ton: Die Hook-Prüfung „Einsatz“ (Verlust, Verbot, Geheimnis) und
// der Pluspunkt für Umgangssprache sind bewusst weggelassen.
// MIT License, Copyright (c) 2026 Jake Schincariol; Änderungen und
// Übersetzung © 2026 MakersLab, MIT. Volltext: LIZENZEN-DRITTE.md.

const KiCheck = (() => {
  const W = '[\\p{L}\\p{N}_]';
  const escRx = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const URL_RX = /https?:\/\/\S+|\bwww\.\S+/gi;
  // Adresszeile (📍 …) und Unterschrift setzt die App selbst, die bleiben unberührt.
  const istGeschuetzt = zeile => /^\s*📍/.test(zeile);

  // ── 1. KI-Spuren ──────────────────────────────
  let floskelCache = null;
  function floskeln() {
    if (floskelCache) return floskelCache;
    const liste = (typeof KI_CHECK_DATEN !== 'undefined' ? KI_CHECK_DATEN.floskeln : []);
    // Längste zuerst, damit Wendungen vor Einzelwörtern greifen.
    floskelCache = [...liste].sort((a, b) => b.f.length - a.f.length).map(e => {
      let kern = e.x ? e.f : escRx(e.f).replace(/ /g, '\\s+').replace(/,\\s\+/g, ',?\\s+');
      if (e.b) kern = '(' + kern + ')(e|em|en|er|es)?';
      return { ...e, rx: new RegExp(`(?<!${W})${kern}(?!${W})`, 'giu') };
    });
    return floskelCache;
  }

  function grossKlein(quelle, ersatz) {
    if (!ersatz) return ersatz;
    if (quelle.length > 1 && quelle === quelle.toUpperCase() && quelle !== quelle.toLowerCase()) return ersatz.toUpperCase();
    if (quelle[0] !== quelle[0].toLowerCase()) return ersatz[0].toUpperCase() + ersatz.slice(1);
    return ersatz;
  }

  function strukturen() {
    const liste = (typeof KI_CHECK_DATEN !== 'undefined' ? KI_CHECK_DATEN.strukturen : []);
    return liste.map(s => ({ ...s, rx: new RegExp(s.rx, s.fl) }));
  }

  const cpZeichen = spec => {
    const [a, b] = spec.split('-').map(t => parseInt(t.slice(2), 16));
    return b ? `[\\u{${a.toString(16)}}-\\u{${b.toString(16)}}]` : `\\u{${a.toString(16)}}`;
  };
  function unsichtbarRx() {
    const d = typeof KI_CHECK_DATEN !== 'undefined' ? KI_CHECK_DATEN : { unsichtbar: [], leerzeichen: [] };
    return {
      loeschen: d.unsichtbar.length ? new RegExp(d.unsichtbar.map(cpZeichen).join('|'), 'gu') : null,
      leer: d.leerzeichen.length ? new RegExp(d.leerzeichen.map(cpZeichen).join('|'), 'gu') : null
    };
  }

  // Text ohne Adresszeile, denn die setzt die App, nicht Wörni.
  const pruefText = text => String(text || '').split('\n').filter(z => !istGeschuetzt(z)).join('\n');

  function pruefen(text) {
    const t = pruefText(text).normalize('NFC');
    const gefunden = [];
    let rest = t.replace(URL_RX, ' ');
    for (const e of floskeln()) {
      const treffer = rest.match(e.rx);
      if (!treffer) continue;
      gefunden.push({ wort: e.a || treffer[0], ersatz: e.r, anzahl: treffer.length });
      // Gefundenes ausblenden, damit „Gamechanger“ nicht nochmal einzeln zählt.
      rest = rest.replace(e.rx, ' ');
    }
    const muster = [];
    for (const s of strukturen()) {
      const treffer = t.match(s.rx);
      if (treffer) muster.push({ name: s.name, fix: s.fix, anzahl: treffer.length });
    }
    const sx = unsichtbarRx();
    const unsichtbar = (sx.loeschen ? (t.match(sx.loeschen) || []).length : 0);
    const striche = (t.match(/\s[–—]\s|—/g) || []).length;
    // Gleich lange Sätze: Maschinen schreiben gleichmäßig.
    const saetze = t.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim().split(/\s+/).length).filter(n => n > 2);
    let gleichLang = false;
    if (saetze.length >= 4) {
      const mittel = saetze.reduce((a, b) => a + b, 0) / saetze.length;
      const sd = Math.sqrt(saetze.reduce((a, n) => a + (n - mittel) ** 2, 0) / saetze.length);
      gleichLang = mittel > 0 && sd / mittel < 0.35;
    }
    const stellen = gefunden.length + muster.length + (unsichtbar ? 1 : 0) + (gleichLang ? 1 : 0);
    const aufraeumbar = gefunden.some(g => g.ersatz !== null) || unsichtbar > 0 || striche > 0;
    return { floskeln: gefunden, muster, unsichtbar, striche, gleichLang, stellen, aufraeumbar };
  }

  // Ersetzt Floskeln mit einfachem Ersatz, entfernt unsichtbare Zeichen und
  // macht aus Gedankenstrichen Kommas. Markier-Floskeln und Strukturmuster
  // bleiben stehen, die brauchen Urteilsvermögen.
  function aufraeumen(text) {
    const sx = unsichtbarRx();
    const zeilen = String(text || '').normalize('NFC').split('\n');
    const geschuetzt = [];
    let t = zeilen.map(z => {
      if (!istGeschuetzt(z)) return z;
      geschuetzt.push(z);
      return `\u0000Z${geschuetzt.length - 1}\u0000`;
    }).join('\n');
    const links = [];
    t = t.replace(URL_RX, m => { links.push(m); return `\u0000L${links.length - 1}\u0000`; });

    if (sx.loeschen) t = t.replace(sx.loeschen, '');
    if (sx.leer) t = t.replace(sx.leer, ' ');
    t = t.replace(/\s*—\s*/g, ', ')
      .replace(/(\d)\s*–\s*(?=\d)/g, '$1-')
      .replace(/[ \t]+–[ \t]+/g, ', ')
      .replace(/–/g, '-')
      .replace(/…/g, '...');

    // Nur-markieren-Stellen ausklammern, sonst ersetzt ein kürzerer Eintrag
    // („es ist wichtig zu beachten“) die Hälfte davon und lässt „, dass“ stehen.
    const markiert = [];
    for (const e of floskeln()) {
      if (e.r === null) {
        t = t.replace(e.rx, m => { markiert.push(m); return `\u0000M${markiert.length - 1}\u0000`; });
        continue;
      }
      t = t.replace(e.rx, (...m) => e.b ? grossKlein(m[1], e.r) + (m[2] || '') : grossKlein(m[0], e.r));
    }
    t = t.replace(/\u0000M(\d+)\u0000/g, (m, i) => markiert[i]);
    // Aufräumen nach dem Löschen, sonst bleiben verwaiste Satzzeichen.
    t = t.replace(/[ \t]{2,}/g, ' ')
      .replace(/([.!?])[ \t]+[.!?,;:]+(?=\s|$)/g, '$1')
      .replace(/^[ \t]*(?:[,.;:!?]+[ \t]*)+/gm, '')
      .replace(/^[ \t](?=\S)/gm, '')
      .replace(/[ \t]+([,.;:!?])/g, '$1')
      .replace(/,\s*([,.;:!?])/g, '$1')
      .replace(/,[ \t]*\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n');
    // Satzanfänge wieder groß, falls ein gelöschter Anfang ein kleines Wort freilegte.
    t = t.replace(/(^|[.!?][ \t]+|\n)(\p{Ll})/gu, (m, a, b) => a + b.toUpperCase());

    t = t.replace(/\u0000L(\d+)\u0000/g, (m, i) => links[i]);
    t = t.replace(/\u0000Z(\d+)\u0000/g, (m, i) => geschuetzt[i]);
    return t.trim();
  }

  // ── 2. Hook-Punkte ────────────────────────────
  const TEMPO = 4.5; // Silben pro Sekunde, normales Sprechtempo in Reels
  const ZWEISILBIG = new Set(['ea', 'eo', 'ia', 'io', 'iu', 'oa', 'ua', 'uo', 'ue', 'ui', 'ae', 'oe', 'ao']);
  const woerter = text => String(text).replace(/(?<=\d)[.,](?=\d{3}(?!\d))/g, '').match(/[€$]?\d+(?:[.,]\d+)*(?:\s?(?:%|€))?|[\p{L}]+(?:['’-][\p{L}]+)*/gu) || [];
  function silbenWort(w) {
    w = w.toLowerCase();
    let n = 0;
    for (const m of w.matchAll(/[aeiouyäöü]+/g)) {
      let g = m[0];
      if (g.startsWith('u') && m.index > 0 && w[m.index - 1] === 'q') g = g.slice(1) || 'u';
      n += g.length >= 3 ? g.length - 1 : (g.length === 2 && ZWEISILBIG.has(g) ? 2 : 1);
    }
    return w ? Math.max(n, 1) : 0;
  }
  // Zahlen grob: je Ziffer etwa eine Silbe, das reicht für die Faustregel.
  const silben = text => woerter(text).reduce((s, w) => s + (/\d/.test(w) ? Math.max(2, w.replace(/\D/g, '').length + 1) : silbenWort(w)), 0);

  const MONATE_TAGE = new Set(['januar', 'jänner', 'februar', 'märz', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'dezember', 'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag']);
  const ZAHLWOERTER = /^(?:zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|zwanzig|dreißig|vierzig|fünfzig|hundert|tausend|hälfte|doppelt|zweimal|dreimal)\w*$/;
  const GELD = new Set(['euro', 'cent', 'prozent', 'preis', 'gutschein']);
  // Für den Salon sind Leistungen und Ort das Konkrete, nicht Zahlen allein.
  const FACH = /^(?:balayage|strähnen|foliensträhnen|ansatz|haarschnitt|herrenschnitt|bob|pony|locken|farbe|blond\w*|brünett\w*|tönung|glossing|hochsteckfrisur|brautfrisur|haarverlängerung|lash|brow|make-up|wien|margareten|lehrling\w*|lehrabschluss\w*|zwischenprüfung|meisterprüfung|haarnetzwerk)$/i;
  const SCHWACHE_EINSTIEGE = ['also', 'ok', 'okay', 'hey', 'hi', 'hallo', 'servus', 'grüß', 'leute', 'na', 'so', 'ja', 'willkommen', 'herzlich willkommen', 'heute', 'eigentlich', 'ehrlich gesagt', 'schau mal', 'hör zu', 'ich wollte', 'ich möchte', 'ich will', 'ich zeige', 'einer der', 'eine der', 'es gibt', 'das ist', 'es ist', 'dies ist', 'wenn es um', 'lass uns', 'lasst uns', 'liebe'].map(s => s.split(' '));
  const KERNWORT = /^(?:nie|niemals|nicht|nichts|kein\w*|niemand|falsch\w*|fehler|statt|ohne|bevor|nur|noch|schon|erst\w*|letzt\w*|warum|wieso|was|wie|wer|früher|damals|plötzlich|trotzdem|obwohl)$/i;
  const KO_GRUENDE = [
    [/^\s*(?:hör(?:t)? auf zu scrollen|stopp[,!.]?\s*(?:nicht )?(?:weiter)?scroll|nicht (?:weiter)?scrollen)/i, 'Beginnt mit „Hör auf zu scrollen“. Wer um Aufmerksamkeit bittet, hat sie sich nicht verdient.'],
    [/(?:in diesem (?:video|reel|beitrag)|im heutigen (?:video|reel)|heute zeige? ich (?:dir|euch)|ich zeige? (?:dir|euch) heute)/i, 'Video-Vorrede. Streichen und gleich mit dem Ergebnis anfangen.'],
    [/^\s*(?:hallo|hi|hey|servus|grüß (?:dich|euch|gott)|(?:herzlich )?willkommen|liebe (?:community|leute))/i, 'Begrüßung. Niemand öffnet Instagram, um begrüßt zu werden.'],
    [/(?:^|\s)#[\p{L}\p{N}_]+/u, 'Hashtag in der ersten Zeile. Hashtags gehören, wenn überhaupt, ans Ende.'],
    [/^\s*\p{Extended_Pictographic}/u, 'Emoji als erstes Zeichen. Die erste Zeile verdient einen Satz.']
  ];
  const clamp = n => Math.max(0, Math.min(100, n));
  const klein = w => w.toLowerCase().replace(/['’]/g, '');

  function konkretesIn(text) {
    const w = woerter(text);
    const zahlen = w.filter(x => /\d/.test(x));
    const rest = w.filter(x => !/\d/.test(x)).filter(x => {
      const k = klein(x);
      return MONATE_TAGE.has(k) || ZAHLWOERTER.test(k) || GELD.has(k) || FACH.test(k) || /^[A-ZÄÖÜ]{2,4}$/.test(x) && !['ICH', 'DU', 'WIR', 'UND', 'DER', 'DIE', 'DAS'].includes(x);
    });
    return [...zahlen, ...rest];
  }

  // art: 'reel' = gesprochener Hook (Silben), 'caption' = erste Zeile im Feed (Zeichen)
  function hook(satz, art = 'caption') {
    const text = String(satz || '').normalize('NFC').trim();
    const pruefungen = [];
    // LÄNGE
    const s = silben(text);
    const zeichen = text.length;
    let p;
    if (art === 'reel') {
      p = s >= 6 && s <= 16 ? 100 : s < 6 ? 100 - (6 - s) * 15 : 100 - (s - 16) * 6;
      if (zeichen > 70) p -= 12;
      pruefungen.push({ name: 'Länge', punkte: clamp(p), detail: `${s} Silben, ca. ${(s / TEMPO).toFixed(1).replace('.', ',')} s gesprochen (Ziel: 6 bis 16 Silben)` });
    } else {
      p = zeichen <= 125 ? (zeichen >= 25 ? 100 : 60) : clamp(100 - (zeichen - 125) * 2);
      pruefungen.push({ name: 'Länge', punkte: clamp(p), detail: `${zeichen} Zeichen, ${zeichen <= 125 ? 'ganz sichtbar vor „… mehr“' : 'wird vor „… mehr“ abgeschnitten'}` });
    }
    // KONKRET
    const konkret = konkretesIn(text);
    pruefungen.push({ name: 'Konkret', punkte: konkret.length ? clamp(45 + konkret.length * 30) : 15,
      detail: konkret.length ? `konkret: ${konkret.slice(0, 3).join(', ')}` : 'keine Zahl, kein Name, keine Leistung, kein Ort' });
    // ANFANG
    const w = woerter(text).map(klein);
    let abzug = 0, einstieg = null;
    for (const sw of SCHWACHE_EINSTIEGE) {
      if (sw.every((x, i) => w[i] === x)) { abzug = 30; einstieg = sw.join(' '); break; }
    }
    const konkretKlein = new Set(konkret.map(klein));
    const kern = w.findIndex(x => KERNWORT.test(x) || konkretKlein.has(x) || /\d/.test(x));
    let basis, wo;
    if (kern < 0) { basis = text.includes('?') ? 60 : 30; wo = text.includes('?') ? 'eine Frage, aber kein Kernwort' : 'kein Kernwort im ganzen Satz'; }
    else if (kern <= 3) { basis = 100; wo = `das Wichtige steht vorne (Wort ${kern + 1})`; }
    else if (kern <= 6) { basis = 70; wo = `das Wichtige an Stelle ${kern + 1}, könnte weiter nach vorne`; }
    else { basis = 40; wo = `das Wichtige erst an Stelle ${kern + 1}`; }
    pruefungen.push({ name: 'Anfang', punkte: clamp(basis - abzug), detail: wo + (einstieg ? `; schwacher Einstieg „${einstieg}“` : '') });
    // ANSPRACHE
    const low = text.toLowerCase();
    let ans;
    if (/(?<![\p{L}])(?:du|dich|dir|dein\w*|euch|euer|eure\w*)(?![\p{L}])/u.test(low)) ans = [100, 'spricht die Leser:innen direkt an'];
    else if (/(?<![\p{L}])(?:ich|mich|mir|mein\w*|wir|uns|unser\w*)(?![\p{L}])/u.test(low)) ans = [70, 'Ich- oder Wir-Form, niemand wird angesprochen'];
    else ans = [35, 'dritte Person, niemand im Raum'];
    pruefungen.push({ name: 'Ansprache', punkte: ans[0], detail: ans[1] });

    const ko = KO_GRUENDE.filter(([rx]) => rx.test(text)).map(([, msg]) => msg);
    const punkte = pruefungen.map(x => x.punkte);
    const mittel = punkte.reduce((a, b) => a + b, 0) / punkte.length;
    // Die schwächste Eigenschaft deckelt den Hook: eine reicht zum Weiterwischen.
    const gesamt = clamp(mittel * 0.6 + Math.min(...punkte) * 0.4 - ko.length * 15);
    const urteil = gesamt >= 70 && Math.min(...punkte) >= 55 && !ko.length ? 'stark' : gesamt >= 50 ? 'ok' : 'schwach';
    const schwaechste = pruefungen.reduce((a, b) => (b.punkte < a.punkte ? b : a));
    return { text, gesamt: Math.round(gesamt), urteil, pruefungen, ko, schwaechste };
  }

  // ── 3. Caption-Prüfung ────────────────────────
  const SICHTBAR = 125;      // ungefähr dort schneidet der Feed zu „… mehr“
  const HASHTAG_GRENZE = 5;  // Instagram-Grenze seit Dezember 2025
  const FUELL_TAGS = new Set(['#viral', '#fyp', '#explore', '#explorepage', '#foryou', '#foryoupage', '#trending', '#instagood', '#love', '#follow', '#followme', '#like4like', '#reels', '#reelsinstagram', '#viralreels', '#instadaily', '#fürdich', '#fuerdich', '#instareels', '#trend', '#reelsdeutschland', '#liebe', '#folgen', '#instagram', '#photooftheday']);
  const BITTEN = [
    [/(?:[Kk]ommentier|[Ss]chreib)(?:e|t)?\b[^.!?\n]{0,40}?(?:[„"][^"“”\n]{2,25}["“”]|\b[A-ZÄÖÜ0-9]{3,}\b)/, 'Stichwort kommentieren'],
    [/\b(?:schreib(?:e|t)? (?:mir|uns) (?:eine )?(?:dm|nachricht)|schick(?:e|t)? (?:mir|uns) (?:eine )?(?:dm|nachricht))/i, 'Nachricht schicken'],
    [/\bspeicher(?:e|t)? (?:dir |euch )?(?:das|ihn|es|diese[nrs]?|den beitrag|das reel)\b/i, 'speichern'],
    [/\bteil(?:e|t)? (?:das|ihn|es|diese[nrs]?|den beitrag|das reel)\b/i, 'teilen'],
    [/\bfolg(?:e|t)? (?:mir|uns)\b/i, 'folgen'],
    [/\blink (?:ist |steht )?(?:in|im) (?:meiner |der |unserer )?(?:bio|profil)\b/i, 'Link in der Bio'],
    [/\b(?:ruf(?:t)? (?:uns|mich) an|termin (?:buchen|vereinbaren|ausmachen)|jetzt buchen|komm(?:t)? (?:vorbei|bei uns vorbei)|besuch(?:e|t)? uns)\b/i, 'Termin/vorbeikommen']
  ];

  function caption(text, { hashtags = '', suchbegriffe = [] } = {}) {
    const sauber = pruefText(text).normalize('NFC').trim();
    const ganz = (sauber + (hashtags ? '\n\n' + hashtags : '')).trim();
    const erste = (sauber.split('\n').find(z => z.trim()) || '').trim();
    const fenster = sauber.length > SICHTBAR ? sauber.slice(0, SICHTBAR) : sauber;
    const tags = ganz.match(/(?:^|\s)#[\p{L}\p{N}_]+/gu)?.map(t => t.trim()) || [];
    const fuell = tags.filter(t => FUELL_TAGS.has(t.toLowerCase()));
    const links = sauber.match(URL_RX) || [];
    const emoji = sauber.match(/\p{Extended_Pictographic}/gu) || [];
    const bitten = BITTEN.filter(([rx]) => rx.test(sauber)).map(([, n]) => n);
    const endetMitFrage = /\?\s*$/m.test(sauber.split('\n').filter(z => z.trim()).slice(-3).join('\n'));
    const checks = [];
    const neu = (name, ok, detail) => checks.push({ name, ok, detail });

    if (!erste) neu('Erste Zeile', false, 'leer');
    else if (/^[#@]/.test(erste)) neu('Erste Zeile', false, 'beginnt mit Hashtag oder @, dabei ist das der eine Platz, der einen Satz verdient');
    else if (erste.length > SICHTBAR) neu('Erste Zeile', false, `${erste.length} Zeichen, wird vor „… mehr“ mitten im Satz abgeschnitten`);
    else neu('Erste Zeile', true, `${erste.length} Zeichen, ganz sichtbar`);

    if (tags.length > HASHTAG_GRENZE) neu('Hashtags', false, `${tags.length} Hashtags, Instagram erlaubt höchstens ${HASHTAG_GRENZE}`);
    else if (fuell.length) neu('Hashtags', false, `${fuell.join(', ')} beschreibt nichts, lieber ein Thema`);
    else neu('Hashtags', true, `${tags.length} Hashtag${tags.length === 1 ? '' : 's'}`);

    if (tags.some(t => fenster.includes(t))) neu('Hashtag-Platz', false, 'ein Hashtag steht im sichtbaren Teil und verbraucht dort Platz');

    neu('Links', !links.length, links.length ? 'Links in der Caption sind nicht anklickbar. Lieber Link-Sticker, Bio oder DM' : 'keine toten Links');

    if (bitten.length > 1) neu('Eine Bitte', false, `${bitten.length} Aufforderungen (${bitten.join(', ')}). Zwei Bitten wirken wie keine`);
    else if (bitten.length === 1) neu('Eine Bitte', true, bitten[0]);
    else neu('Eine Bitte', true, endetMitFrage ? 'Schlussfrage, kein Verkaufs-Aufruf' : 'kein Aufruf');

    const dichte = emoji.length * 100 / Math.max(sauber.length, 1);
    neu('Emoji', dichte <= 4, `${emoji.length} Emoji${dichte > 4 ? ', wirkt wie Deko' : ''}`);

    if (suchbegriffe.length) {
      const k = sauber.toLowerCase();
      const da = suchbegriffe.filter(b => k.includes(b.toLowerCase()));
      neu('Suchbegriffe', da.length > 0, da.length ? `gefunden: ${da.join(', ')}` : `kein Suchbegriff im Text (z. B. ${suchbegriffe.slice(0, 2).join(' oder ')})`);
    }
    return { fenster, gekuerzt: sauber.length > SICHTBAR, erste, checks, offen: checks.filter(c => !c.ok).length };
  }

  // ── Anzeige ──────────────────────────────────
  const URTEIL_TEXT = { stark: 'stark', ok: 'ok', schwach: 'schwach' };

  function hookHtml(h, titel) {
    return `<div class="kic-block">
      <div class="kic-titel">${escHtml(titel)} <span class="kic-punkte kic-${h.urteil}">${h.gesamt} · ${URTEIL_TEXT[h.urteil]}</span></div>
      <div class="kic-zitat">„${escHtml(h.text)}“</div>
      ${h.pruefungen.map(p => `<div class="kic-zeile"><span class="kic-balken"><span style="width:${p.punkte}%"></span></span><b>${p.name}</b> ${escHtml(p.detail)}</div>`).join('')}
      ${h.ko.map(k => `<div class="kic-warn">✕ ${escHtml(k)}</div>`).join('')}
      ${h.urteil !== 'stark' && !h.ko.length ? `<div class="kic-tipp">Am schwächsten: ${h.schwaechste.name}. Das zuerst verbessern.</div>` : ''}
    </div>`;
  }

  // Hängt das Prüf-Panel unter einen Text. opts:
  //   art: 'post' | 'reel'          hookText: eigener Hook (z. B. Reel-Overlay)
  //   hashtags: () => String        suchbegriffe: [String]
  //   nachAufraeumen: () => void    (z. B. Zeichenzähler aktualisieren)
  function zeigen(textElId, panelId, opts = {}) {
    const el = document.getElementById(textElId);
    const panel = document.getElementById(panelId);
    if (!el || !panel) return;
    const text = (el.innerText || el.textContent || '').trim();
    if (!text || text === '—') { panel.innerHTML = ''; return; }

    const ki = pruefen(text);
    const cap = caption(text, { hashtags: opts.hashtags ? opts.hashtags() : '', suchbegriffe: opts.suchbegriffe || [] });
    const ersteZeile = hook(cap.erste, 'caption');
    const reelHook = opts.hookText ? hook(opts.hookText, 'reel') : null;
    const offen = ki.stellen + cap.offen;
    const warOffen = panel.querySelector('details')?.open;

    const kiListe = [
      ...ki.floskeln.map(f => `<li><b>„${escHtml(f.wort)}“</b>${f.anzahl > 1 ? ` ×${f.anzahl}` : ''} → ${f.ersatz === null ? 'bitte selbst umformulieren' : f.ersatz === '' ? 'streichen' : `„${escHtml(f.ersatz)}“`}</li>`),
      ...ki.muster.map(m => `<li><b>${escHtml(m.name)}</b><br><span class="kic-fix">${escHtml(m.fix)}</span></li>`),
      ...(ki.striche >= 3 ? [] : ki.striche ? [`<li><b>${ki.striche} Gedankenstrich${ki.striche > 1 ? 'e' : ''}</b><br><span class="kic-fix">Wird beim Aufräumen zum Komma.</span></li>`] : []),
      ...(ki.unsichtbar ? [`<li><b>${ki.unsichtbar} unsichtbare Zeichen</b><br><span class="kic-fix">Kommen von KI-Texten, werden beim Aufräumen entfernt.</span></li>`] : []),
      ...(ki.gleichLang ? ['<li><b>Alle Sätze gleich lang</b><br><span class="kic-fix">Einen Satz teilen, einen anderen länger laufen lassen.</span></li>'] : [])
    ];

    panel.innerHTML = `<details class="kic"${warOffen ? ' open' : ''}>
      <summary>🔍 Klingt das nach KI? <span class="kic-sum ${offen ? 'kic-offen' : 'kic-gut'}">${offen ? offen + (offen === 1 ? ' Stelle ansehen' : ' Stellen ansehen') : 'alles gut'}</span></summary>
      <div class="kic-block">
        <div class="kic-titel">Was der Feed zeigt</div>
        <div class="kic-feed">${escHtml(cap.fenster)}${cap.gekuerzt ? '<span class="kic-mehr"> … mehr</span>' : ''}</div>
      </div>
      ${reelHook ? hookHtml(reelHook, 'Hook im Video') : ''}
      ${cap.erste ? hookHtml(ersteZeile, 'Erste Zeile') : ''}
      <div class="kic-block">
        <div class="kic-titel">Caption</div>
        ${cap.checks.map(c => `<div class="kic-zeile">${c.ok ? '✓' : '⚠️'} <b>${c.name}</b> ${escHtml(c.detail)}</div>`).join('')}
      </div>
      <div class="kic-block">
        <div class="kic-titel">KI-Spuren</div>
        ${kiListe.length ? `<ul class="kic-liste">${kiListe.join('')}</ul>` : '<div class="kic-zeile">✓ keine Floskeln, keine typischen KI-Muster</div>'}
        ${ki.aufraeumbar ? `<button class="btn-ghost-sm kic-btn" type="button">✨ Automatisch aufräumen</button>` : ''}
      </div>
      <div class="kic-hinweis">Faustregeln, im Handy berechnet. Kein KI-Detektor und keine Reichweiten-Garantie.</div>
    </details>`;

    const btn = panel.querySelector('.kic-btn');
    if (btn) btn.onclick = () => {
      el.textContent = aufraeumen(el.innerText || el.textContent);
      if (opts.nachAufraeumen) opts.nachAufraeumen();
      zeigen(textElId, panelId, opts);
    };
    // Bei bearbeitbaren Texten nach dem Tippen neu prüfen.
    if (el.isContentEditable && !el.dataset.kiCheck) {
      el.dataset.kiCheck = '1';
      let warte;
      el.addEventListener('input', () => { clearTimeout(warte); warte = setTimeout(() => zeigen(textElId, panelId, el._kiCheckOpts || {}), 600); });
    }
    el._kiCheckOpts = opts;
  }

  return { pruefen, aufraeumen, hook, caption, zeigen };
})();
