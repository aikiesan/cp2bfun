import { chromium } from 'playwright';
import fs from 'fs';
const D = new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const mode = process.argv[2] || 'png';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('file://' + D + '/deck.html', { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
if (mode === 'png') {
  fs.mkdirSync(D + '/png', { recursive: true });
  const n = await p.locator('section.slide').count();
  const only = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
  for (let i = 0; i < n; i++) { if (only && !only.includes(i + 1)) continue; await p.locator('section.slide').nth(i).screenshot({ path: `${D}/png/s${String(i + 1).padStart(2, '0')}.png` }); }
  // overflow check: elements extending past slide bounds
  const issues = await p.evaluate(() => [...document.querySelectorAll('section.slide')].map((s, i) => { const r = s.getBoundingClientRect(); const bad = [...s.querySelectorAll('*')].filter(e => { const q = e.getBoundingClientRect(); return q.width && (q.bottom > r.bottom - 46 + 1 && !e.closest('.foot') && getComputedStyle(e).position !== 'absolute' && !e.closest('[style*="position:absolute"]')); }).slice(0, 3).map(e => e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().bottom - r.top)); return [i + 1, bad]; }).filter(x => x[1].length));
  console.log(JSON.stringify(issues));
} else {
  await p.pdf({ path: process.argv[3], width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
}
await b.close();
