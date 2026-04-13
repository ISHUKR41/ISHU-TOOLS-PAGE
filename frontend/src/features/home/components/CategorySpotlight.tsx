import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'

import { getCategoryTheme } from '../../../lib/toolPresentation'
import type { ToolCategory } from '../../../types/tools'

type CategorySpotlightProps = {
  categories: ToolCategory[]
  toolCountByCategory: Record<string, number>
  activeCategory: string
  onSelect: (categoryId: string) => void
}

export default function CategorySpotlight({
  categories,
  toolCountByCategory,
  activeCategory,
  onSelect,
}: CategorySpotlightProps) {
  return (
    <section className='spotlight-grid'>
      {categories.map((category, index) => {
        const theme = getCategoryTheme(category.id)
        const isActive = activeCategory === category.id

        return (
          <motion.button
            type='button'
            key={category.id}
            className={`spotlight-card ${isActive ? 'active' : ''}`}
            style={
              {
                '--card-accent': theme.accent,
                '--card-surface': theme.surface,
                '--card-glow': theme.glow,
              } as CSSProperties
            }
            onClick={() => onSelect(category.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
          >
            <div className='spotlight-top'>
              <span className='spotlight-kicker'>{theme.label}</span>
              <strong className='spotlight-count'>{toolCountByCategory[category.id] || 0}</strong>
            </div>
            <h2>{category.label}</h2>
            <p>{category.description}</p>
          </motion.button>
        )
      })}
    </section>
  )
}
