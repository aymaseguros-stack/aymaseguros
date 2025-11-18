# TODO - Ayma Seguros

**Última actualización:** 18 de Noviembre, 2025
**Estado del proyecto:** MVP Funcional con Deuda Técnica Significativa

---

## 🔴 CRÍTICO - Seguridad (Prioridad Máxima)

### SEG-001: Credenciales Expuestas en Código
- **Archivo:** `admin.html:71-74`
- **Problema:** Usuario y contraseña hardcodeados en el HTML
  ```javascript
  const ADMIN_CREDENTIALS = {
    username: 'ayma',
    password: 'Mimamamemima14'
  };
  ```
- **Acción requerida:**
  - [ ] Implementar autenticación con backend real (Firebase Auth, Auth0, o JWT)
  - [ ] Migrar a variables de entorno
  - [ ] Cambiar credenciales actuales inmediatamente
  - [ ] Implementar hash de contraseñas (bcrypt, Argon2)
  - [ ] Agregar autenticación de dos factores (2FA)

### SEG-002: URLs de API Expuestas
- **Archivo:** `admin.html:146`
- **Problema:** URL de Google Apps Script visible en el código fuente
  ```javascript
  fetch('https://script.google.com/macros/s/AKfycbyswrAaKIMFD6_cKmj74RcPggQJUVf_m7fvRFZzSgseVUl1RGr7Au_4dlPUu5CXLf_5/exec', ...)
  ```
- **Acción requerida:**
  - [ ] Mover URL a variable de entorno
  - [ ] Implementar proxy backend para ocultar endpoint real
  - [ ] Agregar rate limiting
  - [ ] Implementar autenticación de API keys

### SEG-003: Sin Validación del Lado del Servidor
- **Problema:** Toda la validación se hace en el cliente
- **Acción requerida:**
  - [ ] Implementar backend con validación robusta
  - [ ] Sanitizar inputs antes de guardar en Google Sheets
  - [ ] Prevenir inyección de código (XSS, SQL injection si migran a DB)
  - [ ] Validar tipos de datos y formatos

### SEG-004: Datos Sensibles en localStorage
- **Problema:** Información de clientes sin encriptar en navegador
- **Acción requerida:**
  - [ ] Implementar encriptación client-side (CryptoJS, Web Crypto API)
  - [ ] Considerar migración a backend con sesiones seguras
  - [ ] Implementar política de expiración de datos

---

## 🟠 ALTO - Arquitectura y Refactoring

### ARCH-001: Archivos HTML Monolíticos
- **Problema:**
  - `index.html`: 722 líneas
  - `admin.html`: 608 líneas
  - Código mezclado (HTML + CSS + JavaScript + React)
- **Acción requerida:**
  - [ ] Migrar a estructura de proyecto modular (Vite, Create React App, Next.js)
  - [ ] Separar componentes React en archivos individuales
  - [ ] Extraer estilos a archivos CSS/SCSS separados
  - [ ] Crear carpetas: `/components`, `/utils`, `/hooks`, `/styles`

