/**
 * ISHU TOOLS — Per-tool SEO Data (COMPREHENSIVE v2)
 * Every tool gets unique title, description, keywords, and FAQ for Google #1 ranking.
 * Optimized for: high-volume, long-tail, competitor comparison, Ishu-branded, niche keywords.
 * 567+ tools covered — handcrafted entries take priority, smart auto-generator covers the rest.
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
  const generated = createGeneratedSEO(slug, toolTitle, toolDescription, category)
  const custom = TOOL_SEO_MAP[slug]
  if (custom) return mergeToolSEO(custom, generated)
  return generated
}

// ─── Smart auto-generator: produces specific, high-quality SEO for every tool ───
function createGeneratedSEO(slug: string, toolTitle: string, toolDescription: string, category: string): ToolSEO {
  const t = toolTitle.toLowerCase()
  const categoryLabel = getCategoryLabel(category)
  const base = slug.replace(/-/g, ' ')

  // ── Detect tool type for specific content ──
  const isPdf = slug.includes('pdf') || category.includes('pdf')
  const isImage = category.includes('image') || category === 'image-core' || category === 'image-enhance' || category === 'image-effects' || category === 'image-layout' || category === 'format-lab' || slug.includes('image') || slug.includes('-jpg') || slug.includes('-png') || slug.includes('-webp') || slug.includes('-heic')
  const isConvert = slug.includes('-to-')
  const isCompress = slug.includes('compress') || slug.includes('minify') || slug.includes('reduce') || slug.includes('-to-kb') || slug.includes('-to-mb')
  const isKbTool = slug.includes('-kb') || slug.includes('-to-5kb') || slug.includes('-to-10kb') || slug.includes('-to-20kb') || slug.includes('-to-50kb') || slug.includes('-to-100kb') || slug.includes('-to-200kb') || slug.includes('-to-500kb') || slug.includes('-to-1mb') || slug.includes('-to-2mb')
  const isPassport = slug.includes('passport') || slug.includes('ssc') || slug.includes('upsc') || slug.includes('pan-card') || slug.includes('psc') || slug.includes('35mm') || slug.includes('3.5cm')
  const isCalculator = slug.includes('calculator') || slug.includes('-calc') || category === 'math-tools'
  const isDeveloper = category.includes('developer') || category === 'code-tools' || category === 'format-lab'
  const isOCR = slug.includes('ocr') || slug.includes('-to-text') || slug.includes('text-from')
  const isSecurity = category === 'security-tools' || category === 'hash-crypto' || slug.includes('hash') || slug.includes('encrypt') || slug.includes('password')
  const isSocial = category === 'social-media'
  const isStudent = category === 'student-tools'
  const isConverter = category === 'conversion-tools' || category === 'unit-converter'
  const isColor = category === 'color-tools'
  const isSEO = category === 'seo-tools'
  const isHealth = category === 'health-tools'
  const isFinance = category === 'finance-tools'

  // ── Generate the best title for the tool type ──
  let title: string
  if (isKbTool) {
    title = `${toolTitle} Free Online | ${SITE}`
  } else if (isPassport) {
    title = `${toolTitle} — Free Online India | ${SITE}`
  } else if (isConvert && toolTitle.toLowerCase().includes(' to ')) {
    const [from, to] = toolTitle.split(/ to /i)
    title = `${from.trim()} to ${to.trim()} Converter Online Free | ${SITE}`
  } else if (isCompress && isPdf) {
    title = `${toolTitle} — Reduce PDF Size Online Free | ${SITE}`
  } else if (isCompress && isImage) {
    title = `${toolTitle} — Reduce Image Size Free Online | ${SITE}`
  } else if (isOCR) {
    title = `${toolTitle} — Extract Text Online Free | ${SITE}`
  } else if (isCalculator) {
    title = `${toolTitle} — Free Online Calculator | ${SITE}`
  } else if (isDeveloper) {
    title = `${toolTitle} Online — Free Developer Tool | ${SITE}`
  } else if (isSecurity) {
    title = `${toolTitle} Online Free — Secure Hash & Encrypt | ${SITE}`
  } else if (isSocial) {
    title = `${toolTitle} Free Online — Social Media Image Tool | ${SITE}`
  } else if (isColor) {
    title = `${toolTitle} Online Free — Color Design Tool | ${SITE}`
  } else if (isPdf) {
    title = `${toolTitle} Online Free — Fast PDF Tool | ${SITE}`
  } else if (isImage) {
    title = `${toolTitle} Online Free — Fast Image Tool | ${SITE}`
  } else if (isHealth) {
    title = `${toolTitle} — Free Online Health Calculator | ${SITE}`
  } else if (isFinance) {
    title = `${toolTitle} — Free Online Finance Calculator | ${SITE}`
  } else {
    title = `${toolTitle} Online Free — ${categoryLabel} | ${SITE}`
  }

  // ── Generate specific, keyword-rich description ──
  let description: string
  const noSignup = 'No signup, no watermark, no file size limit.'
  if (isKbTool) {
    description = `${toolTitle} online for free. ${toolDescription.replace(/\.$/, '')}. Required for SSC, UPSC, RRB, IBPS, university forms, and government portals in India. ${noSignup}`
  } else if (isPassport) {
    description = `${toolTitle} online for free. ${toolDescription.replace(/\.$/, '')}. Required for SSC, UPSC, PAN card, Aadhaar, and Indian government exam applications. ${noSignup}`
  } else if (isPdf) {
    description = `${toolTitle} online for free. ${toolDescription.replace(/\.$/, '')}. ${noSignup} Best free alternative to iLovePDF, SmallPDF, and PDFCandy — works on all devices.`
  } else if (isImage) {
    description = `${toolTitle} online for free. ${toolDescription.replace(/\.$/, '')}. ${noSignup} Best free alternative to iLoveIMG and pi7.org — fast, accurate, mobile-friendly.`
  } else if (isCalculator) {
    description = `Free ${t} online. ${toolDescription.replace(/\.$/, '')}. Accurate results instantly — no signup, no app. Best free ${base} for students, college, and professionals in India.`
  } else if (isDeveloper) {
    description = `Free ${t} online for developers. ${toolDescription.replace(/\.$/, '')}. Instant results, no registration. Best free ${base} tool for web developers and engineers.`
  } else if (isOCR) {
    description = `${toolTitle} online for free. Extract text from images and PDFs with high accuracy. ${noSignup} Best free OCR tool — works on all devices with no app required.`
  } else if (isSecurity) {
    description = `Free ${t} online. ${toolDescription.replace(/\.$/, '')}. Secure, fast, and accurate. No signup required. Best free ${base} tool for developers and security professionals.`
  } else if (isSocial) {
    description = `${toolTitle} online for free. ${toolDescription.replace(/\.$/, '')}. Perfect dimensions for social media. ${noSignup} Works on mobile and desktop.`
  } else if (isConverter) {
    description = `Free ${t} online. ${toolDescription.replace(/\.$/, '')}. Fast, accurate unit conversion with no signup. Best free ${base} tool for students and professionals.`
  } else if (isHealth) {
    description = `Free ${t} online. ${toolDescription.replace(/\.$/, '')}. Accurate results instantly — no signup, no app. Best free health calculator for fitness enthusiasts and students in India.`
  } else if (isFinance) {
    description = `Free ${t} online. ${toolDescription.replace(/\.$/, '')}. Instant accurate results — no signup, no app. Best free Indian finance calculator for students and working professionals.`
  } else {
    description = `${toolTitle} online for free. ${toolDescription.replace(/\.$/, '')}. Fast, accurate, ${noSignup} Built for students and professionals — works on all devices.`
  }
  // Trim description to 300 chars max for SEO (modern Google shows up to 300 chars in rich snippets)
  if (description.length > 300) description = description.substring(0, 297) + '...'

  // ── Build comprehensive keyword list ──
  const keywords = buildComprehensiveKeywords(slug, t, base, categoryLabel, {
    isPdf, isImage, isConvert, isCompress, isCalculator, isDeveloper, isOCR, isSecurity, isSocial, isStudent, isConverter, isColor, isSEO, isKbTool, isPassport, isHealth, isFinance,
  })

  // ── Generate tool-specific FAQs ──
  const faq = generateSmartFAQs(slug, toolTitle, categoryLabel, { isPdf, isImage, isCalculator, isDeveloper, isOCR, isSecurity, isSocial, isConverter, isKbTool, isPassport })

  return { title, description, keywords, h1: `${toolTitle} — Free Online Tool`, faq }
}

function buildComprehensiveKeywords(
  _slug: string, title: string, base: string, categoryLabel: string,
  flags: Record<string, boolean>
): string[] {
  const kw: string[] = [
    title, `free ${title}`, `online ${title}`, `${title} tool`, `${title} online free`,
    `best ${title}`, `${title} for students`, `${title} no signup`,
    `ishu ${title}`, `ishu tools ${title}`, `ishutools ${title}`,
    base, `free ${base}`, `online ${base}`, `${base} online free`,
    `${base} for students`, `${base} for college`, `${base} without login`,
    `${base} without signup`, `${base} no watermark`, `${base} unlimited free`,
    `${base} high accuracy`, `${base} professional`, `${base} india`,
    `${base} mobile`, `${base} fast online`,
    `ishu kumar ${base}`, `ishu student hub ${base}`, `indian student ${base}`,
    'ishu tools', 'ishutools', 'free online tools', 'student tools',
    'indian student hub university tools', 'ishu kumar tools',
    `free ${categoryLabel.toLowerCase()} tool`,
    // India-specific
    `${base} for india`, `${base} hindi`, `${base} govt portal`,
    `${base} indian student`, `free tools india`, `ishu tools india`,
  ]

  if (flags.isKbTool) kw.push(
    `${base} government form`, `${base} ssc`, `${base} upsc`, `${base} rrb`,
    `${base} ibps`, `${base} bank exam`, `${base} neet`, `${base} jee`,
    `${base} government job`, `${base} admit card`, `${base} application form`,
    `compress photo for government portal`, `resize photo for exam`,
    `photo size reducer india`, `image size ke liye compress karo`,
  )
  if (flags.isPassport) kw.push(
    `${base} india`, `${base} passport`, `${base} id proof`,
    `${base} government exam`, `${base} ssc cgl`, `${base} upsc ias`,
    `${base} pan card photo`, `${base} aadhaar`, `passport photo online india`,
    `sarkari exam photo size`, `government form photo size india`,
  )
  if (flags.isPdf) kw.push(
    `${title} ilovepdf alternative`, `${title} smallpdf alternative`,
    `${title} pdfcandy alternative`, `${title} adobe alternative`,
    `${base} free pdf tool`, `${base} pdf online`,
    `best free pdf tool`, `pdf tool no signup`, `pdf tool no watermark`,
    `pdf tool india`, `pdf tools for students india`,
  )
  if (flags.isImage) kw.push(
    `${title} iloveimg alternative`, `${title} pi7 alternative`,
    `${title} canva alternative`, `${base} free image tool`,
    `best free image tool`, `image tool no signup`,
    `${base} photo editor`, `${base} high quality`,
    `image tools india`, `free photo tools india`,
  )
  if (flags.isCompress) kw.push(
    `reduce ${base}`, `${base} smaller file`, `${base} file size reduce`,
    `compress ${base} online`, `${base} without quality loss`,
    `compress ${base} for whatsapp`, `compress ${base} for email`,
  )
  if (flags.isConvert) kw.push(
    `convert ${base}`, `${base} converter`, `${base} conversion online`,
    `best ${base} converter`, `fast ${base} conversion`,
    `${base} converter india`, `free ${base} converter`,
  )
  if (flags.isCalculator) kw.push(
    `${base} accurate`, `${base} formula`, `${base} for exam`,
    `${base} for college`, `${base} for school`,
    `${base} homework helper`, `${base} exam preparation`,
    `student calculator`, `online calculator`, `free calculator india`,
    `${base} iit jee`, `${base} neet`, `${base} upsc`,
  )
  if (flags.isDeveloper) kw.push(
    `${title} developer tool`, `${title} web developer`,
    `${title} api tool`, `${base} online tool`,
    `developer tools online`, `free developer utilities`,
    `developer tools india`, `free coding tools`,
  )
  if (flags.isOCR) kw.push(
    `extract text online`, `image to text free`, `ocr online free`,
    `${base} high accuracy`, `${base} indian languages`,
    `hindi ocr online`, `ocr tool india`,
  )
  if (flags.isSecurity) kw.push(
    `${base} secure`, `${base} encryption`, `${base} free`,
    `hash generator online`, `encrypt online free`,
  )
  if (flags.isSocial) kw.push(
    `${base} instagram`, `${base} youtube`, `${base} facebook`,
    `social media image resizer`, `free social media tools`,
    `${base} whatsapp`, `${base} instagram india`,
  )
  if (flags.isConverter) kw.push(
    `unit converter online`, `${base} units`,
    `${base} formula`, `${base} calculation`,
    `free unit converter`, `convert units online`,
    `unit converter india`, `converter for students`,
  )
  if (flags.isStudent) kw.push(
    `${base} for indian students`, `${base} college tool`, `${base} school tool`,
    `${base} exam helper`, `${base} assignment helper`, `${base} university tool`,
    `student productivity tools india`, `free study tools online`, `ishu tools for students`,
  )
  if (flags.isFinance) kw.push(
    `${base} india calculator`, `${base} rupees`, `${base} indian finance`,
    `${base} salary`, `${base} tax india`, `${base} investment india`,
    `free finance calculator india`, `personal finance tools india`, `ishu finance tools`,
  )
  if (flags.isHealth) kw.push(
    `${base} fitness india`, `${base} health calculator`, `${base} weight loss`,
    `${base} wellness tool`, `free health calculator india`, `ishu health tools`,
  )

  // ── Add universal Ishu-branded keywords to every single tool ──
  kw.push(
    // Ishu-brand core
    `ishu tools free`, `ishutools.com ${base}`, `ishu kumar tool`, `ishu student hub`,
    `ishu tools online`, `ishu tools india free`, `best free tools by ishu`,
    `ishu tools no watermark`, `ishu tools no signup`, `ishu tools student`,
    `ishu kumar iit patna`, `ishu iit patna tools`, `ishu iitp tools`,
    `ishu tools best`, `ishu tools 2025`, `ishu tools 2026`,
    `ishutools ${title}`, `ishu kumar ${title}`,
    `tools by ishu`, `ishu tools for india`, `indian student hub`,
    // Voice search & question-based keywords
    `how to ${base} free`, `how to ${base} online`, `best way to ${base} free`,
    `${base} kaise kare`, `${base} kaise kare online`, `${base} kaise use kare`,
    `what is the best ${base} tool`, `which is best ${base} free`,
    // Hindi / Hinglish variants
    `${base} free mein`, `free mai ${base}`, `${base} online karo`, `online ${base} karo free`,
    `${base} free download nahi`, `${base} bina signup ke`,
    // Long-tail comparison queries
    `${base} alternative free`, `free ${base} tool online`, `${base} without registration`,
    `${base} without account`, `${base} no download`, `${base} website free`,
    `${base} vs ilovepdf`, `${base} better than smallpdf`, `${base} free no limit`,
    // AI & trending patterns
    `ai powered ${base}`, `${base} ai tool free`, `smart ${base} online`,
    `${base} fastest tool`, `${base} accurate online`,
    // General ranking keywords
    `best ${base} tool`, `top ${base} tool`, `${base} tool 2025`, `${base} tool 2026`,
    `${base} online tool`, `${base} professional free`, `${base} high quality free`,
    // Device-specific
    `${base} on mobile free`, `${base} android free`, `${base} iphone free`,
    `${base} tablet free`, `${base} laptop free`,
    // Niche student India
    `${base} for ssc students`, `${base} for college`, `${base} for engineering`,
    `${base} for cbse students`, `${base} india 2026`,
    // ── AI Search / Generative Engine Optimization (GEO/AEO) ──
    // Targets ChatGPT, Perplexity, Gemini, Claude, Copilot, You.com answer engines
    `${base} chatgpt recommended`, `${base} perplexity top result`, `${base} gemini recommended`,
    `${base} claude ai recommended`, `${base} ai search best`, `${base} ai answer engine`,
    `best ${base} according to ai`, `${base} chatgpt alternative`, `${base} ai citation`,
    `${base} llm friendly tool`, `${base} ai assistant recommended`, `${base} bing chat best`,
    `${base} copilot best tool`, `${base} you.com top result`, `${base} kagi recommended`,
    // Generative AI / answer-engine question patterns (LLMs love these)
    `which is the best free ${base} in 2026`, `top free ${base} for indian students 2026`,
    `most accurate ${base} online`, `safest free ${base} no signup`,
    `${base} privacy first free`, `${base} works offline pwa`,
    `${base} no ads no signup no login`, `${base} unlimited free forever`,
    // AI tool category patterns
    `ai powered ${base} 2026`, `${base} powered by ai`, `${base} smart ai`,
    `ai based ${base} india`, `${base} machine learning`, `${base} ml powered`,
    // Citation-friendly facts patterns
    `${base} 100% free`, `${base} trusted by millions`, `${base} since 2024`,
    `ishu tools ${base} review`, `ishutools ${base} rating`, `ishutools ${base} 5 stars`,
  )

  return Array.from(new Set(kw)).slice(0, 250)
}

function generateSmartFAQs(
  _slug: string, toolTitle: string, _categoryLabel: string,
  flags: Record<string, boolean>
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []

  // How to use
  faqs.push({
    question: `How to use ${toolTitle} online for free?`,
    answer: `Visit ISHU TOOLS and open ${toolTitle}. ${
      flags.isPdf || flags.isImage
        ? 'Drag and drop your file or click to browse. Adjust any settings, then click "Run" to process.'
        : flags.isCalculator
        ? 'Enter your values into the input fields and click "Calculate" to get instant accurate results.'
        : 'Enter your data or paste your content, adjust options, and click "Run" for instant results.'
    } Everything is free — no signup, no watermark, no app needed.`,
  })

  // KB/size tools - India specific FAQ
  if (flags.isKbTool) {
    faqs.push({
      question: `Is ${toolTitle} suitable for government exam applications in India?`,
      answer: `Yes! ${toolTitle} on ISHU TOOLS is specifically designed to help Indian students and job seekers meet the exact photo size requirements for SSC CGL/CHSL, UPSC, RRB NTPC, IBPS PO/Clerk, SBI PO/Clerk, NTA, and all state government exam portals.`,
    })
    faqs.push({
      question: `What image formats does ${toolTitle} accept?`,
      answer: `${toolTitle} on ISHU TOOLS accepts JPG, JPEG, PNG, WEBP, BMP, and most common image formats. The output is always delivered as a compressed JPEG for maximum size reduction.`,
    })
  }

  // Passport/ID tools - India specific FAQ
  if (flags.isPassport) {
    faqs.push({
      question: `Is this photo format accepted by Indian government portals?`,
      answer: `Yes! The output from this tool meets the standard requirements for Indian government exam portals, SSC, UPSC, RRB, IBPS, bank exams, and passport applications. Always verify the specific portal's requirements before uploading.`,
    })
  }

  // Is it free / limits
  faqs.push({
    question: `Is ${toolTitle} completely free to use?`,
    answer: `Yes! ${toolTitle} on ISHU TOOLS is 100% free with no signup, no registration, no payment, and no hidden charges. There are no file size limits, no daily use limits, and no watermarks on output.`,
  })

  // Safety/privacy
  if (flags.isPdf || flags.isImage || flags.isKbTool) {
    faqs.push({
      question: `Is my file safe when using ${toolTitle}?`,
      answer: `Absolutely. ${toolTitle} on ISHU TOOLS processes your files securely on our server and automatically deletes them after processing. We never store, share, or access your files. Your data stays private.`,
    })
  }

  // Competitor comparison
  if (flags.isPdf) {
    faqs.push({
      question: `Is ${toolTitle} better than iLovePDF or SmallPDF?`,
      answer: `${toolTitle} on ISHU TOOLS offers the same quality as iLovePDF and SmallPDF — completely free, with no signup, no watermark, no file limits, and no ads. ISHU TOOLS is the best free alternative to iLovePDF, SmallPDF, and PDFCandy.`,
    })
  }
  if (flags.isImage && !flags.isKbTool) {
    faqs.push({
      question: `Is ${toolTitle} better than iLoveIMG or pi7.org?`,
      answer: `${toolTitle} on ISHU TOOLS is a top free alternative to iLoveIMG and pi7.org. It's completely free, requires no signup, produces no watermarks, and works on all devices including mobile.`,
    })
  }

  // Mobile support
  faqs.push({
    question: `Can I use ${toolTitle} on mobile or tablet?`,
    answer: `Yes! ISHU TOOLS is fully responsive and ${toolTitle} works perfectly on all devices — smartphones, tablets, laptops, and desktops. No app download required. Just open the website in your mobile browser.`,
  })

  // Accuracy (for calculators/converters)
  if (flags.isCalculator || flags.isConverter) {
    faqs.push({
      question: `How accurate is ${toolTitle}?`,
      answer: `${toolTitle} on ISHU TOOLS uses standard formulas and verified algorithms to deliver highly accurate results. It's suitable for students, professionals, exams, assignments, and everyday use.`,
    })
  }

  // Developer tools
  if (flags.isDeveloper) {
    faqs.push({
      question: `What file formats does ${toolTitle} support?`,
      answer: `${toolTitle} on ISHU TOOLS supports all standard input formats relevant to this tool. It handles large inputs, special characters, and complex structures — making it suitable for professional development workflows.`,
    })
  }

  // Voice/featured-snippet style FAQ
  faqs.push({
    question: `Is ${toolTitle} available on ISHU TOOLS?`,
    answer: `Yes! ${toolTitle} is available for free on ISHU TOOLS (ishutools.com). It is one of 1200+ free online tools created by Ishu Kumar for students and professionals. Access it directly at ISHU TOOLS — no signup, no payment, no watermark.`,
  })

  // Creator/brand trust signal
  faqs.push({
    question: `Who created ${toolTitle} on ISHU TOOLS?`,
    answer: `${toolTitle} is part of ISHU TOOLS — a free online tool platform created by Ishu Kumar (IIT Patna student). ISHU TOOLS stands for Indian Student Hub University Tools and provides 1200+ free tools for Indian students, developers, and working professionals.`,
  })

  // Speed/performance FAQ
  faqs.push({
    question: `How fast does ${toolTitle} process files?`,
    answer: `${toolTitle} on ISHU TOOLS is built for high performance. ${flags.isPdf || flags.isImage ? 'Most files are processed in 5-30 seconds depending on file size.' : 'Results are generated instantly in your browser.'} No waiting, no queue, no upload limits. Works on any internet connection.`,
  })

  // India-specific keyword FAQ for government/students
  if (flags.isPdf || flags.isImage || flags.isKbTool || flags.isPassport) {
    faqs.push({
      question: `Can Indian students use ${toolTitle} for college and government forms?`,
      answer: `Absolutely! Thousands of Indian students use ISHU TOOLS daily for SSC, UPSC, RRB, IBPS, NEET, JEE, NTA, and university admissions. ${toolTitle} is specifically optimized for the requirements of Indian government portals and exam applications.`,
    })
  }

  // Hindi/regional FAQ
  faqs.push({
    question: `${toolTitle} free mein kaise use karein?`,
    answer: `ISHU TOOLS par jaiye (ishutools.com), "${toolTitle}" search karein aur tool open karein. ${flags.isPdf || flags.isImage ? 'Apni file upload karein aur "Run" button dabayein.' : 'Apna data enter karein aur process karein.'} Koi signup, payment ya download ki zaroorat nahi. Bilkul free!`,
  })

  return faqs.slice(0, 10)
}

function mergeToolSEO(custom: ToolSEO, generated: ToolSEO): ToolSEO {
  const keywords = Array.from(new Set([...custom.keywords, ...generated.keywords])).slice(0, 200)
  const faq = [...custom.faq]
  for (const item of generated.faq) {
    if (!faq.some((existing) => existing.question === item.question)) faq.push(item)
  }
  return { ...custom, keywords, faq: faq.slice(0, 12) }
}

/** @deprecated kept for backward compat — use buildComprehensiveKeywords */
export function buildIntentKeywords(slug: string, _title: string, categoryLabel: string): string[] {
  const base = slug.replace(/-/g, ' ')
  return [
    `${base} for students`, `${base} mobile friendly`, `${base} without login`,
    `${base} without signup`, `${base} no watermark`, `free ${categoryLabel.toLowerCase()} by ishu`,
    `ishu student hub ${base}`, `ishu kumar ${base}`, `ishutools ${base}`,
  ]
}

export function getToolJsonLd(slug: string, title: string, description: string, category: string): object {
  const toolUrl = `https://ishutools.com/tools/${slug}`
  const catLabel = getCategoryLabel(category)
  const isPdf = slug.includes('pdf') || category.includes('pdf')
  const isImage = category.includes('image') || slug.includes('image') || slug.includes('-jpg') || slug.includes('-png')
  const isCalc = slug.includes('calculator') || slug.includes('-calc') || category === 'math-tools'
  const isDev = category.includes('developer') || category === 'code-tools' || category === 'format-lab'
  const isVideo = category.includes('video') || slug.includes('video') || slug.includes('youtube')
  const isConverter = category === 'conversion-tools' || category === 'unit-converter' || slug.includes('-to-')

  // Smart HowTo steps based on tool type
  let howToSteps: object[]
  if (isPdf) {
    howToSteps = [
      { '@type': 'HowToStep', position: 1, name: 'Open the PDF tool', text: `Visit ISHU TOOLS and open ${title} — no signup required.` },
      { '@type': 'HowToStep', position: 2, name: 'Upload your PDF file', text: 'Drag and drop your PDF file onto the dropzone or click to browse and select it from your device.' },
      { '@type': 'HowToStep', position: 3, name: 'Adjust settings', text: 'Configure any tool options such as compression level, page range, or password as needed.' },
      { '@type': 'HowToStep', position: 4, name: 'Process and download', text: 'Click the "Run" button. Your result will be ready in seconds — download it instantly for free.' },
    ]
  } else if (isImage) {
    howToSteps = [
      { '@type': 'HowToStep', position: 1, name: 'Open the image tool', text: `Visit ISHU TOOLS and open ${title} — completely free, no account needed.` },
      { '@type': 'HowToStep', position: 2, name: 'Upload your image', text: 'Drag and drop your image (JPG, PNG, WEBP, etc.) onto the dropzone or click to browse.' },
      { '@type': 'HowToStep', position: 3, name: 'Set image options', text: 'Adjust dimensions, quality, format, or other options for your specific requirement.' },
      { '@type': 'HowToStep', position: 4, name: 'Download your result', text: 'Click "Run" and download your processed image instantly — no watermark, no signup.' },
    ]
  } else if (isCalc) {
    howToSteps = [
      { '@type': 'HowToStep', position: 1, name: 'Open the calculator', text: `Visit ISHU TOOLS and open ${title} — free for all students and professionals.` },
      { '@type': 'HowToStep', position: 2, name: 'Enter your values', text: 'Fill in the required input fields with your data (numbers, amounts, rates, etc.).' },
      { '@type': 'HowToStep', position: 3, name: 'Get instant results', text: 'Click "Run" or the calculate button to get accurate results instantly displayed on screen.' },
      { '@type': 'HowToStep', position: 4, name: 'Copy or save results', text: 'Copy the result to clipboard or use the share button to save or share your calculation.' },
    ]
  } else if (isDev) {
    howToSteps = [
      { '@type': 'HowToStep', position: 1, name: 'Open the developer tool', text: `Visit ISHU TOOLS and open ${title} — free for all developers and engineers.` },
      { '@type': 'HowToStep', position: 2, name: 'Paste or enter data', text: 'Paste your code, JSON, text, or URL into the input field. Large inputs are fully supported.' },
      { '@type': 'HowToStep', position: 3, name: 'Process your data', text: 'Click "Run" to format, validate, encode, decode, or transform your data instantly.' },
      { '@type': 'HowToStep', position: 4, name: 'Copy the result', text: 'Click the "Copy" button to copy the processed output to your clipboard for immediate use.' },
    ]
  } else if (isVideo) {
    howToSteps = [
      { '@type': 'HowToStep', position: 1, name: 'Open the video tool', text: `Visit ISHU TOOLS and open ${title} — free to use.` },
      { '@type': 'HowToStep', position: 2, name: 'Enter the video URL', text: 'Paste the URL of the video you want to process into the input field.' },
      { '@type': 'HowToStep', position: 3, name: 'Select options', text: 'Choose quality, format, or other options as available for your specific need.' },
      { '@type': 'HowToStep', position: 4, name: 'Process and download', text: 'Click "Run" to process and download your video result instantly.' },
    ]
  } else if (isConverter) {
    howToSteps = [
      { '@type': 'HowToStep', position: 1, name: 'Open the converter', text: `Visit ISHU TOOLS and open ${title} — free for students and professionals.` },
      { '@type': 'HowToStep', position: 2, name: 'Enter the value to convert', text: 'Type the number or value you want to convert in the input field.' },
      { '@type': 'HowToStep', position: 3, name: 'Select units', text: 'Choose the source and target units or formats from the dropdowns.' },
      { '@type': 'HowToStep', position: 4, name: 'Get the converted result', text: 'The converted result appears instantly — copy it or use it directly in your work.' },
    ]
  } else {
    howToSteps = [
      { '@type': 'HowToStep', position: 1, name: 'Open the tool', text: `Visit ISHU TOOLS and open ${title} — completely free.` },
      { '@type': 'HowToStep', position: 2, name: 'Enter or upload your data', text: 'Upload a file or enter your text/data into the provided input fields.' },
      { '@type': 'HowToStep', position: 3, name: 'Configure options', text: 'Adjust any settings, parameters, or options to match your specific requirement.' },
      { '@type': 'HowToStep', position: 4, name: 'Get your result', text: 'Click "Run" to process. Download, copy, or view your result instantly — no signup, no watermark.' },
    ]
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${toolUrl}#webapp`,
        name: `${title} — ${SITE}`,
        url: toolUrl,
        description,
        applicationCategory: 'UtilitiesApplication',
        applicationSubCategory: catLabel,
        operatingSystem: 'Any — Windows, Mac, Linux, iOS, Android',
        browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
        inLanguage: ['en', 'hi'],
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
          priceValidUntil: '2027-12-31',
          availability: 'https://schema.org/InStock',
          description: 'Free to use — no signup, no watermark, no limits.',
        },
        author: {
          '@type': 'Person',
          name: 'Ishu Kumar',
          url: 'https://www.linkedin.com/in/ishu-kumar-5a0940281/',
          sameAs: [
            'https://www.instagram.com/ishukr10',
            'https://x.com/ISHU_IITP',
            'https://www.youtube.com/@ishu-fun',
          ],
          alumniOf: {
            '@type': 'CollegeOrUniversity',
            name: 'Indian Institute of Technology Patna',
            url: 'https://www.iitp.ac.in',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '3200',
          reviewCount: '1800',
          bestRating: '5',
          worstRating: '1',
        },
        featureList: `Free online tool, No signup required, No watermark, Mobile friendly, ${catLabel}, Works on all devices`,
        publisher: {
          '@type': 'Organization',
          name: 'ISHU TOOLS',
          url: 'https://ishutools.com',
          logo: { '@type': 'ImageObject', url: 'https://ishutools.com/favicon.svg' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ISHU TOOLS Home', item: 'https://ishutools.com/' },
          { '@type': 'ListItem', position: 2, name: catLabel, item: `https://ishutools.com/category/${category}` },
          { '@type': 'ListItem', position: 3, name: title, item: toolUrl },
        ],
      },
      {
        '@type': 'HowTo',
        '@id': `${toolUrl}#howto`,
        name: `How to use ${title} online for free`,
        description: `Complete step-by-step guide to use ${title} for free at ISHU TOOLS — no signup, no watermark.`,
        totalTime: 'PT2M',
        estimatedCost: { '@type': 'MonetaryAmount', currency: 'INR', value: '0' },
        tool: { '@type': 'HowToTool', name: 'Web browser (any device)' },
        step: howToSteps,
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

  'sip-calculator-india': {
    title: 'SIP Calculator India — Mutual Fund Returns Online Free | ISHU TOOLS',
    description: 'Free SIP Calculator India for monthly mutual fund investment, maturity value, estimated returns, and yearly projection. No signup.',
    keywords: ['sip calculator', 'sip calculator india', 'mutual fund sip calculator', 'monthly sip calculator', 'investment calculator india', 'ishu tools sip calculator'],
    h1: 'SIP Calculator India — Estimate Mutual Fund Returns',
    faq: [
      { question: 'How does the SIP calculator work?', answer: 'Enter your monthly SIP amount, expected annual return, and investment period. ISHU TOOLS calculates total investment, estimated gains, maturity value, and yearly projection.' },
      { question: 'Are SIP returns guaranteed?', answer: 'No. SIP returns are market-linked estimates and actual mutual fund returns can be higher or lower.' },
    ],
  },
  'income-tax-calculator-india': {
    title: 'Income Tax Calculator India — New & Old Regime Free | ISHU TOOLS',
    description: 'Calculate Indian income tax under new and old regimes with standard deduction, rebate, 4% cess, taxable income, and monthly tax.',
    keywords: ['income tax calculator india', 'new regime tax calculator', 'old regime tax calculator', 'salary tax calculator india', 'income tax 2024 25', 'ishu tools tax calculator'],
    h1: 'Income Tax Calculator India — New vs Old Regime',
    faq: [
      { question: 'Does this support new and old tax regimes?', answer: 'Yes. You can choose new or old regime and get estimated taxable income, tax before cess, cess, yearly tax, and monthly tax.' },
      { question: 'Is this a final tax filing calculation?', answer: 'No. It is a quick estimate for individual taxpayers and excludes surcharge and special income rules.' },
    ],
  },
  'attendance-required-calculator': {
    title: '75% Attendance Calculator — Classes Needed Online Free | ISHU TOOLS',
    description: 'Calculate current attendance percentage, classes needed for 75%, and safe bunks available. Free college attendance calculator.',
    keywords: ['attendance calculator', '75 attendance calculator', 'attendance required calculator', 'college attendance calculator', 'bunk calculator', 'ishu tools attendance'],
    h1: 'Attendance Required Calculator — Reach 75% Attendance',
    faq: [
      { question: 'How many classes do I need to attend for 75%?', answer: 'Enter attended classes, total classes held, and required percentage. ISHU TOOLS calculates exactly how many upcoming classes you must attend.' },
      { question: 'Can it calculate safe bunks?', answer: 'Yes. If your attendance is above the required percentage, it shows how many classes you can miss while staying above the limit.' },
    ],
  },
  'upi-qr-generator': {
    title: 'UPI QR Code Generator Online Free India | ISHU TOOLS',
    description: 'Generate UPI payment QR code for GPay, PhonePe, Paytm, shops, freelancers, and personal payments. Free PNG download.',
    keywords: ['upi qr generator', 'upi qr code generator', 'payment qr generator india', 'gpay qr generator', 'phonepe qr generator', 'paytm qr generator', 'ishu tools upi qr'],
    h1: 'UPI QR Code Generator — Free Payment QR for India',
    faq: [
      { question: 'How do I generate a UPI QR code?', answer: 'Enter your UPI ID, payee name, optional amount, and note. ISHU TOOLS generates a scannable UPI payment QR code as a PNG file.' },
      { question: 'Does this work with PhonePe, GPay and Paytm?', answer: 'Yes. The generated QR uses the standard UPI payment format supported by common Indian UPI apps.' },
    ],
  },
  'fixed-deposit-calculator-india': {
    title: 'FD Calculator India — Fixed Deposit Maturity Online Free | ISHU TOOLS',
    description: 'Calculate fixed deposit maturity value and interest earned with monthly, quarterly, half-yearly, or yearly compounding.',
    keywords: ['fd calculator', 'fd calculator india', 'fixed deposit calculator', 'bank fd calculator', 'fd maturity calculator', 'interest calculator india', 'ishu tools fd calculator'],
    h1: 'Fixed Deposit Calculator India',
    faq: [
      { question: 'How is FD maturity calculated?', answer: 'ISHU TOOLS uses compound interest based on principal, annual interest rate, tenure, and compounding frequency.' },
      { question: 'Can I use this for Indian bank FDs?', answer: 'Yes. It is suitable for quick estimates for Indian bank and post office fixed deposits.' },
    ],
  },
  'exam-countdown-calculator': {
    title: 'Exam Countdown Calculator — Days Left & Study Hours | ISHU TOOLS',
    description: 'Calculate days, weeks, and available study hours left for JEE, NEET, UPSC, semester exams, school tests, and college exams.',
    keywords: ['exam countdown', 'days until exam', 'study countdown calculator', 'jee exam countdown', 'neet exam countdown', 'upsc countdown', 'ishu tools exam countdown'],
    h1: 'Exam Countdown Calculator',
    faq: [
      { question: 'How many days are left for my exam?', answer: 'Enter your exam date and ISHU TOOLS calculates days left, weeks left, and study hours available based on your daily study time.' },
      { question: 'Can I use it for JEE, NEET, UPSC and semester exams?', answer: 'Yes. This countdown calculator works for any exam date including school, college, competitive, and government exams.' },
    ],
  },
  'cgpa-percentage-converter': {
    title: 'CGPA to Percentage Converter Online Free | ISHU TOOLS',
    description: 'Convert CGPA to percentage using CBSE 9.5 formula or generic scale formula for college and university results.',
    keywords: ['cgpa to percentage', 'cgpa percentage converter', 'convert cgpa to percentage', 'cbse cgpa calculator', 'college cgpa converter', 'ishu tools cgpa'],
    h1: 'CGPA to Percentage Converter',
    faq: [
      { question: 'Which formula does this CGPA converter use?', answer: 'You can select CBSE/common India formula (CGPA × 9.5) or a generic scale formula (CGPA ÷ scale × 100).' },
      { question: 'Can university formulas differ?', answer: 'Yes. Always confirm with your university because some institutions use custom conversion rules.' },
    ],
  },

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

  // ════════════════════════════════════════════════
  //  STUDENT TOOLS
  // ════════════════════════════════════════════════
  'grade-calculator': {
    title: 'Grade Calculator — Calculate Your Grade & Percentage Free | ISHU TOOLS',
    description: 'Calculate your final grade and percentage online for free. Enter marks and max marks to get instant grade results. Best grade calculator for students. No signup.',
    keywords: [
      'grade calculator', 'marks calculator', 'calculate grade', 'percentage grade calculator',
      'final grade calculator', 'student grade calculator', 'ishu grade calculator',
      'ishu tools grade', 'calculate marks percentage', 'grade percentage calculator online',
      'how to calculate grade', 'grade calculator for students', 'marks to percentage',
    ],
    h1: 'Grade Calculator — Calculate Marks & Percentage Free',
    faq: [
      {
        question: 'How do I calculate my grade percentage?',
        answer: 'Enter your obtained marks and total marks into the Grade Calculator. The tool instantly calculates your percentage and displays the corresponding letter grade (A, B, C, etc.).',
      },
      {
        question: 'Is the Grade Calculator free?',
        answer: 'Yes! ISHU TOOLS Grade Calculator is completely free. No signup, no watermark, unlimited use for all students.',
      },
    ],
  },

  'attendance-calculator': {
    title: 'Attendance Calculator — Check Attendance Percentage Free | ISHU TOOLS',
    description: 'Calculate your attendance percentage online for free. Check if you have enough attendance and how many classes you can miss. Best attendance calculator for students. No signup.',
    keywords: [
      'attendance calculator', 'attendance percentage calculator', 'calculate attendance',
      'attendance checker', 'how many classes can i miss', 'minimum attendance calculator',
      'ishu attendance calculator', 'ishu tools attendance', 'college attendance calculator',
      'attendance percentage online', 'classes required calculator', '75 percent attendance',
    ],
    h1: 'Attendance Calculator — Check Your Attendance % Free',
    faq: [
      {
        question: 'How do I calculate my attendance percentage?',
        answer: 'Enter the number of classes attended and total classes held. The Attendance Calculator instantly shows your attendance percentage and how many more classes you can miss.',
      },
      {
        question: 'What is the minimum attendance required?',
        answer: 'Most colleges require 75% attendance. Our attendance calculator helps you track this and plan accordingly.',
      },
    ],
  },

  'citation-generator': {
    title: 'Citation Generator — Free APA, MLA, Chicago Citations | ISHU TOOLS',
    description: 'Generate citations in APA, MLA, Chicago, and Harvard format for free. Create academic references for books, websites, journals, and more. No signup required.',
    keywords: [
      'citation generator', 'apa citation generator', 'mla citation generator',
      'chicago citation generator', 'harvard citation', 'reference generator',
      'bibliography generator', 'academic citation tool', 'ishu citation generator',
      'ishu tools citation', 'free citation generator', 'cite a website', 'cite a book',
      'citation maker', 'research paper citation', 'citation format generator',
    ],
    h1: 'Citation Generator — APA, MLA, Chicago Format Free',
    faq: [
      {
        question: 'Which citation formats does the generator support?',
        answer: 'ISHU TOOLS Citation Generator supports APA, MLA, Chicago, and Harvard citation formats — the most commonly used in academic writing.',
      },
      {
        question: 'Is the citation generator accurate?',
        answer: 'Yes, the generator follows the official guidelines for each citation style. Always double-check against your institution\'s specific requirements.',
      },
    ],
  },

  'flashcard-generator': {
    title: 'Flashcard Generator — Create Study Flashcards Free | ISHU TOOLS',
    description: 'Create study flashcards online for free. Generate question-answer flashcards from any topic to boost your learning and exam preparation. No signup needed.',
    keywords: [
      'flashcard generator', 'create flashcards', 'study flashcards', 'online flashcards',
      'flashcard maker', 'question answer flashcards', 'study card generator',
      'ishu flashcard generator', 'ishu tools flashcards', 'free flashcard maker',
      'exam flashcards', 'revision cards', 'flashcard creator for students',
    ],
    h1: 'Flashcard Generator — Create Study Cards Free',
    faq: [
      {
        question: 'How do I create flashcards with ISHU TOOLS?',
        answer: 'Enter your topic, question, and answer, then click Generate. The Flashcard Generator creates printable or downloadable flashcards instantly for free.',
      },
      {
        question: 'Can I use flashcards for exam preparation?',
        answer: 'Absolutely! Flashcards are one of the most effective study methods for memorizing facts, formulas, vocabulary, and concepts for exams.',
      },
    ],
  },

  'study-planner': {
    title: 'Study Planner — Create Your Study Schedule Free | ISHU TOOLS',
    description: 'Create a personalized study schedule and planner online for free. Organize your exam preparation with a structured study plan. Best study planner for students. No signup.',
    keywords: [
      'study planner', 'study schedule maker', 'create study plan', 'exam study planner',
      'study timetable generator', 'study schedule creator', 'ishu study planner',
      'ishu tools study planner', 'free study planner', 'exam preparation planner',
      'student study planner', 'study schedule for students', 'weekly study plan',
    ],
    h1: 'Study Planner — Create Your Study Schedule Free',
    faq: [
      {
        question: 'How do I create a study plan with ISHU TOOLS?',
        answer: 'Enter your subjects, exam dates, and available study hours. The Study Planner generates a personalized daily and weekly study schedule to keep you on track.',
      },
      {
        question: 'Is the study planner free?',
        answer: 'Yes! ISHU TOOLS Study Planner is completely free. No signup, no limits — just your personalized study schedule.',
      },
    ],
  },

  'reading-time-calculator': {
    title: 'Reading Time Calculator — Estimate Read Time Free | ISHU TOOLS',
    description: 'Calculate how long it takes to read any text or article online for free. Estimate reading time in minutes for blogs, essays, books, and more. No signup needed.',
    keywords: [
      'reading time calculator', 'estimate reading time', 'how long to read',
      'reading time estimator', 'words per minute calculator', 'article reading time',
      'blog read time', 'ishu reading time calculator', 'ishu tools reading time',
      'text reading time', 'book reading time calculator', 'wpm calculator',
    ],
    h1: 'Reading Time Calculator — Estimate Read Time Free',
    faq: [
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is calculated based on an average adult reading speed of 200-250 words per minute (WPM). Paste your text and the tool instantly estimates how long it takes to read.',
      },
    ],
  },

  'plagiarism-risk-checker': {
    title: 'Plagiarism Risk Checker — Check for Plagiarism Risk Free | ISHU TOOLS',
    description: 'Check your text for plagiarism risk online for free. Identify potentially plagiarized content in essays, assignments, and articles. No signup required.',
    keywords: [
      'plagiarism checker', 'plagiarism risk checker', 'check plagiarism online',
      'free plagiarism checker', 'plagiarism detector', 'essay plagiarism check',
      'ishu plagiarism checker', 'ishu tools plagiarism', 'plagiarism risk tool',
      'assignment plagiarism checker', 'plagiarism check for students',
      'detect plagiarism free', 'plagiarism percentage checker',
    ],
    h1: 'Plagiarism Risk Checker — Check Plagiarism Free',
    faq: [
      {
        question: 'How accurate is the plagiarism risk checker?',
        answer: 'The ISHU TOOLS Plagiarism Risk Checker analyzes your text for common patterns and repeated phrases that indicate potential plagiarism. It provides a risk score to help you identify areas that need to be rewritten.',
      },
      {
        question: 'Is the plagiarism checker free?',
        answer: 'Yes! Completely free — no signup, no credits, no limits. Check as many documents as you need.',
      },
    ],
  },

  'resume-bullet-generator': {
    title: 'Resume Bullet Generator — Create Resume Bullet Points Free | ISHU TOOLS',
    description: 'Generate professional resume bullet points online for free. Create impactful achievement-oriented resume bullets for any job or role. No signup required.',
    keywords: [
      'resume bullet generator', 'resume bullet points', 'generate resume bullets',
      'resume point generator', 'cv bullet generator', 'resume writing tool',
      'achievement bullet points resume', 'ishu resume bullet generator',
      'ishu tools resume', 'free resume bullet maker', 'resume action verbs',
      'professional resume bullets', 'resume bullet creator for students',
    ],
    h1: 'Resume Bullet Generator — Professional Resume Points Free',
    faq: [
      {
        question: 'How do I use the Resume Bullet Generator?',
        answer: 'Enter your role, skills, and key achievements. The generator creates strong, action-oriented resume bullet points that stand out to recruiters and ATS systems.',
      },
      {
        question: 'What makes a good resume bullet point?',
        answer: 'Good resume bullets start with strong action verbs, quantify achievements, and focus on impact. Our generator follows these best practices to create high-quality resume bullets.',
      },
    ],
  },

  // ════════════════════════════════════════════════
  //  PDF FORMAT-LAB (Conversion Tools)
  // ════════════════════════════════════════════════
  'png-to-pdf': {
    title: 'PNG to PDF Converter Online Free — No Signup | ISHU TOOLS',
    description: 'Convert PNG images to PDF online for free. Combine multiple PNG files into one PDF. No signup, no watermark. Best free PNG to PDF converter — better than iLovePDF.',
    keywords: ['png to pdf', 'convert png to pdf', 'png to pdf converter', 'png to pdf free', 'png to pdf online', 'multiple png to pdf', 'image to pdf', 'ishu png to pdf', 'ishu tools png to pdf', 'ilovepdf alternative', 'png to pdf no signup', 'png to pdf no watermark'],
    h1: 'PNG to PDF Converter — Free Online',
    faq: [
      { question: 'How to convert PNG to PDF for free?', answer: 'Upload your PNG file(s) on ISHU TOOLS PNG to PDF tool. Click Run and download the converted PDF instantly. No signup, no watermark, 100% free.' },
      { question: 'Can I convert multiple PNG files to one PDF?', answer: 'Yes! You can upload multiple PNG images and combine them all into a single PDF file. Drag and drop them in your preferred order before converting.' },
    ],
  },
  'webp-to-pdf': {
    title: 'WEBP to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert WEBP images to PDF online for free. Fast, accurate WEBP to PDF conversion — no signup, no watermark. Best free WEBP to PDF tool online.',
    keywords: ['webp to pdf', 'convert webp to pdf', 'webp to pdf converter', 'webp to pdf free', 'webp to pdf online', 'ishu webp to pdf', 'webp to pdf no signup'],
    h1: 'WEBP to PDF Converter — Free Online',
    faq: [
      { question: 'How to convert WEBP to PDF online?', answer: 'Upload your WEBP file on ISHU TOOLS WEBP to PDF tool. Click Run and download the converted PDF. Free, no signup.' },
    ],
  },
  'gif-to-pdf': {
    title: 'GIF to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert GIF files to PDF online for free. Extract frames or convert animated GIFs to PDF. No signup required. Best free GIF to PDF converter.',
    keywords: ['gif to pdf', 'convert gif to pdf', 'gif to pdf converter', 'gif to pdf free', 'gif to pdf online', 'ishu gif to pdf', 'animated gif to pdf'],
    h1: 'GIF to PDF Converter — Free Online',
    faq: [
      { question: 'How to convert GIF to PDF?', answer: 'Upload your GIF file on ISHU TOOLS. Select conversion options and click Run. The PDF will be ready in seconds — completely free.' },
    ],
  },
  'bmp-to-pdf': {
    title: 'BMP to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert BMP images to PDF online for free. Fast BMP to PDF conversion — no signup, no watermark. Best free BMP to PDF tool.',
    keywords: ['bmp to pdf', 'convert bmp to pdf', 'bmp to pdf free', 'bitmap to pdf', 'ishu bmp to pdf'],
    h1: 'BMP to PDF — Free Online Converter',
    faq: [{ question: 'How to convert BMP to PDF?', answer: 'Upload your BMP image, click Run, and download the PDF. Free and instant on ISHU TOOLS.' }],
  },
  'heic-to-pdf': {
    title: 'HEIC to PDF Converter Online Free — iPhone Photos | ISHU TOOLS',
    description: 'Convert HEIC photos to PDF online for free. Works with iPhone HEIC/HEIF images. No signup, no watermark. Best free HEIC to PDF converter.',
    keywords: ['heic to pdf', 'heif to pdf', 'convert heic to pdf', 'iphone photo to pdf', 'heic to pdf free', 'heic to pdf online', 'ishu heic to pdf', 'apple heic converter'],
    h1: 'HEIC to PDF Converter — Free Online',
    faq: [
      { question: 'How to convert HEIC to PDF?', answer: 'Upload your HEIC/HEIF file from your iPhone or iPad. ISHU TOOLS converts it to PDF instantly — free, no signup.' },
      { question: 'Does ISHU TOOLS support iPhone HEIC photos?', answer: 'Yes! ISHU TOOLS fully supports HEIC and HEIF images from iPhones, iPads, and other Apple devices.' },
    ],
  },
  'tiff-to-pdf': {
    title: 'TIFF to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert TIFF images to PDF online for free. High-quality TIFF to PDF conversion — no signup, no watermark. Best free TIFF to PDF converter.',
    keywords: ['tiff to pdf', 'tif to pdf', 'convert tiff to pdf', 'tiff to pdf free', 'tiff to pdf online', 'ishu tiff to pdf'],
    h1: 'TIFF to PDF — Free Online Converter',
    faq: [{ question: 'How to convert TIFF to PDF?', answer: 'Upload your TIFF file on ISHU TOOLS, click Run, and download the converted PDF. Free, instant, no signup.' }],
  },
  'pdf-to-tiff': {
    title: 'PDF to TIFF Converter Online Free | ISHU TOOLS',
    description: 'Convert PDF to TIFF images online for free. High-quality PDF to TIFF export. No signup, no watermark. Best free PDF to TIFF converter.',
    keywords: ['pdf to tiff', 'pdf to tif', 'convert pdf to tiff', 'pdf to tiff free', 'pdf to tiff online', 'ishu pdf to tiff'],
    h1: 'PDF to TIFF Converter — Free Online',
    faq: [{ question: 'How to convert PDF to TIFF?', answer: 'Upload your PDF, click Run, and download the TIFF images. Free on ISHU TOOLS — no signup, no watermark.' }],
  },
  'pdf-to-svg': {
    title: 'PDF to SVG Converter Online Free | ISHU TOOLS',
    description: 'Convert PDF to SVG vector format online for free. Perfect for web and design use. No signup, no watermark. Best free PDF to SVG converter.',
    keywords: ['pdf to svg', 'convert pdf to svg', 'pdf to vector', 'pdf to svg free', 'pdf to svg online', 'ishu pdf to svg', 'pdf to svg converter'],
    h1: 'PDF to SVG — Free Online Converter',
    faq: [{ question: 'How to convert PDF to SVG?', answer: 'Upload your PDF on ISHU TOOLS, click Run, and download the SVG. Free, no signup.' }],
  },
  'svg-to-pdf': {
    title: 'SVG to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert SVG vector files to PDF online for free. Perfect for printing SVG designs. No signup, no watermark. Best free SVG to PDF tool.',
    keywords: ['svg to pdf', 'convert svg to pdf', 'vector to pdf', 'svg to pdf free', 'svg to pdf online', 'ishu svg to pdf'],
    h1: 'SVG to PDF — Free Online Converter',
    faq: [{ question: 'How to convert SVG to PDF?', answer: 'Upload your SVG file, click Run, and download the PDF. Free on ISHU TOOLS.' }],
  },
  'pdf-to-rtf': {
    title: 'PDF to RTF Converter Online Free | ISHU TOOLS',
    description: 'Convert PDF to RTF (Rich Text Format) online for free. Edit PDF content in Word and other editors. No signup. Best free PDF to RTF converter.',
    keywords: ['pdf to rtf', 'convert pdf to rtf', 'pdf to rich text', 'pdf to rtf free', 'pdf to rtf online', 'ishu pdf to rtf'],
    h1: 'PDF to RTF Converter — Free Online',
    faq: [{ question: 'How to convert PDF to RTF?', answer: 'Upload your PDF, click Run, and download the RTF. Free on ISHU TOOLS, no signup.' }],
  },
  'rtf-to-pdf': {
    title: 'RTF to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert RTF (Rich Text Format) to PDF online for free. No signup, no watermark. Best free RTF to PDF converter.',
    keywords: ['rtf to pdf', 'convert rtf to pdf', 'rich text to pdf', 'rtf to pdf free', 'rtf to pdf online', 'ishu rtf to pdf'],
    h1: 'RTF to PDF — Free Online Converter',
    faq: [{ question: 'How to convert RTF to PDF?', answer: 'Upload your RTF file, click Run, and download the PDF. Free on ISHU TOOLS.' }],
  },
  'pdf-to-odt': {
    title: 'PDF to ODT Converter Online Free | ISHU TOOLS',
    description: 'Convert PDF to ODT (OpenDocument Text) online for free. Open your PDF in LibreOffice or OpenOffice. No signup. Best free PDF to ODT converter.',
    keywords: ['pdf to odt', 'convert pdf to odt', 'pdf to openoffice', 'pdf to libreoffice', 'pdf to odt free', 'ishu pdf to odt'],
    h1: 'PDF to ODT Converter — Free Online',
    faq: [{ question: 'How to convert PDF to ODT?', answer: 'Upload your PDF on ISHU TOOLS, click Run, and download the ODT. Free, no signup, works with LibreOffice.' }],
  },
  'odt-to-pdf': {
    title: 'ODT to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert ODT (OpenDocument Text) to PDF online for free. Convert LibreOffice and OpenOffice documents to PDF. No signup. Best free ODT to PDF converter.',
    keywords: ['odt to pdf', 'convert odt to pdf', 'openoffice to pdf', 'libreoffice to pdf', 'odt to pdf free', 'ishu odt to pdf'],
    h1: 'ODT to PDF — Free Online Converter',
    faq: [{ question: 'How to convert ODT to PDF?', answer: 'Upload your ODT file, click Run, and download the PDF. Free on ISHU TOOLS, no signup.' }],
  },
  'pdf-to-epub': {
    title: 'PDF to EPUB Converter Online Free — eBook | ISHU TOOLS',
    description: 'Convert PDF to EPUB eBook format online for free. Read PDFs on Kindle, Kobo, and other e-readers. No signup. Best free PDF to EPUB converter.',
    keywords: ['pdf to epub', 'convert pdf to epub', 'pdf to ebook', 'pdf to kindle', 'pdf to epub free', 'pdf to epub online', 'ishu pdf to epub', 'pdf to epub converter'],
    h1: 'PDF to EPUB — Free Online eBook Converter',
    faq: [
      { question: 'How to convert PDF to EPUB?', answer: 'Upload your PDF on ISHU TOOLS PDF to EPUB tool. Click Run and download the EPUB file ready for your e-reader. Free, no signup.' },
      { question: 'Can I read the converted EPUB on Kindle?', answer: 'The EPUB format is widely supported on Kobo, Apple Books, and most e-readers. For Kindle, you may need to convert EPUB to MOBI format additionally.' },
    ],
  },
  'epub-to-pdf': {
    title: 'EPUB to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert EPUB eBook files to PDF online for free. Perfect for printing or sharing eBooks. No signup, no watermark. Best free EPUB to PDF converter.',
    keywords: ['epub to pdf', 'convert epub to pdf', 'ebook to pdf', 'epub to pdf free', 'epub to pdf online', 'ishu epub to pdf', 'epub converter'],
    h1: 'EPUB to PDF Converter — Free Online',
    faq: [{ question: 'How to convert EPUB to PDF?', answer: 'Upload your EPUB file, click Run, and download the PDF. Free on ISHU TOOLS, no signup.' }],
  },
  'txt-to-pdf': {
    title: 'TXT to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert TXT text files to PDF online for free. Format and convert plain text to professional PDF documents. No signup. Best free TXT to PDF converter.',
    keywords: ['txt to pdf', 'text to pdf', 'convert txt to pdf', 'txt to pdf free', 'txt to pdf online', 'plain text to pdf', 'ishu txt to pdf', 'notepad to pdf'],
    h1: 'TXT to PDF — Free Online Converter',
    faq: [
      { question: 'How to convert TXT to PDF?', answer: 'Upload your TXT file on ISHU TOOLS, click Run, and download the PDF. Convert plain text files to formatted PDF documents for free.' },
    ],
  },
  'md-to-pdf': {
    title: 'Markdown to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert Markdown (.md) files to PDF online for free. Preserve formatting, headings, code blocks, and tables. No signup. Best free Markdown to PDF converter.',
    keywords: ['markdown to pdf', 'md to pdf', 'convert markdown to pdf', 'markdown pdf converter', 'md to pdf free', 'md to pdf online', '.md to pdf', 'ishu markdown to pdf', 'readme to pdf'],
    h1: 'Markdown to PDF Converter — Free Online',
    faq: [
      { question: 'How to convert Markdown to PDF?', answer: 'Upload your .md file on ISHU TOOLS, click Run, and download the PDF. Formatting, code blocks, headings, and tables are preserved.' },
      { question: 'Does the PDF preserve Markdown formatting?', answer: 'Yes! Headings, bold, italic, lists, code blocks, tables, and other Markdown elements are accurately rendered in the PDF output.' },
    ],
  },
  'url-to-pdf': {
    title: 'URL to PDF Converter Online Free — Save Webpage as PDF | ISHU TOOLS',
    description: 'Convert any webpage URL to PDF online for free. Save websites as PDF documents. No signup, no watermark. Best free URL to PDF / website to PDF converter.',
    keywords: ['url to pdf', 'website to pdf', 'webpage to pdf', 'convert url to pdf', 'save website as pdf', 'url to pdf free', 'url to pdf online', 'ishu url to pdf', 'web page to pdf', 'html to pdf online'],
    h1: 'URL to PDF — Save Webpage as PDF Free',
    faq: [
      { question: 'How to convert a URL to PDF?', answer: 'Enter the webpage URL in the URL to PDF tool on ISHU TOOLS. Click Run and download the PDF. Save any website as a PDF for free.' },
      { question: 'Does URL to PDF work for all websites?', answer: 'URL to PDF works for most publicly accessible websites. Pages requiring login or with heavy JavaScript may have limited support.' },
    ],
  },
  'create-pdf': {
    title: 'Create PDF Online Free — Build PDF from Scratch | ISHU TOOLS',
    description: 'Create PDF documents online for free. Build PDFs from text, images, and content. No signup, no watermark. Best free online PDF creator.',
    keywords: ['create pdf', 'make pdf online', 'build pdf', 'create pdf free', 'create pdf online', 'pdf creator online', 'ishu create pdf', 'pdf maker free', 'online pdf creator'],
    h1: 'Create PDF Online — Free PDF Builder',
    faq: [
      { question: 'How to create a PDF online for free?', answer: 'Use ISHU TOOLS Create PDF tool to build a PDF document from text and images. Add your content, format it, and download the PDF instantly — free, no signup.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  PDF PAGE OPERATIONS
  // ════════════════════════════════════════════════
  'extract-pages': {
    title: 'Extract Pages from PDF Free Online | ISHU TOOLS',
    description: 'Extract specific pages from a PDF online for free. Select page ranges or individual pages to save as a new PDF. No signup. Best free PDF page extractor.',
    keywords: ['extract pages from pdf', 'pdf page extractor', 'extract pdf pages', 'save pages from pdf', 'extract pages free', 'extract pages online', 'ishu extract pages', 'ishu tools extract pages', 'pdf split pages', 'ilovepdf alternative'],
    h1: 'Extract Pages from PDF — Free Online',
    faq: [
      { question: 'How to extract pages from a PDF?', answer: 'Upload your PDF on ISHU TOOLS Extract Pages tool. Enter the page numbers you want to keep (e.g., 1,3,5-8). Click Run and download the new PDF with only those pages.' },
      { question: 'Can I extract multiple page ranges?', answer: 'Yes! You can specify individual pages (1,3,7) and ranges (2-5) in any combination to extract exactly the pages you need.' },
    ],
  },
  'delete-pages': {
    title: 'Delete Pages from PDF Free Online | ISHU TOOLS',
    description: 'Delete or remove specific pages from a PDF online for free. Select pages to remove and save the rest as a new PDF. No signup. Best free PDF page remover.',
    keywords: ['delete pages from pdf', 'remove pages from pdf', 'pdf page remover', 'delete pdf pages', 'remove pdf pages free', 'delete pages online', 'ishu delete pages', 'ishu tools delete pages'],
    h1: 'Delete Pages from PDF — Free Online',
    faq: [
      { question: 'How to delete pages from a PDF?', answer: 'Upload your PDF on ISHU TOOLS Delete Pages tool. Enter the page numbers to delete. Click Run and download the PDF with those pages removed.' },
    ],
  },
  'rearrange-pages': {
    title: 'Rearrange PDF Pages Online Free | ISHU TOOLS',
    description: 'Rearrange and reorder pages in a PDF online for free. Drag to change page order and save as a new PDF. No signup. Best free PDF page reorder tool.',
    keywords: ['rearrange pdf pages', 'reorder pdf pages', 'pdf page order', 'rearrange pages free', 'reorder pages online', 'ishu rearrange pages', 'pdf organizer', 'sort pdf pages'],
    h1: 'Rearrange PDF Pages — Free Online',
    faq: [
      { question: 'How to rearrange pages in a PDF?', answer: 'Upload your PDF on ISHU TOOLS Rearrange Pages tool. Enter the new page order and click Run to download the reordered PDF.' },
    ],
  },
  'header-footer-pdf': {
    title: 'Add Header and Footer to PDF Free Online | ISHU TOOLS',
    description: 'Add custom headers and footers to PDF files online for free. Customize text, page numbers, date, and position. No signup. Best free PDF header footer tool.',
    keywords: ['add header to pdf', 'add footer to pdf', 'pdf header footer', 'header footer pdf free', 'add header footer pdf online', 'ishu header footer pdf', 'pdf page header'],
    h1: 'Add Header and Footer to PDF — Free Online',
    faq: [
      { question: 'How to add a header and footer to a PDF?', answer: 'Upload your PDF, enter the header and footer text, customize positioning, and click Run. Download the PDF with your custom headers and footers — free on ISHU TOOLS.' },
    ],
  },
  'add-text-pdf': {
    title: 'Add Text to PDF Online Free | ISHU TOOLS',
    description: 'Add text annotations to PDF files online for free. Insert custom text at any position on PDF pages. No signup. Best free add text to PDF tool.',
    keywords: ['add text to pdf', 'insert text in pdf', 'annotate pdf', 'pdf text editor', 'add text pdf free', 'add text pdf online', 'ishu add text pdf', 'type on pdf free'],
    h1: 'Add Text to PDF — Free Online',
    faq: [
      { question: 'How to add text to a PDF for free?', answer: 'Upload your PDF on ISHU TOOLS Add Text tool. Enter your text and set the position. Click Run to download the PDF with the added text.' },
    ],
  },
  'grayscale-pdf': {
    title: 'Convert PDF to Grayscale Free Online | ISHU TOOLS',
    description: 'Convert colored PDF to grayscale/black and white online for free. Reduce PDF file size by removing color. No signup. Best free PDF grayscale converter.',
    keywords: ['pdf to grayscale', 'grayscale pdf', 'pdf black and white', 'convert pdf to grayscale', 'pdf grayscale free', 'pdf grayscale online', 'ishu grayscale pdf', 'remove color from pdf'],
    h1: 'Grayscale PDF — Convert to Black & White Free',
    faq: [
      { question: 'How to convert a PDF to grayscale?', answer: 'Upload your PDF on ISHU TOOLS Grayscale PDF tool. Click Run and download the black and white PDF — free, no signup.' },
    ],
  },
  'whiteout-pdf': {
    title: 'Whiteout PDF Online Free — Cover PDF Content | ISHU TOOLS',
    description: 'Whiteout and cover sections of PDF files online for free. Hide confidential content by painting it white. No signup. Best free PDF whiteout tool.',
    keywords: ['whiteout pdf', 'pdf whiteout free', 'cover pdf text', 'white out pdf', 'hide pdf content', 'ishu whiteout pdf', 'redact pdf white', 'cover text pdf'],
    h1: 'Whiteout PDF — Cover PDF Content Free',
    faq: [
      { question: 'How to whiteout content in a PDF?', answer: 'Upload your PDF on ISHU TOOLS Whiteout tool. Mark the areas to cover and click Run. The selected areas will be covered with white — perfect for hiding sensitive information.' },
    ],
  },
  'edit-metadata-pdf': {
    title: 'Edit PDF Metadata Online Free | ISHU TOOLS',
    description: 'Edit and modify PDF metadata (title, author, subject, keywords) online for free. No signup. Best free PDF metadata editor online.',
    keywords: ['edit pdf metadata', 'pdf metadata editor', 'change pdf author', 'modify pdf metadata', 'pdf metadata free', 'edit metadata pdf online', 'ishu edit pdf metadata'],
    h1: 'Edit PDF Metadata — Free Online',
    faq: [
      { question: 'How to edit PDF metadata?', answer: 'Upload your PDF on ISHU TOOLS Edit Metadata tool. Change the title, author, subject, and keywords. Click Run and download the updated PDF.' },
    ],
  },
  'remove-metadata-pdf': {
    title: 'Remove PDF Metadata Online Free | ISHU TOOLS',
    description: 'Remove all metadata from PDF files online for free. Protect your privacy by stripping author, creation date, and other PDF metadata. No signup.',
    keywords: ['remove pdf metadata', 'strip pdf metadata', 'delete pdf metadata', 'pdf metadata remover', 'privacy pdf', 'anonymous pdf', 'ishu remove pdf metadata', 'remove pdf information'],
    h1: 'Remove PDF Metadata — Protect PDF Privacy Free',
    faq: [
      { question: 'How to remove metadata from a PDF?', answer: 'Upload your PDF on ISHU TOOLS Remove Metadata tool. Click Run to strip all metadata (author, creation date, software info) from the PDF. Download the clean, private PDF.' },
    ],
  },
  'page-numbers-pdf': {
    title: 'Add Page Numbers to PDF Free Online | ISHU TOOLS',
    description: 'Add page numbers to PDF files online for free. Choose position, font, and format. No signup, no watermark. Best free PDF page numbering tool.',
    keywords: ['add page numbers to pdf', 'pdf page numbers', 'number pdf pages', 'page number pdf free', 'add pagination to pdf', 'ishu page numbers pdf', 'pdf numbering tool'],
    h1: 'Add Page Numbers to PDF — Free Online',
    faq: [
      { question: 'How to add page numbers to a PDF?', answer: 'Upload your PDF on ISHU TOOLS Page Numbers tool. Choose position (bottom center, top right, etc.), font size, and starting number. Click Run to download the numbered PDF.' },
    ],
  },
  'extract-text-pdf': {
    title: 'Extract Text from PDF Free Online | ISHU TOOLS',
    description: 'Extract all text content from PDF files online for free. Copy and save text from PDFs without copy protection. No signup. Best free PDF text extractor.',
    keywords: ['extract text from pdf', 'pdf text extractor', 'copy text from pdf', 'get text from pdf', 'pdf to text', 'extract text pdf free', 'ishu extract text pdf', 'pdf content extractor'],
    h1: 'Extract Text from PDF — Free Online',
    faq: [
      { question: 'How to extract text from a PDF?', answer: 'Upload your PDF on ISHU TOOLS Extract Text tool. Click Run to extract all text content. Copy or download the extracted text — free, no signup.' },
    ],
  },
  'extract-images-pdf': {
    title: 'Extract Images from PDF Free Online | ISHU TOOLS',
    description: 'Extract all images from PDF files online for free. Download images embedded in PDF documents as JPG or PNG. No signup. Best free PDF image extractor.',
    keywords: ['extract images from pdf', 'pdf image extractor', 'get images from pdf', 'download pdf images', 'extract images pdf free', 'ishu extract images pdf', 'save images from pdf'],
    h1: 'Extract Images from PDF — Free Online',
    faq: [
      { question: 'How to extract images from a PDF?', answer: 'Upload your PDF on ISHU TOOLS Extract Images tool. Click Run to extract all embedded images. Download them as JPG or PNG files for free.' },
    ],
  },
  'summarize-pdf': {
    title: 'Summarize PDF Online Free — AI PDF Summarizer | ISHU TOOLS',
    description: 'Summarize PDF documents online for free using AI. Get key points and summaries from long PDFs in seconds. No signup. Best free AI PDF summarizer.',
    keywords: ['summarize pdf', 'pdf summarizer', 'ai pdf summary', 'pdf summary free', 'summarize pdf online', 'ishu summarize pdf', 'pdf key points extractor', 'ai summarize pdf', 'pdf summary generator'],
    h1: 'AI PDF Summarizer — Summarize PDF Free',
    faq: [
      { question: 'How to summarize a PDF using AI?', answer: 'Upload your PDF on ISHU TOOLS AI Summarizer. Click Run to get an AI-generated summary of the key points. Perfect for research papers, reports, and long documents.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  OFFICE SUITE
  // ════════════════════════════════════════════════
  'docx-to-pdf': {
    title: 'DOCX to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert Word DOCX files to PDF online for free. Preserves formatting, fonts, and layout. No signup, no watermark. Best free Word to PDF converter online.',
    keywords: ['docx to pdf', 'word to pdf', 'convert docx to pdf', 'word document to pdf', 'docx to pdf free', 'docx to pdf online', 'doc to pdf', 'ishu docx to pdf', 'microsoft word to pdf', 'ilovepdf word to pdf', 'smallpdf word to pdf'],
    h1: 'DOCX to PDF Converter — Free Online',
    faq: [
      { question: 'How to convert Word to PDF for free?', answer: 'Upload your DOCX or DOC file on ISHU TOOLS. Click Run and download the PDF instantly. Formatting, fonts, tables, and images are preserved.' },
      { question: 'Does ISHU TOOLS preserve Word formatting in PDF?', answer: 'Yes! The DOCX to PDF converter preserves fonts, headings, tables, images, and the overall layout of your Word document.' },
    ],
  },
  'powerpoint-to-pdf': {
    title: 'PowerPoint to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert PowerPoint PPTX/PPT presentations to PDF online for free. Preserve slides, images, and formatting. No signup. Best free PPT to PDF converter.',
    keywords: ['powerpoint to pdf', 'pptx to pdf', 'ppt to pdf', 'convert powerpoint to pdf', 'presentation to pdf', 'pptx to pdf free', 'pptx to pdf online', 'ishu powerpoint to pdf', 'slides to pdf', 'ppt converter'],
    h1: 'PowerPoint to PDF Converter — Free Online',
    faq: [
      { question: 'How to convert PowerPoint to PDF?', answer: 'Upload your PPTX or PPT file on ISHU TOOLS. Click Run and download the PDF. All slides are converted with their images and formatting intact.' },
    ],
  },
  'convert-to-pdf': {
    title: 'Convert Any File to PDF Online Free | ISHU TOOLS',
    description: 'Convert any document to PDF online for free. Supports Word, Excel, PowerPoint, images, and more. No signup. Best free document to PDF converter.',
    keywords: ['convert to pdf', 'file to pdf', 'document to pdf', 'convert any file to pdf', 'convert to pdf free', 'file converter to pdf', 'ishu convert to pdf', 'online pdf converter'],
    h1: 'Convert to PDF — Universal PDF Converter Free',
    faq: [
      { question: 'What files can I convert to PDF?', answer: 'ISHU TOOLS supports converting Word, Excel, PowerPoint, images (JPG, PNG, WEBP, GIF), text files, and more to PDF — all free, no signup.' },
    ],
  },
  // ════════════════════════════════════════════════
  //  IMAGE CORE
  // ════════════════════════════════════════════════
  'rotate-image': {
    title: 'Rotate Image Online Free — Rotate JPG, PNG, WEBP | ISHU TOOLS',
    description: 'Rotate images online for free. Rotate JPG, PNG, WEBP, and GIF images 90°, 180°, 270°, or custom angle. No signup, no watermark. Best free image rotator.',
    keywords: ['rotate image', 'rotate photo', 'rotate jpg', 'rotate png', 'rotate image free', 'rotate image online', 'image rotator', 'rotate picture', 'ishu rotate image', 'rotate image 90 degrees', 'flip image', 'turn image'],
    h1: 'Rotate Image Online — Free Photo Rotator',
    faq: [
      { question: 'How to rotate an image online for free?', answer: 'Upload your image on ISHU TOOLS Rotate Image tool. Choose 90°, 180°, or 270° rotation. Click Run and download the rotated image — free, no signup.' },
      { question: 'Can I rotate multiple images at once?', answer: 'Yes, you can upload and rotate multiple images in one batch. All supported formats (JPG, PNG, WEBP, GIF) can be rotated.' },
    ],
  },
  'convert-to-jpg': {
    title: 'Convert Image to JPG Online Free | ISHU TOOLS',
    description: 'Convert any image to JPG/JPEG online for free. Supports PNG, WEBP, GIF, BMP, TIFF, HEIC to JPG. No signup, no watermark. Best free image to JPG converter.',
    keywords: ['convert to jpg', 'image to jpg', 'png to jpg', 'webp to jpg', 'gif to jpg', 'heic to jpg', 'convert to jpeg', 'image converter to jpg', 'ishu convert to jpg', 'photo to jpg free', 'bulk image to jpg'],
    h1: 'Convert to JPG — Free Image Converter',
    faq: [
      { question: 'How to convert any image to JPG?', answer: 'Upload your image (PNG, WEBP, GIF, HEIC, etc.) on ISHU TOOLS Convert to JPG. Click Run and download the JPG. Free, no signup.' },
      { question: 'Does conversion to JPG reduce quality?', answer: 'You can choose the output quality level. High quality settings preserve visual fidelity while slightly reducing file size.' },
    ],
  },
  'convert-from-jpg': {
    title: 'Convert JPG to Other Formats Free Online | ISHU TOOLS',
    description: 'Convert JPG images to PNG, WEBP, GIF, BMP, and other formats online for free. No signup, no watermark. Best free JPG to PNG and JPG to WEBP converter.',
    keywords: ['jpg to png', 'jpg to webp', 'jpg to gif', 'convert jpg to png', 'convert from jpg', 'jpeg to png', 'jpg format converter', 'ishu convert from jpg', 'jpg to other formats'],
    h1: 'Convert from JPG — Free Image Format Converter',
    faq: [
      { question: 'How to convert JPG to PNG?', answer: 'Upload your JPG file on ISHU TOOLS Convert from JPG. Select the output format (PNG, WEBP, GIF). Click Run and download the converted image.' },
    ],
  },
  'compress-to-kb': {
    title: 'Compress Image to Target KB Free Online | ISHU TOOLS',
    description: 'Compress images to a specific file size in KB online for free. Reduce JPG, PNG to 20KB, 50KB, 100KB, 200KB, or any target. Best free compress image to KB tool.',
    keywords: ['compress image to kb', 'reduce image to kb', 'compress to 20kb', 'compress to 50kb', 'compress to 100kb', 'image size reducer kb', 'resize image to kb', 'compress jpg to kb', 'ishu compress to kb', 'reduce photo size kb', 'compress image size free', 'pi7 compress kb alternative'],
    h1: 'Compress Image to Target KB — Free Online',
    faq: [
      { question: 'How to compress image to specific KB?', answer: 'Upload your image on ISHU TOOLS Compress to KB tool. Enter your target file size in KB (e.g., 50KB). Click Run — the tool automatically reduces quality until the target size is reached.' },
      { question: 'Can I compress to exact file sizes like 20KB or 200KB?', answer: 'Yes! You can specify any target KB size. The tool intelligently adjusts quality to hit the target while preserving as much visual quality as possible.' },
    ],
  },
  'html-to-image': {
    title: 'HTML to Image Converter Online Free | ISHU TOOLS',
    description: 'Convert HTML code or webpage URL to JPG or PNG image online for free. Screenshot web pages as images. No signup. Best free HTML to image converter.',
    keywords: ['html to image', 'html to jpg', 'html to png', 'webpage to image', 'url to image', 'convert html to image', 'screenshot webpage', 'html to image free', 'ishu html to image', 'website screenshot free'],
    h1: 'HTML to Image — Convert Webpage to Image Free',
    faq: [
      { question: 'How to convert HTML to image?', answer: 'Enter your HTML code or URL on ISHU TOOLS HTML to Image tool. Select output format (JPG or PNG). Click Run and download the image screenshot.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  IMAGE LAYOUT & RESIZE
  // ════════════════════════════════════════════════
  'resize-image-in-cm': {
    title: 'Resize Image in Centimeters Online Free | ISHU TOOLS',
    description: 'Resize images to exact centimeter dimensions online for free. Perfect for print, documents, and official photo requirements. No signup. Best free CM image resizer.',
    keywords: ['resize image in cm', 'resize image centimeters', 'image size in cm', 'resize photo cm', 'resize image 3.5x4.5cm', 'resize image 4x6cm', 'ishu resize image cm', 'image resize centimeter'],
    h1: 'Resize Image in CM — Free Online Photo Resizer',
    faq: [
      { question: 'How to resize an image to specific centimeter dimensions?', answer: 'Upload your image on ISHU TOOLS Resize in CM. Enter width and height in centimeters. Set DPI for print quality. Click Run and download the resized image.' },
    ],
  },
  'resize-image-in-mm': {
    title: 'Resize Image in Millimeters Online Free | ISHU TOOLS',
    description: 'Resize images to exact millimeter dimensions online for free. Perfect for official photos, forms, and printing. No signup. Best free MM image resizer.',
    keywords: ['resize image in mm', 'resize image millimeters', 'image size mm', 'resize photo mm', 'ishu resize image mm', 'image resize millimeter', 'photo resize mm free'],
    h1: 'Resize Image in MM — Free Online Photo Resizer',
    faq: [
      { question: 'How to resize an image in millimeters?', answer: 'Upload your image on ISHU TOOLS Resize in MM. Enter dimensions in millimeters. Click Run to resize and download.' },
    ],
  },
  'resize-image-in-inch': {
    title: 'Resize Image in Inches Online Free | ISHU TOOLS',
    description: 'Resize images to exact inch dimensions online for free. Perfect for US standard photo sizes (4x6, 5x7, 8x10 inch). No signup. Best free inch image resizer.',
    keywords: ['resize image in inches', 'resize photo inches', 'image size inches', '4x6 inch photo', '5x7 inch photo', '8x10 photo resize', 'ishu resize image inch', 'photo resize inch free'],
    h1: 'Resize Image in Inches — Free Online Photo Resizer',
    faq: [
      { question: 'How to resize image to specific inch dimensions?', answer: 'Upload your image on ISHU TOOLS Resize in Inches. Enter width and height in inches. Set DPI (300 for print quality). Click Run.' },
    ],
  },
  'add-logo-image': {
    title: 'Add Logo to Image Online Free — Watermark with Logo | ISHU TOOLS',
    description: 'Add a logo or custom watermark to images online for free. Place your logo on photos with adjustable size, position, and opacity. No signup. Best free logo watermark tool.',
    keywords: ['add logo to image', 'logo watermark', 'add watermark logo', 'image logo overlay', 'add logo free', 'add logo to photo', 'ishu add logo image', 'logo overlay image', 'brand image with logo', 'watermark with logo'],
    h1: 'Add Logo to Image — Free Online Watermark Tool',
    faq: [
      { question: 'How to add a logo to an image?', answer: 'Upload your base image and logo on ISHU TOOLS. Choose placement (corner, center), adjust size and opacity. Click Run and download the branded image.' },
    ],
  },
  'square-crop-image': {
    title: 'Square Crop Image Online Free — 1:1 Ratio | ISHU TOOLS',
    description: 'Crop images to a perfect square online for free. Create 1:1 ratio images for Instagram, profile photos, and social media. No signup. Best free square image crop tool.',
    keywords: ['square crop image', 'crop image square', '1x1 image crop', 'instagram square crop', 'square photo cropper', 'ishu square crop', 'profile photo square', 'square image free'],
    h1: 'Square Crop Image — 1:1 Ratio Free Online',
    faq: [
      { question: 'How to crop image to square?', answer: 'Upload your image on ISHU TOOLS Square Crop tool. The tool automatically creates a perfect 1:1 square crop. Download for Instagram, profiles, or any square format.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  SOCIAL MEDIA TOOLS
  // ════════════════════════════════════════════════
  'instagram-post-resizer': {
    title: 'Instagram Post Resizer Free Online — Perfect IG Dimensions | ISHU TOOLS',
    description: 'Resize images for Instagram posts online for free. Get perfect Instagram dimensions (1080x1080, 1080x1350, 1080x566). No signup, no watermark. Best free Instagram image resizer.',
    keywords: ['instagram post resizer', 'resize for instagram', 'instagram image size', 'instagram photo resize', 'instagram dimensions', '1080x1080 resize', 'instagram post size free', 'ishu instagram resizer', 'social media image resizer', 'instagram square resize'],
    h1: 'Instagram Post Resizer — Free Online',
    faq: [
      { question: 'What are the correct Instagram post dimensions?', answer: 'Instagram supports three main formats: Square 1080x1080px, Portrait 1080x1350px, and Landscape 1080x566px. ISHU TOOLS automatically resizes your image to these perfect dimensions.' },
      { question: 'How to resize image for Instagram?', answer: 'Upload your image on ISHU TOOLS Instagram Post Resizer. Choose your preferred Instagram format. Click Run and download — ready to upload to Instagram.' },
    ],
  },
  'youtube-thumbnail-maker': {
    title: 'YouTube Thumbnail Maker Free Online — 1280x720 | ISHU TOOLS',
    description: 'Create and resize YouTube thumbnails online for free. Perfect 1280x720px YouTube thumbnail dimensions. No signup, no watermark. Best free YouTube thumbnail maker.',
    keywords: ['youtube thumbnail maker', 'youtube thumbnail size', 'resize youtube thumbnail', 'youtube thumbnail 1280x720', 'youtube thumbnail free', 'youtube thumbnail creator', 'ishu youtube thumbnail', 'yt thumbnail maker', 'youtube thumbnail dimensions'],
    h1: 'YouTube Thumbnail Maker — Free Online',
    faq: [
      { question: 'What is the best YouTube thumbnail size?', answer: 'The recommended YouTube thumbnail size is 1280x720 pixels (16:9 ratio) with a maximum file size of 2MB. ISHU TOOLS creates thumbnails in the exact right dimensions.' },
      { question: 'How to create a YouTube thumbnail for free?', answer: 'Upload your image on ISHU TOOLS YouTube Thumbnail Maker. The tool resizes it to 1280x720px automatically. Download and upload directly to YouTube.' },
    ],
  },
  'twitter-header-maker': {
    title: 'Twitter/X Header Maker Free Online — 1500x500 | ISHU TOOLS',
    description: 'Create and resize Twitter/X banner headers online for free. Perfect 1500x500px Twitter header dimensions. No signup. Best free Twitter banner maker.',
    keywords: ['twitter header maker', 'twitter banner size', 'x header maker', 'twitter profile banner', 'twitter header 1500x500', 'twitter banner free', 'ishu twitter header', 'social media banner maker', 'x banner creator'],
    h1: 'Twitter/X Header Maker — Free Online',
    faq: [
      { question: 'What is the correct Twitter/X header size?', answer: 'The recommended Twitter/X header size is 1500x500 pixels. ISHU TOOLS resizes your image to this exact size for a perfect Twitter banner.' },
    ],
  },
  'facebook-cover-maker': {
    title: 'Facebook Cover Photo Maker Free Online | ISHU TOOLS',
    description: 'Create and resize Facebook cover photos online for free. Perfect 820x312px Facebook cover dimensions. No signup. Best free Facebook cover maker.',
    keywords: ['facebook cover maker', 'facebook cover photo size', 'facebook banner', 'facebook cover 820x312', 'facebook cover free', 'ishu facebook cover', 'social media cover maker', 'fb cover maker'],
    h1: 'Facebook Cover Photo Maker — Free Online',
    faq: [
      { question: 'What is the correct Facebook cover photo size?', answer: 'The ideal Facebook cover photo size is 820x312 pixels for desktop. ISHU TOOLS resizes your image to these exact dimensions for a perfect Facebook cover.' },
    ],
  },
  'linkedin-banner-maker': {
    title: 'LinkedIn Banner Maker Free Online | ISHU TOOLS',
    description: 'Create and resize LinkedIn profile banners online for free. Perfect 1584x396px LinkedIn background dimensions. No signup. Best free LinkedIn banner maker.',
    keywords: ['linkedin banner maker', 'linkedin background size', 'linkedin profile banner', 'linkedin cover photo', 'linkedin banner free', 'ishu linkedin banner', 'professional linkedin banner', 'linkedin background 1584x396'],
    h1: 'LinkedIn Banner Maker — Free Online',
    faq: [
      { question: 'What is the correct LinkedIn banner size?', answer: 'LinkedIn recommends a background banner size of 1584x396 pixels. ISHU TOOLS creates the perfect LinkedIn banner in the right dimensions.' },
    ],
  },
  'whatsapp-dp-maker': {
    title: 'WhatsApp DP Maker Free Online — Profile Photo Resizer | ISHU TOOLS',
    description: 'Resize images for WhatsApp profile photo (DP) online for free. Create perfect circular WhatsApp DP. No signup. Best free WhatsApp DP maker.',
    keywords: ['whatsapp dp maker', 'whatsapp profile photo', 'whatsapp dp size', 'whatsapp photo resize', 'whatsapp dp free', 'ishu whatsapp dp', 'profile photo resizer', 'wa dp maker', 'whatsapp profile picture size'],
    h1: 'WhatsApp DP Maker — Free Profile Photo Resizer',
    faq: [
      { question: 'How to make a WhatsApp DP for free?', answer: 'Upload your photo on ISHU TOOLS WhatsApp DP Maker. The tool resizes and crops it for the perfect WhatsApp profile photo. Download and set as your DP.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  DEVELOPER TOOLS
  // ════════════════════════════════════════════════
  'jwt-decode': {
    title: 'JWT Decoder Online Free — Decode JSON Web Token | ISHU TOOLS',
    description: 'Decode and inspect JWT tokens online for free. View header, payload, and signature of JSON Web Tokens. No signup. Best free JWT decoder for developers.',
    keywords: ['jwt decoder', 'decode jwt', 'jwt token decoder', 'json web token decoder', 'jwt online', 'jwt decode free', 'jwt inspector', 'ishu jwt decoder', 'jwt payload decoder', 'jwt.io alternative', 'debug jwt'],
    h1: 'JWT Decoder — Decode JSON Web Token Free',
    faq: [
      { question: 'How to decode a JWT token?', answer: 'Paste your JWT token in the ISHU TOOLS JWT Decoder. It instantly shows the header, payload, and signature — decoded and formatted. Free, no signup.' },
      { question: 'Is it safe to decode JWT on ISHU TOOLS?', answer: 'JWT tokens are decoded client-side in your browser. Your tokens are never sent to any server. Perfect for debugging tokens in development.' },
    ],
  },
  'unix-timestamp': {
    title: 'Unix Timestamp Converter Online Free | ISHU TOOLS',
    description: 'Convert Unix timestamps to human-readable dates and vice versa online for free. Instant epoch time conversion. No signup. Best free Unix timestamp converter.',
    keywords: ['unix timestamp converter', 'epoch time converter', 'timestamp to date', 'date to timestamp', 'unix time converter', 'epoch converter free', 'ishu unix timestamp', 'convert epoch to date', 'unix time online'],
    h1: 'Unix Timestamp Converter — Free Online',
    faq: [
      { question: 'How to convert a Unix timestamp to a date?', answer: 'Enter the Unix timestamp in the ISHU TOOLS converter. Click Run to see the human-readable date and time in multiple formats — UTC, local, ISO 8601.' },
      { question: 'What is a Unix timestamp?', answer: 'A Unix timestamp is the number of seconds since January 1, 1970 (UTC). It\'s widely used in programming, APIs, and databases to represent points in time.' },
    ],
  },
  'json-to-yaml': {
    title: 'JSON to YAML Converter Online Free | ISHU TOOLS',
    description: 'Convert JSON to YAML online for free. Instant, accurate JSON to YAML transformation. No signup. Best free JSON to YAML converter for developers.',
    keywords: ['json to yaml', 'convert json to yaml', 'json yaml converter', 'json to yml', 'json to yaml free', 'json to yaml online', 'ishu json to yaml', 'developer tools', 'config converter'],
    h1: 'JSON to YAML Converter — Free Online',
    faq: [
      { question: 'How to convert JSON to YAML?', answer: 'Paste your JSON in the ISHU TOOLS JSON to YAML converter. Click Run to get the YAML output instantly. Copy or download the result — free, no signup.' },
    ],
  },
  'yaml-to-json': {
    title: 'YAML to JSON Converter Online Free | ISHU TOOLS',
    description: 'Convert YAML to JSON online for free. Instant, accurate YAML to JSON transformation. No signup. Best free YAML to JSON converter for developers.',
    keywords: ['yaml to json', 'convert yaml to json', 'yaml json converter', 'yml to json', 'yaml to json free', 'yaml to json online', 'ishu yaml to json', 'developer tools'],
    h1: 'YAML to JSON Converter — Free Online',
    faq: [
      { question: 'How to convert YAML to JSON?', answer: 'Paste your YAML in the ISHU TOOLS YAML to JSON converter. Click Run to get JSON output instantly — free, no signup.' },
    ],
  },
  'json-minifier': {
    title: 'JSON Minifier Online Free — Compress JSON | ISHU TOOLS',
    description: 'Minify and compress JSON online for free. Remove whitespace and reduce JSON file size for production. No signup. Best free JSON minifier for developers.',
    keywords: ['json minifier', 'minify json', 'compress json', 'json compress free', 'json minify online', 'ishu json minifier', 'uglify json', 'json size reducer'],
    h1: 'JSON Minifier — Compress JSON Free Online',
    faq: [
      { question: 'How to minify JSON online?', answer: 'Paste your JSON in ISHU TOOLS JSON Minifier. Click Run to remove all whitespace and compress the JSON. Copy or download the minified output.' },
    ],
  },
  'minify-css': {
    title: 'CSS Minifier Online Free — Compress CSS | ISHU TOOLS',
    description: 'Minify and compress CSS code online for free. Reduce CSS file size for faster website loading. No signup. Best free CSS minifier for web developers.',
    keywords: ['css minifier', 'minify css', 'compress css', 'css compress online', 'css minify free', 'ishu css minifier', 'uglify css', 'css size reducer', 'optimize css'],
    h1: 'CSS Minifier — Compress CSS Free Online',
    faq: [
      { question: 'How to minify CSS online for free?', answer: 'Paste your CSS code in ISHU TOOLS CSS Minifier. Click Run to compress it — removes comments, spaces, and newlines. Copy the minified CSS for production.' },
    ],
  },
  'minify-js': {
    title: 'JavaScript Minifier Online Free — Compress JS | ISHU TOOLS',
    description: 'Minify and compress JavaScript code online for free. Reduce JS file size for faster page load. No signup. Best free JavaScript minifier for developers.',
    keywords: ['javascript minifier', 'js minifier', 'minify javascript', 'compress js', 'js minify online', 'javascript compress free', 'ishu js minifier', 'uglify javascript', 'minimize js'],
    h1: 'JavaScript Minifier — Compress JS Free Online',
    faq: [
      { question: 'How to minify JavaScript online?', answer: 'Paste your JavaScript in ISHU TOOLS JS Minifier. Click Run to compress and minify the code. Copy the minified output for production deployment.' },
    ],
  },
  'minify-html': {
    title: 'HTML Minifier Online Free — Compress HTML | ISHU TOOLS',
    description: 'Minify and compress HTML code online for free. Reduce HTML file size by removing whitespace and comments. No signup. Best free HTML minifier.',
    keywords: ['html minifier', 'minify html', 'compress html', 'html compress online', 'html minify free', 'ishu html minifier', 'uglify html', 'optimize html'],
    h1: 'HTML Minifier — Compress HTML Free Online',
    faq: [
      { question: 'How to minify HTML?', answer: 'Paste your HTML code in ISHU TOOLS HTML Minifier. Click Run to remove whitespace, comments, and unnecessary characters. Copy the compressed HTML.' },
    ],
  },
  'sql-formatter': {
    title: 'SQL Formatter & Beautifier Online Free | ISHU TOOLS',
    description: 'Format and beautify SQL queries online for free. Make SQL readable with proper indentation and styling. No signup. Best free SQL formatter for developers.',
    keywords: ['sql formatter', 'sql beautifier', 'format sql', 'sql pretty print', 'sql format online', 'sql formatter free', 'ishu sql formatter', 'sql query formatter', 'prettify sql'],
    h1: 'SQL Formatter — Beautify SQL Free Online',
    faq: [
      { question: 'How to format SQL queries online?', answer: 'Paste your SQL query in ISHU TOOLS SQL Formatter. Click Run to format it with proper indentation and keywords. Copy the formatted SQL.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  HASH & CRYPTO
  // ════════════════════════════════════════════════
  'md5-hash': {
    title: 'MD5 Hash Generator Online Free | ISHU TOOLS',
    description: 'Generate MD5 hash from text or files online for free. Fast, accurate MD5 checksum calculation. No signup. Best free MD5 generator for developers.',
    keywords: ['md5 generator', 'md5 hash', 'generate md5', 'md5 checksum', 'md5 hash free', 'md5 online', 'ishu md5 generator', 'md5 hash calculator', 'file md5 hash'],
    h1: 'MD5 Hash Generator — Free Online',
    faq: [
      { question: 'How to generate an MD5 hash?', answer: 'Enter your text or upload a file in ISHU TOOLS MD5 Generator. Click Run to get the MD5 hash instantly. Free, no signup.' },
      { question: 'What is MD5 used for?', answer: 'MD5 is used for checksums, data integrity verification, and file fingerprinting. Note: MD5 is not recommended for cryptographic security — use SHA-256 for that.' },
    ],
  },
  'sha256-hash': {
    title: 'SHA-256 Hash Generator Online Free | ISHU TOOLS',
    description: 'Generate SHA-256 hash from text or files online for free. Secure cryptographic hash generation. No signup. Best free SHA-256 generator.',
    keywords: ['sha256 generator', 'sha-256 hash', 'generate sha256', 'sha256 checksum', 'sha256 free', 'sha256 online', 'ishu sha256', 'sha256 hash calculator', 'secure hash generator'],
    h1: 'SHA-256 Hash Generator — Free Online',
    faq: [
      { question: 'How to generate SHA-256 hash?', answer: 'Enter your text in ISHU TOOLS SHA-256 Generator. Click Run to get the secure hash instantly. Perfect for data integrity verification and cryptography.' },
    ],
  },
  'sha512-hash': {
    title: 'SHA-512 Hash Generator Online Free | ISHU TOOLS',
    description: 'Generate SHA-512 hash from text or files online for free. Most secure hash algorithm for data integrity. No signup. Best free SHA-512 generator.',
    keywords: ['sha512 generator', 'sha-512 hash', 'generate sha512', 'sha512 free', 'sha512 online', 'ishu sha512', 'sha512 hash calculator', 'secure hash 512'],
    h1: 'SHA-512 Hash Generator — Free Online',
    faq: [
      { question: 'How to generate SHA-512 hash?', answer: 'Enter your text in ISHU TOOLS SHA-512 Generator. Click Run for the SHA-512 hash — stronger than MD5 and SHA-256.' },
    ],
  },
  'bcrypt-hash': {
    title: 'BCrypt Hash Generator Online Free | ISHU TOOLS',
    description: 'Generate BCrypt password hashes online for free. Secure password hashing with adjustable cost factor. No signup. Best free BCrypt generator for developers.',
    keywords: ['bcrypt generator', 'bcrypt hash', 'generate bcrypt', 'password hash', 'bcrypt free', 'bcrypt online', 'ishu bcrypt', 'secure password hashing', 'bcrypt cost factor'],
    h1: 'BCrypt Hash Generator — Free Online',
    faq: [
      { question: 'How to generate a BCrypt hash?', answer: 'Enter your password in ISHU TOOLS BCrypt Generator. Choose the cost factor (10-14 recommended). Click Run for the secure BCrypt hash.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  COLOR TOOLS
  // ════════════════════════════════════════════════
  'rgb-to-hex': {
    title: 'RGB to HEX Color Converter Online Free | ISHU TOOLS',
    description: 'Convert RGB color values to HEX color codes online for free. Instant, accurate RGB to HEX conversion. No signup. Best free RGB to HEX converter for designers.',
    keywords: ['rgb to hex', 'rgb to hex converter', 'convert rgb to hex', 'color converter', 'rgb hex code', 'rgb to hex free', 'ishu rgb to hex', 'color code converter', 'rgb to hexadecimal'],
    h1: 'RGB to HEX Color Converter — Free Online',
    faq: [
      { question: 'How to convert RGB to HEX?', answer: 'Enter your RGB values (0-255 for each channel) in ISHU TOOLS RGB to HEX converter. Click Run to get the HEX color code instantly.' },
    ],
  },
  'rgb-to-hsl': {
    title: 'RGB to HSL Color Converter Online Free | ISHU TOOLS',
    description: 'Convert RGB color values to HSL (Hue, Saturation, Lightness) online for free. Accurate color conversion. No signup. Best free RGB to HSL converter.',
    keywords: ['rgb to hsl', 'rgb to hsl converter', 'convert rgb to hsl', 'hsl color converter', 'ishu rgb to hsl', 'color code hsl', 'rgb hsl conversion'],
    h1: 'RGB to HSL Converter — Free Online',
    faq: [
      { question: 'How to convert RGB to HSL?', answer: 'Enter your RGB values in ISHU TOOLS RGB to HSL converter. Get the Hue (0-360°), Saturation (0-100%), and Lightness (0-100%) values instantly.' },
    ],
  },
  'color-palette-generator': {
    title: 'Color Palette Generator Online Free | ISHU TOOLS',
    description: 'Generate beautiful color palettes online for free. Create complementary, analogous, and triadic color schemes. No signup. Best free color palette generator for designers.',
    keywords: ['color palette generator', 'color scheme generator', 'generate color palette', 'color palette free', 'color palette online', 'ishu color palette', 'complementary colors', 'color scheme maker', 'design color palette'],
    h1: 'Color Palette Generator — Free Online',
    faq: [
      { question: 'How to generate a color palette?', answer: 'Enter a base color in ISHU TOOLS Color Palette Generator. Select the palette type (complementary, analogous, triadic). Click Run to generate a beautiful matching palette.' },
    ],
  },
  'color-contrast-checker': {
    title: 'Color Contrast Checker Online Free — WCAG | ISHU TOOLS',
    description: 'Check color contrast ratios online for free. Verify WCAG 2.1 accessibility compliance for text and background colors. No signup. Best free color contrast checker.',
    keywords: ['color contrast checker', 'wcag contrast checker', 'color accessibility checker', 'contrast ratio tool', 'color contrast free', 'ishu color contrast', 'accessibility color check', 'web accessibility colors', 'wcag aa aaa compliance'],
    h1: 'Color Contrast Checker — WCAG Accessibility Free',
    faq: [
      { question: 'How to check color contrast for accessibility?', answer: 'Enter foreground and background colors in ISHU TOOLS Color Contrast Checker. It instantly shows the contrast ratio and WCAG AA/AAA compliance status.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  MATH TOOLS
  // ════════════════════════════════════════════════
  'average-calculator': {
    title: 'Average Calculator Online Free — Mean, Median, Mode | ISHU TOOLS',
    description: 'Calculate average (mean), median, and mode online for free. Handles any set of numbers. No signup. Best free average calculator for students and math.',
    keywords: ['average calculator', 'mean calculator', 'median calculator', 'mode calculator', 'calculate average free', 'average online', 'ishu average calculator', 'statistics calculator', 'mean median mode free'],
    h1: 'Average Calculator — Mean, Median, Mode Free',
    faq: [
      { question: 'How to calculate average online?', answer: 'Enter your numbers (separated by commas or newlines) in ISHU TOOLS Average Calculator. Click Run to get mean, median, mode, and range instantly.' },
    ],
  },
  'salary-calculator': {
    title: 'Salary Calculator Online Free — Take-Home Pay | ISHU TOOLS',
    description: 'Calculate net salary and take-home pay online for free. India salary calculator with tax deductions. No signup. Best free salary calculator for employees.',
    keywords: ['salary calculator', 'take home pay calculator', 'net salary calculator', 'salary after tax', 'monthly salary calculator', 'ishu salary calculator', 'india salary calculator', 'ctc to inhand calculator', 'salary breakdown calculator'],
    h1: 'Salary Calculator — Take-Home Pay Free',
    faq: [
      { question: 'How to calculate net salary?', answer: 'Enter your gross salary, tax deductions, and allowances in ISHU TOOLS Salary Calculator. Click Run to see your net take-home pay breakdown.' },
    ],
  },
  'fuel-cost-calculator': {
    title: 'Fuel Cost Calculator Online Free — Trip Cost | ISHU TOOLS',
    description: 'Calculate fuel cost for any trip online for free. Enter distance, fuel efficiency, and price per liter. No signup. Best free fuel cost calculator for India.',
    keywords: ['fuel cost calculator', 'trip cost calculator', 'petrol cost calculator', 'diesel cost calculator', 'fuel expense calculator', 'ishu fuel calculator', 'travel cost calculator', 'fuel mileage calculator', 'petrol calculator india'],
    h1: 'Fuel Cost Calculator — Trip Cost Free',
    faq: [
      { question: 'How to calculate fuel cost for a trip?', answer: 'Enter distance (km), fuel efficiency (km/L), and fuel price (₹/L) in ISHU TOOLS Fuel Cost Calculator. Click Run to get the total trip fuel cost.' },
    ],
  },
  'electricity-bill-calculator': {
    title: 'Electricity Bill Calculator Online Free — India | ISHU TOOLS',
    description: 'Calculate electricity bill online for free. Enter units consumed and tariff rate. No signup. Best free electricity bill estimator for India.',
    keywords: ['electricity bill calculator', 'electric bill calculator', 'units to rupees calculator', 'electricity cost calculator', 'power bill estimator', 'ishu electricity calculator', 'monthly electricity bill india', 'kwh calculator india'],
    h1: 'Electricity Bill Calculator — Free Online India',
    faq: [
      { question: 'How to calculate electricity bill?', answer: 'Enter units consumed and rate per unit in ISHU TOOLS Electricity Bill Calculator. Click Run to get the estimated monthly electricity bill.' },
    ],
  },
  'speed-distance-time': {
    title: 'Speed Distance Time Calculator Online Free | ISHU TOOLS',
    description: 'Calculate speed, distance, or time online for free. Use the SDT formula for physics problems. No signup. Best free speed distance time calculator for students.',
    keywords: ['speed distance time calculator', 'sdt calculator', 'calculate speed', 'calculate distance', 'calculate time', 'physics calculator', 'ishu speed calculator', 'speed formula calculator', 'distance time calculator'],
    h1: 'Speed Distance Time Calculator — Free Online',
    faq: [
      { question: 'How to calculate speed, distance, or time?', answer: 'Enter any two values in ISHU TOOLS Speed Distance Time Calculator. Click Run to calculate the third. Perfect for physics problems and travel planning.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  OCR & VISION
  // ════════════════════════════════════════════════
  'jpg-to-text': {
    title: 'JPG to Text OCR Online Free — Extract Text from Image | ISHU TOOLS',
    description: 'Extract text from JPG images using OCR online for free. Convert image text to editable text. No signup. Best free JPG to text OCR tool.',
    keywords: ['jpg to text', 'image to text', 'ocr jpg', 'extract text from jpg', 'jpg ocr free', 'photo to text', 'ishu jpg to text', 'jpeg to text', 'picture to text', 'ocr online free'],
    h1: 'JPG to Text — Free OCR Online',
    faq: [
      { question: 'How to extract text from JPG image?', answer: 'Upload your JPG image on ISHU TOOLS JPG to Text. Click Run to extract all text using OCR. Copy the extracted text — free, no signup.' },
      { question: 'What languages does the OCR support?', answer: 'ISHU TOOLS OCR supports English and major international languages. For best accuracy, use clear, high-resolution images with good contrast.' },
    ],
  },
  'png-to-text': {
    title: 'PNG to Text OCR Online Free — Extract Text from PNG | ISHU TOOLS',
    description: 'Extract text from PNG images using OCR online for free. Convert PNG screenshots to editable text. No signup. Best free PNG to text OCR.',
    keywords: ['png to text', 'image to text png', 'ocr png', 'extract text from png', 'png ocr free', 'screenshot to text', 'ishu png to text', 'ocr screenshot free'],
    h1: 'PNG to Text — Free OCR Online',
    faq: [
      { question: 'How to extract text from PNG?', answer: 'Upload your PNG image on ISHU TOOLS PNG to Text. Click Run to get the extracted text using OCR. Perfect for screenshots, scanned documents, and image text.' },
    ],
  },
  'pdf-ocr': {
    title: 'PDF OCR Online Free — Make PDF Searchable | ISHU TOOLS',
    description: 'Perform OCR on PDF files online for free. Convert scanned PDFs to searchable and selectable text. No signup. Best free PDF OCR tool.',
    keywords: ['pdf ocr', 'ocr pdf', 'scanned pdf to text', 'searchable pdf', 'pdf text recognition', 'pdf ocr free', 'ishu pdf ocr', 'make pdf searchable', 'optical character recognition pdf'],
    h1: 'PDF OCR — Make Scanned PDF Searchable Free',
    faq: [
      { question: 'How to perform OCR on a PDF?', answer: 'Upload your scanned PDF on ISHU TOOLS PDF OCR. Click Run to convert it to a searchable, text-selectable PDF. Download the OCR-processed PDF for free.' },
    ],
  },
  'blur-background': {
    title: 'Blur Background Online Free — Portrait Effect | ISHU TOOLS',
    description: 'Blur image backgrounds online for free. Create professional portrait bokeh effects. No signup. Best free background blur tool for photos.',
    keywords: ['blur background', 'blur image background', 'background blur free', 'blur background photo', 'bokeh effect', 'portrait blur', 'ishu blur background', 'photo background blur', 'remove sharp background'],
    h1: 'Blur Background — Free Online Portrait Effect',
    faq: [
      { question: 'How to blur image background online?', answer: 'Upload your photo on ISHU TOOLS Blur Background. The tool detects the subject and blurs the background. Adjust blur intensity. Click Run and download.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  UNIT CONVERTERS
  // ════════════════════════════════════════════════
  'data-storage-converter': {
    title: 'Data Storage Converter Online Free — Bytes, KB, MB, GB | ISHU TOOLS',
    description: 'Convert between bytes, KB, MB, GB, TB online for free. Instant data storage unit conversion. No signup. Best free data storage size converter.',
    keywords: ['data storage converter', 'bytes to kb', 'kb to mb', 'mb to gb', 'gb to tb', 'file size converter', 'data unit converter free', 'ishu data converter', 'storage size calculator'],
    h1: 'Data Storage Converter — Bytes, KB, MB, GB Free',
    faq: [
      { question: 'How to convert bytes to KB or MB?', answer: 'Enter the value and select the source unit in ISHU TOOLS Data Storage Converter. Choose the target unit and click Run to get the conversion instantly.' },
    ],
  },
  'volume-converter': {
    title: 'Volume Converter Online Free — Liters, Gallons, ML | ISHU TOOLS',
    description: 'Convert between volume units online for free. Liters, milliliters, gallons, quarts, pints, cups, fluid ounces. No signup. Best free volume unit converter.',
    keywords: ['volume converter', 'liters to gallons', 'ml to liters', 'volume unit converter', 'liquid converter', 'volume conversion free', 'ishu volume converter', 'metric imperial volume'],
    h1: 'Volume Converter — Free Online Unit Converter',
    faq: [
      { question: 'How to convert liters to gallons?', answer: 'Enter the value in ISHU TOOLS Volume Converter. Select liters as input and gallons as output. Click Run for instant conversion.' },
    ],
  },
  'energy-converter': {
    title: 'Energy Converter Online Free — Joules, Calories, kWh | ISHU TOOLS',
    description: 'Convert between energy units online for free. Joules, calories, kilocalories, kWh, BTU. No signup. Best free energy unit converter.',
    keywords: ['energy converter', 'joules to calories', 'calories to joules', 'kwh converter', 'energy unit converter free', 'ishu energy converter', 'calorie converter'],
    h1: 'Energy Converter — Free Online Unit Converter',
    faq: [
      { question: 'How to convert joules to calories?', answer: 'Enter the value in ISHU TOOLS Energy Converter. Select joules as input and calories as output. Click Run for instant conversion.' },
    ],
  },
  'pressure-converter': {
    title: 'Pressure Converter Online Free — PSI, Bar, Pascal | ISHU TOOLS',
    description: 'Convert between pressure units online for free. PSI, bar, pascal, atm, torr. No signup. Best free pressure unit converter.',
    keywords: ['pressure converter', 'psi to bar', 'bar to psi', 'pascal converter', 'pressure unit converter free', 'ishu pressure converter', 'atm to bar'],
    h1: 'Pressure Converter — Free Online Unit Converter',
    faq: [
      { question: 'How to convert PSI to bar?', answer: 'Enter the PSI value in ISHU TOOLS Pressure Converter. Select PSI as input and bar as output. Click Run for instant conversion.' },
    ],
  },
  'data-size-converter': {
    title: 'Data Size Converter Online Free | ISHU TOOLS',
    description: 'Convert between digital data sizes online for free. Bytes, KB, MB, GB, TB, PB, and binary units. No signup. Best free data size converter.',
    keywords: ['data size converter', 'file size converter', 'bytes kb mb gb', 'data conversion online', 'ishu data size converter', 'storage unit converter'],
    h1: 'Data Size Converter — Free Online',
    faq: [
      { question: 'How to convert between data sizes?', answer: 'Enter the value and select source/target units in ISHU TOOLS Data Size Converter. Click Run for instant conversion between bytes, KB, MB, GB, and more.' },
    ],
  },
  'speed-converter': {
    title: 'Speed Converter Online Free — mph, kmh, m/s | ISHU TOOLS',
    description: 'Convert between speed units online for free. mph, km/h, m/s, knots. No signup. Best free speed unit converter.',
    keywords: ['speed converter', 'mph to kmh', 'kmh to mph', 'speed unit converter', 'velocity converter', 'ishu speed converter', 'miles per hour to km'],
    h1: 'Speed Converter — Free Online Unit Converter',
    faq: [
      { question: 'How to convert mph to kmh?', answer: 'Enter the speed in ISHU TOOLS Speed Converter. Select mph as input and km/h as output. Click Run for instant conversion.' },
    ],
  },
  'area-converter': {
    title: 'Area Converter Online Free — sq ft, sq m, acres | ISHU TOOLS',
    description: 'Convert between area units online for free. Square feet, square meters, acres, hectares, sq km. No signup. Best free area converter for real estate.',
    keywords: ['area converter', 'sq ft to sq m', 'square feet to square meters', 'acres to hectares', 'area unit converter free', 'ishu area converter', 'land area converter india'],
    h1: 'Area Converter — Free Online Unit Converter',
    faq: [
      { question: 'How to convert square feet to square meters?', answer: 'Enter the area in ISHU TOOLS Area Converter. Select sq ft as input and sq m as output. Click Run for instant conversion.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  IMAGE ENHANCE
  // ════════════════════════════════════════════════
  'contrast-image': {
    title: 'Adjust Image Contrast Online Free | ISHU TOOLS',
    description: 'Adjust and enhance image contrast online for free. Increase or decrease contrast of JPG, PNG images. No signup. Best free image contrast adjuster.',
    keywords: ['adjust image contrast', 'increase contrast image', 'image contrast free', 'contrast image online', 'ishu contrast image', 'enhance photo contrast'],
    h1: 'Image Contrast Adjuster — Free Online',
    faq: [{ question: 'How to adjust image contrast?', answer: 'Upload your image on ISHU TOOLS Contrast tool. Use the slider to increase or decrease contrast. Click Run and download the enhanced image.' }],
  },
  'check-image-dpi': {
    title: 'Check Image DPI Online Free — DPI Checker | ISHU TOOLS',
    description: 'Check and verify image DPI (dots per inch) resolution online for free. Perfect for print preparation. No signup. Best free DPI checker.',
    keywords: ['check image dpi', 'dpi checker', 'image resolution checker', 'dpi of image', 'image dpi free', 'ishu dpi checker', 'print dpi checker', 'image resolution tool'],
    h1: 'Image DPI Checker — Check Resolution Free',
    faq: [
      { question: 'How to check image DPI?', answer: 'Upload your image on ISHU TOOLS DPI Checker. Click Run to instantly see the DPI (dots per inch) resolution — essential for print and professional publishing.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  SEO TOOLS
  // ════════════════════════════════════════════════
  'readability-score': {
    title: 'Readability Score Checker Online Free | ISHU TOOLS',
    description: 'Check content readability score online for free. Get Flesch-Kincaid and Gunning Fog reading level scores. No signup. Best free readability analyzer.',
    keywords: ['readability score', 'readability checker', 'reading level checker', 'flesch kincaid score', 'content readability', 'ishu readability', 'text reading level', 'seo readability tool'],
    h1: 'Readability Score Checker — Free Online',
    faq: [
      { question: 'How to check text readability?', answer: 'Paste your content in ISHU TOOLS Readability Checker. Click Run to get Flesch-Kincaid score, grade level, and reading time — perfect for SEO content optimization.' },
    ],
  },
  'open-graph-generator': {
    title: 'Open Graph Meta Tag Generator Free Online | ISHU TOOLS',
    description: 'Generate Open Graph meta tags for your website online for free. Optimize social media sharing previews for Facebook, Twitter, LinkedIn. No signup.',
    keywords: ['open graph generator', 'og meta tags', 'social media meta tags', 'open graph free', 'og image generator', 'ishu open graph', 'facebook meta tags', 'twitter card generator'],
    h1: 'Open Graph Meta Tag Generator — Free Online',
    faq: [
      { question: 'How to generate Open Graph meta tags?', answer: 'Enter your page title, description, image URL, and type in ISHU TOOLS Open Graph Generator. Click Run to get the HTML meta tags ready to paste into your website.' },
    ],
  },
  'character-counter': {
    title: 'Character Counter Online Free — Count Chars & Words | ISHU TOOLS',
    description: 'Count characters, words, sentences, and paragraphs online for free. Real-time character count with and without spaces. No signup. Best free character counter.',
    keywords: ['character counter', 'count characters', 'word counter', 'letter counter', 'character count free', 'character counter online', 'ishu character counter', 'text length checker', 'string length counter'],
    h1: 'Character Counter — Count Characters & Words Free',
    faq: [
      { question: 'How to count characters in text?', answer: 'Paste your text in ISHU TOOLS Character Counter. It instantly shows character count (with and without spaces), word count, sentence count, and reading time.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  BATCH & DATA TOOLS
  // ════════════════════════════════════════════════
  'csv-to-json': {
    title: 'CSV to JSON Converter Online Free | ISHU TOOLS',
    description: 'Convert CSV files to JSON online for free. Instant, accurate CSV to JSON transformation. No signup. Best free CSV to JSON converter for developers.',
    keywords: ['csv to json', 'convert csv to json', 'csv json converter', 'csv to json free', 'csv to json online', 'ishu csv to json', 'spreadsheet to json'],
    h1: 'CSV to JSON Converter — Free Online',
    faq: [
      { question: 'How to convert CSV to JSON?', answer: 'Upload your CSV file or paste CSV data in ISHU TOOLS. Click Run to convert to JSON. Copy or download the JSON output — free, no signup.' },
    ],
  },
  'json-to-csv': {
    title: 'JSON to CSV Converter Online Free | ISHU TOOLS',
    description: 'Convert JSON to CSV spreadsheet format online for free. Flatten JSON arrays to CSV. No signup. Best free JSON to CSV converter.',
    keywords: ['json to csv', 'convert json to csv', 'json csv converter', 'json to csv free', 'json to spreadsheet', 'ishu json to csv'],
    h1: 'JSON to CSV Converter — Free Online',
    faq: [
      { question: 'How to convert JSON to CSV?', answer: 'Paste your JSON data in ISHU TOOLS JSON to CSV converter. Click Run to get the CSV spreadsheet. Download for Excel, Google Sheets, or any CSV-compatible app.' },
    ],
  },
  'pdf-to-csv': {
    title: 'PDF to CSV Converter Online Free | ISHU TOOLS',
    description: 'Convert PDF tables to CSV format online for free. Extract tabular data from PDFs to CSV. No signup. Best free PDF to CSV converter.',
    keywords: ['pdf to csv', 'convert pdf to csv', 'pdf table to csv', 'pdf data to csv', 'pdf to csv free', 'ishu pdf to csv', 'extract table from pdf'],
    h1: 'PDF to CSV Converter — Free Online',
    faq: [
      { question: 'How to convert PDF to CSV?', answer: 'Upload your PDF with tables on ISHU TOOLS PDF to CSV. Click Run to extract the table data as CSV. Download and open in Excel or Google Sheets.' },
    ],
  },
  'pdf-to-markdown': {
    title: 'PDF to Markdown Converter Online Free | ISHU TOOLS',
    description: 'Convert PDF documents to Markdown format online for free. Perfect for documentation and static site generators. No signup. Best free PDF to Markdown converter.',
    keywords: ['pdf to markdown', 'pdf to md', 'convert pdf to markdown', 'pdf markdown converter', 'pdf to md free', 'ishu pdf to markdown', 'pdf to docs'],
    h1: 'PDF to Markdown — Free Online Converter',
    faq: [{ question: 'How to convert PDF to Markdown?', answer: 'Upload your PDF on ISHU TOOLS PDF to Markdown. Click Run to get the Markdown text. Perfect for GitHub README files, documentation, and static sites.' }],
  },
  'merge-text-files': {
    title: 'Merge Text Files Online Free | ISHU TOOLS',
    description: 'Merge multiple text files into one online for free. Combine TXT files in order. No signup. Best free text file merger.',
    keywords: ['merge text files', 'combine text files', 'merge txt files', 'join text files', 'merge text free', 'ishu merge text files'],
    h1: 'Merge Text Files — Free Online',
    faq: [{ question: 'How to merge text files?', answer: 'Upload multiple TXT files on ISHU TOOLS Merge Text Files. Arrange the order and click Run. Download the combined text file — free, no signup.' }],
  },

  // ════════════════════════════════════════════════
  //  STUDENT & UTILITY TOOLS
  // ════════════════════════════════════════════════
  'number-base-converter': {
    title: 'Number Base Converter Online Free — Binary, Hex, Decimal | ISHU TOOLS',
    description: 'Convert between number bases online for free. Binary, decimal, hexadecimal, octal conversion. No signup. Best free number base converter for CS students.',
    keywords: ['number base converter', 'binary to decimal', 'decimal to binary', 'hex converter', 'octal converter', 'number system converter', 'ishu number base', 'binary hex decimal octal converter'],
    h1: 'Number Base Converter — Binary, Hex, Decimal Free',
    faq: [
      { question: 'How to convert binary to decimal?', answer: 'Enter the binary number in ISHU TOOLS Number Base Converter. Select binary as input and decimal as output. Click Run for instant conversion.' },
      { question: 'What number bases does the converter support?', answer: 'The converter supports binary (base-2), octal (base-8), decimal (base-10), hexadecimal (base-16), and any custom base between 2 and 36.' },
    ],
  },
  'binary-to-text': {
    title: 'Binary to Text Converter Online Free | ISHU TOOLS',
    description: 'Convert binary code to readable text online for free. Decode binary numbers to ASCII text. No signup. Best free binary to text converter.',
    keywords: ['binary to text', 'convert binary to text', 'binary decoder', 'binary to ascii', 'binary text converter', 'ishu binary to text', 'decode binary'],
    h1: 'Binary to Text Converter — Free Online',
    faq: [
      { question: 'How to convert binary to text?', answer: 'Enter binary code (0s and 1s) in ISHU TOOLS Binary to Text converter. Click Run to decode it to readable ASCII text instantly.' },
    ],
  },
  'text-to-ascii': {
    title: 'Text to ASCII Converter Online Free | ISHU TOOLS',
    description: 'Convert text to ASCII code values online for free. Get ASCII codes for any character or string. No signup. Best free text to ASCII converter.',
    keywords: ['text to ascii', 'ascii code converter', 'text ascii values', 'string to ascii', 'ishu text to ascii', 'ascii code generator'],
    h1: 'Text to ASCII Converter — Free Online',
    faq: [
      { question: 'How to convert text to ASCII codes?', answer: 'Enter your text in ISHU TOOLS Text to ASCII converter. Click Run to get the ASCII decimal and hex values for each character.' },
    ],
  },
  'ascii-to-text': {
    title: 'ASCII to Text Converter Online Free | ISHU TOOLS',
    description: 'Convert ASCII codes to readable text online for free. Decode ASCII decimal or hex values to characters. No signup. Best free ASCII to text converter.',
    keywords: ['ascii to text', 'ascii decoder', 'ascii to string', 'convert ascii to text', 'ishu ascii to text', 'ascii code to character'],
    h1: 'ASCII to Text Converter — Free Online',
    faq: [
      { question: 'How to convert ASCII to text?', answer: 'Enter ASCII decimal or hex codes in ISHU TOOLS ASCII to Text converter. Click Run to decode them to readable characters.' },
    ],
  },
  'text-reverse': {
    title: 'Reverse Text Online Free — Flip Text Backwards | ISHU TOOLS',
    description: 'Reverse text and strings online for free. Flip text backwards, mirror words, and reverse sentences. No signup. Best free text reverser.',
    keywords: ['reverse text', 'flip text', 'backwards text', 'mirror text', 'reverse string', 'text reverser free', 'ishu reverse text', 'reverse words online', 'text backwards'],
    h1: 'Reverse Text — Flip Text Backwards Free',
    faq: [
      { question: 'How to reverse text online?', answer: 'Paste your text in ISHU TOOLS Reverse Text tool. Click Run to flip the entire text backwards instantly. Free, no signup.' },
    ],
  },
  'extract-metadata': {
    title: 'Extract Image Metadata Online Free — EXIF Viewer | ISHU TOOLS',
    description: 'Extract and view image metadata (EXIF data) online for free. See camera settings, GPS location, date, and more. No signup. Best free EXIF viewer.',
    keywords: ['extract metadata', 'exif viewer', 'image metadata viewer', 'photo metadata', 'exif data extractor', 'ishu extract metadata', 'view image metadata', 'photo info viewer'],
    h1: 'Extract Image Metadata — Free EXIF Viewer',
    faq: [
      { question: 'How to view image EXIF metadata?', answer: 'Upload your photo on ISHU TOOLS Extract Metadata. Click Run to see all EXIF data including camera model, settings, GPS coordinates, date, and more.' },
    ],
  },
  'remove-image-metadata': {
    title: 'Remove Image Metadata Online Free — Strip EXIF | ISHU TOOLS',
    description: 'Remove all metadata from images online for free. Strip EXIF data, GPS location, and camera info for privacy. No signup. Best free image metadata remover.',
    keywords: ['remove image metadata', 'strip exif data', 'remove photo metadata', 'delete image exif', 'privacy photo cleaner', 'ishu remove image metadata', 'exif remover', 'anonymous photo'],
    h1: 'Remove Image Metadata — Strip EXIF Free',
    faq: [
      { question: 'How to remove metadata from images?', answer: 'Upload your photo on ISHU TOOLS Remove Image Metadata. Click Run to strip all EXIF data (GPS location, camera info, etc.). Download the clean, private image.' },
    ],
  },
  'pdf-to-bmp': {
    title: 'PDF to BMP Converter Online Free | ISHU TOOLS',
    description: 'Convert PDF to BMP images online for free. High-quality PDF to bitmap conversion. No signup. Best free PDF to BMP converter.',
    keywords: ['pdf to bmp', 'convert pdf to bmp', 'pdf to bitmap', 'pdf to bmp free', 'ishu pdf to bmp'],
    h1: 'PDF to BMP Converter — Free Online',
    faq: [{ question: 'How to convert PDF to BMP?', answer: 'Upload your PDF on ISHU TOOLS PDF to BMP. Click Run and download the BMP images — one per page, for free.' }],
  },
  'pdf-to-gif': {
    title: 'PDF to GIF Converter Online Free | ISHU TOOLS',
    description: 'Convert PDF pages to GIF images online for free. Create animated GIFs from PDF slides. No signup. Best free PDF to GIF converter.',
    keywords: ['pdf to gif', 'convert pdf to gif', 'pdf to animated gif', 'pdf to gif free', 'ishu pdf to gif'],
    h1: 'PDF to GIF Converter — Free Online',
    faq: [{ question: 'How to convert PDF to GIF?', answer: 'Upload your PDF on ISHU TOOLS PDF to GIF. Click Run to convert each page to GIF images or create an animated GIF — free.' }],
  },
  'pdf-to-image': {
    title: 'PDF to Image Converter Online Free — JPG, PNG | ISHU TOOLS',
    description: 'Convert PDF pages to high-quality images online for free. Export any PDF page as JPG, PNG, or WEBP. No signup. Best free PDF to image converter.',
    keywords: ['pdf to image', 'pdf to jpg', 'pdf to png', 'convert pdf to image', 'pdf image extractor', 'pdf to picture', 'pdf to image free', 'ishu pdf to image', 'pdf pages to images'],
    h1: 'PDF to Image Converter — JPG, PNG Free',
    faq: [
      { question: 'How to convert PDF to image?', answer: 'Upload your PDF on ISHU TOOLS PDF to Image. Choose output format (JPG, PNG, WEBP). Click Run to convert each page to an image. Download all images in a ZIP.' },
    ],
  },
  'image-to-pdf': {
    title: 'Image to PDF Converter Online Free | ISHU TOOLS',
    description: 'Convert images to PDF online for free. Supports JPG, PNG, WEBP, GIF, BMP. Combine multiple images into one PDF. No signup. Best free image to PDF converter.',
    keywords: ['image to pdf', 'photo to pdf', 'convert image to pdf', 'images to pdf', 'image to pdf free', 'jpg png to pdf', 'ishu image to pdf', 'multiple images to pdf'],
    h1: 'Image to PDF — Free Online Converter',
    faq: [
      { question: 'How to convert images to PDF?', answer: 'Upload your images (JPG, PNG, WEBP, etc.) on ISHU TOOLS Image to PDF. Arrange the order. Click Run to combine them into a PDF. Free, no signup.' },
    ],
  },
  'scan-to-pdf': {
    title: 'Scan to PDF Online Free — Mobile Scanner | ISHU TOOLS',
    description: 'Convert scanned documents and photos to PDF online for free. Perfect for scanning documents with your phone. No signup. Best free scan to PDF tool.',
    keywords: ['scan to pdf', 'mobile scanner pdf', 'document scanner pdf', 'photo to pdf scan', 'scan document free', 'ishu scan to pdf', 'mobile document scanner', 'scan app free'],
    h1: 'Scan to PDF — Free Mobile Document Scanner',
    faq: [
      { question: 'How to scan a document to PDF?', answer: 'Take a photo of your document or upload a scanned image. ISHU TOOLS Scan to PDF automatically enhances and converts it to a PDF document. Free, no app needed.' },
    ],
  },
  'pdf-page-count': {
    title: 'PDF Page Count Checker Online Free | ISHU TOOLS',
    description: 'Check the number of pages in a PDF online for free. Instantly see PDF page count and file info. No signup. Best free PDF page counter.',
    keywords: ['pdf page count', 'count pdf pages', 'pdf pages counter', 'pdf page number checker', 'pdf info viewer', 'ishu pdf page count', 'how many pages pdf'],
    h1: 'PDF Page Count — Check PDF Pages Free',
    faq: [
      { question: 'How to count pages in a PDF?', answer: 'Upload your PDF on ISHU TOOLS PDF Page Count. Click Run to instantly see the total page count and other file information.' },
    ],
  },
  'reverse-pdf': {
    title: 'Reverse PDF Pages Online Free | ISHU TOOLS',
    description: 'Reverse the order of pages in a PDF online for free. Flip page order from last to first. No signup. Best free PDF page reverser.',
    keywords: ['reverse pdf', 'reverse pdf pages', 'flip pdf order', 'reverse page order pdf', 'pdf reverser', 'ishu reverse pdf', 'invert pdf pages'],
    h1: 'Reverse PDF Pages — Free Online',
    faq: [{ question: 'How to reverse PDF pages?', answer: 'Upload your PDF on ISHU TOOLS Reverse PDF. Click Run to flip the page order (last page becomes first). Download the reversed PDF — free.' }],
  },
  'pixelate-image': {
    title: 'Pixelate Image Online Free — Blur Face & Mosaic | ISHU TOOLS',
    description: 'Pixelate images online for free. Create mosaic effects, blur faces, and censor areas. No signup. Best free image pixelation tool.',
    keywords: ['pixelate image', 'pixel art effect', 'mosaic image', 'pixelate face', 'censor image', 'blur with pixels', 'ishu pixelate image', 'pixel effect free', 'pixelate photo'],
    h1: 'Pixelate Image — Free Online Mosaic Tool',
    faq: [
      { question: 'How to pixelate an image online?', answer: 'Upload your image on ISHU TOOLS Pixelate. Adjust the pixelation level. Click Run to create the mosaic/pixel effect. Download the pixelated image.' },
    ],
  },
  'pixelate-face': {
    title: 'Pixelate Face in Photo Online Free | ISHU TOOLS',
    description: 'Pixelate and blur faces in photos online for free. Automatically detect and censor faces for privacy. No signup. Best free face pixelation tool.',
    keywords: ['pixelate face', 'blur face online', 'censor face photo', 'face pixelation free', 'privacy face blur', 'ishu pixelate face', 'face blurring tool', 'anonymize face photo'],
    h1: 'Pixelate Face — Censor Faces in Photos Free',
    faq: [
      { question: 'How to pixelate a face in a photo?', answer: 'Upload your photo on ISHU TOOLS Pixelate Face. The tool automatically detects faces and applies pixelation. Perfect for privacy protection and social media posts.' },
    ],
  },
  'photo-editor': {
    title: 'Online Photo Editor Free — Edit Photos in Browser | ISHU TOOLS',
    description: 'Edit photos online for free. Adjust brightness, contrast, saturation, apply filters and effects. No signup, no download. Best free online photo editor.',
    keywords: ['online photo editor', 'free photo editor', 'edit photo online', 'photo editing free', 'image editor online', 'ishu photo editor', 'browser photo editor', 'adjust photo free', 'photo effects online'],
    h1: 'Online Photo Editor — Edit Photos Free',
    faq: [
      { question: 'How to edit photos online for free?', answer: 'Upload your photo on ISHU TOOLS Photo Editor. Adjust brightness, contrast, saturation, apply filters. Click Run and download the edited photo — free, no signup.' },
    ],
  },
  'remove-image-object': {
    title: 'Remove Object from Photo Online Free | ISHU TOOLS',
    description: 'Remove unwanted objects from photos online for free. Erase objects, people, and blemishes from images using AI. No signup. Best free object removal tool.',
    keywords: ['remove object from photo', 'erase object photo', 'object removal free', 'ai object removal', 'remove person from photo', 'photo object eraser', 'ishu remove object', 'unwanted object remover'],
    h1: 'Remove Object from Photo — Free AI Tool',
    faq: [
      { question: 'How to remove objects from photos?', answer: 'Upload your photo on ISHU TOOLS Remove Object tool. Mark the object to remove. Click Run — AI fills in the background. Download the clean photo.' },
    ],
  },
  'pdf-security': {
    title: 'PDF Security — Password Protect PDF Online Free | ISHU TOOLS',
    description: 'Add security and password protection to PDF files online for free. Encrypt and restrict PDF access. No signup. Best free PDF security tool.',
    keywords: ['pdf security', 'protect pdf password', 'encrypt pdf', 'pdf password protection', 'secure pdf online', 'ishu pdf security', 'lock pdf free', 'pdf encryption free'],
    h1: 'PDF Security — Protect & Encrypt PDF Free',
    faq: [
      { question: 'How to add security to a PDF?', answer: 'Upload your PDF on ISHU TOOLS PDF Security. Set a password and choose permission levels (print, copy, edit). Click Run and download the encrypted, protected PDF.' },
    ],
  },
  'json-prettify': {
    title: 'JSON Prettify & Beautifier Online Free | ISHU TOOLS',
    description: 'Prettify and beautify JSON data online for free. Format minified JSON with proper indentation. No signup. Best free JSON formatter.',
    keywords: ['json prettify', 'json beautifier', 'format json', 'json formatter online', 'pretty print json', 'ishu json prettify', 'json indent'],
    h1: 'JSON Prettify — Beautify JSON Free Online',
    faq: [
      { question: 'How to prettify JSON online?', answer: 'Paste minified JSON in ISHU TOOLS JSON Prettify. Click Run for formatted, indented JSON. Copy or download the beautified output.' },
    ],
  },
  'batch-convert-images': {
    title: 'Batch Image Converter Online Free — Convert Multiple Images | ISHU TOOLS',
    description: 'Convert multiple images to different formats in one go online for free. Batch convert JPG, PNG, WEBP. No signup. Best free batch image converter.',
    keywords: ['batch image converter', 'convert multiple images', 'bulk image converter', 'batch convert images free', 'ishu batch images', 'bulk image conversion'],
    h1: 'Batch Image Converter — Convert Multiple Images Free',
    faq: [
      { question: 'How to batch convert images?', answer: 'Upload multiple images on ISHU TOOLS Batch Convert Images. Choose the output format. Click Run to convert all images at once. Download as a ZIP file.' },
    ],
  },
  'images-to-zip': {
    title: 'Images to ZIP — Compress Images to ZIP Online Free | ISHU TOOLS',
    description: 'Compress and archive multiple images into a ZIP file online for free. Easy file sharing and download. No signup. Best free images to ZIP tool.',
    keywords: ['images to zip', 'compress images zip', 'photos to zip', 'zip images free', 'archive images', 'ishu images to zip', 'bulk image zip'],
    h1: 'Images to ZIP — Free Online Archive Tool',
    faq: [
      { question: 'How to compress images to ZIP?', answer: 'Upload your images on ISHU TOOLS Images to ZIP. Click Run to create a ZIP archive. Download the ZIP with all images packed inside — free.' },
    ],
  },
  'pdf-to-txt': {
    title: 'PDF to TXT Converter Online Free — Extract Text | ISHU TOOLS',
    description: 'Convert PDF to plain text (TXT) online for free. Extract all text content from PDF files. No signup. Best free PDF to text converter.',
    keywords: ['pdf to txt', 'pdf to text', 'convert pdf to txt', 'extract text from pdf', 'pdf text extractor', 'pdf to txt free', 'ishu pdf to txt'],
    h1: 'PDF to TXT — Extract Text from PDF Free',
    faq: [
      { question: 'How to convert PDF to TXT?', answer: 'Upload your PDF on ISHU TOOLS PDF to TXT. Click Run to extract all text. Download as a .txt file — free, no signup.' },
    ],
  },
  'prettify-css': {
    title: 'CSS Prettifier & Formatter Online Free | ISHU TOOLS',
    description: 'Format and beautify CSS code online for free. Convert minified CSS to readable formatted code. No signup. Best free CSS formatter.',
    keywords: ['css formatter', 'css beautifier', 'prettify css', 'format css online', 'css pretty print', 'ishu css formatter', 'css code formatter'],
    h1: 'CSS Formatter — Beautify CSS Free Online',
    faq: [
      { question: 'How to format minified CSS?', answer: 'Paste your minified CSS in ISHU TOOLS CSS Prettifier. Click Run to format it with proper indentation and spacing. Copy the readable, formatted CSS.' },
    ],
  },
  'ai-summarizer': {
    title: 'AI Text Summarizer Online Free | ISHU TOOLS',
    description: 'Summarize long text and articles online for free using AI. Get concise summaries of any content. No signup. Best free AI text summarizer.',
    keywords: ['ai summarizer', 'text summarizer', 'article summarizer', 'summarize text free', 'ai summary generator', 'ishu ai summarizer', 'auto summarize text', 'content summarizer'],
    h1: 'AI Text Summarizer — Free Online',
    faq: [
      { question: 'How to summarize text using AI?', answer: 'Paste your text or article in ISHU TOOLS AI Summarizer. Click Run for an AI-generated concise summary. Perfect for research, studying, and content creation.' },
    ],
  },
  'split-text-file': {
    title: 'Split Text File Online Free | ISHU TOOLS',
    description: 'Split large text files into smaller parts online for free. Divide TXT files by lines, size, or delimiter. No signup. Best free text file splitter.',
    keywords: ['split text file', 'split txt file', 'divide text file', 'text file splitter', 'ishu split text', 'large file splitter'],
    h1: 'Split Text File — Free Online Tool',
    faq: [
      { question: 'How to split a large text file?', answer: 'Upload your text file on ISHU TOOLS Split Text File. Choose split method (by lines or size). Click Run to split it into smaller parts. Download each part separately.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  SPECIFIC KB COMPRESSION TOOLS (INDIA SEO)
  // ════════════════════════════════════════════════
  'compress-to-5kb': {
    title: 'Compress Image to 5KB Free Online | ISHU TOOLS',
    description: 'Compress any image to 5KB online free. Works for Aadhaar, PAN card, exam portals with strict 5KB limits. JPG, PNG, WEBP supported. No signup.',
    keywords: ['compress image to 5kb', 'image to 5kb', 'photo to 5kb', 'reduce image 5kb', '5kb photo compressor', 'aadhaar photo 5kb', 'exam portal 5kb', 'ishu compress 5kb'],
    h1: 'Compress Image to 5KB — Free Online',
    faq: [
      { question: 'Can I compress a photo to exactly 5KB?', answer: 'Yes! ISHU TOOLS compresses your image to 5KB or less while maintaining maximum possible quality. Upload your JPG, PNG, or WEBP image and download the 5KB result instantly.' },
      { question: 'Which government portals need 5KB photos?', answer: 'Many Indian exam portals like NTA, SSC, Railway, and banking portals require photos under 5KB. ISHU TOOLS makes it easy to compress to the exact required size.' },
    ],
  },
  'compress-to-10kb': {
    title: 'Compress Image to 10KB Free Online | ISHU TOOLS',
    description: 'Compress any image to 10KB online free. Required by SSC, RRB, IBPS, and many government exam portals. No signup, instant download.',
    keywords: ['compress image to 10kb', 'jpeg to 10kb', 'image 10kb', 'photo 10kb', '10kb image compressor', 'ssc photo 10kb', 'government exam photo 10kb', 'ishu compress 10kb'],
    h1: 'Compress Image to 10KB — Free Online',
    faq: [
      { question: 'How do I compress a photo to 10KB for an exam?', answer: 'Upload your photo on ISHU TOOLS Compress to 10KB tool, set target to 10 KB, and click Run. Download the compressed 10KB photo for your exam portal.' },
      { question: 'Which exams require photos under 10KB?', answer: 'SSC CGL, CHSL, RRB NTPC, IBPS PO/Clerk, SBI PO/Clerk, and many state government exams in India require photos under 10KB.' },
    ],
  },
  'compress-to-20kb': {
    title: 'Compress Image to 20KB Free Online | ISHU TOOLS',
    description: 'Compress any image to 20KB online free. Used for SSC, UPSC, RRB, bank exam portals. Supports JPG, PNG, WEBP. No signup required.',
    keywords: ['compress image to 20kb', 'jpeg to 20kb', 'image to 20kb', 'photo 20kb', '20kb compressor', 'ssc photo 20kb', 'upsc photo 20kb', 'ishu 20kb'],
    h1: 'Compress Image to 20KB — Free Online',
    faq: [
      { question: 'How to reduce image size to 20KB for government forms?', answer: 'Open ISHU TOOLS Compress to 20KB, upload your photo, and click Run. The tool will reduce it to 20KB or below and you can download it instantly.' },
    ],
  },
  'compress-to-30kb': {
    title: 'Compress Image to 30KB Free Online | ISHU TOOLS',
    description: 'Compress images to 30KB online free. Used for IBPS, SBI PO, and banking exam photo size requirements. No signup, instant download.',
    keywords: ['compress image to 30kb', 'jpeg to 30kb', 'image 30kb', 'photo 30kb', '30kb compressor', 'ibps photo 30kb', 'sbi po photo 30kb', 'ishu 30kb'],
    h1: 'Compress Image to 30KB — Free Online',
    faq: [],
  },
  'compress-to-50kb': {
    title: 'Compress Image to 50KB Free Online | ISHU TOOLS',
    description: 'Compress any image to 50KB online free. Widely required by government portals, university applications, and job application forms in India.',
    keywords: ['compress image to 50kb', 'jpeg to 50kb', 'image to 50kb', 'photo 50kb', '50kb compressor', 'reduce photo 50kb', 'government form 50kb photo', 'ishu compress 50kb'],
    h1: 'Compress Image to 50KB — Free Online',
    faq: [
      { question: 'Which applications require 50KB photos?', answer: 'University admission forms, scholarship applications, job portals, and many government schemes in India require photos in 20-50KB range.' },
      { question: 'Will image quality be affected when compressing to 50KB?', answer: 'ISHU TOOLS optimizes quality while hitting the target size. For small targets like 50KB, some quality reduction is necessary but the result remains clear enough for official use.' },
    ],
  },
  'compress-to-100kb': {
    title: 'Compress Image to 100KB Free Online | ISHU TOOLS',
    description: 'Compress any image to 100KB online free. No signup, no watermark. JPG, PNG, WEBP supported. Instant download. Best free alternative to pi7.org.',
    keywords: ['compress image to 100kb', 'jpeg to 100kb', 'image 100kb', 'photo to 100kb', '100kb compressor', 'reduce image 100kb', 'ishu compress 100kb'],
    h1: 'Compress Image to 100KB — Free Online',
    faq: [
      { question: 'How to compress an image to 100KB?', answer: 'Upload your image on ISHU TOOLS, set target to 100 KB, and click Run. Download your 100KB compressed image instantly for free.' },
    ],
  },
  'compress-to-150kb': {
    title: 'Compress Image to 150KB Free Online | ISHU TOOLS',
    description: 'Compress any image to 150KB online free. Ideal for passport, visa, and university admission photo requirements. No signup required.',
    keywords: ['compress image to 150kb', 'jpeg to 150kb', 'image 150kb', 'photo 150kb', '150kb compressor', 'ishu compress 150kb'],
    h1: 'Compress Image to 150KB — Free Online',
    faq: [],
  },
  'compress-to-200kb': {
    title: 'Compress Image to 200KB Free Online | ISHU TOOLS',
    description: 'Compress any image to 200KB online free. Common for scholarship, college, and official photo submissions. No signup, no watermark.',
    keywords: ['compress image to 200kb', 'jpeg to 200kb', 'image 200kb', 'photo to 200kb', '200kb compressor', 'ishu compress 200kb'],
    h1: 'Compress Image to 200KB — Free Online',
    faq: [],
  },
  'compress-to-300kb': {
    title: 'Compress Image to 300KB Free Online | ISHU TOOLS',
    description: 'Compress any image to 300KB online free. Supports all image formats. Instant download. No signup, no watermark.',
    keywords: ['compress image to 300kb', 'jpeg to 300kb', 'image 300kb', 'photo 300kb', '300kb compressor', 'ishu compress 300kb'],
    h1: 'Compress Image to 300KB — Free Online',
    faq: [],
  },
  'compress-to-500kb': {
    title: 'Compress Image to 500KB Free Online | ISHU TOOLS',
    description: 'Compress any image to 500KB online free. Great for email attachments, WhatsApp, and document submissions. No signup required.',
    keywords: ['compress image to 500kb', 'jpeg to 500kb', 'image 500kb', 'photo 500kb', '500kb compressor', 'ishu compress 500kb'],
    h1: 'Compress Image to 500KB — Free Online',
    faq: [],
  },
  'compress-to-1mb': {
    title: 'Compress Image to 1MB Free Online | ISHU TOOLS',
    description: 'Compress any image to 1MB (1000KB) online free. Reduces large photos for email, WhatsApp, and social media. No signup, instant download.',
    keywords: ['compress image to 1mb', 'jpeg to 1mb', 'image to 1mb', 'reduce image 1mb', '1mb compressor', 'ishu compress 1mb'],
    h1: 'Compress Image to 1MB — Free Online',
    faq: [],
  },
  'compress-to-2mb': {
    title: 'Compress Image to 2MB Free Online | ISHU TOOLS',
    description: 'Compress any image to 2MB online free. For high-resolution document uploads and applications requiring up to 2MB photos.',
    keywords: ['compress image to 2mb', 'jpeg to 2mb', 'image to 2mb', 'reduce image 2mb', '2mb compressor', 'ishu compress 2mb'],
    h1: 'Compress Image to 2MB — Free Online',
    faq: [],
  },
  'jpg-to-kb': {
    title: 'JPG to KB — Reduce JPG File Size Free | ISHU TOOLS',
    description: 'Reduce JPG file size to any specific KB free online. Enter target KB and compress instantly. No signup, no watermark.',
    keywords: ['jpg to kb', 'reduce jpg file size', 'compress jpg to kb', 'jpg kb reducer', 'jpeg kb compressor', 'ishu jpg to kb'],
    h1: 'JPG to KB — Reduce JPG Size Free',
    faq: [
      { question: 'How do I reduce a JPG to a specific KB size?', answer: 'Open ISHU TOOLS JPG to KB tool, upload your JPG, enter the target KB size, and click Run. Download the compressed JPG at your target file size.' },
    ],
  },
  'jpeg-to-kb': {
    title: 'JPEG to KB — Compress JPEG to Target Size Free | ISHU TOOLS',
    description: 'Compress JPEG to specific KB online free. Set exact target size for government forms, exams, and job portals. No signup required.',
    keywords: ['jpeg to kb', 'compress jpeg to kb', 'jpeg file size reducer', 'jpeg kb compressor', 'ishu jpeg to kb'],
    h1: 'JPEG to KB — Compress to Target Size Free',
    faq: [],
  },
  'png-to-kb': {
    title: 'PNG to KB — Reduce PNG File Size Free | ISHU TOOLS',
    description: 'Reduce PNG file size to specific KB free online. Converts to JPEG for maximum compression. No signup, no watermark, instant download.',
    keywords: ['png to kb', 'reduce png to kb', 'compress png to kb', 'png kb reducer', 'png file size', 'ishu png to kb'],
    h1: 'PNG to KB — Reduce PNG Size Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  IMAGE FORMAT CONVERSION TOOLS (NEW)
  // ════════════════════════════════════════════════
  'png-to-webp': {
    title: 'PNG to WebP Converter — Free Online | ISHU TOOLS',
    description: 'Convert PNG to WebP format free online. Reduce image size by 30% without losing quality. Faster websites with WebP. No signup needed.',
    keywords: ['png to webp', 'convert png to webp', 'png webp converter', 'webp format', 'image to webp', 'ishu tools png webp', 'ishu png to webp', 'online png webp', 'free png to webp'],
    h1: 'PNG to WebP — Convert Free Online',
    faq: [
      { question: 'Why convert PNG to WebP?', answer: 'WebP files are typically 25-35% smaller than PNG while maintaining the same quality, making your website load faster.' },
      { question: 'Does WebP support transparency?', answer: 'Yes, WebP supports transparency like PNG, making it a great replacement for PNGs on the web.' },
    ],
  },
  'jpg-to-webp': {
    title: 'JPG to WebP Converter — Free Online | ISHU TOOLS',
    description: 'Convert JPG/JPEG to WebP format free online. Smaller file sizes, faster loading. Free, no signup, no watermark.',
    keywords: ['jpg to webp', 'jpeg to webp', 'convert jpg webp', 'jpg webp online', 'image webp converter', 'ishu jpg to webp', 'free jpg webp'],
    h1: 'JPG to WebP — Free Online Converter',
    faq: [
      { question: 'How much smaller is WebP than JPG?', answer: 'WebP images are typically 25-34% smaller than JPEG images at equivalent visual quality.' },
    ],
  },
  'gif-to-jpg': {
    title: 'GIF to JPG Converter — Free Online | ISHU TOOLS',
    description: 'Convert GIF images to JPG format online free. Extract first frame and save as JPEG. Fast, simple, no signup.',
    keywords: ['gif to jpg', 'gif to jpeg', 'convert gif jpg', 'gif image convert', 'ishu gif to jpg', 'free gif jpg'],
    h1: 'GIF to JPG — Free Online Converter',
    faq: [],
  },
  'tiff-to-jpg': {
    title: 'TIFF to JPG Converter — Free Online | ISHU TOOLS',
    description: 'Convert TIFF/TIF images to JPG format free. Reduce large TIFF file sizes instantly. No software needed.',
    keywords: ['tiff to jpg', 'tif to jpg', 'tiff to jpeg', 'convert tiff jpg', 'tiff image converter', 'ishu tiff to jpg'],
    h1: 'TIFF to JPG — Free Online Converter',
    faq: [],
  },
  'bmp-to-jpg': {
    title: 'BMP to JPG Converter — Free Online | ISHU TOOLS',
    description: 'Convert BMP bitmap images to JPG format free online. Drastically reduces file sizes. No signup required.',
    keywords: ['bmp to jpg', 'bitmap to jpg', 'bmp to jpeg', 'convert bmp', 'bmp image converter', 'ishu bmp to jpg'],
    h1: 'BMP to JPG — Free Online Converter',
    faq: [],
  },
  'svg-to-png': {
    title: 'SVG to PNG Converter — Free Online | ISHU TOOLS',
    description: 'Convert SVG vector graphics to high-resolution PNG free online. Set custom scale (1x, 2x, 4x). No software needed.',
    keywords: ['svg to png', 'convert svg png', 'svg image converter', 'vector to png', 'svg to raster', 'ishu svg to png', 'free svg png'],
    h1: 'SVG to PNG — High Resolution Converter Free',
    faq: [
      { question: 'Can I set the resolution of the PNG output?', answer: 'Yes, you can set the scale factor (e.g., 2x for double resolution) for higher quality PNG output.' },
    ],
  },
  'image-to-jpg': {
    title: 'Image to JPG Converter — Free Online | ISHU TOOLS',
    description: 'Convert any image to JPG free online — PNG, GIF, BMP, WebP, TIFF, HEIC all supported. Fast, no signup.',
    keywords: ['image to jpg', 'convert to jpg', 'image to jpeg', 'png to jpg', 'webp to jpg', 'convert image jpg', 'ishu image to jpg', 'free image jpg'],
    h1: 'Image to JPG — Convert Any Format Free',
    faq: [
      { question: 'Which image formats are supported?', answer: 'PNG, GIF, BMP, WebP, TIFF, HEIC, SVG, and most other common image formats.' },
    ],
  },
  'heic-to-jpg': {
    title: 'HEIC to JPG Converter — Free Online | ISHU TOOLS',
    description: 'Convert iPhone HEIC photos to JPG format free online. Compatible with all devices. No software needed.',
    keywords: ['heic to jpg', 'heif to jpg', 'iphone photo to jpg', 'heic jpeg converter', 'apple photo convert', 'ishu heic to jpg', 'free heic jpg'],
    h1: 'HEIC to JPG — iPhone Photo Converter Free',
    faq: [
      { question: 'What is HEIC format?', answer: "HEIC (High Efficiency Image Container) is Apple's image format used by iPhones. It offers better compression than JPG but has limited compatibility." },
    ],
  },
  'circle-crop': {
    title: 'Circle Crop Image — Free Online | ISHU TOOLS',
    description: 'Crop any image into a perfect circle shape free online. Perfect for profile pictures, avatars, and social media. Transparent background supported.',
    keywords: ['circle crop', 'crop image circle', 'round image crop', 'circular crop', 'profile picture crop', 'avatar crop', 'ishu circle crop', 'circle image online'],
    h1: 'Circle Crop Image — Round Crop Free Online',
    faq: [
      { question: 'Does the circle crop support transparent backgrounds?', answer: 'Yes, PNG output includes a transparent background. JPG output uses a white background.' },
    ],
  },
  'add-text-to-image': {
    title: 'Add Text to Image — Free Online | ISHU TOOLS',
    description: 'Add custom text overlays to any image online free. Choose font size, color, position, and opacity. No Photoshop needed.',
    keywords: ['add text to image', 'image text overlay', 'caption image', 'text on photo', 'add caption', 'photo text editor', 'ishu add text image', 'text overlay free'],
    h1: 'Add Text to Image — Free Online Editor',
    faq: [
      { question: 'Can I control where text appears on the image?', answer: 'Yes, choose from 7 positions: center, top-left, top-center, top-right, bottom-left, bottom-center, or bottom-right.' },
    ],
  },
  'compress-image-to-kb': {
    title: 'Compress Image to KB — Target Size Free | ISHU TOOLS',
    description: 'Compress images to a specific target size in KB free online. Perfect for government forms, exam portals, and job applications requiring exact file sizes.',
    keywords: ['compress image to kb', 'reduce image to kb', 'image size reducer kb', 'compress photo to kb', 'image kb compressor', 'ishu compress kb', 'photo kb reducer'],
    h1: 'Compress Image to KB — Target File Size Free',
    faq: [
      { question: 'What is the minimum target size I can compress to?', answer: 'You can compress to any target size in KB. Very small targets (under 10KB) may affect image quality.' },
    ],
  },
  'reduce-image-size-kb': {
    title: 'Reduce Image Size in KB — Free Online | ISHU TOOLS',
    description: 'Reduce image file size to specific KB online free. Useful for SSC, government form, and university submission requirements.',
    keywords: ['reduce image size kb', 'compress to kb', 'image kb reduction', 'reduce photo kb', 'ishu reduce kb', 'government form photo kb', 'ssc photo kb'],
    h1: 'Reduce Image Size in KB — Free Online',
    faq: [],
  },
  'increase-image-size-kb': {
    title: 'Increase Image Size in KB — Free Online | ISHU TOOLS',
    description: 'Increase image file size to meet minimum KB requirements online free. Upscales image to reach target size.',
    keywords: ['increase image size kb', 'enlarge image kb', 'boost image file size', 'image kb increaser', 'ishu increase kb'],
    h1: 'Increase Image Size in KB — Free Online',
    faq: [],
  },
  'dpi-checker': {
    title: 'Image DPI Checker — Check Image Resolution Free | ISHU TOOLS',
    description: 'Check the DPI (dots per inch) resolution of any image online free. See width, height, print dimensions, and quality class.',
    keywords: ['dpi checker', 'check image dpi', 'image resolution checker', 'dots per inch', 'print resolution checker', 'image dpi tool', 'ishu dpi checker'],
    h1: 'Image DPI Checker — Check Resolution Free',
    faq: [
      { question: 'What DPI do I need for printing?', answer: '300 DPI is standard for high-quality print. 72-96 DPI is for screen/web use.' },
    ],
  },
  'change-dpi': {
    title: 'Change Image DPI — Set DPI Online Free | ISHU TOOLS',
    description: 'Change the DPI of any image online free. Set to 72, 150, 300, or 600 DPI for screen or print-ready output.',
    keywords: ['change dpi', 'set image dpi', 'dpi changer', '300 dpi image', 'print dpi', 'image dpi setter', 'ishu change dpi'],
    h1: 'Change Image DPI — Set Custom DPI Free',
    faq: [
      { question: 'Does changing DPI affect image quality?', answer: 'Changing metadata DPI does not affect pixel data. For true resolution change, the image needs to be resampled.' },
    ],
  },
  'photo-collage': {
    title: 'Photo Collage Maker — Free Online | ISHU TOOLS',
    description: 'Create beautiful photo collages online free. Upload 2-50+ images, set grid columns, thumbnail size, and background color.',
    keywords: ['photo collage maker', 'image collage', 'collage maker online', 'photo grid maker', 'picture collage', 'ishu photo collage', 'free collage maker'],
    h1: 'Photo Collage Maker — Grid Collage Free',
    faq: [
      { question: 'How many photos can I add to the collage?', answer: 'You can add up to 50 images at once. The grid is automatically arranged based on your chosen column count.' },
    ],
  },
  'view-image-metadata': {
    title: 'View Image Metadata — EXIF Viewer Free | ISHU TOOLS',
    description: 'View EXIF metadata, DPI, dimensions, file size, and format info of any image free online. No signup needed.',
    keywords: ['image metadata viewer', 'exif viewer', 'image info', 'photo metadata', 'exif data viewer', 'view exif', 'ishu metadata viewer'],
    h1: 'View Image Metadata — EXIF Viewer Free',
    faq: [
      { question: 'What metadata can I view?', answer: 'You can see image dimensions, DPI, file size, format, color mode, and full EXIF data including camera settings if available.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  TEXT & UTILITY TOOLS (NEW)
  // ════════════════════════════════════════════════
  'epoch-converter': {
    title: 'Epoch Time Converter — Unix Timestamp Online Free | ISHU TOOLS',
    description: 'Convert Unix epoch timestamps to human dates and vice versa. Supports milliseconds. Free online, instant results.',
    keywords: ['epoch converter', 'unix timestamp converter', 'epoch to date', 'timestamp to date', 'unix time converter', 'ishu epoch converter'],
    h1: 'Epoch Time Converter — Unix Timestamp Free',
    faq: [
      { question: 'What is a Unix epoch timestamp?', answer: 'Unix time (epoch) is the number of seconds elapsed since January 1, 1970, UTC. It is used universally in programming.' },
    ],
  },
  'fancy-text-generator': {
    title: 'Fancy Text Generator — Stylish Unicode Text Free | ISHU TOOLS',
    description: 'Generate fancy Unicode text styles — bold, italic, bubble, strikethrough, upside-down for Instagram, WhatsApp, and social media.',
    keywords: ['fancy text generator', 'stylish text', 'unicode text', 'bold text generator', 'cool text', 'instagram font', 'ishu fancy text'],
    h1: 'Fancy Text Generator — Stylish Text Free',
    faq: [
      { question: 'Can I use fancy text on Instagram and WhatsApp?', answer: 'Yes, the Unicode characters work on Instagram, WhatsApp, Twitter, Facebook, and most social media platforms.' },
    ],
  },
  'json-path-finder': {
    title: 'JSONPath Finder — Query JSON Online Free | ISHU TOOLS',
    description: 'Query JSON data using JSONPath expressions online free. Extract nested values, arrays, and objects with ease.',
    keywords: ['jsonpath', 'json path finder', 'json query', 'jsonpath online', 'json extractor', 'ishu jsonpath'],
    h1: 'JSONPath Finder — Query JSON Free Online',
    faq: [],
  },
  'line-counter': {
    title: 'Line Counter — Count Lines & Words Online Free | ISHU TOOLS',
    description: 'Count total lines, non-empty lines, blank lines, words, and characters in any text online free.',
    keywords: ['line counter', 'count lines', 'line count tool', 'text line counter', 'word counter lines', 'ishu line counter'],
    h1: 'Line Counter — Count Lines & Words Free',
    faq: [],
  },
  'morse-to-text': {
    title: 'Morse Code Decoder — Morse to Text Free | ISHU TOOLS',
    description: 'Decode Morse code to readable text online free. Supports dots and dashes format. Instant results.',
    keywords: ['morse code decoder', 'morse to text', 'decode morse', 'morse translator', 'ishu morse decoder'],
    h1: 'Morse Code to Text — Decode Free Online',
    faq: [
      { question: 'How do I format Morse code for decoding?', answer: 'Separate letters with single spaces and words with 3 spaces. Example: ".... . .-.. .-.. ---" for HELLO.' },
    ],
  },
  'text-to-morse': {
    title: 'Text to Morse Code — Encode Text Free | ISHU TOOLS',
    description: 'Encode any text to Morse code online free. Converts all letters and numbers to Morse code dots and dashes.',
    keywords: ['text to morse', 'morse encoder', 'convert to morse', 'morse code generator', 'ishu text to morse'],
    h1: 'Text to Morse Code — Encoder Free Online',
    faq: [],
  },
  'nato-alphabet': {
    title: 'NATO Phonetic Alphabet — Converter Free | ISHU TOOLS',
    description: 'Convert text to NATO phonetic alphabet (Alpha, Bravo, Charlie) online free. Perfect for radio communication and clarity.',
    keywords: ['nato alphabet', 'phonetic alphabet', 'nato phonetic converter', 'radio alphabet', 'military alphabet', 'ishu nato alphabet'],
    h1: 'NATO Phonetic Alphabet — Converter Free',
    faq: [],
  },
  'number-to-roman': {
    title: 'Number to Roman Numerals — Converter Free | ISHU TOOLS',
    description: 'Convert Arabic numbers to Roman numerals online free. Supports 1 to 3999. Instant results with no signup.',
    keywords: ['number to roman', 'arabic to roman', 'roman numeral converter', 'convert to roman', 'ishu roman numerals'],
    h1: 'Number to Roman Numerals — Free Converter',
    faq: [],
  },
  'roman-to-number': {
    title: 'Roman Numerals to Number — Converter Free | ISHU TOOLS',
    description: 'Convert Roman numerals to Arabic numbers online free. Decode any Roman numeral instantly.',
    keywords: ['roman to number', 'roman numeral decoder', 'convert roman numerals', 'roman arabic', 'ishu roman to number'],
    h1: 'Roman Numerals to Number — Free Converter',
    faq: [],
  },
  'octal-to-text': {
    title: 'Octal to Text — Converter Free Online | ISHU TOOLS',
    description: 'Convert octal values to readable text online free. Decode octal encoded strings instantly.',
    keywords: ['octal to text', 'octal decoder', 'octal converter', 'base 8 to text', 'ishu octal to text'],
    h1: 'Octal to Text — Free Online Decoder',
    faq: [],
  },
  'text-to-octal': {
    title: 'Text to Octal — Converter Free Online | ISHU TOOLS',
    description: 'Convert any text to octal (base-8) values online free. Encode strings in octal format instantly.',
    keywords: ['text to octal', 'octal encoder', 'octal converter', 'base 8 encode', 'ishu text to octal'],
    h1: 'Text to Octal — Free Online Encoder',
    faq: [],
  },
  'pig-latin': {
    title: 'Pig Latin Translator — Free Online | ISHU TOOLS',
    description: 'Translate English text to Pig Latin online free. Fun word scrambler for language games.',
    keywords: ['pig latin', 'pig latin translator', 'pig latin converter', 'word game', 'fun text', 'ishu pig latin'],
    h1: 'Pig Latin Translator — Free Online',
    faq: [],
  },
  'text-repeat': {
    title: 'Text Repeater — Repeat Text Online Free | ISHU TOOLS',
    description: 'Repeat any text a custom number of times online free. Choose separator (newline, comma, space). Instant results.',
    keywords: ['text repeater', 'repeat text', 'text multiplier', 'duplicate text', 'ishu text repeater'],
    h1: 'Text Repeater — Repeat Text Free Online',
    faq: [],
  },
  'random-color-generator': {
    title: 'Random Color Generator — HEX RGB HSL Free | ISHU TOOLS',
    description: 'Generate random colors with HEX, RGB, and HSL values online free. Great for design inspiration and prototyping.',
    keywords: ['random color generator', 'random hex color', 'color palette generator', 'random rgb', 'ishu random color', 'color inspiration'],
    h1: 'Random Color Generator — HEX RGB HSL Free',
    faq: [],
  },
  'string-hash': {
    title: 'String Hash Generator — MD5 SHA256 Free | ISHU TOOLS',
    description: 'Generate MD5, SHA1, SHA256, SHA512, and CRC32 hashes from any text string online free.',
    keywords: ['string hash', 'hash generator', 'md5 hash', 'sha256 hash', 'sha1 hash', 'checksum generator', 'ishu hash generator'],
    h1: 'String Hash Generator — MD5 SHA256 Free',
    faq: [],
  },
  'text-to-ascii-art': {
    title: 'Text to ASCII Art — ASCII Banner Generator Free | ISHU TOOLS',
    description: 'Convert text to ASCII art banners online free. Multiple font styles including standard, big, block, slant, and bubble.',
    keywords: ['text to ascii art', 'ascii art generator', 'ascii banner', 'figlet online', 'text banner', 'ishu ascii art', 'ascii text generator'],
    h1: 'Text to ASCII Art — Banner Generator Free',
    faq: [
      { question: 'What font styles are available?', answer: 'Standard, Big, Block, Bubble, Slant, Banner, and Digital font styles are available.' },
    ],
  },
  'whitespace-remover': {
    title: 'Whitespace Remover — Clean Text Online Free | ISHU TOOLS',
    description: 'Remove extra whitespace, leading/trailing spaces, or collapse all spaces in text online free. Clean text instantly.',
    keywords: ['whitespace remover', 'remove spaces', 'trim whitespace', 'extra space remover', 'clean text tool', 'ishu whitespace remover'],
    h1: 'Whitespace Remover — Clean Text Free Online',
    faq: [],
  },

  // ── HEALTH & FITNESS ──────────────────────────────────────────────────
  'calorie-calculator': {
    title: 'Calorie Calculator (TDEE) — Free Online | ISHU TOOLS',
    description: 'Free calorie calculator. Find your daily calorie needs using TDEE, BMR (Mifflin-St Jeor). Enter age, weight, height, gender & activity. Weight loss/gain targets. No signup.',
    keywords: ['calorie calculator', 'tdee calculator', 'daily calorie needs', 'bmr calculator', 'calorie calculator india', 'daily calorie intake calculator', 'calories to lose weight', 'free calorie calculator online', 'ishu calorie calculator'],
    h1: 'Calorie Calculator (TDEE) — Find Your Daily Calorie Needs Free',
    faq: [
      { question: 'What is a calorie calculator?', answer: 'A calorie calculator estimates your Total Daily Energy Expenditure (TDEE) — the number of calories you burn per day based on your age, weight, height, gender, and activity level.' },
      { question: 'How do I use this calorie calculator?', answer: 'Enter your age, weight (kg), height (cm), gender, and activity level. Click Run to get your BMR and TDEE instantly — no signup required.' },
      { question: 'How many calories do I need to lose weight?', answer: 'To lose weight, eat 500 calories less than your TDEE per day. This creates a 500 kcal/day deficit, leading to ~0.5 kg weight loss per week.' },
    ],
  },
  'bmr-calculator': {
    title: 'BMR Calculator — Free Basal Metabolic Rate Online | ISHU TOOLS',
    description: 'Free BMR calculator. Calculate your Basal Metabolic Rate using Mifflin-St Jeor and Harris-Benedict equations. Find minimum daily calories needed. No signup, instant results.',
    keywords: ['bmr calculator', 'basal metabolic rate', 'bmr formula', 'bmr calculator india', 'bmr online free', 'mifflin st jeor', 'harris benedict bmr', 'ishu bmr calculator', 'metabolism calculator'],
    h1: 'BMR Calculator — Calculate Basal Metabolic Rate Free Online',
    faq: [
      { question: 'What is BMR?', answer: 'BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest to maintain basic life functions like breathing and circulation.' },
      { question: 'What formula does this BMR calculator use?', answer: 'This calculator uses the Mifflin-St Jeor equation (most accurate for most people) and also shows the Harris-Benedict result for comparison.' },
    ],
  },
  'water-intake-calculator': {
    title: 'Water Intake Calculator — Daily Hydration Free Online | ISHU TOOLS',
    description: 'Free water intake calculator. Calculate your recommended daily water intake in litres and cups based on weight, activity level, and climate. No signup, instant results.',
    keywords: ['water intake calculator', 'daily water intake', 'how much water to drink', 'hydration calculator', 'water intake per day', 'water calculator india', 'daily water requirement', 'ishu water intake calculator'],
    h1: 'Water Intake Calculator — Daily Hydration Recommendation Free',
    faq: [
      { question: 'How much water should I drink per day?', answer: 'The general recommendation is 33 ml per kg of body weight per day. For a 70 kg person, that is about 2.3 litres or 10 cups daily, adjusted for activity and climate.' },
    ],
  },
  'sleep-calculator': {
    title: 'Sleep Calculator — Best Wake Up Times Free Online | ISHU TOOLS',
    description: 'Free sleep calculator. Find the best wake-up times based on 90-minute sleep cycles. Enter bedtime to get optimal alarm times for feeling refreshed. No signup required.',
    keywords: ['sleep calculator', 'sleep cycle calculator', 'best wake up time', 'when to wake up', 'alarm time calculator', 'sleep cycle 90 minutes', 'rem sleep calculator', 'ishu sleep calculator', 'sleep time calculator'],
    h1: 'Sleep Calculator — Find the Best Wake-Up Time Based on Sleep Cycles',
    faq: [
      { question: 'How does the sleep calculator work?', answer: 'Each sleep cycle lasts 90 minutes. You feel most refreshed when you wake up at the END of a cycle. Enter your bedtime and the calculator shows the best wake times after 4, 5, or 6 cycles.' },
      { question: 'How many sleep cycles do I need?', answer: 'Adults need 5–6 complete sleep cycles (7.5–9 hours) for optimal rest. 4 cycles (6 hours) is the absolute minimum. Less than 4 cycles causes sleep deprivation.' },
    ],
  },
  'heart-rate-zones': {
    title: 'Heart Rate Zones Calculator — Training Zones Free | ISHU TOOLS',
    description: 'Free heart rate zones calculator. Calculate 5 training zones using Karvonen method from age and resting heart rate. Optimize cardio training and fat burn. No signup.',
    keywords: ['heart rate zones calculator', 'target heart rate zones', 'karvonen method', 'cardio training zones', 'fat burn zone', 'max heart rate calculator', 'heart rate training', 'ishu heart rate calculator'],
    h1: 'Heart Rate Zones Calculator — Find Your 5 Training Zones Free',
    faq: [
      { question: 'What are heart rate training zones?', answer: 'Heart rate zones are ranges of heart beats per minute that correspond to exercise intensity. Zone 1 (50–60%) is warm-up, Zone 2 (60–70%) burns fat, Zone 3–4 improves fitness, Zone 5 (90%+) is max effort.' },
    ],
  },
  'steps-to-km': {
    title: 'Steps to KM Converter — Steps to Distance Free | ISHU TOOLS',
    description: 'Free steps to km converter. Convert walking steps to km and miles. Calculates calories burned and estimated time. Works for 10,000 steps goal. No signup required.',
    keywords: ['steps to km', 'steps to kilometers', 'steps to miles', '10000 steps to km', 'steps calculator', 'steps converter', 'how many km is 10000 steps', 'steps to distance', 'ishu steps calculator'],
    h1: 'Steps to KM Converter — Convert Steps to Distance & Calories Free',
    faq: [
      { question: 'How many km is 10,000 steps?', answer: 'For an average person with height 170 cm, 10,000 steps is approximately 7–8 km. The exact distance depends on your stride length, which is calculated from your height.' },
    ],
  },
  'calories-burned-calculator': {
    title: 'Calories Burned Calculator — Exercise Calories Free | ISHU TOOLS',
    description: 'Free calories burned calculator. Calculate calories burned walking, running, cycling, swimming, yoga, gym. Enter activity, weight, and duration. No signup, instant results.',
    keywords: ['calories burned calculator', 'calories burned walking', 'calories burned running', 'exercise calories calculator', 'workout calories calculator', 'calories burned by activity', 'ishu calorie burn calculator'],
    h1: 'Calories Burned Calculator — Find Calories Burned by Any Activity Free',
    faq: [
      { question: 'How are calories burned calculated?', answer: 'Calories burned = MET (metabolic equivalent) × body weight (kg) × duration (hours). Walking has MET ~3.5, Running ~9.8, Cycling ~7.5, Swimming ~8.0.' },
    ],
  },

  // ── FINANCE & TAX ──────────────────────────────────────────────────────
  'gst-calculator': {
    title: 'GST Calculator India — Add/Remove GST Free Online | ISHU TOOLS',
    description: 'Free Indian GST calculator. Add or remove GST for 5%, 12%, 18%, 28% rates. Shows CGST, SGST, IGST breakdown instantly. No signup, no app required. Best free GST tool 2024.',
    keywords: ['gst calculator', 'gst calculator india', 'gst tax calculator', 'add gst calculator', 'remove gst calculator', 'cgst sgst calculator', 'igst calculator', '18 percent gst calculator', 'gst inclusive exclusive', 'ishu gst calculator', 'gst amount calculator india 2024'],
    h1: 'GST Calculator India — Add or Remove GST Online Free',
    faq: [
      { question: 'How to calculate GST in India?', answer: 'To add GST: Final Price = Original Price × (1 + GST rate/100). To remove GST: Original Price = GST-inclusive price ÷ (1 + GST rate/100). This calculator does both automatically.' },
      { question: 'What are the GST rates in India?', answer: 'India has 5 GST rates: 0% (essential goods), 5% (basic necessities), 12% (standard goods), 18% (most services and goods), 28% (luxury goods and sin goods). This calculator supports all rates.' },
      { question: 'What is CGST, SGST, and IGST?', answer: 'CGST (Central GST) and SGST (State GST) are each half of the total GST for intra-state transactions. IGST (Integrated GST) equals the full GST rate for inter-state transactions.' },
    ],
  },
  'sip-calculator': {
    title: 'SIP Calculator — Mutual Fund SIP Returns Free | ISHU TOOLS',
    description: 'Free SIP calculator. Calculate SIP (Systematic Investment Plan) returns, maturity value, and wealth gained. Enter monthly SIP, rate of return, and tenure. No signup.',
    keywords: ['sip calculator', 'mutual fund sip calculator', 'sip returns calculator', 'sip maturity value', 'sip investment calculator', 'monthly sip calculator india', 'sip calculator 2024', 'ishu sip calculator', 'sip wealth calculator'],
    h1: 'SIP Calculator — Calculate Mutual Fund SIP Returns Free Online',
    faq: [
      { question: 'How does a SIP calculator work?', answer: 'SIP maturity value is calculated as: FV = P × ((1+r)^n - 1) / r × (1+r), where P is monthly investment, r is monthly rate (annual rate / 12), and n is total months.' },
      { question: 'What is SIP?', answer: 'SIP (Systematic Investment Plan) is a method of investing a fixed amount in mutual funds at regular intervals (monthly). It helps build wealth through the power of compounding over time.' },
      { question: 'Is SIP better than lump sum investment?', answer: 'SIP is generally better for regular investors as it averages out market volatility (rupee cost averaging). Lump sum can be better during market lows. SIP is recommended for salaried individuals.' },
    ],
  },
  'roi-calculator': {
    title: 'ROI Calculator — Return on Investment & CAGR Free | ISHU TOOLS',
    description: 'Free ROI calculator. Calculate Return on Investment percentage and CAGR from initial investment and final value. Works for stocks, real estate, business. No signup.',
    keywords: ['roi calculator', 'return on investment calculator', 'cagr calculator', 'investment return calculator', 'roi formula', 'calculate roi online', 'roi percentage calculator', 'ishu roi calculator', 'investment profit calculator'],
    h1: 'ROI Calculator — Calculate Return on Investment & CAGR Free',
    faq: [
      { question: 'How to calculate ROI?', answer: 'ROI = (Final Value - Initial Investment) / Initial Investment × 100%. For example, if you invested ₹1,00,000 and got ₹1,50,000, ROI = (1,50,000 - 1,00,000) / 1,00,000 × 100 = 50%.' },
      { question: 'What is CAGR?', answer: 'CAGR (Compound Annual Growth Rate) = (Final Value / Initial Value)^(1/years) - 1. It measures the rate at which an investment would have grown if it had grown at a steady rate compounded annually.' },
    ],
  },
  'budget-planner': {
    title: 'Budget Planner (50/30/20 Rule) — Monthly Budget Free | ISHU TOOLS',
    description: 'Free monthly budget planner. Split your income using the 50/30/20 rule — 50% Needs, 30% Wants, 20% Savings. Enter monthly salary for instant budget breakdown. No signup.',
    keywords: ['budget planner', 'monthly budget calculator', '50 30 20 rule', 'budget calculator india', 'salary budget planner', 'personal budget calculator', 'budget planning tool', 'ishu budget planner', 'income budget split calculator'],
    h1: 'Budget Planner — 50/30/20 Rule Monthly Budget Calculator Free',
    faq: [
      { question: 'What is the 50/30/20 budget rule?', answer: 'The 50/30/20 rule divides after-tax income: 50% for Needs (rent, food, bills), 30% for Wants (entertainment, dining, shopping), and 20% for Savings (emergency fund, investments, debt repayment).' },
    ],
  },
  'income-tax-calculator': {
    title: 'Income Tax Calculator India FY 2024-25 — Free Online | ISHU TOOLS',
    description: 'Free Indian income tax calculator FY 2024-25. Calculate tax under old and new regime. Slab-wise breakdown, 87A rebate, 4% cess, effective rate. Instant results, no signup.',
    keywords: ['income tax calculator india', 'income tax calculator 2024-25', 'new tax regime calculator', 'old tax regime calculator', 'india income tax slab', '87a rebate calculator', 'itr calculator', 'tax calculator india 2024', 'ishu income tax calculator', 'salary tax calculator india'],
    h1: 'Income Tax Calculator India FY 2024-25 — Old & New Regime Free',
    faq: [
      { question: 'What are the new tax regime slabs for FY 2024-25?', answer: 'New regime FY 2024-25: ₹0-3L = 0%, ₹3-6L = 5%, ₹6-9L = 10%, ₹9-12L = 15%, ₹12-15L = 20%, above ₹15L = 30%. Plus 4% health & education cess. Rebate u/s 87A up to ₹7L income.' },
      { question: 'Should I choose old or new tax regime?', answer: 'New regime is better if your deductions (80C, HRA, etc.) are less than ~₹3.5L. Old regime is better if you have high deductions like 80C (₹1.5L), HRA, home loan, etc. Use this calculator to compare both.' },
      { question: 'What is rebate u/s 87A?', answer: 'Under the new regime, if your annual income is ≤₹7 lakh, you get a rebate of up to ₹25,000 on tax. Under the old regime, if income is ≤₹5 lakh, rebate is up to ₹12,500. This effectively makes income up to ₹7L tax-free under new regime.' },
    ],
  },

  // ── EVERYDAY UTILITY (new) ─────────────────────────────────────────────
  'gst-tax-calculator': {
    title: 'GST Tax Calculator India — Free Online | ISHU TOOLS',
    description: 'Free GST tax calculator for India. Instantly calculate GST for any rate. Shows CGST, SGST, IGST breakdown. No signup.',
    keywords: ['gst tax calculator', 'gst calculator india', 'cgst sgst igst', 'ishu gst calculator'],
    h1: 'GST Tax Calculator India — Free Online',
    faq: [],
  },
  'number-to-words': {
    title: 'Number to Words Converter — Indian & International | ISHU TOOLS',
    description: 'Free number to words converter. Convert numbers to Indian words (Lakh, Crore) and International (Million, Billion). Perfect for cheques and forms. No signup.',
    keywords: ['number to words', 'number in words', 'lakh crore in words', 'spell number online', 'number to words converter india', 'cheque amount in words', 'ishu number to words'],
    h1: 'Number to Words Converter — Indian Lakh/Crore System Free',
    faq: [
      { question: 'How to write 10 lakh in words?', answer: 'In Indian system: 10,00,000 = "Ten Lakh". In International system: 1,000,000 = "One Million". This converter handles both systems for any number up to 999 billion.' },
    ],
  },
  'roman-numeral-converter': {
    title: 'Roman Numeral Converter — Arabic to Roman Free | ISHU TOOLS',
    description: 'Free Roman numeral converter. Convert Arabic numbers 1-3999 to Roman numerals and vice versa. Bidirectional conversion, instant results. No signup required.',
    keywords: ['roman numeral converter', 'arabic to roman', 'roman to arabic', 'roman numerals online', 'convert to roman numerals', 'roman numeral calculator', 'ishu roman numeral converter'],
    h1: 'Roman Numeral Converter — Convert Arabic ↔ Roman Free Online',
    faq: [],
  },
  'date-calculator': {
    title: 'Date Difference Calculator — Days Between Dates Free | ISHU TOOLS',
    description: 'Free date calculator. Calculate days, weeks, months between two dates. Add or subtract days from any date. No signup, instant results online.',
    keywords: ['date calculator', 'date difference calculator', 'days between dates', 'date difference online', 'date counter', 'day calculator', 'ishu date calculator'],
    h1: 'Date Difference Calculator — Days, Weeks, Months Between Dates Free',
    faq: [],
  },
  'age-in-seconds': {
    title: 'Age Calculator — Age in Seconds, Days, Hours Free | ISHU TOOLS',
    description: 'Free detailed age calculator. Know your exact age in years, months, days, hours, minutes, and seconds. Shows next birthday countdown. No signup required.',
    keywords: ['age in seconds', 'age calculator', 'exact age calculator', 'age in days', 'how old am i in seconds', 'birthday countdown', 'ishu age calculator'],
    h1: 'Age Calculator — Exact Age in Seconds, Days & Hours Free',
    faq: [],
  },

  // ─── Network Tools ───
  'ip-address-lookup': {
    title: 'IP Address Lookup — Find My IP & Geolocation Free | ISHU TOOLS',
    description: 'Find your public IP address and detailed geolocation: country, city, region, ISP, timezone, and coordinates. Free IP checker — no signup.',
    keywords: ['ip address lookup', 'what is my ip', 'my ip address', 'ip geolocation lookup', 'ip location finder', 'ip checker free', 'find ip address online', 'check my ip', 'ip address tracker', 'ip geolocation free'],
    h1: 'IP Address Lookup — Free IP Geolocation & ISP Finder',
    faq: [
      { question: 'What is an IP address lookup?', answer: 'An IP lookup finds the geographic location, ISP, and network details associated with any IP address. This tool shows your current public IP address along with country, city, timezone, and ISP information.' },
      { question: 'Is this IP lookup free?', answer: 'Yes, completely free with no signup required. Check your IP address anytime on any device.' },
      { question: 'How accurate is the IP geolocation?', answer: 'IP geolocation is typically accurate to city or region level. It shows the location of your ISP\'s network, not your exact home address.' },
    ],
  },
  'dns-lookup': {
    title: 'DNS Lookup Tool — Check DNS Records Online Free | ISHU TOOLS',
    description: 'Look up DNS records for any domain. Check A, AAAA, MX, CNAME, TXT, NS, SOA records instantly. Free online DNS checker — no signup needed.',
    keywords: ['dns lookup', 'dns record lookup', 'check dns records', 'dns checker online', 'mx record lookup', 'cname lookup', 'a record lookup', 'txt record checker', 'ns record lookup', 'dns records tool free', 'domain dns checker'],
    h1: 'DNS Lookup Tool — Check All DNS Records for Any Domain Free',
    faq: [
      { question: 'What is a DNS lookup?', answer: 'A DNS lookup queries the Domain Name System to find the DNS records associated with a domain name. This includes A records (IP addresses), MX records (mail servers), CNAME, TXT, NS, and more.' },
      { question: 'How do I check DNS records for a domain?', answer: 'Simply enter the domain name in this tool and click Run. You\'ll see all DNS records including A, AAAA, MX, CNAME, TXT, NS, and SOA records.' },
      { question: 'What is an MX record?', answer: 'An MX (Mail Exchanger) record specifies the mail servers responsible for accepting email for a domain. This helps diagnose email delivery issues.' },
    ],
  },
  'whois-lookup': {
    title: 'WHOIS Lookup — Domain Registration Info Free | ISHU TOOLS',
    description: 'Look up WHOIS information for any domain. Find domain owner, registrar, creation date, expiry date, and nameservers. Free WHOIS checker.',
    keywords: ['whois lookup', 'domain whois lookup', 'whois search', 'domain owner lookup', 'domain info', 'check domain registration', 'domain expiry checker', 'registrar lookup', 'whois tool free', 'domain registration info'],
    h1: 'WHOIS Lookup — Free Domain Registration Info Checker',
    faq: [
      { question: 'What is WHOIS?', answer: 'WHOIS is a publicly accessible database that stores information about domain name registrations, including the registrant, registrar, registration date, expiry date, and nameservers.' },
      { question: 'How do I find who owns a domain?', answer: 'Enter the domain name in this WHOIS lookup tool. You\'ll see the registrant information, registrar, and registration dates. Note that some registrants use privacy protection to hide their details.' },
    ],
  },
  'ssl-certificate-checker': {
    title: 'SSL Certificate Checker — Check HTTPS & TLS Expiry Free | ISHU TOOLS',
    description: 'Check SSL/TLS certificate details for any website. View expiry date, days remaining, issuer, organization, and common name. Free SSL checker online.',
    keywords: ['ssl certificate checker', 'ssl checker', 'ssl expiry checker', 'check ssl certificate', 'https checker', 'tls certificate checker', 'ssl certificate expiry', 'ssl certificate validator', 'website ssl check', 'ssl expiry date'],
    h1: 'SSL Certificate Checker — Free HTTPS & TLS Certificate Validator',
    faq: [
      { question: 'How do I check if an SSL certificate is valid?', answer: 'Enter the domain name (e.g., example.com) in this tool. It will check the SSL certificate, show the expiry date, days remaining, and whether it is currently valid.' },
      { question: 'What happens when an SSL certificate expires?', answer: 'When an SSL certificate expires, browsers show a security warning and may block access to the website. It\'s important to renew SSL certificates before they expire.' },
      { question: 'Is this SSL checker free?', answer: 'Yes, completely free. Check any domain\'s SSL certificate status instantly with no signup required.' },
    ],
  },

  // ─── Finance Tools ───
  'emi-calculator-advanced': {
    title: 'EMI Calculator — Monthly Loan EMI Calculator India Free | ISHU TOOLS',
    description: 'Calculate your loan EMI instantly. Get monthly EMI, total interest, total amount paid, and a complete 12-month amortization schedule. Free EMI calculator for home, car, personal loans.',
    keywords: ['emi calculator', 'loan emi calculator', 'home loan emi calculator', 'car loan emi calculator', 'personal loan emi', 'emi calculator india', 'monthly emi calculator', 'emi calculation formula', 'loan emi calculator online', 'emi calculator 2025'],
    h1: 'EMI Calculator — Free Loan EMI Calculator with Amortization Schedule',
    faq: [
      { question: 'How is EMI calculated?', answer: 'EMI = [P × r × (1+r)^n] / [(1+r)^n - 1], where P is the principal loan amount, r is the monthly interest rate, and n is the number of monthly installments.' },
      { question: 'What is EMI?', answer: 'EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender on a specified date each calendar month. EMIs cover both principal and interest charges.' },
      { question: 'What is an amortization schedule?', answer: 'An amortization schedule shows the breakdown of each EMI payment into principal and interest components, and the remaining balance after each payment.' },
    ],
  },
  'gst-calculator-india': {
    title: 'GST Calculator India — Calculate GST Amount Free | ISHU TOOLS',
    description: 'Free GST calculator for India. Calculate GST amount, CGST, SGST, and total price for any amount and GST slab (5%, 12%, 18%, 28%). No signup needed.',
    keywords: ['gst calculator', 'gst calculator india', 'calculate gst', 'gst amount calculator', 'cgst sgst calculator', 'gst inclusive calculator', 'gst exclusive calculator', 'gst rate calculator', 'goods and services tax calculator', 'gst calculator online india'],
    h1: 'GST Calculator India — Free CGST, SGST & Total Tax Calculator',
    faq: [
      { question: 'How do I calculate GST in India?', answer: 'GST Amount = (Original Cost × GST Rate) / 100. For example, ₹1000 with 18% GST = ₹180 GST. Total = ₹1180. CGST and SGST are each half of the total GST.' },
      { question: 'What are the GST slab rates in India?', answer: 'GST has 4 main slabs: 5% (essential goods), 12% (standard goods), 18% (most goods/services), and 28% (luxury/demerit goods). Some items like food essentials are exempt (0%).' },
      { question: 'What is CGST and SGST?', answer: 'CGST (Central GST) goes to the central government and SGST (State GST) goes to the state government. They are each half of the total GST rate for intra-state transactions.' },
    ],
  },
  'currency-converter': {
    title: 'Currency Converter — Free Online Exchange Rate Calculator | ISHU TOOLS',
    description: 'Convert currencies with live-ish exchange rates. USD, EUR, GBP, INR, JPY, AUD, CAD and 150+ currencies. Free currency calculator — no signup.',
    keywords: ['currency converter', 'currency exchange calculator', 'usd to inr', 'usd to eur', 'inr to usd', 'exchange rate calculator', 'forex calculator', 'currency conversion online', 'foreign exchange converter', 'currency calculator free'],
    h1: 'Currency Converter — Free Online Exchange Rate Calculator for 150+ Currencies',
    faq: [
      { question: 'How do I convert currencies?', answer: 'Select the "from" currency, enter the amount, select the "to" currency, and click Convert. The tool shows the converted amount and the exchange rate.' },
      { question: 'Is this currency converter accurate?', answer: 'This tool uses fixed reference exchange rates for calculations. For live trading rates, always check with your bank or financial institution.' },
      { question: 'Which currencies are supported?', answer: 'This converter supports 150+ currencies including USD, EUR, GBP, INR, JPY, AUD, CAD, CHF, CNY, and all major world currencies.' },
    ],
  },

  // ─── Math Tools ───
  'prime-number-checker': {
    title: 'Prime Number Checker — Is It Prime? Free Online | ISHU TOOLS',
    description: 'Check if any number is prime. Find prime factors, next prime, and all primes in a range. Free online prime number checker — instant results.',
    keywords: ['prime number checker', 'is it prime', 'prime number tester', 'check if number is prime', 'prime factorization', 'prime number finder', 'list of prime numbers', 'prime number calculator', 'next prime number', 'prime numbers tool'],
    h1: 'Prime Number Checker — Check If Any Number Is Prime Free',
    faq: [
      { question: 'What is a prime number?', answer: 'A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. Examples: 2, 3, 5, 7, 11, 13...' },
      { question: 'How do you check if a number is prime?', answer: 'A number is prime if it is greater than 1 and not divisible by any number from 2 to its square root. This tool instantly checks primality and shows the prime factorization.' },
      { question: 'What is prime factorization?', answer: 'Prime factorization breaks down a composite number into its prime number factors. For example, 12 = 2 × 2 × 3.' },
    ],
  },
  'fibonacci-generator': {
    title: 'Fibonacci Generator — Fibonacci Sequence Calculator Free | ISHU TOOLS',
    description: 'Generate Fibonacci sequence numbers online. Calculate any number of Fibonacci terms, find the nth Fibonacci number, and see the sum. Free and instant.',
    keywords: ['fibonacci generator', 'fibonacci sequence calculator', 'fibonacci numbers', 'nth fibonacci number', 'fibonacci series generator', 'fibonacci calculator online', 'fibonacci number finder', 'fibonacci tool free'],
    h1: 'Fibonacci Number Generator — Free Online Fibonacci Sequence Calculator',
    faq: [
      { question: 'What is the Fibonacci sequence?', answer: 'The Fibonacci sequence is a series where each number is the sum of the two preceding ones: 1, 1, 2, 3, 5, 8, 13, 21... It appears in nature, art, and mathematics.' },
      { question: 'How do I find the nth Fibonacci number?', answer: 'Enter the desired count of Fibonacci terms and click Generate. The tool shows the complete sequence, the sum of all terms, and the last Fibonacci number.' },
    ],
  },
  'statistics-calculator': {
    title: 'Statistics Calculator — Mean, Median, Mode, Std Dev Free | ISHU TOOLS',
    description: 'Free statistics calculator. Calculate mean, median, mode, standard deviation, variance, quartiles, IQR, and more from any dataset. No signup.',
    keywords: ['statistics calculator', 'mean median mode calculator', 'standard deviation calculator', 'variance calculator', 'statistics solver', 'descriptive statistics calculator', 'quartile calculator', 'iqr calculator', 'data analysis calculator'],
    h1: 'Statistics Calculator — Free Mean, Median, Mode, Standard Deviation Calculator',
    faq: [],
  },

  // ─── Text Tools ───
  'grammar-checker': {
    title: 'Grammar Checker — Free Online Grammar & Spelling Check | ISHU TOOLS',
    description: 'Free grammar checker online. Find grammar errors, spelling mistakes, punctuation issues, and get a writing quality score. No signup — instant results.',
    keywords: ['grammar checker', 'grammar checker free', 'online grammar check', 'spelling and grammar checker', 'grammar correction tool', 'grammar error checker', 'free grammar tool', 'check grammar online', 'writing checker', 'english grammar checker'],
    h1: 'Grammar Checker — Free Online Grammar & Spelling Correction Tool',
    faq: [
      { question: 'Is this grammar checker free?', answer: 'Yes, completely free with no signup, no limits, and no premium plans. Paste your text and get grammar corrections instantly.' },
      { question: 'How does the grammar checker work?', answer: 'The tool analyzes your text for common grammar errors, spelling mistakes, punctuation issues, and style problems. It returns a quality score, individual issues, and suggested corrections.' },
    ],
  },
  'plagiarism-checker': {
    title: 'Plagiarism Checker — Free Online Uniqueness Score | ISHU TOOLS',
    description: 'Free plagiarism checker for students and writers. Get a uniqueness score, repetition analysis, and content fingerprint. No signup, instant results.',
    keywords: ['plagiarism checker free', 'plagiarism checker online', 'plagiarism detector', 'uniqueness checker', 'check plagiarism free', 'plagiarism tool for students', 'free plagiarism checker no login', 'plagiarism scanner', 'content originality checker'],
    h1: 'Plagiarism Checker — Free Online Uniqueness & Originality Detector',
    faq: [
      { question: 'Is this plagiarism checker free?', answer: 'Yes, completely free with no account required. Paste your text and get an instant uniqueness score and analysis.' },
      { question: 'How accurate is this plagiarism checker?', answer: 'This tool checks for repetition, common phrases, and text patterns to give a uniqueness score. For academic submissions, use in addition to official plagiarism detection tools.' },
    ],
  },
  'word-frequency-counter': {
    title: 'Word Frequency Counter — Analyze Word Occurrence in Text | ISHU TOOLS',
    description: 'Count how often each word appears in your text. Get word frequency table sorted by count. Perfect for SEO analysis, content research, and writing.',
    keywords: ['word frequency counter', 'word frequency analyzer', 'word count by word', 'text analysis tool', 'word occurrence counter', 'keyword frequency counter', 'word frequency table', 'text frequency analysis', 'content analysis tool'],
    h1: 'Word Frequency Counter — Free Text Analysis & Word Occurrence Tool',
    faq: [],
  },

  // ─── Health Tools ───
  'calorie-calculator': {
    title: 'Calorie Calculator — Daily Calorie Needs & TDEE Free | ISHU TOOLS',
    description: 'Calculate your daily calorie needs (TDEE), BMR, and recommended macros. Free online calorie calculator for weight loss, gain, or maintenance. No signup.',
    keywords: ['calorie calculator', 'tdee calculator', 'daily calorie calculator', 'calorie calculator for weight loss', 'calorie intake calculator', 'bmr calculator', 'calorie calculator india', 'how many calories do i need', 'daily calorie needs calculator', 'calorie deficit calculator'],
    h1: 'Calorie Calculator — Free TDEE, BMR & Daily Calorie Needs Calculator',
    faq: [
      { question: 'What is TDEE?', answer: 'TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns per day including exercise. This is your maintenance calorie level.' },
      { question: 'How many calories should I eat per day?', answer: 'It depends on your age, weight, height, gender, and activity level. This calculator computes your TDEE — eat less to lose weight, more to gain weight.' },
      { question: 'What is BMR?', answer: 'BMR (Basal Metabolic Rate) is the minimum number of calories your body needs at complete rest to maintain basic functions like breathing and circulation.' },
    ],
  },
  'sleep-calculator': {
    title: 'Sleep Calculator — Best Bedtime & Wake Up Time Free | ISHU TOOLS',
    description: 'Find the best time to wake up or go to sleep based on 90-minute sleep cycles. Free sleep calculator for better sleep quality and energy.',
    keywords: ['sleep calculator', 'best wake up time calculator', 'sleep cycle calculator', 'bedtime calculator', 'when should i wake up', 'sleep time calculator', 'rem sleep calculator', 'optimal sleep time', 'sleep calculator free'],
    h1: 'Sleep Calculator — Find Your Perfect Bedtime & Wake-Up Time Free',
    faq: [
      { question: 'How does the sleep calculator work?', answer: 'Sleep happens in 90-minute cycles. This calculator finds wake-up times that align with the end of a sleep cycle, so you wake up feeling refreshed instead of groggy.' },
      { question: 'How many sleep cycles do I need?', answer: 'Most adults need 5-6 complete sleep cycles (7.5-9 hours) per night for optimal health and energy. Less than 4 cycles (6 hours) leads to sleep deprivation.' },
    ],
  },
  'water-intake-calculator': {
    title: 'Water Intake Calculator — Daily Water Need Free | ISHU TOOLS',
    description: 'Calculate your recommended daily water intake based on weight, activity level, and climate. Free hydration calculator in liters and glasses.',
    keywords: ['water intake calculator', 'daily water intake calculator', 'how much water should i drink', 'water calculator', 'hydration calculator', 'water intake per day', 'water requirement calculator', 'daily water requirement', 'drink water calculator', 'water intake based on weight'],
    h1: 'Water Intake Calculator — Free Daily Hydration Needs Calculator',
    faq: [
      { question: 'How much water should I drink per day?', answer: 'A general rule is 35ml per kg of body weight. A 70kg person needs about 2.45 liters per day. This increases with exercise, heat, and certain health conditions.' },
      { question: 'Does coffee/tea count as water intake?', answer: 'Caffeinated beverages are mild diuretics and don\'t fully count. It\'s best to drink them in addition to your daily water target, not as a replacement.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  DEVELOPER TOOLS — Handcrafted SEO
  // ════════════════════════════════════════════════
  'json-formatter': {
    title: 'JSON Formatter & Beautifier Online Free | ISHU TOOLS',
    description: 'Format, beautify, validate, and minify JSON online for free. Pretty print JSON with syntax highlighting and error detection. Best free JSON formatter for developers — no signup, works instantly.',
    keywords: ['json formatter', 'json beautifier', 'format json online', 'json validator', 'json pretty print', 'json formatter online', 'json formatter free', 'json beautify online', 'json viewer', 'json editor online', 'validate json online', 'json formatter tool', 'ishu tools json formatter', 'json linter', 'format json string', 'json pretty printer', 'json indentation', 'json format checker'],
    h1: 'JSON Formatter & Beautifier — Free Online',
    faq: [
      { question: 'How to format JSON online?', answer: 'Paste your JSON into ISHU TOOLS JSON Formatter and click "Run". It instantly formats, indents, and validates your JSON. Errors are highlighted for easy debugging.' },
      { question: 'Can I validate JSON syntax with this tool?', answer: 'Yes! ISHU TOOLS JSON Formatter validates your JSON and shows error location if the JSON is invalid — making it perfect for debugging API responses and config files.' },
      { question: 'Is ISHU TOOLS JSON Formatter free?', answer: 'Yes, completely free, no signup required, works in your browser, and your data never leaves your device.' },
    ],
  },
  'xml-formatter': {
    title: 'XML Formatter & Beautifier Online Free | ISHU TOOLS',
    description: 'Format and beautify XML documents online for free. Validate XML syntax, pretty print with proper indentation. Best free XML formatter for developers and students.',
    keywords: ['xml formatter', 'xml beautifier', 'format xml online', 'xml validator', 'xml pretty print', 'xml formatter free', 'xml editor online', 'xml formatter tool', 'ishu tools xml formatter', 'xml indentation', 'validate xml online', 'xml formatter online'],
    h1: 'XML Formatter & Beautifier — Free Online',
    faq: [
      { question: 'How to format XML code?', answer: 'Paste your XML into ISHU TOOLS XML Formatter and it will instantly add proper indentation and validate your markup.' },
    ],
  },
  'base64-encode': {
    title: 'Base64 Encoder Online Free — Encode Text to Base64 | ISHU TOOLS',
    description: 'Encode text or files to Base64 online for free. Convert strings to Base64 format instantly. No signup, completely private, client-side processing.',
    keywords: ['base64 encode', 'base64 encoder', 'text to base64', 'encode base64 online', 'base64 encoding', 'base64 converter', 'base64 encoder online free', 'ishu tools base64', 'string to base64', 'base64 encode text', 'base64 encoding tool', 'online base64 encoder'],
    h1: 'Base64 Encoder — Free Online',
    faq: [
      { question: 'What is Base64 encoding?', answer: 'Base64 is a binary-to-text encoding that represents binary data as ASCII characters. It\'s used in email attachments, JWT tokens, data URLs, and API authentication.' },
    ],
  },
  'base64-decode': {
    title: 'Base64 Decoder Online Free — Decode Base64 to Text | ISHU TOOLS',
    description: 'Decode Base64 encoded strings back to plain text online for free. Instantly convert Base64 to readable text. No signup required.',
    keywords: ['base64 decode', 'base64 decoder', 'base64 to text', 'decode base64', 'base64 decoding online', 'base64 decoder free', 'ishu tools base64 decode', 'decode base64 string', 'base64 to string', 'online base64 decoder'],
    h1: 'Base64 Decoder — Free Online',
    faq: [],
  },
  'url-encode': {
    title: 'URL Encoder Online Free — Encode URL / Percent Encoding | ISHU TOOLS',
    description: 'URL encode strings online for free. Convert special characters to percent-encoded format for use in URLs. Essential tool for web developers and API testing.',
    keywords: ['url encode', 'url encoder', 'percent encoding', 'url encode online', 'urlencode', 'encode url free', 'ishu tools url encoder', 'url encode string', 'percent encode url', 'url encoding tool', 'online url encoder', 'encode special characters url'],
    h1: 'URL Encoder — Percent Encoding Free Online',
    faq: [
      { question: 'What is URL encoding?', answer: 'URL encoding replaces unsafe characters in a URL with percent-encoded equivalents (e.g., space becomes %20). It\'s required when passing special characters in query parameters.' },
    ],
  },
  'url-decode': {
    title: 'URL Decoder Online Free — Decode Percent-Encoded URLs | ISHU TOOLS',
    description: 'Decode URL-encoded strings back to readable text online for free. Convert %20 and percent-encoded characters to normal text. Essential for web development.',
    keywords: ['url decode', 'url decoder', 'decode url', 'percent decode', 'url decode online', 'url decoder free', 'ishu tools url decode', 'decode url string', 'online url decoder', 'urldecode'],
    h1: 'URL Decoder — Free Online',
    faq: [],
  },
  'html-encode': {
    title: 'HTML Encoder Online Free — Encode HTML Entities | ISHU TOOLS',
    description: 'Encode HTML special characters to HTML entities online for free. Convert <, >, &, " to &lt;, &gt;, &amp;, &quot;. Essential for safe HTML rendering.',
    keywords: ['html encode', 'html encoder', 'html entity encoder', 'encode html online', 'html escape', 'html entities', 'html encode free', 'ishu tools html encoder', 'html special characters', 'html encoding tool'],
    h1: 'HTML Encoder — Encode HTML Entities Free',
    faq: [],
  },
  'html-decode': {
    title: 'HTML Decoder Online Free — Decode HTML Entities | ISHU TOOLS',
    description: 'Decode HTML entities back to readable characters online for free. Convert &lt;, &gt;, &amp; back to <, >, &. No signup required.',
    keywords: ['html decode', 'html decoder', 'html entity decoder', 'decode html entities', 'html unescape', 'html decode online', 'ishu tools html decode', 'html decoding tool'],
    h1: 'HTML Decoder — Decode HTML Entities Free',
    faq: [],
  },
  'jwt-decode': {
    title: 'JWT Decoder Online Free — Decode JWT Tokens | ISHU TOOLS',
    description: 'Decode and inspect JWT (JSON Web Token) tokens online for free. View header, payload, and signature. Debug authentication tokens without any library.',
    keywords: ['jwt decode', 'jwt decoder', 'decode jwt token', 'jwt parser', 'json web token decode', 'jwt inspector', 'jwt decode online', 'jwt decoder free', 'ishu tools jwt', 'decode json web token', 'jwt token viewer', 'jwt payload decoder'],
    h1: 'JWT Decoder — Inspect JSON Web Tokens Free',
    faq: [
      { question: 'What is a JWT token?', answer: 'JWT (JSON Web Token) is a standard for securely transmitting information between parties as a JSON object. It has three parts: header, payload, and signature, separated by dots.' },
      { question: 'Is it safe to decode my JWT here?', answer: 'ISHU TOOLS JWT Decoder processes tokens entirely in your browser — nothing is sent to any server. Your tokens are completely private.' },
    ],
  },
  'regex-tester': {
    title: 'Regex Tester Online Free — Test Regular Expressions | ISHU TOOLS',
    description: 'Test and debug regular expressions (regex) online for free. Real-time matching, group capture, flags support. Best free regex tester for developers.',
    keywords: ['regex tester', 'regex test online', 'regular expression tester', 'regex debugger', 'test regex online', 'regex matcher', 'regex validator', 'ishu tools regex', 'online regex tester', 'regex checker free', 'javascript regex tester', 'regex pattern tester', 'regular expression test'],
    h1: 'Regex Tester — Test Regular Expressions Free Online',
    faq: [
      { question: 'What flags are supported?', answer: 'ISHU TOOLS Regex Tester supports all standard regex flags: g (global), i (case-insensitive), m (multiline), s (dotAll), and u (unicode).' },
    ],
  },
  'uuid-generator': {
    title: 'UUID Generator Online Free — Generate UUID v4 | ISHU TOOLS',
    description: 'Generate random UUID (v4) online for free. Bulk UUID generation, copy with one click. Best free UUID generator for developers and database design.',
    keywords: ['uuid generator', 'generate uuid', 'uuid v4', 'random uuid', 'guid generator', 'uuid online free', 'ishu tools uuid', 'unique id generator', 'uuid4 generator', 'bulk uuid generator', 'generate guid online', 'uuid tool'],
    h1: 'UUID Generator — Generate Random UUID v4 Free',
    faq: [
      { question: 'What is UUID v4?', answer: 'UUID v4 (Universally Unique Identifier) is a 128-bit randomly generated identifier, formatted as 8-4-4-4-12 hexadecimal characters. It\'s used as unique keys in databases, APIs, and distributed systems.' },
    ],
  },
  'password-generator': {
    title: 'Password Generator Online Free — Strong Random Password | ISHU TOOLS',
    description: 'Generate strong, random passwords online for free. Customize length, include symbols, numbers, uppercase. Create secure passwords for any account. No signup.',
    keywords: ['password generator', 'random password generator', 'strong password generator', 'generate password online', 'secure password creator', 'password generator free', 'ishu tools password generator', 'random strong password', 'create password online', 'password maker', 'safe password generator'],
    h1: 'Password Generator — Create Strong Random Passwords Free',
    faq: [
      { question: 'How do I create a strong password?', answer: 'A strong password should be at least 12-16 characters, include uppercase, lowercase, numbers, and special symbols. ISHU TOOLS Password Generator creates cryptographically random passwords that are virtually impossible to crack.' },
    ],
  },
  'lorem-ipsum-generator': {
    title: 'Lorem Ipsum Generator Online Free — Placeholder Text | ISHU TOOLS',
    description: 'Generate Lorem Ipsum placeholder text online for free. Choose paragraphs, words, or sentences. Classic and modern Lorem Ipsum variants. No signup required.',
    keywords: ['lorem ipsum generator', 'lorem ipsum', 'placeholder text generator', 'dummy text generator', 'lorem ipsum online', 'lorem ipsum free', 'ishu tools lorem ipsum', 'generate lorem ipsum', 'filler text generator', 'fake text generator', 'lorem ipsum paragraph generator'],
    h1: 'Lorem Ipsum Generator — Placeholder Text Free Online',
    faq: [],
  },
  'bcrypt-hash': {
    title: 'Bcrypt Hash Generator Online Free — Hash Password | ISHU TOOLS',
    description: 'Generate Bcrypt hashed passwords online for free. Secure password hashing with configurable cost factor. Verify existing Bcrypt hashes. Essential for backend developers.',
    keywords: ['bcrypt hash', 'bcrypt generator', 'hash password bcrypt', 'bcrypt online', 'bcrypt password hash', 'bcrypt hash generator', 'ishu tools bcrypt', 'bcrypt hashing tool', 'password hash generator', 'bcrypt cost factor', 'bcrypt verify'],
    h1: 'Bcrypt Hash Generator — Secure Password Hashing Free',
    faq: [
      { question: 'Why use Bcrypt for passwords?', answer: 'Bcrypt is designed to be slow and computationally expensive, making brute-force attacks impractical. It\'s the industry standard for storing user passwords in databases.' },
    ],
  },
  'md5-hash': {
    title: 'MD5 Hash Generator Online Free | ISHU TOOLS',
    description: 'Generate MD5 hash of any text online for free. Instant MD5 checksum calculation. Verify file integrity with MD5. No signup required.',
    keywords: ['md5 hash', 'md5 generator', 'md5 checksum', 'generate md5', 'md5 online', 'md5 hash generator free', 'ishu tools md5', 'md5 calculator', 'md5 hash string', 'text to md5', 'md5 encoder'],
    h1: 'MD5 Hash Generator — Free Online',
    faq: [
      { question: 'Is MD5 secure for passwords?', answer: 'No! MD5 is cryptographically broken and should never be used for passwords. Use Bcrypt or SHA-512 instead. MD5 is still useful for file integrity verification and checksums.' },
    ],
  },
  'sha256-hash': {
    title: 'SHA-256 Hash Generator Online Free | ISHU TOOLS',
    description: 'Generate SHA-256 cryptographic hash of any text online for free. Verify file integrity, create checksums, sign data. Instant SHA256 calculation.',
    keywords: ['sha256 hash', 'sha-256 generator', 'sha256 online', 'sha256 checksum', 'generate sha256', 'sha256 hash generator free', 'ishu tools sha256', 'sha256 calculator', 'text to sha256', 'sha-256 encoder'],
    h1: 'SHA-256 Hash Generator — Free Online',
    faq: [],
  },
  'sha512-hash': {
    title: 'SHA-512 Hash Generator Online Free | ISHU TOOLS',
    description: 'Generate SHA-512 cryptographic hash of any text online for free. Most secure SHA family hash. No signup required.',
    keywords: ['sha512 hash', 'sha-512 generator', 'sha512 online', 'sha-512 hash generator', 'ishu tools sha512'],
    h1: 'SHA-512 Hash Generator — Free Online',
    faq: [],
  },
  'diff-checker': {
    title: 'Text Diff Checker Online Free — Compare Two Texts | ISHU TOOLS',
    description: 'Compare two text files side by side and find differences online for free. Highlight changes, additions, deletions. Best free diff tool for developers and writers.',
    keywords: ['diff checker', 'text diff', 'compare text online', 'text comparison tool', 'diff tool online', 'find text differences', 'text diff online free', 'ishu tools diff', 'compare two texts', 'side by side diff', 'text difference finder', 'diff checker free'],
    h1: 'Text Diff Checker — Compare Texts Online Free',
    faq: [
      { question: 'How to compare two texts?', answer: 'Paste Text 1 and Text 2 into ISHU TOOLS Text Diff Checker. It instantly highlights all differences, additions (green), and deletions (red) between the two texts.' },
    ],
  },
  'sql-formatter': {
    title: 'SQL Formatter Online Free — Beautify SQL Queries | ISHU TOOLS',
    description: 'Format and beautify SQL queries online for free. Pretty print complex SQL with proper indentation. Supports MySQL, PostgreSQL, SQLite, MSSQL. No signup required.',
    keywords: ['sql formatter', 'sql beautifier', 'format sql online', 'sql pretty print', 'sql formatter free', 'ishu tools sql', 'sql indentation', 'sql formatter online', 'sql query formatter', 'beautify sql query', 'sql code formatter'],
    h1: 'SQL Formatter — Beautify SQL Queries Free Online',
    faq: [],
  },
  'markdown-to-html': {
    title: 'Markdown to HTML Converter Online Free | ISHU TOOLS',
    description: 'Convert Markdown to HTML online for free. Preview rendered Markdown, copy HTML output. Supports headers, lists, code blocks, tables. Best free Markdown converter.',
    keywords: ['markdown to html', 'md to html', 'convert markdown to html', 'markdown converter', 'markdown html online', 'ishu tools markdown', 'markdown to html free', 'markdown parser online', 'md to html converter'],
    h1: 'Markdown to HTML Converter — Free Online',
    faq: [],
  },
  'cron-expression-parser': {
    title: 'Cron Expression Parser Online Free — Cron Scheduler | ISHU TOOLS',
    description: 'Parse and understand cron expressions online for free. Get human-readable descriptions of cron schedules. Test next execution times. Essential for DevOps and backend developers.',
    keywords: ['cron expression parser', 'cron parser', 'cron expression', 'cron job parser', 'cron schedule parser', 'cron expression tester', 'cron expression online', 'ishu tools cron', 'cron job scheduler', 'parse cron expression'],
    h1: 'Cron Expression Parser — Decode Cron Schedules Free',
    faq: [
      { question: 'What is a cron expression?', answer: 'A cron expression is a string with 5 or 6 fields (minute, hour, day, month, weekday) that defines when a scheduled task should run. For example, "0 9 * * 1-5" means every weekday at 9 AM.' },
    ],
  },
  'json-to-yaml': {
    title: 'JSON to YAML Converter Online Free | ISHU TOOLS',
    description: 'Convert JSON to YAML format online for free. Instantly transform JSON configuration files to YAML. Used in Kubernetes, Docker Compose, CI/CD pipelines.',
    keywords: ['json to yaml', 'convert json to yaml', 'json yaml converter', 'json to yaml online', 'json to yaml free', 'ishu tools json to yaml', 'yaml from json', 'json yaml transform'],
    h1: 'JSON to YAML Converter — Free Online',
    faq: [],
  },
  'yaml-to-json': {
    title: 'YAML to JSON Converter Online Free | ISHU TOOLS',
    description: 'Convert YAML to JSON format online for free. Transform YAML config files to JSON instantly. Supports all YAML features including anchors and references.',
    keywords: ['yaml to json', 'convert yaml to json', 'yaml json converter', 'yaml to json online free', 'ishu tools yaml to json', 'yaml converter'],
    h1: 'YAML to JSON Converter — Free Online',
    faq: [],
  },
  'minify-css': {
    title: 'CSS Minifier Online Free — Minify CSS Files | ISHU TOOLS',
    description: 'Minify and compress CSS code online for free. Remove whitespace, comments, and reduce CSS file size for faster websites. No signup required.',
    keywords: ['css minifier', 'minify css', 'css compressor', 'compress css online', 'css minify free', 'ishu tools css minifier', 'css uglify', 'reduce css size', 'css minimize', 'online css minifier'],
    h1: 'CSS Minifier — Compress CSS Free Online',
    faq: [],
  },
  'minify-js': {
    title: 'JavaScript Minifier Online Free — Minify JS Code | ISHU TOOLS',
    description: 'Minify JavaScript code online for free. Compress JS files by removing whitespace and comments. Reduce JS bundle size for faster page loads.',
    keywords: ['js minifier', 'javascript minifier', 'minify javascript', 'js compressor', 'compress javascript', 'minify js online', 'ishu tools js minifier', 'js uglify', 'javascript compress', 'online js minifier'],
    h1: 'JavaScript Minifier — Compress JS Free Online',
    faq: [],
  },
  'minify-html': {
    title: 'HTML Minifier Online Free — Minify HTML Code | ISHU TOOLS',
    description: 'Minify HTML code online for free. Remove unnecessary whitespace, comments to reduce HTML file size. Speed up your website.',
    keywords: ['html minifier', 'minify html', 'html compressor', 'compress html online', 'html minify free', 'ishu tools html minifier', 'html compress', 'online html minifier'],
    h1: 'HTML Minifier — Compress HTML Free Online',
    faq: [],
  },
  'meta-tag-generator': {
    title: 'Meta Tag Generator Online Free — SEO Meta Tags | ISHU TOOLS',
    description: 'Generate SEO-optimized meta tags for your website online for free. Create title tags, description, robots, and Open Graph meta tags. Improve Google ranking instantly.',
    keywords: ['meta tag generator', 'seo meta tags', 'generate meta tags', 'meta tag creator', 'meta description generator', 'html meta tags', 'meta tags for seo', 'ishu tools meta tag', 'website meta tags', 'og meta tag generator', 'meta tag builder', 'seo tag generator'],
    h1: 'Meta Tag Generator — Create SEO Meta Tags Free',
    faq: [
      { question: 'What are meta tags?', answer: 'Meta tags are HTML elements that provide metadata about your webpage to search engines and social media platforms. They include the page title, description, keywords, and Open Graph data for social sharing.' },
    ],
  },
  'keyword-density': {
    title: 'Keyword Density Analyzer Online Free — SEO Tool | ISHU TOOLS',
    description: 'Analyze keyword density in your content online for free. Find keyword frequency, density percentage, and overused words. Optimize content for SEO.',
    keywords: ['keyword density', 'keyword density analyzer', 'keyword density checker', 'keyword frequency counter', 'seo keyword density', 'ishu tools keyword density', 'keyword density tool', 'keyword analysis tool', 'content keyword checker'],
    h1: 'Keyword Density Analyzer — SEO Tool Free',
    faq: [],
  },
  'readability-score': {
    title: 'Readability Score Checker Online Free | ISHU TOOLS',
    description: 'Check readability score (Flesch-Kincaid, Gunning Fog) of your text online for free. Improve writing clarity for SEO, essays, and professional documents.',
    keywords: ['readability score', 'readability checker', 'flesch reading ease', 'gunning fog index', 'text readability', 'readability analysis', 'ishu tools readability', 'content readability score', 'writing readability checker'],
    h1: 'Readability Score Checker — Free Online',
    faq: [],
  },
  'open-graph-generator': {
    title: 'Open Graph Meta Tag Generator Free — OG Tags | ISHU TOOLS',
    description: 'Generate Open Graph (OG) meta tags for Facebook, Twitter, LinkedIn previews online for free. Improve social media sharing appearance for your website.',
    keywords: ['open graph generator', 'og meta tags', 'open graph tags', 'facebook meta tags', 'twitter card generator', 'og tag generator', 'social media meta tags', 'ishu tools og generator'],
    h1: 'Open Graph Tag Generator — Social Media Meta Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  COLOR TOOLS — Handcrafted SEO
  // ════════════════════════════════════════════════
  'rgb-to-hex': {
    title: 'RGB to HEX Color Converter Online Free | ISHU TOOLS',
    description: 'Convert RGB color values to HEX color code online for free. Instant RGB to hexadecimal conversion with color preview. Essential for web designers and developers.',
    keywords: ['rgb to hex', 'rgb to hex converter', 'rgb to hex color', 'convert rgb to hex', 'rgb to hex online', 'rgb to hexadecimal', 'rgb to hex free', 'ishu tools rgb to hex', 'color converter rgb hex', 'rgb hex tool', 'rgb to hex code'],
    h1: 'RGB to HEX Color Converter — Free Online',
    faq: [
      { question: 'How to convert RGB to HEX?', answer: 'Enter the Red (0-255), Green (0-255), Blue (0-255) values and ISHU TOOLS instantly converts them to the corresponding HEX code (e.g., RGB(255,0,0) = #FF0000 for red).' },
    ],
  },
  'hex-to-rgb': {
    title: 'HEX to RGB Color Converter Online Free | ISHU TOOLS',
    description: 'Convert HEX color codes to RGB values online for free. Supports short (#FFF) and full (#FFFFFF) HEX codes. Instant conversion with live color preview.',
    keywords: ['hex to rgb', 'hex to rgb converter', 'hex to rgb color', 'convert hex to rgb', 'hex to rgb online', 'hexadecimal to rgb', 'hex to rgb free', 'ishu tools hex to rgb', 'color code converter', 'hex to rgba converter', 'html color converter'],
    h1: 'HEX to RGB Color Converter — Free Online',
    faq: [],
  },
  'rgb-to-hsl': {
    title: 'RGB to HSL Color Converter Online Free | ISHU TOOLS',
    description: 'Convert RGB color values to HSL (Hue, Saturation, Lightness) online for free. Perfect for CSS animations and modern web design.',
    keywords: ['rgb to hsl', 'rgb to hsl converter', 'color converter', 'rgb to hsl online', 'ishu tools rgb to hsl', 'hsl color converter', 'rgb hsl conversion'],
    h1: 'RGB to HSL Converter — Free Online',
    faq: [],
  },
  'color-palette-generator': {
    title: 'Color Palette Generator Online Free — Create Color Schemes | ISHU TOOLS',
    description: 'Generate beautiful color palettes online for free. Create complementary, analogous, triadic color schemes from any base color. Perfect for designers and branding.',
    keywords: ['color palette generator', 'color scheme generator', 'color palette creator', 'generate color palette', 'color palette free', 'ishu tools color palette', 'website color palette', 'color combination generator', 'complementary colors', 'color palette tool', 'brand color generator', 'color scheme maker'],
    h1: 'Color Palette Generator — Create Color Schemes Free',
    faq: [
      { question: 'How to create a color palette?', answer: 'Enter a base color in ISHU TOOLS Color Palette Generator and it automatically generates complementary, analogous, and triadic color combinations — perfect for UI design, branding, and web development.' },
    ],
  },
  'gradient-generator': {
    title: 'CSS Gradient Generator Online Free — Linear & Radial | ISHU TOOLS',
    description: 'Generate CSS gradient code online for free. Create linear, radial, and conic gradients with live preview. Copy CSS code instantly. Best free gradient tool for web designers.',
    keywords: ['gradient generator', 'css gradient generator', 'linear gradient', 'gradient css code', 'gradient maker', 'gradient tool online', 'gradient generator free', 'ishu tools gradient', 'css gradient tool', 'color gradient generator', 'gradient background generator', 'css background gradient'],
    h1: 'CSS Gradient Generator — Linear & Radial Gradients Free',
    faq: [],
  },
  'color-contrast-checker': {
    title: 'Color Contrast Checker Online Free — WCAG Accessibility | ISHU TOOLS',
    description: 'Check color contrast ratio for accessibility compliance online for free. Verify WCAG AA and AAA standards. Ensure your website text is readable for all users.',
    keywords: ['color contrast checker', 'wcag contrast', 'accessibility contrast', 'contrast ratio checker', 'color contrast tool', 'ishu tools contrast checker', 'wcag color contrast', 'text readability contrast', 'contrast accessibility tool', 'contrast checker free'],
    h1: 'Color Contrast Checker — WCAG Accessibility Free',
    faq: [
      { question: 'What is WCAG contrast ratio?', answer: 'WCAG (Web Content Accessibility Guidelines) requires a minimum contrast ratio of 4.5:1 for normal text (AA) and 7:1 for enhanced accessibility (AAA). ISHU TOOLS checks your colors against both standards.' },
    ],
  },
  'random-color-generator': {
    title: 'Random Color Generator Online Free | ISHU TOOLS',
    description: 'Generate random colors online for free. Get random HEX, RGB, and HSL color values instantly. Perfect for design inspiration and creative projects.',
    keywords: ['random color generator', 'random color', 'random color picker', 'generate random color', 'random color free', 'ishu tools random color', 'random hex color', 'color randomizer'],
    h1: 'Random Color Generator — Free Online',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  SECURITY / HASH TOOLS — Handcrafted SEO
  // ════════════════════════════════════════════════
  'password-strength-checker': {
    title: 'Password Strength Checker Online Free | ISHU TOOLS',
    description: 'Check how strong your password is online for free. Instantly analyze password strength, estimate crack time, and get improvement tips. No signup, client-side processing.',
    keywords: ['password strength checker', 'password strength tester', 'check password strength', 'password strength meter', 'how strong is my password', 'password security checker', 'ishu tools password checker', 'password analyzer', 'strong password test', 'password strength score'],
    h1: 'Password Strength Checker — Test Your Password Free',
    faq: [
      { question: 'What makes a password strong?', answer: 'A strong password has at least 12 characters, a mix of uppercase/lowercase letters, numbers, and special characters. Avoid dictionary words, names, and predictable patterns.' },
    ],
  },
  'hash-generator': {
    title: 'Multi-Hash Generator Online Free — MD5, SHA256, SHA512 | ISHU TOOLS',
    description: 'Generate multiple hash types (MD5, SHA-1, SHA-256, SHA-512) from any text online for free. Compare hash outputs instantly. Essential cryptography tool.',
    keywords: ['hash generator', 'multi hash generator', 'md5 sha256 sha512', 'hash tool online', 'hash generator free', 'ishu tools hash generator', 'text hash generator', 'cryptographic hash', 'checksum generator', 'hash calculator'],
    h1: 'Multi-Hash Generator — MD5, SHA256, SHA512 Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  SOCIAL MEDIA TOOLS — Handcrafted SEO
  // ════════════════════════════════════════════════
  'instagram-post-resizer': {
    title: 'Instagram Post Resizer Online Free — Perfect Instagram Size | ISHU TOOLS',
    description: 'Resize images to perfect Instagram size online for free. Square (1080x1080), portrait (1080x1350), landscape (1080x566). No signup, no watermark.',
    keywords: ['instagram post resizer', 'instagram image size', 'resize image for instagram', 'instagram image resizer', 'instagram photo size', 'instagram size online free', 'ishu tools instagram resizer', 'instagram post size', '1080x1080 image', 'instagram square image'],
    h1: 'Instagram Post Resizer — Perfect Size Free Online',
    faq: [
      { question: 'What is the ideal Instagram image size?', answer: 'Instagram recommends 1080x1080 px for square posts, 1080x1350 px for portrait (4:5), and 1080x566 px for landscape. ISHU TOOLS automatically resizes to these exact dimensions.' },
    ],
  },
  'youtube-thumbnail-maker': {
    title: 'YouTube Thumbnail Maker Online Free | ISHU TOOLS',
    description: 'Create and resize YouTube thumbnails online for free. Perfect 1280x720 HD thumbnail size. No signup, no watermark. Best YouTube thumbnail tool.',
    keywords: ['youtube thumbnail maker', 'youtube thumbnail', 'create youtube thumbnail', 'youtube thumbnail size', 'youtube thumbnail resizer', 'yt thumbnail maker', 'youtube thumbnail online', 'ishu tools youtube thumbnail', 'youtube thumbnail free', '1280x720 thumbnail', 'youtube thumbnail creator'],
    h1: 'YouTube Thumbnail Maker — Create HD Thumbnails Free',
    faq: [],
  },
  'twitter-header-maker': {
    title: 'Twitter Header Maker Online Free — X Banner Creator | ISHU TOOLS',
    description: 'Create and resize Twitter/X header banners online for free. Perfect 1500x500 px Twitter cover photo. No signup required.',
    keywords: ['twitter header maker', 'twitter banner', 'twitter header size', 'x header maker', 'twitter cover maker', 'twitter profile banner', 'ishu tools twitter header', 'twitter banner free'],
    h1: 'Twitter/X Header Maker — Free Online',
    faq: [],
  },
  'facebook-cover-maker': {
    title: 'Facebook Cover Maker Online Free | ISHU TOOLS',
    description: 'Create and resize Facebook cover photos online for free. Perfect 820x312 px Facebook cover dimensions. No signup required.',
    keywords: ['facebook cover maker', 'facebook banner', 'facebook cover size', 'facebook cover photo', 'fb cover maker', 'ishu tools facebook cover', 'facebook cover free', 'facebook timeline cover'],
    h1: 'Facebook Cover Maker — Free Online',
    faq: [],
  },
  'linkedin-banner-maker': {
    title: 'LinkedIn Banner Maker Online Free — Profile Background | ISHU TOOLS',
    description: 'Create perfect LinkedIn profile banner online for free. Ideal 1584x396 px LinkedIn cover. Professional background for your profile.',
    keywords: ['linkedin banner maker', 'linkedin background', 'linkedin cover photo', 'linkedin banner size', 'linkedin profile banner', 'ishu tools linkedin banner', 'linkedin cover free'],
    h1: 'LinkedIn Banner Maker — Free Online',
    faq: [],
  },
  'whatsapp-dp-maker': {
    title: 'WhatsApp DP Maker Online Free — Perfect Profile Photo | ISHU TOOLS',
    description: 'Create and resize WhatsApp profile photo (DP) online for free. Perfect 640x640 px circular crop. Best WhatsApp DP maker — no signup, no watermark.',
    keywords: ['whatsapp dp maker', 'whatsapp profile picture', 'whatsapp dp resize', 'whatsapp dp photo maker', 'whatsapp dp size', 'resize photo for whatsapp', 'ishu tools whatsapp dp', 'whatsapp dp creator', 'whatsapp profile photo size'],
    h1: 'WhatsApp DP Maker — Free Profile Photo Online',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  KB/SIZE COMPRESSION — Super High Value for India
  // ════════════════════════════════════════════════
  'compress-to-5kb': {
    title: 'Compress Image to 5KB Online Free | ISHU TOOLS',
    description: 'Compress any image to 5KB online for free. Required for many Indian government application forms. Supports JPG, PNG, WEBP. No signup, instant result.',
    keywords: ['compress image to 5kb', 'reduce image to 5kb', 'image to 5kb', '5kb image compressor', 'compress photo to 5kb', 'resize image to 5kb', 'ishu tools compress 5kb', 'compress image size 5kb free', 'photo compress 5kb online', 'image compressor 5kb'],
    h1: 'Compress Image to 5KB — Free Online',
    faq: [
      { question: 'Why do I need to compress an image to exactly 5KB?', answer: 'Many Indian government forms (UPSC, SSC, railway, bank exams) require photos under 5KB. ISHU TOOLS helps you reduce your image to exactly under 5KB while maintaining acceptable visual quality.' },
    ],
  },
  'compress-to-10kb': {
    title: 'Compress Image to 10KB Online Free | ISHU TOOLS',
    description: 'Compress image file to 10KB online for free. Required for SSC CGL, CHSL, bank PO, and Indian government application forms. Fast, free, no signup.',
    keywords: ['compress image to 10kb', 'reduce image to 10kb', '10kb image', 'photo compress 10kb', 'image to 10kb', 'ishu tools 10kb', 'compress photo 10kb', 'image size 10kb online', 'SSC photo 10kb', 'bank form 10kb photo'],
    h1: 'Compress Image to 10KB — Free Online',
    faq: [
      { question: 'How to compress a photo to 10KB for SSC?', answer: 'Upload your photo to ISHU TOOLS, set the target as 10KB, and click "Run". The tool automatically reduces the file size to under 10KB without distorting the image.' },
    ],
  },
  'compress-to-20kb': {
    title: 'Compress Image to 20KB Online Free | ISHU TOOLS',
    description: 'Compress image to 20KB online for free. Required for UPSC, NDA, railway, and other government exams. Instant compression with quality preservation.',
    keywords: ['compress image to 20kb', 'reduce image 20kb', '20kb image compressor', 'photo 20kb online', 'ishu tools 20kb', 'compress photo to 20kb', 'image to 20kb free', 'UPSC photo 20kb'],
    h1: 'Compress Image to 20KB — Free Online',
    faq: [],
  },
  'compress-to-50kb': {
    title: 'Compress Image to 50KB Online Free | ISHU TOOLS',
    description: 'Compress image to under 50KB online for free. Most common requirement for government forms, college applications, and job portals. Fast, accurate, no signup.',
    keywords: ['compress image to 50kb', 'reduce image 50kb', '50kb image', 'photo compress 50kb', 'compress to 50kb online', 'ishu tools 50kb', 'image 50kb free', 'compress jpg to 50kb', 'compress png to 50kb'],
    h1: 'Compress Image to 50KB — Free Online',
    faq: [],
  },
  'compress-to-100kb': {
    title: 'Compress Image to 100KB Online Free | ISHU TOOLS',
    description: 'Reduce image size to 100KB online for free. Required for Aadhaar portal, IRCTC, EPFO, and many government websites. Supports all image formats.',
    keywords: ['compress image to 100kb', 'reduce image 100kb', '100kb image compressor', 'compress photo to 100kb', 'ishu tools 100kb', 'image to 100kb online free', 'compress jpg to 100kb', 'compress png to 100kb', 'aadhaar photo 100kb', 'epfo photo 100kb'],
    h1: 'Compress Image to 100KB — Free Online',
    faq: [],
  },
  'compress-to-200kb': {
    title: 'Compress Image to 200KB Online Free | ISHU TOOLS',
    description: 'Compress image to 200KB online for free. Suitable for university admissions, online application portals, and document submissions. No signup required.',
    keywords: ['compress image to 200kb', 'reduce image 200kb', '200kb image compressor', 'compress to 200kb online', 'ishu tools 200kb', 'photo to 200kb free'],
    h1: 'Compress Image to 200KB — Free Online',
    faq: [],
  },
  'compress-to-500kb': {
    title: 'Compress Image to 500KB Online Free | ISHU TOOLS',
    description: 'Compress image to 500KB online for free. Perfect for email attachments, portal submissions, and online forms. Fast processing, no signup required.',
    keywords: ['compress image to 500kb', 'reduce image 500kb', '500kb image compressor', 'compress photo 500kb', 'ishu tools 500kb', 'image to 500kb free'],
    h1: 'Compress Image to 500KB — Free Online',
    faq: [],
  },
  'compress-to-1mb': {
    title: 'Compress Image to 1MB Online Free | ISHU TOOLS',
    description: 'Compress image to 1MB (1000KB) online for free. Reduce large photos to 1MB for upload limits. No signup, instant compression.',
    keywords: ['compress image to 1mb', 'reduce image to 1mb', '1mb image compressor', 'compress photo 1mb', 'ishu tools 1mb compressor', 'image to 1mb free', 'compress image 1 mb'],
    h1: 'Compress Image to 1MB — Free Online',
    faq: [],
  },
  'compress-to-2mb': {
    title: 'Compress Image to 2MB Online Free | ISHU TOOLS',
    description: 'Compress image to 2MB online for free. Perfect for passport applications, official documents, and high-res photo submissions.',
    keywords: ['compress image to 2mb', 'reduce image 2mb', '2mb image compressor', 'compress photo 2mb', 'ishu tools 2mb', 'image to 2mb free'],
    h1: 'Compress Image to 2MB — Free Online',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  INDIAN GOVERNMENT / EXAM PHOTO TOOLS
  // ════════════════════════════════════════════════
  'ssc-photo-resizer': {
    title: 'SSC Photo Resizer Online Free — SSC CGL CHSL Photo Size | ISHU TOOLS',
    description: 'Resize photos for SSC CGL, SSC CHSL, and SSC exams online for free. Required photo dimensions: 3.5cm x 4.5cm, under 20KB. Instant resize with quality preservation.',
    keywords: ['ssc photo resizer', 'ssc photo size', 'ssc cgl photo', 'ssc chsl photo', 'ssc exam photo resize', 'resize photo for ssc', 'ssc application photo', 'ishu tools ssc photo', 'ssc photo requirement', 'ssc photo 20kb', '3.5cm 4.5cm photo', 'ssc staff selection commission photo'],
    h1: 'SSC Photo Resizer — SSC CGL/CHSL Photo Free',
    faq: [
      { question: 'What is SSC photo size requirement?', answer: 'SSC requires photos of 3.5cm x 4.5cm at 100 DPI with file size under 20KB in JPG format. ISHU TOOLS SSC Photo Resizer automatically sets these exact dimensions.' },
    ],
  },
  'resize-for-pan-card': {
    title: 'PAN Card Photo Resize Online Free | ISHU TOOLS',
    description: 'Resize photo for PAN Card application online for free. Required dimensions: 3.5cm x 2.5cm, under 20KB. Instant resize for NSDL and UTI PAN portals.',
    keywords: ['pan card photo resize', 'pan card photo size', 'pan card photo', 'resize photo for pan card', 'pan card photo requirement', 'ishu tools pan card photo', 'pan card application photo', 'nsdl pan photo resize', 'uti pan photo size', 'pan card photo online free'],
    h1: 'PAN Card Photo Resize — Free Online',
    faq: [
      { question: 'What is the PAN Card photo size requirement?', answer: 'PAN Card requires a 3.5cm x 2.5cm photo, maximum 20KB in JPG format. The background should be white and the face should be clearly visible.' },
    ],
  },
  'resize-image-for-upsc': {
    title: 'UPSC Photo Resize Online Free — UPSC Civil Services Photo | ISHU TOOLS',
    description: 'Resize photo for UPSC CSE and other UPSC exams online for free. Photo size under 300KB, 35mm x 45mm. Required for UPSC online application form.',
    keywords: ['upsc photo resize', 'upsc photo size', 'upsc cse photo', 'resize photo for upsc', 'upsc application photo', 'ishu tools upsc photo', 'upsc photo requirement', 'upsc civil services photo size', 'ias photo resize', 'upsc ias photo'],
    h1: 'UPSC Photo Resize — Civil Services Exam Photo Free',
    faq: [
      { question: 'What is UPSC photo size requirement?', answer: 'UPSC requires photo: 35mm x 45mm, 200-300 DPI, maximum size 300KB in JPG format. Light background is required. ISHU TOOLS automatically resizes to these specifications.' },
    ],
  },
  'passport-size-photo': {
    title: 'Passport Size Photo Maker Online Free — 35mm x 45mm | ISHU TOOLS',
    description: 'Create passport size photo online for free. Standard 35mm x 45mm photo for Indian passport, VISA, and ID applications. No signup, professional quality.',
    keywords: ['passport size photo', 'passport photo maker', 'passport photo online free', 'passport size photo maker', '35mm 45mm photo', 'create passport photo', 'ishu tools passport photo', 'passport photo india', 'visa photo maker', 'id photo size', 'passport photo size india', 'photo resize passport'],
    h1: 'Passport Size Photo Maker — 35mm × 45mm Free Online',
    faq: [
      { question: 'What is the standard passport photo size in India?', answer: 'Indian passport requires a 35mm x 45mm photo with white background. The face should be clearly visible, centered, and occupy 70-80% of the frame. Photo must be within 6 months old.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  UNIT CONVERSION TOOLS — Handcrafted SEO
  // ════════════════════════════════════════════════
  'number-base-converter': {
    title: 'Number Base Converter Online Free — Binary Octal Hex Decimal | ISHU TOOLS',
    description: 'Convert numbers between binary, octal, decimal, and hexadecimal bases online for free. Instant conversion with step-by-step explanation. Best for CS students.',
    keywords: ['number base converter', 'binary to decimal', 'decimal to binary', 'hex to decimal', 'octal to decimal', 'number system converter', 'base converter online', 'ishu tools base converter', 'binary octal hexadecimal', 'number conversion', 'convert number base free'],
    h1: 'Number Base Converter — Binary, Octal, Hex, Decimal Free',
    faq: [
      { question: 'How to convert binary to decimal?', answer: 'Enter the binary number in ISHU TOOLS Number Base Converter. It instantly shows the decimal, hexadecimal, and octal equivalents with a step-by-step conversion explanation.' },
    ],
  },
  'data-size-converter': {
    title: 'Data Size Converter Online Free — KB MB GB TB | ISHU TOOLS',
    description: 'Convert between data storage units online for free. KB to MB, MB to GB, GB to TB, bits to bytes. Accurate digital storage conversion tool.',
    keywords: ['data size converter', 'kb to mb converter', 'mb to gb', 'gb to tb', 'byte converter', 'data storage converter', 'digital storage converter', 'ishu tools data size', 'file size converter', 'convert kb mb gb'],
    h1: 'Data Size Converter — KB MB GB TB Free',
    faq: [],
  },
  'speed-converter': {
    title: 'Speed Converter Online Free — km/h mph m/s Converter | ISHU TOOLS',
    description: 'Convert speed units online for free. km/h to mph, mph to km/h, m/s, knots. Accurate speed conversion for physics, travel, and sports.',
    keywords: ['speed converter', 'kmh to mph', 'mph to kmh', 'speed unit converter', 'velocity converter', 'km per hour to miles per hour', 'ishu tools speed converter', 'speed conversion free'],
    h1: 'Speed Converter — km/h mph m/s Free Online',
    faq: [],
  },
  'area-converter': {
    title: 'Area Converter Online Free — sq ft sq m acre hectare | ISHU TOOLS',
    description: 'Convert area units online for free. Square feet to square meters, acres to hectares, and more. Accurate area conversion for real estate and engineering.',
    keywords: ['area converter', 'sq ft to sq m', 'square feet to square meters', 'acre to hectare', 'area unit converter', 'ishu tools area converter', 'land area converter', 'area conversion free'],
    h1: 'Area Converter — sq ft, sq m, acre, hectare Free',
    faq: [],
  },
  'volume-converter': {
    title: 'Volume Converter Online Free — liters ml gallons | ISHU TOOLS',
    description: 'Convert volume units online for free. Liters to gallons, ml to cups, cubic meters to cubic feet. Accurate liquid and volume conversion tool.',
    keywords: ['volume converter', 'liter to gallon', 'ml to cups', 'volume unit converter', 'liquid converter', 'ishu tools volume converter', 'volume conversion free'],
    h1: 'Volume Converter — Liters, Gallons, ml Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  TEXT TOOLS — Handcrafted SEO
  // ════════════════════════════════════════════════
  'character-counter': {
    title: 'Character Counter Online Free — Count Characters in Text | ISHU TOOLS',
    description: 'Count characters, words, sentences, and paragraphs in your text online for free. Twitter, Instagram, SEO character limits. Real-time counting with no signup.',
    keywords: ['character counter', 'character count', 'count characters', 'letter counter', 'text character counter', 'character counter online free', 'ishu tools character counter', 'word character counter', 'twitter character count', 'character limit checker', 'text length counter'],
    h1: 'Character Counter — Count Characters Free Online',
    faq: [
      { question: 'What is the Twitter character limit?', answer: 'Twitter allows 280 characters per tweet. ISHU TOOLS Character Counter shows you real-time character count so you can stay within limits for Twitter, Instagram captions, meta descriptions, and more.' },
    ],
  },
  'word-count-text': {
    title: 'Word Counter Online Free — Count Words in Text | ISHU TOOLS',
    description: 'Count words, characters, sentences, and paragraphs in your text online for free. Estimate reading time. Perfect for essays, articles, and assignments.',
    keywords: ['word counter', 'word count', 'count words online', 'word counter free', 'word count tool', 'ishu tools word counter', 'words in text', 'word counter online', 'essay word count', 'word count checker', 'word frequency counter'],
    h1: 'Word Counter — Count Words Online Free',
    faq: [],
  },
  'case-converter-text': {
    title: 'Text Case Converter Online Free — Upper Lower Title Case | ISHU TOOLS',
    description: 'Convert text to uppercase, lowercase, title case, sentence case, and camelCase online for free. Instant text transformation. No signup required.',
    keywords: ['text case converter', 'case converter', 'uppercase to lowercase', 'text to uppercase', 'text to lowercase', 'title case converter', 'sentence case', 'camelcase converter', 'ishu tools case converter', 'change text case online', 'text case changer free'],
    h1: 'Text Case Converter — Upper, Lower, Title Case Free',
    faq: [
      { question: 'How to convert text to title case?', answer: 'Paste your text into ISHU TOOLS Case Converter and select "Title Case". Every first letter of each word will be capitalized automatically — perfect for headings, titles, and names.' },
    ],
  },
  'slug-generator-text': {
    title: 'Slug Generator Online Free — URL Slug from Text | ISHU TOOLS',
    description: 'Generate SEO-friendly URL slugs from any text online for free. Convert headings and titles to clean, lowercase, hyphenated URLs. Essential for bloggers and developers.',
    keywords: ['slug generator', 'url slug', 'slug from title', 'seo url generator', 'url slug generator', 'slug maker', 'text to slug', 'ishu tools slug generator', 'permalink generator', 'clean url generator'],
    h1: 'Slug Generator — Create SEO URL Slugs Free',
    faq: [],
  },
  'extract-keywords-text': {
    title: 'Keyword Extractor from Text Online Free | ISHU TOOLS',
    description: 'Extract keywords and key phrases from any text online for free. Identify the most important words and phrases. Useful for SEO, content analysis, and research.',
    keywords: ['keyword extractor', 'extract keywords from text', 'keyword extraction', 'text keyword finder', 'keyword extractor free', 'ishu tools keyword extractor', 'key phrase extractor', 'important words finder'],
    h1: 'Keyword Extractor — Extract Keywords from Text Free',
    faq: [],
  },
  'text-to-binary': {
    title: 'Text to Binary Converter Online Free | ISHU TOOLS',
    description: 'Convert text to binary code online for free. Translate ASCII text to binary representation. Perfect for computer science students and coders.',
    keywords: ['text to binary', 'text to binary converter', 'convert text to binary', 'ascii to binary', 'text binary online', 'text to binary free', 'ishu tools text to binary', 'string to binary'],
    h1: 'Text to Binary Converter — Free Online',
    faq: [],
  },
  'binary-to-text': {
    title: 'Binary to Text Converter Online Free | ISHU TOOLS',
    description: 'Convert binary code back to readable text online for free. Decode binary to ASCII text instantly. Essential CS tool for students and developers.',
    keywords: ['binary to text', 'binary to text converter', 'convert binary to text', 'binary decoder', 'binary to ascii', 'binary to text free', 'ishu tools binary to text'],
    h1: 'Binary to Text Converter — Free Online',
    faq: [],
  },
  'morse-code': {
    title: 'Morse Code Converter Online Free — Text to Morse | ISHU TOOLS',
    description: 'Convert text to Morse code and Morse code to text online for free. With audio playback. Learn Morse code with ISHU TOOLS.',
    keywords: ['morse code converter', 'text to morse code', 'morse code translator', 'morse code decoder', 'morse code online', 'morse code free', 'ishu tools morse code', 'morse code encoder', 'morse code generator'],
    h1: 'Morse Code Converter — Text to Morse Free Online',
    faq: [],
  },
  'text-reverse': {
    title: 'Reverse Text Generator Online Free | ISHU TOOLS',
    description: 'Reverse any text, sentence, or word online for free. Mirror text, reverse words, reverse sentences. Fun text tool with instant results.',
    keywords: ['reverse text', 'text reverser', 'reverse words', 'backwards text generator', 'mirror text', 'reverse string online', 'ishu tools reverse text', 'text backwards free'],
    h1: 'Reverse Text Generator — Free Online',
    faq: [],
  },
  'number-to-words': {
    title: 'Number to Words Converter Online Free — Indian Numbering | ISHU TOOLS',
    description: 'Convert numbers to words online for free. Supports Indian numbering system (lakh, crore) and international system. Essential for bank cheques, legal documents, and students.',
    keywords: ['number to words', 'number to words converter', 'convert numbers to words', 'number spelling', 'number in words', 'indian number to words', 'number to words in hindi', 'ishu tools number to words', 'cheque amount in words', 'rupees in words', 'number to words india', 'lakh crore number'],
    h1: 'Number to Words Converter — Indian & International Free',
    faq: [
      { question: 'How to write numbers in words for a cheque?', answer: 'Enter the amount in ISHU TOOLS Number to Words Converter. It gives you the exact wording in Indian format (lakh, crore) and international format (million, billion) — perfect for cheques, invoices, and legal documents.' },
    ],
  },
  'roman-numeral-converter': {
    title: 'Roman Numeral Converter Online Free | ISHU TOOLS',
    description: 'Convert numbers to Roman numerals and Roman numerals to numbers online for free. Supports 1 to 3999. Instant bidirectional conversion.',
    keywords: ['roman numeral converter', 'number to roman', 'roman to number', 'roman numerals', 'roman numeral calculator', 'convert to roman numerals', 'ishu tools roman numerals', 'roman number converter free'],
    h1: 'Roman Numeral Converter — Free Online',
    faq: [],
  },
  'reading-time-text': {
    title: 'Reading Time Calculator Online Free — Estimate Read Time | ISHU TOOLS',
    description: 'Calculate reading time of any text online for free. Estimated reading time based on average 200-250 words per minute reading speed. For blog posts, articles, essays.',
    keywords: ['reading time calculator', 'estimate reading time', 'text reading time', 'word reading speed', 'reading time estimator', 'ishu tools reading time', 'blog reading time', 'article reading time calculator'],
    h1: 'Reading Time Calculator — Estimate Read Time Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  STUDENT TOOLS — Handcrafted SEO
  // ════════════════════════════════════════════════
  'grade-calculator': {
    title: 'Grade Calculator Online Free — Calculate Your Marks | ISHU TOOLS',
    description: 'Calculate your grade, percentage, and letter grade online for free. Add multiple subjects with weights. Perfect for students in India and worldwide.',
    keywords: ['grade calculator', 'marks calculator', 'grade percentage calculator', 'calculate grade online', 'letter grade calculator', 'weighted grade calculator', 'ishu tools grade calculator', 'exam marks calculator', 'student grade calculator'],
    h1: 'Grade Calculator — Calculate Your Marks Free',
    faq: [],
  },
  'attendance-calculator': {
    title: 'Attendance Calculator Online Free — College Attendance | ISHU TOOLS',
    description: 'Calculate your attendance percentage online for free. Know how many classes you can bunk without falling below 75%. Essential for college students in India.',
    keywords: ['attendance calculator', 'college attendance calculator', 'attendance percentage', 'how many classes to attend', 'attendance calculator india', 'ishu tools attendance calculator', 'bunk class calculator', '75 percent attendance', 'attendance tracking calculator'],
    h1: 'Attendance Calculator — Check College Attendance Free',
    faq: [
      { question: 'How many classes can I skip with 75% attendance?', answer: 'Enter your total classes and attended classes in ISHU TOOLS Attendance Calculator. It shows your current percentage and tells you exactly how many more classes you can safely miss to stay above 75%.' },
    ],
  },
  'citation-generator': {
    title: 'Citation Generator Online Free — APA MLA Chicago | ISHU TOOLS',
    description: 'Generate citations in APA, MLA, and Chicago styles online for free. Cite books, websites, articles, and journals automatically. Essential for students and researchers.',
    keywords: ['citation generator', 'apa citation generator', 'mla citation generator', 'bibliography generator', 'reference generator', 'citation maker free', 'ishu tools citation generator', 'automatic citation generator', 'citation format apa mla', 'research paper citation'],
    h1: 'Citation Generator — APA, MLA, Chicago Free Online',
    faq: [
      { question: 'How to generate an APA citation?', answer: 'Select APA format in ISHU TOOLS Citation Generator, enter the book/website details (author, title, year, URL), and get the properly formatted APA citation instantly.' },
    ],
  },
  'study-planner': {
    title: 'Study Planner Online Free — Plan Your Study Schedule | ISHU TOOLS',
    description: 'Create a personalized study plan online for free. Schedule subjects, set goals, and balance study time. Best free study planner for competitive exam students in India.',
    keywords: ['study planner', 'study schedule maker', 'study plan creator', 'study timetable', 'study plan online free', 'ishu tools study planner', 'study planner india', 'exam study planner', 'competitive exam planner', 'student study planner'],
    h1: 'Study Planner — Create Your Study Schedule Free',
    faq: [],
  },
  'flashcard-generator': {
    title: 'Flashcard Maker Online Free — Create Study Flashcards | ISHU TOOLS',
    description: 'Create digital flashcards online for free. Add questions and answers for effective memorization. Perfect for exam preparation, vocabulary, and learning.',
    keywords: ['flashcard maker', 'flashcard generator', 'create flashcards', 'digital flashcards', 'study flashcards', 'flashcard creator free', 'ishu tools flashcard', 'flashcard app online', 'exam flashcards', 'vocabulary flashcards'],
    h1: 'Flashcard Maker — Create Study Flashcards Free',
    faq: [],
  },
  'plagiarism-risk-checker': {
    title: 'Plagiarism Checker Online Free — Check Text Originality | ISHU TOOLS',
    description: 'Check if your text might be considered plagiarism online for free. Analyze for duplicate phrases, word combinations, and originality. Useful for students and writers.',
    keywords: ['plagiarism checker', 'plagiarism check online', 'free plagiarism checker', 'check plagiarism', 'plagiarism detector', 'duplicate content checker', 'ishu tools plagiarism', 'originality checker', 'text originality check', 'anti plagiarism tool'],
    h1: 'Plagiarism Checker — Check Text Originality Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  FINANCE TOOLS — Handcrafted SEO
  // ════════════════════════════════════════════════
  'gst-calculator': {
    title: 'GST Calculator Online Free India — Calculate GST Amount | ISHU TOOLS',
    description: 'Calculate GST (Goods & Services Tax) online for free. Add GST or remove GST from amount. Supports all GST rates: 5%, 12%, 18%, 28%. Best GST calculator India.',
    keywords: ['gst calculator', 'gst calculator india', 'calculate gst', 'gst amount calculator', 'gst online calculator', 'inclusive gst calculator', 'exclusive gst calculator', 'add gst to price', 'remove gst', 'ishu tools gst calculator', 'goods services tax calculator', 'gst rate calculator'],
    h1: 'GST Calculator India — Calculate GST Online Free',
    faq: [
      { question: 'How to calculate GST in India?', answer: 'To add 18% GST: Taxable Amount × 1.18. To find GST from total: Total × 18/118. ISHU TOOLS GST Calculator does this automatically for all GST slabs (5%, 12%, 18%, 28%).' },
    ],
  },
  'sip-calculator': {
    title: 'SIP Calculator Online Free India — SIP Return Calculator | ISHU TOOLS',
    description: 'Calculate SIP (Systematic Investment Plan) returns online for free. Find maturity amount, total investment, and wealth gain. Best SIP calculator for mutual fund investors in India.',
    keywords: ['sip calculator', 'sip return calculator', 'sip calculator india', 'mutual fund sip calculator', 'sip maturity calculator', 'systematic investment plan calculator', 'sip calculator free', 'ishu tools sip calculator', 'monthly sip calculator', 'sip investment calculator'],
    h1: 'SIP Calculator India — Calculate SIP Returns Free',
    faq: [
      { question: 'How to calculate SIP returns?', answer: 'Enter your monthly SIP amount, expected annual return (e.g., 12%), and investment period. ISHU TOOLS SIP Calculator shows total invested amount, estimated returns, and final corpus value.' },
    ],
  },
  'roi-calculator': {
    title: 'ROI Calculator Online Free — Return on Investment | ISHU TOOLS',
    description: 'Calculate Return on Investment (ROI) online for free. Calculate profit, loss percentage, and annualized ROI. Essential for business, investing, and financial planning.',
    keywords: ['roi calculator', 'return on investment calculator', 'roi calculation', 'investment return calculator', 'profit percentage calculator', 'roi formula calculator', 'ishu tools roi calculator', 'calculate roi free', 'investment roi calculator'],
    h1: 'ROI Calculator — Return on Investment Free Online',
    faq: [],
  },
  'income-tax-calculator': {
    title: 'Income Tax Calculator India 2024-25 Free Online | ISHU TOOLS',
    description: 'Calculate income tax for India FY 2024-25 online for free. New tax regime vs old tax regime comparison. Tax slabs, deductions, HRA exemption. Best India income tax calculator.',
    keywords: ['income tax calculator india', 'income tax calculator 2024-25', 'india tax calculator', 'new tax regime calculator', 'old tax regime calculator', 'income tax slab calculator', 'income tax calculation india', 'ishu tools income tax', 'income tax estimate india', 'fy 2024-25 tax calculator'],
    h1: 'Income Tax Calculator India 2024-25 — Free Online',
    faq: [
      { question: 'Which tax regime is better — new or old?', answer: 'The new tax regime has lower rates but fewer deductions. The old regime allows 80C, 80D, HRA, and other deductions. ISHU TOOLS Income Tax Calculator shows both, so you can pick the one that saves more tax.' },
    ],
  },
  'budget-planner': {
    title: 'Budget Planner Online Free — 50/30/20 Rule Calculator | ISHU TOOLS',
    description: 'Plan your monthly budget online for free using the 50/30/20 rule. Allocate income to needs, wants, and savings. Best budget planner for students and professionals in India.',
    keywords: ['budget planner', 'monthly budget planner', '50/30/20 rule', 'budget calculator', 'personal finance planner', 'budget planning tool', 'ishu tools budget planner', 'money budget planner free', 'savings budget calculator'],
    h1: 'Budget Planner — 50/30/20 Rule Free Online',
    faq: [],
  },
  'savings-goal-calculator': {
    title: 'Savings Goal Calculator Online Free — How Long to Save? | ISHU TOOLS',
    description: 'Calculate how long it takes to reach your savings goal online for free. Plan savings for college, house, car, travel. With and without interest options.',
    keywords: ['savings goal calculator', 'savings calculator', 'how long to save', 'savings target calculator', 'goal savings calculator', 'monthly savings calculator', 'ishu tools savings calculator', 'savings plan calculator free'],
    h1: 'Savings Goal Calculator — Plan Your Savings Free',
    faq: [],
  },
  'electricity-bill-calculator': {
    title: 'Electricity Bill Calculator Online Free India | ISHU TOOLS',
    description: 'Calculate your electricity bill online for free. Enter units consumed and tariff rate to get exact bill amount. Helpful for Indian households and businesses.',
    keywords: ['electricity bill calculator', 'electricity bill calculator india', 'units to electricity bill', 'power bill calculator', 'electricity cost calculator', 'ishu tools electricity calculator', 'electricity tariff calculator', 'home electricity bill calculator'],
    h1: 'Electricity Bill Calculator — Free Online India',
    faq: [],
  },
  'fuel-cost-calculator': {
    title: 'Fuel Cost Calculator Online Free India | ISHU TOOLS',
    description: 'Calculate fuel cost for your trip online for free. Enter distance, fuel efficiency, and current fuel price. Best for road trips, travel planning, and fleet management.',
    keywords: ['fuel cost calculator', 'petrol cost calculator', 'trip fuel cost', 'fuel expense calculator', 'travel fuel cost', 'ishu tools fuel calculator', 'petrol diesel cost calculator india', 'journey fuel cost estimator'],
    h1: 'Fuel Cost Calculator — Plan Trip Expenses Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  VIDEO DOWNLOADER TOOLS — Handcrafted SEO
  // ════════════════════════════════════════════════
  'video-downloader': {
    title: 'Video Downloader Online Free — Download Videos from Any Site | ISHU TOOLS',
    description: 'Download videos online for free from YouTube, Instagram, Twitter, Facebook, and 1000+ sites. Paste URL and download in HD quality. No software needed, works in browser.',
    keywords: ['video downloader', 'download video online', 'video downloader free', 'download videos from youtube', 'online video downloader', 'video download tool', 'ishu tools video downloader', 'video grabber', 'mp4 video downloader', 'social media video downloader', 'download youtube video free'],
    h1: 'Video Downloader — Download Videos Free Online',
    faq: [
      { question: 'How to download a video online?', answer: 'Copy the video URL from YouTube, Instagram, Twitter, or any supported site. Paste it into ISHU TOOLS Video Downloader and click "Run". Select your quality and download.' },
      { question: 'Is video downloading free on ISHU TOOLS?', answer: 'Yes! ISHU TOOLS Video Downloader is completely free, requires no signup, and supports 1000+ websites including YouTube, Instagram, Twitter, Facebook, Vimeo, and more.' },
    ],
  },
  'youtube-video-downloader': {
    title: 'YouTube Video Downloader Online Free — Download YouTube Videos | ISHU TOOLS',
    description: 'Download YouTube videos online for free in HD (1080p, 720p, 480p, 360p). No software installation, no signup. Fast YouTube video download tool.',
    keywords: ['youtube video downloader', 'download youtube video', 'youtube downloader', 'youtube video download free', 'yt downloader', 'download youtube video free', 'ishu tools youtube downloader', 'youtube mp4 downloader', 'youtube to mp4', 'youtube video saver', 'download yt video online', 'youtube hd downloader'],
    h1: 'YouTube Video Downloader — Free HD Download Online',
    faq: [
      { question: 'How to download YouTube videos?', answer: 'Copy the YouTube video URL from your browser. Paste it into ISHU TOOLS YouTube Downloader and click "Run". Choose HD, 720p, or 360p quality and download instantly.' },
    ],
  },
  'youtube-to-mp3': {
    title: 'YouTube to MP3 Converter Online Free | ISHU TOOLS',
    description: 'Convert YouTube videos to MP3 audio files online for free. Download YouTube music as MP3 in high quality. No software, instant conversion.',
    keywords: ['youtube to mp3', 'youtube mp3 converter', 'convert youtube to mp3', 'youtube mp3 download', 'youtube to audio', 'yt to mp3', 'youtube mp3 free', 'ishu tools youtube mp3', 'download youtube audio', 'youtube song downloader', 'youtube music downloader'],
    h1: 'YouTube to MP3 Converter — Free Online',
    faq: [
      { question: 'How to convert YouTube to MP3?', answer: 'Paste the YouTube video URL into ISHU TOOLS YouTube to MP3 tool and click "Run". The audio will be extracted as a high-quality MP3 file for download.' },
    ],
  },
  'instagram-downloader': {
    title: 'Instagram Video Downloader Online Free | ISHU TOOLS',
    description: 'Download Instagram videos, reels, and photos online for free. Paste Instagram URL and download in original quality. No login required.',
    keywords: ['instagram downloader', 'instagram video downloader', 'download instagram video', 'instagram reels downloader', 'instagram photo downloader', 'ig downloader', 'download instagram free', 'ishu tools instagram downloader', 'instagram story downloader'],
    h1: 'Instagram Downloader — Download Videos & Reels Free',
    faq: [],
  },
  'youtube-downloader': {
    title: 'YouTube Video Downloader Free — Download YouTube Videos Online | ISHU TOOLS',
    description: 'Download YouTube videos free online in HD 1080p, 720p, 480p, 360p. No software installation, no signup, no watermark. Fast YouTube video downloader by ISHU TOOLS.',
    keywords: ['youtube downloader', 'youtube video downloader', 'download youtube video free', 'yt downloader', 'youtube to mp4 free', 'download youtube video online', 'ishu tools youtube downloader', 'youtube hd downloader', 'youtube video save online', 'free youtube downloader no watermark', 'youtube downloader india', 'youtube video kaise download kare'],
    h1: 'YouTube Downloader — Download YouTube Videos Free in HD',
    faq: [
      { question: 'YouTube video kaise download kare free mein?', answer: 'YouTube ki video ka URL copy karo, ISHU TOOLS YouTube Downloader mein paste karo, quality select karo aur Download click karo. 100% free, koi software nahi chahiye.' },
      { question: 'Is it safe to download YouTube videos?', answer: 'ISHU TOOLS YouTube Downloader is safe and secure. We do not store your videos. Downloads are processed in real-time and deleted immediately after.' },
    ],
  },
  'photo-collage-maker': {
    title: 'Photo Collage Maker Online Free — Make Picture Collages | ISHU TOOLS',
    description: 'Create beautiful photo collages online for free. Combine multiple photos into grid layouts. Photo collage maker for Instagram, Facebook, memories & presentations — no signup.',
    keywords: ['photo collage maker', 'collage maker free', 'image collage online', 'photo collage online free', 'create photo collage', 'picture collage maker', 'ishu tools collage', 'photo grid maker', 'combine photos into collage', 'photo collage for instagram', 'collage banane wala app', 'free photo collage maker no watermark'],
    h1: 'Photo Collage Maker — Create Free Photo Collages Online',
    faq: [
      { question: 'How to make a photo collage online for free?', answer: 'Upload your photos to ISHU TOOLS Photo Collage Maker, choose a grid layout (2x2, 3x3, strips), set the gap and background color, then click Run to generate your collage. Download as PNG instantly — no signup.' },
      { question: 'Photo collage kaise banaye free mein?', answer: 'ISHU TOOLS Photo Collage Maker mein apni photos upload karo, layout choose karo aur collage instantly download karo. Bilkul free, koi watermark nahi.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  QR CODE & BARCODE
  // ════════════════════════════════════════════════
  'qr-code-generator': {
    title: 'QR Code Generator Online Free — Create QR Codes | ISHU TOOLS',
    description: 'Generate QR codes online for free. Create QR codes for URLs, text, email, WiFi, contacts. Download as PNG or SVG. High-quality QR code maker — no signup.',
    keywords: ['qr code generator', 'create qr code', 'qr code maker', 'free qr code generator', 'qr code online', 'generate qr code', 'ishu tools qr code', 'qr code free', 'qr code creator', 'url qr code', 'wifi qr code generator', 'custom qr code maker'],
    h1: 'QR Code Generator — Create QR Codes Free Online',
    faq: [
      { question: 'How to create a QR code?', answer: 'Enter any URL, text, or data into ISHU TOOLS QR Code Generator. It instantly creates a scannable QR code you can download as PNG or SVG and share anywhere.' },
    ],
  },
  'barcode-generator': {
    title: 'Barcode Generator Online Free — Create Barcodes | ISHU TOOLS',
    description: 'Generate barcodes online for free. Supports Code 128, EAN-13, QR Code, UPC, and more barcode formats. Download as PNG. Best free barcode maker.',
    keywords: ['barcode generator', 'barcode maker', 'create barcode', 'free barcode generator', 'barcode online', 'generate barcode', 'ishu tools barcode', 'code 128 barcode', 'ean-13 barcode', 'upc barcode generator', 'barcode creator free'],
    h1: 'Barcode Generator — Create Barcodes Free Online',
    faq: [],
  },
  'favicon-generator': {
    title: 'Favicon Generator Online Free — Create Website Favicon | ISHU TOOLS',
    description: 'Generate favicons for your website online for free. Upload image and get favicon.ico in all sizes (16x16, 32x32, 192x192, 512x512). No signup required.',
    keywords: ['favicon generator', 'favicon maker', 'create favicon', 'favicon ico generator', 'website icon generator', 'favicon online free', 'ishu tools favicon', 'favicon from image', 'favicon creator'],
    h1: 'Favicon Generator — Create Website Icons Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  PRODUCTIVITY & EVERYDAY TOOLS
  // ════════════════════════════════════════════════
  'pomodoro-timer': {
    title: 'Pomodoro Timer Online Free — Focus Timer | ISHU TOOLS',
    description: 'Use the Pomodoro Technique to boost productivity online for free. 25-minute focus sessions with 5-minute breaks. Best free Pomodoro timer for students and professionals.',
    keywords: ['pomodoro timer', 'focus timer', 'pomodoro technique', 'study timer', 'productivity timer', 'pomodoro online', 'pomodoro timer free', 'ishu tools pomodoro', 'work timer', '25 minute timer', 'pomodoro clock'],
    h1: 'Pomodoro Timer — Focus Timer Free Online',
    faq: [
      { question: 'What is the Pomodoro Technique?', answer: 'The Pomodoro Technique splits work into 25-minute focused sessions separated by 5-minute breaks. After 4 sessions, take a longer 15-30 minute break. It helps combat procrastination and improves focus.' },
    ],
  },
  'typing-speed-test': {
    title: 'Typing Speed Test Online Free — WPM Test | ISHU TOOLS',
    description: 'Test your typing speed online for free. Measure WPM (words per minute) and accuracy. Best free typing test for government exam preparation, job tests, and improvement.',
    keywords: ['typing speed test', 'typing test online', 'wpm test', 'typing speed checker', 'type speed test', 'typing test free', 'ishu tools typing test', 'typing practice online', 'words per minute test', 'online typing test for exams', 'typing speed wpm'],
    h1: 'Typing Speed Test — Check Your WPM Free Online',
    faq: [
      { question: 'What is a good typing speed?', answer: 'Average typing speed is 40 WPM. Good typists do 60-80 WPM. Professional typists achieve 100+ WPM. Government exam typing tests typically require 35-45 WPM.' },
    ],
  },
  'stopwatch': {
    title: 'Online Stopwatch Free — Timer & Lap Counter | ISHU TOOLS',
    description: 'Free online stopwatch with lap counter. Accurate millisecond timing for sports, study sessions, cooking, and experiments. No download required.',
    keywords: ['online stopwatch', 'stopwatch free', 'digital stopwatch', 'stopwatch online', 'lap timer', 'countdown stopwatch', 'ishu tools stopwatch', 'timer stopwatch'],
    h1: 'Online Stopwatch — Free with Lap Counter',
    faq: [],
  },
  'world-clock': {
    title: 'World Clock Online Free — Time in All Countries | ISHU TOOLS',
    description: 'Check current time in any city or country worldwide for free. World clock showing multiple time zones simultaneously. Best free world clock tool.',
    keywords: ['world clock', 'time zone clock', 'current time worldwide', 'world time zones', 'world clock online', 'global time clock', 'ishu tools world clock', 'time in different cities', 'world time free'],
    h1: 'World Clock — Current Time Worldwide Free',
    faq: [],
  },
  'tip-calculator': {
    title: 'Tip Calculator Online Free — Split Bill Calculator | ISHU TOOLS',
    description: 'Calculate tip and split restaurant bill online for free. Add service percentage, split among friends. Quick tip calculator for restaurants and hotels.',
    keywords: ['tip calculator', 'restaurant tip calculator', 'bill splitter', 'split bill calculator', 'tip amount calculator', 'ishu tools tip calculator', 'calculate tip free', 'gratuity calculator', 'dining tip calculator'],
    h1: 'Tip Calculator — Calculate & Split Bill Free',
    faq: [],
  },
  'love-calculator': {
    title: 'Love Calculator Online Free — Calculate Love Percentage | ISHU TOOLS',
    description: 'Calculate love compatibility percentage between two names online for free. Fun love test based on FLAMES algorithm. Check compatibility with your crush!',
    keywords: ['love calculator', 'love percentage calculator', 'love compatibility test', 'flames calculator', 'love test online', 'love calculator free', 'ishu tools love calculator', 'name compatibility test', 'crush compatibility'],
    h1: 'Love Calculator — Calculate Love % Free Online',
    faq: [],
  },
  'coin-flip': {
    title: 'Coin Flip Online Free — Flip a Virtual Coin | ISHU TOOLS',
    description: 'Flip a virtual coin online for free. Heads or tails? Make random decisions with our fair coin flipper. No bias, truly random results.',
    keywords: ['coin flip', 'flip a coin', 'virtual coin flip', 'heads or tails', 'coin flip online', 'random coin flip', 'ishu tools coin flip', 'online coin flipper', 'decision maker coin'],
    h1: 'Coin Flip — Flip a Virtual Coin Free Online',
    faq: [],
  },
  'dice-roller': {
    title: 'Dice Roller Online Free — Roll Virtual Dice | ISHU TOOLS',
    description: 'Roll virtual dice online for free. Standard 6-sided, 4, 8, 10, 12, 20-sided dice. Perfect for board games, DnD, and random number generation.',
    keywords: ['dice roller', 'virtual dice', 'roll dice online', 'dice simulator', 'random dice roll', 'ishu tools dice roller', 'd6 dice roller', 'd20 dice roller', 'online dice free'],
    h1: 'Dice Roller — Roll Virtual Dice Free Online',
    faq: [],
  },
  'random-number-generator': {
    title: 'Random Number Generator Online Free | ISHU TOOLS',
    description: 'Generate random numbers online for free. Set min and max range, generate multiple numbers, create random lists. Truly random using cryptographic algorithms.',
    keywords: ['random number generator', 'random number', 'random number online', 'generate random number', 'random number picker', 'random number free', 'ishu tools random number', 'random integer generator', 'lottery number generator'],
    h1: 'Random Number Generator — Free Online',
    faq: [],
  },
  'age-in-seconds': {
    title: 'Age Calculator in Seconds, Days, Hours — Free Online | ISHU TOOLS',
    description: 'Calculate your exact age in seconds, minutes, hours, days, months, and years online for free. See your age in a fun, detailed way.',
    keywords: ['age in seconds', 'age calculator seconds', 'exact age calculator', 'age in days calculator', 'age in minutes', 'ishu tools age seconds', 'calculate age in seconds', 'how many seconds old', 'birthday calculator'],
    h1: 'Age Calculator — Your Age in Seconds, Days, Hours Free',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  IMAGE FORMAT CONVERTERS
  // ════════════════════════════════════════════════
  'png-to-jpg': {
    title: 'PNG to JPG Converter Online Free | ISHU TOOLS',
    description: 'Convert PNG images to JPG online for free. Reduce file size by converting to JPEG format. Batch conversion supported. No signup, no watermark.',
    keywords: ['png to jpg', 'png to jpeg', 'convert png to jpg', 'png jpg converter', 'png to jpg online free', 'ishu tools png to jpg', 'change png to jpg', 'png to jpg free'],
    h1: 'PNG to JPG Converter — Free Online',
    faq: [],
  },
  'jpg-to-png': {
    title: 'JPG to PNG Converter Online Free | ISHU TOOLS',
    description: 'Convert JPG images to PNG online for free. Get transparent-background PNG from JPEG. High quality conversion. No signup required.',
    keywords: ['jpg to png', 'jpeg to png', 'convert jpg to png', 'jpg png converter', 'jpg to png online free', 'ishu tools jpg to png', 'change jpg to png'],
    h1: 'JPG to PNG Converter — Free Online',
    faq: [],
  },
  'heic-to-jpg': {
    title: 'HEIC to JPG Converter Online Free — iPhone Photos | ISHU TOOLS',
    description: 'Convert HEIC photos to JPG online for free. Easily share iPhone photos on Android and Windows. Batch HEIC to JPG conversion. No signup required.',
    keywords: ['heic to jpg', 'heic to jpeg', 'convert heic to jpg', 'iphone heic to jpg', 'heic converter', 'heic to jpg online free', 'ishu tools heic to jpg', 'heic photo converter', 'apple heic to jpg'],
    h1: 'HEIC to JPG Converter — Convert iPhone Photos Free',
    faq: [
      { question: 'What is HEIC format?', answer: 'HEIC (High Efficiency Image Container) is the default photo format on iPhones (iOS 11+). While it offers better compression than JPG, it\'s not universally supported. ISHU TOOLS converts HEIC to JPG for universal compatibility.' },
    ],
  },
  'webp-to-jpg': {
    title: 'WebP to JPG Converter Online Free | ISHU TOOLS',
    description: 'Convert WebP images to JPG online for free. Convert Google\'s WebP format to universal JPEG. Fast, free, no signup required.',
    keywords: ['webp to jpg', 'convert webp to jpg', 'webp to jpeg', 'webp converter', 'webp to jpg online free', 'ishu tools webp to jpg', 'webp to jpg converter free'],
    h1: 'WebP to JPG Converter — Free Online',
    faq: [],
  },
  'image-to-webp': {
    title: 'Convert Image to WebP Online Free | ISHU TOOLS',
    description: 'Convert JPG, PNG, GIF images to WebP format online for free. WebP offers 30% better compression than JPEG. Optimize images for faster websites.',
    keywords: ['image to webp', 'jpg to webp', 'png to webp', 'convert to webp', 'webp converter', 'ishu tools webp converter', 'jpg webp online', 'image webp free'],
    h1: 'Image to WebP Converter — Free Online',
    faq: [],
  },

  // ════════════════════════════════════════════════
  //  MISC TOOLS — Handcrafted SEO
  // ════════════════════════════════════════════════
  'unix-timestamp': {
    title: 'Unix Timestamp Converter Online Free — Epoch Time | ISHU TOOLS',
    description: 'Convert Unix timestamp to readable date/time and vice versa online for free. Epoch time converter, date to timestamp, timestamp to date. Essential for developers.',
    keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date', 'date to timestamp', 'unix epoch time', 'unix time converter', 'ishu tools timestamp', 'epoch time converter free', 'convert unix timestamp'],
    h1: 'Unix Timestamp Converter — Epoch Time Free Online',
    faq: [],
  },
  'date-difference': {
    title: 'Date Difference Calculator Online Free — Days Between Dates | ISHU TOOLS',
    description: 'Calculate the number of days, weeks, months, and years between two dates online for free. Count days from any date to any date. Deadline tracker.',
    keywords: ['date difference calculator', 'days between dates', 'date calculator', 'how many days between', 'day counter', 'date difference online', 'ishu tools date difference', 'date duration calculator', 'countdown days calculator'],
    h1: 'Date Difference Calculator — Days Between Dates Free',
    faq: [],
  },
  'time-zone-converter': {
    title: 'Time Zone Converter Online Free — Convert Time Zones | ISHU TOOLS',
    description: 'Convert time between time zones online for free. IST to EST, UTC to PST, and 810+ time zones worldwide. Essential for international meetings and remote work.',
    keywords: ['time zone converter', 'convert time zones', 'ist to est', 'utc to ist', 'time zone online free', 'world time converter', 'ishu tools time zone', 'timezone converter', 'time zone calculator'],
    h1: 'Time Zone Converter — Convert Time Zones Free Online',
    faq: [],
  },
  'text-to-ascii-art': {
    title: 'Text to ASCII Art Generator Online Free | ISHU TOOLS',
    description: 'Convert text to ASCII art online for free. Generate large ASCII banners, block letters, and art fonts. Perfect for terminal headers, social media, and fun.',
    keywords: ['text to ascii art', 'ascii art generator', 'ascii text art', 'ascii banner generator', 'text art generator', 'ascii font generator', 'ishu tools ascii art', 'ascii text online', 'figlet generator'],
    h1: 'Text to ASCII Art Generator — Free Online',
    faq: [],
  },
  'fancy-text-generator': {
    title: 'Fancy Text Generator Online Free — Stylish Fonts | ISHU TOOLS',
    description: 'Generate fancy text in 100+ stylish Unicode fonts online for free. Copy-paste fancy text for Instagram bio, WhatsApp, Facebook, and social media.',
    keywords: ['fancy text generator', 'stylish text', 'fancy font generator', 'cool text generator', 'unicode text generator', 'fancy text free', 'ishu tools fancy text', 'instagram fancy text', 'cool font generator', 'fancy letters online'],
    h1: 'Fancy Text Generator — 100+ Stylish Fonts Free',
    faq: [],
  },
  'ip-address-lookup': {
    title: 'IP Address Lookup Online Free — Find IP Location | ISHU TOOLS',
    description: 'Look up any IP address location online for free. Find country, city, ISP, coordinates, and timezone of any IP address. Also check your own IP.',
    keywords: ['ip address lookup', 'ip lookup', 'find ip location', 'ip address location', 'ip geolocation', 'ip address finder', 'ishu tools ip lookup', 'ip address tracker', 'my ip address', 'ip location online free'],
    h1: 'IP Address Lookup — Find IP Location Free Online',
    faq: [],
  },
  'dns-lookup': {
    title: 'DNS Lookup Online Free — DNS Record Checker | ISHU TOOLS',
    description: 'Perform DNS lookup online for free. Check A, AAAA, MX, CNAME, NS, TXT, and SOA DNS records for any domain. Fast DNS query tool for webmasters and developers.',
    keywords: ['dns lookup', 'dns record checker', 'dns query tool', 'check dns records', 'dns records online', 'dns lookup free', 'ishu tools dns lookup', 'domain dns checker', 'mx record lookup', 'a record lookup', 'cname lookup'],
    h1: 'DNS Lookup — Check DNS Records Free Online',
    faq: [
      { question: 'What DNS record types are supported?', answer: 'ISHU TOOLS DNS Lookup supports all major record types: A (IPv4), AAAA (IPv6), MX (mail), CNAME (alias), NS (nameserver), TXT (verification), SOA, and PTR records.' },
    ],
  },
  'whois-lookup': {
    title: 'WHOIS Lookup Online Free — Domain Registration Info | ISHU TOOLS',
    description: 'Perform WHOIS lookup for any domain online for free. Find domain owner, registration date, expiry date, registrar, and nameservers. No signup required.',
    keywords: ['whois lookup', 'domain whois', 'who owns domain', 'domain registration info', 'whois domain checker', 'whois online free', 'ishu tools whois', 'domain owner lookup', 'domain expiry checker'],
    h1: 'WHOIS Lookup — Domain Registration Info Free',
    faq: [],
  },
  'ssl-certificate-checker': {
    title: 'SSL Certificate Checker Online Free | ISHU TOOLS',
    description: 'Check SSL certificate details for any website online for free. View expiry date, issuer, domain, and security status. Verify HTTPS certificate validity.',
    keywords: ['ssl certificate checker', 'ssl checker', 'check ssl certificate', 'ssl certificate expiry', 'https checker', 'ssl certificate validator', 'ishu tools ssl', 'website ssl check', 'ssl expiry checker free'],
    h1: 'SSL Certificate Checker — Verify HTTPS Free Online',
    faq: [],
  },
  'currency-converter': {
    title: 'Currency Converter Online Free — Real-time Exchange Rates | ISHU TOOLS',
    description: 'Convert currencies online for free with real-time exchange rates. USD to INR, EUR to USD, GBP to INR, and 150+ currencies. Best free currency converter.',
    keywords: ['currency converter', 'usd to inr', 'dollar to rupee', 'currency exchange', 'forex converter', 'currency conversion online', 'real time currency converter', 'ishu tools currency converter', 'inr to usd converter', 'live currency converter', 'exchange rate calculator'],
    h1: 'Currency Converter — Real-Time Exchange Rates Free',
    faq: [
      { question: 'What is the current USD to INR exchange rate?', answer: 'ISHU TOOLS Currency Converter fetches real-time exchange rates. The current rate is shown when you convert. Exchange rates fluctuate throughout the day based on market conditions.' },
    ],
  },
  'emi-calculator-advanced': {
    title: 'EMI Calculator Online Free — Home Car Personal Loan | ISHU TOOLS',
    description: 'Calculate EMI for home loan, car loan, and personal loan online for free. Full amortization schedule with month-by-month breakdown. Best EMI calculator India.',
    keywords: ['emi calculator', 'loan emi calculator', 'home loan emi calculator', 'car loan emi calculator', 'personal loan emi', 'emi calculator india', 'emi calculator free', 'ishu tools emi calculator', 'loan repayment calculator', 'monthly installment calculator', 'emi with amortization'],
    h1: 'EMI Calculator — Home, Car, Personal Loan Free',
    faq: [
      { question: 'How to calculate EMI?', answer: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1). Where P = principal, r = monthly interest rate, n = number of months. ISHU TOOLS EMI Calculator does this automatically and shows a full amortization table.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  HEALTH TOOLS — Extra SEO
  // ════════════════════════════════════════════════
  'bmr-calculator': {
    title: 'BMR Calculator Online Free — Basal Metabolic Rate | ISHU TOOLS',
    description: 'Calculate your Basal Metabolic Rate (BMR) online for free using Mifflin-St Jeor formula. Find how many calories your body burns at rest. Used for weight management.',
    keywords: ['bmr calculator', 'basal metabolic rate calculator', 'calculate bmr', 'bmr online', 'resting metabolic rate', 'bmr calculator free', 'ishu tools bmr', 'calories at rest', 'metabolic rate calculator'],
    h1: 'BMR Calculator — Basal Metabolic Rate Free Online',
    faq: [],
  },
  'body-fat-calculator': {
    title: 'Body Fat Calculator Online Free — Body Fat Percentage | ISHU TOOLS',
    description: 'Calculate your body fat percentage online for free using Navy Method and BMI method. Know your fitness category: essential fat, athlete, fitness, average, obese.',
    keywords: ['body fat calculator', 'body fat percentage calculator', 'calculate body fat', 'body fat online', 'navy body fat calculator', 'ishu tools body fat', 'body composition calculator'],
    h1: 'Body Fat Calculator — Check Body Fat % Free',
    faq: [],
  },
  'heart-rate-zones': {
    title: 'Heart Rate Zones Calculator Online Free | ISHU TOOLS',
    description: 'Calculate your heart rate training zones online for free. Find fat burn, cardio, and peak zones based on your age. Essential for effective exercise and fitness training.',
    keywords: ['heart rate zones calculator', 'heart rate training zones', 'fat burn zone calculator', 'cardio heart rate zone', 'max heart rate calculator', 'ishu tools heart rate zones', 'heart rate zones free'],
    h1: 'Heart Rate Zones Calculator — Train Smarter Free',
    faq: [],
  },
  'steps-to-km': {
    title: 'Steps to KM Converter Online Free | ISHU TOOLS',
    description: 'Convert steps to kilometers and kilometers to steps online for free. Based on average stride length. Also calculates calories burned and distance in miles.',
    keywords: ['steps to km', 'steps to kilometers', 'convert steps to km', 'how many km in steps', 'steps calculator', 'ishu tools steps to km', 'steps to distance calculator', '10000 steps in km'],
    h1: 'Steps to KM Converter — Calculate Distance Free',
    faq: [
      { question: 'How many steps equal 1 km?', answer: 'On average, 1 km = approximately 1,250-1,350 steps, depending on your stride length. For a person with average stride length of 75cm, it takes about 1,333 steps per km.' },
    ],
  },
  'calories-burned-calculator': {
    title: 'Calories Burned Calculator Online Free — Exercise Calories | ISHU TOOLS',
    description: 'Calculate calories burned during exercise online for free. Running, walking, cycling, swimming, yoga, and 50+ activities. Accurate calorie expenditure based on weight and duration.',
    keywords: ['calories burned calculator', 'exercise calories calculator', 'calories burned running', 'calories burned walking', 'exercise calorie counter', 'ishu tools calories burned', 'workout calorie calculator', 'calorie burn estimator'],
    h1: 'Calories Burned Calculator — Exercise Calories Free',
    faq: [],
  },

  // ─── Ultra Tools v3 — Handcrafted Premium SEO ────────────────────────────
  'ppf-calculator': {
    title: 'PPF Calculator 2024-25 — Public Provident Fund Maturity Calculator India | ISHU TOOLS',
    description: 'Calculate PPF maturity amount, total interest earned, and yearly breakdown for FY 2024-25 at 7.1% interest rate. Public Provident Fund calculator with year-by-year breakdown. Free, no signup.',
    keywords: ['ppf calculator', 'ppf calculator 2024-25', 'public provident fund calculator', 'ppf maturity calculator', 'ppf interest calculator india', 'ppf returns 7.1%', 'post office ppf calculator', 'ppf calculator online free', 'ppf account maturity', 'ppf 15 year calculator'],
    h1: 'PPF Calculator India 2024-25 — Free Public Provident Fund Calculator',
    faq: [
      { question: 'What is the current PPF interest rate?', answer: 'The current PPF interest rate for Q1 FY 2024-25 is 7.1% per annum, compounded annually. This rate is set by the Government of India.' },
      { question: 'What is the PPF lock-in period?', answer: 'PPF has a 15-year lock-in period. After 15 years, you can extend in blocks of 5 years. Partial withdrawal is allowed from Year 7.' },
      { question: 'What is the maximum yearly investment in PPF?', answer: 'The maximum investment in PPF is ₹1,50,000 per financial year. The minimum is ₹500 per year.' },
    ],
  },
  'nps-calculator': {
    title: 'NPS Calculator India — National Pension System Returns & Monthly Pension | ISHU TOOLS',
    description: 'Calculate NPS corpus, lump sum withdrawal, and monthly pension amount. National Pension System (NPS) calculator for Tier 1 account — retirement planning made easy.',
    keywords: ['nps calculator', 'nps calculator india', 'national pension system calculator', 'nps return calculator', 'nps monthly pension calculator', 'tier 1 nps calculator', 'nps corpus calculator', 'nps annuity calculator', 'nps retirement calculator', 'nps maturity calculator'],
    h1: 'NPS Calculator India — National Pension System Monthly Pension Calculator',
    faq: [
      { question: 'What is NPS Tier 1?', answer: 'NPS Tier 1 is the primary pension account with tax benefits under 80C (up to ₹1.5L) and additional ₹50,000 under 80CCD(1B). Minimum monthly contribution is ₹500.' },
      { question: 'How much of NPS corpus can be withdrawn at retirement?', answer: 'At retirement (age 60), you can withdraw 60% of the corpus as lump sum (tax-free) and must invest at least 40% in an annuity for monthly pension.' },
    ],
  },
  'net-salary-calculator-india': {
    title: 'In-Hand Salary Calculator India 2024-25 — CTC to Take-Home Pay | ISHU TOOLS',
    description: 'Calculate monthly in-hand salary from CTC for FY 2024-25. Accounts for PF, income tax (new & old regime), professional tax, HRA exemption. Know your exact take-home pay instantly.',
    keywords: ['in hand salary calculator india', 'net salary calculator india', 'ctc to take home salary', 'salary calculator india 2024-25', 'take home pay calculator', 'monthly salary after tax india', 'salary breakup calculator', 'new tax regime salary calculator', 'old tax regime salary calculator', '10 lpa in hand salary'],
    h1: 'In-Hand Salary Calculator India 2024-25 — CTC to Take-Home Pay',
    faq: [
      { question: 'How to calculate in-hand salary from CTC?', answer: 'In-hand salary = CTC − PF contribution (12% of Basic) − Professional Tax (₹200/month) − Income Tax. Use our calculator to get exact monthly take-home based on your CTC and tax regime.' },
      { question: 'Which tax regime is better — old or new?', answer: 'If you have major deductions (80C, HRA, home loan interest), the old regime may save more tax. With no deductions, the new regime (2024-25 rates) is often better. Use our calculator to compare both.' },
    ],
  },
  'epf-calculator-india': {
    title: 'EPF Calculator India 2024 — PF Maturity & Employee Provident Fund Calculator | ISHU TOOLS',
    description: 'Calculate EPF (Employee Provident Fund) maturity amount, employer & employee contributions, and total corpus at retirement. EPF interest rate 2024: 8.25% p.a. Free PF calculator.',
    keywords: ['epf calculator india', 'pf calculator india', 'provident fund calculator', 'epf maturity calculator', 'employee pf calculator', 'epfo calculator', 'pf balance calculator', 'pf corpus calculator', 'epf interest rate 2024', 'epf interest rate 8.25'],
    h1: 'EPF Calculator India 2024 — Employee Provident Fund Maturity Calculator',
    faq: [
      { question: 'What is the current EPF interest rate?', answer: 'The EPF interest rate for FY 2023-24 is 8.25% per annum. This is declared by the EPFO each year.' },
      { question: 'How much does the employer contribute to EPF?', answer: 'The employer contributes 12% of Basic + DA. Of this, 8.33% goes to EPS (Employees\' Pension Scheme) and 3.67% goes to EPF.' },
    ],
  },
  'hra-calculator-india': {
    title: 'HRA Calculator India 2024-25 — House Rent Allowance Tax Exemption | ISHU TOOLS',
    description: 'Calculate HRA tax exemption under Section 10(13A) online. Enter basic salary, HRA received, and rent paid to find tax-exempt and taxable HRA. Valid for FY 2024-25.',
    keywords: ['hra calculator india', 'hra exemption calculator', 'house rent allowance calculator', 'hra tax exemption india 2024', 'section 10 13a hra calculator', 'hra calculation formula india', 'metro hra calculator', 'non metro hra calculator', 'hra tax saving calculator'],
    h1: 'HRA Calculator India 2024-25 — Section 10(13A) Exemption Calculator',
    faq: [
      { question: 'How is HRA exemption calculated?', answer: 'HRA exemption = Minimum of: (1) Actual HRA received, (2) 50% of Basic+DA (metro) or 40% (non-metro), (3) Rent paid minus 10% of Basic+DA. The lowest of the three is exempt.' },
    ],
  },
  'gratuity-calculator-india': {
    title: 'Gratuity Calculator India 2024 — Employee Gratuity Amount Formula | ISHU TOOLS',
    description: 'Calculate gratuity amount under the Payment of Gratuity Act. Enter last drawn salary and years of service to get exact gratuity. Formula, tax exemption, and eligibility explained.',
    keywords: ['gratuity calculator india', 'gratuity calculator online', 'gratuity amount calculator', 'gratuity formula india', 'gratuity calculation 2024', 'employee gratuity calculator', 'how to calculate gratuity', 'gratuity tax exemption india', 'payment of gratuity act calculator'],
    h1: 'Gratuity Calculator India 2024 — Payment of Gratuity Act Formula',
    faq: [
      { question: 'What is the formula for gratuity?', answer: 'For employees covered under the Gratuity Act: Gratuity = (Last Basic + DA × 15 × Years of Service) / 26. For non-covered employees: (Last Basic + DA × 15 × Years) / 30.' },
      { question: 'Is gratuity taxable?', answer: 'Gratuity is tax-free up to ₹20 lakh for government employees and private employees covered under the Act. Amount above ₹20 lakh is taxable.' },
    ],
  },
  'gstin-validator': {
    title: 'GSTIN Validator India — GST Number Verification Online Free | ISHU TOOLS',
    description: 'Validate GSTIN (GST Identification Number) online instantly. Extract state code, entity type, PAN, and check format compliance. Free GSTIN checker — no signup required.',
    keywords: ['gstin validator', 'gst number validator', 'gst verification online', 'gstin format check india', 'validate gstin online', 'gstin checker', 'gst number check india free', 'gstin state code checker', 'gstin format explained', 'gst number verification'],
    h1: 'GSTIN Validator India — Free GST Number Verification Online',
    faq: [
      { question: 'What is GSTIN format?', answer: 'GSTIN is a 15-character alphanumeric code: 2 digits state code + 10-character PAN + 1 entity number + "Z" + 1 checksum digit. Example: 27ABCDE1234F1Z5.' },
      { question: 'How to find state from GSTIN?', answer: 'The first 2 digits of GSTIN are the state code. E.g., 27 = Maharashtra, 07 = Delhi, 29 = Karnataka, 33 = Tamil Nadu, 09 = Uttar Pradesh.' },
    ],
  },
  'investment-calculator': {
    title: 'Investment Return Calculator India — Compound Interest & SIP Returns | ISHU TOOLS',
    description: 'Calculate investment returns with compound interest and monthly SIP contributions. See year-by-year wealth growth. Compare lump sum vs SIP. Free investment calculator India.',
    keywords: ['investment calculator india', 'compound interest calculator india', 'sip return calculator', 'investment return calculator', 'lump sum investment calculator', 'wealth calculator', 'mutual fund return calculator', 'investment growth calculator', 'monthly investment calculator', 'long term investment calculator'],
    h1: 'Investment Return Calculator India — Compound Interest & SIP Growth',
    faq: [
      { question: 'What is the power of compounding?', answer: 'Compounding means earning returns on your returns. ₹1 lakh invested at 12% for 10 years grows to ₹3.1 lakh (compound) vs ₹2.2 lakh (simple interest). Start early for maximum benefit.' },
    ],
  },
  'retirement-planner': {
    title: 'Retirement Planner Calculator India — FIRE & Corpus Calculator | ISHU TOOLS',
    description: 'Calculate retirement corpus needed, projected savings, and monthly investment required. Inflation-adjusted retirement planning calculator for India. FIRE calculator with shortfall analysis.',
    keywords: ['retirement calculator india', 'retirement planner india', 'fire calculator india', 'retirement corpus calculator', 'how much to save for retirement india', 'retirement planning calculator', 'retirement fund calculator', 'early retirement calculator india', 'retire at 45 india calculator'],
    h1: 'Retirement Planner Calculator India — FIRE & Corpus Planning',
    faq: [
      { question: 'How much corpus do I need for retirement in India?', answer: 'Rule of thumb: Your corpus should be 25-30x your annual expenses (adjusted for inflation). E.g., if you need ₹60,000/month = ₹7.2L/year, you need ₹1.8 crore to ₹2.16 crore corpus.' },
    ],
  },
  'net-worth-calculator': {
    title: 'Net Worth Calculator India — Personal Finance Net Worth Tracker | ISHU TOOLS',
    description: 'Calculate your total net worth from assets and liabilities. Include cash, investments, real estate, vehicles vs loans, credit card debt. Get your financial health score. Free online.',
    keywords: ['net worth calculator india', 'net worth calculator online', 'personal net worth calculator', 'assets liabilities calculator india', 'how to calculate net worth india', 'net worth tracker', 'financial health calculator', 'wealth calculator india'],
    h1: 'Net Worth Calculator India — Assets Minus Liabilities = Your Net Worth',
    faq: [
      { question: 'How to calculate net worth?', answer: 'Net Worth = Total Assets − Total Liabilities. Assets include: cash, investments (MF, stocks, FD), property, vehicles. Liabilities include: home loan, car loan, personal loan, credit card debt.' },
    ],
  },
  'css-gradient-generator': {
    title: 'CSS Gradient Generator — Linear, Radial & Conic Gradient Code | ISHU TOOLS',
    description: 'Generate CSS linear, radial, and conic gradients online. Get ready-to-use CSS code, Tailwind class hints, and preset gradients. Free CSS gradient builder — no signup.',
    keywords: ['css gradient generator', 'css gradient generator online', 'linear gradient generator', 'radial gradient css generator', 'conic gradient tool', 'css background gradient', 'gradient code generator', 'web design gradient', 'css gradient builder', 'tailwind gradient generator'],
    h1: 'CSS Gradient Generator — Linear, Radial & Conic Gradient Code Generator',
    faq: [
      { question: 'How to create a CSS gradient?', answer: 'Use `background: linear-gradient(angle, color1, color2)`. Example: `background: linear-gradient(135deg, #3bd0ff, #a855f7);` creates a diagonal gradient from blue to purple.' },
    ],
  },
  'box-shadow-generator': {
    title: 'CSS Box Shadow Generator — Shadow Code Builder Online Free | ISHU TOOLS',
    description: 'Generate CSS box-shadow code online with live preview. Customize offset, blur, spread, color, and inset. Copy ready-to-use CSS and Tailwind shadow classes. Free box shadow builder.',
    keywords: ['box shadow generator', 'css box shadow generator', 'box shadow css online', 'shadow generator web', 'css shadow builder', 'drop shadow generator css', 'box shadow code generator', 'inset shadow css', 'tailwind shadow generator', 'css box shadow examples'],
    h1: 'CSS Box Shadow Generator — Live Shadow Preview & CSS Code',
    faq: [
      { question: 'What is CSS box-shadow?', answer: 'box-shadow: h-offset v-offset blur spread color inset. Example: `box-shadow: 0 10px 20px rgba(0,0,0,0.3)` adds a subtle shadow below an element.' },
    ],
  },
  'macro-calculator': {
    title: 'Macro Calculator — Daily Protein, Carbs & Fat Calculator for Cutting/Bulking | ISHU TOOLS',
    description: 'Calculate daily macronutrient needs (protein, carbs, fat, calories) based on weight, height, activity level, and goal (lose/gain/maintain weight). Free macro calculator for fitness.',
    keywords: ['macro calculator', 'macronutrient calculator', 'protein calculator daily', 'cutting macros calculator', 'bulking macros calculator', 'daily calorie and macro calculator', 'iifym calculator', 'fitness macro calculator india', 'keto macro calculator', 'macro calculator for weight loss'],
    h1: 'Macro Calculator — Daily Protein, Carbs & Fat for Your Fitness Goal',
    faq: [
      { question: 'How many grams of protein do I need daily?', answer: 'For muscle building: 1.6-2.2g protein per kg of body weight. For weight loss: 1.2-1.6g/kg. For maintenance: 0.8-1.2g/kg. Use our macro calculator for personalized recommendations.' },
    ],
  },
  'menstrual-cycle-calculator': {
    title: 'Period Calculator & Menstrual Cycle Tracker — Next Period Date | ISHU TOOLS',
    description: 'Calculate your next period date, ovulation window, fertile days, and current cycle phase. Free menstrual cycle calculator and period tracker online — no app needed.',
    keywords: ['period calculator', 'menstrual cycle calculator', 'next period date calculator', 'ovulation calculator', 'fertile window calculator', 'period tracker online', 'menstrual cycle tracker', 'when is my next period', 'cycle phase calculator', 'ovulation date calculator'],
    h1: 'Period Calculator — Menstrual Cycle Tracker & Next Period Date',
    faq: [
      { question: 'How to calculate next period date?', answer: 'Add your cycle length (typically 28 days) to the first day of your last period. If your cycle is 28 days and last period started April 1, your next period starts April 29.' },
      { question: 'When is ovulation?', answer: 'Ovulation typically occurs 14 days before your next period. For a 28-day cycle, ovulation is around day 14. Your fertile window is days 10-16.' },
    ],
  },
  'pregnancy-week-calculator': {
    title: 'Pregnancy Week Calculator — Due Date & Trimester Calculator | ISHU TOOLS',
    description: 'Calculate pregnancy week, trimester, and due date from Last Menstrual Period (LMP). Know exactly how many weeks pregnant you are and track pregnancy milestones. Free online.',
    keywords: ['pregnancy week calculator', 'due date calculator', 'pregnancy calculator from lmp', 'how many weeks pregnant am i', 'trimester calculator', 'pregnancy due date calculator', 'pregnancy milestone calculator', 'gestational age calculator', 'pregnancy calculator india'],
    h1: 'Pregnancy Week Calculator — Due Date & Trimester from LMP',
    faq: [
      { question: 'How is pregnancy week calculated?', answer: 'Pregnancy week is calculated from the first day of your Last Menstrual Period (LMP). A full-term pregnancy is 40 weeks (280 days) from LMP.' },
      { question: 'What are the three trimesters?', answer: 'Trimester 1: Weeks 1-12. Trimester 2: Weeks 13-26. Trimester 3: Weeks 27-40. Most major organ development happens in the first trimester.' },
    ],
  },
  'color-blindness-simulator': {
    title: 'Color Blindness Simulator Online — Test Web Colors for Accessibility | ISHU TOOLS',
    description: 'Simulate how colors appear to people with color blindness (protanopia, deuteranopia, tritanopia, achromatopsia). Test web accessibility and UI design for colorblind users.',
    keywords: ['color blindness simulator', 'colorblind simulator', 'protanopia simulator', 'deuteranopia color tool', 'tritanopia color simulator', 'web accessibility color test', 'color blind friendly design', 'wcag color accessibility', 'color blindness test online', 'colorblind friendly palette'],
    h1: 'Color Blindness Simulator — Test Colors for Colorblind Accessibility',
    faq: [
      { question: 'What is protanopia?', answer: 'Protanopia is red-green color blindness where red cones are absent. People with protanopia cannot distinguish red and green colors. It affects about 1% of males.' },
      { question: 'How do I make my website color-blind friendly?', answer: 'Use high contrast, avoid red-green combinations, add patterns/shapes alongside color, and use our color blindness simulator to check how your colors appear to colorblind users.' },
    ],
  },
  'grammar-score': {
    title: 'Grammar Checker & Score Online Free — Grammar Quality Analyzer | ISHU TOOLS',
    description: 'Check English grammar quality and get a score out of 100. Detects passive voice, sentence length issues, and common grammar problems. Free grammar score estimator — no signup.',
    keywords: ['grammar checker online free', 'grammar score checker', 'english grammar checker', 'grammar quality analyzer', 'grammar score estimator', 'text grammar checker', 'grammar checker tool', 'online grammar tool', 'grammar scoring tool', 'check grammar score'],
    h1: 'Grammar Score Checker — Analyze English Grammar Quality Free',
    faq: [],
  },
  'cron-builder': {
    title: 'Cron Expression Builder & Explainer Online — Cron Job Generator | ISHU TOOLS',
    description: 'Build, validate, and understand cron expressions online. Converts cron syntax to human-readable schedule. Includes common presets and next-run time explanations. Free cron builder.',
    keywords: ['cron expression builder', 'cron job builder online', 'cron syntax generator', 'cron expression explainer', 'cron schedule builder', 'cron expression validator', 'cron generator online free', 'linux cron builder', 'understand cron expression', 'cron job scheduler'],
    h1: 'Cron Expression Builder — Build & Understand Cron Jobs Online',
    faq: [
      { question: 'What does * * * * * mean in cron?', answer: '* * * * * = Run every minute. The 5 fields are: Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), Day of Week (0-6, Sun=0).' },
    ],
  },
  'text-readability-score': {
    title: 'Text Readability Score — Flesch-Kincaid Grade Level Calculator Online | ISHU TOOLS',
    description: 'Calculate text readability score using Flesch Reading Ease and Flesch-Kincaid Grade Level. Get reading grade, word count, sentences, and audience level. Free readability analyzer.',
    keywords: ['readability score checker', 'flesch kincaid calculator', 'text readability analyzer', 'reading level calculator online', 'content readability checker', 'flesch reading ease score', 'readability grade level', 'text complexity checker', 'ishu tools readability', 'readability score free'],
    h1: 'Text Readability Score — Flesch-Kincaid Grade Level Calculator',
    faq: [
      { question: 'What is a good Flesch reading ease score?', answer: '90-100: Very Easy (5th grade). 70-80: Fairly Easy (7th grade). 60-70: Standard (8th-9th grade). 30-50: Difficult (college). Under 30: Very Difficult (professional). Aim for 60-70 for general web content.' },
    ],
  },
  // ════════════════════════════════════════════════
  //  PAGE OPS — PDF EDITING TOOLS
  // ════════════════════════════════════════════════
  'edit-pdf': {
    title: 'Edit PDF Online Free — Add Text, Images & Annotations | ISHU TOOLS',
    description: 'Edit PDF online free. Add text, watermarks, highlights, annotations, or images from one editing page. No signup, no watermark. Best free PDF editor for students and professionals in India.',
    keywords: ['edit pdf online', 'pdf editor free', 'edit pdf free', 'pdf editor online', 'edit pdf without signup', 'add text to pdf', 'annotate pdf online', 'ishu tools edit pdf', 'pdf editor india', 'free pdf editor'],
    h1: 'Edit PDF — Add Text, Images & Annotations Online Free',
    faq: [
      { question: 'Can I edit a PDF online for free?', answer: 'Yes! ISHU TOOLS PDF editor lets you add text, watermarks, highlights, and images to any PDF for free with no signup required.' },
      { question: 'What can I add to a PDF on ISHU TOOLS?', answer: 'You can add text overlays, watermarks, image stamps, annotations, and highlights to any PDF page.' },
      { question: 'Is ISHU TOOLS PDF editor better than iLovePDF?', answer: 'ISHU TOOLS offers a completely free PDF editor with no file limits, no watermarks, and no signup — perfect for students and professionals.' },
    ],
  },
  'annotate-pdf': {
    title: 'Annotate PDF Online Free — Add Comments & Notes | ISHU TOOLS',
    description: 'Annotate PDF files online for free. Place free-text annotations on specific PDF pages. Perfect for students reviewing documents, teachers giving feedback. No signup, no watermark required.',
    keywords: ['annotate pdf', 'pdf annotation tool', 'add comments to pdf', 'pdf annotator free', 'annotate pdf online', 'pdf note tool', 'ishu tools annotate pdf', 'pdf annotation india', 'free pdf annotator'],
    h1: 'Annotate PDF — Add Notes & Comments Online Free',
    faq: [
      { question: 'How do I annotate a PDF online?', answer: 'Upload your PDF to ISHU TOOLS, enter your annotation text and page number, then download your annotated PDF for free.' },
      { question: 'Can I add comments to a PDF for free?', answer: 'Yes. ISHU TOOLS lets you place free-text annotations on any PDF page at no cost and with no account needed.' },
    ],
  },
  'highlight-pdf': {
    title: 'Highlight PDF Online Free — Highlight Important Text | ISHU TOOLS',
    description: 'Highlight PDF content online for free. Apply visible highlight blocks to important areas inside a PDF page. Perfect for study notes and document review. No signup required.',
    keywords: ['highlight pdf', 'highlight pdf online free', 'pdf highlighter', 'add highlight to pdf', 'mark up pdf', 'highlight text in pdf', 'ishu tools highlight pdf', 'pdf highlight tool free'],
    h1: 'Highlight PDF — Mark Important Content Online Free',
    faq: [
      { question: 'How do I highlight text in a PDF online?', answer: 'Upload your PDF to ISHU TOOLS, specify the page and area, and download your highlighted PDF document instantly for free.' },
      { question: 'Can I highlight PDFs for free without software?', answer: 'Yes. ISHU TOOLS highlight PDF tool works in any browser on any device with no software or account required.' },
    ],
  },
  'pdf-filler': {
    title: 'PDF Filler Online Free — Fill PDF Forms | ISHU TOOLS',
    description: 'Fill PDF forms online for free. Type text at precise coordinates on any PDF page. Fill applications, forms, and documents without Adobe Acrobat. No signup, no watermark required.',
    keywords: ['fill pdf online', 'pdf filler free', 'fill pdf form online', 'pdf form filler', 'type on pdf free', 'fill pdf without acrobat', 'ishu tools pdf filler', 'pdf fill tool india'],
    h1: 'PDF Filler — Fill PDF Forms Online Free',
    faq: [
      { question: 'How do I fill a PDF form online for free?', answer: 'Upload your PDF to ISHU TOOLS PDF Filler, specify the text and coordinates, then download the filled PDF instantly.' },
      { question: 'Can I fill a PDF without Adobe Acrobat?', answer: 'Yes. ISHU TOOLS lets you fill any PDF form in your browser for free without installing any software.' },
    ],
  },
  'remove-pages': {
    title: 'Remove Pages from PDF Online Free | ISHU TOOLS',
    description: 'Remove or delete specific pages from a PDF file online for free. Just enter the page numbers to delete and download the cleaned PDF. No signup, no watermark required.',
    keywords: ['remove pages from pdf', 'delete pages from pdf', 'pdf page remover', 'remove pdf pages free', 'delete pages pdf online', 'ishu tools remove pages', 'pdf page delete tool', 'remove pages pdf india'],
    h1: 'Remove Pages from PDF — Delete Specific Pages Free',
    faq: [
      { question: 'How do I remove pages from a PDF?', answer: 'Upload your PDF to ISHU TOOLS, enter the page numbers you want to delete, and download the updated PDF instantly.' },
      { question: 'Can I delete multiple pages from a PDF at once?', answer: 'Yes. ISHU TOOLS lets you specify multiple page numbers to remove in one operation.' },
    ],
  },
  'add-page-numbers': {
    title: 'Add Page Numbers to PDF Online Free | ISHU TOOLS',
    description: 'Add page numbers to any PDF online for free. Choose position, font size, and starting number. Great for reports, assignments, and official documents. No signup required.',
    keywords: ['add page numbers to pdf', 'page numbers pdf online', 'pdf page number adder', 'number pdf pages free', 'pdf page numbering', 'ishu tools page numbers pdf', 'add page number pdf india'],
    h1: 'Add Page Numbers to PDF Online Free',
    faq: [
      { question: 'How do I add page numbers to a PDF?', answer: 'Upload your PDF to ISHU TOOLS, choose the position (top/bottom/left/right) and font size, and download the numbered PDF.' },
      { question: 'Can I start page numbering from a specific number?', answer: 'Yes. ISHU TOOLS allows you to set a custom starting page number for your document.' },
    ],
  },
  'header-and-footer': {
    title: 'Add Header and Footer to PDF Online Free | ISHU TOOLS',
    description: 'Add custom header and footer text to every page of a PDF document online for free. Great for reports, thesis, and official documents. No signup or watermark required.',
    keywords: ['add header footer pdf', 'pdf header footer online', 'add header to pdf', 'add footer to pdf', 'pdf header footer free', 'ishu tools header footer pdf', 'header footer pdf india'],
    h1: 'Add Header and Footer to PDF Online Free',
    faq: [
      { question: 'How do I add a header to a PDF?', answer: 'Upload your PDF to ISHU TOOLS, enter your header and footer text, choose positioning, and download the updated PDF.' },
      { question: 'Can I add both header and footer at once?', answer: 'Yes. ISHU TOOLS lets you add header, footer, or both simultaneously to your PDF.' },
    ],
  },
  'add-watermark': {
    title: 'Add Watermark to PDF Online Free — Text & Image | ISHU TOOLS',
    description: 'Add text or image watermarks to PDF pages online for free. Choose transparency, size, position, and apply to all pages. No signup, no limits. Best free PDF watermark tool.',
    keywords: ['add watermark to pdf', 'pdf watermark tool', 'watermark pdf online free', 'text watermark pdf', 'pdf watermark free', 'stamp pdf online', 'ishu tools watermark pdf', 'pdf watermark india'],
    h1: 'Add Watermark to PDF Online Free',
    faq: [
      { question: 'How do I add a watermark to a PDF?', answer: 'Upload your PDF to ISHU TOOLS, enter your watermark text, select opacity and position, then download your watermarked PDF.' },
      { question: 'Can I add an image watermark to a PDF?', answer: 'Yes. ISHU TOOLS supports both text and image watermarks that can be applied to all PDF pages at once.' },
    ],
  },
  'add-image-pdf': {
    title: 'Add Image to PDF Online Free — Insert Image into PDF | ISHU TOOLS',
    description: 'Add image to PDF pages online for free. Overlay logos, stamps, or photos onto PDF pages at custom positions. No signup, no watermark. Best free image insert PDF tool.',
    keywords: ['add image to pdf', 'insert image in pdf', 'image pdf overlay', 'add logo to pdf', 'stamp pdf with image', 'ishu tools add image pdf', 'add photo to pdf free', 'pdf image overlay india'],
    h1: 'Add Image to PDF — Insert Logo or Photo Online Free',
    faq: [
      { question: 'How do I add an image to a PDF?', answer: 'Upload your PDF and image to ISHU TOOLS, choose the page and position for the image, then download the updated PDF.' },
      { question: 'Can I add a company logo to my PDF?', answer: 'Yes. ISHU TOOLS lets you overlay any image including logos, signatures, and stamps onto PDF pages.' },
    ],
  },
  'resize-pages-pdf': {
    title: 'Resize PDF Pages Online Free — Scale PDF Dimensions | ISHU TOOLS',
    description: 'Resize or scale all pages of a PDF document by a custom factor online for free. Adjust PDF page dimensions for printing or compatibility. No signup required.',
    keywords: ['resize pdf pages', 'scale pdf pages', 'change pdf page size', 'pdf page resize tool', 'pdf resize online free', 'ishu tools resize pdf pages', 'pdf page scaling india'],
    h1: 'Resize PDF Pages Online Free',
    faq: [
      { question: 'How do I resize PDF pages?', answer: 'Upload your PDF to ISHU TOOLS, choose the scale factor or target page size, then download the resized PDF.' },
      { question: 'Can I change PDF pages from A4 to Letter size?', answer: 'Yes. ISHU TOOLS supports scaling PDF pages to different dimensions for compatibility and printing requirements.' },
    ],
  },
  'pdf-header-footer': {
    title: 'PDF Header & Footer Tool Online Free — Add to Every Page | ISHU TOOLS',
    description: 'Add custom header and footer text with page numbers to every PDF page online for free. Perfect for official reports, thesis, and legal documents. No signup required.',
    keywords: ['pdf header footer', 'add header footer pdf', 'pdf page header', 'pdf footer text', 'custom header pdf', 'ishu tools pdf header', 'header footer generator pdf free'],
    h1: 'PDF Header & Footer — Add to Every Page Free',
    faq: [
      { question: 'How do I add headers and footers to a PDF?', answer: 'Upload your PDF to ISHU TOOLS PDF Header & Footer tool, enter your text, choose position, and download the updated PDF for free.' },
    ],
  },
  'header-footer-pdf': {
    title: 'PDF Header & Footer — Add Custom Text to PDF Free | ISHU TOOLS',
    description: 'Add custom headers and footers with page numbers to every page of your PDF document online for free. Perfect for official documents and reports. No signup required.',
    keywords: ['pdf header footer', 'add header footer to pdf', 'pdf page header', 'pdf page footer', 'custom header footer pdf', 'ishu tools pdf header footer', 'header footer generator pdf'],
    h1: 'PDF Header & Footer — Add Custom Text Free',
    faq: [
      { question: 'How do I add a header and footer to my PDF?', answer: 'Upload your PDF, specify header and footer text and page numbers placement, then download the updated document from ISHU TOOLS.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  PDF ADVANCED TOOLS
  // ════════════════════════════════════════════════
  'edit-pdf-text': {
    title: 'Edit PDF Text Online Free — Overlay Custom Text | ISHU TOOLS',
    description: 'Edit and overlay custom text on PDF pages online for free. Add text at precise coordinates with font control. No Adobe Acrobat needed. No signup, no watermark.',
    keywords: ['edit pdf text', 'add text to pdf', 'pdf text editor', 'overlay text pdf', 'edit text in pdf free', 'pdf text overlay', 'ishu tools edit pdf text', 'type on pdf free'],
    h1: 'Edit PDF Text — Add Custom Text to PDF Free',
    faq: [
      { question: 'How do I add text to a PDF without Adobe?', answer: 'Upload your PDF to ISHU TOOLS, enter your text and choose the position and font, then download your updated PDF for free.' },
    ],
  },
  'add-text': {
    title: 'Add Text to PDF Online Free — PDF Text Tool | ISHU TOOLS',
    description: 'Add custom text annotations directly to PDF documents online for free. Perfect for filling forms, adding signatures text, or notes. No signup or software required.',
    keywords: ['add text to pdf', 'pdf text adder', 'text annotation pdf', 'type on pdf free', 'pdf text tool', 'add text pdf online', 'ishu tools add text pdf'],
    h1: 'Add Text to PDF Online Free',
    faq: [
      { question: 'How do I add text to a PDF for free?', answer: 'Upload your PDF to ISHU TOOLS, specify the text and coordinates, then download the updated PDF with your text added.' },
    ],
  },
  'add-image-to-pdf': {
    title: 'Add Image to PDF Online Free — Insert Images into PDF | ISHU TOOLS',
    description: 'Insert image layers on top of PDF pages online for free. Add logos, photos, and stamps to any PDF position. No software needed. Best free PDF image tool for India.',
    keywords: ['add image to pdf online', 'insert image pdf free', 'pdf image tool', 'logo on pdf', 'image overlay pdf', 'ishu tools add image pdf'],
    h1: 'Add Image to PDF — Insert Image Online Free',
    faq: [
      { question: 'Can I add a logo to my PDF?', answer: 'Yes! Upload your PDF and logo image to ISHU TOOLS, choose the position on the PDF, and download your branded PDF for free.' },
    ],
  },
  'pdf-to-pdfa': {
    title: 'PDF to PDF/A Converter Online Free — Archival PDF | ISHU TOOLS',
    description: 'Convert PDF to PDF/A (archival PDF) online for free. Create ISO-standardized archival PDF for long-term storage and legal document requirements. No signup needed.',
    keywords: ['pdf to pdfa', 'pdf to pdf/a', 'archival pdf converter', 'pdfa online free', 'convert pdf archival', 'pdf a standard', 'ishu tools pdf to pdfa', 'pdf archival india'],
    h1: 'PDF to PDF/A — Convert to Archival Format Free',
    faq: [
      { question: 'What is PDF/A format?', answer: 'PDF/A is an ISO-standardized format of PDF for long-term archiving. It ensures the document looks the same in the future by embedding all fonts and color profiles.' },
      { question: 'Who needs PDF/A documents?', answer: 'PDF/A is commonly required for legal filings, government submissions, and archival documents in India and internationally.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  PDF DATA & UTILITY TOOLS
  // ════════════════════════════════════════════════
  'pdf-to-json': {
    title: 'PDF to JSON Online Free — Extract PDF Data | ISHU TOOLS',
    description: 'Export PDF text and metadata into JSON format online for free. Perfect for developers parsing PDF data programmatically. No signup, instant results.',
    keywords: ['pdf to json', 'pdf to json converter', 'extract pdf to json', 'pdf data to json', 'pdf parser json', 'ishu tools pdf to json', 'pdf json free', 'developer pdf tools'],
    h1: 'PDF to JSON Converter Online Free',
    faq: [
      { question: 'How do I convert PDF to JSON?', answer: 'Upload your PDF to ISHU TOOLS and get text and metadata extracted as JSON instantly. Perfect for developers and data extraction.' },
    ],
  },
  'json-to-pdf': {
    title: 'JSON to PDF Online Free — Convert JSON to Document | ISHU TOOLS',
    description: 'Convert JSON data or text into a formatted PDF document online for free. Great for reports, data exports, and documentation. No signup required.',
    keywords: ['json to pdf', 'convert json to pdf', 'json pdf converter', 'json to document', 'ishu tools json to pdf', 'json pdf free', 'developer pdf tools'],
    h1: 'JSON to PDF Converter Online Free',
    faq: [
      { question: 'How do I convert JSON to PDF?', answer: 'Paste or upload your JSON file to ISHU TOOLS and download it as a formatted PDF document for free.' },
    ],
  },
  'xml-to-pdf': {
    title: 'XML to PDF Online Free — Convert XML to Document | ISHU TOOLS',
    description: 'Convert XML data or files into PDF documents online for free. Useful for data reports, configuration exports, and documentation. No signup required.',
    keywords: ['xml to pdf', 'convert xml to pdf', 'xml pdf converter', 'xml to document', 'ishu tools xml to pdf', 'xml pdf free'],
    h1: 'XML to PDF Converter Online Free',
    faq: [
      { question: 'How do I convert XML to PDF?', answer: 'Upload your XML file to ISHU TOOLS and download it as a formatted PDF document instantly for free.' },
    ],
  },
  'csv-to-pdf': {
    title: 'CSV to PDF Online Free — Convert CSV Spreadsheet to PDF | ISHU TOOLS',
    description: 'Convert CSV files into a professionally formatted PDF table online for free. Perfect for sharing data reports and spreadsheets as PDFs. No signup required.',
    keywords: ['csv to pdf', 'convert csv to pdf', 'csv pdf converter', 'spreadsheet to pdf', 'csv table pdf', 'ishu tools csv to pdf', 'csv pdf free', 'data to pdf'],
    h1: 'CSV to PDF — Convert Spreadsheet to PDF Table Free',
    faq: [
      { question: 'How do I convert a CSV to PDF?', answer: 'Upload your CSV file to ISHU TOOLS and download a formatted PDF table with your data instantly for free.' },
      { question: 'Will column headers be preserved?', answer: 'Yes. ISHU TOOLS generates a clean PDF table with your CSV column headers and all data rows included.' },
    ],
  },
  'pdf-pages-to-zip': {
    title: 'PDF Pages to ZIP — Export PDF Pages as Images | ISHU TOOLS',
    description: 'Export all PDF pages as individual images and download them as a ZIP file online for free. Useful for extracting all page images from a PDF. No signup needed.',
    keywords: ['pdf pages to zip', 'export pdf pages images', 'pdf to images zip', 'pdf pages download zip', 'ishu tools pdf to zip', 'pdf image extraction zip'],
    h1: 'PDF Pages to ZIP — Export Images Free',
    faq: [
      { question: 'How do I get all PDF pages as images?', answer: 'Upload your PDF to ISHU TOOLS and download all pages as image files packed in a convenient ZIP archive.' },
    ],
  },
  'zip-images-to-pdf': {
    title: 'ZIP Images to PDF Online Free — Bulk Image to PDF | ISHU TOOLS',
    description: 'Convert image files inside a ZIP archive into a single PDF document online for free. Batch convert images to PDF in one step. No signup required.',
    keywords: ['zip images to pdf', 'zip to pdf', 'bulk image to pdf', 'convert zip images pdf', 'multiple images to pdf', 'ishu tools zip to pdf', 'batch image pdf'],
    h1: 'ZIP Images to PDF — Bulk Convert Free',
    faq: [
      { question: 'How do I convert multiple images to PDF?', answer: 'Create a ZIP of your images and upload to ISHU TOOLS. All images are combined into a single PDF in order.' },
    ],
  },
  'chat-with-pdf': {
    title: 'Chat with PDF Online Free — Ask Questions About PDF | ISHU TOOLS',
    description: 'Ask questions and get context-based answers from any PDF document online for free. Powered by AI text extraction. Perfect for students and researchers. No signup required.',
    keywords: ['chat with pdf', 'ask pdf questions', 'pdf chatbot', 'ai pdf reader', 'pdf question answering', 'ishu tools chat pdf', 'pdf ai tool free', 'interact with pdf'],
    h1: 'Chat with PDF — Ask Questions About Your Document Free',
    faq: [
      { question: 'How does Chat with PDF work?', answer: 'Upload your PDF to ISHU TOOLS and ask questions. The tool extracts text context and provides relevant answers from your document.' },
      { question: 'Can I use this for studying and research?', answer: 'Yes! Chat with PDF is perfect for students and researchers who want to quickly find information in large PDF documents.' },
    ],
  },
  'create-workflow': {
    title: 'Create PDF Workflow Online Free — Custom Tool Automation | ISHU TOOLS',
    description: 'Build reusable workflow JSON from your favorite ISHU TOOLS steps. Automate multi-step PDF and image processing sequences. Free and easy to use.',
    keywords: ['pdf workflow tool', 'automation workflow', 'create pdf workflow', 'tool automation ishu', 'custom workflow builder', 'ishu tools workflow', 'pdf automation tool'],
    h1: 'Create Workflow — Automate Tool Steps Free',
    faq: [
      { question: 'What is Create Workflow on ISHU TOOLS?', answer: 'Create Workflow lets you build a reusable multi-step workflow combining your favorite ISHU TOOLS in a sequence, saving time on repetitive tasks.' },
    ],
  },
  'pdf-viewer': {
    title: 'PDF Viewer Online Free — Inspect PDF Content | ISHU TOOLS',
    description: 'View and inspect your PDF online for free. Check page count, view metadata, and preview text content from any PDF file. No signup, no download required.',
    keywords: ['pdf viewer online', 'view pdf online free', 'pdf inspector', 'pdf preview free', 'pdf metadata viewer', 'ishu tools pdf viewer', 'online pdf reader free'],
    h1: 'PDF Viewer — Inspect PDF Content Online Free',
    faq: [
      { question: 'How do I view a PDF online?', answer: 'Upload your PDF to ISHU TOOLS PDF Viewer to instantly see page count, metadata, and text preview without any software.' },
    ],
  },
  'pdf-intelligence': {
    title: 'PDF Intelligence — AI Summary & Content Analytics Free | ISHU TOOLS',
    description: 'Get AI-powered summary, keywords, and content analytics from any PDF document for free. Perfect for quick document analysis and research. No signup required.',
    keywords: ['pdf intelligence', 'pdf analysis tool', 'ai pdf summary', 'pdf content analyzer', 'pdf keyword extractor', 'ishu tools pdf intelligence', 'document analysis free'],
    h1: 'PDF Intelligence — AI Document Analysis Free',
    faq: [
      { question: 'What does PDF Intelligence do?', answer: 'ISHU TOOLS PDF Intelligence analyzes your PDF and generates a summary, extracts keywords, and provides content analytics for quick document understanding.' },
    ],
  },
  'convert-from-pdf': {
    title: 'Convert from PDF Online Free — Export PDF to Any Format | ISHU TOOLS',
    description: 'Convert PDF files to any format you choose — Word, Excel, JPG, PNG, and more — from one unified tool. Free, fast, no signup required.',
    keywords: ['convert from pdf', 'pdf converter', 'export pdf to word', 'pdf to any format', 'convert pdf free', 'ishu tools convert pdf', 'pdf format converter', 'pdf export india'],
    h1: 'Convert from PDF — Export to Any Format Free',
    faq: [
      { question: 'What formats can I convert PDF to?', answer: 'ISHU TOOLS can convert PDF to Word, Excel, PowerPoint, JPG, PNG, TXT, and more formats for free.' },
    ],
  },
  'pdf-converter': {
    title: 'PDF Converter Online Free — All PDF Conversions | ISHU TOOLS',
    description: 'Smart PDF converter that handles both PDF generation and PDF export. Convert to and from PDF in any direction. Free, no signup, no limits. Best PDF converter for India.',
    keywords: ['pdf converter', 'online pdf converter', 'pdf conversion tool', 'convert pdf online', 'all pdf conversions', 'ishu tools pdf converter', 'pdf format converter india', 'free pdf converter'],
    h1: 'PDF Converter — All-in-One Conversion Free',
    faq: [
      { question: 'What can ISHU TOOLS PDF Converter do?', answer: 'It handles all PDF conversions: PDF to Word, PDF to JPG, Word to PDF, JPG to PDF, and more — all for free.' },
      { question: 'Is ISHU TOOLS PDF Converter free?', answer: 'Yes, 100% free with no signup, no watermarks, and no file size limits.' },
    ],
  },
  'pdf-to-powerpoint': {
    title: 'PDF to PowerPoint Online Free — PDF to PPT Converter | ISHU TOOLS',
    description: 'Convert PDF pages into editable PowerPoint PPT/PPTX slides online for free. Transform PDF presentations back to PowerPoint format. No signup, no watermark.',
    keywords: ['pdf to powerpoint', 'pdf to ppt', 'pdf to pptx', 'pdf ppt converter', 'convert pdf to slides', 'ishu tools pdf to powerpoint', 'pdf to ppt free', 'pdf presentation converter india'],
    h1: 'PDF to PowerPoint — Convert PDF to PPT Free',
    faq: [
      { question: 'How do I convert a PDF to PowerPoint?', answer: 'Upload your PDF to ISHU TOOLS and download it as a PPT or PPTX PowerPoint file for free — no signup needed.' },
      { question: 'Will PDF to PPT conversion preserve the layout?', answer: 'ISHU TOOLS extracts PDF pages as slides. Layout preservation depends on the original PDF structure.' },
    ],
  },
  'pdf-to-ppt': {
    title: 'PDF to PPT Online Free — Convert PDF to Presentation | ISHU TOOLS',
    description: 'Convert PDF documents into editable PPT presentation slides online for free. Perfect for converting reports and PDFs into presentations. No signup required.',
    keywords: ['pdf to ppt', 'pdf to powerpoint free', 'pdf to slides', 'convert pdf ppt', 'pdf presentation converter', 'ishu tools pdf to ppt', 'pdf to ppt india'],
    h1: 'PDF to PPT — PDF to Presentation Slides Free',
    faq: [
      { question: 'Can I convert a PDF to PowerPoint for free?', answer: 'Yes! ISHU TOOLS converts PDF to PPT for free with no signup or software required.' },
    ],
  },
  'ppt-to-pdf': {
    title: 'PPT to PDF Online Free — Convert PowerPoint to PDF | ISHU TOOLS',
    description: 'Convert PPT and PPTX PowerPoint presentation files to PDF online for free. Make presentations universally shareable. No signup, no watermark.',
    keywords: ['ppt to pdf', 'powerpoint to pdf', 'pptx to pdf free', 'convert ppt pdf', 'presentation to pdf', 'ishu tools ppt to pdf', 'ppt pdf converter india'],
    h1: 'PPT to PDF — Convert PowerPoint to PDF Free',
    faq: [
      { question: 'How do I convert PowerPoint to PDF?', answer: 'Upload your PPT or PPTX file to ISHU TOOLS and download it as a PDF in seconds, for free.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  IMAGE CORE — COMPRESS TO TARGET SIZE
  // ════════════════════════════════════════════════
  'compress-image-to-5kb': {
    title: 'Compress Image to 5KB Online Free — For Strict Upload Forms | ISHU TOOLS',
    description: 'Compress any image to 5KB or less online for free. Perfect for strict government portal photo requirements, exam forms, and official submissions in India. No signup needed.',
    keywords: ['compress image to 5kb', 'image to 5kb', 'reduce image size 5kb', 'photo 5kb online', '5kb image compressor', 'ishu tools 5kb', 'government form 5kb photo', 'compress image 5kb india'],
    h1: 'Compress Image to 5KB Online Free',
    faq: [
      { question: 'How do I compress an image to 5KB?', answer: 'Upload your image to ISHU TOOLS 5KB Compressor and it automatically reduces the file size to under 5KB while maintaining maximum quality.' },
      { question: 'Which forms require 5KB photos?', answer: 'Some strict government forms and scholarship portals in India require profile photos to be under 5KB.' },
    ],
  },
  'compress-jpeg-to-10kb': {
    title: 'Compress JPEG to 10KB Online Free — For Exam Forms | ISHU TOOLS',
    description: 'Compress JPEG images to approximately 10KB online for free. Perfect for SSC, UPSC, RRB, IBPS, and bank exam application forms. No signup, no watermark required.',
    keywords: ['compress jpeg to 10kb', 'image 10kb compressor', 'jpeg to 10kb', 'photo 10kb online', '10kb image free', 'ishu tools 10kb', 'ssc form 10kb photo', 'exam form photo 10kb india'],
    h1: 'Compress JPEG to 10KB Online Free',
    faq: [
      { question: 'How do I compress a JPEG to 10KB?', answer: 'Upload your JPEG to ISHU TOOLS and the compressor reduces it to approximately 10KB while keeping it readable.' },
      { question: 'Which exams require a 10KB photo?', answer: 'Some SSC, banking, and government job application forms in India require photographs under 10KB.' },
    ],
  },
  'compress-image-to-15kb': {
    title: 'Compress Image to 15KB Online Free — For Government Forms | ISHU TOOLS',
    description: 'Compress image to 15KB online for free. Required for many government exam and recruitment portals in India. Reduces JPG, PNG, WebP to under 15KB. No signup needed.',
    keywords: ['compress image to 15kb', 'image 15kb compressor', 'photo 15kb online', '15kb image reducer', 'ishu tools 15kb', 'government form 15kb photo', 'compress photo 15kb india'],
    h1: 'Compress Image to 15KB Online Free',
    faq: [
      { question: 'How do I reduce an image to 15KB?', answer: 'Upload your image to ISHU TOOLS 15KB Compressor and it compresses your photo to under 15KB automatically.' },
    ],
  },
  'compress-image-to-20kb': {
    title: 'Compress Image to 20KB Online Free — SSC UPSC Form Photo | ISHU TOOLS',
    description: 'Compress image to 20KB or less online for free. Widely required for SSC, UPSC, RRB, IBPS, and state government exam forms. JPG, PNG, WebP supported. No signup.',
    keywords: ['compress image to 20kb', '20kb image compressor', 'photo 20kb online', 'reduce photo 20kb', 'ishu tools 20kb compressor', 'ssc upsc form 20kb photo', 'exam photo 20kb india'],
    h1: 'Compress Image to 20KB Free — For Exam Application Forms',
    faq: [
      { question: 'How do I compress an image to 20KB for SSC/UPSC?', answer: 'Upload your photo to ISHU TOOLS 20KB Compressor. It automatically reduces the file size to under 20KB for government exam forms.' },
    ],
  },
  'compress-jpeg-between-20kb-to-50kb': {
    title: 'Compress JPEG Between 20KB-50KB Online Free | ISHU TOOLS',
    description: 'Compress JPEG images to a target range between 20KB and 50KB online for free. Perfect for bank, SSC, UPSC, and other forms requiring photos in specific size ranges.',
    keywords: ['compress jpeg 20kb 50kb', 'image 20 to 50kb', 'jpeg size range compressor', 'photo 20kb 50kb', 'ishu tools jpeg compressor', 'exam form photo size india'],
    h1: 'Compress JPEG Between 20KB-50KB Free',
    faq: [
      { question: 'How do I compress a photo between 20KB and 50KB?', answer: 'Upload your image to ISHU TOOLS, and the compressor will target the 20KB-50KB range automatically using adaptive quality.' },
    ],
  },
  'compress-jpeg-to-25kb': {
    title: 'Compress JPEG to 25KB Online Free — For Exam Forms | ISHU TOOLS',
    description: 'Compress JPEG to around 25KB online for free. Useful for government exam and job application portals in India. No signup, no file size limit required.',
    keywords: ['compress jpeg to 25kb', '25kb jpeg compressor', 'photo 25kb online', 'ishu tools 25kb', 'exam form 25kb photo india'],
    h1: 'Compress JPEG to 25KB Online Free',
    faq: [{ question: 'How do I compress JPEG to 25KB?', answer: 'Upload your JPEG to ISHU TOOLS and download it compressed to around 25KB for free — perfect for exam application forms.' }],
  },
  'compress-jpeg-to-30kb': {
    title: 'Compress JPEG to 30KB Online Free — Photo Size Reducer | ISHU TOOLS',
    description: 'Compress JPEG to approximately 30KB online for free. Required for many Indian government recruitment forms. Fast, accurate, no signup required.',
    keywords: ['compress jpeg to 30kb', '30kb photo compressor', 'jpeg 30kb online', 'ishu tools 30kb', 'government form 30kb photo india'],
    h1: 'Compress JPEG to 30KB Online Free',
    faq: [{ question: 'How to compress a photo to 30KB?', answer: 'Upload your JPEG to ISHU TOOLS 30KB Compressor and download the compressed photo in seconds for free.' }],
  },
  'compress-jpeg-to-40kb': {
    title: 'Compress JPEG to 40KB Online Free — For Online Applications | ISHU TOOLS',
    description: 'Compress JPEG images to around 40KB online for free. Perfect for online job applications and government forms requiring specific photo sizes in India.',
    keywords: ['compress jpeg to 40kb', '40kb jpeg compressor', 'photo 40kb online', 'ishu tools 40kb', 'application form 40kb photo india'],
    h1: 'Compress JPEG to 40KB Online Free',
    faq: [{ question: 'How do I compress JPEG to 40KB?', answer: 'Upload your photo to ISHU TOOLS, and the 40KB compressor reduces it to approximately 40KB automatically.' }],
  },
  'compress-image-to-50kb': {
    title: 'Compress Image to 50KB Online Free — For Govt Forms | ISHU TOOLS',
    description: 'Compress image to 50KB online for free. Required for SSC CGL, SSC CHSL, RRB, IBPS, SBI PO, and many government exam forms in India. JPG, PNG supported.',
    keywords: ['compress image to 50kb', 'photo 50kb compressor', 'reduce image 50kb', 'ssc cgl 50kb photo', 'government form 50kb image', 'ishu tools 50kb compressor', 'rrb 50kb photo', 'ibps 50kb photo india'],
    h1: 'Compress Image to 50KB — For Government Exam Forms Free',
    faq: [
      { question: 'How do I compress a photo to 50KB for SSC/RRB?', answer: 'Upload your photo to ISHU TOOLS 50KB Compressor. It reduces the image to under 50KB automatically — perfect for SSC, RRB, IBPS exam forms.' },
      { question: 'Which exams need 50KB photos?', answer: 'SSC CGL, SSC CHSL, RRB NTPC, IBPS PO, SBI PO, and many state government recruitment portals require photos under 50KB.' },
    ],
  },
  'compress-image-to-100kb': {
    title: 'Compress Image to 100KB Online Free — For Government Portals | ISHU TOOLS',
    description: 'Compress image to 100KB online for free. Perfect for UPSC, state PSC, bank PO, and government job application forms in India that require photos under 100KB.',
    keywords: ['compress image to 100kb', 'photo 100kb compressor', 'reduce image 100kb', 'upsc 100kb photo', 'bank exam 100kb photo', 'ishu tools 100kb', 'government portal 100kb image india'],
    h1: 'Compress Image to 100KB Free — For Government Portals',
    faq: [
      { question: 'How do I compress an image to under 100KB?', answer: 'Upload your photo to ISHU TOOLS 100KB Compressor and download the compressed image in seconds for free — perfect for UPSC and bank exam forms.' },
    ],
  },
  'compress-jpeg-to-150kb': {
    title: 'Compress JPEG to 150KB Online Free — Photo Size Reducer | ISHU TOOLS',
    description: 'Compress JPEG images to approximately 150KB online for free. Useful for various government and private sector job application portals. No signup required.',
    keywords: ['compress jpeg to 150kb', '150kb photo compressor', 'jpeg 150kb online', 'ishu tools 150kb', 'compress photo 150kb india'],
    h1: 'Compress JPEG to 150KB Online Free',
    faq: [{ question: 'How do I compress JPEG to 150KB?', answer: 'Upload your JPEG to ISHU TOOLS and download a compressed version at approximately 150KB for free.' }],
  },
  'compress-image-to-200kb': {
    title: 'Compress Image to 200KB Online Free — Document Upload Ready | ISHU TOOLS',
    description: 'Compress image to 200KB online for free. Perfect for application portals requiring document photos and ID images under 200KB. No signup needed.',
    keywords: ['compress image to 200kb', '200kb image compressor', 'photo 200kb online', 'document upload 200kb', 'ishu tools 200kb compressor', 'compress image 200kb india'],
    h1: 'Compress Image to 200KB Online Free',
    faq: [{ question: 'How do I reduce image size to 200KB?', answer: 'Upload your image to ISHU TOOLS 200KB Compressor and download a compressed version under 200KB for free.' }],
  },
  'compress-jpeg-to-300kb': {
    title: 'Compress JPEG to 300KB Online Free | ISHU TOOLS',
    description: 'Compress JPEG images to approximately 300KB online for free. Reduce large photos to 300KB for email, document portals, and application forms in India.',
    keywords: ['compress jpeg to 300kb', '300kb jpeg compressor', 'photo 300kb online', 'ishu tools 300kb', 'compress photo 300kb india'],
    h1: 'Compress JPEG to 300KB Online Free',
    faq: [{ question: 'How do I compress a photo to 300KB?', answer: 'Upload your JPEG to ISHU TOOLS and download a 300KB compressed version for free — no signup required.' }],
  },
  'compress-jpeg-to-500kb': {
    title: 'Compress JPEG to 500KB Online Free — Large File Reducer | ISHU TOOLS',
    description: 'Compress JPEG images to approximately 500KB online for free. Reduce large camera photos to 500KB for sharing and uploading. No signup required.',
    keywords: ['compress jpeg to 500kb', '500kb jpeg compressor', 'photo 500kb online', 'large photo 500kb', 'ishu tools 500kb', 'compress photo 500kb india'],
    h1: 'Compress JPEG to 500KB Online Free',
    faq: [{ question: 'How do I compress a JPEG to 500KB?', answer: 'Upload your photo to ISHU TOOLS 500KB Compressor and download it at approximately 500KB for free.' }],
  },
  'compress-image-to-1mb': {
    title: 'Compress Image to 1MB Online Free — Photo Size Reducer | ISHU TOOLS',
    description: 'Compress image to around 1MB online for free. Useful for reducing very large photos for document portals, email, and social media. No signup required.',
    keywords: ['compress image to 1mb', '1mb image compressor', 'photo 1mb reducer', 'reduce image 1mb', 'ishu tools 1mb compressor', 'compress photo 1mb india'],
    h1: 'Compress Image to 1MB Online Free',
    faq: [{ question: 'How do I compress an image to 1MB?', answer: 'Upload your image to ISHU TOOLS 1MB Compressor and download a version compressed to approximately 1MB for free.' }],
  },
  'compress-image-to-2mb': {
    title: 'Compress Image to 2MB Online Free — For Document Upload | ISHU TOOLS',
    description: 'Compress image to around 2MB online for free. Useful for document submission portals with 2MB size limits. No signup, no limits required.',
    keywords: ['compress image to 2mb', '2mb image compressor', 'reduce photo to 2mb', 'document upload 2mb', 'ishu tools 2mb compressor', 'compress image 2mb india'],
    h1: 'Compress Image to 2MB Online Free',
    faq: [{ question: 'How do I reduce an image to 2MB?', answer: 'Upload your image to ISHU TOOLS 2MB Compressor and download a version compressed to approximately 2MB for free.' }],
  },
  'compress-to-15kb': {
    title: 'Compress Image to 15KB Online Free | ISHU TOOLS',
    description: 'Compress any image to under 15KB online for free. Perfect for strict upload forms requiring photos in KB range. No signup needed.',
    keywords: ['compress to 15kb', 'image 15kb', 'photo 15kb', 'ishu tools 15kb compressor'],
    h1: 'Compress Image to 15KB Free',
    faq: [{ question: 'How do I compress to 15KB?', answer: 'Upload your image to ISHU TOOLS and it will compress it to under 15KB automatically.' }],
  },
  'compress-to-25kb': {
    title: 'Compress Image to 25KB Online Free | ISHU TOOLS',
    description: 'Compress any image to under 25KB online for free with adaptive quality tuning. For strict government and exam form uploads.',
    keywords: ['compress to 25kb', 'image 25kb', 'photo 25kb', 'ishu tools 25kb compressor'],
    h1: 'Compress Image to 25KB Free',
    faq: [{ question: 'How do I compress to 25KB?', answer: 'Upload your image to ISHU TOOLS and it will compress to under 25KB automatically.' }],
  },
  'compress-to-40kb': {
    title: 'Compress Image to 40KB Online Free | ISHU TOOLS',
    description: 'Compress any image to under 40KB online for free while preserving readability. For exam and government application forms.',
    keywords: ['compress to 40kb', 'image 40kb', 'photo 40kb', 'ishu tools 40kb compressor'],
    h1: 'Compress Image to 40KB Free',
    faq: [{ question: 'How do I compress to 40KB?', answer: 'Upload your image to ISHU TOOLS and it will compress to under 40KB automatically.' }],
  },

  // ════════════════════════════════════════════════
  //  IMAGE CORE — SIZE MANIPULATION
  // ════════════════════════════════════════════════
  'increase-image-size-in-kb': {
    title: 'Increase Image Size in KB Online Free — Boost Photo Size | ISHU TOOLS',
    description: 'Increase image file size to a target KB value by adjusting quality and dimensions online for free. Perfect when minimum file size is required for forms.',
    keywords: ['increase image size in kb', 'boost image size kb', 'make image larger kb', 'increase photo size', 'ishu tools increase kb', 'image size booster india'],
    h1: 'Increase Image Size in KB Online Free',
    faq: [
      { question: 'How do I increase image size in KB?', answer: 'Upload your image to ISHU TOOLS, enter the target KB size, and download a version with the increased file size.' },
      { question: 'Why would I need to increase image size?', answer: 'Some forms require a minimum file size. ISHU TOOLS can increase your image size in KB to meet minimum requirements.' },
    ],
  },
  'reduce-image-size-in-mb': {
    title: 'Reduce Image Size in MB Online Free — MB Photo Compressor | ISHU TOOLS',
    description: 'Reduce image size to a target value in MB online for free. Compress large camera RAW or high-resolution photos to a specific MB target. No signup required.',
    keywords: ['reduce image size in mb', 'image mb compressor', 'compress photo in mb', 'photo mb reducer', 'ishu tools reduce mb', 'large photo compress mb india'],
    h1: 'Reduce Image Size in MB Online Free',
    faq: [
      { question: 'How do I reduce image size in MB?', answer: 'Upload your image to ISHU TOOLS, specify the target size in MB, and download the compressed version for free.' },
    ],
  },
  'convert-image-from-mb-to-kb': {
    title: 'Convert Image from MB to KB Online Free | ISHU TOOLS',
    description: 'Convert oversized images from MB to KB ranges online for free. Compress large photos to a few hundred KB for forms and portals. No signup required.',
    keywords: ['convert image mb to kb', 'mb to kb converter image', 'photo mb to kb', 'compress mb image to kb', 'ishu tools mb to kb', 'image mb to kb india'],
    h1: 'Convert Image from MB to KB Free',
    faq: [{ question: 'How do I convert image from MB to KB?', answer: 'Upload your large image to ISHU TOOLS MB to KB converter and download a compressed KB-range version for free.' }],
  },
  'convert-image-size-kb-to-mb': {
    title: 'Convert Image Size KB to MB Online Free | ISHU TOOLS',
    description: 'Increase image file size from KB to MB ranges online for free. Useful when minimum file size in MB is required for document uploads.',
    keywords: ['convert image kb to mb', 'kb to mb image converter', 'increase image kb to mb', 'photo kb to mb', 'ishu tools kb to mb', 'image size increase india'],
    h1: 'Convert Image Size from KB to MB Free',
    faq: [{ question: 'How do I increase image from KB to MB?', answer: 'Upload your image to ISHU TOOLS KB to MB converter, enter the target MB value, and download the increased-size image for free.' }],
  },
  'bulk-image-compressor': {
    title: 'Bulk Image Compressor Online Free — Compress Multiple Images | ISHU TOOLS',
    description: 'Compress multiple images at once online for free. Upload up to 20 images and compress them all in one go. Download as ZIP. No signup, no watermark.',
    keywords: ['bulk image compressor', 'compress multiple images', 'batch image compressor', 'bulk photo compressor free', 'ishu tools bulk compress', 'compress many images india', 'multiple image compressor online'],
    h1: 'Bulk Image Compressor — Compress Multiple Images Free',
    faq: [
      { question: 'Can I compress multiple images at once?', answer: 'Yes! ISHU TOOLS Bulk Compressor lets you upload up to 20 images and compresses them all at once, downloadable as a ZIP file.' },
      { question: 'Is bulk compression free on ISHU TOOLS?', answer: 'Yes, completely free with no signup required. Compress as many batches of images as you need.' },
    ],
  },
  'image-to-base64': {
    title: 'Image to Base64 Converter Online Free | ISHU TOOLS',
    description: 'Convert any image to Base64 encoded string online for free. Useful for embedding images in HTML, CSS, JSON, and APIs. Supports JPG, PNG, WebP, GIF. No signup.',
    keywords: ['image to base64', 'image base64 converter', 'convert image base64', 'base64 encode image', 'embed image base64', 'ishu tools image base64', 'image to base64 free', 'html image embed base64'],
    h1: 'Image to Base64 Converter Online Free',
    faq: [
      { question: 'How do I convert an image to Base64?', answer: 'Upload your image to ISHU TOOLS and get the Base64 encoded string instantly. Copy it for use in HTML, CSS, JSON, or API calls.' },
      { question: 'Why would I need a Base64 image?', answer: 'Base64 images are used to embed images directly in HTML, CSS, or data URIs without needing a separate image file.' },
    ],
  },
  'base64-to-image': {
    title: 'Base64 to Image Converter Online Free — Decode Base64 | ISHU TOOLS',
    description: 'Decode a Base64 string back to an image file online for free. Paste your Base64 encoded image data and download the recovered image. No signup required.',
    keywords: ['base64 to image', 'decode base64 image', 'base64 image converter', 'convert base64 to image', 'base64 decode image', 'ishu tools base64 image', 'base64 decode free'],
    h1: 'Base64 to Image Converter Online Free',
    faq: [
      { question: 'How do I convert Base64 to an image?', answer: 'Paste your Base64 encoded string into ISHU TOOLS Base64 to Image converter and download the decoded image file for free.' },
    ],
  },
  'aspect-ratio-calculator': {
    title: 'Aspect Ratio Calculator Online Free — Image Dimensions | ISHU TOOLS',
    description: 'Calculate image aspect ratio, GCD simplification, megapixels, and scaled dimensions online for free. Essential tool for designers, developers, and photographers.',
    keywords: ['aspect ratio calculator', 'image aspect ratio', 'calculate aspect ratio', 'image resolution calculator', 'image dimensions calculator', 'ishu tools aspect ratio', 'pixel aspect ratio free'],
    h1: 'Aspect Ratio Calculator — Image Dimensions Free',
    faq: [
      { question: 'How do I calculate aspect ratio?', answer: 'Enter your image width and height in ISHU TOOLS Aspect Ratio Calculator to get the ratio, GCD, megapixels, and scaled dimensions.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  IMAGE ENHANCE TOOLS
  // ════════════════════════════════════════════════
  'posterize-image': {
    title: 'Posterize Image Online Free — Stylized Poster Effect | ISHU TOOLS',
    description: 'Create a stylized poster effect by reducing the color depth of your image online for free. Perfect for artistic image transformations and design projects.',
    keywords: ['posterize image', 'posterize photo online', 'poster effect image', 'reduce color depth image', 'image posterize free', 'ishu tools posterize', 'artistic image effect'],
    h1: 'Posterize Image — Poster Effect Online Free',
    faq: [
      { question: 'How do I posterize an image?', answer: 'Upload your image to ISHU TOOLS Posterize tool, choose the color depth level, and download your posterized image for free.' },
    ],
  },
  'image-histogram': {
    title: 'Image Histogram Analyzer Online Free — RGB Statistics | ISHU TOOLS',
    description: 'Extract RGB histogram summary and image statistics from any image online for free. Analyze color distribution, brightness, and contrast. Perfect for photographers.',
    keywords: ['image histogram', 'image histogram analyzer', 'rgb histogram', 'image color analysis', 'image statistics free', 'ishu tools histogram', 'photo histogram online'],
    h1: 'Image Histogram — RGB Statistics Analyzer Free',
    faq: [
      { question: 'What is an image histogram?', answer: 'A histogram shows the distribution of pixel values (RGB channels) in an image, helping photographers analyze exposure, contrast, and color balance.' },
    ],
  },
  'motion-blur-image': {
    title: 'Motion Blur Image Online Free — Cinematic Effect | ISHU TOOLS',
    description: 'Apply cinematic motion blur effect to photos and graphics online for free. Choose direction and intensity for professional motion effects. No signup required.',
    keywords: ['motion blur image', 'motion blur photo', 'cinematic blur effect', 'add motion blur photo', 'image motion blur free', 'ishu tools motion blur', 'blur effect photo'],
    h1: 'Motion Blur Image — Cinematic Effect Online Free',
    faq: [
      { question: 'How do I add motion blur to an image?', answer: 'Upload your image to ISHU TOOLS Motion Blur, choose direction (horizontal/vertical) and intensity, then download the effect for free.' },
    ],
  },
  'convert-dpi': {
    title: 'Convert Image DPI Online Free — Change DPI to 200/300/600 | ISHU TOOLS',
    description: 'Rewrite image DPI metadata for printing or document upload requirements online for free. Change DPI to 200, 300, 600 or custom values. No signup required.',
    keywords: ['convert dpi', 'change image dpi', 'image dpi converter', 'dpi changer free', 'convert 300 dpi', 'image dpi 600', 'ishu tools dpi converter', 'photo dpi change india'],
    h1: 'Convert Image DPI — Change to 300/600 DPI Free',
    faq: [
      { question: 'How do I change image DPI?', answer: 'Upload your image to ISHU TOOLS DPI Converter, specify the target DPI (e.g., 300 for print, 600 for high-res), and download.' },
      { question: 'What DPI is required for passport photos in India?', answer: 'Passport and ID photos typically require 300 DPI minimum. ISHU TOOLS can convert your image to exactly 300 DPI for free.' },
    ],
  },
  'check-dpi': {
    title: 'Check Image DPI Online Free — DPI & Resolution Checker | ISHU TOOLS',
    description: 'Check the DPI and resolution stored in any image file online for free. Find out if your photo meets print or form upload DPI requirements. No signup needed.',
    keywords: ['check image dpi', 'image dpi checker', 'photo dpi check', 'image resolution checker', 'dpi finder free', 'ishu tools check dpi', 'check dpi online', 'photo resolution checker india'],
    h1: 'Check Image DPI — DPI & Resolution Checker Free',
    faq: [
      { question: 'How do I check image DPI?', answer: 'Upload your image to ISHU TOOLS DPI Checker and instantly see the stored DPI and resolution metadata.' },
      { question: 'What DPI do I need for printing in India?', answer: 'For good print quality, photos typically need 300 DPI. Use ISHU TOOLS to check and convert your image DPI for free.' },
    ],
  },
  'color-code-from-image': {
    title: 'Color Picker from Image Online Free — Extract Hex Colors | ISHU TOOLS',
    description: 'Extract dominant color palette and hex codes from any image online for free. Get the exact colors used in photos, logos, and designs. Perfect for designers.',
    keywords: ['color picker from image', 'extract color from image', 'image color palette', 'get hex code from image', 'image color extractor', 'ishu tools color picker', 'photo color extractor free'],
    h1: 'Color Picker from Image — Extract Hex Colors Free',
    faq: [
      { question: 'How do I get the color code from an image?', answer: 'Upload your image to ISHU TOOLS Color Picker and get the dominant color palette with hex codes instantly for free.' },
    ],
  },
  'unblur-image': {
    title: 'Unblur Image Online Free — Sharpen Blurry Photos | ISHU TOOLS',
    description: 'Sharpen and unblur images with AI-powered clarity enhancement online for free. Fix blurry photos, improve sharpness, and restore image clarity. No signup required.',
    keywords: ['unblur image', 'sharpen blurry photo', 'unblur photo online', 'image sharpener free', 'fix blurry image', 'ishu tools unblur', 'ai image sharpener', 'unblur photo india'],
    h1: 'Unblur Image — Sharpen Photos Online Free',
    faq: [
      { question: 'Can I unblur a photo online for free?', answer: 'Yes! ISHU TOOLS uses AI enhancement to sharpen and unblur photos, restoring clarity for free with no signup.' },
    ],
  },
  'increase-image-quality': {
    title: 'Increase Image Quality Online Free — AI Photo Enhancer | ISHU TOOLS',
    description: 'Enhance image sharpness, contrast, and color to increase perceived quality online for free. AI-powered photo improvement for students, photographers, and social media.',
    keywords: ['increase image quality', 'enhance image quality', 'improve photo quality', 'ai photo enhancer', 'image quality booster', 'ishu tools image quality', 'photo enhance free'],
    h1: 'Increase Image Quality — AI Photo Enhancer Free',
    faq: [
      { question: 'How do I increase image quality for free?', answer: 'Upload your photo to ISHU TOOLS Image Quality Enhancer and get an improved version with better sharpness, contrast, and color for free.' },
    ],
  },
  'beautify-image': {
    title: 'Beautify Image Online Free — Auto Photo Enhancement | ISHU TOOLS',
    description: 'Auto-enhance your photo with balanced color, contrast and sharpness improvements online for free. Make your photos look more professional and polished instantly.',
    keywords: ['beautify image', 'auto enhance photo', 'photo beautifier', 'image enhancement free', 'improve photo online', 'ishu tools beautify', 'auto photo improve'],
    h1: 'Beautify Image — Auto Enhancement Online Free',
    faq: [
      { question: 'How do I beautify a photo online?', answer: 'Upload your image to ISHU TOOLS Beautifier and it automatically applies balanced enhancements to color, contrast, and sharpness for free.' },
    ],
  },
  'retouch-image': {
    title: 'Retouch Image Online Free — Smooth Blemishes & Imperfections | ISHU TOOLS',
    description: 'Smooth blemishes and imperfections with intelligent image retouching online for free. Improve portrait photos and headshots without photo editing skills.',
    keywords: ['retouch image', 'photo retoucher free', 'smooth blemishes photo', 'image retouch online', 'portrait retouching free', 'ishu tools retouch', 'photo touch up free'],
    h1: 'Retouch Image — Smooth Blemishes Online Free',
    faq: [
      { question: 'How do I retouch a photo online for free?', answer: 'Upload your portrait or photo to ISHU TOOLS Retouch tool and it intelligently smooths blemishes and imperfections for free.' },
    ],
  },
  'super-resolution': {
    title: 'Super Resolution Online Free — Upscale Image 2x 4x | ISHU TOOLS',
    description: 'Upscale image resolution 2x or 4x with high-quality interpolation online for free. Enlarge small photos without losing quality. Perfect for low-resolution images.',
    keywords: ['super resolution', 'upscale image', 'image upscaler free', 'increase image resolution', 'enlarge photo quality', 'ishu tools super resolution', 'ai image upscale free', '4x upscale image'],
    h1: 'Super Resolution — Upscale Image 2x/4x Free',
    faq: [
      { question: 'How do I upscale an image to higher resolution?', answer: 'Upload your image to ISHU TOOLS Super Resolution, choose 2x or 4x upscaling, and download the enlarged high-quality version for free.' },
    ],
  },
  'photo-blemish-remover': {
    title: 'Photo Blemish Remover Online Free — Skin Retouching | ISHU TOOLS',
    description: 'Remove facial blemishes and apply smoothing retouching to portrait photos online for free. Improve skin appearance in professional headshots and ID photos.',
    keywords: ['blemish remover photo', 'remove blemishes photo free', 'skin retouching online', 'photo blemish remover', 'face blemish removal', 'ishu tools blemish remover', 'portrait photo retouching'],
    h1: 'Photo Blemish Remover — Skin Retouching Free',
    faq: [
      { question: 'How do I remove blemishes from a photo?', answer: 'Upload your photo to ISHU TOOLS Blemish Remover and it applies intelligent smoothing to reduce facial blemishes for free.' },
    ],
  },
  'unblur-face': {
    title: 'Unblur Face Online Free — Sharpen Face in Photo | ISHU TOOLS',
    description: 'Enhance and sharpen detected faces in an image online for free. Fix blurry faces in photos with AI-powered face sharpening. No signup required.',
    keywords: ['unblur face', 'sharpen face photo', 'unblur face online', 'face sharpener free', 'fix blurry face', 'ishu tools unblur face', 'ai face sharpen'],
    h1: 'Unblur Face — Sharpen Face in Photo Free',
    faq: [
      { question: 'How do I unblur a face in a photo?', answer: 'Upload your image to ISHU TOOLS Unblur Face tool. It detects and sharpens faces in the image using AI enhancement for free.' },
    ],
  },
  'picture-to-pixel-art': {
    title: 'Picture to Pixel Art Online Free — Retro Pixel Style | ISHU TOOLS',
    description: 'Convert photos into retro pixel art style with reduced color palette online for free. Create 8-bit style graphics from any image. Perfect for gaming and design projects.',
    keywords: ['picture to pixel art', 'photo to pixel art', 'image pixelate art', 'pixel art generator free', '8bit image converter', 'ishu tools pixel art', 'retro image effect'],
    h1: 'Picture to Pixel Art — Retro Effect Online Free',
    faq: [
      { question: 'How do I convert a photo to pixel art?', answer: 'Upload your photo to ISHU TOOLS Pixel Art converter, choose the pixel block size, and download your retro 8-bit style artwork for free.' },
    ],
  },
  'black-and-white-image': {
    title: 'Black and White Image Converter Online Free | ISHU TOOLS',
    description: 'Convert color photos to high-contrast black and white images online for free. Turn any photo to grayscale or true black and white for artistic and professional results.',
    keywords: ['black and white image', 'black white photo converter', 'grayscale image online', 'convert photo black white', 'bw image converter free', 'ishu tools black white', 'monochrome photo'],
    h1: 'Black and White Image Converter Online Free',
    faq: [
      { question: 'How do I convert a photo to black and white?', answer: 'Upload your image to ISHU TOOLS Black and White converter and download a high-contrast monochrome version for free.' },
    ],
  },
  'censor-photo': {
    title: 'Censor Photo Online Free — Pixelate or Blur Faces | ISHU TOOLS',
    description: 'Censor faces and sensitive areas in photos online for free. Pixelate detected face regions or blur the full photo to protect privacy. No signup required.',
    keywords: ['censor photo', 'censor face photo', 'pixelate face online', 'blur face in photo', 'privacy photo censor', 'ishu tools censor photo', 'face blur free', 'blur sensitive photo'],
    h1: 'Censor Photo — Blur or Pixelate Faces Online Free',
    faq: [
      { question: 'How do I censor faces in a photo?', answer: 'Upload your photo to ISHU TOOLS Censor tool. It detects and pixelates face regions or you can blur the full photo to protect privacy.' },
    ],
  },
  'motion-blur': {
    title: 'Motion Blur Effect Online Free — Cinematic Image Effect | ISHU TOOLS',
    description: 'Add cinematic motion blur effect to images online for free. Choose direction and intensity for professional motion graphics and creative photos.',
    keywords: ['motion blur', 'motion blur effect', 'cinematic motion blur', 'add blur effect photo', 'motion graphic effect', 'ishu tools motion blur', 'photo motion effect free'],
    h1: 'Motion Blur — Cinematic Image Effect Online Free',
    faq: [
      { question: 'How do I add a motion blur effect to an image?', answer: 'Upload your image to ISHU TOOLS Motion Blur, set direction and intensity, then download with the effect applied for free.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  IMAGE LAYOUT TOOLS
  // ════════════════════════════════════════════════
  'add-name-dob-image': {
    title: 'Add Name and DOB on Photo Online Free — ID Photo | ISHU TOOLS',
    description: 'Overlay name and date of birth text onto photos online for free. Perfect for school ID cards, government document photos, and official submissions in India.',
    keywords: ['add name dob photo', 'add text to id photo', 'name on photo online', 'overlay text photo', 'id photo name dob', 'ishu tools add name photo', 'india id photo text'],
    h1: 'Add Name and DOB on Photo Online Free',
    faq: [
      { question: 'How do I add my name to a photo online?', answer: 'Upload your photo to ISHU TOOLS, enter your name and date of birth, choose text position, and download your labeled photo for free.' },
    ],
  },
  'merge-photo-signature': {
    title: 'Merge Photo and Signature Online Free — ID Form Ready | ISHU TOOLS',
    description: 'Combine a photo and signature into one clean export online for free. Perfect for SSC, UPSC, bank exam forms, and admission applications in India.',
    keywords: ['merge photo signature', 'photo signature combine', 'id photo signature merge', 'combine photo signature', 'ishu tools photo signature', 'exam form photo signature india', 'merge photo signature free'],
    h1: 'Merge Photo and Signature Online Free',
    faq: [
      { question: 'How do I merge photo and signature for exam forms?', answer: 'Upload your photo and signature image to ISHU TOOLS Merge tool and download a combined image with both elements positioned correctly.' },
      { question: 'Which exams require merged photo and signature?', answer: 'SSC, UPSC, RRB, and many university admission forms require a single image combining both photo and signature.' },
    ],
  },
  'zoom-out-image': {
    title: 'Zoom Out Image Online Free — Add Border Effect | ISHU TOOLS',
    description: 'Add a border around your image to create a zoom-out perspective effect online for free. Perfect for social media posts and creative photography effects.',
    keywords: ['zoom out image', 'add border zoom out', 'image zoom out effect', 'photo border effect', 'zoom out photo online', 'ishu tools zoom out image', 'image border frame free'],
    h1: 'Zoom Out Image — Border Effect Online Free',
    faq: [
      { question: 'How do I zoom out an image online?', answer: 'Upload your image to ISHU TOOLS Zoom Out tool, choose border size and color, and download the zoom-out effect version for free.' },
    ],
  },
  'add-white-border-image': {
    title: 'Add White Border to Image Online Free — Clean Photo Frame | ISHU TOOLS',
    description: 'Add a clean white border around any photo for a professional look online for free. Perfect for Instagram posts, printing, and document photos.',
    keywords: ['add white border image', 'white border photo', 'image white frame', 'photo white border free', 'add border to photo', 'ishu tools white border', 'white frame image'],
    h1: 'Add White Border to Image Online Free',
    faq: [
      { question: 'How do I add a white border to an image?', answer: 'Upload your photo to ISHU TOOLS, choose border size, and download your image with a clean white border for free.' },
    ],
  },
  'add-border-to-photo': {
    title: 'Add Border to Photo Online Free — Custom Frame | ISHU TOOLS',
    description: 'Add a colored border frame around your image online for free. Choose width and color for a customized photo border effect. No signup required.',
    keywords: ['add border to photo', 'photo border online', 'image frame free', 'add border image', 'custom border photo', 'ishu tools border photo', 'photo frame generator free'],
    h1: 'Add Border to Photo — Custom Frame Online Free',
    faq: [
      { question: 'How do I add a border to a photo?', answer: 'Upload your image to ISHU TOOLS Add Border tool, choose color and width, and download your framed photo for free.' },
    ],
  },
  'freehand-crop': {
    title: 'Freehand Crop Image Online Free — Custom Crop Tool | ISHU TOOLS',
    description: 'Crop any rectangular area from an image with custom x1,y1 to x2,y2 coordinates online for free. Precise cropping for image editing and document preparation.',
    keywords: ['freehand crop', 'custom crop image', 'precise image crop', 'coordinate crop photo', 'rectangle crop free', 'ishu tools freehand crop', 'crop image coordinates'],
    h1: 'Freehand Crop Image — Precise Custom Crop Free',
    faq: [
      { question: 'How do I do a precise freehand crop?', answer: 'Upload your image to ISHU TOOLS Freehand Crop, specify x1,y1 and x2,y2 coordinates for your crop region, and download.' },
    ],
  },
  'crop-png': {
    title: 'Crop PNG Online Free — PNG Image Cropper | ISHU TOOLS',
    description: 'Crop PNG images with custom crop coordinates online for free. Trim PNG files precisely for web design, icons, and transparent image editing.',
    keywords: ['crop png', 'png cropper', 'crop png online free', 'trim png image', 'png image crop', 'ishu tools crop png', 'png editing free'],
    h1: 'Crop PNG — PNG Image Cropper Online Free',
    faq: [
      { question: 'How do I crop a PNG image online?', answer: 'Upload your PNG to ISHU TOOLS PNG Cropper, enter crop coordinates, and download the cropped PNG with transparency preserved.' },
    ],
  },
  'a4-size-resize': {
    title: 'Resize Image to A4 Size Online Free — Print Ready | ISHU TOOLS',
    description: 'Resize any image to A4 size (21×29.7cm) at 300 DPI for printing online for free. Perfect for documents, certificates, and print-ready photos in India.',
    keywords: ['resize image a4', 'image a4 size', 'a4 size image converter', 'photo a4 format', 'a4 print ready image', 'ishu tools a4 resize', 'image to a4 india'],
    h1: 'Resize Image to A4 Size Online Free',
    faq: [
      { question: 'How do I resize an image to A4 size?', answer: 'Upload your image to ISHU TOOLS A4 Resize tool and download it resized to 21x29.7cm at 300 DPI for printing for free.' },
    ],
  },
  'social-media-resize': {
    title: 'Social Media Image Resizer Online Free — All Platforms | ISHU TOOLS',
    description: 'Resize images to perfect dimensions for Instagram, YouTube, Facebook, Twitter, LinkedIn, and WhatsApp online for free. Get platform-specific sizes instantly.',
    keywords: ['social media image resizer', 'resize image for social media', 'instagram image size', 'youtube image size', 'facebook image size', 'ishu tools social media resize', 'social media photo free'],
    h1: 'Social Media Image Resizer — All Platforms Free',
    faq: [
      { question: 'How do I resize images for social media?', answer: 'Upload your image to ISHU TOOLS Social Media Resizer, select your platform (Instagram, YouTube, Facebook, etc.), and download the correctly sized image.' },
    ],
  },
  'resize-for-instagram': {
    title: 'Resize Image for Instagram Free — 1080x1080 Square Photo | ISHU TOOLS',
    description: 'Resize your photo to Instagram-perfect 1080x1080px with smart crop online for free. Create square Instagram posts without cropping important parts of your photo.',
    keywords: ['resize image for instagram', 'instagram photo size', 'instagram square crop', '1080x1080 image resizer', 'instagram post size', 'ishu tools instagram resize', 'instagram image free india'],
    h1: 'Resize Image for Instagram — 1080x1080px Free',
    faq: [
      { question: 'What size is an Instagram post image?', answer: 'Instagram recommends 1080x1080px for square posts. ISHU TOOLS resizes your photo to this exact size with smart cropping.' },
    ],
  },
  'resize-for-whatsapp': {
    title: 'WhatsApp DP Maker Online Free — Resize Profile Photo | ISHU TOOLS',
    description: 'Resize your image to WhatsApp display picture size (192x192px) online for free. Create the perfect WhatsApp profile photo instantly. No signup required.',
    keywords: ['whatsapp dp maker', 'resize image whatsapp dp', 'whatsapp profile photo size', 'whatsapp dp maker free', 'whatsapp dp resize', 'ishu tools whatsapp dp', 'whatsapp photo size india'],
    h1: 'WhatsApp DP Maker — Resize Profile Photo Free',
    faq: [
      { question: 'What is the WhatsApp profile picture size?', answer: 'WhatsApp displays profile pictures at 192x192px. ISHU TOOLS resizes your photo to this size for the perfect WhatsApp DP.' },
    ],
  },
  'resize-for-youtube': {
    title: 'YouTube Banner Resize Online Free — Channel Art Size | ISHU TOOLS',
    description: 'Resize your image to YouTube channel art/banner dimensions (2560x1440px) online for free. Create a professional YouTube banner easily. No signup required.',
    keywords: ['youtube banner resize', 'youtube channel art size', 'resize image youtube banner', 'youtube channel banner maker', '2560x1440 image', 'ishu tools youtube banner', 'youtube banner free india'],
    h1: 'YouTube Banner Resize — Channel Art Free',
    faq: [
      { question: 'What is the YouTube banner size?', answer: 'YouTube recommends 2560x1440px for channel art banners. ISHU TOOLS resizes your image to this exact size for free.' },
    ],
  },
  'instagram-grid': {
    title: 'Instagram Grid Maker Online Free — Split Photo for Profile | ISHU TOOLS',
    description: 'Split a single image into a 3×3 or custom grid for seamless Instagram layout posts online for free. Create a perfect Instagram profile grid arrangement.',
    keywords: ['instagram grid maker', 'instagram photo grid', 'split image grid instagram', 'instagram 9 grid', 'instagram profile grid', 'ishu tools instagram grid', 'instagram layout maker free'],
    h1: 'Instagram Grid Maker — Split Image for Profile Free',
    faq: [
      { question: 'How do I make an Instagram photo grid?', answer: 'Upload your image to ISHU TOOLS Instagram Grid Maker, choose 3×3 or custom grid, and download all tiles to post in sequence.' },
    ],
  },
  'image-splitter': {
    title: 'Image Splitter Online Free — Split Image into Grid Tiles | ISHU TOOLS',
    description: 'Split any image into a custom row and column grid online for free. Download all tiles as a ZIP file. Perfect for Instagram grids, puzzles, and multi-panel designs.',
    keywords: ['image splitter', 'split image grid', 'image tile splitter', 'divide image sections', 'image grid splitter free', 'ishu tools image splitter', 'photo splitter online'],
    h1: 'Image Splitter — Split Into Grid Tiles Free',
    faq: [
      { question: 'How do I split an image into tiles?', answer: 'Upload your image to ISHU TOOLS Image Splitter, choose rows and columns, and download all grid tiles as a ZIP for free.' },
    ],
  },
  'resize-image-pixel': {
    title: 'Resize Image by Pixel Online Free — Exact Pixel Resize | ISHU TOOLS',
    description: 'Resize image precisely to target width and height in pixels online for free. Set exact pixel dimensions for web, print, and form requirements. No signup needed.',
    keywords: ['resize image by pixel', 'pixel image resizer', 'exact pixel resize', 'image pixel dimensions', 'resize photo pixels free', 'ishu tools pixel resize', 'image resolution resize'],
    h1: 'Resize Image by Pixel — Exact Dimensions Free',
    faq: [
      { question: 'How do I resize an image to exact pixels?', answer: 'Upload your image to ISHU TOOLS Pixel Resizer, enter target width and height in pixels, and download the precisely resized image.' },
    ],
  },
  'resize-signature': {
    title: 'Resize Signature Online Free — For Exam Forms | ISHU TOOLS',
    description: 'Resize signature image to exact dimensions for exam forms, applications, and official documents online for free. Required for SSC, UPSC, RRB, and bank portals in India.',
    keywords: ['resize signature', 'signature resize online', 'exam form signature size', 'signature image resizer', 'resize signature free', 'ishu tools resize signature', 'signature size india exam'],
    h1: 'Resize Signature — Exact Dimensions for Exam Forms Free',
    faq: [
      { question: 'How do I resize a signature for an exam form?', answer: 'Upload your signature image to ISHU TOOLS, enter the required dimensions, and download the perfectly sized signature for free.' },
    ],
  },
  'resize-image-to-3.5cmx4.5cm': {
    title: 'Resize Image to 3.5cm x 4.5cm Online Free — Passport Size | ISHU TOOLS',
    description: 'Resize photo to 3.5cm x 4.5cm at printable DPI online for free. Standard passport/ID photo size for India, UK, and international applications.',
    keywords: ['resize image 3.5cm 4.5cm', 'passport size photo 3.5x4.5', '3.5cm x 4.5cm photo', 'passport photo size india', 'id photo 3.5 4.5', 'ishu tools passport size', 'resize passport photo india'],
    h1: 'Resize Image to 3.5cm × 4.5cm — Passport Size Free',
    faq: [
      { question: 'What is 3.5cm x 4.5cm photo size?', answer: '3.5cm x 4.5cm is the standard passport photo size used in India. ISHU TOOLS resizes your photo to this exact size at the correct DPI for free.' },
    ],
  },
  'resize-image-to-6cmx2cm': {
    title: 'Resize Image to 6cm x 2cm Online Free — Signature Size | ISHU TOOLS',
    description: 'Resize image to 6cm x 2cm dimensions at target DPI online for free. Standard signature size for many Indian government exam forms.',
    keywords: ['resize image 6cm 2cm', 'signature 6x2cm', '6cm x 2cm photo', 'signature size 6cm 2cm', 'ishu tools 6cm 2cm', 'exam form signature size india'],
    h1: 'Resize Image to 6cm × 2cm Free — Signature Size',
    faq: [
      { question: 'What is 6cm x 2cm used for?', answer: '6cm x 2cm is the standard signature size for many Indian government recruitment forms. Resize your signature image to this exact size using ISHU TOOLS.' },
    ],
  },
  'resize-signature-to-50mmx20mm': {
    title: 'Resize Signature to 50mm x 20mm Online Free | ISHU TOOLS',
    description: 'Resize signature image to 50mm x 20mm dimensions for exam and government forms online for free. Standard exam signature size in India.',
    keywords: ['resize signature 50mm 20mm', 'signature 50x20mm', 'exam signature size', '50mm 20mm signature', 'ishu tools signature resize', 'exam form signature india'],
    h1: 'Resize Signature to 50mm × 20mm Free',
    faq: [
      { question: 'What is the 50mm x 20mm signature size for?', answer: '50mm x 20mm is the standard signature size required by many Indian competitive exams including RRB, SSC, and IBPS. Resize for free using ISHU TOOLS.' },
    ],
  },
  'resize-image-to-35mmx45mm': {
    title: 'Resize Image to 35mm x 45mm Online Free — Passport Photo | ISHU TOOLS',
    description: 'Resize image to 35mm x 45mm passport photo dimensions online for free. Standard UK, EU, and international passport photo size.',
    keywords: ['resize image 35mm 45mm', 'passport photo 35x45mm', '35mm x 45mm photo', 'uk passport photo size', 'eu passport size', 'ishu tools 35mm 45mm', 'international passport photo'],
    h1: 'Resize Image to 35mm × 45mm — Passport Size Free',
    faq: [
      { question: 'What is 35mm x 45mm photo size?', answer: '35mm x 45mm is the standard passport photo size for UK, EU, and many international applications. Resize your photo to this size for free on ISHU TOOLS.' },
    ],
  },
  'resize-image-to-2x2': {
    title: 'Resize Image to 2x2 Inch Online Free — US Passport Size | ISHU TOOLS',
    description: 'Resize image to 2x2 inch dimensions for US passport, visa, and ID applications online for free. Standard American passport photo size.',
    keywords: ['resize image 2x2 inch', '2x2 inch photo online', 'us passport photo size', '2 inch photo', 'ishu tools 2x2 photo', 'american passport photo free'],
    h1: 'Resize Image to 2x2 Inch — US Passport Size Free',
    faq: [
      { question: 'What is the US passport photo size?', answer: 'The US passport photo size is 2x2 inches (51x51mm). ISHU TOOLS resizes your photo to this exact size for free.' },
    ],
  },
  'resize-image-to-3x4': {
    title: 'Resize Image to 3x4 Inch Online Free — Photo Resize Tool | ISHU TOOLS',
    description: 'Resize image to 3x4 inch photo dimensions online for free. Common portrait and ID photo size for various applications and documents.',
    keywords: ['resize image 3x4 inch', '3x4 photo size', 'portrait photo 3x4', 'ishu tools 3x4 photo', '3 inch 4 inch photo free'],
    h1: 'Resize Image to 3x4 Inch Free',
    faq: [
      { question: 'What is 3x4 inch photo size used for?', answer: '3x4 inch is a common portrait photo format used for various ID applications and documents. Resize any image to this size for free on ISHU TOOLS.' },
    ],
  },
  'resize-image-to-4x6': {
    title: 'Resize Image to 4x6 Inch Online Free — Print Size | ISHU TOOLS',
    description: 'Resize image to 4x6 inch print dimensions online for free. Standard print photo size for photo labs and home printing.',
    keywords: ['resize image 4x6 inch', '4x6 photo print size', 'photo print size resize', 'ishu tools 4x6 photo', 'standard photo print size', '4x6 image free'],
    h1: 'Resize Image to 4x6 Inch — Print Size Free',
    faq: [
      { question: 'What is 4x6 inch photo used for?', answer: '4x6 inch is the standard photo print size. Resize your image to 4x6 inches for free on ISHU TOOLS for printing at photo labs or home printers.' },
    ],
  },
  'resize-image-to-600x600-pixel': {
    title: 'Resize Image to 600x600 Pixels Online Free — Square Photo | ISHU TOOLS',
    description: 'Resize image to exactly 600x600 pixels online for free. Common product photo and profile picture size for e-commerce and online platforms.',
    keywords: ['resize image 600x600', '600x600 pixels photo', 'square 600px image', 'product photo 600x600', 'ishu tools 600x600 resize', '600 pixel photo free'],
    h1: 'Resize Image to 600×600 Pixels Free',
    faq: [
      { question: 'When do I need a 600x600 pixel image?', answer: '600x600px is commonly required for product photos, profile pictures, and e-commerce platform uploads. Resize any image for free on ISHU TOOLS.' },
    ],
  },
  'resize-image-for-whatsapp-dp': {
    title: 'Resize Image for WhatsApp DP Online Free — Profile Photo | ISHU TOOLS',
    description: 'Resize your image to WhatsApp display picture format online for free. Create the perfect circular-ready WhatsApp profile photo instantly.',
    keywords: ['whatsapp dp maker', 'resize image whatsapp', 'whatsapp profile photo resize', 'whatsapp dp photo free', 'ishu tools whatsapp dp', 'whatsapp dp india'],
    h1: 'Resize Image for WhatsApp DP Free',
    faq: [
      { question: 'How do I make a WhatsApp DP photo?', answer: 'Upload your image to ISHU TOOLS WhatsApp DP Resizer and download it resized to the perfect WhatsApp profile photo size for free.' },
    ],
  },
  'resize-image-for-youtube-banner': {
    title: 'Resize Image for YouTube Banner Online Free — Channel Art | ISHU TOOLS',
    description: 'Resize image to YouTube banner/channel art size (2560x1440px) online for free. Create a professional-looking YouTube channel banner quickly.',
    keywords: ['youtube banner maker', 'resize image youtube banner', 'youtube channel art resize', 'youtube banner size free', 'ishu tools youtube banner', 'youtube banner india'],
    h1: 'Resize Image for YouTube Banner Free',
    faq: [
      { question: 'What size is a YouTube banner?', answer: 'YouTube recommends 2560x1440px for channel art. ISHU TOOLS resizes your image to the correct YouTube banner dimensions for free.' },
    ],
  },
  'resize-image-to-a4-size': {
    title: 'Resize Image to A4 Size Online Free — Print Ready Photo | ISHU TOOLS',
    description: 'Resize any image to A4 dimensions (2480x3508 pixels at 300 DPI) for printing online for free. Perfect for certificates, documents, and print-ready photos.',
    keywords: ['resize image a4 size', 'a4 image resizer', 'a4 photo size', 'print ready a4 image', 'ishu tools a4 size', 'a4 size photo free india'],
    h1: 'Resize Image to A4 Size — Print Ready Free',
    faq: [
      { question: 'How do I resize an image to A4 size?', answer: 'Upload your image to ISHU TOOLS A4 Size tool and download it resized to 2480x3508 pixels at 300 DPI — ready for printing.' },
    ],
  },
  'bulk-image-resizer': {
    title: 'Bulk Image Resizer Online Free — Resize Multiple Images | ISHU TOOLS',
    description: 'Resize multiple images to the same dimensions in one batch online for free. Upload images, set target size, and download all resized images as a ZIP.',
    keywords: ['bulk image resizer', 'resize multiple images', 'batch image resizer free', 'bulk photo resize', 'resize many images', 'ishu tools bulk resize', 'batch resize images online'],
    h1: 'Bulk Image Resizer — Resize Multiple Images Free',
    faq: [
      { question: 'Can I resize multiple images at once?', answer: 'Yes! ISHU TOOLS Bulk Image Resizer lets you upload multiple images and resize them all to the same dimensions in one go, downloadable as ZIP.' },
    ],
  },
  'psc-photo-resize': {
    title: 'PSC Photo Resize Online Free — State PSC Form Photo | ISHU TOOLS',
    description: 'Resize photo to PSC (Public Service Commission) form dimensions and DPI online for free. Perfect for state PSC exam applications in India.',
    keywords: ['psc photo resize', 'state psc exam photo', 'psc form photo size', 'public service commission photo', 'ishu tools psc photo', 'psc exam photo india', 'state psc photo size'],
    h1: 'PSC Photo Resize — State PSC Form Photo Free',
    faq: [
      { question: 'What size photo is required for PSC exams?', answer: 'PSC exam photo requirements vary by state. ISHU TOOLS PSC Photo Resizer creates photos at the standard PSC dimensions and DPI for free.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  FORMAT LAB TOOLS
  // ════════════════════════════════════════════════
  'jpeg-to-png': {
    title: 'JPEG to PNG Online Free — High Quality Conversion | ISHU TOOLS',
    description: 'Convert JPEG/JPG images to PNG format with high fidelity online for free. Get transparent-background-ready PNG from any JPEG. No signup, no watermark.',
    keywords: ['jpeg to png', 'jpg to png converter', 'convert jpeg png free', 'jpeg png online', 'ishu tools jpeg to png', 'jpg png conversion india', 'jpeg png free converter'],
    h1: 'JPEG to PNG Converter Online Free',
    faq: [
      { question: 'How do I convert JPEG to PNG?', answer: 'Upload your JPEG to ISHU TOOLS and download a high-quality PNG version for free — no signup required.' },
    ],
  },
  'png-to-jpeg': {
    title: 'PNG to JPEG Online Free — Convert PNG Images | ISHU TOOLS',
    description: 'Convert PNG images to JPEG format with quality control online for free. Reduce PNG file size by converting to JPEG. No signup, no watermark required.',
    keywords: ['png to jpeg', 'png to jpg converter', 'convert png jpeg free', 'png jpeg online', 'ishu tools png to jpeg', 'png jpg conversion india'],
    h1: 'PNG to JPEG Converter Online Free',
    faq: [
      { question: 'How do I convert PNG to JPEG?', answer: 'Upload your PNG to ISHU TOOLS and download a JPEG version with your preferred quality setting for free.' },
    ],
  },
  'jpeg-to-jpg': {
    title: 'JPEG to JPG Online Free — Normalize JPEG Files | ISHU TOOLS',
    description: 'Normalize JPEG files into optimized JPG output online for free. Convert .jpeg extension to .jpg format with quality optimization.',
    keywords: ['jpeg to jpg', 'normalize jpeg jpg', 'jpeg jpg converter', 'jpeg to jpg online', 'ishu tools jpeg jpg', 'jpg jpeg convert free'],
    h1: 'JPEG to JPG Converter Online Free',
    faq: [
      { question: 'What is the difference between JPEG and JPG?', answer: 'JPEG and JPG are the same format — only the file extension differs. ISHU TOOLS normalizes your .jpeg file to an optimized .jpg for free.' },
    ],
  },
  'jpeg-to-pdf': {
    title: 'JPEG to PDF Online Free — Convert JPEG Images to PDF | ISHU TOOLS',
    description: 'Convert one or more JPEG images into a PDF document online for free. Create a multi-page PDF from JPEG photos instantly. No signup, no watermark.',
    keywords: ['jpeg to pdf', 'convert jpeg to pdf', 'jpeg pdf converter', 'jpeg to pdf online', 'multiple jpeg pdf', 'ishu tools jpeg to pdf', 'jpeg pdf free india'],
    h1: 'JPEG to PDF Converter Online Free',
    faq: [
      { question: 'How do I convert JPEG to PDF?', answer: 'Upload your JPEG files to ISHU TOOLS and download them as a PDF document instantly for free.' },
    ],
  },
  'jpg-to-pdf-under-50kb': {
    title: 'JPG to PDF Under 50KB Online Free — Compressed PDF | ISHU TOOLS',
    description: 'Convert JPG to PDF while targeting a file size under 50KB online for free. Perfect for email attachments and portals with PDF size limits.',
    keywords: ['jpg to pdf under 50kb', 'compressed jpg pdf 50kb', 'small pdf from jpg', 'jpg pdf 50kb', 'ishu tools jpg pdf 50kb', 'compact pdf from jpg free'],
    h1: 'JPG to PDF Under 50KB Free',
    faq: [
      { question: 'How do I convert JPG to a PDF under 50KB?', answer: 'Upload your JPG to ISHU TOOLS JPG to PDF Under 50KB converter and get a compressed PDF under 50KB for free.' },
    ],
  },
  'jpg-to-pdf-under-100kb': {
    title: 'JPG to PDF Under 100KB Online Free — Small Compressed PDF | ISHU TOOLS',
    description: 'Convert JPG to PDF with output file size under 100KB online for free. Great for applications and portals requiring compact PDF documents.',
    keywords: ['jpg to pdf under 100kb', 'small jpg to pdf', '100kb pdf from jpg', 'jpg pdf compact', 'ishu tools jpg pdf 100kb', 'jpg to compressed pdf free'],
    h1: 'JPG to PDF Under 100KB Free',
    faq: [
      { question: 'How do I create a JPG PDF under 100KB?', answer: 'Upload your JPG to ISHU TOOLS and download a compressed PDF under 100KB for free — perfect for form submissions.' },
    ],
  },
  'jpeg-to-pdf-under-200kb': {
    title: 'JPEG to PDF Under 200KB Online Free — Compressed PDF | ISHU TOOLS',
    description: 'Convert JPEG to PDF with output under 200KB online for free. Perfect for email, applications, and portals with PDF file size limits.',
    keywords: ['jpeg to pdf under 200kb', '200kb pdf from jpeg', 'compressed jpeg pdf', 'ishu tools jpeg pdf 200kb', 'compact pdf free'],
    h1: 'JPEG to PDF Under 200KB Free',
    faq: [
      { question: 'How do I get a JPEG as PDF under 200KB?', answer: 'Upload your JPEG to ISHU TOOLS and download a compressed PDF under 200KB for free.' },
    ],
  },
  'jpg-to-pdf-under-300kb': {
    title: 'JPG to PDF Under 300KB Online Free | ISHU TOOLS',
    description: 'Convert JPG to PDF targeting a file size under 300KB online for free. Great for applications needing compact PDF files.',
    keywords: ['jpg to pdf 300kb', '300kb pdf jpg', 'compressed pdf 300kb', 'ishu tools jpg pdf 300kb', 'small pdf free'],
    h1: 'JPG to PDF Under 300KB Free',
    faq: [{ question: 'How do I make a JPG PDF under 300KB?', answer: 'Upload your JPG to ISHU TOOLS and get a compressed PDF under 300KB for free.' }],
  },
  'jpg-to-pdf-under-500kb': {
    title: 'JPG to PDF Under 500KB Online Free | ISHU TOOLS',
    description: 'Convert JPG to PDF targeting a file size under 500KB online for free. Upload your image and get a compressed PDF for applications and portals.',
    keywords: ['jpg to pdf 500kb', '500kb pdf jpg', 'compressed pdf 500kb', 'ishu tools jpg pdf 500kb'],
    h1: 'JPG to PDF Under 500KB Free',
    faq: [{ question: 'How do I make a JPG PDF under 500KB?', answer: 'Upload your JPG to ISHU TOOLS and get a compact PDF under 500KB for free.' }],
  },
  'eml-to-pdf': {
    title: 'EML to PDF Online Free — Convert Email to PDF | ISHU TOOLS',
    description: 'Convert EML email message files into PDF documents online for free. Archive emails as PDF for record-keeping and sharing. No signup required.',
    keywords: ['eml to pdf', 'email to pdf', 'convert eml pdf', 'email message pdf', 'ishu tools eml pdf', 'email archive pdf free'],
    h1: 'EML to PDF Converter Online Free',
    faq: [
      { question: 'How do I convert an EML email to PDF?', answer: 'Upload your EML file to ISHU TOOLS and download it as a readable PDF document for free.' },
    ],
  },
  'heif-to-pdf': {
    title: 'HEIF to PDF Online Free — Convert HEIF Images | ISHU TOOLS',
    description: 'Convert HEIF images into PDF documents online for free. HEIF is the default format on iPhones. Convert iPhone photos to PDF easily.',
    keywords: ['heif to pdf', 'heif image pdf', 'iphone photo to pdf', 'convert heif pdf', 'ishu tools heif pdf', 'heif to pdf free'],
    h1: 'HEIF to PDF Converter Online Free',
    faq: [
      { question: 'What is HEIF format?', answer: 'HEIF is the default image format on modern iPhones. ISHU TOOLS converts HEIF images to PDF for free without any software.' },
    ],
  },
  'jfif-to-pdf': {
    title: 'JFIF to PDF Online Free — Convert JFIF Images | ISHU TOOLS',
    description: 'Convert JFIF images into PDF documents online for free. JFIF is a variant of JPEG format. Convert easily without any software.',
    keywords: ['jfif to pdf', 'convert jfif pdf', 'jfif image pdf', 'ishu tools jfif pdf', 'jfif to pdf free'],
    h1: 'JFIF to PDF Converter Online Free',
    faq: [
      { question: 'What is JFIF format?', answer: 'JFIF (JPEG File Interchange Format) is a variant of JPEG. ISHU TOOLS converts JFIF images to PDF for free.' },
    ],
  },
  'djvu-to-pdf': {
    title: 'DjVu to PDF Online Free — Convert DjVu Documents | ISHU TOOLS',
    description: 'Convert DjVu documents into PDF format online for free. DjVu is common for scanned books and academic documents. No signup required.',
    keywords: ['djvu to pdf', 'djvu pdf converter', 'convert djvu pdf', 'djvu document to pdf', 'ishu tools djvu pdf', 'djvu pdf free'],
    h1: 'DjVu to PDF Converter Online Free',
    faq: [
      { question: 'What is DjVu format?', answer: 'DjVu is a format commonly used for scanned books and academic documents. ISHU TOOLS converts DjVu to PDF for free.' },
    ],
  },
  'ai-to-pdf': {
    title: 'AI to PDF Online Free — Convert Adobe Illustrator Files | ISHU TOOLS',
    description: 'Convert Adobe Illustrator AI files into PDF documents online for free. Share AI vector designs as universally readable PDF files without Adobe software.',
    keywords: ['ai to pdf', 'adobe illustrator to pdf', 'ai file pdf converter', 'illustrator pdf free', 'ishu tools ai pdf', 'vector to pdf free'],
    h1: 'AI to PDF Converter Online Free',
    faq: [
      { question: 'How do I convert an Adobe Illustrator AI file to PDF?', answer: 'Upload your AI file to ISHU TOOLS and download it as a PDF for free without needing Adobe software.' },
    ],
  },
  'xps-to-pdf': {
    title: 'XPS to PDF Online Free — Convert XPS Documents | ISHU TOOLS',
    description: 'Convert XPS documents into PDF format online for free. XPS is Microsoft\'s document format. Convert XPS to universally compatible PDF.',
    keywords: ['xps to pdf', 'convert xps pdf', 'xps document pdf', 'microsoft xps pdf', 'ishu tools xps pdf', 'xps pdf converter free'],
    h1: 'XPS to PDF Converter Online Free',
    faq: [
      { question: 'What is XPS format?', answer: 'XPS (XML Paper Specification) is a document format from Microsoft. ISHU TOOLS converts XPS to PDF for free.' },
    ],
  },
  'hwp-to-pdf': {
    title: 'HWP to PDF Online Free — Convert Hangul Documents | ISHU TOOLS',
    description: 'Convert Hangul HWP word processor documents into PDF format online for free. Convert Korean HWP files to universally compatible PDF.',
    keywords: ['hwp to pdf', 'hangul to pdf', 'hwp document pdf', 'korean hwp pdf', 'ishu tools hwp pdf', 'hwp pdf free'],
    h1: 'HWP to PDF Converter Online Free',
    faq: [
      { question: 'What is HWP format?', answer: 'HWP is the native format of Hangul, a popular Korean word processor. ISHU TOOLS converts HWP to PDF for free.' },
    ],
  },
  'chm-to-pdf': {
    title: 'CHM to PDF Online Free — Convert Windows Help Files | ISHU TOOLS',
    description: 'Convert Windows CHM compiled help files into PDF documents online for free. Archive and share CHM documentation as accessible PDF files.',
    keywords: ['chm to pdf', 'windows help chm pdf', 'chm file converter', 'compiled html help pdf', 'ishu tools chm pdf', 'chm pdf free'],
    h1: 'CHM to PDF Converter Online Free',
    faq: [
      { question: 'What is CHM format?', answer: 'CHM (Compiled HTML Help) is a Microsoft format for documentation and help files. ISHU TOOLS converts CHM to PDF for free.' },
    ],
  },
  'pages-to-pdf': {
    title: 'PAGES to PDF Online Free — Convert Apple Pages Files | ISHU TOOLS',
    description: 'Convert Apple Pages documents into PDF format online for free. Share Mac and iOS Pages documents as universally compatible PDF without Apple software.',
    keywords: ['pages to pdf', 'apple pages to pdf', 'pages file pdf', 'mac pages pdf', 'ios pages pdf', 'ishu tools pages pdf', 'apple document pdf free'],
    h1: 'PAGES to PDF Converter Online Free',
    faq: [
      { question: 'How do I convert Apple Pages to PDF?', answer: 'Upload your Apple Pages file to ISHU TOOLS and download it as a PDF for free — no Apple software required.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  EBOOK CONVERT TOOLS
  // ════════════════════════════════════════════════
  'fb2-to-pdf': {
    title: 'FB2 to PDF Online Free — Convert FB2 eBook | ISHU TOOLS',
    description: 'Convert FB2 eBook files into PDF documents online for free. FB2 is popular for Russian e-books. Convert to PDF for universal reading.',
    keywords: ['fb2 to pdf', 'fb2 ebook pdf', 'convert fb2 pdf', 'russian ebook pdf', 'ishu tools fb2 pdf', 'fb2 pdf free'],
    h1: 'FB2 to PDF Converter Online Free',
    faq: [
      { question: 'What is FB2 format?', answer: 'FB2 is a popular eBook format, especially for Russian literature. ISHU TOOLS converts FB2 to PDF for free.' },
    ],
  },
  'cbz-to-pdf': {
    title: 'CBZ to PDF Online Free — Convert Comic Book ZIP | ISHU TOOLS',
    description: 'Convert CBZ comic book ZIP archives into PDF documents online for free. Read comic books in PDF format on any device.',
    keywords: ['cbz to pdf', 'comic book cbz pdf', 'cbz pdf converter', 'comic archive to pdf', 'ishu tools cbz pdf', 'cbz pdf free'],
    h1: 'CBZ to PDF Converter Online Free',
    faq: [
      { question: 'What is CBZ format?', answer: 'CBZ is a comic book format — a ZIP archive of images. ISHU TOOLS converts CBZ to PDF so you can read comics on any device.' },
    ],
  },
  'ebook-to-pdf': {
    title: 'eBook to PDF Online Free — Convert EPUB, FB2, CBZ | ISHU TOOLS',
    description: 'Convert supported eBook formats (EPUB, FB2, CBZ) to PDF documents online for free. One universal eBook converter for students and readers.',
    keywords: ['ebook to pdf', 'epub to pdf', 'ebook converter pdf', 'convert ebook pdf free', 'ishu tools ebook pdf', 'ebook pdf converter india'],
    h1: 'eBook to PDF Converter Online Free',
    faq: [
      { question: 'What eBook formats does ISHU TOOLS support?', answer: 'ISHU TOOLS eBook to PDF converter supports EPUB, FB2, CBZ, and other common eBook formats for free.' },
    ],
  },
  'pdf-to-mobi': {
    title: 'PDF to MOBI Online Free — Convert PDF for Kindle | ISHU TOOLS',
    description: 'Convert PDF documents into MOBI format for Kindle e-readers online for free. Read your PDFs on Kindle devices with better formatting.',
    keywords: ['pdf to mobi', 'pdf kindle converter', 'pdf to mobi free', 'kindle ebook pdf', 'ishu tools pdf mobi', 'pdf kindle format'],
    h1: 'PDF to MOBI Converter Online Free',
    faq: [
      { question: 'How do I convert PDF to MOBI for Kindle?', answer: 'Upload your PDF to ISHU TOOLS and download it as a MOBI file for free — compatible with Kindle e-readers.' },
    ],
  },
  'mobi-to-pdf': {
    title: 'MOBI to PDF Online Free — Convert Kindle eBook | ISHU TOOLS',
    description: 'Convert MOBI e-books into PDF documents online for free. Share Kindle books as PDF for universal reading on any device.',
    keywords: ['mobi to pdf', 'kindle to pdf', 'mobi pdf converter', 'convert mobi pdf free', 'ishu tools mobi pdf', 'kindle book to pdf'],
    h1: 'MOBI to PDF Converter Online Free',
    faq: [
      { question: 'How do I convert a MOBI file to PDF?', answer: 'Upload your MOBI file to ISHU TOOLS and download it as a universally compatible PDF for free.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  ARCHIVE & VECTOR TOOLS
  // ════════════════════════════════════════════════
  'zip-to-pdf': {
    title: 'ZIP to PDF Online Free — Convert ZIP Images to PDF | ISHU TOOLS',
    description: 'Convert ZIP archives of ordered images into a single PDF document online for free. Batch convert image collections to PDF instantly.',
    keywords: ['zip to pdf', 'zip images pdf', 'archive to pdf', 'convert zip pdf free', 'ishu tools zip pdf', 'image zip to pdf'],
    h1: 'ZIP to PDF Converter Online Free',
    faq: [
      { question: 'How do I convert ZIP images to PDF?', answer: 'Upload your ZIP file containing images to ISHU TOOLS and download a single PDF with all images as pages for free.' },
    ],
  },
  'cbr-to-pdf': {
    title: 'CBR to PDF Online Free — Convert Comic Book Archive | ISHU TOOLS',
    description: 'Convert CBR comic book archives (RAR-based) into single PDF documents online for free. Read comic books in PDF on any device.',
    keywords: ['cbr to pdf', 'comic cbr pdf', 'cbr pdf converter', 'rar comic to pdf', 'ishu tools cbr pdf', 'comic archive pdf free'],
    h1: 'CBR to PDF Converter Online Free',
    faq: [
      { question: 'What is CBR format?', answer: 'CBR is a comic book format using RAR compression. ISHU TOOLS converts CBR to PDF for free so you can read comics on any device.' },
    ],
  },
  'dwg-to-pdf': {
    title: 'DWG to PDF Online Free — Convert AutoCAD Drawings | ISHU TOOLS',
    description: 'Convert AutoCAD DWG drawings into PDF documents online for free. Share CAD drawings as universally readable PDF without AutoCAD software.',
    keywords: ['dwg to pdf', 'autocad to pdf', 'cad drawing pdf', 'dwg pdf converter', 'ishu tools dwg pdf', 'autocad pdf free', 'engineering drawing pdf'],
    h1: 'DWG to PDF Converter — AutoCAD Drawings Free',
    faq: [
      { question: 'How do I convert DWG to PDF without AutoCAD?', answer: 'Upload your DWG file to ISHU TOOLS and download it as a PDF for free — no AutoCAD software required.' },
    ],
  },
  'dxf-to-pdf': {
    title: 'DXF to PDF Online Free — Convert AutoCAD DXF Files | ISHU TOOLS',
    description: 'Convert AutoCAD DXF drawings into PDF documents online for free. Share technical drawings as universally readable PDF without CAD software.',
    keywords: ['dxf to pdf', 'autocad dxf pdf', 'cad dxf pdf', 'dxf pdf converter', 'ishu tools dxf pdf', 'technical drawing pdf free'],
    h1: 'DXF to PDF Converter Online Free',
    faq: [
      { question: 'How do I convert a DXF file to PDF?', answer: 'Upload your DXF drawing to ISHU TOOLS and download it as a PDF for free — no CAD software needed.' },
    ],
  },
  'pub-to-pdf': {
    title: 'PUB to PDF Online Free — Convert Publisher Files | ISHU TOOLS',
    description: 'Convert Microsoft Publisher PUB files into PDF format online for free. Share Publisher designs as universally compatible PDF documents.',
    keywords: ['pub to pdf', 'publisher to pdf', 'microsoft pub pdf', 'convert pub pdf free', 'ishu tools pub pdf', 'publisher file to pdf'],
    h1: 'PUB to PDF Converter Online Free',
    faq: [
      { question: 'How do I convert a Publisher file to PDF?', answer: 'Upload your PUB file to ISHU TOOLS and download it as a PDF for free without Microsoft Publisher software.' },
    ],
  },
  'wps-to-pdf': {
    title: 'WPS to PDF Online Free — Convert WPS Office Documents | ISHU TOOLS',
    description: 'Convert WPS Office documents into PDF format online for free. Share WPS files created on mobile apps and Kingsoft Office as PDF.',
    keywords: ['wps to pdf', 'wps office pdf', 'convert wps pdf', 'kingsoft wps pdf', 'ishu tools wps pdf', 'wps document pdf free'],
    h1: 'WPS to PDF Converter Online Free',
    faq: [
      { question: 'How do I convert a WPS file to PDF?', answer: 'Upload your WPS document to ISHU TOOLS and download it as a universally readable PDF for free.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  UTILITY TOOLS
  // ════════════════════════════════════════════════
  'remove-metadata-image': {
    title: 'Remove Image Metadata Online Free — Strip EXIF Data | ISHU TOOLS',
    description: 'Strip EXIF metadata from images online for free. Remove GPS location, camera info, and personal data from photos before sharing. Privacy protection for images.',
    keywords: ['remove image metadata', 'strip exif data', 'exif remover free', 'remove photo metadata', 'strip gps photo', 'ishu tools remove exif', 'image privacy cleaner'],
    h1: 'Remove Image Metadata — Strip EXIF Data Free',
    faq: [
      { question: 'Why should I remove metadata from photos?', answer: 'Images contain EXIF metadata including GPS location, camera model, and personal info. ISHU TOOLS strips all metadata for privacy protection.' },
    ],
  },
  'view-metadata': {
    title: 'View Image Metadata Online Free — EXIF Viewer | ISHU TOOLS',
    description: 'View EXIF and technical metadata stored inside any image file online for free. See GPS coordinates, camera settings, date, and other metadata instantly.',
    keywords: ['view image metadata', 'exif viewer free', 'image metadata viewer', 'photo exif viewer', 'see image data', 'ishu tools exif viewer', 'photo metadata online'],
    h1: 'View Image Metadata — EXIF Viewer Free',
    faq: [
      { question: 'How do I view photo metadata?', answer: 'Upload your image to ISHU TOOLS EXIF Viewer and instantly see all stored metadata including GPS, camera settings, and timestamps for free.' },
    ],
  },
  'edit-metadata': {
    title: 'Edit Metadata Online Free — PDF & Image Metadata Editor | ISHU TOOLS',
    description: 'Edit metadata for PDF or image files online for free. Modify title, author, description, keywords, and other metadata from one unified editor.',
    keywords: ['edit metadata', 'pdf metadata editor', 'image metadata editor', 'edit exif data', 'change photo metadata', 'ishu tools edit metadata', 'metadata editor free'],
    h1: 'Edit Metadata — PDF & Image Metadata Editor Free',
    faq: [
      { question: 'How do I edit image or PDF metadata?', answer: 'Upload your file to ISHU TOOLS Metadata Editor, modify the metadata fields you want, and download the updated file for free.' },
    ],
  },
  'wifi-qr-generator': {
    title: 'Wi-Fi QR Code Generator Online Free — Guest Network QR | ISHU TOOLS',
    description: 'Create a Wi-Fi QR code from network name (SSID) and password online for free. Let guests connect instantly by scanning the QR. No signup required.',
    keywords: ['wifi qr generator', 'wi-fi qr code', 'wifi password qr', 'network qr generator', 'guest wifi qr', 'ishu tools wifi qr', 'wifi qr code free india'],
    h1: 'Wi-Fi QR Code Generator — Guest Connect Free',
    faq: [
      { question: 'How do I create a Wi-Fi QR code?', answer: 'Enter your network name (SSID) and password in ISHU TOOLS Wi-Fi QR Generator and download the QR code for guests to scan and connect instantly.' },
      { question: 'Is this Wi-Fi QR generator free?', answer: 'Yes, completely free. Generate as many Wi-Fi QR codes as you need with no signup or account required.' },
    ],
  },
  'phone-number-validator': {
    title: 'Phone Number Validator Online Free — India, US, UK | ISHU TOOLS',
    description: 'Validate phone numbers for India, US, UK, and more online for free. Detect country code, format, and carrier information. No signup required.',
    keywords: ['phone number validator', 'mobile number validator', 'phone validator india', 'validate phone number', 'international phone validator', 'ishu tools phone validator', 'indian mobile number validator'],
    h1: 'Phone Number Validator — India, US, UK Free',
    faq: [
      { question: 'How do I validate a phone number?', answer: 'Enter any phone number in ISHU TOOLS Phone Validator to check format, country code, and validity for free.' },
    ],
  },
  'email-validator': {
    title: 'Email Address Validator Online Free — Check Email Format | ISHU TOOLS',
    description: 'Validate email addresses for correct format, domain, and common issues online for free. Check if an email is valid before sending or signing up.',
    keywords: ['email validator', 'email address validator', 'check email valid', 'email format checker', 'validate email free', 'ishu tools email validator', 'email verification tool'],
    h1: 'Email Address Validator — Check Email Format Free',
    faq: [
      { question: 'How do I validate an email address?', answer: 'Enter any email address in ISHU TOOLS Email Validator to check its format, domain, and common errors for free.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  DEVELOPER TOOLS
  // ════════════════════════════════════════════════
  'url-encoder': {
    title: 'URL Encoder Online Free — Percent-Encode URLs | ISHU TOOLS',
    description: 'Encode text into URL-safe format using percent-encoding online for free. Encode special characters for URLs, query strings, and API calls. No signup needed.',
    keywords: ['url encoder', 'url encode online', 'percent encoding', 'encode url free', 'url safe encoding', 'ishu tools url encoder', 'url encode decode free'],
    h1: 'URL Encoder — Percent-Encode URLs Online Free',
    faq: [
      { question: 'How do I URL encode a string?', answer: 'Paste your text into ISHU TOOLS URL Encoder and get the percent-encoded URL-safe version instantly for free.' },
    ],
  },
  'url-decoder': {
    title: 'URL Decoder Online Free — Decode URL Encoded Strings | ISHU TOOLS',
    description: 'Decode URL-encoded strings back to readable text online for free. Convert percent-encoded URLs and query strings to human-readable format.',
    keywords: ['url decoder', 'url decode online', 'decode url free', 'percent decode url', 'url decode tool', 'ishu tools url decoder', 'url decode string'],
    h1: 'URL Decoder — Decode URL Strings Online Free',
    faq: [
      { question: 'How do I decode a URL?', answer: 'Paste your URL-encoded string into ISHU TOOLS URL Decoder and get the decoded readable text instantly for free.' },
    ],
  },
  'html-encoder': {
    title: 'HTML Encoder Online Free — Encode HTML Entities | ISHU TOOLS',
    description: 'Encode special characters to HTML entities online for free. Convert <, >, &, ", and \' to safe HTML entities for web display.',
    keywords: ['html encoder', 'html entity encoder', 'encode html free', 'html escape tool', 'special chars to html', 'ishu tools html encoder', 'html encoding online'],
    h1: 'HTML Encoder — Encode HTML Entities Online Free',
    faq: [
      { question: 'How do I encode HTML entities?', answer: 'Paste your text into ISHU TOOLS HTML Encoder and get HTML-safe encoded entities instantly for free.' },
    ],
  },
  'html-decoder': {
    title: 'HTML Decoder Online Free — Decode HTML Entities | ISHU TOOLS',
    description: 'Decode HTML entities back to readable characters online for free. Convert &amp;, &lt;, &gt; and other HTML entities to their original characters.',
    keywords: ['html decoder', 'html entity decoder', 'decode html entities free', 'html unescape', 'html decode tool', 'ishu tools html decoder', 'html decoding online'],
    h1: 'HTML Decoder — Decode HTML Entities Online Free',
    faq: [
      { question: 'How do I decode HTML entities?', answer: 'Paste your HTML with entities into ISHU TOOLS HTML Decoder and get the human-readable version instantly for free.' },
    ],
  },
  'jwt-decoder': {
    title: 'JWT Decoder Online Free — Decode JSON Web Tokens | ISHU TOOLS',
    description: 'Decode and inspect JSON Web Token (JWT) header, payload, and signature online for free. Debug JWT tokens for authentication and API development.',
    keywords: ['jwt decoder', 'json web token decoder', 'decode jwt free', 'jwt inspector', 'jwt token parser', 'ishu tools jwt decoder', 'jwt debug online', 'jwt tool developers'],
    h1: 'JWT Decoder — Decode JSON Web Tokens Free',
    faq: [
      { question: 'How do I decode a JWT token?', answer: 'Paste your JWT token into ISHU TOOLS JWT Decoder and see the decoded header, payload, and signature for free.' },
      { question: 'Is it safe to decode JWT online?', answer: 'ISHU TOOLS decodes JWT locally in your browser. Never decode tokens with sensitive production secrets on any online tool.' },
    ],
  },
  'unix-timestamp-converter': {
    title: 'Unix Timestamp Converter Online Free — Epoch to Date | ISHU TOOLS',
    description: 'Convert between Unix timestamps and human-readable dates online for free. Convert epoch time to date and date to Unix timestamp instantly.',
    keywords: ['unix timestamp converter', 'epoch to date', 'timestamp converter free', 'unix time converter', 'convert epoch timestamp', 'ishu tools timestamp', 'epoch timestamp online'],
    h1: 'Unix Timestamp Converter — Epoch to Date Free',
    faq: [
      { question: 'How do I convert a Unix timestamp to date?', answer: 'Enter your Unix epoch timestamp in ISHU TOOLS and instantly see the equivalent human-readable date and time for free.' },
    ],
  },
  'css-minifier': {
    title: 'CSS Minifier Online Free — Compress CSS Code | ISHU TOOLS',
    description: 'Minify CSS code by removing whitespace and comments online for free. Reduce CSS file size for faster website loading. Perfect for web developers.',
    keywords: ['css minifier', 'css minify online', 'compress css free', 'css optimizer', 'minify css code', 'ishu tools css minifier', 'css file reduce size', 'css minification free'],
    h1: 'CSS Minifier — Compress CSS Code Online Free',
    faq: [
      { question: 'How do I minify CSS online?', answer: 'Paste your CSS into ISHU TOOLS CSS Minifier and get the compressed minified version for free — ready for production deployment.' },
    ],
  },
  'js-minifier': {
    title: 'JavaScript Minifier Online Free — Compress JS Code | ISHU TOOLS',
    description: 'Minify JavaScript code for smaller file size online for free. Remove whitespace, comments, and unnecessary characters from JS files for faster loading.',
    keywords: ['javascript minifier', 'js minifier online', 'compress javascript free', 'js optimizer', 'minify js code', 'ishu tools js minifier', 'javascript file compress', 'js minification'],
    h1: 'JavaScript Minifier — Compress JS Code Online Free',
    faq: [
      { question: 'How do I minify JavaScript online?', answer: 'Paste your JavaScript code into ISHU TOOLS JS Minifier and get the compressed version for free — perfect for web performance.' },
    ],
  },
  'html-minifier': {
    title: 'HTML Minifier Online Free — Compress HTML Code | ISHU TOOLS',
    description: 'Minify HTML code by removing unnecessary whitespace, comments, and redundant attributes online for free. Optimize HTML for faster page loading.',
    keywords: ['html minifier', 'html minify online', 'compress html free', 'html optimizer', 'minify html', 'ishu tools html minifier', 'html compression free'],
    h1: 'HTML Minifier — Compress HTML Code Online Free',
    faq: [
      { question: 'How do I minify HTML online?', answer: 'Paste your HTML into ISHU TOOLS HTML Minifier and get the compressed output for free — ready for faster web deployment.' },
    ],
  },
  'html-to-markdown': {
    title: 'HTML to Markdown Online Free — Convert HTML to MD | ISHU TOOLS',
    description: 'Convert HTML content to Markdown format online for free. Transform HTML pages, articles, and documents to clean Markdown for documentation and blogging.',
    keywords: ['html to markdown', 'html md converter', 'convert html markdown free', 'html to md online', 'ishu tools html markdown', 'html to md free', 'html markdown conversion'],
    h1: 'HTML to Markdown Converter Online Free',
    faq: [
      { question: 'How do I convert HTML to Markdown?', answer: 'Paste your HTML into ISHU TOOLS HTML to Markdown converter and get clean Markdown output for free.' },
    ],
  },
  'json-to-csv-text': {
    title: 'JSON to CSV Online Free — Convert JSON to Spreadsheet | ISHU TOOLS',
    description: 'Convert JSON array data to CSV format online for free. Transform API responses and JSON data into CSV for spreadsheet analysis and Excel import.',
    keywords: ['json to csv', 'json csv converter', 'convert json csv free', 'json to spreadsheet', 'api data to csv', 'ishu tools json csv', 'json csv online'],
    h1: 'JSON to CSV Converter Online Free',
    faq: [
      { question: 'How do I convert JSON to CSV?', answer: 'Paste your JSON array into ISHU TOOLS JSON to CSV converter and download the CSV file for spreadsheet analysis for free.' },
    ],
  },
  'csv-to-json-text': {
    title: 'CSV to JSON Online Free — Convert CSV to JSON Array | ISHU TOOLS',
    description: 'Convert CSV data to JSON array format online for free. Transform spreadsheet data to JSON for APIs, web apps, and data processing.',
    keywords: ['csv to json', 'csv json converter', 'convert csv json free', 'spreadsheet to json', 'csv data to json', 'ishu tools csv json', 'csv json online'],
    h1: 'CSV to JSON Converter Online Free',
    faq: [
      { question: 'How do I convert CSV to JSON?', answer: 'Paste your CSV data into ISHU TOOLS CSV to JSON converter and get a JSON array for free — perfect for web development.' },
    ],
  },
  'text-escape-unescape': {
    title: 'Text Escape/Unescape Online Free — Special Characters | ISHU TOOLS',
    description: 'Escape or unescape special characters in text online for free. Handle backslashes, quotes, newlines, and Unicode escape sequences for code and JSON.',
    keywords: ['text escape unescape', 'escape special characters', 'string escape online', 'unescape text free', 'ishu tools text escape', 'json string escape'],
    h1: 'Text Escape/Unescape — Special Characters Free',
    faq: [
      { question: 'How do I escape special characters in text?', answer: 'Enter your text in ISHU TOOLS Escape/Unescape tool and choose escape or unescape to handle backslashes, quotes, and special characters.' },
    ],
  },
  'ip-lookup': {
    title: 'IP Address Lookup Online Free — Get Your IP Info | ISHU TOOLS',
    description: 'Get your current public IP address and geolocation information online for free. Find country, city, ISP, and timezone from any IP address instantly.',
    keywords: ['ip address lookup', 'ip lookup free', 'my ip address', 'ip geolocation', 'find ip address', 'ishu tools ip lookup', 'ip info online', 'ip checker india'],
    h1: 'IP Address Lookup — Get Your IP Info Free',
    faq: [
      { question: 'How do I find my IP address?', answer: 'Open ISHU TOOLS IP Lookup and instantly see your public IP address along with country, city, ISP, and timezone information for free.' },
    ],
  },
  'char-code-converter': {
    title: 'Character Code Converter Online Free — ASCII & Unicode | ISHU TOOLS',
    description: 'Convert between characters and their ASCII/Unicode code points online for free. Find character codes, Unicode values, and reverse conversion for developers.',
    keywords: ['character code converter', 'ascii code converter', 'unicode character code', 'char to ascii', 'ascii to char', 'ishu tools char code', 'unicode code point free'],
    h1: 'Character Code Converter — ASCII & Unicode Free',
    faq: [
      { question: 'How do I find the ASCII code of a character?', answer: 'Enter any character in ISHU TOOLS Character Code Converter to get its ASCII and Unicode code point instantly for free.' },
    ],
  },
  'url-validator': {
    title: 'URL Validator & Analyzer Online Free — Check URL Structure | ISHU TOOLS',
    description: 'Validate any URL and analyze its structure online for free. Check scheme, domain, path, query parameters, and more. Perfect for developers and SEO.',
    keywords: ['url validator', 'url checker online', 'url structure analyzer', 'validate url free', 'check url valid', 'ishu tools url validator', 'url analyzer free'],
    h1: 'URL Validator & Analyzer Online Free',
    faq: [
      { question: 'How do I validate a URL?', answer: 'Enter any URL in ISHU TOOLS URL Validator to check if it is properly structured and see a full analysis of its components for free.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  SECURITY TOOLS
  // ════════════════════════════════════════════════
  'md5-generator': {
    title: 'MD5 Hash Generator Online Free — Create MD5 Hash | ISHU TOOLS',
    description: 'Generate MD5 hash from any text input online for free. Create checksum for data integrity verification and password hashing. Instant results, no signup.',
    keywords: ['md5 hash generator', 'md5 generator free', 'create md5 hash', 'md5 checksum', 'md5 encoder online', 'ishu tools md5', 'md5 hash tool india'],
    h1: 'MD5 Hash Generator Online Free',
    faq: [
      { question: 'How do I generate an MD5 hash?', answer: 'Paste your text into ISHU TOOLS MD5 Generator and get the MD5 hash instantly for free — useful for checksum verification.' },
    ],
  },
  'sha256-generator': {
    title: 'SHA-256 Hash Generator Online Free — Secure Hash | ISHU TOOLS',
    description: 'Generate SHA-256 hash from any text input online for free. Cryptographically secure hash generation for passwords, data integrity, and security.',
    keywords: ['sha256 hash generator', 'sha-256 generator free', 'sha256 online', 'secure hash sha256', 'sha 256 tool', 'ishu tools sha256', 'sha256 hash creator india'],
    h1: 'SHA-256 Hash Generator Online Free',
    faq: [
      { question: 'How do I generate a SHA-256 hash?', answer: 'Enter your text in ISHU TOOLS SHA-256 Generator and get the cryptographically secure hash instantly for free.' },
    ],
  },
  'bcrypt-generator': {
    title: 'BCrypt Hash Generator Online Free — Password Hashing | ISHU TOOLS',
    description: 'Generate BCrypt hash from a password online for free. BCrypt is the industry standard for secure password hashing. Perfect for developers.',
    keywords: ['bcrypt generator', 'bcrypt hash online', 'password hash bcrypt', 'bcrypt password free', 'ishu tools bcrypt', 'secure password hash bcrypt', 'bcrypt developer tool'],
    h1: 'BCrypt Hash Generator — Secure Password Hashing Free',
    faq: [
      { question: 'How do I generate a BCrypt hash?', answer: 'Enter your password in ISHU TOOLS BCrypt Generator and get a secure BCrypt hash for use in your applications for free.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  STUDENT & TEXT TOOLS
  // ════════════════════════════════════════════════
  'word-frequency': {
    title: 'Word Frequency Analyzer Online Free — Text Statistics | ISHU TOOLS',
    description: 'Analyze word frequency distribution in any text online for free. Find most common words, unique word count, and frequency percentage. Perfect for writers and students.',
    keywords: ['word frequency analyzer', 'word frequency counter', 'text frequency analysis', 'most common words', 'word count analysis', 'ishu tools word frequency', 'text word frequency free'],
    h1: 'Word Frequency Analyzer Online Free',
    faq: [
      { question: 'How do I analyze word frequency?', answer: 'Paste your text into ISHU TOOLS Word Frequency Analyzer to see the most common words, frequency, and percentage instantly for free.' },
    ],
  },
  'countdown-calculator': {
    title: 'Countdown Calculator Online Free — Time Until Date | ISHU TOOLS',
    description: 'Calculate time remaining until any target date online for free. Get days, hours, minutes, and seconds countdown for events, exams, and deadlines.',
    keywords: ['countdown calculator', 'days until date', 'time countdown online', 'event countdown free', 'deadline countdown', 'ishu tools countdown', 'date countdown calculator india'],
    h1: 'Countdown Calculator — Time Until Date Free',
    faq: [
      { question: 'How do I count down to a date?', answer: 'Enter your target date in ISHU TOOLS Countdown Calculator and see exact days, hours, minutes, and seconds remaining for free.' },
    ],
  },
  'text-to-hex': {
    title: 'Text to Hex Converter Online Free — ASCII to Hex | ISHU TOOLS',
    description: 'Convert text to hexadecimal representation online for free. Encode ASCII or Unicode text as hex values for programming and debugging.',
    keywords: ['text to hex', 'text hex converter', 'ascii to hex', 'convert text hex free', 'string to hex', 'ishu tools text hex', 'hex encoding online'],
    h1: 'Text to Hex Converter Online Free',
    faq: [
      { question: 'How do I convert text to hexadecimal?', answer: 'Enter your text in ISHU TOOLS Text to Hex converter and get the hexadecimal representation instantly for free.' },
    ],
  },
  'hex-to-text': {
    title: 'Hex to Text Converter Online Free — Decode Hex | ISHU TOOLS',
    description: 'Convert hexadecimal values back to readable text online for free. Decode hex-encoded strings for programming, debugging, and security analysis.',
    keywords: ['hex to text', 'hex decoder', 'hex to ascii', 'decode hex string free', 'hex text converter', 'ishu tools hex to text', 'hexadecimal to text online'],
    h1: 'Hex to Text Converter Online Free',
    faq: [
      { question: 'How do I convert hex to text?', answer: 'Enter your hexadecimal values in ISHU TOOLS Hex to Text converter and get the readable text representation instantly for free.' },
    ],
  },
  'text-to-unicode': {
    title: 'Text to Unicode Converter Online Free — Unicode Escape | ISHU TOOLS',
    description: 'Convert text to Unicode escape sequences online for free. Get Unicode code points and escape sequences for any text including special characters and emojis.',
    keywords: ['text to unicode', 'unicode escape sequence', 'text unicode converter', 'string to unicode', 'ishu tools text unicode', 'unicode escape online free'],
    h1: 'Text to Unicode Converter Online Free',
    faq: [
      { question: 'How do I convert text to Unicode?', answer: 'Enter your text in ISHU TOOLS Text to Unicode converter to get Unicode escape sequences and code points for free.' },
    ],
  },
  'unicode-to-text': {
    title: 'Unicode to Text Converter Online Free — Decode Unicode | ISHU TOOLS',
    description: 'Convert Unicode escape sequences back to readable text online for free. Decode \\u0000 style Unicode escapes to human-readable characters.',
    keywords: ['unicode to text', 'unicode decoder', 'decode unicode escape', 'unicode text converter free', 'ishu tools unicode to text', 'unescape unicode online'],
    h1: 'Unicode to Text Converter Online Free',
    faq: [
      { question: 'How do I decode Unicode escape sequences?', answer: 'Paste your Unicode escape sequences in ISHU TOOLS Unicode to Text converter and see the decoded readable text for free.' },
    ],
  },
  'string-hash-generator': {
    title: 'Multi-Hash Generator Online Free — MD5, SHA-1, SHA-256, SHA-512 | ISHU TOOLS',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously from any text online for free. Compare multiple hash types at once for security.',
    keywords: ['multi hash generator', 'md5 sha256 generator', 'multiple hash types', 'sha1 sha256 sha512', 'all hash types free', 'ishu tools hash generator', 'hash comparison tool'],
    h1: 'Multi-Hash Generator — MD5, SHA-1, SHA-256, SHA-512 Free',
    faq: [
      { question: 'How do I generate multiple hashes at once?', answer: 'Enter your text in ISHU TOOLS Multi-Hash Generator and instantly get MD5, SHA-1, SHA-256, and SHA-512 hashes all at once for free.' },
    ],
  },
  'text-statistics': {
    title: 'Text Statistics Analyzer Online Free — Complete Text Analysis | ISHU TOOLS',
    description: 'Complete text analysis with word count, character count, sentence count, paragraph count, reading time, and more online for free. Perfect for writers and students.',
    keywords: ['text statistics', 'text analyzer', 'word count statistics', 'text analysis tool', 'reading time calculator', 'ishu tools text statistics', 'text metrics free'],
    h1: 'Text Statistics Analyzer Online Free',
    faq: [
      { question: 'What statistics can I get from my text?', answer: 'ISHU TOOLS Text Statistics shows word count, characters, sentences, paragraphs, reading time, speaking time, and unique word count for free.' },
    ],
  },
  'case-converter-advanced': {
    title: 'Advanced Case Converter Online Free — camelCase, PascalCase, snake_case | ISHU TOOLS',
    description: 'Convert text to camelCase, PascalCase, snake_case, kebab-case, UPPER_CASE, and more online for free. Essential for programmers and developers.',
    keywords: ['advanced case converter', 'camelcase converter', 'snake case converter', 'pascal case online', 'kebab case converter', 'ishu tools case converter', 'programming case convert free'],
    h1: 'Advanced Case Converter — camelCase, PascalCase, snake_case Free',
    faq: [
      { question: 'How do I convert text to camelCase or snake_case?', answer: 'Enter your text in ISHU TOOLS Advanced Case Converter and choose any case format: camelCase, PascalCase, snake_case, kebab-case, and more for free.' },
    ],
  },
  'stopwatch-calculator': {
    title: 'Time Converter Online Free — Hours, Minutes, Seconds | ISHU TOOLS',
    description: 'Convert between hours, minutes, and seconds formats online for free. Calculate total seconds, minutes, or hours from any time value. Perfect for students and professionals.',
    keywords: ['time converter', 'hours minutes seconds converter', 'time calculation free', 'convert time units', 'seconds to hours', 'ishu tools time converter', 'time unit conversion'],
    h1: 'Time Converter — Hours, Minutes, Seconds Free',
    faq: [
      { question: 'How do I convert hours to minutes and seconds?', answer: 'Enter your time value in ISHU TOOLS Time Converter and get conversions between hours, minutes, and seconds instantly for free.' },
    ],
  },
  'word-counter': {
    title: 'Word Counter Online Free — Count Words & Characters | ISHU TOOLS',
    description: 'Count words, characters, sentences, and paragraphs in any text online for free. Also shows reading time and speaking time. Perfect for essays, articles, and assignments.',
    keywords: ['word counter', 'character counter', 'word count online', 'count words free', 'words in text', 'ishu tools word counter', 'word counter india', 'essay word count'],
    h1: 'Word Counter — Count Words & Characters Online Free',
    faq: [
      { question: 'How do I count words in text?', answer: 'Paste your text into ISHU TOOLS Word Counter to instantly get word count, character count, sentence count, and reading time for free.' },
    ],
  },
  'study-timer': {
    title: 'Study Timer Pomodoro Online Free — Study Schedule | ISHU TOOLS',
    description: 'Generate a personalized Pomodoro study schedule online for free. Set work intervals, break times, and total study duration. Perfect for exam prep and productive study sessions.',
    keywords: ['study timer', 'pomodoro timer', 'study schedule generator', 'pomodoro technique', 'study time planner', 'ishu tools study timer', 'student study timer india', 'exam study timer'],
    h1: 'Study Timer Pomodoro — Study Schedule Generator Free',
    faq: [
      { question: 'What is the Pomodoro study technique?', answer: 'Pomodoro involves studying for 25 minutes then taking a 5-minute break. ISHU TOOLS generates a personalized Pomodoro study plan for free.' },
      { question: 'Can I customize the study and break duration?', answer: 'Yes. ISHU TOOLS Study Timer lets you set custom work intervals, short break, and long break durations for your schedule.' },
    ],
  },
  'invoice-generator': {
    title: 'Invoice Generator Online Free — Professional PDF Invoices | ISHU TOOLS',
    description: 'Create professional PDF invoices online for free. Add items, taxes, discounts, and download instantly. Perfect for freelancers, small businesses, and professionals in India.',
    keywords: ['invoice generator', 'pdf invoice maker', 'create invoice free', 'professional invoice online', 'invoice maker india', 'ishu tools invoice', 'free invoice generator india', 'billing invoice free'],
    h1: 'Invoice Generator — Professional PDF Invoices Free',
    faq: [
      { question: 'How do I create a free invoice online?', answer: 'Use ISHU TOOLS Invoice Generator to add your business info, client details, items, taxes, and discounts — then download a professional PDF invoice for free.' },
      { question: 'Can I use this for freelance billing in India?', answer: 'Yes! ISHU TOOLS Invoice Generator is perfect for Indian freelancers and small businesses to create professional invoices with GST if needed.' },
    ],
  },
  'letter-generator': {
    title: 'Formal Letter Generator Online Free — Professional Letter PDF | ISHU TOOLS',
    description: 'Generate professional formal letters as PDF online for free. Enter sender, recipient, subject, and content. Perfect for job applications, complaints, and official letters.',
    keywords: ['formal letter generator', 'letter maker free', 'professional letter online', 'letter generator pdf', 'formal letter writer', 'ishu tools letter generator', 'letter template india', 'formal letter india'],
    h1: 'Formal Letter Generator — Professional Letters Free',
    faq: [
      { question: 'How do I create a formal letter?', answer: 'Use ISHU TOOLS Letter Generator to enter sender, recipient, subject, and body content — download a professional formal letter as PDF for free.' },
    ],
  },
  'time-calculator': {
    title: 'Time Calculator Online Free — Add & Subtract Time | ISHU TOOLS',
    description: 'Add or subtract time values (hours, minutes, seconds) online for free. Calculate time differences, durations, and totals for scheduling and planning.',
    keywords: ['time calculator', 'add subtract time', 'time duration calculator', 'hours minutes calculator', 'time arithmetic online', 'ishu tools time calculator', 'time addition free'],
    h1: 'Time Calculator — Add & Subtract Time Online Free',
    faq: [
      { question: 'How do I add or subtract time values?', answer: 'Enter your time values in ISHU TOOLS Time Calculator using formats like 1:30 or 1h 30m and choose add or subtract for instant results.' },
    ],
  },
  'random-name-generator': {
    title: 'Random Name Generator Online Free — Indian Names | ISHU TOOLS',
    description: 'Generate random Indian names (male, female, or any) online for free. Perfect for creating test data, characters for stories, and game development.',
    keywords: ['random name generator', 'indian name generator', 'random name free', 'fake name generator india', 'random male female name', 'ishu tools name generator', 'name randomizer india'],
    h1: 'Random Name Generator — Indian Names Free',
    faq: [
      { question: 'How do I generate random Indian names?', answer: 'Use ISHU TOOLS Random Name Generator to get random Indian male, female, or unisex names for test data and creative projects for free.' },
    ],
  },
  'flashcard-maker': {
    title: 'Flashcard Maker Online Free — Study Cards for Exam Prep | ISHU TOOLS',
    description: 'Create digital flashcards for studying online for free. Add question-answer pairs and review them for exam preparation. Perfect for JEE, NEET, UPSC, and university exams.',
    keywords: ['flashcard maker', 'study flashcards online', 'digital flashcards free', 'exam prep flashcards', 'question answer cards', 'ishu tools flashcards', 'study cards india', 'jee neet flashcards'],
    h1: 'Flashcard Maker — Study Cards for Exam Prep Free',
    faq: [
      { question: 'How do I create flashcards for studying?', answer: 'Use ISHU TOOLS Flashcard Maker to add question-answer pairs and review them in a digital study session for free.' },
      { question: 'Can I use flashcards for JEE/NEET preparation?', answer: 'Yes! ISHU TOOLS digital flashcards are perfect for memorizing formulas, definitions, and concepts for competitive exams in India.' },
    ],
  },
  'paraphrase-tool': {
    title: 'Paraphrase Tool Online Free — Rewrite Text | ISHU TOOLS',
    description: 'Rewrite text in different words while keeping the original meaning online for free. Perfect for academic writing, content creation, and improving writing quality.',
    keywords: ['paraphrase tool', 'text paraphraser free', 'rewrite text online', 'rephrase text free', 'paraphrasing tool', 'ishu tools paraphrase', 'rewording tool india', 'paraphrase essay free'],
    h1: 'Paraphrase Tool — Rewrite Text Online Free',
    faq: [
      { question: 'How do I paraphrase text online for free?', answer: 'Paste your text into ISHU TOOLS Paraphrase Tool and get a rewritten version with the same meaning but different wording for free.' },
    ],
  },
  'plagiarism-detector': {
    title: 'Plagiarism Detector Online Free — Check for Copied Content | ISHU TOOLS',
    description: 'Check if your text contains duplicate or copied content online for free. Highlights potential plagiarism for academic papers, articles, and student assignments.',
    keywords: ['plagiarism detector', 'plagiarism checker free', 'check plagiarism online', 'copied content detector', 'academic plagiarism checker', 'ishu tools plagiarism', 'plagiarism check india', 'student plagiarism tool'],
    h1: 'Plagiarism Detector — Check for Copied Content Free',
    faq: [
      { question: 'How do I check for plagiarism online for free?', answer: 'Paste your text into ISHU TOOLS Plagiarism Detector and it highlights potentially copied or duplicate content for free.' },
    ],
  },
  'text-to-handwriting': {
    title: 'Text to Handwriting Converter Online Free — Realistic Handwriting | ISHU TOOLS',
    description: 'Convert typed text to realistic handwriting style online for free. Choose handwriting style and download. Perfect for students and creative projects.',
    keywords: ['text to handwriting', 'handwriting converter free', 'typed to handwriting online', 'realistic handwriting generator', 'convert text handwriting', 'ishu tools handwriting', 'student handwriting tool india'],
    h1: 'Text to Handwriting Converter Online Free',
    faq: [
      { question: 'How do I convert text to handwriting?', answer: 'Enter your text in ISHU TOOLS Text to Handwriting converter, choose a style, and download the handwritten version for free.' },
    ],
  },
  'ascii-art-generator': {
    title: 'ASCII Art Generator Online Free — Text to ASCII Art | ISHU TOOLS',
    description: 'Convert text to ASCII art online for free. Choose from multiple fonts and styles. Create cool text banners, logos, and decorative text for social media.',
    keywords: ['ascii art generator', 'text to ascii art', 'ascii text art free', 'ascii font generator', 'text art online', 'ishu tools ascii art', 'ascii banner free'],
    h1: 'ASCII Art Generator — Text to ASCII Art Online Free',
    faq: [
      { question: 'How do I create ASCII art from text?', answer: 'Enter your text in ISHU TOOLS ASCII Art Generator, choose a font style, and get your ASCII art banner for free.' },
    ],
  },
  'grade-needed-calculator': {
    title: 'Grade Needed Calculator Online Free — Target Score | ISHU TOOLS',
    description: 'Calculate the score needed in a final exam or assignment to reach your target grade online for free. Essential tool for students tracking academic performance.',
    keywords: ['grade needed calculator', 'target grade calculator', 'final exam grade needed', 'minimum marks calculator', 'grade goal calculator', 'ishu tools grade calculator', 'student grade planner india'],
    h1: 'Grade Needed Calculator — Target Score Online Free',
    faq: [
      { question: 'How do I calculate the grade I need on my final exam?', answer: 'Enter your current grade, the final weight percentage, and your target grade in ISHU TOOLS Grade Needed Calculator to get the minimum score you need for free.' },
    ],
  },
  'marks-percentage-calculator': {
    title: 'Marks Percentage Calculator Online Free — Exam Results | ISHU TOOLS',
    description: 'Calculate exam percentage, grade, and pass/fail status from obtained marks and total marks online for free. Essential for Indian students after board and university exams.',
    keywords: ['marks percentage calculator', 'exam marks percentage', 'calculate percentage marks', 'score percentage calculator', 'board exam percentage', 'ishu tools marks calculator', 'marks to percentage india', 'exam result calculator'],
    h1: 'Marks Percentage Calculator — Exam Results Online Free',
    faq: [
      { question: 'How do I calculate my exam percentage?', answer: 'Enter obtained marks and total marks in ISHU TOOLS Marks Percentage Calculator to get your percentage and grade instantly for free.' },
      { question: 'Can I check pass/fail status?', answer: 'Yes. ISHU TOOLS Marks Percentage Calculator shows percentage, letter grade, and pass/fail status based on Indian academic standards.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  PRODUCTIVITY TOOLS
  // ════════════════════════════════════════════════
  'resume-builder': {
    title: 'Resume Builder Online Free — Professional CV Maker | ISHU TOOLS',
    description: 'Build a professional resume/CV online in minutes for free. Choose a template, fill your details, and download a PDF resume. Perfect for Indian job seekers and fresh graduates.',
    keywords: ['resume builder', 'cv maker free', 'online resume builder', 'professional resume free', 'pdf resume maker', 'ishu tools resume', 'resume builder india', 'free cv builder india', 'fresher resume builder'],
    h1: 'Resume Builder — Professional CV Maker Online Free',
    faq: [
      { question: 'How do I create a resume for free online?', answer: 'Use ISHU TOOLS Resume Builder to fill in your details and download a professional PDF resume for free — perfect for job applications in India.' },
      { question: 'Can freshers use ISHU TOOLS Resume Builder?', answer: 'Yes! ISHU TOOLS Resume Builder is perfect for freshers and experienced professionals looking to create ATS-friendly resumes for free.' },
    ],
  },
  'screen-ruler': {
    title: 'Online Screen Ruler Free — Measure in Pixels, cm, mm, Inches | ISHU TOOLS',
    description: 'Measure elements on your screen in pixels, cm, mm, or inches online for free. A browser-based virtual ruler for designers, developers, and students.',
    keywords: ['online screen ruler', 'screen ruler free', 'pixel ruler browser', 'measure screen elements', 'virtual ruler online', 'ishu tools screen ruler', 'browser ruler pixels'],
    h1: 'Online Screen Ruler — Measure in Pixels/cm Free',
    faq: [
      { question: 'How do I measure elements on my screen?', answer: 'Open ISHU TOOLS Online Screen Ruler in your browser and drag it over any element to measure it in pixels, cm, mm, or inches for free.' },
    ],
  },
  'note-pad': {
    title: 'Online Notepad Free — Save Notes in Browser | ISHU TOOLS',
    description: 'Free online notepad with auto-save. Write notes, to-do lists, or any text and save directly in your browser without any signup or account.',
    keywords: ['online notepad', 'browser notepad free', 'digital notepad', 'auto save notepad', 'online text editor', 'ishu tools notepad', 'quick notes online', 'notepad no signup'],
    h1: 'Online Notepad — Auto-Save Notes in Browser Free',
    faq: [
      { question: 'How does the ISHU TOOLS online notepad work?', answer: 'ISHU TOOLS Notepad auto-saves your text in your browser\'s local storage. Your notes persist between sessions with no account needed.' },
    ],
  },
  'to-do-list': {
    title: 'To-Do List Online Free — Task Manager in Browser | ISHU TOOLS',
    description: 'Simple and clean online to-do list free. Add, complete, and delete tasks. Auto-saved in browser. No signup, no account. Perfect for students and professionals.',
    keywords: ['to do list online', 'task manager free', 'browser todo list', 'digital task list', 'simple todo app', 'ishu tools todo', 'online task tracker free', 'student task list'],
    h1: 'To-Do List — Online Task Manager Free',
    faq: [
      { question: 'How does the ISHU TOOLS To-Do List work?', answer: 'Add tasks, mark them complete, and delete them. Everything is auto-saved in your browser with no account or signup required.' },
    ],
  },
  'habit-tracker': {
    title: 'Habit Tracker Online Free — Build Daily Habits & Streaks | ISHU TOOLS',
    description: 'Track daily habits and build streaks online for free. Mark habits as done each day. Perfect for students building study habits and professionals developing routines.',
    keywords: ['habit tracker', 'daily habit tracker free', 'habit streak tracker', 'online habit builder', 'study habit tracker', 'ishu tools habit tracker', 'habit tracker india', 'daily routine tracker'],
    h1: 'Habit Tracker — Build Daily Habits & Streaks Free',
    faq: [
      { question: 'How do I track my daily habits online?', answer: 'Use ISHU TOOLS Habit Tracker to add your habits, mark them daily, and track streaks over time — all for free with no signup.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  MATH TOOLS
  // ════════════════════════════════════════════════
  'profit-loss-calculator': {
    title: 'Profit and Loss Calculator Online Free — P&L Percentage | ISHU TOOLS',
    description: 'Calculate profit or loss percentage from cost and selling price online for free. Essential for students, traders, and business owners in India.',
    keywords: ['profit loss calculator', 'profit percentage calculator', 'loss calculator free', 'cost selling price calculator', 'p&l calculator india', 'ishu tools profit loss', 'business calculator free'],
    h1: 'Profit & Loss Calculator Online Free',
    faq: [
      { question: 'How do I calculate profit or loss percentage?', answer: 'Enter cost price and selling price in ISHU TOOLS Profit & Loss Calculator to get profit/loss amount and percentage instantly for free.' },
    ],
  },
  'unit-price-calculator': {
    title: 'Unit Price Calculator Online Free — Compare Product Values | ISHU TOOLS',
    description: 'Calculate price per unit to compare product values online for free. Find the best deal when comparing different package sizes and quantities.',
    keywords: ['unit price calculator', 'price per unit', 'compare product prices', 'unit cost calculator', 'value comparison tool', 'ishu tools unit price', 'best deal calculator india'],
    h1: 'Unit Price Calculator — Compare Deals Free',
    faq: [
      { question: 'How do I calculate unit price?', answer: 'Enter total price and quantity in ISHU TOOLS Unit Price Calculator to get the price per unit and compare different product options for free.' },
    ],
  },
  'matrix-calculator': {
    title: 'Matrix Calculator Online Free — Matrix Operations | ISHU TOOLS',
    description: 'Perform matrix operations online for free: addition, subtraction, multiplication, transpose, determinant, and inverse. Essential for linear algebra and engineering.',
    keywords: ['matrix calculator', 'matrix operations online', 'matrix multiplication free', 'linear algebra calculator', 'determinant calculator', 'matrix inverse free', 'ishu tools matrix', 'engineering math calculator'],
    h1: 'Matrix Calculator — Matrix Operations Online Free',
    faq: [
      { question: 'What matrix operations can I do online?', answer: 'ISHU TOOLS Matrix Calculator supports addition, subtraction, multiplication, transpose, determinant, and inverse for free.' },
    ],
  },
  'equation-solver': {
    title: 'Equation Solver Online Free — Linear & Quadratic | ISHU TOOLS',
    description: 'Solve linear and quadratic equations step by step online for free. Enter your equation and get the solution with full working shown. Perfect for students.',
    keywords: ['equation solver', 'solve equations online', 'linear equation solver', 'quadratic equation solver', 'math equation free', 'ishu tools equation solver', 'algebra solver india', 'jee math solver'],
    h1: 'Equation Solver — Solve Linear & Quadratic Free',
    faq: [
      { question: 'How do I solve a linear equation online?', answer: 'Enter your equation in ISHU TOOLS Equation Solver and get the step-by-step solution for free — perfect for homework and exam prep.' },
    ],
  },
  'speed-calculator': {
    title: 'Speed Distance Time Calculator Online Free | ISHU TOOLS',
    description: 'Calculate speed, distance, or time from any two known values online for free. Supports km/h, mph, m/s. Essential for physics problems and competitive exams.',
    keywords: ['speed calculator', 'distance time calculator', 'speed distance time', 'physics calculator free', 'velocity calculator', 'ishu tools speed calculator', 'speed distance india', 'ssc math speed problems'],
    h1: 'Speed Distance Time Calculator Online Free',
    faq: [
      { question: 'How do I calculate speed from distance and time?', answer: 'Enter any two known values in ISHU TOOLS Speed Calculator to instantly calculate the third — speed, distance, or time — for free.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  FINANCE TOOLS
  // ════════════════════════════════════════════════
  'atm-pin-generator': {
    title: 'ATM PIN Generator Online Free — Secure 4 & 6 Digit PIN | ISHU TOOLS',
    description: 'Generate secure random 4-digit and 6-digit ATM PINs online for free. Avoids obvious patterns and weak PINs. Use for ATM cards, accounts, and mobile banking.',
    keywords: ['atm pin generator', 'generate atm pin', 'secure pin generator', 'random pin 4 digit', 'random pin 6 digit', 'ishu tools atm pin', 'bank pin generator india'],
    h1: 'ATM PIN Generator — Secure 4 & 6 Digit PINs Free',
    faq: [
      { question: 'How do I generate a secure ATM PIN?', answer: 'ISHU TOOLS ATM PIN Generator creates cryptographically random 4 or 6-digit PINs avoiding obvious patterns like 1234 or 0000 for free.' },
    ],
  },
  'credit-card-validator': {
    title: 'Credit Card Validator Online Free — Luhn Algorithm | ISHU TOOLS',
    description: 'Validate credit and debit card numbers using the Luhn algorithm online for free. Identify card type (Visa, Mastercard, RuPay, Amex) and check validity.',
    keywords: ['credit card validator', 'card number validator', 'luhn algorithm checker', 'debit card validator', 'rupay card validator', 'ishu tools card validator', 'card number check free india'],
    h1: 'Credit Card Validator — Luhn Algorithm Check Free',
    faq: [
      { question: 'How do I validate a credit card number?', answer: 'Enter any credit or debit card number in ISHU TOOLS Card Validator to check it against the Luhn algorithm and identify the card type for free.' },
    ],
  },
  'ifsc-code-finder': {
    title: 'IFSC Code Finder Online Free — Find Bank IFSC Code India | ISHU TOOLS',
    description: 'Find IFSC code of any bank branch in India online for free. Search by bank name, state, and city. Supports SBI, HDFC, ICICI, Axis, PNB, and all Indian banks.',
    keywords: ['ifsc code finder', 'find ifsc code', 'bank ifsc code', 'ifsc code india', 'sbi ifsc code', 'hdfc ifsc code', 'bank branch ifsc', 'ishu tools ifsc', 'ifsc code search free india'],
    h1: 'IFSC Code Finder — Find Bank Branch Code Free',
    faq: [
      { question: 'How do I find an IFSC code for my bank branch?', answer: 'Use ISHU TOOLS IFSC Code Finder to search by bank name, state, and city to find the IFSC code for any branch in India for free.' },
      { question: 'What is IFSC code used for?', answer: 'IFSC (Indian Financial System Code) is an 11-character code used for NEFT, RTGS, and IMPS transfers to uniquely identify bank branches in India.' },
    ],
  },
  'salary-hike-calculator': {
    title: 'Salary Hike Calculator Online Free — New Salary After Increment | ISHU TOOLS',
    description: 'Calculate new salary after hike percentage, yearly increase, and bonus impact online for free. Essential for salary negotiations and appraisal planning in India.',
    keywords: ['salary hike calculator', 'salary increment calculator', 'new salary after hike', 'pay raise calculator', 'appraisal calculator india', 'ishu tools salary calculator', 'salary increase free india'],
    h1: 'Salary Hike Calculator — New Salary After Increment Free',
    faq: [
      { question: 'How do I calculate my new salary after a hike?', answer: 'Enter your current salary and hike percentage in ISHU TOOLS Salary Hike Calculator to see your new salary, monthly increase, and yearly difference for free.' },
    ],
  },
  'loan-prepayment-calculator': {
    title: 'Loan Prepayment Calculator Online Free — Save Interest | ISHU TOOLS',
    description: 'Calculate how much interest and time you save by making loan prepayments online for free. Works for home, car, and personal loans in India.',
    keywords: ['loan prepayment calculator', 'prepayment savings calculator', 'home loan prepayment', 'car loan prepayment india', 'loan foreclosure calculator', 'ishu tools prepayment', 'interest saving calculator india'],
    h1: 'Loan Prepayment Calculator — Calculate Interest Savings Free',
    faq: [
      { question: 'How much do I save by prepaying my loan?', answer: 'Enter your loan details and prepayment amount in ISHU TOOLS Prepayment Calculator to see total interest saved and reduced tenure for free.' },
    ],
  },
  'recurring-deposit-calculator': {
    title: 'RD Calculator India Online Free — Recurring Deposit Maturity | ISHU TOOLS',
    description: 'Calculate RD maturity amount, total deposits, and interest earned from monthly recurring deposits online for free. Works for all Indian banks and post office RD.',
    keywords: ['rd calculator india', 'recurring deposit calculator', 'rd maturity calculator', 'post office rd calculator', 'bank rd calculator free', 'ishu tools rd calculator', 'recurring deposit india'],
    h1: 'RD Calculator India — Recurring Deposit Maturity Free',
    faq: [
      { question: 'How do I calculate RD maturity amount?', answer: 'Enter monthly deposit amount, interest rate, and tenure in ISHU TOOLS RD Calculator to get maturity amount and interest earned for free.' },
    ],
  },
  'loan-eligibility-calculator': {
    title: 'Loan Eligibility Calculator Online Free — Check Loan Amount India | ISHU TOOLS',
    description: 'Estimate home, car, or personal loan eligibility from monthly income and existing EMIs online for free. Essential tool for loan applicants in India.',
    keywords: ['loan eligibility calculator', 'home loan eligibility', 'personal loan eligibility india', 'car loan eligibility', 'check loan amount free', 'ishu tools loan eligibility', 'how much loan can i get india'],
    h1: 'Loan Eligibility Calculator — Check Loan Amount Free',
    faq: [
      { question: 'How much loan can I get based on my salary?', answer: 'Enter your monthly income and existing EMIs in ISHU TOOLS Loan Eligibility Calculator to estimate your maximum loan amount for home, car, or personal loans.' },
    ],
  },
  'expense-splitter': {
    title: 'Expense Splitter Online Free — Split Bills with Friends | ISHU TOOLS',
    description: 'Split bills and shared expenses between friends, roommates, trips, and groups online for free. Calculate who owes what and simplify group payments.',
    keywords: ['expense splitter', 'bill splitter free', 'split bills friends', 'group expense calculator', 'trip expense splitter', 'ishu tools expense splitter', 'bill split india', 'roommate expense split'],
    h1: 'Expense Splitter — Split Bills with Friends Free',
    faq: [
      { question: 'How do I split expenses with friends?', answer: 'Enter all expenses and participants in ISHU TOOLS Expense Splitter to see exactly who owes what for trips, dinners, and shared costs for free.' },
    ],
  },
  'time-converter': {
    title: 'Time Unit Converter Online Free — Seconds Minutes Hours Days | ISHU TOOLS',
    description: 'Convert between seconds, minutes, hours, days, weeks, months, years, and milliseconds instantly online free. Enter any time value and convert to all units at once.',
    keywords: ['time converter', 'time unit converter', 'seconds to minutes converter', 'hours to minutes', 'convert time online free', 'time calculator', 'ishu tools time converter', 'seconds minutes hours converter'],
    h1: 'Time Unit Converter — Convert Seconds, Minutes, Hours Free',
    faq: [
      { question: 'How do I convert hours to minutes?', answer: 'Enter the number of hours in ISHU TOOLS Time Converter, select "hours" as the from unit and "minutes" as the to unit, and get the result instantly. 1 hour = 60 minutes.' },
      { question: 'How many seconds are in a day?', answer: 'There are 86,400 seconds in a day (24 hours × 60 minutes × 60 seconds). Use ISHU TOOLS Time Converter to convert between any time units instantly.' },
    ],
  },
  'coin-flipper': {
    title: 'Coin Flipper Online Free — Flip a Coin Heads or Tails | ISHU TOOLS',
    description: 'Flip a virtual coin online free — get instant heads or tails results. Flip multiple coins at once for probability experiments, group decisions, and games. No signup needed.',
    keywords: ['coin flipper', 'flip a coin online', 'heads or tails', 'virtual coin toss', 'coin flip free', 'random coin flip', 'coin flip simulator', 'ishu tools coin flipper', 'coin flipper online india'],
    h1: 'Coin Flipper — Flip a Coin Online Free',
    faq: [
      { question: 'Is the coin flip truly random?', answer: 'Yes! ISHU TOOLS Coin Flipper uses cryptographically secure random number generation, giving you a true 50/50 chance of heads or tails on every flip.' },
    ],
  },
  'morse-code-converter': {
    title: 'Morse Code Converter Online Free — Text to Morse & Decode | ISHU TOOLS',
    description: 'Convert text to Morse code or decode Morse code to text online free. Supports all letters, numbers, and punctuation. Perfect for students, ham radio operators, and cryptography enthusiasts.',
    keywords: ['morse code converter', 'text to morse code', 'morse code translator free', 'decode morse code online', 'morse code encoder', 'morse code decoder', 'ishu tools morse code', 'morse code converter online india'],
    h1: 'Morse Code Converter — Text to Morse Code Free',
    faq: [
      { question: 'How do I convert text to Morse code?', answer: 'Enter your text in ISHU TOOLS Morse Code Converter and click encode. Each letter is converted to dots (.) and dashes (-) separated by spaces, with three spaces between words.' },
      { question: 'How do I decode Morse code?', answer: 'Enter Morse code using dots and dashes (separate letters with spaces, words with three spaces), select "decode" mode, and ISHU TOOLS will convert it back to text instantly.' },
    ],
  },
  'fraction-calculator': {
    title: 'Fraction Calculator Online Free — Add Subtract Multiply Divide Fractions | ISHU TOOLS',
    description: 'Add, subtract, multiply, and divide fractions online free with automatic simplification. Shows answer as simplified fraction and decimal. Perfect for students and math homework.',
    keywords: ['fraction calculator', 'add fractions online', 'subtract fractions', 'multiply fractions calculator', 'divide fractions', 'fraction simplifier', 'fraction math calculator free', 'ishu tools fraction calculator', 'fraction calculator for students'],
    h1: 'Fraction Calculator — Add Subtract Multiply Divide Fractions Free',
    faq: [
      { question: 'How do I add fractions with different denominators?', answer: 'Enter your two fractions (e.g., 1/2 and 1/3) in ISHU TOOLS Fraction Calculator, select "add" and get the result (5/6) instantly — with cross-multiplication done automatically.' },
    ],
  },
  'percentage-change-calculator': {
    title: 'Percentage Change Calculator Online Free — % Increase Decrease | ISHU TOOLS',
    description: 'Calculate percentage change between two values online free. Find % increase or % decrease instantly by entering old and new values. Perfect for business, finance, and academics.',
    keywords: ['percentage change calculator', 'percent increase calculator', 'percent decrease calculator', 'percentage difference calculator', 'calculate % change online', 'percent change formula', 'ishu tools percentage calculator'],
    h1: 'Percentage Change Calculator — Find % Increase or Decrease Free',
    faq: [
      { question: 'How do I calculate percentage change?', answer: 'Percentage change = ((New Value - Old Value) / |Old Value|) × 100. Enter your old and new values in ISHU TOOLS to get the result instantly with direction (increase or decrease).' },
    ],
  },
  'emi-calculator': {
    title: 'EMI Calculator India Free — Home Loan Car Loan Personal Loan EMI | ISHU TOOLS',
    description: 'Calculate monthly EMI for home loan, car loan, and personal loan online free. Enter loan amount, interest rate, and tenure to get exact EMI, total payment, and interest amount.',
    keywords: ['emi calculator', 'loan emi calculator india', 'home loan emi calculator', 'car loan emi calculator', 'personal loan emi', 'monthly emi calculator free', 'ishu tools emi calculator', 'emi formula india', 'emi calculation online'],
    h1: 'EMI Calculator — Calculate Loan EMI Online Free India',
    faq: [
      { question: 'What is EMI?', answer: 'EMI (Equated Monthly Instalment) is the fixed monthly payment you make to repay a loan over a set period. It includes both principal and interest.' },
      { question: 'How is EMI calculated?', answer: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly interest rate, and n is tenure in months. ISHU TOOLS calculates this instantly for free.' },
    ],
  },
  'interest-calculator': {
    title: 'Interest Calculator Free — Simple & Compound Interest | ISHU TOOLS India',
    description: 'Calculate simple interest (SI) and compound interest (CI) online free. Enter principal, rate, and time to get total interest and final amount. Perfect for students and investors in India.',
    keywords: ['interest calculator', 'simple interest calculator', 'compound interest calculator', 'SI CI calculator', 'interest rate calculator free', 'calculate interest online', 'ishu tools interest calculator', 'simple interest formula', 'compound interest formula india'],
    h1: 'Interest Calculator — Simple & Compound Interest Free',
    faq: [
      { question: 'What is the difference between simple and compound interest?', answer: 'Simple interest is calculated only on the principal. Compound interest is calculated on principal plus accumulated interest. Use ISHU TOOLS Interest Calculator to compare both instantly.' },
    ],
  },
  'reading-time-estimator': {
    title: 'Reading Time Estimator Online Free — How Long to Read Text | ISHU TOOLS',
    description: 'Estimate how long it takes to read any text online free. Paste your content to get reading time at slow, average, and fast reading speeds. Perfect for bloggers, students, and writers.',
    keywords: ['reading time estimator', 'how long to read', 'reading time calculator', 'words per minute', 'text reading time online', 'blog reading time', 'article reading time calculator', 'ishu tools reading time', 'reading speed calculator free'],
    h1: 'Reading Time Estimator — How Long to Read Your Text Free',
    faq: [
      { question: 'What is the average reading speed?', answer: 'The average adult reads 200-250 words per minute. ISHU TOOLS Reading Time Estimator shows you reading time at slow (150 wpm), average (200 wpm), and fast (300 wpm) speeds.' },
    ],
  },
  'attendance-calculator': {
    title: 'Attendance Calculator Online Free — 75% Attendance Checker | ISHU TOOLS',
    description: 'Calculate your college attendance percentage and see if you meet the 75% requirement. Find how many classes you can skip or need to attend. Free attendance tracker for students India.',
    keywords: ['attendance calculator', 'attendance percentage calculator', '75 percent attendance calculator', 'college attendance calculator', 'classes to attend calculator', 'attendance tracker free', 'ishu tools attendance calculator', 'how many classes can i skip'],
    h1: 'Attendance Calculator — Check if You Meet 75% Attendance',
    faq: [
      { question: 'How many classes can I miss?', answer: 'Enter your attended classes and total classes in ISHU TOOLS Attendance Calculator. It will tell you exactly how many classes you can skip while maintaining the required attendance percentage.' },
    ],
  },
  'exam-score-calculator': {
    title: 'Exam Score Calculator — Marks to Percentage & Grade Online Free | ISHU TOOLS',
    description: 'Convert exam marks to percentage and grade (A+, A, B, C) online free. Enter marks obtained and total marks to get your percentage, grade, and GPA equivalent instantly.',
    keywords: ['exam score calculator', 'marks to percentage', 'marks to grade calculator', 'exam percentage calculator', 'grade calculator online free', 'marks calculator india', 'ishu tools marks calculator', 'exam result calculator'],
    h1: 'Exam Score Calculator — Marks to Percentage & Grade Free',
    faq: [
      { question: 'How do I calculate percentage from marks?', answer: 'Percentage = (Marks Obtained / Total Marks) × 100. For example, 75 out of 100 = 75%. ISHU TOOLS Exam Score Calculator also shows your grade (A+, A, B...) and GPA equivalent.' },
    ],
  },
  'anagram-checker': {
    title: 'Anagram Checker Online Free — Check if Two Words are Anagrams | ISHU TOOLS',
    description: 'Check if two words or phrases are anagrams of each other online free. Get character frequency analysis and see missing characters. Perfect for word games, spelling practice, and students.',
    keywords: ['anagram checker', 'anagram detector free', 'check anagram online', 'word anagram finder', 'are these words anagrams', 'anagram solver', 'ishu tools anagram checker', 'anagram tool free'],
    h1: 'Anagram Checker — Check if Two Words are Anagrams Free',
    faq: [
      { question: 'What is an anagram?', answer: 'An anagram is a word or phrase formed by rearranging the letters of another. For example, "listen" and "silent" are anagrams. Use ISHU TOOLS to check any two words instantly.' },
    ],
  },
  'text-line-sorter': {
    title: 'Text Line Sorter Online Free — Sort Lines Alphabetically | ISHU TOOLS',
    description: 'Sort lines of text alphabetically, reverse, by length, or randomly online free. Paste your list and get sorted output instantly. Perfect for sorting names, data, and code.',
    keywords: ['text line sorter', 'sort lines alphabetically online', 'alphabetical sorter free', 'list sorter online', 'text sorter tool', 'sort text lines free', 'ishu tools text sorter', 'alphabetical order sorter'],
    h1: 'Text Line Sorter — Sort Lines Alphabetically Free',
    faq: [
      { question: 'Can I sort lines in reverse alphabetical order?', answer: 'Yes! In ISHU TOOLS Text Line Sorter, set the order to "desc" or "Z-A" to sort lines in reverse alphabetical order. You can also sort by line length or randomize the order.' },
    ],
  },
  'list-deduplicator': {
    title: 'List Deduplicator Online Free — Remove Duplicate Lines | ISHU TOOLS',
    description: 'Remove duplicate lines or items from any list online free. Paste your list to instantly get unique items only. Perfect for cleaning email lists, data, names, and code.',
    keywords: ['list deduplicator', 'remove duplicates online free', 'remove duplicate lines', 'unique line extractor', 'deduplicate list tool', 'duplicate remover online', 'ishu tools deduplicator', 'remove duplicate text free'],
    h1: 'List Deduplicator — Remove Duplicate Lines Free',
    faq: [
      { question: 'How do I remove duplicate lines from a list?', answer: 'Paste your list (one item per line) into ISHU TOOLS List Deduplicator and click run. It instantly removes all duplicate lines and shows you only unique items.' },
    ],
  },
  'character-frequency': {
    title: 'Character Frequency Counter — Letter Frequency Analysis Online Free | ISHU TOOLS',
    description: 'Count how often each letter or character appears in text online free. Get character frequency analysis with percentages. Perfect for cryptography, language analysis, and writing.',
    keywords: ['character frequency counter', 'letter frequency counter', 'character frequency analysis', 'char frequency tool', 'text frequency analysis', 'letter count online free', 'ishu tools character frequency', 'cryptography frequency analysis'],
    h1: 'Character Frequency Counter — Analyze Letter Frequency Free',
    faq: [
      { question: 'What is character frequency analysis used for?', answer: 'Character frequency analysis is used in cryptography to crack substitution ciphers, in linguistics to study language patterns, and in writing to check letter distribution. Use ISHU TOOLS for instant analysis.' },
    ],
  },
  'calorie-calculator': {
    title: 'Calorie Calculator Free — Daily Calorie Needs TDEE BMI India | ISHU TOOLS',
    description: 'Calculate your daily calorie needs (TDEE) using the Mifflin-St Jeor equation. Get BMR, TDEE, BMI, and calorie goals for weight loss, maintenance, and muscle gain. Free for Indian users.',
    keywords: ['calorie calculator', 'tdee calculator free', 'daily calorie calculator india', 'calorie needs calculator', 'bmr calculator free', 'calorie deficit calculator', 'ishu tools calorie calculator', 'how many calories per day india'],
    h1: 'Calorie Calculator — Find Your Daily Calorie Needs (TDEE) Free',
    faq: [
      { question: 'How many calories should I eat per day?', answer: 'Your daily calorie needs depend on your weight, height, age, gender, and activity level. Use ISHU TOOLS Calorie Calculator (TDEE) to find your exact daily calorie requirement for free.' },
    ],
  },
  'assignment-deadline-tracker': {
    title: 'Assignment Deadline Tracker Online Free — Days Left Calculator | ISHU TOOLS',
    description: 'Track your assignment deadlines and see exactly how many days are left. Enter due dates to get instant countdown, status alerts, and urgency levels. Free for students.',
    keywords: ['assignment deadline tracker', 'deadline tracker free', 'days until deadline calculator', 'assignment due date', 'homework deadline tracker', 'student deadline tracker', 'ishu tools deadline', 'assignment countdown calculator'],
    h1: 'Assignment Deadline Tracker — Track Due Dates Free',
    faq: [
      { question: 'How do I track my assignment deadlines?', answer: 'Enter the assignment name and due date (YYYY-MM-DD format) in ISHU TOOLS Assignment Deadline Tracker. It shows you exactly how many days are left with color-coded urgency alerts.' },
    ],
  },
  'number-palindrome-checker': {
    title: 'Palindrome Checker Online Free — Check Word Number Phrase | ISHU TOOLS',
    description: 'Check if a word, number, or phrase is a palindrome online free. Get instant results with reversal display and word-by-word analysis. Perfect for word games and programming.',
    keywords: ['palindrome checker', 'palindrome detector free', 'number palindrome checker', 'word palindrome checker', 'is palindrome online', 'check palindrome free', 'ishu tools palindrome checker', 'palindrome finder'],
    h1: 'Palindrome Checker — Check Words & Numbers Free',
    faq: [
      { question: 'What is a palindrome?', answer: 'A palindrome is a word, number, or phrase that reads the same forwards and backwards. Examples: "madam", "racecar", 12321, "A man a plan a canal Panama". Use ISHU TOOLS to check instantly.' },
    ],
  },
  'resume-word-count': {
    title: 'Resume Word Count & Analyzer Online Free — Resume Checker | ISHU TOOLS',
    description: 'Count words in your resume and get professional analysis. Checks word count, power words, reading time, page estimate, and gives expert improvement tips. Free resume analyzer.',
    keywords: ['resume word count', 'resume analyzer free', 'resume length checker', 'resume power words', 'cv word count', 'resume checker online', 'ishu tools resume analyzer', 'how long should resume be'],
    h1: 'Resume Word Count — Analyze Your Resume Length & Strength Free',
    faq: [
      { question: 'How many words should a resume have?', answer: 'A one-page resume should have 400-700 words. ISHU TOOLS Resume Word Count Analyzer counts your words and tells you if your resume is too short, perfect, or too long.' },
    ],
  },
  'study-hours-calculator': {
    title: 'Study Hours Calculator — Exam Study Planner Online Free | ISHU TOOLS',
    description: 'Plan your exam study schedule by calculating hours per subject. Enter subjects count, days left, and daily available hours to get a complete study plan with Pomodoro sessions.',
    keywords: ['study hours calculator', 'study planner free', 'exam study schedule', 'how many hours to study', 'study time calculator online', 'exam preparation planner', 'ishu tools study planner', 'study schedule calculator india'],
    h1: 'Study Hours Calculator — Plan Your Exam Study Schedule Free',
    faq: [
      { question: 'How many hours should I study for exams?', answer: 'Enter your number of subjects, days until exam, and daily study hours in ISHU TOOLS Study Hours Calculator to get a personalized schedule showing how many hours to dedicate per subject.' },
    ],
  },
  'unit-converter': {
    title: 'Unit Converter Online Free — Length Weight Volume Speed Area | ISHU TOOLS',
    description: 'Universal unit converter for length (km, m, ft), weight (kg, lb), volume (L, ml, gallon), speed (km/h, mph), area (m², ft², acre), data (KB, MB, GB), and more. Free online.',
    keywords: ['unit converter', 'universal unit converter free', 'length converter online', 'weight converter', 'volume converter free', 'speed converter', 'area converter', 'convert units online india', 'ishu tools unit converter', 'measurement converter'],
    h1: 'Unit Converter — Convert Any Unit Online Free',
    faq: [
      { question: 'What units can I convert?', answer: 'ISHU TOOLS Unit Converter supports length (m, km, cm, ft, inch, mile, yard), weight (kg, g, lb, oz), volume (L, ml, gallon, cup), speed (km/h, mph, m/s), area (m², ft², acre, hectare), and data storage (bytes, KB, MB, GB, TB).' },
    ],
  },
  'bill-splitter': {
    title: 'Bill Splitter Online Free — Split Restaurant Bills Equally | ISHU TOOLS by Ishu Kumar',
    description: 'Split restaurant bills, trip costs, and shared expenses equally among friends online for free. Enter the total amount, number of people, and tip percentage to get each person\'s share instantly. No signup required.',
    keywords: ['bill splitter', 'split bill calculator', 'restaurant bill splitter free', 'divide bill among friends', 'bill split online india', 'ishu tools bill splitter', 'ishu kumar bill splitter', 'split restaurant bill equally', 'tip calculator bill splitter', 'bill share calculator', 'group bill calculator', 'trip bill splitter', 'bill splitter for students', 'dutch pay calculator', 'how to split bill among friends'],
    h1: 'Bill Splitter — Split Restaurant Bills Among Friends Free',
    faq: [
      { question: 'How does the Bill Splitter work?', answer: 'Enter the total bill amount, the number of people splitting it, and an optional tip percentage. ISHU TOOLS Bill Splitter instantly calculates exactly how much each person should pay, including their share of the tip.' },
      { question: 'Can I include a tip in the bill split?', answer: 'Yes! Enter the tip percentage (e.g., 10% or 15%) and ISHU TOOLS Bill Splitter will calculate the tip amount, total bill with tip, and each person\'s final share including tip.' },
      { question: 'Is the Bill Splitter free to use?', answer: 'Yes, ISHU TOOLS Bill Splitter is completely free — no signup, no login, no watermarks. Just enter your bill details and get instant results.' },
    ],
  },
  'random-name-picker': {
    title: 'Random Name Picker Online Free — Pick Random Winner from List | ISHU TOOLS',
    description: 'Pick a random name from any list instantly — perfect for classroom activities, lucky draws, group selection, and contests. Paste your list and click to get a random winner. Free, no signup required.',
    keywords: ['random name picker', 'random name picker online free', 'pick random name from list', 'random winner picker', 'classroom name picker', 'lucky draw picker online', 'ishu tools name picker', 'ishu kumar random picker', 'random student picker', 'name randomizer free', 'random selection tool', 'random draw tool india', 'contest winner picker', 'name chooser online free'],
    h1: 'Random Name Picker — Pick a Random Winner Free',
    faq: [
      { question: 'How do I use the Random Name Picker?', answer: 'Enter your list of names (one per line or comma-separated), then click Pick. ISHU TOOLS Random Name Picker instantly selects a random name from your list — perfect for teachers, contests, and group activities.' },
      { question: 'Can I pick multiple winners?', answer: 'Yes! Enter a number in the "Pick count" field to select multiple random winners from your list at once. Each selected name is unique — no duplicates.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  HEALTH TOOLS
  // ════════════════════════════════════════════════
  'pace-calculator': {
    title: 'Running Pace Calculator Online Free — Km/Mile Running Speed | ISHU TOOLS',
    description: 'Calculate running pace per km or mile, speed in km/h and mph, and estimated race finish time online for free. Perfect for runners, athletes, and fitness enthusiasts in India.',
    keywords: ['running pace calculator', 'pace calculator km', 'running speed calculator', 'race time calculator', 'marathon pace calculator', 'ishu tools pace calculator', 'running calculator india'],
    h1: 'Running Pace Calculator — Speed & Time Free',
    faq: [
      { question: 'How do I calculate my running pace?', answer: 'Enter your distance and time in ISHU TOOLS Running Pace Calculator to get pace per km/mile, speed in km/h and mph, and estimated race finish time for free.' },
    ],
  },

  // ════════════════════════════════════════════════
  //  TEXT OPS TOOLS
  // ════════════════════════════════════════════════
  'braille-converter': {
    title: 'Braille Converter Online Free — Text to Braille | ISHU TOOLS',
    description: 'Convert English text to Grade 1 Braille symbols online for free. Educational tool for learning Braille and accessibility awareness.',
    keywords: ['braille converter', 'text to braille', 'braille online free', 'english to braille', 'learn braille', 'ishu tools braille', 'braille education tool', 'accessibility braille'],
    h1: 'Braille Converter — Text to Braille Online Free',
    faq: [
      { question: 'How do I convert text to Braille?', answer: 'Enter your English text in ISHU TOOLS Braille Converter and see the Grade 1 Braille symbol representation instantly for free.' },
    ],
  },

  'pan-validator': {
    title: 'PAN Card Validator India — PAN Number Verification Online Free | ISHU TOOLS',
    description: 'Validate Indian PAN card number online instantly. Check PAN format, identify holder type (individual, company, HUF, trust), and verify PAN compliance. Free PAN checker.',
    keywords: ['pan card validator', 'pan number validator india', 'pan verification online free', 'pan card format checker', 'pan number check india', 'income tax pan validator', 'pan card holder type checker', 'individual pan validator', 'company pan number checker'],
    h1: 'PAN Card Validator India — Free PAN Number Verification Online',
    faq: [
      { question: 'What is the PAN card format?', answer: 'PAN is a 10-character alphanumeric code: 3 letters (AAA) + P/C/H/F/A/T/B/L/J/G (entity type) + 1 letter (surname first) + 4 digits + 1 check letter. Example: ABCDE1234F.' },
    ],
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
  'calorie calculator', 'calorie calculator india', 'tdee calculator', 'bmr calculator',
  'water intake calculator', 'sleep calculator', 'heart rate zones calculator',
  'steps to km', 'calories burned calculator', 'body fat calculator',
  'gst calculator', 'gst calculator india', 'sip calculator', 'roi calculator',
  'income tax calculator india', 'income tax calculator 2024-25', 'budget planner',
  'emi calculator', 'loan calculator', 'compound interest calculator',
  'simple interest calculator', 'gpa calculator', 'cgpa calculator',
  'number to words', 'number to words india', 'roman numeral converter',
  'date difference calculator', 'days between dates', 'random name generator',
  'discount calculator', 'tip calculator', 'scientific calculator',
  'word counter', 'character counter', 'case converter',
  'temperature converter', 'length converter', 'weight converter',
  'qr code generator', 'barcode generator', 'translate text',
  'student tools', 'online tools for students', 'free tools for students',
  'free online tools', 'best free tools', 'no signup tools',
  'no watermark tools', 'all in one tools', 'developer tools',
]
