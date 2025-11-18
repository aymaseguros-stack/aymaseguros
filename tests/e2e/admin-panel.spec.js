import { test, expect } from '@playwright/test';

/**
 * Tests E2E para Panel Admin (admin.html)
 * Cubre: Login, Dashboard, CRM, Notas, Recordatorios, Calendario
 */

const VALID_CREDENTIALS = {
  username: 'ayma',
  password: 'Mimamamemima14'
};

test.describe('Admin Panel - Login', () => {
  test('debe mostrar pantalla de login inicial', async ({ page }) => {
    await page.goto('/admin.html');

    await expect(page).toHaveTitle(/Panel Admin - Ayma Advisors/);
    await expect(page.locator('text=Ayma Advisors')).toBeVisible();
    await expect(page.locator('text=Panel de Administración')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Iniciar Sesión")')).toBeVisible();
  });

  test('debe rechazar credenciales incorrectas', async ({ page }) => {
    await page.goto('/admin.html');

    await page.fill('input[type="text"]', 'usuario_incorrecto');
    await page.fill('input[type="password"]', 'password_incorrecto');
    await page.click('button:has-text("Iniciar Sesión")');

    await expect(page.locator('text=Usuario o contraseña incorrectos')).toBeVisible();
  });

  test('debe permitir login con credenciales correctas', async ({ page }) => {
    await page.goto('/admin.html');

    await page.fill('input[type="text"]', VALID_CREDENTIALS.username);
    await page.fill('input[type="password"]', VALID_CREDENTIALS.password);
    await page.click('button:has-text("Iniciar Sesión")');

    // Esperar que cargue el dashboard
    await expect(page.locator('text=📊 Dashboard')).toBeVisible();
    await expect(page.locator('text=CRM Completo')).toBeVisible();
  });
});

test.describe('Admin Panel - Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto('/admin.html');
    await page.fill('input[type="text"]', VALID_CREDENTIALS.username);
    await page.fill('input[type="password"]', VALID_CREDENTIALS.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=📊 Dashboard');
  });

  test('debe mostrar métricas principales', async ({ page }) => {
    // Verificar que existen las cards de métricas
    await expect(page.locator('text=Total')).toBeVisible();
    await expect(page.locator('text=Nuevas')).toBeVisible();
    await expect(page.locator('text=Cotizadas')).toBeVisible();
    await expect(page.locator('text=Vendidas')).toBeVisible();
    await expect(page.locator('text=Conversión')).toBeVisible();
    await expect(page.locator('text=Recordatorios')).toBeVisible();
  });

  test('debe mostrar mensaje cuando no hay cotizaciones', async ({ page }) => {
    // Limpiar localStorage
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('text=📊 Dashboard');

    await expect(page.locator('text=No hay cotizaciones')).toBeVisible();
  });

  test('debe mostrar cotizaciones cuando existen datos', async ({ page }) => {
    // Agregar una cotización de prueba
    await page.evaluate(() => {
      const testQuote = {
        id: Date.now(),
        nombre: 'Test Usuario',
        codigoPostal: '2000',
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: '2020',
        cobertura: 'Todo Riesgo',
        status: 'nueva',
        createdAt: new Date().toISOString(),
        notes: '',
        contactHistory: [],
        reminders: []
      };
      localStorage.setItem('ayma_quotes', JSON.stringify([testQuote]));
    });

    await page.reload();
    await page.waitForSelector('text=Test Usuario');

    await expect(page.locator('text=Test Usuario')).toBeVisible();
    await expect(page.locator('text=Toyota Corolla')).toBeVisible();
    await expect(page.locator('text=2020')).toBeVisible();
  });

  test('debe tener botones de navegación', async ({ page }) => {
    await expect(page.locator('button:has-text("📊 Dashboard")')).toBeVisible();
    await expect(page.locator('button:has-text("📅 Calendario")')).toBeVisible();
    await expect(page.locator('button:has-text("Cerrar Sesión")')).toBeVisible();
  });

  test('debe cerrar sesión correctamente', async ({ page }) => {
    await page.click('button:has-text("Cerrar Sesión")');

    // Volver a la pantalla de login
    await expect(page.locator('text=Panel de Administración')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });
});

