import type { ToolCategory, ToolDefinition } from '../types/tools'

export const FALLBACK_CATEGORIES: ToolCategory[] = [
  {
    "id": "pdf-core",
    "label": "PDF Core",
    "description": "Merge, split, convert, and optimize PDFs for daily workflows."
  },
  {
    "id": "pdf-security",
    "label": "PDF Security",
    "description": "Protect, unlock, and redact files safely."
  },
  {
    "id": "pdf-advanced",
    "label": "PDF Advanced",
    "description": "Page organization, comparison, translation, and metadata flows."
  },
  {
    "id": "image-core",
    "label": "Image Essentials",
    "description": "Compress, resize, crop, rotate, and convert images in bulk."
  },
  {
    "id": "image-effects",
    "label": "Image Effects",
    "description": "Watermarking, blur, grayscale, pixelate, meme, and styling tools."
  },
  {
    "id": "document-convert",
    "label": "Document Convert",
    "description": "Turn text, HTML, and markdown content into PDFs."
  },
  {
    "id": "office-suite",
    "label": "Office Suite",
    "description": "Convert between PDF and DOCX, PPTX, XLSX formats for office workflows."
  },
  {
    "id": "text-ai",
    "label": "Text and AI Utilities",
    "description": "Summarize and translate text or PDF content."
  },
  {
    "id": "utility",
    "label": "Utility Lab",
    "description": "Extra productivity helpers like QR generation and metadata tools."
  },
  {
    "id": "page-ops",
    "label": "Page Operations",
    "description": "Extract, delete, reorder, and resize PDF pages quickly."
  },
  {
    "id": "format-lab",
    "label": "Format Lab",
    "description": "Extended format conversion tools for image and PDF workflows."
  },
  {
    "id": "data-tools",
    "label": "Data and Export",
    "description": "Export PDF/text content into TXT, CSV, JSON, and Markdown formats."
  },
  {
    "id": "image-layout",
    "label": "Image Layout Studio",
    "description": "Flip, add borders, generate thumbnails, and build collages."
  },
  {
    "id": "text-ops",
    "label": "Text Operations",
    "description": "Word analytics, case conversion, keyword extraction, and slug generation."
  },
  {
    "id": "archive-lab",
    "label": "Archive Workflows",
    "description": "ZIP-oriented tools for image and PDF batch workflows."
  },
  {
    "id": "pdf-insights",
    "label": "PDF Insights",
    "description": "Analyze, flatten, reorder, and export PDF content into more formats."
  },
  {
    "id": "image-enhance",
    "label": "Image Enhancement",
    "description": "Sharpen, brighten, contrast, invert, and analyze image quality quickly."
  },
  {
    "id": "text-cleanup",
    "label": "Text Cleanup",
    "description": "Clean, sort, deduplicate, and transform text files for production use."
  },
  {
    "id": "batch-automation",
    "label": "Batch Automation",
    "description": "Batch zip, conversion, merge, and JSON/CSV automation workflows."
  },
  {
    "id": "ocr-vision",
    "label": "OCR and Vision AI",
    "description": "OCR, face blur, and background cleanup workflows for scanned files and images."
  },
  {
    "id": "ebook-convert",
    "label": "eBook and Rich Text",
    "description": "Convert between PDF, EPUB, ODT, and RTF document formats."
  },
  {
    "id": "vector-lab",
    "label": "Vector and Scan Formats",
    "description": "Convert SVG, TIFF, and scan-heavy assets into more usable outputs."
  },
  {
    "id": "math-tools",
    "label": "Math & Calculators",
    "description": "Percentage, BMI, age, EMI, GPA, discount, and tip calculators."
  },
  {
    "id": "student-tools",
    "label": "Student & Everyday",
    "description": "Number converters, text transformers, countdown, random generators."
  },
  {
    "id": "video-tools",
    "label": "Video Downloader",
    "description": "Download videos from YouTube, Instagram, Twitter/X, TikTok, and 1000+ sites."
  },
  {
    "id": "network-tools",
    "label": "Network & Web Tools",
    "description": "IP lookup, DNS checker, WHOIS, SSL checker, and web utility tools."
  },
  {
    "id": "finance-tools",
    "label": "Finance & Tax",
    "description": "GST calculator, SIP planner, ROI, budget planner, income tax (Indian), savings goal."
  },
  {
    "id": "productivity",
    "label": "Productivity Tools",
    "description": "Notepad, to-do list, pomodoro timer, habit tracker, invoice generator, and more."
  },
  {
    "id": "health-tools",
    "label": "Health & Fitness",
    "description": "Calorie calculator, BMR, body fat, water intake, sleep cycles, heart rate zones, steps counter."
  },
  {
    "id": "science-tools",
    "label": "Science Tools",
    "description": "Periodic table element lookup, molecular weight calculator, physics equations, and science utilities."
  },
  {
    "id": "geography-tools",
    "label": "Geography & World",
    "description": "Country facts, world timezones, distance between coordinates, and geography tools."
  },
  {
    "id": "cooking-tools",
    "label": "Cooking & Food",
    "description": "Recipe scaler, cooking measurement converter, food calorie lookup, and kitchen tools."
  },
  {
    "id": "developer-tools",
    "label": "Developer Tools",
    "description": "JSON formatter, Base64 encoder/decoder, UUID generator, regex tester, code minifiers, and more for developers."
  },
  {
    "id": "color-tools",
    "label": "Color Tools",
    "description": "Color picker, HEX to RGB, palette generator, contrast checker, and gradient tools."
  },
  {
    "id": "unit-converter",
    "label": "Unit Converters",
    "description": "Length, weight, temperature, area, volume, time, and data-size converters."
  },
  {
    "id": "hash-crypto",
    "label": "Hash & Crypto",
    "description": "MD5, SHA, UUID, password, and lorem ipsum generators."
  },
  {
    "id": "seo-tools",
    "label": "SEO Tools",
    "description": "Meta tags, readability, keyword density, and content analysis."
  },
  {
    "id": "code-tools",
    "label": "Code Tools",
    "description": "Minify, prettify, diff, and validate code snippets."
  },
  {
    "id": "security-tools",
    "label": "Security Tools",
    "description": "Password generator, hash generators (MD5, SHA-256, BCrypt), and password strength checker."
  },
  {
    "id": "conversion-tools",
    "label": "Unit Converters",
    "description": "Temperature, length, weight, speed, data storage, area, volume, and more unit conversions."
  },
  {
    "id": "social-media",
    "label": "Social Media Tools",
    "description": "Image resizers for Instagram, YouTube, Twitter, Facebook, LinkedIn, and WhatsApp."
  },
  {
    "id": "ai-writing",
    "label": "AI Writing Tools",
    "description": "Headline, outline, email, product, and social copy generators."
  },
  {
    "id": "crypto-web3",
    "label": "Crypto & Web3",
    "description": "Crypto profit, gas fee, DCA, NFT royalty, and mining calculators."
  },
  {
    "id": "finance-tax",
    "label": "Finance & Tax",
    "description": "India-focused tax, GST, salary, and investment calculators."
  },
  {
    "id": "health-fitness",
    "label": "Health & Fitness",
    "description": "Daily calories, water, sleep, heart-rate, steps, and activity calculators."
  },
  {
    "id": "hr-jobs",
    "label": "HR & Jobs",
    "description": "Salary hike, offer comparison, interview prep, resignation, and negotiation helpers."
  },
  {
    "id": "legal-tools",
    "label": "Legal Tools",
    "description": "NDA, freelance contract, privacy policy, and business document generators."
  },
  {
    "id": "math-calculators",
    "label": "Math Calculators",
    "description": "Percentage, fractions, equations, matrices, and everyday math tools."
  },
  {
    "id": "text-operations",
    "label": "Text Operations",
    "description": "Sort, deduplicate, compare, encode, analyze, and transform text."
  },
  {
    "id": "travel-tools",
    "label": "Travel Tools",
    "description": "Trip budget, visa checklist, currency, and packing-list helpers."
  },
  {
    "id": "writing-tools",
    "label": "Writing Tools",
    "description": "Paraphrasers, essay outlines, flashcards, email templates, cover letters, blog outlines, and more."
  },
  {
    "id": "developer-generators",
    "label": "Developer Generators",
    "description": "SQL formatters, Dockerfiles, nginx configs, GitHub Actions workflows, license generators, README builders."
  },
  {
    "id": "business-tools",
    "label": "Business Tools",
    "description": "Invoice generators, expense splitters, meeting planners, slogan generators, and social bios."
  }
]

export const FALLBACK_TOOLS: ToolDefinition[] = [
  {
    "slug": "merge-pdf",
    "title": "Merge PDF",
    "description": "Combine multiple PDF files in chosen order.",
    "category": "pdf-core",
    "tags": [
      "merge",
      "combine",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "split-pdf",
    "title": "Split PDF",
    "description": "Split one PDF into separate page files.",
    "category": "pdf-core",
    "tags": [
      "split",
      "pages",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-pdf",
    "title": "Compress PDF",
    "description": "Shrink PDF size using Ghostscript — choose screen, ebook, printer, or prepress quality targets.",
    "category": "pdf-core",
    "tags": [
      "compress",
      "optimize",
      "pdf",
      "ghostscript"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "rotate-pdf",
    "title": "Rotate PDF",
    "description": "Rotate all pages in a PDF.",
    "category": "pdf-core",
    "tags": [
      "rotate",
      "pdf",
      "orientation"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "organize-pdf",
    "title": "Organize PDF",
    "description": "Reorder pages using a custom page sequence.",
    "category": "pdf-advanced",
    "tags": [
      "reorder",
      "organize",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "crop-pdf",
    "title": "Crop PDF",
    "description": "Crop margins of all pages by custom values.",
    "category": "pdf-advanced",
    "tags": [
      "crop",
      "pdf",
      "margins"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "watermark-pdf",
    "title": "Watermark PDF",
    "description": "Add text watermark to each page.",
    "category": "pdf-core",
    "tags": [
      "watermark",
      "branding",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "page-numbers-pdf",
    "title": "Page Numbers",
    "description": "Insert page numbers at top or bottom positions.",
    "category": "pdf-advanced",
    "tags": [
      "page numbers",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "protect-pdf",
    "title": "Protect PDF",
    "description": "Encrypt PDF with a password.",
    "category": "pdf-security",
    "tags": [
      "password",
      "encrypt",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "unlock-pdf",
    "title": "Unlock PDF",
    "description": "Remove password from protected PDF.",
    "category": "pdf-security",
    "tags": [
      "unlock",
      "decrypt",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "redact-pdf",
    "title": "Redact PDF",
    "description": "Find and blackout specific keywords.",
    "category": "pdf-security",
    "tags": [
      "redact",
      "privacy",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "compare-pdf",
    "title": "Compare PDF",
    "description": "Compare text between two PDFs and generate diff output.",
    "category": "pdf-advanced",
    "tags": [
      "compare",
      "diff",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "extract-text-pdf",
    "title": "Extract Text",
    "description": "Extract all text content from a PDF file.",
    "category": "pdf-advanced",
    "tags": [
      "extract",
      "text",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "extract-images-pdf",
    "title": "Extract Images",
    "description": "Extract embedded images from a PDF.",
    "category": "pdf-advanced",
    "tags": [
      "extract",
      "images",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-jpg",
    "title": "PDF to JPG",
    "description": "Render each PDF page into JPG files.",
    "category": "pdf-core",
    "tags": [
      "convert",
      "pdf",
      "jpg"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-png",
    "title": "PDF to PNG",
    "description": "Render each PDF page into PNG files.",
    "category": "pdf-core",
    "tags": [
      "convert",
      "pdf",
      "png"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "jpg-to-pdf",
    "title": "JPG to PDF",
    "description": "Convert multiple images into one PDF.",
    "category": "pdf-core",
    "tags": [
      "convert",
      "jpg",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "image-to-pdf",
    "title": "Image to PDF",
    "description": "Convert mixed image formats into one PDF.",
    "category": "pdf-core",
    "tags": [
      "image",
      "convert",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "repair-pdf",
    "title": "Repair PDF",
    "description": "Attempt to rebuild and repair a damaged PDF structure.",
    "category": "pdf-advanced",
    "tags": [
      "repair",
      "recover",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "translate-pdf",
    "title": "Translate PDF",
    "description": "Extract and translate PDF text into a selected language.",
    "category": "text-ai",
    "tags": [
      "translate",
      "pdf",
      "ai"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "summarize-pdf",
    "title": "Summarize PDF",
    "description": "Generate concise summary from PDF text.",
    "category": "text-ai",
    "tags": [
      "summary",
      "pdf",
      "ai"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image",
    "title": "Compress Image",
    "description": "Compress JPG, PNG, and WebP images.",
    "category": "image-core",
    "tags": [
      "compress",
      "image",
      "optimize"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "resize-image",
    "title": "Resize Image",
    "description": "Resize image by width and height.",
    "category": "image-core",
    "tags": [
      "resize",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "crop-image",
    "title": "Crop Image",
    "description": "Crop image using x/y/width/height values.",
    "category": "image-core",
    "tags": [
      "crop",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "rotate-image",
    "title": "Rotate Image",
    "description": "Rotate image by any angle.",
    "category": "image-core",
    "tags": [
      "rotate",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "convert-image",
    "title": "Convert Image",
    "description": "Convert image between JPG, PNG, WEBP, and GIF.",
    "category": "image-core",
    "tags": [
      "convert",
      "image",
      "format"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "watermark-image",
    "title": "Watermark Image",
    "description": "Overlay custom text watermark on image.",
    "category": "image-effects",
    "tags": [
      "watermark",
      "image",
      "branding"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "grayscale-image",
    "title": "Grayscale Image",
    "description": "Convert image into grayscale mode.",
    "category": "image-effects",
    "tags": [
      "grayscale",
      "image",
      "effect"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "blur-image",
    "title": "Blur Image",
    "description": "Apply gaussian blur to an image.",
    "category": "image-effects",
    "tags": [
      "blur",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "pixelate-image",
    "title": "Pixelate Image",
    "description": "Apply pixelation effect to entire image. Choose pixel block size for desired mosaic effect.",
    "category": "image-effects",
    "tags": [
      "pixelate",
      "mosaic",
      "pixel",
      "censor",
      "effect"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "meme-generator",
    "title": "Meme Generator",
    "description": "Create memes with custom top and bottom text. Upload any image to make viral meme content.",
    "category": "image-effects",
    "tags": [
      "meme",
      "meme generator",
      "meme maker",
      "funny",
      "caption",
      "viral"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-image",
    "title": "PDF to Image",
    "description": "Export PDF pages as images.",
    "category": "document-convert",
    "tags": [
      "pdf",
      "image",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "html-to-pdf",
    "title": "HTML to PDF",
    "description": "Convert URL or HTML text into a PDF report.",
    "category": "document-convert",
    "tags": [
      "html",
      "url",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "md-to-pdf",
    "title": "MD to PDF",
    "description": "Convert markdown content into PDF.",
    "category": "document-convert",
    "tags": [
      "markdown",
      "pdf",
      "convert"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "txt-to-pdf",
    "title": "TXT to PDF",
    "description": "Convert text files into PDF documents.",
    "category": "document-convert",
    "tags": [
      "txt",
      "pdf",
      "convert"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "summarize-text",
    "title": "Summarize Text",
    "description": "Generate short summary from long text.",
    "category": "text-ai",
    "tags": [
      "summary",
      "text",
      "ai"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "translate-text",
    "title": "Translate Text",
    "description": "Translate text into target language.",
    "category": "text-ai",
    "tags": [
      "translate",
      "text",
      "language"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "qr-code-generator",
    "title": "QR Code Generator",
    "description": "Generate QR code image from URL or text.",
    "category": "utility",
    "tags": [
      "qr",
      "utility",
      "image"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "extract-metadata",
    "title": "Extract Metadata",
    "description": "Read metadata from PDF or image files.",
    "category": "utility",
    "tags": [
      "metadata",
      "pdf",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "remove-metadata-image",
    "title": "Remove Image Metadata",
    "description": "Strip EXIF metadata from images.",
    "category": "utility",
    "tags": [
      "metadata",
      "exif",
      "privacy"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "extract-pages",
    "title": "Extract Pages",
    "description": "Extract selected pages into separate PDF files.",
    "category": "page-ops",
    "tags": [
      "extract",
      "pages",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "delete-pages",
    "title": "Delete Pages",
    "description": "Delete selected pages from a PDF document.",
    "category": "page-ops",
    "tags": [
      "delete",
      "pages",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "rearrange-pages",
    "title": "Rearrange Pages",
    "description": "Rearrange page order of a PDF file.",
    "category": "page-ops",
    "tags": [
      "rearrange",
      "pages",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "add-text-pdf",
    "title": "Add Text PDF",
    "description": "Overlay custom text on each page.",
    "category": "page-ops",
    "tags": [
      "text",
      "overlay",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "header-footer-pdf",
    "title": "Header and Footer",
    "description": "Add header and footer text to all pages.",
    "category": "page-ops",
    "tags": [
      "header",
      "footer",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-pages-pdf",
    "title": "Resize Pages",
    "description": "Scale all pages by a custom factor.",
    "category": "page-ops",
    "tags": [
      "resize",
      "pages",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "remove-metadata-pdf",
    "title": "Remove PDF Metadata",
    "description": "Remove metadata from PDF file.",
    "category": "pdf-security",
    "tags": [
      "metadata",
      "privacy",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "whiteout-pdf",
    "title": "Whiteout PDF",
    "description": "Whiteout selected keywords in a PDF.",
    "category": "pdf-security",
    "tags": [
      "whiteout",
      "privacy",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "grayscale-pdf",
    "title": "Grayscale PDF",
    "description": "Convert a color PDF to grayscale. Reduce file size and prepare for black-and-white printing.",
    "category": "pdf-advanced",
    "tags": [
      "grayscale",
      "black and white",
      "pdf",
      "convert",
      "print"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "create-pdf",
    "title": "Create PDF",
    "description": "Create a fresh PDF from plain text.",
    "category": "document-convert",
    "tags": [
      "create",
      "pdf",
      "text"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "url-to-pdf",
    "title": "URL to PDF",
    "description": "Convert webpage URL into PDF report.",
    "category": "document-convert",
    "tags": [
      "url",
      "pdf",
      "convert"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "png-to-pdf",
    "title": "PNG to PDF Converter (.png → .pdf)",
    "description": "Wrap a PNG image into a single-page PDF (A4 or original size).",
    "category": "format-lab",
    "tags": [
      "png to pdf",
      "convert png to pdf",
      "png pdf converter",
      ".png to .pdf",
      "png to pdf free",
      "png",
      "pdf",
      "pdf from png",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "webp-to-pdf",
    "title": "WebP to PDF Converter (.webp → .pdf)",
    "description": "Convert WebP (modern web format ~30% smaller than JPG/PNG) to PDF (Portable Document Format). Free, no signup, batch supported.",
    "category": "format-lab",
    "tags": [
      "webp to pdf",
      "convert webp to pdf",
      "webp pdf converter",
      ".webp to .pdf",
      "webp to pdf free",
      "webp",
      "pdf",
      "pdf from webp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "gif-to-pdf",
    "title": "GIF to PDF Converter (.gif → .pdf)",
    "description": "Convert GIF (indexed-palette format used for animations) to PDF (Portable Document Format). Free, no signup, batch supported.",
    "category": "format-lab",
    "tags": [
      "gif to pdf",
      "convert gif to pdf",
      "gif pdf converter",
      ".gif to .pdf",
      "gif to pdf free",
      "gif",
      "pdf",
      "pdf from gif",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "bmp-to-pdf",
    "title": "BMP to PDF Converter (.bmp → .pdf)",
    "description": "Convert BMP (uncompressed legacy Windows bitmap) to PDF (Portable Document Format). Free, no signup, batch supported.",
    "category": "format-lab",
    "tags": [
      "bmp to pdf",
      "convert bmp to pdf",
      "bmp pdf converter",
      ".bmp to .pdf",
      "bmp to pdf free",
      "bmp",
      "pdf",
      "pdf from bmp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "jpg-to-png",
    "title": "JPG to PNG Converter (.jpg → .png)",
    "description": "Convert JPG/JPEG photos to lossless PNG with optional transparency. Re-save without quality loss. Batch supported, no watermark.",
    "category": "format-lab",
    "tags": [
      "jpg to png",
      "convert jpg to png",
      "jpg png converter",
      ".jpg to .png",
      "jpg to png free",
      "jpg",
      "png",
      "png from jpg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "png-to-jpg",
    "title": "PNG to JPG Converter (.png → .jpg)",
    "description": "Convert transparent PNG to JPG with white (or chosen) background. Smaller files, perfect for sharing. Quality control included.",
    "category": "format-lab",
    "tags": [
      "png to jpg",
      "convert png to jpg",
      "png jpg converter",
      ".png to .jpg",
      "png to jpg free",
      "png",
      "jpg",
      "jpg from png",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "image-to-webp",
    "title": "Image to WebP Converter (any image → .webp)",
    "description": "Convert Image (any raster image (PNG/JPG/WebP)) to WebP (modern web format ~30% smaller than JPG/PNG). Free, no signup, batch supported.",
    "category": "format-lab",
    "tags": [
      "image to webp",
      "convert image to webp",
      "image webp converter",
      "image to .webp",
      "image to webp free",
      "image",
      "webp",
      "webp from image",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-txt",
    "title": "PDF to TXT",
    "description": "Export PDF text as plain TXT file.",
    "category": "data-tools",
    "tags": [
      "pdf",
      "txt",
      "export"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-markdown",
    "title": "PDF to Markdown",
    "description": "Export PDF content into markdown format.",
    "category": "data-tools",
    "tags": [
      "pdf",
      "markdown",
      "export"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-json",
    "title": "PDF to JSON",
    "description": "Export PDF text and metadata into JSON.",
    "category": "data-tools",
    "tags": [
      "pdf",
      "json",
      "export"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-csv",
    "title": "PDF to CSV",
    "description": "Extract tabular data from PDF and export as CSV file. Perfect for spreadsheet import.",
    "category": "data-tools",
    "tags": [
      "pdf to csv",
      "extract table",
      "csv export",
      "data extraction"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "json-to-pdf",
    "title": "JSON to PDF",
    "description": "Convert JSON text/file into PDF document.",
    "category": "data-tools",
    "tags": [
      "json",
      "pdf",
      "convert"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "xml-to-pdf",
    "title": "XML to PDF",
    "description": "Convert XML text/file into PDF document.",
    "category": "data-tools",
    "tags": [
      "xml",
      "pdf",
      "convert"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-pdf",
    "title": "CSV to PDF",
    "description": "Convert CSV spreadsheet data into a professionally formatted PDF table.",
    "category": "data-tools",
    "tags": [
      "csv to pdf",
      "table",
      "spreadsheet",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "flip-image",
    "title": "Flip Image",
    "description": "Flip image horizontally or vertically.",
    "category": "image-layout",
    "tags": [
      "flip",
      "image",
      "layout"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "add-border-image",
    "title": "Add Border Image",
    "description": "Add custom border size and color around an image.",
    "category": "image-layout",
    "tags": [
      "border",
      "image",
      "style"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "thumbnail-image",
    "title": "Thumbnail Image",
    "description": "Generate optimized thumbnail from source image.",
    "category": "image-layout",
    "tags": [
      "thumbnail",
      "image",
      "resize"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "image-collage",
    "title": "Image Collage",
    "description": "Create a collage using multiple uploaded images.",
    "category": "image-layout",
    "tags": [
      "collage",
      "image",
      "batch"
    ],
    "input_kind": "mixed",
    "accepts_multiple": true
  },
  {
    "slug": "word-count-text",
    "title": "Word Count",
    "description": "Generate text statistics including words, sentences, and characters.",
    "category": "text-ops",
    "tags": [
      "word count",
      "text",
      "stats"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "case-converter-text",
    "title": "Case Converter",
    "description": "Convert text to upper, lower, title, or sentence case.",
    "category": "text-ops",
    "tags": [
      "case",
      "text",
      "convert"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "extract-keywords-text",
    "title": "Extract Keywords",
    "description": "Extract top frequent keywords from text.",
    "category": "text-ops",
    "tags": [
      "keywords",
      "text",
      "analysis"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "slug-generator-text",
    "title": "Slug Generator",
    "description": "Generate URL-friendly slug from text.",
    "category": "text-ops",
    "tags": [
      "slug",
      "url",
      "text"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-pages-to-zip",
    "title": "PDF Pages to ZIP",
    "description": "Export PDF pages as images packed in ZIP.",
    "category": "archive-lab",
    "tags": [
      "pdf",
      "zip",
      "pages"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "zip-images-to-pdf",
    "title": "ZIP Images to PDF",
    "description": "Convert image files inside ZIP into a single PDF.",
    "category": "archive-lab",
    "tags": [
      "zip",
      "images",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-page-count",
    "title": "PDF Page Count",
    "description": "Generate page, word, and character statistics for a PDF.",
    "category": "pdf-insights",
    "tags": [
      "pdf",
      "count",
      "analytics"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "reverse-pdf",
    "title": "Reverse PDF",
    "description": "Reverse complete page order of a PDF document.",
    "category": "pdf-insights",
    "tags": [
      "pdf",
      "reverse",
      "pages"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "flatten-pdf",
    "title": "Flatten PDF",
    "description": "Flatten PDF form fields and annotations into the page content. Prevents editing of filled forms.",
    "category": "pdf-advanced",
    "tags": [
      "flatten",
      "form fields",
      "annotations",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-html",
    "title": "PDF to HTML",
    "description": "Export extracted PDF text into an HTML document.",
    "category": "pdf-insights",
    "tags": [
      "pdf",
      "html",
      "export"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-bmp",
    "title": "PDF to BMP",
    "description": "Render PDF pages as BMP images and package in ZIP.",
    "category": "pdf-insights",
    "tags": [
      "pdf",
      "bmp",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-gif",
    "title": "PDF to GIF",
    "description": "Render PDF pages as GIF images and package in ZIP.",
    "category": "pdf-insights",
    "tags": [
      "pdf",
      "gif",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "sharpen-image",
    "title": "Sharpen Image",
    "description": "Increase image sharpness by configurable factor.",
    "category": "image-enhance",
    "tags": [
      "image",
      "sharpen",
      "enhance"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "brighten-image",
    "title": "Brighten Image",
    "description": "Adjust image brightness by configurable factor.",
    "category": "image-enhance",
    "tags": [
      "image",
      "brightness",
      "enhance"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "contrast-image",
    "title": "Contrast Image",
    "description": "Adjust image contrast by configurable factor.",
    "category": "image-enhance",
    "tags": [
      "image",
      "contrast",
      "enhance"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "invert-image",
    "title": "Invert Image",
    "description": "Invert image colors with one click.",
    "category": "image-enhance",
    "tags": [
      "image",
      "invert",
      "effect"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "posterize-image",
    "title": "Posterize Image",
    "description": "Reduce color depth for stylized poster effect.",
    "category": "image-enhance",
    "tags": [
      "image",
      "posterize",
      "effect"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "image-histogram",
    "title": "Image Histogram",
    "description": "Extract RGB histogram summary and image stats.",
    "category": "image-enhance",
    "tags": [
      "image",
      "histogram",
      "analysis"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "remove-extra-spaces-text",
    "title": "Remove Extra Spaces",
    "description": "Normalize extra spaces and tabs in text.",
    "category": "text-cleanup",
    "tags": [
      "text",
      "cleanup",
      "spaces"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sort-lines-text",
    "title": "Sort Lines",
    "description": "Sort text lines in ascending or descending order.",
    "category": "text-cleanup",
    "tags": [
      "text",
      "sort",
      "lines"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "deduplicate-lines-text",
    "title": "Deduplicate Lines",
    "description": "Remove duplicate lines while preserving first occurrence order.",
    "category": "text-cleanup",
    "tags": [
      "text",
      "deduplicate",
      "lines"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "find-replace-text",
    "title": "Find and Replace",
    "description": "Find and replace text with optional case sensitivity.",
    "category": "text-cleanup",
    "tags": [
      "text",
      "find",
      "replace"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "split-text-file",
    "title": "Split Text File",
    "description": "Split large text into multiple files by lines and download ZIP.",
    "category": "text-cleanup",
    "tags": [
      "text",
      "split",
      "zip"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "reading-time-text",
    "title": "Reading Time Estimator",
    "description": "Estimate reading time from total words and target WPM.",
    "category": "text-cleanup",
    "tags": [
      "text",
      "reading",
      "time"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "images-to-zip",
    "title": "Images to ZIP",
    "description": "Pack uploaded images into a single ZIP archive.",
    "category": "batch-automation",
    "tags": [
      "images",
      "zip",
      "batch"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "batch-convert-images",
    "title": "Batch Convert Images",
    "description": "Convert multiple images into selected format and download ZIP.",
    "category": "batch-automation",
    "tags": [
      "images",
      "convert",
      "batch"
    ],
    "input_kind": "mixed",
    "accepts_multiple": true
  },
  {
    "slug": "merge-text-files",
    "title": "Merge Text Files",
    "description": "Merge multiple text files into a single output document.",
    "category": "batch-automation",
    "tags": [
      "text",
      "merge",
      "batch"
    ],
    "input_kind": "mixed",
    "accepts_multiple": true
  },
  {
    "slug": "json-prettify",
    "title": "JSON Prettify",
    "description": "Format minified JSON into readable pretty JSON.",
    "category": "batch-automation",
    "tags": [
      "json",
      "format",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-json",
    "title": "CSV to JSON",
    "description": "Convert CSV tabular data into JSON array format.",
    "category": "batch-automation",
    "tags": [
      "csv",
      "json",
      "convert"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-to-csv",
    "title": "JSON to CSV",
    "description": "Convert JSON object/list into CSV table output.",
    "category": "batch-automation",
    "tags": [
      "json",
      "csv",
      "convert"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-docx",
    "title": "PDF to DOCX",
    "description": "Convert PDF text content into editable DOCX format.",
    "category": "office-suite",
    "tags": [
      "pdf",
      "docx",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "docx-to-pdf",
    "title": "DOCX to PDF",
    "description": "Convert DOCX documents into PDF format.",
    "category": "office-suite",
    "tags": [
      "docx",
      "pdf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-excel",
    "title": "PDF to Excel",
    "description": "Export PDF text lines into XLSX spreadsheet format.",
    "category": "office-suite",
    "tags": [
      "pdf",
      "excel",
      "xlsx"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "excel-to-pdf",
    "title": "Excel to PDF",
    "description": "Convert XLSX spreadsheets into PDF documents.",
    "category": "office-suite",
    "tags": [
      "excel",
      "xlsx",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-pptx",
    "title": "PDF to PPTX",
    "description": "Convert PDF pages into editable PPTX slide content.",
    "category": "office-suite",
    "tags": [
      "pdf",
      "pptx",
      "slides"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pptx-to-pdf",
    "title": "PPTX to PDF",
    "description": "Convert PPTX slide text into PDF format.",
    "category": "office-suite",
    "tags": [
      "pptx",
      "pdf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "scan-to-pdf",
    "title": "Scan to PDF",
    "description": "Create PDF documents from scanned images or photos.",
    "category": "pdf-core",
    "tags": [
      "scan",
      "image",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "sign-pdf",
    "title": "Sign PDF",
    "description": "Add signature block text and timestamp to PDF pages.",
    "category": "pdf-security",
    "tags": [
      "sign",
      "signature",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "edit-metadata-pdf",
    "title": "Edit Metadata",
    "description": "Update title, author, subject, and keywords for PDF files.",
    "category": "pdf-advanced",
    "tags": [
      "metadata",
      "pdf",
      "edit"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-pdfa",
    "title": "PDF to PDF/A",
    "description": "Generate archival-friendly PDF export for long-term storage.",
    "category": "pdf-advanced",
    "tags": [
      "pdf",
      "pdfa",
      "archive"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "chat-with-pdf",
    "title": "Chat with PDF",
    "description": "Ask questions and get context answers from PDF text.",
    "category": "text-ai",
    "tags": [
      "chat",
      "pdf",
      "ai"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "upscale-image",
    "title": "Upscale Image",
    "description": "Upscale image dimensions while preserving visual quality.",
    "category": "image-enhance",
    "tags": [
      "upscale",
      "image",
      "enhance"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "create-workflow",
    "title": "Create Workflow",
    "description": "Build reusable workflow JSON from your favorite tool steps.",
    "category": "utility",
    "tags": [
      "workflow",
      "automation",
      "json"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "add-image-pdf",
    "title": "Add Image to PDF",
    "description": "Overlay an image logo or stamp onto PDF pages.",
    "category": "page-ops",
    "tags": [
      "image",
      "pdf",
      "overlay"
    ],
    "input_kind": "mixed",
    "accepts_multiple": true
  },
  {
    "slug": "ocr-image",
    "title": "OCR Image",
    "description": "Extract readable text from scanned or photographed images.",
    "category": "ocr-vision",
    "tags": [
      "ocr",
      "image",
      "text"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "ocr-pdf",
    "title": "OCR PDF",
    "description": "Extract text from scanned PDF pages and generate a searchable PDF output.",
    "category": "ocr-vision",
    "tags": [
      "ocr",
      "pdf",
      "scan"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "remove-background",
    "title": "Remove Background",
    "description": "Remove image backgrounds and export a transparent PNG cutout.",
    "category": "ocr-vision",
    "tags": [
      "background",
      "image",
      "ai"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "blur-face",
    "title": "Blur Face",
    "description": "Automatically blur face regions in photos for privacy protection. Adjustable blur strength.",
    "category": "image-effects",
    "tags": [
      "blur face",
      "privacy",
      "censor",
      "face blur",
      "anonymize"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pixelate-face",
    "title": "Pixelate Face",
    "description": "Pixelate face regions in photos for privacy. Perfect for social media and documentation.",
    "category": "image-effects",
    "tags": [
      "pixelate face",
      "face censor",
      "privacy",
      "mosaic face"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "blur-background",
    "title": "Blur Background",
    "description": "Keep the main subject readable while softly blurring the background.",
    "category": "ocr-vision",
    "tags": [
      "background",
      "blur",
      "portrait"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "add-text-image",
    "title": "Add Text to Image",
    "description": "Place headlines, labels, names, or captions directly onto images.",
    "category": "image-layout",
    "tags": [
      "text",
      "image",
      "caption"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "add-logo-image",
    "title": "Add Logo to Image",
    "description": "Upload the base image first and logo second to create branded image overlays.",
    "category": "image-layout",
    "tags": [
      "logo",
      "image",
      "overlay"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "join-images",
    "title": "Join Images",
    "description": "Combine multiple images into one horizontal or vertical layout.",
    "category": "image-layout",
    "tags": [
      "join",
      "merge",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "split-image",
    "title": "Split Image",
    "description": "Split a single image into a tile grid and download every part at once.",
    "category": "image-layout",
    "tags": [
      "split",
      "tiles",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "circle-crop-image",
    "title": "Circle Crop Image",
    "description": "Create a clean circular crop with transparent corners for profile-ready assets.",
    "category": "image-layout",
    "tags": [
      "circle",
      "crop",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "square-crop-image",
    "title": "Square Crop Image",
    "description": "Center-crop any image into a perfect square for social and profile use.",
    "category": "image-layout",
    "tags": [
      "square",
      "crop",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "image-color-picker",
    "title": "Image Color Picker",
    "description": "Extract the dominant colors from an image with palette preview and JSON export.",
    "category": "image-enhance",
    "tags": [
      "color",
      "palette",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "motion-blur-image",
    "title": "Motion Blur Image",
    "description": "Apply cinematic horizontal or vertical motion blur to photos and graphics.",
    "category": "image-enhance",
    "tags": [
      "motion",
      "blur",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-tiff",
    "title": "PDF to TIFF",
    "description": "Convert PDF pages into a TIFF document for scanning and archive workflows.",
    "category": "vector-lab",
    "tags": [
      "pdf",
      "tiff",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "tiff-to-pdf",
    "title": "TIFF to PDF",
    "description": "Convert TIFF images into PDF documents.",
    "category": "vector-lab",
    "tags": [
      "tiff",
      "pdf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "pdf-to-svg",
    "title": "PDF to SVG",
    "description": "Export each PDF page into SVG vector files.",
    "category": "vector-lab",
    "tags": [
      "pdf",
      "svg",
      "vector"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "svg-to-pdf",
    "title": "SVG to PDF",
    "description": "Convert one or more SVG assets into PDF output.",
    "category": "vector-lab",
    "tags": [
      "svg",
      "pdf",
      "vector"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "pdf-to-rtf",
    "title": "PDF to RTF",
    "description": "Convert PDF text content into rich text format.",
    "category": "ebook-convert",
    "tags": [
      "pdf",
      "rtf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "rtf-to-pdf",
    "title": "RTF to PDF",
    "description": "Convert RTF documents into PDF format.",
    "category": "ebook-convert",
    "tags": [
      "rtf",
      "pdf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-odt",
    "title": "PDF to ODT",
    "description": "Convert PDF text into OpenDocument Text format.",
    "category": "ebook-convert",
    "tags": [
      "pdf",
      "odt",
      "convert"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "odt-to-pdf",
    "title": "ODT to PDF",
    "description": "Convert OpenDocument Text files into PDF documents.",
    "category": "ebook-convert",
    "tags": [
      "odt",
      "pdf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-epub",
    "title": "PDF to EPUB",
    "description": "Convert PDF text into EPUB eBook format.",
    "category": "ebook-convert",
    "tags": [
      "pdf",
      "epub",
      "ebook"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "epub-to-pdf",
    "title": "EPUB to PDF",
    "description": "Convert EPUB eBooks into PDF output.",
    "category": "ebook-convert",
    "tags": [
      "epub",
      "pdf",
      "ebook"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "optimize-pdf",
    "title": "Optimize PDF",
    "description": "Reduce PDF size with stronger optimization defaults for lighter downloads.",
    "category": "pdf-core",
    "tags": [
      "pdf",
      "optimize",
      "compress"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "convert-to-pdf",
    "title": "Convert to PDF",
    "description": "Upload supported documents, images, or eBooks and convert them into PDF.",
    "category": "office-suite",
    "tags": [
      "convert",
      "pdf",
      "generic"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "convert-from-pdf",
    "title": "Convert from PDF",
    "description": "Export PDF files into the format you choose from one unified tool.",
    "category": "office-suite",
    "tags": [
      "convert",
      "pdf",
      "export"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-converter",
    "title": "PDF Converter",
    "description": "Smart converter that handles PDF export or PDF generation depending on the input file.",
    "category": "office-suite",
    "tags": [
      "pdf",
      "converter",
      "smart"
    ],
    "input_kind": "mixed",
    "accepts_multiple": true
  },
  {
    "slug": "pdf-security",
    "title": "PDF Security",
    "description": "Protect or unlock PDF files from one shared security workspace.",
    "category": "pdf-security",
    "tags": [
      "pdf",
      "security",
      "password"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "ai-summarizer",
    "title": "AI Summarizer",
    "description": "Generate concise summaries from PDFs or pasted text content.",
    "category": "text-ai",
    "tags": [
      "summary",
      "ai",
      "text"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-viewer",
    "title": "PDF Viewer",
    "description": "Inspect page count, metadata, and preview text from uploaded PDFs.",
    "category": "text-ai",
    "tags": [
      "pdf",
      "viewer",
      "preview"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-intelligence",
    "title": "PDF Intelligence",
    "description": "Generate summary, keyword, and content analytics for PDF documents.",
    "category": "text-ai",
    "tags": [
      "pdf",
      "intelligence",
      "analytics"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "edit-pdf",
    "title": "Edit PDF",
    "description": "Add text, watermark, highlight, annotations, or images from one editing page.",
    "category": "page-ops",
    "tags": [
      "edit",
      "pdf",
      "annotate"
    ],
    "input_kind": "mixed",
    "accepts_multiple": true
  },
  {
    "slug": "annotate-pdf",
    "title": "Annotate PDF",
    "description": "Place free-text annotations onto specific PDF pages.",
    "category": "page-ops",
    "tags": [
      "annotate",
      "pdf",
      "notes"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "highlight-pdf",
    "title": "Highlight PDF",
    "description": "Apply visible highlight blocks to important areas inside a PDF page.",
    "category": "page-ops",
    "tags": [
      "highlight",
      "pdf",
      "review"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-filler",
    "title": "PDF Filler",
    "description": "Fill PDF areas with typed text at the coordinates you choose.",
    "category": "page-ops",
    "tags": [
      "fill",
      "pdf",
      "form"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "remove-pages",
    "title": "Remove Pages",
    "description": "Delete selected pages from a PDF file using the page list you provide.",
    "category": "page-ops",
    "tags": [
      "remove",
      "pages",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "add-page-numbers",
    "title": "Add Page Numbers",
    "description": "Add page numbers from a dedicated quick-access tool page.",
    "category": "page-ops",
    "tags": [
      "page numbers",
      "pdf",
      "pages"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "header-and-footer",
    "title": "Header and Footer",
    "description": "Add custom header and footer text to every page of a PDF document.",
    "category": "page-ops",
    "tags": [
      "header",
      "footer",
      "pdf",
      "pages"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "add-watermark",
    "title": "Add Watermark",
    "description": "Apply text-based watermark overlays to PDF pages.",
    "category": "page-ops",
    "tags": [
      "watermark",
      "pdf",
      "branding"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-ocr",
    "title": "PDF OCR",
    "description": "Convert scanned PDF pages into searchable text-based PDF output.",
    "category": "ocr-vision",
    "tags": [
      "pdf",
      "ocr",
      "scan"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "image-to-text",
    "title": "Image to Text",
    "description": "Run OCR on images and extract their readable text.",
    "category": "ocr-vision",
    "tags": [
      "image",
      "ocr",
      "text"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "jpg-to-text",
    "title": "JPG to Text",
    "description": "Extract readable text from JPG and JPEG images.",
    "category": "ocr-vision",
    "tags": [
      "jpg",
      "ocr",
      "text"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "png-to-text",
    "title": "PNG to Text",
    "description": "Extract readable text from PNG images.",
    "category": "ocr-vision",
    "tags": [
      "png",
      "ocr",
      "text"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "check-image-dpi",
    "title": "Check Image DPI",
    "description": "Inspect the current DPI and dimensions stored in an image file.",
    "category": "image-enhance",
    "tags": [
      "dpi",
      "image",
      "analyze"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "convert-dpi",
    "title": "Convert DPI",
    "description": "Rewrite image DPI metadata for printing or document upload requirements.",
    "category": "image-enhance",
    "tags": [
      "dpi",
      "image",
      "convert"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-in-cm",
    "title": "Resize Image in CM",
    "description": "Resize images using centimeter dimensions and a selected DPI.",
    "category": "image-layout",
    "tags": [
      "resize",
      "cm",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-in-mm",
    "title": "Resize Image in MM",
    "description": "Resize images using millimeter dimensions and a selected DPI.",
    "category": "image-layout",
    "tags": [
      "resize",
      "mm",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-in-inch",
    "title": "Resize Image in Inches",
    "description": "Resize images using inch dimensions and a selected DPI.",
    "category": "image-layout",
    "tags": [
      "resize",
      "inch",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "add-name-dob-image",
    "title": "Add Name and DOB on Photo",
    "description": "Overlay a name and date of birth onto an uploaded photo.",
    "category": "image-layout",
    "tags": [
      "name",
      "dob",
      "photo"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "merge-photo-signature",
    "title": "Merge Photo and Signature",
    "description": "Combine a photo and signature into one clean export.",
    "category": "image-layout",
    "tags": [
      "photo",
      "signature",
      "merge"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "black-and-white-image",
    "title": "Black and White Image",
    "description": "Turn a color image into a high-contrast black and white result.",
    "category": "image-enhance",
    "tags": [
      "black",
      "white",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "censor-photo",
    "title": "Censor Photo",
    "description": "Censor face regions when detected, or pixelate the full photo as a fallback.",
    "category": "ocr-vision",
    "tags": [
      "censor",
      "privacy",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "picture-to-pixel-art",
    "title": "Picture to Pixel Art",
    "description": "Convert any photo into retro pixel art style with reduced color palette.",
    "category": "image-effects",
    "tags": [
      "pixel art",
      "retro",
      "8-bit",
      "pixelated",
      "art style"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "generate-signature",
    "title": "Generate Signature",
    "description": "Create a transparent signature image from typed text.",
    "category": "image-layout",
    "tags": [
      "signature",
      "text",
      "image"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "word-to-pdf",
    "title": "Word to PDF",
    "description": "Convert Word documents into PDF format.",
    "category": "office-suite",
    "tags": [
      "word",
      "docx",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-word",
    "title": "PDF to Word",
    "description": "Convert PDF content into editable Word documents.",
    "category": "office-suite",
    "tags": [
      "pdf",
      "word",
      "docx"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "powerpoint-to-pdf",
    "title": "PowerPoint to PDF",
    "description": "Convert PowerPoint slide decks into PDF output.",
    "category": "office-suite",
    "tags": [
      "powerpoint",
      "pptx",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-powerpoint",
    "title": "PDF to PowerPoint",
    "description": "Convert PDF pages into editable PowerPoint slide output.",
    "category": "office-suite",
    "tags": [
      "pdf",
      "powerpoint",
      "pptx"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "eml-to-pdf",
    "title": "EML to PDF",
    "description": "Convert email message files into PDF documents.",
    "category": "format-lab",
    "tags": [
      "eml",
      "email",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "fb2-to-pdf",
    "title": "FB2 to PDF",
    "description": "Convert FB2 eBook files into PDF output.",
    "category": "ebook-convert",
    "tags": [
      "fb2",
      "ebook",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "cbz-to-pdf",
    "title": "CBZ to PDF",
    "description": "Convert comic-book ZIP image archives into PDF documents.",
    "category": "ebook-convert",
    "tags": [
      "cbz",
      "comic",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "ebook-to-pdf",
    "title": "eBook to PDF",
    "description": "Convert supported eBook uploads like EPUB, FB2, and CBZ into PDF.",
    "category": "ebook-convert",
    "tags": [
      "ebook",
      "pdf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "heic-to-pdf",
    "title": "HEIC to PDF Converter (.heic → .pdf)",
    "description": "Convert iPhone HEIC photos straight to a PDF — perfect for sending receipts, IDs, and scans.",
    "category": "format-lab",
    "tags": [
      "heic to pdf",
      "convert heic to pdf",
      "heic pdf converter",
      ".heic to .pdf",
      "heic to pdf free",
      "heic",
      "pdf",
      "pdf from heic",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "heif-to-pdf",
    "title": "HEIF to PDF",
    "description": "Convert HEIF images into PDF documents.",
    "category": "format-lab",
    "tags": [
      "heif",
      "image",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "jfif-to-pdf",
    "title": "JFIF to PDF",
    "description": "Convert JFIF images into PDF documents.",
    "category": "format-lab",
    "tags": [
      "jfif",
      "image",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "zip-to-pdf",
    "title": "ZIP to PDF",
    "description": "Convert ZIP archives of ordered images into a single PDF.",
    "category": "archive-lab",
    "tags": [
      "zip",
      "images",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "cbr-to-pdf",
    "title": "CBR to PDF",
    "description": "Convert CBR comic book archives (RAR/ZIP) into a single PDF.",
    "category": "archive-lab",
    "tags": [
      "cbr",
      "comic",
      "pdf",
      "rar"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "djvu-to-pdf",
    "title": "DjVu to PDF",
    "description": "Convert DjVu documents into PDF format.",
    "category": "format-lab",
    "tags": [
      "djvu",
      "pdf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "ai-to-pdf",
    "title": "AI to PDF",
    "description": "Convert Adobe Illustrator AI files into PDF documents.",
    "category": "format-lab",
    "tags": [
      "ai",
      "illustrator",
      "pdf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-to-mobi",
    "title": "PDF to MOBI",
    "description": "Convert PDF documents into MOBI format for e-readers.",
    "category": "ebook-convert",
    "tags": [
      "pdf",
      "mobi",
      "ebook",
      "kindle"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mobi-to-pdf",
    "title": "MOBI to PDF",
    "description": "Convert MOBI e-books into PDF documents.",
    "category": "ebook-convert",
    "tags": [
      "mobi",
      "pdf",
      "ebook",
      "kindle"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "xps-to-pdf",
    "title": "XPS to PDF",
    "description": "Convert XPS documents into PDF format.",
    "category": "format-lab",
    "tags": [
      "xps",
      "pdf",
      "convert",
      "microsoft"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "wps-to-pdf",
    "title": "WPS to PDF",
    "description": "Convert WPS Office documents into PDF format.",
    "category": "office-suite",
    "tags": [
      "wps",
      "pdf",
      "office",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "dwg-to-pdf",
    "title": "DWG to PDF",
    "description": "Convert AutoCAD DWG drawings into PDF documents.",
    "category": "vector-lab",
    "tags": [
      "dwg",
      "autocad",
      "pdf",
      "cad"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pub-to-pdf",
    "title": "PUB to PDF",
    "description": "Convert Microsoft Publisher PUB files into PDF format.",
    "category": "document-convert",
    "tags": [
      "pub",
      "publisher",
      "pdf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "hwp-to-pdf",
    "title": "HWP to PDF",
    "description": "Convert Hangul HWP documents into PDF format.",
    "category": "format-lab",
    "tags": [
      "hwp",
      "hangul",
      "pdf",
      "korean"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "chm-to-pdf",
    "title": "CHM to PDF",
    "description": "Convert Windows CHM help files into PDF documents.",
    "category": "format-lab",
    "tags": [
      "chm",
      "help",
      "pdf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "dxf-to-pdf",
    "title": "DXF to PDF",
    "description": "Convert AutoCAD DXF drawings into PDF documents.",
    "category": "vector-lab",
    "tags": [
      "dxf",
      "autocad",
      "pdf",
      "cad",
      "vector"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pages-to-pdf",
    "title": "PAGES to PDF",
    "description": "Convert Apple Pages documents into PDF format.",
    "category": "format-lab",
    "tags": [
      "pages",
      "apple",
      "pdf",
      "mac"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "html-to-image",
    "title": "HTML to Image",
    "description": "Convert HTML content or web page URL into a JPG or PNG image.",
    "category": "image-core",
    "tags": [
      "html",
      "image",
      "convert",
      "screenshot"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "reduce-image-size-in-kb",
    "title": "Reduce Image Size in KB",
    "description": "Compress an image to your exact target file size in kilobytes.",
    "category": "image-core",
    "tags": [
      "compress",
      "image",
      "kb",
      "size"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-kb",
    "title": "Compress to Target KB",
    "description": "Compress image to a custom target size in KB with smart quality adjustment.",
    "category": "image-core",
    "tags": [
      "compress",
      "image",
      "kb",
      "target"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "passport-photo-maker",
    "title": "Passport Photo Maker",
    "description": "Resize your photo to official passport dimensions like 3.5x4.5cm, 2x2 inch.",
    "category": "image-layout",
    "tags": [
      "passport",
      "photo",
      "resize",
      "id"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "passport-size-photo",
    "title": "Passport Size Photo",
    "description": "Create passport-size photos in standard sizes for documents and ID cards.",
    "category": "image-layout",
    "tags": [
      "passport",
      "photo",
      "id",
      "size"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "social-media-resize",
    "title": "Social Media Resize",
    "description": "Resize images to the perfect dimensions for Instagram, YouTube, Facebook, Twitter, and more.",
    "category": "image-layout",
    "tags": [
      "social",
      "media",
      "resize",
      "instagram"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-for-instagram",
    "title": "Resize for Instagram",
    "description": "Resize your photo to Instagram-perfect 1080x1080px with smart crop.",
    "category": "image-layout",
    "tags": [
      "instagram",
      "resize",
      "social",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "resize-for-whatsapp",
    "title": "WhatsApp DP Maker",
    "description": "Resize your image to WhatsApp display picture size (192x192px).",
    "category": "image-layout",
    "tags": [
      "whatsapp",
      "dp",
      "resize",
      "profile"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "resize-for-youtube",
    "title": "YouTube Banner Resize",
    "description": "Resize your image to YouTube banner dimensions (2560x1440px).",
    "category": "image-layout",
    "tags": [
      "youtube",
      "banner",
      "resize",
      "channel"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "instagram-grid",
    "title": "Instagram Grid Maker",
    "description": "Split your image into a 3×3 grid for seamless Instagram profile layouts.",
    "category": "image-layout",
    "tags": [
      "instagram grid",
      "ig grid",
      "instagram layout",
      "social media",
      "3x3 grid"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "convert-to-jpg",
    "title": "Convert to JPG",
    "description": "Convert PNG, GIF, TIFF, WEBP, HEIC, or any image format to JPG.",
    "category": "image-core",
    "tags": [
      "convert",
      "jpg",
      "jpeg",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "convert-from-jpg",
    "title": "Convert from JPG",
    "description": "Convert JPG images to PNG, WEBP, GIF, or BMP formats.",
    "category": "image-core",
    "tags": [
      "convert",
      "png",
      "webp",
      "jpg"
    ],
    "input_kind": "mixed",
    "accepts_multiple": true
  },
  {
    "slug": "heic-to-jpg",
    "title": "HEIC to JPG Converter (.heic → .jpg)",
    "description": "Convert iPhone HEIC photos to JPG (the universal photo format). Smaller files, opens everywhere.",
    "category": "format-lab",
    "tags": [
      "heic to jpg",
      "convert heic to jpg",
      "heic jpg converter",
      ".heic to .jpg",
      "heic to jpg free",
      "heic",
      "jpg",
      "jpg from heic",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "webp-to-jpg",
    "title": "WebP to JPG Converter (.webp → .jpg)",
    "description": "Convert WebP (modern web format ~30% smaller than JPG/PNG) to JPG (lossy photo format with small file sizes). Free, no signup, batch supported.",
    "category": "format-lab",
    "tags": [
      "webp to jpg",
      "convert webp to jpg",
      "webp jpg converter",
      ".webp to .jpg",
      "webp to jpg free",
      "webp",
      "jpg",
      "jpg from webp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "photo-editor",
    "title": "Photo Editor",
    "description": "Apply enhance, brighten, vintage, grayscale, or sharpen effects to your photo.",
    "category": "image-effects",
    "tags": [
      "photo",
      "editor",
      "effects",
      "enhance"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "unblur-image",
    "title": "Unblur Image",
    "description": "Sharpen and unblur images with AI-powered clarity enhancement.",
    "category": "image-enhance",
    "tags": [
      "unblur",
      "sharpen",
      "image",
      "enhance"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "increase-image-quality",
    "title": "Increase Image Quality",
    "description": "Enhance image sharpness, contrast and color to increase perceived quality.",
    "category": "image-enhance",
    "tags": [
      "quality",
      "enhance",
      "image",
      "sharpen"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "beautify-image",
    "title": "Beautify Image",
    "description": "Auto-enhance your photo with balanced color, contrast and sharpness improvements.",
    "category": "image-enhance",
    "tags": [
      "beautify",
      "enhance",
      "image",
      "auto"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "retouch-image",
    "title": "Retouch Image",
    "description": "Smooth blemishes and imperfections with intelligent image retouching.",
    "category": "image-enhance",
    "tags": [
      "retouch",
      "blemish",
      "image",
      "smooth"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "super-resolution",
    "title": "Super Resolution",
    "description": "Upscale image resolution 2x or 4x with high-quality interpolation.",
    "category": "image-enhance",
    "tags": [
      "super",
      "resolution",
      "upscale",
      "4k"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "zoom-out-image",
    "title": "Zoom Out Image",
    "description": "Add a border around your image to create a zoom-out perspective effect.",
    "category": "image-layout",
    "tags": [
      "zoom",
      "border",
      "image",
      "canvas"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "add-white-border-image",
    "title": "Add White Border to Image",
    "description": "Add a clean white border around your photo for a professional look.",
    "category": "image-layout",
    "tags": [
      "border",
      "white",
      "image",
      "frame"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "freehand-crop",
    "title": "Freehand Crop",
    "description": "Crop any rectangular area from an image with custom x1,y1 to x2,y2 coordinates.",
    "category": "image-core",
    "tags": [
      "crop",
      "freehand",
      "custom",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "crop-png",
    "title": "Crop PNG",
    "description": "Crop PNG images with custom crop coordinates.",
    "category": "image-core",
    "tags": [
      "crop",
      "png",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "a4-size-resize",
    "title": "Resize to A4 Size",
    "description": "Resize any image to A4 size (21x29.7cm) at 300 DPI for printing.",
    "category": "image-layout",
    "tags": [
      "a4",
      "resize",
      "print",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "check-dpi",
    "title": "Check Image DPI",
    "description": "Check the DPI and resolution info stored in any image file.",
    "category": "image-enhance",
    "tags": [
      "dpi",
      "check",
      "resolution",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "color-code-from-image",
    "title": "Color Picker from Image",
    "description": "Extract the dominant color palette and hex codes from any image.",
    "category": "image-enhance",
    "tags": [
      "color",
      "picker",
      "palette",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "view-metadata",
    "title": "View Image Metadata",
    "description": "View EXIF and technical metadata stored inside an image file.",
    "category": "utility",
    "tags": [
      "metadata",
      "exif",
      "image",
      "view"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "remove-image-metadata",
    "title": "Remove Image Metadata",
    "description": "Remove EXIF and metadata blocks from image files for privacy-safe sharing.",
    "category": "utility",
    "tags": [
      "metadata",
      "exif",
      "remove",
      "privacy"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "edit-metadata",
    "title": "Edit Metadata",
    "description": "Edit metadata for PDF or image files from one unified metadata editor.",
    "category": "utility",
    "tags": [
      "metadata",
      "edit",
      "pdf",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "image-splitter",
    "title": "Image Splitter",
    "description": "Split any image into a grid of tiles. Perfect for puzzle creation and multi-post layouts.",
    "category": "image-layout",
    "tags": [
      "split image",
      "grid",
      "tiles",
      "puzzle",
      "image grid"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "jpeg-to-png",
    "title": "JPEG to PNG Converter (.jpeg → .png)",
    "description": "Convert JPEG to lossless PNG instantly. Preserves full color, no recompression artifacts. Free, batch supported.",
    "category": "format-lab",
    "tags": [
      "jpeg to png",
      "convert jpeg to png",
      "jpeg png converter",
      ".jpeg to .png",
      "jpeg to png free",
      "jpeg",
      "png",
      "png from jpeg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "png-to-jpeg",
    "title": "PNG to JPEG Converter (.png → .jpeg)",
    "description": "Convert PNG to JPEG with quality control. Removes alpha by flattening over white. Free, batch supported.",
    "category": "format-lab",
    "tags": [
      "png to jpeg",
      "convert png to jpeg",
      "png jpeg converter",
      ".png to .jpeg",
      "png to jpeg free",
      "png",
      "jpeg",
      "jpeg from png",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "compress-to-5kb",
    "title": "Compress Image to 5KB",
    "description": "Compress any image to 5KB online free. Perfect for Aadhaar, PAN, SSC, UPSC, exam portals. No signup.",
    "category": "image-core",
    "tags": [
      "compress image to 5kb",
      "image to 5kb",
      "photo to 5kb",
      "5kb compressor",
      "aadhaar photo 5kb",
      "ssc photo 5kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-10kb",
    "title": "Compress Image to 10KB",
    "description": "Compress any image to 10KB free. Required by SSC, RRB, IBPS, bank exam portals. No signup.",
    "category": "image-core",
    "tags": [
      "compress image to 10kb",
      "jpeg to 10kb",
      "image 10kb",
      "ssc photo 10kb",
      "government exam photo 10kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-20kb",
    "title": "Compress Image to 20KB",
    "description": "Compress any image to 20KB free. Used for SSC, UPSC, RRB, bank exam photo requirements. No signup.",
    "category": "image-core",
    "tags": [
      "compress image to 20kb",
      "jpeg to 20kb",
      "image 20kb",
      "ssc photo 20kb",
      "upsc photo 20kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-50kb",
    "title": "Compress Image to 50KB",
    "description": "Compress any image to 50KB free. Widely required by government portals, university forms, job applications.",
    "category": "image-core",
    "tags": [
      "compress image to 50kb",
      "jpeg to 50kb",
      "image 50kb",
      "photo 50kb",
      "government form 50kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-100kb",
    "title": "Compress Image to 100KB",
    "description": "Compress any image to 100KB online free. No signup, no watermark. JPG, PNG, WEBP supported.",
    "category": "image-core",
    "tags": [
      "compress image to 100kb",
      "jpeg to 100kb",
      "image 100kb",
      "photo to 100kb",
      "100kb compressor"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-200kb",
    "title": "Compress Image to 200KB",
    "description": "Compress any image to 200KB free. Common for scholarship, college, and official photo submissions.",
    "category": "image-core",
    "tags": [
      "compress image to 200kb",
      "jpeg to 200kb",
      "image 200kb",
      "photo to 200kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-500kb",
    "title": "Compress Image to 500KB",
    "description": "Compress any image to 500KB free. Great for email attachments, WhatsApp, and document submissions.",
    "category": "image-core",
    "tags": [
      "compress image to 500kb",
      "jpeg to 500kb",
      "image 500kb",
      "photo 500kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-1mb",
    "title": "Compress Image to 1MB",
    "description": "Compress any image to 1MB free. Reduces large photos for email, WhatsApp, and social media uploads.",
    "category": "image-core",
    "tags": [
      "compress image to 1mb",
      "jpeg to 1mb",
      "image to 1mb",
      "reduce image 1mb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-15kb",
    "title": "Compress to 15KB",
    "description": "Compress image to under 15KB for strict upload forms.",
    "category": "image-core",
    "tags": [
      "compress",
      "15kb",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-25kb",
    "title": "Compress to 25KB",
    "description": "Compress image to under 25KB with adaptive quality tuning.",
    "category": "image-core",
    "tags": [
      "compress",
      "25kb",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-30kb",
    "title": "Compress Image to 30KB",
    "description": "Compress any image to 30KB free. Ideal for IBPS, SBI PO, and banking exam photo size requirements.",
    "category": "image-core",
    "tags": [
      "compress image to 30kb",
      "jpeg to 30kb",
      "image 30kb",
      "ibps photo 30kb",
      "sbi po photo"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-40kb",
    "title": "Compress to 40KB",
    "description": "Compress image to under 40KB while preserving readability.",
    "category": "image-core",
    "tags": [
      "compress",
      "40kb",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-150kb",
    "title": "Compress Image to 150KB",
    "description": "Compress any image to 150KB free. Ideal for passport, visa, and university admission photo requirements.",
    "category": "image-core",
    "tags": [
      "compress image to 150kb",
      "jpeg to 150kb",
      "image 150kb",
      "passport photo 150kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-300kb",
    "title": "Compress Image to 300KB",
    "description": "Compress any image to 300KB free. Supports all formats. No signup, no watermark, instant download.",
    "category": "image-core",
    "tags": [
      "compress image to 300kb",
      "jpeg to 300kb",
      "image 300kb",
      "photo 300kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-to-2mb",
    "title": "Compress Image to 2MB",
    "description": "Compress any image to 2MB free. For high-resolution document uploads and applications requiring 2MB photos.",
    "category": "image-core",
    "tags": [
      "compress image to 2mb",
      "jpeg to 2mb",
      "image to 2mb",
      "reduce image 2mb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "increase-image-size-in-kb",
    "title": "Increase Image Size in KB",
    "description": "Increase image file size to a target KB value by adjusting quality and dimensions.",
    "category": "image-core",
    "tags": [
      "increase",
      "size",
      "kb",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "reduce-image-size-in-mb",
    "title": "Reduce Image Size in MB",
    "description": "Reduce image size to a target value in MB.",
    "category": "image-core",
    "tags": [
      "reduce",
      "size",
      "mb",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "convert-image-from-mb-to-kb",
    "title": "Convert Image from MB to KB",
    "description": "Compress oversized images from MB ranges into KB ranges.",
    "category": "image-core",
    "tags": [
      "convert",
      "mb",
      "kb",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "convert-image-size-kb-to-mb",
    "title": "Convert Image Size KB to MB",
    "description": "Increase image size from KB ranges to MB ranges.",
    "category": "image-core",
    "tags": [
      "convert",
      "kb",
      "mb",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "jpg-to-kb",
    "title": "JPG to KB",
    "description": "Compress JPG to a custom target size in KB.",
    "category": "image-core",
    "tags": [
      "jpg",
      "kb",
      "compress"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "jpeg-to-jpg",
    "title": "JPEG to JPG Converter (.jpeg → .jpg)",
    "description": "Convert JPEG (lossy photo format (same as JPG)) to JPG (lossy photo format with small file sizes). Free, no signup, batch supported.",
    "category": "format-lab",
    "tags": [
      "jpeg to jpg",
      "convert jpeg to jpg",
      "jpeg jpg converter",
      ".jpeg to .jpg",
      "jpeg to jpg free",
      "jpeg",
      "jpg",
      "jpg from jpeg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "remove-image-object",
    "title": "Remove Object from Photo",
    "description": "Remove selected objects from images using inpainting.",
    "category": "image-effects",
    "tags": [
      "remove",
      "object",
      "inpaint",
      "photo"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "unblur-face",
    "title": "Unblur Face",
    "description": "Enhance and sharpen detected faces in an image.",
    "category": "image-enhance",
    "tags": [
      "unblur",
      "face",
      "enhance",
      "sharp"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-pixel",
    "title": "Resize Image by Pixel",
    "description": "Resize image precisely by target width and height in pixels.",
    "category": "image-layout",
    "tags": [
      "resize",
      "pixel",
      "dimension",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-signature",
    "title": "Resize Signature",
    "description": "Resize signature image to exact dimensions for forms.",
    "category": "image-layout",
    "tags": [
      "signature",
      "resize",
      "forms"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-to-3.5cmx4.5cm",
    "title": "Resize Image to 3.5cm x 4.5cm",
    "description": "Resize photo to 3.5cm x 4.5cm at printable DPI.",
    "category": "image-layout",
    "tags": [
      "resize",
      "passport",
      "3.5x4.5"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-to-6cmx2cm",
    "title": "Resize Image to 6cm x 2cm",
    "description": "Resize image to 6cm x 2cm dimensions at target DPI.",
    "category": "image-layout",
    "tags": [
      "resize",
      "6x2",
      "signature"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-signature-to-50mmx20mm",
    "title": "Resize Signature to 50mm x 20mm",
    "description": "Resize signature image to 50mm x 20mm.",
    "category": "image-layout",
    "tags": [
      "signature",
      "50mm",
      "20mm",
      "resize"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-to-35mmx45mm",
    "title": "Resize Image to 35mm x 45mm",
    "description": "Resize image to 35mm x 45mm passport dimensions.",
    "category": "image-layout",
    "tags": [
      "resize",
      "35x45",
      "passport"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-to-2x2",
    "title": "Resize Image to 2 x 2 Inch",
    "description": "Resize image to 2 x 2 inch dimensions for ID forms.",
    "category": "image-layout",
    "tags": [
      "resize",
      "2x2",
      "passport"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-to-3x4",
    "title": "Resize Image to 3 x 4 Inch",
    "description": "Resize image to 3 x 4 inch dimensions.",
    "category": "image-layout",
    "tags": [
      "resize",
      "3x4",
      "photo"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-to-4x6",
    "title": "Resize Image to 4 x 6 Inch",
    "description": "Resize image to 4 x 6 inch print dimensions.",
    "category": "image-layout",
    "tags": [
      "resize",
      "4x6",
      "print"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-to-600x600-pixel",
    "title": "Resize Image to 600x600 Pixel",
    "description": "Resize image to exactly 600 x 600 pixels.",
    "category": "image-layout",
    "tags": [
      "resize",
      "600x600",
      "pixel"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-for-whatsapp-dp",
    "title": "Resize Image for WhatsApp DP",
    "description": "Resize image to WhatsApp profile photo format.",
    "category": "image-layout",
    "tags": [
      "whatsapp",
      "dp",
      "resize"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-for-youtube-banner",
    "title": "Resize Image for YouTube Banner",
    "description": "Resize image to YouTube banner dimensions.",
    "category": "image-layout",
    "tags": [
      "youtube",
      "banner",
      "resize"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-to-a4-size",
    "title": "Resize Image to A4 Size",
    "description": "Resize image to A4 dimensions for printing.",
    "category": "image-layout",
    "tags": [
      "a4",
      "print",
      "resize"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "jpg-to-pdf-under-50kb",
    "title": "JPG to PDF (Under 50KB)",
    "description": "Convert JPG to PDF while targeting an output under 50KB.",
    "category": "format-lab",
    "tags": [
      "jpg",
      "pdf",
      "50kb",
      "compress"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "jpg-to-pdf-under-100kb",
    "title": "JPG to PDF (Under 100KB)",
    "description": "Convert JPG to PDF while targeting an output under 100KB.",
    "category": "format-lab",
    "tags": [
      "jpg",
      "pdf",
      "100kb",
      "compress"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "jpeg-to-pdf-under-200kb",
    "title": "JPEG to PDF (Under 200KB)",
    "description": "Convert JPEG to PDF while targeting an output under 200KB.",
    "category": "format-lab",
    "tags": [
      "jpeg",
      "pdf",
      "200kb",
      "compress"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "jpg-to-pdf-under-300kb",
    "title": "JPG to PDF (Under 300KB)",
    "description": "Convert JPG to PDF while targeting an output under 300KB.",
    "category": "format-lab",
    "tags": [
      "jpg",
      "pdf",
      "300kb",
      "compress"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "jpg-to-pdf-under-500kb",
    "title": "JPG to PDF (Under 500KB)",
    "description": "Convert JPG to PDF while targeting an output under 500KB.",
    "category": "format-lab",
    "tags": [
      "jpg",
      "pdf",
      "500kb",
      "compress"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "jpeg-to-pdf",
    "title": "JPEG to PDF Converter (.jpeg → .pdf)",
    "description": "Convert JPEG (lossy photo format (same as JPG)) to PDF (Portable Document Format). Free, no signup, batch supported.",
    "category": "format-lab",
    "tags": [
      "jpeg to pdf",
      "convert jpeg to pdf",
      "jpeg pdf converter",
      ".jpeg to .pdf",
      "jpeg to pdf free",
      "jpeg",
      "pdf",
      "pdf from jpeg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "pdf-to-ppt",
    "title": "PDF to PPT",
    "description": "Convert PDF pages into editable PowerPoint slides.",
    "category": "office-suite",
    "tags": [
      "pdf",
      "ppt",
      "powerpoint",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "ppt-to-pdf",
    "title": "PPT to PDF",
    "description": "Convert PPT and PPTX presentation files into PDF documents.",
    "category": "office-suite",
    "tags": [
      "ppt",
      "pptx",
      "pdf",
      "convert"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "edit-pdf-text",
    "title": "Edit PDF Text",
    "description": "Overlay custom text on PDF pages with position and style controls.",
    "category": "pdf-advanced",
    "tags": [
      "edit",
      "text",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "add-text",
    "title": "Add Text",
    "description": "Add custom text annotations directly to PDF documents.",
    "category": "pdf-advanced",
    "tags": [
      "add",
      "text",
      "pdf"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "add-image-to-pdf",
    "title": "Add Image to PDF",
    "description": "Insert an image layer on top of PDF pages.",
    "category": "pdf-advanced",
    "tags": [
      "add",
      "image",
      "pdf"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "bulk-image-resizer",
    "title": "Bulk Image Resizer",
    "description": "Resize multiple images in one run and download the batch as a ZIP.",
    "category": "image-layout",
    "tags": [
      "bulk",
      "resize",
      "batch",
      "image"
    ],
    "input_kind": "mixed",
    "accepts_multiple": true
  },
  {
    "slug": "ssc-photo-resizer",
    "title": "SSC Photo Resizer",
    "description": "Resize photos to SSC-compatible dimensions and DPI.",
    "category": "image-layout",
    "tags": [
      "ssc",
      "photo",
      "resize",
      "id"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-for-pan-card",
    "title": "PAN Card Photo Resize",
    "description": "Resize photo to PAN card style dimensions.",
    "category": "image-layout",
    "tags": [
      "pan",
      "card",
      "photo",
      "resize"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "resize-image-for-upsc",
    "title": "UPSC Photo Resize",
    "description": "Resize photo to UPSC form dimensions and DPI.",
    "category": "image-layout",
    "tags": [
      "upsc",
      "photo",
      "resize",
      "form"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "psc-photo-resize",
    "title": "PSC Photo Resize",
    "description": "Resize photo to PSC form dimensions and DPI.",
    "category": "image-layout",
    "tags": [
      "psc",
      "photo",
      "resize",
      "form"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "photo-blemish-remover",
    "title": "Photo Blemish Remover",
    "description": "Apply smoothing and retouching to reduce facial blemishes.",
    "category": "image-enhance",
    "tags": [
      "blemish",
      "retouch",
      "skin",
      "photo"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image-to-5kb",
    "title": "Compress Image to 5KB",
    "description": "Compress image to a 5KB target while preserving readability.",
    "category": "image-core",
    "tags": [
      "compress",
      "5kb",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-jpeg-to-10kb",
    "title": "Compress JPEG to 10KB",
    "description": "Compress JPEG images to around 10KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "jpeg",
      "10kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image-to-15kb",
    "title": "Compress Image to 15KB",
    "description": "Compress image to a 15KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "15kb",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image-to-20kb",
    "title": "Compress Image to 20KB",
    "description": "Compress image to a 20KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "20kb",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-jpeg-between-20kb-to-50kb",
    "title": "Compress JPEG Between 20KB to 50KB",
    "description": "Compress JPEG output into a target range between 20KB and 50KB.",
    "category": "image-core",
    "tags": [
      "compress",
      "jpeg",
      "20kb",
      "50kb",
      "range"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "compress-jpeg-to-25kb",
    "title": "Compress JPEG to 25KB",
    "description": "Compress JPEG images to around 25KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "jpeg",
      "25kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-jpeg-to-30kb",
    "title": "Compress JPEG to 30KB",
    "description": "Compress JPEG images to around 30KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "jpeg",
      "30kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-jpeg-to-40kb",
    "title": "Compress JPEG to 40KB",
    "description": "Compress JPEG images to around 40KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "jpeg",
      "40kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image-to-50kb",
    "title": "Compress Image to 50KB",
    "description": "Compress image to a 50KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "50kb",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image-to-100kb",
    "title": "Compress Image to 100KB",
    "description": "Compress image to a 100KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "100kb",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-jpeg-to-150kb",
    "title": "Compress JPEG to 150KB",
    "description": "Compress JPEG images to around 150KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "jpeg",
      "150kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image-to-200kb",
    "title": "Compress Image to 200KB",
    "description": "Compress image to a 200KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "200kb",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-jpeg-to-300kb",
    "title": "Compress JPEG to 300KB",
    "description": "Compress JPEG images to around 300KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "jpeg",
      "300kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-jpeg-to-500kb",
    "title": "Compress JPEG to 500KB",
    "description": "Compress JPEG images to around 500KB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "jpeg",
      "500kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image-to-1mb",
    "title": "Compress Image to 1MB",
    "description": "Compress image to around 1MB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "1mb",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image-to-2mb",
    "title": "Compress Image to 2MB",
    "description": "Compress image to around 2MB target size.",
    "category": "image-core",
    "tags": [
      "compress",
      "2mb",
      "image"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "json-formatter",
    "title": "JSON Formatter & Validator — Format, Minify & Validate JSON",
    "description": "Format, minify, validate, and sort-keys of any JSON. Instantly see if your JSON is valid with detailed error messages. Free online JSON formatter.",
    "category": "developer-tools",
    "tags": [
      "JSON formatter",
      "JSON validator",
      "JSON minifier",
      "pretty print JSON",
      "JSON beautifier",
      "online JSON formatter",
      "validate JSON online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "xml-formatter",
    "title": "XML Formatter & Validator — Format and Prettify XML",
    "description": "Format, beautify, and validate XML documents online. Convert minified XML to readable indented format. Free XML formatter and validator.",
    "category": "developer-tools",
    "tags": [
      "xml formatter",
      "xml beautifier",
      "format xml online",
      "xml validator",
      "xml prettifier",
      "pretty print xml",
      "xml indent online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "base64-encode",
    "title": "Base64 Encoder",
    "description": "Encode text to Base64 format.",
    "category": "developer-tools",
    "tags": [
      "base64",
      "encode",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "base64-decode",
    "title": "Base64 Decoder",
    "description": "Decode Base64 encoded text back to original.",
    "category": "developer-tools",
    "tags": [
      "base64",
      "decode",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "url-encode",
    "title": "URL Encode",
    "description": "Percent-encode text for safe use in URLs.",
    "category": "developer-tools",
    "tags": [
      "url",
      "encode",
      "percent"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "url-decode",
    "title": "URL Decode",
    "description": "Decode percent-encoded URL strings.",
    "category": "developer-tools",
    "tags": [
      "url",
      "decode",
      "percent"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "html-encode",
    "title": "HTML Encode",
    "description": "Escape special characters to HTML entities.",
    "category": "developer-tools",
    "tags": [
      "html",
      "encode",
      "escape"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "html-decode",
    "title": "HTML Decode",
    "description": "Unescape HTML entities back to characters.",
    "category": "developer-tools",
    "tags": [
      "html",
      "decode",
      "unescape"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "jwt-decode",
    "title": "JWT Decode",
    "description": "Decode and inspect JWT token payload and header.",
    "category": "developer-tools",
    "tags": [
      "jwt",
      "decode",
      "token"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "regex-tester",
    "title": "Regex Tester — Test Regular Expressions Online",
    "description": "Test and debug regular expressions online. See all matches highlighted, groups captured, and match count. Supports all flags: i, m, s, x.",
    "category": "developer-tools",
    "tags": [
      "regex tester",
      "regular expression tester",
      "test regex online",
      "regex debugger",
      "regex validator",
      "regex pattern tester",
      "javascript regex tester"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "unix-timestamp",
    "title": "Unix Timestamp Converter",
    "description": "Convert between Unix timestamps and human dates.",
    "category": "developer-tools",
    "tags": [
      "unix",
      "timestamp",
      "date"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-to-yaml",
    "title": "JSON to YAML",
    "description": "Convert JSON to YAML format.",
    "category": "developer-tools",
    "tags": [
      "json",
      "yaml",
      "convert",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "yaml-to-json",
    "title": "YAML to JSON",
    "description": "Convert YAML to JSON format.",
    "category": "developer-tools",
    "tags": [
      "yaml",
      "json",
      "convert",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hex-to-rgb",
    "title": "HEX to RGB Converter",
    "description": "Convert HEX color codes to RGB values.",
    "category": "color-tools",
    "tags": [
      "hex",
      "rgb",
      "convert",
      "color"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "rgb-to-hex",
    "title": "RGB to HEX Converter",
    "description": "Convert RGB color values to HEX code.",
    "category": "color-tools",
    "tags": [
      "rgb",
      "hex",
      "convert",
      "color"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "rgb-to-hsl",
    "title": "RGB to HSL Converter",
    "description": "Convert RGB color values to HSL format.",
    "category": "color-tools",
    "tags": [
      "rgb",
      "hsl",
      "convert",
      "color"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "color-palette-generator",
    "title": "Color Palette Generator — Analogous, Complementary, Triadic",
    "description": "Generate beautiful color palettes from any hex color. Supports analogous, complementary, triadic, split-complementary, and monochromatic schemes with CSS variables.",
    "category": "developer-tools",
    "tags": [
      "color palette generator",
      "color scheme generator",
      "analogous colors",
      "complementary colors",
      "css color palette",
      "hex color palette"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gradient-generator",
    "title": "CSS Gradient Generator",
    "description": "Generate CSS gradient code from two or more colors.",
    "category": "color-tools",
    "tags": [
      "gradient",
      "css",
      "generate",
      "color"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "color-contrast-checker",
    "title": "Color Contrast Checker — WCAG Accessibility Checker",
    "description": "Check color contrast ratio between foreground and background colors for WCAG AA and AAA compliance. Essential for accessibility testing.",
    "category": "color-tools",
    "tags": [
      "color contrast checker",
      "wcag contrast checker",
      "accessibility color checker",
      "contrast ratio calculator",
      "wcag aa aaa checker",
      "color accessibility tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "length-converter",
    "title": "Length Converter",
    "description": "Convert between meters, feet, inches, centimeters, kilometers, miles, and more.",
    "category": "conversion-tools",
    "tags": [
      "length",
      "distance",
      "convert",
      "meter",
      "feet"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "weight-converter",
    "title": "Weight Converter",
    "description": "Convert between kg, lbs, grams, ounces, tons, and more.",
    "category": "conversion-tools",
    "tags": [
      "weight",
      "mass",
      "convert",
      "kg",
      "lbs"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "temperature-converter",
    "title": "Temperature Converter",
    "description": "Convert between Celsius, Fahrenheit, and Kelvin.",
    "category": "conversion-tools",
    "tags": [
      "temperature",
      "celsius",
      "fahrenheit",
      "kelvin",
      "convert"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "data-size-converter",
    "title": "Data Size Converter",
    "description": "Convert between bytes, KB, MB, GB, TB.",
    "category": "unit-converter",
    "tags": [
      "data",
      "size",
      "convert"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "speed-converter",
    "title": "Speed Converter",
    "description": "Convert between km/h, mph, m/s, knots, and more.",
    "category": "conversion-tools",
    "tags": [
      "speed",
      "velocity",
      "convert",
      "kmh",
      "mph"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "area-converter",
    "title": "Area Converter",
    "description": "Convert between sq meters, sq feet, acres, hectares, and more.",
    "category": "conversion-tools",
    "tags": [
      "area",
      "convert",
      "sqft",
      "sqm",
      "acres"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "md5-hash",
    "title": "MD5 Hash Generator",
    "description": "Generate MD5 hash from text input.",
    "category": "hash-crypto",
    "tags": [
      "md5",
      "hash",
      "checksum"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sha256-hash",
    "title": "SHA-256 Hash Generator",
    "description": "Generate SHA-256 hash from text input.",
    "category": "hash-crypto",
    "tags": [
      "sha256",
      "hash",
      "checksum"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sha512-hash",
    "title": "SHA-512 Hash Generator",
    "description": "Generate SHA-512 hash from text input.",
    "category": "hash-crypto",
    "tags": [
      "sha512",
      "hash",
      "checksum"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "uuid-generator",
    "title": "UUID Generator — Generate v1 and v4 UUIDs Free",
    "description": "Generate unique UUIDs (Universally Unique Identifiers) version 1 and version 4 in bulk. Free online UUID generator.",
    "category": "developer-tools",
    "tags": [
      "UUID generator",
      "GUID generator",
      "generate UUID v4",
      "random UUID online",
      "UUID v1 v4",
      "unique identifier generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "password-generator",
    "title": "Password Generator",
    "description": "Generate strong random passwords with customizable length and character types.",
    "category": "security-tools",
    "tags": [
      "password",
      "generate",
      "security",
      "random"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "lorem-ipsum-generator",
    "title": "Lorem Ipsum Generator — Generate Placeholder Text",
    "description": "Generate Lorem Ipsum placeholder text in words, sentences, or paragraphs. Essential tool for web designers and developers for UI mockups.",
    "category": "developer-tools",
    "tags": [
      "lorem ipsum generator",
      "placeholder text generator",
      "dummy text generator",
      "lorem ipsum online",
      "generate lorem ipsum",
      "filler text generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bcrypt-hash",
    "title": "Bcrypt Hash Generator",
    "description": "Generate bcrypt password hash.",
    "category": "hash-crypto",
    "tags": [
      "bcrypt",
      "hash",
      "password"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "meta-tag-generator",
    "title": "Meta Tag Generator",
    "description": "Generate HTML meta tags for SEO optimization.",
    "category": "seo-tools",
    "tags": [
      "meta",
      "seo",
      "html"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "keyword-density",
    "title": "Keyword Density Analyzer",
    "description": "Analyze keyword frequency and density in text.",
    "category": "seo-tools",
    "tags": [
      "keyword",
      "density",
      "seo"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "readability-score",
    "title": "Readability Score",
    "description": "Calculate Flesch-Kincaid readability score for text.",
    "category": "seo-tools",
    "tags": [
      "readability",
      "score",
      "flesch"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "character-counter",
    "title": "Character Counter",
    "description": "Count characters, words, sentences with detailed breakdown.",
    "category": "seo-tools",
    "tags": [
      "character",
      "count",
      "text"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "open-graph-generator",
    "title": "Open Graph Generator",
    "description": "Generate Open Graph meta tags for social media sharing.",
    "category": "seo-tools",
    "tags": [
      "opengraph",
      "social",
      "meta"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "minify-css",
    "title": "Minify CSS",
    "description": "Minify CSS by removing whitespace and comments.",
    "category": "code-tools",
    "tags": [
      "css",
      "minify",
      "compress"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "minify-js",
    "title": "Minify JavaScript",
    "description": "Minify JavaScript by removing whitespace and comments.",
    "category": "code-tools",
    "tags": [
      "javascript",
      "minify",
      "compress"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "minify-html",
    "title": "Minify HTML",
    "description": "Minify HTML by removing unnecessary whitespace.",
    "category": "code-tools",
    "tags": [
      "html",
      "minify",
      "compress"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "prettify-css",
    "title": "Prettify CSS",
    "description": "Format and indent CSS code for readability.",
    "category": "code-tools",
    "tags": [
      "css",
      "prettify",
      "format"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sql-formatter",
    "title": "SQL Formatter — Format & Beautify SQL Queries Online",
    "description": "Format, beautify, and indent SQL queries online free. Supports SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, JOIN, and all standard SQL keywords.",
    "category": "developer-generators",
    "tags": [
      "sql formatter",
      "sql beautifier",
      "format sql",
      "sql query formatter",
      "sql indenter",
      "sql tool online",
      "sql pretty print",
      "sql developer tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "markdown-to-html",
    "title": "Markdown to HTML",
    "description": "Convert Markdown text to HTML.",
    "category": "developer-tools",
    "tags": [
      "markdown",
      "html",
      "convert",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "html-to-markdown",
    "title": "HTML to Markdown",
    "description": "Convert HTML to Markdown format.",
    "category": "developer-tools",
    "tags": [
      "html",
      "markdown",
      "convert",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "diff-checker",
    "title": "Diff Checker",
    "description": "Compare two texts side-by-side and highlight differences.",
    "category": "developer-tools",
    "tags": [
      "diff",
      "compare",
      "text",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "percentage-calculator",
    "title": "Percentage Calculator",
    "description": "Calculate percentage, percentage change, and percentage of a number.",
    "category": "math-tools",
    "tags": [
      "percentage",
      "math",
      "calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "average-calculator",
    "title": "Average Calculator",
    "description": "Calculate mean, median, mode, and standard deviation of numbers.",
    "category": "math-tools",
    "tags": [
      "average",
      "mean",
      "statistics"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bmi-calculator",
    "title": "BMI Calculator",
    "description": "Calculate Body Mass Index from weight and height.",
    "category": "math-tools",
    "tags": [
      "bmi",
      "health",
      "calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "age-calculator",
    "title": "Age Calculator",
    "description": "Calculate exact age from date of birth in years, months, and days.",
    "category": "math-tools",
    "tags": [
      "age",
      "birthday",
      "calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "discount-calculator",
    "title": "Discount Calculator",
    "description": "Calculate sale price after discount, savings amount, tax, and final payable amount for shopping and invoices.",
    "category": "finance-tools",
    "tags": [
      "discount calculator",
      "sale price calculator",
      "percentage discount calculator",
      "shopping discount calculator",
      "price after discount",
      "gst discount calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "loan-emi-calculator",
    "title": "Loan EMI Calculator — Monthly EMI with Amortization",
    "description": "Calculate loan EMI (Equated Monthly Installment) for home loans, personal loans, car loans. Get monthly EMI, total interest, and 6-month amortization schedule.",
    "category": "finance-tools",
    "tags": [
      "EMI calculator",
      "loan EMI calculator India",
      "home loan EMI calculator",
      "personal loan EMI",
      "car loan EMI calculator",
      "EMI formula",
      "loan calculator with amortization"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "tip-calculator",
    "title": "Tip Calculator — Restaurant Bill Tip Splitter",
    "description": "Calculate tip amount, total bill, and per-person share. Enter bill amount, tip percentage, and number of people for instant restaurant tip calculation.",
    "category": "math-tools",
    "tags": [
      "tip calculator",
      "restaurant tip calculator",
      "bill tip calculator",
      "how much tip",
      "tip percentage calculator",
      "gratuity calculator",
      "split tip",
      "dining tip"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gpa-calculator",
    "title": "GPA Calculator",
    "description": "Calculate GPA from grades and credit hours.",
    "category": "math-tools",
    "tags": [
      "gpa",
      "grade",
      "student"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "number-base-converter",
    "title": "Number Base Converter",
    "description": "Convert numbers between decimal, binary, octal, and hexadecimal.",
    "category": "student-tools",
    "tags": [
      "binary",
      "hex",
      "converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-reverse",
    "title": "Reverse Text",
    "description": "Reverse any text string character by character.",
    "category": "student-tools",
    "tags": [
      "reverse",
      "text",
      "string"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-to-binary",
    "title": "Text to Binary Converter (UTF-8 characters → base 2)",
    "description": "Convert text to binary (base 2, UTF-8) instantly. Example: 'A' = 01000001. Free, no signup, accepts common prefixes.",
    "category": "student-tools",
    "tags": [
      "text to binary",
      "convert text to binary",
      "text binary converter",
      "text to binary converter (utf-8 characters → base 2)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "binary-to-text",
    "title": "Binary to Text Converter (base 2 → UTF-8 characters)",
    "description": "Convert binary (base 2) to text instantly. Free, no signup, accepts common prefixes.",
    "category": "student-tools",
    "tags": [
      "binary to text",
      "convert binary to text",
      "binary text converter",
      "binary to text converter (base 2 → utf-8 characters)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "morse-code",
    "title": "Morse Code Converter",
    "description": "Encode text to Morse code or decode Morse code to text.",
    "category": "student-tools",
    "tags": [
      "morse",
      "code",
      "encode"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "random-number-generator",
    "title": "Random Number Generator",
    "description": "Generate one or more random numbers between any min and max range. Perfect for games, lotteries, and decisions.",
    "category": "student-tools",
    "tags": [
      "random number generator",
      "random number",
      "number randomizer",
      "lucky number",
      "random picker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-to-ascii",
    "title": "Text to ASCII Converter",
    "description": "Convert text to ascii instantly. Example: 'A' = 65. Free, no signup, accepts common prefixes.",
    "category": "student-tools",
    "tags": [
      "text to ascii",
      "convert text to ascii",
      "text ascii converter",
      "text to ascii converter",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ascii-to-text",
    "title": "ASCII to Text Converter",
    "description": "Convert ascii to text instantly. Example: 65 = 'A'. Free, no signup, accepts common prefixes.",
    "category": "student-tools",
    "tags": [
      "ascii to text",
      "convert ascii to text",
      "ascii text converter",
      "ascii to text converter",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "word-frequency",
    "title": "Word Frequency Analyzer",
    "description": "Analyze word frequency distribution in any text.",
    "category": "student-tools",
    "tags": [
      "word",
      "frequency",
      "analysis"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "roman-numeral-converter",
    "title": "Roman Numeral Converter — Arabic ↔ Roman Numerals",
    "description": "Convert between Arabic numbers and Roman numerals both ways. Supports I to MMMCMXCIX (1–3999). Free online Roman numeral calculator.",
    "category": "utility",
    "tags": [
      "roman numeral converter",
      "arabic to roman numerals",
      "roman to arabic",
      "roman numeral calculator",
      "convert roman numerals online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "countdown-calculator",
    "title": "Countdown Calculator",
    "description": "Calculate time remaining until a target date.",
    "category": "student-tools",
    "tags": [
      "countdown",
      "date",
      "timer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "compound-interest-calculator",
    "title": "Compound Interest Calculator — Investment Growth & Returns",
    "description": "Calculate compound interest with monthly contributions, different compounding frequencies, yearly breakdown, and total ROI. Investment and savings planning.",
    "category": "finance-tools",
    "tags": [
      "compound interest calculator",
      "investment calculator",
      "compound interest formula",
      "interest calculator online",
      "savings calculator",
      "roi calculator",
      "wealth calculator",
      "investment growth"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "simple-interest-calculator",
    "title": "Simple Interest Calculator",
    "description": "Calculate simple interest from principal, rate, and time.",
    "category": "math-tools",
    "tags": [
      "simple",
      "interest",
      "finance"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "salary-calculator",
    "title": "Salary Calculator",
    "description": "Break down annual salary into monthly, weekly, daily, and hourly rates.",
    "category": "math-tools",
    "tags": [
      "salary",
      "income",
      "calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "fuel-cost-calculator",
    "title": "Fuel Cost Calculator — Trip Fuel Cost & Mileage",
    "description": "Calculate fuel cost for any trip based on distance, vehicle mileage, and fuel price. Get fuel needed (liters) and total cost in INR.",
    "category": "finance-tools",
    "tags": [
      "fuel cost calculator",
      "petrol cost calculator",
      "trip fuel cost",
      "mileage calculator",
      "fuel calculator India",
      "how much fuel for my trip"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "electricity-bill-calculator",
    "title": "Electricity Bill Calculator — Units to Bill Amount",
    "description": "Calculate your electricity bill from units consumed. Enter units used, rate per unit, fixed charges, and GST to get exact bill amount.",
    "category": "finance-tools",
    "tags": [
      "electricity bill calculator",
      "electricity unit calculator",
      "power bill calculator",
      "electricity cost calculator India",
      "bijli bill calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "speed-distance-time",
    "title": "Speed Distance Time Calculator",
    "description": "Calculate speed, distance, or time given two of the three values.",
    "category": "math-tools",
    "tags": [
      "speed",
      "distance",
      "time"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "profit-loss-calculator",
    "title": "Profit & Loss Calculator",
    "description": "Calculate profit or loss percentage from cost and selling price.",
    "category": "math-tools",
    "tags": [
      "profit",
      "loss",
      "business"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cgpa-to-percentage",
    "title": "CGPA ↔ Percentage Converter",
    "description": "Convert CGPA to percentage and percentage to CGPA (CBSE standard).",
    "category": "math-tools",
    "tags": [
      "cgpa",
      "percentage",
      "student"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "scientific-calculator",
    "title": "Scientific Calculator",
    "description": "Evaluate mathematical expressions with sin, cos, sqrt, log, and more.",
    "category": "math-tools",
    "tags": [
      "scientific",
      "math",
      "expression"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "unit-price-calculator",
    "title": "Unit Price Calculator — Compare Value Per Unit",
    "description": "Compare unit prices of two products to find the better deal. Calculate cost per gram, ml, piece, or litre to determine best value for money.",
    "category": "finance-tools",
    "tags": [
      "unit price calculator",
      "price per unit",
      "compare product price",
      "best value calculator",
      "price comparison",
      "value for money calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "number-to-words",
    "title": "Number to Words Converter — English Words & Indian Format",
    "description": "Convert any number to English words with Indian format (lakhs, crores). Also shows ordinal form (1st, 2nd), scientific notation, and proper comma formatting.",
    "category": "math-tools",
    "tags": [
      "number to words",
      "number words converter",
      "number to english",
      "number in words",
      "integer to words",
      "number converter",
      "word form of number",
      "crore lakh converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "date-difference",
    "title": "Date Difference Calculator",
    "description": "Calculate exact difference between two dates in years, months, and days.",
    "category": "student-tools",
    "tags": [
      "date",
      "difference",
      "calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "time-zone-converter",
    "title": "Time Zone Converter",
    "description": "Convert time between different time zones worldwide.",
    "category": "conversion-tools",
    "tags": [
      "time",
      "timezone",
      "convert",
      "world"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "password-strength-checker",
    "title": "Password Strength Checker — How Secure is Your Password?",
    "description": "Check how strong your password is with detailed analysis: length, character types, entropy estimation, and specific improvement suggestions.",
    "category": "security-tools",
    "tags": [
      "password strength checker",
      "how strong is my password",
      "password security checker",
      "password analyzer",
      "check password strength online",
      "password entropy calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-to-hex",
    "title": "Text to Hex Converter (UTF-8 characters → base 16)",
    "description": "Convert text to hex (base 16, UTF-8) instantly. Example: 'A' = 41. Free, no signup, accepts common prefixes.",
    "category": "student-tools",
    "tags": [
      "text to hex",
      "convert text to hex",
      "text hex converter",
      "text to hex converter (utf-8 characters → base 16)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hex-to-text",
    "title": "Hex to Text Converter (base 16 → UTF-8 characters)",
    "description": "Convert hex (base 16) to text instantly. Free, no signup, accepts common prefixes.",
    "category": "student-tools",
    "tags": [
      "hex to text",
      "convert hex to text",
      "hex text converter",
      "hex to text converter (base 16 → utf-8 characters)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-to-unicode",
    "title": "Text to Unicode",
    "description": "Convert text to Unicode escape sequences.",
    "category": "student-tools",
    "tags": [
      "unicode",
      "text",
      "convert"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "unicode-to-text",
    "title": "Unicode to Text",
    "description": "Convert Unicode escape sequences to readable text.",
    "category": "student-tools",
    "tags": [
      "unicode",
      "text",
      "decode"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "string-hash-generator",
    "title": "Multi-Hash Generator",
    "description": "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously.",
    "category": "student-tools",
    "tags": [
      "hash",
      "md5",
      "sha256"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-statistics",
    "title": "Text Statistics",
    "description": "Complete text analysis with word count, reading time, and more.",
    "category": "student-tools",
    "tags": [
      "text",
      "statistics",
      "analysis"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "case-converter-advanced",
    "title": "Advanced Case Converter",
    "description": "Convert text to camelCase, PascalCase, snake_case, kebab-case, and more.",
    "category": "student-tools",
    "tags": [
      "case",
      "convert",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "coin-flip",
    "title": "Coin Flip",
    "description": "Flip a coin one or multiple times with heads/tails statistics.",
    "category": "student-tools",
    "tags": [
      "coin",
      "flip",
      "random"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "dice-roller",
    "title": "Dice Roller",
    "description": "Roll dice with custom sides and count.",
    "category": "student-tools",
    "tags": [
      "dice",
      "roll",
      "random"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "stopwatch-calculator",
    "title": "Time Converter",
    "description": "Convert between hours, minutes, and seconds formats.",
    "category": "student-tools",
    "tags": [
      "time",
      "stopwatch",
      "convert"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-minifier",
    "title": "JSON Minifier",
    "description": "Minify JSON by removing whitespace for smaller file size.",
    "category": "developer-tools",
    "tags": [
      "json",
      "minify",
      "compress",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "url-encoder",
    "title": "URL Encoder",
    "description": "Encode text into URL-safe format using percent-encoding.",
    "category": "developer-tools",
    "tags": [
      "url",
      "encode",
      "percent",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "url-decoder",
    "title": "URL Decoder",
    "description": "Decode URL-encoded strings back to readable text.",
    "category": "developer-tools",
    "tags": [
      "url",
      "decode",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "html-encoder",
    "title": "HTML Encoder",
    "description": "Encode special characters to HTML entities.",
    "category": "developer-tools",
    "tags": [
      "html",
      "encode",
      "entities",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "html-decoder",
    "title": "HTML Decoder",
    "description": "Decode HTML entities back to readable characters.",
    "category": "developer-tools",
    "tags": [
      "html",
      "decode",
      "entities",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hash-generator",
    "title": "Hash Generator",
    "description": "Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text.",
    "category": "developer-tools",
    "tags": [
      "hash",
      "md5",
      "sha256",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "jwt-decoder",
    "title": "JWT Decoder — Decode and Inspect JWT Tokens",
    "description": "Decode JSON Web Tokens (JWT) and inspect header, payload, and expiration. Check JWT algorithm, claims, and token status. Free online JWT inspector.",
    "category": "developer-tools",
    "tags": [
      "jwt decoder",
      "decode jwt",
      "jwt inspector",
      "jwt parser",
      "json web token decoder",
      "jwt token viewer",
      "jwt claims"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "unix-timestamp-converter",
    "title": "Unix Timestamp Converter",
    "description": "Convert between Unix timestamps and human-readable dates.",
    "category": "developer-tools",
    "tags": [
      "unix",
      "timestamp",
      "date",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "css-minifier",
    "title": "CSS Minifier",
    "description": "Minify CSS code by removing whitespace and comments.",
    "category": "developer-tools",
    "tags": [
      "css",
      "minify",
      "compress",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "js-minifier",
    "title": "JavaScript Minifier",
    "description": "Minify JavaScript code for smaller file size.",
    "category": "developer-tools",
    "tags": [
      "javascript",
      "js",
      "minify",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "html-minifier",
    "title": "HTML Minifier",
    "description": "Minify HTML code by removing unnecessary whitespace.",
    "category": "developer-tools",
    "tags": [
      "html",
      "minify",
      "compress",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-to-csv-text",
    "title": "JSON to CSV",
    "description": "Convert JSON array to CSV format.",
    "category": "developer-tools",
    "tags": [
      "json",
      "csv",
      "convert",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-json-text",
    "title": "CSV to JSON",
    "description": "Convert CSV data to JSON array format.",
    "category": "developer-tools",
    "tags": [
      "csv",
      "json",
      "convert",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cron-expression-parser",
    "title": "Cron Expression Parser — Decode Cron Schedules to Human Readable",
    "description": "Parse cron expressions into plain English. Understand what any cron schedule does: minute, hour, day, month, weekday fields explained.",
    "category": "developer-tools",
    "tags": [
      "cron expression parser",
      "cron decoder",
      "cron to english",
      "cron schedule parser",
      "understand cron",
      "cron expression explainer",
      "cron syntax"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-escape-unescape",
    "title": "Text Escape/Unescape",
    "description": "Escape or unescape special characters in text (backslash, quotes, etc.).",
    "category": "developer-tools",
    "tags": [
      "escape",
      "unescape",
      "text",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ip-lookup",
    "title": "IP Address Lookup",
    "description": "Get your current public IP address information.",
    "category": "developer-tools",
    "tags": [
      "ip",
      "address",
      "lookup",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "char-code-converter",
    "title": "Character Code Converter",
    "description": "Convert between characters and their ASCII/Unicode code points.",
    "category": "developer-tools",
    "tags": [
      "ascii",
      "unicode",
      "character",
      "developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "color-picker",
    "title": "Color Picker",
    "description": "Pick colors and get HEX, RGB, and HSL values.",
    "category": "color-tools",
    "tags": [
      "color",
      "picker",
      "hex",
      "rgb"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "md5-generator",
    "title": "MD5 Hash Generator",
    "description": "Generate MD5 hash from any text input.",
    "category": "security-tools",
    "tags": [
      "md5",
      "hash",
      "security"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sha256-generator",
    "title": "SHA-256 Hash Generator",
    "description": "Generate SHA-256 hash from text input.",
    "category": "security-tools",
    "tags": [
      "sha256",
      "hash",
      "security"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bcrypt-generator",
    "title": "BCrypt Hash Generator",
    "description": "Generate BCrypt hash from a password.",
    "category": "security-tools",
    "tags": [
      "bcrypt",
      "hash",
      "password",
      "security"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "data-storage-converter",
    "title": "Data Storage Converter",
    "description": "Convert between bytes, KB, MB, GB, TB, and PB.",
    "category": "conversion-tools",
    "tags": [
      "data",
      "storage",
      "convert",
      "bytes",
      "gb"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "volume-converter",
    "title": "Volume Converter",
    "description": "Convert between liters, gallons, cups, ml, and more.",
    "category": "conversion-tools",
    "tags": [
      "volume",
      "convert",
      "liters",
      "gallons"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "energy-converter",
    "title": "Energy Converter",
    "description": "Convert between joules, calories, kWh, BTU, and more.",
    "category": "conversion-tools",
    "tags": [
      "energy",
      "convert",
      "joules",
      "calories"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pressure-converter",
    "title": "Pressure Converter",
    "description": "Convert between Pascal, Bar, PSI, atm, and mmHg.",
    "category": "conversion-tools",
    "tags": [
      "pressure",
      "convert",
      "pascal",
      "bar",
      "psi"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "instagram-post-resizer",
    "title": "Instagram Post Resizer",
    "description": "Resize images to perfect Instagram post dimensions (1080x1080, 1080x1350, 1080x566).",
    "category": "social-media",
    "tags": [
      "instagram",
      "resize",
      "post",
      "social"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-thumbnail-maker",
    "title": "YouTube Thumbnail Maker",
    "description": "Create and resize images to YouTube thumbnail size (1280x720).",
    "category": "social-media",
    "tags": [
      "youtube",
      "thumbnail",
      "resize",
      "social"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "twitter-header-maker",
    "title": "Twitter Header Maker",
    "description": "Resize images to Twitter/X header dimensions (1500x500).",
    "category": "social-media",
    "tags": [
      "twitter",
      "header",
      "resize",
      "social"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "facebook-cover-maker",
    "title": "Facebook Cover Maker",
    "description": "Resize images to Facebook cover photo dimensions (820x312).",
    "category": "social-media",
    "tags": [
      "facebook",
      "cover",
      "resize",
      "social"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "linkedin-banner-maker",
    "title": "LinkedIn Banner Maker",
    "description": "Resize images to LinkedIn banner dimensions (1584x396).",
    "category": "social-media",
    "tags": [
      "linkedin",
      "banner",
      "resize",
      "social"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "whatsapp-dp-maker",
    "title": "WhatsApp DP Maker",
    "description": "Resize and crop images for WhatsApp profile picture (500x500).",
    "category": "social-media",
    "tags": [
      "whatsapp",
      "dp",
      "profile",
      "social"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "citation-generator",
    "title": "Citation Generator — APA, MLA & Chicago Free Online",
    "description": "Generate accurate citations in APA, MLA, or Chicago style for websites, journal articles, and books — free online citation maker for students.",
    "category": "student-tools",
    "tags": [
      "citation generator",
      "APA citation generator",
      "MLA citation generator",
      "Chicago citation format",
      "free citation maker",
      "bibliography generator",
      "reference generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "flashcard-generator",
    "title": "Flashcard Generator — Make Study Cards from Text",
    "description": "Automatically generate Q&A flashcards from any text. Perfect for studying, exam preparation, and memorization. Paste your notes and get flashcards instantly.",
    "category": "writing-tools",
    "tags": [
      "flashcard generator",
      "study flashcards",
      "make flashcards",
      "flashcard maker",
      "study cards",
      "exam flashcards",
      "anki alternative",
      "learning cards"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "study-planner",
    "title": "Study Planner",
    "description": "Create a practical day-by-day study schedule from subjects, exam date, and available hours.",
    "category": "student-tools",
    "tags": [
      "study planner",
      "timetable",
      "exam",
      "schedule",
      "student"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "grade-calculator",
    "title": "Grade Calculator",
    "description": "Calculate your grade, percentage, and GPA equivalent from marks. Supports Indian grading system.",
    "category": "student-tools",
    "tags": [
      "grade calculator",
      "gpa",
      "percentage",
      "marks to grade",
      "student"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "attendance-calculator",
    "title": "Attendance Calculator — Can I Skip Class? Minimum Attendance",
    "description": "Check if you can afford to miss more lectures based on your current attendance percentage. Calculate how many more classes you can skip while maintaining the required attendance.",
    "category": "student-tools",
    "tags": [
      "attendance calculator",
      "can I bunk class",
      "minimum attendance calculator",
      "75 percent attendance calculator",
      "how many classes can I miss",
      "attendance percentage calculator college"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "reading-time-calculator",
    "title": "Reading Time Calculator",
    "description": "Estimate reading time, speaking time, word count, and content length from any text.",
    "category": "text-ops",
    "tags": [
      "reading time",
      "word count",
      "speaking time",
      "text",
      "student"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "plagiarism-risk-checker",
    "title": "Plagiarism Risk Checker",
    "description": "Check text for repetition, low uniqueness, and citation risk signals before submitting work.",
    "category": "student-tools",
    "tags": [
      "plagiarism",
      "uniqueness",
      "assignment",
      "student",
      "writing"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "resume-bullet-generator",
    "title": "Resume Bullet Point Generator — Action Verb Career Bullets",
    "description": "Generate powerful resume bullet points using strong action verbs and the STAR format. Enter your task, result, and metrics for professional bullet points.",
    "category": "writing-tools",
    "tags": [
      "resume bullet generator",
      "resume bullet points",
      "action verbs resume",
      "resume writing",
      "cv bullet points",
      "resume helper",
      "job application tool",
      "career tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "png-to-webp",
    "title": "PNG to WebP Converter (.png → .webp)",
    "description": "Convert PNG to WebP — typically 25-35% smaller with the same visual quality. Great for faster page loads.",
    "category": "format-lab",
    "tags": [
      "png to webp",
      "convert png to webp",
      "png webp converter",
      ".png to .webp",
      "png to webp free",
      "png",
      "webp",
      "webp from png",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "jpg-to-webp",
    "title": "JPG to WebP Converter (.jpg → .webp)",
    "description": "Convert JPG (lossy photo format with small file sizes) to WebP (modern web format ~30% smaller than JPG/PNG). Free, no signup, batch supported.",
    "category": "format-lab",
    "tags": [
      "jpg to webp",
      "convert jpg to webp",
      "jpg webp converter",
      ".jpg to .webp",
      "jpg to webp free",
      "jpg",
      "webp",
      "webp from jpg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "gif-to-jpg",
    "title": "GIF to JPG Converter (.gif → .jpg)",
    "description": "Extract the first frame of a GIF as a JPG photo.",
    "category": "format-lab",
    "tags": [
      "gif to jpg",
      "convert gif to jpg",
      "gif jpg converter",
      ".gif to .jpg",
      "gif to jpg free",
      "gif",
      "jpg",
      "jpg from gif",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "tiff-to-jpg",
    "title": "TIFF to JPG Converter (.tiff → .jpg)",
    "description": "Convert TIFF/TIF scans to JPG — much smaller files, easy to email.",
    "category": "format-lab",
    "tags": [
      "tiff to jpg",
      "convert tiff to jpg",
      "tiff jpg converter",
      ".tiff to .jpg",
      "tiff to jpg free",
      "tiff",
      "jpg",
      "jpg from tiff",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "bmp-to-jpg",
    "title": "BMP to JPG Converter (.bmp → .jpg)",
    "description": "Convert BMP (uncompressed legacy Windows bitmap) to JPG (lossy photo format with small file sizes). Free, no signup, batch supported.",
    "category": "format-lab",
    "tags": [
      "bmp to jpg",
      "convert bmp to jpg",
      "bmp jpg converter",
      ".bmp to .jpg",
      "bmp to jpg free",
      "bmp",
      "jpg",
      "jpg from bmp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "svg-to-png",
    "title": "SVG to PNG Converter (.svg → .png)",
    "description": "Rasterize vector SVG into a transparent PNG at the resolution you need.",
    "category": "format-lab",
    "tags": [
      "svg to png",
      "convert svg to png",
      "svg png converter",
      ".svg to .png",
      "svg to png free",
      "svg",
      "png",
      "png from svg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "image-to-jpg",
    "title": "Image to JPG Converter (any image → .jpg)",
    "description": "Convert Image (any raster image (PNG/JPG/WebP)) to JPG (lossy photo format with small file sizes). Free, no signup, batch supported.",
    "category": "image-core",
    "tags": [
      "image to jpg",
      "convert image to jpg",
      "image jpg converter",
      "image to .jpg",
      "image to jpg free",
      "image",
      "jpg",
      "jpg from image",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "circle-crop",
    "title": "Circle Crop Image",
    "description": "Crop images into a perfect circle shape online for free. Great for profile pictures and avatars.",
    "category": "image-core",
    "tags": [
      "circle crop",
      "crop circle",
      "round image",
      "profile picture",
      "avatar crop"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "add-text-to-image",
    "title": "Add Text to Image",
    "description": "Overlay text on any image with custom font size, color, and position. Shadow effect included.",
    "category": "image-effects",
    "tags": [
      "text overlay",
      "add text",
      "caption",
      "watermark text",
      "label"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image-to-kb",
    "title": "Compress Image to KB",
    "description": "Compress images to a specific target file size in KB online for free. Perfect for forms and uploads.",
    "category": "image-core",
    "tags": [
      "compress image to kb",
      "image size reducer",
      "reduce image kb",
      "compress photo kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "reduce-image-size-kb",
    "title": "Reduce Image Size in KB",
    "description": "Reduce image file size to a specific KB target. Ideal for government form photo requirements.",
    "category": "image-core",
    "tags": [
      "reduce image size kb",
      "compress photo to kb",
      "image kb reducer",
      "photo size kb"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "increase-image-size-kb",
    "title": "Increase Image Size in KB",
    "description": "Increase image file size to meet minimum KB requirements. Upscales and adjusts quality.",
    "category": "image-core",
    "tags": [
      "increase image size kb",
      "enlarge image kb",
      "boost image size",
      "image kb increaser"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "dpi-checker",
    "title": "Image DPI Checker",
    "description": "Check the DPI (dots per inch) resolution of any image online for free. See width, height, and print quality.",
    "category": "image-enhance",
    "tags": [
      "dpi checker",
      "check image dpi",
      "image resolution",
      "dots per inch",
      "print quality"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "change-dpi",
    "title": "Change Image DPI",
    "description": "Change the DPI of any image online free. Set custom DPI for print-ready outputs (300 DPI, 600 DPI).",
    "category": "image-enhance",
    "tags": [
      "change dpi",
      "set image dpi",
      "dpi changer",
      "300 dpi",
      "print resolution"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "photo-collage",
    "title": "Photo Collage Maker",
    "description": "Create beautiful photo collages online free. Upload multiple images and arrange in a grid layout.",
    "category": "image-layout",
    "tags": [
      "photo collage",
      "collage maker",
      "image collage",
      "grid collage",
      "photo grid"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "view-image-metadata",
    "title": "View Image Metadata",
    "description": "View EXIF metadata, DPI, dimensions, and file info of any image online for free.",
    "category": "image-enhance",
    "tags": [
      "image metadata",
      "exif viewer",
      "image info",
      "photo metadata",
      "exif data"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "epoch-converter",
    "title": "Epoch Time Converter",
    "description": "Convert Unix epoch timestamps to human-readable dates and vice versa. Supports milliseconds.",
    "category": "developer-tools",
    "tags": [
      "epoch converter",
      "unix timestamp",
      "epoch to date",
      "timestamp converter",
      "unix time"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "fancy-text-generator",
    "title": "Fancy Text Generator",
    "description": "Generate fancy Unicode text styles — bold, italic, bubble, strikethrough, upside-down, and more.",
    "category": "text-ops",
    "tags": [
      "fancy text",
      "unicode text",
      "stylish text",
      "bold text",
      "cool text generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-path-finder",
    "title": "JSONPath Finder",
    "description": "Query JSON data using JSONPath expressions. Extract nested values easily.",
    "category": "developer-tools",
    "tags": [
      "jsonpath",
      "json query",
      "json path",
      "json finder",
      "json extract"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "line-counter",
    "title": "Line Counter",
    "description": "Count lines, words, characters, and blank lines in any text online for free.",
    "category": "text-ops",
    "tags": [
      "line counter",
      "count lines",
      "line count",
      "text counter",
      "word counter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "morse-to-text",
    "title": "Morse Code to Text",
    "description": "Decode Morse code to readable text online for free. Supports dots and dashes.",
    "category": "text-ops",
    "tags": [
      "morse code decoder",
      "morse to text",
      "decode morse",
      "morse translator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-to-morse",
    "title": "Text to Morse Code Converter",
    "description": "Convert text to Morse code and Morse code back to text. Supports all letters, numbers, and punctuation. Free Morse code translator.",
    "category": "text-ops",
    "tags": [
      "text to morse code",
      "morse code converter",
      "morse code translator",
      "morse code decoder",
      "morse code encoder",
      "text morse code"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "nato-alphabet",
    "title": "NATO Phonetic Alphabet",
    "description": "Convert text to NATO phonetic alphabet. Alpha, Bravo, Charlie — perfect for radio communication.",
    "category": "text-ops",
    "tags": [
      "nato alphabet",
      "phonetic alphabet",
      "nato phonetic",
      "radio alphabet",
      "military alphabet"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "number-to-roman",
    "title": "Number to Roman Numerals",
    "description": "Convert Arabic numbers to Roman numerals online for free. Supports 1–3999.",
    "category": "text-ops",
    "tags": [
      "number to roman",
      "roman numerals",
      "arabic to roman",
      "roman numeral converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "roman-to-number",
    "title": "Roman Numerals to Number",
    "description": "Convert Roman numerals to Arabic numbers online for free. Fast and accurate.",
    "category": "text-ops",
    "tags": [
      "roman to number",
      "roman numeral decoder",
      "roman numeral converter",
      "convert roman"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "octal-to-text",
    "title": "Octal to Text Converter (base 8 → UTF-8 characters)",
    "description": "Convert octal (base 8) to text instantly. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "octal to text",
      "convert octal to text",
      "octal text converter",
      "octal to text converter (base 8 → utf-8 characters)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-to-octal",
    "title": "Text to Octal Converter (UTF-8 characters → base 8)",
    "description": "Convert text to octal (base 8, UTF-8) instantly. Example: 'A' = 101. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "text to octal",
      "convert text to octal",
      "text octal converter",
      "text to octal converter (utf-8 characters → base 8)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pig-latin",
    "title": "Pig Latin Translator",
    "description": "Translate English text to Pig Latin online for free. Fun language scramble tool.",
    "category": "text-ops",
    "tags": [
      "pig latin",
      "pig latin translator",
      "pig latin generator",
      "fun text",
      "word game"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-repeat",
    "title": "Text Repeater",
    "description": "Repeat any text a custom number of times with a chosen separator online for free.",
    "category": "text-ops",
    "tags": [
      "text repeater",
      "repeat text",
      "duplicate text",
      "text multiplier"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "random-color-generator",
    "title": "Random Color Generator",
    "description": "Generate random colors with HEX, RGB, and HSL values. Perfect for design inspiration.",
    "category": "color-tools",
    "tags": [
      "random color",
      "color generator",
      "random hex color",
      "color palette",
      "random rgb"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "string-hash",
    "title": "String Hash Generator",
    "description": "Generate MD5, SHA1, SHA256, SHA512, and CRC32 hashes from any text string.",
    "category": "developer-tools",
    "tags": [
      "string hash",
      "hash generator",
      "md5 hash",
      "sha256 hash",
      "checksum"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-to-ascii-art",
    "title": "Text to ASCII Art",
    "description": "Convert text to ASCII art online for free. Multiple font styles for banners and decorations.",
    "category": "text-ops",
    "tags": [
      "ascii art",
      "text to ascii",
      "ascii generator",
      "banner text",
      "ascii font"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "whitespace-remover",
    "title": "Whitespace Remover",
    "description": "Remove extra whitespace, leading/trailing spaces, or all whitespace from text online free.",
    "category": "text-ops",
    "tags": [
      "whitespace remover",
      "remove spaces",
      "trim whitespace",
      "clean text",
      "space remover"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-header-footer",
    "title": "PDF Header & Footer",
    "description": "Add custom header text and footer with page numbers to every page of your PDF.",
    "category": "pdf-advanced",
    "tags": [
      "header",
      "footer",
      "page number",
      "pdf",
      "customize"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "motion-blur",
    "title": "Motion Blur",
    "description": "Add cinematic motion blur effect to your images. Choose direction and intensity.",
    "category": "image-effects",
    "tags": [
      "motion blur",
      "speed effect",
      "cinematic",
      "blur",
      "dynamic"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "add-border-to-photo",
    "title": "Add Border to Photo",
    "description": "Add a colored border frame around your image. Choose width and color.",
    "category": "image-layout",
    "tags": [
      "border",
      "frame",
      "photo border",
      "image frame",
      "padding"
    ],
    "input_kind": "mixed",
    "accepts_multiple": false
  },
  {
    "slug": "word-counter",
    "title": "Word Counter",
    "description": "Count words, characters, sentences, paragraphs. Also shows reading time and speaking time estimates.",
    "category": "text-ops",
    "tags": [
      "word counter",
      "character count",
      "reading time",
      "text analysis",
      "word count"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "study-timer",
    "title": "Study Timer (Pomodoro)",
    "description": "Generate a personalized Pomodoro study schedule. Set work intervals, break times, and total study duration.",
    "category": "student-tools",
    "tags": [
      "pomodoro",
      "study timer",
      "focus timer",
      "productivity",
      "study schedule"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "invoice-generator",
    "title": "Invoice Generator — Professional Invoice Maker Free",
    "description": "Generate professional invoices with itemized billing, GST/tax calculation, due dates, and totals. Copy and send instantly — no signup needed.",
    "category": "business-tools",
    "tags": [
      "invoice generator",
      "invoice maker",
      "invoice template",
      "free invoice generator",
      "billing invoice",
      "gst invoice",
      "professional invoice",
      "online invoice maker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "favicon-generator",
    "title": "Favicon Generator",
    "description": "Generate all favicon sizes (16x16 to 256x256), ICO file, and Apple Touch Icon from any image.",
    "category": "utility",
    "tags": [
      "favicon",
      "favicon generator",
      "ico",
      "website icon",
      "apple touch icon"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "barcode-generator",
    "title": "Barcode Generator",
    "description": "Generate barcode images from any text or number. Download as PNG for printing or digital use.",
    "category": "utility",
    "tags": [
      "barcode",
      "barcode generator",
      "code128",
      "product barcode",
      "scan code"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "letter-generator",
    "title": "Formal Letter Generator",
    "description": "Generate professional formal letters as PDF. Enter sender, recipient, subject, and body text.",
    "category": "utility",
    "tags": [
      "letter",
      "formal letter",
      "letter generator",
      "business letter",
      "pdf letter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "calorie-calculator",
    "title": "Calorie Calculator — Daily Calorie Needs (TDEE) Free",
    "description": "Calculate your daily calorie needs (TDEE) using the Mifflin-St Jeor equation. Get BMR, TDEE, BMI, and calorie goals for weight loss, maintenance, and gain.",
    "category": "health-fitness",
    "tags": [
      "calorie calculator",
      "tdee calculator",
      "daily calorie calculator",
      "calorie needs calculator",
      "bmr calculator",
      "calorie deficit calculator",
      "ishu tools calorie calculator",
      "how many calories per day"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bmr-calculator",
    "title": "BMR Calculator",
    "description": "Calculate your Basal Metabolic Rate using the Mifflin-St Jeor and Harris-Benedict equations.",
    "category": "health-tools",
    "tags": [
      "bmr",
      "basal metabolic rate",
      "calories at rest",
      "metabolism",
      "health"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "body-fat-calculator",
    "title": "Body Fat Calculator",
    "description": "Calculate body fat percentage using the US Navy method from height, neck, waist, and hip measurements.",
    "category": "health-tools",
    "tags": [
      "body fat",
      "body fat percentage",
      "navy method",
      "fitness",
      "health calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "water-intake-calculator",
    "title": "Water Intake Calculator — How Much Water Should I Drink?",
    "description": "Calculate your ideal daily water intake based on body weight, activity level, and climate. Get personalized hydration goals in ml, liters, cups, and bottles.",
    "category": "health-tools",
    "tags": [
      "water intake calculator",
      "how much water should I drink",
      "daily water intake",
      "hydration calculator",
      "water calculator",
      "water intake per day",
      "daily water requirement"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sleep-calculator",
    "title": "Sleep Calculator",
    "description": "Find the best time to sleep or wake up based on 90-minute sleep cycles. Wake up feeling refreshed. Shows recommended bedtime and wake-up times.",
    "category": "student-tools",
    "tags": [
      "sleep calculator",
      "sleep cycle calculator",
      "best time to wake up",
      "sleep time calculator",
      "bedtime calculator",
      "wake up time calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "heart-rate-zones",
    "title": "Heart Rate Zone Calculator — Target HR Zones for Training",
    "description": "Calculate your heart rate training zones based on age and resting heart rate. Find Zone 1-5 ranges for fat burning, cardio, and max effort.",
    "category": "health-fitness",
    "tags": [
      "heart rate zones",
      "target heart rate",
      "heart rate training zones",
      "fat burning zone",
      "cardio heart rate",
      "max heart rate calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "steps-to-km",
    "title": "Steps to Distance Calculator — Steps to Km, Miles & Calories",
    "description": "Convert steps to distance (km/miles) and calories burned. Enter your step count and height to calculate exact distance walked or run.",
    "category": "health-fitness",
    "tags": [
      "steps to km",
      "steps to miles",
      "steps to calories",
      "how far did I walk",
      "steps distance calculator",
      "pedometer calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "calories-burned-calculator",
    "title": "Calories Burned Calculator — Exercise & Activity",
    "description": "Calculate calories burned during any physical activity: running, cycling, swimming, walking, yoga, and more. Based on weight, duration, and MET values.",
    "category": "health-fitness",
    "tags": [
      "calories burned calculator",
      "exercise calories",
      "workout calorie calculator",
      "MET calories",
      "how many calories burned",
      "activity calories calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gst-calculator",
    "title": "GST Calculator",
    "description": "Calculate Indian GST (Goods and Services Tax) instantly. Add or remove GST for any rate: 5%, 12%, 18%, 28%. Shows CGST, SGST, and IGST breakdown.",
    "category": "finance-tools",
    "tags": [
      "gst calculator",
      "gst tax",
      "cgst sgst",
      "igst calculator",
      "india tax",
      "goods services tax"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sip-calculator",
    "title": "SIP Calculator — Mutual Fund SIP Returns",
    "description": "Calculate SIP returns with step-up option. Shows total invested, maturity value, wealth gain, and year-wise milestones. Compare with lump-sum investing.",
    "category": "finance-tools",
    "tags": [
      "sip calculator",
      "mutual fund sip calculator",
      "sip returns calculator",
      "step up sip",
      "sip investment calculator",
      "monthly sip calculator india"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "roi-calculator",
    "title": "ROI Calculator",
    "description": "Calculate Return on Investment (ROI) and CAGR from initial and final values. Useful for stocks, real estate, and business investments.",
    "category": "finance-tools",
    "tags": [
      "roi calculator",
      "return on investment",
      "cagr calculator",
      "investment return",
      "profit calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "budget-planner",
    "title": "Budget Planner (50/30/20 Rule)",
    "description": "Instantly split your monthly income using the 50/30/20 budget rule — Needs, Wants, and Savings breakdown.",
    "category": "finance-tools",
    "tags": [
      "budget planner",
      "50 30 20 rule",
      "monthly budget",
      "budget calculator",
      "personal finance"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "savings-goal-calculator",
    "title": "Savings Goal Calculator",
    "description": "Calculate how many months to reach your savings goal based on current savings, monthly contribution, and interest rate.",
    "category": "finance-tools",
    "tags": [
      "savings goal",
      "savings calculator",
      "financial goal",
      "how long to save",
      "investment goal"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "income-tax-calculator",
    "title": "Income Tax Calculator (India)",
    "description": "Calculate Indian income tax for FY 2024-25 under both old and new tax regimes. Shows slab-wise breakdown, rebate u/s 87A, and effective rate.",
    "category": "finance-tools",
    "tags": [
      "income tax calculator",
      "india income tax",
      "new tax regime",
      "old tax regime",
      "87a rebate",
      "itr"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "love-calculator",
    "title": "Love Calculator",
    "description": "Fun love compatibility calculator — enter two names and find out your love percentage! Entertainment only.",
    "category": "student-tools",
    "tags": [
      "love calculator",
      "love percentage",
      "compatibility calculator",
      "love test",
      "fun calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "time-calculator",
    "title": "Time Calculator",
    "description": "Add or subtract time values (hours, minutes, seconds). Supports expressions like '2h 30m + 1h 15m'.",
    "category": "student-tools",
    "tags": [
      "time calculator",
      "add time",
      "subtract time",
      "time addition",
      "hours minutes calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "date-calculator",
    "title": "Date Difference Calculator",
    "description": "Calculate the number of days, weeks, months, and years between two dates. Also add or subtract days from a date.",
    "category": "student-tools",
    "tags": [
      "date calculator",
      "date difference",
      "days between dates",
      "date counter",
      "day calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "age-in-seconds",
    "title": "Age Calculator (Seconds, Days, Hours)",
    "description": "Calculate your exact age in years, months, days, hours, minutes, and seconds. Shows your next birthday countdown.",
    "category": "student-tools",
    "tags": [
      "age in seconds",
      "exact age calculator",
      "age in days",
      "birthday calculator",
      "age calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "random-name-generator",
    "title": "Random Name Generator",
    "description": "Generate random Indian names (male, female, or any). Perfect for creating test data, characters, and projects.",
    "category": "student-tools",
    "tags": [
      "random name generator",
      "fake name generator",
      "indian name generator",
      "name picker",
      "random names"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "video-downloader",
    "title": "Video Downloader",
    "description": "Download videos from YouTube, Instagram, Twitter/X, Facebook, TikTok, and 1000+ sites. Paste any video URL and download instantly in best quality.",
    "category": "video-tools",
    "tags": [
      "video downloader",
      "youtube downloader",
      "instagram downloader",
      "twitter video downloader",
      "tiktok downloader",
      "facebook video downloader",
      "download video online free",
      "yt downloader"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-video-downloader",
    "title": "YouTube Video Downloader",
    "description": "Download YouTube videos in HD, Full HD, or best available quality. Paste the YouTube URL and get your video instantly — free, no signup.",
    "category": "video-tools",
    "tags": [
      "youtube video downloader",
      "download youtube video",
      "youtube downloader free",
      "yt video download",
      "youtube to mp4",
      "download youtube video online free",
      "youtube hd downloader"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-to-mp3",
    "title": "YouTube to MP3 Converter",
    "description": "Convert YouTube videos to MP3 audio. Extract audio from any YouTube video — free, high quality, instant download.",
    "category": "video-tools",
    "tags": [
      "youtube to mp3",
      "youtube mp3 converter",
      "youtube audio downloader",
      "convert youtube to mp3",
      "youtube mp3 free",
      "youtube audio extractor"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "instagram-downloader",
    "title": "Instagram Video Downloader — Download Instagram Videos Free",
    "description": "Download Instagram videos, reels, and IGTV posts for free. Paste any Instagram post URL to instantly save the video — no app, no signup required.",
    "category": "video-tools",
    "tags": [
      "instagram video downloader",
      "download instagram video",
      "instagram downloader free",
      "save instagram video",
      "ig video downloader",
      "instagram reel saver",
      "instagram video download online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "resume-builder",
    "title": "Resume Builder",
    "description": "Build a professional resume/CV online in minutes. Choose a template, fill your details, download as PDF. Free resume builder for students and freshers.",
    "category": "productivity",
    "tags": [
      "resume builder",
      "cv maker",
      "free resume builder",
      "resume template",
      "resume generator",
      "cv builder online",
      "resume for freshers"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pomodoro-timer",
    "title": "Pomodoro Timer",
    "description": "Boost productivity with the Pomodoro Technique. 25-minute focus sessions with short breaks. Customizable timer to maximize your study and work sessions.",
    "category": "productivity",
    "tags": [
      "pomodoro timer",
      "pomodoro technique",
      "focus timer",
      "study timer",
      "productivity timer",
      "work timer",
      "pomodoro app"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "stopwatch",
    "title": "Online Stopwatch",
    "description": "Free online stopwatch with lap timer. Start, stop, reset, and record lap times. Works perfectly on mobile and desktop.",
    "category": "productivity",
    "tags": [
      "stopwatch online",
      "online stopwatch",
      "timer stopwatch",
      "lap timer",
      "digital stopwatch",
      "free stopwatch"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "world-clock",
    "title": "World Clock",
    "description": "Check the current time in any city or timezone worldwide. Supports all major cities — New York, London, Tokyo, Dubai, Mumbai, and more.",
    "category": "productivity",
    "tags": [
      "world clock",
      "time zone converter",
      "current time worldwide",
      "international clock",
      "time in different countries",
      "timezone checker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "typing-speed-test",
    "title": "Typing Speed Test",
    "description": "Test your typing speed in WPM (words per minute) and accuracy. Practice with real sentences. Perfect for students and professionals.",
    "category": "productivity",
    "tags": [
      "typing speed test",
      "wpm test",
      "typing test online",
      "words per minute test",
      "typing practice",
      "keyboard speed test",
      "typing accuracy test"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "screen-ruler",
    "title": "Online Screen Ruler",
    "description": "Measure elements on your screen in pixels, cm, mm, or inches. Free browser-based ruler — no download needed.",
    "category": "productivity",
    "tags": [
      "screen ruler",
      "online ruler",
      "pixel ruler",
      "browser ruler",
      "measure screen",
      "cm ruler online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "note-pad",
    "title": "Online Notepad",
    "description": "Free online notepad with auto-save. Write notes, to-do lists, or any text — saved to your browser. No signup needed.",
    "category": "productivity",
    "tags": [
      "online notepad",
      "free notepad online",
      "browser notepad",
      "online text editor",
      "quick notes",
      "digital notepad"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "to-do-list",
    "title": "To-Do List",
    "description": "Simple and clean online to-do list. Add, complete, and delete tasks. Auto-saved in your browser — works offline.",
    "category": "productivity",
    "tags": [
      "to do list",
      "online todo list",
      "task manager online",
      "free todo app",
      "checklist online",
      "task list maker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "habit-tracker",
    "title": "Habit Tracker",
    "description": "Track daily habits and build streaks. Mark habits as done each day. Perfect for students building good habits.",
    "category": "productivity",
    "tags": [
      "habit tracker",
      "daily habit tracker",
      "habit builder",
      "streak tracker",
      "goal tracker",
      "daily tracker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "flashcard-maker",
    "title": "Flashcard Maker",
    "description": "Create digital flashcards for studying. Add question-answer pairs and review them with flip animations. Perfect for exam preparation.",
    "category": "student-tools",
    "tags": [
      "flashcard maker",
      "digital flashcards",
      "study cards",
      "online flashcards",
      "flashcard creator",
      "exam preparation flashcards"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "grammar-checker",
    "title": "Grammar Checker",
    "description": "Check your English grammar and spelling mistakes online. Get suggestions to improve your writing. Free grammar correction tool.",
    "category": "text-ops",
    "tags": [
      "grammar checker",
      "grammar check online",
      "spell checker",
      "grammar correction",
      "English grammar check",
      "writing checker",
      "grammar fix online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "paraphrase-tool",
    "title": "Paraphrase Tool",
    "description": "Rewrite text in different words while keeping the original meaning. Paraphrasing tool for students, writers, and content creators.",
    "category": "text-ops",
    "tags": [
      "paraphrase tool",
      "paraphrasing tool",
      "rewrite text",
      "text rewriter",
      "paraphrase online",
      "rephrase tool",
      "content rewriter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "plagiarism-detector",
    "title": "Plagiarism Detector",
    "description": "Check if your text contains duplicate or copied content. Highlights potential plagiarism with similarity scores. For students and writers.",
    "category": "text-ops",
    "tags": [
      "plagiarism detector",
      "plagiarism checker",
      "duplicate content checker",
      "plagiarism check online",
      "copy checker",
      "originality checker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-to-handwriting",
    "title": "Text to Handwriting Converter",
    "description": "Convert typed text to realistic handwriting. Choose handwriting style and download as image. Perfect for creative projects and assignments.",
    "category": "text-ops",
    "tags": [
      "text to handwriting",
      "handwriting generator",
      "typed text to handwriting",
      "handwriting converter",
      "handwriting font generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ascii-art-generator",
    "title": "ASCII Art Generator",
    "description": "Convert text to ASCII art. Choose from multiple fonts and styles. Copy your ASCII art for messages, social media, or code comments.",
    "category": "text-ops",
    "tags": [
      "ascii art generator",
      "text to ascii art",
      "ascii art maker",
      "ascii text art",
      "ascii font generator",
      "ascii converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bulk-image-compressor",
    "title": "Bulk Image Compressor",
    "description": "Compress multiple images at once. Upload up to 20 images and compress them all in one click. Reduces file sizes by up to 80%.",
    "category": "image-core",
    "tags": [
      "bulk image compressor",
      "compress multiple images",
      "batch image compressor",
      "compress images online free",
      "multiple photo compressor",
      "bulk compress jpg png"
    ],
    "input_kind": "files",
    "accepts_multiple": true
  },
  {
    "slug": "image-to-base64",
    "title": "Image to Base64 Converter",
    "description": "Convert any image to Base64 encoded string. Useful for embedding images in HTML, CSS, and JSON without external files.",
    "category": "image-core",
    "tags": [
      "image to base64",
      "image base64 converter",
      "base64 image encoder",
      "convert image to base64",
      "img to base64 online"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "base64-to-image",
    "title": "Base64 to Image Converter",
    "description": "Decode a Base64 string back to an image file. Paste your Base64 encoded image data and download the original image.",
    "category": "image-core",
    "tags": [
      "base64 to image",
      "base64 decode image",
      "base64 image converter",
      "decode base64 image",
      "base64 to png jpg"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ip-address-lookup",
    "title": "IP Address Lookup",
    "description": "Find your current IP address and get detailed geolocation information — country, city, ISP, timezone, and more. Free IP checker.",
    "category": "network-tools",
    "tags": [
      "ip address lookup",
      "ip address finder",
      "my ip address",
      "ip geolocation",
      "ip checker",
      "ip location lookup",
      "what is my ip"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "dns-lookup",
    "title": "DNS Lookup Tool",
    "description": "Look up DNS records for any domain. Check A, AAAA, MX, CNAME, TXT, NS, and SOA records. Free online DNS checker.",
    "category": "network-tools",
    "tags": [
      "dns lookup",
      "dns checker",
      "dns record lookup",
      "mx record checker",
      "domain dns lookup",
      "dns records tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "whois-lookup",
    "title": "WHOIS Lookup",
    "description": "Look up domain registration information. Find domain owner, registrar, creation date, expiry, and nameservers.",
    "category": "network-tools",
    "tags": [
      "whois lookup",
      "domain whois",
      "domain info lookup",
      "whois checker",
      "domain registration info",
      "domain owner lookup"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ssl-certificate-checker",
    "title": "SSL Certificate Checker",
    "description": "Check SSL/TLS certificate details for any website. View expiry date, issuer, common name, and security grade.",
    "category": "network-tools",
    "tags": [
      "ssl certificate checker",
      "ssl checker",
      "https certificate check",
      "ssl expiry checker",
      "certificate validator",
      "tls checker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "word-frequency-counter",
    "title": "Word Frequency Counter",
    "description": "Analyze text and count how many times each word appears. Shows word frequency table sorted by count. Great for content analysis.",
    "category": "text-ops",
    "tags": [
      "word frequency counter",
      "word count analysis",
      "text frequency analyzer",
      "word occurrence counter",
      "word statistics",
      "text analyzer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "fibonacci-generator",
    "title": "Fibonacci Sequence Generator — Generate Fibonacci Numbers",
    "description": "Generate the first N Fibonacci numbers instantly. Also shows the golden ratio approximation and sum of the sequence.",
    "category": "math-tools",
    "tags": [
      "fibonacci generator",
      "fibonacci sequence",
      "fibonacci numbers calculator",
      "generate fibonacci",
      "golden ratio calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "prime-number-checker",
    "title": "Prime Number Checker",
    "description": "Check if a number is prime and find all prime numbers in a given range. Also shows the next prime and prime factorization.",
    "category": "math-tools",
    "tags": [
      "prime number checker",
      "is prime number",
      "prime number finder",
      "prime number generator",
      "prime factorization",
      "prime numbers list"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "matrix-calculator",
    "title": "Matrix Calculator — Determinant, Transpose, Add & Multiply",
    "description": "Calculate matrix determinant, transpose, addition, and multiplication for 2×2 and 3×3 matrices. Free online matrix calculator.",
    "category": "math-tools",
    "tags": [
      "matrix calculator",
      "determinant calculator",
      "matrix multiplication",
      "matrix transpose",
      "2x2 matrix calculator",
      "3x3 matrix determinant"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "equation-solver",
    "title": "Equation Solver — Linear, Quadratic & Systems",
    "description": "Solve linear equations (ax+b=c), quadratic equations, and systems of two equations. Shows step-by-step working.",
    "category": "math-tools",
    "tags": [
      "equation solver",
      "quadratic equation",
      "linear equation",
      "algebra calculator",
      "solve equations online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "statistics-calculator",
    "title": "Statistics Calculator — Mean, Median, Mode, Std Dev & More",
    "description": "Calculate descriptive statistics from a dataset: mean, median, mode, variance, standard deviation, IQR, quartiles, and more. Free online stats calculator.",
    "category": "math-tools",
    "tags": [
      "statistics calculator",
      "mean median mode calculator",
      "standard deviation calculator",
      "descriptive statistics",
      "variance calculator",
      "IQR calculator online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "currency-converter",
    "title": "Currency Converter",
    "description": "Convert between 150+ world currencies with live exchange rates. INR to USD, EUR, GBP, AED, and more. Free real-time currency calculator.",
    "category": "finance-tools",
    "tags": [
      "currency converter",
      "currency exchange rate",
      "inr to usd",
      "dollar to rupee",
      "live currency converter",
      "foreign exchange calculator",
      "forex converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gst-calculator-india",
    "title": "GST Calculator India",
    "description": "Calculate GST (Goods and Services Tax) for any amount. Supports all GST slabs: 5%, 12%, 18%, 28%. Calculates inclusive and exclusive GST.",
    "category": "finance-tools",
    "tags": [
      "gst calculator",
      "gst calculator india",
      "goods and services tax calculator",
      "gst inclusive calculator",
      "gst exclusive calculator",
      "18 percent gst calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "atm-pin-generator",
    "title": "ATM PIN Generator",
    "description": "Generate secure random 4-digit and 6-digit ATM PINs. Avoids obvious patterns. Use for secure ATM PIN ideas.",
    "category": "finance-tools",
    "tags": [
      "atm pin generator",
      "4 digit pin generator",
      "secure pin generator",
      "random pin generator",
      "pin number generator",
      "bank pin generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "credit-card-validator",
    "title": "Credit Card Validator",
    "description": "Validate credit and debit card numbers using the Luhn algorithm. Identifies card type (Visa, Mastercard, Amex, RuPay). For testing only.",
    "category": "finance-tools",
    "tags": [
      "credit card validator",
      "card number validator",
      "luhn algorithm",
      "credit card checker",
      "card validator online",
      "visa mastercard validator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ifsc-code-finder",
    "title": "IFSC Code Finder",
    "description": "Find IFSC code of any bank branch in India. Search by bank name, state, and city. Get bank address and contact information.",
    "category": "finance-tools",
    "tags": [
      "ifsc code finder",
      "ifsc code search",
      "bank ifsc code",
      "ifsc code lookup",
      "find ifsc code",
      "bank branch ifsc"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "emi-calculator-advanced",
    "title": "Advanced EMI Calculator — Home, Car & Education Loan",
    "description": "Calculate EMI with complete amortization schedule, total interest, tax benefits (80C, 80E, 24b), and prepayment savings for home, car, and education loans.",
    "category": "finance-tools",
    "tags": [
      "emi calculator",
      "home loan emi calculator",
      "car loan emi",
      "education loan emi",
      "loan calculator india",
      "amortization calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sip-calculator-india",
    "title": "SIP Calculator India",
    "description": "Calculate SIP maturity value, total investment, and estimated mutual fund returns with yearly projection for Indian investors.",
    "category": "finance-tools",
    "tags": [
      "sip calculator",
      "sip calculator india",
      "mutual fund sip calculator",
      "monthly investment calculator",
      "investment return calculator",
      "sip maturity calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "income-tax-calculator-india",
    "title": "Income Tax Calculator India",
    "description": "Estimate Indian income tax under new and old regimes with standard deduction, rebate, cess, taxable income, and monthly tax breakdown.",
    "category": "finance-tools",
    "tags": [
      "income tax calculator india",
      "tax calculator india",
      "new regime tax calculator",
      "old regime tax calculator",
      "salary tax calculator",
      "income tax 2024 25"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "salary-hike-calculator",
    "title": "Salary Hike Calculator — New CTC After Increment",
    "description": "Calculate your new CTC after a salary hike. Shows monthly increase, CTC breakdown (basic, HRA, PF), in-hand salary estimate, and hike quality rating.",
    "category": "hr-jobs",
    "tags": [
      "salary hike calculator",
      "salary increment calculator",
      "new ctc calculator",
      "salary after hike",
      "appraisal calculator",
      "salary increase india"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "loan-prepayment-calculator",
    "title": "Loan Prepayment Calculator",
    "description": "Estimate how much interest and tenure you save by making a home, car, or personal loan prepayment.",
    "category": "finance-tools",
    "tags": [
      "loan prepayment calculator",
      "home loan prepayment calculator",
      "emi prepayment calculator",
      "interest saving calculator",
      "loan tenure reduction calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "fixed-deposit-calculator-india",
    "title": "Fixed Deposit Calculator India",
    "description": "Calculate FD maturity value and interest earned with quarterly, monthly, or yearly compounding for Indian fixed deposits.",
    "category": "finance-tools",
    "tags": [
      "fd calculator",
      "fixed deposit calculator",
      "fd calculator india",
      "bank fd calculator",
      "fixed deposit maturity calculator",
      "interest calculator india"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "recurring-deposit-calculator",
    "title": "Recurring Deposit Calculator",
    "description": "Calculate RD maturity amount, total deposits, and interest earned from monthly recurring deposits.",
    "category": "finance-tools",
    "tags": [
      "rd calculator",
      "recurring deposit calculator",
      "rd maturity calculator",
      "monthly deposit calculator",
      "bank rd calculator",
      "post office rd calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "loan-eligibility-calculator",
    "title": "Loan Eligibility Calculator",
    "description": "Estimate home, car, or personal loan eligibility from monthly income, existing EMI, interest rate, tenure, and FOIR.",
    "category": "finance-tools",
    "tags": [
      "loan eligibility calculator",
      "home loan eligibility",
      "personal loan eligibility",
      "car loan eligibility",
      "foir calculator",
      "emi eligibility calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "expense-splitter",
    "title": "Expense Splitter — Bill Splitter & Group Expense Calculator",
    "description": "Split bills and expenses fairly among friends. Enter who paid what and get exact settlement amounts with minimal transactions. Trip, dinner, and roommate splits.",
    "category": "business-tools",
    "tags": [
      "expense splitter",
      "bill splitter",
      "split bill online",
      "group expense calculator",
      "trip expense splitter",
      "splitwise alternative",
      "roommate expense",
      "fair split"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "upi-qr-generator",
    "title": "UPI QR Code Generator",
    "description": "Generate a UPI payment QR code from UPI ID, name, amount, and note. Download as PNG for shops, freelancers, and personal payments.",
    "category": "finance-tools",
    "tags": [
      "upi qr generator",
      "upi qr code generator",
      "payment qr generator india",
      "phonepe qr generator",
      "gpay qr generator",
      "paytm qr generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "wifi-qr-generator",
    "title": "Wi-Fi QR Code Generator",
    "description": "Create a Wi-Fi QR code from network name and password so guests can connect instantly without typing.",
    "category": "utility",
    "tags": [
      "wifi qr generator",
      "wifi qr code",
      "wifi password qr",
      "share wifi qr",
      "qr code for wifi",
      "wifi login qr"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "grade-needed-calculator",
    "title": "Grade Needed Calculator",
    "description": "Calculate the score needed in a final exam or assignment to reach your target course grade.",
    "category": "student-tools",
    "tags": [
      "grade needed calculator",
      "final exam grade calculator",
      "what grade do i need",
      "target grade calculator",
      "student grade calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "exam-countdown-calculator",
    "title": "Exam Countdown Calculator",
    "description": "Calculate days, weeks, and available study hours left until your exam date. Useful for planning JEE, NEET, UPSC, semester exams, and school tests.",
    "category": "student-tools",
    "tags": [
      "exam countdown",
      "days until exam",
      "study countdown calculator",
      "exam date calculator",
      "jee exam countdown",
      "neet exam countdown",
      "upsc countdown"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "marks-percentage-calculator",
    "title": "Marks Percentage Calculator",
    "description": "Calculate exam percentage, grade, and pass/fail status from obtained marks and total marks. Perfect for students and college results.",
    "category": "student-tools",
    "tags": [
      "marks percentage calculator",
      "percentage calculator for marks",
      "exam percentage calculator",
      "student marks calculator",
      "grade calculator",
      "result percentage calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cgpa-percentage-converter",
    "title": "CGPA to Percentage Converter",
    "description": "Convert CGPA to percentage using CBSE 9.5 formula or custom scale formula for colleges and universities.",
    "category": "student-tools",
    "tags": [
      "cgpa to percentage",
      "cgpa percentage converter",
      "cgpa calculator",
      "convert cgpa to percentage",
      "cbse cgpa to percentage",
      "college cgpa converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "attendance-required-calculator",
    "title": "Attendance Required Calculator",
    "description": "Calculate current attendance percentage, classes needed to reach 75%, and how many classes you can safely miss.",
    "category": "student-tools",
    "tags": [
      "attendance calculator",
      "75 attendance calculator",
      "attendance required calculator",
      "college attendance calculator",
      "classes needed for attendance",
      "bunk calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-readability-score",
    "title": "Text Readability Score",
    "description": "Analyze text readability using Flesch-Kincaid score. Get reading level, grade level, word count, sentence count, and audience recommendation.",
    "category": "text-ops",
    "tags": [
      "readability score",
      "flesch kincaid",
      "text readability checker",
      "reading level calculator",
      "content readability",
      "text complexity analyzer",
      "ishu tools readability"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cron-builder",
    "title": "Cron Expression Builder",
    "description": "Build, validate, and understand cron expressions. Converts cron syntax to human-readable schedule. Includes common presets and next-run explanations.",
    "category": "developer-tools",
    "tags": [
      "cron expression builder",
      "cron job builder",
      "cron syntax explainer",
      "cron generator online",
      "schedule builder cron",
      "cron expression validator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "investment-calculator",
    "title": "Investment Return Calculator",
    "description": "Calculate returns on investments with compound interest, monthly contributions, and yearly projections. Compare simple vs compound growth.",
    "category": "finance-tools",
    "tags": [
      "investment calculator",
      "compound interest calculator india",
      "investment return calculator",
      "mutual fund return calculator",
      "lump sum calculator",
      "wealth calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "net-worth-calculator",
    "title": "Net Worth Calculator",
    "description": "Calculate your total net worth from assets (cash, investments, real estate) and liabilities (loans, credit card debt). Get your financial health score.",
    "category": "finance-tools",
    "tags": [
      "net worth calculator",
      "net worth calculator india",
      "assets liabilities calculator",
      "personal finance calculator",
      "wealth calculator india",
      "financial health calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "retirement-planner",
    "title": "Retirement Planner Calculator",
    "description": "Calculate corpus needed for retirement, projected savings, and monthly investment required to retire comfortably. Inflation-adjusted retirement planning.",
    "category": "finance-tools",
    "tags": [
      "retirement calculator india",
      "retirement planner",
      "retirement corpus calculator",
      "how much to save for retirement",
      "retirement planning india",
      "fire calculator india"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pace-calculator",
    "title": "Running Pace Calculator",
    "description": "Calculate running pace per km or mile, speed in km/h and mph, and race finish time predictions for 5K, 10K, half marathon, and marathon.",
    "category": "health-tools",
    "tags": [
      "running pace calculator",
      "pace calculator",
      "km per minute calculator",
      "marathon pace calculator",
      "5k pace calculator",
      "running speed calculator",
      "race time predictor"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "menstrual-cycle-calculator",
    "title": "Menstrual Cycle & Period Calculator",
    "description": "Calculate next period date, ovulation window, fertile days, and current cycle phase. Track your menstrual cycle and plan accordingly.",
    "category": "health-tools",
    "tags": [
      "menstrual cycle calculator",
      "period calculator",
      "ovulation calculator",
      "next period date",
      "fertility calculator",
      "period tracker online",
      "fertile window calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pregnancy-week-calculator",
    "title": "Pregnancy Week Calculator",
    "description": "Calculate pregnancy week, trimester, due date, and days until delivery from Last Menstrual Period (LMP). Track pregnancy milestones.",
    "category": "health-tools",
    "tags": [
      "pregnancy week calculator",
      "due date calculator",
      "pregnancy calculator india",
      "lmp calculator",
      "how many weeks pregnant",
      "trimester calculator",
      "pregnancy milestone tracker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "speed-calculator",
    "title": "Speed Distance Time Calculator",
    "description": "Calculate speed, distance, or time from any two known values. Supports km/h, mph, and m/s with instant formula explanation.",
    "category": "math-tools",
    "tags": [
      "speed calculator",
      "distance calculator",
      "time calculator",
      "speed distance time",
      "velocity calculator",
      "physics calculator speed",
      "sdt calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "aspect-ratio-calculator",
    "title": "Aspect Ratio Calculator",
    "description": "Calculate image aspect ratio, GCD simplification, megapixels, and get scaled dimensions for any target width or height.",
    "category": "image-core",
    "tags": [
      "aspect ratio calculator",
      "image aspect ratio",
      "screen ratio calculator",
      "resolution calculator",
      "16:9 calculator",
      "4:3 ratio calculator",
      "scale image dimensions"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gstin-validator",
    "title": "GSTIN Validator India",
    "description": "Validate Indian GSTIN (GST Identification Number) online. Extract state code, PAN, entity type, and verify format compliance.",
    "category": "finance-tools",
    "tags": [
      "gstin validator",
      "gst number validator",
      "gst verification online",
      "gstin format check",
      "india gst validator",
      "gstin checker",
      "gst number check india"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pan-validator",
    "title": "PAN Card Validator India",
    "description": "Validate Indian PAN card number online. Check format, identify PAN holder type (individual, company, HUF) and verify instantly.",
    "category": "finance-tools",
    "tags": [
      "pan card validator",
      "pan number validator",
      "pan verification online",
      "pan card check india",
      "pan format validator",
      "income tax pan validator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "phone-number-validator",
    "title": "Phone Number Validator",
    "description": "Validate phone numbers for India, US, UK, and more. Detect country code, format, operator hint, and validation status.",
    "category": "utility",
    "tags": [
      "phone number validator",
      "mobile number validator india",
      "phone number checker",
      "indian mobile number validator",
      "phone format validator",
      "number validation tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "email-validator",
    "title": "Email Address Validator",
    "description": "Validate email addresses for correct format, domain, and common issues. Check if email is personal, educational, or corporate.",
    "category": "utility",
    "tags": [
      "email validator",
      "email address checker",
      "email format validator",
      "validate email online",
      "email verification tool",
      "check email format",
      "email syntax validator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "css-gradient-generator",
    "title": "CSS Gradient Generator",
    "description": "Generate linear, radial, and conic CSS gradients with custom colors and angles. Copy ready-to-use CSS code with presets.",
    "category": "color-tools",
    "tags": [
      "css gradient generator",
      "linear gradient generator",
      "radial gradient css",
      "gradient color picker",
      "css background generator",
      "gradient code generator",
      "web design gradient tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "box-shadow-generator",
    "title": "CSS Box Shadow Generator",
    "description": "Generate CSS box-shadow code with custom offset, blur, spread, color, and inset settings. Includes presets and copy-ready CSS.",
    "category": "color-tools",
    "tags": [
      "box shadow generator",
      "css box shadow",
      "shadow generator online",
      "css shadow tool",
      "box shadow css code",
      "drop shadow generator",
      "css shadow builder"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ppf-calculator",
    "title": "PPF Calculator India",
    "description": "Calculate Public Provident Fund (PPF) maturity amount, total interest earned, and year-by-year breakdown. Compare with current 7.1% interest rate.",
    "category": "finance-tools",
    "tags": [
      "ppf calculator",
      "public provident fund calculator",
      "ppf maturity calculator",
      "ppf interest calculator india",
      "ppf returns calculator",
      "ppf investment calculator",
      "post office ppf calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "nps-calculator",
    "title": "NPS Calculator India",
    "description": "Calculate National Pension System (NPS) corpus, lump sum withdrawal, and monthly pension. Compare Tier 1 NPS returns for retirement planning.",
    "category": "finance-tools",
    "tags": [
      "nps calculator",
      "national pension system calculator",
      "nps return calculator india",
      "nps monthly pension calculator",
      "nps contribution calculator",
      "tier 1 nps calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "macro-calculator",
    "title": "Macro Calculator — Protein, Carbs & Fat",
    "description": "Calculate daily macronutrient needs (protein, carbs, fat) based on weight, height, age, activity level, and fitness goal (lose/gain/maintain).",
    "category": "health-tools",
    "tags": [
      "macro calculator",
      "macronutrient calculator",
      "protein calculator",
      "calorie macro calculator",
      "daily macro calculator",
      "fitness macro calculator",
      "cutting bulking macros"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "braille-converter",
    "title": "Braille Converter — Text to Braille",
    "description": "Convert English text to Grade 1 Braille symbols instantly. Educational tool for learning Braille or creating accessible content.",
    "category": "text-ops",
    "tags": [
      "braille converter",
      "text to braille",
      "braille generator",
      "convert text to braille",
      "braille translator online",
      "braille alphabet converter",
      "english to braille"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "net-salary-calculator-india",
    "title": "Net Salary / In-Hand Salary Calculator India",
    "description": "Calculate monthly in-hand salary from CTC. Accounts for PF, income tax (new/old regime), professional tax, and HRA exemption for FY 2024-25.",
    "category": "finance-tools",
    "tags": [
      "net salary calculator india",
      "in hand salary calculator",
      "ctc to take home salary",
      "salary calculator india 2024",
      "monthly salary after tax india",
      "take home pay calculator india"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hra-calculator-india",
    "title": "HRA Calculator India — Tax Exemption",
    "description": "Calculate HRA tax exemption under Section 10(13A). Enter basic salary, HRA received, and rent paid to find exempt and taxable HRA amount.",
    "category": "finance-tools",
    "tags": [
      "hra calculator india",
      "hra exemption calculator",
      "house rent allowance calculator",
      "hra tax exemption india",
      "hra calculation formula",
      "section 10 13a calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "epf-calculator-india",
    "title": "EPF Calculator India",
    "description": "Calculate Employee Provident Fund (EPF) corpus from monthly contribution, years of service, and interest rate. Shows employer and employee split.",
    "category": "finance-tools",
    "tags": [
      "epf calculator india",
      "pf calculator india",
      "provident fund calculator",
      "epf maturity calculator",
      "employee pf calculator",
      "epfo calculator",
      "pf balance calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gratuity-calculator-india",
    "title": "Gratuity Calculator India",
    "description": "Calculate gratuity amount based on last drawn salary and years of service. Supports both Gratuity Act covered and non-covered employees.",
    "category": "finance-tools",
    "tags": [
      "gratuity calculator india",
      "gratuity calculator online",
      "gratuity amount calculator",
      "gratuity formula india",
      "gratuity calculation 2024",
      "employee gratuity calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "url-validator",
    "title": "URL Validator & Analyzer",
    "description": "Validate any URL and analyze its structure: scheme, domain, path, query parameters, and security. Check for common URL issues.",
    "category": "developer-tools",
    "tags": [
      "url validator",
      "url checker online",
      "url format validator",
      "validate url online",
      "url structure analyzer",
      "link validator",
      "url syntax checker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "color-blindness-simulator",
    "title": "Color Blindness Simulator",
    "description": "Simulate how colors appear to people with protanopia, deuteranopia, tritanopia, and achromatopsia (total color blindness). Improve web accessibility.",
    "category": "color-tools",
    "tags": [
      "color blindness simulator",
      "color blind test",
      "colorblind simulator online",
      "protanopia simulator",
      "deuteranopia color tool",
      "accessibility color checker",
      "web accessibility color"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "grammar-score",
    "title": "Grammar Score Estimator",
    "description": "Estimate grammar quality of text with a score out of 100. Detects common errors, spelling issues, passive voice, and sentence problems.",
    "category": "text-ops",
    "tags": [
      "grammar checker online",
      "grammar score",
      "text grammar checker",
      "english grammar tool",
      "grammar quality checker",
      "writing quality checker",
      "grammar analyzer online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-downloader",
    "title": "YouTube Video Downloader",
    "description": "Download YouTube videos in MP4, WebM, or MP3 format. Paste the YouTube URL and choose quality — free, fast, no signup.",
    "category": "video-tools",
    "tags": [
      "youtube downloader",
      "download youtube video",
      "youtube to mp4",
      "youtube video download free",
      "youtube downloader online",
      "save youtube video",
      "youtube mp4 downloader",
      "yt downloader free"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "photo-collage-maker",
    "title": "Photo Collage Maker",
    "description": "Create beautiful photo collages by combining multiple images into a grid layout. Perfect for social media, memories, and presentations.",
    "category": "image-layout",
    "tags": [
      "photo collage maker",
      "image collage online",
      "collage maker free",
      "photo grid maker",
      "combine photos online",
      "collage generator",
      "photo montage free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "time-converter",
    "title": "Time Unit Converter",
    "description": "Convert between seconds, minutes, hours, days, weeks, months, years, milliseconds, and more. Instant time unit conversion free online.",
    "category": "math-calculators",
    "tags": [
      "time converter",
      "time unit converter",
      "seconds to minutes",
      "hours to days",
      "convert time units",
      "time calculator online free",
      "ishu tools time converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "coin-flipper",
    "title": "Coin Flipper — Flip a Coin Online",
    "description": "Flip a virtual coin online — get heads or tails instantly. Flip multiple coins at once for probability experiments, games, and decisions.",
    "category": "student-tools",
    "tags": [
      "coin flipper",
      "flip a coin online",
      "heads or tails",
      "virtual coin toss",
      "coin flip free",
      "random coin flip",
      "decision maker coin flip",
      "ishu tools coin flip"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "morse-code-converter",
    "title": "Morse Code Converter — Text to Morse Code Free",
    "description": "Convert text to Morse code or decode Morse code to text instantly. Supports letters, numbers, and punctuation. Free Morse code translator online.",
    "category": "text-operations",
    "tags": [
      "morse code converter",
      "text to morse code",
      "morse code translator",
      "decode morse code",
      "morse code encoder",
      "morse code decoder online free",
      "ishu tools morse code"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "fraction-calculator",
    "title": "Fraction Calculator — Add Subtract Multiply Divide Fractions",
    "description": "Add, subtract, multiply, and divide fractions online with automatic simplification. Shows result as fraction and decimal. Free fraction calculator for students.",
    "category": "math-calculators",
    "tags": [
      "fraction calculator",
      "add fractions",
      "subtract fractions",
      "multiply fractions",
      "divide fractions",
      "fraction simplifier",
      "fraction math online",
      "fraction calculator free",
      "ishu tools fraction calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "percentage-change-calculator",
    "title": "Percentage Change Calculator — % Increase Decrease Online",
    "description": "Calculate percentage change between two values — find % increase or decrease instantly. Enter old and new values to see the exact percentage change.",
    "category": "math-calculators",
    "tags": [
      "percentage change calculator",
      "percent increase calculator",
      "percent decrease calculator",
      "percentage difference",
      "calculate % change",
      "percent change formula",
      "ishu tools percentage calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "emi-calculator",
    "title": "EMI Calculator — Loan EMI Calculator India Free",
    "description": "Calculate your monthly EMI for home loan, car loan, personal loan online free. Enter principal, interest rate, and tenure to get exact monthly EMI, total payment, and total interest.",
    "category": "finance-tax",
    "tags": [
      "emi calculator",
      "loan emi calculator",
      "home loan emi calculator india",
      "car loan emi",
      "personal loan emi",
      "monthly emi calculator free",
      "ishu tools emi calculator",
      "emi formula calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "interest-calculator",
    "title": "Interest Calculator — Simple & Compound Interest Free",
    "description": "Calculate simple interest and compound interest online free. Enter principal, rate, and time to get total interest earned and final amount. Perfect for students and investors.",
    "category": "finance-tax",
    "tags": [
      "interest calculator",
      "simple interest calculator",
      "compound interest calculator",
      "SI CI calculator",
      "interest rate calculator",
      "calculate interest online free",
      "ishu tools interest calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "reading-time-estimator",
    "title": "Reading Time Estimator — How Long to Read Online",
    "description": "Estimate how long it will take to read any text. Paste your content to get reading time in minutes and seconds at different reading speeds — perfect for bloggers, students, and writers.",
    "category": "text-operations",
    "tags": [
      "reading time estimator",
      "how long to read",
      "reading time calculator",
      "words per minute calculator",
      "text reading time",
      "blog reading time",
      "ishu tools reading time"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "exam-score-calculator",
    "title": "Exam Score Calculator — Marks to Percentage & Grade",
    "description": "Convert exam marks to percentage and grade online free. Enter marks obtained and total marks to get your percentage, grade (A, B, C), and GPA equivalent instantly.",
    "category": "student-tools",
    "tags": [
      "exam score calculator",
      "marks to percentage",
      "marks calculator",
      "grade calculator online",
      "percentage from marks",
      "exam grade calculator",
      "ishu tools marks calculator",
      "marks to grade"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "anagram-checker",
    "title": "Anagram Checker — Check if Two Words are Anagrams",
    "description": "Check if two words or phrases are anagrams of each other online free. See missing characters and character frequency analysis. Perfect for word games and students.",
    "category": "text-operations",
    "tags": [
      "anagram checker",
      "anagram detector",
      "check anagram online",
      "word anagram finder",
      "anagram solver",
      "are these words anagrams",
      "ishu tools anagram"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-line-sorter",
    "title": "Text Line Sorter — Sort Lines Alphabetically Online",
    "description": "Sort lines of text alphabetically, reverse, by length, or randomly online free. Perfect for sorting lists, names, data, and code. Paste your text and sort instantly.",
    "category": "text-operations",
    "tags": [
      "text line sorter",
      "sort lines alphabetically",
      "alphabetical sorter",
      "list sorter online",
      "text sorter free",
      "sort text online",
      "ishu tools text sorter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "list-deduplicator",
    "title": "List Deduplicator — Remove Duplicate Lines Online",
    "description": "Remove duplicate lines or items from any list online free. Paste your list and get unique items instantly. Perfect for cleaning data, emails, names, and more.",
    "category": "text-operations",
    "tags": [
      "list deduplicator",
      "remove duplicates online",
      "remove duplicate lines",
      "unique line extractor",
      "deduplicate list",
      "duplicate remover",
      "ishu tools deduplicator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "character-frequency",
    "title": "Character Frequency Counter — Letter Frequency Analysis",
    "description": "Count how often each character or letter appears in text online free. Perfect for cryptography, language analysis, Morse code practice, and writing analysis.",
    "category": "text-operations",
    "tags": [
      "character frequency",
      "letter frequency counter",
      "char frequency analysis",
      "character count frequency",
      "text frequency analysis",
      "letter count online",
      "ishu tools character frequency"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "assignment-deadline-tracker",
    "title": "Assignment Deadline Tracker — Days Until Due Date",
    "description": "Track your assignment deadlines and see exactly how many days are left. Enter your due date and assignment to get instant countdown and status alerts.",
    "category": "student-tools",
    "tags": [
      "assignment deadline tracker",
      "deadline tracker",
      "days until deadline",
      "assignment due date calculator",
      "homework deadline tracker",
      "ishu tools deadline",
      "student deadline tracker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "number-palindrome-checker",
    "title": "Palindrome Checker — Check if Word or Number is Palindrome",
    "description": "Check if a word, number, or phrase is a palindrome online free. Analyzes each word and the full phrase. Instant palindrome detection with reversal display.",
    "category": "math-calculators",
    "tags": [
      "palindrome checker",
      "number palindrome",
      "word palindrome checker",
      "is palindrome online",
      "palindrome detector",
      "check palindrome free",
      "ishu tools palindrome"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "resume-word-count",
    "title": "Resume Word Count — Analyze Your Resume Length Free",
    "description": "Count words in your resume and get professional analysis. Checks word count, power words, reading time, page estimate, and gives improvement tips for a stronger resume.",
    "category": "student-tools",
    "tags": [
      "resume word count",
      "resume analyzer",
      "resume length checker",
      "resume power words",
      "cv word count",
      "resume checker free",
      "ishu tools resume analyzer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "study-hours-calculator",
    "title": "Study Hours Calculator — Plan Your Exam Study Schedule",
    "description": "Plan your study schedule for exams by calculating hours per subject. Enter subjects, days left, and daily available hours to get a complete study plan.",
    "category": "student-tools",
    "tags": [
      "study hours calculator",
      "study planner",
      "exam study schedule",
      "how many hours to study",
      "study time calculator",
      "exam preparation planner",
      "ishu tools study planner"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "unit-converter",
    "title": "Unit Converter — Convert Length Weight Volume Speed Area",
    "description": "Universal unit converter supporting length (km, m, ft), weight (kg, lb), volume (L, ml, gallon), speed (km/h, mph), area (m², ft², acre), data (KB, MB, GB), and more.",
    "category": "math-calculators",
    "tags": [
      "unit converter",
      "universal converter",
      "length converter",
      "weight converter online",
      "volume converter",
      "speed converter",
      "area converter",
      "convert units online free",
      "ishu tools unit converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bill-splitter",
    "title": "Bill Splitter",
    "description": "Split restaurant bills, trips, or shared expenses equally among friends. Enter the total amount, number of people, and optional tip to get per-person amounts instantly.",
    "category": "student-tools",
    "tags": [
      "bill splitter",
      "split bill calculator",
      "restaurant bill splitter",
      "expense splitter",
      "bill split among friends",
      "divide bill equally",
      "trip expense calculator",
      "share expense calculator",
      "bill splitter online free",
      "bill split app",
      "restaurant bill calculator india"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "random-name-picker",
    "title": "Random Name Picker",
    "description": "Pick a random name from a list — perfect for classroom activities, group selection, lucky draws, and contests. Paste your list and get a random winner instantly.",
    "category": "student-tools",
    "tags": [
      "random name picker",
      "random name generator",
      "pick random name",
      "name randomizer",
      "classroom name picker",
      "random winner picker",
      "lucky draw picker",
      "random student picker",
      "name chooser online",
      "random name selector free"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "video-converter",
    "title": "Video Converter — MP4, MOV, MKV, WebM, AVI, FLV, MPEG, M4V, WMV",
    "description": "Convert any video file between 9 popular formats — MP4, MOV, MKV, WebM, AVI, FLV, MPEG, M4V and WMV. Smart codec selection per format, faststart for instant web playback. Free online video converter, no signup.",
    "category": "video-tools",
    "tags": [
      "video converter",
      "convert video",
      "mp4 converter",
      "mov to mp4",
      "mkv to mp4",
      "webm to mp4",
      "avi to mp4",
      "flv to mp4",
      "wmv to mp4",
      "video format converter",
      "online video converter free",
      "any video converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-reverser",
    "title": "Video Reverser — Play Video in Reverse Online Free",
    "description": "Reverse any video so it plays backwards — with or without reversed audio. Perfect for reels, comedy edits, magic effects and viral social-media clips. Free, no signup.",
    "category": "video-tools",
    "tags": [
      "video reverser",
      "reverse video",
      "play video backwards",
      "reverse video online",
      "video reverse maker",
      "rewind video effect",
      "backwards video",
      "reverse video free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-cropper",
    "title": "Video Cropper — Crop Video to Square, 9:16, 16:9 Free",
    "description": "Crop any video to perfect Instagram square (1:1), Reels/Shorts vertical (9:16), YouTube horizontal (16:9), portrait (4:5) or classic (4:3). Center-crop, no quality loss.",
    "category": "video-tools",
    "tags": [
      "video cropper",
      "crop video online",
      "video to square",
      "video to 9:16",
      "instagram video crop",
      "youtube shorts crop",
      "tiktok video crop",
      "crop video free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-resizer",
    "title": "Video Resizer — Change Video Resolution Free",
    "description": "Resize any video to 240p, 360p, 480p, 720p HD, 1080p Full HD, 1440p 2K or 2160p 4K. Reduce file size or scale up — keeps original aspect ratio.",
    "category": "video-tools",
    "tags": [
      "video resizer",
      "change video resolution",
      "resize video online",
      "video to 720p",
      "video to 1080p",
      "video to 4k",
      "downscale video",
      "upscale video resolution"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-watermark",
    "title": "Video Watermark — Add Text Watermark to Video Free",
    "description": "Add a text watermark or logo overlay to any video — pick top-left, top-right, bottom-left, bottom-right or center. Perfect for branding, copyright protection and tutorials.",
    "category": "video-tools",
    "tags": [
      "video watermark",
      "add watermark to video",
      "text watermark video",
      "video branding",
      "copyright video",
      "video logo overlay",
      "watermark video online",
      "add text to video"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-thumbnail",
    "title": "Video Thumbnail Extractor — Get Frame as JPG Free",
    "description": "Extract any frame from a video as a high-quality JPG image. Pick the exact timestamp (e.g. '1:30'). Perfect for YouTube thumbnails, blog covers and previews.",
    "category": "video-tools",
    "tags": [
      "video thumbnail extractor",
      "extract video frame",
      "video to image",
      "youtube thumbnail extractor",
      "extract frame from video",
      "video screenshot online",
      "video frame to jpg"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-reverser",
    "title": "Audio Reverser — Reverse MP3 Audio Online Free",
    "description": "Reverse any MP3, WAV or M4A audio file so it plays backwards. Discover hidden messages in songs, create reverse sound effects for videos and DJ remixes.",
    "category": "audio-tools",
    "tags": [
      "audio reverser",
      "reverse audio",
      "reverse mp3",
      "play audio backwards",
      "audio reverse online",
      "reverse song online",
      "reverse music free",
      "backwards audio maker"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-volume-changer",
    "title": "Audio Volume Changer — Boost or Reduce MP3 Volume",
    "description": "Boost quiet audio (up to +30 dB) or reduce loud audio (down to -30 dB) for any MP3, WAV or M4A. Fix recording-level issues for podcasts, lectures, voice notes.",
    "category": "audio-tools",
    "tags": [
      "audio volume changer",
      "increase audio volume",
      "boost mp3 volume",
      "audio booster",
      "louder mp3 maker",
      "lower audio volume",
      "audio gain online",
      "amplify audio"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-pitch-changer",
    "title": "Audio Pitch Changer — Shift Pitch in Semitones Free",
    "description": "Shift the pitch of any audio file up or down by semitones (-12 to +12) without changing duration — perfect for music transposition, vocal training and ear-training.",
    "category": "audio-tools",
    "tags": [
      "audio pitch changer",
      "pitch shifter",
      "change pitch online",
      "music transposer",
      "vocal pitch shift",
      "key changer audio",
      "pitch shift mp3",
      "pitch correction free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-converter",
    "title": "Audio Converter — MP3, WAV, M4A, FLAC, OGG, AAC, OPUS",
    "description": "Convert any audio file between MP3, WAV, M4A, FLAC, OGG Vorbis, AAC and Opus formats. Free, fast, lossless options available — works with all music files.",
    "category": "audio-tools",
    "tags": [
      "audio converter",
      "mp3 converter",
      "wav converter",
      "convert mp3 to wav",
      "convert wav to mp3",
      "m4a to mp3",
      "flac to mp3",
      "ogg converter",
      "audio format converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-trimmer",
    "title": "Audio Trimmer — Cut MP3, WAV, M4A Online Free",
    "description": "Trim and cut any audio file to a specific time range. Enter start and end timestamps (e.g. '0:30' to '1:45') to keep only the audio you need.",
    "category": "audio-tools",
    "tags": [
      "audio trimmer",
      "audio cutter",
      "cut mp3 online",
      "trim audio",
      "trim mp3",
      "audio editor online",
      "cut audio free",
      "mp3 trimmer free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-rotator",
    "title": "Video Rotator — Rotate MP4 Video Online Free",
    "description": "Rotate any MP4, MOV or WebM video by 90°, 180° or 270°, or flip horizontally / vertically. Fix sideways or upside-down videos in seconds — free, no signup.",
    "category": "video-tools",
    "tags": [
      "video rotator",
      "rotate video online",
      "rotate mp4",
      "flip video",
      "video orientation fix",
      "rotate video 90 degrees",
      "fix sideways video",
      "video rotator free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-mute",
    "title": "Video Mute — Remove Audio from Video Free",
    "description": "Remove the audio track from any MP4, MOV or WebM video and download a silent version. Perfect for sharing videos with copyrighted music or making background-only clips.",
    "category": "video-tools",
    "tags": [
      "video mute",
      "remove audio from video",
      "mute video online",
      "silent video maker",
      "video without sound",
      "strip audio from video",
      "remove sound from mp4",
      "make video silent"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-speed-changer",
    "title": "Video Speed Changer — Speed Up or Slow Down Videos",
    "description": "Change the playback speed of any video from 0.25x (super slow motion) to 4x (fast forward) while preserving audio pitch. Perfect for time-lapses, slow-mo and tutorials.",
    "category": "video-tools",
    "tags": [
      "video speed changer",
      "speed up video",
      "slow down video",
      "slow motion video",
      "fast forward video",
      "video tempo changer",
      "video playback speed",
      "time lapse maker"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-speed-changer",
    "title": "Audio Speed Changer — Speed Up or Slow Down MP3",
    "description": "Change the speed of any MP3, WAV or M4A audio (0.25x to 4x) without changing pitch — ideal for podcasts, lecture recordings, audiobooks and music practice.",
    "category": "audio-tools",
    "tags": [
      "audio speed changer",
      "speed up audio",
      "slow down audio",
      "podcast speed",
      "audio tempo changer",
      "audio playback speed",
      "mp3 speed changer",
      "audiobook speed control"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "gif-to-video",
    "title": "GIF to Video Converter — Convert GIF to MP4 Free",
    "description": "Convert any animated GIF to an MP4 video file. MP4 files are ~10x smaller than GIFs and play smoothly on all devices, social media and messaging apps.",
    "category": "video-tools",
    "tags": [
      "gif to video",
      "gif to mp4",
      "convert gif to mp4",
      "gif to video converter",
      "animated gif to mp4",
      "shrink gif file size",
      "gif to mp4 online free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-excel",
    "title": "CSV to Excel Converter — Convert CSV to XLSX Free",
    "description": "Convert any CSV file (comma, tab, semicolon or pipe separated) into a clean Microsoft Excel .xlsx workbook with auto-sized columns. Free online, no signup required.",
    "category": "productivity-tools",
    "tags": [
      "csv to excel",
      "csv to xlsx",
      "convert csv to excel",
      "csv to excel converter free",
      "csv to spreadsheet",
      "tsv to excel",
      "open csv in excel",
      "csv excel online"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "excel-to-csv",
    "title": "Excel to CSV Converter — Convert XLSX to CSV Free",
    "description": "Convert any Excel (.xlsx) file to a clean comma-separated CSV. Pick a specific sheet by name, preserve all values — perfect for data analysis, imports and SQL loads.",
    "category": "productivity-tools",
    "tags": [
      "excel to csv",
      "xlsx to csv",
      "convert excel to csv",
      "excel to csv converter free",
      "spreadsheet to csv",
      "xls to csv",
      "excel csv online",
      "extract excel sheet to csv"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "pdf-page-extractor",
    "title": "PDF Page Extractor — Extract Pages from PDF Free",
    "description": "Extract specific pages or page ranges from any PDF as a new PDF file. Use formats like '1,3-5,8' to get the exact pages you need — perfect for sharing only relevant sections.",
    "category": "pdf-tools",
    "tags": [
      "pdf page extractor",
      "extract pdf pages",
      "split pdf pages",
      "pick pages from pdf",
      "pdf page picker",
      "extract specific pages pdf",
      "pdf page selector",
      "save pdf pages free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "text-to-speech",
    "title": "Text to Speech (TTS) — Convert Text to MP3 Voice Free",
    "description": "Convert any text into natural-sounding speech audio (MP3) in 60+ languages including English, Hindi, Tamil, Telugu, Bengali. Free online text-to-speech generator — no signup.",
    "category": "audio-tools",
    "tags": [
      "text to speech",
      "tts free",
      "text to mp3",
      "text to voice",
      "text to audio",
      "voice generator",
      "speech synthesizer",
      "text to speech online",
      "hindi tts",
      "english tts",
      "natural voice generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "video-trimmer",
    "title": "Video Trimmer — Cut Video Clips Online Free",
    "description": "Trim or cut any MP4, MOV, WebM video online. Set start time and duration (or end time) and download the trimmed clip in HD quality — works on mobile and desktop.",
    "category": "video-tools",
    "tags": [
      "video trimmer",
      "video cutter",
      "trim video online",
      "cut video free",
      "mp4 trimmer",
      "video clip cutter",
      "shorten video",
      "video editor online",
      "trim mp4 online"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-compressor",
    "title": "Video Compressor — Reduce Video File Size Free",
    "description": "Compress MP4 / MOV / WebM videos online without losing too much quality. Choose high / medium / low compression — perfect for WhatsApp, Telegram and email upload limits.",
    "category": "video-tools",
    "tags": [
      "video compressor",
      "compress video online",
      "reduce video size",
      "mp4 compressor",
      "video size reducer",
      "compress mp4 free",
      "video shrink online",
      "make video smaller",
      "compress video for whatsapp"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-merger",
    "title": "Audio Merger — Join Multiple MP3 Files Online Free",
    "description": "Combine 2 to 12 audio files (MP3, WAV, M4A) into one continuous track. Perfect for creating mixtapes, podcast episodes or merging recordings — free, no signup.",
    "category": "audio-tools",
    "tags": [
      "audio merger",
      "audio joiner",
      "merge mp3",
      "join audio files",
      "combine mp3",
      "mp3 joiner online",
      "audio combiner free",
      "concatenate audio",
      "merge audio online"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "spotify-downloader",
    "title": "Spotify Downloader — Save Spotify Audio Free",
    "description": "Download Spotify podcasts, episodes and Spotify-hosted previews as MP3. Paste any open.spotify.com URL — works for public podcast episodes. (DRM-protected music tracks cannot be downloaded.)",
    "category": "video-tools",
    "tags": [
      "spotify downloader",
      "spotify to mp3",
      "spotify podcast download",
      "save spotify episode",
      "spotify mp3 free",
      "download spotify podcast",
      "open spotify downloader"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "snapchat-downloader",
    "title": "Snapchat Spotlight Downloader — Save Snapchat Videos",
    "description": "Download Snapchat Spotlight videos and public Snap stories as MP4. Paste a snapchat.com URL and save it instantly — free, no login, works on mobile.",
    "category": "video-tools",
    "tags": [
      "snapchat downloader",
      "snapchat spotlight download",
      "save snapchat video",
      "snapchat video downloader",
      "snap downloader",
      "download snapchat story",
      "snapchat saver online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "threads-downloader",
    "title": "Threads Video Downloader — Save Threads Posts Free",
    "description": "Download videos from Threads (Meta) for free. Paste a public threads.net post URL with a video and save it instantly in HD quality — no login required.",
    "category": "video-tools",
    "tags": [
      "threads downloader",
      "threads video download",
      "download threads video",
      "threads.net video saver",
      "save threads post",
      "meta threads downloader",
      "threads mp4 download"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-subtitle-downloader",
    "title": "YouTube Subtitle Downloader — Get YouTube Subtitles SRT/VTT",
    "description": "Download subtitles or auto-generated captions from any YouTube video as SRT or VTT files. Choose your language — supports 100+ languages including English, Hindi, Tamil and more.",
    "category": "video-tools",
    "tags": [
      "youtube subtitle downloader",
      "download youtube subtitles",
      "youtube srt download",
      "youtube captions download",
      "youtube vtt download",
      "auto-generated subtitles",
      "youtube cc download",
      "extract subtitles from youtube"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "video-to-gif",
    "title": "Video to GIF Converter — Make GIF from MP4 Free",
    "description": "Convert any short video clip (MP4, MOV, WebM) into a high-quality animated GIF. Choose start time, duration, width and FPS — perfect for memes, tutorials and social media.",
    "category": "image-tools",
    "tags": [
      "video to gif",
      "mp4 to gif",
      "video to gif converter",
      "make gif from video",
      "convert video to gif online",
      "video to gif free",
      "mov to gif",
      "webm to gif",
      "high quality gif maker"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp3-cutter",
    "title": "MP3 Cutter & Audio Trimmer — Cut MP3 Online Free",
    "description": "Cut, trim or shorten any MP3, WAV or M4A audio file online. Set a start time and duration (or end time) and download the trimmed clip instantly — works on mobile too.",
    "category": "audio-tools",
    "tags": [
      "mp3 cutter",
      "audio trimmer",
      "trim mp3",
      "cut mp3 online",
      "audio cutter free",
      "mp3 trim online",
      "ringtone maker mp3",
      "shorten audio file",
      "cut wav online"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "tiktok-downloader",
    "title": "TikTok Video Downloader — Download TikTok Videos Free",
    "description": "Download TikTok videos without watermark online free. Paste any TikTok video URL and download in HD quality instantly — no app, no login required.",
    "category": "video-tools",
    "tags": [
      "tiktok downloader",
      "download tiktok video",
      "tiktok video downloader no watermark",
      "save tiktok video",
      "tiktok video download free",
      "tiktok downloader online",
      "download tiktok without watermark",
      "tiktok video saver"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "twitter-video-downloader",
    "title": "Twitter / X Video Downloader — Download Twitter Videos Free",
    "description": "Download videos from Twitter (now X) for free. Paste any tweet URL with a video and download instantly in HD quality — no signup, works on mobile too.",
    "category": "video-tools",
    "tags": [
      "twitter video downloader",
      "download twitter video",
      "x video downloader",
      "tweet video download",
      "twitter video save",
      "download video from twitter free",
      "twitter downloader online",
      "x.com video download"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "facebook-video-downloader",
    "title": "Facebook Video Downloader — Download FB Videos Free",
    "description": "Download Facebook videos online free. Paste any Facebook video URL or fb.watch link and save it to your device instantly — no login, works on all devices.",
    "category": "video-tools",
    "tags": [
      "facebook video downloader",
      "download facebook video",
      "fb video downloader",
      "save facebook video",
      "fb video download free",
      "facebook video saver",
      "download fb video online",
      "fb.watch downloader"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "vimeo-downloader",
    "title": "Vimeo Video Downloader — Download Vimeo Videos Free",
    "description": "Download Vimeo videos online free in HD quality. Paste any Vimeo video URL and save it instantly — no watermark, no signup required.",
    "category": "video-tools",
    "tags": [
      "vimeo downloader",
      "download vimeo video",
      "vimeo video download free",
      "save vimeo video",
      "vimeo video saver",
      "vimeo downloader online",
      "vimeo download hd"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "dailymotion-downloader",
    "title": "Dailymotion Video Downloader — Download Dailymotion Videos",
    "description": "Download Dailymotion videos free and fast. Paste any Dailymotion video URL and save to your device instantly in best available quality.",
    "category": "video-tools",
    "tags": [
      "dailymotion downloader",
      "download dailymotion video",
      "dailymotion video download free",
      "save dailymotion video",
      "dailymotion downloader online",
      "dai.ly downloader"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-playlist-downloader",
    "title": "YouTube Playlist Downloader — Download YouTube Playlist Free",
    "description": "Download YouTube playlists as MP4 videos in a ZIP file. Paste the playlist URL, choose how many videos (up to 10), and download them all at once for free.",
    "category": "video-tools",
    "tags": [
      "youtube playlist downloader",
      "download youtube playlist",
      "playlist downloader free",
      "youtube playlist to mp4",
      "download multiple youtube videos",
      "youtube playlist download online",
      "batch youtube downloader",
      "yt playlist downloader"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-to-mp4",
    "title": "YouTube to MP4 — Download YouTube Video as MP4",
    "description": "Convert and download any YouTube video as MP4 file in HD quality. Choose from 360p, 480p, 720p, or 1080p. Free YouTube to MP4 converter online.",
    "category": "video-tools",
    "tags": [
      "youtube to mp4",
      "youtube mp4 converter",
      "download youtube as mp4",
      "convert youtube to mp4",
      "youtube mp4 download free",
      "save youtube as mp4",
      "youtube mp4 720p",
      "yt to mp4"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-shorts-downloader",
    "title": "YouTube Shorts Downloader — Download YouTube Shorts Free",
    "description": "Download YouTube Shorts videos in HD quality. Paste any YouTube Shorts URL and save it instantly — free, no watermark, no app required.",
    "category": "video-tools",
    "tags": [
      "youtube shorts downloader",
      "download youtube shorts",
      "youtube shorts video download",
      "save youtube shorts",
      "yt shorts downloader free",
      "youtube shorts saver",
      "download shorts video"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "audio-extractor",
    "title": "Audio Extractor — Extract Audio from Any Video URL",
    "description": "Extract and download audio as MP3 from any video URL — YouTube, Instagram, Twitter, TikTok, Vimeo, and 1000+ sites. Free online audio extractor.",
    "category": "video-tools",
    "tags": [
      "audio extractor",
      "extract audio from video",
      "video to audio converter",
      "extract mp3 from video",
      "audio extractor online free",
      "video to mp3",
      "download audio from video url",
      "audio from youtube"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-audio-downloader",
    "title": "YouTube Audio Downloader — Download YouTube as MP3 Free",
    "description": "Download and save YouTube video audio as high-quality MP3. Just paste the YouTube URL to extract and save the audio track — completely free.",
    "category": "video-tools",
    "tags": [
      "youtube audio downloader",
      "download youtube audio",
      "youtube mp3 downloader",
      "save youtube as mp3",
      "youtube audio to mp3",
      "youtube audio extractor free",
      "download audio youtube",
      "yt audio download"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "instagram-reel-downloader",
    "title": "Instagram Reel Downloader — Download Instagram Reels HD",
    "description": "Download Instagram Reels in HD quality — no watermark, completely free. Just paste the Reel URL and download instantly without any app.",
    "category": "video-tools",
    "tags": [
      "instagram reel downloader",
      "download instagram reels",
      "instagram reels video downloader",
      "save instagram reels",
      "reel downloader free",
      "ig reels download",
      "instagram reels saver"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "rumble-downloader",
    "title": "Rumble Video Downloader — Download Rumble Videos Free",
    "description": "Download videos from Rumble.com as MP4. Paste the Rumble video URL and save it for offline viewing.",
    "category": "video-tools",
    "tags": [
      "rumble downloader",
      "rumble video downloader",
      "download rumble video",
      "save rumble video",
      "rumble mp4 download"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "twitch-clip-downloader",
    "title": "Twitch Clip Downloader — Save Twitch Highlights",
    "description": "Save Twitch gaming clips and highlights as MP4 video files. Works for all Twitch clips, moments, and channel highlights.",
    "category": "video-tools",
    "tags": [
      "twitch clip downloader",
      "twitch highlights download",
      "gaming clip downloader",
      "twitch video saver"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bilibili-downloader",
    "title": "Bilibili Video Downloader — Download Bilibili Videos Free",
    "description": "Download Bilibili (B站) videos as MP4 without watermark. Paste the BV or AV number URL and download instantly.",
    "category": "video-tools",
    "tags": [
      "bilibili downloader",
      "bilibili video downloader",
      "download bilibili video",
      "b站视频下载",
      "bilibili mp4 download",
      "bilibili video saver"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pinterest-downloader",
    "title": "Pinterest Video Downloader — Download Pinterest Videos & GIFs Free",
    "description": "Download Pinterest videos and animated GIFs without watermark. Paste the Pinterest pin URL and download HD video instantly. Free, no login required.",
    "category": "video-tools",
    "tags": [
      "pinterest downloader",
      "download pinterest video",
      "pinterest video downloader free",
      "pinterest gif downloader",
      "save pinterest video online",
      "pinterest downloader without watermark",
      "ishu tools video downloader"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "reddit-video-downloader",
    "title": "Reddit Video Downloader — Save Reddit Posts as MP4",
    "description": "Save Reddit video posts as MP4 files with audio. Works with v.redd.it links, gfycat, streamable, and all Reddit-hosted videos.",
    "category": "video-tools",
    "tags": [
      "reddit video downloader",
      "vredd.it downloader",
      "reddit mp4 download",
      "reddit video saver",
      "download reddit post"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "linkedin-video-downloader",
    "title": "LinkedIn Video Downloader — Download LinkedIn Videos Free",
    "description": "Download videos from LinkedIn posts. Paste the LinkedIn post URL and save the video as MP4. Free LinkedIn video downloader.",
    "category": "video-tools",
    "tags": [
      "linkedin video downloader",
      "download linkedin video",
      "linkedin post video download",
      "save linkedin video",
      "linkedin video saver online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "stream-downloader",
    "title": "Universal Video Stream Downloader — Download Any Video URL",
    "description": "Download videos from virtually any website — supports 1000+ video platforms. Paste any video URL to fetch and download it.",
    "category": "video-tools",
    "tags": [
      "video downloader",
      "universal video downloader",
      "download any video",
      "stream downloader online",
      "video url downloader",
      "online video downloader free",
      "any website video download"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "video-thumbnail-downloader",
    "title": "Video Thumbnail Downloader — Download YouTube & Video Thumbnails",
    "description": "Download thumbnail images from YouTube, Vimeo, and other video platforms in full resolution. Free online thumbnail downloader.",
    "category": "video-tools",
    "tags": [
      "video thumbnail downloader",
      "youtube thumbnail downloader",
      "download youtube thumbnail",
      "thumbnail grabber",
      "youtube thumbnail download hd free"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "element-lookup",
    "title": "Periodic Table Element Lookup — Search Chemical Elements",
    "description": "Look up any chemical element from the periodic table by symbol or name. Get atomic number, atomic mass, category, and more — free online periodic table.",
    "category": "science-tools",
    "tags": [
      "periodic table",
      "element lookup",
      "chemical element search",
      "atomic number",
      "atomic mass",
      "chemistry tools online",
      "element properties",
      "chemistry element finder"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "molecular-weight",
    "title": "Molecular Weight Calculator — Calculate Molar Mass Online",
    "description": "Calculate the molecular weight / molar mass of any chemical compound. Enter a molecular formula (H2O, C6H12O6, NaCl) to get the exact molar mass.",
    "category": "science-tools",
    "tags": [
      "molecular weight calculator",
      "molar mass calculator",
      "molecular formula calculator",
      "chemical formula molar mass",
      "molar mass of compounds",
      "chemistry molecular weight"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "physics-calculator",
    "title": "Physics Calculator — Kinetic Energy, Force, Ohm's Law & More",
    "description": "Calculate common physics equations: kinetic energy (KE=½mv²), potential energy (PE=mgh), Newton's second law (F=ma), velocity, and Ohm's law — free online physics tool.",
    "category": "science-tools",
    "tags": [
      "physics calculator",
      "kinetic energy calculator",
      "potential energy calculator",
      "force calculator",
      "ohms law calculator",
      "physics equations calculator online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "country-info",
    "title": "Country Information — Facts, Capital, Currency & Population",
    "description": "Get detailed information about any country: capital city, population, currency, language, area, calling code, and continent — free country facts database.",
    "category": "geography-tools",
    "tags": [
      "country information",
      "country facts",
      "country capital currency",
      "country population",
      "country info lookup",
      "world countries database"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "timezone-info",
    "title": "Timezone Information — World Timezones & UTC Offsets",
    "description": "Get information about world timezones — UTC offsets, major cities, country codes. Look up IST, EST, PST, GMT, JST, CST and more.",
    "category": "geography-tools",
    "tags": [
      "timezone information",
      "world timezone",
      "UTC offset lookup",
      "IST timezone",
      "timezone converter",
      "time zones of the world"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "distance-calculator",
    "title": "Distance Calculator — Calculate Distance Between Coordinates",
    "description": "Calculate the great-circle (straight-line) distance between two geographic coordinates (latitude/longitude) in kilometers and miles — free online.",
    "category": "geography-tools",
    "tags": [
      "distance calculator",
      "distance between coordinates",
      "haversine distance",
      "latitude longitude distance",
      "coordinate distance calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "recipe-scaler",
    "title": "Recipe Scaler — Scale Recipe Servings Up or Down",
    "description": "Scale any recipe up or down by changing the number of servings. Automatically adjusts all ingredient quantities with the correct proportions.",
    "category": "cooking-tools",
    "tags": [
      "recipe scaler",
      "scale recipe servings",
      "recipe calculator",
      "resize recipe",
      "cooking recipe converter",
      "ingredient quantity scaler"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cooking-measurement-converter",
    "title": "Cooking Measurement Converter — Convert Cups, Grams, ML & More",
    "description": "Convert cooking measurements: cups to grams, tablespoons to ml, oz to grams, liters to cups — all cooking units in one free online converter.",
    "category": "cooking-tools",
    "tags": [
      "cooking measurement converter",
      "cups to grams",
      "cooking units converter",
      "tbsp to ml",
      "oz to grams cooking",
      "recipe measurement converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "food-calorie-lookup",
    "title": "Food Calorie Lookup — Indian & Global Food Nutrition Database",
    "description": "Look up calories and nutrition info for Indian and global foods — rice, roti, dal, chicken, eggs, fruits, and more. Free food nutrition database.",
    "category": "cooking-tools",
    "tags": [
      "food calorie lookup",
      "food nutrition database",
      "calorie counter food",
      "Indian food calories",
      "food calories chart",
      "nutrition info lookup"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gpa-cgpa-calculator",
    "title": "GPA / CGPA Calculator — Indian University Grade Calculator",
    "description": "Calculate your GPA or CGPA by entering subject-wise grades and credit hours. Supports 10-point and 4-point scales. Percentage conversion included.",
    "category": "student-tools",
    "tags": [
      "CGPA calculator",
      "GPA calculator India",
      "grade point average",
      "SGPA CGPA calculator",
      "CGPA to percentage",
      "semester GPA calculator",
      "university grade calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "daily-calorie-needs",
    "title": "Daily Calorie Needs Calculator — TDEE & BMR Calculator",
    "description": "Calculate your Total Daily Energy Expenditure (TDEE) and Basal Metabolic Rate (BMR) using the Mifflin-St Jeor formula. Get personalized calorie goals for weight loss, maintenance, or gain.",
    "category": "health-tools",
    "tags": [
      "TDEE calculator",
      "daily calorie calculator",
      "BMR calculator",
      "calorie needs calculator",
      "how many calories should I eat",
      "calorie intake calculator",
      "TDEE BMR online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ideal-weight",
    "title": "Ideal Weight Calculator — Calculate Your Ideal Body Weight",
    "description": "Calculate your ideal body weight using three scientific formulas (Robinson, Miller, Devine) based on your height and gender. Includes healthy weight range.",
    "category": "health-tools",
    "tags": [
      "ideal weight calculator",
      "healthy weight calculator",
      "ideal body weight formula",
      "ideal weight for height",
      "normal weight calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "meeting-cost-calculator",
    "title": "Meeting Cost Calculator — How Much Does Your Meeting Cost?",
    "description": "Calculate the real cost of a meeting based on number of attendees, duration, and average hourly salary. Helps teams value their time.",
    "category": "productivity",
    "tags": [
      "meeting cost calculator",
      "meeting cost",
      "how much does a meeting cost",
      "meeting time calculator",
      "business meeting cost"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-readability",
    "title": "Text Readability Analyzer — Flesch-Kincaid Grade Level",
    "description": "Analyze readability of any text with Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog, and reading time. Free readability checker.",
    "category": "student-tools",
    "tags": [
      "readability analyzer",
      "flesch kincaid",
      "text readability score",
      "reading grade level",
      "flesch reading ease",
      "readability checker online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "days-between-dates",
    "title": "Days Between Dates Calculator — Count Days Between Two Dates",
    "description": "Calculate exact days, weeks, and months between any two dates. Shows business days, total hours, and approximate months difference.",
    "category": "utility",
    "tags": [
      "days between dates",
      "date difference calculator",
      "count days",
      "how many days between",
      "date calculator",
      "days to date"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "age-calculator-detailed",
    "title": "Detailed Age Calculator — Exact Age in Years, Months & Days",
    "description": "Calculate your exact age down to years, months, days, hours, and minutes. Find days to next birthday, zodiac sign, and birth weekday.",
    "category": "utility",
    "tags": [
      "age calculator",
      "exact age",
      "age in years months days",
      "birthday calculator",
      "how old am I",
      "detailed age calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "prime-checker",
    "title": "Prime Number Checker — Check if a Number is Prime",
    "description": "Check if any number is prime or composite. Get the list of factors and the next 5 prime numbers. Fast online prime checker.",
    "category": "math-tools",
    "tags": [
      "prime number checker",
      "is number prime",
      "prime or composite",
      "prime number calculator",
      "check prime online",
      "prime factors"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "base64-tool",
    "title": "Base64 Encoder & Decoder — Encode/Decode Base64 Free",
    "description": "Encode text to Base64 or decode Base64 to plain text instantly. Also supports URL-safe Base64 encoding. Free online Base64 tool.",
    "category": "developer-tools",
    "tags": [
      "base64 encoder",
      "base64 decoder",
      "base64 online",
      "encode base64",
      "decode base64",
      "base64 converter online free"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "random-password-generator",
    "title": "Password Generator — Generate Strong Random Passwords",
    "description": "Generate cryptographically strong random passwords with custom length and character sets. Generate up to 20 unique passwords at once.",
    "category": "security-tools",
    "tags": [
      "password generator",
      "strong password generator",
      "random password creator",
      "secure password generator",
      "password generator online free",
      "complex password generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "reddit-downloader",
    "title": "Reddit Video Downloader — Download Reddit Videos Free",
    "description": "Download videos from Reddit posts in HD quality. Paste any Reddit post URL and download MP4 video with audio merged. No login needed.",
    "category": "video-tools",
    "tags": [
      "reddit video downloader",
      "download reddit video",
      "reddit downloader",
      "save reddit video online",
      "reddit mp4 downloader",
      "reddit video with audio",
      "ishu tools reddit"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "twitch-downloader",
    "title": "Twitch Clip Downloader — Download Twitch Clips & VODs Free",
    "description": "Download Twitch clips and VOD highlights as MP4. Paste any Twitch clip URL and save the video. Free Twitch clip downloader online.",
    "category": "video-tools",
    "tags": [
      "twitch clip downloader",
      "download twitch clip",
      "twitch video downloader",
      "save twitch clip",
      "twitch vod downloader",
      "twitch downloader online free"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "soundcloud-downloader",
    "title": "SoundCloud Downloader — Download SoundCloud Tracks as MP3",
    "description": "Download SoundCloud tracks and playlists as high-quality MP3 (320kbps). Paste the SoundCloud URL and download music free.",
    "category": "video-tools",
    "tags": [
      "soundcloud downloader",
      "download soundcloud",
      "soundcloud to mp3",
      "soundcloud music download",
      "save soundcloud track",
      "soundcloud mp3 free",
      "soundcloud downloader online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mixcloud-downloader",
    "title": "Mixcloud Downloader — Download Mixcloud Mixes Free",
    "description": "Download DJ mixes and podcasts from Mixcloud as audio files. Paste the Mixcloud URL and save the mix offline.",
    "category": "video-tools",
    "tags": [
      "mixcloud downloader",
      "download mixcloud mix",
      "mixcloud audio download",
      "save mixcloud dj set",
      "mixcloud offline"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bandcamp-downloader",
    "title": "Bandcamp Downloader — Download Bandcamp Tracks Free",
    "description": "Download free Bandcamp tracks as MP3 audio. Paste the Bandcamp track URL and save music for offline listening.",
    "category": "video-tools",
    "tags": [
      "bandcamp downloader",
      "download bandcamp track",
      "bandcamp mp3 download",
      "save bandcamp music",
      "bandcamp audio downloader"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "odysee-downloader",
    "title": "Odysee/LBRY Video Downloader — Download Odysee Videos",
    "description": "Download videos from Odysee (formerly LBRY) as MP4. Free decentralized video platform downloader.",
    "category": "video-tools",
    "tags": [
      "odysee downloader",
      "lbry downloader",
      "download odysee video",
      "odysee mp4 download",
      "lbry video downloader"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "streamable-downloader",
    "title": "Streamable Video Downloader — Download Streamable Videos",
    "description": "Download videos from Streamable.com as MP4. Paste the Streamable URL and save the video instantly.",
    "category": "video-tools",
    "tags": [
      "streamable downloader",
      "download streamable video",
      "streamable mp4 download",
      "save streamable video"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kick-downloader",
    "title": "Kick.com Clip Downloader — Download Kick Clips Free",
    "description": "Download clips and highlights from Kick.com streaming platform. Free Kick downloader for gaming and live stream clips.",
    "category": "video-tools",
    "tags": [
      "kick downloader",
      "kick.com downloader",
      "download kick clip",
      "kick stream downloader",
      "kick video saver"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "imgur-downloader",
    "title": "Imgur Downloader — Download Imgur Videos & GIFs",
    "description": "Download videos and GIFs from Imgur. Paste the Imgur URL and save the content as MP4 or GIF.",
    "category": "video-tools",
    "tags": [
      "imgur downloader",
      "download imgur video",
      "imgur gif downloader",
      "save imgur content",
      "imgur mp4 download"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "universal-playlist-downloader",
    "title": "Universal Playlist Downloader — Download Any Playlist",
    "description": "Download entire playlists from YouTube, SoundCloud, Spotify (previews), and more as a ZIP file. Supports up to 10 videos per download.",
    "category": "video-tools",
    "tags": [
      "playlist downloader",
      "youtube playlist downloader",
      "download entire playlist",
      "batch video downloader",
      "playlist to zip",
      "soundcloud playlist download"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "m3u8-downloader",
    "title": "M3U8 / HLS Stream Downloader — Save Live Streams",
    "description": "Download HLS/M3U8 video streams as MP4. Paste the M3U8 URL to save live streams and online video content.",
    "category": "video-tools",
    "tags": [
      "m3u8 downloader",
      "hls downloader",
      "download m3u8 stream",
      "live stream downloader",
      "m3u8 to mp4",
      "hls stream saver"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-thumbnail-downloader",
    "title": "YouTube Thumbnail Downloader — Save YouTube Thumbnails HD",
    "description": "Download YouTube video thumbnails in maximum resolution (1280x720), HQ (480x360), MQ, and SD quality. Free YouTube thumbnail saver.",
    "category": "video-tools",
    "tags": [
      "youtube thumbnail downloader",
      "download youtube thumbnail",
      "youtube thumbnail HD",
      "save youtube thumbnail",
      "youtube thumbnail grabber",
      "youtube thumbnail 1080p"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "video-info",
    "title": "Video Info Extractor — Get Video Metadata from any URL",
    "description": "Extract detailed metadata from any video URL: title, uploader, duration, views, formats, upload date, thumbnail. Works for 1000+ platforms.",
    "category": "video-tools",
    "tags": [
      "video info",
      "video metadata extractor",
      "get video details",
      "youtube video info",
      "video metadata checker online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-diff",
    "title": "Text Diff — Compare Two Text Files Side by Side",
    "description": "Find differences between two text blocks with unified diff output. See additions, deletions, and similarity percentage. Free online text comparison.",
    "category": "text-ops",
    "tags": [
      "text diff",
      "compare text online",
      "text difference",
      "file comparison tool",
      "diff checker",
      "text similarity checker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-diff",
    "title": "JSON Diff — Compare Two JSON Objects",
    "description": "Compare two JSON objects and see exactly what changed: added keys, removed keys, and modified values. Free online JSON diff tool.",
    "category": "developer-tools",
    "tags": [
      "json diff",
      "compare json",
      "json difference checker",
      "json compare online",
      "json object diff",
      "json changes viewer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "yaml-formatter",
    "title": "YAML Formatter & Validator — Format and Validate YAML",
    "description": "Format, beautify, and validate YAML files online. Fix indentation and structure errors in YAML configuration files.",
    "category": "developer-tools",
    "tags": [
      "yaml formatter",
      "yaml validator",
      "format yaml online",
      "yaml beautifier",
      "yaml linter",
      "yaml syntax checker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ip-subnet-calculator",
    "title": "IP Subnet Calculator — CIDR Network Calculator",
    "description": "Calculate subnet details from CIDR notation: network address, broadcast, usable hosts, subnet mask, wildcard mask. Supports IPv4 and IPv6.",
    "category": "network-tools",
    "tags": [
      "subnet calculator",
      "cidr calculator",
      "ip subnet calculator",
      "network address calculator",
      "subnet mask calculator",
      "cidr to subnet mask",
      "network calculator online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "http-headers-checker",
    "title": "HTTP Headers Checker — View Response Headers & Security",
    "description": "Check HTTP response headers for any website. View security headers (HSTS, CSP, X-Frame-Options), server info, and caching headers.",
    "category": "network-tools",
    "tags": [
      "http headers checker",
      "response headers viewer",
      "security headers check",
      "http header analyzer",
      "website headers",
      "csp checker",
      "hsts checker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "port-checker",
    "title": "Port Checker — Check if Port is Open or Closed",
    "description": "Check if a TCP port is open or closed on any host. Tests common ports: 80 (HTTP), 443 (HTTPS), 22 (SSH), 3306 (MySQL), and custom ports.",
    "category": "network-tools",
    "tags": [
      "port checker",
      "check if port is open",
      "port scanner",
      "open port checker",
      "tcp port test",
      "port status checker online free"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hash-generator-advanced",
    "title": "Hash Generator — MD5, SHA1, SHA256, SHA512 & More",
    "description": "Generate cryptographic hashes in all algorithms: MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA3-256, SHA3-512, BLAKE2b. Free hash generator.",
    "category": "security-tools",
    "tags": [
      "hash generator",
      "md5 generator",
      "sha256 generator",
      "sha512 hash",
      "sha1 generator",
      "hash calculator online",
      "cryptographic hash generator",
      "blake2 hash"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hmac-generator",
    "title": "HMAC Generator — Generate HMAC-SHA256 & Other HMACs",
    "description": "Generate HMAC (Hash-based Message Authentication Code) using SHA-256, SHA-512, SHA-1, or MD5. Returns hex and Base64 encoded values.",
    "category": "security-tools",
    "tags": [
      "hmac generator",
      "hmac sha256",
      "hmac calculator",
      "hmac-sha256 online",
      "message authentication code generator",
      "hmac tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "uuid-v5-generator",
    "title": "UUID v5 Generator — Deterministic UUID from Name + Namespace",
    "description": "Generate UUID version 5 (SHA-1 based, deterministic) from a name and namespace. Same input always produces the same UUID. Free UUID v5 generator.",
    "category": "developer-tools",
    "tags": [
      "uuid v5 generator",
      "deterministic uuid",
      "uuid from name",
      "uuid5 generator",
      "name based uuid",
      "uuid v5 online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "nanoid-generator",
    "title": "NanoID Generator — Generate Unique IDs for URLs",
    "description": "Generate NanoIDs — compact, URL-safe unique identifiers. Customize size, character alphabet, and count. Great alternative to UUID for URLs.",
    "category": "developer-tools",
    "tags": [
      "nanoid generator",
      "generate nanoid",
      "short unique id",
      "url safe id generator",
      "nanoid online",
      "compact uid generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cuid-generator",
    "title": "CUID Generator — Collision-Resistant Unique IDs",
    "description": "Generate CUIDs (Collision-resistant Unique Identifiers) — time-based, sortable, URL-safe IDs. Perfect for database primary keys.",
    "category": "developer-tools",
    "tags": [
      "cuid generator",
      "generate cuid",
      "collision resistant id",
      "database id generator",
      "sortable unique id"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "css-unit-converter",
    "title": "CSS Unit Converter — px to rem, em, pt, vw & More",
    "description": "Convert between all CSS units: px, rem, em, pt, pc, cm, mm, in, vw, vh, vmin, vmax. Set custom base font size and viewport dimensions.",
    "category": "developer-tools",
    "tags": [
      "css unit converter",
      "px to rem",
      "rem to px",
      "em to px",
      "css units conversion",
      "pixels to rem converter",
      "css px rem em calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mac-address-lookup",
    "title": "MAC Address Lookup — Find Device Manufacturer",
    "description": "Look up any MAC address to find the hardware manufacturer (vendor). Identifies network device maker from the OUI prefix.",
    "category": "network-tools",
    "tags": [
      "mac address lookup",
      "mac address vendor",
      "oui lookup",
      "network device manufacturer",
      "mac address finder",
      "who makes this device"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ai-headline-generator",
    "title": "AI Headline Generator — Blog, Article & Ad Headlines",
    "description": "Generate catchy, click-worthy headlines for blog posts, articles, ads, and social media. Choose from listicle, how-to, question, or controversial styles.",
    "category": "ai-writing",
    "tags": [
      "headline generator",
      "blog title generator",
      "catchy headlines",
      "ai headline",
      "click-worthy title",
      "article headline ideas"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "blog-outline-generator",
    "title": "Blog Outline Generator — Blog Post Structure Builder",
    "description": "Generate a detailed blog post outline with headlines, sections, SEO keywords, and meta description for any topic. Content creators and bloggers tool.",
    "category": "writing-tools",
    "tags": [
      "blog outline generator",
      "blog post outline",
      "blog structure",
      "content outline",
      "article outline",
      "blog writing",
      "content plan",
      "blog seo tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "email-subject-generator",
    "title": "Email Subject Line Generator — High Open Rate Subjects",
    "description": "Generate compelling email subject lines for newsletters, promotions, and drip campaigns. Includes A/B test variants and open rate tips.",
    "category": "ai-writing",
    "tags": [
      "email subject generator",
      "email subject line",
      "newsletter subject",
      "high open rate email",
      "catchy email subject",
      "email marketing copy"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "product-description-generator",
    "title": "Product Description Generator — eCommerce Copy",
    "description": "Generate professional product descriptions for eCommerce, Amazon, Flipkart, and Shopify. Multiple tones: professional, casual, luxury, technical.",
    "category": "ai-writing",
    "tags": [
      "product description generator",
      "ecommerce copy",
      "amazon product description",
      "shopify description",
      "product copywriting",
      "product title generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "social-caption-generator",
    "title": "Social Media Caption Generator — Instagram, LinkedIn, Twitter",
    "description": "Generate engaging social media captions with hashtags for Instagram, LinkedIn, Twitter, and Facebook. Multiple tones and best posting time included.",
    "category": "ai-writing",
    "tags": [
      "instagram caption generator",
      "social media caption",
      "linkedin post generator",
      "twitter caption",
      "social media copy",
      "hashtag generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "crypto-profit-calculator",
    "title": "Crypto Profit Calculator — Bitcoin & Altcoin P&L",
    "description": "Calculate cryptocurrency profit or loss. Supports any coin, includes Indian tax calculation (30% flat + 1% TDS), break-even price, and buy/sell analysis.",
    "category": "crypto-web3",
    "tags": [
      "crypto profit calculator",
      "bitcoin profit loss",
      "crypto gains calculator",
      "cryptocurrency profit",
      "crypto p&l",
      "india crypto tax calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "eth-gas-calculator",
    "title": "Ethereum Gas Fee Calculator — ETH Transaction Cost",
    "description": "Calculate Ethereum gas fees in ETH, USD, and INR. Includes fee breakdown for ETH transfers, ERC-20 tokens, Uniswap swaps, and NFT minting.",
    "category": "crypto-web3",
    "tags": [
      "ethereum gas calculator",
      "eth gas fee",
      "gas price calculator",
      "ethereum transaction cost",
      "gwei to usd",
      "nft gas fee"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "crypto-dca-calculator",
    "title": "Crypto DCA Calculator — Dollar Cost Averaging",
    "description": "Simulate Dollar Cost Averaging (DCA) for any cryptocurrency. Compare DCA vs lump-sum investing with weekly/monthly investment simulations.",
    "category": "crypto-web3",
    "tags": [
      "crypto dca calculator",
      "bitcoin dca",
      "dollar cost averaging crypto",
      "sip crypto",
      "crypto investment calculator",
      "dca vs lump sum"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "nft-royalty-calculator",
    "title": "NFT Royalty Calculator — Creator Earnings",
    "description": "Calculate NFT royalty earnings in ETH, USD, and INR. Includes platform fee breakdown for OpenSea, Foundation, Blur, and Rarible.",
    "category": "crypto-web3",
    "tags": [
      "nft royalty calculator",
      "nft creator earnings",
      "opensea royalty",
      "nft profit",
      "nft income calculator",
      "web3 royalty"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hash-rate-calculator",
    "title": "Bitcoin Mining Profitability Calculator — Hash Rate",
    "description": "Calculate Bitcoin mining profitability based on hash rate, electricity cost, and BTC price. Supports H/s to EH/s units. Shows daily and monthly profits.",
    "category": "crypto-web3",
    "tags": [
      "mining profitability calculator",
      "bitcoin mining calculator",
      "hash rate calculator",
      "mining profit",
      "btc mining",
      "asic profitability"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "notice-period-calculator",
    "title": "Notice Period Calculator — Last Working Day Finder",
    "description": "Calculate your last working day based on notice period. Includes resignation checklist, document list, PF transfer guide, and business days count.",
    "category": "hr-jobs",
    "tags": [
      "notice period calculator",
      "last working day calculator",
      "resignation date calculator",
      "notice period end date",
      "when can I join new company"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "job-offer-comparator",
    "title": "Job Offer Comparator — Compare Two Job Offers",
    "description": "Compare two job offers side-by-side: CTC, work mode, growth rate, 5-year projection, and overall recommendation. Make the best career decision.",
    "category": "hr-jobs",
    "tags": [
      "job offer comparison",
      "compare job offers",
      "which job to choose",
      "job offer calculator",
      "ctc comparison",
      "career decision tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "interview-question-generator",
    "title": "Interview Question Generator — Role-Specific Q&A",
    "description": "Generate role-specific interview questions for any job level (junior/mid/senior). Covers behavioral, technical, and situational categories with STAR tips.",
    "category": "hr-jobs",
    "tags": [
      "interview question generator",
      "interview prep",
      "behavioral interview questions",
      "technical interview questions",
      "star method",
      "job interview questions"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "resignation-letter-generator",
    "title": "Resignation Letter Generator — Professional Template",
    "description": "Generate a professional resignation letter in seconds. Includes proper notice period, graceful tone, and post-resignation checklist for India.",
    "category": "hr-jobs",
    "tags": [
      "resignation letter generator",
      "resignation letter format",
      "how to write resignation",
      "resignation letter india",
      "formal resignation",
      "notice period letter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "salary-negotiation-helper",
    "title": "Salary Negotiation Script Generator — Counter Offer",
    "description": "Generate a personalized salary negotiation script with the right strategy based on the gap between offer and expectation. With do's, don'ts, and India market tips.",
    "category": "hr-jobs",
    "tags": [
      "salary negotiation",
      "how to negotiate salary",
      "counter offer letter",
      "salary negotiation script",
      "salary negotiation tips india",
      "negotiate job offer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "nda-generator",
    "title": "NDA Generator — Non-Disclosure Agreement Template",
    "description": "Generate a professional Non-Disclosure Agreement (NDA) template. Includes mutual confidentiality terms, duration, governing law (India), and exclusions.",
    "category": "legal-tools",
    "tags": [
      "nda generator",
      "non disclosure agreement",
      "confidentiality agreement",
      "nda template india",
      "free nda",
      "nda format"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "freelance-contract-generator",
    "title": "Freelance Contract Generator — Service Agreement",
    "description": "Generate a professional freelance service agreement with payment terms, scope, IP ownership, and termination clauses. Perfect for Indian freelancers.",
    "category": "legal-tools",
    "tags": [
      "freelance contract",
      "service agreement template",
      "freelancer contract india",
      "payment terms contract",
      "freelance agreement format",
      "client contract generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "privacy-policy-generator",
    "title": "Privacy Policy Generator — Website Privacy Policy",
    "description": "Generate a complete privacy policy for your website or app. Covers data collection, usage, cookies, user rights, and GDPR/IT Act compliance notes.",
    "category": "legal-tools",
    "tags": [
      "privacy policy generator",
      "website privacy policy",
      "gdpr privacy policy",
      "free privacy policy",
      "privacy policy template india",
      "app privacy policy"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "travel-cost-estimator",
    "title": "Travel Cost Estimator — Trip Budget Calculator India",
    "description": "Estimate total travel cost for any Indian destination. Includes flight, hotel, food, local transport, and activities breakdown per person and per day.",
    "category": "travel-tools",
    "tags": [
      "travel cost estimator",
      "trip budget calculator india",
      "travel budget planner",
      "goa trip cost",
      "india travel calculator",
      "vacation budget"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "visa-checklist-generator",
    "title": "Visa Checklist Generator — Documents for Any Country",
    "description": "Generate a complete visa document checklist for Indian passport holders traveling to USA, UK, Schengen, Australia, and more. Includes country-specific requirements.",
    "category": "travel-tools",
    "tags": [
      "visa checklist",
      "visa documents required",
      "us visa checklist india",
      "schengen visa checklist",
      "visa requirements india",
      "tourist visa documents"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "currency-travel-calculator",
    "title": "Currency Converter Travel — Live Rates & Forex Tips",
    "description": "Convert currencies for travel with bank markup rates. Shows equivalent rates for popular currencies, best money transfer apps, and forex tips for India.",
    "category": "travel-tools",
    "tags": [
      "currency converter travel",
      "forex calculator india",
      "travel money calculator",
      "inr to usd",
      "foreign exchange calculator",
      "best exchange rate"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "packing-list-generator",
    "title": "Packing List Generator — Travel Checklist",
    "description": "Generate a personalized packing list for any trip. Customized by destination, climate, duration, and trip type (trek, business, beach, leisure).",
    "category": "travel-tools",
    "tags": [
      "packing list generator",
      "travel checklist",
      "what to pack",
      "trip packing list",
      "travel packing",
      "packing list india"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "api-response-generator",
    "title": "API Response Mock Generator — REST API Response",
    "description": "Generate realistic mock API responses for any resource (GET/POST/PUT/DELETE). Includes pagination, error responses, headers, and HTTP status codes.",
    "category": "developer-tools",
    "tags": [
      "api response generator",
      "mock api response",
      "rest api mock",
      "api testing",
      "json response mock",
      "http response generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sql-query-builder",
    "title": "SQL Query Builder — SELECT, INSERT, UPDATE, DELETE",
    "description": "Build SQL queries visually: SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, and indexes. Includes parameterized queries and performance tips.",
    "category": "developer-tools",
    "tags": [
      "sql query builder",
      "sql generator",
      "select query builder",
      "sql insert generator",
      "create table sql",
      "sql query generator online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gitignore-generator",
    "title": ".gitignore Generator — Node, Python, React, Flutter",
    "description": "Generate .gitignore files for Node.js, Python, React, Django, Java, Flutter, Go, and Rust. Copy-paste ready for your project.",
    "category": "developer-tools",
    "tags": [
      "gitignore generator",
      "gitignore file",
      "node gitignore",
      "python gitignore",
      "react gitignore",
      ".gitignore template"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "docker-compose-generator",
    "title": "Docker Compose Generator — Compose YAML Template",
    "description": "Generate docker-compose.yml for any stack: FastAPI, Node, React, Django + PostgreSQL/MySQL/MongoDB + Redis + Nginx. Copy-paste ready.",
    "category": "developer-tools",
    "tags": [
      "docker compose generator",
      "docker-compose yaml",
      "docker compose template",
      "dockerfile generator",
      "docker setup",
      "compose file generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "fd-calculator",
    "title": "FD Calculator — Fixed Deposit Maturity & Interest",
    "description": "Calculate Fixed Deposit maturity amount, interest earned, TDS, and effective returns. Compare rates across SBI, HDFC, ICICI, Bajaj Finance, and Post Office.",
    "category": "finance-tools",
    "tags": [
      "fd calculator",
      "fixed deposit calculator",
      "fd maturity calculator",
      "fd interest calculator india",
      "best fd rates india",
      "sbi fd calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pomodoro-planner",
    "title": "Pomodoro Planner — Focus Session Scheduler",
    "description": "Create a personalized Pomodoro work schedule. Enter tasks and get a timed schedule with work sessions, short breaks, and long breaks.",
    "category": "productivity",
    "tags": [
      "pomodoro planner",
      "pomodoro timer schedule",
      "focus session planner",
      "work schedule generator",
      "pomodoro technique",
      "time management"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "habit-tracker-generator",
    "title": "Habit Tracker Generator — 30/60/90 Day Habit Plan",
    "description": "Generate a printable habit tracker for 7-90 days. Includes weekly review questions, habit stacking tips, and behavioral science insights.",
    "category": "productivity",
    "tags": [
      "habit tracker generator",
      "habit tracker template",
      "30 day habit tracker",
      "printable habit tracker",
      "daily habit tracker",
      "habit builder"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "meeting-agenda-generator",
    "title": "Meeting Agenda Generator — Professional Meeting Planner",
    "description": "Generate a detailed meeting agenda with timed sections, attendee list, pre-meeting checklist, and ground rules. Download and share before your next meeting.",
    "category": "business-tools",
    "tags": [
      "meeting agenda generator",
      "meeting agenda template",
      "meeting planner",
      "agenda creator",
      "team meeting agenda",
      "professional agenda",
      "meeting facilitator",
      "agenda tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "attendance-tracker",
    "title": "Attendance Tracker — Minimum Attendance Calculator",
    "description": "Track attended classes, total classes, and required percentage to see how many classes you can skip or must attend.",
    "category": "student-tools",
    "tags": [
      "attendance tracker",
      "attendance calculator",
      "75 percent attendance",
      "college attendance calculator",
      "student attendance tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "marks-calculator",
    "title": "Marks Calculator — Percentage, Grade & GPA",
    "description": "Calculate marks percentage, grade, GPA equivalent, pass/fail status, and marks needed for distinction.",
    "category": "student-tools",
    "tags": [
      "marks calculator",
      "percentage calculator",
      "grade calculator",
      "exam score",
      "student result calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "marks-to-percentage",
    "title": "Marks to Percentage Calculator — Exam Score Converter",
    "description": "Convert marks obtained out of total marks into percentage, grade, GPA equivalent, and pass/fail result instantly.",
    "category": "student-tools",
    "tags": [
      "marks to percentage",
      "exam percentage calculator",
      "student marks calculator",
      "result percentage",
      "grade percentage"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "reading-time",
    "title": "Reading Time Calculator — Estimate Read Duration",
    "description": "Estimate how long text will take to read based on word count and custom reading speed in words per minute.",
    "category": "text-ops",
    "tags": [
      "reading time",
      "reading time calculator",
      "estimate reading time",
      "word count reading",
      "article read time"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "estimate-reading-time",
    "title": "Estimate Reading Time — Text & Word Count Tool",
    "description": "Paste text or enter a word count to calculate estimated reading time for blogs, essays, notes, and scripts.",
    "category": "text-ops",
    "tags": [
      "estimate reading time",
      "blog reading time",
      "article time calculator",
      "wpm calculator",
      "text reading estimate"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "tdee-calculator",
    "title": "TDEE Calculator — Daily Calories & BMI",
    "description": "Calculate total daily energy expenditure, BMR, BMI, and calorie targets for weight loss, maintenance, or muscle gain.",
    "category": "health-tools",
    "tags": [
      "tdee calculator",
      "daily calorie calculator",
      "bmr calculator",
      "fitness calculator",
      "weight loss calories"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "daily-calorie-calculator",
    "title": "Daily Calorie Calculator — Maintenance & Weight Goals",
    "description": "Find your daily calorie needs using age, height, weight, gender, and activity level with BMI and goal targets.",
    "category": "health-tools",
    "tags": [
      "daily calorie calculator",
      "calorie intake",
      "maintenance calories",
      "weight gain calories",
      "weight loss calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "daily-water-intake",
    "title": "Daily Water Intake Calculator — Hydration Planner",
    "description": "Calculate recommended daily water intake from weight, activity, weather, and pregnancy/breastfeeding needs.",
    "category": "health-tools",
    "tags": [
      "daily water intake",
      "water calculator",
      "hydration calculator",
      "how much water daily",
      "fitness hydration"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gst-tax-calculator",
    "title": "GST Tax Calculator India — Add or Remove GST",
    "description": "Calculate GST-inclusive and GST-exclusive amounts for Indian tax rates with taxable value, GST amount, CGST, and SGST.",
    "category": "finance-tools",
    "tags": [
      "gst tax calculator",
      "gst calculator india",
      "add gst",
      "remove gst",
      "cgst sgst calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "budget-calculator",
    "title": "Budget Calculator — 50/30/20 Money Planner",
    "description": "Plan monthly budgets by income, expenses, needs, wants, and savings with category-wise spending recommendations.",
    "category": "finance-tools",
    "tags": [
      "budget calculator",
      "budget planner",
      "monthly budget",
      "50 30 20 rule",
      "money planner"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "tax-calculator",
    "title": "Income Tax Calculator India — Old vs New Regime",
    "description": "Estimate Indian income tax, take-home pay, and tax liability using salary and deductions for old and new regimes.",
    "category": "finance-tools",
    "tags": [
      "tax calculator",
      "income tax calculator india",
      "salary tax calculator",
      "old vs new tax regime",
      "itr tax estimate"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "india-tax-calculator",
    "title": "India Tax Calculator — Salary Income Tax Estimate",
    "description": "Calculate Indian tax liability for salary income with deductions, slabs, cess, and regime comparison.",
    "category": "finance-tools",
    "tags": [
      "india tax calculator",
      "income tax india",
      "salary tax",
      "tax slab calculator",
      "indian tax estimator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "home-loan-emi-calculator",
    "title": "Home Loan EMI Calculator — Monthly EMI & Interest",
    "description": "Calculate monthly EMI, total interest, total repayment, and yearly loan amortization for home loans.",
    "category": "finance-tools",
    "tags": [
      "home loan emi calculator",
      "emi calculator",
      "loan emi",
      "housing loan calculator",
      "monthly emi"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "monthly-emi",
    "title": "Monthly EMI Calculator — Loan Payment Planner",
    "description": "Calculate monthly EMI for any loan amount, annual interest rate, and tenure with total payment and interest.",
    "category": "finance-tools",
    "tags": [
      "monthly emi",
      "emi calculator",
      "loan payment",
      "interest calculator",
      "loan calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "percentage-change",
    "title": "Percentage Change Calculator — Increase or Decrease",
    "description": "Calculate percent increase or decrease between an old value and a new value with absolute change and summary.",
    "category": "math-tools",
    "tags": [
      "percentage change",
      "percent change",
      "increase decrease calculator",
      "percentage difference",
      "math calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "percent-change",
    "title": "Percent Change Calculator — Old vs New Value",
    "description": "Compare old and new numbers to calculate percentage increase, percentage decrease, and absolute change.",
    "category": "math-tools",
    "tags": [
      "percent change",
      "percentage increase",
      "percentage decrease",
      "old new value",
      "math percent calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "roman-numeral",
    "title": "Roman Numeral Converter — Roman to Number & Number to Roman",
    "description": "Convert Arabic numbers to Roman numerals and decode Roman numerals into normal numbers instantly.",
    "category": "student-tools",
    "tags": [
      "roman numeral",
      "roman numeral converter",
      "number to roman",
      "roman to number",
      "student converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "random-number",
    "title": "Random Number Generator — Unique Lottery Numbers",
    "description": "Generate random numbers between any minimum and maximum with optional uniqueness for lottery, games, and classroom picks.",
    "category": "student-tools",
    "tags": [
      "random number",
      "random number generator",
      "lottery number generator",
      "unique random numbers",
      "classroom picker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "anagram-detector",
    "title": "Anagram Detector — Compare Two Words or Phrases",
    "description": "Check whether two words or phrases are anagrams and see character differences when they do not match.",
    "category": "text-ops",
    "tags": [
      "anagram detector",
      "anagram checker",
      "word comparison",
      "letter rearrange",
      "text tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sort-lines",
    "title": "Sort Lines — A-Z, Z-A, Length or Shuffle",
    "description": "Sort pasted lines alphabetically, reverse alphabetically, by length, or shuffle them randomly.",
    "category": "text-ops",
    "tags": [
      "sort lines",
      "line sorter",
      "alphabetical sort",
      "sort text",
      "text operations"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "line-sorter",
    "title": "Line Sorter — Sort Text Lines Online",
    "description": "Paste a list and sort every line by alphabet, reverse order, length, or random shuffle.",
    "category": "text-ops",
    "tags": [
      "line sorter",
      "sort list",
      "sort text lines",
      "alphabetical order",
      "text cleanup"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "remove-duplicates",
    "title": "Remove Duplicates — Deduplicate Lines Online",
    "description": "Remove duplicate items from lists while preserving clean unique lines for spreadsheets, notes, and data cleanup.",
    "category": "text-ops",
    "tags": [
      "remove duplicates",
      "deduplicate list",
      "unique lines",
      "remove duplicate lines",
      "text cleaner"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "deduplicate-list",
    "title": "Deduplicate List — Keep Unique Items",
    "description": "Paste a list and remove repeated entries with counts for original items, unique items, and removed duplicates.",
    "category": "text-ops",
    "tags": [
      "deduplicate list",
      "unique list",
      "remove duplicates",
      "list cleaner",
      "data cleanup"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "char-frequency",
    "title": "Character Frequency Counter — Letter Usage Analyzer",
    "description": "Count characters and letters in text, rank most frequent characters, and analyze word and character totals.",
    "category": "text-ops",
    "tags": [
      "character frequency",
      "char frequency",
      "letter frequency",
      "text analysis",
      "frequency counter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "letter-frequency",
    "title": "Letter Frequency Counter — Analyze Text Characters",
    "description": "Analyze letter and character frequency with counts, percentages, top characters, and word totals.",
    "category": "text-ops",
    "tags": [
      "letter frequency",
      "character counter",
      "letter counter",
      "text analyzer",
      "frequency analysis"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pan-card-validator",
    "title": "PAN Card Validator — India PAN Format Checker",
    "description": "Validate Indian PAN card format and decode holder type from the fourth character.",
    "category": "finance-tools",
    "tags": [
      "pan card validator",
      "pan validator",
      "india pan checker",
      "pan format",
      "tax id validator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "password-analyzer",
    "title": "Password Analyzer — Strength, Entropy & Security Tips",
    "description": "Analyze password strength, entropy, character variety, and get clear recommendations to improve security.",
    "category": "security-tools",
    "tags": [
      "password analyzer",
      "password strength checker",
      "password security",
      "entropy calculator",
      "secure password"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "jwt-decoder-advanced",
    "title": "Advanced JWT Decoder — Inspect Token Header & Payload",
    "description": "Decode JWT tokens, inspect header and payload claims, and check token expiration details without signup.",
    "category": "developer-tools",
    "tags": [
      "jwt decoder advanced",
      "decode jwt",
      "jwt token inspector",
      "json web token",
      "developer tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-compare",
    "title": "Text Compare — Diff Two Text Blocks",
    "description": "Compare two pieces of text side by side and identify added, removed, and changed lines.",
    "category": "developer-tools",
    "tags": [
      "text compare",
      "text diff",
      "compare text online",
      "diff checker",
      "developer tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cidr-calculator",
    "title": "CIDR Calculator — IP Subnet Planner",
    "description": "Calculate network address, broadcast, subnet mask, wildcard, and usable hosts from CIDR notation.",
    "category": "network-tools",
    "tags": [
      "cidr calculator",
      "subnet calculator",
      "ip subnet",
      "network calculator",
      "developer network tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "http-headers-viewer",
    "title": "HTTP Headers Viewer — Security Header Checker",
    "description": "View HTTP response headers for any website and inspect security, cache, and server headers.",
    "category": "network-tools",
    "tags": [
      "http headers viewer",
      "response headers",
      "security headers",
      "header checker",
      "web tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "port-scanner",
    "title": "Port Scanner — Check Open TCP Ports",
    "description": "Check whether a TCP port is open or closed on a host for common web, SSH, database, and custom ports.",
    "category": "network-tools",
    "tags": [
      "port scanner",
      "port checker",
      "open port",
      "tcp port test",
      "network tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "multi-hash-generator",
    "title": "Multi Hash Generator — MD5, SHA1, SHA256 & SHA512",
    "description": "Generate multiple cryptographic hashes from text in one run, including MD5, SHA-1, SHA-256, and SHA-512.",
    "category": "security-tools",
    "tags": [
      "multi hash generator",
      "hash generator",
      "md5 sha256",
      "sha512",
      "security tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "playlist-downloader",
    "title": "Playlist Downloader — Download Video Playlists",
    "description": "Download YouTube playlists and supported video playlists with max video controls and ZIP-style workflow.",
    "category": "video-tools",
    "tags": [
      "playlist downloader",
      "youtube playlist downloader",
      "download playlist",
      "video downloader",
      "ishu tools"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "x-video-downloader",
    "title": "X Video Downloader — Save Twitter/X Videos",
    "description": "Download videos from X.com and Twitter posts by pasting the post URL.",
    "category": "video-tools",
    "tags": [
      "x video downloader",
      "twitter video downloader",
      "download x video",
      "save twitter video",
      "video downloader"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "paraphraser",
    "title": "Paraphraser — Rewrite Text in Your Own Words",
    "description": "Paraphrase any text using synonym replacement. Three modes: gentle, standard, and aggressive. Perfect for students, bloggers, and writers.",
    "category": "writing-tools",
    "tags": [
      "paraphraser",
      "paraphrase tool",
      "rewrite text",
      "rephrase online free",
      "text paraphraser",
      "quillbot alternative",
      "article rewriter",
      "paraphrase generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "essay-outline-generator",
    "title": "Essay Outline Generator — Argumentative, Expository & More",
    "description": "Generate structured essay outlines for argumentative, expository, narrative, descriptive, and compare-contrast essays. Choose the number of body paragraphs.",
    "category": "writing-tools",
    "tags": [
      "essay outline generator",
      "essay outline",
      "essay structure",
      "argumentative essay outline",
      "expository essay outline",
      "essay template",
      "essay writing",
      "essay planner"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "email-template-generator",
    "title": "Email Template Generator — Professional Email Writer",
    "description": "Generate professional email templates for follow-ups, job applications, apologies, thank-you notes, meeting requests, proposals, and complaints.",
    "category": "writing-tools",
    "tags": [
      "email template generator",
      "email writer",
      "professional email",
      "email template",
      "follow up email",
      "job application email",
      "email format",
      "business email"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cover-letter-generator",
    "title": "Cover Letter Generator — Job Application Letter",
    "description": "Generate a professional cover letter for any job application. Enter your name, role, company, skills, and achievements and get a polished letter instantly.",
    "category": "writing-tools",
    "tags": [
      "cover letter generator",
      "cover letter maker",
      "job application letter",
      "cover letter template",
      "professional cover letter",
      "cover letter free",
      "application letter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hashtag-generator",
    "title": "Hashtag Generator — Instagram, Twitter & TikTok Hashtags",
    "description": "Generate relevant hashtags for Instagram, Twitter, LinkedIn, TikTok, and YouTube from any topic or keyword. Includes platform-specific tips.",
    "category": "writing-tools",
    "tags": [
      "hashtag generator",
      "instagram hashtags",
      "twitter hashtags",
      "tiktok hashtags",
      "hashtag tool",
      "social media hashtags",
      "hashtag finder",
      "hashtags for instagram"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "slogan-generator",
    "title": "Slogan Generator — Brand Tagline & Motto Creator",
    "description": "Generate creative slogans and taglines for your brand, product, or business. Choose tone: professional, fun, simple, or bold. Multiple style options.",
    "category": "business-tools",
    "tags": [
      "slogan generator",
      "tagline generator",
      "brand slogan",
      "business slogan",
      "motto generator",
      "creative tagline",
      "brand tagline creator",
      "slogan maker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "social-bio-generator",
    "title": "Social Media Bio Generator — Instagram, Twitter & LinkedIn Bio",
    "description": "Generate professional social media bios for Instagram, Twitter, LinkedIn, TikTok, and YouTube. Multiple styles with emoji and platform-specific character limits.",
    "category": "business-tools",
    "tags": [
      "social media bio generator",
      "instagram bio generator",
      "twitter bio",
      "linkedin bio",
      "bio generator",
      "profile bio",
      "social bio creator",
      "instagram bio ideas"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "license-generator",
    "title": "License Generator — MIT, Apache, GPL, BSD Open Source",
    "description": "Generate full open source license text for MIT, Apache 2.0, GPL-3.0, BSD-2, MIT-0, Unlicense, and CC0. Enter name and year for instant license file.",
    "category": "developer-generators",
    "tags": [
      "license generator",
      "mit license",
      "apache license",
      "gpl license",
      "open source license",
      "github license",
      "software license",
      "bsd license"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "readme-generator",
    "title": "README Generator — GitHub README.md Builder",
    "description": "Generate a professional README.md for any project. Enter project name, description, tech stack, features, and author for a complete GitHub-ready README.",
    "category": "developer-generators",
    "tags": [
      "readme generator",
      "readme.md generator",
      "github readme",
      "markdown readme",
      "project readme",
      "readme template",
      "readme maker",
      "readme builder"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "github-actions-generator",
    "title": "GitHub Actions Generator — CI/CD Workflow YAML",
    "description": "Generate GitHub Actions workflow YAML files for Node.js CI, Python CI, Docker builds, Vercel deployments, and release automation. Copy-paste ready.",
    "category": "developer-generators",
    "tags": [
      "github actions generator",
      "ci/cd workflow",
      "github workflow",
      "yaml generator",
      "github actions yaml",
      "ci cd template",
      "devops tool",
      "automation workflow"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "nginx-config-generator",
    "title": "Nginx Config Generator — Server & Reverse Proxy Config",
    "description": "Generate nginx.conf for static sites, reverse proxies (Node.js, FastAPI, Django), with SSL/HTTPS, gzip compression, security headers, and caching.",
    "category": "developer-generators",
    "tags": [
      "nginx config generator",
      "nginx configuration",
      "nginx reverse proxy",
      "nginx ssl",
      "nginx template",
      "server config generator",
      "web server config",
      "nginx.conf"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "dockerfile-generator",
    "title": "Dockerfile Generator — Node.js, Python, React, Go, Django",
    "description": "Generate production-ready Dockerfiles for Node.js, Python/FastAPI, React, Django, and Go stacks. Multi-stage builds, slim images, best practices included.",
    "category": "developer-generators",
    "tags": [
      "dockerfile generator",
      "docker file generator",
      "node dockerfile",
      "python dockerfile",
      "react dockerfile",
      "docker template",
      "container config",
      "docker best practices"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "world-meeting-planner",
    "title": "World Meeting Planner — Best Time for Global Meetings",
    "description": "Find the best time for meetings across multiple timezones worldwide. Enter time zones, get local times, and see which hours overlap in business hours.",
    "category": "business-tools",
    "tags": [
      "world meeting planner",
      "timezone meeting planner",
      "meeting time finder",
      "global meeting scheduler",
      "timezone converter",
      "world clock meeting",
      "remote meeting time",
      "international meeting"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "string-case-converter",
    "title": "String Case Converter — camelCase, snake_case, kebab-case & More",
    "description": "Convert text to camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, Train-Case, dot.case, path/case, Title Case, and 14 other formats.",
    "category": "developer-tools",
    "tags": [
      "string case converter",
      "camelCase converter",
      "snake_case converter",
      "kebab-case",
      "pascal case",
      "case converter online",
      "text case changer",
      "all case converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "study-schedule-generator",
    "title": "Study Schedule Generator — Personalized Study Timetable",
    "description": "Generate a day-by-day study schedule for any number of subjects, hours per day, and study duration. Includes study techniques, breaks, and daily tips.",
    "category": "student-tools",
    "tags": [
      "study schedule generator",
      "study timetable",
      "study plan",
      "exam study schedule",
      "personalized study plan",
      "student schedule",
      "revision schedule",
      "study routine"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "agenda-generator",
    "title": "Meeting Agenda Generator",
    "description": "Create professional meeting agendas with time slots, topics, and attendees in seconds.",
    "category": "productivity",
    "tags": [
      "agenda",
      "meeting",
      "planner",
      "business",
      "productivity"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "all-case-converter",
    "title": "All Case Converter",
    "description": "Convert text to UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case, and more.",
    "category": "text-ops",
    "tags": [
      "case converter",
      "text transform",
      "uppercase",
      "lowercase",
      "camelcase"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "blog-post-outline",
    "title": "Blog Post Outline Generator",
    "description": "Generate structured blog post outlines with headings, subheadings, and key points for any topic.",
    "category": "productivity",
    "tags": [
      "blog outline",
      "content planner",
      "writing",
      "seo",
      "blogging"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "brand-slogan-generator",
    "title": "Brand Slogan Generator",
    "description": "Generate catchy, memorable brand slogans and taglines for your business or product.",
    "category": "productivity",
    "tags": [
      "slogan",
      "tagline",
      "branding",
      "marketing",
      "copywriting"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ci-cd-generator",
    "title": "CI/CD Pipeline Generator",
    "description": "Generate CI/CD configuration files for GitHub Actions, GitLab CI, Jenkins, and more.",
    "category": "developer",
    "tags": [
      "ci/cd",
      "devops",
      "pipeline",
      "github actions",
      "jenkins"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "compound-interest",
    "title": "Compound Interest Calculator",
    "description": "Calculate compound interest with monthly/quarterly/yearly compounding and visualize growth.",
    "category": "finance-tools",
    "tags": [
      "compound interest",
      "investment",
      "interest calculator",
      "savings",
      "finance"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "content-outline-generator",
    "title": "Content Outline Generator",
    "description": "Create detailed content outlines for articles, essays, and reports with suggested sections.",
    "category": "productivity",
    "tags": [
      "content outline",
      "article planner",
      "writing outline",
      "content strategy"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cover-letter",
    "title": "Cover Letter Generator",
    "description": "Generate professional cover letters tailored to your job role, company, and experience.",
    "category": "productivity",
    "tags": [
      "cover letter",
      "job application",
      "resume",
      "career",
      "professional"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "docker-generator",
    "title": "Dockerfile Generator",
    "description": "Generate optimized Dockerfiles for Node.js, Python, Go, Java, and other tech stacks.",
    "category": "developer",
    "tags": [
      "docker",
      "dockerfile",
      "container",
      "devops",
      "deployment"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "email-generator",
    "title": "Professional Email Generator",
    "description": "Generate well-written professional emails for any occasion — follow-ups, introductions, requests.",
    "category": "productivity",
    "tags": [
      "email",
      "professional email",
      "business email",
      "communication"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "essay-outline",
    "title": "Essay Outline Generator",
    "description": "Create structured essay outlines with thesis, arguments, and conclusion for academic writing.",
    "category": "student-tools",
    "tags": [
      "essay outline",
      "academic writing",
      "thesis",
      "student",
      "essay planner"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "flashcards-from-text",
    "title": "Flashcards from Text",
    "description": "Automatically generate study flashcards (Q&A pairs) from any text content.",
    "category": "student-tools",
    "tags": [
      "flashcards",
      "study",
      "learning",
      "q&a",
      "student"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "format-sql",
    "title": "SQL Formatter",
    "description": "Format and beautify SQL queries with proper indentation, keywords, and syntax highlighting.",
    "category": "developer",
    "tags": [
      "sql formatter",
      "sql beautifier",
      "sql",
      "database",
      "query"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "github-workflow-generator",
    "title": "GitHub Actions Workflow Generator",
    "description": "Generate GitHub Actions workflow YAML for CI/CD, testing, and deployment pipelines.",
    "category": "developer",
    "tags": [
      "github actions",
      "workflow",
      "yaml",
      "ci/cd",
      "devops"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hashtags",
    "title": "Hashtag Generator",
    "description": "Generate trending and relevant hashtags for Instagram, Twitter, TikTok, and LinkedIn.",
    "category": "productivity",
    "tags": [
      "hashtag",
      "social media",
      "instagram",
      "twitter",
      "trending"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "instagram-bio-generator",
    "title": "Instagram Bio Generator",
    "description": "Create catchy, professional Instagram bios with emojis and call-to-action lines.",
    "category": "productivity",
    "tags": [
      "instagram bio",
      "social media",
      "bio generator",
      "profile"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "invoice-maker",
    "title": "Invoice Maker",
    "description": "Create professional invoices with item details, taxes, discounts, and company branding.",
    "category": "productivity",
    "tags": [
      "invoice",
      "billing",
      "receipt",
      "business",
      "finance"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "meeting-time-finder",
    "title": "Meeting Time Finder",
    "description": "Find the best meeting time across multiple time zones for global teams.",
    "category": "productivity",
    "tags": [
      "meeting planner",
      "timezone",
      "scheduling",
      "team",
      "global"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "nginx-generator",
    "title": "Nginx Config Generator",
    "description": "Generate optimized Nginx configuration files for reverse proxy, SSL, and load balancing.",
    "category": "developer",
    "tags": [
      "nginx",
      "config",
      "reverse proxy",
      "ssl",
      "web server"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "number-words-converter",
    "title": "Number to Words Converter",
    "description": "Convert any number to words in Indian and international number systems with currency support.",
    "category": "math-tools",
    "tags": [
      "number to words",
      "amount in words",
      "cheque writing",
      "indian system"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "open-source-license",
    "title": "Open Source License Generator",
    "description": "Generate popular open source license files — MIT, Apache 2.0, GPL, BSD, and more.",
    "category": "developer",
    "tags": [
      "license",
      "open source",
      "MIT",
      "Apache",
      "GPL",
      "BSD"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "profile-bio-generator",
    "title": "Profile Bio Generator",
    "description": "Generate professional bios for LinkedIn, GitHub, portfolios, and social media profiles.",
    "category": "productivity",
    "tags": [
      "bio",
      "profile",
      "LinkedIn",
      "about me",
      "professional bio"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "readme-md-generator",
    "title": "README.md Generator",
    "description": "Generate complete README.md files for GitHub repositories with badges, installation, and usage sections.",
    "category": "developer",
    "tags": [
      "readme",
      "markdown",
      "github",
      "documentation",
      "project"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "restaurant-tip-calculator",
    "title": "Restaurant Tip Calculator",
    "description": "Calculate tip amounts and split bills between friends with custom tip percentages.",
    "category": "finance-tools",
    "tags": [
      "tip calculator",
      "restaurant",
      "bill split",
      "gratuity",
      "dining"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "resume-bullet-point-generator",
    "title": "Resume Bullet Point Generator",
    "description": "Generate impactful, action-verb resume bullet points from your job descriptions and achievements.",
    "category": "productivity",
    "tags": [
      "resume",
      "bullet points",
      "career",
      "job",
      "cv"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "split-expenses",
    "title": "Expense Splitter",
    "description": "Split group expenses fairly — calculate who owes whom with multiple payers and items.",
    "category": "finance-tools",
    "tags": [
      "expense splitter",
      "split bill",
      "group expenses",
      "who owes whom"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sql-beautifier",
    "title": "SQL Beautifier",
    "description": "Beautify and format complex SQL queries with proper keywords casing and indentation.",
    "category": "developer",
    "tags": [
      "sql beautifier",
      "sql format",
      "sql pretty print",
      "database"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "study-timetable",
    "title": "Study Timetable Generator",
    "description": "Create an optimized study timetable based on your subjects, hours available, and exam dates.",
    "category": "student-tools",
    "tags": [
      "study timetable",
      "study schedule",
      "exam prep",
      "student planner"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "tagline-generator",
    "title": "Tagline Generator",
    "description": "Generate creative taglines for businesses, products, events, and campaigns.",
    "category": "productivity",
    "tags": [
      "tagline",
      "slogan",
      "marketing",
      "branding",
      "creative"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "timezone-meeting-planner",
    "title": "Timezone Meeting Planner",
    "description": "Plan meetings across time zones — find overlapping business hours for global teams.",
    "category": "productivity",
    "tags": [
      "timezone",
      "meeting planner",
      "world clock",
      "global teams",
      "scheduling"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "basal-metabolic-rate",
    "title": "Basal Metabolic Rate Calculator",
    "description": "Calculate your BMR (basal metabolic rate) to understand daily calorie needs at rest.",
    "category": "health-tools",
    "tags": [
      "bmr",
      "basal metabolic rate",
      "metabolism",
      "calories",
      "health"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "calorie-intake-calculator",
    "title": "Daily Calorie Intake Calculator",
    "description": "Calculate daily calorie intake needs for weight loss, maintenance, or muscle gain.",
    "category": "health-tools",
    "tags": [
      "calorie intake",
      "diet",
      "weight loss",
      "nutrition",
      "health"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "compatibility-calculator",
    "title": "Compatibility Calculator",
    "description": "Fun compatibility calculator for names and zodiac signs — entertainment purposes.",
    "category": "utility",
    "tags": [
      "compatibility",
      "love calculator",
      "fun",
      "zodiac",
      "name"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "date-difference-calculator",
    "title": "Date Difference Calculator",
    "description": "Calculate exact difference between two dates in years, months, days, hours, and seconds.",
    "category": "math-tools",
    "tags": [
      "date difference",
      "days between dates",
      "date calculator",
      "duration"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "exercise-calories",
    "title": "Exercise Calories Calculator",
    "description": "Calculate calories burned for specific exercises based on body weight and duration.",
    "category": "health-tools",
    "tags": [
      "exercise calories",
      "workout",
      "fitness",
      "calories burned",
      "activity"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "goal-calculator",
    "title": "Fitness Goal Calculator",
    "description": "Calculate time required to reach your fitness goals based on current stats and target.",
    "category": "health-tools",
    "tags": [
      "fitness goal",
      "weight goal",
      "target weight",
      "diet plan",
      "health"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "heart-rate-calculator",
    "title": "Heart Rate Zone Calculator",
    "description": "Calculate target heart rate zones for fat burn, cardio, and peak performance training.",
    "category": "health-tools",
    "tags": [
      "heart rate",
      "heart rate zones",
      "cardio",
      "fat burn",
      "fitness"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mutual-fund-calculator",
    "title": "Mutual Fund Returns Calculator",
    "description": "Calculate mutual fund SIP and lump sum returns with CAGR and total wealth estimation.",
    "category": "finance-tools",
    "tags": [
      "mutual fund",
      "SIP",
      "returns",
      "investment",
      "CAGR"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "name-generator",
    "title": "Random Name Generator",
    "description": "Generate random names for characters, businesses, babies, or creative projects.",
    "category": "utility",
    "tags": [
      "name generator",
      "random name",
      "character name",
      "baby name"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "return-on-investment",
    "title": "ROI Calculator",
    "description": "Calculate return on investment percentage and profit/loss from investment amount and returns.",
    "category": "finance-tools",
    "tags": [
      "ROI",
      "return on investment",
      "profit",
      "investment calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "savings-goal",
    "title": "Savings Goal Calculator",
    "description": "Calculate monthly savings needed to reach your financial goal by a target date.",
    "category": "finance-tools",
    "tags": [
      "savings goal",
      "financial planning",
      "monthly savings",
      "target"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sleep-cycle-calculator",
    "title": "Sleep Cycle Calculator",
    "description": "Calculate optimal sleep and wake times based on 90-minute sleep cycles for better rest.",
    "category": "health-tools",
    "tags": [
      "sleep cycle",
      "sleep calculator",
      "wake time",
      "sleep quality"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "steps-calculator",
    "title": "Steps Counter Calculator",
    "description": "Estimate steps taken based on distance walked and stride length.",
    "category": "health-tools",
    "tags": [
      "steps counter",
      "pedometer",
      "walking",
      "distance",
      "fitness"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "steps-to-miles",
    "title": "Steps to Miles Converter",
    "description": "Convert your step count to miles and kilometers based on your stride length.",
    "category": "health-tools",
    "tags": [
      "steps to miles",
      "walking distance",
      "step converter",
      "pedometer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "coin-toss",
    "title": "Coin Toss Simulator",
    "description": "Flip a virtual coin — heads or tails with statistics for multiple tosses.",
    "category": "utility",
    "tags": [
      "coin toss",
      "coin flip",
      "heads tails",
      "random",
      "probability"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "convert-time",
    "title": "Time Unit Converter",
    "description": "Convert between seconds, minutes, hours, days, weeks, months, and years.",
    "category": "math-tools",
    "tags": [
      "time converter",
      "seconds to hours",
      "days to months",
      "duration"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cron-expression-builder",
    "title": "Cron Expression Builder",
    "description": "Build and validate cron expressions with a visual interface and plain English descriptions.",
    "category": "developer",
    "tags": [
      "cron",
      "cron expression",
      "scheduler",
      "crontab",
      "devops"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "deadline-tracker",
    "title": "Deadline Tracker",
    "description": "Track deadlines and calculate remaining time in days, hours, and minutes.",
    "category": "productivity",
    "tags": [
      "deadline",
      "countdown",
      "time remaining",
      "project tracker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "flip-coin",
    "title": "Coin Flipper",
    "description": "Quick coin flip — randomly generate heads or tails for quick decisions.",
    "category": "utility",
    "tags": [
      "coin flip",
      "heads tails",
      "random picker",
      "decision maker"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "fraction-math",
    "title": "Fraction Calculator",
    "description": "Add, subtract, multiply, and divide fractions with step-by-step solutions.",
    "category": "math-tools",
    "tags": [
      "fraction calculator",
      "fraction math",
      "add fractions",
      "simplify"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "grammar-checker-advanced",
    "title": "Advanced Grammar Checker",
    "description": "Check text for grammar, spelling, punctuation, and style errors with detailed suggestions.",
    "category": "text-ops",
    "tags": [
      "grammar checker",
      "spell check",
      "proofreading",
      "writing",
      "English"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "image-aspect-ratio",
    "title": "Image Aspect Ratio Calculator",
    "description": "Calculate and convert image aspect ratios — find matching dimensions for any ratio.",
    "category": "image-core",
    "tags": [
      "aspect ratio",
      "image dimensions",
      "16:9",
      "4:3",
      "resolution"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "in-hand-salary-calculator",
    "title": "In-Hand Salary Calculator",
    "description": "Calculate take-home salary after tax, PF, and other deductions from CTC.",
    "category": "finance-tools",
    "tags": [
      "in hand salary",
      "take home pay",
      "CTC",
      "salary calculator",
      "India"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "is-palindrome",
    "title": "Palindrome Checker",
    "description": "Check if a word, phrase, or number is a palindrome (reads the same forwards and backwards).",
    "category": "text-ops",
    "tags": [
      "palindrome",
      "palindrome check",
      "word game",
      "text tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "macronutrient-calculator",
    "title": "Macronutrient Calculator",
    "description": "Calculate daily protein, carbs, and fat intake based on your goals and body stats.",
    "category": "health-tools",
    "tags": [
      "macros",
      "macronutrient",
      "protein",
      "carbs",
      "fat",
      "diet"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "morse-decoder",
    "title": "Morse Code Decoder",
    "description": "Decode Morse code to text — convert dots and dashes back to readable text.",
    "category": "utility",
    "tags": [
      "morse code",
      "decoder",
      "dots dashes",
      "cipher",
      "translate"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "name-randomizer",
    "title": "Name Randomizer",
    "description": "Randomly pick names from a list — perfect for raffles, team selection, and games.",
    "category": "utility",
    "tags": [
      "name randomizer",
      "random picker",
      "raffle",
      "team selector"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "palindrome-checker",
    "title": "Palindrome Detector",
    "description": "Detect palindromes in text — check words, numbers, and sentences for palindrome patterns.",
    "category": "text-ops",
    "tags": [
      "palindrome detector",
      "word check",
      "reverse text",
      "symmetry"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "period-calculator",
    "title": "Period Calculator",
    "description": "Calculate and predict next menstrual period dates and fertile window based on cycle length.",
    "category": "health-tools",
    "tags": [
      "period calculator",
      "menstrual cycle",
      "fertility",
      "ovulation"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "provident-fund-calculator",
    "title": "Provident Fund Calculator",
    "description": "Calculate EPF (Employee Provident Fund) balance with interest over your career span.",
    "category": "finance-tools",
    "tags": [
      "provident fund",
      "EPF",
      "PF calculator",
      "retirement",
      "India"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "public-provident-fund-calculator",
    "title": "PPF Calculator",
    "description": "Calculate Public Provident Fund (PPF) maturity with yearly deposits and compound interest.",
    "category": "finance-tools",
    "tags": [
      "PPF",
      "public provident fund",
      "investment",
      "tax saving",
      "India"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "random-winner-picker",
    "title": "Random Winner Picker",
    "description": "Randomly pick a winner from a list of names — fair, transparent, and instant.",
    "category": "utility",
    "tags": [
      "winner picker",
      "random draw",
      "raffle",
      "giveaway",
      "contest"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "restaurant-bill-splitter",
    "title": "Restaurant Bill Splitter",
    "description": "Split restaurant bills fairly between friends with custom items and tip calculation.",
    "category": "finance-tools",
    "tags": [
      "bill splitter",
      "restaurant",
      "split check",
      "dining",
      "tip"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "resume-analyzer",
    "title": "Resume Analyzer",
    "description": "Analyze your resume for keyword density, ATS compatibility, and improvement suggestions.",
    "category": "productivity",
    "tags": [
      "resume analyzer",
      "ATS",
      "job",
      "career",
      "resume score"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "running-pace-calculator",
    "title": "Running Pace Calculator",
    "description": "Calculate running pace per km/mile from distance and time — perfect for runners and athletes.",
    "category": "health-tools",
    "tags": [
      "running pace",
      "pace calculator",
      "marathon",
      "jogging",
      "km/min"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "split-bill",
    "title": "Split Bill Calculator",
    "description": "Quickly split any bill among friends with even or custom splits and tip options.",
    "category": "finance-tools",
    "tags": [
      "split bill",
      "bill calculator",
      "share cost",
      "group pay"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "text-to-braille",
    "title": "Text to Braille Converter",
    "description": "Convert text to Braille Unicode characters for accessibility and education purposes.",
    "category": "utility",
    "tags": [
      "braille",
      "accessibility",
      "text converter",
      "unicode",
      "visually impaired"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "time-unit-converter",
    "title": "Time Unit Converter — Seconds to Hours",
    "description": "Convert between time units: seconds, minutes, hours, days, weeks, months, and years.",
    "category": "math-tools",
    "tags": [
      "time unit",
      "seconds to hours",
      "time converter",
      "duration calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "universal-converter",
    "title": "Universal Unit Converter",
    "description": "Convert between units of length, weight, temperature, volume, speed, and more.",
    "category": "math-tools",
    "tags": [
      "unit converter",
      "metric",
      "imperial",
      "measurement",
      "conversion"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cron-parser",
    "title": "Cron Expression Parser",
    "description": "Parse and explain cron expressions in plain English — understand when your jobs run.",
    "category": "developer",
    "tags": [
      "cron parser",
      "cron explain",
      "schedule",
      "crontab",
      "devops"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mac-address-finder",
    "title": "MAC Address Lookup",
    "description": "Look up MAC address manufacturer and vendor information from any MAC address.",
    "category": "network-tools",
    "tags": [
      "MAC address",
      "vendor lookup",
      "network",
      "OUI",
      "manufacturer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "oui-lookup",
    "title": "OUI Lookup",
    "description": "Look up the Organizationally Unique Identifier (OUI) to find device manufacturer from MAC prefix.",
    "category": "network-tools",
    "tags": [
      "OUI",
      "MAC address",
      "vendor",
      "network",
      "device manufacturer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "placeholder-text-generator",
    "title": "Placeholder Text Generator",
    "description": "Generate Lorem Ipsum and other placeholder text for design mockups and prototypes.",
    "category": "developer",
    "tags": [
      "lorem ipsum",
      "placeholder",
      "dummy text",
      "filler text",
      "mockup"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "px-to-rem-converter",
    "title": "PX to REM Converter",
    "description": "Convert pixel values to REM units for responsive CSS design with custom base font size.",
    "category": "developer",
    "tags": [
      "px to rem",
      "CSS",
      "responsive",
      "font size",
      "web design"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "regex-tester-advanced",
    "title": "Advanced Regex Tester",
    "description": "Test and debug regular expressions with real-time matching, groups, and flag support.",
    "category": "developer",
    "tags": [
      "regex tester",
      "regular expression",
      "pattern matching",
      "debug"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "twitch-vod-downloader",
    "title": "Twitch VOD Downloader",
    "description": "Download Twitch VODs, clips, and highlights in HD quality from any Twitch channel.",
    "category": "video-tools",
    "tags": [
      "twitch",
      "VOD",
      "download",
      "clips",
      "streaming"
    ],
    "input_kind": "url",
    "accepts_multiple": false
  },
  {
    "slug": "video-metadata-extractor",
    "title": "Video Metadata Extractor",
    "description": "Extract metadata from video URLs — title, duration, resolution, format, and thumbnail info.",
    "category": "video-tools",
    "tags": [
      "video metadata",
      "video info",
      "duration",
      "resolution",
      "format"
    ],
    "input_kind": "url",
    "accepts_multiple": false
  },
  {
    "slug": "wcag-contrast-checker",
    "title": "WCAG Contrast Checker",
    "description": "Check color contrast ratio for WCAG 2.1 AA and AAA accessibility compliance.",
    "category": "developer",
    "tags": [
      "WCAG",
      "contrast checker",
      "accessibility",
      "color contrast",
      "a11y"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "user-agent-parser",
    "title": "User Agent Parser",
    "description": "Parse browser user-agent strings to detect browser, version, operating system, device type, rendering engine, and bots.",
    "category": "developer-tools",
    "tags": [
      "user agent parser",
      "browser detector",
      "device detector",
      "parse user agent",
      "developer tool",
      "bot detector"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-cleaner",
    "title": "CSV Cleaner",
    "description": "Clean CSV data by trimming cells, removing empty rows, deduplicating rows, normalizing headers, and exporting clean CSV output.",
    "category": "data-tools",
    "tags": [
      "csv cleaner",
      "clean csv online",
      "remove empty rows csv",
      "dedupe csv",
      "normalize csv headers",
      "data cleaning"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "regex-replace",
    "title": "Regex Replace Tool",
    "description": "Find and replace text with regular expressions, flags, match previews, replacement count, and safe regex error reporting.",
    "category": "developer-tools",
    "tags": [
      "regex replace",
      "regular expression replace",
      "find replace regex",
      "regex editor",
      "text replace online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "weighted-gpa-calculator",
    "title": "Weighted GPA Calculator",
    "description": "Calculate weighted GPA from course grades and credits using 4-point or 10-point grading scales with per-course breakdown.",
    "category": "student-tools",
    "tags": [
      "weighted gpa calculator",
      "gpa calculator credits",
      "student grade calculator",
      "course credit gpa",
      "college gpa"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "grade-average-calculator",
    "title": "Grade Average Calculator",
    "description": "Calculate average marks, percentage, grade, highest score, lowest score, and total marks from any list of exam scores.",
    "category": "student-tools",
    "tags": [
      "grade average calculator",
      "marks average",
      "exam average calculator",
      "student percentage calculator",
      "average marks"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "syllabus-study-planner",
    "title": "Syllabus Study Planner",
    "description": "Turn syllabus topics, difficulty levels, days left, and daily study hours into a practical day-by-day study plan.",
    "category": "student-tools",
    "tags": [
      "syllabus study planner",
      "exam study plan",
      "student timetable",
      "study schedule generator",
      "revision planner"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "citation-url-cleaner",
    "title": "Citation URL Cleaner",
    "description": "Clean citation and research URLs by removing UTM tracking parameters, click IDs, referral junk, and fragments for neat references.",
    "category": "student-tools",
    "tags": [
      "citation url cleaner",
      "clean research url",
      "remove utm parameters",
      "clean citation links",
      "student research tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "url-query-parser",
    "title": "URL Query Parser",
    "description": "Parse any URL into scheme, domain, path, fragment, and query parameters, then rebuild a sorted clean URL.",
    "category": "developer-tools",
    "tags": [
      "url query parser",
      "query string parser",
      "parse url online",
      "developer url tool",
      "url parameters"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "timestamp-converter",
    "title": "Timestamp Converter",
    "description": "Convert Unix timestamps, milliseconds, and ISO dates into UTC, local time, RFC 2822, seconds, and milliseconds.",
    "category": "developer-tools",
    "tags": [
      "timestamp converter",
      "unix timestamp converter",
      "epoch time converter",
      "date to timestamp",
      "timestamp to date"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "markdown-table-generator",
    "title": "Markdown Table Generator",
    "description": "Convert CSV, TSV, pipe-delimited, or pasted table data into clean Markdown tables with escaped cells and previews.",
    "category": "developer-tools",
    "tags": [
      "markdown table generator",
      "csv to markdown table",
      "markdown table maker",
      "developer writing tool",
      "table converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "email-extractor",
    "title": "Email Extractor",
    "description": "Extract unique email addresses from any pasted text, deduplicate them, count domains, and export a clean list.",
    "category": "text-operations",
    "tags": [
      "email extractor",
      "extract emails from text",
      "email finder",
      "dedupe emails",
      "text extraction"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "phone-number-extractor",
    "title": "Phone Number Extractor",
    "description": "Extract phone numbers from pasted text, normalize digits, deduplicate results, and export a clean plain list.",
    "category": "text-operations",
    "tags": [
      "phone number extractor",
      "extract phone numbers",
      "mobile number extractor",
      "phone finder",
      "text extraction"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "keyword-density-checker",
    "title": "Keyword Density Checker",
    "description": "Analyze text for keyword frequency, density percentage, total words, unique keywords, and top SEO terms.",
    "category": "seo-tools",
    "tags": [
      "keyword density checker",
      "seo keyword density",
      "keyword frequency",
      "content seo tool",
      "keyword analyzer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "robots-txt-generator",
    "title": "Robots.txt Generator",
    "description": "Generate clean robots.txt rules with allow paths, disallow paths, crawl delay, and sitemap URL for SEO crawling control.",
    "category": "seo-tools",
    "tags": [
      "robots txt generator",
      "robots.txt maker",
      "seo crawler rules",
      "sitemap robots",
      "technical seo tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "meta-description-generator",
    "title": "Meta Description Generator",
    "description": "Generate SEO title ideas and meta descriptions from a topic, audience, keywords, and target length.",
    "category": "seo-tools",
    "tags": [
      "meta description generator",
      "seo title generator",
      "meta tag generator",
      "ai seo description",
      "marketing copy"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "browser-user-agent-parser",
    "title": "Browser User Agent Parser",
    "description": "Parse browser user-agent strings to identify browser, operating system, device type, bots, and rendering engine.",
    "category": "developer-tools",
    "tags": [
      "browser user agent parser",
      "device parser",
      "browser detector",
      "parse ua string"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "clean-csv",
    "title": "Clean CSV Online",
    "description": "Clean pasted CSV data by trimming cells, removing empty rows, deduplicating rows, and normalizing headers.",
    "category": "data-tools",
    "tags": [
      "clean csv",
      "csv cleaner online",
      "csv data cleaning",
      "dedupe csv rows"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "regex-find-replace",
    "title": "Regex Find and Replace",
    "description": "Find text with regular expressions and replace matches with a custom replacement using regex flags and previews.",
    "category": "developer-tools",
    "tags": [
      "regex find replace",
      "regular expression replace",
      "regex text replace"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gpa-weighted-calculator",
    "title": "GPA Weighted Calculator",
    "description": "Calculate weighted GPA from course grades and credit values with a clear per-course breakdown.",
    "category": "student-tools",
    "tags": [
      "gpa weighted calculator",
      "weighted grade calculator",
      "credit gpa calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "marks-average-calculator",
    "title": "Marks Average Calculator",
    "description": "Calculate marks average, total, percentage, highest, lowest, and grade from a list of exam scores.",
    "category": "student-tools",
    "tags": [
      "marks average calculator",
      "average marks",
      "exam marks calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "study-plan-from-syllabus",
    "title": "Study Plan From Syllabus",
    "description": "Create a day-by-day study plan from syllabus topics, difficulty levels, days left, and daily available hours.",
    "category": "student-tools",
    "tags": [
      "study plan from syllabus",
      "syllabus planner",
      "exam timetable generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "clean-citation-url",
    "title": "Clean Citation URL",
    "description": "Remove UTM parameters, click IDs, referral junk, and fragments from research links for clean citations.",
    "category": "student-tools",
    "tags": [
      "clean citation url",
      "remove tracking from url",
      "citation link cleaner"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "query-string-parser",
    "title": "Query String Parser",
    "description": "Parse URL query strings into readable key-value parameters and rebuild sorted URLs for debugging.",
    "category": "developer-tools",
    "tags": [
      "query string parser",
      "url parameter parser",
      "parse query online"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-markdown-table",
    "title": "CSV to Markdown Table",
    "description": "Convert CSV, TSV, or pipe-delimited table data into clean Markdown table syntax instantly.",
    "category": "developer-tools",
    "tags": [
      "csv to markdown table",
      "markdown table converter",
      "table to markdown"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "extract-emails",
    "title": "Extract Emails",
    "description": "Extract and deduplicate email addresses from pasted text with domain counts and clean export list.",
    "category": "text-operations",
    "tags": [
      "extract emails",
      "email extractor",
      "emails from text"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "extract-phone-numbers",
    "title": "Extract Phone Numbers",
    "description": "Extract, normalize, and deduplicate phone numbers from pasted text for clean contact lists.",
    "category": "text-operations",
    "tags": [
      "extract phone numbers",
      "phone number extractor",
      "mobile number finder"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "robots-generator",
    "title": "Robots Generator",
    "description": "Generate robots.txt content with allow rules, disallow rules, crawl delay, and sitemap URL.",
    "category": "seo-tools",
    "tags": [
      "robots generator",
      "robots txt maker",
      "technical seo robots"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "seo-meta-generator",
    "title": "SEO Meta Generator",
    "description": "Generate SEO title ideas, keywords, and meta descriptions for tool pages, blogs, and landing pages.",
    "category": "seo-tools",
    "tags": [
      "seo meta generator",
      "meta title generator",
      "meta description generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "utm-builder",
    "title": "UTM Builder",
    "description": "Build campaign tracking URLs with UTM source, medium, campaign, term, and content parameters for analytics.",
    "category": "seo-tools",
    "tags": [
      "utm builder",
      "campaign url builder",
      "utm generator",
      "marketing url",
      "analytics tracking"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "html-table-generator",
    "title": "HTML Table Generator",
    "description": "Convert CSV or pasted table data into clean semantic HTML table markup with optional header and CSS class.",
    "category": "developer-tools",
    "tags": [
      "html table generator",
      "csv to html table",
      "table html maker",
      "developer tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-schema-generator",
    "title": "JSON Schema Generator",
    "description": "Generate JSON Schema draft 2020-12 from any JSON object or array with inferred types, properties, and required fields.",
    "category": "developer-tools",
    "tags": [
      "json schema generator",
      "generate schema from json",
      "json validator schema",
      "developer json tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "css-clamp-generator",
    "title": "CSS Clamp Generator",
    "description": "Generate responsive CSS clamp() values for fluid typography and spacing between minimum and maximum viewport widths.",
    "category": "developer-tools",
    "tags": [
      "css clamp generator",
      "fluid typography",
      "responsive font size",
      "clamp calculator",
      "css tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "slug-bulk-generator",
    "title": "Bulk Slug Generator",
    "description": "Convert many titles, headings, product names, or page names into clean SEO-friendly URL slugs in one batch.",
    "category": "seo-tools",
    "tags": [
      "bulk slug generator",
      "seo slug generator",
      "url slug maker",
      "convert titles to slugs"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "table-to-csv-converter",
    "title": "Table to CSV Converter",
    "description": "Convert Markdown tables, pipe tables, tabular text, or copied table rows into clean CSV output.",
    "category": "data-tools",
    "tags": [
      "table to csv",
      "markdown table to csv",
      "pipe table converter",
      "csv converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-column-extractor",
    "title": "CSV Column Extractor",
    "description": "Extract selected columns from CSV by column name or index and export a clean reduced CSV table.",
    "category": "data-tools",
    "tags": [
      "csv column extractor",
      "extract csv columns",
      "select csv columns",
      "csv data tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "css-specificity-calculator",
    "title": "CSS Specificity Calculator",
    "description": "Calculate CSS selector specificity scores for IDs, classes, attributes, pseudo-classes, elements, and pseudo-elements.",
    "category": "developer-tools",
    "tags": [
      "css specificity calculator",
      "selector specificity",
      "css debug tool",
      "frontend developer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "http-status-code-lookup",
    "title": "HTTP Status Code Lookup",
    "description": "Look up HTTP status code meaning, category, error flag, and common troubleshooting guidance.",
    "category": "developer-tools",
    "tags": [
      "http status code lookup",
      "status code meaning",
      "404 meaning",
      "developer web tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mime-type-lookup",
    "title": "MIME Type Lookup",
    "description": "Find the MIME type for common file extensions and understand the content category used by browsers and servers.",
    "category": "developer-tools",
    "tags": [
      "mime type lookup",
      "file extension mime",
      "content type lookup",
      "developer tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "loan-comparison-calculator",
    "title": "Loan Comparison Calculator",
    "description": "Compare multiple loan interest rates to find EMI, total payment, total interest, and best loan option.",
    "category": "finance-tools",
    "tags": [
      "loan comparison calculator",
      "compare loan emi",
      "interest rate comparison",
      "finance calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "break-even-calculator",
    "title": "Break Even Calculator",
    "description": "Calculate break-even units, break-even revenue, contribution margin, and contribution margin percent for a business.",
    "category": "finance-tools",
    "tags": [
      "break even calculator",
      "business calculator",
      "break even point",
      "startup finance"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "profit-margin-calculator",
    "title": "Profit Margin Calculator",
    "description": "Calculate profit, margin percent, markup percent, and profit or loss status from cost and selling price.",
    "category": "finance-tools",
    "tags": [
      "profit margin calculator",
      "markup calculator",
      "profit calculator",
      "business finance"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gst-reverse-calculator",
    "title": "GST Reverse Calculator",
    "description": "Calculate base amount, GST amount, CGST, and SGST from an inclusive amount and GST rate.",
    "category": "finance-tools",
    "tags": [
      "gst reverse calculator",
      "inclusive gst calculator",
      "remove gst from amount",
      "india gst tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "discount-stack-calculator",
    "title": "Stacked Discount Calculator",
    "description": "Calculate final price after multiple sequential discounts and show effective discount percentage and step-by-step savings.",
    "category": "finance-tools",
    "tags": [
      "stacked discount calculator",
      "multiple discount calculator",
      "sale price calculator",
      "shopping discount"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "study-break-planner",
    "title": "Study Break Planner",
    "description": "Create a balanced focus and break schedule for long study sessions with start time, focus blocks, and break blocks.",
    "category": "student-tools",
    "tags": [
      "study break planner",
      "pomodoro study planner",
      "focus schedule",
      "student productivity"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "water-reminder-schedule",
    "title": "Water Reminder Schedule",
    "description": "Generate daily water reminder times based on wake time, sleep time, and number of glasses.",
    "category": "health-tools",
    "tags": [
      "water reminder schedule",
      "drink water reminder",
      "hydration planner",
      "health tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "workout-plan-generator",
    "title": "Workout Plan Generator",
    "description": "Generate beginner, intermediate, or advanced workout plans for strength, weight loss, or general fitness goals.",
    "category": "health-tools",
    "tags": [
      "workout plan generator",
      "fitness plan",
      "home workout planner",
      "exercise schedule"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "meal-plan-generator",
    "title": "Meal Plan Generator",
    "description": "Create a simple calorie-based meal plan with macro split, per-meal calories, protein, carbs, and fats.",
    "category": "health-tools",
    "tags": [
      "meal plan generator",
      "diet plan calculator",
      "macro meal planner",
      "calorie meal plan"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "name-initials-generator",
    "title": "Name Initials Generator",
    "description": "Generate initials, monograms, and short names from names or brand phrases for students, creators, and businesses.",
    "category": "text-operations",
    "tags": [
      "name initials generator",
      "monogram generator",
      "initials maker",
      "name abbreviation"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "acronym-generator",
    "title": "Acronym Generator",
    "description": "Generate acronym variants from phrases, organization names, project names, or brand ideas.",
    "category": "text-operations",
    "tags": [
      "acronym generator",
      "abbreviation maker",
      "project acronym",
      "brand name tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "username-generator",
    "title": "Username Generator",
    "description": "Generate clean username ideas from a name and keyword for social media, gaming, creator profiles, and projects.",
    "category": "social-media",
    "tags": [
      "username generator",
      "social username ideas",
      "name generator",
      "creator handle generator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-thumbnail-url-generator",
    "title": "YouTube Thumbnail URL Generator",
    "description": "Extract a YouTube video ID and generate default, medium, high, standard, and max-resolution thumbnail image URLs.",
    "category": "video-tools",
    "tags": [
      "youtube thumbnail url",
      "youtube thumbnail downloader",
      "thumbnail url generator",
      "video tools"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "youtube-embed-code-generator",
    "title": "YouTube Embed Code Generator",
    "description": "Generate responsive YouTube iframe embed code with optional start time and autoplay parameters.",
    "category": "video-tools",
    "tags": [
      "youtube embed code",
      "youtube iframe generator",
      "embed youtube video",
      "video tools"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "video-aspect-ratio-calculator",
    "title": "Video Aspect Ratio Calculator",
    "description": "Calculate simplified video aspect ratio, decimal ratio, orientation, and closest common ratio from width and height.",
    "category": "video-tools",
    "tags": [
      "video aspect ratio",
      "aspect ratio calculator",
      "16:9 calculator",
      "video resolution tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "video-bitrate-calculator",
    "title": "Video Bitrate Calculator",
    "description": "Estimate total and video bitrate from file size, duration, and audio bitrate for video encoding workflows.",
    "category": "video-tools",
    "tags": [
      "video bitrate calculator",
      "bitrate from file size",
      "encoding calculator",
      "video compression"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "video-file-size-estimator",
    "title": "Video File Size Estimator",
    "description": "Estimate video file size from duration, video bitrate, and audio bitrate before exporting or uploading.",
    "category": "video-tools",
    "tags": [
      "video file size estimator",
      "video size calculator",
      "bitrate size calculator",
      "upload size"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "video-duration-calculator",
    "title": "Video Duration Calculator",
    "description": "Convert video duration between HH:MM:SS, seconds, minutes, hours, and frame counts at any FPS.",
    "category": "video-tools",
    "tags": [
      "video duration calculator",
      "timecode calculator",
      "frame count calculator",
      "fps calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "serp-snippet-preview",
    "title": "SERP Snippet Preview",
    "description": "Preview Google-style search result title, URL, and description with length checks and truncation guidance.",
    "category": "seo-tools",
    "tags": [
      "serp snippet preview",
      "google snippet preview",
      "meta title preview",
      "seo preview tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "keyword-cluster-generator",
    "title": "Keyword Cluster Generator",
    "description": "Group keyword lists into simple topic clusters for SEO planning, content briefs, and programmatic page ideas.",
    "category": "seo-tools",
    "tags": [
      "keyword cluster generator",
      "seo keyword clustering",
      "keyword grouping",
      "content planning"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "headline-analyzer",
    "title": "Headline Analyzer",
    "description": "Score headlines by length, clarity, power words, and readability with practical improvement tips.",
    "category": "seo-tools",
    "tags": [
      "headline analyzer",
      "title analyzer",
      "seo headline score",
      "copywriting tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-path-extractor",
    "title": "JSON Path Extractor",
    "description": "Extract values from JSON using simple dot paths and array indexes like user.name or items[0].title.",
    "category": "developer-tools",
    "tags": [
      "json path extractor",
      "json value extractor",
      "developer json tool",
      "json query"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "uuid-validator",
    "title": "UUID Validator",
    "description": "Validate UUID strings, normalize them, and identify UUID version and variant.",
    "category": "developer-tools",
    "tags": [
      "uuid validator",
      "validate uuid",
      "uuid version checker",
      "developer tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ulid-generator",
    "title": "ULID Generator",
    "description": "Generate sortable ULIDs with timestamp prefix and random entropy for IDs, logs, and distributed systems.",
    "category": "developer-tools",
    "tags": [
      "ulid generator",
      "sortable id generator",
      "unique id generator",
      "developer tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ics-calendar-generator",
    "title": "ICS Calendar Generator",
    "description": "Generate downloadable calendar event text in ICS format with title, start time, end time, location, and description.",
    "category": "productivity",
    "tags": [
      "ics calendar generator",
      "calendar event generator",
      "ical maker",
      "productivity tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "vcard-generator",
    "title": "vCard Generator",
    "description": "Generate vCard contact text from name, email, phone, organization, title, and website.",
    "category": "productivity",
    "tags": [
      "vcard generator",
      "contact card generator",
      "vcf maker",
      "business contact tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "salary-to-hourly-calculator",
    "title": "Salary to Hourly Calculator",
    "description": "Convert annual salary into hourly, weekly, and monthly pay using hours per week and working weeks per year.",
    "category": "finance-tools",
    "tags": [
      "salary to hourly calculator",
      "hourly wage from salary",
      "pay calculator",
      "finance tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hourly-to-salary-calculator",
    "title": "Hourly to Salary Calculator",
    "description": "Convert hourly rate into annual, monthly, and weekly salary using work hours and weeks per year.",
    "category": "finance-tools",
    "tags": [
      "hourly to salary calculator",
      "annual salary from hourly",
      "wage calculator",
      "finance tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "debt-payoff-planner",
    "title": "Debt Payoff Planner",
    "description": "Estimate debt-free timeline and payoff order using avalanche or snowball strategy with extra monthly payments.",
    "category": "finance-tools",
    "tags": [
      "debt payoff planner",
      "debt snowball calculator",
      "debt avalanche calculator",
      "finance planner"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "goal-progress-calculator",
    "title": "Goal Progress Calculator",
    "description": "Calculate progress percentage, remaining amount, and ETA days toward a goal using current, start, target, and daily rate.",
    "category": "productivity",
    "tags": [
      "goal progress calculator",
      "progress tracker",
      "goal tracker",
      "productivity calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "habit-streak-calculator",
    "title": "Habit Streak Calculator",
    "description": "Calculate current streak, longest streak, and completed days from a list of habit completion dates.",
    "category": "productivity",
    "tags": [
      "habit streak calculator",
      "streak tracker",
      "habit tracker",
      "productivity tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "exam-timetable-generator",
    "title": "Exam Timetable Generator",
    "description": "Generate a day-by-day exam study timetable from subjects, days left, and daily available study hours.",
    "category": "student-tools",
    "tags": [
      "exam timetable generator",
      "study timetable",
      "exam planner",
      "student schedule"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "flashcard-csv-generator",
    "title": "Flashcard CSV Generator",
    "description": "Convert notes into Front/Back flashcard CSV format for Anki, Quizlet-style imports, and revision workflows.",
    "category": "student-tools",
    "tags": [
      "flashcard csv generator",
      "anki csv",
      "notes to flashcards",
      "student revision"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "notes-to-quiz-generator",
    "title": "Notes to Quiz Generator",
    "description": "Turn notes into fill-in-the-blank quiz questions with answers for fast revision and self-testing.",
    "category": "student-tools",
    "tags": [
      "notes to quiz generator",
      "quiz from notes",
      "student quiz maker",
      "revision questions"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "simple-rubric-generator",
    "title": "Simple Rubric Generator",
    "description": "Generate a simple grading rubric with criteria, point levels, and total score for assignments and projects.",
    "category": "student-tools",
    "tags": [
      "rubric generator",
      "grading rubric maker",
      "assignment rubric",
      "teacher tool"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "jpeg-to-kb",
    "title": "JPEG to Specific KB Size",
    "description": "Compress JPEG images to a specific file size in KB — perfect for form uploads.",
    "category": "image-core",
    "tags": [
      "jpeg compress",
      "image size",
      "kb",
      "resize",
      "form upload"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "jpeg-to-webp",
    "title": "JPEG to WebP Converter (.jpeg → .webp)",
    "description": "Convert JPEG (lossy photo format (same as JPG)) to WebP (modern web format ~30% smaller than JPG/PNG). Free, no signup, batch supported.",
    "category": "format-lab",
    "tags": [
      "jpeg to webp",
      "convert jpeg to webp",
      "jpeg webp converter",
      ".jpeg to .webp",
      "jpeg to webp free",
      "jpeg",
      "webp",
      "webp from jpeg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "png-to-kb",
    "title": "PNG to Specific KB Size",
    "description": "Compress PNG images to a specific file size in KB while maintaining quality.",
    "category": "image-core",
    "tags": [
      "png compress",
      "image size",
      "kb",
      "resize",
      "form upload"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image-to-10kb",
    "title": "Compress Image to 10KB",
    "description": "Compress any image to a 10KB target size online free. Perfect for government exam forms, SSC, UPSC, RRB portals.",
    "category": "image-core",
    "tags": [
      "compress",
      "10kb",
      "image",
      "ssc",
      "upsc",
      "exam"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "compress-image-to-500kb",
    "title": "Compress Image to 500KB",
    "description": "Compress image to 500KB target size online free. Ideal for college forms, job applications, and email attachments.",
    "category": "image-core",
    "tags": [
      "compress",
      "500kb",
      "image",
      "college",
      "form"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "readability-analyzer",
    "title": "Readability Analyzer",
    "description": "Analyze text readability using Flesch-Kincaid score, grade level, and reading ease metrics. Great for students and writers.",
    "category": "text-ops",
    "tags": [
      "readability",
      "flesch",
      "grade level",
      "text analysis",
      "writing"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "fitness-goal-calculator",
    "title": "Fitness Goal Calculator",
    "description": "Calculate how long it will take to reach your weight loss or gain goal based on your current weight and weekly rate.",
    "category": "health-calculators",
    "tags": [
      "fitness",
      "weight loss",
      "weight gain",
      "goal",
      "health"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "formal-letter-generator",
    "title": "Formal Letter Generator",
    "description": "Generate professional formal letters for job applications, complaints, requests, and official correspondence instantly.",
    "category": "text-ops",
    "tags": [
      "formal letter",
      "letter generator",
      "professional",
      "template",
      "writing"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ideal-weight-calculator",
    "title": "Ideal Weight Calculator",
    "description": "Calculate your ideal body weight based on height and gender using Devine, Robinson, and Hamwi formulas.",
    "category": "health-calculators",
    "tags": [
      "ideal weight",
      "body weight",
      "health",
      "bmi",
      "fitness"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "exercise-calories-calculator",
    "title": "Exercise Calories Calculator",
    "description": "Calculate calories burned during exercise based on activity type, duration, and body weight.",
    "category": "health-calculators",
    "tags": [
      "exercise",
      "calories",
      "burned",
      "fitness",
      "health"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "email-validator-tool",
    "title": "Email Validator Tool",
    "description": "Validate email addresses instantly. Check format, domain structure, and common mistakes in email addresses.",
    "category": "developer-tools",
    "tags": [
      "email",
      "validator",
      "verify",
      "format",
      "check"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "noise-reducer",
    "title": "Background Noise Reducer — Remove Audio Noise Online Free",
    "description": "Remove background noise, hiss, hum and static from MP3, WAV, M4A audio files instantly. AI-style FFT denoiser with light/medium/strong/extreme presets. Free, no signup.",
    "category": "audio-tools",
    "tags": [
      "noise reducer",
      "background noise remover",
      "audio denoiser",
      "remove noise from audio",
      "audio cleanup",
      "remove hiss",
      "remove hum",
      "podcast noise reducer",
      "free noise reducer online",
      "noise removal tool"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-normalizer",
    "title": "Audio Normalizer — LUFS Loudness Normalize MP3/WAV Free",
    "description": "Normalize audio loudness to broadcast-standard LUFS (-14 for streaming, -16 for podcasts, -23 for TV). Two-pass loudnorm filter — perfect even volume across all your tracks.",
    "category": "audio-tools",
    "tags": [
      "audio normalizer",
      "loudness normalizer",
      "lufs normalizer",
      "normalize mp3 volume",
      "ebu r128",
      "audio leveler",
      "podcast loudness",
      "spotify lufs"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "voice-enhancer",
    "title": "Voice Enhancer — Podcast-Grade Audio Cleaner Free",
    "description": "Make any voice recording sound studio-quality. Removes noise, de-esses, EQs vocals, compresses dynamics, and normalizes loudness — all in one click. Perfect for podcasts, voice-overs, YouTube videos.",
    "category": "audio-tools",
    "tags": [
      "voice enhancer",
      "podcast enhancer",
      "studio voice",
      "voice cleaner online",
      "improve voice quality",
      "voice over enhancer",
      "ai voice enhancer alternative",
      "free voice enhancer"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "silence-remover",
    "title": "Silence Remover — Cut Silent Parts from Audio Free",
    "description": "Automatically remove long silent gaps from any MP3, WAV or M4A file. Tighten podcasts, voice memos and lectures — adjustable silence threshold. Free, instant, no signup.",
    "category": "audio-tools",
    "tags": [
      "silence remover",
      "remove silence",
      "audio silence cutter",
      "auto silence trim",
      "podcast silence remover",
      "remove gaps from audio",
      "voice memo cleaner"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-fade",
    "title": "Audio Fade In/Out — Add Fade Effect to MP3 Free",
    "description": "Add smooth fade-in and fade-out effects to any audio file. Set custom fade durations — perfect for intros, outros and transitions in songs, podcasts, voiceovers.",
    "category": "audio-tools",
    "tags": [
      "audio fade",
      "fade in fade out",
      "audio fade in",
      "audio fade out",
      "mp3 fade effect",
      "smooth audio transition",
      "ringtone fade"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-equalizer",
    "title": "Audio Equalizer — Free Online EQ Presets (Bass, Treble, Vocal)",
    "description": "Apply professional EQ presets to any audio file: bass boost, treble boost, vocal boost, warm, bright, balanced. Free online equalizer — no software install needed.",
    "category": "audio-tools",
    "tags": [
      "audio equalizer",
      "eq online",
      "bass booster",
      "treble booster",
      "vocal booster",
      "audio eq free",
      "equalizer preset",
      "mp3 equalizer"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-stabilizer",
    "title": "Video Stabilizer — Fix Shaky Video Online Free",
    "description": "Stabilize shaky handheld videos using FFmpeg deshake. Smooth out camera shake from phone or action-cam clips — works on MP4, MOV, WebM. Free and online.",
    "category": "video-tools",
    "tags": [
      "video stabilizer",
      "stabilize video",
      "fix shaky video",
      "deshake video",
      "camera shake remover",
      "video smoother",
      "phone video stabilizer",
      "action cam stabilizer"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-upscaler",
    "title": "Video Upscaler — Upscale Video to 1080p, 1440p, 4K Free",
    "description": "Upscale any low-resolution video to 720p, 1080p Full HD, 1440p 2K or 4K UHD with smart sharpening and noise reduction. Lanczos high-quality scaling — free and online.",
    "category": "video-tools",
    "tags": [
      "video upscaler",
      "upscale video to 1080p",
      "upscale video to 4k",
      "video resolution enhancer",
      "video upscaling free",
      "ai video upscaler alternative",
      "improve video quality",
      "convert video to 1080p",
      "video enhancer online"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-to-1080p",
    "title": "Convert Video to 1080p Full HD — Free Online",
    "description": "Convert any video (480p, 720p, 4K, low-res phone video) to crisp 1080p Full HD with sharpening and denoising. Best quality settings, no watermark, free and online.",
    "category": "video-tools",
    "tags": [
      "convert to 1080p",
      "video to 1080p",
      "1080p converter",
      "full hd video converter",
      "upscale to 1080p",
      "make video 1080p",
      "1080p hd online"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-fade",
    "title": "Video Fade In/Out — Add Fade Effect to Video Free",
    "description": "Add smooth fade-in and fade-out effects (audio + video) to any MP4 / MOV / WebM clip. Cinematic intros and outros in seconds — adjustable fade lengths.",
    "category": "video-tools",
    "tags": [
      "video fade",
      "fade in video",
      "fade out video",
      "video transition online",
      "cinematic fade",
      "video intro fade",
      "video outro fade"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "text-shuffler",
    "title": "Text Shuffler — Randomize Words, Lines or Characters",
    "description": "Shuffle the order of words, lines, or characters in any pasted text. Great for quizzes, name-pickers, and creative prompts.",
    "category": "text-ops",
    "tags": [
      "text shuffler",
      "shuffle words",
      "randomize text",
      "shuffle lines",
      "random order"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sponge-case",
    "title": "Sponge Case Converter — sPoNgEbOb MoCkInG TeXt",
    "description": "Convert any text to sPoNgEbOb mocking case with alternating upper and lower characters. Perfect for memes and Discord messages.",
    "category": "text-ops",
    "tags": [
      "sponge case",
      "spongebob text",
      "mocking text",
      "alternating case",
      "meme text"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "inverse-case",
    "title": "Inverse Case Converter — Flip Upper and Lower Case",
    "description": "Flip every character's case at once. UPPER becomes lower and lower becomes UPPER for any pasted text.",
    "category": "text-ops",
    "tags": [
      "inverse case",
      "swap case",
      "flip case",
      "case flipper",
      "invert text case"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "alternate-case",
    "title": "Alternate Case — Word-Level UPPER/lower Pattern",
    "description": "Apply alternating UPPER and lower case word by word. Useful for stylized headers and social media captions.",
    "category": "text-ops",
    "tags": [
      "alternate case",
      "alternating words",
      "stylized text",
      "word case toggle"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "reverse-words",
    "title": "Reverse Words — Flip Word Order Per Line",
    "description": "Reverse the order of words in each line while keeping line breaks intact. Handy for poetry, palindrome practice, and text effects.",
    "category": "text-ops",
    "tags": [
      "reverse words",
      "flip word order",
      "word reverser",
      "backwards words"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "unicode-escape",
    "title": "Unicode Escape — Encode Text to \\uXXXX Sequences",
    "description": "Convert non-ASCII characters in your text to \\uXXXX escape sequences for safe embedding in code, JSON, or config files.",
    "category": "developer-tools",
    "tags": [
      "unicode escape",
      "encode unicode",
      "uXXXX escape",
      "ascii safe encoding"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "unicode-unescape",
    "title": "Unicode Unescape — Decode \\uXXXX Back to Text",
    "description": "Decode \\uXXXX-escaped strings back into readable Unicode text. Reverses the unicode escaping done by JSON or source code.",
    "category": "developer-tools",
    "tags": [
      "unicode unescape",
      "decode unicode",
      "uXXXX decoder",
      "unescape string"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "url-slug-generator",
    "title": "URL Slug Generator — Convert Titles to Clean URL Slugs",
    "description": "Generate SEO-friendly URL slugs from any title or sentence with custom separator and case options.",
    "category": "developer-tools",
    "tags": [
      "url slug",
      "slug generator",
      "seo slug",
      "permalink generator",
      "title to slug"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "emoji-counter",
    "title": "Emoji Counter — Count Emojis in Text",
    "description": "Count total emojis, unique emojis, and the top emojis used in any pasted text. Works on captions, chats, and posts.",
    "category": "text-ops",
    "tags": [
      "emoji counter",
      "count emojis",
      "emoji frequency",
      "emoji statistics",
      "emoji analyzer"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sentence-counter",
    "title": "Sentence Counter — Count Sentences in Text",
    "description": "Count sentences and average words per sentence in any pasted passage. Useful for essays, emails, and SEO content.",
    "category": "text-ops",
    "tags": [
      "sentence counter",
      "count sentences",
      "sentence analyzer",
      "essay sentences"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "paragraph-counter",
    "title": "Paragraph Counter — Count Paragraphs, Words and Characters",
    "description": "Count paragraphs, words, and characters in any text instantly. Perfect for academic and content writing.",
    "category": "text-ops",
    "tags": [
      "paragraph counter",
      "count paragraphs",
      "essay paragraph count",
      "text counter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "wpm-calculator",
    "title": "WPM Calculator — Words Per Minute Typing Speed",
    "description": "Calculate your typing speed in words per minute (WPM) and characters per minute (CPM) by entering typed text and the time you took.",
    "category": "productivity",
    "tags": [
      "wpm calculator",
      "typing speed calculator",
      "words per minute",
      "cpm calculator"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "syllable-counter",
    "title": "Syllable Counter — Count Syllables in Words and Text",
    "description": "Estimate syllables in words and full passages. Helpful for readability checks, poetry, haiku, and ESL learners.",
    "category": "text-ops",
    "tags": [
      "syllable counter",
      "count syllables",
      "haiku helper",
      "readability"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-escape",
    "title": "JSON Escape — Escape Text for JSON Strings",
    "description": "Escape special characters in any text so it becomes a valid JSON string value. Returns both the inner escaped form and the fully quoted version.",
    "category": "developer-tools",
    "tags": [
      "json escape",
      "escape json string",
      "json string encoder"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-unescape",
    "title": "JSON Unescape — Decode Escaped JSON Strings",
    "description": "Decode JSON-escaped strings back to plain text. Handles \\n, \\t, \\\", and \\uXXXX sequences correctly.",
    "category": "developer-tools",
    "tags": [
      "json unescape",
      "decode json string",
      "unescape json"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "audio-compressor",
    "title": "Audio Compressor — Reduce MP3/WAV/M4A File Size Free",
    "description": "Compress MP3, WAV, M4A, OGG, FLAC audio online — choose max/high/medium/low quality. Perfect for WhatsApp voice notes, email attachments, podcasts and ringtones. Free, no signup.",
    "category": "audio-tools",
    "tags": [
      "audio compressor",
      "compress mp3",
      "reduce audio size",
      "mp3 size reducer",
      "compress wav",
      "shrink audio file",
      "compress voice note",
      "audio compressor online free",
      "make mp3 smaller"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp4-to-mov",
    "title": "MP4 to MOV Converter — Free Online",
    "description": "Convert MP4 video to QuickTime MOV format with H.264 + AAC. Free, fast, no watermark.",
    "category": "video-tools",
    "tags": [
      "mp4 to mov",
      "convert mp4 to mov",
      "mp4 to quicktime",
      "mp4 to mov online free",
      "mp4 to mov converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp4-to-mkv",
    "title": "MP4 to MKV Converter — Free Online",
    "description": "Convert MP4 to Matroska MKV container. Preserves quality with libx264. Free and fast.",
    "category": "video-tools",
    "tags": [
      "mp4 to mkv",
      "convert mp4 to mkv",
      "mp4 to matroska",
      "mp4 to mkv free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp4-to-webm",
    "title": "MP4 to WebM Converter — Free Online",
    "description": "Convert MP4 to web-optimized WebM (VP9 + Opus). Smaller files, perfect for HTML5 video. Free.",
    "category": "video-tools",
    "tags": [
      "mp4 to webm",
      "convert mp4 to webm",
      "mp4 to vp9",
      "html5 video converter",
      "mp4 to webm free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp4-to-avi",
    "title": "MP4 to AVI Converter — Free Online",
    "description": "Convert MP4 to legacy AVI format for old players. Free, no signup.",
    "category": "video-tools",
    "tags": [
      "mp4 to avi",
      "convert mp4 to avi",
      "mp4 to avi online",
      "mp4 to avi free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp4-to-flv",
    "title": "MP4 to FLV Converter — Free Online",
    "description": "Convert MP4 to Flash FLV format. Free and online.",
    "category": "video-tools",
    "tags": [
      "mp4 to flv",
      "convert mp4 to flv",
      "mp4 to flash"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp4-to-wmv",
    "title": "MP4 to WMV Converter — Free Online",
    "description": "Convert MP4 video to Windows Media WMV format. Free, no signup.",
    "category": "video-tools",
    "tags": [
      "mp4 to wmv",
      "convert mp4 to wmv",
      "mp4 to windows media"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mov-to-mp4",
    "title": "MOV to MP4 Converter — Free Online",
    "description": "Convert iPhone / QuickTime MOV videos to universally-compatible MP4 (H.264). Free, fast.",
    "category": "video-tools",
    "tags": [
      "mov to mp4",
      "iphone video to mp4",
      "convert mov to mp4",
      "quicktime to mp4",
      "mov to mp4 free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mkv-to-mp4",
    "title": "MKV to MP4 Converter — Free Online",
    "description": "Convert MKV (Matroska) to MP4 with H.264 + AAC for universal playback. Free.",
    "category": "video-tools",
    "tags": [
      "mkv to mp4",
      "convert mkv to mp4",
      "matroska to mp4",
      "mkv to mp4 free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "webm-to-mp4",
    "title": "WebM to MP4 Converter — Free Online",
    "description": "Convert WebM video to MP4 (H.264). Free, online, no watermark.",
    "category": "video-tools",
    "tags": [
      "webm to mp4",
      "convert webm to mp4",
      "webm to mp4 free",
      "vp9 to h264"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "avi-to-mp4",
    "title": "AVI to MP4 Converter — Free Online",
    "description": "Convert legacy AVI video to modern MP4 (H.264 + AAC). Free, fast, no signup.",
    "category": "video-tools",
    "tags": [
      "avi to mp4",
      "convert avi to mp4",
      "avi to mp4 free",
      "old video to mp4"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "flv-to-mp4",
    "title": "FLV to MP4 Converter — Free Online",
    "description": "Convert Flash FLV to MP4 with H.264. Free.",
    "category": "video-tools",
    "tags": [
      "flv to mp4",
      "flash to mp4",
      "convert flv to mp4"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "wmv-to-mp4",
    "title": "WMV to MP4 Converter — Free Online",
    "description": "Convert Windows Media WMV to MP4. Free and online.",
    "category": "video-tools",
    "tags": [
      "wmv to mp4",
      "windows media to mp4",
      "convert wmv to mp4"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "m4v-to-mp4",
    "title": "M4V to MP4 Converter — Free Online",
    "description": "Convert iTunes M4V to MP4. Free.",
    "category": "video-tools",
    "tags": [
      "m4v to mp4",
      "convert m4v to mp4",
      "itunes video to mp4"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mpeg-to-mp4",
    "title": "MPEG to MP4 Converter — Free Online",
    "description": "Convert MPEG / MPG videos to modern MP4. Free.",
    "category": "video-tools",
    "tags": [
      "mpeg to mp4",
      "mpg to mp4",
      "convert mpeg to mp4"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mov-to-webm",
    "title": "MOV to WebM Converter — Free Online",
    "description": "Convert MOV to WebM for web playback. Free.",
    "category": "video-tools",
    "tags": [
      "mov to webm",
      "convert mov to webm"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp4-to-m4v",
    "title": "MP4 to M4V Converter — Free Online",
    "description": "Convert MP4 to Apple M4V format. Free.",
    "category": "video-tools",
    "tags": [
      "mp4 to m4v",
      "convert mp4 to m4v",
      "mp4 to apple video"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp3-to-wav",
    "title": "MP3 to WAV Converter — Free Online",
    "description": "Convert MP3 to lossless WAV PCM 16-bit audio. Perfect for editing and DAWs. Free, no signup.",
    "category": "audio-tools",
    "tags": [
      "mp3 to wav",
      "convert mp3 to wav",
      "mp3 to wav free",
      "mp3 to wav online",
      "mp3 to lossless"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "wav-to-mp3",
    "title": "WAV to MP3 Converter — Free Online",
    "description": "Convert WAV to MP3 (192 kbps). Free, fast, no signup.",
    "category": "audio-tools",
    "tags": [
      "wav to mp3",
      "convert wav to mp3",
      "wav to mp3 online free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "m4a-to-mp3",
    "title": "M4A to MP3 Converter — Free Online",
    "description": "Convert iPhone / iTunes M4A to universally-compatible MP3. Free.",
    "category": "audio-tools",
    "tags": [
      "m4a to mp3",
      "convert m4a to mp3",
      "iphone audio to mp3",
      "voice memo to mp3"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "ogg-to-mp3",
    "title": "OGG to MP3 Converter — Free Online",
    "description": "Convert OGG Vorbis to MP3. Free, online.",
    "category": "audio-tools",
    "tags": [
      "ogg to mp3",
      "convert ogg to mp3",
      "ogg vorbis to mp3"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "flac-to-mp3",
    "title": "FLAC to MP3 Converter — Free Online",
    "description": "Convert lossless FLAC to MP3 (192 kbps). Free.",
    "category": "audio-tools",
    "tags": [
      "flac to mp3",
      "convert flac to mp3",
      "lossless to mp3"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "aac-to-mp3",
    "title": "AAC to MP3 Converter — Free Online",
    "description": "Convert AAC to MP3. Free and online.",
    "category": "audio-tools",
    "tags": [
      "aac to mp3",
      "convert aac to mp3"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "opus-to-mp3",
    "title": "Opus to MP3 Converter — Free Online",
    "description": "Convert Opus audio to MP3. Free.",
    "category": "audio-tools",
    "tags": [
      "opus to mp3",
      "convert opus to mp3",
      "whatsapp opus to mp3"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "wma-to-mp3",
    "title": "WMA to MP3 Converter — Free Online",
    "description": "Convert Windows Media WMA to MP3. Free.",
    "category": "audio-tools",
    "tags": [
      "wma to mp3",
      "convert wma to mp3",
      "windows media audio to mp3"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp3-to-m4a",
    "title": "MP3 to M4A Converter — Free Online",
    "description": "Convert MP3 to AAC-encoded M4A for iPhone / iTunes. Free.",
    "category": "audio-tools",
    "tags": [
      "mp3 to m4a",
      "convert mp3 to m4a",
      "mp3 to aac"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp3-to-ogg",
    "title": "MP3 to OGG Converter — Free Online",
    "description": "Convert MP3 to OGG Vorbis. Free.",
    "category": "audio-tools",
    "tags": [
      "mp3 to ogg",
      "convert mp3 to ogg"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp3-to-flac",
    "title": "MP3 to FLAC Converter — Free Online",
    "description": "Convert MP3 to FLAC (lossless container, no quality recovery). Free.",
    "category": "audio-tools",
    "tags": [
      "mp3 to flac",
      "convert mp3 to flac"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp3-to-aac",
    "title": "MP3 to AAC Converter — Free Online",
    "description": "Convert MP3 to AAC. Free.",
    "category": "audio-tools",
    "tags": [
      "mp3 to aac",
      "convert mp3 to aac"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "wav-to-flac",
    "title": "WAV to FLAC Converter — Free Online",
    "description": "Convert WAV to lossless FLAC (smaller file, same quality). Free.",
    "category": "audio-tools",
    "tags": [
      "wav to flac",
      "convert wav to flac",
      "lossless audio compression"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "flac-to-wav",
    "title": "FLAC to WAV Converter — Free Online",
    "description": "Convert FLAC to PCM WAV. Free.",
    "category": "audio-tools",
    "tags": [
      "flac to wav",
      "convert flac to wav"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "wav-to-m4a",
    "title": "WAV to M4A Converter — Free Online",
    "description": "Convert WAV to M4A (AAC). Free.",
    "category": "audio-tools",
    "tags": [
      "wav to m4a",
      "convert wav to m4a"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "m4a-to-wav",
    "title": "M4A to WAV Converter — Free Online",
    "description": "Convert M4A to WAV. Free.",
    "category": "audio-tools",
    "tags": [
      "m4a to wav",
      "convert m4a to wav"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "ogg-to-wav",
    "title": "OGG to WAV Converter — Free Online",
    "description": "Convert OGG to WAV. Free.",
    "category": "audio-tools",
    "tags": [
      "ogg to wav",
      "convert ogg to wav"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "aac-to-wav",
    "title": "AAC to WAV Converter — Free Online",
    "description": "Convert AAC to WAV. Free.",
    "category": "audio-tools",
    "tags": [
      "aac to wav",
      "convert aac to wav"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-to-mp3",
    "title": "Video to MP3 Converter — Extract Audio Free",
    "description": "Extract audio from any MP4, MOV, WebM, AVI, MKV video as MP3 (192 kbps). Free, online, no watermark.",
    "category": "audio-tools",
    "tags": [
      "video to mp3",
      "extract audio from video",
      "convert video to mp3",
      "mp4 to mp3",
      "video audio extractor",
      "video to mp3 free"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp4-to-mp3",
    "title": "MP4 to MP3 Converter — Free Online",
    "description": "Convert MP4 video to MP3 audio (192 kbps). Free, no watermark.",
    "category": "audio-tools",
    "tags": [
      "mp4 to mp3",
      "convert mp4 to mp3",
      "mp4 to mp3 free",
      "mp4 to mp3 online",
      "mp4 audio extractor"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mov-to-mp3",
    "title": "MOV to MP3 Converter — Free Online",
    "description": "Extract MP3 audio from QuickTime MOV. Free.",
    "category": "audio-tools",
    "tags": [
      "mov to mp3",
      "convert mov to mp3",
      "iphone video audio extract"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "webm-to-mp3",
    "title": "WebM to MP3 Converter — Free Online",
    "description": "Extract MP3 audio from WebM video. Free.",
    "category": "audio-tools",
    "tags": [
      "webm to mp3",
      "convert webm to mp3"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "avi-to-mp3",
    "title": "AVI to MP3 Converter — Free Online",
    "description": "Extract MP3 from AVI video. Free.",
    "category": "audio-tools",
    "tags": [
      "avi to mp3",
      "convert avi to mp3"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mkv-to-mp3",
    "title": "MKV to MP3 Converter — Free Online",
    "description": "Extract MP3 from MKV video. Free.",
    "category": "audio-tools",
    "tags": [
      "mkv to mp3",
      "convert mkv to mp3"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-to-wav",
    "title": "Video to WAV Converter — Free Online",
    "description": "Extract lossless WAV audio from any video file. Free.",
    "category": "audio-tools",
    "tags": [
      "video to wav",
      "extract wav from video",
      "convert video to wav"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp4-to-wav",
    "title": "MP4 to WAV Converter — Free Online",
    "description": "Extract WAV audio from MP4 video. Free.",
    "category": "audio-tools",
    "tags": [
      "mp4 to wav",
      "convert mp4 to wav"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-to-m4a",
    "title": "Video to M4A Converter — Free Online",
    "description": "Extract M4A (AAC) audio from any video. Free.",
    "category": "audio-tools",
    "tags": [
      "video to m4a",
      "extract m4a from video",
      "convert video to m4a"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mp4-to-m4a",
    "title": "MP4 to M4A Converter — Free Online",
    "description": "Extract M4A audio from MP4 video for iPhone/iTunes. Free.",
    "category": "audio-tools",
    "tags": [
      "mp4 to m4a",
      "convert mp4 to m4a"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-to-flac",
    "title": "Video to FLAC Converter — Free Online",
    "description": "Extract lossless FLAC audio from any video file. Free.",
    "category": "audio-tools",
    "tags": [
      "video to flac",
      "extract flac from video"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-to-aac",
    "title": "Video to AAC Converter — Free Online",
    "description": "Extract AAC audio from any video file. Free.",
    "category": "audio-tools",
    "tags": [
      "video to aac",
      "extract aac from video"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-to-ogg",
    "title": "Video to OGG Converter — Free Online",
    "description": "Extract OGG audio from any video file. Free.",
    "category": "audio-tools",
    "tags": [
      "video to ogg",
      "extract ogg from video"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "webp-to-png",
    "title": "WebP to PNG Converter (.webp → .png)",
    "description": "Convert modern WebP images to widely-compatible PNG with transparency preserved. Useful when an app rejects .webp uploads.",
    "category": "image-tools",
    "tags": [
      "webp to png",
      "convert webp to png",
      "webp png converter",
      ".webp to .png",
      "webp to png free",
      "webp",
      "png",
      "png from webp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "bmp-to-png",
    "title": "BMP to PNG Converter (.bmp → .png)",
    "description": "Convert BMP (uncompressed legacy Windows bitmap) to PNG (lossless raster with alpha transparency). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "bmp to png",
      "convert bmp to png",
      "bmp png converter",
      ".bmp to .png",
      "bmp to png free",
      "bmp",
      "png",
      "png from bmp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "gif-to-png",
    "title": "GIF to PNG Converter (.gif → .png)",
    "description": "Extract the first frame of a GIF as a transparent PNG.",
    "category": "image-tools",
    "tags": [
      "gif to png",
      "convert gif to png",
      "gif png converter",
      ".gif to .png",
      "gif to png free",
      "gif",
      "png",
      "png from gif",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "tiff-to-png",
    "title": "TIFF to PNG Converter (.tiff → .png)",
    "description": "Convert TIFF (lossless print/scan format) to PNG (lossless raster with alpha transparency). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "tiff to png",
      "convert tiff to png",
      "tiff png converter",
      ".tiff to .png",
      "tiff to png free",
      "tiff",
      "png",
      "png from tiff",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "tif-to-png",
    "title": "TIF to PNG Converter (.tif → .png)",
    "description": "Convert TIF (lossless print/scan format) to PNG (lossless raster with alpha transparency). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "tif to png",
      "convert tif to png",
      "tif png converter",
      ".tif to .png",
      "tif to png free",
      "tif",
      "png",
      "png from tif",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "ico-to-png",
    "title": "ICO to PNG Converter (.ico → .png)",
    "description": "Extract favicon ICO frames as PNGs. Each size becomes its own file.",
    "category": "image-tools",
    "tags": [
      "ico to png",
      "convert ico to png",
      "ico png converter",
      ".ico to .png",
      "ico to png free",
      "ico",
      "png",
      "png from ico",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "heic-to-png",
    "title": "HEIC to PNG Converter (.heic → .png)",
    "description": "Convert iPhone HEIC photos to PNG so any device can open them. Lossless, full quality preserved.",
    "category": "image-tools",
    "tags": [
      "heic to png",
      "convert heic to png",
      "heic png converter",
      ".heic to .png",
      "heic to png free",
      "heic",
      "png",
      "png from heic",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "tif-to-jpg",
    "title": "TIF to JPG Converter (.tif → .jpg)",
    "description": "Convert TIF (lossless print/scan format) to JPG (lossy photo format with small file sizes). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "tif to jpg",
      "convert tif to jpg",
      "tif jpg converter",
      ".tif to .jpg",
      "tif to jpg free",
      "tif",
      "jpg",
      "jpg from tif",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "ico-to-jpg",
    "title": "ICO to JPG Converter (.ico → .jpg)",
    "description": "Convert ICO (Windows favicon container) to JPG (lossy photo format with small file sizes). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "ico to jpg",
      "convert ico to jpg",
      "ico jpg converter",
      ".ico to .jpg",
      "ico to jpg free",
      "ico",
      "jpg",
      "jpg from ico",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "svg-to-jpg",
    "title": "SVG to JPG Converter (.svg → .jpg)",
    "description": "Rasterize vector SVG into a JPG image at the resolution you need. Fonts and shapes flattened.",
    "category": "image-tools",
    "tags": [
      "svg to jpg",
      "convert svg to jpg",
      "svg jpg converter",
      ".svg to .jpg",
      "svg to jpg free",
      "svg",
      "jpg",
      "jpg from svg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "bmp-to-webp",
    "title": "BMP to WebP Converter (.bmp → .webp)",
    "description": "Convert BMP (uncompressed legacy Windows bitmap) to WebP (modern web format ~30% smaller than JPG/PNG). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "bmp to webp",
      "convert bmp to webp",
      "bmp webp converter",
      ".bmp to .webp",
      "bmp to webp free",
      "bmp",
      "webp",
      "webp from bmp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "gif-to-webp",
    "title": "GIF to WebP Converter (.gif → .webp)",
    "description": "Convert GIF (indexed-palette format used for animations) to WebP (modern web format ~30% smaller than JPG/PNG). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "gif to webp",
      "convert gif to webp",
      "gif webp converter",
      ".gif to .webp",
      "gif to webp free",
      "gif",
      "webp",
      "webp from gif",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "tiff-to-webp",
    "title": "TIFF to WebP Converter (.tiff → .webp)",
    "description": "Convert TIFF (lossless print/scan format) to WebP (modern web format ~30% smaller than JPG/PNG). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "tiff to webp",
      "convert tiff to webp",
      "tiff webp converter",
      ".tiff to .webp",
      "tiff to webp free",
      "tiff",
      "webp",
      "webp from tiff",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "heic-to-webp",
    "title": "HEIC to WebP Converter (.heic → .webp)",
    "description": "Convert iPhone HEIC to lightweight WebP for fast websites and email. Quality preserved.",
    "category": "image-tools",
    "tags": [
      "heic to webp",
      "convert heic to webp",
      "heic webp converter",
      ".heic to .webp",
      "heic to webp free",
      "heic",
      "webp",
      "webp from heic",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "png-to-bmp",
    "title": "PNG to BMP Converter (.png → .bmp)",
    "description": "Convert PNG (lossless raster with alpha transparency) to BMP (uncompressed legacy Windows bitmap). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "png to bmp",
      "convert png to bmp",
      "png bmp converter",
      ".png to .bmp",
      "png to bmp free",
      "png",
      "bmp",
      "bmp from png",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "jpg-to-bmp",
    "title": "JPG to BMP Converter (.jpg → .bmp)",
    "description": "Convert JPG (lossy photo format with small file sizes) to BMP (uncompressed legacy Windows bitmap). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "jpg to bmp",
      "convert jpg to bmp",
      "jpg bmp converter",
      ".jpg to .bmp",
      "jpg to bmp free",
      "jpg",
      "bmp",
      "bmp from jpg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "webp-to-bmp",
    "title": "WebP to BMP Converter (.webp → .bmp)",
    "description": "Convert WebP (modern web format ~30% smaller than JPG/PNG) to BMP (uncompressed legacy Windows bitmap). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "webp to bmp",
      "convert webp to bmp",
      "webp bmp converter",
      ".webp to .bmp",
      "webp to bmp free",
      "webp",
      "bmp",
      "bmp from webp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "gif-to-bmp",
    "title": "GIF to BMP Converter (.gif → .bmp)",
    "description": "Convert GIF (indexed-palette format used for animations) to BMP (uncompressed legacy Windows bitmap). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "gif to bmp",
      "convert gif to bmp",
      "gif bmp converter",
      ".gif to .bmp",
      "gif to bmp free",
      "gif",
      "bmp",
      "bmp from gif",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "png-to-gif",
    "title": "PNG to GIF Converter (.png → .gif)",
    "description": "Convert PNG (lossless raster with alpha transparency) to GIF (indexed-palette format used for animations). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "png to gif",
      "convert png to gif",
      "png gif converter",
      ".png to .gif",
      "png to gif free",
      "png",
      "gif",
      "gif from png",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "jpg-to-gif",
    "title": "JPG to GIF Converter (.jpg → .gif)",
    "description": "Convert JPG (lossy photo format with small file sizes) to GIF (indexed-palette format used for animations). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "jpg to gif",
      "convert jpg to gif",
      "jpg gif converter",
      ".jpg to .gif",
      "jpg to gif free",
      "jpg",
      "gif",
      "gif from jpg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "webp-to-gif",
    "title": "WebP to GIF Converter (.webp → .gif)",
    "description": "Convert WebP (modern web format ~30% smaller than JPG/PNG) to GIF (indexed-palette format used for animations). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "webp to gif",
      "convert webp to gif",
      "webp gif converter",
      ".webp to .gif",
      "webp to gif free",
      "webp",
      "gif",
      "gif from webp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "bmp-to-gif",
    "title": "BMP to GIF Converter (.bmp → .gif)",
    "description": "Convert BMP (uncompressed legacy Windows bitmap) to GIF (indexed-palette format used for animations). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "bmp to gif",
      "convert bmp to gif",
      "bmp gif converter",
      ".bmp to .gif",
      "bmp to gif free",
      "bmp",
      "gif",
      "gif from bmp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "png-to-tiff",
    "title": "PNG to TIFF Converter (.png → .tiff)",
    "description": "Convert PNG (lossless raster with alpha transparency) to TIFF (lossless print/scan format). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "png to tiff",
      "convert png to tiff",
      "png tiff converter",
      ".png to .tiff",
      "png to tiff free",
      "png",
      "tiff",
      "tiff from png",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "jpg-to-tiff",
    "title": "JPG to TIFF Converter (.jpg → .tiff)",
    "description": "Convert JPG (lossy photo format with small file sizes) to TIFF (lossless print/scan format). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "jpg to tiff",
      "convert jpg to tiff",
      "jpg tiff converter",
      ".jpg to .tiff",
      "jpg to tiff free",
      "jpg",
      "tiff",
      "tiff from jpg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "webp-to-tiff",
    "title": "WebP to TIFF Converter (.webp → .tiff)",
    "description": "Convert WebP (modern web format ~30% smaller than JPG/PNG) to TIFF (lossless print/scan format). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "webp to tiff",
      "convert webp to tiff",
      "webp tiff converter",
      ".webp to .tiff",
      "webp to tiff free",
      "webp",
      "tiff",
      "tiff from webp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "bmp-to-tiff",
    "title": "BMP to TIFF Converter (.bmp → .tiff)",
    "description": "Convert BMP (uncompressed legacy Windows bitmap) to TIFF (lossless print/scan format). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "bmp to tiff",
      "convert bmp to tiff",
      "bmp tiff converter",
      ".bmp to .tiff",
      "bmp to tiff free",
      "bmp",
      "tiff",
      "tiff from bmp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "png-to-ico",
    "title": "PNG to ICO Converter — Favicon Generator",
    "description": "Convert PNG to multi-size ICO favicon (16/32/48/64/128/256). Free.",
    "category": "image-tools",
    "tags": [
      "png to ico",
      "favicon generator",
      "convert png to ico",
      "make favicon"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "jpg-to-ico",
    "title": "JPG to ICO Converter — Favicon Generator",
    "description": "Convert JPG to ICO favicon. Free.",
    "category": "image-tools",
    "tags": [
      "jpg to ico",
      "convert jpg to ico",
      "favicon from jpg"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "webp-to-ico",
    "title": "WebP to ICO Converter (.webp → .ico)",
    "description": "Convert WebP (modern web format ~30% smaller than JPG/PNG) to ICO (Windows favicon container). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "webp to ico",
      "convert webp to ico",
      "webp ico converter",
      ".webp to .ico",
      "webp to ico free",
      "webp",
      "ico",
      "ico from webp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "bmp-to-ico",
    "title": "BMP to ICO Converter (.bmp → .ico)",
    "description": "Convert BMP (uncompressed legacy Windows bitmap) to ICO (Windows favicon container). Free, no signup, batch supported.",
    "category": "image-tools",
    "tags": [
      "bmp to ico",
      "convert bmp to ico",
      "bmp ico converter",
      ".bmp to .ico",
      "bmp to ico free",
      "bmp",
      "ico",
      "ico from bmp",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "png-to-svg",
    "title": "PNG to SVG Converter (.png → .svg)",
    "description": "Wrap a PNG inside an SVG container — keeps the file vector-compatible for embedding.",
    "category": "image-tools",
    "tags": [
      "png to svg",
      "convert png to svg",
      "png svg converter",
      ".png to .svg",
      "png to svg free",
      "png",
      "svg",
      "svg from png",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "jpg-to-svg",
    "title": "JPG to SVG Converter (.jpg → .svg)",
    "description": "Wrap a JPG inside an SVG container — useful when a tool only accepts vector inputs.",
    "category": "image-tools",
    "tags": [
      "jpg to svg",
      "convert jpg to svg",
      "jpg svg converter",
      ".jpg to .svg",
      "jpg to svg free",
      "jpg",
      "svg",
      "svg from jpg",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "image-to-svg",
    "title": "Image to SVG Converter (any image → .svg)",
    "description": "Convert any raster image (PNG/JPG/WebP) into an SVG container — keeps original quality, embeddable anywhere.",
    "category": "image-tools",
    "tags": [
      "image to svg",
      "convert image to svg",
      "image svg converter",
      "image to .svg",
      "image to svg free",
      "image",
      "svg",
      "svg from image",
      "image converter"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "json-to-xml",
    "title": "JSON to XML Converter — Free Online",
    "description": "Convert JSON to clean indented XML instantly. Free, no signup, validates input.",
    "category": "developer-tools",
    "tags": [
      "json to xml",
      "convert json to xml",
      "json xml converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "xml-to-json",
    "title": "XML to JSON Converter — Free Online",
    "description": "Convert XML to JSON with auto-detected lists. Free.",
    "category": "developer-tools",
    "tags": [
      "xml to json",
      "convert xml to json",
      "xml json converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-to-toml",
    "title": "JSON to TOML Converter — Free Online",
    "description": "Convert JSON to TOML config format. Free.",
    "category": "developer-tools",
    "tags": [
      "json to toml",
      "convert json to toml"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "toml-to-json",
    "title": "TOML to JSON Converter — Free Online",
    "description": "Convert TOML config to JSON. Free.",
    "category": "developer-tools",
    "tags": [
      "toml to json",
      "convert toml to json"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-to-markdown",
    "title": "JSON to Markdown Table — Free Online",
    "description": "Convert JSON array of objects to a Markdown table. Free.",
    "category": "developer-tools",
    "tags": [
      "json to markdown",
      "json to md",
      "json markdown table"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-to-md",
    "title": "JSON to MD Converter — Free Online",
    "description": "Alias for JSON to Markdown table. Free.",
    "category": "developer-tools",
    "tags": [
      "json to md",
      "json to markdown"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-to-sql",
    "title": "JSON to SQL Insert Statements — Free",
    "description": "Generate CREATE TABLE + INSERT statements from JSON. Free.",
    "category": "developer-tools",
    "tags": [
      "json to sql",
      "json to insert",
      "json to sqlite"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "json-to-html",
    "title": "JSON to HTML Table — Free Online",
    "description": "Render JSON as a styled HTML <table>. Free.",
    "category": "developer-tools",
    "tags": [
      "json to html",
      "json to table"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "html-to-json",
    "title": "HTML Table to JSON — Free Online",
    "description": "Extract first <table> from HTML and convert rows to JSON array. Free.",
    "category": "developer-tools",
    "tags": [
      "html to json",
      "html table to json"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "yaml-to-xml",
    "title": "YAML to XML Converter — Free Online",
    "description": "Convert YAML config to indented XML. Free.",
    "category": "developer-tools",
    "tags": [
      "yaml to xml",
      "convert yaml to xml"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "xml-to-yaml",
    "title": "XML to YAML Converter — Free Online",
    "description": "Convert XML to YAML. Free.",
    "category": "developer-tools",
    "tags": [
      "xml to yaml",
      "convert xml to yaml"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "yaml-to-toml",
    "title": "YAML to TOML Converter — Free Online",
    "description": "Convert YAML to TOML config. Free.",
    "category": "developer-tools",
    "tags": [
      "yaml to toml",
      "convert yaml to toml"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "toml-to-yaml",
    "title": "TOML to YAML Converter — Free Online",
    "description": "Convert TOML to YAML. Free.",
    "category": "developer-tools",
    "tags": [
      "toml to yaml",
      "convert toml to yaml"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "yaml-to-csv",
    "title": "YAML to CSV Converter — Free Online",
    "description": "Convert YAML list-of-objects to CSV. Free.",
    "category": "developer-tools",
    "tags": [
      "yaml to csv",
      "convert yaml to csv"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-yaml",
    "title": "CSV to YAML Converter — Free Online",
    "description": "Convert CSV rows to YAML list-of-objects. Free.",
    "category": "developer-tools",
    "tags": [
      "csv to yaml",
      "convert csv to yaml"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-tsv",
    "title": "CSV to TSV Converter — Free Online",
    "description": "Swap commas for tabs. Convert CSV to TSV (tab-separated values). Free.",
    "category": "developer-tools",
    "tags": [
      "csv to tsv",
      "convert csv to tsv"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "tsv-to-csv",
    "title": "TSV to CSV Converter — Free Online",
    "description": "Convert tab-separated TSV to standard CSV. Free.",
    "category": "developer-tools",
    "tags": [
      "tsv to csv",
      "convert tsv to csv"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-xml",
    "title": "CSV to XML Converter — Free Online",
    "description": "Convert CSV rows to indented XML. Free.",
    "category": "developer-tools",
    "tags": [
      "csv to xml",
      "convert csv to xml"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "xml-to-csv",
    "title": "XML to CSV Converter — Free Online",
    "description": "Flatten XML repeated elements to CSV rows. Free.",
    "category": "developer-tools",
    "tags": [
      "xml to csv",
      "convert xml to csv"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-html",
    "title": "CSV to HTML Table — Free Online",
    "description": "Render CSV data as a styled HTML <table>. Free.",
    "category": "developer-tools",
    "tags": [
      "csv to html",
      "csv to table",
      "csv to html table"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "html-to-csv",
    "title": "HTML Table to CSV — Free Online",
    "description": "Scrape first <table> from HTML to CSV. Free.",
    "category": "developer-tools",
    "tags": [
      "html to csv",
      "html table to csv"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-sql",
    "title": "CSV to SQL Insert Statements — Free",
    "description": "Generate CREATE TABLE + INSERT statements from CSV. Free.",
    "category": "developer-tools",
    "tags": [
      "csv to sql",
      "csv to insert",
      "csv to sqlite"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-markdown",
    "title": "CSV to Markdown Table — Free Online",
    "description": "Convert CSV to GitHub-flavored Markdown table. Free.",
    "category": "developer-tools",
    "tags": [
      "csv to markdown",
      "csv to md",
      "csv markdown table"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "csv-to-md",
    "title": "CSV to MD Converter — Free Online",
    "description": "Alias for CSV to Markdown table. Free.",
    "category": "developer-tools",
    "tags": [
      "csv to md",
      "csv to markdown"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "markdown-to-csv",
    "title": "Markdown Table to CSV — Free Online",
    "description": "Parse a Markdown table into CSV. Free.",
    "category": "developer-tools",
    "tags": [
      "markdown to csv",
      "md to csv",
      "markdown table to csv"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "md-to-csv",
    "title": "MD to CSV Converter — Free Online",
    "description": "Alias for Markdown table to CSV. Free.",
    "category": "developer-tools",
    "tags": [
      "md to csv",
      "markdown to csv"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "decimal-to-binary",
    "title": "Decimal to Binary Converter (base 10 → base 2)",
    "description": "Convert decimal (base 10) to binary (base 2) instantly. Example: 10₁₀ = 1010₂. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "decimal to binary",
      "convert decimal to binary",
      "decimal binary converter",
      "decimal to binary converter (base 10 → base 2)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "decimal-to-hex",
    "title": "Decimal to Hex Converter (base 10 → base 16)",
    "description": "Convert decimal (base 10) to hex (base 16) instantly. Example: 255 = 0xFF. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "decimal to hex",
      "convert decimal to hex",
      "decimal hex converter",
      "decimal to hex converter (base 10 → base 16)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "decimal-to-hexadecimal",
    "title": "Decimal to Hexadecimal Converter (base 10 → base 16)",
    "description": "Convert decimal (base 10) to hexadecimal (base 16) instantly. Example: 255 = 0xFF. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "decimal to hexadecimal",
      "convert decimal to hexadecimal",
      "decimal hexadecimal converter",
      "decimal to hexadecimal converter (base 10 → base 16)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "decimal-to-octal",
    "title": "Decimal to Octal Converter (base 10 → base 8)",
    "description": "Convert decimal (base 10) to octal (base 8) instantly. Example: 15 = 0o17. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "decimal to octal",
      "convert decimal to octal",
      "decimal octal converter",
      "decimal to octal converter (base 10 → base 8)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "binary-to-decimal",
    "title": "Binary to Decimal Converter (base 2 → base 10)",
    "description": "Convert binary (base 2) to decimal (base 10) instantly. Example: 1010₂ = 10₁₀. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "binary to decimal",
      "convert binary to decimal",
      "binary decimal converter",
      "binary to decimal converter (base 2 → base 10)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hex-to-decimal",
    "title": "Hex to Decimal Converter (base 16 → base 10)",
    "description": "Convert hex (base 16) to decimal (base 10) instantly. Example: 0xFF = 255. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "hex to decimal",
      "convert hex to decimal",
      "hex decimal converter",
      "hex to decimal converter (base 16 → base 10)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hexadecimal-to-decimal",
    "title": "Hexadecimal to Decimal Converter (base 16 → base 10)",
    "description": "Convert hexadecimal (base 16) to decimal (base 10) instantly. Example: 0xFF = 255. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "hexadecimal to decimal",
      "convert hexadecimal to decimal",
      "hexadecimal decimal converter",
      "hexadecimal to decimal converter (base 16 → base 10)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "octal-to-decimal",
    "title": "Octal to Decimal Converter (base 8 → base 10)",
    "description": "Convert octal (base 8) to decimal (base 10) instantly. Example: 0o17 = 15. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "octal to decimal",
      "convert octal to decimal",
      "octal decimal converter",
      "octal to decimal converter (base 8 → base 10)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "binary-to-hex",
    "title": "Binary to Hex Converter (base 2 → base 16)",
    "description": "Convert binary (base 2) to hex (base 16) instantly. Example: 11111111₂ = 0xFF. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "binary to hex",
      "convert binary to hex",
      "binary hex converter",
      "binary to hex converter (base 2 → base 16)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "binary-to-hexadecimal",
    "title": "Binary to Hexadecimal Converter (base 2 → base 16)",
    "description": "Convert binary (base 2) to hexadecimal (base 16) instantly. Example: 11111111₂ = 0xFF. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "binary to hexadecimal",
      "convert binary to hexadecimal",
      "binary hexadecimal converter",
      "binary to hexadecimal converter (base 2 → base 16)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hex-to-binary",
    "title": "Hex to Binary Converter (base 16 → base 2)",
    "description": "Convert hex (base 16) to binary (base 2) instantly. Example: 0xFF = 11111111₂. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "hex to binary",
      "convert hex to binary",
      "hex binary converter",
      "hex to binary converter (base 16 → base 2)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hexadecimal-to-binary",
    "title": "Hexadecimal to Binary Converter (base 16 → base 2)",
    "description": "Convert hexadecimal (base 16) to binary (base 2) instantly. Example: 0xFF = 11111111₂. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "hexadecimal to binary",
      "convert hexadecimal to binary",
      "hexadecimal binary converter",
      "hexadecimal to binary converter (base 16 → base 2)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "binary-to-octal",
    "title": "Binary to Octal Converter (base 2 → base 8)",
    "description": "Convert binary (base 2) to octal (base 8) instantly. Example: 111111₂ = 0o77. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "binary to octal",
      "convert binary to octal",
      "binary octal converter",
      "binary to octal converter (base 2 → base 8)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "octal-to-binary",
    "title": "Octal to Binary Converter (base 8 → base 2)",
    "description": "Convert octal (base 8) to binary (base 2) instantly. Example: 0o77 = 111111₂. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "octal to binary",
      "convert octal to binary",
      "octal binary converter",
      "octal to binary converter (base 8 → base 2)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hex-to-octal",
    "title": "Hex to Octal Converter (base 16 → base 8)",
    "description": "Convert hex (base 16) to octal (base 8) instantly. Example: 0xFF = 0o377. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "hex to octal",
      "convert hex to octal",
      "hex octal converter",
      "hex to octal converter (base 16 → base 8)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "octal-to-hex",
    "title": "Octal to Hex Converter (base 8 → base 16)",
    "description": "Convert octal (base 8) to hex (base 16) instantly. Example: 0o377 = 0xFF. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "octal to hex",
      "convert octal to hex",
      "octal hex converter",
      "octal to hex converter (base 8 → base 16)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "string-to-binary",
    "title": "String to Binary Converter (UTF-8 characters → base 2)",
    "description": "Convert string to binary (base 2, UTF-8) instantly. Example: 'A' = 01000001. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "string to binary",
      "convert string to binary",
      "string binary converter",
      "string to binary converter (utf-8 characters → base 2)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "string-to-hex",
    "title": "String to Hex Converter (UTF-8 characters → base 16)",
    "description": "Convert string to hex (base 16, UTF-8) instantly. Example: 'A' = 41. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "string to hex",
      "convert string to hex",
      "string hex converter",
      "string to hex converter (utf-8 characters → base 16)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "string-to-ascii",
    "title": "String to ASCII Converter",
    "description": "Convert string to ascii instantly. Example: 'A' = 65. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "string to ascii",
      "convert string to ascii",
      "string ascii converter",
      "string to ascii converter",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ascii-to-string",
    "title": "ASCII to String Converter",
    "description": "Convert ascii to string instantly. Example: 65 = 'A'. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "ascii to string",
      "convert ascii to string",
      "ascii string converter",
      "ascii to string converter",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ascii-to-binary",
    "title": "ASCII to Binary Converter (ASCII codes → base 2)",
    "description": "Convert ascii to binary (base 2, UTF-8) instantly. Example: 65 = 01000001. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "ascii to binary",
      "convert ascii to binary",
      "ascii binary converter",
      "ascii to binary converter (ascii codes → base 2)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ascii-to-hex",
    "title": "ASCII to Hex Converter (ASCII codes → base 16)",
    "description": "Convert ascii to hex (base 16, UTF-8) instantly. Example: 65 = 0x41. Free, no signup, accepts common prefixes.",
    "category": "developer-tools",
    "tags": [
      "ascii to hex",
      "convert ascii to hex",
      "ascii hex converter",
      "ascii to hex converter (ascii codes → base 16)",
      "number base converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "celsius-to-fahrenheit",
    "title": "Celsius to Fahrenheit Converter (°C → °F)",
    "description": "Convert celsius to fahrenheit instantly. Formula: °F = °C × 9/5 + 32. Example: 100°C = 212°F. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "celsius to fahrenheit",
      "celsius to fahrenheit",
      "°C to °F",
      "celsius fahrenheit converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "fahrenheit-to-celsius",
    "title": "Fahrenheit to Celsius Converter (°F → °C)",
    "description": "Convert fahrenheit to celsius instantly. Formula: °C = (°F − 32) × 5/9. Example: 32°F = 0°C. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "fahrenheit to celsius",
      "fahrenheit to celsius",
      "°F to °C",
      "fahrenheit celsius converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "celsius-to-kelvin",
    "title": "Celsius to Kelvin Converter (°C → K)",
    "description": "Convert celsius to kelvin instantly. Formula: K = °C + 273.15. Example: 0°C = 273.15 K. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "celsius to kelvin",
      "celsius to kelvin",
      "°C to K",
      "celsius kelvin converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kelvin-to-celsius",
    "title": "Kelvin to Celsius Converter (K → °C)",
    "description": "Convert kelvin to celsius instantly. Formula: °C = K − 273.15. Example: 273.15 K = 0°C. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kelvin to celsius",
      "kelvin to celsius",
      "K to °C",
      "kelvin celsius converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "fahrenheit-to-kelvin",
    "title": "Fahrenheit to Kelvin Converter (°F → K)",
    "description": "Convert fahrenheit to kelvin instantly. Formula: K = (°F − 32) × 5/9 + 273.15. Example: 32°F = 273.15 K. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "fahrenheit to kelvin",
      "fahrenheit to kelvin",
      "°F to K",
      "fahrenheit kelvin converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kelvin-to-fahrenheit",
    "title": "Kelvin to Fahrenheit Converter (K → °F)",
    "description": "Convert kelvin to fahrenheit instantly. Formula: °F = (K − 273.15) × 9/5 + 32. Example: 273.15 K = 32°F. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kelvin to fahrenheit",
      "kelvin to fahrenheit",
      "K to °F",
      "kelvin fahrenheit converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "rankine-to-celsius",
    "title": "Rankine to Celsius Converter (°R → °C)",
    "description": "Convert rankine to celsius instantly. Formula: °C = °R × 5/9 − 273.15. Example: 491.67°R = 0°C. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "rankine to celsius",
      "rankine to celsius",
      "°R to °C",
      "rankine celsius converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "celsius-to-rankine",
    "title": "Celsius to Rankine Converter (°C → °R)",
    "description": "Convert celsius to rankine instantly. Formula: °R = (°C + 273.15) × 9/5. Example: 0°C = 491.67°R. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "celsius to rankine",
      "celsius to rankine",
      "°C to °R",
      "celsius rankine converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cm-to-inches",
    "title": "Centimeters to Inches Converter (cm → in)",
    "description": "Convert centimeters to inches instantly. Formula: in = cm × 0.393701. Example: 1 cm = 0.3937 in. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "cm to inches",
      "centimeters to inches",
      "cm to in",
      "centimeters inches converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "inches-to-cm",
    "title": "Inches to Centimeters Converter (in → cm)",
    "description": "Convert inches to centimeters instantly. Formula: cm = in × 2.54. Example: 1 in = 2.54 cm. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "inches to cm",
      "inches to centimeters",
      "in to cm",
      "inches centimeters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mm-to-inches",
    "title": "Millimeters to Inches Converter (mm → in)",
    "description": "Convert millimeters to inches instantly. Formula: in = mm × 0.0393701. Example: 1 mm = 0.0394 in. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mm to inches",
      "millimeters to inches",
      "mm to in",
      "millimeters inches converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "inches-to-mm",
    "title": "Inches to Millimeters Converter (in → mm)",
    "description": "Convert inches to millimeters instantly. Formula: mm = in × 25.4. Example: 1 in = 25.4 mm. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "inches to mm",
      "inches to millimeters",
      "in to mm",
      "inches millimeters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "m-to-feet",
    "title": "Meters to Feet Converter (m → ft)",
    "description": "Convert meters to feet instantly. Formula: ft = m × 3.28084. Example: 1 m = 3.2808 ft. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "m to feet",
      "meters to feet",
      "m to ft",
      "meters feet converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "feet-to-m",
    "title": "Feet to Meters Converter (ft → m)",
    "description": "Convert feet to meters instantly. Formula: m = ft × 0.3048. Example: 1 ft = 0.3048 m. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "feet to m",
      "feet to meters",
      "ft to m",
      "feet meters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "feet-to-meters",
    "title": "Feet to Meters Converter (ft → m)",
    "description": "Convert feet to meters instantly. Formula: m = ft × 0.3048. Example: 1 ft = 0.3048 m. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "feet to meters",
      "feet to meters",
      "ft to m",
      "feet meters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "meters-to-feet",
    "title": "Meters to Feet Converter (m → ft)",
    "description": "Convert meters to feet instantly. Formula: ft = m × 3.28084. Example: 1 m = 3.2808 ft. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "meters to feet",
      "meters to feet",
      "m to ft",
      "meters feet converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "km-to-miles",
    "title": "Kilometers to Miles Converter (km → mi)",
    "description": "Convert kilometers to miles instantly. Formula: mi = km × 0.621371. Example: 1 km = 0.6214 mi. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "km to miles",
      "kilometers to miles",
      "km to mi",
      "kilometers miles converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "miles-to-km",
    "title": "Miles to Kilometers Converter (mi → km)",
    "description": "Convert miles to kilometers instantly. Formula: km = mi × 1.60934. Example: 1 mi = 1.6093 km. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "miles to km",
      "miles to kilometers",
      "mi to km",
      "miles kilometers converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "yards-to-meters",
    "title": "Yards to Meters Converter (yd → m)",
    "description": "Convert yards (yd) to meters (m) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "yards to meters",
      "yards to meters",
      "yd to m",
      "yards meters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "meters-to-yards",
    "title": "Meters to Yards Converter (m → yd)",
    "description": "Convert meters (m) to yards (yd) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "meters to yards",
      "meters to yards",
      "m to yd",
      "meters yards converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "feet-to-inches",
    "title": "Feet to Inches Converter (ft → in)",
    "description": "Convert feet (ft) to inches (in) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "feet to inches",
      "feet to inches",
      "ft to in",
      "feet inches converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "inches-to-feet",
    "title": "Inches to Feet Converter (in → ft)",
    "description": "Convert inches (in) to feet (ft) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "inches to feet",
      "inches to feet",
      "in to ft",
      "inches feet converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cm-to-mm",
    "title": "Centimeters to Millimeters Converter (cm → mm)",
    "description": "Convert centimeters to millimeters instantly. Formula: mm = cm × 10. Example: 1 cm = 10 mm. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "cm to mm",
      "centimeters to millimeters",
      "cm to mm",
      "centimeters millimeters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mm-to-cm",
    "title": "Millimeters to Centimeters Converter (mm → cm)",
    "description": "Convert millimeters to centimeters instantly. Formula: cm = mm × 0.1. Example: 1 mm = 0.1 cm. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mm to cm",
      "millimeters to centimeters",
      "mm to cm",
      "millimeters centimeters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "m-to-cm",
    "title": "Meters to Centimeters Converter (m → cm)",
    "description": "Convert meters to centimeters instantly. Formula: cm = m × 100. Example: 1 m = 100 cm. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "m to cm",
      "meters to centimeters",
      "m to cm",
      "meters centimeters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cm-to-m",
    "title": "Centimeters to Meters Converter (cm → m)",
    "description": "Convert centimeters to meters instantly. Formula: m = cm × 0.01. Example: 1 cm = 0.01 m. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "cm to m",
      "centimeters to meters",
      "cm to m",
      "centimeters meters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "km-to-m",
    "title": "Kilometers to Meters Converter (km → m)",
    "description": "Convert kilometers to meters instantly. Formula: m = km × 1000. Example: 1 km = 1000 m. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "km to m",
      "kilometers to meters",
      "km to m",
      "kilometers meters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "m-to-km",
    "title": "Meters to Kilometers Converter (m → km)",
    "description": "Convert meters to kilometers instantly. Formula: km = m × 0.001. Example: 1 m = 0.001 km. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "m to km",
      "meters to kilometers",
      "m to km",
      "meters kilometers converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "miles-to-feet",
    "title": "Miles to Feet Converter (mi → ft)",
    "description": "Convert miles (mi) to feet (ft) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "miles to feet",
      "miles to feet",
      "mi to ft",
      "miles feet converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "feet-to-miles",
    "title": "Feet to Miles Converter (ft → mi)",
    "description": "Convert feet (ft) to miles (mi) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "feet to miles",
      "feet to miles",
      "ft to mi",
      "feet miles converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "nautical-miles-to-km",
    "title": "Nautical Miles to Kilometers Converter (nmi → km)",
    "description": "Convert nautical miles to kilometers instantly. Formula: km = nmi × 1.852. Example: 1 nmi = 1.852 km. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "nautical-miles to km",
      "nautical miles to kilometers",
      "nmi to km",
      "nautical miles kilometers converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "km-to-nautical-miles",
    "title": "Kilometers to Nautical Miles Converter (km → nmi)",
    "description": "Convert kilometers to nautical miles instantly. Formula: nmi = km × 0.539957. Example: 1 km = 0.54 nmi. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "km to nautical-miles",
      "kilometers to nautical miles",
      "km to nmi",
      "kilometers nautical miles converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kg-to-lbs",
    "title": "Kilograms to Pounds Converter (kg → lb)",
    "description": "Convert kilograms to pounds instantly. Formula: lb = kg × 2.20462. Example: 1 kg = 2.2046 lb. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kg to lbs",
      "kilograms to pounds",
      "kg to lb",
      "kilograms pounds converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "lbs-to-kg",
    "title": "Pounds to Kilograms Converter (lb → kg)",
    "description": "Convert pounds to kilograms instantly. Formula: kg = lb × 0.453592. Example: 1 lb = 0.4536 kg. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "lbs to kg",
      "pounds to kilograms",
      "lb to kg",
      "pounds kilograms converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kg-to-pounds",
    "title": "Kilograms to Pounds Converter (kg → lb)",
    "description": "Convert kilograms to pounds instantly. Formula: lb = kg × 2.20462. Example: 1 kg = 2.2046 lb. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kg to pounds",
      "kilograms to pounds",
      "kg to lb",
      "kilograms pounds converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pounds-to-kg",
    "title": "Pounds to Kilograms Converter (lb → kg)",
    "description": "Convert pounds to kilograms instantly. Formula: kg = lb × 0.453592. Example: 1 lb = 0.4536 kg. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "pounds to kg",
      "pounds to kilograms",
      "lb to kg",
      "pounds kilograms converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "g-to-oz",
    "title": "Grams to Ounces Converter (g → oz)",
    "description": "Convert grams to ounces instantly. Formula: oz = g × 0.035274. Example: 1 g = 0.0353 oz. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "g to oz",
      "grams to ounces",
      "g to oz",
      "grams ounces converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "oz-to-g",
    "title": "Ounces to Grams Converter (oz → g)",
    "description": "Convert ounces to grams instantly. Formula: g = oz × 28.3495. Example: 1 oz = 28.3495 g. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "oz to g",
      "ounces to grams",
      "oz to g",
      "ounces grams converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "grams-to-ounces",
    "title": "Grams to Ounces Converter (g → oz)",
    "description": "Convert grams to ounces instantly. Formula: oz = g × 0.035274. Example: 1 g = 0.0353 oz. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "grams to ounces",
      "grams to ounces",
      "g to oz",
      "grams ounces converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ounces-to-grams",
    "title": "Ounces to Grams Converter (oz → g)",
    "description": "Convert ounces to grams instantly. Formula: g = oz × 28.3495. Example: 1 oz = 28.3495 g. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "ounces to grams",
      "ounces to grams",
      "oz to g",
      "ounces grams converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kg-to-g",
    "title": "Kilograms to Grams Converter (kg → g)",
    "description": "Convert kilograms to grams instantly. Formula: g = kg × 1000. Example: 1 kg = 1000 g. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kg to g",
      "kilograms to grams",
      "kg to g",
      "kilograms grams converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "g-to-kg",
    "title": "Grams to Kilograms Converter (g → kg)",
    "description": "Convert grams to kilograms instantly. Formula: kg = g × 0.001. Example: 1 g = 0.001 kg. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "g to kg",
      "grams to kilograms",
      "g to kg",
      "grams kilograms converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "lbs-to-oz",
    "title": "Pounds to Ounces Converter (lb → oz)",
    "description": "Convert pounds (lb) to ounces (oz) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "lbs to oz",
      "pounds to ounces",
      "lb to oz",
      "pounds ounces converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "oz-to-lbs",
    "title": "Ounces to Pounds Converter (oz → lb)",
    "description": "Convert ounces (oz) to pounds (lb) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "oz to lbs",
      "ounces to pounds",
      "oz to lb",
      "ounces pounds converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mg-to-g",
    "title": "Milligrams to Grams Converter (mg → g)",
    "description": "Convert milligrams to grams instantly. Formula: g = mg × 0.001. Example: 1 mg = 0.001 g. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mg to g",
      "milligrams to grams",
      "mg to g",
      "milligrams grams converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "g-to-mg",
    "title": "Grams to Milligrams Converter (g → mg)",
    "description": "Convert grams to milligrams instantly. Formula: mg = g × 1000. Example: 1 g = 1000 mg. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "g to mg",
      "grams to milligrams",
      "g to mg",
      "grams milligrams converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "tons-to-kg",
    "title": "Metric Tons to Kilograms Converter (t → kg)",
    "description": "Convert metric tons to kilograms instantly. Formula: kg = t × 1000. Example: 1 t = 1000 kg. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "tons to kg",
      "metric tons to kilograms",
      "t to kg",
      "metric tons kilograms converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kg-to-tons",
    "title": "Kilograms to Metric Tons Converter (kg → t)",
    "description": "Convert kilograms to metric tons instantly. Formula: t = kg × 0.001. Example: 1 kg = 0.001 t. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kg to tons",
      "kilograms to metric tons",
      "kg to t",
      "kilograms metric tons converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "stones-to-kg",
    "title": "Stones to Kilograms Converter (st → kg)",
    "description": "Convert stones to kilograms instantly. Formula: kg = st × 6.35029. Example: 1 st = 6.3503 kg. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "stones to kg",
      "stones to kilograms",
      "st to kg",
      "stones kilograms converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kg-to-stones",
    "title": "Kilograms to Stones Converter (kg → st)",
    "description": "Convert kilograms to stones instantly. Formula: st = kg × 0.157473. Example: 1 kg = 0.1575 st. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kg to stones",
      "kilograms to stones",
      "kg to st",
      "kilograms stones converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "stones-to-pounds",
    "title": "Stones to Pounds Converter (st → lb)",
    "description": "Convert stones to pounds instantly. Formula: lb = st × 14. Example: 1 st = 14 lb. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "stones to pounds",
      "stones to pounds",
      "st to lb",
      "stones pounds converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pounds-to-stones",
    "title": "Pounds to Stones Converter (lb → st)",
    "description": "Convert pounds to stones instantly. Formula: st = lb × 0.0714286. Example: 1 lb = 0.0714 st. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "pounds to stones",
      "pounds to stones",
      "lb to st",
      "pounds stones converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "liters-to-gallons",
    "title": "Liters to US Gallons Converter (L → gal)",
    "description": "Convert liters to US gallons instantly. Formula: gal = L × 0.264172. Example: 1 L = 0.2642 gal. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "liters to gallons",
      "liters to US gallons",
      "L to gal",
      "liters US gallons converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gallons-to-liters",
    "title": "US Gallons to Liters Converter (gal → L)",
    "description": "Convert US gallons to liters instantly. Formula: L = gal × 3.78541. Example: 1 gal = 3.7854 L. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "gallons to liters",
      "US gallons to liters",
      "gal to L",
      "US gallons liters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ml-to-oz",
    "title": "Milliliters to Ounces Converter (mL → oz)",
    "description": "Convert milliliters to ounces instantly. Formula: oz = mL × 0.033814. Example: 1 mL = 0.0338 oz. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "ml to oz",
      "milliliters to ounces",
      "mL to oz",
      "milliliters ounces converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "oz-to-ml",
    "title": "Ounces to Milliliters Converter (oz → mL)",
    "description": "Convert ounces to milliliters instantly. Formula: mL = oz × 29.5735. Example: 1 oz = 29.5735 mL. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "oz to ml",
      "ounces to milliliters",
      "oz to mL",
      "ounces milliliters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "cups-to-ml",
    "title": "US Cups to Milliliters Converter (cup → mL)",
    "description": "Convert US cups to milliliters instantly. Formula: mL = cup × 236.588. Example: 1 cup = 236.5882 mL. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "cups to ml",
      "US cups to milliliters",
      "cup to mL",
      "US cups milliliters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ml-to-cups",
    "title": "Milliliters to US Cups Converter (mL → cup)",
    "description": "Convert milliliters to US cups instantly. Formula: cup = mL × 0.00422675. Example: 1 mL = 0.0042 cup. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "ml to cups",
      "milliliters to US cups",
      "mL to cup",
      "milliliters US cups converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "liters-to-ml",
    "title": "Liters to Milliliters Converter (L → mL)",
    "description": "Convert liters to milliliters instantly. Formula: mL = L × 1000. Example: 1 L = 1000 mL. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "liters to ml",
      "liters to milliliters",
      "L to mL",
      "liters milliliters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ml-to-liters",
    "title": "Milliliters to Liters Converter (mL → L)",
    "description": "Convert milliliters to liters instantly. Formula: L = mL × 0.001. Example: 1 mL = 0.001 L. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "ml to liters",
      "milliliters to liters",
      "mL to L",
      "milliliters liters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "tablespoons-to-ml",
    "title": "Tablespoons to Milliliters Converter (tbsp → mL)",
    "description": "Convert tablespoons to milliliters instantly. Formula: mL = tbsp × 14.7868. Example: 1 tbsp = 14.7868 mL. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "tablespoons to ml",
      "tablespoons to milliliters",
      "tbsp to mL",
      "tablespoons milliliters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "teaspoons-to-ml",
    "title": "Teaspoons to Milliliters Converter (tsp → mL)",
    "description": "Convert teaspoons to milliliters instantly. Formula: mL = tsp × 4.92892. Example: 1 tsp = 4.9289 mL. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "teaspoons to ml",
      "teaspoons to milliliters",
      "tsp to mL",
      "teaspoons milliliters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ml-to-tablespoons",
    "title": "Milliliters to Tablespoons Converter (mL → tbsp)",
    "description": "Convert milliliters to tablespoons instantly. Formula: tbsp = mL × 0.067628. Example: 1 mL = 0.0676 tbsp. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "ml to tablespoons",
      "milliliters to tablespoons",
      "mL to tbsp",
      "milliliters tablespoons converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ml-to-teaspoons",
    "title": "Milliliters to Teaspoons Converter (mL → tsp)",
    "description": "Convert milliliters to teaspoons instantly. Formula: tsp = mL × 0.202884. Example: 1 mL = 0.2029 tsp. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "ml to teaspoons",
      "milliliters to teaspoons",
      "mL to tsp",
      "milliliters teaspoons converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pints-to-liters",
    "title": "US Pints to Liters Converter (pt → L)",
    "description": "Convert US pints (pt) to liters (L) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "pints to liters",
      "US pints to liters",
      "pt to L",
      "US pints liters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "liters-to-pints",
    "title": "Liters to US Pints Converter (L → pt)",
    "description": "Convert liters (L) to US pints (pt) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "liters to pints",
      "liters to US pints",
      "L to pt",
      "liters US pints converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "quarts-to-liters",
    "title": "US Quarts to Liters Converter (qt → L)",
    "description": "Convert US quarts (qt) to liters (L) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "quarts to liters",
      "US quarts to liters",
      "qt to L",
      "US quarts liters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "liters-to-quarts",
    "title": "Liters to US Quarts Converter (L → qt)",
    "description": "Convert liters (L) to US quarts (qt) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "liters to quarts",
      "liters to US quarts",
      "L to qt",
      "liters US quarts converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kmh-to-mph",
    "title": "Kilometers per Hour to Miles per Hour Converter (km/h → mph)",
    "description": "Convert km/h to mph instantly. Formula: mph = km/h × 0.621371. Example: 1 km/h = 0.6214 mph. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kmh to mph",
      "km/h to mph",
      "km/h to mph",
      "km/h mph converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mph-to-kmh",
    "title": "Miles per Hour to Kilometers per Hour Converter (mph → km/h)",
    "description": "Convert mph to km/h instantly. Formula: km/h = mph × 1.60934. Example: 1 mph = 1.6093 km/h. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mph to kmh",
      "mph to km/h",
      "mph to km/h",
      "mph km/h converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ms-to-kmh",
    "title": "Milliseconds to Kilometers per Hour Converter (ms → km/h)",
    "description": "Convert milliseconds (ms) to km/h (km/h) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "ms to kmh",
      "milliseconds to km/h",
      "ms to km/h",
      "milliseconds km/h converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kmh-to-ms",
    "title": "Kilometers per Hour to Milliseconds Converter (km/h → ms)",
    "description": "Convert km/h (km/h) to milliseconds (ms) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kmh to ms",
      "km/h to milliseconds",
      "km/h to ms",
      "km/h milliseconds converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ms-to-mph",
    "title": "Milliseconds to Miles per Hour Converter (ms → mph)",
    "description": "Convert milliseconds (ms) to mph (mph) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "ms to mph",
      "milliseconds to mph",
      "ms to mph",
      "milliseconds mph converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mph-to-ms",
    "title": "Miles per Hour to Milliseconds Converter (mph → ms)",
    "description": "Convert mph (mph) to milliseconds (ms) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mph to ms",
      "mph to milliseconds",
      "mph to ms",
      "mph milliseconds converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "knots-to-mph",
    "title": "Knots to Miles per Hour Converter (kn → mph)",
    "description": "Convert knots to mph instantly. Formula: mph = kn × 1.15078. Example: 1 kn = 1.1508 mph. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "knots to mph",
      "knots to mph",
      "kn to mph",
      "knots mph converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mph-to-knots",
    "title": "Miles per Hour to Knots Converter (mph → kn)",
    "description": "Convert mph to knots instantly. Formula: kn = mph × 0.868977. Example: 1 mph = 0.869 kn. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mph to knots",
      "mph to knots",
      "mph to kn",
      "mph knots converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "knots-to-kmh",
    "title": "Knots to Kilometers per Hour Converter (kn → km/h)",
    "description": "Convert knots to km/h instantly. Formula: km/h = kn × 1.852. Example: 1 kn = 1.852 km/h. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "knots to kmh",
      "knots to km/h",
      "kn to km/h",
      "knots km/h converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kmh-to-knots",
    "title": "Kilometers per Hour to Knots Converter (km/h → kn)",
    "description": "Convert km/h to knots instantly. Formula: kn = km/h × 0.539957. Example: 1 km/h = 0.54 kn. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kmh to knots",
      "km/h to knots",
      "km/h to kn",
      "km/h knots converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "seconds-to-minutes",
    "title": "Seconds to Minutes Converter (sec → min)",
    "description": "Convert seconds to minutes instantly. Formula: min = sec × 0.0166667. Example: 1 sec = 0.0167 min. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "seconds to minutes",
      "seconds to minutes",
      "sec to min",
      "seconds minutes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "minutes-to-seconds",
    "title": "Minutes to Seconds Converter (min → sec)",
    "description": "Convert minutes to seconds instantly. Formula: sec = min × 60. Example: 1 min = 60 sec. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "minutes to seconds",
      "minutes to seconds",
      "min to sec",
      "minutes seconds converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "minutes-to-hours",
    "title": "Minutes to Hours Converter (min → hr)",
    "description": "Convert minutes to hours instantly. Formula: hr = min × 0.0166667. Example: 1 min = 0.0167 hr. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "minutes to hours",
      "minutes to hours",
      "min to hr",
      "minutes hours converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hours-to-minutes",
    "title": "Hours to Minutes Converter (hr → min)",
    "description": "Convert hours to minutes instantly. Formula: min = hr × 60. Example: 1 hr = 60 min. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "hours to minutes",
      "hours to minutes",
      "hr to min",
      "hours minutes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hours-to-seconds",
    "title": "Hours to Seconds Converter (hr → sec)",
    "description": "Convert hours to seconds instantly. Formula: sec = hr × 3600. Example: 1 hr = 3600 sec. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "hours to seconds",
      "hours to seconds",
      "hr to sec",
      "hours seconds converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "seconds-to-hours",
    "title": "Seconds to Hours Converter (sec → hr)",
    "description": "Convert seconds to hours instantly. Formula: hr = sec × 0.000277778. Example: 1 sec = 0.0002778 hr. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "seconds to hours",
      "seconds to hours",
      "sec to hr",
      "seconds hours converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hours-to-days",
    "title": "Hours to Days Converter (hr → d)",
    "description": "Convert hours to days instantly. Formula: d = hr × 0.0416667. Example: 1 hr = 0.0417 d. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "hours to days",
      "hours to days",
      "hr to d",
      "hours days converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "days-to-hours",
    "title": "Days to Hours Converter (d → hr)",
    "description": "Convert days to hours instantly. Formula: hr = d × 24. Example: 1 d = 24 hr. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "days to hours",
      "days to hours",
      "d to hr",
      "days hours converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "days-to-weeks",
    "title": "Days to Weeks Converter (d → wk)",
    "description": "Convert days to weeks instantly. Formula: wk = d × 0.142857. Example: 1 d = 0.1429 wk. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "days to weeks",
      "days to weeks",
      "d to wk",
      "days weeks converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "weeks-to-days",
    "title": "Weeks to Days Converter (wk → d)",
    "description": "Convert weeks to days instantly. Formula: d = wk × 7. Example: 1 wk = 7 d. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "weeks to days",
      "weeks to days",
      "wk to d",
      "weeks days converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "days-to-months",
    "title": "Days to Months Converter (d → mo)",
    "description": "Convert days to months instantly. Formula: mo = d × 0.0333333. Example: 1 d = 0.0333 mo. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "days to months",
      "days to months",
      "d to mo",
      "days months converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "months-to-days",
    "title": "Months to Days Converter (mo → d)",
    "description": "Convert months to days instantly. Formula: d = mo × 30. Example: 1 mo = 30 d. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "months to days",
      "months to days",
      "mo to d",
      "months days converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "days-to-years",
    "title": "Days to Years Converter (d → yr)",
    "description": "Convert days to years instantly. Formula: yr = d × 0.00273973. Example: 1 d = 0.0027 yr. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "days to years",
      "days to years",
      "d to yr",
      "days years converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "years-to-days",
    "title": "Years to Days Converter (yr → d)",
    "description": "Convert years to days instantly. Formula: d = yr × 365. Example: 1 yr = 365 d. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "years to days",
      "years to days",
      "yr to d",
      "years days converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "weeks-to-months",
    "title": "Weeks to Months Converter (wk → mo)",
    "description": "Convert weeks (wk) to months (mo) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "weeks to months",
      "weeks to months",
      "wk to mo",
      "weeks months converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "months-to-weeks",
    "title": "Months to Weeks Converter (mo → wk)",
    "description": "Convert months (mo) to weeks (wk) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "months to weeks",
      "months to weeks",
      "mo to wk",
      "months weeks converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "milliseconds-to-seconds",
    "title": "Milliseconds to Seconds Converter (ms → sec)",
    "description": "Convert milliseconds to seconds instantly. Formula: sec = ms × 0.001. Example: 1 ms = 0.001 sec. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "milliseconds to seconds",
      "milliseconds to seconds",
      "ms to sec",
      "milliseconds seconds converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "seconds-to-milliseconds",
    "title": "Seconds to Milliseconds Converter (sec → ms)",
    "description": "Convert seconds to milliseconds instantly. Formula: ms = sec × 1000. Example: 1 sec = 1000 ms. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "seconds to milliseconds",
      "seconds to milliseconds",
      "sec to ms",
      "seconds milliseconds converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bytes-to-kb",
    "title": "Bytes to Kilobytes Converter (B → KB)",
    "description": "Convert bytes to kilobytes instantly. Formula: KB = B × 0.000976562. Example: 1 B = 0.0009766 KB. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "bytes to kb",
      "bytes to kilobytes",
      "B to KB",
      "bytes kilobytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kb-to-bytes",
    "title": "Kilobytes to Bytes Converter (KB → B)",
    "description": "Convert kilobytes to bytes instantly. Formula: B = KB × 1024. Example: 1 KB = 1024 B. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kb to bytes",
      "kilobytes to bytes",
      "KB to B",
      "kilobytes bytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kb-to-mb",
    "title": "Kilobytes to Megabytes Converter (KB → MB)",
    "description": "Convert kilobytes to megabytes instantly. Formula: MB = KB × 0.000976562. Example: 1 KB = 0.0009766 MB. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kb to mb",
      "kilobytes to megabytes",
      "KB to MB",
      "kilobytes megabytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mb-to-kb",
    "title": "Megabytes to Kilobytes Converter (MB → KB)",
    "description": "Convert megabytes to kilobytes instantly. Formula: KB = MB × 1024. Example: 1 MB = 1024 KB. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mb to kb",
      "megabytes to kilobytes",
      "MB to KB",
      "megabytes kilobytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mb-to-gb",
    "title": "Megabytes to Gigabytes Converter (MB → GB)",
    "description": "Convert megabytes to gigabytes instantly. Formula: GB = MB × 0.000976562. Example: 1 MB = 0.0009766 GB. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mb to gb",
      "megabytes to gigabytes",
      "MB to GB",
      "megabytes gigabytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gb-to-mb",
    "title": "Gigabytes to Megabytes Converter (GB → MB)",
    "description": "Convert gigabytes to megabytes instantly. Formula: MB = GB × 1024. Example: 1 GB = 1024 MB. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "gb to mb",
      "gigabytes to megabytes",
      "GB to MB",
      "gigabytes megabytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gb-to-tb",
    "title": "Gigabytes to Terabytes Converter (GB → TB)",
    "description": "Convert gigabytes to terabytes instantly. Formula: TB = GB × 0.000976562. Example: 1 GB = 0.0009766 TB. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "gb to tb",
      "gigabytes to terabytes",
      "GB to TB",
      "gigabytes terabytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "tb-to-gb",
    "title": "Terabytes to Gigabytes Converter (TB → GB)",
    "description": "Convert terabytes to gigabytes instantly. Formula: GB = TB × 1024. Example: 1 TB = 1024 GB. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "tb to gb",
      "terabytes to gigabytes",
      "TB to GB",
      "terabytes gigabytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "tb-to-pb",
    "title": "Terabytes to Petabytes Converter (TB → PB)",
    "description": "Convert terabytes to petabytes instantly. Formula: PB = TB × 0.000976562. Example: 1 TB = 0.0009766 PB. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "tb to pb",
      "terabytes to petabytes",
      "TB to PB",
      "terabytes petabytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pb-to-tb",
    "title": "Petabytes to Terabytes Converter (PB → TB)",
    "description": "Convert petabytes to terabytes instantly. Formula: TB = PB × 1024. Example: 1 PB = 1024 TB. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "pb to tb",
      "petabytes to terabytes",
      "PB to TB",
      "petabytes terabytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bits-to-bytes",
    "title": "Bits to Bytes Converter (b → B)",
    "description": "Convert bits to bytes instantly. Formula: B = b × 0.125. Example: 1 b = 0.125 B. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "bits to bytes",
      "bits to bytes",
      "b to B",
      "bits bytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bytes-to-bits",
    "title": "Bytes to Bits Converter (B → b)",
    "description": "Convert bytes to bits instantly. Formula: b = B × 8. Example: 1 B = 8 b. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "bytes to bits",
      "bytes to bits",
      "B to b",
      "bytes bits converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mb-to-bytes",
    "title": "Megabytes to Bytes Converter (MB → B)",
    "description": "Convert megabytes to bytes instantly. Formula: B = MB × 1048576. Example: 1 MB = 1.049e+06 B. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mb to bytes",
      "megabytes to bytes",
      "MB to B",
      "megabytes bytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gb-to-bytes",
    "title": "Gigabytes to Bytes Converter (GB → B)",
    "description": "Convert gigabytes (GB) to bytes (B) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "gb to bytes",
      "gigabytes to bytes",
      "GB to B",
      "gigabytes bytes converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kbps-to-mbps",
    "title": "Kilobits per Second to Megabits per Second Converter (kbps → Mbps)",
    "description": "Convert kilobits/sec to megabits/sec instantly. Formula: Mbps = kbps × 0.001. Example: 1 kbps = 0.001 Mbps. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kbps to mbps",
      "kilobits/sec to megabits/sec",
      "kbps to Mbps",
      "kilobits/sec megabits/sec converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mbps-to-kbps",
    "title": "Megabits per Second to Kilobits per Second Converter (Mbps → kbps)",
    "description": "Convert megabits/sec to kilobits/sec instantly. Formula: kbps = Mbps × 1000. Example: 1 Mbps = 1000 kbps. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mbps to kbps",
      "megabits/sec to kilobits/sec",
      "Mbps to kbps",
      "megabits/sec kilobits/sec converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mbps-to-gbps",
    "title": "Megabits per Second to Gigabits per Second Converter (Mbps → Gbps)",
    "description": "Convert megabits/sec to gigabits/sec instantly. Formula: Gbps = Mbps × 0.001. Example: 1 Mbps = 0.001 Gbps. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mbps to gbps",
      "megabits/sec to gigabits/sec",
      "Mbps to Gbps",
      "megabits/sec gigabits/sec converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "gbps-to-mbps",
    "title": "Gigabits per Second to Megabits per Second Converter (Gbps → Mbps)",
    "description": "Convert gigabits/sec to megabits/sec instantly. Formula: Mbps = Gbps × 1000. Example: 1 Gbps = 1000 Mbps. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "gbps to mbps",
      "gigabits/sec to megabits/sec",
      "Gbps to Mbps",
      "gigabits/sec megabits/sec converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sqft-to-sqm",
    "title": "Square Feet to Square Meters Converter (sq ft → sq m)",
    "description": "Convert square feet to square meters instantly. Formula: sq m = sq ft × 0.092903. Example: 1 sq ft = 0.0929 sq m. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "sqft to sqm",
      "square feet to square meters",
      "sq ft to sq m",
      "square feet square meters converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sqm-to-sqft",
    "title": "Square Meters to Square Feet Converter (sq m → sq ft)",
    "description": "Convert square meters to square feet instantly. Formula: sq ft = sq m × 10.7639. Example: 1 sq m = 10.7639 sq ft. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "sqm to sqft",
      "square meters to square feet",
      "sq m to sq ft",
      "square meters square feet converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "acres-to-hectares",
    "title": "Acres to Hectares Converter (ac → ha)",
    "description": "Convert acres to hectares instantly. Formula: ha = ac × 0.404686. Example: 1 ac = 0.4047 ha. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "acres to hectares",
      "acres to hectares",
      "ac to ha",
      "acres hectares converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hectares-to-acres",
    "title": "Hectares to Acres Converter (ha → ac)",
    "description": "Convert hectares to acres instantly. Formula: ac = ha × 2.47105. Example: 1 ha = 2.4711 ac. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "hectares to acres",
      "hectares to acres",
      "ha to ac",
      "hectares acres converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "acres-to-sqft",
    "title": "Acres to Square Feet Converter (ac → sq ft)",
    "description": "Convert acres (ac) to square feet (sq ft) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "acres to sqft",
      "acres to square feet",
      "ac to sq ft",
      "acres square feet converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sqft-to-acres",
    "title": "Square Feet to Acres Converter (sq ft → ac)",
    "description": "Convert square feet (sq ft) to acres (ac) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "sqft to acres",
      "square feet to acres",
      "sq ft to ac",
      "square feet acres converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sqm-to-acres",
    "title": "Square Meters to Acres Converter (sq m → ac)",
    "description": "Convert square meters to acres instantly. Formula: ac = sq m × 0.000247105. Example: 1 sq m = 0.0002471 ac. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "sqm to acres",
      "square meters to acres",
      "sq m to ac",
      "square meters acres converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sqkm-to-sqmiles",
    "title": "Square Kilometers to Square Miles Converter (sq km → sq mi)",
    "description": "Convert square km to square miles instantly. Formula: sq mi = sq km × 0.386102. Example: 1 sq km = 0.3861 sq mi. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "sqkm to sqmiles",
      "square km to square miles",
      "sq km to sq mi",
      "square km square miles converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "sqmiles-to-sqkm",
    "title": "Square Miles to Square Kilometers Converter (sq mi → sq km)",
    "description": "Convert square miles to square km instantly. Formula: sq km = sq mi × 2.58999. Example: 1 sq mi = 2.59 sq km. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "sqmiles to sqkm",
      "square miles to square km",
      "sq mi to sq km",
      "square miles square km converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "psi-to-bar",
    "title": "PSI to Bar Converter (psi → bar)",
    "description": "Convert pounds per sq inch to bar instantly. Formula: bar = psi × 0.0689476. Example: 1 psi = 0.0689 bar. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "psi to bar",
      "pounds per sq inch to bar",
      "psi to bar",
      "pounds per sq inch bar converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bar-to-psi",
    "title": "Bar to PSI Converter (bar → psi)",
    "description": "Convert bar to pounds per sq inch instantly. Formula: psi = bar × 14.5038. Example: 1 bar = 14.5038 psi. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "bar to psi",
      "bar to pounds per sq inch",
      "bar to psi",
      "bar pounds per sq inch converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "atm-to-psi",
    "title": "Atmospheres to PSI Converter (atm → psi)",
    "description": "Convert atmospheres (atm) to pounds per sq inch (psi) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "atm to psi",
      "atmospheres to pounds per sq inch",
      "atm to psi",
      "atmospheres pounds per sq inch converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "psi-to-atm",
    "title": "PSI to Atmospheres Converter (psi → atm)",
    "description": "Convert pounds per sq inch (psi) to atmospheres (atm) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "psi to atm",
      "pounds per sq inch to atmospheres",
      "psi to atm",
      "pounds per sq inch atmospheres converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "pa-to-psi",
    "title": "Pascals to PSI Converter (Pa → psi)",
    "description": "Convert pascals to pounds per sq inch instantly. Formula: psi = Pa × 0.000145038. Example: 1 Pa = 0.000145 psi. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "pa to psi",
      "pascals to pounds per sq inch",
      "Pa to psi",
      "pascals pounds per sq inch converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "psi-to-pa",
    "title": "PSI to Pascals Converter (psi → Pa)",
    "description": "Convert pounds per sq inch to pascals instantly. Formula: Pa = psi × 6894.76. Example: 1 psi = 6895 Pa. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "psi to pa",
      "pounds per sq inch to pascals",
      "psi to Pa",
      "pounds per sq inch pascals converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kpa-to-psi",
    "title": "Kilopascals to PSI Converter (kPa → psi)",
    "description": "Convert kilopascals to pounds per sq inch instantly. Formula: psi = kPa × 0.145038. Example: 1 kPa = 0.145 psi. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kpa to psi",
      "kilopascals to pounds per sq inch",
      "kPa to psi",
      "kilopascals pounds per sq inch converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "psi-to-kpa",
    "title": "PSI to Kilopascals Converter (psi → kPa)",
    "description": "Convert pounds per sq inch to kilopascals instantly. Formula: kPa = psi × 6.89476. Example: 1 psi = 6.8948 kPa. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "psi to kpa",
      "pounds per sq inch to kilopascals",
      "psi to kPa",
      "pounds per sq inch kilopascals converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "bar-to-kpa",
    "title": "Bar to Kilopascals Converter (bar → kPa)",
    "description": "Convert bar (bar) to kilopascals (kPa) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "bar to kpa",
      "bar to kilopascals",
      "bar to kPa",
      "bar kilopascals converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kpa-to-bar",
    "title": "Kilopascals to Bar Converter (kPa → bar)",
    "description": "Convert kilopascals (kPa) to bar (bar) instantly. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kpa to bar",
      "kilopascals to bar",
      "kPa to bar",
      "kilopascals bar converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "joules-to-calories",
    "title": "Joules to Calories Converter (J → cal)",
    "description": "Convert joules to calories instantly. Formula: cal = J × 0.239006. Example: 1 J = 0.239 cal. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "joules to calories",
      "joules to calories",
      "J to cal",
      "joules calories converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "calories-to-joules",
    "title": "Calories to Joules Converter (cal → J)",
    "description": "Convert calories to joules instantly. Formula: J = cal × 4.184. Example: 1 cal = 4.184 J. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "calories to joules",
      "calories to joules",
      "cal to J",
      "calories joules converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kj-to-kcal",
    "title": "Kilojoules to Kilocalories Converter (kJ → kcal)",
    "description": "Convert kilojoules to kilocalories instantly. Formula: kcal = kJ × 0.239006. Example: 1 kJ = 0.239 kcal. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kj to kcal",
      "kilojoules to kilocalories",
      "kJ to kcal",
      "kilojoules kilocalories converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kcal-to-kj",
    "title": "Kilocalories to Kilojoules Converter (kcal → kJ)",
    "description": "Convert kilocalories to kilojoules instantly. Formula: kJ = kcal × 4.184. Example: 1 kcal = 4.184 kJ. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kcal to kj",
      "kilocalories to kilojoules",
      "kcal to kJ",
      "kilocalories kilojoules converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kwh-to-joules",
    "title": "Kilowatt-hours to Joules Converter (kWh → J)",
    "description": "Convert kilowatt-hours to joules instantly. Formula: J = kWh × 3600000. Example: 1 kWh = 3.6e+06 J. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kwh to joules",
      "kilowatt-hours to joules",
      "kWh to J",
      "kilowatt-hours joules converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "joules-to-kwh",
    "title": "Joules to Kilowatt-hours Converter (J → kWh)",
    "description": "Convert joules to kilowatt-hours instantly. Formula: kWh = J × 2.77778e-07. Example: 1 J = 2.778e-07 kWh. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "joules to kwh",
      "joules to kilowatt-hours",
      "J to kWh",
      "joules kilowatt-hours converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "btu-to-joules",
    "title": "BTU to Joules Converter (BTU → J)",
    "description": "Convert BTU to joules instantly. Formula: J = BTU × 1055.06. Example: 1 BTU = 1055 J. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "btu to joules",
      "BTU to joules",
      "BTU to J",
      "BTU joules converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "joules-to-btu",
    "title": "Joules to BTU Converter (J → BTU)",
    "description": "Convert joules to BTU instantly. Formula: BTU = J × 0.000947813. Example: 1 J = 0.0009478 BTU. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "joules to btu",
      "joules to BTU",
      "J to BTU",
      "joules BTU converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "watts-to-hp",
    "title": "Watts to Horsepower Converter (W → hp)",
    "description": "Convert watts to horsepower instantly. Formula: hp = W × 0.00134102. Example: 1 W = 0.0013 hp. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "watts to hp",
      "watts to horsepower",
      "W to hp",
      "watts horsepower converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hp-to-watts",
    "title": "Horsepower to Watts Converter (hp → W)",
    "description": "Convert horsepower to watts instantly. Formula: W = hp × 745.7. Example: 1 hp = 745.6999 W. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "hp to watts",
      "horsepower to watts",
      "hp to W",
      "horsepower watts converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kw-to-hp",
    "title": "Kilowatts to Horsepower Converter (kW → hp)",
    "description": "Convert kilowatts to horsepower instantly. Formula: hp = kW × 1.34102. Example: 1 kW = 1.341 hp. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kw to hp",
      "kilowatts to horsepower",
      "kW to hp",
      "kilowatts horsepower converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hp-to-kw",
    "title": "Horsepower to Kilowatts Converter (hp → kW)",
    "description": "Convert horsepower to kilowatts instantly. Formula: kW = hp × 0.7457. Example: 1 hp = 0.7457 kW. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "hp to kw",
      "horsepower to kilowatts",
      "hp to kW",
      "horsepower kilowatts converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "degrees-to-radians",
    "title": "Degrees to Radians Converter (° → rad)",
    "description": "Convert degrees to radians instantly. Formula: rad = ° × 0.0174533. Example: 1 ° = 0.0175 rad. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "degrees to radians",
      "degrees to radians",
      "° to rad",
      "degrees radians converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "radians-to-degrees",
    "title": "Radians to Degrees Converter (rad → °)",
    "description": "Convert radians to degrees instantly. Formula: ° = rad × 57.2958. Example: 1 rad = 57.2958 °. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "radians to degrees",
      "radians to degrees",
      "rad to °",
      "radians degrees converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "hz-to-khz",
    "title": "Hertz to Kilohertz Converter (Hz → kHz)",
    "description": "Convert hertz to kilohertz instantly. Formula: kHz = Hz × 0.001. Example: 1 Hz = 0.001 kHz. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "hz to khz",
      "hertz to kilohertz",
      "Hz to kHz",
      "hertz kilohertz converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "khz-to-hz",
    "title": "Kilohertz to Hertz Converter (kHz → Hz)",
    "description": "Convert kilohertz to hertz instantly. Formula: Hz = kHz × 1000. Example: 1 kHz = 1000 Hz. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "khz to hz",
      "kilohertz to hertz",
      "kHz to Hz",
      "kilohertz hertz converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "khz-to-mhz",
    "title": "Kilohertz to Megahertz Converter (kHz → MHz)",
    "description": "Convert kilohertz to megahertz instantly. Formula: MHz = kHz × 0.001. Example: 1 kHz = 0.001 MHz. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "khz to mhz",
      "kilohertz to megahertz",
      "kHz to MHz",
      "kilohertz megahertz converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mhz-to-khz",
    "title": "Megahertz to Kilohertz Converter (MHz → kHz)",
    "description": "Convert megahertz to kilohertz instantly. Formula: kHz = MHz × 1000. Example: 1 MHz = 1000 kHz. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mhz to khz",
      "megahertz to kilohertz",
      "MHz to kHz",
      "megahertz kilohertz converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mhz-to-ghz",
    "title": "Megahertz to Gigahertz Converter (MHz → GHz)",
    "description": "Convert megahertz to gigahertz instantly. Formula: GHz = MHz × 0.001. Example: 1 MHz = 0.001 GHz. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mhz to ghz",
      "megahertz to gigahertz",
      "MHz to GHz",
      "megahertz gigahertz converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "ghz-to-mhz",
    "title": "Gigahertz to Megahertz Converter (GHz → MHz)",
    "description": "Convert gigahertz to megahertz instantly. Formula: MHz = GHz × 1000. Example: 1 GHz = 1000 MHz. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "ghz to mhz",
      "gigahertz to megahertz",
      "GHz to MHz",
      "gigahertz megahertz converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "mpg-to-kmpl",
    "title": "Miles per Gallon to Kilometers per Liter Converter (mpg → km/L)",
    "description": "Convert mpg to km/L instantly. Formula: km/L = mpg × 0.425144. Example: 30 mpg ≈ 12.75 km/L. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "mpg to kmpl",
      "mpg to km/L",
      "mpg to km/L",
      "mpg km/L converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "kmpl-to-mpg",
    "title": "Kilometers per Liter to Miles per Gallon Converter (km/L → mpg)",
    "description": "Convert km/L to mpg instantly. Formula: mpg = km/L × 2.35215. Example: 10 km/L ≈ 23.52 mpg. Free, accurate, no signup.",
    "category": "unit-converter",
    "tags": [
      "kmpl to mpg",
      "km/L to mpg",
      "km/L to mpg",
      "km/L mpg converter",
      "unit converter",
      "free converter"
    ],
    "input_kind": "text",
    "accepts_multiple": false
  },
  {
    "slug": "vocal-remover",
    "title": "Vocal Remover — Free Online (Karaoke Maker)",
    "description": "Remove vocals from any song to create instrumental/karaoke tracks. Free, no signup, real audio processing.",
    "category": "audio",
    "tags": [
      "vocal remover",
      "karaoke maker",
      "remove vocals",
      "instrumental extractor",
      "acapella remover"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "bass-booster",
    "title": "Bass Booster — Free Online Audio Bass Boost",
    "description": "Boost the bass in any audio file by up to +20 dB. Free, instant, no signup.",
    "category": "audio",
    "tags": [
      "bass booster",
      "bass boost",
      "enhance bass",
      "low end boost",
      "sub bass enhancer"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "treble-booster",
    "title": "Treble Booster — Free Online Audio Treble Boost",
    "description": "Boost treble (high frequencies) in any audio. Crisp, clear vocals — free, no signup.",
    "category": "audio",
    "tags": [
      "treble booster",
      "treble boost",
      "high frequency boost",
      "brighten audio"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "dehum-50hz",
    "title": "Remove 50 Hz Hum — Free Audio Mains Hum Remover (EU/IN)",
    "description": "Removes 50 Hz mains electrical hum and harmonics from recordings. India/Europe standard. Free, no signup.",
    "category": "audio",
    "tags": [
      "remove 50hz hum",
      "dehum 50",
      "mains hum remover",
      "electrical hum",
      "noise removal"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "dehum-60hz",
    "title": "Remove 60 Hz Hum — Free Audio Mains Hum Remover (US)",
    "description": "Removes 60 Hz mains electrical hum and harmonics. US/Japan standard. Free, no signup.",
    "category": "audio",
    "tags": [
      "remove 60hz hum",
      "dehum 60",
      "mains hum remover us",
      "electrical hum"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-pitch-shifter",
    "title": "Audio Pitch Shifter — Free Online Pitch Changer",
    "description": "Shift audio pitch up/down by semitones without changing speed. Free, no signup.",
    "category": "audio",
    "tags": [
      "pitch shifter",
      "pitch changer",
      "transpose audio",
      "pitch up",
      "pitch down"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-fader",
    "title": "Audio Fade In / Fade Out — Free Online",
    "description": "Add smooth fade-in and fade-out to any audio. Set duration in seconds. Free, no signup.",
    "category": "audio",
    "tags": [
      "audio fader",
      "fade in",
      "fade out",
      "audio fade",
      "smooth audio"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "stereo-to-mono",
    "title": "Stereo to Mono Converter — Free Online Audio",
    "description": "Convert stereo audio to mono (1 channel) for podcasts, voice notes. Free, no signup.",
    "category": "audio",
    "tags": [
      "stereo to mono",
      "mono converter",
      "single channel audio"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "mono-to-stereo",
    "title": "Mono to Stereo Converter — Free Online Audio",
    "description": "Convert mono audio to stereo (2 channels). Free, instant, no signup.",
    "category": "audio",
    "tags": [
      "mono to stereo",
      "stereo converter",
      "dual channel audio"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "audio-volume-booster",
    "title": "Audio Volume Booster — Free Online Loudness",
    "description": "Boost (or reduce) audio volume by up to ±30 dB. Free, instant, no signup.",
    "category": "audio",
    "tags": [
      "audio volume booster",
      "volume boost",
      "make audio louder",
      "loudness"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-rotate-90",
    "title": "Rotate Video 90° — Free Online Video Rotator",
    "description": "Rotate video 90° clockwise. Free, no watermark, no signup. Real H.264 output.",
    "category": "video",
    "tags": [
      "rotate video 90",
      "video rotator",
      "rotate clockwise",
      "fix portrait video"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-rotate-180",
    "title": "Rotate Video 180° — Free Online (Flip Upside Down)",
    "description": "Rotate video 180° (upside down). Free, no watermark, no signup.",
    "category": "video",
    "tags": [
      "rotate video 180",
      "flip upside down",
      "video rotator"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-rotate-270",
    "title": "Rotate Video 270° / 90° Counter-Clockwise — Free",
    "description": "Rotate video 90° counter-clockwise (270°). Free, no watermark, no signup.",
    "category": "video",
    "tags": [
      "rotate video 270",
      "rotate counter clockwise",
      "video rotator left"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-flip-horizontal",
    "title": "Flip Video Horizontally (Mirror) — Free Online",
    "description": "Mirror your video horizontally. Free, no watermark, no signup.",
    "category": "video",
    "tags": [
      "flip video",
      "mirror video",
      "horizontal flip",
      "video mirror"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-flip-vertical",
    "title": "Flip Video Vertically — Free Online",
    "description": "Flip your video vertically (top↔bottom). Free, no watermark, no signup.",
    "category": "video",
    "tags": [
      "flip video vertical",
      "vertical flip",
      "upside down video"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-deinterlacer",
    "title": "Video Deinterlacer (YADIF) — Free Online",
    "description": "Remove interlacing artifacts from old DVD/TV footage with YADIF. Free, no signup.",
    "category": "video",
    "tags": [
      "deinterlace video",
      "yadif",
      "remove interlacing",
      "dvd cleanup",
      "old video fix"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-color-grader",
    "title": "Video Color Grader — Brightness, Contrast, Saturation",
    "description": "Adjust video brightness, contrast and saturation. Free, instant, no signup.",
    "category": "video",
    "tags": [
      "video color grader",
      "brightness contrast",
      "saturation",
      "color correction"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  },
  {
    "slug": "video-audio-extractor",
    "title": "Extract Audio from Video — Free Online MP3 Export",
    "description": "Extract the audio from any video file as MP3. Free, no signup, instant.",
    "category": "video",
    "tags": [
      "extract audio from video",
      "video to mp3",
      "audio extractor",
      "rip audio"
    ],
    "input_kind": "files",
    "accepts_multiple": false
  }
]
