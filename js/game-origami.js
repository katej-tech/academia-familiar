"use strict";
/* ============ AVIÓN DE PAPEL EN 3D (doblado real + vuelo) ============
   v3 tras auditoría como usuaria: el "avión terminado" era un recorte plano blanco en forma de
   flecha (los pasos 3-5 solo cambiaban la silueta, nada se doblaba), volaba como una lámina y solo
   se podía lanzar UNA vez. Ahora:
   - El papel tiene DOS lados (cara crema, dorso de color) y cada pliegue es una aleta que GIRA de
     verdad sobre su línea de doblez: marca central (doblar y abrir), esquinas hacia el centro,
     doblar por la mitad y abrir las alas en V.
   - Se elige el color del papel; el avión gira hasta la posición de vuelo.
   - Lanzamiento tipo resortera con TRAYECTORIA de puntos (así se entiende qué pasa con la fuerza y
     el ángulo), vuelo con cabeceo, alerones, estela, cielo, pista con marcas de metros, y se puede
     lanzar TODAS las veces que se quiera; el récord se guarda.
   Módulo ES (Three.js por CDN): las funciones que llama el resto de la app se cuelgan en window. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const A=.7,B=1.0;                       /* media anchura y media longitud de la hoja */
const STEPS=[
 "Empieza con una hoja de papel. ¡Elige su color! 🎨",
 "Dóblala por la mitad y ábrela: queda una marca en el centro",
 "Dobla las dos esquinas de arriba hacia el centro",
 "Ahora dobla todo el avión por la mitad",
 "Abre las alas hacia los lados: ¡tu avión está listo! ✈️"];
const BTN=["Doblar por la mitad →","Doblar las esquinas →","Doblar por la mitad →","Abrir las alas →","🚀 ¡Lánzalo!"];
const COLORS=["#60A5FA","#F87171","#FBBF24","#34D399","#A78BFA","#F472B6"];
const G=3.4,KL=.11,D0=.09,D1=.02,CAP=.9,GY=-1.05,MPU=1.4;   /* física calibrada con simulación: 6–30 m según fuerza y ángulo (el mejor ángulo ronda 15–25°) */

let PA={};
function disposeObj(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}}
function paDispose(){
 if(PA.raf)cancelAnimationFrame(PA.raf);
 if(PA.scene)PA.scene.traverse(disposeObj);
 if(PA.renderer){PA.renderer.dispose();const c=PA.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);}
 PA={};}

/* ---------- papel de dos caras ---------- */
function paperMesh(pts,backColor){
 const sh=new THREE.Shape();pts.forEach(function(p,i){i?sh.lineTo(p[0],p[1]):sh.moveTo(p[0],p[1]);});sh.closePath();
 const geo=new THREE.ShapeGeometry(sh);
 const opt={roughness:.85,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1};
 const g=new THREE.Group();
 const f=new THREE.Mesh(geo,new THREE.MeshStandardMaterial(Object.assign({color:"#FFFDF5",side:THREE.FrontSide},opt)));
 const b=new THREE.Mesh(geo,new THREE.MeshStandardMaterial(Object.assign({color:backColor,side:THREE.BackSide},opt)));
 b.userData.back=true;
 const e=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:"#8391A6"}));
 g.add(f,b,e);return g;}
