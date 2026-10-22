---
name: ig-caption
description: >-
  Schreibt die Instagram-Caption (den Beitragstext): die erste Zeile, die den
  Schnitt vor „… mehr“ übersteht, den Haupttext, die eine Bitte, die
  Suchbegriffe und höchstens fünf Hashtags, und prüft sie, bevor sie rausgeht.
  Zeigt genau, was der Feed vor „… mehr“ anzeigt. Verwenden bei „schreib die
  Caption“, „Text für den Beitrag“, „was schreib ich drunter“, „Beschreibung
  für mein Reel“, „welche Hashtags“, oder wenn ein Reel oder Karussell fertig
  ist und der Text fehlt.
---

# ig-caption

In diesem Ordner liegt ein Werkzeug, und es läuft wirklich:

```bash
PY "<Skill-Ordner>/caption.py" ablage/entwurf/caption.txt
PY "<Skill-Ordner>/caption.py" ablage/entwurf/caption.txt --suchbegriffe "Esstisch nach Maß,Tischlerei Graz"
```

`PY` ist der Python-Befehl auf diesem Rechner: `python3` auf dem Mac, unter
Windows `python` oder `py`. `<Skill-Ordner>` ist der Ordner dieser Datei
(im Projekt `.claude/skills/ig-caption/`, global `~/.claude/skills/ig-caption/`).
Die Caption legst du als UTF-8-Textdatei in `ablage/entwurf/` ab.

Das Skript zeigt die Caption so, wie der Feed sie zeigt: die ersten 125
Zeichen in einem Kasten, alles andere hinter „… mehr“. Lies diesen Kasten,
bevor du irgendetwas anderes liest, das du geschrieben hast. Auf Deutsch ist
der Kasten noch wichtiger als auf Englisch, weil deutsche Wörter länger sind
und weniger davon in 125 Zeichen passen.

**Ohne Python:** Zähl die ersten 125 Zeichen selbst ab (Leerzeichen zählen mit)
und zeig sie der Person als Vorschau mit „… mehr“ am Ende. Geh die Prüfpunkte
unten von Hand durch und sag, dass es deine Zählung ist und nicht gemessen.

## Zuerst entscheiden: Welche Aufgabe hat diese Caption?

Diese Entscheidung ruiniert Captions, wenn man sie überspringt.

**Aufgabe A: Das Video hat schon gehakt.** Ein Reel trägt seinen Hook in den
ersten zwei Sekunden, gesprochen und im Bild. Die Caption ist kein zweiter
Hook, und wer mit dem Video konkurriert, verliert beides. Ihre Aufgabe ist die
Bitte, der Zusammenhang, der die Bitte verständlich macht, und die Wörter, nach
denen Leute suchen.

**Aufgabe B: Die Caption ist selbst der Inhalt.** Ein Foto, ein einzelnes Bild,
ein Karussell-Titelbild, das eine Frage offen lässt. Hier ist die erste Zeile
der Hook und funktioniert genau wie ein Reel-Hook: konkret, kurz, und an einer
Klippe abgeschnitten statt mitten im Nebensatz.

Frag, welche Aufgabe gilt. Hat die Person ein Reel mit starkem Hook, schreib A
und sag warum.

## Der Aufbau

```
Zeile 1     125 Zeichen sichtbarer Platz. Aufgabe A: die Bitte, klar gesagt.
            Aufgabe B: der Hook.
            Nie eine Begrüßung, nie ein Hashtag, nie ein Emoji als erstes Zeichen.
Haupttext   kurze Absätze, eine Leerzeile dazwischen. Zwei bis sechs davon.
            Hier stehen die Suchbegriffe.
Die Bitte   eine. Stichwort kommentieren, speichern oder DM. Eine.
Hashtags    höchstens fünf, in einer eigenen Zeile unten, oder keine.
```

Die Grenze liegt bei 2.200 Zeichen, und fast nichts braucht 2.200. Eine
Caption, die das Tippen auf „mehr“ verdient und dann 600 Zeichen liefert,
schlägt eine mit 1.800.

