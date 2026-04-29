"""
ISHU TOOLS – Fresh batch (April 2026)
15 lightweight, pure-Python text/utility handlers.
"""
from __future__ import annotations

import base64
import codecs
import hashlib
import json
import random
import re
from typing import Any

from .handlers import ExecutionResult


def _text_result(data: dict[str, Any], message: str = "Done") -> ExecutionResult:
    return ExecutionResult(kind="json", message=message, data=data)


def _get_text(payload: dict[str, Any]) -> str:
    return str(payload.get("text") or payload.get("input") or "")


def _clean_lines(text: str) -> list[str]:
    return text.splitlines()


def _map_ascii(text: str, upper_start: int | None = None, lower_start: int | None = None, digit_start: int | None = None) -> str:
    out: list[str] = []
    for ch in text:
        code = ord(ch)
        if upper_start is not None and 65 <= code <= 90:
            out.append(chr(upper_start + code - 65))
        elif lower_start is not None and 97 <= code <= 122:
            out.append(chr(lower_start + code - 97))
        elif digit_start is not None and 48 <= code <= 57:
            out.append(chr(digit_start + code - 48))
        else:
            out.append(ch)
    return "".join(out)


def _make_simple_transform(name: str, transform):
    def handler(_files, payload, _job):
        text = _get_text(payload)
        if not text:
            return _text_result({"error": "empty"}, f"Please paste text for {name}.")
        out = transform(text, payload)
        return _text_result({"result": out, "characters": len(out)}, f"{name} completed.")
    return handler


def handle_base64_encode(_files, payload, _job):
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "empty"}, "Please paste text to encode.")
    out = base64.b64encode(text.encode("utf-8")).decode("ascii")
    return _text_result({"result": out}, "Base64 encoded.")


def handle_base64_decode(_files, payload, _job):
    text = _get_text(payload).strip()
    if not text:
        return _text_result({"error": "empty"}, "Please paste Base64 text to decode.")
    try:
        padded = text + "=" * (-len(text) % 4)
        out = base64.b64decode(padded, validate=False).decode("utf-8", errors="replace")
    except Exception:
        return _text_result({"error": "invalid_base64"}, "That Base64 text could not be decoded.")
    return _text_result({"result": out}, "Base64 decoded.")


def handle_base32_encode(_files, payload, _job):
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "empty"}, "Please paste text to encode.")
    out = base64.b32encode(text.encode("utf-8")).decode("ascii")
    return _text_result({"result": out}, "Base32 encoded.")


def handle_base32_decode(_files, payload, _job):
    text = _get_text(payload).strip().replace(" ", "")
    if not text:
        return _text_result({"error": "empty"}, "Please paste Base32 text to decode.")
    try:
        padded = text.upper() + "=" * (-len(text) % 8)
        out = base64.b32decode(padded, casefold=True).decode("utf-8", errors="replace")
    except Exception:
        return _text_result({"error": "invalid_base32"}, "That Base32 text could not be decoded.")
    return _text_result({"result": out}, "Base32 decoded.")


def _hash_handler(algorithm: str):
    def handler(_files, payload, _job):
        text = _get_text(payload)
        if not text:
            return _text_result({"error": "empty"}, "Please paste text to hash.")
        digest = hashlib.new(algorithm, text.encode("utf-8")).hexdigest()
        return _text_result({"algorithm": algorithm, "hash": digest, "result": digest}, f"{algorithm.upper()} hash generated.")
    return handler


def handle_json_validator(_files, payload, _job):
    text = _get_text(payload).strip()
    if not text:
        return _text_result({"valid": False, "error": "empty"}, "Please paste JSON to validate.")
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError as exc:
        return _text_result(
            {"valid": False, "line": exc.lineno, "column": exc.colno, "message": exc.msg},
            f"Invalid JSON near line {exc.lineno}, column {exc.colno}.",
        )
    return _text_result({"valid": True, "type": type(parsed).__name__, "formatted": json.dumps(parsed, ensure_ascii=False, indent=2)}, "JSON is valid.")


def _title_case(text: str) -> str:
    return re.sub(r"\S+", lambda m: m.group(0)[:1].upper() + m.group(0)[1:].lower(), text)


