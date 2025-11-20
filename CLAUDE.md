# Ayma Advisors - Sistema de Cotización de Seguros

## Descripción General

Ayma Advisors es una plataforma web completa para la cotización y gestión de seguros automotor, hogar, vida y salud. La solución incluye una landing page con chatbot de cotización y un panel administrativo CRM para gestión de leads y seguimientos.

**Ubicación:** Rosario, Santa Fe, Argentina
**Fundación:** 2008
**Contacto:** +54 9 341 695-2259
**URL:** https://aymaseguros.vercel.app/

---

## Arquitectura del Sistema

### Stack Tecnológico

- **Frontend:** React 18 (mediante CDN)
- **UI Framework:** Tailwind CSS (mediante CDN)
- **Transpilador:** Babel Standalone
- **Almacenamiento:** localStorage (navegador)
- **Deployment:** Vercel
- **Tipo:** Aplicación Single Page (SPA) con archivos HTML estáticos

### Estructura de Archivos

```
/
├── index.html              # Landing page principal con chatbot de cotización
├── admin.html              # Panel administrativo CRM
├── index.html.original     # Backup de versión anterior
└── README.md               # Documentación básica
```

---

## Componentes Principales

### 1. Landing Page (index.html)

#### Características SEO

- **Meta tags optimizados** para búsquedas locales (Rosario, Santa Fe)
- **Structured Data (JSON-LD)** con Schema.org para InsuranceAgency
- **Open Graph** y **Twitter Cards** para redes sociales
- **Keywords específicos:** seguros auto Rosario, seguro hogar Santa Fe, etc.
- **Geo-tags** con coordenadas de Rosario (-32.9468, -60.6393)
- **Canonical URL** configurada

#### Sistema de A/B Testing

El sistema alterna automáticamente entre dos versiones de headlines:

**Versión A:**
- Main: "Dejá de pagar de más por tu seguro de auto"
- Sub: "Comparamos las mejores aseguradoras y te conseguimos el mejor precio en menos de 2 minutos"

**Versión B:**
- Main: "Ahorrá hasta 35% en tu seguro de auto hoy"
- Sub: "Miles de clientes ya ahorraron. Cotización gratis en 2 minutos sin compromiso"

La versión mostrada se trackea en `headlineVersion` para análisis de conversión.

#### Chatbot de Cotización

**Flujo conversacional:**

1. **inicio** → Solicita nombre del usuario
2. **codigoPostal** → Solicita código postal
3. **marca** → Marca del vehículo
4. **modelo** → Modelo del vehículo
5. **anio** → Año (validación: 1980-2026)
6. **cobertura** → Tipo de cobertura (RC, Terceros Completo, Terceros con Granizo, Todo Riesgo)
7. **finalizado** → Muestra botón de WhatsApp

**Estados del chatbot:**
- `currentStep`: Paso actual en el flujo
- `currentQuote`: Datos acumulados de la cotización
- `messages`: Historial del chat
- `isTyping`: Indicador de escritura del bot
- `showSuccess`: Muestra panel de éxito al finalizar

#### Funcionalidades de Conversión

**Persistencia de Datos:**
```javascript
saveQuoteToStorage(quote) // Guarda en localStorage
sendToGoogleSheets(quote) // Envía a Google Sheets (configurable)
sendAutoEmail(quote)       // Prepara email automático
```

**Estructura de Cotización:**
```javascript
{
  id: timestamp,
  nombre: string,
  codigoPostal: string,
  marca: string,
  modelo: string,
  anio: string,
  cobertura: string,
  status: 'nueva',
  createdAt: ISO timestamp,
  headlineVersion: 'A' | 'B',
  notes: string,
  contactHistory: array,
  reminders: array
}
```

**Integración WhatsApp:**
- Número: +54 9 341 695-2259
- Mensaje formateado con todos los datos de la cotización
- Se abre en nueva ventana

#### Componentes UI Principales

**AymaLogo Component:**
- Tres tamaños: small, normal, large
- Círculo azul con letra "A" y subtexto "SEGUROS"

