"""
ISHU TOOLS — Honest Runtime Diagnostic
Hits /api/tools/{slug}/execute for every registered tool with a realistic,
type-aware sample payload, then classifies result as:
  PASS         — handler ran and produced a real file or non-error JSON
  FAIL         — handler returned an error / 500 / timeout
  SKIP_FILE    — input requires a file we can't synthesize sensibly here
  SKIP_NETWORK — tool requires live external network call (we still try)
Outputs JSON report + Markdown summary listing the worst categories first.

Run from repo root:
    python backend/diagnose_tools.py [--limit N] [--filter PATTERN]
"""
from __future__ import annotations

import argparse
import io
import json
import re
import sys
import time
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import httpx

API = "http://localhost:8000"


# ─── Sample payload builder ────────────────────────────────────────────────────
SAMPLE_TEXT = "ISHU TOOLS makes life simpler for Indian students. Free, fast, and reliable."
SAMPLE_LONG_TEXT = (SAMPLE_TEXT + " ") * 20
SAMPLE_JSON = '{"name":"Ishu","tools":1247,"works":true}'
SAMPLE_HTML = "<html><body><h1>Hello</h1><p>Test page</p></body></html>"
SAMPLE_CSS = ".container{padding:1rem;color:#fff;background:#000}"
SAMPLE_JS = "function add(a,b){return a+b}\nconst x = add(2,3);"
SAMPLE_MARKDOWN = "# Title\n\n**bold** and _italic_\n\n- item 1\n- item 2"
SAMPLE_CSV = "name,age\nIshu,22\nAman,25"
SAMPLE_URL_VIDEO = "https://www.youtube.com/watch?v=jNQXAC9IVRw"
SAMPLE_URL_GENERIC = "https://example.com"
SAMPLE_EMAIL = "test@example.com"
SAMPLE_DOMAIN = "example.com"
SAMPLE_IP = "8.8.8.8"
SAMPLE_HEX = "ff5733"
SAMPLE_DATE = "2026-04-23"
SAMPLE_NUMBER = "12345"
SAMPLE_DECIMAL = "3.14159"
SAMPLE_PASSWORD = "ISHU#tool$2026"
SAMPLE_LAT_LNG = "28.6139,77.2090"  # Delhi


