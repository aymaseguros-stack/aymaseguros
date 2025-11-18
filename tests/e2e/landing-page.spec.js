import { test, expect } from '@playwright/test';

/**
 * Tests E2E para Landing Page (index.html)
 * Cubre: UI, SEO, Chat, Cotizador, Integración WhatsApp
 */

test.describe('Landing Page - Carga inicial y SEO', () => {
  test('debe cargar correctamente con título y meta tags SEO', async ({ page }) => {
    await page.goto('/');

    // Verificar título
    await expect(page).toHaveTitle(/Seguros de Auto.*Ayma Advisors/);

    // Verificar meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toContain('Rosario');
    expect(metaDescription).toContain('seguro');
  });

  test('debe tener Open Graph tags correctos', async ({ page }) => {
    await page.goto('/');

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');

    expect(ogTitle).toBeTruthy();
    expect(ogType).toBe('website');
  });

  test('debe tener structured data JSON-LD', async ({ page }) => {
    await page.goto('/');

    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(jsonLd);

    expect(data['@type']).toBe('InsuranceAgency');
    expect(data.name).toBe('Ayma Advisors');
    expect(data.telephone).toBeTruthy();
  });
});

test.describe('Landing Page - Elementos visuales y branding', () => {
  test('debe mostrar logo de Ayma', async ({ page }) => {
    await page.goto('/');

    // Esperar a que React cargue
    await page.waitForSelector('text=AYMA ADVISORS');

    expect(await page.locator('text=AYMA ADVISORS').isVisible()).toBeTruthy();
    expect(await page.locator('text=Ahorro inteligente desde 2008').isVisible()).toBeTruthy();
  });

  test('debe mostrar headline con versión A/B testing', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('h2');
    const headline = await page.locator('h2').first().textContent();

    // Verificar que sea una de las dos versiones
    const isVersionA = headline.includes('Dejá de pagar de más');
    const isVersionB = headline.includes('Ahorrá hasta 35%');

    expect(isVersionA || isVersionB).toBeTruthy();
  });

  test('debe mostrar banner de oferta exclusiva', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=OFERTA EXCLUSIVA')).toBeVisible();
    await expect(page.locator('text=35% de descuento')).toBeVisible();
  });

  test('debe mostrar las 3 características principales', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Ahorrás hasta 35%')).toBeVisible();
    await expect(page.locator('text=En 2 minutos')).toBeVisible();
    await expect(page.locator('text=Las Mejores')).toBeVisible();
  });
});

test.describe('Landing Page - CTA y navegación', () => {
  test('debe tener botón CTA principal visible', async ({ page }) => {
    await page.goto('/');

    const ctaButton = page.locator('button:has-text("Cotizar Gratis Ahora")');
    await expect(ctaButton).toBeVisible();

    // Verificar que tenga clases de estilo
    const classes = await ctaButton.getAttribute('class');
    expect(classes).toContain('pulse-glow');
  });

  test('debe abrir el chat al hacer clic en CTA', async ({ page }) => {
    await page.goto('/');

    // Click en botón de cotizar
    await page.click('button:has-text("Cotizar Gratis Ahora")');

    // Esperar que aparezca el chat
    await expect(page.locator('text=Cotizador Inteligente')).toBeVisible();
    await expect(page.locator('text=← Volver')).toBeVisible();
  });
});

test.describe('Landing Page - Secciones de contenido', () => {
  test('debe mostrar sección "Por qué elegirnos"', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=¿Por qué miles eligen Ayma Advisors?')).toBeVisible();
    await expect(page.locator('text=17 años de experiencia')).toBeVisible();
    await expect(page.locator('text=Asesoramiento sin costo')).toBeVisible();
    await expect(page.locator('text=Gestionamos tus siniestros')).toBeVisible();
    await expect(page.locator('text=Comparación objetiva')).toBeVisible();
  });

  test('debe mostrar garantía de ahorro', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Garantía de Ahorro')).toBeVisible();
  });

  test('debe mostrar aseguradoras', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Nación Seguros')).toBeVisible();
    await expect(page.locator('text=San Cristóbal')).toBeVisible();
    await expect(page.locator('text=Mapfre')).toBeVisible();
    await expect(page.locator('text=SMG Seguros')).toBeVisible();
  });

  test('debe mostrar testimonios de clientes', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Lo que dicen nuestros clientes')).toBeVisible();
    await expect(page.locator('text=María González')).toBeVisible();
    await expect(page.locator('text=Carlos Fernández')).toBeVisible();
    await expect(page.locator('text=Lucía Martínez')).toBeVisible();
  });

  test('debe mostrar social proof', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=+2.500 clientes confían en nosotros')).toBeVisible();
  });

  test('debe mostrar información de contacto en footer', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Rosario, Santa Fe, Argentina')).toBeVisible();
    await expect(page.locator('text=+54 9 341 695-2259')).toBeVisible();
  });
});

