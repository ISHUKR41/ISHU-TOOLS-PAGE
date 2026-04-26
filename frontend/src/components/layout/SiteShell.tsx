import { useCallback, useEffect, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FileText, Image, Zap, Code2, ChevronDown, Calculator, Globe, Shield, Layers, ArrowUp, Search } from 'lucide-react'
import AnimatedBackdrop from './AnimatedBackdrop'
import CommandPalette from '../search/CommandPalette'

const TOOL_COUNT_LABEL = '1200+'

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
      { to: '/scientific-calculator', label: 'Scientific Calc' },
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
          Browse all {TOOL_COUNT_LABEL} tools →
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
  const [paletteOpen, setPaletteOpen] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)

  /* Cmd/Ctrl + K, plus "/" anywhere outside an input, opens the palette */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMeta = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      const target = e.target as HTMLElement | null
      const inField = !!target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      )
      if (isMeta) {
        e.preventDefault()
        setPaletteOpen((v) => !v)
        return
      }
      if (e.key === '/' && !inField && !paletteOpen) {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paletteOpen])

  /* Throttled scroll — avoids re-render spam during fast scroll */
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onScroll = useCallback(() => {
    if (scrollTimerRef.current) return
    scrollTimerRef.current = setTimeout(() => {
      setShowBackToTop(window.scrollY > 400)
      scrollTimerRef.current = null
    }, 80)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    }
  }, [onScroll])

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
            <Link to='/scientific-calculator' className='nav-pill' onClick={() => setMegaOpen(false)}>Scientific</Link>

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
            type='button'
            className='nav-search-btn'
            onClick={(e) => { e.stopPropagation(); setPaletteOpen(true); setMegaOpen(false) }}
            aria-label='Search all tools'
          >
            <Search size={15} />
            <span className='nav-search-label'>Search tools…</span>
            <span className='nav-search-kbd'><kbd>⌘</kbd><kbd>K</kbd></span>
          </button>

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
                  { to: '/scientific-calculator', label: 'Scientific Calc' },
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
              Browse all {TOOL_COUNT_LABEL} tools
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
              <p>Indian Student Hub University Tools — {TOOL_COUNT_LABEL} free PDF, Image, Developer, Math, AI, video, finance, health &amp; text tools by Ishu Kumar (IIT Patna). No signup. No watermark. Completely free.</p>
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
              <Link to='/tools/jpg-to-pdf'>JPG to PDF</Link>
              <Link to='/tools/ocr-pdf'>OCR PDF</Link>
              <Link to='/tools/protect-pdf'>Protect PDF</Link>
              <Link to='/tools/unlock-pdf'>Unlock PDF</Link>
              <Link to='/tools/watermark-pdf'>Watermark PDF</Link>
              <Link to='/tools/rotate-pdf'>Rotate PDF</Link>
              <Link to='/tools/redact-pdf'>Redact PDF</Link>
              <Link to='/tools/pdf-to-excel'>PDF to Excel</Link>
              <Link to='/tools/pdf-to-pdfa'>PDF to PDF/A</Link>
            </div>
            <div className='footer-col'>
              <strong>Image Tools</strong>
              <Link to='/tools/compress-image'>Compress Image</Link>
              <Link to='/tools/resize-image'>Resize Image</Link>
              <Link to='/tools/remove-background'>Remove Background</Link>
              <Link to='/tools/crop-image'>Crop Image</Link>
              <Link to='/tools/convert-image'>Convert Image</Link>
              <Link to='/tools/rotate-image'>Rotate Image</Link>
              <Link to='/tools/upscale-image'>Upscale Image</Link>
              <Link to='/tools/compress-to-100kb'>Compress to 100KB</Link>
              <Link to='/tools/compress-to-200kb'>Compress to 200KB</Link>
              <Link to='/tools/compress-to-50kb'>Compress to 50KB</Link>
              <Link to='/tools/compress-to-20kb'>Compress to 20KB</Link>
              <Link to='/tools/jpg-to-png'>JPG to PNG</Link>
              <Link to='/tools/png-to-jpg'>PNG to JPG</Link>
              <Link to='/tools/meme-generator'>Meme Generator</Link>
              <Link to='/tools/image-collage'>Image Collage</Link>
            </div>
            <div className='footer-col'>
              <strong>Convert &amp; AI</strong>
              <Link to='/tools/excel-to-pdf'>Excel to PDF</Link>
              <Link to='/tools/pptx-to-pdf'>PPT to PDF</Link>
              <Link to='/tools/pdf-to-excel'>PDF to Excel</Link>
              <Link to='/tools/translate-pdf'>Translate PDF</Link>
              <Link to='/tools/summarize-pdf'>Summarize PDF</Link>
              <Link to='/tools/ocr-image'>OCR Image</Link>
              <Link to='/tools/image-to-text'>Image to Text</Link>
              <Link to='/tools/epub-to-pdf'>ePub to PDF</Link>
              <Link to='/tools/chat-with-pdf'>Chat with PDF</Link>
              <Link to='/tools/scan-to-pdf'>Scan to PDF</Link>
              <Link to='/tools/html-to-pdf'>HTML to PDF</Link>
              <Link to='/tools/markdown-to-pdf'>Markdown to PDF</Link>
              <Link to='/tools/text-to-pdf'>Text to PDF</Link>
              <Link to='/tools/word-counter'>Word Counter</Link>
              <Link to='/tools/grammar-checker'>Grammar Checker</Link>
            </div>
            <div className='footer-col'>
              <strong>Developer Tools</strong>
              <Link to='/tools/json-formatter'>JSON Formatter</Link>
              <Link to='/tools/base64-encode'>Base64 Encoder</Link>
              <Link to='/tools/url-encoder'>URL Encoder</Link>
              <Link to='/tools/uuid-generator'>UUID Generator</Link>
              <Link to='/tools/qr-code-generator'>QR Code Generator</Link>
              <Link to='/tools/barcode-generator'>Barcode Generator</Link>
              <Link to='/tools/regex-tester'>Regex Tester</Link>
              <Link to='/tools/hash-generator'>Hash Generator</Link>
              <Link to='/tools/jwt-decoder'>JWT Decoder</Link>
              <Link to='/tools/markdown-to-html'>Markdown to HTML</Link>
              <Link to='/tools/color-picker'>Color Picker</Link>
              <Link to='/tools/color-converter'>Color Converter</Link>
              <Link to='/tools/html-encode'>HTML Encoder</Link>
              <Link to='/tools/password-generator'>Password Generator</Link>
              <Link to='/tools/lorem-ipsum-generator'>Lorem Ipsum</Link>
            </div>
            <div className='footer-col'>
              <strong>Calculators</strong>
              <Link to='/tools/bmi-calculator'>BMI Calculator</Link>
              <Link to='/scientific-calculator'>Scientific Calculator</Link>
              <Link to='/tools/percentage-calculator'>Percentage Calculator</Link>
              <Link to='/tools/emi-calculator-advanced'>EMI Calculator India</Link>
              <Link to='/tools/gst-calculator-india'>GST Calculator India</Link>
              <Link to='/tools/sip-calculator'>SIP Calculator</Link>
              <Link to='/tools/compound-interest-calculator'>Compound Interest</Link>
              <Link to='/tools/calorie-calculator'>Calorie Calculator</Link>
              <Link to='/tools/age-calculator'>Age Calculator</Link>
              <Link to='/tools/cgpa-to-percentage'>CGPA to Percentage</Link>
              <Link to='/tools/income-tax-calculator'>Income Tax Calculator</Link>
              <Link to='/tools/fd-calculator'>FD Calculator India</Link>
              <Link to='/tools/currency-converter'>Currency Converter</Link>
              <Link to='/tools/unit-converter'>Unit Converter</Link>
              <Link to='/tools/gpa-calculator'>GPA Calculator</Link>
            </div>
            <div className='footer-col'>
              <strong>Student &amp; More</strong>
              <Link to='/tools/attendance-calculator'>Attendance Calculator</Link>
              <Link to='/tools/cgpa-to-percentage'>CGPA Converter</Link>
              <Link to='/tools/passport-size-photo'>Passport Photo Maker</Link>
              <Link to='/tools/compress-to-20kb'>Photo to 20KB</Link>
              <Link to='/tools/compress-to-50kb'>Photo to 50KB</Link>
              <Link to='/tools/upi-qr-generator'>UPI QR Generator</Link>
              <Link to='/tools/ip-address-lookup'>IP Lookup</Link>
              <Link to='/tools/whois-lookup'>WHOIS Lookup</Link>
              <Link to='/tools/plagiarism-checker'>Plagiarism Checker</Link>
              <Link to='/tools/paraphrasing-tool'>Paraphrasing Tool</Link>
              <Link to='/tools/text-case-converter'>Case Converter</Link>
              <Link to='/tools/youtube-downloader'>YouTube Downloader</Link>
              <Link to='/tools/instagram-downloader'>Instagram Downloader</Link>
              <Link to='/tools/generate-signature'>Signature Generator</Link>
              <Link to='/'>All 1200+ Tools →</Link>
            </div>
          </div>
        </div>

        <div className='footer-seo-tags'>
          <div className='footer-seo-inner'>
            <strong>Popular Searches:</strong>
            {[
              'merge pdf online free', 'compress pdf without losing quality', 'pdf to word converter free',
              'remove background online free', 'compress image to 100kb', 'compress image to 50kb',
              'compress photo for ssc upsc', 'passport size photo online india', 'image to text online free',
              'json formatter online', 'qr code generator free', 'bmi calculator india', 'emi calculator india',
              'gst calculator india', 'sip calculator', 'ishu tools', 'ishutools', 'ishu kumar tools',
              'free tools for students india', 'online tools no signup',
            ].map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className='footer-bottom'>
          <span>© {new Date().getFullYear()} ISHU TOOLS (Indian Student Hub University Tools) by Ishu Kumar (IIT Patna) · {TOOL_COUNT_LABEL} tools · Free, no signup, no watermark</span>
          <div className='footer-social'>
            <a href='https://www.linkedin.com/in/ishu-kumar-5a0940281/' target='_blank' rel='noreferrer'>LinkedIn</a>
            <a href='https://www.instagram.com/ishukr10' target='_blank' rel='noreferrer'>Instagram</a>
            <a href='https://www.youtube.com/@ishu-fun' target='_blank' rel='noreferrer'>YouTube</a>
            <a href='https://x.com/ISHU_IITP' target='_blank' rel='noreferrer'>X / Twitter</a>
          </div>
        </div>
      </footer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}
