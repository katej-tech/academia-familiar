"use strict";
/* ============ CLASIFICADOR DE PALABRAS EN 3D (sustantivo · adjetivo · verbo) ============
   Arriba flotan bloques con palabras; abajo hay tres canastas de colores. Se toca un bloque (se
   levanta) y luego la canasta donde va: si acierta, el bloque vuela adentro; si no, se sacude.
   Colores fijos en toda la app: sustantivo azul, adjetivo verde, verbo rojo. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const KINDS={n:{nm:"SUSTANTIVO",sub:"nombra cosas",col:"#3B82F6",dark:"#1D4ED8"},
 a:{nm:"ADJETIVO",sub:"dice cómo es",col:"#22C55E",dark:"#15803D"},
 v:{nm:"VERBO",sub:"dice qué hace",col:"#EF4444",dark:"#B91C1C"}};
let LIVE=null;
function disposeSorter3D(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);if(LIVE.ro)LIVE.ro.disconnect();}catch(e){}
 try{LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});LIVE.renderer.dispose();const c=LIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);}catch(e){}
 LIVE=null;}

function wordTex(txt){
 const cv=document.createElement("canvas");cv.width=320;cv.height=128;const c=cv.getContext("2d");
 c.fillStyle="#FFFFFF";c.fillRect(0,0,320,128);c.strokeStyle="#CBD5E1";c.lineWidth=8;c.strokeRect(4,4,312,120);
 const size=txt.length<=6?60:txt.length<=9?50:txt.length<=12?42:34;
 c.fillStyle="#1E293B";c.font='700 '+size+'px Fredoka,"Nunito",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText(txt,160,70);
 const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}
function labelTex(K){
 const cv=document.createElement("canvas");cv.width=384;cv.height=160;const c=cv.getContext("2d");
 c.fillStyle=K.col;c.fillRect(0,0,384,160);c.fillStyle="rgba(255,255,255,.22)";c.fillRect(0,110,384,50);
 c.fillStyle="#FFFFFF";c.textAlign="center";c.textBaseline="middle";
 c.font='700 56px Fredoka,"Nunito",sans-serif';c.fillText(K.nm,192,58);
 c.font='600 36px Nunito,sans-serif';c.fillText(K.sub,192,134);
 const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}

/* words:[{w:"perro",k:"n"|"a"|"v"}]; cb(ev,info): ok | wrong | select | done
   binsCfg (opcional): lista de canastas [{k,nm,sub,col,dark}]; por defecto sustantivo/adjetivo/verbo */
