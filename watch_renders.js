const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rendersDir = path.join(__dirname, 'renders de participantes');
const reglasTxtPath = path.join(__dirname, 'reglas e indicaciones.txt');
const scriptPath = path.join(__dirname, 'scan_renders.js');

console.log('====================================================');
console.log(' 👀 ARTHERIUS STUDIO - VIGILANTE EN VIVO DE RENDERS');
console.log('====================================================');
console.log(`Directorio monitoreado: "${rendersDir}"`);

let isRunning = false;
let lastFileList = [];

function runScanner() {
  if (isRunning) return;
  isRunning = true;
  try {
    console.log('\n[VIGILANTE] 🔄 Actualizando sujetos de prueba...');
    execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('[VIGILANTE] ❌ Error en escaneo:', err.message);
  } finally {
    setTimeout(() => { isRunning = false; }, 300);
  }
}

// Initial scan on startup
runScanner();

// 1. File Watcher on Directory
if (fs.existsSync(rendersDir)) {
  let debounceTimeout = null;
  fs.watch(rendersDir, (eventType, filename) => {
    if (filename && /\.(png|jpe?g|webp)$/i.test(filename)) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        console.log(`[EVENTO FS] Cambio detectado: "${filename}" (${eventType})`);
        runScanner();
      }, 150);
    }
  });
}

// 2. High-Frequency Polling Fallback (every 800ms) to ensure Windows never misses files
setInterval(() => {
  if (!fs.existsSync(rendersDir)) return;
  try {
    const currentFiles = fs.readdirSync(rendersDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).sort();
    const currentString = currentFiles.join('|');
    const lastString = lastFileList.join('|');

    if (currentString !== lastString) {
      lastFileList = currentFiles;
      runScanner();
    }
  } catch (e) {}
}, 800);

// 3. Watch reglas e indicaciones.txt
if (fs.existsSync(reglasTxtPath)) {
  fs.watch(reglasTxtPath, (eventType) => {
    console.log(`[EVENTO FS] Reglas modificadas (${eventType})`);
    runScanner();
  });
}
