"use strict";
/* ============ LIBRO DE SOLAPAS EN 3D (lift-the-flap) ============
   Un tablero de color con solapas que se levantan: debajo de cada una hay un dibujo y su palabra
   en inglés. Sirve para explorar ("In my backpack I have…") y para jugar a "encuentra la palabra".
   Las solapas giran sobre su borde superior. Una sola escena WebGL; dispose desde stopGames(). */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

let LIVE=null;
function disposeFlaps3D(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);if(LIVE.ro)LIVE.ro.disconnect();}catch(e){}
 try{LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});LIVE.renderer.dispose();const c=LIVE.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);}catch(e){}
 LIVE=null;}

function tex(w,h,draw){const cv=document.createElement("canvas");cv.width=w;cv.height=h;draw(cv.getContext("2d"),w,h);const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function emojiTex(e){return tex(160,160,function(c){c.font='116px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText(e,80,88);});}
function wordTex(txt){return tex(320,84,function(c,w,h){c.fillStyle="#FFFFFF";rr(c,6,6,w-12,h-12,22);c.fill();c.strokeStyle="#CBD5E1";c.lineWidth=5;c.stroke();
 const s=txt.length<=8?46:txt.length<=11?38:30;c.fillStyle="#1E293B";c.font='700 '+s+'px Fredoka,"Nunito",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText(txt,w/2,h/2+3);});}
function headTex(txt,col){return tex(768,120,function(c,w,h){c.fillStyle=col;rr(c,4,4,w-8,h-8,40);c.fill();
 const s=txt.length<=22?54:txt.length<=30?44:36;c.fillStyle="#FFFFFF";c.font='700 '+s+'px Fredoka,"Nunito",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText(txt,w/2,h/2+4);});}
function flapTex(col,n){return tex(256,256,function(c,w,h){c.fillStyle=col;c.fillRect(0,0,w,h);c.strokeStyle="rgba(255,255,255,.7)";c.lineWidth=10;c.strokeRect(10,10,w-20,h-20);
 c.fillStyle="#FFFFFF";c.font='700 130px Fredoka,"Nunito",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText("?",w/2,h/2+8);
 c.font='700 40px Fredoka,"Nunito",sans-serif';c.fillText(String(n),w-44,44);});}

/* cfg:{head,col,items:[{w,e}]}  cb(ev,info): tap {i,w,open} */
function renderFlapBook(containerId,cfg,cb){
 const el=document.getElementById(containerId);if(!el)return null;
 disposeFlaps3D();
 const w=el.clientWidth||340,h=el.clientHeight||320;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h,false);
 const cv=renderer.domElement;cv.style.width="100%";cv.style.height="100%";cv.style.display="block";cv.style.touchAction="none";
 el.innerHTML="";el.appendChild(cv);
 const scene=new THREE.Scene();scene.background=new THREE.Color(cfg.bg||"#FFF7ED");
 const camera=new THREE.PerspectiveCamera(36,w/h,.1,60);
 scene.add(new THREE.AmbientLight(0xffffff,1.5));
 const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(2,5,7);scene.add(dl);
 const items=cfg.items,n=items.length,cols=n<=6?3:4,rows=Math.ceil(n/cols),cw=1.55,ch=1.7;
 const bw=cols*cw+.35,bh=rows*ch+.35;
 const board=new THREE.Mesh(new THREE.BoxGeometry(bw,bh,.12),new THREE.MeshStandardMaterial({color:cfg.col||"#F9A8D4",roughness:.8}));board.position.set(0,0,-.08);scene.add(board);
 const head=new THREE.Mesh(new THREE.PlaneGeometry(bw,.62),new THREE.MeshBasicMaterial({map:headTex(cfg.head||"",cfg.dark||"#BE185D"),transparent:true}));head.position.set(0,bh/2+.45,0);scene.add(head);
 const pastel=["#F472B6","#FB923C","#34D399","#60A5FA","#A78BFA","#FBBF24","#F87171","#2DD4BF"];
 const flaps=[],hits=[];
 items.forEach(function(it,i){
  const r=Math.floor(i/cols),c=i%cols,cnt=Math.min(cols,n-r*cols);
  const cx=(c-(cnt-1)/2)*cw,cy=(rows-1)/2*ch-r*ch;
  const card=new THREE.Mesh(new THREE.PlaneGeometry(cw-.16,ch-.16),new THREE.MeshBasicMaterial({color:"#FFFFFF"}));card.position.set(cx,cy,.0);scene.add(card);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTex(it.e),transparent:true}));sp.scale.set(.95,.95,1);sp.position.set(cx,cy+.2,.05);scene.add(sp);
  const lab=new THREE.Mesh(new THREE.PlaneGeometry(cw-.28,.4),new THREE.MeshBasicMaterial({map:wordTex(it.w),transparent:true}));lab.position.set(cx,cy-.58,.05);scene.add(lab);
  const fh=ch-.16,hinge=new THREE.Group();hinge.position.set(cx,cy+fh/2,.1);scene.add(hinge);
  const col=pastel[i%pastel.length];
  const mats=[0,1,2,3,4,5].map(function(){return new THREE.MeshStandardMaterial({color:col,roughness:.6});});
  mats[4]=new THREE.MeshBasicMaterial({map:flapTex(col,i+1)});
  const fl=new THREE.Mesh(new THREE.BoxGeometry(cw-.16,fh,.05),mats);fl.position.y=-fh/2;hinge.add(fl);
  const hit=new THREE.Mesh(new THREE.PlaneGeometry(cw-.1,ch-.1),new THREE.MeshBasicMaterial({visible:false}));hit.position.set(cx,cy,.3);hit.userData.i=i;scene.add(hit);hits.push(hit);
  flaps.push({hinge:hinge,open:false,ang:0,shake:0,i:i});});
 const ctx={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,ro:null,locked:false};
 const needW=bw+.5,needH=bh+1.5,cy0=.2;
 function fit(){const t=Math.tan(camera.fov*Math.PI/360);const d=Math.max(needH/(2*t),needW/(2*t*camera.aspect))+.3;camera.position.set(0,cy0,d);camera.lookAt(0,cy0,0);}
 fit();
 if(window.ResizeObserver){ctx.ro=new ResizeObserver(function(){const nw=el.clientWidth,nh=el.clientHeight;if(nw>0&&nh>0){renderer.setSize(nw,nh,false);camera.aspect=nw/nh;camera.updateProjectionMatrix();fit();}});ctx.ro.observe(el);}
 function tap(i){
  if(ctx.locked||!flaps[i])return;
  const f=flaps[i];f.open=!f.open;
  if(cb)cb("tap",{i:i,w:items[i].w,open:f.open});}
 const rc=new THREE.Raycaster();
 cv.addEventListener("pointerdown",function(e){
  const r=cv.getBoundingClientRect();rc.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},camera);
  const h=rc.intersectObjects(hits,false)[0];if(h)tap(h.object.userData.i);});
 LIVE=ctx;
 (function loop(){
  ctx.raf=requestAnimationFrame(loop);ctx.t+=.016;
  flaps.forEach(function(f){
   const tgt=f.open?1.68:0;f.ang+=(tgt-f.ang)*.16;
   f.hinge.rotation.x=-f.ang;
   if(f.shake>0){f.hinge.rotation.z=Math.sin(ctx.t*50)*.06*f.shake;f.shake=Math.max(0,f.shake-.04);}else f.hinge.rotation.z=0;});
  renderer.render(scene,camera);})();
 return{
  tap:tap,
  openAll:function(){flaps.forEach(function(f){f.open=true;});},
  closeAll:function(){flaps.forEach(function(f){f.open=false;});},
  close:function(i){if(flaps[i])flaps[i].open=false;},
  shake:function(i){if(flaps[i])flaps[i].shake=1;},
  lock:function(v){ctx.locked=!!v;}};}

window.renderFlapBook=renderFlapBook;
window.disposeFlaps3D=disposeFlaps3D;
