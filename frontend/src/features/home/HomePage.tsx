import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Search } from 'lucide-react'

import SiteShell from '../../components/layout/SiteShell'
import { useCatalogData } from '../../hooks/useCatalogData'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import HeroSection from './components/HeroSection'
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
      'ISHU TOOLS — Indian Student Hub University Tools',
      '383+ free online tools for students & professionals. PDF, Image, Developer, Math, Text & AI tools — no signup, no watermark.',
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

              {categories.map((category) => {
                const theme = getCategoryTheme(category.id)
                return (
                  <button
                    type='button'
                    key={category.id}
                    className={`category-pill themed ${activeCategory === category.id ? 'active' : ''}`}
                    style={{ '--pill-accent': theme.accent } as CSSProperties}
                    onClick={() =>
                      startTransition(() => {
                        setActiveCategory(category.id)
                      })
                    }
                  >
                    {category.label} ({counts.byCategory[category.id] || 0})
                  </button>
                )
              })}
            </div>
          </div>
        </section>



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

        {/* How it Works Section — SEO rich */}
        {!loading && !error && (
          <section className='how-it-works-section'>
            <span className='section-kicker'>Simple & Fast</span>
            <h2>How ISHU TOOLS Works</h2>
            <div className='steps-grid'>
              <div className='step-card'>
                <div className='step-number'>1</div>
                <h3>Choose a Tool</h3>
                <p>Search from {tools.length}+ free tools across {categories.length} categories — PDF, Image, Developer, Math, and more.</p>
              </div>
              <div className='step-card'>
                <div className='step-number'>2</div>
                <h3>Upload or Enter Data</h3>
                <p>Upload your files or enter text/data. Drag & drop supported. All files processed securely.</p>
              </div>
              <div className='step-card'>
                <div className='step-number'>3</div>
                <h3>Run & Download</h3>
                <p>Click "Run" and download your result instantly. No signup, no watermark, no limits. 100% free.</p>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section — SEO snippets */}
        {!loading && !error && (
          <section className='home-faq-section'>
            <span className='section-kicker'>Have Questions?</span>
            <h2>Frequently Asked Questions</h2>
            <div className='faq-list'>
              <details className='faq-item'>
                <summary className='faq-question'>What is ISHU TOOLS?</summary>
                <p className='faq-answer'>ISHU TOOLS (Indian Student Hub University Tools) is a free online platform with {tools.length}+ tools for PDF processing, image editing, developer utilities, math calculators, text operations, and more. Created by Ishu Kumar, it's designed for students and professionals — no signup, no watermark, completely free.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>Is ISHU TOOLS free to use?</summary>
                <p className='faq-answer'>Yes! ISHU TOOLS is 100% free. All tools are available without any signup, registration, or payment. There are no watermarks, no limits, and no hidden charges.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>Is my data safe?</summary>
                <p className='faq-answer'>Absolutely! All uploaded files are processed securely and automatically deleted after processing. We never store, share, or access your files. Your privacy is our top priority.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>Can I use ISHU TOOLS on mobile?</summary>
                <p className='faq-answer'>Yes! ISHU TOOLS is fully responsive and works perfectly on all devices — smartphones, tablets, laptops, and desktop computers.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>How many tools does ISHU TOOLS have?</summary>
                <p className='faq-answer'>ISHU TOOLS currently offers {tools.length}+ tools across {categories.length} categories including PDF Tools, Image Tools, Developer Tools, Math Calculators, Text Tools, Color Tools, Unit Converters, Security Tools, and Social Media Tools. New tools are added regularly.</p>
              </details>
            </div>
          </section>
        )}

        {!loading && !error && (
          <footer className='home-footer'>
            <p>
              <strong>{totalVisibleTools}</strong> tools · <strong>{categories.length}</strong> categories · Free forever · No signup · No watermark
            </p>
          </footer>
        )}
      </div>
    </SiteShell>
  )
}
