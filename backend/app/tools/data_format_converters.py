"""
ISHU TOOLS — Data Format Converter Pack (2026)

Pure-Python converters for JSON / YAML / XML / TOML / CSV / TSV / HTML / SQL /
Markdown. No external services — all in-process.
"""
from __future__ import annotations

import csv
import io
import json
import re
import xml.etree.ElementTree as ET
from html import escape
from pathlib import Path
from typing import Any

from .handlers import ExecutionResult


def _safe(name: str, limit: int = 60) -> str:
    cleaned = re.sub(r"[^\w\s-]", "", name or "file")[:limit].strip()
    return cleaned.replace(" ", "_") or "file"


def _read_text(files: list[Path], payload: dict[str, Any]) -> str | None:
    if files:
        try:
            return files[0].read_text(encoding="utf-8")
        except UnicodeDecodeError:
            return files[0].read_text(encoding="latin-1", errors="replace")
    txt = payload.get("text") or payload.get("input") or payload.get("content")
    return str(txt) if txt is not None else None


def _err(msg: str, detail: str = "") -> ExecutionResult:
    return ExecutionResult(kind="json", message=msg, data={"error": detail or msg})


def _text_result(text: str, filename: str, message: str, mime: str = "text/plain") -> ExecutionResult:
    return ExecutionResult(
        kind="json",
        message=message,
        data={
            "output": text,
            "result": text,
            "text": text,
            "preview": text[:5000],
            "filename": filename,
            "mime": mime,
        },
    )


# ─── YAML helpers (lazy import) ────────────────────────────────────────────
def _yaml():
    try:
        import yaml  # type: ignore
        return yaml
    except Exception:
        return None


def _toml_loads(text: str):
    try:
        import tomllib  # py3.11+
        return tomllib.loads(text)
    except Exception:
        try:
            import tomli  # type: ignore
            return tomli.loads(text)
        except Exception:
            return None


def _toml_dumps(obj):
    try:
        import tomli_w  # type: ignore
        return tomli_w.dumps(obj)
    except Exception:
        return None


# ─── XML helpers ───────────────────────────────────────────────────────────
def _dict_to_xml(obj: Any, root: str = "root") -> str:
    def _build(parent: ET.Element, value: Any):
        if isinstance(value, dict):
            for k, v in value.items():
                key = re.sub(r"[^a-zA-Z0-9_]", "_", str(k)) or "item"
                if key[0].isdigit():
                    key = "_" + key
                child = ET.SubElement(parent, key)
                _build(child, v)
        elif isinstance(value, list):
            for item in value:
                child = ET.SubElement(parent, "item")
                _build(child, item)
        else:
            parent.text = "" if value is None else str(value)

    el = ET.Element(root)
    _build(el, obj)
    try:
        ET.indent(el, space="  ")
    except Exception:
        pass
    return ET.tostring(el, encoding="unicode")


def _xml_to_dict(elem: ET.Element) -> Any:
    children = list(elem)
    if not children:
        return (elem.text or "").strip()
    if all(c.tag == "item" for c in children):
        return [_xml_to_dict(c) for c in children]
    out: dict[str, Any] = {}
    for c in children:
        v = _xml_to_dict(c)
        if c.tag in out:
            if not isinstance(out[c.tag], list):
                out[c.tag] = [out[c.tag]]
            out[c.tag].append(v)
        else:
            out[c.tag] = v
    return out


# ─── CSV / TSV helpers ─────────────────────────────────────────────────────
def _parse_csv(text: str, delim: str = ",") -> list[dict[str, str]]:
    reader = csv.DictReader(io.StringIO(text), delimiter=delim)
    return [dict(row) for row in reader]


def _records_to_csv(rows: list[dict[str, Any]], delim: str = ",") -> str:
    if not rows:
        return ""
    headers: list[str] = []
    seen: set[str] = set()
    for row in rows:
        for k in row.keys():
            if k not in seen:
                headers.append(k); seen.add(k)
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=headers, delimiter=delim, extrasaction="ignore")
    writer.writeheader()
    for row in rows:
        writer.writerow({k: ("" if row.get(k) is None else row.get(k)) for k in headers})
    return buf.getvalue()