function buildPlane(color){
 const sheet=new THREE.Group();
 const L=new THREE.Group(),R=new THREE.Group();R.position.z=.012;
 L.add(paperMesh([[-A,-B],[0,-B],[0,B],[-A,B-A]],color));
 R.add(paperMesh([[0,-B],[A,-B],[A,B-A],[0,B]],color));
 /* aletas de las esquinas: pivotan sobre su línea de doblez (0,B)→(∓A,B-A) */
 function corner(side){
  const piv=new THREE.Group();piv.position.set(0,B,side<0?.004:.003);
  const pts=side<0?[[-A,0],[-A,-A],[0,0]]:[[0,0],[A,-A],[A,0]];
  piv.add(paperMesh(pts,color));
  const d=new THREE.Vector3(side*A,-A,0).normalize();              /* dirección del doblez */
  const r=new THREE.Vector3(side*A,0,0);                            /* esquina relativa al pivote */
  const sign=new THREE.Vector3().crossVectors(d,r).z>0?1:-1;        /* para que se levante hacia arriba */
  piv.userData={axis:d,sign:sign};return piv;}
 const c1=corner(-1),c2=corner(1);L.add(c1);R.add(c2);
 const crease=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-B,.006),new THREE.Vector3(0,B,.006)]),new THREE.LineDashedMaterial({color:"#1E2A4A",dashSize:.1,gapSize:.07}));
 crease.computeLineDistances();crease.visible=false;
 sheet.add(L,R,crease);
 sheet.userData={L:L,R:R,c1:c1,c2:c2,crease:crease};return sheet;}
function setCorner(piv,th){piv.quaternion.setFromAxisAngle(piv.userData.axis,piv.userData.sign*th);}
function recolor(sheet,color){sheet.traverse(function(o){if(o.userData&&o.userData.back)o.material.color.set(color);});}

/* ---------- escena ---------- */
function initScene(el){
 const w=el.clientWidth||330,h=Math.min(340,Math.round(w*1.0));
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h);
 el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#DCEBFA");
 const camera=new THREE.PerspectiveCamera(38,w/h,.1,200);
 scene.add(new THREE.AmbientLight(0xffffff,1.4));
 const dl=new THREE.DirectionalLight(0xffffff,1.3);dl.position.set(2,6,4);scene.add(dl);
 const fl=new THREE.DirectionalLight(0xffffff,.5);fl.position.set(-4,3,2);scene.add(fl);
 PA.renderer=renderer;PA.scene=scene;PA.camera=camera;PA.w=w;PA.h=h;}
function tableSetup(){
 const t=new THREE.Mesh(new THREE.CircleGeometry(3.2,40),new THREE.MeshStandardMaterial({color:"#E9EFF7",roughness:1}));
 t.rotation.x=-Math.PI/2;t.position.y=-.03;PA.scene.add(t);PA.table=t;
 const s=new THREE.Mesh(new THREE.CircleGeometry(1,32),new THREE.MeshBasicMaterial({color:"#9FB0C6",transparent:true,opacity:.35}));
 s.rotation.x=-Math.PI/2;s.position.y=-.02;s.scale.set(.85,1.25,1);PA.scene.add(s);PA.shadow=s;
 PA.camera.position.set(0,3.5,3.4);PA.camera.lookAt(0,0,-.1);}

/* ---------- animación ---------- */
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
function anim(dur,fn,done){PA.anim={t0:performance.now(),dur:dur,fn:fn,done:done};PA.busy=true;setBtn(false);}
function setBtn(on){const b=document.getElementById("paNextBtn");if(b){b.disabled=!on;b.style.opacity=on?1:.55;}}
function update(now){
 if(PA.anim){const a=PA.anim,t=Math.min(1,(now-a.t0)/a.dur);a.fn(ease(t),t);if(t>=1){PA.anim=null;PA.busy=false;if(a.done)a.done();}}
 if(PA.mode==="fold"&&PA.sheet&&!PA.anim)PA.sheet.rotation.z=Math.sin(now/1300)*.05;
 if(PA.mode==="flight")flightStep();
 if(PA.mode==="throw"&&PA.fly)PA.fly.position.y=.15+Math.sin(now/500)*.03;}
function loop(){
 if(!PA.renderer)return;PA.raf=requestAnimationFrame(loop);
 update(performance.now());
 PA.renderer.render(PA.scene,PA.camera);}

