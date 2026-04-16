import type { CSSProperties } from 'react'

import { getCategoryTheme } from '../../../lib/toolPresentation'
import type { ToolCategory, ToolDefinition } from '../../../types/tools'
import ToolCard from '../../../components/tools/ToolCard'

type ToolCategorySectionProps = {
  category: ToolCategory
  tools: ToolDefinition[]
}

export default function ToolCategorySection({ category, tools }: ToolCategorySectionProps) {
  const theme = getCategoryTheme(category.id)

  if (tools.length === 0) return null

  return (
    <section
      className='tool-section'
      style={{ '--tool-accent': theme.accent } as CSSProperties}
    >
      <header className='section-heading'>
        <div className='section-heading-left'>
          <span className='section-kicker' style={{ color: theme.accent }}>
            {theme.label}
          </span>
          <div className='section-heading-title-row'>
            <h2>{category.label}</h2>
            <span className='tool-count-badge' style={{ '--badge-color': theme.accent } as CSSProperties}>
              {tools.length} tools
            </span>
          </div>
        </div>
        <p>{category.description}</p>
      </header>

      <div className='tool-grid'>
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            categoryLabel={category.label}
            accentColor={theme.accent}
          />
        ))}
      </div>
    </section>
  )
}
