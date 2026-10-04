"use strict";
/* ============ LÓGICA VISUAL EN 3D (motor Three.js) ============
   Cuatro escenas para los juegos de js/logic.js:
   - render3DPuzzle: filas de figuras 3D con un hueco "?" y opciones que se tocan (patrones y matrices).
   - render3DStack: torre de cubos que se gira con el dedo, con botón "ver desde arriba".
   - render3DScales: balanzas con frutas (sprites de emoji) que se inclinan hasta equilibrarse.
   Un solo contexto WebGL a la vez; dispose3DLogic() se llama desde stopGames(). */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

let LIVE=null;
function disposeLogic3D(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);if(LIVE.ro)LIVE.ro.disconnect();}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});
  LIVE.renderer.dispose();const c=LIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);
 }catch(e){}
 LIVE=null;}

function baseScene(el,bg,fov){
 const w=el.clientWidth||340,h=el.clientHeight||300;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h,false);
 const cv=renderer.domElement;cv.style.width="100%";cv.style.height="100%";cv.style.display="block";cv.style.touchAction="none";
 el.innerHTML="";el.appendChild(cv);
 const scene=new THREE.Scene();scene.background=new THREE.Color(bg||"#EAF3FF");
 const camera=new THREE.PerspectiveCamera(fov||38,w/h,.1,80);
 scene.add(new THREE.AmbientLight(0xffffff,1.35));
 const dl=new THREE.DirectionalLight(0xffffff,1.3);dl.position.set(3,6,5);scene.add(dl);
 const ctx={renderer:renderer,scene:scene,camera:camera,el:el,raf:null,t:0,ro:null,onResize:null};
 if(window.ResizeObserver){ctx.ro=new ResizeObserver(function(){const nw=el.clientWidth,nh=el.clientHeight;if(nw>0&&nh>0){renderer.setSize(nw,nh,false);camera.aspect=nw/nh;camera.updateProjectionMatrix();if(ctx.onResize)ctx.onResize();}});ctx.ro.observe(el);}
 return ctx;}
function visWidth(ctx,dist){return 2*Math.tan(ctx.camera.fov*Math.PI/360)*dist*ctx.camera.aspect;}
function visHeight(ctx,dist){return 2*Math.tan(ctx.camera.fov*Math.PI/360)*dist;}

function emojiTex(e){
 const cv=document.createElement("canvas");cv.width=cv.height=128;const c=cv.getContext("2d");
 c.font='92px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText(e,64,70);
 const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}
function emojiSprite(e,s){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTex(e),transparent:true}));m.scale.set(s,s,1);return m;}

/* ---------- figuras ---------- */
function shapeGroup(shape,color,size){
 const p=window.P3D,g=new THREE.Group(),s=size||1,o={o:.05};
 if(shape==="esfera")p.mk(g,p.SPH(.42,24,18),color,[0,0,0],s,null,o);
 else if(shape==="cubo")p.mk(g,p.BOX(.68,.68,.68),color,[0,0,0],s,[.35,.4,0],o);
 else if(shape==="cono")p.mk(g,p.CON(.4,.82,24),color,[0,-.04,0],s,null,o);
 else if(shape==="anillo")p.mk(g,new THREE.TorusGeometry(.32,.13,14,28),color,[0,0,0],s,null,o);
 else if(shape==="estrella")p.mk(g,p.starGeo(.5,.22),color,[0,0,0],s*.95,null,o);
 else if(shape==="piramide")p.mk(g,new THREE.TetrahedronGeometry(.5),color,[0,.02,0],s,[.3,0,0],o);
 else p.mk(g,p.CYL(.3,.3,.7,24),color,[0,0,0],s,null,o);
 return g;}

