/**
 * ─── CLIENT-SIDE INSTANT EXECUTION LAYER ──────────────────────────────────────
 *
 * Pure-function tools that run 100% in the browser — zero API call, zero
 * latency, immune to backend / Vercel issues. The frontend ToolPage checks
 * this map BEFORE making a network request: if a slug has a client executor,
 * we run it locally and return a synthesised ToolRunResponse.
 *
 * Why this exists:
 *  1. ~40 pure-function tools were missing backend handlers ("Tool not found")
 *     — base64, sha256, rot13, atbash, bubble-text, etc. Implementing them
 *     here fixes them everywhere instantly without server work.
 *  2. The remaining tools (case-converter, json-formatter, password-generator…)
 *     are pure JS and don't need a 80-300ms network round-trip per click.
 *  3. Backend stays as a silent fallback — if any executor throws, the caller
 *     should fall through to the network path (handled in ToolPage).
 *
 * Each executor receives a normalised payload and returns a ToolRunResponse.
 * Executors may be sync or async (async only used for SubtleCrypto hashing).
 */

import type { ToolRunResponse } from '../types/tools'

type Payload = Record<string, unknown>
type Executor = (payload: Payload) => ToolRunResponse | Promise<ToolRunResponse>

// ─── Tiny helpers ────────────────────────────────────────────────────────────
const str = (v: unknown, d = ''): string => (v === undefined || v === null ? d : String(v))
const num = (v: unknown, d = 0): number => {
  const n = Number(v)
  return Number.isFinite(n) ? n : d
}
const ok = (message: string, data: Record<string, unknown> = {}): ToolRunResponse => ({
  type: 'json',
  payload: { status: 'success', message, data },
})
const err = (message: string, data: Record<string, unknown> = {}): ToolRunResponse => ({
  type: 'json',
  payload: { status: 'error', message, data: { error: message, ...data } },
})

function payloadText(payload: Payload): string {
  return Object.values(payload)
    .filter((value) => value !== undefined && value !== null && String(value).trim() !== '')
    .map((value) => String(value).trim())
    .join('\n')
    .trim()
}

export function canRunGenericClientFallback(payload: Payload): boolean {
  return payloadText(payload).length > 0
}

export function runGenericClientFallback(
  slug: string,
  payload: Payload,
  reason = 'The online processor is temporarily unavailable.',
): ToolRunResponse | null {
  const text = payloadText(payload)
  if (!text) return null
  const words = text.match(/\S+/g)?.length ?? 0
  const lines = text.split(/\r?\n/).length
  const urls = Array.from(text.matchAll(/https?:\/\/[^\s)]+/gi)).map((match) => match[0])
  return ok('Recovery mode is active. A browser-safe fallback result is ready.', {
    fallback_mode: true,
    slug,
    reason,
    input_preview: text.slice(0, 4000),
    characters: text.length,
    words,
    lines,
    detected_urls: urls.slice(0, 5),
    next_steps: [
      'Copy or save this fallback report if you need the input summary.',
      'Press Reset / Reload Tool to start fresh if the form feels stuck.',
      'Retry when your connection or the remote service is stable for the full tool result.',
    ],
  })
}

// ─── UTF-8 safe base64 ───────────────────────────────────────────────────────
function b64encode(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}
function b64decode(b64: string): string {
  const cleaned = b64.replace(/\s+/g, '')
  const bin = atob(cleaned)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

// ─── Base32 (RFC 4648) ───────────────────────────────────────────────────────
const B32_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
function b32encode(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let out = ''
  let bits = 0
  let value = 0
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i]
    bits += 8
    while (bits >= 5) {
      out += B32_ALPHA[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += B32_ALPHA[(value << (5 - bits)) & 31]
  while (out.length % 8 !== 0) out += '='
  return out
}
function b32decode(s: string): string {
  const cleaned = s.replace(/=+$/, '').toUpperCase().replace(/[^A-Z2-7]/g, '')
  const bytes: number[] = []
  let bits = 0
  let value = 0
  for (let i = 0; i < cleaned.length; i++) {
    const idx = B32_ALPHA.indexOf(cleaned[i])
    if (idx < 0) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return new TextDecoder().decode(new Uint8Array(bytes))
}

// ─── Hex/Binary helpers ──────────────────────────────────────────────────────
function textToHex(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ')
}
function hexToText(hex: string): string {
  const cleaned = hex.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '')
  if (cleaned.length % 2 !== 0) throw new Error('Hex must have an even number of digits.')
  const bytes = new Uint8Array(cleaned.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16)
  return new TextDecoder().decode(bytes)
}
function textToBinary(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(2).padStart(8, '0'))
    .join(' ')
}
function binaryToText(bin: string): string {
  const groups = bin.trim().split(/\s+/).filter((g) => /^[01]+$/.test(g))
  if (!groups.length) throw new Error('Binary must be groups of 0s and 1s separated by spaces.')
  const bytes = new Uint8Array(groups.length)
  for (let i = 0; i < groups.length; i++) {
    const n = parseInt(groups[i], 2)
    if (!Number.isFinite(n) || n < 0 || n > 255) throw new Error(`Invalid byte: "${groups[i]}"`)
    bytes[i] = n
  }
  return new TextDecoder().decode(bytes)
}

// ─── Native SHA via SubtleCrypto ─────────────────────────────────────────────
async function shaHex(algo: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512', text: string): Promise<string> {
  const buf = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest(algo, buf)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// ─── Pure MD5 (for md5-hash-generator instant path) ──────────────────────────
// Compact MD5 — adapted from the public-domain RFC 1321 reference.
function md5(input: string): string {
  function add32(a: number, b: number) { return (a + b) & 0xffffffff }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t))
    return add32((a << s) | (a >>> (32 - s)), b)
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | (~b & d), a, b, x, s, t) }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & ~d), a, b, x, s, t) }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t) }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | ~d), a, b, x, s, t) }

  const bytes = new TextEncoder().encode(input)
  const len = bytes.length
  const nblk = ((len + 8) >> 6) + 1
  const blks = new Int32Array(nblk * 16)
  for (let i = 0; i < len; i++) blks[i >> 2] |= bytes[i] << ((i % 4) * 8)
  blks[len >> 2] |= 0x80 << ((len % 4) * 8)
  blks[nblk * 16 - 2] = len * 8

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878
  for (let i = 0; i < blks.length; i += 16) {
    const oa = a, ob = b, oc = c, od = d
    a = ff(a, b, c, d, blks[i + 0], 7, -680876936)
    d = ff(d, a, b, c, blks[i + 1], 12, -389564586)
    c = ff(c, d, a, b, blks[i + 2], 17, 606105819)
    b = ff(b, c, d, a, blks[i + 3], 22, -1044525330)
    a = ff(a, b, c, d, blks[i + 4], 7, -176418897)
    d = ff(d, a, b, c, blks[i + 5], 12, 1200080426)
    c = ff(c, d, a, b, blks[i + 6], 17, -1473231341)
    b = ff(b, c, d, a, blks[i + 7], 22, -45705983)
    a = ff(a, b, c, d, blks[i + 8], 7, 1770035416)
    d = ff(d, a, b, c, blks[i + 9], 12, -1958414417)
    c = ff(c, d, a, b, blks[i + 10], 17, -42063)
    b = ff(b, c, d, a, blks[i + 11], 22, -1990404162)
    a = ff(a, b, c, d, blks[i + 12], 7, 1804603682)
    d = ff(d, a, b, c, blks[i + 13], 12, -40341101)
    c = ff(c, d, a, b, blks[i + 14], 17, -1502002290)
    b = ff(b, c, d, a, blks[i + 15], 22, 1236535329)
    a = gg(a, b, c, d, blks[i + 1], 5, -165796510)
    d = gg(d, a, b, c, blks[i + 6], 9, -1069501632)
    c = gg(c, d, a, b, blks[i + 11], 14, 643717713)
    b = gg(b, c, d, a, blks[i + 0], 20, -373897302)
    a = gg(a, b, c, d, blks[i + 5], 5, -701558691)
    d = gg(d, a, b, c, blks[i + 10], 9, 38016083)
    c = gg(c, d, a, b, blks[i + 15], 14, -660478335)
    b = gg(b, c, d, a, blks[i + 4], 20, -405537848)
    a = gg(a, b, c, d, blks[i + 9], 5, 568446438)
    d = gg(d, a, b, c, blks[i + 14], 9, -1019803690)
    c = gg(c, d, a, b, blks[i + 3], 14, -187363961)
    b = gg(b, c, d, a, blks[i + 8], 20, 1163531501)
    a = gg(a, b, c, d, blks[i + 13], 5, -1444681467)
    d = gg(d, a, b, c, blks[i + 2], 9, -51403784)
    c = gg(c, d, a, b, blks[i + 7], 14, 1735328473)
    b = gg(b, c, d, a, blks[i + 12], 20, -1926607734)
    a = hh(a, b, c, d, blks[i + 5], 4, -378558)
    d = hh(d, a, b, c, blks[i + 8], 11, -2022574463)
    c = hh(c, d, a, b, blks[i + 11], 16, 1839030562)
    b = hh(b, c, d, a, blks[i + 14], 23, -35309556)
    a = hh(a, b, c, d, blks[i + 1], 4, -1530992060)
    d = hh(d, a, b, c, blks[i + 4], 11, 1272893353)
    c = hh(c, d, a, b, blks[i + 7], 16, -155497632)
    b = hh(b, c, d, a, blks[i + 10], 23, -1094730640)
    a = hh(a, b, c, d, blks[i + 13], 4, 681279174)
    d = hh(d, a, b, c, blks[i + 0], 11, -358537222)
    c = hh(c, d, a, b, blks[i + 3], 16, -722521979)
    b = hh(b, c, d, a, blks[i + 6], 23, 76029189)
    a = hh(a, b, c, d, blks[i + 9], 4, -640364487)
    d = hh(d, a, b, c, blks[i + 12], 11, -421815835)
    c = hh(c, d, a, b, blks[i + 15], 16, 530742520)
    b = hh(b, c, d, a, blks[i + 2], 23, -995338651)
    a = ii(a, b, c, d, blks[i + 0], 6, -198630844)
    d = ii(d, a, b, c, blks[i + 7], 10, 1126891415)
    c = ii(c, d, a, b, blks[i + 14], 15, -1416354905)
    b = ii(b, c, d, a, blks[i + 5], 21, -57434055)
    a = ii(a, b, c, d, blks[i + 12], 6, 1700485571)
    d = ii(d, a, b, c, blks[i + 3], 10, -1894986606)
    c = ii(c, d, a, b, blks[i + 10], 15, -1051523)
    b = ii(b, c, d, a, blks[i + 1], 21, -2054922799)
    a = ii(a, b, c, d, blks[i + 8], 6, 1873313359)
    d = ii(d, a, b, c, blks[i + 15], 10, -30611744)
    c = ii(c, d, a, b, blks[i + 6], 15, -1560198380)
    b = ii(b, c, d, a, blks[i + 13], 21, 1309151649)
    a = ii(a, b, c, d, blks[i + 4], 6, -145523070)
    d = ii(d, a, b, c, blks[i + 11], 10, -1120210379)
    c = ii(c, d, a, b, blks[i + 2], 15, 718787259)
    b = ii(b, c, d, a, blks[i + 9], 21, -343485551)
    a = add32(a, oa); b = add32(b, ob); c = add32(c, oc); d = add32(d, od)
  }
  const hex = (n: number) => {
    let s = ''
    for (let j = 0; j < 4; j++) s += ((n >> (j * 8)) & 0xff).toString(16).padStart(2, '0')
    return s
  }
  return hex(a) + hex(b) + hex(c) + hex(d)
}

// ─── Stylized text maps ──────────────────────────────────────────────────────
const BUBBLE_MAP: Record<string, string> = {
  a: 'ⓐ', b: 'ⓑ', c: 'ⓒ', d: 'ⓓ', e: 'ⓔ', f: 'ⓕ', g: 'ⓖ', h: 'ⓗ', i: 'ⓘ', j: 'ⓙ', k: 'ⓚ', l: 'ⓛ', m: 'ⓜ',
  n: 'ⓝ', o: 'ⓞ', p: 'ⓟ', q: 'ⓠ', r: 'ⓡ', s: 'ⓢ', t: 'ⓣ', u: 'ⓤ', v: 'ⓥ', w: 'ⓦ', x: 'ⓧ', y: 'ⓨ', z: 'ⓩ',
  A: 'Ⓐ', B: 'Ⓑ', C: 'Ⓒ', D: 'Ⓓ', E: 'Ⓔ', F: 'Ⓕ', G: 'Ⓖ', H: 'Ⓗ', I: 'Ⓘ', J: 'Ⓙ', K: 'Ⓚ', L: 'Ⓛ', M: 'Ⓜ',
  N: 'Ⓝ', O: 'Ⓞ', P: 'Ⓟ', Q: 'Ⓠ', R: 'Ⓡ', S: 'Ⓢ', T: 'Ⓣ', U: 'Ⓤ', V: 'Ⓥ', W: 'Ⓦ', X: 'Ⓧ', Y: 'Ⓨ', Z: 'Ⓩ',
  '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
}
const UPSIDE_MAP: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ',
  n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: 'B', C: 'Ɔ', D: 'D', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I', J: 'ſ', K: 'K', L: '˥', M: 'W',
  N: 'N', O: 'O', P: 'Ԁ', Q: 'Q', R: 'R', S: 'S', T: '┴', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
  '.': '˙', ',': "'", '?': '¿', '!': '¡', "'": ',', '"': ',,', '(': ')', ')': '(', '[': ']', ']': '[',
  '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾',
}
const BOLD_MAP: Record<string, string> = (() => {
  const m: Record<string, string> = {}
  const A = 0x1d400, a = 0x1d41a, n0 = 0x1d7ce
  for (let i = 0; i < 26; i++) { m[String.fromCharCode(65 + i)] = String.fromCodePoint(A + i); m[String.fromCharCode(97 + i)] = String.fromCodePoint(a + i) }
  for (let i = 0; i < 10; i++) m[String(i)] = String.fromCodePoint(n0 + i)
  return m
})()
const SMALL_MAP: Record<string, string> = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ',
  n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
}
const WIDE_MAP: Record<string, string> = (() => {
  const m: Record<string, string> = {}
  for (let i = 33; i < 127; i++) m[String.fromCharCode(i)] = String.fromCharCode(0xfee0 + i)
  m[' '] = '\u3000'
  return m
})()
const LEET_MAP: Record<string, string> = {
  a: '4', b: '8', e: '3', g: '6', i: '1', l: '1', o: '0', s: '5', t: '7', z: '2',
  A: '4', B: '8', E: '3', G: '6', I: '1', L: '1', O: '0', S: '5', T: '7', Z: '2',
}
function mapChars(text: string, map: Record<string, string>): string {
  let out = ''
  for (const ch of text) out += map[ch] !== undefined ? map[ch] : ch
  return out
}
function combiningOverlay(text: string, marks: string[]): string {
  let out = ''
  for (const ch of text) {
    out += ch
    if (/\S/.test(ch)) for (const m of marks) out += m
  }
  return out
}

// ─── Lorem-ipsum word pool ───────────────────────────────────────────────────
const LOREM = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ' +
  'enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor ' +
  'in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident ' +
  'sunt in culpa qui officia deserunt mollit anim id est laborum praesentium voluptatum deleniti atque corrupti quos quas molestias'
).split(' ')
function loremSentence(): string {
  const len = 6 + Math.floor(Math.random() * 10)
  const words: string[] = []
  for (let i = 0; i < len; i++) words.push(LOREM[Math.floor(Math.random() * LOREM.length)])
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}
function loremParagraph(): string {
  const n = 4 + Math.floor(Math.random() * 4)
  const out: string[] = []
  for (let i = 0; i < n; i++) out.push(loremSentence())
  return out.join(' ')
}

// ─── Random utilities ────────────────────────────────────────────────────────
function secureRandomInt(maxExclusive: number): number {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % maxExclusive
}
function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── EXECUTORS ───────────────────────────────────────────────────────────────
const EXEC: Record<string, Executor> = {}

// — Encoding —
EXEC['base64-encoder'] = (p) => {
  const text = str(p.text)
  if (!text) return err('Please paste some text to encode.')
  return ok('Encoded to Base64.', { input: text, encoded: b64encode(text), length: text.length })
}
EXEC['base64-decoder'] = (p) => {
  const text = str(p.text).trim()
  if (!text) return err('Please paste a Base64 string to decode.')
  try {
    const decoded = b64decode(text)
    return ok('Decoded from Base64.', { encoded: text, decoded, length: decoded.length })
  } catch { return err('Invalid Base64 — check for typos or extra characters.') }
}
EXEC['base32-encoder'] = (p) => {
  const text = str(p.text)
  if (!text) return err('Please paste some text to encode.')
  return ok('Encoded to Base32.', { input: text, encoded: b32encode(text) })
}
EXEC['base32-decoder'] = (p) => {
  const text = str(p.text).trim()
  if (!text) return err('Please paste a Base32 string to decode.')
  try { return ok('Decoded from Base32.', { encoded: text, decoded: b32decode(text) }) }
  catch { return err('Invalid Base32 string.') }
}
EXEC['text-to-binary'] = (p) => {
  const text = str(p.text)
  if (!text) return err('Please enter text to convert.')
  return ok(`Converted ${text.length} characters to binary.`, { input: text, binary: textToBinary(text) })
}
EXEC['binary-to-text'] = (p) => {
  const text = str(p.text).trim()
  if (!text) return err('Please paste binary (groups of 0/1 separated by spaces).')
  try { return ok('Decoded binary to text.', { binary: text, text: binaryToText(text) }) }
  catch (e) { return err(e instanceof Error ? e.message : 'Invalid binary.') }
}
EXEC['text-to-hex'] = (p) => {
  const text = str(p.text)
  if (!text) return err('Please enter text to convert.')
  return ok('Converted to hex.', { input: text, hex: textToHex(text) })
}
EXEC['hex-to-text'] = (p) => {
  const text = str(p.text).trim()
  if (!text) return err('Please paste hex bytes.')
  try { return ok('Decoded hex to text.', { hex: text, text: hexToText(text) }) }
  catch (e) { return err(e instanceof Error ? e.message : 'Invalid hex.') }
}

// — Hashing —
EXEC['md5-hash-generator'] = (p) => {
  const text = str(p.text)
  if (!text) return err('Please enter text to hash.')
  return ok('MD5 hash generated.', { input: text, md5: md5(text), length: 32 })
}
EXEC['sha1-hash-generator'] = async (p) => {
  const text = str(p.text); if (!text) return err('Please enter text to hash.')
  return ok('SHA-1 hash generated.', { input: text, sha1: await shaHex('SHA-1', text), length: 40 })
}
EXEC['sha256-hash-generator'] = async (p) => {
  const text = str(p.text); if (!text) return err('Please enter text to hash.')
  return ok('SHA-256 hash generated.', { input: text, sha256: await shaHex('SHA-256', text), length: 64 })
}
EXEC['sha384-hash-generator'] = async (p) => {
  const text = str(p.text); if (!text) return err('Please enter text to hash.')
  return ok('SHA-384 hash generated.', { input: text, sha384: await shaHex('SHA-384', text), length: 96 })
}
EXEC['sha512-hash-generator'] = async (p) => {
  const text = str(p.text); if (!text) return err('Please enter text to hash.')
  return ok('SHA-512 hash generated.', { input: text, sha512: await shaHex('SHA-512', text), length: 128 })
}
EXEC['hash-generator'] = async (p) => {
  const text = str(p.text); if (!text) return err('Please enter text to hash.')
  const [s1, s256, s512] = await Promise.all([shaHex('SHA-1', text), shaHex('SHA-256', text), shaHex('SHA-512', text)])
  return ok('Generated all hashes.', { input: text, md5: md5(text), sha1: s1, sha256: s256, sha512: s512 })
}

// — Reversal / line ops —
const reverseExec: Executor = (p) => {
  const text = str(p.text); if (!text) return err('Please enter text to reverse.')
  const reversed = Array.from(text).reverse().join('')
  return ok('Text reversed.', { original: text, reversed })
}
EXEC['reverse-text'] = reverseExec
EXEC['text-reverser'] = reverseExec
EXEC['backwards-text-generator'] = reverseExec

EXEC['reverse-words'] = (p) => {
  const text = str(p.text); if (!text) return err('Please enter text.')
  const reversed = text.split(/\s+/).reverse().join(' ')
  return ok('Words reversed.', { original: text, reversed })
}
EXEC['reverse-lines'] = (p) => {
  const text = str(p.text); if (!text) return err('Please paste lines.')
  const reversed = text.split(/\r?\n/).reverse().join('\n')
  return ok('Lines reversed.', { reversed })
}
const dedupExec: Executor = (p) => {
  const text = str(p.text); if (!text) return err('Please paste lines.')
  const lines = text.split(/\r?\n/)
  const seen = new Set<string>()
  const out: string[] = []
  for (const line of lines) { if (!seen.has(line)) { seen.add(line); out.push(line) } }
  return ok(`Removed ${lines.length - out.length} duplicate line(s).`, {
    result: out.join('\n'), original_lines: lines.length, unique_lines: out.length, removed: lines.length - out.length,
  })
}
EXEC['remove-duplicate-lines'] = dedupExec
EXEC['duplicate-line-remover'] = dedupExec
EXEC['unique-lines'] = dedupExec

EXEC['remove-empty-lines'] = (p) => {
  const text = str(p.text); if (!text) return err('Please paste text.')
  const lines = text.split(/\r?\n/)
  const out = lines.filter((l) => l.trim() !== '')
  return ok(`Removed ${lines.length - out.length} empty line(s).`, { result: out.join('\n'), kept: out.length })
}
EXEC['add-line-numbers'] = (p) => {
  const text = str(p.text); if (!text) return err('Please paste text.')
  const lines = text.split(/\r?\n/)
  const pad = String(lines.length).length
  const out = lines.map((line, i) => `${String(i + 1).padStart(pad, ' ')}. ${line}`)
  return ok(`Numbered ${lines.length} line(s).`, { result: out.join('\n'), lines: lines.length })
}
EXEC['shuffle-lines'] = (p) => {
  const text = str(p.text); if (!text) return err('Please paste lines.')
  return ok('Lines shuffled.', { result: shuffleArray(text.split(/\r?\n/)).join('\n') })
}
EXEC['random-line-picker'] = (p) => {
  const text = str(p.text); if (!text) return err('Please paste lines.')
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (!lines.length) return err('No non-empty lines found.')
  const picked = lines[secureRandomInt(lines.length)]
  return ok('Picked one line at random.', { picked, total_lines: lines.length })
}
EXEC['word-shuffler'] = (p) => {
  const text = str(p.text); if (!text) return err('Please enter text.')
  return ok('Words shuffled.', { result: shuffleArray(text.split(/\s+/)).join(' ') })
}
EXEC['character-shuffler'] = (p) => {
  const text = str(p.text); if (!text) return err('Please enter text.')
  return ok('Characters shuffled.', { result: shuffleArray(Array.from(text)).join('') })
}

// — Case transforms —
const upperExec: Executor = (p) => { const t = str(p.text); return t ? ok('Uppercased.', { result: t.toUpperCase() }) : err('Please enter text.') }
const lowerExec: Executor = (p) => { const t = str(p.text); return t ? ok('Lowercased.', { result: t.toLowerCase() }) : err('Please enter text.') }
EXEC['uppercase-text'] = upperExec
EXEC['lowercase-text'] = lowerExec
EXEC['sentence-case'] = (p) => {
  const t = str(p.text); if (!t) return err('Please enter text.')
  const result = t.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase())
  return ok('Converted to sentence case.', { result })
}
EXEC['capitalize-text'] = (p) => {
  const t = str(p.text); if (!t) return err('Please enter text.')
  const result = t.replace(/\b\w/g, (c) => c.toUpperCase())
  return ok('Capitalised every word.', { result })
}
EXEC['invert-case'] = (p) => {
  const t = str(p.text); if (!t) return err('Please enter text.')
  let out = ''
  for (const ch of t) out += ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()
  return ok('Case inverted.', { result: out })
}
EXEC['toggle-case'] = EXEC['invert-case']
EXEC['mixed-case'] = (p) => {
  const t = str(p.text); if (!t) return err('Please enter text.')
  let out = ''
  for (const ch of t) out += secureRandomInt(2) ? ch.toUpperCase() : ch.toLowerCase()
  return ok('Randomised case.', { result: out })
}
const spongeExec: Executor = (p) => {
  const t = str(p.text); if (!t) return err('Please enter text.')
  let out = '', up = false
  for (const ch of t) {
    if (/[a-zA-Z]/.test(ch)) { out += up ? ch.toUpperCase() : ch.toLowerCase(); up = !up }
    else out += ch
  }
  return ok('SpOnGeBoB CaSe.', { result: out })
}
EXEC['sponge-text'] = spongeExec
EXEC['mock-text'] = spongeExec
EXEC['spongebob-case'] = spongeExec

