import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  Search, MousePointerClick, Upload, Download, CheckCircle,
  ShieldCheck, Zap, Smartphone, Globe, Code2, FileText, Images,
  Calculator, Star, ChevronDown, Award, Users, Sparkles, X as XIcon,
} from 'lucide-react'

import SiteShell from '../../components/layout/SiteShell'
import { fetchPopularityMap } from '../../api/toolsApi'
import { useCatalogData } from '../../hooks/useCatalogData'
import { useDebounce } from '../../hooks/useDebounce'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import ToolCard from '../../components/tools/ToolCard'
import { loadUsage } from '../../lib/usageTracker'
import { searchTools } from '../../lib/toolSearch'
import HeroSection from './components/HeroSection'
import './home-modern.css'

const BENTO_FEATURES = [
  {
    icon: Zap, accent: '#56a6ff', span: 'span-2 large',
    stat: '1,200+', title: 'Free Professional Tools',
    desc: 'PDF, Image, Developer, Math, Text, AI, Color, Security, Finance, Health, Network, Video — every tool you need, completely free.',
  },
  {
    icon: ShieldCheck, accent: '#3ee58f', span: '',
    title: '100% Private & Secure',
    desc: 'Files are processed server-side and deleted immediately. We never store, share, or access your data.',
  },
  {
    icon: Smartphone, accent: '#f472b6', span: '',
    title: 'Works on All Devices',
    desc: 'Fully responsive design — works perfectly on phones, tablets, and desktops. No app needed.',
  },
  {
    icon: Globe, accent: '#f59e0b', span: '',
    title: 'No Signup. Ever.',
    desc: 'Every tool is instant-access. No account, no email, no payment, no watermarks. Just results.',
  },
  {
    icon: Code2, accent: '#a78bfa', span: '',
    title: 'Developer Utilities',
    desc: 'JWT decoder, JSON/YAML converters, formatters, minifiers, hash generators — built for developers.',
  },
  {
    icon: FileText, accent: '#22d3ee', span: '',
    title: 'Complete PDF Suite',
    desc: 'Merge, split, compress, convert, OCR, protect, annotate — the most complete free PDF toolkit.',
  },
  {
    icon: Images, accent: '#fb923c', span: '',
    title: '80+ Image Tools',
    desc: 'Compress, resize, crop, convert, remove background, passport photo, social media resizers and more.',
  },
  {
    icon: Calculator, accent: '#34d399', span: '',
    title: 'Student Calculators',
    desc: 'GPA, CGPA, BMI, EMI, compound interest, percentage, attendance — essential tools for students.',
  },
  {
    icon: Star, accent: '#e879f9', span: 'span-2',
    title: 'Better Than iLovePDF, SmallPDF & iLoveIMG',
    desc: 'ISHU TOOLS combines PDF + Image + Developer + Math tools in one platform — all free, no watermark, no limits. The most complete free alternative to iLovePDF, SmallPDF, PDFCandy, iLoveIMG, and pi7.org. 1,200+ tools, zero cost.',
  },
]

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ishu-kumar-5a0940281/' },
  { label: 'Instagram', href: 'https://www.instagram.com/ishukr10?igsh=OTNoaTJ2bm1ndWlp' },
  { label: 'YouTube', href: 'https://www.youtube.com/@ishu-fun' },
  { label: 'X', href: 'https://x.com/ISHU_IITP' },
]

