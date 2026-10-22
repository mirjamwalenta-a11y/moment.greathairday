#!/usr/bin/env python3
"""
beats.py - macht aus einem Reel-Skript einen Zeitplan (Beat-Sheet), bevor du
aufnimmst.

Schätzt, wie lange jede Zeile zum Sprechen braucht, stapelt die Zeilen zu
Zeitmarken und markiert die vier Dinge, an denen ein Reel im Schnitt stirbt:
ein Hook, der über drei Sekunden läuft, ein Beat, der so lange dauert, dass
Leute gehen, eine Folge von Zeilen ohne etwas Konkretes darin und eine
Gesamtlänge, die nicht zu deinem Ziel passt.

Deutsch wird über Silben geschätzt, nicht über Wörter: deutsche Wörter sind
länger als englische, eine Wortzählung würde jedes Skript zu kurz rechnen.
Zahlen werden so gezählt, wie man sie ausspricht ("18.000 €" =
achtzehntausend Euro = sechs Silben).

Die Zeiten sind eine Schätzung. Gut genug, um den Schnitt zu planen, kein
Ersatz fürs Aufnehmen. Dein eigenes Tempo stellst du mit --tempo ein:
ruhig (3,8 Silben pro Sekunde), normal (4,5, Standard), schnell (5,2) oder
eine eigene Zahl. Wer lieber in Wörtern pro Minute rechnet, nimmt --wpm.

Aufruf (Mac: python3 statt python)
  python beats.py skript.txt
  python beats.py skript.txt --ziel 30
  python beats.py skript.txt --tempo schnell --ziel 45
  python beats.py skript.txt --json
"""

import argparse
import json
import re
import sys
import unicodedata

HOOK_FENSTER = 3.0       # Sekunden. Danach hat der Daumen schon entschieden.
MAX_BEAT = 4.0           # Sekunden auf einem Gedanken ohne Bildwechsel.
ABSTRAKT_FOLGE = 3       # Beats hintereinander ohne etwas Prüfbares.
TEMPI = {"ruhig": 3.8, "normal": 4.5, "schnell": 5.2}

TOKEN_RE = re.compile(r"[€$]?\d+(?:[.,]\d+)*(?:\s?(?:%|€))?|[^\W\d_]+(?:['’-][^\W\d_]+)*")
KONKRET_RE = re.compile(
    r"[€$]\s?\d|\b\d[\d.,]*\b"
    r"|\b(?:euro|prozent|januar|jänner|februar|märz|april|mai|juni|juli|august|september"
    r"|oktober|november|dezember|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\b"
    r"|\b(?:zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|zwanzig|dreißig|vierzig"
    r"|fünfzig|hundert|tausend|million(?:en)?|hälfte|doppelt)\w*\b",
    re.IGNORECASE)
KUERZEL_RE = re.compile(r"\b(?!(?:DER|DIE|DAS|UND|ICH|DU|WIR|OK|JA|NIE|NUR|MEHR|ALLE)\b)"
                        r"[A-ZÄÖÜ]{2,4}\b|\b[a-zäöü]+[A-ZÄÖÜ]\w*|\b[A-ZÄÖÜ][a-zäöü]+[A-ZÄÖÜ]\w*")
EN_NAME_RE = re.compile(r"(?<!^)\b[A-Z][a-z]{2,}\b", re.MULTILINE)

