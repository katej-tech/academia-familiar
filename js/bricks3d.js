"use strict";
/* ============ CONSTRUCTOR DE BLOQUES 3D (juego de construcción con bloques encajables) ============
   Pedido: "también incluir juegos tipo lego". Bloques genéricos (nada de marcas): una placa base
   de 10x10 con tacos, bloques de 5 tamaños y 8 colores. Se coloca tocando, se gira la vista
   arrastrando, se apila sobre lo ya construido y al borrar un bloque los de arriba bajan. Los
   RETOS muestran el modelo como bloques "fantasma" transparentes que hay que rellenar. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const N=10,BH=.96;
let LIVE=null;
function disposeBricks(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(function(m){m.dispose();});else o.material.dispose();}});
  LIVE.renderer.dispose();
  const c=LIVE.renderer.domElement;if(c.parentNode)c.parentNode.removeChild(c);
 }catch(e){}
 LIVE=null;window.BricksAPI=null;}

function initBricks(containerId,opts){
 opts=opts||{};
 const el=document.getElementById(containerId);if(!el)return null;
 disposeBricks();
 const w=el.clientWidth||340,h=el.clientHeight||340;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#DCEBFA");
 const camera=new THREE.PerspectiveCamera(38,w/h,.1,100);
 const cam={az:.75,el:.72,dist:20};
 function updateCam(){camera.position.set(Math.sin(cam.az)*Math.cos(cam.el)*cam.dist,Math.sin(cam.el)*cam.dist+.6,Math.cos(cam.az)*Math.cos(cam.el)*cam.dist);camera.lookAt(0,1.4,0);}
 updateCam();
 scene.add(new THREE.AmbientLight(0xffffff,1.35));
 const dl=new THREE.DirectionalLight(0xffffff,1.3);dl.position.set(6,12,7);scene.add(dl);
 const fl=new THREE.DirectionalLight(0xffffff,.45);fl.position.set(-6,4,-5);scene.add(fl);

 const base=new THREE.Mesh(new THREE.BoxGeometry(N,.3,N),new THREE.MeshStandardMaterial({color:"#4CAF50",roughness:.7}));
 base.position.y=-.15;scene.add(base);
 const studGeo=new THREE.CylinderGeometry(.27,.27,.14,14);
 const baseStuds=new THREE.InstancedMesh(studGeo,new THREE.MeshStandardMaterial({color:"#43A047",roughness:.6}),N*N);
 const m4=new THREE.Matrix4();
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){m4.setPosition(i-N/2+.5,.07,j-N/2+.5);baseStuds.setMatrixAt(i*N+j,m4);}
 baseStuds.raycast=function(){};scene.add(baseStuds);
 const bricksG=new THREE.Group();scene.add(bricksG);
 const ghostG=new THREE.Group();scene.add(ghostG);
 const geoCache={};
 const outMat=new THREE.MeshBasicMaterial({color:"#1E2A4A",side:THREE.BackSide});

 const st={bricks:[],sel:{w:2,d:2,color:"#E53935"},mode:"place",hist:[],ghost:null,ghostOn:true};
 function heightsOf(list){const H=[];for(let i=0;i<N;i++)H.push(new Array(N).fill(0));
  list.forEach(function(b){for(let i=b.x;i<b.x+b.w;i++)for(let j=b.z;j<b.z+b.d;j++)H[i][j]=b.y+1;});return H;}
 function settle(list){
  const H=[];for(let i=0;i<N;i++)H.push(new Array(N).fill(0));
  return list.map(function(b){let y=0;for(let i=b.x;i<b.x+b.w;i++)for(let j=b.z;j<b.z+b.d;j++)y=Math.max(y,H[i][j]);
   for(let i=b.x;i<b.x+b.w;i++)for(let j=b.z;j<b.z+b.d;j++)H[i][j]=y+1;
   return{x:b.x,z:b.z,w:b.w,d:b.d,y:y,color:b.color};});}
 function boxGeo(wd,dd){const k=wd+"x"+dd;if(!geoCache[k])geoCache[k]=new THREE.BoxGeometry(wd-.04,BH,dd-.04);return geoCache[k];}
 function makeBrick(b,ghost){
  const g=new THREE.Group();
  const mat=ghost?new THREE.MeshStandardMaterial({color:b.color,transparent:true,opacity:.3,roughness:.6}):new THREE.MeshStandardMaterial({color:b.color,roughness:.5});
  const box=new THREE.Mesh(boxGeo(b.w,b.d),mat);g.add(box);
  if(!ghost){const o=new THREE.Mesh(boxGeo(b.w,b.d),outMat);o.scale.set(1.03,1.03,1.03);g.add(o);o.raycast=function(){};}
  else{const e=new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo(b.w,b.d)),new THREE.LineBasicMaterial({color:b.color}));g.add(e);box.raycast=function(){};}
  for(let i=0;i<b.w;i++)for(let j=0;j<b.d;j++){
   const s=new THREE.Mesh(studGeo,mat);s.position.set(i+.5-b.w/2,BH/2+.07,j+.5-b.d/2);s.raycast=function(){};g.add(s);}
  g.position.set(b.x+b.w/2-N/2,b.y*BH+BH/2,b.z+b.d/2-N/2);
  return{g:g,box:box};}
 function rebuild(){
  while(bricksG.children.length){const c=bricksG.children.pop();c.traverse(function(o){if(o.material&&o.material.dispose&&o.material!==outMat)o.material.dispose();});}
  st.bricks.forEach(function(b,i){const m=makeBrick(b,false);m.box.userData.idx=i;bricksG.add(m.g);});
  rebuildGhost();notify();}
 function rebuildGhost(){
  while(ghostG.children.length){const c=ghostG.children.pop();c.traverse(function(o){if(o.material&&o.material.dispose)o.material.dispose();if(o.geometry&&o.geometry.type==="EdgesGeometry")o.geometry.dispose();});}
  if(st.ghost&&st.ghostOn)st.ghost.forEach(function(b){ghostG.add(makeBrick(b,true).g);});}
 function progress(){
  if(!st.ghost)return{done:0,total:0};
  const used=new Array(st.bricks.length).fill(false);let done=0;
  st.ghost.forEach(function(t){const k=st.bricks.findIndex(function(b,i){return!used[i]&&b.x===t.x&&b.z===t.z&&b.w===t.w&&b.d===t.d&&b.y===t.y&&b.color===t.color;});if(k>=0){used[k]=true;done++;}});
  return{done:done,total:st.ghost.length};}
 function notify(){if(opts.onChange)opts.onChange({count:st.bricks.length,progress:progress()});}
 function pushHist(){st.hist.push(JSON.stringify(st.bricks));if(st.hist.length>40)st.hist.shift();}

 function placeAt(fx,fz){
  const s=st.sel;
  const x0=Math.max(0,Math.min(N-s.w,Math.round(fx-s.w/2))),z0=Math.max(0,Math.min(N-s.d,Math.round(fz-s.d/2)));
  const H=heightsOf(st.bricks);let y=0;
  for(let i=x0;i<x0+s.w;i++)for(let j=z0;j<z0+s.d;j++)y=Math.max(y,H[i][j]);
  if(y>=12){if(opts.onMsg)opts.onMsg("¡Muy alto! No caben más pisos");return false;}
  pushHist();st.bricks.push({x:x0,z:z0,w:s.w,d:s.d,y:y,color:s.color});rebuild();return true;}
 function eraseIdx(i){pushHist();st.bricks.splice(i,1);st.bricks=settle(st.bricks);rebuild();}

 const raycaster=new THREE.Raycaster();
 const cv=renderer.domElement;cv.style.touchAction="none";
 let drag=null;
 cv.addEventListener("pointerdown",function(e){drag={x:e.clientX,y:e.clientY,moved:0};try{cv.setPointerCapture(e.pointerId);}catch(_){}});
 cv.addEventListener("pointermove",function(e){if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved+=Math.abs(dx)+Math.abs(dy);
  if(drag.moved>8){cam.az-=dx*.011;cam.el=Math.max(.25,Math.min(1.4,cam.el+dy*.008));updateCam();}drag.x=e.clientX;drag.y=e.clientY;});
 cv.addEventListener("pointerup",function(e){
  if(drag&&drag.moved<=8){
   const r=cv.getBoundingClientRect();
   raycaster.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},camera);
   const targets=[base];bricksG.children.forEach(function(g){targets.push(g);});
   const hits=raycaster.intersectObjects(targets,true);
   if(hits.length){
    const hit=hits[0];
    if(st.mode==="erase"){if(hit.object.userData&&hit.object.userData.idx!==undefined)eraseIdx(hit.object.userData.idx);}
    else{
     const n=hit.face.normal.clone();
     const p=hit.point.clone();
     if(Math.abs(n.y)<.5){p.x+=n.x*(st.sel.w/2);p.z+=n.z*(st.sel.d/2);}
     const fx=p.x+N/2,fz=p.z+N/2;
     if(fx>-1&&fx<N+1&&fz>-1&&fz<N+1)placeAt(fx,fz);
    }}}
  drag=null;});
 cv.addEventListener("pointercancel",function(){drag=null;});

 LIVE={renderer:renderer,scene:scene,camera:camera,raf:null};
 (function loop(){LIVE.raf=requestAnimationFrame(loop);renderer.render(scene,camera);})();

 const api={
  setSize:function(w,d){st.sel.w=w;st.sel.d=d;},
  rotate:function(){const t=st.sel.w;st.sel.w=st.sel.d;st.sel.d=t;return{w:st.sel.w,d:st.sel.d};},
  setColor:function(c){st.sel.color=c;},
  setMode:function(m){st.mode=m;},
  undo:function(){if(!st.hist.length)return;st.bricks=JSON.parse(st.hist.pop());rebuild();},
  clear:function(){if(!st.bricks.length)return;pushHist();st.bricks=[];rebuild();},
  zoom:function(k){cam.dist=Math.max(9,Math.min(26,cam.dist+k));updateCam();},
  setGhost:function(list){st.ghost=list;rebuildGhost();notify();},
  toggleGhost:function(){st.ghostOn=!st.ghostOn;rebuildGhost();return st.ghostOn;},
  getBricks:function(){return st.bricks.map(function(b){return Object.assign({},b);});},
  setBricks:function(list){st.bricks=settle((list||[]).map(function(b){return Object.assign({},b);}));st.hist=[];rebuild();},
  progress:progress,
  snapshot:function(){renderer.render(scene,camera);return renderer.domElement.toDataURL("image/png");},
  sel:function(){return Object.assign({},st.sel);}
 };
 window.BricksAPI=api;return api;}

window.initBricks=initBricks;
window.disposeBricks=disposeBricks;
