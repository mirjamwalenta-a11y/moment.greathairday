#!/usr/bin/env python3
"""
swipe.py - sortiert gesammelte Reels danach, wie weit sie über dem Normalwert
ihres eigenen Kontos liegen, benennt die Hook-Formel und schreibt deine
Vorbilder-Sammlung.

Der Sinn dieses Skripts ist eine einzige Korrektur: Aufrufe allein beweisen
nichts. Ein Konto mit 2.000.000 Followern und 400.000 Aufrufen hatte einen
ruhigen Tag. Ein Konto mit 4.000 Followern und 400.000 Aufrufen hat etwas
gefunden. Sortiert wird deshalb nach dem Ausreißer-Faktor: Aufrufe geteilt
durch die typischen Aufrufe (Median) dieses Kontos. Das ist die einzige Form
von "viral", aus der du etwas lernen kannst.

Eingabe ist eine Datei mit Tabulatoren, die du beim Durchschauen füllst (oder
eine Tabelle, die du aus Excel als "Text (Tabstopp-getrennt)" speicherst).
Eine Zeile pro Reel, erste Zeile mit den Spaltennamen:

    konto     follower   median   aufrufe   hook
    @konto_a  48000      11000    412000    keiner sagt dir, dass deine ersten 30 floppen

Englische Spaltennamen (account, followers, median, views, hook) gehen auch.
Zahlen dürfen "48.000", "48k", "1,2 Mio" oder "412000" sein.
`median` ist der typische Wert der letzten Reels des Kontos und die bessere
Grundlage. Hast du nur `follower`, lass median weg, das Skript sagt es dann.
`hook` ist der erste Satz des Reels, gesprochen oder im Bild, im Wortlaut.

Aufruf (Mac: python3 statt python)
  python swipe.py gesammelt.tsv
  python swipe.py gesammelt.tsv --out ablage/vorbilder.md
  python swipe.py gesammelt.tsv --json
"""

import argparse
import json
import os
import re
import statistics
import sys
import unicodedata

HIER = os.path.dirname(os.path.abspath(__file__))
HOOKS = os.path.join(HIER, "..", "ig-reel", "hooks.json")
WORT_RE = re.compile(r"[€$]?\d+(?:[.,]\d+)*%?|[^\W\d_]+(?:['’-][^\W\d_]+)*")

SPALTEN = {
    "konto": "account", "account": "account", "benutzername": "account", "handle": "account",
    "follower": "followers", "followers": "followers", "abonnenten": "followers",
    "median": "median", "normal": "median", "normalwert": "median",
    "aufrufe": "views", "views": "views", "wiedergaben": "views", "plays": "views",
    "hook": "hook", "erster satz": "hook", "einstieg": "hook",
}

try:                                              # optional: Hooks auch bewerten
    sys.dont_write_bytecode = True                # keinen __pycache__-Ordner anlegen
    sys.path.insert(0, os.path.join(HIER, "..", "ig-reel"))
    from hookscore import run as bewerte_hook     # noqa: E402
except Exception:                                 # ig-viral allein kopiert
    bewerte_hook = None


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


def zahl(text):
    """"48.000", "48k", "1,2 Mio", "1.2M", "412000" -> ganze Zahl (oder None)."""
    t = (text or "").strip().lower().replace(" ", "")
    if not t:
        return None
    faktor = 1
    m = re.search(r"(tsd|k|mio|m|mrd|b)\.?$", t)
    if m:
        faktor = {"tsd": 1_000, "k": 1_000, "mio": 1_000_000, "m": 1_000_000,
                  "mrd": 1_000_000_000, "b": 1_000_000_000}[m.group(1)]
        t = t[:m.start()]
    t = re.sub(r"[^\d.,]", "", t)
    if not t:
        return None
    if faktor > 1:
        wert = float(t.replace(",", "."))         # 1,2 Mio oder 1.2M
    else:
        wert = float(re.sub(r"[.,]", "", t))      # 48.000 oder 48,000
    return int(round(wert * faktor))


def tausender(n):
    return f"{n:,}".replace(",", ".")


