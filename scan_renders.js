const fs = require('fs');
const path = require('path');

const rendersDir = path.join(__dirname, 'renders de participantes');
const appJsPath = path.join(__dirname, 'app.js');
const reglasTxtPath = path.join(__dirname, 'reglas e indicaciones.txt');

if (!fs.existsSync(rendersDir)) {
  console.error('Directory "renders de participantes" not found!');
  process.exit(1);
}

const files = fs.readdirSync(rendersDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));

console.log(`Found ${files.length} render files in "renders de participantes":`);

const participantsData = files.map((fileName, idx) => {
  const id = String(idx + 1).padStart(2, '0');
  const rawName = fileName.replace(/\.[^/.]+$/, "");
  let formattedName = rawName
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z]+)(\d+)/g, '$1 $2')
    .replace(/\b\w/g, l => l.toUpperCase());

  if (/^\d+/.test(rawName)) {
    formattedName = `Sujeto ${id}`;
  }

  return {
    id,
    name: formattedName,
    rawName,
    file: `./renders de participantes/${fileName}`,
    status: 'SUJETO DE PRUEBA / REGISTRADO',
    type: 'humano'
  };
});

let appJsContent = fs.readFileSync(appJsPath, 'utf8');
const dataString = JSON.stringify(participantsData, null, 4);

// 1. Sync participantsData
const startTag = '// --- PARTICIPANTS_DATA_START ---';
const endTag = '// --- PARTICIPANTS_DATA_END ---';

const startIndex = appJsContent.indexOf(startTag);
const endIndex = appJsContent.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
  appJsContent = appJsContent.substring(0, startIndex + startTag.length) +
    `\nconst participantsData = ${dataString};\n` +
    appJsContent.substring(endIndex);
}

// 2. Sync reglas e indicaciones.txt into window.REGLAS_TEXT
let reglasText = '';
if (fs.existsSync(reglasTxtPath)) {
  reglasText = fs.readFileSync(reglasTxtPath, 'utf8');
}

const reglasStartTag = '// --- REGLAS_TEXT_START ---';
const reglasEndTag = '// --- REGLAS_TEXT_END ---';

const rStartIndex = appJsContent.indexOf(reglasStartTag);
const rEndIndex = appJsContent.indexOf(reglasEndTag);

if (rStartIndex !== -1 && rEndIndex !== -1) {
  const safeText = JSON.stringify(reglasText);
  appJsContent = appJsContent.substring(0, rStartIndex + reglasStartTag.length) +
    `\nwindow.REGLAS_TEXT = ${safeText};\n` +
    appJsContent.substring(rEndIndex);
}

fs.writeFileSync(appJsPath, appJsContent, 'utf8');
console.log(`✅ Successfully updated app.js with ${files.length} renders and reglas text!`);