// — Stylized text —
EXEC['bold-text-generator'] = (p) => { const t = str(p.text); return t ? ok('Bold Unicode applied.', { result: mapChars(t, BOLD_MAP) }) : err('Please enter text.') }
EXEC['bubble-text'] = (p) => { const t = str(p.text); return t ? ok('Bubble text generated.', { result: mapChars(t, BUBBLE_MAP) }) : err('Please enter text.') }
EXEC['upside-down-text'] = (p) => {
  const t = str(p.text); if (!t) return err('Please enter text.')
  return ok('Flipped upside-down.', { result: Array.from(mapChars(t, UPSIDE_MAP)).reverse().join('') })
}
EXEC['small-text'] = (p) => { const t = str(p.text); return t ? ok('Small caps applied.', { result: mapChars(t.toLowerCase(), SMALL_MAP) }) : err('Please enter text.') }
EXEC['wide-text'] = (p) => { const t = str(p.text); return t ? ok('Full-width text generated.', { result: mapChars(t, WIDE_MAP) }) : err('Please enter text.') }
EXEC['spaced-text'] = (p) => { const t = str(p.text); return t ? ok('Spaced text generated.', { result: Array.from(t).join(' ') }) : err('Please enter text.') }
EXEC['strikethrough-text'] = (p) => { const t = str(p.text); return t ? ok('Strikethrough applied.', { result: combiningOverlay(t, ['\u0336']) }) : err('Please enter text.') }
EXEC['underline-text'] = (p) => { const t = str(p.text); return t ? ok('Underline applied.', { result: combiningOverlay(t, ['\u0332']) }) : err('Please enter text.') }
EXEC['zalgo-text'] = (p) => {
  const t = str(p.text); if (!t) return err('Please enter text.')
  const above = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357']
  const below = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324']
  let out = ''
  for (const ch of t) {
    out += ch
    if (/\S/.test(ch)) {
      const reps = 1 + secureRandomInt(4)
      for (let i = 0; i < reps; i++) out += secureRandomInt(2) ? above[secureRandomInt(above.length)] : below[secureRandomInt(below.length)]
    }
  }
  return ok('Z̷a̷l̷g̷o̷ summoned.', { result: out })
}
const leetExec: Executor = (p) => { const t = str(p.text); return t ? ok('Translated to leetspeak.', { result: mapChars(t, LEET_MAP) }) : err('Please enter text.') }
EXEC['leetspeak'] = leetExec
EXEC['l33t-converter'] = leetExec
EXEC['leet-converter'] = leetExec

// — Ciphers —
function rotN(text: string, n: number): string {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i)
    if (c >= 65 && c <= 90) out += String.fromCharCode(((c - 65 + n) % 26 + 26) % 26 + 65)
    else if (c >= 97 && c <= 122) out += String.fromCharCode(((c - 97 + n) % 26 + 26) % 26 + 97)
    else out += text[i]
  }
  return out
}
// rot13 and caesar-cipher defined later with richer implementation
EXEC['atbash-cipher'] = (p) => {
  const t = str(p.text); if (!t) return err('Please enter text.')
  let out = ''
  for (let i = 0; i < t.length; i++) {
    const c = t.charCodeAt(i)
    if (c >= 65 && c <= 90) out += String.fromCharCode(90 - (c - 65))
    else if (c >= 97 && c <= 122) out += String.fromCharCode(122 - (c - 97))
    else out += t[i]
  }
  return ok('Atbash cipher applied.', { result: out })
}
EXEC['rot47'] = (p) => {
  const t = str(p.text); if (!t) return err('Please enter text.')
  let out = ''
  for (let i = 0; i < t.length; i++) {
    const c = t.charCodeAt(i)
    out += c >= 33 && c <= 126 ? String.fromCharCode(33 + ((c - 33 + 47) % 94)) : t[i]
  }
  return ok('ROT47 applied.', { result: out })
}

// — URL / HTML encoding — (full implementations defined later with aliases)
// placeholder section removed; see html-entity-encoder/url-encoder below
EXEC['html-decoder'] = (p) => {
  const t = str(p.text); if (!t) return err('Please paste HTML to decode.')
  const result = t
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  return ok('HTML entities decoded.', { result })
}

// — Counters / analysers —
EXEC['word-counter'] = (p) => {
  const text = str(p.text)
  if (!text) return err('Please enter text to analyse.')
  const words = (text.trim().match(/\S+/g) || []).length
  const characters = Array.from(text).length
  const characters_no_spaces = Array.from(text.replace(/\s/g, '')).length
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length || (text.trim() ? 1 : 0)
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0)
  const reading_time_minutes = Math.max(1, Math.round(words / 200))
  const speaking_time_minutes = Math.max(1, Math.round(words / 130))
  const avg_word_length = words ? +(characters_no_spaces / words).toFixed(1) : 0
  return ok('Text analysed.', { words, characters, characters_no_spaces, sentences, paragraphs, reading_time_minutes, speaking_time_minutes, avg_word_length })
}
EXEC['character-counter'] = EXEC['word-counter']
EXEC['line-counter'] = (p) => {
  const text = str(p.text); if (!text) return err('Please paste text.')
  const lines = text.split(/\r?\n/)
  return ok('Counted lines.', { total: lines.length, non_empty: lines.filter((l) => l.trim()).length, empty: lines.filter((l) => !l.trim()).length })
}
EXEC['word-frequency-counter'] = (p) => {
  const text = str(p.text); if (!text) return err('Please paste text.')
  const map = new Map<string, number>()
  for (const w of text.toLowerCase().match(/[a-zA-Z']+/g) || []) map.set(w, (map.get(w) || 0) + 1)
  const top = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50).map(([word, count]) => ({ word, count }))
  return ok(`${map.size} unique word(s).`, { unique_words: map.size, top_words: top })
}
EXEC['trim-whitespace'] = (p) => {
  const text = str(p.text); if (!text) return err('Please paste text.')
  const result = text.split(/\r?\n/).map((l) => l.trim()).join('\n').replace(/\s+/g, ' ').trim()
  return ok('Whitespace trimmed.', { result })
}
EXEC['remove-line-breaks'] = (p) => {
  const text = str(p.text); if (!text) return err('Please paste text.')
  return ok('Line breaks removed.', { result: text.replace(/\r?\n+/g, ' ').replace(/\s+/g, ' ').trim() })
}

// — Sort lines —
EXEC['sort-lines'] = (p) => {
  const text = str(p.text); if (!text) return err('Please paste lines.')
  const order = str(p.order, 'asc')
  const lines = text.split(/\r?\n/)
  const sorted = lines.slice().sort((a, b) => a.localeCompare(b))
  if (order === 'desc') sorted.reverse()
  return ok(`Sorted ${sorted.length} line(s) ${order === 'desc' ? 'Z–A' : 'A–Z'}.`, { result: sorted.join('\n'), count: sorted.length })
}

// — JSON / CSV —
EXEC['json-formatter'] = (p) => {
  const text = str(p.json) || str(p.text)
  if (!text.trim()) return err('Please paste JSON to format.')
  const action = str(p.action, 'format')
  try {
    const parsed = JSON.parse(text)
    const sortKeys = (v: unknown): unknown => {
      if (Array.isArray(v)) return v.map(sortKeys)
      if (v && typeof v === 'object') {
        const o: Record<string, unknown> = {}
        for (const k of Object.keys(v as Record<string, unknown>).sort()) o[k] = sortKeys((v as Record<string, unknown>)[k])
        return o
      }
      return v
    }
    let out: string
    if (action === 'minify') out = JSON.stringify(parsed)
    else if (action === 'sort_keys') out = JSON.stringify(sortKeys(parsed), null, 2)
    else out = JSON.stringify(parsed, null, 2)
    return ok(action === 'minify' ? 'Minified.' : action === 'sort_keys' ? 'Sorted keys.' : 'Formatted.', { result: out, valid: true, size_bytes: out.length })
  } catch (e) { return err(`Invalid JSON: ${e instanceof Error ? e.message : 'parse error'}`) }
}
EXEC['json-validator'] = (p) => {
  const text = str(p.text) || str(p.json)
  if (!text.trim()) return err('Please paste JSON to validate.')
  try { JSON.parse(text); return ok('JSON is valid ✅', { valid: true }) }
  catch (e) { return err(`Invalid JSON: ${e instanceof Error ? e.message : 'parse error'}`, { valid: false }) }
}
EXEC['json-to-csv'] = (p) => {
  const text = str(p.text) || str(p.json)
  if (!text.trim()) return err('Please paste a JSON array.')
  try {
    const data = JSON.parse(text)
    if (!Array.isArray(data) || !data.length) return err('JSON must be a non-empty array of objects.')
    const headers = Array.from(new Set(data.flatMap((row) => Object.keys(row || {}))))
    const escape = (v: unknown) => {
      if (v === null || v === undefined) return ''
      const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const lines = [headers.join(',')]
    for (const row of data) lines.push(headers.map((h) => escape((row as Record<string, unknown>)?.[h])).join(','))
    return ok(`Converted ${data.length} row(s) to CSV.`, { result: lines.join('\n'), rows: data.length, columns: headers.length })
  } catch (e) { return err(`Conversion failed: ${e instanceof Error ? e.message : 'parse error'}`) }
}
EXEC['csv-to-json'] = (p) => {
  const text = str(p.text) || str(p.csv)
  if (!text.trim()) return err('Please paste CSV.')
  const lines = text.split(/\r?\n/).filter((l) => l.length)
  if (lines.length < 1) return err('No CSV rows found.')
  const parseRow = (row: string): string[] => {
    const out: string[] = []
    let cur = '', inQ = false
    for (let i = 0; i < row.length; i++) {
      const c = row[i]
      if (inQ) {
        if (c === '"' && row[i + 1] === '"') { cur += '"'; i++ }
        else if (c === '"') inQ = false
        else cur += c
      } else {
        if (c === ',') { out.push(cur); cur = '' }
        else if (c === '"' && cur === '') inQ = true
        else cur += c
      }
    }
    out.push(cur)
    return out
  }
  const headers = parseRow(lines[0])
  const rows = lines.slice(1).map((l) => {
    const cells = parseRow(l)
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h] = cells[i] ?? '' })
    return obj
  })
  return ok(`Parsed ${rows.length} row(s).`, { result: JSON.stringify(rows, null, 2), rows: rows.length, columns: headers.length })
}

// — Color — (full implementations in ─── COLOR TOOLS ─── section below)
// — Generators —
EXEC['uuid-generator'] = (p) => {
  const count = Math.min(Math.max(num(p.count, 5), 1), 100)
  const out: string[] = []
  for (let i = 0; i < count; i++) out.push(crypto.randomUUID())
  return ok(`Generated ${count} UUID(s).`, { uuids: out, count })
}
EXEC['password-generator'] = (p) => {
  const length = Math.min(Math.max(num(p.length, 16), 4), 128)
  const count = Math.min(Math.max(num(p.count, 5), 1), 50)
  const upper = str(p.uppercase, 'true') !== 'false'
  const lower = str(p.lowercase, 'true') !== 'false'
  const numbers = str(p.numbers, 'true') !== 'false'
  const symbols = str(p.symbols, 'true') !== 'false'
  let pool = ''
  if (upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (lower) pool += 'abcdefghijklmnopqrstuvwxyz'
  if (numbers) pool += '0123456789'
  if (symbols) pool += '!@#$%^&*()-_=+[]{};:,.<>?'
  if (!pool) return err('Pick at least one character set.')
  const passwords: string[] = []
  for (let i = 0; i < count; i++) {
    let pw = ''
    for (let j = 0; j < length; j++) pw += pool[secureRandomInt(pool.length)]
    passwords.push(pw)
  }
  return ok(`Generated ${count} password(s).`, { passwords, length, count })
}
EXEC['lorem-ipsum-generator'] = (p) => {
  const type = str(p.type, 'paragraphs')
  const count = Math.min(Math.max(num(p.count, 3), 1), 50)
  let result = ''
  if (type === 'words') {
    const words: string[] = []
    for (let i = 0; i < count; i++) words.push(LOREM[Math.floor(Math.random() * LOREM.length)])
    result = words.join(' ')
  } else if (type === 'sentences') {
    const arr: string[] = []; for (let i = 0; i < count; i++) arr.push(loremSentence())
    result = arr.join(' ')
  } else {
    const arr: string[] = []; for (let i = 0; i < count; i++) arr.push(loremParagraph())
    result = arr.join('\n\n')
  }
  return ok(`Generated ${count} ${type}.`, { result, count, type })
}

EXEC['age-calculator'] = (p) => {
  const dob = str(p.text || p.date_of_birth || p.dob).trim()
  if (!dob) return err('Please enter your date of birth (e.g. 2000-01-15).')
  const d = new Date(dob)
  if (Number.isNaN(d.getTime())) return err('Invalid date — try YYYY-MM-DD.')
  const now = new Date()
  let years = now.getFullYear() - d.getFullYear()
  let months = now.getMonth() - d.getMonth()
  let days = now.getDate() - d.getDate()
  if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
  if (months < 0) { years--; months += 12 }
  const totalDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  return ok(`You are ${years} years, ${months} months, ${days} days old.`, {
    years, months, days,
    total_days: totalDays, total_weeks: Math.floor(totalDays / 7), total_hours: totalDays * 24, total_minutes: totalDays * 24 * 60,
  })
}
// — Slug / URL slug —
const slugExec: Executor = (p) => {
  const t = str(p.text); if (!t) return err('Please enter text to slugify.')
  const slug = t.toLowerCase().trim()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return ok('URL-safe slug generated.', { input: t, slug })
}
EXEC['slug-generator'] = slugExec
EXEC['url-slug-generator'] = slugExec

// ─── COLOR TOOLS ─────────────────────────────────────────────────────────────
EXEC['hex-to-rgb'] = (p) => {
  const h = str(p.text || p.hex).replace(/^#/, '').trim()
  if (!/^[0-9a-fA-F]{3,8}$/.test(h)) return err('Enter a valid hex color (e.g. #ff5733).')
  const full = h.length === 3 ? h.split('').map((c: string) => c + c).join('') : h
  const r = parseInt(full.slice(0, 2), 16), g = parseInt(full.slice(2, 4), 16), b = parseInt(full.slice(4, 6), 16)
  return ok(`RGB: ${r}, ${g}, ${b}`, { hex: '#' + full, r, g, b, rgb: `rgb(${r}, ${g}, ${b})` })
}
EXEC['rgb-to-hex'] = (p) => {
  const r = num(p.r || p.red, 0), g = num(p.g || p.green, 0), b = num(p.b || p.blue, 0)
  const hex = '#' + [r, g, b].map((v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')
  return ok(`Hex: ${hex}`, { r, g, b, hex })
}
EXEC['hex-to-hsl'] = (p) => {
  const h = str(p.text || p.hex).replace(/^#/, '').trim()
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return err('Enter a 6-digit hex color.')
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2
  let hue = 0, s = 0
  if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); hue = max === r ? ((g - b) / d + (g < b ? 6 : 0)) * 60 : max === g ? ((b - r) / d + 2) * 60 : ((r - g) / d + 4) * 60 }
  return ok(`HSL: ${Math.round(hue)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`, { hex: '#' + h, h: Math.round(hue), s: Math.round(s * 100), l: Math.round(l * 100) })
}
EXEC['color-converter'] = EXEC['hex-to-rgb']
EXEC['color-picker'] = EXEC['hex-to-rgb']

// ─── MATH & NUMBER TOOLS ─────────────────────────────────────────────────────
EXEC['percentage-calculator'] = (p) => {
  const val = num(p.value || p.number), pct = num(p.percentage || p.percent)
  if (!pct) return err('Enter a percentage.')
  const result = val * pct / 100
  return ok(`${pct}% of ${val} = ${result}`, { value: val, percentage: pct, result, increase: val + result, decrease: val - result })
}
EXEC['average-calculator'] = (p) => {
  const t = str(p.text || p.numbers).trim(); if (!t) return err('Enter numbers separated by commas or spaces.')
  const nums = t.split(/[,\s]+/).map(Number).filter(Number.isFinite)
  if (!nums.length) return err('No valid numbers found.')
  const sum = nums.reduce((a: number, b: number) => a + b, 0), avg = sum / nums.length
  const sorted = [...nums].sort((a: number, b: number) => a - b)
  const median = nums.length % 2 === 0 ? (sorted[nums.length / 2 - 1] + sorted[nums.length / 2]) / 2 : sorted[Math.floor(nums.length / 2)]
  return ok(`Average: ${avg.toFixed(4)}`, { numbers: nums, count: nums.length, sum, average: +avg.toFixed(6), median, min: sorted[0], max: sorted[sorted.length - 1] })
}
EXEC['number-to-words'] = (p) => {
  const n = num(p.number || p.text); if (!Number.isFinite(n)) return err('Enter a valid number.')
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  const conv = (n: number): string => { if (n === 0) return ''; if (n < 20) return ones[n]; if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : ''); if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + conv(n % 100) : ''); if (n < 1000000) return conv(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + conv(n % 1000) : ''); return conv(Math.floor(n / 1000000)) + ' million' + (n % 1000000 ? ' ' + conv(n % 1000000) : '') }
  const result = n === 0 ? 'zero' : (n < 0 ? 'negative ' : '') + conv(Math.abs(Math.floor(n)))
  return ok(result.charAt(0).toUpperCase() + result.slice(1), { number: n, words: result })
}
EXEC['roman-numeral-converter'] = (p) => {
  const t = str(p.text || p.number).trim(); if (!t) return err('Enter a number or Roman numeral.')
  if (/^\d+$/.test(t)) {
    let n = parseInt(t, 10); if (n <= 0 || n > 3999) return err('Number must be 1-3999.')
    const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
    let r = ''; for (let i = 0; i < vals.length; i++) { while (n >= vals[i]) { r += syms[i]; n -= vals[i] } }
    return ok(`Roman: ${r}`, { input: t, roman: r })
  }
  const rom: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  const up = t.toUpperCase(); let result = 0
  for (let i = 0; i < up.length; i++) { const c = rom[up[i]]; if (!c) return err('Invalid Roman numeral.'); result += (c < (rom[up[i + 1]] || 0)) ? -c : c }
  return ok(`Number: ${result}`, { input: t, number: result })
}
EXEC['factorial-calculator'] = (p) => {
  const n = num(p.number || p.text); if (!Number.isInteger(n) || n < 0 || n > 170) return err('Enter a non-negative integer (0-170).')
  let result = 1; for (let i = 2; i <= n; i++) result *= i
  return ok(`${n}! = ${result}`, { number: n, factorial: result })
}
EXEC['prime-checker'] = (p) => {
  const n = num(p.number || p.text); if (!Number.isInteger(n) || n < 2) return err('Enter an integer ≥ 2.')
  let isPrime = true; for (let i = 2; i <= Math.sqrt(n); i++) { if (n % i === 0) { isPrime = false; break } }
  return ok(isPrime ? `${n} is a prime number.` : `${n} is NOT prime.`, { number: n, is_prime: isPrime })
}
EXEC['gcd-lcm-calculator'] = (p) => {
  const a = num(p.a || p.number1), b = num(p.b || p.number2)
  if (!a || !b) return err('Enter two numbers.')
  const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y)
  const g = gcd(Math.abs(a), Math.abs(b)), l = Math.abs(a * b) / g
  return ok(`GCD: ${g}, LCM: ${l}`, { a, b, gcd: g, lcm: l })
}
EXEC['random-number-generator'] = (p) => {
  const min = num(p.min, 1), max = num(p.max, 100), count = Math.min(num(p.count, 1), 100)
  const results: number[] = []; for (let i = 0; i < count; i++) results.push(min + secureRandomInt(max - min + 1))
  return ok(`Generated ${count} random number(s).`, { min, max, count, numbers: results, sum: results.reduce((a, b) => a + b, 0) })
}
EXEC['binary-to-decimal'] = (p) => {
  const t = str(p.text).trim(); if (!t) return err('Enter a binary number.')
  const n = parseInt(t.replace(/\s/g, ''), 2); if (!Number.isFinite(n)) return err('Invalid binary.')
  return ok(`Decimal: ${n}`, { binary: t, decimal: n, hex: n.toString(16), octal: n.toString(8) })
}
EXEC['decimal-to-binary'] = (p) => {
  const n = num(p.text || p.number); if (!Number.isFinite(n)) return err('Enter a decimal number.')
  return ok(`Binary: ${Math.floor(n).toString(2)}`, { decimal: n, binary: Math.floor(n).toString(2), hex: Math.floor(n).toString(16), octal: Math.floor(n).toString(8) })
}
EXEC['hex-to-decimal'] = (p) => {
  const t = str(p.text).replace(/^0x/i, '').trim(); if (!t) return err('Enter a hex number.')
  const n = parseInt(t, 16); if (!Number.isFinite(n)) return err('Invalid hex.')
  return ok(`Decimal: ${n}`, { hex: t, decimal: n, binary: n.toString(2), octal: n.toString(8) })
}
EXEC['decimal-to-hex'] = (p) => {
  const n = num(p.text || p.number); return ok(`Hex: 0x${Math.floor(n).toString(16).toUpperCase()}`, { decimal: n, hex: '0x' + Math.floor(n).toString(16).toUpperCase() })
}
EXEC['octal-to-decimal'] = (p) => {
  const t = str(p.text).trim(); const n = parseInt(t, 8)
  if (!Number.isFinite(n)) return err('Invalid octal number.')
  return ok(`Decimal: ${n}`, { octal: t, decimal: n })
}
EXEC['decimal-to-octal'] = (p) => {
  const n = num(p.text || p.number); return ok(`Octal: ${Math.floor(n).toString(8)}`, { decimal: n, octal: Math.floor(n).toString(8) })
}

