import { lazy } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

const HomePage = lazy(() => import('../features/home/HomePage.tsx'))
const ToolPage = lazy(() => import('../features/tool/ToolPage.tsx'))

export function AppRouter() {
  return useRoutes([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/tools/:slug',
      element: <ToolPage />,
    },
    {
      path: '*',
      element: <Navigate to='/' replace />,
    },
  ])
}
