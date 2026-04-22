"""
ISHU TOOLS — Media Extras v2 (2026 batch #4)
Adds: video-rotator, video-mute, video-speed-changer, audio-speed-changer, gif-to-video
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


def _ffmpeg_check() -> ExecutionResult | None:
    if not shutil.which("ffmpeg"):
        return ExecutionResult(kind="json", message="Media engine unavailable on server.", data={"error": "ffmpeg missing"})
    return None


# ─── 1. Video Rotator ────────────────────────────────────────────────────────

def _handle_video_rotator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
    if (err := _ffmpeg_check()): return err

    src = files[0]
    angle = str(payload.get("angle") or "90").strip()

    # Build vf filter
    if angle == "90":
        vf = "transpose=1"  # 90° clockwise
    elif angle == "180":
        vf = "transpose=2,transpose=2"
    elif angle == "270" or angle == "-90":
        vf = "transpose=2"  # 90° counter-clockwise
    elif angle == "flip-horizontal":
        vf = "hflip"
    elif angle == "flip-vertical":
        vf = "vflip"
    else:
        return ExecutionResult(kind="json", message="Choose a valid rotation: 90, 180, 270, flip-horizontal or flip-vertical.", data={"error": "Bad angle"})

    out_path = job_dir / f"{src.stem}_rotated.mp4"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(src), "-vf", vf,
             "-c:v", "libx264", "-preset", "fast", "-crf", "23",
             "-c:a", "copy", "-movflags", "+faststart", str(out_path)],
            check=True, capture_output=True, timeout=600,
        )
    except subprocess.TimeoutExpired:
        return ExecutionResult(kind="json", message="Rotation timed out. Try a shorter video.", data={"error": "timeout"})
    except subprocess.CalledProcessError as e:
        return ExecutionResult(kind="json", message="Could not rotate this video.",
                               data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]})

    return ExecutionResult(
        kind="file",
        message=f"✅ Video rotated ({angle})",
        output_path=out_path,
        filename=f"{_safe(src.stem)}_rotated.mp4",
        content_type="video/mp4",
    )


# ─── 2. Video Mute (remove audio) ────────────────────────────────────────────

def _handle_video_mute(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
    if (err := _ffmpeg_check()): return err

    src = files[0]
    out_path = job_dir / f"{src.stem}_muted.mp4"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(src), "-c", "copy", "-an", str(out_path)],
            check=True, capture_output=True, timeout=300,
        )
    except subprocess.CalledProcessError as e:
        # Fallback to re-encoding video stream if -c copy fails
        try:
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(src), "-c:v", "libx264", "-preset", "fast",
                 "-crf", "23", "-an", "-movflags", "+faststart", str(out_path)],
                check=True, capture_output=True, timeout=600,
            )
        except subprocess.CalledProcessError as e2:
            return ExecutionResult(kind="json", message="Could not remove audio.",
                                   data={"error": (e2.stderr or b"").decode("utf-8", errors="ignore")[:500]})

    return ExecutionResult(
        kind="file",
        message="✅ Audio removed — silent video ready",
        output_path=out_path,
        filename=f"{_safe(src.stem)}_muted.mp4",
        content_type="video/mp4",
    )


# ─── 3. Video Speed Changer ──────────────────────────────────────────────────

def _handle_video_speed(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file.", data={"error": "No file"})
    if (err := _ffmpeg_check()): return err

    src = files[0]
    try:
        speed = float(payload.get("speed") or 2.0)
    except (TypeError, ValueError):
        return ExecutionResult(kind="json", message="Speed must be a number (e.g. 0.5 for slower, 2.0 for faster).", data={"error": "Bad speed"})

    speed = max(0.25, min(speed, 4.0))
    setpts = 1.0 / speed  # higher speed → smaller PTS values

    # FFmpeg atempo only supports 0.5–2.0; chain for extreme speeds
    audio_filters: list[str] = []
    s = speed
    while s > 2.0:
        audio_filters.append("atempo=2.0")
        s /= 2.0
    while s < 0.5:
        audio_filters.append("atempo=0.5")
        s *= 2.0
    audio_filters.append(f"atempo={s:.4f}")
    af = ",".join(audio_filters)

    out_path = job_dir / f"{src.stem}_speed_{speed:g}x.mp4"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(src),
             "-filter_complex", f"[0:v]setpts={setpts:.4f}*PTS[v];[0:a]{af}[a]",
             "-map", "[v]", "-map", "[a]",
             "-c:v", "libx264", "-preset", "fast", "-crf", "23",
             "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(out_path)],
            check=True, capture_output=True, timeout=900,
        )
    except subprocess.CalledProcessError:
        # Fallback: video only (no audio)
        try:
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(src), "-vf", f"setpts={setpts:.4f}*PTS",
                 "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "23",
                 "-movflags", "+faststart", str(out_path)],
                check=True, capture_output=True, timeout=900,
            )
        except subprocess.CalledProcessError as e:
            return ExecutionResult(kind="json", message="Could not change video speed.",
                                   data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]})

    return ExecutionResult(
        kind="file",
        message=f"✅ Video speed changed to {speed:g}x",
        output_path=out_path,
        filename=f"{_safe(src.stem)}_speed_{speed:g}x.mp4",
        content_type="video/mp4",
    )


# ─── 4. Audio Speed Changer ──────────────────────────────────────────────────

def _handle_audio_speed(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload an audio file.", data={"error": "No file"})
    if (err := _ffmpeg_check()): return err

    src = files[0]
    try:
        speed = float(payload.get("speed") or 1.5)
    except (TypeError, ValueError):
        return ExecutionResult(kind="json", message="Speed must be a number (e.g. 0.5 for slower, 2.0 for faster).", data={"error": "Bad speed"})

    speed = max(0.25, min(speed, 4.0))

    audio_filters: list[str] = []
    s = speed
    while s > 2.0:
        audio_filters.append("atempo=2.0"); s /= 2.0
    while s < 0.5:
        audio_filters.append("atempo=0.5"); s *= 2.0
    audio_filters.append(f"atempo={s:.4f}")
    af = ",".join(audio_filters)

    out_path = job_dir / f"{src.stem}_speed_{speed:g}x.mp3"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(src), "-filter:a", af,
             "-acodec", "libmp3lame", "-b:a", "192k", str(out_path)],
            check=True, capture_output=True, timeout=300,
        )
    except subprocess.CalledProcessError as e:
        return ExecutionResult(kind="json", message="Could not change audio speed.",
                               data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]})

    return ExecutionResult(
        kind="file",
        message=f"✅ Audio speed changed to {speed:g}x (pitch preserved)",
        output_path=out_path,
        filename=f"{_safe(src.stem)}_speed_{speed:g}x.mp3",
        content_type="audio/mpeg",
    )


# ─── 5. GIF to Video (MP4) ───────────────────────────────────────────────────

def _handle_gif_to_video(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a GIF file.", data={"error": "No file"})
    if (err := _ffmpeg_check()): return err

    src = files[0]
    out_path = job_dir / f"{src.stem}.mp4"
    try:
        # scale to even dimensions (libx264 requirement) and use yuv420p for max compatibility
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(src),
             "-movflags", "+faststart",
             "-pix_fmt", "yuv420p",
             "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
             "-c:v", "libx264", "-preset", "fast", "-crf", "23",
             str(out_path)],
            check=True, capture_output=True, timeout=300,
        )
    except subprocess.CalledProcessError as e:
        return ExecutionResult(kind="json", message="Could not convert GIF to video.",
                               data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]})

    if not out_path.exists() or out_path.stat().st_size == 0:
        return ExecutionResult(kind="json", message="Output video was empty.", data={"error": "empty"})

    return ExecutionResult(
        kind="file",
        message="✅ GIF converted to MP4 video",
        output_path=out_path,
        filename=f"{_safe(src.stem)}.mp4",
        content_type="video/mp4",
    )


# ─── Registry ────────────────────────────────────────────────────────────────

MEDIA_EXTRAS_V2_HANDLERS = {
    "video-rotator": _handle_video_rotator,
    "rotate-video": _handle_video_rotator,
    "video-mute": _handle_video_mute,
    "remove-audio-from-video": _handle_video_mute,
    "mute-video": _handle_video_mute,
    "video-speed-changer": _handle_video_speed,
    "speed-up-video": _handle_video_speed,
    "slow-motion-video": _handle_video_speed,
    "audio-speed-changer": _handle_audio_speed,
    "speed-up-audio": _handle_audio_speed,
    "slow-down-audio": _handle_audio_speed,
    "gif-to-video": _handle_gif_to_video,
    "gif-to-mp4": _handle_gif_to_video,
}
