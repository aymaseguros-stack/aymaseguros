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

/** Error de la API sin datos sensibles: status + detalle del backend. */
export class ErrorApi extends Error {
  constructor(status, detalle) {
    super(typeof detalle === 'string' ? detalle : 'Error del servidor');
    this.name = 'ErrorApi';
    this.status = status; // null = sin conexión
    this.detalle = detalle;
  }
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

/**
 * Sube UN archivo con progreso. XHR y no fetch porque fetch no expone el
 * progreso de subida. `onProgreso` recibe 0..100.
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
      if (xhr.status >= 200 && xhr.status < 300) resolve(cuerpo);
      else reject(new ErrorApi(xhr.status, cuerpo?.detail ?? null));
    };
    xhr.onerror = () => reject(new ErrorApi(null, null));
    xhr.ontimeout = () => reject(new ErrorApi(null, null));
    xhr.send(form);
  });
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
  if (!(error instanceof ErrorApi) || error.status === null) {
    return 'No pudimos conectarnos. Revisá tu conexión y probá de nuevo.';
  }
  if (error.status === 429) return 'Hiciste muchos intentos seguidos. Esperá un minuto y probá de nuevo.';
  if (error.status === 422 && typeof error.detalle === 'string') return error.detalle;
  if (error.status === 413) return 'El archivo es demasiado grande. El máximo es 10 MB.';
  return 'Algo falló de nuestro lado. Probá de nuevo en unos minutos.';
}
