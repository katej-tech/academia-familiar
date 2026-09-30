"use strict";
/* ============ CEREBRO EN FORMA EN 3D (pads de Secuencia + marco de diez) ============
   Pedido explícito, repetido: "que fuese en 3D como lo he dicho e insistido antes". Reemplaza
   los 4 botones CSS planos del juego de Secuencia por 4 pads 3D que se iluminan de verdad
   (emissive), y el marco de diez plano de mathtricks.js por un marco de diez con cubos 3D. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

/* ---------- pads de Secuencia (estilo Simon) ---------- */
const PAD_COLORS=["#EF4444","#3B82F6","#FACC15","#22C55E"];
let PLIVE=null;
function dispose3DPads(){
 if(!PLIVE)return;
 try{cancelAnimationFrame(PLIVE.raf);}catch(e){}
 try{PLIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});PLIVE.renderer.dispose();const c=PLIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);}catch(e){}
 PLIVE=null;}
function render3DPads(containerId,onTap){
 const el=document.getElementById(containerId);if(!el)return;
 dispose3DPads();
 const w=el.clientWidth||320,h=el.clientHeight||320;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(38,w/h,.1,30);camera.position.set(0,3.3,3.1);camera.lookAt(0,0,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.1));
 const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(2,5,3);scene.add(dl);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(1.55,1.6,.3,40),new THREE.MeshStandardMaterial({color:"#1E2A4A",roughness:.7}));base.position.y=-.2;scene.add(base);
 const pads=[];
 PAD_COLORS.forEach(function(c,i){
  const a=i*Math.PI/2+Math.PI/4,rad=.82;
  const mat=new THREE.MeshStandardMaterial({color:c,roughness:.45,emissive:c,emissiveIntensity:.08});
  const pad=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,.22,28,1,false,a-Math.PI/4,Math.PI/2),mat);
  pad.position.set(0,-.02,0);pad.userData.idx=i;scene.add(pad);pads.push(pad);
 });
 const raycaster=new THREE.Raycaster();
 renderer.domElement.style.touchAction="none";
 renderer.domElement.addEventListener("pointerdown",function(ev){
  const rect=renderer.domElement.getBoundingClientRect();
  const x=((ev.clientX-rect.left)/rect.width)*2-1,y=-((ev.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera({x:x,y:y},camera);
  const hit=raycaster.intersectObjects(pads)[0];
  if(hit&&onTap)onTap(hit.object.userData.idx);
 });
 PLIVE={renderer:renderer,scene:scene,camera:camera,pads:pads,raf:null,glow:[0,0,0,0]};
 (function loop(){
  PLIVE.raf=requestAnimationFrame(loop);
  pads.forEach(function(p,i){
   const g=PLIVE.glow[i];p.material.emissiveIntensity=.08+g*.9;p.position.y=-.02+g*.06;
   if(g>0)PLIVE.glow[i]=Math.max(0,g-.06);
  });
  renderer.render(scene,camera);
 })();}
function pad3DLight(i,on){if(PLIVE)PLIVE.glow[i]=on?1:0;}

/* ---------- marco de diez en 3D (cubos que se llenan) ---------- */
let TLIVE=null;
function dispose3DTen(){
 if(!TLIVE)return;
 try{cancelAnimationFrame(TLIVE.raf);}catch(e){}
 try{TLIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});TLIVE.renderer.dispose();const c=TLIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);}catch(e){}
 TLIVE=null;}
function render3DTenFrame(containerId,n,color){
 const el=document.getElementById(containerId);if(!el)return;
 dispose3DTen();
 const w=el.clientWidth||260,h=el.clientHeight||140;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.OrthographicCamera(-2.9,2.9,1.5,-1.5,.1,20);camera.position.set(0,2.1,2.4);camera.lookAt(0,0,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.3));
 const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(2,4,3);scene.add(dl);
 const c=color||"#3B82F6";
 for(let i=0;i<10;i++){
  const col=i%5,row=Math.floor(i/5);
  const filled=i<n;
  const geo=new THREE.BoxGeometry(.85,filled?.55:.12,.85);
  const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:filled?c:"#E2E8F0",roughness:.5}));
  mesh.position.set(col*1.05-2.1,filled?.27:.06,row*1.05-.5);
  scene.add(mesh);
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.87,.14,.87)),new THREE.LineBasicMaterial({color:"#1E2A4A"}));
  edge.position.set(col*1.05-2.1,.06,row*1.05-.5);scene.add(edge);
 }
 TLIVE={renderer:renderer,scene:scene,camera:camera,raf:null};
 (function loop(){TLIVE.raf=requestAnimationFrame(loop);renderer.render(scene,camera);})();}

window.render3DPads=render3DPads;
window.pad3DLight=pad3DLight;
window.dispose3DPads=dispose3DPads;
window.render3DTenFrame=render3DTenFrame;
window.dispose3DTen=dispose3DTen;
