#!/usr/bin/env node

/**
 * Performance Testing Script
 * Mide métricas de performance de los tests y la aplicación
 */

import { performance } from 'perf_hooks';
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const RESULTS_DIR = resolve(process.cwd(), 'performance-reports');

// Crear directorio si no existe
if (!existsSync(RESULTS_DIR)) {
  mkdirSync(RESULTS_DIR, { recursive: true });
}

console.log('🚀 Starting Performance Tests\n');

const results = {
  timestamp: new Date().toISOString(),
  system: {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    cpus: require('os').cpus().length,
    totalMemory: (require('os').totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB'
  },
  tests: {}
};

// Test 1: Unit Tests Performance
console.log('📊 Test 1: Measuring Unit Tests Performance...');
try {
  const startMem = process.memoryUsage();
  const startTime = performance.now();

  const output = execSync('npm run test:unit', {
    encoding: 'utf-8',
    stdio: 'pipe'
  });

  const endTime = performance.now();
  const endMem = process.memoryUsage();

  results.tests.unit = {
    duration: ((endTime - startTime) / 1000).toFixed(2) + 's',
    memoryDelta: {
      rss: ((endMem.rss - startMem.rss) / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: ((endMem.heapUsed - startMem.heapUsed) / 1024 / 1024).toFixed(2) + ' MB'
    },
    status: 'PASSED'
  };

  console.log(`  ✅ Duration: ${results.tests.unit.duration}`);
  console.log(`  📊 Memory (heap): ${results.tests.unit.memoryDelta.heapUsed}\n`);
} catch (error) {
  results.tests.unit = {
    status: 'FAILED',
    error: error.message
  };
  console.log('  ❌ FAILED\n');
}

// Test 2: HTML File Load Performance
console.log('📊 Test 2: Measuring HTML File Load Performance...');
try {
  const { readFileSync, statSync } = require('fs');

  const files = ['index.html', 'admin.html'];
  const fileSizes = {};
  const loadTimes = {};

  files.forEach(file => {
    const startTime = performance.now();
    const content = readFileSync(file, 'utf-8');
    const endTime = performance.now();

    fileSizes[file] = (statSync(file).size / 1024).toFixed(2) + ' KB';
    loadTimes[file] = (endTime - startTime).toFixed(2) + 'ms';
  });

  results.tests.htmlLoad = {
    files: fileSizes,
    loadTimes: loadTimes,
    status: 'PASSED'
  };

  Object.entries(loadTimes).forEach(([file, time]) => {
    console.log(`  ✅ ${file}: ${time} (${fileSizes[file]})`);
  });
  console.log();
} catch (error) {
  results.tests.htmlLoad = {
    status: 'FAILED',
    error: error.message
  };
  console.log('  ❌ FAILED\n');
}

// Test 3: localStorage Performance
console.log('📊 Test 3: Measuring localStorage Performance...');
try {
  const iterations = 1000;
  const startTime = performance.now();

  // Simular operaciones de localStorage
  const storage = {};
  const testData = {
    id: Date.now(),
    nombre: 'Performance Test',
    codigoPostal: '2000',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: '2020',
    cobertura: 'Todo Riesgo'
  };

  for (let i = 0; i < iterations; i++) {
    storage[`test_${i}`] = JSON.stringify(testData);
  }

  for (let i = 0; i < iterations; i++) {
    JSON.parse(storage[`test_${i}`]);
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  results.tests.localStorage = {
    iterations,
    duration: duration.toFixed(2) + 'ms',
    avgPerOperation: (duration / (iterations * 2)).toFixed(3) + 'ms',
    status: 'PASSED'
  };

  console.log(`  ✅ ${iterations} iterations: ${results.tests.localStorage.duration}`);
  console.log(`  📊 Avg per operation: ${results.tests.localStorage.avgPerOperation}\n`);
} catch (error) {
  results.tests.localStorage = {
    status: 'FAILED',
    error: error.message
  };
  console.log('  ❌ FAILED\n');
}

// Test 4: JSON Parsing Performance
console.log('📊 Test 4: Measuring JSON Parsing Performance...');
try {
  const iterations = 10000;
  const largeData = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    nombre: `Cliente ${i}`,
    data: 'x'.repeat(100)
  }));

  const jsonString = JSON.stringify(largeData);
  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    JSON.parse(jsonString);
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  results.tests.jsonParsing = {
    iterations,
    dataSize: (jsonString.length / 1024).toFixed(2) + ' KB',
    duration: duration.toFixed(2) + 'ms',
    avgPerParse: (duration / iterations).toFixed(3) + 'ms',
    status: 'PASSED'
  };

  console.log(`  ✅ ${iterations} parses: ${results.tests.jsonParsing.duration}`);
  console.log(`  📊 Avg per parse: ${results.tests.jsonParsing.avgPerParse}\n`);
} catch (error) {
  results.tests.jsonParsing = {
    status: 'FAILED',
    error: error.message
  };
  console.log('  ❌ FAILED\n');
}

// Guardar resultados
const reportPath = resolve(RESULTS_DIR, `performance-${Date.now()}.json`);
writeFileSync(reportPath, JSON.stringify(results, null, 2));

console.log('=' .repeat(60));
console.log('📊 Performance Test Summary\n');
console.log(`System: Node ${results.system.nodeVersion} on ${results.system.platform}`);
console.log(`CPUs: ${results.system.cpus} cores`);
console.log(`Memory: ${results.system.totalMemory}\n`);

let passed = 0;
let failed = 0;

Object.entries(results.tests).forEach(([name, data]) => {
  const status = data.status === 'PASSED' ? '✅' : '❌';
  console.log(`${status} ${name}: ${data.status}`);
  if (data.status === 'PASSED') passed++;
  else failed++;
});

console.log('\n' + '='.repeat(60));
console.log(`\n✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`\n📁 Report saved: ${reportPath}\n`);

process.exit(failed > 0 ? 1 : 0);
