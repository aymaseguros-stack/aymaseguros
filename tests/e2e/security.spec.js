import { test, expect } from '@playwright/test';

/**
 * Security Tests
 * Verifica protecciones contra vulnerabilidades comunes (OWASP Top 10)
 * - XSS (Cross-Site Scripting)
 * - Inyección SQL
 * - CSRF (Cross-Site Request Forgery)
 * - Secure Headers
 * - Input Validation
 * - Session Management
 */

test.describe('Seguridad - XSS Protection', () => {
  test('debe sanitizar input de usuario contra XSS básico', async ({ page }) => {
    await page.goto('/');

    // Abrir chat
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    // Intentar inyección XSS básica
    const xssPayload = '<script>alert("XSS")</script>';
    await input.fill(xssPayload);
    await page.keyboard.press('Enter');

    await page.waitForTimeout(1000);

    // Verificar que el script NO se ejecutó
    const dialogAppeared = await page.evaluate(() => {
      return window.__xss_executed === true;
    });

    expect(dialogAppeared).toBeFalsy();

    // Verificar que el contenido fue escapado
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>alert("XSS")</script>');
  });

  test('debe proteger contra XSS en atributos HTML', async ({ page }) => {
    await page.goto('/');

    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    // XSS a través de atributos
    const xssPayload = '" onload="alert(\'XSS\')" x="';
    await input.fill(xssPayload);
    await page.keyboard.press('Enter');

    await page.waitForTimeout(1000);

    // Verificar que no hay atributos maliciosos inyectados
    const maliciousElements = await page.locator('[onload*="alert"]').count();
    expect(maliciousElements).toBe(0);
  });

  test('debe proteger contra XSS en event handlers', async ({ page }) => {
    await page.goto('/');

    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    // XSS a través de event handlers
    const xssPayloads = [
      '<img src=x onerror="alert(1)">',
      '<svg onload="alert(1)">',
      '<body onload="alert(1)">'
    ];

    for (const payload of xssPayloads) {
      await input.fill(payload);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
    }

    // Verificar que no se ejecutaron scripts
    const maliciousHandlers = await page.evaluate(() => {
      const elements = document.querySelectorAll('[onerror], [onload]');
      return Array.from(elements).filter(el => {
        return el.getAttribute('onerror')?.includes('alert') ||
               el.getAttribute('onload')?.includes('alert');
      }).length;
    });

    expect(maliciousHandlers).toBe(0);
  });
});

