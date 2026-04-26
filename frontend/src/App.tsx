import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './app/router'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ToastProvider } from './components/ui/Toast'
import ScrollToTop from './components/ui/ScrollToTop'
import InstallPWA from './components/ui/InstallPWA'
import BackendStatusBanner from './components/ui/BackendStatusBanner'

function AppLoader() {
  return (
    <div className='app-loader'>
      <div className='app-loader-orb orb-1' />
      <div className='app-loader-orb orb-2' />
      <div className='app-loader-orb orb-3' />
      <div className='app-loader-stack'>
        <div className='app-loader-ring'>
          <div className='app-loader-ring-spin' />
          <div className='app-loader-ring-core' />
        </div>
        <span className='app-loader-text'>ISHU TOOLS</span>
        <span className='app-loader-sub'>Loading 1,200+ free tools…</span>
        <div className='app-loader-bar'><span /></div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <BackendStatusBanner />
          <Suspense fallback={<AppLoader />}>
            <AppRouter />
          </Suspense>
          <InstallPWA />
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
