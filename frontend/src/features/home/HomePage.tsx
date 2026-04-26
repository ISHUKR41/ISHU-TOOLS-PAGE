import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  Search, MousePointerClick, Upload, Download, CheckCircle,
  ShieldCheck, Zap, Smartphone, Globe, Code2, FileText, Images,
  Calculator, Star, ChevronDown, Award, Users, Sparkles, X as XIcon,
  Shuffle,
} from 'lucide-react'

import SiteShell from '../../components/layout/SiteShell'
import { fetchPopularityMap } from '../../api/toolsApi'
import { useCatalogData } from '../../hooks/useCatalogData'
import { useDebounce } from '../../hooks/useDebounce'
import { useProgressiveList } from '../../hooks/useProgressiveList'
import { useToolRecents } from '../../hooks/useToolRecents'
import { usePinnedTools } from '../../hooks/usePinnedTools'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import ToolCard from '../../components/tools/ToolCard'
import { loadUsage } from '../../lib/usageTracker'
import { searchTools, getToolPriorityScore } from '../../lib/toolSearch'
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

const RECENT_SEARCHES_KEY = 'ishu-recent-searches-v1'
const RECENT_SEARCH_LIMIT = 6

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((s) => typeof s === 'string' && s.trim().length > 0).slice(0, RECENT_SEARCH_LIMIT)
  } catch {
    return []
  }
}

function saveRecentSearches(searches: string[]) {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, RECENT_SEARCH_LIMIT)))
  } catch {
    /* localStorage may be disabled — silently ignore */
  }
}

