import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para testing E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',

  /* Configuración de tests paralelos */
  fullyParallel: true,

  /* Fallar si se dejaron tests con .only */
  forbidOnly: !!process.env.CI,

  /* Reintentos en CI */
  retries: process.env.CI ? 2 : 0,

  /* Workers paralelos */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter */
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],

  /* Configuración compartida para todos los proyectos */
  use: {
    /* Base URL */
    baseURL: 'http://localhost:8080',

    /* Captura en fallo */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    /* Timeout por acción */
    actionTimeout: 10000,
  },

  /* Configurar servidor local */
  webServer: {
    command: 'npx http-server -p 8080',
    port: 8080,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  /* Proyectos de testing - diferentes navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Testing mobile */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Testing tablet */
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],
});
