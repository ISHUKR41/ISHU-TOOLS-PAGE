# Skill: github-solution-finder

## Purpose
Searches GitHub for open-source solutions, libraries, repositories, and code examples that solve specific programming problems. Evaluates repositories by stars, activity, license, and quality, and provides integration guidance.

## When to Use
- Need to find a library for a specific programming task
- Looking for open-source alternatives to paid tools
- Need example implementations of a specific algorithm or pattern
- Want to know the most popular Python/JS/etc. library for X
- Looking for starter templates or boilerplates
- Need to audit which library is best maintained

## Repository Evaluation Criteria
| Metric | Good | Excellent |
|--------|------|-----------|
| GitHub Stars | 500+ | 5000+ |
| Last Commit | < 3 months | < 1 month |
| Open Issues | < 200 | < 50 |
| Contributors | 5+ | 20+ |
| License | MIT/Apache | MIT |
| README Quality | Good docs | Examples + CI badges |
| Test Coverage | > 50% | > 80% |

## Usage Examples

```
"Find the best Python library for PDF manipulation with GitHub stars and license"
"Find open-source alternatives to Smallpdf for PDF compression"
"Find the top 5 React component libraries for a free tool website"
"Find GitHub repos for YouTube video downloading in Python"
"Find the best FastAPI JWT authentication starter template"
```

## Top Libraries by Category (Curated)

### PDF Processing (Python)
| Library | Stars | Use Case | Install |
|---------|-------|----------|---------|
| PyMuPDF | 5k+ | PDF read/write/render | `pip install PyMuPDF` |
| pdf2docx | 3k+ | PDF to DOCX | `pip install pdf2docx` |
| pypdf | 7k+ | Split/merge/encrypt | `pip install pypdf` |
| pdfplumber | 9k+ | Table + text extraction | `pip install pdfplumber` |
| WeasyPrint | 6k+ | HTML to PDF | `pip install weasyprint` |
| reportlab | 4k+ | Generate PDF from code | `pip install reportlab` |

### Image Processing (Python)
| Library | Stars | Use Case | Install |
|---------|-------|----------|---------|
| Pillow | 12k+ | General image ops | `pip install Pillow` |
| OpenCV | 77k+ | Computer vision | `pip install opencv-python` |
| scikit-image | 6k+ | Scientific imaging | `pip install scikit-image` |
| imageio | 1k+ | Read/write many formats | `pip install imageio` |
| cairosvg | 1k+ | SVG to PNG/PDF | `pip install cairosvg` |

### Video Downloading (Python)
| Library | Stars | Use Case | Install |
|---------|-------|----------|---------|
| yt-dlp | 90k+ | YouTube + 1800 sites | `pip install yt-dlp` |
| pytube | 9k+ | YouTube only | `pip install pytube` |
| youtube-dl | 130k+ | Original (less updated) | `pip install youtube-dl` |

### Web Scraping (Python)
| Library | Stars | Use Case |
|---------|-------|----------|
| BeautifulSoup4 | 30k+ | HTML parsing |
| Scrapy | 51k+ | Full scraping framework |
| httpx | 13k+ | Async HTTP requests |
| playwright | 63k+ | Browser automation |
| selenium | 29k+ | WebDriver automation |

### React UI Libraries
| Library | Stars | Design System |
|---------|-------|---------------|
| shadcn/ui | 75k+ | Radix + Tailwind |
| Material UI | 92k+ | Google Material |
| Ant Design | 91k+ | Enterprise UI |
| Chakra UI | 37k+ | Accessible, composable |
| Mantine | 26k+ | Full-featured |
| DaisyUI | 33k+ | Tailwind components |

### FastAPI/Backend
| Library | Stars | Use Case |
|---------|-------|----------|
| FastAPI | 78k+ | API framework |
| SQLAlchemy | 9k+ | ORM |
| Alembic | 3k+ | DB migrations |
| Celery | 23k+ | Task queue |
| Redis-py | 12k+ | Redis client |
| python-jose | 2k+ | JWT tokens |

## GitHub Search Queries

### Effective Search Patterns
```bash
# Find PDF tools
site:github.com "pdf" language:python stars:>500

# Find specific algorithm
"dijkstra algorithm" language:python

# Find boilerplates
"fastapi" "react" boilerplate stars:>100

# Find recently active
"pdf compression" language:python pushed:>2024-01-01
```

### GitHub API Search
```python
import httpx

async def search_github(query: str, language: str = None) -> list:
    url = "https://api.github.com/search/repositories"
    params = {
        "q": f"{query} language:{language}" if language else query,
        "sort": "stars",
        "order": "desc",
        "per_page": 10
    }
    headers = {"Accept": "application/vnd.github.v3+json"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, headers=headers)
        repos = resp.json()["items"]
    return [{
        "name": r["full_name"],
        "stars": r["stargazers_count"],
        "description": r["description"],
        "language": r["language"],
        "license": r.get("license", {}).get("spdx_id"),
        "last_updated": r["updated_at"],
        "url": r["html_url"],
    } for r in repos]
```

## License Compatibility Guide
| License | Can Use Commercially | Must Share Source | Attribution |
|---------|---------------------|-------------------|-------------|
| MIT | ✅ Yes | ❌ No | ✅ Required |
| Apache 2.0 | ✅ Yes | ❌ No | ✅ Required |
| GPL v3 | ⚠️ Copyleft | ✅ Yes | ✅ Required |
| LGPL v3 | ✅ Yes (as library) | ⚠️ Partial | ✅ Required |
| BSD 2-Clause | ✅ Yes | ❌ No | ✅ Required |
| Unlicense | ✅ Yes | ❌ No | ❌ None |

## Related Skills
- `package-management` — installing found libraries
- `deep-research` — broader technology research
- `file-converter` — finding conversion libraries
- `brainstorming` — evaluating library options
