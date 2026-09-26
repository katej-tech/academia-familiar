"use strict";
/* ============ CUERPO HUMANO EN 3D POR SISTEMAS (explora y entiende cómo funciona) ============
   v2 tras auditoría: el cuerpo era un muñeco de cajas con seis esferas de colores, sin forma de
   órganos y sin explicar sistemas. Ahora hay 5 sistemas (óseo, circulatorio, respiratorio,
   digestivo, nervioso): cada uno muestra SUS órganos con forma reconocible dentro de un cuerpo
   transparente; se cambia de sistema con botones, se gira arrastrando y un toque en cualquier
   órgano explica qué hace. El juego de "señala las partes/órganos" (games3.js) sigue aparte. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

function P(){return window.P3D;}
function tube(g,pts,r,color,opt){
 const p=P();const up=new THREE.Vector3(0,1,0);
 for(let i=0;i<pts.length-1;i++){
  const a=new THREE.Vector3(pts[i][0],pts[i][1],pts[i][2]),b=new THREE.Vector3(pts[i+1][0],pts[i+1][1],pts[i+1][2]);
  const len=a.distanceTo(b);const m=p.mk(g,p.CYL(r,r,len,8),color,null,1,null,opt);
  m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());
  if(i>0){p.mk(g,p.SPH(r*1.02,8,6),color,[a.x,a.y,a.z],1,null,opt);}}}

/* cada sistema: partes con nombre, emoji, explicación para niños y cómo dibujarlas */
const BODY_SYS=[
 {id:"oseo",nm:"Óseo",e:"🦴",color:"#E5E7EB",desc:"El sistema óseo son todos los huesos. Sostienen el cuerpo, le dan forma y protegen los órganos: el cráneo protege el cerebro y las costillas protegen el corazón y los pulmones. Un adulto tiene 206 huesos.",
  parts:[
   {id:"craneo",nm:"El cráneo",e:"💀",tx:"El cráneo es el hueso de la cabeza. Protege al cerebro como un casco.",build:function(g){const p=P();p.mk(g,p.SPH(.19,18,14),"#F1F5F9",[0,1.02,0],[1,1.08,1],null,{o:.04});p.mk(g,p.BOX(.16,.07,.12),"#E2E8F0",[0,.85,.07],1,null,{o:.06});[-1,1].forEach(function(s){p.mk(g,p.SPH(.045,8,6),"#1E2A4A",[s*.07,1.02,.16],[1,1.2,.5]);});}},
   {id:"columna",nm:"La columna vertebral",e:"🦴",tx:"La columna vertebral es una fila de huesitos llamados vértebras. Te deja doblarte y protege la médula espinal.",build:function(g){const p=P();for(let i=0;i<13;i++)p.mk(g,p.CYL(.045,.045,.05,10),"#F1F5F9",[0,.78-i*.075,-.07],1,null,{o:.08});}},
   {id:"costillas",nm:"Las costillas",e:"🫁",tx:"Las costillas forman una jaula que protege el corazón y los pulmones.",build:function(g){const p=P();for(let i=0;i<5;i++){[0,1].forEach(function(k){const t=p.mk(g,new THREE.TorusGeometry(.19-i*.008,.014,8,20,Math.PI*1.15),"#F1F5F9",[0,.6-i*.075,-.02],1,[Math.PI/2,0,k?Math.PI*.05:Math.PI*.83],{o:.1});});}p.mk(g,p.BOX(.045,.3,.02),"#E2E8F0",[0,.46,.17],1,null,{o:.1});}},
   {id:"pelvis",nm:"La pelvis",e:"🍑",tx:"La pelvis es el hueso de la cadera. Sostiene el peso de la parte de arriba y conecta con las piernas.",build:function(g){const p=P();p.mk(g,new THREE.TorusGeometry(.17,.045,10,20),"#F1F5F9",[0,-.2,0],1,[Math.PI/2,0,0],{o:.06});}},
   {id:"brazos",nm:"Los huesos de los brazos",e:"💪",tx:"En cada brazo hay un hueso largo arriba (el húmero) y dos abajo (radio y cúbito). El codo los une.",build:function(g){const p=P();[-1,1].forEach(function(s){p.mk(g,p.CYL(.04,.04,.34,10),"#F1F5F9",[s*.34,.42,0],1,[0,0,s*.1],{o:.08});p.mk(g,p.SPH(.055,10,8),"#E2E8F0",[s*.365,.24,0]);p.mk(g,p.CYL(.035,.03,.32,10),"#F1F5F9",[s*.4,.05,0],1,[0,0,s*.12],{o:.08});p.mk(g,p.SPH(.06,10,8),"#E2E8F0",[s*.42,-.14,0]);});}},
   {id:"piernas",nm:"Los huesos de las piernas",e:"🦵",tx:"El fémur, en el muslo, es el hueso más largo y fuerte del cuerpo. La rótula protege la rodilla.",build:function(g){const p=P();[-1,1].forEach(function(s){p.mk(g,p.CYL(.055,.05,.5,10),"#F1F5F9",[s*.12,-.55,0],1,null,{o:.07});p.mk(g,p.SPH(.07,10,8),"#E2E8F0",[s*.12,-.82,.03]);p.mk(g,p.CYL(.045,.04,.44,10),"#F1F5F9",[s*.12,-1.07,0],1,null,{o:.07});p.mk(g,p.BOX(.1,.05,.2),"#E2E8F0",[s*.12,-1.3,.05],1,null,{o:.08});});}}
  ]},
 {id:"circulatorio",nm:"Circulatorio",e:"❤️",color:"#EF4444",desc:"El sistema circulatorio mueve la sangre por todo el cuerpo. El corazón es la bomba: empuja la sangre con oxígeno por las arterias (rojas) y las venas (azules) la traen de vuelta. ¡Tu corazón late más de 100 mil veces al día!",
  parts:[
   {id:"corazon",nm:"El corazón",e:"❤️",tx:"El corazón es un músculo del tamaño de tu puño. Late y bombea la sangre a todo el cuerpo.",build:function(g){const p=P();const h=p.mk(g,p.heartGeo(),"#EF4444",[-.05,.44,.07],.3,[.1,0,.35],{o:.05,m:{roughness:.35}});}},
   {id:"arterias",nm:"Las arterias",e:"🔴",tx:"Las arterias llevan la sangre con oxígeno desde el corazón hacia todo el cuerpo. Se ven rojas.",build:function(g){tube(g,[[-.04,.5,.04],[-.04,.7,0],[-.02,.86,0]],.028,"#DC2626");tube(g,[[-.04,.46,0],[-.04,.2,-.02],[-.06,-.15,-.02],[-.12,-.5,0],[-.12,-1.2,0]],.026,"#DC2626");tube(g,[[-.06,-.15,-.02],[.1,-.5,0],[.12,-1.2,0]],.026,"#DC2626");tube(g,[[-.05,.66,0],[-.28,.62,0],[-.4,.3,0],[-.44,-.1,0]],.022,"#DC2626");tube(g,[[-.03,.66,0],[.24,.62,0],[.38,.3,0],[.42,-.1,0]],.022,"#DC2626");}},
   {id:"venas",nm:"Las venas",e:"🔵",tx:"Las venas traen la sangre de vuelta al corazón. Se ven azules porque llevan menos oxígeno.",build:function(g){const o=.06;tube(g,[[.03+o,.5,.04],[.03+o,.7,0],[.02+o,.86,0]],.024,"#2563EB");tube(g,[[.03+o,.46,0],[.03+o,.2,-.02],[.04,-.15,-.02],[-.06,-.5,0],[-.06,-1.2,0]],.022,"#2563EB");tube(g,[[.04,-.15,-.02],[.16,-.5,0],[.18,-1.2,0]],.022,"#2563EB");tube(g,[[.02,.66,0],[-.22,.6,0],[-.34,.3,0],[-.4,-.1,0]],.018,"#2563EB");tube(g,[[.05,.66,0],[.3,.6,0],[.34,.3,0],[.38,-.1,0]],.018,"#2563EB");}}
  ]},
 {id:"respiratorio",nm:"Respiratorio",e:"🫁",color:"#F9A8D4",desc:"El sistema respiratorio te permite respirar. El aire entra por la nariz, baja por la tráquea y llena los pulmones, donde el oxígeno pasa a la sangre. Luego sacamos el aire con dióxido de carbono.",
  parts:[
   {id:"nariz",nm:"La nariz",e:"👃",tx:"Por la nariz entra el aire. Sus pelitos y el moco limpian el polvo antes de que baje.",build:function(g){const p=P();p.mk(g,p.CON(.05,.12,10),"#F0B79A",[0,.97,.23],1,[Math.PI/2.4,0,0],{o:.1});p.mk(g,p.CYL(.035,.035,.14,8),"#F9A8D4",[0,.9,.1],1,[.5,0,0],{o:.1});}},
   {id:"traquea",nm:"La tráquea",e:"🌬️",tx:"La tráquea es un tubo con anillitos que lleva el aire desde la garganta hasta los pulmones.",build:function(g){const p=P();p.mk(g,p.CYL(.04,.04,.36,12),"#BAE6FD",[0,.62,0],1,null,{o:.08});for(let i=0;i<6;i++)p.mk(g,new THREE.TorusGeometry(.042,.008,6,12),"#7DD3FC",[0,.78-i*.06,0],1,[Math.PI/2,0,0]);tube(g,[[0,.44,0],[-.08,.4,0],[-.12,.34,0]],.03,"#BAE6FD");tube(g,[[0,.44,0],[.08,.4,0],[.12,.34,0]],.03,"#BAE6FD");}},
   {id:"pulmones",nm:"Los pulmones",e:"🫁",tx:"Los pulmones son dos bolsas esponjosas. Cuando respiras se llenan de aire y el oxígeno pasa a tu sangre.",build:function(g){const p=P();[-1,1].forEach(function(s){p.mk(g,p.SPH(.15,18,14),"#F9A8D4",[s*.15,.36,.01],[.85,1.7,.7],[0,0,s*-.08],{o:.05,m:{roughness:.4}});});}},
   {id:"diafragma",nm:"El diafragma",e:"🌊",tx:"El diafragma es un músculo debajo de los pulmones. Se mueve hacia abajo y hacia arriba para ayudarte a respirar.",build:function(g){const p=P();p.mk(g,new THREE.SphereGeometry(.2,20,10,0,Math.PI*2,0,Math.PI/2),"#60A5FA",[0,.1,0],[1.1,.5,.8],null,{o:.06,m:{roughness:.4}});}}
  ]},
 {id:"digestivo",nm:"Digestivo",e:"🍔",color:"#FBBF24",desc:"El sistema digestivo convierte la comida en energía. La comida baja por el esófago, el estómago la mezcla con jugos, el intestino delgado absorbe los nutrientes y el intestino grueso saca lo que sobra.",
  parts:[
   {id:"esofago",nm:"El esófago",e:"🍽️",tx:"El esófago es el tubo que lleva la comida desde la boca hasta el estómago.",build:function(g){tube(g,[[0,.82,.02],[0,.62,.03],[-.02,.44,.05],[-.06,.34,.07]],.03,"#FB923C");}},
   {id:"estomago",nm:"El estómago",e:"🍔",tx:"El estómago es como una bolsa de músculo. Mezcla la comida con jugos que la deshacen.",build:function(g){const p=P();p.mk(g,p.SPH(.11,16,12),"#F59E0B",[-.08,.26,.08],[1.3,1,.9],[0,0,.5],{o:.06,m:{roughness:.4}});}},
   {id:"higado",nm:"El hígado",e:"🟤",tx:"El hígado es grandote. Limpia la sangre y ayuda a digerir las grasas.",build:function(g){const p=P();p.mk(g,p.SPH(.13,16,12),"#92400E",[.11,.3,.07],[1.5,.7,.8],[0,0,-.15],{o:.06,m:{roughness:.4}});}},
   {id:"delgado",nm:"El intestino delgado",e:"🌀",tx:"El intestino delgado mide varios metros, enrollado como un caracol. Aquí los nutrientes de la comida pasan a la sangre.",build:function(g){const p=P();for(let i=0;i<5;i++)p.mk(g,new THREE.TorusGeometry(.1,.032,8,16),i%2?"#F9A8D4":"#F472B6",[(i%2?.03:-.03),.1-i*.055,.06],1,[Math.PI/2,0,i*.6],{o:.07});}},
   {id:"grueso",nm:"El intestino grueso",e:"🟠",tx:"El intestino grueso rodea al delgado. Absorbe el agua que sobra y forma los desechos.",build:function(g){tube(g,[[.2,-.18,.06],[.2,.06,.06],[.1,.14,.06],[-.1,.14,.06],[-.2,.06,.06],[-.2,-.18,.06]],.04,"#D97706",{o:.06});}}
  ]},
 {id:"nervioso",nm:"Nervioso",e:"🧠",color:"#F472B6",desc:"El sistema nervioso es el jefe del cuerpo. El cerebro piensa y da órdenes, la médula espinal es la autopista de mensajes y los nervios los llevan a todas partes: por eso puedes sentir, moverte y pensar.",
  parts:[
   {id:"cerebro",nm:"El cerebro",e:"🧠",tx:"El cerebro es el jefe: piensa, recuerda, siente y manda órdenes a todo el cuerpo.",build:function(g){const p=P();[-1,1].forEach(function(s){p.mk(g,p.SPH(.11,16,12),"#F9A8D4",[s*.055,1.04,0],[1,.9,1.15],null,{o:.06,m:{roughness:.4}});});p.mk(g,p.SPH(.06,10,8),"#F472B6",[0,.94,-.08],[1.4,.8,1],null,{o:.08});}},
   {id:"medula",nm:"La médula espinal",e:"🛣️",tx:"La médula espinal baja por dentro de la columna. Es una autopista que lleva los mensajes del cerebro al cuerpo y de vuelta.",build:function(g){tube(g,[[0,.9,-.07],[0,.6,-.07],[0,.2,-.07],[0,-.1,-.07]],.025,"#FDE047",{m:{emissive:"#FDE047",emissiveIntensity:.25}});}},
   {id:"nervios",nm:"Los nervios",e:"⚡",tx:"Los nervios son como cables que salen de la médula y llegan a la piel y los músculos. Llevan mensajes: ¡ay, está caliente!",build:function(g){const c="#FBBF24";tube(g,[[0,.6,-.07],[-.2,.58,-.03],[-.36,.3,0],[-.42,-.1,0]],.014,c);tube(g,[[0,.6,-.07],[.2,.58,-.03],[.36,.3,0],[.42,-.1,0]],.014,c);tube(g,[[0,-.1,-.07],[-.1,-.4,-.02],[-.12,-.9,0],[-.12,-1.25,.03]],.014,c);tube(g,[[0,-.1,-.07],[.1,-.4,-.02],[.12,-.9,0],[.12,-1.25,.03]],.014,c);tube(g,[[0,.2,-.07],[-.14,.2,0],[-.16,.05,.06]],.012,c);tube(g,[[0,.2,-.07],[.14,.2,0],[.16,.05,.06]],.012,c);}}
  ]}
];

