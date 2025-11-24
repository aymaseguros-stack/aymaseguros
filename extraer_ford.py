import re

# Leer archivo
with open('acara_completo.txt', 'r', encoding='utf-8') as f:
    texto = f.read()

# Buscar todas las secciones FORD
secciones_ford = re.split(r'^FORD 0km', texto, flags=re.MULTILINE)

print(f"🔍 Encontradas {len(secciones_ford)-1} secciones FORD")

modelos = {}
modelo_actual = None

for seccion in secciones_ford[1:]:  # Saltar primera parte antes de FORD
    lineas = seccion.split('\n')
    
    for linea in lineas[:100]:  # Primeras 100 líneas de cada sección
        linea = linea.strip()
        
        # Línea vacía o separador
        if not linea or linea.startswith('--'):
            continue
            
        # Si NO tiene $, es nombre de modelo
        if '$' not in linea and linea and not any(c.isdigit() for c in linea[:10]):
            modelo_actual = linea
            if modelo_actual not in modelos:
                modelos[modelo_actual] = []
        
        # Si tiene $, es versión
        elif '$' in linea and modelo_actual:
            # Extraer nombre de versión (antes del $)
            partes = linea.split('$')
            if len(partes) >= 2:
                version = partes[0].strip()
                if version and len(version) < 100:  # Filtrar líneas raras
                    modelos[modelo_actual].append(version)

# Mostrar resultados
print(f"\n📊 FORD - {len(modelos)} modelos encontrados:\n")
for modelo, versiones in sorted(modelos.items()):
    print(f"✅ {modelo}: {len(versiones)} versiones")
    for v in versiones[:3]:  # Primeras 3
        print(f"   - {v}")
    if len(versiones) > 3:
        print(f"   ... y {len(versiones)-3} más")

# Guardar JSON
import json
with open('ford_completo.json', 'w', encoding='utf-8') as f:
    json.dump(modelos, f, indent=2, ensure_ascii=False)

print(f"\n✅ Guardado en ford_completo.json")
