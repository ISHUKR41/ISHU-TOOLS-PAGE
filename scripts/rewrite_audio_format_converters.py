"""
Enrich audio + video-to-audio format converter rows in registry.py.
These live in _FORMAT_CONVERTER_DEFS as 6-tuples:
    (slug, title, desc, category, input_kind, tags)
Idempotent.
"""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "backend" / "app" / "registry.py"

# (display, ext, one-line note)
A = {
    "mp3":  ("MP3",  ".mp3",  "lossy, ~192 kbps, plays everywhere"),
    "wav":  ("WAV",  ".wav",  "uncompressed PCM, lossless, ideal for editing"),
    "m4a":  ("M4A",  ".m4a",  "AAC in MP4 container, native to iPhone/iTunes"),
    "ogg":  ("OGG",  ".ogg",  "open-source Vorbis codec"),
    "flac": ("FLAC", ".flac", "lossless compressed, ~50% of WAV size"),
    "aac":  ("AAC",  ".aac",  "lossy, better quality than MP3 at the same bitrate"),
    "opus": ("Opus", ".opus", "modern lossy codec used by WhatsApp / Discord"),
    "wma":  ("WMA",  ".wma",  "legacy Windows Media Audio"),
}
V = {
    "mp4":   ("MP4",   ".mp4"),
    "mov":   ("MOV",   ".mov"),
    "webm":  ("WebM",  ".webm"),
    "avi":   ("AVI",   ".avi"),
    "mkv":   ("MKV",   ".mkv"),
    "video": ("Video", "any video"),
}

# Hand-tuned descriptions for popular audio↔audio pairs.
A2A = {
    ("mp3","wav"):  "Convert MP3 (lossy) to lossless WAV PCM 16-bit / 44.1 kHz — perfect for editing in Audacity, Logic, Ableton or any DAW.",
    ("wav","mp3"):  "Convert WAV to MP3 at 192 kbps — ~10× smaller files, plays on every device. Free, no signup.",
    ("m4a","mp3"):  "Convert iPhone / iTunes M4A (AAC) to universally-compatible MP3 at 192 kbps. Great for voice memos and Apple Music exports.",
    ("ogg","mp3"):  "Convert OGG Vorbis to MP3 at 192 kbps — useful when an app or device rejects .ogg files.",
    ("flac","mp3"): "Convert lossless FLAC to MP3 (192 kbps) — much smaller files for phones and streaming. Tags preserved.",
    ("aac","mp3"):  "Convert AAC to MP3 at 192 kbps — broader compatibility for older players and car stereos.",
    ("opus","mp3"): "Convert Opus (WhatsApp / Discord voice) to MP3 — playable in any audio app or video editor.",
    ("wma","mp3"):  "Convert Windows Media WMA to MP3 — modern, universally-supported audio.",
    ("mp3","m4a"):  "Convert MP3 to M4A (AAC) for iPhone, iTunes, and Apple Music libraries. Tags preserved.",
    ("mp3","ogg"):  "Convert MP3 to OGG Vorbis — open-source codec, smaller files at the same quality.",
    ("mp3","flac"): "Convert MP3 to FLAC container (lossless wrapper — won't recover discarded data, but useful for archiving).",
    ("mp3","aac"):  "Convert MP3 to AAC — better quality than MP3 at the same bitrate. Free, no signup.",
    ("wav","flac"): "Convert WAV to lossless FLAC — exact same audio quality, ~50% smaller files. Perfect for archiving.",
    ("flac","wav"): "Convert FLAC to uncompressed WAV PCM — needed by some DAWs and old hardware.",
    ("wav","m4a"):  "Convert WAV to M4A (AAC) — much smaller files for iPhone / iTunes, near-original quality.",
    ("m4a","wav"):  "Convert M4A to lossless WAV PCM — ready for editing in any DAW.",
    ("ogg","wav"):  "Convert OGG Vorbis to uncompressed WAV PCM — usable in any audio editor.",
    ("aac","wav"):  "Convert AAC to uncompressed WAV PCM — full-quality input for editing.",
}

