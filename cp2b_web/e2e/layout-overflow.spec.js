import { test, expect } from '@playwright/test';
import { mockApi } from './support/mockApi';

// Defect #3: the page must not scroll horizontally on mobile. (Off-screen
// framer-motion entrance animations translate sections sideways, so we assert
// the user-facing symptom — the viewport can't be scrolled on the X axis —
// rather than scanning element rects, which transforms make flaky.)
const routes = ['/', '/noticias', '/publicacoes', '/sobre', '/equipe', '/contato', '/eixos', '/solucoes', '/capacitacao'];

// Percorre a página até o fim para disparar as animações whileInView, cujo
// deslocamento inicial alargaria a página enquanto a seção não entra na tela.
const scrollThrough = (page) => page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.75);
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo({ top: y, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
});

test.describe('no horizontal overflow (mobile)', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile-only check');

  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  for (const path of routes) {
    test(`page does not scroll horizontally on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });

      const scrolledX = await page.evaluate(() => {
        window.scrollTo(9999, 0);
        return window.scrollX;
      });

      expect(scrolledX, `page scrolled horizontally by ${scrolledX}px on ${path}`).toBe(0);
    });

    // O html e o body têm overflow-x: hidden, então o teste acima passa mesmo
    // com conteúdo mais largo que a tela — ele só é cortado. Aqui o corte sai
    // de cena e a largura real do conteúdo tem de caber no viewport: é o que
    // pegaria, por exemplo, uma Row g-5 (calha maior que o padding do
    // container) ou uma coluna de grid que não encolhe abaixo da palavra mais
    // longa.
    test(`content fits the viewport width on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      await scrollThrough(page);
      await page.waitForTimeout(800);

      const { contentWidth, viewportWidth } = await page.evaluate(() => {
        const html = document.documentElement;
        const { body } = document;
        html.style.overflowX = 'visible';
        body.style.overflowX = 'visible';
        return {
          contentWidth: Math.max(html.scrollWidth, body.scrollWidth),
          viewportWidth: html.clientWidth,
        };
      });

      expect(contentWidth, `content is ${contentWidth}px wide on a ${viewportWidth}px screen at ${path}`)
        .toBeLessThanOrEqual(viewportWidth);
    });
  }
});
