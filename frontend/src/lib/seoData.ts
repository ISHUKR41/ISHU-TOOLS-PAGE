/**
 * ISHU TOOLS — Per-tool SEO Data (COMPREHENSIVE)
 * Every tool gets unique title, description, keywords, and FAQ for Google ranking.
 * Optimized for: high-volume, long-tail, Ishu-branded, niche keywords.
 */

export interface ToolSEO {
  title: string
  description: string
  keywords: string[]
  h1: string
  faq: { question: string; answer: string }[]
}

const SITE = 'ISHU TOOLS'

// ─── Auto-generator for any tool not in the handcrafted map ───
export function getToolSEO(slug: string, toolTitle: string, toolDescription: string, category: string): ToolSEO {
  const custom = TOOL_SEO_MAP[slug]
  if (custom) return custom

  const t = toolTitle.toLowerCase()
  const categoryLabel = getCategoryLabel(category)
  const intentKeywords = buildIntentKeywords(slug, t, categoryLabel)
  const conciseDescription = toolDescription.endsWith('.') ? toolDescription : `${toolDescription}.`
  return {
    title: `${toolTitle} Online Free — Fast ${categoryLabel} | ${SITE}`,
    description: `${conciseDescription} Use this free ${t} online on ${SITE}. Built for students, creators, developers, and daily users with no signup, no watermark, mobile support, and privacy-focused processing.`,
    keywords: [
      t, `free ${t}`, `online ${t}`, `${t} tool`, `${t} online free`, `best ${t}`,
      `${t} for students`, `${t} no signup`, `ishu ${t}`, `ishu tools ${t}`,
      slug.replace(/-/g, ' '), category.replace(/-/g, ' '),
      'ishu tools', 'ishutools', 'free online tools', 'student tools', 'no signup',
      'indian student hub university tools', 'ishu kumar tools',
      ...intentKeywords,
    ],
    h1: `${toolTitle} Online Free`,
    faq: [
      {
        question: `How to use ${toolTitle} online for free?`,
        answer: `Open ${toolTitle} on ISHU TOOLS, upload your file or enter your data, adjust the available options, and click "Run". The tool processes quickly with no signup, no watermark, and full mobile support.`,
      },
      {
        question: `Is ${toolTitle} on ISHU TOOLS safe and private?`,
        answer: `Yes. ${SITE} is designed for secure processing, clear outputs, and privacy-focused workflows. Use the tool only with files and text you are allowed to process.`,
      },
      {
        question: `Can I use ${toolTitle} on my phone or tablet?`,
        answer: `Absolutely! ${SITE} is fully responsive and works perfectly on all devices — smartphones, tablets, laptops, and desktops. No app download needed.`,
      },
      {
        question: `Why choose ISHU TOOLS for ${toolTitle}?`,
        answer: `${SITE} combines fast tool pages, simple navigation, student-focused workflows, Ishu-branded utility keywords, and reliable output handling so everyday tasks feel professional and easy.`,
      },
    ],
  }
}

function buildIntentKeywords(slug: string, title: string, categoryLabel: string): string[] {
  const base = slug.replace(/-/g, ' ')
  const keywords = [
    `${base} for students`,
    `${base} for college`,
    `${base} for school`,
    `${base} mobile friendly`,
    `${base} fast online`,
    `${base} privacy focused`,
    `${base} without login`,
    `free ${categoryLabel.toLowerCase()} by ishu`,
    `ishu student hub ${base}`,
    `indian student ${base} tool`,
  ]

  if (slug.includes('pdf')) {
    keywords.push(`${title} without watermark`, `${title} unlimited free`, `${title} for documents`)
  }
  if (slug.includes('image') || slug.includes('photo') || slug.includes('jpg') || slug.includes('png')) {
    keywords.push(`${title} for photos`, `${title} high quality`, `${title} resize compress edit`)
  }
  if (slug.includes('calculator') || categoryLabel.toLowerCase().includes('student')) {
    keywords.push(`${title} accurate calculator`, `${title} homework helper`, `${title} exam tool`)
  }
  if (categoryLabel.toLowerCase().includes('developer') || slug.includes('json') || slug.includes('code')) {
    keywords.push(`${title} developer utility`, `${title} code formatter`, `${title} web developer tool`)
  }

  return keywords
}

export function getToolJsonLd(slug: string, title: string, description: string, category: string): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${title} — ${SITE}`,
        url: `https://ishutools.com/tools/${slug}`,
        description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        author: { '@type': 'Person', name: 'Ishu Kumar', url: 'https://www.linkedin.com/in/ishu-kumar-5a0940281/' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '1250', bestRating: '5' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ishutools.com/' },
          { '@type': 'ListItem', position: 2, name: getCategoryLabel(category), item: `https://ishutools.com/category/${category}` },
          { '@type': 'ListItem', position: 3, name: title, item: `https://ishutools.com/tools/${slug}` },
        ],
      },
      {
        '@type': 'HowTo',
        name: `How to use ${title} online for free`,
        description: `Step by step guide to use ${title} for free at ISHU TOOLS`,
        totalTime: 'PT1M',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Open the tool', text: `Go to ISHU TOOLS and open ${title}` },
          { '@type': 'HowToStep', position: 2, name: 'Upload or enter data', text: 'Upload your file or enter text/data as required' },
          { '@type': 'HowToStep', position: 3, name: 'Process and download', text: 'Click Run and download your result instantly — free, no signup!' },
        ],
      },
    ],
  }
}