/* ---------- PUZZLE: filas de figuras + opciones ---------- */
/* cfg:{rows:[[item|null,...]],options:[item],onPick(i)}  item:{shape,color,size} */
function render3DPuzzle(containerId,cfg){
 const el=document.getElementById(containerId);if(!el)return null;
 disposeLogic3D();
 const ctx=baseScene(el,"#EAF3FF",36);const scene=ctx.scene,camera=ctx.camera;
 const rows=cfg.rows,nr=rows.length,nc=Math.max.apply(null,rows.map(function(r){return r.length;}));
 const spinners=[],hits=[],slotPos={};
 const root=new THREE.Group();scene.add(root);
 const optRow=new THREE.Group();root.add(optRow);
 /* medidas: con 1 fila (patrón) las figuras son más grandes que en la matriz 3x3 */
 const cell=nr===1?1.18:1.05,rowGap=nr===1?0:1.05;
 const top=nr===1?1.05:(nr-1)/2*rowGap+.9;
 rows.forEach(function(row,r){
  row.forEach(function(it,c){
   const x=(c-(row.length-1)/2)*cell,y=top-r*rowGap;
   const plate=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.06,28),new THREE.MeshStandardMaterial({color:"#FFFFFF",roughness:.8}));plate.position.set(x,y-.42,0);root.add(plate);
   if(it){const g=shapeGroup(it.shape,it.color,it.size);g.position.set(x,y,0);root.add(g);spinners.push(g);}
   else{
    slotPos.x=x;slotPos.y=y;
    const q=new THREE.Mesh(new THREE.BoxGeometry(.8,.8,.8),new THREE.MeshStandardMaterial({color:"#CBD5E1",transparent:true,opacity:.35}));q.position.set(x,y,0);root.add(q);
    const qs=emojiSprite("❓",.8);qs.position.set(x,y,.5);root.add(qs);ctx.slot={box:q,q:qs};}});});
 const optY=nr===1?-1.15:top-(nr-1)*rowGap-1.5;
 const n=cfg.options.length,ospace=Math.min(1.45,(nc*cell+.4)/n*1.0+.2);
 const opts=[];
 cfg.options.forEach(function(it,i){
  const x=(i-(n-1)/2)*ospace;
  const plate=new THREE.Mesh(new THREE.CylinderGeometry(.56,.56,.1,28),new THREE.MeshStandardMaterial({color:"#FDE68A",roughness:.7}));plate.position.set(x,optY-.42,0);root.add(plate);
  const g=shapeGroup(it.shape,it.color,it.size);g.position.set(x,optY,0);root.add(g);spinners.push(g);
  const h=new THREE.Mesh(new THREE.SphereGeometry(.6,8,6),new THREE.MeshBasicMaterial({visible:false}));h.position.set(x,optY,0);h.userData.opt=i;root.add(h);hits.push(h);
  opts.push({plate:plate,g:g,x:x,y:optY});});
 /* encuadre: ajusta la cámara a lo que hay que mostrar */
 const needW=Math.max(nc*cell,n*ospace)+.35;
 const contentTop=top+.55,contentBottom=optY-.62;
 const centerY=(contentTop+contentBottom)/2,needHeight=contentTop-contentBottom;
 function fit(){const t=Math.tan(camera.fov*Math.PI/360);const d=Math.max(needHeight/(2*t),needW/(2*t*camera.aspect))+.35;camera.position.set(0,centerY,d);camera.lookAt(0,centerY,0);}
 ctx.onResize=fit;fit();
 const rc=new THREE.Raycaster(),cv=ctx.renderer.domElement;
 ctx.locked=false;
 cv.addEventListener("pointerdown",function(e){
  if(ctx.locked)return;
  const r=cv.getBoundingClientRect();rc.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},camera);
  const h=rc.intersectObjects(hits,false)[0];if(h&&cfg.onPick)cfg.onPick(h.object.userData.opt);});
 LIVE=ctx;
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);ctx.t+=.016;
  spinners.forEach(function(g,i){g.rotation.y=Math.sin(ctx.t*.9+i)*.5;g.position.y+=Math.sin(ctx.t*1.6+i)*.0009;});
  if(ctx.slot&&ctx.slot.q)ctx.slot.q.scale.setScalar(.8+Math.sin(ctx.t*3)*.06);
  ctx.renderer.render(scene,camera);})();
 return{
  lock:function(v){ctx.locked=!!v;},
  /* marca la opción elegida (verde si acierta, roja si no) */
  mark:function(i,ok){const o=opts[i];if(o)o.plate.material.color.set(ok?"#86EFAC":"#FCA5A5");},
  /* completa el hueco con la respuesta correcta */
  reveal:function(item){
   if(!ctx.slot)return;
   ctx.slot.box.visible=false;ctx.slot.q.visible=false;
   const g=shapeGroup(item.shape,item.color,item.size);g.position.set(slotPos.x,slotPos.y,0);g.scale.setScalar(.01);root.add(g);spinners.push(g);
   const t0=ctx.t;const grow=function(){const k=Math.min(1,(ctx.t-t0)/.35);g.scale.setScalar(Math.max(.01,k*(1+Math.sin(k*Math.PI)*.25)));if(k<1)requestAnimationFrame(grow);};grow();}
 };}

