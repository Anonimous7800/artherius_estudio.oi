document.addEventListener('DOMContentLoaded', () => {

  const AudioEngine = {
    ctx: null,
    enabled: false,

    init() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    },

    toggleSound() {
      this.enabled = !this.enabled;
      if (this.enabled && this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.playBeep(800, 0.05);
      return this.enabled;
    },

    playBeep(freq = 600, duration = 0.08, type = 'sine') {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    },

    playAlert() {
      if (!this.enabled || !this.ctx) return;
      this.playBeep(440, 0.15, 'sawtooth');
      setTimeout(() => this.playBeep(880, 0.2, 'sawtooth'), 120);
    }
  };

  AudioEngine.init();

  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const state = AudioEngine.toggleSound();
      soundToggleBtn.innerHTML = state 
        ? `<i class="fa-solid fa-volume-high"></i> AUDIO: ACTIVO` 
        : `<i class="fa-solid fa-volume-xmark"></i> AUDIO: SILENCIO`;
      soundToggleBtn.style.color = state ? 'var(--accent-bio)' : 'var(--accent-red)';
    });
  }

  document.querySelectorAll('.btn, .category-card, .camera-btn, .filter-pill').forEach(btn => {
    btn.addEventListener('click', () => AudioEngine.playBeep(650, 0.05));
  });

// --- REGLAS_TEXT_START ---
window.REGLAS_TEXT = "";
// --- REGLAS_TEXT_END ---

