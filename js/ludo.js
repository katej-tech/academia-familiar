"use strict";
/* ============ LUDO CON RETOS (tipo fiesta de tablero) ============
   Pedido: "una partida tipo Mario Party para que aprenda a jugar ludo". Ludo clásico, reglas simples y con un
   «entrenador» que le dice qué hacer en cada momento; cada 3 rondas llega un RETO RELÁMPAGO ⚡ (preguntas de todos los
   temas del banco de «Aprender»): acertar da un 🪄 dado dorado (elige el número que quieras). Equivocarse no quita nada.
   Reglas: 4 colores; una ficha sale de casa con un 6; con 6 se tira otra vez; la ficha da la vuelta al tablero (sentido
   del reloj) y sube por su camino de color hasta el centro con el número justo; si caes en una ficha rival que no esté en
   casilla segura (⭐ o color de salida) ¡la mandas a casa! Gana quien lleva todas sus fichas al centro.
   Jugador = azul (abajo a la izquierda). Una sola escena WebGL (Three.js); disposeLudo() desde stopGames(). Prefijo ld / LD. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const SEATS=[{nm:"Rojo",col:"#EF4444",off:0,home:"r",center:[7,6]},{nm:"Verde",col:"#22C55E",off:13,home:"c",center:[6,7]},{nm:"Amarillo",col:"#FACC15",off:26,home:"r",center:[7,8]},{nm:"Azul",col:"#3B82F6",off:39,home:"c",center:[8,7]}];
const TRACK=(function(){const t=[];
 for(let c=1;c<=5;c++)t.push([6,c]);for(let r=5;r>=0;r--)t.push([r,6]);t.push([0,7]);t.push([0,8]);
 for(let r=1;r<=5;r++)t.push([r,8]);for(let c=9;c<=14;c++)t.push([6,c]);t.push([7,14]);t.push([8,14]);
 for(let c=13;c>=9;c--)t.push([8,c]);for(let r=9;r<=14;r++)t.push([r,8]);t.push([14,7]);t.push([14,6]);
 for(let r=13;r>=9;r--)t.push([r,6]);for(let c=5;c>=0;c--)t.push([8,c]);t.push([7,0]);t.push([6,0]);return t;})();
const HOME=[[[7,1],[7,2],[7,3],[7,4],[7,5]],[[1,7],[2,7],[3,7],[4,7],[5,7]],[[7,13],[7,12],[7,11],[7,10],[7,9]],[[13,7],[12,7],[11,7],[10,7],[9,7]]];
const BASE=[[[1.5,1.5],[1.5,3.5],[3.5,1.5],[3.5,3.5]],[[1.5,10.5],[1.5,12.5],[3.5,10.5],[3.5,12.5]],[[10.5,10.5],[10.5,12.5],[12.5,10.5],[12.5,12.5]],[[10.5,1.5],[10.5,3.5],[12.5,1.5],[12.5,3.5]]];
const SAFE=new Set([0,8,13,21,26,34,39,47]);
const ME=3; // asiento del jugador: azul
const FIN=56;
let LD=null,LDCFG={rivals:2,tokens:2};
function disposeLudo(){
 if(!LD)return;
 try{cancelAnimationFrame(LD.raf);if(LD.ro)LD.ro.disconnect();}catch(e){}
 try{LD.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m.map)m.map.dispose();m.dispose();});}});LD.renderer.dispose();const c=LD.renderer.domElement;if(c&&c.parentNode)c.parentNode.removeChild(c);}catch(e){}
 LD=null;}
function ldCleanup(){if(window.LDG&&window.LDG.timers)window.LDG.timers.forEach(clearTimeout);if(window.LDG)window.LDG.timers=[];try{window.speechSynthesis.cancel();}catch(e){}}
function canv(w,h,fn){const cv=document.createElement("canvas");cv.width=w;cv.height=h;fn(cv.getContext("2d"),w,h);const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;}
function cellPos(r,c){return[c-7,r-7];}
function seatCells(seat,p,ti){
 if(p<0){const b=BASE[seat][ti%4];return b;}
 if(p<=50)return TRACK[(SEATS[seat].off+p)%52];
 if(p<=55)return HOME[seat][p-51];
 return SEATS[seat].center;}

/* ---------- escena ---------- */
function ldBuild(containerId){
 const el=document.getElementById(containerId);if(!el)return null;
 disposeLudo();
 const w=el.clientWidth||340,h=el.clientHeight||360;
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h,false);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.outputColorSpace=THREE.SRGBColorSpace;
 const cv=renderer.domElement;cv.style.width="100%";cv.style.height="100%";cv.style.display="block";cv.style.touchAction="none";el.innerHTML="";el.appendChild(cv);
 const scene=new THREE.Scene();
 scene.background=canv(4,256,function(c,ww,hh){const g=c.createLinearGradient(0,0,0,hh);g.addColorStop(0,"#7C3AED");g.addColorStop(1,"#FBCFE8");c.fillStyle=g;c.fillRect(0,0,ww,hh);});
 const camera=new THREE.PerspectiveCamera(40,w/h,.1,80);
 scene.add(new THREE.HemisphereLight("#FFFFFF","#C4B5FD",1.2));
 const sun=new THREE.DirectionalLight("#FFF7E0",2.2);sun.position.set(6,14,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=-11;sc.right=11;sc.top=11;sc.bottom=-11;sc.near=1;sc.far=40;sun.shadow.bias=-.0005;sun.shadow.normalBias=.03;scene.add(sun);
 /* mesa y tablero */
 const table=new THREE.Mesh(new THREE.CylinderGeometry(13,13.4,.6,48),new THREE.MeshStandardMaterial({color:"#8B5CF6",roughness:.7}));table.position.y=-.55;table.receiveShadow=true;scene.add(table);
 const plate=new THREE.Mesh(new THREE.BoxGeometry(15.8,.36,15.8),new THREE.MeshStandardMaterial({color:"#FEF3C7",roughness:.6}));plate.position.y=-.1;plate.castShadow=true;plate.receiveShadow=true;scene.add(plate);
 const board=new THREE.Group();scene.add(board);
 function tile(r,c,col,hgt,tex){const m=new THREE.Mesh(new THREE.BoxGeometry(.92,hgt||.14,.92),tex?[new THREE.MeshStandardMaterial({color:col}),new THREE.MeshStandardMaterial({color:col}),new THREE.MeshStandardMaterial({map:tex,roughness:.5}),new THREE.MeshStandardMaterial({color:col}),new THREE.MeshStandardMaterial({color:col}),new THREE.MeshStandardMaterial({color:col})]:new THREE.MeshStandardMaterial({color:col,roughness:.5}));const p=cellPos(r,c);m.position.set(p[0],.07+(hgt||.14)/2-.07,p[1]);m.castShadow=true;m.receiveShadow=true;board.add(m);return m;}
 const starTex=canv(128,128,function(c,ww,hh){c.fillStyle="#FFFFFF";c.fillRect(0,0,ww,hh);c.fillStyle="#FACC15";c.strokeStyle="#CA8A04";c.lineWidth=5;c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?24:54;c.lineTo(64+Math.cos(a)*rr,66+Math.sin(a)*rr);}c.closePath();c.fill();c.stroke();});
 TRACK.forEach(function(t,i){const seatStart=[0,13,26,39].indexOf(i);
  if(seatStart>=0)tile(t[0],t[1],SEATS[seatStart].col,.16);
  else if(SAFE.has(i))tile(t[0],t[1],"#FFFFFF",.14,starTex);
  else tile(t[0],t[1],"#FFFFFF",.14);});
 HOME.forEach(function(hc,s){hc.forEach(function(t){tile(t[0],t[1],SEATS[s].col,.15);});});
 /* casas (esquinas) */
 BASE.forEach(function(b,s){const cx=(b[0][1]+b[3][1])/2-7,cz=(b[0][0]+b[3][0])/2-7;
  const q=new THREE.Mesh(new THREE.BoxGeometry(5.7,.2,5.7),new THREE.MeshStandardMaterial({color:SEATS[s].col,roughness:.55}));q.position.set(cx,.05,cz);q.castShadow=true;q.receiveShadow=true;board.add(q);
  const inner=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,.06,40),new THREE.MeshStandardMaterial({color:"#FFFFFF",roughness:.5}));inner.position.set(cx,.18,cz);inner.receiveShadow=true;board.add(inner);
  b.forEach(function(sp){const ring=new THREE.Mesh(new THREE.TorusGeometry(.42,.07,10,28),new THREE.MeshStandardMaterial({color:SEATS[s].col}));ring.rotation.x=Math.PI/2;ring.position.set(sp[1]-7,.23,sp[0]-7);board.add(ring);});});
 /* centro: cuatro triángulos */
 const tri=[[[-1.5,-1.5],[1.5,-1.5],[0,0]],[[1.5,-1.5],[1.5,1.5],[0,0]],[[1.5,1.5],[-1.5,1.5],[0,0]],[[-1.5,1.5],[-1.5,-1.5],[0,0]]];
 const triSeat=[1,2,3,0]; // arriba=verde, derecha=amarillo, abajo=azul, izquierda=rojo
 tri.forEach(function(t,i){const sh=new THREE.Shape();sh.moveTo(t[0][0],t[0][1]);sh.lineTo(t[1][0],t[1][1]);sh.lineTo(t[2][0],t[2][1]);sh.closePath();const g=new THREE.ShapeGeometry(sh);g.rotateX(Math.PI/2);const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:SEATS[triSeat[i]].col,roughness:.4,side:THREE.DoubleSide}));m.position.y=.17;m.receiveShadow=true;board.add(m);});
 /* dado */
 const dm=[];for(let i=0;i<6;i++){dm.push(new THREE.MeshStandardMaterial({map:canv(128,128,function(c,ww,hh){c.fillStyle="#FFFFFF";c.fillRect(0,0,ww,hh);c.strokeStyle="#E2E8F0";c.lineWidth=8;c.strokeRect(4,4,ww-8,hh-8);c.fillStyle=[3,4,1,6,2,5][i]===1?"#EF4444":"#1E293B";const pos={1:[[2,2]],2:[[1,1],[3,3]],3:[[1,1],[2,2],[3,3]],4:[[1,1],[1,3],[3,1],[3,3]],5:[[1,1],[1,3],[2,2],[3,1],[3,3]],6:[[1,1],[1,2],[1,3],[3,1],[3,2],[3,3]]}[[3,4,1,6,2,5][i]];pos.forEach(function(p){c.beginPath();c.arc(p[1]*32,p[0]*32,10,0,6.3);c.fill();});}),roughness:.3}));}
 const die=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.1,1.1),dm);die.castShadow=true;die.position.set(0,.8,0);scene.add(die);
 const ctx={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,ro:null,die:die,tok:[],tw:[],cam:{th:0,ph:.78,R:21},ticks:[]};
 if(window.ResizeObserver){ctx.ro=new ResizeObserver(function(){const nw=el.clientWidth,nh=el.clientHeight;if(nw>0&&nh>0){renderer.setSize(nw,nh,false);camera.aspect=nw/nh;camera.updateProjectionMatrix();}});ctx.ro.observe(el);}
 /* toques: fichas y dado */
 const rc=new THREE.Raycaster();let down=null;
 cv.addEventListener("pointerdown",function(e){down={x:e.clientX,y:e.clientY};});
 cv.addEventListener("pointerup",function(e){if(!down)return;const moved=Math.abs(e.clientX-down.x)+Math.abs(e.clientY-down.y)>10;down=null;if(moved)return;
  const r=cv.getBoundingClientRect();rc.setFromCamera({x:((e.clientX-r.left)/r.width)*2-1,y:-((e.clientY-r.top)/r.height)*2+1},camera);
  const hits=rc.intersectObjects(ctx.tok.map(function(t){return t.g;}).concat([die]),true);
  for(let i=0;i<hits.length;i++){let o=hits[i].object;while(o&&!o.userData.tok&&o!==die&&o.parent)o=o.parent;
   if(o===die){if(window.ldTapDie)window.ldTapDie();return;}if(o&&o.userData.tok){if(window.ldTapToken)window.ldTapToken(o.userData.tok.pl,o.userData.tok.i);return;}}});
 LD=ctx;
 let last=performance.now();
 function update(dt){
  ctx.t+=dt;
  for(let i=ctx.tw.length-1;i>=0;i--){const a=ctx.tw[i];a.t+=dt;const k=Math.min(1,a.t/a.d);a.fn(k);if(k>=1){ctx.tw.splice(i,1);if(a.done)a.done();}}
  ctx.tok.forEach(function(t){if(t.hl){t.ring.visible=true;t.ring.scale.setScalar(1+Math.sin(ctx.t*6)*.12);t.g.position.y=t.y0+Math.abs(Math.sin(ctx.t*5))*.12;t.was=true;}else{t.ring.visible=false;if(t.was){t.was=false;t.g.position.y=t.y0;}}});
  if(!ctx.dieBusy){die.rotateOnWorldAxis(new THREE.Vector3(0,1,0),dt*.6);die.position.y=.8+Math.sin(ctx.t*2)*.06;}
  ctx.ticks.forEach(function(f){f(dt);});
  const c=ctx.cam;c.R=Math.max(21,22.5/Math.max(.4,camera.aspect));camera.position.set(Math.sin(c.th)*Math.sin(c.ph)*c.R,Math.cos(c.ph)*c.R,Math.cos(c.th)*Math.sin(c.ph)*c.R);camera.lookAt(0,0,.4);}
 (function loop(){ctx.raf=requestAnimationFrame(loop);const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;update(dt);renderer.render(scene,camera);})();
 ctx.step=function(sec){for(let t=0;t<sec;t+=1/60)update(1/60);};
 return ctx;}
