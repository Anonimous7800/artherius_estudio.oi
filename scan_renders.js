const fs = require('fs');
const path = require('path');

const rendersDir = path.join(__dirname, 'renders de participantes');
const appJsPath = path.join(__dirname, 'app.js');
const reglasTxtPath = path.join(__dirname, 'reglas e indicaciones.txt');
const jsonPath = path.join(__dirname, 'participantes.json');

if (!fs.existsSync(rendersDir)) {
  console.error('Directory "renders de participantes" not found!');
  process.exit(1);
}

const files = fs.readdirSync(rendersDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));

console.log(`[SCANNER] Escaneando ${files.length} archivos de render en "renders de participantes"...`);

function extractNumber(fileName) {
  const base = fileName.replace(/\.[^/.]+$/, "");
  const lower = base.toLowerCase();

  if (lower.includes('andressan')) return 4;
  if (lower.includes('fercho')) return 3;
  if (lower.includes('legassi')) return 12;

  const dotMatch = base.match(/\.(\d+)$/);
  if (dotMatch) return parseInt(dotMatch[1], 10);

  const matchTrailing = base.match(/(\d+)$/);
  if (matchTrailing) {
    return parseInt(matchTrailing[1], 10);
  }
  const matchAny = base.match(/\d+/);
  return matchAny ? parseInt(matchAny[0], 10) : 9999;
}

function formatParticipantName(fileName) {
  const rawName = fileName.replace(/\.[^/.]+$/, "");
  let formatted = rawName
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z]+)(\d+)/g, '$1 $2')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();

  if (/^\d+/.test(rawName)) {
    formatted = `Sujeto ${rawName}`;
  }
  return formatted;
}

// Sort files numerically by subject number
files.sort((a, b) => {
  const numA = extractNumber(a);
  const numB = extractNumber(b);
  if (numA !== numB) return numA - numB;
  return a.localeCompare(b);
});

const participantsData = files.map((fileName, idx) => {
  const num = extractNumber(fileName);
  const id = num < 9999 ? String(Math.floor(num)).padStart(2, '0') : String(idx + 1).padStart(2, '0');
  const rawName = fileName.replace(/\.[^/.]+$/, "");
  const formattedName = formatParticipantName(fileName);

  return {
    id,
    name: formattedName,
    rawName,
    file: `./renders de participantes/${fileName}`,
    status: 'SUJETO DE PRUEBA / REGISTRADO',
    type: 'humano'
  };
});

// 1. Write participantes.json
fs.writeFileSync(jsonPath, JSON.stringify(participantsData, null, 2), 'utf8');

// 2. Sync into app.js
let appJsContent = fs.readFileSync(appJsPath, 'utf8');
const dataString = JSON.stringify(participantsData, null, 4);

const startTag = '// --- PARTICIPANTS_DATA_START ---';
const endTag = '// --- PARTICIPANTS_DATA_END ---';

const startIndex = appJsContent.indexOf(startTag);
const endIndex = appJsContent.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
  appJsContent = appJsContent.substring(0, startIndex + startTag.length) +
    `\nconst participantsData = ${dataString};\n` +
    appJsContent.substring(endIndex);
}

// 3. Sync reglas e indicaciones.txt into window.REGLAS_TEXT
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
console.log(`✅ Sincronización completada con éxito: ${participantsData.length} sujetos ordenados y registrados en app.js y participantes.json!`);
participantsData.forEach(p => console.log(`   - Sujeto #${p.id}: ${p.name} (${p.file})`));
