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
  'utility': {
    accent: '#ffd166',
    surface: 'rgba(35, 28, 8, 0.82)',
    glow: 'rgba(255, 209, 102, 0.2)',
    label: 'Utility',
  },
  'pdf-insights': {
    accent: '#fca5a5',
    surface: 'rgba(34, 14, 14, 0.84)',
    glow: 'rgba(252, 165, 165, 0.2)',
    label: 'PDF Insights',
  },
  'text-cleanup': {
    accent: '#93c5fd',
    surface: 'rgba(12, 21, 38, 0.84)',
    glow: 'rgba(147, 197, 253, 0.2)',
    label: 'Text Cleanup',
  },
  'batch-automation': {
    accent: '#86efac',
    surface: 'rgba(12, 30, 20, 0.84)',
    glow: 'rgba(134, 239, 172, 0.2)',
    label: 'Batch Automation',
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
  'developer-tools': {
    accent: '#06b6d4',
    surface: 'rgba(6, 22, 30, 0.84)',
    glow: 'rgba(6, 182, 212, 0.22)',
    label: 'Developer',
  },
  'color-tools': {
    accent: '#e879f9',
    surface: 'rgba(32, 12, 38, 0.84)',
    glow: 'rgba(232, 121, 249, 0.22)',
    label: 'Color',
  },
  'unit-converter': {
    accent: '#14b8a6',
    surface: 'rgba(6, 26, 24, 0.84)',
    glow: 'rgba(20, 184, 166, 0.22)',
    label: 'Converter',
  },
  'hash-crypto': {
    accent: '#f97316',
    surface: 'rgba(36, 18, 6, 0.84)',
    glow: 'rgba(249, 115, 22, 0.22)',
    label: 'Crypto',
  },
  'seo-tools': {
    accent: '#84cc16',
    surface: 'rgba(18, 28, 6, 0.84)',
    glow: 'rgba(132, 204, 22, 0.22)',
    label: 'SEO',
  },
  'code-tools': {
    accent: '#a78bfa',
    surface: 'rgba(22, 14, 38, 0.84)',
    glow: 'rgba(167, 139, 250, 0.22)',
    label: 'Code',
  },
  'math-tools': {
    accent: '#f59e0b',
    surface: 'rgba(36, 24, 6, 0.84)',
    glow: 'rgba(245, 158, 11, 0.22)',
    label: 'Calculator',
  },
  'student-tools': {
    accent: '#10b981',
    surface: 'rgba(6, 28, 20, 0.84)',
    glow: 'rgba(16, 185, 129, 0.22)',
    label: 'Everyday',
  },
  'security-tools': {
    accent: '#ef4444',
    surface: 'rgba(36, 10, 10, 0.84)',
    glow: 'rgba(239, 68, 68, 0.22)',
    label: 'Security',
  },
  'conversion-tools': {
    accent: '#14b8a6',
    surface: 'rgba(6, 26, 24, 0.84)',
    glow: 'rgba(20, 184, 166, 0.22)',
    label: 'Converters',
  },
  'social-media': {
    accent: '#f472b6',
    surface: 'rgba(33, 11, 27, 0.84)',
    glow: 'rgba(244, 114, 182, 0.22)',
    label: 'Social Media',
  },
  'health-tools': {
    accent: '#4ade80',
    surface: 'rgba(8, 28, 18, 0.86)',
    glow: 'rgba(74, 222, 128, 0.22)',
    label: 'Health & Fitness',
  },
  'finance-tools': {
    accent: '#fbbf24',
    surface: 'rgba(35, 26, 6, 0.86)',
    glow: 'rgba(251, 191, 36, 0.22)',
    label: 'Finance & Tax',
  },
  'network-tools': {
    accent: '#818cf8',
    surface: 'rgba(14, 13, 38, 0.88)',
    glow: 'rgba(129, 140, 248, 0.22)',
    label: 'Network & Domain',
  },
  'video-tools': {
    accent: '#f87171',
    surface: 'rgba(30, 14, 14, 0.88)',
    glow: 'rgba(248, 113, 113, 0.22)',
    label: 'Video Tools',
  },
  'productivity': {
    accent: '#34d399',
    surface: 'rgba(10, 25, 20, 0.86)',
    glow: 'rgba(52, 211, 153, 0.22)',
    label: 'Productivity',
  },
  'science-tools': {
    accent: '#38bdf8',
    surface: 'rgba(6, 18, 30, 0.88)',
    glow: 'rgba(56, 189, 248, 0.24)',
    label: 'Science',
  },
  'geography-tools': {
    accent: '#4ade80',
    surface: 'rgba(7, 24, 14, 0.88)',
    glow: 'rgba(74, 222, 128, 0.22)',
    label: 'Geography',
  },
  'cooking-tools': {
    accent: '#fb923c',
    surface: 'rgba(34, 16, 6, 0.86)',
    glow: 'rgba(251, 146, 60, 0.24)',
    label: 'Cooking',
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
  'remove-image-object',
  'blur-background',
  'blur-face',
  'unblur-face',
  'pixelate-face',
  'add-text-image',
  'add-logo-image',
  'join-images',
  'split-image',
  'image-splitter',
  'circle-crop-image',
  'square-crop-image',
  'image-color-picker',
  'motion-blur-image',
  'tiff-to-pdf',
  'jpg-to-png',
  'jpeg-to-png',
  'png-to-jpg',
  'png-to-jpeg',
  'image-to-webp',
  'flip-image',
  'add-border-image',
  'thumbnail-image',
  'image-collage',
  'check-image-dpi',
  'convert-dpi',
  'resize-image-pixel',
  'resize-signature',
  'resize-image-to-3.5cmx4.5cm',
  'resize-image-to-6cmx2cm',
  'resize-signature-to-50mmx20mm',
  'resize-image-to-35mmx45mm',
  'resize-image-to-2x2',
  'resize-image-to-3x4',
  'resize-image-to-4x6',
  'resize-image-to-600x600-pixel',
  'resize-image-for-whatsapp-dp',
  'resize-image-for-youtube-banner',
  'resize-image-to-a4-size',
  'resize-image-in-cm',
  'resize-image-in-mm',
  'resize-image-in-inch',
  'increase-image-size-in-kb',
  'reduce-image-size-in-kb',
  'compress-to-kb',
  'compress-to-5kb',
  'compress-to-10kb',
  'compress-to-20kb',
  'compress-to-50kb',
  'compress-to-100kb',
  'compress-to-200kb',
  'compress-to-500kb',
  'compress-to-1mb',
  'reduce-image-size-in-mb',
  'convert-image-from-mb-to-kb',
  'convert-image-size-kb-to-mb',
  'jpg-to-kb',
  'compress-to-15kb',
  'compress-to-25kb',
  'compress-to-30kb',
  'compress-to-40kb',
  'compress-to-150kb',
  'compress-to-300kb',
  'compress-to-2mb',
  'jpeg-to-jpg',
  'jpg-to-pdf-under-50kb',
  'jpg-to-pdf-under-100kb',
  'jpeg-to-pdf-under-200kb',
  'jpg-to-pdf-under-300kb',
  'jpg-to-pdf-under-500kb',
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
const IMAGE_METADATA_INPUT_SLUGS = new Set(['remove-image-metadata'])

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
  if (IMAGE_METADATA_INPUT_SLUGS.has(slug)) {
    return '.png,.jpg,.jpeg,.webp,.gif,.bmp,.tif,.tiff,.heic,.heif'
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
  const isTextInput = tool.input_kind === 'text'

  if (tool.category === 'pdf-security') {
    return [
      'Upload the PDF you want to secure, unlock, redact, or sign.',
      'Enter the required password, keyword, or signature settings.',
      'Click Run and download your secured PDF instantly.',
    ]
  }

  if (tool.category === 'text-ai' || tool.slug.includes('translate')) {
    return [
      'Paste your text or upload a source document.',
      'Select the target language or AI processing option.',
      'Click Run to get the translated or transformed result instantly.',
    ]
  }

  if (tool.category.startsWith('image')) {
    return [
      'Upload one or more images (JPG, PNG, WEBP, etc.).',
      'Adjust settings like size, quality, angle, or overlay options.',
      'Click Run and download your processed image immediately.',
    ]
  }

  if (tool.slug.includes('qr') || tool.slug.includes('barcode')) {
    return [
      'Enter the URL, text, or data to encode.',
      'Customize size, format, or error correction level.',
      'Click Generate, then download your QR code or barcode image.',
    ]
  }

  if (tool.slug.includes('password') && tool.slug.includes('generator')) {
    return [
      'Set the desired password length.',
      'Toggle character types: uppercase, lowercase, numbers, symbols.',
      'Click Generate to instantly create a strong, secure password.',
    ]
  }

  if (
    tool.category === 'math-tools' ||
    tool.category === 'unit-converter' ||
    tool.slug.includes('calculator') ||
    tool.slug.includes('converter')
  ) {
    return [
      'Enter your values into the input fields.',
      'Select units or category if applicable.',
      'Click Calculate / Convert to see your result instantly.',
    ]
  }

  if (tool.category === 'color-tools') {
    return [
      'Enter a color value (HEX, RGB, HSL) or use the color picker.',
      'Adjust any palette or gradient options as needed.',
      'Copy the converted values or download the generated palette.',
    ]
  }

  if (tool.category === 'hash-crypto' || tool.category === 'security-tools') {
    return [
      'Paste the text, file, or value you want to hash or encrypt.',
      'Choose the algorithm (MD5, SHA-256, SHA-512, etc.) if applicable.',
      'Click Run to get your hash or encrypted output instantly.',
    ]
  }

  if (tool.category === 'student-tools' || tool.category === 'seo-tools') {
    return [
      'Fill in the required details or paste the relevant data.',
      'Adjust any advanced options shown in the form.',
      'Click Run and copy or download the generated result.',
    ]
  }

  if (
    tool.category === 'developer' ||
    tool.category === 'code-tools' ||
    tool.category === 'format-lab' ||
    isTextInput
  ) {
    const actionWord = tool.slug.includes('generator') ? 'click Generate' : 'click Run'
    return [
      'Paste your code, text, or data into the input area.',
      'Adjust any options like indent size, format, or encoding type.',
      `${actionWord} to get the formatted, validated, or generated output instantly — no signup needed.`,
    ]
  }

  if (tool.category.startsWith('pdf')) {
    return [
      'Upload your PDF file(s) — drag & drop or browse.',
      'Set any page range, output format, or quality options.',
      'Click Run and download the converted or processed PDF.',
    ]
  }

  if (tool.category.includes('document') || tool.category.includes('office') || tool.category.includes('ebook')) {
    return [
      'Upload your document (DOCX, PPTX, XLSX, etc.).',
      'Select the output format and any conversion options.',
      'Click Run and download the converted file in seconds.',
    ]
  }

  return [
    'Upload the required source file(s) or enter your data.',
    'Adjust the tool-specific settings shown in the form.',
    'Click Run and download or copy your result — completely free.',
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
