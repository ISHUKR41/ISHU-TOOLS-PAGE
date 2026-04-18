import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FileText, Image, Wand2, Zap, Shield, Globe, ArrowRight,
  Calculator, Code2, Palette, Lock, BarChart3, Heart, Wifi,
  DollarSign, Video, FileSearch, Type, SlidersHorizontal
} from 'lucide-react'

const categories = [
  { id: 'pdf-core', label: 'PDF Tools', desc: 'Merge, split, compress & convert PDFs', icon: FileText, color: '#56a6ff', tools: '80+' },
  { id: 'image-core', label: 'Image Tools', desc: 'Resize, compress, convert & enhance images', icon: Image, color: '#c084fc', tools: '70+' },
  { id: 'ocr-vision', label: 'OCR & Vision', desc: 'Extract text, remove backgrounds, AI tools', icon: FileSearch, color: '#4ade80', tools: '20+' },
  { id: 'text-ops', label: 'Text Tools', desc: 'Word count, summarize, translate & more', icon: Type, color: '#60a5fa', tools: '30+' },
  { id: 'developer-tools', label: 'Developer', desc: 'JSON, base64, minify, regex & more', icon: Code2, color: '#34d399', tools: '50+' },
  { id: 'math-tools', label: 'Math Tools', desc: 'Algebra, statistics, matrices & calculus', icon: Calculator, color: '#f59e0b', tools: '20+' },
  { id: 'security-tools', label: 'Security', desc: 'Password, hash, encrypt & decrypt', icon: Lock, color: '#f87171', tools: '15+' },
  { id: 'color-tools', label: 'Color Tools', desc: 'Color picker, palette generator & converter', icon: Palette, color: '#fb7185', tools: '10+' },
  { id: 'seo-tools', label: 'SEO Tools', desc: 'Meta tags, sitemap, keyword analyzer', icon: BarChart3, color: '#38bdf8', tools: '15+' },
  { id: 'finance-tools', label: 'Finance', desc: 'EMI, GST, currency & tax calculators', icon: DollarSign, color: '#fbbf24', tools: '10+' },
  { id: 'health-tools', label: 'Health', desc: 'BMI, calorie, water & sleep calculators', icon: Heart, color: '#4ade80', tools: '10+' },
  { id: 'network-tools', label: 'Network', desc: 'IP lookup, DNS, WHOIS & SSL checker', icon: Wifi, color: '#818cf8', tools: '8+' },
  { id: 'video-tools', label: 'Video Tools', desc: 'Download videos from YouTube & more', icon: Video, color: '#f87171', tools: '5+' },
  { id: 'productivity', label: 'Productivity', desc: 'Pomodoro, notepad, stopwatch & more', icon: Zap, color: '#34d399', tools: '10+' },
  { id: 'student-tools', label: 'Student Tools', desc: 'CGPA, percentages, GK quiz & more', icon: SlidersHorizontal, color: '#a78bfa', tools: '20+' },
  { id: 'batch-automation', label: 'Batch Tools', desc: 'Process multiple files at once', icon: Wand2, color: '#f59e0b', tools: '15+' },
]

const stats = [
  { value: '563+', label: 'Free Tools' },
  { value: '1M+', label: 'Happy Users' },
  { value: '10M+', label: 'Files Processed' },
  { value: '100%', label: 'Always Free' },
]

