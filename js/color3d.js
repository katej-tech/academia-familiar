"use strict";
/* ============ COLOREAR EN 3D (pintar por partes un modelo, no un dibujo plano) ============
   Pedido explícito: "colorear o sea dibujo debería ser como lo de los aviones también en 3d".
   El "Colorear" plano (SVG, board.js) sigue existiendo tal cual (13 dibujos, funciona bien) —
   esto se agrega como una segunda opción, no lo reemplaza. Mismo patrón que creature3d.js:
   módulo ES, formas nativas de Three.js (sin modelos de Blender), funciones colgadas en window. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

/* cada plantilla es un conjunto de piezas (malla + posición + color de fábrica); tocar una
   pieza la selecciona (raycasting), tocar un color de la paleta pinta la pieza seleccionada.
   "fixed:true" = pieza que no se pinta (ej. el asta de la bandera). */
const COLOR3D_TEMPLATES=[
 {id:"avion",name:"✈️ Avión",parts:function(){return [
   {id:"fuselaje",mesh:function(){const g=new THREE.CylinderGeometry(.22,.3,1.6,16);g.rotateZ(Math.PI/2);return g;},pos:[0,0,0],color:"#E5E7EB"},
   {id:"alas",mesh:function(){return new THREE.BoxGeometry(1.6,.06,.42);},pos:[0,-.05,0],color:"#60A5FA"},
   {id:"cola",mesh:function(){return new THREE.BoxGeometry(.28,.4,.06);},pos:[-.78,.2,0],color:"#F87171"},
   {id:"nariz",mesh:function(){const g=new THREE.ConeGeometry(.22,.35,16);g.rotateZ(-Math.PI/2);return g;},pos:[.92,0,0],color:"#FBBF24"}
 ];}},
 {id:"bandera",name:"🏴 Bandera",parts:function(){return [
   {id:"asta",mesh:function(){return new THREE.CylinderGeometry(.035,.035,1.6,12);},pos:[-.6,0,0],color:"#8B5E34",fixed:true},
   {id:"franja1",mesh:function(){return new THREE.BoxGeometry(.95,.26,.05);},pos:[-.05,.5,0],color:"#EF4444"},
   {id:"franja2",mesh:function(){return new THREE.BoxGeometry(.95,.26,.05);},pos:[-.05,.24,0],color:"#FACC15"},
   {id:"franja3",mesh:function(){return new THREE.BoxGeometry(.95,.26,.05);},pos:[-.05,-.02,0],color:"#3B82F6"}
 ];}},
 {id:"robot",name:"🤖 Robot",parts:function(){return [
   {id:"cabeza",mesh:function(){return new THREE.BoxGeometry(.45,.4,.4);},pos:[0,.78,0],color:"#94A3B8"},
   {id:"cuerpo",mesh:function(){return new THREE.BoxGeometry(.6,.7,.4);},pos:[0,.12,0],color:"#64748B"},
   {id:"brazoI",mesh:function(){return new THREE.CylinderGeometry(.08,.08,.6,12);},pos:[-.42,.18,0],color:"#F97316"},
   {id:"brazoD",mesh:function(){return new THREE.CylinderGeometry(.08,.08,.6,12);},pos:[.42,.18,0],color:"#F97316"},
   {id:"antena",mesh:function(){return new THREE.SphereGeometry(.08,14,10);},pos:[0,1.08,0],color:"#EF4444"}
 ];}},
 {id:"cohete",name:"🚀 Cohete",parts:function(){return [
   {id:"cuerpo",mesh:function(){return new THREE.CylinderGeometry(.28,.28,1.3,16);},pos:[0,0,0],color:"#E2E8F0"},
   {id:"nariz",mesh:function(){return new THREE.ConeGeometry(.28,.5,16);},pos:[0,.9,0],color:"#EF4444"},
   {id:"aletaI",mesh:function(){return new THREE.ConeGeometry(.22,.4,4);},pos:[-.32,-.65,0],rot:[0,0,-.5],color:"#3B82F6"},
   {id:"aletaD",mesh:function(){return new THREE.ConeGeometry(.22,.4,4);},pos:[.32,-.65,0],rot:[0,0,.5],color:"#3B82F6"},
   {id:"ventana",mesh:function(){return new THREE.SphereGeometry(.14,16,12);},pos:[0,.15,.26],color:"#60A5FA"}
 ];}}
];

