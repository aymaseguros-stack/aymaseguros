/**
 * La forma del formulario de emisión, armada desde lo que devuelve el GET.
 *
 * EL CATÁLOGO LO SIRVE EL BACKEND (emision_formulario.secciones): campos,
 * títulos, ayudas y fotos de inspección salen de ahí, no de una copia local.
 * Lo que decide la landing es el ORDEN y el agrupado en bloques
 * (Titular · Vehículo · Inspección · Cobro · Confirmar) y la UI del cobro,
 * que es condicional según el medio de pago.
 *
 * ARCHIVOS: las fotos de inspección se suben con categoría FOTO_INSPECCION
 * (los códigos FRENTE, TRASERA… no son categorías de adjunto y el backend
 * los rechazaría). Qué foto es cuál viaja en el nombre del archivo:
 * "FRENTE-foto.jpg". Así, al volver con el mismo link, cada foto ya subida
 * reaparece en su casillero.
 */

export const MAX_BYTES = 10 * 1024 * 1024;
const EXTENSIONES = ['jpg', 'jpeg', 'png', 'pdf', 'heic', 'heif'];
const MIMES = ['image/jpeg', 'image/png', 'application/pdf', 'image/heic', 'image/heif'];

/** Opciones de los campos tipo "opcion": el catálogo no las trae. */
export const OPCIONES = {
  tipo_documento: [
    ['DNI', 'DNI'],
    ['LE', 'Libreta de enrolamiento'],
    ['LC', 'Libreta cívica'],
    ['PASAPORTE', 'Pasaporte'],
  ],
  uso: [
    ['particular', 'Particular'],
    ['comercial', 'Comercial'],
  ],
  provincia: [
    ['Buenos Aires', 'Buenos Aires'],
    ['CABA', 'Ciudad Autónoma de Buenos Aires'],
    ['Catamarca', 'Catamarca'], ['Chaco', 'Chaco'], ['Chubut', 'Chubut'],
    ['Córdoba', 'Córdoba'], ['Corrientes', 'Corrientes'], ['Entre Ríos', 'Entre Ríos'],
    ['Formosa', 'Formosa'], ['Jujuy', 'Jujuy'], ['La Pampa', 'La Pampa'],
    ['La Rioja', 'La Rioja'], ['Mendoza', 'Mendoza'], ['Misiones', 'Misiones'],
    ['Neuquén', 'Neuquén'], ['Río Negro', 'Río Negro'], ['Salta', 'Salta'],
    ['San Juan', 'San Juan'], ['San Luis', 'San Luis'], ['Santa Cruz', 'Santa Cruz'],
    ['Santa Fe', 'Santa Fe'], ['Santiago del Estero', 'Santiago del Estero'],
    ['Tierra del Fuego', 'Tierra del Fuego'], ['Tucumán', 'Tucumán'],
  ],
  tarjeta_marca: [
    ['Visa', 'Visa'],
    ['Mastercard', 'Mastercard'],
    ['American Express', 'American Express'],
    ['Cabal', 'Cabal'],
    ['Naranja', 'Naranja'],
    ['Otra', 'Otra'],
  ],
};

export const MEDIOS = [
  ['debito', 'Débito en cuenta', 'Con CBU o alias'],
  ['tarjeta', 'Tarjeta de crédito', 'Solo marca y últimos 4'],
  ['efectivo_transferencia', 'Efectivo o transferencia', 'Tu asesor te pasa los datos'],
];

/**
 * Obligatorios aunque el catálogo los marque opcionales: son los datos que
 * el trámite pide sí o sí (brief C-6b). Lo que el backend marca requerido
 * también lo es.
 */
const OBLIGATORIOS_EXTRA = new Set([
  'fecha_nacimiento', 'email', 'domicilio', 'localidad', 'provincia', 'codigo_postal',
  'kilometraje', 'uso',
]);

