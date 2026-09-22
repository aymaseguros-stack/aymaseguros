/**
 * C-6b · /emision/:token — formulario público de emisión (QR-EMI).
 *
 * Fija lo no negociable del brief:
 *   - token inválido/vencido/usado/revocado → UNA pantalla genérica
 *   - no existe un campo para el número completo de tarjeta
 *   - sin consentimiento no se puede enviar
 *   - en /emision no se inyectan scripts de terceros
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import React from 'react';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import EmisionPage from '../../src/emision/EmisionPage';
import {
  tokenDeLaRuta, campoDelError, API_EMISION, CONFIG_SUBIDA, ErrorApi, mensajeDeSubida,
  subirArchivoConReintentos,
} from '../../src/emision/api';
import { pareceTarjeta, pasaLuhn } from '../../src/emision/luhn';
import {
  armarBloques, armarPayload, datosDesdeBorrador, archivosDesdeServidor,
  archivosSinConfirmar, PROVINCIA_POR_DEFECTO,
} from '../../src/emision/modelo';

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
    // no-transform: Cloudflare no inyecta su beacon de Web Analytics (la URL lleva el token).
    expect(valor('Cache-Control')).toBe('no-store, no-transform');
    // C-6b2: CSP APLICADA y estricta, y la Report-Only global pisada con la
    // misma política (la regla de /emision va después: gana su valor).
    const csp = valor('Content-Security-Policy');
    expect(csp).toBe("default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; connect-src https://api.aymaseguros.com.ar; font-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'");
    expect(csp).not.toContain('unsafe-inline');
    expect(csp).not.toContain('cloudflareinsights');
    expect(valor('Content-Security-Policy-Report-Only')).toBe(csp);
    const html2 = vercel.headers.find((x) => x.source === '/emision.html');
    expect(html2.headers.find((x) => x.key === 'Content-Security-Policy')?.value).toBe(csp);
    // La CSP global del resto del sitio sigue en Report-Only, sin cambios.
    const global = vercel.headers.find((x) => x.source === '/(.*)');
    expect(global.headers.some((x) => x.key === 'Content-Security-Policy')).toBe(false);
    expect(global.headers.find((x) => x.key === 'Content-Security-Policy-Report-Only').value).toContain('googletagmanager');
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

// ---------------------------------------------------------------------------
// C-6o · errores honestos en la subida
// ---------------------------------------------------------------------------

/**
 * XHR de mentira: `respuestas` es la cola de lo que contesta el servidor,
 * un elemento por intento. `{ red: true }` simula que la petición no llega.
 */
/** En los tests la espera entre reintentos es cero: lo que se fija es la lógica. */
const sinEspera = () => {
  const original = CONFIG_SUBIDA.esperas;
  CONFIG_SUBIDA.esperas = [0, 0];
  return () => { CONFIG_SUBIDA.esperas = original; };
};

function xhrFalso(respuestas) {
  const enviados = [];
  class XHRFalso {
    constructor() { this.upload = {}; this.status = 0; this.responseText = ''; }
    open(metodo, url) { this.url = url; }
    send(form) {
      enviados.push(form);
      const r = respuestas[enviados.length - 1] ?? respuestas[respuestas.length - 1];
      queueMicrotask(() => {
        if (this.upload.onprogress) this.upload.onprogress({ lengthComputable: true, loaded: 1, total: 2 });
        if (r.red) { this.onerror?.(); return; }
        this.status = r.status;
        this.responseText = r.texto ?? JSON.stringify(r.cuerpo ?? { ok: true, archivos: [{ id: 'a1' }] });
        this.onload?.();
      });
    }
  }
  vi.stubGlobal('XMLHttpRequest', XHRFalso);
  return enviados;
}

const archivoFalso = (nombre = 'dni.jpg') =>
  new File([new Uint8Array([1, 2, 3])], nombre, { type: 'image/jpeg' });

/** Los pasos ya alcanzados se navegan desde la barra de progreso. */
const pasos = () => [...container.querySelectorAll('nav[aria-label="Progreso"] button')];
const irAPaso = async (indice) => {
  const lista = pasos();
  await click(lista.at(indice));
};
const irABloque = async (titulo) => {
  const destino = pasos().findIndex((b) => (b.getAttribute('aria-label') || '').startsWith(titulo));
  if (destino >= 0) await irAPaso(destino);
};

/**
 * Elige un archivo en el casillero `slot` y espera a que la subida termine,
 * reintentos incluidos (en los tests las esperas son de 0 ms).
 */
