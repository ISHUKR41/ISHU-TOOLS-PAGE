import Fuse from 'fuse.js'

import type { ToolDefinition } from '../types/tools'

export const DAILY_CATEGORY_PRIORITY = [
  'pdf-core',
  'image-core',
  'unit-converter',
  'developer-tools',
  'math-tools',
  'student-tools',
  'finance-tools',
  'health-tools',
  'text-ops',
  'video-tools',
  'office-suite',
  'format-lab',
  'image-layout',
  'image-tools',
  'pdf-advanced',
  'pdf-security',
  'network-tools',
  'color-tools',
  'security-tools',
  'productivity',
  'audio-tools',
  'data-tools',
  'seo-tools',
  'social-media',
]

const DAILY_TOOL_BONUS = new Map<string, number>([
  ['scientific-calculator', 260],
  ['merge-pdf', 250],
  ['compress-pdf', 248],
  ['compress-image', 246],
  ['pdf-to-word', 244],
  ['word-to-pdf', 242],
  ['remove-background', 240],
  ['jpg-to-pdf', 238],
  ['pdf-to-jpg', 236],
  ['split-pdf', 234],
  ['qr-code-generator', 232],
  ['json-formatter', 230],
  ['password-generator', 228],
  ['bmi-calculator', 226],
  ['percentage-calculator', 224],
  ['age-calculator', 222],
  ['gst-calculator-india', 220],
  ['emi-calculator-advanced', 218],
  ['sip-calculator-india', 216],
  ['income-tax-calculator-india', 214],
  ['word-counter', 212],
  ['case-converter', 210],
  ['uuid-generator', 208],
  ['base64-encode', 206],
  ['base64-decode', 204],
  ['unit-converter', 202],
  ['currency-converter', 200],
  ['instagram-downloader', 198],
  ['youtube-downloader', 196],
  ['image-to-text', 194],
  ['ocr-pdf', 192],
])

const SEARCH_SYNONYMS: Record<string, string[]> = {
  combine: ['merge', 'join', 'jodo'],
  join: ['merge', 'combine', 'jodo'],
  merge: ['combine', 'join', 'jodo'],
  shrink: ['compress', 'reduce', 'minify', 'optimize', 'kam'],
  compress: ['shrink', 'reduce', 'optimize', 'minify', 'kam'],
  reduce: ['compress', 'shrink', 'kam'],
  bg: ['background', 'remove background'],
  background: ['bg', 'remove background'],
  remove: ['delete', 'erase', 'hatao', 'nikalo'],
  delete: ['remove', 'hatao'],
  convert: ['change', 'transform', 'badlo'],
  change: ['convert', 'badlo'],
  calculator: ['calc', 'calculate', 'ganit'],
  calc: ['calculator', 'calculate'],
  calculate: ['calculator', 'compute'],
  scientific: ['calculator', 'math', 'sin', 'cos', 'log'],
  maths: ['math', 'calculator'],
  math: ['maths', 'calculator'],
  photo: ['image', 'picture', 'pic'],
  image: ['photo', 'picture', 'img', 'pic'],
  img: ['image', 'photo', 'picture'],
  pic: ['image', 'photo', 'picture'],
  picture: ['image', 'photo'],
  pdf: ['document', 'file'],
  document: ['pdf', 'doc', 'file'],
  doc: ['document', 'word', 'pdf'],
  docx: ['word', 'document'],
  word: ['docx', 'document'],
  xlsx: ['excel', 'spreadsheet'],
  excel: ['xlsx', 'spreadsheet'],
  pptx: ['powerpoint', 'presentation', 'slides'],
  powerpoint: ['pptx', 'presentation', 'slides'],
  qr: ['qrcode', 'qr code'],
  qrcode: ['qr', 'qr code'],
  url: ['link'],
  link: ['url'],
  instagram: ['insta', 'ig', 'reels', 'reel'],
  insta: ['instagram', 'ig', 'reel'],
  ig: ['instagram', 'insta', 'reel'],
  reel: ['instagram', 'insta', 'reels'],
  reels: ['instagram', 'insta', 'reel'],
  youtube: ['yt', 'shorts', 'video'],
  yt: ['youtube'],
  download: ['save', 'fetch', 'get'],
  save: ['download', 'fetch', 'get'],
  get: ['download', 'fetch'],
  saver: ['download', 'save'],
  create: ['generate', 'make', 'banao'],
  generate: ['create', 'make', 'banao'],
  banao: ['make', 'create', 'generate'],
  jodo: ['merge', 'join', 'combine'],
  hatao: ['remove', 'delete'],
  nikalo: ['extract', 'remove'],
  badlo: ['convert', 'change'],
  kaise: ['how'],
}

type SearchOptions = {
  category?: string
  globalPopularity?: Record<string, number>
  localUsage?: Record<string, number>
  limit?: number
}

function normalize(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_/]+/g, ' ')
    .replace(/[^a-z0-9.+#%\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function termsFromQuery(query: string) {
  return normalize(query).split(/\s+/).filter(Boolean)
}

function unique(values: string[]) {
  return Array.from(new Set(values.map(normalize).filter(Boolean)))
}

function expandTerm(term: string) {
  const normalized = normalize(term)
  return unique([normalized, ...(SEARCH_SYNONYMS[normalized] || [])])
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const row = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j]
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
      prev = tmp
    }
  }
  return row[b.length]
}

