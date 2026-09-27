/**
 * Alta de leads — único punto de envío de la landing.
 *
 * Dos destinos por envío:
 *   1. El portal (CRM). Es el que manda: si este POST falla, el formulario
 *      NO puede mostrar éxito.
 *   2. El Vault, como asiento del acto. Corre en paralelo y NO se espera:
 *      la confirmación en pantalla depende solo del portal. Si el Vault
 *      falla o tarda más de VAULT_TIMEOUT_MS, queda un warning y listo.
 *
 * El body del portal se arma contra el esquema real de `LeadCreate`
 * (app/schemas/lead.py del portal). Un campo que ese esquema no declara el
 * portal lo acepta pero no lo guarda (solo lo loguea), así que acá no se
 * inventa ninguno.
 */

import { getAtribucion, getSlugQR } from './attribution';
import { tokenizar, TIPOS, esTipoValido } from '../utils/tokenVault';

export const LEADS_URL = 'https://api.aymaseguros.com.ar/api/v1/leads/';
export const WHATSAPP_NUMERO = '5493416952259';
export const TELEFONO_VISIBLE = '+54 9 341 695-2259';

export const PENDING_LEADS_KEY = 'ayma_pending_leads_v1';
export const MAX_INTENTOS_LEAD = 3;
export const MAX_EDAD_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_COLA = 50;

/**
 * Campos que el endpoint del portal acepta y persiste. Cualquier otra cosa
 * viaja solo al Vault, que guarda payload libre.
 */
export const CAMPOS_PORTAL = [
  'nombre',
  'telefono',
  'email',
  'codigo_postal',
  'tipo_seguro',
  'vehiculo_tipo',
  'vehiculo_marca',
  'vehiculo_modelo',
  'vehiculo_version',
  'vehiculo_anio',
  'cobertura',
  'origen',
  'canal',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'page_url',
  'mensaje',
  // Solo lo trae el chatbot (su BOT-… de sesión). El resto de los
  // formularios no tiene sesión y no se inventa una.
  'session_token',
  'slug_qr',
];

/** Tope para el asiento en el Vault. Pasado este tiempo se deja de esperar. */
export const VAULT_TIMEOUT_MS = 5000;

/** Un 4xx es un body mal formado: no se reintenta nunca. */
const esReintentable = (status) => status === null || status >= 500;

function leerCola() {
  try {
    const cola = JSON.parse(localStorage.getItem(PENDING_LEADS_KEY) || '[]');
    return Array.isArray(cola) ? cola : [];
  } catch {
    return [];
  }
}

function guardarCola(cola) {
  try {
    if (cola.length === 0) localStorage.removeItem(PENDING_LEADS_KEY);
    else localStorage.setItem(PENDING_LEADS_KEY, JSON.stringify(cola.slice(-MAX_COLA)));
  } catch {
    // localStorage no disponible: se pierde el reintento, no es crítico
  }
}

function encolar(body) {
  guardarCola([...leerCola(), { body, intentos: 0, timestamp: Date.now() }]);
}

/** Arma el body del portal: solo campos del esquema, sin nulos ni vacíos. */
export function armarBodyPortal(datos, atribucion) {
  const fuente = { ...atribucion, ...datos };
  // `origen` lo decide la atribución salvo que el formulario pida otro.
  if (!datos.origen && atribucion?.origen) fuente.origen = atribucion.origen;
  // El QR llega como ?ayma_pc; el portal lo espera como slug_qr.
  if (!fuente.slug_qr && atribucion?.ayma_pc) fuente.slug_qr = atribucion.ayma_pc;

  const body = {};
  CAMPOS_PORTAL.forEach((campo) => {
    const valor = fuente[campo];
    if (valor !== undefined && valor !== null && valor !== '') body[campo] = String(valor);
  });
  return body;
}

async function postPortal(body, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(LEADS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      keepalive: true,
    });
    return { status: res.status, ok: res.ok, res };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Envía el lead al portal y lo asienta en el Vault.
 *
 * Resuelve apenas responde el portal (tope `timeoutMs`, 15 s en los
 * formularios). El Vault se dispara en paralelo y no demora la respuesta.
 *
 * @returns {Promise<{ok:boolean, token:?string, error:?string, vault:Promise<boolean>}>}
 *   `ok` refleja EXCLUSIVAMENTE el resultado del POST al portal. `vault`
 *   resuelve a true/false cuando termina el asiento (o vence su tope).
 */
