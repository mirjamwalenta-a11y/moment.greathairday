#!/usr/bin/env python3
"""
hookscore.py - bewertet den ersten Satz eines Reels (den Hook) nach fünf
Eigenschaften, die starke Hooks gemeinsam haben, und sortiert mehrere Hooks
gegeneinander.

Was das ist: fünf Faustregeln, lokal auf deinem Rechner aus dem Text
berechnet. Sie messen, was Hooks mit Haltekraft meistens gemeinsam haben:
eine Länge, die man in wenigen Sekunden sagt, etwas Konkretes, etwas, das auf
dem Spiel steht, das Wichtige gleich vorne und eine Person, an die sich der
Satz richtet.

Was das NICHT ist: eine Reichweiten-Vorhersage. Die englische Ursprungsfassung
wurde an 74 echten Kurzvideo-Hooks getestet. Schwache Hooks (Begrüßung,
Vorrede, nichts Konkretes) hat sie gut erkannt. Zwischen zwei ordentlichen
Hooks den Gewinner wählen konnte sie kaum, das war nahe am Münzwurf. Die
deutsche Fassung ist darauf nicht neu gemessen. Nutze sie genauso: schwache
Hooks aussortieren, dann zählt deine eigene Statistik in der App.

Deutsch und Englisch werden erkannt. Bei deutschem Text zählen großgeschriebene
Wörter nicht als Namen (im Deutschen schreibt man alle Hauptwörter groß).

Jede Prüfung gibt 0 bis 100 Punkte. Mehr ist besser.

Aufruf (Mac: python3 statt python)
  python hookscore.py hooks.txt              # ein Hook pro Zeile, sortiert
  python hookscore.py --hook "18.000 € hat mich ein fehlender Satz gekostet."
  python hookscore.py hooks.txt --json
"""

import argparse
import json
import re
import statistics
import sys
import unicodedata

TEMPO = 4.5   # Silben pro Sekunde, normales Sprechtempo in Reels

# ---------------------------------------------------------------------------
# Text-Grundlagen (Umlaute, Zahlen, Silben)
# ---------------------------------------------------------------------------

TOKEN_RE = re.compile(r"[€$]?\d+(?:[.,]\d+)*(?:\s?(?:%|€))?|[^\W\d_]+(?:['’-][^\W\d_]+)*")

DE_HINWEISE = {
    "der", "die", "das", "und", "ist", "nicht", "ich", "du", "ein", "eine", "einen",
    "mit", "für", "auf", "zu", "sich", "es", "wir", "dein", "deine", "mein", "meine",
    "wie", "was", "wenn", "dass", "auch", "noch", "schon", "hat", "habe", "hab", "bei",
    "von", "im", "den", "dem", "des", "sind", "war", "kein", "keine", "nur", "mal",
    "jetzt", "heute", "oder", "aber", "man", "hier", "dir", "dich", "mich", "mir",
    "uns", "euch", "ihr", "sie", "nie", "wer", "warum", "keiner", "niemand", "hör",
}
EN_HINWEISE = {
    "the", "and", "is", "not", "you", "with", "for", "on", "to", "it", "we", "your",
    "my", "how", "what", "if", "that", "also", "still", "has", "have", "at", "of",
    "are", "was", "no", "only", "now", "today", "or", "but", "this", "they", "i",
    "me", "nobody", "stop", "never", "why", "who", "can", "should",
}


def utf8_konsole():
    """Windows schreibt sonst in der alten Codepage und stolpert über €, „ und …"""
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
    """Datei lesen: UTF-8 (mit oder ohne BOM), UTF-16 oder altes Windows-ANSI."""
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
    """Umlaute vereinheitlichen (ä statt a + Trema) und feste Leerzeichen lösen."""
    text = unicodedata.normalize("NFC", text)
    return re.sub(r"[    ]", " ", text)


def ohne_tausenderpunkt(text):
    # "18.000" und "18,000" sind gesprochen eine Zahl, also hier auch.
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


