import { test, expect } from '@playwright/test';
import { mockApi } from './support/mockApi';

test.describe('home serves images and featured content', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  // O mock só marca o destaque A: as vagas B e C ficam com as duas notícias
  // mais recentes (sem caixa vazia), e a lista de notícias mostra só o que
  // não está nos destaques — a terceira.
  test('fills the empty highlight slots with the latest news', async ({ page }) => {
    const highlights = page.locator('.featured-news-section');
    await expect(highlights.getByRole('heading', { name: 'Primeira notícia de teste' })).toBeVisible();
    await expect(highlights.getByRole('heading', { name: 'Segunda notícia de teste' })).toBeVisible();
    await expect(highlights.locator('img.featured-image-bg[src="/assets/DSC00339-500x333.jpg"]')).toHaveCount(1);
    await expect(highlights.locator('img.featured-image-bg[src="/assets/biogas-2919235_1280.jpg"]')).toHaveCount(1);
  });

  test('lists only the news that are not already highlighted', async ({ page }) => {
    await expect(page.getByAltText('Terceira notícia de teste')).toHaveAttribute(
      'src',
      '/assets/CP2B-AVATAR-BR@8x.png'
    );
    await expect(page.getByAltText('Primeira notícia de teste')).toHaveCount(0);
    await expect(page.getByAltText('Segunda notícia de teste')).toHaveCount(0);
  });

  test('renders the featured headline with its image', async ({ page }) => {
    const headline = page.locator('.featured-headline-large');
    await expect(headline).toBeVisible();
    const img = headline.locator('img.featured-image-bg');
    await expect(img).toHaveAttribute('src', '/assets/DSC00361-1920x748.jpg');
    await expect(page.getByRole('heading', { name: 'Destaque principal' })).toBeVisible();
  });

  test('serves the static partners image', async ({ page }) => {
    await expect(page.getByAltText('Partners')).toHaveAttribute('src', '/assets/parceiros.png');
  });
});
