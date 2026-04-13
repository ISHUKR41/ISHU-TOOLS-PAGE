"""
Master Handlers Registry - ISHU TOOLS
Consolidates all tool handlers from multiple files into one registry
"""
from __future__ import annotations
from pathlib import Path
from typing import Any, Callable

# Import all handler functions from different modules
from .handlers import (
    # PDF Core
    handle_merge_pdf, handle_split_pdf, handle_compress_pdf, handle_rotate_pdf,
    handle_organize_pdf, handle_crop_pdf, handle_watermark_pdf, handle_page_numbers_pdf,
    handle_protect_pdf, handle_unlock_pdf, handle_redact_pdf, handle_compare_pdf,
    handle_extract_text_pdf, handle_extract_images_pdf, handle_pdf_to_jpg, handle_pdf_to_png,
    handle_jpg_to_pdf, handle_image_to_pdf, handle_repair_pdf, handle_translate_pdf,
    handle_summarize_pdf,
    
    # Image Core
    handle_compress_image, handle_resize_image, handle_crop_image, handle_rotate_image,
    handle_convert_image, handle_watermark_image, handle_grayscale_image, handle_blur_image,
    handle_pixelate_image, handle_meme_generator,
    
    # Document Convert
    handle_pdf_to_image, handle_html_to_pdf, handle_md_to_pdf, handle_txt_to_pdf,
    handle_summarize_text, handle_translate_text, handle_qr_code_generator,
    handle_extract_metadata, handle_remove_metadata_image, handle_edit_metadata_image,
    
    # Page Operations
    handle_extract_pages, handle_delete_pages, handle_rearrange_pages, handle_resize_pages_pdf,
    handle_add_text_pdf, handle_header_footer_pdf, handle_whiteout_pdf, handle_remove_metadata_pdf,
    handle_grayscale_pdf,
    
    # Format Conversions
    handle_png_to_pdf, handle_webp_to_pdf, handle_gif_to_pdf, handle_bmp_to_pdf,
    handle_create_pdf, handle_url_to_pdf, handle_jpg_to_png, handle_png_to_jpg,
    handle_image_to_webp,
    
    # Data Export
    handle_pdf_to_txt, handle_pdf_to_markdown, handle_pdf_to_json, handle_pdf_to_csv,
    handle_json_to_pdf, handle_xml_to_pdf, handle_csv_to_pdf,
    
    # Image Layout
    handle_flip_image, handle_add_border_image, handle_thumbnail_image, handle_image_collage,
    
    # Text Operations
    handle_word_count_text, handle_case_converter_text, handle_extract_keywords_text,
    handle_slug_generator_text,
    
    # Archive Operations
    handle_pdf_pages_to_zip, handle_zip_images_to_pdf,
    
    # PDF Insights
    handle_pdf_page_count, handle_reverse_pdf, handle_flatten_pdf, handle_pdf_to_html,
    handle_pdf_to_bmp, handle_pdf_to_gif,
    
    # Image Enhancement
    handle_sharpen_image, handle_brighten_image, handle_contrast_image, handle_invert_image,
    handle_posterize_image, handle_image_histogram,
    
    # Text Cleanup
    handle_remove_extra_spaces_text, handle_sort_lines_text, handle_deduplicate_lines_text,
    handle_find_replace_text, handle_split_text_file, handle_reading_time_text,
    
    # Batch Automation
    handle_images_to_zip, handle_batch_convert_images, handle_merge_text_files,
    handle_json_prettify,
)

# Import from production_handlers
from .production_handlers import (
    handle_pdf_to_word, handle_word_to_pdf, handle_pdf_to_powerpoint, handle_powerpoint_to_pdf,
    handle_pdf_to_excel, handle_excel_to_pdf, handle_remove_background, handle_blur_face,
    handle_flip_image, handle_add_border_image, handle_thumbnail_image, handle_image_collage,
    handle_word_count_text, handle_case_converter_text, handle_extract_keywords_text,
    handle_slug_generator_text, handle_pdf_pages_to_zip, handle_zip_images_to_pdf,
)

# Import production-grade core handlers with maximum accuracy
from .production_core_handlers import PRODUCTION_CORE_HANDLERS

