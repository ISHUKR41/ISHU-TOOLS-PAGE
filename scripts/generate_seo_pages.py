from __future__ import annotations

import html
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.app.registry import CATEGORIES, TOOLS

BASE_URL = "https://ishutools.com"
DIST_DIR = Path("frontend/dist")
INDEX_FILE = DIST_DIR / "index.html"
TODAY = date.today().isoformat()


def unique_by(items, key):
    seen = set()
    result = []
    for item in items:
        value = key(item)
        if value in seen:
            continue
        seen.add(value)
        result.append(item)
    return result


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def clean_words(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def category_label(category_id: str) -> str:
    for category in CATEGORIES:
        if category.id == category_id:
            return category.label
    return category_id.replace("-", " ").title()


def tool_keywords(tool) -> list[str]:
    title = clean_words(tool.title)
    slug = tool.slug.replace("-", " ")
    category = clean_words(category_label(tool.category))
    keywords = [
        title,
        f"free {title}",
        f"{title} online",
        f"{title} online free",
        f"best {title}",
        f"{title} no signup",
        f"{title} no watermark",
        f"{title} for students",
        f"{title} for mobile",
        f"{title} high accuracy",
        f"ishu {title}",
        f"ishu tools {title}",
        f"ishutools {title}",
        f"indian student hub {title}",
        slug,
        category,
        f"free {category}",
        "ishu tools",
        "indian student hub university tools",
        "ishu kumar tools",
        "free online tools",
        "student tools online",
    ]
    keywords.extend(tool.tags)
    if "pdf" in slug:
        keywords.extend([f"{title} pdf tool", f"free pdf tool by ishu", "ilovepdf alternative", "pdfcandy alternative"])
    if any(token in slug for token in ["image", "jpg", "png", "photo", "passport"]):
        keywords.extend([f"{title} image tool", f"free image tool by ishu", "iloveimg alternative", "pi7 image tools alternative"])
    if any(token in slug for token in ["calculator", "grade", "attendance", "study", "citation"]):
        keywords.extend([f"{title} student helper", f"{title} exam helper", f"{title} college tool"])
    if any(token in slug for token in ["json", "code", "regex", "base64", "uuid"]):
        keywords.extend([f"{title} developer tool", f"{title} coding utility", "free developer tools"])
    return list(dict.fromkeys(k for k in keywords if k))[:70]


def tool_description(tool) -> str:
    return (
        f"{tool.description} Use {tool.title} online free on ISHU TOOLS with no signup, no watermark, "
        "mobile support, privacy-focused processing, and student-friendly results."
    )[:300]


def tool_faq(tool) -> list[dict[str, str]]:
    return [
        {
            "@type": "Question",
            "name": f"How do I use {tool.title} online for free?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f"Open {tool.title} on ISHU TOOLS, upload files or enter values, choose options, and run the tool. It works online with no signup and no watermark.",
            },
        },
        {
            "@type": "Question",
            "name": f"Is {tool.title} useful for students?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f"Yes. {tool.title} is built for students, creators, developers, and daily users who need fast, simple, reliable online tools.",
            },
        },
        {
            "@type": "Question",
            "name": f"Why choose ISHU TOOLS for {tool.title}?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "ISHU TOOLS focuses on free access, clean output, mobile-friendly pages, privacy-focused processing, and simple professional workflows inspired by top tool platforms.",
            },
        },
    ]


def get_asset_tags(index_html: str) -> str:
    head_match = re.search(r"<head>([\s\S]*?)</head>", index_html)
    if not head_match:
        return ""
    head = head_match.group(1)
    tags = re.findall(r"<(?:script|link)[^>]+(?:/?>|></script>)", head)
    kept = [
        tag
        for tag in tags
        if "/assets/" in tag or 'rel="modulepreload"' in tag or 'rel="stylesheet"' in tag
    ]
    return "\n    ".join(dict.fromkeys(kept))


def head_block(title: str, description: str, keywords: list[str], url: str, json_ld: object, asset_tags: str) -> str:
    keyword_text = ", ".join(keywords)
    return f"""<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{esc(title)}</title>
    <meta name="description" content="{esc(description)}" />
    <meta name="keywords" content="{esc(keyword_text)}" />
    <meta name="author" content="Ishu Kumar" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="{esc(url)}" />
    <link rel="alternate" hreflang="en" href="{esc(url)}" />
    <link rel="alternate" hreflang="hi" href="{esc(url)}" />
    <link rel="alternate" hreflang="x-default" href="{esc(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="ISHU TOOLS" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:url" content="{esc(url)}" />
    <meta property="og:title" content="{esc(title)}" />
    <meta property="og:description" content="{esc(description)}" />
    <meta property="og:image" content="https://ishutools.com/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@ISHU_IITP" />
    <meta name="twitter:creator" content="@ISHU_IITP" />
    <meta name="twitter:title" content="{esc(title)}" />
    <meta name="twitter:description" content="{esc(description)}" />
    <meta name="twitter:image" content="https://ishutools.com/og-image.png" />
    <meta name="theme-color" content="#03060e" />
    <meta name="application-name" content="ISHU TOOLS" />
    <meta name="apple-mobile-web-app-title" content="ISHU TOOLS" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
    {asset_tags}
    <script type="application/ld+json">{json.dumps(json_ld, ensure_ascii=False, separators=(",", ":"))}</script>
  </head>"""


