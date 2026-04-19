# Skill: video-editing

## Purpose
Provides video editing guidance, FFmpeg commands, automated video processing scripts, trim/merge/compress operations, subtitle generation, thumbnail creation, and format conversion for video content creators and developers.

## When to Use
- Need to trim, cut, or merge video files
- Need to compress video for upload limits
- Need to add subtitles or captions to a video
- Need to convert video formats (MP4, AVI, MOV, WebM)
- Need to extract audio from a video
- Need to create a thumbnail from a video frame
- Need to create a GIF from a video clip

## FFmpeg Command Reference

### Installation
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows: Download from ffmpeg.org
# Verify
ffmpeg -version
```

### Essential Commands

#### Video Compression
```bash
# Compress video (H.264, reasonable quality)
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset medium output.mp4

# CRF values: 18=high quality(large), 23=default, 28=smaller file
# preset: ultrafast, fast, medium, slow, veryslow

# Compress for web (target bitrate)
ffmpeg -i input.mp4 -b:v 1M -b:a 128k output.mp4

# For YouTube (recommended settings)
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v libx264 -crf 18 \
  -c:a aac -b:a 192k -movflags +faststart youtube_ready.mp4
```

#### Trim Video
```bash
# Trim from 00:00:30 to 00:01:00 (30 seconds)
ffmpeg -i input.mp4 -ss 00:00:30 -to 00:01:00 -c copy trimmed.mp4

# Trim from start to 2 minutes 30 seconds
ffmpeg -i input.mp4 -t 00:02:30 -c copy first_150s.mp4

# Cut specific segment (10 seconds starting at 1 minute)
ffmpeg -i input.mp4 -ss 00:01:00 -t 10 -c copy segment.mp4
```

#### Merge Multiple Videos
```bash
# Create a concat list
echo "file 'video1.mp4'
file 'video2.mp4'
file 'video3.mp4'" > filelist.txt

# Merge (same codec)
ffmpeg -f concat -safe 0 -i filelist.txt -c copy merged.mp4
```

#### Format Conversion
```bash
# MP4 to WebM (smaller for web)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 31 -b:v 0 output.webm

# Video to GIF (high quality)
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos" \
  -gifflags +transdiff output.gif

# MOV to MP4 (iPhone videos)
ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4
```

#### Extract Audio
```bash
# Extract MP3 from video
ffmpeg -i input.mp4 -q:a 0 -map a output.mp3

# Extract high-quality WAV
ffmpeg -i input.mp4 -vn -acodec pcm_s16le output.wav
```

#### Add Subtitles
```bash
# Burn subtitles into video (SRT file)
ffmpeg -i input.mp4 -vf subtitles=subtitle.srt output.mp4

# Add as separate track (soft subtitles, can be toggled)
ffmpeg -i input.mp4 -i subtitle.srt -c copy \
  -c:s mov_text output_with_subs.mp4
```

#### Create Thumbnail
```bash
# Extract frame at 10 seconds
ffmpeg -i input.mp4 -ss 00:00:10 -frames:v 1 thumbnail.jpg

# Extract best frame from first 10 seconds
ffmpeg -i input.mp4 -vf "select=gt(scene\,0.3)" \
  -frames:v 1 -vsync vfr best_scene.jpg
```

#### Video Resize
```bash
# Resize to 1080p
ffmpeg -i input.mp4 -vf scale=1920:1080 output_1080p.mp4

# Resize to specific width, maintain aspect ratio
ffmpeg -i input.mp4 -vf scale=720:-1 output_720w.mp4

# Resize for Instagram Reels (9:16)
ffmpeg -i input.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" insta_reel.mp4
```

## Python Video Processing (moviepy)
```python
from moviepy.editor import VideoFileClip, concatenate_videoclips, TextClip, CompositeVideoClip

def compress_video(input_path: str, output_path: str, target_bitrate: str = "800k") -> dict:
    """Compress video using moviepy"""
    clip = VideoFileClip(input_path)
    clip.write_videofile(
        output_path,
        codec='libx264',
        bitrate=target_bitrate,
        audio_codec='aac',
        audio_bitrate='128k',
    )
    clip.close()
    
    original_size = os.path.getsize(input_path) / (1024 * 1024)
    output_size = os.path.getsize(output_path) / (1024 * 1024)
    
    return {
        "original_mb": round(original_size, 2),
        "compressed_mb": round(output_size, 2),
        "reduction_pct": round((1 - output_size/original_size) * 100, 1)
    }

def add_text_overlay(video_path: str, text: str, output_path: str) -> None:
    """Add text watermark to video"""
    video = VideoFileClip(video_path)
    txt_clip = (TextClip(text, fontsize=40, color='white', font='Arial')
                .set_position(('right', 'bottom'))
                .set_duration(video.duration))
    result = CompositeVideoClip([video, txt_clip])
    result.write_videofile(output_path, codec='libx264')
```

## Video Format Reference
```
Format  Container  Best For          Compatibility
MP4     .mp4       Universal         ★★★★★ (all devices)
WebM    .webm      Web streaming     ★★★★ (browsers)
MOV     .mov       Apple devices     ★★★ (Mac/iPhone)
AVI     .avi       Windows legacy    ★★★ (Windows)
MKV     .mkv       Storage/quality   ★★★★ (media players)
WebM VP9 .webm    Smallest size     ★★★ (browsers only)
```

## Optimal Settings by Platform
```
YouTube:   H.264, 1080p, 8-12 Mbps, AAC 192kbps, MP4
Instagram: H.264, 1080×1080 or 1080×1920, 3.5 Mbps
TikTok:    H.264, 1080×1920, < 150MB, 60fps supported
Twitter/X: H.264, 1280×720 min, 40 Mbps max, 2:20 limit
LinkedIn:  H.264, 4096×4096 max, 200MB limit, MP4
WhatsApp:  H.264, 16MB limit, AAC audio
```

## Related Skills
- `video-js` — programmatic animated video creation
- `storyboard` — planning video content
- `content-machine` — video content strategy
- `photo-editor` — thumbnail creation
