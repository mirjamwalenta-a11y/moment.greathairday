#!/usr/bin/env python3
"""
humanize.py - entfernt die typischen Maschinenspuren aus einem Entwurf.

Drei Durchgänge, in dieser Reihenfolge:

  1. UNSICHTBAR    löscht oder ersetzt Zeichen, die keine Tastatur erzeugt:
                   Nullbreiten-Zeichen, weiche Trennstriche, BOM, Unicode-Tags,
                   geschützte und schmale Leerzeichen. Sie überleben Kopieren
                   und Einfügen und sind die mechanischste Spur in KI-Text.
  2. TYPOGRAFIE    Gedankenstrich -> Komma, Bis-Strich zwischen Zahlen ->
                   Bindestrich, englische typografische Anführungszeichen und
                   » « -> gerade (deutsche „ “ bleiben, die setzt jede deutsche
                   Handy-Tastatur), Auslassungszeichen -> drei Punkte, Aufzählungs-
                   punkt -> Bindestrich. Der Mediopunkt in Genderformen
                   (Kund·innen) bleibt stehen.
  3. WORTLISTE     ersetzt die Floskeln aus slop.json durch einfache Wörter,
                   behält Groß- und Kleinschreibung und lässt Links in Ruhe.
                   Einträge, bei denen ein Ersatz den Satzbau brechen würde
                   ("Es ist wichtig zu beachten, dass ..."), werden nur
                   markiert. Die schreibst du selbst um.

Deutsch und Englisch werden erkannt. Bei deutschem Text werden die deutschen
Einträge ersetzt und englische Floskeln (z. B. "Deep Dive") nur markiert.

Strukturmuster (Dreier-Aufzählung, "nicht nur X, sondern auch Y",
Hashtag-Wand) werden GEMELDET, nie automatisch umgeschrieben: Einen Satz
umzubauen braucht Urteilsvermögen. Das ist deine Aufgabe, nicht die eines
Suchmusters.

Aufruf (Mac: python3 statt python)
  python humanize.py entwurf.txt
  python humanize.py entwurf.txt --bericht
  python humanize.py entwurf.txt -o sauber.txt --bericht
  python humanize.py entwurf.txt --json
  python humanize.py skript.txt --skript --bericht   # Reel-Skript, ein Beat pro Zeile
"""

import argparse
import json
import os
import re
import sys
import unicodedata

HIER = os.path.dirname(os.path.abspath(__file__))
LEX = os.path.join(HIER, "slop.json")

URL_RE = re.compile(r"https?://\S+|www\.\S+|\S+@\S+\.\S+")
ABKUERZUNGEN = ["z. B.", "z.B.", "d. h.", "d.h.", "u. a.", "u.a.", "bzw.", "ca.", "usw.",
                "etc.", "Nr.", "Std.", "Min.", "Mio.", "Mrd.", "Tsd.", "inkl.", "ggf.",
                "evtl.", "vgl.", "Dr.", "Hr.", "Fr.", "max.", "min.", "bspw."]
DE_HINWEISE = {"der", "die", "das", "und", "ist", "nicht", "ich", "du", "ein", "eine",
               "mit", "für", "auf", "zu", "sich", "es", "wir", "dein", "mein", "wie", "was",
               "wenn", "dass", "auch", "noch", "schon", "hat", "habe", "bei", "von", "im",
               "uns", "unser", "unsere", "dir", "dich", "sind", "den", "dem"}
EN_HINWEISE = {"the", "and", "is", "not", "you", "with", "for", "on", "to", "it", "we",
               "your", "my", "how", "what", "if", "that", "also", "still", "has", "have",
               "at", "of", "are", "was", "this", "they", "i"}


def utf8_konsole():
    for s in (sys.stdout, sys.stderr):
        try:
            s.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    try:
        sys.stdin.reconfigure(encoding="utf-8-sig", errors="replace")
    except Exception:
        pass


