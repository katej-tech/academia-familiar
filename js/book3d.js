"use strict";
/* ============ LIBRO ABIERTO EN 3D (audiolibros) ============
   Página izquierda = dibujo grande (emoji sobre color); página derecha = el texto, con la frase que se
   está leyendo resaltada en amarillo. Al cambiar de página, la hoja derecha gira sobre el lomo como una
   hoja de verdad. Tocar una frase devuelve su índice para repetirla. Una sola escena WebGL. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

let LIVE=null;
function disposeBook3D(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);if(LIVE.ro)LIVE.ro.disconnect();}catch(e){}
 try{LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});LIVE.renderer.dispose();const c=LIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);}catch(e){}
 LIVE=null;}

const PW=512,PH=640;
function mkCanvas(){const c=document.createElement("canvas");c.width=PW;c.height=PH;return c;}
function drawLeft(cv,page,n,total){
 const c=cv.getContext("2d");
 const g=c.createLinearGradient(0,0,PW,PH);g.addColorStop(0,page.bg||"#BFE3FF");g.addColorStop(1,"#FFFFFF");c.fillStyle=g;c.fillRect(0,0,PW,PH);
 c.font='250px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText(page.e||"📖",PW/2,PH/2-10);
 c.fillStyle="rgba(30,41,59,.55)";c.font='700 28px Fredoka,"Nunito",sans-serif';c.fillText((n+1)+" / "+total,PW/2,PH-34);
 /* sombra del lomo */
 const s=c.createLinearGradient(PW-60,0,PW,0);s.addColorStop(0,"rgba(0,0,0,0)");s.addColorStop(1,"rgba(0,0,0,.22)");c.fillStyle=s;c.fillRect(PW-60,0,60,PH);}
/* devuelve las "runs" (palabras con su caja) para poder resaltar y tocar frases */
function drawRight(cv,page,hi,fs){
 const c=cv.getContext("2d");
 c.fillStyle="#FFFBEF";c.fillRect(0,0,PW,PH);
 const s=c.createLinearGradient(0,0,60,0);s.addColorStop(0,"rgba(0,0,0,.22)");s.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=s;c.fillRect(0,0,60,PH);
 const size=fs||36,lh=Math.round(size*1.45),mx=44,maxW=PW-mx*2;
 c.font='600 '+size+'px Fredoka,"Nunito",sans-serif';c.textBaseline="alphabetic";
 const runs=[];let x=mx,y=70+size;
 const space=c.measureText(" ").width;
 page.s.forEach(function(sent,si){
  sent.split(" ").forEach(function(w,wi){
   const ww=c.measureText(w).width;
   if(x+ww>mx+maxW){x=mx;y+=lh;}
   runs.push({x:x,y:y,w:ww,h:lh,s:si,t:w});x+=ww+space;});});
 /* resaltado detrás del texto */
 runs.forEach(function(r){if(r.s===hi){c.fillStyle="#FDE68A";c.beginPath();const rx=r.x-4,ry=r.y-size+4,rw=r.w+space+2,rh=lh-8;c.rect(rx,ry,rw,rh);c.fill();}});
 c.fillStyle="#1E293B";
 runs.forEach(function(r){c.fillText(r.t,r.x,r.y);});
 return {runs:runs,lh:lh,size:size};}
function fitSize(page){
 /* baja el tamaño de letra si el texto es largo, para que quepa en la hoja */
 const tmp=mkCanvas(),c=tmp.getContext("2d");
 for(let s=40;s>=24;s-=2){c.font='600 '+s+'px Fredoka,"Nunito",sans-serif';
  const mx=44,maxW=PW-mx*2,sp=c.measureText(" ").width;let x=mx,lines=1;
  page.s.forEach(function(se){se.split(" ").forEach(function(w){const ww=c.measureText(w).width;if(x+ww>mx+maxW){x=mx;lines++;}x+=ww+sp;});});
  if(70+s+lines*Math.round(s*1.45)<PH-30)return s;}
 return 24;}

