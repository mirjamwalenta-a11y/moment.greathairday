#!/usr/bin/env python3
"""
caption.py - prüft eine Instagram-Caption und zeigt genau das, was der Feed
vor dem "… mehr" zeigt.

Instagram zeigt im Feed ungefähr die ersten 125 Zeichen einer Caption, der
Rest steckt hinter einem Tippen. Fast jede Caption, die scheitert, scheitert
dort: Der Hook steht im dritten Satz, die erste Zeile ist eine Begrüßung oder
das Ganze beginnt mit einem Hashtag. Dieses Skript zeigt den sichtbaren Teil
als Kasten, so wie ihn eine fremde Person beim Scrollen liest, und prüft dann
die Punkte, die sich zu prüfen lohnen.

Deutsch braucht mehr Platz: Deutsche Wörter sind länger, in 125 Zeichen passen
spürbar weniger Wörter als auf Englisch. Umso wichtiger ist der Kasten.

Die 125 Zeichen sind ein Näherungswert. Die echte Grenze hängt vom Gerät, der
Schriftgröße und den Zeilenumbrüchen ab. Plane deshalb mit Abstand, statt die
Caption genau auf 125 zu bauen. Mit --kuerzen testest du eine engere Grenze.

Aufruf (Mac: python3 statt python)
  python caption.py caption.txt
  python caption.py caption.txt --suchbegriffe "Esstisch nach Maß,Tischlerei Graz"
  python caption.py caption.txt --json
"""

import argparse
import json
import re
import sys
import textwrap
import unicodedata

GRENZE = 2200            # Harte Grenze von Instagram für Captions.
KUERZEN = 125            # Ungefähr dort schneidet der Feed zu "… mehr".
HASHTAG_GRENZE = 5       # Höchstzahl je Beitrag oder Reel laut Instagram-Ankündigung
                         # vom Dezember 2025 (vorher 30). Instagram empfahl dabei
                         # wenige, gezielte Hashtags statt vieler allgemeiner.
                         # Plattform-Zahlen ändern sich: Wenn Instagram heute etwas
                         # anderes macht, hat Instagram recht.

HASHTAG_RE = re.compile(r"(?:^|\s)(#\w+)")
ERWAEHNUNG_RE = re.compile(r"(?:^|\s)(@[\w.]+)")
LINK_RE = re.compile(r"https?://\S+|\bwww\.\S+"
                     r"|\b[a-z0-9-]+\.(?:com|co|io|net|org|ai|app|de|at|ch|eu|info|shop|online)"
                     r"(?:/\S*)?(?=\s|$)", re.IGNORECASE)
EMOJI_RE = re.compile(r"[\U0001F300-\U0001FAFF☀-➿←-⇿️]")
KONKRET_RE = re.compile(
    r"[€$]\s?\d|\b\d[\d.,]*\b"
    r"|\b(?:euro|prozent|januar|jänner|februar|märz|april|mai|juni|juli|august|september"
    r"|oktober|november|dezember|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\b"
    r"|\b(?:zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|zwanzig|dreißig"
    r"|hundert|tausend|million(?:en)?|hälfte|doppelt)\w*\b",
    re.IGNORECASE)
KUERZEL_RE = re.compile(r"\b(?!(?:DER|DIE|DAS|UND|ICH|DU|WIR|OK|JA|NIE|NUR|MEHR|ALLE|NEU)\b)"
                        r"[A-ZÄÖÜ]{2,4}\b|\b[a-zäöü]+[A-ZÄÖÜ]\w*|\b[A-ZÄÖÜ][a-zäöü]+[A-ZÄÖÜ]\w*")
EN_NAME_RE = re.compile(r"(?<!^)\b[A-Z][a-z]{2,}\b", re.MULTILINE)
DE_HINWEISE = {"der", "die", "das", "und", "ist", "nicht", "ich", "du", "ein", "eine",
               "mit", "für", "auf", "zu", "sich", "es", "wir", "dein", "mein", "wie", "was",
               "wenn", "dass", "auch", "noch", "schon", "hat", "habe", "bei", "von", "im",
               "uns", "unser", "unsere", "dir", "dich"}
EN_HINWEISE = {"the", "and", "is", "not", "you", "with", "for", "on", "to", "it", "we",
               "your", "my", "how", "what", "if", "that", "also", "still", "has", "have",
               "at", "of", "are", "was", "this", "they", "i"}

