/**
 * Global "drop a file anywhere" overlay.
 *
 * Mounted inside SiteShell, this listens for HTML5 drag events at the
 * document level. When the user drags a file in from the OS, a fullscreen
 * frosted overlay slides in. On drop, we run the matcher to figure out which
 * of the 1247 tools can do something useful with that file, then show a chip
 * grid: the user picks a tool, and we route them straight there with the
 * file already loaded into the tool's dropzone.
 *
 * No-ops (and never even attaches listeners) when the user is already on a
 * tool page — the tool's own dropzone takes precedence there.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Upload, X, Sparkles } from 'lucide-react'
import { useCatalogData } from '../../hooks/useCatalogData'
import { matchToolsForFile, describeFileType } from '../../lib/fileToToolMatcher'
import { setPendingDrop } from '../../lib/pendingFile'
import { prefetchToolRoute } from '../../lib/prefetchTool'
import type { ToolDefinition } from '../../types/tools'

type Stage = 'idle' | 'dragging' | 'picking'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function SmartDropOverlay() {
  const location = useLocation()
  const navigate = useNavigate()
  const { tools } = useCatalogData()

  const [stage, setStage] = useState<Stage>('idle')
  const [files, setFiles] = useState<File[]>([])
  const dragCounter = useRef(0)

  // Disable on tool pages — the tool's own dropzone owns drag/drop UX there.
  const disabled = useMemo(() => {
    const p = location.pathname
    return p.startsWith('/tools/') || p === '/scientific-calculator'
  }, [location.pathname])

  const matches = useMemo<ToolDefinition[]>(() => {
    if (!files.length) return []
    return matchToolsForFile(files[0], tools, 8)
  }, [files, tools])

  const close = useCallback(() => {
    dragCounter.current = 0
    setStage('idle')
    setFiles([])
  }, [])

  // ── Document-level drag listeners ────────────────────────────────────────
  useEffect(() => {
    if (disabled) return

    function hasFiles(e: DragEvent): boolean {
      const t = e.dataTransfer?.types
      if (!t) return false
      // DataTransferItemList in some browsers exposes .contains; fallback to Array.from
      for (let i = 0; i < t.length; i++) if (t[i] === 'Files') return true
      return false
    }

    function onEnter(e: DragEvent) {
      if (stage === 'picking') return
      if (!hasFiles(e)) return
      dragCounter.current += 1
      if (stage !== 'dragging') setStage('dragging')
    }

    function onLeave(e: DragEvent) {
      if (stage === 'picking') return
      if (!hasFiles(e)) return
      dragCounter.current -= 1
      if (dragCounter.current <= 0) {
        dragCounter.current = 0
        setStage('idle')
      }
    }

    function onOver(e: DragEvent) {
      if (!hasFiles(e)) return
      // Required so onDrop fires
      e.preventDefault()
    }

    function onDrop(e: DragEvent) {
      if (stage === 'picking') return
      const list = e.dataTransfer?.files
      if (!list || !list.length) {
        dragCounter.current = 0
        setStage('idle')
        return
      }
      e.preventDefault()
      dragCounter.current = 0
      const dropped = Array.from(list)
      setFiles(dropped)
      setStage('picking')
    }

    document.addEventListener('dragenter', onEnter)
    document.addEventListener('dragleave', onLeave)
    document.addEventListener('dragover',  onOver)
    document.addEventListener('drop',      onDrop)
    return () => {
      document.removeEventListener('dragenter', onEnter)
      document.removeEventListener('dragleave', onLeave)
      document.removeEventListener('dragover',  onOver)
      document.removeEventListener('drop',      onDrop)
    }
  }, [disabled, stage])

  // Esc closes the picker
  useEffect(() => {
    if (stage !== 'picking') return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stage, close])

  if (disabled || stage === 'idle') return null

  const fileType = files.length ? describeFileType(files[0]) : 'file'
  const fileLabel = files.length === 1
    ? files[0].name
    : `${files.length} files (first: ${files[0].name})`
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0)

  function pickTool(slug: string) {
    if (!files.length) return
    setPendingDrop(slug, files)
    close()
    navigate(`/tools/${slug}`)
  }

  return (
    <div
      className={`smart-drop ${stage === 'dragging' ? 'smart-drop-dragging' : 'smart-drop-picking'}`}
      role='dialog'
      aria-modal='true'
      aria-label='Drop file to find a tool'
      onClick={(e) => {
        // Click on the backdrop (not on the inner card) closes the picker.
        if (stage === 'picking' && e.target === e.currentTarget) close()
      }}
    >
      {stage === 'dragging' ? (
        <div className='smart-drop-hint'>
          <div className='smart-drop-hint-orb'><Upload size={36} /></div>
          <div className='smart-drop-hint-title'>Drop your file anywhere</div>
          <div className='smart-drop-hint-sub'>
            We'll match it to the right tool from {tools.length || '1,200+'} options
          </div>
        </div>
      ) : (
        <div className='smart-drop-card' onClick={(e) => e.stopPropagation()}>
          <button className='smart-drop-close' onClick={close} aria-label='Close'>
            <X size={18} />
          </button>
          <div className='smart-drop-card-head'>
            <div className='smart-drop-badge'><Sparkles size={14} /> Smart match</div>
            <h2 className='smart-drop-card-title'>
              {fileType} detected — pick a tool
            </h2>
            <p className='smart-drop-card-meta'>
              {fileLabel} <span className='smart-drop-dot'>·</span> {formatBytes(totalBytes)}
            </p>
          </div>

          {matches.length > 0 ? (
            <ul className='smart-drop-grid' role='listbox'>
              {matches.map((t, idx) => (
                <li key={t.slug}>
                  <button
                    className='smart-drop-chip'
                    onClick={() => pickTool(t.slug)}
                    onMouseEnter={() => prefetchToolRoute(t.slug)}
                    onFocus={() => prefetchToolRoute(t.slug)}
                    autoFocus={idx === 0}
                  >
                    <span className='smart-drop-chip-name'>{t.title}</span>
                    {t.description ? (
                      <span className='smart-drop-chip-desc'>{t.description}</span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className='smart-drop-empty'>
              No tool matches this file type yet — try one of our{' '}
              <button className='smart-drop-link' onClick={() => { close(); navigate('/tools') }}>
                1,200+ tools
              </button>.
            </div>
          )}

          <div className='smart-drop-foot'>
            <kbd className='smart-drop-kbd'>Esc</kbd> to cancel
          </div>
        </div>
      )}
    </div>
  )
}
