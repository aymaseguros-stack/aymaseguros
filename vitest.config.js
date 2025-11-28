import { defineConfig } from 'vitest/config';

/**
 * Configuración de Vitest para testing unitario
 * @see https://vitest.dev/config/
 */
export default defineConfig({
  test: {
    /* Entorno de testing */
    environment: 'happy-dom',

    /* Globals (describe, it, expect disponibles sin import) */
    globals: true,

    /* Setup files */
    setupFiles: ['./tests/setup.js'],

    /* Cobertura */
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'text-summary'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        'test-results/',
        '*.config.js',
        'playwright-report/',
        '.github/',
        'scripts/',
        'coverage/',
        '**/*.spec.js',
        '**/*.test.js'
      ],
      include: [
        'tests/unit/**/*.test.js'
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
      watermarks: {
        lines: [70, 80],
        functions: [70, 80],
        branches: [60, 75],
        statements: [70, 80]
      }
    },

    /* Incluir archivos de test */
    include: ['tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],

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