# Aufforderungen. Eine pro Beitrag.
AUFFORDERUNGEN = [
    (re.compile(r"(?:(?i:kommentier(?:e|t)?|schreib(?:e|t)?|antworte(?:t)?)\b[^.!?\n]{0,40}?"
                r"(?:[„\"“»][^\"“”«\n]{2,25}[\"“”«]|\b[A-ZÄÖÜ0-9]{3,}\b))"
                r"|(?i:\bcomment (?:the word |\")?[a-z0-9]{2,}\b)"),
     "Stichwort kommentieren"),
    (re.compile(r"(?i)\b(?:schreib(?:e|t)? (?:mir|uns) (?:eine |'ne |ne )?(?:dm|nachricht|"
                r"direktnachricht)|(?:per|als) dm\b|schick(?:e|t)? (?:mir|uns) (?:eine |'ne |ne )?"
                r"(?:dm|nachricht)|(?:dm|message) me)\b"),
     "DM schicken"),
    (re.compile(r"(?i)\bspeicher(?:e|t)? (?:dir |euch )?(?:das|ihn|es|diese[nrs]?|den beitrag|"
                r"das reel)\b|\bspeichern nicht vergessen\b|\bsave (?:this|it)\b"),
     "speichern"),
    (re.compile(r"(?i)\bteil(?:e|t)? (?:das|ihn|es|diese[nrs]?|den beitrag|das reel)\b"
                r"|\bschick(?:e|t)? (?:das|es|den beitrag|das reel) (?:an|deine?[mnr]?)\b"
                r"|\bshare (?:this|it)\b"),
     "teilen"),
    (re.compile(r"(?i)\bfolg(?:e|t)? (?:mir|uns)\b|\bfollow (?:me|for)\b"), "folgen"),
    (re.compile(r"(?i)\blink (?:ist |steht )?(?:in|im) (?:meiner |der |unserer |unserem |"
                r"meinem )?(?:bio|profil)\b|\blink in (?:my )?bio\b"),
     "Link in der Bio"),
    (re.compile(r"(?i)\b(?:wisch|swipe)(?:e|t)?\b|\b(?:tap) (?:through|left|right|for|to)\b"),
     "wischen"),
    (re.compile(r"(?i)\bsag(?:t)? (?:mir|uns)\b|\bwas würdest du\b|\bwas würdet ihr\b"
                r"|\bwelche[rsnm]? (?:davon|nimmst|würdest|gefällt)\b|\btell me\b"
                r"|\bwhat would you\b|\bwhich one\b"),
     "Frage beantworten"),
    (re.compile(r"(?i)\b(?:ruf(?:t)? (?:uns|mich) an|termin (?:buchen|vereinbaren|ausmachen)|"
                r"meld(?:e|et)? (?:dich|euch)|komm(?:t)? (?:vorbei|bei uns vorbei)|"
                r"besuch(?:e|t)? uns)\b"),
     "melden oder vorbeikommen"),
]

FUELL_TAGS = {
    "#viral", "#fyp", "#explore", "#explorepage", "#foryou", "#foryoupage", "#trending",
    "#instagood", "#love", "#follow", "#followme", "#like4like", "#reels",
    "#reelsinstagram", "#viralreels", "#instadaily", "#fürdich", "#fuerdich",
    "#foryourpage", "#instareels", "#trend", "#trends", "#reelsdeutschland",
    "#reelitfeelit", "#liebe", "#folgen", "#instagram", "#photooftheday",
}


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
    de = sum(1 for x in w if x in DE_HINWEISE) + 2 * len(re.findall(r"[äöüß€„]", t))
    en = sum(1 for x in w if x in EN_HINWEISE)
    return de >= en


def konkret(text, deutsch):
    treffer = KONKRET_RE.findall(text) + KUERZEL_RE.findall(text)
    if not deutsch:
        treffer += EN_NAME_RE.findall(text)
    return treffer


def tausender(n):
    return f"{n:,}".replace(",", ".")


def sichtbar(text, grenze):
    """Was der Feed zeigt. Instagram schneidet mitten im Wort, das hier auch."""
    flach = text.strip()
    return flach if len(flach) <= grenze else flach[:grenze]


def anzeigebreite(s):
    """Emoji sind im Terminal doppelt so breit wie Buchstaben."""
    b = 0
    for c in s:
        if unicodedata.combining(c) or c in "️‍":
            continue
        b += 2 if unicodedata.east_asian_width(c) in ("W", "F") else 1
    return b


