import { useEffect, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

import SiteShell from '../../components/layout/SiteShell'
import { useCatalogData } from '../../hooks/useCatalogData'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import ToolIcon from '../../components/tools/ToolIcon'

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const { categories, tools, loading, error } = useCatalogData()

  const category = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categories, categoryId],
  )

  const categoryTools = useMemo(
    () => tools.filter((t) => t.category === categoryId),
    [tools, categoryId],
  )

  const theme = useMemo(
    () => getCategoryTheme(categoryId || 'pdf-core'),
    [categoryId],
  )

  useEffect(() => {
    if (!category) return

    const title = `${category.label} — Free Online Tools | ISHU TOOLS`
    const desc = `${category.description} ${categoryTools.length}+ free ${category.label.toLowerCase()} tools online. No signup, no watermark. ISHU TOOLS.`

    applyDocumentBranding(title, desc, theme.accent)

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', desc)
    else {
      const m = document.createElement('meta')
      m.name = 'description'
      m.content = desc
      document.head.appendChild(m)
    }

    let metaKw = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null
    const keywords = [
      category.label.toLowerCase(),
      `free ${category.label.toLowerCase()}`,
      `${category.label.toLowerCase()} online`,
      `ishu tools ${category.label.toLowerCase()}`,
      'ishu tools', 'free online tools', 'no signup', 'no watermark',
    ].join(', ')
    if (metaKw) metaKw.content = keywords
    else {
      metaKw = document.createElement('meta')
      metaKw.name = 'keywords'
      metaKw.content = keywords
      document.head.appendChild(metaKw)
    }

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (canonical) canonical.href = `https://ishutools.com/category/${categoryId}`
    else {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = `https://ishutools.com/category/${categoryId}`
      document.head.appendChild(canonical)
    }

    return () => {
      document.querySelector('link[rel="canonical"]')?.remove()
    }
  }, [category, categoryTools, categoryId, theme])

  if (loading) {
    return (
      <SiteShell>
        <div className='page-wrap'>
          <div className='tool-loading-state'>
            <p>Loading category...</p>
          </div>
        </div>
      </SiteShell>
    )
  }

  if (error || !category) {
    return (
      <SiteShell>
        <div className='page-wrap'>
          <div className='tool-error-state'>
            <p className='status-text error'>{error || 'Category not found'}</p>
            <Link to='/' className='inline-link'>← Return to all tools</Link>
          </div>
        </div>
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <div className='page-wrap'>
        <Link to='/' className='back-link'>
          <ArrowLeft size={18} />
          Back to all tools
        </Link>

        {/* Category Hero */}
        <motion.section
          className='category-hero'
          style={{
            '--cat-accent': theme.accent,
            '--cat-surface': theme.surface,
            '--cat-glow': theme.glow,
          } as CSSProperties}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className='category-hero-badge'
            style={{ background: `${theme.accent}22`, color: theme.accent, borderColor: `${theme.accent}44` }}
          >
            <Zap size={14} />
            {categoryTools.length} tools
          </span>
          <h1 style={{ color: theme.accent }}>{category.label}</h1>
          <p>{category.description}</p>
        </motion.section>

        {/* Tools Grid */}
        <section className='category-tools-grid'>
          {categoryTools.map((tool, index) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <Link
                to={`/tools/${tool.slug}`}
                className='category-tool-card'
                style={{ '--card-accent': theme.accent } as CSSProperties}
              >
                <span className='tool-card-icon' style={{ color: theme.accent }}>
                  <ToolIcon slug={tool.slug} className='tool-icon' />
                </span>
                <div className='category-tool-info'>
                  <strong>{tool.title}</strong>
                  <small>{tool.description}</small>
                </div>
                <span className='category-tool-arrow' style={{ color: theme.accent }}>→</span>
              </Link>
            </motion.div>
          ))}
        </section>

        {/* SEO Content */}
        <section className='seo-content-section'>
          <h2>Free {category.label} — ISHU TOOLS</h2>
          <p>
            ISHU TOOLS offers {categoryTools.length}+ free {category.label.toLowerCase()} online.
            {category.description} All tools are 100% free, require no signup, produce no watermarks,
            and work on any device. Trusted by millions of students and professionals worldwide.
          </p>
          <h3>Available {category.label}</h3>
          <ul>
            {categoryTools.map((tool) => (
              <li key={tool.slug}>
                <Link to={`/tools/${tool.slug}`}><strong>{tool.title}</strong></Link> — {tool.description}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SiteShell>
  )
}
