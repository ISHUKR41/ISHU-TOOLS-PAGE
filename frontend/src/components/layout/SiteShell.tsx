import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FileText, Image, Zap, Settings } from 'lucide-react'
import AnimatedBackdrop from './AnimatedBackdrop'

export default function SiteShell({ children }: PropsWithChildren) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className='site-shell'>
      <AnimatedBackdrop />
      <header className='site-nav'>
        <div className='site-nav-inner'>
          <Link to='/' className='brand-lockup' onClick={() => setMobileOpen(false)}>
            <span className='brand-mark'>IT</span>
            <span>
              <strong>ISHU TOOLS</strong>
              <small>Indian Student Hub University Tools</small>
            </span>
          </Link>

          <nav className='nav-links desktop-nav'>
            <Link to='/' className={`nav-pill ${isHome ? 'active' : ''}`}>
              All tools
            </Link>
            <Link to='/tools/merge-pdf' className='nav-pill'>
              Merge PDF
            </Link>
            <Link to='/tools/compress-pdf' className='nav-pill'>
              Compress PDF
            </Link>
            <Link to='/tools/pdf-to-jpg' className='nav-pill'>
              PDF to JPG
            </Link>
            <Link to='/tools/jpg-to-pdf' className='nav-pill'>
              JPG to PDF
            </Link>
            <Link to='/tools/compress-image' className='nav-pill'>
              Compress Image
            </Link>
          </nav>

          <button
            className='mobile-menu-btn'
            onClick={() => setMobileOpen((v) => !v)}
            aria-label='Toggle menu'
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className='mobile-nav-panel'>
            <div className='mobile-nav-section'>
              <span className='mobile-nav-label'>
                <FileText size={14} /> PDF Tools
              </span>
              <div className='mobile-nav-grid'>
                {[
                  { to: '/tools/merge-pdf', label: 'Merge PDF' },
                  { to: '/tools/split-pdf', label: 'Split PDF' },
                  { to: '/tools/compress-pdf', label: 'Compress PDF' },
                  { to: '/tools/pdf-to-jpg', label: 'PDF to JPG' },
                  { to: '/tools/jpg-to-pdf', label: 'JPG to PDF' },
                  { to: '/tools/pdf-to-docx', label: 'PDF to Word' },
                  { to: '/tools/docx-to-pdf', label: 'Word to PDF' },
                  { to: '/tools/ocr-pdf', label: 'OCR PDF' },
                  { to: '/tools/protect-pdf', label: 'Protect PDF' },
                  { to: '/tools/unlock-pdf', label: 'Unlock PDF' },
                  { to: '/tools/watermark-pdf', label: 'Watermark PDF' },
                  { to: '/tools/rotate-pdf', label: 'Rotate PDF' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className='mobile-nav-link'
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className='mobile-nav-section'>
              <span className='mobile-nav-label'>
                <Image size={14} /> Image Tools
              </span>
              <div className='mobile-nav-grid'>
                {[
                  { to: '/tools/compress-image', label: 'Compress Image' },
                  { to: '/tools/resize-image', label: 'Resize Image' },
                  { to: '/tools/crop-image', label: 'Crop Image' },
                  { to: '/tools/remove-background', label: 'Remove BG' },
                  { to: '/tools/convert-image', label: 'Convert Image' },
                  { to: '/tools/watermark-image', label: 'Watermark Image' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className='mobile-nav-link'
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className='mobile-nav-section'>
              <span className='mobile-nav-label'>
                <Zap size={14} /> AI & Text
              </span>
              <div className='mobile-nav-grid'>
                {[
                  { to: '/tools/ocr-pdf', label: 'OCR PDF' },
                  { to: '/tools/translate-pdf', label: 'Translate PDF' },
                  { to: '/tools/summarize-pdf', label: 'Summarize PDF' },
                  { to: '/tools/chat-with-pdf', label: 'Chat with PDF' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className='mobile-nav-link'
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className='mobile-nav-section'>
              <span className='mobile-nav-label'>
                <Settings size={14} /> Developer & Student Tools
              </span>
              <div className='mobile-nav-grid'>
                {[
                  { to: '/tools/json-formatter', label: 'JSON Format' },
                  { to: '/tools/base64-encode', label: 'Base64' },
                  { to: '/tools/password-generator', label: 'Password Gen' },
                  { to: '/tools/uuid-generator', label: 'UUID Gen' },
                  { to: '/tools/bmi-calculator', label: 'BMI Calculator' },
                  { to: '/tools/percentage-calculator', label: 'Percentage' },
                  { to: '/tools/scientific-calculator', label: 'Scientific Calc' },
                  { to: '/tools/compound-interest-calculator', label: 'Compound Interest' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className='mobile-nav-link'
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link to='/' className='mobile-all-tools-btn' onClick={() => setMobileOpen(false)}>
              <Settings size={16} />
              Browse all tools
            </Link>
          </div>
        )}
      </header>
      <div className='site-content'>{children}</div>

      <footer className='site-footer'>
        <div className='site-footer-inner'>
          <div className='footer-brand'>
            <span className='brand-mark sm'>IT</span>
            <div>
              <strong>ISHU TOOLS</strong>
              <p>Indian Student Hub University Tools — 383+ free PDF, Image, Developer & AI workflows.</p>
            </div>
          </div>
          <div className='footer-links'>
            <div className='footer-col'>
              <strong>PDF Tools</strong>
              <Link to='/tools/merge-pdf'>Merge PDF</Link>
              <Link to='/tools/split-pdf'>Split PDF</Link>
              <Link to='/tools/compress-pdf'>Compress PDF</Link>
              <Link to='/tools/pdf-to-jpg'>PDF to JPG</Link>
              <Link to='/tools/ocr-pdf'>OCR PDF</Link>
            </div>
            <div className='footer-col'>
              <strong>Convert</strong>
              <Link to='/tools/pdf-to-docx'>PDF to Word</Link>
              <Link to='/tools/docx-to-pdf'>Word to PDF</Link>
              <Link to='/tools/jpg-to-pdf'>JPG to PDF</Link>
              <Link to='/tools/excel-to-pdf'>Excel to PDF</Link>
              <Link to='/tools/pptx-to-pdf'>PPT to PDF</Link>
            </div>
            <div className='footer-col'>
              <strong>Image Tools</strong>
              <Link to='/tools/compress-image'>Compress Image</Link>
              <Link to='/tools/resize-image'>Resize Image</Link>
              <Link to='/tools/remove-background'>Remove BG</Link>
              <Link to='/tools/crop-image'>Crop Image</Link>
              <Link to='/tools/convert-image'>Convert Image</Link>
            </div>
            <div className='footer-col'>
              <strong>AI & Developer</strong>
              <Link to='/tools/json-formatter'>JSON Formatter</Link>
              <Link to='/tools/password-generator'>Password Gen</Link>
              <Link to='/tools/bmi-calculator'>BMI Calculator</Link>
              <Link to='/tools/scientific-calculator'>Scientific Calc</Link>
              <Link to='/tools/qr-code-generator'>QR Generator</Link>
            </div>
          </div>
        </div>
        <div className='footer-bottom'>
          <span>© 2025 ISHU TOOLS (Indian Student Hub University Tools) · All tools are free to use</span>
          <div className='footer-social'>
            <a href='https://www.linkedin.com/in/ishu-kumar-5a0940281/' target='_blank' rel='noreferrer'>LinkedIn</a>
            <a href='https://www.instagram.com/ishukr10' target='_blank' rel='noreferrer'>Instagram</a>
            <a href='https://www.youtube.com/@ishu-fun' target='_blank' rel='noreferrer'>YouTube</a>
            <a href='https://x.com/ISHU_IITP' target='_blank' rel='noreferrer'>X</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
