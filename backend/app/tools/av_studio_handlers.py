"""
ISHU TOOLS — A/V Studio Handlers (2026 batch #5)
Video: reverser, cropper, resizer, watermark, thumbnail
Audio: reverser, volume, pitch-changer, converter, trimmer
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


def _ff() -> ExecutionResult | None:
    if not shutil.which("ffmpeg"):
        return ExecutionResult(kind="json", message="Media engine unavailable on server.", data={"error": "ffmpeg missing"})
    return None


def _run(cmd: list[str], timeout: int = 600) -> tuple[bool, str]:
    try:
        subprocess.run(cmd, check=True, capture_output=True, timeout=timeout)
        return True, ""
    except subprocess.TimeoutExpired:
        return False, "Operation timed out"
    except subprocess.CalledProcessError as e:
        return False, (e.stderr or b"").decode("utf-8", errors="ignore")[:600]


def _parse_time(t: str) -> float | None:
    """Parse '90', '1:30', '01:30', '01:30:45' to seconds."""
    if t is None:
        return None
    t = str(t).strip()
    if not t:
        return None
    try:
        if ":" not in t:
            return float(t)
        parts = [float(p) for p in t.split(":")]
        if len(parts) == 2:
            return parts[0] * 60 + parts[1]
        if len(parts) == 3:
            return parts[0] * 3600 + parts[1] * 60 + parts[2]
    except ValueError:
        return None
    return None


# ════════════════════════════════════════════════════════════════════════════
# VIDEO TOOLS
# ════════════════════════════════════════════════════════════════════════════

def _handle_video_reverser(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
    if (e := _ff()): return e
    src = files[0]
    keep_audio = str(payload.get("audio") or "reverse").lower() != "mute"
    out = job_dir / f"{src.stem}_reversed.mp4"

    if keep_audio:
        ok, err = _run(
            ["ffmpeg", "-y", "-i", str(src),
             "-vf", "reverse", "-af", "areverse",
             "-c:v", "libx264", "-preset", "fast", "-crf", "23",
             "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(out)],
        )
    else:
        ok, err = _run(
            ["ffmpeg", "-y", "-i", str(src),
             "-vf", "reverse", "-an",
             "-c:v", "libx264", "-preset", "fast", "-crf", "23",
             "-movflags", "+faststart", str(out)],
        )

    if not ok:
        return ExecutionResult(kind="json", message="Could not reverse video.", data={"error": err})
    return ExecutionResult(kind="file", message="✅ Video reversed",
                           output_path=out, filename=f"{_safe(src.stem)}_reversed.mp4", content_type="video/mp4")


def _handle_video_cropper(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
    if (e := _ff()): return e
    src = files[0]
    aspect = str(payload.get("aspect") or "1:1").strip()

    # Use scale + crop based on aspect ratio
    if aspect == "1:1":
        vf = "crop='min(iw,ih)':'min(iw,ih)'"
    elif aspect == "9:16":
        vf = "crop='min(iw,ih*9/16)':'min(ih,iw*16/9)'"
    elif aspect == "16:9":
        vf = "crop='min(iw,ih*16/9)':'min(ih,iw*9/16)'"
    elif aspect == "4:5":
        vf = "crop='min(iw,ih*4/5)':'min(ih,iw*5/4)'"
    elif aspect == "4:3":
        vf = "crop='min(iw,ih*4/3)':'min(ih,iw*3/4)'"
    else:
        return ExecutionResult(kind="json", message="Choose a valid aspect: 1:1, 9:16, 16:9, 4:5 or 4:3.", data={"error": "bad aspect"})

    out = job_dir / f"{src.stem}_crop_{aspect.replace(':','x')}.mp4"
    ok, err = _run(
        ["ffmpeg", "-y", "-i", str(src), "-vf", vf,
         "-c:v", "libx264", "-preset", "fast", "-crf", "23",
         "-c:a", "copy", "-movflags", "+faststart", str(out)],
    )
    if not ok:
        # fallback re-encode audio
        ok, err = _run(
            ["ffmpeg", "-y", "-i", str(src), "-vf", vf,
             "-c:v", "libx264", "-preset", "fast", "-crf", "23",
             "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(out)],
        )
    if not ok:
        return ExecutionResult(kind="json", message="Could not crop video.", data={"error": err})
    return ExecutionResult(kind="file", message=f"✅ Video cropped to {aspect}",
                           output_path=out, filename=f"{_safe(src.stem)}_{aspect.replace(':','x')}.mp4",
                           content_type="video/mp4")


def _handle_video_resizer(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
    if (e := _ff()): return e
    src = files[0]
    res = str(payload.get("resolution") or "720p").strip().lower()
    res_map = {
        "240p": (-2, 240), "360p": (-2, 360), "480p": (-2, 480),
        "720p": (-2, 720), "1080p": (-2, 1080), "1440p": (-2, 1440), "2160p": (-2, 2160),
    }
    if res not in res_map:
        return ExecutionResult(kind="json", message="Choose a valid resolution.", data={"error": "bad res"})
    w, h = res_map[res]
    vf = f"scale={w}:{h}"

    out = job_dir / f"{src.stem}_{res}.mp4"
    ok, err = _run(
        ["ffmpeg", "-y", "-i", str(src), "-vf", vf,
         "-c:v", "libx264", "-preset", "fast", "-crf", "23",
         "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(out)],
        timeout=900,
    )
    if not ok:
        return ExecutionResult(kind="json", message="Could not resize video.", data={"error": err})

    orig = src.stat().st_size
    new = out.stat().st_size
    saved = round((1 - new / orig) * 100, 1) if orig else 0
    msg = f"✅ Resized to {res} — {round(new / 1_048_576, 2)} MB"
    if saved > 0:
        msg += f" ({saved}% smaller)"
    return ExecutionResult(kind="file", message=msg,
                           output_path=out, filename=f"{_safe(src.stem)}_{res}.mp4", content_type="video/mp4")


def _handle_video_watermark(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
    if (e := _ff()): return e
    src = files[0]
    text = (payload.get("text") or "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please enter watermark text.", data={"error": "No text"})
    if len(text) > 80:
        text = text[:80]
    position = (payload.get("position") or "bottom-right").lower()

    pos_map = {
        "top-left": "x=20:y=20",
        "top-right": "x=w-tw-20:y=20",
        "bottom-left": "x=20:y=h-th-20",
        "bottom-right": "x=w-tw-20:y=h-th-20",
        "center": "x=(w-tw)/2:y=(h-th)/2",
    }
    pos = pos_map.get(position, pos_map["bottom-right"])

    # Escape special chars for drawtext
    safe_text = text.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")

    drawtext = (
        f"drawtext=text='{safe_text}'"
        f":fontcolor=white:fontsize=24"
        f":box=1:boxcolor=black@0.5:boxborderw=8"
        f":{pos}"
    )

    out = job_dir / f"{src.stem}_watermarked.mp4"
    ok, err = _run(
        ["ffmpeg", "-y", "-i", str(src), "-vf", drawtext,
         "-c:v", "libx264", "-preset", "fast", "-crf", "23",
         "-c:a", "copy", "-movflags", "+faststart", str(out)],
        timeout=900,
    )
    if not ok:
        ok, err = _run(
            ["ffmpeg", "-y", "-i", str(src), "-vf", drawtext,
             "-c:v", "libx264", "-preset", "fast", "-crf", "23",
             "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(out)],
            timeout=900,
        )
    if not ok:
        return ExecutionResult(kind="json", message="Could not add watermark (font may be missing).", data={"error": err})
    return ExecutionResult(kind="file", message=f"✅ Watermark added at {position}",
                           output_path=out, filename=f"{_safe(src.stem)}_watermarked.mp4", content_type="video/mp4")


def _handle_video_thumbnail(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
    if (e := _ff()): return e
    src = files[0]
    raw = payload.get("time") or "0"
    t = _parse_time(raw)
    if t is None or t < 0:
        return ExecutionResult(kind="json", message="Enter a valid time (e.g. '5', '1:30' or '01:02:30').", data={"error": "Bad time"})

    out = job_dir / f"{src.stem}_thumb.jpg"
    ok, err = _run(
        ["ffmpeg", "-y", "-ss", f"{t:.3f}", "-i", str(src),
         "-frames:v", "1", "-q:v", "2", str(out)],
        timeout=120,
    )
    if not ok or not out.exists() or out.stat().st_size == 0:
        return ExecutionResult(kind="json", message="Could not extract thumbnail (time may be past video end).",
                               data={"error": err or "empty output"})

    return ExecutionResult(kind="file", message=f"✅ Thumbnail extracted at {raw}",
                           output_path=out, filename=f"{_safe(src.stem)}_thumb.jpg", content_type="image/jpeg")


# ════════════════════════════════════════════════════════════════════════════
# AUDIO TOOLS
# ════════════════════════════════════════════════════════════════════════════

def _handle_audio_reverser(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload an audio file.", data={"error": "No file"})
    if (e := _ff()): return e
    src = files[0]
    out = job_dir / f"{src.stem}_reversed.mp3"
    ok, err = _run(
        ["ffmpeg", "-y", "-i", str(src), "-af", "areverse",
         "-acodec", "libmp3lame", "-b:a", "192k", str(out)],
    )
    if not ok:
        return ExecutionResult(kind="json", message="Could not reverse audio.", data={"error": err})
    return ExecutionResult(kind="file", message="✅ Audio reversed",
                           output_path=out, filename=f"{_safe(src.stem)}_reversed.mp3", content_type="audio/mpeg")


def _handle_audio_volume(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload an audio file.", data={"error": "No file"})
    if (e := _ff()): return e
    src = files[0]
    try:
        db = float(payload.get("db") or 6)
    except (TypeError, ValueError):
        return ExecutionResult(kind="json", message="Volume change must be a number in dB (e.g. +6 or -3).", data={"error": "Bad dB"})
    db = max(-30.0, min(db, 30.0))

    out = job_dir / f"{src.stem}_vol.mp3"
    ok, err = _run(
        ["ffmpeg", "-y", "-i", str(src), "-af", f"volume={db}dB",
         "-acodec", "libmp3lame", "-b:a", "192k", str(out)],
    )
    if not ok:
        return ExecutionResult(kind="json", message="Could not change audio volume.", data={"error": err})
    sign = "+" if db >= 0 else ""
    return ExecutionResult(kind="file", message=f"✅ Volume changed by {sign}{db:g} dB",
                           output_path=out, filename=f"{_safe(src.stem)}_vol.mp3", content_type="audio/mpeg")


def _handle_audio_pitch(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload an audio file.", data={"error": "No file"})
    if (e := _ff()): return e
    src = files[0]
    try:
        semitones = float(payload.get("semitones") or 2)
    except (TypeError, ValueError):
        return ExecutionResult(kind="json", message="Pitch must be a number in semitones (e.g. +2 or -3).", data={"error": "Bad pitch"})
    semitones = max(-12.0, min(semitones, 12.0))

    # Pitch shift: rubberband not always available — use asetrate + atempo trick (preserves pitch shift, changes speed slightly compensated)
    factor = 2 ** (semitones / 12.0)
    # Reset sample rate to compensate so duration stays the same
    # asetrate=44100*factor changes pitch+speed; atempo=1/factor restores duration
    inv = 1.0 / factor
    # atempo accepts 0.5–2.0; chain if needed
    parts: list[str] = []
    s = inv
    while s > 2.0:
        parts.append("atempo=2.0"); s /= 2.0
    while s < 0.5:
        parts.append("atempo=0.5"); s *= 2.0
    parts.append(f"atempo={s:.6f}")
    af = f"asetrate=44100*{factor:.6f},aresample=44100,{','.join(parts)}"

    out = job_dir / f"{src.stem}_pitch.mp3"
    ok, err = _run(
        ["ffmpeg", "-y", "-i", str(src), "-af", af,
         "-acodec", "libmp3lame", "-b:a", "192k", str(out)],
    )
    if not ok:
        return ExecutionResult(kind="json", message="Could not change pitch.", data={"error": err})
    sign = "+" if semitones >= 0 else ""
    return ExecutionResult(kind="file", message=f"✅ Pitch shifted by {sign}{semitones:g} semitones",
                           output_path=out, filename=f"{_safe(src.stem)}_pitch.mp3", content_type="audio/mpeg")


_AUDIO_FORMATS = {
    "mp3": ("libmp3lame", "192k", "audio/mpeg", "mp3"),
    "wav": ("pcm_s16le", None, "audio/wav", "wav"),
    "m4a": ("aac", "192k", "audio/mp4", "m4a"),
    "ogg": ("libvorbis", "192k", "audio/ogg", "ogg"),
    "flac": ("flac", None, "audio/flac", "flac"),
    "aac": ("aac", "192k", "audio/aac", "aac"),
    "opus": ("libopus", "128k", "audio/opus", "opus"),
}

def _handle_audio_converter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload an audio file.", data={"error": "No file"})
    if (e := _ff()): return e
    src = files[0]
    fmt = str(payload.get("format") or "mp3").lower().strip()
    if fmt not in _AUDIO_FORMATS:
        return ExecutionResult(kind="json", message="Choose a valid output format.", data={"error": "bad format"})

    codec, bitrate, mime, ext = _AUDIO_FORMATS[fmt]
    out = job_dir / f"{src.stem}.{ext}"
    cmd = ["ffmpeg", "-y", "-i", str(src), "-vn", "-acodec", codec]
    if bitrate:
        cmd += ["-b:a", bitrate]
    cmd.append(str(out))
    ok, err = _run(cmd, timeout=300)
    if not ok:
        return ExecutionResult(kind="json", message=f"Could not convert to {fmt.upper()}.", data={"error": err})

    return ExecutionResult(kind="file", message=f"✅ Converted to {fmt.upper()}",
                           output_path=out, filename=f"{_safe(src.stem)}.{ext}", content_type=mime)


def _handle_audio_trimmer(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload an audio file.", data={"error": "No file"})
    if (e := _ff()): return e
    src = files[0]
    start = _parse_time(payload.get("start") or "0")
    end_raw = payload.get("end")
    end = _parse_time(end_raw) if end_raw else None

    if start is None or start < 0:
        return ExecutionResult(kind="json", message="Enter a valid start time (e.g. '0', '1:30').", data={"error": "Bad start"})

    cmd = ["ffmpeg", "-y", "-ss", f"{start:.3f}", "-i", str(src)]
    if end is not None:
        if end <= start:
            return ExecutionResult(kind="json", message="End time must be greater than start time.", data={"error": "Bad range"})
        cmd += ["-t", f"{end - start:.3f}"]
    out = job_dir / f"{src.stem}_trimmed.mp3"
    cmd += ["-acodec", "libmp3lame", "-b:a", "192k", str(out)]

    ok, err = _run(cmd, timeout=300)
    if not ok:
        return ExecutionResult(kind="json", message="Could not trim audio.", data={"error": err})
    duration = (end - start) if end else None
    msg = f"✅ Audio trimmed (start at {start:g}s"
    if duration:
        msg += f", duration {duration:g}s)"
    else:
        msg += ", until end)"
    return ExecutionResult(kind="file", message=msg,
                           output_path=out, filename=f"{_safe(src.stem)}_trimmed.mp3", content_type="audio/mpeg")


# ─── Registry ────────────────────────────────────────────────────────────────

_VIDEO_FORMATS = {
    "mp4":  {"ext": "mp4",  "vcodec": "libx264",  "acodec": "aac",      "extra": ["-pix_fmt", "yuv420p", "-movflags", "+faststart"], "mime": "video/mp4"},
    "mov":  {"ext": "mov",  "vcodec": "libx264",  "acodec": "aac",      "extra": ["-pix_fmt", "yuv420p", "-movflags", "+faststart"], "mime": "video/quicktime"},
    "mkv":  {"ext": "mkv",  "vcodec": "libx264",  "acodec": "aac",      "extra": ["-pix_fmt", "yuv420p"], "mime": "video/x-matroska"},
    "webm": {"ext": "webm", "vcodec": "libvpx-vp9","acodec": "libopus",  "extra": ["-b:v", "1M", "-deadline", "good", "-cpu-used", "4"], "mime": "video/webm"},
    "avi":  {"ext": "avi",  "vcodec": "mpeg4",    "acodec": "libmp3lame","extra": ["-q:v", "5"], "mime": "video/x-msvideo"},
    "flv":  {"ext": "flv",  "vcodec": "libx264",  "acodec": "aac",      "extra": ["-pix_fmt", "yuv420p"], "mime": "video/x-flv"},
    "mpeg": {"ext": "mpg",  "vcodec": "mpeg2video","acodec": "mp2",     "extra": ["-q:v", "5"], "mime": "video/mpeg"},
    "m4v":  {"ext": "m4v",  "vcodec": "libx264",  "acodec": "aac",      "extra": ["-pix_fmt", "yuv420p", "-movflags", "+faststart"], "mime": "video/x-m4v"},
    "wmv":  {"ext": "wmv",  "vcodec": "wmv2",     "acodec": "wmav2",    "extra": ["-q:v", "5"], "mime": "video/x-ms-wmv"},
}


def _handle_video_converter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
    if (e := _ff()): return e
    src = files[0]
    fmt = str(payload.get("format") or "mp4").lower().strip()
    if fmt not in _VIDEO_FORMATS:
        return ExecutionResult(kind="json", message="Choose a valid output video format.", data={"error": "bad format"})

    spec = _VIDEO_FORMATS[fmt]
    out = job_dir / f"{src.stem}.{spec['ext']}"

    cmd = ["ffmpeg", "-y", "-i", str(src),
           "-c:v", spec["vcodec"], "-preset", "fast", "-crf", "23",
           "-c:a", spec["acodec"]]
    if spec["acodec"] not in ("pcm_s16le",):
        cmd += ["-b:a", "192k"]
    cmd += spec["extra"]
    cmd.append(str(out))

    ok, err = _run(cmd, timeout=1200)
    if not ok or not out.exists() or out.stat().st_size == 0:
        return ExecutionResult(kind="json",
                               message=f"Could not convert to {fmt.upper()} — try a different source video.",
                               data={"error": err or "empty output"})

    orig = src.stat().st_size
    new = out.stat().st_size
    msg = f"✅ Converted to {fmt.upper()} — {round(new / 1_048_576, 2)} MB"
    if orig and new < orig:
        saved = round((1 - new / orig) * 100, 1)
        msg += f" ({saved}% smaller than original)"
    return ExecutionResult(kind="file", message=msg,
                           output_path=out, filename=f"{_safe(src.stem)}.{spec['ext']}",
                           content_type=spec["mime"])


AV_STUDIO_HANDLERS = {
    # Video
    "video-converter": _handle_video_converter,
    "convert-video": _handle_video_converter,
    "video-format-converter": _handle_video_converter,
    "video-reverser": _handle_video_reverser,
    "reverse-video": _handle_video_reverser,
    "video-cropper": _handle_video_cropper,
    "crop-video": _handle_video_cropper,
    "video-resizer": _handle_video_resizer,
    "resize-video": _handle_video_resizer,
    "video-watermark": _handle_video_watermark,
    "add-watermark-to-video": _handle_video_watermark,
    "video-thumbnail": _handle_video_thumbnail,
    "extract-video-thumbnail": _handle_video_thumbnail,
    "video-frame-extractor": _handle_video_thumbnail,
    # Audio
    "audio-reverser": _handle_audio_reverser,
    "reverse-audio": _handle_audio_reverser,
    "audio-volume-changer": _handle_audio_volume,
    "audio-volume": _handle_audio_volume,
    "audio-booster": _handle_audio_volume,
    "audio-pitch-changer": _handle_audio_pitch,
    "pitch-shifter": _handle_audio_pitch,
    "audio-converter": _handle_audio_converter,
    "convert-audio": _handle_audio_converter,
    "audio-trimmer": _handle_audio_trimmer,
    "trim-audio": _handle_audio_trimmer,
    "audio-cutter": _handle_audio_trimmer,
}
