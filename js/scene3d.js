"use strict";
/* ============ ESCENARIO 3D PARA "INGLÉS EN ACCIÓN" ============
   Dos personajes (el del niño y el de la escena) conversan sobre un pequeño escenario con
   fondo del lugar y objetos flotantes. Reusa los modelos de mascota (window.PET_MODELS de
   pet3d.js + P3D.buildPet). El que habla rebota; el otro lo mira. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

let LIVE=null;
function disposeScene3D(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);if(LIVE.ro)LIVE.ro.disconnect();}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});
  LIVE.renderer.dispose();const c=LIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);
 }catch(e){}
 LIVE=null;}

function emojiTex(e,size){
 const cv=document.createElement("canvas");cv.width=cv.height=size||128;const c=cv.getContext("2d");
 c.font=Math.round((size||128)*.72)+'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
 c.textAlign="center";c.textBaseline="middle";c.fillText(e,(size||128)/2,(size||128)/2+4);
 const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}
function sprite(e,s,op){
 const m=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTex(e),transparent:true,opacity:op==null?1:op}));
 m.scale.set(s,s,1);return m;}
function backTex(c1,c2,props){
 const cv=document.createElement("canvas");cv.width=512;cv.height=256;const c=cv.getContext("2d");
 const g=c.createLinearGradient(0,0,0,256);g.addColorStop(0,c1);g.addColorStop(1,c2);c.fillStyle=g;c.fillRect(0,0,512,256);
 c.globalAlpha=.16;c.font='46px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';c.textAlign="center";c.textBaseline="middle";
 for(let r=0;r<4;r++)for(let k=0;k<7;k++){c.fillText(props[(r*7+k)%props.length],36+k*73+(r%2)*34,34+r*66);}
 const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}

/* cfg:{pets:[idxNPC,idxYou],bg:[c1,c2],props:[e,e,e],sign:e} */
function renderScene3D(containerId,cfg){
 const el=document.getElementById(containerId);if(!el)return null;
 disposeScene3D();
 const w=el.clientWidth||340,h=el.clientHeight||230;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h,false);
 const cv=renderer.domElement;cv.style.width="100%";cv.style.height="100%";cv.style.display="block";
 el.innerHTML="";el.appendChild(cv);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(40,w/h,.1,60);
 camera.position.set(0,.45,3.9);camera.lookAt(0,.25,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.5));
 const dl=new THREE.DirectionalLight(0xffffff,1.2);dl.position.set(2,5,5);scene.add(dl);
 const bg=cfg.bg||["#BFE3FF","#8EC5F5"];
 const back=new THREE.Mesh(new THREE.PlaneGeometry(11,5.4),new THREE.MeshBasicMaterial({map:backTex(bg[0],bg[1],cfg.props||["⭐"])}));
 back.position.set(0,.9,-2.2);scene.add(back);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(3.4,48),new THREE.MeshStandardMaterial({color:bg[1],roughness:.9}));
 floor.rotation.x=-Math.PI/2;floor.position.y=-.72;scene.add(floor);
 const ring=new THREE.Mesh(new THREE.RingGeometry(3.3,3.5,48),new THREE.MeshBasicMaterial({color:"#ffffff",transparent:true,opacity:.5,side:THREE.DoubleSide}));
 ring.rotation.x=-Math.PI/2;ring.position.y=-.71;scene.add(ring);
 const defs=window.PET_MODELS||[];
 const pets=[];
 [0,1].forEach(function(i){
  const g=new THREE.Group(),inner=new THREE.Group();g.add(inner);
  window.P3D.buildPet(inner,defs[cfg.pets[i]]||defs[0]);
  g.position.set(i===0?-1.0:1.0,-.12,0);g.rotation.y=i===0?.5:-.5;g.scale.setScalar(1.22);
  scene.add(g);pets.push({g:g,inner:inner,base:g.rotation.y,speak:0});});
 const props=[];
 (cfg.props||[]).slice(0,3).forEach(function(e,i){
  const s=sprite(e,.62);s.position.set([-1.75,1.75,0][i],[1.05,1.0,1.75][i],-1.2+(i===2?-.6:0));scene.add(s);props.push({s:s,y:s.position.y,ph:i*2.1});});
 if(cfg.sign){const sg=sprite(cfg.sign,.9);sg.position.set(0,1.3,-1.4);scene.add(sg);props.push({s:sg,y:1.3,ph:5});}
 const ctx={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,pets:pets,props:props,ro:null};
 if(window.ResizeObserver){ctx.ro=new ResizeObserver(function(){const nw=el.clientWidth,nh=el.clientHeight;if(nw>0&&nh>0){renderer.setSize(nw,nh,false);camera.aspect=nw/nh;camera.updateProjectionMatrix();}});ctx.ro.observe(el);}
 LIVE=ctx;
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);ctx.t+=.016;
  pets.forEach(function(p,i){
   if(p.speak>0){p.speak-=.016;const k=ctx.t*11+i;p.g.position.y=-.12+Math.abs(Math.sin(k))*.18;p.inner.scale.set(1+Math.sin(k*2)*.04,1-Math.sin(k*2)*.04,1);p.g.rotation.y=p.base*.55;}
   else{p.g.position.y=-.12+Math.sin(ctx.t*1.6+i*2)*.025;p.inner.scale.set(1,1,1);p.g.rotation.y=p.base+Math.sin(ctx.t*.6+i)*.06;}});
  props.forEach(function(q){q.s.position.y=q.y+Math.sin(ctx.t*1.2+q.ph)*.08;});
  renderer.render(scene,camera);})();
 return{say:function(who,secs){if(pets[who])pets[who].speak=secs||1.6;},stop:function(){pets.forEach(function(p){p.speak=0;});}};}

window.renderScene3D=renderScene3D;
window.disposeScene3D=disposeScene3D;
