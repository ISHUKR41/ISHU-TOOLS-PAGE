"""
ISHU TOOLS – Video Downloader + Extra Tools Handlers
Handles: video-downloader, youtube-video-downloader, youtube-to-mp3, instagram-downloader,
         invoice-generator, pomodoro-timer, stopwatch, world-clock, typing-speed-test,
         note-pad, to-do-list, habit-tracker, flashcard-maker, grammar-checker,
         paraphrase-tool, plagiarism-detector, text-to-handwriting, ascii-art-generator,
         bulk-image-compressor, image-to-base64, base64-to-image, color-palette-generator,
         ip-address-lookup, dns-lookup, whois-lookup, ssl-certificate-checker,
         word-frequency-counter, text-to-morse, roman-numeral-converter,
         fibonacci-generator, prime-number-checker, matrix-calculator,
         equation-solver, statistics-calculator, currency-converter,
         fuel-cost-calculator, gst-calculator-india, atm-pin-generator,
         credit-card-validator, ifsc-code-finder, emi-calculator-advanced,
         number-to-words, calorie-calculator, water-intake-calculator, sleep-calculator,
         screen-ruler, resume-builder, world-clock, typing-speed-test
"""
from __future__ import annotations

import base64
import io
import json
import math
import random
import re
import secrets
import socket
import string
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any

import httpx
from PIL import Image

from .handlers import ExecutionResult
from .handlers import coerce_quality


# ─── Video Downloader (yt-dlp based) ─────────────────────────────────────────

# ─── Shared yt-dlp options ────────────────────────────────────────────────────

_YDL_COMMON_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "noplaylist": True,
    "socket_timeout": 30,
    "retries": 3,
    "http_headers": {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    # Limit filesize to 2 GB to allow 4K downloads while preventing absurd sizes
    "max_filesize": 2 * 1024 * 1024 * 1024,
}

# Allowed quality steps (height in px). 'best' = no cap.
_ALLOWED_HEIGHTS = {"144", "240", "360", "480", "720", "1080", "1440", "2160", "4320"}

# Quality cap: default to 1080p for a good balance of quality and file size.
_DEFAULT_FORMAT = (
    "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]"
    "/bestvideo[height<=1080]+bestaudio"
    "/best[height<=1080]"
    "/best"
)

_AUDIO_FORMAT = "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio/best"


def _coerce_str(value, default: str = "") -> str:
    """Safely coerce any payload value to a stripped string. Handles ints, floats, lists, None."""
    if value is None:
        return default
    if isinstance(value, (list, tuple)):
        value = ", ".join(str(v) for v in value)
    return str(value).strip()

def _format_for_quality(quality: str | int | None) -> str:
    """Build a yt-dlp format selector for a requested max height (e.g. '720', '2160', 'best')."""
    if quality is None:
        return _DEFAULT_FORMAT
    q = str(quality).strip().lower().replace("p", "").replace("k", "")
    # Friendly aliases
    alias = {"4": "2160", "2": "1440", "8": "4320", "hd": "720", "fullhd": "1080", "fhd": "1080", "uhd": "2160", "qhd": "1440"}
    q = alias.get(q, q)
    if q in ("best", "max", "highest", ""):
        return (
            "bestvideo[ext=mp4]+bestaudio[ext=m4a]"
            "/bestvideo+bestaudio"
            "/best[ext=mp4]/best"
        )
    if q in _ALLOWED_HEIGHTS:
        return (
            f"bestvideo[height<={q}][ext=mp4]+bestaudio[ext=m4a]"
            f"/bestvideo[height<={q}]+bestaudio"
            f"/best[height<={q}][ext=mp4]"
            f"/best[height<={q}]/best"
        )
    return _DEFAULT_FORMAT


def _audio_quality_kbps(quality: str | int | None) -> str:
    """Return MP3 kbps string for requested audio quality."""
    if quality is None:
        return "192"
    q = str(quality).strip().lower().replace("kbps", "").replace("k", "")
    allowed = {"64", "96", "128", "160", "192", "256", "320"}
    return q if q in allowed else "192"


def _safe_title(title: str, max_len: int = 60) -> str:
    """Clean title for use as a filename."""
    title = re.sub(r'[^\w\s\-.]', '', title)
    return title.strip()[:max_len].replace(' ', '_') or "video"


def _find_output_file(job_dir: Path, preferred_ext: str = "mp4") -> Path | None:
    """Find the largest downloaded file in job_dir."""
    all_files = [f for f in job_dir.glob("*") if f.is_file() and f.stat().st_size > 1000]
    if not all_files:
        return None
    # Prefer preferred extension
    ext_files = [f for f in all_files if f.suffix.lower() == f".{preferred_ext}"]
    pool = ext_files or all_files
    return max(pool, key=lambda f: f.stat().st_size)


def _classify_ytdlp_error(err: str) -> str:
    """Return a user-friendly message based on yt-dlp error text."""
    el = err.lower()
    # Instagram-specific: anonymous access is blocked platform-wide as of 2024-2025.
    if "empty media response" in el or ("instagram" in el and ("login" in el or "cookies" in el or "authentication" in el)):
        return ("Instagram now blocks anonymous downloads on its servers. "
                "To download, paste your Instagram session cookies in the optional 'Cookies' field "
                "(Browser → DevTools → Application → Cookies → instagram.com → copy as 'name=value; ...'). "
                "Public reels via desktop browser still work fine.")
    # TikTok-specific: extractor often returns "Unexpected response" due to TT's anti-bot.
    if "tiktok" in el and ("unexpected response" in el or "unable to extract" in el):
        return ("TikTok is currently blocking server-side downloads (anti-bot protection). "
                "Try again in a few minutes, or paste your TikTok cookies in the optional 'Cookies' field. "
                "We attempted a free fallback API but it also failed.")
    # Twitter/X: needs guest token or auth in many regions
    if ("twitter" in el or "x.com" in el) and ("no video could be found" in el or "guest token" in el or "no longer available" in el):
        return ("Twitter/X requires authentication for most videos now. "
                "Paste your X cookies in the optional 'Cookies' field, or use a working alternative platform.")
    if "private video" in el or "private" in el:
        return "This video is private and cannot be downloaded."
    if "sign in" in el or "login" in el or "age" in el:
        return "This video requires sign-in or is age-restricted. Paste your account cookies in the optional 'Cookies' field to download it."
    if "unavailable" in el or "not available" in el or "removed" in el:
        return "This video is unavailable or has been removed."
    if "copyright" in el or "blocked" in el:
        return "This video is blocked due to copyright restrictions."
    if "rate limit" in el or "429" in el or "too many" in el:
        return "Too many requests. Please wait a minute and try again."
    if "unsupported url" in el or "unable to extract" in el:
        return "This URL is not supported. Please check the link and try again."
    if "max filesize" in el or "too large" in el:
        return "Video file is too large to download (>2 GB). Try a shorter video or a lower quality (e.g. 1080p instead of 4K)."
    if "requested format" in el or "format is not available" in el or "no video formats" in el:
        return "The requested quality is not available for this video. Try a lower quality (e.g. 720p) or 'Best Available'."
    if "network" in el or "connection" in el or "timeout" in el:
        return "Network error. Please check your connection and try again."
    if "ffmpeg" in el:
        return "Video processing error. The video may be in an unsupported format."
    return f"Download failed: {err[:250]}"


def _write_cookies_file(job_dir: Path, cookies_text: str) -> Path | None:
    """
    Write a user-supplied cookies blob to a Netscape-format cookies.txt file.
    Accepts either a raw Netscape cookies file (preferred) or a 'name=value; name=value'
    cookie string copied from browser devtools (best-effort converted to Netscape).
    Returns the path on success, None on parse failure.
    """
    cookies_text = (cookies_text or "").strip()
    if not cookies_text:
        return None
    cookies_path = job_dir / "_cookies.txt"
    # Already Netscape format?
    if cookies_text.startswith("# Netscape") or cookies_text.startswith("# HTTP Cookie File"):
        cookies_path.write_text(cookies_text, encoding="utf-8")
        return cookies_path
    # 'k=v; k=v' header style → convert (best-effort, domain unknown so use generic)
    if "=" in cookies_text and ";" in cookies_text and "\n" not in cookies_text:
        lines = ["# Netscape HTTP Cookie File"]
        for pair in cookies_text.split(";"):
            pair = pair.strip()
            if "=" not in pair:
                continue
            name, _, value = pair.partition("=")
            name, value = name.strip(), value.strip()
            if not name:
                continue
            # domain TRUE path TRUE httpOnly expires name value
            lines.append(f".instagram.com\tTRUE\t/\tTRUE\t2147483647\t{name}\t{value}")
            lines.append(f".tiktok.com\tTRUE\t/\tTRUE\t2147483647\t{name}\t{value}")
            lines.append(f".x.com\tTRUE\t/\tTRUE\t2147483647\t{name}\t{value}")
            lines.append(f".twitter.com\tTRUE\t/\tTRUE\t2147483647\t{name}\t{value}")
        cookies_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        return cookies_path
    # Multi-line free-form — assume Netscape-ish, write as-is and let yt-dlp try
    cookies_path.write_text(cookies_text, encoding="utf-8")
    return cookies_path


def _yt_dlp_download(
    url: str,
    job_dir: Path,
    fmt: str = _DEFAULT_FORMAT,
    audio_only: bool = False,
    audio_kbps: str = "192",
    extra_opts: dict | None = None,
    cookies_text: str | None = None,
) -> ExecutionResult:
    """
    Core yt-dlp download function used by all video/audio downloader handlers.
    Returns ExecutionResult with kind='file' on success or kind='json' on error.

    cookies_text: Optional Netscape cookies file contents (or 'k=v; k=v' header)
    to authenticate with platforms that block anonymous access (IG, TikTok, etc.).
    """
    try:
        import yt_dlp
    except ImportError:
        return ExecutionResult(
            kind="json",
            message="Video downloader library is not installed. Please contact support.",
            data={"error": "yt-dlp not installed"},
        )

    out_tmpl = str(job_dir / "%(title).80s.%(ext)s")

    opts: dict = dict(_YDL_COMMON_OPTS)
    opts["outtmpl"] = out_tmpl
    opts["format"] = fmt

    if audio_only:
        opts["postprocessors"] = [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": str(audio_kbps or "192"),
        }]
    else:
        opts["merge_output_format"] = "mp4"

    if extra_opts:
        opts.update(extra_opts)

    # Optional user-supplied cookies (for IG/TikTok/Twitter etc.)
    if cookies_text:
        cookies_path = _write_cookies_file(job_dir, cookies_text)
        if cookies_path:
            opts["cookiefile"] = str(cookies_path)

    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=True)

        title = (info or {}).get("title", "video")
        duration = (info or {}).get("duration", 0)
        uploader = (info or {}).get("uploader", "")

        if audio_only:
            out = _find_output_file(job_dir, "mp3")
            if not out:
                # Sometimes yt-dlp names the file .mp3 without extension change yet
                out = _find_output_file(job_dir)
            if not out:
                return ExecutionResult(
                    kind="json",
                    message="Audio extraction failed. The track may be unavailable or DRM-protected.",
                    data={"error": "No audio file produced"},
                )
            fname = f"{_safe_title(title)}.mp3"
            return ExecutionResult(
                kind="file",
                message=f"Downloaded: {title}" + (f" ({int(duration//60)}:{int(duration%60):02d})" if duration else ""),
                output_path=out,
                filename=fname,
                content_type="audio/mpeg",
            )
        else:
            out = _find_output_file(job_dir, "mp4")
            if not out:
                out = _find_output_file(job_dir)
            if not out:
                return ExecutionResult(
                    kind="json",
                    message="Download failed. The video may be unavailable, private, or DRM-protected.",
                    data={"error": "No video file produced"},
                )
            ext = out.suffix.lstrip(".")
            fname = f"{_safe_title(title)}.{ext}"
            detail = []
            if duration:
                detail.append(f"{int(duration//60)}:{int(duration%60):02d}")
            if uploader:
                detail.append(f"by {uploader}")
            size_mb = round(out.stat().st_size / 1024 / 1024, 1)
            detail.append(f"{size_mb} MB")
            return ExecutionResult(
                kind="file",
                message=f"Downloaded: {title}" + (f" ({', '.join(detail)})" if detail else ""),
                output_path=out,
                filename=fname,
                content_type="video/mp4",
            )

    except Exception as e:
        err = str(e)
        return ExecutionResult(
            kind="json",
            message=_classify_ytdlp_error(err),
            data={"error": err[:500], "url": url},
        )


# ─── Universal Video Downloader ───────────────────────────────────────────────

def _handle_video_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a video URL to download.", data={"error": "No URL"})
    if not url.startswith(("http://", "https://")):
        return ExecutionResult(kind="json", message="Invalid URL. Must start with http:// or https://", data={"error": "Invalid URL"})
    fmt = _format_for_quality(payload.get("quality"))
    return _yt_dlp_download(url, job_dir, fmt=fmt)


# ─── YouTube Downloaders ──────────────────────────────────────────────────────

def _handle_youtube_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a YouTube URL.", data={"error": "No URL"})
    if "youtube.com" not in url and "youtu.be" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid YouTube URL (youtube.com or youtu.be).", data={"error": "Not YouTube"})
    payload["url"] = url
    return _handle_video_downloader(files, payload, job_dir)


