import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './app/router'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ToastProvider } from './components/ui/Toast'
import ScrollToTop from './components/ui/ScrollToTop'

function AppLoader() {
  return (
    <div className='app-loader'>
      <div className='app-loader-spinner' />
      <span className='app-loader-text'>ISHU TOOLS</span>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<AppLoader />}>
            <AppRouter />
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