function fuzzyWordMatch(term: string, haystack: string) {
  if (term.length < 3) return false
  const maxDistance = term.length <= 5 ? 1 : 2
  return haystack
    .split(/[\s-]+/)
    .some((word) => Math.abs(word.length - term.length) <= maxDistance && levenshtein(term, word) <= maxDistance)
}

function toolText(tool: ToolDefinition) {
  const title = normalize(tool.title)
  const slug = normalize(tool.slug.replace(/-/g, ' '))
  const tags = normalize((tool.tags || []).join(' '))
  const description = normalize(tool.description || '')
  const category = normalize(tool.category)
  return { title, slug, tags, description, category, haystack: `${title} ${slug} ${tags} ${description} ${category}` }
}

export function getToolPriorityScore(
  tool: Pick<ToolDefinition, 'slug' | 'category' | 'popularity_rank'>,
  localUsage: Record<string, number> = {},
  globalPopularity: Record<string, number> = {},
) {
  const localVisits = localUsage[tool.slug] ?? 0
  const globalVisits = globalPopularity[tool.slug] ?? 0
  const staticRank = tool.popularity_rank ?? 0
  const categoryIndex = DAILY_CATEGORY_PRIORITY.indexOf(tool.category)
  const categoryScore = categoryIndex >= 0 ? (DAILY_CATEGORY_PRIORITY.length - categoryIndex) * 1.5 : 0
  const dailyScore = DAILY_TOOL_BONUS.get(tool.slug) ?? 0

  return (
    dailyScore +
    staticRank * 0.8 +
    categoryScore +
    Math.log2(localVisits + 1) * 32 +
    localVisits * 2 +
    Math.log2(globalVisits + 1) * 20 +
    Math.min(260, globalVisits) * 0.7
  )
}

export function sortToolsByPriority(
  tools: ToolDefinition[],
  localUsage: Record<string, number> = {},
  globalPopularity: Record<string, number> = {},
) {
  return [...tools].sort((a, b) => {
    const delta = getToolPriorityScore(b, localUsage, globalPopularity) - getToolPriorityScore(a, localUsage, globalPopularity)
    if (delta !== 0) return delta
    return a.title.localeCompare(b.title)
  })
}

function scoreTool(tool: ToolDefinition, query: string, options: SearchOptions) {
  const q = normalize(query)
  const rawTerms = termsFromQuery(query)
  const expanded = rawTerms.map(expandTerm)
  const text = toolText(tool)
  let score = 0

  if (!rawTerms.length) return getToolPriorityScore(tool, options.localUsage, options.globalPopularity)

  for (const termSet of expanded) {
    let best = 0
    for (const term of termSet) {
      const direct = term === termSet[0]
      const multiplier = direct ? 1 : 0.72
      if (text.title === term) best = Math.max(best, 1200 * multiplier)
      else if (text.slug === term) best = Math.max(best, 1100 * multiplier)
      else if (text.title.startsWith(term)) best = Math.max(best, 720 * multiplier)
      else if (text.slug.startsWith(term)) best = Math.max(best, 680 * multiplier)
      else if (new RegExp(`\\b${escapeRegex(term)}`).test(text.title)) best = Math.max(best, 460 * multiplier)
      else if (text.title.includes(term)) best = Math.max(best, 300 * multiplier)
      else if (text.slug.includes(term)) best = Math.max(best, 260 * multiplier)
      else if (text.tags.includes(term)) best = Math.max(best, 180 * multiplier)
      else if (text.description.includes(term)) best = Math.max(best, 80 * multiplier)
      else if (text.category.includes(term)) best = Math.max(best, 52 * multiplier)
      else if (direct && fuzzyWordMatch(term, text.haystack)) best = Math.max(best, 36)
    }
    if (best === 0) return -1
    score += best
  }

  if (text.title === q) score += 600
  if (text.slug === q) score += 540
  if (text.title.includes(q)) score += 220
  if (text.slug.includes(q)) score += 190
  score += Math.max(0, 44 - text.title.length / 2)
  score += Math.min(220, getToolPriorityScore(tool, options.localUsage, options.globalPopularity) * 0.24)
  return score
}

export function searchTools(
  tools: ToolDefinition[],
  query: string,
  options: SearchOptions = {},
) {
  const q = normalize(query)
  const pool = options.category && options.category !== 'all'
    ? tools.filter((tool) => tool.category === options.category)
    : tools

  if (!q) {
    const sorted = sortToolsByPriority(pool, options.localUsage, options.globalPopularity)
    return options.limit ? sorted.slice(0, options.limit) : sorted
  }

  const scored = pool
    .map((tool) => ({ tool, score: scoreTool(tool, q, options) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || a.tool.title.localeCompare(b.tool.title))

  if (scored.length < Math.min(8, pool.length) && q.length >= 2) {
    const seen = new Set(scored.map((item) => item.tool.slug))
    const fuse = new Fuse(pool, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'slug', weight: 0.22 },
        { name: 'tags', weight: 0.18 },
        { name: 'description', weight: 0.1 },
      ],
      threshold: 0.36,
      ignoreLocation: true,
      minMatchCharLength: 2,
      includeScore: true,
    })
    for (const hit of fuse.search(q, { limit: 16 })) {
      if (!seen.has(hit.item.slug)) {
        scored.push({
          tool: hit.item,
          score: -1 - (hit.score ?? 0) + Math.min(24, getToolPriorityScore(hit.item, options.localUsage, options.globalPopularity) * 0.02),
        })
        seen.add(hit.item.slug)
      }
    }
  }

  const results = scored.map((item) => item.tool)
  return options.limit ? results.slice(0, options.limit) : results
}
