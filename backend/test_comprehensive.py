"""
Comprehensive test — test 80+ tools for production readiness.
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import httpx

BASE = "http://localhost:8000"
passed = 0
failed = 0

def test(slug, payload, expect_status=200, label=None):
    global passed, failed
    try:
        r = httpx.post(f"{BASE}/api/tools/{slug}/execute",
                       data={"payload": str(payload).replace("'", '"')},
                       timeout=15)
        if r.status_code == expect_status:
            passed += 1
            msg = ""
            try:
                msg = r.json().get("message", "")[:60]
            except:
                msg = f"file ({len(r.content)} bytes)"
            print(f"  PASS  {label or slug}: {msg}")
        else:
            failed += 1
            detail = ""
            try:
                detail = r.json().get("detail", "")[:80]
            except:
                detail = r.text[:80]
            print(f"  FAIL  {label or slug}: {r.status_code} — {detail}")
    except Exception as e:
        failed += 1
        print(f"  FAIL  {label or slug}: {e}")

print("=" * 60)
print("ISHU TOOLS — Comprehensive Production Test")
print("=" * 60)

# Get total tools
r = httpx.get(f"{BASE}/api/tools")
tools = r.json()
print(f"\nTotal registered tools: {len(tools)}")

# -- Developer Tools --
print("\n--- Developer Tools ---")
test("json-formatter", {"text": '{"name":"ishu"}'})
test("xml-formatter", {"text": "<root><name>ishu</name></root>"})
test("base64-encode", {"text": "Hello ISHU!"})
test("base64-decode", {"text": "SGVsbG8gSVNIVSE="})
test("url-encode", {"text": "hello world & test"})
test("url-decode", {"text": "hello%20world%20%26%20test"})
test("html-encode", {"text": "<h1>Hello</h1>"})
test("html-decode", {"text": "&lt;h1&gt;Hello&lt;/h1&gt;"})
test("jwt-decode", {"text": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"})
test("regex-tester", {"pattern": "\\d+", "text": "abc 123 def 456", "flags": "g"})
test("unix-timestamp", {"text": "1700000000"})
test("json-to-yaml", {"text": '{"key":"value","num":42}'})
test("yaml-to-json", {"text": "key: value\nnum: 42"})

# -- Color Tools --
print("\n--- Color Tools ---")
test("hex-to-rgb", {"text": "#3b82f6"})
test("rgb-to-hex", {"text": "59, 130, 246"})
test("rgb-to-hsl", {"text": "59, 130, 246"})
test("color-palette-generator", {"text": "#3b82f6"})
test("gradient-generator", {"color1": "#3b82f6", "color2": "#8b5cf6", "angle": "135"})
test("color-contrast-checker", {"text": "#000000", "background": "#ffffff"})

# -- Unit Converters --
print("\n--- Unit Converters ---")
test("length-converter", {"value": "100", "from_unit": "cm", "to_unit": "in"})
test("weight-converter", {"value": "1", "from_unit": "kg", "to_unit": "lb"})
test("temperature-converter", {"value": "100", "from_unit": "c", "to_unit": "f"})
test("data-size-converter", {"value": "1", "from_unit": "gb", "to_unit": "mb"})
test("speed-converter", {"value": "100", "from_unit": "kmh", "to_unit": "mph"})
test("area-converter", {"value": "1", "from_unit": "sqm", "to_unit": "sqft"})

# -- Hash & Crypto --
print("\n--- Hash & Crypto ---")
test("md5-hash", {"text": "hello world"})
test("sha256-hash", {"text": "test"})
test("sha512-hash", {"text": "test"})
test("uuid-generator", {"count": "3"})
test("password-generator", {"length": "16", "count": "3"})
test("lorem-ipsum-generator", {"paragraphs": "2"})
test("bcrypt-hash", {"text": "password123"})

# -- Math & Calculators --
print("\n--- Math & Calculators ---")
test("percentage-calculator", {"value": "25", "total": "200", "mode": "percentage"})
test("bmi-calculator", {"weight": "70", "height": "175"})
test("age-calculator", {"text": "2000-01-15"})
test("discount-calculator", {"value": "1000", "total": "20"})
test("loan-emi-calculator", {"value": "500000", "total": "8.5", "months": "60"})
test("tip-calculator", {"value": "500", "total": "15", "count": "3"})
test("gpa-calculator", {"text": "A 3\nB+ 4\nA- 3"})
test("average-calculator", {"text": "85, 90, 78, 92"})

# -- SEO Tools --
print("\n--- SEO Tools ---")
test("meta-tag-generator", {"text": "ISHU TOOLS", "description": "Free online tools", "keywords": "pdf, tools", "author": "Ishu"})
test("keyword-density", {"text": "ISHU TOOLS is the best tools platform. ISHU TOOLS provides free PDF tools."})
test("readability-score", {"text": "This is a simple sentence. It is easy to read. Short sentences work best."})
test("character-counter", {"text": "Hello World! This is ISHU TOOLS."})
test("open-graph-generator", {"text": "ISHU TOOLS", "description": "Free tools", "url": "https://ishutools.com"})

# -- Code Tools --
print("\n--- Code Tools ---")
test("minify-css", {"text": "body { color: red; background: blue; }"})
test("minify-js", {"text": "function hello() { return 1; }"})
test("minify-html", {"text": "<div>  <p>Hello</p>  </div>"})
test("prettify-css", {"text": "body{color:red;background:blue}"})
test("sql-formatter", {"text": "SELECT * FROM users WHERE id=1 AND name='ishu'"})
test("markdown-to-html", {"text": "# Hello\n**Bold** text"})
test("html-to-markdown", {"text": "<h1>Hello</h1><p><b>Bold</b></p>"})
test("diff-checker", {"text": "hello world", "text2": "hello ishu"})

# -- Student & Everyday --
print("\n--- Student & Everyday ---")
test("compound-interest-calculator", {"value": "100000", "total": "10", "years": "5", "compound_per_year": "12"})
test("simple-interest-calculator", {"value": "50000", "total": "8", "years": "3"})
test("salary-calculator", {"value": "1200000"})
test("fuel-cost-calculator", {"value": "500", "total": "15", "price": "100"})
test("electricity-bill-calculator", {"value": "300", "total": "7"})
test("speed-distance-time", {"value": "100", "total": "2", "mode": "speed"})
test("profit-loss-calculator", {"value": "100", "total": "150"})
test("cgpa-to-percentage", {"value": "8.5", "mode": "cgpa_to_pct"})
test("date-difference", {"text": "2000-01-15", "text2": "2025-01-15"})
test("time-zone-converter", {"text": "14:30", "from_tz": "IST", "to_tz": "UTC"})
test("password-strength-checker", {"text": "MyStr0ng!Pass#2025"})
test("text-to-hex", {"text": "ISHU"})
test("hex-to-text", {"text": "49 53 48 55"})
test("text-to-unicode", {"text": "ISHU"})
test("unicode-to-text", {"text": "\\u0049\\u0053\\u0048\\u0055"})
test("string-hash-generator", {"text": "hello"})
test("text-statistics", {"text": "Hello world. This is a test. ISHU TOOLS is great."})
test("case-converter-advanced", {"text": "hello world example", "mode": "camelCase"})
test("coin-flip", {"count": "5"})
test("dice-roller", {"value": "6", "count": "3"})
test("stopwatch-calculator", {"text": "3661"})
test("scientific-calculator", {"text": "sqrt(144) + 2**3"})
test("unit-price-calculator", {"value": "250", "total": "5", "unit": "kg"})
test("number-to-words", {"text": "1234567"})

# -- Text Tools --
print("\n--- Text Tools ---")
test("text-reverse", {"text": "Hello World"})
test("text-to-binary", {"text": "ISHU"})
test("binary-to-text", {"text": "01001001 01010011 01001000 01010101"})
test("morse-code", {"text": "HELLO", "mode": "encode"})
test("roman-numeral-converter", {"text": "2024"})
test("number-base-converter", {"text": "255", "from_base": "decimal"})
test("text-to-ascii", {"text": "ABC"})
test("ascii-to-text", {"text": "65 66 67"})
test("word-frequency", {"text": "hello hello world world world"})
test("countdown-calculator", {"text": "2025-12-31"})
test("random-number-generator", {"value": "1", "total": "100", "count": "5"})
test("summarize-text", {"text": "This is a long text about ISHU TOOLS. ISHU TOOLS provides many free tools for students. Students use these tools daily for PDF conversion, image editing, and calculations."})
test("word-count-text", {"text": "Hello world this is a test"})
test("case-converter-text", {"text": "hello world", "mode": "upper"})
test("slug-generator-text", {"text": "Hello World Example Page"})
test("sort-lines-text", {"text": "banana\napple\ncherry", "direction": "asc"})
test("remove-extra-spaces-text", {"text": "hello    world    test"})
test("deduplicate-lines-text", {"text": "hello\nworld\nhello\ntest\nworld"})
test("find-replace-text", {"text": "hello world hello", "find": "hello", "replace": "ISHU"})
test("reading-time-text", {"text": "This is a long text. " * 50, "wpm": "200"})

# -- Encoding/Format Tools --
print("\n--- Encoding & Format ---")
test("json-prettify", {"text": '{"name":"ishu","score":95}'})
test("csv-to-json", {"text": "name,score\nishu,95"})
test("json-to-csv", {"text": '[{"name":"ishu","score":95}]'})
test("qr-code-generator", {"text": "https://ishutools.com"})

print("\n" + "=" * 60)
print(f"RESULTS: {passed} PASSED / {failed} FAILED / {passed + failed} TOTAL")
print("=" * 60)
