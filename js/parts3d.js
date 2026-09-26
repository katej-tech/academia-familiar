"use strict";
/* ============ LIBRERÍA DE PIEZAS 3D (compartida: mascota, criaturas, taller) ============
   Auditoría real como usuaria: el taller mostraba tres bolas apiladas, las criaturas un cono
   con un cubo flotando, el avión un tubo. Formas sueltas de Three.js NO leen como personajes.
   Acá viven piezas ARMADAS (cara, orejas, cola, accesorios reconocibles) con contorno oscuro
   estilo dibujo animado (casco invertido) — los demás módulos las usan vía window.P3D. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const OUTL=new THREE.MeshBasicMaterial({color:"#1E2A4A",side:THREE.BackSide});
function mat(c,o){return new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.55},o||{}));}
function out(m,t){const o=new THREE.Mesh(m.geometry,OUTL);o.scale.setScalar(1+(t||.05));m.add(o);}
/* mk: crea malla, la posiciona y (opcional) le pone contorno */
function mk(g,geo,color,p,s,r,opt){
 opt=opt||{};const m=new THREE.Mesh(geo,mat(color,opt.m));
 if(p)m.position.set(p[0],p[1],p[2]);
 if(s!=null){if(typeof s==="number")m.scale.setScalar(s);else m.scale.set(s[0],s[1],s[2]);}
 if(r)m.rotation.set(r[0],r[1],r[2]);
 if(opt.o)out(m,opt.o===true?.05:opt.o);
 g.add(m);return m;}
const SPH=function(r,a,b){return new THREE.SphereGeometry(r,a||20,b||16);};
const CON=function(r,h,n){return new THREE.ConeGeometry(r,h,n||12);};
const CYL=function(a,b,h,n){return new THREE.CylinderGeometry(a,b,h,n||16);};
const BOX=function(x,y,z){return new THREE.BoxGeometry(x,y,z);};
function ext(shape,depth){const g=new THREE.ExtrudeGeometry(shape,{depth:depth||.16,bevelEnabled:true,bevelSize:.02,bevelThickness:.02,bevelSegments:2});g.center();return g;}
function starGeo(ro,ri){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/5*i+Math.PI/2,r=i%2?ri:ro;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?s.lineTo(x,y):s.moveTo(x,y);}s.closePath();return ext(s,.14);}
function heartGeo(){const s=new THREE.Shape();s.moveTo(0,.25);s.bezierCurveTo(0,.25,-.05,0,-.25,0);s.bezierCurveTo(-.55,0,-.55,.35,-.55,.35);s.bezierCurveTo(-.55,.55,-.35,.77,0,.95);s.bezierCurveTo(.35,.77,.55,.55,.55,.35);s.bezierCurveTo(.55,.35,.55,0,.25,0);s.bezierCurveTo(.1,0,0,.25,0,.25);return ext(s,.3);}
function boltGeo(){const s=new THREE.Shape();[[.08,.5],[-.22,-.04],[-.02,-.04],[-.1,-.5],[.22,.1],[.02,.1]].forEach(function(p,i){i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]);});s.closePath();return ext(s,.14);}

