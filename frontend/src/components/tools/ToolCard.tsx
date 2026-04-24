import { ArrowUpRight } from 'lucide-react'
import { memo, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import type { ToolDefinition } from '../../types/tools'
import { prefetchToolRoute } from '../../lib/prefetchTool'
import ToolIcon from './ToolIcon'

type ToolCardProps = {
  tool: ToolDefinition
  categoryLabel: string
  accentColor?: string
}

const INPUT_KIND_LABELS: Record<string, { label: string; icon: string }> = {
  files: { label: 'File upload', icon: '📁' },
  url: { label: 'URL input', icon: '🔗' },
  mixed: { label: 'File + Text', icon: '📁' },
  text: { label: 'Text input', icon: '⌨️' },
}

const ToolCard = memo(function ToolCard({ tool, categoryLabel, accentColor }: ToolCardProps) {
  const inputKind = INPUT_KIND_LABELS[tool.input_kind] || INPUT_KIND_LABELS.text

  // ─── Hover/focus/touch prefetch ────────────────────────────────────────
  // Warms the ToolPage chunk + tool definition in the background so the
  // click navigation feels instant. Idempotent — only fires once per slug.
  const handlePrefetch = useCallback(() => {
    prefetchToolRoute(tool.slug)
  }, [tool.slug])

  return (
    <article
      className='tool-card'
      style={{ '--tool-accent': accentColor || '#3bd0ff' } as CSSProperties}
      onMouseEnter={handlePrefetch}
      onTouchStart={handlePrefetch}
    >
      <Link
        to={`/tools/${tool.slug}`}
        className='tool-card-link'
        onFocus={handlePrefetch}
      >
        <div className='tool-card-header'>
          <span className='tool-icon-wrap'>
            <ToolIcon slug={tool.slug} className='tool-icon' />
          </span>
          <ArrowUpRight className='tool-open-icon' />
        </div>
        <div className='tool-card-topline'>
          <span className='tool-chip'>{categoryLabel}</span>
          {tool.tags[0] && <span className='tool-chip subtle'>{tool.tags[0]}</span>}
        </div>
        <h3>{tool.title}</h3>
        <p>{tool.description}</p>
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

