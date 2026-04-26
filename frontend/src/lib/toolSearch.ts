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
  ['scientific-calculator', 320],
  ['merge-pdf', 310],
  ['compress-pdf', 308],
  ['compress-image', 306],
  ['pdf-to-word', 304],
  ['word-to-pdf', 302],
  ['remove-background', 300],
  ['jpg-to-pdf', 298],
  ['pdf-to-jpg', 296],
  ['split-pdf', 294],
  ['image-to-pdf', 292],
  ['image-to-text', 290],
  ['ocr-pdf', 288],
  ['qr-code-generator', 286],
  ['password-generator', 284],
  ['percentage-calculator', 282],
  ['age-calculator', 280],
  ['bmi-calculator', 278],
  ['marks-percentage-calculator', 276],
  ['cgpa-percentage-converter', 274],
  ['emi-calculator-advanced', 272],
  ['loan-emi-calculator', 270],
  ['sip-calculator-india', 268],
  ['gst-calculator-india', 266],
  ['income-tax-calculator-india', 264],
  ['simple-interest-calculator', 262],
  ['compound-interest-calculator', 260],
  ['discount-calculator', 258],
  ['currency-converter', 256],
  ['unit-converter', 254],
  ['word-counter', 252],
  ['character-counter', 250],
  ['case-converter', 248],
  ['text-to-speech', 246],
  ['json-formatter', 244],
  ['base64-encode', 242],
  ['base64-decode', 240],
  ['uuid-generator', 238],
  // SSC / UPSC / RRB / IBPS — exact KB photo sizes students search every day
  ['compress-image-to-20kb', 236],
  ['compress-image-to-50kb', 234],
  ['compress-image-to-100kb', 232],
  ['compress-image-to-200kb', 230],
  ['compress-image-to-500kb', 228],
  ['compress-image-to-1mb', 226],
  ['resize-image', 224],
  ['crop-image', 222],
  ['rotate-image', 220],
  // Common image format conversions
  ['png-to-jpg', 218],
  ['jpg-to-png', 216],
  ['webp-to-jpg', 214],
  ['heic-to-jpg', 212],
  ['convert-image', 210],
  // PDF utilities students need every week
  ['rotate-pdf', 208],
  ['unlock-pdf', 206],
  ['protect-pdf', 204],
  ['watermark-pdf', 202],
  ['pdf-page-extractor', 200],
  // Social downloaders (work with cookies on most platforms)
  ['instagram-downloader', 198],
  ['youtube-downloader', 196],
  ['youtube-to-mp3', 194],
  ['video-downloader', 192],
  ['video-compressor', 190],
  // Exam / study companions
  ['study-planner', 188],
  ['exam-countdown-calculator', 186],
  ['pomodoro-timer', 184],
  ['flashcard-generator', 182],
  ['reading-time-calculator', 180],
  ['plagiarism-risk-checker', 178],
  ['resume-bullet-generator', 176],
  ['cover-letter-generator', 174],
  // Date / time micro-tools
  ['date-calculator', 172],
  ['time-calculator', 170],
  ['days-to-hours', 168],
  ['days-to-weeks', 166],
  // Number / dev quick-use
  ['random-number-generator', 164],
  ['decimal-to-binary', 162],
  ['binary-to-decimal', 160],
  ['hex-to-decimal', 158],
  ['decimal-to-hex', 156],
  ['rgb-to-hex', 154],
  ['hex-to-rgb', 152],
  ['roman-numeral-converter', 150],
])