def _handle_youtube_to_mp4(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a YouTube URL.", data={"error": "No URL"})
    if "youtube.com" not in url and "youtu.be" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid YouTube URL.", data={"error": "Not YouTube"})
    payload["url"] = url
    quality = str(payload.get("quality", "720"))
    payload["quality"] = quality
    return _handle_video_downloader(files, payload, job_dir)


def _handle_youtube_shorts_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a YouTube Shorts URL.", data={"error": "No URL"})
    if "youtube.com" not in url and "youtu.be" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid YouTube or Shorts URL.", data={"error": "Not YouTube"})
    payload["url"] = url
    return _handle_video_downloader(files, payload, job_dir)


def _handle_youtube_to_mp3(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a YouTube URL to extract audio.", data={"error": "No URL"})
    kbps = _audio_quality_kbps(payload.get("audio_quality") or payload.get("bitrate") or payload.get("quality"))
    return _yt_dlp_download(url, job_dir, fmt=_AUDIO_FORMAT, audio_only=True, audio_kbps=kbps)


# ─── Platform-Specific Downloaders ───────────────────────────────────────────

def _instagram_oembed_fallback(url: str, job_dir: Path) -> ExecutionResult | None:
    """Free no-auth fallback for public Instagram reels/posts.

    Instagram's web GraphQL endpoint returns the direct mp4/jpg URL for
    PUBLIC content when called with the documented public app_id and a
    mobile UA — no login required, no third-party API. We extract the
    shortcode, hit several public endpoints in order, and pull
    ``video_url`` / ``display_url`` out of the JSON.

    Returns ``ExecutionResult`` on success, ``None`` to fall through to
    yt-dlp / error reporting.
    """
    import re as _re
    import time as _time

    m = _re.search(r"/(?:reel|reels|p|tv)/([A-Za-z0-9_-]+)", url)
    if not m:
        return None
    shortcode = m.group(1)
    # Try multiple public endpoints in order. Different endpoints break at
    # different times — keeping several gives us better real-world reliability.
    candidates = [
        f"https://www.instagram.com/api/v1/media/shortcode/{shortcode}/",
        f"https://www.instagram.com/p/{shortcode}/?__a=1&__d=dis",
        f"https://www.instagram.com/reel/{shortcode}/?__a=1&__d=dis",
    ]
    headers = {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "X-IG-App-ID": "936619743392459",
        "X-ASBD-ID": "198387",
        "X-IG-WWW-Claim": "0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Origin": "https://www.instagram.com",
        "Referer": f"https://www.instagram.com/p/{shortcode}/",
    }
    data = None
    for api_url in candidates:
        for attempt in range(2):  # one retry on transient 429
            try:
                r = httpx.get(api_url, headers=headers, timeout=20, follow_redirects=True)
                if r.status_code == 429:
                    _time.sleep(1.0)
                    continue
                if r.status_code != 200:
                    break
                try:
                    data = r.json()
                    break
                except Exception:
                    break
            except Exception:
                break
        if data:
            break
    if not data:
        return None
    # Walk the response to find a video or image url.
    media_url: str | None = None
    is_video = False
    try:
        items = (data.get("items") or [])
        if items:
            it = items[0]
            videos = it.get("video_versions") or []
            if videos:
                media_url = videos[0].get("url")
                is_video = True
            else:
                imgs = ((it.get("image_versions2") or {}).get("candidates")) or []
                if imgs:
                    media_url = imgs[0].get("url")
        if not media_url:
            shortcode_media = (
                (data.get("graphql") or {}).get("shortcode_media")
                or (data.get("data") or {}).get("xdt_shortcode_media")
                or data.get("media")
                or {}
            )
            if shortcode_media.get("is_video") and shortcode_media.get("video_url"):
                media_url = shortcode_media["video_url"]
                is_video = True
            elif shortcode_media.get("video_versions"):
                media_url = shortcode_media["video_versions"][0].get("url")
                is_video = True
            elif shortcode_media.get("display_url"):
                media_url = shortcode_media["display_url"]
            elif shortcode_media.get("image_versions2"):
                cands = (shortcode_media["image_versions2"] or {}).get("candidates") or []
                if cands:
                    media_url = cands[0].get("url")
    except Exception:
        return None
    if not media_url:
        return None
    try:
        v = httpx.get(media_url, timeout=60, follow_redirects=True, headers={"User-Agent": headers["User-Agent"]})
        if v.status_code != 200 or len(v.content) < 5000:
            return None
    except Exception:
        return None
    ext = "mp4" if is_video else "jpg"
    out = job_dir / f"instagram_{shortcode}.{ext}"
    out.write_bytes(v.content)
    size_mb = round(len(v.content) / 1024 / 1024, 2)
    return ExecutionResult(
        kind="file",
        message=f"Downloaded Instagram {'video' if is_video else 'photo'} ({size_mb} MB)",
        output_path=out,
        filename=out.name,
        content_type="video/mp4" if is_video else "image/jpeg",
    )


def _handle_instagram_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste an Instagram URL.", data={"error": "No URL"})
    if "instagram.com" not in url and "instagr.am" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Instagram URL (instagram.com/reel/... or /p/... or /tv/...).", data={"error": "Not Instagram"})

    # Strip query strings (?igsh=, ?utm_*, etc.) — they sometimes confuse the extractor
    clean_url = url.split("?")[0].rstrip("/")

    # Instagram serves a single combined mp4 stream for most reels/posts.
    # The default format "bestvideo+bestaudio" FAILS on Instagram because there's no separate audio track.
    # Use a forgiving format chain: prefer 'best' (single-file), fall back to merge.
    ig_fmt = "best[ext=mp4]/best/bestvideo+bestaudio"

    # IG-specific extractor args + extra browser-like headers help avoid the 401/login wall on public reels.
    ig_extra = {
        "extractor_args": {"instagram": {"app_id": ["936619743392459"]}},
        "http_headers": {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            "X-IG-App-ID": "936619743392459",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "*/*",
        },
    }
    cookies = payload.get("cookies") or payload.get("cookies_text")

    # Try yt-dlp first (best quality, supports cookies for private/age-gated content).
    primary = _yt_dlp_download(clean_url, job_dir, fmt=ig_fmt, extra_opts=ig_extra, cookies_text=cookies)
    if primary.kind == "file":
        return primary

    # yt-dlp failed (usually the login-wall 401). Try the no-auth GraphQL fallback for public posts.
    fallback = _instagram_oembed_fallback(clean_url, job_dir)
    if fallback is not None:
        return fallback

    # Both failed — return a clear, actionable message.
    msg = (
        "Instagram blocked this download. This usually means: "
        "(1) the post is private or age-restricted, or "
        "(2) Instagram is rate-limiting our server's IP. "
        "Fix: open instagram.com in your browser (logged in), export cookies "
        "(use the 'Get cookies.txt LOCALLY' Chrome extension), and paste the "
        "contents into the Cookies field below. Public reels usually work without cookies."
    )
    return ExecutionResult(kind="json", message=msg, data={"error": "instagram_blocked", "yt_dlp_error": primary.message})


def _tikwm_fallback(url: str, job_dir: Path) -> ExecutionResult | None:
    """
    Free no-auth TikTok fallback via tikwm.com public API.
    Returns ExecutionResult on success, None to signal 'try yt-dlp instead'.
    """
    try:
        r = httpx.post(
            "https://www.tikwm.com/api/",
            data={"url": url, "hd": "1"},
            timeout=20,
            headers={"User-Agent": "Mozilla/5.0"},
        )
        if r.status_code != 200:
            return None
        j = r.json()
        if j.get("code") != 0 or not j.get("data"):
            return None
        d = j["data"]
        video_url = d.get("hdplay") or d.get("play")
        if not video_url:
            return None
        # Some tikwm responses return relative URLs
        if video_url.startswith("/"):
            video_url = "https://www.tikwm.com" + video_url
        v = httpx.get(video_url, timeout=60, follow_redirects=True, headers={"User-Agent": "Mozilla/5.0"})
        if v.status_code != 200 or len(v.content) < 5000:
            return None
        title = (d.get("title") or "tiktok").strip() or "tiktok"
        out = job_dir / f"{_safe_title(title)}.mp4"
        out.write_bytes(v.content)
        size_mb = round(len(v.content) / 1024 / 1024, 1)
        author = (d.get("author") or {}).get("nickname", "")
        detail = f"{size_mb} MB" + (f", by {author}" if author else "")
        return ExecutionResult(
            kind="file",
            message=f"Downloaded: {title} ({detail})",
            output_path=out,
            filename=out.name,
            content_type="video/mp4",
        )
    except Exception:
        return None


def _handle_tiktok_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a TikTok video URL.", data={"error": "No URL"})
    if "tiktok.com" not in url and "vm.tiktok" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid TikTok URL.", data={"error": "Not TikTok"})
    cookies = payload.get("cookies") or payload.get("cookies_text")
    # Strip tracking params that sometimes confuse yt-dlp's TikTok extractor
    clean_url = url.split("?")[0]
    # Try yt-dlp first (gives best quality + cookies support).
    # Mobile UA + Referer help avoid the "Unable to find video in feed" wall on cloud IPs.
    tt_extra = {
        "noplaylist": True,
        "http_headers": {
            "User-Agent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
            "Referer": "https://www.tiktok.com/",
            "Accept-Language": "en-US,en;q=0.9",
        },
    }
    result = _yt_dlp_download(clean_url, job_dir, fmt=_format_for_quality(payload.get("quality")),
                              extra_opts=tt_extra, cookies_text=cookies)
    if result.kind == "file":
        return result
    # yt-dlp failed → try tikwm public mirror (no-auth, watermark-free)
    fallback = _tikwm_fallback(clean_url, job_dir)
    if fallback:
        return fallback
    # Try original URL too in case query params were needed
    if clean_url != url:
        fallback2 = _tikwm_fallback(url, job_dir)
        if fallback2:
            return fallback2
    return result  # return original yt-dlp error message


def _twitter_syndication_fallback(url: str, job_dir: Path) -> ExecutionResult | None:
    """No-auth fallback for public tweets via Twitter's syndication CDN.

    `cdn.syndication.twimg.com/tweet-result` is the public endpoint Twitter
    uses to embed tweets on third-party sites. It returns full JSON including
    `mediaDetails[].video_info.variants[]` (mp4 + m3u8) for any public tweet
    without authentication.
    """
    import re as _re
    m = _re.search(r"/status(?:es)?/(\d+)", url)
    if not m:
        return None
    tweet_id = m.group(1)
    # Random token (any value works) — required parameter
    api = (
        f"https://cdn.syndication.twimg.com/tweet-result"
        f"?id={tweet_id}&token=ishu&lang=en"
    )
    try:
        r = httpx.get(api, timeout=20, follow_redirects=True,
                      headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"})
        if r.status_code != 200:
            return None
        data = r.json()
    except Exception:
        return None
    media = data.get("mediaDetails") or []
    video_url = None
    is_video = False
    for m_ in media:
        vi = m_.get("video_info") or {}
        variants = [v for v in (vi.get("variants") or []) if v.get("content_type") == "video/mp4"]
        if variants:
            best = max(variants, key=lambda v: v.get("bitrate", 0) or 0)
            video_url = best.get("url")
            is_video = True
            break
        if not video_url and m_.get("media_url_https"):
            video_url = m_["media_url_https"]
    if not video_url:
        return None
    try:
        v = httpx.get(video_url, timeout=60, follow_redirects=True, headers={"User-Agent": "Mozilla/5.0"})
        if v.status_code != 200 or len(v.content) < 5000:
            return None
    except Exception:
        return None
    ext = "mp4" if is_video else (video_url.rsplit(".", 1)[-1].split("?")[0][:4] or "jpg")
    out = job_dir / f"twitter_{tweet_id}.{ext}"
    out.write_bytes(v.content)
    size_mb = round(len(v.content) / 1024 / 1024, 2)
    user = (data.get("user") or {}).get("screen_name", "")
    return ExecutionResult(
        kind="file",
        message=f"Downloaded tweet {('video' if is_video else 'media')}{' by @'+user if user else ''} ({size_mb} MB)",
        output_path=out,
        filename=out.name,
        content_type="video/mp4" if is_video else "image/jpeg",
    )


def _handle_twitter_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Twitter/X video URL.", data={"error": "No URL"})
    if "twitter.com" not in url and "x.com" not in url and "t.co" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Twitter or X.com URL.", data={"error": "Not Twitter/X"})
    cookies = payload.get("cookies") or payload.get("cookies_text")
    # Syndication CDN works without auth even when yt-dlp gets rate-limited on cloud IPs.
    # Try it first when we don't have user cookies — it's faster and more reliable for public tweets.
    if not cookies:
        fast = _twitter_syndication_fallback(url, job_dir)
        if fast is not None:
            return fast
    primary = _yt_dlp_download(url, job_dir, fmt=_format_for_quality(payload.get("quality")), cookies_text=cookies)
    if primary.kind == "file":
        return primary
    fallback = _twitter_syndication_fallback(url, job_dir)
    if fallback is not None:
        return fallback
    return primary


def _facebook_html_fallback(url: str, job_dir: Path) -> ExecutionResult | None:
    """No-auth fallback for public Facebook videos.

    Facebook's public mobile/desktop pages embed `hd_src`/`sd_src` (or
    `playable_url`/`playable_url_quality_hd`) in inline JSON. We fetch the
    page with a desktop UA and grep those out.
    """
    import re as _re
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }
    try:
        r = httpx.get(url, headers=headers, timeout=20, follow_redirects=True)
        if r.status_code != 200:
            return None
        html = r.text
    except Exception:
        return None
    patterns = [
        r'"playable_url_quality_hd":"([^"]+)"',
        r'"playable_url":"([^"]+)"',
        r'"hd_src":"([^"]+)"',
        r'"sd_src":"([^"]+)"',
        r'"browser_native_hd_url":"([^"]+)"',
        r'"browser_native_sd_url":"([^"]+)"',
    ]
    media_url = None
    for pat in patterns:
        m = _re.search(pat, html)
        if m:
            media_url = m.group(1).encode("utf-8").decode("unicode_escape")
            break
    if not media_url:
        return None
    try:
        v = httpx.get(media_url, timeout=60, follow_redirects=True, headers=headers)
        if v.status_code != 200 or len(v.content) < 5000:
            return None
    except Exception:
        return None
    out = job_dir / "facebook_video.mp4"
    out.write_bytes(v.content)
    size_mb = round(len(v.content) / 1024 / 1024, 2)
    return ExecutionResult(
        kind="file",
        message=f"Downloaded Facebook video ({size_mb} MB)",
        output_path=out,
        filename=out.name,
        content_type="video/mp4",
    )


def _handle_facebook_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Facebook video URL.", data={"error": "No URL"})
    if "facebook.com" not in url and "fb.watch" not in url and "fb.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Facebook URL.", data={"error": "Not Facebook"})
    cookies = payload.get("cookies") or payload.get("cookies_text")
    primary = _yt_dlp_download(url, job_dir, fmt=_format_for_quality(payload.get("quality")), cookies_text=cookies)
    if primary.kind == "file":
        return primary
    # Try desktop HTML scrape
    fallback = _facebook_html_fallback(url, job_dir)
    if fallback is not None:
        return fallback
    # Try mbasic.facebook.com — strips JS, often returns video tag directly
    mbasic_url = url.replace("www.facebook.com", "mbasic.facebook.com").replace("//facebook.com", "//mbasic.facebook.com")
    if mbasic_url != url:
        fallback2 = _facebook_html_fallback(mbasic_url, job_dir)
        if fallback2 is not None:
            return fallback2
    return primary


def _vimeo_player_config_fallback(url: str, job_dir: Path, quality_hint: str | None):
    """No-auth Vimeo fallback: hit player.vimeo.com/video/{id}/config (used by Vimeo's own
    embed player). Returns JSON with `request.files.progressive` — direct mp4 URLs."""
    import re as _re
    import httpx as _httpx
    m = _re.search(r"vimeo\.com/(?:video/)?(\d+)", url)
    if not m:
        return None
    vid = m.group(1)
    cfg_url = f"https://player.vimeo.com/video/{vid}/config"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        "Referer": "https://player.vimeo.com/",
    }
    try:
        r = _httpx.get(cfg_url, headers=headers, timeout=20)
        if r.status_code != 200:
            return None
        data = r.json()
    except Exception:
        return None
    progressive = (((data.get("request") or {}).get("files") or {}).get("progressive") or [])
    if not progressive:
        return None
    # Sort by height desc, then optionally pick by quality_hint
    progressive.sort(key=lambda f: f.get("height", 0), reverse=True)
    pick = progressive[0]
    if quality_hint:
        target = {"low": 360, "medium": 480, "high": 720, "best": 9999}.get(quality_hint.lower(), 9999)
        for f in progressive:
            if f.get("height", 0) <= target:
                pick = f
                break
    media_url = pick.get("url")
    if not media_url:
        return None
    title = ((data.get("video") or {}).get("title") or f"vimeo_{vid}")[:80]
    safe = _re.sub(r'[^\w\s.-]', '', title).strip()[:60] or f"vimeo_{vid}"
    out = job_dir / f"{safe}.mp4"
    try:
        with _httpx.stream("GET", media_url, timeout=120, headers=headers, follow_redirects=True) as v:
            if v.status_code != 200:
                return None
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
        message=f"Downloaded: {title} ({pick.get('height', '?')}p, {size_mb} MB)",
        output_path=out,
        filename=out.name,
        content_type="video/mp4",
    )