def zeige_kasten(fenster, gekuerzt, out=sys.stdout, breite=52):
    print("\n  WAS DER FEED ZEIGT", file=out)
    print("  +" + "-" * (breite + 2) + "+", file=out)
    zeilen = []
    for roh in fenster.split("\n"):
        zeilen.extend(textwrap.wrap(roh, breite) or [""])
    for zeile in zeilen[:8]:
        print(f"  | {zeile}{' ' * max(0, breite - anzeigebreite(zeile))} |", file=out)
    ende = "… mehr" if gekuerzt else "(ganze Caption sichtbar)"
    print("  +" + "-" * (breite + 2 - len(ende) - 2) + f" {ende} " + "+", file=out)


def analysiere(text, grenze=KUERZEN, suchbegriffe=None):
    text = unicodedata.normalize("NFC", text).rstrip()
    sauber = text.strip()
    deutsch = ist_deutsch(sauber)
    zeichen = len(sauber)
    zeilen = sauber.split("\n")
    erste = zeilen[0].strip() if zeilen else ""
    tags = HASHTAG_RE.findall(sauber)
    erwaehnungen = ERWAEHNUNG_RE.findall(sauber)
    links = LINK_RE.findall(sauber)
    emoji = EMOJI_RE.findall(sauber)
    fenster = sichtbar(sauber, grenze)
    gekuerzt = zeichen > grenze
    bitten = [name for muster, name in AUFFORDERUNGEN if muster.search(sauber)]
    fuell = [t for t in tags if t.lower() in FUELL_TAGS]
    suchbegriffe = [k.strip() for k in (suchbegriffe or []) if k.strip()]

    pruefungen = []

    def neu(name, status, detail):
        pruefungen.append({"check": name, "status": status, "detail": detail})

    neu("LÄNGE", "FEHLER" if zeichen > GRENZE else "OK",
        f"{tausender(zeichen)} / {tausender(GRENZE)} Zeichen"
        + (f", {tausender(zeichen - GRENZE)} zu viel" if zeichen > GRENZE else ""))

    if not erste:
        neu("ERSTE ZEILE", "FEHLER", "die Caption beginnt mit einer Leerzeile")
    elif erste.startswith("#") or erste.startswith("@"):
        neu("ERSTE ZEILE", "FEHLER",
            "beginnt mit einem Hashtag oder einer Erwähnung, dabei ist das der eine Platz, "
            "der einen Satz verdient")
    elif len(erste) > grenze:
        neu("ERSTE ZEILE", "PRÜFEN",
            f"{len(erste)} Zeichen, wird bei {grenze} mitten im Gedanken abgeschnitten. "
            "Gut, wenn der Schnitt neugierig macht, schlecht, wenn er mitten im Nebensatz liegt")
    else:
        neu("ERSTE ZEILE", "OK", f"{len(erste)} Zeichen, ist ganz sichtbar")

    im_fenster = konkret(fenster, deutsch)
    neu("HOOK KONKRET", "OK" if im_fenster else "PRÜFEN",
        f"{len(im_fenster)} Zahl(en) oder Name(n) im sichtbaren Teil"
        + ("" if im_fenster else " - nichts Prüfbares vor dem „mehr“"))

    if len(tags) > HASHTAG_GRENZE:
        neu("HASHTAGS", "FEHLER", f"{len(tags)} Hashtags, mehr als die {HASHTAG_GRENZE}, die "
                                  "Instagram zulässt. Alles nach dem fünften zählt nicht, "
                                  "und der Block wirkt veraltet")
    elif len(tags) == HASHTAG_GRENZE and fuell:
        neu("HASHTAGS", "PRÜFEN", f"{len(tags)} Hashtags, am Limit, davon {len(fuell)} "
                                  "allgemein. Nutz die fünf für Themen")
    elif fuell:
        neu("HASHTAGS", "PRÜFEN", f"{len(tags)} Hashtags, {len(fuell)} davon allgemein "
                                  f"({', '.join(fuell[:3])}). Die beschreiben nichts")
    else:
        neu("HASHTAGS", "OK", f"{len(tags)} Hashtag(s)" + (f": {' '.join(tags)}" if tags else ""))

    if not tags:
        neu("HASHTAG-PLATZ", "OK", "keine Hashtags, nichts zu platzieren")
    elif any(re.search(r"(?:^|\s)" + re.escape(t) + r"(?!\w)", fenster) for t in tags):
        neu("HASHTAG-PLATZ", "PRÜFEN", "ein Hashtag steht im sichtbaren Teil und verbraucht "
                                        "Platz im Feed für ein Etikett")
    else:
        neu("HASHTAG-PLATZ", "OK", "Hashtags stehen unter dem „mehr“")

    neu("LINKS", "PRÜFEN" if links else "OK",
        f"{len(links)} Link(s) in der Caption, und Captions sind nicht anklickbar. "
        "Link in die Bio oder in die DM" if links else "keine toten Links im Text")

    if len(bitten) == 1:
        neu("EINE BITTE", "OK", f"eine Aufforderung: {bitten[0]}")
    elif not bitten:
        neu("EINE BITTE", "PRÜFEN", "keine Aufforderung. Entscheide, wofür dieser Beitrag da ist")
    else:
        neu("EINE BITTE", "PRÜFEN", f"{len(bitten)} Aufforderungen ({', '.join(bitten)}). "
                                    "Zwei Bitten wirken wie keine")

    dichte = len(emoji) * 100 / max(zeichen, 1)
    neu("EMOJI", "PRÜFEN" if dichte > 4 else "OK",
        f"{len(emoji)} Emoji, {dichte:.1f} pro 100 Zeichen".replace(".", ",")
        + (" - wirkt wie Deko" if dichte > 4 else ""))

    if suchbegriffe:
        klein = sauber.lower()
        da = [k for k in suchbegriffe if k.lower() in klein]
        fehlt = [k for k in suchbegriffe if k.lower() not in klein]
        sichtbar_da = [k for k in da if k.lower() in fenster.lower()]
        status = "OK" if not fehlt else ("PRÜFEN" if da else "FEHLER")
        neu("SUCHBEGRIFFE", status,
            f"{len(da)}/{len(suchbegriffe)} vorhanden"
            + (f", {len(sichtbar_da)} im sichtbaren Teil" if da else "")
            + (f". Fehlt: {', '.join(fehlt)}" if fehlt else ""))

    fehler = sum(1 for c in pruefungen if c["status"] == "FEHLER")
    pruefen = sum(1 for c in pruefungen if c["status"] == "PRÜFEN")
    urteil = "KORRIGIEREN" if fehler else ("ANSEHEN" if pruefen else "FERTIG")

    return {
        "characters": zeichen, "limit": GRENZE, "truncate_at": grenze,
        "visible": fenster, "truncated": gekuerzt,
        "first_line_chars": len(erste),
        "hashtags": tags, "mentions": erwaehnungen, "links": links,
        "emoji": len(emoji), "asks": bitten,
        "checks": pruefungen, "verdict": urteil,
    }