export async function enviarLead(datos, opciones = {}) {
  const {
    canal = null,
    tipoVault = TIPOS.LEAD,
    timeoutMs = 45000,
    extraVault = {},
  } = opciones;

  const atribucion = getAtribucion(canal);
  const body = armarBodyPortal(datos, atribucion);

  // Asiento en el Vault, en paralelo. Lleva la atribución completa y los
  // datos que el portal no guarda (p. ej. `landing_url`, `captured_at`).
  const vault = asentarEnVault(datos, atribucion, { tipoVault, canal, extraVault });

  let status = null;
  let portal = { ok: false, error: null, token: null };

  try {
    const { status: st, ok, res } = await postPortal(body, timeoutMs);
    status = st;
    if (ok) {
      const data = await res.json().catch(() => ({}));
      portal = { ok: true, error: null, token: data.vault_token || data.token || data.id || null };
    } else {
      portal = { ok: false, error: `HTTP ${st}`, token: null };
    }
  } catch (err) {
    portal = {
      ok: false,
      error: err.name === 'AbortError' ? 'timeout' : err.message,
      token: null,
    };
  }

  if (!portal.ok) {
    // Visible siempre: el build ya no borra console.error.
    console.error('❌ Lead NO registrado en el portal:', portal.error, body);
    if (esReintentable(status)) encolar(body);
    else console.error('↳ 4xx: body rechazado, no se reintenta');
  }

  return { ...portal, vault };
}

/**
 * Tokeniza en el Vault con un tope de VAULT_TIMEOUT_MS. Nunca rechaza: un
 * fallo o una demora quedan como warning. Si vence el tope, el request sigue
 * su curso (y `tokenizar` lo encola si termina fallando).
 */
function asentarEnVault(datos, atribucion, { tipoVault, canal, extraVault }) {
  const tipo = esTipoValido(tipoVault) ? tipoVault : TIPOS.LEAD;
  let timer;
  const tope = new Promise((resolve) => {
    timer = setTimeout(() => resolve('timeout'), VAULT_TIMEOUT_MS);
  });
  const asiento = Promise.resolve()
    .then(() => tokenizar(tipo, { ...datos, ...atribucion, ...extraVault }, canal || 'landing'))
    .then((r) => (r?.success ? 'ok' : 'error'))
    .catch(() => 'error');

  return Promise.race([asiento, tope]).then((resultado) => {
    clearTimeout(timer);
    if (resultado === 'timeout') console.warn('⚠️ Vault: sin respuesta en 5 s (no bloquea el lead)');
    else if (resultado === 'error') console.warn('⚠️ Vault: el asiento falló (no bloquea el lead)');
    return resultado === 'ok';
  });
}

/** Descarta lo vencido (>7 días) o sin intentos disponibles. */
export function purgarLeadsPendientes() {
  if (typeof window === 'undefined') return;
  const cola = leerCola();
  const ahora = Date.now();
  const limpia = cola.filter(
    (item) =>
      item &&
      item.body &&
      (item.intentos || 0) < MAX_INTENTOS_LEAD &&
      ahora - (item.timestamp || 0) < MAX_EDAD_MS
  );
  if (limpia.length !== cola.length) guardarCola(limpia);
}

export async function reintentarLeadsPendientes() {
  if (typeof window === 'undefined') return;
  purgarLeadsPendientes();

  const pendientes = leerCola();
  if (pendientes.length === 0) return;

  const siguen = [];
  for (const item of pendientes) {
    let status = null;
    try {
      const { status: st, ok } = await postPortal(item.body, 45000);
      status = st;
      if (ok) continue;
    } catch {
      // error de red: status queda en null
    }
    if (!esReintentable(status)) {
      console.error('❌ Lead pendiente descartado por 4xx:', status, item.body);
      continue;
    }
    const intentos = (item.intentos || 0) + 1;
    if (intentos >= MAX_INTENTOS_LEAD) continue;
    siguen.push({ ...item, intentos });
  }
  guardarCola(siguen);
}

/** Agrega la referencia del QR al texto de WhatsApp para no perder la atribución. */
export function conRefQR(msg) {
  const slug = getSlugQR();
  return slug ? `${msg}\n\nRef: ${slug}` : msg;
}

export const whatsappUrl = (msg) =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(conRefQR(msg))}`;

export default { enviarLead, reintentarLeadsPendientes, purgarLeadsPendientes, whatsappUrl };
