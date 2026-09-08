"use strict";
/* ============ AVIÓN DE PAPEL EN 3D (Three.js) ============ */
/* Reconstrucción pedida tras probar la versión plana (v9.83): "feo, sin sentido eso de
   tirar aviones". Primera vez que la app usa WebGL — todo lo demás es DOM/SVG/Canvas2D.
   Es un script de MÓDULO (index.html lo carga con type="module") porque Three.js se
   importa desde un CDN como ES module. Los scripts de módulo NO exponen nada al scope
   global automáticamente, y el resto de la app llama a gamePaperPlane() como función
   global (onclick="gamePaperPlane()" en kid.js/board.js) — por eso al final se cuelgan
   las funciones necesarias en window.

   No es un motor de física real ni una simulación exacta de origami (sería un proyecto
   aparte) — es una versión ilustrada: figuras de papel con volumen/luz de verdad en vez
   de dibujos planos, y un lanzamiento por arrastre (estilo resortera) en vez de una barra
   de potencia abstracta. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const PLANE_STEPS=[
 {label:"Empieza con una hoja de papel",pts:[[55,14],[145,14],[145,186],[55,186]]},
 {label:"Dóblala por la mitad y márcala con una línea al centro",pts:[[55,14],[145,14],[145,186],[55,186]],crease:true},
 {label:"Dobla las esquinas de arriba hacia la línea del centro",pts:[[100,14],[60,74],[88,74],[88,186],[112,186],[112,74],[140,74]]},
 {label:"Dobla la punta otra vez, más angosta",pts:[[100,14],[78,66],[88,66],[88,186],[112,186],[112,66],[122,66]]},
 {label:"Dobla las alas hacia los lados — ¡tu avión está listo! ✈️",pts:[[100,14],[78,88],[18,152],[88,120],[88,186],[112,186],[112,120],[182,152],[122,88]]}
];
/* convierte los puntos (pensados para un viewBox 0..200) a una forma centrada en el
   origen, en una escala razonable para la escena 3D */
function shapeFromPts(pts){
 const s=new THREE.Shape();
 pts.forEach(function(p,i){
  const x=(p[0]-100)/38,y=-(p[1]-100)/38;
  if(i===0)s.moveTo(x,y);else s.lineTo(x,y);
 });
 s.closePath();
 return s;}

let PA={};
function paDisposeObj(o){
 if(!o)return;
 if(o.geometry)o.geometry.dispose();
 if(o.material){if(Array.isArray(o.material))o.material.forEach(function(m){m.dispose();});else o.material.dispose();}}
/* limpieza completa: se llama desde stopGames() (core.js) si el niño sale del juego a
   medio doblar/lanzar, y también al reiniciar, para no acumular contextos WebGL */
function paDispose(){
 if(PA.raf)cancelAnimationFrame(PA.raf);
 if(PA.scene)PA.scene.traverse(function(o){paDisposeObj(o);});
 if(PA.renderer){PA.renderer.dispose();if(PA.renderer.domElement&&PA.renderer.domElement.parentNode)PA.renderer.domElement.parentNode.removeChild(PA.renderer.domElement);}
 PA={};}

function paInitScene(container){
 const w=container.clientWidth||320,h=300;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 renderer.setSize(w,h);
 renderer.shadowMap.enabled=true;
 container.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 scene.background=new THREE.Color("#EAF6FF");
 const camera=new THREE.PerspectiveCamera(38,w/h,0.1,100);
 camera.position.set(0,2.2,6.5);
 camera.lookAt(0,0.3,0);
 const amb=new THREE.AmbientLight(0xffffff,1.35);
 const dir=new THREE.DirectionalLight(0xffffff,1.6);
 dir.position.set(3,5,4);dir.castShadow=true;
 const fill=new THREE.DirectionalLight(0xffffff,.6);
 fill.position.set(-3,2,3);
 scene.add(amb,dir,fill);
 const deskMat=new THREE.MeshStandardMaterial({color:"#DCE6F0",roughness:.95});
 const desk=new THREE.Mesh(new THREE.CircleGeometry(4,32),deskMat);
 desk.rotation.x=-Math.PI/2;desk.position.y=-1.4;desk.receiveShadow=true;
 scene.add(desk);
 PA.renderer=renderer;PA.scene=scene;PA.camera=camera;PA.w=w;PA.h=h;PA.desk=desk;}

