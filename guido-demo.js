// Guido remains visible in the camera view even when image tracking is unavailable.
// The screen placement is a demonstrative effect; the historic photo still uses MindAR when recognized.
(() => {
  const byId = id => document.getElementById(id);
  const scene = byId('arScene');
  const hud = byId('arHud');
  const status = byId('arStatus');
  const pageStatus = byId('status');
  const trackedGuido = byId('guidePlane');
  const fallbackVideo = document.createElement('video');
  fallbackVideo.id = 'fallbackCamera';
  fallbackVideo.autoplay = true;
  fallbackVideo.muted = true;
  fallbackVideo.playsInline = true;
  document.body.appendChild(fallbackVideo);

  const tapSurface = document.createElement('div');
  tapSurface.id = 'guideTapSurface';
  tapSurface.setAttribute('aria-label', 'Tocca la ripresa per spostare Guido');
  hud.prepend(tapSurface);

  const anchor = document.createElement('div');
  anchor.id = 'guideAnchor';
  anchor.innerHTML = '<div class="guideBubble">Sono Guido! Tocca la ripresa per spostarmi.</div><img src="guido-cantastorie.png" alt="Guido, cantastorie illustrato"><div class="guideLine"></div>';
  hud.appendChild(anchor);

  const voiceButton = document.createElement('button');
  voiceButton.id = 'guideVoice';
  voiceButton.type = 'button';
  voiceButton.textContent = '🔊 Ascolta Guido';
  hud.querySelector('.hud-controls').prepend(voiceButton);

  const narration = 'Benvenuti al municipio di Oleggio Castello. Sono Guido, il vostro cantastorie. Guardate il cortile davanti a voi. La didascalia di una fotografia del 1973 racconta che questo edificio era una casa colonica. Tocca lo schermo per mettermi dove vuoi, poi osserva che cosa è cambiato.';
  let fallbackStream = null;
  let generation = 0;
  let opening = false;

  function stopVoice() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    anchor.classList.remove('speaking');
    voiceButton.textContent = '🔊 Ascolta Guido';
  }

  function speakGuido() {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      voiceButton.textContent = 'Voce non disponibile';
      voiceButton.disabled = true;
      return;
    }
    if (window.speechSynthesis.speaking) {
      stopVoice();
      return;
    }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(narration);
    speech.lang = 'it-IT';
    speech.rate = 0.91;
    speech.pitch = 0.96;
    const italianVoice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('it'));
    if (italianVoice) speech.voice = italianVoice;
    speech.onstart = () => {
      anchor.classList.add('speaking');
      voiceButton.textContent = '■ Ferma Guido';
    };
    speech.onend = speech.onerror = () => {
      anchor.classList.remove('speaking');
      voiceButton.textContent = '🔊 Riascolta Guido';
    };
    window.speechSynthesis.speak(speech);
  }

  voiceButton.addEventListener('click', speakGuido);
  tapSurface.addEventListener('click', event => {
    const x = Math.max(20, Math.min(80, event.clientX / innerWidth * 100));
    const y = Math.max(28, Math.min(63, event.clientY / innerHeight * 100));
    anchor.style.left = `${x}%`;
    anchor.style.top = `${y}%`;
    anchor.style.animation = 'none';
    void anchor.offsetWidth;
    anchor.style.animation = '';
  });

  function showOverlay() {
    hud.classList.add('active');
    document.body.classList.add('ar-active');
    anchor.hidden = !byId('arGuido').checked;
    status.textContent = 'Guido è qui. Tocca la ripresa per spostarlo.';
  }

  function hideTrackedGuido() {
    trackedGuido?.setAttribute('visible', false);
  }

  async function stopMindAR() {
    try { await scene.systems?.['mindar-image-system']?.stop(); } catch (_) {}
    scene.classList.remove('active');
  }

  async function startMindAR() {
    if (!window.AFRAME) throw new Error('MindAR non disponibile');
    if (!scene.hasLoaded) {
      await Promise.race([
        new Promise(resolve => scene.addEventListener('loaded', resolve, {once: true})),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout AR')), 4500))
      ]);
    }
    const system = scene.systems?.['mindar-image-system'];
    if (!system) throw new Error('Sistema AR non disponibile');
    scene.classList.add('active');
    await system.start();
    started = true;
    hideTrackedGuido();
    byId('arOpacity').dispatchEvent(new Event('input'));
    hideTrackedGuido();
    status.textContent = 'Guido è qui. Inquadra il municipio per vedere anche la foto storica.';
    pageStatus.textContent = 'Fotocamera avviata.';
  }

  async function startBasicCamera() {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Fotocamera non disponibile');
    fallbackStream = await navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: 'environment'}}, audio: false});
    fallbackVideo.srcObject = fallbackStream;
    fallbackVideo.classList.add('active');
    document.body.classList.add('fallback-active');
    await fallbackVideo.play().catch(() => {});
    status.textContent = 'Guido è nella ripresa · effetto dimostrativo. Tocca per spostarlo.';
    pageStatus.textContent = 'Fotocamera avviata in modalità demo.';
  }

  async function startDemo() {
    if (opening) return;
    if (location.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(location.hostname)) {
      pageStatus.textContent = 'La fotocamera richiede un indirizzo HTTPS.';
      return;
    }
    const myGeneration = ++generation;
    opening = true;
    showOverlay();
    // Starting speech within the tap gesture helps mobile browsers allow playback.
    speakGuido();
    try {
      await startMindAR();
      if (myGeneration !== generation) {
        await stopMindAR();
        started = false;
      }
    } catch (_) {
      await stopMindAR();
      if (myGeneration !== generation) return;
      try {
        await startBasicCamera();
        if (myGeneration !== generation) stopBasicCamera();
      } catch (_) {
        if (myGeneration === generation) {
          closeDemo();
          pageStatus.textContent = 'Non riesco ad aprire la fotocamera: controlla il permesso e riprova.';
        }
      }
    } finally {
      opening = false;
    }
  }

  function stopBasicCamera() {
    fallbackStream?.getTracks().forEach(track => track.stop());
    fallbackStream = null;
    fallbackVideo.srcObject = null;
    fallbackVideo.classList.remove('active');
    document.body.classList.remove('fallback-active');
  }

  async function closeDemo() {
    generation++;
    stopVoice();
    stopBasicCamera();
    await stopMindAR();
    started = false;
    hud.classList.remove('active');
    document.body.classList.remove('ar-active');
    opening = false;
  }

  byId('startAr').onclick = startDemo;
  byId('closeAr').onclick = closeDemo;
  byId('arGuido').addEventListener('input', () => { anchor.hidden = !byId('arGuido').checked; hideTrackedGuido(); });
  ['arOpacity', 'arScale', 'arX', 'arY'].forEach(id => byId(id).addEventListener('input', hideTrackedGuido));
  byId('target').addEventListener('targetFound', hideTrackedGuido);
})();
