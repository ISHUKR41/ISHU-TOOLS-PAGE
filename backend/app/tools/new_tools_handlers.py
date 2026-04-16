"""
New tool handlers for developer, color, security, conversion, and social media tools.
All tools are fully functional with real logic — no demos.
"""
from __future__ import annotations

import base64
import csv
import hashlib
import html
import io
import json
import math
import re
import secrets
import string
import textwrap
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

# Import shared utilities from main handlers
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from .handlers import (
        ExecutionResult, ToolHandler, ensure_files,
        create_single_file_result, create_zip_result
    )
except ImportError:
    from handlers import (
        ExecutionResult, ToolHandler, ensure_files,
        create_single_file_result, create_zip_result
    )


# ═══════════════════════════════════════════════════════════
# DEVELOPER TOOLS
# ═══════════════════════════════════════════════════════════

LOREM_WORDS = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem".split()


def handle_lorem_ipsum(files, payload, output_dir):
    count = max(1, min(50, int(payload.get("count", 5))))
    unit = str(payload.get("unit", "paragraphs")).lower()
    
    import random
    random.seed()
    
    if unit == "words":
        words = []
        for i in range(count):
            words.append(random.choice(LOREM_WORDS))
        result = " ".join(words)
    elif unit == "sentences":
        sentences = []
        for _ in range(count):
            length = random.randint(8, 20)
            words = [random.choice(LOREM_WORDS) for _ in range(length)]
            words[0] = words[0].capitalize()
            sentences.append(" ".join(words) + ".")
        result = " ".join(sentences)
    else:  # paragraphs
        paragraphs = []
        for _ in range(count):
            num_sentences = random.randint(4, 8)
            sentences = []
            for _ in range(num_sentences):
                length = random.randint(8, 18)
                words = [random.choice(LOREM_WORDS) for _ in range(length)]
                words[0] = words[0].capitalize()
                sentences.append(" ".join(words) + ".")
            paragraphs.append(" ".join(sentences))
        result = "\n\n".join(paragraphs)
    
    return ExecutionResult(kind="json", message="Lorem Ipsum generated", data={"text": result, "unit": unit, "count": count})


def handle_regex_tester(files, payload, output_dir):
    pattern = str(payload.get("pattern", ""))
    text = str(payload.get("text", ""))
    flags_str = str(payload.get("flags", "")).lower()
    
    if not pattern:
        return ExecutionResult(kind="json", message="Please provide a regex pattern", data={"error": "No pattern provided"})
    
    flags = 0
    if "i" in flags_str: flags |= re.IGNORECASE
    if "m" in flags_str: flags |= re.MULTILINE
    if "s" in flags_str: flags |= re.DOTALL
    
    try:
        compiled = re.compile(pattern, flags)
        matches = []
        for m in compiled.finditer(text):
            matches.append({
                "match": m.group(),
                "start": m.start(),
                "end": m.end(),
                "groups": list(m.groups()) if m.groups() else [],
            })
        
        return ExecutionResult(
            kind="json",
            message=f"Found {len(matches)} match(es)",
            data={
                "matches": matches,
                "match_count": len(matches),
                "pattern": pattern,
                "result": f"Found {len(matches)} match(es) for pattern: {pattern}",
            }
        )
    except re.error as e:
        return ExecutionResult(kind="json", message=f"Invalid regex: {e}", data={"error": str(e)})


def handle_diff_checker(files, payload, output_dir):
    text1 = str(payload.get("text1", ""))
    text2 = str(payload.get("text2", ""))
    
    lines1 = text1.splitlines(keepends=True)
    lines2 = text2.splitlines(keepends=True)
    
    diff = list(difflib.unified_diff(lines1, lines2, fromfile="Text 1", tofile="Text 2", lineterm=""))
    diff_text = "\n".join(diff)
    
    added = sum(1 for line in diff if line.startswith("+") and not line.startswith("+++"))
    removed = sum(1 for line in diff if line.startswith("-") and not line.startswith("---"))
    
    return ExecutionResult(
        kind="json",
        message=f"Diff complete: {added} additions, {removed} deletions",
        data={"text": diff_text, "additions": added, "deletions": removed}
    )

import difflib

def handle_json_formatter(files, payload, output_dir):
    text = str(payload.get("text", ""))
    indent = max(1, min(8, int(payload.get("indent", 2))))
    
    if not text.strip():
        return ExecutionResult(kind="json", message="Please provide JSON text", data={"error": "Empty input"})
    
    try:
        parsed = json.loads(text)
        formatted = json.dumps(parsed, indent=indent, ensure_ascii=False, sort_keys=False)
        return ExecutionResult(
            kind="json",
            message="JSON formatted successfully",
            data={"text": formatted, "valid": True}
        )
    except json.JSONDecodeError as e:
        return ExecutionResult(kind="json", message=f"Invalid JSON: {e}", data={"error": str(e), "valid": False})


def handle_json_minifier(files, payload, output_dir):
    text = str(payload.get("text", ""))
    try:
        parsed = json.loads(text)
        minified = json.dumps(parsed, separators=(",", ":"), ensure_ascii=False)
        saved = len(text) - len(minified)
        return ExecutionResult(
            kind="json",
            message=f"JSON minified. Saved {saved} characters",
            data={"text": minified, "original_size": len(text), "minified_size": len(minified), "saved": saved}
        )
    except json.JSONDecodeError as e:
        return ExecutionResult(kind="json", message=f"Invalid JSON: {e}", data={"error": str(e)})


