#!/usr/bin/env node
import { writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/sitemap.xml");
const SITE = "https://ishutools.com";
const BACKEND =
  process.env.SITEMAP_BACKEND || "https://ishu-tools-page.onrender.com";

const HIGH = [
  "merge-pdf","compress-pdf","split-pdf","pdf-to-jpg","jpg-to-pdf","pdf-to-png",
  "pdf-to-word","word-to-pdf","compress-image","resize-image","remove-bg",
  "background-remover","image-to-pdf","crop-image","youtube","instagram",
  "tiktok","twitter","facebook","downloader","json-formatter","base64",
  "url-encode","html-formatter","css-formatter","javascript-formatter",
  "sql-formatter","xml-formatter","qr-code","barcode","password-generator",
  "color-picker","bmi","emi","sip","gst","age-calc","percentage","tax",
  "celsius-to-fahrenheit","cm-to-inches","kg-to-lbs","ml-to-oz",
  "word-counter","character-count","case-converter","lorem-ipsum",
];
const isHigh = (s) => HIGH.some((p) => s.toLowerCase().includes(p));

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

(async () => {
  let tools = null;
  try {
    tools = await fetchJson(`${BACKEND}/api/tools`);
    console.log(`[sitemap] fetched ${tools.length} tools from ${BACKEND}`);
  } catch (e) {
    console.warn(`[sitemap] backend unreachable (${e.message}); keeping existing sitemap.xml`);
    if (existsSync(OUT)) {
      console.warn(`[sitemap] existing sitemap.xml preserved at ${OUT}`);
      process.exit(0);
    }
    console.error(`[sitemap] no fallback sitemap exists; writing minimal one`);
    writeFileSync(OUT,
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `  <url><loc>${SITE}/</loc><priority>1.0</priority></url>\n` +
      `  <url><loc>${SITE}/tools</loc><priority>0.97</priority></url>\n` +
      `</urlset>\n`);
    process.exit(0);
  }

  const today = new Date().toISOString().slice(0, 10);
  const cats = [...new Set(tools.map((t) => t.category).filter(Boolean))].sort();
  const slugs = [...new Set(tools.map((t) => t.slug).filter(Boolean))].sort();

  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    `  <url><loc>${SITE}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `  <url><loc>${SITE}/tools</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.97</priority></url>`,
  ];
  for (const c of cats)
    lines.push(`  <url><loc>${SITE}/category/${c}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.92</priority></url>`);
  for (const s of slugs)
    lines.push(`  <url><loc>${SITE}/tools/${s}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${isHigh(s) ? "0.95" : "0.86"}</priority></url>`);
  lines.push(`</urlset>`);

  writeFileSync(OUT, lines.join("\n") + "\n");
  console.log(`[sitemap] wrote ${slugs.length + cats.length + 2} URLs → ${OUT}`);
})();