def _sentence_case(text: str) -> str:
    lowered = text.lower()
    return re.sub(r"(^\s*[a-z])|([.!?]\s+[a-z])", lambda m: m.group(0).upper(), lowered)


def _rot47(text: str) -> str:
    out = []
    for ch in text:
        code = ord(ch)
        out.append(chr(33 + ((code + 14) % 94)) if 33 <= code <= 126 else ch)
    return "".join(out)


def _caesar(text: str, shift: int = 13) -> str:
    out = []
    for ch in text:
        if "a" <= ch <= "z":
            out.append(chr((ord(ch) - 97 + shift) % 26 + 97))
        elif "A" <= ch <= "Z":
            out.append(chr((ord(ch) - 65 + shift) % 26 + 65))
        else:
            out.append(ch)
    return "".join(out)


def _atbash(text: str) -> str:
    out = []
    for ch in text:
        if "a" <= ch <= "z":
            out.append(chr(122 - (ord(ch) - 97)))
        elif "A" <= ch <= "Z":
            out.append(chr(90 - (ord(ch) - 65)))
        else:
            out.append(ch)
    return "".join(out)


def _upside_down(text: str) -> str:
    pairs = {
        "a": "ɐ", "b": "q", "c": "ɔ", "d": "p", "e": "ǝ", "f": "ɟ", "g": "ƃ", "h": "ɥ", "i": "ᴉ", "j": "ɾ",
        "k": "ʞ", "l": "ʅ", "m": "ɯ", "n": "u", "o": "o", "p": "d", "q": "b", "r": "ɹ", "s": "s", "t": "ʇ",
        "u": "n", "v": "ʌ", "w": "ʍ", "x": "x", "y": "ʎ", "z": "z", "0": "0", "1": "Ɩ", "2": "ᄅ",
        "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6", ".": "˙", ",": "'",
        "!": "¡", "?": "¿", "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<",
    }
    pairs.update({k.upper(): v.upper() for k, v in list(pairs.items()) if k.isalpha()})
    return "".join(pairs.get(ch, ch) for ch in text)[::-1]


def _leetspeak(text: str) -> str:
    return text.translate(str.maketrans({"a": "4", "e": "3", "i": "1", "o": "0", "s": "5", "t": "7", "A": "4", "E": "3", "I": "1", "O": "0", "S": "5", "T": "7"}))


# ── 1. Text Shuffler ────────────────────────────────────────────────────────
def handle_text_shuffler(_files, payload, _job):
    text = _get_text(payload)
    mode = (payload.get("mode") or "words").lower()
    if not text.strip():
        return _text_result({"error": "empty"}, "Please paste some text to shuffle.")
    if mode == "lines":
        items = text.splitlines()
        random.shuffle(items)
        out = "\n".join(items)
    elif mode == "characters":
        chars = list(text)
        random.shuffle(chars)
        out = "".join(chars)
    else:  # words
        words = text.split()
        random.shuffle(words)
        out = " ".join(words)
    return _text_result({"result": out, "mode": mode}, f"Shuffled by {mode}.")


# ── 2. Sponge Case (mocking SpongeBob) ──────────────────────────────────────
def handle_sponge_case(_files, payload, _job):
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "empty"}, "Please paste some text.")
    out = "".join(c.upper() if i % 2 else c.lower() for i, c in enumerate(text))
    return _text_result({"result": out}, "Converted to sPoNgE cAsE.")


# ── 3. Inverse Case ─────────────────────────────────────────────────────────
def handle_inverse_case(_files, payload, _job):
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "empty"}, "Please paste some text.")
    return _text_result({"result": text.swapcase()}, "Each character's case flipped.")


# ── 4. Alternate Case (word-level) ──────────────────────────────────────────
def handle_alternate_case(_files, payload, _job):
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "empty"}, "Please paste some text.")
    words = re.split(r"(\s+)", text)
    flipped = []
    idx = 0
    for w in words:
        if w.strip():
            flipped.append(w.upper() if idx % 2 == 0 else w.lower())
            idx += 1
        else:
            flipped.append(w)
    return _text_result({"result": "".join(flipped)}, "Alternated word casing.")


# ── 5. Reverse Words (per line) ─────────────────────────────────────────────
def handle_reverse_words(_files, payload, _job):
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "empty"}, "Please paste some text.")
    lines = [" ".join(reversed(line.split())) for line in text.splitlines()]
    return _text_result({"result": "\n".join(lines)}, "Reversed word order in each line.")


