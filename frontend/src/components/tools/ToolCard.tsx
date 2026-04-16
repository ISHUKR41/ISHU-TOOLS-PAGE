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

export default function ToolCard({ tool, categoryLabel, accentColor }: ToolCardProps) {
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
          <span>{tool.input_kind}</span>
          <span>{tool.accepts_multiple ? 'Multi-file' : 'Single-file'}</span>
        </div>
      </Link>
    </article>
  )
}
