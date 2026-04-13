import { CircleAlert, CircleCheck, FileDown, Layers3, ListChecks, ServerCog, WandSparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getCategoryTheme, getToolOutputLabel, getToolUsageSteps } from '../../../lib/toolPresentation'
import type { RuntimeCapabilities, ToolDefinition } from '../../../types/tools'

type CapabilityKey = Exclude<keyof RuntimeCapabilities['capabilities'], 'python_version'>

const TOOL_CAPABILITY_RULES: Array<{ slugs: string[]; capability: CapabilityKey; label: string }> = [
  {
    slugs: ['djvu-to-pdf', 'wps-to-pdf', 'pub-to-pdf', 'hwp-to-pdf', 'chm-to-pdf', 'pages-to-pdf'],
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
    slugs: ['ocr-image', 'ocr-pdf', 'pdf-ocr', 'image-to-text', 'jpg-to-text', 'png-to-text'],
    capability: 'rapidocr',
    label: 'OCR runtime engine',
  },
  {
    slugs: ['heic-to-jpg', 'heic-to-pdf', 'heif-to-pdf'],
    capability: 'pillow_heif',
    label: 'HEIC/HEIF codec',
  },
  {
    slugs: ['html-to-pdf'],
    capability: 'wkhtmltopdf',
    label: 'wkhtmltopdf binary',
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
}

export default function ToolSidebar({
  tool,
  relatedTools,
  downloadUrl,
  downloadName,
  jsonResult,
  runtimeCapabilities,
}: ToolSidebarProps) {
  const theme = getCategoryTheme(tool.category)
  const usageSteps = getToolUsageSteps(tool)
  const outputLabel = getToolOutputLabel(tool)
  const capabilityNeeds = getCapabilityNeeds(tool.slug)

  return (
    <aside className='tool-sidebar'>
      <section className='insight-card'>
        <div className='insight-title-row'>
          <Layers3 size={18} />
          <h2>Workflow snapshot</h2>
        </div>
        <div className='tool-badge-row'>
          <span className='tool-badge' style={{ borderColor: theme.accent, color: theme.accent }}>
            {theme.label}
          </span>
          <span className='tool-badge subtle'>{tool.input_kind}</span>
          <span className='tool-badge subtle'>{tool.accepts_multiple ? 'multi-file' : 'single-file'}</span>
        </div>
        <p className='insight-copy'>Output: {outputLabel}</p>
      </section>

      <section className='insight-card'>
        <div className='insight-title-row'>
          <ListChecks size={18} />
          <h2>How to use</h2>
        </div>
        <div className='insight-list'>
          {usageSteps.map((step) => (
            <p key={step}>{step}</p>
          ))}
        </div>
      </section>

      <section className='insight-card'>
        <div className='insight-title-row'>
          <FileDown size={18} />
          <h2>Latest result</h2>
        </div>
        {downloadUrl && downloadName ? (
          <a href={downloadUrl} download={downloadName} className='download-link'>
            Download {downloadName}
          </a>
        ) : jsonResult ? (
          <pre className='json-preview compact'>{JSON.stringify(jsonResult, null, 2)}</pre>
        ) : (
          <p className='insight-copy'>Run the tool once to see the latest generated output here.</p>
        )}
      </section>

      <section className='insight-card'>
        <div className='insight-title-row'>
          <ServerCog size={18} />
          <h2>Runtime support</h2>
        </div>
        {runtimeCapabilities ? (
          <>
            <p className='insight-copy'>Python {runtimeCapabilities.capabilities.python_version}</p>
            {capabilityNeeds.length > 0 ? (
              <div className='insight-list'>
                {capabilityNeeds.map((need) => {
                  const available = runtimeCapabilities.capabilities[need.capability]
                  return (
                    <p key={`${need.capability}-${tool.slug}`}>
                      {available ? <CircleCheck size={14} /> : <CircleAlert size={14} />} {need.label}:{' '}
                      {available ? 'available' : 'missing on server'}
                    </p>
                  )
                })}
              </div>
            ) : (
              <p className='insight-copy'>This tool is fully supported by core runtime capabilities.</p>
            )}
          </>
        ) : (
          <p className='insight-copy'>Runtime capability check is temporarily unavailable.</p>
        )}
      </section>

      <section className='insight-card'>
        <div className='insight-title-row'>
          <WandSparkles size={18} />
          <h2>Related tools</h2>
        </div>
        <div className='related-list'>
          {relatedTools.length > 0 ? (
            relatedTools.slice(0, 5).map((related) => (
              <Link key={related.slug} to={`/tools/${related.slug}`} className='related-link'>
                {related.title}
              </Link>
            ))
          ) : (
            <p className='insight-copy'>More tools from this category will appear here.</p>
          )}
        </div>
      </section>
    </aside>
  )
}