export default function HomePage() {
  const { categories, tools, loading, error, apiReady } = useCatalogData()
  const [query, setQuery] = useState('')
  const [globalPopularity, setGlobalPopularity] = useState<Record<string, number>>({})
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchFocused, setSearchFocused] = useState(false)
  // Shuffle index for the "Suggested for you" row — each click advances by one
  // window-step through the deeper candidate pool so users can keep refreshing
  // without ever leaving the page. Resets implicitly on full reload because we
  // intentionally don't persist it: a fresh visit should show the strongest
  // picks first, not whatever window the user landed on last time.
  const [suggestedShuffleIndex, setSuggestedShuffleIndex] = useState(0)
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

  const baseFilteredTools = useMemo(() => {
    return searchTools(tools, debouncedQuery, {
      localUsage: usageSnapshot,
      globalPopularity,
    })
  }, [debouncedQuery, tools, usageSnapshot, globalPopularity])

  // Apply category chip filter (only meaningful when actively searching).
  const filteredTools = useMemo(() => {
    if (!isSearching || activeCategory === 'all') return baseFilteredTools
    return baseFilteredTools.filter((tool) => tool.category === activeCategory)
  }, [baseFilteredTools, activeCategory, isSearching])

  // ─── Pinned + Recently-used tools (per-user, localStorage) ────────────
  // Pinned = explicit user intent (favorites), shown above Recently used.
  // Recently used = automatic history. Both hidden during active search
  // so results stay the focus, and both lookup against the live catalogue
  // so renamed/removed slugs are silently dropped.
  const recentSlugs = useToolRecents()
  const { slugs: pinnedSlugs } = usePinnedTools()
  const toolBySlug = useMemo(() => new Map(tools.map((t) => [t.slug, t])), [tools])

  const pinnedTools = useMemo(() => {
    if (pinnedSlugs.length === 0 || tools.length === 0) return []
    return pinnedSlugs.map((s) => toolBySlug.get(s)).filter((t): t is NonNullable<typeof t> => Boolean(t))
  }, [pinnedSlugs, tools, toolBySlug])

  const pinnedSet = useMemo(() => new Set(pinnedSlugs), [pinnedSlugs])
  const recentTools = useMemo(() => {
    if (recentSlugs.length === 0 || tools.length === 0) return []
    const out = []
    for (const slug of recentSlugs) {
      // Skip anything already shown in the Pinned row above to avoid
      // visual duplication — a pinned tool you just opened shouldn't
      // appear twice in two consecutive sections.
      if (pinnedSet.has(slug)) continue
      const t = toolBySlug.get(slug)
      if (t) out.push(t)
      if (out.length >= 6) break
    }
    return out
  }, [recentSlugs, tools, toolBySlug, pinnedSet])

  // ─── Suggested for you ───────────────────────────────────────────────
  // Discovery row that uses the same priority engine as the All-tools sort
  // but boosts categories the user has already shown interest in. Designed
  // to introduce people to tools they haven't tried yet — the value of
  // 1299 tools is wasted if a user only ever sees the same 6 they pinned.
  //
  // Signal sources (all client-side, no backend trip):
  //   • pinnedSlugs        → strongest interest signal (×3 weight)
  //   • recent visits      → automatic history (×1 weight)
  //   • local visit count  → lifetime usage on this device (×0.5 per visit)
  //
  // If a user has zero signal (true first-time visitor) the row hides
  // itself rather than showing a generic recommendation. The All-tools
  // grid below already shows them the best defaults.
  const suggestedTools = useMemo(() => {
    if (tools.length === 0) return []
    const categoryInterest = new Map<string, number>()
    const seenSlugs = new Set<string>()
    // Pinned tools are the strongest signal
    for (const slug of pinnedSlugs) {
      seenSlugs.add(slug)
      const t = toolBySlug.get(slug)
      if (t) categoryInterest.set(t.category, (categoryInterest.get(t.category) ?? 0) + 3)
    }
    // Recent (cap at first 12) is the next-strongest
    for (const slug of recentSlugs.slice(0, 12)) {
      seenSlugs.add(slug)
      const t = toolBySlug.get(slug)
      if (t) categoryInterest.set(t.category, (categoryInterest.get(t.category) ?? 0) + 1)
    }
    // Lifetime visits add a small ambient signal so power users still get
    // suggestions in their dominant categories even after they clear recents
    for (const [slug, visits] of Object.entries(usageSnapshot)) {
      if (visits <= 0) continue
      seenSlugs.add(slug)
      const t = toolBySlug.get(slug)
      if (t) categoryInterest.set(t.category, (categoryInterest.get(t.category) ?? 0) + visits * 0.5)
    }
    if (categoryInterest.size === 0) return { pool: [] as typeof tools, topCategoryIds: [] as string[] }
    // Score every UNVISITED tool with the priority engine and add an
    // interest-category multiplier so suggestions stay topical
    const candidates: Array<{ tool: typeof tools[number]; score: number }> = []
    for (const tool of tools) {
      if (seenSlugs.has(tool.slug)) continue
      const interest = categoryInterest.get(tool.category) ?? 0
      if (interest <= 0) continue
      const base = getToolPriorityScore(tool, usageSnapshot, globalPopularity)
      candidates.push({ tool, score: base + interest * 12 })
    }
    candidates.sort((a, b) => b.score - a.score || a.tool.title.localeCompare(b.tool.title))
    // Top categories by interest — used to render the "Because you use X" line
    // so suggestions feel transparent instead of mysterious. We expose at most
    // two so the explanation stays short on mobile.
    const topCategoryIds = Array.from(categoryInterest.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([id]) => id)
    // Keep up to 24 high-scoring candidates so the shuffle button has real
    // depth to rotate through (4 distinct slates of 6). 24 is small enough
    // that keeping them in memory is free, but big enough to feel fresh on
    // every shuffle even for users with narrow category interests.
    return { pool: candidates.slice(0, 24).map((c) => c.tool), topCategoryIds }
  }, [tools, toolBySlug, pinnedSlugs, recentSlugs, usageSnapshot, globalPopularity])

  // Sliding window of 6 over the pool. Each shuffle advances the start index
  // by 6 and wraps around — deterministic, predictable, and guarantees every
  // press visibly changes the row. We compute against pool.length so a small
  // pool (e.g. user only uses one tiny category) still rotates correctly.
  const visibleSuggested = useMemo(() => {
    const pool = suggestedTools.pool
    if (pool.length === 0) return []
    if (pool.length <= 6) return pool.slice(0, 6)
    const slates = Math.max(1, Math.ceil(pool.length / 6))
    const slate = ((suggestedShuffleIndex % slates) + slates) % slates
    const start = (slate * 6) % pool.length
    // Wrap around the pool boundary so the last slate is still a full 6 cards
    // even when pool.length isn't a perfect multiple of 6.
    const out: typeof pool = []
    for (let i = 0; i < 6 && i < pool.length; i++) {
      out.push(pool[(start + i) % pool.length])
    }
    return out
  }, [suggestedTools.pool, suggestedShuffleIndex])

  // Shuffle is only meaningful when there's more in the pool than what's
  // visible — otherwise pressing the button would just re-show the same 6.
  const canShuffleSuggested = suggestedTools.pool.length > 6

  // Build a short, human-readable reason like "Because you use PDF and Image
  // tools" by looking up the friendly category labels. Falls back to the raw
  // category id if no label is registered (defensive — labels can race the
  // catalog load on first paint).
  const suggestedReason = useMemo(() => {
    const ids = suggestedTools.topCategoryIds
    if (ids.length === 0) return ''
    const labels = ids
      .map((id) => categoryLabelById.get(id)?.label ?? id)
      .filter(Boolean)
    if (labels.length === 0) return ''
    if (labels.length === 1) return `Because you use ${labels[0]} tools`
    return `Because you use ${labels[0]} and ${labels[1]} tools`
  }, [suggestedTools.topCategoryIds, categoryLabelById])

  // Derive the categories present in the *current* search results so we only
  // show chips that actually have hits — counts are shown next to each label.
  const searchResultCategories = useMemo(() => {
    if (!isSearching) return []
    const counts = new Map<string, number>()
    for (const tool of baseFilteredTools) {
      counts.set(tool.category, (counts.get(tool.category) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([id, count]) => ({
        id,
        label: categoryLabelById.get(id)?.label ?? id,
        accent: categoryLabelById.get(id)?.accent ?? '#56a6ff',
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }, [baseFilteredTools, categoryLabelById, isSearching])

  // Reset the category chip whenever the user clears the search — chip filter
  // only makes sense in an active-search context.
  useEffect(() => {
    if (!isSearching && activeCategory !== 'all') setActiveCategory('all')
  }, [isSearching, activeCategory])

  const totalVisibleTools = filteredTools.length

  // ── Recent searches: load once, persist whenever a real query stabilises ──
  useEffect(() => {
    setRecentSearches(loadRecentSearches())
  }, [])

  useEffect(() => {
    const term = debouncedQuery.trim()
    if (term.length < 2) return
    setRecentSearches((prev) => {
      const next = [term, ...prev.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(
        0,
        RECENT_SEARCH_LIMIT,
      )
      saveRecentSearches(next)
      return next
    })
  }, [debouncedQuery])

  const clearRecentSearches = () => {
    setRecentSearches([])
    saveRecentSearches([])
  }

  const showRecentDropdown = searchFocused && !query.trim() && recentSearches.length > 0

  // Progressive rendering: avoid mounting all 1247 ToolCards on first paint.
  // - Idle state (no query): start with 240 cards, idle-stream the rest.
  // - Searching: render all matches instantly (almost always < 100).
  const { visible: visibleTools, isComplete: gridComplete } = useProgressiveList(
    filteredTools,
    { initial: 240, step: 200, renderAll: isSearching },
  )

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
                onFocus={() => setSearchFocused(true)}
                // Defer blur so users can click on a recent-search chip before
                // the dropdown disappears. 120ms is below human perception.
                onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
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

            {/* ── Recent searches dropdown ─────────────────────────────────
                 Surfaces the last 6 distinct searches when the input is
                 focused with no query — one tap to re-run a previous lookup.
                 Persists in localStorage; clearable. */}
            {showRecentDropdown && (
              <div
                className='search-recent-dropdown'
                role='listbox'
                aria-label='Recent searches'
                onMouseDown={(e) => e.preventDefault() /* keep input focused */}
              >
                <div className='search-recent-header'>
                  <span>Recent searches</span>
                  <button
                    type='button'
                    className='search-recent-clear'
                    onClick={clearRecentSearches}
                  >
                    Clear
                  </button>
                </div>
                <div className='search-recent-chips'>
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      type='button'
                      className='search-recent-chip'
                      onClick={() => {
                        setQuery(term)
                        searchInputRef.current?.focus()
                      }}
                    >
                      <Search size={12} />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Search-time category chip filter ─────────────────────────────
               Per request: NOT a homepage section. Only renders when the user
               is actively searching, lets them narrow results to a single
               category. Each chip shows the live hit count. */}
          {isSearching && searchResultCategories.length > 1 && (
            <div className='search-category-chips' role='tablist' aria-label='Filter results by category'>
              <button
                type='button'
                className={`search-cat-chip${activeCategory === 'all' ? ' is-active' : ''}`}
                onClick={() => setActiveCategory('all')}
                role='tab'
                aria-selected={activeCategory === 'all'}
              >
                All
                <span className='search-cat-chip-count'>{baseFilteredTools.length}</span>
              </button>
              {searchResultCategories.map((cat) => (
                <button
                  key={cat.id}
                  type='button'
                  className={`search-cat-chip${activeCategory === cat.id ? ' is-active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  role='tab'
                  aria-selected={activeCategory === cat.id}
                  style={{ '--chip-accent': cat.accent } as CSSProperties}
                >
                  {cat.label}
                  <span className='search-cat-chip-count'>{cat.count}</span>
                </button>
              ))}
            </div>
          )}
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

          {/* ── Pinned (favorites) ─────────────────────────────────────────
               Explicit user intent — they actively pinned these tools so
               they sit at the very top, above Recently Used. Each card has
               a pin button on it, click to toggle. Pure localStorage. */}
          {!loading && !error && !isSearching && pinnedTools.length > 0 && (
            <section className='tool-section pinned-tools-section'>
              <header className='section-heading'>
                <div className='section-heading-left'>
                  <span className='section-kicker'>Your favorites</span>
                  <div className='section-heading-title-row'>
                    <h2>Pinned tools</h2>
                    <span className='tool-count-badge'>{pinnedTools.length}</span>
                  </div>
                </div>
                <p>Click the pin on any tool to add it here. Saved on this device.</p>
              </header>
              <div className='tool-grid'>
                {pinnedTools.map((tool) => {
                  const meta = categoryLabelById.get(tool.category)
                  return (
                    <ToolCard
                      key={`pinned-${tool.slug}`}
                      tool={tool}
                      categoryLabel={meta?.label ?? tool.category}
                      accentColor={meta?.accent ?? '#56a6ff'}
                      visits={usageSnapshot[tool.slug]}
                    />
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Recently used (per-user) ───────────────────────────────────
               Hidden during active search, hidden until the catalogue is
               ready, and hidden for first-time visitors. Pure localStorage,
               no backend trip — works offline and on Vercel cold-start. */}
          {!loading && !error && !isSearching && recentTools.length > 0 && (
            <section className='tool-section recent-tools-section'>
              <header className='section-heading'>
                <div className='section-heading-left'>
                  <span className='section-kicker'>For you</span>
                  <div className='section-heading-title-row'>
                    <h2>Recently used</h2>
                    <span className='tool-count-badge'>{recentTools.length}</span>
                  </div>
                </div>
                <p>Pick up where you left off — saved on this device only.</p>
              </header>
              <div className='tool-grid'>
                {recentTools.map((tool) => {
                  const meta = categoryLabelById.get(tool.category)
                  return (
                    <ToolCard
                      key={`recent-${tool.slug}`}
                      tool={tool}
                      categoryLabel={meta?.label ?? tool.category}
                      accentColor={meta?.accent ?? '#56a6ff'}
                      visits={usageSnapshot[tool.slug]}
                    />
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Suggested for you ─────────────────────────────────────────
               Discovery row that turns the priority engine into a recommender.
               Hidden during search, hidden for true first-time visitors, and
               hidden when the catalog hasn't loaded yet. Skips anything the
               user has already pinned or visited so it's pure new-territory. */}
          {!loading && !error && !isSearching && visibleSuggested.length > 0 && (
            <section className='tool-section suggested-tools-section'>
              <header className='section-heading'>
                <div className='section-heading-left'>
                  <span className='section-kicker'>Discover</span>
                  <div className='section-heading-title-row'>
                    <h2>Suggested for you</h2>
                    <span className='tool-count-badge'>{visibleSuggested.length}</span>
                    {canShuffleSuggested && (
                      <button
                        type='button'
                        className='suggested-shuffle-btn'
                        onClick={() => setSuggestedShuffleIndex((i) => i + 1)}
                        aria-label='Shuffle suggestions'
                        title='Show different picks from the same categories'
                      >
                        <Shuffle size={14} aria-hidden='true' />
                        <span>Shuffle</span>
                      </button>
                    )}
                  </div>
                </div>
                <p>
                  {suggestedReason
                    ? `${suggestedReason} — fresh picks you haven’t opened yet.`
                    : 'New tools picked from the categories you already use.'}
                </p>
              </header>
              <div className='tool-grid' key={`suggested-slate-${suggestedShuffleIndex}`}>
                {visibleSuggested.map((tool) => {
                  const meta = categoryLabelById.get(tool.category)
                  return (
                    <ToolCard
                      key={`suggested-${tool.slug}`}
                      tool={tool}
                      categoryLabel={meta?.label ?? tool.category}
                      accentColor={meta?.accent ?? '#56a6ff'}
                      visits={usageSnapshot[tool.slug]}
                    />
                  )
                })}
              </div>
            </section>
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
                {visibleTools.map((tool) => {
                  const meta = categoryLabelById.get(tool.category)
                  return (
                    <ToolCard
                      key={tool.slug}
                      tool={tool}
                      categoryLabel={meta?.label ?? tool.category}
                      accentColor={meta?.accent ?? '#56a6ff'}
                      query={isSearching ? debouncedQuery : undefined}
                      visits={usageSnapshot[tool.slug]}
                    />
                  )
                })}
              </div>
              {!gridComplete && !isSearching && (
                <p className='progressive-hint' aria-live='polite'>
                  Streaming the rest of the catalogue…
                </p>
              )}
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