**Iconos SVG incluidos:**
- Shield, Clock, TrendingDown, Award, CheckCircle
- Users, Bot, User, Send, MessageCircle, Zap

**Secciones de la Landing:**
1. **Hero** - Headline con A/B testing y CTA principal
2. **Beneficios** - 3 cards (Ahorro 35%, 2 minutos, Mejores aseguradoras)
3. **Por qué elegirnos** - 4 features principales
4. **Garantía de Ahorro** - Promesa destacada
5. **Aseguradoras** - Logos de Nación Seguros, San Cristóbal, Mapfre, SMG
6. **Testimonios** - 3 casos reales con ratings
7. **Social Proof** - +2.500 clientes, rating 4.9/5
8. **Footer** - Información de contacto

**Testimonios incluidos:**
- María González - Rosario Centro - Honda Civic 2019
- Carlos Fernández - Fisherton - Toyota Corolla 2021
- Lucía Martínez - Funes - Volkswagen Gol 2018

---

### 2. Panel Administrativo (admin.html)

#### Sistema de Autenticación

**Credenciales:**
- Usuario: `ayma`
- Contraseña: `Mimamamemima14`

**Seguridad:**
- Validación en frontend (no conectado a backend)
- Estado de autenticación en React state
- Logout limpia el estado

#### Dashboard Principal

**Métricas mostradas:**
1. **Total** - Cotizaciones totales
2. **Nuevas** - Status 'nueva'
3. **Cotizadas** - Status 'cotizada'
4. **Vendidas** - Status 'vendida'
5. **Conversión** - % de vendidas/total
6. **Recordatorios** - Recordatorios pendientes

**Estados de cotización:**
- `nueva` - Recién ingresada
- `cotizada` - Ya se envió cotización
- `vendida` - Cliente cerró la compra
- `perdida` - Cliente no concretó

#### Sistema de Notas y Seguimiento

**Estructura de Nota:**
```javascript
{
  text: string,
  timestamp: ISO timestamp,
  id: timestamp
}
```

**Funcionalidades:**
- Agregar notas ilimitadas por cotización
- Historial cronológico visible
- Modal de entrada de notas

#### Sistema de Recordatorios

**Tipos de recordatorios:**
- 📞 Llamada
- 📧 Email
- 💬 WhatsApp
- 🤝 Reunión
- 📋 Enviar Cotización
- 🔄 Seguimiento

**Estructura de Recordatorio:**
```javascript
{
  date: 'YYYY-MM-DD',
  time: 'HH:MM',
  type: string,
  notes: string,
  completed: boolean,
  id: timestamp
}
```

**Funcionalidades:**
- Programar recordatorios con fecha/hora
- Vista de calendario
- Recordatorios vencidos destacados en rojo
- Recordatorios del día
- Marcar como completado/reabrir

#### Vista de Calendario

**Secciones:**
1. **Recordatorios Vencidos** - Alerta roja con contador
2. **Hoy** - Recordatorios del día actual

**Features:**
- Ordenamiento por fecha/hora
- Filtrado por estado (completado/pendiente)
- Indicador visual de cantidad en el header
- Toggle completado/no completado

#### Backup y Persistencia

**localStorage:**
- Key: `ayma_quotes`
- Formato: Array de objetos JSON
- Auto-reload cada 5 segundos

**Google Sheets Integration:**
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyswrAaKIMFD6_cKmj74RcPggQJUVf_m7fvRFZzSgseVUl1RGr7Au_4dlPUu5CXLf_5/exec';
```
- Envío automático en cada guardado
- Mode: 'no-cors'
- Payload: `{ quotes, timestamp }`

#### UI del Admin

**Navegación:**
- 📊 Dashboard - Vista principal de cotizaciones
- 📅 Calendario - Vista de recordatorios
- Cerrar Sesión

**Card de Cotización:**
- Información del cliente y vehículo
- Botones de acción (Nueva, Cotizada, Vendida, Perdida)
- Agregar Nota
- Programar Recordatorio
- Historial de contacto expandible
- Recordatorios pendientes visibles

---

## Configuración de Tailwind CSS

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

---

## Integraciones Externas

### 1. WhatsApp Business
- **Número:** +54 9 341 695-2259
- **URL Format:** `https://wa.me/5493416952259?text={message}`
- **Uso:** Conversión final del chatbot

