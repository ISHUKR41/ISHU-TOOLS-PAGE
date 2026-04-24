import { useEffect, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

import SiteShell from '../../components/layout/SiteShell'
import { useCatalogData } from '../../hooks/useCatalogData'
import { SITE_OG_IMAGE, SITE_URL, toSiteUrl } from '../../lib/siteConfig'
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

    const catLower = category.label.toLowerCase()
    const title = `Free ${category.label} Online — ${categoryTools.length}+ Tools by Ishu Kumar | ISHU TOOLS`
    const desc = `${category.description} Explore ${categoryTools.length}+ free ${catLower} on ISHU TOOLS by Ishu Kumar — for Indian students, creators, developers, and professionals. No signup, no watermark, 100% free. India's best free ${catLower}.`
    const categoryUrl = toSiteUrl(`/category/${categoryId}`)
    const toolNames = categoryTools.slice(0, 20).map((tool) => tool.title)

    applyDocumentBranding(title, desc, theme.accent)

    const keywords = [
      catLower,
      `free ${catLower}`,
      `${catLower} online`,
      `${catLower} online free`,
      `ishu tools ${catLower}`,
      `ishu kumar ${catLower}`,
      `ishutools ${catLower}`,
      `best free ${catLower}`,
      `${catLower} for students`,
      `${catLower} for india`,
      `${catLower} no signup`,
      `${catLower} no watermark`,
      `${catLower} mobile friendly`,
      `free ${catLower} india`,
      `${catLower} without registration`,
      `best ${catLower} tool`,
      `top ${catLower} 2025`,
      ...toolNames.map((name) => name.toLowerCase()),
      ...toolNames.map((name) => `free ${name.toLowerCase()}`),
      ...toolNames.map((name) => `${name.toLowerCase()} online free`),
      'ishu tools', 'ishutools', 'ishu kumar', 'indian student hub university tools',
      'free online tools', 'free tools india', 'no signup', 'no watermark',
      'student tools online', 'ishu tools india',
    ].join(', ')

    upsertMeta('meta[name="description"]', { name: 'description', content: desc.substring(0, 300) })
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords })
    upsertMeta('meta[name="author"]', { name: 'author', content: 'Ishu Kumar — ISHU TOOLS' })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' })
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: categoryUrl })
    // Open Graph
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: desc.substring(0, 300) })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: categoryUrl })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'ISHU TOOLS' })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: SITE_OG_IMAGE })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_IN' })
    // Twitter
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:site"]', { name: 'twitter:site', content: '@ISHU_IITP' })
    upsertMeta('meta[name="twitter:creator"]', { name: 'twitter:creator', content: '@ISHU_IITP' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: desc.substring(0, 300) })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: SITE_OG_IMAGE })

    const existingJsonLd = document.getElementById('category-jsonld')
    if (existingJsonLd) existingJsonLd.remove()
    const script = document.createElement('script')
    script.id = 'category-jsonld'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description: desc,
        url: categoryUrl,
        author: {
          '@type': 'Person',
          name: 'Ishu Kumar',
          url: 'https://www.linkedin.com/in/ishu-kumar-5a0940281/',
          alumniOf: { '@type': 'CollegeOrUniversity', name: 'IIT Patna' },
        },
        publisher: {
          '@type': 'Organization',
          name: 'ISHU TOOLS',
          url: SITE_URL,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
        },
        isPartOf: { '@type': 'WebSite', name: 'ISHU TOOLS', url: SITE_URL },
        mainEntity: {
          '@type': 'ItemList',
          name: `${category.label} Tools — ISHU TOOLS`,
          numberOfItems: categoryTools.length,
          itemListElement: categoryTools.slice(0, 50).map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: tool.title,
            url: toSiteUrl(`/tools/${tool.slug}`),
          })),
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ISHU TOOLS', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'All Categories', item: toSiteUrl('/tools') },
          { '@type': 'ListItem', position: 3, name: category.label, item: categoryUrl },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What free ${catLower} are available on ISHU TOOLS?`,
            acceptedAnswer: { '@type': 'Answer', text: `ISHU TOOLS offers ${categoryTools.length}+ free ${catLower} including ${toolNames.slice(0, 5).join(', ')} and many more. All tools are completely free, no signup or watermark required.` },
          },
          {
            '@type': 'Question',
            name: `Are ISHU TOOLS ${catLower} really free?`,
            acceptedAnswer: { '@type': 'Answer', text: `Yes, all ${category.label} on ISHU TOOLS are 100% free to use. Created by Ishu Kumar for Indian students and professionals. No account needed, no hidden fees, no watermarks.` },
          },
          {
            '@type': 'Question',
            name: `Who made ISHU TOOLS ${catLower}?`,
            acceptedAnswer: { '@type': 'Answer', text: `ISHU TOOLS ${catLower} were created by Ishu Kumar, an IIT Patna graduate. ISHU stands for Indian Student Hub University Tools, a platform dedicated to helping Indian students and professionals.` },
          },
        ],
      },
    ])
    document.head.appendChild(script)

    return () => {
      document.getElementById('category-jsonld')?.remove()
    }
  }, [category, categoryTools, categoryId, theme])

  if (loading) {
    return (
      <SiteShell>
        <div className='page-wrap'>
          <div style={{ paddingTop: '2rem' }}>
            <span className='skeleton' style={{ display: 'block', width: 100, height: 14, borderRadius: 4, marginBottom: '1.5rem' }} />
            <div className='skeleton-section' style={{ background: 'rgba(13,19,35,0.5)', borderRadius: 20, padding: '2rem', marginBottom: '1.5rem' }}>
              <span className='skeleton' style={{ display: 'block', width: 120, height: 28, borderRadius: 8, marginBottom: '0.75rem' }} />
              <span className='skeleton' style={{ display: 'block', width: '60%', height: 14, borderRadius: 4, marginBottom: '0.5rem' }} />
              <span className='skeleton' style={{ display: 'block', width: '40%', height: 14, borderRadius: 4 }} />
            </div>
            <div className='tools-grid compact'>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className='tool-card-compact skeleton-compact-card' aria-hidden>
                  <span className='skeleton skeleton-icon-sm' />
                  <div style={{ flex: 1 }}>
                    <span className='skeleton skeleton-title-sm' />
                    <span className='skeleton skeleton-desc-sm' />
                  </div>
                </div>
              ))}
            </div>
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

        {/* Tools Grid — ALL tools shown, no pagination, no stagger animation (smooth even with 200+ tools) */}
        <section className='category-tools-grid cv-grid'>
          {categoryTools.map((tool) => (
            <Link
              key={tool.slug}
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