function paBuildStepMesh(idx){
 if(PA.mesh){PA.scene.remove(PA.mesh);paDisposeObj(PA.mesh);PA.mesh=null;}
 if(PA.crease){PA.scene.remove(PA.crease);paDisposeObj(PA.crease);PA.crease=null;}
 const step=PLANE_STEPS[idx];
 const shape=shapeFromPts(step.pts);
 const geo=new THREE.ExtrudeGeometry(shape,{depth:0.06,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:2});
 const mat=new THREE.MeshStandardMaterial({color:"#FFFDF5",roughness:.75,metalness:0,side:THREE.DoubleSide});
 const mesh=new THREE.Mesh(geo,mat);
 mesh.castShadow=true;mesh.position.y=-0.3;mesh.scale.set(.001,.001,.001);
 PA.scene.add(mesh);PA.mesh=mesh;
 PA.growTo=1;PA.growT=0; // anima un pulso de escala al aparecer
 if(step.crease){
  const pts=[new THREE.Vector3(0,1.9,0.1),new THREE.Vector3(0,-1.9,0.1)];
  const lgeo=new THREE.BufferGeometry().setFromPoints(pts);
  const lmat=new THREE.LineDashedMaterial({color:"#1E2A4A",dashSize:.12,gapSize:.08});
  const line=new THREE.Line(lgeo,lmat);line.computeLineDistances();
  line.position.y=-0.3;
  PA.scene.add(line);PA.crease=line;}}

function paRenderOnce(){if(PA.renderer)PA.renderer.render(PA.scene,PA.camera);}
function paIdleLoop(){
 if(!PA.renderer)return;
 PA.raf=requestAnimationFrame(paIdleLoop);
 if(PA.mesh){
  if(PA.growT<1){PA.growT=Math.min(1,PA.growT+0.09);const s=0.9+0.1*Math.sin(PA.growT*Math.PI/2);PA.mesh.scale.set(s,s,s);}
  if(!PA.dragging)PA.mesh.rotation.y=Math.sin(Date.now()/900)*0.18;
 }
 paRenderOnce();}

/* ---- pantalla de doblado ---- */
function gamePaperPlane(){setTheme("kid");
 paDispose();
 PA={step:0};
 render(topbar("screenMyStuff()")
 +'<div class="progressdots">'+dots(PLANE_STEPS.length,0)+'</div>'
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.45rem);text-align:center;margin-bottom:2px">✈️ Avión de papel</h2>'
 +'<p class="center" id="paLabel" style="font-size:.95rem;margin-bottom:8px">'+esc(PLANE_STEPS[0].label)+'</p>'
 +'<div id="paStage" style="border-radius:16px;overflow:hidden;max-width:340px;margin:0 auto"></div>'
 +'<button class="kbtn blue" id="paNextBtn" style="margin-top:12px" onclick="paNext()">Doblar → siguiente paso</button>'
 +'<button class="kbtn white" style="margin-top:8px" onclick="gamePaperPlane()">🔁 Empezar de nuevo</button>');
 const stage=document.getElementById("paStage");
 paInitScene(stage);
 paBuildStepMesh(0);
 paIdleLoop();}
function paNext(){
 if(!PA.scene)return;
 if(PA.step<PLANE_STEPS.length-1){
  PA.step++;beep([560],.05);
  const lbl=document.getElementById("paLabel");if(lbl)lbl.textContent=PLANE_STEPS[PA.step].label;
  const dotsEl=document.querySelector(".progressdots");if(dotsEl)dotsEl.innerHTML=dots(PLANE_STEPS.length,PA.step);
  paBuildStepMesh(PA.step);
  if(PA.step===PLANE_STEPS.length-1){
   const btn=document.getElementById("paNextBtn");
   if(btn){btn.textContent="🚀 ¡Lánzalo!";btn.setAttribute("onclick","paThrowStart()");btn.classList.remove("blue");btn.classList.add("green");}
  }
 }}

