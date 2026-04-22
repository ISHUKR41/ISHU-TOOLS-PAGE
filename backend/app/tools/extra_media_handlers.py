"""
ISHU TOOLS — Extra Media Tools (2026 batch #2)
Adds: text-to-speech, video-trimmer, video-compressor, audio-merger
"""
from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path
from typing import Any

from .handlers import ExecutionResult


def _safe(name: str, limit: int = 60) -> str:
    cleaned = re.sub(r"[^\w\s-]", "", name or "file")[:limit].strip()
    return cleaned.replace(" ", "_") or "file"


# ─── 1. Text-to-Speech (gTTS) ────────────────────────────────────────────────

def _handle_text_to_speech(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = (payload.get("text") or "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please enter text to convert to speech.", data={"error": "No text"})
    if len(text) > 5000:
        return ExecutionResult(kind="json", message="Text too long. Please keep it under 5000 characters.", data={"error": "Too long"})

    lang = (payload.get("lang") or "en").strip().lower()
    slow = str(payload.get("slow", "no")).lower() in ("yes", "true", "1", "on")

    try:
        from gtts import gTTS
        from gtts.lang import tts_langs
    except ImportError:
        return ExecutionResult(kind="json", message="Text-to-speech engine not installed.", data={"error": "gtts missing"})

    available = tts_langs()
    if lang not in available:
        lang = "en"

    out_path = job_dir / "speech.mp3"
    try:
        tts = gTTS(text=text, lang=lang, slow=slow)
        tts.save(str(out_path))
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Could not generate speech: {str(e)[:200]}", data={"error": str(e)[:500]})

    if not out_path.exists() or out_path.stat().st_size == 0:
        return ExecutionResult(kind="json", message="Generated audio was empty.", data={"error": "empty output"})

    preview = text[:60] + ("…" if len(text) > 60 else "")
    return ExecutionResult(
        kind="file",
        message=f"✅ Speech generated ({lang}) — \"{preview}\"",
        output_path=out_path,
        filename=f"speech_{lang}.mp3",
        content_type="audio/mpeg",
    )


# ─── 2. Video Trimmer ────────────────────────────────────────────────────────

def _to_seconds(value: Any, default: float = 0.0) -> float:
    if value in (None, ""):
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        pass
    try:
        parts = [float(p) for p in str(value).strip().split(":")]
        if len(parts) == 2:
            return parts[0] * 60 + parts[1]
        if len(parts) == 3:
            return parts[0] * 3600 + parts[1] * 60 + parts[2]
    except Exception:
        pass
    return default


def _handle_video_trimmer(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
    if not shutil.which("ffmpeg"):
        return ExecutionResult(kind="json", message="Video engine unavailable on server.", data={"error": "ffmpeg missing"})

    src = files[0]
    start = max(0.0, _to_seconds(payload.get("start"), 0.0))
    end = _to_seconds(payload.get("end"), 0.0)
    duration = _to_seconds(payload.get("duration"), 0.0)

    if end > start:
        length = end - start
    elif duration > 0:
        length = duration
    else:
        length = 30.0

    length = max(0.5, min(length, 1800))  # cap 30 min

    out_path = job_dir / f"{src.stem}_trimmed.mp4"
    try:
        # Re-encode for accurate trim and broad compatibility
        subprocess.run(
            ["ffmpeg", "-y", "-ss", str(start), "-t", str(length), "-i", str(src),
             "-c:v", "libx264", "-preset", "fast", "-crf", "23",
             "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
             str(out_path)],
            check=True, capture_output=True, timeout=600,
        )
    except subprocess.TimeoutExpired:
        return ExecutionResult(kind="json", message="Trim timed out. Try a shorter clip.", data={"error": "timeout"})
    except subprocess.CalledProcessError as e:
        return ExecutionResult(
            kind="json",
            message="Could not trim this video. Make sure it is a valid video file.",
            data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]},
        )

    if not out_path.exists() or out_path.stat().st_size == 0:
        return ExecutionResult(kind="json", message="Trimmed video was empty — check times.", data={"error": "empty"})

    return ExecutionResult(
        kind="file",
        message=f"✅ Trimmed — {length:.1f}s starting at {start:.1f}s",
        output_path=out_path,
        filename=f"{_safe(src.stem)}_trimmed.mp4",
        content_type="video/mp4",
    )


# ─── 3. Video Compressor ─────────────────────────────────────────────────────

