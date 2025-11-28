#!/usr/bin/env node

/**
 * Health Check Script
 * Verifica que todos los archivos necesarios existan antes de ejecutar tests
 */

import { existsSync } from 'fs';
import { resolve } from 'path';

const checks = [
  {
    name: 'HTML Files',
    files: ['index.html', 'admin.html'],
    required: true
  },
  {
    name: 'Test Configuration',
    files: ['playwright.config.js', 'vitest.config.js'],
    required: true
  },
  {
    name: 'Test Setup',
    files: ['tests/setup.js'],
    required: true
  },
  {
    name: 'E2E Tests',
    files: [
      'tests/e2e/landing-page.spec.js',
      'tests/e2e/admin-panel.spec.js'
    ],
    required: true
  },
  {
    name: 'Unit Tests',
    files: [
      'tests/unit/storage.test.js',
      'tests/unit/validation.test.js',
      'tests/unit/metrics.test.js',
      'tests/unit/edge-cases.test.js'
    ],
    required: true
  },
  {
    name: 'Documentation',
    files: ['README.md', 'TESTING.md'],
    required: true
  },
  {
    name: 'Package Configuration',
    files: ['package.json'],
    required: true
  }
];

let hasErrors = false;
let warnings = 0;

console.log('🔍 Running health checks...\n');

checks.forEach(check => {
  console.log(`📋 Checking ${check.name}:`);

  let allExist = true;
  check.files.forEach(file => {
    const filePath = resolve(process.cwd(), file);
    const exists = existsSync(filePath);

    if (exists) {
      console.log(`  ✅ ${file}`);
    } else {
      if (check.required) {
        console.log(`  ❌ ${file} (REQUIRED - MISSING)`);
        hasErrors = true;
        allExist = false;
      } else {
        console.log(`  ⚠️  ${file} (optional - missing)`);
        warnings++;
      }
    }
  });

  if (allExist && check.required) {
    console.log(`  ✅ All required files present\n`);
  } else if (!allExist && check.required) {
    console.log(`  ❌ Some required files are missing\n`);
  } else {
    console.log();
  }
});

// Check Node.js version
console.log('🔧 Environment Checks:');
const nodeVersion = process.versions.node;
const majorVersion = parseInt(nodeVersion.split('.')[0]);

if (majorVersion >= 18) {
  console.log(`  ✅ Node.js ${nodeVersion} (>= 18 required)`);
} else {
  console.log(`  ❌ Node.js ${nodeVersion} (>= 18 required)`);
  hasErrors = true;
}

// Check if node_modules exists
const nodeModulesExists = existsSync(resolve(process.cwd(), 'node_modules'));
if (nodeModulesExists) {
  console.log('  ✅ node_modules exists');
} else {
  console.log('  ⚠️  node_modules not found - run: npm install');
  warnings++;
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Health check FAILED');
  console.log(`\nFound ${hasErrors ? 'errors' : 'no errors'} and ${warnings} warning(s)\n`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`⚠️  Health check passed with ${warnings} warning(s)`);
  console.log('✅ All required files present\n');
  process.exit(0);
} else {
  console.log('✅ Health check PASSED');
  console.log('✅ All files present and environment ready\n');
  process.exit(0);
}