function tween(d,fn,done){LD.tw.push({t:0,d:d,fn:fn,done:done});}
function pawn(col){
 const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:col,roughness:.28,metalness:.05});
 const prof=[[0,0],[.26,0],[.28,.05],[.2,.14],[.13,.3],[.17,.36],[.17,.42],[.1,.46],[0,.46]].map(function(p){return new THREE.Vector2(p[0],p[1]);});
 const body=new THREE.Mesh(new THREE.LatheGeometry(prof,22),m);body.castShadow=true;g.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.17,18,14),m);head.position.y=.6;head.castShadow=true;g.add(head);
 const shine=new THREE.Mesh(new THREE.SphereGeometry(.04,8,6),new THREE.MeshBasicMaterial({color:"#fff",transparent:true,opacity:.7}));shine.position.set(-.07,.66,.1);g.add(shine);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.4,.05,8,28),new THREE.MeshBasicMaterial({color:"#FDE047"}));ring.rotation.x=Math.PI/2;ring.position.y=.05;ring.visible=false;g.add(ring);
 return{g:g,ring:ring};}
function worldOf(seat,p,ti){const cp=seatCells(seat,p,ti);return[cp[1]-7,cp[0]-7];}

/* ---------- juego ---------- */
const LDG=window.LDG={timers:[]};
function later(fn,ms){const t=setTimeout(fn,ms/(LDG.speed||1));LDG.timers.push(t);return t;}
function seatsFor(n){return n===1?[ME,1]:n===2?[ME,0,1]:[ME,0,1,2];}
function newGame(){
 const cfg=LDCFG,seats=seatsFor(cfg.rivals),names={0:"Rayo",1:"Luna",2:"Pepa",3:"TÚ"};
 const G=LDG.G={pl:seats.map(function(s,i){return{seat:s,me:s===ME,name:s===ME?"TÚ":names[s],helpers:0,toks:[]};}),cur:0,state:"wait",die:null,round:1,chRound:0,over:false,ntok:cfg.tokens,firstOk:0,qs:0,caps:0,tipsShown:{}};
 /* orden de turno: azul primero, luego sentido del reloj (rojo→verde→amarillo→azul): ordenar por asiento empezando en el jugador */
 const order=[ME,0,1,2].filter(function(s){return seats.indexOf(s)>=0;});G.pl.sort(function(a,b){return order.indexOf(a.seat)-order.indexOf(b.seat);});
 G.pl.forEach(function(pl,pi){for(let i=0;i<G.ntok;i++){const pw=pawn(SEATS[pl.seat].col),tk={pl:pi,i:i,p:-1,g:pw.g,ring:pw.ring,hl:false,y0:.2};pw.g.userData.tok={pl:pi,i:i};
  const wp=worldOf(pl.seat,-1,i===1&&G.ntok===2?3:i);pw.g.position.set(wp[0],.2,wp[1]);tk.slot=i===1&&G.ntok===2?3:i;LD.scene.add(pw.g);LD.tok.push(tk);pl.toks.push(tk);}});
 return G;}
