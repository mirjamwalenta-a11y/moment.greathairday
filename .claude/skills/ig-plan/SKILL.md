---
name: ig-plan
description: >-
  Plant die Instagram-Woche: was gepostet wird, in welchem Format, wann, und
  bei welchen Konten die Person in ihrer Kommentar-Runde kommentiert.
  Verwenden, wenn jemand sagt „plan meine Woche“, „was soll ich posten“,
  „mach mir einen Redaktionsplan“, „Content-Kalender“, „mir fällt nichts zum
  Posten ein“ oder einen Posting-Plan mit einer Liste für die Kommentar-Runde
  will.
---

# ig-plan

Die Schaltzentrale. Alles andere in diesem Paket setzt um. Dieser Skill
entscheidet, was umgesetzt wird. Einmal pro Woche verwenden, immer am selben
Tag.

## Eingabe

Lies `stimme.md` (im Projektordner, sonst `~/.claude/instagram/stimme.md`) und
im Ordner `ablage/` daneben `vorbilder.md` und `protokoll.md`, falls es sie
gibt. Die Vorbilder-Sammlung ist der eigene Beleg der Person aus `/ig-viral`,
welche Formeln in ihrer Branche gerade ankommen. Sie zählt mehr als alles in
dieser Datei. Das Protokoll verhindert, dass der Plan ein Thema aus den letzten
zwei Wochen wiederholt.

Gibt es die Dateien nicht, frag nach vier Dingen und schreib sie in die
`stimme.md`:

1. Was die Person verkauft, und an wen.
2. Die drei oder vier Themen, für die sie bekannt sein will.
3. Was diese Woche wirklich passiert ist: ein Kundengespräch, eine Zahl, ein
   Fehler, etwas, das sie gebaut hat, eine Diskussion. Daraus entstehen
   Beiträge.
4. Zehn Konten, bei denen sie sichtbar sein will.

Fehlt die `stimme.md` ganz, bitte zusätzlich um drei eigene Beiträge oder
Reel-Texte und füll die `stimme.md` daraus.

## Was gepostet wird

Vier bis fünf Beiträge pro Woche, mindestens drei davon Reels. Reels sind das
einzige Format auf Instagram, das zuverlässig Leute erreicht, die dem Konto
nicht folgen. Karussells gehen in die Tiefe bei denen, die schon folgen.
Storys laufen täglich und werden extra geplant.

Über die Woche mischen, nie zweimal derselbe Typ hintereinander:

| Typ | Anteil | Aufgabe |
| --- | --- | --- |
| **Beweis** | 1 pro Woche | etwas, das passiert ist, mit einer Zahl. Reel. |
| **Lehren** | 1 bis 2 pro Woche | eine Sache, die man heute umsetzen kann. Reel oder Karussell. |
| **Meinung** | 1 pro Woche | eine Haltung, die Follower kosten könnte. Reel. |
| **Geschichte** | 1 alle zwei Wochen | eine Szene, in der etwas einen Preis hatte. Reel. |
| **Angebot** | 1 alle zwei Wochen | was die Person verkauft, klar gesagt, ohne Entschuldigung. Karussell oder Storys. |

Für jeden Platz: das Thema, den konkreten Aufhänger aus dem, was diese Woche
passiert ist, das Format und die Nummer der Hook-Formel aus
`ig-reel/hooks.json`. Kein Thema, sondern ein Aufhänger. „KI“ ist kein Plan.
„Der Auftrag, den wir verloren haben, weil im Angebot noch der Name des
Mitbewerbers stand“ ist ein Reel.

## Wann gepostet wird

Poste, wenn die Zielgruppe wach ist und nicht arbeitet. Für Privatkundschaft
heißt das meist abends, etwa 19:00 bis 20:30 Uhr. Für Geschäftskundschaft früh
morgens, etwa 7:00 bis 8:00 Uhr.

Aber sag das klar: **Die Uhrzeit zählt viel weniger als die ersten zwei
Sekunden.** Instagram zeigt ein Reel tagelang weiter, wenn es läuft, und
begräbt ein perfekt getimtes, wenn es nicht läuft. Feilt die Person an
Posting-Zeiten, bevor ihre Hooks funktionieren, poliert sie das Falsche. Sag
ihr das.

Richte die Zeiten nach der Zeitzone der Zielgruppe, nicht nach der der Person,
falls die sich unterscheiden.

## Die Kommentar-Runde (20 Minuten am Tag), nicht optional

20 Minuten am Tag, vor dem Posten, nicht danach. Stell eine Liste mit 10
Konten zusammen:

- **5 Reichweite:** Konten mit einem Publikum, das die Person erreichen will,
  wo ein guter Kommentar gesehen wird. Früh kommentieren, bevor 200 Kommentare
  drunter stehen.
- **3 Gleichgesinnte:** gleiche Größe, gleiche Branche. Diese Gruppe
  kommentiert zurück.
- **2 Interessenten:** Leute, die wirklich kaufen könnten. Wochenlang
  kommentieren, bevor überhaupt eine DM kommt, und nie im Kommentar etwas
  anbieten.

Gib die Liste an `/ig-comment`.

## Ausgabe

```
WOCHE AB 15. SEPTEMBER

MO  nur Kommentar-Runde  (20 Min., Liste unten)
DI  19:30  REEL       BEWEIS      #5  Zeitsprung        Angebot schreiben: von 5 Stunden auf 20 Minuten
MI  nur Storys + Kommentar-Runde
DO  19:00  KARUSSELL  LEHREN      Caption Aufgabe B         die Zahlungsklausel in 4 Folien
FR  19:30  REEL       MEINUNG     #2  Verbot            hör auf mit kostenlosen Erstgesprächen
SA  -
SO  20:00  REEL       GESCHICHTE  #21 Mitten im Satz    die Mail mit der Rückforderung

STORYS  jeden Tag 3 bis 5 Storys, Fragen-Sticker am Donnerstag.

KOMMENTAR-RUNDE  (5 Reichweite / 3 Gleichgesinnte / 2 Interessenten)
  ...

Sag „schreib Dienstag“, dann entwerfe ich ihn.
```

Schreib den Plan nach `ablage/wochenplan.md` (im selben Ordner wie die
`stimme.md`), damit die anderen Skills ihn lesen können. Nichts wird irgendwo
eingeplant oder gepostet. Das ist ein Plan, und die Person setzt ihn selbst
um.
