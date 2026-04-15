import { CircleAlert, CircleCheck, FileDown, Layers3, ListChecks, ServerCog, WandSparkles } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import { getCategoryTheme, getToolOutputLabel, getToolUsageSteps } from '../../../lib/toolPresentation'
import type { RuntimeCapabilities, ToolDefinition } from '../../../types/tools'

type CapabilityKey = Exclude<keyof RuntimeCapabilities['capabilities'], 'python_version'>

const TOOL_CAPABILITY_RULES: Array<{ slugs: string[]; capability: CapabilityKey; label: string }> = [
  {
    slugs: [
      'djvu-to-pdf',
      'wps-to-pdf',
      'pub-to-pdf',
      'hwp-to-pdf',
      'chm-to-pdf',
      'pages-to-pdf',
      'docx-to-pdf',
      'pptx-to-pdf',
      'excel-to-pdf',
      'word-to-pdf',
      'ppt-to-pdf',
    ],
    capability: 'libreoffice',
    label: 'LibreOffice converter',
  },
  {
    slugs: ['pdf-to-mobi', 'mobi-to-pdf'],
    capability: 'ebook_convert',
    label: 'Calibre ebook-convert',
  },
  {
    slugs: ['remove-background', 'blur-background'],
    capability: 'rembg',
    label: 'AI background model',
  },
  {
    slugs: [
      'ocr-image',
      'ocr-pdf',
      'pdf-ocr',
      'image-to-text',
      'jpg-to-text',
      'png-to-text',
    ],
    capability: 'rapidocr',
    label: 'OCR runtime engine',
  },
  {
    slugs: ['heic-to-jpg', 'heic-to-pdf', 'heif-to-pdf'],
    capability: 'pillow_heif',
    label: 'HEIC/HEIF codec',
  },
]

function getCapabilityNeeds(slug: string): Array<{ capability: CapabilityKey; label: string }> {
  return TOOL_CAPABILITY_RULES.filter((rule) => rule.slugs.includes(slug)).map((rule) => ({
    capability: rule.capability,
    label: rule.label,
  }))
}

type ToolSidebarProps = {
  tool: ToolDefinition
  relatedTools: ToolDefinition[]
  downloadUrl: string | null
  downloadName: string | null
  jsonResult: Record<string, unknown> | null
  runtimeCapabilities: RuntimeCapabilities | null
  accentColor?: string
}

export default function ToolSidebar({
  tool,
  relatedTools,
  downloadUrl,
  downloadName,
  jsonResult,
  runtimeCapabilities,
  accentColor,
}: ToolSidebarProps) {
  const theme = getCategoryTheme(tool.category)
  const accent = accentColor || theme.accent
  const usageSteps = getToolUsageSteps(tool)
  const outputLabel = getToolOutputLabel(tool)
  const capabilityNeeds = getCapabilityNeeds(tool.slug)

  return (
    <aside className='tool-sidebar' style={{ '--sidebar-accent': accent } as CSSProperties}>
      <section className='insight-card'>
        <div className='insight-title-row'>
          <Layers3 size={16} style={{ color: accent }} />
          <h2>Workflow snapshot</h2>
        </div>
        <div className='tool-badge-row'>
          <span className='tool-badge' style={{ borderColor: accent, color: accent }}>
            {theme.label}
          </span>
          <span className='tool-badge subtle'>{tool.input_kind}</span>
          <span className='tool-badge subtle'>
            {tool.accepts_multiple ? 'multi-file' : 'single-file'}
          </span>
        </div>
        <p className='insight-copy'>
          <strong>Output:</strong> {outputLabel}
        </p>
      </section>

      <section className='insight-card'>
        <div className='insight-title-row'>
          <ListChecks size={16} style={{ color: accent }} />
          <h2>How to use</h2>
        </div>
        <ol className='insight-steps'>
          {usageSteps.map((step, i) => (
            <li key={i}>
              <span className='step-num' style={{ background: `${accent}22`, color: accent }}>
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className='insight-card'>
        <div className='insight-title-row'>
          <FileDown size={16} style={{ color: accent }} />
          <h2>Latest result</h2>
        </div>
        {downloadUrl && downloadName ? (
          <a
            href={downloadUrl}
            download={downloadName}
            className='download-link'
            style={{ borderColor: `${accent}44`, color: accent }}
          >
            <FileDown size={15} />
            Download {downloadName}
          </a>
        ) : jsonResult ? (
          <pre className='json-preview compact'>{JSON.stringify(jsonResult, null, 2)}</pre>
        ) : (
          <p className='insight-copy muted'>
            Run the tool once to see the generated output here.
          </p>
        )}
      </section>

      <section className='insight-card'>
        <div className='insight-title-row'>
          <ServerCog size={16} style={{ color: accent }} />
          <h2>Runtime support</h2>
        </div>
        {runtimeCapabilities ? (
          <>
            <p className='insight-copy'>
              Python {runtimeCapabilities.capabilities.python_version}
            </p>
            {capabilityNeeds.length > 0 ? (
              <div className='insight-capability-list'>
                {capabilityNeeds.map((need) => {
                  const available = runtimeCapabilities.capabilities[need.capability]
                  return (
                    <div key={`${need.capability}-${tool.slug}`} className={`capability-row ${available ? 'ok' : 'warn'}`}>
                      {available ? (
                        <CircleCheck size={14} className='cap-icon ok' />
                      ) : (
                        <CircleAlert size={14} className='cap-icon warn' />
                      )}
                      <span>{need.label}</span>
                      <span className='cap-status'>{available ? 'Ready' : 'Missing'}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className='insight-copy'>
                Fully supported by core runtime — no extra dependencies needed.
              </p>
            )}
          </>
        ) : (
          <p className='insight-copy muted'>Runtime check unavailable.</p>
        )}
      </section>

      {relatedTools.length > 0 && (
        <section className='insight-card'>
          <div className='insight-title-row'>
            <WandSparkles size={16} style={{ color: accent }} />
            <h2>Related tools</h2>
          </div>
          <div className='related-list'>
            {relatedTools.slice(0, 6).map((related) => {
              const relTheme = getCategoryTheme(related.category)
              return (
                <Link
                  key={related.slug}
                  to={`/tools/${related.slug}`}
                  className='related-link'
                  style={{ '--related-accent': relTheme.accent } as CSSProperties}
                >
                  {related.title}
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </aside>
  )
}
