import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  tokenizar,
  retryPendingTokens,
  purgarColaPendiente,
  PENDING_KEY,
  MAX_INTENTOS,
} from '../../src/utils/tokenVault';

const cola = () => JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
const resp = (status) => ({ ok: status < 300, status, json: async () => ({ token: 'T', hash: 'H' }) });

describe('tokenVault', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('no envía tipos fuera de la whitelist', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const r = await tokenizar('bot_action', {});
    expect(r.error).toBe('tipo_invalido');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    expect(cola()).toHaveLength(0);
  });

  it('un 4xx no se encola', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(resp(401));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await tokenizar('consulta', {});
    expect(cola()).toHaveLength(0);
  });

  it('5xx y error de red se encolan', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(resp(503)).mockRejectedValueOnce(new Error('net'));
    await tokenizar('consulta', {});
    await tokenizar('lead', {});
    expect(cola()).toHaveLength(2);
  });

  it('retry descarta 4xx, saca los 2xx y respeta el tope de intentos', async () => {
    localStorage.setItem(PENDING_KEY, JSON.stringify([
      { tipo: 'consulta', payload: {}, origen: 'a', intentos: 0 },
      { tipo: 'lead', payload: {}, origen: 'b', intentos: 0 },
      { tipo: 'contacto', payload: {}, origen: 'c', intentos: 0 },
      { tipo: 'phone_click', payload: {}, origen: 'd', intentos: MAX_INTENTOS - 1 },
    ]));
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(resp(401))
      .mockResolvedValueOnce(resp(200))
      .mockResolvedValueOnce(resp(500))
      .mockResolvedValueOnce(resp(500));
    await retryPendingTokens();
    expect(cola()).toEqual([{ tipo: 'contacto', payload: {}, origen: 'c', intentos: 1 }]);
  });

  it('purga la cola vieja y los tipos inválidos', () => {
    localStorage.setItem('ayma_pending_tokens', JSON.stringify([{ tipo: 'bot_action' }]));
    localStorage.setItem(PENDING_KEY, JSON.stringify([
      { tipo: 'bot_session' },
      { tipo: undefined },
      { tipo: 'lead', intentos: 0 },
    ]));
    purgarColaPendiente();
    expect(localStorage.getItem('ayma_pending_tokens')).toBeNull();
    expect(cola()).toEqual([{ tipo: 'lead', intentos: 0 }]);
  });
});
