/**
 * Alta de leads — único punto de envío de la landing.
 *
 * Dos destinos por envío:
 *   1. El portal (CRM). Es el que manda: si este POST falla, el formulario
 *      NO puede mostrar éxito.
 *   2. El Vault, como asiento del acto. Si solo falla el Vault, el envío se
 *      considera exitoso y el fallo queda logueado.
 *
 * El body del portal se arma contra el esquema real de `LeadCreate`
 * (app/schemas/lead.py del portal). Los campos que ese esquema no declara los
 * descarta Pydantic en silencio, así que acá no se inventa ninguno.
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
 * Campos que el endpoint del portal acepta de verdad. Cualquier otra cosa
 * viaja al Vault, que sí guarda payload libre.
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
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'slug_qr',
];

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
 * @returns {Promise<{ok:boolean, token:?string, error:?string, vaultOk:boolean}>}
 *   `ok` refleja EXCLUSIVAMENTE el resultado del POST al portal.
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

  // Asiento en el Vault. La atribución completa (utm_content, utm_term,
  // fbclid, gclid, canal, page_url) sobrevive acá: el esquema del portal no
  // tiene campos donde ponerla.
  let vaultOk = false;
  try {
    const tipo = esTipoValido(tipoVault) ? tipoVault : TIPOS.LEAD;
    const r = await tokenizar(
      tipo,
      { ...datos, ...atribucion, ...extraVault, portal_ok: portal.ok },
      canal || 'landing'
    );
    vaultOk = Boolean(r?.success);
  } catch (err) {
    console.error('⚠️ Vault error (no bloquea el lead):', err.message);
  }

  if (portal.ok && !vaultOk) {
    console.error('⚠️ Lead registrado en el portal pero no asentado en el Vault');
  }

  return { ...portal, vaultOk };
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
