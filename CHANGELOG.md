# Changelog

## 2026-04-29

- Added a backend recovery response for registry/worker drift so tools no longer expose raw "handler is not implemented" failures.
- Expanded downloader slug aliases for common YouTube, Instagram, Facebook, X/Twitter, Reddit, Pinterest, Spotify, SoundCloud, and universal video downloader URLs.
- Hardened frontend API errors so implementation details and stack-style failures are converted into user-friendly recovery guidance.
- Added production-friendly `start` scripts at the root and frontend package level for Vercel/runtime checks.
- Strengthened video and social downloader recovery with platform-specific fallback chains, sanitized yt-dlp errors, Cobalt mirror attempts, and final recovery-mode JSON instead of dead-end failures.
- Added a browser-side generic recovery fallback for text/URL tools so failed or offline backend calls still return a useful local summary with detected URLs and next steps.
- Expanded the smart directory priority model to cover all 61 live categories in student-first, everyday-user, then advanced-tool order, and removed the last dead priority slug.
- Added visible recovery-mode result messaging and backend `X-Tool-Recovery` metadata so fallback results are shown as graceful degraded output instead of scary failures.
- Fixed downloader fallback regressions in Facebook, Vimeo, and Dailymotion paths so each ends in the correct platform-specific recovery chain.
- Re-pinned 44 critical video/social downloader slugs after all handler packs load, preventing older modules from overriding the hardened downloader implementations.
- Added bundled `imageio-ffmpeg` support and newer `yt-dlp` minimums so Vercel installs a merge-capable downloader stack instead of relying on a system ffmpeg binary.
- Converted the remaining 52 catalog-only text/security tools into real backend handlers, eliminating the remaining "handler is not implemented" gap across the live catalog.
- Added the new Python to PDF tool with safe `.py` upload/paste support, line numbers, outline summary, PDF fallback generation, frontend fields, aliases, and catalog fallback entry.