def zahlwort(n):
    """Ganze Zahl als deutsches Zahlwort, nur für die Silbenschätzung."""
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


ZWEISILBIG = {"ea", "eo", "ia", "io", "iu", "oa", "ua", "uo", "ue", "ui", "ae", "oe", "ao"}


def silben_wort(w):
    """Silben eines Worts schätzen: Vokalgruppen zählen, ein paar Ausnahmen."""
    w = w.lower()
    n = 0
    for m in re.finditer(r"[aeiouyäöü]+", w):
        g = m.group()
        if g.startswith("u") and m.start() > 0 and w[m.start() - 1] == "q":
            g = g[1:] or "u"                       # "Qu" ist ein Laut
        if len(g) >= 3:
            n += len(g) - 1                        # "freie", "bauen", "neue"
        elif len(g) == 2 and g in ZWEISILBIG:
            n += 2                                 # "Video", "aktuell", "Ruine"
        else:
            n += 1
    return max(n, 1) if w else 0


def silben_zahl(token):
    """Silben einer Zahl wie "18000 €", "4,5" oder "30%"."""
    s = 0
    if "€" in token:
        s += 2                                     # Eu-ro
    if "$" in token:
        s += 2                                     # Dol-lar
    if "%" in token:
        s += 2                                     # Pro-zent
    teile = re.split(r"[,.]", re.sub(r"[^\d,.]", "", token))
    ganz, rest = teile[0], "".join(teile[1:])   # Tausenderpunkte sind schon weg
    try:
        s += sum(silben_wort(t) for t in zahlwort(int(ganz or 0)).split())
    except (ValueError, RecursionError):
        s += 3
    if rest:
        s += 2 + sum(silben_wort(EINER[int(d)]) for d in rest if d.isdigit())  # Kom-ma ...
    return s


def silben(text):
    gesamt = 0
    for t in woerter(text):
        gesamt += silben_zahl(t) if re.search(r"\d", t) else silben_wort(t)
    return gesamt


# ---------------------------------------------------------------------------
# Wortlisten
# ---------------------------------------------------------------------------

ZAHL_RE = re.compile(
    r"[€$]\s?\d[\d.,]*"
    r"|\b\d[\d.,]*\s?(?:%|€|\$"
    r"|(?:euro|eur|prozent|k|tsd|mio|mrd|std|stunden?|min|minuten?|sek|sekunden?"
    r"|tage?n?|wochen?|monate?n?|jahre?n?|mal"
    r"|hrs?|hours?|mins?|minutes?|days?|weeks?|months?|years?|x)\b)?",
    re.IGNORECASE)
EN_NAME_RE = re.compile(r"(?<!^)\b[A-Z][a-z]{2,}\b")
HASHTAG_RE = re.compile(r"(?:^|\s)#\w+")
EMOJI_RE = re.compile(r"[\U0001F300-\U0001FAFF☀-➿]")

ZAHLWORT_RE = re.compile(
    r"(?:null|eins?|zwei|zwo|drei|vier|fünf|sechs?|sieb(?:en)?|acht|neun|zehn|elf|zwölf"
    r"|zwanzig|dreißig|vierzig|fünfzig|sechzig|siebzig|achtzig|neunzig|hundert|tausend|und)+")
ZAHLWOERTER_EXTRA = {
    "million", "millionen", "milliarde", "milliarden", "dutzend", "hälfte", "halb",
    "halbe", "halben", "doppelt", "doppelte", "doppelten", "dreifach", "zweimal",
    "dreimal", "viermal", "fünfmal", "zehnmal", "hundertmal", "tausendmal",
    # Englisch, wie im Original. "one" und "first" fehlen absichtlich: meist Füllwort.
    "zero", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "fifteen", "twenty", "thirty", "forty", "fifty", "sixty",
    "seventy", "eighty", "ninety", "hundred", "thousand", "billion", "dozen",
    "half", "twice", "triple",
}
KEINE_ZAHLWOERTER = {"ein", "eins", "und", "eine"}