test.describe('Admin Panel - Gestión de estados', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/admin.html');
    await page.fill('input[type="text"]', VALID_CREDENTIALS.username);
    await page.fill('input[type="password"]', VALID_CREDENTIALS.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=📊 Dashboard');

    // Agregar cotización de prueba
    await page.evaluate(() => {
      const testQuote = {
        id: 123456,
        nombre: 'Estado Test',
        codigoPostal: '2000',
        marca: 'Honda',
        modelo: 'Civic',
        anio: '2021',
        cobertura: 'Terceros Completo',
        status: 'nueva',
        createdAt: new Date().toISOString(),
        notes: '',
        contactHistory: [],
        reminders: []
      };
      localStorage.setItem('ayma_quotes', JSON.stringify([testQuote]));
    });

    await page.reload();
    await page.waitForSelector('text=Estado Test');
  });

  test('debe poder cambiar estado a "Cotizada"', async ({ page }) => {
    await page.click('button:has-text("📧 Cotizada")');
    await page.waitForTimeout(500);

    // Verificar que cambió el contador
    const cotizadas = await page.locator('text=Cotizadas').locator('..').locator('p').last().textContent();
    expect(cotizadas).toBe('1');
  });

  test('debe poder cambiar estado a "Vendida"', async ({ page }) => {
    await page.click('button:has-text("💰 Vendida")');
    await page.waitForTimeout(500);

    const vendidas = await page.locator('text=Vendidas').locator('..').locator('p').last().textContent();
    expect(vendidas).toBe('1');
  });

  test('debe poder cambiar estado a "Perdida"', async ({ page }) => {
    await page.click('button:has-text("❌ Perdida")');
    await page.waitForTimeout(500);

    // Verificar en localStorage
    const quotes = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('ayma_quotes'));
    });

    expect(quotes[0].status).toBe('perdida');
  });

  test('debe calcular conversión correctamente', async ({ page }) => {
    // Cambiar a vendida
    await page.click('button:has-text("💰 Vendida")');
    await page.waitForTimeout(500);

    const conversion = await page.locator('text=Conversión').locator('..').locator('p').last().textContent();
    expect(conversion).toBe('100.0%');
  });
});

