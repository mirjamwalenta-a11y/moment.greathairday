// ════════════════════════════════════════════
// UNTERTITEL für „Video + Text“ und „Clips & Fotos“
// ════════════════════════════════════════════
// Der gesprochene Text wird eingefügt, in kurze Zeilen geteilt und nach
// Länge über den gesprochenen Teil verteilt. „Mittippen“: Das Video läuft
// von vorn, bei jeder neuen Zeile tippt man einmal, am Schluss noch einmal
// für das Ende der letzten Zeile. So sitzen die Zeiten genau.
// Bewusst keine automatische Spracherkennung: die würde den Ton an einen
// fremden Dienst schicken.
//
// Die Seite liefert Zeichnen, Abspielen und Zeiten (Zeit = Sekunde im
// fertigen Video). Das Untertitel-Objekt hat Stil und Position wie ein
// Text im Bild (schrift, hg, farbe, groesse, x, y); `text` setzt die Seite
// beim Zeichnen auf die aktuelle Zeile, gehört also nicht zum Stand.

const Untertitel = (() => {
  const MAX_ZEICHEN = 32;
  const runden = x => Math.round(x * 10) / 10;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = s => { s = Math.max(0, s); const m = Math.floor(s / 60); return `${m}:${(s - m * 60).toFixed(1).padStart(4, '0')}`; };
  const AUSSEHEN = { ohne: 'Weiß mit Rand', dunkel: 'Dunkler Kasten', hell: 'Heller Kasten' };

  function leer(positionen, mitte) {
    return { roh: '', zeilen: [], schrift: 'sans', hg: 'ohne', farbe: 'auto', groesse: 'm', x: mitte, y: positionen.unten };
  }

  // Erst in Stücke an Satzenden teilen (an Komma o. Ä. erst ab etwa halber
  // Länge), zu lange Stücke dann in etwa gleich lange Zeilen, damit kein
  // einzelnes Wort allein übrig bleibt. Eigene Zeilenumbrüche im Text bleiben.
  function aufteilen(roh) {
    const out = [];
    for (const absatz of String(roh || '').split(/\n+/)) {
      let stueck = [];
      for (const w of absatz.split(/\s+/).filter(Boolean)) {
        stueck.push(w);
        if (/[.!?…]["“”»«]?$/.test(w) || (/[,;:–]$/.test(w) && stueck.join(' ').length >= MAX_ZEICHEN / 2)) {
          out.push(...ausgleichen(stueck));
          stueck = [];
        }
      }
      if (stueck.length) out.push(...ausgleichen(stueck));
    }
    return out;
  }
  function ausgleichen(woerter) {
    const laenge = woerter.join(' ').length, n = Math.ceil(laenge / MAX_ZEICHEN), ziel = laenge / n;
    const out = [];
    let z = '';
    for (const w of woerter) {
      const mit = z ? z + ' ' + w : w;
      // umbrechen, wenn die Zeile ohne das Wort näher an der Ziellänge ist (oder sonst zu lang würde)
      if (z && (mit.length > MAX_ZEICHEN || (out.length < n - 1 && mit.length > ziel && ziel - z.length < mit.length - ziel))) {
        out.push(z);
        z = w;
      } else z = mit;
    }
    if (z) out.push(z);
    return out;
  }

  // nach Länge verteilen: längere Zeilen stehen länger
  function verteilen(texte, von, bis) {
    const gewicht = texte.map(t => t.length + 6), summe = gewicht.reduce((a, b) => a + b, 0);
    let t = von;
    return texte.map((text, i) => {
      const d = (bis - von) * gewicht[i] / summe;
      const z = { text, von: runden(t), bis: runden(t + d) };
      t += d;
      return z;
    });
  }

  const zeileBei = (ut, t) => ut.zeilen.find(z => t >= z.von && t < z.bis)?.text || null;

  // o: { karte, tippKnopf, ut(), bereich() → [von, bis], jetzt(), abspielenVonAnfang(),
  //      springen(t), zeichnen(), geaendert(), positionen: { unten, mitte }, mitte, erklaerung }
  function einrichten(o) {
    const k = o.karte;
    const chips = (feld, auswahl) => `<div class="chips" data-ut="${feld}">${Object.entries(auswahl).map(([w, n]) =>
      `<button data-wert="${w}">${n}</button>`).join('')}</div>`;
    k.innerHTML = `
      <div class="label">Untertitel</div>
      <p class="klein">${o.erklaerung}</p>
      <textarea class="eingabe" rows="4" data-ut="roh" placeholder="Dein gesprochener Text, z. B. dein Reel-Skript" aria-label="Gesprochener Text"></textarea>
      <button class="btn" data-ut="aufteilen">✂ In Zeilen aufteilen und verteilen</button>
      <div class="gruppe" data-ut="mehr" hidden>
        <div class="feld"><span class="feld-name">Aussehen</span>${chips('hg', AUSSEHEN)}</div>
        <div class="feld"><span class="feld-name">Position (oder in der Vorschau verschieben)</span>${chips('pos', { unten: 'Unten', mitte: 'Mitte' })}</div>
        <button class="btn haupt" data-ut="tippen">🎯 Zeiten mittippen</button>
        <p class="klein">Das Video läuft von vorn. Tippe unten auf den großen Knopf, sobald die nächste Zeile gesprochen wird, und am Schluss noch einmal, wenn die letzte Zeile zu Ende ist. Mit ❚❚ hörst du auf, der Rest wird dann verteilt.</p>
        <div class="ut-liste" data-ut="liste"></div>
        <button class="entfernen" data-ut="weg">Untertitel entfernen</button>
      </div>`;
    const el = name => k.querySelector(`[data-ut="${name}"]`);
    let tippen = null; // { zeiten: [] } während „Mittippen“

    function anzeigen() {
      const ut = o.ut();
      if (document.activeElement !== el('roh')) el('roh').value = ut.roh;
      el('mehr').hidden = !ut.zeilen.length;
      for (const x of el('hg').children) x.setAttribute('aria-pressed', x.dataset.wert === ut.hg);
      const pos = Object.keys(o.positionen).find(p => o.positionen[p] === ut.y && ut.x === o.mitte);
      for (const x of el('pos').children) x.setAttribute('aria-pressed', x.dataset.wert === pos);
      el('liste').innerHTML = ut.zeilen.map((z, i) => `
        <div class="ut-zeile">
          <button class="btn" data-zeit="${i}" aria-label="Zu Zeile ${i + 1} springen">${fmt(z.von)}</button>
          <input class="eingabe" data-zeile="${i}" value="${esc(z.text)}" aria-label="Zeile ${i + 1}">
        </div>`).join('');
    }

    el('roh').addEventListener('input', e => { o.ut().roh = e.target.value; });
    k.addEventListener('input', e => {
      const i = e.target.dataset.zeile;
      if (i == null) return;
      o.ut().zeilen[Number(i)].text = e.target.value;
      o.zeichnen();
    });
    k.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      const ut = o.ut(), feld = b.closest('[data-ut]')?.dataset.ut;
      if (b.dataset.zeit != null) return o.springen(ut.zeilen[Number(b.dataset.zeit)].von + 0.05);
      if (feld === 'aufteilen') {
        const [von, bis] = o.bereich();
        ut.zeilen = verteilen(aufteilen(ut.roh), von, bis);
        if (!ut.zeilen.length) alert('Füg zuerst oben den Text ein, den du sprichst.');
      } else if (feld === 'hg') {
        ut.hg = b.dataset.wert;
        ut.farbe = ut.hg === 'hell' ? 'schwarz' : ut.hg === 'ohne' ? 'auto' : 'weiss';
      } else if (feld === 'pos') {
        Object.assign(ut, { x: o.mitte, y: o.positionen[b.dataset.wert] });
      } else if (feld === 'weg') {
        ut.zeilen = [];
      } else if (feld === 'tippen') {
        return mittippen();
      } else return;
      anzeigen();
      o.zeichnen();
    });

    // ── Mittippen ──
    function knopfText() {
      const z = o.ut().zeilen, i = tippen.zeiten.length;
      const kurz = s => s.length > 34 ? s.slice(0, 32) + ' …' : s;
      o.tippKnopf.textContent = i < z.length ? `👆 Zeile ${i + 1}/${z.length} beginnt: „${kurz(z[i].text)}“`
        : i === z.length ? '👆 Letzte Zeile ist zu Ende' : '✓ Fertig, das Video läuft noch zu Ende';
    }
    o.tippKnopf.addEventListener('click', () => {
      if (!tippen || tippen.zeiten.length > o.ut().zeilen.length) return;
      tippen.zeiten.push(o.jetzt());
      knopfText();
    });

    async function mittippen() {
      if (tippen || !o.ut().zeilen.length) return;
      tippen = { zeiten: [] };
      knopfText();
      o.tippKnopf.hidden = false;
      await o.abspielenVonAnfang();
      const { zeiten } = tippen;
      tippen = null;
      o.tippKnopf.hidden = true;
      const z = o.ut().zeilen, n = z.length, kAnz = Math.min(zeiten.length, n);
      if (!kAnz) return o.zeichnen();
      for (let i = 0; i < kAnz - 1; i++) Object.assign(z[i], { von: runden(zeiten[i]), bis: runden(zeiten[i + 1]) });
      if (kAnz === n && zeiten.length > n) Object.assign(z[n - 1], { von: runden(zeiten[n - 1]), bis: runden(Math.max(zeiten[n], zeiten[n - 1] + 0.3)) });
      else {
        // nicht getippte Zeilen ab der letzten getippten bis zum Ende verteilen
        const von = zeiten[kAnz - 1], bis = Math.max(o.bereich()[1], von + 0.5 * (n - kAnz + 1));
        verteilen(z.slice(kAnz - 1).map(x => x.text), von, bis).forEach((x, j) => Object.assign(z[kAnz - 1 + j], x));
      }
      anzeigen();
      o.zeichnen();
      o.geaendert();
    }

    // Während „Mittippen“ zeigt die Vorschau die zuletzt getippte Zeile
    function zeileJetzt(t) {
      const ut = o.ut();
      if (tippen) return ut.zeilen[Math.min(tippen.zeiten.length, ut.zeilen.length + 1) - 1]?.text || null;
      return zeileBei(ut, t);
    }

    anzeigen();
    return { anzeigen, zeileJetzt };
  }

  // für den Stand: ohne die gerade gezeichnete Zeile
  const furStand = ut => { const { text, ...rest } = ut; return JSON.parse(JSON.stringify(rest)); };

  return { leer, aufteilen, verteilen, einrichten, furStand, AUSSEHEN };
})();
