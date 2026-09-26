"use strict";
/* ============ CRIATURAS EN 3D: taller + colección capturada (Three.js) ============
   v2 tras auditoría real: la v1 mapeaba cada pieza a UNA forma suelta (esfera, cono…) y el
   taller quedaba como "muñeco de bolas"; las criaturas eran un cono con un cubo flotando.
   Ahora las 30 piezas del taller (cabeza/cuerpo/extra) son modelos armados y reconocibles, y
   las 100 criaturas se generan con cara, orejas, cola y un accesorio según su elemento
   (llama, gota, hoja, rayo…), con 3 etapas de evolución. Todo sale de js/parts3d.js (P3D).
   const WORKSHOP_PARTS / CRITTERS / critterForm viven en kid.js — kid.js los cuelga en window. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

function P(){return window.P3D;}
function tint(base,t,k){
 if(!t)return base;
 const c=new THREE.Color(base).lerp(new THREE.Color(t),k==null?.4:k);return "#"+c.getHexString();}
function lighten(hex,k){const c=new THREE.Color(hex).lerp(new THREE.Color("#ffffff"),k);return "#"+c.getHexString();}
function darken(hex,k){const c=new THREE.Color(hex).lerp(new THREE.Color("#000000"),k);return "#"+c.getHexString();}
function idx(cat,key){const a=(window.WORKSHOP_PARTS&&window.WORKSHOP_PARTS[cat])||[];const i=a.indexOf(key);return i<0?0:i;}

/* ---------- CUERPOS (ocupan y∈[-.5,.12]) ---------- */
const BODIES=[
 function(g,T){const p=P();p.mk(g,p.BOX(.72,.5,.52),T("#E53935"),[0,-.2,0],1,null,{o:.05});[[-.2,-.13],[.2,-.13],[-.2,.13],[.2,.13]].forEach(function(s){p.mk(g,p.CYL(.075,.075,.07,14),T("#E53935"),[s[0],.09,s[1]],1,null,{o:.08});});},
 function(g,T){const p=P();p.mk(g,p.CYL(.34,.34,.46,20),T("#9AA5B1"),[0,-.2,0],1,null,{o:.05,m:{metalness:.4,roughness:.4}});for(let i=0;i<10;i++){const a=i*Math.PI*2/10;p.mk(g,p.BOX(.1,.46,.1),T("#9AA5B1"),[Math.cos(a)*.37,-.2,Math.sin(a)*.37],1,[0,-a,0],{m:{metalness:.4,roughness:.4}});}p.mk(g,p.CYL(.12,.12,.48,12),"#5B6673",[0,-.2,0]);},
 function(g,T){const p=P();p.mk(g,p.CYL(.36,.34,.42,6),T("#3B82F6"),[0,-.16,0],1,null,{o:.05});p.mk(g,p.CON(.34,.26,6),T("#3B82F6"),[0,-.5,0],1,[Math.PI,0,0],{o:.05});p.mk(g,p.BOX(.1,.36,.04),"#FFFFFF",[0,-.24,.32]);p.mk(g,p.BOX(.34,.1,.04),"#FFFFFF",[0,-.16,.32]);},
 function(g,T){const p=P();p.mk(g,p.CYL(.26,.3,.62,22),T("#E2E8F0"),[0,-.2,0],1,null,{o:.05});[0,1,2].forEach(function(i){const a=i*Math.PI*2/3;p.mk(g,p.CON(.14,.32,4),T("#EF4444"),[Math.cos(a)*.3,-.46,Math.sin(a)*.3],1,[0,-a,-.35],{o:.06});});p.mk(g,p.SPH(.09,14,10),"#60A5FA",[0,-.14,.29],[1,1,.5],null,{o:.12});p.mk(g,p.CON(.16,.28,12),"#F97316",[0,-.72,0],1,[Math.PI,0,0],{m:{emissive:"#F97316",emissiveIntensity:.5}});},
 function(g,T){const p=P();p.mk(g,p.SPH(.5,20,16),T("#E0862F"),[0,-.3,0],[.68,.5,.3],null,{o:.05});p.mk(g,p.SPH(.5,20,16),T("#E0862F"),[0,-.02,0],[.5,.36,.3],null,{o:.05});p.mk(g,p.CYL(.13,.13,.03,16),"#3A2A22",[0,-.18,.14],1,[Math.PI/2,0,0]);p.mk(g,p.BOX(.07,.75,.05),"#7A4F27",[.36,.28,-.05],1,[0,0,-.35],{o:.08});p.mk(g,p.BOX(.12,.16,.06),"#5D3B1A",[.5,.68,-.05],1,[0,0,-.35]);[0,1,2].forEach(function(i){p.mk(g,p.BOX(.24,.015,.02),"#F5E6C8",[0,-.36-i*.04,.16]);});},
 function(g,T){const p=P();p.mk(g,p.BOX(.72,.5,.52),T("#B0B7C3"),[0,-.2,0],1,null,{o:.05,m:{roughness:.9}});[-.27,-.09,.09,.27].forEach(function(x){p.mk(g,p.BOX(.12,.1,.12),T("#B0B7C3"),[x,.09,.2],1,null,{o:.08});});p.mk(g,p.BOX(.18,.26,.04),"#5D3B1A",[0,-.33,.27],1,null,{o:.1});p.mk(g,p.CYL(.09,.09,.04,14),"#5D3B1A",[0,-.2,.27],1,[Math.PI/2,0,0]);[-.24,.24].forEach(function(x){p.mk(g,p.BOX(.08,.12,.04),"#334155",[x,-.14,.27]);});},
 function(g,T){const p=P();p.mk(g,p.BOX(.56,.56,.56),T("#A5D8F5"),[0,-.22,0],1,[0,.35,0],{o:.04,m:{transparent:true,opacity:.78,roughness:.1}});[[.1,-.1,.3],[-.15,-.3,.28]].forEach(function(s){p.mk(g,p.SPH(.03,8,6),"#FFFFFF",s);});},
 function(g,T){const p=P();p.mk(g,p.CYL(.2,.2,.62,18),T("#B0BEC5"),[0,-.22,0],1,null,{o:.05,m:{metalness:.6,roughness:.3}});for(let i=0;i<5;i++)p.mk(g,new THREE.TorusGeometry(.205,.03,8,20),T("#90A4AE"),[0,-.42+i*.12,0],1,[Math.PI/2,0,0],{m:{metalness:.6,roughness:.3}});p.mk(g,p.CYL(.3,.3,.12,6),T("#78909C"),[0,.1,0],1,null,{o:.05,m:{metalness:.6,roughness:.3}});p.mk(g,p.CON(.2,.16,16),T("#B0BEC5"),[0,-.6,0],1,[Math.PI,0,0]);},
 function(g,T){const p=P();p.mk(g,p.starGeo(.55,.26),T("#FBBF24"),[0,-.2,0],[1.15,1.15,1.7],null,{o:.04,m:{emissive:"#FBBF24",emissiveIntensity:.18}});},
 function(g,T){const p=P();p.mk(g,p.CYL(.2,.25,.4,18),T("#F5EBDD"),[0,-.32,0],1,null,{o:.06});p.mk(g,new THREE.SphereGeometry(.46,22,14,0,Math.PI*2,0,Math.PI/2),T("#E53935"),[0,-.12,0],[1,.8,1],null,{o:.05});[[.2,.05,.3],[-.22,0,.28],[0,.14,.1],[.05,-.04,.42]].forEach(function(s){p.mk(g,p.SPH(.07,10,8),"#FFFFFF",s,[1,1,.5]);});}
];

