#!/usr/bin/env python3
"""
detect.py - fünf Prüfungen, die bewerten, wie maschinell ein Entwurf wirkt.

Was das ist: fünf lokale Faustregeln, angelehnt an die Signale, auf die
öffentliche KI-Detektoren achten: wie stark die Satzlängen schwanken, wie
konkret der Text ist, wie viele Floskeln drin sind, typografische Spuren und
wie sehr der Text nach einer echten Person klingt. Alles wird auf deinem
Rechner aus dem Text berechnet. Nichts wird hochgeladen.

Was das NICHT ist: einer der bekannten Online-KI-Detektoren. Es ruft keinen
solchen Dienst auf und kann deren Urteil nicht versprechen. Es misst die
Dinge, auf die sie alle achten, deshalb verschiebt das Beheben meist auch
deren Zahlen. Mehr lässt sich ehrlich nicht sagen.

Deutsch und Englisch werden erkannt. Bei deutschem Text zählt die Prüfung
STIMME Umgangssprache ("gibt's", "mal", "halt", "eben", "hab") statt
englischer Kurzformen, und großgeschriebene Wörter gelten nicht automatisch
als Namen (im Deutschen schreibt man alle Hauptwörter groß).

Jede Prüfung gibt 0 bis 100 MENSCH-Punkte. Mehr ist besser.

Aufruf (Mac: python3 statt python)
  python detect.py entwurf.txt
  python detect.py entwurf.txt --json
  python detect.py vorher.txt nachher.txt      # zwei Fassungen vergleichen
  python detect.py skript.txt --skript         # Reel-Skript, ein Beat pro Zeile

Bei Reel-Skripten sind kurze, ähnlich lange Zeilen gewollt (ein Beat pro
Zeile). Mit --skript zählt SCHWANKUNG dann nicht zum Urteil.
"""

import argparse
import json
import os
import re
import statistics
import sys
import unicodedata

HIER = os.path.dirname(os.path.abspath(__file__))
LEX = os.path.join(HIER, "slop.json")

WORT_RE = re.compile(r"[^\W\d_]+(?:['’][^\W\d_]+)?")
EN_KURZFORMEN = re.compile(r"\b\w+['’](?:s|t|re|ve|ll|d|m)\b", re.IGNORECASE)
DE_UMGANGSSPRACHE = re.compile(
    r"\b(?:\w+['’]s|so['’]n|['’]?nen|['’]ne|hab|haste|isses|nich|nix|nee|grad|gern|mal|halt"
    r"|eben|eh|echt|doch|schon|ja|tja|naja|okay|ok|krass|kriegst|kriegt|kriegen|bisschen"
    r"|drauf|drin|dran|rein|raus|rüber|runter|mega|super|klar|genau|gibt['’]s|geht['’]s"
    r"|war['’]s|wär['’]s|hätt|würd|zack|ehrlich)\b",
    re.IGNORECASE)
PRONOMEN = re.compile(
    r"\b(?:i|me|my|mine|we|us|our|you|your|ich|mich|mir|mein|meine|meinen|meinem|meiner"
    r"|wir|uns|unser|unsere|unseren|unserem|unserer|du|dich|dir|dein|deine|deinen|deinem"
    r"|deiner|ihr|euch|euer|eure|euren|eurem|eurer)\b",
    re.IGNORECASE)
ZAHLEN = re.compile(r"\b\d[\d.,]*%?|[€$]\s?\d")
ZAHLWORT = re.compile(
    r"\b(?:zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|zwanzig|dreißig"
    r"|vierzig|fünfzig|hundert|tausend|million(?:en)?|hälfte|doppelt)\w*\b", re.IGNORECASE)
MONATE_TAGE = re.compile(
    r"\b(?:januar|jänner|februar|märz|april|mai|juni|juli|august|september|oktober|november"
    r"|dezember|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\b", re.IGNORECASE)
KUERZEL = re.compile(r"\b(?!(?:DER|DIE|DAS|UND|ICH|DU|WIR|OK|JA|NIE|NUR|MEHR|ALLE|NEU)\b)"
                     r"[A-ZÄÖÜ]{2,4}\b|\b[a-zäöü]+[A-ZÄÖÜ]\w*|\b[A-ZÄÖÜ][a-zäöü]+[A-ZÄÖÜ]\w*")
