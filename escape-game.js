// Stage content is independent of Guido's costume. QR URLs select a stage in any order.
(() => {
  const $=id=>document.getElementById(id),stages=window.GUIDO_STAGES;
  const raw=new URLSearchParams(location.search).get('tappa')||'1';
  const requested=({municipio:'4',castello:'3',parco:'14'})[raw]||raw;
  const stage=stages.find(s=>s.id===requested)||stages[0];
  window.GUIDO_ACTIVE_STAGE=stage;
  const key='oleggio-escape-progress-v2';let progress={},canSave=true;
  try{const saved=JSON.parse(localStorage.getItem(key)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))progress=saved;}catch{canSave=false;}
  // Keep legacy data intact; migrate only stops whose quiz has the same subject.
  try{const old=JSON.parse(localStorage.getItem('oleggio-escape-progress-v1')||'{}');for(const [legacy,id] of [['municipio','4'],['castello','3']]){if(old[legacy]?.completed===true&&!progress[id])progress[id]={...old[legacy],migratedFrom:legacy};}}catch{}
  const completed=s=>progress[s.id]?.completed===true;
  function save(){try{localStorage.setItem(key,JSON.stringify(progress));}catch{canSave=false;}}
  function renderJourney(){
    $('phraseSlots').replaceChildren();
    for(const stop of [...stages].sort((a,b)=>a.slot-b.slot)){
      const slot=document.createElement('span');slot.textContent=completed(stop)?stop.word:'?';slot.classList.toggle('found',completed(stop));slot.setAttribute('aria-label',completed(stop)?`Parola ${stop.slot+1}: ${stop.word}`:`Parola ${stop.slot+1} da scoprire`);$('phraseSlots').append(slot);
    }
    const count=stages.filter(completed).length;
    $('gameProgress').textContent=`${count} di ${stages.length} parole raccolte`;
    const all=count===stages.length;$('finalPhrase').hidden=!all;
    $('finalPhrase').textContent=all?`${[...stages].sort((a,b)=>a.slot-b.slot).map(s=>s.word).join(' ')} — Hai ricomposto la frase! Hai completato tutte le 32 tappe. Ogni luogo custodisce una parte della storia.`:'';
    $('stageLinks').replaceChildren();
    for(const stop of stages){
      const link=document.createElement('a');link.href=`?tappa=${encodeURIComponent(stop.id)}&v=gioco-32-1#tappa-gioco`;
      const label=document.createElement('span');label.textContent=`${completed(stop)?'✓ ':''}${stop.id} · ${stop.title}`;
      const detail=document.createElement('small');detail.textContent=stop.id===stage.id?'Sei in questa tappa':completed(stop)?'Parola già raccolta · puoi riascoltare':'Apri questa tappa';link.append(label,detail);$('stageLinks').append(link);
    }
    $('saveNotice').textContent=canSave?'Le parole restano salvate in questo browser sul tuo telefono.':'Il browser non consente il salvataggio: le parole restano disponibili solo in questa sessione.';
  }
  function showReward(){
    $('wordReward').hidden=false;$('wordReward').replaceChildren();
    const message=document.createElement('span');message.textContent='Hai raccolto una parola della frase:';
    const word=document.createElement('b');word.textContent=stage.word;
    const hint=document.createElement('span');hint.textContent='Scegli un altro luogo sulla mappa e continua: puoi completare le tappe nell’ordine che preferisci.';
    $('wordReward').append(message,word,hint);
    const next=stages.find(s=>!completed(s));if(next){const link=document.createElement('a');link.className='secondary next-stage';link.href='?tappa='+encodeURIComponent(next.id)+'&v=gioco-32-1#tappa-gioco';link.textContent='Prossima tappa da scoprire: '+next.id+' · '+next.title;$('wordReward').append(link);}
  }
  function openQuiz(){
    window.dispatchEvent(new Event('guido-leave-camera'));
    $('quizCard').hidden=false;$('quizQuestion').textContent=stage.question;$('quizAnswers').replaceChildren();$('wordReward').hidden=true;
    $('quizFeedback').textContent=completed(stage)?'Tappa già completata: la tua parola è salvata.':'Ascolta o leggi il racconto, poi scegli la risposta.';
    for(const [index,answer] of stage.answers.entries()){
      const button=document.createElement('button');button.textContent=answer;
      button.onclick=()=>{
        if(index!==stage.correct){button.classList.add('wrong');$('quizFeedback').textContent='Non è la risposta giusta. Ripensa al racconto e riprova.';return;}
        button.classList.add('correct');$('quizFeedback').textContent=stage.explanation;
        progress[stage.id]={completed:true,completedAt:progress[stage.id]?.completedAt||new Date().toISOString()};save();
        for(const choice of $('quizAnswers').children)choice.disabled=true;
        showReward();renderJourney();$('wordReward').scrollIntoView({behavior:'smooth',block:'center'});
      };$('quizAnswers').append(button);
    }
    if(completed(stage)){for(const choice of $('quizAnswers').children)choice.disabled=true;showReward();}
    $('quizCard').scrollIntoView({behavior:'smooth',block:'start'});
  }
  $('stageIntro').textContent='32 luoghi, 32 enigmi. Scegli una tappa e ricomponi la frase nascosta.';$('activeStageTitle').textContent=stage.id+' · '+stage.title;
  $('facadeCard').hidden=stage.id!=='4';$('storyText').textContent=stage.story.text;
  const photo=$('stagePhoto'),point=window.MAPPA_PUNTI.find(p=>p.id===stage.id);photo.hidden=!point?.image;
  if(point?.image){const img=document.createElement('img');img.src='mappa/'+point.image.src;img.alt=point.image.alt;const caption=document.createElement('figcaption');caption.textContent=point.image.caption;photo.append(img,caption);}
  $('listenStory').onclick=()=>{
    if(!window.speechSynthesis){$('listenStatus').textContent='La voce non è disponibile su questo dispositivo: puoi leggere il racconto.';return;}
    if(speechSynthesis.speaking){speechSynthesis.cancel();$('listenStory').textContent='Ascolta il racconto';return;}
    const utterance=new SpeechSynthesisUtterance(stage.story.text);utterance.lang='it-IT';utterance.rate=.9;
    const italian=speechSynthesis.getVoices().find(v=>v.lang==='it-IT');if(italian)utterance.voice=italian;
    $('listenStory').textContent='Ferma la lettura';utterance.onend=()=>{$('listenStory').textContent='Riascolta il racconto';$('homeQuiz').hidden=false;};utterance.onerror=()=>{$('listenStory').textContent='Ascolta il racconto';$('listenStatus').textContent='Lettura interrotta. Puoi continuare con il testo.';};speechSynthesis.speak(utterance);
  };
  window.addEventListener('pagehide',()=>window.speechSynthesis?.cancel());
  $('readQuiz').onclick=openQuiz;$('homeQuiz').onclick=openQuiz;$('cameraQuiz').onclick=openQuiz;
  $('toJourney').onclick=()=>$('journeyCard').scrollIntoView({behavior:'smooth',block:'start'});
  window.addEventListener('guido-story-finished',event=>{
    if(event.detail?.stage!==stage.id)return;
    $('homeQuiz').hidden=false;$('cameraQuiz').hidden=false;
    $('arStatus').textContent='Hai ascoltato la storia. Ora risolvi l’enigma!';
  });
  $('arHud').addEventListener('guido-camera-ready',()=>{$('cameraQuiz').hidden=true;});
  save();renderJourney();
})();