def smart_payload(slug: str) -> dict:
    """Build a realistic payload by inspecting the slug."""
    s = slug.lower()
    p: dict = {}

    # ─── URL-based ───
    if any(k in s for k in ("youtube", "yt-", "yt_")):
        p["url"] = SAMPLE_URL_VIDEO
    elif any(k in s for k in ("instagram", "tiktok", "twitter", "x-down", "facebook",
                              "vimeo", "dailymotion", "rumble", "twitch", "bilibili",
                              "pinterest", "reddit", "linkedin", "snapchat",
                              "video-downloader", "audio-extractor", "playlist",
                              "stream-downloader", "video-thumbnail")):
        p["url"] = SAMPLE_URL_VIDEO  # Universal fallback (YT works)
    elif "qr" in s and ("scan" in s or "decode" in s or "read" in s):
        return {"_skip": "needs image"}
    elif "qr" in s or "barcode" in s:
        p["text"] = "https://ishu.tools"
        p["data"] = "https://ishu.tools"
    elif "shorten" in s or "url-short" in s or "tiny" in s:
        p["url"] = "https://ishu.tools/very/long/path/to/shorten"
    elif any(k in s for k in ("whois", "dns", "ip-lookup", "ip-address", "ssl",
                              "ping", "traceroute", "domain-age", "domain-")):
        p["domain"] = SAMPLE_DOMAIN
        p["url"] = "https://example.com"
        p["host"] = SAMPLE_DOMAIN
        p["ip"] = SAMPLE_IP
    elif "lighthouse" in s or "pagespeed" in s or "seo-checker" in s or "meta-tag" in s:
        p["url"] = "https://example.com"

    # ─── Calculator / number-based ───
    if not p:
        if any(k in s for k in ("emi", "loan", "mortgage", "compound-interest", "simple-interest",
                                "sip", "lumpsum", "fd", "rd-calc", "ppf", "nps")):
            p.update({"principal": 100000, "rate": 8.5, "tenure": 5, "amount": 100000,
                      "years": 10, "monthly": 5000, "P": 100000, "R": 8.5, "T": 5, "N": 60})
        elif "gst" in s or "tax" in s or "income-tax" in s:
            p.update({"amount": 1000, "rate": 18, "income": 500000, "regime": "new"})
        elif "bmi" in s or "calorie" in s or "bmr" in s or "tdee" in s or "ideal-weight" in s:
            p.update({"weight": 70, "height": 175, "age": 25, "gender": "male",
                      "activity": "moderate", "unit": "metric"})
        elif "age-calc" in s or "age_calc" in s:
            p.update({"birthdate": "2000-01-15", "date_of_birth": "2000-01-15",
                      "from_date": "2000-01-15", "to_date": SAMPLE_DATE})
        elif "currency" in s and "convert" in s:
            p.update({"amount": 100, "from": "USD", "to": "INR"})
        elif "tip" in s and "calc" in s:
            p.update({"bill": 1000, "tip_percent": 10, "people": 4})
        elif "discount" in s:
            p.update({"price": 1000, "discount": 20})
        elif "percent" in s:
            p.update({"value": 50, "total": 200, "percent": 25})
        elif any(k in s for k in ("triangle", "circle", "square", "rectangle", "cylinder",
                                  "sphere", "cone", "polygon", "trapezoid")):
            p.update({"a": 5, "b": 4, "c": 3, "radius": 5, "side": 4, "length": 5,
                      "width": 3, "height": 4, "base": 5})
        elif "matrix" in s:
            p.update({"matrix_a": [[1, 2], [3, 4]], "matrix_b": [[5, 6], [7, 8]],
                      "matrix": [[1, 2], [3, 4]]})
        elif "equation" in s or "quadratic" in s:
            p.update({"a": 1, "b": -3, "c": 2, "equation": "x^2 - 3x + 2 = 0"})
        elif "fibonacci" in s:
            p.update({"n": 10, "count": 10})
        elif "prime" in s:
            p.update({"number": 17, "n": 17})
        elif "factor" in s:
            p.update({"number": 24, "n": 24})
        elif "lcm" in s or "gcd" in s or "hcf" in s:
            p.update({"a": 12, "b": 18, "numbers": [12, 18, 24]})
        elif "roman" in s:
            p.update({"number": 2026, "roman": "MMXXVI"})
        elif "binary" in s or "hex" in s or "octal" in s or "base-converter" in s or "number-base" in s:
            p.update({"number": "255", "value": "255", "from_base": 10, "to_base": 2,
                      "from": "decimal", "to": "binary"})
        elif "fuel" in s or "mileage" in s:
            p.update({"distance": 100, "fuel": 8, "price": 100, "kmpl": 15})
        elif "stat" in s and "calc" in s:
            p.update({"numbers": [10, 20, 30, 40, 50], "data": "10,20,30,40,50"})

    # ─── Color tools ───
    if not p:
        if "color" in s or "hex" in s or "rgb" in s or "hsl" in s or "palette" in s:
            p.update({"color": f"#{SAMPLE_HEX}", "hex": SAMPLE_HEX,
                      "r": 255, "g": 87, "b": 51, "h": 14, "s": 100, "l": 60})

    # ─── Time / Date tools ───
    if not p:
        if "timer" in s or "stopwatch" in s or "pomodoro" in s or "world-clock" in s:
            p.update({"duration": 60, "minutes": 25, "timezone": "Asia/Kolkata"})
        elif "date" in s or "calendar" in s:
            p.update({"date": SAMPLE_DATE, "from_date": "2026-01-01", "to_date": SAMPLE_DATE})
        elif "epoch" in s or "unix-time" in s or "timestamp" in s:
            p.update({"timestamp": "1700000000", "epoch": "1700000000",
                      "date": SAMPLE_DATE})

    # ─── Crypto / hash / encoding ───
    if not p:
        if any(k in s for k in ("md5", "sha1", "sha256", "sha512", "hash", "checksum")):
            p.update({"text": SAMPLE_TEXT, "input": SAMPLE_TEXT})
        elif "base64" in s and "image" not in s:
            p.update({"text": SAMPLE_TEXT, "input": SAMPLE_TEXT, "encoded": "SGVsbG8="})
        elif "url-encode" in s or "url-decode" in s:
            p.update({"text": "Hello World & friends", "url": "Hello World & friends"})
        elif "html-encode" in s or "html-decode" in s or "html-entit" in s:
            p.update({"text": "<div>Hello & 'world'</div>", "html": "<div>Hello & 'world'</div>"})
        elif "uuid" in s or "guid" in s:
            p.update({"count": 5, "version": 4})
        elif "password" in s and ("gen" in s or "creator" in s or "maker" in s):
            p.update({"length": 16, "uppercase": True, "lowercase": True, "numbers": True,
                      "symbols": True})
        elif "password" in s and ("strength" in s or "checker" in s):
            p.update({"password": SAMPLE_PASSWORD})
        elif "jwt" in s:
            p.update({"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.signature",
                      "payload": '{"sub":"1"}', "secret": "secret", "algorithm": "HS256"})
        elif "regex" in s or "regular-express" in s:
            p.update({"pattern": r"\d+", "regex": r"\d+", "text": "abc 123 def 456",
                      "input": "abc 123 def 456", "flags": "g"})

    # ─── Text tools ───
    if not p:
        if any(k in s for k in ("word-count", "character-count", "char-count", "letter-count",
                                "line-count", "sentence-count", "word-frequency",
                                "reading-time", "speaking-time")):
            p.update({"text": SAMPLE_LONG_TEXT})
        elif any(k in s for k in ("uppercase", "lowercase", "title-case", "sentence-case",
                                  "snake-case", "camel-case", "kebab-case", "pascal-case",
                                  "alternating-case", "inverse-case", "case-converter")):
            p.update({"text": SAMPLE_TEXT})
        elif "lorem" in s or "placeholder-text" in s:
            p.update({"paragraphs": 3, "words": 50, "type": "paragraphs"})
        elif "morse" in s:
            p.update({"text": "SOS", "input": "SOS"})
        elif "pig-latin" in s or "rot13" in s or "cipher" in s:
            p.update({"text": SAMPLE_TEXT, "shift": 3})
        elif "ascii-art" in s or "ansi-art" in s or "banner-text" in s:
            p.update({"text": "HELLO", "font": "standard"})
        elif "reverse-text" in s or "text-reverse" in s:
            p.update({"text": SAMPLE_TEXT})
        elif "remove-duplicate" in s or "deduplicate" in s:
            p.update({"text": "a\nb\na\nc\nb\nd"})
        elif any(k in s for k in ("text", "string", "paraphrase", "summarize", "translate",
                                  "grammar", "spell", "plagiarism", "quote", "headline",
                                  "title-gen", "rewriter")):
            p.update({"text": SAMPLE_TEXT, "input": SAMPLE_TEXT, "content": SAMPLE_TEXT})

    # ─── Code formatters / minifiers ───
    if not p:
        if "json" in s and ("format" in s or "pretty" in s or "validate" in s or "viewer" in s):
            p.update({"json": SAMPLE_JSON, "text": SAMPLE_JSON, "input": SAMPLE_JSON})
        elif "json" in s and ("minif" in s or "compress" in s):
            p.update({"json": '{\n  "a": 1,\n  "b": 2\n}', "text": '{\n  "a": 1\n}'})
        elif "html" in s and ("format" in s or "minif" in s or "beautif" in s):
            p.update({"html": SAMPLE_HTML, "text": SAMPLE_HTML, "input": SAMPLE_HTML})
        elif "css" in s and ("format" in s or "minif" in s or "beautif" in s):
            p.update({"css": SAMPLE_CSS, "text": SAMPLE_CSS, "input": SAMPLE_CSS})
        elif ("js-" in s or "javascript" in s) and ("format" in s or "minif" in s or "beautif" in s):
            p.update({"js": SAMPLE_JS, "javascript": SAMPLE_JS, "code": SAMPLE_JS,
                      "text": SAMPLE_JS, "input": SAMPLE_JS})
        elif "sql" in s and ("format" in s or "beautif" in s):
            p.update({"sql": "select * from users where id=1",
                      "text": "select * from users where id=1"})
        elif "xml" in s and ("format" in s or "minif" in s or "validate" in s):
            p.update({"xml": '<?xml version="1.0"?><root><a>1</a></root>',
                      "text": '<?xml version="1.0"?><root><a>1</a></root>'})
        elif "yaml" in s or "yml" in s:
            p.update({"yaml": "name: ishu\ntools: 1247\n",
                      "text": "name: ishu\ntools: 1247\n"})
        elif "markdown" in s or "md-to" in s:
            p.update({"markdown": SAMPLE_MARKDOWN, "text": SAMPLE_MARKDOWN, "input": SAMPLE_MARKDOWN})
        elif "csv" in s and ("to-json" in s or "json" in s or "convert" in s or "viewer" in s):
            p.update({"csv": SAMPLE_CSV, "text": SAMPLE_CSV, "input": SAMPLE_CSV})

    # ─── Unit converters (area, length, weight, volume, temperature, time, …) ───
    unit_signals = ("converter", "-to-", "convert-")
    unit_categories = ("area", "length", "weight", "volume", "temperature", "temp",
                       "time", "speed", "energy", "power", "pressure", "frequency",
                       "data", "byte", "bit", "angle", "force", "fuel", "torque",
                       "acres", "hectares", "sqft", "sqm", "miles", "km", "feet", "inch",
                       "celsius", "fahrenheit", "kelvin", "kg", "pounds", "lb",
                       "liters", "gallons", "ounces", "grams", "tonnes", "yards")
    if not p and any(k in s for k in unit_signals) and any(c in s for c in unit_categories):
        p.update({"value": 100, "amount": 100, "input": 100, "number": 100,
                  "from": "metric", "to": "imperial"})

    # ─── Date-based tools (age, countdown, date diff, etc.) ───
    if any(k in s for k in ("age-calc", "date-diff", "days-between", "countdown",
                             "convert-time", "date-convert", "exam-countdown", "birthday",
                             "anniversary", "date-add", "date-subtract", "weekday",
                             "leap-year", "time-since", "time-until")):
        p.update({
            "text": "2000-01-15",
            "date": "2000-01-15",
            "dob": "2000-01-15",
            "birth_date": "2000-01-15",
            "date_of_birth": "2000-01-15",
            "date1": "2000-01-15",
            "date2": "2024-12-31",
            "text2": "2024-12-31",
            "from_date": "2000-01-15",
            "to_date": "2024-12-31",
            "exam_date": "2026-05-10",
            "target_date": "2026-12-31",
            "year": 2024,
        })

    # ─── Numeric calculators (BMI, EMI, budget, heart rate, fitness) ───
    if any(k in s for k in ("bmi", "emi", "budget", "heart-rate", "calorie",
                             "loan", "interest", "sip", "fd-calc", "rd-calc",
                             "tax-calc", "salary", "tip-calc", "discount",
                             "goal-calc", "fitness", "macro", "bmr", "tdee",
                             "body-fat", "ideal-weight", "water-intake")):
        p.update({
            "weight": 70, "height": 170, "age": 25, "gender": "male",
            "value": 50000, "amount": 50000, "principal": 100000,
            "rate": 8.5, "tenure": 12, "months": 24, "years": 2,
            "income": 50000, "expenses": 30000, "savings": 5000,
            "current": 75, "goal": 70, "current_weight": 75, "goal_weight": 70,
            "target": 65, "weeks": 12, "tip": 15, "bill": 1000, "people": 4,
            "count": 4, "discount": 20, "price": 1000,
            "from": "USD", "to": "INR",
        })

    # ─── India-specific document validators ───
    if "pan-card" in s or "pan-validator" in s:
        p.update({"pan": "ABCDE1234F", "pan_number": "ABCDE1234F", "text": "ABCDE1234F"})
    elif "gstin" in s or "gst-validator" in s or "gst-number" in s:
        p.update({"gstin": "27AAPFU0939F1ZV", "gst": "27AAPFU0939F1ZV",
                  "text": "27AAPFU0939F1ZV"})
    elif "ifsc" in s:
        p.update({"ifsc": "SBIN0001234", "ifsc_code": "SBIN0001234", "code": "SBIN0001234",
                  "text": "SBIN0001234"})
    elif "aadhaar" in s or "aadhar" in s:
        p.update({"aadhaar": "234567890123", "aadhar": "234567890123",
                  "number": "234567890123", "text": "234567890123"})
    elif "voter" in s and "id" in s:
        p.update({"voter_id": "ABC1234567", "text": "ABC1234567"})
    elif "vehicle" in s and ("number" in s or "registration" in s):
        p.update({"vehicle": "MH12AB1234", "number": "MH12AB1234", "text": "MH12AB1234"})

    # ─── Specific input-format tools ───
    if not p or all(isinstance(v, str) and v == SAMPLE_TEXT for v in p.values()):
        if "morse-to-" in s:
            p.update({"morse": ".... . .-.. .-.. ---", "text": ".... . .-.. .-.. ---",
                      "input": ".... . .-.. .-.. ---"})
        elif "octal-to-" in s:
            p.update({"octal": "110 145 154 154 157", "text": "110 145 154 154 157",
                      "input": "110 145 154 154 157"})
        elif "hex-to-rgb" in s or "hex-to-hsl" in s or "hex-to-color" in s:
            p.update({"hex": "ff5733", "color": "#ff5733", "text": "ff5733"})
        elif "rgb-to-" in s:
            p.update({"rgb": "rgb(255,87,51)", "r": 255, "g": 87, "b": 51,
                      "color": "rgb(255,87,51)", "text": "rgb(255,87,51)"})
        elif "find-replace" in s or "find-and-replace" in s:
            p.update({"text": "Hello Hub friends Hub", "find": "Hub", "replace": "World",
                      "search": "Hub", "replacement": "World"})
        elif "json-" in s or s.startswith("json"):
            p.update({"json": SAMPLE_JSON, "text": SAMPLE_JSON, "input": SAMPLE_JSON,
                      "json1": SAMPLE_JSON, "json2": '{"name":"Aman","tools":1247}',
                      "json_a": SAMPLE_JSON, "json_b": '{"name":"Aman"}',
                      "data": SAMPLE_JSON})
        elif "html-to-csv" in s or "html-to-json" in s or "html-table-to" in s:
            p.update({"html": "<table><tr><th>Name</th><th>Age</th></tr><tr><td>Ishu</td><td>22</td></tr></table>",
                      "text": "<table><tr><th>A</th></tr><tr><td>1</td></tr></table>"})
        elif "markdown-to-csv" in s or "md-to-csv" in s:
            p.update({"markdown": "| Name | Age |\n|------|-----|\n| Ishu | 22 |\n",
                      "text": "| A | B |\n|---|---|\n| 1 | 2 |\n"})
        elif "epoch" in s or "unix-time" in s or "timestamp" in s:
            p.update({"epoch": 1700000000, "timestamp": 1700000000, "unix": 1700000000,
                      "value": 1700000000, "text": "1700000000", "input": "1700000000"})
        elif "cidr" in s:
            p.update({"cidr": "192.168.1.0/24", "ip": "192.168.1.0/24",
                      "text": "192.168.1.0/24", "input": "192.168.1.0/24"})
        elif "molecular-weight" in s or "molecular-mass" in s:
            p.update({"formula": "H2O", "molecule": "H2O", "text": "H2O", "input": "H2O"})
        elif "element-lookup" in s or "periodic" in s:
            p.update({"element": "Fe", "symbol": "Fe", "name": "Iron", "text": "Fe"})
        elif "cron" in s:
            p.update({"expression": "0 9 * * *", "cron": "0 9 * * *", "text": "0 9 * * *",
                      "input": "0 9 * * *"})
        elif "email-validator" in s or "email-checker" in s or "email-verif" in s:
            p.update({"email": SAMPLE_EMAIL, "text": SAMPLE_EMAIL, "input": SAMPLE_EMAIL})
        elif "url-cleaner" in s or "clean-url" in s or "citation-url" in s:
            p.update({"urls": "https://example.com/page?utm_source=x\nhttps://example.com",
                      "text": "https://example.com/page?utm_source=x",
                      "url": "https://example.com/page?utm_source=x"})
        elif "hmac" in s:
            p.update({"text": SAMPLE_TEXT, "secret": "secret", "secret_key": "secret",
                      "key": "secret", "algorithm": "sha256"})
        elif "fitness-goal" in s or "weight-goal" in s:
            p.update({"current": 75, "goal": 70, "current_weight": 75, "goal_weight": 70,
                      "weeks": 12, "weight": 75})
        elif "gpa" in s or "cgpa" in s:
            p.update({"grades": [{"grade": 8.5, "credits": 3}, {"grade": 9.0, "credits": 4}],
                      "subjects": [{"grade": 8.5, "credits": 3}],
                      "text": '[{"grade":8.5,"credits":3},{"grade":9,"credits":4}]'})
        elif "flashcard" in s:
            p.update({"text": (SAMPLE_TEXT + " ") * 5, "input": (SAMPLE_TEXT + " ") * 5,
                      "content": (SAMPLE_TEXT + " ") * 5, "count": 5})
        elif "dice-roll" in s or "roll-dice" in s:
            p.update({"dice": "2d6", "count": 2, "sides": 6, "rolls": 2,
                      "text": "2d6", "input": "2d6"})
        elif "create-workflow" in s or "workflow" in s:
            p.update({"steps": "step 1\nstep 2\nstep 3", "text": "step 1, step 2, step 3"})
        elif "debt-payoff" in s:
            p.update({"debts": "Credit Card,5000,18,500\nCar Loan,15000,8,400",
                      "text": "Credit Card,5000,18,500"})
        elif "csv-column" in s:
            p.update({"csv": SAMPLE_CSV, "columns": "name", "indexes": "1",
                      "text": SAMPLE_CSV})
        elif "fancy-text" in s or "stylish-text" in s:
            p.update({"text": "Hello", "input": "Hello", "value": "Hello"})

    # ─── Specific calculators by slug pattern ───
    if not p or all(isinstance(v, str) for v in p.values()):
        if "attendance" in s:
            p.update({"total_classes": 100, "attended": 75, "total": 100,
                      "present": 75, "required": 75})
        elif "aspect-ratio" in s:
            p.update({"width": 1920, "height": 1080, "w": 1920, "h": 1080})
        elif "average" in s and ("calc" in s or "mean" in s):
            p.update({"numbers": [10, 20, 30, 40, 50], "values": [10, 20, 30, 40, 50],
                      "data": "10,20,30,40,50", "input": "10,20,30,40,50"})
        elif "ascii-to-text" in s or "ascii-to-string" in s:
            p.update({"text": "72 105 32 73 115 104 117", "input": "72 105 32 73 115 104 117",
                      "ascii": "72 105 32 73 115 104 117"})
        elif "binary-to-" in s:
            p.update({"text": "01001000 01101001", "input": "01001000 01101001",
                      "binary": "01001000 01101001", "number": "11111111", "value": "11111111"})
        elif "hex-to-text" in s or "hex-to-string" in s:
            p.update({"text": "48 69 6c 6c 6f", "input": "48 65 6c 6c 6f",
                      "hex": "48 65 6c 6c 6f"})

    # ─── Generic conversion catch-all ───
    if not p:
        if re.search(r"(\w+)-to-(\w+)", s) or "converter" in s:
            p.update({"value": 100, "amount": 100, "input": "100", "text": "100",
                      "number": 100})

    # ─── Generic numeric / generator catch-all ───
    if not p:
        if any(k in s for k in ("generator", "gen-", "create-", "maker", "builder")):
            p.update({"text": SAMPLE_TEXT, "count": 5, "length": 10})

    # ─── Universal file-format conversion (e.g. bmp-to-png, avi-to-mp4, cbr-to-pdf) ───
    FILE_EXTS = ("jpg", "jpeg", "png", "gif", "bmp", "tiff", "tif", "webp", "ico", "svg",
                 "heic", "avif", "raw", "psd", "ai", "eps", "cr2", "nef", "arw",
                 "mp4", "avi", "mov", "wmv", "flv", "mkv", "webm", "m4v", "mpg", "mpeg",
                 "3gp", "ogv", "ts", "vob",
                 "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp",
                 "txt", "rtf", "epub", "mobi", "azw", "azw3", "fb2", "lit", "djvu",
                 "cbr", "cbz", "chm", "lrf", "pdb",
                 "zip", "rar", "7z", "tar", "gz", "bz2", "xz")
    m_fmt = re.match(r"^([a-z0-9]+)-to-([a-z0-9]+)$", s)
    if m_fmt and (m_fmt.group(1) in FILE_EXTS or m_fmt.group(2) in FILE_EXTS):
        return {"_skip": "file_format_conversion"}

    # ─── File-required tools (skip) ───
    # Audio tools — almost all need an uploaded file
    if any(k in s for k in ("audio-", "-to-mp3", "-to-wav", "-to-aac", "-to-flac",
                            "-to-ogg", "-to-m4a", "-to-opus", "mp3-to-", "wav-to-",
                            "aac-to-", "flac-to-", "ogg-to-", "m4a-to-", "opus-to-",
                            "audio-merger", "audio-trimmer", "audio-converter",
                            "audio-compressor", "audio-equalizer", "audio-normalizer",
                            "audio-fader", "audio-fade", "audio-reverser",
                            "audio-pitch", "audio-speed", "audio-volume",
                            "audio-loop", "audio-cut", "audio-split", "audio-join",
                            "audio-mix", "voice-changer", "noise-remov", "vocal-remov",
                            "karaoke")):
        return {"_skip": "audio_file_required"}
    file_required_signals = ("pdf", "image", "photo", "video-edit", "ocr",
                             "compress-image", "convert-image", "remove-bg", "background-remov",
                             "resize", "crop", "rotate", "watermark", "merge-pdf", "split-pdf",
                             "extract-pdf", "edit-pdf", "epub", "docx", "doc-to-",
                             "pptx", "xlsx", "scan-document", "icon-resizer",
                             "favicon", "screenshot-to", "thumbnail-from", "exif",
                             "add-text", "add-image", "add-page-numbers", "add-border",
                             "ai-to-", "eps-to-", "psd-to-", "tiff-to-", "raw-to-",
                             "image-to-text", "speech-to-text", "video-to-")
    if not p and any(k in s for k in file_required_signals):
        return {"_skip": "file_required"}

    # ─── Final fallback ───
    if not p:
        p = {"text": SAMPLE_TEXT, "input": SAMPLE_TEXT, "value": SAMPLE_TEXT}
    return p