def render_page(index_html: str, path: Path, title: str, description: str, keywords: list[str], url: str, json_ld: object):
    page = re.sub(r"<head>[\s\S]*?</head>", head_block(title, description, keywords, url, json_ld, get_asset_tags(index_html)), index_html, count=1)
    path.mkdir(parents=True, exist_ok=True)
    (path / "index.html").write_text(page, encoding="utf-8")


def tool_json_ld(tool, description: str) -> object:
    url = f"{BASE_URL}/tools/{tool.slug}"
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "name": f"{tool.title} — ISHU TOOLS",
                "url": url,
                "description": description,
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "Any",
                "offers": {"@type": "Offer", "price": "0", "priceCurrency": "INR"},
                "creator": {"@type": "Person", "name": "Ishu Kumar"},
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL},
                    {"@type": "ListItem", "position": 2, "name": category_label(tool.category), "item": f"{BASE_URL}/category/{tool.category}"},
                    {"@type": "ListItem", "position": 3, "name": tool.title, "item": url},
                ],
            },
            {"@type": "FAQPage", "mainEntity": tool_faq(tool)},
        ],
    }


def category_json_ld(category, tools) -> object:
    url = f"{BASE_URL}/category/{category.id}"
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": f"{category.label} — ISHU TOOLS",
        "url": url,
        "description": category.description,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                {"@type": "ListItem", "position": index + 1, "name": tool.title, "url": f"{BASE_URL}/tools/{tool.slug}"}
                for index, tool in enumerate(tools[:100])
            ],
        },
    }


def write_sitemap(tools, categories):
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    lines.append(f"  <url><loc>{BASE_URL}/</loc><lastmod>{TODAY}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>")
    lines.append(f"  <url><loc>{BASE_URL}/tools</loc><lastmod>{TODAY}</lastmod><changefreq>daily</changefreq><priority>0.96</priority></url>")
    for category in categories:
        lines.append(f"  <url><loc>{BASE_URL}/category/{category.id}</loc><lastmod>{TODAY}</lastmod><changefreq>weekly</changefreq><priority>0.92</priority></url>")
    for tool in tools:
        priority = "0.98" if any(token in tool.slug for token in ["pdf", "image", "calculator", "json", "password", "qr"]) else "0.86"
        lines.append(f"  <url><loc>{BASE_URL}/tools/{tool.slug}</loc><lastmod>{TODAY}</lastmod><changefreq>weekly</changefreq><priority>{priority}</priority></url>")
    lines.append("</urlset>")
    (DIST_DIR / "sitemap.xml").write_text("\n".join(lines), encoding="utf-8")


def main():
    if not INDEX_FILE.exists():
        raise SystemExit("frontend/dist/index.html not found. Run the frontend build first.")
    index_html = INDEX_FILE.read_text(encoding="utf-8")
    tools = unique_by(TOOLS, lambda item: item.slug)
    categories = unique_by(CATEGORIES, lambda item: item.id)

    for tool in tools:
        description = tool_description(tool)
        title = f"{tool.title} Online Free — ISHU TOOLS"
        render_page(
            index_html,
            DIST_DIR / "tools" / tool.slug,
            title,
            description,
            tool_keywords(tool),
            f"{BASE_URL}/tools/{tool.slug}",
            tool_json_ld(tool, description),
        )

    for category in categories:
        category_tools = [tool for tool in tools if tool.category == category.id]
        keywords = list(dict.fromkeys([
            clean_words(category.label),
            f"free {clean_words(category.label)}",
            f"{clean_words(category.label)} online",
            f"ishu tools {clean_words(category.label)}",
            "ishu tools",
            "free online tools",
            *[clean_words(tool.title) for tool in category_tools[:25]],
        ]))
        render_page(
            index_html,
            DIST_DIR / "category" / category.id,
            f"{category.label} Online Free — ISHU TOOLS",
            f"{category.description} Explore free {category.label.lower()} on ISHU TOOLS with no signup, no watermark, and mobile-friendly workflows.",
            keywords,
            f"{BASE_URL}/category/{category.id}",
            category_json_ld(category, category_tools),
        )

    write_sitemap(tools, categories)
    print(f"Generated SEO HTML for {len(tools)} tools and {len(categories)} categories.")


if __name__ == "__main__":
    main()
