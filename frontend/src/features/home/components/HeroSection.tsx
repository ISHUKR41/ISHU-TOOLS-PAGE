import type { CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
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
  Wand2,
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
  'Merge PDF', 'Compress Images', 'OCR PDF', 'Remove Background', 'JSON Formatter',
  'BMI Calculator', 'Translate PDF', 'QR Code Generator', 'Password Generator', 'Resize Image',
  'Word to PDF', 'PDF to Excel', 'Barcode Generator', 'Base64 Encoder', 'Summarize PDF',
  'Color Picker', 'UUID Generator', 'Compress PDF', 'Split PDF', 'Image to PDF',
  'YouTube Downloader', 'CGPA Calculator', 'Attendance Tracker', 'Citation Generator',
  'Regex Tester', 'CSV to JSON', 'SVG Optimizer', 'HTML Beautifier', 'Markdown Editor',
  'Text Summarizer', 'Grammar Checker', 'Loan Calculator', 'Percentage Calculator',
  'Age Calculator', 'Time Zone Converter', 'Case Converter', 'Diff Checker', 'IP Lookup',
  'Hash Generator', 'Instagram Downloader', 'Photo Collage Maker', 'SIP Calculator',
  'Meme Generator', 'PDF Annotator', 'Image Compressor', 'CSS Minifier', 'SQL Formatter',
  'EMI Calculator', 'GST Calculator', 'Unit Converter', 'Plagiarism Checker', 'Resume Builder',
]

const QUICK_TOOLS = [
  { to: '/tools/merge-pdf', label: 'Merge PDF', icon: Files, color: '#56a6ff' },
  { to: '/tools/compress-image', label: 'Compress Image', icon: Images, color: '#3ee58f' },
  { to: '/tools/remove-background', label: 'Remove BG', icon: Wand2, color: '#f472b6' },
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

function TickerRow() {
  const reduceMotion = useReducedMotion()
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className='ticker-wrap'>
      <div
        className='ticker-track'
        style={reduceMotion ? { animation: 'none' } : undefined}
      >
        {items.map((item, i) => (
          <span key={i} className='ticker-item'>
            <Wand2 size={10} />
            {item}
          </span>
        ))}
      </div>
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
  const toolLabel = toolCount > 0 ? toolCount : 770

  return (
    <section className='hero-v2'>
      <div className='hero-v2-orb orb-a' />
      <div className='hero-v2-orb orb-b' />
      <div className='hero-v2-orb orb-c' />
      <div className='hero-v2-grid' />

      <div className='hero-v2-inner'>
        <div className='hero-v2-topbar'>
          <div className='hero-status-wrap'>
            <div className={`status-badge ${apiReady ? 'online' : 'loading'}`}>
              <span className='status-dot-pulse' />
              <span className='status-badge-text'>
                {apiReady ? 'All systems operational' : 'Starting up\u2026'}
              </span>
            </div>
          </div>
          <div className='hero-v2-social'>
            {socialLinks.map((link) => (
              <a key={link.href} href={link.href} target='_blank' rel='noreferrer' className='social-chip'>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className='hero-v2-heading'>
          <div className='hero-kicker-pill'>
            <span>Indian Student Hub University Tools</span>
          </div>

          <h1 className='hero-v2-title'>
            <span className='hero-title-line'>ISHU</span>
            <span className='hero-title-line accent-gradient'> TOOLS</span>
          </h1>

          <p className='hero-v2-subtitle'>
            Your ultimate free toolkit — <strong>{toolLabel}+</strong> professional-grade tools for
            PDF, images, code, math, text, AI, finance &amp; health. No signup. No watermark. No limits.
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
        </div>

        <div className='hero-v2-stats'>
          {[
            { label: 'Free Tools', value: toolLabel, suffix: '+', color: '#56a6ff' },
            { label: 'Categories', value: categoryCount || 38, suffix: '', color: '#3ee58f' },
            { label: 'PDF Workflows', value: pdfCount || 128, suffix: '+', color: '#f472b6' },
            { label: 'Image Tools', value: imageCount || 195, suffix: '+', color: '#f59e0b' },
          ].map((stat) => (
            <div
              key={stat.label}
              className='hero-stat-card'
              style={{ '--stat-color': stat.color } as CSSProperties}
            >
              <strong className='stat-number'>
                {stat.value}{stat.suffix}
              </strong>
              <span className='stat-label'>{stat.label}</span>
              <div className='stat-glow' />
            </div>
          ))}
        </div>

        <TickerRow />

        <div className='hero-v2-quick'>
          <span className='quick-label'>Popular right now</span>
          <div className='quick-grid'>
            {QUICK_TOOLS.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className='quick-chip'
                style={{ '--chip-color': tool.color } as CSSProperties}
              >
                <tool.icon size={14} style={{ color: tool.color }} />
                {tool.label}
              </Link>
            ))}
          </div>
        </div>

        <div className='trust-row'>
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className='trust-badge'>
              <badge.icon size={13} />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
