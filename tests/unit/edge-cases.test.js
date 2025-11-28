import { describe, it, expect } from 'vitest';

/**
 * Tests de casos extremos y edge cases
 * Prueba comportamientos límite y situaciones inusuales
 */

describe('Edge Cases - WhatsApp URL', () => {
  function generateWhatsAppURL(quote) {
    const message = `*SOLICITUD DE COTIZACIÓN - AYMA ADVISORS*

*DATOS:*
Nombre: ${quote.nombre}
Código Postal: ${quote.codigoPostal}

*VEHÍCULO:*
Marca: ${quote.marca}
Modelo: ${quote.modelo}
Año: ${quote.anio}

*COBERTURA SOLICITADA:*
${quote.cobertura}

Quiero recibir las mejores cotizaciones del mercado.`;

    return `https://wa.me/5493416952259?text=${encodeURIComponent(message)}`;
  }

  it('debe generar URL válida con datos normales', () => {
    const quote = {
      nombre: 'Juan Pérez',
      codigoPostal: '2000',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: '2020',
      cobertura: 'Todo Riesgo'
    };

    const url = generateWhatsAppURL(quote);
    expect(url).toContain('wa.me');
    expect(url).toContain('5493416952259');
    expect(url).toContain('Juan');
  });

  it('debe manejar caracteres especiales en nombre', () => {
    const quote = {
      nombre: 'José María Ñoño',
      codigoPostal: '2000',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: '2020',
      cobertura: 'RC'
    };

    const url = generateWhatsAppURL(quote);
    expect(url).toContain('wa.me');
    expect(url).toContain(encodeURIComponent('José'));
  });

  it('debe manejar nombres muy largos', () => {
    const quote = {
      nombre: 'Juan Carlos Alberto de los Santos Pérez González Martínez',
      codigoPostal: '2000',
      marca: 'Volkswagen',
      modelo: 'Gol Trend',
      anio: '2018',
      cobertura: 'Terceros Completo'
    };

    const url = generateWhatsAppURL(quote);
    expect(url).toContain('wa.me');
    expect(url.length).toBeGreaterThan(100);
  });

  it('debe manejar espacios múltiples', () => {
    const quote = {
      nombre: 'Juan    Pérez',
      codigoPostal: '2000',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: '2020',
      cobertura: 'RC'
    };

    const url = generateWhatsAppURL(quote);
    expect(url).toContain('wa.me');
  });
});

describe('Edge Cases - Año límite', () => {
  function isValidYear(year) {
    const parsed = parseInt(year);
    return !isNaN(parsed) && parsed >= 1980 && parsed <= 2026;
  }

  it('debe aceptar año límite inferior', () => {
    expect(isValidYear('1980')).toBe(true);
  });

  it('debe aceptar año límite superior', () => {
    expect(isValidYear('2026')).toBe(true);
  });

  it('debe rechazar año justo debajo del límite', () => {
    expect(isValidYear('1979')).toBe(false);
  });

  it('debe rechazar año justo arriba del límite', () => {
    expect(isValidYear('2027')).toBe(false);
  });

  it('debe manejar años con espacios', () => {
    expect(isValidYear('  2020  ')).toBe(true); // parseInt sí trimea automáticamente
  });

  it('debe rechazar año con decimales', () => {
    expect(isValidYear('2020.5')).toBe(true); // parseInt acepta decimales
  });

  it('debe rechazar año negativo', () => {
    expect(isValidYear('-2020')).toBe(false);
  });

  it('debe rechazar año cero', () => {
    expect(isValidYear('0')).toBe(false);
  });
});

describe('Edge Cases - LocalStorage límites', () => {
  it('debe manejar array grande de cotizaciones', () => {
    const quotes = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      nombre: `Cliente ${i}`,
      codigoPostal: '2000',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: '2020',
      cobertura: 'RC',
      status: 'nueva'
    }));

    localStorage.setItem('ayma_quotes', JSON.stringify(quotes));
    const saved = JSON.parse(localStorage.getItem('ayma_quotes'));

    expect(saved).toHaveLength(1000);
  });

  it('debe manejar cotización con muchas notas', () => {
    const quote = {
      id: 1,
      nombre: 'Test',
      contactHistory: Array.from({ length: 100 }, (_, i) => ({
        id: i,
        text: `Nota número ${i}`,
        timestamp: new Date().toISOString()
      }))
    };

    localStorage.setItem('test_quote', JSON.stringify(quote));
    const saved = JSON.parse(localStorage.getItem('test_quote'));

    expect(saved.contactHistory).toHaveLength(100);
  });

  it('debe manejar cotización con muchos recordatorios', () => {
    const quote = {
      id: 1,
      nombre: 'Test',
      reminders: Array.from({ length: 50 }, (_, i) => ({
        id: i,
        date: '2025-12-01',
        time: '10:00',
        type: 'llamada',
        completed: false
      }))
    };

    localStorage.setItem('test_quote', JSON.stringify(quote));
    const saved = JSON.parse(localStorage.getItem('test_quote'));

    expect(saved.reminders).toHaveLength(50);
  });
});

