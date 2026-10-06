"use strict";
/* ============ BLOQUES DE SÍLABAS EN 3D (arma la palabra) ============
   Arriba hay casillas vacías (una por sílaba) y abajo bloques con las sílabas REVUELTAS.
   El niño escucha la palabra (no se le muestra escrita) y toca los bloques en orden: cada bloque
   vuela a la siguiente casilla; tocar uno ya colocado lo devuelve. Al llenar todas las casillas
   se avisa con cb("full",{order:[...]}) y el juego decide si está bien (reset() / celebrate()). */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

let LIVE=null;
function disposeSyl3D(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);if(LIVE.ro)LIVE.ro.disconnect();}catch(e){}
 try{LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});LIVE.renderer.dispose();const c=LIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);}catch(e){}
 LIVE=null;}

function faceTex(txt,base){
 const cv=document.createElement("canvas");cv.width=256;cv.height=160;const c=cv.getContext("2d");
 c.fillStyle=base;c.fillRect(0,0,256,160);
 c.strokeStyle="rgba(255,255,255,.5)";c.lineWidth=8;c.strokeRect(8,8,240,144);
 let size=txt.length<=2?104:txt.length===3?88:txt.length===4?72:60;
 c.font='700 '+size+'px Fredoka,"Nunito",sans-serif';
 while(size>26&&c.measureText(txt).width>212){size-=3;c.font='700 '+size+'px Fredoka,"Nunito",sans-serif';} /* palabras largas (oraciones) caben en el bloque */
 c.fillStyle="#FFFFFF";c.textAlign="center";c.textBaseline="middle";c.fillText(txt,128,88);
 const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}
function shuf(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;}

