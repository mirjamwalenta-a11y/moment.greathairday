// ════════════════════════════════════════════
// KARUSSELL-FOLIEN ZEICHNEN (1080x1350, Moment-Design)
// ════════════════════════════════════════════
// Zeichnet die Folien eines Karussells auf <canvas>, im selben Design wie
// vorlagen/karussell.html: Beige/Gold/Schwarz, Playfair Display + Inter,
// Unterschrift auf dem Titelbild, Fußzeile mit Seitenzahl.
//
// Datenform (siehe auch instagram-mappe.js):
//   { kontext: 'salon'|'haarnetzwerk',
//     folien: [
//       { typ:'titel',  kicker, titel, unter },
//       { typ:'dunkel', kicker, titel, text },
//       { typ:'punkt',  nr, kicker, titel, text },
//       { typ:'liste',  kicker, titel, punkte:[…] } ] }

const KarussellCanvas = (() => {
  const B = 1080, H = 1350, RAND = 130;
  const F = { bg: '#F5F0EA', black: '#1C1B19', mid: '#5B5750', soft: '#857F76', gold: '#8A7346', goldHell: '#B39A6B', linie: '#E4DCCD', hell: '#FCFAF5', hellText: '#E4DCCD' };
  const SERIF = "'Playfair Display', Georgia, serif";
  const SANS = "Inter, system-ui, sans-serif";
  const bilder = {};

  function bild(src) {
    if (!bilder[src]) bilder[src] = new Promise(ok => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => ok(null);
      i.src = src;
    });
    return bilder[src];
  }

  async function schriftenLaden() {
    if (!document.fonts) return;
    await Promise.all([
      `700 80px ${SERIF}`, `italic 500 50px ${SERIF}`, `400 40px ${SANS}`, `600 34px ${SANS}`
    ].map(f => document.fonts.load(f).catch(() => null)));
  }

  function zeilen(ctx, text, breite) {
    const out = [];
    for (const absatz of String(text || '').split('\n')) {
      let zeile = '';
      for (const wort of absatz.split(/\s+/).filter(Boolean)) {
        const probe = zeile ? zeile + ' ' + wort : wort;
        if (ctx.measureText(probe).width <= breite || !zeile) zeile = probe;
        else { out.push(zeile); zeile = wort; }
      }
      out.push(zeile);
    }
    return out;
  }

  // Ein Textblock: misst nur (zeichnen=false) oder zeichnet ab y.
  function block(ctx, { text, font, groesse, lh, farbe, abstand = 0, sperren = 0, gross = false, breite = B - 2 * RAND }, y, zeichnen) {
    if (!text) return 0;
    ctx.font = font.replace('{g}', groesse + 'px');
    if ('letterSpacing' in ctx) ctx.letterSpacing = sperren ? (groesse * sperren) + 'px' : '0px';
    const t = gross ? String(text).toUpperCase() : text;
    const zs = zeilen(ctx, t, breite);
    const zh = groesse * lh;
    if (zeichnen) {
      ctx.fillStyle = farbe;
      ctx.textBaseline = 'alphabetic';
      zs.forEach((z, i) => ctx.fillText(z, RAND, y + i * zh + groesse * 0.8 + (zh - groesse) / 2));
    }
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    return zs.length * zh + abstand;
  }

  function fuss(ctx, folie, nr, gesamt, kontext, dunkel) {
    ctx.font = `400 32px ${SANS}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.3px';
    ctx.fillStyle = dunkel ? F.goldHell : F.soft;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillText(kontext === 'haarnetzwerk' ? 'Haarnetzwerk' : 'A Great Hair Day · Wien', RAND, H - 80);
    ctx.textAlign = 'right';
    ctx.fillText(`${nr}/${gesamt}`, B - RAND, H - 80);
    ctx.textAlign = 'left';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  }

  // Liefert die Textblöcke einer Folie; s = Verkleinerung, falls zu lang.
  function bloecke(f, s, dunkel) {
    const kicker = { text: f.kicker, font: `600 {g} ${SANS}`, groesse: 34, lh: 1.2, farbe: dunkel ? F.goldHell : F.gold, abstand: 44, sperren: 0.18, gross: true };
    if (f.typ === 'titel') return [
      kicker,
      { text: f.titel, font: `700 {g} ${SERIF}`, groesse: Math.round(118 * s), lh: 1.06, farbe: F.black, abstand: 56 },
      { text: f.unter, font: `italic 500 {g} ${SERIF}`, groesse: Math.round(54 * s), lh: 1.3, farbe: F.gold, abstand: 0 }
    ];
    if (f.typ === 'liste') return [
      kicker,
      { text: f.titel, font: `700 {g} ${SERIF}`, groesse: Math.round(70 * s), lh: 1.12, farbe: F.black, abstand: 30 }
    ];
    return [
      kicker,
      { text: f.titel, font: `700 {g} ${SERIF}`, groesse: Math.round(84 * s), lh: 1.12, farbe: dunkel ? F.hell : F.black, abstand: 56 },
      { text: f.text, font: `400 {g} ${SANS}`, groesse: Math.round(48 * s), lh: 1.45, farbe: dunkel ? F.hellText : F.mid, abstand: 0 }
    ];
  }

  function listeHoehe(ctx, punkte, s, zeichnen, y) {
    let h = 0;
    const gr = Math.round(46 * s), zh = gr * 1.35, pad = 26 * s;
    ctx.font = `400 ${gr}px ${SANS}`;
    (punkte || []).filter(Boolean).forEach((p, i, alle) => {
      const zs = zeilen(ctx, p, B - 2 * RAND - 92);
      const ph = pad * 2 + zs.length * zh;
      if (zeichnen) {
        const y0 = y + h;
        ctx.fillStyle = F.gold;
        ctx.beginPath(); ctx.arc(RAND + 31, y0 + pad + 31, 31, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = `600 34px ${SANS}`; ctx.textAlign = 'center';
        ctx.fillText(String(i + 1), RAND + 31, y0 + pad + 43);
        ctx.textAlign = 'left'; ctx.font = `400 ${gr}px ${SANS}`; ctx.fillStyle = F.black;
        zs.forEach((z, j) => ctx.fillText(z, RAND + 92, y0 + pad + j * zh + gr * 0.8 + (zh - gr) / 2));
        if (i < alle.length - 1) { ctx.fillStyle = F.linie; ctx.fillRect(RAND, y0 + ph - 1, B - 2 * RAND, 2); }
      }
      h += ph;
    });
    return h;
  }

  async function zeichne(canvas, daten, index) {
    await schriftenLaden();
    const folien = daten.folien;
    const f = folien[index];
    const dunkel = f.typ === 'dunkel';
    const ctx = canvas.getContext('2d');
    canvas.width = B; canvas.height = H;
    ctx.fillStyle = dunkel ? F.black : F.bg;
    ctx.fillRect(0, 0, B, H);

    const logo = f.typ === 'titel' ? await bild(daten.kontext === 'haarnetzwerk' ? 'logo-haarnetzwerk.png' : 'logo-name.png') : null;
    const logoB = daten.kontext === 'haarnetzwerk' ? 240 : 520;
    const logoH = logo ? logoB * logo.naturalHeight / logo.naturalWidth : 0;

    // Inhalt so weit verkleinern, bis er zwischen oberen Rand und Fußzeile passt.
    const platz = H - 2 * 160;
    let s = 1, hoehe = 0;
    for (; s > 0.55; s -= 0.05) {
      hoehe = bloecke(f, s, dunkel).reduce((h, b) => h + block(ctx, b, 0, false), 0);
      if (f.typ === 'liste') hoehe += listeHoehe(ctx, f.punkte, s, false, 0);
      if (logo) hoehe += 70 + logoH;
      if (hoehe <= platz) break;
    }
    let y = 160 + Math.max(0, (platz - hoehe) / 2);

    if (f.typ === 'punkt' && f.nr) {
      ctx.font = `400 220px ${SERIF}`;
      ctx.fillStyle = 'rgba(138,115,70,.35)';
      ctx.textAlign = 'right';
      ctx.fillText(String(f.nr), B - 120, 110 + 190);
      ctx.textAlign = 'left';
    }
    for (const b of bloecke(f, s, dunkel)) y += block(ctx, b, y, true);
    if (f.typ === 'liste') y += listeHoehe(ctx, f.punkte, s, true, y);
    if (logo) {
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(logo, RAND - (daten.kontext === 'haarnetzwerk' ? 0 : 30), y + 70, logoB, logoH);
      ctx.globalCompositeOperation = 'source-over';
    }
    fuss(ctx, f, index + 1, folien.length, daten.kontext, dunkel);
    return canvas;
  }

  async function alsDateien(daten, name) {
    const dateien = [];
    for (let i = 0; i < daten.folien.length; i++) {
      const c = await zeichne(document.createElement('canvas'), daten, i);
      const blob = await new Promise(ok => c.toBlob(ok, 'image/png'));
      dateien.push(new File([blob], `${name}-folie-${String(i + 1).padStart(2, '0')}.png`, { type: 'image/png' }));
    }
    return dateien;
  }

  // Bilder direkt aufs Gerät laden, ohne Teilen-Menü. Wichtig für Android:
  // Dort fehlt im Teilen-Menü meist „Bilder speichern“. Die Dateien landen im
  // Ordner „Downloads“; Galerie und Instagram finden sie dort.
  async function herunterladen(dateien) {
    for (const d of dateien) {
      const a = document.createElement('a');
      const url = URL.createObjectURL(d);
      a.href = url; a.download = d.name;
      document.body.appendChild(a); a.click();
      setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1500);
      await new Promise(r => setTimeout(r, 400));
    }
  }

  return { zeichne, alsDateien, herunterladen };
})();
