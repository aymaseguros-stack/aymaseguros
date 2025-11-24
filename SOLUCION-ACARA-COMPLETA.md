# 🎯 SOLUCIÓN COMPLETA: PARSEAR PDF ACARA

## 📋 PROBLEMA ACTUAL

**Estado:** Base de datos manual limitada (~30 modelos FORD)
**Falta:** MONDEO, MUSTANG, TERRITORY y cientos más
**Impacto:** Bot rechaza modelos válidos → pierde leads

---

## 🚀 SOLUCIÓN RECOMENDADA (3 NIVELES)

### NIVEL 1: FIX INMEDIATO (30 min) ⚡

**Objetivo:** Extraer texto del PDF y buscar por contexto

#### Paso 1: Instalar poppler
```bash
# macOS
brew install poppler

# Linux
sudo apt-get install poppler-utils
```

#### Paso 2: Convertir PDF a texto
```bash
cd ~/aymaseguros-landing
pdftotext -layout public/acara_precios.pdf public/acara_text.txt
wc -c public/acara_text.txt
head -n 50 public/acara_text.txt
```

#### Paso 3: Búsqueda por contexto (Node)
```javascript
// searchAcara.cjs
const fs = require('fs');
const text = fs.readFileSync('./public/acara_text.txt','utf8');

function findBlock(marca, anio) {
  const re = new RegExp(`${marca}[\\s\\S]{0,2000}${anio}`,'i');
  const m = text.match(re);
  if (m) return m[0];
  
  const lines = text.split(/\r?\n/);
  const idx = lines.findIndex(l => l.match(new RegExp(marca,'i')));
  if (idx === -1) return null;
  
  return lines.slice(Math.max(0, idx-6), idx+12).join('\n');
}

console.log(findBlock('FORD','2012') || 'no encontrado');
```

**Ejecutar:**
```bash
node searchAcara.cjs
```

---

### NIVEL 2: ÍNDICE LIGERO (1 día) 📊

**Objetivo:** JSON compacto con marca/año/modelos

#### Script Python para generar índice
```python
# build_index.py
import re, json

text = open('public/acara_text.txt','r',encoding='utf8').read()
index = {}

for marca in ['FORD','CHEVROLET','VOLKSWAGEN','FIAT','TOYOTA']:
    blocks = re.split(r'\n(?=[A-Z ]{3,})', text)
    for b in blocks:
        if marca in b:
            años = re.findall(r'\b(20[0-2]\d|2000|201\d)\b', b)
            for a in set(años):
                modelos = re.findall(r'\b([A-Z0-9\- ]{2,30})\s+', b)
                index.setdefault(marca, {}).setdefault(a, set()).update(modelos)

# Normalizar
for m in index:
    for a in index[m]:
        index[m][a] = sorted(list(index[m][a]))

with open('public/acara_index.json','w',encoding='utf8') as f:
    json.dump(index, f, ensure_ascii=False, indent=2)

print(f"✅ Índice creado: {sum(len(v) for m in index.values() for v in m.values())} versiones")
```

**Ejecutar:**
```bash
python3 build_index.py
ls -lh public/acara_index.json
```

#### Actualizar frontend para usar JSON
```javascript
// src/utils/acaraParser.js
let acaraIndex = null;

export const cargarIndiceACARA = async () => {
  if (!acaraIndex) {
    const response = await fetch('/acara_index.json');
    acaraIndex = await response.json();
  }
  return acaraIndex;
}

export const obtenerModelos = async (marca, anio) => {
  const index = await cargarIndiceACARA();
  return index[marca]?.[anio] || [];
}
```

---

### NIVEL 3: PARSEO ROBUSTO (1-2 semanas) 🔬

**Objetivo:** Tablas completas con versiones exactas y precios

#### Opción A: Camelot (Python)
```bash
pip install "camelot-py[cv]" pandas
```
```python
import camelot
import pandas as pd

tables = camelot.read_pdf('public/acara_precios.pdf', 
                         pages='all', 
                         flavor='stream')  # o 'lattice'

all_data = []
for table in tables:
    df = table.df
    # Procesar DataFrame
    all_data.append(df)

# Normalizar y guardar
```

#### Opción B: Tabula
```bash
pip install tabula-py
```
```python
import tabula

dfs = tabula.read_pdf('public/acara_precios.pdf', 
                     pages='all', 
                     multiple_tables=True)

for df in dfs:
    # Procesar cada tabla
    pass
```

---

