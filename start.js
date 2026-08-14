const { spawn } = require('child_process');

const NEXT_PORT = parseInt(process.env.PORT || '10000', 10);
const API_PORT = 8000;

console.log(`🚀 Starting Express backend on port ${API_PORT}...`);

const apiProcess = spawn('node', ['server.js'], {
  env: {
    ...process.env,
    PORT: String(API_PORT),
  },
  stdio: 'inherit',
});

console.log(`🚀 Starting Next.js on port ${NEXT_PORT}...`);

const nextProcess = spawn(
  'npx',
  ['next', 'start', '-p', String(NEXT_PORT)],
  {
    env: {
      ...process.env,
      PORT: String(NEXT_PORT),
    },
    stdio: 'inherit',
    shell: true,
  }
);

function shutdown() {
  console.log('\n🛑 Shutting down...');
  apiProcess.kill('SIGTERM');
  nextProcess.kill('SIGTERM');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log('✅ BuildFlow ERP starting...');
