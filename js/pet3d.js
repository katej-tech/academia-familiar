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

function mat(color,opts){return new THREE.MeshStandardMaterial(Object.assign({color:color,roughness:.55},opts||{}));}

function buildPet(g,def){
 const bodyMat=mat(def.color);
 /* cuerpo: ovoide sentado, achatado en la base — NO una esfera perfecta, así ya lee
    "cuerpo de peluche" antes de agregarle nada más */
 const body=new THREE.Mesh(new THREE.SphereGeometry(.5,20,16),bodyMat);
 body.scale.set(.5,.42,.46);body.position.set(0,-.16,0);g.add(body);

 /* cabeza: se hunde bien adentro del cuerpo (superposición profunda a propósito) para que
    la silueta combinada quede redonda y continua, sin "cintura" de cacahuate */
 const head=new THREE.Mesh(new THREE.SphereGeometry(.34,20,16),bodyMat);
 head.position.set(0,.26,.08);g.add(head);

 /* hocico: ovoide clarito al frente de la cabeza — esto es lo que más ayuda a que se
    lea como cara de animal y no como una bola lisa */
 const snoutMat=mat(def.snout||"#FFFFFF",{roughness:.6});
 const snout=new THREE.Mesh(new THREE.SphereGeometry(.155,16,12),snoutMat);
 snout.scale.set(1,.72,.92);snout.position.set(0,.16,.34);g.add(snout);
 const nose=new THREE.Mesh(new THREE.SphereGeometry(.045,10,8),mat("#3A2A22",{roughness:.4}));
 nose.position.set(0,.2,.47);g.add(nose);

 if(def.cheeks){
  [-1,1].forEach(function(s){
   const cheek=new THREE.Mesh(new THREE.SphereGeometry(.1,12,10),snoutMat);
   cheek.position.set(s*.26,.15,.28);g.add(cheek);});
 }

 /* ojos: sobre el hocico, mirando al frente */
 [-1,1].forEach(function(s){
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.052,10,8),mat("#1E2A4A",{roughness:.3}));
  eye.position.set(s*.2,.33,.29);g.add(eye);
  const shine=new THREE.Mesh(new THREE.SphereGeometry(.016,6,6),mat("#FFFFFF",{roughness:.1}));
  shine.position.set(s*.2+.014,.345,.32);g.add(shine);
 });

 /* orejas */
 if(def.ears!=="none"){
  const earMat=mat(def.ear,{roughness:.6});
  [-1,1].forEach(function(s){
   let ear;
   if(def.ears==="long"){ear=new THREE.Mesh(new THREE.CylinderGeometry(.055,.075,.4,10),earMat);ear.position.set(s*.16,.62,.06);ear.rotation.z=s*.12;}
   else if(def.ears==="droop"){ear=new THREE.Mesh(new THREE.ConeGeometry(.1,.24,10),earMat);ear.position.set(s*.28,.32,.08);ear.rotation.z=s*1.3;}
   else if(def.ears==="tiny"){ear=new THREE.Mesh(new THREE.SphereGeometry(.08,10,8),earMat);ear.position.set(s*.24,.5,.06);}
   else{ear=new THREE.Mesh(new THREE.ConeGeometry(.13,.22,10),earMat);ear.position.set(s*.2,.5,.02);ear.rotation.z=s*.25;}
   g.add(ear);
  });
 }

 /* bigotes (gato/zorro): les da mucho carácter y son baratos de dibujar */
 if(def.whiskers){
  const wMat=mat("#FFFFFF",{roughness:.8});
  [-1,1].forEach(function(s){
   [0,1,2].forEach(function(i){
    const w=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.24,4),wMat);
    w.position.set(s*.22,.18-i*.03,.36);
    w.rotation.z=Math.PI/2+s*.15;w.rotation.y=s*(.3+i*.12);
    g.add(w);
   });
  });
 }

 /* cola: la diferencia más grande entre "bola con orejas" y "animal" */
 const tailMat=mat(def.ear||def.color,{roughness:.6});
 if(def.tail==="conecurl"){
  const tail=new THREE.Mesh(new THREE.ConeGeometry(.09,.42,10),tailMat);
  tail.position.set(0,.02,-.42);tail.rotation.x=-1.0;g.add(tail);
 }else if(def.tail==="pompom"){
  const tail=new THREE.Mesh(new THREE.SphereGeometry(.11,12,10),mat(def.snout||def.color));
  tail.position.set(0,-.1,-.46);g.add(tail);
 }else if(def.tail==="fox"){
  const tail=new THREE.Mesh(new THREE.ConeGeometry(.16,.62,12),tailMat);
  tail.position.set(0,.02,-.5);tail.rotation.x=-1.15;g.add(tail);
  const tip=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),mat(def.snout||"#FFFFFF"));
  tip.position.set(0,.28,-.78);g.add(tip);
 }else if(def.tail==="long"){
  const tail=new THREE.Mesh(new THREE.CylinderGeometry(.1,.04,.75,10),tailMat);
  tail.position.set(0,-.02,-.58);tail.rotation.x=-1.15;g.add(tail);
 }else if(def.tail==="flow"){
  [0,1,2].forEach(function(i){
   const strand=new THREE.Mesh(new THREE.ConeGeometry(.05,.5-i*.06,8),mat(def.mane||def.ear));
   strand.position.set((i-1)*.07,.06,-.4);strand.rotation.x=-1.05+(i-1)*.15;g.add(strand);
  });
 }else if(def.tail==="stub"){
  const tail=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),tailMat);
  tail.position.set(0,-.06,-.44);g.add(tail);
 }

 if(def.wings){
  [-1,1].forEach(function(s){
   const wing=new THREE.Mesh(new THREE.ConeGeometry(.26,.46,4),mat(def.ear,{roughness:.5}));
   wing.position.set(s*.5,.1,-.05);wing.rotation.z=s*1.15;wing.rotation.y=.3;g.add(wing);});}
 if(def.horn){
  const horn=new THREE.Mesh(new THREE.ConeGeometry(.055,.3,10),mat("#FBBF24",{roughness:.3,metalness:.4}));
  horn.position.set(0,.62,.16);horn.rotation.x=-.35;g.add(horn);}
 if(def.shell){
  const shell=new THREE.Mesh(new THREE.SphereGeometry(.44,16,12,0,Math.PI*2,0,Math.PI/1.7),mat(def.shell,{roughness:.65}));
  shell.position.set(0,.02,-.06);shell.scale.set(1.05,.8,1.05);g.add(shell);}
 if(def.neck){
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.1,.14,.16,10),mat(def.color));
  neck.position.set(0,.08,.28);neck.rotation.x=.5;g.add(neck);}
 if(def.belly){
  const belly=new THREE.Mesh(new THREE.SphereGeometry(.28,14,10),mat(def.belly,{roughness:.6}));
  belly.position.set(0,-.14,.24);belly.scale.set(.72,.9,.5);g.add(belly);}
 if(def.beak){
  const beak=new THREE.Mesh(new THREE.ConeGeometry(.09,.2,10),mat(def.snout,{roughness:.4}));
  beak.rotation.x=Math.PI/2;beak.position.set(0,.2,.4);g.add(beak);}
 if(def.flippers){
  [-1,1].forEach(function(s){
   const fl=new THREE.Mesh(new THREE.ConeGeometry(.09,.4,8),mat(def.color));
   fl.position.set(s*.42,-.1,0);fl.rotation.z=s*1.3;g.add(fl);});}
}

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
 buildPet(group,def);
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
