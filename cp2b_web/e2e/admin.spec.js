import { test, expect } from '@playwright/test';
import { mockApi } from './support/mockApi';

// The admin shell: login gate, dashboard quick actions and the help guide.
// Registered after mockApi so these routes take precedence (Playwright checks
// routes in reverse registration order).
const mockAuth = async (page, { required }) => {
  await page.route('**/api/auth/status', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ required }) })
  );
  await page.route('**/api/auth/login', (route) => {
    const body = route.request().postDataJSON();
    if (body?.password === 'senha-de-teste') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: `${Date.now() + 60000}.test-token-signature`, expires_at: Date.now() + 60000 }),
      });
    }
    return route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Incorrect password' }),
    });
  });
};

test.describe('admin panel', () => {
  test.beforeEach(async ({ page }) => {
    // Pre-dismiss the cookie banner: on mobile it overlaps the login button.
    await page.addInitScript(() => {
      localStorage.setItem('cp2b-cookie-consent', JSON.stringify({ essential: true, analytics: false }));
    });
    await mockApi(page);
  });

  test('shows the login screen when the backend requires auth', async ({ page }) => {
    await mockAuth(page, { required: true });
    await page.goto('/admin');

    await expect(page.getByRole('heading', { name: 'Painel Administrativo' })).toBeVisible();

    // Wrong password → API error surfaces
    await page.getByLabel('Senha').fill('senha-de-teste-errada');
    await page.getByRole('button', { name: /Entrar/ }).click();
    await expect(page.getByText('Incorrect password')).toBeVisible();

    // Correct password → dashboard
    await page.getByLabel('Senha').fill('senha-de-teste');
    await page.getByRole('button', { name: /Entrar/ }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('skips the login screen when auth is disabled', async ({ page }) => {
    await mockAuth(page, { required: false });
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Ações Rápidas')).toBeVisible();
  });

  test('dashboard quick actions link to the editors', async ({ page }) => {
    await mockAuth(page, { required: false });
    await page.goto('/admin');
    await page.getByRole('link', { name: /Novo Evento/ }).click();
    await expect(page).toHaveURL(/\/admin\/events\/new$/);
    await expect(page.getByRole('heading', { name: 'Novo Evento' })).toBeVisible();
  });

  test('help guide renders for non-technical staff', async ({ page }) => {
    await mockAuth(page, { required: false });
    await page.goto('/admin/ajuda');
    await expect(page.getByRole('heading', { name: 'Guia de Uso do Painel' })).toBeVisible();
    await expect(page.getByText('Regra de ouro')).toBeVisible();

    // Sections expand
    await page.getByRole('button', { name: /Criar um evento/ }).click();
    await expect(page.getByText(/Álbuns da Galeria vinculados/)).toBeVisible();
  });

  test('events admin list renders empty state and editor form', async ({ page }) => {
    await mockAuth(page, { required: false });
    await page.goto('/admin/events');
    await expect(page.getByText('Nenhum evento cadastrado')).toBeVisible();

    await page.goto('/admin/events/new');
    await expect(page.getByLabel('Título (PT) *')).toBeVisible();
    // Auto-slug from the PT title
    await page.getByLabel('Título (PT) *').fill('Fórum Paulista de Biogás 2027');
    await expect(page.getByPlaceholder('forum-paulista-2026')).toHaveValue('forum-paulista-de-biogas-2027');
  });
});
