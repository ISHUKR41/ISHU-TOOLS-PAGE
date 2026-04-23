export type ToolFieldType = 'text' | 'number' | 'textarea' | 'password' | 'select'

export interface ToolField {
  name: string
  label: string
  type: ToolFieldType
  placeholder?: string
  defaultValue?: string
  options?: Array<{ label: string; value: string }>
}

const sharedLanguageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Arabic', value: 'ar' },
]

const booleanOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
]

export const TOOL_FIELDS: Record<string, ToolField[]> = {
  'merge-pdf': [
    {
      name: 'order',
      label: 'Merge Order',
      type: 'select',
      defaultValue: 'upload',
      options: [
        { label: 'Upload order (default)', value: 'upload' },
        { label: 'File name (A → Z)', value: 'name' },
        { label: 'File name (Z → A)', value: 'name_desc' },
        { label: 'Reverse upload order', value: 'reverse' },
      ],
    },
    {
      name: 'bookmark_mode',
      label: 'Bookmarks',
      type: 'select',
      defaultValue: 'preserve',
      options: [
        { label: 'Preserve bookmarks from each PDF', value: 'preserve' },
        { label: 'One bookmark per file', value: 'per_file' },
        { label: 'No bookmarks', value: 'none' },
      ],
    },
    {
      name: 'blank_between',
      label: 'Insert blank page between files?',
      type: 'select',
      defaultValue: 'false',
      options: booleanOptions,
    },
    { name: 'title', label: 'PDF Title (optional)', type: 'text', placeholder: 'My Combined PDF' },
  ],
  'compress-pdf': [
    {
      name: 'quality',
      label: 'Compression Quality',
      type: 'select',
      defaultValue: 'ebook',
      options: [
        { label: 'Screen (smallest, ~72 DPI)', value: 'screen' },
        { label: 'Ebook (balanced, ~150 DPI)', value: 'ebook' },
        { label: 'Printer (high quality, ~300 DPI)', value: 'printer' },
        { label: 'Prepress (maximum quality)', value: 'prepress' },
      ],
    },
    { name: 'image_dpi', label: 'Image DPI cap', type: 'number', defaultValue: '150', placeholder: '72-600' },
    {
      name: 'grayscale',
      label: 'Convert to grayscale?',
      type: 'select',
      defaultValue: 'false',
      options: booleanOptions,
    },
    {
      name: 'strip_metadata',
      label: 'Strip metadata?',
      type: 'select',
      defaultValue: 'false',
      options: booleanOptions,
    },
    {
      name: 'fast_web',
      label: 'Optimize for fast web view?',
      type: 'select',
      defaultValue: 'true',
      options: booleanOptions,
    },
  ],
  'split-pdf': [
    {
      name: 'mode',
      label: 'Split Mode',
      type: 'select',
      defaultValue: 'each_page',
      options: [
        { label: 'One PDF per page', value: 'each_page' },
        { label: 'Single range → one PDF', value: 'single_range' },
        { label: 'Multiple ranges (use ;)', value: 'ranges' },
        { label: 'Every N pages', value: 'every_n' },
      ],
    },
    {
      name: 'pages',
      label: 'Pages / Range',
      type: 'text',
      placeholder: 'e.g. all  •  1,3,5  •  1-5  •  1-3;4-7',
      defaultValue: 'all',
    },
    { name: 'every_n', label: 'Every N pages (for "Every N" mode)', type: 'number', defaultValue: '1' },
  ],
  'extract-pages': [
    {
      name: 'pages',
      label: 'Pages',
      type: 'text',
      placeholder: 'all or 1,3,5 or 2-6',
      defaultValue: 'all',
    },
  ],
  'delete-pages': [
    {
      name: 'pages',
      label: 'Pages To Delete',
      type: 'text',
      placeholder: '2,4 or 5-7',
    },
  ],
  'rotate-pdf': [
    {
      name: 'angle',
      label: 'Rotation Angle',
      type: 'select',
      defaultValue: '90',
      options: [
        { label: '90° clockwise', value: '90' },
        { label: '180° (upside down)', value: '180' },
        { label: '270° / 90° counter-clockwise', value: '270' },
      ],
    },
    {
      name: 'pages',
      label: 'Pages to rotate',
      type: 'text',
      placeholder: 'all  •  1,3,5  •  2-6',
      defaultValue: 'all',
    },
  ],
  'organize-pdf': [
    {
      name: 'page_order',
      label: 'Page Order',
      type: 'text',
      placeholder: '3,1,2,4',
    },
  ],
  'rearrange-pages': [
    {
      name: 'page_order',
      label: 'Page Order',
      type: 'text',
      placeholder: '3,1,2,4',
    },
  ],
  'crop-pdf': [
    { name: 'left', label: 'Left Margin', type: 'number', defaultValue: '0' },
    { name: 'right', label: 'Right Margin', type: 'number', defaultValue: '0' },
    { name: 'top', label: 'Top Margin', type: 'number', defaultValue: '0' },
    { name: 'bottom', label: 'Bottom Margin', type: 'number', defaultValue: '0' },
  ],
  'resize-pages-pdf': [
    { name: 'scale', label: 'Scale Factor', type: 'number', defaultValue: '1.0' },
  ],
  'watermark-pdf': [
    { name: 'text', label: 'Watermark Text', type: 'text', defaultValue: 'ISHU TOOLS' },
    {
      name: 'position',
      label: 'Position',
      type: 'select',
      defaultValue: 'diagonal',
      options: [
        { label: 'Diagonal (centered, 45°)', value: 'diagonal' },
        { label: 'Center (horizontal)', value: 'center' },
        { label: 'Tile (repeat across page)', value: 'tile' },
        { label: 'Header (top)', value: 'header' },
        { label: 'Footer (bottom)', value: 'footer' },
      ],
    },
    { name: 'font_size', label: 'Font Size (pt)', type: 'number', defaultValue: '50' },
    { name: 'opacity', label: 'Opacity (0.05 - 1.0)', type: 'number', defaultValue: '0.3' },
    { name: 'color', label: 'Color (hex)', type: 'text', defaultValue: '#888888', placeholder: '#888888' },
    {
      name: 'pages',
      label: 'Apply to pages',
      type: 'text',
      placeholder: 'all  •  1,3,5  •  2-6',
      defaultValue: 'all',
    },
  ],
  'pdf-to-jpg': [
    { name: 'dpi', label: 'Render DPI', type: 'number', defaultValue: '200', placeholder: '72-600' },
    { name: 'quality', label: 'JPG Quality (10-100)', type: 'number', defaultValue: '92' },
    {
      name: 'color_mode',
      label: 'Color Mode',
      type: 'select',
      defaultValue: 'rgb',
      options: [
        { label: 'Full Color (RGB)', value: 'rgb' },
        { label: 'Grayscale', value: 'grayscale' },
      ],
    },
    {
      name: 'pages',
      label: 'Pages',
      type: 'text',
      placeholder: 'all  •  1,3,5  •  2-6',
      defaultValue: 'all',
    },
  ],
  'pdf-to-png': [
    { name: 'dpi', label: 'Render DPI', type: 'number', defaultValue: '200', placeholder: '72-600' },
    {
      name: 'color_mode',
      label: 'Color Mode',
      type: 'select',
      defaultValue: 'rgb',
      options: [
        { label: 'Full Color (RGB)', value: 'rgb' },
        { label: 'Grayscale', value: 'grayscale' },
      ],
    },
    {
      name: 'transparent_bg',
      label: 'Transparent background?',
      type: 'select',
      defaultValue: 'false',
      options: booleanOptions,
    },
    {
      name: 'pages',
      label: 'Pages',
      type: 'text',
      placeholder: 'all  •  1,3,5  •  2-6',
      defaultValue: 'all',
    },
  ],
  'jpg-to-pdf': [
    {
      name: 'page_size',
      label: 'Page Size',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (match image)', value: 'auto' },
        { label: 'A4', value: 'a4' },
        { label: 'A3', value: 'a3' },
        { label: 'A5', value: 'a5' },
        { label: 'Letter', value: 'letter' },
        { label: 'Legal', value: 'legal' },
      ],
    },
    {
      name: 'orientation',
      label: 'Orientation',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Portrait', value: 'portrait' },
        { label: 'Landscape', value: 'landscape' },
      ],
    },
    { name: 'margin_mm', label: 'Margin (mm)', type: 'number', defaultValue: '0' },
    {
      name: 'fit',
      label: 'Image Fit',
      type: 'select',
      defaultValue: 'fit',
      options: [
        { label: 'Fit (no crop)', value: 'fit' },
        { label: 'Fill (crop to page)', value: 'fill' },
        { label: 'Stretch (ignore ratio)', value: 'stretch' },
      ],
    },
    {
      name: 'order',
      label: 'Image Order',
      type: 'select',
      defaultValue: 'name',
      options: [
        { label: 'File name (A → Z)', value: 'name' },
        { label: 'File name (Z → A)', value: 'name_desc' },
        { label: 'Upload order', value: 'upload' },
      ],
    },
  ],
  'image-to-pdf': [
    {
      name: 'page_size',
      label: 'Page Size',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (match image)', value: 'auto' },
        { label: 'A4', value: 'a4' },
        { label: 'A3', value: 'a3' },
        { label: 'A5', value: 'a5' },
        { label: 'Letter', value: 'letter' },
        { label: 'Legal', value: 'legal' },
      ],
    },
    {
      name: 'orientation',
      label: 'Orientation',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Portrait', value: 'portrait' },
        { label: 'Landscape', value: 'landscape' },
      ],
    },
    { name: 'margin_mm', label: 'Margin (mm)', type: 'number', defaultValue: '0' },
    {
      name: 'fit',
      label: 'Image Fit',
      type: 'select',
      defaultValue: 'fit',
      options: [
        { label: 'Fit (no crop)', value: 'fit' },
        { label: 'Fill (crop to page)', value: 'fill' },
        { label: 'Stretch (ignore ratio)', value: 'stretch' },
      ],
    },
  ],
  'scan-to-pdf': [
    {
      name: 'enhance',
      label: 'Scan Enhancement',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (grayscale + sharpen)', value: 'auto' },
        { label: 'Grayscale only', value: 'grayscale' },
        { label: 'B&W (high contrast)', value: 'bw' },
        { label: 'None (preserve original)', value: 'none' },
      ],
    },
    {
      name: 'page_size',
      label: 'Page Size',
      type: 'select',
      defaultValue: 'a4',
      options: [
        { label: 'A4', value: 'a4' },
        { label: 'A3', value: 'a3' },
        { label: 'A5', value: 'a5' },
        { label: 'Letter', value: 'letter' },
        { label: 'Legal', value: 'legal' },
        { label: 'Auto (match image)', value: 'auto' },
      ],
    },
    {
      name: 'orientation',
      label: 'Orientation',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Portrait', value: 'portrait' },
        { label: 'Landscape', value: 'landscape' },
      ],
    },
    { name: 'margin_mm', label: 'Margin (mm)', type: 'number', defaultValue: '5' },
  ],
  'optimize-pdf': [
    {
      name: 'level',
      label: 'Optimization Level',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Light (lossless, quick)', value: 'light' },
        { label: 'Standard (recommended)', value: 'standard' },
        { label: 'Aggressive (recompress images)', value: 'aggressive' },
      ],
    },
    {
      name: 'linearize',
      label: 'Linearize for fast web view?',
      type: 'select',
      defaultValue: 'true',
      options: booleanOptions,
    },
    {
      name: 'strip_metadata',
      label: 'Strip metadata?',
      type: 'select',
      defaultValue: 'false',
      options: booleanOptions,
    },
  ],
  'add-text-pdf': [
    { name: 'text', label: 'Text', type: 'text', defaultValue: 'ISHU TOOLS' },
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '18' },
  ],
  'page-numbers-pdf': [
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '12' },
  ],
  'header-footer-pdf': [
    { name: 'header', label: 'Header Text', type: 'text' },
    { name: 'footer', label: 'Footer Text', type: 'text' },
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '11' },
  ],
  'header-and-footer': [
    { name: 'header', label: 'Header Text', type: 'text', placeholder: 'e.g. My Document Title' },
    { name: 'footer', label: 'Footer Text', type: 'text', placeholder: 'e.g. Confidential' },
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '11' },
  ],
  'protect-pdf': [
    { name: 'password', label: 'Password', type: 'password' },
  ],
  'unlock-pdf': [
    { name: 'password', label: 'Password', type: 'password' },
  ],
  'redact-pdf': [
    {
      name: 'keywords',
      label: 'Keywords to Redact',
      type: 'text',
      placeholder: 'email,phone,secret',
    },
  ],
  'whiteout-pdf': [
    {
      name: 'keywords',
      label: 'Keywords To Whiteout',
      type: 'text',
      placeholder: 'email,phone,secret',
    },
  ],
  'translate-pdf': [
    {
      name: 'target_lang',
      label: 'Target Language',
      type: 'select',
      defaultValue: 'en',
      options: sharedLanguageOptions,
    },
  ],
  'sign-pdf': [
    { name: 'signer', label: 'Signer Name', type: 'text', defaultValue: 'ISHU TOOLS' },
    { name: 'reason', label: 'Reason', type: 'text', defaultValue: 'Approved' },
    {
      name: 'position',
      label: 'Signature Position',
      type: 'select',
      defaultValue: 'bottom-right',
      options: [
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Top Left', value: 'top-left' },
      ],
    },
  ],
  'edit-metadata-pdf': [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'author', label: 'Author', type: 'text' },
    { name: 'subject', label: 'Subject', type: 'text' },
    { name: 'keywords', label: 'Keywords', type: 'text', placeholder: 'pdf, archive, secure' },
  ],
  'pdf-to-pdfa': [
    { name: 'title', label: 'Archive Title', type: 'text', placeholder: 'My archival export' },
  ],
  'chat-with-pdf': [
    {
      name: 'question',
      label: 'Question',
      type: 'textarea',
      placeholder: 'What are the key action items in this PDF?',
    },
    { name: 'max_sentences', label: 'Evidence sentences', type: 'number', defaultValue: '3' },
  ],
  'pdf-security': [
    {
      name: 'mode',
      label: 'Security Mode',
      type: 'select',
      defaultValue: 'protect',
      options: [
        { label: 'Protect PDF', value: 'protect' },
        { label: 'Unlock PDF', value: 'unlock' },
      ],
    },
    { name: 'password', label: 'Password', type: 'text', placeholder: 'Enter PDF password' },
  ],
  'convert-from-pdf': [
    {
      name: 'target_format',
      label: 'Target Format',
      type: 'select',
      defaultValue: 'jpg',
      options: [
        { label: 'JPG', value: 'jpg' },
        { label: 'PNG', value: 'png' },
        { label: 'DOCX', value: 'docx' },
        { label: 'PPTX', value: 'pptx' },
        { label: 'XLSX', value: 'xlsx' },
        { label: 'TXT', value: 'txt' },
        { label: 'Markdown', value: 'md' },
        { label: 'JSON', value: 'json' },
        { label: 'CSV', value: 'csv' },
        { label: 'SVG', value: 'svg' },
        { label: 'TIFF', value: 'tiff' },
        { label: 'RTF', value: 'rtf' },
        { label: 'ODT', value: 'odt' },
        { label: 'EPUB', value: 'epub' },
        { label: 'HTML', value: 'html' },
        { label: 'BMP', value: 'bmp' },
        { label: 'GIF', value: 'gif' },
        { label: 'PDF/A', value: 'pdfa' },
      ],
    },
  ],
  'pdf-converter': [
    {
      name: 'target_format',
      label: 'Target Format',
      type: 'select',
      defaultValue: 'pdf',
      options: [
        { label: 'PDF', value: 'pdf' },
        { label: 'JPG', value: 'jpg' },
        { label: 'PNG', value: 'png' },
        { label: 'DOCX', value: 'docx' },
        { label: 'PPTX', value: 'pptx' },
        { label: 'XLSX', value: 'xlsx' },
      ],
    },
  ],
  'pdf-intelligence': [
    { name: 'summary_sentences', label: 'Summary Sentences', type: 'number', defaultValue: '4' },
    { name: 'top_keywords', label: 'Top Keywords', type: 'number', defaultValue: '8' },
  ],
  'ai-summarizer': [
    {
      name: 'text',
      label: 'Text Source (optional if PDF uploaded)',
      type: 'textarea',
      placeholder: 'Paste long text here or upload a PDF...',
    },
  ],
  'edit-pdf': [
    {
      name: 'mode',
      label: 'Edit Mode',
      type: 'select',
      defaultValue: 'add_text',
      options: [
        { label: 'Add Text', value: 'add_text' },
        { label: 'Watermark', value: 'watermark' },
        { label: 'Annotate', value: 'annotate' },
        { label: 'Highlight', value: 'highlight' },
        { label: 'Add Image', value: 'add_image' },
      ],
    },
    { name: 'text', label: 'Text', type: 'text', placeholder: 'ISHU TOOLS' },
    { name: 'page', label: 'Page Number', type: 'number', defaultValue: '1' },
    { name: 'x', label: 'X', type: 'number', defaultValue: '48' },
    { name: 'y', label: 'Y', type: 'number', defaultValue: '72' },
    { name: 'width', label: 'Width', type: 'number', defaultValue: '220' },
    { name: 'height', label: 'Height', type: 'number', defaultValue: '80' },
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '14' },
    { name: 'color', label: 'Color', type: 'text', defaultValue: '#38bdf8' },
  ],
  'annotate-pdf': [
    { name: 'text', label: 'Annotation Text', type: 'text', placeholder: 'Add your note' },
    { name: 'page', label: 'Page Number', type: 'number', defaultValue: '1' },
    { name: 'x', label: 'X', type: 'number', defaultValue: '48' },
    { name: 'y', label: 'Y', type: 'number', defaultValue: '72' },
    { name: 'width', label: 'Width', type: 'number', defaultValue: '220' },
    { name: 'height', label: 'Height', type: 'number', defaultValue: '80' },
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '12' },
    { name: 'color', label: 'Color', type: 'text', defaultValue: '#38bdf8' },
  ],
  'highlight-pdf': [
    { name: 'page', label: 'Page Number', type: 'number', defaultValue: '1' },
    { name: 'x', label: 'X', type: 'number', defaultValue: '48' },
    { name: 'y', label: 'Y', type: 'number', defaultValue: '72' },
    { name: 'width', label: 'Width', type: 'number', defaultValue: '180' },
    { name: 'height', label: 'Height', type: 'number', defaultValue: '24' },
    { name: 'opacity', label: 'Opacity', type: 'number', defaultValue: '0.35' },
    { name: 'color', label: 'Color', type: 'text', defaultValue: '#fde047' },
  ],
  'pdf-filler': [
    { name: 'text', label: 'Fill Text', type: 'text', placeholder: 'Filled value' },
    { name: 'page', label: 'Page Number', type: 'number', defaultValue: '1' },
    { name: 'x', label: 'X', type: 'number', defaultValue: '48' },
    { name: 'y', label: 'Y', type: 'number', defaultValue: '72' },
    { name: 'width', label: 'Width', type: 'number', defaultValue: '220' },
    { name: 'height', label: 'Height', type: 'number', defaultValue: '80' },
  ],
  'remove-pages': [{ name: 'pages', label: 'Pages', type: 'text', placeholder: '2,4 or 5-8' }],
  'add-page-numbers': [{ name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '12' }],
  'add-watermark': [
    { name: 'text', label: 'Watermark Text', type: 'text', defaultValue: 'ISHU TOOLS' },
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '18' },
  ],
  'edit-metadata': [
    { name: 'title', label: 'Title', type: 'text', placeholder: 'Document title' },
    { name: 'author', label: 'Author', type: 'text', placeholder: 'Author name' },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Subject' },
    { name: 'keywords', label: 'Keywords', type: 'text', placeholder: 'pdf, tools, ishu' },
  ],
  'blur-face': [
    { name: 'blur_strength', label: 'Blur Strength', type: 'number', defaultValue: '45' },
  ],
  'remove-background': [
    { name: 'tolerance', label: 'Background Tolerance', type: 'number', defaultValue: '28' },
  ],
  'pixelate-face': [
    { name: 'pixel_size', label: 'Pixel Size', type: 'number', defaultValue: '16' },
  ],
  'blur-background': [
    { name: 'radius', label: 'Blur Radius', type: 'number', defaultValue: '12' },
  ],
  'add-text-image': [
    {
      name: 'text',
      label: 'Overlay Text',
      type: 'text',
      placeholder: 'ISHU TOOLS',
    },
    { name: 'x', label: 'Position X', type: 'number', defaultValue: '40' },
    { name: 'y', label: 'Position Y', type: 'number', defaultValue: '40' },
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '48' },
    { name: 'opacity', label: 'Opacity %', type: 'number', defaultValue: '90' },
    { name: 'color', label: 'Text Color', type: 'text', defaultValue: '#ffffff' },
  ],
  'add-logo-image': [
    {
      name: 'position',
      label: 'Logo Position',
      type: 'select',
      defaultValue: 'bottom-right',
      options: [
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Top Left', value: 'top-left' },
        { label: 'Center', value: 'center' },
      ],
    },
    { name: 'scale_percent', label: 'Logo Width %', type: 'number', defaultValue: '20' },
    { name: 'opacity', label: 'Opacity %', type: 'number', defaultValue: '85' },
  ],
  'join-images': [
    {
      name: 'direction',
      label: 'Join Direction',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
    },
    { name: 'gap', label: 'Gap', type: 'number', defaultValue: '16' },
    { name: 'background', label: 'Background Color', type: 'text', defaultValue: '#0b1120' },
  ],
  'split-image': [
    { name: 'columns', label: 'Columns', type: 'number', defaultValue: '2' },
    { name: 'rows', label: 'Rows', type: 'number', defaultValue: '2' },
  ],
  'image-splitter': [
    { name: 'columns', label: 'Columns', type: 'number', defaultValue: '2' },
    { name: 'rows', label: 'Rows', type: 'number', defaultValue: '2' },
  ],
  'circle-crop-image': [
    { name: 'size', label: 'Output Size (px)', type: 'number', defaultValue: '512' },
  ],
  'square-crop-image': [
    { name: 'size', label: 'Output Size (px)', type: 'number', defaultValue: '1080' },
  ],
  'image-color-picker': [
    { name: 'colors', label: 'Palette Colors', type: 'number', defaultValue: '5' },
  ],
  'motion-blur-image': [
    {
      name: 'direction',
      label: 'Blur Direction',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
    },
    { name: 'strength', label: 'Blur Strength', type: 'number', defaultValue: '9' },
  ],
  'compress-image': [
    { name: 'quality', label: 'Quality (1-100)', type: 'number', defaultValue: '70' },
  ],
  'resize-image': [
    { name: 'width', label: 'Width', type: 'number', defaultValue: '1200' },
    { name: 'height', label: 'Height', type: 'number', defaultValue: '800' },
  ],
  'crop-image': [
    { name: 'x', label: 'X', type: 'number', defaultValue: '0' },
    { name: 'y', label: 'Y', type: 'number', defaultValue: '0' },
    { name: 'width', label: 'Width', type: 'number', defaultValue: '600' },
    { name: 'height', label: 'Height', type: 'number', defaultValue: '600' },
  ],
  'rotate-image': [
    { name: 'angle', label: 'Angle', type: 'number', defaultValue: '90' },
  ],
  'convert-image': [
    {
      name: 'target_format',
      label: 'Target Format',
      type: 'select',
      defaultValue: 'png',
      options: [
        { label: 'PNG', value: 'png' },
        { label: 'JPG / JPEG', value: 'jpg' },
        { label: 'WEBP', value: 'webp' },
        { label: 'GIF', value: 'gif' },
        { label: 'BMP', value: 'bmp' },
        { label: 'TIFF', value: 'tiff' },
        { label: 'ICO (Icon)', value: 'ico' },
        { label: 'PDF', value: 'pdf' },
        { label: 'SVG', value: 'svg' },
      ],
    },
    { name: 'quality', label: 'Quality (JPG/WEBP)', type: 'number', defaultValue: '90' },
  ],
  'convert-dpi': [{ name: 'dpi', label: 'Target DPI', type: 'number', defaultValue: '300' }],
  'resize-image-in-cm': [
    { name: 'width_cm', label: 'Width (cm)', type: 'number', defaultValue: '3.5' },
    { name: 'height_cm', label: 'Height (cm)', type: 'number', defaultValue: '4.5' },
    { name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' },
  ],
  'resize-image-in-mm': [
    { name: 'width_mm', label: 'Width (mm)', type: 'number', defaultValue: '35' },
    { name: 'height_mm', label: 'Height (mm)', type: 'number', defaultValue: '45' },
    { name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' },
  ],
  'resize-image-in-inch': [
    { name: 'width_inch', label: 'Width (inch)', type: 'number', defaultValue: '2' },
    { name: 'height_inch', label: 'Height (inch)', type: 'number', defaultValue: '2' },
    { name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' },
  ],
  'add-name-dob-image': [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Ishu Kumar' },
    { name: 'dob', label: 'DOB', type: 'text', placeholder: '01-01-2000' },
    { name: 'x', label: 'X', type: 'number', defaultValue: '24' },
    { name: 'y', label: 'Y', type: 'number', defaultValue: '24' },
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '28' },
    { name: 'color', label: 'Text Color', type: 'text', defaultValue: '#ffffff' },
  ],
  'merge-photo-signature': [
    {
      name: 'direction',
      label: 'Layout Direction',
      type: 'select',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
      ],
    },
    { name: 'gap', label: 'Gap', type: 'number', defaultValue: '20' },
    { name: 'background', label: 'Background', type: 'text', defaultValue: '#ffffff' },
  ],
  'black-and-white-image': [
    { name: 'threshold', label: 'Threshold', type: 'number', defaultValue: '128' },
  ],
  'censor-photo': [{ name: 'pixel_size', label: 'Pixel Size', type: 'number', defaultValue: '14' }],
  'generate-signature': [
    { name: 'text', label: 'Signature Text', type: 'text', placeholder: 'Ishu Kumar' },
    { name: 'width', label: 'Canvas Width', type: 'number', defaultValue: '720' },
    { name: 'height', label: 'Canvas Height', type: 'number', defaultValue: '240' },
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '96' },
    { name: 'color', label: 'Signature Color', type: 'text', defaultValue: '#0f172a' },
  ],
  'flip-image': [
    {
      name: 'mode',
      label: 'Flip Mode',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
    },
  ],
  'add-border-image': [
    { name: 'border_size', label: 'Border Size', type: 'number', defaultValue: '20' },
    { name: 'color', label: 'Border Color', type: 'text', defaultValue: '#ffffff' },
  ],
  'thumbnail-image': [
    { name: 'max_width', label: 'Max Width', type: 'number', defaultValue: '320' },
    { name: 'max_height', label: 'Max Height', type: 'number', defaultValue: '320' },
  ],
  'image-collage': [
    { name: 'columns', label: 'Columns', type: 'number', defaultValue: '2' },
    { name: 'cell_size', label: 'Cell Size', type: 'number', defaultValue: '420' },
  ],
  'sharpen-image': [
    { name: 'factor', label: 'Sharpness Factor', type: 'number', defaultValue: '2' },
  ],
  'brighten-image': [
    { name: 'factor', label: 'Brightness Factor', type: 'number', defaultValue: '1.25' },
  ],
  'contrast-image': [
    { name: 'factor', label: 'Contrast Factor', type: 'number', defaultValue: '1.2' },
  ],
  'posterize-image': [
    { name: 'bits', label: 'Posterize Bits (1-8)', type: 'number', defaultValue: '4' },
  ],
  'watermark-image': [
    { name: 'text', label: 'Watermark Text', type: 'text', defaultValue: 'ISHU TOOLS' },
    { name: 'x', label: 'Position X', type: 'number', defaultValue: '20' },
    { name: 'y', label: 'Position Y', type: 'number', defaultValue: '20' },
  ],
  'blur-image': [
    { name: 'radius', label: 'Blur Radius', type: 'number', defaultValue: '4' },
  ],
  'pixelate-image': [
    { name: 'factor', label: 'Pixelate Factor', type: 'number', defaultValue: '12' },
  ],
  'meme-generator': [
    { name: 'top_text', label: 'Top Text', type: 'text', defaultValue: 'TOP TEXT' },
    {
      name: 'bottom_text',
      label: 'Bottom Text',
      type: 'text',
      defaultValue: 'BOTTOM TEXT',
    },
  ],
  'upscale-image': [
    { name: 'scale', label: 'Scale Factor', type: 'number', defaultValue: '2' },
  ],
  'add-image-pdf': [
    { name: 'scale', label: 'Image Scale', type: 'number', defaultValue: '0.2' },
    { name: 'opacity', label: 'Opacity %', type: 'number', defaultValue: '65' },
  ],
  'html-to-pdf': [
    {
      name: 'url',
      label: 'Page URL',
      type: 'text',
      placeholder: 'https://example.com',
    },
    {
      name: 'html',
      label: 'Raw HTML (optional)',
      type: 'textarea',
      placeholder: '<h1>Hello</h1>',
    },
  ],
  'url-to-pdf': [
    {
      name: 'url',
      label: 'Page URL',
      type: 'text',
      placeholder: 'https://example.com',
    },
  ],
  'md-to-pdf': [
    {
      name: 'text',
      label: 'Markdown Text',
      type: 'textarea',
      placeholder: '# Heading\nWrite markdown here...',
    },
  ],
  'txt-to-pdf': [
    {
      name: 'text',
      label: 'Text Content',
      type: 'textarea',
      placeholder: 'Paste plain text here...',
    },
  ],
  'create-pdf': [
    {
      name: 'text',
      label: 'Text Content',
      type: 'textarea',
      placeholder: 'Write document content...',
    },
  ],
  'json-to-pdf': [
    {
      name: 'text',
      label: 'JSON Text (optional if file uploaded)',
      type: 'textarea',
      placeholder: '{"name":"Ishu"}',
    },
  ],
  'pdf-to-odt': [
    {
      name: 'title',
      label: 'Document Title',
      type: 'text',
      placeholder: 'Converted ODT document',
    },
  ],
  'pdf-to-epub': [
    {
      name: 'title',
      label: 'Book Title',
      type: 'text',
      placeholder: 'Converted EPUB title',
    },
  ],
  'xml-to-pdf': [
    {
      name: 'text',
      label: 'XML Text (optional if file uploaded)',
      type: 'textarea',
      placeholder: '<root><name>Ishu</name></root>',
    },
  ],
  'csv-to-pdf': [
    {
      name: 'text',
      label: 'CSV Text (optional if file uploaded)',
      type: 'textarea',
      placeholder: 'name,score\nishu,95',
    },
  ],
  'summarize-text': [
    {
      name: 'text',
      label: 'Text to Summarize',
      type: 'textarea',
      placeholder: 'Paste long content...',
    },
  ],
  'word-count-text': [
    {
      name: 'text',
      label: 'Text to Analyze',
      type: 'textarea',
      placeholder: 'Paste text for word count...',
    },
  ],
  'case-converter-text': [
    {
      name: 'text',
      label: 'Text to Convert',
      type: 'textarea',
      placeholder: 'Paste text...',
    },
    {
      name: 'mode',
      label: 'Convert Mode',
      type: 'select',
      defaultValue: 'upper',
      options: [
        { label: 'UPPER', value: 'upper' },
        { label: 'lower', value: 'lower' },
        { label: 'Title Case', value: 'title' },
        { label: 'Sentence case', value: 'sentence' },
      ],
    },
  ],
  'extract-keywords-text': [
    {
      name: 'text',
      label: 'Text Source',
      type: 'textarea',
      placeholder: 'Paste text for keyword extraction...',
    },
    { name: 'top_n', label: 'Top Keywords', type: 'number', defaultValue: '20' },
  ],
  'slug-generator-text': [
    {
      name: 'text',
      label: 'Slug Source Text',
      type: 'text',
      placeholder: 'My New Tool Page',
    },
  ],
  'sort-lines-text': [
    {
      name: 'text',
      label: 'Text Source',
      type: 'textarea',
      placeholder: 'Line 3\nLine 1\nLine 2',
    },
    {
      name: 'direction',
      label: 'Sort Direction',
      type: 'select',
      defaultValue: 'asc',
      options: [
        { label: 'Ascending', value: 'asc' },
        { label: 'Descending', value: 'desc' },
      ],
    },
  ],
  'remove-extra-spaces-text': [
    {
      name: 'text',
      label: 'Text Source',
      type: 'textarea',
      placeholder: 'Paste text with irregular spacing...',
    },
  ],
  'deduplicate-lines-text': [
    {
      name: 'text',
      label: 'Text Source',
      type: 'textarea',
      placeholder: 'Paste duplicate lines...',
    },
  ],
  'find-replace-text': [
    {
      name: 'text',
      label: 'Text Source',
      type: 'textarea',
      placeholder: 'Paste content where replacements are needed...',
    },
    { name: 'find', label: 'Find', type: 'text', placeholder: 'old value' },
    { name: 'replace', label: 'Replace', type: 'text', placeholder: 'new value' },
    {
      name: 'case_sensitive',
      label: 'Case Sensitive (true/false)',
      type: 'text',
      defaultValue: 'false',
    },
  ],
  'split-text-file': [
    {
      name: 'text',
      label: 'Text Source',
      type: 'textarea',
      placeholder: 'Paste long text for splitting...',
    },
    { name: 'lines_per_file', label: 'Lines Per File', type: 'number', defaultValue: '100' },
  ],
  'reading-time-text': [
    {
      name: 'text',
      label: 'Text Source',
      type: 'textarea',
      placeholder: 'Paste article or blog content...',
    },
    { name: 'wpm', label: 'Words Per Minute', type: 'number', defaultValue: '200' },
  ],
  'translate-text': [
    {
      name: 'text',
      label: 'Text to Translate',
      type: 'textarea',
      placeholder: 'Paste text...',
    },
    {
      name: 'target_lang',
      label: 'Target Language',
      type: 'select',
      defaultValue: 'en',
      options: sharedLanguageOptions,
    },
  ],
  'qr-code-generator': [
    {
      name: 'text',
      label: 'Text or URL',
      type: 'text',
      placeholder: 'https://ishu.tools',
    },
  ],
  'batch-convert-images': [
    {
      name: 'target_format',
      label: 'Target Format',
      type: 'select',
      defaultValue: 'png',
      options: [
        { label: 'PNG', value: 'png' },
        { label: 'JPG', value: 'jpg' },
        { label: 'WEBP', value: 'webp' },
        { label: 'GIF', value: 'gif' },
        { label: 'BMP', value: 'bmp' },
      ],
    },
  ],
  'merge-text-files': [
    {
      name: 'separator',
      label: 'Separator',
      type: 'text',
      defaultValue: '\n\n-----\n\n',
    },
  ],
  'json-prettify': [
    {
      name: 'text',
      label: 'JSON Text',
      type: 'textarea',
      placeholder: '{"name":"ishu","score":95}',
    },
  ],
  'csv-to-json': [
    {
      name: 'text',
      label: 'CSV Text',
      type: 'textarea',
      placeholder: 'name,score\nishu,95',
    },
  ],
  'json-to-csv': [
    {
      name: 'text',
      label: 'JSON Text',
      type: 'textarea',
      placeholder: '[{"name":"ishu","score":95}]',
    },
  ],
  'jpeg-to-png': [],
  'png-to-jpeg': [],
  'jpeg-to-jpg': [],
  'remove-image-metadata': [],
  'remove-image-object': [
    { name: 'x', label: 'Object X', type: 'number', defaultValue: '120' },
    { name: 'y', label: 'Object Y', type: 'number', defaultValue: '120' },
    { name: 'width', label: 'Object Width', type: 'number', defaultValue: '180' },
    { name: 'height', label: 'Object Height', type: 'number', defaultValue: '180' },
    { name: 'radius', label: 'Inpaint Radius', type: 'number', defaultValue: '5' },
    {
      name: 'method',
      label: 'Inpaint Method',
      type: 'select',
      defaultValue: 'telea',
      options: [
        { label: 'Telea (default)', value: 'telea' },
        { label: 'Navier-Stokes', value: 'ns' },
      ],
    },
  ],
  'unblur-face': [
    { name: 'strength', label: 'Enhance Strength', type: 'number', defaultValue: '1.8' },
    { name: 'denoise', label: 'Denoise Level', type: 'number', defaultValue: '6' },
  ],
  'resize-image-pixel': [
    { name: 'width', label: 'Width', type: 'number', defaultValue: '1200' },
    { name: 'height', label: 'Height', type: 'number', defaultValue: '800' },
  ],
  'resize-signature': [
    { name: 'width_mm', label: 'Width (mm)', type: 'number', defaultValue: '50' },
    { name: 'height_mm', label: 'Height (mm)', type: 'number', defaultValue: '20' },
    { name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' },
  ],
  'resize-image-to-3.5cmx4.5cm': [{ name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' }],
  'resize-image-to-6cmx2cm': [{ name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' }],
  'resize-signature-to-50mmx20mm': [{ name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' }],
  'resize-image-to-35mmx45mm': [{ name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' }],
  'resize-image-to-2x2': [{ name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' }],
  'resize-image-to-3x4': [{ name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' }],
  'resize-image-to-4x6': [{ name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' }],
  'resize-image-to-600x600-pixel': [],
  'resize-image-for-whatsapp-dp': [],
  'resize-image-for-youtube-banner': [],
  'resize-image-to-a4-size': [{ name: 'dpi', label: 'DPI', type: 'number', defaultValue: '300' }],
  'reduce-image-size-in-kb': [
    { name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '100' },
    {
      name: 'strict',
      label: 'Strict Target Mode',
      type: 'select',
      defaultValue: 'true',
      options: booleanOptions,
    },
  ],
  'compress-to-kb': [
    { name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '100' },
    {
      name: 'strict',
      label: 'Strict Target Mode',
      type: 'select',
      defaultValue: 'true',
      options: booleanOptions,
    },
  ],
  'increase-image-size-in-kb': [
    { name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '200' },
  ],
  'reduce-image-size-in-mb': [
    { name: 'target_mb', label: 'Target Size (MB)', type: 'number', defaultValue: '0.2' },
  ],
  'convert-image-from-mb-to-kb': [
    { name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '200' },
  ],
  'convert-image-size-kb-to-mb': [
    { name: 'target_mb', label: 'Target Size (MB)', type: 'number', defaultValue: '1.0' },
  ],
  'jpg-to-kb': [{ name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '100' }],
  'jpeg-to-kb': [{ name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '100' }],
  'png-to-kb': [{ name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '100' }],
  'compress-to-15kb': [{ name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '15' }],
  'compress-to-25kb': [{ name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '25' }],
  'compress-to-30kb': [{ name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '30' }],
  'compress-to-40kb': [{ name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '40' }],
  'compress-to-150kb': [{ name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '150' }],
  'compress-to-300kb': [{ name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '300' }],
  'compress-to-2mb': [{ name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '2000' }],
  'jpg-to-pdf-under-50kb': [
    {
      name: 'strict',
      label: 'Strict Target Mode',
      type: 'select',
      defaultValue: 'true',
      options: booleanOptions,
    },
  ],
  'jpg-to-pdf-under-100kb': [
    {
      name: 'strict',
      label: 'Strict Target Mode',
      type: 'select',
      defaultValue: 'true',
      options: booleanOptions,
    },
  ],
  'jpeg-to-pdf-under-200kb': [
    {
      name: 'strict',
      label: 'Strict Target Mode',
      type: 'select',
      defaultValue: 'true',
      options: booleanOptions,
    },
  ],
  'jpg-to-pdf-under-300kb': [
    {
      name: 'strict',
      label: 'Strict Target Mode',
      type: 'select',
      defaultValue: 'true',
      options: booleanOptions,
    },
  ],
  'jpg-to-pdf-under-500kb': [
    {
      name: 'strict',
      label: 'Strict Target Mode',
      type: 'select',
      defaultValue: 'true',
      options: booleanOptions,
    },
  ],
  'html-to-image': [
    {
      name: 'url',
      label: 'Page URL',
      type: 'text',
      placeholder: 'https://example.com',
    },
    {
      name: 'html',
      label: 'Raw HTML (optional)',
      type: 'textarea',
      placeholder: '<h1>Hello World</h1>',
    },
    {
      name: 'format',
      label: 'Output Format',
      type: 'select',
      defaultValue: 'jpg',
      options: [
        { label: 'JPG', value: 'jpg' },
        { label: 'PNG', value: 'png' },
      ],
    },
  ],
  'pdf-to-mobi': [
    {
      name: 'title',
      label: 'Book Title',
      type: 'text',
      placeholder: 'My eBook Title',
    },
  ],
  'cbr-to-pdf': [],
  'djvu-to-pdf': [],
  'ai-to-pdf': [],
  'mobi-to-pdf': [],
  'xps-to-pdf': [],
  'wps-to-pdf': [],
  'dwg-to-pdf': [],
  'pub-to-pdf': [],
  'hwp-to-pdf': [],
  'chm-to-pdf': [],
  'dxf-to-pdf': [],
  'pages-to-pdf': [],

  'bcrypt-hash': [
    { name: 'text', label: 'Text to Hash', type: 'textarea', placeholder: 'Enter text...' },
  ],

  // ── SEO Tools ───────────────────────────────────────────────
  'meta-tag-generator': [
    { name: 'text', label: 'Website Title', type: 'text', placeholder: 'My Amazing Website' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'A great website...' },
    { name: 'keywords', label: 'Keywords', type: 'text', placeholder: 'web, tools, ishu' },
    { name: 'author', label: 'Author', type: 'text', placeholder: 'Ishu' },
  ],
  'keyword-density': [
    { name: 'text', label: 'Text Content', type: 'textarea', placeholder: 'Paste article or blog...' },
  ],
  'readability-score': [
    { name: 'text', label: 'Text Content', type: 'textarea', placeholder: 'Paste text to analyze...' },
  ],
  'character-counter': [
    { name: 'text', label: 'Text Content', type: 'textarea', placeholder: 'Paste text to count...' },
  ],
  'open-graph-generator': [
    { name: 'text', label: 'Page Title', type: 'text', placeholder: 'My Page' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Page description...' },
    { name: 'url', label: 'Page URL', type: 'text', placeholder: 'https://example.com' },
    { name: 'image', label: 'Image URL', type: 'text', placeholder: 'https://example.com/image.png' },
  ],

  // ── Code Tools ──────────────────────────────────────────────
  'minify-css': [
    { name: 'text', label: 'CSS Code', type: 'textarea', placeholder: 'body { margin: 0; }' },
  ],
  'minify-js': [
    { name: 'text', label: 'JavaScript Code', type: 'textarea', placeholder: 'function hello() { return 1; }' },
  ],
  'minify-html': [
    { name: 'text', label: 'HTML Code', type: 'textarea', placeholder: '<div> <p>Hello</p> </div>' },
  ],
  'prettify-css': [
    { name: 'text', label: 'CSS Code', type: 'textarea', placeholder: 'body{margin:0;padding:0}' },
  ],

  // ── Math & Calculator Tools ─────────────────────────────────
  'percentage-calculator': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '25' },
    { name: 'total', label: 'Total / Base', type: 'number', defaultValue: '200' },
    {
      name: 'mode', label: 'Calculation Mode', type: 'select', defaultValue: 'percentage',
      options: [
        { label: 'What % is Value of Total', value: 'percentage' },
        { label: 'Value% of Total', value: 'of' },
        { label: 'Percentage Change (old → new)', value: 'change' },
      ],
    },
  ],
  'average-calculator': [
    { name: 'text', label: 'Numbers (comma or space separated)', type: 'textarea', placeholder: '85, 90, 78, 92, 88' },
  ],
  'bmi-calculator': [
    { name: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: '70' },
    { name: 'height', label: 'Height (cm)', type: 'number', defaultValue: '175' },
    {
      name: 'unit', label: 'Unit System', type: 'select', defaultValue: 'metric',
      options: [
        { label: 'Metric (kg/cm)', value: 'metric' },
        { label: 'Imperial (lbs/in)', value: 'imperial' },
      ],
    },
  ],
  'age-calculator': [
    { name: 'text', label: 'Date of Birth', type: 'text', placeholder: '2000-01-15' },
  ],
  'gpa-calculator': [
    {
      name: 'text', label: 'Grades & Credits (one per line)',
      type: 'textarea', placeholder: 'A 3\nB+ 4\nA- 3\nC 2',
    },
  ],

  // ── Student & Everyday Tools ────────────────────────────────
  'number-base-converter': [
    { name: 'text', label: 'Number', type: 'text', placeholder: '255' },
    {
      name: 'from_base', label: 'From Base', type: 'select', defaultValue: 'decimal',
      options: [
        { label: 'Decimal', value: 'decimal' }, { label: 'Binary', value: 'binary' },
        { label: 'Octal', value: 'octal' }, { label: 'Hexadecimal', value: 'hex' },
      ],
    },
  ],
  'text-reverse': [
    { name: 'text', label: 'Text to Reverse', type: 'textarea', placeholder: 'Hello World' },
  ],
  'text-to-binary': [
    { name: 'text', label: 'Text Input', type: 'textarea', placeholder: 'Hello' },
  ],
  'binary-to-text': [
    { name: 'text', label: 'Binary Input', type: 'textarea', placeholder: '01001000 01100101 01101100 01101100 01101111' },
  ],
  'morse-code': [
    { name: 'text', label: 'Text / Morse Code', type: 'textarea', placeholder: 'Hello World' },
    {
      name: 'mode', label: 'Mode', type: 'select', defaultValue: 'encode',
      options: [
        { label: 'Encode (Text → Morse)', value: 'encode' },
        { label: 'Decode (Morse → Text)', value: 'decode' },
      ],
    },
  ],
  'text-to-ascii': [
    { name: 'text', label: 'Text Input', type: 'textarea', placeholder: 'ABC' },
  ],
  'ascii-to-text': [
    { name: 'text', label: 'ASCII Values', type: 'textarea', placeholder: '65 66 67' },
  ],
  'word-frequency': [
    { name: 'text', label: 'Text Content', type: 'textarea', placeholder: 'Paste text to analyze...' },
  ],
  'countdown-calculator': [
    { name: 'text', label: 'Target Date', type: 'text', placeholder: '2025-12-31' },
  ],

  // ── Student & Everyday Extended ─────────────────────────────
  'compound-interest-calculator': [
    { name: 'value', label: 'Principal Amount (₹)', type: 'number', defaultValue: '100000' },
    { name: 'total', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '10' },
    { name: 'years', label: 'Time (years)', type: 'number', defaultValue: '5' },
    { name: 'compound_per_year', label: 'Compounds Per Year', type: 'number', defaultValue: '12' },
  ],
  'simple-interest-calculator': [
    { name: 'value', label: 'Principal Amount (₹)', type: 'number', defaultValue: '50000' },
    { name: 'total', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '8' },
    { name: 'years', label: 'Time (years)', type: 'number', defaultValue: '3' },
  ],
  'salary-calculator': [
    { name: 'value', label: 'Annual Salary (₹)', type: 'number', defaultValue: '1200000' },
  ],
  'speed-distance-time': [
    { name: 'value', label: 'Value 1', type: 'number', defaultValue: '100' },
    { name: 'total', label: 'Value 2', type: 'number', defaultValue: '2' },
    {
      name: 'mode', label: 'Calculate', type: 'select', defaultValue: 'speed',
      options: [
        { label: 'Speed (Distance ÷ Time)', value: 'speed' },
        { label: 'Distance (Speed × Time)', value: 'distance' },
        { label: 'Time (Distance ÷ Speed)', value: 'time' },
      ],
    },
  ],
  'profit-loss-calculator': [
    { name: 'value', label: 'Cost Price (₹)', type: 'number', defaultValue: '100' },
    { name: 'total', label: 'Selling Price (₹)', type: 'number', defaultValue: '150' },
  ],
  'cgpa-to-percentage': [
    { name: 'value', label: 'CGPA / Percentage Value', type: 'number', defaultValue: '8.5' },
    {
      name: 'mode', label: 'Conversion Mode', type: 'select', defaultValue: 'cgpa_to_pct',
      options: [
        { label: 'CGPA → Percentage', value: 'cgpa_to_pct' },
        { label: 'Percentage → CGPA', value: 'pct_to_cgpa' },
      ],
    },
  ],
  'date-difference': [
    { name: 'text', label: 'Date 1 (YYYY-MM-DD)', type: 'text', placeholder: '2000-01-15' },
    { name: 'text2', label: 'Date 2 (YYYY-MM-DD, optional)', type: 'text', placeholder: '2025-01-15' },
  ],

  'text-to-hex': [
    { name: 'text', label: 'Text Input', type: 'textarea', placeholder: 'Hello World' },
  ],
  'hex-to-text': [
    { name: 'text', label: 'Hex Input', type: 'textarea', placeholder: '48 65 6c 6c 6f' },
  ],
  'text-to-unicode': [
    { name: 'text', label: 'Text Input', type: 'textarea', placeholder: 'Hello' },
  ],
  'unicode-to-text': [
    { name: 'text', label: 'Unicode Input', type: 'textarea', placeholder: '\\u0048\\u0065\\u006c' },
  ],
  'string-hash-generator': [
    { name: 'text', label: 'Text to Hash', type: 'textarea', placeholder: 'Enter text...' },
  ],
  'text-statistics': [
    { name: 'text', label: 'Text to Analyze', type: 'textarea', placeholder: 'Paste your text here...' },
  ],
  'case-converter-advanced': [
    { name: 'text', label: 'Text Input', type: 'textarea', placeholder: 'hello world example' },
    {
      name: 'mode', label: 'Target Case', type: 'select', defaultValue: 'camelCase',
      options: [
        { label: 'camelCase', value: 'camelCase' },
        { label: 'PascalCase', value: 'PascalCase' },
        { label: 'snake_case', value: 'snake_case' },
        { label: 'SCREAMING_SNAKE', value: 'SCREAMING_SNAKE' },
        { label: 'kebab-case', value: 'kebab-case' },
        { label: 'dot.case', value: 'dot.case' },
        { label: 'Title Case', value: 'title' },
        { label: 'aLtErNaTiNg', value: 'alternating' },
        { label: 'iNVERSE', value: 'inverse' },
      ],
    },
  ],
  'coin-flip': [
    { name: 'count', label: 'Number of Flips', type: 'number', defaultValue: '1' },
  ],
  'dice-roller': [
    { name: 'value', label: 'Number of Sides', type: 'number', defaultValue: '6' },
    { name: 'count', label: 'Number of Dice', type: 'number', defaultValue: '1' },
  ],
  'stopwatch-calculator': [
    { name: 'text', label: 'Time (HH:MM:SS or seconds)', type: 'text', placeholder: '3661 or 01:01:01' },
  ],
  'scientific-calculator': [
    { name: 'text', label: 'Math Expression', type: 'textarea', placeholder: 'sqrt(144) + 2^3 + sin(pi/2)' },
  ],
  'diff-checker': [
    { name: 'text1', label: 'Text 1 (Original)', type: 'textarea', placeholder: 'Paste original text...' },
    { name: 'text2', label: 'Text 2 (Modified)', type: 'textarea', placeholder: 'Paste modified text...' },
  ],
  'json-minifier': [
    { name: 'text', label: 'JSON Input', type: 'textarea', placeholder: 'Paste formatted JSON...' },
  ],
  'url-encoder': [
    { name: 'text', label: 'Text to Encode', type: 'textarea', placeholder: 'Hello World & ISHU TOOLS!' },
  ],
  'url-decoder': [
    { name: 'text', label: 'URL-encoded Text', type: 'textarea', placeholder: 'Hello%20World%20%26%20ISHU' },
  ],
  'html-encoder': [
    { name: 'text', label: 'HTML to Encode', type: 'textarea', placeholder: '<h1>ISHU TOOLS</h1>' },
  ],
  'html-decoder': [
    { name: 'text', label: 'Encoded HTML', type: 'textarea', placeholder: '&lt;h1&gt;ISHU TOOLS&lt;/h1&gt;' },
  ],
  'base64-encode': [
    { name: 'text', label: 'Text to Encode', type: 'textarea', placeholder: 'Enter text to encode to Base64...' },
  ],
  'base64-decode': [
    { name: 'text', label: 'Base64 Text', type: 'textarea', placeholder: 'Enter Base64 encoded text...' },
  ],
  'hash-generator': [
    { name: 'text', label: 'Text to Hash', type: 'textarea', placeholder: 'Enter text to generate hashes...' },
  ],
  'unix-timestamp-converter': [
    { name: 'text', label: 'Timestamp or Date', type: 'text', placeholder: '1713168000 or 2024-04-15 or now' },
    { name: 'mode', label: 'Mode', type: 'select', defaultValue: 'auto', options: [
      { label: 'Auto Detect', value: 'auto' },
      { label: 'Timestamp → Date', value: 'to_date' },
      { label: 'Date → Timestamp', value: 'to_timestamp' },
    ]},
  ],
  'css-minifier': [
    { name: 'text', label: 'CSS Code', type: 'textarea', placeholder: 'body {\n  color: red;\n  margin: 0;\n}' },
  ],
  'js-minifier': [
    { name: 'text', label: 'JavaScript Code', type: 'textarea', placeholder: 'function hello() {\n  console.log("Hi!");\n}' },
  ],
  'html-minifier': [
    { name: 'text', label: 'HTML Code', type: 'textarea', placeholder: '<div>\n  <p>Hello World</p>\n</div>' },
  ],
  'markdown-to-html': [
    { name: 'text', label: 'Markdown Text', type: 'textarea', placeholder: '# Heading\n\n**Bold** and *italic* text' },
  ],
  'html-to-markdown': [
    { name: 'text', label: 'HTML Code', type: 'textarea', placeholder: '<h1>Heading</h1><p><strong>Bold</strong></p>' },
  ],
  'json-to-csv-text': [
    { name: 'text', label: 'JSON Array', type: 'textarea', placeholder: '[{"name":"Ishu","age":22},{"name":"Tool","age":1}]' },
  ],
  'csv-to-json-text': [
    { name: 'text', label: 'CSV Data', type: 'textarea', placeholder: 'name,age\nIshu,22\nTool,1' },
  ],
  'sql-formatter': [
    { name: 'text', label: 'SQL Query', type: 'textarea', placeholder: 'SELECT * FROM users WHERE age > 18 ORDER BY name' },
  ],
  'yaml-to-json': [
    { name: 'text', label: 'YAML Text', type: 'textarea', placeholder: 'name: Ishu\nage: 22\ntools:\n  - pdf\n  - image' },
  ],
  'json-to-yaml': [
    { name: 'text', label: 'JSON Text', type: 'textarea', placeholder: '{"name":"Ishu","tools":["pdf","image"]}' },
  ],
  'text-escape-unescape': [
    { name: 'text', label: 'Text', type: 'textarea', placeholder: 'Enter text with special characters...' },
    { name: 'mode', label: 'Mode', type: 'select', defaultValue: 'escape', options: [
      { label: 'Escape', value: 'escape' },
      { label: 'Unescape', value: 'unescape' },
    ]},
  ],
  'ip-lookup': [
    { name: 'text', label: 'IP Address (leave empty for your IP)', type: 'text', placeholder: 'Leave empty or type IP' },
  ],
  'char-code-converter': [
    { name: 'text', label: 'Characters or Code Points', type: 'textarea', placeholder: 'ABC or 65 66 67' },
    { name: 'mode', label: 'Mode', type: 'select', defaultValue: 'to_codes', options: [
      { label: 'Characters → Codes', value: 'to_codes' },
      { label: 'Codes → Characters', value: 'from_codes' },
    ]},
  ],

  // ─── Color Tools ───
  'color-picker': [
    { name: 'text', label: 'HEX Color', type: 'text', defaultValue: '#3b82f6' },
  ],
  'hex-to-rgb': [
    { name: 'text', label: 'HEX Color Code', type: 'text', placeholder: '#FF5733 or FF5733' },
  ],
  'rgb-to-hex': [
    { name: 'r', label: 'Red (0-255)', type: 'number', defaultValue: '59' },
    { name: 'g', label: 'Green (0-255)', type: 'number', defaultValue: '130' },
    { name: 'b', label: 'Blue (0-255)', type: 'number', defaultValue: '246' },
  ],
  'rgb-to-hsl': [
    { name: 'r', label: 'Red (0-255)', type: 'number', defaultValue: '59' },
    { name: 'g', label: 'Green (0-255)', type: 'number', defaultValue: '130' },
    { name: 'b', label: 'Blue (0-255)', type: 'number', defaultValue: '246' },
  ],
  'gradient-generator': [
    { name: 'color1', label: 'Color 1', type: 'text', defaultValue: '#667eea' },
    { name: 'color2', label: 'Color 2', type: 'text', defaultValue: '#764ba2' },
    { name: 'direction', label: 'Direction', type: 'select', defaultValue: 'to right', options: [
      { label: 'To Right', value: 'to right' },
      { label: 'To Left', value: 'to left' },
      { label: 'To Bottom', value: 'to bottom' },
      { label: 'To Top', value: 'to top' },
      { label: '45Â°', value: '45deg' },
      { label: '135Â°', value: '135deg' },
    ]},
  ],

  // ─── Security Tools ───
  'password-generator': [
    { name: 'length', label: 'Password Length', type: 'number', defaultValue: '16' },
    { name: 'count', label: 'Number of Passwords', type: 'number', defaultValue: '5' },
    { name: 'uppercase', label: 'Include Uppercase', type: 'select', defaultValue: 'true', options: booleanOptions },
    { name: 'lowercase', label: 'Include Lowercase', type: 'select', defaultValue: 'true', options: booleanOptions },
    { name: 'digits', label: 'Include Numbers', type: 'select', defaultValue: 'true', options: booleanOptions },
    { name: 'symbols', label: 'Include Symbols', type: 'select', defaultValue: 'true', options: booleanOptions },
  ],

  'md5-generator': [
    { name: 'text', label: 'Text to Hash', type: 'textarea', placeholder: 'Enter text...' },
  ],
  'sha256-generator': [
    { name: 'text', label: 'Text to Hash', type: 'textarea', placeholder: 'Enter text...' },
  ],
  'bcrypt-generator': [
    { name: 'text', label: 'Password to Hash', type: 'password', placeholder: 'Enter password...' },
  ],

  // ─── Unit Converters ───
  'temperature-converter': [
    { name: 'value', label: 'Temperature Value', type: 'number', defaultValue: '100' },
    { name: 'from_unit', label: 'From Unit', type: 'select', defaultValue: 'celsius', options: [
      { label: 'Celsius', value: 'celsius' },
      { label: 'Fahrenheit', value: 'fahrenheit' },
      { label: 'Kelvin', value: 'kelvin' },
    ]},
  ],
  'length-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '1' },
    { name: 'from_unit', label: 'From', type: 'select', defaultValue: 'meter', options: [
      { label: 'Meter', value: 'meter' }, { label: 'Kilometer', value: 'kilometer' },
      { label: 'Centimeter', value: 'centimeter' }, { label: 'Millimeter', value: 'millimeter' },
      { label: 'Mile', value: 'mile' }, { label: 'Yard', value: 'yard' },
      { label: 'Foot', value: 'foot' }, { label: 'Inch', value: 'inch' },
    ]},
    { name: 'to_unit', label: 'To', type: 'select', defaultValue: 'foot', options: [
      { label: 'Meter', value: 'meter' }, { label: 'Kilometer', value: 'kilometer' },
      { label: 'Centimeter', value: 'centimeter' }, { label: 'Millimeter', value: 'millimeter' },
      { label: 'Mile', value: 'mile' }, { label: 'Yard', value: 'yard' },
      { label: 'Foot', value: 'foot' }, { label: 'Inch', value: 'inch' },
    ]},
  ],
  'weight-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '1' },
    { name: 'from_unit', label: 'From', type: 'select', defaultValue: 'kg', options: [
      { label: 'Kilogram', value: 'kg' }, { label: 'Gram', value: 'g' },
      { label: 'Pound', value: 'lb' }, { label: 'Ounce', value: 'oz' },
      { label: 'Ton', value: 'ton' }, { label: 'Stone', value: 'stone' },
    ]},
    { name: 'to_unit', label: 'To', type: 'select', defaultValue: 'lb', options: [
      { label: 'Kilogram', value: 'kg' }, { label: 'Gram', value: 'g' },
      { label: 'Pound', value: 'lb' }, { label: 'Ounce', value: 'oz' },
      { label: 'Ton', value: 'ton' }, { label: 'Stone', value: 'stone' },
    ]},
  ],
  'speed-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '100' },
    { name: 'from_unit', label: 'From', type: 'select', defaultValue: 'km/h', options: [
      { label: 'km/h', value: 'km/h' }, { label: 'mph', value: 'mph' },
      { label: 'm/s', value: 'm/s' }, { label: 'knots', value: 'knots' },
    ]},
    { name: 'to_unit', label: 'To', type: 'select', defaultValue: 'mph', options: [
      { label: 'km/h', value: 'km/h' }, { label: 'mph', value: 'mph' },
      { label: 'm/s', value: 'm/s' }, { label: 'knots', value: 'knots' },
    ]},
  ],
  'data-storage-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '1' },
    { name: 'from_unit', label: 'From', type: 'select', defaultValue: 'gb', options: [
      { label: 'Bytes', value: 'bytes' }, { label: 'KB', value: 'kb' },
      { label: 'MB', value: 'mb' }, { label: 'GB', value: 'gb' },
      { label: 'TB', value: 'tb' }, { label: 'PB', value: 'pb' },
    ]},
    { name: 'to_unit', label: 'To', type: 'select', defaultValue: 'mb', options: [
      { label: 'Bytes', value: 'bytes' }, { label: 'KB', value: 'kb' },
      { label: 'MB', value: 'mb' }, { label: 'GB', value: 'gb' },
      { label: 'TB', value: 'tb' }, { label: 'PB', value: 'pb' },
    ]},
  ],
  'area-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '1' },
    { name: 'from_unit', label: 'From', type: 'select', defaultValue: 'sqm', options: [
      { label: 'Square Meter', value: 'sqm' }, { label: 'Square Foot', value: 'sqft' },
      { label: 'Acre', value: 'acre' }, { label: 'Hectare', value: 'hectare' },
    ]},
    { name: 'to_unit', label: 'To', type: 'select', defaultValue: 'sqft', options: [
      { label: 'Square Meter', value: 'sqm' }, { label: 'Square Foot', value: 'sqft' },
      { label: 'Acre', value: 'acre' }, { label: 'Hectare', value: 'hectare' },
    ]},
  ],
  'volume-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '1' },
    { name: 'from_unit', label: 'From', type: 'select', defaultValue: 'liter', options: [
      { label: 'Liter', value: 'liter' }, { label: 'Milliliter', value: 'ml' },
      { label: 'Gallon', value: 'gallon' }, { label: 'Cup', value: 'cup' },
    ]},
    { name: 'to_unit', label: 'To', type: 'select', defaultValue: 'gallon', options: [
      { label: 'Liter', value: 'liter' }, { label: 'Milliliter', value: 'ml' },
      { label: 'Gallon', value: 'gallon' }, { label: 'Cup', value: 'cup' },
    ]},
  ],
  'time-zone-converter': [
    { name: 'time', label: 'Time (HH:MM or "now")', type: 'text', defaultValue: 'now' },
    { name: 'from_timezone', label: 'From Timezone', type: 'select', defaultValue: 'UTC', options: [
      { label: 'UTC', value: 'UTC' }, { label: 'IST (India)', value: 'IST' },
      { label: 'EST (US East)', value: 'EST' }, { label: 'PST (US West)', value: 'PST' },
      { label: 'GMT', value: 'GMT' }, { label: 'JST (Japan)', value: 'JST' },
      { label: 'CET (Europe)', value: 'CET' },
    ]},
    { name: 'to_timezone', label: 'To Timezone', type: 'select', defaultValue: 'IST', options: [
      { label: 'UTC', value: 'UTC' }, { label: 'IST (India)', value: 'IST' },
      { label: 'EST (US East)', value: 'EST' }, { label: 'PST (US West)', value: 'PST' },
      { label: 'GMT', value: 'GMT' }, { label: 'JST (Japan)', value: 'JST' },
      { label: 'CET (Europe)', value: 'CET' },
    ]},
  ],
  'energy-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '1' },
    { name: 'from_unit', label: 'From', type: 'select', defaultValue: 'kcal', options: [
      { label: 'Joule', value: 'j' }, { label: 'Kilojoule', value: 'kj' },
      { label: 'Calorie', value: 'cal' }, { label: 'Kilocalorie', value: 'kcal' },
      { label: 'kWh', value: 'kwh' }, { label: 'BTU', value: 'btu' },
    ]},
    { name: 'to_unit', label: 'To', type: 'select', defaultValue: 'j', options: [
      { label: 'Joule', value: 'j' }, { label: 'Kilojoule', value: 'kj' },
      { label: 'Calorie', value: 'cal' }, { label: 'Kilocalorie', value: 'kcal' },
      { label: 'kWh', value: 'kwh' }, { label: 'BTU', value: 'btu' },
    ]},
  ],
  'pressure-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '1' },
    { name: 'from_unit', label: 'From', type: 'select', defaultValue: 'atm', options: [
      { label: 'Pascal', value: 'pa' }, { label: 'Bar', value: 'bar' },
      { label: 'ATM', value: 'atm' }, { label: 'PSI', value: 'psi' },
      { label: 'mmHg', value: 'mmhg' },
    ]},
    { name: 'to_unit', label: 'To', type: 'select', defaultValue: 'psi', options: [
      { label: 'Pascal', value: 'pa' }, { label: 'Bar', value: 'bar' },
      { label: 'ATM', value: 'atm' }, { label: 'PSI', value: 'psi' },
      { label: 'mmHg', value: 'mmhg' },
    ]},
  ],

  // ─── Social Media Tools ───
  'instagram-post-resizer': [
    { name: 'aspect', label: 'Aspect Ratio', type: 'select', defaultValue: 'square', options: [
      { label: 'Square (1:1) - 1080x1080', value: 'square' },
      { label: 'Portrait (4:5) - 1080x1350', value: 'portrait' },
      { label: 'Landscape (1.91:1) - 1080x566', value: 'landscape' },
    ]},
  ],
  'youtube-thumbnail-maker': [],
  'twitter-header-maker': [],
  'facebook-cover-maker': [],
  'linkedin-banner-maker': [],
  'whatsapp-dp-maker': [],
  'flashcard-generator': [
    { name: 'text', label: 'Study Notes', type: 'textarea', placeholder: 'Paste notes, chapter summary, or lecture points...' },
    { name: 'count', label: 'Number of Flashcards', type: 'number', defaultValue: '10' },
  ],
  'study-planner': [
    { name: 'subjects', label: 'Subjects', type: 'textarea', placeholder: 'Math, Physics, Chemistry, English' },
    { name: 'exam_date', label: 'Exam Date', type: 'text', placeholder: 'YYYY-MM-DD' },
    { name: 'hours_per_day', label: 'Hours Per Day', type: 'number', defaultValue: '3' },
  ],
  'grade-calculator': [
    { name: 'scores', label: 'Scores', type: 'textarea', placeholder: '90/100, 45/50, 18/20' },
  ],
  'reading-time-calculator': [
    { name: 'text', label: 'Text', type: 'textarea', placeholder: 'Paste article, essay, speech, or notes...' },
    { name: 'wpm', label: 'Reading Speed (WPM)', type: 'number', defaultValue: '200' },
  ],
  'plagiarism-risk-checker': [
    { name: 'text', label: 'Text to Check', type: 'textarea', placeholder: 'Paste assignment, essay, or paragraph...' },
  ],
  'resume-bullet-generator': [
    { name: 'role', label: 'Role / Context', type: 'text', placeholder: 'Frontend Intern, Student Project, Volunteer' },
    { name: 'task', label: 'Work / Achievement', type: 'textarea', placeholder: 'Built a dashboard that tracked weekly study progress' },
    { name: 'metric', label: 'Metric / Result', type: 'text', placeholder: 'reduced manual work by 40%' },
  ],

  // ─── Image Plus Tools ────────────────────────────────────────────────────────
  'png-to-webp': [
    { name: 'quality', label: 'Quality (1-100)', type: 'number', defaultValue: '85' },
  ],
  'jpg-to-webp': [
    { name: 'quality', label: 'Quality (1-100)', type: 'number', defaultValue: '85' },
  ],
  'jpeg-to-webp': [
    { name: 'quality', label: 'Quality (1-100)', type: 'number', defaultValue: '85' },
  ],
  'gif-to-jpg': [
    { name: 'quality', label: 'JPEG Quality', type: 'number', defaultValue: '90' },
  ],
  'tiff-to-jpg': [
    { name: 'quality', label: 'JPEG Quality', type: 'number', defaultValue: '90' },
  ],
  'bmp-to-jpg': [
    { name: 'quality', label: 'JPEG Quality', type: 'number', defaultValue: '90' },
  ],
  'svg-to-png': [
    { name: 'scale', label: 'Scale Factor (1x = original, 2x = double)', type: 'number', defaultValue: '2.0' },
  ],
  'image-to-jpg': [
    { name: 'quality', label: 'JPEG Quality (1-100)', type: 'number', defaultValue: '92' },
  ],
  'png-to-jpg': [
    { name: 'quality', label: 'JPEG Quality (1-100)', type: 'number', defaultValue: '92' },
  ],
  'webp-to-jpg': [
    { name: 'quality', label: 'JPEG Quality (1-100)', type: 'number', defaultValue: '92' },
  ],
  'heic-to-jpg': [
    { name: 'quality', label: 'JPEG Quality (1-100)', type: 'number', defaultValue: '90' },
  ],
  'circle-crop': [
    {
      name: 'format',
      label: 'Output Format',
      type: 'select',
      defaultValue: 'png',
      options: [
        { label: 'PNG (transparent background)', value: 'png' },
        { label: 'JPG (white background)', value: 'jpg' },
      ],
    },
  ],
  'add-text-to-image': [
    { name: 'text', label: 'Text', type: 'text', placeholder: 'ISHU TOOLS', defaultValue: 'ISHU TOOLS' },
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '36' },
    { name: 'color', label: 'Text Color (HEX)', type: 'text', defaultValue: '#ffffff' },
    {
      name: 'position',
      label: 'Position',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Top Left', value: 'top-left' },
        { label: 'Top Center', value: 'top-center' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Bottom Center', value: 'bottom-center' },
        { label: 'Bottom Right', value: 'bottom-right' },
      ],
    },
    { name: 'opacity', label: 'Opacity (0.0–1.0)', type: 'number', defaultValue: '0.9' },
  ],
  'compress-image-to-kb': [
    { name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '100' },
  ],
  'reduce-image-size-kb': [
    { name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '100' },
  ],
  'increase-image-size-kb': [
    { name: 'target_kb', label: 'Target Size (KB)', type: 'number', defaultValue: '500' },
  ],
  'dpi-checker': [],
  'change-dpi': [
    { name: 'dpi', label: 'DPI Value', type: 'number', defaultValue: '300' },
  ],
  'photo-collage': [
    { name: 'cols', label: 'Columns', type: 'number', defaultValue: '3' },
    { name: 'thumb_size', label: 'Thumbnail Size (px)', type: 'number', defaultValue: '400' },
    { name: 'gap', label: 'Gap Between Images (px)', type: 'number', defaultValue: '8' },
    { name: 'bg_color', label: 'Background Color (HEX)', type: 'text', defaultValue: '#1a1a2e' },
  ],
  'view-image-metadata': [],

  // ─── Text / Utility tools (newly added to registry) ─────────────────────────
  'epoch-converter': [
    {
      name: 'mode',
      label: 'Conversion Mode',
      type: 'select',
      defaultValue: 'to_human',
      options: [
        { label: 'Epoch → Human Date', value: 'to_human' },
        { label: 'Human Date → Epoch', value: 'to_epoch' },
      ],
    },
    { name: 'value', label: 'Value', type: 'text', placeholder: '1700000000 or 2024-11-14T22:13:20' },
  ],
  'fancy-text-generator': [
    { name: 'text', label: 'Text', type: 'text', placeholder: 'Type your name or message...' },
  ],
  'json-path-finder': [
    { name: 'json', label: 'JSON', type: 'textarea', placeholder: '{"user": {"name": "Ishu", "age": 21}}' },
    { name: 'path', label: 'JSONPath Expression', type: 'text', placeholder: '$.user.name', defaultValue: '$' },
  ],
  'line-counter': [
    { name: 'text', label: 'Text', type: 'textarea', placeholder: 'Paste your text here...' },
  ],
  'morse-to-text': [
    { name: 'morse', label: 'Morse Code', type: 'textarea', placeholder: '.... . .-.. .-.. ---   .-- --- .-. .-.. -..' },
  ],
  'nato-alphabet': [
    { name: 'text', label: 'Text', type: 'text', placeholder: 'Type letters...' },
  ],
  'number-to-roman': [
    { name: 'number', label: 'Number (1–3999)', type: 'number', defaultValue: '2024' },
  ],
  'roman-to-number': [
    { name: 'roman', label: 'Roman Numeral', type: 'text', placeholder: 'MMXXIV' },
  ],
  'octal-to-text': [
    { name: 'octal', label: 'Octal Values (space-separated)', type: 'textarea', placeholder: '110 145 154 154 157' },
  ],
  'text-to-octal': [
    { name: 'text', label: 'Text', type: 'text', placeholder: 'Hello' },
  ],
  'pig-latin': [
    { name: 'text', label: 'Text', type: 'text', placeholder: 'Hello world' },
  ],
  'text-repeat': [
    { name: 'text', label: 'Text', type: 'text', placeholder: 'Repeat this text' },
    { name: 'count', label: 'Repeat Count', type: 'number', defaultValue: '3' },
    {
      name: 'separator',
      label: 'Separator',
      type: 'select',
      defaultValue: '\n',
      options: [
        { label: 'New Line', value: '\n' },
        { label: 'Comma', value: ', ' },
        { label: 'Space', value: ' ' },
        { label: 'None', value: '' },
      ],
    },
  ],
  'random-color-generator': [
    { name: 'count', label: 'Number of Colors', type: 'number', defaultValue: '5' },
  ],
  'string-hash': [
    { name: 'text', label: 'Text', type: 'textarea', placeholder: 'Enter text to hash...' },
  ],
  'text-to-ascii-art': [
    { name: 'text', label: 'Text', type: 'text', placeholder: 'ISHU', defaultValue: 'ISHU' },
    {
      name: 'style',
      label: 'Font Style',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Big', value: 'big' },
        { label: 'Block', value: 'block' },
        { label: 'Bubble', value: 'bubble' },
        { label: 'Slant', value: 'slant' },
        { label: 'Banner', value: 'banner' },
        { label: 'Digital', value: 'digital' },
      ],
    },
  ],
  'whitespace-remover': [
    { name: 'text', label: 'Text', type: 'textarea', placeholder: 'Paste text with extra spaces...' },
    {
      name: 'mode',
      label: 'Remove Mode',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All Whitespace (collapse to single space)', value: 'all' },
        { label: 'Leading Spaces', value: 'leading' },
        { label: 'Trailing Spaces', value: 'trailing' },
        { label: 'Extra Spaces (keep single spaces)', value: 'extra' },
        { label: 'All Line Whitespace (trim each line)', value: 'all_lines' },
      ],
    },
  ],

  // ── HEALTH & FITNESS TOOLS ───────────────────────────────────────────
  'bmr-calculator': [
    { name: 'age', label: 'Age (years)', type: 'number', defaultValue: '25', placeholder: '25' },
    { name: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: '70', placeholder: '70' },
    { name: 'height', label: 'Height (cm)', type: 'number', defaultValue: '170', placeholder: '170' },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      defaultValue: 'male',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
  ],
  'body-fat-calculator': [
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      defaultValue: 'male',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    { name: 'waist', label: 'Waist (cm)', type: 'number', defaultValue: '80', placeholder: '80' },
    { name: 'neck', label: 'Neck (cm)', type: 'number', defaultValue: '37', placeholder: '37' },
    { name: 'hip', label: 'Hip (cm) — females only', type: 'number', defaultValue: '95', placeholder: '95' },
    { name: 'height', label: 'Height (cm)', type: 'number', defaultValue: '170', placeholder: '170' },
  ],
  'heart-rate-zones': [
    { name: 'age', label: 'Age (years)', type: 'number', defaultValue: '25', placeholder: '25' },
    { name: 'resting_hr', label: 'Resting Heart Rate (bpm)', type: 'number', defaultValue: '70', placeholder: '70' },
  ],
  'steps-to-km': [
    { name: 'steps', label: 'Number of Steps', type: 'number', defaultValue: '10000', placeholder: '10000' },
    { name: 'height', label: 'Your Height (cm)', type: 'number', defaultValue: '170', placeholder: '170' },
    { name: 'weight', label: 'Your Weight (kg)', type: 'number', defaultValue: '70', placeholder: '70' },
  ],
  'calories-burned-calculator': [
    {
      name: 'activity',
      label: 'Activity',
      type: 'select',
      defaultValue: 'walking',
      options: [
        { label: 'Walking (moderate pace)', value: 'walking' },
        { label: 'Running (8 km/h)', value: 'running' },
        { label: 'Cycling (moderate)', value: 'cycling' },
        { label: 'Swimming (freestyle)', value: 'swimming' },
        { label: 'Yoga', value: 'yoga' },
        { label: 'Weight Training / Gym', value: 'weight_training' },
        { label: 'Jump Rope / Skipping', value: 'jump_rope' },
        { label: 'Dancing', value: 'dancing' },
        { label: 'Hiking', value: 'hiking' },
        { label: 'Badminton / Tennis', value: 'badminton' },
        { label: 'Cricket (batting/fielding)', value: 'cricket' },
        { label: 'Football / Soccer', value: 'football' },
      ],
    },
    { name: 'weight', label: 'Your Weight (kg)', type: 'number', defaultValue: '70', placeholder: '70' },
    { name: 'duration', label: 'Duration (minutes)', type: 'number', defaultValue: '30', placeholder: '30' },
  ],

  // ── FINANCE & TAX TOOLS ───────────────────────────────────────────────
  'gst-calculator': [
    { name: 'value', label: 'Amount (₹)', type: 'number', defaultValue: '1000', placeholder: '1000' },
    {
      name: 'rate',
      label: 'GST Rate (%)',
      type: 'select',
      defaultValue: '18',
      options: [
        { label: '5% GST (basic necessities)', value: '5' },
        { label: '12% GST (standard goods)', value: '12' },
        { label: '18% GST (most goods/services)', value: '18' },
        { label: '28% GST (luxury goods)', value: '28' },
      ],
    },
    {
      name: 'type',
      label: 'Calculate',
      type: 'select',
      defaultValue: 'add',
      options: [
        { label: 'Add GST (exclusive price → GST-inclusive)', value: 'add' },
        { label: 'Remove GST (inclusive price → original)', value: 'remove' },
      ],
    },
  ],
  'roi-calculator': [
    { name: 'initial_investment', label: 'Initial Investment (₹)', type: 'number', defaultValue: '100000', placeholder: '100000' },
    { name: 'final_value', label: 'Final Value (₹)', type: 'number', defaultValue: '150000', placeholder: '150000' },
    { name: 'years', label: 'Investment Period (years)', type: 'number', defaultValue: '3', placeholder: '3' },
  ],
  'budget-planner': [
    { name: 'income', label: 'Monthly Income (₹)', type: 'number', defaultValue: '50000', placeholder: '50000' },
    { name: 'needs_pct', label: 'Needs % (default 50)', type: 'number', defaultValue: '50', placeholder: '50' },
    { name: 'wants_pct', label: 'Wants % (default 30)', type: 'number', defaultValue: '30', placeholder: '30' },
    { name: 'savings_pct', label: 'Savings % (default 20)', type: 'number', defaultValue: '20', placeholder: '20' },
  ],
  'savings-goal': [
    { name: 'goal_amount', label: 'Goal Amount (₹)', type: 'number', defaultValue: '500000', placeholder: '500000' },
    { name: 'current_savings', label: 'Current Savings (₹)', type: 'number', defaultValue: '50000', placeholder: '50000' },
    { name: 'monthly_saving', label: 'Monthly Saving (₹)', type: 'number', defaultValue: '10000', placeholder: '10000' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '7', placeholder: '7' },
  ],
  'savings-goal-calculator': [
    { name: 'goal_amount', label: 'Goal Amount (₹)', type: 'number', defaultValue: '500000', placeholder: '500000' },
    { name: 'current_savings', label: 'Current Savings (₹)', type: 'number', defaultValue: '50000', placeholder: '50000' },
    { name: 'monthly_saving', label: 'Monthly Saving (₹)', type: 'number', defaultValue: '10000', placeholder: '10000' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '7', placeholder: '7' },
  ],
  'income-tax-calculator': [
    { name: 'income', label: 'Annual Income (₹)', type: 'number', defaultValue: '1000000', placeholder: '1000000' },
    {
      name: 'regime',
      label: 'Tax Regime',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New Regime (FY 2024-25) — ₹0 tax up to ₹7L', value: 'new' },
        { label: 'Old Regime (with deductions)', value: 'old' },
        { label: 'Both (compare new vs old)', value: 'both' },
      ],
    },
    { name: 'deductions_80c', label: 'Deductions 80C (₹) — old regime only', type: 'number', defaultValue: '150000', placeholder: '150000' },
    { name: 'hra', label: 'HRA Exemption (₹) — old regime only', type: 'number', defaultValue: '0', placeholder: '0' },
  ],
  'emi-calculator': [
    { name: 'loan_amount', label: 'Loan Amount (₹)', type: 'number', defaultValue: '500000', placeholder: '500000' },
    { name: 'interest_rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '8.5', placeholder: '8.5' },
    { name: 'tenure', label: 'Loan Tenure (years)', type: 'number', defaultValue: '5', placeholder: '5' },
  ],
  'love-calculator': [
    { name: 'name1', label: 'Your Name', type: 'text', defaultValue: '', placeholder: 'e.g. Rahul' },
    { name: 'name2', label: 'Partner\'s Name', type: 'text', defaultValue: '', placeholder: 'e.g. Priya' },
  ],
  'time-until-event': [
    {
      name: 'event_date',
      label: 'Event Date & Time (YYYY-MM-DD HH:MM)',
      type: 'text',
      placeholder: '2025-01-01 00:00',
    },
    { name: 'event_name', label: 'Event Name (optional)', type: 'text', placeholder: 'New Year 2025', defaultValue: '' },
  ],
  'date-calculator': [
    { name: 'date1', label: 'Start Date (YYYY-MM-DD)', type: 'text', placeholder: '2024-01-01' },
    { name: 'date2', label: 'End Date (YYYY-MM-DD)', type: 'text', placeholder: '2025-01-01' },
    {
      name: 'operation',
      label: 'Operation',
      type: 'select',
      defaultValue: 'difference',
      options: [
        { label: 'Difference between two dates', value: 'difference' },
        { label: 'Add days to start date', value: 'add' },
        { label: 'Subtract days from start date', value: 'subtract' },
      ],
    },
    { name: 'days_offset', label: 'Days to Add/Subtract (for add/subtract)', type: 'number', defaultValue: '30', placeholder: '30' },
  ],
  'age-in-seconds': [
    {
      name: 'birthdate',
      label: 'Date of Birth (YYYY-MM-DD)',
      type: 'text',
      placeholder: '1998-08-15',
    },
  ],
  'random-name-generator': [
    { name: 'count', label: 'Number of Names', type: 'number', defaultValue: '5', placeholder: '5' },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      defaultValue: 'any',
      options: [
        { label: 'Any', value: 'any' },
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    {
      name: 'style',
      label: 'Name Style',
      type: 'select',
      defaultValue: 'indian',
      options: [
        { label: 'Indian', value: 'indian' },
        { label: 'Western / English', value: 'western' },
        { label: 'Full Name (First + Last)', value: 'full' },
      ],
    },
  ],
  'random-number-generator': [
    { name: 'min', label: 'Minimum', type: 'number', defaultValue: '1', placeholder: '1' },
    { name: 'max', label: 'Maximum', type: 'number', defaultValue: '100', placeholder: '100' },
    { name: 'count', label: 'Count (how many numbers)', type: 'number', defaultValue: '5', placeholder: '5' },
    {
      name: 'unique',
      label: 'Unique Numbers',
      type: 'select',
      defaultValue: 'true',
      options: [
        { label: 'Yes — no duplicates', value: 'true' },
        { label: 'No — duplicates allowed', value: 'false' },
      ],
    },
  ],

  // ─── Video Downloaders ───────────────────────────────────────────────
  'video-downloader': [
    { name: 'url', label: 'Video URL', type: 'text', placeholder: 'Paste YouTube, Instagram, Twitter, TikTok URL here...' },
    {
      name: 'quality',
      label: 'Quality',
      type: 'select',
      defaultValue: '1080',
      options: [
        { label: 'Best Available (up to 8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD (recommended)', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
        { label: '240p Very Low', value: '240' },
      ],
    },
  ],
  'youtube-video-downloader': [
    { name: 'url', label: 'YouTube URL', type: 'text', placeholder: 'Paste YouTube video URL here... e.g. https://youtube.com/watch?v=...' },
    {
      name: 'quality',
      label: 'Quality',
      type: 'select',
      defaultValue: '1080',
      options: [
        { label: 'Best Available (up to 8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD (recommended)', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
        { label: '240p Very Low', value: '240' },
      ],
    },
  ],
  'youtube-to-mp3': [
    { name: 'url', label: 'YouTube URL', type: 'text', placeholder: 'Paste YouTube video URL to extract audio as MP3...' },
    {
      name: 'audio_quality',
      label: 'Audio Quality',
      type: 'select',
      defaultValue: '192',
      options: [
        { label: '320 kbps (Best)', value: '320' },
        { label: '256 kbps', value: '256' },
        { label: '192 kbps (Recommended)', value: '192' },
        { label: '160 kbps', value: '160' },
        { label: '128 kbps', value: '128' },
        { label: '96 kbps (Smaller file)', value: '96' },
      ],
    },
  ],
  'youtube-downloader': [
    { name: 'url', label: 'YouTube URL', type: 'text', placeholder: 'Paste YouTube video URL... e.g. https://youtube.com/watch?v=...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: '1080',
      options: [
        { label: 'Best Available (up to 8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD (recommended)', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
        { label: '240p Very Low', value: '240' },
      ],
    },
  ],
  'photo-collage-maker': [
    {
      name: 'columns',
      label: 'Columns',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns (Grid)', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    { name: 'cell_size', label: 'Cell Size (px)', type: 'number', defaultValue: '420', min: 100, max: 1200 },
  ],

  // ─── Network Tools ───────────────────────────────────────────────────
  'ip-address-lookup': [
    { name: 'ip', label: 'IP Address (optional)', type: 'text', placeholder: 'Leave empty to check your own IP, or enter any IP...' },
  ],
  'dns-lookup': [
    { name: 'domain', label: 'Domain Name', type: 'text', placeholder: 'e.g. google.com, youtube.com, ishutools.com' },
  ],
  'whois-lookup': [
    { name: 'domain', label: 'Domain Name', type: 'text', placeholder: 'e.g. google.com, amazon.com' },
  ],
  'ssl-certificate-checker': [
    { name: 'domain', label: 'Website Domain', type: 'text', placeholder: 'e.g. google.com, github.com (without https://)' },
  ],

  // ─── Text Tools ──────────────────────────────────────────────────────
  'text-to-morse': [
    { name: 'text', label: 'Text or Morse Code', type: 'textarea', placeholder: 'Enter text to convert to Morse code, or Morse code to decode...' },
    {
      name: 'mode',
      label: 'Mode',
      type: 'select',
      defaultValue: 'text-to-morse',
      options: [
        { label: 'Text → Morse Code', value: 'text-to-morse' },
        { label: 'Morse Code → Text', value: 'morse-to-text' },
      ],
    },
  ],
  'ascii-art-generator': [
    { name: 'text', label: 'Text to Convert', type: 'text', placeholder: 'Enter text (up to 20 characters)...' },
  ],
  'grammar-checker': [
    { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste your English text here to check for grammar and spelling mistakes...' },
  ],
  'paraphrase-tool': [
    { name: 'text', label: 'Text to Paraphrase', type: 'textarea', placeholder: 'Paste your text here to paraphrase it in different words...' },
  ],
  'plagiarism-detector': [
    { name: 'text', label: 'Text to Check', type: 'textarea', placeholder: 'Paste your text to check for duplicate or copied content...' },
  ],
  'text-to-handwriting': [
    { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Enter text to convert to handwriting style (max 500 characters)...' },
  ],
  'word-frequency-counter': [
    { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste your text here to analyze word frequency...' },
  ],

  // ─── Math Tools ──────────────────────────────────────────────────────
  'prime-number-checker': [
    { name: 'text', label: 'Number', type: 'number', placeholder: 'Enter a number to check if it is prime...' },
  ],
  'currency-converter': [
    { name: 'amount', label: 'Amount', type: 'number', defaultValue: '1', placeholder: 'Enter amount...' },
    {
      name: 'from',
      label: 'From Currency',
      type: 'select',
      defaultValue: 'USD',
      options: [
        { label: 'USD — US Dollar', value: 'USD' },
        { label: 'INR — Indian Rupee', value: 'INR' },
        { label: 'EUR — Euro', value: 'EUR' },
        { label: 'GBP — British Pound', value: 'GBP' },
        { label: 'AED — UAE Dirham', value: 'AED' },
        { label: 'SGD — Singapore Dollar', value: 'SGD' },
        { label: 'CAD — Canadian Dollar', value: 'CAD' },
        { label: 'AUD — Australian Dollar', value: 'AUD' },
        { label: 'JPY — Japanese Yen', value: 'JPY' },
        { label: 'SAR — Saudi Riyal', value: 'SAR' },
        { label: 'MYR — Malaysian Ringgit', value: 'MYR' },
      ],
    },
    {
      name: 'to',
      label: 'To Currency',
      type: 'select',
      defaultValue: 'INR',
      options: [
        { label: 'INR — Indian Rupee', value: 'INR' },
        { label: 'USD — US Dollar', value: 'USD' },
        { label: 'EUR — Euro', value: 'EUR' },
        { label: 'GBP — British Pound', value: 'GBP' },
        { label: 'AED — UAE Dirham', value: 'AED' },
        { label: 'SGD — Singapore Dollar', value: 'SGD' },
        { label: 'CAD — Canadian Dollar', value: 'CAD' },
        { label: 'AUD — Australian Dollar', value: 'AUD' },
        { label: 'JPY — Japanese Yen', value: 'JPY' },
        { label: 'SAR — Saudi Riyal', value: 'SAR' },
        { label: 'MYR — Malaysian Ringgit', value: 'MYR' },
      ],
    },
  ],
  'gst-calculator-india': [
    { name: 'amount', label: 'Amount (₹)', type: 'number', placeholder: 'Enter original amount...' },
    {
      name: 'gst_rate',
      label: 'GST Rate (%)',
      type: 'select',
      defaultValue: '18',
      options: [
        { label: '0% — Exempt', value: '0' },
        { label: '5% — Essential goods', value: '5' },
        { label: '12% — Standard', value: '12' },
        { label: '18% — Standard services', value: '18' },
        { label: '28% — Luxury goods', value: '28' },
      ],
    },
    {
      name: 'type',
      label: 'Calculation Type',
      type: 'select',
      defaultValue: 'exclusive',
      options: [
        { label: 'Exclusive — Add GST to amount', value: 'exclusive' },
        { label: 'Inclusive — Extract GST from total', value: 'inclusive' },
      ],
    },
  ],
  'sip-calculator-india': [
    { name: 'monthly_investment', label: 'Monthly SIP (₹)', type: 'number', defaultValue: '5000', placeholder: 'Monthly investment amount...' },
    { name: 'annual_return', label: 'Expected Annual Return (%)', type: 'number', defaultValue: '12', placeholder: 'e.g. 12' },
    { name: 'years', label: 'Investment Period (years)', type: 'number', defaultValue: '10', placeholder: 'e.g. 10' },
  ],
  'income-tax-calculator-india': [
    { name: 'income', label: 'Annual Income (₹)', type: 'number', defaultValue: '900000', placeholder: 'Enter gross annual income...' },
    { name: 'deductions', label: 'Old Regime Deductions (₹)', type: 'number', defaultValue: '150000', placeholder: '80C, HRA, etc. for old regime...' },
    {
      name: 'regime',
      label: 'Tax Regime',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New Regime', value: 'new' },
        { label: 'Old Regime', value: 'old' },
      ],
    },
  ],
  'discount-calculator': [
    { name: 'price', label: 'Original Price (₹)', type: 'number', defaultValue: '1000', placeholder: 'Enter price...' },
    { name: 'discount_percent', label: 'Discount (%)', type: 'number', defaultValue: '10', placeholder: 'Discount percent...' },
    { name: 'tax_percent', label: 'Tax / GST (%)', type: 'number', defaultValue: '0', placeholder: 'Optional tax after discount...' },
  ],
  'loan-prepayment-calculator': [
    { name: 'principal', label: 'Loan Outstanding (₹)', type: 'number', defaultValue: '1000000', placeholder: 'Current outstanding loan...' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '9', placeholder: 'e.g. 9' },
    { name: 'tenure_months', label: 'Remaining Tenure (months)', type: 'number', defaultValue: '120', placeholder: 'e.g. 120' },
    { name: 'prepayment', label: 'Prepayment Amount (₹)', type: 'number', defaultValue: '100000', placeholder: 'Extra payment amount...' },
  ],
  'fixed-deposit-calculator-india': [
    { name: 'principal', label: 'Deposit Amount (₹)', type: 'number', defaultValue: '100000', placeholder: 'FD principal amount...' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '7', placeholder: 'e.g. 7' },
    { name: 'years', label: 'Tenure (years)', type: 'number', defaultValue: '5', placeholder: 'e.g. 5' },
    {
      name: 'compound_per_year',
      label: 'Compounding Frequency',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: 'Yearly', value: '1' },
        { label: 'Half-yearly', value: '2' },
        { label: 'Quarterly', value: '4' },
        { label: 'Monthly', value: '12' },
      ],
    },
  ],
  'recurring-deposit-calculator': [
    { name: 'monthly_deposit', label: 'Monthly Deposit (₹)', type: 'number', defaultValue: '5000', placeholder: 'Monthly RD amount...' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '6.5', placeholder: 'e.g. 6.5' },
    { name: 'months', label: 'Tenure (months)', type: 'number', defaultValue: '24', placeholder: 'e.g. 24' },
  ],
  'loan-eligibility-calculator': [
    { name: 'monthly_income', label: 'Monthly Income (₹)', type: 'number', defaultValue: '50000', placeholder: 'Net monthly income...' },
    { name: 'existing_emi', label: 'Existing EMI (₹)', type: 'number', defaultValue: '0', placeholder: 'Current total EMI...' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '9', placeholder: 'e.g. 9' },
    { name: 'tenure_months', label: 'Loan Tenure (months)', type: 'number', defaultValue: '240', placeholder: 'e.g. 240' },
    { name: 'foir_percent', label: 'FOIR / Max EMI %', type: 'number', defaultValue: '50', placeholder: 'Usually 40-60' },
  ],
  'expense-splitter': [
    { name: 'total_amount', label: 'Bill Amount (₹)', type: 'number', defaultValue: '1000', placeholder: 'Total bill before tip/tax...' },
    { name: 'people', label: 'Number of People', type: 'number', defaultValue: '4', placeholder: 'People sharing...' },
    { name: 'tip_percent', label: 'Tip (%)', type: 'number', defaultValue: '0', placeholder: 'Optional tip...' },
    { name: 'tax_percent', label: 'Tax (%)', type: 'number', defaultValue: '0', placeholder: 'Optional tax...' },
  ],
  'upi-qr-generator': [
    { name: 'upi_id', label: 'UPI ID', type: 'text', placeholder: 'e.g. name@okaxis' },
    { name: 'name', label: 'Payee Name', type: 'text', defaultValue: 'ISHU TOOLS', placeholder: 'Receiver name...' },
    { name: 'amount', label: 'Amount (optional)', type: 'number', placeholder: 'Leave empty for open amount...' },
    { name: 'note', label: 'Payment Note', type: 'text', defaultValue: 'Payment', placeholder: 'Purpose / note...' },
  ],
  'wifi-qr-generator': [
    { name: 'ssid', label: 'Wi-Fi Name (SSID)', type: 'text', placeholder: 'Network name...' },
    { name: 'password', label: 'Wi-Fi Password', type: 'password', placeholder: 'Network password...' },
    {
      name: 'security',
      label: 'Security Type',
      type: 'select',
      defaultValue: 'WPA',
      options: [
        { label: 'WPA/WPA2', value: 'WPA' },
        { label: 'WEP', value: 'WEP' },
        { label: 'No Password', value: 'NOPASS' },
      ],
    },
    {
      name: 'hidden',
      label: 'Hidden Network',
      type: 'select',
      defaultValue: 'false',
      options: booleanOptions,
    },
  ],
  'atm-pin-generator': [
    {
      name: 'length',
      label: 'PIN Length',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '4 digits (ATM standard)', value: '4' },
        { label: '6 digits (Modern ATMs)', value: '6' },
      ],
    },
    { name: 'count', label: 'Number of PINs', type: 'number', defaultValue: '5', placeholder: '1-20 PINs' },
  ],
  'credit-card-validator': [
    { name: 'text', label: 'Card Number', type: 'text', placeholder: 'Enter credit/debit card number (for testing only)...' },
  ],
  'ifsc-code-finder': [
    { name: 'text', label: 'IFSC Code', type: 'text', placeholder: 'Enter 11-character IFSC code... e.g. SBIN0000001' },
  ],
  'marks-percentage-calculator': [
    { name: 'obtained_marks', label: 'Obtained Marks', type: 'number', defaultValue: '450', placeholder: 'Marks scored...' },
    { name: 'total_marks', label: 'Total Marks', type: 'number', defaultValue: '500', placeholder: 'Maximum marks...' },
  ],
  'cgpa-percentage-converter': [
    { name: 'cgpa', label: 'CGPA', type: 'number', defaultValue: '8', placeholder: 'Enter CGPA...' },
    { name: 'scale', label: 'CGPA Scale', type: 'number', defaultValue: '10', placeholder: 'Usually 10 or 4...' },
    {
      name: 'formula',
      label: 'Formula',
      type: 'select',
      defaultValue: 'cbse',
      options: [
        { label: 'CBSE / India common (CGPA × 9.5)', value: 'cbse' },
        { label: 'Generic scale (CGPA ÷ scale × 100)', value: 'generic' },
      ],
    },
  ],
  'attendance-required-calculator': [
    { name: 'attended_classes', label: 'Classes Attended', type: 'number', defaultValue: '45', placeholder: 'Attended classes...' },
    { name: 'total_classes', label: 'Total Classes Held', type: 'number', defaultValue: '60', placeholder: 'Total classes so far...' },
    { name: 'required_percent', label: 'Required Attendance (%)', type: 'number', defaultValue: '75', placeholder: 'e.g. 75' },
  ],
  'grade-needed-calculator': [
    { name: 'current_grade', label: 'Current Grade (%)', type: 'number', defaultValue: '70', placeholder: 'Your current grade...' },
    { name: 'target_grade', label: 'Target Grade (%)', type: 'number', defaultValue: '85', placeholder: 'Desired final grade...' },
    { name: 'final_weight', label: 'Final Exam Weight (%)', type: 'number', defaultValue: '40', placeholder: 'Weight of final exam...' },
  ],
  'exam-countdown-calculator': [
    { name: 'exam_date', label: 'Exam Date', type: 'text', placeholder: 'YYYY-MM-DD, e.g. 2026-05-10' },
    { name: 'daily_study_hours', label: 'Daily Study Hours', type: 'number', defaultValue: '3', placeholder: 'Hours per day...' },
  ],

  // ─── Health Tools ─────────────────────────────────────────────────────
  'calorie-calculator': [
    { name: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: '70', placeholder: 'Your weight in kg...' },
    { name: 'height', label: 'Height (cm)', type: 'number', defaultValue: '170', placeholder: 'Your height in cm...' },
    { name: 'age', label: 'Age (years)', type: 'number', defaultValue: '25', placeholder: 'Your age...' },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      defaultValue: 'male',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    {
      name: 'activity',
      label: 'Activity Level',
      type: 'select',
      defaultValue: 'moderate',
      options: [
        { label: 'Sedentary (desk job, no exercise)', value: 'sedentary' },
        { label: 'Light (1-3 days exercise/week)', value: 'light' },
        { label: 'Moderate (3-5 days exercise/week)', value: 'moderate' },
        { label: 'Active (6-7 days exercise/week)', value: 'active' },
        { label: 'Very Active (hard daily exercise)', value: 'very_active' },
      ],
    },
  ],
  'sleep-calculator': [
    { name: 'wake_time', label: 'Wake Up Time', type: 'text', defaultValue: '06:30', placeholder: 'When do you want to wake up? e.g. 06:30' },
    { name: 'sleep_time', label: 'Bedtime (optional)', type: 'text', placeholder: 'When are you going to sleep? e.g. 22:00 — leave empty to calculate bedtime' },
  ],
  'bulk-image-compressor': [
    { name: 'quality', label: 'Compression Quality', type: 'number', defaultValue: '75', placeholder: '1-95 (75 = good balance)' },
  ],

  // ── Ultra Tools v3 ──────────────────────────────────────────────────────
  'text-readability-score': [
    { name: 'text', label: 'Text to Analyze', type: 'textarea', placeholder: 'Paste your text here to get readability score, Flesch-Kincaid grade, word count, and more...' },
  ],
  'cron-builder': [
    { name: 'expression', label: 'Cron Expression', type: 'text', defaultValue: '0 9 * * 1-5', placeholder: 'Enter cron expression, e.g. 0 9 * * 1-5 (weekdays at 9 AM)...' },
  ],
  'investment-calculator': [
    { name: 'principal', label: 'Initial Investment (₹)', type: 'number', defaultValue: '100000', placeholder: 'Initial investment amount...' },
    { name: 'monthly_contribution', label: 'Monthly Contribution (₹)', type: 'number', defaultValue: '5000', placeholder: 'Monthly SIP / contribution...' },
    { name: 'rate', label: 'Expected Annual Return (%)', type: 'number', defaultValue: '12', placeholder: 'Expected return %...' },
    { name: 'years', label: 'Investment Period (years)', type: 'number', defaultValue: '10', placeholder: 'Years...' },
    {
      name: 'mode',
      label: 'Compounding Mode',
      type: 'select',
      defaultValue: 'compound',
      options: [
        { label: 'Compound (monthly)', value: 'compound' },
        { label: 'Simple Interest', value: 'simple' },
      ],
    },
  ],
  'net-worth-calculator': [
    { name: 'cash', label: 'Cash & Bank Balance (₹)', type: 'number', defaultValue: '200000', placeholder: 'Total cash and savings...' },
    { name: 'investments', label: 'Investments & Stocks (₹)', type: 'number', defaultValue: '500000', placeholder: 'MF, stocks, FD, etc...' },
    { name: 'real_estate', label: 'Real Estate Value (₹)', type: 'number', defaultValue: '3000000', placeholder: 'Property current value...' },
    { name: 'vehicle', label: 'Vehicles (₹)', type: 'number', defaultValue: '500000', placeholder: 'Car, bike current value...' },
    { name: 'other_assets', label: 'Other Assets (₹)', type: 'number', defaultValue: '0', placeholder: 'Gold, jewelry, etc...' },
    { name: 'home_loan', label: 'Home Loan Outstanding (₹)', type: 'number', defaultValue: '2000000', placeholder: 'Remaining home loan...' },
    { name: 'car_loan', label: 'Car Loan Outstanding (₹)', type: 'number', defaultValue: '300000', placeholder: 'Remaining car loan...' },
    { name: 'personal_loan', label: 'Personal Loan (₹)', type: 'number', defaultValue: '0', placeholder: 'Personal loan balance...' },
    { name: 'credit_card', label: 'Credit Card Debt (₹)', type: 'number', defaultValue: '0', placeholder: 'Credit card outstanding...' },
    { name: 'other_liabilities', label: 'Other Liabilities (₹)', type: 'number', defaultValue: '0', placeholder: 'Any other debts...' },
  ],
  'retirement-planner': [
    { name: 'current_age', label: 'Current Age', type: 'number', defaultValue: '30', placeholder: 'Your current age...' },
    { name: 'retirement_age', label: 'Retirement Age', type: 'number', defaultValue: '60', placeholder: 'Target retirement age...' },
    { name: 'monthly_expense', label: 'Current Monthly Expenses (₹)', type: 'number', defaultValue: '50000', placeholder: 'Monthly living expenses...' },
    { name: 'current_savings', label: 'Current Savings (₹)', type: 'number', defaultValue: '500000', placeholder: 'Total savings/investments today...' },
    { name: 'monthly_saving', label: 'Monthly Savings/Investment (₹)', type: 'number', defaultValue: '15000', placeholder: 'Monthly contribution...' },
    { name: 'expected_return', label: 'Expected Annual Return (%)', type: 'number', defaultValue: '10', placeholder: 'Expected return on investments...' },
    { name: 'inflation', label: 'Inflation Rate (%)', type: 'number', defaultValue: '6', placeholder: 'Expected inflation rate...' },
    { name: 'life_expectancy', label: 'Life Expectancy (years)', type: 'number', defaultValue: '80', placeholder: 'Expected life span...' },
  ],
  'pace-calculator': [
    { name: 'distance', label: 'Distance', type: 'number', defaultValue: '5', placeholder: 'Enter distance...' },
    {
      name: 'unit',
      label: 'Distance Unit',
      type: 'select',
      defaultValue: 'km',
      options: [
        { label: 'Kilometers (km)', value: 'km' },
        { label: 'Miles', value: 'miles' },
      ],
    },
    { name: 'time_minutes', label: 'Time (minutes)', type: 'number', defaultValue: '30', placeholder: 'Total time in minutes...' },
  ],
  'menstrual-cycle-calculator': [
    { name: 'last_period_date', label: 'First Day of Last Period', type: 'text', defaultValue: '', placeholder: 'YYYY-MM-DD format, e.g. 2026-04-01' },
    { name: 'cycle_length', label: 'Cycle Length (days)', type: 'number', defaultValue: '28', placeholder: 'Average cycle length in days (21-35)...' },
    { name: 'period_duration', label: 'Period Duration (days)', type: 'number', defaultValue: '5', placeholder: 'How many days does period last...' },
  ],
  'pregnancy-week-calculator': [
    { name: 'lmp_date', label: 'First Day of Last Menstrual Period (LMP)', type: 'text', defaultValue: '', placeholder: 'YYYY-MM-DD format, e.g. 2025-11-01' },
  ],
  'speed-calculator': [
    {
      name: 'solve_for',
      label: 'Calculate',
      type: 'select',
      defaultValue: 'speed',
      options: [
        { label: 'Speed (from distance + time)', value: 'speed' },
        { label: 'Distance (from speed + time)', value: 'distance' },
        { label: 'Time (from speed + distance)', value: 'time' },
      ],
    },
    { name: 'distance', label: 'Distance (km)', type: 'number', defaultValue: '100', placeholder: 'Distance in km (leave blank to calculate)...' },
    { name: 'speed', label: 'Speed (km/h)', type: 'number', defaultValue: '60', placeholder: 'Speed in km/h (leave blank to calculate)...' },
    { name: 'time', label: 'Time (hours)', type: 'number', defaultValue: '', placeholder: 'Time in hours (leave blank to calculate)...' },
  ],
  'aspect-ratio-calculator': [
    { name: 'width', label: 'Width (pixels)', type: 'number', defaultValue: '1920', placeholder: 'Image width in pixels...' },
    { name: 'height', label: 'Height (pixels)', type: 'number', defaultValue: '1080', placeholder: 'Image height in pixels...' },
    { name: 'target_width', label: 'Target Width (optional)', type: 'number', defaultValue: '', placeholder: 'Enter target width to get scaled height...' },
    { name: 'target_height', label: 'Target Height (optional)', type: 'number', defaultValue: '', placeholder: 'Or enter target height to get scaled width...' },
  ],
  'gstin-validator': [
    { name: 'gstin', label: 'GSTIN Number', type: 'text', placeholder: 'Enter 15-digit GSTIN, e.g. 29ABCDE1234F1Z5...' },
  ],
  'pan-validator': [
    { name: 'pan', label: 'PAN Number', type: 'text', placeholder: 'Enter 10-character PAN, e.g. ABCDE1234F...' },
  ],
  'phone-number-validator': [
    { name: 'phone', label: 'Phone Number', type: 'text', placeholder: 'Enter phone number, e.g. +91 98765 43210...' },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      defaultValue: 'IN',
      options: [
        { label: 'India (IN)', value: 'IN' },
        { label: 'United States (US)', value: 'US' },
        { label: 'United Kingdom (UK)', value: 'UK' },
        { label: 'Australia (AU)', value: 'AU' },
        { label: 'Canada (CA)', value: 'CA' },
      ],
    },
  ],
  'email-validator': [
    { name: 'email', label: 'Email Address', type: 'text', placeholder: 'Enter email to validate, e.g. user@example.com...' },
  ],
  'css-gradient-generator': [
    {
      name: 'type',
      label: 'Gradient Type',
      type: 'select',
      defaultValue: 'linear',
      options: [
        { label: 'Linear Gradient', value: 'linear' },
        { label: 'Radial Gradient', value: 'radial' },
        { label: 'Conic Gradient', value: 'conic' },
      ],
    },
    { name: 'color1', label: 'Color 1 (HEX)', type: 'text', defaultValue: '#3bd0ff', placeholder: 'e.g. #3bd0ff or rgb(59,208,255)...' },
    { name: 'color2', label: 'Color 2 (HEX)', type: 'text', defaultValue: '#a855f7', placeholder: 'e.g. #a855f7...' },
    { name: 'color3', label: 'Color 3 (optional)', type: 'text', defaultValue: '', placeholder: 'e.g. #f43f5e (optional)...' },
    { name: 'angle', label: 'Angle (degrees)', type: 'number', defaultValue: '135', placeholder: '0-360 degrees...' },
  ],
  'box-shadow-generator': [
    { name: 'h_offset', label: 'Horizontal Offset (px)', type: 'number', defaultValue: '0', placeholder: 'Horizontal shadow offset...' },
    { name: 'v_offset', label: 'Vertical Offset (px)', type: 'number', defaultValue: '10', placeholder: 'Vertical shadow offset...' },
    { name: 'blur', label: 'Blur Radius (px)', type: 'number', defaultValue: '20', placeholder: 'Blur amount...' },
    { name: 'spread', label: 'Spread Radius (px)', type: 'number', defaultValue: '0', placeholder: 'Shadow spread...' },
    { name: 'color', label: 'Shadow Color', type: 'text', defaultValue: 'rgba(0,0,0,0.3)', placeholder: 'e.g. rgba(0,0,0,0.3) or #000000...' },
    {
      name: 'inset',
      label: 'Inset Shadow',
      type: 'select',
      defaultValue: 'false',
      options: [
        { label: 'No (outer shadow)', value: 'false' },
        { label: 'Yes (inner shadow)', value: 'true' },
      ],
    },
  ],
  'ppf-calculator': [
    { name: 'yearly_investment', label: 'Yearly Investment (₹)', type: 'number', defaultValue: '150000', placeholder: 'Max ₹1,50,000/year...' },
    { name: 'years', label: 'Investment Period (years)', type: 'number', defaultValue: '15', placeholder: 'Minimum 15 years...' },
    { name: 'interest_rate', label: 'Interest Rate (%)', type: 'number', defaultValue: '7.1', placeholder: 'Current PPF rate is 7.1%...' },
  ],
  'nps-calculator': [
    { name: 'monthly_contribution', label: 'Monthly Contribution (₹)', type: 'number', defaultValue: '5000', placeholder: 'Monthly NPS contribution...' },
    { name: 'current_age', label: 'Current Age', type: 'number', defaultValue: '30', placeholder: 'Your current age...' },
    { name: 'retirement_age', label: 'Retirement Age', type: 'number', defaultValue: '60', placeholder: 'NPS exits at 60...' },
    { name: 'expected_return', label: 'Expected Annual Return (%)', type: 'number', defaultValue: '10', placeholder: 'Expected annual return on NPS...' },
    { name: 'annuity_percent', label: 'Annuity Percentage (%)', type: 'number', defaultValue: '40', placeholder: 'Min 40% must go to annuity...' },
    { name: 'annuity_rate', label: 'Annuity Rate (%)', type: 'number', defaultValue: '6', placeholder: 'Annual annuity payout rate...' },
  ],
  'macro-calculator': [
    { name: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: '70', placeholder: 'Your current weight...' },
    { name: 'height', label: 'Height (cm)', type: 'number', defaultValue: '175', placeholder: 'Height in centimeters...' },
    { name: 'age', label: 'Age (years)', type: 'number', defaultValue: '25', placeholder: 'Your age...' },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      defaultValue: 'male',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    {
      name: 'activity',
      label: 'Activity Level',
      type: 'select',
      defaultValue: 'moderate',
      options: [
        { label: 'Sedentary (no exercise)', value: 'sedentary' },
        { label: 'Light (1-3 days/week)', value: 'light' },
        { label: 'Moderate (3-5 days/week)', value: 'moderate' },
        { label: 'Active (6-7 days/week)', value: 'active' },
        { label: 'Very Active (twice daily)', value: 'very active' },
      ],
    },
    {
      name: 'goal',
      label: 'Goal',
      type: 'select',
      defaultValue: 'maintain',
      options: [
        { label: 'Maintain Weight', value: 'maintain' },
        { label: 'Lose Weight (cutting)', value: 'lose' },
        { label: 'Gain Muscle (bulking)', value: 'gain' },
      ],
    },
  ],
  'braille-converter': [
    { name: 'text', label: 'Text to Convert', type: 'textarea', placeholder: 'Enter English text to convert to Braille symbols...' },
  ],
  'text-to-braille': [
    { name: 'text', label: 'Text to Convert', type: 'textarea', placeholder: 'Enter English text to convert to Braille...' },
  ],
  'net-salary-calculator-india': [
    { name: 'ctc', label: 'Annual CTC (₹)', type: 'number', defaultValue: '1000000', placeholder: 'Your annual CTC (e.g. 1000000 = 10 LPA)...' },
    {
      name: 'regime',
      label: 'Tax Regime',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New Tax Regime (FY 2024-25)', value: 'new' },
        { label: 'Old Tax Regime', value: 'old' },
      ],
    },
    { name: 'extra_deductions_80c', label: '80C Deductions (₹, Old Regime)', type: 'number', defaultValue: '150000', placeholder: 'PF, PPF, ELSS, LIC, etc...' },
    { name: 'rent_paid', label: 'Monthly Rent Paid (₹)', type: 'number', defaultValue: '0', placeholder: 'For HRA exemption calculation...' },
    {
      name: 'city_type',
      label: 'City Type (for HRA)',
      type: 'select',
      defaultValue: 'metro',
      options: [
        { label: 'Metro (Mumbai, Delhi, Kolkata, Chennai)', value: 'metro' },
        { label: 'Non-Metro', value: 'non-metro' },
      ],
    },
  ],
  'hra-calculator-india': [
    { name: 'basic_monthly', label: 'Basic + DA Monthly (₹)', type: 'number', defaultValue: '40000', placeholder: 'Monthly Basic + DA salary...' },
    { name: 'hra_received', label: 'HRA Received Monthly (₹)', type: 'number', defaultValue: '20000', placeholder: 'Monthly HRA from employer...' },
    { name: 'rent_paid', label: 'Rent Paid Monthly (₹)', type: 'number', defaultValue: '25000', placeholder: 'Actual monthly rent paid...' },
    {
      name: 'city_type',
      label: 'City Type',
      type: 'select',
      defaultValue: 'metro',
      options: [
        { label: 'Metro City (50% of Basic)', value: 'metro' },
        { label: 'Non-Metro City (40% of Basic)', value: 'non-metro' },
      ],
    },
  ],
  'epf-calculator-india': [
    { name: 'basic_da', label: 'Basic + DA Monthly (₹)', type: 'number', defaultValue: '50000', placeholder: 'Monthly basic + DA salary...' },
    { name: 'years', label: 'Years of Service', type: 'number', defaultValue: '10', placeholder: 'Total years in service...' },
    { name: 'interest_rate', label: 'EPF Interest Rate (%)', type: 'number', defaultValue: '8.25', placeholder: 'Current EPF rate is 8.25%...' },
    { name: 'existing_balance', label: 'Existing PF Balance (₹)', type: 'number', defaultValue: '0', placeholder: 'Current EPF balance if any...' },
  ],
  'gratuity-calculator-india': [
    { name: 'last_basic_da', label: 'Last Drawn Basic + DA Monthly (₹)', type: 'number', defaultValue: '60000', placeholder: 'Monthly Basic + DA...' },
    { name: 'years_of_service', label: 'Years of Service', type: 'number', defaultValue: '10', placeholder: 'Total years with employer...' },
    {
      name: 'is_covered',
      label: 'Covered under Gratuity Act?',
      type: 'select',
      defaultValue: 'true',
      options: [
        { label: 'Yes (companies with 10+ employees)', value: 'true' },
        { label: 'No (smaller organizations)', value: 'false' },
      ],
    },
  ],
  'url-validator': [
    { name: 'url', label: 'URL to Validate', type: 'text', placeholder: 'Enter URL to validate, e.g. https://ishutools.com...' },
  ],
  'color-blindness-simulator': [
    { name: 'color', label: 'Hex Color Code', type: 'text', defaultValue: '#3bd0ff', placeholder: 'Enter hex color, e.g. #FF5733 or #3bd0ff...' },
  ],
  'grammar-score': [
    { name: 'text', label: 'Text to Analyze', type: 'textarea', placeholder: 'Paste your text to check grammar quality and get a score...' },
  ],
  'grammar-checker-advanced': [
    { name: 'text', label: 'Text to Check', type: 'textarea', placeholder: 'Enter text to check grammar quality...' },
  ],

  // ── 2026 Batch #5: A/V Studio (10 tools) ──────────────────────────────────
  'video-converter': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    {
      name: 'format',
      label: 'Output Format',
      type: 'select',
      defaultValue: 'mp4',
      options: [
        { label: 'MP4 — Most universal (H.264 + AAC, web-friendly)', value: 'mp4' },
        { label: 'MOV — Apple QuickTime (H.264 + AAC)', value: 'mov' },
        { label: 'MKV — Matroska (H.264 + AAC)', value: 'mkv' },
        { label: 'WebM — Open web video (VP9 + Opus)', value: 'webm' },
        { label: 'AVI — Classic Windows (MPEG-4 + MP3)', value: 'avi' },
        { label: 'FLV — Flash legacy (H.264 + AAC)', value: 'flv' },
        { label: 'MPEG — DVD compatible (MPEG-2)', value: 'mpeg' },
        { label: 'M4V — iTunes/Apple TV (H.264 + AAC)', value: 'm4v' },
        { label: 'WMV — Windows Media (WMV2 + WMA)', value: 'wmv' },
      ],
    },
  ],
  'video-reverser': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    {
      name: 'audio',
      label: 'Audio Track',
      type: 'select',
      defaultValue: 'reverse',
      options: [
        { label: 'Reverse audio along with video', value: 'reverse' },
        { label: 'Mute audio (silent reversed video)', value: 'mute' },
      ],
    },
  ],
  'video-cropper': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    {
      name: 'aspect',
      label: 'Crop to Aspect Ratio',
      type: 'select',
      defaultValue: '1:1',
      options: [
        { label: '1:1 — Square (Instagram post)', value: '1:1' },
        { label: '9:16 — Vertical (Reels / Shorts / TikTok)', value: '9:16' },
        { label: '16:9 — Horizontal (YouTube widescreen)', value: '16:9' },
        { label: '4:5 — Portrait (Instagram feed)', value: '4:5' },
        { label: '4:3 — Classic TV', value: '4:3' },
      ],
    },
  ],
  'video-resizer': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    {
      name: 'resolution',
      label: 'Output Resolution',
      type: 'select',
      defaultValue: '720p',
      options: [
        { label: '240p — Tiny file (≈3 MB/min)', value: '240p' },
        { label: '360p — Small file', value: '360p' },
        { label: '480p — SD (DVD quality)', value: '480p' },
        { label: '720p — HD (recommended)', value: '720p' },
        { label: '1080p — Full HD', value: '1080p' },
        { label: '1440p — 2K QHD', value: '1440p' },
        { label: '2160p — 4K Ultra HD', value: '2160p' },
      ],
    },
  ],
  'video-watermark': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    { name: 'text', label: 'Watermark Text', type: 'text', placeholder: 'e.g. © Your Name 2026' },
    {
      name: 'position',
      label: 'Watermark Position',
      type: 'select',
      defaultValue: 'bottom-right',
      options: [
        { label: 'Bottom Right (default)', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Top Left', value: 'top-left' },
        { label: 'Center', value: 'center' },
      ],
    },
  ],
  'video-thumbnail': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    { name: 'time', label: 'Timestamp', type: 'text', placeholder: 'e.g. 5 (seconds), 1:30, 01:02:30', defaultValue: '0' },
  ],
  'audio-reverser': [
    { name: 'file', label: 'Upload Audio', type: 'file', accept: 'audio/*' },
  ],
  'audio-volume-changer': [
    { name: 'file', label: 'Upload Audio', type: 'file', accept: 'audio/*' },
    {
      name: 'db',
      label: 'Volume Change (dB)',
      type: 'select',
      defaultValue: '6',
      options: [
        { label: '+15 dB — Very loud (boost a lot)', value: '15' },
        { label: '+10 dB — Loud', value: '10' },
        { label: '+6 dB — Double perceived loudness', value: '6' },
        { label: '+3 dB — Slight boost', value: '3' },
        { label: '-3 dB — Slight reduction', value: '-3' },
        { label: '-6 dB — Half perceived loudness', value: '-6' },
        { label: '-10 dB — Quieter', value: '-10' },
        { label: '-15 dB — Very quiet', value: '-15' },
      ],
    },
  ],
  'audio-pitch-changer': [
    { name: 'file', label: 'Upload Audio', type: 'file', accept: 'audio/*' },
    {
      name: 'semitones',
      label: 'Pitch Shift (semitones)',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '+12 — Up 1 octave (chipmunk)', value: '12' },
        { label: '+7 — Up a perfect 5th', value: '7' },
        { label: '+5 — Up a 4th', value: '5' },
        { label: '+3 — Up a minor 3rd', value: '3' },
        { label: '+2 — Up a whole step', value: '2' },
        { label: '+1 — Up a semitone', value: '1' },
        { label: '-1 — Down a semitone', value: '-1' },
        { label: '-2 — Down a whole step', value: '-2' },
        { label: '-3 — Down a minor 3rd', value: '-3' },
        { label: '-5 — Down a 4th', value: '-5' },
        { label: '-7 — Down a perfect 5th', value: '-7' },
        { label: '-12 — Down 1 octave (deep voice)', value: '-12' },
      ],
    },
  ],
  'audio-converter': [
    { name: 'file', label: 'Upload Audio', type: 'file', accept: 'audio/*' },
    {
      name: 'format',
      label: 'Output Format',
      type: 'select',
      defaultValue: 'mp3',
      options: [
        { label: 'MP3 — Most universal (192 kbps)', value: 'mp3' },
        { label: 'WAV — Lossless uncompressed', value: 'wav' },
        { label: 'M4A — Apple AAC (192 kbps)', value: 'm4a' },
        { label: 'FLAC — Lossless compressed', value: 'flac' },
        { label: 'OGG Vorbis — Open source (192 kbps)', value: 'ogg' },
        { label: 'AAC — Modern lossy (192 kbps)', value: 'aac' },
        { label: 'OPUS — Best for voice (128 kbps)', value: 'opus' },
      ],
    },
  ],
  'audio-trimmer': [
    { name: 'file', label: 'Upload Audio', type: 'file', accept: 'audio/*' },
    { name: 'start', label: 'Start Time', type: 'text', placeholder: 'e.g. 0, 0:30, 1:30', defaultValue: '0' },
    { name: 'end', label: 'End Time (optional, blank = until end)', type: 'text', placeholder: 'e.g. 1:45, 2:30' },
  ],

  // ── 2026 Batch #4: Video Rotate/Mute/Speed / Audio Speed / GIF→Video ─────
  'video-rotator': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    {
      name: 'angle',
      label: 'Rotation',
      type: 'select',
      defaultValue: '90',
      options: [
        { label: '90° clockwise (right)', value: '90' },
        { label: '180° (upside down)', value: '180' },
        { label: '90° counter-clockwise (left)', value: '270' },
        { label: 'Flip horizontal (mirror)', value: 'flip-horizontal' },
        { label: 'Flip vertical', value: 'flip-vertical' },
      ],
    },
  ],
  'video-mute': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
  ],
  'video-speed-changer': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    {
      name: 'speed',
      label: 'Playback Speed',
      type: 'select',
      defaultValue: '2.0',
      options: [
        { label: '0.25x (super slow motion)', value: '0.25' },
        { label: '0.5x (slow motion)', value: '0.5' },
        { label: '0.75x (slightly slow)', value: '0.75' },
        { label: '1.25x (slightly fast)', value: '1.25' },
        { label: '1.5x (1.5x speed)', value: '1.5' },
        { label: '2.0x (double speed)', value: '2.0' },
        { label: '3.0x (triple speed)', value: '3.0' },
        { label: '4.0x (quadruple speed)', value: '4.0' },
      ],
    },
  ],
  'audio-speed-changer': [
    { name: 'file', label: 'Upload Audio', type: 'file', accept: 'audio/*' },
    {
      name: 'speed',
      label: 'Playback Speed',
      type: 'select',
      defaultValue: '1.5',
      options: [
        { label: '0.5x (half speed)', value: '0.5' },
        { label: '0.75x (slightly slow)', value: '0.75' },
        { label: '1.25x (slightly fast)', value: '1.25' },
        { label: '1.5x (1.5x speed — popular for podcasts)', value: '1.5' },
        { label: '1.75x', value: '1.75' },
        { label: '2.0x (double speed)', value: '2.0' },
        { label: '2.5x', value: '2.5' },
        { label: '3.0x (triple speed)', value: '3.0' },
      ],
    },
  ],
  'gif-to-video': [
    { name: 'file', label: 'Upload GIF', type: 'file', accept: 'image/gif' },
  ],

  // ── 2026 Batch #3: CSV ↔ Excel / PDF Page Extractor ──────────────────────
  'csv-to-excel': [
    { name: 'file', label: 'Upload CSV File', type: 'file', accept: '.csv,text/csv' },
    {
      name: 'delimiter',
      label: 'CSV Delimiter',
      type: 'select',
      defaultValue: ',',
      options: [
        { label: 'Comma (,) — most common', value: ',' },
        { label: 'Tab (TSV)', value: 'tab' },
        { label: 'Semicolon (;)', value: 'semicolon' },
        { label: 'Pipe (|)', value: 'pipe' },
      ],
    },
  ],
  'excel-to-csv': [
    { name: 'file', label: 'Upload Excel File (.xlsx)', type: 'file', accept: '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    { name: 'sheet', label: 'Sheet Name (optional, blank = first sheet)', type: 'text', placeholder: 'e.g. Sheet1' },
  ],
  'pdf-page-extractor': [
    { name: 'file', label: 'Upload PDF File', type: 'file', accept: '.pdf,application/pdf' },
    { name: 'pages', label: 'Pages to Extract', type: 'text', placeholder: 'e.g. 1,3-5,8 (extracts pages 1, 3, 4, 5 and 8)' },
  ],

  // ── 2026 Batch #2: TTS / Video Trim / Video Compress / Audio Merger ───────
  'text-to-speech': [
    { name: 'text', label: 'Text to Speak', type: 'textarea', placeholder: 'Type or paste text here (max 5000 characters)...' },
    {
      name: 'lang',
      label: 'Voice Language',
      type: 'select',
      defaultValue: 'en',
      options: [
        { label: 'English (en)', value: 'en' },
        { label: 'Hindi (hi)', value: 'hi' },
        { label: 'Tamil (ta)', value: 'ta' },
        { label: 'Telugu (te)', value: 'te' },
        { label: 'Bengali (bn)', value: 'bn' },
        { label: 'Marathi (mr)', value: 'mr' },
        { label: 'Gujarati (gu)', value: 'gu' },
        { label: 'Kannada (kn)', value: 'kn' },
        { label: 'Malayalam (ml)', value: 'ml' },
        { label: 'Punjabi (pa)', value: 'pa' },
        { label: 'Urdu (ur)', value: 'ur' },
        { label: 'Spanish (es)', value: 'es' },
        { label: 'French (fr)', value: 'fr' },
        { label: 'German (de)', value: 'de' },
        { label: 'Italian (it)', value: 'it' },
        { label: 'Portuguese (pt)', value: 'pt' },
        { label: 'Russian (ru)', value: 'ru' },
        { label: 'Japanese (ja)', value: 'ja' },
        { label: 'Korean (ko)', value: 'ko' },
        { label: 'Chinese (zh-CN)', value: 'zh-CN' },
        { label: 'Arabic (ar)', value: 'ar' },
        { label: 'Turkish (tr)', value: 'tr' },
      ],
    },
    {
      name: 'slow',
      label: 'Speech Speed',
      type: 'select',
      defaultValue: 'no',
      options: [
        { label: 'Normal speed', value: 'no' },
        { label: 'Slow speed', value: 'yes' },
      ],
    },
  ],
  'video-trimmer': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    { name: 'start', label: 'Start Time (seconds or mm:ss)', type: 'text', defaultValue: '0', placeholder: 'e.g. 30 or 0:30' },
    { name: 'duration', label: 'Clip Length (seconds)', type: 'number', defaultValue: '30', placeholder: '30' },
    { name: 'end', label: 'OR End Time (optional, overrides duration)', type: 'text', placeholder: 'leave blank to use duration' },
  ],
  'video-compressor': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    {
      name: 'quality',
      label: 'Compression Level',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'High compression (smallest file, 360p-ish)', value: 'high' },
        { label: 'Medium (recommended, 480p-ish)', value: 'medium' },
        { label: 'Low compression (better quality, 720p-ish)', value: 'low' },
      ],
    },
  ],
  'audio-merger': [
    { name: 'files', label: 'Upload Audio Files (2 to 12)', type: 'file', accept: 'audio/*', multiple: true },
  ],

  // ── 2026 Enhance Pack ──
  'noise-reducer': [
    { name: 'file', label: 'Upload Audio File', type: 'file', accept: 'audio/*' },
    {
      name: 'strength',
      label: 'Noise Reduction Strength',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Light (gentle, preserves voice)', value: 'light' },
        { label: 'Medium (recommended)', value: 'medium' },
        { label: 'Strong (heavy noise)', value: 'strong' },
        { label: 'Extreme (very noisy recordings)', value: 'extreme' },
      ],
    },
  ],
  'audio-normalizer': [
    { name: 'file', label: 'Upload Audio File', type: 'file', accept: 'audio/*' },
    {
      name: 'target',
      label: 'Target Loudness (LUFS)',
      type: 'select',
      defaultValue: '-16',
      options: [
        { label: '-14 LUFS (Spotify / YouTube / streaming)', value: '-14' },
        { label: '-16 LUFS (podcasts — recommended)', value: '-16' },
        { label: '-19 LUFS (Apple Music)', value: '-19' },
        { label: '-23 LUFS (EBU R128 broadcast / TV)', value: '-23' },
      ],
    },
  ],
  'voice-enhancer': [
    { name: 'file', label: 'Upload Voice Recording', type: 'file', accept: 'audio/*' },
  ],
  'silence-remover': [
    { name: 'file', label: 'Upload Audio File', type: 'file', accept: 'audio/*' },
    {
      name: 'threshold',
      label: 'Silence Threshold',
      type: 'select',
      defaultValue: '-35dB',
      options: [
        { label: '-25 dB (only very loud silence)', value: '-25dB' },
        { label: '-30 dB (loose)', value: '-30dB' },
        { label: '-35 dB (recommended)', value: '-35dB' },
        { label: '-40 dB (strict — quiet rooms)', value: '-40dB' },
        { label: '-45 dB (very strict)', value: '-45dB' },
      ],
    },
  ],
  'audio-fade': [
    { name: 'file', label: 'Upload Audio File', type: 'file', accept: 'audio/*' },
    { name: 'fade_in', label: 'Fade In (seconds, 0 to skip)', type: 'number', defaultValue: '2', placeholder: '2' },
    { name: 'fade_out', label: 'Fade Out (seconds, 0 to skip)', type: 'number', defaultValue: '2', placeholder: '2' },
  ],
  'audio-equalizer': [
    { name: 'file', label: 'Upload Audio File', type: 'file', accept: 'audio/*' },
    {
      name: 'preset',
      label: 'EQ Preset',
      type: 'select',
      defaultValue: 'balanced',
      options: [
        { label: 'Balanced (subtle polish)', value: 'balanced' },
        { label: 'Bass Boost', value: 'bass-boost' },
        { label: 'Treble Boost', value: 'treble-boost' },
        { label: 'Vocal Boost', value: 'vocal-boost' },
        { label: 'Warm', value: 'warm' },
        { label: 'Bright', value: 'bright' },
      ],
    },
  ],
  'video-stabilizer': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
  ],
  'video-upscaler': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    {
      name: 'target',
      label: 'Upscale To',
      type: 'select',
      defaultValue: '1080p',
      options: [
        { label: '720p HD', value: '720p' },
        { label: '1080p Full HD (recommended)', value: '1080p' },
        { label: '1440p 2K', value: '1440p' },
        { label: '2160p 4K UHD', value: '2160p' },
      ],
    },
  ],
  'video-to-1080p': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
  ],
  'video-fade': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    { name: 'fade_in', label: 'Fade In (seconds, 0 to skip)', type: 'number', defaultValue: '1.5', placeholder: '1.5' },
    { name: 'fade_out', label: 'Fade Out (seconds, 0 to skip)', type: 'number', defaultValue: '1.5', placeholder: '1.5' },
  ],

  // ── 2026 Format Converter Pack ──
  'audio-compressor': [
    { name: 'file', label: 'Upload Audio File', type: 'file', accept: 'audio/*' },
    {
      name: 'quality',
      label: 'Compression Level',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Maximum (smallest, voice-memo / WhatsApp)', value: 'max' },
        { label: 'High compression (small)', value: 'high' },
        { label: 'Medium (recommended)', value: 'medium' },
        { label: 'Low (mild, near-original)', value: 'low' },
      ],
    },
  ],
  // Video → Video format converters (file-only, format is preset)
  'mp4-to-mov':  [{ name: 'file', label: 'Upload MP4 File',  type: 'file', accept: 'video/mp4,video/*' }],
  'mp4-to-mkv':  [{ name: 'file', label: 'Upload MP4 File',  type: 'file', accept: 'video/mp4,video/*' }],
  'mp4-to-webm': [{ name: 'file', label: 'Upload MP4 File',  type: 'file', accept: 'video/mp4,video/*' }],
  'mp4-to-avi':  [{ name: 'file', label: 'Upload MP4 File',  type: 'file', accept: 'video/mp4,video/*' }],
  'mp4-to-flv':  [{ name: 'file', label: 'Upload MP4 File',  type: 'file', accept: 'video/mp4,video/*' }],
  'mp4-to-wmv':  [{ name: 'file', label: 'Upload MP4 File',  type: 'file', accept: 'video/mp4,video/*' }],
  'mp4-to-m4v':  [{ name: 'file', label: 'Upload MP4 File',  type: 'file', accept: 'video/mp4,video/*' }],
  'mov-to-mp4':  [{ name: 'file', label: 'Upload MOV File',  type: 'file', accept: 'video/quicktime,video/*' }],
  'mkv-to-mp4':  [{ name: 'file', label: 'Upload MKV File',  type: 'file', accept: 'video/x-matroska,video/*' }],
  'webm-to-mp4': [{ name: 'file', label: 'Upload WebM File', type: 'file', accept: 'video/webm,video/*' }],
  'avi-to-mp4':  [{ name: 'file', label: 'Upload AVI File',  type: 'file', accept: 'video/x-msvideo,video/*' }],
  'flv-to-mp4':  [{ name: 'file', label: 'Upload FLV File',  type: 'file', accept: 'video/x-flv,video/*' }],
  'wmv-to-mp4':  [{ name: 'file', label: 'Upload WMV File',  type: 'file', accept: 'video/x-ms-wmv,video/*' }],
  'm4v-to-mp4':  [{ name: 'file', label: 'Upload M4V File',  type: 'file', accept: 'video/x-m4v,video/*' }],
  'mpeg-to-mp4': [{ name: 'file', label: 'Upload MPEG File', type: 'file', accept: 'video/mpeg,video/*' }],
  'mov-to-webm': [{ name: 'file', label: 'Upload MOV File',  type: 'file', accept: 'video/quicktime,video/*' }],

  // Audio → Audio format converters
  'mp3-to-wav':  [{ name: 'file', label: 'Upload MP3 File',  type: 'file', accept: 'audio/mpeg,audio/*' }],
  'wav-to-mp3':  [{ name: 'file', label: 'Upload WAV File',  type: 'file', accept: 'audio/wav,audio/*' }],
  'm4a-to-mp3':  [{ name: 'file', label: 'Upload M4A File',  type: 'file', accept: 'audio/mp4,audio/*' }],
  'ogg-to-mp3':  [{ name: 'file', label: 'Upload OGG File',  type: 'file', accept: 'audio/ogg,audio/*' }],
  'flac-to-mp3': [{ name: 'file', label: 'Upload FLAC File', type: 'file', accept: 'audio/flac,audio/*' }],
  'aac-to-mp3':  [{ name: 'file', label: 'Upload AAC File',  type: 'file', accept: 'audio/aac,audio/*' }],
  'opus-to-mp3': [{ name: 'file', label: 'Upload OPUS File', type: 'file', accept: 'audio/opus,audio/*' }],
  'wma-to-mp3':  [{ name: 'file', label: 'Upload WMA File',  type: 'file', accept: 'audio/x-ms-wma,audio/*' }],
  'mp3-to-m4a':  [{ name: 'file', label: 'Upload MP3 File',  type: 'file', accept: 'audio/mpeg,audio/*' }],
  'mp3-to-ogg':  [{ name: 'file', label: 'Upload MP3 File',  type: 'file', accept: 'audio/mpeg,audio/*' }],
  'mp3-to-flac': [{ name: 'file', label: 'Upload MP3 File',  type: 'file', accept: 'audio/mpeg,audio/*' }],
  'mp3-to-aac':  [{ name: 'file', label: 'Upload MP3 File',  type: 'file', accept: 'audio/mpeg,audio/*' }],
  'wav-to-flac': [{ name: 'file', label: 'Upload WAV File',  type: 'file', accept: 'audio/wav,audio/*' }],
  'flac-to-wav': [{ name: 'file', label: 'Upload FLAC File', type: 'file', accept: 'audio/flac,audio/*' }],
  'wav-to-m4a':  [{ name: 'file', label: 'Upload WAV File',  type: 'file', accept: 'audio/wav,audio/*' }],
  'm4a-to-wav':  [{ name: 'file', label: 'Upload M4A File',  type: 'file', accept: 'audio/mp4,audio/*' }],
  'ogg-to-wav':  [{ name: 'file', label: 'Upload OGG File',  type: 'file', accept: 'audio/ogg,audio/*' }],
  'aac-to-wav':  [{ name: 'file', label: 'Upload AAC File',  type: 'file', accept: 'audio/aac,audio/*' }],

  // Video → Audio (cross-format extract)
  'video-to-mp3':  [{ name: 'file', label: 'Upload Video File', type: 'file', accept: 'video/*' }],
  'mp4-to-mp3':    [{ name: 'file', label: 'Upload MP4 File',   type: 'file', accept: 'video/mp4,video/*' }],
  'mov-to-mp3':    [{ name: 'file', label: 'Upload MOV File',   type: 'file', accept: 'video/quicktime,video/*' }],
  'webm-to-mp3':   [{ name: 'file', label: 'Upload WebM File',  type: 'file', accept: 'video/webm,video/*' }],
  'avi-to-mp3':    [{ name: 'file', label: 'Upload AVI File',   type: 'file', accept: 'video/x-msvideo,video/*' }],
  'mkv-to-mp3':    [{ name: 'file', label: 'Upload MKV File',   type: 'file', accept: 'video/x-matroska,video/*' }],
  'video-to-wav':  [{ name: 'file', label: 'Upload Video File', type: 'file', accept: 'video/*' }],
  'mp4-to-wav':    [{ name: 'file', label: 'Upload MP4 File',   type: 'file', accept: 'video/mp4,video/*' }],
  'video-to-m4a':  [{ name: 'file', label: 'Upload Video File', type: 'file', accept: 'video/*' }],
  'mp4-to-m4a':    [{ name: 'file', label: 'Upload MP4 File',   type: 'file', accept: 'video/mp4,video/*' }],
  'video-to-flac': [{ name: 'file', label: 'Upload Video File', type: 'file', accept: 'video/*' }],
  'video-to-aac':  [{ name: 'file', label: 'Upload Video File', type: 'file', accept: 'video/*' }],
  'video-to-ogg':  [{ name: 'file', label: 'Upload Video File', type: 'file', accept: 'video/*' }],

  // ── 2026 Image Format Converter Pack ──
  // To PNG
  'jpg-to-png':   [{ name: 'file', label: 'Upload JPG/JPEG File',  type: 'file', accept: 'image/jpeg,image/*' }],
  'jpeg-to-png':  [{ name: 'file', label: 'Upload JPEG File',      type: 'file', accept: 'image/jpeg,image/*' }],
  'webp-to-png':  [{ name: 'file', label: 'Upload WebP File',      type: 'file', accept: 'image/webp,image/*' }],
  'bmp-to-png':   [{ name: 'file', label: 'Upload BMP File',       type: 'file', accept: 'image/bmp,image/*' }],
  'gif-to-png':   [{ name: 'file', label: 'Upload GIF File',       type: 'file', accept: 'image/gif,image/*' }],
  'tiff-to-png':  [{ name: 'file', label: 'Upload TIFF/TIF File',  type: 'file', accept: 'image/tiff,image/*' }],
  'tif-to-png':   [{ name: 'file', label: 'Upload TIF File',       type: 'file', accept: 'image/tiff,image/*' }],
  'ico-to-png':   [{ name: 'file', label: 'Upload ICO File',       type: 'file', accept: 'image/x-icon,image/*' }],
  'heic-to-png':  [{ name: 'file', label: 'Upload HEIC File',      type: 'file', accept: 'image/heic,image/heif,image/*' }],
  // To JPG
  'png-to-jpg':   [{ name: 'file', label: 'Upload PNG File',       type: 'file', accept: 'image/png,image/*' }],
  'png-to-jpeg':  [{ name: 'file', label: 'Upload PNG File',       type: 'file', accept: 'image/png,image/*' }],
  'bmp-to-jpg':   [{ name: 'file', label: 'Upload BMP File',       type: 'file', accept: 'image/bmp,image/*' }],
  'gif-to-jpg':   [{ name: 'file', label: 'Upload GIF File',       type: 'file', accept: 'image/gif,image/*' }],
  'tiff-to-jpg':  [{ name: 'file', label: 'Upload TIFF File',      type: 'file', accept: 'image/tiff,image/*' }],
  'tif-to-jpg':   [{ name: 'file', label: 'Upload TIF File',       type: 'file', accept: 'image/tiff,image/*' }],
  'ico-to-jpg':   [{ name: 'file', label: 'Upload ICO File',       type: 'file', accept: 'image/x-icon,image/*' }],
  'svg-to-jpg':   [{ name: 'file', label: 'Upload SVG File',       type: 'file', accept: 'image/svg+xml,image/*' }],
  // To WebP
  'bmp-to-webp':  [{ name: 'file', label: 'Upload BMP File',       type: 'file', accept: 'image/bmp,image/*' }],
  'gif-to-webp':  [{ name: 'file', label: 'Upload GIF File',       type: 'file', accept: 'image/gif,image/*' }],
  'tiff-to-webp': [{ name: 'file', label: 'Upload TIFF File',      type: 'file', accept: 'image/tiff,image/*' }],
  'heic-to-webp': [{ name: 'file', label: 'Upload HEIC File',      type: 'file', accept: 'image/heic,image/heif,image/*' }],
  // To BMP
  'png-to-bmp':   [{ name: 'file', label: 'Upload PNG File',       type: 'file', accept: 'image/png,image/*' }],
  'jpg-to-bmp':   [{ name: 'file', label: 'Upload JPG File',       type: 'file', accept: 'image/jpeg,image/*' }],
  'webp-to-bmp':  [{ name: 'file', label: 'Upload WebP File',      type: 'file', accept: 'image/webp,image/*' }],
  'gif-to-bmp':   [{ name: 'file', label: 'Upload GIF File',       type: 'file', accept: 'image/gif,image/*' }],
  // To GIF
  'png-to-gif':   [{ name: 'file', label: 'Upload PNG File',       type: 'file', accept: 'image/png,image/*' }],
  'jpg-to-gif':   [{ name: 'file', label: 'Upload JPG File',       type: 'file', accept: 'image/jpeg,image/*' }],
  'webp-to-gif':  [{ name: 'file', label: 'Upload WebP File',      type: 'file', accept: 'image/webp,image/*' }],
  'bmp-to-gif':   [{ name: 'file', label: 'Upload BMP File',       type: 'file', accept: 'image/bmp,image/*' }],
  // To TIFF
  'png-to-tiff':  [{ name: 'file', label: 'Upload PNG File',       type: 'file', accept: 'image/png,image/*' }],
  'jpg-to-tiff':  [{ name: 'file', label: 'Upload JPG File',       type: 'file', accept: 'image/jpeg,image/*' }],
  'webp-to-tiff': [{ name: 'file', label: 'Upload WebP File',      type: 'file', accept: 'image/webp,image/*' }],
  'bmp-to-tiff':  [{ name: 'file', label: 'Upload BMP File',       type: 'file', accept: 'image/bmp,image/*' }],
  // To ICO (favicon)
  'png-to-ico':   [{ name: 'file', label: 'Upload PNG (square)',   type: 'file', accept: 'image/png,image/*' }],
  'jpg-to-ico':   [{ name: 'file', label: 'Upload JPG (square)',   type: 'file', accept: 'image/jpeg,image/*' }],
  'webp-to-ico':  [{ name: 'file', label: 'Upload WebP (square)',  type: 'file', accept: 'image/webp,image/*' }],
  'bmp-to-ico':   [{ name: 'file', label: 'Upload BMP File',       type: 'file', accept: 'image/bmp,image/*' }],
  'favicon-generator': [{ name: 'file', label: 'Upload Image (square recommended)', type: 'file', accept: 'image/*' }],
  // To PDF
  'png-to-pdf':   [{ name: 'file', label: 'Upload PNG File',       type: 'file', accept: 'image/png,image/*' }],
  'webp-to-pdf':  [{ name: 'file', label: 'Upload WebP File',      type: 'file', accept: 'image/webp,image/*' }],
  'bmp-to-pdf':   [{ name: 'file', label: 'Upload BMP File',       type: 'file', accept: 'image/bmp,image/*' }],
  'gif-to-pdf':   [{ name: 'file', label: 'Upload GIF File',       type: 'file', accept: 'image/gif,image/*' }],
  'tiff-to-pdf':  [{ name: 'file', label: 'Upload TIFF File',      type: 'file', accept: 'image/tiff,image/*' }],
  'heic-to-pdf':  [{ name: 'file', label: 'Upload HEIC File',      type: 'file', accept: 'image/heic,image/heif,image/*' }],
  // To SVG
  'png-to-svg':   [{ name: 'file', label: 'Upload PNG File',       type: 'file', accept: 'image/png,image/*' }],
  'jpg-to-svg':   [{ name: 'file', label: 'Upload JPG File',       type: 'file', accept: 'image/jpeg,image/*' }],
  'image-to-svg': [{ name: 'file', label: 'Upload Image',          type: 'file', accept: 'image/*' }],

  // ── 2026 Data Format Converter Pack — JSON / YAML / XML / TOML / CSV / HTML / SQL / Markdown ──
  'json-to-xml':      [{ name: 'text', label: 'Paste JSON', type: 'textarea', placeholder: '{"name":"Ishu","tools":["pdf","image"]}', rows: 10 }],
  'xml-to-json':      [{ name: 'text', label: 'Paste XML',  type: 'textarea', placeholder: '<root><name>Ishu</name></root>', rows: 10 }],
  'json-to-toml':     [{ name: 'text', label: 'Paste JSON', type: 'textarea', placeholder: '{"server":{"port":8080}}', rows: 10 }],
  'toml-to-json':     [{ name: 'text', label: 'Paste TOML', type: 'textarea', placeholder: '[server]\nport = 8080', rows: 10 }],
  'json-to-markdown': [{ name: 'text', label: 'Paste JSON (array of objects works best)', type: 'textarea', placeholder: '[{"name":"A","price":10},{"name":"B","price":20}]', rows: 10 }],
  'json-to-md':       [{ name: 'text', label: 'Paste JSON', type: 'textarea', rows: 10 }],
  'json-to-sql': [
    { name: 'text', label: 'Paste JSON (array of objects)', type: 'textarea', placeholder: '[{"id":1,"name":"A"}]', rows: 10 },
    { name: 'table', label: 'Table name', type: 'text', defaultValue: 'data', placeholder: 'data' },
  ],
  'json-to-html':     [{ name: 'text', label: 'Paste JSON', type: 'textarea', rows: 10 }],
  'html-to-json':     [{ name: 'text', label: 'Paste HTML containing a <table>', type: 'textarea', rows: 10 }],
  'yaml-to-xml':      [{ name: 'text', label: 'Paste YAML', type: 'textarea', placeholder: 'name: Ishu\ntools:\n  - pdf\n  - image', rows: 10 }],
  'xml-to-yaml':      [{ name: 'text', label: 'Paste XML',  type: 'textarea', rows: 10 }],
  'yaml-to-toml':     [{ name: 'text', label: 'Paste YAML', type: 'textarea', rows: 10 }],
  'toml-to-yaml':     [{ name: 'text', label: 'Paste TOML', type: 'textarea', rows: 10 }],
  'yaml-to-csv':      [{ name: 'text', label: 'Paste YAML (list of objects)', type: 'textarea', rows: 10 }],
  'csv-to-yaml':      [{ name: 'text', label: 'Paste CSV',  type: 'textarea', placeholder: 'name,price\nA,10\nB,20', rows: 10 }],
  'csv-to-tsv':       [{ name: 'text', label: 'Paste CSV',  type: 'textarea', rows: 10 }],
  'tsv-to-csv':       [{ name: 'text', label: 'Paste TSV (tab-separated)', type: 'textarea', rows: 10 }],
  'csv-to-xml':       [{ name: 'text', label: 'Paste CSV',  type: 'textarea', rows: 10 }],
  'xml-to-csv':       [{ name: 'text', label: 'Paste XML',  type: 'textarea', rows: 10 }],
  'csv-to-html':      [{ name: 'text', label: 'Paste CSV',  type: 'textarea', rows: 10 }],
  'html-to-csv':      [{ name: 'text', label: 'Paste HTML containing a <table>', type: 'textarea', rows: 10 }],
  'csv-to-sql': [
    { name: 'text', label: 'Paste CSV', type: 'textarea', placeholder: 'name,price\nA,10\nB,20', rows: 10 },
    { name: 'table', label: 'Table name', type: 'text', defaultValue: 'data', placeholder: 'data' },
  ],
  'csv-to-markdown':  [{ name: 'text', label: 'Paste CSV',  type: 'textarea', rows: 10 }],
  'csv-to-md':        [{ name: 'text', label: 'Paste CSV',  type: 'textarea', rows: 10 }],
  'markdown-to-csv':  [{ name: 'text', label: 'Paste Markdown table', type: 'textarea', placeholder: '| name | price |\n| --- | --- |\n| A | 10 |', rows: 10 }],
  'md-to-csv':        [{ name: 'text', label: 'Paste Markdown table', type: 'textarea', rows: 10 }],

  // ── 2026 Batch: Spotify / Snapchat / Threads / Subtitles / Video→GIF / MP3 Cutter ──
  'spotify-downloader': [
    { name: 'url', label: 'Spotify URL', type: 'text', placeholder: 'Paste Spotify URL e.g. https://open.spotify.com/episode/...' },
  ],
  'snapchat-downloader': [
    { name: 'url', label: 'Snapchat URL', type: 'text', placeholder: 'Paste Snapchat Spotlight or Story URL...' },
  ],
  'threads-downloader': [
    { name: 'url', label: 'Threads Post URL', type: 'text', placeholder: 'Paste Threads URL e.g. https://www.threads.net/@user/post/...' },
  ],
  'youtube-subtitle-downloader': [
    { name: 'url', label: 'YouTube Video URL', type: 'text', placeholder: 'Paste YouTube URL e.g. https://youtu.be/...' },
    {
      name: 'lang',
      label: 'Language Code',
      type: 'select',
      defaultValue: 'en',
      options: [
        { label: 'English (en)', value: 'en' },
        { label: 'Hindi (hi)', value: 'hi' },
        { label: 'Tamil (ta)', value: 'ta' },
        { label: 'Telugu (te)', value: 'te' },
        { label: 'Bengali (bn)', value: 'bn' },
        { label: 'Marathi (mr)', value: 'mr' },
        { label: 'Gujarati (gu)', value: 'gu' },
        { label: 'Spanish (es)', value: 'es' },
        { label: 'French (fr)', value: 'fr' },
        { label: 'German (de)', value: 'de' },
        { label: 'Japanese (ja)', value: 'ja' },
        { label: 'Korean (ko)', value: 'ko' },
        { label: 'Arabic (ar)', value: 'ar' },
        { label: 'Portuguese (pt)', value: 'pt' },
        { label: 'Russian (ru)', value: 'ru' },
        { label: 'Chinese (zh)', value: 'zh' },
      ],
    },
    {
      name: 'format',
      label: 'Subtitle Format',
      type: 'select',
      defaultValue: 'srt',
      options: [
        { label: 'SRT (most compatible)', value: 'srt' },
        { label: 'VTT (web video)', value: 'vtt' },
      ],
    },
  ],
  'video-to-gif': [
    { name: 'file', label: 'Upload Video', type: 'file', accept: 'video/*' },
    { name: 'start', label: 'Start Time (seconds)', type: 'number', defaultValue: '0', placeholder: '0' },
    { name: 'duration', label: 'GIF Duration (seconds, max 15)', type: 'number', defaultValue: '5', placeholder: '5' },
    {
      name: 'width',
      label: 'Width (pixels)',
      type: 'select',
      defaultValue: '480',
      options: [
        { label: '240px (small)', value: '240' },
        { label: '360px', value: '360' },
        { label: '480px (recommended)', value: '480' },
        { label: '600px', value: '600' },
        { label: '720px (large)', value: '720' },
      ],
    },
    {
      name: 'fps',
      label: 'Frames Per Second',
      type: 'select',
      defaultValue: '12',
      options: [
        { label: '8 fps (smaller file)', value: '8' },
        { label: '12 fps (recommended)', value: '12' },
        { label: '15 fps', value: '15' },
        { label: '20 fps (smoother)', value: '20' },
        { label: '24 fps (smoothest)', value: '24' },
      ],
    },
  ],
  'mp3-cutter': [
    { name: 'file', label: 'Upload Audio', type: 'file', accept: 'audio/*' },
    { name: 'start', label: 'Start Time (seconds or mm:ss)', type: 'text', defaultValue: '0', placeholder: 'e.g. 30 or 0:30' },
    { name: 'duration', label: 'Clip Length (seconds)', type: 'number', defaultValue: '30', placeholder: '30' },
    { name: 'end', label: 'OR End Time (seconds, optional)', type: 'text', placeholder: 'leave blank to use duration' },
  ],

  // ── New Video Downloader Tools ──────────────────────────────────────────
  'tiktok-downloader': [
    { name: 'url', label: 'TikTok Video URL', type: 'text', placeholder: 'Paste TikTok URL, e.g. https://www.tiktok.com/@user/video/123...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
    { name: 'cookies', label: 'Cookies (optional — paste if download fails with login required)', type: 'textarea', placeholder: 'Optional. Paste Netscape cookies.txt contents OR a "name=value; name=value" cookie string from your browser. Leave blank for public videos.' },
  ],
  'twitter-video-downloader': [
    { name: 'url', label: 'Twitter / X Video URL', type: 'text', placeholder: 'Paste tweet URL with video, e.g. https://twitter.com/user/status/123...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
    { name: 'cookies', label: 'Cookies (optional — paste if download fails with login required)', type: 'textarea', placeholder: 'Optional. Paste Netscape cookies.txt contents OR a "name=value; name=value" cookie string from your browser. Leave blank for public tweets.' },
  ],
  'x-video-downloader': [
    { name: 'url', label: 'X (Twitter) Video URL', type: 'text', placeholder: 'Paste X.com or twitter.com video URL...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
    { name: 'cookies', label: 'Cookies (optional — paste if download fails with login required)', type: 'textarea', placeholder: 'Optional. Paste Netscape cookies.txt contents OR a "name=value; name=value" cookie string from your browser. Leave blank for public posts.' },
  ],
  'facebook-video-downloader': [
    { name: 'url', label: 'Facebook Video URL', type: 'text', placeholder: 'Paste Facebook video URL or fb.watch link...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
    { name: 'cookies', label: 'Cookies (optional — paste if download fails with login required)', type: 'textarea', placeholder: 'Optional. Paste Netscape cookies.txt contents OR a "name=value; name=value" cookie string from your browser. Leave blank for public videos.' },
  ],
  'vimeo-downloader': [
    { name: 'url', label: 'Vimeo Video URL', type: 'text', placeholder: 'Paste Vimeo URL, e.g. https://vimeo.com/123456789...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'dailymotion-downloader': [
    { name: 'url', label: 'Dailymotion Video URL', type: 'text', placeholder: 'Paste Dailymotion URL, e.g. https://www.dailymotion.com/video/...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'youtube-playlist-downloader': [
    { name: 'url', label: 'YouTube Playlist URL', type: 'text', placeholder: 'Paste YouTube playlist URL, e.g. https://www.youtube.com/playlist?list=PL...' },
    {
      name: 'max_videos',
      label: 'Max Videos to Download',
      type: 'select',
      defaultValue: '5',
      options: [
        { label: '1 video', value: '1' },
        { label: '3 videos', value: '3' },
        { label: '5 videos (recommended)', value: '5' },
        { label: '8 videos', value: '8' },
        { label: '10 videos (max)', value: '10' },
      ],
    },
    {
      name: 'quality',
      label: 'Video Quality (per video)',
      type: 'select',
      defaultValue: '720',
      options: [
        { label: '2160p 4K Ultra HD (very large)', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD (recommended)', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low (fastest)', value: '360' },
      ],
    },
  ],
  'playlist-downloader': [
    { name: 'url', label: 'Playlist URL', type: 'text', placeholder: 'Paste YouTube playlist URL with list=... parameter...' },
    {
      name: 'max_videos',
      label: 'Max Videos to Download',
      type: 'select',
      defaultValue: '5',
      options: [
        { label: '1 video', value: '1' },
        { label: '3 videos', value: '3' },
        { label: '5 videos (recommended)', value: '5' },
        { label: '10 videos (max)', value: '10' },
      ],
    },
    {
      name: 'quality',
      label: 'Video Quality (per video)',
      type: 'select',
      defaultValue: '720',
      options: [
        { label: '2160p 4K Ultra HD (very large)', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD (recommended)', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low (fastest)', value: '360' },
      ],
    },
  ],
  'youtube-to-mp4': [
    { name: 'url', label: 'YouTube Video URL', type: 'text', placeholder: 'Paste YouTube URL, e.g. https://youtu.be/... or https://www.youtube.com/watch?v=...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: '1080',
      options: [
        { label: 'Best Available (up to 8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD (recommended)', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'youtube-shorts-downloader': [
    { name: 'url', label: 'YouTube Shorts URL', type: 'text', placeholder: 'Paste YouTube Shorts URL, e.g. https://youtube.com/shorts/...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'audio-extractor': [
    { name: 'url', label: 'Video URL', type: 'text', placeholder: 'Paste video URL from YouTube, Instagram, TikTok, Twitter, or any 1000+ sites...' },
  ],
  'youtube-audio-downloader': [
    { name: 'url', label: 'YouTube Video URL', type: 'text', placeholder: 'Paste YouTube URL to download audio as MP3...' },
  ],
  // ── More Video Downloaders ────────────────────────────────────────────────
  'instagram-downloader': [{ name: 'url', label: 'Instagram Post URL', type: 'text', placeholder: 'Paste Instagram post/video URL e.g. https://www.instagram.com/p/...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
    { name: 'cookies', label: 'Instagram Cookies (optional — paste if Instagram blocks anonymous downloads)', type: 'textarea', placeholder: 'Optional. Export your Instagram cookies (Netscape cookies.txt format) from a logged-in browser session, or paste a "sessionid=...; ds_user_id=...;" string. Leave blank for public posts.' },
  ],
  'instagram-reel-downloader': [{ name: 'url', label: 'Instagram Reel URL', type: 'text', placeholder: 'Paste Instagram Reel URL e.g. https://www.instagram.com/reel/...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
    { name: 'cookies', label: 'Instagram Cookies (optional — paste if Instagram blocks anonymous downloads)', type: 'textarea', placeholder: 'Optional. Export your Instagram cookies (Netscape cookies.txt format) from a logged-in browser session, or paste a "sessionid=...; ds_user_id=...;" string. Leave blank for public reels.' },
  ],
  'stream-downloader': [{ name: 'url', label: 'Video URL', type: 'text', placeholder: 'Paste any video URL from 1000+ supported platforms...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'video-thumbnail-downloader': [{ name: 'url', label: 'Video URL', type: 'text', placeholder: 'Paste YouTube, Vimeo, or other video URL to download its thumbnail...' }],
  // ── Science Tools ──────────────────────────────────────────────────────────
  'element-lookup': [
    { name: 'symbol', label: 'Element Symbol', type: 'text', placeholder: 'e.g. Fe, Au, H, O, Na, C...' },
    { name: 'name', label: 'Or Search by Name', type: 'text', placeholder: 'e.g. Iron, Gold, Hydrogen...' },
  ],
  'molecular-weight': [{ name: 'formula', label: 'Molecular Formula', type: 'text', placeholder: 'e.g. H2O, C6H12O6, NaCl, H2SO4...' }],
  'physics-calculator': [
    { name: 'calc_type', label: 'Calculation Type', type: 'select', defaultValue: 'kinetic_energy',
      options: [
        { label: 'Kinetic Energy (KE = ½mv²)', value: 'kinetic_energy' },
        { label: 'Potential Energy (PE = mgh)', value: 'potential_energy' },
        { label: "Newton's Second Law (F = ma)", value: 'force' },
        { label: 'Velocity (v = u + at)', value: 'velocity' },
        { label: "Ohm's Law (V, I, R)", value: 'ohms_law' },
      ],
    },
    { name: 'mass', label: 'Mass (kg)', type: 'number', placeholder: 'e.g. 10' },
    { name: 'velocity', label: 'Velocity (m/s)', type: 'number', placeholder: 'e.g. 5' },
    { name: 'height', label: 'Height (m)', type: 'number', placeholder: 'e.g. 10' },
    { name: 'acceleration', label: 'Acceleration (m/s²)', type: 'number', placeholder: 'e.g. 9.81' },
    { name: 'time', label: 'Time (s)', type: 'number', placeholder: 'e.g. 5' },
    { name: 'initial_velocity', label: 'Initial Velocity (m/s)', type: 'number', placeholder: 'e.g. 0' },
    { name: 'voltage', label: 'Voltage (V)', type: 'number', placeholder: 'e.g. 12' },
    { name: 'current', label: 'Current (A)', type: 'number', placeholder: 'e.g. 2' },
    { name: 'resistance', label: 'Resistance (Ω)', type: 'number', placeholder: 'e.g. 6' },
  ],
  // ── Geography Tools ────────────────────────────────────────────────────────
  'country-info': [{ name: 'country', label: 'Country Name', type: 'text', placeholder: 'e.g. India, USA, Japan, Germany...' }],
  'timezone-info': [{ name: 'timezone', label: 'Timezone or City', type: 'text', placeholder: 'e.g. IST, UTC, New York, Tokyo, India...' }],
  'distance-calculator': [
    { name: 'lat1', label: 'Latitude 1', type: 'number', placeholder: 'e.g. 28.6139 (Delhi)' },
    { name: 'lon1', label: 'Longitude 1', type: 'number', placeholder: 'e.g. 77.2090 (Delhi)' },
    { name: 'lat2', label: 'Latitude 2', type: 'number', placeholder: 'e.g. 19.0760 (Mumbai)' },
    { name: 'lon2', label: 'Longitude 2', type: 'number', placeholder: 'e.g. 72.8777 (Mumbai)' },
  ],
  // ── Cooking Tools ──────────────────────────────────────────────────────────
  'recipe-scaler': [
    { name: 'original_servings', label: 'Original Servings', type: 'number', defaultValue: '4', placeholder: 'e.g. 4' },
    { name: 'new_servings', label: 'New Servings', type: 'number', defaultValue: '2', placeholder: 'e.g. 2' },
    { name: 'ingredients', label: 'Ingredients (one per line)', type: 'textarea', placeholder: '2 cups flour\n1 tsp salt\n3 eggs\n250ml milk...' },
  ],
  'cooking-measurement-converter': [
    { name: 'value', label: 'Amount', type: 'number', defaultValue: '1', placeholder: 'e.g. 2' },
    { name: 'from_unit', label: 'From Unit', type: 'select', defaultValue: 'cup',
      options: [
        { label: 'Cup', value: 'cup' }, { label: 'Tablespoon (tbsp)', value: 'tbsp' },
        { label: 'Teaspoon (tsp)', value: 'tsp' }, { label: 'Milliliter (ml)', value: 'ml' },
        { label: 'Liter (L)', value: 'liter' }, { label: 'Ounce (oz)', value: 'oz' },
        { label: 'Pound (lb)', value: 'lb' }, { label: 'Gram (g)', value: 'g' },
        { label: 'Kilogram (kg)', value: 'kg' },
      ]},
    { name: 'to_unit', label: 'To Unit', type: 'select', defaultValue: 'ml',
      options: [
        { label: 'Milliliter (ml)', value: 'ml' }, { label: 'Cup', value: 'cup' },
        { label: 'Tablespoon (tbsp)', value: 'tbsp' }, { label: 'Teaspoon (tsp)', value: 'tsp' },
        { label: 'Liter (L)', value: 'liter' }, { label: 'Gram (g)', value: 'g' },
        { label: 'Kilogram (kg)', value: 'kg' }, { label: 'Ounce (oz)', value: 'oz' },
        { label: 'Pound (lb)', value: 'lb' },
      ]},
  ],
  'food-calorie-lookup': [{ name: 'food', label: 'Food Item', type: 'text', placeholder: 'e.g. apple, rice, roti, chicken, egg, banana...' }],
  // ── Student Tools ──────────────────────────────────────────────────────────
  'citation-generator': [
    { name: 'style', label: 'Citation Style', type: 'select', defaultValue: 'apa',
      options: [{ label: 'APA (7th Edition)', value: 'apa' }, { label: 'MLA (9th Edition)', value: 'mla' }, { label: 'Chicago', value: 'chicago' }]},
    { name: 'citation_type', label: 'Source Type', type: 'select', defaultValue: 'website',
      options: [{ label: 'Website', value: 'website' }, { label: 'Journal Article', value: 'journal' }, { label: 'Book', value: 'book' }]},
    { name: 'author', label: 'Author Name', type: 'text', placeholder: 'e.g. Sharma, Raj or Ishu Kumar' },
    { name: 'title', label: 'Title', type: 'text', placeholder: 'Article/page/book title (required)' },
    { name: 'year', label: 'Year', type: 'text', placeholder: 'e.g. 2024' },
    { name: 'publisher', label: 'Publisher / Website Name', type: 'text', placeholder: 'e.g. Wikipedia, Springer' },
    { name: 'url', label: 'URL (for websites)', type: 'text', placeholder: 'https://...' },
    { name: 'journal', label: 'Journal Name', type: 'text', placeholder: 'e.g. Nature, IEEE Transactions...' },
    { name: 'volume', label: 'Volume', type: 'text', placeholder: 'e.g. 12' },
    { name: 'pages', label: 'Pages', type: 'text', placeholder: 'e.g. 45-67' },
  ],
  'equation-solver': [
    { name: 'eq_type', label: 'Equation Type', type: 'select', defaultValue: 'quadratic',
      options: [
        { label: 'Linear: ax + b = c', value: 'linear' },
        { label: 'Quadratic: ax² + bx + c = 0', value: 'quadratic' },
        { label: 'System: a₁x + b₁y = c₁ and a₂x + b₂y = c₂', value: 'system' },
      ]},
    { name: 'a', label: 'Coefficient a', type: 'number', defaultValue: '1', placeholder: 'e.g. 1' },
    { name: 'b', label: 'Coefficient b', type: 'number', defaultValue: '-5', placeholder: 'e.g. -5' },
    { name: 'c', label: 'Coefficient c', type: 'number', defaultValue: '6', placeholder: 'e.g. 6' },
    { name: 'a1', label: 'a₁ (for system)', type: 'number', defaultValue: '2', placeholder: 'e.g. 2' },
    { name: 'b1', label: 'b₁ (for system)', type: 'number', defaultValue: '1', placeholder: 'e.g. 1' },
    { name: 'c1', label: 'c₁ (for system)', type: 'number', defaultValue: '5', placeholder: 'e.g. 5' },
    { name: 'a2', label: 'a₂ (for system)', type: 'number', defaultValue: '1', placeholder: 'e.g. 1' },
    { name: 'b2', label: 'b₂ (for system)', type: 'number', defaultValue: '-1', placeholder: 'e.g. -1' },
    { name: 'c2', label: 'c₂ (for system)', type: 'number', defaultValue: '1', placeholder: 'e.g. 1' },
  ],
  'gpa-cgpa-calculator': [
    { name: 'grades', label: 'Grades (JSON format)', type: 'textarea', defaultValue: '[{"subject":"Maths","grade":8.5,"credits":4},{"subject":"Physics","grade":7,"credits":3},{"subject":"English","grade":9,"credits":2}]', placeholder: '[{"subject": "Maths", "grade": 8.5, "credits": 4}]' },
    { name: 'scale', label: 'Grading Scale', type: 'select', defaultValue: '10',
      options: [{ label: '10-point scale (India/IIT/NIT)', value: '10' }, { label: '4-point scale (US)', value: '4' }]},
  ],
  'attendance-calculator': [
    { name: 'total_classes', label: 'Total Classes Held', type: 'number', defaultValue: '60', placeholder: 'e.g. 60' },
    { name: 'attended', label: 'Classes Attended', type: 'number', defaultValue: '45', placeholder: 'e.g. 45' },
    { name: 'required_percent', label: 'Required Attendance %', type: 'number', defaultValue: '75', placeholder: 'e.g. 75' },
  ],
  // ── Health Tools ────────────────────────────────────────────────────────────
  'daily-calorie-needs': [
    { name: 'weight_kg', label: 'Weight (kg)', type: 'number', defaultValue: '70', placeholder: 'e.g. 70' },
    { name: 'height_cm', label: 'Height (cm)', type: 'number', defaultValue: '170', placeholder: 'e.g. 170' },
    { name: 'age', label: 'Age (years)', type: 'number', defaultValue: '25', placeholder: 'e.g. 25' },
    { name: 'gender', label: 'Gender', type: 'select', defaultValue: 'male',
      options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]},
    { name: 'activity_level', label: 'Activity Level', type: 'select', defaultValue: 'moderate',
      options: [
        { label: 'Sedentary (desk job, no exercise)', value: 'sedentary' },
        { label: 'Lightly Active (1-3 days/week)', value: 'light' },
        { label: 'Moderately Active (3-5 days/week)', value: 'moderate' },
        { label: 'Very Active (6-7 days/week)', value: 'active' },
        { label: 'Extra Active (athlete, physical job)', value: 'very_active' },
      ]},
  ],
  'water-intake-calculator': [
    { name: 'weight_kg', label: 'Weight (kg)', type: 'number', defaultValue: '70', placeholder: 'e.g. 70' },
    { name: 'activity_level', label: 'Activity Level', type: 'select', defaultValue: 'moderate',
      options: [
        { label: 'Sedentary', value: 'sedentary' }, { label: 'Lightly Active', value: 'light' },
        { label: 'Moderately Active', value: 'moderate' }, { label: 'Very Active', value: 'active' },
        { label: 'Athlete / Intense', value: 'very_active' },
      ]},
    { name: 'climate', label: 'Climate', type: 'select', defaultValue: 'temperate',
      options: [
        { label: 'Cool / Cold', value: 'cool' }, { label: 'Temperate', value: 'temperate' },
        { label: 'Hot (India summer)', value: 'hot' }, { label: 'Very Hot / Humid', value: 'very_hot' },
      ]},
  ],
  'ideal-weight': [
    { name: 'height_cm', label: 'Height (cm)', type: 'number', defaultValue: '170', placeholder: 'e.g. 170' },
    { name: 'gender', label: 'Gender', type: 'select', defaultValue: 'male',
      options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]},
  ],
  // ── Finance / Productivity ────────────────────────────────────────────────
  'meeting-cost-calculator': [
    { name: 'num_people', label: 'Number of Attendees', type: 'number', defaultValue: '5', placeholder: 'e.g. 5' },
    { name: 'duration_minutes', label: 'Meeting Duration (minutes)', type: 'number', defaultValue: '60', placeholder: 'e.g. 60' },
    { name: 'avg_hourly_rate', label: 'Average Hourly Rate (₹)', type: 'number', defaultValue: '2000', placeholder: 'e.g. 2000' },
    { name: 'currency', label: 'Currency', type: 'select', defaultValue: 'INR',
      options: [{ label: 'INR (₹)', value: 'INR' }, { label: 'USD ($)', value: 'USD' }, { label: 'EUR (€)', value: 'EUR' }]},
  ],
  'loan-emi-calculator': [
    { name: 'principal', label: 'Loan Amount (₹)', type: 'number', defaultValue: '500000', placeholder: 'e.g. 500000' },
    { name: 'annual_rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '10', placeholder: 'e.g. 10' },
    { name: 'tenure_months', label: 'Tenure (months)', type: 'number', defaultValue: '60', placeholder: 'e.g. 60 (5 years)' },
  ],
  'fuel-cost-calculator': [
    { name: 'distance_km', label: 'Distance (km)', type: 'number', defaultValue: '100', placeholder: 'e.g. 100' },
    { name: 'mileage_kmpl', label: 'Vehicle Mileage (km/L)', type: 'number', defaultValue: '15', placeholder: 'e.g. 15' },
    { name: 'fuel_price_per_liter', label: 'Fuel Price (₹/L)', type: 'number', defaultValue: '105', placeholder: 'e.g. 105' },
  ],
  'number-to-words': [{ name: 'number', label: 'Number', type: 'text', defaultValue: '12345', placeholder: 'e.g. 12345 or 1234567 (up to crores)' }],
  'roman-numeral-converter': [
    { name: 'value', label: 'Number or Roman Numeral', type: 'text', defaultValue: '2024', placeholder: 'e.g. 2024 or MMXXIV' },
    { name: 'direction', label: 'Direction', type: 'select', defaultValue: 'to_roman',
      options: [{ label: 'Arabic → Roman', value: 'to_roman' }, { label: 'Roman → Arabic', value: 'from_roman' }]},
  ],
  'fibonacci-generator': [{ name: 'n', label: 'How many Fibonacci numbers?', type: 'number', defaultValue: '15', placeholder: 'e.g. 10 (max 100)' }],
  'prime-checker': [{ name: 'number', label: 'Number to Check', type: 'number', defaultValue: '97', placeholder: 'e.g. 97' }],
  'statistics-calculator': [{ name: 'data', label: 'Dataset (comma-separated numbers)', type: 'textarea', defaultValue: '2, 4, 4, 4, 5, 5, 7, 9', placeholder: 'e.g. 2, 4, 4, 4, 5, 5, 7, 9' }],
  'matrix-calculator': [
    { name: 'operation', label: 'Operation', type: 'select', defaultValue: 'determinant',
      options: [
        { label: 'Determinant', value: 'determinant' }, { label: 'Transpose', value: 'transpose' },
        { label: 'Add (A + B)', value: 'add' }, { label: 'Multiply (A × B)', value: 'multiply' },
      ]},
    { name: 'matrix_a', label: 'Matrix A (JSON)', type: 'textarea', defaultValue: '[[1,2],[3,4]]', placeholder: '[[1,2],[3,4]] or [[1,2,3],[4,5,6],[7,8,9]]' },
    { name: 'matrix_b', label: 'Matrix B (JSON, for add/multiply)', type: 'textarea', defaultValue: '[[1,0],[0,1]]', placeholder: '[[1,0],[0,1]]' },
  ],
  'json-formatter': [
    { name: 'json', label: 'JSON Text', type: 'textarea', placeholder: 'Paste your JSON here...' },
    { name: 'action', label: 'Action', type: 'select', defaultValue: 'format',
      options: [{ label: 'Format / Pretty Print', value: 'format' }, { label: 'Minify', value: 'minify' }, { label: 'Sort Keys', value: 'sort_keys' }]},
  ],
  'uuid-generator': [
    { name: 'version', label: 'UUID Version', type: 'select', defaultValue: '4',
      options: [{ label: 'UUID v4 (random — recommended)', value: '4' }, { label: 'UUID v1 (time-based)', value: '1' }]},
    { name: 'count', label: 'How many?', type: 'number', defaultValue: '5', placeholder: 'e.g. 5 (max 50)' },
  ],
  'base64-tool': [
    { name: 'text', label: 'Text', type: 'textarea', placeholder: 'Enter text to encode or Base64 string to decode...' },
    { name: 'action', label: 'Action', type: 'select', defaultValue: 'encode',
      options: [{ label: 'Encode → Base64', value: 'encode' }, { label: 'Decode Base64 →', value: 'decode' }, { label: 'URL-safe Encode', value: 'url_encode' }]},
  ],
  'random-password-generator': [
    { name: 'length', label: 'Password Length', type: 'number', defaultValue: '16', placeholder: 'e.g. 16 (max 128)' },
    { name: 'count', label: 'Number of Passwords', type: 'number', defaultValue: '5', placeholder: 'e.g. 5 (max 20)' },
    { name: 'use_uppercase', label: 'Uppercase (A-Z)', type: 'select', defaultValue: 'true', options: booleanOptions },
    { name: 'use_lowercase', label: 'Lowercase (a-z)', type: 'select', defaultValue: 'true', options: booleanOptions },
    { name: 'use_digits', label: 'Digits (0-9)', type: 'select', defaultValue: 'true', options: booleanOptions },
    { name: 'use_symbols', label: 'Symbols (!@#$...)', type: 'select', defaultValue: 'true', options: booleanOptions },
  ],
  'pinterest-downloader': [{ name: 'url', label: 'Pinterest URL', type: 'text', placeholder: 'https://www.pinterest.com/pin/...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'reddit-downloader': [{ name: 'url', label: 'Reddit Post URL', type: 'text', placeholder: 'https://www.reddit.com/r/...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'reddit-video-downloader': [{ name: 'url', label: 'Reddit Post URL', type: 'text', placeholder: 'https://www.reddit.com/r/...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'twitch-downloader': [{ name: 'url', label: 'Twitch Clip or VOD URL', type: 'text', placeholder: 'https://clips.twitch.tv/... or https://www.twitch.tv/videos/...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'twitch-clip-downloader': [{ name: 'url', label: 'Twitch Clip URL', type: 'text', placeholder: 'https://clips.twitch.tv/...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'linkedin-video-downloader': [{ name: 'url', label: 'LinkedIn Post URL', type: 'text', placeholder: 'https://www.linkedin.com/posts/...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'bilibili-downloader': [{ name: 'url', label: 'Bilibili Video URL', type: 'text', placeholder: 'https://www.bilibili.com/video/BV...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'rumble-downloader': [{ name: 'url', label: 'Rumble Video URL', type: 'text', placeholder: 'https://rumble.com/v...' },
    {
      name: 'quality',
      label: 'Video Quality',
      type: 'select',
      defaultValue: 'best',
      options: [
        { label: 'Best Available (up to 4K/8K)', value: 'best' },
        { label: '4320p 8K Ultra HD', value: '4320' },
        { label: '2160p 4K Ultra HD', value: '2160' },
        { label: '1440p 2K QHD', value: '1440' },
        { label: '1080p Full HD', value: '1080' },
        { label: '720p HD', value: '720' },
        { label: '480p Standard', value: '480' },
        { label: '360p Low', value: '360' },
      ],
    },
  ],
  'soundcloud-downloader': [{ name: 'url', label: 'SoundCloud Track URL', type: 'text', placeholder: 'https://soundcloud.com/artist/track' }],
  'mixcloud-downloader': [{ name: 'url', label: 'Mixcloud URL', type: 'text', placeholder: 'https://www.mixcloud.com/...' }],
  'bandcamp-downloader': [{ name: 'url', label: 'Bandcamp Track URL', type: 'text', placeholder: 'https://artist.bandcamp.com/track/...' }],
  'odysee-downloader': [{ name: 'url', label: 'Odysee Video URL', type: 'text', placeholder: 'https://odysee.com/@channel/video' }],
  'streamable-downloader': [{ name: 'url', label: 'Streamable Video URL', type: 'text', placeholder: 'https://streamable.com/...' }],
  'kick-downloader': [{ name: 'url', label: 'Kick.com Clip URL', type: 'text', placeholder: 'https://kick.com/...' }],
  'imgur-downloader': [{ name: 'url', label: 'Imgur URL', type: 'text', placeholder: 'https://imgur.com/...' }],
  'universal-playlist-downloader': [
    { name: 'url', label: 'Playlist URL (YouTube, SoundCloud, etc.)', type: 'text', placeholder: 'https://www.youtube.com/playlist?list=...' },
    { name: 'max_items', label: 'Max Videos to Download', type: 'number', defaultValue: '5', placeholder: '1-10 videos' },
  ],
  'm3u8-downloader': [{ name: 'url', label: 'M3U8 / HLS Stream URL', type: 'text', placeholder: 'https://example.com/stream.m3u8' }],
  'youtube-thumbnail-downloader': [
    { name: 'url', label: 'YouTube Video URL', type: 'text', placeholder: 'https://www.youtube.com/watch?v=... or https://youtu.be/...' },
    { name: 'quality', label: 'Thumbnail Quality', type: 'select', defaultValue: 'maxresdefault',
      options: [
        { label: 'Maximum Resolution (1280×720)', value: 'maxresdefault' },
        { label: 'High Quality (480×360)', value: 'hqdefault' },
        { label: 'Medium Quality (320×180)', value: 'mqdefault' },
        { label: 'Standard Definition (640×480)', value: 'sddefault' },
      ]},
  ],
  'video-info': [{ name: 'url', label: 'Video URL (any platform)', type: 'text', placeholder: 'https://www.youtube.com/watch?v=... or any video URL' }],
  'video-metadata-extractor': [{ name: 'url', label: 'Video URL', type: 'text', placeholder: 'Paste any video URL from YouTube, TikTok, Twitter, etc.' }],

  // ── Developer Tools ──────────────────────────────────────────────────────
  'text-diff': [
    { name: 'text1', label: 'Text A (Original)', type: 'textarea', placeholder: 'Paste the original text here...' },
    { name: 'text2', label: 'Text B (Modified)', type: 'textarea', placeholder: 'Paste the modified text here...' },
  ],
  'text-compare': [
    { name: 'text1', label: 'Text A (Original)', type: 'textarea', placeholder: 'Paste the original text here...' },
    { name: 'text2', label: 'Text B (Modified)', type: 'textarea', placeholder: 'Paste the modified text here...' },
  ],
  'json-diff': [
    { name: 'json1', label: 'JSON A (Original)', type: 'textarea', placeholder: '{"name": "Alice", "age": 30}' },
    { name: 'json2', label: 'JSON B (Modified)', type: 'textarea', placeholder: '{"name": "Alice", "age": 31, "city": "Delhi"}' },
  ],
  'xml-formatter': [{ name: 'text', label: 'XML Content', type: 'textarea', placeholder: '<root><item id="1"><name>Example</name></item></root>' }],
  'yaml-formatter': [{ name: 'text', label: 'YAML Content', type: 'textarea', placeholder: 'name: John\nage: 30\naddress:\n  city: Delhi\n  country: India' }],
  'cron-expression-parser': [{ name: 'text', label: 'Cron Expression', type: 'text', defaultValue: '0 9 * * 1-5', placeholder: 'e.g. 0 9 * * 1-5 (9am on weekdays)' }],
  'cron-parser': [{ name: 'text', label: 'Cron Expression', type: 'text', defaultValue: '*/15 * * * *', placeholder: '* * * * * (minute hour day month weekday)' }],
  'regex-tester': [
    { name: 'pattern', label: 'Regular Expression Pattern', type: 'text', placeholder: 'e.g. \\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b' },
    { name: 'text', label: 'Test String', type: 'textarea', placeholder: 'Enter text to test the regex against...' },
    { name: 'flags', label: 'Flags', type: 'text', defaultValue: '', placeholder: 'e.g. I (case insensitive), M (multiline), S (dotall)' },
  ],
  'regex-tester-advanced': [
    { name: 'pattern', label: 'Regular Expression Pattern', type: 'text', placeholder: '\\b\\d{10}\\b (matches 10-digit numbers)' },
    { name: 'text', label: 'Test String', type: 'textarea', placeholder: 'Enter text to test...' },
    { name: 'flags', label: 'Flags', type: 'text', defaultValue: '', placeholder: 'I=case insensitive, M=multiline, S=dotall' },
  ],
  'jwt-decoder': [{ name: 'text', label: 'JWT Token', type: 'textarea', placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' }],
  'jwt-decoder-advanced': [{ name: 'text', label: 'JWT Token', type: 'textarea', placeholder: 'Paste your JWT token here...' }],
  'color-contrast-checker': [
    { name: 'foreground', label: 'Foreground Color (Text)', type: 'text', defaultValue: '#333333', placeholder: '#333333' },
    { name: 'background', label: 'Background Color', type: 'text', defaultValue: '#ffffff', placeholder: '#ffffff' },
  ],
  'wcag-contrast-checker': [
    { name: 'foreground', label: 'Foreground (Text) Color', type: 'text', defaultValue: '#000000', placeholder: '#000000' },
    { name: 'background', label: 'Background Color', type: 'text', defaultValue: '#ffffff', placeholder: '#ffffff' },
  ],
  'ip-subnet-calculator': [{ name: 'text', label: 'IP Address with CIDR', type: 'text', defaultValue: '192.168.1.0/24', placeholder: 'e.g. 192.168.1.0/24 or 10.0.0.0/8' }],
  'cidr-calculator': [{ name: 'text', label: 'CIDR Notation', type: 'text', defaultValue: '192.168.0.0/16', placeholder: 'e.g. 192.168.0.0/16 or 172.16.0.0/12' }],
  'http-headers-checker': [{ name: 'url', label: 'Website URL', type: 'text', placeholder: 'https://www.example.com' }],
  'http-headers-viewer': [{ name: 'url', label: 'Website URL', type: 'text', placeholder: 'https://www.google.com' }],
  'port-checker': [
    { name: 'host', label: 'Hostname or IP Address', type: 'text', placeholder: 'e.g. example.com or 192.168.1.1' },
    { name: 'port', label: 'Port Number', type: 'number', defaultValue: '443', placeholder: 'e.g. 80, 443, 22, 3306' },
  ],
  'port-scanner': [
    { name: 'host', label: 'Hostname or IP Address', type: 'text', placeholder: 'example.com' },
    { name: 'port', label: 'Port Number', type: 'number', defaultValue: '80', placeholder: 'e.g. 80' },
  ],

  // ── Security / Crypto Tools ──────────────────────────────────────────────
  'hash-generator-advanced': [
    { name: 'text', label: 'Input Text', type: 'textarea', placeholder: 'Enter text to hash...' },
    { name: 'algorithm', label: 'Algorithm', type: 'select', defaultValue: 'all',
      options: [
        { label: 'All Algorithms', value: 'all' },
        { label: 'MD5', value: 'md5' },
        { label: 'SHA-1', value: 'sha1' },
        { label: 'SHA-256', value: 'sha256' },
        { label: 'SHA-512', value: 'sha512' },
        { label: 'SHA3-256', value: 'sha3_256' },
        { label: 'SHA3-512', value: 'sha3_512' },
        { label: 'BLAKE2b', value: 'blake2b' },
        { label: 'BLAKE2s', value: 'blake2s' },
      ]},
  ],
  'multi-hash-generator': [
    { name: 'text', label: 'Text to Hash', type: 'textarea', placeholder: 'Enter text...' },
    { name: 'algorithm', label: 'Algorithm', type: 'select', defaultValue: 'all',
      options: [{ label: 'All Algorithms', value: 'all' }, { label: 'SHA-256', value: 'sha256' }, { label: 'MD5', value: 'md5' }]},
  ],
  'hmac-generator': [
    { name: 'text', label: 'Message / Input Text', type: 'textarea', placeholder: 'The message to authenticate...' },
    { name: 'secret', label: 'Secret Key', type: 'text', placeholder: 'Your HMAC secret key...' },
    { name: 'algorithm', label: 'Hash Algorithm', type: 'select', defaultValue: 'sha256',
      options: [
        { label: 'HMAC-SHA256 (recommended)', value: 'sha256' },
        { label: 'HMAC-SHA512', value: 'sha512' },
        { label: 'HMAC-SHA384', value: 'sha384' },
        { label: 'HMAC-SHA1', value: 'sha1' },
        { label: 'HMAC-MD5', value: 'md5' },
      ]},
  ],
  'password-strength-checker': [{ name: 'text', label: 'Password to Analyze', type: 'text', placeholder: 'Enter a password to check its strength...' }],
  'password-analyzer': [{ name: 'text', label: 'Password', type: 'text', placeholder: 'Type or paste your password...' }],
  'uuid-v5-generator': [
    { name: 'text', label: 'Name / Value', type: 'text', placeholder: 'e.g. example.com or any unique name' },
    { name: 'namespace', label: 'Namespace', type: 'select', defaultValue: 'dns',
      options: [
        { label: 'DNS (domain names)', value: 'dns' },
        { label: 'URL', value: 'url' },
        { label: 'OID', value: 'oid' },
        { label: 'X.500 DN', value: 'x500' },
      ]},
  ],
  'nanoid-generator': [
    { name: 'size', label: 'ID Size (characters)', type: 'number', defaultValue: '21', placeholder: '21' },
    { name: 'count', label: 'How many IDs?', type: 'number', defaultValue: '10', placeholder: 'e.g. 10 (max 100)' },
    { name: 'alphabet', label: 'Alphabet (custom)', type: 'text', defaultValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-', placeholder: 'Characters to use' },
  ],
  'cuid-generator': [
    { name: 'count', label: 'How many CUIDs?', type: 'number', defaultValue: '5', placeholder: 'e.g. 5 (max 50)' },
  ],
  'lorem-ipsum-generator': [
    { name: 'count', label: 'Count', type: 'number', defaultValue: '3', placeholder: 'e.g. 3 (max 20)' },
    { name: 'type', label: 'Type', type: 'select', defaultValue: 'paragraphs',
      options: [
        { label: 'Paragraphs', value: 'paragraphs' },
        { label: 'Sentences', value: 'sentences' },
        { label: 'Words', value: 'words' },
      ]},
  ],
  'placeholder-text-generator': [
    { name: 'count', label: 'Count', type: 'number', defaultValue: '3', placeholder: 'e.g. 3' },
    { name: 'type', label: 'Type', type: 'select', defaultValue: 'paragraphs',
      options: [{ label: 'Paragraphs', value: 'paragraphs' }, { label: 'Sentences', value: 'sentences' }, { label: 'Words', value: 'words' }]},
  ],
  'css-unit-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '16', placeholder: 'e.g. 16' },
    { name: 'from_unit', label: 'From Unit', type: 'select', defaultValue: 'px',
      options: [
        { label: 'px (pixels)', value: 'px' }, { label: 'rem', value: 'rem' }, { label: 'em', value: 'em' },
        { label: 'pt (points)', value: 'pt' }, { label: 'cm', value: 'cm' }, { label: 'mm', value: 'mm' },
        { label: 'in (inches)', value: 'in' }, { label: 'vw', value: 'vw' }, { label: 'vh', value: 'vh' },
      ]},
    { name: 'base_font_size', label: 'Base Font Size (px)', type: 'number', defaultValue: '16', placeholder: '16' },
    { name: 'viewport_width', label: 'Viewport Width (px)', type: 'number', defaultValue: '1440', placeholder: '1440' },
  ],
  'px-to-rem-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '16', placeholder: 'e.g. 16' },
    { name: 'from_unit', label: 'From Unit', type: 'select', defaultValue: 'px',
      options: [{ label: 'px → rem/em', value: 'px' }, { label: 'rem → px', value: 'rem' }]},
    { name: 'base_font_size', label: 'Base Font Size (px)', type: 'number', defaultValue: '16', placeholder: '16' },
  ],

  // ── Finance Tools ─────────────────────────────────────────────────────────
  'electricity-bill-calculator': [
    { name: 'units', label: 'Units Consumed (kWh)', type: 'number', placeholder: 'e.g. 250' },
    { name: 'rate', label: 'Rate per Unit (₹)', type: 'number', defaultValue: '7', placeholder: 'e.g. 7.50' },
    { name: 'fixed_charge', label: 'Fixed / Meter Charge (₹)', type: 'number', defaultValue: '100', placeholder: 'e.g. 100' },
    { name: 'gst', label: 'GST / Tax (%)', type: 'number', defaultValue: '18', placeholder: 'e.g. 18' },
  ],
  'unit-price-calculator': [
    { name: 'product1_name', label: 'Product A Name', type: 'text', defaultValue: 'Product A', placeholder: 'e.g. Rin Soap 100g' },
    { name: 'product1_price', label: 'Product A Price (₹)', type: 'number', placeholder: 'e.g. 25' },
    { name: 'product1_quantity', label: 'Product A Quantity', type: 'number', placeholder: 'e.g. 100' },
    { name: 'product1_unit', label: 'Unit', type: 'text', defaultValue: 'g', placeholder: 'g, ml, piece, etc.' },
    { name: 'product2_name', label: 'Product B Name', type: 'text', defaultValue: 'Product B', placeholder: 'e.g. Rin Soap 250g' },
    { name: 'product2_price', label: 'Product B Price (₹)', type: 'number', placeholder: 'e.g. 55' },
    { name: 'product2_quantity', label: 'Product B Quantity', type: 'number', placeholder: 'e.g. 250' },
  ],
  'tip-calculator': [
    { name: 'bill_amount', label: 'Bill Amount (₹/$)', type: 'number', placeholder: 'e.g. 1500' },
    { name: 'tip_percent', label: 'Tip Percentage (%)', type: 'number', defaultValue: '10', placeholder: 'e.g. 10' },
    { name: 'num_people', label: 'Number of People', type: 'number', defaultValue: '1', placeholder: 'e.g. 4' },
  ],
  'days-between-dates': [
    { name: 'date1', label: 'Start Date', type: 'text', placeholder: 'YYYY-MM-DD (e.g. 2024-01-01)' },
    { name: 'date2', label: 'End Date', type: 'text', placeholder: 'YYYY-MM-DD (e.g. 2024-12-31)' },
  ],
  'age-calculator-detailed': [
    { name: 'dob', label: 'Date of Birth', type: 'text', placeholder: 'YYYY-MM-DD (e.g. 2000-05-15)' },
  ],
  'text-readability': [{ name: 'text', label: 'Text to Analyze', type: 'textarea', placeholder: 'Paste any text here to analyze readability...' }],
  'mac-address-lookup': [{ name: 'text', label: 'MAC Address', type: 'text', placeholder: 'e.g. 00:1A:2B:3C:4D:5E or 001A2B3C4D5E' }],

  // ── AI Writing Tools ──────────────────────────────────────────────────────
  'ai-headline-generator': [
    { name: 'text', label: 'Topic or Product Name', type: 'text', placeholder: 'e.g. content marketing, weight loss app, ISHU TOOLS...' },
    { name: 'style', label: 'Headline Style', type: 'select', defaultValue: 'listicle',
      options: [
        { label: 'Listicle (5 Ways to...)', value: 'listicle' },
        { label: 'How-To (How to...)', value: 'howto' },
        { label: 'Question (Is X worth it?)', value: 'question' },
        { label: 'Controversial (Why X is overrated)', value: 'controversial' },
      ]},
    { name: 'count', label: 'Number of Headlines', type: 'number', defaultValue: '5', placeholder: '5' },
  ],
  'blog-outline-generator': [
    { name: 'text', label: 'Blog Topic', type: 'text', placeholder: 'e.g. How to learn Python in 30 days...' },
    { name: 'tone', label: 'Writing Tone', type: 'select', defaultValue: 'informative',
      options: [
        { label: 'Informative', value: 'informative' },
        { label: 'Conversational', value: 'conversational' },
        { label: 'Professional', value: 'professional' },
        { label: 'Inspiring', value: 'inspiring' },
      ]},
    { name: 'sections', label: 'Number of Sections', type: 'number', defaultValue: '6', placeholder: '6 (max 10)' },
  ],
  'email-subject-generator': [
    { name: 'text', label: 'Email Context / Campaign Name', type: 'text', placeholder: 'e.g. Black Friday sale, product launch, newsletter...' },
    { name: 'goal', label: 'Email Goal', type: 'select', defaultValue: 'engagement',
      options: [
        { label: 'Engagement', value: 'engagement' },
        { label: 'Promotion / Sale', value: 'promotion' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Re-engagement', value: 'reengagement' },
      ]},
    { name: 'count', label: 'Number of Subjects', type: 'number', defaultValue: '5', placeholder: '5' },
  ],
  'product-description-generator': [
    { name: 'text', label: 'Product Name', type: 'text', placeholder: 'e.g. Wireless Bluetooth Earphones...' },
    { name: 'features', label: 'Key Features (comma-separated)', type: 'text', placeholder: 'e.g. 40hr battery, noise cancelling, waterproof' },
    { name: 'tone', label: 'Tone', type: 'select', defaultValue: 'professional',
      options: [
        { label: 'Professional', value: 'professional' },
        { label: 'Casual & Friendly', value: 'casual' },
        { label: 'Luxury / Premium', value: 'luxury' },
        { label: 'Technical / Specs-driven', value: 'technical' },
      ]},
  ],
  'social-caption-generator': [
    { name: 'text', label: 'Post Topic / Content Description', type: 'textarea', placeholder: 'e.g. Sharing a motivational quote about consistency and hustle...' },
    { name: 'platform', label: 'Platform', type: 'select', defaultValue: 'instagram',
      options: [
        { label: 'Instagram', value: 'instagram' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Twitter / X', value: 'twitter' },
        { label: 'Facebook', value: 'facebook' },
      ]},
    { name: 'tone', label: 'Tone', type: 'select', defaultValue: 'casual',
      options: [
        { label: 'Casual & Fun', value: 'casual' },
        { label: 'Professional', value: 'professional' },
        { label: 'Funny / Witty', value: 'funny' },
        { label: 'Inspirational', value: 'inspirational' },
      ]},
  ],

  // ── Crypto / Web3 Tools ───────────────────────────────────────────────────
  'crypto-profit-calculator': [
    { name: 'coin', label: 'Coin / Token', type: 'text', defaultValue: 'BTC', placeholder: 'e.g. BTC, ETH, SOL' },
    { name: 'buy_price', label: 'Buy Price (₹ or $)', type: 'number', placeholder: 'e.g. 2500000 (in INR)' },
    { name: 'sell_price', label: 'Sell Price (₹ or $)', type: 'number', placeholder: 'e.g. 3200000' },
    { name: 'quantity', label: 'Quantity / Amount', type: 'number', placeholder: 'e.g. 0.5' },
    { name: 'investment', label: 'Total Investment (optional)', type: 'number', placeholder: 'If qty unknown, enter investment amount' },
  ],
  'eth-gas-calculator': [
    { name: 'gas_limit', label: 'Gas Limit', type: 'number', defaultValue: '21000', placeholder: '21000 for ETH transfer' },
    { name: 'gas_price_gwei', label: 'Gas Price (Gwei)', type: 'number', defaultValue: '20', placeholder: 'e.g. 20 Gwei' },
    { name: 'eth_price_usd', label: 'ETH Price (USD)', type: 'number', defaultValue: '3000', placeholder: 'Current ETH price in USD' },
  ],
  'crypto-dca-calculator': [
    { name: 'coin', label: 'Coin / Token', type: 'text', defaultValue: 'BTC', placeholder: 'e.g. BTC, ETH, SOL' },
    { name: 'weekly_invest', label: 'Weekly Investment (₹)', type: 'number', defaultValue: '1000', placeholder: 'e.g. 1000' },
    { name: 'weeks', label: 'Investment Period (weeks)', type: 'number', defaultValue: '52', placeholder: 'e.g. 52 weeks = 1 year' },
    { name: 'start_price', label: 'Starting Price (₹)', type: 'number', placeholder: 'Price when you started' },
    { name: 'current_price', label: 'Current Price (₹)', type: 'number', placeholder: 'Current market price' },
  ],
  'nft-royalty-calculator': [
    { name: 'sale_price', label: 'Sale Price (ETH)', type: 'number', defaultValue: '1', placeholder: 'e.g. 1 ETH' },
    { name: 'royalty_pct', label: 'Royalty Percentage (%)', type: 'number', defaultValue: '10', placeholder: 'e.g. 10%' },
    { name: 'platform_fee_pct', label: 'Platform Fee (%)', type: 'number', defaultValue: '2.5', placeholder: 'e.g. 2.5% for OpenSea' },
    { name: 'eth_price', label: 'ETH Price (USD)', type: 'number', defaultValue: '3000', placeholder: 'Current ETH price' },
  ],
  'hash-rate-calculator': [
    { name: 'hash_rate', label: 'Hash Rate', type: 'number', defaultValue: '100', placeholder: 'e.g. 100' },
    { name: 'unit', label: 'Unit', type: 'select', defaultValue: 'TH/s',
      options: [
        { label: 'H/s (Hashes/sec)', value: 'H/s' },
        { label: 'KH/s', value: 'KH/s' },
        { label: 'MH/s', value: 'MH/s' },
        { label: 'GH/s', value: 'GH/s' },
        { label: 'TH/s (Terahash)', value: 'TH/s' },
        { label: 'PH/s', value: 'PH/s' },
        { label: 'EH/s', value: 'EH/s' },
      ]},
    { name: 'btc_price', label: 'BTC Price (USD)', type: 'number', defaultValue: '60000', placeholder: 'Current BTC price' },
    { name: 'power_watts', label: 'Power Consumption (Watts)', type: 'number', defaultValue: '3000', placeholder: 'e.g. 3000W' },
    { name: 'electricity_cost', label: 'Electricity Cost (₹/kWh)', type: 'number', defaultValue: '5', placeholder: 'e.g. 5 ₹/kWh' },
  ],

  // ── HR / Jobs Tools ───────────────────────────────────────────────────────
  'salary-hike-calculator': [
    { name: 'current_salary', label: 'Current CTC (₹ per year)', type: 'number', placeholder: 'e.g. 1200000 (12 LPA)' },
    { name: 'hike_pct', label: 'Hike Percentage (%)', type: 'number', placeholder: 'e.g. 15' },
  ],
  'notice-period-calculator': [
    { name: 'last_working_date', label: 'Last Working Date (optional)', type: 'text', placeholder: 'YYYY-MM-DD (leave blank to calculate from today)' },
    { name: 'notice_days', label: 'Notice Period (days)', type: 'number', defaultValue: '90', placeholder: 'e.g. 90 (3 months)' },
    { name: 'buyout', label: 'Notice Buy-Out Possible?', type: 'select', defaultValue: 'yes',
      options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]},
  ],
  'job-offer-comparator': [
    { name: 'job1_title', label: 'Job 1 Title / Company', type: 'text', defaultValue: 'Job A', placeholder: 'e.g. Google SDE2' },
    { name: 'job1_ctc', label: 'Job 1 CTC (₹/year)', type: 'number', placeholder: 'e.g. 2500000' },
    { name: 'job1_wfh', label: 'Job 1 Work Mode', type: 'select', defaultValue: 'hybrid',
      options: [{ label: 'Remote / WFH', value: 'wfh' }, { label: 'Hybrid', value: 'hybrid' }, { label: 'On-site / Office', value: 'onsite' }]},
    { name: 'job1_growth', label: 'Job 1 Est. Annual Growth (%)', type: 'number', defaultValue: '10', placeholder: 'e.g. 10' },
    { name: 'job2_title', label: 'Job 2 Title / Company', type: 'text', defaultValue: 'Job B', placeholder: 'e.g. Amazon SDE2' },
    { name: 'job2_ctc', label: 'Job 2 CTC (₹/year)', type: 'number', placeholder: 'e.g. 2800000' },
    { name: 'job2_wfh', label: 'Job 2 Work Mode', type: 'select', defaultValue: 'onsite',
      options: [{ label: 'Remote / WFH', value: 'wfh' }, { label: 'Hybrid', value: 'hybrid' }, { label: 'On-site / Office', value: 'onsite' }]},
    { name: 'job2_growth', label: 'Job 2 Est. Annual Growth (%)', type: 'number', defaultValue: '12', placeholder: 'e.g. 12' },
  ],
  'interview-question-generator': [
    { name: 'text', label: 'Job Role', type: 'text', defaultValue: 'Software Engineer', placeholder: 'e.g. Product Manager, Data Scientist, SDE...' },
    { name: 'level', label: 'Experience Level', type: 'select', defaultValue: 'mid',
      options: [
        { label: 'Junior (0-2 years)', value: 'junior' },
        { label: 'Mid (2-5 years)', value: 'mid' },
        { label: 'Senior (5+ years)', value: 'senior' },
      ]},
    { name: 'category', label: 'Question Category', type: 'select', defaultValue: 'behavioral',
      options: [
        { label: 'Behavioral (STAR method)', value: 'behavioral' },
        { label: 'Technical (coding/system design)', value: 'technical' },
        { label: 'Situational (scenarios)', value: 'situational' },
      ]},
  ],
  'resignation-letter-generator': [
    { name: 'name', label: 'Your Full Name', type: 'text', placeholder: 'e.g. Ishu Kumar' },
    { name: 'manager', label: "Manager's Name", type: 'text', placeholder: 'e.g. Rahul Sharma' },
    { name: 'company', label: 'Company Name', type: 'text', placeholder: 'e.g. Infosys Technologies' },
    { name: 'role', label: 'Your Current Role', type: 'text', placeholder: 'e.g. Senior Software Engineer' },
    { name: 'notice_days', label: 'Notice Period (days)', type: 'number', defaultValue: '90', placeholder: 'e.g. 90' },
    { name: 'reason', label: 'Reason (brief)', type: 'text', defaultValue: 'personal growth opportunities', placeholder: 'e.g. better opportunities, career growth...' },
  ],
  'salary-negotiation-helper': [
    { name: 'current_ctc', label: 'Current CTC (₹/year)', type: 'number', placeholder: 'e.g. 1500000 (15 LPA)' },
    { name: 'offered_ctc', label: 'Offered CTC (₹/year)', type: 'number', placeholder: 'e.g. 2000000 (20 LPA)' },
    { name: 'expected_ctc', label: 'Expected CTC (₹/year)', type: 'number', placeholder: 'e.g. 2500000 (25 LPA)' },
    { name: 'role', label: 'Role / Position', type: 'text', defaultValue: 'Software Engineer', placeholder: 'e.g. Product Manager' },
    { name: 'experience', label: 'Years of Experience', type: 'number', defaultValue: '3', placeholder: 'e.g. 3' },
  ],

  // ── Legal Tools ───────────────────────────────────────────────────────────
  'nda-generator': [
    { name: 'party1', label: 'Disclosing Party (Name / Company)', type: 'text', placeholder: 'e.g. Ishu Kumar or Ishu Ventures Pvt Ltd' },
    { name: 'party2', label: 'Receiving Party (Name / Company)', type: 'text', placeholder: 'e.g. John Doe or XYZ Technologies' },
    { name: 'purpose', label: 'Purpose of Disclosure', type: 'text', defaultValue: 'business discussions and potential collaboration', placeholder: 'e.g. software development discussions' },
    { name: 'duration', label: 'NDA Duration (years)', type: 'number', defaultValue: '2', placeholder: 'e.g. 2' },
    { name: 'state', label: 'Governing State (India)', type: 'text', defaultValue: 'Delhi', placeholder: 'e.g. Delhi, Mumbai, Bangalore' },
  ],
  'freelance-contract-generator': [
    { name: 'client', label: 'Client Name / Company', type: 'text', placeholder: 'e.g. Rahul Enterprises' },
    { name: 'freelancer', label: 'Your Name (Freelancer)', type: 'text', placeholder: 'e.g. Ishu Kumar' },
    { name: 'project', label: 'Project / Service Description', type: 'text', placeholder: 'e.g. Website Design & Development' },
    { name: 'amount', label: 'Total Project Amount (₹)', type: 'number', placeholder: 'e.g. 50000' },
    { name: 'advance_pct', label: 'Advance Payment (%)', type: 'number', defaultValue: '50', placeholder: 'e.g. 50' },
    { name: 'deadline_days', label: 'Delivery Timeline (days)', type: 'number', defaultValue: '30', placeholder: 'e.g. 30' },
  ],
  'privacy-policy-generator': [
    { name: 'website', label: 'Website / App URL', type: 'text', placeholder: 'e.g. ishutools.com' },
    { name: 'company', label: 'Company / Your Name', type: 'text', placeholder: 'e.g. Ishu Tools' },
    { name: 'email', label: 'Privacy Contact Email', type: 'text', placeholder: 'e.g. privacy@ishutools.com' },
    { name: 'country', label: 'Country', type: 'text', defaultValue: 'India', placeholder: 'e.g. India' },
    { name: 'analytics', label: 'Use Analytics (Google Analytics etc.)?', type: 'select', defaultValue: 'yes',
      options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]},
    { name: 'payments', label: 'Accept Payments?', type: 'select', defaultValue: 'no',
      options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]},
  ],

  // ── Travel Tools ──────────────────────────────────────────────────────────
  'travel-cost-estimator': [
    { name: 'origin', label: 'Origin City', type: 'text', defaultValue: 'Delhi', placeholder: 'e.g. Delhi, Mumbai, Bangalore' },
    { name: 'destination', label: 'Destination', type: 'text', defaultValue: 'Goa', placeholder: 'e.g. Goa, Manali, Ladakh, Maldives' },
    { name: 'days', label: 'Trip Duration (days)', type: 'number', defaultValue: '5', placeholder: 'e.g. 5' },
    { name: 'travelers', label: 'Number of Travelers', type: 'number', defaultValue: '2', placeholder: 'e.g. 2' },
    { name: 'budget_type', label: 'Budget Type', type: 'select', defaultValue: 'mid',
      options: [
        { label: 'Budget (Backpacker)', value: 'budget' },
        { label: 'Mid-Range (Comfortable)', value: 'mid' },
        { label: 'Luxury (5-Star)', value: 'luxury' },
      ]},
    { name: 'transport', label: 'Primary Transport', type: 'select', defaultValue: 'flight',
      options: [
        { label: 'Flight', value: 'flight' },
        { label: 'Train', value: 'train' },
        { label: 'Bus', value: 'bus' },
        { label: 'Self-Drive Car', value: 'car' },
      ]},
  ],
  'visa-checklist-generator': [
    { name: 'nationality', label: 'Nationality / Passport', type: 'text', defaultValue: 'Indian', placeholder: 'e.g. Indian' },
    { name: 'destination', label: 'Destination Country', type: 'text', placeholder: 'e.g. United States, UK, Australia, Schengen' },
    { name: 'visa_type', label: 'Visa Type', type: 'select', defaultValue: 'tourist',
      options: [
        { label: 'Tourist / Visitor', value: 'tourist' },
        { label: 'Business', value: 'business' },
        { label: 'Student', value: 'student' },
        { label: 'Work', value: 'work' },
      ]},
  ],
  'currency-travel-calculator': [
    { name: 'amount', label: 'Amount', type: 'number', defaultValue: '10000', placeholder: 'e.g. 10000' },
    { name: 'from_currency', label: 'From Currency', type: 'select', defaultValue: 'INR',
      options: [
        { label: 'INR — Indian Rupee', value: 'INR' },
        { label: 'USD — US Dollar', value: 'USD' },
        { label: 'EUR — Euro', value: 'EUR' },
        { label: 'GBP — British Pound', value: 'GBP' },
        { label: 'AED — UAE Dirham', value: 'AED' },
        { label: 'SGD — Singapore Dollar', value: 'SGD' },
        { label: 'JPY — Japanese Yen', value: 'JPY' },
        { label: 'AUD — Australian Dollar', value: 'AUD' },
        { label: 'THB — Thai Baht', value: 'THB' },
      ]},
    { name: 'to_currency', label: 'To Currency', type: 'select', defaultValue: 'USD',
      options: [
        { label: 'USD — US Dollar', value: 'USD' },
        { label: 'INR — Indian Rupee', value: 'INR' },
        { label: 'EUR — Euro', value: 'EUR' },
        { label: 'GBP — British Pound', value: 'GBP' },
        { label: 'AED — UAE Dirham', value: 'AED' },
        { label: 'SGD — Singapore Dollar', value: 'SGD' },
        { label: 'JPY — Japanese Yen', value: 'JPY' },
        { label: 'AUD — Australian Dollar', value: 'AUD' },
        { label: 'THB — Thai Baht', value: 'THB' },
      ]},
    { name: 'markup_pct', label: 'Bank/Exchange Markup (%)', type: 'number', defaultValue: '3', placeholder: 'e.g. 3 (banks typically charge 2-5%)' },
  ],
  'packing-list-generator': [
    { name: 'destination', label: 'Destination', type: 'text', placeholder: 'e.g. Goa Beach, Manali Mountains, London...' },
    { name: 'days', label: 'Trip Duration (days)', type: 'number', defaultValue: '7', placeholder: 'e.g. 7' },
    { name: 'climate', label: 'Climate / Weather', type: 'select', defaultValue: 'tropical',
      options: [
        { label: 'Tropical / Hot & Humid', value: 'tropical' },
        { label: 'Cold / Snowy', value: 'cold' },
        { label: 'Desert / Dry', value: 'desert' },
        { label: 'Temperate / Mild', value: 'temperate' },
      ]},
    { name: 'trip_type', label: 'Trip Type', type: 'select', defaultValue: 'leisure',
      options: [
        { label: 'Leisure / Tourism', value: 'leisure' },
        { label: 'Trekking / Adventure', value: 'trekking' },
        { label: 'Business', value: 'business' },
        { label: 'Beach Vacation', value: 'beach' },
      ]},
  ],

  // ── Developer Tools V2 ────────────────────────────────────────────────────
  'api-response-generator': [
    { name: 'text', label: 'Resource Name', type: 'text', defaultValue: 'user', placeholder: 'e.g. user, product, order, post' },
    { name: 'method', label: 'HTTP Method', type: 'select', defaultValue: 'GET',
      options: [
        { label: 'GET (fetch)', value: 'GET' },
        { label: 'POST (create)', value: 'POST' },
        { label: 'PUT (update)', value: 'PUT' },
        { label: 'DELETE (remove)', value: 'DELETE' },
      ]},
    { name: 'status', label: 'HTTP Status Code', type: 'select', defaultValue: '200',
      options: [
        { label: '200 OK', value: '200' },
        { label: '201 Created', value: '201' },
        { label: '404 Not Found', value: '404' },
        { label: '401 Unauthorized', value: '401' },
        { label: '422 Validation Error', value: '422' },
        { label: '429 Rate Limited', value: '429' },
      ]},
    { name: 'pagination', label: 'Include Pagination?', type: 'select', defaultValue: 'yes',
      options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]},
  ],
  'sql-query-builder': [
    { name: 'table', label: 'Table Name', type: 'text', defaultValue: 'users', placeholder: 'e.g. users, products, orders' },
    { name: 'operation', label: 'Operation', type: 'select', defaultValue: 'SELECT',
      options: [
        { label: 'SELECT (fetch)', value: 'SELECT' },
        { label: 'INSERT (add)', value: 'INSERT' },
        { label: 'UPDATE (modify)', value: 'UPDATE' },
        { label: 'DELETE (remove)', value: 'DELETE' },
        { label: 'CREATE TABLE', value: 'CREATE_TABLE' },
        { label: 'ADD INDEX', value: 'ADD_INDEX' },
      ]},
    { name: 'columns', label: 'Columns (comma-separated)', type: 'text', defaultValue: '*', placeholder: 'e.g. id, name, email or * for all' },
    { name: 'where', label: 'WHERE Clause (optional)', type: 'text', placeholder: 'e.g. status = \'active\' AND created_at > \'2024-01-01\'' },
    { name: 'limit', label: 'LIMIT', type: 'number', defaultValue: '10', placeholder: 'e.g. 10' },
  ],
  'gitignore-generator': [
    { name: 'text', label: 'Project Type', type: 'select', defaultValue: 'node',
      options: [
        { label: 'Node.js / Express / NestJS', value: 'node' },
        { label: 'Python / FastAPI / Flask', value: 'python' },
        { label: 'React / Vite / Next.js (frontend)', value: 'react' },
        { label: 'Django', value: 'django' },
        { label: 'Java / Maven / Gradle', value: 'java' },
        { label: 'Flutter / Dart', value: 'flutter' },
        { label: 'Go', value: 'go' },
        { label: 'Rust', value: 'rust' },
      ]},
  ],
  'color-palette-generator': [
    { name: 'text', label: 'Base Color (Hex)', type: 'text', defaultValue: '#3BD0FF', placeholder: 'e.g. #3BD0FF or #FF6B6B' },
    { name: 'scheme', label: 'Color Scheme', type: 'select', defaultValue: 'analogous',
      options: [
        { label: 'Analogous (natural harmony)', value: 'analogous' },
        { label: 'Complementary (high contrast)', value: 'complementary' },
        { label: 'Triadic (vibrant balance)', value: 'triadic' },
        { label: 'Split-Complementary', value: 'split-complementary' },
        { label: 'Monochromatic (tints & shades)', value: 'monochromatic' },
      ]},
  ],
  'docker-compose-generator': [
    { name: 'text', label: 'App / Framework', type: 'select', defaultValue: 'fastapi',
      options: [
        { label: 'FastAPI (Python)', value: 'fastapi' },
        { label: 'Node.js / Express', value: 'node' },
        { label: 'React / Vite', value: 'react' },
        { label: 'Django', value: 'django' },
        { label: 'Next.js', value: 'nextjs' },
      ]},
    { name: 'database', label: 'Database', type: 'select', defaultValue: 'postgres',
      options: [
        { label: 'PostgreSQL', value: 'postgres' },
        { label: 'MySQL', value: 'mysql' },
        { label: 'MongoDB', value: 'mongodb' },
        { label: 'None', value: 'none' },
      ]},
    { name: 'redis', label: 'Include Redis?', type: 'select', defaultValue: 'yes',
      options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]},
    { name: 'nginx', label: 'Include Nginx?', type: 'select', defaultValue: 'no',
      options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]},
    { name: 'port', label: 'App Port', type: 'number', defaultValue: '8000', placeholder: 'e.g. 8000' },
  ],

  // ── Finance V2 ────────────────────────────────────────────────────────────
  'fd-calculator': [
    { name: 'principal', label: 'Principal Amount (₹)', type: 'number', defaultValue: '100000', placeholder: 'e.g. 100000 (1 Lakh)' },
    { name: 'rate', label: 'Interest Rate (% per year)', type: 'number', defaultValue: '7.0', placeholder: 'e.g. 7.0' },
    { name: 'years', label: 'Tenure (years)', type: 'number', defaultValue: '5', placeholder: 'e.g. 5' },
    { name: 'compounding', label: 'Compounding Frequency', type: 'select', defaultValue: 'quarterly',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Half-Yearly', value: 'half-yearly' },
        { label: 'Yearly', value: 'yearly' },
      ]},
    { name: 'senior_citizen', label: 'Senior Citizen?', type: 'select', defaultValue: 'no',
      options: [{ label: 'No', value: 'no' }, { label: 'Yes (+0.50% extra rate)', value: 'yes' }]},
  ],
  'sip-calculator': [
    { name: 'monthly_sip', label: 'Monthly SIP Amount (₹)', type: 'number', defaultValue: '5000', placeholder: 'e.g. 5000' },
    { name: 'annual_return', label: 'Expected Annual Return (%)', type: 'number', defaultValue: '12', placeholder: 'e.g. 12 (historical equity avg)' },
    { name: 'years', label: 'Investment Period (years)', type: 'number', defaultValue: '10', placeholder: 'e.g. 10' },
    { name: 'step_up_pct', label: 'Annual Step-Up (%) — Optional', type: 'number', defaultValue: '0', placeholder: 'e.g. 10 (increase SIP by 10% yearly)' },
  ],
  'emi-calculator-advanced': [
    { name: 'principal', label: 'Loan Amount (₹)', type: 'number', defaultValue: '1000000', placeholder: 'e.g. 1000000 (10 Lakh)' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '8.5', placeholder: 'e.g. 8.5' },
    { name: 'years', label: 'Loan Tenure (years)', type: 'number', defaultValue: '20', placeholder: 'e.g. 20' },
    { name: 'loan_type', label: 'Loan Type', type: 'select', defaultValue: 'home',
      options: [
        { label: 'Home Loan', value: 'home' },
        { label: 'Car Loan', value: 'car' },
        { label: 'Education Loan', value: 'education' },
        { label: 'Personal Loan', value: 'personal' },
      ]},
  ],

  // ── Productivity Tools ────────────────────────────────────────────────────
  'pomodoro-planner': [
    { name: 'text', label: 'Tasks for Today (one per line)', type: 'textarea', placeholder: 'Write code for feature X\nReview pull requests\nTeam meeting prep\nEmail responses' },
    { name: 'work_minutes', label: 'Work Session (minutes)', type: 'number', defaultValue: '25', placeholder: 'e.g. 25' },
    { name: 'break_minutes', label: 'Short Break (minutes)', type: 'number', defaultValue: '5', placeholder: 'e.g. 5' },
    { name: 'long_break_minutes', label: 'Long Break (minutes)', type: 'number', defaultValue: '15', placeholder: 'e.g. 15 (after 4 sessions)' },
    { name: 'start_time', label: 'Start Time', type: 'text', defaultValue: '09:00', placeholder: 'HH:MM (e.g. 09:00)' },
  ],
  'habit-tracker-generator': [
    { name: 'text', label: 'Habits to Track (one per line)', type: 'textarea', placeholder: 'Exercise 30 min\nRead 20 pages\nMeditate 10 min\nDrink 2L water\nNo screen after 10pm' },
    { name: 'days', label: 'Tracking Period (days)', type: 'number', defaultValue: '30', placeholder: 'e.g. 30 (30-day challenge)' },
    { name: 'goal', label: 'Goal Type', type: 'select', defaultValue: 'build',
      options: [
        { label: 'Build New Habits', value: 'build' },
        { label: 'Break Bad Habits', value: 'break' },
        { label: 'Improve Existing Habits', value: 'improve' },
      ]},
  ],
  'meeting-agenda-generator': [
    { name: 'text', label: 'Meeting Title', type: 'text', defaultValue: 'Team Sync', placeholder: 'e.g. Sprint Planning, Q2 Review, Product Demo...' },
    { name: 'objective', label: 'Meeting Objective', type: 'text', defaultValue: 'project update and next steps', placeholder: 'e.g. decide on Q3 roadmap priorities' },
    { name: 'duration', label: 'Duration (minutes)', type: 'select', defaultValue: '60',
      options: [
        { label: '30 minutes', value: '30' },
        { label: '45 minutes', value: '45' },
        { label: '60 minutes (1 hour)', value: '60' },
        { label: '90 minutes', value: '90' },
      ]},
    { name: 'attendees', label: 'Attendees (comma-separated)', type: 'text', placeholder: 'e.g. Ishu, Rahul, Priya, PM Team' },
  ],
}

// ── AV Studio v2 — payload fields ────────────────────────────────────────
TOOL_FIELDS['bass-booster'] = [
  { name: 'gain', label: 'Bass boost (dB)', type: 'number', placeholder: '8', help: '0–20 dB. Default 8 dB.' },
]
TOOL_FIELDS['treble-booster'] = [
  { name: 'gain', label: 'Treble boost (dB)', type: 'number', placeholder: '6', help: '0–20 dB. Default 6 dB.' },
]
TOOL_FIELDS['audio-pitch-shifter'] = [
  { name: 'semitones', label: 'Semitones', type: 'number', placeholder: '2', help: '-12 to +12. Negative = lower pitch.' },
]
TOOL_FIELDS['audio-speed-changer'] = [
  { name: 'speed', label: 'Speed multiplier', type: 'number', placeholder: '1.5', help: '0.5×–4×. 1.0 = original, 2.0 = double speed.' },
]
TOOL_FIELDS['audio-fader'] = [
  { name: 'duration', label: 'Fade duration (seconds)', type: 'number', placeholder: '3', help: '0.5–15 sec. Applied to both fade-in and fade-out.' },
]
TOOL_FIELDS['audio-volume-booster'] = [
  { name: 'gain', label: 'Volume change (dB)', type: 'number', placeholder: '6', help: '-30 to +30 dB. Positive = louder.' },
]
TOOL_FIELDS['video-color-grader'] = [
  { name: 'brightness', label: 'Brightness', type: 'number', placeholder: '0.1', help: '-0.5 to +0.5' },
  { name: 'contrast',   label: 'Contrast',   type: 'number', placeholder: '1.1', help: '0.5 to 2.0 (1.0 = unchanged)' },
  { name: 'saturation', label: 'Saturation', type: 'number', placeholder: '1.15', help: '0 (B&W) to 2.0' },
]
TOOL_FIELDS['video-speed-changer'] = [
  { name: 'speed', label: 'Speed multiplier', type: 'number', placeholder: '2.0', help: '0.25× (slow-mo) to 4× (timelapse).' },
]

// Aliases share the same field configs
Object.assign(TOOL_FIELDS, {
  'bass-boost': TOOL_FIELDS['bass-booster'],
  'treble-boost': TOOL_FIELDS['treble-booster'],
  'pitch-shifter': TOOL_FIELDS['audio-pitch-shifter'],
  'audio-speed-modifier': TOOL_FIELDS['audio-speed-changer'],
  'audio-fade-in-out': TOOL_FIELDS['audio-fader'],
  'volume-booster': TOOL_FIELDS['audio-volume-booster'],
  'audio-louder': TOOL_FIELDS['audio-volume-booster'],
  'video-brightness-contrast': TOOL_FIELDS['video-color-grader'],
  'video-speed-modifier': TOOL_FIELDS['video-speed-changer'],
})

Object.assign(TOOL_FIELDS, {
  'attendance-tracker': TOOL_FIELDS['attendance-calculator'],
  'marks-calculator': TOOL_FIELDS['marks-percentage-calculator'],
  'marks-to-percentage': TOOL_FIELDS['marks-percentage-calculator'],
  'reading-time': [
    { name: 'text', label: 'Text to Estimate', type: 'textarea', placeholder: 'Paste the article, essay, or notes...' },
    { name: 'wpm', label: 'Reading Speed (words per minute)', type: 'number', defaultValue: '200', placeholder: 'e.g. 200' },
  ],
  'estimate-reading-time': [
    { name: 'text', label: 'Text to Estimate', type: 'textarea', placeholder: 'Paste text, or leave blank and enter word count...' },
    { name: 'word_count', label: 'Word Count (optional)', type: 'number', placeholder: 'e.g. 1200' },
    { name: 'wpm', label: 'Reading Speed (WPM)', type: 'number', defaultValue: '200', placeholder: 'e.g. 200' },
  ],
  'tdee-calculator': TOOL_FIELDS['calorie-calculator'],
  'daily-calorie-calculator': TOOL_FIELDS['calorie-calculator'],
  'daily-water-intake': TOOL_FIELDS['water-intake-calculator'],
  'gst-tax-calculator': TOOL_FIELDS['gst-calculator'],
  'budget-calculator': TOOL_FIELDS['budget-planner'],
  'tax-calculator': TOOL_FIELDS['income-tax-calculator'],
  'india-tax-calculator': TOOL_FIELDS['income-tax-calculator'],
  'home-loan-emi-calculator': [
    { name: 'loan_amount', label: 'Loan Amount (₹)', type: 'number', defaultValue: '2500000', placeholder: 'e.g. 2500000' },
    { name: 'interest_rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '8.5', placeholder: 'e.g. 8.5' },
    { name: 'tenure', label: 'Tenure (years)', type: 'number', defaultValue: '20', placeholder: 'e.g. 20' },
  ],
  'monthly-emi': [
    { name: 'principal', label: 'Loan Amount (₹)', type: 'number', defaultValue: '500000', placeholder: 'e.g. 500000' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '10', placeholder: 'e.g. 10' },
    { name: 'tenure_months', label: 'Tenure (months)', type: 'number', defaultValue: '60', placeholder: 'e.g. 60' },
  ],
  'percentage-change': [
    { name: 'old_value', label: 'Old Value', type: 'number', defaultValue: '100', placeholder: 'e.g. 100' },
    { name: 'new_value', label: 'New Value', type: 'number', defaultValue: '125', placeholder: 'e.g. 125' },
  ],
  'percent-change': [
    { name: 'old_value', label: 'Old Value', type: 'number', defaultValue: '100', placeholder: 'e.g. 100' },
    { name: 'new_value', label: 'New Value', type: 'number', defaultValue: '80', placeholder: 'e.g. 80' },
  ],
  'roman-numeral': TOOL_FIELDS['roman-numeral-converter'],
  'random-number': TOOL_FIELDS['random-number-generator'],
  'anagram-detector': [
    { name: 'word1', label: 'First Word or Phrase', type: 'text', defaultValue: 'listen', placeholder: 'e.g. listen' },
    { name: 'word2', label: 'Second Word or Phrase', type: 'text', defaultValue: 'silent', placeholder: 'e.g. silent' },
  ],
  'sort-lines': [
    { name: 'text', label: 'Lines to Sort', type: 'textarea', placeholder: 'banana\\napple\\ncherry' },
    { name: 'order', label: 'Sort Order', type: 'select', defaultValue: 'asc', options: [
      { label: 'A-Z', value: 'asc' },
      { label: 'Z-A', value: 'desc' },
      { label: 'Length', value: 'length' },
      { label: 'Length Descending', value: 'length_desc' },
      { label: 'Shuffle', value: 'random' },
    ] },
  ],
  'line-sorter': [
    { name: 'text', label: 'Lines to Sort', type: 'textarea', placeholder: 'banana\\napple\\ncherry' },
    { name: 'order', label: 'Sort Order', type: 'select', defaultValue: 'asc', options: [
      { label: 'A-Z', value: 'asc' },
      { label: 'Z-A', value: 'desc' },
      { label: 'Length', value: 'length' },
      { label: 'Shuffle', value: 'random' },
    ] },
  ],
  'remove-duplicates': [
    { name: 'text', label: 'List Items', type: 'textarea', placeholder: 'apple\\nbanana\\napple\\ncherry' },
    { name: 'case_sensitive', label: 'Case Sensitive?', type: 'select', defaultValue: 'true', options: booleanOptions },
  ],
  'deduplicate-list': [
    { name: 'text', label: 'List Items', type: 'textarea', placeholder: 'apple\\nbanana\\napple\\ncherry' },
    { name: 'case_sensitive', label: 'Case Sensitive?', type: 'select', defaultValue: 'true', options: booleanOptions },
  ],
  'char-frequency': [
    { name: 'text', label: 'Text to Analyze', type: 'textarea', placeholder: 'Paste text to count character frequency...' },
    { name: 'ignore_spaces', label: 'Ignore Spaces?', type: 'select', defaultValue: 'true', options: booleanOptions },
  ],
  'letter-frequency': [
    { name: 'text', label: 'Text to Analyze', type: 'textarea', placeholder: 'Paste text to count letters...' },
    { name: 'ignore_spaces', label: 'Ignore Spaces?', type: 'select', defaultValue: 'true', options: booleanOptions },
  ],
  'user-agent-parser': [
    { name: 'user_agent', label: 'User Agent String', type: 'textarea', defaultValue: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', placeholder: 'Paste browser user-agent...' },
  ],
  'csv-cleaner': [
    { name: 'csv', label: 'CSV Data', type: 'textarea', defaultValue: 'Name, Score\\n Ishu , 95\\n Tools , 100\\n', placeholder: 'Paste CSV data...' },
    { name: 'delimiter', label: 'Delimiter', type: 'select', defaultValue: 'auto', options: [
      { label: 'Auto Detect', value: 'auto' },
      { label: 'Comma', value: 'comma' },
      { label: 'Tab', value: 'tab' },
      { label: 'Semicolon', value: 'semicolon' },
      { label: 'Pipe', value: 'pipe' },
    ] },
    { name: 'trim_cells', label: 'Trim Cells?', type: 'select', defaultValue: 'true', options: booleanOptions },
    { name: 'remove_empty_rows', label: 'Remove Empty Rows?', type: 'select', defaultValue: 'true', options: booleanOptions },
    { name: 'dedupe_rows', label: 'Remove Duplicate Rows?', type: 'select', defaultValue: 'false', options: booleanOptions },
    { name: 'normalize_headers', label: 'Normalize Headers?', type: 'select', defaultValue: 'false', options: booleanOptions },
  ],
  'regex-replace': [
    { name: 'text', label: 'Input Text', type: 'textarea', defaultValue: 'Call 98765-43210 or 12345-67890', placeholder: 'Paste text...' },
    { name: 'pattern', label: 'Regex Pattern', type: 'text', defaultValue: '\\\\d{5}-\\\\d{5}', placeholder: 'e.g. \\\\d+' },
    { name: 'replacement', label: 'Replacement', type: 'text', defaultValue: '[phone]', placeholder: 'Replacement text' },
    { name: 'flags', label: 'Flags', type: 'text', defaultValue: 'i', placeholder: 'i, m, s' },
  ],
  'weighted-gpa-calculator': [
    { name: 'courses', label: 'Courses (name, grade, credits)', type: 'textarea', defaultValue: 'Math,A,4\\nPhysics,B+,3\\nEnglish,A-,2', placeholder: 'Math,A,4' },
    { name: 'scale', label: 'GPA Scale', type: 'number', defaultValue: '4', placeholder: '4 or 10' },
  ],
  'grade-average-calculator': [
    { name: 'scores', label: 'Scores', type: 'textarea', defaultValue: '78, 85, 91, 66', placeholder: 'Enter scores separated by comma or lines' },
    { name: 'max_marks', label: 'Max Marks Per Score', type: 'number', defaultValue: '100', placeholder: 'e.g. 100' },
  ],
  'syllabus-study-planner': [
    { name: 'topics', label: 'Topics (topic, difficulty)', type: 'textarea', defaultValue: 'Algebra, hard\\nPhysics numericals, medium\\nEnglish grammar, easy', placeholder: 'Topic, easy/medium/hard' },
    { name: 'days', label: 'Days Left', type: 'number', defaultValue: '7', placeholder: 'e.g. 7' },
    { name: 'daily_hours', label: 'Daily Study Hours', type: 'number', defaultValue: '2', placeholder: 'e.g. 2' },
  ],
  'citation-url-cleaner': [
    { name: 'urls', label: 'URLs', type: 'textarea', defaultValue: 'https://example.com/article?utm_source=twitter&gclid=abc&id=42', placeholder: 'Paste citation URLs...' },
    { name: 'keep_fragment', label: 'Keep URL Fragment?', type: 'select', defaultValue: 'false', options: booleanOptions },
  ],
  'url-query-parser': [
    { name: 'url', label: 'URL', type: 'textarea', defaultValue: 'https://example.com/search?q=ishu&sort=new#top', placeholder: 'Paste URL...' },
  ],
  'timestamp-converter': [
    { name: 'timestamp', label: 'Timestamp or Date', type: 'text', defaultValue: '1700000000', placeholder: 'Unix timestamp, milliseconds, or ISO date' },
    { name: 'offset_minutes', label: 'Local Offset Minutes', type: 'number', defaultValue: '330', placeholder: 'India = 330, UTC = 0' },
  ],
  'markdown-table-generator': [
    { name: 'data', label: 'CSV / Table Data', type: 'textarea', defaultValue: 'Name,Score\\nIshu,95\\nTools,100', placeholder: 'Paste CSV, TSV, or table data...' },
    { name: 'delimiter', label: 'Delimiter', type: 'select', defaultValue: 'auto', options: [
      { label: 'Auto Detect', value: 'auto' },
      { label: 'Comma', value: 'comma' },
      { label: 'Tab', value: 'tab' },
      { label: 'Pipe', value: 'pipe' },
      { label: 'Semicolon', value: 'semicolon' },
    ] },
    { name: 'has_header', label: 'First Row is Header?', type: 'select', defaultValue: 'true', options: booleanOptions },
  ],
  'email-extractor': [
    { name: 'text', label: 'Text', type: 'textarea', defaultValue: 'Contact ishu@example.com and support@ishutools.com for help.', placeholder: 'Paste text containing emails...' },
  ],
  'phone-number-extractor': [
    { name: 'text', label: 'Text', type: 'textarea', defaultValue: 'Call +91 98765 43210 or 011-2345-6789 today.', placeholder: 'Paste text containing phone numbers...' },
  ],
  'keyword-density-checker': [
    { name: 'text', label: 'Content', type: 'textarea', defaultValue: 'ISHU TOOLS is a free online tools website for students, developers, and creators. These tools are fast and free.', placeholder: 'Paste SEO content...' },
    { name: 'min_length', label: 'Minimum Word Length', type: 'number', defaultValue: '3', placeholder: 'e.g. 3' },
    { name: 'top_n', label: 'Top Keywords', type: 'number', defaultValue: '20', placeholder: 'e.g. 20' },
  ],
  'robots-txt-generator': [
    { name: 'site_url', label: 'Site URL', type: 'text', defaultValue: 'https://ishutools.com', placeholder: 'https://example.com' },
    { name: 'sitemap_url', label: 'Sitemap URL', type: 'text', defaultValue: 'https://ishutools.com/sitemap.xml', placeholder: 'https://example.com/sitemap.xml' },
    { name: 'allow', label: 'Allow Paths', type: 'textarea', defaultValue: '/', placeholder: 'One path per line' },
    { name: 'disallow', label: 'Disallow Paths', type: 'textarea', defaultValue: '/api/\\n/admin/', placeholder: 'One path per line' },
    { name: 'crawl_delay', label: 'Crawl Delay', type: 'text', placeholder: 'Optional, e.g. 1' },
  ],
  'meta-description-generator': [
    { name: 'topic', label: 'Page / Tool Topic', type: 'text', defaultValue: 'Free PDF tools', placeholder: 'e.g. YouTube playlist downloader' },
    { name: 'audience', label: 'Audience', type: 'text', defaultValue: 'students and professionals', placeholder: 'e.g. Indian students' },
    { name: 'keywords', label: 'Keywords', type: 'textarea', defaultValue: 'free tools, online tools, ISHU TOOLS', placeholder: 'Comma-separated keywords' },
    { name: 'max_length', label: 'Max Description Length', type: 'number', defaultValue: '155', placeholder: '120-180' },
  ],
  'utm-builder': [
    { name: 'url', label: 'Website URL', type: 'text', defaultValue: 'https://ishutools.com/tools', placeholder: 'https://example.com/page' },
    { name: 'source', label: 'UTM Source', type: 'text', defaultValue: 'newsletter', placeholder: 'google, instagram, newsletter' },
    { name: 'medium', label: 'UTM Medium', type: 'text', defaultValue: 'email', placeholder: 'cpc, social, email' },
    { name: 'campaign', label: 'UTM Campaign', type: 'text', defaultValue: 'student_tools_launch', placeholder: 'campaign name' },
    { name: 'term', label: 'UTM Term', type: 'text', placeholder: 'Optional keyword' },
    { name: 'content', label: 'UTM Content', type: 'text', placeholder: 'Optional ad/content variant' },
  ],
  'html-table-generator': [
    { name: 'data', label: 'CSV / Table Data', type: 'textarea', defaultValue: 'Name,Score\\nIshu,95\\nTools,100', placeholder: 'Paste CSV data...' },
    { name: 'delimiter', label: 'Delimiter', type: 'select', defaultValue: 'auto', options: [
      { label: 'Auto Detect', value: 'auto' },
      { label: 'Comma', value: 'comma' },
      { label: 'Tab', value: 'tab' },
      { label: 'Pipe', value: 'pipe' },
      { label: 'Semicolon', value: 'semicolon' },
    ] },
    { name: 'has_header', label: 'First Row is Header?', type: 'select', defaultValue: 'true', options: booleanOptions },
    { name: 'class_name', label: 'CSS Class Name', type: 'text', defaultValue: 'ishu-table', placeholder: 'e.g. pricing-table' },
  ],
  'json-schema-generator': [
    { name: 'json', label: 'JSON Data', type: 'textarea', defaultValue: '{"name":"Ishu","score":95,"tags":["tools","student"]}', placeholder: 'Paste valid JSON...' },
  ],
  'css-clamp-generator': [
    { name: 'min_px', label: 'Minimum Size (px)', type: 'number', defaultValue: '16', placeholder: 'e.g. 16' },
    { name: 'max_px', label: 'Maximum Size (px)', type: 'number', defaultValue: '32', placeholder: 'e.g. 32' },
    { name: 'min_viewport', label: 'Minimum Viewport (px)', type: 'number', defaultValue: '360', placeholder: 'e.g. 360' },
    { name: 'max_viewport', label: 'Maximum Viewport (px)', type: 'number', defaultValue: '1440', placeholder: 'e.g. 1440' },
    { name: 'base_px', label: 'REM Base (px)', type: 'number', defaultValue: '16', placeholder: 'e.g. 16' },
    { name: 'unit', label: 'Output Unit', type: 'select', defaultValue: 'rem', options: [
      { label: 'rem', value: 'rem' },
      { label: 'px', value: 'px' },
    ] },
  ],
  'slug-bulk-generator': [
    { name: 'text', label: 'Titles / Lines', type: 'textarea', defaultValue: 'Hello World\\nISHU Tools Page', placeholder: 'One title per line' },
    { name: 'separator', label: 'Separator', type: 'text', defaultValue: '-', placeholder: '- or _' },
    { name: 'max_length', label: 'Max Slug Length', type: 'number', defaultValue: '80', placeholder: 'e.g. 80' },
    { name: 'preserve_numbers', label: 'Keep Numbers?', type: 'select', defaultValue: 'true', options: booleanOptions },
  ],
  'table-to-csv-converter': [
    { name: 'table', label: 'Table Text', type: 'textarea', defaultValue: '| Name | Score |\\n| --- | --- |\\n| Ishu | 95 |', placeholder: 'Paste Markdown/table text...' },
  ],
  'csv-column-extractor': [
    { name: 'csv', label: 'CSV Data', type: 'textarea', defaultValue: 'Name,Score,City\\nIshu,95,Patna\\nTools,100,Web', placeholder: 'Paste CSV data...' },
    { name: 'columns', label: 'Columns to Extract', type: 'text', defaultValue: 'Name,Score', placeholder: 'Names or 1-based indexes' },
    { name: 'delimiter', label: 'Delimiter', type: 'select', defaultValue: 'auto', options: [
      { label: 'Auto Detect', value: 'auto' },
      { label: 'Comma', value: 'comma' },
      { label: 'Tab', value: 'tab' },
      { label: 'Pipe', value: 'pipe' },
      { label: 'Semicolon', value: 'semicolon' },
    ] },
    { name: 'has_header', label: 'First Row is Header?', type: 'select', defaultValue: 'true', options: booleanOptions },
  ],
  'css-specificity-calculator': [
    { name: 'selectors', label: 'CSS Selectors', type: 'textarea', defaultValue: '#app .card button:hover\\nmain article h2', placeholder: 'One selector per line' },
  ],
  'http-status-code-lookup': [
    { name: 'code', label: 'HTTP Status Code', type: 'number', defaultValue: '404', placeholder: 'e.g. 404' },
  ],
  'mime-type-lookup': [
    { name: 'extension', label: 'File Extension or Filename', type: 'text', defaultValue: 'pdf', placeholder: 'pdf, image.png, json' },
  ],
  'loan-comparison-calculator': [
    { name: 'principal', label: 'Loan Amount (₹)', type: 'number', defaultValue: '500000', placeholder: 'e.g. 500000' },
    { name: 'years', label: 'Tenure (years)', type: 'number', defaultValue: '5', placeholder: 'e.g. 5' },
    { name: 'rates', label: 'Interest Rates (%)', type: 'text', defaultValue: '8.5, 10, 12', placeholder: 'Comma-separated rates' },
  ],
  'break-even-calculator': [
    { name: 'fixed_cost', label: 'Fixed Cost', type: 'number', defaultValue: '100000', placeholder: 'e.g. 100000' },
    { name: 'price_per_unit', label: 'Price Per Unit', type: 'number', defaultValue: '500', placeholder: 'e.g. 500' },
    { name: 'variable_cost_per_unit', label: 'Variable Cost Per Unit', type: 'number', defaultValue: '250', placeholder: 'e.g. 250' },
  ],
  'profit-margin-calculator': [
    { name: 'cost', label: 'Cost Price', type: 'number', defaultValue: '100', placeholder: 'e.g. 100' },
    { name: 'selling_price', label: 'Selling Price', type: 'number', defaultValue: '150', placeholder: 'e.g. 150' },
  ],
  'gst-reverse-calculator': [
    { name: 'inclusive_amount', label: 'GST-Inclusive Amount (₹)', type: 'number', defaultValue: '1180', placeholder: 'e.g. 1180' },
    { name: 'gst_rate', label: 'GST Rate (%)', type: 'number', defaultValue: '18', placeholder: 'e.g. 18' },
  ],
  'discount-stack-calculator': [
    { name: 'price', label: 'Original Price', type: 'number', defaultValue: '1000', placeholder: 'e.g. 1000' },
    { name: 'discounts', label: 'Discounts (%)', type: 'text', defaultValue: '10,5', placeholder: 'Comma-separated discounts' },
  ],
  'study-break-planner': [
    { name: 'total_minutes', label: 'Total Study Minutes', type: 'number', defaultValue: '180', placeholder: 'e.g. 180' },
    { name: 'focus_minutes', label: 'Focus Block Minutes', type: 'number', defaultValue: '50', placeholder: 'e.g. 50' },
    { name: 'break_minutes', label: 'Break Minutes', type: 'number', defaultValue: '10', placeholder: 'e.g. 10' },
    { name: 'start_time', label: 'Start Time', type: 'text', defaultValue: '09:00', placeholder: 'HH:MM' },
  ],
  'water-reminder-schedule': [
    { name: 'wake_time', label: 'Wake Time', type: 'text', defaultValue: '07:00', placeholder: 'HH:MM' },
    { name: 'sleep_time', label: 'Sleep Time', type: 'text', defaultValue: '22:30', placeholder: 'HH:MM' },
    { name: 'glasses', label: 'Glasses Per Day', type: 'number', defaultValue: '8', placeholder: 'e.g. 8' },
  ],
  'workout-plan-generator': [
    { name: 'goal', label: 'Goal', type: 'select', defaultValue: 'fitness', options: [
      { label: 'General Fitness', value: 'fitness' },
      { label: 'Strength', value: 'strength' },
      { label: 'Weight Loss', value: 'weight_loss' },
    ] },
    { name: 'level', label: 'Level', type: 'select', defaultValue: 'beginner', options: [
      { label: 'Beginner', value: 'beginner' },
      { label: 'Intermediate', value: 'intermediate' },
      { label: 'Advanced', value: 'advanced' },
    ] },
    { name: 'days_per_week', label: 'Days Per Week', type: 'number', defaultValue: '4', placeholder: '1-7' },
  ],
  'meal-plan-generator': [
    { name: 'calories', label: 'Daily Calories', type: 'number', defaultValue: '2000', placeholder: 'e.g. 2000' },
    { name: 'meals', label: 'Meals Per Day', type: 'number', defaultValue: '4', placeholder: '2-6' },
    { name: 'diet', label: 'Diet Style', type: 'select', defaultValue: 'balanced', options: [
      { label: 'Balanced', value: 'balanced' },
      { label: 'High Protein', value: 'high protein' },
    ] },
  ],
  'name-initials-generator': [
    { name: 'names', label: 'Names', type: 'textarea', defaultValue: 'Ishu Kumar\\nIndian Student Hub', placeholder: 'One name per line' },
  ],
  'acronym-generator': [
    { name: 'phrase', label: 'Phrase', type: 'text', defaultValue: 'Indian Student Hub University Tools', placeholder: 'Enter phrase...' },
  ],
  'username-generator': [
    { name: 'name', label: 'Name', type: 'text', defaultValue: 'Ishu Kumar', placeholder: 'Your name' },
    { name: 'keyword', label: 'Keyword', type: 'text', defaultValue: 'tools', placeholder: 'tools, dev, art...' },
    { name: 'count', label: 'How Many?', type: 'number', defaultValue: '12', placeholder: '5-50' },
  ],
  'youtube-thumbnail-url-generator': [
    { name: 'url', label: 'YouTube URL or Video ID', type: 'text', defaultValue: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', placeholder: 'Paste YouTube URL...' },
  ],
  'youtube-embed-code-generator': [
    { name: 'url', label: 'YouTube URL or Video ID', type: 'text', defaultValue: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', placeholder: 'Paste YouTube URL...' },
    { name: 'start_seconds', label: 'Start Seconds', type: 'number', defaultValue: '0', placeholder: 'e.g. 30' },
    { name: 'autoplay', label: 'Autoplay?', type: 'select', defaultValue: 'false', options: booleanOptions },
    { name: 'responsive', label: 'Responsive Embed?', type: 'select', defaultValue: 'true', options: booleanOptions },
  ],
  'video-aspect-ratio-calculator': [
    { name: 'width', label: 'Width', type: 'number', defaultValue: '1920', placeholder: 'e.g. 1920' },
    { name: 'height', label: 'Height', type: 'number', defaultValue: '1080', placeholder: 'e.g. 1080' },
  ],
  'video-bitrate-calculator': [
    { name: 'size_mb', label: 'File Size (MB)', type: 'number', defaultValue: '100', placeholder: 'e.g. 100' },
    { name: 'duration', label: 'Duration', type: 'text', defaultValue: '00:03:00', placeholder: 'HH:MM:SS or seconds' },
    { name: 'audio_kbps', label: 'Audio Bitrate (kbps)', type: 'number', defaultValue: '128', placeholder: 'e.g. 128' },
  ],
  'video-file-size-estimator': [
    { name: 'duration', label: 'Duration', type: 'text', defaultValue: '00:03:00', placeholder: 'HH:MM:SS or seconds' },
    { name: 'video_kbps', label: 'Video Bitrate (kbps)', type: 'number', defaultValue: '2500', placeholder: 'e.g. 2500' },
    { name: 'audio_kbps', label: 'Audio Bitrate (kbps)', type: 'number', defaultValue: '128', placeholder: 'e.g. 128' },
  ],
  'video-duration-calculator': [
    { name: 'duration', label: 'Duration / Timecode', type: 'text', defaultValue: '01:23:45', placeholder: 'HH:MM:SS or seconds' },
    { name: 'fps', label: 'FPS', type: 'number', defaultValue: '30', placeholder: 'e.g. 30' },
  ],
  'serp-snippet-preview': [
    { name: 'title', label: 'SEO Title', type: 'text', defaultValue: 'ISHU TOOLS - Free Online Tools', placeholder: 'Page title...' },
    { name: 'description', label: 'Meta Description', type: 'textarea', defaultValue: 'Use free online tools for students, developers, finance, SEO, images, PDF and more.', placeholder: 'Meta description...' },
    { name: 'url', label: 'URL', type: 'text', defaultValue: 'https://ishutools.com/tools', placeholder: 'https://example.com/page' },
  ],
  'keyword-cluster-generator': [
    { name: 'keywords', label: 'Keywords', type: 'textarea', defaultValue: 'pdf merge\\nmerge pdf online\\ncompress pdf\\nimage compressor', placeholder: 'One keyword per line' },
  ],
  'headline-analyzer': [
    { name: 'headline', label: 'Headline', type: 'text', defaultValue: 'Best Free Online Tools for Students', placeholder: 'Enter headline...' },
  ],
  'json-path-extractor': [
    { name: 'json', label: 'JSON Data', type: 'textarea', defaultValue: '{"user":{"name":"Ishu","scores":[95,100]}}', placeholder: 'Paste JSON...' },
    { name: 'path', label: 'Path', type: 'text', defaultValue: 'user.name', placeholder: 'e.g. user.name or items[0].title' },
  ],
  'uuid-validator': [
    { name: 'uuid', label: 'UUID', type: 'text', defaultValue: '550e8400-e29b-41d4-a716-446655440000', placeholder: 'Paste UUID...' },
  ],
  'ulid-generator': [
    { name: 'count', label: 'How Many?', type: 'number', defaultValue: '5', placeholder: '1-50' },
  ],
  'ics-calendar-generator': [
    { name: 'title', label: 'Event Title', type: 'text', defaultValue: 'ISHU TOOLS Event', placeholder: 'Event title' },
    { name: 'start', label: 'Start Date Time', type: 'text', defaultValue: '2026-01-01 10:00', placeholder: 'YYYY-MM-DD HH:MM' },
    { name: 'duration_minutes', label: 'Duration Minutes', type: 'number', defaultValue: '60', placeholder: 'e.g. 60' },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'Optional location' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional description' },
  ],
  'vcard-generator': [
    { name: 'name', label: 'Full Name', type: 'text', defaultValue: 'Ishu Kumar', placeholder: 'Full name' },
    { name: 'email', label: 'Email', type: 'text', defaultValue: 'hello@example.com', placeholder: 'Email address' },
    { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Phone number' },
    { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Company / school' },
    { name: 'title', label: 'Title', type: 'text', placeholder: 'Job title' },
    { name: 'url', label: 'Website', type: 'text', placeholder: 'https://example.com' },
  ],
  'salary-to-hourly-calculator': [
    { name: 'annual_salary', label: 'Annual Salary', type: 'number', defaultValue: '600000', placeholder: 'e.g. 600000' },
    { name: 'hours_per_week', label: 'Hours Per Week', type: 'number', defaultValue: '40', placeholder: 'e.g. 40' },
    { name: 'weeks_per_year', label: 'Weeks Per Year', type: 'number', defaultValue: '52', placeholder: 'e.g. 52' },
  ],
  'hourly-to-salary-calculator': [
    { name: 'hourly_rate', label: 'Hourly Rate', type: 'number', defaultValue: '500', placeholder: 'e.g. 500' },
    { name: 'hours_per_week', label: 'Hours Per Week', type: 'number', defaultValue: '40', placeholder: 'e.g. 40' },
    { name: 'weeks_per_year', label: 'Weeks Per Year', type: 'number', defaultValue: '52', placeholder: 'e.g. 52' },
  ],
  'debt-payoff-planner': [
    { name: 'debts', label: 'Debts (name,balance,rate,min payment)', type: 'textarea', defaultValue: 'Card,50000,24,5000\\nLoan,200000,12,8000', placeholder: 'One debt per line' },
    { name: 'extra_payment', label: 'Extra Monthly Payment', type: 'number', defaultValue: '2000', placeholder: 'e.g. 2000' },
    { name: 'strategy', label: 'Strategy', type: 'select', defaultValue: 'avalanche', options: [
      { label: 'Avalanche (highest rate first)', value: 'avalanche' },
      { label: 'Snowball (smallest balance first)', value: 'snowball' },
    ] },
  ],
  'goal-progress-calculator': [
    { name: 'start', label: 'Start Value', type: 'number', defaultValue: '0', placeholder: 'e.g. 0' },
    { name: 'current', label: 'Current Value', type: 'number', defaultValue: '40', placeholder: 'e.g. 40' },
    { name: 'target', label: 'Target Value', type: 'number', defaultValue: '100', placeholder: 'e.g. 100' },
    { name: 'daily_rate', label: 'Daily Rate', type: 'number', defaultValue: '5', placeholder: 'Optional ETA rate' },
  ],
  'habit-streak-calculator': [
    { name: 'dates', label: 'Completion Dates', type: 'textarea', defaultValue: '2026-04-20\\n2026-04-21\\n2026-04-22', placeholder: 'YYYY-MM-DD, one per line' },
    { name: 'today', label: 'Today', type: 'text', defaultValue: '2026-04-22', placeholder: 'YYYY-MM-DD' },
  ],
  'exam-timetable-generator': [
    { name: 'subjects', label: 'Subjects', type: 'textarea', defaultValue: 'Math,Physics,English', placeholder: 'Subjects separated by commas or lines' },
    { name: 'days', label: 'Days Left', type: 'number', defaultValue: '7', placeholder: 'e.g. 7' },
    { name: 'daily_hours', label: 'Daily Study Hours', type: 'number', defaultValue: '3', placeholder: 'e.g. 3' },
  ],
  'flashcard-csv-generator': [
    { name: 'notes', label: 'Notes', type: 'textarea', defaultValue: 'HTML: HyperText Markup Language\\nCSS: Cascading Style Sheets', placeholder: 'Term: Definition, one per line' },
  ],
  'notes-to-quiz-generator': [
    { name: 'notes', label: 'Notes', type: 'textarea', defaultValue: 'Photosynthesis converts light energy into chemical energy. HTML means HyperText Markup Language.', placeholder: 'Paste notes...' },
  ],
  'simple-rubric-generator': [
    { name: 'assignment', label: 'Assignment Name', type: 'text', defaultValue: 'Essay', placeholder: 'e.g. Science Project' },
    { name: 'criteria', label: 'Criteria', type: 'textarea', defaultValue: 'Content,Organization,Grammar,References', placeholder: 'Comma or line separated' },
    { name: 'points_each', label: 'Points Per Criterion', type: 'number', defaultValue: '10', placeholder: 'e.g. 10' },
  ],
  'pan-card-validator': TOOL_FIELDS['pan-validator'],
  'password-analyzer': TOOL_FIELDS['password-strength-checker'],
  'jwt-decoder-advanced': TOOL_FIELDS['jwt-decoder'],
  'text-compare': TOOL_FIELDS['text-diff'],
  'cidr-calculator': TOOL_FIELDS['ip-subnet-calculator'],
  'http-headers-viewer': TOOL_FIELDS['http-headers-checker'],
  'port-scanner': TOOL_FIELDS['port-checker'],
  'multi-hash-generator': TOOL_FIELDS['hash-generator-advanced'],
})

Object.assign(TOOL_FIELDS, {
  'browser-user-agent-parser': TOOL_FIELDS['user-agent-parser'],
  'clean-csv': TOOL_FIELDS['csv-cleaner'],
  'regex-find-replace': TOOL_FIELDS['regex-replace'],
  'gpa-weighted-calculator': TOOL_FIELDS['weighted-gpa-calculator'],
  'marks-average-calculator': TOOL_FIELDS['grade-average-calculator'],
  'study-plan-from-syllabus': TOOL_FIELDS['syllabus-study-planner'],
  'clean-citation-url': TOOL_FIELDS['citation-url-cleaner'],
  'query-string-parser': TOOL_FIELDS['url-query-parser'],
  'csv-to-markdown-table': TOOL_FIELDS['markdown-table-generator'],
  'extract-emails': TOOL_FIELDS['email-extractor'],
  'extract-phone-numbers': TOOL_FIELDS['phone-number-extractor'],
  'robots-generator': TOOL_FIELDS['robots-txt-generator'],
  'seo-meta-generator': TOOL_FIELDS['meta-description-generator'],
})

// ── 2026 Number Base Converter Pack ─────────────────────────────────────────
const NUM_BASE_DECIMAL = ['decimal-to-binary','decimal-to-hex','decimal-to-hexadecimal','decimal-to-octal'];
const NUM_BASE_BINARY  = ['binary-to-decimal','binary-to-hex','binary-to-hexadecimal','binary-to-octal'];
const NUM_BASE_HEX     = ['hex-to-decimal','hex-to-binary','hex-to-octal','hexadecimal-to-decimal','hexadecimal-to-binary'];
const NUM_BASE_OCTAL   = ['octal-to-decimal','octal-to-binary','octal-to-hex'];
const NUM_BASE_TEXT    = ['text-to-binary','string-to-binary','text-to-hex','string-to-hex','text-to-octal','text-to-ascii','string-to-ascii','ascii-to-binary','ascii-to-hex'];
const NUM_BASE_ASCII   = ['ascii-to-text','ascii-to-string'];
const _baseFields = (label: string, ph: string, rows = 3) => [
  { name: 'value', label, type: 'textarea' as const, placeholder: ph, rows } as unknown as ToolField,
];
for (const s of NUM_BASE_DECIMAL) TOOL_FIELDS[s] = _baseFields('Enter decimal number', '255', 2);
for (const s of NUM_BASE_BINARY)  TOOL_FIELDS[s] = _baseFields('Enter binary number',  '11111111 (or 0b11111111)', 2);
for (const s of NUM_BASE_HEX)     TOOL_FIELDS[s] = _baseFields('Enter hexadecimal number', 'FF (or 0xFF, #FF)', 2);
for (const s of NUM_BASE_OCTAL)   TOOL_FIELDS[s] = _baseFields('Enter octal number', '377 (or 0o377)', 2);
for (const s of NUM_BASE_TEXT)    TOOL_FIELDS[s] = _baseFields('Enter text', 'Hello World', 4);
for (const s of NUM_BASE_ASCII)   TOOL_FIELDS[s] = _baseFields('Enter ASCII codes (space or comma separated)', '72 101 108 108 111', 3);

// ── 2026 Unit Converter Pack — single shared "value" field for all 150+ converters ──
const UNIT_CONVERTER_SLUGS = [
  'celsius-to-fahrenheit','fahrenheit-to-celsius','celsius-to-kelvin','kelvin-to-celsius',
  'fahrenheit-to-kelvin','kelvin-to-fahrenheit','rankine-to-celsius','celsius-to-rankine',
  'cm-to-inches','inches-to-cm','mm-to-inches','inches-to-mm','m-to-feet','feet-to-m',
  'feet-to-meters','meters-to-feet','km-to-miles','miles-to-km','yards-to-meters','meters-to-yards',
  'feet-to-inches','inches-to-feet','cm-to-mm','mm-to-cm','m-to-cm','cm-to-m','km-to-m','m-to-km',
  'miles-to-feet','feet-to-miles','nautical-miles-to-km','km-to-nautical-miles',
  'kg-to-lbs','lbs-to-kg','kg-to-pounds','pounds-to-kg','g-to-oz','oz-to-g',
  'grams-to-ounces','ounces-to-grams','kg-to-g','g-to-kg','lbs-to-oz','oz-to-lbs',
  'mg-to-g','g-to-mg','tons-to-kg','kg-to-tons','stones-to-kg','kg-to-stones',
  'stones-to-pounds','pounds-to-stones',
  'liters-to-gallons','gallons-to-liters','ml-to-oz','oz-to-ml','cups-to-ml','ml-to-cups',
  'liters-to-ml','ml-to-liters','tablespoons-to-ml','teaspoons-to-ml','ml-to-tablespoons',
  'ml-to-teaspoons','pints-to-liters','liters-to-pints','quarts-to-liters','liters-to-quarts',
  'kmh-to-mph','mph-to-kmh','ms-to-kmh','kmh-to-ms','ms-to-mph','mph-to-ms',
  'knots-to-mph','mph-to-knots','knots-to-kmh','kmh-to-knots',
  'seconds-to-minutes','minutes-to-seconds','minutes-to-hours','hours-to-minutes',
  'hours-to-seconds','seconds-to-hours','hours-to-days','days-to-hours',
  'days-to-weeks','weeks-to-days','days-to-months','months-to-days','days-to-years','years-to-days',
  'weeks-to-months','months-to-weeks','milliseconds-to-seconds','seconds-to-milliseconds',
  'bytes-to-kb','kb-to-bytes','kb-to-mb','mb-to-kb','mb-to-gb','gb-to-mb','gb-to-tb','tb-to-gb',
  'tb-to-pb','pb-to-tb','bits-to-bytes','bytes-to-bits','mb-to-bytes','gb-to-bytes',
  'kbps-to-mbps','mbps-to-kbps','mbps-to-gbps','gbps-to-mbps',
  'sqft-to-sqm','sqm-to-sqft','acres-to-hectares','hectares-to-acres',
  'acres-to-sqft','sqft-to-acres','sqm-to-acres','sqkm-to-sqmiles','sqmiles-to-sqkm',
  'psi-to-bar','bar-to-psi','atm-to-psi','psi-to-atm','pa-to-psi','psi-to-pa',
  'kpa-to-psi','psi-to-kpa','bar-to-kpa','kpa-to-bar',
  'joules-to-calories','calories-to-joules','kj-to-kcal','kcal-to-kj',
  'kwh-to-joules','joules-to-kwh','btu-to-joules','joules-to-btu',
  'watts-to-hp','hp-to-watts','kw-to-hp','hp-to-kw',
  'degrees-to-radians','radians-to-degrees',
  'hz-to-khz','khz-to-hz','khz-to-mhz','mhz-to-khz','mhz-to-ghz','ghz-to-mhz',
  'mpg-to-kmpl','kmpl-to-mpg',
] as const;

const UNIT_PLACEHOLDER: Record<string, string> = {
  'celsius-to-fahrenheit': '37', 'fahrenheit-to-celsius': '98.6',
  'cm-to-inches': '170', 'inches-to-cm': '6', 'kg-to-lbs': '70', 'lbs-to-kg': '154',
  'mb-to-gb': '1024', 'gb-to-mb': '1', 'kmh-to-mph': '100', 'mph-to-kmh': '60',
  'ml-to-oz': '500', 'liters-to-gallons': '10', 'g-to-oz': '100',
};

for (const slug of UNIT_CONVERTER_SLUGS) {
  const [from] = slug.split('-to-');
  TOOL_FIELDS[slug] = [{
    name: 'value',
    label: `Enter value (${from.replace(/-/g, ' ')})`,
    type: 'text',
    placeholder: UNIT_PLACEHOLDER[slug] ?? 'e.g. 100',
    defaultValue: UNIT_PLACEHOLDER[slug] ?? '',
  }];
}

// ── New tools added from tools.txt ──────────────────────────────────────────

TOOL_FIELDS['readability-analyzer'] = [
  {
    name: 'text',
    label: 'Text to Analyze',
    type: 'textarea',
    placeholder: 'Paste your article, essay, blog post, or any text here to check readability...',
    required: true,
    rows: 10,
  },
]

TOOL_FIELDS['fitness-goal-calculator'] = [
  {
    name: 'current_weight',
    label: 'Current Weight',
    type: 'number',
    placeholder: '70',
    required: true,
    hint: 'Enter your current weight',
  },
  {
    name: 'goal_weight',
    label: 'Goal Weight',
    type: 'number',
    placeholder: '65',
    required: true,
    hint: 'Enter your target weight',
  },
  {
    name: 'weekly_loss_rate',
    label: 'Weekly Rate (kg/week)',
    type: 'number',
    placeholder: '0.5',
    hint: 'Recommended: 0.25–0.75 kg/week for healthy progress',
  },
  {
    name: 'unit',
    label: 'Unit',
    type: 'select',
    options: [
      { label: 'Kilograms (kg)', value: 'kg' },
      { label: 'Pounds (lbs)', value: 'lbs' },
    ],
  },
]

TOOL_FIELDS['formal-letter-generator'] = [
  {
    name: 'letter_type',
    label: 'Letter Type',
    type: 'select',
    options: [
      { label: 'General Formal Letter', value: 'general' },
      { label: 'Job Application Letter', value: 'job-application' },
      { label: 'Complaint Letter', value: 'complaint' },
      { label: 'Request Letter', value: 'request' },
      { label: 'Leave Application', value: 'leave' },
      { label: 'Resignation Letter', value: 'resignation' },
      { label: 'Recommendation Letter', value: 'recommendation' },
      { label: 'Internship Application', value: 'internship' },
    ],
  },
  {
    name: 'sender_name',
    label: 'Your Name',
    type: 'text',
    placeholder: 'Rahul Kumar',
    required: true,
  },
  {
    name: 'sender_address',
    label: 'Your Address',
    type: 'text',
    placeholder: '123, MG Road, Delhi – 110001',
  },
  {
    name: 'recipient_name',
    label: 'Recipient Name',
    type: 'text',
    placeholder: 'The Principal / HR Manager / Sir',
  },
  {
    name: 'recipient_designation',
    label: 'Recipient Designation',
    type: 'text',
    placeholder: 'Principal / HR Manager',
  },
  {
    name: 'recipient_organization',
    label: 'Organization / School / Company',
    type: 'text',
    placeholder: 'ABC College / XYZ Company',
  },
  {
    name: 'subject',
    label: 'Subject of Letter',
    type: 'text',
    placeholder: 'Application for Leave / Job Application for Software Engineer',
    required: true,
  },
  {
    name: 'body',
    label: 'Letter Body / Main Content',
    type: 'textarea',
    placeholder: 'Write the main content of your letter here. Explain your purpose, request, or message clearly...',
    required: true,
    rows: 8,
  },
]

TOOL_FIELDS['ideal-weight-calculator'] = TOOL_FIELDS['ideal-weight'] || [
  {
    name: 'height_cm',
    label: 'Height (cm)',
    type: 'number',
    placeholder: '170',
    required: true,
  },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ],
  },
]

TOOL_FIELDS['exercise-calories-calculator'] = [
  {
    name: 'activity',
    label: 'Exercise / Activity',
    type: 'select',
    options: [
      { label: 'Walking', value: 'walking' },
      { label: 'Running', value: 'running' },
      { label: 'Jogging', value: 'jogging' },
      { label: 'Cycling', value: 'cycling' },
      { label: 'Swimming', value: 'swimming' },
      { label: 'Yoga', value: 'yoga' },
      { label: 'Weight Training / Gym', value: 'gym' },
      { label: 'Aerobics', value: 'aerobics' },
      { label: 'Dancing', value: 'dancing' },
      { label: 'Football', value: 'football' },
      { label: 'Basketball', value: 'basketball' },
      { label: 'Badminton', value: 'badminton' },
      { label: 'Cricket', value: 'cricket' },
      { label: 'Skipping / Jump Rope', value: 'skipping' },
      { label: 'Stair Climbing', value: 'stair climbing' },
      { label: 'Zumba', value: 'zumba' },
      { label: 'CrossFit', value: 'crossfit' },
      { label: 'Elliptical', value: 'elliptical' },
    ],
  },
  {
    name: 'duration',
    label: 'Duration (minutes)',
    type: 'number',
    placeholder: '30',
    required: true,
  },
  {
    name: 'weight',
    label: 'Body Weight (kg)',
    type: 'number',
    placeholder: '70',
    required: true,
  },
]

TOOL_FIELDS['email-validator-tool'] = [
  {
    name: 'email',
    label: 'Email Address to Validate',
    type: 'text',
    placeholder: 'example@gmail.com',
    required: true,
    hint: 'Enter one or more email addresses to check validity',
  },
]

// Aliases for compress-image tools
TOOL_FIELDS['compress-image-to-10kb'] = TOOL_FIELDS['compress-image-to-5kb'] || [
  { name: 'file', label: 'Upload Image', type: 'file', required: true, accept: 'image/*' },
]
TOOL_FIELDS['compress-image-to-500kb'] = TOOL_FIELDS['compress-image-to-200kb'] || [
  { name: 'file', label: 'Upload Image', type: 'file', required: true, accept: 'image/*' },
]

// ── Fresh April 2026 batch — text/utility tool form fields ─────────────────
TOOL_FIELDS['text-shuffler'] = [
  { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste any text…' },
  {
    name: 'mode', label: 'Shuffle By', type: 'select', defaultValue: 'words',
    options: [
      { label: 'Words', value: 'words' },
      { label: 'Lines', value: 'lines' },
      { label: 'Characters', value: 'characters' },
    ],
  },
]
TOOL_FIELDS['sponge-case'] = [
  { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste text to mock-case…' },
]
TOOL_FIELDS['inverse-case'] = [
  { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste text to invert case…' },
]
TOOL_FIELDS['alternate-case'] = [
  { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste text…' },
]
TOOL_FIELDS['reverse-words'] = [
  { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste text — word order will flip per line…' },
]
TOOL_FIELDS['unicode-escape'] = [
  { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste text containing Unicode characters…' },
]
TOOL_FIELDS['unicode-unescape'] = [
  { name: 'text', label: 'Escaped Text', type: 'textarea', placeholder: 'Paste text with \\uXXXX sequences…' },
]
TOOL_FIELDS['url-slug-generator'] = [
  { name: 'text', label: 'Title or Sentence', type: 'text', placeholder: 'My Awesome Blog Post Title' },
  { name: 'separator', label: 'Separator', type: 'text', defaultValue: '-', placeholder: '-' },
  {
    name: 'case', label: 'Letter Case', type: 'select', defaultValue: 'lower',
    options: [
      { label: 'lowercase', value: 'lower' },
      { label: 'Keep Original', value: 'keep' },
    ],
  },
]
TOOL_FIELDS['emoji-counter'] = [
  { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste a caption, chat, or post 🎉…' },
]
TOOL_FIELDS['sentence-counter'] = [
  { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste a paragraph or essay…' },
]
TOOL_FIELDS['paragraph-counter'] = [
  { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste your full text…' },
]
TOOL_FIELDS['wpm-calculator'] = [
  { name: 'text', label: 'What You Typed', type: 'textarea', placeholder: 'Paste the text you typed during the test…' },
  { name: 'seconds', label: 'Seconds Taken', type: 'number', defaultValue: '60', placeholder: '60' },
]
TOOL_FIELDS['syllable-counter'] = [
  { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste words or a passage…' },
]
TOOL_FIELDS['json-escape'] = [
  { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste raw text to escape for JSON…' },
]
TOOL_FIELDS['json-unescape'] = [
  { name: 'text', label: 'Escaped JSON String', type: 'textarea', placeholder: 'Paste a JSON-escaped string (with or without surrounding quotes)…' },
]

export function getToolFields(slug: string): ToolField[] {
  return TOOL_FIELDS[slug] || []
}

