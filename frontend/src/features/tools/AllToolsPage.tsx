import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

import SiteShell from '../../components/layout/SiteShell'
import { useCatalogData } from '../../hooks/useCatalogData'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import ToolIcon from '../../components/tools/ToolIcon'

function SkeletonToolCard() {
  return (
    <div className='tool-card-compact skeleton-compact-card' aria-hidden>
      <span className='skeleton skeleton-icon-sm' />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className='skeleton skeleton-title-sm' />
        <span className='skeleton skeleton-desc-sm' />
      </div>
    </div>
  )
}

function SkeletonSection() {
  return (
    <div className='category-section skeleton-section' aria-hidden>
      <div className='category-section-header'>
        <div>
          <span className='skeleton' style={{ display: 'block', width: 140, height: 22, borderRadius: 6, marginBottom: 8 }} />
          <span className='skeleton' style={{ display: 'block', width: 240, height: 14, borderRadius: 4 }} />
        </div>
      </div>
      <div className='tools-grid compact'>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonToolCard key={i} />
        ))}
      </div>
    </div>
  )
}

function AnimatedSection({
  category,
  catTools,
  theme,
}: {
  category: { id: string; label: string; description: string }
  catTools: { slug: string; title: string; description: string }[]
  theme: { accent: string }
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <motion.article
      ref={ref}
      key={category.id}
      className='category-section'
      style={{ '--cat-accent': theme.accent } as CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
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
        {catTools.map((tool, idx) => (
          <motion.div
            key={tool.slug}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.25), ease: 'easeOut' }}
          >
            <Link
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
          </motion.div>
        ))}
      </div>
    </motion.article>
  )
}

export default function AllToolsPage() {
  const { categories, tools, loading, error } = useCatalogData()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    applyDocumentBranding(
      `All ${tools.length}+ Free Online Tools — PDF, Image, Developer, Student Tools | ISHU TOOLS by Ishu Kumar`,
      `Browse all ${tools.length}+ free online tools at ISHU TOOLS (Indian Student Hub University Tools) by Ishu Kumar. Merge PDF, compress images, JSON formatter, BMI calculator, unit converter, video downloader & more. No signup, no watermark, 100% free for Indian students.`,
      '#3bd0ff',
    )

    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', `Browse all ${tools.length}+ free online tools at ISHU TOOLS by Ishu Kumar. PDF merge, compress, convert, image resize, developer tools, student calculators, unit converters & more. No signup, no watermark, free forever. India's best free tool platform.`)

    let kw = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null
    const kwContent = 'all tools, free online tools, ishu tools, ishu kumar tools, indian student hub university tools, ishutools, pdf tools online free, image tools online, developer tools free, math calculators online, student tools india, unit converter, video downloader free, ishu tools all tools, best free tools india, tools for students india'
    if (kw) kw.content = kwContent
    else {
      kw = document.createElement('meta')
      kw.name = 'keywords'
      kw.content = kwContent
      document.head.appendChild(kw)
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (canonical) canonical.href = 'https://ishutools.com/tools'
    else {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = 'https://ishutools.com/tools'
      document.head.appendChild(canonical)
    }
  }, [tools.length])

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
        <section className='all-tools-hero'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className='section-kicker'>Complete Library</span>
            <h1>All {loading ? '1200' : tools.length}+ Free Online Tools</h1>
            <p>Browse every tool across {loading ? '29' : categories.length} categories — find exactly what you need.</p>
          </motion.div>

          <div className='search-control' style={{ marginTop: '1.5rem' }}>
            <label className='search-input'>
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search tools... (e.g. merge, compress, OCR, resize)'
                aria-label='Search all tools'
              />
            </label>
          </div>

          <div className='category-row' style={{ marginTop: '1rem' }}>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className='skeleton' style={{ display: 'inline-block', width: 80 + i * 10, height: 34, borderRadius: 999 }} />
              ))
            ) : (
              <>
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
              </>
            )}
          </div>
        </section>

        <section className='directory-stack' style={{ paddingTop: '1rem' }}>
          {loading && (
            <>
              <SkeletonSection />
              <SkeletonSection />
              <SkeletonSection />
            </>
          )}

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
              <AnimatedSection
                key={category.id}
                category={category}
                catTools={catTools}
                theme={theme}
              />
            )
          })}
        </section>

        <section className='seo-content-section'>
          <h2>All Free Online Tools by ISHU TOOLS — Indian Student Hub University Tools</h2>
          <p>
            ISHU TOOLS (Indian Student Hub University Tools) by Ishu Kumar offers {tools.length || '625'}+ free online tools
            across {categories.length || '29'} categories. From PDF merging, splitting, and compression to image
            editing, developer utilities, math calculators, unit converters, student tools, and video downloaders — every tool is
            completely free, requires no signup, and produces results with no watermark. Created specifically for Indian students and professionals.
          </p>
          <h3>Why Choose ISHU TOOLS by Ishu Kumar?</h3>
          <ul>
            <li><strong>100% Free</strong> — No hidden charges, no premium plans, free forever</li>
            <li><strong>No Signup Required</strong> — Instant access to every tool, no account needed</li>
            <li><strong>No Watermarks</strong> — Clean, professional output every time</li>
            <li><strong>Privacy First</strong> — Files are deleted after processing, fully secure</li>
            <li><strong>Mobile Friendly</strong> — Works perfectly on all devices — phone, tablet, desktop</li>
            <li><strong>Fast Processing</strong> — Results in seconds, not minutes, ultra smooth</li>
            <li><strong>Made for India</strong> — Specialized tools for SSC, UPSC, JEE, NEET, government exams</li>
          </ul>
          <h3>Popular Tool Categories at ISHU TOOLS</h3>
          <p>
            <strong>PDF Tools:</strong> Merge PDF, Split PDF, Compress PDF, PDF to Word, PDF to JPG, OCR PDF, Rotate PDF, Watermark PDF, Protect PDF, Sign PDF. {' '}
            <strong>Image Tools:</strong> Compress Image, Resize Image, Crop Image, Remove Background, Convert Image, Watermark Image, Passport Photo Maker, Compress to KB. {' '}
            <strong>Developer Tools:</strong> JSON Formatter, Base64 Encoder/Decoder, UUID Generator, Regex Tester, Diff Checker, Hash Generator. {' '}
            <strong>Math & Calculators:</strong> Percentage Calculator, BMI Calculator, EMI Calculator, Scientific Calculator, GPA Calculator, SIP Calculator India. {' '}
            <strong>Student Tools:</strong> Attendance Calculator, CGPA Converter, Exam Countdown, Citation Generator, Pomodoro Timer. {' '}
            <strong>Text & AI:</strong> Translate Text, Summarize Text, Word Counter, Case Converter, Grammar Checker. {' '}
            <strong>Video Tools:</strong> YouTube Video Downloader, Instagram Downloader, YouTube to MP3 Converter.
          </p>
        </section>
      </div>
    </SiteShell>
  )
}