def _handle_video_compressor(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
    if not shutil.which("ffmpeg"):
        return ExecutionResult(kind="json", message="Video engine unavailable on server.", data={"error": "ffmpeg missing"})

    src = files[0]
    quality_map = {
        "high": ("28", "640"),       # smaller file, lower quality
        "medium": ("25", "854"),     # balanced
        "low": ("23", "1280"),       # larger file, better quality
    }
    quality = (payload.get("quality") or "medium").strip().lower()
    crf, max_w = quality_map.get(quality, quality_map["medium"])

    out_path = job_dir / f"{src.stem}_compressed.mp4"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(src),
             "-vf", f"scale='min({max_w},iw)':-2",
             "-c:v", "libx264", "-preset", "medium", "-crf", crf,
             "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
             str(out_path)],
            check=True, capture_output=True, timeout=900,
        )
    except subprocess.TimeoutExpired:
        return ExecutionResult(kind="json", message="Compression timed out. Try a shorter video.", data={"error": "timeout"})
    except subprocess.CalledProcessError as e:
        return ExecutionResult(
            kind="json",
            message="Could not compress this video.",
            data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]},
        )

    if not out_path.exists() or out_path.stat().st_size == 0:
        return ExecutionResult(kind="json", message="Compressed video was empty.", data={"error": "empty"})

    orig = src.stat().st_size
    new = out_path.stat().st_size
    saved = max(0, (1 - new / orig) * 100) if orig else 0
    return ExecutionResult(
        kind="file",
        message=f"✅ Compressed: {orig // 1024} KB → {new // 1024} KB ({saved:.0f}% smaller)",
        output_path=out_path,
        filename=f"{_safe(src.stem)}_compressed.mp4",
        content_type="video/mp4",
    )


# ─── 4. Audio Merger ─────────────────────────────────────────────────────────

def _handle_audio_merger(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files or len(files) < 2:
        return ExecutionResult(kind="json", message="Please upload 2 or more audio files to merge.", data={"error": "Need 2+ files"})
    if not shutil.which("ffmpeg"):
        return ExecutionResult(kind="json", message="Audio engine unavailable on server.", data={"error": "ffmpeg missing"})

    if len(files) > 12:
        files = files[:12]

    # Build concat list file
    list_file = job_dir / "_concat.txt"
    # First, normalize each input to consistent format (avoids concat issues with mixed codecs)
    normalized: list[Path] = []
    try:
        for idx, f in enumerate(files):
            norm = job_dir / f"_norm_{idx:02d}.mp3"
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(f), "-acodec", "libmp3lame",
                 "-b:a", "192k", "-ar", "44100", "-ac", "2", str(norm)],
                check=True, capture_output=True, timeout=180,
            )
            normalized.append(norm)
    except subprocess.TimeoutExpired:
        return ExecutionResult(kind="json", message="One of the audio files took too long to process.", data={"error": "timeout"})
    except subprocess.CalledProcessError as e:
        return ExecutionResult(
            kind="json",
            message="One of your files isn't a valid audio file.",
            data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]},
        )

    list_file.write_text("\n".join(f"file '{p.as_posix()}'" for p in normalized), encoding="utf-8")

    out_path = job_dir / "merged.mp3"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
             "-c", "copy", str(out_path)],
            check=True, capture_output=True, timeout=300,
        )
    except subprocess.CalledProcessError as e:
        return ExecutionResult(
            kind="json",
            message="Could not merge the audio files.",
            data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]},
        )

    if not out_path.exists() or out_path.stat().st_size == 0:
        return ExecutionResult(kind="json", message="Merged audio was empty.", data={"error": "empty"})

    return ExecutionResult(
        kind="file",
        message=f"✅ Merged {len(files)} audio files",
        output_path=out_path,
        filename="merged.mp3",
        content_type="audio/mpeg",
    )


# ─── Registry ────────────────────────────────────────────────────────────────

EXTRA_MEDIA_HANDLERS = {
    "text-to-speech": _handle_text_to_speech,
    "tts-converter": _handle_text_to_speech,
    "video-trimmer": _handle_video_trimmer,
    "video-cutter": _handle_video_trimmer,
    "video-compressor": _handle_video_compressor,
    "compress-video": _handle_video_compressor,
    "audio-merger": _handle_audio_merger,
    "audio-joiner": _handle_audio_merger,
    "merge-audio": _handle_audio_merger,
}