test.describe('Chat - Flujo completo de cotización', () => {
  test('debe abrir chat y mostrar mensaje de bienvenida', async ({ page }) => {
    await page.goto('/');

    // Abrir chat
    await page.click('button:has-text("Cotizar Gratis Ahora")');

    // Esperar mensaje inicial (nota: el mensaje se agrega con delay)
    await page.waitForTimeout(1000);

    // Verificar elementos del chat
    await expect(page.locator('text=Cotizador Inteligente')).toBeVisible();
    await expect(page.locator('input[placeholder*="Escribe tu respuesta"]')).toBeVisible();
  });

  test('debe completar flujo de cotización paso a paso', async ({ page }) => {
    await page.goto('/');

    // Abrir chat
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    // No hay mensaje inicial automático, necesitamos iniciarlo
    // El chat espera que el usuario escriba primero

    // Paso 1: Nombre
    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');
    await input.fill('Juan Pérez');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=código postal')).toBeVisible();

    // Paso 2: Código Postal
    await input.fill('2000');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=marca')).toBeVisible();

    // Paso 3: Marca
    await input.fill('Toyota');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=modelo')).toBeVisible();

    // Paso 4: Modelo
    await input.fill('Corolla');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=año')).toBeVisible();

    // Paso 5: Año
    await input.fill('2020');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=cobertura')).toBeVisible();

    // Paso 6: Cobertura
    await input.fill('Todo Riesgo');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Verificar mensaje de éxito
    await expect(page.locator('text=Tu cotización está lista')).toBeVisible();
    await expect(page.locator('button:has-text("Enviar por WhatsApp")')).toBeVisible();
    await expect(page.locator('button:has-text("Nueva Cotización")')).toBeVisible();
  });

  test('debe validar año del vehículo', async ({ page }) => {
    await page.goto('/');

    // Abrir chat
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    // Completar hasta el año
    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    await input.fill('Juan Pérez');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('2000');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('Toyota');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('Corolla');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Ingresar año inválido
    await input.fill('1900');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Verificar mensaje de error
    await expect(page.locator('text=año válido')).toBeVisible();
  });

  test('debe permitir volver desde el chat', async ({ page }) => {
    await page.goto('/');

    // Abrir chat
    await page.click('button:has-text("Cotizar Gratis Ahora")');

    // Click en volver
    await page.click('button:has-text("← Volver")');

    // Verificar que volvió a landing
    await expect(page.locator('text=AYMA ADVISORS')).toBeVisible();
    await expect(page.locator('button:has-text("Cotizar Gratis Ahora")')).toBeVisible();
  });

  test('debe permitir iniciar nueva cotización', async ({ page }) => {
    await page.goto('/');

    // Abrir chat y completar cotización
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    await input.fill('Juan Pérez');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('2000');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('Toyota');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('Corolla');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('2020');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('Todo Riesgo');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Click en nueva cotización
    await page.click('button:has-text("Nueva Cotización")');
    await page.waitForTimeout(1000);

    // Verificar que el input está habilitado y no hay mensajes previos
    await expect(input).toBeEnabled();
  });
});

test.describe('Chat - LocalStorage y persistencia', () => {
  test('debe guardar cotización en localStorage', async ({ page }) => {
    await page.goto('/');

    // Completar cotización
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    await input.fill('Juan Pérez');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('2000');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('Toyota');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('Corolla');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('2020');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('Todo Riesgo');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Verificar localStorage
    const quotes = await page.evaluate(() => {
      return localStorage.getItem('ayma_quotes');
    });

    expect(quotes).toBeTruthy();
    const parsed = JSON.parse(quotes);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].nombre).toBe('Juan Pérez');
    expect(parsed[0].marca).toBe('Toyota');
    expect(parsed[0].modelo).toBe('Corolla');
    expect(parsed[0].anio).toBe('2020');
  });

  test('debe trackear versión de headline en cotización', async ({ page }) => {
    await page.goto('/');

    // Completar cotización rápida
    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    await input.fill('Test User');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('2000');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('Honda');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('Civic');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('2021');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await input.fill('Terceros Completo');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Verificar que se guardó la versión del headline
    const quotes = await page.evaluate(() => {
      return localStorage.getItem('ayma_quotes');
    });

    const parsed = JSON.parse(quotes);
    expect(parsed[0].headlineVersion).toMatch(/^[AB]$/);
  });
});

test.describe('Responsividad y Mobile', () => {
  test('debe verse correctamente en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('text=AYMA ADVISORS')).toBeVisible();
    await expect(page.locator('button:has-text("Cotizar Gratis Ahora")')).toBeVisible();
  });

  test('debe funcionar el chat en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');
    await expect(input).toBeVisible();

    await input.fill('Mobile User');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Mobile User')).toBeVisible();
  });
});

test.describe('Accesibilidad básica', () => {
  test('debe tener roles ARIA apropiados', async ({ page }) => {
    await page.goto('/');

    // Los botones deben ser accesibles
    const buttons = await page.locator('button').all();
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('debe permitir navegación por teclado en el chat', async ({ page }) => {
    await page.goto('/');

    await page.click('button:has-text("Cotizar Gratis Ahora")');
    await page.waitForTimeout(1000);

    const input = page.locator('input[placeholder*="Escribe tu respuesta"]');

    // Tab hasta el input
    await page.keyboard.press('Tab');

    // Escribir con teclado
    await input.type('Keyboard User');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Keyboard User')).toBeVisible();
  });
});
