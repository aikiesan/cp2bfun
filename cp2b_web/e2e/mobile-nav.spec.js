import { test, expect } from '@playwright/test';
import { mockApi } from './support/mockApi';

// Defect #1 regression: the mobile hamburger menu must close after navigating.
test.describe('mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile-only behavior');

  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
  });

  test('hamburger opens the menu and closes it after tapping a link', async ({ page }) => {
    const toggler = page.locator('.navbar-toggler');
    const collapse = page.locator('#basic-navbar-nav');

    await expect(toggler).toBeVisible();
    await toggler.click();
    await expect(collapse).toHaveClass(/show/);

    // Tap a top-level nav link (scoped to the navbar: the footer also links to /publicacoes).
    await collapse.getByRole('link', { name: /Publica/i }).click();
    await expect(page).toHaveURL(/\/publicacoes$/);

    // The menu must collapse on navigation (was the bug).
    await expect(collapse).not.toHaveClass(/show/);
  });

  test('a dropdown opens and its items navigate', async ({ page }) => {
    await page.locator('.navbar-toggler').click();
    await page.locator('#nav-dropdown-about').click();
    // Scoped to the navbar collapse: the footer also links to /equipe.
    await page.locator('#basic-navbar-nav').getByRole('link', { name: /Equipe|Team/i }).click();
    await expect(page).toHaveURL(/\/equipe$/);
    await expect(page.locator('#basic-navbar-nav')).not.toHaveClass(/show/);
  });
});