const CATEGORIAS_CEDULA = ['CEDULA_VERDE', 'TARJETA_AZUL'];
const CAMPOS_COBRO_POR_MEDIO = {
  debito: ['cbu_o_alias', 'titular_cuenta'],
  tarjeta: ['tarjeta_marca', 'tarjeta_ultimos4', 'tarjeta_titular', 'tarjeta_vencimiento'],
  efectivo_transferencia: [],
};

const TITULOS_COBRO = {
  medio: 'Medio de pago',
  cbu_o_alias: 'CBU o alias',
  titular_cuenta: 'Titular de la cuenta',
  tarjeta_marca: 'Marca de la tarjeta',
  tarjeta_ultimos4: 'Últimos 4 dígitos',
  tarjeta_titular: 'Titular de la tarjeta',
  tarjeta_vencimiento: 'Vencimiento (MM/AA)',
};

const esRequerido = (campo) => !!campo.requerido || OBLIGATORIOS_EXTRA.has(campo.nombre);

/** La provincia que proponemos: AYMA opera desde Rosario (C-6o). */
export const PROVINCIA_POR_DEFECTO = 'Santa Fe';

/**
 * El domicilio sin provincia es un domicilio incompleto, y hasta C-6o solo
 * viajaban localidad y código postal. Si el catálogo del backend ya la trae,
 * la dejamos donde está (y la volvemos lista desplegable); si no, la sumamos
 * nosotros justo después de la localidad.
 */
function conProvincia(campos) {
  const lista = campos.map((c) => (c.nombre === 'provincia' ? { ...c, tipo: 'opcion' } : c));
  if (lista.some((c) => c.nombre === 'provincia')) return lista;
  const provincia = { nombre: 'provincia', titulo: 'Provincia', tipo: 'opcion', requerido: true, ayuda: null };
  const i = lista.findIndex((c) => c.nombre === 'localidad');
  if (i === -1) return [...lista, provincia];
  return [...lista.slice(0, i + 1), provincia, ...lista.slice(i + 1)];
}

