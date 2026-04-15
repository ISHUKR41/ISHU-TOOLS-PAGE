import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCopy,
  Download,
  ExternalLink,
  FileText,
  ImageIcon,
  LoaderCircle,
  RefreshCw,
  Trash2,
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
import { applyDocumentBranding, getCategoryTheme, getToolAccept } from '../../lib/toolPresentation'
import { getToolFields } from './toolFields'
import ToolSidebar from './components/ToolSidebar'

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

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>()

  const [tool, setTool] = useState<ToolDefinition | null>(null)
  const [relatedTools, setRelatedTools] = useState<ToolDefinition[]>([])
  const [toolLoading, setToolLoading] = useState(true)
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
  const [outputContentType, setOutputContentType] = useState<string | null>(null)
  const [outputImagePreview, setOutputImagePreview] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const resultRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!slug) return
    const currentSlug = slug
    let mounted = true

    async function load() {
      try {
        setToolLoading(true)
        const [detail, capabilities] = await Promise.all([
          fetchTool(currentSlug),
          fetchRuntimeCapabilities().catch(() => null),
        ])
        if (!mounted) return

        setTool(detail)
        setRuntimeCapabilities(capabilities)
        setToolError(null)
        applyDocumentBranding(
          `${detail.title} | ISHU TOOLS`,
          detail.description,
          getCategoryTheme(detail.category).accent,
        )

        const sameCategoryTools = await fetchTools({ category: detail.category })
        if (!mounted) return
        setRelatedTools(sameCategoryTools.filter((item) => item.slug !== detail.slug))
      } catch (err) {
        if (!mounted) return
        setToolError(err instanceof Error ? err.message : 'Unable to load tool details')
      } finally {
        if (mounted) setToolLoading(false)
      }
    }

    void load()

    return () => {
      mounted = false
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

  useEffect(() => {
    const defaults: Record<string, string> = {}
    for (const field of fields) {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue
      }
    }
    setPayloadState(defaults)
  }, [fields])

  const accept = useMemo(() => {
    if (!tool) return {}
    const acceptStr = getToolAccept(tool.slug)
    if (!acceptStr) return {}
    const result: Record<string, string[]> = {}
    acceptStr.split(',').forEach((ext) => {
      const trimmed = ext.trim()
      result[trimmed] = []
    })
    return result
  }, [tool])

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
    setOutputContentType(null)
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
        setOutputContentType(result.contentType || null)

        if (isImageBlob(result.contentType || '')) {
          setOutputImagePreview(objectUrl)
        }

        scrollToResult()
      } else {
        setJsonResult(result.payload)
        setRunMessage(result.payload.message || 'Tool completed successfully.')
        scrollToResult()
      }
    } catch (err) {
      stopProgressSimulation(false)
      setRunError(err instanceof Error ? err.message : 'Tool execution failed')
      scrollToResult()
    } finally {
      setRunning(false)
    }
  }

  async function handleCopyText(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  if (toolLoading) {
    return (
      <SiteShell>
        <div className='page-wrap'>
          <div className='tool-loading-state'>
            <LoaderCircle size={32} className='spin' />
            <p>Loading tool workspace...</p>
          </div>
        </div>
      </SiteShell>
    )
  }

  if (toolError || !tool) {
    return (
      <SiteShell>
        <div className='page-wrap'>
          <div className='tool-error-state'>
            <p className='status-text error'>{toolError || 'Tool not found'}</p>
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
                  <h1>{tool.title}</h1>
                  <p>{tool.description}</p>
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
                      <img src={outputImagePreview} alt='Output preview' />
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
                    const textFields = [
                      'text',
                      'content',
                      'answer',
                      'summary',
                      'translated_text',
                      'result',
                      'extracted_text',
                      'output',
                    ]
                    const found = textFields.find((k) => d[k])
                    return (
                      <div className='json-result-block'>
                        {found && (
                          <div className='json-text-result'>
                            <div className='json-text-header'>
                              <span>Result</span>
                              <button
                                type='button'
                                className='copy-btn'
                                onClick={() => handleCopyText(String(d[found]))}
                              >
                                <ClipboardCopy size={13} />
                                {copied ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <div className='json-text-body'>
                              <p>{String(d[found])}</p>
                            </div>
                          </div>
                        )}
                        {Object.keys(d).filter((k) => k !== found && d[k] && typeof d[k] !== 'object').map((k) => (
                          <div key={k} className='json-kv-row'>
                            <span className='json-kv-key'>{k.replace(/_/g, ' ')}</span>
                            <span className='json-kv-val'>{String(d[k])}</span>
                          </div>
                        ))}
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
