"""
Enrich _BASE_DEFS rows in backend/app/registry.py and the matching
catalogFallback.ts entries with: a precise title (base 2 → base 16 etc.),
a one-line description that includes a worked example, and a richer tag
set for fuzzy search.

Idempotent — safe to re-run.
"""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "backend" / "app" / "registry.py"
FALLBACK = ROOT / "frontend" / "src" / "data" / "catalogFallback.ts"

# (display, base_label, prefix or None)
B = {
    "binary":      ("Binary",      "base 2",  "0b"),
    "decimal":     ("Decimal",     "base 10", None),
    "octal":       ("Octal",       "base 8",  "0o"),
    "hex":         ("Hex",         "base 16", "0x"),
    "hexadecimal": ("Hexadecimal", "base 16", "0x"),
}
# Special "text-like" sources that aren't numeric bases.
TEXTY = {
    "text":   ("Text",   "UTF-8 characters"),
    "string": ("String", "UTF-8 characters"),
    "ascii":  ("ASCII",  "ASCII codes"),
}

# Worked examples: keyed by (from, to) — pre-computed canonical demos.
EX = {
    ("binary",  "decimal"):     "1010₂ = 10₁₀",
    ("decimal", "binary"):      "10₁₀ = 1010₂",
    ("hex",     "decimal"):     "0xFF = 255",
    ("hexadecimal","decimal"):  "0xFF = 255",
    ("decimal", "hex"):         "255 = 0xFF",
    ("decimal", "hexadecimal"): "255 = 0xFF",
    ("octal",   "decimal"):     "0o17 = 15",
    ("decimal", "octal"):       "15 = 0o17",
    ("binary",  "hex"):         "11111111₂ = 0xFF",
    ("binary",  "hexadecimal"): "11111111₂ = 0xFF",
    ("hex",     "binary"):      "0xFF = 11111111₂",
    ("hexadecimal","binary"):   "0xFF = 11111111₂",
    ("binary",  "octal"):       "111111₂ = 0o77",
    ("octal",   "binary"):      "0o77 = 111111₂",
    ("hex",     "octal"):       "0xFF = 0o377",
    ("octal",   "hex"):         "0o377 = 0xFF",
    ("text",    "binary"):      "'A' = 01000001",
    ("string",  "binary"):      "'A' = 01000001",
    ("text",    "hex"):         "'A' = 41",
    ("string",  "hex"):         "'A' = 41",
    ("text",    "octal"):       "'A' = 101",
    ("text",    "ascii"):       "'A' = 65",
    ("string",  "ascii"):       "'A' = 65",
    ("ascii",   "text"):        "65 = 'A'",
    ("ascii",   "string"):      "65 = 'A'",
    ("ascii",   "binary"):      "65 = 01000001",
    ("ascii",   "hex"):         "65 = 0x41",
}

def _enrich(slug: str) -> tuple[str, str, list[str]] | None:
    m = re.match(r"^([a-z]+)-to-([a-z]+)$", slug)
    if not m:
        return None
    a, b = m.group(1), m.group(2)
    a_in_b = a in B
    b_in_b = b in B
    a_in_t = a in TEXTY
    b_in_t = b in TEXTY
    if not (a_in_b or a_in_t) or not (b_in_b or b_in_t):
        return None

    # Title pieces
    if a_in_b and b_in_b:
        A_disp, A_lbl, _ = B[a]
        B_disp, B_lbl, _ = B[b]
        title = f"{A_disp} to {B_disp} Converter ({A_lbl} → {B_lbl})"
        intro = f"Convert {A_disp.lower()} ({A_lbl}) to {B_disp.lower()} ({B_lbl}) instantly"
    elif a_in_t and b_in_b:
        A_disp, A_lbl = TEXTY[a]
        B_disp, B_lbl, _ = B[b]
        title = f"{A_disp} to {B_disp} Converter ({A_lbl} → {B_lbl})"
        intro = f"Convert {A_disp.lower()} to {B_disp.lower()} ({B_lbl}, UTF-8) instantly"
    elif a_in_b and b_in_t:
        A_disp, A_lbl, _ = B[a]
        B_disp, B_lbl = TEXTY[b]
        title = f"{A_disp} to {B_disp} Converter ({A_lbl} → {B_lbl})"
        intro = f"Convert {A_disp.lower()} ({A_lbl}) to {B_disp.lower()} instantly"
    else:  # both texty
        A_disp, _ = TEXTY[a]
        B_disp, _ = TEXTY[b]
        title = f"{A_disp} to {B_disp} Converter"
        intro = f"Convert {A_disp.lower()} to {B_disp.lower()} instantly"

    ex = EX.get((a, b))
    if ex:
        desc = f"{intro}. Example: {ex}. Free, no signup, accepts common prefixes."
    else:
        desc = f"{intro}. Free, no signup, accepts common prefixes."

    tags = list(dict.fromkeys([
        f"{a} to {b}",
        f"convert {a} to {b}",
        f"{a} {b} converter",
        title.lower().replace(" — free online", ""),
        "number base converter",
        "free converter",
    ]))
    return title, desc, tags


