"use strict";
/* ============ MUNDOS 3D (constructor tipo Minecraft + carrera tipo Fall Guys) — motor visual ============
   Solo DIBUJA y recibe toques; las reglas (retos, trampas, bots, puntaje) viven en js/worldgame.js.
   Una cuadrícula N×N de columnas de bloques redondeados (altura 0..6, 0 = hueco → mar), con estilo
   (pradera, selva, desierto, hielo, dulces, espacio): cielo en degradé, nubes, sol, sombras suaves, mar con olas,
   islas lejanas y adornos. Objetos por casilla: ⭐ estrella · 🚪 puerta de reto · 🔙 trampa que hace retroceder ·
   ⚡ pinchos que suben y bajan · 🦘 trampolín · 🚩 salida · 🏁 meta. Varios "frijolitos" (el jugador y los bots).
   W = {N, h:[N*N], c:[N*N color], theme, items:{"r,c":{t,g}}, start:[r,c], fin:[r,c]}
   Una sola escena WebGL; disposeWorld3D() la libera (stopGames). */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const THEMES={
 grass:{nm:"Pradera",ic:"🌳",sky:["#4FA8F8","#DDF1FF"],sea:"#22B8F0",earth:"#9A5B1C",top:["#4ADE80","#86EFAC","#FACC15","#F472B6","#60A5FA","#FB923C"],decor:"flower"},
 jungle:{nm:"Selva",ic:"🌴",sky:["#2DB894","#D9F7E8"],sea:"#14B8A6",earth:"#6B3410",top:["#22C55E","#16A34A","#A3E635","#F59E0B","#C084FC","#F472B6"],decor:"fern"},
 sand:{nm:"Desierto",ic:"🏜️",sky:["#38BDF8","#FEF3C7"],sea:"#06B6D4",earth:"#B45309",top:["#FDE68A","#FCD34D","#FDBA74","#FCA5A5","#A7F3D0","#93C5FD"],decor:"cactus"},
 ice:{nm:"Hielo",ic:"❄️",sky:["#8EA2F5","#F0F9FF"],sea:"#38BDF8",earth:"#7DD3FC",top:["#F0F9FF","#BAE6FD","#C7D2FE","#FBCFE8","#A7F3D0","#FFFFFF"],decor:"crystal"},
 candy:{nm:"Dulces",ic:"🍭",sky:["#F9A8D4","#FEF9C3"],sea:"#818CF8",earth:"#EC4899",top:["#F9A8D4","#C4B5FD","#FDE047","#86EFAC","#93C5FD","#FDBA74"],decor:"lolly"},
 space:{nm:"Espacio",ic:"🪐",sky:["#0F0C29","#4338CA"],sea:"#6D28D9",earth:"#312E81",top:["#818CF8","#A78BFA","#22D3EE","#F472B6","#FACC15","#4ADE80"],decor:"crystal"}};
const PAL=THEMES.grass.top;
const HMAX=6;
let LIVE=null;
function disposeWorld3D(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);if(LIVE.ro)LIVE.ro.disconnect();}catch(e){}
 try{LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});if(LIVE.scene.background&&LIVE.scene.background.dispose)LIVE.scene.background.dispose();LIVE.renderer.dispose();const c=LIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);}catch(e){}
 LIVE=null;}
function canv(w,h,fn){const cv=document.createElement("canvas");cv.width=w;cv.height=h;fn(cv.getContext("2d"),w,h);const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}
function emojiTex(e){const t=canv(128,128,function(c){c.font='92px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText(e,64,70);});t.userData.own=true;return t;}
function esprite(e,s){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTex(e),transparent:true,depthWrite:false}));m.scale.set(s,s,1);return m;}
function tagSprite(txt,bg,fg){const t=canv(256,72,function(c,w,h){c.fillStyle=bg||"rgba(255,255,255,.92)";c.beginPath();if(c.roundRect)c.roundRect(4,6,w-8,h-12,26);else c.rect(4,6,w-8,h-12);c.fill();c.fillStyle=fg||"#1E293B";c.font='800 40px "Fredoka","Nunito",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText(txt,w/2,h/2+2);});
 const m=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));m.material.map.userData.own=true;m.scale.set(1.05,.3,1);return m;}
function hash(r,c,s){let x=(r*73856093)^(c*19349663)^((s||0)*83492791);x=(x^(x>>>13))*1274126177;return((x^(x>>>16))>>>0)%1000/1000;}

/* opts:{mode:"edit"|"play", gateStyle:function(g)→{col,emo}, paint:function()→bool}
   cb(ev,info): "tap"{r,c,face,k,h} · "stroke"{phase:start|move|end,r,c,face,k,h} */
