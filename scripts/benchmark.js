#!/usr/bin/env node

/**
 * Benchmark Script
 * Compara performance de diferentes implementaciones
 */

import { performance } from 'perf_hooks';

console.log('🏁 Running Benchmarks\n');

// Benchmark 1: Array filter vs for loop
console.log('📊 Benchmark 1: Array Filter vs For Loop');
const testData = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  status: i % 3 === 0 ? 'vendida' : i % 3 === 1 ? 'nueva' : 'cotizada'
}));

// Método 1: filter
const start1 = performance.now();
for (let i = 0; i < 1000; i++) {
  testData.filter(item => item.status === 'vendida');
}
const end1 = performance.now();
const time1 = end1 - start1;

// Método 2: for loop
const start2 = performance.now();
for (let i = 0; i < 1000; i++) {
  const result = [];
  for (let j = 0; j < testData.length; j++) {
    if (testData[j].status === 'vendida') {
      result.push(testData[j]);
    }
  }
}
const end2 = performance.now();
const time2 = end2 - start2;

console.log(`  Array.filter: ${time1.toFixed(2)}ms`);
console.log(`  For loop:     ${time2.toFixed(2)}ms`);
console.log(`  Winner: ${time1 < time2 ? 'Array.filter' : 'For loop'} (${((Math.abs(time1 - time2) / Math.max(time1, time2)) * 100).toFixed(1)}% faster)\n`);

// Benchmark 2: JSON.stringify vs manual concatenation
console.log('📊 Benchmark 2: JSON.stringify vs Manual String Building');
const quote = {
  nombre: 'Juan Pérez',
  codigoPostal: '2000',
  marca: 'Toyota',
  modelo: 'Corolla',
  anio: '2020',
  cobertura: 'Todo Riesgo'
};

// Método 1: JSON.stringify
const start3 = performance.now();
for (let i = 0; i < 100000; i++) {
  JSON.stringify(quote);
}
const end3 = performance.now();
const time3 = end3 - start3;

// Método 2: Template literal
const start4 = performance.now();
for (let i = 0; i < 100000; i++) {
  `${quote.nombre}${quote.codigoPostal}${quote.marca}${quote.modelo}${quote.anio}${quote.cobertura}`;
}
const end4 = performance.now();
const time4 = end4 - start4;

console.log(`  JSON.stringify:  ${time3.toFixed(2)}ms`);
console.log(`  Template string: ${time4.toFixed(2)}ms`);
console.log(`  Winner: ${time3 < time4 ? 'JSON.stringify' : 'Template string'} (${((Math.abs(time3 - time4) / Math.max(time3, time4)) * 100).toFixed(1)}% faster)\n`);

// Benchmark 3: Object spread vs Object.assign
console.log('📊 Benchmark 3: Object Spread vs Object.assign');
const baseObj = { id: 1, name: 'test' };
const updateObj = { status: 'nueva', date: new Date() };

// Método 1: Spread
const start5 = performance.now();
for (let i = 0; i < 100000; i++) {
  const result = { ...baseObj, ...updateObj };
}
const end5 = performance.now();
const time5 = end5 - start5;

// Método 2: Object.assign
const start6 = performance.now();
for (let i = 0; i < 100000; i++) {
  const result = Object.assign({}, baseObj, updateObj);
}
const end6 = performance.now();
const time6 = end6 - start6;

console.log(`  Spread operator: ${time5.toFixed(2)}ms`);
console.log(`  Object.assign:   ${time6.toFixed(2)}ms`);
console.log(`  Winner: ${time5 < time6 ? 'Spread operator' : 'Object.assign'} (${((Math.abs(time5 - time6) / Math.max(time5, time6)) * 100).toFixed(1)}% faster)\n`);

// Benchmark 4: Map vs Object for lookups
console.log('📊 Benchmark 4: Map vs Object for Lookups');
const iterations = 10000;

// Preparar datos
const objLookup = {};
const mapLookup = new Map();
for (let i = 0; i < 1000; i++) {
  objLookup[`key_${i}`] = `value_${i}`;
  mapLookup.set(`key_${i}`, `value_${i}`);
}

// Método 1: Object
const start7 = performance.now();
for (let i = 0; i < iterations; i++) {
  for (let j = 0; j < 1000; j++) {
    const value = objLookup[`key_${j}`];
  }
}
const end7 = performance.now();
const time7 = end7 - start7;

// Método 2: Map
const start8 = performance.now();
for (let i = 0; i < iterations; i++) {
  for (let j = 0; j < 1000; j++) {
    const value = mapLookup.get(`key_${j}`);
  }
}
const end8 = performance.now();
const time8 = end8 - start8;

console.log(`  Object lookup: ${time7.toFixed(2)}ms`);
console.log(`  Map lookup:    ${time8.toFixed(2)}ms`);
console.log(`  Winner: ${time7 < time8 ? 'Object' : 'Map'} (${((Math.abs(time7 - time8) / Math.max(time7, time8)) * 100).toFixed(1)}% faster)\n`);

console.log('=' .repeat(60));
console.log('🏆 Benchmark Complete!\n');
console.log('Recommendations:');
console.log('  - Use Array methods for readability unless performance critical');
console.log('  - JSON.stringify is optimized for serialization');
console.log('  - Spread operator is generally preferred for readability');
console.log('  - Maps are faster for frequent lookups with many keys\n');