/* ---------- CABEZAS (centradas en el origen; el frente es +z; radio ~.3) ---------- */
function eye(g,x,y,z,r,c){const p=P();p.mk(g,p.SPH(r,12,10),c||"#1E2A4A",[x,y,z],1,null,{m:{roughness:.3}});p.mk(g,p.SPH(r*.32,6,6),"#FFFFFF",[x+r*.3,y+r*.35,z+r*.75]);}
function animalHead(g,T,o){
 const p=P();p.mk(g,p.SPH(.33,24,18),T(o.color),[0,0,0],1,null,{o:.05});
 const sn=p.mk(g,p.SPH(.15,16,12),o.snout,[0,-.1,.27],[1,.72,.92]);
 p.mk(g,p.SPH(.045,10,8),"#3A2A22",[0,-.06,.4]);
 eye(g,-.16,.06,.27,.052);eye(g,.16,.06,.27,.052);
 [-1,1].forEach(function(s){
  if(o.ears==="tall"){p.mk(g,p.CON(.12,.34,10),T(o.ear),[s*.19,.38,0],1,[0,0,s*.22],{o:.07});p.mk(g,p.CON(.07,.14,8),"#20262E",[s*.235,.51,0],1,[0,0,s*.22]);}
  else p.mk(g,p.CON(.13,.24,10),T(o.ear),[s*.2,.3,0],1,[0,0,s*.25],{o:.07});});
 if(o.whiskers)[-1,1].forEach(function(s){[0,1,2].forEach(function(i){const w=p.mk(g,p.CYL(.005,.005,.22,4),"#FFFFFF",[s*.2,-.1-i*.03,.31]);w.rotation.z=Math.PI/2+s*.12;w.rotation.y=s*(.3+i*.12);});});
 if(o.cheeks)[-1,1].forEach(function(s){p.mk(g,p.SPH(.11,12,10),"#FFFFFF",[s*.24,-.08,.2]);});}
