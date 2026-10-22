---
name: ig-human
description: >-
  Der Humanizer: entfernt die Maschinenspuren aus jedem Entwurf (Gedankenstrich-
  Ketten, KI-Floskeln wie „In der heutigen schnelllebigen Welt“, „Lass uns
  eintauchen“, „Es ist wichtig zu beachten“, „spannend“ im Dauerbetrieb,
  unsichtbare Zeichen) und bewertet ihn mit fünf Prüfungen, bevor er rausgeht.
  Deutsch und Englisch. Verwenden, wenn ein Text menschlich klingen soll, bei
  „klingt das nach KI?“, „mach das menschlicher“, „klingt zu sehr nach
  Chatbot“, „entferne die Gedankenstriche“, „Floskeln raus“, und vor jeder
  Caption, jedem Skript, Kommentar, jeder Antwort oder DM, die der Person
  gezeigt wird.
---

# ig-human

In diesem Ordner liegen zwei Werkzeuge, und beide laufen wirklich. Nutze sie.
Prüf das nicht nach Gefühl.

```bash
PY "<Skill-Ordner>/humanize.py" ablage/entwurf/text.txt -o ablage/entwurf/sauber.txt --bericht
PY "<Skill-Ordner>/detect.py" ablage/entwurf/text.txt                      # bewerten, fünf Prüfungen
PY "<Skill-Ordner>/detect.py" ablage/entwurf/text.txt ablage/entwurf/sauber.txt   # vorher/nachher
```

**Reel-Skripte** (ein Beat pro Zeile) bekommen bei beiden Werkzeugen
`--skript`. Kurze, ähnlich lange Zeilen sind dort gewollt, deshalb zählt die
Prüfung SCHWANKUNG dann nicht, und „gleich lange Sätze“ wird nicht gemeldet.

`PY` ist der Python-Befehl auf diesem Rechner: `python3` auf dem Mac, unter
Windows `python` oder `py`. `<Skill-Ordner>` ist der Ordner dieser Datei
(im Projekt `.claude/skills/ig-human/`, global `~/.claude/skills/ig-human/`).
Texte legst du als UTF-8-Datei in `ablage/entwurf/` ab.

Beide lesen `slop.json`: rund 150 deutsche und 150 englische Floskeln mit
einfachem Ersatz, 18 Arten unsichtbarer Zeichen, 15 typografische Ersetzungen
und 31 Strukturmuster. Die Sprache wird erkannt. Bei deutschem Text werden die
deutschen Floskeln ersetzt und englische (zum Beispiel „Deep Dive“) nur
markiert. Die Liste ist zum Bearbeiten da: Sagt die Person ein Wort wirklich
so, das die Liste streicht, nimm es aus der Datei.

**Ohne Python:** Geh den Text von Hand durch, mit denselben Regeln wie unten
(Gedankenstriche, Floskeln aus `slop.json`, Strukturmuster). Eine Punktzahl
gibt es dann nicht, sag das der Person.

## Warum das auf Instagram mehr zählt, als man denkt

Captions sind kurz, und Skripte werden laut gesprochen. Ein Satz, der nach
Schreibtisch klingt, ist in einer Caption mit 600 Zeichen ein viel größerer
Anteil als in einem Aufsatz, und ein Sprechertext, den niemand natürlich sagen
kann, fällt in der ersten Aufnahme auf. Das Problem ist nicht ein Detektor,
der den Beitrag markiert. Das Problem ist eine Person, die weiterwischt, weil
es nach Werbeprospekt klingt, oder jemand, der über das eigene Skript stolpert.

## Was automatisch behoben wird

**1. Unsichtbare Zeichen.** Nullbreiten-Leerzeichen und -Verbinder, weiche
Trennstriche, Byte-Order-Marks, Unicode-Tags, unsichtbare Trenner, geschützte
und schmale Leerzeichen. Eine Tastatur erzeugt die nicht. Sie überleben
Kopieren und Einfügen und sind in jedem Editor unsichtbar. `humanize.py` löscht
jedes davon.

**2. Typografie.** Gedankenstrich zu Komma, Bis-Strich zwischen Zahlen zu
Bindestrich, Auslassungszeichen zu drei Punkten, Aufzählungspunkt zu
Bindestrich, » « zu geraden Anführungszeichen. Deutsche Anführungszeichen
(„ “) und der Apostroph ’ bleiben, weil jede deutsche Handy-Tastatur sie selbst
setzt. In englischem Text werden auch “ ” ‘ ’ zu geraden Zeichen. Der
Gedankenstrich ist der wichtigste: Im Deutschen setzt KI ihn mit Leerzeichen
davor und danach („ – “), oft drei- oder viermal in einem kurzen Text. Ab drei
Stück meldet der Bericht eine Gedankenstrich-Kette. Der Mediopunkt in
Genderformen (Kund·innen) bleibt stehen.

