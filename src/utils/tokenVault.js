/**
 * AYMA Token Vault Client v3
 *
 * - Solo se envían tipos de la whitelist del Worker (TIPOS_VALIDOS).
 * - Solo se encola para reintento ante error de red o 5xx. Un 4xx es
 *   "mal formado" y no se reintenta nunca.
 * - Cada elemento de la cola tiene un tope de MAX_INTENTOS reintentos.
 */

const VAULT_URL = 'https://vault.aymaseguros.com.ar';

export const PENDING_KEY = 'ayma_pending_tokens_v2';
export const LEGACY_PENDING_KEYS = ['ayma_pending_tokens'];
export const MAX_INTENTOS = 3;
const MAX_COLA = 50;

// Espejo de la whitelist del Worker. Si el Worker cambia, cambiar acá.
export const TIPOS = {
  COT_AUTO: 'cotizacion_auto',
  COT_HOGAR: 'cotizacion_hogar',
  COT_ART: 'cotizacion_art',
  COT_COMERCIO: 'cotizacion_comercio',
  COT_VIDA: 'cotizacion_vida',
  LEAD: 'lead',
  WA_CLICK: 'whatsapp_click',
  PHONE_CLICK: 'phone_click',
  CONSULTA: 'consulta',
  CONTACTO: 'contacto',
};

export const TIPOS_VALIDOS = new Set(Object.values(TIPOS));

export const esTipoValido = (tipo) => TIPOS_VALIDOS.has(tipo);

function getUTMs() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
}

function leerCola() {
  try {
    const cola = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
    return Array.isArray(cola) ? cola : [];
  } catch {
    return [];
  }
}

function guardarCola(cola) {
  try {
    if (cola.length === 0) localStorage.removeItem(PENDING_KEY);
    else localStorage.setItem(PENDING_KEY, JSON.stringify(cola.slice(-MAX_COLA)));
  } catch {
    // localStorage no disponible: se pierde el reintento, no es crítico
  }
}

function postVault(item) {
  return fetch(`${VAULT_URL}/vault/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo: item.tipo, payload: item.payload, origen: item.origen }),
  });
}

// Error de red (status null) o 5xx: transitorio. Cualquier otro status no.
const esReintentable = (status) => status === null || status >= 500;

export async function tokenizar(tipo, payload, origen = 'landing') {
  if (!esTipoValido(tipo)) {
    console.warn(`⚠️ Token vault: tipo no válido "${tipo}", no se envía`);
    return { success: false, token: null, hash: null, error: 'tipo_invalido' };
  }

  const item = {
    tipo,
    origen,
    payload: {
      ...payload,
      ...getUTMs(),
      page_url: typeof window !== 'undefined' ? window.location.href : null,
      timestamp_client: new Date().toISOString(),
    },
  };

  let status = null;
  try {
    const res = await postVault(item);
    status = res.status;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', tipo, {
        event_category: 'token_vault',
        event_label: data.token,
      });
    }

    return { success: true, token: data.token, hash: data.hash };
  } catch (err) {
    console.error(`❌ Token vault error:`, err.message);

    if (esReintentable(status)) {
      guardarCola([...leerCola(), { ...item, intentos: 0, timestamp: Date.now() }]);
    }

    const localToken = `LOCAL-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    return { success: false, token: localToken, hash: 'pending', error: err.message };
  }
}

export async function verificarToken(token) {
  try {
    const res = await fetch(`${VAULT_URL}/vault/verify/${token}`);
    return await res.json();
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

/**
 * Limpieza al montar: borra las colas sin versionar y descarta de la actual
 * lo que no sea un tipo válido o haya agotado los intentos.
 */
export function purgarColaPendiente() {
  if (typeof window === 'undefined') return;
  try {
    LEGACY_PENDING_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch {
    return;
  }
  const cola = leerCola();
  const limpia = cola.filter(
    (item) => item && esTipoValido(item.tipo) && (item.intentos || 0) < MAX_INTENTOS
  );
  if (limpia.length !== cola.length) guardarCola(limpia);
}

export async function retryPendingTokens() {
  if (typeof window === 'undefined') return;
  purgarColaPendiente();

  const pending = leerCola();
  if (pending.length === 0) return;

  const stillPending = [];

  for (const item of pending) {
    let status = null;
    try {
      const res = await postVault(item);
      status = res.status;
      if (res.ok) continue;
    } catch {
      // error de red: status queda en null
    }
    if (!esReintentable(status)) continue; // 4xx: se descarta
    const intentos = (item.intentos || 0) + 1;
    if (intentos >= MAX_INTENTOS) continue; // tope alcanzado: se descarta
    stillPending.push({ ...item, intentos });
  }

  guardarCola(stillPending);
}

export default { tokenizar, verificarToken, retryPendingTokens, purgarColaPendiente, TIPOS };
