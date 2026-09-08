"use strict";
/* ============ CRIATURAS EN 3D: taller + colección capturada (Three.js) ============ */
/* Pedido explícito: el taller y las criaturas capturadas "se ven horrible" en emoji plano,
   y usar Three.js en más partes de la app (no solo el avión de papel). Mismo patrón que
   js/game-origami.js: módulo ES (index.html: type="module"), sin modelos de Blender —
   la variedad visual sale de la propia librería de formas de Three.js.

   const WORKSHOP_PARTS / CRITTERS viven en js/kid.js (scripts clásicos) — un const de
   ahí NO se comparte automáticamente con un módulo ES (a diferencia de var/function, que
   sí se cuelgan en window solos), por eso kid.js los expone a propósito en window. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

/* 10 formas de la librería de Three.js, cada una con su color propio — cabeza/cuerpo/
   extra del taller (10 opciones cada uno) usan el ÍNDICE de su emoji dentro de
   WORKSHOP_PARTS para elegir la forma, así no hace falta mapear cada emoji a mano. */
const SHAPE_LIB=[
 {make:function(){return new THREE.SphereGeometry(.5,20,16);},color:"#F59E0B"},
 {make:function(){return new THREE.BoxGeometry(.8,.8,.8);},color:"#94A3B8"},
 {make:function(){return new THREE.ConeGeometry(.5,.9,20);},color:"#22C55E"},
 {make:function(){return new THREE.CylinderGeometry(.4,.4,.8,20);},color:"#3B82F6"},
 {make:function(){return new THREE.TorusGeometry(.4,.16,12,24);},color:"#EC4899"},
 {make:function(){return new THREE.OctahedronGeometry(.55);},color:"#8B5CF6"},
 {make:function(){return new THREE.DodecahedronGeometry(.5);},color:"#F97316"},
 {make:function(){return new THREE.IcosahedronGeometry(.5);},color:"#14B8A6"},
 {make:function(){return new THREE.TetrahedronGeometry(.6);},color:"#EF4444"},
 {make:function(){return new THREE.TorusKnotGeometry(.3,.1,50,8);},color:"#A855F7"}
];
function shapeIndexFor(cat,key){
 const arr=(window.WORKSHOP_PARTS&&window.WORKSHOP_PARTS[cat])||[];
 const i=arr.indexOf(key);
 return i>=0?i:0;}
function partMesh(cat,key,scale){
 const def=SHAPE_LIB[shapeIndexFor(cat,key)];
 const mat=new THREE.MeshStandardMaterial({color:def.color,roughness:.5,metalness:.1});
 const m=new THREE.Mesh(def.make(),mat);
 m.scale.setScalar(scale);m.castShadow=true;
 return m;}
function make3DScene(container,bg){
 const w=container.clientWidth||260,h=container.clientHeight||220;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 renderer.setSize(w,h);
 renderer.shadowMap.enabled=true;
 container.innerHTML="";container.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 if(bg)scene.background=new THREE.Color(bg);
 const camera=new THREE.PerspectiveCamera(35,w/h,.1,50);
 camera.position.set(0,.6,4);camera.lookAt(0,.2,0);
 const amb=new THREE.AmbientLight(0xffffff,1.3);
 const dir=new THREE.DirectionalLight(0xffffff,1.4);dir.position.set(3,5,4);dir.castShadow=true;
 scene.add(amb,dir);
 const platMat=new THREE.MeshStandardMaterial({color:"#E6ECF5",roughness:.9});
 const plat=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,.12,28),platMat);
 plat.position.y=-.55;plat.receiveShadow=true;
 scene.add(plat);
 return{renderer:renderer,scene:scene,camera:camera,plat:plat,raf:null};}

/* renderers con animación activa (vista previa del taller, detalle de criatura) — se
   limpian todos juntos desde dispose3D(), enganchado en stopGames() (core.js). El
   snapshot de la galería NO se agrega aquí porque se limpia solo, en el momento. */
