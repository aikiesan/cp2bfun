import { test, expect } from '@playwright/test';
import { mockApi } from './support/mockApi';

test.describe('language switch', () => {
  test('toggles pt/en and persists across reload', async ({ page }) => {
    await mockApi(page);
    await page.goto('/', { waitUntil: 'networkidle' });

    // Default is Portuguese.
    await expect(page.getByText('Parceiros e Apoiadores')).toBeVisible();

    await page.locator('button[title="English"]').click();
    await expect(page.getByText('Partners and Supporters')).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('cp2b_lang'))).toBe('en');

    // Persists after reload.
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByText('Partners and Supporters')).toBeVisible();
  });
});
