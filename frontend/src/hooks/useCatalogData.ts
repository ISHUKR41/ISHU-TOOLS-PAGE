import { useEffect, useState } from 'react'

import { checkHealth, fetchCategories, fetchTools } from '../api/toolsApi'
import type { ToolCategory, ToolDefinition } from '../types/tools'

const CATALOG_CACHE_KEY = 'ishu-tools:catalog:v1'
const CATALOG_CACHE_TTL_MS = 5 * 60 * 1000

type CatalogCache = {
  timestamp: number
  categories: ToolCategory[]
  tools: ToolDefinition[]
}

function readCatalogCache(): CatalogCache | null {
  try {
    const raw = sessionStorage.getItem(CATALOG_CACHE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as CatalogCache
    if (!parsed?.timestamp || !Array.isArray(parsed.categories) || !Array.isArray(parsed.tools)) {
      return null
    }

    if (Date.now() - parsed.timestamp > CATALOG_CACHE_TTL_MS) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function writeCatalogCache(categories: ToolCategory[], tools: ToolDefinition[]) {
  try {
    const payload: CatalogCache = {
      timestamp: Date.now(),
      categories,
      tools,
    }
    sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore cache write failures in restricted/private contexts.
  }
}

export function useCatalogData() {
  const [categories, setCategories] = useState<ToolCategory[]>([])
  const [tools, setTools] = useState<ToolDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiReady, setApiReady] = useState(false)

  useEffect(() => {
    let mounted = true
    const cached = readCatalogCache()

    if (cached) {
      setCategories(cached.categories)
      setTools(cached.tools)
      setLoading(false)
    }

    async function loadCatalog() {
      try {
        if (!cached) setLoading(true)
        const [categoryRecords, toolRecords] = await Promise.all([fetchCategories(), fetchTools()])
        if (!mounted) return

        // Deduplicate categories by id (registry may have duplicate declarations)
        const seenCats = new Set<string>()
        const uniqueCategories = categoryRecords.filter((cat) => {
          if (seenCats.has(cat.id)) return false
          seenCats.add(cat.id)
          return true
        })

        // Deduplicate tools by slug
        const seenSlugs = new Set<string>()
        const uniqueTools = toolRecords.filter((tool) => {
          if (seenSlugs.has(tool.slug)) return false
          seenSlugs.add(tool.slug)
          return true
        })

        setCategories(uniqueCategories)
        setTools(uniqueTools)
        setError(null)
        writeCatalogCache(uniqueCategories, uniqueTools)
      } catch (err) {
        if (!mounted) return
        if (!cached) {
          setError(err instanceof Error ? err.message : 'Unable to load tools')
        }
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