# Import from pdf_advanced_handlers
from .pdf_advanced_handlers import (
    handle_sign_pdf, handle_edit_metadata_pdf, handle_pdf_to_pdfa,
    handle_scan_to_pdf, handle_chat_with_pdf, handle_upscale_image,
    handle_add_image_pdf,
)

# Import from complete_handlers
from .complete_handlers import (
    handle_html_to_image, handle_reduce_image_size_in_kb, handle_compress_to_kb,
    handle_passport_photo_maker, handle_passport_size_photo, handle_social_media_resize,
    handle_resize_for_instagram, handle_resize_for_whatsapp, handle_resize_for_youtube,
    handle_instagram_grid, handle_convert_to_jpg_image, handle_convert_from_jpg_image,
    handle_heic_to_jpg, handle_webp_to_jpg, handle_jpeg_to_png, handle_png_to_jpeg,
    handle_photo_editor, handle_unblur_image, handle_increase_image_quality,
    handle_beautify_image, handle_retouch_image, handle_super_resolution,
    handle_zoom_out_image, handle_add_white_border_image, handle_freehand_crop,
    handle_crop_png, handle_a4_size_resize, handle_check_dpi,
    handle_color_code_from_image, handle_view_metadata, handle_remove_image_metadata,
)

# Import from missing_handlers
from .missing_handlers import (
    handle_djvu_to_pdf, handle_ai_to_pdf, handle_pdf_to_mobi, handle_mobi_to_pdf,
    handle_xps_to_pdf, handle_wps_to_pdf, handle_dwg_to_pdf, handle_dxf_to_pdf,
    handle_pub_to_pdf, handle_hwp_to_pdf, handle_chm_to_pdf, handle_pages_to_pdf,
)

# Import from extended_handlers
from .extended_handlers import (
    handle_ocr_image, handle_ocr_pdf, handle_image_to_text,
    handle_jpg_to_text, handle_png_to_text, handle_pdf_ocr,
    handle_pixelate_face, handle_blur_background, handle_add_text_image,
    handle_add_logo_image, handle_join_images, handle_split_image,
    handle_circle_crop_image, handle_square_crop_image, handle_motion_blur_image,
    handle_convert_dpi, handle_resize_image_in_cm, handle_resize_image_in_mm,
    handle_resize_image_in_inch, handle_add_name_dob_image,
    handle_merge_photo_signature, handle_black_and_white_image,
    handle_censor_photo, handle_picture_to_pixel_art, handle_generate_signature,
)

# Import from ebook_handlers
from .ebook_handlers import (
    handle_pdf_to_tiff, handle_tiff_to_pdf, handle_pdf_to_svg, handle_svg_to_pdf,
    handle_pdf_to_rtf, handle_rtf_to_pdf, handle_pdf_to_odt, handle_odt_to_pdf,
    handle_pdf_to_epub, handle_epub_to_pdf, handle_optimize_pdf,
    handle_convert_to_pdf, handle_convert_from_pdf, handle_pdf_converter,
)

# Import from specialized_handlers
from .specialized_handlers import (
    handle_eml_to_pdf, handle_fb2_to_pdf, handle_cbz_to_pdf, handle_ebook_to_pdf,
    handle_heic_to_pdf, handle_heif_to_pdf, handle_jfif_to_pdf,
    handle_zip_to_pdf, handle_cbr_to_pdf,
    handle_pdf_security, handle_ai_summarizer, handle_pdf_viewer, handle_pdf_intelligence,
    handle_edit_pdf, handle_annotate_pdf, handle_highlight_pdf, handle_pdf_filler,
    handle_remove_pages, handle_add_page_numbers, handle_add_watermark,
)

