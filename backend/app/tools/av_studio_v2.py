"""
Audio/Video Studio v2 — real FFmpeg-backed pro-grade processing tools.
Inspired by Audacity / Adobe Podcast / iZotope RX / Topaz / HitPaw workflows
but pure ffmpeg, no external services.
"""
from __future__ import annotations
import re
import shutil
import subprocess
from pathlib import Path
from typing import Any, Callable, Dict
from .handlers import ExecutionResult


# ─── Helpers ─────────────────────────────────────────────────────────────
def _safe(name: str, limit: int = 60) -> str:
    return re.sub(r"[^\w.-]", "_", name or "file")[:limit] or "file"


def _ff_ok() -> ExecutionResult | None:
    if shutil.which("ffmpeg") and shutil.which("ffprobe"):
        return None
    return ExecutionResult(
        kind="json",
        message="FFmpeg is not available on the server.",
        data={"error": "ffmpeg-missing"},
    )


def _need_file(files: list[Path], kind: str = "media") -> Path | ExecutionResult:
    if not files:
        return ExecutionResult(
            kind="json",
            message=f"Please upload a {kind} file to continue.",
            data={"error": f"missing-{kind}-file"},
        )
    return files[0]


def _run(cmd: list[str], timeout: int = 180) -> tuple[bool, str]:
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        if proc.returncode != 0:
            return False, (proc.stderr or proc.stdout or "")[-500:]
        return True, ""
    except subprocess.TimeoutExpired:
        return False, "Processing timed out — please try a shorter file."
    except Exception as exc:  # noqa
        return False, str(exc)[-500:]


def _audio_out(src: Path, job: Path, suffix: str) -> Path:
    return job / f"{src.stem}_{suffix}.mp3"


def _video_out(src: Path, job: Path, suffix: str, ext: str = "mp4") -> Path:
    return job / f"{src.stem}_{suffix}.{ext}"


def _audio_filter(src: Path, job: Path, suffix: str, afilter: str,
                  msg: str) -> ExecutionResult:
    out = _audio_out(src, job, suffix)
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src),
        "-af", afilter,
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(out),
    ])
    if not ok:
        return ExecutionResult(
            kind="json", message="Could not process audio.", data={"error": err}
        )
    return ExecutionResult(
        kind="file", message=msg, output_path=out,
        filename=f"{_safe(src.stem)}_{suffix}.mp3",
        content_type="audio/mpeg",
    )


def _video_filter(src: Path, job: Path, suffix: str, vfilter: str,
                  msg: str, copy_audio: bool = True) -> ExecutionResult:
    out = _video_out(src, job, suffix, "mp4")
    cmd = [
        "ffmpeg", "-y", "-i", str(src),
        "-vf", vfilter,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
        "-pix_fmt", "yuv420p",
    ]
    if copy_audio:
        cmd += ["-c:a", "copy"]
    else:
        cmd += ["-c:a", "aac", "-b:a", "192k"]
    cmd += [str(out)]
    ok, err = _run(cmd, timeout=240)
    if not ok:
        return ExecutionResult(
            kind="json", message="Could not process video.", data={"error": err}
        )
    return ExecutionResult(
        kind="file", message=msg, output_path=out,
        filename=f"{_safe(src.stem)}_{suffix}.mp4",
        content_type="video/mp4",
    )


# ─── AUDIO TOOLS ─────────────────────────────────────────────────────────
def _h_vocal_remover(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "audio")
    if isinstance(src, ExecutionResult): return src
    # Karaoke trick: subtract right channel from left channel
    return _audio_filter(
        src, job, "instrumental",
        "pan=stereo|c0=c0-c1|c1=c1-c0,highpass=f=120,lowpass=f=18000,loudnorm=I=-16:TP=-1.5:LRA=11",
        "✅ Vocals removed (instrumental track)",
    )


