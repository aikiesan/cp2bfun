import { test, expect } from '@playwright/test';
import { mockApi } from './support/mockApi';

test.describe('home serves images and featured content', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('renders the three latest news images', async ({ page }) => {
    await expect(page.getByAltText('Primeira notícia de teste')).toHaveAttribute(
      'src',
      '/assets/DSC00339-500x333.jpg'
    );
    await expect(page.getByAltText('Segunda notícia de teste')).toHaveAttribute(
      'src',
      '/assets/biogas-2919235_1280.jpg'
    );
    await expect(page.getByAltText('Terceira notícia de teste')).toHaveAttribute(
      'src',
      '/assets/CP2B-AVATAR-BR@8x.png'
    );
  });

  test('renders the featured headline with its background image', async ({ page }) => {
    const headline = page.locator('.featured-headline-large');
    await expect(headline).toBeVisible();
    const bg = await headline.evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(bg).toContain('/assets/DSC00361-1920x748.jpg');
    await expect(page.getByRole('heading', { name: 'Destaque principal' })).toBeVisible();
  });

  test('serves the static partners image', async ({ page }) => {
    await expect(page.getByAltText('Partners')).toHaveAttribute('src', '/assets/parceiros.png');
  });
});
