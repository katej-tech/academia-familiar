"use strict";
/* ============ PERSONAJES GUÍA EN 3D (saludan y dan un acertijo antes del camino diario) ============
   Pedido explícito: "personajes caricatura deberían ser en 3D" + "tipo Pokémon, hablar con
   personajes, resolver acertijos". Se combinan: un personaje 3D distinto saluda antes de cada
   día del camino (screenDailyPath, kid.js) y plantea un acertijo corto — responder (bien o mal)
   siempre deja seguir, es solo para darle sabor de aventura, no para bloquear el avance.
   Mismo patrón que pet3d.js/creature3d.js: formas nativas de Three.js, sin modelos de Blender. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const GUIDE_MODELS=[
 {id:"robo",build:function(g){
   const bodyMat=new THREE.MeshStandardMaterial({color:"#60A5FA",roughness:.4,metalness:.3});
   const body=new THREE.Mesh(new THREE.BoxGeometry(.5,.6,.32),bodyMat);body.position.y=.05;g.add(body);
   const head=new THREE.Mesh(new THREE.BoxGeometry(.4,.36,.34),bodyMat);head.position.y=.58;g.add(head);
   const eyeMat=new THREE.MeshStandardMaterial({color:"#1E2A4A",emissive:"#38BDF8",emissiveIntensity:.6});
   [-1,1].forEach(function(s){const eye=new THREE.Mesh(new THREE.SphereGeometry(.05,10,8),eyeMat);eye.position.set(s*.11,.6,.19);g.add(eye);});
   const ant=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.22,8),bodyMat);ant.position.set(0,.9,0);g.add(ant);
   const tip=new THREE.Mesh(new THREE.SphereGeometry(.05,10,8),new THREE.MeshStandardMaterial({color:"#F87171",emissive:"#F87171",emissiveIntensity:.5}));tip.position.set(0,1.03,0);g.add(tip);
   [-1,1].forEach(function(s){const arm=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.4,10),bodyMat);arm.position.set(s*.32,.05,0);arm.rotation.z=s*.3;g.add(arm);});
 }},
 {id:"buho",build:function(g){
   const bodyMat=new THREE.MeshStandardMaterial({color:"#A16207",roughness:.6});
   const body=new THREE.Mesh(new THREE.SphereGeometry(.4,18,14),bodyMat);body.scale.set(1,1.15,.9);body.position.y=.15;g.add(body);
   const head=new THREE.Mesh(new THREE.SphereGeometry(.28,16,12),bodyMat);head.position.y=.62;g.add(head);
   [-1,1].forEach(function(s){const ear=new THREE.Mesh(new THREE.ConeGeometry(.07,.16,8),bodyMat);ear.position.set(s*.16,.86,0);g.add(ear);});
   const glassMat=new THREE.MeshStandardMaterial({color:"#78350F",roughness:.3});
   [-1,1].forEach(function(s){const g1=new THREE.Mesh(new THREE.TorusGeometry(.09,.018,8,16),glassMat);g1.position.set(s*.11,.63,.24);g.add(g1);});
   const beak=new THREE.Mesh(new THREE.ConeGeometry(.05,.1,8),new THREE.MeshStandardMaterial({color:"#F59E0B"}));beak.rotation.x=Math.PI/2;beak.position.set(0,.58,.29);g.add(beak);
   [-1,1].forEach(function(s){const wing=new THREE.Mesh(new THREE.ConeGeometry(.14,.42,10),bodyMat);wing.position.set(s*.38,.1,0);wing.rotation.z=s*.9;g.add(wing);});
 }},
 {id:"mago",build:function(g){
   const robeMat=new THREE.MeshStandardMaterial({color:"#7C3AED",roughness:.5});
   const robe=new THREE.Mesh(new THREE.ConeGeometry(.36,.85,16),robeMat);robe.position.y=.05;g.add(robe);
   const head=new THREE.Mesh(new THREE.SphereGeometry(.24,16,12),new THREE.MeshStandardMaterial({color:"#EDB98A"}));head.position.y=.62;g.add(head);
   const hat=new THREE.Mesh(new THREE.ConeGeometry(.24,.5,16),robeMat);hat.position.y=1.0;g.add(hat);
   const brim=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.04,16),robeMat);brim.position.y=.78;g.add(brim);
   const wand=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.5,8),new THREE.MeshStandardMaterial({color:"#78350F"}));
   wand.position.set(.32,.25,0);wand.rotation.z=-.6;g.add(wand);
   const star=new THREE.Mesh(new THREE.OctahedronGeometry(.07),new THREE.MeshStandardMaterial({color:"#FBBF24",emissive:"#FBBF24",emissiveIntensity:.6}));
   star.position.set(.46,.48,0);g.add(star);
 }},
 {id:"astro",build:function(g){
   const suitMat=new THREE.MeshStandardMaterial({color:"#F1F5F9",roughness:.5});
   const body=new THREE.Mesh(new THREE.CylinderGeometry(.28,.32,.6,16),suitMat);body.position.y=.05;g.add(body);
   const helmet=new THREE.Mesh(new THREE.SphereGeometry(.3,18,14),new THREE.MeshStandardMaterial({color:"#93C5FD",transparent:true,opacity:.55,roughness:.2}));
   helmet.position.y=.62;g.add(helmet);
   const headIn=new THREE.Mesh(new THREE.SphereGeometry(.2,14,10),new THREE.MeshStandardMaterial({color:"#EDB98A"}));headIn.position.y=.6;g.add(headIn);
   [-1,1].forEach(function(s){const arm=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.42,10),suitMat);arm.position.set(s*.34,.08,0);arm.rotation.z=s*.35;g.add(arm);});
   const pack=new THREE.Mesh(new THREE.BoxGeometry(.2,.32,.12),new THREE.MeshStandardMaterial({color:"#CBD5E1"}));pack.position.set(0,.05,-.24);g.add(pack);
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
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(35,w/h,.1,50);
 camera.position.set(0,.35,2.7);camera.lookAt(0,.35,0);
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