FUELLWOERTER = {
    # deutsch
    "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer",
    "eines", "und", "oder", "aber", "wenn", "dass", "ist", "sind", "war", "waren", "sein",
    "bin", "bist", "hat", "habe", "hab", "hast", "haben", "hatte", "ich", "du", "er", "sie",
    "es", "wir", "ihr", "mich", "mir", "dich", "dir", "sich", "mein", "meine", "dein",
    "deine", "unser", "euer", "mit", "von", "zu", "zum", "zur", "im", "in", "am", "an",
    "auf", "für", "aus", "bei", "nach", "vor", "über", "unter", "um", "so", "nur", "nicht",
    "kein", "keine", "noch", "schon", "auch", "mal", "doch", "ja", "nein", "wie", "was",
    "wer", "wo", "da", "hier", "jetzt", "dann", "denn", "als", "also", "ganz", "sehr",
    "mehr", "man", "uns", "euch", "wird", "werden", "kann", "kannst", "muss", "musst",
    # englisch
    "the", "a", "and", "or", "but", "if", "of", "to", "on", "for", "with", "that", "this",
    "it", "is", "are", "was", "were", "be", "been", "you", "your", "i", "my", "me", "we",
    "our", "they", "them", "he", "she", "just", "not", "no", "do", "did", "does", "have",
    "has", "had", "will", "can", "at", "as", "by", "from", "out", "up", "off", "one", "all",
}
DE_HINWEISE = {"der", "die", "das", "und", "ist", "nicht", "ich", "du", "ein", "eine",
               "mit", "für", "auf", "zu", "sich", "es", "wir", "dein", "mein", "wie", "was",
               "wenn", "dass", "auch", "noch", "schon", "hat", "habe", "bei", "von", "im"}
EN_HINWEISE = {"the", "and", "is", "not", "you", "with", "for", "on", "to", "it", "we",
               "your", "my", "how", "what", "if", "that", "also", "still", "has", "have",
               "at", "of", "are", "was", "this", "they", "i"}
ABKUERZUNGEN = ["z. B.", "z.B.", "d. h.", "d.h.", "u. a.", "u.a.", "bzw.", "ca.", "usw.",
                "etc.", "Nr.", "Std.", "Min.", "Mio.", "Mrd.", "Tsd.", "inkl.", "ggf.",
                "evtl.", "vgl.", "Dr.", "Hr.", "Fr.", "max.", "min.", "bspw."]
MONATE = ("januar|jänner|februar|märz|april|mai|juni|juli|august|september|oktober"
          "|november|dezember")


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


def normal(text):
    text = unicodedata.normalize("NFC", text)
    return re.sub(r"[\u00a0\u202f\u2009\u2007]", " ", text)


def ohne_tausenderpunkt(text):
    return re.sub(r"(?<=\d)[.,](?=\d{3}(?!\d))", "", text)


def woerter(text):
    return TOKEN_RE.findall(ohne_tausenderpunkt(text))


def ist_deutsch(text):
    t = text.lower()
    w = re.findall(r"[^\W\d_]+", t)
    de = sum(1 for x in w if x in DE_HINWEISE) + 2 * len(re.findall(r"[äöüß€„]", t))
    en = sum(1 for x in w if x in EN_HINWEISE)
    return de >= en


EINER = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht",
         "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn",
         "sechzehn", "siebzehn", "achtzehn", "neunzehn"]
ZEHNER = ["", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig",
          "achtzig", "neunzig"]
ZWEISILBIG = {"ea", "eo", "ia", "io", "iu", "oa", "ua", "uo", "ue", "ui", "ae", "oe", "ao"}


def zahlwort(n):
    if n < 20:
        return EINER[n]
    if n < 100:
        e, z = n % 10, n // 10
        return (("ein" if e == 1 else EINER[e]) + "und" if e else "") + ZEHNER[z]
    if n < 1000:
        h, r = divmod(n, 100)
        return ("ein" if h == 1 else EINER[h]) + "hundert" + (zahlwort(r) if r else "")
    if n < 1_000_000:
        t, r = divmod(n, 1000)
        return ("ein" if t == 1 else zahlwort(t)) + "tausend" + (zahlwort(r) if r else "")
    if n < 1_000_000_000:
        m, r = divmod(n, 1_000_000)
        return ("eine million" if m == 1 else zahlwort(m) + " millionen") + \
               (" " + zahlwort(r) if r else "")
    return "sehr viele milliarden"