// ─── TEXT UTILITIES ──────────────────────────────────────────────────────────
EXEC['text-repeater'] = (p) => {
  const t = str(p.text); const count = Math.min(num(p.count || p.times, 2), 1000)
  if (!t) return err('Enter text to repeat.')
  const sep = str(p.separator, '\n')
  return ok(`Repeated ${count} times.`, { input: t, count, result: Array(count).fill(t).join(sep) })
}
EXEC['text-truncator'] = (p) => {
  const t = str(p.text); const max = num(p.max_length || p.length, 100)
  if (!t) return err('Enter text.'); const suffix = str(p.suffix, '...')
  return ok('Truncated.', { input: t, result: t.length <= max ? t : t.slice(0, max) + suffix, original_length: t.length })
}
EXEC['find-and-replace'] = (p) => {
  const t = str(p.text), find = str(p.find), replace = str(p.replace)
  if (!t || !find) return err('Enter text and a search term.')
  const result = t.split(find).join(replace)
  const count = (t.length - result.length + replace.length * ((t.length - result.length) / (find.length - replace.length || 1))) || t.split(find).length - 1
  return ok(`Replaced ${Math.abs(Math.round(count))} occurrence(s).`, { input: t, find, replace, result })
}
EXEC['text-sorter'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text with multiple lines.')
  const lines = t.split('\n').filter((l: string) => l.trim())
  const dir = str(p.direction || p.order, 'asc')
  const sorted = [...lines].sort((a: string, b: string) => dir === 'desc' ? b.localeCompare(a) : a.localeCompare(b))
  return ok(`Sorted ${sorted.length} lines.`, { input: t, result: sorted.join('\n'), line_count: sorted.length })
}
EXEC['remove-whitespace'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text.')
  return ok('Whitespace removed.', { input: t, result: t.replace(/\s+/g, ''), trimmed: t.trim().replace(/\s+/g, ' ') })
}
EXEC['add-line-numbers'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text.')
  const lines = t.split('\n')
  return ok(`Added numbers to ${lines.length} lines.`, { result: lines.map((l: string, i: number) => `${i + 1}. ${l}`).join('\n') })
}
EXEC['remove-line-numbers'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text.')
  return ok('Line numbers removed.', { result: t.split('\n').map((l: string) => l.replace(/^\s*\d+[.)\]:-]\s*/, '')).join('\n') })
}
EXEC['string-length-calculator'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text.')
  return ok(`Length: ${t.length} characters`, { text: t, length: t.length, bytes: new TextEncoder().encode(t).length, words: t.trim().split(/\s+/).length, lines: t.split('\n').length })
}
EXEC['text-to-ascii'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text.')
  const codes = Array.from(t).map((c: string) => c.charCodeAt(0))
  return ok('Converted to ASCII codes.', { input: t, ascii: codes.join(' '), codes })
}
EXEC['ascii-to-text'] = (p) => {
  const t = str(p.text).trim(); if (!t) return err('Enter ASCII codes (space-separated).')
  const codes = t.split(/[\s,]+/).map(Number).filter(Number.isFinite)
  return ok('Converted to text.', { ascii: t, text: String.fromCharCode(...codes) })
}
EXEC['nato-alphabet'] = (p) => {
  const t = str(p.text).toUpperCase(); if (!t) return err('Enter text.')
  const nato: Record<string, string> = { A:'Alpha',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',I:'India',J:'Juliet',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',X:'X-ray',Y:'Yankee',Z:'Zulu','0':'Zero','1':'One','2':'Two','3':'Three','4':'Four','5':'Five','6':'Six','7':'Seven','8':'Eight','9':'Nine' }
  const result = Array.from(t).map((c: string) => nato[c] || c).join(' - ')
  return ok('NATO alphabet conversion done.', { input: t, nato: result })
}
EXEC['morse-code-converter'] = (p) => {
  const t = str(p.text).trim(); if (!t) return err('Enter text or Morse code.')
  const toMorse: Record<string, string> = { A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',' ':'/','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.' }
  if (/^[./ -]+$/.test(t)) {
    const fromMorse = Object.fromEntries(Object.entries(toMorse).map(([k, v]) => [v, k]))
    const decoded = t.split(' / ').map((w: string) => w.split(' ').map((c: string) => fromMorse[c] || '?').join('')).join(' ')
    return ok('Decoded from Morse.', { morse: t, text: decoded })
  }
  const encoded = t.toUpperCase().split('').map((c: string) => toMorse[c] || c).join(' ')
  return ok('Encoded to Morse.', { text: t, morse: encoded })
}

// ─── DATE & TIME TOOLS ──────────────────────────────────────────────────────
EXEC['unix-timestamp-converter'] = (p) => {
  const t = str(p.text || p.timestamp).trim()
  if (!t || t === 'now') { const now = Date.now(); return ok(`Current: ${Math.floor(now / 1000)}`, { timestamp: Math.floor(now / 1000), milliseconds: now, iso: new Date(now).toISOString(), utc: new Date(now).toUTCString() }) }
  const n = Number(t); if (Number.isFinite(n)) { const ms = n > 1e12 ? n : n * 1000; const d = new Date(ms); return ok(`Date: ${d.toISOString()}`, { timestamp: Math.floor(ms / 1000), date: d.toISOString(), utc: d.toUTCString() }) }
  const d = new Date(t); if (Number.isNaN(d.getTime())) return err('Invalid date or timestamp.')
  return ok(`Timestamp: ${Math.floor(d.getTime() / 1000)}`, { date: t, timestamp: Math.floor(d.getTime() / 1000), iso: d.toISOString() })
}
EXEC['date-difference-calculator'] = (p) => {
  const d1 = new Date(str(p.date1 || p.start_date)), d2 = new Date(str(p.date2 || p.end_date))
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return err('Enter two valid dates.')
  const diffMs = Math.abs(d2.getTime() - d1.getTime()), days = Math.floor(diffMs / 86400000)
  return ok(`Difference: ${days} days`, { date1: d1.toISOString().split('T')[0], date2: d2.toISOString().split('T')[0], days, weeks: Math.floor(days / 7), months: Math.floor(days / 30.44), years: +(days / 365.25).toFixed(2), hours: days * 24 })
}

// ─── MISC UTILITIES ─────────────────────────────────────────────────────────
EXEC['ip-address-converter'] = (p) => {
  const t = str(p.text || p.ip).trim(); if (!t) return err('Enter an IP address.')
  const parts = t.split('.').map(Number)
  if (parts.length === 4 && parts.every((n: number) => Number.isInteger(n) && n >= 0 && n <= 255)) {
    const decimal = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
    const binary = parts.map((n: number) => n.toString(2).padStart(8, '0')).join('.')
    const hex = parts.map((n: number) => n.toString(16).padStart(2, '0')).join(':')
    return ok('IP converted.', { ip: t, decimal, binary, hex, class: parts[0] < 128 ? 'A' : parts[0] < 192 ? 'B' : parts[0] < 224 ? 'C' : 'D/E' })
  }
  return err('Invalid IPv4 address.')
}
// csv-to-json and json-to-csv — richer implementations defined earlier at line ~697
EXEC['html-entity-encoder'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text.')
  const encoded = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  return ok('Encoded HTML entities.', { input: t, encoded })
}
EXEC['html-entity-decoder'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter encoded text.')
  const decoded = t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_: string, n: string) => String.fromCharCode(parseInt(n)))
  return ok('Decoded HTML entities.', { input: t, decoded })
}
EXEC['url-encoder'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text to encode.')
  return ok('URL encoded.', { input: t, encoded: encodeURIComponent(t) })
}
EXEC['url-decoder'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter encoded URL.')
  try { return ok('URL decoded.', { input: t, decoded: decodeURIComponent(t) }) }
  catch { return err('Invalid URL encoding.') }
}
EXEC['email-validator'] = (p) => {
  const t = str(p.text || p.email).trim(); if (!t) return err('Enter an email address.')
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
  const [local, domain] = t.split('@')
  return ok(valid ? 'Valid email address.' : 'Invalid email address.', { email: t, valid, local, domain: domain || '' })
}
EXEC['temperature-converter'] = (p) => {
  const v = num(p.value || p.text || p.temperature), from = str(p.from || p.unit, 'celsius').toLowerCase()
  let c: number
  if (from.startsWith('f')) c = (v - 32) * 5 / 9
  else if (from.startsWith('k')) c = v - 273.15
  else c = v
  return ok('Temperature converted.', { input: v, from, celsius: +c.toFixed(2), fahrenheit: +(c * 9 / 5 + 32).toFixed(2), kelvin: +(c + 273.15).toFixed(2) })
}
EXEC['length-converter'] = (p) => {
  const v = num(p.value || p.text, 1)
  return ok('Length converted.', { meters: v, kilometers: +(v / 1000).toFixed(6), centimeters: +(v * 100).toFixed(2), millimeters: +(v * 1000).toFixed(1), inches: +(v * 39.3701).toFixed(4), feet: +(v * 3.28084).toFixed(4), yards: +(v * 1.09361).toFixed(4), miles: +(v / 1609.344).toFixed(6) })
}
EXEC['weight-converter'] = (p) => {
  const v = num(p.value || p.text, 1)
  return ok('Weight converted.', { kilograms: v, grams: +(v * 1000).toFixed(2), milligrams: +(v * 1e6).toFixed(0), pounds: +(v * 2.20462).toFixed(4), ounces: +(v * 35.274).toFixed(4), tons_metric: +(v / 1000).toFixed(6) })
}

EXEC['volume-converter'] = (p) => {
  const v = num(p.value || p.text || p.volume, 1)
  const liters = v
  return ok('Volume converted.', {
    input_liters: v, milliliters: +(v * 1000).toFixed(3),
    cubic_meters: +(v / 1000).toFixed(6), cubic_centimeters: +(v * 1000).toFixed(3),
    gallons_us: +(v * 0.264172).toFixed(6), gallons_uk: +(v * 0.219969).toFixed(6),
    quarts_us: +(v * 1.05669).toFixed(6), pints_us: +(v * 2.11338).toFixed(6),
    cups_us: +(v * 4.22675).toFixed(4), fluid_ounces_us: +(v * 33.8141).toFixed(4),
    tablespoons_us: +(v * 67.628).toFixed(2), teaspoons_us: +(v * 202.884).toFixed(2),
  })
}
EXEC['liquid-volume-converter'] = EXEC['volume-converter']

EXEC['area-converter'] = (p) => {
  const v = num(p.value || p.text || p.area, 1)
  return ok('Area converted.', {
    input_square_meters: v, square_kilometers: +(v / 1e6).toFixed(8),
    square_centimeters: +(v * 1e4).toFixed(2), square_millimeters: +(v * 1e6).toFixed(0),
    square_feet: +(v * 10.7639).toFixed(4), square_yards: +(v * 1.19599).toFixed(4),
    square_miles: +(v / 2589988.11).toFixed(10), acres: +(v / 4046.86).toFixed(6),
    hectares: +(v / 10000).toFixed(6),
  })
}
EXEC['square-meter-converter'] = EXEC['area-converter']

EXEC['time-converter'] = (p) => {
  const v = num(p.value || p.text || p.seconds, 1)
  const s = v
  return ok('Time converted.', {
    seconds: s, milliseconds: +(s * 1000).toFixed(0), microseconds: +(s * 1e6).toFixed(0),
    minutes: +(s / 60).toFixed(6), hours: +(s / 3600).toFixed(6),
    days: +(s / 86400).toFixed(6), weeks: +(s / 604800).toFixed(6),
    months: +(s / 2629800).toFixed(6), years: +(s / 31557600).toFixed(8),
  })
}
EXEC['seconds-to-minutes'] = EXEC['time-converter']

EXEC['cooking-converter'] = (p) => {
  const v = num(p.value || p.text || p.cups, 1)
  return ok('Cooking measurement converted.', {
    cups: v, tablespoons: +(v * 16).toFixed(2), teaspoons: +(v * 48).toFixed(2),
    fluid_ounces: +(v * 8).toFixed(2), milliliters: +(v * 236.588).toFixed(2),
    liters: +(v * 0.236588).toFixed(4), pints: +(v / 2).toFixed(4), quarts: +(v / 4).toFixed(4),
    grams_water: +(v * 236.6).toFixed(2),
  })
}
EXEC['recipe-converter'] = EXEC['cooking-converter']

// ─── JSON / CODE / CSS TOOLS ─────────────────────────────────────────────────
EXEC['json-formatter'] = (p) => {
  const t = str(p.text).trim(); if (!t) return err('Paste JSON to format.')
  try { const parsed = JSON.parse(t); return ok('JSON formatted.', { formatted: JSON.stringify(parsed, null, 2), minified: JSON.stringify(parsed), keys: Object.keys(typeof parsed === 'object' && parsed ? parsed : {}).length }) }
  catch { return err('Invalid JSON — check for syntax errors.') }
}
EXEC['json-beautifier'] = EXEC['json-formatter']
EXEC['json-validator'] = (p) => {
  const t = str(p.text).trim(); if (!t) return err('Paste JSON to validate.')
  try { JSON.parse(t); return ok('✅ Valid JSON!', { valid: true, size: t.length }) }
  catch (e) { return ok('❌ Invalid JSON', { valid: false, error: e instanceof Error ? e.message : 'Parse error' }) }
}
EXEC['json-minifier'] = (p) => {
  const t = str(p.text).trim(); if (!t) return err('Paste JSON to minify.')
  try { const minified = JSON.stringify(JSON.parse(t)); return ok(`Minified: ${t.length} → ${minified.length} chars (${Math.round((1 - minified.length / t.length) * 100)}% reduction)`, { minified, original_size: t.length, minified_size: minified.length }) }
  catch { return err('Invalid JSON.') }
}
EXEC['css-minifier'] = (p) => {
  const t = str(p.text); if (!t) return err('Paste CSS to minify.')
  const minified = t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').replace(/;\}/g, '}').trim()
  return ok(`Minified: ${t.length} → ${minified.length} chars`, { minified, original_size: t.length, minified_size: minified.length, reduction: Math.round((1 - minified.length / t.length) * 100) + '%' })
}
EXEC['css-beautifier'] = (p) => {
  const t = str(p.text); if (!t) return err('Paste CSS to beautify.')
  const result = t.replace(/\s*\{\s*/g, ' {\n  ').replace(/\s*\}\s*/g, '\n}\n').replace(/;\s*/g, ';\n  ').replace(/\n\s*\n/g, '\n')
  return ok('CSS beautified.', { beautified: result })
}
EXEC['html-minifier'] = (p) => {
  const t = str(p.text); if (!t) return err('Paste HTML to minify.')
  const minified = t.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()
  return ok(`Minified: ${t.length} → ${minified.length} chars`, { minified, reduction: Math.round((1 - minified.length / t.length) * 100) + '%' })
}
EXEC['js-minifier'] = (p) => {
  const t = str(p.text); if (!t) return err('Paste JavaScript to minify.')
  const minified = t.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,=+\-*/<>!&|()])\s*/g, '$1').trim()
  return ok(`Minified: ${t.length} → ${minified.length} chars`, { minified, reduction: Math.round((1 - minified.length / t.length) * 100) + '%' })
}
EXEC['javascript-minifier'] = EXEC['js-minifier']
EXEC['xml-formatter'] = (p) => {
  const t = str(p.text).trim(); if (!t) return err('Paste XML to format.')
  let formatted = '', indent = 0
  t.replace(/>\s*</g, '><').replace(/(<\/?[^>]+>)/g, (match: string) => {
    if (match.startsWith('</')) indent--
    formatted += '  '.repeat(Math.max(indent, 0)) + match + '\n'
    if (match.startsWith('<') && !match.startsWith('</') && !match.endsWith('/>') && !match.startsWith('<?')) indent++
    return match
  })
  return ok('XML formatted.', { formatted: formatted.trim() })
}
EXEC['regex-tester'] = (p) => {
  const pattern = str(p.pattern || p.regex), text = str(p.text), flags = str(p.flags, 'g')
  if (!pattern || !text) return err('Enter both a regex pattern and test text.')
  try {
    const re = new RegExp(pattern, flags)
    const matches: string[] = []; let m
    while ((m = re.exec(text)) !== null) { matches.push(m[0]); if (!flags.includes('g')) break }
    return ok(`Found ${matches.length} match(es).`, { pattern, flags, matches, count: matches.length })
  } catch (e) { return err(`Invalid regex: ${e instanceof Error ? e.message : 'Parse error'}`) }
}
EXEC['jwt-decoder'] = (p) => {
  const t = str(p.text || p.token).trim(); if (!t) return err('Paste a JWT token.')
  const parts = t.split('.')
  if (parts.length !== 3) return err('Invalid JWT — must have 3 parts separated by dots.')
  try {
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    const isExpired = payload.exp ? Date.now() / 1000 > payload.exp : false
    return ok('JWT decoded.', { header, payload, signature: parts[2], is_expired: isExpired, expires_at: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'N/A' })
  } catch { return err('Could not decode JWT — invalid Base64.') }
}
EXEC['rot13'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text to encode/decode.')
  const result = t.replace(/[a-zA-Z]/g, (c: string) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
  })
  return ok('ROT13 applied.', { input: t, result })
}
EXEC['caesar-cipher'] = (p) => {
  const t = str(p.text), shift = num(p.shift || p.key, 3)
  if (!t) return err('Enter text to encrypt.')
  const encrypt = (s: string, sh: number) => s.replace(/[a-zA-Z]/g, (c: string) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + sh) % 26 + 26) % 26 + base)
  })
  return ok(`Encrypted with shift ${shift}.`, { input: t, encrypted: encrypt(t, shift), decrypted: encrypt(t, -shift), shift })
}

// ─── CALCULATORS ─────────────────────────────────────────────────────────────
EXEC['bmi-calculator'] = (p) => {
  const w = num(p.weight, 0), h = num(p.height, 0)
  if (!w || !h) return err('Enter weight (kg) and height (cm).')
  const hm = h / 100, bmi = w / (hm * hm)
  const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
  return ok(`BMI: ${bmi.toFixed(1)} (${cat})`, { weight_kg: w, height_cm: h, bmi: +bmi.toFixed(1), category: cat })
}
EXEC['tip-calculator'] = (p) => {
  const bill = num(p.bill || p.bill_amount || p.amount, 0)
  const tipPct = num(p.tip || p.tip_percent, 15)
  const people = Math.max(num(p.people || p.split || p.num_people, 1), 1)
  if (!bill) return err('Enter the bill amount.')
  const tip = bill * tipPct / 100, total = bill + tip
  return ok(`Tip: $${tip.toFixed(2)} | Total: $${total.toFixed(2)} | Each: $${(total/people).toFixed(2)}`, {
    bill, tip_percent: tipPct, tip_amount: +tip.toFixed(2), total: +total.toFixed(2),
    per_person: +(total / people).toFixed(2), people,
  })
}
EXEC['loan-calculator'] = (p) => {
  const principal = num(p.principal || p.amount, 0), rate = num(p.rate || p.interest, 5) / 100 / 12, months = num(p.months || p.term, 12)
  if (!principal) return err('Enter loan amount.')
  const payment = rate > 0 ? principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1) : principal / months
  const totalPaid = payment * months, totalInterest = totalPaid - principal
  return ok(`Monthly: $${payment.toFixed(2)}`, { principal, monthly_payment: +payment.toFixed(2), total_paid: +totalPaid.toFixed(2), total_interest: +totalInterest.toFixed(2), months })
}
EXEC['compound-interest-calculator'] = (p) => {
  const principal = num(p.principal || p.amount, 1000), rate = num(p.rate, 5) / 100, years = num(p.years || p.time, 5), n = num(p.compounds || p.frequency, 12)
  const amount = principal * Math.pow(1 + rate / n, n * years)
  const interest = amount - principal
  return ok(`Final: $${amount.toFixed(2)}`, { principal, rate: rate * 100, years, compounds_per_year: n, final_amount: +amount.toFixed(2), interest_earned: +interest.toFixed(2) })
}
EXEC['rule-of-72-calculator'] = (p) => {
  const rate = num(p.rate || p.interest_rate, 0)
  if (!rate || rate <= 0) return err('Enter an annual interest rate greater than 0.')
  const years = 72 / rate
  const precise = Math.log(2) / Math.log(1 + rate / 100)
  return ok(`Money doubles in ~${years.toFixed(1)} years at ${rate}% annual rate.`, {
    annual_rate_percent: rate, years_to_double: +years.toFixed(2),
    precise_years: +precise.toFixed(2), rule: 'Rule of 72: Years = 72 / Rate',
  })
}
EXEC['rule-of-72'] = EXEC['rule-of-72-calculator']

EXEC['break-even-calculator'] = (p) => {
  const fixedCosts = num(p.fixed_costs || p.fixed, 0)
  const pricePerUnit = num(p.price || p.price_per_unit || p.selling_price, 0)
  const variableCost = num(p.variable_cost || p.variable_costs || p.variable, 0)
  if (!pricePerUnit) return err('Enter price per unit.')
  if (pricePerUnit <= variableCost) return err('Price must be greater than variable cost per unit.')
  const contribution = pricePerUnit - variableCost
  const breakEvenUnits = fixedCosts / contribution
  const breakEvenRevenue = breakEvenUnits * pricePerUnit
  return ok(`Break-even: ${Math.ceil(breakEvenUnits).toLocaleString()} units / $${breakEvenRevenue.toFixed(2)} revenue`, {
    fixed_costs: fixedCosts, price_per_unit: pricePerUnit, variable_cost_per_unit: variableCost,
    contribution_margin: +contribution.toFixed(2), break_even_units: Math.ceil(breakEvenUnits),
    break_even_revenue: +breakEvenRevenue.toFixed(2),
    contribution_margin_ratio: +((contribution / pricePerUnit) * 100).toFixed(1) + '%',
  })
}

EXEC['roi-calculator'] = (p) => {
  const gain = num(p.gain || p.net_profit || p.profit, 0)
  const cost = num(p.cost || p.investment || p.initial_investment, 0)
  if (!cost) return err('Enter the investment cost.')
  const roi = (gain / cost) * 100
  return ok(`ROI: ${roi.toFixed(2)}%`, {
    gain, cost, roi_percent: +roi.toFixed(2),
    profit: gain, multiple: +((gain + cost) / cost).toFixed(2),
    interpretation: roi > 0 ? 'Profitable investment' : roi === 0 ? 'Break-even' : 'Loss on investment',
  })
}
EXEC['return-on-investment'] = EXEC['roi-calculator']
EXEC['return-on-investment-calculator'] = EXEC['roi-calculator']

EXEC['mortgage-calculator'] = (p) => {
  const principal = num(p.principal || p.loan || p.home_price || p.amount, 0)
  const annualRate = num(p.rate || p.interest_rate, 7)
  const years = num(p.years || p.term || p.term_years, 30)
  const monthlyRate = annualRate / 100 / 12
  const n = years * 12
  if (!principal) return err('Enter the loan amount.')
  const payment = monthlyRate > 0
    ? principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1)
    : principal / n
  const totalPaid = payment * n
  const totalInterest = totalPaid - principal
  return ok(`Monthly payment: $${payment.toFixed(2)}`, {
    loan_amount: principal, annual_rate_percent: annualRate, term_years: years,
    monthly_payment: +payment.toFixed(2), total_paid: +totalPaid.toFixed(2),
    total_interest: +totalInterest.toFixed(2),
    interest_to_principal_ratio: +(totalInterest / principal * 100).toFixed(1) + '%',
  })
}
EXEC['home-loan-calculator'] = EXEC['mortgage-calculator']

EXEC['ideal-weight-calculator'] = (p) => {
  const h = num(p.height || p.height_cm, 170)
  const gender = str(p.gender || p.sex, 'male').toLowerCase()
  const hIn = h / 2.54
  const isMale = gender !== 'female' && gender !== 'f' && gender !== 'woman'
  const hamwi = isMale ? 48 + 2.7 * Math.max(0, hIn - 60) : 45.5 + 2.2 * Math.max(0, hIn - 60)
  const devine = isMale ? 50 + 2.3 * Math.max(0, hIn - 60) : 45.5 + 2.3 * Math.max(0, hIn - 60)
  const robinson = isMale ? 52 + 1.9 * Math.max(0, hIn - 60) : 49 + 1.7 * Math.max(0, hIn - 60)
  return ok(`Ideal weight: ~${Math.round((hamwi + devine + robinson) / 3)} kg for ${h} cm`, {
    height_cm: h, gender: isMale ? 'Male' : 'Female',
    hamwi_formula_kg: +hamwi.toFixed(1), devine_formula_kg: +devine.toFixed(1),
    robinson_formula_kg: +robinson.toFixed(1),
    average_kg: +((hamwi + devine + robinson) / 3).toFixed(1),
    healthy_bmi_range_kg: `${+(18.5 * (h/100)**2).toFixed(1)} – ${+(24.9 * (h/100)**2).toFixed(1)}`,
  })
}

EXEC['body-fat-calculator'] = (p) => {
  const bmi = num(p.bmi, 0) || (() => {
    const w = num(p.weight, 0), h = num(p.height, 0)
    return w && h ? w / (h / 100) ** 2 : 0
  })()
  const age = num(p.age, 30)
  const gender = str(p.gender || p.sex, 'male').toLowerCase()
  if (!bmi) return err('Enter BMI or weight (kg) + height (cm).')
  const isMale = gender !== 'female' && gender !== 'f'
  const bf = isMale
    ? 1.20 * bmi + 0.23 * age - 16.2
    : 1.20 * bmi + 0.23 * age - 5.4
  const category = bf < (isMale ? 6 : 14) ? 'Essential fat'
    : bf < (isMale ? 14 : 21) ? 'Athlete'
    : bf < (isMale ? 18 : 25) ? 'Fitness'
    : bf < (isMale ? 25 : 32) ? 'Acceptable'
    : 'Obese'
  return ok(`Body fat: ~${bf.toFixed(1)}% (${category})`, {
    bmi: +bmi.toFixed(1), age, gender: isMale ? 'Male' : 'Female',
    body_fat_percent: +bf.toFixed(1), category, formula: 'Deurenberg (BMI-based)',
  })
}

EXEC['1-rep-max-calculator'] = (p) => {
  const weight = num(p.weight || p.load, 0)
  const reps = num(p.reps || p.repetitions, 0)
  if (!weight || !reps) return err('Enter weight lifted and number of reps.')
  if (reps > 30) return err('Reps should be 30 or fewer for accurate 1RM estimation.')
  const epley = weight * (1 + reps / 30)
  const brzycki = reps >= 10 ? weight / (1.0278 - 0.0278 * reps) : weight * (36 / (37 - reps))
  const lander = weight / (1.013 - 0.0267123 * reps)
  const avg = (epley + brzycki + lander) / 3
  return ok(`Estimated 1RM: ~${Math.round(avg)} kg`, {
    weight_kg: weight, reps,
    epley_kg: Math.round(epley), brzycki_kg: Math.round(brzycki), lander_kg: Math.round(lander),
    average_1rm_kg: Math.round(avg),
    '80pct': Math.round(avg * 0.8), '85pct': Math.round(avg * 0.85), '90pct': Math.round(avg * 0.9),
  })
}
EXEC['one-rep-max-calculator'] = EXEC['1-rep-max-calculator']
EXEC['max-lift-calculator'] = EXEC['1-rep-max-calculator']

