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
