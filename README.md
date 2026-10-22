# Moment — V1 Prototyp

> Content-Entwürfe für Salon-Inhaber:innen. Vom Alltagsmoment zum Post-Entwurf in einem Flow.

## Was ist das?

Ein mobiler Prototyp für eine App, die Inhaber:innen kleiner Salons und lokaler Dienstleistungsbetriebe dabei hilft, aus echten Momenten schnell brauchbare Entwürfe für Sichtbarkeit zu erzeugen — ohne Marketingstruktur, ohne viel Tippen.

**Produktziel:** Die tägliche Hürde „Was soll ich heute posten?" reduzieren.

## Was die App tut

- Führt durch einen einzigen, klaren Flow: Anlass → Output
- Erzeugt Feed-Entwürfe, Story-Abfolgen, Kurzvideo-Ideen, Google-Beiträge sowie Newsletter (Betreff, Vorschau, Text mit P.S.) und Meta-Anzeigen (Primärtext, Überschrift, Beschreibung, Button)
- Schlägt den passenden Hauptkanal vor
- Veröffentlicht **nichts automatisch** — alle Entwürfe sind zum manuellen Verwenden

## Was die App ausdrücklich nicht tut

Kein Dashboard, kein Redaktionskalender, kein Planungstool, kein Posting-Tool, keine API-Anbindungen, keine Analytics, keine Team-Collaboration.

## Screens

### 1. Hauptscreen

Sechs Eingaben, fast alles per Chip-Auswahl:

| # | Feld | Typ |
|---|------|-----|
| 1 | Worum geht es? | Single-Select |
| 2 | Wer steht im Mittelpunkt? | Single-Select |
| 3 | Wen wollen wir erreichen? | Single-Select |
| 4 | Was soll es bewirken? | Single-Select |
| 5 | Was ist heute konkret passiert? | Freitext (kurz) |
| 6 | Wo soll es hin? | Multi-Select |

### 2. Ausbildungs-Sonderlogik

Wenn „Ausbildung" als Anlass gewählt wird, erscheint ein zusätzliches Feld:
*Was hat euch heute beim Lernen unterstützt?* (Multi-Select)

Optionen: Lernquiz-App · Praktische Übung · Englisch im Salon · Gespräch im Team · Checkliste · Anderes

Die Lernquiz-App taucht im Output organisch auf — nicht als Werbung, sondern als Teil gelebter moderner Ausbildung.

### 3. Output-Screen

- Empfohlener Hauptkanal
- Feed-Entwurf (Hook + Text + Hashtags)
- Story-Abfolge (4–5 Frames, scrollbar)
- Kurzvideo-Idee
- Google-Beitragsentwurf (nur wenn Google Business gewählt)

## Produktlogik

Outputs werden regelbasiert aus den Eingaben zusammengebaut:

- **Anlass** → Ton, Hook, inhaltliche Richtung
- **Fokus** → Perspektive im Text
- **Zielgruppe** → Hauptkanal-Empfehlung
- **Freitext** → fließt direkt in alle Entwürfe ein
- **Lernmittel (Ausbildung)** → erscheint kontextuell im Output

## UI-Richtung

- Mobile first, max. 390 px
- Farben: Tiefes Salbeigrün `#2E5D4B` · Warmes Steingrau `#F5F3EF` · Warmes Gold `#C8A96E`
- Keine Menüs, keine Zwischensteps, keine unnötigen Elemente
- Fortschrittsleiste zeigt Vollständigkeit, CTA wird erst aktiv wenn alle Pflichtfelder gefüllt

## Dateien

```
/
├── salon-app-v1.html   # Vollständiger Prototyp (self-contained, kein Build-Schritt)
└── README.md           # Diese Datei
```

## Starten

Einfach `salon-app-v1.html` im Browser öffnen — kein Server, kein Build nötig.

---

*V1 — gebaut für schnelles Testen mit echten Nutzer:innen.*

## Offline-Betrieb (PWA)

- `sw.js` (Service Worker) und `ghd-offline.js` kommen aus dem gemeinsamen Offline-Baustein aller Great-Hair-Day-Apps (Repo `abwesenheiten-ghd`, siehe dort `OFFLINE.md`).
- Beim ersten Öffnen mit Netz werden alle Seiten, Bilder, Schriften und die Supabase-Bibliothek im Handy gespeichert. Danach startet die App auch ohne Netz.
- `manifest.webmanifest` + `icons/`: „Zum Home-Bildschirm hinzufügen“.
- Wörni (Edge Function) braucht weiterhin Netz. Ohne Netz kommt sofort ein Hinweis statt eines Fehlers.
- Neue Dateien bitte in `vorab` in `sw.js` ergänzen.

