"use strict";
/* ============ PLANETAS PERSONAJE (3D) ============
   Pedido: al niño le interesa armar planetas y que "un planeta sea un personaje". Cada planeta
   (los 8 reales, el Sol y los que él construye) es una esfera con textura generada en un canvas,
   con CARA que parpadea y habla. La misma función dibuja a los planetas reales y a los inventados:
   todo se describe con un objeto cfg {type,tex,c1,c2,size,atmo,rings,moons,face,tilt,spot,seed}.
   El constructor (planetlab.js) solo cambia ese cfg y llama a update(). */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const PRESETS={
 sol:{nm:"Sol",type:"estrella",tex:"estrella",c1:"#FBBF24",c2:"#F97316",size:1.15,atmo:2,rings:0,moons:0,face:"feliz"},
 mercurio:{nm:"Mercurio",type:"rocoso",tex:"rocoso",c1:"#9A948C",c2:"#6E6963",size:.62,atmo:0,rings:0,moons:0,face:"sorpresa"},
 venus:{nm:"Venus",type:"rocoso",tex:"gaseoso",c1:"#E8C27E",c2:"#D3A55A",size:.95,atmo:2,rings:0,moons:0,face:"enojon",soft:1},
 tierra:{nm:"Tierra",type:"oceano",tex:"oceano",c1:"#2E86DE",c2:"#43A047",size:1,atmo:1,rings:0,moons:1,face:"feliz"},
 marte:{nm:"Marte",type:"rocoso",tex:"rocoso",c1:"#C1440E",c2:"#8E2F08",size:.75,atmo:0,rings:0,moons:2,face:"cool"},
 jupiter:{nm:"Júpiter",type:"gaseoso",tex:"gaseoso",c1:"#E8C9A0",c2:"#B5763F",size:1.3,atmo:0,rings:0,moons:3,face:"feliz",spot:1},
 saturno:{nm:"Saturno",type:"gaseoso",tex:"gaseoso",c1:"#F0DFAE",c2:"#D9C58F",size:1.15,atmo:0,rings:2,moons:2,face:"cool",soft:1},
 urano:{nm:"Urano",type:"hielo",tex:"hielo",c1:"#9BE7E0",c2:"#7DD3CF",size:.95,atmo:1,rings:1,moons:2,face:"sorpresa",tilt:1.45},
 neptuno:{nm:"Neptuno",type:"hielo",tex:"hielo",c1:"#3B5BA9",c2:"#2D4A8C",size:.93,atmo:1,rings:0,moons:1,face:"dormilon"}
};