def _flatten(obj: Any) -> list[dict[str, Any]]:
    """Coerce JSON-like object to list-of-dicts for CSV export."""
    if isinstance(obj, list):
        if not obj:
            return []
        if all(isinstance(o, dict) for o in obj):
            return obj
        return [{"value": o} for o in obj]
    if isinstance(obj, dict):
        # If values are list-of-dicts, use first such; else single row
        for v in obj.values():
            if isinstance(v, list) and v and all(isinstance(o, dict) for o in v):
                return v
        return [obj]
    return [{"value": obj}]


# ─── JSON ↔ YAML ───────────────────────────────────────────────────────────
def _h_json_to_yaml(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide JSON text or upload a .json file.")
    yaml = _yaml()
    if not yaml: return _err("YAML library unavailable on server.")
    try: obj = json.loads(text)
    except Exception as e: return _err("Invalid JSON.", str(e))
    out = yaml.safe_dump(obj, sort_keys=False, allow_unicode=True)
    return _text_result(out, "converted.yaml", "✅ Converted JSON → YAML")


def _h_yaml_to_json(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide YAML text or upload a .yaml file.")
    yaml = _yaml()
    if not yaml: return _err("YAML library unavailable on server.")
    try: obj = yaml.safe_load(text)
    except Exception as e: return _err("Invalid YAML.", str(e))
    out = json.dumps(obj, indent=2, ensure_ascii=False)
    return _text_result(out, "converted.json", "✅ Converted YAML → JSON")


# ─── JSON ↔ XML ────────────────────────────────────────────────────────────
def _h_json_to_xml(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide JSON text or upload a .json file.")
    try: obj = json.loads(text)
    except Exception as e: return _err("Invalid JSON.", str(e))
    out = '<?xml version="1.0" encoding="UTF-8"?>\n' + _dict_to_xml(obj, "root")
    return _text_result(out, "converted.xml", "✅ Converted JSON → XML")


def _h_xml_to_json(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide XML text or upload a .xml file.")
    try: root = ET.fromstring(text)
    except Exception as e: return _err("Invalid XML.", str(e))
    obj = {root.tag: _xml_to_dict(root)}
    out = json.dumps(obj, indent=2, ensure_ascii=False)
    return _text_result(out, "converted.json", "✅ Converted XML → JSON")


# ─── JSON ↔ TOML ───────────────────────────────────────────────────────────
def _h_json_to_toml(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide JSON text or upload a .json file.")
    try: obj = json.loads(text)
    except Exception as e: return _err("Invalid JSON.", str(e))
    if not isinstance(obj, dict):
        return _err("TOML root must be an object/dict.")
    out = _toml_dumps(obj)
    if out is None:
        return _err("TOML writer unavailable on server.")
    return _text_result(out, "converted.toml", "✅ Converted JSON → TOML")


def _h_toml_to_json(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide TOML text or upload a .toml file.")
    obj = _toml_loads(text)
    if obj is None: return _err("Invalid TOML or library unavailable.")
    out = json.dumps(obj, indent=2, ensure_ascii=False)
    return _text_result(out, "converted.json", "✅ Converted TOML → JSON")


# ─── YAML ↔ XML / TOML ─────────────────────────────────────────────────────
def _h_yaml_to_xml(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide YAML text.")
    yaml = _yaml()
    if not yaml: return _err("YAML library unavailable.")
    try: obj = yaml.safe_load(text)
    except Exception as e: return _err("Invalid YAML.", str(e))
    out = '<?xml version="1.0" encoding="UTF-8"?>\n' + _dict_to_xml(obj, "root")
    return _text_result(out, "converted.xml", "✅ Converted YAML → XML")


def _h_xml_to_yaml(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide XML text.")
    yaml = _yaml()
    if not yaml: return _err("YAML library unavailable.")
    try: root = ET.fromstring(text)
    except Exception as e: return _err("Invalid XML.", str(e))
    obj = {root.tag: _xml_to_dict(root)}
    out = yaml.safe_dump(obj, sort_keys=False, allow_unicode=True)
    return _text_result(out, "converted.yaml", "✅ Converted XML → YAML")


def _h_yaml_to_toml(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide YAML text.")
    yaml = _yaml()
    if not yaml: return _err("YAML library unavailable.")
    try: obj = yaml.safe_load(text)
    except Exception as e: return _err("Invalid YAML.", str(e))
    if not isinstance(obj, dict): return _err("TOML root must be an object.")
    out = _toml_dumps(obj)
    if out is None: return _err("TOML writer unavailable.")
    return _text_result(out, "converted.toml", "✅ Converted YAML → TOML")


def _h_toml_to_yaml(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide TOML text.")
    yaml = _yaml()
    if not yaml: return _err("YAML library unavailable.")
    obj = _toml_loads(text)
    if obj is None: return _err("Invalid TOML.")
    out = yaml.safe_dump(obj, sort_keys=False, allow_unicode=True)
    return _text_result(out, "converted.yaml", "✅ Converted TOML → YAML")


# ─── CSV ↔ TSV ─────────────────────────────────────────────────────────────
def _h_csv_to_tsv(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide CSV text or upload a .csv file.")
    rows = _parse_csv(text, ",")
    out = _records_to_csv(rows, "\t")
    return _text_result(out, "converted.tsv", "✅ Converted CSV → TSV")


def _h_tsv_to_csv(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide TSV text or upload a .tsv file.")
    rows = _parse_csv(text, "\t")
    out = _records_to_csv(rows, ",")
    return _text_result(out, "converted.csv", "✅ Converted TSV → CSV")


# ─── CSV ↔ XML / YAML / HTML / SQL / Markdown ──────────────────────────────
def _h_csv_to_xml(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide CSV text.")
    rows = _parse_csv(text, ",")
    obj = {"rows": rows}
    out = '<?xml version="1.0" encoding="UTF-8"?>\n' + _dict_to_xml(obj, "data")
    return _text_result(out, "converted.xml", "✅ Converted CSV → XML")


def _h_xml_to_csv(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide XML text.")
    try: root = ET.fromstring(text)
    except Exception as e: return _err("Invalid XML.", str(e))
    obj = _xml_to_dict(root)
    rows = _flatten(obj)
    out = _records_to_csv(rows, ",")
    return _text_result(out, "converted.csv", "✅ Converted XML → CSV")


def _h_csv_to_yaml(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide CSV text.")
    yaml = _yaml()
    if not yaml: return _err("YAML library unavailable.")
    rows = _parse_csv(text, ",")
    out = yaml.safe_dump(rows, sort_keys=False, allow_unicode=True)
    return _text_result(out, "converted.yaml", "✅ Converted CSV → YAML")


def _h_yaml_to_csv(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide YAML text.")
    yaml = _yaml()
    if not yaml: return _err("YAML library unavailable.")
    try: obj = yaml.safe_load(text)
    except Exception as e: return _err("Invalid YAML.", str(e))
    rows = _flatten(obj)
    out = _records_to_csv(rows, ",")
    return _text_result(out, "converted.csv", "✅ Converted YAML → CSV")


def _h_csv_to_html(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide CSV text.")
    rows = _parse_csv(text, ",")
    if not rows:
        return _text_result("<table></table>", "converted.html", "✅ Empty CSV → HTML")
    headers = list(rows[0].keys())
    h = ['<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">']
    h.append("<thead><tr>" + "".join(f"<th>{escape(str(c))}</th>" for c in headers) + "</tr></thead>")
    h.append("<tbody>")
    for r in rows:
        h.append("<tr>" + "".join(f"<td>{escape(str(r.get(c, '')))}</td>" for c in headers) + "</tr>")
    h.append("</tbody></table>")
    return _text_result("\n".join(h), "converted.html", "✅ Converted CSV → HTML table")


def _h_html_to_csv(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide HTML text containing a <table>.")
    rows: list[list[str]] = []
    # Very simple table extractor — first <table>
    table_m = re.search(r"<table[^>]*>(.*?)</table>", text, re.IGNORECASE | re.DOTALL)
    if not table_m: return _err("No <table> found in HTML.")
    body = table_m.group(1)
    for tr in re.finditer(r"<tr[^>]*>(.*?)</tr>", body, re.IGNORECASE | re.DOTALL):
        cells = re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", tr.group(1), re.IGNORECASE | re.DOTALL)
        cleaned = [re.sub(r"<[^>]+>", "", c).strip() for c in cells]
        rows.append(cleaned)
    if not rows: return _err("No rows found in <table>.")
    buf = io.StringIO()
    csv.writer(buf).writerows(rows)
    return _text_result(buf.getvalue(), "converted.csv", "✅ Converted HTML table → CSV")


def _h_csv_to_sql(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide CSV text.")
    table = re.sub(r"[^a-zA-Z0-9_]", "_", str(payload.get("table") or "data")) or "data"
    rows = _parse_csv(text, ",")
    if not rows: return _text_result(f"-- empty --", "converted.sql", "Empty CSV → SQL")
    headers = list(rows[0].keys())
    cols = ", ".join(f'"{h}"' for h in headers)
    out_lines = [f'CREATE TABLE IF NOT EXISTS "{table}" ({", ".join(f""""{h}" TEXT""" for h in headers)});']
    for r in rows:
        vals = ", ".join("'" + str(r.get(h, "")).replace("'", "''") + "'" for h in headers)
        out_lines.append(f'INSERT INTO "{table}" ({cols}) VALUES ({vals});')
    return _text_result("\n".join(out_lines), "converted.sql", "✅ Converted CSV → SQL")


def _h_csv_to_markdown(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide CSV text.")
    rows = _parse_csv(text, ",")
    if not rows: return _text_result("", "converted.md", "Empty CSV → Markdown")
    headers = list(rows[0].keys())
    lines = ["| " + " | ".join(headers) + " |",
             "| " + " | ".join("---" for _ in headers) + " |"]
    for r in rows:
        lines.append("| " + " | ".join(str(r.get(h, "")).replace("|", "\\|") for h in headers) + " |")
    return _text_result("\n".join(lines), "converted.md", "✅ Converted CSV → Markdown table")


def _h_markdown_to_csv(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide a Markdown table.")
    lines = [ln.strip() for ln in text.splitlines() if ln.strip().startswith("|")]
    if len(lines) < 2: return _err("No Markdown table found.")
    def _split(line: str) -> list[str]:
        line = line.strip().strip("|")
        return [c.strip() for c in line.split("|")]
    headers = _split(lines[0])
    rows = [_split(ln) for ln in lines[2:]] if "---" in lines[1] else [_split(ln) for ln in lines[1:]]
    buf = io.StringIO()
    w = csv.writer(buf); w.writerow(headers)
    for r in rows: w.writerow(r + [""] * (len(headers) - len(r)))
    return _text_result(buf.getvalue(), "converted.csv", "✅ Converted Markdown table → CSV")


# ─── JSON ↔ Markdown / SQL / HTML ──────────────────────────────────────────
def _h_json_to_markdown(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide JSON text.")
    try: obj = json.loads(text)
    except Exception as e: return _err("Invalid JSON.", str(e))
    rows = _flatten(obj)
    if not rows: return _text_result("", "converted.md", "Empty JSON → Markdown")
    headers: list[str] = []
    seen: set[str] = set()
    for r in rows:
        for k in r.keys():
            if k not in seen: headers.append(k); seen.add(k)
    lines = ["| " + " | ".join(headers) + " |",
             "| " + " | ".join("---" for _ in headers) + " |"]
    for r in rows:
        lines.append("| " + " | ".join(str(r.get(h, "")).replace("|", "\\|") for h in headers) + " |")
    return _text_result("\n".join(lines), "converted.md", "✅ Converted JSON → Markdown table")


def _h_json_to_sql(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide JSON text.")
    try: obj = json.loads(text)
    except Exception as e: return _err("Invalid JSON.", str(e))
    rows = _flatten(obj)
    table = re.sub(r"[^a-zA-Z0-9_]", "_", str(payload.get("table") or "data")) or "data"
    if not rows: return _text_result(f"-- empty --", "converted.sql", "Empty")
    headers: list[str] = []
    seen: set[str] = set()
    for r in rows:
        for k in r.keys():
            if k not in seen: headers.append(k); seen.add(k)
    cols = ", ".join(f'"{h}"' for h in headers)
    out_lines = [f'CREATE TABLE IF NOT EXISTS "{table}" ({", ".join(f""""{h}" TEXT""" for h in headers)});']
    for r in rows:
        vals = ", ".join("'" + str(r.get(h, "")).replace("'", "''") + "'" for h in headers)
        out_lines.append(f'INSERT INTO "{table}" ({cols}) VALUES ({vals});')
    return _text_result("\n".join(out_lines), "converted.sql", "✅ Converted JSON → SQL")


def _h_json_to_html(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide JSON text.")
    try: obj = json.loads(text)
    except Exception as e: return _err("Invalid JSON.", str(e))
    rows = _flatten(obj)
    if not rows: return _text_result("<table></table>", "converted.html", "Empty")
    headers: list[str] = []
    seen: set[str] = set()
    for r in rows:
        for k in r.keys():
            if k not in seen: headers.append(k); seen.add(k)
    h = ['<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">']
    h.append("<thead><tr>" + "".join(f"<th>{escape(str(c))}</th>" for c in headers) + "</tr></thead>")
    h.append("<tbody>")
    for r in rows:
        h.append("<tr>" + "".join(f"<td>{escape(str(r.get(c, '')))}</td>" for c in headers) + "</tr>")
    h.append("</tbody></table>")
    return _text_result("\n".join(h), "converted.html", "✅ Converted JSON → HTML table")


def _h_html_to_json(files, payload, _job):
    text = _read_text(files, payload)
    if not text: return _err("Provide HTML text containing a <table>.")
    table_m = re.search(r"<table[^>]*>(.*?)</table>", text, re.IGNORECASE | re.DOTALL)
    if not table_m: return _err("No <table> found in HTML.")
    body = table_m.group(1)
    rows: list[list[str]] = []
    for tr in re.finditer(r"<tr[^>]*>(.*?)</tr>", body, re.IGNORECASE | re.DOTALL):
        cells = re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", tr.group(1), re.IGNORECASE | re.DOTALL)
        rows.append([re.sub(r"<[^>]+>", "", c).strip() for c in cells])
    if not rows: return _err("No rows in table.")
    headers = rows[0]
    records = [dict(zip(headers, r + [""] * (len(headers) - len(r)))) for r in rows[1:]]
    return _text_result(json.dumps(records, indent=2, ensure_ascii=False),
                        "converted.json", "✅ Converted HTML table → JSON")


# ─── Registry ──────────────────────────────────────────────────────────────
DATA_FORMAT_HANDLERS: dict = {
    # JSON ↔ YAML / XML / TOML / Markdown / SQL / HTML
    "json-to-xml":      _h_json_to_xml,
    "xml-to-json":      _h_xml_to_json,
    "json-to-toml":     _h_json_to_toml,
    "toml-to-json":     _h_toml_to_json,
    "json-to-markdown": _h_json_to_markdown,
    "json-to-md":       _h_json_to_markdown,
    "json-to-sql":      _h_json_to_sql,
    "json-to-html":     _h_json_to_html,
    "html-to-json":     _h_html_to_json,
    # YAML ↔ XML / TOML / CSV
    "yaml-to-xml":      _h_yaml_to_xml,
    "xml-to-yaml":      _h_xml_to_yaml,
    "yaml-to-toml":     _h_yaml_to_toml,
    "toml-to-yaml":     _h_toml_to_yaml,
    "yaml-to-csv":      _h_yaml_to_csv,
    "csv-to-yaml":      _h_csv_to_yaml,
    # CSV ↔ TSV / XML / HTML / SQL / Markdown
    "csv-to-tsv":       _h_csv_to_tsv,
    "tsv-to-csv":       _h_tsv_to_csv,
    "csv-to-xml":       _h_csv_to_xml,
    "xml-to-csv":       _h_xml_to_csv,
    "csv-to-html":      _h_csv_to_html,
    "html-to-csv":      _h_html_to_csv,
    "csv-to-sql":       _h_csv_to_sql,
    "csv-to-markdown":  _h_csv_to_markdown,
    "csv-to-md":        _h_csv_to_markdown,
    "markdown-to-csv":  _h_markdown_to_csv,
    "md-to-csv":        _h_markdown_to_csv,
}