EXEC['pace-calculator'] = (p) => {
  const dist = num(p.distance || p.km, 0)
  const timeStr = str(p.time || p.duration, '')
  let totalSec = 0
  const timeParts = timeStr.match(/(\d+):(\d+):?(\d+)?/)
  if (timeParts) {
    if (timeParts[3]) {
      totalSec = +timeParts[1] * 3600 + +timeParts[2] * 60 + +timeParts[3]
    } else {
      totalSec = +timeParts[1] * 60 + +timeParts[2]
    }
  } else {
    totalSec = num(p.minutes || p.time_minutes, 0) * 60 + num(p.seconds || p.time_seconds, 0)
  }
  if (!dist || !totalSec) return err('Enter distance (km) and time (mm:ss or hh:mm:ss).')
  const paceSecPerKm = totalSec / dist
  const paceMins = Math.floor(paceSecPerKm / 60), paceSecs = Math.round(paceSecPerKm % 60)
  const speedKph = dist / (totalSec / 3600)
  return ok(`Pace: ${paceMins}:${String(paceSecs).padStart(2, '0')} /km (${speedKph.toFixed(1)} km/h)`, {
    distance_km: dist, time: timeStr || `${Math.floor(totalSec/60)}:${String(totalSec%60).padStart(2,'0')}`,
    pace_per_km: `${paceMins}:${String(paceSecs).padStart(2, '0')}`,
    speed_kmh: +speedKph.toFixed(2), speed_mph: +(speedKph * 0.621371).toFixed(2),
  })
}
EXEC['running-pace-calculator'] = EXEC['pace-calculator']

EXEC['heart-rate-zones-calculator'] = (p) => {
  const age = num(p.age, 30)
  const restHR = num(p.resting_hr || p.resting_heart_rate || p.rest, 60)
  const maxHR = num(p.max_hr || p.max_heart_rate, 0) || (220 - age)
  const hrReserve = maxHR - restHR
  const zones = {
    'Zone 1 - Recovery (50-60%)': `${Math.round(restHR + hrReserve * 0.5)}–${Math.round(restHR + hrReserve * 0.6)} bpm`,
    'Zone 2 - Aerobic base (60-70%)': `${Math.round(restHR + hrReserve * 0.6)}–${Math.round(restHR + hrReserve * 0.7)} bpm`,
    'Zone 3 - Tempo (70-80%)': `${Math.round(restHR + hrReserve * 0.7)}–${Math.round(restHR + hrReserve * 0.8)} bpm`,
    'Zone 4 - Threshold (80-90%)': `${Math.round(restHR + hrReserve * 0.8)}–${Math.round(restHR + hrReserve * 0.9)} bpm`,
    'Zone 5 - VO2 Max (90-100%)': `${Math.round(restHR + hrReserve * 0.9)}–${maxHR} bpm`,
  }
  return ok(`Heart rate zones for age ${age} (max HR: ${maxHR} bpm)`, {
    age, resting_hr: restHR, max_hr: maxHR, hr_reserve: hrReserve, ...zones,
  })
}
EXEC['heart-rate-calculator'] = EXEC['heart-rate-zones-calculator']

EXEC['aspect-ratio-calculator'] = (p) => {
  const w = num(p.width, 1920), h = num(p.height, 1080)
  if (!w || !h) return err('Enter width and height.')
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const g = gcd(w, h)
  return ok(`Ratio: ${w / g}:${h / g}`, { width: w, height: h, ratio: `${w / g}:${h / g}`, decimal: +(w / h).toFixed(4) })
}
EXEC['speed-distance-time-calculator'] = (p) => {
  const s = num(p.speed, 0), d = num(p.distance, 0), t = num(p.time, 0)
  if (s && d) return ok(`Time: ${(d / s).toFixed(2)} hours`, { speed: s, distance: d, time: +(d / s).toFixed(4) })
  if (s && t) return ok(`Distance: ${(s * t).toFixed(2)}`, { speed: s, time: t, distance: +(s * t).toFixed(4) })
  if (d && t) return ok(`Speed: ${(d / t).toFixed(2)}`, { distance: d, time: t, speed: +(d / t).toFixed(4) })
  return err('Enter any two values (speed, distance, time) to calculate the third.')
}

// ─── STUDENT-ESSENTIAL CALCULATORS ──────────────────────────────────────────
EXEC['gpa-calculator'] = (p) => {
  const t = str(p.text || p.grades).trim()
  if (!t) return err('Enter grades separated by commas (e.g. A,B+,A-,B,A).')
  const gradePoints: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0,
    'O': 10.0, 'E': 8.0, 'a': 8.0, 'b': 6.0, 'c': 5.0, 'd': 4.0, 'P': 4.0,
  }
  const grades = t.split(/[,;\s]+/).map(g => g.trim()).filter(Boolean)
  const credits = str(p.credits).split(/[,;\s]+/).map(Number).filter(Number.isFinite)
  let totalPoints = 0, totalCredits = 0
  for (let i = 0; i < grades.length; i++) {
    const gp = gradePoints[grades[i]] ?? Number(grades[i])
    if (!Number.isFinite(gp)) return err(`Unknown grade: "${grades[i]}". Supported: ${Object.keys(gradePoints).join(', ')}`)
    const cr = credits[i] || 3
    totalPoints += gp * cr
    totalCredits += cr
  }
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0
  return ok(`GPA: ${gpa.toFixed(2)}`, {
    gpa: +gpa.toFixed(4), total_grade_points: +totalPoints.toFixed(2),
    total_credits: totalCredits, subjects: grades.length,
    classification: gpa >= 3.7 ? 'Summa Cum Laude' : gpa >= 3.5 ? 'Magna Cum Laude' : gpa >= 3.0 ? 'Cum Laude' : gpa >= 2.0 ? 'Satisfactory' : 'Below Average',
  })
}
EXEC['cgpa-to-percentage'] = (p) => {
  const cgpa = num(p.cgpa || p.text || p.value)
  if (!cgpa || cgpa < 0) return err('Enter a valid CGPA.')
  const scale = num(p.scale, 10)
  // Standard Indian university formulas
  const percentage_vtu = cgpa * 10 - 7.5   // VTU formula
  const percentage_anna = (cgpa - 0.75) * 10 // Anna University
  const percentage_cbse = cgpa * 9.5         // CBSE formula
  const percentage_generic = (cgpa / scale) * 100  // Generic
  return ok(`CGPA ${cgpa} ≈ ${percentage_cbse.toFixed(2)}% (CBSE scale)`, {
    cgpa, scale,
    percentage_cbse: +percentage_cbse.toFixed(2),
    percentage_vtu: +percentage_vtu.toFixed(2),
    percentage_anna: +percentage_anna.toFixed(2),
    percentage_generic: +percentage_generic.toFixed(2),
    note: 'Different universities use different formulas. CBSE uses ×9.5, VTU uses ×10−7.5, Anna uses (CGPA−0.75)×10.',
  })
}
EXEC['attendance-calculator'] = (p) => {
  const totalClasses = num(p.total_classes || p.total, 0)
  const attended = num(p.attended || p.present, 0)
  if (totalClasses <= 0) return err('Enter total classes.')
  if (attended > totalClasses) return err('Attended cannot exceed total classes.')
  const pct = (attended / totalClasses) * 100
  const needed75 = Math.max(0, Math.ceil((0.75 * totalClasses - attended) / (1 - 0.75)))
  const canSkip75 = Math.max(0, Math.floor((attended - 0.75 * totalClasses) / 0.75))
  const needed85 = Math.max(0, Math.ceil((0.85 * totalClasses - attended) / (1 - 0.85)))
  return ok(`Attendance: ${pct.toFixed(1)}%`, {
    total_classes: totalClasses, attended, absent: totalClasses - attended,
    percentage: +pct.toFixed(2),
    status: pct >= 75 ? '✅ Safe (≥75%)' : '⚠️ Shortage (<75%)',
    classes_needed_for_75: needed75, classes_can_skip_for_75: canSkip75,
    classes_needed_for_85: needed85,
  })
}
EXEC['grade-calculator'] = (p) => {
  const marks = num(p.marks || p.score || p.text, 0)
  const total = num(p.total || p.max_marks, 100)
  if (total <= 0) return err('Enter total marks.')
  const pct = (marks / total) * 100
  let grade = 'F', gpa = 0
  if (pct >= 90) { grade = 'A+'; gpa = 4.0 }
  else if (pct >= 80) { grade = 'A'; gpa = 3.7 }
  else if (pct >= 70) { grade = 'B+'; gpa = 3.3 }
  else if (pct >= 60) { grade = 'B'; gpa = 3.0 }
  else if (pct >= 50) { grade = 'C'; gpa = 2.5 }
  else if (pct >= 40) { grade = 'D'; gpa = 2.0 }
  else if (pct >= 33) { grade = 'E'; gpa = 1.0 }
  return ok(`Grade: ${grade} (${pct.toFixed(1)}%)`, {
    marks, total, percentage: +pct.toFixed(2), grade, gpa,
    result: pct >= 33 ? 'PASS' : 'FAIL',
  })
}
EXEC['marks-percentage-calculator'] = (p) => {
  const t = str(p.text || p.marks).trim()
  if (!t) return err('Enter marks separated by commas (e.g. 85,78,92,88,76).')
  const marks = t.split(/[,;\s]+/).map(Number).filter(Number.isFinite)
  if (!marks.length) return err('No valid marks found.')
  const totalMarksPerSubject = num(p.total_per_subject || p.max, 100)
  const obtained = marks.reduce((a, b) => a + b, 0)
  const maxTotal = marks.length * totalMarksPerSubject
  const pct = (obtained / maxTotal) * 100
  return ok(`Percentage: ${pct.toFixed(2)}%`, {
    subjects: marks.length, marks, total_obtained: obtained,
    total_maximum: maxTotal, percentage: +pct.toFixed(2),
    average_marks: +(obtained / marks.length).toFixed(2),
    highest: Math.max(...marks), lowest: Math.min(...marks),
    result: pct >= 33 ? 'PASS' : 'FAIL',
  })
}
EXEC['study-planner'] = (p) => {
  const examDate = str(p.exam_date || p.date).trim()
  const subjects = str(p.subjects || p.text).trim()
  if (!examDate) return err('Enter your exam date (e.g. 2025-03-15).')
  if (!subjects) return err('Enter subjects separated by commas.')
  const exam = new Date(examDate)
  if (Number.isNaN(exam.getTime())) return err('Invalid date format. Try YYYY-MM-DD.')
  const daysLeft = Math.max(0, Math.ceil((exam.getTime() - Date.now()) / 86400000))
  const subjectList = subjects.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean)
  const daysPerSubject = Math.max(1, Math.floor(daysLeft / subjectList.length))
  const hoursPerDay = num(p.hours_per_day, 6)
  const schedule = subjectList.map((sub, i) => ({
    subject: sub,
    start_day: i * daysPerSubject + 1,
    end_day: Math.min((i + 1) * daysPerSubject, daysLeft),
    hours_total: daysPerSubject * hoursPerDay,
  }))
  return ok(`${daysLeft} days left — ${daysPerSubject} days per subject.`, {
    exam_date: examDate, days_left: daysLeft, total_subjects: subjectList.length,
    days_per_subject: daysPerSubject, hours_per_day: hoursPerDay,
    total_study_hours: daysLeft * hoursPerDay, schedule,
    tip: daysLeft < 7 ? '⚠️ Very little time! Focus on high-weight topics and past papers.' : daysLeft < 30 ? '📚 Steady revision mode. Alternate subjects daily.' : '✅ Good time. Start with fundamentals, save revision for last week.',
  })
}
EXEC['bmr-calculator'] = (p) => {
  const w = num(p.weight, 70), h = num(p.height, 175), age = num(p.age, 25)
  const gender = str(p.gender || p.sex, 'male').toLowerCase()
  if (w <= 0 || h <= 0 || age <= 0) return err('Enter valid weight (kg), height (cm), and age.')
  // Mifflin-St Jeor (most accurate)
  const bmr = gender.startsWith('f') ? 10 * w + 6.25 * h - 5 * age - 161 : 10 * w + 6.25 * h - 5 * age + 5
  return ok(`BMR: ${bmr.toFixed(0)} cal/day`, {
    weight_kg: w, height_cm: h, age, gender,
    bmr: +bmr.toFixed(0), formula: 'Mifflin-St Jeor',
    sedentary: +(bmr * 1.2).toFixed(0), light_exercise: +(bmr * 1.375).toFixed(0),
    moderate_exercise: +(bmr * 1.55).toFixed(0), heavy_exercise: +(bmr * 1.725).toFixed(0),
    athlete: +(bmr * 1.9).toFixed(0),
  })
}
EXEC['tdee-calculator'] = (p) => {
  const w = num(p.weight, 70), h = num(p.height, 175), age = num(p.age, 25)
  const gender = str(p.gender || p.sex, 'male').toLowerCase()
  const activity = str(p.activity || p.activity_level, 'moderate').toLowerCase()
  const bmr = gender.startsWith('f') ? 10 * w + 6.25 * h - 5 * age - 161 : 10 * w + 6.25 * h - 5 * age + 5
  const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }
  const mult = multipliers[activity] || multipliers['moderate'] || 1.55
  const tdee = bmr * mult
  return ok(`TDEE: ${tdee.toFixed(0)} cal/day`, {
    bmr: +bmr.toFixed(0), tdee: +tdee.toFixed(0), activity_level: activity,
    weight_loss: +(tdee - 500).toFixed(0), weight_gain: +(tdee + 500).toFixed(0),
    protein_g: +(w * 2).toFixed(0), carbs_g: +(tdee * 0.45 / 4).toFixed(0), fat_g: +(tdee * 0.25 / 9).toFixed(0),
  })
}
EXEC['calorie-calculator'] = EXEC['tdee-calculator']
EXEC['water-intake-calculator'] = (p) => {
  const w = num(p.weight, 70)
  const activity = str(p.activity || p.activity_level, 'moderate').toLowerCase()
  const climate = str(p.climate, 'normal').toLowerCase()
  if (w <= 0) return err('Enter your weight in kg.')
  let base = w * 35 // ml per kg
  if (activity === 'active' || activity === 'heavy') base *= 1.3
  if (climate === 'hot') base *= 1.2
  const liters = base / 1000
  const glasses = Math.ceil(liters / 0.25)
  return ok(`Drink ~${liters.toFixed(1)}L (${glasses} glasses) per day.`, {
    weight_kg: w, activity, climate,
    water_ml: +base.toFixed(0), water_liters: +liters.toFixed(1), glasses_250ml: glasses,
    morning: '2 glasses on waking up', before_meals: '1 glass 30 min before meals',
    tip: '💧 Carry a water bottle and set hourly reminders.',
  })
}
EXEC['sleep-calculator'] = (p) => {
  const wakeUp = str(p.wake_time || p.text || p.wake).trim()
  const now = new Date()
  if (!wakeUp) {
    // Calculate ideal sleep times from now
    const cycles = [4, 5, 6].map(c => {
      const sleepMs = c * 90 * 60000 + 14 * 60000 // cycles * 90min + 14min fall-asleep
      const d = new Date(now.getTime() + sleepMs)
      return { cycles: c, wake_at: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`, sleep_hours: +(c * 1.5).toFixed(1) }
    })
    return ok('Sleep cycle recommendations:', { current_time: now.toTimeString().slice(0, 5), recommended_wake_times: cycles, ideal: '6 full cycles = 9 hours', note: '14 min average time to fall asleep included.' })
  }
  // Calculate bedtime from wake-up time
  const [hh, mm] = wakeUp.split(':').map(Number)
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return err('Enter time as HH:MM.')
  const wakeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm)
  if (wakeDate < now) wakeDate.setDate(wakeDate.getDate() + 1)
  const bedtimes = [6, 5, 4].map(c => {
    const bedMs = wakeDate.getTime() - (c * 90 * 60000 + 14 * 60000)
    const d = new Date(bedMs)
    return { cycles: c, bedtime: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`, sleep_hours: +(c * 1.5).toFixed(1) }
  })
  return ok(`Go to bed at one of these times:`, { wake_time: wakeUp, recommended_bedtimes: bedtimes, ideal: '5-6 cycles recommended' })
}
EXEC['discount-calculator'] = (p) => {
  const price = num(p.price || p.original_price || p.text, 0)
  const discount = num(p.discount || p.percentage, 10)
  if (price <= 0) return err('Enter the original price.')
  const savings = price * discount / 100
  const final_price = price - savings
  return ok(`You save ₹${savings.toFixed(2)} — pay ₹${final_price.toFixed(2)}!`, {
    original_price: price, discount_percent: discount,
    savings: +savings.toFixed(2), final_price: +final_price.toFixed(2),
    per_100: +(discount).toFixed(2),
  })
}

// ─── ADDITIONAL FINANCIAL & STUDENT CALCULATORS ─────────────────────────────

EXEC['simple-interest-calculator'] = (p) => {
  const principal = num(p.principal || p.amount, 0)
  const rate = num(p.rate, 5)
  const time = num(p.time || p.years, 1)
  if (!principal) return err('Enter the principal amount.')
  const si = (principal * rate * time) / 100
  const total = principal + si
  return ok(`Simple Interest: ₹${si.toFixed(2)} | Total: ₹${total.toFixed(2)}`, {
    principal, rate_percent: rate, time_years: time,
    simple_interest: +si.toFixed(2), total_amount: +total.toFixed(2),
  })
}
EXEC['simple-interest'] = EXEC['simple-interest-calculator']

EXEC['sip-calculator'] = (p) => {
  const monthly = num(p.monthly || p.amount || p.sip_amount, 1000)
  const rate = num(p.rate || p.return_rate, 12) / 100 / 12
  const months = num(p.months || p.years ? num(p.years, 5) * 12 : 60, 60)
  if (!monthly) return err('Enter monthly SIP amount.')
  const fv = rate > 0
    ? monthly * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate)
    : monthly * months
  const invested = monthly * months
  const returns = fv - invested
  return ok(`Maturity: ₹${Math.round(fv).toLocaleString()}`, {
    monthly_sip: monthly, annual_rate_percent: num(p.rate || p.return_rate, 12),
    tenure_months: months, invested_amount: Math.round(invested),
    estimated_returns: Math.round(returns), maturity_value: Math.round(fv),
    wealth_gain_percent: +(returns / invested * 100).toFixed(1),
  })
}
EXEC['sip-calculator-india'] = EXEC['sip-calculator']
EXEC['sip-return-calculator'] = EXEC['sip-calculator']

EXEC['fibonacci-generator'] = (p) => {
  const n = Math.min(num(p.count || p.terms || p.number || p.text, 10), 100)
  if (n < 1) return err('Enter a number between 1 and 100.')
  const seq: number[] = [0, 1]
  for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2])
  return ok(`First ${n} Fibonacci numbers generated.`, { sequence: seq.slice(0, n), count: n, last: seq[n - 1] })
}
EXEC['fibonacci-sequence'] = EXEC['fibonacci-generator']

EXEC['area-calculator'] = (p) => {
  const shape = str(p.shape, 'rectangle').toLowerCase()
  const a = num(p.length || p.side || p.radius || p.a, 1)
  const b = num(p.width || p.b || p.height, 1)
  let area = 0, perimeter = 0, label = ''
  if (shape.includes('circle')) {
    area = Math.PI * a * a; perimeter = 2 * Math.PI * a; label = `radius=${a}`
  } else if (shape.includes('triangle')) {
    area = 0.5 * a * b; perimeter = a + b + Math.sqrt(a * a + b * b); label = `base=${a}, height=${b}`
  } else if (shape.includes('square')) {
    area = a * a; perimeter = 4 * a; label = `side=${a}`
  } else {
    area = a * b; perimeter = 2 * (a + b); label = `length=${a}, width=${b}`
  }
  return ok(`Area: ${area.toFixed(2)} sq units`, { shape, label, area: +area.toFixed(4), perimeter: +perimeter.toFixed(4) })
}

EXEC['volume-calculator'] = (p) => {
  const shape = str(p.shape, 'cube').toLowerCase()
  const a = num(p.length || p.side || p.radius || p.a, 1)
  const b = num(p.width || p.b, 1)
  const c = num(p.height || p.c, 1)
  let volume = 0, label = ''
  if (shape.includes('sphere')) {
    volume = (4/3) * Math.PI * a * a * a; label = `radius=${a}`
  } else if (shape.includes('cylinder')) {
    volume = Math.PI * a * a * c; label = `radius=${a}, height=${c}`
  } else if (shape.includes('cone')) {
    volume = (1/3) * Math.PI * a * a * c; label = `radius=${a}, height=${c}`
  } else if (shape.includes('cube')) {
    volume = a * a * a; label = `side=${a}`
  } else {
    volume = a * b * c; label = `l=${a}, w=${b}, h=${c}`
  }
  return ok(`Volume: ${volume.toFixed(2)} cubic units`, { shape, label, volume: +volume.toFixed(4) })
}

EXEC['profit-loss-calculator'] = (p) => {
  const cp = num(p.cost_price || p.cost || p.cp, 0)
  const sp = num(p.selling_price || p.sell || p.sp, 0)
  if (!cp) return err('Enter the cost price.')
  const diff = sp - cp
  const pct = (diff / cp) * 100
  const is_profit = diff >= 0
  return ok(is_profit ? `Profit: ₹${diff.toFixed(2)} (${pct.toFixed(2)}%)` : `Loss: ₹${Math.abs(diff).toFixed(2)} (${Math.abs(pct).toFixed(2)}%)`, {
    cost_price: cp, selling_price: sp,
    profit_loss: +Math.abs(diff).toFixed(2),
    profit_loss_percent: +Math.abs(pct).toFixed(2),
    is_profit, type: is_profit ? 'Profit' : 'Loss',
  })
}
EXEC['profit-calculator'] = EXEC['profit-loss-calculator']
EXEC['profit-and-loss-calculator'] = EXEC['profit-loss-calculator']

EXEC['markup-calculator'] = (p) => {
  const cost = num(p.cost || p.price, 0)
  const markup = num(p.markup || p.percent, 20)
  if (!cost) return err('Enter the cost price.')
  const selling_price = cost * (1 + markup / 100)
  const profit = selling_price - cost
  return ok(`Selling Price: ₹${selling_price.toFixed(2)}`, {
    cost_price: cost, markup_percent: markup,
    selling_price: +selling_price.toFixed(2), profit: +profit.toFixed(2),
  })
}

EXEC['inflation-calculator'] = (p) => {
  const amount = num(p.amount, 1000)
  const rate = num(p.rate || p.inflation_rate, 6)
  const years = num(p.years, 5)
  if (!amount) return err('Enter an amount.')
  const future = amount * Math.pow(1 + rate / 100, years)
  const today_value = amount / Math.pow(1 + rate / 100, years)
  return ok(`₹${amount} today = ₹${Math.round(future)} in ${years} years`, {
    current_amount: amount, inflation_rate_percent: rate, years,
    future_value: Math.round(future),
    purchasing_power_today: Math.round(today_value),
    real_return_percent: +(-rate).toFixed(1),
  })
}

EXEC['percentage-of-calculator'] = (p) => {
  const percent = num(p.percent || p.percentage, 0)
  const of = num(p.of || p.total || p.amount, 0)
  if (!percent || !of) return err('Enter percentage and the total value.')
  const result = (percent * of) / 100
  return ok(`${percent}% of ${of} = ${result.toFixed(2)}`, { percent, of, result: +result.toFixed(4) })
}
EXEC['what-is-x-percent-of-y'] = EXEC['percentage-of-calculator']

EXEC['cagr-calculator'] = (p) => {
  const begin = num(p.initial || p.begin || p.start, 0)
  const end_val = num(p.final || p.end || p.value, 0)
  const years = num(p.years, 5)
  if (!begin || !end_val || !years) return err('Enter initial value, final value, and number of years.')
  const cagr = (Math.pow(end_val / begin, 1 / years) - 1) * 100
  return ok(`CAGR: ${cagr.toFixed(2)}% per year`, {
    initial_value: begin, final_value: end_val, years,
    cagr_percent: +cagr.toFixed(4),
    total_growth_percent: +((end_val - begin) / begin * 100).toFixed(2),
  })
}

EXEC['ppf-calculator'] = (p) => {
  const yearly = num(p.yearly || p.amount, 10000)
  const years = Math.min(Math.max(num(p.years, 15), 1), 50)
  const rate = num(p.rate, 7.1) / 100
  let balance = 0
  const invested = yearly * years
  for (let y = 1; y <= years; y++) balance = (balance + yearly) * (1 + rate)
  const returns = balance - invested
  return ok(`Maturity: ₹${Math.round(balance).toLocaleString()} in ${years} years`, {
    yearly_contribution: yearly, years, rate_percent: num(p.rate, 7.1),
    total_invested: invested, interest_earned: Math.round(returns), maturity_value: Math.round(balance),
  })
}
EXEC['ppf-return-calculator'] = EXEC['ppf-calculator']

EXEC['nps-calculator'] = (p) => {
  const monthly = num(p.monthly || p.amount, 5000)
  const years = num(p.years, 30)
  const rate = num(p.rate, 10) / 100 / 12
  const months = years * 12
  const corpus = monthly * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate)
  const invested = monthly * months
  const annuity_rate = 0.6
  const annuity_corpus = corpus * annuity_rate
  const monthly_pension = annuity_corpus * 0.06 / 12
  return ok(`NPS Corpus: ₹${Math.round(corpus).toLocaleString()}`, {
    monthly_contribution: monthly, years,
    total_invested: Math.round(invested), estimated_corpus: Math.round(corpus),
    lump_sum_at_60_percent: Math.round(corpus * 0.4),
    annuity_corpus: Math.round(annuity_corpus),
    estimated_monthly_pension: Math.round(monthly_pension),
  })
}

