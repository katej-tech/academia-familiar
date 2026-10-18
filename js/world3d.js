"use strict";
/* ============ MUNDO DE RETOS EN 3D (editor tipo Minecraft + pista tipo Fall Guys) ============
   Una cuadrícula de columnas de bloques de colores. En el EDITOR se toca una casilla para subir/bajar
   bloques o poner objetos (estrella ⭐, puerta de reto 🚪); la cámara se gira arrastrando. En el
   modo JUEGO un "frijolito" camina casilla por casilla: sube 1 escalón por paso, si pisa un hueco se cae
   al mar y vuelve al último punto seguro (sin castigo, con risa), y al llegar a una puerta se detiene
   hasta que el niño resuelve el reto. Una sola escena WebGL; dispose desde stopGames().
   W = {N, h:[N*N alturas 0..3 (0 = hueco)], c:[N*N color], items:{"r,c":{t:"star"|"gate",g:{kind,lv,quiz}}}, start:[r,c], fin:[r,c]} */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const PAL=["#F472B6","#60A5FA","#FBBF24","#34D399","#A78BFA","#FB923C"];
const KIND_COL={sum:"#EF4444",res:"#3B82F6",tab:"#F59E0B",pat:"#8B5CF6",cmp:"#10B981",log:"#EC4899",quiz:"#6366F1"};
const KIND_EMO={sum:"➕",res:"➖",tab:"✖️",pat:"🔢",cmp:"⚖️",log:"🔷",quiz:"📝"};
let LIVE=null;
function disposeWorld3D(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);if(LIVE.ro)LIVE.ro.disconnect();}catch(e){}
 try{LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});LIVE.renderer.dispose();const c=LIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);}catch(e){}
 LIVE=null;}
function emojiTex(e){const cv=document.createElement("canvas");cv.width=cv.height=128;const c=cv.getContext("2d");c.font='92px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText(e,64,70);const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}
function esprite(e,s){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTex(e),transparent:true,depthWrite:false}));m.scale.set(s,s,1);return m;}

