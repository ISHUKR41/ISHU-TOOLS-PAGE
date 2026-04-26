import { ArrowUpRight, Sparkles } from 'lucide-react'
import { memo, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import type { ToolDefinition } from '../../types/tools'
import { prefetchToolRoute } from '../../lib/prefetchTool'
import { highlightMatches } from '../../lib/highlight'
import ToolIcon from './ToolIcon'

type ToolCardProps = {
  tool: ToolDefinition
  categoryLabel: string
  accentColor?: string
  /** Active search query; when present, matched text is wrapped in <mark>. */
  query?: string
  /** Personal visit count (from usageTracker). When > 0, a subtle indicator appears. */
  visits?: number
}

const INPUT_KIND_LABELS: Record<string, { label: string; icon: string }> = {
  files: { label: 'File upload', icon: '📁' },
  url: { label: 'URL input', icon: '🔗' },
  mixed: { label: 'File + Text', icon: '📁' },
  text: { label: 'Text input', icon: '⌨️' },
}

const ToolCard = memo(function ToolCard({ tool, categoryLabel, accentColor, query, visits }: ToolCardProps) {
  const inputKind = INPUT_KIND_LABELS[tool.input_kind] || INPUT_KIND_LABELS.text

  // ─── Hover/focus/touch prefetch ────────────────────────────────────────
  // Warms the ToolPage chunk + tool definition in the background so the
  // click navigation feels instant. Idempotent — only fires once per slug.
  const handlePrefetch = useCallback(() => {
    prefetchToolRoute(tool.slug)
  }, [tool.slug])

  const usedBefore = (visits ?? 0) > 0

  return (
    <article
      className={`tool-card${usedBefore ? ' tool-card-used' : ''}`}
      style={{ '--tool-accent': accentColor || '#3bd0ff' } as CSSProperties}
      onMouseEnter={handlePrefetch}
      onTouchStart={handlePrefetch}
    >
      <Link
        to={`/tools/${tool.slug}`}
        className='tool-card-link'
        onFocus={handlePrefetch}
        aria-label={`Open ${tool.title}`}
      >
        <div className='tool-card-header'>
          <span className='tool-icon-wrap'>
            <ToolIcon slug={tool.slug} className='tool-icon' />
          </span>
          {usedBefore && (
            <span className='tool-used-pill' title={`You've used this ${visits} ${visits === 1 ? 'time' : 'times'}`}>
              <Sparkles size={11} />
              {visits! > 9 ? '9+' : visits}
            </span>
          )}
          <ArrowUpRight className='tool-open-icon' />
        </div>
        <div className='tool-card-topline'>
          <span className='tool-chip'>{categoryLabel}</span>
          {tool.tags[0] && <span className='tool-chip subtle'>{tool.tags[0]}</span>}
        </div>
        <h3>{query ? highlightMatches(tool.title, query) : tool.title}</h3>
        <p>{query ? highlightMatches(tool.description, query) : tool.description}</p>
        <div className='tool-meta'>
          <span className='tool-meta-pill'>
            <span className='tool-meta-icon'>{inputKind.icon}</span>
            {inputKind.label}
          </span>
          {tool.accepts_multiple && (
            <span className='tool-meta-pill'>
              <span className='tool-meta-icon'>📦</span>
              Multi-file
            </span>
          )}
        </div>
      </Link>
    </article>
  )
})

export default ToolCard
