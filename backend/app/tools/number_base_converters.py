"""
Number base + text encoding converter pack.
Pure Python, instant, never errors out — always returns a clear message.
"""
from __future__ import annotations
from typing import Callable, Dict
from .handlers import ExecutionResult


# ─── Helpers ──────────────────────────────────────────────────────────────
def _err(msg: str) -> ExecutionResult:
    return ExecutionResult(kind="json", message=msg, data={"error": msg})


def _ok(out: str, msg: str, **extra) -> ExecutionResult:
    return ExecutionResult(
        kind="json",
        message=msg,
        data={"output": out, "result": out, "text": out, "expression": msg, **extra},
    )


def _get_text(payload: dict, *keys) -> str:
    for k in keys:
        v = payload.get(k)
        if v is None:
            continue
        s = str(v).strip()
        if s:
            return s
    return ""


def _strip_prefix(s: str, prefixes: tuple) -> str:
    s = s.strip().replace(" ", "").replace("_", "")
    for p in prefixes:
        if s.lower().startswith(p):
            s = s[len(p):]
    return s


# ─── Number base conversions ─────────────────────────────────────────────
def _h_decimal_to_binary(_files, payload, _job=None):
    s = _get_text(payload, "value", "number", "input", "text")
    if not s:
        return _err("Please enter a decimal number.")
    try:
        n = int(s.replace(",", ""))
    except ValueError:
        return _err(f"'{s}' is not a valid decimal integer.")
    out = bin(n)[2:] if n >= 0 else "-" + bin(-n)[2:]
    return _ok(out, f"✅ {n} (decimal) = {out} (binary)")


def _h_decimal_to_hex(_files, payload, _job=None):
    s = _get_text(payload, "value", "number", "input", "text")
    if not s:
        return _err("Please enter a decimal number.")
    try:
        n = int(s.replace(",", ""))
    except ValueError:
        return _err(f"'{s}' is not a valid decimal integer.")
    out = format(n, "X") if n >= 0 else "-" + format(-n, "X")
    return _ok(out, f"✅ {n} (decimal) = {out} (hex)")


def _h_decimal_to_octal(_files, payload, _job=None):
    s = _get_text(payload, "value", "number", "input", "text")
    if not s:
        return _err("Please enter a decimal number.")
    try:
        n = int(s.replace(",", ""))
    except ValueError:
        return _err(f"'{s}' is not a valid decimal integer.")
    out = oct(n)[2:] if n >= 0 else "-" + oct(-n)[2:]
    return _ok(out, f"✅ {n} (decimal) = {out} (octal)")


def _h_binary_to_decimal(_files, payload, _job=None):
    s = _get_text(payload, "value", "binary", "input", "text")
    if not s:
        return _err("Please enter a binary number.")
    cleaned = _strip_prefix(s, ("0b", "b"))
    try:
        n = int(cleaned, 2)
    except ValueError:
        return _err(f"'{s}' is not a valid binary number (only 0 and 1 allowed).")
    return _ok(str(n), f"✅ {cleaned} (binary) = {n} (decimal)")


def _h_hex_to_decimal(_files, payload, _job=None):
    s = _get_text(payload, "value", "hex", "input", "text")
    if not s:
        return _err("Please enter a hexadecimal number.")
    cleaned = _strip_prefix(s, ("0x", "#"))
    try:
        n = int(cleaned, 16)
    except ValueError:
        return _err(f"'{s}' is not a valid hexadecimal number.")
    return _ok(str(n), f"✅ {cleaned} (hex) = {n} (decimal)")


def _h_octal_to_decimal(_files, payload, _job=None):
    s = _get_text(payload, "value", "octal", "input", "text")
    if not s:
        return _err("Please enter an octal number.")
    cleaned = _strip_prefix(s, ("0o", "0"))
    if not cleaned:
        cleaned = "0"
    try:
        n = int(cleaned, 8)
    except ValueError:
        return _err(f"'{s}' is not a valid octal number (digits 0-7 only).")
    return _ok(str(n), f"✅ {cleaned} (octal) = {n} (decimal)")


def _h_binary_to_hex(_files, payload, _job=None):
    s = _get_text(payload, "value", "binary", "input", "text")
    if not s:
        return _err("Please enter a binary number.")
    cleaned = _strip_prefix(s, ("0b", "b"))
    try:
        n = int(cleaned, 2)
    except ValueError:
        return _err(f"'{s}' is not a valid binary number.")
    out = format(n, "X")
    return _ok(out, f"✅ {cleaned} (binary) = {out} (hex)")


def _h_hex_to_binary(_files, payload, _job=None):
    s = _get_text(payload, "value", "hex", "input", "text")
    if not s:
        return _err("Please enter a hexadecimal number.")
    cleaned = _strip_prefix(s, ("0x", "#"))
    try:
        n = int(cleaned, 16)
    except ValueError:
        return _err(f"'{s}' is not a valid hexadecimal number.")
    out = bin(n)[2:]
    return _ok(out, f"✅ {cleaned} (hex) = {out} (binary)")


def _h_binary_to_octal(_files, payload, _job=None):
    s = _get_text(payload, "value", "binary", "input", "text")
    if not s:
        return _err("Please enter a binary number.")
    cleaned = _strip_prefix(s, ("0b", "b"))
    try:
        n = int(cleaned, 2)
    except ValueError:
        return _err(f"'{s}' is not a valid binary number.")
    out = oct(n)[2:]
    return _ok(out, f"✅ {cleaned} (binary) = {out} (octal)")


