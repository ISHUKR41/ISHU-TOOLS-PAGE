import { useEffect, useState } from 'react'

import { checkHealth, fetchCategories, fetchTools } from '../api/toolsApi'
import type { ToolCategory, ToolDefinition } from '../types/tools'

export function useCatalogData() {
  const [categories, setCategories] = useState<ToolCategory[]>([])
  const [tools, setTools] = useState<ToolDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiReady, setApiReady] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadCatalog() {
      try {
        setLoading(true)
        const [categoryRecords, toolRecords] = await Promise.all([fetchCategories(), fetchTools()])
        if (!mounted) return

        setCategories(categoryRecords)
        setTools(toolRecords)
        setError(null)
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Unable to load tools')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    async function loadHealth() {
      try {
        await checkHealth()
        if (mounted) setApiReady(true)
      } catch {
        if (mounted) setApiReady(false)
      }
    }

    void loadCatalog()
    void loadHealth()

    return () => {
      mounted = false
    }
  }, [])

  return {
    categories,
    tools,
    loading,
    error,
    apiReady,
  }
}

