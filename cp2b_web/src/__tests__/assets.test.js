/**
 * Asset-existence guard.
 *
 * Images/news/publication thumbnails are served as plain "/assets/..." string
 * paths from public/assets/. A typo or a deleted file breaks the image
 * silently (especially CSS background-image). This test scans the source for
 * static /assets/ references and asserts each referenced file exists on disk,
 * so broken paths fail the build instead of shipping a broken image.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(here, '..');
const assetsDir = path.resolve(here, '../../public/assets');

// Match a static /assets/... path. The character class stops at quotes,
// backticks, parens, whitespace and `$`, so template-literal interpolations
// (e.g. /assets/speakers/${x}.jpg) terminate at the `$` and are discarded below.
const ASSET_REF = /\/assets\/[^"'`)\s$]+/g;

function collectSourceFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '__tests__' || entry.name === 'test') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(full, acc);
    } else if (/\.(jsx?|css)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function collectAssetRefs() {
  const refs = new Set();
  for (const file of collectSourceFiles(srcDir)) {
    const text = fs.readFileSync(file, 'utf8');
    const matches = text.match(ASSET_REF) || [];
    for (const m of matches) {
      // Skip directory-only matches left behind by dynamic interpolation.
      if (m.endsWith('/')) continue;
      // Skip anything without a file extension (dynamic / partial paths).
      if (!path.extname(m)) continue;
      refs.add(m);
    }
  }
  return [...refs].sort();
}

const assetRefs = collectAssetRefs();

describe('Static /assets references resolve to real files', () => {
  it('finds asset references to verify', () => {
    expect(assetRefs.length).toBeGreaterThan(0);
  });

  it.each(assetRefs)('exists on disk: %s', (ref) => {
    const filePath = path.join(assetsDir, ref.replace(/^\/assets\//, ''));
    expect(fs.existsSync(filePath), `Missing asset file for reference "${ref}"`).toBe(true);
  });
});