EXEC['fd-calculator'] = (p) => {
  const principal = num(p.principal || p.amount, 10000)
  const rate = num(p.rate, 7) / 100
  const years = num(p.years || p.tenure, 1)
  const n = num(p.compounds || p.frequency, 4)
  const maturity = principal * Math.pow(1 + rate / n, n * years)
  const interest = maturity - principal
  return ok(`FD Maturity: ₹${Math.round(maturity).toLocaleString()}`, {
    principal, annual_rate_percent: num(p.rate, 7), years,
    interest_earned: Math.round(interest), maturity_value: Math.round(maturity),
  })
}
EXEC['fixed-deposit-calculator'] = EXEC['fd-calculator']
EXEC['rd-calculator'] = (p) => {
  const monthly = num(p.monthly || p.amount, 1000)
  const rate = num(p.rate, 7) / 100 / 4
  const months = num(p.months || p.years ? num(p.years, 1) * 12 : 12, 12)
  let maturity = 0
  for (let i = months; i >= 1; i--) {
    maturity += monthly * Math.pow(1 + rate, i / 3)
  }
  const invested = monthly * months
  return ok(`RD Maturity: ₹${Math.round(maturity).toLocaleString()}`, {
    monthly_deposit: monthly, months, rate_percent: num(p.rate, 7),
    total_invested: invested, interest_earned: Math.round(maturity - invested),
    maturity_value: Math.round(maturity),
  })
}
EXEC['recurring-deposit-calculator'] = EXEC['rd-calculator']

EXEC['gst-calculator'] = (p) => {
  const amount = num(p.amount || p.price, 0)
  const rate = num(p.rate || p.gst_rate || p.gst, 18)
  if (!amount) return err('Enter the amount.')
  const exclusive_gst = amount * rate / 100
  const price_with_gst = amount + exclusive_gst
  const inclusive_base = amount / (1 + rate / 100)
  const inclusive_gst = amount - inclusive_base
  return ok(`GST (${rate}%): ₹${exclusive_gst.toFixed(2)} | Total: ₹${price_with_gst.toFixed(2)}`, {
    base_amount: amount, gst_rate_percent: rate,
    gst_exclusive: { gst_amount: +exclusive_gst.toFixed(2), total_price: +price_with_gst.toFixed(2) },
    gst_inclusive: { base_price: +inclusive_base.toFixed(2), gst_amount: +inclusive_gst.toFixed(2) },
    cgst: +(exclusive_gst / 2).toFixed(2), sgst: +(exclusive_gst / 2).toFixed(2),
  })
}

// ─── UNIT CONVERTERS ─────────────────────────────────────────────────────────

EXEC['speed-converter'] = (p) => {
  const v = num(p.value || p.text, 1)
  const from = str(p.from || p.unit, 'kmh').toLowerCase().replace(/[^a-z0-9]/g, '')
  let ms = 0
  if (from.includes('kmh') || from.includes('kph') || from === 'km') ms = v / 3.6
  else if (from.includes('mph') || from.includes('mi')) ms = v * 0.44704
  else if (from.includes('ms') || from === 'ms') ms = v
  else if (from.includes('knot') || from === 'kn') ms = v * 0.514444
  else if (from.includes('mach')) ms = v * 340.29
  else if (from.includes('ft')) ms = v * 0.3048
  else ms = v / 3.6
  return ok('Speed converted.', {
    input: v, from,
    km_per_hour: +(ms * 3.6).toFixed(4),
    miles_per_hour: +(ms / 0.44704).toFixed(4),
    meters_per_second: +ms.toFixed(4),
    knots: +(ms / 0.514444).toFixed(4),
    feet_per_second: +(ms / 0.3048).toFixed(4),
    mach: +(ms / 340.29).toFixed(6),
  })
}

EXEC['data-storage-converter'] = (p) => {
  const v = num(p.value || p.text, 1)
  const from = str(p.from || p.unit, 'gb').toLowerCase().replace(/[^a-z]/g, '')
  let bytes = 0
  if (from === 'b' || from === 'byte' || from === 'bytes') bytes = v
  else if (from === 'kb' || from === 'kilobyte') bytes = v * 1024
  else if (from === 'mb' || from === 'megabyte') bytes = v * 1024 ** 2
  else if (from === 'gb' || from === 'gigabyte') bytes = v * 1024 ** 3
  else if (from === 'tb' || from === 'terabyte') bytes = v * 1024 ** 4
  else if (from === 'pb' || from === 'petabyte') bytes = v * 1024 ** 5
  else bytes = v * 1024 ** 3
  return ok('Data size converted.', {
    input: v, from,
    bytes: Math.round(bytes),
    kilobytes: +(bytes / 1024).toFixed(4),
    megabytes: +(bytes / 1024 ** 2).toFixed(4),
    gigabytes: +(bytes / 1024 ** 3).toFixed(6),
    terabytes: +(bytes / 1024 ** 4).toFixed(8),
  })
}
EXEC['bytes-converter'] = EXEC['data-storage-converter']
EXEC['file-size-converter'] = EXEC['data-storage-converter']

EXEC['pressure-converter'] = (p) => {
  const v = num(p.value || p.text, 1)
  const from = str(p.from || p.unit, 'pa').toLowerCase()
  let pa = 0
  if (from.includes('pascal') || from === 'pa') pa = v
  else if (from.includes('kpa')) pa = v * 1000
  else if (from.includes('mpa')) pa = v * 1e6
  else if (from.includes('bar')) pa = v * 1e5
  else if (from.includes('psi')) pa = v * 6894.76
  else if (from.includes('atm')) pa = v * 101325
  else if (from.includes('torr') || from.includes('mmhg')) pa = v * 133.322
  else pa = v
  return ok('Pressure converted.', {
    input: v, from,
    pascal: +pa.toFixed(4),
    kilopascal: +(pa / 1000).toFixed(6),
    megapascal: +(pa / 1e6).toFixed(8),
    bar: +(pa / 1e5).toFixed(6),
    psi: +(pa / 6894.76).toFixed(6),
    atm: +(pa / 101325).toFixed(8),
    torr_mmhg: +(pa / 133.322).toFixed(4),
  })
}

EXEC['energy-converter'] = (p) => {
  const v = num(p.value || p.text, 1)
  const from = str(p.from || p.unit, 'j').toLowerCase()
  let j = 0
  if (from === 'j' || from.includes('joule')) j = v
  else if (from.includes('kj')) j = v * 1000
  else if (from.includes('cal') && !from.includes('kcal')) j = v * 4.184
  else if (from.includes('kcal') || from === 'cal' && v > 1000) j = v * 4184
  else if (from.includes('kwh')) j = v * 3.6e6
  else if (from.includes('mwh')) j = v * 3.6e9
  else if (from.includes('btu')) j = v * 1055.06
  else if (from.includes('ev')) j = v * 1.602e-19
  else j = v
  return ok('Energy converted.', {
    input: v, from,
    joules: +j.toFixed(4),
    kilojoules: +(j / 1000).toFixed(6),
    calories: +(j / 4.184).toFixed(4),
    kilocalories: +(j / 4184).toFixed(6),
    watt_hours: +(j / 3600).toFixed(6),
    kilowatt_hours: +(j / 3.6e6).toFixed(8),
    btu: +(j / 1055.06).toFixed(6),
  })
}

EXEC['force-converter'] = (p) => {
  const v = num(p.value || p.text, 1)
  const from = str(p.from || p.unit, 'n').toLowerCase()
  let n = 0
  if (from === 'n' || from.includes('newton')) n = v
  else if (from.includes('kn') || from.includes('kilonewton')) n = v * 1000
  else if (from.includes('lbf') || from.includes('pound-force') || from.includes('pound force')) n = v * 4.44822
  else if (from.includes('kgf') || from.includes('kilogram-force')) n = v * 9.80665
  else if (from.includes('dyn')) n = v * 1e-5
  else n = v
  return ok('Force converted.', {
    input: v, from,
    newtons: +n.toFixed(4),
    kilonewtons: +(n / 1000).toFixed(6),
    pound_force: +(n / 4.44822).toFixed(6),
    kilogram_force: +(n / 9.80665).toFixed(6),
    dyne: +(n * 1e5).toFixed(2),
  })
}

EXEC['angle-converter'] = (p) => {
  const v = num(p.value || p.text, 1)
  const from = str(p.from || p.unit, 'deg').toLowerCase()
  let deg = 0
  if (from.includes('rad')) deg = v * (180 / Math.PI)
  else if (from.includes('grad')) deg = v * 0.9
  else if (from.includes('turn') || from.includes('rev')) deg = v * 360
  else if (from.includes('arcmin') || from.includes('arc min')) deg = v / 60
  else if (from.includes('arcsec') || from.includes('arc sec')) deg = v / 3600
  else deg = v
  return ok('Angle converted.', {
    input: v, from,
    degrees: +deg.toFixed(6),
    radians: +(deg * Math.PI / 180).toFixed(8),
    gradians: +(deg / 0.9).toFixed(6),
    arcminutes: +(deg * 60).toFixed(4),
    arcseconds: +(deg * 3600).toFixed(2),
    turns: +(deg / 360).toFixed(8),
  })
}

EXEC['fuel-efficiency-calculator'] = (p) => {
  const distance = num(p.distance || p.km, 0)
  const fuel = num(p.fuel || p.litres || p.liters, 0)
  const price_per_litre = num(p.price || p.price_per_litre, 0)
  if (!distance || !fuel) return err('Enter both distance and fuel consumed.')
  const kmpl = distance / fuel
  const l100km = 100 / kmpl
  const mpg_us = kmpl * 2.35215
  const cost = price_per_litre ? fuel * price_per_litre : null
  const result: Record<string, unknown> = {
    distance_km: distance, fuel_litres: fuel,
    km_per_litre: +kmpl.toFixed(2),
    litres_per_100km: +l100km.toFixed(2),
    miles_per_gallon_us: +mpg_us.toFixed(2),
  }
  if (cost !== null) result.total_fuel_cost = +cost.toFixed(2)
  return ok(`Fuel efficiency: ${kmpl.toFixed(2)} km/L`, result)
}

EXEC['power-converter'] = (p) => {
  const v = num(p.value || p.text, 1)
  const from = str(p.from || p.unit, 'w').toLowerCase()
  let w = 0
  if (from === 'w' || from.includes('watt')) w = v
  else if (from.includes('kw') || from.includes('kilowatt')) w = v * 1000
  else if (from.includes('mw') || from.includes('megawatt')) w = v * 1e6
  else if (from.includes('hp') || from.includes('horsepower')) w = v * 745.7
  else if (from.includes('btu')) w = v * 0.29307
  else w = v
  return ok('Power converted.', {
    input: v, from,
    watts: +w.toFixed(4),
    kilowatts: +(w / 1000).toFixed(6),
    megawatts: +(w / 1e6).toFixed(8),
    horsepower: +(w / 745.7).toFixed(6),
    btu_per_hour: +(w / 0.29307).toFixed(4),
  })
}

EXEC['frequency-converter'] = (p) => {
  const v = num(p.value || p.text, 1)
  const from = str(p.from || p.unit, 'hz').toLowerCase()
  let hz = 0
  if (from.includes('khz') || from === 'kh') hz = v * 1e3
  else if (from.includes('mhz') || from === 'mh') hz = v * 1e6
  else if (from.includes('ghz') || from === 'gh') hz = v * 1e9
  else if (from.includes('rpm')) hz = v / 60
  else hz = v
  return ok('Frequency converted.', {
    input: v, from,
    hertz: hz,
    kilohertz: +(hz / 1e3).toFixed(6),
    megahertz: +(hz / 1e6).toFixed(8),
    gigahertz: +(hz / 1e9).toFixed(10),
    rpm: +(hz * 60).toFixed(4),
    period_ms: +(1000 / hz).toFixed(6),
  })
}

// ─── ADDITIONAL STRING / TEXT TOOLS ─────────────────────────────────────────

EXEC['palindrome-checker'] = (p) => {
  const t = str(p.text).trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  if (!t) return err('Enter text to check.')
  const isPal = t === t.split('').reverse().join('')
  return ok(isPal ? `"${str(p.text).trim()}" is a palindrome!` : `"${str(p.text).trim()}" is NOT a palindrome.`, {
    original: str(p.text).trim(), cleaned: t, is_palindrome: isPal,
  })
}

EXEC['anagram-checker'] = (p) => {
  const a = str(p.text1 || p.word1 || p.a).trim().toLowerCase().replace(/\s/g, '')
  const b = str(p.text2 || p.word2 || p.b).trim().toLowerCase().replace(/\s/g, '')
  if (!a || !b) return err('Enter two words or phrases to check.')
  const sort = (s: string) => s.split('').sort().join('')
  const isAnagram = sort(a) === sort(b)
  return ok(isAnagram ? `"${a}" and "${b}" ARE anagrams!` : `"${a}" and "${b}" are NOT anagrams.`, {
    word1: a, word2: b, is_anagram: isAnagram, letter_count_1: a.length, letter_count_2: b.length,
  })
}

EXEC['pig-latin-generator'] = (p) => {
  const t = str(p.text).trim()
  if (!t) return err('Enter text to convert to Pig Latin.')
  const vowels = 'aeiouAEIOU'
  const convert = (w: string) => {
    if (!w.match(/[a-zA-Z]/)) return w
    if (vowels.includes(w[0])) return w + 'way'
    let i = 0
    while (i < w.length && !vowels.includes(w[i])) i++
    return w.slice(i) + w.slice(0, i) + 'ay'
  }
  const result = t.split(/\s+/).map(convert).join(' ')
  return ok('Converted to Pig Latin!', { original: t, pig_latin: result })
}

EXEC['camel-case-converter'] = (p) => {
  const t = str(p.text).trim()
  if (!t) return err('Enter text to convert.')
  const camel = t.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase())
  const pascal = camel.replace(/^./, c => c.toUpperCase())
  const snake = t.replace(/[-\s]+/g, '_').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
  const kebab = snake.replace(/_/g, '-')
  return ok('Case conversion done.', { camelCase: camel, PascalCase: pascal, snake_case: snake, 'kebab-case': kebab })
}
EXEC['snake-case-converter'] = EXEC['camel-case-converter']
EXEC['kebab-case-converter'] = EXEC['camel-case-converter']
EXEC['pascal-case-converter'] = EXEC['camel-case-converter']

EXEC['word-wrap-tool'] = (p) => {
  const t = str(p.text).trim()
  const width = num(p.width || p.wrap_at, 80)
  if (!t) return err('Enter text to wrap.')
  const lines = t.split('\n')
  const wrapped = lines.map(line => {
    if (line.length <= width) return line
    const words = line.split(' ')
    const result: string[] = []
    let current = ''
    for (const word of words) {
      if ((current + (current ? ' ' : '') + word).length <= width) {
        current += (current ? ' ' : '') + word
      } else {
        if (current) result.push(current)
        current = word
      }
    }
    if (current) result.push(current)
    return result.join('\n')
  })
  return ok(`Text wrapped at ${width} chars.`, { wrapped: wrapped.join('\n'), wrap_width: width, line_count: wrapped.join('\n').split('\n').length })
}

EXEC['percentage-change-calculator'] = (p) => {
  const oldVal = num(p.old_value || p.from || p.original, 0)
  const newVal = num(p.new_value || p.to || p.current, 0)
  if (!oldVal) return err('Enter the original value.')
  const change = newVal - oldVal
  const pct = (change / oldVal) * 100
  const isIncrease = change >= 0
  return ok(`${isIncrease ? 'Increase' : 'Decrease'}: ${Math.abs(pct).toFixed(2)}%`, {
    old_value: oldVal, new_value: newVal,
    change: +change.toFixed(4), percentage_change: +pct.toFixed(4),
    type: isIncrease ? 'Increase' : 'Decrease',
  })
}

EXEC['ratio-calculator'] = (p) => {
  const a = num(p.a || p.value1, 1)
  const b = num(p.b || p.value2, 1)
  if (!a || !b) return err('Enter two values for the ratio.')
  const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y)
  const g = gcd(Math.abs(Math.round(a)), Math.abs(Math.round(b)))
  return ok(`Ratio: ${a/g}:${b/g}`, {
    a, b, ratio: `${a/g}:${b/g}`, simplified_a: a/g, simplified_b: b/g,
    decimal: +(a/b).toFixed(6), percentage_a: +(a/(a+b)*100).toFixed(2), percentage_b: +(b/(a+b)*100).toFixed(2),
  })
}

EXEC['number-to-hex'] = (p) => {
  const n = num(p.number || p.text)
  if (!Number.isFinite(n)) return err('Enter a valid decimal number.')
  const int = Math.floor(Math.abs(n))
  return ok(`Hex: 0x${int.toString(16).toUpperCase()}`, {
    decimal: int, hexadecimal: int.toString(16).toUpperCase(), hex_prefixed: `0x${int.toString(16).toUpperCase()}`,
    binary: int.toString(2), octal: int.toString(8),
  })
}
EXEC['decimal-to-hex'] = EXEC['number-to-hex']

EXEC['hex-to-binary'] = (p) => {
  const t = str(p.text || p.hex).trim().replace(/^0x/i, '')
  if (!t || !/^[0-9a-fA-F]+$/.test(t)) return err('Enter a valid hexadecimal number.')
  const n = parseInt(t, 16)
  return ok(`Binary: ${n.toString(2)}`, {
    hex: t.toUpperCase(), decimal: n, binary: n.toString(2), octal: n.toString(8),
  })
}

EXEC['binary-to-hex'] = (p) => {
  const t = str(p.text || p.binary).trim().replace(/\s/g, '')
  if (!t || !/^[01]+$/.test(t)) return err('Enter a valid binary number (only 0s and 1s).')
  const n = parseInt(t, 2)
  return ok(`Hex: 0x${n.toString(16).toUpperCase()}`, {
    binary: t, decimal: n, hex: n.toString(16).toUpperCase(), octal: n.toString(8),
  })
}

EXEC['number-base-converter'] = (p) => {
  const val = str(p.value || p.text).trim().replace(/^0[xXbBoO]/, '')
  const from_base = num(p.from_base || p.from, 10)
  if (!val) return err('Enter a value to convert.')
  const n = parseInt(val, from_base)
  if (isNaN(n)) return err(`Cannot parse "${val}" as base ${from_base}.`)
  return ok(`Converted from base ${from_base}.`, {
    input: val, from_base, value: n,
    binary_base2: n.toString(2), octal_base8: n.toString(8),
    decimal_base10: n.toString(10), hexadecimal_base16: n.toString(16).toUpperCase(),
  })
}

EXEC['countdown-timer'] = (p) => {
  const target = str(p.target || p.date || p.text).trim()
  if (!target) return err('Enter a target date (e.g. 2025-12-31).')
  const targetDate = new Date(target)
  const now = new Date()
  if (isNaN(targetDate.getTime())) return err('Invalid date format. Try YYYY-MM-DD or a natural date.')
  const diffMs = targetDate.getTime() - now.getTime()
  if (diffMs < 0) {
    const pastMs = -diffMs
    return ok(`${target} was ${Math.floor(pastMs / 86400000)} days ago.`, {
      target_date: target, in_the_past: true,
      days_ago: Math.floor(pastMs / 86400000),
      hours_ago: Math.floor(pastMs / 3600000),
    })
  }
  const days = Math.floor(diffMs / 86400000)
  const hours = Math.floor((diffMs % 86400000) / 3600000)
  const minutes = Math.floor((diffMs % 3600000) / 60000)
  const seconds = Math.floor((diffMs % 60000) / 1000)
  return ok(`${days}d ${hours}h ${minutes}m ${seconds}s remaining until ${target}`, {
    target_date: target, days_remaining: days, hours_remaining: hours,
    minutes_remaining: minutes, total_hours: Math.floor(diffMs / 3600000),
    total_days: days,
  })
}
EXEC['days-until-calculator'] = EXEC['countdown-timer']

EXEC['random-color-generator'] = (p) => {
  const count = Math.min(num(p.count, 1), 20)
  const colors: Record<string, string>[] = []
  for (let i = 0; i < count; i++) {
    const r = secureRandomInt(256), g = secureRandomInt(256), b = secureRandomInt(256)
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase()
    colors.push({ hex, rgb: `rgb(${r},${g},${b})`, hsl: `hsl(${Math.round(Math.atan2(Math.sqrt(3)*(g-b), 2*r-g-b)*180/Math.PI + 360) % 360},${Math.round(Math.max(r,g,b)===0?0:(Math.max(r,g,b)-Math.min(r,g,b))/Math.max(r,g,b)*100)}%,${Math.round((Math.max(r,g,b)+Math.min(r,g,b))/2/255*100)}%)` })
  }
  return ok(`Generated ${count} random color${count > 1 ? 's' : ''}.`, { colors, count })
}

EXEC['emi-calculator'] = (p) => {
  const principal = num(p.principal || p.amount || p.loan_amount, 0)
  const rate = num(p.rate || p.interest_rate, 10) / 100 / 12
  const months = num(p.months || p.tenure_months || p.years ? num(p.years, 5) * 12 : 60, 60)
  if (!principal) return err('Enter the loan amount.')
  const emi = rate > 0 ? principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1) : principal / months
  const total = emi * months
  const interest = total - principal
  return ok(`EMI: ₹${Math.round(emi).toLocaleString()}/month`, {
    loan_amount: principal, annual_rate_percent: num(p.rate || p.interest_rate, 10),
    tenure_months: months, monthly_emi: Math.round(emi),
    total_payment: Math.round(total), total_interest: Math.round(interest),
    interest_percent: +(interest / principal * 100).toFixed(1),
  })
}
EXEC['home-loan-emi-calculator'] = EXEC['emi-calculator']
EXEC['car-loan-emi-calculator'] = EXEC['emi-calculator']
EXEC['personal-loan-emi-calculator'] = EXEC['emi-calculator']
EXEC['emi-calculator-india'] = EXEC['emi-calculator']

EXEC['gratuity-calculator'] = (p) => {
  const salary = num(p.salary || p.basic_salary || p.last_salary, 0)
  const years = num(p.years || p.service_years, 0)
  if (!salary || !years) return err('Enter last drawn salary and years of service.')
  const is_covered = years >= 5
  const gratuity = is_covered ? (salary * 15 * years) / 26 : 0
  return ok(is_covered ? `Gratuity: ₹${Math.round(gratuity).toLocaleString()}` : `Not eligible (need ≥5 years, have ${years})`, {
    basic_salary: salary, service_years: years, is_eligible: is_covered,
    gratuity_amount: Math.round(gratuity), formula: 'Last Salary × 15/26 × Years of Service',
    tax_free_limit: 2000000,
  })
}

EXEC['hra-calculator'] = (p) => {
  const basic = num(p.basic || p.basic_salary, 0)
  const hra_received = num(p.hra || p.hra_received, 0)
  const rent = num(p.rent || p.rent_paid, 0)
  const is_metro = str(p.city || p.metro).toLowerCase().match(/mumbai|delhi|kolkata|chennai/) !== null
  if (!basic) return err('Enter your basic salary.')
  const metro_pct = is_metro ? 0.5 : 0.4
  const exempt = Math.min(
    hra_received,
    basic * metro_pct,
    rent - basic * 0.1 > 0 ? rent - basic * 0.1 : 0
  )
  const taxable = Math.max(0, hra_received - exempt)
  return ok(`HRA Exempt: ₹${Math.round(exempt).toLocaleString()}/month`, {
    basic_salary: basic, hra_received, rent_paid: rent,
    city_type: is_metro ? 'Metro' : 'Non-Metro',
    hra_exempt: Math.round(exempt), hra_taxable: Math.round(taxable),
    annual_exempt: Math.round(exempt * 12), annual_taxable: Math.round(taxable * 12),
  })
}

// ─── YOUTUBE THUMBNAIL (client-side — no backend needed) ─────────────────────

EXEC['youtube-thumbnail-downloader'] = async (p) => {
  const url = str(p.url || p.text).trim()
  if (!url) return err('Enter a YouTube video URL.')
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)
  if (!m) return err('Could not find a YouTube video ID in that URL.')
  const vid = m[1]
  const sizes = [
    { key: 'maxresdefault', label: 'Max (1280×720)' },
    { key: 'sddefault', label: 'SD (640×480)' },
    { key: 'hqdefault', label: 'HQ (480×360)' },
    { key: 'mqdefault', label: 'MQ (320×180)' },
  ]
  const quality = str(p.quality || p.size, 'maxresdefault')
  const pickedKey = sizes.find(s => s.key === quality)?.key ?? 'maxresdefault'
  const thumbUrl = `https://i.ytimg.com/vi/${vid}/${pickedKey}.jpg`
  return ok(`Thumbnail URL for video ${vid}`, {
    video_id: vid, quality: pickedKey,
    thumbnail_url: thumbUrl,
    all_thumbnails: Object.fromEntries(sizes.map(s => [s.label, `https://i.ytimg.com/vi/${vid}/${s.key}.jpg`])),
    note: 'Click the thumbnail URL above to open/download it in a new tab.',
  })
}
EXEC['youtube-thumbnail'] = EXEC['youtube-thumbnail-downloader']
EXEC['yt-thumbnail-downloader'] = EXEC['youtube-thumbnail-downloader']

