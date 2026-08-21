document.addEventListener('DOMContentLoaded', () => {

  const AudioEngine = {
    ctx: null,
    enabled: false,

    init() {
      const savedState = localStorage.getItem('outbreak_sound_enabled');
      this.enabled = savedState !== 'false';

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }

      this.updateUI();

      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      };

      ['click', 'keydown', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, unlockAudio, { once: true });
      });
    },

    updateUI() {
      const soundToggleBtn = document.getElementById('sound-toggle-btn');
      if (!soundToggleBtn) return;

      if (this.enabled) {
        soundToggleBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> AUDIO: ACTIVO`;
        soundToggleBtn.style.color = 'var(--accent-bio)';
        soundToggleBtn.style.borderColor = 'rgba(0, 255, 204, 0.4)';
        soundToggleBtn.style.background = 'rgba(0, 255, 204, 0.15)';
        soundToggleBtn.classList.add('is-active');
      } else {
        soundToggleBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> AUDIO: SILENCIO`;
        soundToggleBtn.style.color = 'var(--accent-red)';
        soundToggleBtn.style.borderColor = 'var(--border-red)';
        soundToggleBtn.style.background = 'rgba(255, 42, 75, 0.15)';
        soundToggleBtn.classList.remove('is-active');
      }
    },

    toggleSound() {
      this.enabled = !this.enabled;
      localStorage.setItem('outbreak_sound_enabled', this.enabled ? 'true' : 'false');

      if (this.enabled) {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.playBeep(800, 0.05);
      }

      this.updateUI();
      return this.enabled;
    },

    playBeep(freq = 600, duration = 0.06, type = 'sine') {
      if (!this.enabled || !this.ctx) return;
      try {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    },

    playAlert() {
      if (!this.enabled || !this.ctx) return;
      this.playBeep(440, 0.12, 'sawtooth');
      setTimeout(() => this.playBeep(880, 0.15, 'sawtooth'), 100);
    }
  };

  AudioEngine.init();

  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      AudioEngine.toggleSound();
    });
  }

  document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn, .category-card, .camera-btn, .filter-pill, .participant-card, .rule-card, .tab-btn, button');
    if (target && !target.closest('#sound-toggle-btn')) {
      AudioEngine.playBeep(650, 0.04);
    }
  });

