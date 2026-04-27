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

// ─── CIRCUIT BREAKER PATTERN ──────────────────────────────────────────────────
// Prevents hammering a dead backend. After N consecutive failures within a time
// window, the circuit "opens" and all requests fail instantly for a cooldown
// period. After cooldown, the next request is a "probe" that determines if the
// backend has recovered.
const CIRCUIT_CONFIG = {
  failureThreshold: 5,    // failures within window to open circuit
  failureWindowMs: 60_000, // 60 seconds window
  cooldownMs: 30_000,      // 30 seconds before half-open probe
}

class CircuitBreaker {
  private failures: number[] = []
  private openedAt: number | null = null
  private state: 'closed' | 'open' | 'half-open' = 'closed'

  recordSuccess(): void {
    this.failures = []
    this.openedAt = null
    this.state = 'closed'
  }

  recordFailure(): void {
    const now = Date.now()
    this.failures.push(now)
    // Keep only recent failures within the window
    this.failures = this.failures.filter(t => now - t < CIRCUIT_CONFIG.failureWindowMs)
    if (this.failures.length >= CIRCUIT_CONFIG.failureThreshold) {
      this.state = 'open'
      this.openedAt = now
    }
  }

  canRequest(): boolean {
    if (this.state === 'closed') return true
    if (this.state === 'open' && this.openedAt) {
      if (Date.now() - this.openedAt >= CIRCUIT_CONFIG.cooldownMs) {
        this.state = 'half-open'
        return true // Allow one probe request
      }
      return false
    }
    return true // half-open: allow probe
  }

  getState(): string { return this.state }
  getCooldownLeft(): number {
    if (this.state !== 'open' || !this.openedAt) return 0
    return Math.max(0, Math.ceil((this.openedAt + CIRCUIT_CONFIG.cooldownMs - Date.now()) / 1000))
  }
}

export const circuitBreaker = new CircuitBreaker()

// ─── CONNECTION QUALITY DETECTOR ─────────────────────────────────────────────
// Measures actual connection speed to adjust timeouts dynamically.
// Slow connections get longer timeouts, fast connections get shorter ones.
let measuredRttMs: number | null = null

export function getAdaptiveTimeout(baseMs: number): number {
  if (!measuredRttMs) return baseMs
  if (measuredRttMs > 2000) return Math.min(baseMs * 2.5, 300_000)  // Very slow
  if (measuredRttMs > 800) return Math.min(baseMs * 1.8, 240_000)   // Slow
  if (measuredRttMs < 200) return Math.max(baseMs * 0.7, 15_000)    // Fast
  return baseMs
}

export function measureConnectionSpeed(): void {
  const start = performance.now()
  fetch(`${API_BASE_URL}/health`, { method: 'HEAD', mode: 'cors', cache: 'no-cache' })
    .then(() => { measuredRttMs = performance.now() - start })
    .catch(() => { measuredRttMs = 5000 }) // Assume slow if we can't even reach it
}

