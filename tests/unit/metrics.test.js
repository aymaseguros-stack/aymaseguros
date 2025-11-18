import { describe, it, expect } from 'vitest';

/**
 * Tests unitarios para cálculo de métricas del admin
 */

describe('Métricas - Contadores básicos', () => {
  function calculateMetrics(quotes) {
    return {
      total: quotes.length,
      nuevas: quotes.filter(q => q.status === 'nueva').length,
      cotizadas: quotes.filter(q => q.status === 'cotizada').length,
      vendidas: quotes.filter(q => q.status === 'vendida').length,
      perdidas: quotes.filter(q => q.status === 'perdida').length,
    };
  }

  it('debe contar correctamente con array vacío', () => {
    const metrics = calculateMetrics([]);
    expect(metrics.total).toBe(0);
    expect(metrics.nuevas).toBe(0);
    expect(metrics.vendidas).toBe(0);
  });

  it('debe contar cotizaciones nuevas', () => {
    const quotes = [
      { id: 1, status: 'nueva' },
      { id: 2, status: 'nueva' },
      { id: 3, status: 'cotizada' }
    ];
    const metrics = calculateMetrics(quotes);
    expect(metrics.total).toBe(3);
    expect(metrics.nuevas).toBe(2);
  });

  it('debe contar cotizaciones vendidas', () => {
    const quotes = [
      { id: 1, status: 'vendida' },
      { id: 2, status: 'vendida' },
      { id: 3, status: 'nueva' }
    ];
    const metrics = calculateMetrics(quotes);
    expect(metrics.vendidas).toBe(2);
  });

  it('debe contar cotizaciones cotizadas', () => {
    const quotes = [
      { id: 1, status: 'cotizada' },
      { id: 2, status: 'nueva' },
      { id: 3, status: 'cotizada' }
    ];
    const metrics = calculateMetrics(quotes);
    expect(metrics.cotizadas).toBe(2);
  });

  it('debe contar cotizaciones perdidas', () => {
    const quotes = [
      { id: 1, status: 'perdida' },
      { id: 2, status: 'vendida' }
    ];
    const metrics = calculateMetrics(quotes);
    expect(metrics.perdidas).toBe(1);
  });
});

describe('Métricas - Conversión', () => {
  function calculateConversion(quotes) {
    const total = quotes.length;
    const vendidas = quotes.filter(q => q.status === 'vendida').length;
    if (total === 0) return '0.0';
    return ((vendidas / total) * 100).toFixed(1);
  }

  it('debe retornar 0 con array vacío', () => {
    expect(calculateConversion([])).toBe('0.0');
  });

  it('debe calcular 100% de conversión', () => {
    const quotes = [
      { id: 1, status: 'vendida' },
      { id: 2, status: 'vendida' }
    ];
    expect(calculateConversion(quotes)).toBe('100.0');
  });

  it('debe calcular 50% de conversión', () => {
    const quotes = [
      { id: 1, status: 'vendida' },
      { id: 2, status: 'nueva' }
    ];
    expect(calculateConversion(quotes)).toBe('50.0');
  });

  it('debe calcular 33.3% de conversión', () => {
    const quotes = [
      { id: 1, status: 'vendida' },
      { id: 2, status: 'nueva' },
      { id: 3, status: 'cotizada' }
    ];
    expect(calculateConversion(quotes)).toBe('33.3');
  });

  it('debe calcular 0% cuando no hay ventas', () => {
    const quotes = [
      { id: 1, status: 'nueva' },
      { id: 2, status: 'cotizada' }
    ];
    expect(calculateConversion(quotes)).toBe('0.0');
  });

  it('debe redondear correctamente', () => {
    const quotes = [
      { id: 1, status: 'vendida' },
      { id: 2, status: 'nueva' },
      { id: 3, status: 'nueva' }
    ];
    // 1/3 = 33.333... -> 33.3
    expect(calculateConversion(quotes)).toBe('33.3');
  });
});

