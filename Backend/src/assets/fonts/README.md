# Custom Fonts Directory

This directory is for custom font files used in PDF generation.

## Required Fonts

To use the custom fonts in PDF reports, place the following font files in this directory:

1. **Akira Expanded** (for headings)
   - File name: `Akira-Expanded.otf` or `Akira-Expanded.ttf`
   - Used for: Section headings in red color

2. **Jones** (for body text)
   - File name: `Jones.otf` or `Jones.ttf`
   - Used for: All body text and content

## Font Sources

You can obtain these fonts from:
- Google Fonts
- Adobe Fonts
- Font licensing websites

## Note

If the font files are not found, the PDF generator will automatically fall back to:
- **Helvetica-Bold** for headings
- **Helvetica** for body text

The PDF will still be generated successfully with professional styling using the fallback fonts.