NAMENSPAAR = re.compile(r"(?<=[a-zäöüß,;:] )[A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ][a-zäöüß]+\b")
EN_NAME = re.compile(r"(?<![.!?]\s)(?<!^)\b[A-Z][a-z]{2,}\b", re.MULTILINE)
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


def ist_deutsch(text):
    t = text.lower()
    w = re.findall(r"[^\W\d_]+", t)
    de = sum(1 for x in w if x in DE_HINWEISE) + 2 * len(re.findall(r"[äöüß„]", t))
    en = sum(1 for x in w if x in EN_HINWEISE)
    return de >= en


def muster(eintrag):
    if eintrag.get("regex"):
        kern = eintrag["find"]
    else:
        kern = re.escape(eintrag["find"]).replace(r"\ ", r"\s+").replace(r",\s+", r",?\s+")
    if eintrag.get("beugung"):
        kern = "(" + kern + ")(e|em|en|er|es)?"
    return re.compile(r"(?<!\w)" + kern + r"(?!\w)", re.IGNORECASE)


def clamp(n):
    return max(0.0, min(100.0, n))


def skala(wert, mensch, maschine):
    """Wert auf 0-100 abbilden: `mensch` -> 100, `maschine` -> 0."""
    if mensch == maschine:
        return 50.0
    return clamp((wert - maschine) / (mensch - maschine) * 100)


def de_zahl(x, stellen=1):
    return f"{x:.{stellen}f}".replace(".", ",")


def saetze(text):
    t = text
    for a in ABKUERZUNGEN:
        t = t.replace(a, a.replace(".", "\x01"))
    t = re.sub(r"(?<=\d)\.(?=\d)", "\x01", t)
    teile = re.split(r"(?<=[.!?…])[\"“”']?\s+|\n+", t)
    return [p.replace("\x01", ".").strip() for p in teile if len(p.split()) > 1]


def woerter(text):
    return WORT_RE.findall(text)


def pruefe_schwankung(text, lex, deutsch):
    """Menschen wechseln die Satzlänge stark. Modelle schreiben gleichmäßig."""
    laengen = [len(s.split()) for s in saetze(text)]
    if len(laengen) < 4:
        return 50.0, "zu kurz für ein Urteil"
    mittel = statistics.mean(laengen)
    cv = statistics.pstdev(laengen) / mittel if mittel else 0
    punkte = skala(cv, mensch=0.70, maschine=0.22)
    return punkte, f"Schwankung {de_zahl(cv, 2)} über {len(laengen)} Sätze (Ziel: 0,55 oder mehr)"


def pruefe_konkret(text, lex, deutsch):
    """Zahlen, Namen, Konkretes. Floskeln sind abstrakt."""
    w = woerter(text)
    if len(w) < 25:
        return 50.0, "zu kurz für ein Urteil"
    pro100 = 100 / len(w)
    treffer = len(ZAHLEN.findall(text))
    if deutsch:
        treffer += (len(ZAHLWORT.findall(text)) + len(MONATE_TAGE.findall(text))
                    + len(set(KUERZEL.findall(text))) + len(set(NAMENSPAAR.findall(text))))
    else:
        treffer += len(set(EN_NAME.findall(text)))
    dichte = treffer * pro100
    punkte = skala(dichte, mensch=6.0, maschine=0.5)
    return punkte, (f"{treffer} konkrete Angaben, {de_zahl(dichte)} pro 100 Wörter "
                    "(Ziel: 4 oder mehr)")