const elegirArchivo = async (slot, archivo = archivoFalso()) => {
  const input = container.querySelector(`#archivo-${slot}`);
  Object.defineProperty(input, 'files', { value: [archivo], configurable: true });
  await act(async () => { input.dispatchEvent(new Event('change', { bubbles: true })); });
  for (let i = 0; i < 20 && /Subiendo|Reintentando/.test(casillero(slot).textContent); i += 1) {
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
  }
};

const casillero = (slot) => container.querySelector(`#archivo-${slot}`).closest('div.rounded-xl');

describe('C-6o · el mensaje dice la causa real', () => {
  const online = (valor) => vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(valor);
  afterEach(() => vi.restoreAllMocks());

  it('sin conexión: lo dice, y no culpa al servidor', () => {
    online(false);
    expect(mensajeDeSubida(new ErrorApi(null, null))).toBe(
      'Te quedaste sin conexión. Cuando vuelva, tocá Reintentar.',
    );
  });

  it('con conexión y la petición que no llega: no dice "no hay conexión"', () => {
    online(true);
    const m = mensajeDeSubida(new ErrorApi(null, null));
    expect(m).toBe('Se cortó la subida antes de llegar a nuestro servidor. Probá de nuevo.');
    expect(m).not.toMatch(/sin conexión/i);
  });

  it('error del servidor (5xx): el mensaje del brief, sin hablar de la conexión', () => {
    online(true);
    for (const status of [500, 502, 503]) {
      const m = mensajeDeSubida(new ErrorApi(status, null));
      expect(m).toBe('No pudimos guardar la foto. Probá de nuevo.');
      expect(m).not.toMatch(/conexi[oó]n/i);
    }
  });

  it('422: muestra el motivo del campo que da el backend', () => {
    online(true);
    expect(mensajeDeSubida(new ErrorApi(422, 'La foto está borrosa: no se lee la patente.')))
      .toBe('La foto está borrosa: no se lee la patente.');
  });

  it('archivo muy grande (413): dice cuál es el límite', () => {
    online(true);
    expect(mensajeDeSubida(new ErrorApi(413, null))).toBe('El archivo es demasiado grande. El máximo es 10 MB.');
  });

  it('un 5xx mientras el navegador está offline se cuenta como sin conexión solo si la petición no llegó', () => {
    online(false);
    expect(new ErrorApi(500, null).clase).toBe('servidor');
    expect(new ErrorApi(null, null).clase).toBe('sin_conexion');
  });
});

describe('C-6o · reintento automático', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it('reintenta 2 veces ante un 5xx y sale bien en el tercer intento', async () => {
    const enviados = xhrFalso([{ status: 500 }, { status: 500 }, { status: 201 }]);
    const intentos = [];
    const r = await subirArchivoConReintentos(
      TOKEN, archivoFalso(), 'DNI_FRENTE-dni.jpg', 'DNI_CEDULA', null, (n) => intentos.push(n), [0, 0],
    );
    expect(enviados).toHaveLength(3);
    expect(intentos).toEqual([1, 2, 3]);
    expect(r).toBeTruthy();
  });

  it('agotados los reintentos, falla con el mensaje del servidor', async () => {
    const enviados = xhrFalso([{ status: 500 }]);
    await expect(
      subirArchivoConReintentos(TOKEN, archivoFalso(), 'n.jpg', 'DNI_CEDULA', null, null, [0, 0]),
    ).rejects.toMatchObject({ clase: 'servidor' });
    expect(enviados).toHaveLength(3); // el primero + 2 reintentos
  });

  it('un corte de red también se reintenta', async () => {
    const enviados = xhrFalso([{ red: true }, { status: 200 }]);
    await subirArchivoConReintentos(TOKEN, archivoFalso(), 'n.jpg', 'DNI_CEDULA', null, null, [0, 0]);
    expect(enviados).toHaveLength(2);
  });

  it('un 422 NO se reintenta: repetirlo da lo mismo', async () => {
    const enviados = xhrFalso([{ status: 422, texto: JSON.stringify({ detail: 'Foto borrosa.' }) }]);
    await expect(
      subirArchivoConReintentos(TOKEN, archivoFalso(), 'n.jpg', 'DNI_CEDULA', null, null, [0, 0]),
    ).rejects.toMatchObject({ status: 422, detalle: 'Foto borrosa.' });
    expect(enviados).toHaveLength(1);
  });

  it('un 413 tampoco se reintenta', async () => {
    const enviados = xhrFalso([{ status: 413 }]);
    await expect(
      subirArchivoConReintentos(TOKEN, archivoFalso(), 'n.jpg', 'DNI_CEDULA', null, null, [0, 0]),
    ).rejects.toMatchObject({ clase: 'grande' });
    expect(enviados).toHaveLength(1);
  });
});