let LIVE=null;
function dispose3DBody(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(function(m){m.dispose();});else o.material.dispose();}});
  LIVE.renderer.dispose();
  if(LIVE.renderer.domElement&&LIVE.renderer.domElement.parentNode)LIVE.renderer.domElement.parentNode.removeChild(LIVE.renderer.domElement);
 }catch(e){}
 LIVE=null;}

function skin(g){
 const p=P();const sm=function(){return{m:{transparent:true,opacity:.2,depthWrite:false,roughness:.6}};};
 const S="#F1B58C";
 p.mk(g,p.SPH(.25,20,16),S,[0,1.0,0],[1,1.08,1],null,sm());
 [-1,1].forEach(function(s){p.mk(g,p.SPH(.04,8,6),S,[s*.25,1.0,0],1,null,sm());});
 p.mk(g,p.CYL(.08,.09,.14,12),S,[0,.82,0],1,null,sm());
 p.mk(g,p.CYL(.27,.24,.86,20),S,[0,.32,0],[1.05,1,.72],null,sm());
 p.mk(g,p.SPH(.26,16,12),S,[0,-.15,0],[1,.7,.72],null,sm());
 [-1,1].forEach(function(s){
  p.mk(g,p.SPH(.075,10,8),S,[s*.33,.68,0],1,null,sm());
  p.mk(g,p.CYL(.065,.058,.42,12),S,[s*.37,.42,0],1,[0,0,s*.1],sm());p.mk(g,p.CYL(.055,.045,.4,12),S,[s*.41,.02,0],1,[0,0,s*.1],sm());p.mk(g,p.SPH(.06,10,8),S,[s*.44,-.2,0],1,null,sm());
  p.mk(g,p.CYL(.1,.085,.52,12),S,[s*.12,-.55,0],1,null,sm());p.mk(g,p.CYL(.075,.06,.5,12),S,[s*.12,-1.05,0],1,null,sm());p.mk(g,p.BOX(.12,.06,.24),S,[s*.12,-1.3,.05],1,null,sm());});
 /* carita amiga */
 [-1,1].forEach(function(s){p.mk(g,p.SPH(.03,8,6),"#1E2A4A",[s*.085,1.06,.22],1,null,{m:{roughness:.3}});});
 p.mk(g,p.BOX(.08,.014,.014),"#B45309",[0,.94,.24]);}

