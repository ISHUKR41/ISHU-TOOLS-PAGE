import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Star, Clock, TrendingUp, Grid3X3, List, X, Flame, Bookmark } from 'lucide-react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

import SiteShell from '../../components/layout/SiteShell'
import { useCatalogData } from '../../hooks/useCatalogData'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import ToolIcon from '../../components/tools/ToolIcon'

const POPULAR_TOOLS = [
  { slug: 'merge-pdf', label: 'Merge PDF', emoji: '📄', cat: 'pdf-core' },
  { slug: 'compress-pdf', label: 'Compress PDF', emoji: '🗜️', cat: 'pdf-core' },
  { slug: 'compress-image', label: 'Compress Image', emoji: '🖼️', cat: 'image-core' },
  { slug: 'remove-background', label: 'Remove BG', emoji: '✂️', cat: 'image-core' },
  { slug: 'json-formatter', label: 'JSON Formatter', emoji: '{ }', cat: 'developer-tools' },
  { slug: 'bmi-calculator', label: 'BMI Calculator', emoji: '⚖️', cat: 'health-tools' },
  { slug: 'password-generator', label: 'Password Gen', emoji: '🔑', cat: 'hash-crypto' },
  { slug: 'qr-code-generator', label: 'QR Generator', emoji: '⬛', cat: 'developer-tools' },
  { slug: 'pdf-to-word', label: 'PDF to Word', emoji: '📝', cat: 'office-suite' },
  { slug: 'word-to-pdf', label: 'Word to PDF', emoji: '📋', cat: 'office-suite' },
  { slug: 'resize-image', label: 'Resize Image', emoji: '📐', cat: 'image-core' },
  { slug: 'emi-calculator-advanced', label: 'EMI Calc', emoji: '💰', cat: 'finance-tools' },
  { slug: 'gst-calculator-india', label: 'GST Calc', emoji: '🧾', cat: 'finance-tools' },
  { slug: 'base64-encode', label: 'Base64 Encode', emoji: '🔢', cat: 'developer-tools' },
  { slug: 'word-counter', label: 'Word Counter', emoji: '📊', cat: 'text-ops' },
  { slug: 'uuid-generator', label: 'UUID Gen', emoji: '🆔', cat: 'developer-tools' },
]

const CATEGORY_PRIORITY: string[] = [
  'pdf-core',
  'image-core',
  'developer-tools',
  'unit-converter',
  'conversion-tools',
  'student-tools',
  'video-tools',
  'finance-tools',
  'finance-tax',
  'text-ops',
  'text-operations',
  'image-layout',
  'productivity',
  'health-tools',
  'health-fitness',
  'math-tools',
  'math-calculators',
  'image-enhance',
  'utility',
  'ocr-vision',
  'format-lab',
  'network-tools',
  'seo-tools',
  'security-tools',
  'image-effects',
  'office-suite',
  'hash-crypto',
  'color-tools',
  'social-media',
  'writing-tools',
  'ai-writing',
  'business-tools',
  'hr-jobs',
  'travel-tools',
  'pdf-advanced',
  'pdf-security',
  'page-ops',
  'data-tools',
  'text-ai',
  'document-convert',
  'ebook-convert',
  'vector-lab',
  'text-cleanup',
  'archive-lab',
  'batch-automation',
  'pdf-insights',
  'code-tools',
  'science-tools',
  'geography-tools',
  'cooking-tools',
  'crypto-web3',
  'legal-tools',
  'developer-generators',
]

const FAVORITES_KEY = 'ishu_fav_tools'
const RECENT_KEY = 'ishu_recent_tools'
const MAX_RECENT = 12

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveFavorites(favs: Set<string>) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favs]))
  } catch {}
}

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function trackToolVisit(slug: string) {
  try {
    const recent = loadRecent().filter((s) => s !== slug)
    recent.unshift(slug)
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)))
  } catch {}
}

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
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonToolCard key={i} />
        ))}
      </div>
    </div>
  )
}