# ─── Result classifier ────────────────────────────────────────────────────────
def classify(slug: str, status_code: int, content_type: str, body: bytes) -> tuple[str, str]:
    """Return (status, reason). status ∈ PASS/FAIL/SKIP/UNKNOWN."""
    if status_code == 404:
        return "FAIL", f"slug not registered (404)"
    if status_code >= 500:
        snippet = body[:200].decode("utf-8", "replace")
        return "FAIL", f"5xx server error: {snippet}"
    if status_code != 200:
        snippet = body[:300].decode("utf-8", "replace").lower()
        # File-input requirement = legitimate validation, not a broken handler
        if any(k in snippet for k in ("requires at least", "no file", "upload",
                                     "file is required", "no files provided",
                                     "file(s)")):
            return "SKIP", f"file required ({status_code})"
        return "FAIL", f"HTTP {status_code}: {body[:200].decode('utf-8', 'replace')}"

    # Real file output (binary download)
    if not content_type.startswith("application/json") and not content_type.startswith("text/"):
        return "PASS", f"file:{content_type} ({len(body):,}B)"
    if content_type.startswith(("image/", "video/", "audio/", "application/pdf",
                                "application/zip", "application/octet-stream")):
        return "PASS", f"file:{content_type} ({len(body):,}B)"

    # JSON response — inspect for error markers
    try:
        j = json.loads(body)
    except Exception:
        snippet = body[:120].decode("utf-8", "replace")
        return "PASS", f"text/plain ({len(body)}B): {snippet[:80]}"

    if not isinstance(j, dict):
        return "PASS", "json (non-dict)"

    msg = (j.get("message") or "").strip()
    data = j.get("data") if isinstance(j.get("data"), dict) else {}
    error_field = data.get("error") or j.get("error")

    # Detect error-as-success pattern (handler returned kind=json with error key but API marks status=success)
    msg_lower = msg.lower()
    error_signals_in_msg = any(s in msg_lower for s in (
        "error", "failed", "could not", "cannot", "unable", "please paste",
        "please enter", "please upload", "invalid", "required", "missing",
        "not supported", "not available", "blocked", "no url",
    ))
    if error_field or error_signals_in_msg:
        # If error mentions missing input (we couldn't synthesize), it's a SKIP, not FAIL
        if any(k in msg_lower for k in ("please upload", "please paste", "please enter",
                                        "no file", "no url", "no input", "required")):
            return "SKIP", f"input mismatch: {msg[:120]}"
        return "FAIL", f"handler error: {msg[:160]}"

    # Genuine success
    return "PASS", f"json ok: {msg[:100] or '(no msg)'}"


