# Skill: photo-editor

## Purpose
Guides and implements photo editing operations — color correction, resizing, cropping, filters, background removal, watermarking, collage creation, and format conversion — using Python Pillow and OpenCV for backend processing.

## When to Use
- Need to process images programmatically (resize, crop, compress)
- Need to apply filters or effects to photos
- Need to remove or replace backgrounds
- Need to add watermarks or text to images
- Need to create a photo collage from multiple images
- Need to correct colors, brightness, or contrast

## Core Operations (Pillow)

### Image Loading and Basic Operations
```python
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw, ImageFont

def load_and_process(path: str) -> Image.Image:
    img = Image.open(path)
    # Convert to consistent mode
    if img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGB')
    return img

# Resize with aspect ratio preserved
def resize_with_ratio(img: Image.Image, max_width: int, max_height: int) -> Image.Image:
    img.thumbnail((max_width, max_height), Image.LANCZOS)
    return img

# Crop to specific dimensions (center crop)
def center_crop(img: Image.Image, width: int, height: int) -> Image.Image:
    left = (img.width - width) // 2
    top = (img.height - height) // 2
    return img.crop((left, top, left + width, top + height))
```

### Color Adjustments
```python
from PIL import ImageEnhance

def adjust_brightness(img: Image.Image, factor: float) -> Image.Image:
    """factor: 0.5=darker, 1.0=original, 1.5=brighter"""
    return ImageEnhance.Brightness(img).enhance(factor)

def adjust_contrast(img: Image.Image, factor: float) -> Image.Image:
    """factor: 0.5=less contrast, 1.0=original, 1.5=more contrast"""
    return ImageEnhance.Contrast(img).enhance(factor)

def adjust_saturation(img: Image.Image, factor: float) -> Image.Image:
    """factor: 0.0=grayscale, 1.0=original, 2.0=vivid"""
    return ImageEnhance.Color(img).enhance(factor)

def adjust_sharpness(img: Image.Image, factor: float) -> Image.Image:
    """factor: 0.0=blurry, 1.0=original, 2.0=very sharp"""
    return ImageEnhance.Sharpness(img).enhance(factor)
```

### Filters
```python
from PIL import ImageFilter
import numpy as np

def apply_blur(img: Image.Image, radius: int = 2) -> Image.Image:
    return img.filter(ImageFilter.GaussianBlur(radius))

def apply_sharpen(img: Image.Image) -> Image.Image:
    return img.filter(ImageFilter.SHARPEN)

def apply_grayscale(img: Image.Image) -> Image.Image:
    return img.convert('L').convert('RGB')

def apply_sepia(img: Image.Image) -> Image.Image:
    img_array = np.array(img.convert('RGB'), dtype=float)
    r = img_array[:,:,0]; g = img_array[:,:,1]; b = img_array[:,:,2]
    out = np.zeros_like(img_array)
    out[:,:,0] = np.clip(r*0.393 + g*0.769 + b*0.189, 0, 255)
    out[:,:,1] = np.clip(r*0.349 + g*0.686 + b*0.168, 0, 255)
    out[:,:,2] = np.clip(r*0.272 + g*0.534 + b*0.131, 0, 255)
    return Image.fromarray(out.astype(np.uint8))

def apply_vintage(img: Image.Image) -> Image.Image:
    """Warm sepia + slight vignette"""
    sepia = apply_sepia(img)
    return ImageEnhance.Contrast(sepia).enhance(0.85)
```

### Watermarking
```python
def add_text_watermark(
    img: Image.Image,
    text: str,
    opacity: int = 128,  # 0-255
    position: str = "center"  # center, bottom-right, bottom-left, top-right
) -> Image.Image:
    img = img.convert("RGBA")
    watermark = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(watermark)
    
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
    except:
        font = ImageFont.load_default()
    
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    positions = {
        "center": ((img.width - text_width) // 2, (img.height - text_height) // 2),
        "bottom-right": (img.width - text_width - 20, img.height - text_height - 20),
        "bottom-left": (20, img.height - text_height - 20),
        "top-right": (img.width - text_width - 20, 20),
    }
    pos = positions.get(position, positions["center"])
    
    draw.text(pos, text, fill=(255, 255, 255, opacity), font=font)
    return Image.alpha_composite(img, watermark).convert("RGB")
```

### Background Removal (rembg)
```python
from rembg import remove

def remove_background(input_path: str, output_path: str) -> None:
    """Remove background from image, output PNG with transparency"""
    with open(input_path, 'rb') as f:
        input_data = f.read()
    output_data = remove(input_data)
    with open(output_path, 'wb') as f:
        f.write(output_data)
```

### Image Compression
```python
def compress_image(
    input_path: str,
    output_path: str,
    max_size_kb: int = 200,
    quality: int = 85
) -> dict:
    img = Image.open(input_path).convert('RGB')
    original_size = os.path.getsize(input_path)
    
    # Try progressively lower quality if needed
    for q in [quality, 75, 65, 55, 45]:
        img.save(output_path, 'JPEG', quality=q, optimize=True)
        new_size = os.path.getsize(output_path)
        if new_size <= max_size_kb * 1024:
            break
    
    return {
        "original_kb": round(original_size / 1024, 1),
        "compressed_kb": round(new_size / 1024, 1),
        "reduction_pct": round((1 - new_size/original_size) * 100, 1),
        "final_quality": q
    }
```

### Collage Creator
```python
def create_collage(
    images: list[Image.Image],
    cols: int = 2,
    padding: int = 10,
    bg_color: tuple = (255, 255, 255)
) -> Image.Image:
    rows = (len(images) + cols - 1) // cols
    cell_w = max(img.width for img in images)
    cell_h = max(img.height for img in images)
    total_w = cols * cell_w + (cols + 1) * padding
    total_h = rows * cell_h + (rows + 1) * padding
    
    canvas = Image.new('RGB', (total_w, total_h), bg_color)
    for i, img in enumerate(images):
        row, col = divmod(i, cols)
        x = col * (cell_w + padding) + padding
        y = row * (cell_h + padding) + padding
        canvas.paste(img.resize((cell_w, cell_h), Image.LANCZOS), (x, y))
    return canvas
```

## Supported Image Formats
```
Read: JPEG, PNG, WebP, GIF, BMP, TIFF, ICO, HEIC, PSD, SVG, AVIF
Write: JPEG, PNG, WebP, GIF, BMP, TIFF, ICO, AVIF
```

## Image Size Presets (Social Media)

### Indian Social Media Standard Sizes
```python
PRESETS = {
    "instagram_post": (1080, 1080),
    "instagram_story": (1080, 1920),
    "instagram_landscape": (1080, 566),
    "whatsapp_dp": (640, 640),
    "youtube_thumbnail": (1280, 720),
    "youtube_banner": (2560, 1440),
    "linkedin_post": (1200, 627),
    "twitter_post": (1200, 675),
    "facebook_cover": (851, 315),
    "a4_300dpi": (2480, 3508),
    "passport_photo": (413, 531),  # 3.5cm × 4.5cm at 300 DPI
}
```

## Related Skills
- `file-converter` — format conversion
- `frontend-design` — displaying processed images
- `media-generation` — AI image generation
- `pdf` — image to PDF workflows