const HEADS=[
 function(g,T){const p=P();p.mk(g,p.BOX(.6,.5,.5),T("#90A4BE"),[0,0,0],1,null,{o:.05,m:{metalness:.35,roughness:.4}});p.mk(g,p.CYL(.015,.015,.2,6),"#5B6673",[0,.35,0]);p.mk(g,p.SPH(.05,10,8),"#EF4444",[0,.46,0],1,null,{m:{emissive:"#EF4444",emissiveIntensity:.6}});[-1,1].forEach(function(s){p.mk(g,p.BOX(.13,.1,.04),"#22D3EE",[s*.14,.06,.26],1,null,{m:{emissive:"#22D3EE",emissiveIntensity:.8}});p.mk(g,p.CYL(.05,.05,.08,10),"#5B6673",[s*.32,0,0],1,[0,0,Math.PI/2]);});p.mk(g,p.BOX(.3,.06,.03),"#1E2A4A",[0,-.14,.26]);[-.08,0,.08].forEach(function(x){p.mk(g,p.BOX(.012,.06,.035),"#90A4BE",[x,-.14,.27]);});},
 function(g,T){const p=P();p.mk(g,p.SPH(.32,22,16),T("#3FBF6A"),[0,0,0],1,null,{o:.05});p.mk(g,p.SPH(.16,14,10),T("#8EE3AA"),[0,-.1,.26],[1,.75,1.1]);[-1,1].forEach(function(s){p.mk(g,p.SPH(.02,6,6),"#1E2A4A",[s*.06,-.06,.4]);p.mk(g,p.CON(.05,.22,8),"#F5EBDD",[s*.18,.34,.02],1,[0,0,s*.4],{o:.08});eye(g,s*.16,.08,.27,.055,"#FDE047");});[0,1,2].forEach(function(i){p.mk(g,p.CON(.05,.12,6),"#2E9E52",[0,.3-i*.03,-.12-i*.08],1,[-.6,0,0]);});},
 function(g,T){const p=P();p.mk(g,p.SPH(.44,22,16),T("#8A5A2B"),[0,0,-.08],[1,1,.65],null,{o:.05});p.mk(g,p.SPH(.3,22,16),T("#F0B860"),[0,0,.02],1,null,{o:.05});[-1,1].forEach(function(s){p.mk(g,p.SPH(.09,10,8),T("#F0B860"),[s*.22,.28,0],1,null,{o:.08});});p.mk(g,p.SPH(.14,14,10),"#FDE9C0",[0,-.1,.24],[1,.75,1]);p.mk(g,p.SPH(.05,10,8),"#3A2A22",[0,-.05,.36],[1.3,.9,1]);eye(g,-.13,.07,.26,.05);eye(g,.13,.07,.26,.05);},
 function(g,T){const p=P();p.mk(g,p.SPH(.34,22,16),T("#7CE07A"),[0,.03,0],[.95,1.15,.9],null,{o:.05});[-1,1].forEach(function(s){const e=p.mk(g,p.SPH(.1,14,10),"#0F172A",[s*.14,.05,.27],[.9,1.4,.4],[0,0,s*.5],{o:.08});p.mk(g,p.SPH(.03,6,6),"#FFFFFF",[s*.14+.03,.1,.33]);p.mk(g,p.CYL(.008,.008,.2,5),"#5CB85A",[s*.1,.4,0],1,[0,0,s*.2]);p.mk(g,p.SPH(.035,8,6),"#F472B6",[s*.14,.5,0]);});p.mk(g,p.BOX(.1,.014,.02),"#166534",[0,-.14,.3]);},
 function(g,T){animalHead(g,T,{color:"#F4A65B",snout:"#FFE9D2",ear:"#F4A65B",whiskers:true});},
 function(g,T){animalHead(g,T,{color:"#EF823E",snout:"#FFFFFF",ear:"#EF823E",ears:"tall",cheeks:true,whiskers:true});},
 function(g,T){const p=P();p.mk(g,p.SPH(.3,20,16),T("#F97316"),[0,0,0],[1.05,.95,.95],null,{o:.05});[-1,1].forEach(function(s){p.mk(g,p.SPH(.26,20,16),T("#EA6A0C"),[s*.17,0,-.02],[.75,.95,.9],null,{o:.05});});p.mk(g,p.CYL(.035,.045,.13,8),"#4D7C0F",[0,.3,0],1,[.2,0,0],{o:.1});[-1,1].forEach(function(s){p.mk(g,p.CON(.06,.11,3),"#FDE047",[s*.13,.06,.3],1,[0,0,Math.PI],{m:{emissive:"#FDE047",emissiveIntensity:.7}});});p.mk(g,p.BOX(.3,.05,.03),"#FDE047",[0,-.13,.3],1,null,{m:{emissive:"#FDE047",emissiveIntensity:.7}});[-.09,.09].forEach(function(x){p.mk(g,p.CON(.03,.06,3),"#F97316",[x,-.11,.31],1,[0,0,Math.PI]);});},
 function(g,T){const p=P();const rows=["0010100","0111110","1101011","1111111","1011101","0010100"];const c=.085;rows.forEach(function(r,ri){for(let ci=0;ci<7;ci++){if(r[ci]==="1")p.mk(g,p.BOX(c,c,.2),(ri===2&&(ci===2||ci===4))?"#FFFFFF":T("#8B5CF6"),[(ci-3)*c,(2.5-ri)*c,0],1,null,{o:.06});}});[2,4].forEach(function(ci){p.mk(g,p.BOX(c*.5,c*.5,.03),"#0F172A",[(ci-3)*c,(2.5-2)*c,.11]);});},
 function(g,T){const p=P();p.mk(g,p.SPH(.34,22,14),T("#66BB6A"),[0,-.02,0],[1.15,.8,.95],null,{o:.05});[-1,1].forEach(function(s){p.mk(g,p.SPH(.13,14,10),"#F1F8E9",[s*.17,.2,.1],1,null,{o:.08});p.mk(g,p.SPH(.06,10,8),"#1E2A4A",[s*.17,.2,.21]);p.mk(g,p.SPH(.02,6,6),"#FFFFFF",[s*.17+.02,.23,.25]);p.mk(g,p.SPH(.025,6,6),"#2E7D32",[s*.06,-.02,.32]);p.mk(g,p.SPH(.05,8,6),"#F8A5C2",[s*.26,-.06,.22],[1,.7,.4]);});p.mk(g,p.BOX(.34,.03,.03),"#2E5A30",[0,-.1,.31],1,null,{});},
 function(g,T){const p=P();p.mk(g,p.SPH(.33,22,16),T("#9A6B3C"),[0,0,0],[1.08,.96,.92],null,{o:.05});[-1,1].forEach(function(s){p.mk(g,p.SPH(.13,14,10),"#FFF8E7",[s*.13,.04,.24],[1,1,.5]);p.mk(g,p.SPH(.075,10,8),"#FBBF24",[s*.13,.04,.3],[1,1,.4]);p.mk(g,p.SPH(.04,8,6),"#1E2A4A",[s*.13,.04,.33]);p.mk(g,p.CON(.07,.18,8),T("#7A4F27"),[s*.22,.32,0],1,[0,0,s*.3],{o:.08});});p.mk(g,p.CON(.05,.1,8),"#F59E42",[0,-.06,.33],1,[Math.PI,0,0]);}
];
/* altura de la coronilla por cabeza (para poner sombreros, coronas, etc.) */
const HEAD_TOP=[.28,.34,.42,.38,.34,.38,.3,.26,.32,.34];