function coach(t,tone){const e=document.getElementById("ldCoach");if(e){e.innerHTML=t;e.style.background=tone==="good"?"#DCFCE7":tone==="warn"?"#FEF3C7":"#EEF2FF";}}
function ldChips(){
 const G=LDG.G,e=document.getElementById("ldChips");if(!G||!e)return;
 e.innerHTML=G.pl.map(function(pl,i){const home=pl.toks.filter(function(t){return t.p===-1;}).length,fin=pl.toks.filter(function(t){return t.p===FIN;}).length,on=i===G.cur&&!G.over;
  return '<div style="flex:1;min-width:72px;padding:4px 6px;border-radius:12px;border:3px solid '+(on?SEATS[pl.seat].col:"#E2E8F0")+';background:'+(on?"#fff":"#F8FAFC")+';font-size:.72rem;font-weight:700;line-height:1.3;text-align:center"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:'+SEATS[pl.seat].col+'"></span> '+pl.name+'<br>🏠'+home+' 🏁'+fin+(pl.helpers?' 🪄'+pl.helpers:'')+'</div>';}).join("");
 const b=document.getElementById("ldRoll"),g=document.getElementById("ldGold"),cur=G.pl[G.cur];
 if(b){b.disabled=!(cur&&cur.me&&G.state==="roll"&&!G.over);b.style.opacity=b.disabled?.5:1;}
 if(g){const show=cur&&cur.me&&G.state==="roll"&&cur.helpers>0&&!G.over;g.style.display=show?"block":"none";g.textContent="🪄 Dado dorado ("+(cur?cur.helpers:0)+")";}}