**3. Die Floskel-Liste.** „In der heutigen schnelllebigen Welt“, „Lass uns
eintauchen“, „Darüber hinaus“, „essenziell“, „ganzheitlich“, „Mehrwert“, „der
Schlüssel zum Erfolg“, „ein echter Gamechanger“, dazu der Instagram-Block:
„Hör auf zu scrollen“, „Folge mir für mehr“, „Markiere jemanden, der das
braucht“, „Der Algorithmus liebt …“. Jede wird durch ein einfaches Wort
ersetzt oder gelöscht, mit passender Groß- und Kleinschreibung, Links bleiben
unberührt. Bei Eigenschaftswörtern bleibt die Endung (innovative → neue).

**Nur markiert, nicht ersetzt:** Floskeln, bei denen ein Ersatz den Satzbau
brechen würde. Typisch Deutsch: „Es ist wichtig zu beachten, dass …“ oder
„Zusammenfassend lässt sich sagen, dass …“. Wer den Anfang löscht, behält
einen Nebensatz mit Verb am Ende. Diese Stellen stehen im Bericht unter
„FLOSKELN MARKIERT“, und du schreibst sie selbst um.

## Was NICHT automatisch behoben wird

Strukturmuster werden **gemeldet, nicht umgeschrieben**, weil man für den Umbau
eines Satzes Urteilsvermögen braucht:

- „Nicht nur X, sondern auch Y“ und „Es geht nicht um X, sondern um Y“
- Dreier-Aufzählungen („mehr Reichweite, mehr Vertrauen und mehr Umsatz“)
- Rhetorische Kurzfragen als eigene Zeile: „Das Ergebnis?“
- Die Video-Vorrede: „In diesem Video zeige ich dir …“
- „spannend“ mehr als einmal im Text
- Gedankenstrich-Ketten
- Emoji-Aufzählungen
- Drei oder mehr Wörter in GROSSBUCHSTABEN hintereinander
- Hashtag-Wände
- Reflex-Bitten: „Folge mir für mehr“, „Markiere jemanden“, „Was meint ihr?“
- „In einer Welt, in der …“ und „Bist du bereit, …?“

Diese Liste ist deine Aufgabe. Schreib jede gemeldete Stelle von Hand um, mit
derselben Bedeutung, und lass `detect.py` noch einmal laufen. Genau das bringt
den Wert von ÜBERARBEITEN auf BESTANDEN, und das kann kein Skript.

## Die fünf Prüfungen

`detect.py` vergibt für fünf Signale 0 bis 100 Mensch-Punkte:

| Prüfung | was sie misst | wie Maschine aussieht |
| --- | --- | --- |
| SCHWANKUNG | wie stark die Satzlängen wechseln | jeder Satz gleich lang |
| KONKRET | Zahlen, Namen, Daten pro 100 Wörter | abstrakte Hauptwörter, keine Zahlen |
| FLOSKELN | Treffer aus der Liste pro 100 Wörter | Standard-Vokabular |
| SPUREN | unsichtbare Zeichen, Gedankenstriche, typografische Zeichen pro 1.000 Zeichen | typografisch perfekt |
| STIMME | Umgangssprache („gibt's“, „mal“, „halt“, „hab“), Ich/Du/Wir, Strukturmuster | keine Umgangssprache, inszenierte Enthüllungen |

Im Deutschen zählen großgeschriebene Wörter nicht automatisch als Namen, weil
alle Hauptwörter groß sind. Gezählt werden Zahlen, Zahlwörter, Monate,
Wochentage, Kürzel und Namenspaare wie „Familie Huber“.

Das Urteil gewichtet den Durchschnitt mit 60 % und die **schwächste einzelne
Prüfung** mit 40 %, weil ein Signal reicht. BESTANDEN braucht insgesamt 70 oder
mehr und keine Prüfung unter 55.

## Sag das ehrlich

Das sind fünf lokale Faustregeln, angelehnt an die Signale, auf die öffentliche
KI-Detektoren achten. Sie laufen komplett auf dem Rechner der Person, nichts
wird hochgeladen. Sie sind **kein** Online-KI-Detektor, rufen keinen auf und
können dessen Urteil nicht versprechen. Wer behebt, was sie messen, verschiebt
meist auch deren Zahlen, weil sie dieselben Dinge messen. Mehr behauptest du
nicht, und du sagst niemandem, sein Text sei „nicht erkennbar“.

## Reihenfolge

1. `humanize.py ablage/entwurf/text.txt -o ablage/entwurf/sauber.txt --bericht`
2. Lies „FLOSKELN MARKIERT“ und „STRUKTURMUSTER“. Schreib diese Stellen in
   `sauber.txt` selbst um.
3. `detect.py ablage/entwurf/text.txt ablage/entwurf/sauber.txt` für vorher und
   nachher.
4. Ist das Urteil nicht BESTANDEN, behebe die schwächste Prüfung aus der
   Ausgabe und mach noch eine Runde. Zwei Runden sind normal. Fünf heißen, der
   Entwurf war nach Schema geschrieben, und die Lösung ist ein neuer Entwurf,
   nicht noch mehr Runden.
5. Zeig der Person den bereinigten Text und den Wert. Nie nur den Wert.

Nichts wird gepostet. Du entscheidest, was du verwendest.
