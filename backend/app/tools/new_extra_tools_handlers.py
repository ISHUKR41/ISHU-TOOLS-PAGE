"""
ISHU TOOLS – Additional Useful Tools (2026 batch)
Adds: spotify-downloader, snapchat-downloader, threads-downloader,
      youtube-subtitle-downloader, video-to-gif, mp3-cutter
"""
from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path
from typing import Any

from .handlers import ExecutionResult


def _safe_name(name: str, limit: int = 60) -> str:
    cleaned = re.sub(r"[^\w\s-]", "", name or "file")[:limit].strip()
    return cleaned.replace(" ", "_") or "file"


def _ydl_download(url: str, job_dir: Path, fmt: str = "bestvideo+bestaudio/best",
                  merge_to: str = "mp4", audio_only: bool = False) -> tuple[Path | None, str]:
    """Run yt-dlp and return (path, title)."""
    import yt_dlp

    out_template = str(job_dir / "%(title).80s.%(ext)s")
    if audio_only:
        opts = {
            "format": "bestaudio/best",
            "outtmpl": out_template,
            "quiet": True,
            "no_warnings": True,
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }],
        }
    else:
        opts = {
            "format": fmt,
            "outtmpl": out_template,
            "quiet": True,
            "no_warnings": True,
            "merge_output_format": merge_to,
        }

    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=True)
        title = (info or {}).get("title", "media")

    ext = "mp3" if audio_only else merge_to
    matches = list(job_dir.glob(f"*.{ext}"))
    if not matches:
        matches = sorted(job_dir.glob("*.*"), key=lambda p: p.stat().st_size, reverse=True)
    return (matches[0] if matches else None), title


# ─── 1. Spotify Downloader ───────────────────────────────────────────────────

def _handle_spotify_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = (payload.get("url") or "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Spotify track or episode URL.", data={"error": "No URL"})
    if "spotify.com" not in url and "spoti.fi" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Spotify URL (open.spotify.com/...).", data={"error": "Not Spotify"})

    try:
        path, title = _ydl_download(url, job_dir, audio_only=True)
        if not path:
            return ExecutionResult(
                kind="json",
                message="Could not download this Spotify item. Some tracks are DRM-protected; try a public podcast episode or a Spotify-hosted preview.",
                data={"error": "No file produced"},
            )
        return ExecutionResult(
            kind="file",
            message=f"✅ Downloaded: {title}",
            output_path=path,
            filename=f"{_safe_name(title)}.mp3",
            content_type="audio/mpeg",
        )
    except Exception as e:
        msg = str(e)
        friendly = "Spotify track is DRM-protected." if "DRM" in msg or "protected" in msg.lower() else f"Download failed: {msg[:200]}"
        return ExecutionResult(kind="json", message=friendly, data={"error": msg[:500]})


# ─── Generic og:video meta scrape fallback (Snapchat / Threads / etc.) ───────
def _og_meta_scrape_to_file(url: str, job_dir: Path, label: str):
    import re as _re
    import httpx as _httpx
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "X-IG-App-ID": "936619743392459",  # ignored by non-Meta hosts, helps Threads
    }
    try:
        r = _httpx.get(url, headers=headers, timeout=20, follow_redirects=True)
        if r.status_code != 200:
            return None
        html = r.text
    except Exception:
        return None
    media_url = None
    for pat in (
        r'<meta[^>]+property=["\']og:video:secure_url["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+property=["\']og:video:url["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+property=["\']og:video["\'][^>]+content=["\']([^"\']+)["\']',
        r'"video_versions"\s*:\s*\[\s*\{\s*[^}]*"url"\s*:\s*"([^"]+)"',
        r'"contentUrl"\s*:\s*"(https?://[^"]+\.mp4[^"]*)"',
    ):
        m = _re.search(pat, html)
        if m:
            media_url = m.group(1).encode("utf-8", "ignore").decode("unicode_escape", "ignore").replace("&amp;", "&")
            break
    if not media_url or media_url.endswith(".m3u8"):
        return None
    try:
        with _httpx.stream("GET", media_url, timeout=120, follow_redirects=True, headers=headers) as v:
            if v.status_code != 200 or "html" in v.headers.get("content-type", "").lower():
                return None
            slug = _re.sub(r"[^a-zA-Z0-9]+", "_", label.lower()).strip("_") or "video"
            out = job_dir / f"{slug}.mp4"
            with open(out, "wb") as fh:
                for chunk in v.iter_bytes(chunk_size=64 * 1024):
                    fh.write(chunk)
    except Exception:
        return None
    if not out.exists() or out.stat().st_size < 5000:
        return None
    size_mb = round(out.stat().st_size / 1024 / 1024, 2)
    return ExecutionResult(
        kind="file",
        message=f"✅ Downloaded {label} ({size_mb} MB)",
        output_path=out,
        filename=out.name,
        content_type="video/mp4",
    )


# ─── 2. Snapchat Downloader ──────────────────────────────────────────────────