/* ---------- pantalla ---------- */
function gamePaperPlane(){setTheme("kid");
 paDispose();
 PA={step:0,color:COLORS[0],mode:"fold",best:0};
 const sw=COLORS.map(function(c,i){return '<button onclick="paColor('+i+')" id="pac'+i+'" style="width:36px;height:36px;border-radius:50%;border:3px solid '+(i===0?"#1E2A4A":"#fff")+';background:'+c+';box-shadow:0 3px 8px rgba(30,42,74,.3)"></button>';}).join("");
 render(topbar("screenMyStuff()")
  +'<div class="progressdots" id="paDots">'+dots(STEPS.length,0)+'</div>'
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.45rem);text-align:center;margin-bottom:2px">✈️ Avión de papel</h2>'
  +'<p class="center" id="paLabel" style="font-size:.95rem;margin-bottom:6px;min-height:2.6em">'+STEPS[0]+'</p>'
  +'<div id="paSwatches" style="display:flex;gap:8px;justify-content:center;margin-bottom:6px">'+sw+'</div>'
  +'<div id="paStage" style="border-radius:16px;overflow:hidden;max-width:360px;margin:0 auto;position:relative"></div>'
  +'<div id="paPower" style="display:none;max-width:360px;margin:8px auto 0"><div style="display:flex;justify-content:space-between;font-family:Fredoka;font-weight:700;font-size:.85rem"><span>💪 Fuerza</span><span id="paPowTxt"></span></div><div style="height:14px;border-radius:10px;background:#E6ECF5;border:2px solid var(--kid-ink);overflow:hidden"><div id="paPowBar" style="height:100%;width:0;background:linear-gradient(90deg,#3EC97C,#FFC93C,#FF6B6B)"></div></div></div>'
  +'<div id="paBtns"><button class="kbtn blue" id="paNextBtn" style="margin-top:12px" onclick="paNext()">'+BTN[0]+'</button>'
  +'<button class="kbtn white" style="margin-top:8px" onclick="gamePaperPlane()">🔁 Empezar de nuevo</button></div>');
 initScene(document.getElementById("paStage"));
 tableSetup();
 PA.sheet=buildPlane(PA.color);PA.sheet.rotation.x=-Math.PI/2;PA.scene.add(PA.sheet);
 PA.sheet.scale.setScalar(.01);
 anim(600,function(e){PA.sheet.scale.setScalar(.01+.99*e);},function(){setBtn(true);});
 loop();}
function paColor(i){
 if(PA.step!==0||!PA.sheet)return;PA.color=COLORS[i];recolor(PA.sheet,PA.color);
 COLORS.forEach(function(c,k){const b=document.getElementById("pac"+k);if(b)b.style.borderColor=(k===i)?"#1E2A4A":"#fff";});beep([520],.04);}
function setLabel(s){const l=document.getElementById("paLabel");if(l)l.innerHTML=s;}
function setDots(n){const d=document.getElementById("paDots");if(d)d.innerHTML=dots(STEPS.length,n);}
function paNext(){
 if(!PA.sheet||PA.busy)return;
 const U=PA.sheet.userData,s=PA.step+1;
 const sw=document.getElementById("paSwatches");if(sw)sw.style.display="none";
 beep([560],.05);
 if(s===1){anim(1500,function(e,t){const th=Math.PI*Math.sin(Math.PI*t);U.R.rotation.y=-th;},function(){U.R.rotation.y=0;U.crease.visible=true;done(s);});}
 else if(s===2){anim(1200,function(e){setCorner(U.c1,Math.PI*e);setCorner(U.c2,Math.PI*e);},function(){done(s);});}
 else if(s===3){U.crease.visible=false;anim(1400,function(e){U.R.rotation.y=-Math.PI*e;},function(){done(s);});}
 else if(s===4){anim(1500,function(e){U.R.rotation.y=-(Math.PI+(.34-Math.PI)*e);U.L.rotation.y=.34*e;},function(){done(s);});}
 else if(s===5){launchPrep();}}