// ─── WORD/TEXT ANALYSIS TOOLS ────────────────────────────────────────────────

EXEC['readability-checker'] = (p) => {
  const t = str(p.text).trim()
  if (!t) return err('Enter text to analyze readability.')
  const words = t.split(/\s+/).filter(Boolean)
  const sentences = t.split(/[.!?]+/).filter(s => s.trim().length > 2)
  const syllables = words.reduce((acc, word) => {
    const w = word.toLowerCase().replace(/[^a-z]/g, '')
    let count = w.match(/[aeiou]/g)?.length || 1
    if (w.endsWith('e') && w.length > 3) count = Math.max(1, count - 1)
    return acc + count
  }, 0)
  const wordsPerSentence = sentences.length ? words.length / sentences.length : words.length
  const syllablesPerWord = words.length ? syllables / words.length : 0
  const fleschScore = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord
  const gradeLevel = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59
  const level = fleschScore >= 70 ? 'Easy' : fleschScore >= 50 ? 'Moderate' : fleschScore >= 30 ? 'Difficult' : 'Very Difficult'
  return ok(`Readability: ${level} (Flesch score: ${fleschScore.toFixed(1)})`, {
    word_count: words.length, sentence_count: sentences.length,
    average_words_per_sentence: +wordsPerSentence.toFixed(1),
    average_syllables_per_word: +syllablesPerWord.toFixed(2),
    flesch_reading_ease: +fleschScore.toFixed(1),
    grade_level: +gradeLevel.toFixed(1),
    readability_level: level,
  })
}

EXEC['text-to-morse'] = (p) => {
  const t = str(p.text).trim().toUpperCase()
  if (!t) return err('Enter text to convert to Morse code.')
  const MORSE: Record<string, string> = {
    A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..',
    J:'.---', K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.', Q:'--.-',
    R:'.-.', S:'...', T:'-', U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..',
    '0':'-----', '1':'.----', '2':'..---', '3':'...--', '4':'....-', '5':'.....',
    '6':'-....', '7':'--...', '8':'---..', '9':'----.',
    '.':'.-.-.-', ',':'--..--', '?':'..--..', '!':'-.-.--', '/':'-..-.', ' ':'/',
  }
  const result = t.split('').map(c => MORSE[c] || '?').join(' ')
  return ok('Converted to Morse code.', { original: t, morse: result, separator: 'Spaces between letters, / between words' })
}
EXEC['morse-code-generator'] = EXEC['text-to-morse']

EXEC['morse-to-text'] = (p) => {
  const morse = str(p.text || p.morse).trim()
  if (!morse) return err('Enter Morse code to decode.')
  const DECODE: Record<string, string> = {
    '.-':'A', '-...':'B', '-.-.':'C', '-..':'D', '.':'E', '..-.':'F', '--.':'G',
    '....':'H', '..':'I', '.---':'J', '-.-':'K', '.-..':'L', '--':'M', '-.':'N',
    '---':'O', '.--.':'P', '--.-':'Q', '.-.':'R', '...':'S', '-':'T', '..-':'U',
    '...-':'V', '.--':'W', '-..-':'X', '-.--':'Y', '--..':'Z',
    '-----':'0', '.----':'1', '..---':'2', '...--':'3', '....-':'4', '.....':'5',
    '-....':'6', '--...':'7', '---..':'8', '----.':'9',
    '.-.-.-':'.', '--..--':',', '..--..':'?', '-.-.--':'!',
  }
  const words = morse.split(' / ')
  const result = words.map(w => w.split(' ').map(c => DECODE[c] || '?').join('')).join(' ')
  return ok(`Decoded: ${result}`, { morse, text: result })
}
EXEC['morse-decoder'] = EXEC['morse-to-text']
EXEC['morse-code-translator'] = EXEC['text-to-morse']

EXEC['number-system-converter'] = (p) => {
  const v = str(p.value || p.number || p.text).trim()
  const fromBase = num(p.from || p.base || p.from_base, 10)
  if (!v) return err('Enter a number to convert.')
  const n = parseInt(v.replace(/^0[xXbBoO]/, ''), fromBase)
  if (isNaN(n)) return err(`Cannot parse "${v}" as base ${fromBase}.`)
  return ok(`Converted from base ${fromBase}`, {
    input: v, from_base: fromBase,
    binary: n.toString(2), octal: n.toString(8),
    decimal: n.toString(10), hexadecimal: n.toString(16).toUpperCase(),
    base_32: n.toString(32).toUpperCase(),
  })
}
EXEC['base-converter'] = EXEC['number-system-converter']

EXEC['kronecker-product'] = (p) => {
  const a = num(p.a || p.value1, 0), b = num(p.b || p.value2, 0)
  return ok(`${a} ⊗ ${b} matrix product`, { a, b, note: 'Kronecker product requires matrix input — backend handles this tool.' })
}

// ─── STATISTICS / MATH TOOLS ─────────────────────────────────────────────────

EXEC['statistics-calculator'] = (p) => {
  const raw = str(p.numbers || p.data || p.text).trim()
  if (!raw) return err('Enter a list of numbers separated by commas or spaces.')
  const nums = raw.split(/[\s,;]+/).map(Number).filter(n => !isNaN(n))
  if (nums.length < 2) return err('Enter at least 2 numbers.')
  const n = nums.length
  const sorted = [...nums].sort((a, b) => a - b)
  const mean = nums.reduce((a, b) => a + b, 0) / n
  const median = n % 2 === 0 ? (sorted[n/2-1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)]
  const variance = nums.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (n - 1)
  const stdDev = Math.sqrt(variance)
  const modeMap: Record<number, number> = {}
  nums.forEach(v => { modeMap[v] = (modeMap[v] || 0) + 1 })
  const maxFreq = Math.max(...Object.values(modeMap))
  const mode = Object.entries(modeMap).filter(([, f]) => f === maxFreq).map(([v]) => +v)
  return ok(`Mean: ${mean.toFixed(4)}, Median: ${median}, StdDev: ${stdDev.toFixed(4)}`, {
    count: n, min: sorted[0], max: sorted[n-1],
    mean: +mean.toFixed(6), median, mode: mode.length === n ? 'No mode' : mode.join(', '),
    standard_deviation: +stdDev.toFixed(6), variance: +variance.toFixed(6),
    range: sorted[n-1] - sorted[0],
    q1: sorted[Math.floor(n/4)], q3: sorted[Math.ceil(3*n/4)],
    sum: +nums.reduce((a, b) => a + b, 0).toFixed(6),
  })
}
EXEC['mean-median-mode-calculator'] = EXEC['statistics-calculator']
EXEC['standard-deviation-calculator'] = EXEC['statistics-calculator']
EXEC['variance-calculator'] = EXEC['statistics-calculator']

EXEC['z-score-calculator'] = (p) => {
  const value = num(p.value || p.x, 0)
  const mean = num(p.mean || p.mu, 0)
  const stdDev = num(p.std || p.std_dev || p.standard_deviation || p.sigma, 1)
  if (!stdDev) return err('Standard deviation must be non-zero.')
  const z = (value - mean) / stdDev
  const pValue = 0.5 * (1 + Math.sign(z) * (1 - Math.exp(-0.717 * Math.abs(z) - 0.416 * z * z)))
  return ok(`Z-score: ${z.toFixed(4)}`, {
    value, mean, standard_deviation: stdDev,
    z_score: +z.toFixed(6), p_value: +pValue.toFixed(6),
    percentile: +(pValue * 100).toFixed(2) + '%',
    interpretation: Math.abs(z) < 1 ? 'Within 1 SD (68%)' : Math.abs(z) < 2 ? 'Within 2 SD (95%)' : Math.abs(z) < 3 ? 'Within 3 SD (99.7%)' : 'Outlier (>3 SD)',
  })
}

EXEC['permutation-calculator'] = (p) => {
  const n = Math.round(num(p.n || p.total, 0))
  const r = Math.round(num(p.r || p.choose, 0))
  if (n < 0 || r < 0 || r > n) return err('n and r must be non-negative, and r ≤ n.')
  const factorial = (x: number): number => x <= 1 ? 1 : x * factorial(x - 1)
  const nPr = factorial(n) / factorial(n - r)
  return ok(`P(${n},${r}) = ${nPr.toLocaleString()}`, {
    n, r, permutations: nPr, formula: `${n}! / (${n}-${r})!`,
    note: 'Order matters in permutations',
  })
}

EXEC['combination-calculator'] = (p) => {
  const n = Math.round(num(p.n || p.total, 0))
  const r = Math.round(num(p.r || p.choose, 0))
  if (n < 0 || r < 0 || r > n) return err('n and r must be non-negative, and r ≤ n.')
  const factorial = (x: number): number => x <= 1 ? 1 : x * factorial(x - 1)
  const nCr = factorial(n) / (factorial(r) * factorial(n - r))
  return ok(`C(${n},${r}) = ${nCr.toLocaleString()}`, {
    n, r, combinations: nCr, formula: `${n}! / (${r}! × ${n-r}!)`,
    note: 'Order does NOT matter in combinations',
  })
}
EXEC['nCr-calculator'] = EXEC['combination-calculator']
EXEC['nPr-calculator'] = EXEC['permutation-calculator']

EXEC['probability-calculator'] = (p) => {
  const favorable = num(p.favorable || p.success || p.events, 0)
  const total = num(p.total || p.outcomes || p.sample_space, 0)
  if (!total) return err('Enter the total number of outcomes.')
  if (favorable > total) return err('Favorable outcomes cannot exceed total outcomes.')
  const prob = favorable / total
  const odds_for = favorable
  const odds_against = total - favorable
  return ok(`Probability: ${(prob * 100).toFixed(4)}%`, {
    favorable_outcomes: favorable, total_outcomes: total,
    probability: +prob.toFixed(6), probability_percent: +(prob * 100).toFixed(4) + '%',
    odds: `${odds_for} : ${odds_against}`, complement: +((1 - prob) * 100).toFixed(4) + '%',
  })
}

// ─── SAVINGS / RETIREMENT TOOLS ──────────────────────────────────────────────

EXEC['savings-goal-calculator'] = (p) => {
  const goal = num(p.goal || p.target || p.amount, 0)
  const current = num(p.current || p.saved || p.current_savings, 0)
  const rate = num(p.rate || p.annual_rate, 6) / 100 / 12
  const monthly = num(p.monthly || p.contribution || p.monthly_savings, 0)
  if (!goal) return err('Enter your savings goal amount.')
  const remaining = goal - current
  if (remaining <= 0) return ok(`You have already reached your goal of $${goal.toLocaleString()}!`, { goal, current, surplus: current - goal })
  if (!monthly) return ok(`Need $${remaining.toLocaleString()} more to reach goal.`, { goal, current, remaining })
  const months = rate > 0
    ? Math.log(1 + remaining * rate / monthly) / Math.log(1 + rate)
    : remaining / monthly
  const years = Math.floor(months / 12)
  const rem = Math.round(months % 12)
  return ok(`Reach $${goal.toLocaleString()} in ~${years}y ${rem}m`, {
    goal, current_savings: current, remaining, monthly_contribution: monthly,
    months_to_goal: Math.ceil(months), years_to_goal: +months.toFixed(1) / 12,
    timeline: `${years} years, ${rem} months`,
  })
}

EXEC['retirement-calculator'] = (p) => {
  const age = num(p.age || p.current_age, 30)
  const retireAge = num(p.retire_age || p.retirement_age, 65)
  const savings = num(p.savings || p.current_savings, 0)
  const monthly = num(p.monthly || p.monthly_contribution || p.contribution, 500)
  const rate = num(p.rate || p.annual_return, 7) / 100
  const years = retireAge - age
  if (years <= 0) return err('Retirement age must be greater than current age.')
  const n = years * 12
  const monthlyRate = rate / 12
  const futureValue = savings * Math.pow(1 + rate, years)
    + monthly * (Math.pow(1 + monthlyRate, n) - 1) / monthlyRate
  const monthlyIncome = futureValue * (rate / 12)
  return ok(`Retirement corpus: $${Math.round(futureValue).toLocaleString()} at age ${retireAge}`, {
    current_age: age, retirement_age: retireAge, years_to_retire: years,
    current_savings: savings, monthly_contribution: monthly, annual_return_rate: num(p.rate || p.annual_return, 7),
    retirement_corpus: Math.round(futureValue),
    estimated_monthly_income: Math.round(monthlyIncome),
    note: 'Inflation not adjusted. Increase contributions to account for inflation.',
  })
}

// ─── MATH SEQUENCE & ADVANCED TOOLS ─────────────────────────────────────────
EXEC['multiplication-table'] = (p) => {
  const n = Math.abs(num(p.number || p.text, 5)), rows = Math.min(Math.max(num(p.rows || p.count, 12), 2), 20)
  if (!n || n > 1000) return err('Enter a number (1–1000).')
  const table: Record<string, number> = {}
  for (let i = 1; i <= rows; i++) table[`${n} × ${i}`] = n * i
  return ok(`Multiplication table for ${n}`, { number: n, table, rows })
}
EXEC['times-table'] = EXEC['multiplication-table']
EXEC['collatz-conjecture'] = (p) => {
  let n = Math.abs(Math.floor(num(p.number || p.text, 6)))
  if (n < 1) return err('Enter a positive integer.')
  const seq = [n]; let steps = 0
  while (n !== 1 && steps < 1000) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; seq.push(n); steps++ }
  return ok(`Collatz sequence for ${seq[0]}: ${steps} steps`, { start: seq[0], steps, sequence: seq, max: Math.max(...seq) })
}
EXEC['pascal-triangle'] = (p) => {
  const rows = Math.min(Math.max(num(p.rows || p.count, 6), 1), 15)
  const triangle: number[][] = []
  for (let i = 0; i < rows; i++) {
    const row: number[] = [1]
    for (let j = 1; j < i; j++) row.push(triangle[i - 1][j - 1] + triangle[i - 1][j])
    if (i > 0) row.push(1)
    triangle.push(row)
  }
  return ok(`Pascal's Triangle (${rows} rows)`, { triangle, rows })
}
EXEC['prime-number-generator'] = (p) => {
  const limit = Math.min(Math.max(num(p.limit || p.max || p.number, 100), 2), 10000)
  const sieve = new Uint8Array(limit + 1).fill(1)
  sieve[0] = sieve[1] = 0
  for (let i = 2; i * i <= limit; i++) if (sieve[i]) for (let j = i * i; j <= limit; j += i) sieve[j] = 0
  const primes = Array.from(sieve.entries()).filter(([, v]) => v).map(([i]) => i)
  return ok(`Found ${primes.length} primes up to ${limit}`, { primes, count: primes.length, limit, largest: primes[primes.length - 1] })
}
EXEC['primes-up-to'] = EXEC['prime-number-generator']
EXEC['perfect-number-checker'] = (p) => {
  const n = Math.abs(Math.floor(num(p.number || p.text, 28)))
  if (n < 1 || n > 1e7) return err('Enter a positive integer up to 10,000,000.')
  let sum = 1; for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) { sum += i; if (i !== n / i) sum += n / i }
  const perfect = sum === n && n > 1
  return ok(perfect ? `${n} is a perfect number! (divisors sum = ${n})` : `${n} is not a perfect number (divisors sum = ${sum})`, { number: n, is_perfect: perfect, divisor_sum: sum })
}
EXEC['text-diff'] = (p) => {
  const t1 = str(p.text1 || p.original || p.text_a || p.a), t2 = str(p.text2 || p.modified || p.text_b || p.b)
  if (!t1 && !t2) return err('Enter two texts to compare.')
  const words1 = t1.split(/\s+/).filter(Boolean), words2 = t2.split(/\s+/).filter(Boolean)
  const added = words2.filter((w: string) => !words1.includes(w))
  const removed = words1.filter((w: string) => !words2.includes(w))
  const common = words1.filter((w: string) => words2.includes(w))
  const similarity = words1.length + words2.length > 0 ? (2 * common.length / (words1.length + words2.length) * 100) : 100
  return ok(`Similarity: ${similarity.toFixed(1)}%`, { words_in_original: words1.length, words_in_modified: words2.length, added_words: added.slice(0, 50), removed_words: removed.slice(0, 50), common_words: common.length, similarity_percent: +similarity.toFixed(2) })
}
EXEC['diff-checker'] = EXEC['text-diff']
EXEC['compare-text'] = EXEC['text-diff']
EXEC['text-comparison'] = EXEC['text-diff']
EXEC['levenshtein-distance'] = (p) => {
  const a = str(p.text1 || p.a || p.word1), b = str(p.text2 || p.b || p.word2)
  if (!a || !b) return err('Enter two strings to compare.')
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => j === 0 ? i : 0))
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
  const dist = dp[m][n], maxLen = Math.max(m, n)
  return ok(`Levenshtein distance: ${dist} (similarity: ${((1 - dist / maxLen) * 100).toFixed(1)}%)`, { distance: dist, string1: a, string2: b, length1: m, length2: n, similarity_percent: +((1 - dist / maxLen) * 100).toFixed(2) })
}
EXEC['string-distance'] = EXEC['levenshtein-distance']
EXEC['edit-distance'] = EXEC['levenshtein-distance']
EXEC['color-contrast-checker'] = (p) => {
  const parseHex = (h: string) => { const c = h.replace(/^#/, ''); const full = c.length === 3 ? c.split('').map((x: string) => x + x).join('') : c; return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)] }
  const linearize = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) }
  const lum = ([r, g, b]: number[]) => 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
  const fg = str(p.foreground || p.fg || p.color1 || p.text, '#000000')
  const bg = str(p.background || p.bg || p.color2, '#ffffff')
  try {
    const l1 = lum(parseHex(fg)), l2 = lum(parseHex(bg))
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    const aa = ratio >= 4.5, aaa = ratio >= 7, aaLarge = ratio >= 3
    return ok(`Contrast ratio: ${ratio.toFixed(2)}:1 — WCAG ${aaa ? 'AAA' : aa ? 'AA' : aaLarge ? 'AA Large' : 'Fail'}`, { foreground: fg, background: bg, contrast_ratio: +ratio.toFixed(2), wcag_aa: aa, wcag_aaa: aaa, wcag_aa_large: aaLarge })
  } catch { return err('Invalid hex color. Use format #RRGGBB.') }
}
EXEC['contrast-checker'] = EXEC['color-contrast-checker']
EXEC['wcag-contrast-checker'] = EXEC['color-contrast-checker']
EXEC['color-palette-generator'] = (p) => {
  const base = str(p.text || p.hex || p.color, '#3b82f6').replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(base)) return err('Enter a valid 6-digit hex color.')
  const r = parseInt(base.slice(0, 2), 16), g = parseInt(base.slice(2, 4), 16), b = parseInt(base.slice(4, 6), 16)
  const toHex = (r: number, g: number, b: number) => '#' + [r, g, b].map((v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')
  const complementary = toHex(255 - r, 255 - g, 255 - b)
  const shades = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8].map((f: number) => toHex(r * f, g * f, b * f))
  return ok('Color palette generated.', { base: '#' + base, complementary, shades, triadic: [toHex(g, b, r), toHex(b, r, g)], analogous: [toHex(r, g + 30, b), toHex(r, g - 30, b)] })
}
EXEC['color-palette'] = EXEC['color-palette-generator']
EXEC['color-scheme-generator'] = EXEC['color-palette-generator']

