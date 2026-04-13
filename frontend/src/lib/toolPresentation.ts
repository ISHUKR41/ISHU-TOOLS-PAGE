import type { ToolDefinition } from '../types/tools'

type CategoryTheme = {
  accent: string
  surface: string
  glow: string
  label: string
}

const DEFAULT_THEME: CategoryTheme = {
  accent: '#3bd0ff',
  surface: 'rgba(13, 20, 38, 0.84)',
  glow: 'rgba(59, 208, 255, 0.22)',
  label: 'Workspace',
}

const CATEGORY_THEME_MAP: Record<string, CategoryTheme> = {
  'pdf-core': {
    accent: '#56a6ff',
    surface: 'rgba(12, 19, 38, 0.88)',
    glow: 'rgba(86, 166, 255, 0.24)',
    label: 'Core PDF',
  },
  'pdf-security': {
    accent: '#ff6f91',
    surface: 'rgba(38, 15, 28, 0.82)',
    glow: 'rgba(255, 111, 145, 0.22)',
    label: 'Security',
  },
  'pdf-advanced': {
    accent: '#a78bfa',
    surface: 'rgba(25, 16, 40, 0.82)',
    glow: 'rgba(167, 139, 250, 0.2)',
    label: 'Advanced PDF',
  },
  'image-core': {
    accent: '#3ee58f',
    surface: 'rgba(10, 28, 22, 0.82)',
    glow: 'rgba(62, 229, 143, 0.2)',
    label: 'Image Core',
  },
  'image-effects': {
    accent: '#ffb648',
    surface: 'rgba(34, 22, 8, 0.82)',
    glow: 'rgba(255, 182, 72, 0.2)',
    label: 'Effects',
  },
  'image-enhance': {
    accent: '#7dd3fc',
    surface: 'rgba(8, 22, 32, 0.82)',
    glow: 'rgba(125, 211, 252, 0.2)',
    label: 'Enhance',
  },
  'document-convert': {
    accent: '#22d3ee',
    surface: 'rgba(7, 25, 32, 0.82)',
    glow: 'rgba(34, 211, 238, 0.2)',
    label: 'Convert',
  },
  'office-suite': {
    accent: '#38bdf8',
    surface: 'rgba(10, 18, 33, 0.84)',
    glow: 'rgba(56, 189, 248, 0.2)',
    label: 'Office Suite',
  },
  'ocr-vision': {
    accent: '#f472b6',
    surface: 'rgba(33, 11, 27, 0.84)',
    glow: 'rgba(244, 114, 182, 0.22)',
    label: 'Vision AI',
  },
  'ebook-convert': {
    accent: '#a3e635',
    surface: 'rgba(21, 30, 8, 0.84)',
    glow: 'rgba(163, 230, 53, 0.18)',
    label: 'eBook Convert',
  },
  'vector-lab': {
    accent: '#fb923c',
    surface: 'rgba(36, 18, 8, 0.84)',
    glow: 'rgba(251, 146, 60, 0.2)',
    label: 'Vector Lab',
  },
  'text-ai': {
    accent: '#f973ff',
    surface: 'rgba(32, 11, 35, 0.82)',
    glow: 'rgba(249, 115, 255, 0.2)',
    label: 'AI Tools',
  },
  utility: {
    accent: '#ffd166',
    surface: 'rgba(35, 28, 8, 0.82)',
    glow: 'rgba(255, 209, 102, 0.2)',
    label: 'Utility',
  },
  'page-ops': {
    accent: '#2dd4bf',
    surface: 'rgba(9, 29, 28, 0.82)',
    glow: 'rgba(45, 212, 191, 0.2)',
    label: 'Page Ops',
  },
  'format-lab': {
    accent: '#fb7185',
    surface: 'rgba(34, 12, 18, 0.82)',
    glow: 'rgba(251, 113, 133, 0.2)',
    label: 'Format Lab',
  },
  'data-tools': {
    accent: '#60a5fa',
    surface: 'rgba(13, 19, 36, 0.82)',
    glow: 'rgba(96, 165, 250, 0.2)',
    label: 'Data Export',
  },
  'image-layout': {
    accent: '#34d399',
    surface: 'rgba(8, 29, 22, 0.82)',
    glow: 'rgba(52, 211, 153, 0.2)',
    label: 'Layout',
  },
  'text-ops': {
    accent: '#f59e0b',
    surface: 'rgba(34, 23, 5, 0.82)',
    glow: 'rgba(245, 158, 11, 0.2)',
    label: 'Text Ops',
  },
  'archive-lab': {
    accent: '#c084fc',
    surface: 'rgba(28, 14, 35, 0.82)',
    glow: 'rgba(192, 132, 252, 0.2)',
    label: 'Archive',
  },
}