function done(s){PA.step=s;setLabel(STEPS[s]);setDots(s);const b=document.getElementById("paNextBtn");if(b){b.textContent=BTN[s];if(s===4){b.classList.remove("blue");b.classList.add("green");}}setBtn(true);}

/* ---------- del papel al vuelo ---------- */
const Q_TABLE=new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,0));
const Q_FLIGHT=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,0,1),new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0)));
function launchPrep(){
 PA.mode="prep";setLabel("¡Tu avión despega! ✈️");setDots(5);
 const fly=new THREE.Group();fly.userData.bob=0;PA.scene.add(fly);
 PA.scene.remove(PA.sheet);fly.add(PA.sheet);PA.sheet.position.set(0,0,0);PA.sheet.rotation.set(0,0,0);PA.sheet.quaternion.copy(Q_TABLE);PA.fly=fly;
 buildWorld();
 const c0=PA.camera.position.clone();
 anim(1300,function(e){
  PA.sheet.quaternion.slerpQuaternions(Q_TABLE,Q_FLIGHT,e);
  PA.sheet.scale.setScalar(1-.28*e);
  fly.position.y=e*.15;
  PA.camera.position.lerpVectors(c0,new THREE.Vector3(-1.4,1.35,4.3),e);PA.camera.lookAt(.3*e,-.1*e,0);
 },function(){
  PA.camera.lookAt(.3,-.1,0);enterThrow();});}
function buildWorld(){
 if(PA.table){PA.scene.remove(PA.table);disposeObj(PA.table);PA.table=null;}
 if(PA.shadow){PA.scene.remove(PA.shadow);disposeObj(PA.shadow);PA.shadow=null;}
 PA.scene.background=new THREE.Color("#BFE3FF");PA.scene.fog=new THREE.Fog("#BFE3FF",16,70);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,40),new THREE.MeshStandardMaterial({color:"#A8DDA0",roughness:1}));
 ground.rotation.x=-Math.PI/2;ground.position.set(200,GY-.05,0);PA.scene.add(ground);
 const lane=new THREE.Mesh(new THREE.PlaneGeometry(500,3),new THREE.MeshStandardMaterial({color:"#D9CBA8",roughness:1}));
 lane.rotation.x=-Math.PI/2;lane.position.set(200,GY-.04,0);PA.scene.add(lane);
 for(let m=5;m<=60;m+=5){
  const x=m/MPU;
  const post=new THREE.Mesh(new THREE.BoxGeometry(.05,.5,.05),new THREE.MeshStandardMaterial({color:"#1E2A4A"}));post.position.set(x,GY+.2,-1.7);PA.scene.add(post);
  const cv=document.createElement("canvas");cv.width=128;cv.height=64;const cx=cv.getContext("2d");
  cx.fillStyle="#FFFFFF";cx.fillRect(0,0,128,64);cx.strokeStyle="#1E2A4A";cx.lineWidth=6;cx.strokeRect(3,3,122,58);cx.fillStyle="#1E2A4A";cx.font="bold 34px sans-serif";cx.textAlign="center";cx.textBaseline="middle";cx.fillText(m+" m",64,34);
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv)}));spr.scale.set(.75,.38,1);spr.position.set(x,GY+.7,-1.7);PA.scene.add(spr);}
 for(let i=0;i<14;i++){
  const c=new THREE.Group();const n=3+(i%3);
  for(let k=0;k<n;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(.5+Math.random()*.35,10,8),new THREE.MeshBasicMaterial({color:"#FFFFFF",transparent:true,opacity:.92}));s.position.set(k*.6-n*.3,Math.random()*.2,0);c.add(s);}
  c.position.set(i*4.2+2,1.6+Math.random()*1.4,-6-Math.random()*4);PA.scene.add(c);}
 PA.trail=[];PA.dots=[];
 for(let i=0;i<26;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(.035,6,6),new THREE.MeshBasicMaterial({color:"#1E2A4A",transparent:true,opacity:.65}));d.visible=false;PA.scene.add(d);PA.dots.push(d);}}