const whyUs = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Sub-second processing for most tools — no lag, no waiting.' },
  { icon: '🔒', title: 'Privacy First', desc: 'Files are deleted immediately after processing. Zero retention.' },
  { icon: '🚫', title: 'No Signup', desc: 'Use every single tool for free with zero registration.' },
  { icon: '📱', title: 'Works Everywhere', desc: 'Mobile, tablet, laptop — perfect on any screen size.' },
  { icon: '🌐', title: 'No Watermark', desc: 'Clean, professional output every time. What you see is what you get.' },
  { icon: '♾️', title: 'Unlimited Use', desc: 'No daily limits, no quota, no premium plans required.' },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export default function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '80px 24px 64px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative glow orbs */}
        <div style={{ position: 'absolute', top: -80, left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,208,255,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -40, right: '8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 20 }}
        >
          <span style={{
            display: 'inline-block',
            padding: '6px 18px',
            borderRadius: 100,
            border: '1px solid rgba(59,208,255,0.3)',
            background: 'rgba(59,208,255,0.08)',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            563+ Tools • 100% Free • No Signup
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 900,
            fontFamily: 'var(--font-display)',
            lineHeight: 1.08,
            marginBottom: 20,
            background: 'linear-gradient(135deg, #ffffff 0%, var(--accent) 40%, #a855f7 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
          }}
        >
          ISHU TOOLS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--muted)', maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.7 }}
        >
          The <strong style={{ color: 'var(--text)' }}>free online toolkit</strong> trusted by millions. PDF, image, developer, math, text, AI tools — and much more. No limits, no signup.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}
        >
          <Link to="/tools" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), #6366f1)',
            color: '#fff', fontWeight: 700, fontSize: 16,
            boxShadow: '0 8px 32px rgba(59,208,255,0.25)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(59,208,255,0.35)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(59,208,255,0.25)' }}
          >
            Explore All Tools <ArrowRight size={18} />
          </Link>
          <a href="#categories" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--text)', fontWeight: 600, fontSize: 16,
            transition: 'background 0.2s, border-color 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.28)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)' }}
          >
            Browse Categories
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap', maxWidth: 700, margin: '0 auto' }}
        >
          {stats.map((s, i) => (
            <div key={i} style={{
              flex: '1 1 150px', textAlign: 'center', padding: '20px 16px',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--accent)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── CATEGORIES GRID ── */}
      <section id="categories" style={{ padding: '64px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)' }}>Browse by Category</h2>
          <p style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
            38 categories, 563+ tools — everything you need in one place
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.5) }}
              >
                <Link
                  to={`/category/${cat.id}`}
                  style={{
                    display: 'block', padding: '22px 22px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    transition: 'background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                    textDecoration: 'none', color: 'inherit',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = `${cat.color}08`
                    el.style.borderColor = `${cat.color}35`
                    el.style.transform = 'translateY(-3px)'
                    el.style.boxShadow = `0 12px 32px ${cat.color}14`
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.03)'
                    el.style.borderColor = 'rgba(255,255,255,0.08)'
                    el.style.transform = ''
                    el.style.boxShadow = ''
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${cat.color}18`, border: `1px solid ${cat.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16, flexShrink: 0,
                  }}>
                    <Icon size={22} style={{ color: cat.color }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 5, color: 'var(--text)' }}>{cat.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{cat.desc}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: cat.color, background: `${cat.color}15`, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                        {cat.tools}
                      </span>
                      <ArrowRight size={15} style={{ color: 'rgba(255,255,255,0.25)' }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.div {...fadeUp} style={{ textAlign: 'center', marginTop: 36 }}>
          <Link to="/tools" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--muted-strong)', fontWeight: 600, fontSize: 15,
          }}>
            View All 563+ Tools <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ── WHY ISHU TOOLS ── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)' }}>Why ISHU TOOLS?</h2>
            <p style={{ color: 'var(--muted)', fontSize: 17 }}>Built for people, not profit</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  display: 'flex', gap: 16, padding: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 5 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR TOOLS QUICK LINKS ── */}
      <section style={{ padding: '64px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, marginBottom: 10, fontFamily: 'var(--font-display)' }}>
            Popular Tools
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>Quick access to the most used tools</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}
        >
          {[
            'compress-pdf', 'merge-pdf', 'pdf-to-jpg', 'jpg-to-pdf', 'remove-background',
            'resize-image', 'compress-image', 'image-to-text', 'word-counter', 'character-counter',
            'json-formatter', 'password-generator', 'ip-address-lookup', 'emi-calculator-advanced',
            'gst-calculator-india', 'calorie-calculator', 'qr-code-generator', 'color-picker',
            'grammar-checker', 'plagiarism-checker', 'currency-converter', 'base64-encoder',
          ].map(slug => (
            <Link
              key={slug}
              to={`/tools/${slug}`}
              style={{
                padding: '8px 16px', borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: 13, fontWeight: 600,
                color: 'var(--muted-strong)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(59,208,255,0.1)'
                el.style.borderColor = 'rgba(59,208,255,0.3)'
                el.style.color = 'var(--accent)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(255,255,255,0.05)'
                el.style.borderColor = 'rgba(255,255,255,0.1)'
                el.style.color = 'var(--muted-strong)'
              }}
            >
              {slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </Link>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '48px 24px 80px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 760, margin: '0 auto', textAlign: 'center',
            padding: '52px 40px',
            background: 'linear-gradient(135deg, rgba(59,208,255,0.1), rgba(139,92,246,0.1))',
            border: '1px solid rgba(59,208,255,0.2)',
            borderRadius: 24,
            boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)' }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 17, marginBottom: 32, lineHeight: 1.7 }}>
            Join over 1 million users who use ISHU TOOLS every day for free. No account, no credit card, no limits.
          </p>
          <Link to="/tools" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '15px 36px', borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), #818cf8)',
            color: '#fff', fontWeight: 800, fontSize: 17,
            boxShadow: '0 8px 32px rgba(59,208,255,0.3)',
          }}>
            Start Using Free Tools <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>
            © {new Date().getFullYear()} <strong style={{ color: 'var(--text)' }}>ISHU TOOLS</strong> (Indian Student Hub University Tools) — All Rights Reserved
          </p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
            Free online tools for PDF, image, text, developer, math, health, finance & more
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 18, flexWrap: 'wrap' }}>
            {['PDF Tools', 'Image Tools', 'Text Tools', 'Developer Tools', 'Calculator'].map(label => (
              <Link key={label} to="/tools" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
