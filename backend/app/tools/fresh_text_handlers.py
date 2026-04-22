"""
ISHU TOOLS – Fresh batch (April 2026)
15 lightweight, pure-Python text/utility handlers.
"""
from __future__ import annotations

import json
import random
import re
from typing import Any

from .handlers import ExecutionResult


def _text_result(data: dict[str, Any], message: str = "Done") -> ExecutionResult:
    return ExecutionResult(kind="json", message=message, data=data)


def _get_text(payload: dict[str, Any]) -> str:
    return str(payload.get("text") or payload.get("input") or "")


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
}
