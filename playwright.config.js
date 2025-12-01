import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para testing E2E
 * Optimizada para máxima performance y paralelización
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

  /* Workers paralelos - optimizado para performance */
  workers: process.env.CI ? 4 : undefined,

  /* Reporter con métricas detalladas */
  reporter: [
    ['html', { outputFolder: 'test-results/html', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
    ...(process.env.CI ? [['github']] : [])  // GitHub Actions annotations
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

    /* Configuración de navegación */
    navigationTimeout: 30000,

    /* Locale */
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
  },

  /* Timeout global */
  timeout: 60000,

  /* Expect timeout */
  expect: {
    timeout: 5000,
  },

  /* Configurar servidor local */
  webServer: {
    command: 'npx http-server -p 8080 -c-1',
    port: 8080,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  /* Proyectos de testing - diferentes navegadores */
  projects: [
    /* Desktop Browsers */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
          ]
        }
      },
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
      use: {
        ...devices['Pixel 5'],
        isMobile: true,
      },
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        isMobile: true,
      },
    },

    /* Testing tablet */
    {
      name: 'iPad',
      use: {
        ...devices['iPad Pro'],
        hasTouch: true,
      },
    },
  ],

  /* Configuración de outputFolder */
  outputDir: 'test-results/',
});
