import { test, expect } from '@playwright/test';
import { mockApi } from './support/mockApi';

const routes = [
  ['/', /Biog|CP2b|Notícias|News/i],
  ['/sobre', /.+/],
  ['/eixos', /.+/],
  ['/equipe', /.+/],
  ['/noticias', /Notícias|News Agency|Agencia/i],
  ['/publicacoes', /Publica|Publications/i],
  ['/oportunidades', /.+/],
  ['/contato', /.+/],
  ['/galeria', /.+/],
  ['/forum-paulista', /.+/],
  ['/rota-inexistente-404', /.+/],
];

test.describe('public routes load with mocked API', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  for (const [path] of routes) {
    test(`renders ${path} without console errors`, async ({ page }) => {
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(err.message));

      await page.goto(path, { waitUntil: 'networkidle' });

      // Root mounted and some visible content.
      await expect(page.locator('#root')).toBeVisible();
      await expect(page.locator('body')).not.toBeEmpty();

      // No uncaught page errors (filter noisy 3rd-party/network warnings).
      const fatal = errors.filter(
        (e) => !/Failed to load resource|favicon|flagcdn|manifest|sw\.js|workbox/i.test(e)
      );
      expect(fatal, `console errors on ${path}:\n${fatal.join('\n')}`).toEqual([]);
    });
  }
});
