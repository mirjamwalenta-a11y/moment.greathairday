---
name: ig-audit
description: >-
  Wertet aus, was die Person schon gepostet hat: welche Reels wirklich
  funktioniert haben, warum, und womit sie aufhören sollte. Rechnet mit dem
  Ausreißer-Faktor, der Halterate nach 3 Sekunden und den Weiterleitungen
  statt mit reinen Aufrufen. Verwenden, wenn jemand Statistiken oder alte
  Beiträge einfügt und fragt: „was funktioniert bei mir“, „warum ist das
  gefloppt“, „lies meine Zahlen“, „prüf meine Beiträge“, „schau dir meine
  Statistiken an“ oder „wovon soll ich mehr machen“.
---

# ig-audit

Die einzige ehrliche Quelle dafür, was bei einem Konto funktioniert, ist dieses
Konto. Jede Regel aus jedem Instagram-Ratgeber, auch aus diesem Paket, ist nur
eine Vermutung. Die letzten 30 Beiträge der Person sind der Beleg.

## Eingabe

Frag nach dem, was die Person hat:

- Statistiken (Insights) je Beitrag: Aufrufe, Reichweite, Interaktionen,
  Wiedergabezeit, Speicherungen, Weiterleitungen, neue Follower und den Anteil
  der Reichweite bei Nicht-Followern. Screenshots reichen.
- Oder die Zuschauerkurve (wie viele bis zu welcher Sekunde dranbleiben) für
  das beste und das schlechteste Reel der letzten Zeit. Dieser eine Screenshot
  ist mehr wert als alles andere zusammen.
- Oder nur die Beiträge mit ihren Aufrufen. Das reicht für einen ersten
  Durchgang.

Melde dich nicht bei Instagram an und frag nie nach einem Passwort. Was die
Person einfügt, reicht.

Lies außerdem `ablage/protokoll.md` (im selben Ordner wie die `stimme.md`),
falls es die Datei gibt. Dort steht, welche Hook-Formel jeder Beitrag benutzt
hat.

## Was du wirklich misst

Reine Aufrufe sind die am wenigsten nützliche Zahl auf der Seite. Sie hängen
vor allem davon ab, wie viele Leute dem Konto schon folgen. Rechne stattdessen
diese Werte aus und zeig den Rechenweg:

| Kennzahl | Rechnung | Was sie dir sagt |
| --- | --- | --- |
| **Ausreißer-Faktor** | Aufrufe geteilt durch die typischen Aufrufe dieses Kontos (Median, also der Wert in der Mitte, wenn man alle Beiträge sortiert) | das Wievielfache vom Normalwert: echter Treffer oder normaler Tag |
| **Reichweite bei Nicht-Followern** | Anteil der Reichweite von Leuten, die nicht folgen | ob der Beitrag überhaupt nach draußen gekommen ist |
| **Halterate nach 3 Sekunden** | Zuschauer nach 3 Sekunden geteilt durch alle, die angefangen haben | ob der Hook funktioniert hat. Das ist die Note für den Hook. |
| **Durchschnittliche Wiedergabezeit** | direkt aus den Statistiken | ob der Mittelteil funktioniert hat |
| **Weiterleitungen je Reichweite** | Weiterleitungen geteilt durch Reichweite | das stärkste einzelne Signal, das man sich verdienen kann. Wer weiterleitet, steht mit seinem Namen dafür. |
| **Neue Follower je Reichweite** | neue Follower geteilt durch Reichweite | ob das Profil die Aufmerksamkeit in Follower verwandelt hat |

Sortiere nach Ausreißer-Faktor und Weiterleitungen je Reichweite, nicht nach
Aufrufen. Ein Reel mit 4.000 Aufrufen und 90 Weiterleitungen schlägt eines mit
60.000 Aufrufen und 11.

## Dann such das Muster

Leg die besten fünf und die schlechtesten fünf nebeneinander. Such, was sie
trennt, und trau dich zu einem Ergebnis, das der Person nicht gefällt:

