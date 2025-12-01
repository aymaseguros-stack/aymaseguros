/**
 * Lighthouse CI Configuration
 * Configura auditorías automatizadas de performance, SEO, accesibilidad y PWA
 *
 * Uso:
 * - npm run lighthouse        (ejecutar auditoría)
 * - lhci autorun             (CI/CD)
 */

module.exports = {
  ci: {
    collect: {
      // URLs a auditar
      url: [
        'http://localhost:8080/',
        'http://localhost:8080/admin.html'
      ],
      // Número de ejecuciones por URL (para promediar resultados)
      numberOfRuns: 3,
      // Configuración del servidor de pruebas
      startServerCommand: 'npx http-server . -p 8080 -s',
      startServerReadyPattern: 'Available on',
      startServerReadyTimeout: 10000
    },
    assert: {
      // Definir umbrales mínimos para cada categoría
      assertions: {
        // Performance
        'categories:performance': ['error', { minScore: 0.8 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'interactive': ['warn', { maxNumericValue: 3500 }],

        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'button-name': 'error',
        'link-name': 'error',
        'html-has-lang': 'error',
        'valid-lang': 'error',
        'meta-viewport': 'error',

        // Best Practices
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'errors-in-console': 'off',  // Puede ser ruidoso en desarrollo
        'no-vulnerable-libraries': 'warn',
        'uses-http2': 'off',  // No aplicable en desarrollo local
        'uses-passive-event-listeners': 'warn',

        // SEO
        'categories:seo': ['warn', { minScore: 0.85 }],
        'document-title': 'error',
        'meta-description': 'error',
        'viewport': 'error',
        'font-size': 'warn',
        'tap-targets': 'warn',
        'robots-txt': 'off',  // No aplicable en estático

        // PWA (opcional, más relajado)
        'categories:pwa': 'off',  // No es una PWA completa
        'installable-manifest': 'off',
        'service-worker': 'off',
        'works-offline': 'off'
      }
    },
    upload: {
      // Configuración para subir resultados (opcional)
      target: 'temporary-public-storage',
      // Si usas Lighthouse CI Server:
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: process.env.LHCI_TOKEN
    }
  }
};
