// One-off script: rasterize Pilar-2b brand SVG logos to PNG for contexts
// that require raster images (Open Graph image, PWA manifest icons,
// favicon). Run once, not part of the build. Requires `sharp` installed
// (see the temporary install step in the design-system migration).
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.resolve(__dirname, '../public/assets/logos');

async function run() {
  // Square avatar mark -> PWA manifest icon (512x512, transparent bg)
  await sharp(path.join(logosDir, 'cp2b-avatar-gradient.svg'))
    .resize(512, 512)
    .png()
    .toFile(path.join(logosDir, 'cp2b-avatar-512.png'));

  // Square avatar mark -> favicon-sized PNG (192x192)
  await sharp(path.join(logosDir, 'cp2b-avatar-gradient.svg'))
    .resize(192, 192)
    .png()
    .toFile(path.join(logosDir, 'cp2b-avatar-192.png'));

  // Wide horizontal logo -> Open Graph share image (1200x458, keeps ratio)
  await sharp(path.join(logosDir, 'cp2b-logo-gradient.svg'))
    .resize(1200, 458)
    .png()
    .toFile(path.join(logosDir, 'cp2b-logo-og.png'));

  console.log('Rasterized logos written to', logosDir);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