let LIVE3D=null;
function dispose3DColor(){
 if(!LIVE3D)return;
 try{cancelAnimationFrame(LIVE3D.raf);}catch(e){}
 try{
  LIVE3D.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
  LIVE3D.renderer.dispose();
  if(LIVE3D.renderer.domElement&&LIVE3D.renderer.domElement.parentNode)LIVE3D.renderer.domElement.parentNode.removeChild(LIVE3D.renderer.domElement);
 }catch(e){}
 LIVE3D=null;}

function render3DColorTemplate(containerId,templateId,onSelect){
 const el=document.getElementById(containerId);if(!el)return;
 dispose3DColor();
 const tpl=COLOR3D_TEMPLATES.find(function(t){return t.id===templateId;});if(!tpl)return;
 const w=el.clientWidth||300,h=el.clientHeight||260;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#EAF6FF");
 const camera=new THREE.PerspectiveCamera(38,w/h,.1,50);
 camera.position.set(0,.3,3.1);camera.lookAt(0,0,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.35));
 const dir=new THREE.DirectionalLight(0xffffff,1.4);dir.position.set(3,5,4);scene.add(dir);
 const group=new THREE.Group();
 const meshes=[];
 tpl.parts().forEach(function(p){
  const mat=new THREE.MeshStandardMaterial({color:p.color,roughness:.55});
  const m=new THREE.Mesh(p.mesh(),mat);
  m.position.set(p.pos[0],p.pos[1],p.pos[2]);
  if(p.rot)m.rotation.set(p.rot[0],p.rot[1],p.rot[2]);
  m.userData.partId=p.id;m.userData.fixed=!!p.fixed;
  group.add(m);meshes.push(m);
 });
 scene.add(group);
 const raycaster=new THREE.Raycaster();
 let selected=null;
 function setSelected(m){
  if(selected)selected.material.emissive.set(0x000000);
  selected=m;
  if(selected){selected.material.emissive.set(0x3355ff);selected.material.emissiveIntensity=.55;}
  if(onSelect)onSelect(selected?selected.userData.partId:null);
 }
 renderer.domElement.style.touchAction="none";
 renderer.domElement.addEventListener("pointerdown",function(ev){
  const rect=renderer.domElement.getBoundingClientRect();
  const x=((ev.clientX-rect.left)/rect.width)*2-1;
  const y=-((ev.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera({x:x,y:y},camera);
  const hits=raycaster.intersectObjects(meshes);
  if(hits.length&&!hits[0].object.userData.fixed)setSelected(hits[0].object);
 });
 LIVE3D={renderer:renderer,scene:scene,camera:camera,group:group,meshes:meshes,raf:null,
  setColor:function(hex){if(selected)selected.material.color.set(hex);},
  reset:function(){const defs=tpl.parts();meshes.forEach(function(m,i){m.material.color.set(defs[i].color);});},
  snapshot:function(){renderer.render(scene,camera);return renderer.domElement.toDataURL("image/png");}};
 (function loop(){LIVE3D.raf=requestAnimationFrame(loop);group.rotation.y+=0.006;renderer.render(scene,camera);})();}

function color3DSetColor(hex){if(LIVE3D&&LIVE3D.setColor)LIVE3D.setColor(hex);}
function color3DReset(){if(LIVE3D&&LIVE3D.reset)LIVE3D.reset();}
function color3DSnapshot(){return(LIVE3D&&LIVE3D.snapshot)?LIVE3D.snapshot():null;}

window.COLOR3D_TEMPLATES=COLOR3D_TEMPLATES;
window.render3DColorTemplate=render3DColorTemplate;
window.color3DSetColor=color3DSetColor;
window.color3DReset=color3DReset;
window.color3DSnapshot=color3DSnapshot;
window.dispose3DColor=dispose3DColor;
