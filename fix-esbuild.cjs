#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing esbuild permissions...');

try {
  // Find all esbuild binaries
  const esbuildPaths = [
    'node_modules/.pnpm/@esbuild+linux-x64@0.25.12/node_modules/@esbuild/linux-x64/bin/esbuild',
    'node_modules/@esbuild/linux-x64/bin/esbuild',
    'node_modules/esbuild/bin/esbuild'
  ];

  let fixed = 0;
  for (const esbuildPath of esbuildPaths) {
    const fullPath = path.join(process.cwd(), esbuildPath);
    if (fs.existsSync(fullPath)) {
      try {
        fs.chmodSync(fullPath, 0o755);
        console.log(`✅ Fixed: ${esbuildPath}`);
        fixed++;
      } catch (err) {
        console.warn(`⚠️  Could not fix ${esbuildPath}: ${err.message}`);
      }
    }
  }

  if (fixed === 0) {
    console.log('ℹ️  No esbuild binaries found, trying rebuild...');
    try {
      execSync('node node_modules/esbuild/install.js', { stdio: 'inherit' });
      console.log('✅ esbuild rebuilt successfully');
    } catch (e) {
      console.warn('⚠️  Could not rebuild esbuild:', e.message);
    }
  }

  console.log('✅ Done!');
  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  // Don't fail the build
  process.exit(0);
}
