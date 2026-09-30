// Single-entry camera demo. Tracking is provided by room-anchor.js.
(() => {
  const $ = id => document.getElementById(id);
  const video=$('fallbackCamera'),hud=$('arHud'),guide=$('guideAnchor');
  const voice=$('guideVoice'),button=$('startAr');
  const audio=new Audio('guido-narration.mp3');audio.preload='auto';
  let stream=null,opening=false,generation=0,unlocked=false,audioFailed=false;
  const narration='Benvenuti a Oleggio Castello. Io sono Guido, il cantastorie. Fermatevi un momento e guardate oltre ciò che vedete. Ogni luogo custodisce una storia. Oggi vi accompagno a cercare ciò che è cambiato e ciò che è rimasto.';
  function stopVoice(){audio.pause();audio.currentTime=0;window.speechSynthesis?.cancel();voice.textContent='🔊 Ascolta Guido';}
  function speak(){
    if(audioFailed){if(!window.speechSynthesis)return;const utterance=new SpeechSynthesisUtterance(narration);utterance.lang='it-IT';utterance.rate=.9;utterance.onend=()=>voice.textContent='🔊 Riascolta Guido';window.speechSynthesis.speak(utterance);voice.textContent='■ Ferma Guido';return;}
    audio.muted=false;audio.currentTime=0;audio.play().catch(()=>{audioFailed=true;speak();});
  }
  audio.onplay=()=>{if(!audio.muted)voice.textContent='■ Ferma Guido';};audio.onended=()=>voice.textContent='🔊 Riascolta Guido';
  voice.onclick=()=>{if(!audio.paused||window.speechSynthesis?.speaking)stopVoice();else speak();};
  hud.addEventListener('guido-anchored',()=>{if(!unlocked){unlocked=true;speak();}});
  function close(){generation++;opening=false;button.disabled=false;stopVoice();stream?.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;video.classList.remove('active');hud.classList.remove('active');document.body.classList.remove('ar-active');guide.hidden=true;hud.dispatchEvent(new Event('guido-close'));}
  $('closeAr').onclick=close;
  button.onclick=async()=>{
    if(opening)return;opening=true;button.disabled=true;unlocked=false;const current=++generation;
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
      $('arStatus').textContent='Inquadra un oggetto: Guido sta arrivando…';
      hud.dispatchEvent(new CustomEvent('guido-camera-ready',{detail:{mode:'room'}}));
    }catch(error){if(current===generation){close();$('status').textContent='Consenti la fotocamera nelle impostazioni del browser e riprova.';}}
    finally{if(current===generation){opening=false;button.disabled=false;}}
  };
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&stream)close();});
})();