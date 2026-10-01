// Single-entry camera demo. Tracking is provided by room-anchor.js.
(() => {
  const $ = id => document.getElementById(id);
  const video=$('fallbackCamera'),hud=$('arHud'),guide=$('guideAnchor');
  const voice=$('guideVoice'),button=$('startAr');
  const audio=new Audio('guido-narration.mp3');audio.preload='auto';
  const place=$('placeGuido'),aim=$('aimPoint');
  $('timeSlider').oninput=e=>$('historicLayer').style.clipPath=`inset(0 ${100-e.target.value}% 0 0)`;
  // Reposition only the visual anchor; keep the current audio/synthesis session untouched.
  place.onclick=()=>{guide.hidden=true;place.textContent='Cerco il punto…';hud.dispatchEvent(new Event('guido-place'));};
  aim.onclick=()=>{aim.disabled=true;aim.querySelector('.aimLabel').textContent='Cerco un punto nella scena…';hud.dispatchEvent(new Event('guido-place'));};
  let stream=null,opening=false,generation=0,unlocked=false,audioFailed=false;
  let story=window.GUIDO_ACTIVE_STAGE.story,context,analyser,source,synthSpeaking=false,lastVariant=readAppearance(),frame=0;
  const variants=['professor','court','chronicler','blue','amber','silver'];
  function readAppearance(){try{const n=Number(localStorage.getItem('guido-appearance-v2')??-1);return Number.isInteger(n)&&n>=-1&&n<6?n:-1;}catch{return -1;}}
  function chooseAppearance(){
    lastVariant=(lastVariant+1)%variants.length;
    try{localStorage.setItem('guido-appearance-v2',lastVariant);}catch{}
    const variant=variants[lastVariant];story=window.GUIDO_ACTIVE_STAGE.story;
    const costume=lastVariant<3;guide.classList.toggle('costume',costume);
    const asset=costume?`guido-costume-${variant}.png`:`guido-ghost-${variant}.png`;
    const talking=costume?asset:`guido-mouth-${variant}.png`;
    guide.dataset.variant=variant;guide.querySelector('.ghostBase').src=asset;
    guide.querySelector('.ghostMouth').src=talking;guide.querySelector('.ghostGesture').src=talking;guide.querySelector('.ghostExpression').src=asset;
    audio.src=window.GUIDO_ACTIVE_STAGE.audio;audioFailed=false;
  }
  function unlockAnimation(){
    try{if(!context){context=new (window.AudioContext||window.webkitAudioContext)();source=context.createMediaElementSource(audio);analyser=context.createAnalyser();analyser.fftSize=512;source.connect(analyser);analyser.connect(context.destination);}context.resume().catch(()=>{});}catch{}
    if(frame)return;
    const samples=new Uint8Array(512);let mouthLevel=0;
    function animate(t){
      let level=0;
      if(!audio.paused&&!audio.muted&&analyser){analyser.getByteTimeDomainData(samples);let sum=0;for(const n of samples)sum+=((n-128)/128)**2;level=Math.min(.42,Math.max(0,Math.sqrt(sum/samples.length)-.012)*3.8);}
      else if(synthSpeaking)level=.12+.10*Math.sin(t/135);
      mouthLevel+=(level-mouthLevel)*.22;if(audio.paused&&!synthSpeaking)mouthLevel=0;
      guide.style.setProperty('--mouth-open',mouthLevel.toFixed(3));
      const speaking=(!audio.paused&&!audio.muted)||synthSpeaking;
      guide.classList.toggle('speaking',speaking);
      guide.style.setProperty('--gesture',speaking?(.5+.5*Math.sin(t/1100)).toFixed(3):'0');
      guide.style.setProperty('--expression',speaking?(.25+.25*Math.sin(t/1800)).toFixed(3):'0');
      frame=requestAnimationFrame(animate);
    }frame=requestAnimationFrame(animate);
  }
  function stopVoice(){audio.pause();audio.currentTime=0;synthSpeaking=false;guide.style.setProperty('--mouth-open',0);window.speechSynthesis?.cancel();voice.textContent='🔊 Ascolta Guido';}
  function speak(){
    if(audioFailed){if(!window.speechSynthesis)return;const utterance=new SpeechSynthesisUtterance(story.text);utterance.lang='it-IT';utterance.rate=.9;synthSpeaking=true;utterance.onend=()=>{synthSpeaking=false;storyFinished();};utterance.onerror=()=>{synthSpeaking=false;};window.speechSynthesis.speak(utterance);voice.textContent='■ Ferma Guido';return;}
    audio.muted=false;audio.currentTime=0;voice.textContent='■ Ferma Guido';audio.play().catch(()=>{audioFailed=true;speak();});
  }
  function storyFinished(){voice.textContent='🔊 Riascolta Guido';window.dispatchEvent(new CustomEvent('guido-story-finished',{detail:{stage:window.GUIDO_ACTIVE_STAGE.id}}));}
  window.addEventListener('guido-leave-camera',close);
  audio.onplay=()=>{if(!audio.muted)voice.textContent='■ Ferma Guido';};audio.onended=storyFinished;
  voice.onclick=()=>{if(!audio.paused||window.speechSynthesis?.speaking)stopVoice();else speak();};
  hud.addEventListener('guido-anchored',()=>{place.textContent='Sposta Guido';place.hidden=false;place.classList.add('placed');aim.hidden=true;aim.disabled=false;voice.hidden=false;if(!unlocked){unlocked=true;speak();}});
  function close(){generation++;opening=false;button.disabled=false;stopVoice();stream?.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;video.classList.remove('active');hud.classList.remove('active');document.body.classList.remove('ar-active');guide.hidden=true;hud.dispatchEvent(new Event('guido-close'));}
  $('closeAr').onclick=close;
  button.onclick=async()=>{
    if(opening)return;opening=true;button.disabled=true;unlocked=false;const current=++generation;chooseAppearance();unlockAnimation();
    // Unlock prerecorded audio in the initial gesture; start the story once Guido is anchored.
    audio.muted=true;audio.play().then(()=>{if(!unlocked){audio.pause();audio.currentTime=0;audio.muted=false;}}).catch(()=>{audio.muted=false;});
    if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function')DeviceOrientationEvent.requestPermission().catch(()=>{});
    try{
      if(!navigator.mediaDevices?.getUserMedia)throw Error('Fotocamera non disponibile');
      $('status').textContent='Apro la fotocamera…';
      const acquired=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});
      if(current!==generation){acquired.getTracks().forEach(t=>t.stop());return;}
      stream=acquired;video.srcObject=stream;await video.play();
      if(current!==generation)return;
      video.classList.add('active');hud.classList.add('active');document.body.classList.add('ar-active');
      place.hidden=true;place.classList.remove('placed');aim.hidden=false;aim.disabled=false;aim.querySelector('.aimLabel').textContent='Tocca qui per posizionare Guido';voice.hidden=true;
      $('arStatus').textContent='Inquadra un dettaglio e tocca il + per far comparire Guido.';
      hud.dispatchEvent(new CustomEvent('guido-camera-ready',{detail:{mode:'room'}}));
    }catch(error){if(current===generation){close();$('status').textContent='Consenti la fotocamera nelle impostazioni del browser e riprova.';}}
    finally{if(current===generation){opening=false;button.disabled=false;}}
  };
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&stream)close();});
})();