/** Los bloques del formulario, en el orden del brief. */
export function armarBloques(form) {
  const secciones = Array.isArray(form?.secciones) ? form.secciones : [];
  const porCodigo = Object.fromEntries(secciones.map((s) => [s.codigo, s]));
  const camposArchivo = porCodigo.ARCHIVOS?.campos || [];
  const campoArchivo = (nombre) => camposArchivo.find((c) => c.nombre === nombre);

  const conRequerido = (campos = []) =>
    campos.map((c) => ({ ...c, requerido: esRequerido(c) }));

  const bloques = [];

  // El DNI va en dos casilleros (frente y dorso), los dos obligatorios:
  // el catálogo lo pide como un solo archivo requerido "frente y dorso".
  bloques.push({
    id: 'titular',
    titulo: 'Titular',
    campos: conProvincia(conRequerido(porCodigo.TITULAR?.campos)),
    archivos: [
      { slot: 'DNI_FRENTE', categoria: 'DNI_CEDULA', titulo: 'DNI – frente', requerido: true },
      { slot: 'DNI_DORSO', categoria: 'DNI_CEDULA', titulo: 'DNI – dorso', requerido: true },
    ],
  });

  // Cédula verde O tarjeta azul: un solo casillero y el cliente elige cuál
  // tiene. Obligatoria sólo si el catálogo la marca requerida.
  bloques.push({
    id: 'vehiculo',
    titulo: 'Vehículo',
    campos: conRequerido(porCodigo.RIESGO?.campos),
    archivos: [],
    cedula: {
      slot: 'CEDULA',
      titulo: 'Cédula del vehículo',
      requerido: CATEGORIAS_CEDULA.some((c) => !!campoArchivo(c)?.requerido),
    },
  });

  const fotos = Array.isArray(form?.fotos_requeridas) && form.fotos_requeridas.length
    ? form.fotos_requeridas
    : porCodigo.ARCHIVOS?.fotos || [];
  const conocidos = new Set(['DNI_CEDULA', ...CATEGORIAS_CEDULA]);
  const otrosArchivos = camposArchivo
    .filter((c) => !conocidos.has(c.nombre))
    .map((c) => ({ slot: c.nombre, categoria: c.nombre, titulo: c.titulo, requerido: !!c.requerido }));
  bloques.push({
    id: 'inspeccion',
    titulo: 'Inspección',
    campos: [],
    archivos: [
      ...fotos.map((f) => ({
        slot: f.codigo, categoria: 'FOTO_INSPECCION', titulo: f.titulo, requerido: true, foto: true,
      })),
      ...otrosArchivos,
    ],
  });

  // Una sección nueva del catálogo que esta landing no conoce todavía se
  // dibuja igual, genérica, antes del cobro: sumar un campo no pide deploy.
  const propias = new Set(['TITULAR', 'RIESGO', 'ARCHIVOS', 'COBRO']);
  secciones
    .filter((s) => !propias.has(s.codigo))
    .forEach((s) => bloques.push({
      id: `extra_${s.codigo}`, titulo: s.titulo || s.codigo, campos: conRequerido(s.campos), archivos: [],
    }));

  const cobro = porCodigo.COBRO?.campos || [];
  const tituloCobro = (nombre) => cobro.find((c) => c.nombre === nombre)?.titulo || TITULOS_COBRO[nombre];
  const ayudaCobro = (nombre) => cobro.find((c) => c.nombre === nombre)?.ayuda || null;
  bloques.push({
    id: 'cobro',
    titulo: 'Cobro',
    campos: [],
    archivos: [],
    cobro: { titulo: tituloCobro, ayuda: ayudaCobro },
  });

  bloques.push({ id: 'confirmar', titulo: 'Confirmar', campos: [], archivos: [] });
  return bloques;
}

// ---------------------------------------------------------------------------
// Validación
// ---------------------------------------------------------------------------

const vacio = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

/** Error de formato de un campo, o null. */
export function errorDeFormato(nombre, valor) {
  if (vacio(valor)) return null;
  const v = String(valor).trim();
  switch (nombre) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : 'Revisá el email: parece incompleto.';
    case 'tarjeta_ultimos4':
      return /^\d{4}$/.test(v) ? null : 'Tienen que ser exactamente 4 números.';
    case 'tarjeta_vencimiento':
      return /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) ? null : 'Escribilo como MM/AA, por ejemplo 08/29.';
    case 'cbu_o_alias': {
      const soloDigitos = v.replace(/\s/g, '');
      if (/^\d+$/.test(soloDigitos)) return soloDigitos.length === 22 ? null : 'El CBU tiene 22 números.';
      return /^[a-zA-Z0-9.-]{6,20}$/.test(v) ? null : 'El alias tiene entre 6 y 20 letras, números o puntos.';
    }
    case 'kilometraje':
      return /^\d{1,7}$/.test(v.replace(/\./g, '')) ? null : 'Poné solo números, por ejemplo 45000.';
    case 'fecha_nacimiento': {
      const fecha = new Date(`${v}T00:00:00`);
      if (Number.isNaN(fecha.getTime())) return 'Revisá la fecha.';
      return fecha < new Date() && fecha.getFullYear() > 1900 ? null : 'Revisá la fecha.';
    }
    default:
      return null;
  }
}

/** Nombres de los campos de cobro que se muestran para el medio elegido. */
export const camposCobroVisibles = (medio) => ['medio', ...(CAMPOS_COBRO_POR_MEDIO[medio] || [])];

/**
 * Lo que falta o está mal en un bloque: { campo: mensaje }. Los archivos se
 * reportan con la clave `archivo:SLOT`.
 */