def zeige(a, out=sys.stdout):
    kopf = (f"CAPTION-PRÜFUNG  ·  {tausender(a['characters'])} / {tausender(a['limit'])} "
            f"Zeichen  ·  {len(a['hashtags'])} Hashtags  ·  {len(a['asks'])} Aufforderung(en)")
    print("\n" + kopf, file=out)
    print("=" * max(len(kopf), 62), file=out)
    zeige_kasten(a["visible"], a["truncated"], out=out)
    print("", file=out)
    for c in a["checks"]:
        print(f"  {c['status']:<7} {c['check']:<15} {c['detail']}", file=out)
    print("-" * max(len(kopf), 62), file=out)
    print(f"  ERGEBNIS  {a['verdict']}\n", file=out)


def main():
    utf8_konsole()
    ap = argparse.ArgumentParser(description="Prüft eine Instagram-Caption.")
    ap.add_argument("input", nargs="?", default="-", help="Caption-Datei, oder - für die Eingabe")
    ap.add_argument("--kuerzen", "--truncate", dest="kuerzen", type=int, default=KUERZEN,
                    help=f"Zeichen vor „… mehr“ (Standard {KUERZEN})")
    ap.add_argument("--suchbegriffe", "--keywords", dest="suchbegriffe", default="",
                    help="Begriffe, unter denen du gefunden werden willst, mit Komma getrennt")
    ap.add_argument("--json", action="store_true", help="Ergebnis als JSON")
    args = ap.parse_args()

    try:
        roh = lies(args.input)
    except OSError as e:
        print(f"Datei nicht lesbar: {e}", file=sys.stderr)
        sys.exit(2)
    if not roh.strip():
        print("Leere Caption.", file=sys.stderr)
        sys.exit(2)
    a = analysiere(roh, grenze=args.kuerzen, suchbegriffe=args.suchbegriffe.split(","))
    if args.json:
        print(json.dumps(a, indent=2, ensure_ascii=False))
    else:
        zeige(a)


if __name__ == "__main__":
    main()