def _h_bass_boost(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "audio")
    if isinstance(src, ExecutionResult): return src
    try:
        gain = max(0.0, min(20.0, float(payload.get("gain") or 8)))
    except (ValueError, TypeError): gain = 8.0
    return _audio_filter(
        src, job, "bass_boost",
        f"bass=g={gain}:f=110:w=0.6,loudnorm=I=-16:TP=-1.5:LRA=11",
        f"✅ Bass boosted by +{gain:.0f} dB",
    )


def _h_treble_boost(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "audio")
    if isinstance(src, ExecutionResult): return src
    try:
        gain = max(0.0, min(20.0, float(payload.get("gain") or 6)))
    except (ValueError, TypeError): gain = 6.0
    return _audio_filter(
        src, job, "treble_boost",
        f"treble=g={gain}:f=4000,loudnorm=I=-16:TP=-1.5:LRA=11",
        f"✅ Treble boosted by +{gain:.0f} dB",
    )


def _h_dehum(files, payload, job, freq: int):
    if (e := _ff_ok()): return e
    src = _need_file(files, "audio")
    if isinstance(src, ExecutionResult): return src
    # 3 narrow notches: fundamental + 2 harmonics
    # bandreject = narrow notch; chain fundamental + 2 harmonics
    chain = ",".join([
        f"bandreject=f={freq}:w=4",
        f"bandreject=f={freq*2}:w=6",
        f"bandreject=f={freq*3}:w=8",
        "loudnorm=I=-16:TP=-1.5:LRA=11",
    ])
    return _audio_filter(src, job, f"dehum_{freq}",
                        chain, f"✅ Removed {freq} Hz mains hum")


def _h_dehum_50(f, p, j): return _h_dehum(f, p, j, 50)
def _h_dehum_60(f, p, j): return _h_dehum(f, p, j, 60)


def _h_pitch_shifter(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "audio")
    if isinstance(src, ExecutionResult): return src
    try:
        semitones = max(-12.0, min(12.0, float(payload.get("semitones") or 2)))
    except (ValueError, TypeError): semitones = 2.0
    factor = 2 ** (semitones / 12.0)
    chain = (
        f"asetrate=44100*{factor},aresample=44100,atempo={1/factor:.6f}"
    )
    return _audio_filter(src, job, "pitch", chain,
                        f"✅ Pitch shifted by {semitones:+.1f} semitones")


def _h_speed_changer(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "audio")
    if isinstance(src, ExecutionResult): return src
    try:
        speed = max(0.5, min(4.0, float(payload.get("speed") or 1.5)))
    except (ValueError, TypeError): speed = 1.5
    # atempo accepts 0.5..2.0 — chain twice for higher
    if speed <= 2.0:
        chain = f"atempo={speed:.4f}"
    else:
        chain = f"atempo=2.0,atempo={speed/2.0:.4f}"
    return _audio_filter(src, job, "speed", chain,
                        f"✅ Speed changed to {speed:.2f}×")


def _h_audio_fader(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "audio")
    if isinstance(src, ExecutionResult): return src
    try:
        d = max(0.5, min(15.0, float(payload.get("duration") or 3)))
    except (ValueError, TypeError): d = 3.0
    # probe duration
    ok, out_dur = _run(["ffprobe", "-v", "error", "-show_entries",
                        "format=duration", "-of", "csv=p=0", str(src)], 30)
    try:
        total = float(out_dur.strip()) if ok else 30.0
    except ValueError:
        total = 30.0
    end_start = max(0.0, total - d)
    chain = f"afade=t=in:st=0:d={d:.2f},afade=t=out:st={end_start:.2f}:d={d:.2f}"
    return _audio_filter(src, job, "fade", chain,
                        f"✅ Added {d:.1f}s fade in/out")


def _h_audio_reverser(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "audio")
    if isinstance(src, ExecutionResult): return src
    return _audio_filter(src, job, "reversed", "areverse",
                        "✅ Audio reversed")


