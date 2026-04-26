import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  ImageIcon,
  LoaderCircle,
  RefreshCw,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { fetchRuntimeCapabilities, fetchTool, fetchTools, runTool } from '../../api/toolsApi'
import { recordToolOpen } from '../../hooks/useToolRecents'
import SiteShell from '../../components/layout/SiteShell'
import ToolIcon from '../../components/tools/ToolIcon'
import type { RuntimeCapabilities, ToolDefinition, ToolRunJsonResult } from '../../types/tools'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import { SITE_FALLBACK_URL, SITE_OG_IMAGE, SITE_URL, toSiteUrl } from '../../lib/siteConfig'
import { getToolFields } from './toolFields'
import ToolSidebar from './components/ToolSidebar'
import PinSuggestionBanner from './components/PinSuggestionBanner'
import ToolActions from '../../components/tool/ToolActions'
import type { ToolSEO } from '../../lib/seoData'
import SkeletonToolPage from '../../components/ui/SkeletonToolPage'
import { useToast } from '../../components/ui/Toast'
import SmartResultDisplay from './components/SmartResultDisplay'
import { FALLBACK_TOOLS } from '../../data/catalogFallback'
import { trackToolVisit } from '../../lib/usageTracker'
import { takePendingDrop } from '../../lib/pendingFile'
import { runClientTool, getClientExecutor } from '../../lib/clientToolExecutors'

// ─── Lazy-loaded per-tool SEO database (504 KB chunk) ─────────────────────────
// Static-importing seoData would block the very first tool-page paint with
// ~150 KB of gzipped JS that the prerendered HTML already covers (the static
// .html files written by scripts/gen-static-seo.mjs ship every meta tag,
// JSON-LD script, and FAQ inline). So we load the rich SEO database on idle
// after first paint and use a lightweight inline fallback in the meantime —
// the user never sees a delay, search crawlers still see complete SEO.
let _seoModulePromise: Promise<typeof import('../../lib/seoData')> | null = null
function loadSeoModule() {
  if (!_seoModulePromise) _seoModulePromise = import('../../lib/seoData')
  return _seoModulePromise
}
function fallbackToolSEO(slug: string, title: string, description: string, _category: string): ToolSEO {
  const lower = title.toLowerCase()
  const desc = description?.trim()
  return {
    title: `${title} — Free Online Tool | ISHU TOOLS`,
    description: desc
      ? `${desc} Free online ${lower} on ISHU TOOLS — no signup, no watermark, works on mobile and desktop.`
      : `${title} on ISHU TOOLS — free online tool. No signup, no watermark, works on every device.`,
    keywords: [
      lower,
      `${lower} online`,
      `${lower} free`,
      `free ${lower}`,
      `${lower} no signup`,
      slug.replace(/-/g, ' '),
      'ishu tools',
      'free online tool',
      'no watermark',
    ],
    h1: title,
    faq: [],
  }
}
import ScientificCalculator from '../calculator/ScientificCalculator'

