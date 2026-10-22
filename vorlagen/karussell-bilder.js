// Macht aus einer Karussell-HTML-Datei (Vorlage: vorlagen/karussell.html)
// je <section> ein PNG in 1080x1350.
//
//   node vorlagen/karussell-bilder.js ablage/entwurf/karussell.html ablage/karussell-blond
//
// Braucht Playwright (npm i playwright) und einen Chromium. Liegt der
// Browser woanders, CHROMIUM_PFAD setzen. Die HTML-Datei muss so liegen,
// dass "../logo-name.png" auf das Logo im Repo zeigt (also eine Ebene
// unter dem Repo-Ordner, z. B. in vorlagen/ oder ablage/; in ablage/entwurf/
// den Pfad auf "../../logo-name.png" ändern).
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const [html, ziel = 'ablage/karussell'] = process.argv.slice(2);
  if (!html) { console.error('Aufruf: node vorlagen/karussell-bilder.js <karussell.html> [zielordner]'); process.exit(2); }
  fs.mkdirSync(ziel, { recursive: true });
  const pfad = process.env.CHROMIUM_PFAD || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const browser = await chromium.launch(pfad ? { executablePath: pfad } : {});
  const seite = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await seite.goto('file://' + path.resolve(html), { waitUntil: 'networkidle' });
  await seite.evaluate(() => document.fonts.ready);
  const folien = await seite.$$('section');
  for (let i = 0; i < folien.length; i++) {
    if (await folien[i].evaluate(s => s.scrollHeight > s.clientHeight)) console.warn(`Achtung: Text auf Folie ${i + 1} ist zu lang.`);
    const datei = path.join(ziel, `folie-${String(i + 1).padStart(2, '0')}.png`);
    await folien[i].screenshot({ path: datei });
    console.log(datei);
  }
  await browser.close();
})();
