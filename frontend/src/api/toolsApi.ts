import type { RuntimeCapabilities, ToolCategory, ToolDefinition, ToolRunResponse } from '../types/tools'
import { API_BASE_URL } from './config'
import { FALLBACK_CATEGORIES, FALLBACK_TOOLS } from '../data/catalogFallback'
import { searchTools } from '../lib/toolSearch'

function parseFilename(contentDisposition: string | null, fallback: string): string {
  if (!contentDisposition) return fallback
  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }
  const asciiMatch = /filename="?([^";]+)"?/i.exec(contentDisposition)
  return asciiMatch?.[1] || fallback
}

async function readError(res: Response): Promise<Error> {
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      const payload = await res.json()
      return new Error(payload.detail || payload.message || `Request failed (${res.status})`)
    } catch {
      return new Error(`Request failed (${res.status})`)
    }
  }
  try {
    const text = await res.text()
    return new Error(text || `Request failed (${res.status})`)
  } catch {
    return new Error(`Request failed (${res.status})`)
  }
}

// ─── Fetch with timeout ───
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 15000,
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

// ─── Retry with exponential backoff ───
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  { maxRetries = 2, timeoutMs = 15000 } = {},
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options, timeoutMs)
      if (res.ok || res.status < 500) return res // Don't retry 4xx
      lastError = new Error(`Server error (${res.status})`)
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Network error')
      if (err instanceof Error && err.name === 'AbortError') throw err
    }

    if (attempt < maxRetries) {
      // Exponential backoff: 500ms, 1500ms
      await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(2, attempt)))
    }
  }

  throw lastError || new Error('Request failed after retries')
}

// ─── Per-tool detail cache (memory + sessionStorage) ───
const TOOL_DETAIL_CACHE: Map<string, { data: ToolDefinition; ts: number }> = new Map()
const TOOL_DETAIL_TTL = 10 * 60 * 1000 // 10 minutes
const TOOL_DETAIL_SS_PREFIX = 'ishu-tools:tool:'

function readToolCache(slug: string): ToolDefinition | null {
  const mem = TOOL_DETAIL_CACHE.get(slug)
  if (mem && Date.now() - mem.ts < TOOL_DETAIL_TTL) return mem.data
  try {
    const raw = sessionStorage.getItem(TOOL_DETAIL_SS_PREFIX + slug)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { data: ToolDefinition; ts: number }
    if (Date.now() - parsed.ts > TOOL_DETAIL_TTL) return null
    TOOL_DETAIL_CACHE.set(slug, parsed)
    return parsed.data
  } catch {
    return null
  }
}

function writeToolCache(slug: string, data: ToolDefinition) {
  const entry = { data, ts: Date.now() }
  TOOL_DETAIL_CACHE.set(slug, entry)
  try {
    sessionStorage.setItem(TOOL_DETAIL_SS_PREFIX + slug, JSON.stringify(entry))
  } catch {
    // ignore if storage full
  }
}

// ─── Category list cache ───
let categoriesCache: { data: ToolCategory[]; ts: number } | null = null
const CATEGORIES_TTL = 15 * 60 * 1000 // 15 minutes

// ─── Tools list cache ───
const TOOLS_LIST_CACHE: Map<string, { data: ToolDefinition[]; ts: number }> = new Map()
const TOOLS_LIST_TTL = 5 * 60 * 1000 // 5 minutes

// ─── Runtime capabilities cache ───
let runtimeCapCache: { data: RuntimeCapabilities; ts: number } | null = null
const RUNTIME_CAP_TTL = 30 * 60 * 1000 // 30 minutes

// ─── Global popularity cache ───
let popularityCache: { data: Record<string, number>; ts: number } | null = null
const POPULARITY_TTL = 2 * 60 * 1000 // 2 minutes

// ─── In-flight deduplication ───
const IN_FLIGHT: Map<string, Promise<ToolDefinition>> = new Map()
const IN_FLIGHT_LISTS: Map<string, Promise<ToolDefinition[]>> = new Map()

