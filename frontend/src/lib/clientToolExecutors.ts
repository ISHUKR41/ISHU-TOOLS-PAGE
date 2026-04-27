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
EXEC['rot13'] = (p) => { const t = str(p.text); return t ? ok('ROT13 applied.', { result: rotN(t, 13) }) : err('Please enter text.') }
EXEC['caesar-cipher'] = (p) => {
  const t = str(p.text); const shift = num(p.shift, 3)
  if (!t) return err('Please enter text to encrypt.')
  return ok(`Caesar cipher with shift ${shift}.`, { shift, result: rotN(t, shift) })
}
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

// — URL / HTML encoding —
EXEC['url-encoder'] = (p) => { const t = str(p.text); return t ? ok('URL-encoded.', { result: encodeURIComponent(t) }) : err('Please enter text.') }
EXEC['url-decoder'] = (p) => {
  const t = str(p.text); if (!t) return err('Please paste an encoded URL.')
  try { return ok('URL-decoded.', { result: decodeURIComponent(t.replace(/\+/g, ' ')) }) }
  catch { return err('Invalid URL-encoded string.') }
}
EXEC['html-encoder'] = (p) => {
  const t = str(p.text); if (!t) return err('Please enter HTML to encode.')
  const result = t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
  return ok('HTML entities encoded.', { result })
}
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

