import { useEffect, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FileText, Image, Zap, Code2, ChevronDown, Calculator, Globe, Shield, Layers, ArrowUp } from 'lucide-react'
import AnimatedBackdrop from './AnimatedBackdrop'

type NavCategory = {
  icon: typeof FileText
  label: string
  color: string
  links: { to: string; label: string }[]
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    icon: FileText,
    label: 'PDF Tools',
    color: '#56a6ff',
    links: [
      { to: '/tools/merge-pdf', label: 'Merge PDF' },
      { to: '/tools/split-pdf', label: 'Split PDF' },
      { to: '/tools/compress-pdf', label: 'Compress PDF' },
      { to: '/tools/pdf-to-word', label: 'PDF to Word' },
      { to: '/tools/word-to-pdf', label: 'Word to PDF' },
      { to: '/tools/pdf-to-jpg', label: 'PDF to JPG' },
      { to: '/tools/jpg-to-pdf', label: 'JPG to PDF' },
      { to: '/tools/ocr-pdf', label: 'OCR PDF' },
      { to: '/tools/protect-pdf', label: 'Protect PDF' },
      { to: '/tools/unlock-pdf', label: 'Unlock PDF' },
      { to: '/tools/watermark-pdf', label: 'Watermark PDF' },
      { to: '/tools/rotate-pdf', label: 'Rotate PDF' },
    ],
  },
  {
    icon: Image,
    label: 'Image Tools',
    color: '#3ee58f',
    links: [
      { to: '/tools/compress-image', label: 'Compress Image' },
      { to: '/tools/resize-image', label: 'Resize Image' },
      { to: '/tools/remove-background', label: 'Remove Background' },
      { to: '/tools/crop-image', label: 'Crop Image' },
      { to: '/tools/convert-image', label: 'Convert Image' },
      { to: '/tools/rotate-image', label: 'Rotate Image' },
      { to: '/tools/watermark-image', label: 'Watermark Image' },
      { to: '/tools/jpg-to-png', label: 'JPG to PNG' },
      { to: '/tools/png-to-jpg', label: 'PNG to JPG' },
      { to: '/tools/upscale-image', label: 'Upscale Image' },
      { to: '/tools/blur-background', label: 'Blur Background' },
      { to: '/tools/meme-generator', label: 'Meme Generator' },
    ],
  },
  {
    icon: Code2,
    label: 'Developer',
    color: '#06b6d4',
    links: [
      { to: '/tools/json-formatter', label: 'JSON Formatter' },
      { to: '/tools/base64-encode', label: 'Base64 Encoder' },
      { to: '/tools/url-encoder', label: 'URL Encoder' },
      { to: '/tools/uuid-generator', label: 'UUID Generator' },
      { to: '/tools/qr-code-generator', label: 'QR Generator' },
      { to: '/tools/barcode-generator', label: 'Barcode Generator' },
      { to: '/tools/regex-tester', label: 'Regex Tester' },
      { to: '/tools/html-encode', label: 'HTML Encoder' },
      { to: '/tools/jwt-decoder', label: 'JWT Decoder' },
      { to: '/tools/markdown-to-html', label: 'Markdown to HTML' },
      { to: '/tools/color-converter', label: 'Color Converter' },
      { to: '/tools/hash-generator', label: 'Hash Generator' },
    ],
  },
  {
    icon: Calculator,
    label: 'Math & Student',
    color: '#f59e0b',
    links: [
      { to: '/tools/bmi-calculator', label: 'BMI Calculator' },
      { to: '/tools/percentage-calculator', label: 'Percentage Calc' },
      { to: '/tools/scientific-calculator', label: 'Scientific Calc' },
      { to: '/tools/compound-interest-calculator', label: 'Compound Interest' },
      { to: '/tools/gpa-calculator', label: 'GPA Calculator' },
      { to: '/tools/age-calculator', label: 'Age Calculator' },
      { to: '/tools/date-calculator', label: 'Date Calculator' },
      { to: '/tools/tip-calculator', label: 'Tip Calculator' },
      { to: '/tools/discount-calculator', label: 'Discount Calc' },
      { to: '/tools/currency-converter', label: 'Currency Converter' },
      { to: '/tools/unit-converter', label: 'Unit Converter' },
      { to: '/tools/time-zone-converter', label: 'Time Zone Converter' },
    ],
  },
  {
    icon: Zap,
    label: 'AI & Text',
    color: '#f973ff',
    links: [
      { to: '/tools/translate-pdf', label: 'Translate PDF' },
      { to: '/tools/summarize-pdf', label: 'Summarize PDF' },
      { to: '/tools/chat-with-pdf', label: 'Chat with PDF' },
      { to: '/tools/ocr-image', label: 'OCR Image' },
      { to: '/tools/word-counter', label: 'Word Counter' },
      { to: '/tools/text-case-converter', label: 'Case Converter' },
      { to: '/tools/remove-duplicate-lines', label: 'Remove Duplicates' },
      { to: '/tools/text-to-pdf', label: 'Text to PDF' },
      { to: '/tools/lorem-ipsum-generator', label: 'Lorem Ipsum' },
      { to: '/tools/password-generator', label: 'Password Gen' },
      { to: '/tools/paraphrasing-tool', label: 'Paraphraser' },
      { to: '/tools/grammar-checker', label: 'Grammar Checker' },
    ],
  },
  {
    icon: Layers,
    label: 'Convert & More',
    color: '#a78bfa',
    links: [
      { to: '/tools/excel-to-pdf', label: 'Excel to PDF' },
      { to: '/tools/pptx-to-pdf', label: 'PPT to PDF' },
      { to: '/tools/pdf-to-excel', label: 'PDF to Excel' },
      { to: '/tools/epub-to-pdf', label: 'ePub to PDF' },
      { to: '/tools/image-collage', label: 'Image Collage' },
      { to: '/tools/scan-to-pdf', label: 'Scan to PDF' },
      { to: '/tools/compress-to-100kb', label: 'Compress to 100KB' },
      { to: '/tools/compress-to-200kb', label: 'Compress to 200KB' },
      { to: '/tools/pdf-to-pdfa', label: 'PDF to PDF/A' },
      { to: '/tools/redact-pdf', label: 'Redact PDF' },
      { to: '/tools/image-to-text', label: 'Image to Text' },
      { to: '/tools/generate-signature', label: 'Signature Gen' },
    ],
  },
]

