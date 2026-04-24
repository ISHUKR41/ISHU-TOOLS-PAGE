import { useEffect, useState } from 'react'
import { Heart, Share2, Check, Copy } from 'lucide-react'

const FAV_KEY = 'ishu-tools-favorites-v1'

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

function writeFavorites(slugs: string[]) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(slugs.slice(0, 200)))
  } catch {
    /* quota or disabled — silent */
  }
}

interface ToolActionsProps {
  slug: string
  title: string
  description: string
  url: string
  accent?: string
}

export default function ToolActions({ slug, title, description, url, accent = '#3bd0ff' }: ToolActionsProps) {
  const [isFav, setIsFav] = useState(false)
  const [shared, setShared] = useState<'idle' | 'copied' | 'shared'>('idle')

  useEffect(() => {
    setIsFav(readFavorites().includes(slug))
  }, [slug])

  const toggleFavorite = () => {
    const list = readFavorites()
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list]
    writeFavorites(next)
    setIsFav(next.includes(slug))
  }

  const handleShare = async () => {
    const shareData = { title: `${title} — ISHU TOOLS`, text: description, url }
    try {
      if (navigator.share && typeof navigator.canShare === 'function' ? navigator.canShare(shareData) : Boolean(navigator.share)) {
        await navigator.share(shareData)
        setShared('shared')
        setTimeout(() => setShared('idle'), 2200)
        return
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url)
      setShared('copied')
      setTimeout(() => setShared('idle'), 2200)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  const baseBtn: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 12px',
    borderRadius: 10,
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 140ms ease, background 140ms ease, border-color 140ms ease, color 140ms ease',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(160,190,255,0.18)',
    color: 'rgba(220,235,255,0.85)',
    lineHeight: 1,
  }

  return (
    <div className='tool-actions-row' style={{ display: 'inline-flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
      <button
        type='button'
        onClick={toggleFavorite}
        title={isFav ? 'Remove from favorites' : 'Save to favorites'}
        aria-pressed={isFav}
        style={{
          ...baseBtn,
          background: isFav ? `${accent}1f` : baseBtn.background,
          borderColor: isFav ? `${accent}55` : baseBtn.borderColor,
          color: isFav ? accent : baseBtn.color,
        }}
      >
        <Heart size={14} fill={isFav ? accent : 'transparent'} stroke={isFav ? accent : 'currentColor'} />
        {isFav ? 'Saved' : 'Save'}
      </button>

      <button
        type='button'
        onClick={handleShare}
        title='Share this tool'
        style={{
          ...baseBtn,
          background: shared !== 'idle' ? `${accent}1f` : baseBtn.background,
          borderColor: shared !== 'idle' ? `${accent}55` : baseBtn.borderColor,
          color: shared !== 'idle' ? accent : baseBtn.color,
        }}
      >
        {shared === 'idle' && <Share2 size={14} />}
        {shared === 'copied' && <Check size={14} />}
        {shared === 'shared' && <Check size={14} />}
        {shared === 'idle' ? 'Share' : shared === 'copied' ? 'Link copied' : 'Shared'}
      </button>

      <button
        type='button'
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url)
            setShared('copied')
            setTimeout(() => setShared('idle'), 2000)
          } catch {
            window.prompt('Copy link:', url)
          }
        }}
        title='Copy link'
        style={baseBtn}
      >
        <Copy size={14} />
        Copy link
      </button>
    </div>
  )
}
