import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, Star, Clock, TrendingUp, Grid3X3, List, X,
  Flame, Bookmark, SlidersHorizontal, Zap, ChevronDown, Hash, LayoutGrid
} from 'lucide-react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

import SiteShell from '../../components/layout/SiteShell'
import { useCatalogData } from '../../hooks/useCatalogData'
import { useDebounce } from '../../hooks/useDebounce'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import ToolIcon from '../../components/tools/ToolIcon'

/* ─── Constants ─────────────────────────────────────────── */

const POPULAR_TOOLS = [
  { slug: 'merge-pdf',             label: 'Merge PDF',       emoji: '📄', cat: 'pdf-core',       hot: true  },
  { slug: 'compress-pdf',          label: 'Compress PDF',    emoji: '🗜️', cat: 'pdf-core',       hot: true  },
  { slug: 'compress-image',        label: 'Compress Image',  emoji: '🖼️', cat: 'image-core',     hot: true  },
  { slug: 'remove-background',     label: 'Remove BG',       emoji: '✂️', cat: 'image-core',     hot: true  },
  { slug: 'json-formatter',        label: 'JSON Formatter',  emoji: '{ }', cat: 'developer-tools', hot: false },
  { slug: 'bmi-calculator',        label: 'BMI Calculator',  emoji: '⚖️', cat: 'health-tools',   hot: false },
  { slug: 'password-generator',    label: 'Password Gen',    emoji: '🔑', cat: 'hash-crypto',    hot: false },
  { slug: 'qr-code-generator',     label: 'QR Generator',    emoji: '⬛', cat: 'developer-tools', hot: true  },
  { slug: 'pdf-to-word',           label: 'PDF to Word',     emoji: '📝', cat: 'office-suite',   hot: false },
  { slug: 'word-to-pdf',           label: 'Word to PDF',     emoji: '📋', cat: 'office-suite',   hot: false },
  { slug: 'resize-image',          label: 'Resize Image',    emoji: '📐', cat: 'image-core',     hot: false },
  { slug: 'emi-calculator-advanced',label: 'EMI Calc',       emoji: '💰', cat: 'finance-tools',  hot: false },
  { slug: 'gst-calculator-india',  label: 'GST Calc',        emoji: '🧾', cat: 'finance-tools',  hot: true  },
  { slug: 'base64-encode',         label: 'Base64 Encode',   emoji: '🔢', cat: 'developer-tools', hot: false },
  { slug: 'word-counter',          label: 'Word Counter',    emoji: '📊', cat: 'text-ops',       hot: false },
  { slug: 'uuid-generator',        label: 'UUID Gen',        emoji: '🆔', cat: 'developer-tools', hot: false },
  { slug: 'image-to-text',         label: 'Image to Text',   emoji: '🔤', cat: 'ocr-vision',     hot: true  },
  { slug: 'youtube-downloader',    label: 'YT Download',     emoji: '▶️', cat: 'video-tools',    hot: true  },
  { slug: 'scientific-calculator', label: 'Scientific Calc', emoji: '🔬', cat: 'math-tools',     hot: false },
  { slug: 'compress-to-100kb',     label: 'Compress to 100KB',emoji: '📦', cat: 'image-core',   hot: true  },
]

const TRENDING_SLUGS = new Set([
  'merge-pdf', 'compress-image', 'remove-background', 'qr-code-generator',
  'gst-calculator-india', 'image-to-text', 'youtube-downloader', 'compress-to-100kb',
])

const NEW_SLUGS = new Set([
  'compress-to-100kb', 'youtube-downloader', 'image-to-text',
  'scientific-calculator', 'uuid-generator',
])

const CATEGORY_PRIORITY: string[] = [
  // Highest traffic — core tool categories
  'unit-converter',       // 156 tools
  'developer-tools',      // 129 tools
  'video-tools',          // 83 tools
  'student-tools',        // 70 tools
  'finance-tools',        // 63 tools
  'image-core',           // 62 tools
  'text-ops',             // 51 tools
  'audio-tools',          // 47 tools
  'image-layout',         // 48 tools
  'format-lab',           // 35 tools
  'image-tools',          // 34 tools
  'productivity',         // 33 tools
  'health-tools',         // 26 tools
  'image-enhance',        // 24 tools
  'utility',              // 24 tools
  // Mid-tier
  'developer',            // 14 tools
  'seo-tools',            // 15 tools
  'network-tools',        // 13 tools
  'text-operations',      // 12 tools
  'pdf-advanced',         // 15 tools
  'pdf-core',             // 11 tools
  'office-suite',         // 16 tools
  'math-tools',           // 28 tools
  'security-tools',       // 10 tools
  'color-tools',          // 10 tools
  'audio',                // 10 tools
  'ocr-vision',           // 9 tools
  'writing-tools',        // 8 tools
  'text-ai',              // 8 tools
  'video',                // 8 tools
  'social-media',         // 7 tools
  'document-convert',     // 7 tools
  'developer-generators', // 6 tools
  'hr-jobs',              // 6 tools
  'text-cleanup',         // 6 tools
  'batch-automation',     // 6 tools
  'crypto-web3',          // 5 tools
  'math-calculators',     // 5 tools
  // Niche / specialty
  'pdf-security',         // 7 tools
  'image-effects',        // 12 tools
  'ai-writing',           // 4 tools
  'business-tools',       // 6 tools
  'travel-tools',         // 4 tools
  'health-fitness',       // 4 tools
  'page-ops',             // 15 tools
  'data-tools',           // 11 tools
  'ebook-convert',        // 11 tools
  'vector-lab',           // 6 tools
  'archive-lab',          // 4 tools
  'pdf-insights',         // 5 tools
  'code-tools',           // 4 tools
  'hash-crypto',          // 4 tools
  'conversion-tools',     // 10 tools
  'finance-tax',          // 2 tools
  'science-tools',        // 3 tools
  'geography-tools',      // 3 tools
  'cooking-tools',        // 3 tools
  'legal-tools',          // 3 tools
  'health-calculators',   // 3 tools
  'productivity-tools',   // 2 tools
  'pdf-tools',            // 1 tool
]

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
  { value: 'count-desc', label: 'Most Tools' },
  { value: 'count-asc', label: 'Fewest Tools' },
] as const
type SortOption = (typeof SORT_OPTIONS)[number]['value']

