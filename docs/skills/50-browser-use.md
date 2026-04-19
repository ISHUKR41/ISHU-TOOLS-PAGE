# Browser Use Skill — Automated Browser Interactions

## What It Does
Automates real browser interactions — navigate pages, fill forms, click buttons, take screenshots, extract data, and perform multi-step web workflows. Uses a persistent background daemon for ~50ms latency per call.

---

## Activation Triggers
- "Automate browser"
- "Fill this form automatically"
- "Take a screenshot of this website"
- "Extract data from a webpage"
- "Test my web application"
- "Navigate to X and click Y"
- "Scrape data from..."
- "Web testing", "E2E test", "browser automation"

---

## Prerequisites

```bash
browser-use doctor    # Verify installation and dependencies
```

---

## Core Commands

```bash
# Navigate to a URL
browser-use go "https://example.com"

# Take a screenshot
browser-use screenshot --output /tmp/screenshot.png

# Click an element
browser-use click "Submit button"

# Type text
browser-use type "search box" "hello world"

# Extract text/data from page
browser-use extract "product prices"

# Fill a form
browser-use fill "email" "user@example.com"
browser-use fill "password" "secret123"
browser-use click "Login"

# Execute JavaScript
browser-use js "document.title"

# Wait for element
browser-use wait "Loading complete" --timeout 10
```

---

## Common Use Cases

### 1. Website Screenshot
```bash
browser-use go "https://ishutools.com"
browser-use screenshot --output /tmp/site.png
```

### 2. Form Submission
```bash
browser-use go "https://forms.example.com/contact"
browser-use fill "name" "John Doe"
browser-use fill "email" "john@example.com"
browser-use fill "message" "Hello, I need help."
browser-use click "Send Message"
browser-use screenshot --output /tmp/confirmation.png
```

### 3. Data Extraction / Scraping
```bash
browser-use go "https://news.ycombinator.com"
browser-use extract "all article titles and links"
```

### 4. Web Application Testing
```bash
browser-use go "http://localhost:5000"
browser-use click "Login"
browser-use fill "username" "testuser"
browser-use fill "password" "pass123"
browser-use click "Sign In"
browser-use screenshot --output /tmp/after-login.png
```

---

## Important Notes
- The browser daemon stays alive between commands — fast multi-step workflows
- Use `screenshot` after each major step to verify actions worked
- For JavaScript-heavy SPAs, add `--wait 2` after navigation
- Respects robots.txt — only use on sites you own or have permission to access
- Output screenshots can be displayed with the `present_asset` tool

---

## When NOT to Use
- Simple HTTP requests (use `httpx` or `fetch` in code_execution instead)
- API calls (use the `query-integration-data` skill)
- Just fetching HTML/JSON (use `web-search` skill's `web_fetch`)
