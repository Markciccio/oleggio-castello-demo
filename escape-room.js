(() => {
 const $=id=>document.getElementById(id),dialog=$('gameDialog'),puzzles=window.GUIDO_PUZZLES,key='oleggio-escape-digital-v1';
 let state={},canSave=true,active=puzzles.find(p=>p.id===window.GUIDO_ACTIVE_STAGE.id)||puzzles[0];
 const normal=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'');
 try{const saved=JSON.parse(localStorage.getItem(key)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))state=saved;}catch{canSave=false;}
 const entry=()=>state[active.id]||(state[active.id]={code:false,letter:false,hints:0,attempts:0});
 const done=p=>state[p.id]?.letter===true;
 function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{canSave=false;}}
 function showPane(which){$('escapePane').hidden=which!=='escape';$('schoolPane').hidden=which!=='school';$('tabEscape').setAttribute('aria-pressed',String(which==='escape'));$('tabSchool').setAttribute('aria-pressed',String(which==='school'));$('gameDialogTitle').textContent=which==='escape'?'Escape room digitale':'Gioco scuola';}
 function showDialog(){if(!dialog.open)dialog.showModal();}
 function close(){window.GuidoVoice.stopAll();dialog.close();}
 function showSchool(){window.GuidoVoice.stopAll();showPane('school');showDialog();}
 function paintArtifact(p){const target=$('puzzleArtifact');target.replaceChildren();const a=p.artifact;
  for(const image of a.images||[a.image].filter(Boolean)){const img=document.createElement('img');img.src=image;img.alt=p.id==='1'?'Cartolina della chiesina con la scritta sul bordo':image.includes('1973')?'Il cortile nella foto del 1973':'Il cortile nella foto attuale';target.append(img);}
  if(p.id==='1'){const detail=document.createElement('div');detail.className='postcardDetail';const image=document.createElement('img');image.src=a.image;image.alt='Dettaglio della scritta sul bordo superiore della cartolina';detail.append(image);target.append(detail);}
  if(a.caption){const caption=document.createElement('p');caption.className='artifactCaption';caption.textContent=a.caption;target.append(caption);}
  if(a.grid){const table=document.createElement('table');table.className='cipherGrid';const head=document.createElement('tr');for(let i=0;i<=a.grid[0].length;i++){const th=document.createElement('th');th.textContent=i||'';head.append(th);}table.append(head);a.grid.forEach((row,index)=>{const tr=document.createElement('tr');const th=document.createElement('th');th.textContent=index+1;tr.append(th);row.forEach(c=>{const td=document.createElement('td');td.textContent=c;tr.append(td)});table.append(tr)});target.append(table);}
  if(a.code){const code=document.createElement('div');code.className='cipherCode';code.textContent=a.code;target.append(code);}
  if(a.rows){const ul=document.createElement('ul');ul.className='cipherRows';for(const text of a.rows){const li=document.createElement('li');li.textContent=text;ul.append(li)}target.append(ul);}
  if(a.key){const key=document.createElement('p');key.className='cipherKey';key.textContent=a.key;target.append(key);}
 }
 function renderInventory(){const count=puzzles.filter(done).length;$('escapeSummary').textContent=count+' / 32 sigilli raccolti';$('escapeProgress').textContent=count+' di 32 lettere custodite';$('escapeInventory').replaceChildren();
  for(const p of [...puzzles].sort((a,b)=>a.slot-b.slot)){const stamp=document.createElement('span');stamp.className=done(p)?'seal found':'seal';const n=document.createElement('small');n.textContent=String(p.slot+1).padStart(2,'0');const letter=document.createElement('b');letter.textContent=done(p)?p.letter:'◇';stamp.append(n,letter);stamp.setAttribute('aria-label','Sigillo '+(p.slot+1)+(done(p)?': '+p.letter:': da scoprire'));$('escapeInventory').append(stamp);}
  $('escapeFinal').hidden=count!==32;$('escapeSaveNotice').textContent=canSave?'I sigilli restano salvati in questo browser. I progressi del Gioco scuola sono separati.':'Il browser non permette il salvataggio: i sigilli resteranno disponibili durante questa sessione.';
 }
 function renderPuzzle(){const e=entry();$('puzzleSelect').value=active.id;$('puzzleCategory').textContent='Tappa '+active.id+' · '+window.MAPPA_PUNTI.find(p=>p.id===active.id).title;$('puzzleTitle').textContent=active.title;$('puzzlePrompt').textContent=active.prompt;$('puzzleRule').textContent=active.rule;paintArtifact(active);
  $('puzzleAnswer').value=e.code?active.answer:'';$('puzzleAnswer').disabled=e.code;$('puzzleForm').querySelector('button').disabled=e.code;$('puzzleFeedback').textContent=e.code?'La prima serratura è aperta. Ora ricava la lettera.':'';
  $('letterArea').hidden=!e.code;$('letterRule').textContent=active.extract;$('letterAnswer').value=e.letter?active.letter:'';$('letterAnswer').disabled=e.letter;$('letterForm').querySelector('button').disabled=e.letter;
  $('puzzleReward').hidden=!e.letter;$('puzzleReward').textContent=e.letter?'Sigillo '+String(active.slot+1).padStart(2,'0')+' custodito · '+active.letter:'';$('nextPuzzle').hidden=!e.letter;
  $('puzzleHints').replaceChildren();for(const hint of active.hints.slice(0,e.hints)){const li=document.createElement('li');li.textContent=hint;$('puzzleHints').append(li)}$('puzzleHint').disabled=e.hints>=active.hints.length;$('puzzleHint').textContent=e.hints>=active.hints.length?'Hai usato tutti gli indizi':'Chiedi un indizio a Guido · '+e.hints+'/3';
  window.GuidoVoice.bind($('listenPuzzle'),'puzzle-'+active.id,'Ascolta l’enigma con Guido');renderInventory();
 }
 function open(id){window.dispatchEvent(new Event('guido-leave-camera'));active=puzzles.find(p=>p.id===id)||active;showPane('escape');renderPuzzle();showDialog();dialog.scrollTop=0;}
 for(const p of puzzles){const option=document.createElement('option');option.value=p.id;option.textContent=p.id+' · '+window.MAPPA_PUNTI.find(x=>x.id===p.id).title;$('puzzleSelect').append(option);}
 $('puzzleSelect').onchange=()=>{window.GuidoVoice.stopAll();active=puzzles.find(p=>p.id===$('puzzleSelect').value);renderPuzzle();};
 $('puzzleForm').onsubmit=event=>{event.preventDefault();const e=entry();if(e.code)return;e.attempts++;
  if(normal($('puzzleAnswer').value)!==active.answer){$('puzzleFeedback').textContent='La serratura resiste. Controlla il procedimento: puoi chiedere un indizio a Guido.';save();return;}
  e.code=true;save();renderPuzzle();$('letterArea').scrollIntoView({behavior:'smooth',block:'nearest'});$('letterAnswer').focus({preventScroll:true});
 };
 $('letterForm').onsubmit=event=>{event.preventDefault();const e=entry();if(!e.code||e.letter)return;if(normal($('letterAnswer').value)!==active.letter){$('puzzleFeedback').textContent='Il codice era giusto, ma questa lettera non corrisponde alla regola di estrazione.';return;}window.GuidoVoice.stopAll();e.letter=true;e.completedAt=new Date().toISOString();save();renderPuzzle();$('puzzleReward').scrollIntoView({behavior:'smooth',block:'nearest'});};
 $('puzzleHint').onclick=()=>{const e=entry();e.hints=Math.min(active.hints.length,e.hints+1);save();renderPuzzle();};
 $('nextPuzzle').onclick=()=>{const next=puzzles.find(p=>!done(p));if(next){active=next;window.GuidoVoice.stopAll();renderPuzzle();dialog.scrollTop=0;}else $('escapeFinal').scrollIntoView({behavior:'smooth',block:'start'});};
 $('finalForm').onsubmit=event=>{event.preventDefault();if(!puzzles.every(done))return;const phrase=[...puzzles].sort((a,b)=>a.slot-b.slot).map(p=>p.letter).join('');if(normal($('finalAnswer').value)!==phrase){$('finalFeedback').textContent='Il messaggio non coincide con i sigilli: rileggili nell’ordine numerico.';return;}$('finalFeedback').textContent='La memoria vive nelle strade del paese. Hai aperto l’ultima serratura e custodito tutti i 32 sigilli di Guido!';state.finalCompleted=true;save();};
 $('openEscape').onclick=()=>open(active.id);$('openSchool').onclick=showSchool;$('tabEscape').onclick=()=>open(active.id);$('tabSchool').onclick=showSchool;$('closeGameDialog').onclick=close;dialog.addEventListener('cancel',()=>window.GuidoVoice.stopAll());
 window.addEventListener('message',event=>{const map=$('placesMap');if(event.origin!==location.origin||event.source!==map.contentWindow||event.data?.type!=='oleggio-escape-open')return;if(puzzles.some(p=>p.id===event.data.id))open(event.data.id);});
 window.addEventListener('guido-story-finished',event=>{if(dialog.open&&!$('schoolPane').hidden)return;open(event.detail.stage);});
 document.addEventListener('ended',event=>{if(event.target instanceof HTMLVideoElement&&event.target.id!=='fallbackCamera')open(active.id);},true);
 $('cameraQuiz').onclick=()=>open(window.GUIDO_ACTIVE_STAGE.id);$('homeQuiz').onclick=()=>open(window.GUIDO_ACTIVE_STAGE.id);
 window.GuidoVoice.bind($('listenEscapeIntro'),'escape-intro','Ascolta la missione con Guido');
 window.GuidoEscape={open,showSchool};renderInventory();const params=new URLSearchParams(location.search);if(params.get('mode')==='scuola')showSchool();else if(params.get('mode')==='escape')open(params.get('tappa'));
})();