type MegaMenuProps = {
  onClose: () => void
}

function MegaMenu({ onClose }: MegaMenuProps) {
  return (
    <div className='mega-menu' onClick={(e) => e.stopPropagation()}>
      <div className='mega-menu-inner'>
        {NAV_CATEGORIES.map((cat) => (
          <div key={cat.label} className='mega-col'>
            <div className='mega-col-header' style={{ color: cat.color }}>
              <cat.icon size={14} />
              <span>{cat.label}</span>
            </div>
            <div className='mega-col-links'>
              {cat.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className='mega-link'
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='mega-menu-footer'>
        <Link to='/' className='mega-all-tools-btn' onClick={onClose}>
          Browse all 622+ tools →
        </Link>
      </div>
    </div>
  )
}

export default function SiteShell({ children }: PropsWithChildren) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='site-shell' onClick={() => setMegaOpen(false)}>
      <AnimatedBackdrop />
      <header className='site-nav'>
        <div className='site-nav-inner'>
          <Link to='/' className='brand-lockup' onClick={() => { setMobileOpen(false); setMegaOpen(false) }}>
            <span className='brand-mark'>IT</span>
            <span>
              <strong>ISHU TOOLS</strong>
              <small>Indian Student Hub University Tools</small>
            </span>
          </Link>

          <nav className='nav-links desktop-nav' onClick={(e) => e.stopPropagation()}>
            <Link to='/' className={`nav-pill ${isHome ? 'active' : ''}`} onClick={() => setMegaOpen(false)}>
              All tools
            </Link>
            <Link to='/tools/merge-pdf' className='nav-pill' onClick={() => setMegaOpen(false)}>Merge PDF</Link>
            <Link to='/tools/compress-pdf' className='nav-pill' onClick={() => setMegaOpen(false)}>Compress PDF</Link>
            <Link to='/tools/compress-image' className='nav-pill' onClick={() => setMegaOpen(false)}>Compress Image</Link>
            <Link to='/tools/remove-background' className='nav-pill' onClick={() => setMegaOpen(false)}>Remove BG</Link>

            <div className='nav-mega-wrap' ref={megaRef}>
              <button
                className={`nav-pill mega-trigger ${megaOpen ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setMegaOpen((v) => !v) }}
              >
                More tools
                <ChevronDown size={13} className={`mega-chevron ${megaOpen ? 'open' : ''}`} />
              </button>
              {megaOpen && <MegaMenu onClose={() => setMegaOpen(false)} />}
            </div>
          </nav>

          <button
            className='mobile-menu-btn'
            onClick={(e) => { e.stopPropagation(); setMobileOpen((v) => !v); setMegaOpen(false) }}
            aria-label='Toggle menu'
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className='mobile-nav-panel'>
            <div className='mobile-nav-section'>
              <span className='mobile-nav-label'><FileText size={14} /> PDF Tools</span>
              <div className='mobile-nav-grid'>
                {[
                  { to: '/tools/merge-pdf', label: 'Merge PDF' },
                  { to: '/tools/split-pdf', label: 'Split PDF' },
                  { to: '/tools/compress-pdf', label: 'Compress PDF' },
                  { to: '/tools/pdf-to-jpg', label: 'PDF to JPG' },
                  { to: '/tools/jpg-to-pdf', label: 'JPG to PDF' },
                  { to: '/tools/pdf-to-word', label: 'PDF to Word' },
                  { to: '/tools/word-to-pdf', label: 'Word to PDF' },
                  { to: '/tools/ocr-pdf', label: 'OCR PDF' },
                  { to: '/tools/protect-pdf', label: 'Protect PDF' },
                  { to: '/tools/unlock-pdf', label: 'Unlock PDF' },
                  { to: '/tools/watermark-pdf', label: 'Watermark PDF' },
                  { to: '/tools/rotate-pdf', label: 'Rotate PDF' },
                ].map((link) => (
                  <Link key={link.to} to={link.to} className='mobile-nav-link' onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className='mobile-nav-section'>
              <span className='mobile-nav-label'><Image size={14} /> Image Tools</span>
              <div className='mobile-nav-grid'>
                {[
                  { to: '/tools/compress-image', label: 'Compress Image' },
                  { to: '/tools/resize-image', label: 'Resize Image' },
                  { to: '/tools/remove-background', label: 'Remove BG' },
                  { to: '/tools/crop-image', label: 'Crop Image' },
                  { to: '/tools/convert-image', label: 'Convert Image' },
                  { to: '/tools/watermark-image', label: 'Watermark Image' },
                  { to: '/tools/upscale-image', label: 'Upscale Image' },
                  { to: '/tools/meme-generator', label: 'Meme Generator' },
                ].map((link) => (
                  <Link key={link.to} to={link.to} className='mobile-nav-link' onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className='mobile-nav-section'>
              <span className='mobile-nav-label'><Zap size={14} /> AI & Text</span>
              <div className='mobile-nav-grid'>
                {[
                  { to: '/tools/translate-pdf', label: 'Translate PDF' },
                  { to: '/tools/summarize-pdf', label: 'Summarize PDF' },
                  { to: '/tools/chat-with-pdf', label: 'Chat with PDF' },
                  { to: '/tools/ocr-image', label: 'OCR Image' },
                  { to: '/tools/word-counter', label: 'Word Counter' },
                  { to: '/tools/password-generator', label: 'Password Gen' },
                ].map((link) => (
                  <Link key={link.to} to={link.to} className='mobile-nav-link' onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className='mobile-nav-section'>
              <span className='mobile-nav-label'><Code2 size={14} /> Developer & Math</span>
              <div className='mobile-nav-grid'>
                {[
                  { to: '/tools/json-formatter', label: 'JSON Formatter' },
                  { to: '/tools/base64-encode', label: 'Base64' },
                  { to: '/tools/uuid-generator', label: 'UUID Gen' },
                  { to: '/tools/qr-code-generator', label: 'QR Generator' },
                  { to: '/tools/bmi-calculator', label: 'BMI Calculator' },
                  { to: '/tools/percentage-calculator', label: 'Percentage Calc' },
                  { to: '/tools/scientific-calculator', label: 'Scientific Calc' },
                  { to: '/tools/compound-interest-calculator', label: 'Compound Interest' },
                ].map((link) => (
                  <Link key={link.to} to={link.to} className='mobile-nav-link' onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link to='/' className='mobile-all-tools-btn' onClick={() => setMobileOpen(false)}>
              <Layers size={16} />
              Browse all 622+ tools
            </Link>
          </div>
        )}
      </header>

      <div className='site-content'>{children}</div>

      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label='Scroll to top'
        title='Back to top'
      >
        <ArrowUp size={18} />
      </button>

      <footer className='site-footer'>
        <div className='site-footer-inner'>
          <div className='footer-brand'>
            <span className='brand-mark sm'>IT</span>
            <div>
              <strong>ISHU TOOLS</strong>
              <p>Indian Student Hub University Tools — 622+ free PDF, Image, Developer, Math, AI &amp; Text tools. No signup. No watermark. Completely free.</p>
              <div className='footer-trust-row'>
                <span><Shield size={11} /> 100% Secure</span>
                <span><Zap size={11} /> No Signup</span>
                <span><Globe size={11} /> Works Everywhere</span>
              </div>
            </div>
          </div>
          <div className='footer-links'>
            <div className='footer-col'>
              <strong>PDF Tools</strong>
              <Link to='/tools/merge-pdf'>Merge PDF</Link>
              <Link to='/tools/split-pdf'>Split PDF</Link>
              <Link to='/tools/compress-pdf'>Compress PDF</Link>
              <Link to='/tools/pdf-to-word'>PDF to Word</Link>
              <Link to='/tools/word-to-pdf'>Word to PDF</Link>
              <Link to='/tools/pdf-to-jpg'>PDF to JPG</Link>
              <Link to='/tools/ocr-pdf'>OCR PDF</Link>
              <Link to='/tools/protect-pdf'>Protect PDF</Link>
              <Link to='/tools/unlock-pdf'>Unlock PDF</Link>
            </div>
            <div className='footer-col'>
              <strong>Image Tools</strong>
              <Link to='/tools/compress-image'>Compress Image</Link>
              <Link to='/tools/resize-image'>Resize Image</Link>
              <Link to='/tools/remove-background'>Remove Background</Link>
              <Link to='/tools/crop-image'>Crop Image</Link>
              <Link to='/tools/convert-image'>Convert Image</Link>
              <Link to='/tools/jpg-to-pdf'>JPG to PDF</Link>
              <Link to='/tools/upscale-image'>Upscale Image</Link>
              <Link to='/tools/meme-generator'>Meme Generator</Link>
              <Link to='/tools/image-collage'>Image Collage</Link>
            </div>
            <div className='footer-col'>
              <strong>Convert & AI</strong>
              <Link to='/tools/excel-to-pdf'>Excel to PDF</Link>
              <Link to='/tools/pptx-to-pdf'>PPT to PDF</Link>
              <Link to='/tools/pdf-to-excel'>PDF to Excel</Link>
              <Link to='/tools/translate-pdf'>Translate PDF</Link>
              <Link to='/tools/summarize-pdf'>Summarize PDF</Link>
              <Link to='/tools/ocr-image'>OCR Image</Link>
              <Link to='/tools/epub-to-pdf'>ePub to PDF</Link>
              <Link to='/tools/chat-with-pdf'>Chat with PDF</Link>
              <Link to='/tools/scan-to-pdf'>Scan to PDF</Link>
            </div>
            <div className='footer-col'>
              <strong>Developer & Math</strong>
              <Link to='/tools/json-formatter'>JSON Formatter</Link>
              <Link to='/tools/password-generator'>Password Gen</Link>
              <Link to='/tools/qr-code-generator'>QR Generator</Link>
              <Link to='/tools/bmi-calculator'>BMI Calculator</Link>
              <Link to='/tools/scientific-calculator'>Scientific Calc</Link>
              <Link to='/tools/percentage-calculator'>Percentage Calc</Link>
              <Link to='/tools/base64-encode'>Base64 Encoder</Link>
              <Link to='/tools/uuid-generator'>UUID Generator</Link>
              <Link to='/tools/compound-interest-calculator'>Compound Interest</Link>
            </div>
          </div>
        </div>
        <div className='footer-bottom'>
          <span>© {new Date().getFullYear()} ISHU TOOLS (Indian Student Hub University Tools) · 622+ tools · All free, no signup, no watermark</span>
          <div className='footer-social'>
            <a href='https://www.linkedin.com/in/ishu-kumar-5a0940281/' target='_blank' rel='noreferrer'>LinkedIn</a>
            <a href='https://www.instagram.com/ishukr10' target='_blank' rel='noreferrer'>Instagram</a>
            <a href='https://www.youtube.com/@ishu-fun' target='_blank' rel='noreferrer'>YouTube</a>
            <a href='https://x.com/ISHU_IITP' target='_blank' rel='noreferrer'>X / Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
