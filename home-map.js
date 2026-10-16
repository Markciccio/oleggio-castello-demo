const placesMap=document.getElementById('placesMap');
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==placesMap.contentWindow||event.data?.type!=='oleggio-map-height')return;
 const height=Number(event.data.height);
 if(Number.isFinite(height)&&height>=300&&height<=12000)placesMap.style.height=Math.ceil(height)+2+'px';
});

const requestedStage=new URLSearchParams(location.search).get('tappa');
if(requestedStage){const mapUrl=new URL(placesMap.src);mapUrl.searchParams.set('tappa',window.GUIDO_ACTIVE_STAGE.id);placesMap.src=mapUrl.href;}
