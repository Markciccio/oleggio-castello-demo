const svg=document.querySelector('#map'),base=document.querySelector('#base'),pins=document.querySelector('#pins'),routes=document.querySelector('#routes'),select=document.querySelector('#point-list'),card=document.querySelector('#card');
const ns='http://www.w3.org/2000/svg';let layer='clean',vb=[0,0,1800,1255],selected=null;
const shifted={'1':[860,595],'2A':[825,370],'2B':[885,420],'3':[790,310],'3A':[685,365],'4':[940,595],'7A':[480,640],'7B':[545,665],'11':[720,435],'12':[945,490],'12B':[985,660],'18':[880,710],'19':[880,765],'20':[865,815],'22A':[1210,920],'24B':[1200,1140],'17':[130,1110]};
function el(tag,attrs){const e=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e}
function render(){svg.setAttribute('viewBox',vb.join(' '))}
function choose(id,{scroll=false}={}){selected=window.MAPPA_PUNTI.find(p=>p.id===id);select.value=id;document.querySelectorAll('.pin').forEach(p=>p.classList.toggle('active',p.dataset.id===id));card.replaceChildren();routes.replaceChildren();if(!selected)return;const badge=document.createElement('div');badge.className='card-number';badge.textContent='N° '+selected.id;const title=document.createElement('h2');title.textContent=selected.title;const desc=document.createElement('p');desc.className='muted';desc.textContent=selected.description||'Qui inseriremo la storia del luogo, le immagini e le eventuali attività della tappa.';const status=document.createElement('p');status.className='status';status.textContent='Dagli appunti del progetto';const route=document.createElement('p');route.className='muted';route.textContent=selected.route?'Percorso: '+selected.route.title:'Il percorso di questa tappa è ancora da definire.';const notes=document.createElement('p');notes.className='muted source-notes';notes.textContent=selected.notes;const position=document.createElement('p');position.className='position-note';position.textContent=selected.status;card.append(badge,title);
if(selected.image){const figure=document.createElement('figure');figure.className='place-photo';const img=document.createElement('img');img.src=selected.image.src;img.alt=selected.image.alt;img.decoding='async';const caption=document.createElement('figcaption');caption.textContent=selected.image.caption;figure.append(img,caption);card.append(figure)}
card.append(desc);
if(selected.history?.length){const heading=document.createElement('h3');heading.textContent='La storia del luogo';card.append(heading);for(const item of selected.history){const paragraph=document.createElement('p');paragraph.className='muted';paragraph.textContent=item.text+' ';const citation=document.createElement('a');citation.href=item.url;citation.target='_blank';citation.rel='noopener';citation.className='citation';citation.textContent=item.source;paragraph.append(citation);card.append(paragraph)}}
const play=document.createElement('a');play.className='play-stage';play.textContent='Gioca questa tappa →';play.target='_top';const game=new URL(new URLSearchParams(location.search).get('embed')==='1'?'../':'webapp/',location.href);game.searchParams.set('tappa',selected.id);game.searchParams.set('v','gioco-32-1');game.hash='tappa-gioco';play.href=game.href;title.after(play);const listen=document.createElement('button');listen.className='voice-card';window.GuidoVoice.bind(listen,'card-'+selected.id,'Ascolta la scheda con Guido');play.after(listen);card.append(status,notes,position,route);if(selected.route?.points?.length){routes.append(el('polyline',{points:selected.route.points.map(p=>p.join(',')).join(' '),fill:'none',stroke:'#a26845','stroke-width':7,'stroke-dasharray':'12 9'}))}if(scroll)showSelectedCard();}
function showSelectedCard(){
 requestAnimationFrame(()=>{
  card.setAttribute('tabindex','-1');card.focus({preventScroll:true});
  if(new URLSearchParams(location.search).get('embed')==='1'){
   parent.postMessage({type:'oleggio-map-select',height:Math.ceil(document.body.getBoundingClientRect().height),top:card.getBoundingClientRect().top+window.scrollY},location.origin);
  }else card.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 });
}
const leaders=el('g',{'aria-hidden':'true'});pins.append(leaders);
for(const p of window.MAPPA_PUNTI){const opt=document.createElement('option');opt.value=p.id;opt.textContent='N° '+p.id+' · '+p.title;select.append(opt);const [x,y]=shifted[p.id]||[p.x,p.y];if(shifted[p.id])leaders.append(el('line',{x1:p.x,y1:p.y,x2:x,y2:y,class:'leader'}));const g=el('g',{class:'pin',role:'button',tabindex:0,'aria-label':'Apri la scheda '+p.id+': '+p.title,transform:`translate(${x} ${y})`,'data-id':p.id});g.append(el('circle',{r:26}));const tooltip=el('title',{});tooltip.textContent=p.id+' · '+p.title;g.append(tooltip);const t=el('text',{'text-anchor':'middle','dominant-baseline':'central'});t.textContent=p.id;g.append(t);g.addEventListener('click',()=>choose(p.id,{scroll:true}));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(p.id,{scroll:true})}});pins.append(g)}
select.addEventListener('change',()=>{if(layer==='history')setLayer('clean');choose(select.value,{scroll:true})});
function reset(){vb=layer==='history'?[0,0,1368,1824]:[0,0,1800,1255];render()}
function setLayer(value){layer=value;base.setAttribute('href',value==='history'?'assets/mappa-storica.jpeg':'assets/mappa.svg');base.setAttribute('width',value==='history'?1368:1800);base.setAttribute('height',value==='history'?1824:1255);pins.style.display=value==='history'?'none':'';routes.style.display=value==='history'?'none':'';document.querySelectorAll('[data-layer]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.layer===value));reset()}
document.querySelectorAll('[data-layer]').forEach(b=>b.addEventListener('click',()=>setLayer(b.dataset.layer)));
function zoom(f){const full=layer==='history'?1368:1800;if(vb[2]*f<full*.20||vb[2]*f>full*1.4)return;vb=[vb[0]+vb[2]*(1-f)/2,vb[1]+vb[3]*(1-f)/2,vb[2]*f,vb[3]*f];render()}
document.querySelector('#plus').onclick=()=>zoom(.75);document.querySelector('#minus').onclick=()=>zoom(1.333333);document.querySelector('#reset').onclick=reset;
const initialPoint=new URLSearchParams(location.search).get("tappa");if(initialPoint&&window.MAPPA_PUNTI.some(p=>p.id===initialPoint))choose(initialPoint);

if(new URLSearchParams(location.search).get('embed')==='1'){
 document.documentElement.classList.add('embedded');
 let previousHeight=0;
 const reportSize=()=>{const height=Math.ceil(document.body.getBoundingClientRect().height);if(height!==previousHeight){previousHeight=height;parent.postMessage({type:'oleggio-map-height',height},location.origin)}};
 new ResizeObserver(reportSize).observe(document.body);reportSize();
}

window.GuidoVoice.bind(document.getElementById('listenMap'),'intro','Ascolta Guido');