/* pages:[{e,bg,s:[frases]}]; cb(ev,info): "tap" {s} */
function renderBook3D(containerId,pages,cb){
 const el=document.getElementById(containerId);if(!el)return null;
 disposeBook3D();
 const w=el.clientWidth||340,h=el.clientHeight||320;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h,false);
 const cv=renderer.domElement;cv.style.width="100%";cv.style.height="100%";cv.style.display="block";cv.style.touchAction="none";
 el.innerHTML="";el.appendChild(cv);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#5B3A29");
 const camera=new THREE.PerspectiveCamera(34,w/h,.1,60);
 scene.add(new THREE.AmbientLight(0xffffff,1.55));
 const dl=new THREE.DirectionalLight(0xffffff,.7);dl.position.set(2,4,6);scene.add(dl);
 const PWd=2.2,PHt=PWd*PH/PW;
 /* tapa del libro */
 const cover=new THREE.Mesh(new THREE.BoxGeometry(PWd*2+.34,PHt+.3,.14),new THREE.MeshStandardMaterial({color:"#B45309",roughness:.7}));cover.position.z=-.1;scene.add(cover);
 const spine=new THREE.Mesh(new THREE.BoxGeometry(.06,PHt+.1,.06),new THREE.MeshStandardMaterial({color:"#7C2D12"}));spine.position.z=.01;scene.add(spine);
 const cvL=mkCanvas(),cvR=mkCanvas(),cvF=mkCanvas(),cvB=mkCanvas();
 const tL=new THREE.CanvasTexture(cvL),tR=new THREE.CanvasTexture(cvR),tF=new THREE.CanvasTexture(cvF),tB=new THREE.CanvasTexture(cvB);
 [tL,tR,tF,tB].forEach(function(t){t.colorSpace=THREE.SRGBColorSpace;});
 const geo=new THREE.PlaneGeometry(PWd,PHt);
 const left=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:tL}));left.position.set(-PWd/2-.02,0,0);scene.add(left);
 const right=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:tR}));right.position.set(PWd/2+.02,0,0);scene.add(right);
 /* hoja que gira: cara delante = texto viejo, cara de atrás = dibujo nuevo */
 const flip=new THREE.Group();scene.add(flip);flip.visible=false;
 const ff=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:tF}));ff.position.set(PWd/2+.02,0,.012);flip.add(ff);
 const fb=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:tB}));fb.position.set(-PWd/2-.02,0,-.012);fb.rotation.y=Math.PI;
 const fbHold=new THREE.Group();fbHold.add(fb);flip.add(fbHold);
 const total=pages.length;
 const ctx={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,ro:null,cur:0,hi:-1,runs:null,fs:36,flip:null};
 function paintRight(i,hi){ctx.fs=fitSize(pages[i]);const r=drawRight(cvR,pages[i],hi,ctx.fs);ctx.runs=r;tR.needsUpdate=true;}
 function paintLeft(i){drawLeft(cvL,pages[i],i,total);tL.needsUpdate=true;}
 paintLeft(0);paintRight(0,-1);
 function fit(){const t=Math.tan(camera.fov*Math.PI/360);const needW=PWd*2+.7,needH=PHt+.7;const d=Math.max(needH/(2*t),needW/(2*t*camera.aspect))+.2;camera.position.set(0,0,d);camera.lookAt(0,0,0);}
 fit();
 if(window.ResizeObserver){ctx.ro=new ResizeObserver(function(){const nw=el.clientWidth,nh=el.clientHeight;if(nw>0&&nh>0){renderer.setSize(nw,nh,false);camera.aspect=nw/nh;camera.updateProjectionMatrix();fit();}});ctx.ro.observe(el);}
 const rc=new THREE.Raycaster();
 cv.addEventListener("pointerdown",function(e){
  if(ctx.flip)return;
  const r=cv.getBoundingClientRect();rc.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},camera);
  const hit=rc.intersectObject(right,false)[0];if(!hit||!hit.uv||!ctx.runs)return;
  const px=hit.uv.x*PW,py=(1-hit.uv.y)*PH;
  const rr=ctx.runs.runs.find(function(q){return px>=q.x-6&&px<=q.x+q.w+10&&py>=q.y-ctx.runs.size&&py<=q.y+8;});
  if(rr&&cb)cb("tap",{s:rr.s});});
 LIVE=ctx;
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);ctx.t+=.016;
  if(ctx.flip){
   const f=ctx.flip;f.k=Math.min(1,f.k+.035);const e=f.k*f.k*(3-2*f.k);
   flip.rotation.y=-Math.PI*e;flip.position.z=Math.sin(e*Math.PI)*.35;
   if(f.k>=1){ctx.flip=null;flip.visible=false;flip.rotation.y=0;flip.position.z=0;paintLeft(f.to);if(f.done)f.done();}}
  renderer.render(scene,camera);})();
 return{
  /* va a la página i; con hacia delante se anima el giro de la hoja */
  go:function(i,animate){
   if(i<0||i>=total||i===ctx.cur)return;
   const fwd=i===ctx.cur+1&&animate!==false;
   if(fwd){
    /* cara delantera = texto actual; cara trasera = dibujo nuevo */
    drawRight(cvF,pages[ctx.cur],-1,fitSize(pages[ctx.cur]));tF.needsUpdate=true;
    drawLeft(cvB,pages[i],i,total);tB.needsUpdate=true;
    paintRight(i,-1);ctx.cur=i;ctx.hi=-1;
    flip.rotation.y=0;flip.visible=true;ctx.flip={k:0,to:i};
   }else{ctx.cur=i;ctx.hi=-1;paintLeft(i);paintRight(i,-1);}},
  /* resalta la frase s de la página actual */
  hi:function(s){ctx.hi=s;paintRight(ctx.cur,s);},
  page:function(){return ctx.cur;}};}

window.renderBook3D=renderBook3D;
window.disposeBook3D=disposeBook3D;
