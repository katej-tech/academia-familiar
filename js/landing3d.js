"use strict";
/* ============ ATERRIZA EN UN PLANETA (3D) ============
   Un astronauta (el mismo modelo del guía "Astro") camina por una superficie generada: se toca el
   suelo para caminar y el botón salta con la GRAVEDAD REAL del lugar (la altura sale de la física:
   h = v²/2g, con la velocidad de un salto de niño en la Tierra ≈ 0,5 m). Hay cielo, niebla y Sol
   distintos en cada sitio, cráteres, rocas y 5 muestras brillantes para recoger. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

let LIVE=null;
function disposeLanding3D(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);if(LIVE.ro)LIVE.ro.disconnect();}catch(e){}
 try{LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});LIVE.renderer.dispose();const c=LIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);}catch(e){}
 LIVE=null;}

function rng(seed){let a=(seed||7)>>>0;return function(){a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
function smooth(a,b,x){const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);}
function planetTex(kind){
 const cv=document.createElement("canvas");cv.width=256;cv.height=128;const c=cv.getContext("2d");
 if(kind==="earth"){c.fillStyle="#2E86DE";c.fillRect(0,0,256,128);const r=rng(5);c.fillStyle="#43A047";for(let i=0;i<9;i++){c.beginPath();c.ellipse(r()*256,20+r()*88,16+r()*28,10+r()*18,r()*3,0,7);c.fill();}c.fillStyle="rgba(255,255,255,.6)";for(let i=0;i<12;i++){c.beginPath();c.ellipse(r()*256,r()*128,14+r()*20,4+r()*5,0,0,7);c.fill();}}
 else{c.fillStyle="#E6CF9A";c.fillRect(0,0,256,128);for(let i=0;i<9;i++){c.fillStyle=i%2?"#D3B676":"#EBD9AE";c.fillRect(0,i*14,256,8);}}
 const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}

/* cfg: {g,sky,fog,fogD,ground:[c1,c2],amp,craters,rocks,trees,stars,sunSize,sunColor,body:"earth"|"saturn"|null,seed}
   cb(ev,info): "sample" {n,total} · "jump" {h,t} · "ready" */
