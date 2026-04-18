/**
 * ISHU TOOLS — Per-tool SEO Data (COMPREHENSIVE v2)
 * Every tool gets unique title, description, keywords, and FAQ for Google #1 ranking.
 * Optimized for: high-volume, long-tail, competitor comparison, Ishu-branded, niche keywords.
 * 510+ tools covered — handcrafted entries take priority, smart auto-generator covers the rest.
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
  // Trim description to 160 chars max for SEO
  if (description.length > 160) description = description.substring(0, 157) + '...'

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

  return Array.from(new Set(kw)).slice(0, 120)
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

  return faqs.slice(0, 7)
}

function mergeToolSEO(custom: ToolSEO, generated: ToolSEO): ToolSEO {
  const keywords = Array.from(new Set([...custom.keywords, ...generated.keywords])).slice(0, 120)
  const faq = [...custom.faq]
  for (const item of generated.faq) {
    if (!faq.some((existing) => existing.question === item.question)) faq.push(item)
  }
  return { ...custom, keywords, faq: faq.slice(0, 8) }
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
    description: 'Convert time between time zones online for free. IST to EST, UTC to PST, and 600+ time zones worldwide. Essential for international meetings and remote work.',
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
