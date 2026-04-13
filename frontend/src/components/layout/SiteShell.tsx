import type { PropsWithChildren } from 'react'
import { Link, useLocation } from 'react-router-dom'

import AnimatedBackdrop from './AnimatedBackdrop'

export default function SiteShell({ children }: PropsWithChildren) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className='site-shell'>
      <AnimatedBackdrop />
      <header className='site-nav'>
        <div className='site-nav-inner'>
          <Link to='/' className='brand-lockup'>
            <span className='brand-mark'>IT</span>
            <span>
              <strong>ISHU TOOLS</strong>
              <small>Python backend + modern React frontend</small>
            </span>
          </Link>

          <nav className='nav-links'>
            <Link to='/' className={`nav-pill ${isHome ? 'active' : ''}`}>
              All tools
            </Link>
            <Link to='/tools/merge-pdf' className='nav-pill'>
              Merge PDF
            </Link>
            <Link to='/tools/compress-image' className='nav-pill'>
              Compress Image
            </Link>
          </nav>
        </div>
      </header>
      <div className='site-content'>{children}</div>
    </div>
  )
}