# ── 6. Unicode Escape ───────────────────────────────────────────────────────
def handle_unicode_escape(_files, payload, _job):
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "empty"}, "Please paste some text.")
    out = "".join(c if ord(c) < 128 else f"\\u{ord(c):04x}" for c in text)
    return _text_result({"result": out}, "Escaped non-ASCII to \\uXXXX.")


# ── 7. Unicode Unescape ─────────────────────────────────────────────────────
def handle_unicode_unescape(_files, payload, _job):
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "empty"}, "Please paste escaped text.")
    try:
        out = text.encode("utf-8").decode("unicode_escape")
    except Exception as e:
        return _text_result({"error": str(e)}, "Could not decode — check the escape sequences.")
    return _text_result({"result": out}, "Decoded Unicode escapes.")


# ── 8. URL Slug Generator ───────────────────────────────────────────────────
def handle_url_slug_generator(_files, payload, _job):
    text = _get_text(payload)
    sep = (payload.get("separator") or "-").strip() or "-"
    case = (payload.get("case") or "lower").lower()
    if not text:
        return _text_result({"error": "empty"}, "Please paste a title or sentence.")
    s = text.lower() if case == "lower" else text
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"\s+", sep, s.strip())
    s = re.sub(rf"{re.escape(sep)}+", sep, s)
    return _text_result({"result": s}, "Generated URL-friendly slug.")


# ── 9. Emoji Counter ────────────────────────────────────────────────────────
_EMOJI_RE = re.compile(
    "["
    "\U0001F300-\U0001F6FF"
    "\U0001F900-\U0001F9FF"
    "\U0001FA70-\U0001FAFF"
    "\U00002600-\U000027BF"
    "\U0001F1E6-\U0001F1FF"
    "]",
    flags=re.UNICODE,
)


def handle_emoji_counter(_files, payload, _job):
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "empty"}, "Please paste some text.")
    emojis = _EMOJI_RE.findall(text)
    from collections import Counter
    counts = Counter(emojis)
    top = counts.most_common(20)
    return _text_result(
        {
            "total": len(emojis),
            "unique": len(counts),
            "top": [{"emoji": e, "count": c} for e, c in top],
        },
        f"Found {len(emojis)} emoji(s), {len(counts)} unique.",
    )


# ── 10. Sentence Counter ────────────────────────────────────────────────────
def handle_sentence_counter(_files, payload, _job):
    text = _get_text(payload)
    if not text.strip():
        return _text_result({"error": "empty"}, "Please paste some text.")
    sentences = [s for s in re.split(r"(?<=[.!?])\s+", text.strip()) if s.strip()]
    avg_words = sum(len(s.split()) for s in sentences) / max(1, len(sentences))
    return _text_result(
        {"sentences": len(sentences), "avg_words_per_sentence": round(avg_words, 2)},
        f"{len(sentences)} sentences, ~{avg_words:.1f} words each.",
    )


# ── 11. Paragraph Counter ───────────────────────────────────────────────────
def handle_paragraph_counter(_files, payload, _job):
    text = _get_text(payload)
    if not text.strip():
        return _text_result({"error": "empty"}, "Please paste some text.")
    paragraphs = [p for p in re.split(r"\n\s*\n", text.strip()) if p.strip()]
    return _text_result(
        {
            "paragraphs": len(paragraphs),
            "characters": len(text),
            "words": len(text.split()),
        },
        f"{len(paragraphs)} paragraph(s) detected.",
    )


# ── 12. WPM Calculator ──────────────────────────────────────────────────────
def handle_wpm_calculator(_files, payload, _job):
    text = _get_text(payload)
    try:
        seconds = float(payload.get("seconds") or 60)
    except Exception:
        seconds = 60.0
    if seconds <= 0 or not text.strip():
        return _text_result({"error": "invalid"}, "Provide both text and a positive duration.")
    words = len(text.split())
    chars = len(text)
    wpm = words / (seconds / 60)
    cpm = chars / (seconds / 60)
    return _text_result(
        {
            "words": words,
            "characters": chars,
            "seconds": seconds,
            "wpm": round(wpm, 2),
            "cpm": round(cpm, 2),
        },
        f"{wpm:.1f} WPM ({cpm:.0f} CPM) over {seconds:.0f}s.",
    )


