import type { CSSProperties } from 'react'
import {
  ArrowRight,
  Files,
  ShieldCheck,
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

const TRUST_BADGES = [
  { icon: Zap, label: 'Instant Processing' },
  { icon: ShieldCheck, label: '100% Private & Secure' },
  { icon: Star, label: 'No Signup Required' },
  { icon: Lock, label: 'No Watermark' },
  { icon: TrendingUp, label: 'Trusted by Millions' },
  { icon: Globe, label: 'Works Everywhere' },
]

export default function HeroSection({
  toolCount,
  categoryCount,
  pdfCount,
  imageCount,
  socialLinks,
}: HeroSectionProps) {
  const toolLabel = toolCount > 0 ? toolCount : 1200

  return (
    <section className='hero-v2'>
      <div className='hero-v2-orb orb-a' />
      <div className='hero-v2-orb orb-b' />
      <div className='hero-v2-orb orb-c' />
      <div className='hero-v2-grid' />

      <div className='hero-v2-inner'>
        <div className='hero-v2-topbar'>
          <div className='hero-status-wrap'>
            <div className='status-badge online'>
              <span className='status-dot-pulse' />
              <span className='status-badge-text'>All systems operational</span>
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
            { label: 'PDF Workflows', value: pdfCount || 128, suffix: '+', color: '#f472b6' },
            { label: 'Image Tools', value: imageCount || 195, suffix: '+', color: '#f59e0b' },
            { label: 'No Signup', value: '0', suffix: '$', color: '#3ee58f' },
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
