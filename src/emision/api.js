/**
 * Cliente de los endpoints PÚBLICOS de QR-EMI (portal, PR #190):
 *
 *   GET  /api/v1/public/emision/{token}
 *   PUT  /api/v1/public/emision/{token}/borrador
 *   POST /api/v1/public/emision/{token}/archivos   (multipart: archivos[], categoria)
 *   POST /api/v1/public/emision/{token}/enviar
 *
 * EL TOKEN ES LA CREDENCIAL. Vive solo en memoria: nunca va a console, a
 * localStorage, a un mensaje de error ni a un servicio de terceros. Los
 * errores que salen de este módulo llevan status y detalle del backend,
 * nunca la URL.
 */

export const API_EMISION =
  import.meta.env.VITE_EMISION_API_BASE ||
  'https://api.aymaseguros.com.ar/api/v1/public/emision';

export const WHATSAPP_AYMA = '5493416952259';

/** El token de /emision/:token, o null. */
export function tokenDeLaRuta(pathname) {
  const m = /^\/emision\/([^/?#]+)\/?$/.exec(pathname || '');
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return null;
  }
}

/**
 * Error de la API sin datos sensibles: status + detalle del backend.
 *
 * `clase` separa los casos que el cliente tiene que poder distinguir, porque
 * decirle "no hay conexión" a alguien que sí tiene conexión lo deja sin saber
 * qué hacer (C-6o):
 *
 *   'sin_conexion' · el navegador está offline
 *   'red'          · la petición no llegó o se cortó (el navegador dice online)
 *   'servidor'     · 5xx: falló del lado nuestro
 *   'validacion'   · 422: el backend rechazó el contenido, y dice por qué
 *   'grande'       · 413: el archivo excede el límite
 *   'limite'       · 429: demasiados intentos
 *   'cliente'      · el resto de los 4xx
 */
export class ErrorApi extends Error {
  constructor(status, detalle) {
    super(typeof detalle === 'string' ? detalle : 'Error del servidor');
    this.name = 'ErrorApi';
    this.status = status; // null = la petición no llegó
    this.detalle = detalle;
    this.clase = claseDeError(status);
  }

  /** ¿Tiene sentido reintentar solo? Un 4xx no se arregla repitiéndolo. */
  get reintentable() {
    return ['sin_conexion', 'red', 'servidor', 'limite'].includes(this.clase);
  }
}

/** true si el navegador se declara offline. Si no sabe, asumimos que hay red. */
export const sinConexion = () =>
  typeof navigator !== 'undefined' && navigator.onLine === false;

function claseDeError(status) {
  if (status === null || status === undefined) return sinConexion() ? 'sin_conexion' : 'red';
  if (status >= 500) return 'servidor';
  if (status === 429) return 'limite';
  if (status === 413) return 'grande';
  if (status === 422) return 'validacion';
  return 'cliente';
}

const url = (token, sufijo = '') =>
  `${API_EMISION}/${encodeURIComponent(token)}${sufijo}`;

async function leerDetalle(resp) {
  try {
    const cuerpo = await resp.json();
    return cuerpo?.detail ?? null;
  } catch {
    return null;
  }
}

async function pedir(token, sufijo, opciones = {}) {
  let resp;
  try {
    resp = await fetch(url(token, sufijo), {
      ...opciones,
      referrerPolicy: 'no-referrer',
      credentials: 'omit',
      cache: 'no-store',
    });
  } catch {
    throw new ErrorApi(null, null);
  }
  if (!resp.ok) throw new ErrorApi(resp.status, await leerDetalle(resp));
  return resp.json();
}

export const obtenerFormulario = (token) => pedir(token, '');

export const guardarBorrador = (token, datos) =>
  pedir(token, '/borrador', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ datos }),
  });

export const enviarFormulario = (token, datos, consentimientoVersion) =>
  pedir(token, '/enviar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      datos,
      consentimiento_aceptado: true,
      consentimiento_version: consentimientoVersion,
    }),
  });

/** Cuántos reintentos automáticos hace la subida y cuánto espera entre ellos. */
export const REINTENTOS_SUBIDA = 2;
export const ESPERAS_SUBIDA = [800, 2000];

/** Config de la subida en un objeto para que los tests puedan acortar la espera. */
export const CONFIG_SUBIDA = { esperas: ESPERAS_SUBIDA };

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Sube UN archivo con progreso. XHR y no fetch porque fetch no expone el
 * progreso de subida. `onProgreso` recibe 0..100.
 *
 * SOLO resuelve si el servidor CONFIRMA la subida: 2xx y un cuerpo JSON.
 * Un 2xx con un cuerpo que no podemos leer no es una confirmación, y no se
 * puede marcar el archivo como cargado por optimismo (C-6o).
 */
