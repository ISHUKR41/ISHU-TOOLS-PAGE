import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FileText, Image, Wand2, Zap, ArrowRight,
  Calculator, Code2, Palette, Lock, BarChart3, Heart, Wifi,
  DollarSign, Video, FileSearch, Type, SlidersHorizontal,
  Star, CheckCircle, TrendingUp, Users, Award, Sparkles,
  ChevronDown, ChevronUp
} from 'lucide-react'

const categories = [
  { id: 'pdf-core', label: 'PDF Tools', desc: 'Merge, split, compress & convert PDFs', icon: FileText, color: '#56a6ff', tools: '11+' },
  { id: 'image-core', label: 'Image Tools', desc: 'Resize, compress, convert & enhance images', icon: Image, color: '#c084fc', tools: '60+' },
  { id: 'ocr-vision', label: 'OCR & Vision', desc: 'Extract text, remove backgrounds, AI tools', icon: FileSearch, color: '#4ade80', tools: '9+' },
  { id: 'text-ops', label: 'Text Tools', desc: 'Word count, summarize, translate & more', icon: Type, color: '#60a5fa', tools: '40+' },
  { id: 'developer-tools', label: 'Developer', desc: 'JSON, base64, minify, regex & more', icon: Code2, color: '#34d399', tools: '75+' },
  { id: 'math-tools', label: 'Math Tools', desc: 'Algebra, statistics, matrices & calculus', icon: Calculator, color: '#f59e0b', tools: '28+' },
  { id: 'security-tools', label: 'Security', desc: 'Password, hash, encrypt & decrypt', icon: Lock, color: '#f87171', tools: '10+' },
  { id: 'color-tools', label: 'Color Tools', desc: 'Color picker, palette generator & converter', icon: Palette, color: '#fb7185', tools: '10+' },
  { id: 'seo-tools', label: 'SEO Tools', desc: 'Meta tags, sitemap, keyword analyzer', icon: BarChart3, color: '#38bdf8', tools: '15+' },
  { id: 'finance-tools', label: 'Finance', desc: 'EMI, GST, currency & tax calculators', icon: DollarSign, color: '#fbbf24', tools: '63+' },
  { id: 'health-tools', label: 'Health', desc: 'BMI, calorie, water & sleep calculators', icon: Heart, color: '#4ade80', tools: '26+' },
  { id: 'network-tools', label: 'Network', desc: 'IP lookup, DNS, WHOIS & SSL checker', icon: Wifi, color: '#818cf8', tools: '13+' },
  { id: 'video-tools', label: 'Video Tools', desc: 'Download videos from YouTube & more', icon: Video, color: '#f87171', tools: '47+' },
  { id: 'productivity', label: 'Productivity', desc: 'Pomodoro, notepad, stopwatch & more', icon: Zap, color: '#34d399', tools: '32+' },
  { id: 'student-tools', label: 'Student Tools', desc: 'CGPA, percentages, GK quiz & more', icon: SlidersHorizontal, color: '#a78bfa', tools: '70+' },
  { id: 'batch-automation', label: 'Batch Tools', desc: 'Process multiple files at once', icon: Wand2, color: '#f59e0b', tools: '6+' },
]

const stats = [
  { value: '1200+', label: 'Free Tools', icon: Sparkles },
  { value: '1M+', label: 'Happy Users', icon: Users },
  { value: '10M+', label: 'Files Processed', icon: TrendingUp },
  { value: '100%', label: 'Always Free', icon: Award },
]

const whyUs = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Sub-second processing for most tools — no lag, no waiting.' },
  { icon: '🔒', title: 'Privacy First', desc: 'Files deleted immediately after processing. Zero data retention, guaranteed.' },
  { icon: '🚫', title: 'No Signup', desc: 'Every single tool is free with zero registration or account needed.' },
  { icon: '📱', title: 'Works Everywhere', desc: 'Mobile, tablet, laptop — perfect layout on any screen size.' },
  { icon: '🌐', title: 'No Watermark', desc: 'Clean, professional output every time. What you get is exactly what you made.' },
  { icon: '♾️', title: 'Unlimited Use', desc: 'No daily limits, no file quota, no premium plans required — ever.' },
]