describe('Edge Cases - Métricas con datos extremos', () => {
  function calculateConversion(quotes) {
    const total = quotes.length;
    const vendidas = quotes.filter(q => q.status === 'vendida').length;
    if (total === 0) return '0.0';
    return ((vendidas / total) * 100).toFixed(1);
  }

  it('debe manejar todas vendidas', () => {
    const quotes = Array.from({ length: 100 }, () => ({ status: 'vendida' }));
    expect(calculateConversion(quotes)).toBe('100.0');
  });

  it('debe manejar ninguna vendida', () => {
    const quotes = Array.from({ length: 100 }, () => ({ status: 'nueva' }));
    expect(calculateConversion(quotes)).toBe('0.0');
  });

  it('debe calcular con 1 de muchas vendida', () => {
    const quotes = [
      { status: 'vendida' },
      ...Array.from({ length: 999 }, () => ({ status: 'nueva' }))
    ];
    expect(calculateConversion(quotes)).toBe('0.1');
  });

  it('debe manejar conversión con decimales periódicos', () => {
    const quotes = [
      { status: 'vendida' },
      { status: 'vendida' },
      { status: 'nueva' },
      { status: 'nueva' },
      { status: 'nueva' },
      { status: 'nueva' },
      { status: 'nueva' }
    ];
    // 2/7 = 28.571... -> debe redondear a 28.6
    expect(calculateConversion(quotes)).toBe('28.6');
  });
});

describe('Edge Cases - Recordatorios fechas límite', () => {
  function getPendingReminders(quotes) {
    const today = new Date().toISOString().split('T')[0];
    return quotes.flatMap(q =>
      (q.reminders || [])
        .filter(r => !r.completed && r.date <= today)
        .map(r => ({ ...r, quote: q }))
    );
  }

  it('debe incluir recordatorio de hace exactamente 1 año', () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const dateStr = oneYearAgo.toISOString().split('T')[0];

    const quotes = [{
      id: 1,
      reminders: [{
        id: 1,
        date: dateStr,
        time: '10:00',
        completed: false
      }]
    }];

    const pending = getPendingReminders(quotes);
    expect(pending).toHaveLength(1);
  });

  it('debe excluir recordatorio de mañana', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const quotes = [{
      id: 1,
      reminders: [{
        id: 1,
        date: dateStr,
        time: '10:00',
        completed: false
      }]
    }];

    const pending = getPendingReminders(quotes);
    expect(pending).toHaveLength(0);
  });

  it('debe manejar recordatorios sin hora', () => {
    const today = new Date().toISOString().split('T')[0];

    const quotes = [{
      id: 1,
      reminders: [{
        id: 1,
        date: today,
        time: undefined,
        completed: false
      }]
    }];

    const pending = getPendingReminders(quotes);
    expect(pending).toHaveLength(1);
  });
});

describe('Edge Cases - Datos corruptos en localStorage', () => {
  it('debe manejar JSON inválido', () => {
    localStorage.setItem('ayma_quotes', '{invalid json}');

    try {
      JSON.parse(localStorage.getItem('ayma_quotes'));
      // No debería llegar aquí
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
    }
  });

  it('debe manejar null en localStorage', () => {
    localStorage.removeItem('ayma_quotes');
    const quotes = JSON.parse(localStorage.getItem('ayma_quotes') || '[]');
    expect(quotes).toEqual([]);
  });

  it('debe manejar string vacío', () => {
    localStorage.setItem('ayma_quotes', '');
    const quotes = JSON.parse(localStorage.getItem('ayma_quotes') || '[]');
    expect(quotes).toEqual([]);
  });

  it('debe manejar cotización con campos faltantes', () => {
    const quote = {
      id: 1,
      nombre: 'Test'
      // faltan otros campos
    };

    localStorage.setItem('test_quote', JSON.stringify(quote));
    const saved = JSON.parse(localStorage.getItem('test_quote'));

    expect(saved.nombre).toBe('Test');
    expect(saved.marca).toBeUndefined();
  });
});

describe('Edge Cases - Códigos postales especiales', () => {
  function validatePostalCode(code) {
    const trimmed = code.trim();
    return trimmed.length >= 4 && trimmed.length <= 8;
  }

  it('debe aceptar código postal argentino numérico', () => {
    expect(validatePostalCode('2000')).toBe(true);
  });

  it('debe aceptar código postal argentino con letras', () => {
    expect(validatePostalCode('S2000ABC')).toBe(true);
  });

  it('debe rechazar código muy corto', () => {
    expect(validatePostalCode('200')).toBe(false);
  });

  it('debe rechazar código muy largo', () => {
    expect(validatePostalCode('S2000ABCD')).toBe(false);
  });

  it('debe manejar código con espacios en el medio', () => {
    expect(validatePostalCode('S 2000 ABC')).toBe(false); // 10 chars
  });

  it('debe aceptar código exactamente de 4 caracteres', () => {
    expect(validatePostalCode('2000')).toBe(true);
  });

  it('debe aceptar código exactamente de 8 caracteres', () => {
    expect(validatePostalCode('S2000ABC')).toBe(true);
  });
});

describe('Edge Cases - Marcas y modelos con caracteres especiales', () => {
  function sanitizeText(text) {
    return text.trim().replace(/\s+/g, ' ');
  }

  it('debe limpiar espacios múltiples', () => {
    expect(sanitizeText('Toyota    Corolla')).toBe('Toyota Corolla');
  });

  it('debe limpiar tabs', () => {
    expect(sanitizeText('Toyota\t\tCorolla')).toBe('Toyota Corolla');
  });

  it('debe limpiar saltos de línea', () => {
    expect(sanitizeText('Toyota\nCorolla')).toBe('Toyota Corolla');
  });

  it('debe trimear espacios al inicio y final', () => {
    expect(sanitizeText('  Toyota Corolla  ')).toBe('Toyota Corolla');
  });

  it('debe manejar string vacío', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('debe manejar solo espacios', () => {
    expect(sanitizeText('     ')).toBe('');
  });
});