GELDWOERTER = {
    "euro", "eur", "cent", "prozent", "franken", "dollar", "umsatz", "gewinn", "gehalt",
    "miete", "honorar", "stundensatz", "tagessatz", "budget", "rechnung", "preis",
    "millionär", "millionärin",
    "dollars", "bucks", "grand", "percent", "cents", "millionaire", "billionaire",
    "revenue", "profit", "salary", "rent",
}

MONATE_TAGE = {
    "januar", "jänner", "februar", "märz", "april", "mai", "juni", "juli", "august",
    "september", "oktober", "november", "dezember", "montag", "dienstag", "mittwoch",
    "donnerstag", "freitag", "samstag", "sonntag",
}
KEINE_KUERZEL = {
    "DER", "DIE", "DAS", "UND", "ICH", "DU", "WIR", "IHR", "SIE", "ES", "OK", "JA", "NEIN",
    "NIE", "NUR", "MEHR", "ALLE", "DEN", "DEM", "EIN", "MIT", "FÜR", "AUF", "IST", "WAS",
    "WIE", "WER", "SO", "AB", "AN", "IN", "IM", "AM", "ZU", "OHNE", "HALT", "STOP",
    "TOP", "NEU", "I", "A", "THE", "AND", "YOU", "TO", "MY", "DONT",
}

# Wörter, bei denen etwas auf dem Spiel steht. Ein Hook ohne so ein Wort ist
# eine Feststellung, ein Hook mit einem ist ein Grund weiterzuschauen.
EINSATZ = {
    # deutsch
    "nie", "niemals", "nicht", "nichts", "kein", "keine", "keinen", "keiner", "keinem",
    "niemand", "falsch", "falsche", "falschen", "fehler", "stopp", "aber", "statt",
    "stattdessen", "anstatt", "außer", "ohne", "bevor", "bis", "nur", "noch", "schon",
    "eigentlich", "tatsächlich", "sollte", "solltest", "sollten", "problem", "probleme",
    "risiko", "gefahr", "warnung", "achtung", "verboten", "illegal", "gratis",
    "kostenlos", "umsonst", "teuer", "billig", "pleite", "geheim", "geheimnis",
    "wahrheit", "lüge", "gelogen", "betrug", "abzocke", "gegen", "versus", "vs",
    "erste", "ersten", "erster", "erstes", "letzte", "letzten", "schlimmste",
    "schlimmsten", "schlechteste", "hasse", "hasst", "gehasst", "bereue", "bereut",
    "gefeuert", "rausgeworfen", "gelöscht", "lösch", "lösche", "ersetzt", "ersetzen",
    "gestrichen", "gekündigt", "kündigen", "gespart", "sparen", "spart", "bezahlt",
    "zahlst", "gezahlt", "verdient", "verloren", "verliert", "verlierst", "verlieren",
    "kostet", "kosten", "gekostet", "scheitern", "gescheitert", "aufgehört", "aufhören",
    "hör", "klau", "verschwendet", "verschwende", "floppen", "flop", "flops",
    "früher", "damals", "trotzdem", "obwohl", "plötzlich",
    # englisch, wie im Original
    "stop", "never", "wrong", "mistake", "mistakes", "lost", "lose", "losing", "cost",
    "costs", "broke", "broken", "failed", "failure", "fail", "nobody", "no", "not",
    "don't", "dont", "doesn't", "didn't", "can't", "won't", "quit", "quitting", "fired",
    "deleted", "delete", "killed", "kills", "kill", "replaced", "replaces", "cut",
    "beat", "free", "paid", "charged", "hired", "saved", "first", "banned", "worst",
    "hate", "hated", "wasted", "waste", "scam", "lie", "lied", "lying", "truth",
    "secret", "hidden", "stole", "stolen", "before", "until", "instead", "but",
    "except", "unless", "risk", "danger", "regret", "wish", "should", "shouldn't",
    "still", "already", "only", "without", "actually",
}
EINSATZ_STAEMME = ("verlor", "verlier", "verschwend", "gekündig", "bereu", "scheiter",
                   "geschei", "versteck", "abgezock", "schlimm", "fehler", "falsch")