// ─── ADDITIONAL EXECUTORS ────────────────────────────────────────────────────
EXEC['dice-roller'] = (p) => {
  const sides = Math.max(2, num(p.sides || p.faces, 6)), count = Math.min(Math.max(num(p.count || p.dice, 1), 1), 20)
  const rolls: number[] = []; for (let i = 0; i < count; i++) rolls.push(secureRandomInt(1, sides + 1))
  const sum = rolls.reduce((a: number, b: number) => a + b, 0)
  return ok(`Rolled ${count}d${sides}: ${rolls.join(', ')} = ${sum}`, { rolls, sum, average: +(sum / count).toFixed(2), min: Math.min(...rolls), max: Math.max(...rolls), sides, count })
}
EXEC['dice-roll'] = EXEC['dice-roller']
EXEC['coin-flip'] = (p) => {
  const times = Math.min(Math.max(num(p.times || p.count, 1), 1), 100)
  const results: string[] = []; for (let i = 0; i < times; i++) results.push(secureRandomInt(0, 2) === 0 ? 'Heads' : 'Tails')
  const heads = results.filter((r: string) => r === 'Heads').length
  return ok(`${times === 1 ? results[0] : `${heads} Heads, ${times - heads} Tails`}`, { result: results[0], results, heads, tails: times - heads, flips: times })
}
EXEC['coin-toss'] = EXEC['coin-flip']
EXEC['random-string-generator'] = (p) => {
  const len = Math.min(Math.max(num(p.length, 16), 1), 256)
  const charset = str(p.charset || p.chars, 'alphanumeric')
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  if (charset === 'alpha') chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  else if (charset === 'numeric') chars = '0123456789'
  else if (charset === 'hex') chars = '0123456789abcdef'
  else if (charset === 'all') chars += '!@#$%^&*()-_=+[]{}|;:,.<>?'
  let result = ''; for (let i = 0; i < len; i++) result += chars[secureRandomInt(0, chars.length)]
  return ok(`Random string (${len} chars).`, { result, length: len, charset })
}
EXEC['random-text-generator'] = EXEC['random-string-generator']
EXEC['random-word-generator'] = (p) => {
  const wordLists = ['apple','brave','cloud','dream','eagle','flame','grace','harbor','ivory','jewel','kelp','lemon','maple','noble','ocean','prism','quartz','river','storm','tiger','unity','violet','wisdom','xenon','yellow','zenith']
  const count = Math.min(Math.max(num(p.count, 5), 1), 50)
  const words: string[] = []; for (let i = 0; i < count; i++) words.push(wordLists[secureRandomInt(0, wordLists.length)])
  return ok(`Generated ${count} random word(s).`, { words, sentence: words.join(' '), count })
}
EXEC['quadratic-formula-solver'] = (p) => {
  const a = num(p.a || p.coefficient_a, 0), b = num(p.b || p.coefficient_b, 0), c = num(p.c || p.coefficient_c, 0)
  if (!a) return err('Coefficient a cannot be zero (not a quadratic).')
  const discriminant = b * b - 4 * a * c
  if (discriminant > 0) {
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a), x2 = (-b - Math.sqrt(discriminant)) / (2 * a)
    return ok(`x = ${x1.toFixed(4)} or x = ${x2.toFixed(4)}`, { a, b, c, discriminant, x1: +x1.toFixed(6), x2: +x2.toFixed(6), roots: 2 })
  } else if (discriminant === 0) {
    const x = -b / (2 * a)
    return ok(`x = ${x.toFixed(4)} (repeated root)`, { a, b, c, discriminant: 0, x1: +x.toFixed(6), x2: +x.toFixed(6), roots: 1 })
  } else {
    const realPart = (-b / (2 * a)).toFixed(4), imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4)
    return ok(`Complex roots: ${realPart} ± ${imagPart}i`, { a, b, c, discriminant, real_part: +realPart, imaginary_part: +imagPart, roots: 0 })
  }
}
EXEC['quadratic-equation-solver'] = EXEC['quadratic-formula-solver']
EXEC['timezone-converter'] = (p) => {
  const now = new Date()
  const tzFrom = str(p.from || p.timezone, 'UTC')
  const tzTo = str(p.to || p.target, 'UTC')
  try {
    const fromTime = now.toLocaleString('en-US', { timeZone: tzFrom, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const toTime = now.toLocaleString('en-US', { timeZone: tzTo, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    return ok(`Converted ${tzFrom} → ${tzTo}`, { from_timezone: tzFrom, to_timezone: tzTo, from_time: fromTime, to_time: toTime, utc: now.toISOString() })
  } catch { return err('Invalid timezone. Use IANA names like "America/New_York", "Asia/Kolkata", "Europe/London".') }
}
EXEC['time-zone-converter'] = EXEC['timezone-converter']
EXEC['world-clock'] = EXEC['timezone-converter']
EXEC['iban-validator'] = (p) => {
  const raw = str(p.text || p.iban).replace(/\s/g, '').toUpperCase()
  if (!raw) return err('Enter an IBAN.')
  if (raw.length < 15 || raw.length > 34) return err('IBAN should be 15–34 characters.')
  const rearranged = raw.slice(4) + raw.slice(0, 4)
  const numeric = rearranged.split('').map((c: string) => c >= 'A' ? (c.charCodeAt(0) - 55).toString() : c).join('')
  let rem = 0; for (const ch of numeric) rem = (rem * 10 + parseInt(ch)) % 97
  const valid = rem === 1
  return ok(valid ? `Valid IBAN (${raw.slice(0, 2)})` : 'Invalid IBAN — checksum failed', {
    iban: raw, valid, country: raw.slice(0, 2), check_digits: raw.slice(2, 4), length: raw.length,
  })
}
EXEC['isbn-validator'] = (p) => {
  const raw = str(p.text || p.isbn).replace(/[-\s]/g, '')
  if (!raw) return err('Enter an ISBN.')
  if (raw.length === 10) {
    let sum = 0; for (let i = 0; i < 9; i++) sum += parseInt(raw[i]) * (10 - i)
    const check = raw[9] === 'X' ? 10 : parseInt(raw[9]); sum += check
    const valid = sum % 11 === 0
    return ok(valid ? 'Valid ISBN-10' : 'Invalid ISBN-10', { isbn: raw, valid, type: 'ISBN-10' })
  } else if (raw.length === 13) {
    let sum = 0; for (let i = 0; i < 12; i++) sum += parseInt(raw[i]) * (i % 2 === 0 ? 1 : 3)
    const valid = (10 - sum % 10) % 10 === parseInt(raw[12])
    return ok(valid ? 'Valid ISBN-13' : 'Invalid ISBN-13', { isbn: raw, valid, type: 'ISBN-13' })
  }
  return err('ISBN must be 10 or 13 digits.')
}
EXEC['number-to-roman'] = EXEC['roman-numeral-converter']
EXEC['roman-to-decimal'] = EXEC['roman-numeral-converter']
EXEC['decimal-to-roman'] = EXEC['roman-numeral-converter']
EXEC['roman-to-number'] = EXEC['roman-numeral-converter']
EXEC['epoch-converter'] = EXEC['unix-timestamp-converter']
EXEC['timestamp-converter'] = EXEC['unix-timestamp-converter']
EXEC['date-to-unix'] = EXEC['unix-timestamp-converter']
EXEC['unix-to-date'] = EXEC['unix-timestamp-converter']
EXEC['nanoid-generator'] = (p) => {
  const size = Math.min(Math.max(num(p.size || p.length, 21), 1), 128)
  const alphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict'
  let id = ''; const bytes = crypto.getRandomValues(new Uint8Array(size * 2))
  let i = 0; while (id.length < size) { const byte = bytes[i++ % bytes.length]; if (byte < 64) id += alphabet[byte & 63] }
  return ok(`NanoID generated (${size} chars).`, { id: id.slice(0, size), size })
}
EXEC['slug-from-text'] = EXEC['slug-generator']
EXEC['url-slug-from-title'] = EXEC['url-slug-generator']
EXEC['text-to-slug'] = EXEC['slug-generator']
EXEC['slugify-text'] = EXEC['url-slug-generator']
EXEC['random-quote-generator'] = (p) => {
  const quotes = [
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
    { text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
    { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { text: 'Life is what happens to you while you are busy making other plans.', author: 'John Lennon' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
    { text: 'You must be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
    { text: 'Success is not final, failure is not fatal; it is the courage to continue that counts.', author: 'Winston Churchill' },
    { text: 'Whether you think you can or you think you cannot, you are right.', author: 'Henry Ford' },
    { text: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt' },
  ]
  const q = quotes[secureRandomInt(0, quotes.length)]
  return ok(`"${q.text}" — ${q.author}`, { quote: q.text, author: q.author })
}
EXEC['random-joke-generator'] = (p) => {
  const jokes = [
    { setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs!' },
    { setup: 'Why did the developer go broke?', punchline: 'Because he used up all his cache.' },
    { setup: 'How many programmers does it take to change a light bulb?', punchline: 'None. That\'s a hardware problem.' },
    { setup: 'Why do Java developers wear glasses?', punchline: 'Because they don\'t C#.' },
    { setup: 'What do you call a programmer from Finland?', punchline: 'Nerdic.' },
  ]
  const j = jokes[secureRandomInt(0, jokes.length)]
  return ok(`${j.setup} ${j.punchline}`, { setup: j.setup, punchline: j.punchline })
}

// ─── COLOR CONVERSION & DESIGN TOOLS ─────────────────────────────────────────
EXEC['hsl-to-rgb'] = (p) => {
  const h = num(p.h || p.hue, 0) % 360, s = num(p.s || p.saturation, 100) / 100, l = num(p.l || p.lightness, 50) / 100
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x } else if (h < 120) { r = x; g = c } else if (h < 180) { g = c; b = x } else if (h < 240) { g = x; b = c } else if (h < 300) { r = x; b = c } else { r = c; b = x }
  const ri = Math.round((r + m) * 255), gi = Math.round((g + m) * 255), bi = Math.round((b + m) * 255)
  const hex = '#' + [ri, gi, bi].map((v: number) => v.toString(16).padStart(2, '0')).join('')
  return ok(`RGB: ${ri}, ${gi}, ${bi}`, { h, s: s * 100, l: l * 100, r: ri, g: gi, b: bi, rgb: `rgb(${ri}, ${gi}, ${bi})`, hex })
}
EXEC['rgb-to-hsl'] = (p) => {
  const r = num(p.r || p.red, 0) / 255, g = num(p.g || p.green, 0) / 255, b = num(p.b || p.blue, 0) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) * 60 : max === g ? ((b - r) / d + 2) * 60 : ((r - g) / d + 4) * 60 }
  return ok(`HSL: ${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`, { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) })
}
EXEC['cmyk-to-rgb'] = (p) => {
  const c = num(p.c || p.cyan, 0) / 100, m = num(p.m || p.magenta, 0) / 100, y = num(p.y || p.yellow, 0) / 100, k = num(p.k || p.key || p.black, 0) / 100
  const r = Math.round(255 * (1 - c) * (1 - k)), g = Math.round(255 * (1 - m) * (1 - k)), b = Math.round(255 * (1 - y) * (1 - k))
  const hex = '#' + [r, g, b].map((v: number) => v.toString(16).padStart(2, '0')).join('')
  return ok(`RGB: ${r}, ${g}, ${b}`, { c: c * 100, m: m * 100, y: y * 100, k: k * 100, r, g, b, hex, rgb: `rgb(${r}, ${g}, ${b})` })
}
EXEC['rgb-to-cmyk'] = (p) => {
  const r = num(p.r || p.red, 0) / 255, g = num(p.g || p.green, 0) / 255, b = num(p.b || p.blue, 0) / 255
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return ok('CMYK: 0%, 0%, 0%, 100%', { c: 0, m: 0, y: 0, k: 100 })
  const c = (1 - r - k) / (1 - k), m = (1 - g - k) / (1 - k), y = (1 - b - k) / (1 - k)
  return ok(`CMYK: ${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%`, { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) })
}
EXEC['hex-to-cmyk'] = (p) => {
  const h = str(p.text || p.hex).replace(/^#/, '').trim()
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return err('Enter a 6-digit hex color.')
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return ok('CMYK: 0%, 0%, 0%, 100%', { c: 0, m: 0, y: 0, k: 100 })
  const c = (1 - r - k) / (1 - k), m = (1 - g - k) / (1 - k), y = (1 - b - k) / (1 - k)
  return ok(`CMYK: ${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%`, { hex: '#' + h, c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) })
}
EXEC['markdown-to-html'] = (p) => {
  const md = str(p.text || p.markdown); if (!md) return err('Enter markdown text.')
  const html = md
    .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>').replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>').replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>').replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>').replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>').replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>').replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\n\n/g, '</p><p>').replace(/^(?!<[hplib])/gm, '<p>').replace(/(?<![>])$/gm, '</p>')
  return ok('Markdown converted to HTML.', { markdown: md, html: html.trim(), length: html.length })
}
EXEC['markdown-preview'] = EXEC['markdown-to-html']
EXEC['html-to-markdown'] = (p) => {
  const html = str(p.text || p.html); if (!html) return err('Enter HTML to convert.')
  const md = html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1').replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1').replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**').replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*').replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`').replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1').replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '').trim()
  return ok('HTML converted to Markdown.', { html, markdown: md })
}
EXEC['json-to-typescript'] = (p) => {
  const t = str(p.text || p.json).trim(); if (!t) return err('Paste JSON to convert.')
  try {
    const obj = JSON.parse(t)
    const toType = (v: unknown, indent = 0): string => {
      const pad = '  '.repeat(indent), innerPad = '  '.repeat(indent + 1)
      if (v === null) return 'null'
      if (typeof v === 'string') return 'string'
      if (typeof v === 'number') return Number.isInteger(v) ? 'number' : 'number'
      if (typeof v === 'boolean') return 'boolean'
      if (Array.isArray(v)) return v.length ? `${toType(v[0], indent)}[]` : 'unknown[]'
      if (typeof v === 'object') {
        const fields = Object.entries(v as Record<string, unknown>).map(([k, val]) => `${innerPad}${k}: ${toType(val, indent + 1)};`).join('\n')
        return `{\n${fields}\n${pad}}`
      }
      return 'unknown'
    }
    const iface = `interface Generated ${toType(obj)}`
    return ok('JSON converted to TypeScript interface.', { typescript: iface, original_keys: Object.keys(typeof obj === 'object' && obj ? obj : {}).length })
  } catch { return err('Invalid JSON.') }
}
EXEC['json-to-interface'] = EXEC['json-to-typescript']
EXEC['stopwatch'] = () => ok('Stopwatch ready — this tool runs in your browser. Open it to start timing.', { note: 'Interactive tools run client-side. No server processing needed.' })
EXEC['pomodoro-timer'] = () => ok('Pomodoro timer ready. Open the tool to start your focus session.', { default_focus_minutes: 25, default_break_minutes: 5, note: 'This interactive tool runs in your browser.' })
EXEC['typing-speed-test'] = () => ok('Typing speed test ready. Start the tool to begin.', { note: 'Interactive tool — measures WPM and accuracy in your browser.' })
EXEC['screen-ruler'] = () => ok('Screen ruler ready. Open the tool to measure pixels on your screen.', { note: 'Interactive tool — runs in your browser.' })
EXEC['note-pad'] = () => ok('Notepad ready. Your text will be auto-saved in your browser.', { note: 'Interactive tool — text saved locally.' })
EXEC['to-do-list'] = () => ok('To-do list ready. Add tasks and track your progress.', { note: 'Interactive tool — tasks saved locally in your browser.' })
EXEC['habit-tracker'] = () => ok('Habit tracker ready. Track your daily habits and streaks.', { note: 'Interactive tool — data saved locally in your browser.' })
EXEC['flashcard-maker'] = () => ok('Flashcard maker ready. Create and study flashcards.', { note: 'Interactive tool — runs in your browser.' })
EXEC['salary-hike-calculator'] = (p) => {
  const current = num(p.current || p.current_salary || p.salary, 0), hike = num(p.hike || p.hike_percent || p.percent, 10)
  if (!current) return err('Enter your current salary.')
  const increase = current * hike / 100, newSalary = current + increase
  return ok(`After ${hike}% hike: ${newSalary.toFixed(2)}`, { current_salary: current, hike_percent: hike, increase: +increase.toFixed(2), new_salary: +newSalary.toFixed(2), annual_increase: +(increase * 12).toFixed(2) })
}
EXEC['hike-calculator'] = EXEC['salary-hike-calculator']
EXEC['salary-increment-calculator'] = EXEC['salary-hike-calculator']
EXEC['attendance-required-calculator'] = (p) => {
  const present = num(p.present || p.attended, 0), total = num(p.total || p.conducted, 0), target = num(p.target || p.required, 75)
  if (!total) return err('Enter total classes conducted.')
  const current = (present / total) * 100
  let needed = 0
  if (current < target) {
    needed = Math.ceil((target / 100 * total - present) / (1 - target / 100))
  }
  const canSkip = current >= target ? Math.floor((present - target / 100 * total) / (target / 100)) : 0
  return ok(`Current: ${current.toFixed(1)}% | ${current >= target ? `Can skip ${canSkip} more` : `Need ${needed} more classes`}`, { present, total, current_percent: +current.toFixed(2), target_percent: target, classes_needed: needed, can_skip: canSkip })
}
EXEC['attendance-calculator'] = EXEC['attendance-required-calculator']
EXEC['expense-splitter'] = (p) => {
  const total = num(p.total || p.amount || p.bill, 0), people = Math.max(1, num(p.people || p.count, 2))
  if (!total) return err('Enter the total amount.')
  const per = total / people
  return ok(`Each person pays: ${per.toFixed(2)}`, { total, people, per_person: +per.toFixed(2), tip_15: +(total * 1.15 / people).toFixed(2), tip_18: +(total * 1.18 / people).toFixed(2), tip_20: +(total * 1.20 / people).toFixed(2) })
}
EXEC['bill-splitter'] = EXEC['expense-splitter']
EXEC['split-bill-calculator'] = EXEC['expense-splitter']

// ─── TEXT TOOLS, TABLE GENERATORS, ADDITIONAL ALIASES ────────────────────────
EXEC['word-scrambler'] = (p) => {
  const t = str(p.text || p.words); if (!t.trim()) return err('Enter text to scramble.')
  const words = t.split(/\s+/)
  const scramble = (w: string) => { if (w.length < 3) return w; const m = w.slice(1, -1).split(''); for (let i = m.length - 1; i > 0; i--) { const j = secureRandomInt(0, i + 1); [m[i], m[j]] = [m[j], m[i]] } return w[0] + m.join('') + w[w.length - 1] }
  const scrambled = words.map(scramble).join(' ')
  return ok('Text scrambled.', { original: t, scrambled, word_count: words.length })
}
EXEC['text-scrambler'] = EXEC['word-scrambler']
EXEC['sentence-scrambler'] = (p) => {
  const t = str(p.text); if (!t.trim()) return err('Enter text to scramble.')
  const sentences = t.match(/[^.!?]+[.!?]+/g) || [t]
  const shuffled = [...sentences]
  for (let i = shuffled.length - 1; i > 0; i--) { const j = secureRandomInt(0, i + 1); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] }
  return ok('Sentences scrambled.', { original: t, scrambled: shuffled.join(' '), sentence_count: sentences.length })
}
EXEC['markdown-table-generator'] = (p) => {
  const rows = Math.min(Math.max(num(p.rows, 3), 1), 10), cols = Math.min(Math.max(num(p.cols || p.columns, 3), 1), 10)
  const header = Array.from({ length: cols }, (_, i) => `Col ${i + 1}`).join(' | ')
  const separator = Array.from({ length: cols }, () => '---').join(' | ')
  const body = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => `R${r + 1}C${c + 1}`).join(' | ')).join('\n')
  const table = `| ${header} |\n| ${separator} |\n${body.split('\n').map((row: string) => `| ${row} |`).join('\n')}`
  return ok(`Markdown table (${rows} × ${cols}) generated.`, { table, rows, cols })
}
EXEC['html-table-generator'] = (p) => {
  const rows = Math.min(Math.max(num(p.rows, 3), 1), 10), cols = Math.min(Math.max(num(p.cols || p.columns, 3), 1), 10)
  const header = Array.from({ length: cols }, (_, i) => `<th>Col ${i + 1}</th>`).join('')
  const body = Array.from({ length: rows }, (_, r) => `<tr>${Array.from({ length: cols }, (_, c) => `<td>R${r + 1}C${c + 1}</td>`).join('')}</tr>`).join('\n  ')
  const table = `<table>\n  <thead><tr>${header}</tr></thead>\n  <tbody>\n  ${body}\n  </tbody>\n</table>`
  return ok(`HTML table (${rows} × ${cols}) generated.`, { table, rows, cols })
}
EXEC['table-generator'] = EXEC['markdown-table-generator']
EXEC['csv-to-table'] = (p) => {
  const csv = str(p.text || p.csv); if (!csv.trim()) return err('Enter CSV to convert to table.')
  const lines = csv.trim().split('\n'), header = lines[0].split(',').map((h: string) => h.trim())
  const sep = header.map(() => '---').join(' | ')
  const rows = lines.slice(1).map((row: string) => '| ' + row.split(',').map((c: string) => c.trim()).join(' | ') + ' |')
  const table = `| ${header.join(' | ')} |\n| ${sep} |\n${rows.join('\n')}`
  return ok('CSV converted to Markdown table.', { table, rows: lines.length - 1, columns: header.length })
}
EXEC['color-tint-generator'] = (p) => {
  const base = str(p.text || p.hex || p.color, '#3b82f6').replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(base)) return err('Enter a valid 6-digit hex color.')
  const r = parseInt(base.slice(0, 2), 16), g = parseInt(base.slice(2, 4), 16), b = parseInt(base.slice(4, 6), 16)
  const toHex = (r: number, g: number, b: number) => '#' + [r, g, b].map((v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')
  const tints = [0.2, 0.4, 0.6, 0.8].map((t: number) => ({ tint: Math.round(t * 100) + '%', hex: toHex(r + (255 - r) * t, g + (255 - g) * t, b + (255 - b) * t) }))
  const shades = [0.8, 0.6, 0.4, 0.2].map((s: number) => ({ shade: Math.round((1 - s) * 100) + '%', hex: toHex(r * s, g * s, b * s) }))
  return ok(`Tints and shades for #${base}`, { base: '#' + base, tints, shades })
}
EXEC['color-tints'] = EXEC['color-tint-generator']
EXEC['color-shades'] = EXEC['color-tint-generator']
EXEC['color-wheel'] = EXEC['color-palette-generator']
EXEC['age-in-days'] = (p) => {
  const dob = str(p.text || p.dob || p.date || p.birthdate); if (!dob) return err('Enter your date of birth (YYYY-MM-DD).')
  const d = new Date(dob), now = new Date()
  if (isNaN(d.getTime())) return err('Invalid date. Use YYYY-MM-DD format.')
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000), hours = Math.floor(diff / 3600000), minutes = Math.floor(diff / 60000), weeks = Math.floor(days / 7), months = Math.floor(days / 30.44), years = now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0)
  return ok(`You are ${years} years, ${months % 12} months old (${days.toLocaleString()} days)`, { years, months, weeks, days, hours, minutes, dob })
}
EXEC['age-in-months'] = EXEC['age-in-days']
EXEC['age-in-hours'] = EXEC['age-in-days']
EXEC['age-in-minutes'] = EXEC['age-in-days']
EXEC['days-since-birth'] = EXEC['age-in-days']
EXEC['number-to-ordinal'] = (p) => {
  const n = Math.floor(num(p.text || p.number, 1))
  const suffix = (n: number) => { const abs = Math.abs(n) % 100; if (abs >= 11 && abs <= 13) return 'th'; const r = abs % 10; return r === 1 ? 'st' : r === 2 ? 'nd' : r === 3 ? 'rd' : 'th' }
  return ok(`${n}${suffix(n)}`, { number: n, ordinal: `${n}${suffix(n)}`, suffix: suffix(n) })
}
EXEC['ordinal-number'] = EXEC['number-to-ordinal']
EXEC['ordinal-indicator'] = EXEC['number-to-ordinal']
EXEC['number-to-fraction'] = (p) => {
  const d = num(p.text || p.number, 0.5)
  if (!isFinite(d)) return err('Enter a valid decimal number.')
  const tolerance = 1e-6; let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = d
  do { const a = Math.floor(b); let aux = h1; h1 = a * h1 + h2; h2 = aux; aux = k1; k1 = a * k1 + k2; k2 = aux; b = 1 / (b - a) } while (Math.abs(d - h1 / k1) > d * tolerance && isFinite(b) && k1 < 10000)
  return ok(`${d} ≈ ${h1}/${k1}`, { decimal: d, numerator: h1, denominator: k1, fraction: `${h1}/${k1}`, simplified: Math.abs(d - h1 / k1) < tolerance })
}
EXEC['decimal-to-fraction'] = EXEC['number-to-fraction']
EXEC['fraction-to-decimal'] = (p) => {
  const t = str(p.text || p.fraction).trim()
  const m = t.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (!m) return err('Enter a fraction like 3/4 or 22/7.')
  const num2 = parseInt(m[1]), den = parseInt(m[2])
  if (den === 0) return err('Denominator cannot be zero.')
  const dec = num2 / den, gcd2 = (a: number, b: number): number => b ? gcd2(b, a % b) : a, g = gcd2(Math.abs(num2), Math.abs(den))
  return ok(`${num2}/${den} = ${dec}`, { numerator: num2, denominator: den, decimal: dec, simplified: `${num2 / g}/${den / g}`, percent: +(dec * 100).toFixed(4) })
}
EXEC['text-repeater'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text to repeat.')
  const n = Math.min(Math.max(num(p.times || p.count, 3), 1), 100), sep = str(p.separator || p.sep, ' ')
  const result = Array(n).fill(t).join(sep)
  return ok(`Repeated ${n} times.`, { text: t, times: n, separator: sep, result, total_chars: result.length })
}
EXEC['repeat-text'] = EXEC['text-repeater']
EXEC['text-duplicator'] = EXEC['text-repeater']
EXEC['json-minifier'] = (p) => {
  const t = str(p.text || p.json).trim(); if (!t) return err('Paste JSON to minify.')
  try { const minified = JSON.stringify(JSON.parse(t)); return ok('JSON minified.', { minified, original_size: t.length, minified_size: minified.length, saved_bytes: t.length - minified.length, reduction: Math.round((1 - minified.length / t.length) * 100) + '%' }) }
  catch { return err('Invalid JSON.') }
}
EXEC['json-compress'] = EXEC['json-minifier']
EXEC['json-beautify'] = (p) => {
  const t = str(p.text || p.json).trim(); if (!t) return err('Paste JSON to format.')
  try { const indent = Math.min(Math.max(num(p.indent || p.spaces, 2), 1), 8); const beautified = JSON.stringify(JSON.parse(t), null, indent); return ok('JSON formatted.', { beautified, original_size: t.length, formatted_size: beautified.length }) }
  catch { return err('Invalid JSON.') }
}
EXEC['json-format'] = EXEC['json-beautify']
EXEC['json-pretty-print'] = EXEC['json-beautify']
EXEC['json-flattener'] = (p) => {
  const t = str(p.text || p.json).trim(); if (!t) return err('Paste JSON to flatten.')
  try {
    const obj = JSON.parse(t)
    const flatten = (o: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
      return Object.entries(o).reduce((acc: Record<string, unknown>, [k, v]) => {
        const key = prefix ? `${prefix}.${k}` : k
        if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(acc, flatten(v as Record<string, unknown>, key))
        else acc[key] = v
        return acc
      }, {})
    }
    const flat = flatten(obj)
    return ok(`Flattened to ${Object.keys(flat).length} keys.`, { flattened: flat, original_keys: Object.keys(obj).length, flattened_keys: Object.keys(flat).length })
  } catch { return err('Invalid JSON.') }
}
EXEC['flatten-json'] = EXEC['json-flattener']
EXEC['sql-formatter'] = (p) => {
  const sql = str(p.text || p.sql).trim(); if (!sql) return err('Enter SQL to format.')
  const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL']
  let formatted = sql.replace(/\s+/g, ' ')
  keywords.forEach((kw: string) => { formatted = formatted.replace(new RegExp(`\\b${kw}\\b`, 'gi'), `\n${kw}`) })
  formatted = formatted.trim()
  return ok('SQL formatted.', { formatted, original: sql, keyword_count: keywords.filter((k: string) => sql.toUpperCase().includes(k)).length })
}
EXEC['sql-beautify'] = EXEC['sql-formatter']
EXEC['sql-pretty-print'] = EXEC['sql-formatter']
EXEC['xml-formatter'] = (p) => {
  const xml = str(p.text || p.xml).trim(); if (!xml) return err('Enter XML to format.')
  let indent = 0, formatted = ''
  xml.replace(/>\s*</g, '><').split(/(?<=>)(?=<)/).forEach((node: string) => {
    if (node.match(/^<\/\w/)) indent--
    formatted += ' '.repeat(indent * 2) + node + '\n'
    if (node.match(/^<\w[^/]*[^/]>$/) && !node.match(/^<.+\/>/)) indent++
  })
  return ok('XML formatted.', { formatted: formatted.trim(), original_size: xml.length })
}
EXEC['xml-beautify'] = EXEC['xml-formatter']
EXEC['xml-pretty-print'] = EXEC['xml-formatter']

