/**
 * Alta de leads en el portal.
 * El endpoint es público, crea el lead y emite el token del Vault
 * en la misma operación: no hay que llamar al Worker por separado.
 */

export const LEADS_URL = 'https://ayma-portal-backend.onrender.com/api/v1/leads/';
export const WHATSAPP_NUMERO = '5493416952259';
export const TELEFONO_VISIBLE = '+54 9 341 695-2259';

function getUTMs() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
}

/**
 * Devuelve { ok: true, data, token } solo con respuesta 2xx.
 * Timeout amplio: el backend en Render puede tardar en despertar.
 * Ante error HTTP, de red o timeout devuelve { ok: false, error } — nunca lanza.
 */
export async function crearLead(payload, { timeoutMs = 45000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(LEADS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...getUTMs(), ...payload }),
      signal: controller.signal,
      keepalive: true,
    });

    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };

    const data = await res.json().catch(() => ({}));
    return { ok: true, data, token: data.vault_token || data.token || null };
  } catch (err) {
    return { ok: false, error: err.name === 'AbortError' ? 'timeout' : err.message };
  } finally {
    clearTimeout(timer);
  }
}

export const whatsappUrl = (msg) =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;
