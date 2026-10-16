const placesMap=document.getElementById('placesMap');
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==placesMap.contentWindow||!['oleggio-map-height','oleggio-map-select'].includes(event.data?.type))return;
 const height=Number(event.data.height);
 if(Number.isFinite(height)&&height>=300&&height<=12000)placesMap.style.height=Math.ceil(height)+2+'px';
 if(event.data.type==='oleggio-map-select'){
  const top=Number(event.data.top);
  if(Number.isFinite(top)&&top>=0&&top<height){
   requestAnimationFrame(()=>window.scrollTo({top:Math.max(0,window.scrollY+placesMap.getBoundingClientRect().top+top-16),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  }
 }
});

const requestedStage=new URLSearchParams(location.search).get('tappa');
if(requestedStage){const mapUrl=new URL(placesMap.src);mapUrl.searchParams.set('tappa',window.GUIDO_ACTIVE_STAGE.id);placesMap.src=mapUrl.href;}
