import { describe, it, expect } from 'vitest';

/**
 * Tests unitarios para validación de datos
 * Simula la lógica de validación del chatbot
 */

describe('Validación - Año del vehículo', () => {
  function validateYear(input) {
    const year = parseInt(input);
    if (isNaN(year) || year < 1980 || year > 2026) {
      return {
        valid: false,
        error: 'Por favor, ingresá un año válido.'
      };
    }
    return { valid: true, value: year };
  }

  it('debe aceptar años válidos', () => {
    expect(validateYear('2020').valid).toBe(true);
    expect(validateYear('2021').valid).toBe(true);
    expect(validateYear('1980').valid).toBe(true);
    expect(validateYear('2026').valid).toBe(true);
  });

  it('debe rechazar años muy antiguos', () => {
    const result = validateYear('1979');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('debe rechazar años futuros', () => {
    const result = validateYear('2027');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('debe rechazar valores no numéricos', () => {
    const result = validateYear('abc');
    expect(result.valid).toBe(false);
  });

  it('debe rechazar strings vacíos', () => {
    const result = validateYear('');
    expect(result.valid).toBe(false);
  });

  it('debe aceptar años como número', () => {
    const result = validateYear(2022);
    expect(result.valid).toBe(true);
  });
});

describe('Validación - Código postal', () => {
  function validatePostalCode(input) {
    const code = input.trim();
    if (code.length < 4 || code.length > 8) {
      return { valid: false, error: 'Código postal inválido' };
    }
    return { valid: true, value: code };
  }

  it('debe aceptar códigos postales válidos', () => {
    expect(validatePostalCode('2000').valid).toBe(true);
    expect(validatePostalCode('1234').valid).toBe(true);
    expect(validatePostalCode('S2000ABC').valid).toBe(true);
  });

  it('debe rechazar códigos muy cortos', () => {
    expect(validatePostalCode('123').valid).toBe(false);
  });

  it('debe rechazar códigos muy largos', () => {
    expect(validatePostalCode('123456789').valid).toBe(false);
  });

  it('debe eliminar espacios en blanco', () => {
    const result = validatePostalCode('  2000  ');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('2000');
  });
});

describe('Validación - Nombre', () => {
  function validateName(input) {
    const name = input.trim();
    if (name.length < 2) {
      return { valid: false, error: 'Nombre muy corto' };
    }
    if (name.length > 100) {
      return { valid: false, error: 'Nombre muy largo' };
    }
    return { valid: true, value: name };
  }

  it('debe aceptar nombres válidos', () => {
    expect(validateName('Juan Pérez').valid).toBe(true);
    expect(validateName('María').valid).toBe(true);
    expect(validateName('José Luis Rodríguez').valid).toBe(true);
  });

  it('debe rechazar nombres muy cortos', () => {
    expect(validateName('A').valid).toBe(false);
  });

  it('debe rechazar nombres vacíos', () => {
    expect(validateName('').valid).toBe(false);
  });

  it('debe eliminar espacios', () => {
    const result = validateName('  Juan  ');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('Juan');
  });
});

describe('Validación - Marca y modelo', () => {
  function validateText(input, minLength = 2, maxLength = 50) {
    const text = input.trim();
    if (text.length < minLength || text.length > maxLength) {
      return { valid: false };
    }
    return { valid: true, value: text };
  }

  it('debe aceptar marcas válidas', () => {
    expect(validateText('Toyota').valid).toBe(true);
    expect(validateText('Honda').valid).toBe(true);
    expect(validateText('Volkswagen').valid).toBe(true);
  });

  it('debe aceptar modelos válidos', () => {
    expect(validateText('Corolla').valid).toBe(true);
    expect(validateText('Civic').valid).toBe(true);
    expect(validateText('Gol').valid).toBe(true);
  });

  it('debe rechazar textos muy cortos', () => {
    expect(validateText('A').valid).toBe(false);
  });

  it('debe rechazar textos muy largos', () => {
    const longText = 'A'.repeat(51);
    expect(validateText(longText).valid).toBe(false);
  });
});

describe('Validación - Cobertura', () => {
  function validateCoverage(input) {
    const coverage = input.trim().toLowerCase();
    const validCoverages = [
      'rc',
      'responsabilidad civil',
      'terceros',
      'terceros completo',
      'terceros con granizo',
      'todo riesgo'
    ];

    // Simplificado: aceptar cualquier input para la demo
    if (coverage.length < 2) {
      return { valid: false };
    }
    return { valid: true, value: input.trim() };
  }

  it('debe aceptar coberturas válidas', () => {
    expect(validateCoverage('RC').valid).toBe(true);
    expect(validateCoverage('Terceros').valid).toBe(true);
    expect(validateCoverage('Todo Riesgo').valid).toBe(true);
    expect(validateCoverage('Terceros con Granizo').valid).toBe(true);
  });

  it('debe aceptar variaciones de mayúsculas', () => {
    expect(validateCoverage('rc').valid).toBe(true);
    expect(validateCoverage('RC').valid).toBe(true);
    expect(validateCoverage('Rc').valid).toBe(true);
  });

  it('debe rechazar entradas muy cortas', () => {
    expect(validateCoverage('R').valid).toBe(false);
  });
});