const PDF_INPUT_SLUGS = new Set([
  'merge-pdf',
  'split-pdf',
  'optimize-pdf',
  'compress-pdf',
  'rotate-pdf',
  'organize-pdf',
  'crop-pdf',
  'watermark-pdf',
  'add-watermark',
  'page-numbers-pdf',
  'add-page-numbers',
  'protect-pdf',
  'pdf-security',
  'unlock-pdf',
  'redact-pdf',
  'compare-pdf',
  'extract-text-pdf',
  'extract-images-pdf',
  'pdf-to-jpg',
  'pdf-to-png',
  'repair-pdf',
  'translate-pdf',
  'summarize-pdf',
  'pdf-to-docx',
  'pdf-to-excel',
  'pdf-to-pptx',
  'sign-pdf',
  'edit-metadata-pdf',
  'edit-pdf',
  'annotate-pdf',
  'highlight-pdf',
  'pdf-filler',
  'pdf-viewer',
  'pdf-intelligence',
  'pdf-ocr',
  'convert-from-pdf',
  'pdf-to-word',
  'pdf-to-powerpoint',
  'remove-pages',
  'pdf-to-pdfa',
  'ocr-pdf',
  'chat-with-pdf',
  'ai-summarizer',
  'pdf-to-image',
  'pdf-to-tiff',
  'pdf-to-svg',
  'pdf-to-rtf',
  'pdf-to-odt',
  'pdf-to-epub',
  'extract-pages',
  'delete-pages',
  'rearrange-pages',
  'add-text-pdf',
  'header-footer-pdf',
  'resize-pages-pdf',
  'remove-metadata-pdf',
  'whiteout-pdf',
  'grayscale-pdf',
  'pdf-to-txt',
  'pdf-to-markdown',
  'pdf-to-json',
  'pdf-to-csv',
  'pdf-pages-to-zip',
])

const IMAGE_INPUT_SLUGS = new Set([
  'jpg-to-pdf',
  'heic-to-pdf',
  'heif-to-pdf',
  'jfif-to-pdf',
  'image-to-pdf',
  'png-to-pdf',
  'webp-to-pdf',
  'gif-to-pdf',
  'bmp-to-pdf',
  'compress-image',
  'resize-image',
  'crop-image',
  'rotate-image',
  'convert-image',
  'watermark-image',
  'add-name-dob-image',
  'merge-photo-signature',
  'grayscale-image',
  'black-and-white-image',
  'blur-image',
  'pixelate-image',
  'picture-to-pixel-art',
  'meme-generator',
  'remove-metadata-image',
  'scan-to-pdf',
  'upscale-image',
  'ocr-image',
  'image-to-text',
  'jpg-to-text',
  'png-to-text',
  'remove-background',
  'blur-background',
  'blur-face',
  'pixelate-face',
  'add-text-image',
  'add-logo-image',
  'join-images',
  'split-image',
  'circle-crop-image',
  'square-crop-image',
  'image-color-picker',
  'motion-blur-image',
  'tiff-to-pdf',
  'jpg-to-png',
  'png-to-jpg',
  'image-to-webp',
  'flip-image',
  'add-border-image',
  'thumbnail-image',
  'image-collage',
  'check-image-dpi',
  'convert-dpi',
  'resize-image-in-cm',
  'resize-image-in-mm',
  'resize-image-in-inch',
  'censor-photo',
  'generate-signature',
])

const ARCHIVE_INPUT_SLUGS = new Set(['zip-images-to-pdf', 'zip-to-pdf'])

const TEXT_FILE_INPUT_SLUGS = new Set(['json-to-pdf', 'xml-to-pdf', 'csv-to-pdf'])
const DOCX_INPUT_SLUGS = new Set(['docx-to-pdf', 'word-to-pdf'])
const EXCEL_INPUT_SLUGS = new Set(['excel-to-pdf'])
const PPTX_INPUT_SLUGS = new Set(['pptx-to-pdf', 'powerpoint-to-pdf'])
const MIXED_PDF_IMAGE_INPUT_SLUGS = new Set(['add-image-pdf', 'edit-pdf'])
const SVG_INPUT_SLUGS = new Set(['svg-to-pdf'])
const RTF_INPUT_SLUGS = new Set(['rtf-to-pdf'])
const ODT_INPUT_SLUGS = new Set(['odt-to-pdf'])
const EPUB_INPUT_SLUGS = new Set(['epub-to-pdf'])
const EML_INPUT_SLUGS = new Set(['eml-to-pdf'])
const FB2_INPUT_SLUGS = new Set(['fb2-to-pdf'])
const CBZ_INPUT_SLUGS = new Set(['cbz-to-pdf'])
const EBOOK_INPUT_SLUGS = new Set(['ebook-to-pdf'])
const GENERIC_PDF_INPUT_SLUGS = new Set(['convert-to-pdf', 'pdf-converter'])
const GENERIC_METADATA_INPUT_SLUGS = new Set(['edit-metadata', 'extract-metadata'])

export function getCategoryTheme(categoryId: string): CategoryTheme {
  return CATEGORY_THEME_MAP[categoryId] || DEFAULT_THEME
}

