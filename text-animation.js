// ════════════════════════════════════════════
// TEXT-ANIMATIONEN für „Video + Text“ und „Clips & Fotos“
// ════════════════════════════════════════════
// Wie ein Text erscheint: einblenden (Standard), von unten hereinfahren,
// aufploppen oder Wort für Wort. Die Seiten zeichnen den Text selbst und
// holen sich hier nur, wie weit die Animation gerade ist.
// Dazu die Textfarbe „Automatisch“: weiß oder schwarz, je nach Bild dahinter.

const TextAnimation = (() => {
  const NAMEN = { blende: 'Einblenden', hoch: 'Von unten', pop: 'Aufploppen', woerter: 'Wort für Wort' };
  const raus = p => 1 - Math.pow(1 - p, 3);
  // schießt kurz über das Ziel hinaus und federt zurück
  const federnd = p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };

  // seit: Sekunden seit der Text erscheint (Infinity = fertig, z. B. in der angehaltenen Vorschau)
  // → { alpha, dy, skala, woerter (wie viele Wörter schon zu sehen sind) }
  function stand(anim, seit, woerter) {
    const z = { alpha: 1, dy: 0, skala: 1, woerter: Infinity };
    if (!isFinite(seit)) return z;
    seit = Math.max(0, seit);
    const p = dauer => Math.min(1, seit / dauer);
    if (anim === 'hoch') { z.dy = (1 - raus(p(0.45))) * 90; z.alpha = p(0.3); }
    else if (anim === 'pop') { z.skala = 0.6 + 0.4 * federnd(p(0.4)); z.alpha = p(0.12); }
    else if (anim === 'woerter') z.woerter = Math.floor(seit / Math.min(0.25, 1.8 / Math.max(1, woerter))) + 1;
    return z;
  }

  // Verschiebung und Größe um die Mitte des Textblocks (cx, cy)
  function anwenden(ctx, z, cx, cy) {
    if (!z.dy && z.skala === 1) return;
    ctx.translate(cx, cy + z.dy);
    ctx.scale(z.skala, z.skala);
    ctx.translate(-cx, -cy);
  }

  const wortZahl = zeilen => zeilen.reduce((n, z) => n + z.split(' ').length, 0);
  // sichtbarer Anfang einer Zeile, wenn noch `rest` Wörter erscheinen dürfen
  const anfang = (zeile, rest) => { const w = zeile.split(' '); return rest >= w.length ? zeile : rest > 0 ? w.slice(0, rest).join(' ') : ''; };

  // Zeilen zeichnen; bei „Wort für Wort“ stehen die Wörter schon an ihrem
  // endgültigen Platz, damit nichts springt. malen(text, x) zeichnet eine Zeile.
  function zeilenZeichnen(ctx, zs, z, mx, yVon, malen) {
    let rest = z.woerter;
    zs.forEach((zeile, i) => {
      const teil = anfang(zeile, rest);
      rest -= zeile.split(' ').length;
      if (!teil) return;
      if (teil === zeile) { ctx.textAlign = 'center'; malen(zeile, mx, yVon(i)); }
      else { ctx.textAlign = 'left'; malen(teil, mx - ctx.measureText(zeile).width / 2, yVon(i)); }
    });
  }

  // Automatische Textfarbe: Helligkeit hinter dem Text messen (verkleinert auf
  // 16×8 Punkte). Mit Spielraum, damit die Farbe nicht bei jedem Bild hin- und
  // herspringt; nach einem Schnitt auf ein ganz anderes Bild wechselt sie sofort.
  const mess = document.createElement('canvas');
  mess.width = 16; mess.height = 8;
  const messCtx = mess.getContext('2d', { willReadFrequently: true });
  const zuletzt = new WeakMap();
  function autoFarbe(quelle, t, x, y, w, h) {
    if (t.hg === 'hell') return 'schwarz';
    if (t.hg !== 'ohne') return 'weiss';
    x = Math.max(0, x); y = Math.max(0, y);
    w = Math.min(w, quelle.width - x); h = Math.min(h, quelle.height - y);
    let hell = 0;
    try {
      messCtx.drawImage(quelle, x, y, w, h, 0, 0, 16, 8);
      const d = messCtx.getImageData(0, 0, 16, 8).data;
      for (let i = 0; i < d.length; i += 4) hell += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      hell /= 128 * 255;
    } catch (_) {}
    const farbe = zuletzt.get(t) === 'schwarz' ? (hell < 0.48 ? 'weiss' : 'schwarz') : (hell > 0.62 ? 'schwarz' : 'weiss');
    zuletzt.set(t, farbe);
    return farbe;
  }

  return { NAMEN, stand, anwenden, wortZahl, zeilenZeichnen, autoFarbe };
})();