/* ---------- EXTRAS ---------- */
const EXTRAS=[
 function(g,ht){g.add(place(P().acc("hat",1),[0,ht+.02,0]));},
 function(g,ht){g.add(place(P().acc("glasses",1),[0,.0,.31]));},
 function(g,ht){const p=P();[-1,1].forEach(function(s){p.mk(g,p.BOX(.26,.38,.07),"#FB923C",[s*.16,-.2,.28],1,[0,s*.18,0],{o:.06});p.mk(g,p.BOX(.26,.05,.075),"#FDE68A",[s*.16,-.18,.285],1,[0,s*.18,0]);});},
 function(g,ht){const p=P();p.mk(g,new THREE.TorusGeometry(.3,.075,10,24),"#EF4444",[0,.06,.02],1,[Math.PI/2,0,0],{o:.06});p.mk(g,p.BOX(.11,.34,.06),"#EF4444",[.2,-.12,.28],1,[0,0,.1],{o:.06});p.mk(g,p.BOX(.11,.05,.065),"#FFFFFF",[.2,-.06,.285],1,[0,0,.1]);},
 function(g,ht){g.add(place(P().acc("bolt",1.5),[.5,.05,0],[0,.4,.25]));},
 function(g,ht){g.add(place(P().acc("heart",1.6),[-.5,.1,.05],[0,-.3,-.2]));},
 function(g,ht){g.add(place(P().acc("bow",1.3),[.2,ht-.06,.12],[0,0,-.25]));},
 function(g,ht){g.add(place(P().acc("flame",1.6),[0,ht+.12,0]));},
 function(g,ht){g.add(place(P().acc("rainbow",1.7),[0,-.3,-.42]));},
 function(g,ht){g.add(place(P().acc("crown",1.15),[0,ht+.03,0]));}
];
function place(o,pos,rot){o.position.set(pos[0],pos[1],pos[2]);if(rot)o.rotation.set(rot[0],rot[1],rot[2]);return o;}

