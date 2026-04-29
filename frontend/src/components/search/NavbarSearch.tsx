import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react'

import { useDebounce } from '../../hooks/useDebounce'
import { useCatalogData } from '../../hooks/useCatalogData'
import { searchTools } from '../../lib/toolSearch'
import { highlightMatches } from '../../lib/highlight'
import { getCategoryTheme } from '../../lib/toolPresentation'
import { loadUsage } from '../../lib/usageTracker'
import { prefetchToolRoute } from '../../lib/prefetchTool'
import type { ToolDefinition } from '../../types/tools'

const CATEGORY_LABELS: Record<string, string> = {
  'pdf-core': 'PDF', 'pdf-advanced': 'PDF Pro', 'pdf-security': 'PDF Security',
  'image-core': 'Image', 'image-tools': 'Image+', 'image-layout': 'Layout',
  'developer-tools': 'Developer', 'math-tools': 'Math', 'student-tools': 'Student',
  'finance-tools': 'Finance', 'health-tools': 'Health', 'text-ops': 'Text',
  'video-tools': 'Video', 'audio-tools': 'Audio', 'office-suite': 'Office',
  'format-lab': 'Convert', 'unit-converter': 'Units', 'network-tools': 'Network',
  'color-tools': 'Color', 'security-tools': 'Security', 'productivity': 'Daily',
  'data-tools': 'Data', 'seo-tools': 'SEO', 'social-media': 'Social',
}

const MAX_RESULTS = 8

type Props = {
  open: boolean
  onClose: () => void
}

/**
 * NavbarSearch — an inline search dropdown that renders directly inside
 * the navbar area. Uses the same optimized `searchTools` engine as the
 * homepage "Find the exact tool fast" section.
 *
 * Key perf differences from the old CommandPalette:
 *   • No portal render — stays in the existing DOM tree
 *   • Shares `useCatalogData` singleton (already loaded by the app)
 *   • `loadUsage()` called once on open, not per-render
 *   • Tighter debounce (60ms vs 70ms) for snappier feel
 *   • Fewer results (8 vs 9) → less DOM work
 *   • ResultRow is React.memo'd to avoid re-renders on hover
 */
export default function NavbarSearch({ open, onClose }: Props) {
  const navigate = useNavigate()
  const { tools } = useCatalogData()

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Tighter debounce — 60ms feels instant, avoids work per keystroke
  const debouncedQuery = useDebounce(query, 60)
  const isSearching = debouncedQuery.trim().length > 0

  // Snapshot usage once per open (not per-render)
  const localUsage = useMemo(() => (open ? loadUsage() : {}), [open])

  // Compute search results using the same engine as homepage
  const results = useMemo<ToolDefinition[]>(() => {
    if (!tools.length || !isSearching) return []
    return searchTools(tools, debouncedQuery, {
      localUsage,
      limit: MAX_RESULTS,
    })
  }, [tools, debouncedQuery, isSearching, localUsage])

  // Quick picks when no query — top 5 tools by priority
  const quickPicks = useMemo<ToolDefinition[]>(() => {
    if (!tools.length || isSearching) return []
    return searchTools(tools, '', { localUsage, limit: 5 })
  }, [tools, isSearching, localUsage])

  const displayList = isSearching ? results : quickPicks

  // Reset on open
  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => {
        setQuery('')
        setActiveIndex(0)
        inputRef.current?.focus()
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [open])

  // Reset index when results change
  useEffect(() => {
    const frame = requestAnimationFrame(() => setActiveIndex(0))
    return () => cancelAnimationFrame(frame)
  }, [debouncedQuery])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // Defer so the current click that opened it doesn't immediately close
    const t = setTimeout(() => {
      document.addEventListener('mousedown', handleClick)
    }, 10)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open, onClose])

  const commit = useCallback((slug: string) => {
    onClose()
    navigate(slug === 'scientific-calculator' ? '/scientific-calculator' : `/tools/${slug}`)
  }, [navigate, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, Math.max(displayList.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = displayList[activeIndex]
      if (target) commit(target.slug)
    }
  }, [displayList, activeIndex, commit, onClose])

  if (!open) return null

  return (
    <div className='ns-root' ref={panelRef} onKeyDown={handleKeyDown}>
      <div className='ns-input-row'>
        <Search size={16} className='ns-input-icon' />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search all tools…'
          className='ns-input'
          spellCheck={false}
          autoComplete='off'
        />
        {query && (
          <button
            className='ns-clear'
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            aria-label='Clear'
          >
            <X size={14} />
          </button>
        )}
        <span className='ns-count'>
          {isSearching
            ? `${results.length} match${results.length !== 1 ? 'es' : ''}`
            : `${tools.length} tools`}
        </span>
      </div>

      <div className='ns-results'>
        {!isSearching && displayList.length > 0 && (
          <div className='ns-section-label'>Top tools</div>
        )}
        {isSearching && results.length === 0 && (
          <div className='ns-empty'>
            No results for "{debouncedQuery}" — try a shorter keyword
          </div>
        )}
        {displayList.map((tool, i) => (
          <NavResultRow
            key={tool.slug}
            tool={tool}
            index={i}
            active={i === activeIndex}
            query={isSearching ? debouncedQuery : undefined}
            onHover={setActiveIndex}
            onSelect={commit}
          />
        ))}
      </div>

      <div className='ns-footer'>
        <span className='ns-kbd-hint'><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
        <span className='ns-kbd-hint'><kbd><CornerDownLeft size={9} /></kbd> open</span>
        <span className='ns-kbd-hint'><kbd>Esc</kbd> close</span>
      </div>
    </div>
  )
}

type RowProps = {
  tool: ToolDefinition
  index: number
  active: boolean
  query?: string
  onHover: (i: number) => void
  onSelect: (slug: string) => void
}

const NavResultRow = memo(function NavResultRow({ tool, index, active, query, onHover, onSelect }: RowProps) {
  const theme = getCategoryTheme(tool.category)
  const label = CATEGORY_LABELS[tool.category] ?? tool.category.replace(/-/g, ' ')
  return (
    <button
      type='button'
      className={`ns-row ${active ? 'active' : ''}`}
      style={{ ['--ns-accent' as string]: theme.accent }}
      onMouseEnter={() => { onHover(index); prefetchToolRoute(tool.slug) }}
      onClick={() => onSelect(tool.slug)}
    >
      <span className='ns-row-bar' aria-hidden='true' />
      <span className='ns-row-body'>
        <span className='ns-row-title'>{query ? highlightMatches(tool.title, query) : tool.title}</span>
        <span className='ns-row-desc'>{query ? highlightMatches(tool.description, query) : tool.description}</span>
      </span>
      <span className='ns-row-cat'>{label}</span>
      <ArrowRight size={13} className='ns-row-arrow' />
    </button>
  )
})
