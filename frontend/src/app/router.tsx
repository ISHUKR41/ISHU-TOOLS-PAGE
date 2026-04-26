import { lazy, type ReactElement } from 'react'
import { Navigate, useLocation, useRoutes } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

const HomePage     = lazy(() => import('../features/home/HomePage.tsx'))
const ToolPage     = lazy(() => import('../features/tool/ToolPage.tsx'))
const AllToolsPage = lazy(() => import('../features/tools/AllToolsPage.tsx'))
const CategoryPage = lazy(() => import('../features/category/CategoryPage.tsx'))
const ScientificCalculatorPage = lazy(() => import('../features/calculator/ScientificCalculatorPage.tsx'))

/* Per-route ErrorBoundary wrapper.
   The top-level ErrorBoundary in App.tsx catches everything but unmounts the
   whole navigation shell — that means a single broken tool would force a full
   page reload to recover. Wrapping each route gives the user a "Try Again"
   button that resets just that page while keeping the shell + URL intact, so
   they can click another tool without losing their place. */
const wrap = (node: ReactElement) => <ErrorBoundary>{node}</ErrorBoundary>

/* ─── Page transition variants ──────────────────────────────
   Fade + subtle upward slide — feels like native iOS navigation.
   Duration 220ms keeps it snappy while remaining perceptible.
   ─────────────────────────────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 14, scale: 0.995 },
  animate: { opacity: 1, y: 0,  scale: 1      },
  exit:    { opacity: 0, y: -8, scale: 0.998  },
}

const pageTransition = {
  duration: 0.22,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
}

function RouteContent() {
  const location = useLocation()

  const element = useRoutes([
    { path: '/',                      element: wrap(<HomePage />)                },
    { path: '/tools',                 element: wrap(<AllToolsPage />)            },
    { path: '/scientific-calculator', element: wrap(<ScientificCalculatorPage />) },
    { path: '/tools/:slug',           element: wrap(<ToolPage />)                },
    { path: '/category/:categoryId',  element: wrap(<CategoryPage />)            },
    { path: '*',                      element: <Navigate to='/' replace />       },
  ])

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={pageTransition}
        style={{ width: '100%', minHeight: '100vh' }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  )
}

export function AppRouter() {
  return <RouteContent />
}