def lade_formeln(pfad):
    try:
        with open(pfad, encoding="utf-8-sig") as fh:
            d = json.load(fh)
    except Exception:
        return None
    nach_id = {h["id"]: h for h in d["hooks"]}
    reihe = d.get("classify_order") or sorted(nach_id)
    return [(nach_id[i]["id"], nach_id[i]["name"],
             re.compile(nach_id[i]["match"], re.IGNORECASE)) for i in reihe if i in nach_id]


def einordnen(hook, formeln):
    if not formeln:
        return None, "nicht zugeordnet"
    for fid, name, muster in formeln:
        if muster.search(hook):
            return fid, name
    return None, "nicht zugeordnet"


def lies_zeilen(pfad):
    roh = unicodedata.normalize("NFC", lies(pfad))
    zeilen = [z for z in roh.splitlines() if z.strip() and not z.lstrip().startswith("#")]
    if not zeilen:
        return []
    kopf = [SPALTEN.get(c.strip().lower(), c.strip().lower()) for c in zeilen[0].split("\t")]
    if "views" in kopf and "hook" in kopf:
        spalten, rumpf = kopf, zeilen[1:]
    else:
        spalten, rumpf = ["account", "followers", "views", "hook"], zeilen
    reels = []
    for zeile in rumpf:
        zellen = zeile.split("\t")
        if len(zellen) < len(spalten):
            zellen += [""] * (len(spalten) - len(zellen))
        r = dict(zip(spalten, [c.strip() for c in zellen]))
        r["views"] = zahl(r.get("views")) or 0
        for k in ("followers", "median"):
            r[k] = zahl(r.get(k))
        if r["views"] and r.get("hook"):
            reels.append(r)
    return reels