def silben_wort(w):
    w = w.lower()
    n = 0
    for m in re.finditer(r"[aeiouyäöü]+", w):
        g = m.group()
        if g.startswith("u") and m.start() > 0 and w[m.start() - 1] == "q":
            g = g[1:] or "u"
        if len(g) >= 3:
            n += len(g) - 1
        elif len(g) == 2 and g in ZWEISILBIG:
            n += 2
        else:
            n += 1
    return max(n, 1) if w else 0


def silben_zahl(token):
    s = 0
    if "€" in token:
        s += 2
    if "$" in token:
        s += 2
    if "%" in token:
        s += 2
    teile = re.split(r"[,.]", re.sub(r"[^\d,.]", "", token))
    ganz, rest = teile[0], "".join(teile[1:])
    try:
        s += sum(silben_wort(t) for t in zahlwort(int(ganz or 0)).split())
    except (ValueError, RecursionError):
        s += 3
    if rest:
        s += 2 + sum(silben_wort(EINER[int(d)]) for d in rest if d.isdigit())
    return s


def silben(text):
    return sum(silben_zahl(t) if re.search(r"\d", t) else silben_wort(t) for t in woerter(text))


def saetze(text):
    """In Sätze teilen, ohne an "18.000", "z. B." oder "3. Oktober" zu zerbrechen."""
    t = text
    for a in ABKUERZUNGEN:
        t = t.replace(a, a.replace(".", "\x01"))
    t = re.sub(r"(?<=\d)\.(?=\d)", "\x01", t)
    t = re.sub(r"(?i)(\b\d{1,2})\.(?=\s+(?:" + MONATE + r")\b)", "\\1\x01", t)
    teile = re.split(r"(?<=[.!?…])[\"“”']?\s+", t)
    return [p.replace("\x01", ".").strip() for p in teile if p.strip()]


def konkret(text, deutsch):
    n = len(KONKRET_RE.findall(text)) + len(KUERZEL_RE.findall(text))
    if not deutsch:
        n += len(EN_NAME_RE.findall(text))
    return n


def schoen(token):
    """Tausenderpunkt für die Anzeige zurücksetzen."""
    return re.sub(r"\d{5,}", lambda m: f"{int(m.group()):,}".replace(",", "."), token)


def tc(sekunden):
    m, s = divmod(sekunden, 60)
    return f"{int(m)}:{s:04.1f}".replace(".", ",")


def de_zahl(x, stellen=1):
    return f"{x:.{stellen}f}".replace(".", ",")


def stamm(w):
    w = w.lower().strip("'’")
    return w[:5] if len(w) >= 5 else w


def teile_beats(roh, dauer):
    """Eine Zeile ist ein Beat, außer sie ist zu lang für einen."""
    beats = []
    for zeile in [z.strip() for z in roh.splitlines()]:
        if not zeile:
            continue
        if dauer(zeile) <= MAX_BEAT * 1.5:
            beats.append(zeile)
            continue
        # Langer Absatz: an Satzenden teilen, damit die Zeiten etwas bedeuten.
        puffer = ""
        for teil in saetze(zeile):
            kandidat = (puffer + " " + teil).strip()
            if puffer and dauer(kandidat) > MAX_BEAT:
                beats.append(puffer)
                puffer = teil
            else:
                puffer = kandidat
        if puffer:
            beats.append(puffer)
    return beats