// --- REGLAS_TEXT_START ---
window.REGLAS_TEXT = "📜 REGLAMENTO OFICIAL DEL EVENTO\r\n\r\nArtherius Studio  \r\n\r\nCon el objetivo de garantizar una experiencia organizada, justa y divertida para todos los participantes, el siguiente reglamento será de cumplimiento obligatorio durante todo el evento.\r\n\r\n1. Respeto entre participantes\r\nTodos los jugadores deberán mantener una actitud respetuosa hacia los demás participantes, organizadores y miembros del staff.\r\n\r\n2. Hacks y modificaciones\r\nEstá totalmente prohibido el uso de hacks, clientes modificados, x-ray, autoclickers, macros, scripts o cualquier herramienta que otorgue una ventaja injusta.\r\n\r\n3. Explotación de errores\r\nNo está permitido aprovechar bugs o fallos del servidor. Todo error encontrado deberá ser reportado inmediatamente al staff.\r\n\r\n4. Suplantación de identidad\r\nQueda prohibido hacerse pasar por un miembro del equipo organizador o del staff.\r\n\r\n5. Conducta en el chat\r\nNo se permite spam, flood, insultos, lenguaje ofensivo, discriminación, acoso ni publicidad de otros servidores o servicios.\r\n\r\n6. Uso de cuentas\r\nCada participante deberá utilizar únicamente su propia cuenta. El uso de cuentas alternativas para obtener ventajas podrá ser sancionado.\r\n\r\n7. Interferencia\r\nNo está permitido perjudicar intencionalmente el desarrollo del evento o interferir con otros participantes.\r\n\r\n8. Indicaciones del staff\r\nLas instrucciones del equipo organizador deberán seguirse en todo momento.\r\n\r\n9. Grabaciones y transmisiones\r\nTodos los participantes tienen permitido grabar el evento, tomar capturas de pantalla, realizar clips y transmitir en vivo (lives o streams) a través de cualquier plataforma. Todo el contenido generado deberá respetar este reglamento y no podrá utilizarse para acosar, difamar o perjudicar a otros participantes o al equipo organizador. Artherius Studio también podrá grabar, capturar, retransmitir y utilizar contenido del evento con fines promocionales, informativos o de archivo.\r\n\r\n10. Respeto a las decisiones\r\nLas decisiones tomadas por el staff durante el evento deberán respetarse. Cualquier reclamación deberá realizarse de forma educada y por los canales establecidos.\r\n\r\n11. Uso de exploits externos\r\nNo se permite el uso de programas, dispositivos o métodos externos que alteren el funcionamiento normal del juego o del servidor, aunque no sean considerados hacks.\r\n\r\n12. Sanciones\r\nEl incumplimiento de cualquiera de estas reglas podrá resultar en advertencias, expulsión del evento, descalificación o restricción para participar en futuros eventos organizados por Artherius Studio.\r\n\r\n13. Puntualidad\r\nLos participantes deberán presentarse antes del inicio del evento. El staff no está obligado a esperar a los jugadores que lleguen tarde sin previo aviso.\r\n\r\n14. Desobediencia al staff\r\nNegarse a seguir las indicaciones del equipo organizador o dificultar el trabajo del staff podrá ser motivo de sanción.\r\n\r\n15. Respeto a la modalidad\r\nCada participante deberá jugar de acuerdo con las reglas específicas de la modalidad del evento. Cualquier acción fuera de estas normas podrá ser considerada una infracción.\r\n\r\n16. Evidencias\r\nEl staff podrá solicitar pruebas o revisar grabaciones cuando sea necesario para resolver una disputa o investigar una posible infracción.\r\n\r\n17. Asistencia y puntualidad\r\nTodos los participantes deberán encontrarse conectados y disponibles al menos 15 minutos antes del inicio del evento.\r\nEn caso de no poder asistir o de llegar tarde por un motivo de fuerza mayor, el participante deberá informar al equipo organizador con la mayor anticipación posible. Si sabe con varios días de antelación que estará ocupado el día del evento, deberá comunicarlo previamente. Las ausencias o retrasos podrán ser justificadas siempre que el staff considere que la explicación es razonable.\r\n\r\n⚠️ Importante\r\nLa participación en este evento implica la aceptación total de este reglamento. El desconocimiento de las reglas no exime a ningún participante de las sanciones correspondientes.\r\n\r\n- Artherius Studio";
// --- REGLAS_TEXT_END ---

