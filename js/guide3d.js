"use strict";
/* ============ PERSONAJES GUÍA EN 3D (saludan y dan un acertijo antes del camino diario) ============
   Pedido explícito: "personajes caricatura deberían ser en 3D" + "tipo Pokémon, hablar con
   personajes, resolver acertijos". Se combinan: un personaje 3D distinto saluda antes de cada
   día del camino (screenDailyPath, kid.js) y plantea un acertijo corto — responder (bien o mal)
   siempre deja seguir, es solo para darle sabor de aventura, no para bloquear el avance.
   Mismo patrón que pet3d.js/creature3d.js: formas nativas de Three.js, sin modelos de Blender. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

/* v2 (auditoría: los narradores eran figuras sin cara): ahora con cara, manos, pies y contorno
   de dibujo animado, armados con la librería compartida P3D (parts3d.js). */
function E(g,x,y,z,r){const p=window.P3D;p.mk(g,p.SPH(r,12,10),"#1E2A4A",[x,y,z],1,null,{m:{roughness:.3}});p.mk(g,p.SPH(r*.32,6,6),"#FFFFFF",[x+r*.3,y+r*.35,z+r*.75]);}
const GUIDE_MODELS=[
 {id:"robo",build:function(g){const p=window.P3D,mk=p.mk;
   mk(g,p.BOX(.56,.6,.36),"#60A5FA",[0,.02,0],1,null,{o:.05,m:{metalness:.3,roughness:.4}});
   mk(g,p.BOX(.3,.22,.03),"#FACC15",[0,.06,.19],1,null,{o:.06});mk(g,p.SPH(.03,8,6),"#EF4444",[-.07,.06,.21]);mk(g,p.SPH(.03,8,6),"#22C55E",[.07,.06,.21]);
   mk(g,p.BOX(.46,.4,.4),"#93C5FD",[0,.64,0],1,null,{o:.05,m:{metalness:.3,roughness:.4}});
   [-1,1].forEach(function(s){mk(g,p.BOX(.12,.09,.04),"#22D3EE",[s*.12,.68,.21],1,null,{m:{emissive:"#22D3EE",emissiveIntensity:.8}});
     mk(g,p.CYL(.06,.06,.5,10),"#3B82F6",[s*.4,.02,0],1,[0,0,s*.25],{o:.08});mk(g,p.SPH(.09,10,8),"#F97316",[s*.5,-.24,0],1,null,{o:.08});
     mk(g,p.CYL(.08,.08,.34,10),"#3B82F6",[s*.14,-.46,0],1,null,{o:.08});mk(g,p.BOX(.2,.08,.28),"#1D4ED8",[s*.14,-.66,.04],1,null,{o:.06});
     mk(g,p.CYL(.05,.05,.1,8),"#64748B",[s*.28,.64,0],1,[0,0,Math.PI/2]);});
   mk(g,p.BOX(.22,.04,.03),"#0F172A",[0,.56,.21]);mk(g,p.CYL(.015,.015,.2,6),"#64748B",[0,.94,0]);mk(g,p.SPH(.055,10,8),"#EF4444",[0,1.06,0],1,null,{m:{emissive:"#EF4444",emissiveIntensity:.6}});
 }},
 {id:"buho",build:function(g){const p=window.P3D,mk=p.mk;
   mk(g,p.SPH(.42,22,16),"#A16207",[0,.05,0],[1,1.15,.9],null,{o:.05});mk(g,p.SPH(.3,16,12),"#FDE68A",[0,-.02,.22],[.9,1.1,.5]);
   mk(g,p.SPH(.32,20,14),"#A16207",[0,.62,0],[1.1,.95,.92],null,{o:.05});
   [-1,1].forEach(function(s){mk(g,p.SPH(.13,14,10),"#FFF8E7",[s*.14,.66,.24],[1,1,.5],null,{o:.06});mk(g,p.SPH(.075,10,8),"#1E2A4A",[s*.14,.66,.3],[1,1,.5]);mk(g,p.SPH(.025,6,6),"#FFFFFF",[s*.14+.02,.69,.33]);
     mk(g,new THREE.TorusGeometry(.14,.018,8,20),"#78350F",[s*.14,.66,.28]);
     mk(g,p.CON(.07,.2,8),"#7A4F27",[s*.2,.92,0],1,[0,0,s*.3],{o:.08});
     mk(g,p.SPH(.14,12,10),"#7A4F27",[s*.43,.08,0],[.5,1.4,.6],[0,0,s*.25],{o:.06});mk(g,p.SPH(.06,8,6),"#F59E42",[s*.14,-.5,.06],[1.3,.5,1.2]);});
   mk(g,p.CON(.06,.12,8),"#F59E42",[0,.56,.32],1,[Math.PI,0,0]);
 }},
 {id:"mago",build:function(g){const p=window.P3D,mk=p.mk;
   mk(g,p.CON(.4,.95,18),"#7C3AED",[0,.02,0],1,null,{o:.05});[[.1,.1],[-.14,-.1],[.06,-.25]].forEach(function(s){mk(g,p.SPH(.03,6,6),"#FDE047",[s[0],s[1],.3],1,null,{m:{emissive:"#FDE047",emissiveIntensity:.6}});});
   mk(g,p.SPH(.24,18,14),"#EDB98A",[0,.64,0],1,null,{o:.05});E(g,-.09,.68,.2,.04);E(g,.09,.68,.2,.04);mk(g,p.SPH(.04,8,6),"#E8A07A",[0,.62,.23]);
   mk(g,p.CON(.2,.34,12),"#F8FAFC",[0,.46,.14],1,[Math.PI,0,0],{o:.06});
   mk(g,p.CYL(.36,.36,.04,20),"#5B21B6",[0,.8,0],1,null,{o:.06});mk(g,p.CON(.26,.55,18),"#7C3AED",[0,1.08,0],1,null,{o:.05});mk(g,p.CYL(.265,.265,.06,18),"#FBBF24",[0,.86,0]);
   mk(g,p.starGeo(.5,.22),"#FBBF24",[0,1.16,.24],.2,null,{m:{emissive:"#FBBF24",emissiveIntensity:.5}});
   mk(g,p.CYL(.02,.02,.6,8),"#78350F",[.42,.2,0],1,[0,0,-.4],{o:.08});mk(g,p.SPH(.07,10,8),"#FDE047",[.56,.5,0],1,null,{m:{emissive:"#FDE047",emissiveIntensity:.7}});
 }},
 {id:"astro",build:function(g){const p=window.P3D,mk=p.mk;
   mk(g,p.CYL(.3,.34,.62,18),"#F1F5F9",[0,.02,0],1,null,{o:.05});mk(g,p.BOX(.24,.34,.14),"#CBD5E1",[0,.04,-.28],1,null,{o:.06});
   mk(g,p.BOX(.16,.1,.02),"#EF4444",[.1,.12,.3]);mk(g,p.SPH(.04,8,6),"#3B82F6",[-.1,.12,.3]);
   mk(g,new THREE.TorusGeometry(.26,.06,10,24),"#F1F5F9",[0,.4,0],1,[Math.PI/2,0,0],{o:.08});
   mk(g,p.SPH(.22,18,14),"#EDB98A",[0,.68,0],1,null,{o:.05});
   E(g,-.08,.72,.2,.038);E(g,.08,.72,.2,.038);mk(g,p.BOX(.1,.02,.02),"#B45309",[0,.62,.21]);
   mk(g,p.SPH(.34,22,16),"#93C5FD",[0,.68,0],1,null,{m:{transparent:true,opacity:.3,roughness:.1}});
   [-1,1].forEach(function(s){mk(g,p.CYL(.075,.075,.42,10),"#F1F5F9",[s*.38,.06,0],1,[0,0,s*.4],{o:.08});mk(g,p.SPH(.09,10,8),"#94A3B8",[s*.5,-.13,0],1,null,{o:.08});
     mk(g,p.CYL(.1,.1,.34,10),"#F1F5F9",[s*.14,-.46,0],1,null,{o:.08});mk(g,p.BOX(.2,.1,.28),"#64748B",[s*.14,-.66,.04],1,null,{o:.06});});
   mk(g,p.CYL(.02,.02,.16,6),"#64748B",[.16,1.0,0]);mk(g,p.SPH(.045,8,6),"#EF4444",[.16,1.1,0]);
 }}
];
let LIVE=null;
function dispose3DGuide(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
  LIVE.renderer.dispose();
  if(LIVE.renderer.domElement&&LIVE.renderer.domElement.parentNode)LIVE.renderer.domElement.parentNode.removeChild(LIVE.renderer.domElement);
 }catch(e){}
 LIVE=null;}

function render3DGuide(containerId,idx){
 const el=document.getElementById(containerId);if(!el)return;
 dispose3DGuide();
 const def=GUIDE_MODELS[((idx%GUIDE_MODELS.length)+GUIDE_MODELS.length)%GUIDE_MODELS.length];
 const w=el.clientWidth||200,h=el.clientHeight||220;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(35,w/h,.1,50);
 camera.position.set(0,.3,3.3);camera.lookAt(0,.25,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.4));
 const dir=new THREE.DirectionalLight(0xffffff,1.3);dir.position.set(3,5,4);scene.add(dir);
 const group=new THREE.Group();
 def.build(group);
 scene.add(group);
 LIVE={renderer:renderer,scene:scene,camera:camera,group:group,raf:null,t:0};
 (function loop(){
  LIVE.raf=requestAnimationFrame(loop);
  LIVE.t+=0.05;
  group.position.y=Math.sin(LIVE.t)*.05;
  group.rotation.y=Math.sin(LIVE.t*.4)*.3;
  renderer.render(scene,camera);
 })();}

window.GUIDE_MODELS=GUIDE_MODELS;
window.render3DGuide=render3DGuide;
window.dispose3DGuide=dispose3DGuide;
