import { test, expect } from '@playwright/test';

/**
 * Web Vitals Tests
 * Mide Core Web Vitals según estándares de Google
 * - LCP (Largest Contentful Paint): < 2.5s (Good), < 4s (Needs Improvement)
 * - FID (First Input Delay): < 100ms (Good), < 300ms (Needs Improvement)
 * - CLS (Cumulative Layout Shift): < 0.1 (Good), < 0.25 (Needs Improvement)
 * - FCP (First Contentful Paint): < 1.8s (Good), < 3s (Needs Improvement)
 * - TTFB (Time to First Byte): < 800ms (Good), < 1800ms (Needs Improvement)
 */

// Función helper para obtener Web Vitals
async function getWebVitals(page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals = {};
      let metricsCollected = 0;
      const totalMetrics = 5;

      // Función para completar cuando se recolecten todas las métricas
      const checkComplete = () => {
        metricsCollected++;
        if (metricsCollected >= totalMetrics) {
          resolve(vitals);
        }
      };

      // LCP - Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
        }
        checkComplete();
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // FID - First Input Delay
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const firstInput = entries[0];
          vitals.fid = firstInput.processingStart - firstInput.startTime;
        } else {
          vitals.fid = 0; // No hubo interacción aún
        }
        checkComplete();
      }).observe({ type: 'first-input', buffered: true });

      // CLS - Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        vitals.cls = clsValue;
        checkComplete();
      }).observe({ type: 'layout-shift', buffered: true });

      // FCP - First Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          vitals.fcp = entries[0].startTime;
        }
        checkComplete();
      }).observe({ type: 'paint', buffered: true });

      // TTFB - Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        vitals.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      } else {
        vitals.ttfb = 0;
      }
      checkComplete();

      // Timeout de seguridad
      setTimeout(() => {
        resolve(vitals);
      }, 5000);
    });
  });
}

test.describe('Web Vitals - Landing Page', () => {
  test('debe tener buen LCP (Largest Contentful Paint)', async ({ page }) => {
    await page.goto('/');

    // Esperar a que la página esté completamente cargada
    await page.waitForLoadState('networkidle');

    const vitals = await getWebVitals(page);

    console.log(`LCP: ${vitals.lcp}ms`);

    // LCP debe ser menor a 4000ms (Needs Improvement threshold)
    expect(vitals.lcp).toBeLessThan(4000);

    // Idealmente menor a 2500ms (Good threshold)
    if (vitals.lcp < 2500) {
      console.log('✅ LCP: Good');
    } else {
      console.log('⚠️  LCP: Needs Improvement');
    }
  });

  test('debe tener bajo CLS (Cumulative Layout Shift)', async ({ page }) => {
    await page.goto('/');

    // Esperar carga completa
    await page.waitForLoadState('networkidle');

    // Hacer scroll para generar más layout shifts si existen
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const vitals = await getWebVitals(page);

    console.log(`CLS: ${vitals.cls}`);

    // CLS debe ser menor a 0.25 (Needs Improvement threshold)
    expect(vitals.cls).toBeLessThan(0.25);

    // Idealmente menor a 0.1 (Good threshold)
    if (vitals.cls < 0.1) {
      console.log('✅ CLS: Good');
    } else {
      console.log('⚠️  CLS: Needs Improvement');
    }
  });

  test('debe tener buen FCP (First Contentful Paint)', async ({ page }) => {
    await page.goto('/');

    const vitals = await getWebVitals(page);

    console.log(`FCP: ${vitals.fcp}ms`);

    // FCP debe ser menor a 3000ms (Needs Improvement threshold)
    expect(vitals.fcp).toBeLessThan(3000);

    // Idealmente menor a 1800ms (Good threshold)
    if (vitals.fcp < 1800) {
      console.log('✅ FCP: Good');
    } else {
      console.log('⚠️  FCP: Needs Improvement');
    }
  });

  test('debe tener buen TTFB (Time to First Byte)', async ({ page }) => {
    await page.goto('/');

    const vitals = await getWebVitals(page);

    console.log(`TTFB: ${vitals.ttfb}ms`);

    // TTFB debe ser menor a 1800ms (Needs Improvement threshold)
    expect(vitals.ttfb).toBeLessThan(1800);

    // Idealmente menor a 800ms (Good threshold)
    if (vitals.ttfb < 800) {
      console.log('✅ TTFB: Good');
    } else {
      console.log('⚠️  TTFB: Needs Improvement');
    }
  });

  test('debe medir FID después de interacción', async ({ page }) => {
    await page.goto('/');

    // Simular interacción de usuario
    await page.click('button:has-text("Cotizar Gratis Ahora")');

    // Esperar un poco para que se registre el FID
    await page.waitForTimeout(1000);

    const vitals = await getWebVitals(page);

    console.log(`FID: ${vitals.fid}ms`);

    // FID debe ser menor a 300ms (Needs Improvement threshold)
    // Si FID es 0, significa que no se registró o la respuesta fue instantánea
    if (vitals.fid > 0) {
      expect(vitals.fid).toBeLessThan(300);

      if (vitals.fid < 100) {
        console.log('✅ FID: Good');
      } else {
        console.log('⚠️  FID: Needs Improvement');
      }
    } else {
      console.log('✅ FID: Instant response (0ms)');
    }
  });
});

