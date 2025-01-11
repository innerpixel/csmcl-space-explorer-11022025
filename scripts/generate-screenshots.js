import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const screenshots = [
  {
    name: 'desktop-home.png',
    width: 1920,
    height: 1080,
    text: 'CSMCL Space Explorer - Home'
  },
  {
    name: 'desktop-dashboard.png',
    width: 1920,
    height: 1080,
    text: 'CSMCL Space Explorer - Dashboard'
  },
  {
    name: 'mobile-home.png',
    width: 750,
    height: 1334,
    text: 'Space Explorer Mobile - Home'
  },
  {
    name: 'mobile-dashboard.png',
    width: 750,
    height: 1334,
    text: 'Space Explorer Mobile - Dashboard'
  }
];

const outputDir = path.resolve('public/static/screenshots');

async function generateScreenshot({ name, width, height, text }) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1a1a1a"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial"
        font-size="${width * 0.03}px"
        fill="#6366f1"
        text-anchor="middle"
        dominant-baseline="middle"
      >${text}</text>
    </svg>
  `;

  const outputFile = path.join(outputDir, name);
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputFile);
  console.log(`Generated ${outputFile}`);
}

async function generateScreenshots() {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Generate all screenshots
  for (const screenshot of screenshots) {
    await generateScreenshot(screenshot);
  }
}

generateScreenshots().catch(console.error);