def handle_url_encoder(files, payload, output_dir):
    from urllib.parse import quote
    text = str(payload.get("text", ""))
    encoded = quote(text, safe="")
    return ExecutionResult(kind="json", message="URL encoded", data={"text": encoded, "original": text})


def handle_url_decoder(files, payload, output_dir):
    from urllib.parse import unquote
    text = str(payload.get("text", ""))
    decoded = unquote(text)
    return ExecutionResult(kind="json", message="URL decoded", data={"text": decoded, "original": text})


def handle_html_encoder(files, payload, output_dir):
    text = str(payload.get("text", ""))
    encoded = html.escape(text)
    return ExecutionResult(kind="json", message="HTML encoded", data={"text": encoded})


def handle_html_decoder(files, payload, output_dir):
    text = str(payload.get("text", ""))
    decoded = html.unescape(text)
    return ExecutionResult(kind="json", message="HTML decoded", data={"text": decoded})


def handle_base64_encode(files, payload, output_dir):
    text = str(payload.get("text", ""))
    encoded = base64.b64encode(text.encode("utf-8")).decode("ascii")
    return ExecutionResult(kind="json", message="Base64 encoded", data={"text": encoded, "original_length": len(text), "encoded_length": len(encoded)})


def handle_base64_decode(files, payload, output_dir):
    text = str(payload.get("text", "")).strip()
    try:
        decoded = base64.b64decode(text).decode("utf-8", errors="replace")
        return ExecutionResult(kind="json", message="Base64 decoded", data={"text": decoded})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Decode error: {e}", data={"error": str(e)})


def handle_uuid_generator(files, payload, output_dir):
    count = max(1, min(100, int(payload.get("count", 5))))
    uuids = [str(uuid.uuid4()) for _ in range(count)]
    return ExecutionResult(
        kind="json",
        message=f"Generated {count} UUID(s)",
        data={"text": "\n".join(uuids), "uuids": uuids, "count": count}
    )


def handle_hash_generator(files, payload, output_dir):
    text = str(payload.get("text", ""))
    text_bytes = text.encode("utf-8")
    
    hashes = {
        "md5": hashlib.md5(text_bytes).hexdigest(),
        "sha1": hashlib.sha1(text_bytes).hexdigest(),
        "sha256": hashlib.sha256(text_bytes).hexdigest(),
        "sha512": hashlib.sha512(text_bytes).hexdigest(),
    }
    
    result_text = "\n".join(f"{algo.upper()}: {value}" for algo, value in hashes.items())
    return ExecutionResult(kind="json", message="Hashes generated", data={"text": result_text, **hashes})


def handle_jwt_decoder(files, payload, output_dir):
    token = str(payload.get("text", "")).strip()
    parts = token.split(".")
    
    if len(parts) < 2:
        return ExecutionResult(kind="json", message="Invalid JWT format", data={"error": "JWT must have at least 2 parts separated by dots"})
    
    def decode_part(part):
        padding = 4 - len(part) % 4
        if padding != 4:
            part += "=" * padding
        try:
            decoded = base64.urlsafe_b64decode(part)
            return json.loads(decoded)
        except Exception:
            return {"raw": part}
    
    header = decode_part(parts[0])
    payload_data = decode_part(parts[1])
    
    result = {
        "header": header,
        "payload": payload_data,
        "signature": parts[2] if len(parts) > 2 else "N/A",
    }
    
    result_text = f"Header:\n{json.dumps(header, indent=2)}\n\nPayload:\n{json.dumps(payload_data, indent=2)}"
    return ExecutionResult(kind="json", message="JWT decoded successfully", data={"text": result_text, **result})


def handle_unix_timestamp(files, payload, output_dir):
    input_val = str(payload.get("text", "")).strip()
    mode = str(payload.get("mode", "auto")).lower()
    
    if not input_val or input_val == "now":
        ts = int(datetime.now(timezone.utc).timestamp())
        dt = datetime.now(timezone.utc)
        return ExecutionResult(kind="json", message="Current timestamp", data={
            "text": f"Unix: {ts}\nUTC: {dt.strftime('%Y-%m-%d %H:%M:%S UTC')}\nISO: {dt.isoformat()}",
            "unix_timestamp": ts,
            "utc": dt.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "iso": dt.isoformat(),
        })
    
    try:
        ts = int(float(input_val))
        if ts > 1e12: ts = ts // 1000  # milliseconds
        dt = datetime.fromtimestamp(ts, tz=timezone.utc)
        return ExecutionResult(kind="json", message="Timestamp converted", data={
            "text": f"Unix: {ts}\nUTC: {dt.strftime('%Y-%m-%d %H:%M:%S UTC')}\nISO: {dt.isoformat()}",
            "unix_timestamp": ts,
            "utc": dt.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "iso": dt.isoformat(),
        })
    except (ValueError, OverflowError):
        pass
    
    for fmt in ["%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y-%m-%dT%H:%M:%S"]:
        try:
            dt = datetime.strptime(input_val, fmt).replace(tzinfo=timezone.utc)
            ts = int(dt.timestamp())
            return ExecutionResult(kind="json", message="Date converted", data={
                "text": f"Unix: {ts}\nUTC: {dt.strftime('%Y-%m-%d %H:%M:%S UTC')}",
                "unix_timestamp": ts,
                "utc": dt.strftime("%Y-%m-%d %H:%M:%S UTC"),
            })
        except ValueError:
            continue
    
    return ExecutionResult(kind="json", message="Could not parse input", data={"error": "Unable to parse as timestamp or date"})


