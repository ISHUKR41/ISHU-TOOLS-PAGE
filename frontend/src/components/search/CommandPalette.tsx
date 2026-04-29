import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, Sparkles, ArrowRight, CornerDownLeft, Trash2, Mic } from 'lucide-react'

import { useDebounce } from '../../hooks/useDebounce'
import { useCatalogData } from '../../hooks/useCatalogData'
import { searchTools, sortToolsByPriority, DAILY_CATEGORY_PRIORITY, getDidYouMeanSuggestions } from '../../lib/toolSearch'
import { highlightMatches } from '../../lib/highlight'
import { getCategoryTheme } from '../../lib/toolPresentation'
import {
  loadUsage,
  loadRecentSearches,
  pushRecentSearch,
  clearRecentSearches,
} from '../../lib/usageTracker'
import { fetchPopularityMap } from '../../api/toolsApi'
import { prefetchToolRoute } from '../../lib/prefetchTool'
import type { ToolDefinition } from '../../types/tools'

type Props = {
  open: boolean
  onClose: () => void
}

type SpeechRecognitionResultLike = {
  0: { transcript: string }
}

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>
}

type SpeechRecognitionErrorLike = {
  error?: string
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  onstart: (() => void) | null
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null
  onend: (() => void) | null
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike
type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}

const CATEGORY_LABELS: Record<string, string> = {
  'pdf-core': 'PDF',
  'pdf-advanced': 'PDF Pro',
  'pdf-security': 'PDF Security',
  'image-core': 'Image',
  'image-tools': 'Image+',
  'image-layout': 'Layout',
  'developer-tools': 'Developer',
  'math-tools': 'Math',
  'student-tools': 'Student',
  'finance-tools': 'Finance',
  'health-tools': 'Health',
  'text-ops': 'Text',
  'video-tools': 'Video',
  'audio-tools': 'Audio',
  'office-suite': 'Office',
  'format-lab': 'Convert',
  'unit-converter': 'Units',
  'network-tools': 'Network',
  'color-tools': 'Color',
  'security-tools': 'Security',
  'productivity': 'Daily',
  'data-tools': 'Data',
  'seo-tools': 'SEO',
  'social-media': 'Social',
}

const RESULT_LIMIT = 9

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  const speechWindow = window as SpeechWindow
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null
}