def _handle_vimeo_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Vimeo video URL.", data={"error": "No URL"})
    if "vimeo.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Vimeo URL.", data={"error": "Not Vimeo"})
    primary = _yt_dlp_download(url, job_dir, fmt=_format_for_quality(payload.get("quality")))
    if primary.kind == "file":
        return primary
    fb = _vimeo_player_config_fallback(url, job_dir, payload.get("quality"))
    if fb is not None:
        return fb
    return primary


def _dailymotion_metadata_fallback(url: str, job_dir: Path, quality_hint: str | None):
    """No-auth Dailymotion fallback: hit dailymotion.com/player/metadata/video/{id}
    which returns JSON with `qualities` → direct mp4 URLs (used by their own player)."""
    import re as _re
    import httpx as _httpx
    m = _re.search(r"(?:dailymotion\.com/(?:embed/)?video/|dai\.ly/)([a-zA-Z0-9]+)", url)
    if not m:
        return None
    vid = m.group(1)
    meta_url = f"https://www.dailymotion.com/player/metadata/video/{vid}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
    }
    try:
        r = _httpx.get(meta_url, headers=headers, timeout=20)
        if r.status_code != 200:
            return None
        data = r.json()
    except Exception:
        return None
    qualities = (data.get("qualities") or {})
    # qualities is a dict: {"240": [{type, url}], "380": [...], "720": [...], "1080": [...], "auto": [...]}
    progressive = []
    for q_str, variants in qualities.items():
        if q_str == "auto":
            continue
        try:
            h = int(q_str)
        except ValueError:
            continue
        for v in variants or []:
            u = v.get("url") or ""
            if u and (".mp4" in u or v.get("type", "").startswith("video/mp4")):
                progressive.append((h, u))
    if not progressive:
        return None
    progressive.sort(key=lambda x: x[0], reverse=True)
    pick_h, pick_url = progressive[0]
    if quality_hint:
        target = {"low": 240, "medium": 480, "high": 720, "best": 9999}.get(quality_hint.lower(), 9999)
        for h, u in progressive:
            if h <= target:
                pick_h, pick_url = h, u
                break
    title = (data.get("title") or f"dailymotion_{vid}")[:80]
    safe = _re.sub(r'[^\w\s.-]', '', title).strip()[:60] or f"dailymotion_{vid}"
    out = job_dir / f"{safe}.mp4"
    try:
        with _httpx.stream("GET", pick_url, timeout=120, headers=headers, follow_redirects=True) as v:
            if v.status_code != 200:
                return None
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
        message=f"Downloaded: {title} ({pick_h}p, {size_mb} MB)",
        output_path=out,
        filename=out.name,
        content_type="video/mp4",
    )


def _handle_dailymotion_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Dailymotion video URL.", data={"error": "No URL"})
    if "dailymotion.com" not in url and "dai.ly" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Dailymotion URL.", data={"error": "Not Dailymotion"})
    primary = _yt_dlp_download(url, job_dir, fmt=_format_for_quality(payload.get("quality")))
    if primary.kind == "file":
        return primary
    fb = _dailymotion_metadata_fallback(url, job_dir, payload.get("quality"))
    if fb is not None:
        return fb
    return primary


# ─── Playlist Downloader ──────────────────────────────────────────────────────

def _handle_playlist_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    """Download YouTube playlist (up to 5 videos) as ZIP."""
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a YouTube playlist URL.", data={"error": "No URL"})
    if "list=" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid YouTube playlist URL containing 'list=...'.", data={"error": "Not a playlist"})

    try:
        import yt_dlp, zipfile as _zipfile

        max_videos = min(max(int(payload.get("max_videos", 5) or 5), 1), 10)
        # Default to 720p for playlists (multiple files); user can override
        quality = payload.get("quality") or "720"
        out_tmpl = str(job_dir / "%(playlist_index)02d_%(title).60s.%(ext)s")
        opts = dict(_YDL_COMMON_OPTS)
        opts.update({
            "outtmpl": out_tmpl,
            "format": _format_for_quality(quality),
            "merge_output_format": "mp4",
            "playlist_items": f"1:{max_videos}",
            "noplaylist": False,
        })

        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=True)

        playlist_title = (info or {}).get("title", "playlist")
        downloaded = sorted(f for f in job_dir.glob("*") if f.suffix.lower() in (".mp4", ".webm", ".mkv") and f.stat().st_size > 1000)

        if not downloaded:
            return ExecutionResult(kind="json", message="No videos could be downloaded. The playlist may be private or empty.", data={"error": "No files"})

        if len(downloaded) == 1:
            f = downloaded[0]
            return ExecutionResult(kind="file", message="Downloaded 1 video from playlist", output_path=f, filename=f.name, content_type="video/mp4")

        zip_path = job_dir / "playlist.zip"
        with _zipfile.ZipFile(str(zip_path), "w", _zipfile.ZIP_STORED) as zf:
            for f in downloaded:
                zf.write(f, f.name)

        safe = _safe_title(playlist_title, 40)
        return ExecutionResult(
            kind="file",
            message=f"Downloaded {len(downloaded)} videos from playlist",
            output_path=zip_path,
            filename=f"{safe}_playlist.zip",
            content_type="application/zip",
        )
    except Exception as e:
        return ExecutionResult(kind="json", message=_classify_ytdlp_error(str(e)), data={"error": str(e)[:400]})


# ─── Audio Extractor (any URL) ────────────────────────────────────────────────