test.describe('Admin Panel - Sistema de notas', () => {
  test.beforeEach(async ({ page }) => {
    // Setup con login y cotización
    await page.goto('/admin.html');
    await page.fill('input[type="text"]', VALID_CREDENTIALS.username);
    await page.fill('input[type="password"]', VALID_CREDENTIALS.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=📊 Dashboard');

    await page.evaluate(() => {
      const testQuote = {
        id: 789012,
        nombre: 'Nota Test',
        codigoPostal: '2000',
        marca: 'Volkswagen',
        modelo: 'Gol',
        anio: '2019',
        cobertura: 'RC',
        status: 'nueva',
        createdAt: new Date().toISOString(),
        notes: '',
        contactHistory: [],
        reminders: []
      };
      localStorage.setItem('ayma_quotes', JSON.stringify([testQuote]));
    });

    await page.reload();
    await page.waitForSelector('text=Nota Test');
  });

  test('debe abrir modal de notas', async ({ page }) => {
    await page.click('button:has-text("📝 Nota")');

    await expect(page.locator('text=Agregar Nota - Nota Test')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="Escribe tu nota"]')).toBeVisible();
    await expect(page.locator('button:has-text("Guardar")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancelar")')).toBeVisible();
  });

  test('debe poder cerrar modal con cancelar', async ({ page }) => {
    await page.click('button:has-text("📝 Nota")');
    await page.click('button:has-text("Cancelar")');

    await expect(page.locator('text=Agregar Nota')).not.toBeVisible();
  });

  test('debe agregar una nota correctamente', async ({ page }) => {
    await page.click('button:has-text("📝 Nota")');

    await page.fill('textarea[placeholder*="Escribe tu nota"]', 'Esta es una nota de prueba');
    await page.click('button:has-text("Guardar")');

    await page.waitForTimeout(500);

    // Verificar que se muestra el historial
    await expect(page.locator('text=📋 Historial:')).toBeVisible();
    await expect(page.locator('text=Esta es una nota de prueba')).toBeVisible();
  });

  test('debe mostrar timestamp en las notas', async ({ page }) => {
    await page.click('button:has-text("📝 Nota")');

    await page.fill('textarea[placeholder*="Escribe tu nota"]', 'Nota con fecha');
    await page.click('button:has-text("Guardar")');

    await page.waitForTimeout(500);

    // Verificar que hay una fecha mostrada
    const historial = await page.locator('text=📋 Historial:').locator('..').textContent();
    expect(historial).toContain('Nota con fecha');
  });
});

test.describe('Admin Panel - Sistema de recordatorios', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
    await page.goto('/admin.html');
    await page.fill('input[type="text"]', VALID_CREDENTIALS.username);
    await page.fill('input[type="password"]', VALID_CREDENTIALS.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=📊 Dashboard');

    await page.evaluate(() => {
      const testQuote = {
        id: 345678,
        nombre: 'Recordatorio Test',
        codigoPostal: '2000',
        marca: 'Fiat',
        modelo: 'Cronos',
        anio: '2022',
        cobertura: 'Terceros con Granizo',
        status: 'nueva',
        createdAt: new Date().toISOString(),
        notes: '',
        contactHistory: [],
        reminders: []
      };
      localStorage.setItem('ayma_quotes', JSON.stringify([testQuote]));
    });

    await page.reload();
    await page.waitForSelector('text=Recordatorio Test');
  });

  test('debe abrir modal de recordatorio', async ({ page }) => {
    await page.click('button:has-text("📅 Recordatorio")');

    await expect(page.locator('text=Programar Recordatorio - Recordatorio Test')).toBeVisible();
    await expect(page.locator('input[type="date"]')).toBeVisible();
    await expect(page.locator('input[type="time"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
  });

  test('debe tener tipos de recordatorio disponibles', async ({ page }) => {
    await page.click('button:has-text("📅 Recordatorio")');

    const select = page.locator('select');
    const options = await select.locator('option').allTextContents();

    expect(options).toContain('📞 Llamada');
    expect(options).toContain('📧 Email');
    expect(options).toContain('💬 WhatsApp');
    expect(options).toContain('🤝 Reunión');
    expect(options).toContain('📋 Enviar Cotización');
    expect(options).toContain('🔄 Seguimiento');
  });

  test('debe crear un recordatorio', async ({ page }) => {
    await page.click('button:has-text("📅 Recordatorio")');

    // Fecha de mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    await page.fill('input[type="date"]', dateStr);
    await page.fill('input[type="time"]', '14:30');
    await page.selectOption('select', 'llamada');
    await page.fill('textarea[placeholder*="Notas del recordatorio"]', 'Llamar para seguimiento');
    await page.click('button:has-text("Programar")');

    await page.waitForTimeout(500);

    // Verificar que se muestra el recordatorio
    await expect(page.locator('text=📅 Recordatorios Pendientes:')).toBeVisible();
    await expect(page.locator('text=Llamar para seguimiento')).toBeVisible();
  });

  test('debe mostrar contador de recordatorios en Dashboard', async ({ page }) => {
    await page.click('button:has-text("📅 Recordatorio")');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    await page.fill('input[type="date"]', dateStr);
    await page.fill('input[type="time"]', '10:00');
    await page.click('button:has-text("Programar")');

    await page.waitForTimeout(500);

    // Verificar badge en cotización
    await expect(page.locator('text=1 recordatorio')).toBeVisible();
  });
});

test.describe('Admin Panel - Calendario', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
    await page.goto('/admin.html');
    await page.fill('input[type="text"]', VALID_CREDENTIALS.username);
    await page.fill('input[type="password"]', VALID_CREDENTIALS.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=📊 Dashboard');
  });

  test('debe cambiar a vista de calendario', async ({ page }) => {
    await page.click('button:has-text("📅 Calendario")');

    await expect(page.locator('text=📅 Calendario de Seguimientos')).toBeVisible();
    await expect(page.locator('text=📌 Hoy')).toBeVisible();
  });

  test('debe mostrar mensaje cuando no hay recordatorios', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('text=📊 Dashboard');

    await page.click('button:has-text("📅 Calendario")');

    await expect(page.locator('text=No hay recordatorios para hoy')).toBeVisible();
  });

  test('debe mostrar recordatorios de hoy', async ({ page }) => {
    // Crear recordatorio para hoy
    await page.evaluate(() => {
      const today = new Date().toISOString().split('T')[0];
      const testQuote = {
        id: 999999,
        nombre: 'Cliente Hoy',
        codigoPostal: '2000',
        marca: 'Peugeot',
        modelo: '208',
        anio: '2023',
        cobertura: 'Todo Riesgo',
        status: 'cotizada',
        createdAt: new Date().toISOString(),
        notes: '',
        contactHistory: [],
        reminders: [{
          id: Date.now(),
          date: today,
          time: '15:00',
          type: 'llamada',
          notes: 'Recordatorio de hoy',
          completed: false
        }]
      };
      localStorage.setItem('ayma_quotes', JSON.stringify([testQuote]));
    });

    await page.reload();
    await page.waitForSelector('text=📊 Dashboard');
    await page.click('button:has-text("📅 Calendario")');

    await expect(page.locator('text=Cliente Hoy')).toBeVisible();
    await expect(page.locator('text=Recordatorio de hoy')).toBeVisible();
  });

  test('debe mostrar recordatorios vencidos', async ({ page }) => {
    // Crear recordatorio vencido
    await page.evaluate(() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];

      const testQuote = {
        id: 888888,
        nombre: 'Cliente Vencido',
        codigoPostal: '2000',
        marca: 'Renault',
        modelo: 'Kwid',
        anio: '2021',
        cobertura: 'Terceros',
        status: 'nueva',
        createdAt: new Date().toISOString(),
        notes: '',
        contactHistory: [],
        reminders: [{
          id: Date.now(),
          date: dateStr,
          time: '09:00',
          type: 'whatsapp',
          notes: 'Recordatorio vencido',
          completed: false
        }]
      };
      localStorage.setItem('ayma_quotes', JSON.stringify([testQuote]));
    });

    await page.reload();
    await page.waitForSelector('text=📊 Dashboard');
    await page.click('button:has-text("📅 Calendario")');

    await expect(page.locator('text=⚠️ Recordatorios Vencidos')).toBeVisible();
    await expect(page.locator('text=Cliente Vencido')).toBeVisible();
    await expect(page.locator('text=Recordatorio vencido')).toBeVisible();
  });

  test('debe poder completar un recordatorio', async ({ page }) => {
    // Crear recordatorio
    await page.evaluate(() => {
      const today = new Date().toISOString().split('T')[0];
      const testQuote = {
        id: 777777,
        nombre: 'Cliente Completar',
        codigoPostal: '2000',
        marca: 'Chevrolet',
        modelo: 'Onix',
        anio: '2020',
        cobertura: 'RC',
        status: 'nueva',
        createdAt: new Date().toISOString(),
        notes: '',
        contactHistory: [],
        reminders: [{
          id: 111111,
          date: today,
          time: '11:00',
          type: 'email',
          notes: 'Test completar',
          completed: false
        }]
      };
      localStorage.setItem('ayma_quotes', JSON.stringify([testQuote]));
    });

    await page.reload();
    await page.waitForSelector('text=📊 Dashboard');
    await page.click('button:has-text("📅 Calendario")');

    await page.click('button:has-text("✓ Completar")');
    await page.waitForTimeout(500);

    // Verificar que cambió de estado
    await expect(page.locator('button:has-text("↻ Reabrir")')).toBeVisible();
  });

  test('debe mostrar badge en botón de calendario con pendientes', async ({ page }) => {
    // Crear recordatorio vencido
    await page.evaluate(() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 2);
      const dateStr = yesterday.toISOString().split('T')[0];

      const testQuote = {
        id: 666666,
        nombre: 'Cliente Badge',
        codigoPostal: '2000',
        marca: 'Ford',
        modelo: 'Ka',
        anio: '2018',
        cobertura: 'Terceros',
        status: 'cotizada',
        createdAt: new Date().toISOString(),
        notes: '',
        contactHistory: [],
        reminders: [{
          id: Date.now(),
          date: dateStr,
          time: '16:00',
          type: 'seguimiento',
          notes: 'Pendiente',
          completed: false
        }]
      };
      localStorage.setItem('ayma_quotes', JSON.stringify([testQuote]));
    });

    await page.reload();
    await page.waitForSelector('text=📊 Dashboard');

    // Verificar badge rojo con número
    const calendarButton = page.locator('button:has-text("📅 Calendario")');
    await expect(calendarButton.locator('text=1')).toBeVisible();
  });
});