// — Color —
EXEC['hex-to-rgb'] = (p) => {
  const raw = str(p.text || p.hex).trim().replace(/^#/, '')
  let h = raw
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return err('Invalid HEX. Try something like #FF5733 or FF5733.')
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  return ok(`HEX → RGB`, { hex: `#${h.toUpperCase()}`, rgb: `rgb(${r}, ${g}, ${b})`, r, g, b })
}
EXEC['rgb-to-hex'] = (p) => {
  const r = num(p.r), g = num(p.g), b = num(p.b)
  if ([r, g, b].some((v) => v < 0 || v > 255)) return err('R / G / B must be 0–255.')
  const hex = '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase()
  return ok('RGB → HEX', { r, g, b, hex, rgb: `rgb(${r}, ${g}, ${b})` })
}
EXEC['color-picker'] = (p) => {
  const raw = str(p.text || p.hex, '#3b82f6').trim().replace(/^#/, '')
  let h = raw
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return err('Invalid HEX colour.')
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  // hsl
  const r1 = r / 255, g1 = g / 255, b1 = b / 255
  const mx = Math.max(r1, g1, b1), mn = Math.min(r1, g1, b1)
  const l = (mx + mn) / 2
  let s = 0, hh = 0
  if (mx !== mn) {
    const d = mx - mn
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn)
    if (mx === r1) hh = ((g1 - b1) / d + (g1 < b1 ? 6 : 0))
    else if (mx === g1) hh = (b1 - r1) / d + 2
    else hh = (r1 - g1) / d + 4
    hh *= 60
  }
  return ok('Colour info', {
    hex: `#${h.toUpperCase()}`, r, g, b,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${Math.round(hh)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    cmyk: (() => {
      const k = 1 - Math.max(r1, g1, b1)
      const c = (1 - r1 - k) / (1 - k || 1), m = (1 - g1 - k) / (1 - k || 1), y = (1 - b1 - k) / (1 - k || 1)
      return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`
    })(),
  })
}

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

// — Math / calc —
EXEC['percentage-calculator'] = (p) => {
  const v = num(p.value), t = num(p.total)
  const mode = str(p.mode, 'percentage')
  if (mode === 'percentage') {
    if (!t) return err('Total must be non-zero.')
    return ok(`${v} is ${(v / t * 100).toFixed(2)}% of ${t}.`, { value: v, total: t, percentage: +(v / t * 100).toFixed(4) })
  } else if (mode === 'value') {
    return ok(`${v}% of ${t} = ${(v * t / 100).toFixed(2)}.`, { percent: v, total: t, value: +(v * t / 100).toFixed(4) })
  } else if (mode === 'increase') {
    if (!t) return err('Total must be non-zero.')
    const change = ((v - t) / t) * 100
    return ok(`Change from ${t} to ${v}: ${change.toFixed(2)}%.`, { from: t, to: v, change_percent: +change.toFixed(4) })
  }
  return err('Unknown mode.')
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
EXEC['bmi-calculator'] = (p) => {
  const unit = str(p.unit, 'metric')
  let w = num(p.weight, 70), h = num(p.height, 175)
  if (unit === 'imperial') { w = w * 0.453592; h = h * 2.54 }
  if (h <= 0) return err('Height must be positive.')
  const bmi = w / Math.pow(h / 100, 2)
  let category = 'Normal weight'
  if (bmi < 18.5) category = 'Underweight'
  else if (bmi >= 25 && bmi < 30) category = 'Overweight'
  else if (bmi >= 30) category = 'Obese'
  return ok(`Your BMI is ${bmi.toFixed(1)} — ${category}.`, { bmi: +bmi.toFixed(2), category, weight_kg: +w.toFixed(1), height_cm: +h.toFixed(1) })
}
EXEC['tip-calculator'] = (p) => {
  const bill = num(p.bill_amount), tip = num(p.tip_percent, 10), people = Math.max(1, num(p.num_people, 1))
  if (bill <= 0) return err('Please enter a bill amount > 0.')
  const tipAmt = bill * tip / 100
  const total = bill + tipAmt
  return ok(`Tip ${tipAmt.toFixed(2)} • Total ${total.toFixed(2)} • Each ${(total / people).toFixed(2)}.`, {
    bill, tip_percent: tip, tip_amount: +tipAmt.toFixed(2), total: +total.toFixed(2),
    per_person: +(total / people).toFixed(2), num_people: people,
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
  return ok('Line numbers removed.', { result: t.split('\n').map((l: string) => l.replace(/^\s*\d+[\.\)\]:\-]\s*/, '')).join('\n') })
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
  if (/^[\.\-\/ ]+$/.test(t)) {
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
EXEC['uuid-generator'] = () => {
  const uuid = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16) })
  return ok(`UUID: ${uuid}`, { uuid, version: 4 })
}
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
EXEC['csv-to-json'] = (p) => {
  const t = str(p.text).trim(); if (!t) return err('Paste CSV data.')
  const lines = t.split('\n').map((l: string) => l.trim()).filter(Boolean)
  if (lines.length < 2) return err('CSV needs at least a header and one data row.')
  const headers = lines[0].split(',').map((h: string) => h.trim().replace(/^"|"$/g, ''))
  const rows = lines.slice(1).map((line: string) => { const vals = line.split(',').map((v: string) => v.trim().replace(/^"|"$/g, '')); const obj: Record<string, string> = {}; headers.forEach((h: string, i: number) => { obj[h] = vals[i] || '' }); return obj })
  return ok(`Converted ${rows.length} rows.`, { headers, rows, json: JSON.stringify(rows, null, 2) })
}
EXEC['json-to-csv'] = (p) => {
  const t = str(p.text).trim(); if (!t) return err('Paste JSON array.')
  try {
    const arr = JSON.parse(t); if (!Array.isArray(arr) || !arr.length) return err('Input must be a non-empty JSON array.')
    const headers = Object.keys(arr[0])
    const csv = [headers.join(','), ...arr.map((row: Record<string, unknown>) => headers.map((h: string) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n')
    return ok(`Converted ${arr.length} rows to CSV.`, { csv, row_count: arr.length })
  } catch { return err('Invalid JSON.') }
}
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
  const meters = v // assume input is meters
  return ok('Length converted.', { meters: v, kilometers: +(v / 1000).toFixed(6), centimeters: +(v * 100).toFixed(2), millimeters: +(v * 1000).toFixed(1), inches: +(v * 39.3701).toFixed(4), feet: +(v * 3.28084).toFixed(4), yards: +(v * 1.09361).toFixed(4), miles: +(v / 1609.344).toFixed(6) })
}
EXEC['weight-converter'] = (p) => {
  const v = num(p.value || p.text, 1)
  return ok('Weight converted.', { kilograms: v, grams: +(v * 1000).toFixed(2), milligrams: +(v * 1e6).toFixed(0), pounds: +(v * 2.20462).toFixed(4), ounces: +(v * 35.274).toFixed(4), tons_metric: +(v / 1000).toFixed(6) })
}

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
EXEC['age-calculator'] = (p) => {
  const d = new Date(str(p.date || p.birthdate || p.dob))
  if (Number.isNaN(d.getTime())) return err('Enter a valid birth date.')
  const now = new Date(), years = now.getFullYear() - d.getFullYear()
  const months = now.getMonth() - d.getMonth(), days = Math.floor((now.getTime() - d.getTime()) / 86400000)
  return ok(`Age: ${years} years`, { birthdate: d.toISOString().split('T')[0], years, months: years * 12 + months, days, weeks: Math.floor(days / 7), hours: days * 24 })
}
EXEC['tip-calculator'] = (p) => {
  const bill = num(p.bill || p.amount, 0), tipPct = num(p.tip || p.tip_percent, 15), people = Math.max(num(p.people || p.split, 1), 1)
  if (!bill) return err('Enter the bill amount.')
  const tip = bill * tipPct / 100, total = bill + tip
  return ok(`Tip: $${tip.toFixed(2)} | Total: $${total.toFixed(2)}`, { bill, tip_percent: tipPct, tip: +tip.toFixed(2), total: +total.toFixed(2), per_person: +(total / people).toFixed(2), people })
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
