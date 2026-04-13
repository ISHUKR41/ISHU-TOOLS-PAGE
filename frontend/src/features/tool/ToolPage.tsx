import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { ArrowLeft, Download, LoaderCircle, Upload } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import { fetchTool, fetchTools, runTool } from '../../api/toolsApi'
import SiteShell from '../../components/layout/SiteShell'
import ToolIcon from '../../components/tools/ToolIcon'
import type { ToolDefinition, ToolRunJsonResult } from '../../types/tools'
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

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>()

  const [tool, setTool] = useState<ToolDefinition | null>(null)
  const [relatedTools, setRelatedTools] = useState<ToolDefinition[]>([])
  const [toolLoading, setToolLoading] = useState(true)
  const [toolError, setToolError] = useState<string | null>(null)

  const [files, setFiles] = useState<File[]>([])
  const [payloadState, setPayloadState] = useState<Record<string, string>>({})
  const [running, setRunning] = useState(false)
  const [runMessage, setRunMessage] = useState<string | null>(null)
  const [runError, setRunError] = useState<string | null>(null)
  const [jsonResult, setJsonResult] = useState<ToolRunJsonResult | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadName, setDownloadName] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    const currentSlug = slug
    let mounted = true

    async function load() {
      try {
        setToolLoading(true)
        const detail = await fetchTool(currentSlug)
        if (!mounted) return

        setTool(detail)
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!tool || !slug) return

    setRunError(null)
    setRunMessage(null)
    setJsonResult(null)

    if ((tool.input_kind === 'files' || tool.input_kind === 'mixed') && files.length === 0) {
      setRunError('Please upload the required file before running this tool.')
      return
    }

    try {
      setRunning(true)

      const payload: Record<string, unknown> = {}
      for (const field of fields) {
        const rawValue = payloadState[field.name]
        if (rawValue !== undefined && rawValue !== '') {
          payload[field.name] = normalizePayloadValue(rawValue, field.type)
        }
      }

      const result = await runTool(slug, files, payload)

      if (result.type === 'file') {
        if (downloadUrl) URL.revokeObjectURL(downloadUrl)
        const objectUrl = URL.createObjectURL(result.blob)
        const anchor = document.createElement('a')
        anchor.href = objectUrl
        anchor.download = result.filename
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()

        setDownloadUrl(objectUrl)
        setDownloadName(result.filename)
        setRunMessage(`${result.message}. Download started for ${result.filename}.`)
      } else {
        setJsonResult(result.payload)
        setRunMessage(result.payload.message || 'Tool completed successfully.')
      }
    } catch (err) {
      setRunError(err instanceof Error ? err.message : 'Tool execution failed')
    } finally {
      setRunning(false)
    }
  }

  if (toolLoading) {
    return (
      <SiteShell>
        <div className='page-wrap'>
          <p className='status-text'>Loading tool workspace...</p>
        </div>
      </SiteShell>
    )
  }

  if (toolError || !tool) {
    return (
      <SiteShell>
        <div className='page-wrap'>
          <p className='status-text error'>{toolError || 'Tool not found'}</p>
          <Link to='/' className='inline-link'>
            Return to all tools
          </Link>
        </div>
      </SiteShell>
    )
  }

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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className='tool-page-hero'>
                <span className='tool-icon-wrap large'>
                  <ToolIcon slug={tool.slug} className='tool-icon' />
                </span>
                <div>
                  <div className='tool-badge-row'>
                    <span className='tool-badge' style={{ borderColor: toolTheme.accent, color: toolTheme.accent }}>
                      {toolTheme.label}
                    </span>
                    <span className='tool-badge subtle'>{tool.accepts_multiple ? 'Multi file' : 'Single file'}</span>
                  </div>
                  <h1>{tool.title}</h1>
                  <p>{tool.description}</p>
                </div>
              </div>

              <form className='tool-form' onSubmit={handleSubmit}>
                {(tool.input_kind === 'files' || tool.input_kind === 'mixed') && (
                  <label className='field-block'>
                    <span>Upload source file{tool.accepts_multiple ? 's' : ''}</span>
                    <div className='upload-shell'>
                      <Upload size={18} />
                      <input
                        type='file'
                        accept={getToolAccept(tool.slug)}
                        multiple={tool.accepts_multiple}
                        onChange={(event) => {
                          const incoming = Array.from(event.target.files || [])
                          setFiles(incoming)
                        }}
                      />
                    </div>
                    <small className='field-hint'>
                      {tool.accepts_multiple
                        ? 'You can upload multiple files for this workflow.'
                        : 'Upload one source file to continue.'}
                    </small>
                  </label>
                )}

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
                    </label>
                  ))}
                </div>

                <button type='submit' className='run-button' disabled={running}>
                  {running ? (
                    <>
                      <LoaderCircle size={18} className='spin' />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Run {tool.title}
                    </>
                  )}
                </button>
              </form>
            </motion.section>

            {files.length > 0 && (
              <section className='result-card'>
                <h2>Selected files</h2>
                <div className='file-chip-row'>
                  {files.map((file) => (
                    <span key={`${file.name}-${file.size}`} className='file-chip'>
                      {file.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {(runMessage || runError || jsonResult) && (
              <section className='result-card'>
                {runMessage && <p className='status-text success'>{runMessage}</p>}
                {runError && <p className='status-text error'>{runError}</p>}
                {jsonResult && <pre className='json-preview'>{JSON.stringify(jsonResult, null, 2)}</pre>}
              </section>
            )}
          </div>

          <ToolSidebar
            tool={tool}
            relatedTools={relatedTools}
            downloadUrl={downloadUrl}
            downloadName={downloadName}
            jsonResult={jsonResult?.data || null}
          />
        </div>
      </div>
    </SiteShell>
  )
}
