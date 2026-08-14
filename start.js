/**
 * start.js — Single entry point for Render deployment.
 *
 * Render only exposes ONE port. This script:
 * 1. Starts the Express backend API on an internal port (8000).
 * 2. Starts the Next.js production server on the Render-assigned PORT
 *    (default 10000) and proxies /api/* requests to the Express backend.
 */

const { execSync, spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

const NEXT_PORT = parseInt(process.env.PORT || '10000', 10);
const API_PORT = 8000;

// --- 1. Start the Express API server on internal port 8000 ---
console.log(`🚀 Starting Express backend on internal port ${API_PORT}...`);
const apiProcess = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: String(API_PORT) },
  stdio: 'inherit',
});

apiProcess.on('error', (err) => {
  console.error('❌ Failed to start Express backend:', err);
  process.exit(1);
});

// --- 2. Start Next.js production server on NEXT_PORT ---
console.log(`🚀 Starting Next.js on port ${NEXT_PORT}...`);
const nextProcess = spawn('npx', ['next', 'start', '-p', String(NEXT_PORT)], {
  env: { ...process.env, PORT: String(NEXT_PORT) },
  stdio: 'inherit',
  shell: true,
});

nextProcess.on('error', (err) => {
  console.error('❌ Failed to start Next.js:', err);
  process.exit(1);
});

// --- 3. Graceful shutdown ---
function shutdown() {
  console.log('\n🛑 Shutting down...');
  apiProcess.kill('SIGTERM');
  nextProcess.kill('SIGTERM');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log(`\n✅ BuildFlow ERP is starting up!`);
console.log(`   Frontend: http://0.0.0.0:${NEXT_PORT}`);
console.log(`   Backend API: http://0.0.0.0:${API_PORT} (internal)`);
