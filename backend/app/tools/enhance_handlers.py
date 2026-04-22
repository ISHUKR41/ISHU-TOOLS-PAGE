"""
ISHU TOOLS — Audio/Video Enhancer Handlers (2026 batch — enhance pack)
Adds: noise-reducer, audio-normalizer, voice-enhancer, silence-remover,
      video-stabilizer, video-upscaler-1080p, audio-fade, video-fade,
      audio-equalizer, video-1080p-converter
All handlers use ffmpeg filters and degrade gracefully when ffmpeg is missing.
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


def _need_ff() -> ExecutionResult | None:
    if not shutil.which("ffmpeg"):
        return ExecutionResult(
            kind="json",
            message="Media engine unavailable on server.",
            data={"error": "ffmpeg missing"},
        )
    return None


def _run(cmd: list[str], timeout: int = 900) -> tuple[bool, str]:
    try:
        subprocess.run(cmd, check=True, capture_output=True, timeout=timeout)
        return True, ""
    except subprocess.TimeoutExpired:
        return False, "Operation timed out"
    except subprocess.CalledProcessError as e:
        return False, (e.stderr or b"").decode("utf-8", errors="ignore")[:600]


def _file_or_err(files: list[Path], kind: str = "file") -> ExecutionResult | Path:
    if not files:
        return ExecutionResult(
            kind="json",
            message=f"Please upload {'an audio' if kind == 'audio' else 'a video'} file.",
            data={"error": "No file"},
        )
    return files[0]


# ═══════════════════════════════════════════════════════════════════════════
# AUDIO ENHANCERS
# ═══════════════════════════════════════════════════════════════════════════

def _handle_noise_reducer(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if (e := _need_ff()):
        return e
    src = _file_or_err(files, "audio")
    if isinstance(src, ExecutionResult):
        return src
    strength = str(payload.get("strength") or "medium").lower()
    # afftdn: FFT-based denoiser. nr=noise reduction in dB
    nr_map = {"light": "8", "medium": "16", "strong": "24", "extreme": "32"}
    nr = nr_map.get(strength, "16")
    out = job_dir / f"{src.stem}_denoised.mp3"
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src),
        "-af", f"afftdn=nr={nr}:nf=-25,highpass=f=80,lowpass=f=15000",
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(out),
    ])
    if not ok:
        return ExecutionResult(kind="json", message="Could not denoise audio.", data={"error": err})
    return ExecutionResult(
        kind="file", message=f"✅ Background noise reduced ({strength})",
        output_path=out, filename=f"{_safe(src.stem)}_denoised.mp3", content_type="audio/mpeg",
    )


def _handle_audio_normalizer(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if (e := _need_ff()):
        return e
    src = _file_or_err(files, "audio")
    if isinstance(src, ExecutionResult):
        return src
    target = str(payload.get("target") or "-16").strip()
    try:
        lufs = max(-30.0, min(-5.0, float(target)))
    except ValueError:
        lufs = -16.0
    out = job_dir / f"{src.stem}_normalized.mp3"
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src),
        "-af", f"loudnorm=I={lufs}:TP=-1.5:LRA=11",
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(out),
    ])
    if not ok:
        return ExecutionResult(kind="json", message="Could not normalize audio.", data={"error": err})
    return ExecutionResult(
        kind="file", message=f"✅ Loudness normalized to {lufs} LUFS",
        output_path=out, filename=f"{_safe(src.stem)}_normalized.mp3", content_type="audio/mpeg",
    )


def _handle_voice_enhancer(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if (e := _need_ff()):
        return e
    src = _file_or_err(files, "audio")
    if isinstance(src, ExecutionResult):
        return src
    out = job_dir / f"{src.stem}_voice_enhanced.mp3"
    # podcast-style chain: denoise + de-ess + EQ + compressor + loudnorm
    chain = (
        "afftdn=nr=14:nf=-25,"
        "highpass=f=85,"
        "lowpass=f=12000,"
        "equalizer=f=200:t=q:w=1.2:g=-2,"
        "equalizer=f=3000:t=q:w=1.0:g=2.5,"
        "acompressor=threshold=-20dB:ratio=3:attack=20:release=200,"
        "loudnorm=I=-16:TP=-1.5:LRA=10"
    )
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src),
        "-af", chain,
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(out),
    ])
    if not ok:
        return ExecutionResult(kind="json", message="Could not enhance voice.", data={"error": err})
    return ExecutionResult(
        kind="file", message="✅ Voice enhanced (podcast-grade)",
        output_path=out, filename=f"{_safe(src.stem)}_voice.mp3", content_type="audio/mpeg",
    )


def _handle_silence_remover(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if (e := _need_ff()):
        return e
    src = _file_or_err(files, "audio")
    if isinstance(src, ExecutionResult):
        return src
    threshold = str(payload.get("threshold") or "-35dB")
    if not threshold.endswith("dB"):
        threshold += "dB"
    out = job_dir / f"{src.stem}_no_silence.mp3"
    chain = (
        f"silenceremove=start_periods=1:start_duration=0.2:start_threshold={threshold}:"
        f"stop_periods=-1:stop_duration=0.4:stop_threshold={threshold}"
    )
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src),
        "-af", chain,
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(out),
    ])
    if not ok:
        return ExecutionResult(kind="json", message="Could not remove silence.", data={"error": err})
    return ExecutionResult(
        kind="file", message="✅ Silence removed",
        output_path=out, filename=f"{_safe(src.stem)}_no_silence.mp3", content_type="audio/mpeg",
    )


def _handle_audio_fade(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if (e := _need_ff()):
        return e
    src = _file_or_err(files, "audio")
    if isinstance(src, ExecutionResult):
        return src
    try:
        fade_in = max(0.0, min(15.0, float(payload.get("fade_in") or 2)))
    except ValueError:
        fade_in = 2.0
    try:
        fade_out = max(0.0, min(15.0, float(payload.get("fade_out") or 2)))
    except ValueError:
        fade_out = 2.0
    # probe duration
    try:
        out_probe = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(src)],
            check=True, capture_output=True, timeout=30,
        )
        dur = float(out_probe.stdout.decode().strip() or 0)
    except Exception:
        dur = 0.0
    fade_out_start = max(0.0, dur - fade_out) if dur > fade_out else 0.0
    chain_parts = []
    if fade_in > 0:
        chain_parts.append(f"afade=t=in:st=0:d={fade_in}")
    if fade_out > 0 and dur > 0:
        chain_parts.append(f"afade=t=out:st={fade_out_start}:d={fade_out}")
    chain = ",".join(chain_parts) or "anull"
    out = job_dir / f"{src.stem}_faded.mp3"
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src),
        "-af", chain,
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(out),
    ])
    if not ok:
        return ExecutionResult(kind="json", message="Could not apply fade.", data={"error": err})
    return ExecutionResult(
        kind="file", message=f"✅ Fade applied (in {fade_in}s / out {fade_out}s)",
        output_path=out, filename=f"{_safe(src.stem)}_faded.mp3", content_type="audio/mpeg",
    )


def _handle_audio_equalizer(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if (e := _need_ff()):
        return e
    src = _file_or_err(files, "audio")
    if isinstance(src, ExecutionResult):
        return src
    preset = str(payload.get("preset") or "balanced").lower()
    presets = {
        "bass-boost": "equalizer=f=60:t=q:w=1:g=6,equalizer=f=120:t=q:w=1:g=4",
        "treble-boost": "equalizer=f=8000:t=q:w=1:g=5,equalizer=f=12000:t=q:w=1:g=4",
        "vocal-boost": "equalizer=f=2500:t=q:w=1:g=5,equalizer=f=4000:t=q:w=1:g=3",
        "balanced": "equalizer=f=100:t=q:w=1:g=2,equalizer=f=3000:t=q:w=1:g=2",
        "warm": "equalizer=f=200:t=q:w=1:g=3,equalizer=f=8000:t=q:w=1:g=-2",
        "bright": "equalizer=f=200:t=q:w=1:g=-2,equalizer=f=8000:t=q:w=1:g=4",
    }
    chain = presets.get(preset, presets["balanced"])
    out = job_dir / f"{src.stem}_eq.mp3"
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src),
        "-af", chain,
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(out),
    ])
    if not ok:
        return ExecutionResult(kind="json", message="Could not apply equalizer.", data={"error": err})
    return ExecutionResult(
        kind="file", message=f"✅ Equalizer applied ({preset})",
        output_path=out, filename=f"{_safe(src.stem)}_eq.mp3", content_type="audio/mpeg",
    )


# ═══════════════════════════════════════════════════════════════════════════
# VIDEO ENHANCERS
# ═══════════════════════════════════════════════════════════════════════════

def _handle_video_stabilizer(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if (e := _need_ff()):
        return e
    src = _file_or_err(files, "video")
    if isinstance(src, ExecutionResult):
        return src
    out = job_dir / f"{src.stem}_stabilized.mp4"
    # deshake is built-in; vidstab requires extra build
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src),
        "-vf", "deshake=x=-1:y=-1:w=-1:h=-1:rx=24:ry=24",
        "-c:v", "libx264", "-preset", "medium", "-crf", "22",
        "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
        str(out),
    ], timeout=1200)
    if not ok:
        return ExecutionResult(kind="json", message="Could not stabilize video.", data={"error": err})
    return ExecutionResult(
        kind="file", message="✅ Video stabilized (shake reduced)",
        output_path=out, filename=f"{_safe(src.stem)}_stabilized.mp4", content_type="video/mp4",
    )


def _handle_video_upscaler(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if (e := _need_ff()):
        return e
    src = _file_or_err(files, "video")
    if isinstance(src, ExecutionResult):
        return src
    target = str(payload.get("target") or "1080p").lower()
    res_map = {
        "720p": 720, "1080p": 1080, "1440p": 1440, "2160p": 2160, "4k": 2160,
    }
    h = res_map.get(target, 1080)
    out = job_dir / f"{src.stem}_{h}p.mp4"
    # lanczos upscale with mild sharpening + slight denoise
    vf = (
        f"scale=-2:{h}:flags=lanczos,"
        "unsharp=5:5:0.8:5:5:0.0,"
        "hqdn3d=1.5:1.5:6:6"
    )
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src),
        "-vf", vf,
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
        str(out),
    ], timeout=1500)
    if not ok:
        return ExecutionResult(kind="json", message="Could not upscale video.", data={"error": err})
    return ExecutionResult(
        kind="file", message=f"✅ Upscaled to {h}p with sharpening",
        output_path=out, filename=f"{_safe(src.stem)}_{h}p.mp4", content_type="video/mp4",
    )


def _handle_video_fade(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if (e := _need_ff()):
        return e
    src = _file_or_err(files, "video")
    if isinstance(src, ExecutionResult):
        return src
    try:
        fade_in = max(0.0, min(10.0, float(payload.get("fade_in") or 1.5)))
    except ValueError:
        fade_in = 1.5
    try:
        fade_out = max(0.0, min(10.0, float(payload.get("fade_out") or 1.5)))
    except ValueError:
        fade_out = 1.5
    try:
        out_probe = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(src)],
            check=True, capture_output=True, timeout=30,
        )
        dur = float(out_probe.stdout.decode().strip() or 0)
    except Exception:
        dur = 0.0
    fo_start = max(0.0, dur - fade_out)
    vf_parts, af_parts = [], []
    if fade_in > 0:
        vf_parts.append(f"fade=t=in:st=0:d={fade_in}")
        af_parts.append(f"afade=t=in:st=0:d={fade_in}")
    if fade_out > 0 and dur > 0:
        vf_parts.append(f"fade=t=out:st={fo_start}:d={fade_out}")
        af_parts.append(f"afade=t=out:st={fo_start}:d={fade_out}")
    vf = ",".join(vf_parts) or "null"
    af = ",".join(af_parts) or "anull"
    out = job_dir / f"{src.stem}_faded.mp4"
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src),
        "-vf", vf, "-af", af,
        "-c:v", "libx264", "-preset", "fast", "-crf", "22",
        "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
        str(out),
    ], timeout=900)
    if not ok:
        return ExecutionResult(kind="json", message="Could not apply fade.", data={"error": err})
    return ExecutionResult(
        kind="file", message=f"✅ Video fade applied (in {fade_in}s / out {fade_out}s)",
        output_path=out, filename=f"{_safe(src.stem)}_faded.mp4", content_type="video/mp4",
    )


def _handle_video_to_1080p(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    # Convenience: always upscale/downscale to exactly 1080p
    payload = dict(payload or {})
    payload["target"] = "1080p"
    return _handle_video_upscaler(files, payload, job_dir)


# ═══════════════════════════════════════════════════════════════════════════

ENHANCE_HANDLERS = {
    "noise-reducer": _handle_noise_reducer,
    "audio-noise-reducer": _handle_noise_reducer,
    "background-noise-remover": _handle_noise_reducer,
    "audio-denoiser": _handle_noise_reducer,
    "audio-normalizer": _handle_audio_normalizer,
    "loudness-normalizer": _handle_audio_normalizer,
    "voice-enhancer": _handle_voice_enhancer,
    "podcast-enhancer": _handle_voice_enhancer,
    "silence-remover": _handle_silence_remover,
    "remove-silence": _handle_silence_remover,
    "audio-fade": _handle_audio_fade,
    "audio-fade-in-out": _handle_audio_fade,
    "audio-equalizer": _handle_audio_equalizer,
    "audio-eq": _handle_audio_equalizer,
    "video-stabilizer": _handle_video_stabilizer,
    "stabilize-video": _handle_video_stabilizer,
    "video-upscaler": _handle_video_upscaler,
    "upscale-video": _handle_video_upscaler,
    "video-enhancer": _handle_video_upscaler,
    "video-to-1080p": _handle_video_to_1080p,
    "convert-to-1080p": _handle_video_to_1080p,
    "video-fade": _handle_video_fade,
    "video-fade-in-out": _handle_video_fade,
}
