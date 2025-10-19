// Script to run development with PWA enabled for testing
// Usage: node scripts/pwa-dev.js

const { spawn } = require('child_process');

console.log('🚀 Starting development server with PWA enabled...');
console.log('📱 PWA features will be available for testing');
console.log('⚠️  Note: This will generate more console output');

// Set environment variable to enable PWA in development
process.env.PWA_DEV = 'true';

const child = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, PWA_DEV: 'true' }
});

child.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
});
