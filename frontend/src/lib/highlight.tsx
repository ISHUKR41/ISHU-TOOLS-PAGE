import type { ReactNode } from 'react'

const STOPWORDS = new Set([
  'a', 'an', 'the', 'of', 'for', 'with', 'and', 'or', 'in', 'on', 'at', 'to',
  'is', 'are', 'my', 'me', 'i', 'we', 'you', 'your',
  'best', 'free', 'online', 'fast', 'easy', 'quick', 'top', 'new',
  'app', 'website', 'site', 'tool', 'tools',
  'ko', 'ka', 'ki', 'ke', 'se', 'mai', 'mein', 'mera', 'meri',
  'kar', 'karo', 'karna', 'karne', 'kaise', 'hai', 'ho',
])

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function termsFromQuery(query: string): string[] {
  const cleaned = query
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.+#%\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned) return []
  return Array.from(
    new Set(
      cleaned
        .split(/\s+/)
        .filter(Boolean)
        .filter((t) => t.length >= 2 && !STOPWORDS.has(t)),
    ),
  ).sort((a, b) => b.length - a.length)
}

/**
 * Wrap matched query terms in <mark> for visual feedback during search.
 * Returns the original string when query is empty or yields no terms.
 */
export function highlightMatches(text: string, query: string): ReactNode {
  if (!text || !query) return text
  const terms = termsFromQuery(query)
  if (!terms.length) return text

  const pattern = new RegExp(`(${terms.map(escapeRegex).join('|')})`, 'ig')
  const parts = text.split(pattern)
  if (parts.length <= 1) return text

  return parts.map((part, i) =>
    pattern.test(part)
      ? <mark className='search-mark' key={`${i}-${part}`}>{part}</mark>
      : part,
  )
}