// --- PARTICIPANTS_DATA_START ---
const participantsData = [
    {
        "id": "01",
        "name": "Soy Julio 1",
        "rawName": "soy_julio_1",
        "file": "./renders de participantes/soy_julio_1.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "03",
        "name": "El Fercho Cpm 3.1",
        "rawName": "el_fercho_cpm3.1",
        "file": "./renders de participantes/el_fercho_cpm3.1.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "04",
        "name": "Andressan 956.4",
        "rawName": "andressan_956.4",
        "file": "./renders de participantes/andressan_956.4.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "05",
        "name": "Abdidimc 5",
        "rawName": "abdidimc5",
        "file": "./renders de participantes/abdidimc5.png",
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
        "name": "Cilenxos 7",
        "rawName": "cilenxos_7",
        "file": "./renders de participantes/cilenxos_7.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "08",
        "name": "Ghostleu 08",
        "rawName": "ghostleu08",
        "file": "./renders de participantes/ghostleu08.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "09",
        "name": "Zamora 9",
        "rawName": "zamora9",
        "file": "./renders de participantes/zamora9.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "10",
        "name": "Johan G 10",
        "rawName": "JohanG10",
        "file": "./renders de participantes/JohanG10.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "11",
        "name": "Luuckykat 11",
        "rawName": "luuckykat11",
        "file": "./renders de participantes/luuckykat11.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "12",
        "name": "Legassi 212",
        "rawName": "legassi_212",
        "file": "./renders de participantes/legassi_212.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "13",
        "name": "Kevin 13",
        "rawName": "kevin13",
        "file": "./renders de participantes/kevin13.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "14",
        "name": "Mateo Eck 14",
        "rawName": "mateo_eck14",
        "file": "./renders de participantes/mateo_eck14.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "15",
        "name": "Alanlitras 15",
        "rawName": "Alanlitras15",
        "file": "./renders de participantes/Alanlitras15.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "16",
        "name": "Fanahuvt 16",
        "rawName": "fanahuvt16",
        "file": "./renders de participantes/fanahuvt16.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "17",
        "name": "Daizenzz 17",
        "rawName": "daizenzz17",
        "file": "./renders de participantes/daizenzz17.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "18",
        "name": "Vasquez 18",
        "rawName": "vasquez18",
        "file": "./renders de participantes/vasquez18.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "19",
        "name": "Adrian 489 19",
        "rawName": "adrian489_19",
        "file": "./renders de participantes/adrian489_19.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "20",
        "name": "Lilith Om 20",
        "rawName": "lilith_om20",
        "file": "./renders de participantes/lilith_om20.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "21",
        "name": "RAG TRA 21",
        "rawName": "RAG_TRA21",
        "file": "./renders de participantes/RAG_TRA21.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "422",
        "name": "Marcelyn 0422",
        "rawName": "marcelyn0422",
        "file": "./renders de participantes/marcelyn0422.png",
        "status": "SUJETO DE PRUEBA / REGISTRADO",
        "type": "humano"
    },
    {
        "id": "423",
        "name": "Ponchecito 423",
        "rawName": "ponchecito423",
        "file": "./renders de participantes/ponchecito423.png",
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

      const safeSrc = encodeURI(participant.file);

      card.innerHTML = `
        <div class="render-img-wrapper">
          <span class="render-tag">SUJETO #${participant.id}</span>
          <img src="${safeSrc}" alt="Render de ${participant.name}" class="render-img" loading="lazy">
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
          imgEl.onerror = null;
          imgEl.src = './fondo.jpeg';
          imgEl.style.filter = 'grayscale(0.6) brightness(0.85)';
        };
      }

      card.addEventListener('click', () => openRenderModal(idx));
      rendersGrid.appendChild(card);
    });

    updateCounters();
  }

  if (rendersGrid) {
    renderGallery(participantsData);

    // Dynamic fetch of participantes.json if served over HTTP/HTTPS/Localhost
    fetch('./participantes.json?v=' + Date.now())
      .then(res => res.json())
      .then(jsonData => {
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          participantsData.length = 0;
          participantsData.push(...jsonData);
          currentFilteredList = [...participantsData];
          renderGallery(participantsData);
          updateCounters();
        }
      })
      .catch(() => {});
  }

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

    modalImg.src = encodeURI(participant.file);
    modalImg.onerror = () => {
      modalImg.onerror = null;
      modalImg.src = './fondo.jpeg';
    };
    modalName.textContent = participant.name;
    modalTag.textContent = `SUJETO DE PRUEBA #${participant.id}`;
    modalStatus.textContent = participant.status;
    modalDesc.textContent = `Expediente clasificado de ${participant.name}. Capturado por agentes de Umbrella Corporation durante la irrupción en la ceremonia de boda. Devuelto a Outbreak City tras la liberación del virus Solanum.`;
    modalDownload.href = encodeURI(participant.file);
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
    const themes = ['', 'theme-green', 'theme-cyan', 'theme-amber', 'theme-red'];
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
                <tr><td><strong style="color: var(--accent-bio)">estudio</strong></td><td>Ficha técnica de producción de ARTHERIUS STUDIO.</td></tr>
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
              <div>PRODUCCIÓN: <strong style="color: var(--accent-cyan);">ARTHERIUS STUDIO</strong></div>
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
              <i class="fa-solid fa-book-journal-whills"></i> SINOPSIS CLASIFICADA — OUTBREAK CITY (ARTHERIUS STUDIO)
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
              🎬 ARTHERIUS STUDIO PRODUCTIONS
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
        const themeLabels = {
          '': 'ESTÁNDAR MAINFRAME',
          'theme-green': 'VERDE MATRIX / CRT',
          'theme-cyan': 'CIAN CIBERNÉTICO',
          'theme-amber': 'ÁMBAR PROTOCOLO',
          'theme-red': 'ROJO ALERTA BIOHAZARD'
        };
        const label = themeLabels[themes[currentThemeIdx]] || 'DESCONOCIDO';
        appendTerminalLine(`[TEMA VISUAL DE CONSOLA ACTUALIZADO: ${label}]`, 'system-info');
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
        if (/render|foto|imagen|3d|model|artherius|dibujo|portada/.test(lower)) return 'fa-cube';
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

  // ==========================================================================
  // EVENT COUNTDOWN ENGINE (8:30 PM HORA PERÚ // UTC-5)
  // ==========================================================================
  const CountdownEngine = {
    timerInterval: null,
    targetUtcMs: null,

    getPeruNow() {
      const now = new Date();
      // UTC time in ms
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      // Peru is UTC-5
      return new Date(utc + (-5 * 3600000));
    },

    getTargetDate() {
      const customIso = localStorage.getItem('outbreak_custom_event_iso');
      if (customIso) {
        const customDate = new Date(customIso);
        // Only use custom date if it's still in the future
        if (!isNaN(customDate.getTime()) && customDate.getTime() > Date.now()) {
          return customDate;
        } else {
          // Clear stale/past custom date automatically
          localStorage.removeItem('outbreak_custom_event_iso');
        }
      }

      // Work entirely in UTC to avoid any local timezone interference.
      // Peru is UTC-5, so "now in Peru" = UTC time - 5h
      const peruOffsetMs = -5 * 60 * 60 * 1000;
      const nowUtcMs = Date.now();
      const peruNowMs = nowUtcMs + peruOffsetMs;

      // Build a Date using UTC values to represent "current Peru date"
      const peruProxy = new Date(peruNowMs);

      // Tomorrow in Peru = advance by 1 day in UTC
      const tomorrowPeruProxy = new Date(peruNowMs + 24 * 60 * 60 * 1000);

      // Target: tomorrow at 20:30 Peru time.
      // In UTC that is: tomorrow's Peru date at hour (20+5)=25 => wraps to 01:30 day after.
      // Use Date.UTC with the proxy's UTC year/month/date (which represent Peru's date).
      const targetMs = Date.UTC(
        tomorrowPeruProxy.getUTCFullYear(),
        tomorrowPeruProxy.getUTCMonth(),
        tomorrowPeruProxy.getUTCDate(),
        20 + 5, // 20:30 Peru = 01:30 UTC next morning (JS wraps hours > 23 automatically)
        30,
        0
      );

      return new Date(targetMs);
    },

    init() {
      this.targetDate = this.getTargetDate();
      this.update();
      this.timerInterval = setInterval(() => this.update(), 1000);
      this.setupControls();
    },

    setupControls() {
      const testAlertBtn = document.getElementById('test-alert-btn');
      if (testAlertBtn) {
        testAlertBtn.addEventListener('click', () => {
          AudioEngine.playAlert();
          setTimeout(() => AudioEngine.playBeep(1100, 0.2, 'sawtooth'), 250);
          setTimeout(() => AudioEngine.playBeep(1400, 0.3, 'sawtooth'), 500);
        });
      }

      const customInput = document.getElementById('event-date-picker');
      const applyBtn = document.getElementById('apply-date-btn');
      const resetBtn = document.getElementById('reset-date-btn');

      if (applyBtn && customInput) {
        applyBtn.addEventListener('click', () => {
          if (customInput.value) {
            const chosen = new Date(customInput.value);
            if (!isNaN(chosen.getTime())) {
              localStorage.setItem('outbreak_custom_event_iso', chosen.toISOString());
              this.targetDate = chosen;
              AudioEngine.playBeep(900, 0.08);
              this.update();
            }
          }
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          localStorage.removeItem('outbreak_custom_event_iso');
          this.targetDate = this.getTargetDate();
          if (customInput) customInput.value = '';
          AudioEngine.playBeep(600, 0.08);
          this.update();
        });
      }
    },

    update() {
      const now = new Date();
      const nowMs = now.getTime();
      const targetMs = this.targetDate.getTime();
      const diff = targetMs - nowMs;

      // Update Peru Clock and Local Clock
      const peruNow = this.getPeruNow();
      const peruClockEl = document.getElementById('peru-time-display');
      if (peruClockEl) {
        peruClockEl.textContent = peruNow.toLocaleTimeString('es-PE', { hour12: true }) + ' (UTC-5)';
      }

      const localClockEl = document.getElementById('user-local-time-display');
      if (localClockEl) {
        localClockEl.textContent = now.toLocaleTimeString([], { hour12: true });
      }

      // Timer Digits Elements
      const daysEl = document.getElementById('timer-days');
      const hoursEl = document.getElementById('timer-hours');
      const minsEl = document.getElementById('timer-minutes');
      const secsEl = document.getElementById('timer-seconds');
      const timerBoxes = document.querySelectorAll('.timer-box');

      // Mini timer elements
      const miniHoursEl = document.getElementById('mini-hours');
      const miniMinsEl = document.getElementById('mini-mins');
      const miniSecsEl = document.getElementById('mini-secs');

      let days = 0, hours = 0, mins = 0, secs = 0;
      let phaseClass = 'alert-phase-info';
      let phaseIcon = 'fa-circle-info';
      let phaseTitle = 'ESTADO: PREPARACIÓN & CONVOCATORIA';
      let phaseDesc = 'El evento oficial iniciará mañana a las 8:30 PM Hora Perú (UTC-5). Los servidores y el staff están preparando la simulación de Outbreak City.';
      let isUrgent = false;

      if (diff > 0) {
        days = Math.floor(diff / (1000 * 60 * 60 * 24));
        hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        secs = Math.floor((diff % (1000 * 60)) / 1000);

        const totalMinutesLeft = Math.floor(diff / (1000 * 60));

        if (totalMinutesLeft > 120) {
          phaseClass = 'alert-phase-info';
          phaseIcon = 'fa-satellite-dish';
          phaseTitle = 'ESTADO: CONCENTRACIÓN Y REGISTRO';
          phaseDesc = 'Revisa las fichas de los participantes registrados y lee atentamente el reglamento oficial.';
        } else if (totalMinutesLeft > 60) {
          phaseClass = 'alert-phase-warning';
          phaseIcon = 'fa-triangle-exclamation';
          phaseTitle = '⚠️ ALERTA PREVIA: FALTAN MENOS DE 2 HORAS';
          phaseDesc = 'Inicia la verificación de shaders, texturas y configuración de micrófono en Discord.';
        } else if (totalMinutesLeft > 15) {
          phaseClass = 'alert-phase-warning';
          phaseIcon = 'fa-bell';
          phaseTitle = '🚨 ALERTA: FALTAN MENOS DE 60 MINUTOS';
          phaseDesc = 'Apertura inminente de los canales de espera. Conéctate a Discord y mantente atento a las indicaciones del staff.';
          isUrgent = true;
        } else {
          phaseClass = 'alert-phase-critical';
          phaseIcon = 'fa-biohazard';
          phaseTitle = '☣️ PROTOCOLO REGLA #17: ÚLTIMOS 15 MINUTOS (INGRESO OBLIGATORIO)';
          phaseDesc = '¡TODOS LOS PARTICIPANTES DEBEN ESTAR CONECTADOS AL SERVIDOR Y VOZ AHORA MISMO! (Regla oficial 17).';
          isUrgent = true;
        }
      } else if (diff >= -3 * 3600000) {
        // Event in progress (within 3 hours)
        days = 0; hours = 0; mins = 0; secs = 0;
        phaseClass = 'alert-phase-live';
        phaseIcon = 'fa-tower-broadcast';
        phaseTitle = '🔴 ¡EL EVENTO ESTÁ EN VIVO AHORA MISMO!';
        phaseDesc = 'El virus Solanum ha sido liberado en Outbreak City. La simulación y las transmisiones están activas.';
        isUrgent = true;
      } else {
        // Event concluded
        days = 0; hours = 0; mins = 0; secs = 0;
        phaseClass = 'alert-phase-info';
        phaseIcon = 'fa-flag-checkered';
        phaseTitle = 'SIMULACIÓN FINALIZADA';
        phaseDesc = 'El evento ha concluido. Consulta las grabaciones y estadísticas en la sección de Trailer.';
      }

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');

      if (miniHoursEl) miniHoursEl.textContent = String(days * 24 + hours).padStart(2, '0');
      if (miniMinsEl) miniMinsEl.textContent = String(mins).padStart(2, '0');
      if (miniSecsEl) miniSecsEl.textContent = String(secs).padStart(2, '0');

      timerBoxes.forEach(box => {
        if (isUrgent) {
          box.classList.add('urgent');
        } else {
          box.classList.remove('urgent');
        }
      });

      const alertBanner = document.getElementById('event-status-banner');
      if (alertBanner) {
        alertBanner.className = `event-alert-banner ${phaseClass}`;
        alertBanner.innerHTML = `
          <div class="alert-icon-wrap">
            <i class="fa-solid ${phaseIcon}"></i>
          </div>
          <div class="alert-text-wrap">
            <h4>${phaseTitle}</h4>
            <p>${phaseDesc}</p>
          </div>
        `;
      }
    }
  };

  CountdownEngine.init();

});