const COMPARISON_ROWS = [
  { feature: 'PDF Tools', ishu: '124+', ilovepdf: '25+', smallpdf: '20+', canva: '5+' },
  { feature: 'Image Tools', ishu: '154+', ilovepdf: '0', smallpdf: '3+', canva: '50+' },
  { feature: 'Developer Tools', ishu: '80+', ilovepdf: '0', smallpdf: '0', canva: '0' },
  { feature: 'Math / Finance', ishu: '60+', ilovepdf: '0', smallpdf: '0', canva: '0' },
  { feature: 'Student Tools', ishu: '40+', ilovepdf: '0', smallpdf: '0', canva: '0' },
  { feature: 'AI Tools', ishu: '30+', ilovepdf: '5+', smallpdf: '3+', canva: '20+' },
  { feature: 'Video Tools', ishu: '15+', ilovepdf: '0', smallpdf: '0', canva: '10+' },
  { feature: 'No Signup', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
  { feature: 'No Watermark', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
  { feature: 'No File Limit', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
  { feature: '100% Free', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
]

function ComparisonCell({ val }: { val: string | boolean }) {
  if (typeof val === 'boolean') {
    return val
      ? <span className='cmp-yes'><CheckCircle size={15} /> Yes</span>
      : <span className='cmp-no'><XIcon size={15} /> No</span>
  }
  return <span className='cmp-val'>{val}</span>
}

function ComparisonTable() {
  return (
    <section className='comparison-section'>
      <span className='section-kicker'>Why Switch?</span>
      <h2>ISHU TOOLS vs Competitors</h2>
      <p className='comparison-sub'>
        One platform beats them all — more tools, 100% free, no signup, no watermark, no limits.
      </p>
      <div className='comparison-wrap'>
        <table className='comparison-table'>
          <thead>
            <tr>
              <th className='cmp-feature-col'>Feature</th>
              <th className='cmp-ishu'>
                <span className='cmp-logo'>ISHU TOOLS</span>
                <span className='cmp-best-badge'>Best</span>
              </th>
              <th>iLovePDF</th>
              <th>SmallPDF</th>
              <th>Canva</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature}>
                <td className='cmp-feature-name'>{row.feature}</td>
                <td className='cmp-ishu cmp-highlight'><ComparisonCell val={row.ishu} /></td>
                <td><ComparisonCell val={row.ilovepdf} /></td>
                <td><ComparisonCell val={row.smallpdf} /></td>
                <td><ComparisonCell val={row.canva} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function CreatorSection() {
  return (
    <section className='creator-section'>
      <div className='creator-inner'>
        <div className='creator-badge-wrap'>
          <div className='creator-avatar'>
            <span className='creator-avatar-text'>IK</span>
            <div className='creator-avatar-ring' />
          </div>
          <div className='creator-badges'>
            <span className='creator-badge'><Award size={12} /> IIT Patna</span>
            <span className='creator-badge'><Sparkles size={12} /> Founder</span>
            <span className='creator-badge'><Users size={12} /> 1M+ Users</span>
          </div>
        </div>
        <div className='creator-content'>
          <span className='section-kicker'>About the Creator</span>
          <h2>Built by Ishu Kumar, IIT Patna</h2>
          <p>
            ISHU TOOLS was created by <strong>Ishu Kumar</strong>, a student at <strong>IIT Patna</strong>,
            with a simple mission — to give every student and professional access to powerful tools
            completely free, without any signup, watermark, or hidden cost.
          </p>
          <p style={{ marginTop: '0.6rem', color: 'var(--muted)', fontSize: '0.93rem' }}>
            From the frustration of hitting paywalls and file limits on iLovePDF, SmallPDF, and similar
            platforms, ISHU TOOLS was born — 1,200+ tools, all free, all day, every day.
            <strong> ishutools.fun</strong> — the Indian Student Hub for digital tools.
          </p>
          <div className='creator-links'>
            {socialLinks.map((l) => (
              <a key={l.href} href={l.href} target='_blank' rel='noreferrer' className='creator-social-link'>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const FAQ_ITEMS = [
  {
    q: 'What is ISHU TOOLS? (ISHU TOOLS kya hai?)',
    a: 'ISHU TOOLS (Indian Student Hub University Tools) is a free online platform with 1,200+ tools for PDF processing, image editing, developer utilities, math calculators, text operations, and more. Created by Ishu Kumar from IIT Patna, it is designed for students and professionals — no signup, no watermark, completely free. ISHU TOOLS bilkul free hai, koi signup nahi lagta.',
  },
  {
    q: 'Is ISHU TOOLS free? (ISHU TOOLS free hai kya?)',
    a: 'Haan! ISHU TOOLS 100% free hai. All 1,200+ tools are available without any signup, registration, or payment. No watermarks, no limits, no hidden charges. Koi bhi tool use karo, bilkul free mein.',
  },
  {
    q: 'Is my data safe? (Mera data safe hai?)',
    a: 'Absolutely! All uploaded files are processed securely on our servers and automatically deleted after processing. We never store, share, or access your files. Your privacy is our top priority. Aapka data 100% secure hai.',
  },
  {
    q: 'Can I use ISHU TOOLS on mobile? (Mobile par use kar sakte hai?)',
    a: 'Yes! ISHU TOOLS is fully responsive and works perfectly on smartphones, tablets, laptops, and desktops. No app download needed. Mobile browser mein kholo aur koi bhi tool use karo.',
  },
  {
    q: 'What PDF tools are available?',
    a: 'ISHU TOOLS offers 124+ PDF tools: Merge PDF, Split PDF, Compress PDF, PDF to Word, Word to PDF, PDF to JPG, JPG to PDF, PDF to Excel, PDF to PowerPoint, OCR PDF, Protect PDF, Unlock PDF, Rotate PDF, Watermark PDF, Annotate PDF, Repair PDF, and many more — all free with no signup.',
  },
  {
    q: 'How to compress PDF online free? (PDF ko compress kaise kare?)',
    a: 'Go to ISHU TOOLS Compress PDF, drag and drop your PDF, choose compression level, and download the compressed file — completely free, no signup, no watermark. PDF compress karna bahut aasaan hai ISHU TOOLS mein.',
  },
  {
    q: 'How to remove image background free? (Background remove kaise kare free mein?)',
    a: 'Open ISHU TOOLS Remove Background tool, upload your image, and the AI will automatically remove the background in seconds. Download for free with no signup or watermark. Background remove karo free mein.',
  },
  {
    q: 'Is ISHU TOOLS better than iLovePDF or SmallPDF?',
    a: 'ISHU TOOLS offers all the same PDF tools as iLovePDF and SmallPDF, plus image tools, developer utilities, calculators, and more — all completely free with no signup, no watermark, and no file size limits. ISHU TOOLS is the best free alternative to iLovePDF, SmallPDF, and PDFCandy.',
  },
  {
    q: 'Does ISHU TOOLS have student calculator tools?',
    a: 'Yes! ISHU TOOLS has 40+ student tools: GPA Calculator, CGPA to Percentage, BMI Calculator, Age Calculator, Percentage Calculator, Scientific Calculator, Loan EMI Calculator, SIP Calculator, Compound Interest, Discount Calculator, Grade Calculator, Attendance Calculator, and more.',
  },
]

function AccordionFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className='home-faq-section'>
      <span className='section-kicker'>Got Questions?</span>
      <h2>Frequently Asked Questions</h2>
      <p style={{ color: 'var(--muted)', textAlign: 'center', maxWidth: '38rem', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
        Everything about ISHU TOOLS — answers in English and Hindi/Hinglish
      </p>
      <div className='faq-accordion'>
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={i}
              className={`faq-acc-item${isOpen ? ' open' : ''}`}
            >
              <button
                className='faq-acc-trigger'
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  className='faq-acc-icon'
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
                />
              </button>
              <div
                className='faq-acc-body'
                style={{
                  maxHeight: isOpen ? '400px' : '0',
                  opacity: isOpen ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease, opacity 0.25s ease',
                }}
              >
                <p className='faq-acc-answer'>{item.a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const SEO_KEYWORDS = [
  'ishu tools', 'ishu kumar iit patna', 'indian student hub university tools', 'ishutools.fun', 'ishutools.vercel.app',
  'merge pdf free', 'compress pdf online free', 'pdf to word online', 'word to pdf free',
  'compress image online', 'remove background free', 'resize image online', 'crop image free',
  'bmi calculator india', 'emi calculator india', 'sip calculator india', 'gst calculator india',
  'income tax calculator india', 'cgpa to percentage', '75% attendance calculator',
  'json formatter', 'base64 encoder decoder', 'qr code generator free', 'barcode generator',
  'password generator', 'uuid generator', 'hash generator md5 sha256',
  'pdf compress kaise kare', 'image background remove free mein', 'pdf merge kaise kare',
  'free tools for students india', 'online tools without signup', 'tools without watermark',
  'ilovepdf alternative free', 'smallpdf alternative free', 'pdfcandy alternative free',
  'youtube thumbnail downloader', 'instagram photo downloader', 'passport size photo maker',
  'word counter online', 'character counter', 'case converter online', 'text to speech free',
  'unit converter online', 'temperature converter', 'length converter', 'weight converter',
  'compound interest calculator', 'simple interest calculator', 'age calculator online',
  'days between dates', 'time zone converter', 'roman numeral converter',
  'color picker online', 'hex to rgb converter', 'gradient generator css',
  'regex tester online', 'diff checker online', 'sql formatter online', 'html beautifier',
  'css minifier', 'javascript minifier', 'json to csv converter', 'csv to json online',
  'ocr pdf free', 'pdf annotator online', 'pdf watermark remover free', 'unlock pdf online',
  'pdf to excel free', 'excel to pdf online', 'pdf to powerpoint', 'powerpoint to pdf',
  'meme generator online', 'photo collage maker free', 'image to pdf converter',
  'svg optimizer', 'webp to jpg converter', 'heic to jpg converter', 'png to jpg online',
]

function SEOCloud() {
  return (
    <div className='seo-cloud' aria-hidden='true'>
      {SEO_KEYWORDS.map((kw) => (
        <span key={kw} className='seo-cloud-tag'>{kw}</span>
      ))}
    </div>
  )
}

function ToolSkeleton() {
  return (
    <div className='tool-skeleton-section'>
      <div className='tool-skeleton-header'>
        <div className='skeleton-shimmer' style={{ width: '120px', height: '14px', borderRadius: '6px' }} />
        <div className='skeleton-shimmer' style={{ width: '200px', height: '22px', borderRadius: '8px', marginTop: '6px' }} />
      </div>
      <div className='tool-grid'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='skeleton-shimmer tool-skeleton-card' />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const { categories, tools, loading, error, apiReady } = useCatalogData()
  const [query, setQuery] = useState('')
  const [globalPopularity, setGlobalPopularity] = useState<Record<string, number>>({})
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Tighter debounce — 90ms feels instant while still avoiding work per keystroke.
  const debouncedQuery = useDebounce(query, 90)
  const isSearching = debouncedQuery.trim().length > 0

  useEffect(() => {
    applyDocumentBranding(
      'ISHU TOOLS — Indian Student Hub University Tools | 1200+ Free Online Tools',
      '1200+ free online tools for students & professionals. PDF, Image, Developer, Math, Text, AI, finance, health & video tools — no signup, no watermark.',
      '#3bd0ff',
    )
  }, [])

  // Global keyboard shortcuts:
  //   `/`  → focus search (skip when typing in another input/textarea/contenteditable).
  //   Esc  → clear current search and blur (only when search input itself is focused).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      const typingInField =
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable
      if (e.key === '/' && !typingInField) {
        e.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const counts = useMemo(() => {
    const byCategory = Object.fromEntries(categories.map((category) => [category.id, 0]))
    let pdfCount = 0
    let imageCount = 0

    for (const tool of tools) {
      byCategory[tool.category] = (byCategory[tool.category] || 0) + 1
      if (tool.category.startsWith('pdf') || tool.slug.includes('pdf')) pdfCount += 1
      if (tool.category.startsWith('image') || tool.slug.includes('image')) imageCount += 1
    }

    return { byCategory, pdfCount, imageCount }
  }, [categories, tools])

  // Lookup: category id → category label, used by the flat search-result grid.
  const categoryLabelById = useMemo(() => {
    const map = new Map<string, { label: string; accent: string }>()
    for (const c of categories) {
      const theme = getCategoryTheme(c.id)
      map.set(c.id, { label: c.label, accent: theme.accent })
    }
    return map
  }, [categories])

  // Snapshot personal usage once per page mount so the order is stable while you scroll.
  // Tools you've actually opened bubble above untouched ones with the same popularity_rank.
  const usageSnapshot = useMemo<Record<string, number>>(() => loadUsage(), [])

  useEffect(() => {
    let mounted = true
    void fetchPopularityMap()
      .then((counts) => {
        if (mounted) setGlobalPopularity(counts)
      })
      .catch(() => {
        // Ignore popularity fetch failures; local ranking still works.
      })
    return () => {
      mounted = false
    }
  }, [])

  const filteredTools = useMemo(() => {
    return searchTools(tools, debouncedQuery, {
      localUsage: usageSnapshot,
      globalPopularity,
    })
  }, [debouncedQuery, tools, usageSnapshot, globalPopularity])

  const totalVisibleTools = filteredTools.length

  return (
    <SiteShell>
      <div className='page-wrap home-wrap'>
        <div className='hm-scroll-progress' aria-hidden='true' />
        <HeroSection
          toolCount={tools.length}
          categoryCount={categories.length}
          pdfCount={counts.pdfCount}
          imageCount={counts.imageCount}
          apiReady={apiReady}
          socialLinks={socialLinks}
        />

        {/* Removed: inspired-brands marquee (Apple, Stripe, Linear, ...) — visual fluff that pushed tools below the fold. */}

        {/* ── Smart search panel ───────────────────────────────────────────────
             Category-pill filter row removed by request — search is now the
             single, prominent way to narrow the directory. Press `/` to focus
             from anywhere, Esc to clear. Result count and clear (×) button
             give instant feedback as you type.
        */}
        <section className='surface-panel search-panel'>
          <div className='toolbar-meta'>
            <div>
              <span className='section-kicker'>Smart directory</span>
              <h2>Find the exact tool fast</h2>
            </div>
            <p>
              Type to instantly search all {tools.length || '1,200+'} tools by name, tag, or
              workflow. Press <kbd className='kbd'>/</kbd> from anywhere to focus,{' '}
              <kbd className='kbd'>Esc</kbd> to clear.
            </p>
          </div>

          <div className='search-control'>
            <label className='search-input search-input-xl'>
              <Search size={20} />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder='Search merge, compress, OCR, JSON, BMI, EMI, remove background…'
                autoComplete='off'
                spellCheck={false}
                aria-label='Search all tools'
              />
              {query && (
                <button
                  type='button'
                  className='search-clear-btn'
                  onClick={() => {
                    setQuery('')
                    searchInputRef.current?.focus()
                  }}
                  aria-label='Clear search'
                >
                  <XIcon size={16} />
                </button>
              )}
              <span className='search-result-count' aria-live='polite'>
                {isSearching
                  ? `${totalVisibleTools} ${totalVisibleTools === 1 ? 'match' : 'matches'}`
                  : `${tools.length || 0} tools`}
              </span>
            </label>
          </div>
        </section>

        {/* ── Unified flat tool directory ───────────────────────────────────
             Per request: no Categories section, no "Most Popular" pinned row,
             no "Show more". A single intelligently-sorted grid containing
             every tool — daily-use tools surface first via popularity_rank +
             personal usage signal. Same grid shape for both idle and search,
             so the experience stays focused on the tools themselves. */}
        <section id='tool-directory' className='directory-stack'>
          {loading && (
            <>
              <ToolSkeleton />
              <ToolSkeleton />
              <ToolSkeleton />
            </>
          )}
          {error && <p className='status-text error'>{error}</p>}

          {!loading && !error && isSearching && filteredTools.length === 0 && (
            <article className='empty-state'>
              <h3>No tools matched “{debouncedQuery}”</h3>
              <p>Try a shorter keyword, or press Esc to see all {tools.length} tools.</p>
            </article>
          )}

          {!loading && !error && filteredTools.length > 0 && (
            <section className='tool-section all-tools-section'>
              <header className='section-heading'>
                <div className='section-heading-left'>
                  <span className='section-kicker'>
                    {isSearching ? 'Search results' : 'All tools'}
                  </span>
                  <div className='section-heading-title-row'>
                    <h2>
                      {isSearching ? `“${debouncedQuery}”` : 'Every tool, smart-sorted'}
                    </h2>
                    <span className='tool-count-badge'>{totalVisibleTools} tools</span>
                  </div>
                </div>
                <p>
                  {isSearching
                    ? 'Ranked by relevance, your usage, and daily demand.'
                    : 'Daily-use tools surface first in one complete, visible directory.'}
                </p>
              </header>
              <div className='tool-grid'>
                {filteredTools.map((tool) => {
                  const meta = categoryLabelById.get(tool.category)
                  return (
                    <ToolCard
                      key={tool.slug}
                      tool={tool}
                      categoryLabel={meta?.label ?? tool.category}
                      accentColor={meta?.accent ?? '#56a6ff'}
                    />
                  )
                })}
              </div>
            </section>
          )}
        </section>

        {/* Marketing sections — hidden during search so results stay the focus.
            User asked: "when I search for a tool, I do not want distracting sections … in the way." */}
        {!isSearching && (
        <>
        <section className='features-bento-section'>
          <span className='section-kicker'>Why ISHU TOOLS?</span>
          <h2>Everything You Need. 100% Free. Always.</h2>
          <p>The most complete free online toolkit — more tools than iLovePDF, iLoveIMG, SmallPDF, PDFCandy, and pi7.org combined.</p>
          <div className='bento-grid'>
            {BENTO_FEATURES.map((f) => (
              <div
                key={f.title}
                className={`bento-card${f.span ? ' ' + f.span : ''}`}
                style={{ '--bento-accent': f.accent } as CSSProperties}
              >
                <div className='bento-icon'><f.icon size={20} /></div>
                {f.stat && <span className='bento-stat'>{f.stat}</span>}
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <ComparisonTable />

        <section className='how-it-works-section'>
          <span className='section-kicker'>Simple &amp; Fast</span>
          <h2>How ISHU TOOLS Works</h2>
          <p style={{ color: 'var(--muted)', maxWidth: '42rem', margin: '0 auto 0.5rem', fontSize: '0.97rem' }}>
            Get things done in seconds — no account, no watermark, no cost.
          </p>
          <div className='steps-grid'>
            <div className='step-card'>
              <div className='step-number'><MousePointerClick size={20} /></div>
              <h3>1. Choose a Tool</h3>
              <p>Search from 1,200+ free tools across 54 categories — PDF, Image, Developer, Math, and more. Each tool has its own dedicated page.</p>
            </div>
            <div className='step-card'>
              <div className='step-number'><Upload size={20} /></div>
              <h3>2. Upload or Enter Data</h3>
              <p>Drag &amp; drop your files or enter text and values. Multi-file uploads supported. All files are processed securely with no storage.</p>
            </div>
            <div className='step-card'>
              <div className='step-number'><Download size={20} /></div>
              <h3>3. Run &amp; Download</h3>
              <p>Click "Run" and get your result instantly. Download the processed file or copy the output. No signup, no watermark, 100% free.</p>
            </div>
            <div className='step-card'>
              <div className='step-number'><CheckCircle size={20} /></div>
              <h3>4. Done — Every Time</h3>
              <p>All tools are production-ready, accurate, and reliable. Works on all devices — mobile, tablet, laptop, desktop. No app needed.</p>
            </div>
          </div>
        </section>

        <CreatorSection />

        <AccordionFAQ />

        <SEOCloud />
        </>
        )}

        <footer className='home-footer'>
          <p>
            {loading
              ? <>1,200+ tools · 54 categories · Free forever · No signup · No watermark</>
              : <><strong>{totalVisibleTools}</strong> tools · <strong>{categories.length}</strong> categories · Free forever · No signup · No watermark</>
            }
          </p>
        </footer>
      </div>
    </SiteShell>
  )
}