function renderWordSorter(containerId,words,cb,binsCfg){
 const BL=binsCfg||["n","a","v"].map(function(k){return Object.assign({k:k},KINDS[k]);});
 const el=document.getElementById(containerId);if(!el)return null;
 disposeSorter3D();
 const w=el.clientWidth||340,h=el.clientHeight||320;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h,false);
 const cv=renderer.domElement;cv.style.width="100%";cv.style.height="100%";cv.style.display="block";cv.style.touchAction="none";
 el.innerHTML="";el.appendChild(cv);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#F1F7FF");
 const camera=new THREE.PerspectiveCamera(36,w/h,.1,60);
 scene.add(new THREE.AmbientLight(0xffffff,1.5));
 const dl=new THREE.DirectionalLight(0xffffff,1.0);dl.position.set(2,6,6);scene.add(dl);
 /* canastas */
 const bins={},binList=[];
 const nb=BL.length,sp=Math.min(2.45,7.6/nb),bw=sp-.3;
 BL.forEach(function(K,i){
  const k=K.k,x=(i-(nb-1)/2)*sp,g=new THREE.Group();g.position.set(x,-1.55,0);scene.add(g);
  const base=new THREE.Mesh(new THREE.BoxGeometry(bw,.2,1.1),new THREE.MeshStandardMaterial({color:K.dark,roughness:.6}));base.position.y=-.5;g.add(base);
  [-1,1].forEach(function(sd){const s=new THREE.Mesh(new THREE.BoxGeometry(.12,1,1.1),new THREE.MeshStandardMaterial({color:K.col,roughness:.6}));s.position.set(sd*(bw/2-.05),0,0);g.add(s);});
  const back=new THREE.Mesh(new THREE.BoxGeometry(bw,1,.12),new THREE.MeshStandardMaterial({color:K.col,roughness:.6}));back.position.set(0,0,-.5);g.add(back);
  const front=new THREE.Mesh(new THREE.PlaneGeometry(bw-.1,.84),new THREE.MeshBasicMaterial({map:labelTex(K)}));front.position.set(0,.02,.57);g.add(front);
  const hit=new THREE.Mesh(new THREE.BoxGeometry(bw+.2,1.5,1.4),new THREE.MeshBasicMaterial({visible:false}));hit.position.y=.1;hit.userData.bin=k;g.add(hit);
  bins[k]={x:x,g:g,hit:hit,n:0,flash:0};binList.push(hit);});
 /* bloques de palabras */
 const per=3,blocks=[];
 words.forEach(function(wd,i){
  const r=Math.floor(i/per),c=i%per,cnt=Math.min(per,words.length-r*per);
  const bx=(c-(cnt-1)/2)*2.2,by=1.75-r*1.05;
  const mats=[0,1,2,3,4,5].map(function(){return new THREE.MeshStandardMaterial({color:"#E2E8F0",roughness:.6});});
  mats[4]=new THREE.MeshBasicMaterial({map:wordTex(wd.w)});
  const m=new THREE.Mesh(new THREE.BoxGeometry(1.9,.76,.4),mats);
  m.position.set(bx,by,0);m.userData={k:wd.k,w:wd.w,bx:bx,by:by,lift:0,shake:0,fly:null,done:false};
  scene.add(m);blocks.push(m);});
 const ctx={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,ro:null,sel:null,left:words.length,locked:false};
 const rows=Math.ceil(words.length/per),top=1.75+.6,bottom=-1.55-1.05;
 function fit(){const t=Math.tan(camera.fov*Math.PI/360),needH=top-bottom,needW=Math.max(7.6,nb*sp+.4);const d=Math.max(needH/(2*t),needW/(2*t*camera.aspect))+.3;const cy=(top+bottom)/2;camera.position.set(0,cy,d);camera.lookAt(0,cy,0);}
 fit();
 if(window.ResizeObserver){ctx.ro=new ResizeObserver(function(){const nw=el.clientWidth,nh=el.clientHeight;if(nw>0&&nh>0){renderer.setSize(nw,nh,false);camera.aspect=nw/nh;camera.updateProjectionMatrix();fit();}});ctx.ro.observe(el);}
 function pickWord(b){
  if(ctx.locked||b.userData.done)return;
  if(ctx.sel&&ctx.sel!==b)ctx.sel.userData.lift=0;
  if(ctx.sel===b){b.userData.lift=0;ctx.sel=null;return;}
  ctx.sel=b;b.userData.lift=1;if(cb)cb("select",{w:b.userData.w});}
 function dropIn(k){
  const b=ctx.sel;if(!b||ctx.locked)return;
  const d=b.userData;
  if(d.k===k){d.done=true;d.fly={t:0,from:b.position.clone(),to:new THREE.Vector3(bins[k].x,-1.6,0)};ctx.sel=null;ctx.left--;bins[k].flash=1;
   if(cb)cb("ok",{w:d.w,k:k,left:ctx.left});
   if(ctx.left<=0){ctx.locked=true;setTimeout(function(){if(cb)cb("done",{});},700);}}
  else{d.shake=1;d.lift=0;ctx.sel=null;if(cb)cb("wrong",{w:d.w,k:k,right:d.k});}}
 const rc=new THREE.Raycaster();
 cv.addEventListener("pointerdown",function(e){
  const r=cv.getBoundingClientRect();rc.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},camera);
  const hb=rc.intersectObjects(blocks.filter(function(b){return !b.userData.done;}),false)[0];
  if(hb){pickWord(hb.object);return;}
  const hn=rc.intersectObjects(binList,false)[0];
  if(hn)dropIn(hn.object.userData.bin);});
 LIVE=ctx;
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);ctx.t+=.016;
  blocks.forEach(function(m,i){const d=m.userData;
   if(d.fly){d.fly.t+=.05;const k=Math.min(1,d.fly.t),e=k*k*(3-2*k);m.position.lerpVectors(d.fly.from,d.fly.to,e);m.position.y+=Math.sin(k*Math.PI)*.6;m.scale.setScalar(Math.max(.01,1-k*.6));if(k>=1)m.visible=false;return;}
   const tz=d.lift?.7:0;m.position.z+=(tz-m.position.z)*.2;
   m.position.y=d.by+(d.lift?.15:0)+Math.sin(ctx.t*1.4+i)*.04;
   m.position.x=d.bx+(d.shake>0?Math.sin(ctx.t*60)*.12*d.shake:0);if(d.shake>0)d.shake=Math.max(0,d.shake-.04);
   m.rotation.x=d.lift?-.18:-.05;});
  Object.keys(bins).forEach(function(k){const b=bins[k];if(b.flash>0){b.flash=Math.max(0,b.flash-.05);b.g.scale.setScalar(1+Math.sin(b.flash*Math.PI)*.08);}});
  renderer.render(scene,camera);})();
 return{
  /* toques programáticos (pruebas) */
  pick:function(i){if(blocks[i])pickWord(blocks[i]);},
  drop:function(k){dropIn(k);}};}

window.renderWordSorter=renderWordSorter;
window.disposeSorter3D=disposeSorter3D;