/* opts:{mode:"edit"|"play",bean:"#hex"}  cb(ev,info): tap {r,c} · fall · blocked · gate {r,c,item} · star · finish · moved */
function renderWorld3D(containerId,W0,opts,cb){
 const el=document.getElementById(containerId);if(!el)return null;
 disposeWorld3D();
 let W=W0;opts=opts||{};
 const play=opts.mode==="play";
 const w=el.clientWidth||340,h=el.clientHeight||340;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h,false);
 const cv=renderer.domElement;cv.style.width="100%";cv.style.height="100%";cv.style.display="block";cv.style.touchAction="none";
 el.innerHTML="";el.appendChild(cv);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#BDE8FF");scene.fog=new THREE.Fog("#BDE8FF",20,50);
 const camera=new THREE.PerspectiveCamera(42,w/h,.1,100);
 scene.add(new THREE.AmbientLight(0xffffff,1.4));
 const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(5,10,6);scene.add(dl);
 /* mar */
 const sea=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshStandardMaterial({color:"#38BDF8",transparent:true,opacity:.85,roughness:.3}));sea.rotation.x=-Math.PI/2;sea.position.y=-.6;sea.userData.sea=true;scene.add(sea);
 const root=new THREE.Group();scene.add(root);
 const N=W.N,half=(N-1)/2,cells=[];
 const px=function(c){return c-half;},pz=function(r){return r-half;};
 const sea2=new THREE.Mesh(new THREE.PlaneGeometry(N+.4,N+.4),new THREE.MeshBasicMaterial({color:"#0EA5E9",transparent:true,opacity:.18}));sea2.rotation.x=-Math.PI/2;sea2.position.y=-.55;scene.add(sea2);
 const anim={items:[],gates:{}};
 function clearGroup(g){while(g.children.length){const c=g.children.pop();c.traverse&&c.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});}}
 function tag(obj,r,c){obj.traverse(function(o){o.userData.r=r;o.userData.c=c;});}
 function buildCell(r,c){
  const i=r*N+c;let g=cells[i];if(!g){g=new THREE.Group();g.position.set(px(c),0,pz(r));root.add(g);cells[i]=g;}
  clearGroup(g);anim.items=anim.items.filter(function(a){return !(a.r===r&&a.c===c);});delete anim.gates[r+","+c];
  const hgt=W.h[i],col=PAL[(W.c[i]||0)%PAL.length];
  for(let k=0;k<hgt;k++){
   const m=new THREE.Mesh(new THREE.BoxGeometry(.96,.96,.96),new THREE.MeshStandardMaterial({color:k===hgt-1?col:new THREE.Color(col).multiplyScalar(.82),roughness:.55}));
   m.position.y=k+.5-.0;g.add(m);
   const ed=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:"#1E293B",transparent:true,opacity:.35}));ed.position.copy(m.position);g.add(ed);}
  if(hgt>0){
   const key=r+","+c,it=W.items[key];
   if(it&&it.t==="star"){const s=new THREE.Mesh(new THREE.OctahedronGeometry(.22,0),new THREE.MeshStandardMaterial({color:"#FACC15",emissive:"#FACC15",emissiveIntensity:.7,roughness:.3}));s.scale.y=1.4;s.position.y=hgt+.55;g.add(s);anim.items.push({m:s,r:r,c:c,k:"star",y0:hgt+.55,ph:Math.random()*6});}
   if(it&&it.t==="gate"){
    const gc=KIND_COL[it.g.kind]||"#EF4444",gg=new THREE.Group();gg.position.y=hgt;
    const pm=new THREE.MeshStandardMaterial({color:gc,roughness:.4});
    [-.4,.4].forEach(function(x){const p=new THREE.Mesh(new THREE.BoxGeometry(.12,1.15,.12),pm);p.position.set(x,.575,0);gg.add(p);});
    const beam=new THREE.Mesh(new THREE.BoxGeometry(.92,.12,.12),pm);beam.position.y=1.17;gg.add(beam);
    const field=new THREE.Mesh(new THREE.PlaneGeometry(.68,1.05),new THREE.MeshBasicMaterial({color:gc,transparent:true,opacity:.32,side:THREE.DoubleSide}));field.position.y=.58;gg.add(field);
    const sp=esprite(KIND_EMO[it.g.kind]||"❓",.5);sp.position.y=1.6;gg.add(sp);
    g.add(gg);anim.items.push({m:sp,r:r,c:c,k:"gate",y0:1.6,ph:Math.random()*6,field:field});anim.gates[key]=gg;}
   if(W.start&&W.start[0]===r&&W.start[1]===c){const d=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.06,24),new THREE.MeshStandardMaterial({color:"#22C55E"}));d.position.y=hgt+.03;g.add(d);const f=esprite("🚩",.7);f.position.y=hgt+.55;g.add(f);}
   if(W.fin&&W.fin[0]===r&&W.fin[1]===c){const d=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.06,24),new THREE.MeshStandardMaterial({color:"#FACC15"}));d.position.y=hgt+.03;g.add(d);const f=esprite("🏁",.75);f.position.y=hgt+.6;g.add(f);const t=esprite("🏆",.5);t.position.y=hgt+1.15;g.add(t);anim.items.push({m:t,r:r,c:c,k:"gate",y0:hgt+1.15,ph:1});}}
  tag(g,r,c);}
 function buildAll(){for(let r=0;r<N;r++)for(let c=0;c<N;c++)buildCell(r,c);}
 buildAll();
 /* ---- frijolito ---- */
 const bean=new THREE.Group(),body=new THREE.Group();bean.add(body);bean.visible=play;scene.add(bean);
 const bm=new THREE.MeshStandardMaterial({color:opts.bean||"#F472B6",roughness:.45});
 const cap=new THREE.Mesh(new THREE.CapsuleGeometry(.2,.3,8,16),bm);cap.position.y=.38;body.add(cap);
 [-1,1].forEach(function(s){const e=new THREE.Mesh(new THREE.SphereGeometry(.065,12,10),new THREE.MeshStandardMaterial({color:"#FFFFFF"}));e.position.set(s*.09,.5,.17);body.add(e);const pu=new THREE.Mesh(new THREE.SphereGeometry(.032,8,8),new THREE.MeshStandardMaterial({color:"#111827"}));pu.position.set(s*.09,.5,.225);body.add(pu);
  const ar=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),bm);ar.position.set(s*.23,.34,.02);body.add(ar);const lg=new THREE.Mesh(new THREE.SphereGeometry(.085,10,8),bm);lg.position.set(s*.1,.06,0);body.add(lg);});
 const st={r:0,c:0,cp:[0,0],busy:false,got:0,anim:null,face:0};
 function topY(r,c){const hh=W.h[r*N+c];return hh>0?hh:-.6;}
 function placeBean(r,c){st.r=r;st.c=c;bean.position.set(px(c),topY(r,c),pz(r));bean.scale.setScalar(1);body.position.y=0;}
 function toStart(){const s=W.start||[0,0];st.cp=[s[0],s[1]];placeBean(s[0],s[1]);}
 if(play)toStart();
 /* ---- cámara ---- */
 const cam={th:.55,ph:1.0,R:N*1.1+2.4,tx:0,tz:0,touched:false};
 function place(){
  if(play){const t=bean.position;cam.tx+=(t.x-cam.tx)*.12;cam.tz+=(t.z-cam.tz)*.12;const R=N*.85+3.5,ph=.95;camera.position.set(cam.tx,Math.max(2,t.y+R*Math.cos(ph)),cam.tz+R*Math.sin(ph));camera.lookAt(cam.tx,t.y+.4,cam.tz-.6);}
  else{camera.position.set(cam.R*Math.sin(cam.ph)*Math.sin(cam.th),cam.R*Math.cos(cam.ph),cam.R*Math.sin(cam.ph)*Math.cos(cam.th));camera.lookAt(0,.8,0);}}
 const ctx={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,ro:null};
 if(window.ResizeObserver){ctx.ro=new ResizeObserver(function(){const nw=el.clientWidth,nh=el.clientHeight;if(nw>0&&nh>0){renderer.setSize(nw,nh,false);camera.aspect=nw/nh;camera.updateProjectionMatrix();}});ctx.ro.observe(el);}
 /* ---- toques ---- */
 const rc=new THREE.Raycaster();let down=null,moved=false;
 function pick(e){
  const r=cv.getBoundingClientRect();rc.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},camera);
  const hits=rc.intersectObjects([root,sea],true);
  for(let i=0;i<hits.length;i++){const o=hits[i].object;
   if(o.userData.r!==undefined)return{r:o.userData.r,c:o.userData.c};
   if(o.userData.sea){const c=Math.round(hits[i].point.x+half),rr=Math.round(hits[i].point.z+half);if(c>=0&&c<N&&rr>=0&&rr<N)return{r:rr,c:c};return null;}}
  return null;}
 cv.addEventListener("pointerdown",function(e){down={x:e.clientX,y:e.clientY};moved=false;try{cv.setPointerCapture(e.pointerId);}catch(x){}});
 cv.addEventListener("pointermove",function(e){if(!down||play)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)+Math.abs(dy)>8)moved=true;if(moved){cam.th-=dx*.01;cam.ph=Math.max(.2,Math.min(1.45,cam.ph-dy*.008));down={x:e.clientX,y:e.clientY};}});
 cv.addEventListener("pointerup",function(e){if(down&&!moved&&!play){const p=pick(e);if(p&&cb)cb("tap",p);}down=null;});
 cv.addEventListener("pointercancel",function(){down=null;});
 /* ---- movimiento (modo juego) ---- */
 function start(a){st.anim=a;a.t=0;st.busy=true;}
 function move(dr,dc){
  if(!play||st.busy)return{ev:"busy"};
  const nr=st.r+dr,nc=st.c+dc;
  st.face=Math.atan2(dc,dr);
  if(nr<0||nc<0||nr>=N||nc>=N){start({k:"bump",dr:dr,dc:dc});if(cb)cb("blocked",{why:"edge"});return{ev:"edge"};}
  const th=W.h[nr*N+nc],ch=W.h[st.r*N+st.c];
  if(th===0){start({k:"fall",fr:st.r,fc:st.c,r:nr,c:nc});return{ev:"fall"};}
  if(th-ch>1){start({k:"bump",dr:dr,dc:dc});if(cb)cb("blocked",{why:"high"});return{ev:"blocked"};}
  const key=nr+","+nc,it=W.items[key];
  if(it&&it.t==="gate"){start({k:"bump",dr:dr,dc:dc,gate:{r:nr,c:nc,item:it}});return{ev:"gate"};}
  start({k:"hop",fr:st.r,fc:st.c,r:nr,c:nc,after:function(){
   const it2=W.items[nr+","+nc];
   if(it2&&it2.t==="star"){delete W.items[nr+","+nc];st.got++;buildCell(nr,nc);if(cb)cb("star",{got:st.got});}
   if(W.fin&&W.fin[0]===nr&&W.fin[1]===nc){st.busy=true;if(cb)cb("finish",{});}
   else if(cb)cb("moved",{r:nr,c:nc});}});
  return{ev:"move"};}
 function openGate(r,c){
  const key=r+","+c,gg=anim.gates[key];
  st.cp=[st.r,st.c];
  const done=function(){delete W.items[key];buildCell(r,c);start({k:"hop",fr:st.r,fc:st.c,r:r,c:c,after:function(){st.cp=[r,c];if(cb)cb("moved",{r:r,c:c});}});};
  if(gg){let k=0;const iv=setInterval(function(){k+=.1;gg.scale.y=Math.max(.01,1-k);gg.position.y+= -.01;if(k>=1){clearInterval(iv);done();}},30);}else done();}
 LIVE=ctx;
 let last=performance.now();
 function update(dt){
  ctx.t+=dt;
  anim.items.forEach(function(a){
   if(a.k==="star"){a.m.rotation.y+=dt*2.2;a.m.position.y=a.y0+Math.sin(ctx.t*2+a.ph)*.08;}
   else{a.m.position.y=a.y0+Math.sin(ctx.t*2+a.ph)*.07;if(a.field)a.field.material.opacity=.26+Math.sin(ctx.t*3+a.ph)*.08;}});
  if(play&&st.anim){
   const a=st.anim;a.t+=dt;
   if(a.k==="hop"){const d=.26,k=Math.min(1,a.t/d),y0=topY(a.fr,a.fc),y1=topY(a.r,a.c);
    bean.position.set(px(a.fc)+(px(a.c)-px(a.fc))*k,y0+(y1-y0)*k+Math.sin(k*Math.PI)*.38,pz(a.fr)+(pz(a.r)-pz(a.fr))*k);
    body.scale.set(1+Math.sin(k*Math.PI)*-.08,1+Math.sin(k*Math.PI)*.12,1);
    if(k>=1){st.r=a.r;st.c=a.c;bean.position.set(px(a.c),y1,pz(a.r));body.scale.set(1,1,1);st.anim=null;st.busy=false;if(a.after)a.after();}}
   else if(a.k==="bump"){const d=.3,k=Math.min(1,a.t/d),off=Math.sin(k*Math.PI)*.28;
    bean.position.set(px(st.c)+a.dc*off,topY(st.r,st.c),pz(st.r)+a.dr*off);
    if(k>=1){bean.position.set(px(st.c),topY(st.r,st.c),pz(st.r));st.anim=null;st.busy=false;if(a.gate&&cb)cb("gate",a.gate);}}
   else if(a.k==="fall"){
    const d1=.26;
    if(a.t<d1){const k=a.t/d1;bean.position.set(px(a.fc)+(px(a.c)-px(a.fc))*k,topY(a.fr,a.fc)+Math.sin(k*Math.PI)*.3,pz(a.fr)+(pz(a.r)-pz(a.fr))*k);}
    else{const k=Math.min(1,(a.t-d1)/.7);bean.position.set(px(a.c),topY(a.fr,a.fc)-k*2.2,pz(a.r));bean.rotation.z=k*3;bean.scale.setScalar(Math.max(.2,1-k*.6));
     if(k>=1){const cp=st.cp;bean.rotation.z=0;placeBean(cp[0],cp[1]);bean.scale.setScalar(.01);a.t=-1;a.k="pop";if(cb)cb("fall",{});}}}
   else if(a.k==="pop"){const k=Math.min(1,Math.max(0,a.t)/.35);bean.scale.setScalar(.01+k*.99*(1+Math.sin(k*Math.PI)*.2));if(k>=1){bean.scale.setScalar(1);st.anim=null;st.busy=false;}}}
  bean.rotation.y+=(st.face-bean.rotation.y)*.25;
  if(!play&&!cam.touched)cam.th+=.0025;
  place();}
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);
  const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;update(dt);renderer.render(scene,camera);})();
 return{
  /* avanza la simulación a mano (pruebas: el navegador pausa requestAnimationFrame si la ventana no se ve) */
  step:function(sec){for(let t=0;t<sec;t+=1/60)update(1/60);},
  refresh:function(Wn){W=Wn;clearGroup(root);cells.length=0;anim.items=[];anim.gates={};buildAll();if(play)toStart();},
  setCell:buildCell,
  tap:function(r,c){if(cb)cb("tap",{r:r,c:c});},
  move:move,openGate:openGate,
  state:function(){return{r:st.r,c:st.c,busy:st.busy,got:st.got,cp:st.cp};},
  view:function(kind){cam.touched=true;if(kind==="top"){cam.ph=.3;cam.th=0;}else{cam.ph=1.0;cam.th=.55;}},
  bean:function(col){bm.color.set(col);}};}

window.renderWorld3D=renderWorld3D;
window.disposeWorld3D=disposeWorld3D;
window.WORLD_KIND_COL=KIND_COL;window.WORLD_KIND_EMO=KIND_EMO;window.WORLD_PAL=PAL;
