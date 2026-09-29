// Demo room anchor: the visitor chooses a visible detail, then a small image patch
// is followed between camera frames. It is not object recognition or a 3D world anchor.
(() => {
  const hud = document.getElementById('arHud');
  const surface = document.getElementById('guideTapSurface');
  const guido = document.getElementById('guideAnchor');
  const bubble = guido.querySelector('.guideBubble');
  const status = document.getElementById('arStatus');
  const hint = hud.querySelector('.hud-note');
  const pin = document.createElement('div');
  pin.id = 'guidePin';
  pin.hidden = true;
  hud.appendChild(pin);
  hint.textContent = 'Tocca un bordo di finestra, una sedia o una cornice';
  bubble.textContent = 'Tocca un dettaglio della sala: mi fermerò lì.';

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', {willReadFrequently: true});
  const width = 224;
  const sampleOffsets = [];
  for (let y = -10; y <= 10; y += 2) {
    for (let x = -10; x <= 10; x += 2) sampleOffsets.push([x, y]);
  }
  let target = null;
  let lastCapture = 0;
  let moveTimer = 0;

  function activeVideo() {
    const fallback = document.getElementById('fallbackCamera');
    if (fallback?.classList.contains('active') && fallback.readyState >= 2) return fallback;
    return [...document.querySelectorAll('video')]
      .find(video => video !== fallback && video.readyState >= 2 && video.videoWidth > 0 && !video.paused);
  }

  function capture() {
    const video = activeVideo();
    if (!video || !context) return null;
    const height = Math.round(width * innerHeight / innerWidth);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const videoRatio = video.videoWidth / video.videoHeight;
    const screenRatio = innerWidth / innerHeight;
    let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;
    if (videoRatio > screenRatio) {
      sw = video.videoHeight * screenRatio;
      sx = (video.videoWidth - sw) / 2;
    } else {
      sh = video.videoWidth / screenRatio;
      sy = (video.videoHeight - sh) / 2;
    }
    try {
      context.drawImage(video, sx, sy, sw, sh, 0, 0, width, height);
      const rgba = context.getImageData(0, 0, width, height).data;
      const gray = new Uint8Array(width * height);
      for (let i = 0, j = 0; j < gray.length; i += 4, j++) {
        gray[j] = (rgba[i] * 77 + rgba[i + 1] * 150 + rgba[i + 2] * 29) >> 8;
      }
      return {video, gray, height};
    } catch (_) {
      return null;
    }
  }

  function patchContrast(frame, cx, cy) {
    let sum = 0, sumSquares = 0;
    for (const [dx, dy] of sampleOffsets) {
      const value = frame.gray[(cy + dy) * width + cx + dx];
      sum += value;
      sumSquares += value * value;
    }
    const n = sampleOffsets.length;
    return Math.sqrt(Math.max(0, sumSquares / n - (sum / n) ** 2));
  }

  function chooseFeature(frame, x, y) {
    let best = {x, y, contrast: -1};
    for (let dy = -10; dy <= 10; dy += 5) {
      for (let dx = -10; dx <= 10; dx += 5) {
        const cx = Math.round(x + dx), cy = Math.round(y + dy);
        if (cx < 12 || cy < 12 || cx >= width - 12 || cy >= frame.height - 12) continue;
        const contrast = patchContrast(frame, cx, cy);
        if (contrast > best.contrast) best = {x: cx, y: cy, contrast};
      }
    }
    return best;
  }

  function makeTemplate(frame, x, y) {
    return Float32Array.from(sampleOffsets, ([dx, dy]) => frame.gray[(y + dy) * width + x + dx]);
  }

  function place(x, y, height) {
    const px = x / width * 100;
    const py = y / height * 100;
    pin.style.left = `${px}%`;
    pin.style.top = `${py}%`;
    guido.style.left = `${Math.max(19, Math.min(81, px + 11))}%`;
    guido.style.top = `${Math.max(27, Math.min(63, py - 7))}%`;
  }

  function moveAnimation() {
    guido.classList.add('moving');
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => guido.classList.remove('moving'), 500);
  }

  surface.addEventListener('click', event => {
    const frame = capture();
    if (!frame) {
      status.textContent = 'Attendi la ripresa, poi tocca un dettaglio della sala.';
      return;
    }
    const selected = chooseFeature(
      frame,
      Math.round(event.clientX / innerWidth * width),
      Math.round(event.clientY / innerHeight * frame.height)
    );
    if (selected.contrast < 9) {
      status.textContent = 'Scegli un bordo ben visibile, per esempio la cornice di un quadro.';
      return;
    }
    target = {
      x: selected.x, y: selected.y, video: frame.video,
      model: makeTemplate(frame, selected.x, selected.y), misses: 0,
    };
    pin.hidden = false;
    pin.classList.remove('lost');
    place(target.x, target.y, frame.height);
    moveAnimation();
    bubble.textContent = 'Eccomi: seguo il punto che hai scelto.';
    status.textContent = 'Guido agganciato al dettaglio scelto · muovi lentamente il telefono.';
  });

  function findMatch(frame) {
    const centerX = Math.round(target.x), centerY = Math.round(target.y);
    let bestScore = Infinity, bestX = centerX, bestY = centerY;
    for (let dy = -18; dy <= 18; dy++) {
      const cy = centerY + dy;
      if (cy < 11 || cy >= frame.height - 11) continue;
      for (let dx = -18; dx <= 18; dx++) {
        const cx = centerX + dx;
        if (cx < 11 || cx >= width - 11) continue;
        let brightnessShift = 0;
        for (let i = 0; i < sampleOffsets.length; i++) {
          const [ox, oy] = sampleOffsets[i];
          brightnessShift += frame.gray[(cy + oy) * width + cx + ox] - target.model[i];
        }
        brightnessShift /= sampleOffsets.length;
        let difference = 0;
        for (let i = 0; i < sampleOffsets.length; i++) {
          const [ox, oy] = sampleOffsets[i];
          difference += Math.abs(frame.gray[(cy + oy) * width + cx + ox] - target.model[i] - brightnessShift);
        }
        const score = difference / sampleOffsets.length;
        if (score < bestScore) { bestScore = score; bestX = cx; bestY = cy; }
      }
    }
    return {x: bestX, y: bestY, score: bestScore};
  }

  function follow(now) {
    requestAnimationFrame(follow);
    if (!target || !hud.classList.contains('active') || now - lastCapture < 110) return;
    lastCapture = now;
    const frame = capture();
    if (!frame) return;
    if (frame.video !== target.video) {
      target = null;
      pin.classList.add('lost');
      status.textContent = 'La ripresa è cambiata: tocca di nuovo il punto da seguire.';
      return;
    }
    const match = findMatch(frame);
    if (match.score > 30) {
      if (++target.misses >= 4) {
        target = null;
        pin.classList.add('lost');
        bubble.textContent = 'Ho perso quel punto. Tocca un altro bordo.';
        status.textContent = 'Punto perso: tocca di nuovo una cornice o una sedia.';
      }
      return;
    }
    target.misses = 0;
    const distance = Math.hypot(match.x - target.x, match.y - target.y);
    target.x = target.x * .35 + match.x * .65;
    target.y = target.y * .35 + match.y * .65;
    place(target.x, target.y, frame.height);
    if (distance > 2.5) moveAnimation();
    if (match.score < 18) {
      const cx = Math.round(target.x), cy = Math.round(target.y);
      for (let i = 0; i < sampleOffsets.length; i++) {
        const [ox, oy] = sampleOffsets[i];
        target.model[i] = target.model[i] * .985 + frame.gray[(cy + oy) * width + cx + ox] * .015;
      }
    }
  }

  document.getElementById('closeAr').addEventListener('click', () => {
    target = null;
    pin.hidden = true;
    guido.classList.remove('moving');
    guido.style.left = '69%';
    guido.style.top = '43%';
    bubble.textContent = 'Tocca un dettaglio della sala: mi fermerò lì.';
  });
  document.getElementById('arGuido').addEventListener('input', event => {
    pin.hidden = !event.target.checked || !target;
  });
  requestAnimationFrame(follow);
})();