def _handle_snapchat_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = (payload.get("url") or "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Snapchat Spotlight or Story URL.", data={"error": "No URL"})
    if "snapchat.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Snapchat URL (snapchat.com/...).", data={"error": "Not Snapchat"})

    try:
        path, title = _ydl_download(url, job_dir)
        if path:
            return ExecutionResult(
                kind="file",
                message=f"✅ Downloaded: {title}",
                output_path=path,
                filename=f"{_safe_name(title)}.mp4",
                content_type="video/mp4",
            )
    except Exception:
        pass
    fb = _og_meta_scrape_to_file(url, job_dir, "Snapchat")
    if fb is not None:
        return fb
    return ExecutionResult(kind="json", message="Snapchat content not accessible — it may be private, expired, or login-required.", data={"error": "No file"})


# ─── 3. Threads (Meta) Downloader ────────────────────────────────────────────

def _handle_threads_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = (payload.get("url") or "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Threads post URL.", data={"error": "No URL"})
    if "threads.net" not in url and "threads.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Threads URL (threads.net/...).", data={"error": "Not Threads"})

    try:
        path, title = _ydl_download(url, job_dir)
        if path:
            return ExecutionResult(
                kind="file",
                message=f"✅ Downloaded: {title}",
                output_path=path,
                filename=f"{_safe_name(title)}.mp4",
                content_type="video/mp4",
            )
    except Exception:
        pass
    fb = _og_meta_scrape_to_file(url, job_dir, "Threads post")
    if fb is not None:
        return fb
    return ExecutionResult(kind="json", message="Threads post not accessible — check that it is public.", data={"error": "No file"})


# ─── 4. YouTube Subtitle Downloader ──────────────────────────────────────────

def _handle_youtube_subtitle_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = (payload.get("url") or "").strip()
    lang = (payload.get("lang") or "en").strip().lower()
    fmt = (payload.get("format") or "srt").strip().lower()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a YouTube video URL.", data={"error": "No URL"})
    if "youtube.com" not in url and "youtu.be" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid YouTube URL.", data={"error": "Not YouTube"})

    try:
        import yt_dlp

        out_template = str(job_dir / "%(title).80s.%(ext)s")
        opts = {
            "skip_download": True,
            "writesubtitles": True,
            "writeautomaticsub": True,
            "subtitleslangs": [lang, f"{lang}.*", "en"],
            "subtitlesformat": "vtt" if fmt == "vtt" else "srt/best",
            "outtmpl": out_template,
            "quiet": True,
            "no_warnings": True,
        }
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = (info or {}).get("title", "subtitle")

        # Find subtitle file
        candidates = list(job_dir.glob("*.vtt")) + list(job_dir.glob("*.srt"))
        if not candidates:
            return ExecutionResult(
                kind="json",
                message=f"No subtitles available for language '{lang}'. Try 'en' or another language code.",
                data={"error": "No subtitles found"},
            )

        sub_file = candidates[0]

        # Convert VTT → SRT if user wants SRT and we got VTT
        if fmt == "srt" and sub_file.suffix == ".vtt":
            srt_path = sub_file.with_suffix(".srt")
            try:
                _vtt_to_srt(sub_file, srt_path)
                sub_file = srt_path
            except Exception:
                pass

        return ExecutionResult(
            kind="file",
            message=f"✅ Downloaded subtitles ({lang}): {title}",
            output_path=sub_file,
            filename=f"{_safe_name(title)}_{lang}.{sub_file.suffix.lstrip('.')}",
            content_type="text/plain",
        )
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Subtitle download failed: {str(e)[:200]}", data={"error": str(e)[:500]})


def _vtt_to_srt(vtt: Path, srt: Path) -> None:
    text = vtt.read_text(encoding="utf-8", errors="ignore")
    lines = text.splitlines()
    out: list[str] = []
    counter = 0
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if "-->" in line:
            counter += 1
            ts = line.replace(".", ",")
            out.append(str(counter))
            out.append(ts)
            i += 1
            block: list[str] = []
            while i < len(lines) and lines[i].strip():
                block.append(lines[i])
                i += 1
            out.append("\n".join(block))
            out.append("")
        else:
            i += 1
    srt.write_text("\n".join(out), encoding="utf-8")


# ─── 5. Video to GIF ─────────────────────────────────────────────────────────