function render3DBody(containerId,sysId,onSelect){
 const el=document.getElementById(containerId);if(!el||!window.P3D)return;
 dispose3DBody();
 const w=el.clientWidth||300,h=el.clientHeight||340;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#EAF6FF");
 const camera=new THREE.PerspectiveCamera(34,w/h,.1,50);
 camera.position.set(0,-.05,5.1);camera.lookAt(0,-.08,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.5));
 const dl=new THREE.DirectionalLight(0xffffff,1.2);dl.position.set(3,5,4);scene.add(dl);
 const fl=new THREE.DirectionalLight(0xffffff,.5);fl.position.set(-3,2,2);scene.add(fl);
 const group=new THREE.Group();scene.add(group);
 const skinG=new THREE.Group();skin(skinG);group.add(skinG);
 const organsG=new THREE.Group();group.add(organsG);
 const parts=[];let selected=null;
 function setSystem(id){
  while(organsG.children.length){const c=organsG.children.pop();c.traverse(function(o){if(o.geometry&&o.geometry.dispose&&o.geometry.type!=="ExtrudeGeometry")o.geometry.dispose();if(o.material&&o.material.dispose&&o.material!==undefined)o.material.dispose();});}
  parts.length=0;selected=null;
  const sys=BODY_SYS.find(function(s){return s.id===id;})||BODY_SYS[0];
  sys.parts.forEach(function(pt){const pg=new THREE.Group();pg.userData.partId=pt.id;pt.build(pg);organsG.add(pg);
   const meshes=[];pg.traverse(function(o){if(o.isMesh){o.userData.partId=pt.id;if(!o.userData.isOutline)meshes.push(o);}});
   parts.push({id:pt.id,meshes:meshes,group:pg});});
  if(onSelect)onSelect(null,sys.id);}
 function highlight(id){
  parts.forEach(function(pd){pd.meshes.forEach(function(m){if(m.material&&m.material.emissive){m.material.emissive.set(pd.id===id?0x4477ff:0x000000);m.material.emissiveIntensity=pd.id===id?.6:0;}});});
  selected=id;}
 setSystem(sysId);
 group.rotation.y=.3;
 const raycaster=new THREE.Raycaster();const cv=renderer.domElement;cv.style.touchAction="none";
 let drag=null;
 cv.addEventListener("pointerdown",function(e){drag={x:e.clientX,y:e.clientY,moved:0};try{cv.setPointerCapture(e.pointerId);}catch(_){}});
 cv.addEventListener("pointermove",function(e){if(!drag)return;const dx=e.clientX-drag.x;drag.moved+=Math.abs(dx)+Math.abs(e.clientY-drag.y);group.rotation.y+=dx*.012;drag.x=e.clientX;drag.y=e.clientY;LIVE.touched=true;});
 cv.addEventListener("pointerup",function(e){
  if(drag&&drag.moved<8){
   const r=cv.getBoundingClientRect();
   raycaster.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},camera);
   const all=[];parts.forEach(function(pd){pd.meshes.forEach(function(m){all.push(m);});});
   const hits=raycaster.intersectObjects(all,false);
   if(hits.length){const id=hits[0].object.userData.partId;highlight(id);if(onSelect)onSelect(id);}}
  drag=null;});
 cv.addEventListener("pointercancel",function(){drag=null;});
 LIVE={renderer:renderer,scene:scene,camera:camera,raf:null,touched:false,setSystem:function(id){setSystem(id);},highlight:highlight,parts:parts};
 (function loop(){LIVE.raf=requestAnimationFrame(loop);if(!LIVE.touched)group.rotation.y+=.004;renderer.render(scene,camera);})();}
function body3DSetSystem(id){if(LIVE)LIVE.setSystem(id);}
function body3DHighlight(id){if(LIVE)LIVE.highlight(id);}

window.BODY_SYS=BODY_SYS;
window.render3DBody=render3DBody;
window.body3DSetSystem=body3DSetSystem;
window.body3DHighlight=body3DHighlight;
window.dispose3DBody=dispose3DBody;
