// Keep touch gestures for vertical scrolling; the map has its own +/- controls.
(() => {
 const blockGesture=event=>event.preventDefault();
 for(const name of ['gesturestart','gesturechange','gestureend'])document.addEventListener(name,blockGesture,{passive:false});
 document.addEventListener('touchmove',event=>{if(event.touches.length>1)event.preventDefault();},{passive:false});
 document.addEventListener('wheel',event=>{if(event.ctrlKey)event.preventDefault();},{passive:false});
})();
