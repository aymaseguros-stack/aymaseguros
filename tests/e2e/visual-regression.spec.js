import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 * Captura y compara screenshots para detectar cambios visuales no intencionales
 *
 * Para actualizar baselines: npx playwright test --update-snapshots
 */

test.describe('Visual Regression - Landing Page', () => {
  test('debe mantener diseño de hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Capturar hero section
    const hero = page.locator('text=AYMA ADVISORS').locator('..');
    await expect(hero).toHaveScreenshot('hero-section.png', {
      maxDiffPixels: 100,  // Permitir hasta 100 píxeles de diferencia
      threshold: 0.2       // 20% de tolerancia
    });
  });

  test('debe mantener diseño del botón CTA', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ctaButton = page.locator('button:has-text("Cotizar Gratis Ahora")').first();
    await expect(ctaButton).toHaveScreenshot('cta-button.png', {
      maxDiffPixels: 50
    });
  });

  test('debe mantener diseño completo de landing page (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Esperar animaciones
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('landing-page-desktop.png', {
      fullPage: true,
      maxDiffPixels: 500,
      threshold: 0.3
    });
  });

  test('debe mantener diseño en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('landing-page-mobile.png', {
      fullPage: true,
      maxDiffPixels: 300,
      threshold: 0.3
    });
  });

  test('debe mantener diseño en tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('landing-page-tablet.png', {
      fullPage: true,
      maxDiffPixels: 400,
      threshold: 0.3
    });
  });
});

test.describe('Visual Regression - Chat Widget', () => {
  test('debe mantener diseño del chat cerrado', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const chatButton = page.locator('button:has-text("Cotizar Gratis Ahora")').first();
    await expect(chatButton).toHaveScreenshot('chat-button-closed.png');
  });

  test('debe mantener diseño del chat abierto', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const chatContainer = page.locator('text=Cotizador Inteligente').locator('..');
    await expect(chatContainer).toHaveScreenshot('chat-open.png', {
      maxDiffPixels: 200,
      threshold: 0.2
    });
  });

  test('debe mantener diseño del input de chat', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');
    await expect(input).toHaveScreenshot('chat-input.png');
  });

  test('debe mantener diseño de mensajes del bot', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const message = page.locator('text=¡Hola! 👋 Soy tu asistente virtual').locator('..');
    await expect(message).toHaveScreenshot('bot-message.png', {
      maxDiffPixels: 100
    });
  });

  test('debe mantener diseño de opciones de selección', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');
    await input.fill('Test User');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    await input.fill('2000');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Capturar botones de marca
    const options = page.locator('button:has-text("Toyota")').locator('..');
    await expect(options).toHaveScreenshot('selection-buttons.png', {
      maxDiffPixels: 150
    });
  });
});

test.describe('Visual Regression - Admin Panel', () => {
  test('debe mantener diseño de login', async ({ page }) => {
    await page.goto('/admin.html');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('admin-login.png', {
      maxDiffPixels: 200,
      threshold: 0.2
    });
  });

  test('debe mantener diseño del formulario de login', async ({ page }) => {
    await page.goto('/admin.html');

    const form = page.locator('form');
    await expect(form).toHaveScreenshot('login-form.png', {
      maxDiffPixels: 100
    });
  });

  test('debe mantener diseño de dashboard', async ({ page }) => {
    await page.goto('/admin.html');

    // Login
    await page.fill('input[type="text"]', 'ayma');
    await page.fill('input[type="password"]', 'Mimamamemima14');
    await page.click('button[type="submit"]');

    await page.waitForSelector('text=📊 Dashboard');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('admin-dashboard.png', {
      fullPage: true,
      maxDiffPixels: 500,
      threshold: 0.3
    });
  });

  test('debe mantener diseño de tabla de cotizaciones', async ({ page }) => {
    await page.goto('/admin.html');

    await page.fill('input[type="text"]', 'ayma');
    await page.fill('input[type="password"]', 'Mimamamemima14');
    await page.click('button[type="submit"]');

    await page.waitForSelector('text=📊 Dashboard');
    await page.waitForTimeout(1000);

    // Buscar tabla si existe
    const table = page.locator('table').first();
    const hasTable = await table.count() > 0;

    if (hasTable) {
      await expect(table).toHaveScreenshot('quotes-table.png', {
        maxDiffPixels: 300,
        threshold: 0.3
      });
    }
  });

  test('debe mantener diseño de stats cards', async ({ page }) => {
    await page.goto('/admin.html');

    await page.fill('input[type="text"]', 'ayma');
    await page.fill('input[type="password"]', 'Mimamamemima14');
    await page.click('button[type="submit"]');

    await page.waitForSelector('text=📊 Dashboard');
    await page.waitForTimeout(1000);

    // Capturar sección de estadísticas
    const stats = page.locator('text=TOTAL COTIZACIONES').locator('..');
    const hasStats = await stats.count() > 0;

    if (hasStats) {
      await expect(stats).toHaveScreenshot('dashboard-stats.png', {
        maxDiffPixels: 200
      });
    }
  });
});

