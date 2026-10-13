// Service Worker: hält die App-Dateien im Handy, damit Reichweite auch
// ohne Netz startet.
//
// Wichtig: Alle greathairday-Apps laufen unter derselben Adresse
// (mirjamwalenta-a11y.github.io) und teilen sich deshalb den Browser-
// Speicher. Darum tragen alle Caches dieser App das Präfix CACHE_PREFIX,
// und beim Aufräumen werden NUR eigene Caches gelöscht.
//
// Nie gecacht: Supabase (Login, Wörni/Edge Function) und alles außer GET.
// Das sind Live-Daten und dürfen nie aus einem alten Zwischenspeicher kommen.

const CACHE_PREFIX = 'moment-ghd-';
const VERSION = '2026-10-13';
const CACHE = CACHE_PREFIX + VERSION;

// Beim ersten Öffnen (online) vorab speichern
const VORAB = [
  './',
  './index.html',
  './sprueche.html',
  './haarkompass-post.html',
  './fit-check.html',
  './recruiting-cockpit.html',
  './bewerber-vorlagen.html',
  './bewerbung-formular.html',
  './css/app.css?v=20261006',
  './gehalt.js',
  './recruiting-daten.js',
  './bewerber-texte.js',
  './qrcode-generator.js',
  './sw-registrieren.js',
  './manifest.webmanifest',
  './logo-m.png',
  './logo-name.png',
  './logo-haarnetzwerk.png',
  './bilder/logo-m-export.png',
  './bilder/unterschrift-export.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
  'https://mirjamwalenta-a11y.github.io/abwesenheiten-ghd/ghd-sitzung.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Einzeln laden: eine fehlende Datei soll nicht die ganze Installation abbrechen
    await Promise.all(VORAB.map(async url => {
      try {
        const res = await fetch(url, { cache: 'reload' });
        if (res.ok) await cache.put(url, res);
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const namen = await caches.keys();
    await Promise.all(namen
      .filter(n => n.startsWith(CACHE_PREFIX) && n !== CACHE)
      .map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

function istLiveDaten(url) {
  return url.hostname.endsWith('.supabase.co');
}

// Fremde Dateien, die die App zum Starten braucht (Schriften, Supabase-Bibliothek, Sitzungs-Skript)
function istErlaubtFremd(url) {
  return url.hostname === 'fonts.googleapis.com'
      || url.hostname === 'fonts.gstatic.com'
      || url.hostname === 'cdn.jsdelivr.net'
      || (url.hostname === 'mirjamwalenta-a11y.github.io' && url.pathname === '/abwesenheiten-ghd/ghd-sitzung.js');
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (istLiveDaten(url)) return;
  const eigen = url.origin === self.location.origin
             && url.pathname.startsWith(new URL(self.registration.scope).pathname);
  if (!eigen && !istErlaubtFremd(url)) return;

  // Seiten: zuerst Netz (damit Änderungen sofort ankommen), bei schwachem
  // oder keinem Netz nach 4 s die gespeicherte Version
  if (req.mode === 'navigate') {
    event.respondWith(netzZuerst(req, 4000));
    return;
  }
  // Alles andere: sofort aus dem Speicher, im Hintergrund aktualisieren
  event.respondWith(speicherZuerst(req, event));
});

async function netzZuerst(req, timeoutMs) {
  const cache = await caches.open(CACHE);
  const netz = fetch(req).then(res => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  });
  const gespeichert = () => cache.match(req, { ignoreSearch: true });
  try {
    return await Promise.race([
      netz,
      new Promise((_, nein) => setTimeout(() => nein(new Error('langsam')), timeoutMs))
    ]);
  } catch (_) {
    const treffer = await gespeichert();
    if (treffer) return treffer;
    // Keine gespeicherte Version: doch auf das Netz warten (oder Startseite zeigen)
    try { return await netz; }
    catch (e) { return (await cache.match('./index.html')) || Response.error(); }
  }
}

async function speicherZuerst(req, event) {
  const cache = await caches.open(CACHE);
  const treffer = await cache.match(req);
  const netz = fetch(req).then(res => {
    // opaque (type "opaque", status 0) nur für Schriften/Skripte von erlaubten Fremd-Adressen
    if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  if (treffer) {
    event.waitUntil(netz);
    return treffer;
  }
  return (await netz) || Response.error();
}
