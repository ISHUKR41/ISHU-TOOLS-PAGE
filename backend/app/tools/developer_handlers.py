"""
Developer, Color, Unit, Hash/Crypto, SEO, and Code tool handlers.
All pure-Python implementations – no external APIs needed.
"""
from __future__ import annotations

import base64
import hashlib
import html as html_mod
import json
import math
import re
import secrets
import string
import uuid
import xml.dom.minidom
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import quote, unquote

from .handlers import ExecutionResult

# ============================================================================
# Helpers
# ============================================================================

def _text_result(data: dict[str, Any], message: str = "Done") -> ExecutionResult:
    return ExecutionResult(kind="json", message=message, data=data)


def _get_text(payload: dict[str, Any]) -> str:
    return str(payload.get("text", "") or payload.get("input", "")).strip()


# ============================================================================
# DEVELOPER TOOLS
# ============================================================================

def handle_json_formatter(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No JSON input provided"}, "Error")
    try:
        obj = json.loads(text)
        formatted = json.dumps(obj, indent=2, ensure_ascii=False)
        return _text_result({"result": formatted, "valid": True, "keys": len(obj) if isinstance(obj, dict) else len(obj) if isinstance(obj, list) else 1}, "JSON formatted successfully")
    except json.JSONDecodeError as e:
        return _text_result({"result": str(e), "valid": False}, "Invalid JSON")


def handle_xml_formatter(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No XML input provided"}, "Error")
    try:
        dom = xml.dom.minidom.parseString(text)
        formatted = dom.toprettyxml(indent="  ")
        # Remove extra XML declaration if present
        lines = formatted.split('\n')
        if lines[0].startswith('<?xml'):
            formatted = '\n'.join(lines[1:])
        return _text_result({"result": formatted.strip()}, "XML formatted")
    except Exception as e:
        return _text_result({"error": str(e)}, "Invalid XML")


def handle_base64_encode(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    encoded = base64.b64encode(text.encode("utf-8")).decode("ascii")
    return _text_result({"result": encoded, "original_length": len(text), "encoded_length": len(encoded)}, "Base64 encoded")


def handle_base64_decode(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No Base64 input provided"}, "Error")
    try:
        decoded = base64.b64decode(text).decode("utf-8")
        return _text_result({"result": decoded}, "Base64 decoded")
    except Exception as e:
        return _text_result({"error": f"Invalid Base64: {e}"}, "Decode failed")


def handle_url_encode(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    encoded = quote(text, safe="")
    return _text_result({"result": encoded}, "URL encoded")


def handle_url_decode(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No URL-encoded text provided"}, "Error")
    decoded = unquote(text)
    return _text_result({"result": decoded}, "URL decoded")


def handle_html_encode(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    encoded = html_mod.escape(text)
    return _text_result({"result": encoded}, "HTML encoded")


def handle_html_decode(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No HTML-encoded text provided"}, "Error")
    decoded = html_mod.unescape(text)
    return _text_result({"result": decoded}, "HTML decoded")


def handle_jwt_decode(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No JWT token provided"}, "Error")
    parts = text.split(".")
    if len(parts) < 2:
        return _text_result({"error": "Invalid JWT format – expected header.payload.signature"}, "Invalid JWT")
    try:
        def _decode_part(part: str) -> dict:
            padding = 4 - len(part) % 4
            part += "=" * padding
            decoded_bytes = base64.urlsafe_b64decode(part)
            return json.loads(decoded_bytes)

        header = _decode_part(parts[0])
        payload_data = _decode_part(parts[1])
        return _text_result({"header": header, "payload": payload_data, "result": json.dumps(payload_data, indent=2)}, "JWT decoded")
    except Exception as e:
        return _text_result({"error": f"JWT decode failed: {e}"}, "Decode failed")


def handle_regex_tester(files, payload, output_dir) -> ExecutionResult:
    pattern = str(payload.get("pattern", "")).strip()
    text = _get_text(payload)
    flags_str = str(payload.get("flags", "")).lower()
    if not pattern:
        return _text_result({"error": "No regex pattern provided"}, "Error")
    if not text:
        return _text_result({"error": "No text to test against"}, "Error")
    try:
        flags = 0
        if "i" in flags_str:
            flags |= re.IGNORECASE
        if "m" in flags_str:
            flags |= re.MULTILINE
        if "s" in flags_str:
            flags |= re.DOTALL
        matches = [{"match": m.group(), "start": m.start(), "end": m.end(), "groups": list(m.groups())} for m in re.finditer(pattern, text, flags)]
        return _text_result({"matches": matches, "count": len(matches), "result": f"{len(matches)} match(es) found"}, f"Regex test: {len(matches)} match(es)")
    except re.error as e:
        return _text_result({"error": f"Invalid regex: {e}"}, "Invalid regex")


def handle_unix_timestamp(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        now = datetime.now(timezone.utc)
        return _text_result({"timestamp": int(now.timestamp()), "iso": now.isoformat(), "result": f"Current: {int(now.timestamp())}"}, "Current timestamp")
    try:
        ts = int(float(text))
        dt = datetime.fromtimestamp(ts, tz=timezone.utc)
        return _text_result({"timestamp": ts, "iso": dt.isoformat(), "readable": dt.strftime("%Y-%m-%d %H:%M:%S UTC"), "result": dt.strftime("%Y-%m-%d %H:%M:%S UTC")}, "Timestamp converted")
    except Exception:
        try:
            dt = datetime.fromisoformat(text.replace("Z", "+00:00"))
            return _text_result({"timestamp": int(dt.timestamp()), "iso": dt.isoformat(), "result": str(int(dt.timestamp()))}, "Date converted to timestamp")
        except Exception as e:
            return _text_result({"error": f"Cannot parse: {e}"}, "Parse failed")


def handle_json_to_yaml(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No JSON provided"}, "Error")
    try:
        obj = json.loads(text)
        # Simple YAML serializer (avoid dependency)
        def _to_yaml(data, indent=0):
            prefix = "  " * indent
            if isinstance(data, dict):
                if not data:
                    return "{}"
                lines = []
                for k, v in data.items():
                    if isinstance(v, (dict, list)):
                        lines.append(f"{prefix}{k}:")
                        lines.append(_to_yaml(v, indent + 1))
                    else:
                        lines.append(f"{prefix}{k}: {json.dumps(v)}")
                return "\n".join(lines)
            elif isinstance(data, list):
                if not data:
                    return "[]"
                lines = []
                for item in data:
                    if isinstance(item, (dict, list)):
                        lines.append(f"{prefix}-")
                        lines.append(_to_yaml(item, indent + 1))
                    else:
                        lines.append(f"{prefix}- {json.dumps(item)}")
                return "\n".join(lines)
            else:
                return f"{prefix}{json.dumps(data)}"
        yaml_str = _to_yaml(obj)
        return _text_result({"result": yaml_str}, "JSON converted to YAML")
    except json.JSONDecodeError as e:
        return _text_result({"error": f"Invalid JSON: {e}"}, "Invalid JSON")


def handle_yaml_to_json(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No YAML provided"}, "Error")
    try:
        import yaml
        obj = yaml.safe_load(text)
        result = json.dumps(obj, indent=2, ensure_ascii=False)
        return _text_result({"result": result}, "YAML converted to JSON")
    except ImportError:
        return _text_result({"error": "PyYAML not installed"}, "Dependency missing")
    except Exception as e:
        return _text_result({"error": f"Invalid YAML: {e}"}, "Parse failed")


# ============================================================================
# COLOR TOOLS
# ============================================================================

def handle_hex_to_rgb(files, payload, output_dir) -> ExecutionResult:
    hex_color = str(payload.get("text", "") or payload.get("color", "")).strip().lstrip("#")
    if not hex_color or len(hex_color) not in (3, 6):
        return _text_result({"error": "Provide a valid HEX color (e.g. #ff5733)"}, "Error")
    if len(hex_color) == 3:
        hex_color = "".join(c * 2 for c in hex_color)
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    return _text_result({"r": r, "g": g, "b": b, "result": f"rgb({r}, {g}, {b})", "hex": f"#{hex_color}"}, "HEX → RGB")


def handle_rgb_to_hex(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    try:
        nums = [int(x) for x in re.findall(r'\d+', text)][:3]
        if len(nums) < 3:
            return _text_result({"error": "Provide R, G, B values"}, "Error")
        r, g, b = [max(0, min(255, n)) for n in nums]
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        return _text_result({"hex": hex_color, "r": r, "g": g, "b": b, "result": hex_color}, "RGB → HEX")
    except Exception as e:
        return _text_result({"error": str(e)}, "Parse failed")


def handle_rgb_to_hsl(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    try:
        nums = [int(x) for x in re.findall(r'\d+', text)][:3]
        if len(nums) < 3:
            return _text_result({"error": "Provide R, G, B values"}, "Error")
        r, g, b = [n / 255.0 for n in nums[:3]]
        mx, mn = max(r, g, b), min(r, g, b)
        l = (mx + mn) / 2
        if mx == mn:
            h = s = 0.0
        else:
            d = mx - mn
            s = d / (2.0 - mx - mn) if l > 0.5 else d / (mx + mn)
            if mx == r:
                h = (g - b) / d + (6 if g < b else 0)
            elif mx == g:
                h = (b - r) / d + 2
            else:
                h = (r - g) / d + 4
            h /= 6
        h_deg, s_pct, l_pct = round(h * 360), round(s * 100), round(l * 100)
        return _text_result({"h": h_deg, "s": s_pct, "l": l_pct, "result": f"hsl({h_deg}, {s_pct}%, {l_pct}%)"}, "RGB → HSL")
    except Exception as e:
        return _text_result({"error": str(e)}, "Parse failed")


def handle_color_palette_generator(files, payload, output_dir) -> ExecutionResult:
    hex_color = str(payload.get("text", "") or payload.get("color", "#3b82f6")).strip().lstrip("#")
    if len(hex_color) == 3:
        hex_color = "".join(c * 2 for c in hex_color)
    if len(hex_color) != 6:
        hex_color = "3b82f6"
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)

    def _shift(r, g, b, amount):
        return (max(0, min(255, r + amount)), max(0, min(255, g + amount)), max(0, min(255, b + amount)))

    palette = []
    for shift in [-80, -40, 0, 40, 80]:
        sr, sg, sb = _shift(r, g, b, shift)
        palette.append({"hex": f"#{sr:02x}{sg:02x}{sb:02x}", "rgb": f"rgb({sr}, {sg}, {sb})"})

    # Complementary
    comp = (255 - r, 255 - g, 255 - b)
    palette.append({"hex": f"#{comp[0]:02x}{comp[1]:02x}{comp[2]:02x}", "rgb": f"rgb({comp[0]}, {comp[1]}, {comp[2]})", "type": "complementary"})

    return _text_result({"palette": palette, "base": f"#{hex_color}", "result": ", ".join(p["hex"] for p in palette)}, "Palette generated")


def handle_gradient_generator(files, payload, output_dir) -> ExecutionResult:
    color1 = str(payload.get("color1", "#3b82f6")).strip()
    color2 = str(payload.get("color2", "#8b5cf6")).strip()
    angle = int(payload.get("angle", 135))
    css = f"background: linear-gradient({angle}deg, {color1}, {color2});"
    return _text_result({"css": css, "color1": color1, "color2": color2, "angle": angle, "result": css}, "Gradient generated")


def handle_color_contrast_checker(files, payload, output_dir) -> ExecutionResult:
    def _hex_to_rgb(hex_str):
        h = hex_str.strip().lstrip("#")
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))

    def _relative_luminance(r, g, b):
        def _c(v):
            v = v / 255.0
            return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
        return 0.2126 * _c(r) + 0.7152 * _c(g) + 0.0722 * _c(b)

    fg = str(payload.get("foreground", payload.get("text", "#000000"))).strip()
    bg = str(payload.get("background", "#ffffff")).strip()
    try:
        r1, g1, b1 = _hex_to_rgb(fg)
        r2, g2, b2 = _hex_to_rgb(bg)
        l1, l2 = _relative_luminance(r1, g1, b1), _relative_luminance(r2, g2, b2)
        ratio = (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)
        aa_normal = ratio >= 4.5
        aa_large = ratio >= 3.0
        aaa_normal = ratio >= 7.0
        return _text_result({
            "ratio": round(ratio, 2),
            "aa_normal": aa_normal,
            "aa_large": aa_large,
            "aaa_normal": aaa_normal,
            "result": f"Contrast ratio: {ratio:.2f}:1 — {'PASS' if aa_normal else 'FAIL'} (AA)",
        }, "Contrast checked")
    except Exception as e:
        return _text_result({"error": str(e)}, "Error")


# ============================================================================
# UNIT CONVERTERS
# ============================================================================

def _convert_unit(value, from_unit, to_unit, factors):
    """Generic unit converter: factors maps unit -> base-unit multiplier."""
    if from_unit not in factors or to_unit not in factors:
        return None
    base = value * factors[from_unit]
    return base / factors[to_unit]


def handle_length_converter(files, payload, output_dir) -> ExecutionResult:
    value = float(payload.get("value", payload.get("text", 1)))
    from_u = str(payload.get("from_unit", "m")).lower()
    to_u = str(payload.get("to_unit", "ft")).lower()
    factors = {"m": 1, "km": 1000, "cm": 0.01, "mm": 0.001, "in": 0.0254, "ft": 0.3048, "yd": 0.9144, "mi": 1609.344}
    result = _convert_unit(value, from_u, to_u, factors)
    if result is None:
        return _text_result({"error": f"Unknown units: {from_u} or {to_u}. Supported: {', '.join(factors.keys())}"}, "Error")
    return _text_result({"result": f"{value} {from_u} = {result:.6g} {to_u}", "value": result}, "Converted")


def handle_weight_converter(files, payload, output_dir) -> ExecutionResult:
    value = float(payload.get("value", payload.get("text", 1)))
    from_u = str(payload.get("from_unit", "kg")).lower()
    to_u = str(payload.get("to_unit", "lb")).lower()
    factors = {"g": 1, "kg": 1000, "mg": 0.001, "lb": 453.592, "oz": 28.3495, "t": 1e6, "st": 6350.29}
    result = _convert_unit(value, from_u, to_u, factors)
    if result is None:
        return _text_result({"error": f"Unknown units. Supported: {', '.join(factors.keys())}"}, "Error")
    return _text_result({"result": f"{value} {from_u} = {result:.6g} {to_u}", "value": result}, "Converted")


def handle_temperature_converter(files, payload, output_dir) -> ExecutionResult:
    value = float(payload.get("value", payload.get("text", 0)))
    from_u = str(payload.get("from_unit", "c")).lower()[0]
    to_u = str(payload.get("to_unit", "f")).lower()[0]

    # Convert to Celsius first
    if from_u == "f":
        celsius = (value - 32) * 5 / 9
    elif from_u == "k":
        celsius = value - 273.15
    else:
        celsius = value

    # Convert from Celsius to target
    if to_u == "f":
        result = celsius * 9 / 5 + 32
    elif to_u == "k":
        result = celsius + 273.15
    else:
        result = celsius

    labels = {"c": "°C", "f": "°F", "k": "K"}
    return _text_result({"result": f"{value}{labels.get(from_u, '')} = {result:.2f}{labels.get(to_u, '')}", "value": result}, "Converted")


def handle_data_size_converter(files, payload, output_dir) -> ExecutionResult:
    value = float(payload.get("value", payload.get("text", 1)))
    from_u = str(payload.get("from_unit", "mb")).lower()
    to_u = str(payload.get("to_unit", "gb")).lower()
    factors = {"b": 1, "kb": 1024, "mb": 1024**2, "gb": 1024**3, "tb": 1024**4, "pb": 1024**5}
    result = _convert_unit(value, from_u, to_u, factors)
    if result is None:
        return _text_result({"error": f"Unknown units. Supported: {', '.join(factors.keys())}"}, "Error")
    return _text_result({"result": f"{value} {from_u.upper()} = {result:.6g} {to_u.upper()}", "value": result}, "Converted")


def handle_speed_converter(files, payload, output_dir) -> ExecutionResult:
    value = float(payload.get("value", payload.get("text", 1)))
    from_u = str(payload.get("from_unit", "kmh")).lower()
    to_u = str(payload.get("to_unit", "mph")).lower()
    factors = {"ms": 1, "kmh": 1/3.6, "mph": 0.44704, "kn": 0.514444, "fts": 0.3048}
    result = _convert_unit(value, from_u, to_u, factors)
    if result is None:
        return _text_result({"error": f"Unknown units. Supported: {', '.join(factors.keys())}"}, "Error")
    return _text_result({"result": f"{value} {from_u} = {result:.4g} {to_u}", "value": result}, "Converted")


def handle_area_converter(files, payload, output_dir) -> ExecutionResult:
    value = float(payload.get("value", payload.get("text", 1)))
    from_u = str(payload.get("from_unit", "sqm")).lower()
    to_u = str(payload.get("to_unit", "sqft")).lower()
    factors = {"sqm": 1, "sqkm": 1e6, "sqft": 0.092903, "sqyd": 0.836127, "sqmi": 2.59e6, "acre": 4046.86, "ha": 10000}
    result = _convert_unit(value, from_u, to_u, factors)
    if result is None:
        return _text_result({"error": f"Unknown units. Supported: {', '.join(factors.keys())}"}, "Error")
    return _text_result({"result": f"{value} {from_u} = {result:.6g} {to_u}", "value": result}, "Converted")


# ============================================================================
# HASH & CRYPTO
# ============================================================================

def handle_md5_hash(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    h = hashlib.md5(text.encode("utf-8")).hexdigest()
    return _text_result({"result": h, "algorithm": "MD5"}, "MD5 hash generated")


def handle_sha256_hash(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    h = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return _text_result({"result": h, "algorithm": "SHA-256"}, "SHA-256 hash generated")


def handle_sha512_hash(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    h = hashlib.sha512(text.encode("utf-8")).hexdigest()
    return _text_result({"result": h, "algorithm": "SHA-512"}, "SHA-512 hash generated")


def handle_uuid_generator(files, payload, output_dir) -> ExecutionResult:
    count = min(int(payload.get("count", 1)), 50)
    uuids = [str(uuid.uuid4()) for _ in range(max(1, count))]
    return _text_result({"result": "\n".join(uuids), "count": len(uuids), "uuids": uuids}, f"{len(uuids)} UUID(s) generated")


def handle_password_generator(files, payload, output_dir) -> ExecutionResult:
    length = max(4, min(128, int(payload.get("length", 16))))
    count = max(1, min(20, int(payload.get("count", 5))))
    include_upper = str(payload.get("uppercase", "true")).lower() != "false"
    include_lower = str(payload.get("lowercase", "true")).lower() != "false"
    include_digits = str(payload.get("digits", "true")).lower() != "false"
    include_symbols = str(payload.get("symbols", "true")).lower() != "false"

    chars = ""
    if include_upper:
        chars += string.ascii_uppercase
    if include_lower:
        chars += string.ascii_lowercase
    if include_digits:
        chars += string.digits
    if include_symbols:
        chars += "!@#$%^&*()-_=+[]{}|;:,.<>?"
    if not chars:
        chars = string.ascii_letters + string.digits

    passwords = ["".join(secrets.choice(chars) for _ in range(length)) for _ in range(count)]
    return _text_result({"result": "\n".join(passwords), "passwords": passwords, "length": length}, f"{count} password(s) generated")


def handle_lorem_ipsum_generator(files, payload, output_dir) -> ExecutionResult:
    paragraphs = max(1, min(20, int(payload.get("paragraphs", 3))))
    LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    EXTRAS = [
        "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
        "Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor ultrices risus.",
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.",
        "Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.",
        "Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui.",
    ]
    result = []
    for i in range(paragraphs):
        if i == 0:
            result.append(LOREM)
        else:
            result.append(EXTRAS[(i - 1) % len(EXTRAS)])
    text = "\n\n".join(result)
    return _text_result({"result": text, "paragraphs": paragraphs}, "Lorem ipsum generated")


def handle_bcrypt_hash(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    try:
        import bcrypt
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(text.encode("utf-8"), salt).decode("utf-8")
        return _text_result({"result": hashed, "algorithm": "bcrypt"}, "Bcrypt hash generated")
    except ImportError:
        # Fallback: use SHA-256 with salt
        salt = secrets.token_hex(16)
        h = hashlib.sha256(f"{salt}:{text}".encode("utf-8")).hexdigest()
        return _text_result({"result": f"$sha256${salt}${h}", "algorithm": "sha256-salted (bcrypt unavailable)"}, "Hash generated (bcrypt unavailable)")


# ============================================================================
# SEO TOOLS
# ============================================================================

def handle_meta_tag_generator(files, payload, output_dir) -> ExecutionResult:
    title = str(payload.get("title", payload.get("text", "My Website"))).strip()
    description = str(payload.get("description", "A great website")).strip()
    keywords = str(payload.get("keywords", "")).strip()
    author = str(payload.get("author", "")).strip()

    tags = [
        f'<meta charset="UTF-8">',
        f'<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        f'<title>{title}</title>',
        f'<meta name="description" content="{description}">',
    ]
    if keywords:
        tags.append(f'<meta name="keywords" content="{keywords}">')
    if author:
        tags.append(f'<meta name="author" content="{author}">')
    tags.append(f'<meta name="robots" content="index, follow">')

    result = "\n".join(tags)
    return _text_result({"result": result, "tag_count": len(tags)}, "Meta tags generated")


def handle_keyword_density(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")
    words = re.findall(r'\b\w+\b', text.lower())
    total = len(words)
    if total == 0:
        return _text_result({"error": "No words found"}, "Error")

    from collections import Counter
    word_freq = Counter(words)
    # Filter common stop words
    stop_words = {"the", "a", "an", "is", "it", "in", "to", "and", "of", "for", "on", "with", "at", "by", "from", "or", "as", "be", "was", "are", "were", "been", "has", "have", "had", "do", "does", "did", "but", "not", "this", "that", "these", "those", "i", "you", "he", "she", "we", "they"}
    keywords = [(word, count, round(count / total * 100, 2)) for word, count in word_freq.most_common(30) if word not in stop_words][:20]

    return _text_result({
        "keywords": [{"word": w, "count": c, "density": d} for w, c, d in keywords],
        "total_words": total,
        "result": "\n".join(f"{w}: {c} ({d}%)" for w, c, d in keywords[:10]),
    }, "Keyword density analyzed")


def handle_readability_score(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")

    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    words = re.findall(r'\b\w+\b', text)
    syllables = sum(_count_syllables(w) for w in words)
    
    num_sentences = max(1, len(sentences))
    num_words = max(1, len(words))

    # Flesch Reading Ease
    fre = 206.835 - 1.015 * (num_words / num_sentences) - 84.6 * (syllables / num_words)
    fre = max(0, min(100, round(fre, 1)))

    # Flesch-Kincaid Grade Level
    fkgl = 0.39 * (num_words / num_sentences) + 11.8 * (syllables / num_words) - 15.59
    fkgl = max(0, round(fkgl, 1))

    level = "Very Easy" if fre >= 90 else "Easy" if fre >= 70 else "Standard" if fre >= 50 else "Difficult" if fre >= 30 else "Very Difficult"

    return _text_result({
        "flesch_reading_ease": fre,
        "flesch_kincaid_grade": fkgl,
        "level": level,
        "sentences": num_sentences,
        "words": num_words,
        "syllables": syllables,
        "result": f"Readability: {fre}/100 ({level}) — Grade Level: {fkgl}",
    }, "Readability analyzed")


def _count_syllables(word: str) -> int:
    word = word.lower()
    if len(word) <= 3:
        return 1
    vowels = "aeiouy"
    count = 0
    prev_vowel = False
    for char in word:
        is_vowel = char in vowels
        if is_vowel and not prev_vowel:
            count += 1
        prev_vowel = is_vowel
    if word.endswith("e"):
        count -= 1
    return max(1, count)


def handle_character_counter(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No text provided"}, "Error")

    words = re.findall(r'\b\w+\b', text)
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    return _text_result({
        "characters": len(text),
        "characters_no_spaces": len(text.replace(" ", "").replace("\n", "").replace("\t", "")),
        "words": len(words),
        "sentences": len(sentences),
        "paragraphs": len(paragraphs),
        "lines": text.count("\n") + 1,
        "result": f"Characters: {len(text)} | Words: {len(words)} | Sentences: {len(sentences)}",
    }, "Character count complete")


def handle_open_graph_generator(files, payload, output_dir) -> ExecutionResult:
    title = str(payload.get("title", payload.get("text", "My Page"))).strip()
    description = str(payload.get("description", "")).strip()
    url = str(payload.get("url", "")).strip()
    image = str(payload.get("image", "")).strip()
    site_type = str(payload.get("type", "website")).strip()

    tags = [
        f'<meta property="og:title" content="{title}">',
        f'<meta property="og:type" content="{site_type}">',
    ]
    if description:
        tags.append(f'<meta property="og:description" content="{description}">')
    if url:
        tags.append(f'<meta property="og:url" content="{url}">')
    if image:
        tags.append(f'<meta property="og:image" content="{image}">')

    # Twitter card
    tags.append(f'<meta name="twitter:card" content="summary_large_image">')
    tags.append(f'<meta name="twitter:title" content="{title}">')
    if description:
        tags.append(f'<meta name="twitter:description" content="{description}">')

    result = "\n".join(tags)
    return _text_result({"result": result, "tag_count": len(tags)}, "Open Graph tags generated")


# ============================================================================
# CODE TOOLS
# ============================================================================

def handle_minify_css(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No CSS provided"}, "Error")
    # Remove comments
    minified = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
    # Remove whitespace
    minified = re.sub(r'\s+', ' ', minified)
    minified = re.sub(r'\s*([{}:;,>~+])\s*', r'\1', minified)
    minified = minified.strip()
    saved = len(text) - len(minified)
    return _text_result({"result": minified, "original_size": len(text), "minified_size": len(minified), "saved": saved}, f"CSS minified — saved {saved} chars")


def handle_minify_js(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No JavaScript provided"}, "Error")
    # Remove single-line comments (careful with URLs)
    minified = re.sub(r'(?<!:)//.*?$', '', text, flags=re.MULTILINE)
    # Remove multi-line comments
    minified = re.sub(r'/\*.*?\*/', '', minified, flags=re.DOTALL)
    # Collapse whitespace
    minified = re.sub(r'\s+', ' ', minified)
    minified = re.sub(r'\s*([{}();,=+\-*/<>!&|?:])\s*', r'\1', minified)
    minified = minified.strip()
    saved = len(text) - len(minified)
    return _text_result({"result": minified, "original_size": len(text), "minified_size": len(minified), "saved": saved}, f"JS minified — saved {saved} chars")


def handle_minify_html(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No HTML provided"}, "Error")
    # Remove HTML comments
    minified = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
    # Collapse whitespace between tags
    minified = re.sub(r'>\s+<', '><', minified)
    # Collapse internal whitespace
    minified = re.sub(r'\s+', ' ', minified)
    minified = minified.strip()
    saved = len(text) - len(minified)
    return _text_result({"result": minified, "original_size": len(text), "minified_size": len(minified), "saved": saved}, f"HTML minified — saved {saved} chars")


def handle_prettify_css(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No CSS provided"}, "Error")
    # Simple CSS prettifier
    result = text.replace("{", " {\n  ").replace("}", "\n}\n").replace(";", ";\n  ")
    # Clean up
    result = re.sub(r'\n\s*\n', '\n', result)
    result = re.sub(r'  \n}', '\n}', result)
    return _text_result({"result": result.strip()}, "CSS prettified")


def handle_sql_formatter(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No SQL provided"}, "Error")
    keywords = ["SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "ON", "ORDER BY", "GROUP BY", "HAVING", "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "UNION", "DISTINCT"]
    result = text
    for kw in sorted(keywords, key=len, reverse=True):
        result = re.sub(rf'(?i)\b{re.escape(kw)}\b', f'\n{kw}', result)
    result = result.strip()
    return _text_result({"result": result}, "SQL formatted")


def handle_markdown_to_html(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No Markdown provided"}, "Error")
    try:
        import markdown
        html = markdown.markdown(text, extensions=["tables", "fenced_code"])
        return _text_result({"result": html}, "Markdown → HTML")
    except ImportError:
        # Simple fallback
        html = text
        html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
        html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
        html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
        html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
        html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
        html = re.sub(r'`(.+?)`', r'<code>\1</code>', html)
        paragraphs = html.split('\n\n')
        html = '\n'.join(f'<p>{p.strip()}</p>' if not p.strip().startswith('<h') else p.strip() for p in paragraphs if p.strip())
        return _text_result({"result": html}, "Markdown → HTML (basic)")


def handle_html_to_markdown(files, payload, output_dir) -> ExecutionResult:
    text = _get_text(payload)
    if not text:
        return _text_result({"error": "No HTML provided"}, "Error")
    md = text
    md = re.sub(r'<h1[^>]*>(.*?)</h1>', r'# \1', md, flags=re.DOTALL)
    md = re.sub(r'<h2[^>]*>(.*?)</h2>', r'## \1', md, flags=re.DOTALL)
    md = re.sub(r'<h3[^>]*>(.*?)</h3>', r'### \1', md, flags=re.DOTALL)
    md = re.sub(r'<strong>(.*?)</strong>', r'**\1**', md, flags=re.DOTALL)
    md = re.sub(r'<b>(.*?)</b>', r'**\1**', md, flags=re.DOTALL)
    md = re.sub(r'<em>(.*?)</em>', r'*\1*', md, flags=re.DOTALL)
    md = re.sub(r'<i>(.*?)</i>', r'*\1*', md, flags=re.DOTALL)
    md = re.sub(r'<code>(.*?)</code>', r'`\1`', md, flags=re.DOTALL)
    md = re.sub(r'<a[^>]+href="([^"]*)"[^>]*>(.*?)</a>', r'[\2](\1)', md, flags=re.DOTALL)
    md = re.sub(r'<br\s*/?>', '\n', md)
    md = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n\n', md, flags=re.DOTALL)
    md = re.sub(r'<li[^>]*>(.*?)</li>', r'- \1', md, flags=re.DOTALL)
    md = re.sub(r'<[^>]+>', '', md)  # Remove remaining tags
    md = html_mod.unescape(md)
    return _text_result({"result": md.strip()}, "HTML → Markdown")


def handle_diff_checker(files, payload, output_dir) -> ExecutionResult:
    text1 = str(payload.get("text", "")).strip()
    text2 = str(payload.get("text2", "")).strip()
    if not text1 or not text2:
        return _text_result({"error": "Provide both text1 and text2 to compare"}, "Error")

    import difflib
    lines1 = text1.splitlines(keepends=True)
    lines2 = text2.splitlines(keepends=True)
    diff = list(difflib.unified_diff(lines1, lines2, fromfile="Text 1", tofile="Text 2", lineterm=""))
    
    additions = sum(1 for l in diff if l.startswith("+") and not l.startswith("+++"))
    deletions = sum(1 for l in diff if l.startswith("-") and not l.startswith("---"))
    
    return _text_result({
        "result": "\n".join(diff) if diff else "No differences found",
        "additions": additions,
        "deletions": deletions,
        "identical": len(diff) == 0,
    }, f"Diff: +{additions} / -{deletions} lines")


# ============================================================================
# HANDLER REGISTRY
# ============================================================================

DEVELOPER_HANDLERS = {
    # Developer Tools
    "json-formatter": handle_json_formatter,
    "xml-formatter": handle_xml_formatter,
    "base64-encode": handle_base64_encode,
    "base64-decode": handle_base64_decode,
    "url-encode": handle_url_encode,
    "url-decode": handle_url_decode,
    "html-encode": handle_html_encode,
    "html-decode": handle_html_decode,
    "jwt-decode": handle_jwt_decode,
    "regex-tester": handle_regex_tester,
    "unix-timestamp": handle_unix_timestamp,
    "json-to-yaml": handle_json_to_yaml,
    "yaml-to-json": handle_yaml_to_json,

    # Color Tools
    "hex-to-rgb": handle_hex_to_rgb,
    "rgb-to-hex": handle_rgb_to_hex,
    "rgb-to-hsl": handle_rgb_to_hsl,
    "color-palette-generator": handle_color_palette_generator,
    "gradient-generator": handle_gradient_generator,
    "color-contrast-checker": handle_color_contrast_checker,

    # Unit Converters
    "length-converter": handle_length_converter,
    "weight-converter": handle_weight_converter,
    "temperature-converter": handle_temperature_converter,
    "data-size-converter": handle_data_size_converter,
    "speed-converter": handle_speed_converter,
    "area-converter": handle_area_converter,

    # Hash & Crypto
    "md5-hash": handle_md5_hash,
    "sha256-hash": handle_sha256_hash,
    "sha512-hash": handle_sha512_hash,
    "uuid-generator": handle_uuid_generator,
    "password-generator": handle_password_generator,
    "lorem-ipsum-generator": handle_lorem_ipsum_generator,
    "bcrypt-hash": handle_bcrypt_hash,

    # SEO Tools
    "meta-tag-generator": handle_meta_tag_generator,
    "keyword-density": handle_keyword_density,
    "readability-score": handle_readability_score,
    "character-counter": handle_character_counter,
    "open-graph-generator": handle_open_graph_generator,

    # Code Tools
    "minify-css": handle_minify_css,
    "minify-js": handle_minify_js,
    "minify-html": handle_minify_html,
    "prettify-css": handle_prettify_css,
    "sql-formatter": handle_sql_formatter,
    "markdown-to-html": handle_markdown_to_html,
    "html-to-markdown": handle_html_to_markdown,
    "diff-checker": handle_diff_checker,
}