const FAVORITES_KEY = 'ishu_fav_tools'
const RECENT_KEY   = 'ishu_recent_tools'
const MAX_RECENT   = 12

/* ─── localStorage helpers ──────────────────────────────── */

function loadFavorites(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')) } catch { return new Set() }
}
function saveFavorites(f: Set<string>) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...f])) } catch {}
}
function loadRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') } catch { return [] }
}
export function trackToolVisit(slug: string) {
  try {
    const r = loadRecent().filter(s => s !== slug)
    r.unshift(slug)
    localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0, MAX_RECENT)))
  } catch {}
}

/* ─── Featured Bento Tools ───────────────────────────────── */

const FEATURED_TOOLS = [
  {
    slug: 'merge-pdf',
    label: 'Merge PDF',
    desc: 'Combine multiple PDFs into one file instantly — drag, drop, reorder & merge.',
    emoji: '📄',
    cat: 'pdf-core',
    gradient: 'linear-gradient(135deg, rgba(59,208,255,0.18) 0%, rgba(59,208,255,0.04) 100%)',
    accent: '#3bd0ff',
    size: 'large',
    stat: '10M+ merges',
  },
  {
    slug: 'compress-image',
    label: 'Compress Image',
    desc: 'Shrink JPG, PNG & WebP without losing quality. Up to 90% size reduction.',
    emoji: '🖼️',
    cat: 'image-core',
    gradient: 'linear-gradient(135deg, rgba(77,240,181,0.18) 0%, rgba(77,240,181,0.04) 100%)',
    accent: '#4df0b5',
    size: 'medium',
    stat: '5M+ images',
  },
  {
    slug: 'remove-background',
    label: 'Remove Background',
    desc: 'AI-powered background removal. Get a clean transparent PNG in seconds.',
    emoji: '✂️',
    cat: 'image-core',
    gradient: 'linear-gradient(135deg, rgba(167,139,250,0.18) 0%, rgba(167,139,250,0.04) 100%)',
    accent: '#a78bfa',
    size: 'medium',
    stat: 'AI-Powered',
  },
  {
    slug: 'json-formatter',
    label: 'JSON Formatter',
    desc: 'Beautify & validate JSON with syntax highlighting and error detection.',
    emoji: '{ }',
    cat: 'developer-tools',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.16) 0%, rgba(251,191,36,0.04) 100%)',
    accent: '#fbbf24',
    size: 'small',
    stat: 'Instant',
  },
  {
    slug: 'bmi-calculator',
    label: 'BMI Calculator',
    desc: 'Calculate your Body Mass Index and get health insights.',
    emoji: '⚖️',
    cat: 'health-tools',
    gradient: 'linear-gradient(135deg, rgba(248,113,113,0.16) 0%, rgba(248,113,113,0.04) 100%)',
    accent: '#f87171',
    size: 'small',
    stat: 'Health Tool',
  },
] as const

