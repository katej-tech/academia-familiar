"use strict";
/* ============ TU PLANETA (3D, cambia según cómo lo cuides) ============
   Pedido: "un juego para cuidar el planeta, así como se cuida el tamagotchi". El planeta tiene cara
   y se ve SANO o ENFERMO según sus cinco necesidades (0-100):
     🌳 forest  → continentes verdes y árboles  / marrones y secos
     💧 water   → océano azul y limpio          / turbio verdoso
     🌬️ air     → cielo claro                   / capa de smog gris
     🗑️ clean   → sin basura                    / basura flotando alrededor
     ☀️ energy  → molinos de viento y paneles solares en la superficie
   La textura se dibuja en un canvas 2:1 cada vez que se abre la pantalla (siempre los mismos
   continentes, para que sea SU planeta). Módulo ES con Three.js; dispose en stopGames(). */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

function rng(seed){let a=seed>>>0;return function(){a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
function mix(a,b,t){return new THREE.Color(a).lerp(new THREE.Color(b),Math.max(0,Math.min(1,t))).getStyle();}

function makeTexture(st){
 const W=1024,H=512,cv=document.createElement("canvas");cv.width=W;cv.height=H;const c=cv.getContext("2d");
 const dryW=(100-st.water)/100,dryF=(100-st.forest)/100;
 c.fillStyle=mix("#2E86DE","#7A8A3C",dryW*.9);c.fillRect(0,0,W,H);
 /* brillo del océano */
 c.fillStyle="rgba(255,255,255,.07)";for(let i=0;i<40;i++)c.fillRect((i*97)%W,(i*53)%H,90,6);
 const r=rng(20260926);
 const land=mix("#43A047","#A98554",dryF);const land2=mix("#66BB6A","#C2A36B",dryF);
 for(let k=0;k<9;k++){
  const cx=r()*W,cy=90+r()*(H-180),n=4+Math.floor(r()*3);
  for(let j=0;j<n;j++){
   const ex=cx+(r()-.5)*110,ey=cy+(r()-.5)*60,rx=40+r()*70,ry=26+r()*40;
   c.fillStyle=land;c.beginPath();c.ellipse(ex,ey,rx,ry,r()*3,0,Math.PI*2);c.fill();
   c.fillStyle=land2;c.beginPath();c.ellipse(ex-8,ey-6,rx*.55,ry*.5,r()*3,0,Math.PI*2);c.fill();}}
 /* casquetes de hielo */
 c.fillStyle="#F1F5F9";c.fillRect(0,0,W,34);c.fillRect(0,H-34,W,34);
 /* zonas contaminadas */
 const spots=Math.round((100-st.clean)/100*10);
 for(let i=0;i<spots;i++){c.fillStyle="rgba(60,45,30,.45)";c.beginPath();c.ellipse(r()*W,60+r()*(H-120),18+r()*26,10+r()*16,r()*3,0,Math.PI*2);c.fill();}
 /* nubes */
 c.fillStyle="rgba(255,255,255,.55)";for(let i=0;i<14;i++){c.beginPath();c.ellipse(r()*W,50+r()*(H-100),40+r()*40,8+r()*8,0,0,Math.PI*2);c.fill();}
 const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}

function place(obj,lat,lon,radius){
 const phi=(90-lat)*Math.PI/180,th=lon*Math.PI/180;
 const p=new THREE.Vector3(radius*Math.sin(phi)*Math.cos(th),radius*Math.cos(phi),radius*Math.sin(phi)*Math.sin(th));
 obj.position.copy(p);obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),p.clone().normalize());}

let LIVE=null;
function disposeEcoPlanet(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});
  LIVE.renderer.dispose();const c=LIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);
 }catch(e){}
 LIVE=null;}

