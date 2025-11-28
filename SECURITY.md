# 🔒 Política de Seguridad

## Versiones Soportadas

Actualmente mantenemos las siguientes versiones:

| Versión | Soportada          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## Reportar una Vulnerabilidad

La seguridad de Ayma Seguros es nuestra prioridad. Si descubrís una vulnerabilidad de seguridad, por favor seguí estos pasos:

### 🚨 NO Crear Issues Públicos

**Por favor NO reportes vulnerabilidades de seguridad a través de issues públicos de GitHub.**

### ✅ Reportar Privadamente

1. **Email:** Enviá un email a [seguridad@aymaseguros.com.ar](mailto:seguridad@aymaseguros.com.ar)
2. **Incluí:**
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir
   - Versiones afectadas
   - Posible impacto
   - Sugerencias de fix (si tenés)

### ⏱️ Tiempo de Respuesta

- **Confirmación inicial:** Dentro de 48 horas
- **Evaluación:** 1-5 días laborables
- **Fix y release:** Dependiendo de severidad
  - **Crítico:** 24-48 horas
  - **Alto:** 1-2 semanas
  - **Medio:** 2-4 semanas
  - **Bajo:** Próximo release planificado

### 🎖️ Créditos

Reconocemos públicamente a los investigadores de seguridad que reportan vulnerabilidades responsablemente (si desean ser mencionados).

---

## 🛡️ Consideraciones de Seguridad

### Problemas Conocidos

#### 1. Credenciales en el Código (v1.0 - v2.0)

**Estado:** ⚠️ Conocido - En roadmap para fix

**Descripción:** Las credenciales del panel admin están hardcodeadas en `admin.html`.

**Mitigación temporal:**
- Cambiar credenciales manualmente en el código
- Desplegar detrás de VPN o IP whitelist
- Usar autenticación de proxy (Vercel Password Protection)

**Fix planificado:** v3.0 - Backend con JWT authentication

#### 2. Validación Solo Client-Side

**Estado:** ⚠️ Conocido - Limitación arquitectónica

**Descripción:** Toda la validación se hace en el navegador.

**Impacto:** Usuarios malintencionados podrían enviar datos inválidos.

**Mitigación:**
- Validación robusta en cliente
- Backup a Google Sheets con validación adicional
- Sanitización en integración WhatsApp

**Fix planificado:** v3.0 - Backend con validación server-side

#### 3. LocalStorage Sin Encriptación

**Estado:** ⚠️ By Design - Datos no sensibles

**Descripción:** Los datos se almacenan sin encriptar en localStorage.

**Impacto:** Bajo - Solo datos de cotización públicos (no PII sensible).

**Consideraciones:**
- No almacenar contraseñas
- No almacenar números de tarjeta
- Solo datos de contacto básicos

---

## 🔐 Mejores Prácticas

Si estás desplegando Ayma Seguros, recomendamos:

### Para Producción

1. **HTTPS Obligatorio**
   ```
   ✅ https://aymaseguros.vercel.app
   ❌ http://aymaseguros.vercel.app
   ```

2. **Cambiar Credenciales**
   - Modificar usuario/contraseña en `admin.html`
   - Usar contraseñas fuertes (min 12 caracteres)
   - Considerar 2FA en proxy/CDN level

3. **Headers de Seguridad**
   ```nginx
   Content-Security-Policy: default-src 'self'
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
   ```

4. **Rate Limiting**
   - Usar Vercel Edge Config
   - Cloudflare Rate Limiting
   - Limite: 100 requests/minuto por IP

5. **Monitoreo**
   - Google Analytics para detectar anomalías
   - Vercel Analytics para tráfico
   - Logs de errores con Sentry (opcional)

### Para Desarrollo

1. **Nunca commitear:**
   - `.env` con secrets reales
   - Credenciales de producción
   - API keys
   - Tokens de acceso

2. **Usar .env.example:**
   ```bash
   # Copiar y rellenar
   cp .env.example .env
   ```

3. **Dependencies:**
   ```bash
   # Auditar regularmente
   npm audit
   npm audit fix
   ```

---

## 📋 Checklist de Seguridad

Antes de deploy a producción:

- [ ] HTTPS configurado y forzado
- [ ] Credenciales de admin cambiadas
- [ ] Headers de seguridad configurados
- [ ] Rate limiting activo
- [ ] No hay `.env` commiteado
- [ ] Dependencies auditadas (`npm audit`)
- [ ] Backup de datos configurado
- [ ] Monitoreo activo
- [ ] Plan de respuesta a incidentes documentado

---

## 🚨 En Caso de Brecha de Seguridad

Si creés que ha ocurrido una brecha:

1. **Contención inmediata:**
   - Deshabilitar sistema si es necesario
   - Cambiar todas las credenciales
   - Revisar logs de acceso

2. **Evaluación:**
   - Determinar alcance
   - Identificar datos comprometidos
   - Evaluar impacto

3. **Notificación:**
   - Informar a usuarios afectados
   - Reportar a autoridades si aplica
   - Comunicado público si es necesario

4. **Remediación:**
   - Aplicar fix
   - Verificar no hay backdoors
   - Auditoría completa

5. **Post-mortem:**
   - Documentar incidente
   - Actualizar procesos
   - Prevenir recurrencia

---

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)
- [Google Security Best Practices](https://developers.google.com/web/fundamentals/security)
- [Vercel Security](https://vercel.com/docs/concepts/security)

---

## 📞 Contacto

**Email de Seguridad:** seguridad@aymaseguros.com.ar

**Para reportes urgentes:**
- WhatsApp: +54 9 341 695-2259 (Solo emergencias)

---

## 🙏 Agradecimientos

Agradecemos a los siguientes investigadores de seguridad:

- *Tu nombre podría estar aquí* - Reportá responsablemente

---

**Última actualización:** 24 de Noviembre, 2024
**Versión de política:** 1.0