function rng(seed){let a=(seed||7)>>>0;return function(){a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
function shade(hex,k){const c=new THREE.Color(hex);c.lerp(new THREE.Color(k>0?"#ffffff":"#000000"),Math.abs(k));return "#"+c.getHexString();}

function makeTex(cfg){
 const W=512,H=256,cv=document.createElement("canvas");cv.width=W;cv.height=H;const c=cv.getContext("2d");
 const r=rng(cfg.seed||7),t=cfg.tex||cfg.type;
 if(t==="gaseoso"||t==="hielo"){
  const n=t==="gaseoso"?15:9,amp=cfg.soft?2:(t==="gaseoso"?5:2.5);
  c.fillStyle=cfg.c1;c.fillRect(0,0,W,H);
  for(let i=0;i<n;i++){
   const y0=i*H/n,y1=(i+1)*H/n;
   c.fillStyle=i%2?cfg.c2:shade(cfg.c1,i%3===0?.12:-.06);
   c.beginPath();c.moveTo(0,y0);
   for(let x=0;x<=W;x+=12)c.lineTo(x,y0+Math.sin(x*.025+i*1.7)*amp);
   c.lineTo(W,y1+2);c.lineTo(0,y1+2);c.closePath();c.fill();}
  if(cfg.spot){c.fillStyle="#C1440E";c.beginPath();c.ellipse(W*.62,H*.62,34,18,0,0,Math.PI*2);c.fill();c.fillStyle="#E7835A";c.beginPath();c.ellipse(W*.62,H*.62,20,10,0,0,Math.PI*2);c.fill();}
  if(t==="hielo"){c.fillStyle="rgba(255,255,255,.45)";for(let i=0;i<60;i++){c.beginPath();c.arc(r()*W,r()*H,1+r()*2,0,Math.PI*2);c.fill();}}
 }else if(t==="lava"){
  c.fillStyle="#241512";c.fillRect(0,0,W,H);
  for(let i=0;i<34;i++){
   c.strokeStyle=i%3?cfg.c1:cfg.c2;c.lineWidth=2+r()*4;c.shadowColor=cfg.c1;c.shadowBlur=10;
   c.beginPath();let x=r()*W,y=r()*H;c.moveTo(x,y);
   for(let k=0;k<6;k++){x+=(r()-.5)*90;y+=(r()-.5)*60;c.lineTo(x,y);}c.stroke();}
  c.shadowBlur=0;
 }else if(t==="oceano"){
  c.fillStyle=cfg.c1;c.fillRect(0,0,W,H);
  c.fillStyle="rgba(255,255,255,.07)";for(let i=0;i<30;i++)c.fillRect(r()*W,r()*H,60,5);
  for(let k=0;k<8;k++){
   const cx=r()*W,cy=60+r()*(H-120);
   for(let j=0;j<5;j++){c.fillStyle=j%2?shade(cfg.c2,.12):cfg.c2;c.beginPath();c.ellipse(cx+(r()-.5)*70,cy+(r()-.5)*40,24+r()*40,16+r()*24,r()*3,0,Math.PI*2);c.fill();}}
  c.fillStyle="#F1F5F9";c.fillRect(0,0,W,22);c.fillRect(0,H-22,W,22);
  c.fillStyle="rgba(255,255,255,.55)";for(let i=0;i<16;i++){c.beginPath();c.ellipse(r()*W,40+r()*(H-80),30+r()*40,6+r()*7,0,0,Math.PI*2);c.fill();}
 }else if(t==="estrella"){
  const g=c.createRadialGradient(W/2,H/2,10,W/2,H/2,W/1.6);g.addColorStop(0,"#FEF3C7");g.addColorStop(.5,cfg.c1);g.addColorStop(1,cfg.c2);
  c.fillStyle=g;c.fillRect(0,0,W,H);c.fillStyle="rgba(255,255,255,.18)";for(let i=0;i<40;i++){c.beginPath();c.arc(r()*W,r()*H,4+r()*12,0,Math.PI*2);c.fill();}
 }else{
  c.fillStyle=cfg.c1;c.fillRect(0,0,W,H);
  for(let i=0;i<60;i++){c.fillStyle=r()<.5?cfg.c2:shade(cfg.c1,.12);c.globalAlpha=.35+r()*.3;c.beginPath();c.ellipse(r()*W,r()*H,12+r()*50,8+r()*30,r()*3,0,Math.PI*2);c.fill();}
  c.globalAlpha=1;
  for(let i=0;i<26;i++){const x=r()*W,y=r()*H,rad=5+r()*16;
   c.fillStyle="rgba(0,0,0,.22)";c.beginPath();c.arc(x,y,rad,0,Math.PI*2);c.fill();
   c.strokeStyle="rgba(255,255,255,.28)";c.lineWidth=2;c.beginPath();c.arc(x-1,y-1,rad,Math.PI*.8,Math.PI*1.7);c.stroke();}
 }
 const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;return tex;}

function mat(c,o){return new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.5},o||{}));}
function buildFace(kind,R,tilt){
 const g=new THREE.Group(),eyes=new THREE.Group(),mouth=new THREE.Group();g.add(eyes,mouth);
 const white=mat("#FFFFFF",{roughness:.35}),black=mat("#111827",{roughness:.3});
 const ez=R*.99;
 const eye=function(x,big,closed,angry){
  const e=new THREE.Group();e.position.set(x*R,.2*R,ez);
  if(closed){const a=new THREE.Mesh(new THREE.TorusGeometry(.09*R,.022*R,8,16,Math.PI),black);a.rotation.z=Math.PI;e.add(a);}
  else{const s=big?1.25:1;
   const w=new THREE.Mesh(new THREE.SphereGeometry(.13*R*s,20,14),white);w.scale.z=.45;e.add(w);
   const p=new THREE.Mesh(new THREE.SphereGeometry(.068*R*s,14,10),black);p.position.set(0,angry?-.015*R:0,.07*R*s);e.add(p);
   const sh=new THREE.Mesh(new THREE.SphereGeometry(.02*R,8,6),white);sh.position.set(.03*R,.03*R,.11*R*s);e.add(sh);}
  eyes.add(e);};
 const brow=function(x,rot){const b=new THREE.Mesh(new THREE.BoxGeometry(.17*R,.026*R,.02*R),black);b.position.set(x*R,.38*R,ez);b.rotation.z=rot;eyes.add(b);};
 if(kind==="dormilon"){eye(-.3,0,1);eye(.3,0,1);}
 else if(kind==="cool"){
  const frame=new THREE.Mesh(new THREE.BoxGeometry(.84*R,.07*R,.05*R),black);frame.position.set(0,.24*R,ez+.02*R);eyes.add(frame);
  [-1,1].forEach(function(s){const l=new THREE.Mesh(new THREE.BoxGeometry(.3*R,.19*R,.05*R),black);l.position.set(s*.26*R,.2*R,ez+.025*R);eyes.add(l);
   const gl=new THREE.Mesh(new THREE.BoxGeometry(.09*R,.02*R,.02*R),white);gl.position.set(s*.2*R,.25*R,ez+.06*R);eyes.add(gl);});}
 else{eye(-.3,kind==="sorpresa",0,kind==="enojon");eye(.3,kind==="sorpresa",0,kind==="enojon");}
 if(kind==="enojon"){brow(-.3,-.38);brow(.3,.38);}
 if(kind==="feliz"||kind==="cool"||kind==="dormilon"){
  const m=new THREE.Mesh(new THREE.TorusGeometry(.2*R,.03*R,8,24,Math.PI),black);m.rotation.z=Math.PI;m.position.set(0,-.02*R,ez);mouth.add(m);
  if(kind==="dormilon"){m.scale.set(.45,.45,1);m.position.y=-.1*R;}}
 else if(kind==="sorpresa"){const m=new THREE.Mesh(new THREE.TorusGeometry(.085*R,.028*R,8,20),black);m.position.set(0,-.12*R,ez);mouth.add(m);}
 else{const m=new THREE.Mesh(new THREE.BoxGeometry(.26*R,.03*R,.02*R),black);m.position.set(0,-.14*R,ez);mouth.add(m);}
 [-1,1].forEach(function(s){const ch=new THREE.Mesh(new THREE.SphereGeometry(.07*R,10,8),new THREE.MeshStandardMaterial({color:"#F472B6",transparent:true,opacity:.45}));ch.scale.z=.3;ch.position.set(s*.52*R,-.04*R,ez-.02*R);g.add(ch);});
 if(tilt)g.rotation.z=tilt;
 g.userData={eyes:eyes,mouth:mouth,blinks:kind!=="dormilon"&&kind!=="cool"};
 return g;}