def _h_octal_to_binary(_files, payload, _job=None):
    s = _get_text(payload, "value", "octal", "input", "text")
    if not s:
        return _err("Please enter an octal number.")
    cleaned = _strip_prefix(s, ("0o",))
    try:
        n = int(cleaned, 8)
    except ValueError:
        return _err(f"'{s}' is not a valid octal number.")
    out = bin(n)[2:]
    return _ok(out, f"✅ {cleaned} (octal) = {out} (binary)")


def _h_hex_to_octal(_files, payload, _job=None):
    s = _get_text(payload, "value", "hex", "input", "text")
    if not s:
        return _err("Please enter a hexadecimal number.")
    cleaned = _strip_prefix(s, ("0x", "#"))
    try:
        n = int(cleaned, 16)
    except ValueError:
        return _err(f"'{s}' is not a valid hexadecimal number.")
    out = oct(n)[2:]
    return _ok(out, f"✅ {cleaned} (hex) = {out} (octal)")


def _h_octal_to_hex(_files, payload, _job=None):
    s = _get_text(payload, "value", "octal", "input", "text")
    if not s:
        return _err("Please enter an octal number.")
    cleaned = _strip_prefix(s, ("0o",))
    try:
        n = int(cleaned, 8)
    except ValueError:
        return _err(f"'{s}' is not a valid octal number.")
    out = format(n, "X")
    return _ok(out, f"✅ {cleaned} (octal) = {out} (hex)")


# ─── Text ↔ binary / hex / octal / ASCII ─────────────────────────────────
def _h_text_to_binary(_files, payload, _job=None):
    s = _get_text(payload, "text", "input", "value")
    if not s:
        return _err("Please enter some text to convert.")
    out = " ".join(format(b, "08b") for b in s.encode("utf-8"))
    return _ok(out, f"✅ Converted text → binary ({len(s)} chars)")


def _h_text_to_hex(_files, payload, _job=None):
    s = _get_text(payload, "text", "input", "value")
    if not s:
        return _err("Please enter some text to convert.")
    out = s.encode("utf-8").hex().upper()
    return _ok(out, f"✅ Converted text → hex ({len(s)} chars)")


def _h_text_to_octal(_files, payload, _job=None):
    s = _get_text(payload, "text", "input", "value")
    if not s:
        return _err("Please enter some text to convert.")
    out = " ".join(format(b, "03o") for b in s.encode("utf-8"))
    return _ok(out, f"✅ Converted text → octal ({len(s)} chars)")


def _h_text_to_ascii(_files, payload, _job=None):
    s = _get_text(payload, "text", "input", "value")
    if not s:
        return _err("Please enter some text to convert.")
    out = " ".join(str(ord(c)) for c in s)
    return _ok(out, f"✅ Converted text → ASCII codes ({len(s)} chars)")


def _h_ascii_to_text(_files, payload, _job=None):
    s = _get_text(payload, "text", "input", "value")
    if not s:
        return _err("Please enter ASCII codes (space- or comma-separated).")
    parts = [p for p in s.replace(",", " ").split() if p]
    try:
        chars = [chr(int(p)) for p in parts]
    except ValueError:
        return _err("Invalid ASCII code list. Use space- or comma-separated integers (e.g. 72 105).")
    out = "".join(chars)
    return _ok(out, f"✅ Converted {len(parts)} ASCII codes → text")


def _h_ascii_to_binary(_files, payload, _job=None):
    return _h_text_to_binary(_files, payload, _job)


def _h_ascii_to_hex(_files, payload, _job=None):
    return _h_text_to_hex(_files, payload, _job)


# ─── Public handler dict ──────────────────────────────────────────────────
NUMBER_BASE_HANDLERS: Dict[str, Callable] = {
    "decimal-to-binary":  _h_decimal_to_binary,
    "decimal-to-hex":     _h_decimal_to_hex,
    "decimal-to-hexadecimal": _h_decimal_to_hex,
    "decimal-to-octal":   _h_decimal_to_octal,
    "binary-to-decimal":  _h_binary_to_decimal,
    "hex-to-decimal":     _h_hex_to_decimal,
    "hexadecimal-to-decimal": _h_hex_to_decimal,
    "octal-to-decimal":   _h_octal_to_decimal,
    "binary-to-hex":      _h_binary_to_hex,
    "binary-to-hexadecimal": _h_binary_to_hex,
    "hex-to-binary":      _h_hex_to_binary,
    "hexadecimal-to-binary": _h_hex_to_binary,
    "binary-to-octal":    _h_binary_to_octal,
    "octal-to-binary":    _h_octal_to_binary,
    "hex-to-octal":       _h_hex_to_octal,
    "octal-to-hex":       _h_octal_to_hex,
    "text-to-binary":     _h_text_to_binary,
    "string-to-binary":   _h_text_to_binary,
    "text-to-hex":        _h_text_to_hex,
    "string-to-hex":      _h_text_to_hex,
    "text-to-octal":      _h_text_to_octal,
    "text-to-ascii":      _h_text_to_ascii,
    "string-to-ascii":    _h_text_to_ascii,
    "ascii-to-text":      _h_ascii_to_text,
    "ascii-to-string":    _h_ascii_to_text,
    "ascii-to-binary":    _h_ascii_to_binary,
    "ascii-to-hex":       _h_ascii_to_hex,
}