describe('Métricas - Recordatorios', () => {
  function getPendingReminders(quotes) {
    const today = new Date().toISOString().split('T')[0];
    return quotes.flatMap(q =>
      (q.reminders || [])
        .filter(r => !r.completed && r.date <= today)
        .map(r => ({ ...r, quote: q }))
    ).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
  }

  it('debe retornar array vacío si no hay recordatorios', () => {
    const quotes = [
      { id: 1, reminders: [] },
      { id: 2, reminders: [] }
    ];
    expect(getPendingReminders(quotes)).toEqual([]);
  });

  it('debe filtrar recordatorios completados', () => {
    const today = new Date().toISOString().split('T')[0];
    const quotes = [
      {
        id: 1,
        reminders: [
          { id: 1, date: today, time: '10:00', completed: true },
          { id: 2, date: today, time: '11:00', completed: false }
        ]
      }
    ];
    const pending = getPendingReminders(quotes);
    expect(pending).toHaveLength(1);
    expect(pending[0].id).toBe(2);
  });

  it('debe retornar recordatorios vencidos', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    const quotes = [
      {
        id: 1,
        reminders: [
          { id: 1, date: dateStr, time: '10:00', completed: false }
        ]
      }
    ];

    const pending = getPendingReminders(quotes);
    expect(pending).toHaveLength(1);
  });

  it('debe filtrar recordatorios futuros', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const quotes = [
      {
        id: 1,
        reminders: [
          { id: 1, date: dateStr, time: '10:00', completed: false }
        ]
      }
    ];

    const pending = getPendingReminders(quotes);
    expect(pending).toHaveLength(0);
  });

  it('debe incluir recordatorios de hoy', () => {
    const today = new Date().toISOString().split('T')[0];

    const quotes = [
      {
        id: 1,
        reminders: [
          { id: 1, date: today, time: '10:00', completed: false }
        ]
      }
    ];

    const pending = getPendingReminders(quotes);
    expect(pending).toHaveLength(1);
  });

  it('debe ordenar por fecha y hora', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const quotes = [
      {
        id: 1,
        reminders: [
          { id: 1, date: today, time: '15:00', completed: false },
          { id: 2, date: yesterdayStr, time: '10:00', completed: false },
          { id: 3, date: today, time: '09:00', completed: false }
        ]
      }
    ];

    const pending = getPendingReminders(quotes);
    expect(pending).toHaveLength(3);
    expect(pending[0].id).toBe(2); // Yesterday 10:00
    expect(pending[1].id).toBe(3); // Today 09:00
    expect(pending[2].id).toBe(1); // Today 15:00
  });
});

describe('Métricas - Recordatorios de hoy', () => {
  function getTodayReminders(quotes) {
    const today = new Date().toISOString().split('T')[0];
    return quotes.flatMap(q =>
      (q.reminders || [])
        .filter(r => r.date === today)
        .map(r => ({ ...r, quote: q }))
    ).sort((a, b) => a.time.localeCompare(b.time));
  }

  it('debe retornar solo recordatorios de hoy', () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const quotes = [
      {
        id: 1,
        reminders: [
          { id: 1, date: today, time: '10:00', completed: false },
          { id: 2, date: tomorrowStr, time: '11:00', completed: false }
        ]
      }
    ];

    const todayReminders = getTodayReminders(quotes);
    expect(todayReminders).toHaveLength(1);
    expect(todayReminders[0].id).toBe(1);
  });

  it('debe incluir recordatorios completados de hoy', () => {
    const today = new Date().toISOString().split('T')[0];

    const quotes = [
      {
        id: 1,
        reminders: [
          { id: 1, date: today, time: '10:00', completed: true },
          { id: 2, date: today, time: '11:00', completed: false }
        ]
      }
    ];

    const todayReminders = getTodayReminders(quotes);
    expect(todayReminders).toHaveLength(2);
  });

  it('debe ordenar por hora', () => {
    const today = new Date().toISOString().split('T')[0];

    const quotes = [
      {
        id: 1,
        reminders: [
          { id: 1, date: today, time: '15:00', completed: false },
          { id: 2, date: today, time: '09:00', completed: false },
          { id: 3, date: today, time: '12:00', completed: false }
        ]
      }
    ];

    const todayReminders = getTodayReminders(quotes);
    expect(todayReminders[0].time).toBe('09:00');
    expect(todayReminders[1].time).toBe('12:00');
    expect(todayReminders[2].time).toBe('15:00');
  });
});

describe('Métricas - A/B Testing', () => {
  function getHeadlineConversion(quotes) {
    const versionA = quotes.filter(q => q.headlineVersion === 'A');
    const versionB = quotes.filter(q => q.headlineVersion === 'B');

    return {
      A: {
        total: versionA.length,
        vendidas: versionA.filter(q => q.status === 'vendida').length,
        conversion: versionA.length > 0
          ? ((versionA.filter(q => q.status === 'vendida').length / versionA.length) * 100).toFixed(1)
          : '0.0'
      },
      B: {
        total: versionB.length,
        vendidas: versionB.filter(q => q.status === 'vendida').length,
        conversion: versionB.length > 0
          ? ((versionB.filter(q => q.status === 'vendida').length / versionB.length) * 100).toFixed(1)
          : '0.0'
      }
    };
  }

  it('debe calcular conversión por versión', () => {
    const quotes = [
      { id: 1, headlineVersion: 'A', status: 'vendida' },
      { id: 2, headlineVersion: 'A', status: 'nueva' },
      { id: 3, headlineVersion: 'B', status: 'vendida' },
      { id: 4, headlineVersion: 'B', status: 'vendida' }
    ];

    const result = getHeadlineConversion(quotes);
    expect(result.A.conversion).toBe('50.0');
    expect(result.B.conversion).toBe('100.0');
  });

  it('debe manejar versión sin datos', () => {
    const quotes = [
      { id: 1, headlineVersion: 'A', status: 'vendida' }
    ];

    const result = getHeadlineConversion(quotes);
    expect(result.A.total).toBe(1);
    expect(result.B.total).toBe(0);
    expect(result.B.conversion).toBe('0.0');
  });
});