def handle_css_minifier(files, payload, output_dir):
    text = str(payload.get("text", ""))
    minified = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
    minified = re.sub(r'\s+', ' ', minified)
    minified = re.sub(r'\s*([{};:,>~+])\s*', r'\1', minified)
    minified = minified.strip()
    saved = len(text) - len(minified)
    return ExecutionResult(kind="json", message=f"CSS minified. Saved {saved} chars", data={"text": minified, "saved": saved})


def handle_js_minifier(files, payload, output_dir):
    text = str(payload.get("text", ""))
    minified = re.sub(r'//[^\n]*', '', text)
    minified = re.sub(r'/\*.*?\*/', '', minified, flags=re.DOTALL)
    minified = re.sub(r'\s+', ' ', minified)
    minified = re.sub(r'\s*([{};:,=+\-*/<>!&|?()[\]])\s*', r'\1', minified)
    minified = minified.strip()
    saved = len(text) - len(minified)
    return ExecutionResult(kind="json", message=f"JS minified. Saved {saved} chars", data={"text": minified, "saved": saved})


def handle_html_minifier(files, payload, output_dir):
    text = str(payload.get("text", ""))
    minified = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
    minified = re.sub(r'>\s+<', '><', minified)
    minified = re.sub(r'\s+', ' ', minified)
    minified = minified.strip()
    saved = len(text) - len(minified)
    return ExecutionResult(kind="json", message=f"HTML minified. Saved {saved} chars", data={"text": minified, "saved": saved})


def handle_markdown_to_html(files, payload, output_dir):
    import markdown as md_lib
    text = str(payload.get("text", ""))
    html_output = md_lib.markdown(text, extensions=["tables", "fenced_code"])
    return ExecutionResult(kind="json", message="Markdown converted to HTML", data={"text": html_output})


def handle_html_to_markdown(files, payload, output_dir):
    try:
        import html2text
        text = str(payload.get("text", ""))
        h = html2text.HTML2Text()
        h.ignore_links = False
        result = h.handle(text)
        return ExecutionResult(kind="json", message="HTML converted to Markdown", data={"text": result})
    except ImportError:
        text = str(payload.get("text", ""))
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(text, "html.parser")
        return ExecutionResult(kind="json", message="HTML converted to text", data={"text": soup.get_text()})


def handle_json_to_csv_text(files, payload, output_dir):
    text = str(payload.get("text", ""))
    try:
        data = json.loads(text)
        if not isinstance(data, list) or not data:
            return ExecutionResult(kind="json", message="Input must be a JSON array of objects", data={"error": "Not an array"})
        
        output = io.StringIO()
        if isinstance(data[0], dict):
            writer = csv.DictWriter(output, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
        else:
            writer = csv.writer(output)
            for row in data:
                writer.writerow(row if isinstance(row, list) else [row])
        
        return ExecutionResult(kind="json", message="JSON converted to CSV", data={"text": output.getvalue()})
    except json.JSONDecodeError as e:
        return ExecutionResult(kind="json", message=f"Invalid JSON: {e}", data={"error": str(e)})


def handle_csv_to_json_text(files, payload, output_dir):
    text = str(payload.get("text", ""))
    reader = csv.DictReader(io.StringIO(text))
    rows = list(reader)
    result = json.dumps(rows, indent=2, ensure_ascii=False)
    return ExecutionResult(kind="json", message=f"CSV converted to JSON ({len(rows)} rows)", data={"text": result, "row_count": len(rows)})


def handle_cron_parser(files, payload, output_dir):
    expr = str(payload.get("text", "")).strip()
    parts = expr.split()
    
    if len(parts) != 5:
        return ExecutionResult(kind="json", message="Cron expression must have 5 fields", data={"error": "Expected: minute hour day month weekday"})
    
    field_names = ["minute", "hour", "day of month", "month", "day of week"]
    field_ranges = [(0, 59), (0, 23), (1, 31), (1, 12), (0, 6)]
    weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    explanations = []
    for i, (part, name, (lo, hi)) in enumerate(zip(parts, field_names, field_ranges)):
        if part == "*":
            explanations.append(f"Every {name}")
        elif part.startswith("*/"):
            step = part[2:]
            explanations.append(f"Every {step} {name}(s)")
        elif "," in part:
            explanations.append(f"{name}: {part}")
        elif "-" in part:
            explanations.append(f"{name}: {part}")
        else:
            if i == 4 and part.isdigit():
                explanations.append(f"{name}: {weekdays[int(part) % 7]}")
            elif i == 3 and part.isdigit():
                explanations.append(f"{name}: {months[int(part)]}" if 1 <= int(part) <= 12 else f"{name}: {part}")
            else:
                explanations.append(f"{name}: {part}")
    
    result = f"Cron: {expr}\n\n" + "\n".join(f"• {e}" for e in explanations)
    return ExecutionResult(kind="json", message="Cron expression parsed", data={"text": result, "fields": dict(zip(field_names, parts))})


def handle_sql_formatter(files, payload, output_dir):
    text = str(payload.get("text", ""))
    keywords = ["SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING",
                 "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "ON",
                 "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE TABLE",
                 "ALTER TABLE", "DROP TABLE", "LIMIT", "OFFSET", "UNION", "AS", "IN", "NOT", "LIKE", "BETWEEN"]
    
    result = text
    for kw in sorted(keywords, key=len, reverse=True):
        pattern = re.compile(r'\b' + re.escape(kw) + r'\b', re.IGNORECASE)
        result = pattern.sub(kw, result)
    
    for kw in ["SELECT", "FROM", "WHERE", "ORDER BY", "GROUP BY", "HAVING", "JOIN",
                "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "LIMIT", "UNION"]:
        result = re.sub(r'\s*\b' + re.escape(kw) + r'\b', f'\n{kw}', result)
    
    result = result.strip()
    return ExecutionResult(kind="json", message="SQL formatted", data={"text": result})


def handle_xml_formatter(files, payload, output_dir):
    text = str(payload.get("text", ""))
    try:
        import xml.dom.minidom
        dom = xml.dom.minidom.parseString(text)
        formatted = dom.toprettyxml(indent="  ")
        lines = [l for l in formatted.split("\n") if l.strip()]
        formatted = "\n".join(lines)
        return ExecutionResult(kind="json", message="XML formatted", data={"text": formatted})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"XML parse error: {e}", data={"error": str(e)})


def handle_yaml_to_json(files, payload, output_dir):
    text = str(payload.get("text", ""))
    try:
        import yaml
        data = yaml.safe_load(text)
        result = json.dumps(data, indent=2, ensure_ascii=False)
        return ExecutionResult(kind="json", message="YAML converted to JSON", data={"text": result})
    except ImportError:
        lines = text.strip().split("\n")
        data = {}
        for line in lines:
            if ":" in line:
                key, val = line.split(":", 1)
                data[key.strip()] = val.strip()
        return ExecutionResult(kind="json", message="YAML converted (basic)", data={"text": json.dumps(data, indent=2)})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"YAML parse error: {e}", data={"error": str(e)})