def pruefe_floskeln(text, lex, deutsch):
    """Dichte an Standard-Floskeln laut Wortliste."""
    w = woerter(text)
    if not w:
        return 50.0, "leer"
    t = text.replace("’", "'").replace("‘", "'")
    eintraege = sorted(lex["phrases"] + lex["words"], key=lambda e: len(e["find"]),
                       reverse=True)
    belegt, gefunden = [], []
    for e in eintraege:
        if not deutsch and e.get("sprache") == "de":
            continue
        for m in muster(e).finditer(t):
            a, b = m.span()
            if any(a < y and x < b for x, y in belegt):
                continue                       # schon von einer längeren Floskel erfasst
            belegt.append((a, b))
            gefunden.append(m.group(0).lower())
    treffer = len(belegt)
    dichte = treffer * 100 / len(w)
    punkte = skala(dichte, mensch=0.0, maschine=4.0)
    detail = f"{treffer} Floskeln, {de_zahl(dichte)} pro 100 Wörter"
    namen = sorted(set(gefunden))
    if namen:
        detail += " (" + ", ".join(namen[:4]) + (", ..." if len(namen) > 4 else "") + ")"
    return punkte, detail


def pruefe_spuren(text, lex, deutsch):
    """Zeichen, die eine Handy-Tastatur nicht erzeugt."""
    unsichtbar = sum(1 for c in text if unicodedata.category(c) == "Cf")
    striche = text.count("—") + len(re.findall(r"\s–\s", text))
    # Deutsche Handy-Tastaturen setzen „ “ und ’ selbst, das ist keine Maschinenspur.
    typo_zeichen = sum(text.count(c) for c in ("»«" if deutsch else "‘’“”„‚»«"))
    auslassung = text.count("…")
    feste = sum(text.count(c) for c in "   ")
    summe = unsichtbar * 4 + striche * 2 + typo_zeichen + auslassung + feste
    pro1k = summe * 1000 / max(len(text), 1)
    punkte = skala(pro1k, mensch=0.0, maschine=12.0)
    detail = (f"{unsichtbar} unsichtbar, {striche} Gedankenstrich, {typo_zeichen} typogr. "
              f"Anführungszeichen, {auslassung} Auslassungszeichen, {feste} feste Leerzeichen")
    return punkte, detail


def pruefe_stimme(text, lex, deutsch):
    """Umgangssprache, Ich/Du und die Formen, zu denen Modelle greifen."""
    w = woerter(text)
    if len(w) < 25:
        return 50.0, "zu kurz für ein Urteil"
    pro100 = 100 / len(w)
    umgang = len((DE_UMGANGSSPRACHE if deutsch else EN_KURZFORMEN).findall(text)) * pro100
    person = len(PRONOMEN.findall(text)) * pro100
    muster_n, namen = 0, []
    for s in lex["structures"]:
        try:
            n = len(re.compile(s["regex"], re.MULTILINE).findall(text))
        except re.error:
            continue
        if n:
            muster_n += n
            namen.append(s["id"])
    punkte_liste = [len(b.split()) for b in re.findall(r"(?m)^\s*[-*•]\s+(.+)$", text)]
    gleichfoermig = len(punkte_liste) >= 3 and statistics.pstdev(punkte_liste) < 1.6
    punkte = (skala(umgang, mensch=3.0, maschine=0.0) * 0.35
              + skala(person, mensch=8.0, maschine=1.0) * 0.35
              + clamp(100 - muster_n * 22) * 0.30)
    if gleichfoermig:
        punkte -= 12
        namen.append("gleiche-aufzaehlung")
    art = "Umgangssprache" if deutsch else "Kurzformen"
    detail = (f"{de_zahl(umgang)} {art}, {de_zahl(person)} Ich/Du/Wir pro 100 Wörter, "
              f"{muster_n} Strukturmuster")
    if namen:
        detail += " [" + ", ".join(namen[:4]) + "]"
    return clamp(punkte), detail


PRUEFUNGEN = ["SCHWANKUNG", "KONKRET", "FLOSKELN", "SPUREN", "STIMME"]