def lies(pfad):
    if pfad == "-":
        return sys.stdin.read()
    with open(pfad, "rb") as fh:
        roh = fh.read()
    if roh.startswith((b"\xff\xfe", b"\xfe\xff")):
        return roh.decode("utf-16")
    for enc in ("utf-8-sig", "cp1252"):
        try:
            return roh.decode(enc)
        except UnicodeDecodeError:
            continue
    return roh.decode("utf-8", errors="replace")


def lade_liste(pfad=LEX):
    with open(pfad, encoding="utf-8-sig") as fh:
        return json.load(fh)


def ist_deutsch(text):
    t = text.lower()
    w = re.findall(r"[^\W\d_]+", t)
    de = sum(1 for x in w if x in DE_HINWEISE) + 2 * len(re.findall(r"[äöüß„]", t))
    en = sum(1 for x in w if x in EN_HINWEISE)
    return de >= en


def muster(eintrag):
    """Suchmuster für einen Listeneintrag. Wortgrenzen auch bei "?" am Ende."""
    if eintrag.get("regex"):
        kern = eintrag["find"]
    else:
        kern = re.escape(eintrag["find"]).replace(r"\ ", r"\s+").replace(r",\s+", r",?\s+")
    if eintrag.get("beugung"):
        kern = "(" + kern + ")(e|em|en|er|es)?"
    return re.compile(r"(?<!\w)" + kern + r"(?!\w)", re.IGNORECASE)


def _cp(spec):
    """'U+200B' -> 0x200B;  'U+E0000-U+E007F' -> (Anfang, Ende)."""
    if "-" in spec:
        a, b = spec.split("-")
        return (int(a[2:], 16), int(b[2:], 16))
    return int(spec[2:], 16)


def schuetze_links(text):
    """Links durch Platzhalter ersetzen, damit kein Durchgang darin etwas ändert."""
    gefunden = []

    def merke(m):
        gefunden.append(m.group(0))
        return f"\x00URL{len(gefunden) - 1}\x00"

    return URL_RE.sub(merke, text), gefunden


def links_zurueck(text, gefunden):
    for i, url in enumerate(gefunden):
        text = text.replace(f"\x00URL{i}\x00", url)
    return text


def durchgang_unsichtbar(text, lex):
    treffer = []
    for e in lex["invisible"]:
        cp = _cp(e["cp"])
        if isinstance(cp, tuple):
            m = "[" + re.escape(chr(cp[0])) + "-" + re.escape(chr(cp[1])) + "]"
        else:
            m = re.escape(chr(cp))
        n = len(re.findall(m, text))
        if n:
            treffer.append({"name": e["cp"] + " " + e["name"], "count": n,
                            "action": "gelöscht" if e["action"] == "delete" else "Leerzeichen"})
            text = re.sub(m, "" if e["action"] == "delete" else " ", text)
    # Jedes übrige Format-Zeichen (Kategorie Cf) ist per Definition unsichtbar.
    rest = [c for c in text if unicodedata.category(c) == "Cf" and c != "\x00"]
    if rest:
        treffer.append({"name": "weitere unsichtbare Format-Zeichen", "count": len(rest),
                        "action": "gelöscht"})
        text = "".join(c for c in text if unicodedata.category(c) != "Cf" or c == "\x00")
    return text, treffer


DEUTSCHE_ZEICHEN = "„“‚‘’”"   # setzen deutsche Handy-Tastaturen selbst


