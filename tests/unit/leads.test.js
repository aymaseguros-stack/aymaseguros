import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  enviarLead,
  armarBodyPortal,
  reintentarLeadsPendientes,
  purgarLeadsPendientes,
  LEADS_URL,
  PENDING_LEADS_KEY,
  MAX_EDAD_MS,
  CAMPOS_PORTAL,
} from '../../src/services/leads';
import { ATTRIB_KEY, ORIGEN, derivarOrigen, getAtribucion } from '../../src/services/attribution';

const cola = () => JSON.parse(localStorage.getItem(PENDING_LEADS_KEY) || '[]');

const resp = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

/** Distingue el POST al portal del POST al Vault. */
const esPortal = (call) => String(call[0]).includes('/api/v1/leads/');
const llamadasPortal = (mock) => mock.mock.calls.filter(esPortal);
const bodyPortal = (mock) => JSON.parse(llamadasPortal(mock)[0][1].body);

const DATOS = { nombre: 'Ana', telefono: '3415550000', tipo_seguro: 'auto' };

describe('services/leads — envío al portal', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('el submit postea al endpoint de leads del portal', async () => {
    const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(201, { token: 'AYMA-LED-1' }));

    const r = await enviarLead(DATOS, { canal: 'hero_auto' });

    const portal = llamadasPortal(f);
    expect(portal).toHaveLength(1);
    expect(portal[0][0]).toBe(LEADS_URL);
    expect(portal[0][1].method).toBe('POST');
    expect(r.ok).toBe(true);
    expect(r.token).toBe('AYMA-LED-1');
  });

  it('ok=false cuando el portal falla, aunque el Vault responda bien', async () => {
    const f = vi.spyOn(globalThis, 'fetch').mockImplementation((url) =>
      Promise.resolve(esPortal([url]) ? resp(500) : resp(200, { token: 'V', hash: 'H' }))
    );

    const r = await enviarLead(DATOS, { canal: 'hero_auto' });

    expect(r.ok).toBe(false);
    expect(r.error).toBe('HTTP 500');
    expect(f.mock.calls.some((c) => !esPortal(c))).toBe(true); // el Vault se llamó igual
  });

  it('ok=true cuando solo falla el Vault, y lo loguea', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) =>
      Promise.resolve(esPortal([url]) ? resp(201, { token: 'T' }) : resp(500))
    );

    const r = await enviarLead(DATOS, { canal: 'footer_contacto' });

    expect(r.ok).toBe(true);
    expect(r.vaultOk).toBe(false);
    expect(err).toHaveBeenCalled();
  });

  it('un error de red del portal no lanza y deja ok=false', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));

    const r = await enviarLead(DATOS, { canal: 'hero_auto' });

    expect(r.ok).toBe(false);
    expect(r.error).toBe('offline');
  });
});

describe('services/leads — cola de reintentos', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('un 4xx NO se encola', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(422));
    await enviarLead(DATOS, { canal: 'hero_auto' });
    expect(cola()).toHaveLength(0);
  });

  it('un 5xx sí se encola', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(503));
    await enviarLead(DATOS, { canal: 'hero_auto' });
    expect(cola()).toHaveLength(1);
  });

  it('un error de red se encola', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'));
    await enviarLead(DATOS, { canal: 'hero_auto' });
    expect(cola()).toHaveLength(1);
  });

  it('al reintentar, un 4xx se descarta y no vuelve a la cola', async () => {
    localStorage.setItem(
      PENDING_LEADS_KEY,
      JSON.stringify([{ body: DATOS, intentos: 0, timestamp: Date.now() }])
    );
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(400));

    await reintentarLeadsPendientes();

    expect(cola()).toHaveLength(0);
  });

  it('al reintentar, un 5xx suma intento y se conserva hasta el tope', async () => {
    localStorage.setItem(
      PENDING_LEADS_KEY,
      JSON.stringify([{ body: DATOS, intentos: 0, timestamp: Date.now() }])
    );
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(500));

    await reintentarLeadsPendientes();
    expect(cola()[0].intentos).toBe(1);

    await reintentarLeadsPendientes();
    expect(cola()[0].intentos).toBe(2);

    await reintentarLeadsPendientes(); // alcanza MAX_INTENTOS
    expect(cola()).toHaveLength(0);
  });

  it('un reintento exitoso vacía la cola', async () => {
    localStorage.setItem(
      PENDING_LEADS_KEY,
      JSON.stringify([{ body: DATOS, intentos: 0, timestamp: Date.now() }])
    );
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(201));

    await reintentarLeadsPendientes();

    expect(cola()).toHaveLength(0);
  });

  it('purga lo que tiene más de 7 días', () => {
    localStorage.setItem(
      PENDING_LEADS_KEY,
      JSON.stringify([
        { body: DATOS, intentos: 0, timestamp: Date.now() - MAX_EDAD_MS - 1000 },
        { body: DATOS, intentos: 0, timestamp: Date.now() },
      ])
    );

    purgarLeadsPendientes();

    expect(cola()).toHaveLength(1);
  });
});

describe('services/leads — body contra el esquema real del portal', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('no manda campos que LeadCreate no declara', async () => {
    const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(201, {}));

    await enviarLead({ ...DATOS, mensaje: 'hola', session_token: 'X' }, { canal: 'chatbot' });

    const body = bodyPortal(f);
    Object.keys(body).forEach((k) => expect(CAMPOS_PORTAL).toContain(k));
    expect(body.mensaje).toBeUndefined();
    expect(body.session_token).toBeUndefined();
  });

  it('omite los campos vacíos en vez de mandar null', () => {
    const body = armarBodyPortal({ ...DATOS, email: '', codigo_postal: null }, {});
    expect(body.email).toBeUndefined();
    expect(body.codigo_postal).toBeUndefined();
    expect(body.nombre).toBe('Ana');
  });

  it('adjunta las UTMs que el portal sí acepta', async () => {
    sessionStorage.setItem(
      ATTRIB_KEY,
      JSON.stringify({ utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'autos', gclid: 'G1' })
    );
    const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(201, {}));

    await enviarLead(DATOS, { canal: 'hero_auto' });

    const body = bodyPortal(f);
    expect(body.utm_source).toBe('google');
    expect(body.utm_medium).toBe('cpc');
    expect(body.utm_campaign).toBe('autos');
    expect(body.origen).toBe(ORIGEN.GOOGLE);
    // gclid no tiene campo en el portal: no se inventa uno
    expect(body.gclid).toBeUndefined();
  });
});

describe('services/attribution', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('deriva META_ADS por fbclid', () => {
    expect(derivarOrigen({ fbclid: 'abc' })).toBe(ORIGEN.META);
  });

  it('deriva META_ADS por utm_source de instagram', () => {
    expect(derivarOrigen({ utm_source: 'Instagram' })).toBe(ORIGEN.META);
  });

  it('deriva GOOGLE_ADS por gclid', () => {
    expect(derivarOrigen({ gclid: 'xyz' })).toBe(ORIGEN.GOOGLE);
  });

  it('sin nada, es FORMULARIO_WEB', () => {
    expect(derivarOrigen({})).toBe(ORIGEN.WEB);
  });

  it('conserva la atribución guardada y agrega el canal', () => {
    sessionStorage.setItem(ATTRIB_KEY, JSON.stringify({ utm_source: 'facebook', fbclid: 'F1' }));
    const a = getAtribucion('footer_contacto');
    expect(a.utm_source).toBe('facebook');
    expect(a.fbclid).toBe('F1');
    expect(a.canal).toBe('footer_contacto');
    expect(a.origen).toBe(ORIGEN.META);
  });
});