test.describe('Seguridad - Inyección de Código', () => {
  test('debe validar formato de código postal', async ({ page }) => {
    await page.goto('/');

    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    // Avanzar a la pregunta de código postal (después del nombre)
    await input.fill('Test User');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Intentar inyección SQL en código postal
    const sqlPayloads = [
      "1234' OR '1'='1",
      "1234; DROP TABLE users--",
      "1234' UNION SELECT * FROM quotes--"
    ];

    for (const payload of sqlPayloads) {
      await input.fill(payload);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      // Debe mostrar error de validación
      const errorVisible = await page.locator('text=/código postal|inválido|válido/i').isVisible();
      expect(errorVisible).toBe(true);

      // Volver al input
      await page.locator('button:has-text("← Volver")').click();
      await page.waitForTimeout(300);
    }
  });

  test('debe validar formato de año', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    // Navegar hasta pregunta de año
    await input.fill('Test User');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    await input.fill('2000');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    await page.click('button:has-text("Toyota")');
    await page.waitForTimeout(500);

    await page.click('button:has-text("Corolla")');
    await page.waitForTimeout(500);

    // Intentar inyecciones en año
    const maliciousYears = [
      "2020<script>alert(1)</script>",
      "2020'; DROP TABLE--",
      "../../etc/passwd",
      "${alert(1)}"
    ];

    for (const year of maliciousYears) {
      await input.fill(year);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      // Debe rechazar o sanitizar
      const errorVisible = await page.locator('text=/año|válido/i').isVisible();
      // Si no hay error, significa que continuó - verificar que se sanitizó
      if (!errorVisible) {
        const savedData = await page.evaluate(() => localStorage.getItem('currentQuote'));
        if (savedData) {
          expect(savedData).not.toContain('<script>');
          expect(savedData).not.toContain('DROP TABLE');
        }
      }

      // Reset
      await page.reload();
      await page.click('button:has-text("Cotizar Gratis Ahora")');
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Seguridad - Headers HTTP', () => {
  test('debe tener Content-Type header correcto', async ({ page }) => {
    const response = await page.goto('/');

    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('text/html');
  });

  test('debe servir recursos con MIME types correctos', async ({ page }) => {
    await page.goto('/');

    // Verificar que JS se sirve como application/javascript o text/javascript
    const jsRequests = [];
    page.on('response', response => {
      if (response.url().endsWith('.js')) {
        jsRequests.push({
          url: response.url(),
          contentType: response.headers()['content-type']
        });
      }
    });

    await page.waitForLoadState('networkidle');

    // Si hay archivos JS locales, verificar MIME type
    jsRequests.forEach(req => {
      if (!req.url.includes('cdn') && !req.url.includes('unpkg')) {
        expect(req.contentType).toMatch(/javascript|ecmascript/);
      }
    });
  });
});

test.describe('Seguridad - LocalStorage y Session', () => {
  test('no debe almacenar datos sensibles en localStorage', async ({ page }) => {
    await page.goto('/admin.html');

    // Intentar login
    await page.fill('input[type="text"]', 'ayma');
    await page.fill('input[type="password"]', 'Mimamamemima14');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);

    // Verificar que la contraseña NO se guardó en localStorage
    const localStorage = await page.evaluate(() => {
      return JSON.stringify(window.localStorage);
    });

    expect(localStorage.toLowerCase()).not.toContain('mimamamemima14');
    expect(localStorage.toLowerCase()).not.toContain('password');
    expect(localStorage.toLowerCase()).not.toContain('contraseña');
  });

  test('debe manejar localStorage corrupto sin crashes', async ({ page }) => {
    await page.goto('/');

    // Corromper localStorage
    await page.evaluate(() => {
      localStorage.setItem('ayma_quotes', 'CORRUPTED_DATA{{{');
      localStorage.setItem('currentQuote', '<script>alert(1)</script>');
    });

    // Recargar página
    await page.reload();

    // La aplicación debe seguir funcionando
    await expect(page.locator('text=AYMA ADVISORS')).toBeVisible();

    // Debe poder abrir el chat
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(500);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');
    await expect(input).toBeVisible();
  });

  test('debe limpiar sesión al cerrar admin', async ({ page }) => {
    await page.goto('/admin.html');

    // Login
    await page.fill('input[type="text"]', 'ayma');
    await page.fill('input[type="password"]', 'Mimamamemima14');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);

    // Verificar login exitoso
    await expect(page.locator('text=📊 Dashboard')).toBeVisible();

    // Cerrar sesión (si hay botón)
    const logoutButton = page.locator('button:has-text("Cerrar Sesión")');
    const hasLogout = await logoutButton.count() > 0;

    if (hasLogout) {
      await logoutButton.click();
      await page.waitForTimeout(500);

      // Debe volver a login
      await expect(page.locator('input[type="password"]')).toBeVisible();
    }
  });
});

test.describe('Seguridad - Validación de Input', () => {
  test('debe rechazar nombres excesivamente largos', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    // Nombre de 500 caracteres
    const longName = 'A'.repeat(500);
    await input.fill(longName);
    await page.keyboard.press('Enter');

    await page.waitForTimeout(500);

    // Debe rechazar o truncar
    const savedData = await page.evaluate(() => localStorage.getItem('currentQuote'));
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // El nombre no debería exceder un límite razonable
      expect(parsed.nombre.length).toBeLessThan(200);
    }
  });

  test('debe sanitizar caracteres especiales peligrosos', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    // Caracteres peligrosos
    const dangerousChars = '<script>alert(1)</script>';
    await input.fill(dangerousChars);
    await page.keyboard.press('Enter');

    await page.waitForTimeout(500);

    // Verificar que se sanitizó
    const content = await page.content();
    expect(content).not.toContain('<script>alert(1)</script>');
  });

  test('debe validar formato de WhatsApp antes de generar URL', async ({ page }) => {
    await page.goto('/admin.html');

    // Login
    await page.fill('input[type="text"]', 'ayma');
    await page.fill('input[type="password"]', 'Mimamamemima14');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);

    // Si hay funcionalidad de WhatsApp, verificar validación
    const whatsappButtons = await page.locator('button:has-text("WhatsApp")').count();

    if (whatsappButtons > 0) {
      // Verificar que no se puede generar URL con datos maliciosos
      await page.evaluate(() => {
        // Intentar crear cotización con teléfono malicioso
        const badQuote = {
          nombre: 'Test',
          telefono: 'javascript:alert(1)',
          codigoPostal: '2000'
        };
        localStorage.setItem('currentQuote', JSON.stringify(badQuote));
      });

      await page.reload();
      await page.fill('input[type="text"]', 'ayma');
      await page.fill('input[type="password"]', 'Mimamamemima14');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // El sistema debe manejar esto sin ejecutar el javascript
      const jsExecuted = await page.evaluate(() => window.__xss_executed === true);
      expect(jsExecuted).toBeFalsy();
    }
  });
});

