// Génère public/og-image.png à partir de public/og-image.svg
// Usage : node scripts/generate-og.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(resolve(root, 'public/og-image.svg'));

await sharp(svg, { density: 160 })
  .resize(1200, 630, { fit: 'fill' })
  .png()
  .toFile(resolve(root, 'public/og-image.png'));

console.log('✓ public/og-image.png généré (1200×630)');