export function problemasDelBloque(bloque, datos, archivos) {
  const problemas = {};
  const exigir = (nombre, requerido) => {
    const valor = datos[nombre];
    if (requerido && vacio(valor)) problemas[nombre] = 'Completá este dato.';
    else {
      const e = errorDeFormato(nombre, valor);
      if (e) problemas[nombre] = e;
    }
  };

  for (const campo of bloque.campos) {
    if (campo.tipo === 'archivo') continue;
    if (campo.nombre === 'domicilio') {
      exigir('domicilio_calle', campo.requerido);
      exigir('domicilio_numero', campo.requerido);
    } else if (campo.tipo === 'booleano') {
      if (campo.requerido && typeof datos[campo.nombre] !== 'boolean') problemas[campo.nombre] = 'Elegí una opción.';
    } else {
      exigir(campo.nombre, campo.requerido);
    }
  }

  if (bloque.cobro) {
    for (const nombre of camposCobroVisibles(datos.medio)) exigir(nombre, true);
    if (vacio(datos.medio)) problemas.medio = 'Elegí cómo vas a pagar.';
  }

  const slots = [...bloque.archivos, ...(bloque.cedula ? [bloque.cedula] : [])];
  for (const s of slots) {
    const estado = archivos[s.slot]?.estado;
    if (estado === 'subiendo') problemas[`archivo:${s.slot}`] = 'Esperá a que termine de subir.';
    else if (estado === 'error') problemas[`archivo:${s.slot}`] = archivos[s.slot].error || 'No se pudo subir. Reintentá.';
    else if (s.requerido && estado !== 'hecho') problemas[`archivo:${s.slot}`] = 'Falta este archivo.';
  }
  return problemas;
}

/**
 * Los casilleros que NO tienen confirmación del servidor, con el motivo:
 * lo que hay que nombrarle al cliente antes de dejarlo enviar (C-6o punto 4).
 * `obligatorio` es false cuando el archivo se puede simplemente quitar.
 */
export function archivosSinConfirmar(bloques, archivos) {
  const pendientes = [];
  bloques.forEach((bloque, paso) => {
    const slots = [...bloque.archivos, ...(bloque.cedula ? [bloque.cedula] : [])];
    for (const s of slots) {
      const e = archivos[s.slot] || {};
      let motivo = null;
      if (e.estado === 'subiendo') motivo = 'todavía se está subiendo';
      else if (e.estado === 'error') motivo = 'no se pudo subir';
      else if (s.requerido && e.estado !== 'hecho') motivo = 'falta cargarlo';
      if (motivo) pendientes.push({ slot: s.slot, titulo: s.titulo, motivo, obligatorio: !!s.requerido, paso });
    }
  });
  return pendientes;
}

export const bloqueCompleto = (bloque, datos, archivos) =>
  Object.keys(problemasDelBloque(bloque, datos, archivos)).length === 0;

// ---------------------------------------------------------------------------
// Archivos
// ---------------------------------------------------------------------------

/** Error de un archivo antes de subirlo, o null. */
export function errorDeArchivo(archivo) {
  if (!archivo) return 'No se eligió ningún archivo.';
  const ext = (archivo.name || '').split('.').pop().toLowerCase();
  const tipoOk = MIMES.includes((archivo.type || '').toLowerCase()) || EXTENSIONES.includes(ext);
  if (!tipoOk) return 'Solo se aceptan fotos JPG, PNG o HEIC, o un PDF.';
  if (archivo.size > MAX_BYTES) return 'El archivo pesa más de 10 MB. Probá con una foto más liviana.';
  if (archivo.size === 0) return 'El archivo está vacío.';
  return null;
}

/** "SLOT-nombre.ext", saneado igual que el backend (A-Z a-z 0-9 . _ -). */
export function nombreParaSubir(slot, nombreOriginal) {
  const base = (nombreOriginal || 'archivo')
    .normalize('NFKD')
    .replace(/[^\x20-\x7e]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '_')
    .slice(-80) || 'archivo';
  return `${slot}-${base}`;
}