function StarButton({ slug, favorites, onToggle }: { slug: string; favorites: Set<string>; onToggle: (slug: string, e: React.MouseEvent) => void }) {
  const isFav = favorites.has(slug)
  return (
    <button
      type='button'
      className={`fav-star-btn${isFav ? ' active' : ''}`}
      onClick={(e) => onToggle(slug, e)}
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star size={12} fill={isFav ? 'currentColor' : 'none'} />
    </button>
  )
}

function ToolCardCompact({
  tool,
  theme,
  favorites,
  onToggleFav,
  viewMode,
}: {
  tool: { slug: string; title: string; description: string }
  theme: { accent: string }
  favorites: Set<string>
  onToggleFav: (slug: string, e: React.MouseEvent) => void
  viewMode: 'grid' | 'list'
}) {
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
          <strong>{tool.title}</strong>
          <small>{tool.description}</small>
        </div>
      </Link>
      <StarButton slug={tool.slug} favorites={favorites} onToggle={onToggleFav} />
    </div>
  )
}

function AnimatedSection({
  category,
  catTools,
  theme,
  favorites,
  onToggleFav,
  viewMode,
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

  return (
    <motion.article
      ref={ref}
      key={category.id}
      className='category-section'
      style={{ '--cat-accent': theme.accent } as CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className='category-section-header'>
        <div>
          <h2 style={{ color: theme.accent }}>{category.label}</h2>
          <p>{category.description}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <span className='cat-count-badge' style={{ background: `color-mix(in srgb, ${theme.accent} 15%, transparent)`, color: theme.accent, border: `1px solid color-mix(in srgb, ${theme.accent} 30%, transparent)` }}>
            {catTools.length} tools
          </span>
          <Link
            to={`/category/${category.id}`}
            className='view-all-link'
            style={{ color: theme.accent }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <div className={`tools-grid compact${viewMode === 'list' ? ' list-view' : ''}`}>
        {catTools.map((tool, idx) => (
          <motion.div
            key={tool.slug}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.25), ease: 'easeOut' }}
          >
            <ToolCardCompact tool={tool} theme={theme} favorites={favorites} onToggleFav={onToggleFav} viewMode={viewMode} />
          </motion.div>
        ))}
      </div>
    </motion.article>
  )
}

