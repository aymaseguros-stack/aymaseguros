import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Tests unitarios para funciones de localStorage
 * Simula la lógica de storage de cotizaciones
 */

describe('Storage - Guardar cotizaciones', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe guardar una cotización en localStorage', () => {
    const quote = {
      nombre: 'Juan Pérez',
      codigoPostal: '2000',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: '2020',
      cobertura: 'Todo Riesgo'
    };

    const quoteWithId = {
      ...quote,
      id: Date.now(),
      status: 'nueva',
      createdAt: new Date().toISOString(),
      notes: '',
      contactHistory: [],
      headlineVersion: 'A'
    };

    localStorage.setItem('ayma_quotes', JSON.stringify([quoteWithId]));

    const saved = JSON.parse(localStorage.getItem('ayma_quotes'));
    expect(saved).toHaveLength(1);
    expect(saved[0].nombre).toBe('Juan Pérez');
  });

  it('debe agregar múltiples cotizaciones', () => {
    const quotes = [
      {
        id: 1,
        nombre: 'Cliente 1',
        codigoPostal: '2000',
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: '2020',
        cobertura: 'Todo Riesgo',
        status: 'nueva',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        nombre: 'Cliente 2',
        codigoPostal: '2100',
        marca: 'Honda',
        modelo: 'Civic',
        anio: '2021',
        cobertura: 'Terceros',
        status: 'cotizada',
        createdAt: new Date().toISOString()
      }
    ];

    localStorage.setItem('ayma_quotes', JSON.stringify(quotes));

    const saved = JSON.parse(localStorage.getItem('ayma_quotes'));
    expect(saved).toHaveLength(2);
  });

  it('debe retornar array vacío si no hay cotizaciones', () => {
    const quotes = JSON.parse(localStorage.getItem('ayma_quotes') || '[]');
    expect(quotes).toEqual([]);
  });
});

describe('Storage - Actualizar estados', () => {
  beforeEach(() => {
    const testQuotes = [
      {
        id: 123,
        nombre: 'Test User',
        status: 'nueva',
        codigoPostal: '2000',
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: '2020',
        cobertura: 'RC'
      }
    ];
    localStorage.setItem('ayma_quotes', JSON.stringify(testQuotes));
  });

  it('debe actualizar el estado de una cotización', () => {
    const quotes = JSON.parse(localStorage.getItem('ayma_quotes'));
    const updated = quotes.map(q => q.id === 123 ? { ...q, status: 'vendida' } : q);
    localStorage.setItem('ayma_quotes', JSON.stringify(updated));

    const saved = JSON.parse(localStorage.getItem('ayma_quotes'));
    expect(saved[0].status).toBe('vendida');
  });

  it('debe mantener otros datos al actualizar estado', () => {
    const quotes = JSON.parse(localStorage.getItem('ayma_quotes'));
    const updated = quotes.map(q => q.id === 123 ? { ...q, status: 'cotizada' } : q);
    localStorage.setItem('ayma_quotes', JSON.stringify(updated));

    const saved = JSON.parse(localStorage.getItem('ayma_quotes'));
    expect(saved[0].nombre).toBe('Test User');
    expect(saved[0].marca).toBe('Toyota');
  });
});

describe('Storage - Notas y seguimiento', () => {
  beforeEach(() => {
    const testQuotes = [
      {
        id: 456,
        nombre: 'Cliente Notas',
        status: 'nueva',
        contactHistory: []
      }
    ];
    localStorage.setItem('ayma_quotes', JSON.stringify(testQuotes));
  });

  it('debe agregar una nota al historial', () => {
    const quotes = JSON.parse(localStorage.getItem('ayma_quotes'));
    const note = {
      text: 'Llamó pidiendo información',
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    const updated = quotes.map(q => {
      if (q.id === 456) {
        return { ...q, contactHistory: [...q.contactHistory, note] };
      }
      return q;
    });

    localStorage.setItem('ayma_quotes', JSON.stringify(updated));

    const saved = JSON.parse(localStorage.getItem('ayma_quotes'));
    expect(saved[0].contactHistory).toHaveLength(1);
    expect(saved[0].contactHistory[0].text).toBe('Llamó pidiendo información');
  });

  it('debe mantener historial previo al agregar nota', () => {
    let quotes = JSON.parse(localStorage.getItem('ayma_quotes'));

    // Primera nota
    const note1 = {
      text: 'Nota 1',
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    quotes = quotes.map(q => {
      if (q.id === 456) {
        return { ...q, contactHistory: [...q.contactHistory, note1] };
      }
      return q;
    });
    localStorage.setItem('ayma_quotes', JSON.stringify(quotes));

    // Segunda nota
    quotes = JSON.parse(localStorage.getItem('ayma_quotes'));
    const note2 = {
      text: 'Nota 2',
      timestamp: new Date().toISOString(),
      id: Date.now() + 1
    };

    quotes = quotes.map(q => {
      if (q.id === 456) {
        return { ...q, contactHistory: [...q.contactHistory, note2] };
      }
      return q;
    });
    localStorage.setItem('ayma_quotes', JSON.stringify(quotes));

    const saved = JSON.parse(localStorage.getItem('ayma_quotes'));
    expect(saved[0].contactHistory).toHaveLength(2);
  });
});

describe('Storage - Recordatorios', () => {
  beforeEach(() => {
    const testQuotes = [
      {
        id: 789,
        nombre: 'Cliente Recordatorio',
        status: 'cotizada',
        reminders: []
      }
    ];
    localStorage.setItem('ayma_quotes', JSON.stringify(testQuotes));
  });

  it('debe agregar un recordatorio', () => {
    const quotes = JSON.parse(localStorage.getItem('ayma_quotes'));
    const reminder = {
      id: Date.now(),
      date: '2025-12-01',
      time: '14:00',
      type: 'llamada',
      notes: 'Llamar para seguimiento',
      completed: false
    };

    const updated = quotes.map(q => {
      if (q.id === 789) {
        return { ...q, reminders: [...q.reminders, reminder] };
      }
      return q;
    });

    localStorage.setItem('ayma_quotes', JSON.stringify(updated));

    const saved = JSON.parse(localStorage.getItem('ayma_quotes'));
    expect(saved[0].reminders).toHaveLength(1);
    expect(saved[0].reminders[0].type).toBe('llamada');
  });

  it('debe marcar recordatorio como completado', () => {
    let quotes = JSON.parse(localStorage.getItem('ayma_quotes'));
    const reminder = {
      id: 111,
      date: '2025-12-01',
      time: '14:00',
      type: 'email',
      notes: 'Test',
      completed: false
    };

    quotes = quotes.map(q => {
      if (q.id === 789) {
        return { ...q, reminders: [reminder] };
      }
      return q;
    });
    localStorage.setItem('ayma_quotes', JSON.stringify(quotes));

    // Completar recordatorio
    quotes = JSON.parse(localStorage.getItem('ayma_quotes'));
    const updated = quotes.map(q => {
      if (q.id === 789 && q.reminders) {
        return {
          ...q,
          reminders: q.reminders.map(r =>
            r.id === 111 ? { ...r, completed: true } : r
          )
        };
      }
      return q;
    });
    localStorage.setItem('ayma_quotes', JSON.stringify(updated));

    const saved = JSON.parse(localStorage.getItem('ayma_quotes'));
    expect(saved[0].reminders[0].completed).toBe(true);
  });
});