# Einstiege, die die erste Sekunde mit nichts füllen (als Wortfolgen).
SCHWACHE_EINSTIEGE = [tuple(s.split()) for s in [
    "also", "ok", "okay", "hey", "hi", "hallo", "servus", "moin", "grüß", "grüezi",
    "leute", "na", "so", "ja", "ähm", "äh", "willkommen", "herzlich willkommen", "heute",
    "eigentlich", "ehrlich gesagt", "schau mal", "hör zu", "ich wollte", "ich möchte",
    "ich will", "ich zeige", "ich zeig", "einer der", "eine der", "hast du", "kennst du",
    "weißt du", "wusstest du", "bist du", "in diesem", "im heutigen", "es gibt",
    "das ist", "es ist", "dies ist", "als", "wenn es um", "du weißt", "lass uns",
    "lasst uns", "liebe",
    # englisch
    "okay", "guys", "yo", "alright", "welcome", "today", "basically", "honestly",
    "look", "listen", "um", "just", "let", "lets", "let's", "i wanted", "i want",
    "one of", "have you", "did you", "do you", "are you", "in this", "in today",
    "the thing", "a lot", "there is", "there are", "this is", "it is", "as a",
    "when it", "if you've", "you know",
]]

# Aufforderungen, die sich den ersten Platz verdienen.
IMPERATIVE = {
    "hör", "höre", "stopp", "klau", "klaue", "kopier", "kopiere", "lösch", "lösche",
    "probier", "probiere", "versuch", "versuche", "schau", "lies", "speicher",
    "speichere", "nutz", "nutze", "bau", "baue", "mach", "mache", "schreib", "schreibe",
    "schick", "schicke", "nimm", "starte", "check", "prüf", "prüfe", "vergiss", "frag",
    "frage", "lass", "sag", "rechne", "tu", "zeig", "merk", "merke", "denk", "spar",
    "spare", "verlang", "verlange", "erhöh", "erhöhe", "streich", "streiche", "poste",
    # englisch
    "stop", "steal", "copy", "delete", "try", "watch", "read", "save", "use", "build",
    "make", "write", "send", "take", "start", "quit", "never", "always", "don't", "dont",
    "do", "put", "run",
}

K_O_GRUENDE = [
    (re.compile(r"(?i)^\s*(?:hör(?:t)? auf zu scrollen|stopp[,!.]?\s*(?:nicht )?(?:weiter)?scroll"
                r"|nicht (?:weiter)?scrollen|scroll nicht weiter|stop scrolling|don'?t scroll)"),
     "Beginnt mit „Hör auf zu scrollen“. Wer um Aufmerksamkeit bittet, zeigt, dass er sie "
     "sich nicht verdient hat."),
    (re.compile(r"(?i)\b(?:in diesem (?:video|reel|beitrag)|im heutigen (?:video|reel)"
                r"|heute zeige? ich (?:dir|euch)|ich zeige? (?:dir|euch) heute"
                r"|in (?:this|today'?s) (?:video|reel)|i'?m going to show you|i'?ll show you how)\b"),
     "Video-Vorrede. Streich sie und fang mit dem Ergebnis an."),
    (re.compile(r"(?i)^\s*(?:hallo|hi|hey|servus|moin|grüß (?:dich|euch|gott)|grüezi|"
                r"(?:herzlich )?willkommen|na,? (?:ihr|du)\b|liebe (?:community|leute)|"
                r"what'?s up |welcome )"),
     "Begrüßung. Niemand öffnet Instagram, um begrüßt zu werden."),
    (HASHTAG_RE,
     "Hashtag im Hook. Hashtags gehören, wenn überhaupt, unten in die Caption."),
    (EMOJI_RE,
     "Emoji im Hook. Text in Hook-Größe hat Platz für Wörter oder für ein Emoji, nicht für beides."),
]