function buildPlanet(cfg){
 const R=cfg.size||1,g=new THREE.Group();
 const star=cfg.type==="estrella";
 const bodyMat=star?new THREE.MeshBasicMaterial({map:makeTex(cfg)}):new THREE.MeshStandardMaterial({map:makeTex(cfg),roughness:.85,emissive:cfg.type==="lava"?"#ff4a00":"#000000",emissiveIntensity:cfg.type==="lava"?.28:0});
 const body=new THREE.Mesh(new THREE.SphereGeometry(R,48,36),bodyMat);g.add(body);
 if(star){[[1.08,.32],[1.2,.16],[1.36,.08]].forEach(function(h){g.add(new THREE.Mesh(new THREE.SphereGeometry(R*h[0],28,20),new THREE.MeshBasicMaterial({color:"#FDBA33",transparent:true,opacity:h[1],side:THREE.BackSide,depthWrite:false,blending:THREE.AdditiveBlending})));});}
 else if(cfg.atmo>0){
  const at=new THREE.Mesh(new THREE.SphereGeometry(R*1.07,32,24),new THREE.MeshBasicMaterial({color:shade(cfg.c1,.45),transparent:true,opacity:cfg.atmo>1?.3:.16,side:THREE.BackSide,depthWrite:false}));g.add(at);}
 const rings=[];
 for(let i=0;i<(cfg.rings||0);i++){
  const inner=R*(1.38+i*.5),outer=inner+R*(i?.2:.34);
  const rg=new THREE.Mesh(new THREE.RingGeometry(inner,outer,64),new THREE.MeshBasicMaterial({color:i?shade(cfg.c2,.25):cfg.c2,side:THREE.DoubleSide,transparent:true,opacity:.85}));
  rg.rotation.x=Math.PI/2.25;rg.rotation.y=.12;g.add(rg);rings.push(rg);}
 const moons=[];
 for(let i=0;i<(cfg.moons||0);i++){
  const m=new THREE.Mesh(new THREE.SphereGeometry(R*(.11+.03*(i%2)),14,10),new THREE.MeshStandardMaterial({color:["#D1D5DB","#A8A29E","#E7E5E4"][i%3],roughness:.9}));
  m.userData={a:i*2.1,rad:R*(1.75+i*.36+((cfg.rings||0)?.5:0)),sp:.012-i*.002,inc:(i-1)*.25};g.add(m);moons.push(m);}
 return{g:g,body:body,moons:moons};}

