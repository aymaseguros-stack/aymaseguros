/**
 * C-6b · /emision/:token — formulario público de emisión (QR-EMI).
 *
 * Fija lo no negociable del brief:
 *   - token inválido/vencido/usado/revocado → UNA pantalla genérica
 *   - no existe un campo para el número completo de tarjeta
 *   - sin consentimiento no se puede enviar
 *   - en /emision no se inyectan scripts de terceros
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import React from 'react';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import EmisionPage from '../../src/emision/EmisionPage';
import { tokenDeLaRuta, campoDelError, API_EMISION } from '../../src/emision/api';
import { pareceTarjeta, pasaLuhn } from '../../src/emision/luhn';
import { armarBloques, armarPayload, datosDesdeBorrador, archivosDesdeServidor } from '../../src/emision/modelo';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const RAIZ = resolve(__dirname, '../..');
const TOKEN = 'tok_de_prueba_abc123';
const GENERICO = 'Este link no es válido o ya venció. Pedile uno nuevo a tu asesor.';

const resp = (status, body = {}) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

/** Réplica del GET real de #190 (emision_formulario.secciones). */
const campo = (nombre, titulo, tipo = 'texto', requerido = false, ayuda = null) => ({ nombre, titulo, tipo, requerido, ayuda });
const FORMULARIO = {
  nombre: 'Juan',
  vehiculo: { marca: 'Toyota', modelo: 'Corolla', anio: 2021 },
  ramo: 'AUTO',
  vence_en: '2026-09-25T12:00:00',
  estado: 'ABIERTA',
  secciones: [
    { codigo: 'TITULAR', titulo: 'Datos del titular', campos: [
      campo('nombre', 'Nombre', 'texto', true), campo('apellido', 'Apellido', 'texto', true),
      campo('tipo_documento', 'Tipo de documento', 'opcion'), campo('numero_documento', 'Número de documento', 'texto', true),
      campo('cuit', 'CUIT / CUIL'), campo('fecha_nacimiento', 'Fecha de nacimiento', 'fecha'),
      campo('email', 'Email', 'email', true), campo('telefono', 'Teléfono', 'telefono', true),
      campo('domicilio', 'Domicilio'), campo('localidad', 'Localidad'), campo('provincia', 'Provincia'),
      campo('codigo_postal', 'Código postal'),
    ] },
    { codigo: 'COBRO', titulo: 'Datos de cobro', campos: [
      campo('medio', 'Medio de pago', 'opcion', true), campo('cbu_o_alias', 'CBU o alias', 'texto', false, '22 dígitos, o el alias de la cuenta'),
      campo('titular_cuenta', 'Titular de la cuenta'), campo('tarjeta_marca', 'Marca de la tarjeta', 'opcion'),
      campo('tarjeta_ultimos4', 'Últimos 4 dígitos de la tarjeta'), campo('tarjeta_titular', 'Titular de la tarjeta'),
      campo('tarjeta_vencimiento', 'Vencimiento (MM/AA)'),
    ] },
    { codigo: 'RIESGO', titulo: 'Datos del vehículo', campos: [
      campo('uso', 'Uso', 'opcion'), campo('kilometraje', 'Kilometraje', 'numero'),
      campo('tiene_gnc', '¿Tiene GNC?', 'booleano'), campo('tiene_garaje', '¿Duerme en garaje?', 'booleano'),
      campo('codigo_postal_guarda', 'Código postal donde duerme'), campo('observaciones', 'Observaciones', 'texto_largo'),
    ] },
    { codigo: 'ARCHIVOS', titulo: 'Documentación y fotos', campos: [
      campo('DNI_CEDULA', 'DNI del titular (frente y dorso)', 'archivo', true),
      campo('TARJETA_AZUL', 'Tarjeta azul / datos del riesgo', 'archivo'), campo('CEDULA_VERDE', 'Cédula verde', 'archivo'),
    ], fotos: [{ codigo: 'FRENTE', titulo: 'Frente del vehículo' }] },
  ],
  fotos_requeridas: [
    { codigo: 'FRENTE', titulo: 'Frente del vehículo' },
    { codigo: 'TRASERA', titulo: 'Parte trasera' },
  ],
  consentimiento_version: '2026-09-v1',
  consentimiento_texto: 'Autorizo a AYMA Advisors a tratar los datos…',
  archivos_cargados: [],
  borrador: {},
  observacion: null,
};

