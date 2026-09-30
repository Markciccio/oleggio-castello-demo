// Track the room's visual motion using multiple corners and a robust similarity fit.
// This is a camera demo, not semantic object recognition or persistent 3D SLAM.
(() => {
  const hud=document.getElementById('arHud'),video=document.getElementById('fallbackCamera');
  const guide=document.getElementById('guideAnchor'),status=document.getElementById('arStatus');
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
  const W=256, R=3;let active=false,previous=null,points=[],anchor=null,display=null,reference=null;
  let lastFrame=0,lastRender=0,lastRecovery=0,lostAt=0,pose=null,lastPose=null,generation=0;
  let worldRay=null,focal=0,filteredAngles=null,sceneScale=1,sceneAngle=0,lastVisualMotion=0;
  const difference=(a,b)=>((a-b+540)%360)-180;
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  window.addEventListener('deviceorientation',e=>{
    if(!Number.isFinite(e.alpha)||!Number.isFinite(e.beta)||!Number.isFinite(e.gamma))return;
    const now=performance.now();
    if(!filteredAngles)filteredAngles={a:e.alpha,b:e.beta,g:e.gamma,time:now};
    const blend=(lostAt||lastVisualMotion>.3)?1:1-Math.exp(-Math.min(100,now-filteredAngles.time)/45);
    for(const [key,value] of [['a',e.alpha],['b',e.beta],['g',e.gamma]])filteredAngles[key]+=difference(value,filteredAngles[key])*blend;
    filteredAngles.time=now;
    const a=filteredAngles.a*Math.PI/180,b=filteredAngles.b*Math.PI/180,g=filteredAngles.g*Math.PI/180;
    const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b),cg=Math.cos(g),sg=Math.sin(g);
    const right=[ca*cg-sa*sb*sg,sa*cg+ca*sb*sg,-cb*sg];
    const up=[-sa*cb,ca*cb,sb];
    const forward=[-ca*sg-sa*sb*cg,-sa*sg+ca*sb*cg,-cb*cg];
    const rotation=(screen.orientation?.angle||0)*Math.PI/180,c=Math.cos(rotation),r=Math.sin(rotation);
    pose={right:right.map((v,i)=>v*c+up[i]*r),up:up.map((v,i)=>v*c-right[i]*r),forward,time:now};
  },{passive:true});
  const freshPose=()=>pose&&performance.now()-pose.time<800?pose:null;
  function rayAt(point,current){const nx=(point.x-W/2)/focal,ny=(canvas.height/2-point.y)/focal;
    return current.forward.map((v,i)=>v+current.right[i]*nx+current.up[i]*ny);}
  function projectRay(ray,current){const depth=dot(ray,current.forward);if(depth<.05)return{x:-W*4,y:anchor.y,behind:true};
    return{x:W/2+focal*dot(ray,current.right)/depth,y:canvas.height/2-focal*dot(ray,current.up)/depth};}
  function rememberPose(){const current=freshPose();if(current){worldRay=rayAt(anchor,current);lastPose=current;}}
  function capture(){
    if(video.readyState<2||!video.videoWidth)return null;
    const H=Math.round(W*innerHeight/innerWidth);canvas.width=W;canvas.height=H;
    const ratio=innerWidth/innerHeight;let sw=video.videoWidth,sh=video.videoHeight,sx=0,sy=0;
    if(sw/sh>ratio){sw=sh*ratio;sx=(video.videoWidth-sw)/2;}else{sh=sw/ratio;sy=(video.videoHeight-sh)/2;}
    ctx.drawImage(video,sx,sy,sw,sh,0,0,W,H);const rgba=ctx.getImageData(0,0,W,H).data;
    const gray=new Float32Array(W*H);for(let i=0;i<gray.length;i++)gray[i]=(rgba[i*4]*77+rgba[i*4+1]*150+rgba[i*4+2]*29)/256;
    const pyramid=[{data:gray,w:W,h:H}];
    for(let level=1;level<3;level++){const a=pyramid[level-1],w=Math.floor(a.w/2),h=Math.floor(a.h/2),data=new Float32Array(w*h);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*2*a.w+x*2;data[y*w+x]=(a.data[i]+a.data[i+1]+a.data[i+a.w]+a.data[i+a.w+1])*.25;}
      pyramid.push({data,w,h});}
    return pyramid;
  }
  function sample(im,x,y){const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,i=iy*im.w+ix;
    return im.data[i]*(1-fx)*(1-fy)+im.data[i+1]*fx*(1-fy)+im.data[i+im.w]*(1-fx)*fy+im.data[i+im.w+1]*fx*fy;}
  function inside(im,x,y,margin=5){return x>=margin&&y>=margin&&x<im.w-margin-1&&y<im.h-margin-1;}
  function corners(im,existing=[]){
    const candidates=[];
    for(let y=24;y<im.h-24;y+=3)for(let x=24;x<im.w-24;x+=3){let xx=0,xy=0,yy=0;
      for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const i=(y+dy)*im.w+x+dx,gx=(im.data[i+1]-im.data[i-1])*.5,gy=(im.data[i+im.w]-im.data[i-im.w])*.5;xx+=gx*gx;xy+=gx*gy;yy+=gy*gy;}
      const score=(xx+yy-Math.sqrt((xx-yy)**2+4*xy*xy))/50;
      if(score>25)candidates.push({x,y,score});}
    candidates.sort((a,b)=>b.score-a.score);const selected=[...existing];
    for(const p of candidates){if(selected.length>=32)break;if(selected.every(q=>Math.hypot(q.x-p.x,q.y-p.y)>18))selected.push(p);}
    return selected;
  }
  function flow(from,to,point){let dx=0,dy=0,error=Infinity;
    for(let level=2;level>=0;level--){if(level!==2){dx*=2;dy*=2;}const a=from[level],b=to[level],scale=2**level,x=point.x/scale,y=point.y/scale;
      if(!inside(a,x,y))return null;
      const values=[],gx=[],gy=[];let xx=0,xy=0,yy=0;
      for(let oy=-R;oy<=R;oy++)for(let ox=-R;ox<=R;ox++){values.push(sample(a,x+ox,y+oy));const ix=(sample(a,x+ox+1,y+oy)-sample(a,x+ox-1,y+oy))*.5,iy=(sample(a,x+ox,y+oy+1)-sample(a,x+ox,y+oy-1))*.5;gx.push(ix);gy.push(iy);xx+=ix*ix;xy+=ix*iy;yy+=iy*iy;}
      const det=xx*yy-xy*xy;if(det<1)return null;
      for(let iteration=0;iteration<8;iteration++){
        if(!inside(b,x+dx,y+dy))return null;const observed=[];let mean=0,k=0;
        for(let oy=-R;oy<=R;oy++)for(let ox=-R;ox<=R;ox++){const v=sample(b,x+dx+ox,y+dy+oy);observed.push(v);mean+=v-values[k++];}mean/=values.length;
        let bx=0,by=0;error=0;for(let i=0;i<values.length;i++){const residual=values[i]-observed[i]+mean;bx+=gx[i]*residual;by+=gy[i]*residual;error+=Math.abs(residual);}error/=values.length;
        const ux=(yy*bx-xy*by)/det,uy=(xx*by-xy*bx)/det;if(Math.abs(ux)>5||Math.abs(uy)>5)return null;dx+=ux;dy+=uy;if(ux*ux+uy*uy<.0004)break;
      }
    }
    return error<14?{x:point.x+dx,y:point.y+dy,error}:null;
  }
  function track(from,to,list){const pairs=[];
    for(const p of list){const q=flow(from,to,p);if(!q)continue;const back=flow(to,from,q);if(!back||Math.hypot(back.x-p.x,back.y-p.y)>.9)continue;pairs.push({p,q});}return pairs;
  }
  const apply=(t,p)=>({x:t.a*p.x-t.b*p.y+t.x,y:t.b*p.x+t.a*p.y+t.y});
  function fit(pairs){
    if(pairs.length<4)return null;let best=[];
    // Deterministic pair sampling makes the consensus reproducible for debugging.
    for(let i=0;i<pairs.length;i++)for(let j=i+1;j<pairs.length;j+=Math.max(1,Math.floor(pairs.length/8))){const u=pairs[i],v=pairs[j],px=v.p.x-u.p.x,py=v.p.y-u.p.y,qx=v.q.x-u.q.x,qy=v.q.y-u.q.y,den=px*px+py*py;if(den<400)continue;
      const a=(px*qx+py*qy)/den,b=(px*qy-py*qx)/den,t={a,b,x:u.q.x-a*u.p.x+b*u.p.y,y:u.q.y-b*u.p.x-a*u.p.y};
      const group=pairs.filter(({p,q})=>{const r=apply(t,p);return Math.hypot(r.x-q.x,r.y-q.y)<1.4;});if(group.length>best.length)best=group;
    }
    if(best.length<4||best.length<pairs.length*.5)return null;
    let px=0,py=0,qx=0,qy=0;for(const {p,q} of best){px+=p.x;py+=p.y;qx+=q.x;qy+=q.y;}const n=best.length;px/=n;py/=n;qx/=n;qy/=n;
    let den=0,dot=0,cross=0;for(const {p,q} of best){const ux=p.x-px,uy=p.y-py,vx=q.x-qx,vy=q.y-qy;den+=ux*ux+uy*uy;dot+=ux*vx+uy*vy;cross+=ux*vy-uy*vx;}
    if(den<100)return null;const a=dot/den,b=cross/den;
    return {a,b,x:qx-a*px+b*py,y:qy-b*px-a*py,pairs:best};
  }
  function remember(frame,list){return {frame,anchor:{...anchor},scale:sceneScale,angle:sceneAngle,points:list.slice(0,12).map(p=>({...p}))};}
  function start(frame){
    points=corners(frame[0]);if(points.length<6){status.textContent='Inquadra una sedia, un quadro o un altro oggetto ben visibile.';return false;}
    const h=frame[0].h;const central=[...points].sort((a,b)=>Math.hypot(a.x-W*.5,a.y-h*.55)-Math.hypot(b.x-W*.5,b.y-h*.55))[0];
    focal=frame[0].h/(2*Math.tan(Math.PI/6));anchor={x:central.x,y:central.y};display={...anchor};rememberPose();reference=remember(frame,points);previous=frame;lastPose=freshPose();guide.hidden=false;guide.classList.remove('seeking');status.textContent='Guido è qui. Muovi lentamente il telefono.';hud.dispatchEvent(new Event('guido-anchored'));return true;
  }
  function recovery(frame){
    if(!reference)return false;
    const pairs=track(reference.frame,frame,reference.points),t=fit(pairs);
    if(!t||t.pairs.length<5)return false;const recovered=apply(t,reference.anchor);
    anchor=recovered;sceneScale=reference.scale*Math.hypot(t.a,t.b);sceneAngle=reference.angle+Math.atan2(t.b,t.a);previous=frame;points=corners(frame[0],t.pairs.map(v=>v.q));lostAt=0;rememberPose();guide.classList.remove('seeking');return true;
  }
  function updateSensors(t){
    const current=freshPose();
    if(current&&lastPose){const angle=Math.acos(Math.min(1,Math.max(-1,dot(current.forward,lastPose.forward))));
      if(angle>.004&&angle<.08){const predicted=projectRay(lastPose.forward,current),observed=apply(t,{x:W/2,y:canvas.height/2});
        const predictedMotion=Math.hypot(predicted.x-W/2,predicted.y-canvas.height/2),observedMotion=Math.hypot(observed.x-W/2,observed.y-canvas.height/2);
        if(predictedMotion>.5&&observedMotion>.5){const ratio=observedMotion/predictedMotion;if(ratio>.5&&ratio<2)focal=Math.max(W*.6,Math.min(canvas.height*2,focal*(1+(ratio-1)*.15)));}
      }
    }
    rememberPose();
  }
  function estimate(){
    if(!anchor)return null;const current=freshPose();
    if(current&&worldRay){const projected=projectRay(worldRay,current);
      // While visual tracking is healthy, sensors predict only small between-frame movement.
      if(lostAt)return projected;
      if(lastVisualMotion>.3&&Math.hypot(projected.x-anchor.x,projected.y-anchor.y)<W*.3)return projected;
    }
    return {...anchor};
  }
  function render(now){
    const p=estimate();if(!p||!display)return;const dt=Math.min(40,Math.max(1,now-lastRender));lastRender=now;
    const d=Math.hypot(p.x-display.x,p.y-display.y);if(d>.13){const blend=1-Math.exp(-dt/((lastVisualMotion>.3||lostAt)?12:45));display.x+=(p.x-display.x)*blend;display.y+=(p.y-display.y)*blend;}
    guide.style.left=`${display.x/W*100}%`;guide.style.top=`${display.y/canvas.height*100}%`;
    guide.style.transform=`translate(-50%,-70%) rotate(${sceneAngle*180/Math.PI}deg) scale(${Math.max(.5,Math.min(2,sceneScale))})`;
    const halfWidth=Math.min(innerWidth*.48,260)*Math.max(.5,Math.min(2,sceneScale))/2/innerWidth*W;
    const offscreen=display.x<-halfWidth||display.x>W+halfWidth||display.y<-canvas.height*.1||display.y>canvas.height*1.4;
    guide.hidden=offscreen;
    const confidentlyEstimated=lostAt&&worldRay&&freshPose();
    guide.classList.toggle('seeking',!!lostAt&&!confidentlyEstimated);
    if(offscreen)status.textContent='Guido è fuori campo. Torna verso il punto iniziale.';
    else if(lostAt)status.textContent='Ritorna verso il punto dove è apparso Guido.';
    else status.textContent='Guido è qui.';
    window.guidoDebug={x:display.x/W*innerWidth,y:display.y/canvas.height*innerHeight,tracking:!lostAt,offscreen,features:points.length,hidden:guide.hidden||guide.classList.contains('seeking')};
  }
  function tick(now){
    requestAnimationFrame(tick);if(!active)return;render(now);
    if(now-lastFrame<40)return;lastFrame=now;const frame=capture();if(!frame)return;
    if(!anchor){start(frame);return;}
    if(lostAt){if(now-lastRecovery>500){lastRecovery=now;recovery(frame);}return;}
    const pairs=track(previous,frame,points),t=fit(pairs);
    if(!t||Math.hypot(t.a,t.b)<.85||Math.hypot(t.a,t.b)>1.18||Math.abs(t.b)>.2){lostAt=now;return;}
    const centre=apply(t,{x:W/2,y:canvas.height/2});const motion=Math.hypot(centre.x-W/2,centre.y-canvas.height/2);lastVisualMotion=motion+Math.abs(t.a-1)*W+Math.abs(t.b)*W;
    if(motion>.08||Math.abs(t.a-1)>.0005||Math.abs(t.b)>.0005){anchor=apply(t,anchor);sceneScale*=Math.hypot(t.a,t.b);sceneAngle+=Math.atan2(t.b,t.a);}
    updateSensors(t);previous=frame;points=corners(frame[0],t.pairs.map(v=>v.q));
    // Refresh reference while anchored and visible, preserving the current world point.
    if(now-lastRecovery>1500&&anchor.x>0&&anchor.x<W&&anchor.y>0&&anchor.y<canvas.height){reference=remember(frame,points);lastRecovery=now;}
  }
  hud.addEventListener('guido-camera-ready',()=>{generation++;active=false;previous=null;points=[];anchor=null;display=null;reference=null;lostAt=0;lastFrame=0;lastRecovery=0;worldRay=null;focal=0;lastPose=null;filteredAngles=null;sceneScale=1;sceneAngle=0;lastVisualMotion=0;guide.hidden=true;});
  hud.addEventListener('guido-place',()=>{generation++;active=true;previous=null;points=[];anchor=null;display=null;reference=null;lostAt=0;worldRay=null;lastPose=null;sceneScale=1;sceneAngle=0;lastVisualMotion=0;guide.hidden=true;});
  hud.addEventListener('guido-close',()=>{generation++;active=false;anchor=null;previous=null;guide.hidden=true;window.guidoDebug=null;});
  requestAnimationFrame(tick);
})();