def _handle_video_to_gif(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload a video file (MP4, MOV, WebM, etc.).", data={"error": "No file"})
    if not shutil.which("ffmpeg"):
        return ExecutionResult(kind="json", message="Video processing engine is unavailable on this server.", data={"error": "ffmpeg missing"})

    src = files[0]
    try:
        start = float(payload.get("start", 0) or 0)
        duration = float(payload.get("duration", 5) or 5)
        duration = max(0.5, min(duration, 15))  # cap at 15 seconds
        width = int(payload.get("width", 480) or 480)
        width = max(120, min(width, 720))
        fps = int(payload.get("fps", 12) or 12)
        fps = max(5, min(fps, 24))
    except (TypeError, ValueError):
        return ExecutionResult(kind="json", message="Invalid GIF settings. Use numeric values.", data={"error": "Bad params"})

    out_path = job_dir / f"{src.stem}.gif"
    palette = job_dir / "palette.png"

    vf = f"fps={fps},scale={width}:-1:flags=lanczos"
    try:
        # Step 1: generate palette for high quality
        subprocess.run(
            ["ffmpeg", "-y", "-ss", str(start), "-t", str(duration), "-i", str(src),
             "-vf", f"{vf},palettegen=stats_mode=diff", str(palette)],
            check=True, capture_output=True, timeout=120,
        )
        # Step 2: render gif
        subprocess.run(
            ["ffmpeg", "-y", "-ss", str(start), "-t", str(duration), "-i", str(src),
             "-i", str(palette), "-lavfi", f"{vf} [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5",
             str(out_path)],
            check=True, capture_output=True, timeout=180,
        )
    except subprocess.TimeoutExpired:
        return ExecutionResult(kind="json", message="Conversion timed out. Try a shorter clip or smaller width.", data={"error": "timeout"})
    except subprocess.CalledProcessError as e:
        return ExecutionResult(
            kind="json",
            message="GIF conversion failed. Make sure the file is a valid video.",
            data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]},
        )

    if not out_path.exists():
        return ExecutionResult(kind="json", message="GIF was not produced.", data={"error": "no output"})

    return ExecutionResult(
        kind="file",
        message=f"✅ GIF created — {duration:.1f}s @ {fps}fps, {width}px wide",
        output_path=out_path,
        filename=f"{_safe_name(src.stem)}.gif",
        content_type="image/gif",
    )


# ─── 6. MP3 Cutter / Trimmer ─────────────────────────────────────────────────

def _handle_mp3_cutter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload an MP3 / WAV / M4A audio file.", data={"error": "No file"})
    if not shutil.which("ffmpeg"):
        return ExecutionResult(kind="json", message="Audio processing engine is unavailable on this server.", data={"error": "ffmpeg missing"})

    src = files[0]

    def _to_seconds(value: Any, default: float = 0.0) -> float:
        if value in (None, ""):
            return default
        try:
            return float(value)
        except (TypeError, ValueError):
            pass
        # accept mm:ss or hh:mm:ss
        try:
            parts = str(value).strip().split(":")
            parts = [float(p) for p in parts]
            if len(parts) == 2:
                return parts[0] * 60 + parts[1]
            if len(parts) == 3:
                return parts[0] * 3600 + parts[1] * 60 + parts[2]
        except Exception:
            pass
        return default

    start = max(0.0, _to_seconds(payload.get("start"), 0.0))
    end = _to_seconds(payload.get("end"), 0.0)
    duration = _to_seconds(payload.get("duration"), 0.0)

    # Decide trim window
    if end > start:
        length = end - start
    elif duration > 0:
        length = duration
    else:
        length = 30.0  # default 30s clip

    length = max(0.5, min(length, 600))  # cap 10 minutes

    out_path = job_dir / f"{src.stem}_cut.mp3"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-ss", str(start), "-t", str(length), "-i", str(src),
             "-acodec", "libmp3lame", "-b:a", "192k", str(out_path)],
            check=True, capture_output=True, timeout=180,
        )
    except subprocess.TimeoutExpired:
        return ExecutionResult(kind="json", message="Cutting timed out. Try a smaller clip.", data={"error": "timeout"})
    except subprocess.CalledProcessError as e:
        return ExecutionResult(
            kind="json",
            message="Could not cut this audio. Make sure the file is a valid audio file.",
            data={"error": (e.stderr or b"").decode("utf-8", errors="ignore")[:500]},
        )

    if not out_path.exists() or out_path.stat().st_size == 0:
        return ExecutionResult(kind="json", message="Output audio was empty — check your start/end times.", data={"error": "empty output"})

    return ExecutionResult(
        kind="file",
        message=f"✅ Audio trimmed — {length:.1f}s starting at {start:.1f}s",
        output_path=out_path,
        filename=f"{_safe_name(src.stem)}_cut.mp3",
        content_type="audio/mpeg",
    )


# ─── Registry ────────────────────────────────────────────────────────────────

NEW_EXTRA_HANDLERS = {
    "spotify-downloader": _handle_spotify_downloader,
    "snapchat-downloader": _handle_snapchat_downloader,
    "threads-downloader": _handle_threads_downloader,
    "youtube-subtitle-downloader": _handle_youtube_subtitle_downloader,
    "youtube-subtitles-downloader": _handle_youtube_subtitle_downloader,
    "subtitle-downloader": _handle_youtube_subtitle_downloader,
    "video-to-gif": _handle_video_to_gif,
    "mp3-cutter": _handle_mp3_cutter,
    "audio-trimmer": _handle_mp3_cutter,
}