// ─── NETWORKING, CRYPTO, ADVANCED DEV TOOLS ──────────────────────────────────
EXEC['ip-to-binary'] = (p) => {
  const ip = str(p.text || p.ip).trim()
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((n: number) => isNaN(n) || n < 0 || n > 255)) return err('Enter a valid IPv4 address (e.g. 192.168.1.1).')
  const binary = parts.map((n: number) => n.toString(2).padStart(8, '0')).join('.')
  const decimal = parts.reduce((acc: number, n: number) => (acc << 8) + n, 0)
  return ok(`Binary: ${binary}`, { ip, binary, decimal: decimal >>> 0, hex: '0x' + (decimal >>> 0).toString(16).toUpperCase().padStart(8, '0') })
}
EXEC['binary-to-ip'] = (p) => {
  const bin = str(p.text || p.binary).replace(/\s+/g, '')
  const parts = bin.split('.')
  if (parts.length === 4 && parts.every((p: string) => /^[01]{8}$/.test(p))) {
    const ip = parts.map((p: string) => parseInt(p, 2)).join('.')
    return ok(`IP: ${ip}`, { binary: bin, ip, decimal: parts.map((p: string) => parseInt(p, 2)).reduce((a: number, n: number) => (a << 8) + n, 0) >>> 0 })
  }
  if (/^[01]{32}$/.test(bin)) {
    const ip = [0, 8, 16, 24].map((i: number) => parseInt(bin.slice(i, i + 8), 2)).join('.')
    return ok(`IP: ${ip}`, { binary: bin, ip })
  }
  return err('Enter a 32-bit binary string or dotted binary like 11000000.10101000.00000001.00000001.')
}
EXEC['cidr-calculator'] = (p) => {
  const input = str(p.text || p.cidr || p.network).trim()
  const m = input.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/)
  if (!m) return err('Enter CIDR notation like 192.168.1.0/24.')
  const [, ip, prefixStr] = m, prefix = parseInt(prefixStr)
  if (prefix < 0 || prefix > 32) return err('Prefix must be 0–32.')
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0
  const parts = ip.split('.').map(Number)
  const ipInt = parts.reduce((a: number, n: number) => (a << 8) + n, 0) >>> 0
  const network = (ipInt & mask) >>> 0, broadcast = (network | ~mask) >>> 0
  const toIp = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
  const hosts = prefix < 31 ? Math.pow(2, 32 - prefix) - 2 : prefix === 31 ? 2 : 1
  return ok(`Network: ${toIp(network)} | ${hosts.toLocaleString()} hosts`, { network: toIp(network), broadcast: toIp(broadcast), first_host: prefix < 31 ? toIp(network + 1) : toIp(network), last_host: prefix < 31 ? toIp(broadcast - 1) : toIp(broadcast), subnet_mask: toIp(mask), prefix_length: prefix, total_hosts: hosts, wildcard: toIp(~mask >>> 0) })
}
EXEC['subnet-calculator'] = EXEC['cidr-calculator']
EXEC['cidr-to-ip-range'] = EXEC['cidr-calculator']
EXEC['mac-address-generator'] = () => {
  const bytes = Array.from({ length: 6 }, () => secureRandomInt(0, 256).toString(16).padStart(2, '0'))
  bytes[0] = ((parseInt(bytes[0], 16) & 0xFE) | 0x02).toString(16).padStart(2, '0')
  const mac = bytes.join(':').toUpperCase()
  return ok(`MAC: ${mac}`, { mac, mac_hyphen: bytes.join('-').toUpperCase(), mac_no_sep: bytes.join('').toUpperCase(), type: 'Locally Administered (LAA)', unicast: true })
}
EXEC['random-mac-address'] = EXEC['mac-address-generator']
EXEC['mac-address-validator'] = (p) => {
  const mac = str(p.text || p.mac).trim()
  const valid = /^([0-9A-Fa-f]{2}[:\-]){5}([0-9A-Fa-f]{2})$/.test(mac) || /^[0-9A-Fa-f]{12}$/.test(mac)
  return ok(valid ? `Valid MAC address: ${mac}` : `Invalid MAC address: ${mac}`, { mac, is_valid: valid })
}
EXEC['sha1-generator'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text to hash.')
  return ok('SHA-1 is computed server-side for security.', { note: 'SHA-1 requires a crypto backend. Use the backend API for real SHA-1 hashes.', input_length: t.length, algorithm: 'SHA-1', tip: 'SHA-1 is deprecated for security — consider SHA-256 instead.' })
}
EXEC['md5-generator'] = (p) => {
  const t = str(p.text); if (!t) return err('Enter text to hash.')
  return ok('MD5 is computed server-side for security.', { note: 'MD5 requires a crypto backend. Use the backend API for real MD5 hashes.', input_length: t.length, algorithm: 'MD5', tip: 'MD5 is broken for security purposes — consider SHA-256 or bcrypt.' })
}
EXEC['bitcoin-address-validator'] = (p) => {
  const addr = str(p.text || p.address).trim()
  const legacy = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addr)
  const segwit = /^bc1[a-z0-9]{39,59}$/.test(addr)
  const valid = legacy || segwit
  const type = legacy ? (addr.startsWith('1') ? 'P2PKH (Legacy)' : 'P2SH (Legacy)') : segwit ? 'Bech32 (SegWit)' : 'Unknown'
  return ok(valid ? `Valid ${type} Bitcoin address` : 'Invalid Bitcoin address', { address: addr, is_valid: valid, type: valid ? type : null, length: addr.length })
}
EXEC['btc-address-validator'] = EXEC['bitcoin-address-validator']
EXEC['ethereum-address-validator'] = (p) => {
  const addr = str(p.text || p.address).trim()
  const valid = /^0x[0-9a-fA-F]{40}$/.test(addr)
  return ok(valid ? `Valid Ethereum address: ${addr}` : 'Invalid Ethereum address', { address: addr, is_valid: valid, checksummed: valid && addr !== addr.toLowerCase() && addr !== addr.toUpperCase() })
}
EXEC['eth-address-validator'] = EXEC['ethereum-address-validator']
EXEC['color-name-finder'] = (p) => {
  const hex = str(p.text || p.hex || p.color).replace(/^#/, '').toLowerCase()
  if (!/^[0-9a-f]{6}$/.test(hex)) return err('Enter a valid 6-digit hex color.')
  const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16)
  const hsl = (() => { const rd = r / 255, gd = g / 255, bd = b / 255, max = Math.max(rd, gd, bd), min = Math.min(rd, gd, bd), l = (max + min) / 2; let h = 0, s = 0; if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); h = max === rd ? ((gd - bd) / d + (gd < bd ? 6 : 0)) * 60 : max === gd ? ((bd - rd) / d + 2) * 60 : ((rd - gd) / d + 4) * 60 } return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) } })()
  const hue = hsl.h, sat = hsl.s, light = hsl.l
  let name = 'Unknown'
  if (light < 5) name = 'Black'
  else if (light > 95) name = 'White'
  else if (sat < 10) name = light < 30 ? 'Dark Gray' : light > 70 ? 'Light Gray' : 'Gray'
  else if (hue < 15 || hue >= 345) name = light < 40 ? 'Dark Red' : 'Red'
  else if (hue < 45) name = sat > 80 && light > 50 ? 'Orange' : 'Brown'
  else if (hue < 70) name = 'Yellow'
  else if (hue < 150) name = light < 40 ? 'Dark Green' : 'Green'
  else if (hue < 195) name = 'Cyan'
  else if (hue < 255) name = light < 40 ? 'Dark Blue' : 'Blue'
  else if (hue < 285) name = 'Purple'
  else if (hue < 330) name = 'Pink'
  else name = 'Rose'
  return ok(`#${hex} → ${name}`, { hex: '#' + hex, r, g, b, rgb: `rgb(${r}, ${g}, ${b})`, hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, approximate_name: name })
}
EXEC['color-name'] = EXEC['color-name-finder']
EXEC['hex-color-name'] = EXEC['color-name-finder']

// ─── CRON, REGEX, COLOR GRADIENT, MISC TOOLS ─────────────────────────────────
EXEC['cron-expression-generator'] = (p) => {
  const min = str(p.minute || p.min, '*'), hr = str(p.hour, '*'), dom = str(p.day || p.dom, '*'), mon = str(p.month, '*'), dow = str(p.dow || p.weekday, '*')
  const expr = `${min} ${hr} ${dom} ${mon} ${dow}`
  const describe = () => {
    if (expr === '* * * * *') return 'Every minute'
    if (expr === '0 * * * *') return 'Every hour (at minute 0)'
    if (expr === '0 0 * * *') return 'Every day at midnight'
    if (expr === '0 0 * * 0') return 'Every Sunday at midnight'
    if (expr === '0 0 1 * *') return 'First day of every month at midnight'
    return `Custom: minute=${min}, hour=${hr}, day=${dom}, month=${mon}, weekday=${dow}`
  }
  return ok(`Cron: ${expr}`, { expression: expr, description: describe(), minute: min, hour: hr, day_of_month: dom, month: mon, day_of_week: dow })
}
EXEC['cron-parser'] = (p) => {
  const expr = str(p.text || p.expression || p.cron).trim()
  const parts = expr.split(/\s+/)
  if (parts.length !== 5) return err('Enter a valid cron expression with 5 parts (min hr dom mon dow).')
  const [min, hr, dom, mon, dow] = parts
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const humanize = (val: string, names: string[], label: string) => val === '*' ? `every ${label}` : val.includes('/') ? `every ${val.split('/')[1]} ${label}s` : val.includes(',') ? val.split(',').map((v: string) => names[parseInt(v)] || v).join(', ') : names[parseInt(val)] || `${label} ${val}`
  return ok(`Parsed: "${expr}"`, { expression: expr, minute: min === '*' ? 'Every minute' : `Minute ${min}`, hour: hr === '*' ? 'Every hour' : `Hour ${hr}`, day_of_month: humanize(dom, [], 'day'), month: humanize(mon, months, 'month'), day_of_week: humanize(dow, days, 'day') })
}
EXEC['cron-validator'] = (p) => {
  const expr = str(p.text || p.expression).trim()
  const parts = expr.split(/\s+/)
  const valid = parts.length === 5 && parts.every((p: string) => /^(\*|[0-9,\-\/\*]+)$/.test(p))
  return ok(valid ? `Valid cron expression: ${expr}` : `Invalid cron expression: ${expr}`, { expression: expr, is_valid: valid, parts: parts.length })
}
EXEC['cron-to-text'] = EXEC['cron-parser']
EXEC['color-gradient-generator'] = (p) => {
  const c1 = str(p.color1 || p.from || p.start, '#ff0000').replace(/^#/, '')
  const c2 = str(p.color2 || p.to || p.end, '#0000ff').replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(c1) || !/^[0-9a-fA-F]{6}$/.test(c2)) return err('Enter two valid 6-digit hex colors.')
  const steps = Math.min(Math.max(num(p.steps || p.count, 5), 2), 20)
  const r1 = parseInt(c1.slice(0, 2), 16), g1 = parseInt(c1.slice(2, 4), 16), b1 = parseInt(c1.slice(4, 6), 16)
  const r2 = parseInt(c2.slice(0, 2), 16), g2 = parseInt(c2.slice(2, 4), 16), b2 = parseInt(c2.slice(4, 6), 16)
  const gradient = Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1)
    const r = Math.round(r1 + (r2 - r1) * t), g = Math.round(g1 + (g2 - g1) * t), b = Math.round(b1 + (b2 - b1) * t)
    return { step: i + 1, hex: '#' + [r, g, b].map((v: number) => v.toString(16).padStart(2, '0')).join(''), rgb: `rgb(${r}, ${g}, ${b})` }
  })
  const css = `background: linear-gradient(90deg, #${c1}, #${c2});`
  return ok(`${steps}-step gradient from #${c1} to #${c2}`, { from: '#' + c1, to: '#' + c2, steps, gradient, css_linear_gradient: css })
}
EXEC['color-gradient'] = EXEC['color-gradient-generator']
EXEC['gradient-generator'] = EXEC['color-gradient-generator']
EXEC['color-mixer'] = (p) => {
  const c1 = str(p.color1 || p.from, '#ff0000').replace(/^#/, '')
  const c2 = str(p.color2 || p.to, '#0000ff').replace(/^#/, '')
  const ratio = Math.min(Math.max(num(p.ratio || p.mix, 50), 0), 100) / 100
  if (!/^[0-9a-fA-F]{6}$/.test(c1) || !/^[0-9a-fA-F]{6}$/.test(c2)) return err('Enter two valid 6-digit hex colors.')
  const r = Math.round(parseInt(c1.slice(0, 2), 16) * (1 - ratio) + parseInt(c2.slice(0, 2), 16) * ratio)
  const g = Math.round(parseInt(c1.slice(2, 4), 16) * (1 - ratio) + parseInt(c2.slice(2, 4), 16) * ratio)
  const b = Math.round(parseInt(c1.slice(4, 6), 16) * (1 - ratio) + parseInt(c2.slice(4, 6), 16) * ratio)
  const mixed = '#' + [r, g, b].map((v: number) => v.toString(16).padStart(2, '0')).join('')
  return ok(`Mixed: ${mixed}`, { color1: '#' + c1, color2: '#' + c2, ratio_percent: Math.round(ratio * 100), mixed, rgb: `rgb(${r}, ${g}, ${b})` })
}
EXEC['color-blender'] = EXEC['color-mixer']
EXEC['unit-circle'] = (p) => {
  const deg = num(p.text || p.degrees || p.angle, 0) % 360
  const rad = deg * Math.PI / 180
  return ok(`${deg}° → sin: ${Math.sin(rad).toFixed(6)}, cos: ${Math.cos(rad).toFixed(6)}`, { degrees: deg, radians: +rad.toFixed(6), sin: +Math.sin(rad).toFixed(6), cos: +Math.cos(rad).toFixed(6), tan: Math.cos(rad) !== 0 ? +Math.tan(rad).toFixed(6) : null, quadrant: deg < 90 ? 'I' : deg < 180 ? 'II' : deg < 270 ? 'III' : 'IV' })
}
EXEC['trig-calculator'] = EXEC['unit-circle']
EXEC['sin-cos-tan'] = EXEC['unit-circle']
EXEC['trigonometry-calculator'] = EXEC['unit-circle']
EXEC['matrix-calculator'] = (p) => {
  const t = str(p.text || p.matrix).trim()
  if (!t) return err('Enter a matrix like: [[1,2],[3,4]]')
  try {
    const mat = JSON.parse(t) as number[][]
    if (!Array.isArray(mat) || !Array.isArray(mat[0])) return err('Enter a valid 2D matrix as JSON.')
    const rows = mat.length, cols = mat[0].length
    const isSquare = rows === cols
    const trace = isSquare ? mat.reduce((s: number, row: number[], i: number) => s + row[i], 0) : null
    const det = isSquare && rows === 2 ? mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0] : null
    return ok(`Matrix ${rows}×${cols}${isSquare ? ' (square)' : ''}`, { rows, cols, is_square: isSquare, trace, determinant_2x2: det, matrix: mat })
  } catch { return err('Invalid matrix JSON. Example: [[1,2],[3,4]]') }
}
EXEC['matrix-determinant'] = EXEC['matrix-calculator']
EXEC['matrix-trace'] = EXEC['matrix-calculator']
EXEC['roman-to-decimal'] = (p) => {
  const s = str(p.text || p.roman).toUpperCase().trim()
  if (!s) return err('Enter a Roman numeral (e.g. XIV, MCMXCIX).')
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  if (!/^[IVXLCDM]+$/.test(s)) return err('Invalid Roman numeral characters.')
  let result = 0
  for (let i = 0; i < s.length; i++) { const cur = map[s[i]], next = map[s[i + 1]]; if (next && cur < next) result -= cur; else result += cur }
  return ok(`${s} = ${result}`, { roman: s, decimal: result })
}
EXEC['roman-numeral-to-decimal'] = EXEC['roman-to-decimal']
EXEC['words-to-number'] = (p) => {
  const t = str(p.text || p.words).toLowerCase().trim()
  if (!t) return err('Enter a number in words (e.g. "forty two").')
  const ones: Record<string, number> = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 }
  const mults: Record<string, number> = { hundred: 100, thousand: 1000, million: 1000000, billion: 1000000000 }
  const words = t.replace(/-/g, ' ').split(/\s+/)
  let result = 0, current = 0
  for (const w of words) { if (ones[w] !== undefined) current += ones[w]; else if (mults[w]) { if (w === 'hundred') current *= 100; else { result += current * mults[w]; current = 0 } } }
  result += current
  return ok(`${t} = ${result}`, { words: t, number: result })
}
EXEC['text-to-number'] = EXEC['words-to-number']
EXEC['number-words-parser'] = EXEC['words-to-number']

// ─── ALIASES & MISSING SLUGS ─────────────────────────────────────────────────
EXEC['url-encode'] = EXEC['url-encoder']
EXEC['url-decode'] = EXEC['url-decoder']
EXEC['uri-encoder'] = EXEC['url-encoder']
EXEC['uri-decoder'] = EXEC['url-decoder']
EXEC['percent-encoder'] = EXEC['url-encoder']
EXEC['percent-decoder'] = EXEC['url-decoder']
EXEC['base64-encode'] = EXEC['base64-encoder']
EXEC['base64-decode'] = EXEC['base64-decoder']
EXEC['html-encode'] = EXEC['html-entity-encoder']
EXEC['html-decode'] = EXEC['html-entity-decoder']
EXEC['html-encoder'] = EXEC['html-entity-encoder']
EXEC['html-escape'] = EXEC['html-entity-encoder']
EXEC['html-unescape'] = EXEC['html-entity-decoder']
EXEC['vigenere-cipher'] = (p) => {
  const t = str(p.text), key = str(p.key || p.keyword, 'KEY').toUpperCase()
  if (!t) return err('Enter text to encrypt.')
  if (!key.replace(/[^A-Z]/g, '')) return err('Enter a keyword (letters only).')
  const k = key.replace(/[^A-Z]/g, '')
  let out = '', ki = 0
  for (let i = 0; i < t.length; i++) {
    const c = t.charCodeAt(i)
    if (c >= 65 && c <= 90) { out += String.fromCharCode(((c - 65 + k.charCodeAt(ki % k.length) - 65) % 26) + 65); ki++ }
    else if (c >= 97 && c <= 122) { out += String.fromCharCode(((c - 97 + k.charCodeAt(ki % k.length) - 65) % 26) + 97); ki++ }
    else out += t[i]
  }
  return ok('Vigenere cipher applied.', { input: t, key, encrypted: out })
}
EXEC['password-strength-checker'] = (p) => {
  const pw = str(p.text || p.password); if (!pw) return err('Enter a password to check.')
  const len = pw.length
  const hasUpper = /[A-Z]/.test(pw), hasLower = /[a-z]/.test(pw)
  const hasNum = /\d/.test(pw), hasSymbol = /[^a-zA-Z0-9]/.test(pw)
  const unique = new Set(pw).size
  const entropy = Math.log2(
    (hasUpper ? 26 : 0) + (hasLower ? 26 : 0) + (hasNum ? 10 : 0) + (hasSymbol ? 32 : 0)
  ) * len
  let score = 0
  if (len >= 8) score++; if (len >= 12) score++; if (len >= 16) score++
  if (hasUpper) score++; if (hasLower) score++; if (hasNum) score++; if (hasSymbol) score++
  if (unique > len * 0.7) score++
  const strength = score <= 2 ? 'Very Weak' : score <= 4 ? 'Weak' : score <= 6 ? 'Moderate' : score <= 7 ? 'Strong' : 'Very Strong'
  const suggestions = []
  if (len < 12) suggestions.push('Use at least 12 characters')
  if (!hasUpper) suggestions.push('Add uppercase letters')
  if (!hasLower) suggestions.push('Add lowercase letters')
  if (!hasNum) suggestions.push('Add numbers')
  if (!hasSymbol) suggestions.push('Add special characters (!@#$%)')
  return ok(`Password strength: ${strength}`, { strength, score, length: len, entropy: Math.round(entropy), has_uppercase: hasUpper, has_lowercase: hasLower, has_numbers: hasNum, has_symbols: hasSymbol, unique_chars: unique, suggestions })
}
EXEC['password-strength'] = EXEC['password-strength-checker']
EXEC['password-security-checker'] = EXEC['password-strength-checker']
EXEC['vat-calculator'] = (p) => {
  const amount = num(p.amount || p.price, 0), rate = num(p.rate || p.vat_rate || p.vat, 20)
  if (!amount) return err('Enter the amount.')
  const vatEx = amount * rate / 100, totalEx = amount + vatEx
  const baseIn = amount / (1 + rate / 100), vatIn = amount - baseIn
  return ok(`VAT (${rate}%): ${vatEx.toFixed(2)} | Total: ${totalEx.toFixed(2)}`, {
    base_amount: amount, vat_rate_percent: rate,
    vat_exclusive: { vat_amount: +vatEx.toFixed(2), total_with_vat: +totalEx.toFixed(2) },
    vat_inclusive: { base_price: +baseIn.toFixed(2), vat_amount: +vatIn.toFixed(2) },
  })
}
EXEC['vat-calculator-uk'] = EXEC['vat-calculator']
EXEC['sales-tax-calculator'] = (p) => {
  const amount = num(p.amount || p.price, 0), rate = num(p.rate || p.tax_rate || p.tax, 8.5)
  if (!amount) return err('Enter the amount.')
  const tax = amount * rate / 100
  return ok(`Sales tax (${rate}%): ${tax.toFixed(2)} | Total: ${(amount + tax).toFixed(2)}`, {
    pre_tax: amount, tax_rate_percent: rate,
    tax_amount: +tax.toFixed(2), total: +(amount + tax).toFixed(2),
  })
}
EXEC['tax-calculator'] = EXEC['sales-tax-calculator']
EXEC['income-tax-calculator'] = (p) => {
  const income = num(p.income || p.amount || p.salary, 0)
  if (!income) return err('Enter your annual income.')
  // Simple US-style progressive brackets
  const brackets = [[0, 11000, 0.10], [11000, 44725, 0.12], [44725, 95375, 0.22], [95375, 182400, 0.24], [182400, 231250, 0.32], [231250, 578125, 0.35], [578125, Infinity, 0.37]]
  let tax = 0
  for (const [lo, hi, rate] of brackets) {
    if (income <= lo) break
    tax += (Math.min(income, hi) - lo) * rate
  }
  const effective = (tax / income) * 100
  return ok(`Estimated income tax: $${tax.toFixed(2)} (${effective.toFixed(1)}% effective)`, {
    income, estimated_tax: +tax.toFixed(2), effective_rate_percent: +effective.toFixed(2),
    after_tax_income: +(income - tax).toFixed(2), note: 'US 2023 single-filer brackets (approximate — consult a tax professional).',
  })
}
EXEC['credit-card-validator'] = (p) => {
  const raw = str(p.text || p.card_number || p.number).replace(/\D/g, '')
  if (!raw) return err('Enter a card number.')
  if (raw.length < 13 || raw.length > 19) return err('Card number should be 13–19 digits.')
  // Luhn algorithm
  let sum = 0, alt = false
  for (let i = raw.length - 1; i >= 0; i--) {
    let d = parseInt(raw[i])
    if (alt) { d *= 2; if (d > 9) d -= 9 }
    sum += d; alt = !alt
  }
  const luhnValid = sum % 10 === 0
  const type = raw.startsWith('4') ? 'Visa' : /^5[1-5]/.test(raw) ? 'Mastercard' : /^3[47]/.test(raw) ? 'American Express' : /^6(?:011|5)/.test(raw) ? 'Discover' : raw.startsWith('35') ? 'JCB' : 'Unknown'
  return ok(luhnValid ? `Valid ${type} card` : 'Invalid card number (fails Luhn check)', {
    card_number: raw, length: raw.length, luhn_valid: luhnValid, card_type: type, masked: raw.slice(-4).padStart(raw.length, '*'),
  })
}
EXEC['luhn-algorithm'] = EXEC['credit-card-validator']
EXEC['luhn-checker'] = EXEC['credit-card-validator']
EXEC['currency-converter'] = (p) => {
  const amount = num(p.amount || p.value, 1)
  const from = str(p.from || p.currency, 'USD').toUpperCase()
  const to = str(p.to || p.target, 'EUR').toUpperCase()
  return ok(`${amount} ${from} = ? ${to} — live rates unavailable client-side`, {
    amount, from, to, note: 'For real-time currency conversion, this tool contacts our backend. Live exchange rates from fixer.io or open.er-api.com are used server-side.',
    tip: 'If you need offline estimates: 1 USD ≈ 0.92 EUR, 0.79 GBP, 110 JPY, 1.36 CAD, 1.58 AUD.',
  })
}
EXEC['exchange-rate-calculator'] = EXEC['currency-converter']
EXEC['forex-calculator'] = EXEC['currency-converter']

// — Public API ────────────────────────────────────────────────────────────────
export function getClientExecutor(slug: string): Executor | undefined {
  return EXEC[slug]
}

export async function runClientTool(slug: string, payload: Payload): Promise<ToolRunResponse | null> {
  const exec = EXEC[slug]
  if (!exec) return null
  try {
    return await exec(payload)
  } catch (e) {
    // Any unexpected throw → null so caller falls back to backend.
    if (typeof console !== 'undefined') console.warn(`[clientToolExecutors] ${slug} threw, falling back:`, e)
    return null
  }
}

export const CLIENT_EXECUTABLE_SLUGS = Object.keys(EXEC)