const BORRADOR_TITULAR_Y_VEHICULO = {
  nombre: 'Juan', apellido: 'Pérez', numero_documento: '30123456', fecha_nacimiento: '1985-04-02',
  email: 'juan@example.com', telefono: '3415551234', domicilio_calle: 'Córdoba', domicilio_numero: '1234',
  localidad: 'Rosario', codigo_postal: '2000', uso: 'particular', kilometraje: '45000',
};
const ARCHIVOS_CARGADOS = [
  { id: '1', nombre: 'DNI_FRENTE-a.jpg', categoria: 'DNI_CEDULA', tamano_bytes: 10 },
  { id: '2', nombre: 'DNI_DORSO-b.jpg', categoria: 'DNI_CEDULA', tamano_bytes: 10 },
  { id: '3', nombre: 'FRENTE-c.jpg', categoria: 'FOTO_INSPECCION', tamano_bytes: 10 },
  { id: '4', nombre: 'TRASERA-d.jpg', categoria: 'FOTO_INSPECCION', tamano_bytes: 10 },
];

let container;
let root;

const render = async (element) => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => { root.render(element); });
  await act(async () => {}); // resuelve el GET
};

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = null;
});

/** Router de fetch: GET formulario / PUT borrador / POST enviar. */
const mockApi = ({ get = resp(200, FORMULARIO), put = resp(200, { ok: true, estado: 'ABIERTA', mensaje: 'ok' }), enviar = resp(200, { ok: true, estado: 'PENDIENTE_REVISION', mensaje: 'ok' }) } = {}) => {
  fetch.mockImplementation(async (url, opts = {}) => {
    if (String(url).endsWith('/borrador')) return typeof put === 'function' ? put(url, opts) : put;
    if (String(url).endsWith('/enviar')) return enviar;
    return get;
  });
};

