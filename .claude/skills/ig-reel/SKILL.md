---
name: ig-reel
description: >-
  Macht aus einer rohen Idee ein Instagram-Reel: drei Hooks aus 26 Formeln mit
  Punkten, das gesprochene Skript, den Text im Bild und einen Zeitplan
  (Beat-Sheet), in der eigenen Stimme der Person und bewertet, bevor sie
  aufnimmt. Verwenden, wenn jemand ein Reel, ein Kurzvideo-Skript, einen Hook
  oder einen Sprechertext will, bei „mach ein Reel über …“, „schreib mir ein
  Reel-Skript“, „was sag ich in dem Video“, „ich brauch einen ersten Satz“,
  „Hook für …“ oder wenn jemand gleich aufnimmt und den Einstieg noch nicht hat.
---

# ig-reel

Macht aus einer Idee ein Reel, das Leute bis zum Ende schauen.

In diesem Ordner liegen zwei Werkzeuge, und beide laufen wirklich. Nutze sie.
Schätz den Hook nicht nach Gefühl und rate die Länge nicht.

```bash
PY "<Skill-Ordner>/hookscore.py" ablage/entwurf/hooks.txt        # Hooks bewerten und sortieren
PY "<Skill-Ordner>/hookscore.py" --hook "ein Satz"               # einen einzelnen bewerten
PY "<Skill-Ordner>/beats.py" ablage/entwurf/skript.txt --ziel 30  # Zeitplan vor dem Dreh
```

`PY` ist der Python-Befehl auf diesem Rechner: `python3` auf dem Mac, unter
Windows `python` oder `py`. `<Skill-Ordner>` ist der Ordner dieser Datei
(im Projekt `.claude/skills/ig-reel/`, bei globaler Installation
`~/.claude/skills/ig-reel/`). Entwürfe legst du als UTF-8-Textdatei in
`ablage/entwurf/` ab (Ordner anlegen, falls er fehlt).

`beats.py` rechnet in Silben, nicht in Wörtern, weil deutsche Wörter länger
sind. Standard ist normales Tempo (4,5 Silben pro Sekunde). Steht in der
`stimme.md` ein anderes Tempo, gib es mit `--tempo ruhig`, `--tempo schnell`
oder einer Zahl mit.

**Ohne Python:** Der Skill funktioniert trotzdem. Bewerte die Hooks dann von
Hand nach denselben fünf Eigenschaften (Länge, konkret, Einsatz, Anfang,
Ansprache) und schätze die Länge mit etwa 4,5 Silben pro Sekunde. Sag der
Person klar, dass das deine Schätzung ist und nicht gemessen.

## Bevor du schreibst

1. Lies `stimme.md` (im Projektordner, sonst `~/.claude/instagram/stimme.md`).
   Das ist das Stimmprofil der Person: wie sie vor der Kamera redet, was sie nie
   sagen würde, mit wem sie spricht. Fehlt die Datei oder ist sie noch die
   leere Vorlage, bitte um **drei eigene Reels oder Captions**, lies sie, leite
   die Stimme daraus ab und fülle `stimme.md`. Ein Skript in der falschen Stimme
   ist unbrauchbar, weil die Person es laut sagen muss.
2. Lies `hooks.json` in diesem Ordner. 26 Formeln, jede mit Vorlage, Beispiel,
   Fassung fürs Bild, wofür sie gut ist und woran sie scheitert.
3. Ist die Idee dünn, füll sie nicht auf. Stell eine gebündelte Frage: Was ist
   passiert, wem, und was hat es gekostet oder gebracht? Ein Reel braucht eine
   konkrete, wahre Sache. Hol sie dir vor dem Schreiben.
4. Gibt es `ablage/vorbilder.md`, lies sie. Die schreibt `/ig-viral`, und sie
   ist der eigene Beleg der Person, welche Formeln in ihrer Branche gerade
   funktionieren. Sie schlägt die Standardwerte in dieser Datei.

## Der Aufbau

Ein Reel entscheidet sich in den ersten zwei Sekunden und hält in den nächsten
fünf.

```
0:00 - 0:02   HOOK        die Aussage. Gesprochener Satz und Text im Bild
                          getrennt geschrieben. Bewegung im ersten Bild, kein
                          stehendes Gesicht.
0:02 - 0:07   DER EINSATZ warum das für die Person vor dem Handy zählt. Ein Satz.
0:07 - ...    DER KERN    ein Gedanke pro Beat, und das Bild wechselt bei jedem Beat.
LETZTE 3 s    DIE AUFLÖSUNG  einlösen, was der Hook versprochen hat, dann die eine Bitte.
LETZTER SATZ  DIE SCHLEIFE   ein Wort aus dem Hook aufgreifen, damit das
                          Wiederholen sauber ansetzt.
```

Länge: 15 bis 45 Sekunden ist der Bereich, der funktioniert. Reels dürfen drei
Minuten lang sein, und fast niemand sollte das nutzen. Unter 7 Sekunden steigen
nur die Wiederholungen, sonst nichts.

## Der Ablauf

**1. Drei Hooks, nicht einer.** Geh die Idee mit `hooks.json` durch, wähl drei
Formeln, die wirklich passen, und schreib für jede den gesprochenen Satz und
den Text im Bild. Drei verschiedene Formeln, nicht dreimal derselbe Satz
umformuliert.

