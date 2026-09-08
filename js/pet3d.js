"use strict";
/* ============ MASCOTA EN 3D (el Tamagotchi de js/pet.js, ahora con cuerpo real) ============
   Pedido explícito: "la mascota [debería ser] en 3D también". Solo la pantalla principal de
   cuidado (screenTama(), #tamapet) se vuelve 3D — el mini-juego de atrapar golosinas (js/pet.js
   tgLoop/#tgpet) sigue en emoji a propósito: es un juego rápido de toques repetidos, un canvas
   WebGL de por medio ahí no aporta y sí puede pesarle a una tablet real. El emoji-badge pasivo
   de nivel (petStage() en kid.js, arriba de screenKidMap/screenCritters) tampoco se toca: es
   una decoración chica que se pinta en CADA cambio de pantalla, un canvas 3D ahí sería
   desperdiciar WebGL en algo que ni es la mascota que se cuida de verdad. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

/* mismo orden que TAMA_STARTERS en js/pet.js — cuerpo+cabeza con formas nativas de Three.js
   (sin modelos de Blender) + orejas/extras simples para que cada uno se sienta distinto. */
const PET_MODELS=[
 {body:"sphere",color:"#F97316",ear:"#FDBA74"},
 {body:"sphere",color:"#A16207",ear:"#78350F",droopEars:true},
 {body:"sphere",color:"#FBCFE8",ear:"#F9A8D4",longEars:true},
 {body:"sphere",color:"#FDE68A",ear:"#FCD34D"},
 {body:"cone",color:"#F97316",ear:"#1E293B"},
 {body:"cylinder",color:"#22C55E",ear:"#16A34A",wings:true},
 {body:"cylinder",color:"#1E293B",ear:"#FBBF24",belly:"#F8FAFC"},
 {body:"dodecahedron",color:"#65A30D",ear:"#365314",shell:"#4D7C0F"},
 {body:"sphere",color:"#F3E8FF",ear:"#C4B5FD",horn:true},
 {body:"sphere",color:"#92400E",ear:"#78350F"}
];
function bodyGeo(kind){
 if(kind==="cone")return new THREE.ConeGeometry(.5,.9,20);
 if(kind==="cylinder")return new THREE.CylinderGeometry(.42,.5,.9,20);
 if(kind==="dodecahedron")return new THREE.DodecahedronGeometry(.5);
 return new THREE.SphereGeometry(.5,20,16);}

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
 const camera=new THREE.PerspectiveCamera(38,w/h,.1,50);
 camera.position.set(0,.15,3.1);camera.lookAt(0,.1,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.4));
 const dir=new THREE.DirectionalLight(0xffffff,1.3);dir.position.set(3,5,4);scene.add(dir);
 const group=new THREE.Group();
 const bodyMat=new THREE.MeshStandardMaterial({color:def.color,roughness:.55});
 const body=new THREE.Mesh(bodyGeo(def.body),bodyMat);body.scale.setScalar(.85);group.add(body);
 const headMat=new THREE.MeshStandardMaterial({color:def.color,roughness:.55});
 const head=new THREE.Mesh(new THREE.SphereGeometry(.42,18,14),headMat);head.position.set(0,.62,.08);group.add(head);
 const earMat=new THREE.MeshStandardMaterial({color:def.ear,roughness:.6});
 const earGeo=def.longEars?new THREE.CylinderGeometry(.07,.1,.45,10):new THREE.ConeGeometry(.14,.24,10);
 [-1,1].forEach(function(s){
  const ear=new THREE.Mesh(earGeo,earMat);
  ear.position.set(s*.28,def.longEars?1.05:.9,0);
  if(def.droopEars)ear.rotation.z=s*.9; else if(def.longEars)ear.rotation.z=s*.15;
  group.add(ear);});
 [-1,1].forEach(function(s){
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.06,10,8),new THREE.MeshStandardMaterial({color:"#1E2A4A"}));
  eye.position.set(s*.15,.66,.36);group.add(eye);});
 if(def.wings){
  [-1,1].forEach(function(s){
   const wing=new THREE.Mesh(new THREE.ConeGeometry(.3,.5,4),new THREE.MeshStandardMaterial({color:def.ear,roughness:.5}));
   wing.position.set(s*.55,.2,-.1);wing.rotation.z=s*1.15;wing.rotation.y=.3;
   group.add(wing);});}
 if(def.horn){
  const horn=new THREE.Mesh(new THREE.ConeGeometry(.06,.32,10),new THREE.MeshStandardMaterial({color:"#FBBF24",roughness:.3,metalness:.3}));
  horn.position.set(0,1.02,.1);horn.rotation.x=-.2;group.add(horn);}
 if(def.shell){
  const shell=new THREE.Mesh(new THREE.SphereGeometry(.5,16,12,0,Math.PI*2,0,Math.PI/1.7),new THREE.MeshStandardMaterial({color:def.shell,roughness:.6}));
  shell.position.set(0,.1,-.05);shell.scale.set(1.05,.75,1.05);group.add(shell);}
 if(def.belly){
  const belly=new THREE.Mesh(new THREE.SphereGeometry(.3,14,10),new THREE.MeshStandardMaterial({color:def.belly,roughness:.6}));
  belly.position.set(0,-.05,.28);belly.scale.set(.75,1,.55);group.add(belly);}
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
