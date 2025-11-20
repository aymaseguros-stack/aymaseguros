// Generar años completos basados en años conocidos
const generarAnios = (marca, modelosBase) => {
  const resultado = {}
  for (let anio = 2000; anio <= 2025; anio++) {
    // Usar año más cercano disponible
    const aniosCercanos = Object.keys(modelosBase).map(Number).sort()
    const anioCercano = aniosCercanos.reduce((prev, curr) => 
      Math.abs(curr - anio) < Math.abs(prev - anio) ? curr : prev
    )
    resultado[anio] = { ...modelosBase[anioCercano] }
  }
  return resultado
}

const FORD_BASE = {
  2000: { 'KA': ['1.0 Base', '1.3 GL'], 'FIESTA': ['1.3 CLX', '1.6 CLX'], 'ESCORT': ['1.8 GLX'], 'FOCUS': ['1.8 GLX', '2.0 Ghia'], 'ECOSPORT': ['1.6 XLS', '2.0 XLT'], 'RANGER': ['2.5 XL', '2.8 XLT'] },
  2010: { 'KA': ['1.0 Viral', '1.6 Pulse'], 'FIESTA': ['1.6 S', '1.6 SE'], 'FOCUS': ['1.6 S', '2.0 Ghia'], 'ECOSPORT': ['1.6 XLS', '2.0 XLT'], 'RANGER': ['2.5 XL', '3.0 XLT'] },
  2020: { 'KA': ['1.5 S', '1.5 SE'], 'FIESTA': ['1.6 S', '1.6 SE'], 'FOCUS': ['1.6 S', '2.0 SE'], 'ECOSPORT': ['1.5 S', '2.0 Titanium'], 'RANGER': ['2.2 XL', '3.2 XLT'], 'MONDEO': ['2.0 SE', '2.5 Titanium'], 'TERRITORY': ['1.5 SEL', '1.5 Titanium'] }
}

const CHEVROLET_BASE = {
  2000: { 'CORSA': ['1.4 Base', '1.6 GL'], 'VECTRA': ['2.0 GL', '2.2 GLS'] },
  2010: { 'CORSA': ['1.4 Base', '1.8 GLS'], 'CRUZE': ['1.8 LT', '1.8 LTZ'], 'S10': ['2.4 LS', '2.8 LTZ'], 'MONTANA': ['1.4 LS', '1.8 Sport'] },
  2020: { 'ONIX': ['1.0 LT', '1.2 Premier'], 'CRUZE': ['1.4 LT', '1.4 Premier'], 'S10': ['2.8 LS', '2.8 LTZ'], 'TRACKER': ['1.0 LT', '1.2 Premier'] }
}

const VW_BASE = {
  2000: { 'GOL': ['1.6 Power', '1.8 GLI'], 'POLO': ['1.6 Comfortline'], 'BORA': ['1.8T Trendline', '2.0 Highline'] },
  2010: { 'GOL': ['1.6 Power', '1.6 Trend'], 'POLO': ['1.6 Comfortline'], 'SURAN': ['1.6 Trendline'], 'AMAROK': ['2.0 Startline', '2.0 Highline'], 'VENTO': ['1.6 Advance', '2.5 Luxury'] },
  2020: { 'GOL': ['1.6 Trendline'], 'POLO': ['1.6 Trendline', '1.6 Highline'], 'T-CROSS': ['1.6 Trendline', '1.6 Highline'], 'AMAROK': ['2.0 Comfortline', '3.0 Extreme'], 'TAOS': ['1.4 Trendline', '1.4 Highline'] }
}

const VEHICULOS_ACARA = {
  'FORD': generarAnios('FORD', FORD_BASE),
  'CHEVROLET': generarAnios('CHEVROLET', CHEVROLET_BASE),
  'VOLKSWAGEN': generarAnios('VOLKSWAGEN', VW_BASE)
}

const textoANumero = {
  'dos mil': 2000, 'dos mil uno': 2001, 'dos mil dos': 2002, 'dos mil tres': 2003, 'dos mil cuatro': 2004,
  'dos mil cinco': 2005, 'dos mil seis': 2006, 'dos mil siete': 2007, 'dos mil ocho': 2008, 'dos mil nueve': 2009,
  'dos mil diez': 2010, 'dos mil once': 2011, 'dos mil doce': 2012, 'dos mil trece': 2013, 'dos mil catorce': 2014,
  'dos mil quince': 2015, 'dos mil dieciséis': 2016, 'dos mil diecisiete': 2017, 'dos mil dieciocho': 2018,
  'dos mil diecinueve': 2019, 'dos mil veinte': 2020, 'dos mil veintiuno': 2021, 'dos mil veintidós': 2022,
  'dos mil veintitrés': 2023, 'dos mil veinticuatro': 2024, 'dos mil veinticinco': 2025
}

