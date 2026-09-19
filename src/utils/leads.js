/**
 * Compatibilidad. El envío de leads vive en `src/services/leads.js`, que es el
 * único módulo que postea al portal y al Vault. Este archivo queda para no
 * romper los imports existentes.
 */

export {
  enviarLead,
  enviarLead as crearLead,
  reintentarLeadsPendientes,
  purgarLeadsPendientes,
  whatsappUrl,
  LEADS_URL,
  WHATSAPP_NUMERO,
  TELEFONO_VISIBLE,
  PENDING_LEADS_KEY,
} from '../services/leads';
