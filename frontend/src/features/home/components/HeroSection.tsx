import { motion } from 'framer-motion'
import { ArrowDownRight, Sparkles, Files, ShieldCheck, Images, Server, Cpu, Calculator, Code2 } from 'lucide-react'
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
  { label: 'Live tools', value: String(toolCount), icon: Sparkles },
  { label: 'Categories', value: String(categoryCount), icon: Files },
  { label: 'PDF workflows', value: String(pdfCount), icon: ShieldCheck },
  { label: 'Image workflows', value: String(imageCount), icon: Images },
]

const quickTools = [
  { to: '/tools/merge-pdf', label: 'Merge PDF', icon: Files, color: '#56a6ff' },
  { to: '/tools/compress-image', label: 'Compress Image', icon: Images, color: '#3ee58f' },
  { to: '/tools/json-formatter', label: 'JSON Formatter', icon: Code2, color: '#06b6d4' },
  { to: '/tools/bmi-calculator', label: 'BMI Calculator', icon: Calculator, color: '#f59e0b' },
  { to: '/tools/remove-background', label: 'Remove BG', icon: Cpu, color: '#f472b6' },
  { to: '/tools/password-generator', label: 'Password Gen', icon: ShieldCheck, color: '#f97316' },
]

export default function HeroSection({
  toolCount,
  categoryCount,
  pdfCount,
  imageCount,
  apiReady,
  socialLinks,
}: HeroSectionProps) {
  const toolLabel = toolCount > 0 ? String(toolCount) : '380+'

  return (
    <motion.section
      className='hero-section-full'
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className='hero-glow-orb hero-glow-a' />
      <div className='hero-glow-orb hero-glow-b' />

      <div className='hero-content-center'>
        <span className='hero-kicker'>
          <Server size={14} />
          {toolLabel} free tools · No signup · No watermark · Unlimited
        </span>

        <h1>ISHU TOOLS</h1>
        <p className='hero-fullform'>Indian Student Hub University Tools</p>

        <p className='hero-text'>
          Your go-to platform for students, developers, and professionals.
          Merge PDF, compress images, OCR, remove backgrounds, format JSON,
          calculate BMI, compound interest, and{' '}
          <strong>380+ more tools</strong> — all free, instant, and production-grade.
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
      </div>

      <div className='hero-stat-grid'>
        {stats(toolCount, categoryCount, pdfCount, imageCount).map((item, i) => (
          <motion.article
            key={item.label}
            className='stat-card'
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
          >
            <item.icon size={18} />
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </motion.article>
        ))}
      </div>

      <div className='hero-quick-tools'>
        <span className='hero-quick-label'>Quick access</span>
        <div className='hero-quick-grid'>
          {quickTools.map((tool, i) => (
            <motion.div
              key={tool.to}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
            >
              <Link
                to={tool.to}
                className='hero-quick-card'
                style={{ '--quick-accent': tool.color } as React.CSSProperties}
              >
                <tool.icon size={18} style={{ color: tool.color }} />
                <span>{tool.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
