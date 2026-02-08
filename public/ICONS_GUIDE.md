# PWA Icons Generation Guide

Since we can't generate actual PNG files, here's how to create the required PWA icons:

## Method 1: Using Online Tools

1. **Go to**: https://www.pwabuilder.com/imageGenerator
   
2. **Upload** a 512x512 PNG logo/icon (create one with your app's branding)

3. **Download** the generated icon pack

4. **Place** all icons in the `/public` folder

## Method 2: Using ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Create a base icon first (512x512) with your design
# Then resize it to all required sizes:

convert icon-512x512.png -resize 72x72 public/icon-72x72.png
convert icon-512x512.png -resize 96x96 public/icon-96x96.png
convert icon-512x512.png -resize 128x128 public/icon-128x128.png
convert icon-512x512.png -resize 144x144 public/icon-144x144.png
convert icon-512x512.png -resize 152x152 public/icon-152x152.png
convert icon-512x512.png -resize 192x192 public/icon-192x192.png
convert icon-512x512.png -resize 384x384 public/icon-384x384.png
```

## Method 3: Using Figma/Canva

1. Create a 512x512 canvas
2. Design your app icon with:
   - Purple/Blue gradient background
   - Wallet or money icon
   - "ET" text
3. Export as PNG at different sizes

## Temporary Placeholder

For now, you can use a placeholder:

1. Go to https://placeholder.com/
2. Generate colored squares of each size
3. Or use this online tool: https://realfavicongenerator.net/

## Required Sizes

- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Icon Design Tips

- Use simple, recognizable symbols
- Ensure it works at small sizes
- Use your brand colors (purple #8b5cf6)
- Add subtle shadows for depth
- Test on both light and dark backgrounds
