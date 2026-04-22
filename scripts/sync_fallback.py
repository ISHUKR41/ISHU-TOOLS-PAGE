"""
Sync backend registry → frontend catalogFallback.ts

Reads CATEGORIES and TOOLS from the backend Python registry and writes
the complete TypeScript fallback file so the frontend shows ALL tools
even when the API is unreachable (e.g. on Vercel cold-start or no backend).

Usage:
    python scripts/sync_fallback.py
"""

import sys
import os
import json

# Add project root so we can import backend.app.registry
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from backend.app.registry import CATEGORIES, TOOLS

# Build JSON-serializable dicts
categories_json = []
for cat in CATEGORIES:
    categories_json.append({
        "id": cat.id,
        "label": cat.label,
        "description": cat.description,
    })

tools_json = []
for tool in TOOLS:
    entry = {
        "slug": tool.slug,
        "title": tool.title,
        "description": tool.description,
        "category": tool.category,
        "tags": list(tool.tags),
        "input_kind": tool.input_kind,
        "accepts_multiple": tool.accepts_multiple,
    }
    tools_json.append(entry)

# Generate TypeScript file
output_path = os.path.join(ROOT, "frontend", "src", "data", "catalogFallback.ts")

lines = []
lines.append("import type { ToolCategory, ToolDefinition } from '../types/tools'")
lines.append("")
lines.append("export const FALLBACK_CATEGORIES: ToolCategory[] = " + json.dumps(categories_json, indent=2, ensure_ascii=False))
lines.append("")
lines.append("export const FALLBACK_TOOLS: ToolDefinition[] = " + json.dumps(tools_json, indent=2, ensure_ascii=False))
lines.append("")

content = "\n".join(lines)

with open(output_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Synced {len(categories_json)} categories and {len(tools_json)} tools -> {output_path}")
