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
    console.warn(`[seo] backend unreachable (${e.message}); falling back to sitemap.xml`);
    const fb = fallbackSlugsFromSitemap();
    tools = fb.tools;
    categories = fb.cats;
    console.log(`[seo] sitemap fallback: ${tools.length} tools + ${categories.length} categories`);
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

  console.log(`[seo] wrote ${toolsWritten} tool pages + ${catsWritten} category pages + 1 all-tools page → dist/`);
})();