const click = async (el) => { await act(async () => { el.click(); }); };
const escribir = async (input, valor) => {
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value').set;
  await act(async () => {
    setter.call(input, valor);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};
const boton = (texto) => [...container.querySelectorAll('button')].find((b) => b.textContent.includes(texto));

// ---------------------------------------------------------------------------

describe('ruta y token', () => {
  it('extrae el token de /emision/:token', () => {
    expect(tokenDeLaRuta('/emision/abc123')).toBe('abc123');
    expect(tokenDeLaRuta('/emision/abc123/')).toBe('abc123');
    expect(tokenDeLaRuta('/emision/')).toBeNull();
    expect(tokenDeLaRuta('/emision/a/b')).toBeNull();
    expect(tokenDeLaRuta('/')).toBeNull();
  });

  it('usa los endpoints públicos reales de #190', () => {
    expect(API_EMISION).toBe('https://api.aymaseguros.com.ar/api/v1/public/emision');
  });

  it('el token nunca va a localStorage ni a console', async () => {
    mockApi();
    await render(<EmisionPage token={TOKEN} />);
    for (let i = 0; i < localStorage.length; i += 1) {
      expect(localStorage.getItem(localStorage.key(i))).not.toContain(TOKEN);
    }
    for (const fn of ['log', 'info', 'warn', 'error', 'debug']) {
      for (const args of console[fn].mock.calls) expect(JSON.stringify(args)).not.toContain(TOKEN);
    }
  });
});

describe('token inválido → pantalla genérica', () => {
  it.each([
    ['inexistente', 404],
    ['vencido', 404],
    ['usado', 404],
    ['revocado', 404],
    ['rechazado con 410', 410],
  ])('%s: misma pantalla, sin distinguir la causa', async (_causa, status) => {
    mockApi({ get: resp(status, { detail: 'El link no está disponible. Puede haber vencido o haberse usado ya.' }) });
    await render(<EmisionPage token={TOKEN} />);
    expect(container.textContent).toContain(GENERICO);
    expect(container.textContent).not.toContain('vencido o haberse usado');
    const wa = container.querySelector('a[href^="https://wa.me/"]');
    expect(wa).not.toBeNull();
    expect(wa.getAttribute('href')).toBe('https://wa.me/5493416952259');
    expect(wa.getAttribute('rel')).toContain('noreferrer');
  });

  it('sin token en la URL: pantalla genérica sin pegarle a la API', async () => {
    await render(<EmisionPage token={null} />);
    expect(container.textContent).toContain(GENERICO);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('un corte de red NO es un link inválido: ofrece reintentar', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'));
    await render(<EmisionPage token={TOKEN} />);
    expect(container.textContent).not.toContain(GENERICO);
    expect(boton('Probar de nuevo')).toBeTruthy();
  });
});

describe('encabezado', () => {
  it('muestra nombre de pila y vehículo, y retoma en el primer bloque incompleto', async () => {
    mockApi();
    await render(<EmisionPage token={TOKEN} />);
    expect(container.querySelector('h1').textContent).toBe('Hola Juan');
    expect(container.textContent).toContain('Toyota Corolla 2021');
    expect(container.textContent).toContain('Paso 1 de 5 · Titular');
  });
});

describe('tarjeta: nunca el número completo', () => {
  const alCobro = async () => {
    mockApi({ get: resp(200, { ...FORMULARIO, borrador: BORRADOR_TITULAR_Y_VEHICULO, archivos_cargados: ARCHIVOS_CARGADOS }) });
    await render(<EmisionPage token={TOKEN} />);
    expect(container.textContent).toContain('· Cobro');
    await click(container.querySelector('input[name="medio"][value="tarjeta"]'));
  };

  it('solo marca, últimos 4, titular y vencimiento', async () => {
    await alCobro();
    const nombres = [...container.querySelectorAll('input, select, textarea')].map((el) => el.name);
    expect(nombres).toEqual(expect.arrayContaining(['tarjeta_marca', 'tarjeta_ultimos4', 'tarjeta_titular', 'tarjeta_vencimiento']));
    for (const n of nombres) expect(n).not.toMatch(/numero_tarjeta|^pan$|cvv|cvc|card_number|tarjeta_numero/i);
    expect(container.querySelector('[autocomplete="cc-number"], [autocomplete="cc-csc"]')).toBeNull();
    expect(container.querySelector('input[name="tarjeta_ultimos4"]').getAttribute('maxlength')).toBe('4');
  });

  it('el campo de últimos 4 no admite más de 4 dígitos', async () => {
    await alCobro();
    const input = container.querySelector('input[name="tarjeta_ultimos4"]');
    await escribir(input, '4111111111111111');
    expect(container.querySelector('input[name="tarjeta_ultimos4"]').value).toBe('4111');
  });

  it('el código no declara ningún campo de número completo ni CVV', () => {
    const dir = resolve(RAIZ, 'src/emision');
    for (const f of readdirSync(dir)) {
      const src = readFileSync(resolve(dir, f), 'utf8');
      expect(src).not.toMatch(/cc-number|cc-csc|name="(numero_tarjeta|pan|cvv|cvc)"/);
    }
  });

  it('el payload lleva la tarjeta anidada con los cuatro campos de S6 y nada más', () => {
    const p = armarPayload({
      medio: 'tarjeta', tarjeta_marca: 'Visa', tarjeta_ultimos4: '1234', tarjeta_titular: 'JUAN PEREZ',
      tarjeta_vencimiento: '08/29', cbu_o_alias: 'no.va',
    });
    expect(p).toEqual({ medio: 'tarjeta', tarjeta: { marca: 'Visa', ultimos4: '1234', titular: 'JUAN PEREZ', vencimiento: '08/29' } });
  });

  it('un 422 por Luhn del servidor se muestra en el campo que lo causó', async () => {
    mockApi({
      get: resp(200, { ...FORMULARIO, borrador: BORRADOR_TITULAR_Y_VEHICULO, archivos_cargados: ARCHIVOS_CARGADOS }),
      put: resp(422, { detail: "'datos.cbu_o_alias': el valor contiene lo que parece un número completo de tarjeta. AYMA no guarda el número ni el código de seguridad: cargá sólo la marca, los últimos 4 dígitos, el titular y el vencimiento." }),
    });
    await render(<EmisionPage token={TOKEN} />);
    await click(container.querySelector('input[name="medio"][value="debito"]'));
    await escribir(container.querySelector('input[name="cbu_o_alias"]'), '0110599520000001234567');
    await escribir(container.querySelector('input[name="titular_cuenta"]'), 'Juan Pérez');
    await click(boton('Guardar y seguir'));
    const msg = container.querySelector('#campo-cbu_o_alias-msg');
    expect(msg?.textContent).toContain('número de tarjeta completo');
    expect(container.querySelector('input[name="cbu_o_alias"]').getAttribute('aria-invalid')).toBe('true');
  });

  it('Luhn en el cliente avisa sin bloquear', async () => {
    mockApi({ get: resp(200, { ...FORMULARIO, borrador: BORRADOR_TITULAR_Y_VEHICULO, archivos_cargados: ARCHIVOS_CARGADOS }) });
    await render(<EmisionPage token={TOKEN} />);
    await click(container.querySelector('input[name="medio"][value="tarjeta"]'));
    await escribir(container.querySelector('input[name="tarjeta_titular"]'), '4111 1111 1111 1111');
    expect(container.querySelector('#campo-tarjeta_titular-msg').textContent).toContain('número de tarjeta completo');
  });
});

describe('consentimiento', () => {
  const alFinal = async (extra = {}) => {
    mockApi({
      get: resp(200, {
        ...FORMULARIO, ...extra,
        borrador: { ...BORRADOR_TITULAR_Y_VEHICULO, medio: 'efectivo_transferencia' },
        archivos_cargados: ARCHIVOS_CARGADOS,
      }),
    });
    await render(<EmisionPage token={TOKEN} />);
    expect(container.textContent).toContain('· Confirmar');
  };
  const enviosHechos = () => fetch.mock.calls.filter(([u]) => String(u).endsWith('/enviar'));

  it('muestra el texto y la versión que da el backend', async () => {
    await alFinal();
    expect(container.textContent).toContain('Autorizo a AYMA Advisors a tratar los datos');
    expect(container.textContent).toContain('Versión 2026-09-v1');
  });

  it('sin marcar la casilla no deja enviar', async () => {
    await alFinal();
    const enviar = boton('Enviar mis datos');
    expect(enviar.disabled).toBe(true);
    await click(enviar);
    expect(enviosHechos()).toHaveLength(0);
  });

  it('con la casilla marcada envía con la versión y muestra la confirmación', async () => {
    await alFinal();
    await click(container.querySelector('input[name="consentimiento"]'));
    const enviar = boton('Enviar mis datos');
    expect(enviar.disabled).toBe(false);
    await click(enviar);
    const [[url, opts]] = enviosHechos();
    expect(url).toBe(`${API_EMISION}/${TOKEN}/enviar`);
    const cuerpo = JSON.parse(opts.body);
    expect(cuerpo.consentimiento_aceptado).toBe(true);
    expect(cuerpo.consentimiento_version).toBe('2026-09-v1');
    expect(cuerpo.datos.domicilio).toBe('Córdoba 1234');
    expect(container.textContent).toContain('Recibimos tus datos. Tu asesor los revisa y te avisa.');
  });

  it('si el GET no trae el texto de consentimiento, no deja enviar y lo dice', async () => {
    await alFinal({ consentimiento_texto: '', consentimiento_version: '' });
    expect(container.textContent).toContain('No pudimos cargar el texto de consentimiento');
    expect(boton('Enviar mis datos').disabled).toBe(true);
  });
});

describe('sin scripts de terceros en /emision', () => {
  const html = readFileSync(resolve(RAIZ, 'emision.html'), 'utf8');
  // Sin comentarios: el que explica por qué no hay GTM los nombra.
  const marcado = html.replace(/<!--[\s\S]*?-->/g, '');
  const TERCEROS = /googletagmanager|google-analytics|gtag\(|fbq\(|connect\.facebook|facebook\.com\/tr|trustpilot|licdn|cloudflareinsights|hotjar|clarity/i;

  it('emision.html solo carga su propio módulo', () => {
    const scripts = [...html.matchAll(/<script\b[^>]*>/gi)].map((m) => m[0]);
    expect(scripts).toEqual(['<script type="module" src="/src/emision/main.jsx">']);
    expect(marcado).not.toMatch(TERCEROS);
    expect(marcado).not.toMatch(/<(script|link|iframe|img)\b[^>]*(src|href)=["']?(https?:)?\/\//i);
  });

  it('el código de la página no referencia servicios de terceros', () => {
    const dir = resolve(RAIZ, 'src/emision');
    for (const f of readdirSync(dir)) expect(readFileSync(resolve(dir, f), 'utf8')).not.toMatch(TERCEROS);
  });

  it('la detección funciona: index.html sí los carga', () => {
    expect(readFileSync(resolve(RAIZ, 'index.html'), 'utf8')).toMatch(TERCEROS);
  });

  it('noindex en la página y headers de /emision en vercel.json', () => {
    expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
    const vercel = JSON.parse(readFileSync(resolve(RAIZ, 'vercel.json'), 'utf8'));
    const h = vercel.headers.find((x) => x.source === '/emision/(.*)');
    const valor = (k) => h.headers.find((x) => x.key === k)?.value;
    expect(valor('X-Robots-Tag')).toBe('noindex, nofollow');
    expect(valor('Referrer-Policy')).toBe('no-referrer');
    expect(valor('Cache-Control')).toBe('no-store');
    // La regla de /emision va DESPUÉS de la global: gana su Referrer-Policy.
    expect(vercel.headers.indexOf(h)).toBeGreaterThan(vercel.headers.findIndex((x) => x.source === '/(.*)'));
    // La reescritura va ANTES del catch-all de la SPA.
    expect(vercel.rewrites[0]).toEqual({ source: '/emision/:token', destination: '/emision.html' });
  });
});

describe('modelo', () => {
  it('Luhn igual que el backend: PAN sí, CBU/DNI/teléfono no', () => {
    expect(pasaLuhn('4111111111111111')).toBe(true);
    expect(pareceTarjeta('4111 1111 1111 1111')).toBe(true);
    expect(pareceTarjeta('4111-1111-1111-1111')).toBe(true);
    expect(pareceTarjeta('0110599520000001234567')).toBe(false); // CBU, 22 dígitos
    expect(pareceTarjeta('30123456')).toBe(false);
    expect(pareceTarjeta('4111')).toBe(false);
  });

  it('ubica el campo de un 422 de PAN', () => {
    expect(campoDelError("'datos.cbu_o_alias': el valor…")).toBe('cbu_o_alias');
    expect(campoDelError("'tarjeta.titular': el valor…")).toBe('tarjeta_titular');
    expect(campoDelError('Otro error')).toBeNull();
  });

  it('bloques en el orden del brief, con las fotos que manda el GET', () => {
    const b = armarBloques(FORMULARIO);
    expect(b.map((x) => x.id)).toEqual(['titular', 'vehiculo', 'inspeccion', 'cobro', 'confirmar']);
    const fotos = b[2].archivos;
    expect(fotos.map((f) => f.slot)).toEqual(['FRENTE', 'TRASERA']);
    expect(fotos.every((f) => f.categoria === 'FOTO_INSPECCION' && f.foto)).toBe(true);
  });

  it('retoma los archivos ya subidos en su casillero', () => {
    const { archivos, cedulaTipo } = archivosDesdeServidor(
      [...ARCHIVOS_CARGADOS, { nombre: 'x.pdf', categoria: 'TARJETA_AZUL' }], armarBloques(FORMULARIO),
    );
    expect(Object.keys(archivos).sort()).toEqual(['CEDULA', 'DNI_DORSO', 'DNI_FRENTE', 'FRENTE', 'TRASERA']);
    expect(cedulaTipo).toBe('TARJETA_AZUL');
  });

  it('el borrador del backend vuelve a la forma del formulario', () => {
    const d = datosDesdeBorrador({ medio: 'tarjeta', tarjeta: { marca: 'Visa', ultimos4: '1234' } });
    expect(d).toEqual({ medio: 'tarjeta', tarjeta_marca: 'Visa', tarjeta_ultimos4: '1234' });
  });
});

describe('subida de archivos', () => {
  it('el input de fotos usa capture="environment" y acepta imagen o PDF', async () => {
    mockApi({ get: resp(200, { ...FORMULARIO, borrador: BORRADOR_TITULAR_Y_VEHICULO, archivos_cargados: ARCHIVOS_CARGADOS.slice(0, 2) }) });
    await render(<EmisionPage token={TOKEN} />);
    // Vehículo ya completo (la cédula es opcional en el catálogo): retoma en Inspección.
    expect(container.textContent).toContain('· Inspección');
    const input = container.querySelector('#archivo-FRENTE');
    expect(input.getAttribute('accept')).toBe('image/*,application/pdf');
    expect(input.getAttribute('capture')).toBe('environment');
  });

  it('rechaza en el cliente un archivo de más de 10 MB sin subirlo', async () => {
    const xhrOpen = vi.fn();
    vi.stubGlobal('XMLHttpRequest', class { open = xhrOpen; send() {} upload = {}; });
    mockApi();
    await render(<EmisionPage token={TOKEN} />);
    const input = container.querySelector('#archivo-DNI_FRENTE');
    const grande = new File([new Uint8Array(1)], 'dni.jpg', { type: 'image/jpeg' });
    Object.defineProperty(grande, 'size', { value: 11 * 1024 * 1024 });
    Object.defineProperty(input, 'files', { value: [grande], configurable: true });
    await act(async () => { input.dispatchEvent(new Event('change', { bubbles: true })); });
    expect(container.textContent).toContain('más de 10 MB');
    expect(xhrOpen).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