function buildWorkshop(group,sel){
 const T=function(base){return tint(base,sel.color,.4);};
 const bi=idx("cuerpo",sel.cuerpo),hi=idx("cabeza",sel.cabeza),ei=idx("extra",sel.extra);
 BODIES[bi](group,T);
 const hg=new THREE.Group();hg.position.set(0,.36,.04);HEADS[hi](hg,T);group.add(hg);
 /* chaleco(2), bufanda(3) y arcoíris(8) se ubican en coordenadas del cuerpo; el resto, relativas a la cabeza */
 const bodyExtra=(ei===2||ei===3||ei===8);
 const eg=bodyExtra?group:hg;
 EXTRAS[ei](eg,HEAD_TOP[hi]);
}

/* ---------- escena ---------- */
function make3DScene(container,bg){
 const w=container.clientWidth||260,h=container.clientHeight||220;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 renderer.setSize(w,h);
 container.innerHTML="";container.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 if(bg)scene.background=new THREE.Color(bg);
 const camera=new THREE.PerspectiveCamera(34,w/h,.1,50);
 camera.position.set(0,.5,4.1);camera.lookAt(0,.17,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.45));
 const dir=new THREE.DirectionalLight(0xffffff,1.3);dir.position.set(3,5,4);scene.add(dir);
 const fill=new THREE.DirectionalLight(0xffffff,.5);fill.position.set(-3,2,2);scene.add(fill);
 const plat=new THREE.Mesh(new THREE.CylinderGeometry(.85,.85,.08,32),new THREE.MeshStandardMaterial({color:"#E6ECF5",roughness:.9}));
 plat.position.y=-.86;scene.add(plat);
 return{renderer:renderer,scene:scene,camera:camera,plat:plat,raf:null};}

