"use strict";
/* ============ CUERPO HUMANO EN 3D EXPLORABLE (toca un órgano y aprende su sistema) ============
   Pedido explícito: "el cuerpo humano en 3d y explorar para entender los sistemas". No reemplaza
   el juego de "señala las partes"/"órganos y sistemas" (games3.js, quiz con puntaje, sigue igual)
   — esto es un modo nuevo de EXPLORAR libre, sin puntaje, para mirar de cerca. Reusa el mismo
   texto de BODY_ORGANS (games3.js) para no duplicar la explicación de cada sistema. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

/* posiciones anatómicas aproximadas (unidades locales de la escena, no las coordenadas SVG
   de BODY_ORGANS — esas son 2D para el juego de quiz, estas son para el cuerpo 3D). El id debe
   coincidir con BODY_ORGANS[i].id para poder leer nombre/sistema desde window.BODY_ORGANS. */
const ORGAN_SPOTS=[
 {id:"cerebro",color:"#F3A9BE",pos:[0,1.02,.04],r:.11},
 {id:"corazon",color:"#EF4444",pos:[-.08,.58,.13],r:.09},
 {id:"pulmonI",organId:"pulmones",color:"#F9A8D4",pos:[.15,.56,.08],r:.075},
 {id:"pulmonD",organId:"pulmones",color:"#F9A8D4",pos:[-.19,.56,.06],r:.075},
 {id:"estomago",color:"#FBBF24",pos:[.02,.26,.12],r:.11},
 {id:"huesos",color:"#F8FAFC",pos:[0,.35,-.09],r:.04,tall:true}
];

let LIVE=null;
function dispose3DBody(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
  LIVE.renderer.dispose();
  if(LIVE.renderer.domElement&&LIVE.renderer.domElement.parentNode)LIVE.renderer.domElement.parentNode.removeChild(LIVE.renderer.domElement);
 }catch(e){}
 LIVE=null;}

function render3DBody(containerId,onSelect){
 const el=document.getElementById(containerId);if(!el)return;
 dispose3DBody();
 const w=el.clientWidth||300,h=el.clientHeight||320;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#EAF6FF");
 const camera=new THREE.PerspectiveCamera(35,w/h,.1,50);
 camera.position.set(0,.05,4.3);camera.lookAt(0,.05,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.4));
 const dir=new THREE.DirectionalLight(0xffffff,1.2);dir.position.set(3,5,4);scene.add(dir);

 const group=new THREE.Group();
 const skinMat=function(){return new THREE.MeshStandardMaterial({color:"#EDB98A",transparent:true,opacity:.3,depthWrite:false,roughness:.6});};
 const head=new THREE.Mesh(new THREE.SphereGeometry(.22,20,16),skinMat());head.position.set(0,1.0,0);group.add(head);
 const neck=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,.14,12),skinMat());neck.position.set(0,.82,0);group.add(neck);
 const torso=new THREE.Mesh(new THREE.BoxGeometry(.5,.75,.28),skinMat());torso.position.set(0,.42,0);group.add(torso);
 [-1,1].forEach(function(s){
  const arm=new THREE.Mesh(new THREE.CylinderGeometry(.06,.07,.65,12),skinMat());
  arm.position.set(s*.32,.32,0);arm.rotation.z=s*.12;group.add(arm);
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(.08,.09,.75,12),skinMat());
  leg.position.set(s*.13,-.42,0);group.add(leg);});

 const organMeshes=[];
 ORGAN_SPOTS.forEach(function(o){
  const geo=o.tall?new THREE.CylinderGeometry(o.r,o.r,.85,10):new THREE.SphereGeometry(o.r,16,12);
  const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:o.color,roughness:.4,emissive:0x000000}));
  m.position.set(o.pos[0],o.pos[1],o.pos[2]);
  m.userData.organId=o.organId||o.id;
  group.add(m);organMeshes.push(m);
 });
 scene.add(group);

 const raycaster=new THREE.Raycaster();
 let selected=null;
 function setSelected(m){
  if(selected)selected.material.emissive.set(0x000000);
  selected=m;
  if(selected){selected.material.emissive.set(0xffffff);selected.material.emissiveIntensity=.35;}
  if(onSelect)onSelect(selected?selected.userData.organId:null);
 }
 renderer.domElement.style.touchAction="none";
 renderer.domElement.addEventListener("pointerdown",function(ev){
  const rect=renderer.domElement.getBoundingClientRect();
  const x=((ev.clientX-rect.left)/rect.width)*2-1;
  const y=-((ev.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera({x:x,y:y},camera);
  const hits=raycaster.intersectObjects(organMeshes);
  if(hits.length)setSelected(hits[0].object);
 });
 LIVE={renderer:renderer,scene:scene,camera:camera,group:group,raf:null};
 (function loop(){LIVE.raf=requestAnimationFrame(loop);group.rotation.y+=0.007;renderer.render(scene,camera);})();}

window.render3DBody=render3DBody;
window.dispose3DBody=dispose3DBody;