def handle_json_to_yaml(files, payload, output_dir):
    text = str(payload.get("text", ""))
    try:
        data = json.loads(text)
        try:
            import yaml
            result = yaml.dump(data, default_flow_style=False, allow_unicode=True)
        except ImportError:
            def to_yaml(obj, indent=0):
                lines = []
                prefix = "  " * indent
                if isinstance(obj, dict):
                    for k, v in obj.items():
                        if isinstance(v, (dict, list)):
                            lines.append(f"{prefix}{k}:")
                            lines.append(to_yaml(v, indent + 1))
                        else:
                            lines.append(f"{prefix}{k}: {v}")
                elif isinstance(obj, list):
                    for item in obj:
                        if isinstance(item, (dict, list)):
                            lines.append(f"{prefix}-")
                            lines.append(to_yaml(item, indent + 1))
                        else:
                            lines.append(f"{prefix}- {item}")
                else:
                    lines.append(f"{prefix}{obj}")
                return "\n".join(lines)
            result = to_yaml(data)
        return ExecutionResult(kind="json", message="JSON converted to YAML", data={"text": result})
    except json.JSONDecodeError as e:
        return ExecutionResult(kind="json", message=f"Invalid JSON: {e}", data={"error": str(e)})


def handle_text_escape(files, payload, output_dir):
    text = str(payload.get("text", ""))
    mode = str(payload.get("mode", "escape")).lower()
    
    if mode == "unescape":
        result = text.replace("\\n", "\n").replace("\\t", "\t").replace('\\"', '"').replace("\\'", "'").replace("\\\\", "\\")
    else:
        result = text.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'").replace("\n", "\\n").replace("\t", "\\t")
    
    return ExecutionResult(kind="json", message=f"Text {mode}d", data={"text": result})


def handle_ip_lookup(files, payload, output_dir):
    """Return local machine info — real IP lookup requires external API"""
    import socket
    hostname = socket.gethostname()
    try:
        local_ip = socket.gethostbyname(hostname)
    except:
        local_ip = "127.0.0.1"
    
    return ExecutionResult(kind="json", message="IP information", data={
        "text": f"Hostname: {hostname}\nLocal IP: {local_ip}",
        "hostname": hostname,
        "local_ip": local_ip,
    })


def handle_char_code(files, payload, output_dir):
    text = str(payload.get("text", ""))
    mode = str(payload.get("mode", "to_codes")).lower()
    
    if mode == "from_codes":
        codes = re.findall(r'\d+', text)
        result = "".join(chr(int(c)) for c in codes if 0 <= int(c) <= 0x10FFFF)
        return ExecutionResult(kind="json", message="Codes converted to characters", data={"text": result})
    else:
        rows = []
        for ch in text[:500]:
            rows.append(f"'{ch}' → ASCII:{ord(ch)} HEX:0x{ord(ch):04X}")
        result = "\n".join(rows)
        return ExecutionResult(kind="json", message="Characters converted to codes", data={"text": result})


# ═══════════════════════════════════════════════════════════
# COLOR TOOLS
# ═══════════════════════════════════════════════════════════

