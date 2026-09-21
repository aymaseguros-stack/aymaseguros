import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { capturarAtribucion, getAtribucion, getSlugQR, ATTRIB_KEY } from '../../src/services/attribution';
import { armarBodyPortal, whatsappUrl } from '../../src/services/leads';

const vercel = JSON.parse(readFileSync(resolve(__dirname, '../../vercel.json'), 'utf8'));

/** Emula el matcheo de Vercel para `/r/:slug` (la query la agrega Vercel intacta). */
function resolverRedirect(url) {
  const u = new URL(url, 'https://www.aymaseguros.com.ar');
  for (const r of vercel.redirects || []) {
    const re = new RegExp('^' + r.source.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '/?$');
    const m = u.pathname.match(re);
    if (!m) continue;
    const dest = r.destination.replace(/:(\w+)/g, (_, k) => m.groups[k]);
    return { status: r.statusCode, location: dest + u.search };
  }
  return null;
}

describe('C-12D: redirección /r/:slug', () => {
  it('es un redirect 302 (no rewrite) a api.aymaseguros.com.ar', () => {
    const r = vercel.redirects.find((x) => x.source === '/r/:slug');
    expect(r).toBeTruthy();
    expect(r.statusCode).toBe(302);
    expect(r.destination).toBe('https://api.aymaseguros.com.ar/r/:slug');
    expect((vercel.rewrites || []).some((x) => x.source.startsWith('/r/'))).toBe(false);
  });

  it('preserva el slug y la query', () => {
    expect(resolverRedirect('/r/jefa-auto?utm_source=qr&x=1')).toEqual({
      status: 302,
      location: 'https://api.aymaseguros.com.ar/r/jefa-auto?utm_source=qr&x=1',
    });
    expect(resolverRedirect('/')).toBeNull();
  });
});

describe('C-12D: captura de ayma_pc', () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('guarda ayma_pc junto con los utm y lo manda como slug_qr', () => {
    window.history.replaceState({}, '', '/?ayma_pc=jefa-auto&utm_source=qr&utm_medium=print&fbclid=abc');
    capturarAtribucion();
    window.history.replaceState({}, '', '/');

    const guardada = JSON.parse(sessionStorage.getItem(ATTRIB_KEY));
    expect(guardada).toMatchObject({ ayma_pc: 'jefa-auto', utm_source: 'qr', fbclid: 'abc' });
    expect(getSlugQR()).toBe('jefa-auto');

    const body = armarBodyPortal({ nombre: 'Ana' }, getAtribucion('hero_auto'));
    expect(body).toMatchObject({ nombre: 'Ana', slug_qr: 'jefa-auto', utm_source: 'qr', utm_medium: 'print' });
  });

  it('agrega Ref del QR al texto de WhatsApp', () => {
    window.history.replaceState({}, '', '/?ayma_pc=jefa-auto');
    capturarAtribucion();
    expect(decodeURIComponent(whatsappUrl('Hola'))).toContain('Hola\n\nRef: jefa-auto');
  });

  it('sin QR no agrega slug_qr ni Ref', () => {
    capturarAtribucion();
    expect(armarBodyPortal({ nombre: 'Ana' }, getAtribucion('x')).slug_qr).toBeUndefined();
    expect(decodeURIComponent(whatsappUrl('Hola'))).not.toContain('Ref:');
  });
});