## 🎯 ESTRATEGIA RECOMENDADA (Priorizada)

### Corto plazo (AHORA)
1. ✅ `pdftotext` → extraer texto
2. ✅ Búsqueda por contexto (on-demand)
3. ✅ Fuzzy matching para modelos

### Mediano plazo (1 semana)
4. ⏳ Generar `acara_index.json` offline
5. ⏳ Frontend consume JSON estático
6. ⏳ Fallback a año más cercano

### Largo plazo (1 mes)
7. ⏳ Parseo completo con camelot/tabula
8. ⏳ API para consultas
9. ⏳ Cache incremental

---

## ❌ ERRORES QUE TUVIMOS

### 1. ESM/CJS mismatch
**Causa:** `require` vs `import` 
**Solución:** Usar `.cjs` o `pdftotext` CLI

### 2. pdf-parse not a function
**Causa:** Incompatibilidad de versiones
**Solución:** Abandonar librería, usar `pdftotext`

### 3. PDF tabular/escaneado
**Causa:** `data.text` desordenado
**Solución:** Usar `camelot` o `tabula-py`

### 4. DB manual parcial
**Causa:** Confiamos en JSON manual
**Solución:** Generar desde PDF con heurísticas

---

## 📝 COMANDOS COPY/PASTE

### Setup inicial
```bash
cd ~/aymaseguros-landing

# Instalar poppler
brew install poppler  # macOS

# Convertir PDF
pdftotext -layout public/acara_precios.pdf public/acara_text.txt

# Verificar
wc -c public/acara_text.txt
head -100 public/acara_text.txt
```

### Generar índice (Python)
```bash
python3 build_index.py
cat public/acara_index.json | head -50
```

### Generar índice (Node)
```bash
node buildIndex.cjs
ls -lh public/acara_index.json
```

---

## 🔧 MEJORAS FRONTEND

### Fuzzy matching
```bash
npm install fuse.js
```
```javascript
import Fuse from 'fuse.js'

const fuse = new Fuse(modelos, {
  threshold: 0.3,
  keys: ['nombre']
})

const resultado = fuse.search(inputUsuario)
```

### Fallback año cercano
```javascript
const buscarAnioCercano = (marca, anio) => {
  const aniosDisponibles = Object.keys(index[marca] || {}).map(Number)
  if (aniosDisponibles.length === 0) return null
  
  return aniosDisponibles.reduce((prev, curr) => 
    Math.abs(curr - anio) < Math.abs(prev - anio) ? curr : prev
  )
}
```

---

## 📊 ESTIMACIONES

| Nivel | Tiempo | Dificultad | Cobertura |
|-------|--------|------------|-----------|
| 1. Búsqueda contexto | 30 min | Baja | 70% |
| 2. Índice JSON | 1 día | Media | 90% |
| 3. Parseo completo | 1-2 sem | Alta | 100% |

---

## ✅ CHECKLIST IMPLEMENTACIÓN

### Fase 1 (Inmediata)
- [ ] Instalar poppler
- [ ] Convertir PDF con `pdftotext`
- [ ] Crear `searchAcara.cjs`
- [ ] Probar búsqueda FORD 2012

### Fase 2 (1 semana)
- [ ] Script Python `build_index.py`
- [ ] Generar `acara_index.json`
- [ ] Actualizar `acaraParser.js`
- [ ] Implementar fuzzy matching
- [ ] Fallback año cercano

### Fase 3 (1 mes)
- [ ] Instalar camelot/tabula
- [ ] Parsear tablas completas
- [ ] Crear API endpoints
- [ ] Sistema de cache
- [ ] Actualización automática

---

## 📌 ESTADO ACTUAL

**Versión:** 1.0 (20/11/2025)
**Base actual:** Manual, ~30 modelos FORD
**Próximo paso:** Ejecutar Fase 1

**Archivos clave:**
- `public/acara_precios.pdf` (8.9MB)
- `public/acara_text.txt` (generado)
- `public/acara_index.json` (a generar)
- `src/utils/acaraParser.js` (actual)

**Recursos:**
- pdftotext: https://github.com/coolwanglu/pdf2htmlEX
- camelot: https://camelot-py.readthedocs.io
- tabula: https://tabula-py.readthedocs.io
- fuse.js: https://fusejs.io

---

**🎯 ACCIÓN INMEDIATA:** Ejecutar Fase 1 (30 min)
```bash
brew install poppler
cd ~/aymaseguros-landing
pdftotext -layout public/acara_precios.pdf public/acara_text.txt
```

