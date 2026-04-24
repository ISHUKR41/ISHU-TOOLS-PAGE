import { useEffect, useState } from 'react'

import { checkHealth, fetchCategories, fetchTools } from '../api/toolsApi'
import type { ToolCategory, ToolDefinition } from '../types/tools'
import { FALLBACK_CATEGORIES, FALLBACK_TOOLS } from '../data/catalogFallback'

const CATALOG_CACHE_KEY = 'ishu-tools:catalog:v2'
const CATALOG_CACHE_TTL_MS = 15 * 60 * 1000

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

// ── CRITICAL PERFORMANCE FIX ─────────────────────────────────────────────────
// Read cache SYNCHRONOUSLY in useState initializer so the VERY FIRST render
// already has data (loading=false, categories=[...], tools=[...]).
// Without this, even with a warm cache the component always renders once with
// loading=true → skeletons flash → re-render with data → CLS.
// ─────────────────────────────────────────────────────────────────────────────
function getInitialCache() {
  try {
    return readCatalogCache()
  } catch {
    return null
  }
}

export function useCatalogData() {
  const initialCache = getInitialCache()
  const initialCategories = initialCache?.categories?.length
    ? initialCache.categories
    : FALLBACK_CATEGORIES
  const initialTools = initialCache?.tools?.length ? initialCache.tools : FALLBACK_TOOLS

  const [categories, setCategories] = useState<ToolCategory[]>(initialCategories)
  const [tools, setTools] = useState<ToolDefinition[]>(initialTools)
  // Keep loading false by default so the layout renders immediately with the shipped fallback data.
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [apiReady, setApiReady] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadCatalog() {
      try {
        const [categoryRecords, toolRecords] = await Promise.all([fetchCategories(), fetchTools()])
        if (!mounted) return

        // Deduplicate categories by id
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

        const saveCache = () => writeCatalogCache(uniqueCategories, uniqueTools)
        const requestIdleCallback = (window as typeof window & {
          requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
        }).requestIdleCallback
        if (typeof requestIdleCallback === 'function') {
          requestIdleCallback(saveCache, { timeout: 1200 })
        } else {
          globalThis.setTimeout(saveCache, 0)
        }
      } catch (err) {
        if (!mounted) return
        // Only show error if we have no data at all
        if (categories.length === 0) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    categories,
    tools,
    loading,
    error,
    apiReady,
  }
}
