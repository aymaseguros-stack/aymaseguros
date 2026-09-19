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
    // window.open: el submit del cotizador abre WhatsApp.
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
      it(`el submit de "${tab}" postea al portal antes de abrir WhatsApp`, async () => {
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
      });
    });

    it('si el portal falla, igual se abre WhatsApp y el lead queda encolado', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(503));
      await render(<HeroSection />);

      await submitForm(container.querySelector('form'));

      expect(globalThis.open).toHaveBeenCalled();
      expect(JSON.parse(localStorage.getItem('ayma_pending_leads_v1') || '[]')).toHaveLength(1);
      expect(console.error).toHaveBeenCalled();
    });

    it('un 4xx del portal no encola nada', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(400));
      await render(<HeroSection />);

      await submitForm(container.querySelector('form'));

      expect(JSON.parse(localStorage.getItem('ayma_pending_leads_v1') || '[]')).toHaveLength(0);
    });
  });
});
