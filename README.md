# Ayma Seguros

> Plataforma web para cotización de seguros de auto con panel administrativo integrado

[![Deploy on Vercel](https://vercel.com/button)](https://aymaseguros.vercel.app/)

## 📋 Descripción

Ayma Seguros es una landing page interactiva con panel administrativo para gestión de cotizaciones de seguros de auto. El proyecto incluye un chatbot conversacional para recolectar información de clientes y un CRM simplificado para seguimiento de leads.

**URL de producción:** [https://aymaseguros.vercel.app/](https://aymaseguros.vercel.app/)

## ✨ Características

### Landing Page
- 🤖 **Chatbot conversacional** para cotización en 2 minutos
- 📱 **Diseño responsive** optimizado para mobile y desktop
- 🎨 **UI moderna** con Tailwind CSS y animaciones
- 📊 **A/B Testing** de headlines para optimización de conversión
- 🔗 **Integración directa** con WhatsApp para contacto inmediato
- ⭐ **Testimonios** de clientes verificados
- 🏢 **Aseguradoras asociadas** (Nación Seguros, San Cristóbal, Mapfre, SMG)
- 🔍 **SEO optimizado** con meta tags, structured data (JSON-LD) y Open Graph

### Panel Administrativo
- 📊 **Dashboard** con métricas en tiempo real
- 📝 **Gestión de cotizaciones** con cambio de estados (Nueva, Cotizada, Vendida, Perdida)
- 📅 **Sistema de recordatorios** (llamadas, emails, reuniones, seguimientos)
- 📌 **Notas de contacto** con historial por cliente
- 🔔 **Alertas** de recordatorios vencidos
- 📈 **Métricas de conversión** y rendimiento
- 💾 **Persistencia de datos** en localStorage + Google Sheets

## 🚀 Tecnologías

### Frontend
- **React 18** - Framework UI
- **Tailwind CSS 3** - Framework CSS utility-first
- **Chart.js 4.4** - Visualización de datos (preparado)
- **Babel Standalone** - Transpilación JSX en navegador

### Backend & Almacenamiento
- **localStorage API** - Persistencia local
- **Google Apps Script** - Integración con Google Sheets
- **WhatsApp Business API** - Mensajería directa

### Deployment
- **Vercel** - Hosting y CI/CD automático

## 📁 Estructura del Proyecto

```
aymaseguros/
├── index.html              # Landing page principal (722 líneas)
├── admin.html              # Panel administrativo (608 líneas)
├── index.html.original     # Backup del archivo original
├── README.md               # Este archivo
├── TODO.md                 # Lista de tareas y roadmap
└── .git/                   # Control de versiones
```

## 🔧 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local o deployment en Vercel

### Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/aymaseguros-stack/aymaseguros.git
cd aymaseguros
```

2. **Servir archivos localmente**

Opción A - Python:
```bash
python -m http.server 8000
```

Opción B - Node.js (http-server):
```bash
npx http-server -p 8000
```

Opción C - PHP:
```bash
php -S localhost:8000
```

3. **Abrir en navegador**
```
http://localhost:8000/index.html      # Landing page
http://localhost:8000/admin.html      # Panel admin
```

### Deployment en Vercel

1. **Conectar repositorio a Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

2. **Configurar dominio personalizado** (opcional)
   - Ir a Settings > Domains en dashboard de Vercel
   - Agregar dominio personalizado

## 🔐 Seguridad

### ⚠️ IMPORTANTE - Credenciales de Admin

**Estado actual:** Las credenciales están hardcodeadas en `admin.html` para desarrollo.

**Para producción:**
1. Cambiar credenciales en `admin.html` línea 71-74
2. Implementar autenticación con backend (ver TODO.md)
3. Usar variables de entorno

**Acceso actual al admin:**
- Usuario: `ayma`
- Contraseña: `[contactar al administrador]`

### Variables de Entorno

Crear archivo `.env` con:
```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
WHATSAPP_NUMBER=5493416952259
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

## 📊 Funcionalidades del Chatbot

El chatbot guía al usuario a través de un flujo conversacional:

1. **Bienvenida** - Presentación y solicitud de nombre
2. **Ubicación** - Código postal para determinar zona
3. **Vehículo** - Marca, modelo y año (validación 1980-2026)
4. **Cobertura** - Tipo de seguro deseado (Responsabilidad Civil, Terceros Completo, Todo Riesgo)
5. **Finalización** - Envío a WhatsApp o email

### Datos Recolectados
- Nombre del cliente
- Código postal
- Marca del vehículo
- Modelo del vehículo
- Año (validado entre 1980 y 2026)
- Tipo de cobertura solicitada
- Timestamp de la cotización

## 🎨 Personalización

### Colores (Tailwind Config)
```javascript
colors: {
  'ayma-blue': '#1e40af',
  'ayma-blue-dark': '#1e3a8a',
  'ayma-blue-light': '#3b82f6',
}
```

### Modificar Aseguradoras
Editar sección "Aseguradoras" en `index.html` líneas 150-180

### Agregar/Modificar Testimonios
Editar componente `Testimonials` en `index.html` líneas 185-250

## 📈 Analytics y Tracking

### Eventos Trackeados (preparado para implementar)
- Inicio de cotización
- Completación de cotización
- Click en WhatsApp
- Cambios de estado en admin
- Recordatorios creados/completados

### Implementar Google Analytics
Agregar en `<head>` de index.html y admin.html:
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔗 Integraciones

### Google Sheets
Las cotizaciones se envían automáticamente a Google Sheets para backup.

**Configurar:**
1. Crear Google Apps Script con el código del endpoint
2. Actualizar URL en `admin.html` línea 146 y `index.html` línea 615

### WhatsApp
Mensajes pre-formateados se envían via `wa.me/5493416952259`

**Personalizar mensaje:**
Editar función `formatWhatsAppMessage()` en `index.html` líneas 640-655

## 📱 Responsive Design

El sitio está optimizado para:
- 📱 Mobile (320px - 767px)
- 📱 Tablet (768px - 1023px)
- 💻 Desktop (1024px+)

## 🐛 Debugging

### Verificar Datos en localStorage
```javascript
// En consola del navegador
console.log(JSON.parse(localStorage.getItem('cotizaciones')));
console.log(JSON.parse(localStorage.getItem('reminders')));
```

### Limpiar Datos
```javascript
localStorage.clear();
```

### Logs
Activar logs en consola descomentando líneas de `console.log()` en el código

## 🗺️ Roadmap

Ver archivo [TODO.md](./TODO.md) para roadmap completo y tareas pendientes.

### Próximas Mejoras Planificadas

**Fase 1 - Seguridad (Prioridad Alta)**
- [ ] Implementar autenticación con backend real
- [ ] Ocultar URLs de API en variables de entorno
- [ ] Encriptar datos sensibles en localStorage
- [ ] Validación server-side

**Fase 2 - Arquitectura**
- [ ] Migrar a Vite/Next.js con estructura modular
- [ ] Separar componentes React
- [ ] Implementar sistema de build
- [ ] Configurar package.json con dependencias

**Fase 3 - Funcionalidades**
- [ ] Integrar IA real en chatbot (Claude, GPT)
- [ ] Implementar gráficos en dashboard
- [ ] Sistema de exportación CSV/PDF
- [ ] Notificaciones push

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Guías de Código
- Usar nombres descriptivos para variables y funciones
- Comentar código complejo
- Mantener componentes pequeños y reutilizables
- Seguir convenciones de React y Tailwind

## 📄 Licencia

Este proyecto es privado y propiedad de Ayma Advisors.

## 📞 Contacto

**Ayma Advisors**
- 📍 Rosario, Santa Fe, Argentina
- 📱 WhatsApp: +54 9 341 695-2259
- 🌐 Website: [https://aymaseguros.vercel.app/](https://aymaseguros.vercel.app/)
- 📅 Desde 2008 al servicio de nuestros clientes

## 🙏 Agradecimientos

- Clientes que confían en nuestro servicio desde 2008
- Comunidad de React y Tailwind CSS
- Vercel por el hosting gratuito

---

**Versión:** 1.0.0
**Última actualización:** 18 de Noviembre, 2025
**Mantenido por:** Ayma Advisors Team

---

## 📊 Estadísticas del Proyecto

- **Líneas de código:** ~1,330
- **Componentes React:** 15+
- **Tiempo de carga:** < 3s
- **Conversión promedio:** En medición
- **Clientes atendidos:** +2,500

## 🔍 SEO

### Meta Tags Implementados
- Title, Description, Keywords
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Canonical URL
- Structured Data (LocalBusiness, Organization)

### Performance
- Tailwind CSS cargado desde CDN con purge
- React en modo producción
- Imágenes optimizadas (cuando se agreguen)
- Lazy loading preparado

---

¿Preguntas? Consulta el [TODO.md](./TODO.md) o abre un issue en GitHub.
