"use strict";
/* ============ PLANETARIO EN 3D (sistema solar explorable) ============
   Pedido explícito: "tipo planetario también le gusta lo de los planetas y eso". Los 8
   planetas orbitan el Sol; tocar uno lo resalta y muestra un dato curioso para niños.
   Distancias y tamaños NO son a escala real (si lo fueran, Mercurio sería invisible y
   Neptuno quedaría fuera de pantalla) — están ajustados para que los 8 se vean y se
   distingan bien. Mismo patrón que los demás módulos: formas nativas de Three.js. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const PLANETS=[
 {id:"mercurio",nm:"Mercurio",color:"#B0A79E",r:.11,dist:.9,speed:1.6,fact:"El planeta más pequeño y el más cercano al Sol. ¡Un día ahí dura casi 3 meses!"},
 {id:"venus",nm:"Venus",color:"#E8C27E",r:.16,dist:1.25,speed:1.2,fact:"Es el planeta más caliente de todos, aunque no es el más cercano al Sol."},
 {id:"tierra",nm:"Tierra",color:"#3B82F6",r:.17,dist:1.62,speed:1.0,fact:"¡Nuestro planeta! El único que conocemos con vida y agua líquida."},
 {id:"marte",nm:"Marte",color:"#C1440E",r:.14,dist:1.98,speed:.8,fact:"Le dicen el planeta rojo por su tierra color óxido."},
 {id:"jupiter",nm:"Júpiter",color:"#D9A066",r:.34,dist:2.55,speed:.45,fact:"El planeta más grande del sistema solar — ¡tiene una tormenta más grande que la Tierra!"},
 {id:"saturno",nm:"Saturno",color:"#E9D8A6",r:.3,dist:3.15,speed:.34,ring:true,fact:"Tiene enormes anillos hechos de hielo y roca."},
 {id:"urano",nm:"Urano",color:"#9BE7E0",r:.22,dist:3.65,speed:.24,fact:"Gira de lado, como una pelota rodando por su órbita."},
 {id:"neptuno",nm:"Neptuno",color:"#3B5BA9",r:.21,dist:4.1,speed:.19,fact:"El planeta más lejano del Sol y el más ventoso de todos."}
];
const SUN_FACT="La estrella que nos da luz y calor. ¡Es tan grande que caben más de un millón de planetas Tierra dentro!";

let LIVE=null;
function dispose3DPlanets(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
  LIVE.renderer.dispose();
  if(LIVE.renderer.domElement&&LIVE.renderer.domElement.parentNode)LIVE.renderer.domElement.parentNode.removeChild(LIVE.renderer.domElement);
 }catch(e){}
 LIVE=null;}

function render3DPlanets(containerId,onSelect){
 const el=document.getElementById(containerId);if(!el)return;
 dispose3DPlanets();
 const w=el.clientWidth||320,h=el.clientHeight||320;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#0B1120");
 const camera=new THREE.PerspectiveCamera(42,w/h,.1,50);
 camera.position.set(0,3.6,4.6);camera.lookAt(0,0,0);
 scene.add(new THREE.AmbientLight(0xffffff,.55));

 const sun=new THREE.Mesh(new THREE.SphereGeometry(.42,20,16),
  new THREE.MeshStandardMaterial({color:"#FBBF24",emissive:"#F59E0B",emissiveIntensity:1}));
 sun.userData.id="sol";scene.add(sun);
 const sunLight=new THREE.PointLight(0xffffff,2.2,20);scene.add(sunLight);

 const tappable=[sun];
 const orbits=[];
 PLANETS.forEach(function(p){
  const ring=new THREE.Mesh(new THREE.RingGeometry(p.dist-.006,p.dist+.006,64),
   new THREE.MeshBasicMaterial({color:"#334155",side:THREE.DoubleSide,transparent:true,opacity:.5}));
  ring.rotation.x=Math.PI/2;scene.add(ring);
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(p.r,18,14),new THREE.MeshStandardMaterial({color:p.color,roughness:.6}));
  mesh.userData.id=p.id;
  if(p.ring){
   const sr=new THREE.Mesh(new THREE.RingGeometry(p.r*1.4,p.r*2.1,32),
    new THREE.MeshBasicMaterial({color:"#C9B27C",side:THREE.DoubleSide,transparent:true,opacity:.85}));
   sr.rotation.x=Math.PI/2.4;mesh.add(sr);
  }
  scene.add(mesh);tappable.push(mesh);orbits.push({mesh:mesh,dist:p.dist,speed:p.speed,ang:Math.random()*Math.PI*2});
 });

 const raycaster=new THREE.Raycaster();
 let selected=null;
 function setSelected(m){
  if(selected&&selected.material)selected.material.emissive&&selected.material.emissive.set(0x000000);
  selected=m;
  if(selected&&selected!==sun){selected.material.emissive=selected.material.emissive||new THREE.Color(0);selected.material.emissive.set(0xffffff);selected.material.emissiveIntensity=.5;}
  if(onSelect)onSelect(selected?selected.userData.id:null);
 }
 renderer.domElement.style.touchAction="none";
 renderer.domElement.addEventListener("pointerdown",function(ev){
  const rect=renderer.domElement.getBoundingClientRect();
  const x=((ev.clientX-rect.left)/rect.width)*2-1;
  const y=-((ev.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera({x:x,y:y},camera);
  const hits=raycaster.intersectObjects(tappable);
  if(hits.length)setSelected(hits[0].object);
 });
 LIVE={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,orbits:orbits,camAng:0};
 (function loop(){
  LIVE.raf=requestAnimationFrame(loop);
  LIVE.t+=0.01;
  orbits.forEach(function(o){
   o.ang+=0.01*o.speed;
   o.mesh.position.set(Math.cos(o.ang)*o.dist,0,Math.sin(o.ang)*o.dist);
   o.mesh.rotation.y+=0.03;
  });
  sun.rotation.y+=0.004;
  LIVE.camAng+=0.0015;
  camera.position.set(Math.sin(LIVE.camAng)*4.8,3.6,Math.cos(LIVE.camAng)*4.8);
  camera.lookAt(0,0,0);
  renderer.render(scene,camera);
 })();}

window.PLANETS=PLANETS;
window.SUN_FACT=SUN_FACT;
window.render3DPlanets=render3DPlanets;
window.dispose3DPlanets=dispose3DPlanets;
