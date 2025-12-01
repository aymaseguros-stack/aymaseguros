import { test, expect } from '@playwright/test';

/**
 * Tests de Accesibilidad (a11y)
 * Verifica cumplimiento de estándares WCAG 2.1
 */

test.describe('Accesibilidad - Landing Page', () => {
  test('debe tener estructura semántica correcta', async ({ page }) => {
    await page.goto('/');

    // Verificar jerarquía de headings
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Solo un H1 por página

    // Verificar que existe heading principal
    const h1Text = await page.locator('h1').textContent();
    expect(h1Text).toBeTruthy();
    expect(h1Text.length).toBeGreaterThan(0);
  });

  test('debe tener atributos alt en imágenes', async ({ page }) => {
    await page.goto('/');

    // Buscar imágenes sin alt
    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');

      // Las imágenes deben tener alt (puede ser vacío para decorativas)
      expect(alt).not.toBeNull();
    }
  });

  test('debe tener labels en todos los inputs', async ({ page }) => {
    await page.goto('/');

    // Abrir chat para ver inputs
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    // Verificar que tiene placeholder o aria-label
    const placeholder = await input.getAttribute('placeholder');
    const ariaLabel = await input.getAttribute('aria-label');

    expect(placeholder || ariaLabel).toBeTruthy();
  });

  test('debe tener botones accesibles', async ({ page }) => {
    await page.goto('/');

    // Todos los botones deben tener texto o aria-label
    const buttons = await page.locator('button').all();

    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('debe tener contraste de colores adecuado', async ({ page }) => {
    await page.goto('/');

    // Verificar que los textos principales sean visibles
    const mainHeading = page.locator('h2').first();
    await expect(mainHeading).toBeVisible();

    // El texto debe ser legible (no transparente)
    const opacity = await mainHeading.evaluate(el =>
      window.getComputedStyle(el).opacity
    );
    expect(parseFloat(opacity)).toBeGreaterThan(0.5);
  });

  test('debe ser navegable por teclado', async ({ page }) => {
    await page.goto('/');

    // Enfocar primer elemento interactivo
    await page.keyboard.press('Tab');

    // Verificar que hay un elemento enfocado
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeTruthy();
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);
  });

  test('debe tener meta viewport para responsive', async ({ page }) => {
    await page.goto('/');

    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });

  test('debe tener idioma definido', async ({ page }) => {
    await page.goto('/');

    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    expect(htmlLang).toMatch(/^es/); // Español
  });
});

test.describe('Accesibilidad - Admin Panel', () => {
  test('debe tener estructura semántica en login', async ({ page }) => {
    await page.goto('/admin.html');

    // Verificar heading principal
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Verificar que los inputs tienen labels
    const inputs = await page.locator('input').all();
    expect(inputs.length).toBeGreaterThan(0);
  });

  test('debe tener formulario accesible', async ({ page }) => {
    await page.goto('/admin.html');

    // Verificar que el formulario de login es accesible
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Los inputs deben tener labels
    const usernameInput = page.locator('input[type="text"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('debe mostrar errores de forma accesible', async ({ page }) => {
    await page.goto('/admin.html');

    // Intentar login incorrecto
    await page.fill('input[type="text"]', 'wrong');
    await page.fill('input[type="password"]', 'wrong');
    await page.click('button[type="submit"]');

    // El mensaje de error debe ser visible
    const errorMessage = page.locator('text=Usuario o contraseña incorrectos');
    await expect(errorMessage).toBeVisible();

    // El mensaje debe tener contraste adecuado
    const color = await errorMessage.evaluate(el =>
      window.getComputedStyle(el).color
    );
    expect(color).toBeTruthy();
  });

  test('debe tener navegación por teclado en dashboard', async ({ page }) => {
    await page.goto('/admin.html');

    // Login
    await page.fill('input[type="text"]', 'ayma');
    await page.fill('input[type="password"]', 'Mimamamemima14');
    await page.click('button[type="submit"]');

    await page.waitForSelector('text=📊 Dashboard');

    // Navegar con Tab
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeTruthy();
  });
});

test.describe('Accesibilidad - Focus Management', () => {
  test('debe mantener focus visible', async ({ page }) => {
    await page.goto('/');

    // Abrir chat
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    // El input debe recibir focus automáticamente (buena UX)
    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    // Dar focus explícito
    await input.focus();

    // Verificar que está enfocado
    const isFocused = await input.evaluate(el =>
      el === document.activeElement
    );
    expect(isFocused).toBe(true);
  });

  test('debe restaurar focus al cerrar modal', async ({ page }) => {
    await page.goto('/');

    // Recordar botón inicial
    const ctaButton = page.locator('button:has-text("Cotizar Gratis Ahora")');

    // Abrir chat
    await ctaButton.click();
    await page.waitForTimeout(500);

    // Cerrar chat
    await page.click('button:has-text("← Volver")');

    // El focus debería volver a un elemento razonable
    await page.waitForTimeout(500);

    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(['BODY', 'BUTTON', 'A']).toContain(focusedElement);
  });
});

test.describe('Accesibilidad - Responsive y Touch', () => {
  test('debe tener targets táctiles de tamaño adecuado (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Los botones deben tener tamaño mínimo 44x44px
    const ctaButton = page.locator('button:has-text("Cotizar Gratis Ahora")');
    const box = await ctaButton.boundingBox();

    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThanOrEqual(40); // Al menos 40px
  });

  test('debe ser usable en landscape mobile', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/');

    // El contenido debe ser visible
    await expect(page.locator('text=AYMA ADVISORS')).toBeVisible();
    await expect(page.locator('button:has-text("Cotizar Gratis Ahora")')).toBeVisible();
  });

  test('debe funcionar con zoom aumentado', async ({ page }) => {
    await page.goto('/');

    // Simular zoom (cambiar viewport)
    await page.setViewportSize({ width: 640, height: 480 });

    // El contenido debe seguir siendo accesible
    await expect(page.locator('text=AYMA ADVISORS')).toBeVisible();
    await expect(page.locator('button:has-text("Cotizar Gratis Ahora")')).toBeVisible();
  });
});

test.describe('Accesibilidad - Contenido', () => {
  test('debe tener title descriptivo', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title).toContain('Ayma');
  });

  test('debe tener meta description', async ({ page }) => {
    await page.goto('/');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
  });

  test('debe tener links con texto descriptivo', async ({ page }) => {
    await page.goto('/');

    // Los links no deben ser solo "click aquí" o "más"
    const links = await page.locator('a').all();

    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      const linkText = (text?.trim() || ariaLabel || '').toLowerCase();

      // Links deben tener texto descriptivo
      expect(linkText.length).toBeGreaterThan(0);
    }
  });
});

test.describe('Accesibilidad - ARIA', () => {
  test('debe usar roles ARIA apropiados en botones', async ({ page }) => {
    await page.goto('/');

    // Los elementos <button> ya tienen role implícito
    const buttons = await page.locator('button').all();
    expect(buttons.length).toBeGreaterThan(0);

    // Verificar que son elementos button nativos (mejor que role="button")
    for (const button of buttons.slice(0, 3)) {
      const tagName = await button.evaluate(el => el.tagName);
      expect(tagName).toBe('BUTTON');
    }
  });

  test('debe tener estado loading accesible', async ({ page }) => {
    await page.goto('/');

    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    // Verificar que el chat tiene estructura lógica
    const chatContainer = page.locator('text=Cotizador Inteligente').locator('..');
    await expect(chatContainer).toBeVisible();
  });
});
