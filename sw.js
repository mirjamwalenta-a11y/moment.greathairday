// Service Worker dieser App: macht sie offline nutzbar.
// Die eigentliche Logik (Dateien merken, Supabase-Daten merken, Änderungen
// ohne Netz in einer Warteschlange sammeln und nachschicken, Konfliktregel
// „nichts überschreiben“) steckt zentral in ghd-offline-sw.js im Repo
// abwesenheiten-ghd und gilt für alle Great-Hair-Day-Apps gleich.
// Neue Seiten/Dateien dieser App hier bei `vorab` ergänzen.
self.GHD_OFFLINE = {
  app: 'moment',
  version: '2026-10-23j',
  start: './index.html',
  vorab: [
    './',
    './index.html',
    './sprueche.html',
    './haarkompass-post.html',
    './fit-check.html',
    './recruiting-cockpit.html',
    './bewerber-vorlagen.html',
    './bewerbung-formular.html',
    './instagram.html',
    './video.html',
    './montage.html',
    './instagram-mappe.js',
    './karussell-canvas.js',
    './css/app.css?v=20261023b',
    './gehalt.js',
    './eigene-saetze.js',
    './recruiting-daten.js',
    './ki-check-daten.js',
    './ki-check.js',
    './bewerber-texte.js',
    './qrcode-generator.js',
    './manifest.webmanifest',
    './logo-m.png',
    './logo-name.png',
    './logo-haarnetzwerk.png',
    './bilder/logo-m-export.png',
    './bilder/unterschrift-export.png',
    './icons/icon-180.png',
    './icons/icon-192.png',
    './icons/icon-512.png',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'
  ]
};
importScripts('https://mirjamwalenta-a11y.github.io/abwesenheiten-ghd/ghd-offline-sw.js');
