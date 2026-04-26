import { useDeferredValue, useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
import type { CSSProperties } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Search, ArrowRight, Star, TrendingUp, Grid3X3, List, X,
  Bookmark, SlidersHorizontal, Zap, ChevronDown, Hash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import SiteShell from '../../components/layout/SiteShell'
import { fetchPopularityMap } from '../../api/toolsApi'
import { useCatalogData } from '../../hooks/useCatalogData'
import { useDebounce } from '../../hooks/useDebounce'
import { toSiteUrl } from '../../lib/siteConfig'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import { getToolPriorityScore, searchTools } from '../../lib/toolSearch'
import ToolIcon from '../../components/tools/ToolIcon'
import type { ToolDefinition } from '../../types/tools'

/* ─── Constants ─────────────────────────────────────────── */

const TRENDING_SLUGS = new Set([
  'merge-pdf', 'compress-image', 'remove-background', 'qr-code-generator',
  'gst-calculator-india', 'image-to-text', 'youtube-downloader', 'compress-to-100kb',
])

const NEW_SLUGS = new Set([
  'compress-to-100kb', 'youtube-downloader', 'image-to-text',
  'scientific-calculator', 'uuid-generator',
])

const SORT_OPTIONS = [
  { value: 'popular', label: 'Smart Rank' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
] as const
type SortOption = (typeof SORT_OPTIONS)[number]['value']

/* ─── localStorage helpers (now live in lib/usageTracker.ts) ─────────────── */
import {
  loadFavorites,
  saveFavorites,
  loadUsage,
} from '../../lib/usageTracker'

/* ─── Featured Bento Tools ───────────────────────────────── */
/* ─── Search Autocomplete ────────────────────────────────── */

function SearchAutocomplete({
  query,
  tools,
  onSelect,
  onClose,
}: {
  query: string
  tools: ToolDefinition[]
  onSelect: () => void
  onClose: () => void
}) {
  const navigate = useNavigate()
  const q = query.trim().toLowerCase()
  const [activeIdx, setActiveIdx] = useState(0)

  const matches = useMemo(() => {
    if (q.length < 1) return []
    return searchTools(tools, q, { limit: 8 })
  }, [q, tools])

  // Reset highlight when query changes — using the React 19 "store-previous-prop" pattern
  // (avoids the cascading-render warning from useEffect+setState).
  const [prevQ, setPrevQ] = useState(q)
  if (q !== prevQ) {
    setPrevQ(q)
    setActiveIdx(0)
  }

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
  tool: { slug: string; title: string; description: string; category?: string; tags?: string[] }
  theme: { accent: string }
  favorites: Set<string>
  onToggleFav: (slug: string, e: React.MouseEvent) => void
  viewMode: 'grid' | 'list'
}) {
  const isFav = favorites.has(tool.slug)
  const isTrending = TRENDING_SLUGS.has(tool.slug)
  const isNew = NEW_SLUGS.has(tool.slug)

  // Build a stable, searchable keywords string for SEO crawlers, dev-tool inspection,
  // and browser-extension hooks. Whitespace-separated lowercase tokens.
  const keywordList = (tool.tags ?? [])
    .map(t => t.toLowerCase().trim())
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={`tool-card-compact-wrapper${viewMode === 'list' ? ' list-mode' : ''}`}
      data-tool={tool.slug}
      data-category={tool.category ?? ''}
    >
      <Link
        to={`/tools/${tool.slug}`}
        className='tool-card-compact'
        style={{ '--card-accent': theme.accent } as CSSProperties}
        onMouseEnter={() => prefetchTool(tool.slug)}
        data-tool={tool.slug}
        data-category={tool.category ?? ''}
        data-keywords={keywordList}
        aria-label={`${tool.title} — ${tool.description}`}
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
        aria-label='Sort tools'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery]           = useState(() => searchParams.get('q') ?? '')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeCategory] = useState('all')
  const [viewMode, setViewMode]     = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab]   = useState<'all' | 'favorites'>('all')
  const [sortBy, setSortBy]         = useState<SortOption>('popular')
  const [favorites, setFavorites]   = useState<Set<string>>(() => loadFavorites())
  const [usageMap]                  = useState<Record<string, number>>(() => loadUsage())
  const [globalPopularity, setGlobalPopularity] = useState<Record<string, number>>({})
  const searchRef                   = useRef<HTMLInputElement>(null)
  const searchWrapRef               = useRef<HTMLDivElement>(null)

  /* Debounce the raw query so filtering only runs after 180ms pause */
  const debouncedQuery = useDebounce(query, 180)
  const deferredQuery  = useDeferredValue(debouncedQuery)

  useEffect(() => {
    const current = searchParams.toString()
    const next = new URLSearchParams(searchParams)
    const trimmed = debouncedQuery.trim()
    if (trimmed) next.set('q', trimmed)
    else next.delete('q')
    if (next.toString() !== current) {
      setSearchParams(next, { replace: true })
    }
  }, [debouncedQuery, searchParams, setSearchParams])

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
    let mounted = true
    void fetchPopularityMap()
      .then((counts) => {
        if (mounted) setGlobalPopularity(counts)
      })
      .catch(() => {
        // Ignore popularity fetch failures and fall back to local ordering.
      })
    return () => {
      mounted = false
    }
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
    if (canonical) canonical.href = toSiteUrl('/tools')
    else {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = toSiteUrl('/tools')
      document.head.appendChild(canonical)
    }
  }, [tools.length])

  const onToggleFav = useCallback((slug: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug); else next.add(slug)
      saveFavorites(next)
      return next
    })
  }, [])

  const rankBoost = useCallback((tool: ToolDefinition) => {
    return getToolPriorityScore(tool, usageMap, globalPopularity)
  }, [globalPopularity, usageMap])

  // Shared smart search: synonyms, typo tolerance, Hinglish aliases, popularity,
  // personal usage, and daily-use priority all flow through one engine.
  const filteredTools = useMemo(() => {
    const raw = deferredQuery.trim()
    const inCat = (tool: { category: string }) =>
      activeCategory === 'all' || tool.category === activeCategory

    if (!raw) {
      const base = tools.filter(inCat)
      if (sortBy === 'az') {
        return [...base].sort((a, b) => a.title.localeCompare(b.title))
      }
      if (sortBy === 'za') {
        return [...base].sort((a, b) => b.title.localeCompare(a.title))
      }

      return [...base].sort((a, b) => {
        const diff = rankBoost(b) - rankBoost(a)
        if (diff !== 0) return diff
        return a.title.localeCompare(b.title)
      })
    }

    return searchTools(tools, raw, {
      category: activeCategory,
      localUsage: usageMap,
      globalPopularity,
    })
  }, [activeCategory, deferredQuery, tools, sortBy, rankBoost, usageMap, globalPopularity])

  const isSearching   = deferredQuery.trim().length > 0

  // No grouped-by-category sections (per user request — one flat smart-sorted grid).
  const showFavorites = activeTab === 'favorites'

  const clearSearch = useCallback(() => {
    setQuery('')
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
            <p>One smart-sorted list of every tool — daily-use tools surface first. Type to find anything in milliseconds.</p>
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
              {/* Per request: NO grouped-by-category sections, NO "Most Popular" / "Top Tools",
                  NO "Recently used" pin, NO "Show more". One flat grid containing every
                  matching tool, intelligently sorted (relevance > personal usage > catalog rank).
                  Everything stays visible in a single tools-first layout. */}
              {filteredTools.length === 0 && (
                <article className='empty-state'>
                  <Search size={36} style={{ color: '#3bd0ff', marginBottom: '0.75rem', opacity: 0.5 }} />
                  <h3>No tools matched</h3>
                  <p>Try a broader keyword or a shorter phrase.</p>
                  <button type='button' className='btn-secondary' onClick={clearSearch} style={{ marginTop: '0.75rem' }}>
                    Clear search
                  </button>
                </article>
              )}

              {filteredTools.length > 0 && (
                <>
                  <p className='search-result-count'>
                    {isSearching ? (
                      <>Found <strong>{filteredTools.length}</strong> tool{filteredTools.length !== 1 ? 's' : ''} for &ldquo;<em>{deferredQuery}</em>&rdquo; — sorted by relevance &amp; your usage.</>
                    ) : (
                      <>Showing <strong>{filteredTools.length.toLocaleString()}</strong> tool{filteredTools.length !== 1 ? 's' : ''}{activeCategory !== 'all' ? <> in <em>{categories.find(c => c.id === activeCategory)?.label ?? activeCategory}</em></> : null} — daily-use tools surface first.</>
                    )}
                  </p>
                  <section className='category-section all-tools-flat-section'>
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
                </>
              )}
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