def de_zahl(x, stellen=1):
    return f"{x:.{stellen}f}".replace(".", ",")


def clamp(n):
    return max(0.0, min(100.0, n))


def klein(w):
    return w.lower().strip("'’")


def ist_zahlwort(w):
    w = klein(w)
    if w in KEINE_ZAHLWOERTER:
        return False
    return w in ZAHLWOERTER_EXTRA or (len(w) > 3 and ZAHLWORT_RE.fullmatch(w) is not None)


def ist_einsatz(w):
    w = klein(w)
    return w in EINSATZ or any(w.startswith(s) for s in EINSATZ_STAEMME)


def namen(text, deutsch):
    """Prüfbares: Namen und Kürzel. Im Deutschen nicht jedes große Wort."""
    if not deutsch:
        return set(EN_NAME_RE.findall(text))
    treffer = set()
    for w in re.findall(r"[^\W_][\w'’-]*", text):
        if (re.fullmatch(r"[A-ZÄÖÜ]{2,4}\d?", w) and w not in KEINE_KUERZEL) \
                or re.search(r"[a-zäöü][A-ZÄÖÜ]", w) or w.lower() in MONATE_TAGE:
            treffer.add(w)
    for m in re.finditer(r"(?<=[a-zäöüß,;:] )([A-ZÄÖÜ][a-zäöüß]+) ([A-ZÄÖÜ][a-zäöüß]+)", text):
        if m.group(1).lower() not in {"sie", "ihr", "ihre", "ihnen"}:
            treffer.add(m.group(0))                # "für Familie Huber"
    return treffer


# ---------------------------------------------------------------------------
# Die fünf Prüfungen
# ---------------------------------------------------------------------------

def pruefe_laenge(text, deutsch):
    """Ein Hook muss ankommen, bevor der Daumen weiterwischt."""
    w = woerter(text)
    n = len(w)
    s = silben(text)
    sek = s / TEMPO
    zeichen = len(text.strip())
    if 6 <= s <= 16:
        punkte = 100.0
    elif s < 6:
        punkte = clamp(100 - (6 - s) * 15)
    else:
        punkte = clamp(100 - (s - 16) * 6)
    if zeichen > 70:                     # zwei Zeilen großer Text im Bild
        punkte -= 12
    return clamp(punkte), (f"{n} Wörter, {s} Silben, {zeichen} Zeichen, "
                           f"ca. {de_zahl(sek)} s gesprochen (Ziel: 6 bis 16 Silben)")


def pruefe_konkret(text, deutsch):
    """Eine konkrete Sache schlägt drei abstrakte."""
    zahlen = [z.strip() for z in ZAHL_RE.findall(ohne_tausenderpunkt(text)) if z.strip()]
    nm = namen(text, deutsch)
    gesprochen = [klein(w) for w in woerter(text)
                  if ist_zahlwort(w) or klein(w) in GELDWOERTER]
    treffer = len(zahlen) + len(nm) + len(gesprochen)
    punkte = 15.0 if treffer == 0 else clamp(45 + treffer * 30)
    gefunden = ", ".join(zahlen[:2] + sorted(nm)[:2] + gesprochen[:2])
    return punkte, (f"{treffer} konkrete Angabe(n)" + (f": {gefunden}" if gefunden else
                    " - keine Zahl, kein Name, nichts Prüfbares"))


def pruefe_einsatz(text, deutsch):
    """Spannung, Kosten, Verneinung: etwas, das man verlieren kann."""
    gefunden = sorted({klein(x) for x in woerter(text) if ist_einsatz(x)})
    if re.search(r"[€$]\s?\d|\d\s?(?:€|euro\b)", text, re.IGNORECASE):
        gefunden.append("ein Preis")
    n = len(gefunden)
    punkte = {0: 20.0, 1: 70.0}.get(n, 100.0)
    detail = f"{n} Spannungs-Signal(e)" + (f": {', '.join(gefunden[:4])}" if gefunden else
                                           " - in diesem Satz steht nichts auf dem Spiel")
    return clamp(punkte), detail


