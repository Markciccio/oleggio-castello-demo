(() => {
 const $=id=>document.getElementById(id),audio=window.GuidoVoice.audio,dialog=$('guidoStoryDialog');
 const figures=[...document.querySelectorAll('[data-guido-performer]')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const scriptBase=new URL('.',document.currentScript.src);
 const parts=new Image(),hands=new Image();parts.src=new URL('guido-rig-parti-v2-clean.png',scriptBase);hands.src=new URL('guido-rig-mani-v2-clean.png',scriptBase);
 const P=[[97,7,398,507],[614,77,314,412],[1178,29,218,485],[168,510,233,483],[664,525,225,489],[1162,510,228,493]];
 const H=[[120,39,328,434],[645,57,218,416],[1073,150,314,324],[166,538,334,423],[660,548,220,413],[1106,636,322,325]];
 // Angles are absolute, measured from a downward arm. The coat and feet never rotate.
 const gestures=[
 ['ascolta',12,5,-12,-5,2,2,0],['spiega',28,112,-12,-8,0,2,-2],
 ['indica',30,166,-10,-8,1,2,-3],['accoglie',38,118,-38,-118,0,0,0],
 ['mano al cuore',8,-132,-15,-20,2,2,2],['invita',18,65,-32,-108,2,0,3],
 ['riflette',4,-153,-10,-4,2,2,-4],['sottolinea',25,142,-24,-145,1,1,1],
 ['racconta',32,102,-20,-65,0,2,-2],['saluta',38,170,-12,-10,0,2,2],
 ['mostra',14,52,-35,-125,2,1,3],['conclude',34,110,-34,-110,0,0,0]
 ];
 let greetUntil=0,lastPose=0,lastTime=0,mouth=0,ready=false,forced=null;
 let joints=[12,5,-12,-5,2,2,0];const samples=new Uint8Array(512);
 const master=document.createElement('canvas');master.width=720;master.height=1080;const c=master.getContext('2d');
 const actors=figures.map(figure=>{const canvas=document.createElement('canvas');canvas.className='guidoPuppet';canvas.width=720;canvas.height=1080;canvas.setAttribute('aria-hidden','true');figure.append(canvas);return{figure,canvas,ctx:canvas.getContext('2d')}});
 Promise.all([parts.decode(),hands.decode()]).then(()=>{ready=true;for(const f of figures)f.classList.add('rigReady')}).catch(()=>{});
 const rad=d=>d*Math.PI/180;
 function piece(img,r,x,y,w,h){c.drawImage(img,...r,x,y,w,h)}
 function shoulder(side){return side===0?[169,240]:[295,240]}
 function elbow(side){const s=shoulder(side),a=rad(joints[side*2]);return[s[0]-Math.sin(a)*78,s[1]+Math.cos(a)*78]}
 function upper(side){const s=shoulder(side);c.save();c.translate(...s);c.rotate(rad(joints[side*2]));const r=P[side===0?2:4];piece(parts,[r[0],r[1],r[2],285],-29,-13,58,94);c.restore()}
 function lower(side,t){const e=elbow(side),a=rad(joints[side*2+1]+(lastPose===9&&side===0&&!reduced.matches?Math.sin(t/110)*8:0));c.save();c.translate(...e);c.rotate(a);piece(parts,P[side===0?3:5],-25,-15,50,110);c.translate(side===0?9:-9,84);c.rotate(Math.PI);const index=side*3+gestures[lastPose][5+side],r=H[index],height=55,width=r[2]/r[3]*height;piece(hands,r,-width*.52,-height*.94,width,height);c.restore()}
 function head(t,speaking){c.save();c.translate(233,185);c.rotate(rad(joints[6]+(speaking&&!reduced.matches?Math.sin(t/470)*.8:0)));c.translate(-233,-185);
 const x=157,y=22,w=157,h=206;piece(parts,P[1],x,y,w,h);
 // Facial details use the same head coordinate system, so they stay attached while nodding.
 c.save();c.translate(x,y);c.scale(.5,.5);
 if(mouth>.045){const amount=Math.min(1,mouth),drop=amount*13;c.beginPath();c.moveTo(84,282);c.bezierCurveTo(107,289,138,282,159,276);c.bezierCurveTo(143,287+drop,109,299+drop,84,282);c.fillStyle='#512721';c.fill();c.beginPath();c.moveTo(91,284);c.quadraticCurveTo(128,290,153,279);c.quadraticCurveTo(130,289+drop*.25,97,289);c.fillStyle='#f5ddbd';c.fill();c.beginPath();c.moveTo(92,289+drop*.5);c.quadraticCurveTo(124,302+drop,150,286+drop*.4);c.strokeStyle='#b86b58';c.lineWidth=2;c.stroke();}
 const blink=!reduced.matches&&t%4900>4740;
 if(blink){for(const [ex,ey]of [[73,210],[152,204]]){c.fillStyle='#ca8a65';c.beginPath();c.ellipse(ex,ey,17,7,-.08,0,Math.PI*2);c.fill();c.strokeStyle='#533e31';c.lineWidth=2;c.beginPath();c.moveTo(ex-15,ey);c.quadraticCurveTo(ex,ey+5,ex+15,ey-1);c.stroke();}}
 c.restore();c.restore()}
 function render(t,speaking){c.setTransform(1.5,0,0,1.5,0,0);c.clearRect(0,0,480,720);upper(0);upper(1);piece(parts,P[0],44,195,392,500);head(t,speaking);lower(0,t);lower(1,t);
 for(const actor of actors){if(!actor.figure.getClientRects().length)continue;actor.ctx.clearRect(0,0,720,1080);actor.ctx.drawImage(master,0,0);actor.figure.dataset.pose=gestures[lastPose][0];actor.figure.dataset.frame=lastPose;actor.figure.classList.toggle('isSpeaking',speaking);}}
 function tick(t){requestAnimationFrame(tick);if(t-lastTime<32||document.hidden||!ready)return;const dt=Math.min(100,t-lastTime||32);lastTime=t;
 const speaking=!audio.paused&&!audio.muted&&!audio.ended;
 let selected=0;if(!reduced.matches){if(forced!==null)selected=forced;else if(t<greetUntil)selected=9;else if(speaking){const sequence=[1,2,3,4,8,5,6,7,10,11,0];selected=sequence[Math.floor(audio.currentTime/2.7)%sequence.length]}}
 lastPose=selected;const target=gestures[selected].slice(1);const ease=1-Math.exp(-dt/220);for(const i of[0,1,2,3,6])joints[i]+=(target[i]-joints[i])*ease;
 let energy=0;const meter=window.GuidoVoice.meter;if(speaking&&meter){meter.analyser.getByteTimeDomainData(samples);let sum=0;for(const n of samples)sum+=((n-128)/128)**2;energy=Math.min(1,Math.max(0,Math.sqrt(sum/samples.length)-.009)*7);}
 mouth=speaking&&!reduced.matches?mouth+(energy-mouth)*.65:0;render(t,speaking);
 }
 requestAnimationFrame(tick);
 function greet(){greetUntil=performance.now()+1800;}
 function activeStage(){return window.GUIDO_ACTIVE_STAGE;}
 function open(){window.dispatchEvent(new Event('guido-leave-camera'));if($('gameDialog').open)$('gameDialog').close();const stage=activeStage();$('guidoStoryTitle').textContent=stage.title;$('guidoSceneText').textContent=stage.story.text;window.GuidoVoice.bind($('guidoSceneVoice'),'story-'+stage.id,'Ascolta il racconto con Guido');dialog.showModal();greet();window.GuidoVoice.play('story-'+stage.id).catch(()=>{});}
 function close(){window.GuidoVoice.stopAll();if(dialog.open)dialog.close();}
 $('openGuidoStory').onclick=open;$('closeGuidoStory').onclick=close;dialog.addEventListener('cancel',()=>window.GuidoVoice.stopAll());
 $('guidoScenePuzzle').onclick=()=>{const id=activeStage().id;close();window.GuidoEscape.open(id)};
 // Close the narrative scene before escape-room.js opens the puzzle after the voice ends.
 window.addEventListener('guido-story-finished',()=>{if(dialog.open)dialog.close();});

 window.GuidoPerformer={greet,open,close,get pose(){return gestures[lastPose][0]},get state(){return{ready,pose:lastPose,mouth,joints:[...joints],reduced:reduced.matches}},preview(index){forced=index===null?null:Math.max(0,Math.min(11,index))}};
})();
