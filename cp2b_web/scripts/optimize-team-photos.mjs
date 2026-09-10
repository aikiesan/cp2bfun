// One-off script: optimize team member photos to WebP format (~400px, quality 80)
// Run once, output committed. Requires `sharp` temporarily installed.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, '../public/assets');
const outputDir = path.join(assetsDir, 'team');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const photoSources = [
  { source: 'FOTO_BRUNA.jpg', slug: 'bruna-de-souza-moraes' },
  { source: 'FOTO_RENATA.jpg', slug: 'renata-piacentini-rodriguez' },
  { source: 'speakers/leidiane-ferronato-mariani.jpg', slug: 'leidiane-mariani' },
  { source: 'speakers/luis-alberto-follegatti-romero.jpg', slug: 'luis-alberto-follegatti-romero' },
  { source: 'FOTO_RAFAEL_EIXO_8.jpg', slug: 'rafael-de-brito-dias' },
  { source: 'FOTO_RUBENS_LAMPARELLI_EIXO_1.jpg', slug: 'rubens-augusto-camargo-lamparelli' },
  { source: 'FOTO_BARBARA.jpg', slug: 'barbara-janet-teruel-mederos' },
  { source: 'FOTO_ENELTON_EIXO_3.jpg', slug: 'enelton-fagnani' },
  { source: 'FOTO_LUANA_EIXO_3.jpg', slug: 'luana-mattos-de-oliveira-cruz' },
  { source: 'FOTO_LUCAS_TADEU_FUESS.jpg', slug: 'lucas-tadeu-fuess' },
  { source: 'FOTO_LUCIANA.jpg', slug: 'luciana-cristina-lenhari-da-silva' },
  { source: 'FOTO_LUIZ_GUSTAVO.jpg', slug: 'luiz-gustavo-antonio-de-souza' },
  { source: 'FOTO_MARCELO_CUNHA_EIXO_4.jpg', slug: 'marcelo-pereira-da-cunha' },
  { source: 'FOTO_MARIA_PAULA.jpg', slug: 'maria-paula-cardeal-volpi' },
  { source: 'FOTO_NATALIA.jpg', slug: 'natalia-molina-cetrulo' },
  { source: 'FOTO_PRISCILA.jpg', slug: 'priscila-rosseto-camiloti' },
  { source: 'speakers/denis-miranda.jpg', slug: 'denis-da-silva-miranda' },
  { source: 'FOTO_RACHEL.jpg', slug: 'rachel-biancalana-costa' },
  { source: 'FOTO_ANA_BEATRIZ.jpg', slug: 'ana-beatriz-soares-aguiar' },
];

async function run() {
  for (const { source, slug } of photoSources) {
    const inputPath = path.join(assetsDir, source);
    const outputPath = path.join(outputDir, `${slug}.webp`);

    if (!fs.existsSync(inputPath)) {
      console.error(`Missing input photo: ${inputPath}`);
      continue;
    }

    await sharp(inputPath)
      .rotate() // auto-orient based on EXIF
      .resize({
        width: 400,
        height: 400,
        fit: 'cover',
        position: 'top',
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    console.log(`Optimized: ${source} -> team/${slug}.webp (${Math.round(stats.size / 1024)} KB)`);
  }
  console.log(`\nAll ${photoSources.length} team photos successfully processed to ${outputDir}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
