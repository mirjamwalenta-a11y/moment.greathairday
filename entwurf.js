// ════════════════════════════════════════════
// ENTWURF & RÜCKGÄNGIG für „Video + Text“ und „Clips & Fotos“
// ════════════════════════════════════════════
// Entwurf: Der Stand (Schnitte, Texte, Einstellungen) und die Dateien
// (Videos, Fotos, Sprachaufnahme) werden in IndexedDB auf dem Gerät gemerkt,
// damit nichts verloren geht, wenn die App zugeht. Nichts wird hochgeladen.
// Dateien werden nur geschrieben, wenn sich die Datei selbst ändert, der
// Stand bei jeder Änderung.
//
// Rückgängig: Nach jeder Bedienung (Tippen, Schieben, Klicken) wird kurz
// gewartet und dann der Stand mit dem vorigen verglichen. Hat er sich
// geändert, kommt der vorige auf den Stapel. So wird ein ganzer Schieber-Zug
// oder ein getippter Satz zu einem Schritt.

const Entwurf = (() => {
  const DB_NAME = 'moment-entwuerfe', STORE = 'eintraege';
  let dbVersprechen = null;

  function db() {
    if (!dbVersprechen) {
      dbVersprechen = new Promise((ok, nein) => {
        if (!window.indexedDB) return nein(new Error('Kein IndexedDB'));
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => ok(req.result);
        req.onerror = () => nein(req.error);
      });
      dbVersprechen.catch(() => { dbVersprechen = null; });
    }
    return dbVersprechen;
  }

  // `arbeit` bekommt den Store; das Ergebnis gilt erst, wenn die Transaktion fertig ist
  async function transaktion(modus, arbeit) {
    const d = await db();
    return new Promise((ok, nein) => {
      const t = d.transaction(STORE, modus);
      const ergebnis = arbeit(t.objectStore(STORE));
      t.oncomplete = () => ok(ergebnis);
      t.onerror = () => nein(t.error);
      t.onabort = () => nein(t.error || new Error('Abgebrochen'));
    });
  }

  // Einmal fragen, dass der Browser die Entwürfe nicht von sich aus löscht
  let dauerhaftGefragt = false;
  function dauerhaft() {
    if (dauerhaftGefragt) return;
    dauerhaftGefragt = true;
    try { navigator.storage?.persist?.().catch(() => {}); } catch (_) {}
  }

  // Ein Entwurf pro Werkzeug: Schlüssel „name|stand“ und „name|datei|…“
  function ablage(name, { beiFehler = () => {} } = {}) {
    const p = name + '|', bereich = () => IDBKeyRange.bound(p, p + '￿');
    const STAND = p + 'stand', DATEI = p + 'datei|';
    let gespeichert = new Map(); // Schlüssel → Datei, die schon in der Datenbank liegt
    const zuGross = new WeakSet(); // Dateien, die nicht gespeichert werden konnten
    let kette = Promise.resolve();
    const nacheinander = fn => (kette = kette.then(fn).catch(beiFehler));

    return {
      // { stand, zeit, dateien } oder null
      async laden() {
        await kette; // noch laufendes Speichern abwarten
        const roh = {};
        await transaktion('readonly', s => {
          const req = s.openCursor(bereich());
          req.onsuccess = () => {
            const c = req.result;
            if (!c) return;
            roh[c.key] = c.value;
            c.continue();
          };
        });
        if (!roh[STAND]) return null;
        const dateien = {};
        for (const [k, v] of Object.entries(roh)) if (k.startsWith(DATEI)) dateien[k.slice(DATEI.length)] = v;
        gespeichert = new Map(Object.entries(dateien));
        return { stand: roh[STAND].stand, zeit: roh[STAND].zeit, dateien };
      },

      // dateien: { schlüssel: Blob }; fehlende Schlüssel werden gelöscht
      merken(stand, dateien = {}) {
        return nacheinander(async () => {
          const soll = Object.entries(dateien).filter(([, b]) => b && !zuGross.has(b));
          const neu = soll.filter(([k, b]) => gespeichert.get(k) !== b);
          try {
            await transaktion('readwrite', s => {
              for (const [k, b] of neu) s.put(b, DATEI + k);
              for (const k of gespeichert.keys()) if (!soll.some(([x]) => x === k)) s.delete(DATEI + k);
              s.put({ stand, zeit: Date.now() }, STAND);
            });
          } catch (e) {
            // meist zu wenig Speicher: diese Dateien nicht nochmal versuchen
            for (const [, b] of neu) zuGross.add(b);
            throw e;
          }
          gespeichert = new Map(soll);
          dauerhaft();
        });
      },

      verwerfen() {
        return nacheinander(async () => {
          await transaktion('readwrite', s => s.delete(bereich()));
          gespeichert = new Map();
        });
      }
    };
  }

  // holen() → { stand, dateien }; setzen(stand, dateien) stellt einen Stand wieder her
  function verlauf({ holen, setzen, knopf, darf = () => true, sichtbar = () => true, beiAenderung = () => {}, warte = 600 }) {
    const zurueck = [];
    let aktuell = null, timer = null, laeuft = false;

    const schnapp = () => {
      const { stand, dateien = {} } = holen();
      return { text: JSON.stringify(stand), dateien: Object.fromEntries(Object.entries(dateien).filter(([, b]) => b)) };
    };
    const gleich = (a, b) => a.text === b.text
      && Object.keys({ ...a.dateien, ...b.dateien }).every(k => a.dateien[k] === b.dateien[k]);
    const melden = () => beiAenderung(JSON.parse(aktuell.text), aktuell.dateien);

    function anzeigen() {
      knopf.hidden = !zurueck.length || !sichtbar();
      knopf.disabled = !darf();
    }

    function pruefen() {
      clearTimeout(timer);
      timer = null;
      // während Erstellen/Aufnahme nichts erfassen; danach ruft die Seite pruefen() auf
      if (!aktuell || laeuft || !darf()) return anzeigen();
      const neu = schnapp();
      if (!gleich(neu, aktuell)) {
        zurueck.push(aktuell);
        if (zurueck.length > 60) zurueck.shift();
        aktuell = neu;
        melden();
      }
      anzeigen();
    }

    async function rueckgaengig() {
      if (!aktuell || laeuft || !darf()) return;
      pruefen(); // eine noch nicht erfasste Änderung zuerst als eigenen Schritt merken
      const s = zurueck.pop();
      if (!s) return;
      laeuft = true;
      try { await setzen(JSON.parse(s.text), s.dateien); } finally { laeuft = false; }
      aktuell = schnapp();
      melden();
      anzeigen();
    }

    const spaeter = () => { clearTimeout(timer); timer = setTimeout(pruefen, warte); };
    for (const ev of ['input', 'change', 'click', 'pointerup']) document.addEventListener(ev, spaeter, true);
    knopf.addEventListener('click', rueckgaengig);
    // Strg/Cmd+Z am Computer; in Eingabefeldern bleibt das eigene Rückgängig des Browsers
    document.addEventListener('keydown', e => {
      if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey || e.key.toLowerCase() !== 'z') return;
      if (e.target.closest?.('input, textarea, [contenteditable]')) return;
      e.preventDefault();
      rueckgaengig();
    });

    return {
      // neuer Anfang (anderes Video, Entwurf geladen): Stapel leeren
      neu(speichern = true) {
        clearTimeout(timer);
        zurueck.length = 0;
        aktuell = schnapp();
        if (speichern) melden();
        anzeigen();
      },
      pruefen,
      anzeigen
    };
  }

  const zeitText = ms => new Date(ms).toLocaleString('de-AT', { weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });

  return { ablage, verlauf, zeitText };
})();