let LIVE=[];
function disposeCtx(ctx){
 try{
  if(ctx.raf)cancelAnimationFrame(ctx.raf);
  ctx.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(function(m){m.dispose();});else o.material.dispose();}});
  ctx.renderer.dispose();
  if(ctx.renderer.domElement&&ctx.renderer.domElement.parentNode)ctx.renderer.domElement.parentNode.removeChild(ctx.renderer.domElement);
 }catch(e){}}
function dispose3D(){LIVE.forEach(disposeCtx);LIVE=[];}
function spin(ctx,group,speed){
 (function loop(){ctx.raf=requestAnimationFrame(loop);group.rotation.y+=speed||.012;ctx.renderer.render(ctx.scene,ctx.camera);})();}

function render3DCreaturePreview(containerId,sel){
 const el=document.getElementById(containerId);if(!el||!window.P3D)return;
 const ctx=make3DScene(el,"#EAF6FF");
 const group=new THREE.Group();buildWorkshop(group,sel);group.rotation.y=.4;ctx.scene.add(group);
 LIVE.push(ctx);spin(ctx,group,.012);}

function snapshot3DCreature(sel){
 const off=document.createElement("div");off.style.width="240px";off.style.height="200px";
 const ctx=make3DScene(off,"#EAF6FF");
 const group=new THREE.Group();buildWorkshop(group,sel);group.rotation.y=.45;ctx.scene.add(group);
 ctx.renderer.render(ctx.scene,ctx.camera);
 const url=ctx.renderer.domElement.toDataURL("image/png");
 disposeCtx(ctx);return url;}