/* ---------- lanzamiento: arrastra hacia atrás y hacia abajo (resortera) ---------- */
function launchVel(power,angle){const sp=2.4+power*4.6;return{vx:sp*Math.cos(angle),vy:sp*Math.sin(angle)};}
function integrate(s,dt){
 const lift=Math.min(KL*s.vx*s.vx,G*CAP);
 s.vy+=(lift-G)*dt;s.vx-=(D0+D1*s.vx)*s.vx*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;}
function enterThrow(){
 PA.mode="throw";PA.pull={p:0,a:.35};
 setLabel("Arrastra hacia <b>atrás y abajo</b> y suelta 🎯 (más atrás = más fuerza; más abajo = sube más)");
 const pw=document.getElementById("paPower");if(pw)pw.style.display="block";
 const b=document.getElementById("paBtns");
 if(b)b.innerHTML='<button class="kbtn white" style="margin-top:12px" onclick="gamePaperPlane()">🔁 Doblar otro avión</button>';
 placeAtStart();updateAim();
 const dom=PA.renderer.domElement;dom.style.touchAction="none";
 let st=null;
 dom.onpointerdown=function(e){if(PA.mode!=="throw")return;st={x:e.clientX,y:e.clientY};try{dom.setPointerCapture(e.pointerId);}catch(_){}};
 dom.onpointermove=function(e){if(!st||PA.mode!=="throw")return;
  const dx=e.clientX-st.x,dy=e.clientY-st.y;
  PA.pull.p=Math.max(0,Math.min(1,-dx/(PA.w*.42)));
  PA.pull.a=.1+Math.max(0,Math.min(1,dy/(PA.h*.4)))*.75;updateAim();};
 dom.onpointerup=function(){if(!st||PA.mode!=="throw")return;st=null;
  if(PA.pull.p<.12){PA.pull.p=0;updateAim();return;}
  doLaunch();};}
function placeAtStart(){
 PA.fly.position.set(0,.15,0);PA.fly.rotation.set(0,0,0);PA.trail.forEach(function(t){PA.scene.remove(t.m);disposeObj(t.m);});PA.trail=[];
 PA.camera.position.set(-1.4,1.35,4.3);PA.camera.lookAt(.3,-.1,0);}
function updateAim(){
 const p=PA.pull.p,a=PA.pull.a;
 PA.fly.position.x=-p*.9;PA.fly.rotation.z=a*(.4+.6*p);
 const bar=document.getElementById("paPowBar"),tx=document.getElementById("paPowTxt");
 if(bar)bar.style.width=Math.round(p*100)+"%";if(tx)tx.textContent=Math.round(p*100)+"%  ·  ángulo "+Math.round(a*57.3)+"°";
 const v=launchVel(p,a);const s={x:PA.fly.position.x,y:.15,vx:v.vx,vy:v.vy};
 PA.dots.forEach(function(d,i){
  if(p<.12){d.visible=false;return;}
  for(let k=0;k<5;k++)integrate(s,1/60);
  d.visible=s.y>GY+.05;d.position.set(s.x,s.y,0);});}
function doLaunch(){
 PA.dots.forEach(function(d){d.visible=false;});
 const v=launchVel(PA.pull.p,PA.pull.a);
 PA.s={x:PA.fly.position.x,y:.15,vx:v.vx,vy:v.vy};PA.t=0;PA.tr=0;PA.mode="flight";PA.landed=false;
 setLabel("¡Volando! ✈️");const pw=document.getElementById("paPower");if(pw)pw.style.display="none";beep([440,660],.1);}