export function subirArchivo(token, archivo, nombre, categoria, onProgreso) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('archivos', archivo, nombre);
    form.append('categoria', categoria);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url(token, '/archivos'));
    xhr.withCredentials = false;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgreso) onProgreso(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let cuerpo = null;
      try {
        cuerpo = JSON.parse(xhr.responseText);
      } catch {
        cuerpo = null;
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new ErrorApi(xhr.status, cuerpo?.detail ?? null));
        return;
      }
      if (cuerpo === null || typeof cuerpo !== 'object') {
        // 2xx sin respuesta legible: no sabemos si quedó guardado, así que no
        // se marca como cargado. Tampoco se reintenta solo, porque si el
        // archivo sí entró el reintento lo duplicaría: decide el cliente.
        const sinConfirmar = new ErrorApi(xhr.status, null);
        sinConfirmar.clase = 'sin_confirmacion';
        reject(sinConfirmar);
        return;
      }
      resolve(cuerpo);
    };
    xhr.onerror = () => reject(new ErrorApi(null, null));
    xhr.ontimeout = () => reject(new ErrorApi(null, null));
    xhr.send(form);
  });
}

/**
 * `subirArchivo` con reintento automático: hasta REINTENTOS_SUBIDA intentos
 * extra, con espera entre uno y otro, y solo cuando el error da para
 * reintentar (corte de red, 5xx, 429). Un 413 o un 422 se devuelven en el
 * acto: repetirlos da el mismo resultado y le hace perder tiempo al cliente.
 *
 * `onIntento(n)` avisa en qué intento va (1 = el primero).
 */
export async function subirArchivoConReintentos(
  token, archivo, nombre, categoria, onProgreso, onIntento, esperas = CONFIG_SUBIDA.esperas,
) {
  let ultimo;
  for (let intento = 0; intento <= REINTENTOS_SUBIDA; intento += 1) {
    if (onIntento) onIntento(intento + 1);
    if (onProgreso) onProgreso(0);
    try {
      return await subirArchivo(token, archivo, nombre, categoria, onProgreso);
    } catch (e) {
      ultimo = e;
      const puede = e instanceof ErrorApi && e.reintentable && intento < REINTENTOS_SUBIDA;
      if (!puede) throw e;
      await dormir(esperas[intento] ?? esperas[esperas.length - 1] ?? 0);
    }
  }
  throw ultimo;
}

/**
 * El mensaje que ve el cliente cuando falla la subida de UN archivo. Cada
 * causa dice lo suyo: la evidencia de C-6o es un cliente al que le dijimos
 * "no hay conexión" mientras la conexión andaba y lo que fallaba éramos
 * nosotros.
 */
export function mensajeDeSubida(error, limiteMb = 10) {
  if (!(error instanceof ErrorApi)) return 'No pudimos guardar la foto. Probá de nuevo.';
  switch (error.clase) {
    case 'sin_conexion':
      return 'Te quedaste sin conexión. Cuando vuelva, tocá Reintentar.';
    case 'red':
      return 'Se cortó la subida antes de llegar a nuestro servidor. Probá de nuevo.';
    case 'servidor':
      return 'No pudimos guardar la foto. Probá de nuevo.';
    case 'sin_confirmacion':
      return 'No pudimos confirmar que la foto se haya guardado. Probá de nuevo.';
    case 'grande':
      return `El archivo es demasiado grande. El máximo es ${limiteMb} MB.`;
    case 'limite':
      return 'Hiciste muchos intentos seguidos. Esperá un minuto y probá de nuevo.';
    case 'validacion':
      return typeof error.detalle === 'string' && error.detalle.trim()
        ? error.detalle
        : 'El archivo no pasó la revisión. Probá con otra foto.';
    default:
      return 'No pudimos guardar la foto. Probá de nuevo.';
  }
}

/**
 * El campo que causó un 422 de PAN. El backend arma el mensaje como
 * "'datos.cbu_o_alias': el valor contiene…" o "'tarjeta.titular': …"
 * (emision_pii.PanDetectado). Devuelve la clave del formulario o null.
 */
export function campoDelError(detalle) {
  if (typeof detalle !== 'string') return null;
  const m = /^'([^']+)':/.exec(detalle);
  if (!m) return null;
  const camino = m[1];
  if (camino.startsWith('tarjeta.')) return `tarjeta_${camino.slice('tarjeta.'.length)}`;
  if (camino.startsWith('datos.')) return camino.slice('datos.'.length).split(/[.[]/)[0];
  return null;
}

export const esPan = (detalle) =>
  typeof detalle === 'string' && detalle.includes('número completo de tarjeta');

/** Mensaje en lenguaje simple para un error que no es de un campo. */
export function mensajeGeneral(error) {
  if (!(error instanceof ErrorApi)) return 'Algo falló de nuestro lado. Probá de nuevo en unos minutos.';
  switch (error.clase) {
    case 'sin_conexion':
      return 'Te quedaste sin conexión. Revisá tu internet y probá de nuevo.';
    case 'red':
      return 'No pudimos conectarnos. Revisá tu conexión y probá de nuevo.';
    case 'limite':
      return 'Hiciste muchos intentos seguidos. Esperá un minuto y probá de nuevo.';
    case 'grande':
      return 'El archivo es demasiado grande. El máximo es 10 MB.';
    case 'validacion':
      return typeof error.detalle === 'string' ? error.detalle : 'Revisá los datos: el servidor los rechazó.';
    default:
      return 'Algo falló de nuestro lado. Probá de nuevo en unos minutos.';
  }
}
