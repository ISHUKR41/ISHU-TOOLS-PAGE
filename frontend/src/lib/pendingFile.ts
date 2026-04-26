/**
 * Transient in-memory holder for files passed between the global SmartDropOverlay
 * and a destination tool page (`/tools/:slug`). We can't put a `File` instance in
 * a URL or `react-router` state cleanly, so we stash the pending files here and
 * the ToolPage drains them on mount if their MIME / extension matches.
 *
 * Single-consumer semantics: `take()` clears the stash so navigating away and
 * back never re-applies stale files. Idempotent and safe in restricted browsers.
 */

export interface PendingFileDrop {
  slug: string
  files: File[]
  // Stamp lets us auto-expire stale drops (e.g. user clicked a chip but never
  // arrived on the tool page within ~10s — likely they cancelled or routed
  // elsewhere). Avoids "I dropped something an hour ago" surprises.
  ts: number
}

const TTL_MS = 10_000
let pending: PendingFileDrop | null = null

export function setPendingDrop(slug: string, files: File[]): void {
  if (!slug || !files.length) {
    pending = null
    return
  }
  pending = { slug, files, ts: Date.now() }
}

export function takePendingDrop(slug: string): File[] | null {
  if (!pending) return null
  if (pending.slug !== slug) return null
  if (Date.now() - pending.ts > TTL_MS) {
    pending = null
    return null
  }
  const out = pending.files
  pending = null
  return out
}

export function clearPendingDrop(): void {
  pending = null
}
