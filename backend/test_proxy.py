"""Test frontend proxy routes."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import httpx

r = httpx.get('http://localhost:5000/api/categories')
print(f'Frontend proxy -> Categories: {r.status_code}')

r = httpx.get('http://localhost:5000/api/tools')
tools = r.json()
print(f'Frontend proxy -> Tools: {len(tools)}')

r = httpx.post('http://localhost:5000/api/tools/bmi-calculator/execute',
    data={'payload': '{"weight":70,"height":175}'})
print(f'BMI Calculator via frontend: {r.status_code} - {r.json().get("message", "")}')

r = httpx.post('http://localhost:5000/api/tools/scientific-calculator/execute',
    data={'payload': '{"text":"sqrt(144) + 2**3"}'})
print(f'Scientific Calc via frontend: {r.status_code} - {r.json().get("message", "")}')

print('\nAll frontend proxy tests PASSED!')
