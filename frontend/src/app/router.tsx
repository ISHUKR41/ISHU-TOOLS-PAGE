import { lazy } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

const HomePage = lazy(() => import('../features/home/HomePage.tsx'))
const ToolPage = lazy(() => import('../features/tool/ToolPage.tsx'))
const AllToolsPage = lazy(() => import('../features/tools/AllToolsPage.tsx'))
const CategoryPage = lazy(() => import('../features/category/CategoryPage.tsx'))

export function AppRouter() {
  return useRoutes([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/tools',
      element: <AllToolsPage />,
    },
    {
      path: '/tools/:slug',
      element: <ToolPage />,
    },
    {
      path: '/category/:categoryId',
      element: <CategoryPage />,
    },
    {
      path: '*',
      element: <Navigate to='/' replace />,
    },
  ])
}