def _h_stereo_to_mono(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "audio")
    if isinstance(src, ExecutionResult): return src
    out = _audio_out(src, job, "mono")
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src), "-ac", "1",
        "-c:a", "libmp3lame", "-b:a", "192k", str(out),
    ])
    if not ok:
        return ExecutionResult(kind="json", message="Could not convert.", data={"error": err})
    return ExecutionResult(kind="file", message="✅ Converted to mono",
                          output_path=out, filename=f"{_safe(src.stem)}_mono.mp3",
                          content_type="audio/mpeg")


def _h_mono_to_stereo(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "audio")
    if isinstance(src, ExecutionResult): return src
    out = _audio_out(src, job, "stereo")
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src), "-ac", "2",
        "-c:a", "libmp3lame", "-b:a", "192k", str(out),
    ])
    if not ok:
        return ExecutionResult(kind="json", message="Could not convert.", data={"error": err})
    return ExecutionResult(kind="file", message="✅ Converted to stereo (duplicated)",
                          output_path=out, filename=f"{_safe(src.stem)}_stereo.mp3",
                          content_type="audio/mpeg")


def _h_audio_volume_boost(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "audio")
    if isinstance(src, ExecutionResult): return src
    try:
        db = max(-30.0, min(30.0, float(payload.get("gain") or 6)))
    except (ValueError, TypeError): db = 6.0
    return _audio_filter(src, job, "louder", f"volume={db:.2f}dB",
                        f"✅ Volume changed by {db:+.1f} dB")


# ─── VIDEO TOOLS ─────────────────────────────────────────────────────────
def _h_video_rotate_90(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "video")
    if isinstance(src, ExecutionResult): return src
    return _video_filter(src, job, "rot90", "transpose=1",
                        "✅ Rotated 90° clockwise")


def _h_video_rotate_180(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "video")
    if isinstance(src, ExecutionResult): return src
    return _video_filter(src, job, "rot180", "transpose=1,transpose=1",
                        "✅ Rotated 180°")


def _h_video_rotate_270(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "video")
    if isinstance(src, ExecutionResult): return src
    return _video_filter(src, job, "rot270", "transpose=2",
                        "✅ Rotated 90° counter-clockwise")


def _h_video_flip_h(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "video")
    if isinstance(src, ExecutionResult): return src
    return _video_filter(src, job, "fliph", "hflip",
                        "✅ Flipped horizontally (mirror)")


def _h_video_flip_v(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "video")
    if isinstance(src, ExecutionResult): return src
    return _video_filter(src, job, "flipv", "vflip", "✅ Flipped vertically")


def _h_video_deinterlace(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "video")
    if isinstance(src, ExecutionResult): return src
    return _video_filter(src, job, "deint", "yadif=mode=1:parity=auto",
                        "✅ Deinterlaced video (YADIF)")


def _h_video_brightness(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "video")
    if isinstance(src, ExecutionResult): return src
    try:
        b = max(-0.5, min(0.5, float(payload.get("brightness") or 0.1)))
        c = max(0.5, min(2.0, float(payload.get("contrast") or 1.1)))
        s = max(0.0, min(2.0, float(payload.get("saturation") or 1.15)))
    except (ValueError, TypeError):
        b, c, s = 0.1, 1.1, 1.15
    return _video_filter(
        src, job, "graded",
        f"eq=brightness={b}:contrast={c}:saturation={s}",
        f"✅ Color graded (brightness {b:+.2f}, contrast ×{c}, saturation ×{s})",
    )


def _h_video_speed(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "video")
    if isinstance(src, ExecutionResult): return src
    try:
        speed = max(0.25, min(4.0, float(payload.get("speed") or 2.0)))
    except (ValueError, TypeError): speed = 2.0
    out = _video_out(src, job, "speed", "mp4")
    pts = 1.0 / speed
    if speed <= 2.0:
        atempo = f"atempo={speed:.4f}"
    else:
        atempo = f"atempo=2.0,atempo={speed/2.0:.4f}"
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src),
        "-filter_complex",
        f"[0:v]setpts={pts:.6f}*PTS[v];[0:a]{atempo}[a]",
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
        str(out),
    ], 240)
    if not ok:
        return ExecutionResult(kind="json", message="Could not change speed.",
                              data={"error": err})
    return ExecutionResult(kind="file",
        message=f"✅ Video speed changed to {speed:.2f}×",
        output_path=out, filename=f"{_safe(src.stem)}_speed.mp4",
        content_type="video/mp4")