/* accesorios sueltos (los usan criaturas y taller): centrados en su origen, tamaño ~0.3 */
function acc(kind,size){
 const g=new THREE.Group(),k=size||1;
 if(kind==="flame"){mk(g,CON(.12,.34,10),"#F97316",[0,.15,0],1,null,{o:true,m:{emissive:"#F97316",emissiveIntensity:.35}});mk(g,CON(.07,.22,10),"#FDE047",[0,.1,.02],1,null,{m:{emissive:"#FDE047",emissiveIntensity:.5}});mk(g,CON(.07,.2,8),"#FB923C",[.1,.06,0],1,[0,0,-.4]);mk(g,CON(.07,.2,8),"#FB923C",[-.1,.06,0],1,[0,0,.4]);}
 else if(kind==="drop"){mk(g,SPH(.11,16,12),"#38BDF8",[0,0,0],1,null,{o:true,m:{roughness:.2}});mk(g,CON(.09,.2,12),"#38BDF8",[0,.15,0],1,null,{m:{roughness:.2}});}
 else if(kind==="leaf"){mk(g,SPH(.11,12,10),"#4CAF50",[.07,.06,0],[1.5,.5,.35],[0,0,.6],{o:true});mk(g,SPH(.11,12,10),"#6DBE45",[-.07,.06,0],[1.5,.5,.35],[0,0,-.6],{o:true});mk(g,CYL(.015,.015,.14,6),"#5D4037",[0,-.04,0]);}
 else if(kind==="bolt"){mk(g,boltGeo(),"#FACC15",[0,0,0],.55,null,{o:true,m:{emissive:"#FACC15",emissiveIntensity:.35}});}
 else if(kind==="star"){mk(g,starGeo(.5,.22),"#FBBF24",[0,0,0],.5,null,{o:true,m:{emissive:"#FBBF24",emissiveIntensity:.3}});}
 else if(kind==="heart"){mk(g,heartGeo(),"#EF4444",[0,0,0],.32,null,{o:true});}
 else if(kind==="rock"){mk(g,new THREE.DodecahedronGeometry(.12),"#8D8D8D",[0,.02,0],1,null,{o:true,m:{roughness:.9,flatShading:true}});}
 else if(kind==="cloud"){mk(g,SPH(.09),"#FFFFFF",[0,0,0]);mk(g,SPH(.07),"#FFFFFF",[.1,-.02,0]);mk(g,SPH(.07),"#FFFFFF",[-.1,-.02,0]);}
 else if(kind==="ice"){mk(g,new THREE.OctahedronGeometry(.12),"#A5D8F5",[0,.03,0],[.8,1.3,.8],null,{o:true,m:{roughness:.15,transparent:true,opacity:.85}});}
 else if(kind==="orb"){mk(g,SPH(.1),"#FDE68A",[0,0,0],1,null,{o:true,m:{emissive:"#FDE68A",emissiveIntensity:.4}});}
 else if(kind==="sun"){mk(g,SPH(.1),"#FBBF24",[0,0,0],1,null,{o:true,m:{emissive:"#FBBF24",emissiveIntensity:.5}});for(let i=0;i<8;i++){const a=i*Math.PI/4;mk(g,CON(.03,.09,6),"#FBBF24",[Math.cos(a)*.16,Math.sin(a)*.16,0],1,[0,0,a-Math.PI/2]);}}
 else if(kind==="flower"){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;mk(g,SPH(.05),"#F472B6",[Math.cos(a)*.08,Math.sin(a)*.08,0]);}mk(g,SPH(.045),"#FDE047",[0,0,.02]);}
 else if(kind==="gem"){mk(g,new THREE.OctahedronGeometry(.1),"#22D3EE",[0,0,0],[1,1.4,1],null,{o:true,m:{roughness:.1,metalness:.3}});}
 else if(kind==="note"){mk(g,SPH(.06),"#7E57C2",[0,-.08,0],[1.2,.9,1]);mk(g,CYL(.014,.014,.28,6),"#7E57C2",[.06,.05,0]);mk(g,BOX(.12,.04,.02),"#7E57C2",[.11,.19,0]);}
 else if(kind==="gear"){mk(g,CYL(.1,.1,.05,14),"#9AA5B1",[0,0,0],1,[Math.PI/2,0,0],{o:true});for(let i=0;i<8;i++){const a=i*Math.PI/4;mk(g,BOX(.04,.06,.05),"#9AA5B1",[Math.cos(a)*.12,Math.sin(a)*.12,0],1,[0,0,a]);}}
 else if(kind==="crown"){mk(g,CYL(.16,.18,.1,12,1),"#FBBF24",[0,0,0],1,null,{o:true,m:{metalness:.5,roughness:.3}});for(let i=0;i<5;i++){const a=i*Math.PI*2/5;mk(g,CON(.04,.13,6),"#FBBF24",[Math.cos(a)*.15,.11,Math.sin(a)*.15],1,null,{m:{metalness:.5,roughness:.3}});}mk(g,SPH(.03),"#EF4444",[0,.02,.18]);}
 else if(kind==="hat"){mk(g,CYL(.26,.26,.03,20),"#1F2937",[0,0,0],1,null,{o:true});mk(g,CYL(.16,.16,.26,20),"#1F2937",[0,.14,0],1,null,{o:true});mk(g,CYL(.165,.165,.05,20),"#EF4444",[0,.05,0]);}
 else if(kind==="bow"){mk(g,CON(.09,.2,3),"#F472B6",[.13,0,0],1,[0,0,-Math.PI/2],{o:true});mk(g,CON(.09,.2,3),"#F472B6",[-.13,0,0],1,[0,0,Math.PI/2],{o:true});mk(g,SPH(.06),"#EC4899",[0,0,.01],1,null,{o:true});}
 else if(kind==="glasses"){[-1,1].forEach(function(s){mk(g,new THREE.TorusGeometry(.085,.016,8,20),"#1E2A4A",[s*.11,0,0]);mk(g,SPH(.078,12,10),"#BAE6FD",[s*.11,0,-.005],[1,1,.2],null,{m:{transparent:true,opacity:.45,roughness:.1}});});mk(g,BOX(.06,.014,.014),"#1E2A4A",[0,.01,0]);}
 else if(kind==="rainbow"){["#EF4444","#F59E0B","#FACC15","#22C55E","#3B82F6","#8B5CF6"].forEach(function(c,i){const t=new THREE.Mesh(new THREE.TorusGeometry(.42-i*.05,.026,8,28,Math.PI),mat(c));g.add(t);});}
 g.scale.setScalar(k);return g;}