export function getFaqJsonLd(faqs: { question: string; answer: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    'pdf-core': 'PDF Tools',
    'pdf-security': 'PDF Security',
    'pdf-advanced': 'PDF Advanced',
    'image-core': 'Image Tools',
    'image-effects': 'Image Effects',
    'image-enhance': 'Image Enhancement',
    'image-layout': 'Image Layout',
    'document-convert': 'Document Convert',
    'office-suite': 'Office Suite',
    'text-ai': 'Text & AI',
    'text-ops': 'Text Operations',
    'text-cleanup': 'Text Cleanup',
    'utility': 'Utility Lab',
    'page-ops': 'Page Operations',
    'format-lab': 'Format Lab',
    'data-tools': 'Data & Export',
    'archive-lab': 'Archive Tools',
    'pdf-insights': 'PDF Insights',
    'batch-automation': 'Batch Automation',
    'ocr-vision': 'OCR & Vision AI',
    'ebook-convert': 'eBook Convert',
    'vector-lab': 'Vector & Scan',
    'math-tools': 'Math & Calculators',
    'student-tools': 'Student & Everyday',
    'developer-tools': 'Developer Tools',
    'color-tools': 'Color Tools',
    'security-tools': 'Security Tools',
    'social-media': 'Social Media Tools',
    'conversion-tools': 'Unit Converters',
    'seo-tools': 'SEO Tools',
    'code-tools': 'Code Tools',
    'hash-crypto': 'Hash & Crypto',
  }
  return map[category] || category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// ─── Handcrafted SEO for ALL major tools ───
const TOOL_SEO_MAP: Record<string, ToolSEO> = {

  // ════════════════════════════════════════════════
  //  PDF CORE TOOLS
  // ════════════════════════════════════════════════
  'merge-pdf': {
    title: 'Merge PDF — Combine PDF Files Online Free | ISHU TOOLS',
    description: 'Merge multiple PDF files into one document online for free. Combine PDFs in any order with the easiest PDF merger available. No signup, no watermark, unlimited use. Trusted by millions of students and professionals. Ishu Tools best PDF merger.',
    keywords: [
      'merge pdf', 'combine pdf', 'join pdf', 'pdf merger', 'merge pdf online free',
      'combine pdf files', 'pdf combiner', 'merge pdf files online', 'free pdf merger',
      'online pdf merger', 'join pdf files free', 'ishu tools merge pdf', 'ishu pdf merger',
      'merge pdf without watermark', 'merge pdf no signup', 'best pdf merger online',
      'combine multiple pdf files', 'pdf joiner online', 'merge pdf documents free',
    ],
    h1: 'Merge PDF — Combine PDF Files Online Free',
    faq: [
      { question: 'How to merge PDF files online for free?', answer: 'Upload multiple PDF files to ISHU TOOLS Merge PDF tool, arrange them in your desired order, and click "Run". Your merged PDF will be ready to download instantly — completely free, no signup required.' },
      { question: 'Can I merge more than 2 PDF files at once?', answer: 'Yes! You can merge unlimited PDF files at once with ISHU TOOLS. Simply upload all the PDFs you want to combine and our tool will merge them all into one document.' },
      { question: 'Is the merged PDF quality preserved?', answer: 'Absolutely! Our PDF merger preserves 100% of the original quality, formatting, images, and text. No compression or degradation occurs during merging.' },
      { question: 'Is ISHU TOOLS Merge PDF better than iLovePDF?', answer: 'ISHU TOOLS offers unlimited free PDF merging with no watermarks, no file size limits, and no signup required. Many users prefer ISHU TOOLS for its speed and simplicity.' },
    ],
  },
  'compress-pdf': {
    title: 'Compress PDF — Reduce PDF File Size Online Free | ISHU TOOLS',
    description: 'Compress PDF files online for free. Reduce PDF file size by up to 90% while maintaining quality. Choose from 4 compression levels. Best free PDF compressor — no signup, no watermark. Ishu Tools PDF compression.',
    keywords: [
      'compress pdf', 'reduce pdf size', 'pdf compressor', 'compress pdf online free',
      'shrink pdf', 'pdf size reducer', 'optimize pdf', 'make pdf smaller',
      'compress pdf file', 'free pdf compressor', 'online pdf compressor',
      'reduce pdf file size online', 'ishu tools compress pdf', 'best pdf compressor',
      'compress pdf without losing quality', 'pdf compression tool', 'shrink pdf size free',
      'ishu pdf compressor', 'compress large pdf online',
    ],
    h1: 'Compress PDF — Reduce File Size Online Free',
    faq: [
      { question: 'How to compress PDF files online?', answer: 'Upload your PDF to ISHU TOOLS Compress PDF, select compression quality (screen, ebook, printer, or prepress), and click "Run". Download your compressed PDF instantly — no signup needed.' },
      { question: 'How much can I reduce PDF file size?', answer: 'Depending on content, you can reduce PDF size by 50-90%. Our tool uses Ghostscript-level compression with 4 configurable quality levels.' },
      { question: 'Does compression reduce PDF quality?', answer: 'Our tool offers multiple levels. "Prepress" maintains highest quality with moderate compression, "Screen" gives maximum compression with good visual quality for screen viewing.' },
    ],
  },
  'split-pdf': {
    title: 'Split PDF — Split PDF Pages Online Free | ISHU TOOLS',
    description: 'Split PDF files into separate pages online for free. Extract specific pages or split entire PDF into individual files. Fast, free, no signup. Ishu Tools PDF splitter.',
    keywords: [
      'split pdf', 'split pdf online', 'pdf splitter', 'separate pdf pages',
      'split pdf free', 'pdf page splitter', 'split pdf online free', 'ishu tools split pdf',
      'extract pages from pdf', 'split pdf into pages', 'pdf separator',
      'split large pdf', 'divide pdf pages', 'ishu pdf splitter',
      'split pdf without watermark', 'break pdf into pages',
    ],
    h1: 'Split PDF — Separate PDF Pages Online Free',
    faq: [
      { question: 'How to split a PDF file into separate pages?', answer: 'Upload your PDF to ISHU TOOLS Split PDF tool, specify pages (all, or specific like 1,3,5), and click "Run". Each page is extracted and packaged in a ZIP for download.' },
      { question: 'Can I extract specific pages from a PDF?', answer: 'Yes! Enter page numbers like "1,3,5" or ranges like "2-6" to extract only the pages you need.' },
    ],
  },
  'rotate-pdf': {
    title: 'Rotate PDF — Rotate PDF Pages Online Free | ISHU TOOLS',
    description: 'Rotate PDF pages 90°, 180°, or 270° online for free. Fix PDF orientation easily. Rotate all pages at once. No signup, no watermark.',
    keywords: [
      'rotate pdf', 'rotate pdf pages', 'rotate pdf online', 'pdf rotator', 'turn pdf',
      'flip pdf pages', 'rotate pdf 90 degrees', 'fix pdf orientation', 'ishu tools rotate pdf',
      'rotate pdf free', 'pdf page rotation', 'ishu rotate pdf',
    ],
    h1: 'Rotate PDF Pages Online Free',
    faq: [
      { question: 'How to rotate PDF pages?', answer: 'Upload your PDF, set the rotation angle (90°, 180°, 270°), and click "Run". All pages will be rotated and ready for download.' },
    ],
  },
  'watermark-pdf': {
    title: 'Add Watermark to PDF — Stamp PDF Online Free | ISHU TOOLS',
    description: 'Add text watermark to PDF files online for free. Choose font size, text, and position. Protect your PDF documents with custom watermarks. No signup required.',
    keywords: [
      'watermark pdf', 'add watermark to pdf', 'pdf watermark', 'stamp pdf',
      'pdf watermark online', 'watermark pdf free', 'add text to pdf',
      'ishu tools watermark', 'pdf stamp tool', 'ishu watermark pdf',
    ],
    h1: 'Add Watermark to PDF — Free Online',
    faq: [],
  },
  'optimize-pdf': {
    title: 'Optimize PDF — Optimize PDF File Size Online Free | ISHU TOOLS',
    description: 'Optimize PDF files for smaller size and faster loading. Reduce PDF file size with advanced optimization. Free, no signup, no watermark.',
    keywords: [
      'optimize pdf', 'pdf optimizer', 'optimize pdf online', 'reduce pdf size',
      'pdf optimization', 'ishu tools optimize pdf', 'make pdf lighter', 'ishu pdf optimizer',
    ],
    h1: 'Optimize PDF — Reduce File Size Free',
    faq: [],
  },
  'repair-pdf': {
    title: 'Repair PDF — Fix Damaged PDF Files Online Free | ISHU TOOLS',
    description: 'Repair damaged or corrupted PDF files online for free. Recover data from broken PDFs. Fix PDF structure errors instantly. No signup required.',
    keywords: [
      'repair pdf', 'fix pdf', 'damaged pdf', 'corrupted pdf', 'pdf repair tool',
      'repair pdf online', 'fix broken pdf', 'recover pdf', 'ishu tools repair pdf',
      'pdf recovery', 'ishu repair pdf',
    ],
    h1: 'Repair PDF — Fix Damaged PDFs Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  PDF CONVERSION TOOLS
  // ════════════════════════════════════════════════
  'pdf-to-word': {
    title: 'PDF to Word — Convert PDF to DOCX Online Free | ISHU TOOLS',
    description: 'Convert PDF to Word (DOCX) online for free. Accurate PDF to Word conversion preserving formatting, tables, and images. No signup, no watermark, unlimited conversions. Ishu Tools PDF converter.',
    keywords: [
      'pdf to word', 'pdf to docx', 'convert pdf to word', 'pdf to word converter',
      'pdf to word online free', 'pdf to doc', 'free pdf to word converter',
      'online pdf to word', 'convert pdf to docx free', 'ishu tools pdf to word',
      'best pdf to word converter', 'pdf to editable word', 'ishu pdf to word',
      'pdf to word no watermark', 'accurate pdf to word conversion',
    ],
    h1: 'PDF to Word — Convert PDF to DOCX Online Free',
    faq: [
      { question: 'How to convert PDF to Word online for free?', answer: 'Upload your PDF file to ISHU TOOLS PDF to Word converter and click "Run". The converted DOCX file will be ready to download instantly — free, no signup.' },
      { question: 'Is the PDF to Word conversion accurate?', answer: 'Yes! Our converter preserves formatting, tables, images, and text layout with high accuracy.' },
      { question: 'Can I convert scanned PDF to Word?', answer: 'For scanned PDFs, use our OCR PDF tool first to extract searchable text, then convert to Word.' },
    ],
  },
  'word-to-pdf': {
    title: 'Word to PDF — Convert DOCX to PDF Online Free | ISHU TOOLS',
    description: 'Convert Word documents (DOC, DOCX) to PDF online for free. Preserve formatting perfectly. Fast, secure, no signup. Ishu Tools Word converter.',
    keywords: [
      'word to pdf', 'docx to pdf', 'convert word to pdf', 'doc to pdf',
      'word to pdf converter', 'word to pdf online free', 'convert docx to pdf',
      'ishu tools word to pdf', 'best word to pdf', 'ishu word to pdf',
      'word to pdf no watermark', 'free word to pdf converter',
    ],
    h1: 'Word to PDF — Convert DOCX to PDF Free',
    faq: [
      { question: 'How to convert Word to PDF?', answer: 'Upload your DOCX or DOC file to ISHU TOOLS and click "Run". Your PDF will preserve all formatting and be ready for download.' },
    ],
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG — Convert PDF to JPG Images Online Free | ISHU TOOLS',
    description: 'Convert PDF pages to high-quality JPG images online for free. Extract images from PDF. Each page becomes a separate JPG. No signup, no watermark.',
    keywords: [
      'pdf to jpg', 'convert pdf to jpg', 'pdf to image', 'pdf to jpeg',
      'pdf to jpg converter', 'pdf to jpg online free', 'extract images from pdf',
      'ishu tools pdf to jpg', 'pdf to picture', 'convert pdf pages to images',
      'ishu pdf to jpg', 'pdf to jpg high quality',
    ],
    h1: 'PDF to JPG — Convert PDF Pages to Images Free',
    faq: [
      { question: 'How to convert PDF to JPG?', answer: 'Upload your PDF to ISHU TOOLS PDF to JPG converter and click "Run". Each page will be rendered as a high-quality JPG image.' },
    ],
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF — Convert JPG Images to PDF Online Free | ISHU TOOLS',
    description: 'Convert JPG images to PDF online for free. Merge multiple JPG files into one PDF document. Adjust orientation and margins. No signup, no watermark.',
    keywords: [
      'jpg to pdf', 'convert jpg to pdf', 'image to pdf', 'jpeg to pdf',
      'jpg to pdf converter', 'jpg to pdf online free', 'photo to pdf',
      'picture to pdf', 'ishu tools jpg to pdf', 'multiple jpg to pdf',
      'ishu jpg to pdf', 'convert images to pdf free',
    ],
    h1: 'JPG to PDF — Convert Images to PDF Free',
    faq: [
      { question: 'How to convert JPG to PDF?', answer: 'Upload your JPG images to ISHU TOOLS and click "Run". All images will be combined into a single PDF.' },
      { question: 'Can I convert multiple JPG files to one PDF?', answer: 'Yes! Upload multiple JPG files and they will all be merged into one PDF document.' },
    ],
  },
  'pdf-to-excel': {
    title: 'PDF to Excel — Convert PDF to XLSX Online Free | ISHU TOOLS',
    description: 'Convert PDF tables and data to Excel (XLSX) spreadsheets online for free. Extract data from PDF into editable Excel format. No signup required.',
    keywords: [
      'pdf to excel', 'pdf to xlsx', 'convert pdf to excel', 'pdf to spreadsheet',
      'pdf to excel online free', 'extract data from pdf', 'ishu tools pdf to excel',
      'pdf table to excel', 'ishu pdf to excel', 'pdf data extractor',
    ],
    h1: 'PDF to Excel — Convert PDF to XLSX Free',
    faq: [
      { question: 'How to convert PDF to Excel?', answer: 'Upload your PDF containing tables or data to ISHU TOOLS and click "Run". The data will be extracted into an XLSX spreadsheet.' },
    ],
  },
  'excel-to-pdf': {
    title: 'Excel to PDF — Convert XLSX to PDF Online Free | ISHU TOOLS',
    description: 'Convert Excel spreadsheets (XLSX, XLS) to PDF online for free. Preserve table formatting. No signup, no watermark.',
    keywords: [
      'excel to pdf', 'xlsx to pdf', 'convert excel to pdf', 'spreadsheet to pdf',
      'excel to pdf online free', 'ishu tools excel to pdf', 'ishu excel to pdf',
    ],
    h1: 'Excel to PDF — Convert Spreadsheets to PDF Free',
    faq: [],
  },
  'pdf-to-pptx': {
    title: 'PDF to PowerPoint — Convert PDF to PPTX Online Free | ISHU TOOLS',
    description: 'Convert PDF to PowerPoint (PPTX) slides online for free. Transform PDF pages into editable presentation slides. No signup required.',
    keywords: [
      'pdf to powerpoint', 'pdf to pptx', 'convert pdf to ppt', 'pdf to slides',
      'pdf to powerpoint online free', 'ishu tools pdf to pptx', 'ishu pdf to powerpoint',
      'pdf to presentation', 'pdf to editable pptx',
    ],
    h1: 'PDF to PowerPoint — Convert to PPTX Free',
    faq: [],
  },
  'pptx-to-pdf': {
    title: 'PowerPoint to PDF — Convert PPTX to PDF Online Free | ISHU TOOLS',
    description: 'Convert PowerPoint presentations (PPTX, PPT) to PDF online for free. Preserve slide formatting perfectly. No signup required.',
    keywords: [
      'powerpoint to pdf', 'pptx to pdf', 'convert pptx to pdf', 'presentation to pdf',
      'ppt to pdf online free', 'ishu tools pptx to pdf', 'ishu powerpoint to pdf',
    ],
    h1: 'PowerPoint to PDF — Convert PPTX Free',
    faq: [],
  },
  'pdf-to-png': {
    title: 'PDF to PNG — Convert PDF to PNG Images Online Free | ISHU TOOLS',
    description: 'Convert PDF pages to PNG images online for free. High-quality transparent PNG output. No signup, no watermark.',
    keywords: [
      'pdf to png', 'convert pdf to png', 'pdf to png online', 'pdf to image png',
      'ishu tools pdf to png', 'pdf to png free', 'pdf to png converter',
    ],
    h1: 'PDF to PNG — Convert PDF Pages to PNG Free',
    faq: [],
  },
  'pdf-to-html': {
    title: 'PDF to HTML — Convert PDF to HTML Online Free | ISHU TOOLS',
    description: 'Convert PDF documents to HTML web pages online for free. Extract content as clean HTML. No signup required.',
    keywords: [
      'pdf to html', 'convert pdf to html', 'pdf to web page', 'pdf to html online',
      'ishu tools pdf to html', 'pdf to html free', 'pdf to html converter',
    ],
    h1: 'PDF to HTML — Convert PDF to Web Page Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  PDF SECURITY
  // ════════════════════════════════════════════════
  'unlock-pdf': {
    title: 'Unlock PDF — Remove PDF Password Online Free | ISHU TOOLS',
    description: 'Remove password protection from PDF files online for free. Unlock encrypted PDFs instantly. Decrypt password-protected PDFs. No signup required.',
    keywords: [
      'unlock pdf', 'remove pdf password', 'pdf unlocker', 'decrypt pdf',
      'unlock pdf online', 'remove pdf protection', 'unlock encrypted pdf',
      'ishu tools unlock pdf', 'pdf password remover', 'ishu unlock pdf',
      'free pdf unlocker', 'unlock pdf without password',
    ],
    h1: 'Unlock PDF — Remove Password Free',
    faq: [
      { question: 'How to unlock a password-protected PDF?', answer: 'Upload your locked PDF to ISHU TOOLS, enter the password, and click "Run". The unlocked PDF will be available for download.' },
    ],
  },
  'protect-pdf': {
    title: 'Protect PDF — Add Password to PDF Online Free | ISHU TOOLS',
    description: 'Password protect your PDF files online for free. Encrypt PDFs with strong security. Lock PDF with password. No signup required.',
    keywords: [
      'protect pdf', 'add password to pdf', 'encrypt pdf', 'pdf password protection',
      'secure pdf', 'lock pdf', 'password protect pdf', 'ishu tools protect pdf',
      'pdf encryption', 'ishu protect pdf', 'lock pdf with password',
    ],
    h1: 'Protect PDF — Password Encrypt Free',
    faq: [],
  },
  'sign-pdf': {
    title: 'Sign PDF — Add Digital Signature to PDF Online Free | ISHU TOOLS',
    description: 'Sign PDF documents online for free. Add your signature, name, and timestamp to PDFs. Electronic signature tool. No signup required.',
    keywords: [
      'sign pdf', 'pdf signature', 'add signature to pdf', 'e-sign pdf',
      'digital signature pdf', 'sign pdf online free', 'ishu tools sign pdf',
      'electronic signature', 'pdf signing tool', 'ishu sign pdf',
    ],
    h1: 'Sign PDF — Add Signature Free',
    faq: [],
  },
  'redact-pdf': {
    title: 'Redact PDF — Black Out Text in PDF Online Free | ISHU TOOLS',
    description: 'Redact sensitive information from PDFs online for free. Black out text, emails, phone numbers permanently. Protect privacy. No signup required.',
    keywords: [
      'redact pdf', 'pdf redaction', 'black out text pdf', 'remove sensitive info pdf',
      'redact pdf online', 'ishu tools redact pdf', 'censor pdf text',
      'hide text in pdf', 'ishu redact pdf',
    ],
    h1: 'Redact PDF — Remove Sensitive Info Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  PDF ADVANCED
  // ════════════════════════════════════════════════
  'ocr-pdf': {
    title: 'OCR PDF — Extract Text from Scanned PDF Online Free | ISHU TOOLS',
    description: 'OCR scanned PDFs to extract searchable text online for free. Convert image-based PDFs to selectable, searchable text. Best free OCR tool. No signup.',
    keywords: [
      'ocr pdf', 'pdf ocr', 'scanned pdf to text', 'extract text from scanned pdf',
      'pdf text extraction', 'ocr online free', 'ishu tools ocr pdf',
      'searchable pdf', 'scan to text', 'ishu ocr pdf', 'best ocr tool online',
      'convert scanned pdf to text', 'pdf ocr online free',
    ],
    h1: 'OCR PDF — Extract Text from Scanned PDFs',
    faq: [
      { question: 'What is OCR PDF?', answer: 'OCR (Optical Character Recognition) converts scanned or image-based PDF pages into searchable, selectable text. ISHU TOOLS OCR uses advanced recognition to extract text accurately.' },
    ],
  },
  'compare-pdf': {
    title: 'Compare PDF — Compare Two PDFs Side by Side Free | ISHU TOOLS',
    description: 'Compare two PDF files side by side and spot differences online for free. Generate text diff between PDF documents. No signup required.',
    keywords: [
      'compare pdf', 'pdf comparison', 'diff pdf', 'compare two pdfs',
      'pdf diff tool', 'ishu tools compare pdf', 'compare pdf documents',
    ],
    h1: 'Compare PDF — Side by Side Diff Free',
    faq: [],
  },
  'organize-pdf': {
    title: 'Organize PDF — Reorder PDF Pages Online Free | ISHU TOOLS',
    description: 'Reorder, rearrange, and organize PDF pages online for free. Drag pages into your preferred order. No signup required.',
    keywords: [
      'organize pdf', 'reorder pdf pages', 'rearrange pdf', 'pdf page organizer',
      'ishu tools organize pdf', 'sort pdf pages', 'ishu organize pdf',
    ],
    h1: 'Organize PDF — Reorder Pages Free',
    faq: [],
  },
  'crop-pdf': {
    title: 'Crop PDF — Crop PDF Pages Online Free | ISHU TOOLS',
    description: 'Crop PDF margins and trim page borders online for free. Remove unwanted margins from PDF pages. No signup required.',
    keywords: [
      'crop pdf', 'trim pdf', 'pdf cropper', 'remove pdf margins',
      'crop pdf pages', 'ishu tools crop pdf', 'pdf margin remover',
    ],
    h1: 'Crop PDF — Trim Margins Free',
    faq: [],
  },
  'flatten-pdf': {
    title: 'Flatten PDF — Lock PDF Annotations Online Free | ISHU TOOLS',
    description: 'Flatten PDF to lock annotations, form fields, and overlays permanently. Create static PDF documents. No signup required.',
    keywords: [
      'flatten pdf', 'lock pdf annotations', 'pdf flattener', 'static pdf',
      'flatten pdf online', 'ishu tools flatten pdf', 'remove pdf annotations',
    ],
    h1: 'Flatten PDF — Lock Overlays Free',
    faq: [],
  },
  'translate-pdf': {
    title: 'Translate PDF — Translate PDF Documents Online Free | ISHU TOOLS',
    description: 'Translate PDF documents to any language online for free. AI-powered PDF translation preserving layout. Support for English, Hindi, Spanish, French, German, Arabic.',
    keywords: [
      'translate pdf', 'pdf translator', 'translate pdf online', 'pdf translation tool',
      'translate pdf to hindi', 'translate pdf to english', 'ishu tools translate pdf',
      'ai pdf translator', 'ishu translate pdf', 'multilingual pdf translation',
    ],
    h1: 'Translate PDF — AI Translation Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  IMAGE TOOLS
  // ════════════════════════════════════════════════
  'compress-image': {
    title: 'Compress Image — Reduce Image Size Online Free | ISHU TOOLS',
    description: 'Compress JPG, PNG, WebP images online for free. Reduce image file size while maintaining quality. Best image compressor for web, email, and social media. No signup, no watermark.',
    keywords: [
      'compress image', 'image compressor', 'reduce image size', 'compress jpg',
      'compress png', 'image size reducer', 'compress image online free',
      'shrink image', 'reduce photo size', 'photo compressor', 'ishu tools compress image',
      'compress image without losing quality', 'best image compressor', 'ishu image compressor',
      'free image compressor online', 'compress photo online',
    ],
    h1: 'Compress Image — Reduce Image Size Online Free',
    faq: [
      { question: 'How to compress images online for free?', answer: 'Upload your image (JPG, PNG, WebP) to ISHU TOOLS, set desired quality (1-100), and click "Run". Download your compressed image instantly.' },
      { question: 'Does compression reduce image quality?', answer: 'Our smart algorithm reduces file size significantly while maintaining visual quality. Adjust the quality slider to balance size vs quality.' },
    ],
  },
  'resize-image': {
    title: 'Resize Image — Change Image Dimensions Online Free | ISHU TOOLS',
    description: 'Resize images by pixel dimensions online for free. Change width and height of JPG, PNG, WebP images instantly. No signup, no watermark.',
    keywords: [
      'resize image', 'image resizer', 'resize photo', 'change image size',
      'resize image online', 'resize image free', 'resize image pixel',
      'photo resizer', 'resize jpg', 'resize png', 'ishu tools resize image',
      'resize image dimensions', 'ishu image resizer', 'free image resizer online',
    ],
    h1: 'Resize Image — Change Dimensions Online Free',
    faq: [
      { question: 'How to resize an image online?', answer: 'Upload your image, enter desired width and height in pixels, and click "Run". Download your resized image instantly — completely free.' },
    ],
  },
  'crop-image': {
    title: 'Crop Image — Crop Photos Online Free | ISHU TOOLS',
    description: 'Crop images with custom dimensions online for free. Trim and cut photos precisely. Support for JPG, PNG, WebP. No signup required.',
    keywords: [
      'crop image', 'image cropper', 'crop photo', 'trim image', 'cut image',
      'crop image online', 'crop photo free', 'ishu tools crop image',
      'crop jpg', 'crop png', 'ishu crop image', 'free image cropper',
    ],
    h1: 'Crop Image — Cut Photos Online Free',
    faq: [],
  },
  'convert-image': {
    title: 'Convert Image — Convert Image Format Online Free | ISHU TOOLS',
    description: 'Convert images between JPG, PNG, WebP, GIF, BMP, TIFF, ICO, SVG formats online for free. Best image format converter. No signup required.',
    keywords: [
      'convert image', 'image converter', 'change image format', 'convert jpg to png',
      'convert png to jpg', 'image format converter', 'ishu tools convert image',
      'convert image online', 'image converter free', 'ishu image converter',
    ],
    h1: 'Convert Image — Change Format Online Free',
    faq: [],
  },
  'remove-background': {
    title: 'Remove Background — Remove Image Background Online Free | ISHU TOOLS',
    description: 'Remove image backgrounds automatically online for free. AI-powered background remover. Get transparent PNG cutouts instantly. No signup required.',
    keywords: [
      'remove background', 'background remover', 'remove bg', 'transparent background',
      'background eraser', 'remove image background', 'ishu tools remove background',
      'ai background remover', 'remove background free', 'ishu remove background',
      'cut out background', 'photo background remover', 'transparent png',
    ],
    h1: 'Remove Background — AI Background Remover Free',
    faq: [
      { question: 'How to remove background from image?', answer: 'Upload your image to ISHU TOOLS Background Remover and click "Run". AI will automatically detect the subject and remove the background, giving you a transparent PNG.' },
    ],
  },
  'blur-face': {
    title: 'Blur Face — Blur Faces in Photos Online Free | ISHU TOOLS',
    description: 'Blur faces in photos automatically for privacy online for free. AI face detection with adjustable blur strength. No signup required.',
    keywords: [
      'blur face', 'face blur', 'blur face in photo', 'privacy blur',
      'censor face', 'blur face online', 'ishu tools blur face', 'face blurring tool',
      'blur face free', 'ishu blur face', 'auto face blur',
    ],
    h1: 'Blur Face — Privacy Face Blur Free',
    faq: [],
  },
  'meme-generator': {
    title: 'Meme Generator — Create Memes Online Free | ISHU TOOLS',
    description: 'Create memes with custom top and bottom text online for free. Upload your image and add meme captions instantly. No signup, no watermark.',
    keywords: [
      'meme generator', 'meme maker', 'create meme', 'meme creator',
      'make memes online', 'meme generator free', 'custom meme',
      'ishu tools meme generator', 'meme text generator', 'ishu meme maker',
    ],
    h1: 'Meme Generator — Create Memes Free',
    faq: [],
  },
  'upscale-image': {
    title: 'Upscale Image — Enlarge Images Online Free | ISHU TOOLS',
    description: 'Upscale images to higher resolution online for free. Enlarge photos 2x, 4x without losing quality. AI-powered image upscaling. No signup.',
    keywords: [
      'upscale image', 'image upscaler', 'enlarge image', 'increase image resolution',
      'upscale photo', 'image enlarger', 'ishu tools upscale image',
      'upscale image free', 'ai upscaler', 'ishu upscale image',
    ],
    h1: 'Upscale Image — Enlarge Without Quality Loss',
    faq: [],
  },
  'watermark-image': {
    title: 'Watermark Image — Add Watermark to Photos Online Free | ISHU TOOLS',
    description: 'Add text watermark to images online for free. Protect your photos with custom watermarks. Choose position, font, and opacity. No signup.',
    keywords: [
      'watermark image', 'add watermark', 'watermark photo', 'image watermark',
      'watermark online', 'ishu tools watermark', 'photo watermark', 'ishu watermark image',
    ],
    h1: 'Watermark Image — Add Watermark Free',
    faq: [],
  },
  'passport-photo-maker': {
    title: 'Passport Photo Maker — Create Passport Size Photos Online Free | ISHU TOOLS',
    description: 'Create passport size photos in standard dimensions (3.5x4.5cm, 2x2 inch, 35x45mm) online for free. Perfect for visa, ID cards, and official forms. No signup.',
    keywords: [
      'passport photo maker', 'passport size photo', 'passport photo online',
      'create passport photo', 'id photo maker', 'passport photo free',
      'ishu tools passport photo', '3.5x4.5cm photo', '2x2 passport photo',
      'visa photo maker', 'ishu passport photo', 'passport photo generator',
    ],
    h1: 'Passport Photo Maker — ID Photos Free',
    faq: [
      { question: 'What size is a passport photo?', answer: 'Standard passport photo sizes include 3.5x4.5cm, 35x45mm, and 2x2 inches. ISHU TOOLS supports all standard sizes.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  DEVELOPER TOOLS
  // ════════════════════════════════════════════════
  'json-formatter': {
    title: 'JSON Formatter — Format & Beautify JSON Online Free | ISHU TOOLS',
    description: 'Format, beautify, and validate JSON data online for free. Pretty-print JSON with proper indentation. Best JSON formatter for developers. No signup.',
    keywords: [
      'json formatter', 'json beautifier', 'format json', 'json pretty print',
      'json validator', 'json viewer', 'beautify json', 'ishu tools json formatter',
      'json formatting tool', 'ishu json formatter', 'json linter',
      'pretty print json online', 'format json online free',
    ],
    h1: 'JSON Formatter — Beautify & Validate JSON',
    faq: [
      { question: 'How to format JSON online?', answer: 'Paste your JSON data into ISHU TOOLS JSON Formatter and click "Run". Your JSON will be beautifully formatted with proper indentation.' },
    ],
  },
  'base64-encode': {
    title: 'Base64 Encoder — Encode Text to Base64 Online Free | ISHU TOOLS',
    description: 'Encode text to Base64 online for free. Fast Base64 encoding tool for developers. No signup required.',
    keywords: [
      'base64 encode', 'base64 encoder', 'text to base64', 'encode base64',
      'base64 converter', 'ishu tools base64', 'base64 encoding online',
      'ishu base64 encoder', 'base64 encode free',
    ],
    h1: 'Base64 Encoder — Encode Text Free',
    faq: [],
  },
  'base64-decode': {
    title: 'Base64 Decoder — Decode Base64 to Text Online Free | ISHU TOOLS',
    description: 'Decode Base64 encoded text online for free. Fast Base64 decoding tool for developers. No signup.',
    keywords: [
      'base64 decode', 'base64 decoder', 'decode base64', 'base64 to text',
      'ishu tools base64 decoder', 'base64 decoding online', 'ishu base64 decode',
    ],
    h1: 'Base64 Decoder — Decode to Text Free',
    faq: [],
  },
  'uuid-generator': {
    title: 'UUID Generator — Generate UUIDs Online Free | ISHU TOOLS',
    description: 'Generate random UUIDs (v4) online for free. Create unique identifiers for databases, APIs, and development. No signup.',
    keywords: [
      'uuid generator', 'generate uuid', 'uuid online', 'random uuid',
      'uuid v4', 'unique id generator', 'ishu tools uuid', 'guid generator',
      'ishu uuid generator', 'uuid maker',
    ],
    h1: 'UUID Generator — Create Unique IDs Free',
    faq: [],
  },
  'regex-tester': {
    title: 'Regex Tester — Test Regular Expressions Online Free | ISHU TOOLS',
    description: 'Test and debug regular expressions online for free. Match patterns, find groups, test flags. Best regex testing tool for developers. No signup.',
    keywords: [
      'regex tester', 'regex test', 'regular expression tester', 'regex online',
      'test regex', 'regex debugger', 'ishu tools regex', 'regex matcher',
      'ishu regex tester', 'regex validator',
    ],
    h1: 'Regex Tester — Test Patterns Free',
    faq: [],
  },
  'diff-checker': {
    title: 'Diff Checker — Compare Text Differences Online Free | ISHU TOOLS',
    description: 'Compare two text blocks and find differences online for free. Highlight changes, additions, and deletions. Best diff tool for developers. No signup.',
    keywords: [
      'diff checker', 'text diff', 'compare text', 'find differences',
      'diff tool', 'text comparison', 'ishu tools diff checker', 'code diff',
      'ishu diff checker', 'online diff tool',
    ],
    h1: 'Diff Checker — Compare Text Free',
    faq: [],
  },
  'hash-generator': {
    title: 'Hash Generator — MD5, SHA256, SHA512 Hash Online Free | ISHU TOOLS',
    description: 'Generate MD5, SHA256, SHA512 hashes from text online for free. Secure hash generation for developers. No signup required.',
    keywords: [
      'hash generator', 'md5 hash', 'sha256 hash', 'sha512', 'generate hash',
      'hash online', 'ishu tools hash generator', 'text to hash',
      'ishu hash generator', 'crypto hash',
    ],
    h1: 'Hash Generator — MD5, SHA256, SHA512 Free',
    faq: [],
  },
  'password-generator': {
    title: 'Password Generator — Generate Strong Passwords Free | ISHU TOOLS',
    description: 'Generate strong, secure random passwords online for free. Customize length, characters, symbols. Best password generator. No signup.',
    keywords: [
      'password generator', 'random password', 'strong password generator',
      'secure password', 'generate password', 'password maker',
      'ishu tools password generator', 'ishu password generator',
      'random password generator online', 'create strong password',
    ],
    h1: 'Password Generator — Secure Passwords Free',
    faq: [],
  },
  'lorem-ipsum-generator': {
    title: 'Lorem Ipsum Generator — Generate Placeholder Text Free | ISHU TOOLS',
    description: 'Generate Lorem Ipsum placeholder text online for free. Create paragraphs, sentences, or words. Perfect for designers and developers. No signup.',
    keywords: [
      'lorem ipsum generator', 'lorem ipsum', 'placeholder text', 'dummy text',
      'generate lorem ipsum', 'text generator', 'ishu tools lorem ipsum',
      'ishu lorem ipsum', 'lipsum generator',
    ],
    h1: 'Lorem Ipsum Generator — Placeholder Text Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  MATH & CALCULATORS
  // ════════════════════════════════════════════════
  'percentage-calculator': {
    title: 'Percentage Calculator — Calculate Percentages Online Free | ISHU TOOLS',
    description: 'Calculate percentages easily online for free. Find percentage of a number, percentage increase/decrease, percentage change. Best calculator for students.',
    keywords: [
      'percentage calculator', 'calculate percentage', 'percent calculator',
      'percentage of a number', 'percentage increase', 'percentage decrease',
      'percentage change', 'ishu tools percentage calculator',
      'ishu percentage calculator', 'free percentage calculator',
      'math percentage calculator', 'percentage formula calculator',
    ],
    h1: 'Percentage Calculator — Free Online',
    faq: [
      { question: 'How to calculate percentage of a number?', answer: 'Enter your values in ISHU TOOLS Percentage Calculator. For example, to find 25% of 200, select "Value% of Total" mode, enter 25 and 200. Result: 50.' },
    ],
  },
  'bmi-calculator': {
    title: 'BMI Calculator — Calculate Body Mass Index Free | ISHU TOOLS',
    description: 'Calculate your BMI (Body Mass Index) online for free. Check underweight, normal, overweight, or obese status. Supports metric and imperial units.',
    keywords: [
      'bmi calculator', 'body mass index', 'calculate bmi', 'bmi check',
      'bmi online', 'free bmi calculator', 'weight calculator',
      'ishu tools bmi calculator', 'ishu bmi calculator', 'health calculator',
      'bmi checker online', 'bmi formula calculator',
    ],
    h1: 'BMI Calculator — Check Your BMI Free',
    faq: [
      { question: 'How to calculate BMI?', answer: 'Enter your weight (kg or lbs) and height (cm or inches) in ISHU TOOLS BMI Calculator. Your BMI and health category are displayed instantly.' },
    ],
  },
  'age-calculator': {
    title: 'Age Calculator — Calculate Exact Age Online Free | ISHU TOOLS',
    description: 'Calculate your exact age in years, months, and days from date of birth. Free online age calculator. No signup required.',
    keywords: [
      'age calculator', 'calculate age', 'age from dob', 'date of birth calculator',
      'exact age calculator', 'age in days', 'ishu tools age calculator',
      'ishu age calculator', 'how old am i', 'age calculator online free',
    ],
    h1: 'Age Calculator — Calculate Exact Age Free',
    faq: [],
  },
  'scientific-calculator': {
    title: 'Scientific Calculator — Advanced Math Calculator Free | ISHU TOOLS',
    description: 'Free online scientific calculator with trigonometry, logarithms, exponents, roots, pi, and more. Perfect for students, engineers, and professionals.',
    keywords: [
      'scientific calculator', 'online calculator', 'math calculator', 'advanced calculator',
      'trigonometry calculator', 'logarithm calculator', 'ishu tools calculator',
      'ishu scientific calculator', 'scientific calculator online free',
      'engineering calculator', 'math expression evaluator',
    ],
    h1: 'Scientific Calculator — Advanced Math Free',
    faq: [],
  },
  'loan-emi-calculator': {
    title: 'EMI Calculator — Loan EMI Calculator Online Free | ISHU TOOLS',
    description: 'Calculate monthly EMI for home, car, personal loans online for free. Enter principal, interest rate, and tenure. Best EMI calculator for India.',
    keywords: [
      'emi calculator', 'loan emi calculator', 'emi calculation', 'home loan emi',
      'car loan emi', 'personal loan emi', 'ishu tools emi calculator',
      'ishu emi calculator', 'monthly emi calculator', 'loan calculator india',
    ],
    h1: 'EMI Calculator — Loan EMI Free',
    faq: [],
  },
  'gpa-calculator': {
    title: 'GPA Calculator — Calculate GPA Online Free | ISHU TOOLS',
    description: 'Calculate your GPA (Grade Point Average) online for free. Enter grades and credits to get your GPA. Perfect for college students.',
    keywords: [
      'gpa calculator', 'calculate gpa', 'grade point average', 'gpa calculator online',
      'college gpa calculator', 'ishu tools gpa calculator', 'ishu gpa calculator',
      'university gpa calculator', 'student gpa calculator',
    ],
    h1: 'GPA Calculator — Calculate Grade Point Free',
    faq: [],
  },
  'compound-interest-calculator': {
    title: 'Compound Interest Calculator — Free Online | ISHU TOOLS',
    description: 'Calculate compound interest with custom principal, rate, time, and compounding frequency online for free. Best compound interest calculator.',
    keywords: [
      'compound interest calculator', 'compound interest', 'ci calculator',
      'calculate compound interest', 'ishu tools compound interest',
      'compound interest formula', 'ishu compound interest calculator',
    ],
    h1: 'Compound Interest Calculator — Free',
    faq: [],
  },
  'discount-calculator': {
    title: 'Discount Calculator — Calculate Sale Price Free | ISHU TOOLS',
    description: 'Calculate discount amount and final sale price online for free. Enter original price and discount percentage. Perfect for shopping.',
    keywords: [
      'discount calculator', 'calculate discount', 'sale price calculator',
      'percent off calculator', 'ishu tools discount', 'ishu discount calculator',
    ],
    h1: 'Discount Calculator — Calculate Sale Price',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  TEXT & AI TOOLS
  // ════════════════════════════════════════════════
  'translate-text': {
    title: 'Translate Text — Free Online Text Translator | ISHU TOOLS',
    description: 'Translate text between 100+ languages online for free. Fast, accurate text translation. Support for English, Hindi, Spanish, French, German, Arabic, and more.',
    keywords: [
      'translate text', 'text translator', 'online translator', 'translate online free',
      'free text translation', 'language translator', 'ishu tools translate',
      'translate english to hindi', 'translate hindi to english', 'ishu translator',
      'google translate alternative', 'multilingual translator',
    ],
    h1: 'Translate Text — 100+ Languages Free',
    faq: [],
  },
  'summarize-text': {
    title: 'Summarize Text — AI Text Summarizer Online Free | ISHU TOOLS',
    description: 'Summarize long text into concise summaries online for free. AI-powered text summarization. Perfect for articles, essays, and reports.',
    keywords: [
      'summarize text', 'text summarizer', 'ai summarizer', 'article summarizer',
      'summary generator', 'ishu tools summarize', 'text summary online',
      'ishu text summarizer', 'auto summary generator',
    ],
    h1: 'Summarize Text — AI Summarizer Free',
    faq: [],
  },
  'word-count-text': {
    title: 'Word Counter — Count Words, Characters Online Free | ISHU TOOLS',
    description: 'Count words, characters, sentences, and paragraphs in your text online for free. Best word counter for writers and students.',
    keywords: [
      'word counter', 'character counter', 'count words', 'word count tool',
      'letter counter', 'text counter', 'ishu tools word counter',
      'ishu word counter', 'online word counter', 'count characters',
    ],
    h1: 'Word Counter — Count Words & Characters Free',
    faq: [],
  },
  'case-converter-text': {
    title: 'Case Converter — Convert Text Case Online Free | ISHU TOOLS',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, or Sentence case online for free. Quick text case transformation. No signup.',
    keywords: [
      'case converter', 'text case converter', 'uppercase converter',
      'lowercase converter', 'title case', 'capitalize text', 'ishu tools case converter',
      'ishu case converter', 'change text case online',
    ],
    h1: 'Case Converter — Convert Text Case Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  COLOR TOOLS
  // ════════════════════════════════════════════════
  'color-picker': {
    title: 'Color Picker — Pick Colors & Get HEX/RGB Codes Free | ISHU TOOLS',
    description: 'Pick colors and get HEX, RGB, HSL color codes online for free. Professional color picker for designers and developers. No signup.',
    keywords: [
      'color picker', 'color code', 'hex color picker', 'rgb color picker',
      'color identifier', 'pick color', 'ishu tools color picker',
      'ishu color picker', 'html color picker', 'css color code',
    ],
    h1: 'Color Picker — Get Color Codes Free',
    faq: [],
  },
  'hex-to-rgb': {
    title: 'HEX to RGB Converter — Convert Colors Online Free | ISHU TOOLS',
    description: 'Convert HEX color codes to RGB values online for free. Instant color conversion for web development. No signup required.',
    keywords: [
      'hex to rgb', 'hex to rgb converter', 'convert hex to rgb', 'color converter',
      'hex color to rgb', 'ishu tools hex to rgb', 'ishu hex to rgb',
    ],
    h1: 'HEX to RGB — Color Converter Free',
    faq: [],
  },
  'gradient-generator': {
    title: 'Gradient Generator — CSS Gradient Maker Online Free | ISHU TOOLS',
    description: 'Generate beautiful CSS gradients online for free. Create linear gradients with custom colors and angles. Copy CSS code instantly.',
    keywords: [
      'gradient generator', 'css gradient', 'gradient maker', 'css gradient generator',
      'linear gradient', 'ishu tools gradient', 'gradient creator',
      'ishu gradient generator', 'web gradient tool',
    ],
    h1: 'Gradient Generator — CSS Gradients Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  UNIT CONVERTERS
  // ════════════════════════════════════════════════
  'temperature-converter': {
    title: 'Temperature Converter — °C °F K Conversion Free | ISHU TOOLS',
    description: 'Convert between Celsius, Fahrenheit, and Kelvin online for free. Instant temperature conversion calculator. No signup required.',
    keywords: [
      'temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius',
      'kelvin converter', 'temperature conversion', 'ishu tools temperature converter',
      'ishu temperature converter', 'c to f converter',
    ],
    h1: 'Temperature Converter — °C °F K Free',
    faq: [],
  },
  'length-converter': {
    title: 'Length Converter — Convert Meters, Feet, Inches Free | ISHU TOOLS',
    description: 'Convert between meters, kilometers, feet, inches, yards, miles online for free. Accurate length conversion calculator. No signup.',
    keywords: [
      'length converter', 'convert length', 'meters to feet', 'feet to meters',
      'cm to inches', 'inches to cm', 'ishu tools length converter',
      'ishu length converter', 'distance converter',
    ],
    h1: 'Length Converter — All Units Free',
    faq: [],
  },
  'weight-converter': {
    title: 'Weight Converter — Convert KG, LB, OZ Online Free | ISHU TOOLS',
    description: 'Convert between kilograms, pounds, ounces, grams, tons online for free. Accurate weight conversion calculator. No signup.',
    keywords: [
      'weight converter', 'kg to lbs', 'lbs to kg', 'weight conversion',
      'mass converter', 'ishu tools weight converter', 'ishu weight converter',
    ],
    h1: 'Weight Converter — KG, LB, OZ Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  QR CODE & UTILITY
  // ════════════════════════════════════════════════
  'qr-code-generator': {
    title: 'QR Code Generator — Create QR Codes Online Free | ISHU TOOLS',
    description: 'Generate QR codes from text, URLs, or any data online for free. Download high-quality QR code images instantly. Perfect for marketing, business cards, and sharing.',
    keywords: [
      'qr code generator', 'create qr code', 'qr code maker', 'free qr code',
      'generate qr code', 'qr code online', 'qr code creator',
      'ishu tools qr code', 'ishu qr code generator', 'qr code for url',
      'qr code for text', 'custom qr code', 'barcode generator',
    ],
    h1: 'QR Code Generator — Create QR Codes Free',
    faq: [
      { question: 'How to create a QR code for free?', answer: 'Enter your text or URL in ISHU TOOLS QR Code Generator and click "Run". Your QR code image will be generated instantly for download.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  OCR & VISION
  // ════════════════════════════════════════════════
  'ocr-image': {
    title: 'OCR Image — Extract Text from Image Online Free | ISHU TOOLS',
    description: 'Extract text from images using OCR online for free. Convert scanned documents, photos, and screenshots to editable text. No signup.',
    keywords: [
      'ocr image', 'image to text', 'extract text from image', 'ocr online',
      'photo to text', 'image text extractor', 'ishu tools ocr',
      'ishu ocr image', 'free ocr online', 'scan image to text',
    ],
    h1: 'OCR Image — Extract Text Free',
    faq: [],
  },
  'image-to-text': {
    title: 'Image to Text — Extract Text from Photos Free | ISHU TOOLS',
    description: 'Extract readable text from images and photos online for free. OCR technology converts image text to editable format. No signup.',
    keywords: [
      'image to text', 'photo to text', 'picture to text', 'extract text from photo',
      'image text extractor', 'ishu tools image to text', 'ishu image to text',
      'convert image to text free', 'scan image to text online',
    ],
    h1: 'Image to Text — Photo Text Extractor Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  ADDITIONAL HIGH-VALUE TOOLS
  // ════════════════════════════════════════════════
  'reduce-image-size-in-kb': {
    title: 'Reduce Image Size in KB — Compress to Exact KB Free | ISHU TOOLS',
    description: 'Compress images to exact target file size in KB online for free. Perfect for exam forms, government applications, and upload limits. Reduce to 20KB, 50KB, 100KB, 200KB.',
    keywords: [
      'reduce image size in kb', 'compress image to kb', 'image size reducer kb',
      'reduce photo size kb', 'compress image 20kb', 'compress image 50kb',
      'compress image 100kb', 'ishu tools reduce image size',
      'ishu reduce image kb', 'image compressor kb',
      'reduce image size for exam form', 'compress photo for application',
    ],
    h1: 'Reduce Image Size in KB — Exact Target Free',
    faq: [
      { question: 'How to reduce image size to specific KB?', answer: 'Upload your image, enter target size in KB, and click "Run". ISHU TOOLS will intelligently compress your image to match the exact target size.' },
    ],
  },
  'generate-signature': {
    title: 'Signature Generator — Create Digital Signature Free | ISHU TOOLS',
    description: 'Generate transparent digital signatures from typed text online for free. Perfect for documents, forms, and applications. No signup.',
    keywords: [
      'signature generator', 'create signature', 'digital signature', 'online signature',
      'ishu tools signature', 'signature maker', 'electronic signature generator',
      'ishu signature generator', 'free signature maker',
    ],
    h1: 'Signature Generator — Create Signature Free',
    faq: [],
  },
  'pdf-to-docx': {
    title: 'PDF to DOCX — Convert PDF to Word Document Free | ISHU TOOLS',
    description: 'Convert PDF files to editable DOCX Word documents online for free. Preserve formatting and layout. No signup, no watermark.',
    keywords: [
      'pdf to docx', 'convert pdf to docx', 'pdf to word document',
      'pdf to docx online free', 'ishu tools pdf to docx', 'ishu pdf to docx',
    ],
    h1: 'PDF to DOCX — Convert to Word Free',
    faq: [],
  },
  'html-to-pdf': {
    title: 'HTML to PDF — Convert Web Pages to PDF Free | ISHU TOOLS',
    description: 'Convert HTML pages, web URLs, or HTML code to PDF documents online for free. Capture any web page as PDF. No signup required.',
    keywords: [
      'html to pdf', 'convert html to pdf', 'webpage to pdf', 'url to pdf',
      'website to pdf', 'ishu tools html to pdf', 'web page to pdf converter',
      'ishu html to pdf', 'save webpage as pdf',
    ],
    h1: 'HTML to PDF — Convert Web Pages Free',
    faq: [],
  },
  'cgpa-to-percentage': {
    title: 'CGPA to Percentage — CGPA Converter Online Free | ISHU TOOLS',
    description: 'Convert CGPA to Percentage and Percentage to CGPA online for free. Accurate conversion for Indian universities. No signup required.',
    keywords: [
      'cgpa to percentage', 'percentage to cgpa', 'cgpa converter', 'cgpa calculator',
      'ishu tools cgpa', 'convert cgpa to percentage', 'ishu cgpa converter',
      'cgpa to marks', 'university cgpa calculator',
    ],
    h1: 'CGPA to Percentage — Converter Free',
    faq: [],
  },
  'simple-interest-calculator': {
    title: 'Simple Interest Calculator — Calculate SI Online Free | ISHU TOOLS',
    description: 'Calculate Simple Interest (SI) online for free. Enter principal, rate, and time to get interest amount and total. Perfect for students and finance.',
    keywords: [
      'simple interest calculator', 'si calculator', 'calculate simple interest',
      'simple interest formula', 'ishu tools simple interest',
      'ishu simple interest calculator', 'interest calculator online',
    ],
    h1: 'Simple Interest Calculator — Free Online',
    faq: [],
  },
  'tip-calculator': {
    title: 'Tip Calculator — Calculate Tips & Split Bills Free | ISHU TOOLS',
    description: 'Calculate tip amount and split bills between people online for free. Enter bill amount, tip percentage, and number of people.',
    keywords: [
      'tip calculator', 'calculate tip', 'bill splitter', 'restaurant tip',
      'ishu tools tip calculator', 'ishu tip calculator', 'split bill calculator',
    ],
    h1: 'Tip Calculator — Split Bills Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  DEVELOPER TOOLS (EXPANDED)
  // ════════════════════════════════════════════════
  'json-formatter': {
    title: 'JSON Formatter — Beautify & Validate JSON Online Free | ISHU TOOLS',
    description: 'Format, beautify, validate, and minify JSON online for free. Fix JSON syntax errors instantly. Best free JSON formatter and validator. No signup, no watermark.',
    keywords: [
      'json formatter', 'json beautifier', 'format json', 'json validator', 'json pretty print',
      'json formatter online', 'json formatter free', 'beautify json', 'minify json',
      'json viewer', 'ishu tools json', 'json formatter online free', 'best json formatter',
      'ishu json formatter', 'json syntax checker', 'json editor online',
      'validate json online', 'json lint', 'json parser online',
    ],
    h1: 'JSON Formatter — Beautify & Validate JSON Free',
    faq: [
      { question: 'How to format JSON online?', answer: 'Paste your JSON into ISHU TOOLS JSON Formatter and click "Run". Your JSON will be instantly formatted with proper indentation and syntax highlighting.' },
      { question: 'Is ISHU TOOLS JSON Formatter better than JSONLint?', answer: 'ISHU TOOLS JSON Formatter offers format, validate, and minify in one tool — completely free, no ads, and no signup required.' },
    ],
  },
  'xml-formatter': {
    title: 'XML Formatter — Beautify XML Online Free | ISHU TOOLS',
    description: 'Format and beautify XML documents online for free. Validate XML syntax and pretty print with proper indentation. No signup required.',
    keywords: [
      'xml formatter', 'xml beautifier', 'format xml', 'xml validator', 'xml pretty print',
      'xml formatter online', 'xml formatter free', 'beautify xml', 'ishu tools xml',
      'xml editor online', 'ishu xml formatter', 'validate xml online',
    ],
    h1: 'XML Formatter — Beautify XML Free',
    faq: [],
  },
  'uuid-generator': {
    title: 'UUID Generator — Generate UUID v4 Online Free | ISHU TOOLS',
    description: 'Generate unique UUID v4 identifiers online for free. Create multiple UUIDs at once. Copy to clipboard instantly. No signup required.',
    keywords: [
      'uuid generator', 'uuid v4 generator', 'generate uuid', 'unique id generator',
      'guid generator', 'uuid online', 'uuid generator free', 'ishu tools uuid',
      'random uuid', 'ishu uuid generator', 'unique identifier generator',
      'generate guid online', 'uuid v4 online free',
    ],
    h1: 'UUID Generator — Generate Unique IDs Free',
    faq: [
      { question: 'What is a UUID?', answer: 'UUID (Universally Unique Identifier) is a 128-bit identifier used in software development. UUID v4 is randomly generated and has an extremely low probability of collision.' },
    ],
  },
  'password-generator': {
    title: 'Password Generator — Create Strong Passwords Free | ISHU TOOLS',
    description: 'Generate strong, secure, random passwords online for free. Choose length, character types, symbols, and numbers. Best free password generator. No signup.',
    keywords: [
      'password generator', 'strong password generator', 'random password generator',
      'secure password', 'password creator', 'generate password online',
      'ishu tools password generator', 'strong password', 'complex password generator',
      'ishu password generator', 'free password generator', 'safe password maker',
    ],
    h1: 'Password Generator — Create Strong Passwords Free',
    faq: [
      { question: 'How to generate a strong password?', answer: 'Use ISHU TOOLS Password Generator — set length (16+ chars), enable symbols, numbers, uppercase and lowercase letters. A strong password is long, random, and unique.' },
    ],
  },
  'regex-tester': {
    title: 'Regex Tester — Test Regular Expressions Online Free | ISHU TOOLS',
    description: 'Test and debug regular expressions online for free. Real-time regex matching with match highlighting. Supports JavaScript regex. No signup required.',
    keywords: [
      'regex tester', 'regular expression tester', 'regex online', 'regex checker',
      'regex debugger', 'regex validator', 'test regex online', 'ishu tools regex',
      'javascript regex tester', 'ishu regex tester', 'regex matcher online free',
    ],
    h1: 'Regex Tester — Test Regular Expressions Free',
    faq: [],
  },
  'base64-encode': {
    title: 'Base64 Encoder — Encode Text to Base64 Online Free | ISHU TOOLS',
    description: 'Encode text or files to Base64 online for free. Convert string to Base64 format instantly. Best Base64 encoder. No signup required.',
    keywords: [
      'base64 encoder', 'encode base64', 'text to base64', 'base64 encode online',
      'base64 converter', 'string to base64', 'ishu tools base64', 'base64 generator',
      'base64 encode free', 'ishu base64 encoder', 'base64 encoding tool',
    ],
    h1: 'Base64 Encoder — Encode to Base64 Free',
    faq: [],
  },
  'base64-decode': {
    title: 'Base64 Decoder — Decode Base64 to Text Online Free | ISHU TOOLS',
    description: 'Decode Base64 encoded strings back to text or files online for free. Instant Base64 decoder. No signup required.',
    keywords: [
      'base64 decoder', 'decode base64', 'base64 to text', 'base64 decode online',
      'base64 converter', 'ishu tools base64 decoder', 'ishu base64 decode',
      'decode base64 string', 'base64 decoding tool',
    ],
    h1: 'Base64 Decoder — Decode Base64 Free',
    faq: [],
  },
  'diff-checker': {
    title: 'Diff Checker — Compare Two Texts Online Free | ISHU TOOLS',
    description: 'Compare two texts or files side by side and find differences online for free. Highlight changes, additions, and deletions. No signup required.',
    keywords: [
      'diff checker', 'text comparison', 'compare text', 'diff tool', 'text diff',
      'find difference in text', 'compare two files', 'ishu tools diff checker',
      'code diff', 'ishu diff checker', 'text compare online free',
    ],
    h1: 'Diff Checker — Compare Texts Online Free',
    faq: [],
  },
  'qr-code-generator': {
    title: 'QR Code Generator — Create QR Codes Online Free | ISHU TOOLS',
    description: 'Generate QR codes for URLs, text, email, phone, WiFi, and more online for free. Download as PNG or SVG. Customize colors and size. No signup.',
    keywords: [
      'qr code generator', 'create qr code', 'qr generator', 'qr code maker',
      'free qr code generator', 'qr code creator', 'generate qr code online',
      'ishu tools qr code', 'custom qr code', 'ishu qr code generator',
      'qr code for website', 'qr code png download',
    ],
    h1: 'QR Code Generator — Create Custom QR Codes Free',
    faq: [
      { question: 'How to create a QR code for free?', answer: 'Go to ISHU TOOLS QR Code Generator, enter your URL or text, customize the color and size, and click "Run". Download your QR code as PNG instantly.' },
    ],
  },
  'barcode-generator': {
    title: 'Barcode Generator — Generate Barcodes Online Free | ISHU TOOLS',
    description: 'Generate barcodes (Code128, Code39, EAN-13, EAN-8, UPC-A) online for free. Download barcode as PNG. No signup required.',
    keywords: [
      'barcode generator', 'create barcode', 'barcode maker', 'free barcode generator',
      'code128 generator', 'ean13 generator', 'upc barcode', 'ishu tools barcode',
      'ishu barcode generator', 'barcode creator online', 'generate barcode online free',
    ],
    h1: 'Barcode Generator — Create Barcodes Free',
    faq: [],
  },
  'hash-generator': {
    title: 'Hash Generator — MD5 SHA256 SHA512 Hash Online Free | ISHU TOOLS',
    description: 'Generate MD5, SHA1, SHA256, SHA512 hashes online for free. Hash any text or file instantly. No signup required.',
    keywords: [
      'hash generator', 'md5 generator', 'sha256 generator', 'sha512 generator',
      'hash calculator', 'md5 hash online', 'sha256 hash online', 'ishu tools hash',
      'hash text online', 'ishu hash generator', 'checksum generator',
    ],
    h1: 'Hash Generator — MD5 SHA256 Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  STUDENT EXAM PHOTO TOOLS
  // ════════════════════════════════════════════════
  'ssc-photo-resizer': {
    title: 'SSC Photo Resizer — Resize Photo for SSC Exam Free | ISHU TOOLS',
    description: 'Resize and compress photos as per SSC CGL, CHSL, MTS exam requirements online for free. Exact size, format, and file size specifications. No signup.',
    keywords: [
      'ssc photo resizer', 'ssc exam photo size', 'ssc cgl photo size', 'ssc chsl photo',
      'resize photo for ssc', 'ssc photo format', 'ishu tools ssc photo',
      'ssc photo compress', 'ishu ssc photo resizer', 'ssc exam photo requirements',
    ],
    h1: 'SSC Photo Resizer — Exam Photo Free',
    faq: [],
  },
  'resize-for-pan-card': {
    title: 'PAN Card Photo Resizer — Resize Photo for PAN Card Free | ISHU TOOLS',
    description: 'Resize photo for PAN card application as per NSDL/UTIITSL requirements. Correct size, format, and file size. No signup required.',
    keywords: [
      'pan card photo size', 'resize photo for pan card', 'pan card photo resizer',
      'nsdl photo size', 'pan card photo requirements', 'ishu tools pan photo',
      'ishu pan card resizer', 'pan card photo format',
    ],
    h1: 'PAN Card Photo Resizer — Free Online',
    faq: [],
  },
  'resize-image-for-upsc': {
    title: 'UPSC Photo Resizer — Resize Photo for UPSC Exam Free | ISHU TOOLS',
    description: 'Resize photo and signature for UPSC Civil Services, IAS, IFS exam registration. Correct specifications. No signup.',
    keywords: [
      'upsc photo resizer', 'upsc photo size', 'resize photo for upsc',
      'ias exam photo', 'upsc signature size', 'ishu tools upsc photo',
      'upsc photo requirements', 'ishu upsc photo resizer',
    ],
    h1: 'UPSC Photo Resizer — Exam Registration Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  IMAGE TOOLS (EXPANDED)
  // ════════════════════════════════════════════════
  'grayscale-image': {
    title: 'Grayscale Image — Convert Photo to Black & White Free | ISHU TOOLS',
    description: 'Convert any image to grayscale or black and white online for free. No signup, no watermark. Works with JPG, PNG, WEBP instantly.',
    keywords: [
      'grayscale image', 'black and white photo', 'convert image to grayscale',
      'grayscale converter', 'photo to grayscale', 'black white filter online',
      'ishu tools grayscale', 'ishu grayscale image', 'grayscale image online free',
      'black and white image converter', 'desaturate image online',
    ],
    h1: 'Grayscale Image — Convert to Black & White Free',
    faq: [
      { question: 'How to convert image to grayscale online?', answer: 'Upload your image to ISHU TOOLS Grayscale Image tool, click "Run", and download your black and white image instantly. Works with JPG, PNG, WEBP — no signup needed.' },
    ],
  },
  'blur-image': {
    title: 'Blur Image — Add Blur Effect to Photo Online Free | ISHU TOOLS',
    description: 'Add blur effect to images online for free. Apply Gaussian blur to photos for privacy or artistic effect. No signup, no watermark.',
    keywords: [
      'blur image', 'blur photo online', 'add blur to image', 'blur effect photo',
      'gaussian blur online', 'photo blur tool', 'ishu tools blur image',
      'ishu blur image', 'blur image online free', 'image blur effect',
    ],
    h1: 'Blur Image — Add Blur Effect Free',
    faq: [],
  },
  'flip-image': {
    title: 'Flip Image — Mirror Photo Horizontally & Vertically Free | ISHU TOOLS',
    description: 'Flip images horizontally or vertically online for free. Mirror your photos instantly. No signup, no watermark. Supports JPG, PNG, WEBP.',
    keywords: [
      'flip image', 'mirror image', 'flip photo', 'horizontal flip', 'vertical flip',
      'flip image online', 'mirror photo online', 'ishu tools flip image',
      'ishu flip image', 'flip image online free', 'image flipper',
    ],
    h1: 'Flip Image — Mirror Photos Free Online',
    faq: [],
  },
  'sharpen-image': {
    title: 'Sharpen Image — Make Photos Clearer & Sharper Free | ISHU TOOLS',
    description: 'Sharpen blurry images online for free. Enhance photo clarity and detail with our online image sharpener. No signup required.',
    keywords: [
      'sharpen image', 'image sharpener', 'sharpen photo online', 'make image clearer',
      'enhance image sharpness', 'photo sharpener', 'ishu tools sharpen image',
      'ishu sharpen image', 'sharpen image online free', 'unblur photo online',
    ],
    h1: 'Sharpen Image — Make Photos Crisp & Clear Free',
    faq: [],
  },
  'brighten-image': {
    title: 'Brighten Image — Adjust Photo Brightness Online Free | ISHU TOOLS',
    description: 'Brighten dark images or adjust photo brightness online for free. Control brightness and contrast to perfect your photos. No signup required.',
    keywords: [
      'brighten image', 'brighten photo', 'adjust brightness', 'photo brightness',
      'image brightness tool', 'lighten image online', 'ishu tools brighten image',
      'ishu brighten image', 'brighten image online free', 'make image brighter',
    ],
    h1: 'Brighten Image — Adjust Brightness Free',
    faq: [],
  },
  'invert-image': {
    title: 'Invert Image — Create Negative Effect Photo Free | ISHU TOOLS',
    description: 'Invert image colors to create a negative effect online for free. Apply color inversion filter to any photo instantly. No signup required.',
    keywords: [
      'invert image', 'image invert', 'negative effect photo', 'color inversion',
      'invert colors online', 'photo negative effect', 'ishu tools invert image',
      'ishu invert image', 'invert image online free', 'image negative filter',
    ],
    h1: 'Invert Image — Create Negative Effect Free',
    faq: [],
  },
  'image-collage': {
    title: 'Image Collage Maker — Create Photo Collage Online Free | ISHU TOOLS',
    description: 'Create beautiful photo collages online for free. Combine multiple images into one collage. No signup, no watermark.',
    keywords: [
      'image collage', 'photo collage maker', 'collage creator', 'make photo collage',
      'combine photos', 'collage online free', 'ishu tools collage',
      'ishu image collage', 'photo collage maker free', 'image grid maker',
    ],
    h1: 'Image Collage Maker — Create Photo Collages Free',
    faq: [],
  },
  'add-text-image': {
    title: 'Add Text to Image — Write on Photos Online Free | ISHU TOOLS',
    description: 'Add custom text, captions, or labels to images online for free. Choose font, size, color, and position. No signup, no watermark.',
    keywords: [
      'add text to image', 'write on photo', 'text on image', 'caption photo',
      'add caption to image', 'image text tool', 'ishu tools add text image',
      'ishu add text image', 'add text photo online free', 'photo caption maker',
    ],
    h1: 'Add Text to Image — Write on Photos Free',
    faq: [],
  },
  'add-border-image': {
    title: 'Add Border to Image — Photo Frame & Border Online Free | ISHU TOOLS',
    description: 'Add borders and frames to images online for free. Choose border color, width, and style. No signup, no watermark.',
    keywords: [
      'add border to image', 'photo border', 'image frame', 'add frame to photo',
      'image border tool', 'picture frame online', 'ishu tools add border',
      'ishu add border image', 'photo border maker free', 'image border online',
    ],
    h1: 'Add Border to Image — Photo Frames Free',
    faq: [],
  },
  'circle-crop-image': {
    title: 'Circle Crop Image — Crop Photo to Circle Shape Free | ISHU TOOLS',
    description: 'Crop images to a circle shape online for free. Perfect for profile pictures, avatars, and social media. No signup, no watermark.',
    keywords: [
      'circle crop image', 'crop photo to circle', 'circular image crop',
      'profile picture crop', 'avatar maker', 'round image online',
      'ishu tools circle crop', 'ishu circle crop image', 'circle image crop free',
      'circular photo crop online', 'profile picture circle',
    ],
    h1: 'Circle Crop Image — Round Photo Crop Free',
    faq: [],
  },
  'remove-background': {
    title: 'Remove Background — AI Background Remover Free | ISHU TOOLS',
    description: 'Remove image background automatically with AI online for free. Get transparent PNG output instantly. Best AI background remover. No signup.',
    keywords: [
      'remove background', 'background remover', 'remove image background',
      'ai background remover', 'transparent background', 'cut out background',
      'ishu tools remove background', 'ishu remove background', 'bg remover online free',
      'remove bg free', 'photo background eraser', 'remove background from photo',
    ],
    h1: 'Remove Background — AI Background Remover Free',
    faq: [
      { question: 'How to remove image background for free?', answer: 'Upload your image to ISHU TOOLS Remove Background tool. AI automatically removes the background and gives you a transparent PNG — completely free, no signup, no watermark.' },
    ],
  },
  'jpg-to-png': {
    title: 'JPG to PNG — Convert JPG to PNG Online Free | ISHU TOOLS',
    description: 'Convert JPG images to PNG format online for free. Maintain quality, supports transparency. Batch conversion. No signup, no watermark.',
    keywords: [
      'jpg to png', 'convert jpg to png', 'jpeg to png converter', 'jpg png converter',
      'image format converter', 'ishu tools jpg to png', 'ishu jpg to png',
      'jpg to png free', 'jpg to png online', 'convert jpeg to png free',
    ],
    h1: 'JPG to PNG Converter — Free Online',
    faq: [],
  },
  'png-to-jpg': {
    title: 'PNG to JPG — Convert PNG to JPG Online Free | ISHU TOOLS',
    description: 'Convert PNG images to JPG/JPEG format online for free. Control quality settings. No signup, no watermark. Works instantly.',
    keywords: [
      'png to jpg', 'convert png to jpg', 'png to jpeg converter', 'png jpg converter',
      'ishu tools png to jpg', 'ishu png to jpg', 'png to jpg free',
      'png to jpeg online', 'convert png to jpeg free', 'image format converter',
    ],
    h1: 'PNG to JPG Converter — Free Online',
    faq: [],
  },
  'image-to-webp': {
    title: 'Image to WebP — Convert to WebP Format Online Free | ISHU TOOLS',
    description: 'Convert JPG, PNG, WEBP, GIF images to WebP format online for free. Smaller file size, faster loading. No signup required.',
    keywords: [
      'image to webp', 'convert to webp', 'jpg to webp', 'png to webp',
      'webp converter', 'webp format', 'ishu tools webp converter',
      'ishu image to webp', 'image to webp free', 'webp image converter online',
    ],
    h1: 'Image to WebP — Convert Images Free',
    faq: [],
  },
  'webp-to-jpg': {
    title: 'WebP to JPG — Convert WebP to JPG Online Free | ISHU TOOLS',
    description: 'Convert WebP images to JPG/JPEG format online for free. No signup, no watermark. Fast and instant conversion.',
    keywords: [
      'webp to jpg', 'convert webp to jpg', 'webp to jpeg', 'webp to png',
      'webp converter', 'ishu tools webp to jpg', 'ishu webp to jpg',
      'webp to jpg free', 'webp to jpg online', 'convert webp to jpeg free',
    ],
    h1: 'WebP to JPG Converter — Free Online',
    faq: [],
  },
  'thumbnail-image': {
    title: 'Image Thumbnail Generator — Create Thumbnails Free | ISHU TOOLS',
    description: 'Create image thumbnails online for free. Resize images to thumbnail size for web, YouTube, or social media. No signup required.',
    keywords: [
      'image thumbnail', 'thumbnail generator', 'create thumbnail', 'thumbnail maker',
      'youtube thumbnail maker', 'image resize to thumbnail', 'ishu tools thumbnail',
      'ishu thumbnail generator', 'thumbnail image online free',
    ],
    h1: 'Image Thumbnail Generator — Create Thumbnails Free',
    faq: [],
  },
  'join-images': {
    title: 'Join Images — Merge Multiple Images Online Free | ISHU TOOLS',
    description: 'Join and merge multiple images side by side or vertically online for free. Combine photos into one image. No signup required.',
    keywords: [
      'join images', 'merge images', 'combine images', 'stitch images online',
      'merge photos', 'image merger', 'ishu tools join images',
      'ishu join images', 'combine multiple images free', 'merge images online',
    ],
    h1: 'Join Images — Merge & Combine Photos Free',
    faq: [],
  },
  'split-image': {
    title: 'Split Image — Cut Photo into Multiple Parts Free | ISHU TOOLS',
    description: 'Split images into multiple equal parts online for free. Cut photos into grid sections for Instagram or printing. No signup required.',
    keywords: [
      'split image', 'cut image', 'divide image', 'image splitter',
      'instagram grid maker', 'photo cutter', 'ishu tools split image',
      'ishu split image', 'split image online free', 'image grid splitter',
    ],
    h1: 'Split Image — Cut Photos into Parts Free',
    faq: [],
  },
  'image-color-picker': {
    title: 'Image Color Picker — Pick Colors from Photos Online Free | ISHU TOOLS',
    description: 'Pick colors from any image online for free. Get HEX, RGB, and HSL color codes from photos. Best image color picker tool. No signup.',
    keywords: [
      'image color picker', 'pick color from image', 'color picker from photo',
      'eyedropper online', 'hex color from image', 'rgb from photo',
      'ishu tools color picker', 'ishu image color picker', 'color picker online free',
    ],
    h1: 'Image Color Picker — Get Colors from Photos Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  TEXT & DEVELOPER TOOLS (EXPANDED)
  // ════════════════════════════════════════════════
  'word-count-text': {
    title: 'Word Counter — Count Words, Characters & Sentences Free | ISHU TOOLS',
    description: 'Count words, characters, sentences, and paragraphs in your text online for free. Instant word and character counter. No signup required.',
    keywords: [
      'word counter', 'word count', 'character counter', 'count words online',
      'word count tool', 'text word counter', 'ishu tools word counter',
      'ishu word counter', 'word counter online free', 'words characters sentences',
      'text statistics', 'count characters online', 'essay word counter',
    ],
    h1: 'Word Counter — Count Words & Characters Free',
    faq: [
      { question: 'How to count words online for free?', answer: 'Paste your text into ISHU TOOLS Word Counter and get instant counts for words, characters, sentences, and paragraphs — completely free, no signup needed.' },
    ],
  },
  'case-converter-text': {
    title: 'Case Converter — Convert Text to Upper/Lowercase Free | ISHU TOOLS',
    description: 'Convert text to uppercase, lowercase, title case, sentence case, and camelCase online for free. Best text case converter tool. No signup.',
    keywords: [
      'case converter', 'text case converter', 'uppercase converter', 'lowercase converter',
      'title case', 'sentence case', 'camelcase converter', 'ishu tools case converter',
      'convert text case online', 'ishu case converter', 'text formatting tool',
    ],
    h1: 'Case Converter — Change Text Case Free Online',
    faq: [],
  },
  'slug-generator-text': {
    title: 'Slug Generator — Create URL Slugs from Text Free | ISHU TOOLS',
    description: 'Generate SEO-friendly URL slugs from any text online for free. Convert titles to URL slugs instantly. No signup required.',
    keywords: [
      'slug generator', 'url slug generator', 'seo slug', 'url friendly text',
      'slug maker', 'permalink generator', 'ishu tools slug generator',
      'ishu slug generator', 'slug generator online free', 'text to url slug',
    ],
    h1: 'Slug Generator — Create URL Slugs Free',
    faq: [],
  },
  'remove-extra-spaces-text': {
    title: 'Remove Extra Spaces — Clean Up Text Spaces Online Free | ISHU TOOLS',
    description: 'Remove extra spaces, double spaces, and leading/trailing whitespace from text online for free. Clean and format text instantly. No signup.',
    keywords: [
      'remove extra spaces', 'remove double spaces', 'trim whitespace',
      'clean text spaces', 'text cleaner', 'strip whitespace online',
      'ishu tools remove spaces', 'ishu remove extra spaces', 'text space remover free',
    ],
    h1: 'Remove Extra Spaces — Clean Text Free',
    faq: [],
  },
  'sort-lines-text': {
    title: 'Sort Lines — Sort Text Lines Alphabetically Free | ISHU TOOLS',
    description: 'Sort lines of text alphabetically, numerically, or in reverse order online for free. Line sorter tool with deduplication. No signup.',
    keywords: [
      'sort lines', 'sort text lines', 'line sorter', 'alphabetical sort',
      'sort text online', 'text sorter', 'ishu tools sort lines',
      'ishu sort lines', 'sort text lines online free', 'alphabetize list',
    ],
    h1: 'Sort Lines — Alphabetize Text Free Online',
    faq: [],
  },
  'deduplicate-lines-text': {
    title: 'Remove Duplicate Lines — Deduplicate Text Online Free | ISHU TOOLS',
    description: 'Remove duplicate lines from text online for free. Keep unique lines only. Perfect for cleaning lists, CSV data, and code. No signup.',
    keywords: [
      'remove duplicate lines', 'deduplicate lines', 'remove duplicates from list',
      'unique lines tool', 'duplicate line remover', 'ishu tools deduplicate',
      'ishu remove duplicate lines', 'remove duplicate text online free',
    ],
    h1: 'Remove Duplicate Lines — Deduplicate Text Free',
    faq: [],
  },
  'find-replace-text': {
    title: 'Find & Replace Text — Replace Words in Text Online Free | ISHU TOOLS',
    description: 'Find and replace text or words in bulk online for free. Supports plain text, case-sensitive search, and regex. No signup required.',
    keywords: [
      'find replace text', 'find and replace', 'text replace tool',
      'replace words in text', 'bulk text replace', 'ishu tools find replace',
      'ishu find replace text', 'find replace online free', 'text search replace',
    ],
    h1: 'Find & Replace Text — Bulk Replace Free Online',
    faq: [],
  },
  'extract-keywords-text': {
    title: 'Extract Keywords — Keyword Extractor from Text Free | ISHU TOOLS',
    description: 'Extract important keywords from any text online for free. Keyword extraction for SEO, NLP, and content analysis. No signup.',
    keywords: [
      'extract keywords', 'keyword extractor', 'keyword extraction', 'text keyword tool',
      'seo keyword extractor', 'extract keywords from text', 'ishu tools keyword extractor',
      'ishu extract keywords', 'keyword extraction online free', 'nlp keyword tool',
    ],
    h1: 'Extract Keywords — Keyword Extractor Free',
    faq: [],
  },
  'reading-time-text': {
    title: 'Reading Time Calculator — Estimate Article Reading Time Free | ISHU TOOLS',
    description: 'Calculate estimated reading time for any article or text online for free. Know how long it takes to read your content. No signup.',
    keywords: [
      'reading time calculator', 'estimate reading time', 'article reading time',
      'words per minute', 'wpm calculator', 'ishu tools reading time',
      'ishu reading time calculator', 'reading time online free', 'read time estimator',
    ],
    h1: 'Reading Time Calculator — Estimate Read Time Free',
    faq: [],
  },
  'lorem-ipsum-generator': {
    title: 'Lorem Ipsum Generator — Generate Placeholder Text Free | ISHU TOOLS',
    description: 'Generate lorem ipsum placeholder text for web design, mockups, and prototypes online for free. Control paragraphs, words, and sentences. No signup.',
    keywords: [
      'lorem ipsum generator', 'placeholder text', 'dummy text generator',
      'lorem ipsum online', 'generate lorem ipsum', 'filler text generator',
      'ishu tools lorem ipsum', 'ishu lorem ipsum generator', 'lorem ipsum free',
      'lipsum generator', 'placeholder content generator',
    ],
    h1: 'Lorem Ipsum Generator — Placeholder Text Free',
    faq: [],
  },
  'url-encode': {
    title: 'URL Encoder — Encode URL Online Free | ISHU TOOLS',
    description: 'Encode URLs and special characters for safe web transmission online for free. Percent-encode any URL instantly. No signup required.',
    keywords: [
      'url encoder', 'encode url', 'url encoding', 'percent encode url',
      'url encode online', 'encode special characters', 'ishu tools url encoder',
      'ishu url encode', 'url encoder online free', 'uri encoder',
    ],
    h1: 'URL Encoder — Encode URLs Free Online',
    faq: [],
  },
  'url-decode': {
    title: 'URL Decoder — Decode URL Online Free | ISHU TOOLS',
    description: 'Decode percent-encoded URLs back to readable text online for free. URL decoding tool. No signup required.',
    keywords: [
      'url decoder', 'decode url', 'url decoding', 'percent decode url',
      'url decode online', 'decode encoded url', 'ishu tools url decoder',
      'ishu url decode', 'url decoder online free', 'uri decoder',
    ],
    h1: 'URL Decoder — Decode URLs Free Online',
    faq: [],
  },
  'html-encode': {
    title: 'HTML Encoder — Encode HTML Entities Online Free | ISHU TOOLS',
    description: 'Encode HTML entities and special characters for safe display online for free. Convert <, >, &, quotes to HTML entities. No signup.',
    keywords: [
      'html encoder', 'html entities', 'encode html', 'html escape',
      'html entity encoder', 'ishu tools html encoder', 'ishu html encode',
      'html encode online free', 'html special characters', 'html escape tool',
    ],
    h1: 'HTML Encoder — Encode HTML Entities Free',
    faq: [],
  },
  'html-decode': {
    title: 'HTML Decoder — Decode HTML Entities Online Free | ISHU TOOLS',
    description: 'Decode HTML entities back to normal characters online for free. Convert &amp;, &lt;, &gt; and other entities to readable text. No signup.',
    keywords: [
      'html decoder', 'html entities decoder', 'decode html', 'html unescape',
      'html entity decoder', 'ishu tools html decoder', 'ishu html decode',
      'html decode online free', 'decode html entities online',
    ],
    h1: 'HTML Decoder — Decode HTML Entities Free',
    faq: [],
  },
  'morse-code': {
    title: 'Morse Code Translator — Text to Morse Code Free | ISHU TOOLS',
    description: 'Convert text to Morse code and Morse code back to text online for free. Audio playback support. No signup required.',
    keywords: [
      'morse code translator', 'text to morse code', 'morse code converter',
      'morse code decoder', 'morse code encoder', 'ishu tools morse code',
      'ishu morse code translator', 'morse code translator online free',
      'learn morse code', 'morse code generator',
    ],
    h1: 'Morse Code Translator — Text to Morse Free',
    faq: [],
  },
  'text-to-binary': {
    title: 'Text to Binary — Convert Text to Binary Code Free | ISHU TOOLS',
    description: 'Convert text to binary code and binary back to text online for free. Learn how binary encoding works. No signup required.',
    keywords: [
      'text to binary', 'binary converter', 'binary code', 'text binary converter',
      'convert text to binary', 'binary to text', 'ishu tools text to binary',
      'ishu text to binary', 'text to binary online free', 'binary encoding',
    ],
    h1: 'Text to Binary — Convert Text to Binary Free',
    faq: [],
  },
  'random-number-generator': {
    title: 'Random Number Generator — Generate Random Numbers Free | ISHU TOOLS',
    description: 'Generate random numbers within any range online for free. Set min, max, and count. Generate unique random integers. No signup.',
    keywords: [
      'random number generator', 'random number', 'generate random numbers',
      'random integer generator', 'number randomizer', 'ishu tools random number',
      'ishu random number generator', 'random number generator online free',
      'lottery number generator', 'dice random number',
    ],
    h1: 'Random Number Generator — Generate Random Numbers Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  SEO TOOLS
  // ════════════════════════════════════════════════
  'meta-tag-generator': {
    title: 'Meta Tag Generator — Create SEO Meta Tags Free | ISHU TOOLS',
    description: 'Generate HTML meta tags for SEO online for free. Create title, description, keywords, and Open Graph tags for your website. Best SEO tool.',
    keywords: [
      'meta tag generator', 'create meta tags', 'seo meta tags', 'html meta tags',
      'meta description generator', 'ishu tools meta tag', 'seo tool',
      'ishu meta tag generator', 'website meta tags',
    ],
    h1: 'Meta Tag Generator — SEO Tags Free',
    faq: [],
  },
  'keyword-density': {
    title: 'Keyword Density Checker — Analyze Keyword Usage Free | ISHU TOOLS',
    description: 'Check keyword density in your content online for free. Analyze word frequency and keyword usage for SEO optimization. No signup.',
    keywords: [
      'keyword density', 'keyword density checker', 'keyword analysis', 'seo keyword tool',
      'word frequency', 'ishu tools keyword density', 'content analysis',
      'ishu keyword density', 'seo content checker',
    ],
    h1: 'Keyword Density Checker — SEO Analysis Free',
    faq: [],
  },
}

/**
 * Homepage SEO keywords — comprehensive keyword list for ISHU TOOLS
 */
export const HOMEPAGE_KEYWORDS = [
  'ishu tools', 'ISHU TOOLS', 'ishutools', 'ishu kumar tools', 'ishu iitp',
  'indian student hub university tools', 'ishu tools online', 'ishutools.com',
  'free pdf tools', 'merge pdf', 'split pdf', 'compress pdf', 'pdf compressor',
  'pdf to word', 'word to pdf', 'pdf to jpg', 'jpg to pdf', 'pdf converter',
  'pdf editor', 'edit pdf online', 'pdf merger', 'pdf splitter',
  'rotate pdf', 'unlock pdf', 'protect pdf', 'encrypt pdf',
  'pdf to excel', 'excel to pdf', 'pdf to powerpoint', 'powerpoint to pdf',
  'pdf to png', 'png to pdf', 'ocr pdf', 'repair pdf', 'compress pdf online',
  'merge pdf online free', 'split pdf online free', 'pdf to docx',
  'compress image', 'resize image', 'crop image', 'rotate image',
  'image compressor', 'image resizer', 'convert image',
  'jpg to png', 'png to jpg', 'image to webp', 'webp to jpg',
  'remove background', 'blur image', 'sharpen image', 'watermark image',
  'meme generator', 'image to pdf', 'photo compressor', 'photo resizer',
  'passport photo maker', 'resize image in kb', 'reduce image size',
  'json formatter', 'json beautifier', 'json validator', 'base64 encoder',
  'base64 decoder', 'url encoder', 'url decoder', 'html encoder',
  'uuid generator', 'hash generator', 'md5 generator', 'sha256 generator',
  'regex tester', 'diff checker', 'password generator', 'lorem ipsum generator',
  'color picker', 'hex to rgb', 'rgb to hex', 'gradient generator',
  'percentage calculator', 'bmi calculator', 'age calculator',
  'emi calculator', 'loan calculator', 'compound interest calculator',
  'simple interest calculator', 'gpa calculator', 'cgpa calculator',
  'discount calculator', 'tip calculator', 'scientific calculator',
  'word counter', 'character counter', 'case converter',
  'temperature converter', 'length converter', 'weight converter',
  'qr code generator', 'barcode generator', 'translate text',
  'student tools', 'online tools for students', 'free tools for students',
  'free online tools', 'best free tools', 'no signup tools',
  'no watermark tools', 'all in one tools', 'developer tools',
]