function camDist(cfg,aspect){
 const R=cfg.size||1,t=Math.tan(18*Math.PI/180);
 let out=R*1.15;
 if(cfg.type==="estrella")return R*1.55/t;
 if(cfg.rings)out=Math.max(out,R*(1.38+(cfg.rings-1)*.5+(cfg.rings>1?.2:.34))*1.08);
 if(cfg.moons)out=Math.max(out,R*(1.75+(cfg.moons-1)*.36+(cfg.rings?.5:0))*1.3);
 return Math.max(2.6,Math.max(R*1.22/t,out/(t*Math.min(aspect||1.5,2))));}
let LIVE=null;
function disposeAll(ctx){
 if(!ctx)return;
 try{cancelAnimationFrame(ctx.raf);if(ctx.ro)ctx.ro.disconnect();}catch(e){}
 try{
  ctx.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});
  ctx.renderer.dispose();const c=ctx.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);
 }catch(e){}}
function disposePlanetChar(){disposeAll(LIVE);LIVE=null;}
function clearGroup(grp){
 while(grp.children.length){const c=grp.children.pop();c.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});}}

function sceneBase(el,bg,fw,fh){
 const w=fw||el.clientWidth||320,h=fh||el.clientHeight||280;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h,false);
 const cvs=renderer.domElement;cvs.style.width="100%";cvs.style.height="100%";cvs.style.display="block";
 el.innerHTML="";el.appendChild(cvs);
 const scene=new THREE.Scene();scene.background=new THREE.Color(bg||"#0B1120");
 const camera=new THREE.PerspectiveCamera(36,w/h,.1,80);
 scene.add(new THREE.AmbientLight(0xffffff,1.2));
 const dl=new THREE.DirectionalLight(0xffffff,1.4);dl.position.set(3,2,5);scene.add(dl);
 let ro=null;
 if(window.ResizeObserver&&el.isConnected){ro=new ResizeObserver(function(){const nw=el.clientWidth,nh=el.clientHeight;if(nw>0&&nh>0){renderer.setSize(nw,nh,false);camera.aspect=nw/nh;camera.updateProjectionMatrix();}});ro.observe(el);}
 const r=rng(11);for(let i=0;i<110;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.014,4,4),new THREE.MeshBasicMaterial({color:"#FFFFFF"}));s.position.set((r()-.5)*16,(r()-.5)*10,-3-r()*5);scene.add(s);}
 return{renderer:renderer,scene:scene,camera:camera,ro:ro};}