## Klingt das nach KI? (Prüfung unter Post, Reel-Caption und „Alle Kanäle“)

Unter jedem fertigen Instagram-Text erscheint ein aufklappbares Feld „🔍 Klingt das nach KI?“. Es rechnet komplett im Handy, nichts wird verschickt:

- **Was der Feed zeigt:** die ersten ca. 125 Zeichen, so wie sie vor „… mehr“ stehen.
- **Hook-Punkte** (0–100) für die erste Zeile und beim Reel für das Overlay der ersten Szene: Länge, konkret (Leistung, Ort, Zahl), das Wichtige vorne, Ansprache. Auch die Einstiege im Hook-Bereich bekommen eine Punktzahl.
- **Caption-Prüfung:** erste Zeile, höchstens 5 Hashtags, keine Allerwelts-Hashtags, keine Links, höchstens eine Bitte, Emoji, Suchbegriffe (Wien, 1050, Margareten).
- **KI-Spuren:** Floskeln, Muster wie „nicht nur …, sondern auch …“, Gedankenstriche, unsichtbare Zeichen. „✨ Automatisch aufräumen“ ersetzt nur Floskeln mit einfachem Ersatz; Adresszeile und Unterschrift bleiben unberührt.

Dieselben Regeln stehen auch in Wörnis Schreibregeln (Regel 10 und 11 in `postSchreibregeln`), damit die Texte schon so geschrieben werden. Wortliste zum Bearbeiten: `ki-check-daten.js`. Herkunft und Lizenz: `LIZENZEN-DRITTE.md`. Alles sind Faustregeln, kein KI-Detektor.

## Instagram-Helfer (Claude-Skills)

In `.claude/skills/ig-*` liegen 13 Instagram-Helfer von MakersLab (MIT-Lizenz). Sie laufen in jeder Claude-Code-Sitzung zu diesem Repo. Einfach schreiben, was du willst:

| Helfer | Beispiel |
| --- | --- |
| Reel-Skript (`/ig-reel`) | „Mach mir ein Reel darüber, dass eine Balayage drei Stunden dauert.“ |
| Caption (`/ig-caption`) | „Schreib die Caption zu diesem Reel, ich will unter ‚Balayage Wien‘ gefunden werden: …“ |
| Humanizer (`/ig-human`) | „Klingt das nach KI? Mach es menschlicher: …“ |
| Karussell (`/ig-carousel`) | „Mach ein Karussell: 5 Fragen vor einer Balayage.“ |
| Storys (`/ig-story`) | „Was poste ich heute in meine Story? Heute war Prüfungstag bei der Innung.“ |
| Profil-Check (`/ig-profile`) | „Bewerte mein Instagram-Profil: [Screenshot oder Bio]“ |
| Wochenplan (`/ig-plan`) | „Plan meine Instagram-Woche. Diese Woche ist passiert: …“ |
| Kommentar (`/ig-comment`) | „Was schreib ich unter diesen Beitrag? …“ |
| Antworten (`/ig-reply`) | „Hilf mir, auf diese Kommentare zu antworten: …“ |
| DMs (`/ig-dm`) | „Jemand hat nach freien Lehrstellen gefragt. Was schreib ich?“ |
| Weiterverwerten (`/ig-repurpose`) | „Mach aus diesem Newsletter Beiträge für eine Woche: …“ |
| Rückblick (`/ig-audit`) | „Schau dir die Zahlen meiner letzten 20 Beiträge an: [Screenshots]“ |
| Was gerade läuft (`/ig-viral`) | „Was funktioniert gerade bei Friseur:innen auf Instagram? Hier sind Konten, die ich mag: …“ |

- Regeln für Claude: `INSTAGRAM.md`. Deine Stimme: `stimme.md` (aus Wörnis Regeln abgeleitet, bitte ergänzen).
- Nichts wird gepostet. Claude schreibt, du postest.
- Entwürfe landen in `ablage/` und werden **nicht** ins (öffentliche) Repo hochgeladen.
- Vier Helfer haben kleine Python-Werkzeuge (Hook-Punkte, Zeitplan, Caption-Vorschau, Humanizer-Wert). Ohne Python schätzt Claude von Hand.