function PopularStrip({ tools, allTools, favorites, onToggleFav }: {
  tools: typeof POPULAR_TOOLS
  allTools: { slug: string; title: string; description: string; category: string }[]
  favorites: Set<string>
  onToggleFav: (slug: string, e: React.MouseEvent) => void
}) {
  return (
    <section className='popular-strip-section'>
      <div className='popular-strip-header'>
        <Flame size={16} className='popular-strip-icon' />
        <span>Most Popular</span>
        <span className='popular-strip-sub'>Tools everyone uses every day</span>
      </div>
      <div className='popular-strip-grid'>
        {tools.map((pt) => {
          const fullTool = allTools.find((t) => t.slug === pt.slug)
          const theme = getCategoryTheme(pt.cat)
          const isFav = favorites.has(pt.slug)
          return (
            <div key={pt.slug} className='popular-strip-card-wrapper'>
              <Link
                to={`/tools/${pt.slug}`}
                className='popular-strip-card'
                style={{ '--pop-accent': theme.accent } as CSSProperties}
              >
                <span className='popular-strip-emoji'>{pt.emoji}</span>
                <span className='popular-strip-label'>{pt.label}</span>
                {fullTool && <span className='popular-strip-desc'>{fullTool.description.split('—')[0].trim()}</span>}
              </Link>
              <button
                type='button'
                className={`fav-star-btn sm${isFav ? ' active' : ''}`}
                onClick={(e) => onToggleFav(pt.slug, e)}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star size={11} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function RecentSection({ recentSlugs, allTools, favorites, onToggleFav, viewMode }: {
  recentSlugs: string[]
  allTools: { slug: string; title: string; description: string; category: string }[]
  favorites: Set<string>
  onToggleFav: (slug: string, e: React.MouseEvent) => void
  viewMode: 'grid' | 'list'
}) {
  if (recentSlugs.length === 0) return null
  const recentTools = recentSlugs
    .map((slug) => allTools.find((t) => t.slug === slug))
    .filter(Boolean) as { slug: string; title: string; description: string; category: string }[]
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
            <p>Your last {recentTools.length} visited tools</p>
          </div>
        </div>
      </div>
      <div className={`tools-grid compact${viewMode === 'list' ? ' list-view' : ''}`}>
        {recentTools.map((tool) => {
          const theme = getCategoryTheme(tool.category)
          return (
            <ToolCardCompact key={tool.slug} tool={tool} theme={theme} favorites={favorites} onToggleFav={onToggleFav} viewMode={viewMode} />
          )
        })}
      </div>
    </motion.section>
  )
}

function FavoritesSection({ allTools, favorites, onToggleFav, viewMode }: {
  allTools: { slug: string; title: string; description: string; category: string }[]
  favorites: Set<string>
  onToggleFav: (slug: string, e: React.MouseEvent) => void
  viewMode: 'grid' | 'list'
}) {
  const favTools = [...favorites]
    .map((slug) => allTools.find((t) => t.slug === slug))
    .filter(Boolean) as { slug: string; title: string; description: string; category: string }[]

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
        {favTools.map((tool) => {
          const theme = getCategoryTheme(tool.category)
          return (
            <ToolCardCompact key={tool.slug} tool={tool} theme={theme} favorites={favorites} onToggleFav={onToggleFav} viewMode={viewMode} />
          )
        })}
      </div>
    </motion.section>
  )
}

export default function AllToolsPage() {
  const { categories, tools, loading, error } = useCatalogData()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all')
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites())
  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => loadRecent())

  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    applyDocumentBranding(
      `All ${tools.length}+ Free Online Tools — PDF, Image, Developer, Student Tools | ISHU TOOLS by Ishu Kumar`,
      `Browse all ${tools.length}+ free online tools at ISHU TOOLS (Indian Student Hub University Tools) by Ishu Kumar. Merge PDF, compress images, JSON formatter, BMI calculator, unit converter, video downloader & more. No signup, no watermark, 100% free for Indian students.`,
      '#3bd0ff',
    )

    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', `Browse all ${tools.length}+ free online tools at ISHU TOOLS by Ishu Kumar. PDF merge, compress, convert, image resize, developer tools, student calculators, unit converters & more. No signup, no watermark, free forever. India's best free tool platform.`)

    let kw = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null
    const kwContent = 'all tools, free online tools, ishu tools, ishu kumar tools, indian student hub university tools, ishutools, pdf tools online free, image tools online, developer tools free, math calculators online, student tools india, unit converter, video downloader free, ishu tools all tools, best free tools india, tools for students india'
    if (kw) kw.content = kwContent
    else {
      kw = document.createElement('meta')
      kw.name = 'keywords'
      kw.content = kwContent
      document.head.appendChild(kw)
    }

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
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      saveFavorites(next)
      return next
    })
  }, [])

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const ai = CATEGORY_PRIORITY.indexOf(a.id)
      const bi = CATEGORY_PRIORITY.indexOf(b.id)
      if (ai === -1 && bi === -1) return a.label.localeCompare(b.label)
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
  }, [categories])

  const filteredTools = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return tools.filter((tool) => {
      if (activeCategory !== 'all' && tool.category !== activeCategory) return false
      if (!q) return true
      return [tool.title, tool.description, ...tool.tags].join(' ').toLowerCase().includes(q)
    })
  }, [activeCategory, deferredQuery, tools])

  const groupedSections = useMemo(() => {
    return sortedCategories
      .map((cat) => ({
        category: cat,
        tools: filteredTools.filter((t) => t.category === cat.id),
      }))
      .filter((e) => e.tools.length > 0)
  }, [sortedCategories, filteredTools])

  const isSearching = deferredQuery.trim().length > 0
  const showPopular = activeCategory === 'all' && !isSearching && activeTab === 'all'
  const showRecent = activeCategory === 'all' && !isSearching && activeTab === 'all'
  const showFavorites = activeTab === 'favorites'

  const clearSearch = () => {
    setQuery('')
    startTransition(() => setActiveCategory('all'))
  }

  return (
    <SiteShell>
      <div className='page-wrap'>
        <section className='all-tools-hero'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className='section-kicker'>Complete Library</span>
            <h1>All {loading ? '1200' : tools.length}+ Free Online Tools</h1>
            <p>Browse every tool across {loading ? '29' : categories.length} categories — find exactly what you need.</p>
          </motion.div>

          <div className='tools-page-controls'>
            <div className='search-control' style={{ flex: 1 }}>
              <label className='search-input'>
                <Search size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search tools... (e.g. merge, compress, OCR, resize)'
                  aria-label='Search all tools'
                />
                <AnimatePresence>
                  {query && (
                    <motion.button
                      type='button'
                      className='search-clear-btn'
                      onClick={clearSearch}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.15 }}
                      aria-label='Clear search'
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </label>
            </div>

            <div className='view-toggle-group'>
              <button
                type='button'
                className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`}
                onClick={() => setViewMode('grid')}
                title='Grid view'
              >
                <Grid3X3 size={16} />
              </button>
              <button
                type='button'
                className={`view-toggle-btn${viewMode === 'list' ? ' active' : ''}`}
                onClick={() => setViewMode('list')}
                title='List view'
              >
                <List size={16} />
              </button>
            </div>
          </div>

          <div className='tools-tab-row'>
            <button
              type='button'
              className={`tools-tab-btn${activeTab === 'all' ? ' active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <TrendingUp size={13} />
              All Tools
            </button>
            <button
              type='button'
              className={`tools-tab-btn${activeTab === 'favorites' ? ' active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <Star size={13} fill={activeTab === 'favorites' ? 'currentColor' : 'none'} />
              Favorites
              {favorites.size > 0 && <span className='tab-badge'>{favorites.size}</span>}
            </button>
          </div>

          <div className='category-row' style={{ marginTop: '0.75rem' }}>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className='skeleton' style={{ display: 'inline-block', width: 80 + i * 10, height: 34, borderRadius: 999 }} />
              ))
            ) : (
              <>
                <button
                  type='button'
                  className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => startTransition(() => setActiveCategory('all'))}
                >
                  All ({tools.length})
                </button>
                {sortedCategories.map((cat) => {
                  const theme = getCategoryTheme(cat.id)
                  const count = tools.filter((t) => t.category === cat.id).length
                  if (count === 0) return null
                  return (
                    <button
                      type='button'
                      key={cat.id}
                      className={`category-pill themed ${activeCategory === cat.id ? 'active' : ''}`}
                      style={{ '--pill-accent': theme.accent } as CSSProperties}
                      onClick={() => startTransition(() => setActiveCategory(cat.id))}
                    >
                      {cat.label} ({count})
                    </button>
                  )
                })}
              </>
            )}
          </div>
        </section>

        <section className='directory-stack' style={{ paddingTop: '1rem' }}>
          {loading && (
            <>
              <SkeletonSection />
              <SkeletonSection />
              <SkeletonSection />
            </>
          )}

          {error && <p className='status-text error'>{error}</p>}

          {!loading && !error && showFavorites && (
            <FavoritesSection
              allTools={tools}
              favorites={favorites}
              onToggleFav={onToggleFav}
              viewMode={viewMode}
            />
          )}

          {!loading && !error && showFavorites && favorites.size === 0 && (
            <article className='empty-state'>
              <Star size={32} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
              <h3>No favorites yet</h3>
              <p>Click the ★ star on any tool to bookmark it here for quick access.</p>
            </article>
          )}

          {!loading && !error && !showFavorites && (
            <>
              {showPopular && (
                <PopularStrip tools={POPULAR_TOOLS} allTools={tools} favorites={favorites} onToggleFav={onToggleFav} />
              )}

              {showRecent && (
                <RecentSection
                  recentSlugs={recentSlugs}
                  allTools={tools}
                  favorites={favorites}
                  onToggleFav={onToggleFav}
                  viewMode={viewMode}
                />
              )}

              {filteredTools.length === 0 && (
                <article className='empty-state'>
                  <h3>No tools matched</h3>
                  <p>Try a different keyword or select "All" categories.</p>
                  <button type='button' className='btn-secondary' onClick={clearSearch} style={{ marginTop: '0.75rem' }}>
                    Clear search
                  </button>
                </article>
              )}

              {groupedSections.map(({ category, tools: catTools }) => {
                const theme = getCategoryTheme(category.id)
                return (
                  <AnimatedSection
                    key={category.id}
                    category={category}
                    catTools={catTools}
                    theme={theme}
                    favorites={favorites}
                    onToggleFav={onToggleFav}
                    viewMode={viewMode}
                  />
                )
              })}
            </>
          )}
        </section>

        <section className='seo-content-section'>
          <h2>All Free Online Tools by ISHU TOOLS — Indian Student Hub University Tools</h2>
          <p>
            ISHU TOOLS (Indian Student Hub University Tools) by Ishu Kumar offers {tools.length || '625'}+ free online tools
            across {categories.length || '29'} categories. From PDF merging, splitting, and compression to image
            editing, developer utilities, math calculators, unit converters, student tools, and video downloaders — every tool is
            completely free, requires no signup, and produces results with no watermark. Created specifically for Indian students and professionals.
          </p>
          <h3>Why Choose ISHU TOOLS by Ishu Kumar?</h3>
          <ul>
            <li><strong>100% Free</strong> — No hidden charges, no premium plans, free forever</li>
            <li><strong>No Signup Required</strong> — Instant access to every tool, no account needed</li>
            <li><strong>No Watermarks</strong> — Clean, professional output every time</li>
            <li><strong>Privacy First</strong> — Files are deleted after processing, fully secure</li>
            <li><strong>Mobile Friendly</strong> — Works perfectly on all devices — phone, tablet, desktop</li>
            <li><strong>Fast Processing</strong> — Results in seconds, not minutes, ultra smooth</li>
            <li><strong>Made for India</strong> — Specialized tools for SSC, UPSC, JEE, NEET, government exams</li>
          </ul>
          <h3>Popular Tool Categories at ISHU TOOLS</h3>
          <p>
            <strong>PDF Tools:</strong> Merge PDF, Split PDF, Compress PDF, PDF to Word, PDF to JPG, OCR PDF, Rotate PDF, Watermark PDF, Protect PDF, Sign PDF. {' '}
            <strong>Image Tools:</strong> Compress Image, Resize Image, Crop Image, Remove Background, Convert Image, Watermark Image, Passport Photo Maker, Compress to KB. {' '}
            <strong>Developer Tools:</strong> JSON Formatter, Base64 Encoder/Decoder, UUID Generator, Regex Tester, Diff Checker, Hash Generator. {' '}
            <strong>Math & Calculators:</strong> Percentage Calculator, BMI Calculator, EMI Calculator, Scientific Calculator, GPA Calculator, SIP Calculator India. {' '}
            <strong>Student Tools:</strong> Attendance Calculator, CGPA Converter, Exam Countdown, Citation Generator, Pomodoro Timer. {' '}
            <strong>Text & AI:</strong> Translate Text, Summarize Text, Word Counter, Case Converter, Grammar Checker. {' '}
            <strong>Video Tools:</strong> YouTube Video Downloader, Instagram Downloader, YouTube to MP3 Converter.
          </p>
        </section>
      </div>
    </SiteShell>
  )
}