### 2. Google Sheets (Configurado)
- **Script URL:** Configurado en admin.html:82
- **Método:** POST con mode 'no-cors'
- **Datos:** Array completo de cotizaciones + timestamp

### 3. Email (Preparado, no implementado)
- **Sistema:** EmailJS o SendGrid (pendiente configuración)
- **Template:** Generado en `sendAutoEmail()` con información de cotización
- **Storage:** Se guarda en localStorage con key `email_pending_{id}`

---

## Flujo de Usuario

### Landing Page Flow

1. Usuario ingresa a la landing
2. Ve propuesta de valor con A/B testing
3. Click en "Cotizar Gratis Ahora"
4. Chatbot inicia conversación
5. Usuario completa datos (nombre, CP, vehículo, cobertura)
6. Sistema guarda en localStorage
7. Muestra botón de WhatsApp
8. Usuario envía datos por WhatsApp
9. Ayma Advisors recibe lead calificado

### Admin Flow

1. Login con credenciales
2. Ve dashboard con todas las cotizaciones
3. Acciones por cotización:
   - Cambiar estado
   - Agregar notas de contacto
   - Programar recordatorios
4. Vista de calendario para seguimientos
5. Sistema auto-guarda en localStorage y Google Sheets

---

## Datos de Prueba

### Testimonios Reales
- 3 testimonios con nombres, ubicaciones, vehículos y ratings
- Rating promedio: 4.8-4.9/5
- +2.500 clientes (dato de social proof)

### Aseguradoras Partner
1. Nación Seguros
2. San Cristóbal
3. Mapfre
4. SMG Seguros

---

## Features Destacadas

### Optimización de Conversión
- CTA pulsante con animación `pulse-glow`
- Colores de alta conversión (verde para CTA)
- Urgencia: "OFERTA EXCLUSIVA: Hasta 35% de descuento"
- Social proof visible
- Garantía de ahorro destacada

### UX del Chatbot
- Animación de typing con 3 puntos
- Delay de 800ms para simular respuesta humana
- Avatares visuales (bot/usuario)
- Mensajes diferenciados por color
- Auto-scroll al final
- Input deshabilitado al finalizar

### Responsive Design
- Tailwind responsive classes (md:, lg:)
- Grid adaptativo
- Mobile-first approach
- Viewport meta tag configurado

---

## Métricas y Analytics

### Trackeo Implementado
- **A/B Testing:** `headlineVersion` guardado en cada cotización
- **Conversión:** Calculada como vendidas/total
- **Timestamp:** Cada cotización tiene `createdAt`
- **Historial:** Array de `contactHistory` por lead

### Métricas Disponibles en Dashboard
- Total de leads
- Leads por estado
- Tasa de conversión
- Recordatorios pendientes

---

## Deployment

### Hosting
- **Plataforma:** Vercel
- **URL:** https://aymaseguros.vercel.app/
- **Tipo:** Static site
- **Build:** No requiere build (HTML estático)

### Configuración de Deploy
- Archivos servidos directamente
- Sin backend necesario
- CDNs externos para dependencias
- localStorage del navegador para persistencia

---

## Mejoras Futuras (Roadmap Sugerido)

### Corto Plazo
1. [ ] Implementar EmailJS o SendGrid para emails automáticos
2. [ ] Añadir Google Analytics 4
3. [ ] Implementar Facebook Pixel
4. [ ] Agregar chat widget de WhatsApp flotante
5. [ ] Notificaciones push de navegador para recordatorios

### Mediano Plazo
1. [ ] Backend con Node.js + Express
2. [ ] Base de datos PostgreSQL o MongoDB
3. [ ] API RESTful para cotizaciones
4. [ ] Sistema de autenticación JWT
5. [ ] Dashboard de analytics avanzado
6. [ ] Exportación a Excel/PDF de cotizaciones
7. [ ] Sistema de roles (admin, vendedor, manager)

