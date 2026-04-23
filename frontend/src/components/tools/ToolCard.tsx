import { ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import type { ToolDefinition } from '../../types/tools'
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

export default function ToolCard({ tool, categoryLabel, accentColor }: ToolCardProps) {
  const inputKind = INPUT_KIND_LABELS[tool.input_kind] || INPUT_KIND_LABELS.text

  return (
    <article
      className='tool-card'
      style={{ '--tool-accent': accentColor || '#3bd0ff' } as CSSProperties}
    >
      <Link to={`/tools/${tool.slug}`} className='tool-card-link'>
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
}