/* ---------- un planeta personaje (conoce / constructor) ---------- */
function renderPlanetChar(containerId,cfg0,opts){
 opts=opts||{};
 const el=document.getElementById(containerId);if(!el)return null;
 disposePlanetChar();
 const b=sceneBase(el,opts.bg);
 const holder=new THREE.Group(),faceHolder=new THREE.Group();b.scene.add(holder,faceHolder);
 const ctx=Object.assign(b,{holder:holder,faceHolder:faceHolder,raf:null,t:0,talking:false,bounce:0,cfg:null,pl:null,face:null,nextBlink:2});
 function build(cfg){
  ctx.cfg=cfg;clearGroup(holder);clearGroup(faceHolder);
  ctx.pl=buildPlanet(cfg);holder.add(ctx.pl.g);
  ctx.pl.g.rotation.z=cfg.tilt||0;
  const R=cfg.size||1;
  ctx.face=buildFace(cfg.face||"feliz",R,cfg.tilt?cfg.tilt:0);faceHolder.add(ctx.face);
  ctx.camZ=camDist(cfg,ctx.camera.aspect);ctx.camera.position.set(0,.1,ctx.camZ);ctx.camera.lookAt(0,0,0);}
 build(cfg0);
 const cv=ctx.renderer.domElement;cv.style.touchAction="none";
 cv.addEventListener("pointerdown",function(){ctx.bounce=1;if(typeof tone==="function")tone(520+Math.random()*180,.12);if(opts.onTap)opts.onTap();});
 LIVE=ctx;
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);ctx.t+=.016;
  ctx.camera.position.z+=(camDist(ctx.cfg,ctx.camera.aspect)-ctx.camera.position.z)*.12;
  ctx.pl.body.rotation.y+=.0035;
  ctx.pl.moons.forEach(function(m){const d=m.userData;d.a+=d.sp*1.6;m.position.set(Math.cos(d.a)*d.rad,Math.sin(d.inc)*d.rad*.25,Math.sin(d.a)*d.rad);});
  /* parpadeo */
  const ey=ctx.face.userData.eyes;
  if(ctx.face.userData.blinks){ctx.nextBlink-=.016;ey.scale.y=ctx.nextBlink<0&&ctx.nextBlink>-.12?.1:1;if(ctx.nextBlink<-.12)ctx.nextBlink=2.5+Math.random()*2.5;}
  /* habla */
  const mo=ctx.face.userData.mouth;mo.scale.y=ctx.talking?.55+Math.abs(Math.sin(ctx.t*13))*1.1:1;
  /* rebote al tocar */
  let s=1+Math.sin(ctx.t*2)*.012;
  if(ctx.bounce>0){ctx.bounce-=.04;s+=Math.sin((1-ctx.bounce)*Math.PI)*.1;}
  holder.scale.setScalar(s);faceHolder.scale.setScalar(s);
  ctx.renderer.render(ctx.scene,ctx.camera);
 })();
 return{update:build,talk:function(on){ctx.talking=!!on;},bounce:function(){ctx.bounce=1;}};}