# Hand-tuned descriptions for video → audio extracts.
V2A = {
    ("video","mp3"):  "Extract audio from any MP4 / MOV / WebM / AVI / MKV video as MP3 (192 kbps). No re-encoding loss beyond the original. Free, no watermark.",
    ("mp4","mp3"):    "Extract MP3 audio (192 kbps) from MP4 video — perfect for music videos and lectures. Free, no watermark.",
    ("mov","mp3"):    "Extract MP3 audio from QuickTime MOV (iPhone screen recordings, Mac exports). Free.",
    ("webm","mp3"):   "Extract MP3 audio from WebM video (YouTube downloads, browser recordings). Free.",
    ("avi","mp3"):    "Extract MP3 audio from legacy AVI video. Free.",
    ("mkv","mp3"):    "Extract MP3 audio from MKV containers (Matroska, often used for movies). Free.",
    ("video","wav"):  "Extract uncompressed WAV PCM audio from any video — full quality, ready for editing.",
    ("mp4","wav"):    "Extract uncompressed WAV PCM audio from MP4 video — ideal for podcast / DAW workflows.",
    ("video","m4a"):  "Extract M4A (AAC) audio from any video — small files, native iPhone format.",
    ("mp4","m4a"):    "Extract M4A audio from MP4 video for iPhone, iTunes and Apple Music.",
    ("video","flac"): "Extract lossless FLAC audio from any video — full quality, ~50% smaller than WAV.",
    ("video","aac"):  "Extract AAC audio from any video — small files, great quality.",
    ("video","ogg"):  "Extract OGG Vorbis audio from any video — open-source format.",
}

def _audio_pair(src: str, dst: str) -> tuple[str,str,list[str]] | None:
    if src in A and dst in A:
        S_disp, S_ext, S_note = A[src]
        D_disp, D_ext, D_note = A[dst]
        title = f"{S_disp} to {D_disp} Audio Converter ({S_ext} → {D_ext})"
        desc = A2A.get((src, dst)) or f"Convert {S_disp} ({S_note}) to {D_disp} ({D_note}). Free, no signup, batch supported."
        tags = list(dict.fromkeys([
            f"{src} to {dst}", f"convert {src} to {dst}", f"{src} {dst} converter",
            f"{S_ext} to {D_ext}", f"{src} to {dst} free",
            S_disp.lower(), D_disp.lower(), "audio converter",
        ]))
        return title, desc, tags
    return None

def _video_to_audio(src: str, dst: str) -> tuple[str,str,list[str]] | None:
    if src in V and dst in A:
        S_disp, S_ext = V[src]
        D_disp, D_ext, D_note = A[dst]
        if src == "video":
            title = f"Video to {D_disp} Audio Extractor (any video → {D_ext})"
        else:
            title = f"{S_disp} to {D_disp} Audio Extractor ({S_ext} → {D_ext})"
        desc = V2A.get((src, dst)) or f"Extract {D_disp} audio ({D_note}) from {S_disp} video. Free, no signup, no watermark."
        tags = list(dict.fromkeys([
            f"{src} to {dst}", f"extract {dst} from {src}",
            f"convert {src} to {dst}", f"{src} {dst} converter",
            f"{src} audio extractor", f"{src} to {dst} free",
            D_disp.lower(), "audio extractor", "video to audio",
        ]))
        return title, desc, tags
    return None

def _enrich(slug: str) -> tuple[str,str,list[str]] | None:
    m = re.match(r"^([a-z0-9]+)-to-([a-z0-9]+)$", slug)
    if not m: return None
    a, b = m.group(1), m.group(2)
    return _audio_pair(a, b) or _video_to_audio(a, b)

def patch() -> int:
    text = REGISTRY.read_text(encoding="utf-8")
    m = re.search(r"_FORMAT_CONVERTER_DEFS\s*[:=][^=\n]*=\s*\[", text)
    if not m: return 0
    start = m.end(); depth = 1; i = start
    while i < len(text) and depth > 0:
        c = text[i]
        if c == "[": depth += 1
        elif c == "]": depth -= 1
        i += 1
    block = text[start : i - 1]

    # 6-tuple pattern (slug, title, desc, "category", "kind", [tags])
    pat = re.compile(
        r"\(\s*\"([a-z0-9-]+)\"\s*,\s*\"([^\"]*)\"\s*,\s*\"([^\"]*)\"\s*,\s*\"([^\"]*)\"\s*,\s*\"([^\"]*)\"\s*,\s*\n?\s*\[([^\]]*)\]\s*\)",
        re.MULTILINE,
    )
    changed = 0
    def repl(mm: re.Match) -> str:
        nonlocal changed
        slug = mm.group(1)
        cat = mm.group(4)
        # Only touch audio-tools (audio↔audio + video→audio).
        if cat != "audio-tools": return mm.group(0)
        en = _enrich(slug)
        if not en: return mm.group(0)
        title, desc, tags = en
        kind = mm.group(5)
        tag_str = ", ".join('"' + t.replace('"', '\\"') + '"' for t in tags)
        new = (
            f'("{slug}", "{title}", "{desc}", "{cat}", "{kind}",\n'
            f'     [{tag_str}])'
        )
        if new != mm.group(0):
            changed += 1
        return new
    new_block = pat.sub(repl, block)
    new_text = text[:start] + new_block + text[i - 1:]
    if new_text != text:
        REGISTRY.write_text(new_text, encoding="utf-8")
    return changed

if __name__ == "__main__":
    print("registry.py rows updated:", patch())
