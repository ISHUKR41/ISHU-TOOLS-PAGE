import type { RuntimeCapabilities, ToolCategory, ToolDefinition, ToolRunResponse } from '../types/tools'
import { API_BASE_URL } from './config'

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
    const payload = await res.json()
    return new Error(payload.detail || payload.message || 'Request failed')
  }
  return new Error(await res.text())
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

// ─── Runtime capabilities cache ───
let runtimeCapCache: { data: RuntimeCapabilities; ts: number } | null = null
const RUNTIME_CAP_TTL = 30 * 60 * 1000 // 30 minutes

// ─── In-flight deduplication ───
const IN_FLIGHT: Map<string, Promise<ToolDefinition>> = new Map()

export async function fetchCategories(): Promise<ToolCategory[]> {
  const res = await fetch(`${API_BASE_URL}/api/categories`)
  if (!res.ok) throw await readError(res)
  return res.json()
}

export async function fetchTools(params?: {
  category?: string
  q?: string
}): Promise<ToolDefinition[]> {
  const query = new URLSearchParams()
  if (params?.category) query.set('category', params.category)
  if (params?.q) query.set('q', params.q)

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const res = await fetch(`${API_BASE_URL}/api/tools${suffix}`)
  if (!res.ok) throw await readError(res)
  return res.json()
}

export async function fetchTool(slug: string): Promise<ToolDefinition> {
  // Return cached if fresh
  const cached = readToolCache(slug)
  if (cached) return cached

  // Deduplicate in-flight requests for the same slug
  const existing = IN_FLIGHT.get(slug)
  if (existing) return existing

  const promise = (async () => {
    const res = await fetch(`${API_BASE_URL}/api/tools/${slug}`)
    if (!res.ok) throw await readError(res)
    const data: ToolDefinition = await res.json()
    writeToolCache(slug, data)
    return data
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
  const res = await fetch(`${API_BASE_URL}/api/runtime-capabilities`)
  if (!res.ok) throw await readError(res)
  const data: RuntimeCapabilities = await res.json()
  runtimeCapCache = { data, ts: Date.now() }
  return data
}

export async function checkHealth(): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/health`)
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

  const res = await fetch(`${API_BASE_URL}/api/tools/${slug}/execute`, {
    method: 'POST',
    body: formData,
  })

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
