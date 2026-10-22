---
name: ig-carousel
description: >-
  Baut ein Instagram-Karussell: das Titelbild, das zum Wischen bringt, den Text
  Folie für Folie und die Bilddateien in 1080x1350 zum Hochladen. Verwenden,
  wenn jemand sagt „mach ein Karussell“, „mach Folien daraus“, „Wisch-Beitrag“,
  „mach daraus ein Karussell“ oder eine Idee hat, die als Liste oder in
  Schritten funktioniert und als Einzelbild untergehen würde.
---

# ig-carousel

Ein Karussell (Beitrag mit mehreren Bildern zum Durchwischen) ist das Format,
bei dem Leute am längsten hängen bleiben. Ein Wischen zählt als Interaktion,
ein Weiterscrollen nicht. Außerdem bekommt ein Karussell eine zweite Chance:
Instagram kann es jemandem, der beim ersten Mal nicht reagiert hat, noch einmal
zeigen, und zwar ab einer späteren Folie. Deshalb muss auch Folie 2 für sich
allein funktionieren.

Das Format belohnt eine Idee, die in Schritte zerlegt ist. Es bestraft eine
Caption (den Beitragstext), die in Stücke geschnitten wurde.

## Wann statt eines Reels

Nimm ein Karussell, wenn die Idee **eine Reihenfolge hat und nochmal gelesen
werden muss**: Schritte, ein Modell mit mehreren Teilen, ein Vorher-Nachher,
eine Liste, die man sich abfotografiert. Nimm ein Reel, wenn die Idee Bewegung
hat, ein Gesicht oder eine Auflösung, die man passieren sehen muss.

Ist die Idee eine einzige Aussage, ist sie keins von beiden. Gib sie an
`/ig-reel` weiter und sag das.

## Aufbau

6 bis 10 Folien. Erlaubt sind 20, und 20 sind fast immer ein Buch, das keiner
zu Ende liest. Unter 5 fängt das Wischen gar nicht erst an.

```
1         TITELBILD        der Hook. Höchstens 6 Wörter, so groß, dass man sie
                           im Profil-Raster als kleines Vorschaubild noch lesen
                           kann. Darunter eine Zeile mit dem Versprechen.
2         WARUM            warum das wichtig ist, in einem Satz. Diese Folie ist
                           auch ein zweites Titelbild, darf also keine Vorrede
                           sein.
3 bis N   EINE IDEE PRO FOLIE. Eine Überschrift mit 3 bis 7 Wörtern, darunter
                           höchstens 25 Wörter. Braucht eine Folie einen Absatz,
                           sind es zwei Folien.
N+1       ZUSAMMENFASSUNG  alles als Liste. Das ist die Screenshot-Folie.
LETZTE    DIE EINE BITTE   eine Handlung. Speichern, ein Stichwort kommentieren
                           oder folgen. Eine.
```

## Regeln für den Folientext

- **Das Titelbild macht 80 % des Ergebnisses.** Sechs Wörter. Groß. Der Rest
  des Karussells rettet kein Titelbild, bei dem keiner wischt.
- **Für den Ausschnitt im Profil-Raster bauen.** Das Profil-Raster schneidet
  auf ein Hochformat zu, und das genaue Seitenverhältnis hat sich schon
  mehrmals geändert. Bau in 1080x1350 und halte den Text des Titelbilds gut in
  der Mitte, mindestens 120 Pixel weg von jedem Rand. Dann ist der Zuschnitt
  egal.
- **Folien nummerieren** (3/8). Mehr Leute wischen bis zum Ende, wenn sie
  sehen, wo das Ende ist.
- **Keine Folie ist ein Absatz.** Geht es nicht in 25 Wörtern, teil es auf.
- **Die Zusammenfassung ist die Folie, die abfotografiert und weitergeleitet
  wird.** Weiterleitungen sind das stärkste Signal, das man sich verdienen
  kann. Sie muss für sich allein stehen und ohne Zusammenhang lesbar sein.
- **Der Benutzername auf jeder Folie**, klein, in der unteren Ecke. Screenshots
  wandern ohne das Konto weiter.
- **Alternativtext mindestens beim Titelbild.** Das ist eine kurze
  Bildbeschreibung. Vorlese-Programme für Menschen, die schlecht sehen, lesen
  sie vor, und Instagram liest sie auch.

## Die Dateien bauen

Instagram will 1080x1350 (Hochformat 4:5), JPEG oder PNG, bis zu 20 Bilder. So
gehst du vor:

```
1. Die Folien als eine HTML-Datei bauen: eine <section> je Folie, 1080x1350.
2. Jede Folie als PNG-Bild speichern, über einen Browser im Hintergrund,
   der auf dem Rechner schon da ist (Edge oder Chrome). Am einfachsten:
   je Folie eine eigene HTML-Datei und ein Bildschirmfoto im Fenster
   1080x1350 (Browser mit --headless=new --screenshot=folie-01.png
   --window-size=1080,1350 aufrufen).
3. Geht das nicht: die HTML-Datei übergeben. Die Person öffnet sie im
   Browser und sieht alle Folien.
```

Schreib das HTML mit `width:1080px; height:1350px`, einer einzigen
Akzentfarbe und keiner Schrift unter 32px. Gelesen wird auf dem Handy, in etwa
einem Drittel der echten Größe. Gibt es im Projekt eine Marken-Vorgabe oder ein
Designsystem (feste Farben und Schriften), nimm das und erfinde keine eigene
Farbpalette.

Installier nichts ohne Rückfrage.

## Ausgabe

Zuerst den Text Folie für Folie, als nummerierte Liste, die die Person in zehn
Sekunden liest und ändern kann, bevor irgendetwas gebaut wird. Dann die
**Caption**. Für ein Karussell ist das Aufgabe B in `/ig-caption` (die Caption ist
selbst Inhalt). Sie muss hier arbeiten, weil das Titelbild seine sechs Wörter
schon verbraucht hat.

Schick beides durch `/ig-human`. Bau die Dateien erst, wenn die Person den
Text freigegeben hat.

```
KARUSSELL  ·  8 Folien

1  TITELBILD        DIE 18.000-€-KLAUSEL
                    Ein Satz, der jetzt in jedem meiner Angebote steht.
2  WARUM            Der Kunde hat abgenommen. Neun Tage später wollte er das
                    Geld zurück.
3                   WAS DRIN STEHT
                    Zahlung bei Lieferung, nicht bei Freigabe.
...
7  ZUSAMMENFASSUNG  Alle vier Sätze, der Reihe nach.
8  BITTE            Kommentiere KLAUSEL, dann schicke ich dir den ganzen Wortlaut.

Caption: Aufgabe B, Hook in Zeile 1, eine Bitte, 3 Hashtags.
```

Nichts wird hochgeladen. Die Person postet das Karussell selbst.
