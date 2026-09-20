# Fokus-Startseite V1 — Sichtbarkeitslücken & empfohlenes Thema

Stand: 2026-09-20 · Branch `claude/reach-app-guided-homepage-50kppd` · Datei: `index.html`

**Status: V1 abnahmefähig.** Nach zwei Alltagstest-Runden und einer gezielten
Nachschärfung der Empfehlungslogik ist dieser Stand inhaltlich stabil. Es
sind aktuell keine weiteren Änderungen an Priorisierung, Layout, Navigation
oder Funktionsumfang geplant — dieses Dokument ist die Übergabe, kein
nächster Ausbauschritt.

## Was umgesetzt wurde

Der bestehende Startscreen (`screen-start`) wurde **oben ergänzt** um einen
Fokus-Block (`#fokus-wrap`, gerendert von `renderFokus()`):

- maximal 3 Sichtbarkeitslücken als kurze Liste
- genau 1 daraus abgeleitetes, empfohlenes Thema
- ein zentraler Button „Für dieses Thema erstellen", der direkt in den
  passenden bestehenden Generator (Post / KI-Sichtbarkeit / Google) springt
  und ihn vorbefüllt

Der bisherige Wege-Chooser (4 Kacheln + Werkbank-Link) bleibt vollständig
darunter erhalten und unverändert erreichbar. Keine neuen Tabs, keine neue
Navigation, keine neue Datenbank-Tabelle.

## Aktuelle Lückenlogik (`getSichtbarkeitsLuecken()`)

Drei Prüfungen auf Basis bereits vorhandener Datenquellen — mit einer
einzigen kleinen Ergänzung (Google-Zeitstempel):

1. **Reichweite** — `ghd_wochenplan`: diese Woche 0 Posts erfasst.
2. **KI-Sichtbarkeit** — `ghd_ki_sichtbarkeit_v1`: mind. 1 Eintrag mit
   Status ≠ `live` (noch nicht platzierte FAQ-Frage).
3. **Google** — `ghd_google_last_post` (neu: ein Zeitstempel, gesetzt beim
   bestehenden „✓ Gepostet"-Klick im Google-Tab): kein Beitrag je erfasst,
   oder ≥ 7 Tage her.

Die Liste zeigt die Lücken in derselben Reihenfolge, in der auch das Thema
priorisiert wird (KI → Reichweite → Google), damit die dringlichste
gelistete Lücke immer zu der ist, die die Empfehlung ausgelöst hat.

## Aktuelle Empfehlungslogik (`getEmpfohlenesThema()`)

Priorisiert nach Konkretheit/Bearbeitbarkeit, nicht nach fixer
Kanal-Reihenfolge:

1. Offene KI-Frage vorhanden → Thema ist die Frage selbst (bereits ein
   fertiges, sofort bearbeitbares Thema).
2. Sonst, wenn Reichweite-Lücke vorhanden → tageweise rotierender Vorschlag
   aus `HEUTE_EMPFEHLUNGEN` (derselbe Pool wie im „Heute"-Tab).
3. Sonst, wenn Google-Lücke vorhanden → derselbe Tagesvorschlag als
   inhaltlicher Aufhänger, zusätzlich ins Google-Textfeld vorbefüllt (statt
   nur an den leeren Kanal zu erinnern).
4. Keine Lücke → derselbe Tagesvorschlag als neutraler Fallback.

Es wird immer genau 1 Thema angezeigt, keine Auswahl.

## Bewusst nicht Teil des V1

- Kein Score, kein Dashboard, kein Content-Hub, keine Kanal-Matrix
- Keine „Website: Thema fehlt"-Lücke (keine Datenquelle dafür vorhanden,
  keine neue eingeführt)
- Keine automatische Erstellung für alle Kanäle
- Keine Änderung an bestehenden Generatoren, Tabs oder Navigation

## Teststand

**1. Alltagstest (5 Szenarien):** Kernbefund — sobald eine Reichweite-Lücke
vorlag, gewann sie unabhängig davon, ob gleichzeitig eine konkretere Lücke
(offene KI-Frage) sichtbar war. Diagnose oben passte nicht zur Empfehlung
unten. 4 von 5 Szenarien brauchbar, 1 Fall (mehrere Lücken gleichzeitig)
nicht.

**Nachschärfung:** Prioritätsreihenfolge in der Empfehlungslogik auf
Konkretheit umgestellt (KI-Frage vor Reichweite vor Google); Google-Fall
zusätzlich mit konkretem Themenvorschlag statt leerer Kanal-Erinnerung
versehen.

**2. Alltagstest (dieselben 5 Szenarien):** ursprünglicher Problemfall
behoben — Empfehlung und angezeigte Lücken inhaltlich stimmig. Alle 5
Szenarien brauchbar.

**Kleine Folgekorrektur:** Anzeige-Reihenfolge der gelisteten Lücken an die
Prioritätsreihenfolge der Themenwahl angeglichen, damit die Lücke, die das
Thema bestimmt hat, auch optisch an erster Stelle steht.

**Ergebnis:** Kein aus den Tests bekannter offener Punkt mehr. Die zuvor
vermerkte optische Beobachtung (Reihenfolge der Lücken-Liste vs. gewählte
Empfehlung) ist mit der Folgekorrektur behoben, nicht mehr offen.
