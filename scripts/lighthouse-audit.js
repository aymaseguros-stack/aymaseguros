#!/usr/bin/env node

/**
 * Lighthouse Audit Script
 * Ejecuta auditorías de Lighthouse y genera reportes
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const REPORTS_DIR = resolve(process.cwd(), 'lighthouse-reports');

// Crear directorio de reportes
if (!existsSync(REPORTS_DIR)) {
  mkdirSync(REPORTS_DIR, { recursive: true });
}

console.log('🔦 Starting Lighthouse Audits\n');

const urls = [
  { name: 'landing-page', url: 'http://localhost:8080/' },
  { name: 'admin-panel', url: 'http://localhost:8080/admin.html' }
];

const timestamp = Date.now();

async function runLighthouse(url, name) {
  return new Promise((resolve, reject) => {
    console.log(`📊 Auditing: ${name} (${url})`);

    const outputPath = resolve(REPORTS_DIR, `${name}-${timestamp}.html`);
    const jsonPath = resolve(REPORTS_DIR, `${name}-${timestamp}.json`);

    // Ejecutar Lighthouse
    const lighthouse = spawn('npx', [
      'lighthouse',
      url,
      '--output=html',
      '--output=json',
      `--output-path=${resolve(REPORTS_DIR, `${name}-${timestamp}`)}`,
      '--chrome-flags="--headless --no-sandbox --disable-gpu"',
      '--quiet'
    ], {
      stdio: 'inherit',
      shell: true
    });

    lighthouse.on('close', (code) => {
      if (code === 0) {
        console.log(`  ✅ ${name} audit complete`);
        console.log(`     HTML: ${outputPath}`);
        console.log(`     JSON: ${jsonPath}\n`);
        resolve({ name, outputPath, jsonPath });
      } else {
        console.log(`  ❌ ${name} audit failed\n`);
        reject(new Error(`Lighthouse failed with code ${code}`));
      }
    });
  });
}

async function startServer() {
  return new Promise((resolve) => {
    console.log('🚀 Starting HTTP server...\n');

    const server = spawn('npx', ['http-server', '.', '-p', '8080', '-s'], {
      shell: true
    });

    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Available on')) {
        console.log('  ✅ Server ready\n');
        resolve(server);
      }
    });

    setTimeout(() => resolve(server), 3000);
  });
}

async function main() {
  let server;

  try {
    // Iniciar servidor
    server = await startServer();

    // Esperar a que el servidor esté listo
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Ejecutar auditorías
    const results = [];
    for (const { url, name } of urls) {
      try {
        const result = await runLighthouse(url, name);
        results.push(result);
      } catch (error) {
        console.error(`Error auditing ${name}:`, error.message);
      }
    }

    // Generar resumen
    console.log('=' .repeat(60));
    console.log('📊 Lighthouse Audit Summary\n');
    console.log(`Total audits: ${results.length}/${urls.length}`);
    console.log(`Reports directory: ${REPORTS_DIR}\n`);

    results.forEach(({ name, outputPath }) => {
      console.log(`✅ ${name}: ${outputPath}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('\n💡 Open HTML reports in your browser to view results\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    // Detener servidor
    if (server) {
      console.log('🛑 Stopping server...');
      server.kill();
    }
  }
}

main();
