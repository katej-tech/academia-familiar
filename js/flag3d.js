"use strict";
/* ============ BANDERA ONDEANDO EN 3D (con lo que el niño acaba de dibujar) ============
   Pedido explícito: "agregar el juego dibujar la bandera que le gusta mucho" — distinto del
   quiz "Adivina la bandera" (games3.js) y de la plantilla plana de colorear (board.js). Acá
   el dibujo libre (canvas, ver games3.js gameFlagDraw) se convierte en la textura de una
   bandera 3D que ondea de verdad, como premio visual al terminar. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

let LIVE=null;
function dispose3DFlag(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});
  LIVE.renderer.dispose();
  if(LIVE.renderer.domElement&&LIVE.renderer.domElement.parentNode)LIVE.renderer.domElement.parentNode.removeChild(LIVE.renderer.domElement);
 }catch(e){}
 LIVE=null;}

function render3DWavingFlag(containerId,dataURL){
 const el=document.getElementById(containerId);if(!el)return;
 dispose3DFlag();
 const w=el.clientWidth||300,h=el.clientHeight||260;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#EAF6FF");
 const camera=new THREE.PerspectiveCamera(38,w/h,.1,50);
 camera.position.set(0,.1,2.6);camera.lookAt(.15,.1,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.5));
 const dir=new THREE.DirectionalLight(0xffffff,1.1);dir.position.set(2,4,3);scene.add(dir);

 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.6,10),new THREE.MeshStandardMaterial({color:"#8B5E34",roughness:.6}));
 pole.position.set(-.85,0,0);scene.add(pole);
 const knob=new THREE.Mesh(new THREE.SphereGeometry(.06,12,10),new THREE.MeshStandardMaterial({color:"#FBBF24",roughness:.3,metalness:.4}));
 knob.position.set(-.85,.82,0);scene.add(knob);

 const segX=28,segY=16;
 const geo=new THREE.PlaneGeometry(1.5,1,segX,segY);
 const texLoader=new THREE.TextureLoader();
 const tex=texLoader.load(dataURL);
 tex.colorSpace=THREE.SRGBColorSpace;
 const mat=new THREE.MeshStandardMaterial({map:tex,side:THREE.DoubleSide,roughness:.75});
 const mesh=new THREE.Mesh(geo,mat);
 mesh.position.set(-.05,.3,0);
 scene.add(mesh);

 const pos=geo.attributes.position;
 const base=Float32Array.from(pos.array);
 LIVE={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,pos:pos,base:base};
 (function loop(){
  LIVE.raf=requestAnimationFrame(loop);
  LIVE.t+=0.045;
  for(let i=0;i<pos.count;i++){
   const bx=base[i*3],by=base[i*3+1];
   const amp=.05*((bx+.75)/1.5);
   const z=Math.sin(bx*4+LIVE.t)*amp+Math.sin(by*3+LIVE.t*1.3)*amp*.4;
   pos.setZ(i,z);
  }
  pos.needsUpdate=true;
  geo.computeVertexNormals();
  renderer.render(scene,camera);
 })();}

window.render3DWavingFlag=render3DWavingFlag;
window.dispose3DFlag=dispose3DFlag;
