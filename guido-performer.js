(() => {
 const $=id=>document.getElementById(id),audio=window.GuidoVoice.audio,dialog=$('guidoStoryDialog');
 const figures=[...document.querySelectorAll('[data-guido-performer]')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const names=['ascolto','spiega','indica','riflette','invita','saluta'];
 let greetUntil=0,lastPose=-1,startedAt=performance.now();
 const segments=[[1,2800],[2,2100],[0,850],[4,2900],[1,2400],[3,1400],[2,1900],[4,2300],[0,1000]];
 const length=segments.reduce((n,x)=>n+x[1],0);
 function pose(index){if(index===lastPose)return;lastPose=index;for(const figure of figures){figure.dataset.pose=names[index];figure.dataset.frame=index;figure.querySelector('.guidoSprite').style.backgroundPosition=(index%3)*50+'% '+Math.floor(index/3)*100+'%';}}
 function tick(){const speaking=!audio.paused&&!audio.muted&&!audio.ended;for(const figure of figures)figure.classList.toggle('isSpeaking',speaking);
  if(reduced.matches){pose(speaking?1:0);return;}
  if(performance.now()<greetUntil){pose(5);return;}
  if(speaking){let elapsed=audio.currentTime*1000%length;for(const [frame,duration]of segments){if(elapsed<duration){pose(frame);return;}elapsed-=duration;}}
  const idle=(performance.now()-startedAt)%22000;pose(dialog.open&&idle>19000?3:0);
 }
 const timer=setInterval(()=>{if(!document.hidden)tick()},120);
 for(const event of ['play','pause','ended','volumechange'])audio.addEventListener(event,tick);
 function greet(){greetUntil=performance.now()+1400;tick();}
 function activeStage(){return window.GUIDO_ACTIVE_STAGE;}
 function open(){window.dispatchEvent(new Event('guido-leave-camera'));if($('gameDialog').open)$('gameDialog').close();const stage=activeStage();$('guidoStoryTitle').textContent=stage.title;$('guidoSceneText').textContent=stage.story.text;window.GuidoVoice.bind($('guidoSceneVoice'),'story-'+stage.id,'Ascolta il racconto con Guido');dialog.showModal();greet();window.GuidoVoice.play('story-'+stage.id).catch(()=>{});}
 function close(){window.GuidoVoice.stopAll();if(dialog.open)dialog.close();tick();}
 $('openGuidoStory').onclick=open;$('closeGuidoStory').onclick=close;dialog.addEventListener('cancel',()=>window.GuidoVoice.stopAll());
 $('guidoScenePuzzle').onclick=()=>{const id=activeStage().id;close();window.GuidoEscape.open(id)};
 // Close the narrative scene before escape-room.js opens the puzzle after the voice ends.
 window.addEventListener('guido-story-finished',()=>{if(dialog.open)dialog.close();});
 window.addEventListener('pagehide',()=>clearInterval(timer));
 window.GuidoPerformer={greet,open,close,get pose(){return names[lastPose]}};pose(0);
})();