/* ---- lanzamiento: arrastra hacia atrás (como una resortera) y suelta ---- */
function paThrowStart(){
 if(!PA.scene)return;
 const label=document.getElementById("paLabel");
 if(label)label.textContent="Arrastra el avión hacia atrás y suelta para lanzarlo 🎯";
 const btn=document.getElementById("paNextBtn");if(btn)btn.style.display="none";
 PA.launched=false;PA.pull={x:0,y:0};
 const dom=PA.renderer.domElement;
 dom.style.touchAction="none";
 const pos=function(e){const r=dom.getBoundingClientRect();return{x:((e.clientX-r.left)/r.width)*2-1,y:-(((e.clientY-r.top)/r.height)*2-1)};};
 let start=null;
 function onDown(e){
  if(PA.launched)return;
  start=pos(e);PA.dragging=true;
  try{dom.setPointerCapture(e.pointerId);}catch(err){}}
 function onMove(e){
  if(!PA.dragging||!start)return;
  const p=pos(e);
  const dx=p.x-start.x,dy=p.y-start.y;
  const MAXP=0.9;
  PA.pull.x=Math.max(-MAXP,Math.min(0,dx))*2.2; // solo se puede jalar hacia atrás (izquierda)
  PA.pull.y=Math.max(-.5,Math.min(.6,dy))*1.4;
  if(PA.mesh){PA.mesh.position.x=PA.pull.x;PA.mesh.position.y=-0.3+PA.pull.y*0.5;PA.mesh.rotation.z=PA.pull.x*.25;}}
 function onUp(){
  if(!PA.dragging)return;
  PA.dragging=false;
  const power=Math.min(1,Math.hypot(PA.pull.x,PA.pull.y)/2);
  if(power<0.12){ // jaló muy poco, no cuenta como lanzamiento
   if(PA.mesh){PA.mesh.position.x=0;PA.mesh.position.y=-0.3;PA.mesh.rotation.z=0;}
   PA.pull={x:0,y:0};return;}
  dom.removeEventListener("pointerdown",onDown);
  dom.removeEventListener("pointermove",onMove);
  dom.removeEventListener("pointerup",onUp);
  paLaunch(power,PA.pull.y);}
 dom.addEventListener("pointerdown",onDown);
 dom.addEventListener("pointermove",onMove);
 dom.addEventListener("pointerup",onUp);}

function paLaunch(power,pullY){
 PA.launched=true;
 const label=document.getElementById("paLabel");if(label)label.textContent="¡Volando! ✈️";
 // quita el escritorio, agrega pista/cielo para el vuelo
 if(PA.desk){PA.scene.remove(PA.desk);paDisposeObj(PA.desk);PA.desk=null;}
 const groundMat=new THREE.MeshStandardMaterial({color:"#BFE8CF",roughness:1});
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(400,20),groundMat);
 ground.rotation.x=-Math.PI/2;ground.position.y=-1.4;ground.receiveShadow=true;
 PA.scene.add(ground);PA.ground=ground;
 for(let m=10;m<=100;m+=10){
  const markMat=new THREE.MeshStandardMaterial({color:"#1E2A4A"});
  const mark=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.3,0.06),markMat);
  mark.position.set(m*0.22,-1.25,0);PA.scene.add(mark);
  if(!PA.marks)PA.marks=[];PA.marks.push(mark);}
 PA.mesh.position.set(0,0.3,0);PA.mesh.rotation.set(0,0,0);
 PA.vel={x:2.6+power*4.2,y:1.2+pullY*1.6+power*1.6};
 PA.pos={x:0,y:0.3};
 PA.dist=0;
 paFlightLoop();}
function paFlightLoop(){
 PA.raf=requestAnimationFrame(paFlightLoop);
 const dt=1/60;
 PA.vel.y-=2.1*dt; // gravedad
 PA.vel.x*=0.997; // resistencia del aire
 PA.pos.x+=PA.vel.x*dt;PA.pos.y+=PA.vel.y*dt;
 PA.mesh.position.x=PA.pos.x;PA.mesh.position.y=PA.pos.y;
 PA.mesh.rotation.z=Math.max(-0.6,Math.min(0.6,PA.vel.y*0.25));
 PA.camera.position.x=PA.pos.x*0.4;
 PA.camera.lookAt(PA.pos.x*0.4+1.5,0.2,0);
 paRenderOnce();
 if(PA.pos.y<=-1.1){
  cancelAnimationFrame(PA.raf);PA.raf=null;
  PA.dist=Math.max(3,Math.round(PA.pos.x/0.22));
  paLandResult();return;}
 if(PA.pos.x>28){ // se salió de la pista visible: aterriza igual, ya se ve el resultado
  cancelAnimationFrame(PA.raf);PA.raf=null;
  PA.dist=Math.max(3,Math.round(PA.pos.x/0.22));
  paLandResult();}}
function paLandResult(){
 const p=prof();
 const best=p.paperPlaneBest||0;
 const isRecord=PA.dist>best;
 if(isRecord){p.paperPlaneBest=PA.dist;save();}
 sOK();confetti(isRecord?26:14);
 const label=document.getElementById("paLabel");
 if(label)label.innerHTML="¡Voló <b>"+PA.dist+" metros</b>! "+(isRecord?"🏆 ¡Nuevo récord!":"Tu récord: "+p.paperPlaneBest+"m");
 const stars=PA.dist>=70?3:PA.dist>=35?2:1;
 setTimeout(function(){paDispose();nodeWin(stars,"Avión de papel");},1700);}

window.gamePaperPlane=gamePaperPlane;
window.paNext=paNext;
window.paThrowStart=paThrowStart;
window.paDispose=paDispose;