def pruefe_anfang(text, deutsch):
    """Das interessante Wort darf nicht an neunter Stelle stehen."""
    w = woerter(text)
    if not w:
        return 0.0, "leer"
    low = [klein(x) for x in w]
    abzug, einstieg = 0, None
    for schwach in SCHWACHE_EINSTIEGE:
        if tuple(low[:len(schwach)]) == schwach:
            abzug, einstieg = 30, " ".join(schwach)
            break
    nm = {x for n in namen(text, deutsch) for x in n.split()}
    kern = None
    for i, token in enumerate(w):
        if (ist_einsatz(token) or ist_zahlwort(token) or klein(token) in GELDWOERTER
                or re.search(r"\d", token) or token in nm):
            kern = i
            break
    if kern is None:
        basis, wo = 30.0, "kein Kernwort im ganzen Satz"
    elif kern <= 3:
        basis, wo = 100.0, f"Kernwort an Stelle {kern + 1}"
    elif kern <= 6:
        basis, wo = 70.0, f"Kernwort an Stelle {kern + 1}, könnte weiter nach vorne"
    else:
        basis, wo = 40.0, f"Kernwort an Stelle {kern + 1}, zu spät"
    detail = wo + (f"; schwacher Einstieg „{einstieg}“" if einstieg else "")
    return clamp(basis - abzug), detail


def pruefe_ansprache(text, deutsch):
    """An eine Person gerichtet, oder ins Leere gesprochen."""
    low = text.lower()
    w = [klein(x) for x in woerter(text)]
    if re.search(r"\b(?:du|dich|dir|dein|deine|deinen|deinem|deiner|deines|euch|euer|eure"
                 r"|euren|eurem|eurer|ihr)\b", low) \
            or re.search(r"(?<=[a-zäöüß,] )(?:Sie|Ihnen|Ihr|Ihre|Ihren|Ihrem|Ihrer)\b", text) \
            or re.search(r"\b(?:you|your|you're|youre|yourself)\b", low):
        return 100.0, "spricht die Zuschauer direkt an"
    if w and w[0] in IMPERATIVE:
        return 90.0, f"Aufforderung am Anfang („{w[0]}“)"
    if re.search(r"\b(?:ich|mich|mir|mein|meine|meinen|meinem|meiner|meines|wir|uns|unser"
                 r"|unsere|unseren|unserem|unserer|i|my|me|we|our)\b", low):
        return 70.0, "Ich-Form, aber niemand wird angesprochen"
    return 35.0, "dritte Person, niemand im Raum"


PRUEFUNGEN = ["LÄNGE", "KONKRET", "EINSATZ", "ANFANG", "ANSPRACHE"]


def bewerte(text):
    text = normal(text)
    deutsch = ist_deutsch(text)
    ergebnis = {
        "LÄNGE": pruefe_laenge(text, deutsch),
        "KONKRET": pruefe_konkret(text, deutsch),
        "EINSATZ": pruefe_einsatz(text, deutsch),
        "ANFANG": pruefe_anfang(text, deutsch),
        "ANSPRACHE": pruefe_ansprache(text, deutsch),
    }
    gruende = [msg for muster, msg in K_O_GRUENDE if muster.search(text)]
    punkte = [ergebnis[c][0] for c in PRUEFUNGEN]
    # Die schwächste Eigenschaft deckelt den Hook, gleiche Logik wie detect.py:
    # Eine schlechte Eigenschaft reicht, damit der Daumen weiterwischt.
    gesamt = statistics.mean(punkte) * 0.6 + min(punkte) * 0.4 - len(gruende) * 15
    gesamt = clamp(gesamt)
    urteil = "STARK" if gesamt >= 70 and min(punkte) >= 55 and not gruende else (
        "OK" if gesamt >= 50 else "SCHWACH")
    return ergebnis, gesamt, urteil, gruende