function flightStep(){
 const s=PA.s,dt=(1/60)*(PA.slow||1);
 if(!PA.landed){
  integrate(s,dt);PA.t+=dt;
  const pitch=Math.atan2(s.vy,s.vx);
  PA.fly.position.set(s.x,s.y,0);PA.fly.rotation.z=pitch*.85;PA.fly.rotation.x=Math.sin(PA.t*3.1)*.09;PA.fly.rotation.y=Math.sin(PA.t*1.7)*.06;
  if(++PA.tr%3===0){const m=new THREE.Mesh(new THREE.SphereGeometry(.05,6,6),new THREE.MeshBasicMaterial({color:"#FFFFFF",transparent:true,opacity:.75}));m.position.set(s.x-.15,s.y,0);PA.scene.add(m);PA.trail.push({m:m,life:1});}
  if(s.y<=GY+.12||s.x>MPU*70){land();}}
 PA.trail.forEach(function(t){t.life-=.012;t.m.scale.setScalar(Math.max(.01,t.life));t.m.material.opacity=Math.max(0,t.life*.7);});
 PA.trail=PA.trail.filter(function(t){if(t.life<=0){PA.scene.remove(t.m);disposeObj(t.m);return false;}return true;});
 const tx=PA.s.x;
 PA.camera.position.x+=(tx-1.6-PA.camera.position.x)*.2;
 PA.camera.position.y+=(Math.max(1.0,s.y*.55+1.2)-PA.camera.position.y)*.1;
 PA.camera.lookAt(tx+.9,Math.max(-.2,s.y*.75),0);}
function land(){
 PA.landed=true;PA.mode="landed";PA.fly.rotation.z=-.08;PA.fly.position.y=GY+.12;
 const m=Math.max(1,Math.round(PA.s.x*MPU));PA.dist=m;
 const p=prof();const rec=m>(p.paperPlaneBest||0);if(rec){p.paperPlaneBest=m;save();}
 if(m>PA.best)PA.best=m;
 sOK();confetti(rec?26:12);
 const tip=PA.pull.a<.25?"Prueba subir más el ángulo 📐":PA.pull.a>.65?"¡Muy empinado! Prueba un ángulo más bajo 📐":PA.pull.p<.7?"Prueba con más fuerza 💪":"¡Buen tiro! 🎯";
 setLabel("¡Voló <b>"+m+" metros</b>! "+(rec?"🏆 ¡Nuevo récord!":"Tu récord: "+p.paperPlaneBest+" m")+"<br><span style='font-size:.85rem'>"+tip+"</span>");
 const b=document.getElementById("paBtns");
 if(b)b.innerHTML='<button class="kbtn green" style="margin-top:12px" onclick="paAgain()">🔁 Lanzar otra vez</button><button class="kbtn yellow" style="margin-top:8px" onclick="paFinish()">🏆 ¡Terminé! (mejor: '+PA.best+' m)</button><button class="kbtn white" style="margin-top:8px" onclick="gamePaperPlane()">✂️ Doblar otro avión</button>';}
function paAgain(){
 if(PA.mode!=="landed")return;
 PA.mode="throw";PA.pull={p:0,a:.35};placeAtStart();updateAim();
 setLabel("Arrastra hacia <b>atrás y abajo</b> y suelta 🎯");
 const pw=document.getElementById("paPower");if(pw)pw.style.display="block";
 const b=document.getElementById("paBtns");if(b)b.innerHTML='<button class="kbtn white" style="margin-top:12px" onclick="gamePaperPlane()">🔁 Doblar otro avión</button>';}
function paFinish(){
 const best=PA.best;const stars=best>=22?3:best>=12?2:1;
 paDispose();nodeWin(stars,"Avión de papel");}

window.paState=function(){return PA;};
window.paFastForward=function(n){for(let i=0;i<n&&PA.mode==="flight";i++)flightStep();};   /* solo para pruebas */
window.paSkipAnim=function(){if(PA.anim)update(PA.anim.t0+PA.anim.dur+10);};   /* solo para pruebas */
window.gamePaperPlane=gamePaperPlane;
window.paNext=paNext;
window.paColor=paColor;
window.paAgain=paAgain;
window.paFinish=paFinish;
window.paDispose=paDispose;