const SEARCH_SYNONYMS: Record<string, string[]> = {
  combine: ['merge', 'join', 'jodo', 'milao'],
  join: ['merge', 'combine', 'jodo', 'milao'],
  merge: ['combine', 'join', 'jodo', 'milao'],
  shrink: ['compress', 'reduce', 'minify', 'optimize', 'kam', 'chhota'],
  compress: ['shrink', 'reduce', 'optimize', 'minify', 'kam', 'chhota', 'small'],
  reduce: ['compress', 'shrink', 'kam', 'chhota'],
  small: ['compress', 'shrink', 'chhota', 'reduce'],
  big: ['enlarge', 'large', 'bada', 'upscale'],
  large: ['big', 'enlarge', 'bada'],
  bg: ['background', 'remove background'],
  background: ['bg', 'remove background'],
  remove: ['delete', 'erase', 'hatao', 'nikalo'],
  delete: ['remove', 'hatao'],
  erase: ['remove', 'delete', 'hatao'],
  cut: ['crop', 'trim', 'kato'],
  crop: ['cut', 'trim', 'kato'],
  trim: ['cut', 'crop'],
  rotate: ['turn', 'flip', 'ghumao'],
  flip: ['rotate', 'mirror'],
  split: ['divide', 'separate', 'alag'],
  divide: ['split', 'separate', 'alag'],
  convert: ['change', 'transform', 'badlo'],
  change: ['convert', 'badlo'],
  transform: ['convert', 'change'],
  calculator: ['calc', 'calculate', 'ganit', 'hisab'],
  calc: ['calculator', 'calculate'],
  calculate: ['calculator', 'compute', 'hisab'],
  hisab: ['calculator', 'calculate'],
  scientific: ['calculator', 'math', 'sin', 'cos', 'log', 'fx-991'],
  fx: ['scientific', 'calculator'],
  '991': ['scientific', 'calculator'],
  'fx-991': ['scientific', 'calculator'],
  fx991: ['scientific', 'calculator'],
  casio: ['scientific', 'calculator'],
  maths: ['math', 'calculator'],
  math: ['maths', 'calculator'],
  kam: ['compress', 'small', 'reduce'],
  chhota: ['compress', 'small', 'reduce'],
  bada: ['enlarge', 'big', 'upscale'],
  photo: ['image', 'picture', 'pic', 'tasveer'],
  image: ['photo', 'picture', 'img', 'pic', 'tasveer'],
  img: ['image', 'photo', 'picture'],
  pic: ['image', 'photo', 'picture'],
  picture: ['image', 'photo'],
  jpeg: ['jpg', 'image'],
  jpg: ['jpeg', 'image'],
  png: ['image'],
  webp: ['image'],
  heic: ['image', 'iphone photo'],
  pdf: ['document', 'file'],
  document: ['pdf', 'doc', 'file'],
  doc: ['document', 'word', 'pdf'],
  docx: ['word', 'document'],
  word: ['docx', 'document'],
  xlsx: ['excel', 'spreadsheet'],
  excel: ['xlsx', 'spreadsheet'],
  pptx: ['powerpoint', 'presentation', 'slides'],
  powerpoint: ['pptx', 'presentation', 'slides'],
  qr: ['qrcode', 'qr code', 'scanner'],
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
  shorts: ['youtube', 'reel', 'video'],
  fb: ['facebook'],
  facebook: ['fb'],
  twitter: ['x', 'tweet'],
  tiktok: ['tt'],
  download: ['save', 'fetch', 'get', 'downloader'],
  save: ['download', 'fetch', 'get'],
  get: ['download', 'fetch'],
  saver: ['download', 'save'],
  downloader: ['download', 'save'],
  create: ['generate', 'make', 'banao'],
  generator: ['create', 'generate', 'maker', 'banao'],
  generate: ['create', 'make', 'banao', 'maker'],
  maker: ['generator', 'create', 'banao'],
  banao: ['make', 'create', 'generate'],
  milao: ['merge', 'combine'],
  jodo: ['merge', 'join', 'combine'],
  hatao: ['remove', 'delete'],
  nikalo: ['extract', 'remove'],
  badlo: ['convert', 'change'],
  ghumao: ['rotate'],
  kato: ['cut', 'crop'],
  alag: ['split', 'separate'],
  kaise: ['how'],
  // Indian exam keywords — students literally type these
  ssc: ['photo size', 'image size', 'kb', 'compress'],
  upsc: ['photo size', 'image size', 'compress', 'pdf'],
  rrb: ['photo size', 'image size', 'compress'],
  ibps: ['photo size', 'image size', 'compress'],
  jee: ['photo size', 'compress', 'pdf'],
  neet: ['photo size', 'compress', 'pdf'],
  cuet: ['photo size', 'compress'],
  gate: ['photo size', 'compress'],
  cat: ['photo size', 'compress', 'percentile'],
  upsssc: ['photo size', 'compress'],
  board: ['marks', 'percentage', 'cgpa'],
  exam: ['photo size', 'study', 'countdown'],
  marks: ['percentage', 'cgpa', 'gpa'],
  percent: ['percentage', 'percent'],
  signature: ['photo', 'image', 'compress'],
  aadhaar: ['photo', 'compress', 'pdf'],
  aadhar: ['aadhaar', 'photo', 'compress'],
  pan: ['photo', 'compress'],
  passport: ['photo', 'image', 'size'],
  emi: ['loan', 'calculator'],
  loan: ['emi', 'calculator'],
  sip: ['mutual fund', 'calculator', 'investment'],
  gst: ['tax', 'calculator'],
  tax: ['income tax', 'gst', 'calculator'],
  ocr: ['image to text', 'extract text', 'scan'],
  paraphrase: ['rewrite', 'rephrase'],
  rewrite: ['paraphrase'],
  resume: ['cv', 'biodata'],
  cv: ['resume'],
  // Common typos and shortforms that students/normal users actually type
  calulator: ['calculator'],
  calcultor: ['calculator'],
  caculator: ['calculator'],
  convertor: ['converter'],
  conver: ['converter', 'convert'],
  downlaod: ['download'],
  donwload: ['download'],
  dowload: ['download'],
  donload: ['download'],
  comprss: ['compress'],
  compres: ['compress'],
  comress: ['compress'],
  resze: ['resize'],
  resise: ['resize'],
  rotat: ['rotate'],
  cropp: ['crop'],
  passwrd: ['password'],
  pasword: ['password'],
  generater: ['generator'],
  genrator: ['generator'],
  pdfto: ['pdf to'],
  topdf: ['to pdf'],
  imageto: ['image to'],
  toimage: ['to image'],
  // Workflow phrases people type as a single search
  'background remover': ['remove background', 'bg remover'],
  'photo size': ['compress', 'resize', 'kb', 'image size'],
  'pic size': ['compress', 'resize', 'photo size'],
  'image kb': ['compress', 'resize', 'photo size'],
  // Color tools
  hex: ['color', 'rgb'],
  rgb: ['color', 'hex'],
  hsl: ['color', 'rgb'],
  color: ['hex', 'rgb', 'hsl', 'palette'],
  palette: ['color', 'theme'],
  // Audio/video extras
  mp3: ['audio', 'music', 'sound'],
  mp4: ['video'],
  audio: ['mp3', 'sound', 'music'],
  music: ['mp3', 'audio'],
  video: ['mp4', 'movie'],
  // Data formats
  csv: ['excel', 'spreadsheet', 'data'],
  yaml: ['yml', 'config'],
  yml: ['yaml'],
  xml: ['data'],
  // Time and date
  countdown: ['timer', 'clock'],
  timer: ['countdown', 'stopwatch'],
  stopwatch: ['timer'],
  age: ['birthday', 'umar', 'years'],
  umar: ['age', 'birthday'],
  birthday: ['age', 'date'],
  // Money / India-specific (note: `emi` is already defined above)
  kist: ['emi', 'installment', 'loan'],
  rupees: ['inr', 'rs', 'currency'],
  inr: ['rupees', 'rs'],
  // Crypto / dev
  hash: ['md5', 'sha', 'checksum'],
  md5: ['hash', 'checksum'],
  sha: ['hash', 'checksum'],
  jwt: ['token', 'json web token'],
  token: ['jwt'],
  // Common app categories
  whatsapp: ['wa', 'message', 'chat'],
  wa: ['whatsapp'],
  telegram: ['tg', 'message'],
  tg: ['telegram'],
  // English ↔ Hinglish action verbs
  banane: ['make', 'create', 'generate'],
  banakar: ['make', 'create'],
  hatake: ['remove', 'delete'],
  hatana: ['remove', 'delete'],
  badle: ['convert', 'change'],
  badalo: ['convert', 'change'],
  // Education extras
  attendance: ['hazri', 'percentage', 'class'],
  hazri: ['attendance'],
  syllabus: ['course', 'study'],
  notes: ['pdf', 'study', 'document'],
  result: ['marks', 'percentage', 'cgpa'],
}

export type SearchOptions = {
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

// Stopwords (English + Hinglish/Hindi grammar particles + marketing fluff) that
// shouldn't disqualify tools when present in the query. e.g. "jpg ko pdf" → "jpg pdf".
const STOPWORDS = new Set([
  // English fillers
  'a', 'an', 'the', 'of', 'for', 'with', 'and', 'or', 'in', 'on', 'at', 'to', 'is', 'are',
  'my', 'me', 'i', 'we', 'you', 'your',
  'best', 'free', 'online', 'fast', 'easy', 'simple', 'quick', 'top', 'new',
  'app', 'website', 'site', 'tool', 'tools',
  // Hinglish / Hindi grammar particles
  'ko', 'ka', 'ki', 'ke', 'se', 'mai', 'mein', 'mera', 'meri', 'tera', 'teri',
  'wala', 'wali', 'walay', 'wale', 'kar', 'karo', 'karna', 'karne', 'kaise',
  'hai', 'ho', 'hoga', 'thi', 'tha',
])

function termsFromQuery(query: string) {
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => !STOPWORDS.has(t))
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
