---
name: ig-profile
description: >-
  Bewertet ein Instagram-Profil mit bis zu 100 Punkten nach einem
  Bewertungsraster mit 12 Prüfpunkten und schreibt die Teile neu, die Punkte
  kosten: Namensfeld, Bio, Link, Highlights, die drei angepinnten Beiträge,
  Profil-Raster. Verwenden, wenn jemand sagt „optimier mein Profil“, „mach
  meine Bio besser“, „bewerte mein Instagram“, „warum folgt mir keiner“ oder
  das eigene Profil einfügt und wissen will, wie es wirkt.
---

# ig-profile

Fast alle verbessern hier das Falsche. Das Profil ist kein Schaufenster, in dem
Leute stöbern. Es ist ein **Entscheidungsbildschirm**. Man landet dort nach
einem einzigen Reel, und das Profil hat etwa drei Sekunden für eine Frage: Gibt
es hier mehr davon, und ist das für mich?

## Eingabe

Bitte die Person, Folgendes einzufügen oder als Screenshot zu schicken: das
Namensfeld, den Benutzernamen, die Bio, wohin der Link führt, die Namen der
Highlights, was angepinnt ist, und die Titelbilder der ersten neun Beiträge im
Profil-Raster. Ein Screenshot vom oberen Teil des Profils plus die ersten zwei
Reihen reicht für einen ersten Durchgang.

Melde dich nicht im Namen der Person bei Instagram an und frag nie nach ihrem
Passwort.

## Bewerten

Lies `rubric.json` in diesem Ordner. Zwölf Prüfpunkte, zusammen 100 Punkte,
jeder mit einer Beschreibung, wie volle Punktzahl aussieht und woran es
meistens scheitert. Bewerte jeden Prüfpunkt, zeig die Tabelle, nenn die Summe.
Sei ehrlich. Die meisten Profile landen beim ersten Durchgang bei 30 bis 49
Punkten, und eine großzügige Bewertung nützt niemandem.

```
PROFIL-BEWERTUNG  38/100

  Namensfeld          2/12   nur der Name, kein Wort, nach dem jemand sucht
  Bio, erste Zeile    3/12   drei Hauptwörter und ein Kaffee-Emoji
  angepinnte drei     0/10   nichts angepinnt
  Highlights          2/8    „Sonstiges“, „Privat“, „2023“
  Profil-Raster       4/8    sechs von neun Titelbildern zeigen ein Gesicht mitten im Satz
  ...
```

## Dann umschreiben, in dieser Reihenfolge

Fang dort an, wo die meisten Punkte verloren gehen. Schreib nicht alles auf
einmal um. Die Person muss jede Änderung selbst in Instagram eintragen.

**1. Das Namensfeld (30 Zeichen).** Die fett gedruckte Zeile unter dem Foto,
nicht der Benutzername. In diesem Feld sucht die Instagram-Suche, und die
meisten Konten schreiben nur einen Namen hinein. So funktioniert es:
`{Name} | {was du machst, in Wörtern, nach denen gesucht wird}`. Gib drei
Varianten.

**2. Bio, erste Zeile.** Für wen das ist und was sich für diese Leute ändert.
Keine Berufsbezeichnung, keine Adjektive, keine Liste von Rollen mit
senkrechten Strichen dazwischen. Der Rest der 150 Zeichen trägt einen Beleg
oder ein klares Angebot.

**3. Die angepinnten drei.** Drei Plätze, drei verschiedene Aufgaben: der
beste Beweis, die klarste Erklärung des Angebots, die beste Vorstellung der
Person. Das ist die wirksamste Änderung am ganzen Profil, und sie dauert vier
Fingertipps. Ohne angepinnte Beiträge zeigt das Raster oben, was zuletzt
gepostet wurde. Das ist Glückssache.

**4. Highlights.** Vier bis sechs, benannt nach den Fragen, die
Kaufinteressierte stellen: Preise, Ergebnisse, So läuft's, Über mich. Nicht
„Sonstiges“. Der Rest kommt weg.

**5. Der Link.** Ein Ziel, das zu dem passt, was die Bio gerade versprochen
hat. Fünf sind erlaubt. Zwei sind schon ein Menü, und ein Menü bringt weniger
als eine Tür.

**6. Titelbilder im Raster.** Die ersten neun, in Vorschaugröße.
Reel-Titelbilder werden bewusst ausgesucht und nicht einfach als erstes Bild
des Videos gelassen. Vier Wörter Text auf einem Titelbild machen das Raster
auf einen Blick lesbar.

## Ausgabe

Bewertungstabelle, dann die neuen Texte als kopierfertige Blöcke, das
Wichtigste zuerst, jeder durch `/ig-human` geschickt. Bewerte am Ende neu und
zeig den Unterschied ehrlich. Kommt die Überarbeitung auf 84 und nicht auf 98,
sag 84, und sag, was für den Rest fehlt. Meistens sind das ein Raster, eine
Story-Gewohnheit und ein angepinnter Beitrag, den es noch nicht gibt. Nichts
davon ist eine Textänderung.

Dieser Skill speichert nichts in Instagram. Die Person ändert jedes Feld
selbst.