export function getToolAccept(slug: string): string | undefined {
  if (ARCHIVE_INPUT_SLUGS.has(slug)) return '.zip'
  if (DOCX_INPUT_SLUGS.has(slug)) return '.docx'
  if (EXCEL_INPUT_SLUGS.has(slug)) return '.xlsx,.xlsm'
  if (PPTX_INPUT_SLUGS.has(slug)) return '.pptx'
  if (SVG_INPUT_SLUGS.has(slug)) return '.svg'
  if (RTF_INPUT_SLUGS.has(slug)) return '.rtf'
  if (ODT_INPUT_SLUGS.has(slug)) return '.odt'
  if (EPUB_INPUT_SLUGS.has(slug)) return '.epub'
  if (EML_INPUT_SLUGS.has(slug)) return '.eml'
  if (FB2_INPUT_SLUGS.has(slug)) return '.fb2,.xml'
  if (CBZ_INPUT_SLUGS.has(slug)) return '.cbz'
  if (EBOOK_INPUT_SLUGS.has(slug)) return '.epub,.fb2,.cbz'
  if (GENERIC_PDF_INPUT_SLUGS.has(slug)) {
    return '.pdf,.docx,.pptx,.xlsx,.xlsm,.csv,.json,.xml,.txt,.md,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tif,.tiff,.jfif,.heic,.heif,.svg,.rtf,.odt,.epub,.eml,.fb2,.cbz'
  }
  if (GENERIC_METADATA_INPUT_SLUGS.has(slug)) {
    return '.pdf,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tif,.tiff,.heic,.heif'
  }
  if (MIXED_PDF_IMAGE_INPUT_SLUGS.has(slug)) {
    return '.pdf,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tif,.tiff'
  }
  if (PDF_INPUT_SLUGS.has(slug)) return '.pdf'
  if (IMAGE_INPUT_SLUGS.has(slug)) return '.png,.jpg,.jpeg,.webp,.gif,.bmp,.tif,.tiff'
  if (TEXT_FILE_INPUT_SLUGS.has(slug)) return '.json,.xml,.csv,.txt,.md,.log'
  return undefined
}

export function getToolOutputLabel(tool: ToolDefinition): string {
  if (
    tool.slug.includes('zip') ||
    tool.slug === 'split-pdf' ||
    tool.slug === 'split-image' ||
    tool.slug === 'image-color-picker'
  ) {
    return 'ZIP package'
  }
  if (
    tool.slug.includes('viewer') ||
    tool.slug.includes('intelligence') ||
    tool.slug.includes('dpi')
  ) {
    return 'JSON report'
  }
  if (tool.slug.includes('docx')) return 'DOCX document'
  if (tool.slug.includes('excel') || tool.slug.includes('xlsx')) return 'XLSX workbook'
  if (tool.slug.includes('pptx')) return 'PPTX presentation'
  if (tool.slug.includes('epub')) return 'EPUB eBook'
  if (tool.slug.includes('odt')) return 'ODT document'
  if (tool.slug.includes('rtf')) return 'RTF document'
  if (tool.slug.includes('svg')) return 'SVG vector'
  if (tool.slug.includes('tiff')) return 'TIFF output'
  if (tool.slug.includes('json')) return 'JSON output'
  if (tool.slug.includes('csv')) return 'CSV export'
  if (tool.slug.includes('txt') || tool.slug.includes('markdown')) return 'Text output'
  if (tool.slug.includes('image') || tool.slug.includes('jpg') || tool.slug.includes('png'))
    return 'Processed image'
  return 'Generated file'
}

export function getToolUsageSteps(tool: ToolDefinition): string[] {
  const commonTail = 'Run the tool and download the generated output immediately.'

  if (tool.category === 'pdf-security') {
    return [
      'Upload the PDF you want to secure, unlock, redact, or clean.',
      'Provide the required password or keyword settings for the operation.',
      commonTail,
    ]
  }

  if (tool.category === 'text-ai') {
    return [
      'Upload a source file or paste the text you want to process.',
      'Choose the target language or AI-style transformation options.',
      commonTail,
    ]
  }

  if (tool.category.startsWith('image')) {
    return [
      'Upload one or more images depending on the workflow.',
      'Tune the visual settings like size, quality, angle, or overlay text.',
      commonTail,
    ]
  }

  return [
    'Upload the required source files for this workflow.',
    'Adjust the tool-specific settings shown in the form.',
    commonTail,
  ]
}

function buildBadgeLabel(value: string) {
  const tokens = value
    .replace(/[^a-zA-Z0-9 ]+/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 2)

  return tokens.map((token) => token[0]?.toUpperCase() || '').join('') || 'IT'
}

function ensureMetaTag(name: string) {
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  return tag
}

export function applyDocumentBranding(title: string, subtitle: string, accent: string) {
  document.title = title

  const descriptionTag = ensureMetaTag('description')
  descriptionTag.setAttribute('content', subtitle)

  const badge = buildBadgeLabel(title)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${accent}"/>
          <stop offset="100%" stop-color="#07101f"/>
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="#050812"/>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#g)" opacity="0.95"/>
      <text
        x="32"
        y="39"
        font-size="22"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        fill="#ffffff"
        font-weight="700"
      >${badge}</text>
    </svg>
  `

  let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!favicon) {
    favicon = document.createElement('link')
    favicon.rel = 'icon'
    document.head.appendChild(favicon)
  }

  favicon.type = 'image/svg+xml'
  favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`
}
