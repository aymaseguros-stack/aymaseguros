/**
 * AYMA Token Vault Client v2.1
 * Con logging visible en consola
 */

const VAULT_URL = 'https://vault.aymaseguros.com.ar';

export const TIPOS = {
  COT_AUTO: 'cotizacion_auto',
  COT_HOGAR: 'cotizacion_hogar',
  COT_ART: 'cotizacion_art',
  COT_COMERCIO: 'cotizacion_comercio',
  COT_VIDA: 'cotizacion_vida',
  LEAD: 'lead',
  CONTACTO: 'contacto',
  CONSULTA: 'consulta',
  WA_CLICK: 'whatsapp_click',
  PHONE_CLICK: 'phone_click',
  BOT_SESSION: 'bot_session',
  BOT_ACTION: 'bot_action',
  BOT_MESSAGE: 'bot_message',
  SINIESTRO: 'siniestro',
  TICKET: 'ticket',
  POLIZA_VIEW: 'poliza_view',
  PDF_DOWNLOAD: 'pdf_download',
  ANULACION: 'anulacion',
};

function getUTMs() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
}

export async function tokenizar(tipo, payload, origen = 'landing') {
  console.log(`🔐 Tokenizando: ${tipo} desde ${origen}`);
  
  const fullPayload = {
    ...payload,
    ...getUTMs(),
    page_url: typeof window !== 'undefined' ? window.location.href : null,
    timestamp_client: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${VAULT_URL}/vault/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, payload: fullPayload, origen }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    console.log(`✅ Token creado: ${data.token}`);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', tipo, {
        event_category: 'token_vault',
        event_label: data.token,
      });
    }

    return { success: true, token: data.token, hash: data.hash };
  } catch (err) {
    console.error(`❌ Token vault error:`, err.message);
    
    const pending = JSON.parse(localStorage.getItem('ayma_pending_tokens') || '[]');
    pending.push({ tipo, payload: fullPayload, origen, timestamp: Date.now() });
    localStorage.setItem('ayma_pending_tokens', JSON.stringify(pending.slice(-50)));
    
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

export async function retryPendingTokens() {
  if (typeof window === 'undefined') return;
  const pending = JSON.parse(localStorage.getItem('ayma_pending_tokens') || '[]');
  if (pending.length === 0) return;
  
  console.log(`🔄 Reintentando ${pending.length} tokens...`);
  const stillPending = [];
  
  for (const item of pending) {
    try {
      const res = await fetch(`${VAULT_URL}/vault/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) stillPending.push(item);
    } catch {
      stillPending.push(item);
    }
  }
  
  localStorage.setItem('ayma_pending_tokens', JSON.stringify(stillPending));
}

export async function anularToken(tokenOriginal, motivo, usuario = 'sistema') {
  return tokenizar(TIPOS.ANULACION, {
    token_anulado: tokenOriginal,
    motivo,
    anulado_por: usuario,
  }, 'anulacion');
}

export default { tokenizar, verificarToken, retryPendingTokens, anularToken, TIPOS };