function movable(pl,v){const out=[];pl.toks.forEach(function(t,i){if(t.p===-1){if(v===6)out.push(i);}else if(t.p>=0&&t.p<FIN&&t.p+v<=FIN)out.push(i);});return out;}
function turnStart(){
 const G=LDG.G;if(!G||G.over)return;const pl=G.pl[G.cur];G.state="roll";G.die=null;
 LD.tok.forEach(function(t){t.hl=false;});
 if(pl.me&&G.round>=2&&G.round%3===2&&G.chRound!==G.round){G.chRound=G.round;G.pl.forEach(function(x){if(!x.me&&Math.random()<.55)x.helpers++;});ldChallenge();return;}
 ldChips();
 if(pl.me)coach("🎲 <b>Tu turno.</b> Toca el dado o el botón para tirar."+(G.round===1&&!G.tipsShown.first?" <br><span style='font-size:.85rem'>Necesitas un <b>6</b> para sacar una ficha de casa 🏠</span>":""));
 else{coach("Turno de <b>"+pl.name+"</b>… 🤔");later(botTurn,900);}}
function nextTurn(){
 const G=LDG.G;if(!G||G.over)return;
 G.cur=(G.cur+1)%G.pl.length;if(G.cur===0)G.round++;turnStart();}
function rollDie(v,done){
 const die=LD.die;LD.dieBusy=true;
 const q0=die.quaternion.clone(),axis=new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),spins=3+Math.random()*2;
 const fin=new THREE.Quaternion();
 const E={1:[0,0,0],6:[Math.PI,0,0],3:[0,0,Math.PI/2],4:[0,0,-Math.PI/2],2:[-Math.PI/2,0,0],5:[Math.PI/2,0,0]}[v];fin.setFromEuler(new THREE.Euler(E[0],E[1],E[2]));
 if(window.sOK&&!muted0())beep0();
 tween(.95,function(k){const e=1-Math.pow(1-k,3),qs=new THREE.Quaternion().setFromAxisAngle(axis,spins*Math.PI*2*(1-e));die.quaternion.copy(fin).premultiply(qs);die.position.y=.8+Math.abs(Math.sin(k*Math.PI*3))*(1-k)*1.6;},function(){die.quaternion.copy(fin);die.position.y=.8;LD.dieBusy=false;if(done)done();});}
function muted0(){try{return typeof muted==="function"&&muted();}catch(e){return false;}}
function beep0(){try{if(typeof beep==="function")beep(500,.05);}catch(e){}}
function ldTapDie(){const G=LDG.G;if(G&&G.state==="roll"&&G.pl[G.cur].me&&!G.over)ldRoll();}
function ldRoll(v){
 const G=LDG.G;if(!G||G.state!=="roll"||G.over||!G.pl[G.cur].me)return;
 G.state="rolling";ldChips();hideGold();
 const val=v||1+Math.floor(Math.random()*6);G.die=val;coach("🎲 …");
 rollDie(val,function(){onRolled(val);});}