/* parts: sílabas en el orden CORRECTO (se revuelven aquí). cb(ev,info) */
function renderSyllableBuilder(containerId,parts,cb){
 const el=document.getElementById(containerId);if(!el)return null;
 disposeSyl3D();
 const w=el.clientWidth||340,h=el.clientHeight||300;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h,false);
 const cv=renderer.domElement;cv.style.width="100%";cv.style.height="100%";cv.style.display="block";cv.style.touchAction="none";
 el.innerHTML="";el.appendChild(cv);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#FFF7E6");
 const camera=new THREE.PerspectiveCamera(36,w/h,.1,60);
 scene.add(new THREE.AmbientLight(0xffffff,1.45));
 const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(2,5,6);scene.add(dl);
 const n=parts.length,bw=1.22,gapX=.22,pitch=bw+gapX;
 const perRow=Math.min(n,4),rows=Math.ceil(n/perRow);
 const slotsY=1.15,traysY0=-.55;
 /* casillas de arriba */
 const slots=[];
 for(let i=0;i<n;i++){
  const x=(i-(n-1)/2)*pitch;
  const s=new THREE.Mesh(new THREE.BoxGeometry(bw,.96,.12),new THREE.MeshStandardMaterial({color:"#E2E8F0",roughness:.9}));
  s.position.set(x,slotsY,-.2);scene.add(s);slots.push({x:x,y:slotsY,mesh:s,block:null});}
 /* bloques revueltos (siempre distinto al orden correcto) */
 let order=shuf(parts.map(function(_,i){return i;}));
 if(n>1&&order.every(function(v,k){return v===k;}))order.reverse();
 const cols=["#3B82F6","#F97316","#22C55E","#A855F7","#EF4444","#0EA5E9","#EAB308"];
 const blocks=[];
 order.forEach(function(pi,k){
  const base=cols[pi%cols.length];
  const mats=[0,1,2,3,4,5].map(function(){return new THREE.MeshStandardMaterial({color:base,roughness:.5});});
  mats[4]=new THREE.MeshBasicMaterial({map:faceTex(parts[pi],base)});
  const m=new THREE.Mesh(new THREE.BoxGeometry(bw,.9,.5),mats);
  const r=Math.floor(k/perRow),c=k%perRow,cnt=Math.min(perRow,n-r*perRow);
  const hx=(c-(cnt-1)/2)*pitch,hy=traysY0-r*1.1;
  m.position.set(hx,hy,0);
  m.userData={idx:pi,hx:hx,hy:hy,tx:hx,ty:hy,slot:-1,pop:0,shake:0,ok:false};
  scene.add(m);blocks.push(m);});
 const ctx={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,ro:null,locked:false,celebrate:0};
 const needH=slotsY+.7-(traysY0-(rows-1)*1.1-.7),needW=Math.max(n,perRow)*pitch+.4,cy=(slotsY+.7+(traysY0-(rows-1)*1.1-.7))/2;
 function fit(){const t=Math.tan(camera.fov*Math.PI/360);const d=Math.max(needH/(2*t),needW/(2*t*camera.aspect))+.4;camera.position.set(0,cy,d);camera.lookAt(0,cy,0);}
 fit();
 if(window.ResizeObserver){ctx.ro=new ResizeObserver(function(){const nw=el.clientWidth,nh=el.clientHeight;if(nw>0&&nh>0){renderer.setSize(nw,nh,false);camera.aspect=nw/nh;camera.updateProjectionMatrix();fit();}});ctx.ro.observe(el);}
 const rc=new THREE.Raycaster();
 function filled(){return slots.filter(function(s){return s.block;}).length;}
 cv.addEventListener("pointerdown",function(e){
  if(ctx.locked)return;
  const r=cv.getBoundingClientRect();rc.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},camera);
  const hit=rc.intersectObjects(blocks,false)[0];if(!hit)return;
  pickBlock(hit.object);
 });
 function pickBlock(b){
  const d=b.userData;
  if(d.slot>=0){slots[d.slot].block=null;d.slot=-1;d.tx=d.hx;d.ty=d.hy;if(cb)cb("undo",{});return;}
  const free=slots.findIndex(function(s){return !s.block;});if(free<0)return;
  slots[free].block=b;d.slot=free;d.tx=slots[free].x;d.ty=slots[free].y;
  if(cb)cb("place",{syl:parts[d.idx]});
  if(filled()===n){ctx.locked=true;if(cb)cb("full",{order:slots.map(function(s){return s.block.userData.idx;})});}}
 LIVE=ctx;
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);ctx.t+=.016;
  blocks.forEach(function(m,i){const d=m.userData;
   m.position.x+=(d.tx-m.position.x)*.22;m.position.y+=(d.ty-m.position.y)*.22;
   const zt=d.slot>=0?.1:0;m.position.z+=(zt-m.position.z)*.2;
   let sx=0;if(d.shake>0){sx=Math.sin(ctx.t*60)*.09*d.shake;d.shake=Math.max(0,d.shake-.035);}
   m.position.x+=sx;
   if(ctx.celebrate>0&&d.slot>=0){m.position.y=d.ty+Math.abs(Math.sin(ctx.t*7+d.slot))*.28;}
   m.rotation.x=-.06;m.rotation.y=d.slot>=0?0:Math.sin(ctx.t*1.2+i)*.05;});
  if(ctx.celebrate>0)ctx.celebrate-=.016;
  renderer.render(scene,camera);})();
 return{
  /* devuelve todos los bloques a la bandeja (tras un error) */
  reset:function(){slots.forEach(function(s){s.block=null;});blocks.forEach(function(m){const d=m.userData;d.slot=-1;d.tx=d.hx;d.ty=d.hy;d.shake=1;});ctx.locked=false;},
  celebrate:function(){ctx.celebrate=2.2;blocks.forEach(function(m){m.material.forEach(function(mm,i){if(i!==4)mm.color.set("#22C55E");});});},
  lock:function(v){ctx.locked=!!v;},
  /* toque programático de la sílaba idx (usado en pruebas) */
  tap:function(idx){if(ctx.locked)return;const b=blocks.find(function(m){return m.userData.idx===idx;});if(b)pickBlock(b);}};}

window.renderSyllableBuilder=renderSyllableBuilder;
window.disposeSyl3D=disposeSyl3D;