**Estructura propuesta:**
```
aymaseguros/
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── BenefitsSection.jsx
│   │   │   ├── WhyChooseUs.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── ChatBot.jsx
│   │   │   └── Footer.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── QuotesList.jsx
│   │       ├── Calendar.jsx
│   │       └── ReminderModal.jsx
│   ├── utils/
│   │   ├── storage.js
│   │   ├── validation.js
│   │   └── api.js
│   ├── hooks/
│   │   ├── useQuotes.js
│   │   └── useReminders.js
│   ├── styles/
│   │   └── tailwind.config.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

### ARCH-002: Dependencias sin Control de Versiones
- **Problema:** React, Tailwind, Chart.js cargados desde CDN sin versión fija
- **Acción requerida:**
  - [ ] Migrar a package.json con versiones específicas
  - [ ] Implementar npm/yarn para gestión de dependencias
  - [ ] Configurar bundler (Vite, Webpack)
  - [ ] Implementar versioning semántico

### ARCH-003: Sin Sistema de Build
- **Problema:** Babel transpila JSX en tiempo de ejecución en el navegador
- **Acción requerida:**
  - [ ] Configurar build pipeline (Vite, Webpack, Rollup)
  - [ ] Implementar transpilación en build time
  - [ ] Minificación y optimización de assets
  - [ ] Tree shaking para reducir bundle size

### ARCH-004: Sin Backend Propio
- **Problema:** Dependencia total de localStorage y Google Sheets
- **Acción requerida:**
  - [ ] Implementar backend (Node.js + Express, Next.js API Routes, Supabase)
  - [ ] Migrar a base de datos real (PostgreSQL, MongoDB, Firebase)
  - [ ] Implementar API RESTful o GraphQL
  - [ ] Configurar CORS y seguridad

---

## 🟡 MEDIO - Funcionalidades Incompletas

### FUNC-001: Integración de Google Sheets Incompleta
- **Archivo:** `admin.html:146-165`, `index.html:615-633`
- **Problema:** Código preparado pero no completamente funcional
- **Acción requerida:**
  - [ ] Completar configuración de Google Apps Script
  - [ ] Implementar manejo de errores robusto
  - [ ] Agregar retry logic para fallos de red
  - [ ] Implementar sincronización bidireccional
  - [ ] Agregar logs de auditoría

### FUNC-002: Sistema de Email Básico
- **Archivo:** `index.html:650-660`
- **Problema:** Solo genera enlaces `mailto:` básicos
- **Acción requerida:**
  - [ ] Implementar servicio de email real (SendGrid, Mailgun, AWS SES)
  - [ ] Crear templates HTML para emails
  - [ ] Implementar confirmaciones de envío
  - [ ] Agregar tracking de emails abiertos/clicks
  - [ ] Configurar dominio personalizado para emails

### FUNC-003: Chatbot Sin Inteligencia Real
- **Archivo:** `index.html:267-465`
- **Problema:** Flujo secuencial simple, no conversacional real
- **Acción requerida:**
  - [ ] Integrar IA conversacional (OpenAI, Anthropic Claude, DialogFlow)
  - [ ] Implementar NLP para entender preguntas abiertas
  - [ ] Agregar recomendaciones personalizadas
  - [ ] Implementar respuestas a FAQs automáticas
  - [ ] Agregar recuperación de contexto en conversación

### FUNC-004: Gráficos No Implementados
- **Archivo:** `admin.html:17` (Chart.js importado pero no usado)
- **Problema:** Librería cargada sin uso
- **Acción requerida:**
  - [ ] Implementar gráfico de cotizaciones por mes
  - [ ] Gráfico de conversión (funnel)
  - [ ] Gráfico de coberturas más solicitadas
  - [ ] Gráfico de marcas/modelos más cotizados
  - [ ] Dashboard visual con métricas en tiempo real

### FUNC-005: Sin Sistema de Notificaciones
- **Acción requerida:**
  - [ ] Implementar notificaciones push (Service Workers, Firebase Cloud Messaging)
  - [ ] Notificaciones de recordatorios vencidos
  - [ ] Alertas de nuevas cotizaciones
  - [ ] Recordatorios de seguimiento a clientes

### FUNC-006: Sin Exportación de Datos
- **Acción requerida:**
  - [ ] Exportar cotizaciones a CSV/Excel
  - [ ] Exportar reportes en PDF
  - [ ] Backup automático de datos
  - [ ] Importar datos desde otras fuentes

---

## 🟢 BAJO - Mejoras y Optimización

### PERF-001: Performance Web
- **Acción requerida:**
  - [ ] Implementar lazy loading de componentes
  - [ ] Code splitting por ruta
  - [ ] Optimización de imágenes (WebP, responsive images)
  - [ ] Implementar Service Workers para caché
  - [ ] Reducir bundle size (actualmente carga todo React desde CDN)
  - [ ] Implementar caché busting
  - [ ] Optimizar Web Vitals (LCP, FID, CLS)

### PERF-002: Optimización de localStorage
- **Problema:** Cargas completas sin paginación
- **Acción requerida:**
  - [ ] Implementar paginación en lista de cotizaciones
  - [ ] Lazy loading de datos
  - [ ] Indexación para búsquedas rápidas
  - [ ] Limpieza de datos antiguos automática

### TEST-001: Sin Testing
- **Acción requerida:**
  - [ ] Configurar framework de testing (Vitest, Jest)
  - [ ] Tests unitarios para componentes React
  - [ ] Tests de integración para flujos críticos
  - [ ] Tests E2E con Playwright o Cypress
  - [ ] Tests de accesibilidad (axe-core)
  - [ ] Configurar CI/CD con tests automáticos

### DOC-001: Documentación Mínima
- **Problema:** README de 2 líneas
- **Acción requerida:**
  - [ ] Documentar arquitectura del proyecto
  - [ ] Guía de instalación y setup
  - [ ] Documentación de componentes
  - [ ] Guía de contribución
  - [ ] Documentación de API (cuando se implemente)
  - [ ] Ejemplos de uso

### DEV-001: Sin Herramientas de Desarrollo
- **Acción requerida:**
  - [ ] Configurar ESLint con reglas de React
  - [ ] Configurar Prettier para formateo consistente
  - [ ] Implementar pre-commit hooks con Husky
  - [ ] Configurar EditorConfig
  - [ ] Agregar scripts útiles en package.json
  - [ ] Configurar debugging (source maps)

### UX-001: Mejoras de Experiencia de Usuario
- **Acción requerida:**
  - [ ] Implementar loading states en todas las acciones asíncronas
  - [ ] Mejorar mensajes de error (más descriptivos)
  - [ ] Agregar animaciones de transición
  - [ ] Implementar modo oscuro
  - [ ] Mejorar accesibilidad (ARIA labels, navegación por teclado)
  - [ ] Agregar feedback visual en todas las interacciones

### UX-002: Panel Admin - Mejoras
- **Acción requerida:**
  - [ ] Implementar búsqueda/filtrado de cotizaciones
  - [ ] Ordenamiento por columnas
  - [ ] Exportar listado filtrado
  - [ ] Vista de comparación de múltiples cotizaciones
  - [ ] Estadísticas avanzadas (tiempo promedio de conversión, etc.)
  - [ ] Integración con calendario real (Google Calendar)

### FEAT-001: Nuevas Funcionalidades
- **Landing Page:**
  - [ ] Calculadora de ahorro interactiva
  - [ ] Comparador de coberturas en tiempo real
  - [ ] Sección de blog/artículos educativos
  - [ ] FAQs expandibles
  - [ ] Video explicativo
  - [ ] Chat en vivo con agente

- **Panel Admin:**
  - [ ] Sistema de roles (admin, vendedor, soporte)
  - [ ] Asignación de cotizaciones a vendedores
  - [ ] Pipeline de ventas visual (Kanban)
  - [ ] Automatización de seguimientos
  - [ ] Integración con CRM externo
  - [ ] Reportes personalizables

### SEO-001: Optimizaciones SEO Adicionales
- **Acción requerida:**
  - [ ] Implementar sitemap.xml
  - [ ] Configurar robots.txt
  - [ ] Mejorar estructura de URLs (cuando se implemente routing)
  - [ ] Agregar Open Graph tags para redes sociales
  - [ ] Implementar schema.org markup adicional
  - [ ] Optimizar meta descriptions
  - [ ] Agregar breadcrumbs

### ANALYTICS-001: Tracking y Analítica
- **Acción requerida:**
  - [ ] Implementar Google Analytics 4
  - [ ] Facebook Pixel para remarketing
  - [ ] Hotjar o similar para heatmaps
  - [ ] Tracking de eventos críticos (cotización iniciada, completada)
  - [ ] Funnel de conversión
  - [ ] A/B testing framework (Google Optimize, VWO)

---

## 🔧 Deuda Técnica Identificada

### DT-001: Fixes Recientes
**Commits recientes muestran bugs de sintaxis:**
- b1f92de: Fix de cierre de div en header del chat
- 87351b9: Fix de div faltante en container principal
- 8e9d98a: Fix de sintaxis localStorage.setItem
- c59722c: Fix de useEffect huérfano

**Acción requerida:**
- [ ] Implementar linter para prevenir estos errores
- [ ] Code review process
- [ ] Tests automáticos para detectar errores de sintaxis

### DT-002: Duplicación de Código
- **Problema:** Lógica similar en index.html y admin.html para manejo de localStorage
- **Acción requerida:**
  - [ ] Extraer utilidades compartidas a módulos reutilizables
  - [ ] Implementar arquitectura DRY (Don't Repeat Yourself)

### DT-003: Sin Manejo de Errores Consistente
- **Acción requerida:**
  - [ ] Implementar sistema centralizado de manejo de errores
  - [ ] Logging de errores a servicio externo (Sentry, LogRocket)
  - [ ] Error boundaries en React
  - [ ] Fallbacks para errores de red

---

## 📋 Roadmap Sugerido

### Fase 1 - Seguridad y Estabilidad (1-2 semanas)
1. ✅ Implementar autenticación segura (SEG-001)
2. ✅ Ocultar URLs de API (SEG-002)
3. ✅ Implementar validación server-side (SEG-003)
4. ✅ Configurar linter y formatter (DEV-001)
5. ✅ Agregar tests básicos (TEST-001)

### Fase 2 - Refactoring Arquitectónico (2-3 semanas)
1. ✅ Migrar a Vite/Next.js (ARCH-001)
2. ✅ Modularizar componentes (ARCH-001)
3. ✅ Implementar package.json con dependencias (ARCH-002)
4. ✅ Configurar build pipeline (ARCH-003)

### Fase 3 - Backend e Integración (2-3 semanas)
1. ✅ Implementar backend propio (ARCH-004)
2. ✅ Migrar a base de datos real (ARCH-004)
3. ✅ Completar integración Google Sheets (FUNC-001)
4. ✅ Implementar sistema de emails real (FUNC-002)

### Fase 4 - Funcionalidades Avanzadas (3-4 semanas)
1. ✅ Integrar IA en chatbot (FUNC-003)
2. ✅ Implementar gráficos y dashboards (FUNC-004)
3. ✅ Sistema de notificaciones (FUNC-005)
4. ✅ Exportación de datos (FUNC-006)

### Fase 5 - Optimización y Experiencia (2 semanas)
1. ✅ Optimizaciones de performance (PERF-001, PERF-002)
2. ✅ Mejoras de UX (UX-001, UX-002)
3. ✅ Implementar analytics (ANALYTICS-001)
4. ✅ Testing E2E completo (TEST-001)

### Fase 6 - Documentación y Launch (1 semana)
1. ✅ Documentación completa (DOC-001)
2. ✅ Configurar CI/CD
3. ✅ Auditoría de seguridad final
4. ✅ Launch a producción

---

## 📊 Métricas de Éxito

### Performance
- [ ] Lighthouse Score > 90 en todas las categorías
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 200KB (gzipped)

### Conversión
- [ ] Tasa de completación de chatbot > 60%
- [ ] Tasa de conversión cotización → venta > 15%
- [ ] Tiempo promedio de cotización < 2 minutos

### Calidad de Código
- [ ] Cobertura de tests > 80%
- [ ] 0 vulnerabilidades de seguridad críticas
- [ ] 0 errores de linter
- [ ] Complejidad ciclomática < 10 en todos los módulos

---

## 🎯 Quick Wins (Victorias Rápidas)

Tareas que pueden completarse en < 2 horas con alto impacto:

1. **Cambiar credenciales de admin** (SEG-001) - 15 min
2. **Agregar .env y gitignore** - 30 min
3. **Configurar Prettier** (DEV-001) - 30 min
4. **Mejorar README** (DOC-001) - 1 hora
5. **Implementar loading states** (UX-001) - 1.5 horas
6. **Agregar Google Analytics** (ANALYTICS-001) - 30 min
7. **Optimizar imágenes** (PERF-001) - 1 hora
8. **Agregar meta tags sociales** (SEO-001) - 30 min

---

## 📝 Notas Adicionales

### Dependencias Actuales (CDN)
```html
<!-- React 18 -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Babel Standalone -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<!-- Tailwind CSS 3 -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Chart.js 4.4 -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

### Información de Contacto del Proyecto
- **WhatsApp:** +54 9 341 695-2259
- **URL:** https://aymaseguros.vercel.app/
- **Ubicación:** Rosario, Santa Fe, Argentina
- **Año de fundación:** 2008

---

**Creado por:** Claude AI
**Fecha:** 18 de Noviembre, 2025
**Versión:** 1.0.0