/* ---------- CRIATURAS (100): generadas, no a mano ---------- */
const EMO={
 "🔥":["#F97316","flame"],"🌋":["#C2410C","flame"],"🐉":["#22A559"],"🐲":["#3FBF6A"],"🦎":["#7CB342"],"🐊":["#4E8F3A"],"💧":["#38BDF8","drop"],"🌊":["#2E86DE","drop"],
 "🐟":["#60A5FA"],"🐬":["#7DB7E8"],"🐳":["#4A7BC8"],"🐋":["#3F6FB5"],"🐙":["#C2569E"],"🦑":["#B05CC9"],"🪼":["#C9A0DC"],"🐠":["#F59E42"],"🐡":["#F2C14E"],"🪸":["#F472B6"],
 "🍃":["#6DBE45","leaf"],"🌿":["#4CAF50","leaf"],"🌳":["#2E7D32","leaf"],"🌱":["#7CCB5A","leaf"],"🍀":["#43A047","leaf"],"🍁":["#D84315","leaf"],"🌻":["#FBC02D","flower"],"🌼":["#FFD54F","flower"],"🌸":["#F8A5C2","flower"],"🌵":["#5BA35B"],
 "⚡":["#FACC15","bolt"],"🌩️":["#7C8DB5","bolt"],"⛈️":["#6B7A99","bolt"],"🔋":["#84CC16","bolt"],"🌟":["#FBBF24","star"],"⭐":["#FBBF24","star"],"💫":["#FCD34D","star"],"✨":["#FCD34D","star"],"🌠":["#6366F1","star"],"🌌":["#4F46E5","star"],
 "🪨":["#8D8D8D","rock"],"⛰️":["#78716C","rock"],"🗻":["#94A3B8","rock"],"🧱":["#B45F3E","rock"],"🗿":["#8A8F98","rock"],"🏔️":["#A5B4C4","ice"],"❄️":["#A5D8F5","ice"],"🧊":["#A5D8F5","ice"],"⛄":["#F8FAFC","ice"],
 "🦊":["#EF823E"],"🐺":["#8A93A0"],"🦁":["#E6A23C"],"🐱":["#F4A65B"],"🐈":["#C9B79C"],"🐯":["#F08A24"],"🐆":["#D9A441"],"🐶":["#C99A62"],"🐕":["#B9834A"],"🦮":["#D8A657"],"🐭":["#B8B8C0"],"🐿️":["#B5713A"],"🦔":["#8B6B4A"],"🐼":["#F2F2F2"],"🐨":["#A6A6B4"],"🦥":["#A98E6B"],"🐹":["#F2CD7E"],"🐰":["#F6D7E8"],"🦘":["#C68B4E"],
 "🦉":["#9A6B3C"],"🐣":["#FFD54F"],"🐤":["#FFD54F"],"🦅":["#7A5230"],"🦜":["#E53935"],"🦆":["#7A9E54"],"🦩":["#F48FB1"],"🐔":["#F5F5F5"],"🐓":["#D84315"],"🐦":["#64B5F6"],"🕊️":["#F0F4F8"],"🦚":["#26A69A"],"🦤":["#6D5B4B"],"🦇":["#4B3F72"],
 "🦐":["#E4572E"],"🦀":["#E4572E"],"🦞":["#D9432B"],"🦂":["#8D6E63"],"🐴":["#B07A4A"],"🦓":["#F2F2F2"],"🦄":["#F4EEFC"],"🏇":["#B07A4A"],"🐄":["#F0F0F0"],"🐂":["#6D4C41"],"🐑":["#F5F5F5"],"🦌":["#B98B5E"],"🦝":["#8D8D96"],"🦏":["#8E9AA5"],"🦣":["#8D6E63"],"🦴":["#F0E6D2"],"🦒":["#E6B455"],
 "⚙️":["#9AA5B1","gear"],"🤖":["#8FA8C8","gear"],"🛸":["#A0AEC0","star"],"👻":["#F1F5F9"],"🎃":["#F97316"],"🧙":["#7C3AED","star"],"🧚":["#F9A8D4","star"],"🐛":["#8BC34A"],"🐝":["#FBC02D"],"🦋":["#64B5F6"],"🪲":["#2E7D32"],"🦗":["#7CB342"],"🐌":["#C8A165"],"🐢":["#6FA33C"],"🐚":["#F5CBA7"],"🦪":["#D7CCC8"],"💎":["#4DD0E1","gem"],
 "☁️":["#E3EEF8","cloud"],"🌧️":["#90A4AE","cloud"],"🌈":["#F472B6"],"🌪️":["#78909C","cloud"],"🌙":["#F5E6A8","orb"],"🌑":["#8892A6","orb"],"🌓":["#E8D99A","orb"],"🌕":["#F5E6A8","orb"],"🪐":["#D9A066","orb"],"☄️":["#FF7043","flame"],"🌞":["#FBC02D","sun"],"🌅":["#FB8C00","sun"],
 "🎵":["#7E57C2","note"],"🎶":["#7E57C2","note"],"🎸":["#C0784A","note"],"🕯️":["#FFE082","flame"],"💡":["#FFF176","orb"],"🍯":["#F9A825"],"🌰":["#8D5B3A"],"🥚":["#F5EBDD"],"🐍":["#6BAA3A"],"🌲":["#2E7D32","leaf"],"🎋":["#7CB342","leaf"],"🧜":["#26C6DA"],"🧜‍♀️":["#26C6DA"]
};
const PAL=["#F4A65B","#7DB7E8","#8BC34A","#F472B6","#A78BFA","#F2C14E","#4DD0E1","#EF7A7A"];
const EARS=["round","round","long","droop","tiny","horns"];
const TAILS=["conecurl","pompom","stub","long","fox"];
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function buildCritter(group,c,count){
 const p=P(),stage=count>=5?3:count>=3?2:1;
 const e=(typeof window.critterForm==="function")?window.critterForm(c,Math.max(1,count)):c.forms[0];
 const info=EMO[e]||[];const h=hash(c.id);
 const color=info[0]||PAL[h%PAL.length];
 if(e==="🥚"){p.buildEgg(group,color,PAL[(h>>3)%PAL.length]);}
 else{
  const def={color:color,snout:lighten(color,.6),ear:darken(color,.15),ears:EARS[(h>>2)%EARS.length],tail:TAILS[(h>>5)%TAILS.length],
   whiskers:!!((h>>8)&1),cheeks:!((h>>9)&1)&&((h>>2)%EARS.length)===4,pattern:((h>>10)%4)===0?"spots":((h>>10)%4)===1?"stripes":"",spot:lighten(color,.55),
   wings:stage>=3&&!!((h>>12)&1),wingc:lighten(color,.35),aura:stage>=3};
  p.buildPet(group,def);
 }
 if(info[1]){const a=p.acc(info[1],1.5+(stage-1)*.35);a.position.set(0,.74+(stage-1)*.03,.06);group.add(a);}
 else if(stage>=2){const a=p.acc(stage===3?"crown":"star",stage===3?1.1:1.3);a.position.set(0,.66,.06);group.add(a);}
 group.scale.setScalar(1.15+stage*.08);
}
function frameCritter(ctx,group){ctx.plat.position.y=-.4*group.scale.y-.06;ctx.camera.position.set(0,.55,3.9);ctx.camera.lookAt(0,.28,0);}
function render3DCritter(containerId,critterId,count){
 const el=document.getElementById(containerId);if(!el||!window.P3D)return;
 const c=(window.CRITTERS||[]).find(function(x){return x.id===critterId;});if(!c)return;
 const ctx=make3DScene(el,"#FFF8E1");
 const group=new THREE.Group();buildCritter(group,c,count);ctx.scene.add(group);frameCritter(ctx,group);
 LIVE.push(ctx);
 (function loop(){ctx.raf=requestAnimationFrame(loop);ctx.t=(ctx.t||0)+.04;group.rotation.y=Math.sin(ctx.t*.5)*.6;group.position.y=Math.sin(ctx.t)*.03;ctx.renderer.render(ctx.scene,ctx.camera);})();}

function snapshot3DCritter(critterId,count){
 const c=(window.CRITTERS||[]).find(function(x){return x.id===critterId;});if(!c)return "";
 const off=document.createElement("div");off.style.width="240px";off.style.height="200px";
 const ctx=make3DScene(off,"#FFF8E1");
 const group=new THREE.Group();buildCritter(group,c,count);group.rotation.y=.35;ctx.scene.add(group);frameCritter(ctx,group);
 ctx.renderer.render(ctx.scene,ctx.camera);
 const url=ctx.renderer.domElement.toDataURL("image/png");disposeCtx(ctx);return url;}
window.snapshot3DCritter=snapshot3DCritter;
window.render3DCreaturePreview=render3DCreaturePreview;
window.snapshot3DCreature=snapshot3DCreature;
window.render3DCritter=render3DCritter;
window.dispose3D=dispose3D;