def durchgang_typografie(text, lex, deutsch=False):
    treffer = []
    striche = len(re.findall(r"\s[–—]\s|—", text))
    for e in lex["typographic"]:
        z = e["from"]
        if deutsch and z in DEUTSCHE_ZEICHEN:
            continue                      # deutsche Anführungszeichen bleiben stehen
        n = text.count(z)
        if not n:
            continue
        if z == "·":
            # Gendern mit Mediopunkt (Kund·innen) bleibt, sonst Bindestrich.
            n = len(re.findall(r"(?<![^\W\d_])·|·(?![^\W\d_])", text))
            if not n:
                continue
            text = re.sub(r"(?<![^\W\d_])·|·(?![^\W\d_])", e["to"], text)
        elif z == "—":
            text = re.sub(r"\s*—\s*", ", ", text)               # "Wort — Wort" -> "Wort, Wort"
        elif z == "–":
            text = re.sub(r"\s*–\s*(?=\d)", "-", text)          # 5–10 -> 5-10
            text = re.sub(r"\s+–\s+", ", ", text)               # als Gedankenstrich benutzt
            text = text.replace("–", "-")
        else:
            text = text.replace(z, e["to"])
        ziel = e["to"].strip() or "(Leerzeichen)"
        if z == "–":
            ziel = "Komma (als Gedankenstrich) oder Bindestrich (zwischen Zahlen)"
        elif z == "—":
            ziel = "Komma"
        treffer.append({"name": f"{z} {e['name']}", "count": n, "to": ziel})
    if striche >= 3:
        treffer.append({"name": "Gedankenstrich-Kette", "count": striche,
                        "to": "Kommas. Lies die Stellen nochmal, oft passt ein Punkt besser"})
    # Ein eingefügtes Komma vor anderem Satzzeichen liest sich falsch.
    text = re.sub(r",\s*([,.;:!?])", r"\1", text)
    text = re.sub(r",\s*\n", "\n", text)
    return text, treffer


def _gross_klein(quelle, ersatz):
    if not ersatz:
        return ersatz
    if quelle.isupper() and len(quelle) > 1:
        return ersatz.upper()
    if quelle[0].isupper():
        return ersatz[0].upper() + ersatz[1:]
    return ersatz


