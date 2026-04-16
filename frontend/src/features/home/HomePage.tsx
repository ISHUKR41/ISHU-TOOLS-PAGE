import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Search, MousePointerClick, Upload, Download, CheckCircle } from 'lucide-react'

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
            <span className='section-kicker'>Simple &amp; Fast</span>
            <h2>How ISHU TOOLS Works</h2>
            <p style={{ color: 'var(--muted)', maxWidth: '42rem', margin: '0 auto 0.5rem', fontSize: '0.97rem' }}>
              Get things done in seconds — no account, no watermark, no cost.
            </p>
            <div className='steps-grid'>
              <div className='step-card'>
                <div className='step-number'><MousePointerClick size={20} /></div>
                <h3>1. Choose a Tool</h3>
                <p>Search from {tools.length}+ free tools across {categories.length} categories — PDF, Image, Developer, Math, and more. Each tool has its own dedicated page.</p>
              </div>
              <div className='step-card'>
                <div className='step-number'><Upload size={20} /></div>
                <h3>2. Upload or Enter Data</h3>
                <p>Drag &amp; drop your files or enter text and values. Multi-file uploads supported. All files are processed securely with no storage.</p>
              </div>
              <div className='step-card'>
                <div className='step-number'><Download size={20} /></div>
                <h3>3. Run &amp; Download</h3>
                <p>Click "Run" and get your result instantly. Download the processed file or copy the output. No signup, no watermark, 100% free.</p>
              </div>
              <div className='step-card'>
                <div className='step-number'><CheckCircle size={20} /></div>
                <h3>4. Done — Every Time</h3>
                <p>All tools are production-ready, accurate, and reliable. Works on all devices — mobile, tablet, laptop, desktop. No app needed.</p>
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
                <p className='faq-answer'>ISHU TOOLS (Indian Student Hub University Tools) is a free online platform with {tools.length}+ tools for PDF processing, image editing, developer utilities, math calculators, text operations, and more. Created by Ishu Kumar, it is designed for students and professionals — no signup, no watermark, completely free.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>Is ISHU TOOLS free to use?</summary>
                <p className='faq-answer'>Yes! ISHU TOOLS is 100% free. All {tools.length}+ tools are available without any signup, registration, or payment. There are no watermarks, no limits, and no hidden charges. Every tool works instantly online.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>Is my data safe on ISHU TOOLS?</summary>
                <p className='faq-answer'>Absolutely! All uploaded files are processed securely on our servers and automatically deleted after processing. We never store, share, or access your files. Your privacy is our top priority. All processing happens server-side with no cloud storage.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>Can I use ISHU TOOLS on mobile?</summary>
                <p className='faq-answer'>Yes! ISHU TOOLS is fully responsive and works perfectly on all devices — smartphones, tablets, laptops, and desktop computers. No app download needed. Just open the website in your mobile browser and start using any tool.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>How many tools does ISHU TOOLS have?</summary>
                <p className='faq-answer'>ISHU TOOLS currently offers {tools.length}+ tools across {categories.length} categories including PDF Tools, Image Tools, Developer Tools, Math Calculators, Text Tools, Color Tools, Unit Converters, Security Tools, and Social Media Tools. New tools are added regularly.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>What PDF tools does ISHU TOOLS offer?</summary>
                <p className='faq-answer'>ISHU TOOLS offers comprehensive PDF tools including: Merge PDF, Split PDF, Compress PDF, PDF to Word, Word to PDF, PDF to JPG, JPG to PDF, PDF to Excel, Excel to PDF, PDF to PowerPoint, OCR PDF, Protect PDF, Unlock PDF, Rotate PDF, Watermark PDF, and many more — all free with no signup.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>What image tools are available on ISHU TOOLS?</summary>
                <p className='faq-answer'>ISHU TOOLS has 60+ image tools: Compress Image, Resize Image, Crop Image, Remove Background, Convert Image formats (JPG/PNG/WEBP/HEIC), Passport Photo Maker, Watermark Image, Add Border, Blur Image, Sharpen Image, Invert Image, Meme Generator, Social Media Resize tools, and more.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>Does ISHU TOOLS have student calculator tools?</summary>
                <p className='faq-answer'>Yes! ISHU TOOLS has dedicated student tools: GPA Calculator, CGPA to Percentage converter, BMI Calculator, Age Calculator, Percentage Calculator, Scientific Calculator, Loan EMI Calculator, Simple Interest, Compound Interest, Discount Calculator, Grade Calculator, Attendance Calculator, and more.</p>
              </details>
              <details className='faq-item'>
                <summary className='faq-question'>Is ISHU TOOLS better than iLovePDF or SmallPDF?</summary>
                <p className='faq-answer'>ISHU TOOLS offers all the same PDF tools as iLovePDF and SmallPDF, plus image tools, developer utilities, calculators, and more — all completely free with no signup, no watermark, and no file size limits. ISHU TOOLS is the best free alternative to iLovePDF, SmallPDF, and PDFCandy.</p>
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
