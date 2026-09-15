import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const baseURL = `http://localhost:${PORT}`;

// When SMOKE_URL is set the suite targets a live deployment: no local build,
// no web server, only the smoke project (npm run smoke).
const isSmoke = Boolean(process.env.SMOKE_URL);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL: isSmoke ? process.env.SMOKE_URL : baseURL,
    trace: 'on-first-retry',
    // Sem isto o service worker do PWA rouba as requisições do mock.
    //
    // O build gera um sw.js com regra NetworkFirst para /api/ (cache
    // "api-cache", ver vite.config.js). O page.route do Playwright não
    // intercepta requisição originada de service worker: assim que o SW assume
    // o controle da página, /api/team vai para a rede de verdade, o vite
    // preview responde não-2xx e a página loga "Error fetching team" — falha
    // que nada tem a ver com o que o teste quer verificar.
    //
    // Antes ficava latente porque as páginas vinham no chunk de entrada e
    // buscavam a API cedo demais para o SW alcançar. Com um chunk por rota a
    // busca acontece depois de baixar o chunk da página, e a corrida passou a
    // ser perdida de vez em quando no CI — /equipe é a que mais sofre, por ser
    // o maior chunk de página.
    //
    // Bloquear é o que o conjunto já assume: nenhum teste exercita o SW, e o
    // smoke.spec.js filtra sw.js/workbox do console como ruído.
    serviceWorkers: 'block',
  },
  projects: isSmoke
    ? [
        {
          name: 'prod-smoke',
          testMatch: /smoke-prod\.spec\.js/,
          use: { ...devices['Desktop Chrome'] },
        },
      ]
    : [
        {
          name: 'desktop-chromium',
          testIgnore: /smoke-prod\.spec\.js/,
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'mobile',
          testIgnore: /smoke-prod\.spec\.js/,
          use: { ...devices['Pixel 5'] },
        },
      ],
  webServer: isSmoke
    ? undefined
    : {
        command: 'npm run build && npx vite preview --port 4173 --strictPort',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