let LIVE=[];
function dispose3D(){
 LIVE.forEach(function(ctx){
  try{
   if(ctx.raf)cancelAnimationFrame(ctx.raf);
   ctx.scene.traverse(function(o){
    if(o.geometry)o.geometry.dispose();
    if(o.material){if(Array.isArray(o.material))o.material.forEach(function(m){m.dispose();});else o.material.dispose();}
   });
   ctx.renderer.dispose();
   if(ctx.renderer.domElement&&ctx.renderer.domElement.parentNode)ctx.renderer.domElement.parentNode.removeChild(ctx.renderer.domElement);
  }catch(e){}
 });
 LIVE=[];}

function render3DCreaturePreview(containerId,sel){
 const el=document.getElementById(containerId);if(!el)return;
 const ctx=make3DScene(el,"#EAF6FF");
 const group=new THREE.Group();
 const head=partMesh("cabeza",sel.cabeza,.55);head.position.y=.55;
 const body=partMesh("cuerpo",sel.cuerpo,.7);body.position.y=-.15;
 const extra=partMesh("extra",sel.extra,.28);extra.position.y=1.05;
 group.add(body,head,extra);
 ctx.scene.add(group);
 if(sel.color)ctx.plat.material.color.set(sel.color);
 LIVE.push(ctx);
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);
  group.rotation.y+=0.012;
  ctx.renderer.render(ctx.scene,ctx.camera);
 })();}

function snapshot3DCreature(sel){
 const off=document.createElement("div");
 off.style.width="240px";off.style.height="200px";
 const ctx=make3DScene(off,"#EAF6FF");
 const group=new THREE.Group();
 const head=partMesh("cabeza",sel.cabeza,.55);head.position.y=.55;
 const body=partMesh("cuerpo",sel.cuerpo,.7);body.position.y=-.15;
 const extra=partMesh("extra",sel.extra,.28);extra.position.y=1.05;
 group.add(body,head,extra);
 ctx.scene.add(group);
 if(sel.color)ctx.plat.material.color.set(sel.color);
 group.rotation.y=0.5;
 ctx.renderer.render(ctx.scene,ctx.camera);
 const url=ctx.renderer.domElement.toDataURL("image/png");
 ctx.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
 ctx.renderer.dispose();
 return url;}

function render3DCritter(containerId,critterId,count){
 const el=document.getElementById(containerId);if(!el)return;
 const ctx=make3DScene(el,"#FFF8E1");
 const seed=(typeof seedFromStr==="function"?seedFromStr(critterId):0)>>>0;
 const bIdx=seed%SHAPE_LIB.length;
 const hIdx=Math.floor(seed/7)%SHAPE_LIB.length;
 const group=new THREE.Group();
 const bodyDef=SHAPE_LIB[bIdx],headDef=SHAPE_LIB[hIdx];
 const body=new THREE.Mesh(bodyDef.make(),new THREE.MeshStandardMaterial({color:bodyDef.color,roughness:.5}));
 body.scale.setScalar(.7);body.position.y=-.1;body.castShadow=true;
 const head=new THREE.Mesh(headDef.make(),new THREE.MeshStandardMaterial({color:headDef.color,roughness:.5}));
 head.scale.setScalar(.5);head.position.y=.6;head.castShadow=true;
 group.add(body,head);
 if(count>=3){ // evolucionó: anillo dorado
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.9,.05,12,32),
   new THREE.MeshStandardMaterial({color:"#FFD700",emissive:"#FFD700",emissiveIntensity:.4,roughness:.3}));
  ring.rotation.x=Math.PI/2.2;ring.position.y=-.1;
  group.add(ring);}
 if(count>=5)group.scale.setScalar(1.15); // forma final: un poco más grande
 ctx.scene.add(group);
 LIVE.push(ctx);
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);
  group.rotation.y+=0.01;
  ctx.renderer.render(ctx.scene,ctx.camera);
 })();}

window.render3DCreaturePreview=render3DCreaturePreview;
window.snapshot3DCreature=snapshot3DCreature;
window.render3DCritter=render3DCritter;
window.dispose3D=dispose3D;
