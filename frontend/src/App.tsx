import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './app/router'

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className='app-loader'>Loading ISHU TOOLS...</div>}>
        <AppRouter />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
