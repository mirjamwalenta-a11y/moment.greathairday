// Offline-Fähigkeit: Service Worker anmelden + kleiner Hinweis, solange
// kein Netz da ist. In jeder Seite dieser App eingebunden.
(function () {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

  function hinweis() {
    var id = 'offline-hinweis';
    var el = document.getElementById(id);
    if (navigator.onLine) { if (el) el.remove(); return; }
    if (el || !document.body) return;
    el = document.createElement('div');
    el.id = id;
    el.setAttribute('role', 'status');
    el.textContent = 'Offline – deine Eingaben bleiben im Handy gespeichert. Wörni braucht wieder Netz.';
    el.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;padding:8px 14px calc(8px + env(safe-area-inset-bottom));'
      + 'background:#2E5D4B;color:#fff;font:500 12px/1.4 Inter,system-ui,sans-serif;text-align:center;';
    document.body.appendChild(el);
  }
  window.addEventListener('online', hinweis);
  window.addEventListener('offline', hinweis);
  document.addEventListener('DOMContentLoaded', hinweis);
})();
