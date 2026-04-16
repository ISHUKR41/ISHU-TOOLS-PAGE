import re

with open(r'backend\app\registry.py', 'r', encoding='utf-8') as f:
    content = f.read()

slugs = sorted(set(re.findall(r'slug="([^"]+)"', content)))
print(len(slugs))
for s in slugs:
    print(s)
