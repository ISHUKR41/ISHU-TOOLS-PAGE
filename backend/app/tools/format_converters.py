"""
ISHU TOOLS — Format Converters Pack (2026)

Wraps the generic video-converter / audio-converter handlers to expose
SEO-friendly, format-specific slugs:
  mp4-to-mov, mp4-to-webm, mp4-to-avi, mp4-to-mkv, mp4-to-gif (skip),
  mov-to-mp4, webm-to-mp4, avi-to-mp4, mkv-to-mp4, flv-to-mp4, wmv-to-mp4,
  mp3-to-wav, wav-to-mp3, m4a-to-mp3, ogg-to-mp3, flac-to-mp3,
  aac-to-mp3, opus-to-mp3, wma-to-mp3,
  mp3-to-m4a, mp3-to-ogg, mp3-to-flac, mp3-to-aac,
  video-to-mp3, video-to-wav, video-to-m4a (cross-format extract).

Adds a real audio-compressor (bitrate-based reduction).
"""
from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path
from typing import Any

from .handlers import ExecutionResult
from .av_studio_handlers import _handle_video_converter, _handle_audio_converter


def _safe(name: str, limit: int = 60) -> str:
    cleaned = re.sub(r"[^\w\s-]", "", name or "file")[:limit].strip()
    return cleaned.replace(" ", "_") or "file"


def _wrap_video(target_fmt: str):
    def _h(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
        p = dict(payload or {})
        p["format"] = target_fmt
        return _handle_video_converter(files, p, job_dir)
    return _h


def _wrap_audio(target_fmt: str):
    def _h(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
        p = dict(payload or {})
        p["format"] = target_fmt
        return _handle_audio_converter(files, p, job_dir)
    return _h


# ─── Cross-format: video → audio extract ───────────────────────────────────

def _make_video_to_audio(target_fmt: str):
    fmt_map = {
        "mp3":  ("libmp3lame", "192k", "audio/mpeg",  "mp3"),
        "wav":  ("pcm_s16le",  None,   "audio/wav",   "wav"),
        "m4a":  ("aac",        "192k", "audio/mp4",   "m4a"),
        "ogg":  ("libvorbis",  "192k", "audio/ogg",   "ogg"),
        "flac": ("flac",       None,   "audio/flac",  "flac"),
        "aac":  ("aac",        "192k", "audio/aac",   "aac"),
    }
    codec, bitrate, mime, ext = fmt_map[target_fmt]

    def _h(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
        if not files:
            return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
        if not shutil.which("ffmpeg"):
            return ExecutionResult(kind="json", message="Media engine unavailable on server.", data={"error": "ffmpeg missing"})
        src = files[0]
        out = job_dir / f"{src.stem}.{ext}"
        cmd = ["ffmpeg", "-y", "-i", str(src), "-vn", "-acodec", codec]
        if bitrate:
            cmd += ["-b:a", bitrate]
        cmd.append(str(out))
        try:
            subprocess.run(cmd, check=True, capture_output=True, timeout=600)
        except subprocess.TimeoutExpired:
            return ExecutionResult(kind="json", message="Extraction timed out — try a shorter video.", data={"error": "timeout"})
        except subprocess.CalledProcessError as e:
            return ExecutionResult(
                kind="json",
                message=f"Could not extract audio as {target_fmt.upper()} — make sure the video has an audio track.",
                data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]},
            )
        if not out.exists() or out.stat().st_size == 0:
            return ExecutionResult(kind="json", message="Extracted audio was empty (no audio track?).", data={"error": "empty"})
        return ExecutionResult(
            kind="file",
            message=f"✅ Audio extracted as {target_fmt.upper()}",
            output_path=out,
            filename=f"{_safe(src.stem)}.{ext}",
            content_type=mime,
        )
    return _h


# ─── Real audio compressor ──────────────────────────────────────────────────

def _handle_audio_compressor(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload an audio file.", data={"error": "No file"})
    if not shutil.which("ffmpeg"):
        return ExecutionResult(kind="json", message="Audio engine unavailable on server.", data={"error": "ffmpeg missing"})
    src = files[0]

    quality = str(payload.get("quality") or "medium").lower()
    quality_map = {
        "max":    ("64k",  "22050", "1"),  # tiny file (voice memo)
        "high":   ("96k",  "44100", "2"),  # small
        "medium": ("128k", "44100", "2"),  # balanced (recommended)
        "low":    ("192k", "44100", "2"),  # mild compression, near-original
    }
    bitrate, sr, ch = quality_map.get(quality, quality_map["medium"])

    out = job_dir / f"{src.stem}_compressed.mp3"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(src),
             "-vn", "-acodec", "libmp3lame",
             "-b:a", bitrate, "-ar", sr, "-ac", ch,
             str(out)],
            check=True, capture_output=True, timeout=600,
        )
    except subprocess.TimeoutExpired:
        return ExecutionResult(kind="json", message="Compression timed out — try a shorter file.", data={"error": "timeout"})
    except subprocess.CalledProcessError as e:
        return ExecutionResult(
            kind="json",
            message="Could not compress audio.",
            data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]},
        )

    if not out.exists() or out.stat().st_size == 0:
        return ExecutionResult(kind="json", message="Compressed audio was empty.", data={"error": "empty"})

    orig = src.stat().st_size
    new = out.stat().st_size
    saved = max(0, (1 - new / orig) * 100) if orig else 0
    return ExecutionResult(
        kind="file",
        message=f"✅ Compressed: {orig // 1024} KB → {new // 1024} KB ({saved:.0f}% smaller)",
        output_path=out,
        filename=f"{_safe(src.stem)}_compressed.mp3",
        content_type="audio/mpeg",
    )