def analysiere(reels, formeln):
    mit_median = any(r.get("median") for r in reels)
    for r in reels:
        basis = r.get("median") or r.get("followers") or 0
        r["baseline"] = basis
        r["outlier"] = round(r["views"] / basis, 2) if basis else None
        r["formula_id"], r["formula"] = einordnen(r["hook"], formeln)
        r["words"] = len(WORT_RE.findall(r["hook"]))
        if bewerte_hook:
            _, gesamt, urteil, _ = bewerte_hook(r["hook"])
            r["hook_score"], r["hook_verdict"] = round(gesamt, 1), urteil
        else:
            r["hook_score"], r["hook_verdict"] = None, None
    sortiert = sorted(reels, key=lambda r: -(r["outlier"] or 0))
    drittel = max(1, len(sortiert) // 3)
    oben, unten = sortiert[:drittel], sortiert[-drittel:]

    def med(items, schluessel):
        werte = [i[schluessel] for i in items if i.get(schluessel) is not None]
        return round(statistics.median(werte), 1) if werte else None

    zaehler = {}
    for r in oben:
        zaehler[r["formula"]] = zaehler.get(r["formula"], 0) + 1
    return {
        "baseline": "Median des Kontos" if mit_median else "Follower-Zahl",
        "n": len(sortiert),
        "accounts": len({r.get("account", "") for r in sortiert}),
        "reels": sortiert,
        "top_formulas": sorted(zaehler.items(), key=lambda kv: -kv[1]),
        "top_hook_score": med(oben, "hook_score"),
        "bottom_hook_score": med(unten, "hook_score"),
        "top_words": med(oben, "words"),
        "bottom_words": med(unten, "words"),
        "unclassified": sum(1 for r in sortiert if r["formula"] == "nicht zugeordnet"),
    }


def zahl_de(x):
    if x is None:
        return "-"
    return (f"{x:.0f}" if float(x).is_integer() else f"{x:.1f}").replace(".", ",")


def faktor_text(x):
    return f"{x:.1f}x".replace(".", ",") if x else "?"


def zeige(a, out=sys.stdout):
    kopf = (f"VORBILDER  ·  {a['n']} Reels  ·  {a['accounts']} Konten  ·  "
            f"Grundlage: {a['baseline']}")
    print("\n" + kopf, file=out)
    print("=" * max(len(kopf), 78), file=out)
    for r in a["reels"]:
        punkte = f"{r['hook_score']:.0f}" if r["hook_score"] is not None else " -"
        fid = f"#{r['formula_id']:<2}" if r["formula_id"] else "-  "
        print(f"  {faktor_text(r['outlier']):>7}  Hook {punkte:>3}  {fid} {r['formula'][:24]:<24} "
              f"{r.get('account', '')[:16]:<16} {tausender(r['views']):>11}", file=out)
        print(f"           „{r['hook'][:96]}“", file=out)
    print("-" * max(len(kopf), 78), file=out)
    print("WAS IN DIESER SAMMLUNG FUNKTIONIERT", file=out)
    if a["top_formulas"]:
        print("  oberes Drittel nach Faktor:  "
              + ", ".join(f"{n} x{c}" for n, c in a["top_formulas"][:4]), file=out)
    if a["top_hook_score"] is not None:
        print(f"  Hook-Punkte (Median):        oben {a['top_hook_score']:.0f}  "
              f"gegen unten {a['bottom_hook_score']:.0f}", file=out)
    print(f"  Hook-Länge (Median):         oben {zahl_de(a['top_words'])} Wörter  "
          f"gegen unten {zahl_de(a['bottom_words'])} Wörter", file=out)
    print(f"  nicht zugeordnet:            {a['unclassified']} von {a['n']}. Lies die von Hand, "
          "dort versteckt sich eine Formel, die du noch nicht hast.", file=out)
    print("\n  Eine selbst gesammelte Liste ist ein Hinweis, kein Beweis. Zwölf Reels zeigen "
          "nichts,\n  vierzig aus sechs Konten zeigen etwas. Sammle mehr, bevor du es glaubst.\n",
          file=out)


def als_markdown(a):
    zeilen = ["# Vorbilder-Sammlung", "",
              f"{a['n']} Reels aus {a['accounts']} Konten. "
              f"Sortiert nach dem Faktor über {a['baseline']}.", ""]
    for r in a["reels"]:
        zeilen += [f"## {faktor_text(r['outlier'])}  {r['formula']}  ({r.get('account', '')})",
                   f"- Aufrufe: {tausender(r['views'])}  Grundlage: "
                   f"{tausender(r['baseline']) if r['baseline'] else '?'}",
                   f"- Hook-Punkte: {zahl_de(r['hook_score'])}  Wörter: {r['words']}",
                   f"- Hook: „{r['hook']}“", ""]
    return "\n".join(zeilen) + "\n"


def main():
    utf8_konsole()
    ap = argparse.ArgumentParser(description="Sortiert gesammelte Reels nach Ausreißer-Faktor.")
    ap.add_argument("input", nargs="?", default="-", help="Tabelle (Tabulatoren), oder -")
    ap.add_argument("--hooks", default=HOOKS, help="Pfad zu ig-reel/hooks.json")
    ap.add_argument("--out", help="die Sammlung zusätzlich als Markdown hier speichern")
    ap.add_argument("--json", action="store_true", help="Ergebnis als JSON")
    args = ap.parse_args()

    try:
        reels = lies_zeilen(args.input)
    except OSError as e:
        print(f"Datei nicht lesbar: {e}", file=sys.stderr)
        sys.exit(2)
    if not reels:
        print("Keine brauchbaren Zeilen. Nötig ist eine Tabelle mit Tabulatoren und mindestens "
              "den Spalten aufrufe und hook.", file=sys.stderr)
        sys.exit(2)
    formeln = lade_formeln(args.hooks)
    a = analysiere(reels, formeln)
    if not formeln:
        print("Hinweis: hooks.json nicht gefunden, Formeln nicht benannt. Pfad mit --hooks angeben.",
              file=sys.stderr)
    if bewerte_hook is None:
        print("Hinweis: hookscore.py nicht gefunden, Hook-Punkte fehlen.", file=sys.stderr)

    if args.json:
        print(json.dumps(a, indent=2, ensure_ascii=False))
    else:
        zeige(a)
    if args.out:
        pfad = os.path.expanduser(args.out)
        if os.path.dirname(pfad):
            os.makedirs(os.path.dirname(pfad), exist_ok=True)
        with open(pfad, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(als_markdown(a))
        print(f"geschrieben: {pfad}", file=sys.stderr)


if __name__ == "__main__":
    main()