/**
 * Los casilleros ya cargados según `archivos_cargados` del GET. Devuelve
 * { archivos: {slot: estado}, cedulaTipo }.
 */
export function archivosDesdeServidor(cargados, bloques) {
  const archivos = {};
  let cedulaTipo = null;
  const slots = bloques.flatMap((b) => b.archivos);
  const lista = Array.isArray(cargados) ? cargados : [];

  for (const a of lista) {
    const nombre = String(a?.nombre || '');
    const s = slots.find((x) => nombre.startsWith(`${x.slot}-`));
    if (s) {
      archivos[s.slot] = { estado: 'hecho', nombre, progreso: 100 };
    } else if (CATEGORIAS_CEDULA.includes(a?.categoria)) {
      archivos.CEDULA = { estado: 'hecho', nombre, progreso: 100 };
      cedulaTipo = a.categoria;
    } else if (a?.categoria === 'DNI_CEDULA') {
      const libre = ['DNI_FRENTE', 'DNI_DORSO'].find((x) => !archivos[x]);
      if (libre) archivos[libre] = { estado: 'hecho', nombre, progreso: 100 };
    }
  }
  return { archivos, cedulaTipo };
}

// ---------------------------------------------------------------------------
// Payload
// ---------------------------------------------------------------------------

/**
 * El `datos` que viaja al backend. La tarjeta va ANIDADA en `tarjeta` con
 * los cuatro campos de S6 (marca, ultimos4, titular, vencimiento): es la
 * forma que el backend normaliza. Nunca existe un campo de número completo.
 */
export function armarPayload(datos) {
  const out = {};
  for (const [k, v] of Object.entries(datos)) {
    if (k.startsWith('tarjeta_')) continue;
    if (vacio(v)) continue;
    out[k] = typeof v === 'string' ? v.trim() : v;
  }

  const domicilio = [datos.domicilio_calle, datos.domicilio_numero]
    .filter((x) => !vacio(x)).map((x) => String(x).trim()).join(' ');
  if (domicilio) out.domicilio = domicilio;

  if (datos.medio !== 'debito') {
    delete out.cbu_o_alias;
    delete out.titular_cuenta;
  }
  if (datos.medio === 'tarjeta') {
    const tarjeta = {};
    for (const c of ['marca', 'ultimos4', 'titular', 'vencimiento']) {
      const v = datos[`tarjeta_${c}`];
      if (!vacio(v)) tarjeta[c] = String(v).trim();
    }
    if (Object.keys(tarjeta).length) out.tarjeta = tarjeta;
  }
  return out;
}

/** El borrador del backend, en la forma plana del formulario. */
export function datosDesdeBorrador(borrador) {
  if (!borrador || typeof borrador !== 'object') return {};
  const { tarjeta, ...resto } = borrador;
  const datos = { ...resto };
  if (tarjeta && typeof tarjeta === 'object') {
    for (const c of ['marca', 'ultimos4', 'titular', 'vencimiento']) {
      if (tarjeta[c] != null) datos[`tarjeta_${c}`] = String(tarjeta[c]);
    }
  }
  if (vacio(datos.domicilio_calle) && !vacio(datos.domicilio)) datos.domicilio_calle = datos.domicilio;
  return datos;
}

/** El bloque al que pertenece un campo (para llevar al cliente al error). */
export function bloqueDelCampo(bloques, campo) {
  if (!campo) return -1;
  if (campo === 'domicilio') campo = 'domicilio_calle';
  return bloques.findIndex((b) => {
    if (b.cobro) return campo === 'medio' || campo.startsWith('tarjeta_') || ['cbu_o_alias', 'titular_cuenta'].includes(campo);
    return b.campos.some((c) => c.nombre === campo || (c.nombre === 'domicilio' && campo.startsWith('domicilio_')));
  });
}