function ldGold(){
 const G=LDG.G;if(!G||G.state!=="roll"||!G.pl[G.cur].me||G.pl[G.cur].helpers<1)return;
 const pn=document.getElementById("ldSheet");if(!pn)return;
 pn.style.cssText=sheetCss();
 pn.innerHTML='<div class="card center" style="margin:4px 0"><b>🪄 Dado dorado: ¡elige el número que quieras!</b><div style="font-size:.85rem;margin-top:4px">Piensa cuál te conviene: sacar ficha (6), comer a un rival o llegar al centro.</div></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">'+[1,2,3,4,5,6].map(function(n){return '<button class="kbtn yellow" style="margin:0;font-size:1.8rem;min-height:62px" onclick="ldPickGold('+n+')">'+n+'</button>';}).join("")+'</div><button class="kbtn white" style="margin-top:8px" onclick="ldCloseSheet()">Cancelar</button>';}
function ldPickGold(n){const G=LDG.G;if(!G)return;G.pl[G.cur].helpers--;ldCloseSheet();ldRoll(n);}
function hideGold(){const g=document.getElementById("ldGold");if(g)g.style.display="none";}
function sheetCss(){return"position:fixed;left:0;right:0;bottom:0;z-index:60;max-height:68vh;overflow:auto;background:#F8FAFC;padding:8px 14px 18px;border-radius:22px 22px 0 0;box-shadow:0 -8px 26px rgba(0,0,0,.28);max-width:600px;margin:0 auto";}
function ldCloseSheet(){const pn=document.getElementById("ldSheet");if(pn){pn.innerHTML="";pn.style.cssText="";}}
function onRolled(v){
 const G=LDG.G;if(!G||G.over)return;const pl=G.pl[G.cur],mv=movable(pl,v);
 if(!mv.length){
  coach((pl.me?"No puedes mover con un <b>"+v+"</b>":"<b>"+pl.name+"</b> sacó "+v+" y no puede mover")+". ¡Se pasa el turno! "+(pl.me&&pl.toks.every(function(t){return t.p===-1;})?"(Todas tus fichas están en casa: necesitas un 6 🏠)":""),"warn");
  later(function(){nextTurn();},1300);return;}
 if(!pl.me){later(function(){botChoose(pl,mv,v);},700);return;}
 G.state="choose";LD.tok.forEach(function(t){t.hl=false;});mv.forEach(function(i){pl.toks[i].hl=true;});
 const why=pl.toks.some(function(t){return t.p===-1;})&&v===6?"¡Sacaste un <b>6</b>! Puedes sacar una ficha de casa 🏠 o mover otra.":"Sacaste un <b>"+v+"</b>. Toca una ficha que brilla ✨ para avanzar "+v+" casillas.";
 coach(why,"good");
 if(mv.length===1){later(function(){if(G.state==="choose"&&G.pl[G.cur]===pl)ldChoose(pl,mv[0],v);},1000);coach(why+"<br><span style='font-size:.85rem'>Solo puedes mover esta ficha 👍</span>","good");}
 ldChips();}
function ldTapToken(pi,ti){const G=LDG.G;if(!G||G.state!=="choose")return;const pl=G.pl[G.cur];if(!pl.me||pi!==G.cur)return;if(!pl.toks[ti].hl){coach("Esa ficha no puede moverse ahora. Toca una que <b>brille</b> ✨","warn");sNO();return;}ldChoose(pl,ti,G.die);}
/* mover una ficha paso a paso */
function ldChoose(pl,ti,v){
 const G=LDG.G;if(!G||G.over)return;G.state="moving";LD.tok.forEach(function(t){t.hl=false;});ldChips();
 const tk=pl.toks[ti],seat=pl.seat,from=tk.p;let steps=[];
 if(from===-1){steps=[0];}else{for(let k=1;k<=v;k++)steps.push(from+k);}
 let i=0;
 (function hop(){
  if(i>=steps.length){return afterMove(pl,tk,v);}
  const p=steps[i],a=tk.g.position.clone(),w=worldOf(seat,p,tk.slot),y1=.2+(p>=0?0:0);i++;
  tween(from===-1?.5:.2,function(k){tk.g.position.set(a.x+(w[0]-a.x)*k,.2+Math.sin(k*Math.PI)*(from===-1?.9:.35),a.z+(w[1]-a.z)*k);},function(){tk.p=p;tk.g.position.set(w[0],.2,w[1]);if(window.sOK&&!muted0())beep0();hop();});})();}
function ldSpread(){ /* si varias fichas comparten casilla, se acomodan un poco */
 const G=LDG.G;if(!G)return;const by={};
 G.pl.forEach(function(pl){pl.toks.forEach(function(t){if(t.p<0)return;const c=seatCells(pl.seat,t.p,t.slot),k=c[0]+","+c[1];(by[k]=by[k]||[]).push(t);});});
 Object.keys(by).forEach(function(k){const l=by[k];l.forEach(function(t,i){const pl=G.pl[t.pl],w=worldOf(pl.seat,t.p,t.slot),off=l.length>1?(i-(l.length-1)/2)*.28:0;t.g.position.x=w[0]+off;t.g.position.z=w[1]+(l.length>1?.12*(i%2?1:-1):0);});});}
