/**
 * Atribución de la visita.
 *
 * Se lee de la URL al cargar la página y se persiste en sessionStorage: el
 * visitante puede navegar (o abrir el chat, o bajar hasta el footer) antes de
 * enviar, y para entonces los parámetros ya no están en la URL.
 *
 * La primera captura con datos gana. Una pageview posterior sin parámetros no
 * pisa la atribución buena de la que entró por el anuncio.
 */

export const ATTRIB_KEY = 'ayma_attrib_v1';

export const CAMPOS_URL = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
];

export const ORIGEN = {
  META: 'META_ADS',
  GOOGLE: 'GOOGLE_ADS',
  WEB: 'FORMULARIO_WEB',
};

const META_SOURCES = ['facebook', 'instagram', 'fb', 'ig', 'meta'];

/** META si hay fbclid o utm_source de Meta; GOOGLE si hay gclid; si no, web. */
export function derivarOrigen(attrib = {}) {
  const source = (attrib.utm_source || '').toLowerCase();
  if (attrib.fbclid || META_SOURCES.includes(source)) return ORIGEN.META;
  if (attrib.gclid) return ORIGEN.GOOGLE;
  return ORIGEN.WEB;
}

function leerGuardada() {
  try {
    const raw = sessionStorage.getItem(ATTRIB_KEY);
    const data = raw ? JSON.parse(raw) : null;
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

function guardar(attrib) {
  try {
    sessionStorage.setItem(ATTRIB_KEY, JSON.stringify(attrib));
  } catch {
    // sessionStorage no disponible: la atribución vive solo en memoria
  }
}

function leerDeURL() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const attrib = {};
  CAMPOS_URL.forEach((campo) => {
    const valor = params.get(campo);
    if (valor) attrib[campo] = valor;
  });
  return attrib;
}

/**
 * Llamar una vez al montar la app. Si la URL trae atribución, la persiste;
 * si no, conserva la que ya hubiera en la sesión.
 */
export function capturarAtribucion() {
  if (typeof window === 'undefined') return {};

  const deURL = leerDeURL();

  if (Object.keys(deURL).length > 0) {
    const attrib = {
      ...deURL,
      landing_url: window.location.href,
      captured_at: new Date().toISOString(),
    };
    guardar(attrib);
    return attrib;
  }

  return leerGuardada() || {};
}

/**
 * Atribución vigente para adjuntar a un envío.
 * `canal` identifica el formulario que dispara el envío.
 */
export function getAtribucion(canal = null) {
  const guardada = leerGuardada() || (typeof window !== 'undefined' ? leerDeURL() : {});
  return {
    ...guardada,
    origen: derivarOrigen(guardada),
    canal,
    page_url: typeof window !== 'undefined' ? window.location.href : null,
  };
}

export default { capturarAtribucion, getAtribucion, derivarOrigen, ATTRIB_KEY, ORIGEN };