def durchgang_wortliste(text, lex, deutsch):
    """Floskeln ersetzen. Längste zuerst, damit Wendungen vor Einzelwörtern greifen."""
    treffer = []
    markiert = []                 # nur markierte Stellen, vor weiteren Ersetzungen geschützt
    # Deutscher Text: erst die deutschen Einträge, danach die englischen (nur
    # markieren). Englischer Text: nur die englischen Einträge.
    alle = lex["phrases"] + lex["words"]
    reihen = (["de", "en"] if deutsch else ["en"])
    eintraege = []
    for sp in reihen:
        eintraege += sorted([e for e in alle if e.get("sprache", "en") == sp],
                            key=lambda e: len(e["find"]), reverse=True)
    for e in eintraege:
        m = muster(e)
        gefunden = m.findall(text)
        if not gefunden:
            continue
        sprache = e.get("sprache", "en")
        nur_markieren = e["replace"] is None or (deutsch and sprache == "en")
        if nur_markieren:
            def merke(t):
                markiert.append(t.group(0))
                return f"\x00MARK{len(markiert) - 1}\x00"
            text = m.sub(merke, text)
            treffer.append({"find": e.get("anzeige", e["find"]),
                            "replace": "(nur markiert, bitte umformulieren)",
                            "count": len(gefunden), "family": e["family"], "flag": True})
            continue
        ersatz = e["replace"]
        treffer.append({"find": e.get("anzeige", e["find"]), "replace": ersatz or "(gelöscht)",
                        "count": len(gefunden), "family": e["family"], "flag": False})
        if e.get("beugung"):
            text = m.sub(lambda t: _gross_klein(t.group(1), ersatz) + (t.group(2) or ""), text)
        else:
            text = m.sub(lambda t: _gross_klein(t.group(0), ersatz), text)
    for i, original in enumerate(markiert):
        text = text.replace(f"\x00MARK{i}\x00", original)
    # Nach dem Löschen aufräumen. Eine gelöschte Floskel hinterlässt sonst
    # verwaiste Satzzeichen ("System. ." oder eine Zeile, die mit Komma beginnt),
    # und das liest sich schlechter als die Floskel.
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"([.!?])[ \t]+[.!?,;:]+(?=\s|$)", r"\1", text)   # "Gut. ! Weiter"
    text = re.sub(r"(?m)^[ \t]*(?:[,.;:!?]+[ \t]*)+", "", text)
    text = re.sub(r"(?m)^[ \t](?=\S)", "", text)       # ein Leerzeichen vom Löschen.
                                                      # Tiefere Einzüge sind gewollt.
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r",\s*([,.;:!?])", r"\1", text)      # aus Gedankenstrich wurde Komma,
                                                      # dann fiel der Rest weg
    text = text.replace("...", "\x00ELL\x00")          # echte Auslassungspunkte schützen
    text = re.sub(r"\.\s*\.+", ".", text)
    text = re.sub(r"([!?])\s*\.", r"\1", text)
    text = text.replace("\x00ELL\x00", "...")
    text = re.sub(r"(?m)^[ \t]+$", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Aus Gedankenstrich wurde Komma, danach ein Bindewort: lieber ein Punkt.
    text = re.sub(r",\s*(also|so|still|basically|in the end|außerdem|trotzdem|am ende|"
                  r"im grunde)\s*,\s*",
                  lambda t: ". " + t.group(1)[0].upper() + t.group(1)[1:] + ", ", text)
    return text, treffer


def saetze(text):
    t = text
    for a in ABKUERZUNGEN:
        t = t.replace(a, a.replace(".", "\x01"))
    t = re.sub(r"(?<=\d)\.(?=\d)", "\x01", t)
    teile = re.split(r"(?<=[.!?…])[\"“”']?\s+|\n+", t)
    return [p.replace("\x01", ".").strip() for p in teile if p.strip()]


def suche_strukturen(text, lex, deutsch, skript=False):
    meldungen = []
    for s in lex["structures"]:
        try:
            m = re.compile(s["regex"], re.MULTILINE)
        except re.error:
            continue
        gefunden = m.findall(text)
        if gefunden:
            meldungen.append({"name": s["name"], "count": len(gefunden), "fix": s["fix"]})
    # Gleich lange Sätze sind auch ein Strukturmuster.
    laengen = [len(s.split()) for s in saetze(text) if len(s.split()) > 2]
    if len(laengen) >= 4 and not skript:     # im Reel-Skript sind kurze Zeilen gewollt
        mittel = sum(laengen) / len(laengen)
        var = sum((n - mittel) ** 2 for n in laengen) / len(laengen)
        cv = (var ** 0.5) / mittel if mittel else 0
        if cv < 0.35:
            meldungen.append({
                "name": f"Gleich lange Sätze (Schwankung {cv:.2f})".replace(".", ","),
                "count": len(laengen),
                "fix": "Teil einen Satz in zwei. Lass einen anderen lang laufen. "
                       "Maschinen schreiben gleichmäßig.",
            })
    return meldungen


def grossschreibung_zurueck(original, text):
    """Löschen am Satzanfang lässt das nächste Wort klein beginnen.

    Nur für Leute, die ihre Sätze groß beginnen: Wer bewusst alles klein
    schreibt, hat einen Stil, keinen Fehler.
    """
    anfaenge = re.findall(r"(?:^|[.!?]\s+|\n)\s*([^\W\d_])", original)
    if not anfaenge or sum(1 for c in anfaenge if c.isupper()) * 2 < len(anfaenge):
        return text
    # Nach "..." nicht: Auslassungspunkte beenden keinen Satz.
    return re.sub(r"(?:^|(?<=[^.]\. )|(?<=[!?] )|(?<=[.!?]\n)|(?<=\n))\s*([^\W\d_])",
                  lambda m: m.group(0)[:-1] + m.group(1).upper(), text)


def vermenschliche(text, lex, skript=False):
    text = unicodedata.normalize("NFC", text)
    roh = text
    deutsch = ist_deutsch(text)
    text, links = schuetze_links(text)
    text, unsichtbar = durchgang_unsichtbar(text, lex)
    text, typo = durchgang_typografie(text, lex, deutsch)
    text, wortliste = durchgang_wortliste(text, lex, deutsch)
    text = grossschreibung_zurueck(roh, text)
    # Zeilen, von denen nach dem Löschen nur ein Emoji oder ein "und!" übrig
    # ist, fallen weg. Zeilen, die schon vorher so aussahen, bleiben.
    vorher = {z.strip() for z in roh.splitlines()}
    rest = re.compile(r"(?i)(?:und|oder|aber|and|or|but|&)?[\W_]*")
    text = "\n".join(z for z in text.split("\n")
                     if not (z.strip() and rest.fullmatch(z.strip())
                             and z.strip() not in vorher))
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = links_zurueck(text, links)
    return text.strip() + "\n", {
        "language": "de" if deutsch else "en",
        "invisible": unsichtbar,
        "typographic": typo,
        "lexical": wortliste,
        "structures": suche_strukturen(text, lex, deutsch, skript),
    }


humanize = vermenschliche     # Name aus der englischen Fassung


def zeige_bericht(b, out=sys.stderr):
    def kopf(titel):
        print(f"\n{titel}\n" + "-" * len(titel), file=out)

    ersetzt = sum(h["count"] for h in b["invisible"]) \
        + sum(h["count"] for h in b["typographic"] if h["name"] != "Gedankenstrich-Kette") \
        + sum(h["count"] for h in b["lexical"] if not h["flag"])
    markiert = sum(h["count"] for h in b["lexical"] if h["flag"])

    kopf("HUMANIZER-BERICHT")
    print(f"{ersetzt} Maschinenspuren entfernt, {markiert} Floskeln markiert, "
          f"{len(b['structures'])} Strukturmuster zum Umschreiben", file=out)

    if b["invisible"]:
        kopf("1. UNSICHTBARE ZEICHEN")
        for h in b["invisible"]:
            print(f"  {h['count']:>3}x  {h['name']}  -> {h['action']}", file=out)
    if b["typographic"]:
        kopf("2. TYPOGRAFIE")
        for h in b["typographic"]:
            print(f"  {h['count']:>3}x  {h['name']}  -> {h['to']}", file=out)
    ersetzte = [h for h in b["lexical"] if not h["flag"]]
    nur_markiert = [h for h in b["lexical"] if h["flag"]]
    if ersetzte:
        kopf("3. FLOSKELN ERSETZT")
        for h in ersetzte:
            print(f"  {h['count']:>3}x  {h['find']}  -> {h['replace']}   [{h['family']}]",
                  file=out)
    if nur_markiert:
        kopf("4. FLOSKELN MARKIERT  (nicht ersetzt, weil der Satz sonst bricht: selbst umschreiben)")
        for h in nur_markiert:
            print(f"  {h['count']:>3}x  {h['find']}   [{h['family']}]", file=out)
    if b["structures"]:
        kopf("5. STRUKTURMUSTER  (nicht automatisch: selbst umschreiben)")
        for h in b["structures"]:
            print(f"  {h['count']:>3}x  {h['name']}\n        {h['fix']}", file=out)
    if not any(b[k] for k in ("invisible", "typographic", "lexical", "structures")):
        kopf("SAUBER")
        print("  Nichts zu entfernen.", file=out)
    print("", file=out)


def main():
    utf8_konsole()
    ap = argparse.ArgumentParser(description="Entfernt Maschinenspuren aus einem Entwurf.")
    ap.add_argument("input", nargs="?", default="-", help="Datei, oder - für die Eingabe")
    ap.add_argument("-o", "--out", help="bereinigten Text in diese Datei schreiben")
    ap.add_argument("--bericht", "--report", dest="bericht", action="store_true",
                    help="zeigen, was geändert wurde")
    ap.add_argument("--json", action="store_true", help="{text, report} als JSON ausgeben")
    ap.add_argument("--skript", action="store_true",
                    help="Reel-Skript (ein Beat pro Zeile): gleich lange Sätze nicht melden")
    ap.add_argument("--liste", "--lexicon", dest="liste", default=LEX,
                    help="Pfad zur slop.json")
    args = ap.parse_args()

    try:
        roh = lies(args.input)
    except OSError as e:
        print(f"Datei nicht lesbar: {e}", file=sys.stderr)
        sys.exit(2)
    lex = lade_liste(args.liste)
    sauber, bericht = vermenschliche(roh, lex, args.skript)

    if args.json:
        print(json.dumps({"text": sauber, "report": bericht}, indent=2, ensure_ascii=False))
        return
    if args.out:
        with open(args.out, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(sauber)
        print(f"geschrieben: {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(sauber)
        sys.stdout.flush()
    if args.bericht:
        zeige_bericht(bericht)


if __name__ == "__main__":
    main()