def _py_str(s: str) -> str:
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"

def _ts_str(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'

def patch_registry() -> int:
    text = REGISTRY.read_text(encoding="utf-8")
    # Find the _BASE_DEFS block boundaries (between `_BASE_DEFS = [` and `]`)
    m = re.search(r"_BASE_DEFS\s*[:=][^=\n]*=\s*\[", text)
    if not m:
        # _BASE_DEFS may be declared with type ann. Try wider.
        m = re.search(r"_BASE_DEFS[^[]*\[", text)
        if not m:
            return 0
    start = m.end()
    # Find the matching closing bracket — count brackets.
    depth = 1
    i = start
    while i < len(text) and depth > 0:
        c = text[i]
        if c == "[": depth += 1
        elif c == "]": depth -= 1
        i += 1
    block = text[start : i - 1]

    pat = re.compile(
        r"\(\s*\"([a-z-]+)\"\s*,\s*\"([^\"]*)\"\s*,\s*\"([^\"]*)\"\s*,\s*\[([^\]]*)\]\s*\)",
    )
    changed = 0
    def repl(mm: re.Match) -> str:
        nonlocal changed
        slug = mm.group(1)
        en = _enrich(slug)
        if not en:
            return mm.group(0)
        title, desc, tags = en
        tag_str = ", ".join('"' + t.replace('"', '\\"') + '"' for t in tags)
        new = f'("{slug}", "{title}", "{desc}", [{tag_str}])'
        if new != mm.group(0):
            changed += 1
        return new
    new_block = pat.sub(repl, block)
    new_text = text[:start] + new_block + text[i - 1:]
    if new_text != text:
        REGISTRY.write_text(new_text, encoding="utf-8")
    return changed


def patch_fallback() -> int:
    text = FALLBACK.read_text(encoding="utf-8")
    obj_pat = re.compile(
        r"""
        \{\s*
        "slug"\s*:\s*"(?P<slug>[a-z-]+)"\s*,\s*
        "title"\s*:\s*"(?P<title>[^"]*)"\s*,\s*
        "description"\s*:\s*"(?P<desc>[^"]*)"\s*,\s*
        "category"\s*:\s*"(?P<cat>developer-tools|number-base-converter|student-tools|text-tools)"\s*,\s*
        "tags"\s*:\s*\[(?P<tags>[^\]]*)\]\s*,\s*
        "input_kind"\s*:\s*"(?P<ik>[^"]*)"\s*,\s*
        "accepts_multiple"\s*:\s*(?P<am>true|false)\s*
        \}
        """,
        re.VERBOSE,
    )
    changed = 0
    def repl(m: re.Match) -> str:
        nonlocal changed
        slug = m.group("slug")
        en = _enrich(slug)
        if not en:
            return m.group(0)
        title, desc, tags = en
        tag_lines = ",\n      ".join(_ts_str(t) for t in tags)
        new = (
            "{\n"
            f'    "slug": {_ts_str(slug)},\n'
            f'    "title": {_ts_str(title)},\n'
            f'    "description": {_ts_str(desc)},\n'
            f'    "category": "{m.group("cat")}",\n'
            f'    "tags": [\n      {tag_lines}\n    ],\n'
            f'    "input_kind": {_ts_str(m.group("ik"))},\n'
            f'    "accepts_multiple": {m.group("am")}\n'
            "  }"
        )
        if new != m.group(0):
            changed += 1
        return new
    new_text = obj_pat.sub(repl, text)
    if new_text != text:
        FALLBACK.write_text(new_text, encoding="utf-8")
    return changed


if __name__ == "__main__":
    print("registry.py rows updated:", patch_registry())
    print("catalogFallback.ts entries updated:", patch_fallback())
