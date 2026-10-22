// Wortliste für den „Klingt das nach KI?“-Check (ki-check.js).
// Deutsche Floskeln mit einfachem Ersatz (r = Ersatz, "" = löschen,
// null = nur markieren, weil ein Ersatz den Satz brechen würde;
// b = Endung übernehmen: innovative → neue) und Strukturmuster, die nur
// gemeldet werden. Die Liste ist zum Bearbeiten da: Sagt Mirjam ein Wort
// wirklich so, einfach den Eintrag löschen.
//
// Herkunft: deutsche Fassung der Skills aus „instagram-agent-skill“,
// übersetzt und erweitert von MakersLab, beide MIT-lizenziert.
// Lizenztext siehe LIZENZEN-DRITTE.md.
//
// MIT License
// Copyright (c) 2026 Jake Schincariol
// Änderungen und Übersetzung © 2026 MakersLab, ebenfalls MIT.

const KI_CHECK_DATEN = {
 "floskeln": [
  {
   "f": "in der heutigen schnelllebigen Welt",
   "r": "heute",
   "k": "Einstiege"
  },
  {
   "f": "in unserer schnelllebigen Welt",
   "r": "heute",
   "k": "Einstiege"
  },
  {
   "f": "in der heutigen digitalen Welt",
   "r": "heute",
   "k": "Einstiege"
  },
  {
   "f": "in der heutigen Zeit",
   "r": "heute",
   "k": "Einstiege"
  },
  {
   "f": "im heutigen digitalen Zeitalter",
   "r": "heute",
   "k": "Einstiege"
  },
  {
   "f": "im digitalen Zeitalter",
   "r": "heute",
   "k": "Einstiege"
  },
  {
   "f": "in Zeiten von Social Media",
   "r": "heute",
   "k": "Einstiege"
  },
  {
   "f": "lass(?:t)? uns (?:[\\p{L}\\p{N}_]+ ){0,2}eintauchen",
   "r": "",
   "k": "Einstiege",
   "x": 1,
   "a": "Lass uns (direkt) eintauchen"
  },
  {
   "f": "tauchen wir (?:[\\p{L}\\p{N}_]+ ){0,2}ein(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))",
   "r": "",
   "k": "Einstiege",
   "x": 1,
   "a": "Tauchen wir (tiefer) ein"
  },
  {
   "f": "tauch(?:e|t)? (?:[\\p{L}\\p{N}_]+ ){0,2}ein in",
   "r": null,
   "k": "Einstiege",
   "x": 1,
   "a": "Tauche ein in ..."
  },
  {
   "f": "lass(?:t)? uns (?:[\\p{L}\\p{N}_]+ )?loslegen",
   "r": "",
   "k": "Einstiege",
   "x": 1,
   "a": "Lass uns loslegen"
  },
  {
   "f": "es ist wichtig zu beachten, dass",
   "r": null,
   "k": "Einstiege"
  },
  {
   "f": "es ist wichtig zu beachten",
   "r": "wichtig",
   "k": "Einstiege"
  },
  {
   "f": "es ist wichtig zu wissen, dass",
   "r": null,
   "k": "Einstiege"
  },
  {
   "f": "es ist erwähnenswert, dass",
   "r": null,
   "k": "Einstiege"
  },
  {
   "f": "es sei darauf hingewiesen, dass",
   "r": null,
   "k": "Einstiege"
  },
  {
   "f": "es ist kein Geheimnis, dass",
   "r": null,
   "k": "Einstiege"
  },
  {
   "f": "die harte Wahrheit ist, dass",
   "r": null,
   "k": "Einstiege"
  },
  {
   "f": "die harte Wahrheit ist",
   "r": "",
   "k": "Einstiege"
  },
  {
   "f": "die harte Wahrheit",
   "r": "",
   "k": "Einstiege"
  },
  {
   "f": "Hand aufs Herz",
   "r": "",
   "k": "Einstiege"
  },
  {
   "f": "seien wir (?:mal )?ehrlich",
   "r": "",
   "k": "Einstiege",
   "x": 1,
   "a": "Seien wir (mal) ehrlich"
  },
  {
   "f": "wir alle kennen das",
   "r": "",
   "k": "Einstiege"
  },
  {
   "f": "wir kennen es alle",
   "r": "",
   "k": "Einstiege"
  },
  {
   "f": "stell dir eine Welt vor",
   "r": null,
   "k": "Einstiege"
  },
  {
   "f": "hast du dich jemals gefragt",
   "r": null,
   "k": "Einstiege"
  },
  {
   "f": "ich freue mich(?: sehr)?,? (?:euch |dir |ihnen )?(?:mitteilen|bekannt ?geben|verkünden) zu (?:können|dürfen)",
   "r": null,
   "k": "Einstiege",
   "x": 1,
   "a": "Ich freue mich, euch mitteilen zu können, ..."
  },
  {
   "f": "mit stolz (?:kann|darf) ich verkünden",
   "r": null,
   "k": "Einstiege",
   "x": 1,
   "a": "Mit Stolz kann ich verkünden"
  },
  {
   "f": "ohne (?:weitere )?umschweife",
   "r": "",
   "k": "Einstiege",
   "x": 1,
   "a": "Ohne (weitere) Umschweife"
  },
  {
   "f": "schnall dich an",
   "r": "",
   "k": "Einstiege"
  },
  {
   "f": "schnallt euch an",
   "r": "",
   "k": "Einstiege"
  },
  {
   "f": "Spoiler-Alarm",
   "r": "",
   "k": "Einstiege"
  },
  {
   "f": "Spoiler Alert",
   "r": "",
   "k": "Einstiege"
  },
  {
   "f": "hör auf zu scrollen",
   "r": "",
   "k": "Einstiege"
  },
  {
   "f": "nicht weiterscrollen",
   "r": "",
   "k": "Einstiege"
  },
  {
   "f": "stopp,? nicht (?:weiter)?scrollen",
   "r": "",
   "k": "Einstiege",
   "x": 1,
   "a": "Stopp, nicht weiterscrollen"
  },
  {
   "f": "in diesem (?:video|reel|beitrag) (?:zeige|zeig) ich (?:dir|euch)",
   "r": null,
   "k": "Einstiege",
   "x": 1,
   "a": "In diesem Video zeige ich dir ..."
  },
  {
   "f": "im heutigen Video",
   "r": null,
   "k": "Einstiege"
  },
  {
   "f": "schau(?:t)? (?:unbedingt )?bis zum ende",
   "r": "",
   "k": "Einstiege",
   "x": 1,
   "a": "Schau bis zum Ende"
  },
  {
   "f": "bleib(?:t)? bis zum ende dran",
   "r": "",
   "k": "Einstiege",
   "x": 1,
   "a": "Bleib bis zum Ende dran"
  },
  {
   "f": "du wirst nicht glauben",
   "r": null,
   "k": "Einstiege"
  },
  {
   "f": "niemand spricht darüber",
   "r": "das machen wenige",
   "k": "Einstiege"
  },
  {
   "f": "keiner spricht darüber",
   "r": "das machen wenige",
   "k": "Einstiege"
  },
  {
   "f": "darüber spricht niemand",
   "r": "das machen wenige",
   "k": "Einstiege"
  },
  {
   "f": "das hat alles verändert",
   "r": "das hat geholfen",
   "k": "Einstiege"
  },
  {
   "f": "das ändert alles",
   "r": "das hilft",
   "k": "Einstiege"
  },
  {
   "f": "das ist dein Zeichen",
   "r": null,
   "k": "Einstiege"
  },
  {
   "f": "in einer welt,? in der",
   "r": null,
   "k": "Einstiege",
   "x": 1,
   "a": "In einer Welt, in der ..."
  },
  {
   "f": "zusammenfassend lässt sich sagen, dass",
   "r": null,
   "k": "Schlusssätze"
  },
  {
   "f": "zusammenfassend lässt sich sagen",
   "r": "kurz gesagt",
   "k": "Schlusssätze"
  },
  {
   "f": "abschließend lässt sich sagen, dass",
   "r": null,
   "k": "Schlusssätze"
  },
  {
   "f": "abschließend lässt sich sagen",
   "r": "kurz gesagt",
   "k": "Schlusssätze"
  },
  {
   "f": "lass(?:t)? das (?:mal )?sacken",
   "r": "",
   "k": "Schlusssätze",
   "x": 1,
   "a": "Lass das (mal) sacken"
  },
  {
   "f": "lies das (?:nochmal|noch einmal)",
   "r": "",
   "k": "Schlusssätze",
   "x": 1,
   "a": "Lies das nochmal"
  },
  {
   "f": "die Wahl liegt bei dir",
   "r": "",
   "k": "Schlusssätze"
  },
  {
   "f": "die zukunft ist (?:jetzt|da|hier)",
   "r": "",
   "k": "Schlusssätze",
   "x": 1,
   "a": "Die Zukunft ist jetzt"
  },
  {
   "f": "was sind (?:deine|eure) gedanken dazu\\?",
   "r": "",
   "k": "Schlusssätze",
   "x": 1,
   "a": "Was sind deine Gedanken dazu?"
  },
  {
   "f": "lass(?:t)? (?:es )?mich (?:es )?in den kommentaren wissen",
   "r": "",
   "k": "Schlusssätze",
   "x": 1,
   "a": "Lass es mich in den Kommentaren wissen"
  },
  {
   "f": "am Ende des Tages",
   "r": "am Ende",
   "k": "Schlusssätze"
  },
  {
   "f": "in diesem Sinne",
   "r": "",
   "k": "Schlusssätze"
  },
  {
   "f": "der Rest ist Geschichte",
   "r": "",
   "k": "Schlusssätze"
  },
  {
   "f": "spul(?:en wir)? vor bis heute",
   "r": "heute",
   "k": "Bindewörter",
   "x": 1,
   "a": "Spul vor bis heute"
  },
  {
   "f": "folg(?:e|t)? (?:mir|uns) für mehr(?: tipps| inhalte| content| ideen| inspiration| davon)?",
   "r": "",
   "k": "Schlusssätze",
   "x": 1,
   "a": "Folge mir für mehr (Tipps)"
  },
  {
   "f": "folge für mehr",
   "r": "",
   "k": "Schlusssätze"
  },
  {
   "f": "markier(?:e|t)? (?:jemanden|eine person|einen freund|eine freundin),? (?:der|die|den) (?:das|dies) (?:braucht|sehen muss|wissen muss)",
   "r": "",
   "k": "Schlusssätze",
   "x": 1,
   "a": "Markiere jemanden, der das braucht"
  },
  {
   "f": "teil(?:e|t)? (?:das|diesen beitrag|dieses reel) mit (?:jemandem|einer person),? (?:der|die) (?:das|es) (?:braucht|wissen muss|sehen muss)",
   "r": "",
   "k": "Schlusssätze",
   "x": 1,
   "a": "Teile das mit jemandem, der es braucht"
  },
  {
   "f": "speicher(?:e|t)? (?:dir|euch) (?:das|diesen beitrag|dieses reel) für später",
   "r": "",
   "k": "Schlusssätze",
   "x": 1,
   "a": "Speichere dir das für später"
  },
  {
   "f": "doppeltipp,? wenn",
   "r": null,
   "k": "Schlusssätze",
   "x": 1,
   "a": "Doppeltipp, wenn ..."
  },
  {
   "f": "like,? wenn",
   "r": null,
   "k": "Schlusssätze",
   "x": 1,
   "a": "Like, wenn ..."
  },
  {
   "f": "der Schlüssel zum Erfolg",
   "r": "das Wichtigste",
   "k": "Hauptwörter"
  },
  {
   "f": "Schlüssel zum Erfolg",
   "r": null,
   "k": "Hauptwörter"
  },
  {
   "f": "das Geheimrezept",
   "r": "die Methode",
   "k": "Hauptwörter"
  },
  {
   "f": "mein Geheimrezept",
   "r": "meine Methode",
   "k": "Hauptwörter"
  },
  {
   "f": "dein Geheimrezept",
   "r": "deine Methode",
   "k": "Hauptwörter"
  },
  {
   "f": "unser Geheimrezept",
   "r": "unsere Methode",
   "k": "Hauptwörter"
  },
  {
   "f": "ein echter Gamechanger",
   "r": "ein großer Schritt",
   "k": "Hauptwörter"
  },
  {
   "f": "ein Gamechanger",
   "r": "ein großer Schritt",
   "k": "Hauptwörter"
  },
  {
   "f": "ein absolutes Must-have",
   "r": "Pflicht",
   "k": "Hauptwörter"
  },
  {
   "f": "digitale Landschaft",
   "r": null,
   "k": "Hauptwörter"
  },
  {
   "f": "(?:auf|aufs) (?:das |ein )?(?:nächste|neues) level",
   "r": null,
   "k": "Verben",
   "x": 1,
   "a": "auf das nächste Level"
  },
  {
   "f": "(?:dein|euer|ihr) (?:volles )?potenzial (?:entfalten|ausschöpfen|freisetzen|entfesseln)",
   "r": null,
   "k": "Verben",
   "x": 1,
   "a": "Dein volles Potenzial entfalten"
  },
  {
   "f": "der Algorithmus liebt",
   "r": "Instagram zeigt öfter",
   "k": "Hauptwörter"
  },
  {
   "f": "den algorithmus (?:austricksen|schlagen|knacken|hacken)",
   "r": "Reichweite bekommen",
   "k": "Hauptwörter",
   "x": 1,
   "a": "den Algorithmus austricksen"
  },
  {
   "f": "über nacht viral (?:gehen|werden)",
   "r": "Reichweite bekommen",
   "k": "Hauptwörter",
   "x": 1,
   "a": "über Nacht viral gehen"
  },
  {
   "f": "wirkt wahre Wunder",
   "r": "hilft sehr",
   "k": "Verben"
  },
  {
   "f": "wirken wahre Wunder",
   "r": "helfen sehr",
   "k": "Verben"
  },
  {
   "f": "nicht zu unterschätzen",
   "r": "wichtig",
   "k": "Eigenschaftswörter"
  },
  {
   "f": "innovativ",
   "r": "neu",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "bahnbrechend",
   "r": "neu",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "revolutionär",
   "r": "neu",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "zukunftsweisend",
   "r": "neu",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "wegweisend",
   "r": "wichtig",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "essenziell",
   "r": "wichtig",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "essentiell",
   "r": "wichtig",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "unerlässlich",
   "r": "nötig",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "maßgeschneidert",
   "r": "passend",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "nahtlos",
   "r": "reibungslos",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "ganzheitlich",
   "r": "vollständig",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "umfassend",
   "r": "vollständig",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "facettenreich",
   "r": "vielseitig",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "vielschichtig",
   "r": "kompliziert",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "transformativ",
   "r": "groß",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "atemberaubend",
   "r": "schön",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "fesselnd",
   "r": "interessant",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "herausragend",
   "r": "sehr gut",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "erstklassig",
   "r": "sehr gut",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "zielgerichtet",
   "r": "gezielt",
   "k": "Eigenschaftswörter",
   "b": 1
  },
  {
   "f": "Mehrwert",
   "r": "Nutzen",
   "k": "Hauptwörter"
  },
  {
   "f": "Ökosystem",
   "r": "System",
   "k": "Hauptwörter"
  },
  {
   "f": "Paradigmenwechsel",
   "r": "Umbruch",
   "k": "Hauptwörter"
  },
  {
   "f": "Lifehack",
   "r": "Trick",
   "k": "Hauptwörter"
  },
  {
   "f": "Life-Hack",
   "r": "Trick",
   "k": "Hauptwörter"
  },
  {
   "f": "Hack",
   "r": "Trick",
   "k": "Hauptwörter"
  },
  {
   "f": "Gamechanger",
   "r": null,
   "k": "Hauptwörter"
  },
  {
   "f": "Game-Changer",
   "r": null,
   "k": "Hauptwörter"
  },
  {
   "f": "Game Changer",
   "r": null,
   "k": "Hauptwörter"
  },
  {
   "f": "Must-have",
   "r": null,
   "k": "Hauptwörter"
  },
  {
   "f": "Synergie",
   "r": null,
   "k": "Hauptwörter"
  },
  {
   "f": "Synergien",
   "r": null,
   "k": "Hauptwörter"
  },
  {
   "f": "Geheimrezept",
   "r": null,
   "k": "Hauptwörter"
  },
  {
   "f": "Next Level",
   "r": null,
   "k": "Hauptwörter"
  },
  {
   "f": "darüber hinaus",
   "r": "außerdem",
   "k": "Bindewörter"
  },
  {
   "f": "des Weiteren",
   "r": "außerdem",
   "k": "Bindewörter"
  },
  {
   "f": "nichtsdestotrotz",
   "r": "trotzdem",
   "k": "Bindewörter"
  },
  {
   "f": "letztendlich",
   "r": "am Ende",
   "k": "Bindewörter"
  },
  {
   "f": "letztlich",
   "r": "am Ende",
   "k": "Bindewörter"
  },
  {
   "f": "folglich",
   "r": "also",
   "k": "Bindewörter"
  },
  {
   "f": "somit",
   "r": "also",
   "k": "Bindewörter"
  },
  {
   "f": "demzufolge",
   "r": "also",
   "k": "Bindewörter"
  },
  {
   "f": "zweifellos",
   "r": "sicher",
   "k": "Bindewörter"
  },
  {
   "f": "zweifelsohne",
   "r": "sicher",
   "k": "Bindewörter"
  },
  {
   "f": "im Wesentlichen",
   "r": "im Grunde",
   "k": "Bindewörter"
  },
  {
   "f": "insbesondere",
   "r": "vor allem",
   "k": "Bindewörter"
  },
  {
   "f": "alles in allem",
   "r": "insgesamt",
   "k": "Bindewörter"
  },
  {
   "f": "last but not least",
   "r": "zum Schluss",
   "k": "Bindewörter"
  },
  {
   "f": "hinsichtlich",
   "r": null,
   "k": "Bindewörter"
  },
  {
   "f": "im Hinblick auf",
   "r": null,
   "k": "Bindewörter"
  },
  {
   "f": "in Bezug auf",
   "r": null,
   "k": "Bindewörter"
  },
  {
   "f": "revolutionieren",
   "r": "verändern",
   "k": "Verben"
  },
  {
   "f": "revolutioniert",
   "r": "verändert",
   "k": "Verben"
  },
  {
   "f": "revolutionierte",
   "r": "veränderte",
   "k": "Verben"
  },
  {
   "f": "boosten",
   "r": "steigern",
   "k": "Verben"
  },
  {
   "f": "boostet",
   "r": "steigert",
   "k": "Verben"
  },
  {
   "f": "beleuchten",
   "r": null,
   "k": "Verben"
  },
  {
   "f": "beleuchtet",
   "r": null,
   "k": "Verben"
  },
  {
   "f": "entfesseln",
   "r": null,
   "k": "Verben"
  },
  {
   "f": "entfessle",
   "r": null,
   "k": "Verben"
  },
  {
   "f": "eintauchen",
   "r": null,
   "k": "Verben"
  }
 ],
 "strukturen": [
  {
   "id": "nicht-nur",
   "rx": "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))nicht nur(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))[^.!?\\n]{2,80}(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))sondern auch(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))",
   "fl": "igu",
   "name": "„Nicht nur X, sondern auch Y“",
   "fix": "Sag das eine, was du meinst. Oder mach zwei Sätze daraus."
  },
  {
   "id": "geht-nicht-um",
   "rx": "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))es geht nicht (?:nur )?um(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))[^.!?\\n]{2,80}[,.;]\\s*(?:sondern|es geht) um(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))",
   "fl": "igu",
   "name": "„Es geht nicht um X, sondern um Y“",
   "fix": "Fang mit Y an. Die Umkehr ist das Erkennungszeichen."
  },
  {
   "id": "das-ergebnis",
   "rx": "^\\s*(?:und )?(?:das ergebnis|der clou|das beste daran|der haken|der knackpunkt|die lösung|die antwort|der grund)\\?\\s*$",
   "fl": "imgu",
   "name": "Rhetorische Kurzfrage als eigene Zeile („Das Ergebnis?“)",
   "fix": "Sag die Antwort gleich im Satz, statt eine Enthüllung zu inszenieren."
  },
  {
   "id": "was-ich-gelernt",
   "rx": "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))(?:hier ist|das ist|das sind|hier sind),? was (?:ich|wir) gelernt (?:habe|haben)(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))|(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))das habe ich (?:daraus )?gelernt:",
   "fl": "igu",
   "name": "„Hier ist, was ich gelernt habe“",
   "fix": "Sag die Lektion. Spar dir die Ankündigung."
  },
  {
   "id": "dreier",
   "rx": "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))[\\p{L}\\p{N}_]+(?: [\\p{L}\\p{N}_]+)?, [\\p{L}\\p{N}_]+(?: [\\p{L}\\p{N}_]+)? und [\\p{L}\\p{N}_]+(?: [\\p{L}\\p{N}_]+)?[.!]",
   "fl": "igu",
   "name": "Dreier-Aufzählung",
   "fix": "Zwei Dinge oder vier. Drei ist der Standard-Rhythmus von KI-Texten."
  },
  {
   "id": "als-ki",
   "rx": "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))als (?:eine )?(?:ki|künstliche intelligenz|sprachmodell)(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))",
   "fl": "igu",
   "name": "KI spricht über sich selbst",
   "fix": "Satz löschen."
  },
  {
   "id": "fazit-einstieg",
   "rx": "^\\s*(?:zusammenfassend|abschließend|alles in allem|letztendlich|fazit:)",
   "fl": "imgu",
   "name": "Aufsatz-Schluss als Einstieg („Zusammenfassend …“)",
   "fix": "Ein Beitrag braucht keinen Schlussabsatz."
  },
  {
   "id": "kommentar-koeder",
   "rx": "(?:(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))was meint ihr\\?|(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))was denkt ihr\\?|(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))wer noch\\?|(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))wer kennt's\\?|(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))seht ihr das auch so\\?|(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))stimmt's\\?|(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))bin ich (?:der|die) einzige(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))\\??)\\s*$",
   "fl": "imgu",
   "name": "Reflex-Frage am Ende („Was meint ihr?“)",
   "fix": "Stell eine Frage, die nur du stellen kannst, zu genau dem, was darüber steht."
  },
  {
   "id": "scroll-stopp",
   "rx": "^\\s*(?:hör(?:t)? auf zu scrollen|stopp[,!.]?\\s*nicht (?:weiter)?scrollen|nicht (?:weiter)?scrollen|scroll nicht weiter)(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))",
   "fl": "imgu",
   "name": "„Hör auf zu scrollen“ als Einstieg",
   "fix": "Der Stopp muss die Aussage selbst sein. Wer um Aufmerksamkeit bittet, hat sie sich nicht verdient."
  },
  {
   "id": "video-vorrede",
   "rx": "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))(?:in diesem (?:video|reel|beitrag)|im heutigen (?:video|reel)|heute zeige? ich (?:dir|euch)|ich zeige? (?:dir|euch) heute)(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))",
   "fl": "igu",
   "name": "Video-Vorrede („In diesem Video zeige ich dir …“)",
   "fix": "Streich sie und fang beim Ergebnis an. Die ersten zwei Sekunden entscheiden das ganze Reel."
  },
  {
   "id": "folge-koeder",
   "rx": "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))(?:folg(?:e|t)? (?:mir |uns )?für mehr|markier(?:e|t)? jemanden|teil(?:e|t)? (?:das|dies) mit jemandem|doppeltipp|like,? wenn|kommentier(?:e|t)? unten,? wenn)(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))",
   "fl": "igu",
   "name": "Reflex-Bitte (folgen, markieren, liken)",
   "fix": "Bitte um die eine Handlung, die dieser Beitrag wirklich verdient. Die allgemeine Bitte bringt dein Publikum dazu, jede Bitte zu überlesen."
  },
  {
   "id": "spannend",
   "rx": "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))spannend[\\p{L}\\p{N}_]*(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))(?=.*(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))spannend[\\p{L}\\p{N}_]*(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_])))",
   "fl": "isgu",
   "name": "„spannend“-Inflation (mehr als einmal)",
   "fix": "Einmal „spannend“ geht. Ab dem zweiten Mal: Zeig, was spannend ist, statt es zu behaupten."
  },
  {
   "id": "gedankenstrich-kette",
   "rx": "(?:\\s[–—]\\s|—)(?=(?:.*?(?:\\s[–—]\\s|—)){2})",
   "fl": "sgu",
   "name": "Gedankenstrich-Kette (drei oder mehr Gedankenstriche)",
   "fix": "Mach aus den Gedankenstrichen Punkte oder Kommas. Drei in einem kurzen Text wirken wie KI."
  },
  {
   "id": "welt-einstieg",
   "rx": "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))in einer welt,? in der(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))",
   "fl": "igu",
   "name": "„In einer Welt, in der …“",
   "fix": "Fang beim konkreten Fall an, nicht bei der ganzen Welt."
  },
  {
   "id": "bist-du-bereit",
   "rx": "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))bist du bereit(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))[^.!?\\n]{0,60}\\?",
   "fl": "igu",
   "name": "„Bist du bereit, …?“",
   "fix": "Frag nicht, ob jemand bereit ist. Sag, was passiert."
  },
  {
   "id": "rocket",
   "rx": "[\\u{1F680}\\u{1F525}\\u{1F4A1}\\u2728\\u{1F3AF}]",
   "fl": "gu",
   "name": "Raketen-, Feuer-, Glühbirnen-, Funkel- oder Zielscheiben-Emoji",
   "fix": "Höchstens ein Emoji, und nicht eins von diesen fünf."
  },
  {
   "id": "hashtag-wall",
   "rx": "(?:#[\\p{L}\\p{N}_]+[ \\t]*){5,}",
   "fl": "gu",
   "name": "Hashtag-Wand (5 oder mehr am Stück)",
   "fix": "Höchstens fünf, besser drei, die das Thema benennen."
  },
  {
   "id": "emoji-bullets",
   "rx": "^\\s*[\\u{1F300}-\\u{1FAFF}✅➡⬅✔✨]\\s*\\S",
   "fl": "mgu",
   "name": "Aufzählung mit Emoji statt Strichen",
   "fix": "Nimm Bindestriche oder Zeilenumbrüche. Emoji-Aufzählungen sehen am meisten nach Vorlage aus."
  },
  {
   "id": "caps-shout",
   "rx": "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))[A-ZÄÖÜ]{3,}(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))(?:\\s+(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))[A-ZÄÖÜ]{3,}(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))){2,}",
   "fl": "gu",
   "name": "Drei oder mehr Wörter in GROSSBUCHSTABEN hintereinander",
   "fix": "Großbuchstaben sind ein Lautstärkeregler, kein Textmarker. Höchstens ein Wort."
  }
 ],
 "unsichtbar": [
  "U+200B",
  "U+200C",
  "U+200D",
  "U+2060",
  "U+FEFF",
  "U+00AD",
  "U+180E",
  "U+061C",
  "U+200E",
  "U+200F",
  "U+E0000-U+E007F",
  "U+2063"
 ],
 "leerzeichen": [
  "U+00A0",
  "U+202F",
  "U+2009",
  "U+2007",
  "U+2003",
  "U+2002"
 ]
};