def _h_video_mute(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "video")
    if isinstance(src, ExecutionResult): return src
    out = _video_out(src, job, "muted", "mp4")
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src), "-c:v", "copy", "-an", str(out),
    ])
    if not ok:
        return ExecutionResult(kind="json", message="Could not mute.", data={"error": err})
    return ExecutionResult(kind="file", message="✅ Audio removed from video",
                          output_path=out, filename=f"{_safe(src.stem)}_muted.mp4",
                          content_type="video/mp4")


def _h_video_extract_audio(files, payload, job):
    if (e := _ff_ok()): return e
    src = _need_file(files, "video")
    if isinstance(src, ExecutionResult): return src
    out = _audio_out(src, job, "audio")
    ok, err = _run([
        "ffmpeg", "-y", "-i", str(src), "-vn",
        "-c:a", "libmp3lame", "-b:a", "192k", str(out),
    ])
    if not ok:
        return ExecutionResult(kind="json", message="Could not extract audio.",
                              data={"error": err})
    return ExecutionResult(kind="file", message="✅ Audio extracted from video",
                          output_path=out, filename=f"{_safe(src.stem)}.mp3",
                          content_type="audio/mpeg")


# ─── Public dict ─────────────────────────────────────────────────────────
AV_STUDIO_V2_HANDLERS: Dict[str, Callable] = {
    # Audio enhancers
    "vocal-remover":         _h_vocal_remover,
    "karaoke-maker":         _h_vocal_remover,
    "instrumental-extractor": _h_vocal_remover,
    "bass-booster":          _h_bass_boost,
    "bass-boost":            _h_bass_boost,
    "treble-booster":        _h_treble_boost,
    "treble-boost":          _h_treble_boost,
    "dehum-50hz":            _h_dehum_50,
    "dehum-60hz":            _h_dehum_60,
    "remove-mains-hum":      _h_dehum_50,
    "audio-pitch-shifter":   _h_pitch_shifter,
    "pitch-shifter":         _h_pitch_shifter,
    "audio-speed-changer":   _h_speed_changer,
    "audio-speed-modifier":  _h_speed_changer,
    "audio-fader":           _h_audio_fader,
    "audio-fade-in-out":     _h_audio_fader,
    "audio-reverser":        _h_audio_reverser,
    "reverse-audio":         _h_audio_reverser,
    "stereo-to-mono":        _h_stereo_to_mono,
    "mono-to-stereo":        _h_mono_to_stereo,
    "audio-volume-booster":  _h_audio_volume_boost,
    "volume-booster":        _h_audio_volume_boost,
    "audio-louder":          _h_audio_volume_boost,
    # Video processing
    "video-rotate-90":       _h_video_rotate_90,
    "rotate-video-90":       _h_video_rotate_90,
    "video-rotate-180":      _h_video_rotate_180,
    "video-rotate-270":      _h_video_rotate_270,
    "video-rotate-left":     _h_video_rotate_270,
    "video-rotate-right":    _h_video_rotate_90,
    "video-flip-horizontal": _h_video_flip_h,
    "video-mirror":          _h_video_flip_h,
    "video-flip-vertical":   _h_video_flip_v,
    "video-deinterlacer":    _h_video_deinterlace,
    "deinterlace-video":     _h_video_deinterlace,
    "video-color-grader":    _h_video_brightness,
    "video-brightness-contrast": _h_video_brightness,
    "video-speed-changer":   _h_video_speed,
    "video-speed-modifier":  _h_video_speed,
    "video-mute":            _h_video_mute,
    "remove-video-audio":    _h_video_mute,
    "video-audio-remover":   _h_video_mute,
    "video-audio-extractor": _h_video_extract_audio,
    "extract-audio-from-video": _h_video_extract_audio,
}
