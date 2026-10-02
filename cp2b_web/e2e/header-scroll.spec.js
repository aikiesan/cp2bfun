import { test, expect } from '@playwright/test';
import { mockApi } from './support/mockApi';

// Defect #2: on mobile the shrunk navbar must stay in flow (sticky), not become
// position:fixed, which would drop it out of flow and cover page content.
test.describe('header on scroll (mobile)', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile-only behavior');

  test('navbar stays sticky (not fixed) after scrolling past the shrink threshold', async ({ page }) => {
    await mockApi(page);
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.evaluate(() => window.scrollTo(0, 400));
    // Allow the scroll listener + class toggle to apply.
    await page.waitForTimeout(300);

    const navbar = page.locator('.navbar').first();
    const position = await navbar.evaluate((el) => getComputedStyle(el).position);
    expect(position).not.toBe('fixed');
  });
});
