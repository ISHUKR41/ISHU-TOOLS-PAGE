import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Files,
  ShieldCheck,
  Images,
  Code2,
  Calculator,
  Search,
  Zap,
  Globe,
  Star,
  TrendingUp,
  Lock,
} from 'lucide-react'
import { Link } from 'react-router-dom'

type SocialLink = {
  label: string
  href: string
}

type HeroSectionProps = {
  toolCount: number
  categoryCount: number
  pdfCount: number
  imageCount: number
  apiReady: boolean
  socialLinks: SocialLink[]
}

const TICKER_ITEMS = [
  'Merge PDF',
  'Compress Images',
  'OCR PDF',
  'Remove Background',
  'JSON Formatter',
  'BMI Calculator',
  'Translate PDF',
  'QR Code Generator',
  'Password Generator',
  'Resize Image',
  'Word to PDF',
  'PDF to Excel',
  'Barcode Generator',
  'Base64 Encoder',
  'Summarize PDF',
  'Color Picker',
  'UUID Generator',
]

const QUICK_TOOLS = [
  { to: '/tools/merge-pdf', label: 'Merge PDF', icon: Files, color: '#56a6ff' },
  { to: '/tools/compress-image', label: 'Compress Image', icon: Images, color: '#3ee58f' },
  { to: '/tools/remove-background', label: 'Remove BG', icon: Sparkles, color: '#f472b6' },
  { to: '/tools/json-formatter', label: 'JSON Formatter', icon: Code2, color: '#06b6d4' },
  { to: '/tools/bmi-calculator', label: 'BMI Calculator', icon: Calculator, color: '#f59e0b' },
  { to: '/tools/password-generator', label: 'Password Gen', icon: ShieldCheck, color: '#f97316' },
  { to: '/tools/ocr-pdf', label: 'OCR PDF', icon: Search, color: '#a78bfa' },
  { to: '/tools/qr-code-generator', label: 'QR Generator', icon: Globe, color: '#22d3ee' },
]

const TRUST_BADGES = [
  { icon: Zap, label: 'Instant Processing' },
  { icon: ShieldCheck, label: '100% Private & Secure' },
  { icon: Star, label: 'No Signup Required' },
  { icon: Lock, label: 'No Watermark' },
  { icon: TrendingUp, label: 'Trusted by Millions' },
  { icon: Globe, label: 'Works Everywhere' },
]

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<boolean>(false)

  useEffect(() => {
    if (ref.current || target === 0) return
    ref.current = true
    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return <>{count}</>
}

function TickerRow() {
  const controls = useAnimationControls()
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  useEffect(() => {
    void controls.start({
      x: [0, -50 * TICKER_ITEMS.length],
      transition: {
        x: {
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    })
  }, [controls])

  return (
    <div className='ticker-wrap'>
      <motion.div className='ticker-track' animate={controls}>
        {items.map((item, i) => (
          <span key={i} className='ticker-item'>
            <Sparkles size={10} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function HeroSection({
  toolCount,
  categoryCount,
  pdfCount,
  imageCount,
  apiReady,
  socialLinks,
}: HeroSectionProps) {
  const toolLabel = toolCount > 0 ? toolCount : 441

  return (
    <motion.section
      className='hero-v2'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background orbs */}
      <div className='hero-v2-orb orb-a' />
      <div className='hero-v2-orb orb-b' />
      <div className='hero-v2-orb orb-c' />

      {/* Grid pattern overlay */}
      <div className='hero-v2-grid' />

      <div className='hero-v2-inner'>
        {/* Status + social bar */}
        <motion.div
          className='hero-v2-topbar'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={`status-badge ${apiReady ? 'online' : 'loading'}`}>
            <span className='status-dot-pulse' />
            {apiReady ? 'All systems operational' : 'Starting up…'}
          </div>
          <div className='hero-v2-social'>
            {socialLinks.map((link) => (
              <a key={link.href} href={link.href} target='_blank' rel='noreferrer' className='social-chip'>
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          className='hero-v2-heading'
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <div className='hero-kicker-pill'>
            <Sparkles size={13} />
            <span>Indian Student Hub University Tools</span>
          </div>

          <h1 className='hero-v2-title'>
            <span className='hero-title-line'>ISHU</span>
            <span className='hero-title-line accent-gradient'> TOOLS</span>
          </h1>

          <p className='hero-v2-subtitle'>
            Your ultimate free toolkit — <strong>{toolLabel}+</strong> professional-grade tools for
            PDF, images, code, math, text &amp; AI. No signup. No watermark. No limits.
          </p>

          <div className='hero-v2-actions'>
            <a href='#tool-directory' className='btn-primary-hero'>
              Explore {toolLabel}+ Tools
              <ArrowRight size={17} />
            </a>
            <Link to='/tools/merge-pdf' className='btn-secondary-hero'>
              <Files size={16} />
              Try Merge PDF
            </Link>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          className='hero-v2-stats'
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {[
            { label: 'Free Tools', value: toolLabel, suffix: '+', color: '#56a6ff' },
            { label: 'Categories', value: categoryCount || 35, suffix: '', color: '#3ee58f' },
            { label: 'PDF Workflows', value: pdfCount || 120, suffix: '+', color: '#f472b6' },
            { label: 'Image Tools', value: imageCount || 80, suffix: '+', color: '#f59e0b' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className='hero-stat-card'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              style={{ '--stat-color': stat.color } as React.CSSProperties}
            >
              <strong className='stat-number'>
                <AnimatedCounter target={stat.value} duration={1800 + i * 200} />
                {stat.suffix}
              </strong>
              <span className='stat-label'>{stat.label}</span>
              <div className='stat-glow' />
            </motion.div>
          ))}
        </motion.div>

        {/* Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <TickerRow />
        </motion.div>

        {/* Quick access tools */}
        <motion.div
          className='hero-v2-quick'
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <span className='quick-label'>⚡ Popular right now</span>
          <div className='quick-grid'>
            {QUICK_TOOLS.map((tool, i) => (
              <motion.div
                key={tool.to}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.04 }}
              >
                <Link
                  to={tool.to}
                  className='quick-chip'
                  style={{ '--chip-color': tool.color } as React.CSSProperties}
                >
                  <tool.icon size={14} style={{ color: tool.color }} />
                  {tool.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className='trust-row'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
        >
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className='trust-badge'>
              <badge.icon size={13} />
              <span>{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