export async function fetchCategories(): Promise<ToolCategory[]> {
  // Check cache first
  if (categoriesCache && Date.now() - categoriesCache.ts < CATEGORIES_TTL) {
    return categoriesCache.data
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/categories`)
    if (!res.ok) throw await readError(res)
    const data: ToolCategory[] = await res.json()
    categoriesCache = { data, ts: Date.now() }
    return data
  } catch {
    categoriesCache = { data: FALLBACK_CATEGORIES, ts: Date.now() }
    return FALLBACK_CATEGORIES
  }
}

export async function fetchTools(params?: {
  category?: string
  q?: string
}): Promise<ToolDefinition[]> {
  const query = new URLSearchParams()
  if (params?.category) query.set('category', params.category)
  if (params?.q) query.set('q', params.q)

  const cacheKey = query.toString() || '__all__'

  // Check cache first
  const cached = TOOLS_LIST_CACHE.get(cacheKey)
  if (cached && Date.now() - cached.ts < TOOLS_LIST_TTL) {
    return cached.data
  }

  // Deduplicate in-flight requests
  const existing = IN_FLIGHT_LISTS.get(cacheKey)
  if (existing) return existing

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const promise = (async () => {
    try {
      const res = await fetchWithRetry(`${API_BASE_URL}/api/tools${suffix}`)
      if (!res.ok) throw await readError(res)
      const data: ToolDefinition[] = await res.json()
      TOOLS_LIST_CACHE.set(cacheKey, { data, ts: Date.now() })
      return data
    } catch {
      // Filter fallback tools to match current query so the UI stays hydrated instantly
      const fallback = params?.q
        ? searchTools(FALLBACK_TOOLS, params.q, { category: params.category || 'all' })
        : FALLBACK_TOOLS.filter((tool) => !params?.category || tool.category === params.category)
      TOOLS_LIST_CACHE.set(cacheKey, { data: fallback, ts: Date.now() })
      return fallback
    }
  })()

  IN_FLIGHT_LISTS.set(cacheKey, promise)
  try {
    return await promise
  } finally {
    IN_FLIGHT_LISTS.delete(cacheKey)
  }
}

export async function fetchTool(slug: string): Promise<ToolDefinition> {
  // Return cached if fresh
  const cached = readToolCache(slug)
  if (cached) return cached

  // Deduplicate in-flight requests for the same slug
  const existing = IN_FLIGHT.get(slug)
  if (existing) return existing

  const promise = (async () => {
    try {
      const res = await fetchWithRetry(`${API_BASE_URL}/api/tools/${slug}`)
      if (!res.ok) throw await readError(res)
      const data: ToolDefinition = await res.json()
      writeToolCache(slug, data)
      return data
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') throw err
      const fallback = FALLBACK_TOOLS.find((tool) => tool.slug === slug)
      if (fallback) {
        writeToolCache(slug, fallback)
        return fallback
      }
      throw err
    }
  })()

  IN_FLIGHT.set(slug, promise)
  try {
    return await promise
  } finally {
    IN_FLIGHT.delete(slug)
  }
}

export async function fetchRuntimeCapabilities(): Promise<RuntimeCapabilities> {
  if (runtimeCapCache && Date.now() - runtimeCapCache.ts < RUNTIME_CAP_TTL) {
    return runtimeCapCache.data
  }
  const res = await fetchWithRetry(`${API_BASE_URL}/api/runtime-capabilities`)
  if (!res.ok) throw await readError(res)
  const data: RuntimeCapabilities = await res.json()
  runtimeCapCache = { data, ts: Date.now() }
  return data
}

export async function fetchPopularityMap(): Promise<Record<string, number>> {
  if (popularityCache && Date.now() - popularityCache.ts < POPULARITY_TTL) {
    return popularityCache.data
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/popularity`, {}, { maxRetries: 1, timeoutMs: 12000 })
    if (!res.ok) throw await readError(res)
    const payload = await res.json() as { counts?: Record<string, number> }
    const counts = payload.counts && typeof payload.counts === 'object' ? payload.counts : {}
    popularityCache = { data: counts, ts: Date.now() }
    return counts
  } catch {
    return {}
  }
}

export async function checkHealth(): Promise<boolean> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000)
  if (!res.ok) throw await readError(res)
  return true
}

export async function runTool(
  slug: string,
  files: File[],
  payload: Record<string, unknown>,
): Promise<ToolRunResponse> {
  const formData = new FormData()
  for (const file of files) {
    formData.append('files', file)
  }
  formData.append('payload', JSON.stringify(payload))

  // Long timeout for tool execution (2 minutes)
  const res = await fetchWithTimeout(
    `${API_BASE_URL}/api/tools/${slug}/execute`,
    { method: 'POST', body: formData },
    120000,
  )

  if (!res.ok) {
    throw await readError(res)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return {
      type: 'json',
      payload: await res.json(),
    }
  }

  const blob = await res.blob()
  const filename = parseFilename(
    res.headers.get('content-disposition'),
    `${slug}-result.${contentType.includes('zip') ? 'zip' : 'bin'}`,
  )

  return {
    type: 'file',
    blob,
    filename,
    message: res.headers.get('X-Tool-Message') || 'Tool processed successfully',
    contentType: contentType || 'application/octet-stream',
  }
}
