# 🚨 TAREA CRÍTICA: PARSEAR PDF ACARA COMPLETO

## Problema Actual
- Base de datos manual con ~30 modelos FORD
- Faltan modelos: MONDEO, MUSTANG, TERRITORY, etc.
- No cubre todos los años 2000-2025

## Solución Correcta (según GPT-4)

### 1. Usar pdftotext (NO librerías Python)
```bash
# Instalar poppler-utils
brew install poppler  # Mac
sudo apt install poppler-utils  # Linux

# Extraer texto con layout
pdftotext -layout public/acara_precios.pdf acara_text.txt
```

### 2. Script Python para construir índice
```python
import re, json

text = open('acara_text.txt','r',encoding='utf8').read()
index = {}

for marca in ['FORD','CHEVROLET','VOLKSWAGEN','FIAT','TOYOTA']:
    blocks = re.split(r'\n(?=[A-Z ]{3,})', text)
    for b in blocks:
        if marca in b:
            años = re.findall(r'\b(20[0-2]\d|2000|201\d)\b', b)
            for a in set(años):
                modelos = re.findall(r'\b([A-Z0-9\- ]{2,30})\s+', b)
                index.setdefault(marca, {}).setdefault(a, set()).update(modelos)

# Normalizar y guardar
for m in index:
    for a in index[m]:
        index[m][a] = sorted(list(index[m][a]))

with open('public/acara_index.json','w') as f:
    json.dump(index, f, ensure_ascii=False, indent=2)
```

### 3. Opción avanzada: Parsear tablas
```bash
pip install "camelot-py[cv]" pandas
```
```python
import camelot
tables = camelot.read_pdf('public/acara_precios.pdf', 
                         pages='all', 
                         flavor='stream')  # o 'lattice'
# Procesar DataFrames
```

### 4. Frontend updates
- Usar fuzzy matching (fuse.js)
- Fallback a año más cercano
- Importar `public/acara_index.json`

## Errores que tuvimos
1. ❌ ESM/CJS mismatch → Usar pdftotext CLI
2. ❌ pdf-parse not a function → Incompatibilidad versiones
3. ❌ DB manual parcial → Generar desde PDF

## Prioridad: 🔴 ALTA
## Estimado: 2-3 horas
## Fecha: 20/11/2025

## Siguiente paso
1. Instalar poppler: `brew install poppler`
2. Extraer: `pdftotext -layout public/acara_precios.pdf acara_text.txt`
3. Correr script Python
4. Actualizar acaraParser.js para usar JSON
5. Deploy

---
**Nota:** Base actual funciona pero es limitada. 
Cliente puede cotizar pero modelos faltantes dan error.
