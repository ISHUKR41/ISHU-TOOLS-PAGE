import type { ToolCategory, ToolDefinition, ToolRunResponse } from '../types/tools'
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
  const res = await fetch(`${API_BASE_URL}/api/tools/${slug}`)
  if (!res.ok) throw await readError(res)
  return res.json()
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
