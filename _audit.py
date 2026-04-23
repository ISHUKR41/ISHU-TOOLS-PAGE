import re, os

handlers_found = set()
tools_dir = 'backend/app/tools'
for fname in os.listdir(tools_dir):
    if fname.endswith('.py'):
        with open(os.path.join(tools_dir, fname), 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        for m in re.finditer(r'HANDLERS\s*\[\s*["\x27]([^"\x27]+)["\x27]\s*\]', content):
            handlers_found.add(m.group(1))
        for m in re.finditer(r'["\x27]([a-z0-9][a-z0-9-]+)["\x27]\s*:\s*handle_', content):
            handlers_found.add(m.group(1))

with open('backend/app/registry.py', 'r', encoding='utf-8', errors='ignore') as f:
    reg_content = f.read()

tool_slugs = set()
for m in re.finditer(r'slug=["\x27]([^"\x27]+)["\x27]', reg_content):
    tool_slugs.add(m.group(1))

missing = sorted(tool_slugs - handlers_found)
print(f'Tool slugs in registry: {len(tool_slugs)}')
print(f'Handlers found: {len(handlers_found)}')
print(f'Missing handlers: {len(missing)}')
print('---MISSING---')
for s in missing:
    print(s)
