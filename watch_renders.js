const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rendersDir = path.join(__dirname, 'renders de participantes');
const reglasTxtPath = path.join(__dirname, 'reglas e indicaciones.txt');
const scriptPath = path.join(__dirname, 'scan_renders.js');

console.log('👀 Watching "renders de participantes" and "reglas e indicaciones.txt" for changes...');

// Initial run
try {
  execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
} catch (e) {}

// Watch renders folder
if (fs.existsSync(rendersDir)) {
  fs.watch(rendersDir, (eventType, filename) => {
    if (filename && /\.(png|jpe?g|webp)$/i.test(filename)) {
      console.log(`\n🔔 Change detected in folder: "${filename}" (${eventType})`);
      try {
        execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
      } catch (e) {
        console.error('Error scanning renders:', e.message);
      }
    }
  });
}

// Watch reglas e indicaciones.txt file
if (fs.existsSync(reglasTxtPath)) {
  fs.watch(reglasTxtPath, (eventType) => {
    console.log(`\n🔔 Change detected in "reglas e indicaciones.txt" (${eventType})`);
    try {
      execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
    } catch (e) {
      console.error('Error scanning rules:', e.message);
    }
  });
}