def analysiere(roh, tempo=4.5, wpm=None, ziel=None):
    roh = normal(roh)
    deutsch = ist_deutsch(roh)
    if wpm:
        wps = wpm / 60.0
        dauer = lambda t: len(woerter(t)) / wps                          # noqa: E731
        einheit = f"{de_zahl(wpm, 0)} Wörter/Min"
    else:
        dauer = lambda t: silben(t) / tempo                              # noqa: E731
        einheit = f"{de_zahl(tempo)} Silben/s"
    beats = teile_beats(roh, dauer)
    if not beats:
        return None

    zeilen, uhr = [], 0.0
    for i, text in enumerate(beats):
        d = dauer(text)
        zeilen.append({
            "n": i + 1,
            "start": round(uhr, 2),
            "dur": round(d, 2),
            "words": len(woerter(text)),
            "syllables": silben(text),
            "text": text,
            "concrete": konkret(text, deutsch),
            "label": "",
            "flags": [],
        })
        uhr += d
    gesamt = uhr

    # Die Stellen markieren, um die ein Reel gebaut ist.
    for r in zeilen:
        if r["n"] == 1 or r["start"] + r["dur"] <= HOOK_FENSTER:
            r["label"] = "HOOK"
    zeilen[-1]["label"] = "SCHLUSS" if zeilen[-1]["label"] != "HOOK" else "HOOK+SCHLUSS"
    haelfte = gesamt / 2
    for r in zeilen:
        if not r["label"] and r["start"] <= haelfte < r["start"] + r["dur"]:
            r["label"] = "MITTE"

    hinweise = []
    if zeilen[0]["dur"] > HOOK_FENSTER:
        zeilen[0]["flags"].append(f"Hook dauert {de_zahl(zeilen[0]['dur'])} s, länger als "
                                  f"{HOOK_FENSTER:.0f} s")
        if wpm:
            grenze = f"{int(HOOK_FENSTER * wpm / 60)} Wörter"
        else:
            grenze = f"etwa {int(HOOK_FENSTER * tempo)} Silben"
        hinweise.append(f"Beat 1 dauert {de_zahl(zeilen[0]['dur'])} s. Kürze ihn auf {grenze}, "
                        "sonst kommt der Hook erst, wenn der Daumen schon entschieden hat.")
    if zeilen[0]["concrete"] == 0:
        hinweise.append("Beat 1 hat keine Zahl und keinen Namen. Hooks ohne etwas "
                        "Prüfbares werden weggewischt.")

    for r in zeilen:
        if r["dur"] > MAX_BEAT:
            r["flags"].append(f"{de_zahl(r['dur'])} s auf einem Beat")
    lange = [r["n"] for r in zeilen if r["dur"] > MAX_BEAT]
    if lange:
        hinweise.append(f"Beat {', '.join(map(str, lange))} dauert länger als "
                        f"{MAX_BEAT:.0f} s. Teil die Zeile oder wechsle mittendrin das Bild. "
                        "Ein stehendes Bild ist die Stelle, an der Leute gehen.")

    folge, start = 0, None
    for r in zeilen:
        if r["concrete"] == 0:
            folge += 1
            start = start if start is not None else r["n"]
            if folge == ABSTRAKT_FOLGE:
                hinweise.append(f"Beat {start} bis {r['n']} haben nichts Konkretes. Bring in "
                                "einen davon eine Zahl, einen Namen oder einen Preis.")
        else:
            folge, start = 0, None

    # Führt der letzte Satz zurück zum ersten? (Wortstämme, damit "Stunde" und
    # "Stunden" als dasselbe Wort zählen.)
    def kernwoerter(t):
        return {stamm(w): w for w in woerter(t) if w.lower().strip("'’") not in FUELLWOERTER}
    erster, letzter = kernwoerter(zeilen[0]["text"]), kernwoerter(zeilen[-1]["text"])
    schleife = sorted(schoen(erster[k]) for k in set(erster) & set(letzter))
    if schleife:
        hinweise.append(f"Schleife: Der letzte Beat greift „{', '.join(schleife[:3])}“ aus dem "
                        "Hook auf. Wer nochmal schaut, bringt dir Reichweite ohne Mehraufwand.")
    else:
        hinweise.append("Keine Schleife. Der letzte Beat teilt kein Wort mit dem Hook, das "
                        "Video endet flach. Greif ein Wort aus Beat 1 wieder auf, das ist das "
                        "billigste zweite Anschauen, das du bekommst.")

    if ziel:
        delta = gesamt - ziel
        pro_s = (wpm / 60.0) if wpm else tempo
        menge = "Wörter" if wpm else "Silben"
        if abs(delta) <= ziel * 0.1:
            hinweise.append(f"Länge passt ({de_zahl(gesamt)} s bei {de_zahl(ziel, 0)} s Ziel).")
        elif delta > 0:
            hinweise.append(f"{de_zahl(delta)} s über dem Ziel. Streich etwa "
                            f"{int(delta * pro_s)} {menge}.")
        else:
            hinweise.append(f"{de_zahl(-delta)} s unter dem Ziel. Entweder etwa "
                            f"{int(-delta * pro_s)} {menge} mehr, oder dreh es kürzer. "
                            "Kürzer ist meistens richtig.")

    return {
        "tempo": None if wpm else tempo, "wpm": wpm, "unit": einheit, "target": ziel,
        "total_seconds": round(gesamt, 2),
        "total_words": sum(r["words"] for r in zeilen),
        "total_syllables": sum(r["syllables"] for r in zeilen),
        "beats": zeilen,
        "notes": hinweise,
    }