def handle_color_picker(files, payload, output_dir):
    hex_color = str(payload.get("text", "#3b82f6")).strip()
    if not hex_color.startswith("#"):
        hex_color = "#" + hex_color
    hex_color = hex_color[:7]
    
    try:
        r = int(hex_color[1:3], 16)
        g = int(hex_color[3:5], 16)
        b = int(hex_color[5:7], 16)
    except (ValueError, IndexError):
        r, g, b = 59, 130, 246
        hex_color = "#3b82f6"
    
    # RGB to HSL
    r1, g1, b1 = r/255, g/255, b/255
    cmax, cmin = max(r1, g1, b1), min(r1, g1, b1)
    delta = cmax - cmin
    l = (cmax + cmin) / 2
    s = 0 if delta == 0 else delta / (1 - abs(2*l - 1))
    if delta == 0: h = 0
    elif cmax == r1: h = 60 * (((g1 - b1) / delta) % 6)
    elif cmax == g1: h = 60 * ((b1 - r1) / delta + 2)
    else: h = 60 * ((r1 - g1) / delta + 4)
    
    return ExecutionResult(kind="json", message="Color analyzed", data={
        "text": f"HEX: {hex_color}\nRGB: rgb({r}, {g}, {b})\nHSL: hsl({h:.0f}, {s*100:.0f}%, {l*100:.0f}%)",
        "hex": hex_color,
        "rgb": f"rgb({r}, {g}, {b})",
        "hsl": f"hsl({h:.0f}, {s*100:.0f}%, {l*100:.0f}%)",
        "r": r, "g": g, "b": b,
    })


def handle_hex_to_rgb(files, payload, output_dir):
    hex_color = str(payload.get("text", "")).strip().lstrip("#")
    if len(hex_color) == 3:
        hex_color = "".join(c*2 for c in hex_color)
    try:
        r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
        return ExecutionResult(kind="json", message="HEX converted to RGB", data={
            "text": f"RGB: rgb({r}, {g}, {b})\nR: {r}\nG: {g}\nB: {b}",
            "rgb": f"rgb({r}, {g}, {b})", "r": r, "g": g, "b": b
        })
    except (ValueError, IndexError):
        return ExecutionResult(kind="json", message="Invalid HEX color", data={"error": "Enter a valid HEX color like #FF5733"})


def handle_rgb_to_hex(files, payload, output_dir):
    r = max(0, min(255, int(payload.get("r", 0))))
    g = max(0, min(255, int(payload.get("g", 0))))
    b = max(0, min(255, int(payload.get("b", 0))))
    hex_color = f"#{r:02x}{g:02x}{b:02x}"
    return ExecutionResult(kind="json", message="RGB converted to HEX", data={
        "text": f"HEX: {hex_color}\nRGB: rgb({r}, {g}, {b})",
        "hex": hex_color
    })


def handle_color_palette(files, payload, output_dir):
    hex_color = str(payload.get("text", "#3b82f6")).strip().lstrip("#")
    if len(hex_color) == 3: hex_color = "".join(c*2 for c in hex_color)
    
    try:
        r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    except: r, g, b = 59, 130, 246
    
    # Generate complementary, analogous, triadic
    palette = {
        "original": f"#{r:02x}{g:02x}{b:02x}",
        "complementary": f"#{255-r:02x}{255-g:02x}{255-b:02x}",
        "lighter": f"#{min(255, r+40):02x}{min(255, g+40):02x}{min(255, b+40):02x}",
        "darker": f"#{max(0, r-40):02x}{max(0, g-40):02x}{max(0, b-40):02x}",
        "desaturated": f"#{(r+g+b)//3:02x}{(r+g+b)//3:02x}{(r+g+b)//3:02x}",
    }
    
    text = "\n".join(f"{name}: {color}" for name, color in palette.items())
    return ExecutionResult(kind="json", message="Palette generated", data={"text": text, **palette})


def handle_rgb_to_hsl(files, payload, output_dir):
    r = max(0, min(255, int(payload.get("r", 0)))) / 255
    g = max(0, min(255, int(payload.get("g", 0)))) / 255
    b = max(0, min(255, int(payload.get("b", 0)))) / 255
    
    cmax, cmin = max(r, g, b), min(r, g, b)
    delta = cmax - cmin
    l = (cmax + cmin) / 2
    s = 0 if delta == 0 else delta / (1 - abs(2*l - 1))
    if delta == 0: h = 0
    elif cmax == r: h = 60 * (((g - b) / delta) % 6)
    elif cmax == g: h = 60 * ((b - r) / delta + 2)
    else: h = 60 * ((r - g) / delta + 4)
    
    return ExecutionResult(kind="json", message="RGB converted to HSL", data={
        "text": f"HSL: hsl({h:.0f}, {s*100:.0f}%, {l*100:.0f}%)",
        "h": round(h), "s": round(s*100), "l": round(l*100),
    })


def handle_contrast_checker(files, payload, output_dir):
    fg = str(payload.get("foreground", "#000000")).strip().lstrip("#")
    bg = str(payload.get("background", "#ffffff")).strip().lstrip("#")
    
    def luminance(hex_str):
        r, g, b = int(hex_str[0:2], 16)/255, int(hex_str[2:4], 16)/255, int(hex_str[4:6], 16)/255
        def adjust(c): return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
        return 0.2126*adjust(r) + 0.7152*adjust(g) + 0.0722*adjust(b)
    
    try:
        l1, l2 = luminance(fg), luminance(bg)
        ratio = (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)
        aa_normal = "Pass ✓" if ratio >= 4.5 else "Fail ✗"
        aa_large = "Pass ✓" if ratio >= 3.0 else "Fail ✗"
        aaa_normal = "Pass ✓" if ratio >= 7.0 else "Fail ✗"
        
        return ExecutionResult(kind="json", message=f"Contrast ratio: {ratio:.2f}:1", data={
            "text": f"Contrast Ratio: {ratio:.2f}:1\n\nWCAG AA (Normal text): {aa_normal}\nWCAG AA (Large text): {aa_large}\nWCAG AAA (Normal text): {aaa_normal}",
            "ratio": round(ratio, 2),
            "aa_normal": aa_normal,
            "aa_large": aa_large,
            "aaa_normal": aaa_normal,
        })
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Error: {e}", data={"error": str(e)})