function renderWorld3D(containerId,W0,opts,cb){
 const el=document.getElementById(containerId);if(!el)return null;
 disposeWorld3D();
 let W=W0;opts=opts||{};
 const play=opts.mode==="play";
 const w=el.clientWidth||340,h=el.clientHeight||340;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h,false);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.outputColorSpace=THREE.SRGBColorSpace;
 const cv=renderer.domElement;cv.style.width="100%";cv.style.height="100%";cv.style.display="block";cv.style.touchAction="none";
 el.innerHTML="";el.appendChild(cv);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(44,w/h,.1,140);
 const N=W.N,half=(N-1)/2;
 const px=function(c){return c-half;},pz=function(r){return r-half;};
 const TH=THEMES[W.theme]||THEMES.grass;
 /* ---- cielo, luz, niebla ---- */
 scene.background=canv(4,256,function(c,ww,hh){const g=c.createLinearGradient(0,0,0,hh);g.addColorStop(0,TH.sky[0]);g.addColorStop(1,TH.sky[1]);c.fillStyle=g;c.fillRect(0,0,ww,hh);});
 scene.fog=new THREE.Fog(TH.sky[1],N*1.6+10,N*3.4+34);
 scene.add(new THREE.HemisphereLight(new THREE.Color(TH.sky[0]).lerp(new THREE.Color("#ffffff"),.55),new THREE.Color(TH.earth).lerp(new THREE.Color("#ffffff"),.25),1.15));
 const sun=new THREE.DirectionalLight("#FFF4DB",2.1);sun.position.set(N*.7,N*1.2,N*.55);sun.castShadow=true;
 const sc=sun.shadow.camera;sc.left=-N*.8-3;sc.right=N*.8+3;sc.top=N*.8+3;sc.bottom=-N*.8-3;sc.near=1;sc.far=N*4+20;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0006;sun.shadow.normalBias=.03;
 scene.add(sun);scene.add(sun.target);
 /* ---- mar con olas ---- */
 const seaG=new THREE.PlaneGeometry(N*5+40,N*5+40,48,48);seaG.rotateX(-Math.PI/2);
 const seaBase=Float32Array.from(seaG.attributes.position.array);
 const sea=new THREE.Mesh(seaG,new THREE.MeshStandardMaterial({color:TH.sea,transparent:true,opacity:.9,roughness:.18,metalness:.1}));sea.position.y=-.62;sea.receiveShadow=true;sea.userData.sea=true;scene.add(sea);
 const foam=new THREE.Mesh(new THREE.RingGeometry(N*.5+.6,N*.5+1.6,48),new THREE.MeshBasicMaterial({color:"#ffffff",transparent:true,opacity:.0,side:THREE.DoubleSide}));foam.rotation.x=-Math.PI/2;foam.position.y=-.58;scene.add(foam);
 /* ---- nubes / estrellas ---- */
 const sky=new THREE.Group();scene.add(sky);const clouds=[];
 if(W.theme==="space"){const pts=[];for(let i=0;i<260;i++){const a=Math.random()*6.28,b=Math.random()*1.4+.1,R=N*2+30;pts.push(Math.cos(a)*Math.cos(b)*R,Math.sin(b)*R*.6+4,Math.sin(a)*Math.cos(b)*R);}
  const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));sky.add(new THREE.Points(pg,new THREE.PointsMaterial({color:"#ffffff",size:.55,fog:false,sizeAttenuation:true})));
  const pl=new THREE.Mesh(new THREE.SphereGeometry(5,24,18),new THREE.MeshBasicMaterial({color:"#F472B6",fog:false}));pl.position.set(-N*1.4-12,10,-N*1.8-14);sky.add(pl);}
 else{const cm=new THREE.MeshLambertMaterial({color:"#ffffff",transparent:true,opacity:.92,fog:false});
  for(let i=0;i<9;i++){const g=new THREE.Group(),n=3+Math.floor(Math.random()*3);for(let k=0;k<n;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(.9+Math.random()*.9,12,10),cm);s.position.set(k*1.1-n*.5,Math.random()*.4,Math.random()*.6);s.scale.y=.62;g.add(s);}
   const a=Math.random()*6.28,R=N*1.0+12+Math.random()*14;g.position.set(Math.cos(a)*R,8+Math.random()*6,Math.sin(a)*R);g.userData.sp=.25+Math.random()*.3;sky.add(g);clouds.push(g);}}
 const root=new THREE.Group();scene.add(root);
 const deco=new THREE.Group();scene.add(deco);
 /* ---- islas lejanas con árboles ---- */
 (function islands(){const col=new THREE.Color(TH.top[0]),earth=new THREE.Color(TH.earth);
  for(let i=0;i<10;i++){const a=i/10*6.28+hash(i,1,7)*.5,R=N*.95+5+hash(i,2,7)*7,s=1.4+hash(i,3,7)*1.8;const g=new THREE.Group();
   const base=new THREE.Mesh(new THREE.CylinderGeometry(s,s*.8,.9,12),new THREE.MeshStandardMaterial({color:earth,roughness:.9}));base.position.y=-.2;base.castShadow=true;g.add(base);
   const top=new THREE.Mesh(new THREE.CylinderGeometry(s,s,.14,12),new THREE.MeshStandardMaterial({color:col,roughness:.8}));top.position.y=.3;top.receiveShadow=true;g.add(top);
   const k=1+Math.floor(hash(i,4,7)*2);for(let j=0;j<k;j++){const t=treeFor(W.theme,hash(i,j,9));t.position.set((hash(i,j,11)-.5)*s*1.1,.35,(hash(i,j,12)-.5)*s*1.1);g.add(t);}
   g.position.set(Math.cos(a)*R,-.55,Math.sin(a)*R);g.userData.ph=hash(i,5,7)*6;deco.add(g);}})();
 function treeFor(theme,u){const g=new THREE.Group();
  if(theme==="ice"||theme==="space"){const m=new THREE.MeshStandardMaterial({color:theme==="ice"?"#BAE6FD":"#22D3EE",roughness:.15,metalness:.2,emissive:theme==="space"?"#0891B2":"#000000",emissiveIntensity:.5});for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.16+u*.1,.9+i*.35,5),m);c.position.set((i-1)*.22,.45+i*.1,(i%2)*.1);c.rotation.z=(i-1)*.18;c.castShadow=true;g.add(c);}return g;}
  if(theme==="sand"){const m=new THREE.MeshStandardMaterial({color:"#16A34A",roughness:.7});const b=new THREE.Mesh(new THREE.CapsuleGeometry(.14,.9,4,10),m);b.position.y=.6;b.castShadow=true;g.add(b);[-1,1].forEach(function(s){const a=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.35,4,8),m);a.position.set(s*.24,.65,0);a.castShadow=true;g.add(a);const a2=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.25,4,8),m);a2.position.set(s*.24,.9,0);g.add(a2);});return g;}
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(.08,.11,.7,7),new THREE.MeshStandardMaterial({color:"#78350F",roughness:.9}));tr.position.y=.35;tr.castShadow=true;g.add(tr);
  const lm=new THREE.MeshStandardMaterial({color:theme==="candy"?"#F472B6":theme==="jungle"?"#15803D":"#22C55E",roughness:.75});
  for(let i=0;i<3;i++){const c=new THREE.Mesh(theme==="candy"?new THREE.SphereGeometry(.4-i*.08,12,10):new THREE.ConeGeometry(.42-i*.09,.55,8),lm);c.position.y=.8+i*.34;c.castShadow=true;g.add(c);}
  return g;}
 /* ---- bloques redondeados (una geometría por altura) ---- */
 const geoCache={};
 function colGeo(hh){if(geoCache[hh])return geoCache[hh];
  const s=.98,r=.13,x0=-s/2,x1=s/2,sh=new THREE.Shape();
  sh.moveTo(x0+r,x0);sh.lineTo(x1-r,x0);sh.absarc(x1-r,x0+r,r,-Math.PI/2,0,false);sh.lineTo(x1,x1-r);sh.absarc(x1-r,x1-r,r,0,Math.PI/2,false);sh.lineTo(x0+r,x1);sh.absarc(x0+r,x1-r,r,Math.PI/2,Math.PI,false);sh.lineTo(x0,x0+r);sh.absarc(x0+r,x0+r,r,Math.PI,Math.PI*1.5,false);
  const bt=.045,g=new THREE.ExtrudeGeometry(sh,{depth:Math.max(.05,hh-bt*2),bevelEnabled:true,bevelThickness:bt,bevelSize:bt,bevelSegments:2,curveSegments:5});
  g.rotateX(-Math.PI/2);g.translate(0,bt,0);geoCache[hh]=g;return g;}
 const shared=new Set();
 const topMats=TH.top.map(function(c){return new THREE.MeshStandardMaterial({color:c,roughness:.62});});
 const sideMat=new THREE.MeshStandardMaterial({color:TH.earth,roughness:.9});
 const sideMats=TH.top.map(function(c){return new THREE.MeshStandardMaterial({color:new THREE.Color(TH.earth).lerp(new THREE.Color(c),.22),roughness:.88});});
 topMats.concat(sideMats,[sideMat]).forEach(function(m){shared.add(m);});
 /* ---- texturas de las trampas ---- */
 const texCache={};
 function padTex(kind){if(texCache[kind])return texCache[kind];
  const t=canv(128,128,function(c,ww,hh){
   if(kind==="trap"){c.fillStyle="#F97316";c.fillRect(0,0,ww,hh);c.fillStyle="#FED7AA";for(let i=-1;i<4;i++){c.save();c.translate(0,i*40+10);c.beginPath();c.moveTo(14,30);c.lineTo(64,70);c.lineTo(114,30);c.lineTo(114,48);c.lineTo(64,88);c.lineTo(14,48);c.closePath();c.fill();c.restore();}}
   else if(kind==="boost"){c.fillStyle="#22C55E";c.fillRect(0,0,ww,hh);c.fillStyle="#DCFCE7";for(let i=0;i<3;i++){c.save();c.translate(0,i*36-4);c.beginPath();c.moveTo(14,60);c.lineTo(64,22);c.lineTo(114,60);c.lineTo(114,78);c.lineTo(64,40);c.lineTo(14,78);c.closePath();c.fill();c.restore();}}
   else if(kind==="fin"){for(let y=0;y<8;y++)for(let x=0;x<8;x++){c.fillStyle=(x+y)%2?"#111827":"#FFFFFF";c.fillRect(x*16,y*16,16,16);}}
   else if(kind==="start"){c.fillStyle="#16A34A";c.fillRect(0,0,ww,hh);c.fillStyle="#BBF7D0";c.font="900 84px Fredoka,Nunito,sans-serif";c.textAlign="center";c.textBaseline="middle";c.fillText("GO",64,68);}});
  texCache[kind]=t;return t;}
 function pad(kind,col){const m=new THREE.Mesh(new THREE.CylinderGeometry(.42,.44,.09,28),[new THREE.MeshStandardMaterial({color:col,roughness:.5}),new THREE.MeshStandardMaterial({map:padTex(kind),roughness:.5,emissive:col,emissiveIntensity:.18}),new THREE.MeshStandardMaterial({color:col})]);m.castShadow=true;m.receiveShadow=true;return m;}
 const anim={items:[],gates:{}};
 const cells=[];
 function clearGroup(g){while(g.children.length){const c=g.children.pop();c.traverse&&c.traverse(function(o){if(o.geometry&&!isCached(o.geometry))o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(!shared.has(m)){if(m.map&&m.map.userData.own)m.map.dispose();m.dispose();}});}});}}
 function isCached(g){for(const k in geoCache)if(geoCache[k]===g)return true;return false;}
 function tag(obj,r,c){obj.traverse(function(o){o.userData.r=r;o.userData.c=c;});}
 function flowerFor(theme,u){const g=new THREE.Group();
  if(theme==="grass"){const col=["#F472B6","#FACC15","#FFFFFF","#FB7185"][Math.floor(u*4)];const st=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.22,5),new THREE.MeshStandardMaterial({color:"#16A34A"}));st.position.y=.11;g.add(st);for(let i=0;i<5;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(.06,8,6),new THREE.MeshStandardMaterial({color:col}));const a=i/5*6.28;p.position.set(Math.cos(a)*.07,.24,Math.sin(a)*.07);g.add(p);}const ct=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),new THREE.MeshStandardMaterial({color:"#FDE047"}));ct.position.y=.24;g.add(ct);}
  else if(theme==="jungle"){for(let i=0;i<4;i++){const l=new THREE.Mesh(new THREE.ConeGeometry(.05,.34,4),new THREE.MeshStandardMaterial({color:"#14532D"}));l.position.y=.17;l.rotation.z=(i-1.5)*.5;l.rotation.y=i*1.6;g.add(l);}const m=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6,0,6.28,0,1.6),new THREE.MeshStandardMaterial({color:"#EF4444"}));m.position.set(.18,.06,.1);g.add(m);}
  else if(theme==="sand"){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.1,0),new THREE.MeshStandardMaterial({color:"#A8A29E",roughness:1}));r.position.y=.07;r.scale.y=.7;g.add(r);}
  else if(theme==="candy"){const st=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.3,5),new THREE.MeshStandardMaterial({color:"#FFFFFF"}));st.position.y=.15;g.add(st);const lo=new THREE.Mesh(new THREE.SphereGeometry(.09,12,8),new THREE.MeshStandardMaterial({color:["#F43F5E","#A855F7","#22D3EE"][Math.floor(u*3)]}));lo.position.y=.33;g.add(lo);}
  else{const m=new THREE.MeshStandardMaterial({color:theme==="ice"?"#BAE6FD":"#67E8F9",roughness:.15,emissive:theme==="space"?"#22D3EE":"#000",emissiveIntensity:.5});const c=new THREE.Mesh(new THREE.ConeGeometry(.07,.28,5),m);c.position.y=.14;g.add(c);const c2=new THREE.Mesh(new THREE.ConeGeometry(.05,.18,5),m);c2.position.set(.1,.09,.04);c2.rotation.z=-.4;g.add(c2);}
  g.traverse(function(o){o.castShadow=true;});return g;}
 function buildCell(r,c){
  const i=r*N+c;let g=cells[i];if(!g){g=new THREE.Group();g.position.set(px(c),0,pz(r));root.add(g);cells[i]=g;}
  clearGroup(g);anim.items=anim.items.filter(function(a){return !(a.r===r&&a.c===c);});delete anim.gates[r+","+c];
  const hgt=W.h[i],ci=(W.c[i]||0)%TH.top.length;
  if(hgt>0){
   const m=new THREE.Mesh(colGeo(hgt),[topMats[ci],sideMats[ci]]);m.castShadow=true;m.receiveShadow=true;m.userData.col=true;g.add(m);
   const key=r+","+c,it=W.items[key],isS=W.start&&W.start[0]===r&&W.start[1]===c,isF=W.fin&&W.fin[0]===r&&W.fin[1]===c;
   if(it&&it.t==="star"){const s=new THREE.Mesh(new THREE.OctahedronGeometry(.23,0),new THREE.MeshStandardMaterial({color:"#FACC15",emissive:"#F59E0B",emissiveIntensity:.8,roughness:.25,metalness:.3}));s.scale.y=1.4;s.position.y=hgt+.6;s.castShadow=true;g.add(s);
    const gl=esprite("✨",.7);gl.position.y=hgt+.6;g.add(gl);anim.items.push({m:s,r:r,c:c,k:"star",y0:hgt+.6,ph:Math.random()*6});}
   else if(it&&it.t==="gate"){
    const st=(opts.gateStyle&&opts.gateStyle(it.g))||{col:"#EF4444",emo:"❓"},gc=st.col,gg=new THREE.Group();gg.position.y=hgt;
    const pm=new THREE.MeshStandardMaterial({color:gc,roughness:.35,metalness:.15,emissive:gc,emissiveIntensity:.15});
    [-.4,.4].forEach(function(x){const p=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,1.2,10),pm);p.position.set(x,.6,0);p.castShadow=true;gg.add(p);const cap=new THREE.Mesh(new THREE.SphereGeometry(.1,10,8),pm);cap.position.set(x,1.22,0);gg.add(cap);});
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.9,10),pm);beam.rotation.z=Math.PI/2;beam.position.y=1.2;beam.castShadow=true;gg.add(beam);
    const field=new THREE.Mesh(new THREE.PlaneGeometry(.72,1.1),new THREE.MeshBasicMaterial({color:gc,transparent:true,opacity:.34,side:THREE.DoubleSide,depthWrite:false}));field.position.y=.62;gg.add(field);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.5,.035,8,28),new THREE.MeshBasicMaterial({color:gc,transparent:true,opacity:.55}));ring.rotation.x=Math.PI/2;ring.position.y=.05;gg.add(ring);
    const sp=esprite(st.emo||"❓",.55);sp.position.y=1.72;gg.add(sp);
    g.add(gg);anim.items.push({m:sp,r:r,c:c,k:"gate",y0:1.72,ph:Math.random()*6,field:field,ring:ring});anim.gates[key]=gg;}
   else if(it&&it.t==="trap"){const p=pad("trap","#F97316");p.position.y=hgt+.045;g.add(p);anim.items.push({m:p,r:r,c:c,k:"pulse",ph:Math.random()*6});const sp=esprite("🔙",.42);sp.position.y=hgt+.55;g.add(sp);anim.items.push({m:sp,r:r,c:c,k:"gate",y0:hgt+.55,ph:Math.random()*6});}
   else if(it&&it.t==="boost"){const p=pad("boost","#22C55E");p.position.y=hgt+.045;p.rotation.y=[-Math.PI/2,Math.PI,Math.PI/2,0][it.d||0];g.add(p);anim.items.push({m:p,r:r,c:c,k:"pulse",ph:Math.random()*6});const sp=esprite("🦘",.42);sp.position.y=hgt+.55;g.add(sp);anim.items.push({m:sp,r:r,c:c,k:"gate",y0:hgt+.55,ph:Math.random()*6});}
   else if(it&&it.t==="spike"){const base=new THREE.Mesh(new THREE.CylinderGeometry(.44,.46,.08,16),new THREE.MeshStandardMaterial({color:"#334155",roughness:.5}));base.position.y=hgt+.04;base.castShadow=true;g.add(base);
    const sg=new THREE.Group();sg.position.y=hgt+.07;const sm=new THREE.MeshStandardMaterial({color:"#EF4444",roughness:.3,metalness:.3,emissive:"#B91C1C",emissiveIntensity:.35});
    [[0,0],[.2,.16],[-.2,.16],[.2,-.16],[-.2,-.16]].forEach(function(o){const sp=new THREE.Mesh(new THREE.ConeGeometry(.085,.5,8),sm);sp.position.set(o[0],.25,o[1]);sp.castShadow=true;sg.add(sp);});
    g.add(sg);anim.items.push({m:sg,r:r,c:c,k:"spike"});}
   if(isS){const d=pad("start","#22C55E");d.position.y=hgt+.045;g.add(d);
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1,6),new THREE.MeshStandardMaterial({color:"#F8FAFC"}));pole.position.set(-.34,hgt+.5,-.34);g.add(pole);
    const fl=new THREE.Mesh(new THREE.PlaneGeometry(.5,.32),new THREE.MeshStandardMaterial({color:"#22C55E",side:THREE.DoubleSide}));fl.position.set(-.1,hgt+.85,-.34);g.add(fl);anim.items.push({m:fl,r:r,c:c,k:"flag"});}
   if(isF){const d=pad("fin","#FACC15");d.position.y=hgt+.045;g.add(d);
    const pm=new THREE.MeshStandardMaterial({color:"#F8FAFC",roughness:.4});[-.42,.42].forEach(function(x){const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1.5,8),pm);p.position.set(x,hgt+.75,0);p.castShadow=true;g.add(p);});
    const ban=new THREE.Mesh(new THREE.BoxGeometry(.95,.3,.05),new THREE.MeshStandardMaterial({map:padTex("fin"),roughness:.6}));ban.position.y=hgt+1.5;ban.castShadow=true;g.add(ban);
    const t=esprite("🏆",.55);t.position.y=hgt+2.0;g.add(t);anim.items.push({m:t,r:r,c:c,k:"gate",y0:hgt+2.0,ph:1});}
   if(!it&&!isS&&!isF&&hash(r,c,W.seed||3)<.17){const f=flowerFor(W.theme,hash(c,r,5));f.position.set((hash(r,c,2)-.5)*.5,hgt,(hash(c,r,8)-.5)*.5);f.rotation.y=hash(r,c,6)*6;g.add(f);}
  }
  tag(g,r,c);}
 function buildAll(){for(let r=0;r<N;r++)for(let c=0;c<N;c++)buildCell(r,c);}
 buildAll();
 function topY(r,c){const hh=W.h[r*N+c];return hh>0?hh:-.6;}
 /* ---- frijolitos ---- */
 const beans=[];
 function mat(col,rough){return new THREE.MeshStandardMaterial({color:col,roughness:rough==null?.38:rough,metalness:.02});}
 function addBean(o){
  o=o||{};const g=new THREE.Group(),body=new THREE.Group(),wrap=new THREE.Group();wrap.scale.setScalar(1.18);g.add(wrap);wrap.add(body);
  const m=mat(o.color||"#F472B6"),dark=mat(new THREE.Color(o.color||"#F472B6").multiplyScalar(.78));
  const tor=new THREE.Mesh(new THREE.CapsuleGeometry(.23,.32,10,20),m);tor.position.y=.44;tor.castShadow=true;body.add(tor);
  const hl=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),new THREE.MeshBasicMaterial({color:"#ffffff",transparent:true,opacity:.35}));hl.position.set(-.1,.72,.15);hl.scale.set(1.3,.7,.6);body.add(hl);
  [-1,1].forEach(function(s){
   const e=new THREE.Mesh(new THREE.SphereGeometry(.075,14,10),mat("#FFFFFF",.2));e.position.set(s*.095,.56,.185);e.scale.set(1,1.15,.8);body.add(e);
   const pu=new THREE.Mesh(new THREE.SphereGeometry(.036,10,8),mat("#0F172A",.2));pu.position.set(s*.095,.555,.25);body.add(pu);
   const sh=new THREE.Mesh(new THREE.SphereGeometry(.012,6,5),new THREE.MeshBasicMaterial({color:"#fff"}));sh.position.set(s*.095+.012,.575,.275);body.add(sh);});
  const sm=new THREE.Mesh(new THREE.TorusGeometry(.055,.013,6,14,Math.PI),mat("#7F1D1D",.5));sm.position.set(0,.44,.222);sm.rotation.z=Math.PI;body.add(sm);
  const arms=[],legs=[];
  [-1,1].forEach(function(s){const a=new THREE.Mesh(new THREE.CapsuleGeometry(.055,.12,6,10),dark);a.position.set(s*.27,.4,.02);a.rotation.z=s*.5;a.castShadow=true;const ap=new THREE.Group();ap.position.set(s*.25,.52,.02);a.position.set(s*.03,-.1,0);ap.add(a);body.add(ap);arms.push(ap);
   const l=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.08,6,10),dark);l.castShadow=true;const lp=new THREE.Group();lp.position.set(s*.11,.2,0);l.position.set(0,-.1,.02);lp.add(l);body.add(lp);legs.push(lp);});
  if(o.hat==="cap"){const c=new THREE.Mesh(new THREE.SphereGeometry(.2,14,10,0,6.28,0,1.5),mat("#2563EB",.5));c.position.set(0,.8,0);body.add(c);const v=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.025,14,1,false,-1.2,2.4),mat("#1D4ED8",.5));v.position.set(0,.8,.17);v.rotation.x=.1;body.add(v);}
  else if(o.hat==="party"){const c=new THREE.Mesh(new THREE.ConeGeometry(.13,.3,12),mat("#FBBF24",.4));c.position.set(0,.98,0);body.add(c);const p=new THREE.Mesh(new THREE.SphereGeometry(.04,8,6),mat("#EF4444"));p.position.set(0,1.14,0);body.add(p);}
  else if(o.hat==="crown"){const cr=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,.1,10,1,true),new THREE.MeshStandardMaterial({color:"#FACC15",metalness:.6,roughness:.25,side:THREE.DoubleSide}));cr.position.set(0,.93,0);body.add(cr);for(let i=0;i<5;i++){const a=i/5*6.28;const sp=new THREE.Mesh(new THREE.ConeGeometry(.03,.09,6),new THREE.MeshStandardMaterial({color:"#FACC15",metalness:.6,roughness:.25}));sp.position.set(Math.cos(a)*.13,1,Math.sin(a)*.13);body.add(sp);}}
  else if(o.hat==="beanie"){const c=new THREE.Mesh(new THREE.SphereGeometry(.21,14,10,0,6.28,0,1.35),mat("#EF4444",.8));c.position.set(0,.77,0);body.add(c);const p=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),mat("#FFFFFF",.9));p.position.set(0,.99,0);body.add(p);}
  if(o.name){const tg=tagSprite(o.name,o.me?"#FACC15":"rgba(255,255,255,.92)");tg.position.y=1.62;g.add(tg);}
  const bub=esprite("💭",.45);bub.position.set(.35,1.4,0);bub.visible=false;g.add(bub);
  g.visible=true;scene.add(g);
  const B={g:g,body:body,r:0,c:0,face:0,anim:null,walk:0,arms:arms,legs:legs,me:!!o.me,cp:[0,0],bub:bub,hist:[],ph:Math.random()*6,done:false,
   place:function(r,c){B.r=r;B.c=c;g.position.set(px(c),topY(r,c),pz(r));g.scale.setScalar(1);g.rotation.z=0;body.position.y=0;},
   setFace:function(dr,dc){if(dr||dc)B.face=Math.atan2(dc,dr);},
   busy:function(){return !!B.anim;},
   hop:function(r,c,after,d){B.setFace(r-B.r,c-B.c);B.anim={k:"hop",fr:B.r,fc:B.c,r:r,c:c,t:0,d:d||.26,after:after};},
   slide:function(r,c,after){B.anim={k:"slide",fr:B.r,fc:B.c,r:r,c:c,t:0,d:.5,after:after};},
   bump:function(dr,dc,after){B.setFace(dr,dc);B.anim={k:"bump",dr:dr,dc:dc,t:0,d:.3,after:after};},
   fall:function(hr,hc,rr,rc,after){B.setFace(hr-B.r,hc-B.c);B.anim={k:"fall",fr:B.r,fc:B.c,r:hr,c:hc,rr:rr,rc:rc,t:0,after:after};},
   cheer:function(){B.anim={k:"cheer",t:0,d:1.8};},
   think:function(on){bub.visible=!!on;},
   say:function(e){if(B._sp){g.remove(B._sp);B._sp=null;}if(e){const s=esprite(e,.5);s.position.set(0,1.95,0);g.add(s);B._sp=s;}}};
  beans.push(B);return B;}
 function clearBeans(){beans.forEach(function(b){scene.remove(b.g);});beans.length=0;}
 /* ---- partículas ---- */
 const parts=[];
 function burst(r,c,col,n){const y=topY(r,c)+.6;for(let i=0;i<(n||14);i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.05+Math.random()*.03,6,5),new THREE.MeshBasicMaterial({color:col||"#FACC15"}));m.position.set(px(c),y,pz(r));scene.add(m);const a=Math.random()*6.28,s=1.2+Math.random()*1.8;parts.push({m:m,vx:Math.cos(a)*s,vy:2+Math.random()*2.4,vz:Math.sin(a)*s,t:0});}}
 /* ---- cámara ---- */
 const cam={th:play?0:.6,ph:play?1.0:1.0,R:play?N*.66+5.2:N*.95+4.5,tx:0,tz:0,follow:null,touched:false,min:4,max:N*2.6+8};
 const flashes=[];
 function flash(r,c,col){const m=new THREE.Mesh(new THREE.RingGeometry(.28,.5,24),new THREE.MeshBasicMaterial({color:col||"#ffffff",transparent:true,opacity:.95,side:THREE.DoubleSide,depthTest:false}));m.rotation.x=-Math.PI/2;m.position.set(px(c),Math.max(0,W.h[r*N+c])+.12,pz(r));m.renderOrder=9;scene.add(m);flashes.push({m:m,t:0});}
 function place(){
  let tx=cam.tx,tz=cam.tz,ty=.8;
  if(cam.follow){const p=cam.follow.g.position;cam.tx+=(p.x-cam.tx)*.14;cam.tz+=(p.z-cam.tz)*.14;tx=cam.tx;tz=cam.tz;ty=Math.max(0,p.y)+.4;}
  camera.position.set(tx+cam.R*Math.sin(cam.ph)*Math.sin(cam.th),ty+cam.R*Math.cos(cam.ph),tz+cam.R*Math.sin(cam.ph)*Math.cos(cam.th));camera.lookAt(tx,ty,tz);
  sun.target.position.set(0,0,0);}
 const ctx={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,ro:null};
 if(window.ResizeObserver){ctx.ro=new ResizeObserver(function(){const nw=el.clientWidth,nh=el.clientHeight;if(nw>0&&nh>0){renderer.setSize(nw,nh,false);camera.aspect=nw/nh;camera.updateProjectionMatrix();}});ctx.ro.observe(el);}
 /* ---- toques: tocar, arrastrar (pintar), girar, pellizcar ---- */
 const rc=new THREE.Raycaster();const ptrs=new Map();let stroke=null,drag=null,gest=null,lastKey=null;
 function pick(e){
  const r=cv.getBoundingClientRect();rc.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},camera);
  const hits=rc.intersectObjects([root,sea],true);
  for(let i=0;i<hits.length;i++){const o=hits[i].object;
   if(o.userData.r!==undefined&&!o.isSprite){
    const rr=o.userData.r,cc=o.userData.c,hh=W.h[rr*N+cc],n=hits[i].face&&hits[i].face.normal;let face="top",k=Math.max(0,hh-1);
    if(o.userData.col&&n&&Math.abs(n.y)<.6){face=Math.abs(n.x)>Math.abs(n.z)?(n.x>0?"e":"w"):(n.z>0?"s":"n");k=Math.max(0,Math.min(hh-1,Math.floor(hits[i].point.y-.001)));}
    return{r:rr,c:cc,face:face,k:k,h:hh};}
   if(o.userData.sea){const c=Math.round(hits[i].point.x+half),rr=Math.round(hits[i].point.z+half);if(c>=0&&c<N&&rr>=0&&rr<N)return{r:rr,c:c,face:"top",k:-1,h:W.h[rr*N+c]};return null;}}
  return null;}
 function dist2(){const a=[...ptrs.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);}
 cv.addEventListener("pointerdown",function(e){
  try{cv.setPointerCapture(e.pointerId);}catch(x){}
  ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size>=2){if(stroke){if(cb)cb("stroke",{phase:"end"});stroke=null;}drag=null;const a=[...ptrs.values()];gest={d:dist2(),mx:(a[0].x+a[1].x)/2,my:(a[0].y+a[1].y)/2};return;}
  const hit=pick(e);drag={x:e.clientX,y:e.clientY,moved:false,hit:hit};
  if(!play&&hit&&opts.paint&&opts.paint()){stroke=hit;lastKey=hit.r+","+hit.c;if(cb)cb("stroke",Object.assign({phase:"start"},hit));drag.stroke=true;}});
 cv.addEventListener("pointermove",function(e){
  if(!ptrs.has(e.pointerId))return;const p=ptrs.get(e.pointerId);const ddx=e.clientX-p.x,ddy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(gest&&ptrs.size>=2){const a=[...ptrs.values()],d=dist2(),mx=(a[0].x+a[1].x)/2,my=(a[0].y+a[1].y)/2;
   if(gest.d>10)cam.R=Math.max(cam.min,Math.min(cam.max,cam.R*gest.d/d));
   if(!play){const k=cam.R*.0022,dx=mx-gest.mx,dy=my-gest.my;cam.tx+=(-Math.cos(cam.th)*dx-Math.sin(cam.th)*dy)*k;cam.tz+=(Math.sin(cam.th)*dx-Math.cos(cam.th)*dy)*k;}
   gest.d=d;gest.mx=mx;gest.my=my;cam.touched=true;return;}
  if(!drag)return;
  if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>8)drag.moved=true;
  if(drag.stroke){
   const px0=drag.lx==null?drag.x:drag.lx,py0=drag.ly==null?drag.y:drag.ly,dd=Math.hypot(e.clientX-px0,e.clientY-py0),n=Math.max(1,Math.ceil(dd/9));
   for(let k=1;k<=n;k++){const hit=pick({clientX:px0+(e.clientX-px0)*k/n,clientY:py0+(e.clientY-py0)*k/n});
    if(hit){const key=hit.r+","+hit.c;if(key!==lastKey){lastKey=key;if(cb)cb("stroke",Object.assign({phase:"move"},hit));}}}
   drag.lx=e.clientX;drag.ly=e.clientY;return;}
  if(drag.moved){cam.th-=ddx*.009;cam.ph=Math.max(.25,Math.min(1.4,cam.ph-ddy*.006));cam.touched=true;}});
 function up(e){
  if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);
  if(ptrs.size<2)gest=null;
  if(stroke){if(cb)cb("stroke",{phase:"end"});stroke=null;drag=null;return;}
  if(drag&&!drag.moved&&ptrs.size===0){const hit=drag.hit||pick(e);if(hit&&cb)cb("tap",hit);}
  if(ptrs.size===0)drag=null;}
 cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
 cv.addEventListener("wheel",function(e){e.preventDefault();cam.R=Math.max(cam.min,Math.min(cam.max,cam.R*(1+Math.sign(e.deltaY)*.08)));cam.touched=true;},{passive:false});
 /* ---- ciclo ---- */
 const SPK=2.6;
 function spikeUp(r,c){const ph=(ctx.t+((r*3+c*5)%7)*.37)%SPK;return ph<1.05;}
 function spikeSoon(r,c){const ph=(ctx.t+((r*3+c*5)%7)*.37)%SPK;return ph>=SPK-.5;}
 const ticks=[];
 LIVE=ctx;
 let last=performance.now();
 const wp=seaG.attributes.position;
 function update(dt){
  ctx.t+=dt;const t=ctx.t;
  /* mar */
  for(let i=0;i<wp.count;i++){const x=seaBase[i*3],z=seaBase[i*3+2];wp.array[i*3+1]=Math.sin(x*.5+t*1.2)*.07+Math.cos(z*.6+t*.9)*.06;}wp.needsUpdate=true;
  foam.material.opacity=.12+Math.sin(t*1.5)*.06;foam.scale.setScalar(1+Math.sin(t*.8)*.02);
  clouds.forEach(function(cl){cl.position.x+=dt*cl.userData.sp;if(cl.position.x>N*2+30)cl.position.x=-N*2-30;});
  deco.children.forEach(function(g){g.position.y=-.55+Math.sin(t*.8+g.userData.ph)*.06;});
  /* objetos */
  anim.items.forEach(function(a){
   if(a.k==="star"){a.m.rotation.y+=dt*2.4;a.m.position.y=a.y0+Math.sin(t*2+a.ph)*.09;}
   else if(a.k==="gate"){a.m.position.y=a.y0+Math.sin(t*2+a.ph)*.07;if(a.field)a.field.material.opacity=.28+Math.sin(t*3+a.ph)*.1;if(a.ring){a.ring.scale.setScalar(1+Math.sin(t*3+a.ph)*.08);}}
   else if(a.k==="pulse"){const s=1+Math.sin(t*4+a.ph)*.05;a.m.scale.set(s,1,s);}
   else if(a.k==="spike"){const up=spikeUp(a.r,a.c),soon=spikeSoon(a.r,a.c);const target=up?1:soon?.35:.05;a.cur=a.cur==null?target:a.cur+(target-a.cur)*Math.min(1,dt*14);a.m.scale.y=Math.max(.05,a.cur);a.m.position.y=W.h[a.r*N+a.c]+.07;}
   else if(a.k==="flag"){a.m.rotation.y=Math.sin(t*3)*.35;}});
  /* frijolitos */
  beans.forEach(function(B){
   const g=B.g;let moving=0;
   if(B.anim){const a=B.anim;a.t+=dt;
    if(a.k==="hop"){const k=Math.min(1,a.t/a.d),y0=topY(a.fr,a.fc),y1=topY(a.r,a.c);moving=1;
     g.position.set(px(a.fc)+(px(a.c)-px(a.fc))*k,y0+(y1-y0)*k+Math.sin(k*Math.PI)*.4,pz(a.fr)+(pz(a.r)-pz(a.fr))*k);
     B.body.scale.set(1-Math.sin(k*Math.PI)*.07,1+Math.sin(k*Math.PI)*.13,1-Math.sin(k*Math.PI)*.07);
     if(k>=1){B.r=a.r;B.c=a.c;g.position.set(px(a.c),y1,pz(a.r));B.body.scale.set(1,1,1);B.anim=null;if(a.after)a.after();}}
    else if(a.k==="slide"){const k=Math.min(1,a.t/a.d),e=1-Math.pow(1-k,2),y0=topY(a.fr,a.fc),y1=topY(a.r,a.c);moving=1;
     g.position.set(px(a.fc)+(px(a.c)-px(a.fc))*e,y0+(y1-y0)*e+Math.sin(k*Math.PI)*.18,pz(a.fr)+(pz(a.r)-pz(a.fr))*e);g.rotation.z=Math.sin(k*Math.PI*2)*.4;
     if(k>=1){B.r=a.r;B.c=a.c;g.position.set(px(a.c),y1,pz(a.r));g.rotation.z=0;B.anim=null;if(a.after)a.after();}}
    else if(a.k==="bump"){const k=Math.min(1,a.t/a.d),off=Math.sin(k*Math.PI)*.26;g.position.set(px(B.c)+a.dc*off,topY(B.r,B.c),pz(B.r)+a.dr*off);B.body.scale.set(1+Math.sin(k*Math.PI)*.1,1-Math.sin(k*Math.PI)*.1,1);
     if(k>=1){g.position.set(px(B.c),topY(B.r,B.c),pz(B.r));B.body.scale.set(1,1,1);B.anim=null;if(a.after)a.after();}}
    else if(a.k==="fall"){const d1=.26;
     if(a.t<d1){const k=a.t/d1;g.position.set(px(a.fc)+(px(a.c)-px(a.fc))*k,topY(a.fr,a.fc)+Math.sin(k*Math.PI)*.3,pz(a.fr)+(pz(a.r)-pz(a.fr))*k);moving=1;}
     else{const k=Math.min(1,(a.t-d1)/.75);g.position.set(px(a.c),topY(a.fr,a.fc)-k*2.4,pz(a.r));g.rotation.z=k*3.2;g.scale.setScalar(Math.max(.2,1-k*.6));
      if(k>=1){B.r=a.rr;B.c=a.rc;g.rotation.z=0;g.position.set(px(a.rc),topY(a.rr,a.rc),pz(a.rr));g.scale.setScalar(.01);a.k="pop";a.t=0;burst(a.r,a.c,"#BAE6FD",10);}}}
    else if(a.k==="pop"){const k=Math.min(1,a.t/.4);g.scale.setScalar(.01+k*.99*(1+Math.sin(k*Math.PI)*.2));if(k>=1){g.scale.setScalar(1);B.anim=null;if(a.after)a.after();}}
    else if(a.k==="cheer"){const k=a.t/a.d;g.position.y=topY(B.r,B.c)+Math.abs(Math.sin(a.t*9))*.35;g.rotation.y+=dt*8;B.face=g.rotation.y;moving=0;B.arms.forEach(function(ar,i){ar.rotation.z=(i?1:-1)*(2.3+Math.sin(a.t*14)*.4);});
     if(k>=1){g.position.y=topY(B.r,B.c);B.anim=null;B.arms.forEach(function(ar){ar.rotation.z=0;});}}}
   B.walk+=((moving?1:0)-B.walk)*Math.min(1,dt*10);
   const sw=Math.sin(t*16+B.ph)*B.walk*.9;B.legs[0].rotation.x=sw;B.legs[1].rotation.x=-sw;
   if(!(B.anim&&B.anim.k==="cheer")){B.arms[0].rotation.x=-sw*.8;B.arms[1].rotation.x=sw*.8;}
   if(!B.anim)B.body.position.y=Math.sin(t*2.4+B.ph)*.012;
   if(!(B.anim&&B.anim.k==="cheer")){let d=B.face-g.rotation.y;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;g.rotation.y+=d*Math.min(1,dt*14);}});
  /* partículas y destellos */
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.t+=dt;p.vy-=7*dt;p.m.position.x+=p.vx*dt;p.m.position.y+=p.vy*dt;p.m.position.z+=p.vz*dt;p.m.scale.setScalar(Math.max(.01,1-p.t/.9));if(p.t>.9){scene.remove(p.m);p.m.geometry.dispose();p.m.material.dispose();parts.splice(i,1);}}
  for(let i=flashes.length-1;i>=0;i--){const f=flashes[i];f.t+=dt;const k=f.t/.5;f.m.scale.setScalar(1+k*1.2);f.m.material.opacity=Math.max(0,.95-k);if(k>=1){scene.remove(f.m);f.m.geometry.dispose();f.m.material.dispose();flashes.splice(i,1);}}
  if(opts.spin&&!play&&!cam.touched)cam.th+=.0016;
  ticks.slice().forEach(function(fn){fn(dt);});
  place();}
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);
  const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;update(dt);renderer.render(scene,camera);})();
 function dirFromScreen(k){
  const fx=-Math.sin(cam.th),fz=-Math.cos(cam.th);let vx,vz;
  if(k==="up"){vx=fx;vz=fz;}else if(k==="down"){vx=-fx;vz=-fz;}else if(k==="right"){vx=-fz;vz=fx;}else{vx=fz;vz=-fx;}
  return Math.abs(vz)>=Math.abs(vx)?[Math.sign(vz),0]:[0,Math.sign(vx)];}
 return{
  /* avanza la simulación a mano (pruebas: el navegador pausa requestAnimationFrame si la ventana no se ve) */
  step:function(sec){for(let t=0;t<sec;t+=1/60)update(1/60);},
  refresh:function(Wn){W=Wn;clearGroup(root);cells.length=0;anim.items=[];anim.gates={};buildAll();},
  setCell:buildCell,flash:flash,burst:burst,
  removeItem:function(r,c){delete W.items[r+","+c];buildCell(r,c);},
  openGate:function(r,c,after){const key=r+","+c,gg=anim.gates[key];
   const done=function(){delete W.items[key];buildCell(r,c);burst(r,c,"#86EFAC",12);if(after)after();};
   if(gg){let k=0;const iv=setInterval(function(){k+=.1;gg.scale.y=Math.max(.01,1-k);if(k>=1){clearInterval(iv);done();}},28);}else done();},
  onTick:function(fn){ticks.push(fn);},
  addBean:addBean,clearBeans:clearBeans,beans:beans,
  spikeUp:spikeUp,dir:dirFromScreen,time:function(){return ctx.t;},
  follow:function(B){cam.follow=B;if(B){cam.tx=B.g.position.x;cam.tz=B.g.position.z;}},
  view:function(kind){cam.touched=true;if(kind==="top"){cam.ph=.28;cam.th=0;cam.R=N*1.5+5;cam.follow=null;cam.tx=0;cam.tz=0;}else if(kind==="reset"){cam.ph=1;cam.th=.6;cam.R=N*.95+4.5;cam.tx=0;cam.tz=0;cam.touched=false;}else{cam.ph=1.0;cam.th=0;cam.R=N*.66+5.2;}},
  cam:cam};}

window.renderWorld3D=renderWorld3D;
window.disposeWorld3D=disposeWorld3D;
window.WORLD_THEMES=THEMES;window.WORLD_PAL=PAL;window.WORLD_HMAX=HMAX;