export const validarMarca = (marca) => {
  const marcaUpper = marca.toUpperCase().trim()
  
  if (marcaUpper.includes('?') || marcaUpper.includes('EJEMPLO') || marcaUpper === 'NOSE' || marcaUpper === 'NO SE') {
    return { valido: false, mensaje: '❌ Respuesta inválida.\n\nEscribí la MARCA real.\n\nEjemplo: Ford, Chevrolet' }
  }
  
  const marcas = Object.keys(VEHICULOS_ACARA)
  const marcaEncontrada = marcas.find(m => m.includes(marcaUpper) || marcaUpper.includes(m))
  
  if (!marcaEncontrada) {
    return { valido: false, mensaje: `❌ Marca no disponible.\n\nMarcas:\n${marcas.join(', ')}` }
  }
  
  return { valido: true, marca: marcaEncontrada }
}

export const validarAnio = (input) => {
  const textoLower = input.toLowerCase().trim()
  if (textoANumero[textoLower]) {
    return { valido: true, anio: textoANumero[textoLower] }
  }
  
  const anio = parseInt(input)
  if (anio >= 1990 && anio <= 2025) {
    return { valido: true, anio }
  }
  
  return { valido: false, mensaje: '❌ Año inválido.\n\nEscribí: 2020 o "dos mil veinte"' }
}

export const obtenerModelos = (marca, anio) => {
  const modelos = VEHICULOS_ACARA[marca]?.[anio]
  return modelos ? Object.keys(modelos) : []
}

export const validarModelo = (marca, anio, modelo) => {
  const modeloUpper = modelo.toUpperCase().trim()
  
  if (modeloUpper.includes('?') || modeloUpper.includes('EJEMPLO') || modeloUpper === 'NOSE' || modeloUpper === 'NO SE') {
    const modelosDisponibles = obtenerModelos(marca, anio)
    if (modelosDisponibles.length === 0) {
      return { valido: false, mensaje: `❌ No hay datos de ${marca} ${anio}.` }
    }
    
    let mensaje = `📋 Modelos ${marca} ${anio}:\n\n`
    modelosDisponibles.forEach((m, i) => {
      mensaje += `${i + 1}️⃣ ${m}\n`
    })
    mensaje += '\nEscribí número o nombre'
    return { valido: false, mensaje, modelos: modelosDisponibles }
  }
  
  const modelosDisponibles = obtenerModelos(marca, anio)
  
  const numero = parseInt(modelo)
  if (!isNaN(numero) && numero > 0 && numero <= modelosDisponibles.length) {
    return { valido: true, modelo: modelosDisponibles[numero - 1] }
  }
  
  const modeloEncontrado = modelosDisponibles.find(m => 
    m.includes(modeloUpper) || modeloUpper.includes(m)
  )
  
  if (!modeloEncontrado) {
    let mensaje = `❌ "${modelo}" no encontrado.\n\n📋 ${marca} ${anio}:\n\n`
    modelosDisponibles.forEach((m, i) => {
      mensaje += `${i + 1}️⃣ ${m}\n`
    })
    return { valido: false, mensaje }
  }
  
  return { valido: true, modelo: modeloEncontrado }
}

export const obtenerVersiones = (marca, anio, modelo) => {
  return VEHICULOS_ACARA[marca]?.[anio]?.[modelo] || []
}

export const validarVersion = (marca, anio, modelo, version) => {
  const versionUpper = version.toUpperCase().trim()
  
  if (versionUpper.includes('?') || versionUpper.includes('EJEMPLO') || versionUpper === 'NOSE' || versionUpper === 'NO SE') {
    const versionesDisponibles = obtenerVersiones(marca, anio, modelo)
    
    let mensaje = `📋 Versiones ${marca} ${modelo} ${anio}:\n\n`
    versionesDisponibles.forEach((v, i) => {
      mensaje += `${i + 1}️⃣ ${v}\n`
    })
    mensaje += '\nEscribí número o nombre'
    return { valido: false, mensaje }
  }
  
  const versionesDisponibles = obtenerVersiones(marca, anio, modelo)
  
  const numero = parseInt(version)
  if (!isNaN(numero) && numero > 0 && numero <= versionesDisponibles.length) {
    return { valido: true, version: versionesDisponibles[numero - 1] }
  }
  
  const versionEncontrada = versionesDisponibles.find(v => 
    v.includes(versionUpper) || versionUpper.includes(v)
  )
  
  if (!versionEncontrada) {
    let mensaje = `❌ "${version}" no encontrada.\n\n📋 Versiones:\n\n`
    versionesDisponibles.forEach((v, i) => {
      mensaje += `${i + 1}️⃣ ${v}\n`
    })
    return { valido: false, mensaje }
  }
  
  return { valido: true, version: versionEncontrada }
}

// TODO CRÍTICO: Parsear PDF ACARA completo con pdftotext
// Comando: pdftotext -layout public/acara_precios.pdf acara.txt
// Base actual: ~30 modelos FORD (falta MONDEO, MUSTANG, etc)
// Última actualización: 20/11/2025
