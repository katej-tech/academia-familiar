"use strict";
/* ============ TABLERO DE AJEDREZ EN 3D ============
   Pedido explícito, repetido varias veces: "que fuese en 3D como lo he dicho e insistido antes".
   Reemplaza el tablero plano CSS de chess.js por un tablero 3D de verdad, con piezas armadas con
   formas reconocibles (P3D, la misma librería del taller/mascota/criaturas) — cada tipo de pieza
   tiene una silueta distinta a propósito para que se reconozca sin leer la etiqueta. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";
function P(){return window.P3D;}

function buildPiece(id,color){
 const p=P(),g=new THREE.Group();
 const base=p.mk(g,p.CYL(.34,.38,.08,20),color,[0,.04,0],1,null,{o:.04});
 if(id==="peon"){p.mk(g,p.SPH(.22,16,12),color,[0,.28,0],1,null,{o:.05});p.mk(g,p.CYL(.16,.24,.12,16),color,[0,.14,0],1,null,{o:.05});}
 else if(id==="torre"){p.mk(g,p.CYL(.3,.32,.5,16),color,[0,.33,0],1,null,{o:.04});
  [0,1,2,3].forEach(function(k){const a=k*Math.PI/2+Math.PI/4;p.mk(g,p.BOX(.14,.12,.14),color,[Math.cos(a)*.22,.62,Math.sin(a)*.22]);});}
 else if(id==="alfil"){p.mk(g,p.CON(.26,.55,16),color,[0,.36,0],1,null,{o:.04});p.mk(g,p.SPH(.11,14,10),color,[0,.68,0],1,null,{o:.06});p.mk(g,p.BOX(.16,.03,.03),"#F8FAFC",[0,.66,.1],1,[.5,0,0]);}
 else if(id==="caballo"){
  p.mk(g,p.CYL(.17,.22,.3,16),color,[0,.19,-.02],1,null,{o:.05});                          /* pecho/base del cuello */
  const neck=p.mk(g,p.BOX(.19,.42,.17),color,[0,.42,-.02],1,[-.32,0,0],{o:.05});            /* cuello, inclinado hacia adelante */
  const head=p.mk(g,p.BOX(.15,.15,.36),color,[0,.66,.14],1,[-.1,0,0],{o:.06});              /* hocico horizontal */
  p.mk(g,p.BOX(.1,.1,.12),color,[0,.62,.33],1,[-.35,0,0],{o:.08});                          /* punta del hocico, achatada */
  [-1,1].forEach(function(s){p.mk(g,p.CON(.035,.12,4),color,[s*.06,.79,.06],1,[0,0,s*.12],{o:.1});});  /* orejas */
  [0,1,2].forEach(function(i){p.mk(g,p.CON(.05,.16,3),color,[0,.5+i*.09,-.11-i*.02],1,[.5,0,0]);});    /* crin */
  p.mk(g,p.SPH(.025,8,6),"#1E2A4A",[.075,.68,.24]);                                          /* ojo */
  p.mk(g,p.SPH(.02,6,6),"#1E2A4A",[0,.63,.31]);}                                             /* ollar */
 else if(id==="dama"){p.mk(g,p.CON(.28,.62,18),color,[0,.38,0],1,null,{o:.04});
  for(let k=0;k<6;k++){const a=k*Math.PI/3;p.mk(g,p.SPH(.06,10,8),color,[Math.cos(a)*.16,.72,Math.sin(a)*.16]);}
  p.mk(g,p.SPH(.08,12,10),color,[0,.78,0],1,null,{o:.08});}
 else{p.mk(g,p.CYL(.26,.3,.6,18),color,[0,.38,0],1,null,{o:.04});
  p.mk(g,p.BOX(.07,.24,.07),color,[0,.76,0]);p.mk(g,p.BOX(.2,.07,.07),color,[0,.85,0]);}
 return g;}

const LIGHT="#EFE3D0",DARK="#8C6A4E";
let LIVE=null;
function dispose3DChess(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){m.dispose();});}});
  LIVE.renderer.dispose();const c=LIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);
 }catch(e){}
 LIVE=null;}

function render3DChessBoard(containerId,pieceId,pr,pc,highlightSet,starKey,pieceColor){
 const el=document.getElementById(containerId);if(!el||!window.P3D)return;
 dispose3DChess();
 const w=el.clientWidth||320,h=el.clientHeight||300;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#DCEBFA");
 const camera=new THREE.PerspectiveCamera(36,w/h,.1,50);
 camera.position.set(0,3.6,3.4);camera.lookAt(0,0,pr!=null?pr-3.5:.3);
 scene.add(new THREE.AmbientLight(0xffffff,1.35));
 const dl=new THREE.DirectionalLight(0xffffff,1.2);dl.position.set(3,7,4);scene.add(dl);

 const boardG=new THREE.Group();scene.add(boardG);
 const rim=new THREE.Mesh(new THREE.BoxGeometry(8.8,.35,8.8),new THREE.MeshStandardMaterial({color:"#5D4630",roughness:.8}));rim.position.y=-.25;boardG.add(rim);
 for(let r=0;r<8;r++)for(let c=0;c<8;c++){
  const dark=(r+c)%2===1,key=r+","+c;
  const hi=highlightSet&&highlightSet.has(key);
  const tile=new THREE.Mesh(new THREE.BoxGeometry(.98,.1,.98),new THREE.MeshStandardMaterial({color:hi?"#86EFAC":(dark?DARK:LIGHT),roughness:.7}));
  tile.position.set(c-3.5,0,r-3.5);boardG.add(tile);
  if(hi){const ring=new THREE.Mesh(new THREE.RingGeometry(.28,.36,20),new THREE.MeshBasicMaterial({color:"#16A34A",side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(c-3.5,.056,r-3.5);boardG.add(ring);}
  if(key===starKey){const st=window.P3D.mk(boardG,window.P3D.starGeo(.26,.11),"#FBBF24",[c-3.5,.35,r-3.5],1,[Math.PI/2,0,0],{o:.06,m:{emissive:"#FBBF24",emissiveIntensity:.35}});
   LIVE=LIVE||{};LIVE.star=st;}
 }
 if(pieceId){const piece=buildPiece(pieceId,pieceColor||"#334155");piece.position.set(pc-3.5,.05,pr-3.5);boardG.add(piece);LIVE=LIVE||{};LIVE.piece=piece;}
 boardG.rotation.y=-.05;
 const cv=renderer.domElement;cv.style.touchAction="none";
 let drag=null;
 cv.addEventListener("pointerdown",function(e){drag={x:e.clientX,y0:boardG.rotation.y};try{cv.setPointerCapture(e.pointerId);}catch(_){}});
 cv.addEventListener("pointermove",function(e){if(!drag)return;boardG.rotation.y=drag.y0+(e.clientX-drag.x)*.012;});
 cv.addEventListener("pointerup",function(){drag=null;});
 cv.addEventListener("pointercancel",function(){drag=null;});
 LIVE=Object.assign(LIVE||{},{renderer:renderer,scene:scene,camera:camera,raf:null,t:0,star:LIVE&&LIVE.star});
 (function loop(){LIVE.raf=requestAnimationFrame(loop);LIVE.t+=.02;if(LIVE.star)LIVE.star.position.y=.35+Math.sin(LIVE.t*3)*.05;renderer.render(scene,camera);})();}

window.render3DChessBoard=render3DChessBoard;
window.dispose3DChess=dispose3DChess;
