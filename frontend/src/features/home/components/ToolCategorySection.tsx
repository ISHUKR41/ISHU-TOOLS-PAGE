import { motion } from 'framer-motion'

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
    <motion.section
      className='tool-section'
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header className='section-heading'>
        <div>
          <span className='section-kicker' style={{ color: theme.accent }}>
            {theme.label}
          </span>
          <h2>{category.label}</h2>
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
    </motion.section>
  )
}

