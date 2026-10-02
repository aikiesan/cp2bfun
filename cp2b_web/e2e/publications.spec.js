import { test, expect } from '@playwright/test';
import { mockApi } from './support/mockApi';

test.describe('publications serve external links', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto('/publicacoes', { waitUntil: 'networkidle' });
  });

  test('renders DOI, Link and PDF anchors with correct hrefs', async ({ page }) => {
    await expect(page.getByText('Artigo sobre biogás')).toBeVisible();
    await expect(page.getByRole('link', { name: 'DOI' })).toHaveAttribute(
      'href',
      'https://doi.org/10.1234/example.doi'
    );
    await expect(page.getByRole('link', { name: 'Link', exact: true })).toHaveAttribute(
      'href',
      'https://example.com/paper'
    );
    await expect(page.getByRole('link', { name: 'PDF' })).toHaveAttribute(
      'href',
      'https://cdn.example.com/paper.pdf'
    );
  });

  test('groups publications under year headings', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '2025' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '2024' })).toBeVisible();
  });
});