**2. Bewerten.** Schreib die drei gesprochenen Sätze in
`ablage/entwurf/hooks.txt`, einen pro Zeile, und lass `hookscore.py` laufen.
Zeig der Person die Rangliste. Liegt der beste unter 50, ist der Hook noch
nicht gefunden, und kein Feinschliff ändert das.

**3. Skript schreiben** auf dem besten Hook. Gesprochene Sprache, so wie die
Person wirklich redet. Kurze Zeilen, eine Zeile pro Beat. Kein Satz, den sie
üben müsste.

**4. Zeit messen.** `beats.py ablage/entwurf/skript.txt --ziel {Länge}`. Behebe
jeden Hinweis: Hook über 3 Sekunden, ein Beat über 4 Sekunden, mehrere Beats
ohne etwas Konkretes, keine Schleife. Wiederholen, bis es sauber ist.

**5. Vermenschlichen.** Schick das Skript durch `/ig-human`, bevor du es
zeigst, mit `--skript` (ein Beat pro Zeile, siehe dort). Ein geschriebener Satz
fällt sofort auf, wenn ihn jemand laut sagt.

**6. Ausgeben.** Das Skript in einem Code-Block, den Text im Bild als eigene
Liste mit Zeiten, und dann:

```
REEL FERTIG
Hook:       #3 Das sagt dir keiner, 87 Punkte, STARK
Länge:      28,4 s in 9 Beats bei normalem Tempo
Im Bild:    6 Texttafeln
Humanizer:  4 Spuren entfernt, Mensch-Wert 81, BESTANDEN
Caption:    als Nächstes /ig-caption

Sag „ja“, dann trage ich es ins Protokoll ein. Oder sag mir, was anders soll.
```

**7. Nie veröffentlichen.** Dieser Skill liefert ein Skript. Die Person dreht
und postet selbst. Bei „ja“ hängst du an `ablage/protokoll.md` eine Zeile an:
Datum, verwendete Hook-Formel, erster Satz. So hat `/ig-audit` später eine
Geschichte.

## Text im Bild ist ein eigenes Skript

Schreib ihn jedes Mal getrennt. Er wird gelesen, bevor er gehört wird.

- **Höchstens sechs Wörter pro Tafel.** Gelesen auf Armlänge von jemandem, der
  noch nicht zuhört. Deutsche Wörter sind lang: lieber vier.
- **Die Hook-Tafel steht ab dem ersten Bild**, nicht nach einer Sekunde Stille.
- **Im sicheren Bereich bleiben.** Bei 1080x1920 nichts oberhalb von y=230 oder
  unterhalb von y=1440, und die rechten 230 Pixel frei lassen. Dort liegt die
  Oberfläche der App über allem: Caption, Knopfleiste, Audiozeile.
- **Den Hook nie dorthin, wo die Caption sitzt.** Das ist der untere Rand, und
  der ist verdeckt.
- **Untertitel für den Kern einbrennen.** Die meisten schauen zuerst ohne Ton.

## Regeln, die den Unterschied machen

- **Ein Gedanke pro Reel.** Hat das Skript zwei, sind es zwei Reels. Sag das.
- **Zahlen statt Eigenschaftswörter.** „4.200 €“ schlägt „ziemlich viel“. Hat
  die Person keine Zahl genannt, frag nach einer, statt um das Loch
  herumzuschreiben.
- **Kein Intro.** Keine Begrüßung, kein „in diesem Video“, kein Name, kein Logo.
  Das Video beginnt mit dem Satz, bei dem man sonst in Sekunde sechs wäre.
- **Bei jedem Beat das Bild wechseln.** Ein stehendes Bild über 8 Sekunden ist
  die Stelle, an der Leute gehen, und `beats.py` markiert das.
- **Eine Bitte am Ende.** Stichwort kommentieren, speichern oder folgen. Eine.
- **Nie etwas erfinden.** Keine ausgedachten Zahlen, Kunden, Umsätze oder
  Ergebnisse unter dem Namen der Person, auch nicht als Platzhalter-Beispiel.
  Fehlt eine Zahl, steht im Skript `{{deine Zahl}}`, und du sagst es.
- **Kein Skript um einen Trend-Sound, den die Person nicht nutzen kann.** Braucht
  die Idee die eigene Stimme, sag das.

## Beispiel

```
/ig-reel Wir haben die Angebotszeit mit einer Vorlage von 5 Stunden auf 20 Minuten gedrückt
```

```
HOOKS  (bewertet)
  87  STARK  #5  Zeitsprung        „Für ein Angebot habe ich früher fünf Stunden gebraucht.“
                                   im Bild: 5 STUNDEN → 20 MINUTEN
  74  STARK  #1  Kosten-Geständnis „Zwei Jahre lang hab ich jede Woche vier Stunden formatiert.“
                                   im Bild: 2 JAHRE VERSCHWENDET
  55  OK     #9  Klau das          „Klau dir die Angebotsvorlage, die das geschafft hat.“
                                   im Bild: KLAU DIR DAS

Ich nehme #5: Das Verhältnis ist glaubwürdig, es ist im Bild auf einen Blick
lesbar, und die Zahl gehört dir.
```

(Die Punkte im Beispiel sind zur Veranschaulichung. Im echten Lauf stehen dort
die Werte, die `hookscore.py` ausgibt.)

Nichts wird gepostet. Du drehst und postest selbst.