def handle_gradient_generator(files, payload, output_dir):
    color1 = str(payload.get("color1", "#667eea")).strip()
    color2 = str(payload.get("color2", "#764ba2")).strip()
    direction = str(payload.get("direction", "to right")).strip()
    
    css = f"background: linear-gradient({direction}, {color1}, {color2});"
    return ExecutionResult(kind="json", message="Gradient CSS generated", data={
        "text": css,
        "css": css,
        "color1": color1,
        "color2": color2,
    })


# ═══════════════════════════════════════════════════════════
# SECURITY TOOLS
# ═══════════════════════════════════════════════════════════

def handle_password_generator(files, payload, output_dir):
    length = max(4, min(128, int(payload.get("length", 16))))
    use_upper = str(payload.get("uppercase", "true")).lower() == "true"
    use_lower = str(payload.get("lowercase", "true")).lower() == "true"
    use_digits = str(payload.get("digits", "true")).lower() == "true"
    use_symbols = str(payload.get("symbols", "true")).lower() == "true"
    count = max(1, min(20, int(payload.get("count", 5))))
    
    chars = ""
    if use_lower: chars += string.ascii_lowercase
    if use_upper: chars += string.ascii_uppercase
    if use_digits: chars += string.digits
    if use_symbols: chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    if not chars: chars = string.ascii_letters + string.digits
    
    passwords = []
    for _ in range(count):
        pw = "".join(secrets.choice(chars) for _ in range(length))
        passwords.append(pw)
    
    return ExecutionResult(kind="json", message=f"Generated {count} password(s)", data={
        "text": "\n".join(passwords),
        "passwords": passwords,
        "length": length,
    })


def handle_password_strength(files, payload, output_dir):
    password = str(payload.get("text", ""))
    
    score = 0
    feedback = []
    
    if len(password) >= 8: score += 1
    else: feedback.append("Use at least 8 characters")
    if len(password) >= 12: score += 1
    if len(password) >= 16: score += 1
    
    if re.search(r'[a-z]', password): score += 1
    else: feedback.append("Add lowercase letters")
    if re.search(r'[A-Z]', password): score += 1
    else: feedback.append("Add uppercase letters")
    if re.search(r'\d', password): score += 1
    else: feedback.append("Add numbers")
    if re.search(r'[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]', password): score += 1
    else: feedback.append("Add special characters")
    
    if len(set(password)) < len(password) * 0.5: feedback.append("Too many repeated characters")
    
    strength = "Very Weak"
    if score >= 6: strength = "Very Strong 💪"
    elif score >= 5: strength = "Strong"
    elif score >= 4: strength = "Medium"
    elif score >= 3: strength = "Weak"
    
    return ExecutionResult(kind="json", message=f"Password strength: {strength}", data={
        "text": f"Strength: {strength}\nScore: {score}/7\nLength: {len(password)}\n\nSuggestions:\n" + ("\n".join(f"• {f}" for f in feedback) if feedback else "• Your password is strong!"),
        "strength": strength,
        "score": score,
    })


def handle_md5_generator(files, payload, output_dir):
    text = str(payload.get("text", ""))
    md5 = hashlib.md5(text.encode("utf-8")).hexdigest()
    return ExecutionResult(kind="json", message="MD5 hash generated", data={"text": md5, "hash": md5, "algorithm": "MD5"})


def handle_sha256_generator(files, payload, output_dir):
    text = str(payload.get("text", ""))
    sha = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return ExecutionResult(kind="json", message="SHA-256 hash generated", data={"text": sha, "hash": sha, "algorithm": "SHA-256"})