describe('C-6o · "Cargado" exige confirmación del servidor', () => {
  let restaurar;
  beforeEach(() => { restaurar = sinEspera(); });
  afterEach(() => { restaurar(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it('un 2xx con cuerpo legible confirma: recién ahí dice Cargado', async () => {
    xhrFalso([{ status: 201, cuerpo: { ok: true, archivos: [{ id: 'a1' }] } }]);
    mockApi();
    await render(<EmisionPage token={TOKEN} />);
    expect(casillero('DNI_FRENTE').textContent).not.toContain('Cargado');
    await elegirArchivo('DNI_FRENTE');
    expect(casillero('DNI_FRENTE').textContent).toContain('Cargado');
  });

  it('un 2xx sin cuerpo legible NO es confirmación: no dice Cargado y avisa', async () => {
    xhrFalso([{ status: 200, texto: '<html>502 Bad Gateway</html>' }]);
    mockApi();
    await render(<EmisionPage token={TOKEN} />);
    await elegirArchivo('DNI_FRENTE');
    const c = casillero('DNI_FRENTE');
    expect(c.textContent).not.toContain('Cargado');
    expect(c.textContent).toContain('No pudimos confirmar que la foto se haya guardado.');
  });

  it('si falla la subida no dice Cargado y ofrece Reintentar y Quitar', async () => {
    xhrFalso([{ status: 500 }]);
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    mockApi();
    await render(<EmisionPage token={TOKEN} />);
    await elegirArchivo('DNI_FRENTE');
    const c = casillero('DNI_FRENTE');
    expect(c.textContent).not.toContain('Cargado');
    expect(c.textContent).toContain('No pudimos guardar la foto. Probá de nuevo.');
    expect([...c.querySelectorAll('button')].map((b) => b.textContent)).toEqual(
      expect.arrayContaining(['Reintentar', 'Quitar']),
    );
  });

  it('mientras sube, el casillero no dice Cargado', async () => {
    let soltar;
    class XHRLento {
      constructor() { this.upload = {}; }
      open() {}
      send() { soltar = () => { this.status = 201; this.responseText = '{"ok":true}'; this.onload(); }; }
    }
    vi.stubGlobal('XMLHttpRequest', XHRLento);
    mockApi();
    await render(<EmisionPage token={TOKEN} />);
    const input = container.querySelector('#archivo-DNI_FRENTE');
    Object.defineProperty(input, 'files', { value: [archivoFalso()], configurable: true });
    await act(async () => { input.dispatchEvent(new Event('change', { bubbles: true })); });
    expect(casillero('DNI_FRENTE').textContent).toContain('Subiendo…');
    expect(casillero('DNI_FRENTE').textContent).not.toContain('Cargado');
    await act(async () => { soltar(); });
    expect(casillero('DNI_FRENTE').textContent).toContain('Cargado');
  });
});

describe('C-6o · no se envía con archivos sin confirmar', () => {
  const bloques = armarBloques(FORMULARIO);
  let restaurar;
  beforeEach(() => { restaurar = sinEspera(); });
  afterEach(() => { restaurar(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it('nombra los casilleros a medias y por qué', () => {
    const pendientes = archivosSinConfirmar(bloques, {
      DNI_FRENTE: { estado: 'hecho' },
      DNI_DORSO: { estado: 'error', error: 'No pudimos guardar la foto. Probá de nuevo.' },
      FRENTE: { estado: 'subiendo', progreso: 40 },
    });
    expect(pendientes.map((p) => [p.titulo, p.motivo])).toEqual([
      ['DNI – dorso', 'no se pudo subir'],
      ['Frente del vehículo', 'todavía se está subiendo'],
      ['Parte trasera', 'falta cargarlo'],
    ]);
  });

  it('con todo confirmado no queda nada pendiente', () => {
    const hecho = { estado: 'hecho' };
    expect(archivosSinConfirmar(bloques, {
      DNI_FRENTE: hecho, DNI_DORSO: hecho, FRENTE: hecho, TRASERA: hecho,
    })).toEqual([]);
  });

  it('al enviar avisa cuáles son y no llama a /enviar', async () => {
    xhrFalso([{ status: 500 }]);
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    mockApi({ get: resp(200, {
      ...FORMULARIO,
      borrador: { ...BORRADOR_TITULAR_Y_VEHICULO, medio: 'efectivo_transferencia' },
      archivos_cargados: ARCHIVOS_CARGADOS,
    }) });
    await render(<EmisionPage token={TOKEN} />);

    // Rompemos a propósito uno de los archivos ya cargados.
    await irABloque('Inspección');
    await elegirArchivo('TRASERA');
    expect(casillero('TRASERA').textContent).not.toContain('Cargado');

    await irAPaso(-1); // Confirmar
    const casilla = container.querySelector('input[name="consentimiento"]');
    await act(async () => { casilla.click(); });
    fetch.mockClear();
    await click(boton('Enviar mis datos'));

    expect(container.textContent).toContain('Parte trasera (no se pudo subir)');
    expect(container.textContent).toContain('Reintentá la subida o quitalos.');
    expect(fetch.mock.calls.some(([u]) => String(u).endsWith('/enviar'))).toBe(false);
    expect(container.textContent).not.toContain('Recibimos tus datos');
  });

  it('quitar el archivo opcional que falló destraba el envío', async () => {
    xhrFalso([{ status: 500 }]);
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    mockApi({ get: resp(200, {
      ...FORMULARIO,
      borrador: { ...BORRADOR_TITULAR_Y_VEHICULO, medio: 'efectivo_transferencia' },
      archivos_cargados: ARCHIVOS_CARGADOS,
    }) });
    await render(<EmisionPage token={TOKEN} />);

    // La cédula es opcional en el catálogo: si su subida falla, igual bloquea…
    await irABloque('Vehículo');
    await elegirArchivo('CEDULA');
    expect(casillero('CEDULA').textContent).toContain('No pudimos guardar la foto.');

    // …y se destraba quitándola.
    await click([...casillero('CEDULA').querySelectorAll('button')].find((b) => b.textContent === 'Quitar'));
    expect(casillero('CEDULA').textContent).not.toContain('No pudimos guardar la foto.');

    await irAPaso(-1); // Confirmar
    const casilla = container.querySelector('input[name="consentimiento"]');
    await act(async () => { casilla.click(); });
    await click(boton('Enviar mis datos'));
    expect(container.textContent).toContain('Recibimos tus datos');
  });
});

describe('C-6o · provincia en el domicilio', () => {
  it('el bloque del titular tiene provincia junto a localidad y CP', () => {
    const [titular] = armarBloques(FORMULARIO);
    const nombres = titular.campos.map((c) => c.nombre);
    expect(nombres).toContain('provincia');
    expect(nombres.indexOf('provincia')).toBe(nombres.indexOf('localidad') + 1);
    expect(titular.campos.find((c) => c.nombre === 'provincia').requerido).toBe(true);
  });

  it('si el catálogo del backend no la trae, la agregamos igual', () => {
    const sinProvincia = {
      ...FORMULARIO,
      secciones: FORMULARIO.secciones.map((s) => (s.codigo === 'TITULAR'
        ? { ...s, campos: s.campos.filter((c) => c.nombre !== 'provincia') } : s)),
    };
    const nombres = armarBloques(sinProvincia)[0].campos.map((c) => c.nombre);
    expect(nombres).toContain('provincia');
  });

  it('viene con Santa Fe puesta y viaja en el borrador que se guarda', async () => {
    const puts = [];
    mockApi({
      get: resp(200, {
        ...FORMULARIO, borrador: BORRADOR_TITULAR_Y_VEHICULO, archivos_cargados: ARCHIVOS_CARGADOS,
      }),
      put: (url, opts) => { puts.push(JSON.parse(opts.body)); return resp(200, { ok: true }); },
    });
    await render(<EmisionPage token={TOKEN} />);
    while (boton('Atrás')) await click(boton('Atrás'));
    const select = container.querySelector('#campo-provincia');
    expect(select.value).toBe(PROVINCIA_POR_DEFECTO);
    expect(PROVINCIA_POR_DEFECTO).toBe('Santa Fe');

    await click(boton('Guardar y seguir'));
    expect(puts.at(-1).datos.provincia).toBe('Santa Fe');
    expect(puts.at(-1).datos.localidad).toBe('Rosario');
    expect(puts.at(-1).datos.codigo_postal).toBe('2000');
  });

  it('el borrador del backend gana sobre el valor por defecto', async () => {
    mockApi({ get: resp(200, {
      ...FORMULARIO,
      borrador: { ...BORRADOR_TITULAR_Y_VEHICULO, provincia: 'Córdoba' },
      archivos_cargados: ARCHIVOS_CARGADOS,
    }) });
    await render(<EmisionPage token={TOKEN} />);
    while (boton('Atrás')) await click(boton('Atrás'));
    expect(container.querySelector('#campo-provincia').value).toBe('Córdoba');
  });
});
