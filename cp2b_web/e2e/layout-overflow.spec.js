import { test, expect } from '@playwright/test';
import { mockApi } from './support/mockApi';

// Defect #3: the page must not scroll horizontally on mobile. (Off-screen
// framer-motion entrance animations translate sections sideways, so we assert
// the user-facing symptom — the viewport can't be scrolled on the X axis —
// rather than scanning element rects, which transforms make flaky.)
const routes = ['/', '/noticias', '/publicacoes', '/sobre', '/equipe', '/contato'];

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
  }
});
