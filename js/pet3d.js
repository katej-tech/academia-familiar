"use strict";
/* ============ MASCOTA EN 3D (el Tamagotchi de js/pet.js, ahora con cuerpo real) ============
   Pedido explícito: "la mascota [debería ser] en 3D también". Solo la pantalla principal de
   cuidado (screenTama(), #tamapet) se vuelve 3D — el mini-juego de atrapar golosinas (js/pet.js
   tgLoop/#tgpet) sigue en emoji a propósito: es un juego rápido de toques repetidos, un canvas
   WebGL de por medio ahí no aporta y sí puede pesarle a una tablet real. El emoji-badge pasivo
   de nivel (petStage() en kid.js, arriba de screenKidMap/screenCritters) tampoco se toca.

   v2 (feedback real: "no parece un gato, parece un cacahuate"): la v1 pegaba dos esferas
   (cuerpo y cabeza) casi sin superponerse — eso dibuja literalmente un cacahuate/figura-8.
   Se rediseñó para que la cabeza se hunda BIEN adentro del cuerpo (silueta continua, sin
   "cintura"), y se agregó hocico+nariz+cachetes+cola por especie — sin eso ninguna forma
   con esferas lee como animal, por bonitos que sean los colores. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

/* mismo orden que TAMA_STARTERS en js/pet.js */
const PET_MODELS=[
 {nm:"gatito",color:"#F4A65B",snout:"#FFE9D2",ear:"#FBC28C",ears:"round",tail:"conecurl",whiskers:true},
 {nm:"perrito",color:"#B9834A",snout:"#F2DCB8",ear:"#8A5A2B",ears:"droop",tail:"conecurl"},
 {nm:"conejo",color:"#F6D7E8",snout:"#FFFFFF",ear:"#F5A9CB",ears:"long",tail:"pompom"},
 {nm:"hamster",color:"#F2CD7E",snout:"#FFF3D6",ear:"#E4B255",ears:"tiny",tail:"stub",cheeks:true},
 {nm:"zorrito",color:"#EF823E",snout:"#FFFFFF",ear:"#20262E",ears:"round",tail:"fox",whiskers:true},
 {nm:"dragon",color:"#3FBF6A",snout:"#CDEFD9",ear:"#2E9E52",ears:"round",tail:"long",wings:true},
 {nm:"pinguino",color:"#26313F",snout:"#F59E42",ear:"#26313F",ears:"none",tail:"stub",belly:"#F8FAFC",beak:true,flippers:true},
 {nm:"tortuga",color:"#6FA33C",snout:"#CFE7AE",ear:"#4E7A2A",ears:"none",tail:"stub",shell:"#3F6B22",neck:true},
 {nm:"unicornio",color:"#F4EEFC",snout:"#FFFFFF",ear:"#C9A9F2",ears:"round",tail:"flow",horn:true,mane:"#F2A6D6"},
 {nm:"osito",color:"#9A6B3C",snout:"#E7C79A",ear:"#7A4F27",ears:"round",tail:"stub"}
];

let LIVE=null;
function dispose3DPet(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
  LIVE.renderer.dispose();
  if(LIVE.renderer.domElement&&LIVE.renderer.domElement.parentNode)LIVE.renderer.domElement.parentNode.removeChild(LIVE.renderer.domElement);
 }catch(e){}
 LIVE=null;}

function render3DPet(containerId,idx,sleeping){
 const el=document.getElementById(containerId);if(!el)return;
 dispose3DPet();
 const def=PET_MODELS[idx]||PET_MODELS[0];
 const w=el.clientWidth||170,h=el.clientHeight||170;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(34,w/h,.1,50);
 camera.position.set(0,.2,2.7);camera.lookAt(0,.08,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.5));
 const dir=new THREE.DirectionalLight(0xffffff,1.2);dir.position.set(3,5,4);scene.add(dir);
 const fill=new THREE.DirectionalLight(0xffffff,.5);fill.position.set(-3,2,2);scene.add(fill);

 const group=new THREE.Group();
 window.P3D.buildPet(group,def);
 scene.add(group);
 if(sleeping){group.rotation.z=Math.PI/2.3;group.position.y=-.15;}
 LIVE={renderer:renderer,scene:scene,camera:camera,group:group,raf:null,t:0,pulse:null,sleeping:!!sleeping};
 (function loop(){
  LIVE.raf=requestAnimationFrame(loop);
  LIVE.t+=0.045;
  if(!LIVE.sleeping){
   group.position.y=(LIVE.pulse?0:Math.sin(LIVE.t)*.04);
   group.rotation.y=Math.sin(LIVE.t*.5)*.25;
  }
  if(LIVE.pulse){
   LIVE.pulse.k+=0.09;
   if(LIVE.pulse.kind==="eat"){const s=1+Math.sin(LIVE.pulse.k*3)*.08*Math.max(0,1-LIVE.pulse.k/3);group.scale.setScalar(Math.max(.9,s));}
   else{const jump=Math.max(0,Math.sin(Math.min(Math.PI,LIVE.pulse.k*2)))*.35;group.position.y=jump;}
   if(LIVE.pulse.k>3.2){LIVE.pulse=null;group.scale.setScalar(1);}
  }
  renderer.render(scene,camera);
 })();}
function pet3DPulse(kind){if(LIVE)LIVE.pulse={kind:kind,k:0};}
function pet3DSetSleeping(sleeping){
 if(!LIVE)return;
 LIVE.sleeping=!!sleeping;
 LIVE.group.rotation.z=sleeping?Math.PI/2.3:0;
 LIVE.group.position.y=sleeping?-.15:0;}

window.render3DPet=render3DPet;
window.pet3DPulse=pet3DPulse;
window.pet3DSetSleeping=pet3DSetSleeping;
window.dispose3DPet=dispose3DPet;