// ─── Fetch with timeout ───
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 15000,
): Promise<Response> {
  // Circuit breaker check
  if (!circuitBreaker.canRequest()) {
    const cooldown = circuitBreaker.getCooldownLeft()
    throw new Error(
      `Server temporarily unreachable (circuit breaker active). Auto-retry in ${cooldown}s. ` +
      `This protects against hammering a down server.`
    )
  }

  const adaptiveTimeout = getAdaptiveTimeout(timeoutMs)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), adaptiveTimeout)

  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    circuitBreaker.recordSuccess()
    return res
  } catch (err: unknown) {
    circuitBreaker.recordFailure()
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

// ─── BACKEND PRE-WARMING ─────────────────────────────────────────────────────
// Call on tool page mount to wake the Render backend early, so by the time the
// user fills the form and clicks Run, the server is already warm.
let lastPreWarmTs = 0
const PRE_WARM_COOLDOWN = 30_000 // Don't pre-warm more than once every 30s

export function preWarmBackend(): void {
  const now = Date.now()
  if (now - lastPreWarmTs < PRE_WARM_COOLDOWN) return
  lastPreWarmTs = now
  // Fire-and-forget — non-blocking, no error handling needed
  fetch(`${API_BASE_URL}/health`, { method: 'HEAD', mode: 'cors' }).catch(() => {})
}

// ─── RESPONSE CACHING (sessionStorage) ────────────────────────────────────────
// Caches successful tool results so that re-running the same input is instant.
// Only for JSON responses (not file downloads). Keyed by slug + payload hash.
const RESULT_CACHE_PREFIX = 'ishu-tools:result:'
const RESULT_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function hashPayload(slug: string, payload: Record<string, unknown>): string {
  const raw = slug + ':' + JSON.stringify(payload)
  // Simple FNV-1a hash for speed
  let hash = 2166136261
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return RESULT_CACHE_PREFIX + (hash >>> 0).toString(36)
}

function readResultCache(slug: string, payload: Record<string, unknown>): ToolRunResponse | null {
  try {
    const key = hashPayload(slug, payload)
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const entry = JSON.parse(raw) as { resp: ToolRunResponse; ts: number }
    if (Date.now() - entry.ts > RESULT_CACHE_TTL) {
      sessionStorage.removeItem(key)
      return null
    }
    return entry.resp
  } catch {
    return null
  }
}

function writeResultCache(slug: string, payload: Record<string, unknown>, resp: ToolRunResponse): void {
  if (resp.type !== 'json') return // Don't cache file downloads
  try {
    const key = hashPayload(slug, payload)
    sessionStorage.setItem(key, JSON.stringify({ resp, ts: Date.now() }))
  } catch { /* storage full — ignore */ }
}

// ─── REQUEST DEDUPLICATION ────────────────────────────────────────────────────
// Prevents double-submits (e.g. user clicks Run twice rapidly). If a request
// for the same slug is already in-flight, we return the same Promise instead
// of firing a second HTTP call.
const IN_FLIGHT_RUNS = new Map<string, Promise<ToolRunResponse>>()

// ─── TOOL-SPECIFIC DIAGNOSTIC HINTS ──────────────────────────────────────────
// For internet-heavy tools (video downloaders, social media tools, web scrapers),
// provide tool-specific guidance when they fail, instead of generic errors.
const DOWNLOADER_SLUGS = new Set([
  'youtube-video-downloader', 'youtube-mp3-downloader', 'youtube-thumbnail-downloader',
  'youtube-shorts-downloader', 'youtube-to-mp4', 'youtube-audio-downloader',
  'youtube-playlist-downloader', 'youtube-subtitle-downloader', 'youtube-to-gif',
  'instagram-video-downloader', 'instagram-reels-downloader', 'instagram-photo-downloader',
  'instagram-story-downloader', 'instagram-downloader', 'instagram-dp-downloader',
  'tiktok-video-downloader', 'tiktok-downloader', 'tiktok-mp3-downloader', 'tiktok-without-watermark',
  'twitter-video-downloader', 'twitter-downloader', 'x-video-downloader', 'twitter-gif-downloader',
  'facebook-video-downloader', 'facebook-downloader', 'facebook-reels-downloader',
  'reddit-video-downloader', 'reddit-downloader', 'reddit-gif-downloader',
  'pinterest-video-downloader', 'pinterest-downloader', 'pinterest-image-downloader',
  'spotify-downloader', 'spotify-to-mp3', 'spotify-playlist-downloader',
  'soundcloud-downloader', 'soundcloud-to-mp3',
  'vimeo-downloader', 'dailymotion-downloader',
  'linkedin-video-downloader', 'snapchat-downloader', 'snapchat-story-downloader',
  'twitch-clip-downloader', 'tumblr-downloader',
  'threads-downloader', 'bilibili-downloader',
  'any-video-downloader', 'video-downloader', 'all-video-downloader',
  'audio-downloader', 'music-downloader', 'mp3-downloader',
])

const WEB_SCRAPER_SLUGS = new Set([
  'website-screenshot', 'webpage-to-pdf', 'html-to-pdf',
  'link-checker', 'broken-link-checker', 'meta-tag-extractor',
  'seo-analyzer', 'whois-lookup', 'dns-lookup',
  'ssl-checker', 'http-header-checker', 'website-status-checker',
  'page-speed-checker', 'favicon-extractor', 'sitemap-generator',
  'robots-txt-checker', 'open-graph-checker', 'structured-data-tester',
  'website-to-pdf', 'url-shortener', 'qr-code-generator',
  'website-word-counter', 'readability-checker', 'mobile-friendly-tester',
])

const AI_TOOL_SLUGS = new Set([
  'ai-text-generator', 'ai-writer', 'ai-paraphraser', 'ai-summarizer',
  'ai-translator', 'ai-grammar-checker', 'ai-essay-writer',
  'ai-code-generator', 'ai-image-generator', 'ai-chatbot',
  'text-to-speech', 'speech-to-text', 'ai-content-detector',
  'ai-plagiarism-checker', 'ai-story-generator', 'ai-poem-generator',
  'ai-email-writer', 'ai-blog-writer', 'ai-headline-generator',
  'ai-hashtag-generator', 'ai-caption-generator',
])

const FILE_PROCESSING_SLUGS = new Set([
  'pdf-to-word', 'word-to-pdf', 'pdf-merger', 'pdf-splitter',
  'pdf-compressor', 'image-compressor', 'image-resizer',
  'image-to-pdf', 'pdf-to-image', 'pdf-to-text',
  'image-converter', 'png-to-jpg', 'jpg-to-png', 'webp-to-png',
  'svg-to-png', 'heic-to-jpg', 'gif-maker', 'video-to-gif',
  'video-compressor', 'video-converter', 'audio-converter',
  'mp4-to-mp3', 'wav-to-mp3', 'file-converter',
  'image-cropper', 'image-rotator', 'background-remover',
  'watermark-remover', 'pdf-password-remover', 'excel-to-pdf',
])

const EMAIL_COMM_SLUGS = new Set([
  'email-extractor', 'phone-number-extractor', 'email-verifier',
  'disposable-email-checker', 'email-header-analyzer',
  'smtp-tester', 'mx-record-checker',
])

export function getToolDiagnosticHint(slug: string, errorMsg: string): string {
  const lower = errorMsg.toLowerCase()

  if (DOWNLOADER_SLUGS.has(slug)) {
    if (/private|login|auth|cookie|sign.?in/i.test(lower)) {
      return 'This content may be private or require authentication. Try pasting your cookies for the platform, or check that the content is publicly accessible.'
    }
    if (/not found|404|deleted|removed|unavailable/i.test(lower)) {
      return 'This content may have been deleted or is no longer available on the platform.'
    }
    if (/rate limit|429|too many/i.test(lower)) {
      return 'The platform is temporarily limiting requests. Wait 60 seconds and try again — this usually resolves itself.'
    }
    if (/geo.?block|region|country|not available in your/i.test(lower)) {
      return 'This content may be geo-restricted. Try using a VPN or check if the content is available in your region.'
    }
    if (/captcha|robot|bot|verify/i.test(lower)) {
      return 'The platform is requiring human verification. Try again after a short wait, or paste fresh cookies.'
    }
    if (/age.?restrict|mature|nsfw|18\+/i.test(lower)) {
      return 'This content is age-restricted. Try signing in to the platform first, then paste your cookies.'
    }
    if (/copyright|dmca|taken down|claim/i.test(lower)) {
      return 'This content has been removed due to a copyright claim and cannot be downloaded.'
    }
    if (/timeout|timed? out/i.test(lower)) {
      return 'The download is taking too long — the file may be very large. Try a shorter video or lower quality.'
    }
    return 'Social media platforms frequently change their APIs. If this tool fails, try again in a few minutes — our backend auto-updates to handle these changes.'
  }

  if (WEB_SCRAPER_SLUGS.has(slug)) {
    if (/blocked|forbidden|403|cloudflare|captcha/i.test(lower)) {
      return 'This website is blocking automated access. Some sites use CloudFlare or CAPTCHAs that prevent scraping.'
    }
    if (/ssl|certificate|https/i.test(lower)) {
      return 'The website has an SSL/TLS issue. The certificate may be expired or misconfigured.'
    }
    if (/dns|resolve|nxdomain/i.test(lower)) {
      return 'The domain could not be resolved. Check the URL spelling or the domain may be down.'
    }
    return 'Some websites block automated tools. If this fails, try a different URL or check that the site is publicly accessible.'
  }

  if (AI_TOOL_SLUGS.has(slug)) {
    if (/quota|limit|exceeded|billing/i.test(lower)) {
      return 'The AI service has reached its usage quota. Please try again later — quotas usually reset within an hour.'
    }
    if (/content.?policy|safety|filtered|harmful/i.test(lower)) {
      return 'Your input was flagged by the AI content safety filter. Try rephrasing your request to be more neutral.'
    }
    if (/too long|token.?limit|max.?length/i.test(lower)) {
      return 'Your input text is too long. Try shortening it or splitting it into smaller parts.'
    }
    return 'AI services can be temporarily overloaded. Try again in a moment — response times vary based on server load.'
  }

  if (FILE_PROCESSING_SLUGS.has(slug)) {
    if (/corrupt|invalid|damaged|cannot read/i.test(lower)) {
      return 'The uploaded file appears to be corrupted or in an unsupported format. Try re-saving it and uploading again.'
    }
    if (/too large|size.?limit|exceed|payload/i.test(lower)) {
      return 'The file exceeds the size limit. Try compressing or resizing it before uploading.'
    }
    if (/password|protected|encrypted/i.test(lower)) {
      return 'This file is password-protected. Remove the password first before processing.'
    }
    return 'File processing errors are usually caused by unsupported formats. Try converting to a standard format first.'
  }

  if (EMAIL_COMM_SLUGS.has(slug)) {
    if (/invalid|malformed|format/i.test(lower)) {
      return 'The email address or input format is invalid. Check for typos or extra spaces.'
    }
    if (/blocked|refused|smtp/i.test(lower)) {
      return 'The email server is blocking verification requests. This is common with strict email providers.'
    }
    return 'Email and communication tools depend on external servers. Some providers may block or rate-limit requests.'
  }

  // ─── Generic hints for any unmatched tool ──
  if (/timeout|timed? out/i.test(lower)) {
    return 'The request took too long. The server may be under heavy load — try again in a moment.'
  }
  if (/network|fetch|connection|offline/i.test(lower)) {
    return 'Network issue detected. Check your internet connection and try again.'
  }
  if (/circuit breaker/i.test(lower)) {
    return 'The server is temporarily experiencing issues. The system will auto-recover in about 30 seconds.'
  }

  return ''
}

/**
 * Heuristic: is this error worth a SINGLE auto-retry?
 */
function isTransientBackendError(err: unknown): boolean {
  if (!err) return false
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase()
  if (/abort|cancell?ed by user/.test(msg)) return false
  return (
    /failed to fetch|networkerror|load failed|fetch failed/.test(msg) ||
    /timeout|timed? out/.test(msg) ||
    /http 50[234]|bad gateway|service unavailable|gateway timeout/.test(msg)
  )
}

export interface RunToolOptions {
  /**
   * Called once if a transient failure was detected and an auto-retry is
   * about to happen. Lets the UI show "Server waking up, retrying…".
   */
  onColdStartRetry?: () => void
  /**
   * Called when a cached result is being used instead of a fresh API call.
   */
  onCacheHit?: () => void
  /**
   * Called with the retry stage number (1, 2, 3) as the system escalates
   * through its multi-stage fallback chain.
   */
  onRetryStage?: (stage: number) => void
  /**
   * If true, skip the result cache and always hit the backend.
   */
  skipCache?: boolean
}

export async function runTool(
  slug: string,
  files: File[],
  payload: Record<string, unknown>,
  options: RunToolOptions = {},
): Promise<ToolRunResponse> {
  // ── Check result cache (JSON payloads only, no files) ──
  const hasFiles = files.length > 0
  if (!hasFiles && !options.skipCache) {
    const cached = readResultCache(slug, payload)
    if (cached) {
      options.onCacheHit?.()
      return cached
    }
  }

  // ── Deduplication: if the same slug is already running, return that ──
  const dedupeKey = slug
  const existing = IN_FLIGHT_RUNS.get(dedupeKey)
  if (existing && !hasFiles) return existing

  const buildFormData = () => {
    const fd = new FormData()
    for (const file of files) fd.append('files', file)
    fd.append('payload', JSON.stringify(payload))
    return fd
  }

  const callOnce = async (timeoutMs: number): Promise<Response> =>
    fetchWithTimeout(
      `${API_BASE_URL}/api/tools/${slug}/execute`,
      { method: 'POST', body: buildFormData() },
      timeoutMs,
    )

  // ── Multi-stage fallback chain ──────────────────────────────────────────
  // Stage 0: Normal call (30s timeout for quick tools, 120s for downloaders)
  // Stage 1: Cold-start retry (8s wait + 90s timeout)
  // Stage 2: Extended retry (12s wait + 150s timeout) for heavy tools
  //
  // The timeout escalation is critical for video downloaders / social media
  // tools that can take 30-120 seconds on the backend. Starting with a
  // shorter timeout catches fast failures without making the user wait.
  const isHeavyTool = DOWNLOADER_SLUGS.has(slug) || WEB_SCRAPER_SLUGS.has(slug)
  const stage0Timeout = isHeavyTool ? 120_000 : 60_000
  const stage1Timeout = isHeavyTool ? 150_000 : 90_000
  const stage2Timeout = 180_000

  const promise = (async (): Promise<ToolRunResponse> => {
    let res: Response

    // Stage 0: first attempt
    try {
      res = await callOnce(stage0Timeout)
      if (res.status === 502 || res.status === 503 || res.status === 504) {
        throw new Error(`HTTP ${res.status}`)
      }
    } catch (firstErr) {
      if (!isTransientBackendError(firstErr)) throw firstErr

      // Stage 1: cold-start retry
      options.onColdStartRetry?.()
      options.onRetryStage?.(1)
      await new Promise((r) => setTimeout(r, 8000))

      try {
        res = await callOnce(stage1Timeout)
        if (res.status === 502 || res.status === 503 || res.status === 504) {
          throw new Error(`HTTP ${res.status}`)
        }
      } catch (secondErr) {
        if (!isTransientBackendError(secondErr)) throw secondErr

        // Stage 2: extended retry (only for heavy tools)
        if (isHeavyTool) {
          options.onRetryStage?.(2)
          await new Promise((r) => setTimeout(r, 12000))
          res = await callOnce(stage2Timeout)
        } else {
          throw secondErr
        }
      }
    }

    if (!res.ok) {
      throw await readError(res)
    }

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const result: ToolRunResponse = {
        type: 'json',
        payload: await res.json(),
      }
      // Cache successful JSON results
      if (!hasFiles) writeResultCache(slug, payload, result)
      return result
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
  })()

  // Track in-flight for deduplication
  if (!hasFiles) {
    IN_FLIGHT_RUNS.set(dedupeKey, promise)
    promise.finally(() => IN_FLIGHT_RUNS.delete(dedupeKey))
  }

  return promise
}

