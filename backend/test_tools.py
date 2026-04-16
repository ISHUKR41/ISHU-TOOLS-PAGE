"""Quick test script for ISHU TOOLS backend."""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import httpx
import json

BASE = "http://localhost:8000"

def test_tool(slug, payload):
    r = httpx.post(f"{BASE}/api/tools/{slug}/execute", data={"payload": json.dumps(payload)})
    if r.status_code == 200:
        data = r.json()
        msg = data.get("message", "")
        result = data.get("data", {}).get("result", "")
        print(f"  PASS  {slug}: {msg}")
        if result:
            print(f"        Result: {str(result)[:100]}")
    else:
        print(f"  FAIL  {slug}: HTTP {r.status_code}")
        try:
            print(f"        Detail: {r.json().get('detail', '')}")
        except Exception:
            pass

print("=" * 60)
print("ISHU TOOLS - Backend Test Suite")
print("=" * 60)

# Count tools
r = httpx.get(f"{BASE}/api/tools")
tools = r.json()
print(f"\nTotal tools in API: {len(tools)}")

r = httpx.get(f"{BASE}/api/categories")
cats = r.json()
print(f"Total categories: {len(cats)}")

# Test Developer Tools
print("\n--- Developer Tools ---")
test_tool("json-formatter", {"text": '{"name":"ishu","age":20}'})
test_tool("base64-encode", {"text": "Hello ISHU TOOLS!"})
test_tool("base64-decode", {"text": "SGVsbG8gSVNIVSBUT09MUyE="})
test_tool("url-encode", {"text": "hello world & test"})
test_tool("url-decode", {"text": "hello%20world%20%26%20test"})
test_tool("jwt-decode", {"text": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"})

# Test Color Tools
print("\n--- Color Tools ---")
test_tool("hex-to-rgb", {"text": "#ff5733"})
test_tool("rgb-to-hex", {"text": "255 87 51"})
test_tool("color-palette-generator", {"text": "#3b82f6"})

# Test Unit Converters
print("\n--- Unit Converters ---")
test_tool("length-converter", {"value": 100, "from_unit": "cm", "to_unit": "in"})
test_tool("weight-converter", {"value": 1, "from_unit": "kg", "to_unit": "lb"})
test_tool("temperature-converter", {"value": 100, "from_unit": "celsius", "to_unit": "fahrenheit"})

# Test Hash & Crypto
print("\n--- Hash & Crypto ---")
test_tool("md5-hash", {"text": "hello world"})
test_tool("sha256-hash", {"text": "test"})
test_tool("uuid-generator", {"count": 3})
test_tool("password-generator", {"length": 16, "count": 3})

# Test Math & Calculators
print("\n--- Math & Calculators ---")
test_tool("percentage-calculator", {"value": 25, "total": 200})
test_tool("bmi-calculator", {"weight": 70, "height": 175})
test_tool("age-calculator", {"text": "2000-01-15"})
test_tool("discount-calculator", {"value": 1000, "total": 20})
test_tool("loan-emi-calculator", {"value": 500000, "total": 8.5, "months": 60})
test_tool("gpa-calculator", {"text": "A 3\nB+ 4\nA- 3\nB 2"})
test_tool("tip-calculator", {"value": 500, "total": 15, "count": 3})

# Test Student Tools
print("\n--- Student Tools ---")
test_tool("text-to-binary", {"text": "ISHU"})
test_tool("binary-to-text", {"text": "01001001 01010011 01001000 01010101"})
test_tool("morse-code", {"text": "HELLO"})
test_tool("roman-numeral-converter", {"text": "2024"})
test_tool("number-base-converter", {"text": "255", "from_base": "decimal"})
test_tool("coin-flip", {"count": 5})
test_tool("dice-roller", {"value": 6, "count": 3})
test_tool("scientific-calculator", {"text": "sqrt(144) + 2**3"})

# Test SEO Tools
print("\n--- SEO Tools ---")
test_tool("character-counter", {"text": "Hello World! This is a test sentence for counting."})
test_tool("readability-score", {"text": "The quick brown fox jumps over the lazy dog. Simple sentences are easy to read. Complex compound sentences with multiple clauses tend to be harder."})

# Test Code Tools
print("\n--- Code Tools ---")
test_tool("minify-css", {"text": "body {\n  color: red;\n  background: blue;\n}"})
test_tool("markdown-to-html", {"text": "# Hello\n\nThis is **bold** and *italic*."})

# Extended Finance
print("\n--- Extended Finance ---")
test_tool("compound-interest-calculator", {"value": 100000, "total": 10, "years": 5})
test_tool("simple-interest-calculator", {"value": 50000, "total": 8, "years": 3})
test_tool("profit-loss-calculator", {"value": 100, "total": 150})
test_tool("cgpa-to-percentage", {"value": 8.5})

# Text Statistics
print("\n--- Text Transformation ---")
test_tool("text-statistics", {"text": "Hello world! This is ISHU TOOLS. We have over 300 tools for students and professionals."})
test_tool("case-converter-advanced", {"text": "hello world example", "mode": "camelCase"})
test_tool("password-strength-checker", {"text": "MyStr0ng!Pass#2024"})
test_tool("text-to-hex", {"text": "ISHU"})
test_tool("number-to-words", {"text": "1234567"})

print("\n" + "=" * 60)
print("Test suite complete!")
print("=" * 60)
