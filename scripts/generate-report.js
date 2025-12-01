#!/usr/bin/env node

/**
 * Report Generator
 * Genera un reporte HTML completo de todas las métricas de testing
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

console.log('📊 Generating Comprehensive Test Report\n');

const timestamp = new Date().toISOString();
const reportData = {
  generatedAt: timestamp,
  summary: {},
  details: {}
};

// 1. Obtener estadísticas de tests unitarios
console.log('📋 Gathering unit test statistics...');
try {
  const output = execSync('npm run test:unit 2>&1', { encoding: 'utf-8' });
  const testMatch = output.match(/Tests\s+(\d+)\s+passed/);
  const fileMatch = output.match(/Test Files\s+(\d+)\s+passed/);

  reportData.summary.unitTests = {
    totalTests: testMatch ? parseInt(testMatch[1]) : 0,
    totalFiles: fileMatch ? parseInt(fileMatch[1]) : 0,
    status: 'PASSED'
  };
  console.log(`  ✅ ${reportData.summary.unitTests.totalTests} tests in ${reportData.summary.unitTests.totalFiles} files\n`);
} catch (error) {
  reportData.summary.unitTests = {
    status: 'FAILED',
    error: error.message
  };
  console.log('  ❌ Failed to gather unit test stats\n');
}

// 2. Obtener estadísticas de cobertura
console.log('📊 Gathering coverage statistics...');
try {
  const coveragePath = resolve(process.cwd(), 'coverage', 'coverage-summary.json');
  if (existsSync(coveragePath)) {
    const coverage = JSON.parse(readFileSync(coveragePath, 'utf-8'));
    const total = coverage.total;

    reportData.summary.coverage = {
      lines: total.lines.pct,
      statements: total.statements.pct,
      functions: total.functions.pct,
      branches: total.branches.pct
    };

    console.log(`  ✅ Lines: ${total.lines.pct}%`);
    console.log(`  ✅ Statements: ${total.statements.pct}%`);
    console.log(`  ✅ Functions: ${total.functions.pct}%`);
    console.log(`  ✅ Branches: ${total.branches.pct}%\n`);
  } else {
    console.log('  ⚠️  No coverage data found. Run: npm run test:coverage\n');
  }
} catch (error) {
  console.log('  ⚠️  Could not read coverage data\n');
}

// 3. Contar tests E2E
console.log('🌐 Counting E2E tests...');
try {
  const e2eFiles = [
    'tests/e2e/landing-page.spec.js',
    'tests/e2e/admin-panel.spec.js'
  ];

  let totalE2ETests = 0;
  e2eFiles.forEach(file => {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf-8');
      const testMatches = content.match(/test\(/g) || [];
      totalE2ETests += testMatches.length;
    }
  });

  reportData.summary.e2eTests = {
    totalTests: totalE2ETests,
    totalFiles: e2eFiles.filter(f => existsSync(f)).length
  };

  console.log(`  ✅ ${totalE2ETests} E2E tests in ${reportData.summary.e2eTests.totalFiles} files\n`);
} catch (error) {
  console.log('  ⚠️  Could not count E2E tests\n');
}

// 4. Obtener métricas de archivos
console.log('📁 Analyzing files...');
const files = {
  'index.html': 'Landing Page',
  'admin.html': 'Admin Panel',
  'tests/unit/storage.test.js': 'Storage Tests',
  'tests/unit/validation.test.js': 'Validation Tests',
  'tests/unit/metrics.test.js': 'Metrics Tests',
  'tests/unit/edge-cases.test.js': 'Edge Cases Tests'
};

reportData.details.files = {};
Object.entries(files).forEach(([file, description]) => {
  if (existsSync(file)) {
    const stats = require('fs').statSync(file);
    const content = readFileSync(file, 'utf-8');

    reportData.details.files[file] = {
      description,
      size: (stats.size / 1024).toFixed(2) + ' KB',
      lines: content.split('\n').length,
      exists: true
    };
  }
});

console.log(`  ✅ Analyzed ${Object.keys(reportData.details.files).length} files\n`);

// 5. Generar HTML
console.log('📄 Generating HTML report...');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - Ayma Advisors</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            font-size: 36px;
            color: #333;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .card h3 {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .card .value {
            font-size: 42px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .card .label {
            font-size: 12px;
            opacity: 0.8;
        }
        .section {
            margin: 40px 0;
        }
        .section h2 {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #eee;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #666;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge.success { background: #d4edda; color: #155724; }
        .badge.warning { background: #fff3cd; color: #856404; }
        .badge.danger { background: #f8d7da; color: #721c24; }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #eee;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 8px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ Ayma Advisors - Test Report</h1>
        <div class="subtitle">Generated: ${new Date(timestamp).toLocaleString('es-AR')}</div>

        <div class="grid">
            <div class="card">
                <h3>Unit Tests</h3>
                <div class="value">${reportData.summary.unitTests?.totalTests || 0}</div>
                <div class="label">Tests Passed</div>
            </div>
            <div class="card">
                <h3>E2E Tests</h3>
                <div class="value">${reportData.summary.e2eTests?.totalTests || 0}</div>
                <div class="label">Test Scenarios</div>
            </div>
            <div class="card">
                <h3>Coverage</h3>
                <div class="value">${reportData.summary.coverage?.lines || 0}%</div>
                <div class="label">Line Coverage</div>
            </div>
            <div class="card">
                <h3>Test Files</h3>
                <div class="value">${(reportData.summary.unitTests?.totalFiles || 0) + (reportData.summary.e2eTests?.totalFiles || 0)}</div>
                <div class="label">Total Files</div>
            </div>
        </div>

        ${reportData.summary.coverage ? `
        <div class="section">
            <h2>📊 Coverage Details</h2>
            <table>
                <tr>
                    <th>Metric</th>
                    <th>Percentage</th>
                    <th>Progress</th>
                </tr>
                <tr>
                    <td>Lines</td>
                    <td><span class="badge success">${reportData.summary.coverage.lines}%</span></td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${reportData.summary.coverage.lines}%"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Statements</td>
                    <td><span class="badge success">${reportData.summary.coverage.statements}%</span></td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${reportData.summary.coverage.statements}%"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Functions</td>
                    <td><span class="badge success">${reportData.summary.coverage.functions}%</span></td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${reportData.summary.coverage.functions}%"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Branches</td>
                    <td><span class="badge ${reportData.summary.coverage.branches >= 75 ? 'success' : 'warning'}">${reportData.summary.coverage.branches}%</span></td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${reportData.summary.coverage.branches}%"></div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        ` : ''}

        <div class="section">
            <h2>📁 File Analysis</h2>
            <table>
                <tr>
                    <th>File</th>
                    <th>Description</th>
                    <th>Size</th>
                    <th>Lines</th>
                </tr>
                ${Object.entries(reportData.details.files || {}).map(([file, data]) => `
                <tr>
                    <td><code>${file}</code></td>
                    <td>${data.description}</td>
                    <td>${data.size}</td>
                    <td>${data.lines}</td>
                </tr>
                `).join('')}
            </table>
        </div>

        <div class="footer">
            <p>Ayma Advisors © 2025 | Automated Test Report</p>
        </div>
    </div>
</body>
</html>`;

const reportPath = resolve(process.cwd(), 'test-report.html');
writeFileSync(reportPath, html);

console.log(`  ✅ Report generated: ${reportPath}\n`);
console.log('=' .repeat(60));
console.log('✨ Report Complete!\n');
console.log(`📊 Total Tests: ${(reportData.summary.unitTests?.totalTests || 0) + (reportData.summary.e2eTests?.totalTests || 0)}`);
console.log(`📁 Report location: ${reportPath}`);
console.log(`\nOpen in browser: file://${reportPath}\n`);
