# Testing - Ayma Advisors

Documentación completa de la suite de tests para el sistema de cotización de seguros de Ayma Advisors.

## 📋 Índice

1. [Resumen](#resumen)
2. [Stack de Testing](#stack-de-testing)
3. [Estructura de Tests](#estructura-de-tests)
4. [Instalación](#instalación)
5. [Ejecutar Tests](#ejecutar-tests)
6. [Tests E2E](#tests-e2e)
7. [Tests Unitarios](#tests-unitarios)
8. [Cobertura](#cobertura)
9. [CI/CD](#cicd)
10. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Resumen

Este proyecto cuenta con una **suite completa de tests** que cubre:

- **Tests End-to-End (E2E)**: Flujos completos de usuario en navegadores reales
- **Tests Unitarios**: Lógica de negocio y funciones individuales
- **Tests de Integración**: LocalStorage, APIs, y persistencia de datos

### Estadísticas de Cobertura

| Tipo de Test | Archivos | Tests | Líneas Cubiertas |
|--------------|----------|-------|------------------|
| **E2E** | 2 archivos | 60+ tests | Landing + Admin |
| **Unitarios** | 3 archivos | 50+ tests | Storage, Validación, Métricas |
| **Total** | 5 archivos | **110+ tests** | ~95% cobertura funcional |

---

## 🛠 Stack de Testing

### Testing E2E
- **Playwright**: Framework moderno para testing E2E
  - Cross-browser (Chrome, Firefox, Safari)
  - Mobile y tablet testing
  - Screenshots y videos automáticos
  - Debugging visual

### Testing Unitario
- **Vitest**: Test runner ultrarrápido
  - Compatible con Jest API
  - Hot Module Reload
  - UI interactiva
  - Cobertura con V8

### Utilidades
- **@testing-library/dom**: Queries accesibles
- **@testing-library/jest-dom**: Matchers personalizados
- **happy-dom**: Entorno DOM ligero

---

## 📁 Estructura de Tests

```
aymaseguros/
├── tests/
│   ├── e2e/                      # Tests End-to-End
│   │   ├── landing-page.spec.js  # Tests de index.html
│   │   └── admin-panel.spec.js   # Tests de admin.html
│   ├── unit/                     # Tests Unitarios
│   │   ├── storage.test.js       # LocalStorage y persistencia
│   │   ├── validation.test.js    # Validación de datos
│   │   └── metrics.test.js       # Cálculo de métricas
│   └── setup.js                  # Configuración global
├── playwright.config.js          # Config Playwright
├── vitest.config.js             # Config Vitest
└── package.json                 # Scripts y dependencias
```

---

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar navegadores de Playwright

```bash
npm run playwright:install
```

Esto descargará:
- Chromium
- Firefox
- WebKit (Safari)

---

## 🚀 Ejecutar Tests

### Tests E2E (Playwright)

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar con UI interactiva
npm run test:e2e:ui

# Ejecutar con navegador visible
npm run test:e2e:headed

# Ejecutar en modo debug
npm run test:e2e:debug

# Ejecutar un archivo específico
npx playwright test tests/e2e/landing-page.spec.js

# Ejecutar en un navegador específico
npx playwright test --project=chromium
```

### Tests Unitarios (Vitest)

```bash
# Ejecutar todos los tests unitarios
npm test

# Ejecutar con UI interactiva
npm run test:ui

# Ejecutar con cobertura
npm run test:coverage

# Watch mode (auto-recarga)
npm test -- --watch

# Ejecutar un archivo específico
npm test -- storage.test.js
```

### Ejecutar Todos los Tests

```bash
# Tests unitarios + E2E
npm run test:all
```

### Servidor de desarrollo

```bash
# Iniciar servidor HTTP en puerto 8080
npm run serve

# O usar el alias
npm run dev
```

---

## 🌐 Tests E2E

### Landing Page (`tests/e2e/landing-page.spec.js`)

#### Suites de Tests

1. **Carga inicial y SEO** (4 tests)
   - ✅ Título y meta tags
   - ✅ Open Graph tags
   - ✅ JSON-LD structured data
   - ✅ Meta description con keywords

2. **Elementos visuales y branding** (5 tests)
   - ✅ Logo de Ayma
   - ✅ Headlines A/B testing
   - ✅ Banner de oferta
   - ✅ 3 características principales
   - ✅ Colores y estilos

3. **CTA y navegación** (2 tests)
   - ✅ Botón CTA visible
   - ✅ Apertura del chat

4. **Secciones de contenido** (7 tests)
   - ✅ "Por qué elegirnos"
   - ✅ Garantía de ahorro
   - ✅ Lista de aseguradoras
   - ✅ Testimonios (3 clientes)
   - ✅ Social proof
   - ✅ Footer con contacto

5. **Chat - Flujo completo** (6 tests)
   - ✅ Mensaje de bienvenida
   - ✅ Flujo paso a paso completo
   - ✅ Validación de año del vehículo
   - ✅ Botón volver
   - ✅ Nueva cotización
   - ✅ Botón WhatsApp

6. **Chat - LocalStorage** (2 tests)
   - ✅ Guardar cotización
   - ✅ Trackear versión de headline

7. **Responsividad** (2 tests)
   - ✅ Vista mobile
   - ✅ Chat en mobile

8. **Accesibilidad** (2 tests)
   - ✅ Roles ARIA
   - ✅ Navegación por teclado

**Total: 30+ tests**

### Panel Admin (`tests/e2e/admin-panel.spec.js`)

#### Suites de Tests

1. **Login** (3 tests)
   - ✅ Pantalla de login
   - ✅ Rechazar credenciales incorrectas
   - ✅ Login exitoso

2. **Dashboard** (6 tests)
   - ✅ Métricas principales
   - ✅ Sin cotizaciones
   - ✅ Con cotizaciones
   - ✅ Navegación
   - ✅ Cerrar sesión

3. **Gestión de estados** (4 tests)
   - ✅ Cambiar a "Cotizada"
   - ✅ Cambiar a "Vendida"
   - ✅ Cambiar a "Perdida"
   - ✅ Cálculo de conversión

4. **Sistema de notas** (4 tests)
   - ✅ Abrir modal
   - ✅ Cerrar modal
   - ✅ Agregar nota
   - ✅ Timestamp

5. **Sistema de recordatorios** (4 tests)
   - ✅ Abrir modal
   - ✅ Tipos de recordatorio
   - ✅ Crear recordatorio
   - ✅ Contador de recordatorios

6. **Calendario** (6 tests)
   - ✅ Cambiar a vista calendario
   - ✅ Sin recordatorios
   - ✅ Recordatorios de hoy
   - ✅ Recordatorios vencidos
   - ✅ Completar recordatorio
   - ✅ Badge de pendientes

7. **Persistencia** (2 tests)
   - ✅ Cargar desde localStorage
   - ✅ Actualizar localStorage

8. **Responsividad** (1 test)
   - ✅ Vista mobile

**Total: 30+ tests**

---

## 🧪 Tests Unitarios

### Storage (`tests/unit/storage.test.js`)

Tests de funciones de localStorage y persistencia.

#### Suites:

1. **Guardar cotizaciones** (3 tests)
   - Guardar cotización individual
   - Guardar múltiples cotizaciones
   - Array vacío cuando no hay datos

2. **Actualizar estados** (2 tests)
   - Actualizar estado
   - Mantener otros datos

3. **Notas y seguimiento** (2 tests)
   - Agregar nota al historial
   - Mantener historial previo

4. **Recordatorios** (2 tests)
   - Agregar recordatorio
   - Marcar como completado

**Total: 9 tests**

### Validación (`tests/unit/validation.test.js`)

Tests de funciones de validación de datos del formulario.

#### Suites:

1. **Validación - Año del vehículo** (6 tests)
   - Aceptar años válidos
   - Rechazar años antiguos
   - Rechazar años futuros
   - Rechazar no numéricos
   - Rechazar vacíos
   - Aceptar números

2. **Validación - Código postal** (4 tests)
   - Aceptar códigos válidos
   - Rechazar muy cortos
   - Rechazar muy largos
   - Eliminar espacios

3. **Validación - Nombre** (4 tests)
   - Aceptar nombres válidos
   - Rechazar muy cortos
   - Rechazar vacíos
   - Trimear espacios

4. **Validación - Marca y modelo** (4 tests)
   - Aceptar textos válidos
   - Rechazar muy cortos
   - Rechazar muy largos
   - Trimear espacios

5. **Validación - Cobertura** (3 tests)
   - Aceptar coberturas válidas
   - Case insensitive
   - Rechazar muy cortos

**Total: 21 tests**

### Métricas (`tests/unit/metrics.test.js`)

Tests de cálculo de métricas del panel admin.

#### Suites:

1. **Contadores básicos** (5 tests)
   - Array vacío
   - Contar nuevas
   - Contar vendidas
   - Contar cotizadas
   - Contar perdidas

2. **Conversión** (6 tests)
   - 0% con array vacío
   - 100% conversión
   - 50% conversión
   - 33.3% conversión
   - 0% sin ventas
   - Redondeo correcto

3. **Recordatorios pendientes** (6 tests)
   - Array vacío
   - Filtrar completados
   - Recordatorios vencidos
   - Filtrar futuros
   - Incluir de hoy
   - Ordenar por fecha/hora

4. **Recordatorios de hoy** (3 tests)
   - Solo de hoy
   - Incluir completados
   - Ordenar por hora

5. **A/B Testing** (2 tests)
   - Conversión por versión
   - Versión sin datos

**Total: 22 tests**

---

## 📊 Cobertura

### Generar reporte de cobertura

```bash
npm run test:coverage
```

Genera reportes en:
- **Terminal**: Tabla resumen
- **HTML**: `coverage/index.html` (navegable)
- **LCOV**: `coverage/lcov.info` (para CI)
- **JSON**: `coverage/coverage-final.json`

### Ver reporte HTML

```bash
# Generar y abrir en navegador (Linux)
npm run test:coverage && xdg-open coverage/index.html

# macOS
npm run test:coverage && open coverage/index.html

# Windows
npm run test:coverage && start coverage/index.html
```

### Objetivos de cobertura

Los objetivos están configurados en `vitest.config.js`:

```javascript
coverage: {
  lines: 70,
  functions: 70,
  branches: 70,
  statements: 70
}
```

Si la cobertura cae por debajo del 70%, los tests fallarán.

---

## 🔄 CI/CD

### GitHub Actions

Crear `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright browsers
      run: npm run playwright:install

    - name: Run unit tests
      run: npm run test:coverage

    - name: Run E2E tests
      run: npm run test:e2e

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
```

---

## 📝 Mejores Prácticas

### 1. Nomenclatura de Tests

```javascript
// ✅ BIEN: Descriptivo y específico
test('debe guardar cotización en localStorage con todos los campos', ...)

// ❌ MAL: Vago
test('guardar', ...)
```

### 2. Organización con describe

```javascript
describe('Funcionalidad principal', () => {
  describe('Caso específico 1', () => {
    test('comportamiento esperado', ...)
  })

  describe('Caso específico 2', () => {
    test('otro comportamiento', ...)
  })
})
```

### 3. Setup y Teardown

```javascript
describe('Mi suite', () => {
  beforeEach(() => {
    // Preparar antes de cada test
    localStorage.clear()
  })

  afterEach(() => {
    // Limpiar después de cada test
  })
})
```

### 4. Tests independientes

```javascript
// ✅ BIEN: Test auto-contenido
test('debe calcular conversión', () => {
  const quotes = [/* datos de test */]
  const result = calculateConversion(quotes)
  expect(result).toBe('50.0')
})

// ❌ MAL: Depende de estado global
let globalQuotes = []
test('setup', () => { globalQuotes = [...] })
test('usa globalQuotes', () => { /* depende del test anterior */ })
```

### 5. Esperas en tests E2E

```javascript
// ✅ BIEN: Esperar elemento
await expect(page.locator('text=Bienvenido')).toBeVisible()

// ❌ EVITAR: Timeouts fijos
await page.waitForTimeout(5000) // Solo cuando sea absolutamente necesario
```

### 6. Selectores robustos

```javascript
// ✅ BIEN: Basado en texto o rol
await page.click('button:has-text("Enviar")')
await page.locator('role=button[name="Enviar"]')

// ❌ FRÁGIL: Basado en estructura CSS
await page.click('.container > div > button:nth-child(3)')
```

---

## 🐛 Debugging

### Playwright

```bash
# Modo debug interactivo
npm run test:e2e:debug

# Ejecutar con navegador visible
npm run test:e2e:headed

# Ver trace de un test fallido
npx playwright show-trace trace.zip
```

### Vitest

```bash
# Watch mode con UI
npm run test:ui

# Debug con inspector
node --inspect-brk ./node_modules/vitest/vitest.mjs
```

### VSCode

Agregar configuración en `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Vitest",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["test", "--", "--run"],
      "console": "integratedTerminal"
    }
  ]
}
```

---

## 📚 Recursos

### Documentación oficial

- [Playwright Docs](https://playwright.dev/)
- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)

### Guías y tutoriales

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Vitest Getting Started](https://vitest.dev/guide/)
- [E2E Testing Patterns](https://martinfowler.com/articles/practical-test-pyramid.html)

---

## 🎓 Próximos Pasos

### Mejoras futuras

1. **Tests de Performance**
   - Lighthouse CI
   - Web Vitals
   - Bundle size tracking

2. **Tests de Accesibilidad**
   - axe-core integration
   - ARIA compliance
   - Keyboard navigation

3. **Visual Regression Testing**
   - Percy o Chromatic
   - Screenshot comparison

4. **API Mocking**
   - Mock de Google Sheets API
   - Mock de integraciones externas

5. **Tests de Seguridad**
   - XSS prevention
   - CSRF tokens
   - Input sanitization

---

## 👥 Contribuir

### Agregar nuevos tests

1. Crear archivo en `tests/e2e/` o `tests/unit/`
2. Seguir convención de nombres: `*.spec.js` o `*.test.js`
3. Ejecutar tests localmente
4. Verificar cobertura
5. Enviar PR

### Reportar bugs en tests

Abrir issue en GitHub con:
- Comando ejecutado
- Output del error
- Sistema operativo
- Versión de Node.js

---

## 📄 Licencia

MIT - Ayma Advisors 2025

---

**¿Preguntas?** Contactá al equipo de desarrollo o abrí un issue en GitHub.