## Hashtags, ehrlich

Hashtags sind kein Reichweiten-Hebel mehr. Laut einer Ankündigung von
Instagram vom Dezember 2025 sind höchstens fünf Hashtags pro Beitrag erlaubt
(vorher 30), mit dem Hinweis, dass wenige, gezielte Hashtags besser
funktionieren als viele allgemeine. Schon Anfang 2025 hatte die
Instagram-Leitung gesagt, dass Hashtags einordnen, aber keine Reichweite
bringen.

Also: höchstens fünf, konkret, als Themen-Etikett. Hat die Person einen Block
mit zwanzig gespeicherten Hashtags in ihren Notizen, ist der jetzt Ballast, und
das Skript lässt ihn durchfallen.

`#viral`, `#fyp`, `#fürdich`, `#explorepage`, `#instagood` beschreiben nichts.
Streichen.

Plattform-Zahlen ändern sich. Wenn Instagram heute etwas anderes macht als hier
steht, hat Instagram recht.

## Suchbegriffe zählen mehr als Hashtags

Die Instagram-Suche liest den Caption-Text. Der Begriff, unter dem die Person
gefunden werden will, gehört deshalb als normale Wortgruppe in die Caption, so
wie ein Mensch ihn tippen würde, in einem Satz, der sich normal liest.
„Esstisch nach Maß“ als Wörter in Zeile drei, nicht „#esstischnachmaß“ in einem
Block am Ende. Bei regionalem Geschäft gehört der Ort dazu („Tischlerei Graz“).

Frag nach zwei oder drei solchen Begriffen und gib sie dem Skript mit:

```bash
PY "<Skill-Ordner>/caption.py" ablage/entwurf/caption.txt --suchbegriffe "Esstisch nach Maß,Tischlerei Graz"
```

## Regeln

- **Kein Link in der Caption.** Captions sind nicht anklickbar. Eine Webadresse
  im Text ist toter Text, der sagt: Ich kenne diese Plattform nicht. Bio oder DM.
- **Eine Bitte.** Zwei Bitten wirken wie keine. `caption.py` zählt sie.
- **Das Stichwort muss man tippen können.** Ein Wort, ohne Leerzeichen, ohne
  Emoji, und sag es im Video auch laut. `Kommentiere VORLAGE` funktioniert.
  `Kommentiere „die Vertragsvorlage“` nicht.
- **Den ersten Kommentar extra schreiben**, wenn ein Link nötig ist. Sag das in
  der Zusammenfassung.
- **Emoji als Satzzeichen, nicht als Deko.** Das Skript meldet alles über
  4 pro 100 Zeichen.
- **Alt-Text ist 20 Sekunden wert.** Bei Karussells und Fotos schreib ihn. Den
  lesen Screenreader und Instagram.
- **Du oder Sie** richtet sich nach der `stimme.md`. Steht dort nichts, frag.

## Der Ablauf

1. Lies `stimme.md` (im Projektordner, sonst `~/.claude/instagram/stimme.md`).
2. Entscheide Aufgabe A oder B und sag welche.
3. Schreib den Entwurf.
4. Schick ihn durch `/ig-human`. Captions sind kurz, Floskeln fallen hier lauter
   auf als irgendwo sonst.
5. Lass `caption.py` mit den Suchbegriffen der Person laufen. Behebe jeden
   FEHLER. Entscheide jedes PRÜFEN laut, nicht stillschweigend.
6. Zeig zuerst den Kasten „WAS DER FEED ZEIGT“, dann den kopierfertigen Text,
   dann die Zusammenfassung:

```
CAPTION FERTIG
Aufgabe:      A, das Reel trägt den Hook
sichtbar:     118 von 125 Zeichen vor „… mehr“
Bitte:        eine, Stichwort TISCH kommentieren
Hashtags:     3
Suche:        „Esstisch nach Maß“ in Zeile 3, „Tischlerei Graz“ in Zeile 5
Prüfung:      FERTIG
```

Nichts wird gepostet. Du kopierst den Text und postest selbst.
