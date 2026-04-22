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
import SiteShell from '../../components/layout/SiteShell'
import ToolIcon from '../../components/tools/ToolIcon'
import type { RuntimeCapabilities, ToolDefinition, ToolRunJsonResult } from '../../types/tools'
import { applyDocumentBranding, getCategoryTheme } from '../../lib/toolPresentation'
import { getToolFields } from './toolFields'
import ToolSidebar from './components/ToolSidebar'
import { getToolSEO, getToolJsonLd, getFaqJsonLd } from '../../lib/seoData'
import SkeletonToolPage from '../../components/ui/SkeletonToolPage'
import { useToast } from '../../components/ui/Toast'
import SmartResultDisplay from './components/SmartResultDisplay'
import { FALLBACK_TOOLS } from '../../data/catalogFallback'
import { trackToolVisit } from '../tools/AllToolsPage'

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
      const seo = getToolSEO(fallback.slug, fallback.title, fallback.description, fallback.category)
      const toolUrl = `https://ishutools.com/tools/${fallback.slug}`
      document.title = seo.title
      applyDocumentBranding(
        seo.title,
        seo.description,
        getCategoryTheme(fallback.category).accent,
      )
      upsertMeta('meta[name="description"]', { name: 'description', content: seo.description })
      upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: toolUrl })
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
        const detail = await fetchTool(currentSlug)
        if (!mounted) return

        setTool(detail)
        setToolError(null)
        void capabilitiesPromise.then((capabilities) => {
          if (mounted) setRuntimeCapabilities(capabilities)
        })

        // ─── Per-tool SEO injection ───
        const seo = getToolSEO(detail.slug, detail.title, detail.description, detail.category)
        
        // Set page title
        document.title = seo.title
        applyDocumentBranding(
          seo.title,
          seo.description,
          getCategoryTheme(detail.category).accent,
        )

        const toolUrl = `https://ishutools.com/tools/${detail.slug}`
        const keywordText = seo.keywords.join(', ')

        upsertMeta('meta[name="description"]', { name: 'description', content: seo.description })
        upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywordText })
        upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' })
        upsertMeta('meta[name="author"]', { name: 'author', content: 'Ishu Kumar — ISHU TOOLS' })
        upsertMeta('meta[name="creator"]', { name: 'creator', content: 'Ishu Kumar' })
        upsertMeta('meta[name="publisher"]', { name: 'publisher', content: 'ISHU TOOLS — ishutools.com' })
        upsertMeta('meta[name="category"]', { name: 'category', content: detail.category })
        upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: toolUrl })
        // Open Graph — full set for social sharing
        upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title })
        upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description })
        upsertMeta('meta[property="og:url"]', { property: 'og:url', content: toolUrl })
        upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
        upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'ISHU TOOLS' })
        upsertMeta('meta[property="og:image"]', { property: 'og:image', content: 'https://ishutools.com/og-image.png' })
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
        upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: 'https://ishutools.com/og-image.png' })
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
        ldScript.textContent = JSON.stringify(getToolJsonLd(detail.slug, detail.title, detail.description, detail.category))
        document.head.appendChild(ldScript)

        // FAQ JSON-LD
        if (seo.faq.length > 0) {
          const existingFaq = document.getElementById('tool-faq-jsonld')
          if (existingFaq) existingFaq.remove()
          const faqScript = document.createElement('script')
          faqScript.id = 'tool-faq-jsonld'
          faqScript.type = 'application/ld+json'
          faqScript.textContent = JSON.stringify(getFaqJsonLd(seo.faq))
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
            { '@type': 'ListItem', position: 1, name: 'ISHU TOOLS', item: 'https://ishutools.com/' },
            { '@type': 'ListItem', position: 2, name: 'All Tools', item: 'https://ishutools.com/tools' },
            { '@type': 'ListItem', position: 3, name: getCategoryTheme(detail.category).label || detail.category, item: `https://ishutools.com/category/${detail.category}` },
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
          isPartOf: { '@type': 'WebSite', url: 'https://ishutools.com', name: 'ISHU TOOLS' },
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

  const fields = useMemo(() => (tool ? getToolFields(tool.slug) : []), [tool])
  const toolTheme = useMemo(
    () => (tool ? getCategoryTheme(tool.category) : getCategoryTheme('pdf-core')),
    [tool],
  )
  const seo = useMemo(
    () => (tool ? getToolSEO(tool.slug, tool.title, tool.description, tool.category) : null),
    [tool],
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
    for (const field of fields) {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue
      }
    }
    setPayloadState(defaults)
  }, [fields])


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

    try {
      setRunning(true)
      startProgressSimulation()

      const payload: Record<string, unknown> = {}
      for (const field of fields) {
        const rawValue = payloadState[field.name]
        if (rawValue !== undefined && rawValue !== '') {
          payload[field.name] = normalizePayloadValue(rawValue, field.type)
        }
      }

      const files = fileItems.map((item) => item.file)
      const result = await runTool(slug, files, payload)

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
        setJsonResult(result.payload)
        setRunMessage(result.payload.message || 'Tool completed successfully.')
        toast.show(result.payload.message || 'Done!', 'success')
        scrollToResult()
      }
    } catch (err) {
      stopProgressSimulation(false)
      const errMsg = err instanceof Error ? err.message : 'Tool execution failed'
      setRunError(errMsg)
      toast.show(errMsg, 'error', 5000)
      scrollToResult()
    } finally {
      setRunning(false)
    }
  }

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

  return (
    <SiteShell>
      <div className='page-wrap tool-page-wrap'>
        <Link to='/' className='back-link'>
          <ArrowLeft size={18} />
          Back to all tools
        </Link>

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
                </div>
              </div>

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
                      <input {...getInputProps()} />
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
                            <p className='dropzone-hint'>or click to browse from your device</p>
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

                {fields.length > 0 && (
                  <div className='field-grid'>
                    {fields.map((field) => (
                      <label
                        key={field.name}
                        className={`field-block ${field.type === 'textarea' ? 'full-span' : ''}`}
                      >
                        <span>{field.label}</span>
                        {field.type === 'textarea' ? (
                          <textarea
                            rows={6}
                            placeholder={field.placeholder}
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
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={payloadState[field.name] || ''}
                            onChange={(event) =>
                              setPayloadState((prev) => ({
                                ...prev,
                                [field.name]: event.target.value,
                              }))
                            }
                          />
                        )}
                        {field.placeholder && field.type === 'textarea' && (
                          <small className='field-hint'>{field.placeholder}</small>
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
            </motion.section>

            {/* Results */}
            <AnimatePresence>
              {hasResult && (
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

            {/* FAQ Section for SEO */}
            {(() => {
              const seo = getToolSEO(tool.slug, tool.title, tool.description, tool.category)
              if (seo.faq.length === 0) return null
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
                {tool.description} No signup, no watermark, no limits — completely free for students, professionals,
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
                <li><strong>Unlimited Usage</strong> — No daily limits or file count restrictions</li>
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
