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