# ─── Main ────────────────────────────────────────────────────────────────────
def run_one(client: httpx.Client, slug: str) -> dict:
    payload = smart_payload(slug)
    if payload.get("_skip"):
        return {"slug": slug, "status": "SKIP", "reason": payload["_skip"], "ms": 0}
    t0 = time.time()
    try:
        r = client.post(
            f"{API}/api/tools/{slug}/execute",
            files={"payload": (None, json.dumps(payload))},
            timeout=20,
        )
        elapsed = int((time.time() - t0) * 1000)
        status, reason = classify(slug, r.status_code, r.headers.get("content-type", ""), r.content)
        return {"slug": slug, "status": status, "reason": reason, "ms": elapsed}
    except httpx.TimeoutException:
        return {"slug": slug, "status": "FAIL", "reason": "timeout (>20s)",
                "ms": int((time.time() - t0) * 1000)}
    except Exception as e:
        return {"slug": slug, "status": "FAIL", "reason": f"exception: {e}",
                "ms": int((time.time() - t0) * 1000)}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0, help="Test only first N tools")
    parser.add_argument("--filter", default="", help="Substring filter on slug")
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--out", default="backend/diagnostic_report.json")
    args = parser.parse_args()

    print(f"Fetching tool list from {API}/api/tools …")
    with httpx.Client(timeout=30) as c:
        r = c.get(f"{API}/api/tools")
        r.raise_for_status()
        tools_data = r.json()
        # Backend can return list or {tools:[...]}
        tools_list = tools_data if isinstance(tools_data, list) else tools_data.get("tools", [])
        slugs = [t["slug"] for t in tools_list if isinstance(t, dict) and t.get("slug")]
        # Add category mapping for grouping
        slug_to_cat = {t["slug"]: t.get("category", "uncategorized")
                       for t in tools_list if isinstance(t, dict)}

    if args.filter:
        slugs = [s for s in slugs if args.filter in s]
    if args.limit:
        slugs = slugs[:args.limit]

    print(f"Diagnosing {len(slugs)} tools with {args.workers} workers …")
    results: list[dict] = []
    with httpx.Client(timeout=30) as client:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futs = {pool.submit(run_one, client, s): s for s in slugs}
            done = 0
            for fut in as_completed(futs):
                results.append(fut.result())
                done += 1
                if done % 50 == 0 or done == len(slugs):
                    print(f"  {done}/{len(slugs)} done …", flush=True)

    # ─── Report ───
    counts = Counter(r["status"] for r in results)
    by_cat = defaultdict(lambda: Counter())
    for r in results:
        by_cat[slug_to_cat.get(r["slug"], "uncategorized")][r["status"]] += 1

    failed = [r for r in results if r["status"] == "FAIL"]
    skipped = [r for r in results if r["status"] == "SKIP"]
    failed.sort(key=lambda r: r["slug"])

    out = {
        "summary": {
            "total": len(results),
            "pass": counts.get("PASS", 0),
            "fail": counts.get("FAIL", 0),
            "skip": counts.get("SKIP", 0),
        },
        "by_category": {cat: dict(c) for cat, c in sorted(by_cat.items())},
        "failures": failed,
        "skipped_count_by_reason": Counter(r["reason"][:30] for r in skipped).most_common(10),
        "results": results,
    }
    Path(args.out).write_text(json.dumps(out, indent=2))
    print(f"\nReport written → {args.out}")
    print(f"\n=== HONEST RESULT ===")
    print(f"  Total: {len(results)}")
    print(f"  ✅ PASS: {counts.get('PASS', 0)} ({100*counts.get('PASS',0)//max(1,len(results))}%)")
    print(f"  ❌ FAIL: {counts.get('FAIL', 0)} ({100*counts.get('FAIL',0)//max(1,len(results))}%)")
    print(f"  ⊘ SKIP: {counts.get('SKIP', 0)} (couldn't synthesize input)")
    print(f"\n=== TOP 10 BROKEN CATEGORIES ===")
    cat_fail = sorted(by_cat.items(), key=lambda kv: -kv[1].get("FAIL", 0))[:10]
    for cat, c in cat_fail:
        if c.get("FAIL", 0):
            print(f"  {cat:30s} FAIL={c.get('FAIL',0):3d}  PASS={c.get('PASS',0):3d}  SKIP={c.get('SKIP',0):3d}")
    print(f"\n=== FIRST 30 FAILURES (real, not pretend) ===")
    for r in failed[:30]:
        print(f"  ❌ {r['slug']:40s} → {r['reason'][:100]}")


if __name__ == "__main__":
    main()