function renderEcoPlanet(containerId,st){
 const el=document.getElementById(containerId);if(!el)return;
 disposeEcoPlanet();
 const w=el.clientWidth||320,h=el.clientHeight||280;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#0B1120");
 const camera=new THREE.PerspectiveCamera(36,w/h,.1,60);camera.position.set(0,.05,4.1);camera.lookAt(0,0,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.15));
 const dl=new THREE.DirectionalLight(0xffffff,1.5);dl.position.set(3,2,5);scene.add(dl);
 const health=(st.air+st.water+st.forest+st.clean+st.energy)/5;

 for(let i=0;i<90;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.014,4,4),new THREE.MeshBasicMaterial({color:"#FFFFFF"}));s.position.set((Math.random()-.5)*11,(Math.random()-.5)*7,-2.5-Math.random()*3);scene.add(s);}

 const world=new THREE.Group();scene.add(world);
 const planet=new THREE.Mesh(new THREE.SphereGeometry(1,48,36),new THREE.MeshStandardMaterial({map:makeTexture(st),roughness:.85}));world.add(planet);
 const r=rng(7);
 /* árboles */
 const trees=Math.round(st.forest/100*16);
 for(let i=0;i<trees;i++){
  const t=new THREE.Group();
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.012,.016,.05,6),new THREE.MeshStandardMaterial({color:"#7A5230"}));trunk.position.y=.025;t.add(trunk);
  const crown=new THREE.Mesh(new THREE.ConeGeometry(.05,.11,8),new THREE.MeshStandardMaterial({color:st.forest>40?"#2E7D32":"#8D7B4A"}));crown.position.y=.1;t.add(crown);
  place(t,-60+r()*120,r()*360,1.0);world.add(t);}
 /* energía limpia */
 const turbines=[];
 const nT=Math.round(st.energy/100*4);
 for(let i=0;i<nT;i++){
  const g=new THREE.Group();
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.008,.014,.2,6),new THREE.MeshStandardMaterial({color:"#F1F5F9"}));pole.position.y=.1;g.add(pole);
  const rotor=new THREE.Group();rotor.position.set(0,.2,.02);
  for(let k=0;k<3;k++){const b=new THREE.Mesh(new THREE.BoxGeometry(.012,.11,.004),new THREE.MeshStandardMaterial({color:"#FFFFFF"}));b.position.y=.055;const bg=new THREE.Group();bg.rotation.z=k*Math.PI*2/3;bg.add(b);rotor.add(bg);}
  g.add(rotor);turbines.push(rotor);place(g,-40+i*28+r()*10,30+i*85,1.0);world.add(g);}
 const nS=Math.round(st.energy/100*3);
 for(let i=0;i<nS;i++){
  const p=new THREE.Mesh(new THREE.BoxGeometry(.13,.008,.09),new THREE.MeshStandardMaterial({color:"#1D4ED8",metalness:.4,roughness:.3}));
  const g=new THREE.Group();p.position.y=.03;p.rotation.x=.4;g.add(p);place(g,-20+i*22,200+i*55,1.0);world.add(g);}
 /* smog */
 const smogA=(100-st.air)/100;
 const smog=new THREE.Mesh(new THREE.SphereGeometry(1.1,32,24),new THREE.MeshStandardMaterial({color:"#5B5F66",transparent:true,opacity:smogA*.6,roughness:1,depthWrite:false}));scene.add(smog);
 /* basura flotante */
 const junk=[];const nJ=Math.round((100-st.clean)/100*14);
 for(let i=0;i<nJ;i++){
  const m=new THREE.Mesh(new THREE.IcosahedronGeometry(.045+r()*.03,0),new THREE.MeshStandardMaterial({color:["#9CA3AF","#B45309","#6B7280","#DC2626"][i%4],roughness:.9,flatShading:true}));
  const a=r()*Math.PI*2,b=(r()-.5)*1.2,rad=1.22+r()*.28;
  m.userData={a:a,b:b,rad:rad,sp:.15+r()*.3};scene.add(m);junk.push(m);}
 /* cara (queda fija mientras el planeta gira detrás) */
 const face=new THREE.Group();scene.add(face);
 const white=new THREE.MeshStandardMaterial({color:"#FFFFFF",roughness:.4}),black=new THREE.MeshStandardMaterial({color:"#111827",roughness:.3});
 [-1,1].forEach(function(s){
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.135,20,14),white);eye.scale.z=.45;eye.position.set(s*.3,.2,1.06);face.add(eye);
  const pup=new THREE.Mesh(new THREE.SphereGeometry(.07,14,10),black);pup.position.set(s*.3,.19+(health<35?-.02:0),1.11);face.add(pup);
  const sh=new THREE.Mesh(new THREE.SphereGeometry(.022,8,6),white);sh.position.set(s*.3+.025,.22,1.135);face.add(sh);
  if(health<35){const tear=new THREE.Mesh(new THREE.SphereGeometry(.03,10,8),new THREE.MeshStandardMaterial({color:"#60A5FA",roughness:.2}));tear.scale.y=1.4;tear.position.set(s*.3+.04,.03,1.11);face.add(tear);
   const brow=new THREE.Mesh(new THREE.BoxGeometry(.16,.024,.02),black);brow.position.set(s*.3,.4,1.06);brow.rotation.z=-s*.35;face.add(brow);}
  const cheek=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),new THREE.MeshStandardMaterial({color:"#F472B6",transparent:true,opacity:.5}));cheek.scale.z=.3;cheek.position.set(s*.5,-.02,1.0);face.add(cheek);});
 if(health>=65){const m=new THREE.Mesh(new THREE.TorusGeometry(.2,.03,8,24,Math.PI),black);m.rotation.z=Math.PI;m.position.set(0,-.02,1.08);face.add(m);}
 else if(health>=35){const m=new THREE.Mesh(new THREE.BoxGeometry(.24,.03,.02),black);m.position.set(0,-.12,1.09);face.add(m);}
 else{const m=new THREE.Mesh(new THREE.TorusGeometry(.17,.03,8,24,Math.PI),black);m.position.set(0,-.17,1.08);face.add(m);}

 /* chispas al cuidar */
 const sparks=[];for(let i=0;i<14;i++){const s=new THREE.Mesh(new THREE.OctahedronGeometry(.05),new THREE.MeshBasicMaterial({color:i%2?"#FDE047":"#86EFAC",transparent:true,opacity:0}));scene.add(s);sparks.push({m:s,v:new THREE.Vector3(),life:0});}
 LIVE={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,pulse:0,sparks:sparks,world:world,face:face};
 (function loop(){
  LIVE.raf=requestAnimationFrame(loop);LIVE.t+=.016;
  world.rotation.y+=.0035;turbines.forEach(function(t){t.rotation.z-=.04;});
  junk.forEach(function(m){m.userData.a+=m.userData.sp*.01;const d=m.userData;m.position.set(Math.cos(d.a)*d.rad*Math.cos(d.b),Math.sin(d.b)*d.rad,Math.sin(d.a)*d.rad*Math.cos(d.b));m.rotation.x+=.02;m.rotation.y+=.015;});
  const bob=1+Math.sin(LIVE.t*2)*.012;
  let pulse=0;if(LIVE.pulse>0){LIVE.pulse-=.02;pulse=Math.sin((1-LIVE.pulse)*Math.PI)*.1;}
  const sc=bob+pulse;world.scale.setScalar(sc);face.scale.setScalar(sc);smog.scale.setScalar(sc);
  LIVE.sparks.forEach(function(s){if(s.life>0){s.life-=.02;s.m.position.addScaledVector(s.v,.02);s.m.material.opacity=Math.max(0,s.life);s.m.rotation.y+=.1;}else s.m.material.opacity=0;});
  renderer.render(scene,camera);
 })();}
function ecoPlanetPulse(){
 if(!LIVE)return;LIVE.pulse=1;
 LIVE.sparks.forEach(function(s,i){const a=Math.random()*Math.PI*2;s.m.position.set(Math.cos(a)*1.1,Math.sin(a)*1.1,.6);s.v.set(Math.cos(a)*.7,Math.sin(a)*.7+.3,.2);s.life=1;});}

window.renderEcoPlanet=renderEcoPlanet;
window.ecoPlanetPulse=ecoPlanetPulse;
window.disposeEcoPlanet=disposeEcoPlanet;
