import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const sizes = [
  16, // favicon
  32, // favicon
  72, // PWA
  96, // PWA
  128, // PWA
  144, // PWA
  152, // PWA
  180, // Apple touch icon
  192, // PWA
  384, // PWA
  512  // PWA
];

const maskableSizes = [192, 512]; // Sizes for maskable icons

const sourceFile = path.resolve('src/assets/icons/source/space-explorer.svg');
const faviconSourceFile = path.resolve('src/assets/icons/source/favicon.svg');
const outputDir = path.resolve('public/static/icons');

async function generateIcons() {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Generate regular PNG files for each size
  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(sourceFile)
      .resize(size, size)
      .png()
      .toFile(outputFile);
    console.log(`Generated ${outputFile}`);
  }

  // Generate maskable icons with safe area (add 10% padding)
  for (const size of maskableSizes) {
    const paddedSize = Math.floor(size * 1.1); // 10% larger for safe area
    const padding = Math.floor((paddedSize - size) / 2);
    
    const outputFile = path.join(outputDir, `icon-${size}x${size}-maskable.png`);
    await sharp(sourceFile)
      .resize(size, size) // Resize original icon
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 26, g: 26, b: 26, alpha: 1 } // #1a1a1a background
      })
      .png()
      .toFile(outputFile);
    console.log(`Generated maskable icon ${outputFile}`);
  }

  // Generate special named files using the favicon source
  const specialFiles = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' }
  ];

  for (const { size, name } of specialFiles) {
    const outputFile = path.join(outputDir, name);
    await sharp(faviconSourceFile)
      .resize(size, size)
      .png()
      .toFile(outputFile);
    console.log(`Generated ${outputFile}`);
  }

  // Copy the favicon SVG
  await fs.copyFile(faviconSourceFile, path.join(outputDir, 'favicon.svg'));
  console.log('Copied favicon.svg');

  // Generate other special files using the main icon source
  const otherSpecialFiles = [
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 96, name: 'dashboard-96x96.png' },
    { size: 96, name: 'profile-96x96.png' }
  ];

  for (const { size, name } of otherSpecialFiles) {
    const outputFile = path.join(outputDir, name);
    await sharp(sourceFile)
      .resize(size, size)
      .png()
      .toFile(outputFile);
    console.log(`Generated ${outputFile}`);
  }

  // Generate favicon.ico (multi-size)
  const faviconFile = path.join(outputDir, 'favicon.ico');
  const favicon = sharp(faviconSourceFile).resize(32, 32);
  await favicon
    .toFormat('png')
    .toFile(faviconFile.replace('.ico', '.png'));
  console.log(`Generated ${faviconFile} (as PNG)`);
}

generateIcons().catch(console.error);
