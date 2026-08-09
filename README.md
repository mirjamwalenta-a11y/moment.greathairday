# Moment — V1 Prototyp

> Content-Entwürfe für Salon-Inhaber:innen. Vom Alltagsmoment zum Post-Entwurf in einem Flow.

## Was ist das?

Ein mobiler Prototyp für eine App, die Inhaber:innen kleiner Salons und lokaler Dienstleistungsbetriebe dabei hilft, aus echten Momenten schnell brauchbare Entwürfe für Sichtbarkeit zu erzeugen — ohne Marketingstruktur, ohne viel Tippen.

**Produktziel:** Die tägliche Hürde „Was soll ich heute posten?" reduzieren.

## Was die App tut

- Führt durch einen einzigen, klaren Flow: Anlass → Output
- Erzeugt Feed-Entwürfe, Story-Abfolgen, Kurzvideo-Ideen und Google-Beiträge
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
