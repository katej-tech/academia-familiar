"use strict";
/* ============ COLOREAR EN 3D (pinta por partes un modelo armado de verdad) ============
   v2 tras auditoría: la v1 eran cilindros y cajas sueltas (el "avión" era un tubo con las alas
   de canto), y giraba solo, así que era casi imposible tocar una pieza. Ahora cada modelo
   (avión, bandera, robot, cohete, carro, casa) está armado con varias formas por pieza, con
   contorno tipo dibujo animado, y se GIRA ARRASTRANDO el dedo (un toque sin arrastrar elige la
   pieza). El Colorear plano (SVG, board.js) sigue existiendo aparte. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const SPH=function(r){return new THREE.SphereGeometry(r,18,14);};
const CYL=function(a,b,h){return new THREE.CylinderGeometry(a,b,h,18);};
const CON=function(r,h,n){return new THREE.ConeGeometry(r,h,n||18);};
const BOX=function(x,y,z){return new THREE.BoxGeometry(x,y,z);};

/* cada plantilla: build(part) → part(id,label,color,fixed) devuelve add(geo,pos,scale,rot) */
const COLOR3D_TEMPLATES=[
 {id:"avion",name:"✈️ Avión",view:{y:-.7,x:.25},build:function(part){
   let a=part("fuselaje","el cuerpo","#E5E7EB");
   a(CYL(.17,.17,1.2),[0,0,0],1,[0,0,Math.PI/2]);a(CON(.17,.55),[-.85,0,0],1,[0,0,Math.PI/2]);
   a=part("nariz","la nariz","#F59E0B");a(SPH(.17),[.6,0,0],[1.25,1,1]);
   a=part("alas","las alas","#60A5FA");a(BOX(.44,.05,.95),[-.02,-.05,.55],1,[0,-.32,0]);a(BOX(.44,.05,.95),[-.02,-.05,-.55],1,[0,.32,0]);
   a=part("cola","la cola","#F87171");a(BOX(.34,.4,.05),[-.86,.28,0],1,[0,0,.3]);a(BOX(.26,.04,.42),[-.86,.06,.22]);a(BOX(.26,.04,.42),[-.86,.06,-.22]);
   a=part("cabina","la ventana","#38BDF8");a(SPH(.13),[.22,.15,0],[1.5,.9,.9]);
   a=part("helice","la hélice","#374151");a(SPH(.05),[.8,0,0]);a(BOX(.03,.62,.07),[.82,0,0]);a(BOX(.03,.07,.62),[.82,0,0]);
 }},
 {id:"bandera",name:"🏴 Bandera",view:{y:-.5,x:.1},build:function(part){
   let a=part("asta","el asta","#8B5E34",true);a(CYL(.03,.03,1.7),[-.7,.1,0]);a(SPH(.07),[-.7,.98,0]);a(CYL(.16,.18,.06),[-.7,-.75,0]);
   a=part("franja1","la franja de arriba","#EF4444");a(BOX(1.05,.3,.05),[-.12,.68,0]);
   a=part("franja2","la franja del medio","#FACC15");a(BOX(1.05,.3,.05),[-.12,.38,0]);
   a=part("franja3","la franja de abajo","#3B82F6");a(BOX(1.05,.3,.05),[-.12,.08,0]);
 }},
 {id:"robot",name:"🤖 Robot",view:{y:-.5,x:.12},build:function(part){
   let a=part("cabeza","la cabeza","#94A3B8");a(BOX(.52,.44,.44),[0,.8,0]);a(CYL(.06,.06,.1),[-.3,.8,0],1,[0,0,Math.PI/2]);a(CYL(.06,.06,.1),[.3,.8,0],1,[0,0,Math.PI/2]);
   a=part("ojos","los ojos","#22D3EE",true);a(BOX(.13,.09,.03),[-.12,.84,.23]);a(BOX(.13,.09,.03),[.12,.84,.23]);a(BOX(.26,.04,.03),[0,.7,.23]);
   a=part("antena","la antena","#EF4444");a(CYL(.015,.015,.22),[0,1.12,0]);a(SPH(.06),[0,1.26,0]);
   a=part("cuerpo","el cuerpo","#64748B");a(BOX(.62,.62,.42),[0,.24,0]);
   a=part("panel","el panel","#FACC15");a(BOX(.32,.24,.03),[0,.28,.22]);a(SPH(.035),[-.08,.26,.245]);a(SPH(.035),[.08,.26,.245]);
   a=part("brazos","los brazos","#F97316");[-1,1].forEach(function(s){a(CYL(.08,.08,.52),[s*.43,.24,0]);a(SPH(.11),[s*.43,-.04,0]);});
   a=part("piernas","las piernas","#475569");[-1,1].forEach(function(s){a(CYL(.1,.1,.42),[s*.16,-.28,0]);a(BOX(.22,.08,.3),[s*.16,-.52,.04]);});
 }},
 {id:"cohete",name:"🚀 Cohete",view:{y:-.5,x:.1},build:function(part){
   let a=part("cuerpo","el cuerpo","#E2E8F0");a(CYL(.3,.32,1.1),[0,0,0]);
   a=part("punta","la punta","#EF4444");a(CON(.3,.55),[0,.82,0]);
   a=part("franja","la franja","#3B82F6");a(new THREE.TorusGeometry(.31,.045,10,28),[0,.2,0],1,[Math.PI/2,0,0]);
   a=part("aletas","las aletas","#EF4444");[0,1,2].forEach(function(i){const t=i*Math.PI*2/3;a(BOX(.05,.4,.32),[Math.cos(t)*.36,-.5,Math.sin(t)*.36],1,[0,-t,0]);});
   a=part("ventana","la ventana","#60A5FA");a(SPH(.13),[0,.35,.29],[1,1,.6]);
   a=part("llama","la llama","#F97316");a(CON(.2,.5),[0,-.85,0],1,[Math.PI,0,0]);
 }},
 {id:"carro",name:"🚗 Carro",view:{y:-.7,x:.2},build:function(part){
   let a=part("carroceria","la carrocería","#EF4444");a(BOX(1.4,.3,.62),[0,-.02,0]);a(BOX(.7,.28,.56),[-.1,.26,0]);
   a=part("ventanas","las ventanas","#7DD3FC",true);a(BOX(.5,.16,.58),[-.1,.28,0]);
   a=part("ruedas","las ruedas","#1F2937");[[.45,.32],[.45,-.32],[-.45,.32],[-.45,-.32]].forEach(function(p){a(CYL(.17,.17,.12),[p[0],-.16,p[1]],1,[Math.PI/2,0,0]);});
   a=part("rines","los rines","#E5E7EB",true);[[.45,.39],[.45,-.39],[-.45,.39],[-.45,-.39]].forEach(function(p){a(CYL(.08,.08,.03),[p[0],-.16,p[1]],1,[Math.PI/2,0,0]);});
   a=part("luces","las luces","#FDE047");a(SPH(.07),[.72,.02,.2],[.6,1,1]);a(SPH(.07),[.72,.02,-.2],[.6,1,1]);
 }},
 {id:"casa",name:"🏠 Casa",view:{y:-.5,x:.2},build:function(part){
   let a=part("paredes","las paredes","#FDE68A");a(BOX(1.1,.62,.85),[0,-.15,0]);
   a=part("tejado","el tejado","#EF4444");a(CON(.95,.5,4),[0,.4,0],1,[0,Math.PI/4,0]);
   a=part("puerta","la puerta","#8B5E34");a(BOX(.22,.38,.04),[0,-.26,.44]);a(SPH(.02),[.06,-.26,.47]);
   a=part("ventanas","las ventanas","#7DD3FC");a(BOX(.22,.22,.04),[-.34,-.08,.44]);a(BOX(.22,.22,.04),[.34,-.08,.44]);
   a=part("chimenea","la chimenea","#B45F3E");a(BOX(.15,.34,.15),[.32,.6,-.12]);
 }}
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
 const camera=new THREE.PerspectiveCamera(36,w/h,.1,50);
 camera.position.set(0,.6,4.1);camera.lookAt(0,.14,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.45));
 const dir=new THREE.DirectionalLight(0xffffff,1.3);dir.position.set(3,5,4);scene.add(dir);
 const fillL=new THREE.DirectionalLight(0xffffff,.5);fillL.position.set(-3,2,2);scene.add(fillL);
 const outl=new THREE.MeshBasicMaterial({color:"#1E2A4A",side:THREE.BackSide});

 const group=new THREE.Group();
 const parts=[];   /* {id,label,mat,fixed,def,meshes[]} */
 const allMeshes=[];
 tpl.build(function(id,label,color,fixed){
  const pd={id:id,label:label,def:color,fixed:!!fixed,mat:new THREE.MeshStandardMaterial({color:color,roughness:.55}),meshes:[]};
  parts.push(pd);
  return function(geo,pos,scale,rot){
   const m=new THREE.Mesh(geo,pd.mat);
   m.position.set(pos[0],pos[1],pos[2]);
   if(scale!=null){if(typeof scale==="number")m.scale.setScalar(scale);else m.scale.set(scale[0],scale[1],scale[2]);}
   if(rot)m.rotation.set(rot[0],rot[1],rot[2]);
   m.userData.part=pd;
   const o=new THREE.Mesh(geo,outl);o.scale.setScalar(1.06);m.add(o);
   group.add(m);pd.meshes.push(m);allMeshes.push(m);
  };
 });
 group.rotation.y=tpl.view.y;group.rotation.x=tpl.view.x;
 scene.add(group);
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.2,32),new THREE.MeshBasicMaterial({color:"#B6C7DA",transparent:true,opacity:.45}));
 shadow.rotation.x=-Math.PI/2;shadow.position.y=-.95;scene.add(shadow);

 const raycaster=new THREE.Raycaster();
 let selected=null;
 function setSelected(pd){
  if(selected)selected.mat.emissive.set(0x000000);
  selected=pd;
  if(selected){selected.mat.emissive.set(0x3355ff);selected.mat.emissiveIntensity=.55;}
  if(onSelect)onSelect(selected?selected.id:null,selected?selected.label:null);
 }
 /* arrastrar = girar; toque corto = elegir pieza */
 const cv=renderer.domElement;cv.style.touchAction="none";
 let drag=null;
 cv.addEventListener("pointerdown",function(ev){drag={x:ev.clientX,y:ev.clientY,moved:0};try{cv.setPointerCapture(ev.pointerId);}catch(e){}});
 cv.addEventListener("pointermove",function(ev){
  if(!drag)return;
  const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;drag.moved+=Math.abs(dx)+Math.abs(dy);
  group.rotation.y+=dx*.012;group.rotation.x=Math.max(-.6,Math.min(.9,group.rotation.x+dy*.008));
  drag.x=ev.clientX;drag.y=ev.clientY;LIVE3D.touched=true;});
 cv.addEventListener("pointerup",function(ev){
  if(drag&&drag.moved<8){
   const rect=cv.getBoundingClientRect();
   const x=((ev.clientX-rect.left)/rect.width)*2-1,y=-((ev.clientY-rect.top)/rect.height)*2+1;
   raycaster.setFromCamera({x:x,y:y},camera);
   const hits=raycaster.intersectObjects(allMeshes,false);
   if(hits.length){const pd=hits[0].object.userData.part;if(!pd.fixed)setSelected(pd);}
  }
  drag=null;});
 cv.addEventListener("pointercancel",function(){drag=null;});
 LIVE3D={renderer:renderer,scene:scene,camera:camera,group:group,raf:null,touched:false,
  setColor:function(hex){if(selected)selected.mat.color.set(hex);},
  reset:function(){parts.forEach(function(pd){pd.mat.color.set(pd.def);});},
  snapshot:function(){renderer.render(scene,camera);return renderer.domElement.toDataURL("image/png");}};
 (function loop(){LIVE3D.raf=requestAnimationFrame(loop);if(!LIVE3D.touched)group.rotation.y+=.004;renderer.render(scene,camera);})();}

function color3DSetColor(hex){if(LIVE3D&&LIVE3D.setColor)LIVE3D.setColor(hex);}
function color3DReset(){if(LIVE3D&&LIVE3D.reset)LIVE3D.reset();}
function color3DSnapshot(){return(LIVE3D&&LIVE3D.snapshot)?LIVE3D.snapshot():null;}

window.COLOR3D_TEMPLATES=COLOR3D_TEMPLATES;
window.render3DColorTemplate=render3DColorTemplate;
window.color3DSetColor=color3DSetColor;
window.color3DReset=color3DReset;
window.color3DSnapshot=color3DSnapshot;
window.dispose3DColor=dispose3DColor;
