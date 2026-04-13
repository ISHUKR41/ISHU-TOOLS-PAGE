import { FileDown, Layers3, ListChecks, WandSparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getCategoryTheme, getToolOutputLabel, getToolUsageSteps } from '../../../lib/toolPresentation'
import type { ToolDefinition } from '../../../types/tools'

type ToolSidebarProps = {
  tool: ToolDefinition
  relatedTools: ToolDefinition[]
  downloadUrl: string | null
  downloadName: string | null
  jsonResult: Record<string, unknown> | null
}

export default function ToolSidebar({
  tool,
  relatedTools,
  downloadUrl,
  downloadName,
  jsonResult,
}: ToolSidebarProps) {
  const theme = getCategoryTheme(tool.category)
  const usageSteps = getToolUsageSteps(tool)
  const outputLabel = getToolOutputLabel(tool)

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