# Create the master HANDLERS dictionary
HANDLERS: dict[str, Callable[[list[Path], dict[str, Any], Path], ExecutionResult]] = {
    # PDF Core Operations - PRODUCTION GRADE (High Accuracy)
    **PRODUCTION_CORE_HANDLERS,  # Includes: merge-pdf, split-pdf, compress-pdf, pdf-to-jpg, jpg-to-pdf, rotate-pdf, watermark-pdf, protect-pdf, unlock-pdf, compress-image, resize-image
    
    # PDF Core Operations (Remaining)
    "organize-pdf": handle_organize_pdf,
    "crop-pdf": handle_crop_pdf,
    "page-numbers-pdf": handle_page_numbers_pdf,
    "redact-pdf": handle_redact_pdf,
    "compare-pdf": handle_compare_pdf,
    "extract-text-pdf": handle_extract_text_pdf,
    "extract-images-pdf": handle_extract_images_pdf,
    "pdf-to-png": handle_pdf_to_png,
    "image-to-pdf": handle_image_to_pdf,
    "repair-pdf": handle_repair_pdf,
    "translate-pdf": handle_translate_pdf,
    "summarize-pdf": handle_summarize_pdf,
    
    # Image Core Operations (Remaining)
    "crop-image": handle_crop_image,
    "rotate-image": handle_rotate_image,
    "convert-image": handle_convert_image,
    "watermark-image": handle_watermark_image,
    "grayscale-image": handle_grayscale_image,
    "blur-image": handle_blur_image,
    "pixelate-image": handle_pixelate_image,
    "meme-generator": handle_meme_generator,
    
    # Document Conversions
    "pdf-to-image": handle_pdf_to_image,
    "html-to-pdf": handle_html_to_pdf,
    "md-to-pdf": handle_md_to_pdf,
    "txt-to-pdf": handle_txt_to_pdf,
    "summarize-text": handle_summarize_text,
    "translate-text": handle_translate_text,
    "qr-code-generator": handle_qr_code_generator,
    "extract-metadata": handle_extract_metadata,
    "remove-metadata-image": handle_remove_metadata_image,
    "edit-metadata-image": handle_edit_metadata_image,
    
    # Page Operations
    "extract-pages": handle_extract_pages,
    "delete-pages": handle_delete_pages,
    "rearrange-pages": handle_rearrange_pages,
    "resize-pages-pdf": handle_resize_pages_pdf,
    "add-text-pdf": handle_add_text_pdf,
    "header-footer-pdf": handle_header_footer_pdf,
    "whiteout-pdf": handle_whiteout_pdf,
    "remove-metadata-pdf": handle_remove_metadata_pdf,
    "grayscale-pdf": handle_grayscale_pdf,
    
    # Format Lab
    "png-to-pdf": handle_png_to_pdf,
    "webp-to-pdf": handle_webp_to_pdf,
    "gif-to-pdf": handle_gif_to_pdf,
    "bmp-to-pdf": handle_bmp_to_pdf,
    "create-pdf": handle_create_pdf,
    "url-to-pdf": handle_url_to_pdf,
    "jpg-to-png": handle_jpg_to_png,
    "png-to-jpg": handle_png_to_jpg,
    "image-to-webp": handle_image_to_webp,
    
    # Data Export
    "pdf-to-txt": handle_pdf_to_txt,
    "pdf-to-markdown": handle_pdf_to_markdown,
    "pdf-to-json": handle_pdf_to_json,
    "pdf-to-csv": handle_pdf_to_csv,
    "json-to-pdf": handle_json_to_pdf,
    "xml-to-pdf": handle_xml_to_pdf,
    "csv-to-pdf": handle_csv_to_pdf,
    
    # Image Layout
    "flip-image": handle_flip_image,
    "add-border-image": handle_add_border_image,
    "thumbnail-image": handle_thumbnail_image,
    "image-collage": handle_image_collage,
    
    # Text Operations
    "word-count-text": handle_word_count_text,
    "case-converter-text": handle_case_converter_text,
    "extract-keywords-text": handle_extract_keywords_text,
    "slug-generator-text": handle_slug_generator_text,
    
    # Archive Operations
    "pdf-pages-to-zip": handle_pdf_pages_to_zip,
    "zip-images-to-pdf": handle_zip_images_to_pdf,
    
    # PDF Insights
    "pdf-page-count": handle_pdf_page_count,
    "reverse-pdf": handle_reverse_pdf,
    "flatten-pdf": handle_flatten_pdf,
    "pdf-to-html": handle_pdf_to_html,
    "pdf-to-bmp": handle_pdf_to_bmp,
    "pdf-to-gif": handle_pdf_to_gif,
    
    # Image Enhancement
    "sharpen-image": handle_sharpen_image,
    "brighten-image": handle_brighten_image,
    "contrast-image": handle_contrast_image,
    "invert-image": handle_invert_image,
    "posterize-image": handle_posterize_image,
    "image-histogram": handle_image_histogram,
    
    # Text Cleanup
    "remove-extra-spaces-text": handle_remove_extra_spaces_text,
    "sort-lines-text": handle_sort_lines_text,
    "deduplicate-lines-text": handle_deduplicate_lines_text,
    "find-replace-text": handle_find_replace_text,
    "split-text-file": handle_split_text_file,
    "reading-time-text": handle_reading_time_text,
    
    # Batch Automation
    "images-to-zip": handle_images_to_zip,
    "batch-convert-images": handle_batch_convert_images,
    "merge-text-files": handle_merge_text_files,
    "json-prettify": handle_json_prettify,
    "csv-to-json": handle_json_prettify,  # Alias
    "json-to-csv": handle_json_prettify,  # Alias
    
    # Office Suite
    "pdf-to-docx": handle_pdf_to_word,
    "docx-to-pdf": handle_word_to_pdf,
    "pdf-to-excel": handle_pdf_to_excel,
    "excel-to-pdf": handle_excel_to_pdf,
    "pdf-to-pptx": handle_pdf_to_powerpoint,
    "pptx-to-pdf": handle_powerpoint_to_pdf,
    "pdf-to-word": handle_pdf_to_word,  # Alias
    "word-to-pdf": handle_word_to_pdf,  # Alias
    "pdf-to-powerpoint": handle_pdf_to_powerpoint,  # Alias
    "powerpoint-to-pdf": handle_powerpoint_to_pdf,  # Alias
    
    # OCR and Vision AI
    "remove-background": handle_remove_background,
    "blur-face": handle_blur_face,
    "sign-pdf": handle_sign_pdf,
    "edit-metadata-pdf": handle_edit_metadata_pdf,
    "pdf-to-pdfa": handle_pdf_to_pdfa,
    "scan-to-pdf": handle_scan_to_pdf,
    "chat-with-pdf": handle_chat_with_pdf,
    "upscale-image": handle_upscale_image,
    "add-image-pdf": handle_add_image_pdf,
    
    # Complete Handlers
    "html-to-image": handle_html_to_image,
    "reduce-image-size-in-kb": handle_reduce_image_size_in_kb,
    "compress-to-kb": handle_compress_to_kb,
    "passport-photo-maker": handle_passport_photo_maker,
    "passport-size-photo": handle_passport_size_photo,
    "social-media-resize": handle_social_media_resize,
    "resize-for-instagram": handle_resize_for_instagram,
    "resize-for-whatsapp": handle_resize_for_whatsapp,
    "resize-for-youtube": handle_resize_for_youtube,
    "instagram-grid": handle_instagram_grid,
    "convert-to-jpg": handle_convert_to_jpg_image,
    "convert-from-jpg": handle_convert_from_jpg_image,
    "heic-to-jpg": handle_heic_to_jpg,
    "webp-to-jpg": handle_webp_to_jpg,
    "jpeg-to-png": handle_jpeg_to_png,
    "png-to-jpeg": handle_png_to_jpeg,
    "photo-editor": handle_photo_editor,
    "unblur-image": handle_unblur_image,
    "increase-image-quality": handle_increase_image_quality,
    "beautify-image": handle_beautify_image,
    "retouch-image": handle_retouch_image,
    "super-resolution": handle_super_resolution,
    "zoom-out-image": handle_zoom_out_image,
    "add-white-border-image": handle_add_white_border_image,
    "freehand-crop": handle_freehand_crop,
    "crop-png": handle_crop_png,
    "a4-size-resize": handle_a4_size_resize,
    "check-dpi": handle_check_dpi,
    "check-image-dpi": handle_check_dpi,  # Alias
    "color-code-from-image": handle_color_code_from_image,
    "image-color-picker": handle_color_code_from_image,  # Alias
    "view-metadata": handle_view_metadata,
    "remove-image-metadata": handle_remove_image_metadata,
    
    # Missing Handlers - Advanced Formats
    "djvu-to-pdf": handle_djvu_to_pdf,
    "ai-to-pdf": handle_ai_to_pdf,
    "pdf-to-mobi": handle_pdf_to_mobi,
    "mobi-to-pdf": handle_mobi_to_pdf,
    "xps-to-pdf": handle_xps_to_pdf,
    "wps-to-pdf": handle_wps_to_pdf,
    "dwg-to-pdf": handle_dwg_to_pdf,
    "dxf-to-pdf": handle_dxf_to_pdf,
    "pub-to-pdf": handle_pub_to_pdf,
    "hwp-to-pdf": handle_hwp_to_pdf,
    "chm-to-pdf": handle_chm_to_pdf,
    "pages-to-pdf": handle_pages_to_pdf,
    
    # Extended Handlers - OCR and Vision
    "ocr-image": handle_ocr_image,
    "ocr-pdf": handle_ocr_pdf,
    "image-to-text": handle_image_to_text,
    "jpg-to-text": handle_jpg_to_text,
    "png-to-text": handle_png_to_text,
    "pdf-ocr": handle_pdf_ocr,
    
    # Extended Handlers - Image Layout
    "pixelate-face": handle_pixelate_face,
    "blur-background": handle_blur_background,
    "add-text-image": handle_add_text_image,
    "add-logo-image": handle_add_logo_image,
    "join-images": handle_join_images,
    "split-image": handle_split_image,
    "circle-crop-image": handle_circle_crop_image,
    "square-crop-image": handle_square_crop_image,
    "motion-blur-image": handle_motion_blur_image,
    
    # Extended Handlers - DPI and Dimensions
    "convert-dpi": handle_convert_dpi,
    "resize-image-in-cm": handle_resize_image_in_cm,
    "resize-image-in-mm": handle_resize_image_in_mm,
    "resize-image-in-inch": handle_resize_image_in_inch,
    
    # Extended Handlers - Special Image Tools
    "add-name-dob-image": handle_add_name_dob_image,
    "merge-photo-signature": handle_merge_photo_signature,
    "black-and-white-image": handle_black_and_white_image,
    "censor-photo": handle_censor_photo,
    "picture-to-pixel-art": handle_picture_to_pixel_art,
    "generate-signature": handle_generate_signature,
    
    # eBook Handlers - Format Conversions
    "pdf-to-tiff": handle_pdf_to_tiff,
    "tiff-to-pdf": handle_tiff_to_pdf,
    "pdf-to-svg": handle_pdf_to_svg,
    "svg-to-pdf": handle_svg_to_pdf,
    "pdf-to-rtf": handle_pdf_to_rtf,
    "rtf-to-pdf": handle_rtf_to_pdf,
    "pdf-to-odt": handle_pdf_to_odt,
    "odt-to-pdf": handle_odt_to_pdf,
    "pdf-to-epub": handle_pdf_to_epub,
    "epub-to-pdf": handle_epub_to_pdf,
    "optimize-pdf": handle_optimize_pdf,
    "convert-to-pdf": handle_convert_to_pdf,
    "convert-from-pdf": handle_convert_from_pdf,
    "pdf-converter": handle_pdf_converter,
    
    # Specialized Handlers - Email and Archives
    "eml-to-pdf": handle_eml_to_pdf,
    "fb2-to-pdf": handle_fb2_to_pdf,
    "cbz-to-pdf": handle_cbz_to_pdf,
    "ebook-to-pdf": handle_ebook_to_pdf,
    "heic-to-pdf": handle_heic_to_pdf,
    "heif-to-pdf": handle_heif_to_pdf,
    "jfif-to-pdf": handle_jfif_to_pdf,
    "zip-to-pdf": handle_zip_to_pdf,
    "cbr-to-pdf": handle_cbr_to_pdf,
    
    # Specialized Handlers - PDF Intelligence
    "pdf-security": handle_pdf_security,
    "ai-summarizer": handle_ai_summarizer,
    "pdf-viewer": handle_pdf_viewer,
    "pdf-intelligence": handle_pdf_intelligence,
    "edit-pdf": handle_edit_pdf,
    "annotate-pdf": handle_annotate_pdf,
    "highlight-pdf": handle_highlight_pdf,
    "pdf-filler": handle_pdf_filler,
    "remove-pages": handle_remove_pages,
    "add-page-numbers": handle_add_page_numbers,
    "add-watermark": handle_add_watermark,
}

# Export the HANDLERS dictionary
__all__ = ["HANDLERS"]
