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

export const TOOL_FIELDS: Record<string, ToolField[]> = {
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
        { label: 'JPG', value: 'jpg' },
        { label: 'WEBP', value: 'webp' },
        { label: 'GIF', value: 'gif' },
        { label: 'BMP', value: 'bmp' },
      ],
    },
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
}

export function getToolFields(slug: string): ToolField[] {
  return TOOL_FIELDS[slug] || []
}