def _handle_audio_extractor(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a video URL to extract audio.", data={"error": "No URL"})
    if not url.startswith(("http://", "https://")):
        return ExecutionResult(kind="json", message="Please enter a valid URL starting with http:// or https://", data={"error": "Invalid URL"})
    return _yt_dlp_download(url, job_dir, fmt=_AUDIO_FORMAT, audio_only=True)


# ─── Image to Base64 ──────────────────────────────────────────────────────────

def _handle_image_to_base64(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if not files:
        return ExecutionResult(kind="json", message="Please upload an image file.", data={"error": "No file"})
    f = files[0]
    raw = f.read_bytes()
    b64 = base64.b64encode(raw).decode()
    ext = f.suffix.lower().lstrip(".")
    mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "gif": "image/gif", "webp": "image/webp", "bmp": "image/bmp"}.get(ext, "image/png")
    data_uri = f"data:{mime};base64,{b64}"
    return ExecutionResult(
        kind="json",
        message=f"✅ Converted to Base64 ({len(b64):,} characters)",
        data={
            "base64": b64,
            "data_uri": data_uri,
            "mime_type": mime,
            "file_size": len(raw),
            "base64_length": len(b64),
        },
    )


def _handle_base64_to_image(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please paste a Base64 string.", data={"error": "No input"})

    # Strip data URI prefix if present
    if text.startswith("data:"):
        match = re.match(r"data:([^;]+);base64,(.+)", text, re.DOTALL)
        if match:
            mime, text = match.group(1), match.group(2)
        else:
            text = text.split(",", 1)[-1]

    try:
        raw = base64.b64decode(text.strip())
    except Exception:
        return ExecutionResult(kind="json", message="Invalid Base64 string. Please check your input.", data={"error": "Invalid base64"})

    # Try to detect image format
    out_path = job_dir / "decoded_image.png"
    try:
        img = Image.open(io.BytesIO(raw))
        img.save(str(out_path), "PNG")
    except Exception:
        out_path.write_bytes(raw)

    return ExecutionResult(kind="file", message="✅ Base64 decoded to image successfully!", output_path=out_path, filename="decoded_image.png", content_type="image/png")


# ─── Bulk Image Compressor ────────────────────────────────────────────────────

def _handle_bulk_image_compressor(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    import zipfile
    if not files:
        return ExecutionResult(kind="json", message="Please upload image files to compress.", data={"error": "No files"})

    quality = coerce_quality(payload.get("quality"), 75)
    quality = max(10, min(95, quality))

    results = []
    zip_path = job_dir / "compressed_images.zip"

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            try:
                original_size = f.stat().st_size
                img = Image.open(str(f))
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")

                out_name = f"compressed_{f.name}"
                if not out_name.lower().endswith((".jpg", ".jpeg")):
                    out_name = out_name.rsplit(".", 1)[0] + ".jpg"

                out_path = job_dir / out_name
                img.save(str(out_path), "JPEG", quality=quality, optimize=True)
                compressed_size = out_path.stat().st_size
                reduction = round((1 - compressed_size / original_size) * 100, 1)

                zf.write(out_path, out_name)
                results.append({
                    "file": f.name,
                    "original_kb": round(original_size / 1024, 1),
                    "compressed_kb": round(compressed_size / 1024, 1),
                    "reduction_percent": reduction,
                })
            except Exception as e:
                results.append({"file": f.name, "error": str(e)[:100]})

    total_original = sum(r.get("original_kb", 0) for r in results)
    total_compressed = sum(r.get("compressed_kb", 0) for r in results)
    total_reduction = round((1 - total_compressed / total_original) * 100, 1) if total_original else 0

    return ExecutionResult(
        kind="file",
        message=f"✅ Compressed {len(files)} images — {total_reduction}% total reduction",
        output_path=zip_path,
        filename="compressed_images.zip",
        content_type="application/zip",
        data={"results": results, "total_original_kb": total_original, "total_compressed_kb": total_compressed, "total_reduction_percent": total_reduction},
    )


# ─── Network Tools ────────────────────────────────────────────────────────────

def _handle_ip_lookup(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    target = _coerce_str(payload.get("ip", payload.get("text")))
    try:
        if not target:
            # Get user's own IP
            resp = httpx.get("https://ipapi.co/json/", timeout=10)
            data = resp.json()
        else:
            resp = httpx.get(f"https://ipapi.co/{target}/json/", timeout=10)
            data = resp.json()

        result = {
            "ip": data.get("ip", "N/A"),
            "city": data.get("city", "N/A"),
            "region": data.get("region", "N/A"),
            "country": data.get("country_name", "N/A"),
            "country_code": data.get("country_code", "N/A"),
            "postal": data.get("postal", "N/A"),
            "latitude": data.get("latitude", "N/A"),
            "longitude": data.get("longitude", "N/A"),
            "timezone": data.get("timezone", "N/A"),
            "isp": data.get("org", "N/A"),
            "asn": data.get("asn", "N/A"),
            "currency": data.get("currency", "N/A"),
            "languages": data.get("languages", "N/A"),
        }

        ip = result["ip"]
        city = result["city"]
        country = result["country"]
        return ExecutionResult(kind="json", message=f"✅ IP {ip} is located in {city}, {country}", data=result)
    except Exception as e:
        return ExecutionResult(kind="json", message=f"IP lookup failed: {str(e)[:100]}", data={"error": str(e)[:200]})


def _handle_dns_lookup(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    domain = _coerce_str(payload.get("domain", payload.get("text"))).lower()
    if not domain:
        return ExecutionResult(kind="json", message="Please enter a domain name.", data={"error": "No domain"})
    domain = domain.replace("http://", "").replace("https://", "").split("/")[0]

    try:
        import socket
        results = {}

        # A record
        try:
            a_records = socket.getaddrinfo(domain, None, socket.AF_INET)
            results["A"] = list(set(r[4][0] for r in a_records))
        except Exception:
            results["A"] = []

        # AAAA record
        try:
            aaaa_records = socket.getaddrinfo(domain, None, socket.AF_INET6)
            results["AAAA"] = list(set(r[4][0] for r in aaaa_records))
        except Exception:
            results["AAAA"] = []

        # Use external API for more records
        try:
            resp = httpx.get(f"https://dns.google/resolve?name={domain}&type=MX", timeout=8)
            mx_data = resp.json()
            results["MX"] = [a.get("data", "") for a in mx_data.get("Answer", [])]
        except Exception:
            results["MX"] = []

        try:
            resp = httpx.get(f"https://dns.google/resolve?name={domain}&type=TXT", timeout=8)
            txt_data = resp.json()
            results["TXT"] = [a.get("data", "") for a in txt_data.get("Answer", [])]
        except Exception:
            results["TXT"] = []

        try:
            resp = httpx.get(f"https://dns.google/resolve?name={domain}&type=NS", timeout=8)
            ns_data = resp.json()
            results["NS"] = [a.get("data", "") for a in ns_data.get("Answer", [])]
        except Exception:
            results["NS"] = []

        return ExecutionResult(kind="json", message=f"✅ DNS records for {domain}", data={"domain": domain, "records": results})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"DNS lookup failed: {str(e)[:100]}", data={"error": str(e)[:200]})


def _handle_whois_lookup(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    domain = _coerce_str(payload.get("domain", payload.get("text"))).lower()
    if not domain:
        return ExecutionResult(kind="json", message="Please enter a domain name.", data={"error": "No domain"})
    domain = domain.replace("http://", "").replace("https://", "").split("/")[0]

    try:
        resp = httpx.get(f"https://api.whois.vu/?q={domain}", timeout=10, headers={"User-Agent": "ishu-tools/1.0"})
        data = resp.json()
        return ExecutionResult(kind="json", message=f"✅ WHOIS data for {domain}", data={"domain": domain, "whois": data})
    except Exception:
        try:
            # Fallback: basic info via DNS
            results = {"domain": domain, "note": "Full WHOIS data unavailable. Showing DNS info."}
            resp = httpx.get(f"https://dns.google/resolve?name={domain}&type=SOA", timeout=8)
            soa_data = resp.json()
            results["soa"] = [a.get("data", "") for a in soa_data.get("Answer", [])]
            return ExecutionResult(kind="json", message=f"ℹ️ Partial info for {domain}", data=results)
        except Exception as e:
            return ExecutionResult(kind="json", message=f"WHOIS lookup failed: {str(e)[:100]}", data={"error": str(e)[:200]})


def _handle_ssl_checker(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    domain = _coerce_str(payload.get("domain", payload.get("text"))).lower()
    if not domain:
        return ExecutionResult(kind="json", message="Please enter a domain name.", data={"error": "No domain"})
    domain = domain.replace("http://", "").replace("https://", "").split("/")[0]

    try:
        import ssl
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=domain) as s:
            s.settimeout(10)
            s.connect((domain, 443))
            cert = s.getpeercert()

        not_before = cert.get("notBefore", "")
        not_after = cert.get("notAfter", "")
        subject = dict(x[0] for x in cert.get("subject", []))
        issuer = dict(x[0] for x in cert.get("issuer", []))

        # Parse expiry date
        try:
            expiry = datetime.strptime(not_after, "%b %d %H:%M:%S %Y %Z")
            days_remaining = (expiry - datetime.utcnow()).days
            expiry_str = expiry.strftime("%d %B %Y")
        except Exception:
            days_remaining = None
            expiry_str = not_after

        status = "Valid" if days_remaining is not None and days_remaining > 0 else "Expired"
        emoji = "🔒" if status == "Valid" else "⚠️"

        return ExecutionResult(
            kind="json",
            message=f"{emoji} SSL certificate for {domain} is {status}",
            data={
                "domain": domain,
                "status": status,
                "valid_from": not_before,
                "valid_to": expiry_str,
                "days_remaining": days_remaining,
                "common_name": subject.get("commonName", "N/A"),
                "organization": subject.get("organizationName", "N/A"),
                "issuer": issuer.get("organizationName", "N/A"),
                "issuer_cn": issuer.get("commonName", "N/A"),
                "san": cert.get("subjectAltName", []),
            },
        )
    except ssl.SSLCertVerificationError:
        return ExecutionResult(kind="json", message=f"⚠️ SSL certificate verification failed for {domain}", data={"domain": domain, "status": "Invalid/Untrusted"})
    except ConnectionRefusedError:
        return ExecutionResult(kind="json", message=f"❌ Could not connect to {domain} on port 443. HTTPS may not be enabled.", data={"domain": domain, "status": "No HTTPS"})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"SSL check failed: {str(e)[:100]}", data={"error": str(e)[:200]})


# ─── Text Tools ───────────────────────────────────────────────────────────────

def _handle_word_frequency(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please enter text to analyze.", data={"error": "No text"})

    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    from collections import Counter
    freq = Counter(words)
    total_words = len(words)
    unique_words = len(freq)

    top_50 = freq.most_common(50)
    freq_list = [{"word": w, "count": c, "percent": round(c / total_words * 100, 2)} for w, c in top_50]

    return ExecutionResult(
        kind="json",
        message=f"✅ Analyzed {total_words:,} words, {unique_words:,} unique",
        data={
            "total_words": total_words,
            "unique_words": unique_words,
            "total_chars": len(text),
            "sentences": len(re.split(r'[.!?]+', text)),
            "frequency": freq_list,
        },
    )


def _handle_text_to_morse(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please enter text to convert.", data={"error": "No input"})

    MORSE_CODE = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
        "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
        '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
        '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
        ' ': '/',
    }

    mode = payload.get("mode", "text-to-morse")

    if mode == "morse-to-text":
        REVERSE_MORSE = {v: k for k, v in MORSE_CODE.items()}
        words = text.split(" / ")
        decoded = []
        for word in words:
            letters = word.strip().split()
            decoded.append("".join(REVERSE_MORSE.get(l, "?") for l in letters))
        result = " ".join(decoded)
        return ExecutionResult(kind="json", message=f"✅ Decoded Morse code", data={"input": text, "output": result, "mode": "morse-to-text"})
    else:
        morse = " ".join(MORSE_CODE.get(c.upper(), "?") for c in text)
        return ExecutionResult(kind="json", message=f"✅ Converted to Morse code", data={"input": text, "output": morse, "mode": "text-to-morse"})


def _handle_roman_numeral(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = _coerce_str(payload.get("text", payload.get("number")))
    if not text:
        return ExecutionResult(kind="json", message="Please enter a number or Roman numeral.", data={"error": "No input"})

    def to_roman(n: int) -> str:
        val = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
        syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I']
        result = ''
        for v, s in zip(val, syms):
            while n >= v:
                result += s
                n -= v
        return result

    def from_roman(s: str) -> int:
        vals = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
        result = 0
        prev = 0
        for c in reversed(s.upper()):
            curr = vals.get(c, 0)
            if curr < prev:
                result -= curr
            else:
                result += curr
            prev = curr
        return result

    # Detect if input is Roman numeral or number
    if re.match(r'^[IVXLCDMivxlcdm]+$', text):
        number = from_roman(text)
        return ExecutionResult(kind="json", message=f"✅ {text.upper()} = {number:,}", data={"input": text.upper(), "output": number, "mode": "roman-to-number"})
    else:
        try:
            n = int(text.replace(",", ""))
            if n < 1 or n > 3999999:
                return ExecutionResult(kind="json", message="Please enter a number between 1 and 3,999,999.", data={"error": "Out of range"})
            roman = to_roman(n)
            return ExecutionResult(kind="json", message=f"✅ {n:,} = {roman}", data={"input": n, "output": roman, "mode": "number-to-roman"})
        except ValueError:
            return ExecutionResult(kind="json", message="Please enter a valid number or Roman numeral.", data={"error": "Invalid input"})


def _handle_ascii_art(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please enter text to convert to ASCII art.", data={"error": "No input"})

    # Simple ASCII art using block letters
    BLOCK = {
        'A': ['  #  ','##  ##','#####','##  ##','##  ##'],
        'B': ['#### ','##  ##','#### ','##  ##','#### '],
        'C': [' ####','##   ','##   ','##   ',' ####'],
        'D': ['#### ','##  ##','##  ##','##  ##','#### '],
        'E': ['#####','##   ','###  ','##   ','#####'],
        'F': ['#####','##   ','###  ','##   ','##   '],
        'G': [' ####','##   ','## ###','##  ##',' ####'],
        'H': ['##  ##','##  ##','######','##  ##','##  ##'],
        'I': ['#####',' ##  ',' ##  ',' ##  ','#####'],
        'J': ['  ###','   ##','   ##','##  ##',' ####'],
        'K': ['##  ##','## ## ','###  ','## ## ','##  ##'],
        'L': ['##   ','##   ','##   ','##   ','#####'],
        'M': ['##   ##','### ###','#######','##   ##','##   ##'],
        'N': ['##   ##','### ##','## ###','##   ##','##   ##'],
        'O': [' ####','##  ##','##  ##','##  ##',' ####'],
        'P': ['#### ','##  ##','#### ','##   ','##   '],
        'Q': [' ####','##  ##','##  ##','## ## ',' ## ##'],
        'R': ['#### ','##  ##','#### ','##  ##','##  ##'],
        'S': [' ####','##   ',' #### ','   ##','####'],
        'T': ['#####',' ##  ',' ##  ',' ##  ',' ##  '],
        'U': ['##  ##','##  ##','##  ##','##  ##',' ####'],
        'V': ['##  ##','##  ##','##  ##',' #### ',' ## '],
        'W': ['##   ##','##   ##','## # ##','### ###','##   ##'],
        'X': ['##  ##',' #### ',' ##   ',' #### ','##  ##'],
        'Y': ['##  ##',' #### ',' ##  ',' ##  ',' ##  '],
        'Z': ['######','   ## ','  ##  ',' ##   ','######'],
        ' ': ['     ','     ','     ','     ','     '],
        '0': [' ### ','##  ##','## ###','### ##',' ### '],
        '1': ['  ## ',' ### ','  ## ','  ## ',' #### '],
        '2': [' ### ','##  ##','  ## ',' ##  ','######'],
        '3': ['#####','   ##','  ###','   ##','#####'],
        '4': ['##  ##','##  ##','######','   ##','   ##'],
        '5': ['######','##   ','######','   ##','#####'],
        '6': [' ####','##   ','#####','##  ##',' ####'],
        '7': ['######','   ##','  ##  ',' ##  ',' ##  '],
        '8': [' ####','##  ##',' ####','##  ##',' ####'],
        '9': [' ####','##  ##',' #####','   ##',' ####'],
        '!': [' ## ',' ## ',' ## ','    ',' ## '],
        '?': [' ### ','##  ##','  ## ','     ',' ##  '],
        '.': ['    ','    ','    ','    ',' ## '],
    }

    text_upper = text.upper()[:20]  # Limit to 20 chars
    lines = ['', '', '', '', '']

    for char in text_upper:
        pattern = BLOCK.get(char, ['?????','?????','?????','?????','?????'])
        for i, line in enumerate(pattern):
            lines[i] += line + '  '

    ascii_art = '\n'.join(lines)
    return ExecutionResult(kind="json", message="✅ ASCII art generated!", data={"input": text, "ascii_art": ascii_art})


def _handle_grammar_checker(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please enter text to check grammar.", data={"error": "No text"})

    try:
        resp = httpx.post(
            "https://api.languagetool.org/v2/check",
            data={"text": text[:5000], "language": "en-US"},
            timeout=15,
        )
        data = resp.json()
        matches = data.get("matches", [])

        issues = []
        for m in matches[:50]:
            replacements = [r["value"] for r in m.get("replacements", [])[:3]]
            issues.append({
                "message": m.get("message", ""),
                "short_message": m.get("shortMessage", ""),
                "offset": m.get("offset", 0),
                "length": m.get("length", 0),
                "context": m.get("context", {}).get("text", ""),
                "replacements": replacements,
                "rule": m.get("rule", {}).get("id", ""),
                "category": m.get("rule", {}).get("category", {}).get("name", ""),
            })

        score = max(0, 100 - len(matches) * 5)
        grade = "Excellent" if score >= 90 else "Good" if score >= 75 else "Fair" if score >= 60 else "Needs Work"

        return ExecutionResult(
            kind="json",
            message=f"✅ Found {len(matches)} issue{'s' if len(matches) != 1 else ''}. Writing score: {score}/100 ({grade})",
            data={"issues": issues, "total_issues": len(matches), "score": score, "grade": grade, "word_count": len(text.split())},
        )
    except Exception as e:
        return ExecutionResult(kind="json", message="Grammar check service temporarily unavailable.", data={"error": str(e)[:200]})


# ─── Math Tools ───────────────────────────────────────────────────────────────

def _handle_fibonacci(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = _coerce_str(payload.get("text", payload.get("n")), "10")
    try:
        n = int(text)
        if n < 1 or n > 100:
            return ExecutionResult(kind="json", message="Please enter a number between 1 and 100.", data={"error": "Out of range"})
    except ValueError:
        return ExecutionResult(kind="json", message="Please enter a valid number.", data={"error": "Invalid input"})

    fib = [0, 1]
    for _ in range(n - 2):
        fib.append(fib[-1] + fib[-2])
    fib = fib[:n]

    return ExecutionResult(
        kind="json",
        message=f"✅ First {n} Fibonacci numbers generated",
        data={"n": n, "sequence": fib, "sum": sum(fib), "last": fib[-1]},
    )


def _handle_prime_checker(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    raw = payload.get("text", payload.get("number", payload.get("value", "")))
    text = str(raw).strip() if raw is not None else ""
    if not text:
        return ExecutionResult(kind="json", message="Please enter a number to check.", data={"error": "No input"})

    try:
        n = int(text.replace(",", ""))
    except ValueError:
        return ExecutionResult(kind="json", message="Please enter a valid integer.", data={"error": "Invalid input"})

    def is_prime(num: int) -> bool:
        if num < 2: return False
        if num == 2: return True
        if num % 2 == 0: return False
        for i in range(3, int(num**0.5) + 1, 2):
            if num % i == 0: return False
        return True

    def factorize(num: int) -> list:
        factors = []
        d = 2
        while d * d <= num:
            while num % d == 0:
                factors.append(d)
                num //= d
            d += 1
        if num > 1:
            factors.append(num)
        return factors

    def next_prime(num: int) -> int:
        n2 = num + 1
        while not is_prime(n2):
            n2 += 1
        return n2

    prime = is_prime(n)
    factors = factorize(n) if not prime and n > 1 else []
    np = next_prime(n)

    return ExecutionResult(
        kind="json",
        message=f"{'✅' if prime else 'ℹ️'} {n:,} is {'a prime number!' if prime else 'NOT a prime number.'}",
        data={
            "number": n,
            "is_prime": prime,
            "prime_factors": factors,
            "next_prime": np,
            "divisors": [i for i in range(1, min(n + 1, 1001)) if n % i == 0] if n <= 10000 else "Too large to show all divisors",
        },
    )


def _handle_statistics_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = _coerce_str(payload.get("text", payload.get("data")))
    if not text:
        return ExecutionResult(kind="json", message="Please enter numbers separated by commas or spaces.", data={"error": "No data"})

    nums_raw = re.findall(r'-?\d+\.?\d*', text)
    if not nums_raw:
        return ExecutionResult(kind="json", message="No valid numbers found. Please enter numbers separated by commas.", data={"error": "No numbers"})

    nums = [float(x) for x in nums_raw]
    n = len(nums)
    s = sorted(nums)

    mean = sum(nums) / n
    median = (s[n//2 - 1] + s[n//2]) / 2 if n % 2 == 0 else s[n//2]

    from collections import Counter
    freq = Counter(nums)
    max_freq = max(freq.values())
    mode = [k for k, v in freq.items() if v == max_freq]

    variance = sum((x - mean) ** 2 for x in nums) / n
    std_dev = math.sqrt(variance)
    sample_variance = sum((x - mean) ** 2 for x in nums) / (n - 1) if n > 1 else 0
    sample_std = math.sqrt(sample_variance) if n > 1 else 0

    q1 = s[n//4]
    q3 = s[3*n//4]
    iqr = q3 - q1

    return ExecutionResult(
        kind="json",
        message=f"✅ Statistical analysis of {n} numbers",
        data={
            "count": n,
            "sum": sum(nums),
            "mean": round(mean, 6),
            "median": round(median, 6),
            "mode": mode,
            "min": min(nums),
            "max": max(nums),
            "range": max(nums) - min(nums),
            "variance_population": round(variance, 6),
            "std_dev_population": round(std_dev, 6),
            "variance_sample": round(sample_variance, 6),
            "std_dev_sample": round(sample_std, 6),
            "q1": round(q1, 6),
            "q3": round(q3, 6),
            "iqr": round(iqr, 6),
            "sorted_data": s,
        },
    )


def _handle_matrix_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    operation = payload.get("operation", "multiply")
    m1_raw = payload.get("matrix1", "1,0;0,1")
    m2_raw = payload.get("matrix2", "")

    def parse_matrix(s: str) -> list:
        rows = s.strip().split(";")
        return [[float(x) for x in re.findall(r'-?\d+\.?\d*', r)] for r in rows if r.strip()]

    try:
        m1 = parse_matrix(m1_raw)
        if not m1:
            return ExecutionResult(kind="json", message="Please enter a valid matrix. Use comma for columns and semicolon for rows. Example: 1,2;3,4", data={"error": "Invalid matrix"})

        if operation == "transpose":
            result = [[m1[j][i] for j in range(len(m1))] for i in range(len(m1[0]))]
            return ExecutionResult(kind="json", message="✅ Transpose calculated", data={"operation": "transpose", "input": m1, "result": result})

        elif operation == "determinant":
            if len(m1) != len(m1[0]):
                return ExecutionResult(kind="json", message="Determinant requires a square matrix.", data={"error": "Not square"})
            n = len(m1)
            if n == 2:
                det = m1[0][0]*m1[1][1] - m1[0][1]*m1[1][0]
            elif n == 3:
                a, b, c = m1[0]; d, e, f = m1[1]; g, h, i = m1[2]
                det = a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g)
            else:
                det = "N/A (only 2x2 and 3x3 supported)"
            return ExecutionResult(kind="json", message=f"✅ Determinant = {det}", data={"operation": "determinant", "input": m1, "result": det})

        elif operation in ("add", "subtract"):
            m2 = parse_matrix(m2_raw)
            if len(m1) != len(m2) or len(m1[0]) != len(m2[0]):
                return ExecutionResult(kind="json", message="Matrices must have the same dimensions for addition/subtraction.", data={"error": "Dimension mismatch"})
            sign = 1 if operation == "add" else -1
            result = [[m1[i][j] + sign * m2[i][j] for j in range(len(m1[0]))] for i in range(len(m1))]
            return ExecutionResult(kind="json", message=f"✅ Matrix {operation}ion completed", data={"operation": operation, "matrix1": m1, "matrix2": m2, "result": result})

        else:  # multiply
            m2 = parse_matrix(m2_raw) if m2_raw else m1
            if len(m1[0]) != len(m2):
                return ExecutionResult(kind="json", message="For multiplication, columns of Matrix A must equal rows of Matrix B.", data={"error": "Dimension mismatch"})
            rows, cols, inner = len(m1), len(m2[0]), len(m2)
            result = [[sum(m1[i][k] * m2[k][j] for k in range(inner)) for j in range(cols)] for i in range(rows)]
            return ExecutionResult(kind="json", message="✅ Matrix multiplication completed", data={"operation": "multiply", "matrix1": m1, "matrix2": m2, "result": result})

    except Exception as e:
        return ExecutionResult(kind="json", message=f"Matrix calculation failed: {str(e)[:100]}", data={"error": str(e)[:200]})


def _handle_equation_solver(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    equation = _coerce_str(payload.get("text", payload.get("equation")))
    if not equation:
        return ExecutionResult(kind="json", message="Please enter an equation to solve. Example: x^2 + 5x + 6 = 0", data={"error": "No equation"})

    # Solve quadratic: ax^2 + bx + c = 0
    # Normalize
    eq = equation.lower().replace(" ", "").replace("^", "**")
    if "=" in eq:
        left, right = eq.split("=", 1)
        eq = f"({left})-({right})"

    # Try quadratic pattern
    quad_match = re.match(r'^([+-]?\d*\.?\d*)\*?\*?x\*\*2([+-]\d*\.?\d*)\*?x([+-]\d+\.?\d*)$', eq)
    if quad_match:
        a = float(quad_match.group(1) or 1)
        b = float(quad_match.group(2))
        c = float(quad_match.group(3))
    else:
        # Try to extract coefficients
        a_m = re.search(r'([+-]?\d*\.?\d*)\*?x\*\*2', eq)
        b_m = re.search(r'([+-]?\d+\.?\d*)\*?x(?!\*)', eq)
        c_m = re.search(r'([+-]?\d+\.?\d*)(?![x\*])', eq)

        try:
            a = float(a_m.group(1) or 1) if a_m else 0
            b = float(b_m.group(1)) if b_m else 0
            c_str = c_m.group(1) if c_m else "0"
            c = float(c_str)
        except Exception:
            return ExecutionResult(
                kind="json",
                message="Could not parse equation. Please use format: ax² + bx + c = 0 or x + 5 = 10",
                data={"error": "Parse failed", "example": "x^2 + 5x + 6 = 0 or 2x + 4 = 10"},
            )

    steps = []

    if a == 0:
        # Linear: bx + c = 0
        if b == 0:
            if c == 0:
                return ExecutionResult(kind="json", message="All values satisfy the equation (0 = 0).", data={"type": "identity"})
            else:
                return ExecutionResult(kind="json", message="No solution exists.", data={"type": "no-solution"})
        x = -c / b
        steps = [f"Linear equation: {b}x + {c} = 0", f"x = -{c}/{b}", f"x = {round(x, 6)}"]
        return ExecutionResult(kind="json", message=f"✅ x = {round(x, 6)}", data={"type": "linear", "a": a, "b": b, "c": c, "solutions": [round(x, 6)], "steps": steps})

    discriminant = b**2 - 4*a*c
    steps = [
        f"Quadratic equation: {a}x² + {b}x + {c} = 0",
        f"Using quadratic formula: x = (-b ± √(b²-4ac)) / 2a",
        f"Discriminant = {b}² - 4×{a}×{c} = {discriminant}",
    ]

    if discriminant > 0:
        x1 = (-b + math.sqrt(discriminant)) / (2*a)
        x2 = (-b - math.sqrt(discriminant)) / (2*a)
        steps.append(f"x₁ = ({-b} + {round(math.sqrt(discriminant), 4)}) / {2*a} = {round(x1, 6)}")
        steps.append(f"x₂ = ({-b} - {round(math.sqrt(discriminant), 4)}) / {2*a} = {round(x2, 6)}")
        msg = f"✅ Two real roots: x₁ = {round(x1, 6)}, x₂ = {round(x2, 6)}"
        solutions = [round(x1, 6), round(x2, 6)]
    elif discriminant == 0:
        x = -b / (2*a)
        steps.append(f"x = {-b} / {2*a} = {round(x, 6)} (repeated root)")
        msg = f"✅ One repeated root: x = {round(x, 6)}"
        solutions = [round(x, 6)]
    else:
        real = -b / (2*a)
        imag = math.sqrt(-discriminant) / (2*a)
        steps.append(f"Complex roots: x = {round(real, 4)} ± {round(imag, 4)}i")
        msg = f"ℹ️ Complex roots: x = {round(real, 4)} ± {round(imag, 4)}i"
        solutions = [f"{round(real, 4)} + {round(imag, 4)}i", f"{round(real, 4)} - {round(imag, 4)}i"]

    return ExecutionResult(
        kind="json",
        message=msg,
        data={"type": "quadratic", "a": a, "b": b, "c": c, "discriminant": discriminant, "solutions": solutions, "steps": steps},
    )


# ─── Finance Tools ────────────────────────────────────────────────────────────

def _handle_currency_converter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    amount = float(payload.get("amount", 1))
    from_currency = payload.get("from", payload.get("from_currency", "USD")).upper()
    to_currency = payload.get("to", payload.get("to_currency", "INR")).upper()

    try:
        resp = httpx.get(f"https://api.exchangerate-api.com/v4/latest/{from_currency}", timeout=10)
        data = resp.json()
        rates = data.get("rates", {})
        if to_currency not in rates:
            return ExecutionResult(kind="json", message=f"Currency {to_currency} not found.", data={"error": "Currency not found"})
        rate = rates[to_currency]
        converted = amount * rate
        return ExecutionResult(
            kind="json",
            message=f"✅ {amount:,.2f} {from_currency} = {converted:,.4f} {to_currency}",
            data={
                "from": from_currency, "to": to_currency,
                "amount": amount, "rate": rate,
                "converted": round(converted, 4),
                "inverse_rate": round(1/rate, 6),
                "timestamp": data.get("time_last_updated", ""),
            },
        )
    except Exception:
        # Fallback with static INR rates
        STATIC_RATES = {
            "USD": 83.5, "EUR": 90.2, "GBP": 106.0, "AED": 22.7,
            "SGD": 62.0, "CAD": 61.5, "AUD": 54.0, "JPY": 0.56,
            "CNY": 11.6, "CHF": 94.0, "SAR": 22.3, "MYR": 18.2,
        }
        if from_currency == "INR" and to_currency in STATIC_RATES:
            rate = 1 / STATIC_RATES[to_currency]
        elif to_currency == "INR" and from_currency in STATIC_RATES:
            rate = STATIC_RATES[from_currency]
        else:
            return ExecutionResult(kind="json", message="Currency conversion service unavailable. Please try again.", data={"error": "Service unavailable"})

        converted = amount * rate
        return ExecutionResult(
            kind="json",
            message=f"✅ {amount:,.2f} {from_currency} ≈ {converted:,.2f} {to_currency} (approximate)",
            data={"from": from_currency, "to": to_currency, "amount": amount, "rate": round(rate, 6), "converted": round(converted, 2), "note": "Approximate rate — live rates unavailable"},
        )


def _handle_gst_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    amount_raw = payload.get("amount", "0")
    gst_rate_raw = payload.get("gst_rate", "18")
    calc_type = payload.get("type", "exclusive")

    # Parse from text if needed
    if text:
        nums = re.findall(r'\d+\.?\d*', text)
        if len(nums) >= 1: amount_raw = nums[0]
        if len(nums) >= 2: gst_rate_raw = nums[1]

    try:
        amount = float(amount_raw)
        gst_rate = float(gst_rate_raw)
    except ValueError:
        return ExecutionResult(kind="json", message="Please enter valid amount and GST rate.", data={"error": "Invalid input"})

    if calc_type == "inclusive":
        original = amount * 100 / (100 + gst_rate)
        gst_amount = amount - original
    else:
        original = amount
        gst_amount = amount * gst_rate / 100

    total = original + gst_amount
    cgst = gst_amount / 2
    sgst = gst_amount / 2

    return ExecutionResult(
        kind="json",
        message=f"✅ GST @ {gst_rate}%: ₹{gst_amount:,.2f} | Total: ₹{total:,.2f}",
        data={
            "amount": round(original, 2),
            "gst_rate": gst_rate,
            "gst_amount": round(gst_amount, 2),
            "cgst": round(cgst, 2),
            "sgst": round(sgst, 2),
            "total": round(total, 2),
            "type": calc_type,
        },
    )


def _handle_fuel_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    distance = float(payload.get("distance", 100))
    fuel_price = float(payload.get("fuel_price", 100))
    mileage = float(payload.get("mileage", 15))

    if text:
        nums = re.findall(r'\d+\.?\d*', text)
        if len(nums) >= 1: distance = float(nums[0])
        if len(nums) >= 2: fuel_price = float(nums[1])
        if len(nums) >= 3: mileage = float(nums[2])

    if mileage <= 0:
        return ExecutionResult(kind="json", message="Mileage must be greater than 0.", data={"error": "Invalid mileage"})

    fuel_required = distance / mileage
    total_cost = fuel_required * fuel_price
    cost_per_km = total_cost / distance if distance > 0 else 0

    return ExecutionResult(
        kind="json",
        message=f"✅ Trip cost: ₹{total_cost:,.2f} | Fuel needed: {fuel_required:.2f} L",
        data={
            "distance_km": distance,
            "fuel_price_per_liter": fuel_price,
            "mileage_kmpl": mileage,
            "fuel_required_liters": round(fuel_required, 2),
            "total_cost": round(total_cost, 2),
            "cost_per_km": round(cost_per_km, 2),
        },
    )


def _handle_emi_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    principal = float(payload.get("principal", payload.get("loan_amount", 500000)))
    annual_rate = float(payload.get("rate", payload.get("interest_rate", 8.5)))
    tenure_months = int(payload.get("tenure", payload.get("tenure_months", 60)))

    text = payload.get("text", "").strip()
    if text:
        nums = re.findall(r'\d+\.?\d*', text)
        if len(nums) >= 1: principal = float(nums[0])
        if len(nums) >= 2: annual_rate = float(nums[1])
        if len(nums) >= 3: tenure_months = int(float(nums[2]))

    if annual_rate <= 0 or tenure_months <= 0 or principal <= 0:
        return ExecutionResult(kind="json", message="Please enter valid loan amount, rate, and tenure.", data={"error": "Invalid input"})

    r = annual_rate / 12 / 100
    emi = principal * r * (1 + r)**tenure_months / ((1 + r)**tenure_months - 1)
    total_amount = emi * tenure_months
    total_interest = total_amount - principal

    # Amortization schedule (first 12 months)
    schedule = []
    balance = principal
    for i in range(1, min(tenure_months + 1, 13)):
        interest_paid = balance * r
        principal_paid = emi - interest_paid
        balance -= principal_paid
        schedule.append({
            "month": i,
            "emi": round(emi, 2),
            "principal": round(principal_paid, 2),
            "interest": round(interest_paid, 2),
            "balance": round(max(0, balance), 2),
        })

    return ExecutionResult(
        kind="json",
        message=f"✅ Monthly EMI: ₹{emi:,.2f} | Total Interest: ₹{total_interest:,.2f}",
        data={
            "loan_amount": principal,
            "annual_rate": annual_rate,
            "tenure_months": tenure_months,
            "emi": round(emi, 2),
            "total_amount": round(total_amount, 2),
            "total_interest": round(total_interest, 2),
            "first_year_schedule": schedule,
        },
    )


def _handle_sip_calculator_india(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    monthly = float(payload.get("monthly_investment", payload.get("amount", 5000)))
    annual_return = float(payload.get("annual_return", payload.get("rate", 12)))
    years = float(payload.get("years", payload.get("tenure", 10)))

    if monthly <= 0 or years <= 0 or annual_return < 0:
        return ExecutionResult(kind="json", message="Please enter valid monthly investment, return, and years.", data={"error": "Invalid input"})

    months = int(round(years * 12))
    monthly_rate = annual_return / 12 / 100
    invested = monthly * months
    if monthly_rate == 0:
        maturity = invested
    else:
        maturity = monthly * (((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate)
    gains = maturity - invested

    yearly_projection = []
    for year in range(1, int(years) + 1):
        n = year * 12
        value = monthly * (((1 + monthly_rate) ** n - 1) / monthly_rate) * (1 + monthly_rate) if monthly_rate else monthly * n
        yearly_projection.append({"year": year, "invested": round(monthly * n, 2), "value": round(value, 2), "gains": round(value - monthly * n, 2)})

    return ExecutionResult(
        kind="json",
        message=f"SIP maturity: ₹{maturity:,.2f} | Wealth gain: ₹{gains:,.2f}",
        data={
            "monthly_investment": round(monthly, 2),
            "annual_return_percent": annual_return,
            "years": years,
            "total_invested": round(invested, 2),
            "estimated_returns": round(gains, 2),
            "maturity_value": round(maturity, 2),
            "yearly_projection": yearly_projection,
            "note": "SIP returns are market-linked estimates, not guaranteed.",
        },
    )


def _handle_income_tax_calculator_india(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    income = float(payload.get("income", payload.get("annual_income", 900000)))
    deductions = float(payload.get("deductions", 0))
    regime = payload.get("regime", "new").lower()

    if income < 0 or deductions < 0:
        return ExecutionResult(kind="json", message="Income and deductions cannot be negative.", data={"error": "Invalid input"})

    def slab_tax(taxable: float, slabs: list[tuple[float, float]]) -> float:
        tax = 0.0
        previous = 0.0
        for limit, rate in slabs:
            if taxable > previous:
                taxable_part = min(taxable, limit) - previous
                tax += taxable_part * rate
                previous = limit
            else:
                break
        return tax

    if regime == "old":
        taxable = max(0, income - deductions - 50000)
        slabs = [(250000, 0), (500000, 0.05), (1000000, 0.20), (float("inf"), 0.30)]
        rebate_limit = 500000
        standard_deduction = 50000
    else:
        taxable = max(0, income - 75000)
        slabs = [(300000, 0), (700000, 0.05), (1000000, 0.10), (1200000, 0.15), (1500000, 0.20), (float("inf"), 0.30)]
        rebate_limit = 700000
        standard_deduction = 75000

    base_tax = slab_tax(taxable, slabs)
    if taxable <= rebate_limit:
        base_tax = 0
    cess = base_tax * 0.04
    total_tax = base_tax + cess
    monthly_tax = total_tax / 12

    return ExecutionResult(
        kind="json",
        message=f"Estimated tax ({regime} regime): ₹{total_tax:,.2f}/year",
        data={
            "regime": regime,
            "annual_income": round(income, 2),
            "deductions_used": round(deductions if regime == "old" else 0, 2),
            "standard_deduction": standard_deduction,
            "taxable_income": round(taxable, 2),
            "income_tax_before_cess": round(base_tax, 2),
            "cess_4_percent": round(cess, 2),
            "total_tax": round(total_tax, 2),
            "monthly_tax": round(monthly_tax, 2),
            "note": "Estimate for Indian individual taxpayers. Surcharge and special income rules are not included.",
        },
    )


def _handle_salary_hike_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    current = float(payload.get("current_salary", payload.get("salary", 300000)))
    hike_percent = float(payload.get("hike_percent", payload.get("percent", 10)))
    bonus = float(payload.get("bonus", 0))
    if current < 0:
        return ExecutionResult(kind="json", message="Current salary cannot be negative.", data={"error": "Invalid salary"})
    new_salary = current * (1 + hike_percent / 100) + bonus
    increase = new_salary - current
    return ExecutionResult(
        kind="json",
        message=f"New salary: ₹{new_salary:,.2f} | Increase: ₹{increase:,.2f}",
        data={"current_salary": round(current, 2), "hike_percent": hike_percent, "bonus": round(bonus, 2), "new_salary": round(new_salary, 2), "increase": round(increase, 2), "monthly_new_salary": round(new_salary / 12, 2)},
    )


def _handle_discount_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    price = float(payload.get("price", payload.get("amount", 1000)))
    discount = float(payload.get("discount_percent", payload.get("discount", 10)))
    tax = float(payload.get("tax_percent", 0))
    if price < 0 or discount < 0 or tax < 0:
        return ExecutionResult(kind="json", message="Price, discount, and tax must be positive.", data={"error": "Invalid input"})
    saved = price * discount / 100
    after_discount = price - saved
    tax_amount = after_discount * tax / 100
    final_price = after_discount + tax_amount
    return ExecutionResult(
        kind="json",
        message=f"Final price: ₹{final_price:,.2f} | You save: ₹{saved:,.2f}",
        data={"original_price": round(price, 2), "discount_percent": discount, "saved": round(saved, 2), "price_after_discount": round(after_discount, 2), "tax_percent": tax, "tax_amount": round(tax_amount, 2), "final_price": round(final_price, 2)},
    )


def _handle_loan_prepayment_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    principal = float(payload.get("principal", payload.get("loan_amount", 1000000)))
    annual_rate = float(payload.get("rate", 9))
    tenure_months = int(float(payload.get("tenure_months", payload.get("tenure", 120))))
    prepayment = float(payload.get("prepayment", 100000))
    if principal <= 0 or annual_rate <= 0 or tenure_months <= 0 or prepayment < 0:
        return ExecutionResult(kind="json", message="Please enter valid loan values.", data={"error": "Invalid input"})

    r = annual_rate / 12 / 100
    emi = principal * r * (1 + r) ** tenure_months / ((1 + r) ** tenure_months - 1)
    total_interest_original = emi * tenure_months - principal
    new_principal = max(0, principal - prepayment)
    if new_principal == 0:
        new_months = 0
        new_interest = 0
    else:
        new_months = math.ceil(-math.log(1 - (new_principal * r / emi)) / math.log(1 + r)) if emi > new_principal * r else tenure_months
        new_interest = emi * new_months - new_principal
    interest_saved = max(0, total_interest_original - new_interest)
    months_saved = max(0, tenure_months - new_months)
    return ExecutionResult(
        kind="json",
        message=f"Interest saved: ₹{interest_saved:,.2f} | Tenure reduced by {months_saved} months",
        data={"emi": round(emi, 2), "original_interest": round(total_interest_original, 2), "prepayment": round(prepayment, 2), "new_principal": round(new_principal, 2), "new_tenure_months": new_months, "months_saved": months_saved, "interest_saved": round(interest_saved, 2)},
    )


def _handle_fixed_deposit_calculator_india(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    principal = float(payload.get("principal", payload.get("amount", 100000)))
    annual_rate = float(payload.get("rate", payload.get("interest_rate", 7.0)))
    years = float(payload.get("years", payload.get("tenure", 5)))
    frequency = int(float(payload.get("compound_per_year", payload.get("frequency", 4))))
    if principal <= 0 or annual_rate < 0 or years <= 0 or frequency <= 0:
        return ExecutionResult(kind="json", message="Please enter valid FD amount, rate, tenure, and compounding frequency.", data={"error": "Invalid input"})
    maturity = principal * (1 + annual_rate / (100 * frequency)) ** (frequency * years)
    interest = maturity - principal
    return ExecutionResult(
        kind="json",
        message=f"FD maturity: ₹{maturity:,.2f} | Interest earned: ₹{interest:,.2f}",
        data={"principal": round(principal, 2), "annual_rate_percent": annual_rate, "years": years, "compound_per_year": frequency, "interest_earned": round(interest, 2), "maturity_value": round(maturity, 2)},
    )


def _handle_recurring_deposit_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    monthly = float(payload.get("monthly_deposit", payload.get("amount", 5000)))
    annual_rate = float(payload.get("rate", payload.get("interest_rate", 6.5)))
    months = int(float(payload.get("months", payload.get("tenure_months", 24))))
    if monthly <= 0 or annual_rate < 0 or months <= 0:
        return ExecutionResult(kind="json", message="Please enter valid monthly deposit, rate, and months.", data={"error": "Invalid input"})
    quarterly_rate = annual_rate / 400
    maturity = 0.0
    for month in range(months):
        quarters = (months - month) / 3
        maturity += monthly * ((1 + quarterly_rate) ** quarters)
    invested = monthly * months
    interest = maturity - invested
    return ExecutionResult(
        kind="json",
        message=f"RD maturity: ₹{maturity:,.2f} | Interest earned: ₹{interest:,.2f}",
        data={"monthly_deposit": round(monthly, 2), "annual_rate_percent": annual_rate, "months": months, "total_deposit": round(invested, 2), "interest_earned": round(interest, 2), "maturity_value": round(maturity, 2)},
    )


def _handle_loan_eligibility_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    monthly_income = float(payload.get("monthly_income", 50000))
    existing_emi = float(payload.get("existing_emi", 0))
    annual_rate = float(payload.get("rate", 9))
    tenure_months = int(float(payload.get("tenure_months", 240)))
    foir_percent = float(payload.get("foir_percent", 50))
    if monthly_income <= 0 or existing_emi < 0 or annual_rate <= 0 or tenure_months <= 0 or foir_percent <= 0:
        return ExecutionResult(kind="json", message="Please enter valid income, EMI, rate, tenure, and FOIR.", data={"error": "Invalid input"})
    max_total_emi = monthly_income * foir_percent / 100
    available_emi = max(0, max_total_emi - existing_emi)
    r = annual_rate / 12 / 100
    eligible_loan = available_emi * ((1 + r) ** tenure_months - 1) / (r * (1 + r) ** tenure_months) if available_emi > 0 else 0
    return ExecutionResult(
        kind="json",
        message=f"Estimated loan eligibility: ₹{eligible_loan:,.2f} | Available EMI: ₹{available_emi:,.2f}",
        data={"monthly_income": round(monthly_income, 2), "existing_emi": round(existing_emi, 2), "foir_percent": foir_percent, "available_emi": round(available_emi, 2), "tenure_months": tenure_months, "annual_rate_percent": annual_rate, "eligible_loan_amount": round(eligible_loan, 2)},
    )


def _handle_expense_splitter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    total = float(payload.get("total_amount", payload.get("amount", 1000)))
    people = int(float(payload.get("people", 4)))
    tip_percent = float(payload.get("tip_percent", 0))
    tax_percent = float(payload.get("tax_percent", 0))
    if total < 0 or people <= 0 or tip_percent < 0 or tax_percent < 0:
        return ExecutionResult(kind="json", message="Please enter valid bill amount, people count, tip, and tax.", data={"error": "Invalid input"})
    tip = total * tip_percent / 100
    tax = total * tax_percent / 100
    grand_total = total + tip + tax
    per_person = grand_total / people
    return ExecutionResult(
        kind="json",
        message=f"Each person pays: ₹{per_person:,.2f} | Total: ₹{grand_total:,.2f}",
        data={"bill_amount": round(total, 2), "tip_amount": round(tip, 2), "tax_amount": round(tax, 2), "grand_total": round(grand_total, 2), "people": people, "per_person": round(per_person, 2)},
    )


def _handle_upi_qr_generator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    upi_id = _coerce_str(payload.get("upi_id"))
    name = _coerce_str(payload.get("name"), "ISHU TOOLS")
    amount = _coerce_str(payload.get("amount"))
    note = _coerce_str(payload.get("note"), "Payment")
    if not re.match(r"^[\w.-]+@[\w.-]+$", upi_id):
        return ExecutionResult(kind="json", message="Please enter a valid UPI ID like name@bank.", data={"error": "Invalid UPI ID"})
    params = [f"pa={upi_id}", f"pn={name}", f"tn={note}", "cu=INR"]
    if amount:
        try:
            if float(amount) <= 0:
                raise ValueError
            params.insert(2, f"am={amount}")
        except ValueError:
            return ExecutionResult(kind="json", message="Amount must be a valid positive number.", data={"error": "Invalid amount"})
    import urllib.parse
    import qrcode
    uri = "upi://pay?" + urllib.parse.urlencode(dict(item.split("=", 1) for item in params))
    img = qrcode.make(uri)
    out_path = job_dir / "upi-qr.png"
    img.save(str(out_path))
    return ExecutionResult(kind="file", message="UPI QR code generated successfully.", output_path=out_path, filename="upi-qr.png", content_type="image/png")


def _handle_wifi_qr_generator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    ssid = payload.get("ssid", "").strip()
    password = payload.get("password", "").strip()
    security = payload.get("security", "WPA").upper()
    hidden = str(payload.get("hidden", "false")).lower() == "true"
    if not ssid:
        return ExecutionResult(kind="json", message="Please enter Wi-Fi network name (SSID).", data={"error": "SSID required"})
    if security not in ("WPA", "WEP", "NOPASS"):
        security = "WPA"
    escaped_ssid = ssid.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace(":", "\\:")
    escaped_password = password.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace(":", "\\:")
    wifi_payload = f"WIFI:T:{security};S:{escaped_ssid};P:{escaped_password};H:{str(hidden).lower()};;"
    import qrcode
    img = qrcode.make(wifi_payload)
    out_path = job_dir / "wifi-qr.png"
    img.save(str(out_path))
    return ExecutionResult(kind="file", message="Wi-Fi QR code generated successfully.", output_path=out_path, filename="wifi-qr.png", content_type="image/png")


def _handle_grade_needed_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    current_grade = float(payload.get("current_grade", 70))
    target_grade = float(payload.get("target_grade", 85))
    final_weight = float(payload.get("final_weight", 40))
    if not (0 <= current_grade <= 100 and 0 <= target_grade <= 100 and 0 < final_weight <= 100):
        return ExecutionResult(kind="json", message="Grades must be 0-100 and final exam weight must be 1-100.", data={"error": "Invalid input"})
    required = (target_grade - current_grade * (1 - final_weight / 100)) / (final_weight / 100)
    status = "possible" if required <= 100 else "difficult"
    return ExecutionResult(
        kind="json",
        message=f"You need {required:.2f}% in final exam to reach {target_grade}%",
        data={"current_grade_percent": current_grade, "target_grade_percent": target_grade, "final_weight_percent": final_weight, "required_final_exam_percent": round(required, 2), "status": status, "already_safe": required <= 0},
    )


def _handle_exam_countdown_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    exam_date_raw = _coerce_str(payload.get("exam_date", payload.get("text")))
    daily_hours = float(payload.get("daily_study_hours", 3))
    if not exam_date_raw:
        return ExecutionResult(kind="json", message="Please enter exam date in YYYY-MM-DD format.", data={"error": "Exam date required"})
    try:
        exam_date = datetime.strptime(exam_date_raw, "%Y-%m-%d").date()
    except ValueError:
        return ExecutionResult(kind="json", message="Use exam date format YYYY-MM-DD, for example 2026-05-10.", data={"error": "Invalid date"})
    today = date.today()
    days_left = (exam_date - today).days
    if days_left < 0:
        return ExecutionResult(kind="json", message="Exam date is already past.", data={"error": "Past date"})
    weeks_left = days_left / 7
    study_hours = max(0, days_left * daily_hours)
    return ExecutionResult(
        kind="json",
        message=f"✅ {days_left} days left | Approx study time: {study_hours:.1f} hours",
        data={"exam_date": exam_date_raw, "today": today.isoformat(), "days_left": days_left, "weeks_left": round(weeks_left, 2), "daily_study_hours": daily_hours, "total_study_hours_available": round(study_hours, 1)},
    )


def _handle_number_to_words(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = _coerce_str(payload.get("text", payload.get("number"))).replace(",", "")
    if not text:
        return ExecutionResult(kind="json", message="Please enter a number to convert.", data={"error": "No input"})

    try:
        n = int(float(text))
    except ValueError:
        return ExecutionResult(kind="json", message="Please enter a valid number.", data={"error": "Invalid input"})

    if n < 0 or n > 999999999999:
        return ExecutionResult(kind="json", message="Please enter a number between 0 and 999,999,999,999.", data={"error": "Out of range"})

    ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
            'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
            'seventeen', 'eighteen', 'nineteen']
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

    def convert_less_than_1000(num: int) -> str:
        if num == 0: return ''
        if num < 20: return ones[num]
        if num < 100: return tens[num // 10] + (' ' + ones[num % 10] if num % 10 else '')
        return ones[num // 100] + ' hundred' + (' and ' + convert_less_than_1000(num % 100) if num % 100 else '')

    def convert(num: int) -> str:
        if num == 0: return 'zero'
        parts = []
        if num >= 1_000_000_000:
            parts.append(convert_less_than_1000(num // 1_000_000_000) + ' billion')
            num %= 1_000_000_000
        if num >= 10_000_000:
            parts.append(convert_less_than_1000(num // 10_000_000) + ' crore')
            num %= 10_000_000
        if num >= 100_000:
            parts.append(convert_less_than_1000(num // 100_000) + ' lakh')
            num %= 100_000
        if num >= 1000:
            parts.append(convert_less_than_1000(num // 1000) + ' thousand')
            num %= 1000
        if num:
            parts.append(convert_less_than_1000(num))
        return ' '.join(parts)

    words = convert(n).title()
    words_indian = convert(n)

    return ExecutionResult(
        kind="json",
        message=f"✅ {n:,} in words: {words}",
        data={"number": n, "in_words": words, "in_words_lower": words_indian, "for_cheque": f"Rupees {words} Only"},
    )


def _handle_marks_percentage_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    obtained = float(payload.get("obtained_marks", payload.get("obtained", 450)))
    total = float(payload.get("total_marks", payload.get("total", 500)))
    if obtained < 0 or total <= 0 or obtained > total:
        return ExecutionResult(kind="json", message="Please enter valid obtained and total marks.", data={"error": "Invalid marks"})
    percentage = obtained / total * 100
    grade = "A+" if percentage >= 90 else "A" if percentage >= 80 else "B+" if percentage >= 70 else "B" if percentage >= 60 else "C" if percentage >= 50 else "D" if percentage >= 40 else "F"
    return ExecutionResult(kind="json", message=f"Percentage: {percentage:.2f}% | Grade: {grade}", data={"obtained_marks": obtained, "total_marks": total, "percentage": round(percentage, 2), "grade": grade, "passed": percentage >= 40})


def _handle_cgpa_percentage_converter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    cgpa = float(payload.get("cgpa", payload.get("text", 8.0)))
    scale = float(payload.get("scale", 10))
    formula = payload.get("formula", "cbse").lower()
    if cgpa < 0 or scale <= 0 or cgpa > scale:
        return ExecutionResult(kind="json", message="Please enter valid CGPA and scale.", data={"error": "Invalid CGPA"})
    if formula == "cbse":
        percentage = cgpa * 9.5
    else:
        percentage = cgpa / scale * 100
    return ExecutionResult(kind="json", message=f"{cgpa} CGPA ≈ {percentage:.2f}%", data={"cgpa": cgpa, "scale": scale, "formula": formula, "percentage": round(percentage, 2), "note": "Check your university rules because CGPA conversion formulas can differ."})


def _handle_attendance_required_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    attended = int(float(payload.get("attended_classes", payload.get("attended", 45))))
    total = int(float(payload.get("total_classes", payload.get("total", 60))))
    required = float(payload.get("required_percent", payload.get("required", 75)))
    if attended < 0 or total <= 0 or attended > total or required <= 0 or required >= 100:
        return ExecutionResult(kind="json", message="Please enter valid attendance values.", data={"error": "Invalid input"})
    current = attended / total * 100
    needed = 0
    while (attended + needed) / (total + needed) * 100 < required:
        needed += 1
        if needed > 10000:
            break
    can_bunk = 0
    while attended / (total + can_bunk + 1) * 100 >= required:
        can_bunk += 1
    return ExecutionResult(
        kind="json",
        message=f"Current attendance: {current:.2f}% | Attend next {needed} classes to reach {required}%",
        data={"attended_classes": attended, "total_classes": total, "required_percent": required, "current_percent": round(current, 2), "classes_to_attend": needed, "safe_bunks_available": can_bunk},
    )


def _handle_calorie_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    weight = float(payload.get("weight", 70))  # kg
    height = float(payload.get("height", 170))  # cm
    age = int(payload.get("age", 25))
    gender = payload.get("gender", "male").lower()
    activity = payload.get("activity", "moderate").lower()

    activity_factors = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9,
        "extra_active": 1.9,
    }

    # Harris-Benedict equation
    if gender in ("male", "m"):
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    else:
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)

    factor = activity_factors.get(activity, 1.55)
    tdee = bmr * factor

    return ExecutionResult(
        kind="json",
        message=f"✅ Daily calorie need: {round(tdee):,} kcal/day",
        data={
            "bmr": round(bmr),
            "tdee": round(tdee),
            "weight_loss": round(tdee - 500),
            "weight_gain": round(tdee + 500),
            "mild_loss": round(tdee - 250),
            "activity_level": activity,
            "macros": {
                "protein_g": round(weight * 2),
                "carbs_g": round(tdee * 0.5 / 4),
                "fat_g": round(tdee * 0.3 / 9),
            },
        },
    )


def _handle_water_intake(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    weight = float(payload.get("weight", 70))  # kg
    activity = payload.get("activity", "moderate").lower()
    climate = payload.get("climate", "normal").lower()

    base_ml = weight * 35  # 35ml per kg

    activity_add = {"low": 0, "moderate": 300, "high": 600, "very_high": 900}.get(activity, 300)
    climate_add = {"cold": -200, "normal": 0, "hot": 400, "very_hot": 700}.get(climate, 0)

    total_ml = base_ml + activity_add + climate_add
    total_liters = total_ml / 1000
    glasses = total_ml / 250  # 250ml per glass

    return ExecutionResult(
        kind="json",
        message=f"✅ Recommended: {total_liters:.1f} L/day ({glasses:.0f} glasses of 250ml)",
        data={
            "weight_kg": weight,
            "recommended_ml": round(total_ml),
            "recommended_liters": round(total_liters, 1),
            "glasses_250ml": round(glasses, 1),
            "bottles_500ml": round(total_ml / 500, 1),
            "bottles_1L": round(total_ml / 1000, 1),
            "activity_level": activity,
            "climate": climate,
        },
    )


def _handle_sleep_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    wake_time = _coerce_str(payload.get("wake_time", payload.get("text")), "06:00")
    sleep_time = payload.get("sleep_time", "").strip()

    CYCLE = 90  # minutes per sleep cycle
    FALL_ASLEEP = 14  # average minutes to fall asleep

    try:
        if sleep_time:
            # Calculate wake up times from sleep time
            h, m = map(int, sleep_time.split(":"))
            base = datetime.now().replace(hour=h, minute=m, second=0, microsecond=0)
            base += timedelta(minutes=FALL_ASLEEP)

            wake_times = []
            for cycles in range(4, 7):
                wake = base + timedelta(minutes=CYCLE * cycles)
                wake_times.append({
                    "cycles": cycles,
                    "hours": cycles * 1.5,
                    "wake_time": wake.strftime("%I:%M %p"),
                    "quality": "Best" if cycles in (5, 6) else "Good" if cycles == 4 else "Minimum",
                })

            return ExecutionResult(
                kind="json",
                message=f"✅ Best wake up times if you sleep at {sleep_time}",
                data={"sleep_time": sleep_time, "wake_up_options": wake_times, "tip": "Set alarm for one of these times to wake up naturally at the end of a sleep cycle."},
            )
        else:
            # Calculate sleep times from wake time
            h, m = map(int, wake_time.split(":"))
            base = datetime.now().replace(hour=h, minute=m, second=0, microsecond=0)

            sleep_times = []
            for cycles in range(6, 3, -1):
                sleep = base - timedelta(minutes=CYCLE * cycles + FALL_ASLEEP)
                sleep_times.append({
                    "cycles": cycles,
                    "hours": cycles * 1.5,
                    "bedtime": sleep.strftime("%I:%M %p"),
                    "quality": "Best" if cycles in (5, 6) else "Good" if cycles == 4 else "Minimum",
                })

            return ExecutionResult(
                kind="json",
                message=f"✅ Best bedtimes to wake up at {wake_time}",
                data={"wake_time": wake_time, "bedtime_options": sleep_times, "tip": "Go to bed at one of these times to wake up refreshed at the end of a sleep cycle."},
            )
    except Exception as e:
        return ExecutionResult(kind="json", message="Please enter time in HH:MM format (e.g., 06:30).", data={"error": str(e)})


def _handle_atm_pin_generator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    count = int(payload.get("count", 5))
    length = int(payload.get("length", 4))
    count = min(count, 20)
    length = min(max(length, 4), 8)

    pins = []
    attempts = 0
    while len(pins) < count and attempts < 1000:
        pin = ''.join([str(secrets.randbelow(10)) for _ in range(length)])
        # Avoid obvious patterns
        if (len(set(pin)) > 1 and  # Not all same digit
                pin != ''.join(str((int(pin[0]) + i) % 10) for i in range(length)) and  # Not sequential
                pin != ''.join(str((int(pin[0]) - i) % 10) for i in range(length))):  # Not reverse sequential
            pins.append(pin)
        attempts += 1

    return ExecutionResult(
        kind="json",
        message=f"✅ Generated {len(pins)} secure {length}-digit PINs",
        data={"pins": pins, "length": length, "count": len(pins), "note": "These are randomly generated PINs. Never share your actual ATM PIN."},
    )


def _handle_credit_card_validator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    card_number = re.sub(r'\D', '', payload.get("text", payload.get("card_number", "")))

    if not card_number:
        return ExecutionResult(kind="json", message="Please enter a card number to validate.", data={"error": "No card number"})

    # Luhn algorithm
    def luhn_check(num: str) -> bool:
        total = 0
        is_even = False
        for digit in reversed(num):
            d = int(digit)
            if is_even:
                d *= 2
                if d > 9: d -= 9
            total += d
            is_even = not is_even
        return total % 10 == 0

    valid = luhn_check(card_number)

    # Detect card type
    card_type = "Unknown"
    if re.match(r'^4', card_number):
        card_type = "Visa"
    elif re.match(r'^5[1-5]|^2[2-7]', card_number):
        card_type = "Mastercard"
    elif re.match(r'^3[47]', card_number):
        card_type = "American Express"
    elif re.match(r'^6[0-9]', card_number):
        card_type = "RuPay / UnionPay / Discover"
    elif re.match(r'^35', card_number):
        card_type = "JCB"

    masked = card_number[-4:].rjust(len(card_number), '*')

    return ExecutionResult(
        kind="json",
        message=f"{'✅ Valid' if valid else '❌ Invalid'} {card_type} card",
        data={
            "valid": valid,
            "card_type": card_type,
            "masked": masked,
            "length": len(card_number),
            "note": "Card validation is for testing purposes only. This tool does not store card numbers.",
        },
    )


def _handle_ifsc_finder(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    ifsc = _coerce_str(payload.get("text", payload.get("ifsc"))).upper()
    if not ifsc:
        return ExecutionResult(kind="json", message="Please enter an IFSC code to look up.", data={"error": "No IFSC code"})

    if len(ifsc) != 11:
        return ExecutionResult(kind="json", message="IFSC code must be exactly 11 characters.", data={"error": "Invalid IFSC length"})

    try:
        resp = httpx.get(f"https://ifsc.razorpay.com/{ifsc}", timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            return ExecutionResult(
                kind="json",
                message=f"✅ {data.get('BANK', 'Bank')} — {data.get('BRANCH', 'Branch')}",
                data={
                    "ifsc": ifsc,
                    "bank": data.get("BANK", "N/A"),
                    "branch": data.get("BRANCH", "N/A"),
                    "city": data.get("CITY", "N/A"),
                    "state": data.get("STATE", "N/A"),
                    "district": data.get("DISTRICT", "N/A"),
                    "address": data.get("ADDRESS", "N/A"),
                    "contact": data.get("CONTACT", "N/A"),
                    "rtgs": data.get("RTGS", False),
                    "neft": data.get("NEFT", False),
                    "imps": data.get("IMPS", False),
                },
            )
        else:
            return ExecutionResult(kind="json", message=f"IFSC code {ifsc} not found. Please check and try again.", data={"error": "Not found", "ifsc": ifsc})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"IFSC lookup failed: {str(e)[:100]}", data={"error": str(e)[:200]})


def _handle_paraphrase_tool(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please enter text to paraphrase.", data={"error": "No text"})
    if len(text) > 3000:
        return ExecutionResult(kind="json", message="Text too long. Please enter text under 3000 characters.", data={"error": "Too long"})

    try:
        from deep_translator import GoogleTranslator

        # Round-trip translation for paraphrasing
        intermediate_lang = "fr"
        to_fr = GoogleTranslator(source="en", target=intermediate_lang).translate(text)
        back_to_en = GoogleTranslator(source=intermediate_lang, target="en").translate(to_fr)

        return ExecutionResult(
            kind="json",
            message="✅ Text paraphrased successfully!",
            data={
                "original": text,
                "paraphrased": back_to_en,
                "original_words": len(text.split()),
                "paraphrased_words": len(back_to_en.split()) if back_to_en else 0,
                "method": "AI-powered round-trip translation paraphrasing",
            },
        )
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Paraphrasing failed: {str(e)[:100]}", data={"error": str(e)[:200]})


def _handle_plagiarism_detector(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please enter text to check for plagiarism.", data={"error": "No text"})

    # Note: Real plagiarism detection requires a database comparison
    # This tool provides a local analysis (sentence structure analysis)
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]

    # Check for repeated phrases (basic)
    words = text.lower().split()
    word_freq = {}
    for i in range(len(words) - 2):
        trigram = " ".join(words[i:i+3])
        word_freq[trigram] = word_freq.get(trigram, 0) + 1

    repeated_phrases = {k: v for k, v in word_freq.items() if v > 2}
    uniqueness_score = max(0, 100 - len(repeated_phrases) * 5)

    return ExecutionResult(
        kind="json",
        message=f"✅ Uniqueness score: {uniqueness_score}/100",
        data={
            "text_length": len(text),
            "word_count": len(words),
            "sentence_count": len(sentences),
            "uniqueness_score": uniqueness_score,
            "repeated_phrases": list(repeated_phrases.keys())[:10],
            "note": "For a complete plagiarism check against internet sources, consider using specialized tools like Turnitin or Copyscape. This tool provides a basic internal analysis.",
        },
    )


def _handle_text_to_handwriting(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please enter text to convert to handwriting.", data={"error": "No text"})
    if len(text) > 500:
        text = text[:500]

    # Create handwriting effect using PIL
    from PIL import Image, ImageDraw, ImageFont
    import math
    import random

    # Create a white paper-like background
    line_height = 45
    chars_per_line = 60
    lines = []
    words = text.split()
    current_line = ""
    for word in words:
        if len(current_line) + len(word) + 1 <= chars_per_line:
            current_line += (" " + word if current_line else word)
        else:
            lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)

    width = 900
    height = max(400, len(lines) * line_height + 100)

    img = Image.new("RGB", (width, height), color=(255, 252, 240))
    draw = ImageDraw.Draw(img)

    # Draw ruled lines
    for i in range(50, height - 50, line_height):
        draw.line([(40, i), (width - 40, i)], fill=(200, 200, 220), width=1)

    # Draw left margin
    draw.line([(80, 30), (80, height - 30)], fill=(255, 180, 180), width=2)

    # Simulate handwriting with slight randomness
    y = 60
    ink_color = (20, 40, 120)

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf", 22)
    except Exception:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Italic.ttf", 22)
        except Exception:
            font = ImageFont.load_default()

    for line in lines:
        x = 90
        for char in line:
            # Add slight randomness for handwriting effect
            offset_y = random.randint(-2, 2)
            offset_x = random.randint(-1, 1)
            draw.text((x + offset_x, y + offset_y), char, font=font, fill=ink_color)
            try:
                char_width = font.getbbox(char)[2]
            except Exception:
                char_width = 12
            x += char_width + random.randint(0, 2)
        y += line_height

    out_path = job_dir / "handwriting.png"
    img.save(str(out_path), "PNG")

    return ExecutionResult(
        kind="file",
        message="✅ Text converted to handwriting style!",
        output_path=out_path,
        filename="handwriting.png",
        content_type="image/png",
    )


# ─── Color Palette Generator ──────────────────────────────────────────────────

def _handle_color_palette(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    if files:
        # Extract palette from image
        try:
            img = Image.open(str(files[0]))
            img = img.convert("RGB").resize((200, 200))

            # Get dominant colors using simple k-means approach
            pixels = list(img.getdata())
            random.shuffle(pixels)
            sample = pixels[:1000]

            # Simple color clustering
            def color_distance(c1, c2):
                return sum((a-b)**2 for a, b in zip(c1, c2)) ** 0.5

            clusters = [sample[0]]
            for _ in range(7):
                farthest = max(sample, key=lambda p: min(color_distance(p, c) for c in clusters))
                clusters.append(farthest)

            def rgb_to_hex(rgb):
                return "#{:02x}{:02x}{:02x}".format(*rgb)

            palette = [{"rgb": list(c), "hex": rgb_to_hex(c)} for c in clusters[:8]]

            return ExecutionResult(
                kind="json",
                message=f"✅ Extracted {len(palette)} dominant colors from image",
                data={"palette": palette, "source": "image"},
            )
        except Exception as e:
            return ExecutionResult(kind="json", message=f"Color extraction failed: {str(e)}", data={"error": str(e)[:200]})
    else:
        # Generate palette from keyword/color
        base_color = _coerce_str(payload.get("text", payload.get("color")), "#3bd0ff")
        if not base_color.startswith("#"):
            base_color = "#3bd0ff"

        try:
            r = int(base_color[1:3], 16)
            g = int(base_color[3:5], 16)
            b = int(base_color[5:7], 16)
        except Exception:
            r, g, b = 59, 208, 255

        def rgb_to_hex(r, g, b):
            return "#{:02x}{:02x}{:02x}".format(int(r) % 256, int(g) % 256, int(b) % 256)

        palette = [
            {"name": "Base", "hex": base_color, "rgb": [r, g, b]},
            {"name": "Complementary", "hex": rgb_to_hex(255-r, 255-g, 255-b), "rgb": [255-r, 255-g, 255-b]},
            {"name": "Lighter", "hex": rgb_to_hex(min(255, r+60), min(255, g+60), min(255, b+60)), "rgb": [min(255, r+60), min(255, g+60), min(255, b+60)]},
            {"name": "Darker", "hex": rgb_to_hex(max(0, r-60), max(0, g-60), max(0, b-60)), "rgb": [max(0, r-60), max(0, g-60), max(0, b-60)]},
            {"name": "Triadic 1", "hex": rgb_to_hex(g, b, r), "rgb": [g, b, r]},
            {"name": "Triadic 2", "hex": rgb_to_hex(b, r, g), "rgb": [b, r, g]},
            {"name": "Warm Accent", "hex": rgb_to_hex(r, max(0, g-40), max(0, b-80)), "rgb": [r, max(0, g-40), max(0, b-80)]},
            {"name": "Cool Accent", "hex": rgb_to_hex(max(0, r-80), g, min(255, b+40)), "rgb": [max(0, r-80), g, min(255, b+40)]},
        ]

        return ExecutionResult(
            kind="json",
            message=f"✅ Color palette generated from {base_color}",
            data={"palette": palette, "base": base_color, "source": "color"},
        )


# ─── Interactive/Frontend-Only Tools (return JSON with UI hints) ──────────────

def _handle_frontend_tool(slug: str) -> ExecutionResult:
    """For tools that are primarily frontend-driven (timer, notepad, etc.)"""
    ui_hints = {
        "pomodoro-timer": {
            "type": "interactive",
            "message": "🍅 Pomodoro Timer — 25 min focus + 5 min break",
            "data": {"work_minutes": 25, "short_break": 5, "long_break": 15, "cycles_before_long_break": 4},
        },
        "stopwatch": {
            "type": "interactive",
            "message": "⏱️ Online Stopwatch ready!",
            "data": {"features": ["start", "stop", "reset", "lap"], "precision": "milliseconds"},
        },
        "world-clock": {
            "type": "interactive",
            "message": "🌍 World Clock",
            "data": {
                "cities": [
                    {"name": "New Delhi", "tz": "Asia/Kolkata"},
                    {"name": "New York", "tz": "America/New_York"},
                    {"name": "London", "tz": "Europe/London"},
                    {"name": "Dubai", "tz": "Asia/Dubai"},
                    {"name": "Singapore", "tz": "Asia/Singapore"},
                    {"name": "Tokyo", "tz": "Asia/Tokyo"},
                    {"name": "Sydney", "tz": "Australia/Sydney"},
                    {"name": "Los Angeles", "tz": "America/Los_Angeles"},
                ]
            },
        },
        "typing-speed-test": {
            "type": "interactive",
            "message": "⌨️ Typing Speed Test — measure your WPM!",
            "data": {
                "sample_texts": [
                    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
                    "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
                    "The best way to predict the future is to invent it. — Alan Kay",
                    "In the middle of every difficulty lies opportunity. — Albert Einstein",
                ]
            },
        },
        "screen-ruler": {
            "type": "interactive",
            "message": "📏 Screen Ruler — measure anything on screen",
            "data": {"units": ["px", "cm", "mm", "inches"], "default_unit": "px"},
        },
        "note-pad": {
            "type": "interactive",
            "message": "📝 Online Notepad with auto-save",
            "data": {"auto_save": True, "storage": "localStorage", "max_notes": 10},
        },
        "to-do-list": {
            "type": "interactive",
            "message": "✅ To-Do List with persistence",
            "data": {"storage": "localStorage", "features": ["add", "complete", "delete", "priority"]},
        },
        "habit-tracker": {
            "type": "interactive",
            "message": "🎯 Habit Tracker",
            "data": {"storage": "localStorage", "tracking_period": "daily", "features": ["streak", "calendar", "progress"]},
        },
        "flashcard-maker": {
            "type": "interactive",
            "message": "🃏 Flashcard Maker for studying",
            "data": {"storage": "localStorage", "study_modes": ["flashcard", "quiz"]},
        },
        "resume-builder": {
            "type": "interactive",
            "message": "📄 Resume Builder",
            "data": {"sections": ["personal", "education", "experience", "skills", "projects", "certifications"]},
        },
        "invoice-generator": {
            "type": "interactive",
            "message": "🧾 Invoice Generator",
            "data": {"fields": ["company", "client", "items", "tax", "notes"], "currencies": ["INR", "USD", "EUR", "GBP"]},
        },
    }

    hint = ui_hints.get(slug, {"type": "interactive", "message": f"Tool: {slug}", "data": {}})
    return ExecutionResult(kind="json", message=hint["message"], data={"ui_type": hint["type"], **hint["data"]})


def _make_frontend_handler(slug: str):
    def handler(files, payload, job_dir):
        return _handle_frontend_tool(slug)
    return handler


# ─── Register all handlers ────────────────────────────────────────────────────

VIDEO_EXTRA_HANDLERS: dict = {
    # Video Downloaders
    "video-downloader": _handle_video_downloader,
    "youtube-video-downloader": _handle_youtube_downloader,
    "youtube-downloader": _handle_youtube_downloader,
    "youtube-to-mp3": _handle_youtube_to_mp3,
    "instagram-downloader": _handle_instagram_downloader,

    # Image Tools
    "image-to-base64": _handle_image_to_base64,
    "base64-to-image": _handle_base64_to_image,
    "bulk-image-compressor": _handle_bulk_image_compressor,
    "color-palette-generator": _handle_color_palette,

    # Network Tools
    "ip-address-lookup": _handle_ip_lookup,
    "dns-lookup": _handle_dns_lookup,
    "whois-lookup": _handle_whois_lookup,
    "ssl-certificate-checker": _handle_ssl_checker,

    # Text Tools
    "word-frequency-counter": _handle_word_frequency,
    "text-to-morse": _handle_text_to_morse,
    "roman-numeral-converter": _handle_roman_numeral,
    "ascii-art-generator": _handle_ascii_art,
    "grammar-checker": _handle_grammar_checker,
    "paraphrase-tool": _handle_paraphrase_tool,
    "plagiarism-detector": _handle_plagiarism_detector,
    "text-to-handwriting": _handle_text_to_handwriting,

    # Math Tools
    "fibonacci-generator": _handle_fibonacci,
    "prime-number-checker": _handle_prime_checker,
    "statistics-calculator": _handle_statistics_calculator,
    "matrix-calculator": _handle_matrix_calculator,
    "equation-solver": _handle_equation_solver,

    # Finance Tools
    "currency-converter": _handle_currency_converter,
    "gst-calculator-india": _handle_gst_calculator,
    "fuel-cost-calculator": _handle_fuel_calculator,
    "emi-calculator-advanced": _handle_emi_calculator,
    "sip-calculator-india": _handle_sip_calculator_india,
    "income-tax-calculator-india": _handle_income_tax_calculator_india,
    "salary-hike-calculator": _handle_salary_hike_calculator,
    "discount-calculator": _handle_discount_calculator,
    "loan-prepayment-calculator": _handle_loan_prepayment_calculator,
    "fixed-deposit-calculator-india": _handle_fixed_deposit_calculator_india,
    "recurring-deposit-calculator": _handle_recurring_deposit_calculator,
    "loan-eligibility-calculator": _handle_loan_eligibility_calculator,
    "expense-splitter": _handle_expense_splitter,
    "upi-qr-generator": _handle_upi_qr_generator,
    "wifi-qr-generator": _handle_wifi_qr_generator,
    "grade-needed-calculator": _handle_grade_needed_calculator,
    "exam-countdown-calculator": _handle_exam_countdown_calculator,
    "atm-pin-generator": _handle_atm_pin_generator,
    "credit-card-validator": _handle_credit_card_validator,
    "ifsc-code-finder": _handle_ifsc_finder,

    # Everyday Tools
    "number-to-words": _handle_number_to_words,
    "marks-percentage-calculator": _handle_marks_percentage_calculator,
    "cgpa-percentage-converter": _handle_cgpa_percentage_converter,
    "attendance-required-calculator": _handle_attendance_required_calculator,
    "calorie-calculator": _handle_calorie_calculator,
    "water-intake-calculator": _handle_water_intake,
    "sleep-calculator": _handle_sleep_calculator,

    # New Video Downloaders
    "tiktok-downloader": _handle_tiktok_downloader,
    "twitter-video-downloader": _handle_twitter_downloader,
    "x-video-downloader": _handle_twitter_downloader,
    "facebook-video-downloader": _handle_facebook_downloader,
    "vimeo-downloader": _handle_vimeo_downloader,
    "dailymotion-downloader": _handle_dailymotion_downloader,
    "youtube-playlist-downloader": _handle_playlist_downloader,
    "playlist-downloader": _handle_playlist_downloader,
    "youtube-to-mp4": _handle_youtube_to_mp4,
    "youtube-shorts-downloader": _handle_youtube_shorts_downloader,
    "audio-extractor": _handle_audio_extractor,
    "youtube-audio-downloader": _handle_youtube_to_mp3,
}

# Frontend-only interactive tools
FRONTEND_TOOL_SLUGS = [
    "pomodoro-timer", "stopwatch", "world-clock", "typing-speed-test",
    "screen-ruler", "note-pad", "to-do-list", "habit-tracker",
    "flashcard-maker", "resume-builder", "invoice-generator",
]
for _slug in FRONTEND_TOOL_SLUGS:
    VIDEO_EXTRA_HANDLERS[_slug] = _make_frontend_handler(_slug)


def register_video_extra_handlers() -> int:
    """Register all video and extra tool handlers into the main HANDLERS dict."""
    from .handlers import HANDLERS as _HANDLERS
    registered = 0
    for slug, handler in VIDEO_EXTRA_HANDLERS.items():
        if slug not in _HANDLERS:
            _HANDLERS[slug] = handler
            registered += 1
    return registered
