/**
 * Rasteriza os logos SVG da marca para PNG, nos contextos que exigem imagem
 * raster: ícone do PWA, favicon e imagem de Open Graph.
 *
 * Roda sob demanda, não faz parte do build. Use após qualquer alteração nos
 * SVGs de `public/assets/logos`:
 *
 *     node scripts/rasterize-logos.mjs
 *
 * Usa Playwright (já presente para os testes e2e) em vez de `sharp`, que não
 * está instalado e exigia um passo de instalação avulso. O motivo real de
 * preferir um navegador aqui é fidelidade: estes SVGs usam `linearGradient`
 * com `gradientTransform`, e um rasterizador parcial descarta o que não
 * entende — foi assim que os PNGs anteriores saíram inteiramente pretos.
 */
import path from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.resolve(__dirname, '../public/assets/logos');
const publicDir = path.resolve(__dirname, '../public');

// width/height são o tamanho final do PNG. `background` nulo mantém a
// transparência (ícones); uma cor produz uma arte fechada (Open Graph, que
// não pode depender do fundo de cada rede social).
const TARGETS = [
  { svg: 'cp2b-avatar-gradient.svg', out: path.join(logosDir, 'cp2b-avatar-512.png'), width: 512, height: 512, background: null },
  { svg: 'cp2b-avatar-gradient.svg', out: path.join(logosDir, 'cp2b-avatar-192.png'), width: 192, height: 192, background: null },
  { svg: 'cp2b-avatar-gradient.svg', out: path.join(publicDir, 'favicon.png'), width: 512, height: 512, background: null },
  { svg: 'cp2b-logo-gradient.svg', out: path.join(logosDir, 'cp2b-logo-og.png'), width: 1200, height: 630, background: '#ffffff', pad: 120 },
];

// O SVG é embutido no HTML em vez de referenciado por <img src="file://...">:
// a página criada por setContent tem origem about:blank e o Chromium recusa
// sub-recursos file:// a partir dela — o resultado era um ícone de imagem
// quebrada no lugar do logo.
const page_html = ({ svgMarkup, width, height, background, pad = 0 }) => `
<style>
  html, body { margin: 0; padding: 0; }
  body {
    width: ${width}px; height: ${height}px;
    display: flex; align-items: center; justify-content: center;
    ${background ? `background: ${background};` : ''}
    box-sizing: border-box; padding: ${pad}px;
  }
  svg { max-width: 100%; max-height: 100%; height: auto; display: block; }
</style>
${svgMarkup}
`;

async function run() {
  const browser = await chromium.launch();
  try {
    for (const t of TARGETS) {
      const page = await browser.newPage({
        viewport: { width: t.width, height: t.height },
        deviceScaleFactor: 1,
      });
      const svgMarkup = await readFile(path.join(logosDir, t.svg), 'utf8');
      await page.setContent(page_html({ ...t, svgMarkup }));
      await page.screenshot({ path: t.out, omitBackground: !t.background });
      await page.close();
      console.log(`  ${t.svg} -> ${path.basename(t.out)} (${t.width}x${t.height})`);
    }
  } finally {
    await browser.close();
  }
  console.log('Rasterização concluída.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
