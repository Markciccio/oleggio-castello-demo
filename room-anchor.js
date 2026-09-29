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
  const direction = document.createElement('div');
  direction.id = 'guideDirection';
  direction.hidden = true;
  direction.innerHTML = '<span class="arrow">↶</span><span>Guido è fuori campo. Torna verso il punto scelto.</span>';
  hud.appendChild(direction);
  hint.textContent = 'Tocca un bordo: Guido tornerà lì anche dopo essere uscito di scena';
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
  let lastSearch = 0;
  let moveTimer = 0;
  let orientation = null;
  let yawSign = 1;
  let pitchSign = 1;
  let yawCalibrated = false;
  let pitchCalibrated = false;
  const horizontalField = 50;
  const verticalField = 75;

  const angularDifference = (a, b) => ((a - b + 540) % 360) - 180;
  window.addEventListener('deviceorientation', event => {
    if (Number.isFinite(event.alpha) && Number.isFinite(event.beta)) {
      orientation = {yaw: event.alpha, pitch: event.beta, time: performance.now()};
      if (target?.visible && yawCalibrated && hud.classList.contains('active') && canvas.height) {
        const estimate = projectedPoint(canvas.height);
        if (estimate && Math.hypot(estimate.x - target.x, estimate.y - target.y) < 42) {
          place(target.x * .55 + estimate.x * .45, target.y * .55 + estimate.y * .45, canvas.height);
        }
      }
    }
  }, {passive: true});
  document.getElementById('startAr').addEventListener('click', () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }
  }, {capture: true});

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

  function freshOrientation() {
    return orientation && performance.now() - orientation.time < 2500 ? orientation : null;
  }

  function rememberDirection(height) {
    const pose = freshOrientation();
    if (!pose || !target) return;
    target.worldYaw = (pose.yaw + yawSign * (target.x / width - .5) * horizontalField + 360) % 360;
    target.worldPitch = pose.pitch + pitchSign * (target.y / height - .5) * verticalField;
    target.lastPose = pose;
  }

  function projectedPoint(height) {
    const pose = freshOrientation();
    if (!pose || !target || target.worldYaw == null || !yawCalibrated) return null;
    return {
      x: width * (.5 + yawSign * angularDifference(target.worldYaw, pose.yaw) / horizontalField),
      y: pitchCalibrated
        ? height * (.5 + pitchSign * angularDifference(target.worldPitch, pose.pitch) / verticalField)
        : target.y,
    };
  }

  function showOutside(point, height) {
    let arrow = '↶';
    if (point?.x < 0) arrow = '←';
    else if (point?.x > width) arrow = '→';
    else if (point?.y < 0) arrow = '↑';
    else if (point?.y > height) arrow = '↓';
    direction.querySelector('.arrow').textContent = arrow;
    direction.hidden = false;
    pin.hidden = true;
    guido.classList.add('offscreen');
    guido.classList.remove('seeking');
    status.textContent = 'Guido resta legato al punto scelto. Ruota verso la freccia per ritrovarlo.';
  }

  function showEstimated(point, height) {
    direction.hidden = true;
    guido.classList.remove('offscreen');
    guido.classList.add('seeking');
    pin.hidden = !document.getElementById('arGuido').checked;
    place(point.x, point.y, height);
    bubble.textContent = 'Sono qui: sto ritrovando il dettaglio.';
    status.textContent = 'Guido è tornato nella posizione stimata; cerco il dettaglio nella ripresa.';
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
      visible: true, worldYaw: null, worldPitch: null, lastPose: null,
    };
    rememberDirection(frame.height);
    direction.hidden = true;
    pin.hidden = false;
    pin.classList.remove('lost');
    guido.classList.remove('offscreen', 'seeking');
    place(target.x, target.y, frame.height);
    moveAnimation();
    bubble.textContent = 'Eccomi: seguo il punto che hai scelto.';
    status.textContent = 'Guido agganciato al dettaglio scelto · muovi lentamente il telefono.';
  });

  function scoreAt(frame, cx, cy) {
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
    return difference / sampleOffsets.length;
  }

  function findMatch(frame, centerX, centerY, radius, stride = 1) {
    let best = {x: centerX, y: centerY, score: Infinity};
    for (let cy = Math.round(centerY - radius); cy <= centerY + radius; cy += stride) {
      if (cy < 11 || cy >= frame.height - 11) continue;
      for (let cx = Math.round(centerX - radius); cx <= centerX + radius; cx += stride) {
        if (cx < 11 || cx >= width - 11) continue;
        const score = scoreAt(frame, cx, cy);
        if (score < best.score) best = {x: cx, y: cy, score};
      }
    }
    return best;
  }

  function reacquire(frame, estimate) {
    let coarse;
    if (estimate) {
      coarse = findMatch(frame, estimate.x, estimate.y, 48, 3);
    } else {
      coarse = {x: width / 2, y: frame.height / 2, score: Infinity};
      for (let y = 12; y < frame.height - 11; y += 4) {
        for (let x = 12; x < width - 11; x += 4) {
          const score = scoreAt(frame, x, y);
          if (score < coarse.score) coarse = {x, y, score};
        }
      }
    }
    return findMatch(frame, coarse.x, coarse.y, 6, 1);
  }

  function follow(now) {
    requestAnimationFrame(follow);
    if (!target || !hud.classList.contains('active') || now - lastCapture < 110) return;
    lastCapture = now;
    const frame = capture();
    if (!frame) return;
    if (frame.video !== target.video) {
      target.video = frame.video;
      target.visible = false;
    }

    if (target.visible) {
      const predicted = projectedPoint(frame.height);
      const sensorIsNear = predicted && Math.hypot(predicted.x - target.x, predicted.y - target.y) < 42;
      const searchX = sensorIsNear ? target.x * .4 + predicted.x * .6 : target.x;
      const searchY = sensorIsNear ? target.y * .4 + predicted.y * .6 : target.y;
      const match = findMatch(frame, searchX, searchY, sensorIsNear ? 22 : 18);
      if (match.score <= 30) {
        const pose = freshOrientation();
        if (pose && target.lastPose && pose.time - target.lastPose.time < 1000) {
          const yawChange = angularDifference(pose.yaw, target.lastPose.yaw);
          const pitchChange = angularDifference(pose.pitch, target.lastPose.pitch);
          const xChange = match.x - target.x;
          const yChange = match.y - target.y;
          if (Math.abs(yawChange) > 1.5 && Math.abs(xChange) > 2) {
            yawSign = xChange * yawChange < 0 ? 1 : -1;
            yawCalibrated = true;
          }
          if (Math.abs(pitchChange) > 1.5 && Math.abs(yChange) > 2) {
            pitchSign = yChange * pitchChange < 0 ? 1 : -1;
            pitchCalibrated = true;
          }
        }
        target.misses = 0;
        const distance = Math.hypot(match.x - target.x, match.y - target.y);
        target.x = target.x * .35 + match.x * .65;
        target.y = target.y * .35 + match.y * .65;
        place(target.x, target.y, frame.height);
        rememberDirection(frame.height);
        direction.hidden = true;
        guido.classList.remove('offscreen', 'seeking');
        pin.hidden = !document.getElementById('arGuido').checked;
        if (distance > 2.5) moveAnimation();
        if (match.score < 18) {
          const cx = Math.round(target.x), cy = Math.round(target.y);
          for (let i = 0; i < sampleOffsets.length; i++) {
            const [ox, oy] = sampleOffsets[i];
            target.model[i] = target.model[i] * .985 + frame.gray[(cy + oy) * width + cx + ox] * .015;
          }
        }
        return;
      }
      if (++target.misses < 3) return;
      target.visible = false;
    }

    const estimate = projectedPoint(frame.height);
    const outside = estimate && (estimate.x < 0 || estimate.x >= width || estimate.y < 0 || estimate.y >= frame.height);
    if (outside || !estimate) showOutside(estimate, frame.height);
    else showEstimated(estimate, frame.height);

    if (now - lastSearch < 420) return;
    lastSearch = now;
    const globalSearch = outside || !estimate;
    const match = reacquire(frame, globalSearch ? null : estimate);
    if (match.score < (globalSearch ? 17 : 24)) {
      target.visible = true;
      target.misses = 0;
      target.x = match.x;
      target.y = match.y;
      rememberDirection(frame.height);
      direction.hidden = true;
      pin.hidden = !document.getElementById('arGuido').checked;
      pin.classList.remove('lost');
      guido.classList.remove('offscreen', 'seeking');
      place(target.x, target.y, frame.height);
      moveAnimation();
      bubble.textContent = 'Eccomi di nuovo, nello stesso punto.';
      status.textContent = 'Guido ha ritrovato il dettaglio scelto.';
    }
  }

  document.getElementById('closeAr').addEventListener('click', () => {
    target = null;
    yawCalibrated = false;
    pitchCalibrated = false;
    yawSign = 1;
    pitchSign = 1;
    pin.hidden = true;
    pin.classList.remove('lost');
    direction.hidden = true;
    guido.classList.remove('moving', 'offscreen', 'seeking');
    guido.style.left = '69%';
    guido.style.top = '43%';
    bubble.textContent = 'Tocca un dettaglio della sala: mi fermerò lì.';
  });
  document.getElementById('arGuido').addEventListener('input', event => {
    pin.hidden = !event.target.checked || !target;
  });
  requestAnimationFrame(follow);
})();
