import { test, expect } from '@playwright/test';

/**
 * Post-deploy smoke suite — runs against a LIVE deployment, no mocks.
 *
 *   SMOKE_URL=https://cp2b.unicamp.br npm run smoke
 *
 * Verifies the things a VM deploy can silently break: the SPA boots, the
 * backend answers through the Apache proxy, prerendered SEO shells are being
 * served, and the sitemap/robots exist. Safe to run at any time: it performs
 * no writes.
 */

const BASE = process.env.SMOKE_URL;

test.describe('production smoke', () => {
  test.skip(!BASE, 'Set SMOKE_URL to run the production smoke suite');

  test('homepage boots and renders the header', async ({ page }) => {
    await page.goto(BASE + '/');
    await expect(page.locator('.navbar-brand img')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('backend API answers through the proxy', async ({ request }) => {
    const res = await request.get(BASE + '/api/health');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
  });

  test('prerendered SEO shell is served for /sobre', async ({ request }) => {
    const res = await request.get(BASE + '/sobre');
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('<title>Sobre o CP2b</title>');
    expect(html).toContain('rel="canonical"');
  });

  test('sitemap and robots are published', async ({ request }) => {
    const sitemap = await request.get(BASE + '/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain('<urlset');

    const robots = await request.get(BASE + '/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('Sitemap:');
  });

  test('key public pages respond', async ({ request }) => {
    for (const path of ['/eventos', '/galeria', '/noticias', '/publicacoes', '/equipe', '/contato']) {
      const res = await request.get(BASE + path);
      expect(res.status(), `${path} should return 200`).toBe(200);
    }
  });

  test('events API feeds the public agenda', async ({ request }) => {
    const res = await request.get(BASE + '/api/events');
    expect(res.status()).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });

  test('admin panel is reachable (and gated when auth is on)', async ({ page, request }) => {
    const status = await request.get(BASE + '/api/auth/status');
    expect(status.status()).toBe(200);
    const { required } = await status.json();

    await page.goto(BASE + '/admin');
    if (required) {
      await expect(page.getByRole('heading', { name: 'Painel Administrativo' })).toBeVisible();
    } else {
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    }
  });

  test('admin writes are rejected without a token when auth is on', async ({ request }) => {
    const status = await (await request.get(BASE + '/api/auth/status')).json();
    test.skip(!status.required, 'ADMIN_PASSWORD not set on this deployment');
    const res = await request.post(BASE + '/api/news', { data: { title_pt: 'smoke' } });
    expect(res.status()).toBe(401);
  });
});
