// Script pontual: recomprime as imagens grandes de public/assets no lugar.
// Rodado uma vez, saída commitada. Requer `sharp` instalado temporariamente
// (npm install --no-save sharp), como o optimize-team-photos.mjs.
//
// Por que no lugar, mantendo nome e formato: quatro destes arquivos são
// referenciados pelas migrações do banco (e portanto por conteúdo criado no
// admin). Trocar o nome ou a extensão quebraria essas referências em runtime,
// onde nem o assets.test.js nem o build avisariam.
//
// Os alvos foram escolhidos comparando a resolução do arquivo com o tamanho em
// que ele aparece na tela. Ex.: gas-1.jpg tinha 6,6 MB e serve de thumbnail de
// card; apoio-patrocinio.png tinha 5760x3240 para uma faixa de logos.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/assets');

const targets = [
  // arquivo, largura máxima, motivo
  { file: 'gas-1.jpg', width: 1600, note: 'thumbnail de card / imagem de apoio' },
  { file: 'apoio-patrocinio.png', width: 1600, note: 'faixa de logos de patrocínio' },
  { file: 'partners/escola-politecnica-epusp.jpg', width: 600, note: 'logo de parceiro em carrossel' },
  { file: '20250618_Cepid_LUC_6420_Capa-1.jpg', width: 1035, note: 'capa de notícia' },
  { file: 'DSC00361-1920x748.jpg', width: 1920, note: 'banner' },
  { file: 'biogas-2919235_1280.jpg', width: 1280, note: 'imagem de apoio' },
  { file: 'DSC00617-1024x683.jpg', width: 1024, note: 'imagem de apoio' },
  { file: 'DSC00339-500x333.jpg', width: 500, note: 'thumbnail' },
];

const kb = (n) => (n / 1024).toFixed(0).padStart(5);

async function run() {
  let before = 0;
  let after = 0;

  for (const { file, width, note } of targets) {
    const full = path.join(assetsDir, file);
    if (!fs.existsSync(full)) {
      console.error(`ausente: ${file}`);
      continue;
    }

    const sizeBefore = fs.statSync(full).size;
    const meta = await sharp(full).metadata();

    // Nunca amplia: se o arquivo já é menor que o alvo, só recomprime.
    const pipeline = sharp(full).resize({
      width: Math.min(width, meta.width),
      withoutEnlargement: true,
    });

    // Mantém o formato de origem — o nome do arquivo é uma referência pública.
    const encoded =
      meta.format === 'png'
        ? await pipeline.png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
        : await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();

    // Só grava se realmente diminuiu.
    if (encoded.length < sizeBefore) {
      fs.writeFileSync(full, encoded);
    }

    const sizeAfter = fs.statSync(full).size;
    before += sizeBefore;
    after += sizeAfter;
    const pct = (100 * (1 - sizeAfter / sizeBefore)).toFixed(0);
    console.log(`${kb(sizeBefore)}KB -> ${kb(sizeAfter)}KB  (-${pct.padStart(2)}%)  ${file}  [${note}]`);
  }

  console.log(
    `\ntotal: ${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB ` +
      `(-${(100 * (1 - after / before)).toFixed(0)}%)`
  );
}

run();
