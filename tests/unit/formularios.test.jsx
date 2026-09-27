/**
 * Los formularios de la landing, renderizados de verdad.
 *
 * Se usa react-dom/client + act directamente: no hay @testing-library/react
 * en el proyecto y no se agregan dependencias.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import Footer from '../../src/components/Footer';
import HeroSection from '../../src/components/HeroSection';
import Header from '../../src/components/Header';
import ChatBot from '../../src/components/ChatBot';
import { LEADS_URL } from '../../src/services/leads';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const esPortal = (call) => String(call[0]).includes('/api/v1/leads/');
const postsAlPortal = (mock) => mock.mock.calls.filter(esPortal);

const resp = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

let container;
let root;

const render = async (element) => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => { root.render(element); });
};

const submitForm = async (form) => {
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
};

describe('formularios de la landing', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // window.open: el Header y el chatbot abren WhatsApp; el hero ya no.
    vi.stubGlobal('open', vi.fn(() => ({ closed: false, location: { href: '' } })));
  });

  afterEach(async () => {
    if (root) await act(async () => { root.unmount(); });
    container?.remove();
    root = null;
    vi.unstubAllGlobals();
  });

  describe('Footer — contacto', () => {
    it('el submit postea al portal', async () => {
      const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(201, { token: 'AYMA-LED-9' }));
      await render(<Footer />);

      await submitForm(container.querySelector('form'));

      expect(postsAlPortal(f)).toHaveLength(1);
      expect(postsAlPortal(f)[0][0]).toBe(LEADS_URL);
    });

    it('muestra éxito cuando el portal acepta el lead', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(201, { token: 'AYMA-LED-9' }));
      await render(<Footer />);

      await submitForm(container.querySelector('form'));

      expect(container.textContent).toMatch(/enviado/i);
    });

    it('NO muestra éxito si el POST al portal falla', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(500));
      await render(<Footer />);

      await submitForm(container.querySelector('form'));

      expect(container.textContent).not.toMatch(/enviado/i);
      expect(container.textContent).toMatch(/no pudimos|error|whatsapp/i);
    });

    it('NO muestra éxito si el portal rechaza el body (4xx)', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(422));
      await render(<Footer />);

      await submitForm(container.querySelector('form'));

      expect(container.textContent).not.toMatch(/enviado/i);
    });

    it('manda el mensaje del formulario al portal', async () => {
      const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(201, {}));
      await render(<Footer />);

      const textarea = container.querySelector('textarea');
      expect(textarea).toBeTruthy();
      await act(async () => {
        const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
        set.call(textarea, 'Quiero cotizar mi casa');
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await submitForm(container.querySelector('form'));

      const body = JSON.parse(postsAlPortal(f)[0][1].body);
      expect(body.mensaje).toBe('Quiero cotizar mi casa');
      expect(body.session_token).toBeUndefined();
    });

    it('muestra éxito aunque falle solo el Vault', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation((url) =>
        Promise.resolve(esPortal([url]) ? resp(201, { token: 'T' }) : resp(500))
      );
      await render(<Footer />);

      await submitForm(container.querySelector('form'));

      expect(container.textContent).toMatch(/enviado/i);
    });
  });

  describe('HeroSection — cotizador', () => {
    const TABS = ['Vehículo', 'Hogar', 'ART', 'Comercio', 'Vida'];

    TABS.forEach((tab, i) => {
      it(`el submit de "${tab}" postea al portal y no abre ventanas solo`, async () => {
        const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(201, { token: 'T' }));
        await render(<HeroSection />);

        // Cambiar de pestaña (la primera ya está activa)
        if (i > 0) {
          const botones = Array.from(container.querySelectorAll('button'));
          const btn = botones.find((b) => b.textContent.trim() === tab);
          expect(btn, `no se encontró la pestaña ${tab}`).toBeTruthy();
          await act(async () => { btn.click(); });
        }

        await submitForm(container.querySelector('form'));

        expect(postsAlPortal(f)).toHaveLength(1);
        expect(postsAlPortal(f)[0][0]).toBe(LEADS_URL);
        expect(globalThis.open).not.toHaveBeenCalled();
        const body = JSON.parse(postsAlPortal(f)[0][1].body);
        expect(body.session_token).toBeUndefined();
        expect(body.page_url).not.toContain('?');
      });
    });

    it('si el portal falla, queda el botón de WhatsApp y el lead encolado', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(503));
      await render(<HeroSection />);

      await submitForm(container.querySelector('form'));

      expect(globalThis.open).not.toHaveBeenCalled();
      expect(container.querySelector('a[href^="https://wa.me/"]')).toBeTruthy();
      expect(JSON.parse(localStorage.getItem('ayma_pending_leads_v1') || '[]')).toHaveLength(1);
      expect(console.error).toHaveBeenCalled();
    });

    it('confirma en pantalla cuando el portal acepta el lead, con WhatsApp de respaldo', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(201, { token: 'AYMA-T1' }));
      await render(<HeroSection />);

      await submitForm(container.querySelector('form'));

      expect(container.textContent).toMatch(/Recibimos tu pedido/);
      const wa = container.querySelector('a[href^="https://wa.me/"]');
      expect(wa.textContent).toMatch(/Escribinos por WhatsApp/);
      expect(wa.getAttribute('target')).toBe('_blank');
      expect(wa.getAttribute('rel')).toBe('noopener');
      expect(decodeURIComponent(wa.href)).toContain('Ref: AYMA-T1');
    });

    it('la confirmación no espera al Vault', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      // El Vault no responde nunca; el portal sí.
      vi.spyOn(globalThis, 'fetch').mockImplementation((url) =>
        esPortal([url]) ? Promise.resolve(resp(201, { token: 'AYMA-T2' })) : new Promise(() => {})
      );
      await render(<HeroSection />);

      await submitForm(container.querySelector('form'));

      expect(container.textContent).toMatch(/Recibimos tu pedido/);
      const wa = container.querySelector('a[href^="https://wa.me/"]');
      expect(decodeURIComponent(wa.href)).toContain('Ref: AYMA-T2');
    });

    it('si el POST falla NO confirma: muestra error con botón de WhatsApp', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(500));
      await render(<HeroSection />);

      await submitForm(container.querySelector('form'));

      expect(container.textContent).not.toMatch(/Recibimos tu pedido/);
      expect(container.textContent).toMatch(/No pudimos registrar/);
      expect(container.querySelector('a[href^="https://wa.me/"]')).toBeTruthy();
    });

    ['auto', 'moto'].forEach((ramo) => {
      it(`#cotizar-${ramo} abre Vehículo con "${ramo}" preseleccionado`, async () => {
        window.location.hash = `#cotizar-${ramo}`;
        await render(<HeroSection />);
        expect(container.querySelector('form select').value).toBe(ramo);
        window.location.hash = '';
      });
    });

    it('un 4xx del portal no encola nada', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(400));
      await render(<HeroSection />);

      await submitForm(container.querySelector('form'));

      expect(JSON.parse(localStorage.getItem('ayma_pending_leads_v1') || '[]')).toHaveLength(0);
    });
  });

  describe('Header — WhatsApp, Siniestro e Ingresar', () => {
    ['Cotizá', 'Siniestro', 'Ingresar'].forEach((label) => {
      it(`"${label}" abre la ventana dentro del click, sin esperar al Vault`, async () => {
        // El Vault no responde nunca: si el handler lo esperara, no abriría.
        vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
        await render(<Header isChatOpen={false} onOpenChat={() => {}} />);

        const btn = Array.from(container.querySelectorAll('button'))
          .find((b) => b.textContent.trim().endsWith(label));
        expect(btn, `no se encontró ${label}`).toBeTruthy();

        // Sincrónico: ni un microtask entre el click y el window.open.
        btn.click();
        expect(globalThis.open).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('ChatBot — WhatsApp', () => {
    it('el botón abre wa.me dentro del click, sin esperar al Vault', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
      await render(<ChatBot isOpen setIsOpen={() => {}} />);

      const btn = Array.from(container.querySelectorAll('button'))
        .find((b) => b.textContent.includes('WhatsApp'));
      btn.click();

      expect(globalThis.open).toHaveBeenCalledTimes(1);
      expect(globalThis.open.mock.calls[0][0]).toMatch(/^https:\/\/wa\.me\//);
    });

    it('"hablar con un ejecutivo" abre wa.me en el mismo gesto, sin setTimeout', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
      await render(<ChatBot isOpen setIsOpen={() => {}} />);

      const input = container.querySelector('input');
      await act(async () => {
        const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        set.call(input, '3');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      const enviar = container.querySelector('button[aria-label="Enviar mensaje"]');
      enviar.click();

      expect(globalThis.open).toHaveBeenCalledTimes(1);
    });
  });
});