# ── 13. Syllable Counter ────────────────────────────────────────────────────
_VOWELS = "aeiouy"


def _count_syllables(word: str) -> int:
    word = word.lower().strip(".,!?;:\"'()[]")
    if not word:
        return 0
    count = 0
    prev_vowel = False
    for ch in word:
        is_vowel = ch in _VOWELS
        if is_vowel and not prev_vowel:
            count += 1
        prev_vowel = is_vowel
    if word.endswith("e") and count > 1:
        count -= 1
    return max(1, count)


def handle_syllable_counter(_files, payload, _job):
    text = _get_text(payload)
    if not text.strip():
        return _text_result({"error": "empty"}, "Please paste some text.")
    words = re.findall(r"[A-Za-z']+", text)
    syllables = sum(_count_syllables(w) for w in words)
    return _text_result(
        {
            "words": len(words),
            "syllables": syllables,
            "avg_syllables_per_word": round(syllables / max(1, len(words)), 2),
        },
        f"{syllables} syllables across {len(words)} words.",
    )


# ── 14. JSON Escape ─────────────────────────────────────────────────────────
def handle_json_escape(_files, payload, _job):
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "empty"}, "Please paste some text.")
    encoded = json.dumps(text, ensure_ascii=False)
    inner = encoded[1:-1]
    return _text_result({"result": inner, "quoted": encoded}, "Escaped for JSON strings.")


# ── 15. JSON Unescape ───────────────────────────────────────────────────────
def handle_json_unescape(_files, payload, _job):
    text = _get_text(payload).strip()
    if not text:
        return _text_result({"error": "empty"}, "Please paste an escaped JSON string.")
    try:
        if not (text.startswith('"') and text.endswith('"')):
            text = '"' + text + '"'
        out = json.loads(text)
    except Exception as e:
        return _text_result({"error": str(e)}, "Could not parse — make sure it is a valid JSON string.")
    return _text_result({"result": out}, "Decoded JSON string.")


# ── Registry ────────────────────────────────────────────────────────────────