/* ============ ANIMAL LINDO GENÉRICO (mascota + criaturas) ============ */
function buildPet(g,def){
 const bodyMat=mat(def.color);
 const body=new THREE.Mesh(SPH(.5,22,18),bodyMat);body.scale.set(.5,.42,.46);body.position.set(0,-.16,0);out(body,.06);g.add(body);
 const head=new THREE.Mesh(SPH(.34,24,18),bodyMat);head.position.set(0,.26,.08);out(head,.05);g.add(head);
 const snoutMat=mat(def.snout||"#FFFFFF",{roughness:.6});
 const snout=new THREE.Mesh(SPH(.155,16,12),snoutMat);snout.scale.set(1,.72,.92);snout.position.set(0,.16,.34);g.add(snout);
 mk(g,SPH(.045,10,8),"#3A2A22",[0,.2,.47],1,null,{m:{roughness:.4}});
 if(def.cheeks)[-1,1].forEach(function(s){const c=new THREE.Mesh(SPH(.1,12,10),snoutMat);c.position.set(s*.26,.15,.28);g.add(c);});
 [-1,1].forEach(function(s){
  mk(g,SPH(.056,12,10),"#1E2A4A",[s*.2,.33,.29],1,null,{m:{roughness:.3}});
  mk(g,SPH(.018,6,6),"#FFFFFF",[s*.2+.014,.348,.325],1,null,{m:{roughness:.1}});});
 const eMat=def.ear||def.color;
 if(def.ears!=="none"){
  [-1,1].forEach(function(s){
   if(def.ears==="long"){mk(g,CYL(.055,.075,.4,10),eMat,[s*.16,.62,.06],1,[0,0,s*.12],{o:.08});}
   else if(def.ears==="droop"){mk(g,CON(.1,.24,10),eMat,[s*.28,.32,.08],1,[0,0,s*1.3],{o:.08});}
   else if(def.ears==="tiny"){mk(g,SPH(.08,10,8),eMat,[s*.24,.5,.06],1,null,{o:.08});}
   else if(def.ears==="horns"){mk(g,CON(.06,.24,8),"#F5EBDD",[s*.18,.56,.08],1,[0,0,s*.35],{o:.08});}
   else{mk(g,CON(.13,.22,10),eMat,[s*.2,.5,.02],1,[0,0,s*.25],{o:.06});}
  });}
 if(def.whiskers){[-1,1].forEach(function(s){[0,1,2].forEach(function(i){
   const w=mk(g,CYL(.006,.006,.24,4),"#FFFFFF",[s*.22,.18-i*.03,.36]);w.rotation.z=Math.PI/2+s*.15;w.rotation.y=s*(.3+i*.12);});});}
 if(def.tail==="conecurl")mk(g,CON(.09,.42,10),eMat,[0,.02,-.42],1,[-1,0,0],{o:.08});
 else if(def.tail==="pompom")mk(g,SPH(.11,12,10),def.snout||def.color,[0,-.1,-.46],1,null,{o:.08});
 else if(def.tail==="fox"){mk(g,CON(.16,.62,12),eMat,[0,.02,-.5],1,[-1.15,0,0],{o:.06});mk(g,SPH(.09,10,8),def.snout||"#FFFFFF",[0,.28,-.78]);}
 else if(def.tail==="long")mk(g,CYL(.1,.04,.75,10),eMat,[0,-.02,-.58],1,[-1.15,0,0],{o:.06});
 else if(def.tail==="flow"){[0,1,2].forEach(function(i){mk(g,CON(.05,.5-i*.06,8),def.mane||eMat,[(i-1)*.07,.06,-.4],1,[-1.05+(i-1)*.15,0,0]);});}
 else if(def.tail==="stub")mk(g,SPH(.07,10,8),eMat,[0,-.06,-.44],1,null,{o:.08});
 if(def.wings)[-1,1].forEach(function(s){mk(g,SPH(.24,14,10),def.wingc||eMat,[s*.56,.12,-.14],[1.5,.2,.8],[0,s*.35,s*.55],{o:.06});mk(g,SPH(.16,12,8),def.wingc||eMat,[s*.7,.02,-.16],[1.3,.18,.7],[0,s*.35,s*.35],{o:.06});});
 if(def.horn)mk(g,CON(.055,.3,10),"#FBBF24",[0,.62,.16],1,[-.35,0,0],{m:{metalness:.4,roughness:.3}});
 if(def.shell)mk(g,new THREE.SphereGeometry(.44,18,14,0,Math.PI*2,0,Math.PI/1.7),def.shell,[0,.02,-.06],[1.05,.8,1.05],null,{o:.05});
 if(def.neck)mk(g,CYL(.1,.14,.16,10),def.color,[0,.08,.28],1,[.5,0,0]);
 if(def.belly)mk(g,SPH(.28,14,10),def.belly,[0,-.14,.24],[.72,.9,.5]);
 if(def.beak)mk(g,CON(.09,.2,10),def.snout,[0,.2,.4],1,[Math.PI/2,0,0],{m:{roughness:.4}});
 if(def.flippers)[-1,1].forEach(function(s){mk(g,CON(.09,.4,8),def.color,[s*.42,-.1,0],1,[0,0,s*1.3],{o:.08});});
 if(def.pattern==="spots")[[.22,.0,.28],[-.24,-.08,.24],[.12,-.3,.3]].forEach(function(p){mk(g,SPH(.05,8,6),def.spot||"#FFFFFF",p,[1,1,.4]);});
 if(def.pattern==="stripes")[0,1,2].forEach(function(i){mk(g,BOX(.5,.04,.02),def.spot||"#3A2A22",[0,-.05-i*.12,.4-i*.04]);});
 if(def.aura){const r=new THREE.Mesh(new THREE.TorusGeometry(.62,.025,8,40),mat("#FBBF24",{emissive:"#FBBF24",emissiveIntensity:.5}));r.rotation.x=Math.PI/2.3;r.position.y=-.05;g.add(r);}
}
/* huevo (criaturas en etapa de huevo) */
function buildEgg(g,color,spot){
 const e=mk(g,SPH(.42,22,18),color,[0,-.02,0],[.82,1.05,.82],null,{o:.06});
 [[.2,.1,.3],[-.22,-.15,.28],[.05,-.3,.32],[-.12,.28,.28]].forEach(function(p){mk(g,SPH(.07,8,6),spot||"#F59E0B",p,[1,1,.4]);});
 [-1,1].forEach(function(s){mk(g,SPH(.045,10,8),"#1E2A4A",[s*.14,.08,.33]);});
 mk(g,SPH(.03,8,6),"#F472B6",[0,-.02,.36],[1.6,.7,.5]);
 return e;}

window.P3D={THREE:THREE,mat:mat,mk:mk,out:out,acc:acc,buildPet:buildPet,buildEgg:buildEgg,SPH:SPH,CON:CON,CYL:CYL,BOX:BOX,ext:ext,starGeo:starGeo,heartGeo:heartGeo,boltGeo:boltGeo};
