/**
 * Map a dropped File → ranked list of tool slugs that can do something useful
 * with it. Used by the global SmartDropOverlay so a user can drop a PDF /
 * image / JSON / CSV / docx / video anywhere on the site and instantly see
 * the relevant tools.
 *
 * Strategy:
 *   1. Look up by MIME type (most reliable).
 *   2. Fall back to file-extension lookup (covers cases where the browser
 *      sends an empty / generic MIME like "application/octet-stream").
 *   3. Filter the resulting slug list against the live tool catalog so we
 *      never offer a tool that doesn't actually exist.
 *
 * The slug lists are intentionally ordered by daily-use frequency — first
 * entry = highest leverage / most common workflow for that file type.
 */

import type { ToolDefinition } from '../types/tools'

// ── MIME → ranked tool slugs ────────────────────────────────────────────────
const MIME_MAP: Record<string, string[]> = {
  // PDFs
  'application/pdf': [
    'compress-pdf', 'merge-pdf', 'split-pdf', 'pdf-to-word', 'pdf-to-jpg',
    'pdf-to-text', 'unlock-pdf', 'protect-pdf', 'rotate-pdf', 'watermark-pdf',
    'ocr-pdf', 'pdf-to-excel', 'pdf-to-ppt',
  ],

  // JSON / CSV / data
  'application/json':       ['json-formatter', 'json-to-csv', 'json-validator', 'json-minifier', 'json-to-yaml'],
  'text/csv':               ['csv-to-json', 'csv-to-excel', 'csv-to-pdf', 'csv-viewer', 'csv-formatter'],
  'application/xml':        ['xml-formatter', 'xml-to-json', 'xml-validator'],
  'text/xml':               ['xml-formatter', 'xml-to-json', 'xml-validator'],
  'application/x-yaml':     ['yaml-to-json', 'yaml-formatter'],
  'application/yaml':       ['yaml-to-json', 'yaml-formatter'],
  'text/yaml':              ['yaml-to-json', 'yaml-formatter'],

  // Plain text / markdown / html / code
  'text/plain':             ['text-to-pdf', 'text-summarizer', 'word-counter', 'translate-text', 'text-to-speech', 'case-converter'],
  'text/html':              ['html-to-pdf', 'html-to-markdown', 'html-formatter', 'html-minifier'],
  'text/markdown':          ['markdown-to-html', 'markdown-to-pdf', 'markdown-preview'],
  'text/css':               ['css-formatter', 'css-minifier', 'css-beautifier'],
  'text/javascript':        ['js-formatter', 'js-minifier', 'js-beautifier'],
  'application/javascript': ['js-formatter', 'js-minifier', 'js-beautifier'],
  'application/x-sql':      ['sql-formatter', 'sql-to-csv'],

  // Office docs
  'application/msword':                                                              ['word-to-pdf', 'docx-to-pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':         ['docx-to-pdf', 'word-to-pdf', 'docx-to-text'],
  'application/vnd.ms-excel':                                                        ['excel-to-pdf', 'xlsx-to-pdf', 'excel-to-csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':               ['xlsx-to-pdf', 'excel-to-pdf', 'excel-to-csv'],
  'application/vnd.ms-powerpoint':                                                   ['ppt-to-pdf', 'pptx-to-pdf'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':       ['pptx-to-pdf', 'ppt-to-pdf'],

  // Archives
  'application/zip':              ['unzip-file', 'extract-zip', 'zip-viewer'],
  'application/x-zip-compressed': ['unzip-file', 'extract-zip', 'zip-viewer'],
  'application/x-7z-compressed':  ['extract-7z', 'unzip-file'],
  'application/x-rar-compressed': ['extract-rar', 'unzip-file'],
  'application/x-tar':            ['extract-tar', 'unzip-file'],
  'application/gzip':             ['extract-gzip', 'unzip-file'],
}

// ── Image MIME prefix → image tools ─────────────────────────────────────────
const IMAGE_TOOLS = [
  'compress-image', 'resize-image', 'remove-background', 'crop-image',
  'convert-image', 'rotate-image', 'jpg-to-pdf', 'image-to-pdf',
  'upscale-image', 'watermark-image', 'flip-image', 'meme-generator',
  'jpg-to-png', 'png-to-jpg', 'webp-to-png', 'image-to-base64',
]

// ── Video MIME prefix → video tools ─────────────────────────────────────────
const VIDEO_TOOLS = [
  'compress-video', 'video-to-gif', 'trim-video', 'mp4-to-gif',
  'video-to-mp3', 'extract-audio', 'video-thumbnail',
]

// ── Audio MIME prefix → audio tools ─────────────────────────────────────────
const AUDIO_TOOLS = [
  'compress-audio', 'audio-to-text', 'convert-audio',
  'mp3-to-wav', 'audio-trimmer',
]

// ── Extension → ranked tool slugs (fallback) ────────────────────────────────
const EXT_MAP: Record<string, string[]> = {
  pdf:  MIME_MAP['application/pdf'],
  json: MIME_MAP['application/json'],
  csv:  MIME_MAP['text/csv'],
  xml:  MIME_MAP['application/xml'],
  yaml: MIME_MAP['application/yaml'],
  yml:  MIME_MAP['application/yaml'],
  txt:  MIME_MAP['text/plain'],
  html: MIME_MAP['text/html'],
  htm:  MIME_MAP['text/html'],
  md:   MIME_MAP['text/markdown'],
  markdown: MIME_MAP['text/markdown'],
  css:  MIME_MAP['text/css'],
  js:   MIME_MAP['text/javascript'],
  ts:   ['ts-formatter', 'js-formatter'],
  sql:  MIME_MAP['application/x-sql'],
  doc:  MIME_MAP['application/msword'],
  docx: MIME_MAP['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  xls:  MIME_MAP['application/vnd.ms-excel'],
  xlsx: MIME_MAP['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ppt:  MIME_MAP['application/vnd.ms-powerpoint'],
  pptx: MIME_MAP['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  zip:  MIME_MAP['application/zip'],
  '7z': MIME_MAP['application/x-7z-compressed'],
  rar:  MIME_MAP['application/x-rar-compressed'],
  tar:  MIME_MAP['application/x-tar'],
  gz:   MIME_MAP['application/gzip'],
  jpg:  IMAGE_TOOLS,
  jpeg: IMAGE_TOOLS,
  png:  IMAGE_TOOLS,
  webp: IMAGE_TOOLS,
  gif:  IMAGE_TOOLS,
  bmp:  IMAGE_TOOLS,
  tiff: IMAGE_TOOLS,
  tif:  IMAGE_TOOLS,
  heic: IMAGE_TOOLS,
  heif: IMAGE_TOOLS,
  avif: IMAGE_TOOLS,
  ico:  IMAGE_TOOLS,
  svg:  IMAGE_TOOLS,
  mp4:  VIDEO_TOOLS,
  mov:  VIDEO_TOOLS,
  webm: VIDEO_TOOLS,
  avi:  VIDEO_TOOLS,
  mkv:  VIDEO_TOOLS,
  mp3:  AUDIO_TOOLS,
  wav:  AUDIO_TOOLS,
  ogg:  AUDIO_TOOLS,
  flac: AUDIO_TOOLS,
  m4a:  AUDIO_TOOLS,
}

// Generic "anything goes" fallback for unrecognized files — show a few
// universal tools so the overlay never feels broken.
const GENERIC_FALLBACK = ['compress-image', 'json-formatter', 'text-to-pdf', 'qr-code-generator']

function getExtension(name: string): string {
  const idx = name.lastIndexOf('.')
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : ''
}

/** Human-friendly label for the dropped file's type ("PDF", "Image", "JSON", ...). */
export function describeFileType(file: File): string {
  const mime = file.type.toLowerCase()
  if (mime === 'application/pdf') return 'PDF'
  if (mime.startsWith('image/'))  return 'Image'
  if (mime.startsWith('video/'))  return 'Video'
  if (mime.startsWith('audio/'))  return 'Audio'
  if (mime === 'application/json') return 'JSON'
  if (mime === 'text/csv')         return 'CSV'
  if (mime === 'text/markdown')    return 'Markdown'
  if (mime === 'text/html')        return 'HTML'
  if (mime === 'application/zip' || mime === 'application/x-zip-compressed') return 'ZIP archive'
  if (mime.includes('wordprocessingml') || mime === 'application/msword')   return 'Word doc'
  if (mime.includes('spreadsheetml')   || mime === 'application/vnd.ms-excel') return 'Excel sheet'
  if (mime.includes('presentationml')  || mime === 'application/vnd.ms-powerpoint') return 'Slide deck'
  const ext = getExtension(file.name).toUpperCase()
  return ext ? `${ext} file` : 'File'
}

/**
 * Return up to `limit` matching tools (real `ToolDefinition` objects from the
 * live catalog) for the given file. Order = ranked-slug list ∩ catalog,
 * preserving the slug-list order. Fills any remaining slots from the generic
 * fallback so the overlay always has at least a few suggestions to show.
 */
export function matchToolsForFile(
  file: File,
  catalog: ToolDefinition[],
  limit = 8,
): ToolDefinition[] {
  if (!catalog.length) return []

  const bySlug = new Map<string, ToolDefinition>()
  for (const t of catalog) bySlug.set(t.slug, t)

  const seen = new Set<string>()
  const ordered: ToolDefinition[] = []

  function pushSlug(slug: string) {
    if (seen.has(slug)) return
    seen.add(slug)
    const tool = bySlug.get(slug)
    if (tool) ordered.push(tool)
  }

  // 1. MIME match
  const mime = file.type.toLowerCase()
  if (mime) {
    if (MIME_MAP[mime]) {
      MIME_MAP[mime].forEach(pushSlug)
    } else if (mime.startsWith('image/')) {
      IMAGE_TOOLS.forEach(pushSlug)
    } else if (mime.startsWith('video/')) {
      VIDEO_TOOLS.forEach(pushSlug)
    } else if (mime.startsWith('audio/')) {
      AUDIO_TOOLS.forEach(pushSlug)
    }
  }

  // 2. Extension fallback (covers empty / octet-stream MIME)
  if (ordered.length < limit) {
    const ext = getExtension(file.name)
    const extSlugs = ext ? EXT_MAP[ext] : null
    if (extSlugs) extSlugs.forEach(pushSlug)
  }

  // 3. Generic fallback so we always show something
  if (ordered.length < limit) {
    GENERIC_FALLBACK.forEach(pushSlug)
  }

  return ordered.slice(0, limit)
}