const popularTools = [
  { slug: 'compress-pdf', label: 'Compress PDF', icon: '📄', color: '#56a6ff' },
  { slug: 'merge-pdf', label: 'Merge PDF', icon: '📑', color: '#56a6ff' },
  { slug: 'pdf-to-word', label: 'PDF to Word', icon: '📝', color: '#56a6ff' },
  { slug: 'word-to-pdf', label: 'Word to PDF', icon: '📋', color: '#56a6ff' },
  { slug: 'compress-image', label: 'Compress Image', icon: '🖼️', color: '#c084fc' },
  { slug: 'remove-background', label: 'Remove BG', icon: '✂️', color: '#c084fc' },
  { slug: 'resize-image', label: 'Resize Image', icon: '📐', color: '#c084fc' },
  { slug: 'image-to-text', label: 'Image to Text', icon: '🔤', color: '#4ade80' },
  { slug: 'json-formatter', label: 'JSON Formatter', icon: '{ }', color: '#34d399' },
  { slug: 'qr-code-generator', label: 'QR Generator', icon: '⬛', color: '#34d399' },
  { slug: 'password-generator', label: 'Password Gen', icon: '🔑', color: '#f87171' },
  { slug: 'bmi-calculator', label: 'BMI Calculator', icon: '⚖️', color: '#4ade80' },
  { slug: 'emi-calculator-advanced', label: 'EMI Calculator', icon: '💰', color: '#fbbf24' },
  { slug: 'gst-calculator-india', label: 'GST Calculator', icon: '🧾', color: '#fbbf24' },
  { slug: 'compress-to-100kb', label: 'Compress to 100KB', icon: '📦', color: '#c084fc' },
  { slug: 'base64-encode', label: 'Base64 Encoder', icon: '🔢', color: '#34d399' },
  { slug: 'word-counter', label: 'Word Counter', icon: '📊', color: '#60a5fa' },
  { slug: 'scientific-calculator', label: 'Scientific Calc', icon: '🔬', color: '#f59e0b' },
  { slug: 'url-encoder', label: 'URL Encoder', icon: '🔗', color: '#34d399' },
  { slug: 'uuid-generator', label: 'UUID Generator', icon: '🆔', color: '#34d399' },
]

