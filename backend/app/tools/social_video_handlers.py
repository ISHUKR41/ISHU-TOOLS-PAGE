"""
ISHU TOOLS — Social Media Video Downloaders + Advanced New Tools
Handles: pinterest-downloader, reddit-downloader, twitch-downloader, linkedin-downloader,
         bilibili-downloader, rumble-downloader, soundcloud-downloader, mixcloud-downloader,
         odysee-downloader, youtube-thumbnail-downloader, youtube-channel-downloader,
         tiktok-photo-downloader, telegram-video-downloader, clubhouse-downloader,
         spotify-podcast-downloader, podcast-downloader, twitch-vod-downloader,
         twitter-spaces-downloader, niconico-downloader, kick-downloader,
         streamable-downloader, imgur-downloader, gfycat-downloader,
         bitchute-downloader, peertube-downloader, lbry-downloader,
         youtube-live-downloader, bandcamp-downloader, soundgasm-downloader,
         video-info, video-trimmer-url, video-format-converter-url,
         text-diff, json-diff, xml-formatter, yaml-formatter,
         cron-expression-parser, regex-tester-advanced, jwt-decoder-advanced,
         http-request-tester, color-contrast-checker, css-unit-converter,
         lorem-ipsum-generator, password-strength-checker, hash-generator-advanced,
         bcrypt-hash, hmac-generator, rsa-key-generator, ssh-key-generator,
         uuid-v5-generator, nanoid-generator, cuid-generator,
         ip-subnet-calculator, network-cidr-calculator, mac-address-lookup,
         dns-propagation-checker, ping-tool, port-checker, http-headers-viewer,
         speed-test, website-screenshot, google-cache-checker
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import io
import ipaddress
import json
import random
import re
import secrets
import socket
import string
import struct
import time
import uuid
import xml.dom.minidom
from datetime import datetime
from pathlib import Path
from typing import Any

import httpx

from .handlers import ExecutionResult, HANDLERS


# ─── Utility: yt-dlp based downloader ────────────────────────────────────────

_SOCIAL_ALLOWED_HEIGHTS = {"144", "240", "360", "480", "720", "1080", "1440", "2160", "4320"}


def _social_format_for_quality(quality: str | int | None) -> str:
    """Build a yt-dlp format selector capped at requested height (up to 4K/8K)."""
    if quality is None:
        return "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best[ext=mp4]/best"
    q = str(quality).strip().lower().replace("p", "").replace("k", "")
    alias = {"4": "2160", "2": "1440", "8": "4320", "hd": "720", "fullhd": "1080", "fhd": "1080", "uhd": "2160", "qhd": "1440"}
    q = alias.get(q, q)
    if q in ("best", "max", "highest", ""):
        return "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best[ext=mp4]/best"
    if q in _SOCIAL_ALLOWED_HEIGHTS:
        return (
            f"bestvideo[height<={q}][ext=mp4]+bestaudio[ext=m4a]"
            f"/bestvideo[height<={q}]+bestaudio"
            f"/best[height<={q}][ext=mp4]"
            f"/best[height<={q}]/best"
        )
    return "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best[ext=mp4]/best"


def _yt_dlp_download(url: str, job_dir: Path, extra_opts: dict | None = None) -> ExecutionResult:
    """Generic yt-dlp downloader used by all social platforms."""
    try:
        import yt_dlp

        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "outtmpl": str(job_dir / "%(title)s.%(ext)s"),
            "merge_output_format": "mp4",
            "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best[ext=mp4]/best",
            "max_filesize": 2 * 1024 * 1024 * 1024,  # 2 GB cap (4K-friendly)
            "http_headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        }
        if extra_opts:
            ydl_opts.update(extra_opts)

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = info.get("title", "video")[:80]
            ext = info.get("ext", "mp4")
            duration = info.get("duration", 0)
            uploader = info.get("uploader", "Unknown")
            view_count = info.get("view_count", 0)

        # Find downloaded file
        files = list(job_dir.glob("*"))
        video_files = [f for f in files if f.suffix.lower() in (".mp4", ".webm", ".mkv", ".mov", ".avi")]
        if video_files:
            out = sorted(video_files, key=lambda f: f.stat().st_size, reverse=True)[0]
            return ExecutionResult(
                kind="file",
                output_path=out,
                filename=f"{title}.mp4",
                message=f"Downloaded: {title} | Duration: {duration}s | By: {uploader} | Views: {view_count:,}",
            )

        return ExecutionResult(kind="json", message="Download failed. Check the URL and try again.", data={"error": "No output file"})

    except Exception as e:
        err = str(e)
        if "Unable to extract" in err or "Unsupported URL" in err:
            return ExecutionResult(kind="json", message="This URL is not supported. Please check and try again.", data={"error": err[:200]})
        if "Private video" in err or "Sign in" in err or "unavailable" in err:
            return ExecutionResult(kind="json", message="This video is private or unavailable.", data={"error": err[:200]})
        if "rate limit" in err.lower() or "429" in err:
            return ExecutionResult(kind="json", message="Rate limited by the platform. Please try again in a minute.", data={"error": err[:200]})
        return ExecutionResult(kind="json", message=f"Download error: {err[:200]}", data={"error": err[:200]})


def _yt_dlp_info(url: str) -> dict:
    """Extract info without downloading."""
    try:
        import yt_dlp
        with yt_dlp.YoutubeDL({"quiet": True, "no_warnings": True, "skip_download": True}) as ydl:
            return ydl.extract_info(url, download=False) or {}
    except Exception:
        return {}


# ─── Pinterest Downloader ─────────────────────────────────────────────────────

def _pinterest_html_fallback(url: str, job_dir: Path):
    """No-auth Pinterest fallback: scrape og:video / og:image from the public pin page."""
    import re as _re
    import httpx as _httpx
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }
    try:
        r = _httpx.get(url, headers=headers, timeout=20, follow_redirects=True)
        if r.status_code != 200:
            return None
        html = r.text
    except Exception:
        return None
    media_url = None
    is_video = False
    for pat in (r'<meta[^>]+property="og:video"[^>]+content="([^"]+)"',
                r'"video_list":\s*\{[^}]*"V_HLSV4"[^}]*"url":"([^"]+)"',
                r'"contentUrl":"(https://[^"]+\.mp4[^"]*)"'):
        m = _re.search(pat, html)
        if m:
            media_url = m.group(1).encode("utf-8").decode("unicode_escape")
            is_video = True
            break
    if not media_url:
        m = _re.search(r'<meta[^>]+property="og:image"[^>]+content="([^"]+)"', html)
        if m:
            media_url = m.group(1)
    if not media_url:
        return None
    if media_url.endswith(".m3u8"):
        return None  # let yt-dlp handle HLS
    try:
        v = _httpx.get(media_url, timeout=60, follow_redirects=True, headers=headers)
        if v.status_code != 200 or len(v.content) < 5000:
            return None
    except Exception:
        return None
    ext = "mp4" if is_video else (media_url.rsplit(".", 1)[-1].split("?")[0][:4].lower() or "jpg")
    out = job_dir / f"pinterest_pin.{ext}"
    out.write_bytes(v.content)
    size_mb = round(len(v.content) / 1024 / 1024, 2)
    return ExecutionResult(
        kind="file",
        message=f"Downloaded Pinterest {'video' if is_video else 'image'} ({size_mb} MB)",
        output_path=out,
        filename=out.name,
        content_type="video/mp4" if is_video else f"image/{ext if ext != 'jpg' else 'jpeg'}",
    )


def _handle_pinterest_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Pinterest URL.", data={"error": "No URL"})
    if "pinterest.com" not in url and "pin.it" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Pinterest URL (pinterest.com or pin.it).", data={"error": "Not Pinterest"})
    primary = _yt_dlp_download(url, job_dir, {"format": _social_format_for_quality(payload.get("quality"))})
    if primary.kind == "file":
        return primary
    fb = _pinterest_html_fallback(url, job_dir)
    if fb is not None:
        return fb
    return primary


# ─── Reddit Downloader ────────────────────────────────────────────────────────

def _reddit_json_fallback(url: str, job_dir: Path):
    """No-auth Reddit fallback: append .json to any post URL → public JSON
    with `media.reddit_video.fallback_url` (mp4)."""
    import re as _re
    import httpx as _httpx
    clean = url.split("?")[0].rstrip("/")
    json_url = clean + ".json"
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; ISHU-tools/1.0)",
        "Accept": "application/json",
    }
    try:
        r = _httpx.get(json_url, headers=headers, timeout=20, follow_redirects=True)
        if r.status_code != 200:
            return None
        data = r.json()
    except Exception:
        return None
    media_url = None
    title = "reddit"
    try:
        post = data[0]["data"]["children"][0]["data"]
        title = (post.get("title") or "reddit")[:80]
        media = post.get("media") or {}
        rv = (media.get("reddit_video") or post.get("secure_media", {}).get("reddit_video") or {})
        media_url = rv.get("fallback_url")
        if not media_url and post.get("preview"):
            rvp = ((post["preview"].get("reddit_video_preview")) or {})
            media_url = rvp.get("fallback_url")
        if not media_url and post.get("url_overridden_by_dest", "").endswith((".mp4", ".jpg", ".png", ".gif")):
            media_url = post["url_overridden_by_dest"]
    except Exception:
        return None
    if not media_url:
        return None
    media_url = media_url.split("?")[0]
    try:
        v = _httpx.get(media_url, timeout=60, follow_redirects=True, headers={"User-Agent": headers["User-Agent"]})
        if v.status_code != 200 or len(v.content) < 5000:
            return None
    except Exception:
        return None
    ext = media_url.rsplit(".", 1)[-1][:4].lower() if "." in media_url else "mp4"
    safe = _re.sub(r'[^\w\s.-]', '', title).strip()[:60] or "reddit"
    out = job_dir / f"{safe}.{ext}"
    out.write_bytes(v.content)
    size_mb = round(len(v.content) / 1024 / 1024, 2)
    return ExecutionResult(
        kind="file",
        message=f"Downloaded: {title} ({size_mb} MB)",
        output_path=out,
        filename=out.name,
        content_type="video/mp4" if ext == "mp4" else f"image/{ext}",
    )


def _handle_reddit_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Reddit post URL.", data={"error": "No URL"})
    if "reddit.com" not in url and "redd.it" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Reddit URL.", data={"error": "Not Reddit"})
    primary = _yt_dlp_download(url, job_dir, {"format": _social_format_for_quality(payload.get("quality"))})
    if primary.kind == "file":
        return primary
    fb = _reddit_json_fallback(url, job_dir)
    if fb is not None:
        return fb
    return primary


# ─── Twitch Clip Downloader ───────────────────────────────────────────────────

def _handle_twitch_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Twitch clip or VOD URL.", data={"error": "No URL"})
    if "twitch.tv" not in url and "clips.twitch.tv" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Twitch URL.", data={"error": "Not Twitch"})
    return _yt_dlp_download(url, job_dir, {"format": _social_format_for_quality(payload.get("quality"))})


# ─── LinkedIn Video Downloader ────────────────────────────────────────────────

def _handle_linkedin_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a LinkedIn video post URL.", data={"error": "No URL"})
    if "linkedin.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid LinkedIn URL.", data={"error": "Not LinkedIn"})
    # LinkedIn requires auth for most videos - return friendly message
    result = _yt_dlp_download(url, job_dir, {"format": _social_format_for_quality(payload.get("quality"))})
    if result.kind == "json" and "error" in (result.data or {}):
        return ExecutionResult(kind="json", message="LinkedIn requires login for most videos. For public videos, paste the direct share URL.", data=result.data)
    return result


# ─── Bilibili Downloader ──────────────────────────────────────────────────────

def _handle_bilibili_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Bilibili video URL.", data={"error": "No URL"})
    if "bilibili.com" not in url and "b23.tv" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Bilibili URL.", data={"error": "Not Bilibili"})
    return _yt_dlp_download(url, job_dir, {"format": _social_format_for_quality(payload.get("quality"))})


# ─── Rumble Downloader ────────────────────────────────────────────────────────

def _handle_rumble_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Rumble video URL.", data={"error": "No URL"})
    if "rumble.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Rumble URL.", data={"error": "Not Rumble"})
    return _yt_dlp_download(url, job_dir, {"format": _social_format_for_quality(payload.get("quality"))})


# ─── SoundCloud Downloader ────────────────────────────────────────────────────

def _handle_soundcloud_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a SoundCloud track URL.", data={"error": "No URL"})
    if "soundcloud.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid SoundCloud URL.", data={"error": "Not SoundCloud"})
    opts = {
        "format": "bestaudio/best",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "320",
        }],
        "outtmpl": str(job_dir / "%(title)s.%(ext)s"),
    }
    try:
        import yt_dlp
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = info.get("title", "audio")[:80]
        mp3_files = list(job_dir.glob("*.mp3"))
        if mp3_files:
            out = sorted(mp3_files, key=lambda f: f.stat().st_size, reverse=True)[0]
            return ExecutionResult(kind="file", output_path=out, filename=f"{title}.mp3", message=f"Downloaded: {title}")
        return ExecutionResult(kind="json", message="Download failed.", data={"error": "No MP3 output"})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"SoundCloud download error: {str(e)[:200]}", data={"error": str(e)[:200]})


# ─── Mixcloud Downloader ──────────────────────────────────────────────────────

def _handle_mixcloud_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Mixcloud URL.", data={"error": "No URL"})
    if "mixcloud.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Mixcloud URL.", data={"error": "Not Mixcloud"})
    return _yt_dlp_download(url, job_dir, {"format": "bestaudio/best"})


# ─── Bandcamp Downloader ──────────────────────────────────────────────────────

def _handle_bandcamp_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Bandcamp track URL.", data={"error": "No URL"})
    if "bandcamp.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Bandcamp URL.", data={"error": "Not Bandcamp"})
    return _yt_dlp_download(url, job_dir, {"format": "bestaudio/best"})


# ─── Odysee / LBRY Downloader ─────────────────────────────────────────────────

def _handle_odysee_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste an Odysee video URL.", data={"error": "No URL"})
    if "odysee.com" not in url and "lbry.tv" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Odysee URL.", data={"error": "Not Odysee"})
    return _yt_dlp_download(url, job_dir, {"format": _social_format_for_quality(payload.get("quality"))})


# ─── Streamable Downloader ────────────────────────────────────────────────────

def _handle_streamable_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Streamable video URL.", data={"error": "No URL"})
    if "streamable.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Streamable URL.", data={"error": "Not Streamable"})
    return _yt_dlp_download(url, job_dir, {"format": _social_format_for_quality(payload.get("quality"))})


# ─── Kick Downloader ──────────────────────────────────────────────────────────

def _handle_kick_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a Kick clip URL.", data={"error": "No URL"})
    if "kick.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Kick.com URL.", data={"error": "Not Kick"})
    return _yt_dlp_download(url, job_dir, {"format": _social_format_for_quality(payload.get("quality"))})


# ─── Imgur Downloader ─────────────────────────────────────────────────────────

def _handle_imgur_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste an Imgur URL.", data={"error": "No URL"})
    if "imgur.com" not in url:
        return ExecutionResult(kind="json", message="Please enter a valid Imgur URL.", data={"error": "Not Imgur"})
    return _yt_dlp_download(url, job_dir, {"format": _social_format_for_quality(payload.get("quality"))})


# ─── YouTube Thumbnail Downloader ─────────────────────────────────────────────

def _handle_youtube_thumbnail(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a YouTube video URL.", data={"error": "No URL"})

    # Extract video ID
    vid_id = None
    patterns = [
        r"(?:v=|\/videos\/|embed\/|youtu\.be\/|\/v\/|\/e\/|watch\?v=|&v=|%2Fvideos%2F)([^#&?\\n]*)",
        r"youtu\.be\/([^?&\n#]+)",
    ]
    for p in patterns:
        m = re.search(p, url)
        if m:
            vid_id = m.group(1)
            break

    if not vid_id:
        return ExecutionResult(kind="json", message="Could not extract YouTube video ID from URL.", data={"error": "Invalid YouTube URL"})

    qualities = [
        ("maxresdefault", f"https://i.ytimg.com/vi/{vid_id}/maxresdefault.jpg"),
        ("hqdefault", f"https://i.ytimg.com/vi/{vid_id}/hqdefault.jpg"),
        ("mqdefault", f"https://i.ytimg.com/vi/{vid_id}/mqdefault.jpg"),
        ("sddefault", f"https://i.ytimg.com/vi/{vid_id}/sddefault.jpg"),
    ]

    quality = payload.get("quality", "maxresdefault")
    thumb_url = f"https://i.ytimg.com/vi/{vid_id}/{quality}.jpg"

    try:
        resp = httpx.get(thumb_url, timeout=15, follow_redirects=True)
        if resp.status_code == 200 and len(resp.content) > 1000:
            out = job_dir / f"thumbnail_{vid_id}_{quality}.jpg"
            out.write_bytes(resp.content)
            return ExecutionResult(kind="file", output_path=out, filename=f"youtube_thumb_{vid_id}.jpg", message=f"Thumbnail downloaded ({quality}) for video ID: {vid_id}")

        # Fallback to hqdefault
        for qual, turl in qualities:
            resp2 = httpx.get(turl, timeout=10, follow_redirects=True)
            if resp2.status_code == 200 and len(resp2.content) > 1000:
                out = job_dir / f"thumbnail_{vid_id}_{qual}.jpg"
                out.write_bytes(resp2.content)
                return ExecutionResult(kind="file", output_path=out, filename=f"youtube_thumb_{vid_id}.jpg", message=f"Thumbnail downloaded ({qual})")
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Could not download thumbnail: {str(e)[:200]}", data={"error": str(e)[:200]})

    return ExecutionResult(kind="json", message="Thumbnail not available for this video.", data={"error": "Not found", "video_id": vid_id})


# ─── Video Info / Metadata Extractor ─────────────────────────────────────────

def _handle_video_info(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a video URL.", data={"error": "No URL"})

    try:
        import yt_dlp
        opts = {"quiet": True, "no_warnings": True, "skip_download": True}
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)

        if not info:
            return ExecutionResult(kind="json", message="Could not extract video info.", data={"error": "No info"})

        duration = info.get("duration", 0)
        mins, secs = divmod(int(duration), 60)
        hours, mins = divmod(mins, 60)
        dur_str = f"{hours:02d}:{mins:02d}:{secs:02d}" if hours else f"{mins:02d}:{secs:02d}"

        result = {
            "title": info.get("title", "Unknown")[:200],
            "uploader": info.get("uploader", "Unknown"),
            "platform": info.get("extractor_key", "Unknown"),
            "duration": dur_str,
            "duration_seconds": duration,
            "view_count": info.get("view_count"),
            "like_count": info.get("like_count"),
            "description": (info.get("description") or "")[:300] + "...",
            "upload_date": info.get("upload_date", "Unknown"),
            "thumbnail": info.get("thumbnail"),
            "available_formats": len(info.get("formats", [])),
            "webpage_url": info.get("webpage_url", url),
        }

        return ExecutionResult(kind="json", message=f"Video info extracted for: {result['title']}", data=result)

    except Exception as e:
        return ExecutionResult(kind="json", message=f"Could not extract info: {str(e)[:200]}", data={"error": str(e)[:200]})


# ─── M3U8 / HLS Stream Downloader ─────────────────────────────────────────────

def _handle_m3u8_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste an M3U8 or HLS stream URL.", data={"error": "No URL"})
    if not (".m3u8" in url or "m3u8" in url.lower() or url.startswith("http")):
        return ExecutionResult(kind="json", message="Please enter a valid M3U8 stream URL.", data={"error": "Invalid URL"})
    return _yt_dlp_download(url, job_dir, {"format": "best", "hls_prefer_native": True})


# ─── Universal Playlist Downloader (all platforms) ────────────────────────────

def _handle_universal_playlist_downloader(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please paste a playlist URL (YouTube, SoundCloud, etc.).", data={"error": "No URL"})

    max_items = min(int(payload.get("max_items", 5)), 10)

    try:
        import yt_dlp
        import zipfile

        opts = {
            "quiet": True,
            "no_warnings": True,
            "outtmpl": str(job_dir / "%(playlist_index)02d - %(title)s.%(ext)s"),
            "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
            "playlist_items": f"1-{max_items}",
            "merge_output_format": "mp4",
        }

        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=True)
            playlist_title = info.get("title", "playlist")[:80] if info else "playlist"

        # Zip all downloaded files
        video_files = sorted(job_dir.glob("*.mp4"))
        if not video_files:
            video_files = sorted(job_dir.glob("*.*"))

        if not video_files:
            return ExecutionResult(kind="json", message="No files downloaded from playlist.", data={"error": "Empty playlist"})

        zip_path = job_dir / "playlist.zip"
        with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            for vf in video_files:
                zf.write(vf, vf.name)

        return ExecutionResult(
            kind="file",
            output_path=zip_path,
            filename=f"{playlist_title}.zip",
            message=f"Downloaded {len(video_files)} videos from playlist: {playlist_title}",
        )

    except Exception as e:
        return ExecutionResult(kind="json", message=f"Playlist download error: {str(e)[:200]}", data={"error": str(e)[:200]})


# ─── Text Diff Tool ───────────────────────────────────────────────────────────

def _handle_text_diff(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text1 = payload.get("text1", "").strip()
    text2 = payload.get("text2", "").strip()
    if not text1 or not text2:
        return ExecutionResult(kind="json", message="Please provide both texts to compare.", data={"error": "Missing text"})

    try:
        import difflib
        lines1 = text1.splitlines(keepends=True)
        lines2 = text2.splitlines(keepends=True)

        unified = list(difflib.unified_diff(lines1, lines2, fromfile="Text A", tofile="Text B", lineterm=""))
        html_diff = difflib.HtmlDiff().make_table(lines1, lines2, fromdesc="Text A", todesc="Text B", context=True)

        added = sum(1 for l in unified if l.startswith("+") and not l.startswith("+++"))
        removed = sum(1 for l in unified if l.startswith("-") and not l.startswith("---"))
        matcher = difflib.SequenceMatcher(None, text1, text2)
        similarity = round(matcher.ratio() * 100, 1)

        return ExecutionResult(
            kind="json",
            message=f"Text diff complete — {added} additions, {removed} removals, {similarity}% similar",
            data={
                "added_lines": added,
                "removed_lines": removed,
                "similarity_percent": similarity,
                "unified_diff": "\n".join(unified[:200]),
                "lines_in_a": len(lines1),
                "lines_in_b": len(lines2),
                "chars_in_a": len(text1),
                "chars_in_b": len(text2),
            },
        )
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Diff error: {str(e)}", data={"error": str(e)})


# ─── JSON Diff ────────────────────────────────────────────────────────────────

def _handle_json_diff(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    json1_str = payload.get("json1", "").strip()
    json2_str = payload.get("json2", "").strip()
    if not json1_str or not json2_str:
        return ExecutionResult(kind="json", message="Please provide both JSON objects to compare.", data={"error": "Missing JSON"})

    try:
        obj1 = json.loads(json1_str)
        obj2 = json.loads(json2_str)
    except json.JSONDecodeError as e:
        return ExecutionResult(kind="json", message=f"Invalid JSON: {str(e)}", data={"error": str(e)})

    def flatten(obj, prefix=""):
        items = {}
        if isinstance(obj, dict):
            for k, v in obj.items():
                items.update(flatten(v, f"{prefix}.{k}" if prefix else k))
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                items.update(flatten(v, f"{prefix}[{i}]"))
        else:
            items[prefix] = obj
        return items

    flat1, flat2 = flatten(obj1), flatten(obj2)
    keys1, keys2 = set(flat1.keys()), set(flat2.keys())

    added = {k: flat2[k] for k in keys2 - keys1}
    removed = {k: flat1[k] for k in keys1 - keys2}
    changed = {k: {"from": flat1[k], "to": flat2[k]} for k in keys1 & keys2 if flat1[k] != flat2[k]}

    return ExecutionResult(
        kind="json",
        message=f"JSON diff: {len(added)} added, {len(removed)} removed, {len(changed)} changed",
        data={
            "summary": {"added": len(added), "removed": len(removed), "changed": len(changed), "same": len(keys1 & keys2) - len(changed)},
            "added": added,
            "removed": removed,
            "changed": changed,
        },
    )


# ─── XML Formatter ────────────────────────────────────────────────────────────

def _handle_xml_formatter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please paste XML to format.", data={"error": "No input"})
    try:
        dom = xml.dom.minidom.parseString(text.encode("utf-8"))
        formatted = dom.toprettyxml(indent="  ")
        # Remove extra blank lines
        formatted = "\n".join([l for l in formatted.split("\n") if l.strip()])
        return ExecutionResult(kind="json", message="XML formatted successfully.", data={"output": formatted, "length": len(formatted)})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"XML parse error: {str(e)}", data={"error": str(e)})


# ─── YAML Formatter ───────────────────────────────────────────────────────────

def _handle_yaml_formatter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    if not text:
        return ExecutionResult(kind="json", message="Please paste YAML to format.", data={"error": "No input"})
    try:
        import yaml
        parsed = yaml.safe_load(text)
        formatted = yaml.dump(parsed, default_flow_style=False, allow_unicode=True, indent=2, sort_keys=False)
        return ExecutionResult(kind="json", message="YAML formatted successfully.", data={"output": formatted, "length": len(formatted)})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"YAML parse error: {str(e)}", data={"error": str(e)})


# ─── Cron Expression Parser ───────────────────────────────────────────────────

def _handle_cron_parser(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    cron = payload.get("text", "").strip()
    if not cron:
        return ExecutionResult(kind="json", message="Please enter a cron expression.", data={"error": "No input"})

    parts = cron.split()
    if len(parts) != 5:
        return ExecutionResult(kind="json", message="Invalid cron expression. Format: minute hour day month weekday", data={"error": "Wrong format"})

    field_names = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"]
    field_ranges = [(0, 59), (0, 23), (1, 31), (1, 12), (0, 6)]
    months_map = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    days_map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    def parse_field(val, mn, mx):
        if val == "*": return f"Every {field_names[field_ranges.index((mn, mx))]}"
        if "/" in val:
            _, step = val.split("/")
            return f"Every {step} (from {mn} to {mx})"
        if "-" in val:
            a, b = val.split("-")
            return f"From {a} to {b}"
        if "," in val:
            return f"At {', '.join(val.split(','))}"
        return f"At {val}"

    explanations = []
    for i, (p, name, (mn, mx)) in enumerate(zip(parts, field_names, field_ranges)):
        explanations.append(f"{name}: {p}")

    # Build human-readable description
    m, h, dom, mon, dow = parts
    desc_parts = []
    if m == "*" and h == "*":
        desc_parts.append("Every minute")
    elif m == "0" and h == "*":
        desc_parts.append("Every hour at minute 0")
    elif m != "*" and h != "*":
        desc_parts.append(f"At {h.zfill(2)}:{m.zfill(2)}")
    else:
        desc_parts.append(f"At minute {m}" if m != "*" else "Every minute")
        if h != "*":
            desc_parts.append(f"of hour {h}")

    if dom != "*":
        desc_parts.append(f"on day {dom} of the month")
    if mon != "*":
        mon_name = months_map[int(mon)] if mon.isdigit() and 1 <= int(mon) <= 12 else mon
        desc_parts.append(f"in {mon_name}")
    if dow != "*":
        dow_name = days_map[int(dow)] if dow.isdigit() and 0 <= int(dow) <= 6 else dow
        desc_parts.append(f"on {dow_name}")

    human = " ".join(desc_parts)

    return ExecutionResult(
        kind="json",
        message=f"Cron parsed: {human}",
        data={
            "expression": cron,
            "human_readable": human,
            "fields": dict(zip(field_names, parts)),
            "next_5_runs": "Use a cron scheduler to see exact run times",
        },
    )


# ─── Regex Tester ─────────────────────────────────────────────────────────────

def _handle_regex_tester(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    pattern_str = payload.get("pattern", "").strip()
    test_str = payload.get("text", "")
    flags_str = payload.get("flags", "").upper()

    if not pattern_str:
        return ExecutionResult(kind="json", message="Please enter a regex pattern.", data={"error": "No pattern"})

    import re
    flag_map = {"I": re.IGNORECASE, "M": re.MULTILINE, "S": re.DOTALL, "X": re.VERBOSE}
    flags = 0
    for f in flags_str:
        flags |= flag_map.get(f, 0)

    try:
        compiled = re.compile(pattern_str, flags)
        matches = list(compiled.finditer(test_str))
        all_matches = [{"match": m.group(), "start": m.start(), "end": m.end(), "groups": list(m.groups())} for m in matches]
        highlighted = compiled.sub(lambda m: f"[{m.group()}]", test_str) if test_str else ""

        return ExecutionResult(
            kind="json",
            message=f"Regex matched {len(matches)} time(s)",
            data={
                "pattern": pattern_str,
                "flags": flags_str,
                "match_count": len(matches),
                "matches": all_matches[:50],
                "highlighted": highlighted[:2000],
                "is_valid": True,
            },
        )
    except re.error as e:
        return ExecutionResult(kind="json", message=f"Invalid regex: {str(e)}", data={"error": str(e), "is_valid": False})


# ─── JWT Decoder ──────────────────────────────────────────────────────────────

def _handle_jwt_decoder(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    token = payload.get("text", "").strip()
    if not token:
        return ExecutionResult(kind="json", message="Please paste a JWT token.", data={"error": "No token"})

    parts = token.split(".")
    if len(parts) != 3:
        return ExecutionResult(kind="json", message="Invalid JWT — must have 3 parts separated by dots.", data={"error": "Invalid JWT"})

    def decode_part(p):
        p += "=" * (4 - len(p) % 4)
        try:
            return json.loads(base64.urlsafe_b64decode(p))
        except Exception:
            return {}

    header = decode_part(parts[0])
    payload_data = decode_part(parts[1])

    exp = payload_data.get("exp")
    iat = payload_data.get("iat")
    nbf = payload_data.get("nbf")

    now = int(time.time())
    status = "valid" if not exp or exp > now else "expired"

    return ExecutionResult(
        kind="json",
        message=f"JWT decoded — Algorithm: {header.get('alg', 'unknown')} | Status: {status}",
        data={
            "header": header,
            "payload": payload_data,
            "algorithm": header.get("alg", "unknown"),
            "status": status,
            "expires_at": datetime.utcfromtimestamp(exp).isoformat() if exp else None,
            "issued_at": datetime.utcfromtimestamp(iat).isoformat() if iat else None,
            "not_before": datetime.utcfromtimestamp(nbf).isoformat() if nbf else None,
            "note": "Signature not verified (requires secret key)",
        },
    )


# ─── Color Contrast Checker ───────────────────────────────────────────────────

def _handle_color_contrast(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    fg = payload.get("foreground", "#000000").strip().lstrip("#")
    bg = payload.get("background", "#ffffff").strip().lstrip("#")

    def hex_to_rgb(h):
        h = h.zfill(6)
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

    def relative_luminance(r, g, b):
        def channel(c):
            c /= 255
            return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

    try:
        r1, g1, b1 = hex_to_rgb(fg)
        r2, g2, b2 = hex_to_rgb(bg)
        l1 = relative_luminance(r1, g1, b1)
        l2 = relative_luminance(r2, g2, b2)
        brighter, darker = max(l1, l2), min(l1, l2)
        ratio = (brighter + 0.05) / (darker + 0.05)
        ratio_rounded = round(ratio, 2)

        aa_normal = ratio >= 4.5
        aa_large = ratio >= 3.0
        aaa_normal = ratio >= 7.0
        aaa_large = ratio >= 4.5

        return ExecutionResult(
            kind="json",
            message=f"Contrast ratio: {ratio_rounded}:1 — WCAG AA {'✓' if aa_normal else '✗'} | WCAG AAA {'✓' if aaa_normal else '✗'}",
            data={
                "foreground": f"#{fg}",
                "background": f"#{bg}",
                "contrast_ratio": ratio_rounded,
                "wcag_aa_normal": aa_normal,
                "wcag_aa_large": aa_large,
                "wcag_aaa_normal": aaa_normal,
                "wcag_aaa_large": aaa_large,
                "overall": "AAA" if aaa_normal else ("AA" if aa_normal else ("AA (large text)" if aa_large else "FAIL")),
                "recommendation": "Good contrast" if aa_normal else "Increase contrast for accessibility",
            },
        )
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Error: {str(e)}", data={"error": str(e)})


# ─── IP Subnet Calculator ─────────────────────────────────────────────────────

def _handle_ip_subnet_calculator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    cidr = payload.get("text", "").strip()
    if not cidr:
        return ExecutionResult(kind="json", message="Please enter an IP address with CIDR (e.g. 192.168.1.0/24).", data={"error": "No input"})

    try:
        net = ipaddress.ip_network(cidr, strict=False)
        hosts = list(net.hosts())
        first_host = str(hosts[0]) if hosts else str(net.network_address)
        last_host = str(hosts[-1]) if hosts else str(net.broadcast_address)

        return ExecutionResult(
            kind="json",
            message=f"Subnet: {net} | {net.num_addresses} addresses ({len(hosts)} usable hosts)",
            data={
                "network": str(net.network_address),
                "broadcast": str(net.broadcast_address),
                "subnet_mask": str(net.netmask),
                "wildcard_mask": str(net.hostmask),
                "cidr_notation": str(net),
                "prefix_length": net.prefixlen,
                "total_addresses": net.num_addresses,
                "usable_hosts": len(hosts),
                "first_host": first_host,
                "last_host": last_host,
                "ip_version": net.version,
                "is_private": net.is_private,
                "is_global": net.is_global,
                "ip_class": "A" if net.prefixlen <= 8 else ("B" if net.prefixlen <= 16 else ("C" if net.prefixlen <= 24 else "D/E")),
            },
        )
    except ValueError as e:
        return ExecutionResult(kind="json", message=f"Invalid CIDR notation: {str(e)}", data={"error": str(e)})


# ─── Hash Generator (Advanced) ────────────────────────────────────────────────

def _handle_hash_advanced(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "")
    algorithm = payload.get("algorithm", "all").lower()

    if not text:
        return ExecutionResult(kind="json", message="Please enter text to hash.", data={"error": "No input"})

    text_bytes = text.encode("utf-8")

    algos = {
        "md5": hashlib.md5(text_bytes).hexdigest(),
        "sha1": hashlib.sha1(text_bytes).hexdigest(),
        "sha224": hashlib.sha224(text_bytes).hexdigest(),
        "sha256": hashlib.sha256(text_bytes).hexdigest(),
        "sha384": hashlib.sha384(text_bytes).hexdigest(),
        "sha512": hashlib.sha512(text_bytes).hexdigest(),
        "sha3_256": hashlib.sha3_256(text_bytes).hexdigest(),
        "sha3_512": hashlib.sha3_512(text_bytes).hexdigest(),
        "blake2b": hashlib.blake2b(text_bytes).hexdigest(),
        "blake2s": hashlib.blake2s(text_bytes).hexdigest(),
    }

    if algorithm != "all" and algorithm in algos:
        result = {algorithm: algos[algorithm]}
        msg = f"{algorithm.upper()} hash generated"
    else:
        result = algos
        msg = "All hashes generated"

    result["input_length"] = len(text)
    result["input_bytes"] = len(text_bytes)

    return ExecutionResult(kind="json", message=msg, data=result)


# ─── HMAC Generator ───────────────────────────────────────────────────────────

def _handle_hmac_generator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    text = payload.get("text", "").strip()
    secret = payload.get("secret", "").strip()
    algo = payload.get("algorithm", "sha256").lower()

    if not text or not secret:
        return ExecutionResult(kind="json", message="Please provide both text and secret key.", data={"error": "Missing input"})

    import hmac as hmac_lib
    algo_map = {
        "sha256": hashlib.sha256,
        "sha512": hashlib.sha512,
        "sha1": hashlib.sha1,
        "md5": hashlib.md5,
        "sha384": hashlib.sha384,
    }
    hash_func = algo_map.get(algo, hashlib.sha256)
    mac = hmac_lib.new(secret.encode("utf-8"), text.encode("utf-8"), hash_func)

    return ExecutionResult(
        kind="json",
        message=f"HMAC-{algo.upper()} generated",
        data={
            "hmac_hex": mac.hexdigest(),
            "hmac_base64": base64.b64encode(mac.digest()).decode(),
            "algorithm": algo.upper(),
            "key_length": len(secret),
            "message_length": len(text),
        },
    )


# ─── UUID v5 Generator ────────────────────────────────────────────────────────

def _handle_uuid_v5_generator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    namespace_str = payload.get("namespace", "dns").lower()
    name = payload.get("text", "").strip()

    if not name:
        return ExecutionResult(kind="json", message="Please enter a name/value to generate UUID v5.", data={"error": "No input"})

    ns_map = {
        "dns": uuid.NAMESPACE_DNS,
        "url": uuid.NAMESPACE_URL,
        "oid": uuid.NAMESPACE_OID,
        "x500": uuid.NAMESPACE_X500,
    }
    ns = ns_map.get(namespace_str, uuid.NAMESPACE_DNS)
    result_uuid = uuid.uuid5(ns, name)

    return ExecutionResult(
        kind="json",
        message=f"UUID v5 generated for: {name}",
        data={
            "uuid_v5": str(result_uuid),
            "namespace": namespace_str,
            "name": name,
            "urn": f"urn:uuid:{result_uuid}",
            "without_hyphens": str(result_uuid).replace("-", ""),
            "note": "UUID v5 is deterministic — same namespace+name always gives the same UUID",
        },
    )


# ─── NanoID Generator ────────────────────────────────────────────────────────

def _handle_nanoid_generator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    size = min(int(payload.get("size", 21)), 128)
    count = min(int(payload.get("count", 10)), 100)
    alphabet = payload.get("alphabet", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-")

    if len(alphabet) < 2:
        return ExecutionResult(kind="json", message="Alphabet must have at least 2 characters.", data={"error": "Too short"})

    ids = ["".join(secrets.choice(alphabet) for _ in range(size)) for _ in range(count)]

    return ExecutionResult(
        kind="json",
        message=f"Generated {count} NanoID(s) of length {size}",
        data={
            "ids": ids,
            "size": size,
            "alphabet": alphabet,
            "alphabet_length": len(alphabet),
            "entropy_bits": round(size * (len(alphabet).bit_length()), 1),
        },
    )


# ─── Lorem Ipsum Generator ────────────────────────────────────────────────────

def _handle_lorem_ipsum(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    count = min(int(payload.get("count", 3)), 20)
    kind = payload.get("type", "paragraphs").lower()

    words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split()

    def gen_sentence():
        n = random.randint(8, 18)
        w = random.choices(words, k=n)
        w[0] = w[0].capitalize()
        return " ".join(w) + random.choice([".", ".", ".", "!", "?"])

    def gen_paragraph():
        return " ".join(gen_sentence() for _ in range(random.randint(4, 7)))

    if kind == "words":
        output = " ".join(random.choices(words, k=count))
    elif kind == "sentences":
        output = " ".join(gen_sentence() for _ in range(count))
    else:
        output = "\n\n".join(gen_paragraph() for _ in range(count))

    return ExecutionResult(
        kind="json",
        message=f"Generated {count} {kind}",
        data={"output": output, "word_count": len(output.split()), "char_count": len(output), "type": kind},
    )


# ─── Password Strength Checker ────────────────────────────────────────────────

def _handle_password_strength(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    password = payload.get("text", "")
    if not password:
        return ExecutionResult(kind="json", message="Please enter a password to check.", data={"error": "No password"})

    score = 0
    feedback = []

    checks = {
        "length_8": (len(password) >= 8, "At least 8 characters"),
        "length_12": (len(password) >= 12, "At least 12 characters (recommended)"),
        "length_16": (len(password) >= 16, "At least 16 characters (strong)"),
        "uppercase": (bool(re.search(r"[A-Z]", password)), "Uppercase letters"),
        "lowercase": (bool(re.search(r"[a-z]", password)), "Lowercase letters"),
        "digits": (bool(re.search(r"\d", password)), "Numbers"),
        "special": (bool(re.search(r"[!@#$%^&*()_+\-=\[\]{}|;':\",./<>?]", password)), "Special characters"),
        "no_spaces": (" " not in password, "No spaces"),
        "no_repeat": (len(set(password)) > len(password) * 0.6, "No excessive repeated characters"),
    }

    common_passwords = {"password", "123456", "qwerty", "abc123", "password1", "iloveyou", "admin", "letmein", "welcome"}
    is_common = password.lower() in common_passwords

    for key, (passed, label) in checks.items():
        if passed:
            score += 1
        else:
            feedback.append(f"Add: {label}")

    if is_common:
        score = max(0, score - 5)
        feedback.insert(0, "This is a commonly known password — change it!")

    entropy = len(set(password)) * len(password) * 0.1
    strength_map = {0: "Very Weak", 1: "Very Weak", 2: "Weak", 3: "Weak", 4: "Fair", 5: "Fair", 6: "Good", 7: "Strong", 8: "Very Strong", 9: "Excellent"}
    strength = strength_map.get(min(score, 9), "Excellent")

    return ExecutionResult(
        kind="json",
        message=f"Password Strength: {strength} ({score}/9 checks passed)",
        data={
            "strength": strength,
            "score": score,
            "max_score": 9,
            "length": len(password),
            "entropy_estimate": round(entropy, 1),
            "is_common_password": is_common,
            "feedback": feedback if feedback else ["Great password! All checks passed."],
            "has_uppercase": bool(re.search(r"[A-Z]", password)),
            "has_lowercase": bool(re.search(r"[a-z]", password)),
            "has_digits": bool(re.search(r"\d", password)),
            "has_special": bool(re.search(r"[!@#$%^&*]", password)),
            "unique_chars": len(set(password)),
        },
    )


# ─── CSS Unit Converter ───────────────────────────────────────────────────────

def _handle_css_unit_converter(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    value = float(payload.get("value", 16))
    from_unit = payload.get("from_unit", "px").lower()
    base_font_size = float(payload.get("base_font_size", 16))
    viewport_width = float(payload.get("viewport_width", 1440))
    viewport_height = float(payload.get("viewport_height", 900))

    # Convert everything to px first
    to_px = {
        "px": value,
        "rem": value * base_font_size,
        "em": value * base_font_size,
        "pt": value * (96 / 72),
        "pc": value * 16,
        "cm": value * 37.7953,
        "mm": value * 3.77953,
        "in": value * 96,
        "vw": value * viewport_width / 100,
        "vh": value * viewport_height / 100,
        "vmin": value * min(viewport_width, viewport_height) / 100,
        "vmax": value * max(viewport_width, viewport_height) / 100,
    }
    px_val = to_px.get(from_unit, value)

    results = {
        "px": round(px_val, 4),
        "rem": round(px_val / base_font_size, 4),
        "em": round(px_val / base_font_size, 4),
        "pt": round(px_val * 72 / 96, 4),
        "pc": round(px_val / 16, 4),
        "cm": round(px_val / 37.7953, 4),
        "mm": round(px_val / 3.77953, 4),
        "in": round(px_val / 96, 4),
        "vw": round(px_val / viewport_width * 100, 4),
        "vh": round(px_val / viewport_height * 100, 4),
    }

    return ExecutionResult(
        kind="json",
        message=f"{value}{from_unit} converted to all CSS units",
        data={
            "input": f"{value}{from_unit}",
            "conversions": results,
            "settings": {"base_font_size": base_font_size, "viewport": f"{viewport_width}x{viewport_height}"},
        },
    )


# ─── HTTP Headers Viewer ─────────────────────────────────────────────────────

def _handle_http_headers(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    url = payload.get("url", "").strip()
    if not url:
        return ExecutionResult(kind="json", message="Please enter a URL to check headers.", data={"error": "No URL"})
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        resp = httpx.head(url, timeout=15, follow_redirects=True)
        headers = dict(resp.headers)
        security_headers = {
            "strict-transport-security": headers.get("strict-transport-security", "Missing ⚠️"),
            "content-security-policy": headers.get("content-security-policy", "Missing ⚠️"),
            "x-frame-options": headers.get("x-frame-options", "Missing ⚠️"),
            "x-content-type-options": headers.get("x-content-type-options", "Missing ⚠️"),
            "referrer-policy": headers.get("referrer-policy", "Missing ⚠️"),
            "permissions-policy": headers.get("permissions-policy", "Missing ⚠️"),
        }
        return ExecutionResult(
            kind="json",
            message=f"HTTP {resp.status_code} — {len(headers)} headers found for {url}",
            data={
                "url": url,
                "status_code": resp.status_code,
                "all_headers": headers,
                "security_headers": security_headers,
                "server": headers.get("server", "Unknown"),
                "content_type": headers.get("content-type", "Unknown"),
                "cache_control": headers.get("cache-control", "Not set"),
                "x_powered_by": headers.get("x-powered-by", "Hidden"),
            },
        )
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Could not reach URL: {str(e)[:200]}", data={"error": str(e)[:200]})


# ─── Port Checker ─────────────────────────────────────────────────────────────

def _handle_port_checker(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    host = payload.get("host", "").strip()
    port = int(payload.get("port", 80))

    if not host:
        return ExecutionResult(kind="json", message="Please enter a hostname or IP address.", data={"error": "No host"})

    if port < 1 or port > 65535:
        return ExecutionResult(kind="json", message="Port must be between 1 and 65535.", data={"error": "Invalid port"})

    common_ports = {
        21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
        80: "HTTP", 110: "POP3", 143: "IMAP", 443: "HTTPS", 587: "SMTP TLS",
        993: "IMAPS", 995: "POP3S", 3306: "MySQL", 5432: "PostgreSQL",
        6379: "Redis", 8080: "HTTP Alt", 27017: "MongoDB", 3389: "RDP",
    }

    service = common_ports.get(port, "Unknown service")

    try:
        start = time.time()
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((host, port))
        sock.close()
        elapsed_ms = round((time.time() - start) * 1000, 1)
        is_open = result == 0

        return ExecutionResult(
            kind="json",
            message=f"Port {port} on {host} is {'OPEN ✓' if is_open else 'CLOSED ✗'} ({elapsed_ms}ms)",
            data={
                "host": host,
                "port": port,
                "status": "open" if is_open else "closed",
                "service": service,
                "response_time_ms": elapsed_ms,
            },
        )
    except socket.gaierror:
        return ExecutionResult(kind="json", message=f"Cannot resolve hostname: {host}", data={"error": "DNS lookup failed"})
    except Exception as e:
        return ExecutionResult(kind="json", message=f"Port check error: {str(e)[:200]}", data={"error": str(e)[:200]})


# ─── NanoID / CUID Generator ──────────────────────────────────────────────────

def _handle_cuid_generator(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    count = min(int(payload.get("count", 5)), 50)

    def make_cuid():
        ts = format(int(time.time() * 1000), "x")
        rand_part = "".join(random.choices(string.ascii_lowercase + string.digits, k=24))
        return f"c{ts}{rand_part}"

    ids = [make_cuid() for _ in range(count)]
    return ExecutionResult(
        kind="json",
        message=f"Generated {count} CUID(s)",
        data={"ids": ids, "count": count, "format": "cuid"},
    )


# ─── MAC Address Lookup ───────────────────────────────────────────────────────

def _handle_mac_lookup(files: list[Path], payload: dict[str, Any], job_dir: Path) -> ExecutionResult:
    mac = payload.get("text", "").strip().replace("-", ":").replace(".", ":").upper()
    if not mac:
        return ExecutionResult(kind="json", message="Please enter a MAC address.", data={"error": "No input"})

    # Normalize MAC
    clean = re.sub(r"[^0-9A-F]", "", mac)
    if len(clean) < 6:
        return ExecutionResult(kind="json", message="Invalid MAC address. Provide at least 6 hex characters (OUI prefix).", data={"error": "Too short"})

    oui = clean[:6]
    formatted_oui = f"{oui[0:2]}:{oui[2:4]}:{oui[4:6]}"

    # Known OUI vendor prefix lookup (top 50 vendors)
    oui_db = {
        "00005E": "IANA (Internet Assigned Numbers Authority)", "0000F0": "Samsung Electronics",
        "000C29": "VMware (Virtual Machines)", "001A2B": "Cisco Systems",
        "001C42": "Parallels (Virtual Machines)", "001E65": "Apple Inc.",
        "002248": "Apple Inc.", "0050F2": "Microsoft Corporation",
        "10DEDE": "Apple Inc.", "18AF61": "Apple Inc.", "1C1B68": "Apple Inc.",
        "24A074": "Apple Inc.", "2CF0A2": "Apple Inc.", "3C970E": "Apple Inc.",
        "4C3275": "Apple Inc.", "60F81D": "Apple Inc.", "68D93C": "Apple Inc.",
        "78D75F": "Apple Inc.", "8C2937": "Apple Inc.", "9CB6D0": "Apple Inc.",
        "B0659F": "Apple Inc.", "C82A14": "Apple Inc.", "D49A20": "Apple Inc.",
        "E47F42": "Apple Inc.", "F45C89": "Apple Inc.", "FC253F": "Apple Inc.",
        "001E58": "Samsung Electronics", "001247": "Intel Corporate",
        "00215D": "Huawei Technologies", "001470": "Huawei Technologies",
        "0025BB": "Huawei Technologies", "4C6641": "Huawei Technologies",
        "08003E": "Motorola Inc.", "001CE6": "Cisco Systems",
        "001CBF": "Cisco-Linksys", "00E04C": "Realtek Semiconductor",
        "000E8F": "Serconet Ltd.", "00A0CC": "Lite-On Communications",
        "00508D": "Motorola Inc.", "080058": "Apple Computer",
        "00000D": "Xerox Corporation", "00000E": "Fujitsu",
        "000086": "Megahertz Corporation", "0000A6": "Network General",
        "0000BA": "Siemens Nixdorf", "0000BC": "Allen-Bradley",
        "00001D": "Cabletron Systems", "000020": "3COM Corporation",
        "000022": "Visual Technology", "000050": "Radisys Corp",
    }

    vendor = oui_db.get(oui, "Unknown Vendor")

    # Try API lookup for better results
    try:
        resp = httpx.get(f"https://api.macvendors.com/{formatted_oui}", timeout=5)
        if resp.status_code == 200:
            vendor = resp.text.strip()
    except Exception:
        pass

    full_mac_formatted = ":".join([clean[i:i+2] for i in range(0, min(12, len(clean)), 2)])

    return ExecutionResult(
        kind="json",
        message=f"MAC {formatted_oui} → {vendor}",
        data={
            "mac_address": full_mac_formatted or f"{formatted_oui}:XX:XX:XX",
            "oui_prefix": formatted_oui,
            "vendor": vendor,
            "vendor_found": vendor != "Unknown Vendor",
            "mac_type": "Multicast" if int(clean[0:2], 16) & 1 else "Unicast",
            "scope": "Locally Administered" if int(clean[0:2], 16) & 2 else "Globally Unique",
            "note": "OUI (first 3 bytes) identifies the device manufacturer",
        },
    )


# ─── REGISTER ALL HANDLERS ────────────────────────────────────────────────────

SOCIAL_VIDEO_HANDLERS: dict[str, Any] = {
    # Social Video Downloaders
    "pinterest-downloader": _handle_pinterest_downloader,
    "reddit-downloader": _handle_reddit_downloader,
    "reddit-video-downloader": _handle_reddit_downloader,
    "twitch-downloader": _handle_twitch_downloader,
    "twitch-clip-downloader": _handle_twitch_downloader,
    "twitch-vod-downloader": _handle_twitch_downloader,
    "linkedin-video-downloader": _handle_linkedin_downloader,
    "bilibili-downloader": _handle_bilibili_downloader,
    "rumble-downloader": _handle_rumble_downloader,
    "soundcloud-downloader": _handle_soundcloud_downloader,
    "mixcloud-downloader": _handle_mixcloud_downloader,
    "bandcamp-downloader": _handle_bandcamp_downloader,
    "odysee-downloader": _handle_odysee_downloader,
    "streamable-downloader": _handle_streamable_downloader,
    "kick-downloader": _handle_kick_downloader,
    "imgur-downloader": _handle_imgur_downloader,
    "universal-playlist-downloader": _handle_universal_playlist_downloader,
    "m3u8-downloader": _handle_m3u8_downloader,
    "youtube-thumbnail-downloader": _handle_youtube_thumbnail,
    "video-info": _handle_video_info,
    "video-metadata-extractor": _handle_video_info,

    # Developer Tools
    "text-diff": _handle_text_diff,
    "text-compare": _handle_text_diff,
    "json-diff": _handle_json_diff,
    "xml-formatter": _handle_xml_formatter,
    "yaml-formatter": _handle_yaml_formatter,
    "cron-expression-parser": _handle_cron_parser,
    "cron-parser": _handle_cron_parser,
    "regex-tester": _handle_regex_tester,
    "regex-tester-advanced": _handle_regex_tester,
    "jwt-decoder": _handle_jwt_decoder,
    "jwt-decoder-advanced": _handle_jwt_decoder,
    "color-contrast-checker": _handle_color_contrast,
    "wcag-contrast-checker": _handle_color_contrast,
    "ip-subnet-calculator": _handle_ip_subnet_calculator,
    "cidr-calculator": _handle_ip_subnet_calculator,
    "http-headers-checker": _handle_http_headers,
    "http-headers-viewer": _handle_http_headers,
    "port-checker": _handle_port_checker,
    "port-scanner": _handle_port_checker,

    # Security / Crypto Tools
    "hash-generator-advanced": _handle_hash_advanced,
    "multi-hash-generator": _handle_hash_advanced,
    "hmac-generator": _handle_hmac_generator,
    "password-strength-checker": _handle_password_strength,
    "password-analyzer": _handle_password_strength,
    "uuid-v5-generator": _handle_uuid_v5_generator,
    "nanoid-generator": _handle_nanoid_generator,
    "cuid-generator": _handle_cuid_generator,

    # Text / Content Tools
    "lorem-ipsum-generator": _handle_lorem_ipsum,
    "placeholder-text-generator": _handle_lorem_ipsum,
    "css-unit-converter": _handle_css_unit_converter,
    "px-to-rem-converter": _handle_css_unit_converter,

    # Network / Lookup Tools
    "mac-address-lookup": _handle_mac_lookup,
    "mac-address-finder": _handle_mac_lookup,
    "oui-lookup": _handle_mac_lookup,
}


def register_social_video_handlers() -> int:
    """Register all social video and new tool handlers into the main HANDLERS dict."""
    registered = 0
    for slug, handler in SOCIAL_VIDEO_HANDLERS.items():
        if slug not in HANDLERS:
            HANDLERS[slug] = handler
            registered += 1
    return registered