function normalizePayloadValue(value: string, fieldType: string) {
  if (fieldType === 'number') {
    const numericValue = Number(value)
    return Number.isNaN(numericValue) ? value : numericValue
  }
  return value
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function getFileIcon(file: File) {
  const type = file.type
  if (type.startsWith('image/')) return <ImageIcon size={16} />
  return <FileText size={16} />
}

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

function isImageFile(file: File) {
  return file.type.startsWith('image/')
}

function isImageBlob(contentType: string) {
  return contentType.startsWith('image/')
}

type FilePreviewItem = {
  file: File
  previewUrl?: string
}

function findFallbackTool(slug?: string) {
  if (!slug) return null
  return FALLBACK_TOOLS.find((item) => item.slug === slug) || null
}

function findFallbackRelatedTools(tool: ToolDefinition | null) {
  if (!tool) return []
  return FALLBACK_TOOLS.filter(
    (item) => item.category === tool.category && item.slug !== tool.slug,
  ).slice(0, 18)
}

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>()
  const toast = useToast()
  const initialTool = useMemo(() => findFallbackTool(slug), [slug])

  const [tool, setTool] = useState<ToolDefinition | null>(() => initialTool)
  const [relatedTools, setRelatedTools] = useState<ToolDefinition[]>(() => findFallbackRelatedTools(initialTool))
  // The 504 KB seoData chunk loads on idle after the tool UI renders. Until
  // it lands, we use fallbackToolSEO so the page renders instantly.
  const [seoMod, setSeoMod] = useState<typeof import('../../lib/seoData') | null>(null)
  const [toolLoading, setToolLoading] = useState(() => !initialTool)
  const [toolError, setToolError] = useState<string | null>(null)
  const [runtimeCapabilities, setRuntimeCapabilities] = useState<RuntimeCapabilities | null>(null)

  const [fileItems, setFileItems] = useState<FilePreviewItem[]>([])
  const [payloadState, setPayloadState] = useState<Record<string, string>>({})
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [runMessage, setRunMessage] = useState<string | null>(null)
  const [runError, setRunError] = useState<string | null>(null)
  const [jsonResult, setJsonResult] = useState<ToolRunJsonResult | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadName, setDownloadName] = useState<string | null>(null)
  const [outputImagePreview, setOutputImagePreview] = useState<string | null>(null)

  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const resultRef = useRef<HTMLElement | null>(null)

  // ─── Scroll to top + reset state on slug change ───
  useEffect(() => {
    if (slug) trackToolVisit(slug)
    const fallback = findFallbackTool(slug)
    setTool(fallback)
    setRelatedTools(findFallbackRelatedTools(fallback))
    setToolLoading(!fallback)
    setToolError(null)
    if (fallback) {
      const seoFn = seoMod?.getToolSEO ?? fallbackToolSEO
      const seo = seoFn(fallback.slug, fallback.title, fallback.description, fallback.category)
      const toolUrl = toSiteUrl(`/tools/${fallback.slug}`)
      document.title = seo.title
      applyDocumentBranding(
        seo.title,
        seo.description,
        getCategoryTheme(fallback.category).accent,
      )
      upsertMeta('meta[name="description"]', { name: 'description', content: seo.description })
      upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: toolUrl })
      upsertMeta('link[rel="alternate"][data-alt="vercel-mirror"]', {
        rel: 'alternate',
        href: `${SITE_FALLBACK_URL}/tools/${fallback.slug}`,
        hreflang: 'x-default',
        'data-alt': 'vercel-mirror',
      })
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    // Reset all run-related state when switching tools
    setRunError(null)
    setRunMessage(null)
    setJsonResult(null)
    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    setDownloadUrl(null)
    setDownloadName(null)
    setOutputImagePreview(null)
    setProgress(0)
    setRunning(false)
    // Reset files
    fileItems.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
    })
    setFileItems([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  useEffect(() => {
    if (!slug) return
    const currentSlug = slug
    let mounted = true

    async function load() {
      const fallback = findFallbackTool(currentSlug)
      try {
        setToolLoading(!fallback)
        const capabilitiesPromise = fetchRuntimeCapabilities().catch(() => null)
        // Fetch tool detail + load the lazy SEO module in parallel — saves
        // one network round-trip on the first tool-page navigation.
        const [detail, seoModule] = await Promise.all([fetchTool(currentSlug), loadSeoModule()])
        if (!mounted) return

        setTool(detail)
        setToolError(null)
        setSeoMod(seoModule)
        // Persist this open into the user's local "recently used" history
        // so the homepage can surface it on their next visit. Pure client-side,
        // never throws, never blocks.
        recordToolOpen(detail.slug)
        void capabilitiesPromise.then((capabilities) => {
          if (mounted) setRuntimeCapabilities(capabilities)
        })

        // ─── Per-tool SEO injection ───
        const seo = seoModule.getToolSEO(detail.slug, detail.title, detail.description, detail.category)
        
        // Set page title
        document.title = seo.title
        applyDocumentBranding(
          seo.title,
          seo.description,
          getCategoryTheme(detail.category).accent,
        )

        const toolUrl = toSiteUrl(`/tools/${detail.slug}`)
        const keywordText = seo.keywords.join(', ')

        upsertMeta('meta[name="description"]', { name: 'description', content: seo.description })
        upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywordText })
        upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' })
        // ── AI Search / Generative Engine Optimization (GEO/AEO) ──
        // Allow major AI crawlers to index and cite this tool
        upsertMeta('meta[name="googlebot"]', { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1' })
        upsertMeta('meta[name="bingbot"]', { name: 'bingbot', content: 'index, follow' })
        upsertMeta('meta[name="GPTBot"]', { name: 'GPTBot', content: 'index, follow' })
        upsertMeta('meta[name="ChatGPT-User"]', { name: 'ChatGPT-User', content: 'index, follow' })
        upsertMeta('meta[name="OAI-SearchBot"]', { name: 'OAI-SearchBot', content: 'index, follow' })
        upsertMeta('meta[name="ClaudeBot"]', { name: 'ClaudeBot', content: 'index, follow' })
        upsertMeta('meta[name="anthropic-ai"]', { name: 'anthropic-ai', content: 'index, follow' })
        upsertMeta('meta[name="PerplexityBot"]', { name: 'PerplexityBot', content: 'index, follow' })
        upsertMeta('meta[name="Google-Extended"]', { name: 'Google-Extended', content: 'index, follow' })
        upsertMeta('meta[name="CCBot"]', { name: 'CCBot', content: 'index, follow' })
        upsertMeta('meta[name="Applebot-Extended"]', { name: 'Applebot-Extended', content: 'index, follow' })
        // AI summary tag — concise answer that LLMs prefer for citation
        upsertMeta('meta[name="ai-summary"]', { name: 'ai-summary', content: `${detail.title} is a 100% free online tool from ISHU TOOLS. ${detail.description} No signup, no watermark, no installation. Works on mobile and desktop.` })
        upsertMeta('meta[name="ai-content-declaration"]', { name: 'ai-content-declaration', content: 'human-curated' })
        upsertMeta('meta[name="ai:tool"]', { name: 'ai:tool', content: detail.title })
        upsertMeta('meta[name="ai:category"]', { name: 'ai:category', content: detail.category })
        upsertMeta('meta[name="ai:price"]', { name: 'ai:price', content: 'free' })
        upsertMeta('meta[name="ai:signup"]', { name: 'ai:signup', content: 'not-required' })
        upsertMeta('meta[name="ai:watermark"]', { name: 'ai:watermark', content: 'none' })
        upsertMeta('meta[name="ai:platform"]', { name: 'ai:platform', content: 'web, mobile, tablet' })
        upsertMeta('meta[name="ai:audience"]', { name: 'ai:audience', content: 'students, professionals, indian users, global' })
        upsertMeta('meta[name="author"]', { name: 'author', content: 'Ishu Kumar — ISHU TOOLS' })
        upsertMeta('meta[name="creator"]', { name: 'creator', content: 'Ishu Kumar' })
        upsertMeta('meta[name="publisher"]', { name: 'publisher', content: 'ISHU TOOLS — ishutools.fun' })
        upsertMeta('meta[name="category"]', { name: 'category', content: detail.category })
        upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: toolUrl })
        upsertMeta('link[rel="alternate"][data-alt="vercel-mirror"]', {
          rel: 'alternate',
          href: `${SITE_FALLBACK_URL}/tools/${detail.slug}`,
          hreflang: 'x-default',
          'data-alt': 'vercel-mirror',
        })
        // Open Graph — full set for social sharing
        upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title })
        upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description })
        upsertMeta('meta[property="og:url"]', { property: 'og:url', content: toolUrl })
        upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
        upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'ISHU TOOLS' })
        upsertMeta('meta[property="og:image"]', { property: 'og:image', content: SITE_OG_IMAGE })
        upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' })
        upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' })
        upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `${detail.title} — ISHU TOOLS Free Online Tool` })
        upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_IN' })
        // Twitter Card
        upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
        upsertMeta('meta[name="twitter:site"]', { name: 'twitter:site', content: '@ISHU_IITP' })
        upsertMeta('meta[name="twitter:creator"]', { name: 'twitter:creator', content: '@ISHU_IITP' })
        upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title })
        upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description })
        upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: SITE_OG_IMAGE })
        upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: `${detail.title} — ISHU TOOLS` })
        // Article metadata for rich snippets
        upsertMeta('meta[property="article:author"]', { property: 'article:author', content: 'https://www.linkedin.com/in/ishu-kumar-5a0940281/' })
        upsertMeta('meta[property="article:published_time"]', { property: 'article:published_time', content: '2024-01-01T00:00:00Z' })
        upsertMeta('meta[property="article:modified_time"]', { property: 'article:modified_time', content: new Date().toISOString() })

        // JSON-LD structured data
        const existingLd = document.getElementById('tool-jsonld')
        if (existingLd) existingLd.remove()
        const ldScript = document.createElement('script')
        ldScript.id = 'tool-jsonld'
        ldScript.type = 'application/ld+json'
        ldScript.textContent = JSON.stringify(seoModule.getToolJsonLd(detail.slug, detail.title, detail.description, detail.category))
        document.head.appendChild(ldScript)

        // FAQ JSON-LD
        if (seo.faq.length > 0) {
          const existingFaq = document.getElementById('tool-faq-jsonld')
          if (existingFaq) existingFaq.remove()
          const faqScript = document.createElement('script')
          faqScript.id = 'tool-faq-jsonld'
          faqScript.type = 'application/ld+json'
          faqScript.textContent = JSON.stringify(seoModule.getFaqJsonLd(seo.faq))
          document.head.appendChild(faqScript)
        }

        // BreadcrumbList JSON-LD for rich breadcrumb snippets in Google
        const existingBreadcrumb = document.getElementById('tool-breadcrumb-jsonld')
        if (existingBreadcrumb) existingBreadcrumb.remove()
        const breadcrumbScript = document.createElement('script')
        breadcrumbScript.id = 'tool-breadcrumb-jsonld'
        breadcrumbScript.type = 'application/ld+json'
        breadcrumbScript.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'ISHU TOOLS', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'All Tools', item: toSiteUrl('/tools') },
            { '@type': 'ListItem', position: 3, name: getCategoryTheme(detail.category).label || detail.category, item: toSiteUrl(`/category/${detail.category}`) },
            { '@type': 'ListItem', position: 4, name: detail.title, item: toolUrl },
          ],
        })
        document.head.appendChild(breadcrumbScript)

        // SpeakableSpecification JSON-LD for voice search (Google Assistant, Alexa)
        const existingSpeakable = document.getElementById('tool-speakable-jsonld')
        if (existingSpeakable) existingSpeakable.remove()
        const speakableScript = document.createElement('script')
        speakableScript.id = 'tool-speakable-jsonld'
        speakableScript.type = 'application/ld+json'
        speakableScript.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': toolUrl,
          url: toolUrl,
          name: seo.title,
          description: seo.description,
          inLanguage: 'en-IN',
          isPartOf: { '@type': 'WebSite', url: SITE_URL, name: 'ISHU TOOLS' },
          about: { '@type': 'Thing', name: detail.title, description: detail.description },
          author: {
            '@type': 'Person',
            name: 'Ishu Kumar',
            url: 'https://www.linkedin.com/in/ishu-kumar-5a0940281/',
          },
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['.tool-seo-description', '.tool-hero-title', 'h1'],
          },
          dateModified: new Date().toISOString().split('T')[0],
          datePublished: '2024-01-01',
        })
        document.head.appendChild(speakableScript)

        // ── LearningResource JSON-LD — boosts citations in AI search & education panels ──
        const existingLearn = document.getElementById('tool-learning-jsonld')
        if (existingLearn) existingLearn.remove()
        const learnScript = document.createElement('script')
        learnScript.id = 'tool-learning-jsonld'
        learnScript.type = 'application/ld+json'
        learnScript.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': ['LearningResource', 'WebApplication'],
          name: detail.title,
          description: seo.description,
          url: toolUrl,
          inLanguage: ['en-IN', 'en', 'hi'],
          isAccessibleForFree: true,
          isFamilyFriendly: true,
          learningResourceType: 'Online Tool',
          educationalUse: ['Self-Study', 'Assignment', 'Professional Development'],
          audience: [
            { '@type': 'EducationalAudience', educationalRole: 'student' },
            { '@type': 'EducationalAudience', educationalRole: 'teacher' },
            { '@type': 'Audience', audienceType: 'Indian students, professionals, developers' },
          ],
          teaches: detail.description,
          keywords: seo.keywords.slice(0, 50).join(', '),
          provider: { '@type': 'Organization', name: 'ISHU TOOLS', url: SITE_URL },
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
        })
        document.head.appendChild(learnScript)

        // ── HowTo JSON-LD — Google shows step-by-step rich result for "how to ..." queries ──
        const existingHowTo = document.getElementById('tool-howto-jsonld')
        if (existingHowTo) existingHowTo.remove()
        const howToScript = document.createElement('script')
        howToScript.id = 'tool-howto-jsonld'
        howToScript.type = 'application/ld+json'
        howToScript.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: `How to use ${detail.title}`,
          description: `Step-by-step guide to use ${detail.title} on ISHU TOOLS — free, no signup, works on any device.`,
          totalTime: 'PT1M',
          estimatedCost: { '@type': 'MonetaryAmount', currency: 'INR', value: '0' },
          supply: [{ '@type': 'HowToSupply', name: detail.input_kind === 'files' || detail.input_kind === 'mixed' ? 'Your file' : 'Your text or input value' }],
          tool: [{ '@type': 'HowToTool', name: 'Any modern web browser' }],
          step: [
            { '@type': 'HowToStep', position: 1, name: `Open ${detail.title}`, text: `Visit this page — no signup, no install needed.`, url: toolUrl },
            { '@type': 'HowToStep', position: 2, name: detail.input_kind === 'files' || detail.input_kind === 'mixed' ? 'Upload your file' : 'Enter your input', text: detail.input_kind === 'files' || detail.input_kind === 'mixed' ? 'Drag & drop your file or click to browse. Multiple files are supported where applicable.' : 'Paste your text or fill the required fields.' },
            { '@type': 'HowToStep', position: 3, name: 'Adjust options', text: 'Pick output format, quality, or any settings shown on the page.' },
            { '@type': 'HowToStep', position: 4, name: 'Run the tool', text: 'Click "Run" — processing starts instantly. Most jobs finish in a few seconds.' },
            { '@type': 'HowToStep', position: 5, name: 'Download or copy', text: 'Download the result file or copy the output text. Your files are deleted from our server immediately after.' },
          ],
        })
        document.head.appendChild(howToScript)

        // ── Question JSON-LD pool — direct citation targets for ChatGPT/Perplexity/Gemini ──
        const existingQ = document.getElementById('tool-question-jsonld')
        if (existingQ) existingQ.remove()
        if (seo.faq.length > 0) {
          const qScript = document.createElement('script')
          qScript.id = 'tool-question-jsonld'
          qScript.type = 'application/ld+json'
          qScript.textContent = JSON.stringify(
            seo.faq.slice(0, 5).map((f) => ({
              '@context': 'https://schema.org',
              '@type': 'Question',
              name: f.question,
              text: f.question,
              answerCount: 1,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
                upvoteCount: 1000,
                url: toolUrl,
                author: { '@type': 'Organization', name: 'ISHU TOOLS' },
              },
            })),
          )
          document.head.appendChild(qScript)
        }

        const sameCategoryTools = await fetchTools({ category: detail.category })
        if (!mounted) return
        setRelatedTools(sameCategoryTools.filter((item) => item.slug !== detail.slug))
      } catch (err) {
        if (!mounted) return
        if (fallback) {
          setTool(fallback)
          setRelatedTools(findFallbackRelatedTools(fallback))
          setToolError(null)
        } else {
          setToolError(err instanceof Error ? err.message : 'Unable to load tool details')
        }
      } finally {
        if (mounted) setToolLoading(false)
      }
    }

    void load()

    return () => {
      mounted = false
      // Cleanup injected SEO elements
      document.getElementById('tool-jsonld')?.remove()
      document.getElementById('tool-faq-jsonld')?.remove()
      document.getElementById('tool-breadcrumb-jsonld')?.remove()
      document.getElementById('tool-speakable-jsonld')?.remove()
      document.getElementById('tool-learning-jsonld')?.remove()
      document.getElementById('tool-howto-jsonld')?.remove()
      document.getElementById('tool-question-jsonld')?.remove()
    }
  }, [slug])

  useEffect(() => {
    return () => {
      fileItems.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      })
    }
  }, [fileItems])

  useEffect(() => {
    if (!downloadUrl) return
    return () => {
      URL.revokeObjectURL(downloadUrl)
    }
  }, [downloadUrl])

  const fields = useMemo(() => {
    if (!tool) return []
    const explicit = getToolFields(tool.slug)
    if (explicit.length > 0) return explicit
    // Fallback: any text-input tool without explicit field defs gets a default textarea.
    // This makes every client-side instant tool (base64-encoder, sha256, rot13, bubble-text…)
    // and every legacy text tool render a usable input even if its field schema was never wired.
    if (tool.input_kind === 'text') {
      return [{
        name: 'text',
        label: 'Input Text',
        type: 'textarea' as const,
        placeholder: 'Paste or type your text here…',
        required: true,
        rows: 8,
      }]
    }
    return []
  }, [tool])
  const formFields = useMemo(() => fields.filter((field) => field.type !== 'file'), [fields])
  const fileAccept = useMemo(
    () => fields.find((field) => field.type === 'file' && field.accept)?.accept,
    [fields],
  )
  const toolTheme = useMemo(
    () => (tool ? getCategoryTheme(tool.category) : getCategoryTheme('pdf-core')),
    [tool],
  )
  const seo = useMemo(
    () => {
      if (!tool) return null
      const fn = seoMod?.getToolSEO ?? fallbackToolSEO
      return fn(tool.slug, tool.title, tool.description, tool.category)
    },
    [tool, seoMod],
  )
  const visibleSeoKeywords = useMemo(
    () => (
      seo
        ? Array.from(
          new Map(
            seo.keywords
              .map((keyword) => keyword.trim())
              .filter(Boolean)
              .map((keyword) => [keyword.toLowerCase(), keyword]),
          ).values(),
        )
        : []
    ),
    [seo],
  )

  useEffect(() => {
    const defaults: Record<string, string> = {}
    for (const field of formFields) {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue
      }
    }
    setPayloadState(defaults)
  }, [formFields])


  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newItems: FilePreviewItem[] = acceptedFiles.map((file) => ({
        file,
        previewUrl: isImageFile(file) ? URL.createObjectURL(file) : undefined,
      }))

      if (tool?.accepts_multiple) {
        setFileItems((prev) => [...prev, ...newItems])
      } else {
        fileItems.forEach((item) => {
          if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
        })
        setFileItems(newItems.slice(0, 1))
      }
    },
    [tool, fileItems],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: tool?.accepts_multiple ?? false,
    noClick: false,
  })

  function removeFile(index: number) {
    setFileItems((prev) => {
      const item = prev[index]
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  function startProgressSimulation() {
    setProgress(0)
    let currentProgress = 0
    progressInterval.current = setInterval(() => {
      currentProgress += Math.random() * 10
      if (currentProgress > 88) currentProgress = 88
      setProgress(Math.round(currentProgress))
    }, 350)
  }

  function stopProgressSimulation(success: boolean) {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
    setProgress(success ? 100 : 0)
    if (success) {
      setTimeout(() => setProgress(0), 2000)
    }
  }

  function scrollToResult() {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }

  function handleReset() {
    setRunError(null)
    setRunMessage(null)
    setJsonResult(null)
    setDownloadUrl(null)
    setDownloadName(null)
    setOutputImagePreview(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!tool || !slug) return

    handleReset()

    if (tool.input_kind === 'files' && fileItems.length === 0) {
      setRunError('Please upload the required file before running this tool.')
      return
    }

    const missingField = formFields.find((field) => {
      if (!field.required) return false
      return !String(payloadState[field.name] || '').trim()
    })
    if (missingField) {
      setRunError(`Please fill ${missingField.label} before running this tool.`)
      return
    }

    try {
      setRunning(true)
      startProgressSimulation()

      const payload: Record<string, unknown> = {}
      for (const field of formFields) {
        const rawValue = payloadState[field.name]
        if (rawValue !== undefined && rawValue !== '') {
          payload[field.name] = normalizePayloadValue(rawValue, field.type)
        }
      }

      const files = fileItems.map((item) => item.file)

      // ─── CLIENT-SIDE INSTANT EXECUTION ──────────────────────────────────────
      // For pure-function tools (base64, sha256, json-formatter, password-generator,
      // case transforms, ciphers, …) we run the tool 100% in the browser — no API
      // call. That makes the tool: (a) instant, (b) immune to backend / Vercel
      // outages, (c) usable even with zero network. If the executor returns null
      // (unexpected throw), we silently fall back to the network path below.
      let result: Awaited<ReturnType<typeof runTool>> | null = null
      const hasFiles = files.length > 0
      if (!hasFiles && getClientExecutor(slug)) {
        const clientResult = await runClientTool(slug, payload)
        if (clientResult) result = clientResult
      }
      if (!result) {
        result = await runTool(slug, files, payload, {
          onColdStartRetry: () => {
            toast.show(
              'Server was idle — waking it up and auto-retrying. Hang tight…',
              'info',
              9000,
            )
          },
        })
      }

      stopProgressSimulation(true)

      if (result.type === 'file') {
        if (downloadUrl) URL.revokeObjectURL(downloadUrl)
        const objectUrl = URL.createObjectURL(result.blob)
        setDownloadUrl(objectUrl)
        setDownloadName(result.filename)
        setRunMessage(result.message)

        if (isImageBlob(result.contentType || '')) {
          setOutputImagePreview(objectUrl)
        }

        toast.show(result.message || 'File is ready to download!', 'success')
        scrollToResult()
      } else {
        // Detect handler-level errors returned as JSON (e.g. Instagram cookies needed,
        // Twitter no-video-in-tweet, rate limits). The HTTP status is 200 but the body
        // signals failure — surface it prominently instead of a misleading green "Done".
        const data = (result.payload?.data || {}) as Record<string, unknown>
        const errText = typeof data.error === 'string' ? (data.error as string) : ''
        const msg = result.payload?.message || ''
        const looksLikeError = !!errText
          || /^(error|failed|unable|invalid|not|no |please (paste|enter|provide))/i.test(msg.trim())
        if (looksLikeError) {
          const friendly = msg || errText || 'This tool could not complete the request.'
          setRunError(friendly)
          setJsonResult(result.payload) // still show details for power users
          toast.show(friendly, 'error', 6000)
        } else {
          setJsonResult(result.payload)
          setRunMessage(msg || 'Tool completed successfully.')
          toast.show(msg || 'Done!', 'success')
        }
        scrollToResult()
      }
    } catch (err) {
      stopProgressSimulation(false)
      // Friendly, actionable error messages for ALL 1247 tools — replaces
      // cryptic browser/network errors ("Failed to fetch", "AbortError",
      // raw HTTP status codes) with something a non-technical user can act on.
      // The Render backend is on a free tier and may cold-start, so a 502/504
      // or aborted request is almost always "server is waking up" rather than
      // a real bug — telling the user to retry in 20 seconds is vastly better
      // UX than showing them "fetch failed".
      const raw = err instanceof Error ? err.message : String(err || '')
      const lower = raw.toLowerCase()
      let friendly = raw || 'This tool could not finish the request.'
      if (!raw || /failed to fetch|networkerror|load failed/.test(lower)) {
        friendly = navigator.onLine === false
          ? 'You appear to be offline. Reconnect to the internet and try again.'
          : 'Could not reach the server. Please check your connection and try again in a moment.'
      } else if (/abort|timeout|timed? out/.test(lower)) {
        friendly = 'The request took too long and was cancelled. Try again — the server may have been waking up.'
      } else if (/http 50[234]|bad gateway|service unavailable|gateway timeout/.test(lower)) {
        friendly = 'The server is waking up. Please retry in about 20 seconds.'
      } else if (/http 429|too many requests|rate limit/.test(lower)) {
        friendly = 'Too many requests right now. Please wait a minute before trying again.'
      } else if (/http 413|payload too large|file too large/.test(lower)) {
        friendly = 'That file is too large. Try a smaller file (or compress it first).'
      } else if (/http 415|unsupported media type/.test(lower)) {
        friendly = 'That file type is not supported by this tool.'
      } else if (/http 401|http 403|unauthor|forbidden/.test(lower)) {
        friendly = 'This source requires authentication. Please check the URL or sign in.'
      } else if (/http 404|not found/.test(lower)) {
        friendly = 'The content could not be found. Double-check the link and try again.'
      } else if (/http 5\d\d/.test(lower)) {
        friendly = 'The server hit an error processing your request. Please try again — if it keeps failing, the input may be unsupported.'
      }
      setRunError(friendly)
      toast.show(friendly, 'error', 6000)
      scrollToResult()
    } finally {
      setRunning(false)
    }
  }

  // ─── Universal keyboard shortcuts (works on every tool) ───
  // Ctrl/Cmd+Enter = Run  |  Esc = Reset/Clear
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isTextarea = target?.tagName === 'TEXTAREA'
      // Cmd/Ctrl+Enter to submit (works even when typing in textarea)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!running && tool) {
          const form = document.querySelector('.tool-form') as HTMLFormElement | null
          form?.requestSubmit()
        }
      }
      // Esc to reset (only when not typing in inputs)
      if (e.key === 'Escape' && !isTextarea && target?.tagName !== 'INPUT') {
        if (downloadUrl || jsonResult || runError) {
          handleReset()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [running, tool, downloadUrl, jsonResult, runError])

  // ─── Universal clipboard paste — paste image/file directly into the dropzone ───
  useEffect(() => {
    if (!tool || tool.input_kind !== 'files') return
    function handlePaste(e: ClipboardEvent) {
      const target = e.target as HTMLElement
      // Don't intercept paste in text inputs
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return
      const items = e.clipboardData?.items
      if (!items) return
      const files: File[] = []
      for (const item of Array.from(items)) {
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) files.push(file)
        }
      }
      if (files.length > 0) {
        e.preventDefault()
        onDrop(files)
        toast.show(`Pasted ${files.length} file${files.length > 1 ? 's' : ''} from clipboard`, 'success')
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [tool, onDrop, toast])

  // ─── Drain pending file from global SmartDropOverlay ──────────────────
  // If the user dropped a file anywhere on the site and picked this tool from
  // the chip menu, the file is sitting in `pendingFile`. We pull it (if present
  // and matching this slug) and feed it through the same onDrop the tool's
  // own dropzone uses, so everything else (preview, multiple-files handling,
  // remove buttons) just works. Single-shot — `takePendingDrop` clears state.
  useEffect(() => {
    if (!slug || !tool) return
    if (tool.input_kind !== 'files' && tool.input_kind !== 'mixed') return
    const dropped = takePendingDrop(slug)
    if (!dropped || !dropped.length) return
    const next = tool.accepts_multiple ? dropped : dropped.slice(0, 1)
    onDrop(next)
    toast.show(
      next.length === 1
        ? `Loaded ${next[0].name}`
        : `Loaded ${next.length} files`,
      'success',
    )
  }, [slug, tool, onDrop, toast])

  // ─── Auto-save text payload inputs to localStorage per tool ───
  // Restore on revisit so the user never loses their work
  useEffect(() => {
    if (!slug || !formFields.length) return
    try {
      const saved = localStorage.getItem(`tool-input:${slug}`)
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, string>
        if (parsed && typeof parsed === 'object') {
          setPayloadState((prev) => ({ ...parsed, ...prev }))
        }
      }
    } catch {
      /* ignore parse errors */
    }
  }, [slug, formFields.length])

  useEffect(() => {
    if (!slug || !formFields.length) return
    // debounce write
    const t = setTimeout(() => {
      try {
        // Only persist non-empty values to keep storage small
        const filtered: Record<string, string> = {}
        for (const k in payloadState) {
          if (payloadState[k] !== undefined && payloadState[k] !== '') filtered[k] = payloadState[k]
        }
        if (Object.keys(filtered).length) {
          localStorage.setItem(`tool-input:${slug}`, JSON.stringify(filtered))
        }
      } catch {
        /* quota exceeded — ignore */
      }
    }, 400)
    return () => clearTimeout(t)
  }, [payloadState, slug, formFields.length])

  if (toolLoading) {
    return (
      <SiteShell>
        <SkeletonToolPage />
      </SiteShell>
    )
  }

  if (toolError || !tool) {
    return (
      <SiteShell>
        <div className='page-wrap'>
          <div className='tool-error-state'>
            <div className='tool-error-icon'>!</div>
            <h2>{toolError ? 'Tool Error' : 'Tool Not Found'}</h2>
            <p className='status-text error'>{toolError || 'This tool does not exist or has been removed.'}</p>
            <Link to='/' className='inline-link'>
              ← Return to all tools
            </Link>
          </div>
        </div>
      </SiteShell>
    )
  }

  const hasResult = !!(runMessage || runError || jsonResult || downloadUrl)
  const isScientificCalculator = tool.slug === 'scientific-calculator'

  return (
    <SiteShell>
      <div className='page-wrap tool-page-wrap'>
        <Link to='/' className='back-link'>
          <ArrowLeft size={18} />
          Back to all tools
        </Link>

        {/* Auto-pin nudge for power users (≥5 visits, not yet pinned, not
            previously dismissed). Renders nothing in all other cases so
            first-time visitors never see it. */}
        <PinSuggestionBanner slug={tool.slug} title={tool.title} />

        <div className='tool-layout'>
          <div className='tool-main-column'>
            <motion.section
              className='tool-main-panel'
              style={
                {
                  '--card-accent': toolTheme.accent,
                  '--card-surface': toolTheme.surface,
                  '--card-glow': toolTheme.glow,
                } as CSSProperties
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className='tool-page-hero'>
                <span
                  className='tool-icon-wrap large'
                  style={{
                    borderColor: `${toolTheme.accent}40`,
                    background: `${toolTheme.accent}12`,
                  }}
                >
                  <ToolIcon slug={tool.slug} className='tool-icon' />
                </span>
                <div>
                  <div className='tool-badge-row'>
                    <span
                      className='tool-badge'
                      style={{ borderColor: toolTheme.accent, color: toolTheme.accent }}
                    >
                      {toolTheme.label}
                    </span>
                    <span className='tool-badge subtle'>
                      <Zap size={11} />
                      {tool.accepts_multiple ? 'Multi-file' : 'Single-file'}
                    </span>
                  </div>
                  <h1>{seo?.h1 || tool.title}</h1>
                  <p>{tool.description}</p>
                  {seo && (
                    <div className='tool-seo-chip-row' aria-label='Tool keywords'>
                      {visibleSeoKeywords.slice(0, 6).map((keyword) => (
                        <span key={keyword}>{keyword}</span>
                      ))}
                    </div>
                  )}
                  <ToolActions
                    slug={tool.slug}
                    title={tool.title}
                    description={tool.description}
                    url={typeof window !== 'undefined' ? `${SITE_URL}/tools/${tool.slug}` : `${SITE_FALLBACK_URL}/tools/${tool.slug}`}
                    accent={toolTheme.accent}
                  />
                  
                </div>
              </div>

              {isScientificCalculator ? (
                <ScientificCalculator accent={toolTheme.accent} />
              ) : (
              <>
              {/* Progress bar */}
              <AnimatePresence>
                {running && (
                  <motion.div
                    className='tool-progress-bar-wrap'
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className='tool-progress-bar'>
                      <motion.div
                        className='tool-progress-fill'
                        style={{ width: `${progress}%`, background: toolTheme.accent }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <p className='tool-progress-label'>Processing… {progress}%</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form className='tool-form' onSubmit={handleSubmit}>
                {(tool.input_kind === 'files' || tool.input_kind === 'mixed') && (
                  <div className='upload-section'>
                    <label className='upload-label'>
                      Upload file{tool.accepts_multiple ? 's' : ''}
                      {tool.input_kind === 'mixed' && (
                        <span className='upload-label-hint'>(optional)</span>
                      )}
                    </label>

                    <div
                      {...getRootProps()}
                      className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${fileItems.length > 0 ? 'dropzone-has-files' : ''}`}
                      style={
                        isDragActive
                          ? {
                              borderColor: toolTheme.accent,
                              background: `${toolTheme.accent}08`,
                            }
                          : {}
                      }
                    >
                      <input {...getInputProps(fileAccept ? { accept: fileAccept } : {})} />
                      {isDragActive ? (
                        <div className='dropzone-content dragging'>
                          <Upload size={28} style={{ color: toolTheme.accent }} />
                          <p>Drop files here…</p>
                        </div>
                      ) : fileItems.length === 0 ? (
                        <div className='dropzone-content'>
                          <div
                            className='dropzone-icon-wrap'
                            style={{
                              background: `${toolTheme.accent}14`,
                              borderColor: `${toolTheme.accent}30`,
                            }}
                          >
                            <Upload size={24} style={{ color: toolTheme.accent }} />
                          </div>
                          <div>
                            <p className='dropzone-title'>
                              Drag &amp; drop file{tool.accepts_multiple ? 's' : ''} here
                            </p>
                            <p className='dropzone-hint'>
                              or click to browse from your device
                              {fileAccept ? ` (${fileAccept})` : ''}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className='dropzone-content compact'>
                          <Upload size={18} style={{ color: toolTheme.accent }} />
                          <p>{tool.accepts_multiple ? 'Add more files' : 'Replace file'}</p>
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {fileItems.length > 0 && (
                        <motion.div
                          className='file-preview-list'
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          {fileItems.map((item, index) => (
                            <motion.div
                              key={`${item.file.name}-${index}`}
                              className='file-preview-item'
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={{ delay: index * 0.04 }}
                            >
                              {item.previewUrl ? (
                                <img
                                  src={item.previewUrl}
                                  alt={item.file.name}
                                  className='file-preview-thumb'
                                  width={40}
                                  height={40}
                                  loading='lazy'
                                  decoding='async'
                                />
                              ) : (
                                <div
                                  className='file-preview-icon'
                                  style={{ color: toolTheme.accent }}
                                >
                                  {getFileIcon(item.file)}
                                </div>
                              )}
                              <div className='file-preview-info'>
                                <span className='file-preview-name'>{item.file.name}</span>
                                <span className='file-preview-size'>
                                  {formatBytes(item.file.size)}
                                </span>
                              </div>
                              <button
                                type='button'
                                className='file-remove-btn'
                                onClick={() => removeFile(index)}
                                title='Remove file'
                              >
                                <X size={14} />
                              </button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {formFields.length > 0 && (
                  <div className='field-grid'>
                    {formFields.map((field) => (
                      <label
                        key={field.name}
                        className={`field-block ${field.type === 'textarea' ? 'full-span' : ''}`}
                      >
                        <span>
                          {field.label}
                          {field.required && <em className='field-required'>*</em>}
                        </span>
                        {field.type === 'textarea' ? (
                          <textarea
                            rows={field.rows ?? 6}
                            placeholder={field.placeholder}
                            required={field.required}
                            value={payloadState[field.name] || ''}
                            onChange={(event) =>
                              setPayloadState((prev) => ({
                                ...prev,
                                [field.name]: event.target.value,
                              }))
                            }
                          />
                        ) : field.type === 'select' ? (
                          <select
                            value={payloadState[field.name] || field.defaultValue || ''}
                            required={field.required}
                            onChange={(event) =>
                              setPayloadState((prev) => ({
                                ...prev,
                                [field.name]: event.target.value,
                              }))
                            }
                          >
                            {field.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : /url|link/i.test(field.name) ? (
                          <div className='input-with-paste'>
                            <input
                              type={/url/i.test(field.name) ? 'url' : field.type}
                              placeholder={field.placeholder}
                              required={field.required}
                              min={field.min}
                              max={field.max}
                              step={field.step}
                              inputMode={field.type === 'number' ? 'decimal' : undefined}
                              autoComplete='off'
                              value={payloadState[field.name] || ''}
                              onChange={(event) =>
                                setPayloadState((prev) => ({
                                  ...prev,
                                  [field.name]: event.target.value,
                                }))
                              }
                            />
                            <button
                              type='button'
                              className='paste-btn'
                              title='Paste from clipboard'
                              onClick={async () => {
                                try {
                                  const text = (await navigator.clipboard.readText()).trim();
                                  if (text) {
                                    setPayloadState((prev) => ({ ...prev, [field.name]: text }));
                                  }
                                } catch {
                                  // Clipboard permission denied — silently no-op; user can paste manually.
                                }
                              }}
                            >
                              Paste
                            </button>
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            required={field.required}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            inputMode={field.type === 'number' ? 'decimal' : undefined}
                            autoComplete='off'
                            value={payloadState[field.name] || ''}
                            onChange={(event) =>
                              setPayloadState((prev) => ({
                                ...prev,
                                [field.name]: event.target.value,
                              }))
                            }
                          />
                        )}
                        {(field.help || field.hint || (field.placeholder && field.type === 'textarea')) && (
                          <small className='field-hint'>
                            {field.help || field.hint || field.placeholder}
                          </small>
                        )}
                        {field.name === 'cookies' && (
                          <details className='cookies-help'>
                            <summary>How do I get my cookies? (free, takes 30 seconds)</summary>
                            <ol>
                              <li>
                                Install the free browser extension{' '}
                                <a
                                  href='https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc'
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  Get cookies.txt LOCALLY (Chrome / Edge)
                                </a>{' '}
                                or{' '}
                                <a
                                  href='https://addons.mozilla.org/en-US/firefox/addon/cookies-txt/'
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  cookies.txt (Firefox)
                                </a>
                                .
                              </li>
                              <li>
                                Open the site you want to download from
                                {' '}(Instagram, TikTok, Twitter/X, Facebook, etc.) and{' '}
                                <strong>log in</strong> in that same browser.
                              </li>
                              <li>
                                Click the extension icon while on that site and choose{' '}
                                <em>Export</em> (or <em>Current Site</em>). It saves a small{' '}
                                <code>cookies.txt</code> file.
                              </li>
                              <li>
                                Open the file in any text editor, copy everything, and paste it
                                into this field. That's it — your cookies stay private and are
                                only used for this single download.
                              </li>
                            </ol>
                            <p className='cookies-help-note'>
                              Tip: cookies expire after a few days. If a download stops working,
                              just re-export and paste again.
                            </p>
                          </details>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                <div className='run-button-row'>
                  <button
                    type='submit'
                    className='run-button'
                    disabled={running}
                    style={
                      !running
                        ? {
                            background: `linear-gradient(120deg, ${toolTheme.accent}, ${toolTheme.accent}bb)`,
                          }
                        : {}
                    }
                  >
                    {running ? (
                      <>
                        <LoaderCircle size={18} className='spin' />
                        Processing…
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        Run {tool.title}
                      </>
                    )}
                  </button>

                  {hasResult && (
                    <button
                      type='button'
                      className='reset-button'
                      onClick={handleReset}
                      title='Clear results'
                    >
                      <RefreshCw size={16} />
                      New
                    </button>
                  )}
                </div>
              </form>
              </>
              )}
            </motion.section>

            {/* Results */}
            <AnimatePresence>
              {!isScientificCalculator && hasResult && (
                <motion.section
                  ref={resultRef}
                  className='result-card'
                  style={
                    {
                      '--card-accent': toolTheme.accent,
                    } as CSSProperties
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  {runError && (
                    <div className='result-error'>
                      <X size={18} />
                      <div>
                        <strong>Error</strong>
                        <p>{runError}</p>
                      </div>
                    </div>
                  )}

                  {runMessage && !runError && (
                    <div className='result-success'>
                      <CheckCircle2 size={20} style={{ color: toolTheme.accent, flexShrink: 0 }} />
                      <div>
                        <strong>Done!</strong>
                        <p>{runMessage}</p>
                      </div>
                    </div>
                  )}

                  {outputImagePreview && (
                    <div className='output-image-preview'>
                      <img
                        src={outputImagePreview}
                        alt='Output preview'
                        width={960}
                        height={720}
                        loading='lazy'
                        decoding='async'
                      />
                    </div>
                  )}

                  {downloadUrl && downloadName && (
                    <div className='download-actions'>
                      <motion.a
                        href={downloadUrl}
                        download={downloadName}
                        className='download-link prominent'
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          background: `linear-gradient(120deg, ${toolTheme.accent}22, ${toolTheme.accent}11)`,
                          borderColor: `${toolTheme.accent}55`,
                          color: toolTheme.accent,
                        }}
                      >
                        <Download size={20} />
                        Download {downloadName}
                      </motion.a>
                      <a
                        href={downloadUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='open-link'
                        title='Open in new tab'
                      >
                        <ExternalLink size={16} />
                        Open
                      </a>
                    </div>
                  )}

                  {jsonResult && (() => {
                    const d = jsonResult.data || {}
                    return (
                      <div className='json-result-block'>
                        <SmartResultDisplay
                          data={d as Record<string, unknown>}
                          slug={tool.slug}
                          accent={toolTheme.accent}
                        />
                        <details className='json-details'>
                          <summary>Raw output data</summary>
                          <pre className='json-preview'>{JSON.stringify(jsonResult, null, 2)}</pre>
                        </details>
                      </div>
                    )
                  })()}
                </motion.section>
              )}
            </AnimatePresence>

            {/* FAQ Section for SEO — re-uses memoised `seo` so we don't
                re-call getToolSEO on every render and don't disable lazy
                loading by importing seoData here. */}
            {(() => {
              if (!seo || seo.faq.length === 0) return null
              return (
                <motion.section
                  className='tool-faq-section'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <h2 className='faq-title'>Frequently Asked Questions</h2>
                  <div className='faq-list'>
                    {seo.faq.map((item, idx) => (
                      <details key={idx} className='faq-item'>
                        <summary className='faq-question'>{item.question}</summary>
                        <p className='faq-answer'>{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </motion.section>
              )
            })()}

            {/* Rich SEO Content Section — visible to crawlers & users */}
            <motion.section
              className='seo-content-section tool-seo-section'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2>About {tool.title} — Free Online Tool</h2>
              <p>
                {tool.title} is a free online tool by <strong>ISHU TOOLS</strong> (Indian Student Hub University Tools).
                {tool.description} No signup, no watermark — completely free for students, professionals,
                and everyone. Process your files securely and download results instantly.
              </p>

              <h3>How to Use {tool.title}</h3>
              <ol>
                <li><strong>Visit ISHU TOOLS</strong> — Navigate to the {tool.title} page.</li>
                {tool.input_kind === 'files' || tool.input_kind === 'mixed'
                  ? <li><strong>Upload Your File</strong> — Drag & drop or click to browse. Supports {tool.accepts_multiple ? 'multiple files' : 'single file'} upload.</li>
                  : <li><strong>Enter Your Data</strong> — Fill in the required fields with your text or values.</li>
                }
                <li><strong>Configure Options</strong> — Adjust settings like quality, format, or size as needed.</li>
                <li><strong>Click "Run"</strong> — Processing starts instantly. Results are ready in seconds.</li>
                <li><strong>Download Result</strong> — Download your processed file or copy the output text.</li>
              </ol>

              <h3>Key Features of {tool.title}</h3>
              <ul>
                <li><strong>100% Free</strong> — No charges, no premium plans, no hidden fees</li>
                <li><strong>No Signup Required</strong> — Use instantly without creating an account</li>
                <li><strong>No Watermark</strong> — Clean, professional output every time</li>
                <li><strong>Privacy Focused</strong> — Files are automatically deleted after processing</li>
                <li><strong>Fast Processing</strong> — Results generated in seconds</li>
                <li><strong>Works on All Devices</strong> — Mobile, tablet, laptop, desktop compatible</li>
                <li><strong>Practical Usage</strong> — Designed for fast everyday workflows on mobile and desktop</li>
              </ul>

              <h3>Why Choose ISHU TOOLS for {tool.title}?</h3>
              <p>
                ISHU TOOLS is trusted by millions of students and professionals worldwide for its reliability,
                speed, and ease of use. Unlike other tools that require signup or add watermarks,
                ISHU TOOLS provides a completely free experience with no compromises. Our {tool.title} tool
                uses advanced processing to deliver accurate, high-quality results every time.
              </p>

              {seo && (
                <>
                  <h3>Popular Searches for {tool.title}</h3>
                  <div className='seo-keyword-cloud'>
                    {visibleSeoKeywords.slice(0, 18).map((keyword) => (
                      <Link key={keyword} to={`/tools/${tool.slug}`}>
                        {keyword}
                      </Link>
                    ))}
                  </div>

                  <h3>AI SEO Intent Coverage</h3>
                  <p>
                    This page is optimized for direct tool intent, student workflows, no-signup utility searches,
                    Ishu-branded searches, mobile users, privacy-focused users, and alternative searches inspired by
                    leading PDF, image, student, developer, and everyday tools platforms.
                  </p>
                </>
              )}
            </motion.section>
          </div>

          <ToolSidebar
            tool={tool}
            relatedTools={relatedTools}
            downloadUrl={downloadUrl}
            downloadName={downloadName}
            jsonResult={jsonResult?.data || null}
            runtimeCapabilities={runtimeCapabilities}
            accentColor={toolTheme.accent}
          />
        </div>
      </div>
    </SiteShell>
  )
}