test.describe('Web Vitals - Admin Panel', () => {
  test('debe tener buen LCP en admin panel', async ({ page }) => {
    await page.goto('/admin.html');
    await page.waitForLoadState('networkidle');

    const vitals = await getWebVitals(page);

    console.log(`Admin LCP: ${vitals.lcp}ms`);

    expect(vitals.lcp).toBeLessThan(4000);
  });

  test('debe tener bajo CLS en admin panel', async ({ page }) => {
    await page.goto('/admin.html');
    await page.waitForLoadState('networkidle');

    const vitals = await getWebVitals(page);

    console.log(`Admin CLS: ${vitals.cls}`);

    expect(vitals.cls).toBeLessThan(0.25);
  });

  test('debe tener buen FCP en login', async ({ page }) => {
    await page.goto('/admin.html');

    const vitals = await getWebVitals(page);

    console.log(`Admin FCP: ${vitals.fcp}ms`);

    expect(vitals.fcp).toBeLessThan(3000);
  });
});

test.describe('Web Vitals - Performance Budget', () => {
  test('debe cumplir con el performance budget combinado', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular interacción
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const vitals = await getWebVitals(page);

    console.log('\n📊 Performance Budget Summary:');
    console.log(`  LCP:  ${vitals.lcp}ms (target: < 2500ms)`);
    console.log(`  FID:  ${vitals.fid}ms (target: < 100ms)`);
    console.log(`  CLS:  ${vitals.cls} (target: < 0.1)`);
    console.log(`  FCP:  ${vitals.fcp}ms (target: < 1800ms)`);
    console.log(`  TTFB: ${vitals.ttfb}ms (target: < 800ms)`);

    // Score basado en umbrales "Good" de Google
    let score = 0;
    let total = 5;

    if (vitals.lcp < 2500) score++;
    if (vitals.fid < 100 || vitals.fid === 0) score++;
    if (vitals.cls < 0.1) score++;
    if (vitals.fcp < 1800) score++;
    if (vitals.ttfb < 800) score++;

    const percentage = (score / total) * 100;
    console.log(`\n  Score: ${score}/${total} (${percentage}%)${percentage >= 80 ? ' ✅' : ' ⚠️'}\n`);

    // Al menos 3 de 5 métricas deben estar en "Good"
    expect(score).toBeGreaterThanOrEqual(3);
  });
});

test.describe('Web Vitals - Resource Timing', () => {
  test('debe cargar recursos críticos rápidamente', async ({ page }) => {
    await page.goto('/');

    const resourceTiming = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const critical = resources.filter(r =>
        r.name.includes('react') ||
        r.name.includes('tailwind') ||
        r.name.includes('.css') ||
        r.name.includes('.js')
      );

      return critical.map(r => ({
        name: r.name.split('/').pop(),
        duration: r.duration,
        size: r.transferSize || 0
      }));
    });

    console.log('\n📦 Critical Resources:');
    resourceTiming.forEach(resource => {
      console.log(`  ${resource.name}: ${resource.duration.toFixed(2)}ms (${(resource.size / 1024).toFixed(2)} KB)`);
    });

    // Recursos críticos no deben tardar más de 3 segundos
    resourceTiming.forEach(resource => {
      expect(resource.duration).toBeLessThan(3000);
    });
  });

  test('debe tener tiempo de navegación razonable', async ({ page }) => {
    await page.goto('/');

    const navigationTiming = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      if (!nav) return null;

      return {
        dns: nav.domainLookupEnd - nav.domainLookupStart,
        tcp: nav.connectEnd - nav.connectStart,
        request: nav.responseStart - nav.requestStart,
        response: nav.responseEnd - nav.responseStart,
        dom: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
        load: nav.loadEventEnd - nav.loadEventStart,
        total: nav.loadEventEnd - nav.fetchStart
      };
    });

    if (navigationTiming) {
      console.log('\n⏱️  Navigation Timing:');
      console.log(`  DNS Lookup:  ${navigationTiming.dns.toFixed(2)}ms`);
      console.log(`  TCP Connect: ${navigationTiming.tcp.toFixed(2)}ms`);
      console.log(`  Request:     ${navigationTiming.request.toFixed(2)}ms`);
      console.log(`  Response:    ${navigationTiming.response.toFixed(2)}ms`);
      console.log(`  DOM:         ${navigationTiming.dom.toFixed(2)}ms`);
      console.log(`  Load Event:  ${navigationTiming.load.toFixed(2)}ms`);
      console.log(`  Total:       ${navigationTiming.total.toFixed(2)}ms\n`);

      // El tiempo total de navegación no debe exceder 5 segundos
      expect(navigationTiming.total).toBeLessThan(5000);
    }
  });
});

test.describe('Web Vitals - Mobile Performance', () => {
  test('debe tener buen LCP en mobile', async ({ page, browserName }) => {
    // Simular dispositivo móvil
    await page.setViewportSize({ width: 375, height: 667 });

    // Simular conexión 3G
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
      uploadThroughput: 750 * 1024 / 8,           // 750 Kbps
      latency: 40
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const vitals = await getWebVitals(page);

    console.log(`Mobile LCP (3G): ${vitals.lcp}ms`);

    // En mobile/3G, permitir hasta 4.5 segundos
    expect(vitals.lcp).toBeLessThan(4500);
  });

  test('debe mantener bajo CLS en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular scroll en mobile
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const vitals = await getWebVitals(page);

    console.log(`Mobile CLS: ${vitals.cls}`);

    // CLS debe ser bajo incluso en mobile
    expect(vitals.cls).toBeLessThan(0.25);
  });
});
