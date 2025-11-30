# Política de Seguridad

## Versiones Soportadas

| Versión | Soportada |
|---------|-----------|
| 1.2.x   | ✅        |
| < 1.2   | ❌        |

## Reportar Vulnerabilidades

Contactar: aymaseguros@hotmail.com

**No publicar vulnerabilidades en Issues públicos.**

## Datos Sensibles

Este proyecto NO almacena:
- Contraseñas
- Datos de tarjetas
- Información personal en frontend

Los leads se envían directamente a WhatsApp.
EO
mkdir -p .github/workflows
cat > .github/workflows/tests.yml << 'EOF'
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test --if-present
      
      - name: Build
        run: npm run build