// --- PARTICIPANTS_DATA_START ---
const participantsData = [
    {
        "id": "01",
        "name": "Abdidimc 5",
        "rawName": "abdidimc5",
        "file": "./renders de participantes/abdidimc5.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "02",
        "name": "Andressan 956.4",
        "rawName": "andressan_956.4",
        "file": "./renders de participantes/andressan_956.4.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "03",
        "name": "Cilenxos 7",
        "rawName": "cilenxos_7",
        "file": "./renders de participantes/cilenxos_7.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "04",
        "name": "El Fercho Cpm 3.1",
        "rawName": "el_fercho_cpm3.1",
        "file": "./renders de participantes/el_fercho_cpm3.1.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "05",
        "name": "Ghostleu 08",
        "rawName": "ghostleu08",
        "file": "./renders de participantes/ghostleu08.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "06",
        "name": "Johan 6",
        "rawName": "Johan6",
        "file": "./renders de participantes/Johan6.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "07",
        "name": "Johan G 10",
        "rawName": "JohanG10",
        "file": "./renders de participantes/JohanG10.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "08",
        "name": "Legassi 212",
        "rawName": "legassi_212",
        "file": "./renders de participantes/legassi_212.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "09",
        "name": "Luuckykat 11",
        "rawName": "luuckykat11",
        "file": "./renders de participantes/luuckykat11.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "10",
        "name": "Soy Julio 1",
        "rawName": "soy_julio_1",
        "file": "./renders de participantes/soy_julio_1.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "11",
        "name": "Zamora 9",
        "rawName": "zamora9",
        "file": "./renders de participantes/zamora9.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    }
];
// --- PARTICIPANTS_DATA_END ---

  let currentFilteredList = [...participantsData];
  let currentModalIndex = 0;

  const rendersGrid = document.getElementById('renders-grid');
  const searchInput = document.getElementById('render-search');
  const visibleCountEl = document.getElementById('visible-count');
  const countRendersStat = document.getElementById('count-renders');

  const video = document.getElementById('main-trailer');
  const videoPlayBtn = document.getElementById('video-play-btn');

  const modalOverlay = document.getElementById('render-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalName = document.getElementById('modal-name');
  const modalTag = document.getElementById('modal-tag');
  const modalStatus = document.getElementById('modal-status');
  const modalDesc = document.getElementById('modal-desc');
  const modalDownload = document.getElementById('modal-download');
  const modalPrevBtn = document.getElementById('modal-prev');
  const modalNextBtn = document.getElementById('modal-next');

  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const menuIcon = document.getElementById('menu-icon');

  if (countRendersStat) countRendersStat.textContent = participantsData.length;

  function updateCounters() {
    if (visibleCountEl) visibleCountEl.textContent = currentFilteredList.length;
    if (countRendersStat) countRendersStat.textContent = participantsData.length;
    const totalPillCount = document.getElementById('total-pill-count');
    if (totalPillCount) totalPillCount.textContent = participantsData.length;
  }

  function renderGallery(items) {
    if (!rendersGrid) return;
    rendersGrid.innerHTML = '';
    currentFilteredList = items;

    if (items.length === 0) {
      rendersGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; color: var(--accent-red); margin-bottom: 14px;"></i>
          <p style="font-size: 1.1rem;">No se encontraron sujetos de prueba con el filtro seleccionado.</p>
        </div>
      `;
      updateCounters();
      return;
    }

    items.forEach((participant, idx) => {
      const card = document.createElement('div');
      card.className = 'render-card';
      card.setAttribute('data-name', participant.name.toLowerCase());

      card.innerHTML = `
        <div class="render-img-wrapper">
          <span class="render-tag">SUJETO #${participant.id}</span>
          <img src="${participant.file}" alt="Render de ${participant.name}" class="render-img" loading="lazy">
        </div>
        <div class="render-info">
          <div>
            <div class="render-name">${participant.name}</div>
            <div style="font-size: 0.75rem; color: var(--accent-bio); font-family: var(--font-mono); margin-top: 2px;">
              <i class="fa-solid fa-shield-halved"></i> ${participant.status}
            </div>
          </div>
          <button class="render-expand-btn" aria-label="Ver detalles">
            <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
          </button>
        </div>
      `;

      const imgEl = card.querySelector('.render-img');
      if (imgEl) {
        imgEl.onerror = () => {
          card.remove();
          const pIndex = participantsData.indexOf(participant);
          if (pIndex !== -1) participantsData.splice(pIndex, 1);
          currentFilteredList = currentFilteredList.filter(p => p !== participant);
          updateCounters();
        };
      }

      card.addEventListener('click', () => openRenderModal(idx));
      rendersGrid.appendChild(card);
    });

    updateCounters();
  }

  if (rendersGrid) renderGallery(participantsData);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = participantsData.filter(p => 
        p.name.toLowerCase().includes(query) || (p.rawName && p.rawName.toLowerCase().includes(query))
      );
      renderGallery(filtered);
    });
  }

  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filterType = pill.getAttribute('data-filter');

      if (filterType === 'all') {
        renderGallery(participantsData);
      } else {
        const filtered = participantsData.filter(p => p.type === filterType);
        renderGallery(filtered);
      }
    });
  });

  function openRenderModal(index) {
    if (!modalOverlay || currentFilteredList.length === 0) return;
    currentModalIndex = index % currentFilteredList.length;
    const participant = currentFilteredList[currentModalIndex];
    if (!participant) return;

    modalImg.src = participant.file;
    modalName.textContent = participant.name;
    modalTag.textContent = `SUJETO DE PRUEBA #${participant.id}`;
    modalStatus.textContent = participant.status;
    modalDesc.textContent = `Expediente clasificado de ${participant.name}. Capturado por agentes de Umbrella Corporation durante la irrupción en la ceremonia de boda. Devuelto a Outbreak City tras la liberación del virus Solanum.`;
    modalDownload.href = participant.file;
    modalDownload.setAttribute('download', `${participant.name}_OutbreakCity_Render.png`);

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    AudioEngine.playBeep(700, 0.06);
  }

  function closeRenderModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalPrevBtn) {
    modalPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentModalIndex = (currentModalIndex - 1 + currentFilteredList.length) % currentFilteredList.length;
      openRenderModal(currentModalIndex);
    });
  }

  if (modalNextBtn) {
    modalNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentModalIndex = (currentModalIndex + 1) % currentFilteredList.length;
      openRenderModal(currentModalIndex);
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeRenderModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeRenderModal();
    });
  }

  if (video && videoPlayBtn) {
    videoPlayBtn.addEventListener('click', () => {
      video.play();
      videoPlayBtn.classList.add('hidden');
      video.setAttribute('controls', 'true');
      AudioEngine.playBeep(900, 0.08);
    });

    video.addEventListener('pause', () => {
      if (!video.seeking) videoPlayBtn.classList.remove('hidden');
    });

    video.addEventListener('ended', () => {
      videoPlayBtn.classList.remove('hidden');
      video.removeAttribute('controls');
    });
  }

  const cameraBtns = document.querySelectorAll('.camera-btn');
  const camNameLabel = document.getElementById('current-cam-name');
  cameraBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cameraBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const camName = btn.getAttribute('data-cam');
      if (camNameLabel) camNameLabel.textContent = `CAM_${camName} // TRANSMISIÓN UMBRELLA`;
      AudioEngine.playBeep(800, 0.05);
    });
  });

  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  const terminalWrapper = document.getElementById('terminal-wrapper');
  const inputHint = document.getElementById('input-hint');
  const sendBtn = document.getElementById('terminal-send-btn');

  if (terminalInput && terminalBody) {
    const commandList = ['help', 'sujetos', 'solanum', 'scan', 'status', 'lore', 'estudio', 'matrix', 'theme', 'time', 'clear'];
    const commandHistory = [];
    let historyIndex = -1;
    const themes = ['', 'theme-green', 'theme-cyan', 'theme-amber'];
    let currentThemeIdx = 0;

    function appendTerminalLine(content, className = 'command-response', isHTML = false) {
      const line = document.createElement('div');
      line.className = `terminal-line ${className}`;
      if (isHTML) {
        line.innerHTML = content;
      } else {
        line.textContent = content;
      }
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    const commandHandlers = {
      help: () => {
        appendTerminalLine(`
          <div class="terminal-card-output">
            <div style="color: var(--accent-cyan); font-weight: bold; margin-bottom: 8px;">
              <i class="fa-solid fa-terminal"></i> COMANDOS DISPONIBLES EN UMBRELLA OS:
            </div>
            <table class="terminal-table">
              <thead>
                <tr>
                  <th>COMANDO</th>
                  <th>DESCRIPCIÓN</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><strong style="color: var(--accent-bio)">help</strong></td><td>Muestra esta lista de comandos clasificados.</td></tr>
                <tr><td><strong style="color: var(--accent-bio)">sujetos</strong></td><td>Expedientes de los ${participantsData.length} sujetos de prueba activos.</td></tr>
                <tr><td><strong style="color: var(--accent-red)">solanum</strong></td><td>Análisis del virus patógeno biológico Solanum.</td></tr>
                <tr><td><strong style="color: var(--accent-cyan)">scan</strong></td><td>Ejecuta escaneo de radar de bioseguridad en el sector.</td></tr>
                <tr><td><strong style="color: var(--accent-amber)">status</strong></td><td>Diagnóstico en tiempo real del mainframe y simulación.</td></tr>
                <tr><td><strong style="color: var(--accent-cyan)">lore</strong></td><td>Historia completa del experimento Outbreak City.</td></tr>
                <tr><td><strong style="color: var(--accent-bio)">estudio</strong></td><td>Ficha técnica de producción de Arterious Estudio.</td></tr>
                <tr><td><strong style="color: var(--accent-amber)">matrix</strong></td><td>Secuencia de código fuente del sistema.</td></tr>
                <tr><td><strong style="color: var(--accent-cyan)">theme</strong></td><td>Cambia el tema visual de la consola.</td></tr>
                <tr><td><strong style="color: var(--accent-red)">clear</strong></td><td>Limpia los datos en pantalla de la terminal.</td></tr>
              </tbody>
            </table>
          </div>
        `, 'command-response', true);
      },

      sujetos: () => {
        const rows = participantsData.map(p => 
          `<tr><td>#${p.id}</td><td><strong>${p.name}</strong></td><td><span style="color: var(--accent-bio); font-size: 0.75rem;">${p.status}</span></td></tr>`
        ).join('');

        appendTerminalLine(`
          <div class="terminal-card-output">
            <div style="color: var(--accent-bio); font-weight: bold; margin-bottom: 6px;">
              <i class="fa-solid fa-users-viewfinder"></i> REGISTRO DE SUJETOS EN SIMULACIÓN (${participantsData.length} TOTAL)
            </div>
            <table class="terminal-table">
              <thead>
                <tr><th>ID</th><th>NOMBRE</th><th>ESTADO</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `, 'command-response', true);
      },

      solanum: () => {
        appendTerminalLine(`
          <div class="terminal-card-output" style="border-color: var(--border-red); background: rgba(30, 10, 15, 0.8);">
            <div style="color: var(--accent-red); font-weight: bold; font-size: 1rem; margin-bottom: 6px;">
              <i class="fa-solid fa-biohazard"></i> INFORME BIOLÓGICO: CEPA SOLANUM (NIVEL 4)
            </div>
            <p style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 10px;">
              Agente patógeno neurotrópico desarrollado en laboratorios subterráneos de Umbrella Corp. Sustituye la actividad cerebral motora por impulsos primarios de agresión.
            </p>
            <div style="font-size: 0.78rem; display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>TASA DE TRANSMISIÓN:</span>
              <strong style="color: var(--accent-red)">99.4% (EXTREMA)</strong>
            </div>
            <div class="terminal-progress-bar">
              <div class="terminal-progress-fill" style="width: 99.4%;"></div>
            </div>
          </div>
        `, 'command-response', true);
      },

      status: () => {
        appendTerminalLine(`
          <div class="terminal-card-output">
            <div style="color: var(--accent-amber); font-weight: bold; margin-bottom: 8px;">
              <i class="fa-solid fa-chart-line"></i> DIAGNÓSTICO DEL MAINFRAME — OUTBREAK CITY
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; font-size: 0.8rem;">
              <div>ESTADO: <strong style="color: var(--accent-red);">BROTE ACTIVO</strong></div>
              <div>SUJETOS: <strong style="color: var(--accent-bio);">${participantsData.length} EN RADAR</strong></div>
              <div>PRODUCCIÓN: <strong style="color: var(--accent-cyan);">ARTERIOUS ESTUDIO</strong></div>
              <div>SECTOR: <strong style="color: #fff;">ZONA CERO</strong></div>
            </div>
          </div>
        `, 'command-response', true);
      },

      scan: () => {
        appendTerminalLine(`[INICIANDO ESCANEO DE BIOSEGURIDAD EN SECTOR...]`, 'system-info');
        AudioEngine.playBeep(900, 0.1, 'sawtooth');

        setTimeout(() => {
          appendTerminalLine(`[ANALIZANDO FRECUENCIAS DE SEÑAL VITAL... 45%]`, 'system-info');
          AudioEngine.playBeep(1100, 0.1, 'sawtooth');
        }, 400);

        setTimeout(() => {
          appendTerminalLine(`
            <div class="terminal-card-output" style="border-color: var(--border-bio);">
              <div style="color: var(--accent-bio); font-weight: bold;">
                <i class="fa-solid fa-circle-check"></i> ESCANEO COMPLETADO: 12 ANOMALÍAS DETECTADAS EN OUTBREAK CITY.
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                Sujetos rastreados correctamente. Parámetros de bioseguridad estables.
              </div>
            </div>
          `, 'command-response', true);
          AudioEngine.playAlert();
        }, 900);
      },

      lore: () => {
        appendTerminalLine(`
          <div class="terminal-card-output">
            <div style="color: var(--accent-cyan); font-weight: bold; margin-bottom: 6px;">
              <i class="fa-solid fa-book-journal-whills"></i> SINOPSIS CLASIFICADA — OUTBREAK CITY (Arterious Estudio)
            </div>
            <p style="font-size: 0.85rem; color: #cbd5e1;">
              La boda entre Jere y Amarillo fue interrumpida por fuerzas tácticas de Umbrella Corp. Todos los invitados fueron capturados e introducidos en la simulación urbana de Outbreak City. Con la liberación accidental de la cepa Solanum, la simulación se convirtió en una lucha real por la supervivencia.
            </p>
          </div>
        `, 'command-response', true);
      },

      estudio: () => {
        appendTerminalLine(`
          <div class="terminal-card-output">
            <div style="color: var(--accent-bio); font-weight: bold; margin-bottom: 6px;">
              🎬 ARTERIOUS ESTUDIO PRODUCTIONS
            </div>
            <p style="font-size: 0.85rem; color: #cbd5e1;">
              Estudio audiovisual especializado en cinemáticas 3D, simulaciones y narrativas de terror en Minecraft. Creadores de Outbreak City — El Brote.
            </p>
          </div>
        `, 'command-response', true);
      },

      matrix: () => {
        appendTerminalLine(`01000001 01010010 01010100 01000101 01010010 01001001 01001111 01010101 01010011`, 'matrix-line');
        appendTerminalLine(`SYSTEM_OVERRIDE // UMBRELLA CORP MAINFRAME // ACCESS GRANTED`, 'matrix-line');
        AudioEngine.playBeep(1200, 0.15, 'square');
      },

      theme: () => {
        currentThemeIdx = (currentThemeIdx + 1) % themes.length;
        if (terminalWrapper) {
          terminalWrapper.className = `terminal-wrapper ${themes[currentThemeIdx]}`;
        }
        const themeName = themes[currentThemeIdx] ? themes[currentThemeIdx].replace('theme-', '').toUpperCase() : 'DEFAULT (RED)';
        appendTerminalLine(`Tema visual de la consola actualizado a: ${themeName}`, 'system-info');
      },

      time: () => {
        const now = new Date();
        appendTerminalLine(`TIEMPO DEL MAINFRAME: ${now.toLocaleString()} (UTC-5)`, 'system-info');
      },

      clear: () => {
        terminalBody.innerHTML = '';
      }
    };

    function executeCommand(rawCmd) {
      const inputVal = rawCmd.trim().toLowerCase();
      if (!inputVal) return;

      appendTerminalLine(`guest@umbrella-os:~$ ${rawCmd.trim()}`, 'command-prompt');
      AudioEngine.playBeep(750, 0.04);

      if (commandHistory[commandHistory.length - 1] !== rawCmd.trim()) {
        commandHistory.push(rawCmd.trim());
      }
      historyIndex = commandHistory.length;

      if (commandHandlers[inputVal]) {
        commandHandlers[inputVal]();
      } else {
        appendTerminalLine(`Comando no reconocido: "${inputVal}". Haz clic en "help" para ver los comandos disponibles.`, 'error-msg');
        AudioEngine.playBeep(350, 0.1, 'sawtooth');
      }

      if (inputHint) inputHint.textContent = '';
    }

    function updateInputHint() {
      if (!inputHint) return;
      const val = terminalInput.value.toLowerCase();
      if (!val) {
        inputHint.textContent = '';
        return;
      }
      const match = commandList.find(cmd => cmd.startsWith(val));
      if (match && match !== val) {
        inputHint.textContent = match;
      } else {
        inputHint.textContent = '';
      }
    }

    terminalInput.addEventListener('input', updateInputHint);

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        terminalInput.value = '';
        executeCommand(val);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const val = terminalInput.value.toLowerCase();
        if (val) {
          const match = commandList.find(cmd => cmd.startsWith(val));
          if (match) {
            terminalInput.value = match;
            updateInputHint();
          }
        }
      } else if (e.key === 'ArrowUp') {
        if (commandHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
          updateInputHint();
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
          updateInputHint();
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
          updateInputHint();
        }
      }
    });

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        const val = terminalInput.value;
        terminalInput.value = '';
        executeCommand(val);
      });
    }

    // Quick Command Chips
    document.querySelectorAll('.term-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) executeCommand(cmd);
      });
    });

    // Toolbar Header Buttons
    const clearBtn = document.getElementById('term-btn-clear');
    const expandBtn = document.getElementById('term-btn-expand');
    const themeBtn = document.getElementById('term-btn-theme');
    const copyBtn = document.getElementById('term-btn-copy');
    const fullscreenBtn = document.getElementById('term-btn-fullscreen');

    if (clearBtn) {
      clearBtn.addEventListener('click', () => executeCommand('clear'));
    }

    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        terminalWrapper.classList.toggle('expanded');
        AudioEngine.playBeep(800, 0.04);
      });
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => executeCommand('theme'));
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = terminalBody.innerText;
        navigator.clipboard.writeText(text).then(() => {
          appendTerminalLine('[LOGS COPIADOS CON ÉXITO AL PORTAPAPELES]', 'system-info');
          AudioEngine.playBeep(950, 0.05);
        }).catch(() => {
          appendTerminalLine('[ERROR AL COPIAR LOGS]', 'error-msg');
        });
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        terminalWrapper.classList.toggle('fullscreen');
        fullscreenBtn.innerHTML = terminalWrapper.classList.contains('fullscreen') 
          ? `<i class="fa-solid fa-compress"></i>` 
          : `<i class="fa-solid fa-expand"></i>`;
        AudioEngine.playBeep(850, 0.05);
      });
    }
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      if (menuIcon) {
        menuIcon.className = navLinks.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
      AudioEngine.playBeep(600, 0.04);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuIcon) menuIcon.className = 'fa-solid fa-bars';
      });
    });
  }

  const liveClockEl = document.getElementById('live-clock');
  function updateClock() {
    if (!liveClockEl) return;
    const now = new Date();
    liveClockEl.textContent = now.toTimeString().split(' ')[0] + ' UTC-5';
  }
  if (liveClockEl) {
    updateClock();
    setInterval(updateClock, 1000);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRenderModal();
    } else if (modalOverlay && modalOverlay.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        currentModalIndex = (currentModalIndex - 1 + currentFilteredList.length) % currentFilteredList.length;
        openRenderModal(currentModalIndex);
      } else if (e.key === 'ArrowRight') {
        currentModalIndex = (currentModalIndex + 1) % currentFilteredList.length;
        openRenderModal(currentModalIndex);
      }
    }
  });

  // Dynamic Rules Loader from reglas e indicaciones.txt
  const rulesContainer = document.getElementById('rules-container');
  if (rulesContainer) {
    const renderRules = (text) => {
      const trimmed = (text || '').trim();
      rulesContainer.innerHTML = '';

      if (!trimmed) {
        rulesContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted); background: var(--bg-panel); border: 1px dashed var(--border-light); border-radius: 12px;">
            <i class="fa-solid fa-file-circle-exclamation" style="font-size: 3rem; color: var(--accent-amber); margin-bottom: 16px;"></i>
            <h3 style="font-family: var(--font-title); color: #fff; margin-bottom: 8px;">ESPERANDO REGLAS E INDICACIONES</h3>
            <p style="max-width: 500px; margin: 0 auto; font-size: 0.95rem;">
              Escribe o pega el texto en el archivo <code style="color: var(--accent-bio);">reglas e indicaciones.txt</code> y aparecerá automáticamente aquí formateado en tarjetas de bioseguridad.
            </p>
          </div>
        `;
        return;
      }

      const sections = trimmed.split(/\n\s*\n/).filter(s => s.trim().length > 0);

      function detectIcon(txt) {
        const lower = (txt || '').toLowerCase();
        if (/virus|solanum|infecc|zombi|sintom|contagi|enfermedad/.test(lower)) return 'fa-vial-virus';
        if (/mapa|limit|perimetr|ciudad|zona|area|sect|ubicac/.test(lower)) return 'fa-map-location-dot';
        if (/pvp|combat|pelea|arma|muert|matar|suministr|luch/.test(lower)) return 'fa-skull-crossbones';
        if (/render|foto|imagen|3d|model|arterious|dibujo|portada/.test(lower)) return 'fa-cube';
        if (/audio|voz|canal|micr|sonid|hablar|discord|transmi/.test(lower)) return 'fa-headset';
        if (/comunidad|respet|fair|play|norma|regla|admin|sancion/.test(lower)) return 'fa-shield-halved';
        if (/prohibid|ban|bloque|no /.test(lower)) return 'fa-ban';
        return 'fa-scroll';
      }

      sections.forEach((section, idx) => {
        const lines = section.trim().split('\n');
        let title = `REGLA #${String(idx + 1).padStart(2, '0')}`;
        let desc = section.trim();

        if (lines.length > 1) {
          title = lines[0].replace(/^[\d\.\-\:\#\s]+/, '').trim();
          desc = lines.slice(1).join('<br>').trim();
        } else if (lines.length === 1) {
          const parts = lines[0].split(':');
          if (parts.length > 1) {
            title = parts[0].replace(/^[\d\.\-\:\#\s]+/, '').trim();
            desc = parts.slice(1).join(':').trim();
          } else {
            desc = lines[0];
          }
        }

        const iconClass = detectIcon(section);
        const card = document.createElement('div');
        card.className = 'rule-card';

        card.innerHTML = `
          <div class="rule-header">
            <div class="rule-icon"><i class="fa-solid ${iconClass}"></i></div>
            <h3 class="rule-title">${title}</h3>
          </div>
          <p class="rule-desc">${desc}</p>
        `;

        rulesContainer.appendChild(card);
      });
    };

    if (window.REGLAS_TEXT) {
      renderRules(window.REGLAS_TEXT);
    }

    fetch('./reglas e indicaciones.txt?v=' + Date.now())
      .then(res => res.text())
      .then(text => renderRules(text))
      .catch(err => {
        if (!window.REGLAS_TEXT) renderRules('');
      });
  }

});
