"""Fix the JSON-escaping test failures by sending proper FormData."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import httpx
import json

BASE = "http://localhost:8000"

# Test json-formatter with proper FormData
payload = json.dumps({"text": '{"name":"ishu","age":20}'})
r = httpx.post(f"{BASE}/api/tools/json-formatter/execute",
               data={"payload": payload}, timeout=10)
print(f"json-formatter: {r.status_code} - {r.json().get('message', '')}")

# Test json-prettify 
payload = json.dumps({"text": '{"name":"ishu","score":95}'})
r = httpx.post(f"{BASE}/api/tools/json-prettify/execute",
               data={"payload": payload}, timeout=10)
print(f"json-prettify: {r.status_code} - {r.json().get('message', '')}")

# Test json-to-yaml
payload = json.dumps({"text": '{"key":"value","num":42}'})
r = httpx.post(f"{BASE}/api/tools/json-to-yaml/execute",
               data={"payload": payload}, timeout=10)
print(f"json-to-yaml: {r.status_code} - {r.json().get('message', '')}")

# Test json-to-csv
payload = json.dumps({"text": '[{"name":"ishu","score":95}]'})
r = httpx.post(f"{BASE}/api/tools/json-to-csv/execute",
               data={"payload": payload}, timeout=10)
print(f"json-to-csv: {r.status_code}")

# Test sql-formatter
payload = json.dumps({"text": "SELECT * FROM users WHERE id=1 AND name='ishu'"})
r = httpx.post(f"{BASE}/api/tools/sql-formatter/execute",
               data={"payload": payload}, timeout=10)
print(f"sql-formatter: {r.status_code} - {r.json().get('message', '')}")