function afterMove(pl,tk,v){
 const G=LDG.G;if(!G||G.over)return;let msg="",tone="";
 /* ¿comió a alguien? */
 if(tk.p>=0&&tk.p<=50){const idx=(SEATS[pl.seat].off+tk.p)%52;
  if(!SAFE.has(idx)){
   G.pl.forEach(function(o,oi){if(oi===G.cur)return;o.toks.forEach(function(t){if(t.p>=0&&t.p<=50&&(SEATS[o.seat].off+t.p)%52===idx){
    t.p=-1;const w=worldOf(o.seat,-1,t.slot),a=t.g.position.clone();tween(.7,function(k){t.g.position.set(a.x+(w[0]-a.x)*k,.2+Math.sin(k*Math.PI)*2.2,a.z+(w[1]-a.z)*k);});
    msg="💥 ¡<b>"+pl.name+"</b> se comió una ficha de <b>"+o.name+"</b>! Vuelve a su casa 🏠";tone=pl.me?"good":"warn";G.caps++;if(pl.me){pl.helpers++;msg+=" · ¡ganaste un 🪄!";confetti(10);}}});});}
  else if(!msg&&SAFE.has(idx))msg=pl.me?"⭐ Casilla segura: aquí nadie puede comerte.":"";}
 if(tk.p===FIN){msg="🏁 ¡<b>"+pl.name+"</b> llegó al centro con una ficha!";tone="good";if(pl.me)confetti(14);}
 ldSpread();
 if(pl.toks.every(function(t){return t.p===FIN;})){return ldEnd(pl);}
 if(msg)coach(msg,tone);
 const again=v===6;
 later(function(){
  if(again){G.state="roll";G.die=null;ldChips();if(pl.me)coach("🎲 ¡Sacaste 6! <b>Tiras otra vez.</b>","good");else{coach("<b>"+pl.name+"</b> tira otra vez (sacó 6) 🎲");later(botTurn,800);}}
  else nextTurn();},msg?1500:700);}
/* ---------- bots ---------- */
function botScore(pl,i,v){
 const t=pl.toks[i],G=LDG.G;let s=0;const np=t.p===-1?0:t.p+v;
 if(np===FIN)s+=100;
 if(t.p===-1)s+=45;
 if(np>=0&&np<=50){const idx=(SEATS[pl.seat].off+np)%52;
  if(SAFE.has(idx))s+=18;
  else G.pl.forEach(function(o,oi){if(o===pl)return;o.toks.forEach(function(x){if(x.p>=0&&x.p<=50&&(SEATS[o.seat].off+x.p)%52===idx)s+=70;
    /* peligro: un rival a 1-6 casillas detrás */
    else if(x.p>=0&&x.p<=50){const d=(idx-(SEATS[o.seat].off+x.p)%52+52)%52;if(d>=1&&d<=6)s-=12;}});});}
 if(np>50)s+=25;
 s+=np/8+Math.random()*4;return s;}
function botTurn(){
 const G=LDG.G;if(!G||G.over)return;const pl=G.pl[G.cur];if(pl.me||G.state==="rolling"||G.state==="moving")return;
 let v=1+Math.floor(Math.random()*6);
 if(pl.helpers>0){let bestV=0,bs=0;for(let x=1;x<=6;x++){movable(pl,x).forEach(function(i){const sc=botScore(pl,i,x);if(sc>bs){bs=sc;bestV=x;}});}if(bs>=95){v=bestV;pl.helpers--;coach("<b>"+pl.name+"</b> usa un 🪄 dado dorado…");}}
 G.state="rolling";G.die=v;rollDie(v,function(){onRolled(v);});}
function botChoose(pl,mv,v){
 let best=mv[0],bs=-1e9;mv.forEach(function(i){const s=botScore(pl,i,v);if(s>bs){bs=s;best=i;}});
 coach("<b>"+pl.name+"</b> sacó <b>"+v+"</b> y mueve una ficha.");ldChoose(pl,best,v);}
/* ---------- reto relámpago ---------- */
function ldChallenge(){
 const G=LDG.G,pn=document.getElementById("ldSheet");if(!pn){turnStart();return;}
 const q=typeof wrlQ==="function"?wrlQ({topic:"mix",lv:1},null):null;if(!q){ldChips();coach("🎲 Tu turno.");return;}
 G.q={q:q,wrong:0,t0:Date.now()};G.state="quiz";ldChips();
 pn.style.cssText=sheetCss();
 pn.innerHTML='<div class="card" style="border:3px solid #F97316;margin-top:6px"><b style="font-size:.9rem">⚡ ¡Reto relámpago! Acierta y ganas un 🪄 dado dorado</b>'+wrlQHTML(q)+'<div style="text-align:center"><button class="speaker small" onclick="wrlSayQ(LDG.G.q.q)">🔊 '+(q.lang==="en"?"Listen":"Léemelo")+'</button></div></div>'
  +'<div style="display:grid;grid-template-columns:'+(q.ops.length>2&&q.ops.every(function(o){return String(o.t).length<14;})?"1fr 1fr":"1fr")+';gap:8px">'+q.ops.map(function(o,i){return '<button class="kbtn white" id="ldO'+i+'" style="margin:0;min-height:54px;font-size:'+(q.big?"2.2rem":"1.1rem")+'" onclick="ldAns('+i+')">'+esc(o.t)+'</button>';}).join("")+'</div><div id="ldHint"></div><button class="kbtn white" style="min-height:42px;font-size:.85rem;margin-top:8px" onclick="ldSkipQ()">Ahora no, seguir jugando</button>';
 coach("⚡ <b>¡Reto relámpago!</b> Responde para ganar un 🪄 (o sigue sin responder).");
 later(function(){if(LDG.G&&LDG.G.state==="quiz")wrlSayQ(q);},350);}