/* ---------- TORRE DE CUBOS ---------- */
const STACK_COL=["#60A5FA","#34D399","#FBBF24","#F472B6"];
function render3DStack(containerId,heights){
 const el=document.getElementById(containerId);if(!el)return null;
 disposeLogic3D();
 const ctx=baseScene(el,"#EAF3FF",40);const scene=ctx.scene,camera=ctx.camera;
 const N=heights.length;
 const base=new THREE.Mesh(new THREE.BoxGeometry(N+.5,.14,N+.5),new THREE.MeshStandardMaterial({color:"#CBD5E1",roughness:.9}));base.position.y=-.07;scene.add(base);
 /* flecha "frente" para orientarse */
 const front=emojiSprite("👀",.7);front.position.set(0,.05,N/2+.55);scene.add(front);
 const bg=new THREE.BoxGeometry(.96,.96,.96),eg=new THREE.EdgesGeometry(bg),em=new THREE.LineBasicMaterial({color:"#1E2A4A"});
 for(let r=0;r<N;r++)for(let c=0;c<N;c++)for(let h=0;h<heights[r][c];h++){
  const m=new THREE.Mesh(bg,new THREE.MeshStandardMaterial({color:STACK_COL[h%STACK_COL.length],roughness:.55}));
  m.position.set(c-(N-1)/2,h+.5,r-(N-1)/2);scene.add(m);
  const l=new THREE.LineSegments(eg,em);l.position.copy(m.position);scene.add(l);}
 const R=N*2.15+2.1,cam={th:.65,ph:.95,tth:null,tph:null,touched:false,R:R};
 const tgt=new THREE.Vector3(0,Math.max(0.6,N*.28),0);
 function place(){camera.position.set(tgt.x+cam.R*Math.sin(cam.ph)*Math.sin(cam.th),tgt.y+cam.R*Math.cos(cam.ph),tgt.z+cam.R*Math.sin(cam.ph)*Math.cos(cam.th));camera.lookAt(tgt);}
 place();
 const cv=ctx.renderer.domElement;let drag=null;
 cv.addEventListener("pointerdown",function(e){drag={x:e.clientX,y:e.clientY};cam.touched=true;cam.tth=cam.tph=null;try{cv.setPointerCapture(e.pointerId);}catch(x){}});
 cv.addEventListener("pointermove",function(e){if(!drag)return;cam.th-=(e.clientX-drag.x)*.011;cam.ph=Math.max(.12,Math.min(1.5,cam.ph-(e.clientY-drag.y)*.009));drag={x:e.clientX,y:e.clientY};});
 const up=function(){drag=null;};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
 LIVE=ctx;
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);
  if(cam.tth!=null){
   let d=cam.tth-cam.th;d=Math.atan2(Math.sin(d),Math.cos(d));cam.th+=d*.14;cam.ph+=(cam.tph-cam.ph)*.14;
   if(Math.abs(d)<.005&&Math.abs(cam.tph-cam.ph)<.005){cam.tth=null;}}
  else if(!cam.touched)cam.th+=.0045;
  place();ctx.renderer.render(scene,camera);})();
 return{
  top:function(){cam.touched=true;cam.tth=0;cam.tph=.001;},          /* vista desde arriba, frente abajo */
  home:function(){cam.touched=true;cam.tth=.65;cam.tph=.95;},
  front:function(){cam.touched=true;cam.tth=0;cam.tph=1.5;}
 };}