FRESH_TEXT_HANDLERS = {
    "text-shuffler": handle_text_shuffler,
    "sponge-case": handle_sponge_case,
    "inverse-case": handle_inverse_case,
    "alternate-case": handle_alternate_case,
    "reverse-words": handle_reverse_words,
    "unicode-escape": handle_unicode_escape,
    "unicode-unescape": handle_unicode_unescape,
    "url-slug-generator": handle_url_slug_generator,
    "emoji-counter": handle_emoji_counter,
    "sentence-counter": handle_sentence_counter,
    "paragraph-counter": handle_paragraph_counter,
    "wpm-calculator": handle_wpm_calculator,
    "syllable-counter": handle_syllable_counter,
    "json-escape": handle_json_escape,
    "json-unescape": handle_json_unescape,
    "base64-encoder": handle_base64_encode,
    "base64-decoder": handle_base64_decode,
    "base32-encoder": handle_base32_encode,
    "base32-decoder": handle_base32_decode,
    "md5-hash-generator": _hash_handler("md5"),
    "sha1-hash-generator": _hash_handler("sha1"),
    "sha256-hash-generator": _hash_handler("sha256"),
    "sha384-hash-generator": _hash_handler("sha384"),
    "sha512-hash-generator": _hash_handler("sha512"),
    "reverse-text": _make_simple_transform("Reverse text", lambda text, _payload: text[::-1]),
    "text-reverser": _make_simple_transform("Reverse text", lambda text, _payload: text[::-1]),
    "backwards-text-generator": _make_simple_transform("Backward text", lambda text, _payload: text[::-1]),
    "reverse-lines": _make_simple_transform("Reverse lines", lambda text, _payload: "\n".join(reversed(_clean_lines(text)))),
    "remove-duplicate-lines": _make_simple_transform("Remove duplicate lines", lambda text, _payload: "\n".join(dict.fromkeys(_clean_lines(text)))),
    "duplicate-line-remover": _make_simple_transform("Remove duplicate lines", lambda text, _payload: "\n".join(dict.fromkeys(_clean_lines(text)))),
    "unique-lines": _make_simple_transform("Unique lines", lambda text, _payload: "\n".join(dict.fromkeys(_clean_lines(text)))),
    "remove-empty-lines": _make_simple_transform("Remove empty lines", lambda text, _payload: "\n".join(line for line in _clean_lines(text) if line.strip())),
    "add-line-numbers": _make_simple_transform("Add line numbers", lambda text, _payload: "\n".join(f"{i}. {line}" for i, line in enumerate(_clean_lines(text), 1))),
    "trim-whitespace": _make_simple_transform("Trim whitespace", lambda text, _payload: "\n".join(line.strip() for line in _clean_lines(text))),
    "shuffle-lines": _make_simple_transform("Shuffle lines", lambda text, _payload: "\n".join(random.sample(_clean_lines(text), len(_clean_lines(text))))),
    "random-line-picker": _make_simple_transform("Random line picker", lambda text, _payload: random.choice([line for line in _clean_lines(text) if line.strip()] or [""])),
    "word-shuffler": _make_simple_transform("Word shuffler", lambda text, _payload: " ".join(random.sample(text.split(), len(text.split())))),
    "character-shuffler": _make_simple_transform("Character shuffler", lambda text, _payload: "".join(random.sample(list(text), len(text)))),
    "uppercase-text": _make_simple_transform("Uppercase text", lambda text, _payload: text.upper()),
    "lowercase-text": _make_simple_transform("Lowercase text", lambda text, _payload: text.lower()),
    "sentence-case": _make_simple_transform("Sentence case", lambda text, _payload: _sentence_case(text)),
    "capitalize-text": _make_simple_transform("Capitalize text", lambda text, _payload: _title_case(text)),
    "invert-case": _make_simple_transform("Invert case", lambda text, _payload: text.swapcase()),
    "toggle-case": _make_simple_transform("Toggle case", lambda text, _payload: text.swapcase()),
    "mixed-case": handle_sponge_case,
    "sponge-text": handle_sponge_case,
    "mock-text": handle_sponge_case,
    "spongebob-case": handle_sponge_case,
    "bold-text-generator": _make_simple_transform("Bold text", lambda text, _payload: _map_ascii(text, 0x1D400, 0x1D41A, 0x1D7CE)),
    "bubble-text": _make_simple_transform("Bubble text", lambda text, _payload: _map_ascii(text.upper(), 0x24B6, None, 0x2460).replace(chr(0x2460 - 1), "⓪")),
    "upside-down-text": _make_simple_transform("Upside-down text", lambda text, _payload: _upside_down(text)),
    "small-text": _make_simple_transform("Small text", lambda text, _payload: text.lower()),
    "wide-text": _make_simple_transform("Wide text", lambda text, _payload: " ".join(text)),
    "spaced-text": _make_simple_transform("Spaced text", lambda text, _payload: " ".join(text)),
    "strikethrough-text": _make_simple_transform("Strikethrough text", lambda text, _payload: "".join(ch + "\u0336" for ch in text)),
    "underline-text": _make_simple_transform("Underline text", lambda text, _payload: "".join(ch + "\u0332" for ch in text)),
    "zalgo-text": _make_simple_transform("Zalgo text", lambda text, _payload: "".join(ch + "\u0301\u0323" if ch.strip() else ch for ch in text)),
    "leetspeak": _make_simple_transform("Leetspeak", lambda text, _payload: _leetspeak(text)),
    "l33t-converter": _make_simple_transform("Leetspeak", lambda text, _payload: _leetspeak(text)),
    "leet-converter": _make_simple_transform("Leetspeak", lambda text, _payload: _leetspeak(text)),
    "rot13": _make_simple_transform("ROT13", lambda text, _payload: codecs.decode(text, "rot_13")),
    "rot47": _make_simple_transform("ROT47", lambda text, _payload: _rot47(text)),
    "caesar-cipher": _make_simple_transform("Caesar cipher", lambda text, payload: _caesar(text, int(payload.get("shift") or 3))),
    "atbash-cipher": _make_simple_transform("Atbash cipher", lambda text, _payload: _atbash(text)),
    "remove-line-breaks": _make_simple_transform("Remove line breaks", lambda text, _payload: " ".join(line.strip() for line in _clean_lines(text) if line.strip())),
    "json-validator": handle_json_validator,
    "slug-generator": handle_url_slug_generator,
}
