import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'

import SiteShell from '../../components/layout/SiteShell'
import { useCatalogData } from '../../hooks/useCatalogData'
import { applyDocumentBranding } from '../../lib/toolPresentation'
import HeroSection from './components/HeroSection'
import CategorySpotlight from './components/CategorySpotlight'
import ToolCategorySection from './components/ToolCategorySection'

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ishu-kumar-5a0940281/',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ishukr10?igsh=OTNoaTJ2bm1ndWlp',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@ishu-fun',
  },
  {
    label: 'X',
    href: 'https://x.com/ISHU_IITP',
  },
]

export default function HomePage() {
  const { categories, tools, loading, error, apiReady } = useCatalogData()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    applyDocumentBranding(
      'ISHU TOOLS',
      'Python-powered PDF, image, text, and export workflows with dedicated tool pages.',
      '#3bd0ff',
    )
  }, [])

  const counts = useMemo(() => {
    const byCategory = Object.fromEntries(categories.map((category) => [category.id, 0]))
    let pdfCount = 0
    let imageCount = 0

    for (const tool of tools) {
      byCategory[tool.category] = (byCategory[tool.category] || 0) + 1
      if (tool.category.startsWith('pdf') || tool.slug.includes('pdf')) pdfCount += 1
      if (tool.category.startsWith('image') || tool.slug.includes('image')) imageCount += 1
    }

    return {
      byCategory,
      pdfCount,
      imageCount,
    }
  }, [categories, tools])

  const filteredTools = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return tools.filter((tool) => {
      if (activeCategory !== 'all' && tool.category !== activeCategory) return false
      if (!normalizedQuery) return true

      const haystack = [tool.title, tool.description, ...tool.tags].join(' ').toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [activeCategory, deferredQuery, tools])

  const groupedSections = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        tools: filteredTools.filter((tool) => tool.category === category.id),
      }))
      .filter((entry) => entry.tools.length > 0)
  }, [categories, filteredTools])

  const totalVisibleTools = filteredTools.length

  return (
    <SiteShell>
      <div className='page-wrap home-wrap'>
        <HeroSection
          toolCount={tools.length}
          categoryCount={categories.length}
          pdfCount={counts.pdfCount}
          imageCount={counts.imageCount}
          apiReady={apiReady}
          socialLinks={socialLinks}
        />

        <section className='surface-panel search-panel'>
          <div className='toolbar-meta'>
            <div>
              <span className='section-kicker'>Smart directory</span>
              <h2>Find the exact tool fast</h2>
            </div>
            <p>
              Search by tool name, workflow, tag, or category. Every tool opens on its own
              dedicated page with a focused workspace.
            </p>
          </div>

          <div className='search-control'>
            <label className='search-input'>
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder='Search merge, OCR, watermark, image, PDF, JSON...'
              />
            </label>

            <div className='category-row'>
              <button
                type='button'
                className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() =>
                  startTransition(() => {
                    setActiveCategory('all')
                  })
                }
              >
                All ({tools.length})
              </button>

              {categories.map((category) => (
                <button
                  type='button'
                  key={category.id}
                  className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() =>
                    startTransition(() => {
                      setActiveCategory(category.id)
                    })
                  }
                >
                  {category.label} ({counts.byCategory[category.id] || 0})
                </button>
              ))}
            </div>
          </div>
        </section>

        <CategorySpotlight
          categories={categories}
          toolCountByCategory={counts.byCategory}
          activeCategory={activeCategory}
          onSelect={(categoryId) =>
            startTransition(() => {
              setActiveCategory((current) => (current === categoryId ? 'all' : categoryId))
            })
          }
        />

        <section id='tool-directory' className='directory-stack'>
          {loading && <p className='status-text'>Loading categories and tools...</p>}
          {error && <p className='status-text error'>{error}</p>}

          {!loading && !error && groupedSections.length === 0 && (
            <article className='empty-state'>
              <h3>No tools matched this search</h3>
              <p>Try another keyword or switch back to all categories.</p>
            </article>
          )}

          {!loading &&
            !error &&
            groupedSections.map(({ category, tools: categoryTools }) => (
              <ToolCategorySection key={category.id} category={category} tools={categoryTools} />
            ))}
        </section>

        {!loading && !error && (
          <footer className='home-footer'>
            <p>
              Showing <strong>{totalVisibleTools}</strong> tools across a modular React +
              FastAPI workspace.
            </p>
          </footer>
        )}
      </div>
    </SiteShell>
  )
}