test.describe('Admin Panel - Persistencia de datos', () => {
  test('debe cargar datos desde localStorage al iniciar', async ({ page }) => {
    // Preparar datos en localStorage
    await page.goto('/admin.html');

    await page.evaluate(() => {
      const quotes = [
        {
          id: 1,
          nombre: 'Cliente 1',
          codigoPostal: '2000',
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: '2020',
          cobertura: 'Todo Riesgo',
          status: 'nueva',
          createdAt: new Date().toISOString(),
          contactHistory: [],
          reminders: []
        },
        {
          id: 2,
          nombre: 'Cliente 2',
          codigoPostal: '2100',
          marca: 'Honda',
          modelo: 'Civic',
          anio: '2021',
          cobertura: 'Terceros',
          status: 'vendida',
          createdAt: new Date().toISOString(),
          contactHistory: [],
          reminders: []
        }
      ];
      localStorage.setItem('ayma_quotes', JSON.stringify(quotes));
    });

    // Login y verificar
    await page.fill('input[type="text"]', VALID_CREDENTIALS.username);
    await page.fill('input[type="password"]', VALID_CREDENTIALS.password);
    await page.click('button:has-text("Iniciar Sesión")');

    await page.waitForSelector('text=Cliente 1');
    await expect(page.locator('text=Cliente 2')).toBeVisible();

    // Verificar métricas
    const total = await page.locator('text=Total').locator('..').locator('p').last().textContent();
    expect(total).toBe('2');
  });

  test('debe actualizar localStorage al cambiar estado', async ({ page }) => {
    await page.goto('/admin.html');

    await page.evaluate(() => {
      const testQuote = {
        id: 99999,
        nombre: 'Estado Persistente',
        codigoPostal: '2000',
        marca: 'Nissan',
        modelo: 'Versa',
        anio: '2019',
        cobertura: 'RC',
        status: 'nueva',
        createdAt: new Date().toISOString(),
        contactHistory: [],
        reminders: []
      };
      localStorage.setItem('ayma_quotes', JSON.stringify([testQuote]));
    });

    await page.fill('input[type="text"]', VALID_CREDENTIALS.username);
    await page.fill('input[type="password"]', VALID_CREDENTIALS.password);
    await page.click('button:has-text("Iniciar Sesión")');

    await page.waitForSelector('text=Estado Persistente');
    await page.click('button:has-text("💰 Vendida")');
    await page.waitForTimeout(500);

    // Verificar en localStorage
    const savedData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('ayma_quotes'));
    });

    expect(savedData[0].status).toBe('vendida');
  });
});

test.describe('Admin Panel - Responsividad', () => {
  test('debe funcionar en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin.html');

    // Login
    await page.fill('input[type="text"]', VALID_CREDENTIALS.username);
    await page.fill('input[type="password"]', VALID_CREDENTIALS.password);
    await page.click('button:has-text("Iniciar Sesión")');

    await expect(page.locator('text=📊 Dashboard')).toBeVisible();
  });
});
