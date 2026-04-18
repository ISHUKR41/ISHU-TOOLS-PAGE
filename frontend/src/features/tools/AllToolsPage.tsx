import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

import SiteShell from '../../components/layout/SiteShell'
import { useCatalogData } from '../../hooks/useCatalogData'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import ToolIcon from '../../components/tools/ToolIcon'

export default function AllToolsPage() {
  const { categories, tools, loading, error } = useCatalogData()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    applyDocumentBranding(
      'All Tools — 441+ Free Online Tools | ISHU TOOLS',
      'Browse all 441+ free online tools. PDF tools, image tools, developer tools, math calculators, text tools, and more. No signup, no watermark.',
      '#3bd0ff',
    )

    // SEO meta
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', 'Browse all 441+ free online tools at ISHU TOOLS. PDF merge, compress, convert, image resize, developer tools, calculators, and more. No signup, no watermark, free forever.')

    let kw = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null
    if (kw) kw.content = 'all tools, free online tools, ishu tools, pdf tools, image tools, developer tools, math tools, student tools'
    else {
      kw = document.createElement('meta')
      kw.name = 'keywords'
      kw.content = 'all tools, free online tools, ishu tools, pdf tools, image tools, developer tools, math tools, student tools'
      document.head.appendChild(kw)
    }
  }, [])

  const filteredTools = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return tools.filter((tool) => {
      if (activeCategory !== 'all' && tool.category !== activeCategory) return false
      if (!q) return true
      return [tool.title, tool.description, ...tool.tags].join(' ').toLowerCase().includes(q)
    })
  }, [activeCategory, deferredQuery, tools])

  const groupedSections = useMemo(() => {
    return categories
      .map((cat) => ({
        category: cat,
        tools: filteredTools.filter((t) => t.category === cat.id),
      }))
      .filter((e) => e.tools.length > 0)
  }, [categories, filteredTools])

  return (
    <SiteShell>
      <div className='page-wrap'>
        {/* Hero */}
        <section className='all-tools-hero'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className='section-kicker'>Complete Library</span>
            <h1>All {tools.length}+ Free Online Tools</h1>
            <p>Browse every tool across {categories.length} categories — find exactly what you need.</p>
          </motion.div>

          <div className='search-control' style={{ marginTop: '1.5rem' }}>
            <label className='search-input'>
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search tools... (e.g. merge, compress, OCR, resize)'
              />
            </label>
          </div>

          <div className='category-row' style={{ marginTop: '1rem' }}>
            <button
              type='button'
              className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => startTransition(() => setActiveCategory('all'))}
            >
              All ({tools.length})
            </button>
            {categories.map((cat) => {
              const theme = getCategoryTheme(cat.id)
              const count = tools.filter((t) => t.category === cat.id).length
              return (
                <button
                  type='button'
                  key={cat.id}
                  className={`category-pill themed ${activeCategory === cat.id ? 'active' : ''}`}
                  style={{ '--pill-accent': theme.accent } as CSSProperties}
                  onClick={() => startTransition(() => setActiveCategory(cat.id))}
                >
                  {cat.label} ({count})
                </button>
              )
            })}
          </div>
        </section>

        {/* Tool Grid */}
        <section className='directory-stack' style={{ paddingTop: '1rem' }}>
          {loading && <p className='status-text'>Loading tools...</p>}
          {error && <p className='status-text error'>{error}</p>}

          {!loading && !error && filteredTools.length === 0 && (
            <article className='empty-state'>
              <h3>No tools matched</h3>
              <p>Try a different keyword or select "All" categories.</p>
            </article>
          )}

          {!loading && !error && groupedSections.map(({ category, tools: catTools }) => {
            const theme = getCategoryTheme(category.id)
            return (
              <motion.article
                key={category.id}
                className='category-section'
                style={{ '--cat-accent': theme.accent } as CSSProperties}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className='category-section-header'>
                  <div>
                    <h2 style={{ color: theme.accent }}>{category.label}</h2>
                    <p>{category.description}</p>
                  </div>
                  <Link
                    to={`/category/${category.id}`}
                    className='view-all-link'
                    style={{ color: theme.accent }}
                  >
                    View all <ArrowRight size={14} />
                  </Link>
                </div>
                <div className='tools-grid compact'>
                  {catTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      to={`/tools/${tool.slug}`}
                      className='tool-card-compact'
                      style={{ '--card-accent': theme.accent } as CSSProperties}
                    >
                      <span className='tool-card-icon' style={{ color: theme.accent }}>
                        <ToolIcon slug={tool.slug} className='tool-icon' />
                      </span>
                      <div>
                        <strong>{tool.title}</strong>
                        <small>{tool.description}</small>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </section>

        {/* SEO Content */}
        <section className='seo-content-section'>
          <h2>All Free Online Tools by ISHU TOOLS</h2>
          <p>
            ISHU TOOLS (Indian Student Hub University Tools) offers {tools.length}+ free online tools
            across {categories.length} categories. From PDF merging, splitting, and compression to image
            editing, developer utilities, math calculators, and text processing — every tool is
            completely free, requires no signup, and produces results with no watermark.
          </p>
          <h3>Why Choose ISHU TOOLS?</h3>
          <ul>
            <li><strong>100% Free</strong> — No hidden charges, no premium plans</li>
            <li><strong>No Signup Required</strong> — Instant access to every tool</li>
            <li><strong>No Watermarks</strong> — Clean, professional output every time</li>
            <li><strong>Privacy First</strong> — Files are deleted after processing</li>
            <li><strong>Mobile Friendly</strong> — Works on all devices</li>
            <li><strong>Fast Processing</strong> — Results in seconds, not minutes</li>
          </ul>
          <h3>Popular Tool Categories</h3>
          <p>
            <strong>PDF Tools:</strong> Merge PDF, Split PDF, Compress PDF, PDF to Word, PDF to JPG, OCR PDF, Rotate PDF, Watermark PDF, Protect PDF, Sign PDF. {' '}
            <strong>Image Tools:</strong> Compress Image, Resize Image, Crop Image, Remove Background, Convert Image, Watermark Image, Passport Photo Maker. {' '}
            <strong>Developer Tools:</strong> JSON Formatter, Base64 Encoder/Decoder, UUID Generator, Regex Tester, Diff Checker, Hash Generator. {' '}
            <strong>Math & Calculators:</strong> Percentage Calculator, BMI Calculator, EMI Calculator, Scientific Calculator, GPA Calculator. {' '}
            <strong>Text & AI:</strong> Translate Text, Summarize Text, Word Counter, Case Converter.
          </p>
        </section>
      </div>
    </SiteShell>
  )
}
