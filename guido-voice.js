(() => {
 const script=document.currentScript;
 const base=new URL(script.dataset.audioBase||'guido-audio/',script.src);
 const audio=new Audio();audio.preload='none';
 const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('oleggio-guido-voice'):null;
 let key=null;const buttons=new Map();let meter=null;
 function unlockMeter(){try{if(!meter){const context=new(window.AudioContext||window.webkitAudioContext)(),analyser=context.createAnalyser();analyser.fftSize=512;const source=context.createMediaElementSource(audio);source.connect(analyser);analyser.connect(context.destination);meter={context,analyser};}meter.context.resume().catch(()=>{});return meter;}catch{return null;}}
 function url(id){if(!/^(intro|escape-intro|(story|card|quiz|puzzle)-[0-9]{1,2}[AB]?)$/.test(id))throw new Error('Audio sconosciuto');return new URL(id==='story-4'?'../guido-narration.mp3':id+'.mp3',base).href;}
 function refresh(){for(const [button,item]of buttons){if(!button.isConnected){buttons.delete(button);continue;}const active=key===item.key&&!audio.paused;button.textContent=active?'■ Ferma Guido':item.label;button.setAttribute('aria-pressed',String(active));}window.dispatchEvent(new CustomEvent('guido-voice-change',{detail:{key,playing:!audio.paused}}));}
 function stop(){audio.pause();try{audio.currentTime=0;}catch{}refresh();}
 function stopAll(){channel?.postMessage('stop');stop();}
 async function play(id){unlockMeter();stopAll();key=id;audio.src=url(id);try{await audio.play();refresh();}catch(error){refresh();for(const [button,item]of buttons)if(item.key===id)button.textContent='Audio non disponibile · riprova';throw error;}}
 function toggle(id){if(key===id&&!audio.paused){stop();return Promise.resolve();}return play(id);}
 function bind(button,id,label){button.type='button';button.textContent=label;button.setAttribute('aria-pressed','false');buttons.set(button,{key:id,label});button.onclick=()=>toggle(id).catch(()=>{});}
 for(const name of ['play','pause','ended','error'])audio.addEventListener(name,refresh);
 if(channel)channel.onmessage=event=>{if(event.data==='stop')stop();};
 window.addEventListener('pagehide',stopAll);
 window.GuidoVoice={audio,url,unlockMeter,play,toggle,stop,stopAll,bind,get meter(){return meter},get currentKey(){return key}};
})();