# ─── Registry ───────────────────────────────────────────────────────────────

FORMAT_CONVERTER_HANDLERS: dict = {
    # Audio compressor (real)
    "audio-compressor": _handle_audio_compressor,
    "compress-audio": _handle_audio_compressor,
    "mp3-compressor": _handle_audio_compressor,
    "reduce-audio-size": _handle_audio_compressor,

    # Video → Video (format-specific)
    "mp4-to-mov":  _wrap_video("mov"),
    "mp4-to-mkv":  _wrap_video("mkv"),
    "mp4-to-webm": _wrap_video("webm"),
    "mp4-to-avi":  _wrap_video("avi"),
    "mp4-to-flv":  _wrap_video("flv"),
    "mp4-to-wmv":  _wrap_video("wmv"),
    "mov-to-mp4":  _wrap_video("mp4"),
    "mkv-to-mp4":  _wrap_video("mp4"),
    "webm-to-mp4": _wrap_video("mp4"),
    "avi-to-mp4":  _wrap_video("mp4"),
    "flv-to-mp4":  _wrap_video("mp4"),
    "wmv-to-mp4":  _wrap_video("mp4"),
    "m4v-to-mp4":  _wrap_video("mp4"),
    "mpeg-to-mp4": _wrap_video("mp4"),
    "mov-to-webm": _wrap_video("webm"),
    "mp4-to-m4v":  _wrap_video("m4v"),

    # Audio → Audio (format-specific)
    "mp3-to-wav":  _wrap_audio("wav"),
    "wav-to-mp3":  _wrap_audio("mp3"),
    "m4a-to-mp3":  _wrap_audio("mp3"),
    "ogg-to-mp3":  _wrap_audio("mp3"),
    "flac-to-mp3": _wrap_audio("mp3"),
    "aac-to-mp3":  _wrap_audio("mp3"),
    "opus-to-mp3": _wrap_audio("mp3"),
    "wma-to-mp3":  _wrap_audio("mp3"),
    "mp3-to-m4a":  _wrap_audio("m4a"),
    "mp3-to-ogg":  _wrap_audio("ogg"),
    "mp3-to-flac": _wrap_audio("flac"),
    "mp3-to-aac":  _wrap_audio("aac"),
    "wav-to-flac": _wrap_audio("flac"),
    "flac-to-wav": _wrap_audio("wav"),
    "wav-to-m4a":  _wrap_audio("m4a"),
    "m4a-to-wav":  _wrap_audio("wav"),
    "ogg-to-wav":  _wrap_audio("wav"),
    "aac-to-wav":  _wrap_audio("wav"),

    # Video → Audio (cross-format extract)
    "video-to-mp3":  _make_video_to_audio("mp3"),
    "mp4-to-mp3":    _make_video_to_audio("mp3"),
    "mov-to-mp3":    _make_video_to_audio("mp3"),
    "webm-to-mp3":   _make_video_to_audio("mp3"),
    "avi-to-mp3":    _make_video_to_audio("mp3"),
    "mkv-to-mp3":    _make_video_to_audio("mp3"),
    "video-to-wav":  _make_video_to_audio("wav"),
    "mp4-to-wav":    _make_video_to_audio("wav"),
    "video-to-m4a":  _make_video_to_audio("m4a"),
    "mp4-to-m4a":    _make_video_to_audio("m4a"),
    "video-to-flac": _make_video_to_audio("flac"),
    "video-to-aac":  _make_video_to_audio("aac"),
    "video-to-ogg":  _make_video_to_audio("ogg"),
}