def handle_bcrypt_generator(files, payload, output_dir):
    text = str(payload.get("text", ""))
    try:
        import bcrypt
        hashed = bcrypt.hashpw(text.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        return ExecutionResult(kind="json", message="BCrypt hash generated", data={"text": hashed, "hash": hashed, "algorithm": "BCrypt"})
    except ImportError:
        sha = hashlib.sha256(text.encode("utf-8")).hexdigest()
        return ExecutionResult(kind="json", message="BCrypt unavailable, SHA-256 generated instead", data={"text": sha, "hash": sha, "algorithm": "SHA-256 (BCrypt unavailable)"})


# ═══════════════════════════════════════════════════════════
# UNIT CONVERTERS
# ═══════════════════════════════════════════════════════════

def handle_temperature_converter(files, payload, output_dir):
    value = float(payload.get("value", 0))
    from_unit = str(payload.get("from_unit", "celsius")).lower()
    
    if from_unit.startswith("c"):
        c, f, k = value, value * 9/5 + 32, value + 273.15
    elif from_unit.startswith("f"):
        c, f, k = (value - 32) * 5/9, value, (value - 32) * 5/9 + 273.15
    else:
        c, f, k = value - 273.15, (value - 273.15) * 9/5 + 32, value
    
    return ExecutionResult(kind="json", message="Temperature converted", data={
        "text": f"Celsius: {c:.2f}°C\nFahrenheit: {f:.2f}°F\nKelvin: {k:.2f}K",
        "celsius": round(c, 2), "fahrenheit": round(f, 2), "kelvin": round(k, 2),
    })


def _unit_converter(conversions, payload, unit_type):
    value = float(payload.get("value", 0))
    from_unit = str(payload.get("from_unit", "")).lower()
    to_unit = str(payload.get("to_unit", "")).lower()
    
    if from_unit not in conversions or to_unit not in conversions:
        available = ", ".join(conversions.keys())
        return ExecutionResult(kind="json", message=f"Unknown unit. Available: {available}", data={"error": "Unknown unit", "available": available})
    
    base = value * conversions[from_unit]
    result = base / conversions[to_unit]
    
    return ExecutionResult(kind="json", message=f"{value} {from_unit} = {result:.6g} {to_unit}", data={
        "text": f"{value} {from_unit} = {result:.6g} {to_unit}",
        "result": result, "from": from_unit, "to": to_unit
    })


def handle_length_converter(files, payload, output_dir):
    conversions = {"meter": 1, "m": 1, "kilometer": 1000, "km": 1000, "centimeter": 0.01, "cm": 0.01,
                   "millimeter": 0.001, "mm": 0.001, "mile": 1609.344, "yard": 0.9144, "foot": 0.3048,
                   "feet": 0.3048, "inch": 0.0254, "nautical mile": 1852}
    return _unit_converter(conversions, payload, "length")


def handle_weight_converter(files, payload, output_dir):
    conversions = {"kilogram": 1, "kg": 1, "gram": 0.001, "g": 0.001, "milligram": 0.000001, "mg": 0.000001,
                   "pound": 0.453592, "lb": 0.453592, "lbs": 0.453592, "ounce": 0.0283495, "oz": 0.0283495,
                   "ton": 1000, "metric ton": 1000, "stone": 6.35029}
    return _unit_converter(conversions, payload, "weight")


def handle_speed_converter(files, payload, output_dir):
    conversions = {"km/h": 1, "kmh": 1, "mph": 1.60934, "m/s": 3.6, "ft/s": 1.09728, "knot": 1.852, "knots": 1.852}
    return _unit_converter(conversions, payload, "speed")


def handle_data_storage_converter(files, payload, output_dir):
    conversions = {"byte": 1, "bytes": 1, "kb": 1024, "mb": 1048576, "gb": 1073741824,
                   "tb": 1099511627776, "pb": 1125899906842624,
                   "kilobyte": 1024, "megabyte": 1048576, "gigabyte": 1073741824,
                   "terabyte": 1099511627776, "petabyte": 1125899906842624}
    return _unit_converter(conversions, payload, "data storage")


def handle_area_converter(files, payload, output_dir):
    conversions = {"sq meter": 1, "sqm": 1, "sq foot": 0.092903, "sqft": 0.092903,
                   "acre": 4046.86, "hectare": 10000, "sq kilometer": 1000000,
                   "sq mile": 2589988, "sq yard": 0.836127, "sq inch": 0.00064516}
    return _unit_converter(conversions, payload, "area")


def handle_volume_converter(files, payload, output_dir):
    conversions = {"liter": 1, "l": 1, "milliliter": 0.001, "ml": 0.001,
                   "gallon": 3.78541, "quart": 0.946353, "pint": 0.473176,
                   "cup": 0.236588, "fluid ounce": 0.0295735, "tablespoon": 0.0147868,
                   "teaspoon": 0.00492892, "cubic meter": 1000}
    return _unit_converter(conversions, payload, "volume")


def handle_timezone_converter(files, payload, output_dir):
    time_str = str(payload.get("time", "")).strip()
    from_tz = str(payload.get("from_timezone", "UTC")).strip()
    to_tz = str(payload.get("to_timezone", "IST")).strip()
    
    tz_offsets = {"UTC": 0, "GMT": 0, "EST": -5, "EDT": -4, "CST": -6, "CDT": -5,
                  "MST": -7, "MDT": -6, "PST": -8, "PDT": -7, "IST": 5.5,
                  "JST": 9, "KST": 9, "CST_CHINA": 8, "AEST": 10, "CET": 1, "EET": 2}
    
    from_offset = tz_offsets.get(from_tz.upper(), 0)
    to_offset = tz_offsets.get(to_tz.upper(), 0)
    
    if not time_str or time_str.lower() == "now":
        now = datetime.now(timezone.utc) + timedelta(hours=from_offset)
        h, m = now.hour, now.minute
    else:
        parts = time_str.replace(":", " ").split()
        h, m = int(parts[0]), int(parts[1]) if len(parts) > 1 else 0
    
    diff = to_offset - from_offset
    total_minutes = h * 60 + m + int(diff * 60)
    new_h = (total_minutes // 60) % 24
    new_m = total_minutes % 60
    
    return ExecutionResult(kind="json", message="Time converted", data={
        "text": f"{h:02d}:{m:02d} {from_tz} = {new_h:02d}:{new_m:02d} {to_tz}",
        "result": f"{new_h:02d}:{new_m:02d}",
        "from_timezone": from_tz,
        "to_timezone": to_tz,
    })


def handle_energy_converter(files, payload, output_dir):
    conversions = {"joule": 1, "j": 1, "kilojoule": 1000, "kj": 1000,
                   "calorie": 4.184, "cal": 4.184, "kilocalorie": 4184, "kcal": 4184,
                   "kwh": 3600000, "btu": 1055.06, "electronvolt": 1.602e-19}
    return _unit_converter(conversions, payload, "energy")


def handle_pressure_converter(files, payload, output_dir):
    conversions = {"pascal": 1, "pa": 1, "kilopascal": 1000, "kpa": 1000,
                   "bar": 100000, "atm": 101325, "psi": 6894.76,
                   "mmhg": 133.322, "torr": 133.322}
    return _unit_converter(conversions, payload, "pressure")


# ═══════════════════════════════════════════════════════════
# SOCIAL MEDIA TOOLS
# ═══════════════════════════════════════════════════════════

def _social_media_resize(files, payload, output_dir, width, height, name):
    ensure_files(files, 1)
    img = Image.open(files[0]).convert("RGB")
    
    # Smart crop/resize to exact dimensions
    img_ratio = img.width / img.height
    target_ratio = width / height
    
    if img_ratio > target_ratio:
        new_h = img.height
        new_w = int(new_h * target_ratio)
        left = (img.width - new_w) // 2
        img = img.crop((left, 0, left + new_w, new_h))
    else:
        new_w = img.width
        new_h = int(new_w / target_ratio)
        top = (img.height - new_h) // 2
        img = img.crop((0, top, new_w, top + new_h))
    
    img = img.resize((width, height), Image.LANCZOS)
    output = output_dir / f"{name}-{width}x{height}.jpg"
    img.save(str(output), "JPEG", quality=95)
    return create_single_file_result(output, f"Image resized to {width}x{height} for {name}", "image/jpeg")


def handle_instagram_post_resizer(files, payload, output_dir):
    aspect = str(payload.get("aspect", "square")).lower()
    dims = {"square": (1080, 1080), "portrait": (1080, 1350), "landscape": (1080, 566)}
    w, h = dims.get(aspect, (1080, 1080))
    return _social_media_resize(files, payload, output_dir, w, h, "instagram")


def handle_youtube_thumbnail(files, payload, output_dir):
    return _social_media_resize(files, payload, output_dir, 1280, 720, "youtube-thumbnail")


def handle_twitter_header(files, payload, output_dir):
    return _social_media_resize(files, payload, output_dir, 1500, 500, "twitter-header")


def handle_facebook_cover(files, payload, output_dir):
    return _social_media_resize(files, payload, output_dir, 820, 312, "facebook-cover")


def handle_linkedin_banner(files, payload, output_dir):
    return _social_media_resize(files, payload, output_dir, 1584, 396, "linkedin-banner")


def handle_whatsapp_dp(files, payload, output_dir):
    return _social_media_resize(files, payload, output_dir, 500, 500, "whatsapp-dp")


# ═══════════════════════════════════════════════════════════
# HANDLER REGISTRY
# ═══════════════════════════════════════════════════════════

NEW_TOOL_HANDLERS: dict[str, ToolHandler] = {
    # Developer Tools
    "lorem-ipsum-generator": handle_lorem_ipsum,
    "regex-tester": handle_regex_tester,
    "diff-checker": handle_diff_checker,
    "json-formatter": handle_json_formatter,
    "json-minifier": handle_json_minifier,
    "url-encoder": handle_url_encoder,
    "url-decoder": handle_url_decoder,
    "html-encoder": handle_html_encoder,
    "html-decoder": handle_html_decoder,
    "base64-encode": handle_base64_encode,
    "base64-decode": handle_base64_decode,
    "uuid-generator": handle_uuid_generator,
    "hash-generator": handle_hash_generator,
    "jwt-decoder": handle_jwt_decoder,
    "unix-timestamp-converter": handle_unix_timestamp,
    "css-minifier": handle_css_minifier,
    "js-minifier": handle_js_minifier,
    "html-minifier": handle_html_minifier,
    "markdown-to-html": handle_markdown_to_html,
    "html-to-markdown": handle_html_to_markdown,
    "json-to-csv-text": handle_json_to_csv_text,
    "csv-to-json-text": handle_csv_to_json_text,
    "cron-expression-parser": handle_cron_parser,
    "sql-formatter": handle_sql_formatter,
    "xml-formatter": handle_xml_formatter,
    "yaml-to-json": handle_yaml_to_json,
    "json-to-yaml": handle_json_to_yaml,
    "text-escape-unescape": handle_text_escape,
    "ip-lookup": handle_ip_lookup,
    "char-code-converter": handle_char_code,
    
    # Color Tools
    "color-picker": handle_color_picker,
    "hex-to-rgb": handle_hex_to_rgb,
    "rgb-to-hex": handle_rgb_to_hex,
    "color-palette-generator": handle_color_palette,
    "rgb-to-hsl": handle_rgb_to_hsl,
    "color-contrast-checker": handle_contrast_checker,
    "gradient-generator": handle_gradient_generator,
    
    # Security Tools
    "password-generator": handle_password_generator,
    "password-strength-checker": handle_password_strength,
    "md5-generator": handle_md5_generator,
    "sha256-generator": handle_sha256_generator,
    "bcrypt-generator": handle_bcrypt_generator,
    
    # Unit Converters
    "temperature-converter": handle_temperature_converter,
    "length-converter": handle_length_converter,
    "weight-converter": handle_weight_converter,
    "speed-converter": handle_speed_converter,
    "data-storage-converter": handle_data_storage_converter,
    "area-converter": handle_area_converter,
    "volume-converter": handle_volume_converter,
    "time-zone-converter": handle_timezone_converter,
    "energy-converter": handle_energy_converter,
    "pressure-converter": handle_pressure_converter,
    
    # Social Media Tools
    "instagram-post-resizer": handle_instagram_post_resizer,
    "youtube-thumbnail-maker": handle_youtube_thumbnail,
    "twitter-header-maker": handle_twitter_header,
    "facebook-cover-maker": handle_facebook_cover,
    "linkedin-banner-maker": handle_linkedin_banner,
    "whatsapp-dp-maker": handle_whatsapp_dp,
}