def zeige(a, out=sys.stdout):
    kopf = (f"ZEITPLAN  ·  {a['total_words']} Wörter  ·  {a['total_syllables']} Silben  ·  "
            f"ca. {de_zahl(a['total_seconds'])} s bei {a['unit']}"
            + (f"  ·  Ziel {de_zahl(a['target'], 0)} s" if a["target"] else ""))
    breite = max(len(kopf), 72)
    print("\n" + kopf, file=out)
    print("=" * breite, file=out)
    for r in a["beats"]:
        label = f"{r['label']:<9}" if r["label"] else " " * 9
        print(f"  {tc(r['start'])}  {de_zahl(r['dur']):>4} s  {label}{r['text']}", file=out)
        for f in r["flags"]:
            print(f"  {'':>6}  {'':>6}  {'':<9}^ {f}", file=out)
    print("-" * breite, file=out)
    for n in a["notes"]:
        print(f"  - {n}", file=out)
    print("", file=out)


def tempo_wert(text):
    t = str(text).strip().lower()
    if t in TEMPI:
        return TEMPI[t]
    try:
        wert = float(t.replace(",", "."))
    except ValueError:
        raise argparse.ArgumentTypeError("Tempo: ruhig, normal, schnell oder eine Zahl "
                                         "(Silben pro Sekunde, z. B. 4,8)")
    if not 2.0 <= wert <= 8.0:
        raise argparse.ArgumentTypeError("Tempo zwischen 2 und 8 Silben pro Sekunde")
    return wert


def main():
    utf8_konsole()
    ap = argparse.ArgumentParser(description="Macht aus einem Reel-Skript einen Zeitplan.")
    ap.add_argument("input", nargs="?", default="-", help="Skript-Datei, oder - für die Eingabe")
    ap.add_argument("--tempo", type=tempo_wert, default=TEMPI["normal"],
                    help="ruhig, normal (Standard), schnell oder Silben pro Sekunde")
    ap.add_argument("--wpm", type=float, help="statt Silben: Wörter pro Minute (z. B. 150)")
    ap.add_argument("--ziel", "--target", dest="ziel", type=float,
                    help="Ziellänge in Sekunden")
    ap.add_argument("--json", action="store_true", help="Ergebnis als JSON")
    args = ap.parse_args()

    try:
        roh = lies(args.input)
    except OSError as e:
        print(f"Datei nicht lesbar: {e}", file=sys.stderr)
        sys.exit(2)
    a = analysiere(roh, tempo=args.tempo, wpm=args.wpm, ziel=args.ziel)
    if not a:
        print("Leeres Skript.", file=sys.stderr)
        sys.exit(2)
    if args.json:
        print(json.dumps(a, indent=2, ensure_ascii=False))
    else:
        zeige(a)


if __name__ == "__main__":
    main()
