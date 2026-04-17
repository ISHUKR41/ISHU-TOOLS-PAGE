import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './app/router'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ToastProvider } from './components/ui/Toast'

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<div className='app-loader'>Loading ISHU TOOLS...</div>}>
            <AppRouter />
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