function ldAns(i){
 const G=LDG.G;if(!G||!G.q)return;const Q=G.q,o=Q.q.ops[i],b=document.getElementById("ldO"+i),first=Q.wrong===0;
 if(o.ok){recordAnswer(Q.q.subj||"Mate",first,Math.round((Date.now()-Q.t0)/1000));if(Q.q.topicKey&&typeof recordTopic==="function")recordTopic(Q.q.topicKey,first);
  G.qs++;if(first)G.firstOk++;if(b)b.style.background="#86EFAC";sOK();confetti(first?10:4);
  const pl=G.pl.find(function(x){return x.me;});pl.helpers++;G.q=null;
  later(function(){ldCloseSheet();coach("🪄 ¡Correcto! Ganaste un <b>dado dorado</b>. Úsalo antes de tirar para elegir tu número.","good");ldChips();later(function(){G.state="roll";turnStart2();},900);},700);}
 else{Q.wrong++;recordAnswer(Q.q.subj||"Mate",false,5);if(Q.q.topicKey&&typeof recordTopic==="function")recordTopic(Q.q.topicKey,false);sNO();if(b){b.style.background="#FCA5A5";b.disabled=true;}
  const h=document.getElementById("ldHint");if(h)h.innerHTML='<p style="text-align:center;font-weight:700;margin-top:8px">Casi… 🤔 '+(Q.wrong>=2?'<span style="color:#7C3AED">Pista: '+esc(Q.q.hint)+'</span>':'Inténtalo otra vez.')+'</p>';}}
function ldSkipQ(){const G=LDG.G;if(!G)return;G.q=null;ldCloseSheet();G.state="roll";turnStart2();}
function turnStart2(){const G=LDG.G;if(!G||G.over)return;ldChips();coach("🎲 <b>Tu turno.</b> Toca el dado o el botón para tirar.");}
function ldEnd(pl){
 const G=LDG.G;G.over=true;G.state="over";ldChips();
 const prog=function(x){return x.toks.reduce(function(a,t){return a+(t.p<0?0:t.p+1);},0);};
 const rank=G.pl.slice().sort(function(a,b){return (b===pl?1e6:prog(b))-(a===pl?1e6:prog(a));});
 const mine=rank.findIndex(function(x){return x.me;})+1,stars=mine===1?3:mine===2?2:1;
 const p=prof();if(!p.ludoWins)p.ludoWins=0;if(mine===1)p.ludoWins++;p.ludoGames=(p.ludoGames||0)+1;save();
 coach(mine===1?"🏆 <b>¡Ganaste la partida!</b> Eres un campeón de Ludo.":"🏁 <b>"+pl.name+"</b> ganó. ¡Tú quedaste "+mine+".º! Cada partida aprendes más.","good");
 later(function(){const pn=document.getElementById("ldSheet");if(!pn)return;pn.style.cssText=sheetCss();
  pn.innerHTML='<div class="card center"><div style="font-family:Fredoka;font-weight:800;font-size:1.3rem">'+(mine===1?'🏆 ¡Campeón de Ludo!':'🏅 ¡Buena partida!')+'</div>'
   +'<div style="margin:8px auto;max-width:260px;text-align:left">'+rank.map(function(x,i){return '<div style="display:flex;gap:8px;align-items:center;padding:3px 0;font-weight:'+(x.me?800:600)+'"><span style="font-size:1.2rem">'+["🥇","🥈","🥉","4️⃣"][i]+'</span><span style="width:12px;height:12px;border-radius:50%;background:'+SEATS[x.seat].col+'"></span>'+x.name+'</div>';}).join("")+'</div>'
   +'<p style="font-size:.9rem">⚡ Retos: <b>'+G.firstOk+'</b> a la primera de '+G.qs+' · 💥 Fichas comidas: <b>'+G.caps+'</b></p></div>'
   +'<button class="kbtn green" onclick="ldFinish('+stars+')">Continuar ➜</button><button class="kbtn yellow" onclick="ldCloseSheet();ldStart()">🔁 Otra partida</button>';},1600);}
function ldFinish(stars){nodeWin(stars,"Ludo",{noWorld:true,replay:"screenLudo()",replayLabel:"Jugar otra vez 🎲",backFn:"screenWorlds()",backLabel:"Mundos y carreras 🏁"});}

