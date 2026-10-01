// Stage content is independent of Guido's costume. QR URLs select a stage in any order.
(() => {
  const $=id=>document.getElementById(id),stages=window.GUIDO_STAGES;
  const requested=new URLSearchParams(location.search).get('tappa')||'municipio';
  const stage=stages.find(s=>s.id===requested)||stages[0];
  window.GUIDO_ACTIVE_STAGE=stage;
  const key='oleggio-escape-progress-v1';let progress={},canSave=true;
  try{const saved=JSON.parse(localStorage.getItem(key)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))progress=saved;}catch{canSave=false;}
  const completed=s=>progress[s.id]?.completed===true;
  function save(){try{localStorage.setItem(key,JSON.stringify(progress));}catch{canSave=false;}}
  function renderJourney(){
    $('phraseSlots').replaceChildren();
    for(const stop of [...stages].sort((a,b)=>a.slot-b.slot)){
      const slot=document.createElement('span');slot.textContent=completed(stop)?stop.word:'?';slot.classList.toggle('found',completed(stop));slot.setAttribute('aria-label',completed(stop)?`Parola ${stop.slot+1}: ${stop.word}`:`Parola ${stop.slot+1} da scoprire`);$('phraseSlots').append(slot);
    }
    const count=stages.filter(completed).length;
    $('gameProgress').textContent=`${count} di ${stages.length} parole raccolte nella demo`;
    const all=count===stages.length;$('finalPhrase').hidden=!all;
    $('finalPhrase').textContent=all?`${[...stages].sort((a,b)=>a.slot-b.slot).map(s=>s.word).join(' ')} — Hai ricomposto la frase! L’escape room dimostrativa è completa. Ogni luogo custodisce una parte della storia.`:'';
    $('stageLinks').replaceChildren();
    for(const stop of stages){
      const link=document.createElement('a');link.href=`?tappa=${encodeURIComponent(stop.id)}&v=escape-guido-4`;
      const label=document.createElement('span');label.textContent=`${completed(stop)?'✓ ':''}${stop.title}`;
      const detail=document.createElement('small');detail.textContent=stop.id===stage.id?'Sei in questa tappa':completed(stop)?'Parola già raccolta · puoi riascoltare':'Apri questa tappa della demo';link.append(label,detail);$('stageLinks').append(link);
    }
    $('saveNotice').textContent=canSave?'Le parole restano salvate in questo browser sul tuo telefono.':'Il browser non consente il salvataggio: le parole restano disponibili solo in questa sessione.';
  }
  function showReward(){
    $('wordReward').hidden=false;$('wordReward').replaceChildren();
    const message=document.createElement('span');message.textContent='Hai raccolto una parola della frase:';
    const word=document.createElement('b');word.textContent=stage.word;
    const hint=document.createElement('span');hint.textContent='Cerca gli altri cartelli, ascolta le storie e completa gli enigmi. Nessun ordine obbligatorio.';
    $('wordReward').append(message,word,hint);
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
  $('stageTitle').textContent=stage.title;$('stageIntro').textContent=stage.intro;
  $('facadeCard').hidden=stage.id!=='municipio';$('storyText').textContent=stage.story.text;
  $('readQuiz').onclick=openQuiz;$('homeQuiz').onclick=openQuiz;$('cameraQuiz').onclick=openQuiz;
  $('toJourney').onclick=()=>$('journeyCard').scrollIntoView({behavior:'smooth',block:'start'});
  window.addEventListener('guido-story-finished',event=>{
    if(event.detail?.stage!==stage.id)return;
    $('homeQuiz').hidden=false;$('cameraQuiz').hidden=false;
    $('arStatus').textContent='Hai ascoltato la storia. Ora risolvi l’enigma!';
  });
  $('arHud').addEventListener('guido-camera-ready',()=>{$('cameraQuiz').hidden=true;});
  $('arHud').addEventListener('guido-place',()=>{$('cameraQuiz').hidden=true;});
  renderJourney();
})();
