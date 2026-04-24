const primary = (import.meta.env.VITE_SITE_URL || 'https://ishutools.fun').replace(/\/$/, '')
const fallback = (import.meta.env.VITE_FALLBACK_SITE_URL || 'https://ishutools.vercel.app').replace(/\/$/, '')

export const SITE_URL = primary
export const SITE_FALLBACK_URL = fallback
export const SITE_OG_IMAGE = `${SITE_URL}/og-image.png`

export function toSiteUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalizedPath}`
}
