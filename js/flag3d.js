"use strict";
/* ============ BANDERA ONDEANDO EN 3D (tu dibujo junto a la bandera real) ============
   v2 tras auditoría: la bandera salía como una lámina gris apagada colgando en la nada (la luz
   apagaba los colores del dibujo), sin nada alrededor. Ahora: colores fieles (mapa + emisión para
   que la luz no los lave), tela con ondas más largas y sombreado, cielo, colinas y nubes, la
   bandera SUBE por el asta al aparecer y, si hay internet, se muestra al lado la bandera REAL
   (flagcdn con CORS) para compararlas. Mismo patrón que los demás módulos 3D. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

let LIVE=null;
function dispose3DFlag(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();if(m.emissiveMap)m.emissiveMap.dispose();m.dispose();});}});
  LIVE.renderer.dispose();
  if(LIVE.renderer.domElement&&LIVE.renderer.domElement.parentNode)LIVE.renderer.domElement.parentNode.removeChild(LIVE.renderer.domElement);
 }catch(e){}
 LIVE=null;}

function label(text){
 const cv=document.createElement("canvas");cv.width=256;cv.height=72;const c=cv.getContext("2d");
 c.fillStyle="rgba(255,255,255,.92)";c.beginPath();c.roundRect?c.roundRect(4,4,248,64,20):c.rect(4,4,248,64);c.fill();
 c.strokeStyle="#1E2A4A";c.lineWidth=5;c.stroke();c.fillStyle="#1E2A4A";c.font="bold 34px sans-serif";c.textAlign="center";c.textBaseline="middle";c.fillText(text,128,38);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv)}));s.scale.set(1.5,.42,1);return s;}

function makeFlag(tex,x){
 const g=new THREE.Group();g.position.x=x;
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.035,.04,2.4,12),new THREE.MeshStandardMaterial({color:"#8B5E34",roughness:.6}));pole.position.set(0,1.2,0);g.add(pole);
 const knob=new THREE.Mesh(new THREE.SphereGeometry(.075,14,10),new THREE.MeshStandardMaterial({color:"#FBBF24",roughness:.3,metalness:.5}));knob.position.set(0,2.45,0);g.add(knob);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(.22,.28,.16,16),new THREE.MeshStandardMaterial({color:"#9CA3AF",roughness:.9}));base.position.set(0,.08,0);g.add(base);
 const geo=new THREE.PlaneGeometry(1.5,1,36,20);
 tex.colorSpace=THREE.SRGBColorSpace;
 const mat=new THREE.MeshStandardMaterial({map:tex,emissiveMap:tex,emissive:new THREE.Color("#ffffff"),emissiveIntensity:.5,side:THREE.DoubleSide,roughness:.9});
 const mesh=new THREE.Mesh(geo,mat);
 const holder=new THREE.Group();holder.position.set(.02,.35,0);holder.add(mesh);mesh.position.set(.75,.5,0);g.add(holder);
 return{g:g,geo:geo,base:Float32Array.from(geo.attributes.position.array),holder:holder,pole:pole};}

function render3DWavingFlags(containerId,dataURL,refURL,names){
 const el=document.getElementById(containerId);if(!el)return;
 dispose3DFlag();
 const w=el.clientWidth||330,h=el.clientHeight||280;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#BFE3FF");scene.fog=new THREE.Fog("#BFE3FF",9,26);
 const camera=new THREE.PerspectiveCamera(40,w/h,.1,60);
 scene.add(new THREE.AmbientLight(0xffffff,1.25));
 const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(3,6,5);scene.add(dl);
 /* paisaje */
 const grass=new THREE.Mesh(new THREE.CircleGeometry(14,40),new THREE.MeshStandardMaterial({color:"#8FD18B",roughness:1}));grass.rotation.x=-Math.PI/2;scene.add(grass);
 [[-5,-5,3.2,"#7CC47F"],[3,-7,4.4,"#6FBA76"],[7,-4,2.6,"#86CB86"]].forEach(function(a){const hill=new THREE.Mesh(new THREE.SphereGeometry(a[2],20,12),new THREE.MeshStandardMaterial({color:a[3],roughness:1}));hill.scale.y=.45;hill.position.set(a[0],0,a[1]);scene.add(hill);});
 const sun=new THREE.Mesh(new THREE.SphereGeometry(.6,16,12),new THREE.MeshBasicMaterial({color:"#FDE68A"}));sun.position.set(-4.5,4.6,-7);scene.add(sun);
 for(let i=0;i<6;i++){const c=new THREE.Group();for(let k=0;k<3;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(.45+Math.random()*.25,10,8),new THREE.MeshBasicMaterial({color:"#FFFFFF"}));s.position.set(k*.55,Math.random()*.15,0);c.add(s);}c.position.set(-6+i*2.6,3+Math.random()*1.2,-8);scene.add(c);}
 const flags=[];
 const loader=new THREE.TextureLoader();
 const two=!!refURL;
 const mine=makeFlag(loader.load(dataURL),two?-1.3:-.6);scene.add(mine.g);flags.push(mine);
 const l1=label(names&&names[0]||"Tu bandera");l1.position.set(two?-.5:.15,3.05,0);scene.add(l1);
 if(two){
  const real=makeFlag(loader.load(refURL,undefined,undefined,function(){real.g.visible=false;}),1.3);scene.add(real.g);flags.push(real);
  const l2=label(names&&names[1]||"La real");l2.position.set(2.05,3.05,0);scene.add(l2);}
 camera.position.set(two?.6:.15,1.8,two?7.8:5.4);camera.lookAt(two?.6:.15,1.55,0);
 LIVE={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,flags:flags,rise:0};
 (function loop(){
  LIVE.raf=requestAnimationFrame(loop);
  LIVE.t+=.05;LIVE.rise=Math.min(1,LIVE.rise+.012);
  const e=1-Math.pow(1-LIVE.rise,3);
  flags.forEach(function(f,fi){
   f.holder.position.y=.22+e*1.68;
   const pos=f.geo.attributes.position,b=f.base;
   for(let i=0;i<pos.count;i++){
    const bx=b[i*3],by=b[i*3+1];
    const u=(bx+.75)/1.5;                       /* 0 pegado al asta … 1 punta libre */
    const amp=.02+.13*u;
    const z=Math.sin(bx*3.6-LIVE.t*1.9+fi)*amp+Math.sin(by*2.4-LIVE.t*1.3)*amp*.35;
    pos.setZ(i,z);
    pos.setY(i,by-Math.sin(bx*3.6-LIVE.t*1.9+fi)*amp*.12);}
   pos.needsUpdate=true;f.geo.computeVertexNormals();});
  camera.position.x+=Math.sin(LIVE.t*.15)*.0015;
  renderer.render(scene,camera);
 })();}

window.render3DWavingFlags=render3DWavingFlags;
window.render3DWavingFlag=function(id,url){render3DWavingFlags(id,url,null);};
window.dispose3DFlag=dispose3DFlag;
