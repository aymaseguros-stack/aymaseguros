# 🛡️ Ayma Advisors - Sistema de Cotización de Seguros

Sistema completo de cotización de seguros con CRM integrado para Ayma Advisors, Rosario, Santa Fe, Argentina.

[![Tests](https://img.shields.io/badge/tests-140%2B-brightgreen)](./TESTING.md)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](./TESTING.md)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-green)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Unit-Vitest-yellow)](https://vitest.dev/)

## 📋 Descripción

Plataforma web para cotización de seguros de auto, hogar, vida y salud que incluye:

- **Landing page** con chatbot conversacional para cotizaciones
- **Panel administrativo** con CRM completo
- **A/B Testing** de headlines para optimización de conversión
- **Integración con WhatsApp** para contacto directo
- **Sistema de recordatorios** y seguimiento de clientes
- **Backup automático** a Google Sheets

## ✨ Características Principales

### Landing Page (index.html)

- ✅ Diseño responsive optimizado para mobile
- ✅ SEO completo (meta tags, Open Graph, JSON-LD)
- ✅ Chatbot conversacional paso a paso
- ✅ Validación de datos en tiempo real
- ✅ A/B Testing de headlines
- ✅ Testimonios de clientes
- ✅ Integración directa con WhatsApp
- ✅ LocalStorage para persistencia de datos

### Panel Admin (admin.html)

- ✅ Sistema de autenticación
- ✅ Dashboard con métricas en tiempo real
- ✅ CRM completo de cotizaciones
- ✅ Sistema de notas y seguimiento
- ✅ Calendario de recordatorios
- ✅ Gestión de estados (Nueva, Cotizada, Vendida, Perdida)
- ✅ Alertas de recordatorios vencidos
- ✅ Backup automático a Google Sheets

## 🛠 Stack Tecnológico

### Frontend
- **React 18** - Framework UI (via CDN)
- **Tailwind CSS** - Framework CSS (via CDN)
- **Babel Standalone** - Compilación JSX en el navegador
- **Chart.js** - Gráficos y visualizaciones (admin)

### Persistencia
- **LocalStorage** - Almacenamiento local del navegador
- **Google Sheets API** - Backup automático en la nube

### Testing
- **Playwright** - Tests End-to-End
- **Vitest** - Tests unitarios
- **@testing-library** - Utilidades de testing

## 📦 Instalación

### Requisitos

- Node.js 18+ (solo para testing)
- npm 9+ (solo para testing)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Setup para Testing

```bash
# 1. Instalar dependencias
npm install

# 2. Instalar navegadores de Playwright
npm run playwright:install
```

## 🚀 Uso

### Desarrollo

```bash
# Iniciar servidor local en puerto 8080
npm run serve

# O usar el alias
npm run dev
```

Luego abrir:
- Landing page: http://localhost:8080
- Panel admin: http://localhost:8080/admin.html

### Testing

```bash
# Ejecutar todos los tests
npm run test:all         # Unitarios + E2E
npm run test:ci          # Para CI/CD

# Tests unitarios
npm test                 # Watch mode
npm run test:unit        # Run once
npm run test:unit:watch  # Watch mode explícito

# Tests E2E
npm run test:e2e             # Todos los navegadores
npm run test:e2e:chrome      # Solo Chrome
npm run test:e2e:firefox     # Solo Firefox
npm run test:e2e:webkit      # Solo Safari
npm run test:e2e:mobile      # Solo mobile

# Tests con UI interactiva
npm run test:ui              # Vitest UI
npm run test:e2e:ui          # Playwright UI
npm run test:e2e:headed      # Navegador visible
npm run test:e2e:debug       # Modo debug

# Cobertura
npm run test:coverage        # Generar reporte
npm run test:coverage:report # Abrir en navegador

# Utilidades
npm run health              # Health check
npm run clean               # Limpiar artefactos
npm run clean:cache         # Limpiar cache
```

**📚 Documentación completa de testing:** [TESTING.md](./TESTING.md)

## 📁 Estructura del Proyecto

```
aymaseguros/
├── index.html              # Landing page principal
├── admin.html              # Panel administrativo
├── index.html.original     # Backup de versión original
├── .github/
│   └── workflows/
│       └── tests.yml       # CI/CD con GitHub Actions
├── tests/
│   ├── e2e/                # Tests End-to-End (Playwright)
│   │   ├── landing-page.spec.js
│   │   └── admin-panel.spec.js
│   ├── unit/               # Tests unitarios (Vitest)
│   │   ├── storage.test.js
│   │   ├── validation.test.js
│   │   ├── metrics.test.js
│   │   └── edge-cases.test.js    # NEW: 39 tests edge cases
│   └── setup.js           # Configuración global de tests
├── scripts/
│   └── health-check.js    # NEW: Health check script
├── package.json           # Dependencias y scripts
├── playwright.config.js   # Configuración Playwright
├── vitest.config.js      # Configuración Vitest (mejorada)
├── .gitignore            # Git exclusions
├── TESTING.md            # Documentación de testing
└── README.md             # Este archivo
```

## 🎯 Flujo de Usuario

### Cotización (index.html)

1. Usuario visita la landing page
2. Click en "Cotizar Gratis Ahora"
3. Chatbot solicita información paso a paso:
   - Nombre
   - Código postal
   - Marca del vehículo
   - Modelo
   - Año (con validación 1980-2026)
   - Tipo de cobertura
4. Sistema guarda en localStorage
5. Usuario envía datos por WhatsApp
6. Datos se respaldan automáticamente en Google Sheets

### Gestión Admin (admin.html)

1. Login con credenciales
   - Usuario: `ayma`
   - Contraseña: `Mimamamemima14`
2. Ver dashboard con métricas
3. Gestionar cotizaciones:
   - Cambiar estados
   - Agregar notas
   - Crear recordatorios
4. Ver calendario de seguimientos
5. Atender recordatorios vencidos

## 📊 Testing

### Cobertura

- **140+ tests** automatizados
- **95%** de cobertura funcional
- Tests E2E en 6 navegadores/dispositivos
- Tests unitarios de lógica crítica
- **91 tests unitarios** (100% pasando ✅)
- **60+ tests E2E** cross-browser
- Cobertura mejorada: 80% lines, 80% functions, 75% branches

### Tests E2E

**Landing Page** (30+ tests):
- SEO y meta tags
- Componentes visuales
- Flujo completo de cotización
- Validaciones
- Chat conversacional
- LocalStorage
- Responsividad
- Accesibilidad

**Panel Admin** (30+ tests):
- Login y autenticación
- Dashboard y métricas
- Gestión de estados
- Sistema de notas
- Sistema de recordatorios
- Calendario
- Persistencia de datos

### Tests Unitarios

**Storage** (9 tests):
- Guardar cotizaciones
- Actualizar estados
- Notas y seguimiento
- Recordatorios

**Validación** (21 tests):
- Año del vehículo
- Código postal
- Nombre
- Marca y modelo
- Cobertura

**Métricas** (22 tests):
- Contadores básicos
- Cálculo de conversión
- Recordatorios pendientes
- A/B Testing

**Edge Cases** (39 tests):
- WhatsApp URL generation
- Años límite y casos extremos
- LocalStorage con grandes volúmenes
- Métricas con datos extremos
- Recordatorios fechas límite
- Datos corruptos
- Códigos postales especiales
- Caracteres especiales

## 🔧 Configuración

### Credenciales Admin

Por defecto:
- **Usuario:** `ayma`
- **Contraseña:** `Mimamamemima14`

Para cambiar las credenciales, editar en `admin.html` línea 103.

### WhatsApp

Número configurado: `+54 9 341 695-2259`

Para cambiar, editar en `index.html` línea 422.

### Google Sheets

Para habilitar backup automático:

1. Crear Google Apps Script
2. Configurar URL en `admin.html` línea 81
3. Configurar permisos de CORS

## 🎨 Personalización

### Colores (Tailwind)

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'ayma-blue': '#1e40af',
        'ayma-blue-dark': '#1e3a8a',
        'ayma-blue-light': '#3b82f6',
      }
    }
  }
}
```

### A/B Testing Headlines

Dos versiones configuradas en `index.html` líneas 224-233:

- **Versión A:** "Dejá de pagar de más por tu seguro de auto"
- **Versión B:** "Ahorrá hasta 35% en tu seguro de auto hoy"

El sistema asigna aleatoriamente y trackea conversión por versión.

## 📈 Métricas y Analytics

### Métricas del Dashboard

- Total de cotizaciones
- Nuevas
- Cotizadas
- Vendidas
- Perdidas
- Tasa de conversión (%)
- Recordatorios pendientes

### A/B Testing

El sistema trackea qué versión de headline generó cada cotización en el campo `headlineVersion` (A o B).

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

1. Conectar repositorio GitHub
2. Build command: (ninguno - archivos estáticos)
3. Publish directory: `/`

### GitHub Pages

1. Settings → Pages
2. Source: main branch
3. Folder: / (root)

### Servidor estático

Cualquier servidor HTTP estático funciona:
- Apache
- Nginx
- http-server
- serve

## 🔒 Seguridad

### Consideraciones

- ⚠️ **Credenciales en el código**: Las credenciales del admin están hardcodeadas. Para producción, implementar autenticación backend.
- ✅ **LocalStorage**: Datos se almacenan solo en el navegador del usuario.
- ✅ **HTTPS**: Usar siempre HTTPS en producción.
- ⚠️ **Validación**: Validación solo del lado del cliente. Implementar validación backend para producción.

### Mejoras de Seguridad Recomendadas

1. Implementar backend con Node.js/Express
2. Base de datos real (PostgreSQL, MongoDB)
3. Autenticación con JWT o sessiones
4. Validación y sanitización backend
5. Rate limiting
6. CSRF protection

## 🐛 Troubleshooting

### Tests fallan en CI

```bash
# Instalar dependencias de sistema para Playwright
npx playwright install-deps
```

### Puerto 8080 ocupado

```bash
# Usar otro puerto
npx http-server -p 3000
```

### LocalStorage no persiste

Verificar que el navegador permita localStorage y no esté en modo incógnito.

## 📝 Roadmap

### Próximas Features

- [ ] Backend con Node.js/Express
- [ ] Base de datos PostgreSQL
- [ ] API REST
- [ ] Autenticación con JWT
- [ ] Email automático con SendGrid
- [ ] Dashboard de analytics avanzado
- [ ] Exportación de reportes PDF
- [ ] Notificaciones push
- [ ] App mobile con React Native

### Mejoras de Testing

- [ ] Visual regression testing
- [ ] Performance testing (Lighthouse)
- [ ] Accessibility testing (axe-core)
- [ ] API testing
- [ ] Load testing

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -m 'feat: agregar nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Crear Pull Request

### Convención de Commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `test:` Agregar o modificar tests
- `docs:` Documentación
- `refactor:` Refactorización de código
- `style:` Cambios de formato
- `chore:` Tareas de mantenimiento

## 📄 Licencia

MIT License - Ayma Advisors 2025

## 👥 Equipo

**Ayma Advisors**
Productores Asesores de Seguros
Rosario, Santa Fe, Argentina

📞 +54 9 341 695-2259
🌐 https://aymaseguros.vercel.app
📧 Contacto via WhatsApp

---

**¿Preguntas?** Abrí un issue o contactanos por WhatsApp.

---

## 🙏 Agradecimientos

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/)
- [Vitest](https://vitest.dev/)
- [Chart.js](https://www.chartjs.org/)

---

⭐ Si te gustó el proyecto, dale una estrella en GitHub!