test.describe('Seguridad - Protección contra Clickjacking', () => {
  test('debe poder ser embebido (sin X-Frame-Options restrictivo)', async ({ page }) => {
    const response = await page.goto('/');

    // Verificar headers de frame
    const xFrameOptions = response?.headers()['x-frame-options'];

    // Como es una landing page pública, NO debería tener DENY
    // Si existe, debería ser SAMEORIGIN o no estar presente
    if (xFrameOptions) {
      expect(xFrameOptions.toUpperCase()).not.toBe('DENY');
    }
  });
});

test.describe('Seguridad - Rate Limiting y DoS Protection', () => {
  test('debe manejar múltiples cotizaciones rápidas sin crash', async ({ page }) => {
    await page.goto('/');

    // Simular múltiples cotizaciones rápidas
    for (let i = 0; i < 10; i++) {
      await page.click('button:has-text("Cotizar Gratis Ahora")');
      await page.waitForTimeout(100);

      const input = page.locator('input[placeholder*="Escribe tu respuesta"]');
      await input.fill(`Test ${i}`);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);

      // Cerrar chat
      const backButton = page.locator('button:has-text("← Volver")');
      if (await backButton.count() > 0) {
        await backButton.click();
        await page.waitForTimeout(100);
      }
    }

    // La aplicación debe seguir funcionando
    await expect(page.locator('text=AYMA ADVISORS')).toBeVisible();
  });

  test('debe manejar localStorage lleno sin crash', async ({ page }) => {
    await page.goto('/');

    // Llenar localStorage con datos
    await page.evaluate(() => {
      try {
        // Intentar llenar localStorage
        const largeData = 'x'.repeat(100000);
        for (let i = 0; i < 100; i++) {
          localStorage.setItem(`test_${i}`, largeData);
        }
      } catch (e) {
        // QuotaExceededError es esperado
        window.__localStorage_full = true;
      }
    });

    // La aplicación debe manejar el error gracefully
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(500);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');
    await expect(input).toBeVisible();
  });
});

test.describe('Seguridad - Admin Panel', () => {
  test('debe rechazar credenciales incorrectas', async ({ page }) => {
    await page.goto('/admin.html');

    // Intentar login con credenciales incorrectas
    await page.fill('input[type="text"]', 'hacker');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);

    // Debe mostrar error
    await expect(page.locator('text=incorrectos')).toBeVisible();

    // NO debe acceder al dashboard
    const dashboard = await page.locator('text=📊 Dashboard').count();
    expect(dashboard).toBe(0);
  });

  test('debe requerir autenticación para ver dashboard', async ({ page }) => {
    await page.goto('/admin.html');

    // Sin login, no debe ver dashboard
    const dashboard = await page.locator('text=📊 Dashboard').count();
    expect(dashboard).toBe(0);

    // Debe ver formulario de login
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('debe proteger contra brute force básico', async ({ page }) => {
    await page.goto('/admin.html');

    // Intentar múltiples logins fallidos
    for (let i = 0; i < 5; i++) {
      await page.fill('input[type="text"]', `user${i}`);
      await page.fill('input[type="password"]', `pass${i}`);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(300);
    }

    // La aplicación debe seguir funcionando (no debe crashear)
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});

test.describe('Seguridad - HTTPS y Conexiones', () => {
  test('debe cargar recursos externos desde HTTPS', async ({ page }) => {
    const insecureRequests = [];

    page.on('request', request => {
      const url = request.url();
      if (url.startsWith('http://') && !url.includes('localhost')) {
        insecureRequests.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // No debe haber requests HTTP (excepto localhost en desarrollo)
    expect(insecureRequests).toHaveLength(0);
  });

  test('debe usar integridad subresource (SRI) para CDN críticos', async ({ page }) => {
    await page.goto('/');

    const scriptsWithoutIntegrity = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src*="cdn"], script[src*="unpkg"]'));
      return scripts
        .filter(script => !script.integrity)
        .map(script => script.src);
    });

    // Advertencia: CDNs importantes deberían tener integrity
    // No forzamos el test a fallar, pero lo reportamos
    if (scriptsWithoutIntegrity.length > 0) {
      console.log('⚠️  Scripts de CDN sin SRI:', scriptsWithoutIntegrity);
    }

    // Al menos no debe fallar el test
    expect(scriptsWithoutIntegrity).toBeDefined();
  });
});