test.describe('Visual Regression - Estados Interactivos', () => {
  test('debe mantener diseño de hover en botones', async ({ page }) => {
    await page.goto('/');

    const button = page.locator('button:has-text("Cotizar Gratis Ahora")').first();
    await button.hover();
    await page.waitForTimeout(300);

    await expect(button).toHaveScreenshot('button-hover.png', {
      maxDiffPixels: 100
    });
  });

  test('debe mantener diseño de focus en inputs', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');
    await input.focus();
    await page.waitForTimeout(300);

    await expect(input).toHaveScreenshot('input-focus.png', {
      maxDiffPixels: 50
    });
  });

  test('debe mantener diseño de mensajes de error', async ({ page }) => {
    await page.goto('/admin.html');

    await page.fill('input[type="text"]', 'wrong');
    await page.fill('input[type="password"]', 'wrong');
    await page.click('button[type="submit"]');

    await page.waitForSelector('text=incorrectos');
    await page.waitForTimeout(500);

    const error = page.locator('text=Usuario o contraseña incorrectos').locator('..');
    await expect(error).toHaveScreenshot('error-message.png', {
      maxDiffPixels: 100
    });
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test('debe mantener diseño en modo oscuro (si existe)', async ({ page }) => {
    await page.goto('/');

    // Verificar si existe modo oscuro
    const darkModeToggle = page.locator('button[aria-label*="dark"], button[title*="dark"]');
    const hasDarkMode = await darkModeToggle.count() > 0;

    if (hasDarkMode) {
      await darkModeToggle.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('landing-page-dark.png', {
        fullPage: true,
        maxDiffPixels: 500,
        threshold: 0.3
      });
    }
  });
});

test.describe('Visual Regression - Animaciones', () => {
  test('debe capturar estado final de animaciones', async ({ page }) => {
    await page.goto('/');

    // Esperar a que terminen todas las animaciones
    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('landing-page-animated.png', {
      fullPage: true,
      maxDiffPixels: 500,
      threshold: 0.3,
      animations: 'disabled'  // Deshabilitar animaciones para consistencia
    });
  });
});

test.describe('Visual Regression - Elementos Específicos', () => {
  test('debe mantener diseño del footer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll al footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Buscar footer
    const footer = page.locator('footer, [role="contentinfo"]').first();
    const hasFooter = await footer.count() > 0;

    if (hasFooter) {
      await expect(footer).toHaveScreenshot('footer.png', {
        maxDiffPixels: 200
      });
    }
  });

  test('debe mantener diseño del header/nav', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header, nav, [role="banner"]').first();
    const hasHeader = await header.count() > 0;

    if (hasHeader) {
      await expect(header).toHaveScreenshot('header.png', {
        maxDiffPixels: 150
      });
    }
  });
});

test.describe('Visual Regression - Cross-Browser', () => {
  test('debe mantener consistencia visual en diferentes navegadores', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot(`landing-${browserName}.png`, {
      fullPage: true,
      maxDiffPixels: 600,
      threshold: 0.35  // Mayor tolerancia para diferencias entre navegadores
    });
  });
});

test.describe('Visual Regression - Responsive Breakpoints', () => {
  const breakpoints = [
    { name: 'mobile-sm', width: 320, height: 568 },
    { name: 'mobile-md', width: 375, height: 667 },
    { name: 'mobile-lg', width: 414, height: 896 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop-sm', width: 1024, height: 768 },
    { name: 'desktop-md', width: 1440, height: 900 },
    { name: 'desktop-lg', width: 1920, height: 1080 }
  ];

  breakpoints.forEach(({ name, width, height }) => {
    test(`debe mantener diseño en ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`landing-${name}.png`, {
        fullPage: false,  // Solo viewport visible
        maxDiffPixels: 400,
        threshold: 0.3
      });
    });
  });
});
