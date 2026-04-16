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
  ],
  'split-pdf': [
    {
      name: 'pages',
      label: 'Pages',
      type: 'text',
      placeholder: 'all or 1,3,5',
      defaultValue: 'all',
    },
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
    { name: 'angle', label: 'Angle', type: 'number', defaultValue: '90' },
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
    { name: 'font_size', label: 'Font Size', type: 'number', defaultValue: '18' },
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
  'compress-to-15kb': [],
  'compress-to-25kb': [],
  'compress-to-30kb': [],
  'compress-to-40kb': [],
  'compress-to-150kb': [],
  'compress-to-300kb': [],
  'compress-to-2mb': [],
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

  // ── Developer Tools ─────────────────────────────────────────
  'json-formatter': [
    { name: 'text', label: 'JSON Input', type: 'textarea', placeholder: '{"name":"ishu","score":95}' },
  ],
  'xml-formatter': [
    { name: 'text', label: 'XML Input', type: 'textarea', placeholder: '<root><name>ishu</name></root>' },
  ],
  'base64-encode': [
    { name: 'text', label: 'Text to Encode', type: 'textarea', placeholder: 'Hello World' },
  ],
  'base64-decode': [
    { name: 'text', label: 'Base64 Input', type: 'textarea', placeholder: 'SGVsbG8gV29ybGQ=' },
  ],
  'url-encode': [
    { name: 'text', label: 'Text to Encode', type: 'textarea', placeholder: 'hello world & more' },
  ],
  'url-decode': [
    { name: 'text', label: 'URL-Encoded Text', type: 'textarea', placeholder: 'hello%20world%26more' },
  ],
  'html-encode': [
    { name: 'text', label: 'Text to Encode', type: 'textarea', placeholder: '<h1>Hello</h1>' },
  ],
  'html-decode': [
    { name: 'text', label: 'HTML-Encoded Text', type: 'textarea', placeholder: '&lt;h1&gt;Hello&lt;/h1&gt;' },
  ],
  'jwt-decode': [
    { name: 'text', label: 'JWT Token', type: 'textarea', placeholder: 'eyJhbGciOiJIUzI1NiJ9...' },
  ],
  'regex-tester': [
    { name: 'pattern', label: 'Regex Pattern', type: 'text', placeholder: '\\d+' },
    { name: 'text', label: 'Test Text', type: 'textarea', placeholder: 'abc 123 def 456' },
    { name: 'flags', label: 'Flags (i, m, s)', type: 'text', defaultValue: 'i' },
  ],
  'unix-timestamp': [
    { name: 'text', label: 'Timestamp or Date', type: 'text', placeholder: '1700000000 or 2024-01-15' },
  ],
  'json-to-yaml': [
    { name: 'text', label: 'JSON Input', type: 'textarea', placeholder: '{"key":"value"}' },
  ],
  'yaml-to-json': [
    { name: 'text', label: 'YAML Input', type: 'textarea', placeholder: 'key: value' },
  ],

  // ── Color Tools ─────────────────────────────────────────────
  'hex-to-rgb': [
    { name: 'text', label: 'HEX Color', type: 'text', placeholder: '#ff5733', defaultValue: '#3b82f6' },
  ],
  'rgb-to-hex': [
    { name: 'text', label: 'RGB Values', type: 'text', placeholder: '255, 87, 51' },
  ],
  'rgb-to-hsl': [
    { name: 'text', label: 'RGB Values', type: 'text', placeholder: '59, 130, 246' },
  ],
  'color-palette-generator': [
    { name: 'text', label: 'Base Color (HEX)', type: 'text', placeholder: '#3b82f6', defaultValue: '#3b82f6' },
  ],
  'gradient-generator': [
    { name: 'color1', label: 'Color 1', type: 'text', defaultValue: '#3b82f6' },
    { name: 'color2', label: 'Color 2', type: 'text', defaultValue: '#8b5cf6' },
    { name: 'angle', label: 'Angle (degrees)', type: 'number', defaultValue: '135' },
  ],
  'color-contrast-checker': [
    { name: 'text', label: 'Foreground Color', type: 'text', defaultValue: '#000000' },
    { name: 'background', label: 'Background Color', type: 'text', defaultValue: '#ffffff' },
  ],

  // ── Unit Converters ─────────────────────────────────────────
  'length-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '1' },
    {
      name: 'from_unit', label: 'From', type: 'select', defaultValue: 'm',
      options: [
        { label: 'Meters (m)', value: 'm' }, { label: 'Kilometers (km)', value: 'km' },
        { label: 'Centimeters (cm)', value: 'cm' }, { label: 'Millimeters (mm)', value: 'mm' },
        { label: 'Inches (in)', value: 'in' }, { label: 'Feet (ft)', value: 'ft' },
        { label: 'Yards (yd)', value: 'yd' }, { label: 'Miles (mi)', value: 'mi' },
      ],
    },
    {
      name: 'to_unit', label: 'To', type: 'select', defaultValue: 'ft',
      options: [
        { label: 'Meters (m)', value: 'm' }, { label: 'Kilometers (km)', value: 'km' },
        { label: 'Centimeters (cm)', value: 'cm' }, { label: 'Millimeters (mm)', value: 'mm' },
        { label: 'Inches (in)', value: 'in' }, { label: 'Feet (ft)', value: 'ft' },
        { label: 'Yards (yd)', value: 'yd' }, { label: 'Miles (mi)', value: 'mi' },
      ],
    },
  ],
  'weight-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '1' },
    {
      name: 'from_unit', label: 'From', type: 'select', defaultValue: 'kg',
      options: [
        { label: 'Grams (g)', value: 'g' }, { label: 'Kilograms (kg)', value: 'kg' },
        { label: 'Milligrams (mg)', value: 'mg' }, { label: 'Pounds (lb)', value: 'lb' },
        { label: 'Ounces (oz)', value: 'oz' }, { label: 'Metric Tons (t)', value: 't' },
      ],
    },
    {
      name: 'to_unit', label: 'To', type: 'select', defaultValue: 'lb',
      options: [
        { label: 'Grams (g)', value: 'g' }, { label: 'Kilograms (kg)', value: 'kg' },
        { label: 'Milligrams (mg)', value: 'mg' }, { label: 'Pounds (lb)', value: 'lb' },
        { label: 'Ounces (oz)', value: 'oz' }, { label: 'Metric Tons (t)', value: 't' },
      ],
    },
  ],
  'temperature-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '100' },
    {
      name: 'from_unit', label: 'From', type: 'select', defaultValue: 'c',
      options: [
        { label: 'Celsius (°C)', value: 'c' }, { label: 'Fahrenheit (°F)', value: 'f' },
        { label: 'Kelvin (K)', value: 'k' },
      ],
    },
    {
      name: 'to_unit', label: 'To', type: 'select', defaultValue: 'f',
      options: [
        { label: 'Celsius (°C)', value: 'c' }, { label: 'Fahrenheit (°F)', value: 'f' },
        { label: 'Kelvin (K)', value: 'k' },
      ],
    },
  ],
  'data-size-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '1' },
    {
      name: 'from_unit', label: 'From', type: 'select', defaultValue: 'gb',
      options: [
        { label: 'Bytes', value: 'b' }, { label: 'KB', value: 'kb' }, { label: 'MB', value: 'mb' },
        { label: 'GB', value: 'gb' }, { label: 'TB', value: 'tb' },
      ],
    },
    {
      name: 'to_unit', label: 'To', type: 'select', defaultValue: 'mb',
      options: [
        { label: 'Bytes', value: 'b' }, { label: 'KB', value: 'kb' }, { label: 'MB', value: 'mb' },
        { label: 'GB', value: 'gb' }, { label: 'TB', value: 'tb' },
      ],
    },
  ],
  'speed-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '100' },
    {
      name: 'from_unit', label: 'From', type: 'select', defaultValue: 'kmh',
      options: [
        { label: 'km/h', value: 'kmh' }, { label: 'mph', value: 'mph' },
        { label: 'm/s', value: 'ms' }, { label: 'Knots', value: 'kn' },
      ],
    },
    {
      name: 'to_unit', label: 'To', type: 'select', defaultValue: 'mph',
      options: [
        { label: 'km/h', value: 'kmh' }, { label: 'mph', value: 'mph' },
        { label: 'm/s', value: 'ms' }, { label: 'Knots', value: 'kn' },
      ],
    },
  ],
  'area-converter': [
    { name: 'value', label: 'Value', type: 'number', defaultValue: '1' },
    {
      name: 'from_unit', label: 'From', type: 'select', defaultValue: 'sqm',
      options: [
        { label: 'Square Meters', value: 'sqm' }, { label: 'Square Kilometers', value: 'sqkm' },
        { label: 'Square Feet', value: 'sqft' }, { label: 'Acres', value: 'acre' },
        { label: 'Hectares', value: 'ha' },
      ],
    },
    {
      name: 'to_unit', label: 'To', type: 'select', defaultValue: 'sqft',
      options: [
        { label: 'Square Meters', value: 'sqm' }, { label: 'Square Kilometers', value: 'sqkm' },
        { label: 'Square Feet', value: 'sqft' }, { label: 'Acres', value: 'acre' },
        { label: 'Hectares', value: 'ha' },
      ],
    },
  ],

  // ── Hash & Crypto ───────────────────────────────────────────
  'md5-hash': [
    { name: 'text', label: 'Text to Hash', type: 'textarea', placeholder: 'Enter text...' },
  ],
  'sha256-hash': [
    { name: 'text', label: 'Text to Hash', type: 'textarea', placeholder: 'Enter text...' },
  ],
  'sha512-hash': [
    { name: 'text', label: 'Text to Hash', type: 'textarea', placeholder: 'Enter text...' },
  ],
  'uuid-generator': [
    { name: 'count', label: 'Number of UUIDs', type: 'number', defaultValue: '5' },
  ],
  'password-generator': [
    { name: 'length', label: 'Password Length', type: 'number', defaultValue: '16' },
    { name: 'count', label: 'Number of Passwords', type: 'number', defaultValue: '5' },
  ],
  'lorem-ipsum-generator': [
    { name: 'paragraphs', label: 'Number of Paragraphs', type: 'number', defaultValue: '3' },
  ],
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
  'sql-formatter': [
    { name: 'text', label: 'SQL Query', type: 'textarea', placeholder: 'SELECT * FROM users WHERE id=1' },
  ],
  'markdown-to-html': [
    { name: 'text', label: 'Markdown Text', type: 'textarea', placeholder: '# Hello\n**Bold** text' },
  ],
  'html-to-markdown': [
    { name: 'text', label: 'HTML Code', type: 'textarea', placeholder: '<h1>Hello</h1><p><b>Bold</b></p>' },
  ],
  'diff-checker': [
    { name: 'text', label: 'Text 1', type: 'textarea', placeholder: 'Original text...' },
    { name: 'text2', label: 'Text 2', type: 'textarea', placeholder: 'Modified text...' },
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
  'discount-calculator': [
    { name: 'value', label: 'Original Price', type: 'number', defaultValue: '1000' },
    { name: 'total', label: 'Discount %', type: 'number', defaultValue: '20' },
  ],
  'loan-emi-calculator': [
    { name: 'value', label: 'Principal (₹)', type: 'number', defaultValue: '500000' },
    { name: 'total', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: '8.5' },
    { name: 'months', label: 'Tenure (months)', type: 'number', defaultValue: '60' },
  ],
  'tip-calculator': [
    { name: 'value', label: 'Bill Amount', type: 'number', defaultValue: '100' },
    { name: 'total', label: 'Tip %', type: 'number', defaultValue: '15' },
    { name: 'count', label: 'Number of People', type: 'number', defaultValue: '1' },
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
  'random-number-generator': [
    { name: 'value', label: 'Min', type: 'number', defaultValue: '1' },
    { name: 'total', label: 'Max', type: 'number', defaultValue: '100' },
    { name: 'count', label: 'Count', type: 'number', defaultValue: '1' },
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
  'roman-numeral-converter': [
    { name: 'text', label: 'Number or Roman Numeral', type: 'text', placeholder: '2024 or MMXXIV' },
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
  'fuel-cost-calculator': [
    { name: 'value', label: 'Distance (km)', type: 'number', defaultValue: '500' },
    { name: 'total', label: 'Mileage (km/L)', type: 'number', defaultValue: '15' },
    { name: 'price', label: 'Fuel Price (₹/L)', type: 'number', defaultValue: '100' },
  ],
  'electricity-bill-calculator': [
    { name: 'value', label: 'Units Consumed', type: 'number', defaultValue: '300' },
    { name: 'total', label: 'Rate Per Unit (₹)', type: 'number', defaultValue: '7' },
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
  'time-zone-converter': [
    { name: 'text', label: 'Time (HH:MM)', type: 'text', placeholder: '14:30' },
    {
      name: 'from_tz', label: 'From Timezone', type: 'select', defaultValue: 'IST',
      options: [
        { label: 'IST (India)', value: 'IST' }, { label: 'UTC', value: 'UTC' },
        { label: 'EST (US Eastern)', value: 'EST' }, { label: 'PST (US Pacific)', value: 'PST' },
        { label: 'GMT', value: 'GMT' }, { label: 'JST (Japan)', value: 'JST' },
        { label: 'CET (Central Europe)', value: 'CET' }, { label: 'SGT (Singapore)', value: 'SGT' },
      ],
    },
    {
      name: 'to_tz', label: 'To Timezone', type: 'select', defaultValue: 'UTC',
      options: [
        { label: 'IST (India)', value: 'IST' }, { label: 'UTC', value: 'UTC' },
        { label: 'EST (US Eastern)', value: 'EST' }, { label: 'PST (US Pacific)', value: 'PST' },
        { label: 'GMT', value: 'GMT' }, { label: 'JST (Japan)', value: 'JST' },
        { label: 'CET (Central Europe)', value: 'CET' }, { label: 'SGT (Singapore)', value: 'SGT' },
      ],
    },
  ],
  'password-strength-checker': [
    { name: 'text', label: 'Password to Check', type: 'password', placeholder: 'Enter password...' },
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
  'unit-price-calculator': [
    { name: 'value', label: 'Total Price (₹)', type: 'number', defaultValue: '250' },
    { name: 'total', label: 'Quantity', type: 'number', defaultValue: '5' },
    { name: 'unit', label: 'Unit Label', type: 'text', defaultValue: 'kg' },
  ],
  'number-to-words': [
    { name: 'text', label: 'Number', type: 'text', placeholder: '123456' },
  ],

  // ─── Developer Tools ───
  'lorem-ipsum-generator': [
    { name: 'count', label: 'Count', type: 'number', defaultValue: '5' },
    { name: 'unit', label: 'Unit', type: 'select', defaultValue: 'paragraphs', options: [
      { label: 'Paragraphs', value: 'paragraphs' },
      { label: 'Sentences', value: 'sentences' },
      { label: 'Words', value: 'words' },
    ]},
  ],
  'regex-tester': [
    { name: 'pattern', label: 'Regex Pattern', type: 'text', placeholder: '\\b\\w+@\\w+\\.\\w+\\b' },
    { name: 'text', label: 'Test Text', type: 'textarea', placeholder: 'Enter text to test against...' },
    { name: 'flags', label: 'Flags (i, m, s)', type: 'text', defaultValue: 'i' },
  ],
  'diff-checker': [
    { name: 'text1', label: 'Text 1 (Original)', type: 'textarea', placeholder: 'Paste original text...' },
    { name: 'text2', label: 'Text 2 (Modified)', type: 'textarea', placeholder: 'Paste modified text...' },
  ],
  'json-formatter': [
    { name: 'text', label: 'JSON Input', type: 'textarea', placeholder: '{"name":"ishu","tools":["pdf","image"]}' },
    { name: 'indent', label: 'Indent Spaces', type: 'number', defaultValue: '2' },
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
  'uuid-generator': [
    { name: 'count', label: 'Number of UUIDs', type: 'number', defaultValue: '5' },
  ],
  'hash-generator': [
    { name: 'text', label: 'Text to Hash', type: 'textarea', placeholder: 'Enter text to generate hashes...' },
  ],
  'jwt-decoder': [
    { name: 'text', label: 'JWT Token', type: 'textarea', placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
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
  'cron-expression-parser': [
    { name: 'text', label: 'Cron Expression', type: 'text', placeholder: '*/5 * * * *' },
  ],
  'sql-formatter': [
    { name: 'text', label: 'SQL Query', type: 'textarea', placeholder: 'SELECT * FROM users WHERE age > 18 ORDER BY name' },
  ],
  'xml-formatter': [
    { name: 'text', label: 'XML Data', type: 'textarea', placeholder: '<root><item>value</item></root>' },
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
  'color-palette-generator': [
    { name: 'text', label: 'Base Color (HEX)', type: 'text', defaultValue: '#3b82f6' },
  ],
  'rgb-to-hsl': [
    { name: 'r', label: 'Red (0-255)', type: 'number', defaultValue: '59' },
    { name: 'g', label: 'Green (0-255)', type: 'number', defaultValue: '130' },
    { name: 'b', label: 'Blue (0-255)', type: 'number', defaultValue: '246' },
  ],
  'color-contrast-checker': [
    { name: 'foreground', label: 'Foreground Color (HEX)', type: 'text', defaultValue: '#000000' },
    { name: 'background', label: 'Background Color (HEX)', type: 'text', defaultValue: '#ffffff' },
  ],
  'gradient-generator': [
    { name: 'color1', label: 'Color 1', type: 'text', defaultValue: '#667eea' },
    { name: 'color2', label: 'Color 2', type: 'text', defaultValue: '#764ba2' },
    { name: 'direction', label: 'Direction', type: 'select', defaultValue: 'to right', options: [
      { label: 'To Right', value: 'to right' },
      { label: 'To Left', value: 'to left' },
      { label: 'To Bottom', value: 'to bottom' },
      { label: 'To Top', value: 'to top' },
      { label: '45°', value: '45deg' },
      { label: '135°', value: '135deg' },
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
  'password-strength-checker': [
    { name: 'text', label: 'Password to Check', type: 'password', placeholder: 'Enter password...' },
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
  'citation-generator': [
    { name: 'title', label: 'Source Title', type: 'text', placeholder: 'Article, book, or webpage title' },
    { name: 'author', label: 'Author', type: 'text', placeholder: 'Author name' },
    { name: 'year', label: 'Year', type: 'text', placeholder: '2026' },
    { name: 'publisher', label: 'Publisher / Website', type: 'text', placeholder: 'Journal, publisher, or website' },
    { name: 'url', label: 'URL', type: 'text', placeholder: 'https://example.com/source' },
    { name: 'accessed', label: 'Accessed Date', type: 'text', placeholder: '16 Apr 2026' },
    { name: 'source_type', label: 'Source Type', type: 'select', defaultValue: 'website', options: [
      { label: 'Website', value: 'website' },
      { label: 'Book', value: 'book' },
      { label: 'Journal Article', value: 'article' },
      { label: 'Report', value: 'report' },
    ]},
    { name: 'style', label: 'Citation Style', type: 'select', defaultValue: 'apa', options: [
      { label: 'APA', value: 'apa' },
      { label: 'MLA', value: 'mla' },
      { label: 'Chicago', value: 'chicago' },
    ]},
  ],
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
  'attendance-calculator': [
    { name: 'attended', label: 'Classes Attended', type: 'number', defaultValue: '45' },
    { name: 'total', label: 'Total Classes', type: 'number', defaultValue: '60' },
    { name: 'target', label: 'Target %', type: 'number', defaultValue: '75' },
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
}

export function getToolFields(slug: string): ToolField[] {
  return TOOL_FIELDS[slug] || []
}