/* ---------- miniatura para la colección ---------- */
function snapshotPlanet(cfg){
 const off=document.createElement("div");off.style.width="220px";off.style.height="220px";
 const b=sceneBase(off,"#0B1120",256,256);
 const grp=new THREE.Group();b.scene.add(grp);
 const pl=buildPlanet(cfg);grp.add(pl.g);pl.g.rotation.z=cfg.tilt||0;pl.body.rotation.y=.6;
 const R=cfg.size||1;grp.add(buildFace(cfg.face||"feliz",R,cfg.tilt||0));
 b.camera.position.set(0,.1,camDist(cfg,1.3));b.camera.lookAt(0,0,0);
 pl.moons.forEach(function(m,i){const d=m.userData;m.position.set(Math.cos(d.a)*d.rad,0,Math.sin(d.a)*d.rad);});
 b.renderer.render(b.scene,b.camera);
 const url=b.renderer.domElement.toDataURL("image/png");disposeAll(b);return url;}

/* ---------- mi sistema solar: el Sol y los planetas que el niño construyó ---------- */
function renderMySystem(containerId,list,onSelect){
 const el=document.getElementById(containerId);if(!el)return;
 disposePlanetChar();
 const b=sceneBase(el,"#070B16");
 b.camera.position.set(0,6.4,8.2);b.camera.lookAt(0,-.2,0);
 const sun=new THREE.Mesh(new THREE.SphereGeometry(.55,28,20),new THREE.MeshBasicMaterial({map:makeTex(PRESETS.sol)}));b.scene.add(sun);
 b.scene.add(new THREE.PointLight(0xffffff,2.4,30));
 const items=[],pick=[];
 list.forEach(function(p,i){
  const rad=1.2+(p.cfg.dist||2)*.5+(i%3)*.2;
  const ring=new THREE.Mesh(new THREE.RingGeometry(rad-.008,rad+.008,80),new THREE.MeshBasicMaterial({color:"#334155",side:THREE.DoubleSide,transparent:true,opacity:.55}));ring.rotation.x=Math.PI/2;b.scene.add(ring);
  const sz=Math.max(.3,Math.min(.5,.34*(p.cfg.size||1)));
  const cfg2=Object.assign({},p.cfg,{size:sz});
  const pl=buildPlanet(cfg2);pl.g.rotation.z=p.cfg.tilt||0;
  pl.body.userData.idx=i;pl.g.userData.idx=i;
  const grp=new THREE.Group();grp.add(pl.g);grp.add(buildFace(p.cfg.face||'feliz',sz,p.cfg.tilt||0));b.scene.add(grp);
  const hit=new THREE.Mesh(new THREE.SphereGeometry(Math.max(.5,sz*1.8),10,8),new THREE.MeshBasicMaterial({visible:false}));hit.userData.idx=i;pl.g.add(hit);pick.push(hit);
  items.push({grp:grp,pl:pl,rad:rad,a:i*1.9,sp:.006/(rad*.7)});});
 const rc=new THREE.Raycaster(),cv=b.renderer.domElement;cv.style.touchAction="none";
 cv.addEventListener("pointerdown",function(e){
  const r=cv.getBoundingClientRect();rc.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},b.camera);
  const h=rc.intersectObjects(pick,false)[0];if(h&&onSelect)onSelect(h.object.userData.idx);});
 const ctx=Object.assign(b,{raf:null});LIVE=ctx;
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);sun.rotation.y+=.003;
  items.forEach(function(it){it.a+=it.sp;it.grp.position.set(Math.cos(it.a)*it.rad,0,Math.sin(it.a)*it.rad);it.pl.body.rotation.y+=.01;
   it.pl.moons.forEach(function(m){const d=m.userData;d.a+=d.sp*2;m.position.set(Math.cos(d.a)*d.rad,0,Math.sin(d.a)*d.rad);});});
  ctx.renderer.render(ctx.scene,ctx.camera);})();}

window.PLANET_PRESETS=PRESETS;
window.renderPlanetChar=renderPlanetChar;
window.snapshotPlanet=snapshotPlanet;
window.renderMySystem=renderMySystem;
window.disposePlanetChar=disposePlanetChar;
