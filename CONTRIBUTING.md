# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Ayma Seguros! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Setup del Entorno](#setup-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Guías de Estilo](#guías-de-estilo)
- [Testing](#testing)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)

---

## 📜 Código de Conducta

Este proyecto adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables.

### Nuestros Valores

- **Respeto:** Trata a todos con respeto y consideración
- **Apertura:** Acepta diferentes puntos de vista y experiencias
- **Colaboración:** Trabaja en conjunto hacia objetivos comunes
- **Profesionalismo:** Mantén un ambiente profesional

---

## 🎯 ¿Cómo puedo contribuir?

### Reportar Bugs

Antes de crear un bug report:
1. Verifica que el bug no haya sido reportado previamente
2. Asegúrate de usar la última versión
3. Reproduce el bug de forma consistente

**Template de Bug Report:**
```markdown
**Descripción del Bug**
Descripción clara y concisa del bug.

**Pasos para Reproducir**
1. Ir a '...'
2. Click en '...'
3. Scroll hacia '...'
4. Ver error

**Comportamiento Esperado**
Descripción de lo que esperabas que sucediera.

**Screenshots**
Si aplica, agrega screenshots.

**Entorno**
- OS: [ej. Windows 10]
- Navegador: [ej. Chrome 95]
- Versión: [ej. 2.0.0]
```

### Sugerir Mejoras

Las sugerencias de mejoras son bienvenidas. Incluye:
- **Caso de uso:** ¿Por qué es necesaria?
- **Comportamiento actual:** ¿Qué hace ahora?
- **Comportamiento propuesto:** ¿Qué debería hacer?
- **Alternativas:** ¿Consideraste otras opciones?

### Pull Requests

¡Los PRs son bienvenidos! Para cambios grandes, abre primero un issue para discutir.

---

## 🛠 Setup del Entorno

### Requisitos

- **Node.js:** 18+
- **npm:** 9+
- **Git:** 2.30+
- Navegador moderno

### Instalación

```bash
# 1. Fork y clonar
git clone https://github.com/TU-USUARIO/aymaseguros.git
cd aymaseguros

# 2. Instalar dependencias
npm install

# 3. Instalar navegadores de Playwright
npx playwright install

# 4. Iniciar dev server
npm run dev
```

### Verificar Instalación

```bash
# Correr tests
npm test

# Correr E2E tests
npm run test:e2e

# Build
npm run build
```

---

## 💻 Proceso de Desarrollo

### 1. Crear Branch

```bash
# Actualizar main
git checkout main
git pull origin main

# Crear feature branch
git checkout -b feature/nombre-descriptivo

# O para bugs
git checkout -b fix/nombre-del-bug
```

### 2. Hacer Cambios

- Escribe código limpio y mantenible
- Sigue las guías de estilo
- Agrega tests para nueva funcionalidad
- Actualiza documentación si es necesario

### 3. Testing

```bash
# Tests unitarios
npm test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage

# Todos los tests
npm run test:all
```

**Requisitos:**
- ✅ Todos los tests deben pasar
- ✅ Coverage no debe bajar de 95%
- ✅ No warnings en consola

### 4. Commit

```bash
# Stage changes
git add .

# Commit con mensaje descriptivo
git commit -m "feat: agregar nueva funcionalidad"
```

Ver [Commit Messages](#commit-messages) para convenciones.

### 5. Push y PR

```bash
# Push a tu fork
git push origin feature/nombre-descriptivo

# Crear PR en GitHub
```

---

## 🎨 Guías de Estilo

### JavaScript/React

```javascript
// ✅ BIEN: Usar const/let
const items = [];
let counter = 0;

// ❌ MAL: Usar var
var items = [];

// ✅ BIEN: Arrow functions
const add = (a, b) => a + b;

// ✅ BIEN: Destructuring
const { name, age } = user;

// ✅ BIEN: Template literals
const message = `Hola ${name}`;

// ✅ BIEN: Componentes funcionales
const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
```

### Naming Conventions

```javascript
// Variables y funciones: camelCase
const userName = "Juan";
function getUserName() {}

// Componentes React: PascalCase
const MyComponent = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_ITEMS = 100;

// Archivos componentes: PascalCase.jsx
// Button.jsx, UserCard.jsx

// Archivos utilidades: camelCase.js
// formatDate.js, validation.js
```

### CSS/Tailwind

```jsx
// ✅ BIEN: Tailwind classes ordenadas
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// ✅ BIEN: Condicionales claras
<div className={`base-class ${isActive ? 'active' : 'inactive'}`}>

// ❌ MAL: Clases inline excesivas (extraer a componente)
<div className="p-1 m-1 text-sm font-bold text-blue-500 bg-white border-2...">
```

### HTML/JSX

```jsx
// ✅ BIEN: Atributos en nuevas líneas (componentes grandes)
<Button
  onClick={handleClick}
  disabled={isLoading}
  className="primary"
>
  Click me
</Button>

// ✅ BIEN: Self-closing para componentes sin children
<Avatar src={user.avatar} />

// ✅ BIEN: Accesibilidad
<button aria-label="Cerrar modal" onClick={onClose}>
  ×
</button>
```

---

## 🧪 Testing

### Estructura de Tests

```javascript
// Tests unitarios en tests/unit/
describe('formatDate', () => {
  it('debe formatear fecha correctamente', () => {
    expect(formatDate('2024-11-24')).toBe('24/11/2024');
  });

  it('debe manejar fecha inválida', () => {
    expect(formatDate('invalid')).toBe(null);
  });
});

// Tests E2E en tests/e2e/
test('usuario puede completar cotización', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("Cotizar")');
  // ... más pasos
});
```

### Coverage

Mantener coverage mínimo de **95%**:
- Statements: 95%
- Branches: 90%
- Functions: 95%
- Lines: 95%

```bash
# Ver coverage
npm run test:coverage
```

---

## 📝 Commit Messages

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

### Formato

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

- **feat:** Nueva funcionalidad
- **fix:** Corrección de bug
- **docs:** Cambios en documentación
- **style:** Formateo, punto y coma, etc. (no afecta código)
- **refactor:** Refactorización (no es feat ni fix)
- **test:** Agregar o modificar tests
- **chore:** Tareas de mantenimiento, build, etc.
- **perf:** Mejoras de performance

### Ejemplos

```bash
# Feature
git commit -m "feat: agregar exportación CSV de cotizaciones"

# Bug fix
git commit -m "fix: corregir validación de año en chatbot"

# Documentation
git commit -m "docs: actualizar README con instrucciones de deploy"

# Con scope
git commit -m "feat(admin): agregar filtros en dashboard"

# Con breaking change
git commit -m "feat!: migrar a Vite 5.0

BREAKING CHANGE: Requiere Node 18+"
```

### Reglas

- ✅ Usar imperativo: "agregar" no "agregado" ni "agrega"
- ✅ Primera letra minúscula
- ✅ No punto final
- ✅ Máximo 72 caracteres en primera línea
- ✅ Explicar QUÉ y POR QUÉ, no CÓMO

---

## 🔄 Pull Requests

### Antes de Enviar

- [ ] Todos los tests pasan
- [ ] Coverage mantiene 95%+
- [ ] Código sigue guías de estilo
- [ ] Documentación actualizada
- [ ] Commits bien formateados
- [ ] Branch actualizado con main

### Template de PR

```markdown
## Descripción
Descripción clara de los cambios.

## Tipo de Cambio
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix o feature que causa que funcionalidad existente no funcione como antes)
- [ ] Documentation update

## ¿Cómo se Ha Testeado?
Describe los tests que corriste.

## Checklist
- [ ] Mi código sigue las guías de estilo
- [ ] He revisado mi propio código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Tests unitarios pasan localmente
- [ ] Tests E2E pasan localmente

## Screenshots (si aplica)
```

### Proceso de Review

1. **Automated Checks:** CI corre tests automáticamente
2. **Code Review:** Al menos 1 aprobación requerida
3. **Testing:** Reviewer testea manualmente si es necesario
4. **Merge:** Squash and merge preferido

### Después del Merge

- Branch será eliminado automáticamente
- Cambios aparecerán en próximo release
- Se actualizará CHANGELOG.md

---

## 🐛 Debugging

### Dev Tools

```javascript
// Logs en desarrollo
console.log('Debug:', value);
console.error('Error:', error);

// Debugging en tests
test('ejemplo', async () => {
  await page.pause(); // Pausa ejecución
});
```

### Common Issues

**Tests fallan localmente:**
```bash
# Limpiar cache
rm -rf node_modules .vitest coverage
npm install
```

**Playwright no encuentra elementos:**
```javascript
// Usar data-testid en vez de text
<button data-testid="submit-button">Submit</button>
await page.click('[data-testid="submit-button"]');
```

---

## 📚 Recursos

- [Documentación React](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Playwright Docs](https://playwright.dev/)
- [Vitest Docs](https://vitest.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ❓ Preguntas

¿Tienes preguntas?

- 📧 Abre un [issue](https://github.com/aymaseguros-stack/aymaseguros/issues)
- 💬 Contacta al equipo

---

## 🙏 Gracias

¡Gracias por contribuir a Ayma Seguros! Cada contribución, grande o pequeña, es valiosa.

---

**Última actualización:** 24 de Noviembre, 2024
