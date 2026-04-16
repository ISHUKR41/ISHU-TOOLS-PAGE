import { useEffect, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

import SiteShell from '../../components/layout/SiteShell'
import { useCatalogData } from '../../hooks/useCatalogData'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import ToolIcon from '../../components/tools/ToolIcon'

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null
  if (!element) {
    element = selector.startsWith('link')
      ? document.createElement('link')
      : document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value))
}

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

    const title = `${category.label} Online Free — ${categoryTools.length}+ Tools | ISHU TOOLS`
    const desc = `${category.description} Explore ${categoryTools.length}+ free ${category.label.toLowerCase()} on ISHU TOOLS for students, creators, developers, and daily users. No signup, no watermark, mobile friendly.`
    const categoryUrl = `https://ishutools.com/category/${categoryId}`
    const toolNames = categoryTools.slice(0, 12).map((tool) => tool.title)

    applyDocumentBranding(title, desc, theme.accent)

    const keywords = [
      category.label.toLowerCase(),
      `free ${category.label.toLowerCase()}`,
      `${category.label.toLowerCase()} online`,
      `ishu tools ${category.label.toLowerCase()}`,
      `${category.label.toLowerCase()} for students`,
      `${category.label.toLowerCase()} no signup`,
      `${category.label.toLowerCase()} mobile friendly`,
      ...toolNames.map((name) => name.toLowerCase()),
      'ishu tools', 'ishutools', 'indian student hub university tools', 'free online tools', 'no signup', 'no watermark',
    ].join(', ')

    upsertMeta('meta[name="description"]', { name: 'description', content: desc })
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords })
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: categoryUrl })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: desc })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: categoryUrl })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: desc })

    const existingJsonLd = document.getElementById('category-jsonld')
    if (existingJsonLd) existingJsonLd.remove()
    const script = document.createElement('script')
    script.id = 'category-jsonld'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description: desc,
      url: categoryUrl,
      isPartOf: { '@type': 'WebSite', name: 'ISHU TOOLS', url: 'https://ishutools.com' },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: categoryTools.slice(0, 50).map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.title,
          url: `https://ishutools.com/tools/${tool.slug}`,
        })),
      },
    })
    document.head.appendChild(script)

    return () => {
      document.getElementById('category-jsonld')?.remove()
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
          <div className='category-seo-keywords' aria-label='Popular searches'>
            {categoryTools.slice(0, 8).map((tool) => (
              <Link key={tool.slug} to={`/tools/${tool.slug}`}>
                {tool.title}
              </Link>
            ))}
          </div>
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
          <h3>Why students and daily users choose this category</h3>
          <p>
            These tools are organized for quick decisions: clear names, dedicated pages, mobile-friendly forms,
            privacy-focused processing, and direct download or copy results. Popular searches include free {category.label.toLowerCase()},
            ISHU {category.label.toLowerCase()}, no-signup {category.label.toLowerCase()}, and fast online {category.label.toLowerCase()} for students.
          </p>
        </section>
      </div>
    </SiteShell>
  )
}
