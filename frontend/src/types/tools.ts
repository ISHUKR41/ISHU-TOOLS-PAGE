export interface ToolCategory {
  id: string
  label: string
  description: string
}

export interface ToolDefinition {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  input_kind: 'files' | 'text' | 'url' | 'mixed'
  accepts_multiple: boolean
}

export interface ToolRunJsonResult {
  status: string
  message: string
  job_id?: string
  data?: Record<string, unknown>
}

export type ToolRunResponse =
  | {
      type: 'json'
      payload: ToolRunJsonResult
    }
  | {
      type: 'file'
      blob: Blob
      filename: string
      message: string
      contentType: string
    }