- **Halterate nach 3 Sekunden.** Unterscheiden sich oben und unten hier, liegt
  es am Hook und an nichts anderem. Alles danach lenkt nur ab.
- **Hook-Formel.** Welche Nummern aus `ig-reel/hooks.json` stehen in den besten
  fünf?
- **Format.** Reel, Karussell, Einzelbild.
- **Länge.** In Gruppen: unter 15 Sekunden, 15 bis 30, 30 bis 60, über 60.
- **Thema.**
- **Ob die Person in der ersten Stunde auf Kommentare geantwortet hat.**
- **Wochentag und Uhrzeit.** Das prüfst du **zuletzt** und nur, wenn alles
  andere nichts zeigt. Es ist fast nie die Ursache, und genau dort hätten die
  Leute sie gern.

Formuliere das Ergebnis als Aussage mit Beleg und sag dazu, wie sicher es ist.
Bei 30 Beiträgen siehst du ein Muster. Bei 6 nicht, und das ehrlich zu sagen
ist besser, als eins zu erfinden.

## Die Unterscheidung, die Monate spart

**Ein Reel mit Aufrufen, aber ohne neue Follower ist kein gescheitertes Reel.
Es ist ein Profil-Problem.** Ein Reel ohne Aufrufe ist ein Hook-Problem. Trenn
die beiden, bevor du etwas empfiehlst. Ist die Reichweite bei Nicht-Followern
hoch und kommen kaum neue Follower je Reichweite, hör auf, Hooks umzuschreiben,
und geh zu `/ig-profile`.

## Ausgabe

```
AUSWERTUNG  ·  31 Beiträge  ·  12. Juni bis 5. September  ·  typische Aufrufe (Median) 4.100

TOP 5 NACH AUSREISSER-FAKTOR
  18,2x  #3  Das sagt dir keiner  74.600 Aufrufe  62 % Nicht-Follower  Halterate 3 s 71 %  128 Weiterleitungen
   6,4x  #1  Kosten-Geständnis    26.300 Aufrufe  48 % Nicht-Follower  Halterate 3 s 64 %   71 Weiterleitungen
  ...

SCHLECHTESTE 5
   0,3x  #11 Liste mit Favorit     1.200 Aufrufe   9 % Nicht-Follower  Halterate 3 s 31 %    2 Weiterleitungen
  ...

WAS DIE ZAHLEN SAGEN
1. Die Halterate nach 3 Sekunden erklärt alles. Die besten fünf liegen im
   Schnitt bei 66 %, die schlechtesten fünf bei 33 %. Alles andere, worüber du
   dir Sorgen machst, hängt an den ersten zwei Sekunden.
2. Die Beiträge, in denen du selbst schlecht aussiehst: im Schnitt 8,1x, alle
   anderen 0,9x. Nur 5 Beiträge, trotzdem das stärkste Signal hier, mit
   deutlichem Abstand.
3. Werkzeug-Listen bringen Aufrufe und sonst nichts. Hohe Reichweite, keine
   Weiterleitungen, keine neuen Follower. Drei deiner schlechtesten fünf.
4. Der Wochentag zeigt nichts. Der Unterschied zwischen Dienstag und Freitag
   ist normale Schwankung. Hör auf, daran zu schrauben.

AUFHÖREN: Listen-Beiträge.
MEHR DAVON: Beiträge mit einem Fehler, der dich etwas gekostet hat, und einer Zahl dazu.
```

Gib die Ergebnisse dann an `/ig-plan` weiter, damit die nächste Woche auf den
eigenen Zahlen der Person aufbaut statt auf Standardwerten. Und an `/ig-viral`,
damit die Vorbilder-Sammlung (`ablage/vorbilder.md`) auf die Formeln gefiltert
wird, die bei genau diesem Konto wirken.

Nichts wird gepostet oder am Konto geändert. Die Person entscheidet und postet
selbst.
