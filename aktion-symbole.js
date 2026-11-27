// Goldene Symbole für Aktionen (Strichzeichnung im 24×24-Raster).
// Genutzt von sprueche.html (im Bild) und jahresplan.html (in der Übersicht).
// emoji = nur für die Knöpfe in der Auswahl; zeichne(ctx) zeichnet im 24er-Raster, Strich und Füllung setzt drawSymbol
const SYMBOLE = {
  tannenbaum:   { name:'Tannenbaum', emoji:'🎄', zeichne: c => {
    c.stroke(new Path2D('M12 3.5L7.5 9.5H10L5.5 15H8.5L4 20.5H20L15.5 15H18.5L14 9.5H16.5Z M12 20.5V23'));
    stern(c, 12, 1.6, 1.6, 0.7); } },
  stern:        { name:'Stern', emoji:'⭐', zeichne: c => stern(c, 12, 12.6, 9.5, 4) },
  schneeflocke: { name:'Schneeflocke', emoji:'❄️', zeichne: c => {
    for (let i = 0; i < 6; i++) {
      c.save(); c.translate(12, 12); c.rotate(i * Math.PI / 3);
      c.stroke(new Path2D('M0 0V-10 M-2.6 -7.6L0 -5L2.6 -7.6'));
      c.restore();
    } } },
  geschenk:     { name:'Geschenk', emoji:'🎁', zeichne: c => c.stroke(new Path2D(
    'M3 8.5H21V12.5H3Z M4.5 12.5V21H19.5V12.5 M12 8.5V21 M12 8.5C10.5 4 6 3.5 6.5 6.5C7 8.5 12 8.5 12 8.5 M12 8.5C13.5 4 18 3.5 17.5 6.5C17 8.5 12 8.5 12 8.5')) },
  herz:         { name:'Herz', emoji:'❤️', zeichne: c => c.stroke(new Path2D(
    'M12 20.5C12 20.5 3 14.8 3 8.8A4.6 4.6 0 0 1 12 7A4.6 4.6 0 0 1 21 8.8C21 14.8 12 20.5 12 20.5Z')) },
  blume:        { name:'Blume', emoji:'🌷', zeichne: c => {
    for (let i = 0; i < 5; i++) {
      const w = i * 2 * Math.PI / 5 - Math.PI / 2;
      c.beginPath(); c.arc(12 + Math.cos(w) * 5, 10 + Math.sin(w) * 5, 3.2, 0, Math.PI * 2); c.stroke();
    }
    c.beginPath(); c.arc(12, 10, 2, 0, Math.PI * 2); c.stroke();
    c.stroke(new Path2D('M12 15.5V23 M12 20C10 18 7.5 18.5 7 19.5C9 20.5 12 20 12 20')); } },
  blatt:        { name:'Herbstblatt', emoji:'🍂', zeichne: c => c.stroke(new Path2D(
    'M4.5 19.5C4.5 10 10 4 20 4C20 14 14 19.5 4.5 19.5Z M2.5 21.5L15 9 M9 15H13 M11.5 12.5V9')) },
  sonne:        { name:'Sonne', emoji:'☀️', zeichne: c => {
    c.beginPath(); c.arc(12, 12, 4.5, 0, Math.PI * 2); c.stroke();
    for (let i = 0; i < 8; i++) {
      const w = i * Math.PI / 4;
      c.beginPath(); c.moveTo(12 + Math.cos(w) * 7.5, 12 + Math.sin(w) * 7.5);
      c.lineTo(12 + Math.cos(w) * 10.5, 12 + Math.sin(w) * 10.5); c.stroke();
    } } },
  tropfen:      { name:'Tropfen', emoji:'💧', zeichne: c => c.stroke(new Path2D(
    'M12 2.5C12 2.5 5.5 10.5 5.5 15A6.5 6.5 0 0 0 18.5 15C18.5 10.5 12 2.5 12 2.5Z M9 15.5A3 3 0 0 0 12 18.5')) },
  schere:       { name:'Schere', emoji:'✂️', zeichne: c => {
    c.beginPath(); c.arc(6, 6, 3, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.arc(6, 18, 3, 0, Math.PI * 2); c.stroke();
    c.stroke(new Path2D('M8.3 8L21 19.5 M8.3 16L21 4.5')); } },
  pinsel:       { name:'Pinsel (Farbe)', emoji:'🖌️', zeichne: c => c.stroke(new Path2D(
    'M20.5 3.5L10.5 13.5 M21 3C19 3 12 9 10.5 13.5L12.5 15.5C17 14 21 5 21 3Z M10.5 13.5C7 13.5 6 16 6 17.5C6 19.5 4 20.5 3 21C7 21.5 11.5 20.5 12.5 15.5')) },
  sekt:         { name:'Sektglas', emoji:'🥂', zeichne: c => {
    c.stroke(new Path2D('M8 2.5H16L15.2 9.5A3.2 3.2 0 0 1 8.8 9.5Z M12 12.7V20.5 M8.5 20.5H15.5 M8.4 6H15.6'));
    [[18.5, 4, 0.9], [19.5, 8, 0.6], [5, 7, 0.7]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke(); }); } },
  ringe:        { name:'Ringe', emoji:'💍', zeichne: c => {
    c.beginPath(); c.arc(9, 14.5, 5.5, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.arc(15, 14.5, 5.5, 0, Math.PI * 2); c.stroke();
    c.stroke(new Path2D('M9 9L7 6.5L9 4L11 6.5Z')); } },
  preisschild:  { name:'Preisschild', emoji:'🏷️', zeichne: c => {
    c.stroke(new Path2D('M3 3H11.5L21 12.5L12.5 21L3 11.5Z'));
    c.beginPath(); c.arc(7.5, 7.5, 1.6, 0, Math.PI * 2); c.stroke(); } },
  stift:        { name:'Stift (Schule)', emoji:'✏️', zeichne: c => c.stroke(new Path2D(
    'M16 3L21 8L8.5 20.5L3 21L3.5 15.5Z M13.5 5.5L18.5 10.5 M3.5 15.5L8.5 20.5')) },
  osterei:      { name:'Osterei', emoji:'🥚', zeichne: c => {
    c.stroke(new Path2D('M12 2.5C8 2.5 5 9 5 14.5A7 7 0 0 0 19 14.5C19 9 16 2.5 12 2.5Z M5.4 11.5L8 13.5L10.7 11.5L13.3 13.5L16 11.5L18.6 13.5'));
    [8.5, 12, 15.5].forEach(x => { c.beginPath(); c.arc(x, 17.3, 0.6, 0, Math.PI * 2); c.stroke(); }); } },
  hase:         { name:'Osterhase', emoji:'🐰', zeichne: c => {
    // Ohren nur außerhalb des Kopfes zeichnen (Kopf ausgespart)
    c.save(); c.beginPath(); c.rect(-2, -2, 28, 28); c.arc(12, 16, 6, 0, Math.PI * 2); c.clip('evenodd');
    c.beginPath(); c.ellipse(9.3, 6.5, 1.9, 5, -0.18, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.ellipse(14.7, 6.5, 1.9, 5, 0.18, 0, Math.PI * 2); c.stroke();
    c.restore();
    c.fillStyle = c.strokeStyle;
    c.beginPath(); c.arc(12, 16, 6, 0, Math.PI * 2); c.stroke();
    [[9.8, 15], [14.2, 15]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 0.55, 0, Math.PI * 2); c.fill(); });
    c.stroke(new Path2D('M11.2 17.3L12 18L12.8 17.3 M12 18V19 M10.6 19.6Q12 20.6 13.4 19.6')); } },
  kuerbis:      { name:'Kürbis', emoji:'🎃', zeichne: c => {
    c.beginPath(); c.ellipse(12, 14.5, 9.5, 7, 0, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.ellipse(12, 14.5, 4.5, 7, 0, 0, Math.PI * 2); c.stroke();
    c.stroke(new Path2D('M12 7.5V5C12 3.8 13 3 14.5 3')); } },
  feuerwerk:    { name:'Feuerwerk', emoji:'🎆', zeichne: c => {
    for (let i = 0; i < 12; i++) {
      const w = i * Math.PI / 6, r1 = i % 2 ? 4 : 3, r2 = i % 2 ? 8 : 10;
      c.beginPath(); c.moveTo(12 + Math.cos(w) * r1, 12 + Math.sin(w) * r1);
      c.lineTo(12 + Math.cos(w) * r2, 12 + Math.sin(w) * r2); c.stroke();
    }
    c.beginPath(); c.arc(12, 12, 0.8, 0, Math.PI * 2); c.stroke(); } },
  stiefel:      { name:'Nikolausstiefel', emoji:'🥾', zeichne: c => c.stroke(new Path2D(
    'M6 3H14V6.5H6Z M7 6.5V20.5H20.5V18.5C20.5 17 20 15.8 18.5 15.1L13 12.5V6.5 M14.5 20.5V18.5'))
  },
  torte:        { name:'Torte', emoji:'🎂', zeichne: c => {
    c.stroke(new Path2D('M3.5 21H20.5 M5 21V14.5H19V21 M5 17.5C7 19 9.5 16 12 17.5C14.5 19 17 16 19 17.5 M7 14.5V11H17V14.5 M9 11V8.5 M12 11V8.5 M15 11V8.5'));
    [9, 12, 15].forEach(x => c.stroke(new Path2D(`M${x} 6.8C${x - 0.9} 5.8 ${x} 4 ${x} 4C${x} 4 ${x + 0.9} 5.8 ${x} 6.8Z`))); } },
  uhr:          { name:'Uhr', emoji:'🕐', zeichne: c => {
    c.beginPath(); c.arc(12, 12, 9.5, 0, Math.PI * 2); c.stroke();
    c.stroke(new Path2D('M12 6.5V12L15.5 14.5')); } },
};
// Fünfzackiger Stern um (x|y), außen r1, innen r2
function stern(c, x, y, r1, r2) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const w = i * Math.PI / 5 - Math.PI / 2, r = i % 2 ? r2 : r1;
    c[i ? 'lineTo' : 'moveTo'](x + Math.cos(w) * r, y + Math.sin(w) * r);
  }
  c.closePath(); c.stroke();
}
