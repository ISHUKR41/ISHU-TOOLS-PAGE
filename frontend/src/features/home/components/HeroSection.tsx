import { motion } from 'framer-motion'
import { ArrowDownRight, Files, Images, ShieldCheck, Sparkles, Server } from 'lucide-react'
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

const stats = (toolCount: number, categoryCount: number, pdfCount: number, imageCount: number) => [
  {
    label: 'Live tools',
    value: String(toolCount),
    icon: Sparkles,
  },
  {
    label: 'Categories',
    value: String(categoryCount),
    icon: Files,
  },
  {
    label: 'PDF workflows',
    value: String(pdfCount),
    icon: ShieldCheck,
  },
  {
    label: 'Image workflows',
    value: String(imageCount),
    icon: Images,
  },
]

export default function HeroSection({
  toolCount,
  categoryCount,
  pdfCount,
  imageCount,
  apiReady,
  socialLinks,
}: HeroSectionProps) {
  return (
    <section className='hero-shell'>
      <motion.div
        className='hero-copy'
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <span className='hero-kicker'>
          <Server size={14} />
          Python-powered document and image workspace
        </span>

        <h1>ISHU TOOLS</h1>

        <p className='hero-text'>
          Minimal confusion, modern dark UI, smooth loading, dedicated tool pages, and a
          scalable React + FastAPI setup built for real PDF, image, text, and export
          workflows.
        </p>

        <div className='hero-actions'>
          <a href='#tool-directory' className='primary-link-button'>
            Explore all tools
            <ArrowDownRight size={18} />
          </a>
          <Link to='/tools/merge-pdf' className='secondary-link-button'>
            Open Merge PDF
          </Link>
        </div>

        <div className='hero-status-row'>
          <div className={`status-pill ${apiReady ? 'online' : 'offline'}`}>
            <span className='status-dot' />
            {apiReady ? 'Backend online' : 'Backend check pending'}
          </div>
          <div className='social-row compact'>
            {socialLinks.map((link) => (
              <a key={link.href} href={link.href} target='_blank' rel='noreferrer'>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className='hero-stat-grid'>
          {stats(toolCount, categoryCount, pdfCount, imageCount).map((item) => (
            <article key={item.label} className='stat-card'>
              <item.icon size={18} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </motion.div>

      <motion.div
        className='hero-preview'
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.05 }}
      >
        <div className='preview-orbit preview-orbit-a' />
        <div className='preview-orbit preview-orbit-b' />

        <div className='preview-stack'>
          <article className='preview-card accent-blue'>
            <p>PDF stack</p>
            <strong>Merge, split, organize, secure</strong>
            <span>High-clarity workflows for daily file operations.</span>
          </article>

          <article className='preview-card accent-green offset'>
            <p>Image studio</p>
            <strong>Resize, watermark, convert, collage</strong>
            <span>Fast visual edits with output-first actions.</span>
          </article>

          <article className='preview-card accent-pink deep'>
            <p>AI + export</p>
            <strong>Summaries, translation, JSON, CSV</strong>
            <span>Readable outputs for document analysis and sharing.</span>
          </article>
        </div>
      </motion.div>
    </section>
  )
}