function renderLanding(containerId,cfg,cb){
 const el=document.getElementById(containerId);if(!el)return null;
 disposeLanding3D();
 const w=el.clientWidth||340,h=el.clientHeight||340;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h,false);
 const cv=renderer.domElement;cv.style.width="100%";cv.style.height="100%";cv.style.display="block";cv.style.touchAction="none";
 el.innerHTML="";el.appendChild(cv);
 const scene=new THREE.Scene();scene.background=new THREE.Color(cfg.sky);
 if(cfg.fogD)scene.fog=new THREE.FogExp2(cfg.fog||cfg.sky,cfg.fogD);
 const camera=new THREE.PerspectiveCamera(55,w/h,.1,400);
 scene.add(new THREE.AmbientLight(0xffffff,cfg.stars?.75:1.1));
 const sun=new THREE.DirectionalLight(cfg.sunColor||0xffffff,cfg.stars?2.0:1.3);sun.position.set(-30,40,-20);scene.add(sun);
 const R=rng(cfg.seed||11);
 /* --- relieve: ondulaciones + cráteres, llano cerca del punto de aterrizaje --- */
 const craters=[];for(let i=0;i<(cfg.craters||0);i++){const a=R()*Math.PI*2,d=14+R()*38;craters.push({x:Math.cos(a)*d,z:Math.sin(a)*d,r:4+R()*9,dp:.8+R()*1.6});}
 function H(x,z){
  const d0=Math.sqrt(x*x+z*z),flat=smooth(4,16,d0);
  let y=(Math.sin(x*.11)*Math.cos(z*.09)+Math.sin(x*.23+1.3)*Math.sin(z*.19)*.5+Math.sin(x*.05+z*.07)*1.2)*(cfg.amp||1)*flat;
  for(let i=0;i<craters.length;i++){const c=craters[i],dx=x-c.x,dz=z-c.z,q=Math.sqrt(dx*dx+dz*dz)/c.r;
   if(q<1)y-=c.dp*(1-q*q);else if(q<1.35)y+=c.dp*.35*(1-(q-1)/.35);}
  return y;}
 const SZ=140,SEG=110,geo=new THREE.PlaneGeometry(SZ,SZ,SEG,SEG);geo.rotateX(-Math.PI/2);
 const pos=geo.attributes.position,col=new Float32Array(pos.count*3),c1=new THREE.Color(cfg.ground[0]),c2=new THREE.Color(cfg.ground[1]),tmp=new THREE.Color();
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),y=H(x,z);pos.setY(i,y);tmp.copy(c1).lerp(c2,Math.max(0,Math.min(1,.5+Math.sin(x*.31)*Math.cos(z*.27)*.5+(R()-.5)*.35+y*.12)));col[i*3]=tmp.r;col[i*3+1]=tmp.g;col[i*3+2]=tmp.b;}
 geo.setAttribute("color",new THREE.BufferAttribute(col,3));geo.computeVertexNormals();
 const ground=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95,flatShading:true}));scene.add(ground);
 /* --- rocas y árboles --- */
 const rockM=new THREE.MeshStandardMaterial({color:new THREE.Color(cfg.ground[1]).multiplyScalar(.8),roughness:1,flatShading:true});
 for(let i=0;i<(cfg.rocks||0);i++){const a=R()*Math.PI*2,d=7+R()*52,x=Math.cos(a)*d,z=Math.sin(a)*d,s=.3+R()*1.1;
  const m=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),rockM);m.position.set(x,H(x,z)+s*.45,z);m.rotation.set(R()*3,R()*3,R()*3);m.scale.y=.7;scene.add(m);}
 if(cfg.trees){const tm=new THREE.MeshStandardMaterial({color:"#15803D",roughness:.9,flatShading:true}),bm=new THREE.MeshStandardMaterial({color:"#7C4A21",roughness:1});
  for(let i=0;i<cfg.trees;i++){const a=R()*Math.PI*2,d=9+R()*50,x=Math.cos(a)*d,z=Math.sin(a)*d,y=H(x,z),s=.8+R()*.8;
   const tr=new THREE.Mesh(new THREE.CylinderGeometry(.15*s,.2*s,1.2*s,6),bm);tr.position.set(x,y+.6*s,z);scene.add(tr);
   const lf=new THREE.Mesh(new THREE.ConeGeometry(1.1*s,2.6*s,7),tm);lf.position.set(x,y+2.2*s,z);scene.add(lf);}}
 /* --- cielo: estrellas, Sol y otro cuerpo --- */
 if(cfg.stars){const sp=[],r2=rng(3);for(let i=0;i<500;i++){const u=r2()*Math.PI*2,v=Math.acos(r2()*1.6-.6),d=180;sp.push(Math.cos(u)*Math.sin(v)*d,Math.cos(v)*d,Math.sin(u)*Math.sin(v)*d);}
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(sp,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:"#FFFFFF",size:1.2,fog:false})));}
 const sunMesh=new THREE.Mesh(new THREE.SphereGeometry(cfg.sunSize||3,24,16),new THREE.MeshBasicMaterial({color:cfg.sunColor||"#FFF3B0",fog:false}));sunMesh.position.set(-75,36,-115);scene.add(sunMesh);
 if(cfg.sunHalo){const hl=new THREE.Mesh(new THREE.SphereGeometry((cfg.sunSize||3)*1.7,20,14),new THREE.MeshBasicMaterial({color:cfg.sunColor||"#FFF3B0",transparent:true,opacity:.25,fog:false}));hl.position.copy(sunMesh.position);scene.add(hl);}
 if(cfg.body){const bs=cfg.body==="saturn"?16:7,b=new THREE.Mesh(new THREE.SphereGeometry(bs,28,20),new THREE.MeshBasicMaterial({map:planetTex(cfg.body),fog:false}));b.position.set(58,32,-120);scene.add(b);
  if(cfg.body==="saturn"){const rg=new THREE.Mesh(new THREE.RingGeometry(bs*1.4,bs*2.2,48),new THREE.MeshBasicMaterial({color:"#D9C58F",side:THREE.DoubleSide,transparent:true,opacity:.8,fog:false}));rg.position.copy(b.position);rg.rotation.x=Math.PI/2.4;scene.add(rg);}}
 /* --- astronauta --- */
 const astro=new THREE.Group(),inner=new THREE.Group();astro.add(inner);
 const gm=window.GUIDE_MODELS&&window.GUIDE_MODELS.find(function(m){return m.id==="astro";});if(gm)gm.build(inner);
 inner.scale.setScalar(.95);scene.add(astro);
 const FOOT=.66*.95;let px=0,pz=6,py=H(0,6)+FOOT,vy=0,onGround=true,tx=null,tz=null,face=Math.PI,maxY=0,tJump=0,walkT=0;
 /* --- muestras --- */
 const samples=[],sm=new THREE.MeshStandardMaterial({color:"#22D3EE",emissive:"#22D3EE",emissiveIntensity:.9,roughness:.2});
 for(let i=0;i<5;i++){const a=R()*Math.PI*2,d=9+R()*22,x=Math.cos(a)*d,z=Math.sin(a)*d;
  const m=new THREE.Mesh(new THREE.OctahedronGeometry(.5,0),sm);m.scale.y=1.4;m.position.set(x,H(x,z)+1.1,z);scene.add(m);
  const lg=new THREE.PointLight("#22D3EE",.7,6);lg.position.copy(m.position);scene.add(lg);
  samples.push({m:m,lg:lg,x:x,z:z,y0:m.position.y,got:false,ph:R()*6});}
 const ctx={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,ro:null,got:0,locked:false,last:performance.now()};
 if(window.ResizeObserver){ctx.ro=new ResizeObserver(function(){const nw=el.clientWidth,nh=el.clientHeight;if(nw>0&&nh>0){renderer.setSize(nw,nh,false);camera.aspect=nw/nh;camera.updateProjectionMatrix();}});ctx.ro.observe(el);}
 const rc=new THREE.Raycaster();
 cv.addEventListener("pointerdown",function(e){
  if(ctx.locked)return;
  const r=cv.getBoundingClientRect();rc.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},camera);
  const hit=rc.intersectObject(ground,false)[0];if(hit){tx=Math.max(-60,Math.min(60,hit.point.x));tz=Math.max(-60,Math.min(60,hit.point.z));}});
 const V0=Math.sqrt(2*9.81*.5); /* salto de un niño en la Tierra: ~0,5 m */
 function jump(){if(!onGround||ctx.locked)return;vy=V0;onGround=false;maxY=py;tJump=0;}
 LIVE=ctx;
 camera.position.set(0,5,16);
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);
  const now=performance.now(),dt=Math.min(.05,(now-ctx.last)/1000);ctx.last=now;ctx.t+=dt;
  /* caminar hacia el punto tocado */
  let moving=false;
  if(tx!==null){const dx=tx-px,dz=tz-pz,d=Math.sqrt(dx*dx+dz*dz);if(d>.25){const sp=Math.min(d,4.2*dt);px+=dx/d*sp;pz+=dz/d*sp;face=Math.atan2(dx,dz);moving=true;}else{tx=null;}}
  const gy=H(px,pz)+FOOT;
  if(onGround){py+=(gy-py)*Math.min(1,dt*14);}
  else{vy-=cfg.g*dt;py+=vy*dt;tJump+=dt;if(py>maxY)maxY=py;if(py<=gy){py=gy;onGround=true;vy=0;if(cb)cb("jump",{h:Math.max(0,maxY-gy),t:tJump});}}
  walkT+=moving&&onGround?dt*9:0;
  astro.position.set(px,py+(moving&&onGround?Math.abs(Math.sin(walkT))*.07:0),pz);
  inner.rotation.y+=(face-inner.rotation.y)*.2;inner.rotation.z=moving&&onGround?Math.sin(walkT)*.06:0;
  /* cámara que sigue por detrás */
  const cx=px+Math.sin(face+Math.PI)*0+0,cz=pz+8.5;camera.position.x+=(cx-camera.position.x)*.06;camera.position.z+=(cz-camera.position.z)*.06;
  const cyT=Math.max(H(camera.position.x,camera.position.z)+1.8,py+2.7);camera.position.y+=(cyT-camera.position.y)*.06;
  camera.lookAt(px,py+3.4,pz-12);
  /* muestras */
  samples.forEach(function(s){
   if(s.got)return;
   s.m.rotation.y+=dt*2;s.m.position.y=s.y0+Math.sin(ctx.t*2+s.ph)*.18;s.lg.position.y=s.m.position.y;
   const dx=s.x-px,dz=s.z-pz;
   if(dx*dx+dz*dz<2.6){s.got=true;ctx.got++;s.m.visible=false;s.lg.visible=false;if(cb)cb("sample",{n:ctx.got,total:5});}});
  renderer.render(scene,camera);})();
 if(cb)setTimeout(function(){cb("ready",{});},0);
 return{
  jump:jump,
  lock:function(v){ctx.locked=!!v;},
  /* pruebas: lleva al astronauta a la muestra i */
  goSample:function(i){const s=samples[i];if(s){px=s.x;pz=s.z;tx=null;}},
  state:function(){return{x:px,z:pz,y:py,onGround:onGround,got:ctx.got};}};}

window.renderLanding=renderLanding;
window.disposeLanding3D=disposeLanding3D;