/* ---------- BALANZAS ---------- */
/* scales:[{L:[emoji,...],R:[emoji,...],unknown:bool}]  (listas ya expandidas, una entrada por pieza) */
function render3DScales(containerId,scales){
 const el=document.getElementById(containerId);if(!el)return null;
 disposeLogic3D();
 const ctx=baseScene(el,"#FFF6E0",36);const scene=ctx.scene,camera=ctx.camera;
 const items=[];
 const woodM=new THREE.MeshStandardMaterial({color:"#B7791F",roughness:.7}),panM=new THREE.MeshStandardMaterial({color:"#E2E8F0",roughness:.4,metalness:.3});
 const n=scales.length,two=n>1;
 /* disposición: las dadas arriba (en fila), la pregunta abajo al centro */
 const given=scales.filter(function(s){return !s.unknown;}),unk=scales.filter(function(s){return s.unknown;});
 const rowsPos=[];
 given.forEach(function(s,i){rowsPos.push({s:s,x:(i-(given.length-1)/2)*3.75,y:1.75});});
 unk.forEach(function(s){rowsPos.push({s:s,x:0,y:given.length?-2.05:0});});
 const objs=[];
 rowsPos.forEach(function(p){
  const g=new THREE.Group();g.position.set(p.x,p.y,0);scene.add(g);
  const baseM=new THREE.Mesh(new THREE.CylinderGeometry(.55,.7,.14,24),woodM);baseM.position.y=-1.05;g.add(baseM);
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.06,.07,1.9,12),woodM);pole.position.y=-.1;g.add(pole);
  const beamPivot=new THREE.Group();beamPivot.position.y=.86;g.add(beamPivot);
  const beam=new THREE.Mesh(new THREE.BoxGeometry(2.3,.1,.1),woodM);beamPivot.add(beam);
  const knob=new THREE.Mesh(new THREE.SphereGeometry(.1,12,10),woodM);knob.position.y=.86;g.add(knob);
  const pans=[-1,1].map(function(s){
   const pg=new THREE.Group();g.add(pg);
   const plate=new THREE.Mesh(new THREE.CylinderGeometry(.62,.5,.09,24),panM);pg.add(plate);
   const cordM=new THREE.LineBasicMaterial({color:"#78350F"});
   const cords=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,.95,0),new THREE.Vector3(-.5,0,0),new THREE.Vector3(0,.95,0),new THREE.Vector3(.5,0,0)]),cordM);pg.add(cords);
   const stuff=new THREE.Group();pg.add(stuff);
   return{g:pg,stuff:stuff,side:s};});
  const o={g:g,pivot:beamPivot,pans:pans,angle:p.s.unknown?-.22:0,target:p.s.unknown?-.22:0,spec:p.s};
  objs.push(o);
  setStuff(o,0,p.s.L);setStuff(o,1,p.s.R.length?p.s.R:["❓"]);});
 function setStuff(o,side,list){
  const st=o.pans[side].stuff;
  while(st.children.length){const c=st.children.pop();if(c.material){if(c.material.map)c.material.map.dispose();c.material.dispose();}}
  const big=list.length>8,per=Math.min(big?5:4,Math.max(2,Math.ceil(Math.sqrt(list.length*1.6)))),sz=big?.4:.5,gap=big?.36:.4;
  list.forEach(function(e,i){const r=Math.floor(i/per),c=i%per,cnt=Math.min(per,list.length-r*per);
   const sp=emojiSprite(e,sz);sp.position.set((c-(cnt-1)/2)*gap,.26+r*(big?.3:.38),0);st.add(sp);});}
 function layout(){
  const t=Math.tan(camera.fov*Math.PI/360);
  const needW=Math.max(given.length*3.75,3.4)+.5,needH=(given.length&&unk.length?7.2:4.2);
  const d=Math.max(needH/(2*t),needW/(2*t*camera.aspect))+.3;
  const cy=given.length&&unk.length?-.15:0;
  camera.position.set(0,cy,d);camera.lookAt(0,cy,0);}
 ctx.onResize=layout;layout();
 LIVE=ctx;
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);ctx.t+=.016;
  objs.forEach(function(o){
   o.angle+=(o.target-o.angle)*.07;
   const wob=o.spec.unknown&&Math.abs(o.target)>.01?Math.sin(ctx.t*2)*.04:0;
   const a=o.angle+wob;o.pivot.rotation.z=a;
   o.pans.forEach(function(p){const L=1.1*p.side;p.g.position.set(L*Math.cos(a),.86+L*Math.sin(a)-.95,0);});});
  ctx.renderer.render(scene,camera);})();
 const q=objs.filter(function(o){return o.spec.unknown;})[0];
 return{
  /* equilibra la balanza de la pregunta llenando el lado derecho con la respuesta */
  solve:function(list){if(!q)return;setStuff(q,1,list);q.target=0;},
  shake:function(){if(q){q.angle=q.target+.12;}}
 };}

window.render3DPuzzle=render3DPuzzle;
window.render3DStack=render3DStack;
window.render3DScales=render3DScales;
window.dispose3DLogic=disposeLogic3D;
