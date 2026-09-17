/**
 * Setup global para Vitest
 * Se ejecuta antes de todos los tests
 */

import '@testing-library/jest-dom';

// Configurar localStorage mock
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

// happy-dom >= 15 expone localStorage solo como getter: redefinirlo en vez de asignar
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, configurable: true, writable: true });

// Mock de console para tests más limpios (opcional)
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Limpiar localStorage antes de cada test
beforeEach(() => {
  localStorage.clear();
});

// Mock de fetch para tests
global.fetch = vi.fn();

beforeEach(() => {
  fetch.mockClear();
});
