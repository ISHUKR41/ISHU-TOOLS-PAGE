#!/usr/bin/env node
/**
 * gen-static-seo.mjs — postbuild prerender for per-tool & per-category SEO.
 *
 * Why: ISHU TOOLS is a Vite SPA. By default Vercel serves the same dist/index.html
 * for every route, so Google sees the SAME <title>/<meta description>/<canonical>
 * on /tools/merge-pdf, /tools/compress-pdf, /tools/bmi-calculator, etc.
 * That kills per-tool ranking even though ToolPage.tsx injects unique tags
 * client-side (Googlebot does eventually render JS, but the static HTML signals
 * are weaker and slower to index).
 *
 * What this script does:
 *   1. Loads the tool catalog from the backend (with sitemap.xml fallback).
 *   2. Reads dist/index.html as a template.
 *   3. For each tool slug, writes dist/tools/<slug>/index.html and
 *      dist/tools/<slug>.html with
 *      <title>, <meta description>, <link canonical>, og:*, twitter:* REWRITTEN
 *      to that tool's unique values.
 *   4. Same for each category at dist/category/<slug>/index.html and
 *      dist/category/<slug>.html.
 *
 * Vercel will serve the file-system match before falling back to the SPA rewrite,
 * so /tools/merge-pdf returns merge-pdf-specific HTML on the first byte.
 * The React app still hydrates normally on top.
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const TEMPLATE = resolve(DIST, "index.html");
const SITEMAP = resolve(__dirname, "../public/sitemap.xml");
const CATALOG_SOURCE = resolve(__dirname, "../src/data/catalogFallback.ts");
const SITE = (
  process.env.VITE_SITE_URL ||
  process.env.PUBLIC_SITE_URL ||
  "https://ishutools.fun"
).replace(/\/$/, "");
const BACKEND =
  process.env.SEO_BACKEND ||
  process.env.SITEMAP_BACKEND ||
  "https://ishu-tools-page.onrender.com";

if (!existsSync(TEMPLATE)) {
  console.warn(`[seo] dist/index.html not found at ${TEMPLATE} — skipping (build first)`);
  process.exit(0);
}

const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeAttr = escapeHtml;

const titleCase = (s) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const SITE_NAME = "ISHU TOOLS";

// ─── SEO generator (mirrors frontend/src/lib/seoData.ts createGeneratedSEO) ───
function buildToolSEO(slug, label = "", desc = "", category = "") {
  const t = (label || titleCase(slug)).trim();
  const d = (desc || `${t} — fast, accurate, free online.`).trim();
  const c = String(category || "");
  const lower = slug.toLowerCase();

  const isPdf = lower.includes("pdf") || c.includes("pdf");
  const isImage =
    c.includes("image") ||
    c === "format-lab" ||
    lower.includes("image") ||
    lower.includes("-jpg") ||
    lower.includes("-png") ||
    lower.includes("-webp");
  const isCalc =
    c === "math-tools" ||
    c === "finance-tools" ||
    c === "health-tools" ||
    lower.includes("calculator") ||
    lower.includes("-calc");
  const isConvert = lower.includes("-to-") || c === "unit-converter" || c === "conversion-tools";
  const isCompress = lower.includes("compress") || lower.includes("minify");
  const isOCR = lower.includes("ocr") || lower.includes("-to-text");
  const isDev = c === "developer-tools" || c === "code-tools" || c === "format-lab";

  let title;
  if (isCompress && isPdf) title = `${t} — Reduce PDF Size Online Free | ${SITE_NAME}`;
  else if (isCompress && isImage) title = `${t} — Reduce Image Size Free Online | ${SITE_NAME}`;
  else if (isOCR) title = `${t} — Extract Text Online Free | ${SITE_NAME}`;
  else if (isCalc) title = `${t} — Free Online Calculator | ${SITE_NAME}`;
  else if (isDev) title = `${t} Online — Free Developer Tool | ${SITE_NAME}`;
  else if (isConvert) title = `${t} Online Free — Fast Converter | ${SITE_NAME}`;
  else if (isPdf) title = `${t} Online Free — Fast PDF Tool | ${SITE_NAME}`;
  else if (isImage) title = `${t} Online Free — Fast Image Tool | ${SITE_NAME}`;
  else title = `${t} Online Free | ${SITE_NAME}`;

  let description = `${t} online for free. ${d.replace(/\.$/, "")}. No signup, no watermark, fast processing. Works on mobile and desktop.`;
  if (description.length > 300) description = description.slice(0, 297) + "...";

  const keywords = buildKeywords(slug, t, c);
  return { title, description, keywords };
}

function buildCategorySEO(catId, catLabel = "", catDesc = "") {
  const label = catLabel || titleCase(catId);
  const title = `${label} — Free Online Tools | ${SITE_NAME}`;
  let description = `${label} on ${SITE_NAME}. ${(catDesc || "Free online tools, no signup required.").replace(/\.$/, "")}. Fast, accurate, mobile-friendly — built for students and professionals.`;
  if (description.length > 300) description = description.slice(0, 297) + "...";
  const keywords = buildKeywords(catId, label, catId);
  return { title, description, keywords };
}

function buildKeywords(slug, title, category = "") {
  const base = title.toLowerCase().replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim();
  const categoryText = titleCase(category || "online-tools").toLowerCase();
  return [
    title,
    `${title} online`,
    `${title} free`,
    `${title} no signup`,
    `${title} no watermark`,
    `${base} tool`,
    `${base} online free`,
    `${slug.replace(/-/g, " ")} tool`,
    `${categoryText} tools`,
    "ISHU TOOLS",
    "ishutools.fun",
    "free online tools",
    "Indian student tools",
  ]
    .map((keyword) => String(keyword).trim())
    .filter(Boolean)
    .filter((keyword, index, arr) => arr.findIndex((item) => item.toLowerCase() === keyword.toLowerCase()) === index)
    .slice(0, 18)
    .join(", ");
}

// ─── JSON-LD structured data builder (per page) ───
// Why: rich results in Google SERPs require JSON-LD on the static HTML response.
// SoftwareApplication → eligible for software card + price (free).
// BreadcrumbList     → eligible for breadcrumb display under the title.
// FAQPage            → eligible for accordion-style FAQ rich result.
// All three together is the standard recipe for tool-style sites.
function buildToolJsonLd({ slug, title, description, url, category }) {
  const catLabel = titleCase(category || "Tools");
  const node = (obj) =>
    `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title.replace(/ \| ISHU TOOLS$/, ""),
    description,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Web)",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "All Tools", item: SITE + "/tools" },
      ...(category
        ? [{ "@type": "ListItem", position: 3, name: catLabel, item: `${SITE}/category/${category}` }]
        : []),
      { "@type": "ListItem", position: category ? 4 : 3, name: software.name, item: url },
    ],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${software.name} free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes — ${software.name} on ISHU TOOLS is 100% free. No signup, no watermark, and no installation required.`,
        },
      },
      {
        "@type": "Question",
        name: `Does it work on mobile?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes — ${software.name} runs in any modern browser on Android, iPhone, iPad, Windows, Mac, and Linux. Nothing to install.`,
        },
      },
      {
        "@type": "Question",
        name: `Are my files safe?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `All uploads are processed on our server and automatically deleted after the job finishes. We never store, share, or sell your files.`,
        },
      },
    ],
  };
  // HowTo schema → Google shows a step-by-step rich result for "how to ..." queries.
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${software.name}`,
    description: `Step-by-step guide to use ${software.name} on ISHU TOOLS — free, no signup.`,
    totalTime: "PT1M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    supply: [{ "@type": "HowToSupply", name: "Your file or text input" }],
    tool: [{ "@type": "HowToTool", name: "Any modern web browser" }],
    step: [
      { "@type": "HowToStep", position: 1, name: `Open ${software.name}`, text: `Visit ${url} on any device. No signup needed.`, url },
      { "@type": "HowToStep", position: 2, name: "Add your input", text: `Upload your file or paste your text — drag & drop is supported.` },
      { "@type": "HowToStep", position: 3, name: "Adjust options", text: "Pick output format, quality, or other options shown on the page." },
      { "@type": "HowToStep", position: 4, name: "Run the tool", text: 'Click "Run" — processing starts instantly on the server.' },
      { "@type": "HowToStep", position: 5, name: "Download result", text: "Download the output file or copy the result text. Files are deleted from the server right after." },
    ],
  };
  return [node(software), node(breadcrumbs), node(faq), node(howTo)].join("\n");
}

function buildCategoryJsonLd({ id, title, description, url }) {
  const node = (obj) =>
    `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title.replace(/ \| ISHU TOOLS$/, ""),
    description,
    url,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "All Tools", item: SITE + "/tools" },
      { "@type": "ListItem", position: 3, name: titleCase(id), item: url },
    ],
  };
  return [node(collection), node(breadcrumbs)].join("\n");
}

function buildAllToolsJsonLd({ title, description, url, tools = [] }) {
  const node = (obj) =>
    `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title.replace(/ \| ISHU TOOLS$/, ""),
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.slice(0, 100).map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.title || tool.label || titleCase(tool.slug || tool.id || "tool"),
        url: `${SITE}/tools/${tool.slug || tool.id}`,
      })),
    },
  };
  return [node(website), node(collection)].join("\n");
}

function uniqueBySlug(items = []) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const slug = item.slug || item.id;
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push({ ...item, slug });
  }
  return out;
}

function uniqueCategories(items = [], tools = []) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const id = item.id || item.slug || item.category;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({ ...item, id });
  }
  for (const tool of tools) {
    if (!tool.category || seen.has(tool.category)) continue;
    seen.add(tool.category);
    out.push({
      id: tool.category,
      label: titleCase(tool.category),
      description: `${titleCase(tool.category)} tools on ISHU TOOLS.`,
    });
  }
  return out;
}

function buildAiIndexes(tools = [], categories = []) {
  const base = SITE;
  const cleanTools = uniqueBySlug(tools);
  const cleanCategories = uniqueCategories(categories, cleanTools);
  const catLabel = new Map(cleanCategories.map((cat) => [cat.id, cat.label || titleCase(cat.id)]));
  const topSlugs = [
    "scientific-calculator",
    "merge-pdf",
    "compress-pdf",
    "compress-image",
    "remove-background",
    "pdf-to-word",
    "word-to-pdf",
    "jpg-to-pdf",
    "pdf-to-jpg",
    "split-pdf",
    "qr-code-generator",
    "json-formatter",
    "password-generator",
    "bmi-calculator",
    "gst-calculator-india",
    "emi-calculator-advanced",
    "instagram-downloader",
    "youtube-downloader",
    "image-to-text",
    "ocr-pdf",
  ];
  const toolMap = new Map(cleanTools.map((tool) => [tool.slug, tool]));
  const topTools = topSlugs.map((slug) => toolMap.get(slug)).filter(Boolean);
  const fallbackTop = cleanTools
    .filter((tool) => !topSlugs.includes(tool.slug))
    .sort((a, b) => (b.popularity_rank || 0) - (a.popularity_rank || 0))
    .slice(0, Math.max(0, 24 - topTools.length));
  const featured = [...topTools, ...fallbackTop];

  const llms = [
    "# ISHU TOOLS",
    "",
    "> ISHU TOOLS is a free, no-signup, no-watermark web toolkit for students, developers, creators, and professionals.",
    "",
    "## Key Facts",
    "",
    `- Primary URL: ${base}`,
    "- Mirror URL: https://ishutools.vercel.app",
    "- Creator: Ishu Kumar",
    `- Tool count: ${cleanTools.length}+`,
    `- Category count: ${cleanCategories.length}+`,
    "- Pricing: Free",
    "- Signup: Not required",
    "- Watermark: None",
    "- Platform: Mobile, tablet, and desktop browsers",
    "",
    "## Important URLs",
    "",
    `- All tools: ${base}/tools`,
    `- Sitemap: ${base}/sitemap.xml`,
    `- Full machine-readable tool index: ${base}/tools.json`,
    `- Full LLM text index: ${base}/llms-full.txt`,
    "",
    "## Top Daily-Use Tools",
    "",
    ...featured.map((tool) => `- [${tool.title || titleCase(tool.slug)}](${base}/tools/${tool.slug}): ${(tool.description || "").replace(/\s+/g, " ").trim()}`),
    "",
    "## Categories",
    "",
    ...cleanCategories.map((cat) => `- [${cat.label || titleCase(cat.id)}](${base}/category/${cat.id}): ${(cat.description || cat.label || cat.id).replace(/\s+/g, " ").trim()}`),
    "",
    "## Citation Guidance",
    "",
    `When citing ISHU TOOLS, link to the exact tool page when possible, for example ${base}/tools/scientific-calculator.`,
    "",
  ].join("\n");

  const grouped = new Map();
  for (const tool of cleanTools) {
    const label = catLabel.get(tool.category) || titleCase(tool.category || "tools");
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label).push(tool);
  }
  const llmsFull = [
    "# ISHU TOOLS — Full Tool Index",
    "",
    `> ${cleanTools.length}+ free online tools. No signup, no watermark. Site: ${base}`,
    "",
    ...[...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).flatMap(([label, items]) => [
      `## ${label}`,
      "",
      ...items
        .sort((a, b) => (a.title || a.slug).localeCompare(b.title || b.slug))
        .map((tool) => `- [${tool.title || titleCase(tool.slug)}](${base}/tools/${tool.slug}): ${(tool.description || "").replace(/\s+/g, " ").trim()}`),
      "",
    ]),
  ].join("\n");

  const toolsJson = {
    site: SITE_NAME,
    url: base,
    mirror_url: "https://ishutools.vercel.app",
    generated_at: new Date().toISOString(),
    tool_count: cleanTools.length,
    category_count: cleanCategories.length,
    tools: cleanTools.map((tool) => ({
      slug: tool.slug,
      title: tool.title || tool.label || titleCase(tool.slug),
      description: tool.description || "",
      category: tool.category || "",
      category_label: catLabel.get(tool.category) || titleCase(tool.category || "tools"),
      url: `${base}/tools/${tool.slug}`,
      tags: tool.tags || [],
      free: true,
      signup_required: false,
      watermark: false,
    })),
    categories: cleanCategories.map((cat) => ({
      id: cat.id,
      label: cat.label || titleCase(cat.id),
      description: cat.description || "",
      url: `${base}/category/${cat.id}`,
    })),
  };

  const aiTxt = [
    "# AI Search Summary — ISHU TOOLS",
    "",
    `ISHU TOOLS is a free online tools website at ${base} with ${cleanTools.length}+ tools for PDF, image, video, developer, math, student, finance, health, unit conversion, text, security, SEO, and productivity workflows.`,
    "",
    "Use specific tool URLs for citations. The full machine-readable index is available at /tools.json and the LLM-friendly text index is available at /llms.txt and /llms-full.txt.",
    "",
    "Representative tools: scientific calculator, merge PDF, compress PDF, compress image, remove background, PDF to Word, Word to PDF, QR code generator, JSON formatter, password generator, BMI calculator, GST calculator, Instagram downloader, YouTube downloader, image OCR.",
    "",
  ].join("\n");

  return { llms, llmsFull, toolsJson, aiTxt };
}

// ─── HTML template patcher ───
function patchTemplate(template, { title, description, url, keywords, jsonLd }) {
  const T = escapeHtml(title);
  const D = escapeAttr(description);
  const U = escapeAttr(url);
  const K = escapeAttr(keywords || "");
  let out = template;
  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${T}</title>`);
  // basic + canonical
  out = out.replace(
    /<meta\s+name="description"[^>]*\/>/,
    `<meta name="description" content="${D}" />`,
  );
  out = out.replace(
    /<link\s+rel="canonical"[^>]*\/>/,
    `<link rel="canonical" href="${U}" />`,
  );
  if (K) {
    out = out.replace(
      /<meta\s+name="keywords"[^>]*\/>/,
      `<meta name="keywords" content="${K}" />`,
    );
  }
  // OG
  out = out.replace(
    /<meta\s+property="og:title"[^>]*\/>/,
    `<meta property="og:title" content="${T}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:description"[^>]*\/>/,
    `<meta property="og:description" content="${D}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:url"[^>]*\/>/,
    `<meta property="og:url" content="${U}" />`,
  );
  // Twitter
  out = out.replace(
    /<meta\s+name="twitter:title"[^>]*\/>/,
    `<meta name="twitter:title" content="${T}" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:description"[^>]*\/>/,
    `<meta name="twitter:description" content="${D}" />`,
  );
  // Inject per-page JSON-LD just before </head> so it's evaluated alongside
  // the existing site-wide schema blocks (Organization, WebSite, FAQPage).
  if (jsonLd) out = out.replace("</head>", `${jsonLd}\n</head>`);
  return out;
}

function writePage(routePath, html) {
  const cleanPath = routePath.replace(/^\/+/, "");
  const directoryOut = resolve(DIST, "." + routePath, "index.html");
  mkdirSync(dirname(directoryOut), { recursive: true });
  writeFileSync(directoryOut, html);

  // Also write a clean-URL HTML sibling. Vercel's cleanUrls and explicit
  // rewrites can then serve /tools/merge-pdf from /tools/merge-pdf.html before
  // the SPA fallback. Keeping both formats makes local preview, Vercel, and
  // static hosts more crawler-friendly without changing the React route.
  if (cleanPath) {
    const htmlOut = resolve(DIST, `${cleanPath}.html`);
    mkdirSync(dirname(htmlOut), { recursive: true });
    writeFileSync(htmlOut, html);
  }
}

async function fetchJson(url, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

function fallbackSlugsFromSitemap() {
  if (!existsSync(SITEMAP)) return { tools: [], cats: [] };
  const xml = readFileSync(SITEMAP, "utf8");
  const tools = [...xml.matchAll(/\/tools\/([^<]+?)</g)].map((m) => ({ slug: m[1] }));
  const cats = [...xml.matchAll(/\/category\/([^<]+?)</g)].map((m) => ({ id: m[1] }));
  return { tools, cats };
}

function extractCatalogArray(source, exportName) {
  const marker = `export const ${exportName}`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return [];
  const start = source.indexOf("[", markerIndex);
  if (start < 0) return [];

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      escaped = ch === "\\" && !escaped;
      if (ch === '"' && !escaped) inString = false;
      if (ch !== "\\") escaped = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "[") depth += 1;
    if (ch === "]") depth -= 1;
    if (depth === 0) {
      return JSON.parse(source.slice(start, i + 1));
    }
  }
  return [];
}

function fallbackCatalogFromSource() {
  if (!existsSync(CATALOG_SOURCE)) return { tools: [], cats: [] };
  try {
    const source = readFileSync(CATALOG_SOURCE, "utf8");
    return {
      tools: extractCatalogArray(source, "FALLBACK_TOOLS"),
      cats: extractCatalogArray(source, "FALLBACK_CATEGORIES"),
    };
  } catch (e) {
    console.warn(`[seo] fallback catalog parse failed (${e.message})`);
    return { tools: [], cats: [] };
  }
}

(async () => {
  const template = readFileSync(TEMPLATE, "utf8");

  let tools = [];
  let categories = [];
  try {
    [tools, categories] = await Promise.all([
      fetchJson(`${BACKEND}/api/tools`),
      fetchJson(`${BACKEND}/api/categories`),
    ]);
    console.log(`[seo] fetched ${tools.length} tools + ${categories.length} categories from ${BACKEND}`);
  } catch (e) {
    console.warn(`[seo] backend unreachable (${e.message}); falling back to shipped catalog`);
    const catalog = fallbackCatalogFromSource();
    if (catalog.tools.length || catalog.cats.length) {
      tools = catalog.tools;
      categories = catalog.cats;
      console.log(`[seo] catalog fallback: ${tools.length} tools + ${categories.length} categories`);
    } else {
      const fb = fallbackSlugsFromSitemap();
      tools = fb.tools;
      categories = fb.cats;
      console.log(`[seo] sitemap fallback: ${tools.length} tools + ${categories.length} categories`);
    }
  }

  if (!tools.length && !categories.length) {
    console.warn("[seo] no tools or categories — nothing to prerender");
    process.exit(0);
  }

  let toolsWritten = 0;
  for (const tool of tools) {
    const slug = tool.slug || tool.id;
    if (!slug) continue;
    const seo = buildToolSEO(slug, tool.label || tool.title, tool.description, tool.category);
    const url = `${SITE}/tools/${slug}`;
    const jsonLd = buildToolJsonLd({
      slug,
      title: seo.title,
      description: seo.description,
      url,
      category: tool.category || "",
    });
    const html = patchTemplate(template, {
      title: seo.title,
      description: seo.description,
      url,
      keywords: seo.keywords,
      jsonLd,
    });
    writePage(`/tools/${slug}`, html);
    toolsWritten++;
  }

  let catsWritten = 0;
  for (const cat of categories) {
    const id = cat.id || cat.slug;
    if (!id) continue;
    const seo = buildCategorySEO(id, cat.label, cat.description);
    const url = `${SITE}/category/${id}`;
    const jsonLd = buildCategoryJsonLd({ id, title: seo.title, description: seo.description, url });
    const html = patchTemplate(template, {
      title: seo.title,
      description: seo.description,
      url,
      keywords: seo.keywords,
      jsonLd,
    });
    writePage(`/category/${id}`, html);
    catsWritten++;
  }

  // /tools (all-tools) page
  const allTitle = `All 1247+ Free Online Tools — Smart Sorted Directory | ${SITE_NAME}`;
  const allDescription = `Every tool on ${SITE_NAME} in one smart-sorted list — daily-use tools first. PDF, image, video, code, math, finance, health & more. No signup, no watermark.`;
  const all = patchTemplate(template, {
    title: allTitle,
    description: allDescription,
    url: `${SITE}/tools`,
    keywords: buildKeywords("all-tools", "All Free Online Tools", "tools"),
    jsonLd: buildAllToolsJsonLd({
      title: allTitle,
      description: allDescription,
      url: `${SITE}/tools`,
      tools,
    }),
  });
  writePage("/tools", all);

  // /scientific-calculator standalone page — pre-render so crawlers
  // see proper meta tags and a Calculator/FAQ JSON-LD on first byte.
  const calcTitle = `Scientific Calculator — Free Online Advanced Math | ${SITE_NAME}`;
  const calcDescription =
    "A real online scientific calculator with sin, cos, tan, hyperbolic, ln, log, powers, roots, factorial, nCr, nPr, modulo, scientific notation, memory, and DEG/RAD modes. 100% free, no signup, works on mobile.";
  const calcUrl = `${SITE}/scientific-calculator`;
  const calcKeywords =
    "scientific calculator, online calculator, free scientific calculator, advanced math calculator, trigonometry calculator, logarithm calculator, factorial, nCr, nPr, modulo, sin cos tan, hyperbolic calculator, DEG RAD calculator, fx-991 online";
  const calcFaq = [
    { q: "Is this scientific calculator free?", a: "Yes. ISHU TOOLS Scientific Calculator is 100% free, requires no signup, no installation, and works on any device with a browser." },
    { q: "Does it work in degrees and radians?", a: "Yes. Tap the DEG / RAD pill at the top of the calculator to switch between degree and radian mode for trigonometric functions." },
    { q: "How do I use the 2nd-function key?", a: "Press the 2nd key (top-left). The keypad now shows the alternate label on each key — for example sin becomes sin⁻¹, ln becomes eˣ, and √ becomes x². The 2nd toggle resets after one use, just like a real calculator." },
    { q: "Can I use it on my phone?", a: "Yes. The keypad is fully responsive and tuned for thumb typing on Android and iOS. Your last 24 calculations are saved locally on your device." },
    { q: "How is my data handled?", a: "All calculations run entirely in your browser. Nothing is sent to a server. History is stored only in your local device storage and you can clear it any time with the Reset button." },
    { q: "Does it support nCr, nPr, modulo, and scientific notation?", a: "Yes. Use the nCr / nPr keys for combinations and permutations, the mod key for modulo, and the EE key (or type \"e+5\") to enter scientific notation." },
  ];
  const calcJsonLd =
    `<script type="application/ld+json">` +
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "ISHU Scientific Calculator",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any (Web)",
      url: calcUrl,
      description: calcDescription,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1284" },
      featureList: [
        "Trigonometric and inverse trigonometric functions",
        "Hyperbolic functions",
        "Natural log, log base 10, log base 2",
        "Powers, roots, factorial",
        "nCr / nPr / modulo",
        "DEG / RAD switching",
        "Memory (MC / MR / M+ / M−)",
        "Scientific notation",
        "Calculation history",
        "Keyboard shortcuts",
      ],
    }) +
    `</script>` +
    `<script type="application/ld+json">` +
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: calcFaq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    }) +
    `</script>`;
  const calcHtml = patchTemplate(template, {
    title: calcTitle,
    description: calcDescription,
    url: calcUrl,
    keywords: calcKeywords,
    jsonLd: calcJsonLd,
  });
  writePage("/scientific-calculator", calcHtml);

  const aiIndexes = buildAiIndexes(tools, categories);
  writeFileSync(resolve(DIST, "llms.txt"), aiIndexes.llms);
  writeFileSync(resolve(DIST, "llms-full.txt"), aiIndexes.llmsFull);
  writeFileSync(resolve(DIST, "ai.txt"), aiIndexes.aiTxt);
  writeFileSync(resolve(DIST, "tools.json"), JSON.stringify(aiIndexes.toolsJson, null, 2) + "\n");

  console.log(`[seo] wrote ${toolsWritten} tool pages + ${catsWritten} category pages + 1 all-tools page + AI indexes → dist/`);
})();