function FeaturedSection() {
  return (
    <motion.section
      className='featured-bento-section'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className='featured-bento-header'>
        <span className='featured-bento-label'>
          <Zap size={13} /> Featured Tools
        </span>
        <span className='featured-bento-sub'>Handpicked for you</span>
      </div>
      <div className='featured-bento-grid'>
        {FEATURED_TOOLS.map((tool, idx) => (
          <motion.div
            key={tool.slug}
            className={`featured-bento-card featured-bento-${tool.size}`}
            style={{
              '--feat-accent': tool.accent,
              '--feat-gradient': tool.gradient,
            } as CSSProperties}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.06, duration: 0.35 }}
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
          >
            <Link to={`/tools/${tool.slug}`} className='featured-bento-link'>
              <div className='feat-card-top'>
                <span className='feat-emoji'>{tool.emoji}</span>
                <span className='feat-stat'>{tool.stat}</span>
              </div>
              <div className='feat-card-body'>
                <h3>{tool.label}</h3>
                <p>{tool.desc}</p>
              </div>
              <div className='feat-card-cta'>
                Open tool <ArrowRight size={13} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

/* ─── Search Autocomplete ────────────────────────────────── */

function SearchAutocomplete({
  query,
  tools,
  onSelect,
  onClose,
}: {
  query: string
  tools: { slug: string; title: string; description: string; category: string }[]
  onSelect: () => void
  onClose: () => void
}) {
  const navigate = useNavigate()
  const q = query.trim().toLowerCase()
  const [activeIdx, setActiveIdx] = useState(0)

  const matches = useMemo(() => {
    if (q.length < 1) return []
    return tools
      .filter(t => [t.title, t.description, t.category].join(' ').toLowerCase().includes(q))
      .slice(0, 8)
  }, [q, tools])

  useEffect(() => { setActiveIdx(0) }, [q])

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (!matches.length) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, matches.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter' && matches[activeIdx]) {
        navigate(`/tools/${matches[activeIdx].slug}`)
        onSelect()
      }
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [matches, activeIdx, navigate, onSelect, onClose])

  if (!matches.length) return null

  return (
    <AnimatePresence>
      <motion.div
        className='search-autocomplete'
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.15 }}
      >
        <div className='autocomplete-header'>
          <Search size={11} /> {matches.length} result{matches.length !== 1 ? 's' : ''}
        </div>
        {matches.map((t, idx) => {
          const theme = getCategoryTheme(t.category)
          return (
            <Link
              key={t.slug}
              to={`/tools/${t.slug}`}
              className={`autocomplete-item${idx === activeIdx ? ' active' : ''}`}
              style={{ '--ac-accent': theme.accent } as CSSProperties}
              onClick={onSelect}
              onMouseEnter={() => setActiveIdx(idx)}
            >
              <span className='ac-icon' style={{ color: theme.accent }}>
                <ToolIcon slug={t.slug} className='tool-icon' />
              </span>
              <div className='ac-body'>
                <span className='ac-title'>{t.title}</span>
                <span className='ac-desc'>{t.description.split('—')[0].trim()}</span>
              </div>
              <ArrowRight size={12} className='ac-arrow' />
            </Link>
          )
        })}
        <div className='autocomplete-footer'>
          ↑↓ navigate · Enter to open · Esc to close
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ─── Category Browser ───────────────────────────────────── */

const CATEGORY_EMOJIS: Record<string, string> = {
  // PDF
  'pdf-core': '📄', 'pdf-advanced': '📑', 'pdf-security': '🔐',
  'pdf-insights': '🔍', 'pdf-tools': '📋',
  // Image
  'image-core': '🖼️', 'image-layout': '🎨', 'image-enhance': '✨',
  'image-effects': '🌈', 'image-tools': '🖌️',
  // Developer
  'developer-tools': '⌨️', 'developer': '💻', 'developer-generators': '⚙️',
  'code-tools': '{ }', 'hash-crypto': '🔑',
  // Unit / Format
  'unit-converter': '📏', 'conversion-tools': '🔄',
  // Student / Math
  'student-tools': '🎓', 'math-tools': '🔢', 'math-calculators': '🧮',
  'science-tools': '🔬',
  // Video / Audio
  'video-tools': '🎥', 'video': '🎞️', 'audio-tools': '🎵', 'audio': '🎶',
  // Finance / Tax / Business
  'finance-tools': '💰', 'finance-tax': '🧾', 'business-tools': '💼',
  'crypto-web3': '₿',
  // Text
  'text-ops': '📝', 'text-operations': '✏️', 'text-cleanup': '🧹',
  'text-ai': '🤖', 'writing-tools': '✍️', 'ai-writing': '🪄',
  // Health / Fitness
  'health-tools': '❤️', 'health-fitness': '🏋️', 'health-calculators': '🩺',
  // Productivity
  'productivity': '⚡', 'productivity-tools': '📅',
  // Network / SEO / Security
  'network-tools': '🌐', 'seo-tools': '📊', 'security-tools': '🔒',
  // Office / Document
  'office-suite': '📋', 'document-convert': '📂', 'format-lab': '🔧',
  'ocr-vision': '👁️', 'data-tools': '📈', 'archive-lab': '📦',
  'ebook-convert': '📚', 'vector-lab': '✒️', 'batch-automation': '🔁',
  'page-ops': '📐', 'utility': '🛠️',
  // Other
  'color-tools': '🎨', 'social-media': '📱',
  'hr-jobs': '👔', 'travel-tools': '✈️', 'legal-tools': '⚖️',
  'geography-tools': '🌍', 'cooking-tools': '🍳',
}

function CategoryBrowser({
  categories,
  toolCountByCategory,
  onCategorySelect,
}: {
  categories: { id: string; label: string; description: string }[]
  toolCountByCategory: Map<string, number>
  onCategorySelect: (id: string) => void
}) {
  const sortedCats = useMemo(() =>
    [...categories]
      .filter(c => (toolCountByCategory.get(c.id) ?? 0) > 0)
      .sort((a, b) => {
        const ai = CATEGORY_PRIORITY.indexOf(a.id), bi = CATEGORY_PRIORITY.indexOf(b.id)
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
      }),
    [categories, toolCountByCategory],
  )

  return (
    <motion.section
      className='category-browser-section'
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
    >
      <div className='cat-browser-header'>
        <LayoutGrid size={14} />
        <span>Browse by Category</span>
        <span className='cat-browser-count'>{sortedCats.length} categories</span>
      </div>
      <div className='cat-browser-grid'>
        {sortedCats.map((cat, idx) => {
          const theme = getCategoryTheme(cat.id)
          const count = toolCountByCategory.get(cat.id) ?? 0
          const emoji = CATEGORY_EMOJIS[cat.id] ?? '🔧'
          return (
            <motion.button
              key={cat.id}
              type='button'
              className='cat-browser-card'
              style={{ '--cb-accent': theme.accent } as CSSProperties}
              onClick={() => onCategorySelect(cat.id)}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(idx * 0.015, 0.3), duration: 0.25 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
            >
              <span className='cb-emoji'>{emoji}</span>
              <span className='cb-label'>{cat.label}</span>
              <span className='cb-count'>{count}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.section>
  )
}

/* ─── Skeleton ───────────────────────────────────────────── */

function SkeletonToolCard() {
  return (
    <div className='tool-card-compact skeleton-compact-card' aria-hidden>
      <span className='skeleton skeleton-icon-sm' />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className='skeleton skeleton-title-sm' />
        <span className='skeleton skeleton-desc-sm' />
      </div>
    </div>
  )
}
function SkeletonSection() {
  return (
    <div className='category-section skeleton-section' aria-hidden>
      <div className='category-section-header'>
        <div>
          <span className='skeleton' style={{ display: 'block', width: 140, height: 22, borderRadius: 6, marginBottom: 8 }} />
          <span className='skeleton' style={{ display: 'block', width: 240, height: 14, borderRadius: 4 }} />
        </div>
      </div>
      <div className='tools-grid compact'>
        {Array.from({ length: 8 }).map((_, i) => <SkeletonToolCard key={i} />)}
      </div>
    </div>
  )
}

/* ─── Tool Card ──────────────────────────────────────────── */

/* ─── Hover Prefetch ─────────────────────────────────────────
   On mouseenter we inject a <link rel="prefetch"> for the tool's
   API endpoint. The browser fetches it silently using spare
   bandwidth so that when ToolPage mounts the response is already
   in the prefetch cache — navigation feels instant.
   ──────────────────────────────────────────────────────────── */
const prefetched = new Set<string>()
function prefetchTool(slug: string) {
  if (prefetched.has(slug)) return
  prefetched.add(slug)
  // Prefetch the tool API JSON
  const link = document.createElement('link')
  link.rel  = 'prefetch'
  link.as   = 'fetch'
  link.crossOrigin = 'anonymous'
  link.href = `/api/tools/${slug}`
  document.head.appendChild(link)
}

const ToolCardCompact = memo(function ToolCardCompact({
  tool, theme, favorites, onToggleFav, viewMode,
}: {
  tool: { slug: string; title: string; description: string }
  theme: { accent: string }
  favorites: Set<string>
  onToggleFav: (slug: string, e: React.MouseEvent) => void
  viewMode: 'grid' | 'list'
}) {
  const isFav = favorites.has(tool.slug)
  const isTrending = TRENDING_SLUGS.has(tool.slug)
  const isNew = NEW_SLUGS.has(tool.slug)

  return (
    <div className={`tool-card-compact-wrapper${viewMode === 'list' ? ' list-mode' : ''}`}>
      <Link
        to={`/tools/${tool.slug}`}
        className='tool-card-compact'
        style={{ '--card-accent': theme.accent } as CSSProperties}
        onMouseEnter={() => prefetchTool(tool.slug)}
      >
        <span className='tool-card-icon' style={{ color: theme.accent }}>
          <ToolIcon slug={tool.slug} className='tool-icon' />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
            <strong>{tool.title}</strong>
            {isTrending && <span className='tool-badge trending'>🔥 Hot</span>}
            {isNew && !isTrending && <span className='tool-badge new-badge'>✨ New</span>}
          </div>
          <small>{tool.description}</small>
        </div>
      </Link>
      <button
        type='button'
        className={`fav-star-btn${isFav ? ' active' : ''}`}
        onClick={(e) => onToggleFav(tool.slug, e)}
        title={isFav ? 'Remove from favorites' : 'Save to favorites'}
        aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
      >
        <Star size={12} fill={isFav ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
})

/* ─── Category Section ───────────────────────────────────── */

const AnimatedSection = memo(function AnimatedSection({
  category, catTools, theme, favorites, onToggleFav, viewMode,
}: {
  category: { id: string; label: string; description: string }
  catTools: { slug: string; title: string; description: string }[]
  theme: { accent: string }
  favorites: Set<string>
  onToggleFav: (slug: string, e: React.MouseEvent) => void
  viewMode: 'grid' | 'list'
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.article
      ref={ref}
      className='category-section modern-section'
      style={{ '--cat-accent': theme.accent } as CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      <div className='category-section-header modern-section-header'>
        <button
          type='button'
          className='section-collapse-btn'
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand section' : 'Collapse section'}
        >
          <span
            style={{
              display: 'flex',
              transition: 'transform 0.2s ease',
              transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            }}
          >
            <ChevronDown size={16} style={{ color: theme.accent }} />
          </span>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ color: theme.accent }}>{category.label}</h2>
            <span className='cat-count-badge' style={{
              background: `color-mix(in srgb, ${theme.accent} 15%, transparent)`,
              color: theme.accent,
              border: `1px solid color-mix(in srgb, ${theme.accent} 30%, transparent)`,
            }}>
              {catTools.length}
            </span>
          </div>
          <p>{category.description}</p>
        </div>
        <Link
          to={`/category/${category.id}`}
          className='view-all-link modern-view-all'
          style={{ color: theme.accent }}
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key='content'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className={`tools-grid compact cv-grid${viewMode === 'list' ? ' list-view' : ''}`} style={{ paddingTop: '0.75rem' }}>
              {catTools.map((tool) => (
                <ToolCardCompact
                  key={tool.slug}
                  tool={tool}
                  theme={theme}
                  favorites={favorites}
                  onToggleFav={onToggleFav}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
})

/* ─── Popular Strip ──────────────────────────────────────── */

function PopularStrip({ tools: popTools, allTools, favorites, onToggleFav }: {
  tools: typeof POPULAR_TOOLS
  allTools: { slug: string; title: string; description: string; category: string }[]
  favorites: Set<string>
  onToggleFav: (slug: string, e: React.MouseEvent) => void
}) {
  return (
    <motion.section
      className='popular-strip-section'
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className='popular-strip-header'>
        <span className='pop-header-icon'><Flame size={15} /></span>
        <span className='pop-header-title'>Most Popular</span>
        <span className='pop-header-sub'>Tools everyone uses daily</span>
        <span className='pop-live-badge'><span className='pop-live-dot' />Live</span>
      </div>
      <div className='popular-strip-grid'>
        {popTools.map((pt, idx) => {
          const fullTool = allTools.find(t => t.slug === pt.slug)
          const theme = getCategoryTheme(pt.cat)
          const isFav = favorites.has(pt.slug)
          return (
            <motion.div
              key={pt.slug}
              className='popular-strip-card-wrapper'
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.3 }}
            >
              <Link
                to={`/tools/${pt.slug}`}
                className='popular-strip-card'
                style={{ '--pop-accent': theme.accent } as CSSProperties}
              >
                {pt.hot && <span className='pop-card-hot' aria-label='Trending'>🔥</span>}
                <span className='popular-strip-emoji'>{pt.emoji}</span>
                <div className='pop-card-body'>
                  <span className='popular-strip-label'>{pt.label}</span>
                  {fullTool && <span className='popular-strip-desc'>{fullTool.description.split('—')[0].split('.')[0].trim()}</span>}
                </div>
                <span className='pop-card-arrow'><ArrowRight size={12} /></span>
              </Link>
              <button
                type='button'
                className={`fav-star-btn sm${isFav ? ' active' : ''}`}
                onClick={e => onToggleFav(pt.slug, e)}
                title={isFav ? 'Remove from favorites' : 'Save'}
              >
                <Star size={10} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}

/* ─── Recently Used ──────────────────────────────────────── */

function RecentSection({ recentSlugs, allTools, favorites, onToggleFav, viewMode }: {
  recentSlugs: string[]
  allTools: { slug: string; title: string; description: string; category: string }[]
  favorites: Set<string>
  onToggleFav: (slug: string, e: React.MouseEvent) => void
  viewMode: 'grid' | 'list'
}) {
  const recentTools = useMemo(
    () => recentSlugs.map(s => allTools.find(t => t.slug === s)).filter(Boolean) as typeof allTools,
    [recentSlugs, allTools],
  )
  if (recentTools.length === 0) return null

  return (
    <motion.section
      className='category-section recent-section'
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className='category-section-header'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Clock size={16} style={{ color: '#4ade80' }} />
          <div>
            <h2 style={{ color: '#4ade80' }}>Recently Used</h2>
            <p>Your last {recentTools.length} visited tools — pick up where you left off</p>
          </div>
        </div>
      </div>
      <div className={`tools-grid compact${viewMode === 'list' ? ' list-view' : ''}`}>
        {recentTools.map(tool => (
          <ToolCardCompact key={tool.slug} tool={tool} theme={getCategoryTheme(tool.category)} favorites={favorites} onToggleFav={onToggleFav} viewMode={viewMode} />
        ))}
      </div>
    </motion.section>
  )
}

/* ─── Favorites ──────────────────────────────────────────── */

function FavoritesSection({ allTools, favorites, onToggleFav, viewMode }: {
  allTools: { slug: string; title: string; description: string; category: string }[]
  favorites: Set<string>
  onToggleFav: (slug: string, e: React.MouseEvent) => void
  viewMode: 'grid' | 'list'
}) {
  const favTools = useMemo(
    () => [...favorites].map(s => allTools.find(t => t.slug === s)).filter(Boolean) as typeof allTools,
    [favorites, allTools],
  )
  if (favTools.length === 0) return null

  return (
    <motion.section
      className='category-section favorites-section'
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className='category-section-header'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Bookmark size={16} style={{ color: '#f59e0b' }} />
          <div>
            <h2 style={{ color: '#f59e0b' }}>Your Favorites</h2>
            <p>{favTools.length} bookmarked tool{favTools.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
      <div className={`tools-grid compact${viewMode === 'list' ? ' list-view' : ''}`}>
        {favTools.map(tool => (
          <ToolCardCompact key={tool.slug} tool={tool} theme={getCategoryTheme(tool.category)} favorites={favorites} onToggleFav={onToggleFav} viewMode={viewMode} />
        ))}
      </div>
    </motion.section>
  )
}

/* ─── Sort Dropdown ──────────────────────────────────────── */

function SortDropdown({ sort, onChange }: { sort: SortOption; onChange: (v: SortOption) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = SORT_OPTIONS.find(o => o.value === sort)!

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className='sort-dropdown' ref={ref}>
      <button
        type='button'
        className='sort-dropdown-btn'
        onClick={() => setOpen(o => !o)}
        aria-label='Sort categories'
      >
        <SlidersHorizontal size={14} />
        <span>{current.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
          <ChevronDown size={13} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className='sort-dropdown-menu'
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            {SORT_OPTIONS.map(opt => (
              <li key={opt.value}>
                <button
                  type='button'
                  className={`sort-dropdown-item${sort === opt.value ? ' active' : ''}`}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                >
                  {opt.label}
                  {sort === opt.value && <span style={{ color: '#3bd0ff' }}>✓</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Stats Bar ──────────────────────────────────────────── */

function StatsBar({ toolCount, catCount, favCount }: { toolCount: number; catCount: number; favCount: number }) {
  return (
    <div className='tools-stats-bar'>
      <span className='stats-bar-item'>
        <Zap size={13} style={{ color: '#3bd0ff' }} />
        <strong>{toolCount.toLocaleString()}+</strong> tools
      </span>
      <span className='stats-bar-sep' />
      <span className='stats-bar-item'>
        <Hash size={13} style={{ color: '#a78bfa' }} />
        <strong>{catCount}</strong> categories
      </span>
      <span className='stats-bar-sep' />
      <span className='stats-bar-item'>
        <Star size={13} style={{ color: '#f59e0b' }} fill={favCount > 0 ? '#f59e0b' : 'none'} />
        <strong>{favCount}</strong> saved
      </span>
    </div>
  )
}

/* ─── Search Suggestions ─────────────────────────────────── */

const QUICK_SEARCHES = [
  'merge PDF', 'compress', 'remove background', 'JSON', 'BMI',
  'EMI calculator', 'QR code', 'resize image', 'OCR', 'YouTube',
]

function QuickSearches({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className='quick-searches'>
      <span className='quick-label'>Try:</span>
      {QUICK_SEARCHES.map(q => (
        <button key={q} type='button' className='quick-tag' onClick={() => onSelect(q)}>
          {q}
        </button>
      ))}
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────── */

export default function AllToolsPage() {
  const { categories, tools, loading, error } = useCatalogData()
  const [query, setQuery]           = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeCategory, setActiveCat] = useState('all')
  const [viewMode, setViewMode]     = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab]   = useState<'all' | 'favorites'>('all')
  const [sortBy, setSortBy]         = useState<SortOption>('popular')
  const [favorites, setFavorites]   = useState<Set<string>>(() => loadFavorites())
  const [recentSlugs]               = useState<string[]>(() => loadRecent())
  const searchRef                   = useRef<HTMLInputElement>(null)
  const searchWrapRef               = useRef<HTMLDivElement>(null)

  /* Debounce the raw query so filtering only runs after 180ms pause */
  const debouncedQuery = useDebounce(query, 180)
  const deferredQuery  = useDeferredValue(debouncedQuery)

  /* Keyboard shortcut: press "/" to focus search */
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !['INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        searchRef.current?.focus()
        setSearchFocused(true)
      }
      if (e.key === 'Escape') { searchRef.current?.blur(); setSearchFocused(false) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  /* Click outside to close autocomplete */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    applyDocumentBranding(
      `All ${tools.length}+ Free Online Tools — PDF, Image, Developer, Student Tools | ISHU TOOLS`,
      `Browse all ${tools.length}+ free online tools at ISHU TOOLS by Ishu Kumar. Merge PDF, compress images, JSON formatter, BMI calculator, unit converter & more. No signup, no watermark, 100% free.`,
      '#3bd0ff',
    )
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', `Browse all ${tools.length}+ free online tools at ISHU TOOLS by Ishu Kumar. PDF merge, compress, convert, image resize, developer tools, student calculators, unit converters & more. No signup, no watermark, free forever.`)
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (canonical) canonical.href = 'https://ishutools.com/tools'
    else {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = 'https://ishutools.com/tools'
      document.head.appendChild(canonical)
    }
  }, [tools.length])

  const onToggleFav = useCallback((slug: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      saveFavorites(next)
      return next
    })
  }, [])

  const toolCountByCategory = useMemo(() => {
    const m = new Map<string, number>()
    tools.forEach(t => m.set(t.category, (m.get(t.category) ?? 0) + 1))
    return m
  }, [tools])

  const sortedCategories = useMemo(() => {
    const cats = [...categories]
    switch (sortBy) {
      case 'az':         return cats.sort((a, b) => a.label.localeCompare(b.label))
      case 'za':         return cats.sort((a, b) => b.label.localeCompare(a.label))
      case 'count-desc': return cats.sort((a, b) => (toolCountByCategory.get(b.id) ?? 0) - (toolCountByCategory.get(a.id) ?? 0))
      case 'count-asc':  return cats.sort((a, b) => (toolCountByCategory.get(a.id) ?? 0) - (toolCountByCategory.get(b.id) ?? 0))
      default: return cats.sort((a, b) => {
        const ai = CATEGORY_PRIORITY.indexOf(a.id)
        const bi = CATEGORY_PRIORITY.indexOf(b.id)
        if (ai === -1 && bi === -1) return a.label.localeCompare(b.label)
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
      })
    }
  }, [categories, sortBy, toolCountByCategory])

  // ── Smart relevance-scored search ──
  // Multi-word: every word must match somewhere. Sort by computed score
  // (title exact > title prefix > title word-prefix > slug > tags > description).
  const filteredTools = useMemo(() => {
    const raw = deferredQuery.trim().toLowerCase()
    const inCat = (tool: { category: string }) =>
      activeCategory === 'all' || tool.category === activeCategory

    if (!raw) return tools.filter(inCat)

    const words = raw.split(/\s+/).filter(Boolean)

    type Scored = { tool: typeof tools[number]; score: number }
    const scored: Scored[] = []

    for (const tool of tools) {
      if (!inCat(tool)) continue
      const title = tool.title.toLowerCase()
      const slug = tool.slug.toLowerCase()
      const desc = (tool.description || '').toLowerCase()
      const tagText = (tool.tags || []).join(' ').toLowerCase()
      const haystack = `${title} ${slug} ${desc} ${tagText}`

      // Multi-word AND — every word must appear somewhere
      if (!words.every(w => haystack.includes(w))) continue

      let score = 0
      // ── Whole-query bonuses (most important) ──
      if (title === raw) score += 1000
      else if (title.startsWith(raw)) score += 500
      else {
        // Word-boundary prefix match (e.g. "merge" → "Merge PDF")
        const titleWords = title.split(/\s+/)
        if (titleWords.some(w => w.startsWith(raw))) score += 300
        else if (title.includes(raw)) score += 150
      }
      if (slug === raw) score += 800
      else if (slug.startsWith(raw)) score += 250
      else if (slug.includes(raw)) score += 100
      if (tagText.includes(raw)) score += 80
      if (desc.includes(raw)) score += 30

      // ── Per-word bonuses (multi-word queries) ──
      for (const w of words) {
        if (title.includes(w)) score += 40
        if (slug.includes(w)) score += 20
        if (tagText.includes(w)) score += 15
        if (desc.includes(w)) score += 5
      }

      // Shorter titles = more specific match → small boost
      score += Math.max(0, 30 - title.length / 2)

      // Trending/new tools get a tiny tiebreaker boost
      if (TRENDING_SLUGS.has(tool.slug)) score += 8
      if (NEW_SLUGS.has(tool.slug)) score += 4

      scored.push({ tool, score })
    }

    scored.sort((a, b) => b.score - a.score || a.tool.title.localeCompare(b.tool.title))
    return scored.map(s => s.tool)
  }, [activeCategory, deferredQuery, tools])

  const isSearching   = deferredQuery.trim().length > 0

  // Grouped category sections — ONLY when not searching (search shows flat ranked list)
  const groupedSections = useMemo(() => {
    if (isSearching) return []
    return sortedCategories
      .map(cat => ({ category: cat, tools: filteredTools.filter(t => t.category === cat.id) }))
      .filter(e => e.tools.length > 0)
  }, [sortedCategories, filteredTools, isSearching])

  const showPopular   = activeCategory === 'all' && !isSearching && activeTab === 'all'
  const showRecent    = activeCategory === 'all' && !isSearching && activeTab === 'all'
  const showFavorites = activeTab === 'favorites'

  const clearSearch = useCallback(() => {
    setQuery('')
    startTransition(() => setActiveCat('all'))
    searchRef.current?.focus()
  }, [])

  return (
    <SiteShell>
      <div className='page-wrap'>
        {/* ── Hero ── */}
        <section className='all-tools-hero'>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className='section-kicker'>Complete Library</span>
            <h1>All {loading ? '1,200' : tools.length.toLocaleString()}+ Free Online Tools</h1>
            <p>Browse every tool across {loading ? '53' : categories.length} categories — find exactly what you need.</p>
          </motion.div>

          <StatsBar toolCount={loading ? 1247 : tools.length} catCount={loading ? 53 : categories.length} favCount={favorites.size} />

          {/* ── Controls ── */}
          <div className='tools-page-controls'>
            <div className='search-control' style={{ flex: 1, position: 'relative' }} ref={searchWrapRef}>
              <label className={`search-input${searchFocused && query ? ' search-active' : ''}`}>
                <Search size={18} />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSearchFocused(true) }}
                  onFocus={() => setSearchFocused(true)}
                  placeholder='Search 1,200+ tools... or press / to focus'
                  aria-label='Search all tools'
                  autoComplete='off'
                />
                {!query && <span className='search-kbd' title='Press / to search'>/</span>}
                <AnimatePresence>
                  {query && (
                    <motion.button type='button' className='search-clear-btn' onClick={clearSearch}
                      initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.15 }} aria-label='Clear'>
                      <X size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </label>
              {searchFocused && query.length >= 1 && (
                <SearchAutocomplete
                  query={query}
                  tools={tools}
                  onSelect={() => { setSearchFocused(false); setQuery('') }}
                  onClose={() => setSearchFocused(false)}
                />
              )}
            </div>

            <SortDropdown sort={sortBy} onChange={setSortBy} />

            <div className='view-toggle-group'>
              <button type='button' className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')} title='Grid view'><Grid3X3 size={16} /></button>
              <button type='button' className={`view-toggle-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')} title='List view'><List size={16} /></button>
            </div>
          </div>

          {!isSearching && <QuickSearches onSelect={q => { setQuery(q); searchRef.current?.focus() }} />}

          {/* ── Tabs ── */}
          <div className='tools-tab-row'>
            <button type='button' className={`tools-tab-btn${activeTab === 'all' ? ' active' : ''}`} onClick={() => setActiveTab('all')}>
              <TrendingUp size={13} /> All Tools
            </button>
            <button type='button' className={`tools-tab-btn${activeTab === 'favorites' ? ' active' : ''}`} onClick={() => setActiveTab('favorites')}>
              <Star size={13} fill={activeTab === 'favorites' ? 'currentColor' : 'none'} />
              Favorites
              {favorites.size > 0 && <span className='tab-badge'>{favorites.size}</span>}
            </button>
          </div>

          {/* ── Category pills (hidden during active search to give results full focus) ── */}
          {!isSearching && (
          <div className='category-row' style={{ marginTop: '0.75rem' }}>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className='skeleton' style={{ display: 'inline-block', width: 80 + i * 10, height: 34, borderRadius: 999 }} />
              ))
            ) : (
              <>
                <button type='button' className={`category-pill${activeCategory === 'all' ? ' active' : ''}`}
                  onClick={() => startTransition(() => setActiveCat('all'))}>
                  All ({tools.length})
                </button>
                {sortedCategories.map(cat => {
                  const theme = getCategoryTheme(cat.id)
                  const count = toolCountByCategory.get(cat.id) ?? 0
                  if (!count) return null
                  return (
                    <button type='button' key={cat.id}
                      className={`category-pill themed${activeCategory === cat.id ? ' active' : ''}`}
                      style={{ '--pill-accent': theme.accent } as CSSProperties}
                      onClick={() => startTransition(() => setActiveCat(cat.id))}>
                      {cat.label} ({count})
                    </button>
                  )
                })}
              </>
            )}
          </div>
          )}
        </section>

        {/* ── Directory ── */}
        <section className='directory-stack' style={{ paddingTop: '1rem' }}>
          {loading && <><SkeletonSection /><SkeletonSection /><SkeletonSection /></>}
          {error && <p className='status-text error'>{error}</p>}

          {!loading && !error && showFavorites && (
            <FavoritesSection allTools={tools} favorites={favorites} onToggleFav={onToggleFav} viewMode={viewMode} />
          )}
          {!loading && !error && showFavorites && favorites.size === 0 && (
            <article className='empty-state'>
              <Star size={36} style={{ color: '#f59e0b', marginBottom: '0.75rem' }} />
              <h3>No favorites yet</h3>
              <p>Click the ★ on any tool to pin it here for instant access.</p>
            </article>
          )}

          {!loading && !error && !showFavorites && (
            <>
              {/* Removed: FeaturedSection ("Top Tools used by everyone") + PopularStrip ("Most Popular") — tools are the priority. */}
              {showRecent && (
                <RecentSection recentSlugs={recentSlugs} allTools={tools} favorites={favorites} onToggleFav={onToggleFav} viewMode={viewMode} />
              )}
              {filteredTools.length === 0 && (
                <article className='empty-state'>
                  <Search size={36} style={{ color: '#3bd0ff', marginBottom: '0.75rem', opacity: 0.5 }} />
                  <h3>No tools matched</h3>
                  <p>Try a different keyword or browse all categories.</p>
                  <button type='button' className='btn-secondary' onClick={clearSearch} style={{ marginTop: '0.75rem' }}>
                    Clear search
                  </button>
                </article>
              )}
              {isSearching && filteredTools.length > 0 && (
                <p className='search-result-count'>
                  Found <strong>{filteredTools.length}</strong> tool{filteredTools.length !== 1 ? 's' : ''} for "<em>{deferredQuery}</em>"
                  {' '}— sorted by relevance.
                </p>
              )}

              {/* ── Flat ranked search results — ALL matches, no cap, virtualized via content-visibility ── */}
              {isSearching && filteredTools.length > 0 && (
                <section className='category-section search-results-section'>
                  <div className={`tool-grid cv-grid${viewMode === 'list' ? ' list-mode' : ''}`}>
                    {filteredTools.map(tool => (
                      <ToolCardCompact
                        key={tool.slug}
                        tool={tool}
                        theme={getCategoryTheme(tool.category)}
                        favorites={favorites}
                        onToggleFav={onToggleFav}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </section>
              )}

              {!isSearching && groupedSections.map(({ category, tools: catTools }) => (
                <AnimatedSection
                  key={category.id}
                  category={category}
                  catTools={catTools}
                  theme={getCategoryTheme(category.id)}
                  favorites={favorites}
                  onToggleFav={onToggleFav}
                  viewMode={viewMode}
                />
              ))}

              {/* Removed: CategoryBrowser panel — tools are the priority, categories are still accessible via filter chips at top. */}
            </>
          )}
        </section>

        {/* ── SEO ── */}
        <section className='seo-content-section'>
          <h2>All Free Online Tools by ISHU TOOLS — Indian Student Hub University Tools</h2>
          <p>
            ISHU TOOLS (Indian Student Hub University Tools) by Ishu Kumar offers {tools.length || '1247'}+ free online tools
            across {categories.length || '53'} categories. From PDF merging, splitting, and compression to image editing, developer
            utilities, math calculators, unit converters, student tools, and video downloaders — every tool is completely free,
            requires no signup, and produces results with no watermark. Created specifically for Indian students and professionals.
          </p>
          <h3>Why Choose ISHU TOOLS?</h3>
          <ul>
            <li><strong>100% Free</strong> — No hidden charges, no premium plans, free forever</li>
            <li><strong>No Signup Required</strong> — Instant access to every tool, no account needed</li>
            <li><strong>No Watermarks</strong> — Clean, professional output every time</li>
            <li><strong>Privacy First</strong> — Files deleted after processing, fully secure</li>
            <li><strong>Mobile Friendly</strong> — Works perfectly on all devices</li>
            <li><strong>Fast Processing</strong> — Results in seconds, ultra smooth</li>
            <li><strong>Made for India</strong> — SSC, UPSC, JEE, NEET, government exam tools</li>
          </ul>
        </section>
      </div>
    </SiteShell>
  )
}