/* ---------- pantallas ---------- */
function screenLudo(){setTheme("kid");
 ldCleanup();disposeLudo();
 const chip=function(on,onclick,t){return '<button onclick="'+onclick+'" style="margin:3px;padding:9px 14px;border-radius:14px;border:3px solid '+(on?"#7C3AED":"#E2E8F0")+';background:'+(on?"#EDE9FE":"#fff")+';font-weight:700;cursor:pointer;color:#1E293B;font-size:.95rem">'+t+'</button>';};
 const p=prof();
 render(topbar("screenWorlds()")+subHeader("🎲 Ludo con retos")
  +'<div class="card" style="background:linear-gradient(135deg,#EDE9FE,#FEF9C3);font-size:.92rem;line-height:1.5"><b>🎲 ¡Aprende a jugar Ludo!</b> Un entrenador te dice qué hacer en cada turno. Cada 3 rondas llega un <b>reto relámpago ⚡</b>: acierta y ganas un <b>🪄 dado dorado</b> para elegir tu número.'+(p.ludoWins?'<br><span class="mut">Partidas ganadas: <b>'+p.ludoWins+'</b> 🏆</span>':'')+'</div>'
  +'<div class="card"><b>¿Contra cuántos rivales?</b><div>'+[1,2,3].map(function(n){return chip(LDCFG.rivals===n,"LDCFG_set('rivals',"+n+")",n+" 🤖");}).join("")+'</div>'
  +'<b style="display:block;margin-top:8px">¿Cuántas fichas cada uno?</b><div>'+[[2,"2 (rápido)"],[4,"4 (clásico)"]].map(function(x){return chip(LDCFG.tokens===x[0],"LDCFG_set('tokens',"+x[0]+")",x[1]);}).join("")+'</div></div>'
  +'<button class="kbtn green" onclick="ldStart()">🎲 ¡A jugar!</button><button class="kbtn white" onclick="ldRules()">📖 Cómo se juega</button>');}
function LDCFG_set(k,v){LDCFG[k]=v;screenLudo();}
function ldRules(){setTheme("kid");
 render(topbar("screenLudo()")+subHeader("📖 Cómo se juega Ludo")
  +'<div class="card" style="line-height:1.7;font-size:.98rem"><p>1️⃣ <b>Tira el dado</b> 🎲 por turnos.</p><p>2️⃣ Con un <b>6</b> sacas una ficha de tu casa 🏠 y <b>tiras otra vez</b>.</p><p>3️⃣ Las fichas avanzan <b>en el sentido del reloj</b> ⟳ dando la vuelta al tablero.</p><p>4️⃣ Si caes en una ficha rival 💥 ¡la mandas a su casa! <b>Menos</b> en las casillas seguras: las de ⭐ y las de color de salida.</p><p>5️⃣ Al terminar la vuelta, tu ficha sube por <b>su camino de color</b> hasta el centro. Necesitas el <b>número justo</b> para llegar.</p><p>6️⃣ <b>Gana</b> quien lleva todas sus fichas al centro 🏁.</p><p>⚡ Cada 3 rondas hay un <b>reto relámpago</b>: si aciertas, ganas un 🪄 <b>dado dorado</b> (eliges el número). ¡Y si comes una ficha, también ganas uno!</p></div><button class="kbtn green" onclick="screenLudo()">Entendido 👍</button>');}
function ldStart(){setTheme("kid");
 ldCleanup();
 render(topbar("screenLudo()")
  +'<div id="ldChips" style="display:flex;gap:5px;margin-bottom:6px"></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="ldCanvas" style="width:100%;height:clamp(300px,50vh,480px)"></div></div>'
  +'<div id="ldCoach" class="card" style="margin:6px 0;padding:8px 12px;font-size:.95rem;line-height:1.45;min-height:3.2em"></div>'
  +'<div style="display:flex;gap:8px"><button id="ldRoll" class="kbtn green" style="margin:0;flex:3;font-size:1.2rem" onclick="ldRoll()">🎲 Tirar el dado</button><button class="kbtn white" style="margin:0;flex:1;min-height:0;font-size:.85rem" onclick="ldRules2()">📖</button></div>'
  +'<button id="ldGold" class="kbtn yellow" style="display:none;margin-top:6px" onclick="ldGold()">🪄 Dado dorado</button>'
  +'<div id="ldSheet"></div>');
 const c=ldBuild("ldCanvas");if(!c)return;
 newGame();ldChips();turnStart();}
function ldRules2(){const pn=document.getElementById("ldSheet");if(!pn)return;pn.style.cssText=sheetCss();
 pn.innerHTML='<div class="card" style="line-height:1.6;font-size:.95rem"><b>📖 Resumen</b><br>🎲 Tira · 6 = sacas ficha y repites · ⟳ sentido del reloj · 💥 comes fichas rivales (no en ⭐ ni en salidas de color) · número justo para llegar al centro 🏁 · ⚡ acierta retos para ganar 🪄</div><button class="kbtn green" onclick="ldCloseSheet()">Seguir jugando</button>';}
window.screenLudo=screenLudo;window.ldStart=ldStart;window.ldRoll=ldRoll;window.ldGold=ldGold;window.ldPickGold=ldPickGold;window.ldCloseSheet=ldCloseSheet;window.ldAns=ldAns;window.ldSkipQ=ldSkipQ;window.ldFinish=ldFinish;window.ldRules=ldRules;window.ldRules2=ldRules2;window.LDCFG_set=LDCFG_set;window.ldTapDie=ldTapDie;window.ldTapToken=ldTapToken;window.disposeLudo=disposeLudo;window.ldCleanup=ldCleanup;
window.LD_DEBUG=function(){return{LD:LD,G:LDG.G,step:function(s){if(LD)LD.step(s);},TRACK:TRACK};};