### Largo Plazo
1. [ ] App móvil (React Native)
2. [ ] Integración con APIs de aseguradoras
3. [ ] Cotización automática en tiempo real
4. [ ] Sistema de firma digital
5. [ ] Portal del cliente
6. [ ] Sistema de comisiones y reportes

---

## Mantenimiento

### Backup de Datos
- **Automático:** Google Sheets en cada guardado
- **Manual:** Exportar `ayma_quotes` desde localStorage
- **Frecuencia:** Recomendado semanal manual

### Actualizaciones de Dependencias
**CDNs actuales:**
- React 18: https://unpkg.com/react@18/umd/react.production.min.js
- React DOM 18: https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
- Babel Standalone: https://unpkg.com/@babel/standalone/babel.min.js
- Tailwind CSS: https://cdn.tailwindcss.com
- Chart.js 4.4.0: https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js

**Recomendación:** Revisar versiones cada 3-6 meses

---

## Seguridad

### Consideraciones Actuales
⚠️ **Advertencias de Seguridad:**
- Credenciales hardcodeadas en admin.html (línea 103)
- No hay autenticación backend
- localStorage visible en DevTools
- Sin encriptación de datos sensibles

### Recomendaciones de Seguridad
1. Implementar autenticación con backend
2. Usar variables de entorno para credenciales
3. Encriptar datos sensibles en localStorage
4. Implementar HTTPS (Vercel lo hace por defecto)
5. Añadir rate limiting en formularios
6. Implementar CAPTCHA para prevenir spam
7. Validación de inputs en backend

---

## Soporte y Contacto

### Información del Negocio
- **Nombre:** Ayma Advisors
- **Razón Social:** Productores Asesores de Seguros
- **Ubicación:** Rosario, Santa Fe, Argentina
- **Teléfono:** +54 9 341 695-2259
- **Email:** No especificado en el código
- **Horario:** No especificado en el código

### Enlaces Importantes
- **Landing:** https://aymaseguros.vercel.app/
- **Admin:** https://aymaseguros.vercel.app/admin.html

---

## Comandos Útiles para Desarrollo

### Ver datos en localStorage (DevTools Console)
```javascript
// Ver todas las cotizaciones
JSON.parse(localStorage.getItem('ayma_quotes'))

// Limpiar datos
localStorage.removeItem('ayma_quotes')

// Exportar a JSON
console.log(JSON.stringify(JSON.parse(localStorage.getItem('ayma_quotes')), null, 2))
```

### Testing del Chatbot
```javascript
// Reset del chat
localStorage.removeItem('ayma_quotes')
location.reload()
```

---

## Changelog

### Versión Actual (2025-01-18)
- ✅ Landing page con SEO optimizado
- ✅ A/B testing de headlines
- ✅ Chatbot de cotización funcional
- ✅ Panel admin con CRM completo
- ✅ Sistema de recordatorios y calendario
- ✅ Integración con WhatsApp
- ✅ Backup a Google Sheets
- ✅ Responsive design
- ✅ localStorage para persistencia

### Versiones Anteriores
- **index.html.original:** Versión backup anterior a optimizaciones SEO

---

## Licencia

Copyright © 2008-2025 Ayma Advisors. Todos los derechos reservados.

---

## Notas del Desarrollador

### Arquitectura de Archivos HTML Estáticos
Este proyecto utiliza una arquitectura inusual pero efectiva de archivos HTML estáticos con React cargado via CDN. Esto permite:
- Deploy instantáneo sin build
- Sin dependencias de Node.js
- Hosting gratuito en Vercel
- Modificaciones rápidas sin compilar

### Consideraciones de Escalabilidad
El uso de localStorage tiene límites (5-10MB típicamente). Si el negocio crece significativamente, considerar migrar a:
- Backend con base de datos
- API para sincronización
- Caché distribuido

### Personalización
Para personalizar colores, buscar:
- Tailwind config (línea 78-88 en index.html)
- Variables CSS customizadas
- Clases `ayma-blue-*`

---

**Última actualización:** 2025-01-18
**Versión:** 1.0.0
**Mantenedor:** Ayma Advisors Development Team