# Name aus der englischen Fassung, damit swipe.py weiter importieren kann.
run = bewerte


def balken(punkte, breite=24):
    voll = round(punkte / 100 * breite)
    return "#" * voll + "." * (breite - voll)


def zeige_einen(text, ergebnis, gesamt, urteil, gruende, out=sys.stdout):
    print("\nHOOK-BEWERTUNG", file=out)
    print("=" * 66, file=out)
    print(f"  „{text.strip()}“\n", file=out)
    for name in PRUEFUNGEN:
        punkte, detail = ergebnis[name]
        print(f"  {name:<12} {balken(punkte)} {de_zahl(punkte):>5}", file=out)
        print(f"  {'':<12} {detail}", file=out)
    print("-" * 66, file=out)
    print(f"  {'PUNKTE':<12} {balken(gesamt)} {de_zahl(gesamt):>5}   {urteil}", file=out)
    for g in gruende:
        print(f"\n  K.-o.-Grund: {g}", file=out)
    if urteil != "STARK":
        schwach = min(PRUEFUNGEN, key=lambda c: ergebnis[c][0])
        print(f"\n  Schwächste Eigenschaft: {schwach}. Verbessere die und miss neu.", file=out)
    print("", file=out)


def zeige_tabelle(zeilen, out=sys.stdout):
    print("\nHOOK-RANGLISTE\n" + "=" * 78, file=out)
    for i, z in enumerate(zeilen, 1):
        pfeil = "->" if i == 1 else "  "
        hook = z["hook"] if len(z["hook"]) <= 62 else z["hook"][:59] + "..."
        print(f"{pfeil} {de_zahl(z['score']):>5} {z['verdict']:<8} {hook}", file=out)
        print(f"         schwächste: {z['weakest']} ({z['checks'][z['weakest']]['score']:.0f})",
              file=out)
        for g in z["flags"]:
            print(f"         K.-o.-Grund: {g}", file=out)
    print("\nNimm den obersten. Liegt der oberste unter 50, ist noch keiner davon der Hook.\n",
          file=out)


def main():
    utf8_konsole()
    ap = argparse.ArgumentParser(description="Bewertet Reel-Hooks nach fünf Eigenschaften.")
    ap.add_argument("input", nargs="?", default="-",
                    help="Datei mit einem Hook pro Zeile, oder - für die Eingabe")
    ap.add_argument("--hook", help="einen einzelnen Hook direkt bewerten")
    ap.add_argument("--json", action="store_true", help="Ergebnis als JSON")
    args = ap.parse_args()

    if args.hook:
        zeilen = [args.hook]
    else:
        try:
            roh = lies(args.input)
        except OSError as e:
            print(f"Datei nicht lesbar: {e}", file=sys.stderr)
            sys.exit(2)
        zeilen = [z.strip() for z in normal(roh).splitlines() if z.strip()]
    if not zeilen:
        print("Nichts zu bewerten.", file=sys.stderr)
        sys.exit(2)

    daten = []
    for zeile in zeilen:
        ergebnis, gesamt, urteil, gruende = bewerte(zeile)
        daten.append({
            "hook": normal(zeile),
            "checks": {k: {"score": round(v[0], 1), "detail": v[1]} for k, v in ergebnis.items()},
            "weakest": min(PRUEFUNGEN, key=lambda c: ergebnis[c][0]),
            "flags": gruende,
            "score": round(gesamt, 1),
            "verdict": urteil,
        })

    if args.json:
        print(json.dumps(daten if len(daten) > 1 else daten[0], indent=2, ensure_ascii=False))
        return

    if len(daten) == 1:
        ergebnis, gesamt, urteil, gruende = bewerte(zeilen[0])
        zeige_einen(normal(zeilen[0]), ergebnis, gesamt, urteil, gruende)
    else:
        zeige_tabelle(sorted(daten, key=lambda r: -r["score"]))


if __name__ == "__main__":
    main()