export default function CommandPalette({ open, onClose }: Props) {
  const navigate = useNavigate()
  const { tools } = useCatalogData()

  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeIndex, setActiveIndex] = useState(0)
  const [globalPopularity, setGlobalPopularity] = useState<Record<string, number>>({})
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  const debouncedQuery = useDebounce(query, 70)

  /* Voice search support detection (memoized once) */
  const voiceSupported = useMemo(() => {
    return Boolean(getSpeechRecognitionConstructor())
  }, [])

  const stopVoice = useCallback(() => {
    try { recognitionRef.current?.stop() } catch { /* noop */ }
    setIsListening(false)
  }, [])

  const startVoice = useCallback(() => {
    if (!voiceSupported) return
    if (isListening) { stopVoice(); return }

    setVoiceError(null)
    const SR = getSpeechRecognitionConstructor()
    if (!SR) return
    const rec = new SR()
    rec.lang = navigator.language || 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.maxAlternatives = 1

    rec.onstart = () => setIsListening(true)
    rec.onerror = (e: SpeechRecognitionErrorLike) => {
      setIsListening(false)
      const code = e?.error || 'error'
      const msg =
        code === 'not-allowed' ? 'Mic permission denied — enable it in browser settings.' :
        code === 'no-speech' ? 'Didn\u2019t catch that — try again.' :
        code === 'audio-capture' ? 'No microphone detected.' :
        'Voice search unavailable right now.'
      setVoiceError(msg)
      window.setTimeout(() => setVoiceError(null), 3200)
    }
    rec.onend = () => setIsListening(false)
    rec.onresult = (event: SpeechRecognitionEventLike) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      const cleaned = transcript.trim().replace(/[.!?,]+$/g, '')
      if (cleaned) {
        setQuery(cleaned)
        setActiveCategory('all')
        setActiveIndex(0)
      }
    }

    recognitionRef.current = rec
    try { rec.start() } catch { setIsListening(false) }
  }, [voiceSupported, isListening, stopVoice])

  /* Hydrate global popularity once (cached by API layer) */
  useEffect(() => {
    if (!open) return
    fetchPopularityMap().then(setGlobalPopularity).catch(() => undefined)
  }, [open])

  /* Reset state on every fresh open and load recents */
  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => {
        setQuery('')
        setActiveCategory('all')
        setActiveIndex(0)
        setRecentSearches(loadRecentSearches())
      })
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => {
        cancelAnimationFrame(frame)
        clearTimeout(t)
      }
    } else {
      // Stop any active voice recognition when palette closes
      try { recognitionRef.current?.stop() } catch { /* noop */ }
      const frame = requestAnimationFrame(() => {
        setIsListening(false)
        setVoiceError(null)
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [open])

  /* Lock body scroll while open */
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])

  const localUsage = useMemo(() => (open ? loadUsage() : {}), [open])

  /* Active categories (only those that have tools, in priority order) */
  const availableCategories = useMemo(() => {
    if (!tools.length) return [] as string[]
    const present = new Set(tools.map((t) => t.category))
    return DAILY_CATEGORY_PRIORITY.filter((c) => present.has(c))
  }, [tools])

  /* Compute results */
  const results = useMemo<ToolDefinition[]>(() => {
    if (!tools.length) return []
    return searchTools(tools, debouncedQuery, {
      category: activeCategory,
      localUsage,
      globalPopularity,
      limit: RESULT_LIMIT,
    })
  }, [tools, debouncedQuery, activeCategory, localUsage, globalPopularity])

  /* When the query has nothing, surface "Daily picks" */
  const dailyPicks = useMemo<ToolDefinition[]>(() => {
    if (!tools.length) return []
    return sortToolsByPriority(tools, localUsage, globalPopularity).slice(0, 6)
  }, [tools, localUsage, globalPopularity])

  /* "Did you mean?" — only computed when strict search returned nothing.
   * Uses a very-forgiving Fuse pass so even heavy typos surface a suggestion. */
  const didYouMean = useMemo<ToolDefinition[]>(() => {
    if (!tools.length || !debouncedQuery.trim() || results.length > 0) return []
    return getDidYouMeanSuggestions(tools, debouncedQuery, 2)
  }, [tools, debouncedQuery, results.length])

  /* Reset the highlighted index whenever the result set changes */
  useEffect(() => {
    const frame = requestAnimationFrame(() => setActiveIndex(0))
    return () => cancelAnimationFrame(frame)
  }, [debouncedQuery, activeCategory])

  /* Keep the highlighted item in view */
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector<HTMLElement>(`[data-cp-idx="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const commit = useCallback((slug: string) => {
    if (debouncedQuery.trim().length >= 2) pushRecentSearch(debouncedQuery.trim())
    onClose()
    navigate(`/tools/${slug}`)
  }, [debouncedQuery, navigate, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = results[activeIndex]
      if (target) commit(target.slug)
    }
  }, [results, activeIndex, commit, onClose])

  if (!open) return null

  const showRecent = !debouncedQuery.trim()
  const noResults = !showRecent && results.length === 0

  return createPortal(
    <div className='cp-root' role='dialog' aria-modal='true' aria-label='Search all tools'>
      <div className='cp-backdrop' onClick={onClose} />

      <div className='cp-panel' onKeyDown={handleKeyDown}>
        <div className='cp-input-row'>
          <Search size={18} className='cp-input-icon' />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search 1,200+ tools — try "compress pdf", "remove bg", "emi"…'
            className='cp-input'
            spellCheck={false}
            autoComplete='off'
          />
          {query && (
            <button className='cp-clear' onClick={() => { setQuery(''); inputRef.current?.focus() }} aria-label='Clear search'>
              <X size={15} />
            </button>
          )}
          {voiceSupported && (
            <button
              type='button'
              className={`cp-mic${isListening ? ' listening' : ''}`}
              onClick={startVoice}
              aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
              aria-pressed={isListening}
              title={isListening ? 'Listening… click to stop' : 'Voice search'}
            >
              <Mic size={15} />
              {isListening && <span className='cp-mic-pulse' aria-hidden='true' />}
            </button>
          )}
          <button className='cp-close' onClick={onClose} aria-label='Close search'>
            Esc
          </button>
        </div>

        {(isListening || voiceError) && (
          <div className={`cp-voice-banner${voiceError ? ' err' : ''}`} role='status' aria-live='polite'>
            {voiceError ? voiceError : (
              <>
                <span className='cp-voice-dot' /> Listening… speak the tool name (e.g. <em>compress pdf</em>)
              </>
            )}
          </div>
        )}

        {!showRecent && availableCategories.length > 0 && (
          <div className='cp-chips' role='tablist'>
            <button
              type='button'
              className={`cp-chip ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
              aria-pressed={activeCategory === 'all'}
            >
              All
            </button>
            {availableCategories.map((cat) => {
              const theme = getCategoryTheme(cat)
              const label = CATEGORY_LABELS[cat] ?? cat.replace(/-/g, ' ')
              return (
                <button
                  key={cat}
                  type='button'
                  className={`cp-chip ${activeCategory === cat ? 'active' : ''}`}
                  style={{ ['--cp-chip-accent' as string]: theme.accent }}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}

        <div className='cp-results' ref={listRef}>
          {showRecent && recentSearches.length > 0 && (
            <div className='cp-section'>
              <div className='cp-section-head'>
                <Clock size={13} /> Recent searches
                <button
                  className='cp-section-clear'
                  onClick={() => { clearRecentSearches(); setRecentSearches([]) }}
                  type='button'
                >
                  <Trash2 size={12} /> Clear
                </button>
              </div>
              <div className='cp-recent-row'>
                {recentSearches.map((q) => (
                  <button
                    key={q}
                    className='cp-recent-pill'
                    type='button'
                    onClick={() => { setQuery(q); inputRef.current?.focus() }}
                  >
                    <Search size={11} /> {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showRecent && (
            <div className='cp-section'>
              <div className='cp-section-head'>
                <Sparkles size={13} /> Daily picks
              </div>
              <div className='cp-list'>
                {dailyPicks.map((tool, i) => (
                  <ResultRow
                    key={tool.slug}
                    tool={tool}
                    index={i}
                    active={i === activeIndex}
                    onHover={setActiveIndex}
                    onSelect={commit}
                  />
                ))}
              </div>
            </div>
          )}

          {!showRecent && results.length > 0 && (
            <div className='cp-list'>
              {results.map((tool, i) => (
                <ResultRow
                  key={tool.slug}
                  tool={tool}
                  index={i}
                  active={i === activeIndex}
                  query={debouncedQuery}
                  onHover={setActiveIndex}
                  onSelect={commit}
                />
              ))}
            </div>
          )}

          {noResults && (
            <div className='cp-empty'>
              <p className='cp-empty-title'>No exact matches for “{debouncedQuery}”.</p>

              {didYouMean.length > 0 && (
                <div className='cp-dym'>
                  <span className='cp-dym-label'>
                    <Sparkles size={12} /> Did you mean
                  </span>
                  <div className='cp-dym-row'>
                    {didYouMean.map((tool, i) => (
                      <button
                        key={tool.slug}
                        type='button'
                        className='cp-dym-chip'
                        onClick={() => commit(tool.slug)}
                        onMouseEnter={() => prefetchToolRoute(tool.slug)}
                        autoFocus={i === 0}
                      >
                        <strong>{tool.title}</strong>
                        <ArrowRight size={12} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className='cp-empty-sub'>
                Try a shorter word, check spelling, or browse a category above.
                If you’re typing in Hinglish, try the English equivalent (e.g. <em>“image chhoti karo”</em> → <em>“compress image”</em>).
              </p>
              <div className='cp-suggestion-row'>
                {dailyPicks.slice(0, 4).map((tool) => (
                  <button
                    key={tool.slug}
                    className='cp-suggestion'
                    type='button'
                    onClick={() => commit(tool.slug)}
                  >
                    {tool.title} <ArrowRight size={11} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='cp-footer'>
          <span className='cp-kbd-hint'><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span className='cp-kbd-hint'><kbd><CornerDownLeft size={10} /></kbd> open</span>
          <span className='cp-kbd-hint'><kbd>Esc</kbd> close</span>
          <span className='cp-footer-spacer' />
          <span className='cp-footer-count'>
            {showRecent
              ? `${tools.length.toLocaleString()} tools indexed`
              : `${results.length} of ${tools.length.toLocaleString()}`}
          </span>
        </div>
      </div>
    </div>,
    document.body,
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

function ResultRow({ tool, index, active, query, onHover, onSelect }: RowProps) {
  const theme = getCategoryTheme(tool.category)
  const label = CATEGORY_LABELS[tool.category] ?? tool.category.replace(/-/g, ' ')
  return (
    <button
      type='button'
      className={`cp-row ${active ? 'active' : ''}`}
      data-cp-idx={index}
      style={{ ['--cp-row-accent' as string]: theme.accent }}
      onMouseEnter={() => { onHover(index); prefetchToolRoute(tool.slug) }}
      onFocus={() => onHover(index)}
      onClick={() => onSelect(tool.slug)}
    >
      <span className='cp-row-icon' aria-hidden='true' />
      <span className='cp-row-body'>
        <span className='cp-row-title'>{query ? highlightMatches(tool.title, query) : tool.title}</span>
        <span className='cp-row-desc'>{query ? highlightMatches(tool.description, query) : tool.description}</span>
      </span>
      <span className='cp-row-cat'>{label}</span>
      <ArrowRight size={14} className='cp-row-arrow' />
    </button>
  )
}