const comparisons = [
  { feature: 'Completely Free', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
  { feature: 'No Signup Required', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
  { feature: 'No Watermark', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
  { feature: 'No File Size Limit', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
  { feature: '1200+ Tools', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
  { feature: 'Indian Gov. Form Tools', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
  { feature: 'UPI QR Generator', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
  { feature: 'GST & EMI Calculators', ishu: true, ilovepdf: false, smallpdf: false, canva: false },
]

const homeFaqs = [
  { q: 'What is ISHU TOOLS?', a: 'ISHU TOOLS (Indian Student Hub University Tools) is a free online platform with 1200+ tools for PDF processing, image editing, developer utilities, math calculators, text operations, and AI-powered features. Created by Ishu Kumar (IIT Patna student), it is designed for Indian students and professionals — no signup, no watermark, completely free.' },
  { q: 'Is ISHU TOOLS completely free?', a: 'Yes! ISHU TOOLS is 100% free. All 1200+ tools are available without any signup, registration, or payment. No watermarks, no daily limits, no hidden charges. Free forever — that\'s the ISHU promise.' },
  { q: 'Who created ISHU TOOLS?', a: 'ISHU TOOLS was created by Ishu Kumar, a student at IIT Patna (Indian Institute of Technology Patna). The full form is Indian Student Hub University Tools. Ishu Kumar built this platform to provide free tools to Indian students and professionals.' },
  { q: 'Can I use ISHU TOOLS for government exam photo resizing?', a: 'Yes! ISHU TOOLS has specialized tools for Indian government exam portals — compress photo to specific KB sizes for SSC CGL, UPSC, RRB NTPC, IBPS PO, SBI PO, NEET, JEE and all other competitive exams. All photo size requirements are supported.' },
  { q: 'Is ISHU TOOLS better than iLovePDF or SmallPDF?', a: 'ISHU TOOLS offers all the same core PDF features as iLovePDF and SmallPDF — completely free, with no signup, no watermark, and no file limits. Plus, ISHU TOOLS has 1200+ additional tools including Indian-specific calculators (SIP, EMI, GST), UPI QR Generator, CGPA Converter, and government exam photo resizers.' },
  { q: 'Can I install ISHU TOOLS as an app?', a: 'Yes! ISHU TOOLS is a Progressive Web App (PWA). You can install it on your phone or desktop like a native app. On mobile, tap the browser menu and select "Add to Home Screen". On desktop, click the install icon in the browser address bar.' },
  { q: 'ISHU TOOLS ka full form kya hai?', a: 'ISHU TOOLS ka full form hai: Indian Student Hub University Tools. Yeh ek free online platform hai jisme 1200+ tools hain — PDF, image, calculator, developer aur student tools ke liye. Ise Ishu Kumar ne banaya hai jo IIT Patna ke student hain. Bilkul free, koi signup nahi, koi watermark nahi.' },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(v => !v)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${open ? 'rgba(59,208,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 12,
        padding: '18px 22px',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.5, color: 'var(--text)' }}>{q}</span>
        {open ? <ChevronUp size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />}
      </div>
      {open && (
        <p style={{ margin: '14px 0 0', fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>{a}</p>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '80px 24px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,208,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -40, right: '8%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(59,208,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 20 }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 20px', borderRadius: 100,
            border: '1px solid rgba(59,208,255,0.35)',
            background: 'rgba(59,208,255,0.08)',
            fontSize: 13, fontWeight: 700, color: 'var(--accent)',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            <Star size={12} fill="currentColor" /> 1200+ Tools • 100% Free • No Signup
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            fontWeight: 900, fontFamily: 'var(--font-display)',
            lineHeight: 1.05, marginBottom: 8,
            background: 'linear-gradient(135deg, #ffffff 0%, var(--accent) 45%, #a855f7 85%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.04em',
          }}
        >
          ISHU TOOLS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 }}
        >
          Indian Student Hub University Tools
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)', color: 'var(--muted)', maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.75 }}
        >
          The <strong style={{ color: 'var(--text)' }}>#1 free online toolkit</strong> for Indian students &amp; professionals.
          PDF, image, developer, math, text, AI, finance, health tools — all in one place.
          No limits. No signup. No watermark.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}
        >
          <Link to="/tools" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '15px 36px', borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), #6366f1)',
            color: '#fff', fontWeight: 800, fontSize: 16,
            boxShadow: '0 8px 32px rgba(59,208,255,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(59,208,255,0.4)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(59,208,255,0.3)' }}
          >
            Explore All 1200+ Tools <ArrowRight size={18} />
          </Link>
          <a href="#categories" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '15px 30px', borderRadius: 12,
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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap', maxWidth: 760, margin: '0 auto' }}
        >
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} style={{
                flex: '1 1 160px', textAlign: 'center', padding: '22px 16px',
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <Icon size={18} style={{ color: 'var(--accent)', marginBottom: 8, opacity: 0.8 }} />
                <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: 'var(--accent)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
              </div>
            )
          })}
        </motion.div>
      </section>

      {/* ── POPULAR TOOLS ── */}
      <section style={{ padding: '56px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, marginBottom: 10, fontFamily: 'var(--font-display)' }}>
              🔥 Most Popular Tools
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 15 }}>Quick access to the most used tools on ISHU TOOLS</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}
          >
            {popularTools.map((t, i) => (
              <motion.div
                key={t.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
              >
                <Link
                  to={`/tools/${t.slug}`}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '16px 12px', borderRadius: 12, textAlign: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    textDecoration: 'none', color: 'var(--text)',
                    transition: 'all 0.2s',
                    fontSize: 13, fontWeight: 600,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = `${t.color}10`
                    el.style.borderColor = `${t.color}40`
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.03)'
                    el.style.borderColor = 'rgba(255,255,255,0.08)'
                    el.style.transform = ''
                  }}
                >
                  <span style={{ fontSize: 22 }}>{t.icon}</span>
                  <span>{t.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeUp} style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/tools" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--muted-strong)', fontWeight: 600, fontSize: 14,
            }}>
              View All 1200+ Tools <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ── */}
      <section id="categories" style={{ padding: '64px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)' }}>Browse by Category</h2>
          <p style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 560, margin: '0 auto' }}>
            53 categories, 1200+ tools — everything you need, completely free
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
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
                    display: 'block', padding: '22px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    transition: 'all 0.2s',
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
                    marginBottom: 16,
                  }}>
                    <Icon size={22} style={{ color: cat.color }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 5 }}>{cat.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{cat.desc}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: cat.color, background: `${cat.color}15`, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                        {cat.tools}
                      </span>
                      <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.22)' }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)' }}>
              ISHU TOOLS vs The Competition
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 16 }}>
              The only platform that gives you everything — for free, always
            </p>
          </motion.div>

          <motion.div {...fadeUp}>
            <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 700, color: 'var(--muted)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>Feature</th>
                    <th style={{ textAlign: 'center', padding: '16px 20px', fontWeight: 800, color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>ISHU TOOLS</th>
                    <th style={{ textAlign: 'center', padding: '16px 20px', fontWeight: 600, color: 'var(--muted)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>iLovePDF</th>
                    <th style={{ textAlign: 'center', padding: '16px 20px', fontWeight: 600, color: 'var(--muted)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>SmallPDF</th>
                    <th style={{ textAlign: 'center', padding: '16px 20px', fontWeight: 600, color: 'var(--muted)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>Canva</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < comparisons.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)' }}>{row.feature}</td>
                      <td style={{ textAlign: 'center', padding: '14px 20px' }}>
                        <CheckCircle size={18} style={{ color: '#4ade80' }} />
                      </td>
                      {[row.ilovepdf, row.smallpdf, row.canva].map((val, j) => (
                        <td key={j} style={{ textAlign: 'center', padding: '14px 20px' }}>
                          {val
                            ? <CheckCircle size={18} style={{ color: '#4ade80' }} />
                            : <span style={{ color: 'var(--danger)', fontSize: 16, fontWeight: 700 }}>✗</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY ISHU TOOLS ── */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)' }}>Why ISHU TOOLS?</h2>
            <p style={{ color: 'var(--muted)', fontSize: 17 }}>Built for people, not profit — made with love by an IIT Patna student</p>
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
                  display: 'flex', gap: 16, padding: '22px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT THE CREATOR ── */}
      <section style={{ padding: '56px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.div {...fadeUp}>
            <div style={{
              padding: '44px 40px',
              background: 'linear-gradient(135deg, rgba(59,208,255,0.07), rgba(139,92,246,0.07))',
              border: '1px solid rgba(59,208,255,0.18)',
              borderRadius: 20,
            }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>👨‍💻</div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)' }}>
                Created by Ishu Kumar
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 20 }}>
                ISHU TOOLS was built by <strong style={{ color: 'var(--text)' }}>Ishu Kumar</strong>, a student at{' '}
                <strong style={{ color: 'var(--accent)' }}>IIT Patna (Indian Institute of Technology Patna)</strong>.
                The mission is simple: give every Indian student and professional access to powerful tools —
                for free, without any barriers.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ishu-kumar-5a0940281/' },
                  { label: 'Instagram @ishukr10', href: 'https://www.instagram.com/ishukr10' },
                  { label: 'YouTube @ishu-fun', href: 'https://www.youtube.com/@ishu-fun' },
                  { label: 'X @ISHU_IITP', href: 'https://x.com/ISHU_IITP' },
                ].map(social => (
                  <a key={social.href} href={social.href} target="_blank" rel="noreferrer" style={{
                    padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                    background: 'rgba(59,208,255,0.1)', border: '1px solid rgba(59,208,255,0.25)',
                    color: 'var(--accent)', transition: 'background 0.2s',
                  }}>{social.label}</a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SEO CONTENT ── */}
      <section style={{ padding: '56px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.div {...fadeUp}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 20, fontFamily: 'var(--font-display)' }}>
              India's Best Free Online Tool Platform
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {[
                { title: 'PDF Tools — Merge, Split, Compress', desc: 'Professional-grade PDF tools completely free. Merge multiple PDFs, split large documents, compress file sizes, convert between formats. No watermark, no signup required. Better than iLovePDF and SmallPDF.', link: '/category/pdf-core' },
                { title: 'Image Tools — Compress, Resize, Convert', desc: 'Advanced image processing tools for free. Compress images without quality loss, resize to exact dimensions, remove backgrounds with AI, convert formats. Best free alternative to iLoveIMG.', link: '/category/image-core' },
                { title: 'Indian Student Tools — CGPA, SSC, UPSC', desc: 'Specialized tools for Indian students. Compress photos for government exam applications, CGPA to percentage converter, attendance calculator, SIP and EMI calculators in Indian Rupees.', link: '/category/student-tools' },
                { title: 'Developer Tools — JSON, Base64, UUID', desc: 'Essential developer utilities for web developers. JSON formatter, Base64 encoder/decoder, URL encoder, UUID generator, regex tester, JWT decoder, hash generator and more.', link: '/category/developer-tools' },
                { title: 'Finance Calculators — SIP, EMI, GST India', desc: 'Free Indian finance calculators. Calculate SIP returns, EMI for home/car loans, GST amounts, income tax, compound interest. All calculations in Indian Rupees (INR).', link: '/category/finance-tools' },
                { title: 'Health Tools — BMI, Calorie, BMR Calculator', desc: 'Free health and fitness calculators. BMI calculator for Indians, calorie counter, BMR calculator, water intake calculator, sleep calculator, ideal body weight calculator.', link: '/category/health-tools' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>
                    <Link to={item.link} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</Link>
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 16 }}>Everything you need to know about ISHU TOOLS</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {homeFaqs.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </motion.div>
        </div>
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
            background: 'linear-gradient(135deg, rgba(59,208,255,0.12), rgba(139,92,246,0.12))',
            border: '1px solid rgba(59,208,255,0.22)',
            borderRadius: 24,
            boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)' }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 17, marginBottom: 32, lineHeight: 1.7 }}>
            Join over 1 million users who trust ISHU TOOLS every day. No account, no credit card, no limits. Free forever.
          </p>
          <Link to="/tools" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 40px', borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), #818cf8)',
            color: '#fff', fontWeight: 800, fontSize: 17,
            boxShadow: '0 8px 32px rgba(59,208,255,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(59,208,255,0.4)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(59,208,255,0.3)' }}
          >
            Start Using Free Tools <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* ── HOME FOOTER NOTE ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>
            © {new Date().getFullYear()} <strong style={{ color: 'var(--text)' }}>ISHU TOOLS</strong> (Indian Student Hub University Tools) — Created by Ishu Kumar (IIT Patna)
          </p>
          <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 13, marginBottom: 16 }}>
            Free online tools for PDF, image, text, developer, math, health, finance, SEO, security, video, productivity &amp; more
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            {[
              { to: '/category/pdf-core', label: 'PDF Tools' },
              { to: '/category/image-core', label: 'Image Tools' },
              { to: '/category/text-ops', label: 'Text Tools' },
              { to: '/category/developer-tools', label: 'Developer Tools' },
              { to: '/category/math-tools', label: 'Calculators' },
              { to: '/category/student-tools', label: 'Student Tools' },
              { to: '/category/finance-tools', label: 'Finance' },
              { to: '/category/health-tools', label: 'Health' },
            ].map(link => (
              <Link key={link.to} to={link.to} style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