def bewerte(text, lex, skript=False):
    """skript=True: Reel-Skript mit einem Beat pro Zeile. Kurze, ähnlich lange
    Zeilen sind dort gewollt, deshalb zählt SCHWANKUNG dann nicht zum Urteil."""
    text = unicodedata.normalize("NFC", text)
    deutsch = ist_deutsch(text)
    ergebnis = {
        "SCHWANKUNG": pruefe_schwankung(text, lex, deutsch),
        "KONKRET": pruefe_konkret(text, lex, deutsch),
        "FLOSKELN": pruefe_floskeln(text, lex, deutsch),
        "SPUREN": pruefe_spuren(text, lex, deutsch),
        "STIMME": pruefe_stimme(text, lex, deutsch),
    }
    gewertet = [c for c in PRUEFUNGEN if not (skript and c == "SCHWANKUNG")]
    if skript:
        p, detail = ergebnis["SCHWANKUNG"]
        ergebnis["SCHWANKUNG"] = (p, detail + " - bei Reel-Skripten nicht gewertet")
    punkte = [ergebnis[c][0] for c in gewertet]
    # Die schwächste Prüfung zieht das Urteil: Ein Detektor braucht nur ein Signal.
    gesamt = statistics.mean(punkte) * 0.6 + min(punkte) * 0.4
    urteil = "BESTANDEN" if gesamt >= 70 and min(punkte) >= 55 else (
        "ÜBERARBEITEN" if gesamt >= 50 else "AUFFÄLLIG")
    return ergebnis, gesamt, urteil, gewertet


def balken(punkte, breite=24):
    voll = round(punkte / 100 * breite)
    return "#" * voll + "." * (breite - voll)


def zeige(ergebnis, gesamt, urteil, gewertet, titel=None, out=sys.stdout):
    kopf = "KI-SPUREN-PRÜFUNG" + (f"  -  {titel}" if titel else "")
    print("\n" + kopf, file=out)
    print("=" * max(len(kopf), 66), file=out)
    for name in PRUEFUNGEN:
        punkte, detail = ergebnis[name]
        print(f"  {name:<13} {balken(punkte)} {de_zahl(punkte):>5}", file=out)
        print(f"  {'':<13} {detail}", file=out)
    print("-" * 66, file=out)
    print(f"  {'MENSCH-WERT':<13} {balken(gesamt)} {de_zahl(gesamt):>5}   {urteil}", file=out)
    if urteil != "BESTANDEN":
        schwach = min(gewertet, key=lambda c: ergebnis[c][0])
        print(f"\n  Schwächstes Signal: {schwach}. Das zuerst beheben.", file=out)
    print("", file=out)


def main():
    utf8_konsole()
    ap = argparse.ArgumentParser(description="Bewertet, wie maschinell ein Entwurf wirkt.")
    ap.add_argument("input", nargs="?", default="-", help="Datei, oder - für die Eingabe")
    ap.add_argument("compare", nargs="?", help="zweite Datei, für vorher/nachher")
    ap.add_argument("--json", action="store_true", help="Ergebnis als JSON")
    ap.add_argument("--skript", action="store_true",
                    help="Reel-Skript (ein Beat pro Zeile): SCHWANKUNG nicht werten")
    ap.add_argument("--liste", "--lexicon", dest="liste", default=LEX,
                    help="Pfad zur slop.json")
    args = ap.parse_args()

    with open(args.liste, encoding="utf-8-sig") as fh:
        lex = json.load(fh)

    try:
        ziele = [(args.input, lies(args.input))]
        if args.compare:
            ziele.append((args.compare, lies(args.compare)))
    except OSError as e:
        print(f"Datei nicht lesbar: {e}", file=sys.stderr)
        sys.exit(2)

    daten = []
    for name, text in ziele:
        ergebnis, gesamt, urteil, _ = bewerte(text, lex, args.skript)
        daten.append({
            "source": name,
            "checks": {k: {"score": round(v[0], 1), "detail": v[1]} for k, v in ergebnis.items()},
            "human_score": round(gesamt, 1),
            "verdict": urteil,
        })

    if args.json:
        print(json.dumps(daten if args.compare else daten[0], indent=2, ensure_ascii=False))
        return

    for (name, text), d in zip(ziele, daten):
        ergebnis, gesamt, urteil, gewertet = bewerte(text, lex, args.skript)
        zeige(ergebnis, gesamt, urteil, gewertet, titel=os.path.basename(name) if args.compare else None)
    if args.compare:
        a, b = daten
        delta = b["human_score"] - a["human_score"]
        vz = "+" if delta >= 0 else "-"
        print(f"  {de_zahl(a['human_score'])} {a['verdict']}  ->  "
              f"{de_zahl(b['human_score'])} {b['verdict']}   ({vz}{de_zahl(abs(delta))})\n")


if __name__ == "__main__":
    main()
