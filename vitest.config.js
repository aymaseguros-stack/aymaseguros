import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Configuración de Vitest para testing unitario
 * @see https://vitest.dev/config/
 */
export default defineConfig({
  /* Necesario para los tests que renderizan componentes JSX */
  plugins: [react()],

  test: {
    /* Entorno de testing */
    environment: 'happy-dom',

    /* Los componentes traen iframes (mapa): que happy-dom no salga a la red */
    environmentOptions: {
      happyDOM: {
        settings: {
          disableIframePageLoading: true,
          disableJavaScriptFileLoading: true,
          disableCSSFileLoading: true,
        },
      },
    },

    /* Globals (describe, it, expect disponibles sin import) */
    globals: true,

    /* Setup files */
    setupFiles: ['./tests/setup.js'],

    /* Cobertura */
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'test-results/',
        '*.config.js',
        'playwright-report/',
        '.github/'
      ],
      include: [
        'tests/unit/**/*.test.js'
      ],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70
    },

    /* Incluir archivos de test */
    include: ['tests/unit/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],

    /* Excluir archivos */
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache'
    ],

    /* Timeout */
    testTimeout: 10000,
    hookTimeout: 10000,

    /* Reporter */
    reporters: ['verbose'],

    /* Mock reset */
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
});
