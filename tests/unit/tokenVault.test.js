import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  tokenizar,
  retryPendingTokens,
  purgarColaPendiente,
  PENDING_KEY,
  MAX_INTENTOS,
  MAX_EDAD_MS,
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
    const ts = Date.now();
    localStorage.setItem(PENDING_KEY, JSON.stringify([
      { tipo: 'consulta', payload: {}, origen: 'a', intentos: 0, timestamp: ts },
      { tipo: 'lead', payload: {}, origen: 'b', intentos: 0, timestamp: ts },
      { tipo: 'contacto', payload: {}, origen: 'c', intentos: 0, timestamp: ts },
      { tipo: 'phone_click', payload: {}, origen: 'd', intentos: MAX_INTENTOS - 1, timestamp: ts },
    ]));
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(resp(401))
      .mockResolvedValueOnce(resp(200))
      .mockResolvedValueOnce(resp(500))
      .mockResolvedValueOnce(resp(500));
    await retryPendingTokens();
    expect(cola()).toEqual([
      { tipo: 'contacto', payload: {}, origen: 'c', intentos: 1, timestamp: ts },
    ]);
  });

  it('purga la cola vieja y los tipos inválidos', () => {
    localStorage.setItem('ayma_pending_tokens', JSON.stringify([{ tipo: 'bot_action' }]));
    const ts = Date.now();
    localStorage.setItem(PENDING_KEY, JSON.stringify([
      { tipo: 'bot_session', timestamp: ts },
      { tipo: undefined, timestamp: ts },
      { tipo: 'lead', intentos: 0, timestamp: ts },
    ]));
    purgarColaPendiente();
    expect(localStorage.getItem('ayma_pending_tokens')).toBeNull();
    expect(cola()).toEqual([{ tipo: 'lead', intentos: 0, timestamp: ts }]);
  });
});

describe('tokenVault — purga por antigüedad (H-46)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('descarta las entradas de más de 7 días al inicializar', () => {
    const viejo = Date.now() - MAX_EDAD_MS - 1000;
    localStorage.setItem(
      PENDING_KEY,
      JSON.stringify([
        { tipo: 'lead', payload: {}, intentos: 0, timestamp: viejo },
        { tipo: 'lead', payload: {}, intentos: 0, timestamp: Date.now() },
      ])
    );

    purgarColaPendiente();

    expect(cola()).toHaveLength(1);
    expect(cola()[0].timestamp).toBeGreaterThan(viejo);
  });

  it('una entrada sin timestamp se considera vencida y se descarta', () => {
    localStorage.setItem(
      PENDING_KEY,
      JSON.stringify([{ tipo: 'lead', payload: {}, intentos: 0 }])
    );

    purgarColaPendiente();

    expect(cola()).toHaveLength(0);
  });
});
