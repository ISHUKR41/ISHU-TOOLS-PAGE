import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, ArrowRight, Star, Clock, TrendingUp, Grid3X3, List, X,
  Flame, Bookmark, SlidersHorizontal, Zap, ChevronDown, Hash
} from 'lucide-react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

import SiteShell from '../../components/layout/SiteShell'
import { useCatalogData } from '../../hooks/useCatalogData'
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
  'pdf-core', 'image-core', 'developer-tools', 'unit-converter', 'conversion-tools',
  'student-tools', 'video-tools', 'finance-tools', 'finance-tax', 'text-ops',
  'text-operations', 'image-layout', 'productivity', 'health-tools', 'health-fitness',
  'math-tools', 'math-calculators', 'image-enhance', 'utility', 'ocr-vision',
  'format-lab', 'network-tools', 'seo-tools', 'security-tools', 'image-effects',
  'office-suite', 'hash-crypto', 'color-tools', 'social-media', 'writing-tools',
  'ai-writing', 'business-tools', 'hr-jobs', 'travel-tools', 'pdf-advanced',
  'pdf-security', 'page-ops', 'data-tools', 'text-ai', 'document-convert',
  'ebook-convert', 'vector-lab', 'text-cleanup', 'archive-lab', 'batch-automation',
  'pdf-insights', 'code-tools', 'science-tools', 'geography-tools', 'cooking-tools',
  'crypto-web3', 'legal-tools', 'developer-generators',
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

function ToolCardCompact({
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
}

/* ─── Category Section ───────────────────────────────────── */

function AnimatedSection({
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
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.article
      ref={ref}
      className='category-section modern-section'
      style={{ '--cat-accent': theme.accent } as CSSProperties}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
    >
      <div className='category-section-header modern-section-header'>
        <button
          type='button'
          className='section-collapse-btn'
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand section' : 'Collapse section'}
        >
          <motion.span
            animate={{ rotate: collapsed ? -90 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex' }}
          >
            <ChevronDown size={16} style={{ color: theme.accent }} />
          </motion.span>
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
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className={`tools-grid compact${viewMode === 'list' ? ' list-view' : ''}`} style={{ paddingTop: '0.75rem' }}>
              {catTools.map((tool, idx) => (
                <motion.div
                  key={tool.slug}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22, delay: Math.min(idx * 0.025, 0.2), ease: 'easeOut' }}
                >
                  <ToolCardCompact tool={tool} theme={theme} favorites={favorites} onToggleFav={onToggleFav} viewMode={viewMode} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

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
  const [activeCategory, setActiveCat] = useState('all')
  const [viewMode, setViewMode]     = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab]   = useState<'all' | 'favorites'>('all')
  const [sortBy, setSortBy]         = useState<SortOption>('popular')
  const [favorites, setFavorites]   = useState<Set<string>>(() => loadFavorites())
  const [recentSlugs]               = useState<string[]>(() => loadRecent())
  const searchRef                   = useRef<HTMLInputElement>(null)

  const deferredQuery = useDeferredValue(query)

  /* Keyboard shortcut: press "/" to focus search */
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !['INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'Escape') searchRef.current?.blur()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
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

  const filteredTools = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return tools.filter(tool => {
      if (activeCategory !== 'all' && tool.category !== activeCategory) return false
      if (!q) return true
      return [tool.title, tool.description, ...tool.tags].join(' ').toLowerCase().includes(q)
    })
  }, [activeCategory, deferredQuery, tools])

  const groupedSections = useMemo(() =>
    sortedCategories
      .map(cat => ({ category: cat, tools: filteredTools.filter(t => t.category === cat.id) }))
      .filter(e => e.tools.length > 0),
    [sortedCategories, filteredTools],
  )

  const isSearching   = deferredQuery.trim().length > 0
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
            <div className='search-control' style={{ flex: 1 }}>
              <label className='search-input'>
                <Search size={18} />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder='Search 1,200+ tools... or press / to focus'
                  aria-label='Search all tools'
                />
                <span className='search-kbd' title='Press / to search'>/</span>
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

          {/* ── Category pills ── */}
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
              {showPopular && <FeaturedSection />}

              {showPopular && (
                <PopularStrip tools={POPULAR_TOOLS} allTools={tools} favorites={favorites} onToggleFav={onToggleFav} />
              )}
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
                </p>
              )}
              {groupedSections.map(({ category, tools: catTools }) => (
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
