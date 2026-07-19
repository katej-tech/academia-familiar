"use strict";
/* ============ JUEGOS v8: Rompecabezas deslizante + Carrera Obby (estilo Roblox) ============ */

/* ---- ROMPECABEZAS DESLIZANTE (15-puzzle, lógica espacial y orden) ---- */
let SL={};
function gameSlide(){setTheme("kid");SL={n:3,moves:0,tiles:[]};slideNew();}
function slideSolved(a){for(let i=0;i<a.length-1;i++)if(a[i]!==i+1)return false;return a[a.length-1]===0;}
function slideSolvable(a){var inv=0,f=a.filter(x=>x);for(var i=0;i<f.length;i++)for(var j=i+1;j<f.length;j++)if(f[i]>f[j])inv++;return inv%2===0;} // n impar: resoluble si inversiones pares
function slideNew(){
 const n=SL.n,N=n*n;let a;
 do{a=[];for(let i=1;i<N;i++)a.push(i);a.push(0);a=shuffled(a);}while(!slideSolvable(a)||slideSolved(a));
 SL.tiles=a;SL.moves=0;slideRender();}
function slideColor(t){return 'linear-gradient(180deg,hsl('+((t*47)%360)+',75%,62%),hsl('+((t*47)%360)+',75%,50%))';}
function slideTap(i){
 const n=SL.n,z=SL.tiles.indexOf(0);
 const zr=Math.floor(z/n),zc=z%n,ir=Math.floor(i/n),ic=i%n;
 if((Math.abs(zr-ir)===1&&zc===ic)||(Math.abs(zc-ic)===1&&zr===ir)){
  SL.tiles[z]=SL.tiles[i];SL.tiles[i]=0;SL.moves++;if(typeof tone==="function")tone(460,.07);
  if(slideSolved(SL.tiles)){sWIN();confetti(30);recordAnswer("Lógica",true,10);slideRender();
   const st=SL.moves<20?3:SL.moves<35?2:1;return setTimeout(()=>nodeWin(st,"Lógica"),1200);}
  slideRender();}}
function slideRender(){
 const n=SL.n,solved=slideSolved(SL.tiles);
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:4px">🧩 Rompecabezas deslizante</h2>'
 +'<p class="center" style="font-size:.95rem;margin-bottom:12px">'+(solved?'🎉 ¡Lo lograste!':'Desliza las fichas para ordenar del 1 al '+(n*n-1))+'</p>'
 +'<div style="display:grid;grid-template-columns:repeat('+n+',1fr);gap:8px;max-width:300px;margin:0 auto;background:rgba(30,42,74,.08);padding:8px;border-radius:20px">'
 +SL.tiles.map((t,i)=>t===0
   ?'<div style="aspect-ratio:1;border-radius:14px;background:transparent"></div>'
   :'<button onclick="slideTap('+i+')" style="aspect-ratio:1;border-radius:14px;border:4px solid var(--kid-ink);background:'+slideColor(t)+';box-shadow:0 5px 0 rgba(30,42,74,.5);font-family:Fredoka;font-weight:800;font-size:clamp(1.6rem,9vw,2.4rem);color:#fff;text-shadow:0 2px 3px rgba(0,0,0,.25)">'+t+'</button>').join("")
 +'</div>'
 +'<p class="center" style="margin-top:12px;font-family:Fredoka;font-weight:700">Movimientos: '+SL.moves+'</p>'
 +'<button class="kbtn white" onclick="slideNew()">🔀 Revolver otra vez</button>');}

/* ---- CARRERA OBBY (estilo Roblox: avanza saltando si respondes bien) ---- */
const OBBY_LEN=8;
let OB={};
function gameObby(modo){setTheme("kid");
 OB={pos:0,lives:3,modo:modo||"mate",ok:0};
 nextObby();}
function obbyQuestion(){
 if(OB.modo==="en"){const w=pick(Object.values(EN_VOCAB).flat());
  const wrong=shuffled(Object.values(EN_VOCAB).flat().filter(x=>x[1]!==w[1])).slice(0,2).map(x=>x[1]);
  const ops=shuffled([w[1],...wrong]);
  return{q:'¿Qué significa "'+w[0]+'"?',pic:w[2],ops,a:ops.indexOf(w[1]),en:w[0]};}
 const resta=Math.random()<.5;let a,b,ans;
 if(resta){a=5+rnd(15);b=1+rnd(a-1);ans=a-b;OB.q=a+" − "+b;}
 else{a=1+rnd(12);b=1+rnd(12);ans=a+b;OB.q=a+" + "+b;}
 const set=new Set([ans]);while(set.size<3){const d=ans+(1+rnd(4))*(Math.random()<.5?-1:1);if(d>=0)set.add(d);}
 const ops=shuffled([...set]).map(String);
 return{q:(a+(resta?" − ":" + ")+b)+" = ?",ops,a:ops.indexOf(String(ans))};}
function nextObby(){
 if(OB.pos>=OBBY_LEN){confetti(34);sWIN();return nodeWin(OB.lives>=3?3:OB.lives>=2?2:1,OB.modo==="en"?"Inglés":"Mate");}
 if(OB.lives<=0){return nodeWin(1,OB.modo==="en"?"Inglés":"Mate");}
 const Q=obbyQuestion();OB.cur=Q;
 // pista de plataformas: 🟩 pisadas, 🟦 actual, ⬜ por venir, 🏁 meta; lava entre medio
 let track="";
 for(let i=0;i<=OBBY_LEN;i++){
  if(i===OBBY_LEN)track+="🏁";
  else if(i<OB.pos)track+="🟩";
  else if(i===OB.pos)track+="🟦";
  else track+="⬜";}
 const runner="🧍".padStart(1);
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🏃 Carrera de obstáculos</h2>'
 +'<p class="center" style="font-size:.92rem;margin-bottom:8px">Responde bien para SALTAR a la siguiente plataforma. ¡Llega a la 🏁!</p>'
 +'<div style="display:flex;justify-content:center;gap:8px;margin-bottom:6px"><span class="pill">'+"❤️".repeat(OB.lives)+'</span><span class="pill">🏁 '+OB.pos+'/'+OBBY_LEN+'</span></div>'
 +'<div class="card" style="overflow-x:auto;white-space:nowrap;font-size:clamp(1.6rem,8vw,2.4rem);text-align:center;letter-spacing:2px">'
 +'<div>'+" ".repeat(0)+'<span style="position:relative">'+track+'</span></div>'
 +'<div style="font-size:clamp(1.6rem,8vw,2.2rem)">'+"  ".repeat(OB.pos)+'🏃</div></div>'
 +(Q.pic?'<div class="bigpic">'+Q.pic+'</div>':'')
 +'<div class="bigq center">'+esc(Q.q)+'</div>'
 +(Q.en&&hasVoice()?'<button class="speaker small" onclick="speakEN(\''+Q.en+'\')">🔊 '+Q.en+'</button>':'')
 +'<div class="choices2">'+Q.ops.map((o,k)=>'<button class="kbtn white" onclick="ansObby('+k+')">'+esc(o)+'</button>').join("")+'</div>');
 if(Q.en&&hasVoice())setTimeout(()=>speakEN(Q.en),300);}
function ansObby(k){
 const ok=k===OB.cur.a;
 recordAnswer(OB.modo==="en"?"Inglés":"Mate",ok,12);
 if(ok){OB.pos++;OB.ok++;sOK();confetti(8);if(OB.cur.en)speakEN(OB.cur.en);toast("¡Salto! 🦘",true,800);}
 else{OB.lives--;sNO();toast(OB.lives>0?"¡Casi caes! ❤️ -1":"¡Uy!",false,1200);}
 setTimeout(nextObby,ok?800:1250);}

/* ---- APRENDE LA HORA (reloj analógico) ---- */
function clockSVG(h,m,px){
 const cx=60,cy=60;let ticks="";
 for(let i=1;i<=12;i++){
  const a=i*30*Math.PI/180;
  const x1=cx+44*Math.sin(a),y1=cy-44*Math.cos(a),x2=cx+50*Math.sin(a),y2=cy-50*Math.cos(a);
  const lx=cx+37*Math.sin(a),ly=cy-37*Math.cos(a);
  ticks+='<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="#1E2A4A" stroke-width="2"/>';
  ticks+='<text x="'+lx.toFixed(1)+'" y="'+(ly+3.5).toFixed(1)+'" text-anchor="middle" font-size="10" font-family="Fredoka,sans-serif" font-weight="700" fill="#1E2A4A">'+i+'</text>';
 }
 const ma=m*6*Math.PI/180,ha=((h%12)*30+m*0.5)*Math.PI/180;
 const hx=cx+24*Math.sin(ha),hy=cy-24*Math.cos(ha),mx=cx+38*Math.sin(ma),my=cy-38*Math.cos(ma);
 return '<svg viewBox="0 0 120 120" style="width:'+px+'px;height:'+px+'px;display:block;margin:0 auto">'
  +'<circle cx="60" cy="60" r="56" fill="#FFFEF8" stroke="#1E2A4A" stroke-width="4"/>'+ticks
  +'<line x1="60" y1="60" x2="'+hx.toFixed(1)+'" y2="'+hy.toFixed(1)+'" stroke="#FF6B6B" stroke-width="5" stroke-linecap="round"/>'
  +'<line x1="60" y1="60" x2="'+mx.toFixed(1)+'" y2="'+my.toFixed(1)+'" stroke="#3B82F6" stroke-width="3.5" stroke-linecap="round"/>'
  +'<circle cx="60" cy="60" r="4" fill="#1E2A4A"/></svg>';
}
function timeWords(h,m){const L=h===1?"La ":"Las ";return m===0?(L+h+" en punto"):m===30?(L+h+" y media"):m===15?(L+h+" y cuarto"):(L+h+" y "+m);}
let CL={};
function gameClock(){setTheme("kid");CL={round:0,ok:0,total:6};nextClock();}
function nextClock(){
 if(CL.round>=CL.total)return nodeWin(starsFor(CL.ok,CL.total),"El tiempo");
 const h=1+rnd(12),m=pick([0,0,0,30,30,15]); // sobre todo en punto y media
 CL.h=h;CL.m=m;const correct=timeWords(h,m);
 const set=new Set([correct]);
 let guard=0;
 while(set.size<3&&guard++<40){const hh=1+rnd(12),mm=pick([0,30,15]);set.add(timeWords(hh,mm));}
 const ops=shuffled([...set]);CL.ops=ops;CL.a=ops.indexOf(correct);
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(CL.total,CL.round)+'</div>'
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:4px">🕐 ¿Qué hora es?</h2>'
 +'<p class="center" style="font-size:.82rem;margin-bottom:8px">La aguja <span style="color:#FF6B6B;font-weight:700">roja</span> (corta) marca la HORA, la <span style="color:#3B82F6;font-weight:700">azul</span> (larga) los MINUTOS</p>'
 +'<div class="card" style="padding:14px">'+clockSVG(h,m,200)+'</div>'
 +'<button class="speaker small" onclick="speakES(\''+timeWords(h,m)+'\')">🔊 Pista</button>'
 +'<div class="choices2">'+ops.map((o,k)=>'<button class="kbtn white" style="font-size:1.05rem" onclick="ansClock('+k+')">'+esc(o)+'</button>').join("")+'</div>');}
function ansClock(k){
 const ok=k===CL.a;recordAnswer("El tiempo",ok,15);
 if(ok){sOK();confetti(8);speakES(CL.ops[CL.a]);toast("¡Correcto! 🎉",true,1000);CL.ok++;}
 else{sNO();speakES(CL.ops[CL.a]);toast("Era: "+CL.ops[CL.a],false,1800);}
 CL.round++;setTimeout(nextClock,ok?1100:1900);}

/* ---- LA CULEBRITA (Snake) ---- */
let SN={};
function gameSnake(){setTheme("kid");
 const N=10;
 SN={N,snake:[{x:3,y:5},{x:2,y:5},{x:1,y:5}],dir:{x:1,y:0},nd:{x:1,y:0},food:null,score:0,started:false,timer:null};
 snPlaceFood();
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🐍 La Culebrita</h2>'
 +'<p class="center" style="font-size:.92rem;margin-bottom:6px">Guía la culebra 🟢 con las flechas para comer 🍎. ¡No choques!</p>'
 +'<div id="snscore" class="center" style="font-family:Fredoka;font-weight:700;font-size:1.15rem;margin-bottom:6px">🍎 0</div>'
 +'<div id="snboard" style="max-width:340px;margin:0 auto"></div>'
 +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:230px;margin:12px auto 0">'
 +'<span></span><button class="kbtn blue" style="margin:0;min-height:58px;font-size:1.6rem" onclick="snDir(0,-1)">⬆️</button><span></span>'
 +'<button class="kbtn blue" style="margin:0;min-height:58px;font-size:1.6rem" onclick="snDir(-1,0)">⬅️</button>'
 +'<button class="kbtn blue" style="margin:0;min-height:58px;font-size:1.6rem" onclick="snDir(1,0)">➡️</button>'
 +'<span></span><button class="kbtn blue" style="margin:0;min-height:58px;font-size:1.6rem" onclick="snDir(0,1)">⬇️</button><span></span>'
 +'</div>'
 +'<p class="center mut" style="margin-top:8px;font-size:.85rem">Toca una flecha para empezar 👆</p>');
 drawSnake();}
function snPlaceFood(){const N=SN.N;let f;do{f={x:rnd(N),y:rnd(N)};}while(SN.snake.some(s=>s.x===f.x&&s.y===f.y));SN.food=f;}
function drawSnake(){
 const b=document.getElementById("snboard");if(!b)return;const N=SN.N;let cells="";
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  const isHead=SN.snake[0].x===x&&SN.snake[0].y===y;
  const isBody=!isHead&&SN.snake.some(s=>s.x===x&&s.y===y);
  const isFood=SN.food.x===x&&SN.food.y===y;
  let bg="#EAF2FF",txt="";
  if(isHead){bg="#2E9E5B";txt="👀";}
  else if(isBody){bg="#3EC97C";}
  else if(isFood){txt="🍎";}
  cells+='<div style="aspect-ratio:1;border-radius:6px;background:'+bg+';display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:'+(isBody||isHead?"inset 0 0 0 2px rgba(30,42,74,.25)":"none")+'">'+txt+'</div>';
 }
 b.innerHTML='<div style="display:grid;grid-template-columns:repeat('+N+',1fr);gap:3px;background:#CDE3FF;padding:6px;border-radius:14px;border:4px solid var(--kid-ink)">'+cells+'</div>';
 const sc=document.getElementById("snscore");if(sc)sc.textContent="🍎 "+SN.score;}
function snDir(x,y){
 if(SN.snake.length>1&&SN.dir.x===-x&&SN.dir.y===-y)return; // no reversa
 SN.nd={x,y};
 if(!SN.started)snStart();}
function snStart(){if(SN.started)return;SN.started=true;SN.timer=setInterval(snStep,260);}
function snStep(){
 if(!document.getElementById("snboard")){clearInterval(SN.timer);return;}
 SN.dir=SN.nd;
 const head={x:SN.snake[0].x+SN.dir.x,y:SN.snake[0].y+SN.dir.y};
 const tail=SN.snake[SN.snake.length-1];
 const willEat=head.x===SN.food.x&&head.y===SN.food.y;
 // chocar pared o cuerpo (la cola se mueve si no come)
 const hitSelf=SN.snake.some((s,i)=>s.x===head.x&&s.y===head.y&&!(i===SN.snake.length-1&&!willEat));
 if(head.x<0||head.y<0||head.x>=SN.N||head.y>=SN.N||hitSelf){
  clearInterval(SN.timer);SN.started=false;sNO();recordAnswer("Lógica",SN.score>=3,10);
  toast("💥 ¡Choque! Comiste "+SN.score+" 🍎",false,1600);
  const st=SN.score>=8?3:SN.score>=4?2:1;
  return setTimeout(()=>nodeWin(st,"Lógica"),900);}
 SN.snake.unshift(head);
 if(willEat){SN.score++;beep([700,900],.1);snPlaceFood();}
 else SN.snake.pop();
 drawSnake();}

/* ---- SALTARÍN (estilo Doodle Jump) ---- */
let DJ={};
function gameDoodle(){setTheme("kid");
 const W=300,H=440;
 DJ={W,H,x:W/2,y:H-60,vy:0,move:0,plats:[],score:0,run:true,last:null};
 DJ.plats.push({x:W/2-35,y:H-26,w:70});
 for(let i=1;i<10;i++)DJ.plats.push({x:rnd(W-70),y:H-26-i*46,w:70});
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🦘 Saltarín</h2>'
 +'<p class="center" style="font-size:.9rem;margin-bottom:6px">Mantén los botones para moverte. ¡Salta y sube lo más alto!</p>'
 +'<div id="djscore" class="center" style="font-family:Fredoka;font-weight:700;font-size:1.1rem;margin-bottom:6px">⬆️ 0</div>'
 +'<div id="djwrap" style="position:relative;width:300px;max-width:100%;margin:0 auto;touch-action:none"><canvas id="djcanvas" style="width:100%;display:block;border:4px solid var(--kid-ink);border-radius:16px;box-shadow:0 8px 18px rgba(30,42,74,.25)"></canvas></div>'
 +'<div style="display:flex;gap:12px;max-width:320px;margin:12px auto 0">'
 +'<button class="kbtn blue" style="flex:1;margin:0;min-height:62px" onpointerdown="djMove(-1)" onpointerup="djMove(0)" onpointerleave="djMove(0)">⬅️</button>'
 +'<button class="kbtn blue" style="flex:1;margin:0;min-height:62px" onpointerdown="djMove(1)" onpointerup="djMove(0)" onpointerleave="djMove(0)">➡️</button>'
 +'</div>');
 const cv=document.getElementById("djcanvas");
 const cssW=Math.min(340,cv.clientWidth||300),cssH=Math.round(cssW*H/W);
 const dpr=Math.min(2,window.devicePixelRatio||1);
 cv.style.height=cssH+"px";cv.width=Math.round(cssW*dpr);cv.height=Math.round(cssH*dpr);
 DJ.ctx=cv.getContext("2d");DJ.ctx.scale(dpr*cssW/W,dpr*cssH/H);
 const wrap=document.getElementById("djwrap");
 if(wrap){
  wrap.addEventListener("pointerdown",e=>{const r=wrap.getBoundingClientRect();djMove((e.clientX-r.left)<r.width/2?-1:1);});
  wrap.addEventListener("pointerup",()=>djMove(0));
  wrap.addEventListener("pointerleave",()=>djMove(0));
 }
 djDraw();
 requestAnimationFrame(djLoop);}
function djMove(d){DJ.move=d;}
function djLoop(t){
 if(!document.getElementById("djcanvas")||!DJ.run)return;
 if(DJ.last==null)DJ.last=t;
 let dt=(t-DJ.last)/16.7;if(dt>3)dt=3;if(dt<0)dt=1;DJ.last=t;
 djStep(dt);djDraw();
 if(DJ.run)requestAnimationFrame(djLoop);}
function djStep(dt){
 const W=DJ.W,H=DJ.H;
 DJ.vy+=0.5*dt;
 DJ.x+=DJ.move*5*dt;
 DJ.y+=DJ.vy*dt;
 if(DJ.x<0)DJ.x=W;if(DJ.x>W)DJ.x=0;
 if(DJ.vy>0){for(const p of DJ.plats){if(DJ.x>p.x-6&&DJ.x<p.x+p.w+6&&DJ.y>=p.y-8&&DJ.y<=p.y+12){DJ.vy=-11;break;}}}
 if(DJ.y<H*0.42){const d=(H*0.42-DJ.y);DJ.y=H*0.42;DJ.plats.forEach(p=>p.y+=d);DJ.score+=Math.round(d);}
 DJ.plats=DJ.plats.filter(p=>p.y<H+20);
 while(DJ.plats.length<10){const top=Math.min.apply(null,DJ.plats.map(p=>p.y));DJ.plats.push({x:rnd(W-70),y:top-46,w:70});}
 if(DJ.y>H+30){DJ.run=false;sNO();recordAnswer("Lógica",DJ.score>=200,10);
  const st=DJ.score>=600?3:DJ.score>=250?2:1;setTimeout(()=>nodeWin(st,"Lógica"),200);}}
function djDraw(){
 const c=DJ.ctx;if(!c)return;const W=DJ.W,H=DJ.H;
 // cielo
 c.fillStyle="#DDF2FF";c.fillRect(0,0,W,H);
 c.fillStyle="rgba(255,255,255,.7)";c.beginPath();c.ellipse(W*0.25,H*0.2,26,15,0,0,Math.PI*2);c.ellipse(W*0.75,H*0.45,30,17,0,0,Math.PI*2);c.fill();
 // plataformas
 for(const p of DJ.plats){c.fillStyle="#3EC97C";rrect(c,p.x,p.y,p.w,13,6);c.fill();c.lineWidth=3;c.strokeStyle="#1E2A4A";c.stroke();
  c.fillStyle="rgba(255,255,255,.4)";rrect(c,p.x+4,p.y+2,p.w-8,4,2);c.fill();}
 // rana
 djDrawFrog(c,DJ.x,DJ.y);
 const sc=document.getElementById("djscore");if(sc)sc.textContent="⬆️ "+DJ.score;}
function djDrawFrog(c,x,y){
 const s=17;c.save();c.translate(x,y);
 c.fillStyle="rgba(0,0,0,.15)";c.beginPath();c.ellipse(0,s*0.9,s*0.8,s*0.25,0,0,Math.PI*2);c.fill();
 c.fillStyle="#5BCE6B";c.beginPath();c.ellipse(0,0,s,s*0.82,0,0,Math.PI*2);c.fill();c.lineWidth=2.5;c.strokeStyle="#1E2A4A";c.stroke();
 c.fillStyle="#5BCE6B";c.beginPath();c.arc(-s*0.5,-s*0.7,s*0.42,0,Math.PI*2);c.arc(s*0.5,-s*0.7,s*0.42,0,Math.PI*2);c.fill();c.stroke();
 c.fillStyle="#fff";c.beginPath();c.arc(-s*0.5,-s*0.72,s*0.24,0,Math.PI*2);c.arc(s*0.5,-s*0.72,s*0.24,0,Math.PI*2);c.fill();
 c.fillStyle="#1E2A4A";c.beginPath();c.arc(-s*0.5,-s*0.72,s*0.11,0,Math.PI*2);c.arc(s*0.5,-s*0.72,s*0.11,0,Math.PI*2);c.fill();
 c.strokeStyle="#1E2A4A";c.lineWidth=2;c.beginPath();c.arc(0,s*0.05,s*0.45,0.12*Math.PI,0.88*Math.PI);c.stroke();
 c.restore();}

/* ---- TRES EN LÍNEA (Tic-Tac-Toe) contra la máquina ---- */
let TT={};
function gameTicTac(){setTheme("kid");
 TT={board:Array(9).fill(""),over:false,wins:0};renderTT();}
function ttWinner(b){
 const L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
 for(const[a,c,d]of L)if(b[a]&&b[a]===b[c]&&b[a]===b[d])return b[a];
 return b.every(x=>x)?"empate":null;}
function renderTT(){
 const cells=TT.board.map((c,i)=>'<button onclick="ttTap('+i+')" style="aspect-ratio:1;border-radius:16px;border:5px solid var(--kid-ink);background:#FFFEF8;box-shadow:0 6px 0 rgba(30,42,74,.7);font-size:clamp(2.4rem,14vw,3.6rem)">'+(c||"")+'</button>').join("");
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">⭕ Tres en Línea ❌</h2>'
 +'<p class="center" style="font-size:.95rem;margin-bottom:12px">Tú eres ❌. ¡Haz 3 en fila antes que la máquina ⭕!</p>'
 +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:340px;margin:0 auto">'+cells+'</div>'
 +'<div id="ttmsg" class="center" style="font-family:Fredoka;font-weight:700;font-size:1.2rem;min-height:34px;margin-top:14px"></div>');}
function ttTap(i){
 if(TT.over||TT.board[i])return;
 TT.board[i]="❌";beep([560],.07);
 let w=ttWinner(TT.board);
 if(w)return ttEnd(w);
 // jugada de la máquina: gana si puede, bloquea si debe, si no juega al azar inteligente
 const m=ttBestMove(TT.board);
 if(m>=0)TT.board[m]="⭕";
 w=ttWinner(TT.board);renderTT();
 if(w)return ttEnd(w);}
function ttBestMove(b){
 const empty=b.map((c,i)=>c?-1:i).filter(i=>i>=0);
 const tryWin=(mark)=>{for(const i of empty){const t=b.slice();t[i]=mark;if(ttWinner(t)===mark)return i;}return -1;};
 let m=tryWin("⭕");if(m>=0)return m; // ganar
 m=tryWin("❌");if(m>=0)return m;     // bloquear
 if(b[4]==="")return 4;               // centro
 return pick(empty);}
function ttEnd(w){
 TT.over=true;
 const msg=document.getElementById("ttmsg");
 if(w==="❌"){sWIN();confetti(24);recordAnswer("Lógica",true,15);if(msg)msg.textContent="🎉 ¡Ganaste!";setTimeout(()=>nodeWin(3,"Lógica"),1400);}
 else if(w==="⭕"){sNO();recordAnswer("Lógica",false,15);if(msg)msg.textContent="🤖 Ganó la máquina… ¡otra!";setTimeout(()=>nodeWin(1,"Lógica"),1400);}
 else{tone(440,.2);recordAnswer("Lógica",true,15);if(msg)msg.textContent="🤝 ¡Empate! Bien jugado";setTimeout(()=>nodeWin(2,"Lógica"),1400);}}

/* ---- CRUCIGRAMA MATEMÁTICO (números que cuadran en filas y columnas) ---- */
/* plantilla 5x5: índice 0-8 = celda con número; '+' y '=' fijos; '.' vacío */
const MXT=[[0,'+',1,'=',2],['+','.','+','.','+'],[3,'+',4,'=',5],['=','.','=','.','='],[6,'+',7,'=',8]];
let MX={};
function gameMathCross(){setTheme("kid");
 const lvl=(typeof adlvl==="function")?adlvl():2;
 const M=[3,5,8,10,12][Math.min(4,Math.max(0,lvl-1))];
 const A=1+rnd(M),B=1+rnd(M),D=1+rnd(M),E=1+rnd(M);
 const g=[A,B,A+B, D,E,D+E, A+D,B+E,(A+B)+(D+E)];
 const blanks=shuffled([0,1,2,3,4,5,6,7,8]).slice(0,4+rnd(2));
 const vals=blanks.map(b=>g[b]);
 const maxv=Math.max.apply(null,g);
 const tray=shuffled(vals.concat([1+rnd(maxv),1+rnd(maxv)])).map(v=>({val:v,used:false}));
 MX={g,blanks,filled:{},filledBy:{},tray,sel:null};
 renderMX();}
function renderMX(){
 const cells=[];
 for(let r=0;r<5;r++)for(let c=0;c<5;c++){
  const t=MXT[r][c];
  if(t==='.'){cells.push('<div></div>');continue;}
  if(t==='+'||t==='='){cells.push('<div style="display:flex;align-items:center;justify-content:center;font-family:Fredoka;font-weight:700;font-size:clamp(1.1rem,5vw,1.6rem);color:#1E2A4A">'+t+'</div>');continue;}
  const idx=t,isBlank=MX.blanks.includes(idx);
  if(!isBlank){cells.push('<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:10px;border:3px solid var(--kid-ink);background:#EAF2FF;font-family:Fredoka;font-weight:700;font-size:clamp(1.1rem,5.5vw,1.6rem)">'+MX.g[idx]+'</div>');}
  else{const v=MX.filled[idx];cells.push('<button onclick="tapMXCell('+idx+')" style="aspect-ratio:1;border-radius:10px;border:3px dashed var(--kid-ink);background:'+(v!=null?"var(--kid-yellow)":"#fff")+';font-family:Fredoka;font-weight:700;font-size:clamp(1.1rem,5.5vw,1.6rem)">'+(v!=null?v:'')+'</button>');}
 }
 const trayHTML=MX.tray.map((t,i)=>'<button onclick="tapMXTile('+i+')" '+(t.used?'disabled':'')+' style="min-width:48px;height:48px;border-radius:12px;border:4px solid var(--kid-ink);box-shadow:0 4px 0 rgba(30,42,74,.6);font-family:Fredoka;font-weight:700;font-size:1.3rem;color:var(--kid-ink);background:'+(t.used?"#D7DEEA":MX.sel===i?"var(--kid-green)":"var(--kid-yellow)")+';'+(t.used?"opacity:.4;":"")+'">'+t.val+'</button>').join("");
 render(topbar("exitGame('games')")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🔢 Crucigrama matemático</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:10px">Completa para que las sumas cuadren ➡️ y ⬇️</p>'
  +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;max-width:340px;margin:0 auto">'+cells.join("")+'</div>'
  +'<p class="center mut" style="margin:12px 0 6px;font-size:.85rem">Toca un número de abajo y luego una casilla vacía</p>'
  +'<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">'+trayHTML+'</div>'
  +(typeof boardBtn==="function"?boardBtn():''));}
function tapMXTile(i){if(MX.tray[i].used)return;MX.sel=(MX.sel===i?null:i);beep([520],.05);renderMX();}
function tapMXCell(idx){
 if(MX.filled[idx]!=null){const ti=MX.filledBy[idx];if(ti!=null)MX.tray[ti].used=false;delete MX.filled[idx];delete MX.filledBy[idx];beep([400],.06);return renderMX();}
 if(MX.sel==null){toast("Primero toca un número de abajo 👇",false,1100);return;}
 MX.filled[idx]=MX.tray[MX.sel].val;MX.filledBy[idx]=MX.sel;MX.tray[MX.sel].used=true;MX.sel=null;beep([640],.07);
 renderMX();
 if(MX.blanks.every(b=>MX.filled[b]!=null))setTimeout(checkMX,250);}
function checkMX(){
 const v=i=>MX.blanks.includes(i)?MX.filled[i]:MX.g[i];
 const eqs=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8]];
 const ok=eqs.every(e=>v(e[0])+v(e[1])===v(e[2]));
 recordAnswer("Mate",ok,25);
 if(ok){sWIN();confetti(32);setTimeout(()=>nodeWin(3,"Mate"),700);}
 else{sNO();toast("Algunas cuentas no cuadran — ¡revisa y cambia!",false,1800);}}

/* ============ DETECTIVE (deducción con pistas, estilo "impostor") ============ */
const DET_COLORS=[["#FF6B6B","roja"],["#3B82F6","azul"],["#3EC97C","verde"],["#FFC93C","amarilla"]];
let DET={};
function gameDetective(){setTheme("kid");DET={round:0,total:5,ok:0};detNext();}
function detNext(){
 if(DET.round>=DET.total)return nodeWin(starsFor(DET.ok,DET.total),"Detective");
 const combos=[];
 for(let h=0;h<2;h++)for(let g=0;g<2;g++)for(let c=0;c<4;c++)combos.push({hat:!!h,glasses:!!g,color:c});
 const susp=shuffled(combos).slice(0,4);
 const culprit=rnd(4),cu=susp[culprit];
 const clues=[
  cu.hat?"Usa sombrero 🎩":"NO usa sombrero",
  cu.glasses?"Usa gafas 👓":"NO usa gafas",
  "Su camiseta es "+DET_COLORS[cu.color][1]];
 DET.susp=susp;DET.culprit=culprit;DET.clues=clues;DET.answered=false;
 renderDet();}
function detCard(s,i){
 const c=DET_COLORS[s.color][0];
 return '<button onclick="tapDet('+i+')" style="border:4px solid var(--kid-ink);border-radius:18px;background:#fff;box-shadow:0 6px 0 rgba(30,42,74,.6);padding:8px 6px 12px;display:flex;flex-direction:column;align-items:center;gap:2px">'
  +'<div style="font-size:.72rem;font-family:Fredoka;font-weight:700;opacity:.6">Nº '+(i+1)+'</div>'
  +'<div style="height:1.3em;font-size:clamp(1.8rem,9vw,2.4rem);line-height:1">'+(s.hat?'🎩':'')+'</div>'
  +'<div style="font-size:clamp(2.4rem,12vw,3.2rem);line-height:1;margin-top:-6px">🙂</div>'
  +'<div style="height:1.4em;font-size:1.3rem">'+(s.glasses?'👓':'')+'</div>'
  +'<div style="width:70%;height:16px;border-radius:8px;border:2px solid var(--kid-ink);background:'+c+'"></div>'
  +'</button>';}
function renderDet(){
 render(topbar("exitGame('games')")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🕵️ Detective</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:8px">Caso '+(DET.round+1)+' de '+DET.total+' · ¿Quién es el culpable?</p>'
  +'<div class="card" style="padding:12px 14px;margin-bottom:10px">'
   +'<div style="font-family:Fredoka;font-weight:700;margin-bottom:6px">🔍 Pistas del culpable:</div>'
   +'<ul style="margin:0;padding-left:18px;font-size:1.05rem;line-height:1.7">'+DET.clues.map(c=>'<li>'+c+'</li>').join("")+'</ul>'
  +'</div>'
  +'<button class="speaker small" onclick="speakES(\'Pistas. '+DET.clues.join(". ").replace(/[🎩👓]/g,"")+'\')">🔊 Leer las pistas</button>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:360px;margin:12px auto 0">'+DET.susp.map((s,i)=>detCard(s,i)).join("")+'</div>');}
function tapDet(i){
 if(DET.answered)return;
 const ok=i===DET.culprit;DET.answered=true;
 recordAnswer("Detective",ok,20);
 if(ok){sOK();confetti(16);toast("¡Caso resuelto! 🕵️🎉",true,1300);DET.ok++;}
 else{sNO();toast("Era el Nº "+(DET.culprit+1)+" — vuelve a leer las pistas",false,2300);}
 DET.round++;setTimeout(detNext,ok?1400:2400);}

/* ============ CARRERA (Canvas: carro y obstáculos DIBUJADOS, no emojis) ============ */
let RC={};
function laneX(lane,n){return ((lane+0.5)/n*100);} /* % para juegos DOM (Carrera de números) */
function rrect(ctx,x,y,w,h,r){if(ctx.roundRect){ctx.beginPath();ctx.roundRect(x,y,w,h,r);return;}ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function gameRace(){setTheme("kid");
 try{cancelAnimationFrame(RC.raf);}catch(e){}
 render(topbar("exitGame('games')")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🏎️ Carrera</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:8px">Esquiva los obstáculos con los botones</p>'
  +'<div id="rcwrap" style="position:relative;width:100%;max-width:420px;margin:0 auto"><canvas id="rccanvas" style="width:100%;display:block;border:4px solid var(--kid-ink);border-radius:18px;box-shadow:0 8px 18px rgba(30,42,74,.25)"></canvas></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px auto 0;max-width:420px">'
   +'<button class="kbtn blue" onclick="raceMove(-1)" style="font-size:1.3rem">⬅️</button>'
   +'<button class="kbtn green" onclick="raceMove(1)" style="font-size:1.3rem">➡️</button>'
  +'</div>');
 var cv=document.getElementById("rccanvas");
 var cssW=cv.clientWidth||340;var cssH=Math.max(300,Math.min(440,Math.round(window.innerHeight*0.5)));
 var dpr=Math.min(2,window.devicePixelRatio||1);
 cv.style.height=cssH+"px";cv.width=Math.round(cssW*dpr);cv.height=Math.round(cssH*dpr);
 var ctx=cv.getContext("2d");ctx.scale(dpr,dpr);
 RC={ctx:ctx,W:cssW,H:cssH,nlanes:3,lane:1,carX:0,carY:cssH-64,dist:0,speed:150,over:false,obs:[],gap:1,
     spawnAcc:0,spawnEvery:0.95,speedAcc:0,roadOff:0,last:0,crashT:0,crashX:0,crashY:0};
 RC.carX=raceLaneCx(1);
 RC.raf=requestAnimationFrame(raceLoop);
}
function raceLaneCx(lane){return (lane+0.5)/RC.nlanes*RC.W;}
function raceMove(dir){if(RC.over)return;var o=RC.lane;RC.lane=Math.max(0,Math.min(RC.nlanes-1,RC.lane+dir));if(RC.lane!==o)beep([520],.05);}
function raceSpawnWave(){
 var blocked;
 if(RC.dist>700&&Math.random()<0.35){blocked=[0,2];}else{blocked=[rnd(3)];}
 var types=["cone","barrel","cone","rock"];
 blocked.forEach(function(lane){RC.obs.push({lane:lane,x:raceLaneCx(lane),y:-50,type:pick(types),hit:false});});
}
function raceLoop(ts){
 if(!RC.last)RC.last=ts;
 var dt=Math.min(0.05,(ts-RC.last)/1000);RC.last=ts;
 if(!RC.over){raceUpdate(dt);raceDraw();RC.raf=requestAnimationFrame(raceLoop);}
 else{RC.crashT+=dt;raceDraw();raceDrawBoom();if(RC.crashT<0.9)RC.raf=requestAnimationFrame(raceLoop);else raceFinish();}
}
function raceUpdate(dt){
 RC.dist+=RC.speed*dt*0.1;
 RC.roadOff=(RC.roadOff+RC.speed*dt)% 56;
 // el carro se desliza suave hacia su carril
 var tx=raceLaneCx(RC.lane);RC.carX+=(tx-RC.carX)*Math.min(1,dt*14);
 // mover obstáculos
 for(var i=0;i<RC.obs.length;i++){RC.obs[i].y+=RC.speed*dt;}
 // colisión por cercanía (carro y obstáculo)
 var cw=RC.W*0.16, ch=cw*1.5;
 for(var j=0;j<RC.obs.length;j++){var o=RC.obs[j];
  if(!o.hit && Math.abs(o.y-RC.carY)<ch*0.55 && Math.abs(o.x-RC.carX)<cw*0.7){o.hit=true;return raceCrash(o);}}
 RC.obs=RC.obs.filter(function(o){return o.y<RC.H+60;});
 RC.spawnAcc+=dt;if(RC.spawnAcc>=RC.spawnEvery){RC.spawnAcc=0;raceSpawnWave();}
 RC.speedAcc+=dt;if(RC.speedAcc>=3.2){RC.speedAcc=0;RC.speed=Math.min(330,RC.speed+18);RC.spawnEvery=Math.max(0.72,RC.spawnEvery-0.03);}
}
function raceDraw(){
 var c=RC.ctx,W=RC.W,H=RC.H;
 // asfalto
 c.fillStyle="#6B7886";c.fillRect(0,0,W,H);
 // bordes (césped)
 c.fillStyle="#3EA96B";c.fillRect(0,0,W*0.06,H);c.fillRect(W*0.94,0,W*0.06,H);
 c.fillStyle="#2E8F58";c.fillRect(W*0.06,0,5,H);c.fillRect(W*0.94-5,0,5,H);
 // líneas de carril que se desplazan
 c.strokeStyle="rgba(255,255,255,.85)";c.lineWidth=5;c.setLineDash([26,30]);c.lineDashOffset=-RC.roadOff;
 for(var l=1;l<RC.nlanes;l++){var x=l/RC.nlanes*W;c.beginPath();c.moveTo(x,-10);c.lineTo(x,H+10);c.stroke();}
 c.setLineDash([]);
 // obstáculos
 for(var i=0;i<RC.obs.length;i++){var o=RC.obs[i];raceDrawObstacle(c,o.x,o.y,o.type,W*0.13);}
 // carro
 if(!RC.over||RC.crashT<0.12)raceDrawCar(c,RC.carX,RC.carY,W*0.16);
 // HUD distancia
 c.fillStyle="rgba(30,42,74,.85)";rrect(c,8,8,92,30,10);c.fill();
 c.fillStyle="#fff";c.font="700 16px Fredoka, sans-serif";c.textBaseline="middle";c.textAlign="left";
 c.fillText("🏁 "+Math.round(RC.dist)+" m",16,24);
}
function raceDrawCar(c,x,y,w){
 var h=w*1.5;c.save();c.translate(x,y);
 c.fillStyle="rgba(0,0,0,.22)";c.beginPath();c.ellipse(0,h*0.35,w*0.62,h*0.5,0,0,Math.PI*2);c.fill();
 c.fillStyle="#1E2A4A";rrect(c,-w*0.56,-h*0.32,w*0.16,h*0.3,4);c.fill();rrect(c,w*0.4,-h*0.32,w*0.16,h*0.3,4);c.fill();
 rrect(c,-w*0.56,h*0.04,w*0.16,h*0.3,4);c.fill();rrect(c,w*0.4,h*0.04,w*0.16,h*0.3,4);c.fill();
 c.fillStyle="#FF5A4D";rrect(c,-w/2,-h/2,w,h,10);c.fill();
 c.lineWidth=3;c.strokeStyle="#1E2A4A";c.stroke();
 c.fillStyle="#BFE3FF";rrect(c,-w*0.34,-h*0.4,w*0.68,h*0.22,5);c.fill(); // parabrisas
 rrect(c,-w*0.32,h*0.16,w*0.64,h*0.2,5);c.fill(); // ventana trasera
 c.fillStyle="#FFE08A";c.beginPath();c.arc(-w*0.3,-h*0.46,w*0.07,0,Math.PI*2);c.arc(w*0.3,-h*0.46,w*0.07,0,Math.PI*2);c.fill();
 c.restore();
}
function raceDrawObstacle(c,x,y,type,s){
 c.save();c.translate(x,y);
 c.fillStyle="rgba(0,0,0,.18)";c.beginPath();c.ellipse(0,s*0.5,s*0.6,s*0.28,0,0,Math.PI*2);c.fill();
 if(type==="cone"){
  c.fillStyle="#FF7A1A";c.beginPath();c.moveTo(0,-s*0.7);c.lineTo(s*0.42,s*0.5);c.lineTo(-s*0.42,s*0.5);c.closePath();c.fill();
  c.strokeStyle="#1E2A4A";c.lineWidth=2.5;c.stroke();
  c.fillStyle="#fff";c.beginPath();c.moveTo(-s*0.27,-s*0.05);c.lineTo(s*0.27,-s*0.05);c.lineTo(s*0.33,s*0.12);c.lineTo(-s*0.33,s*0.12);c.closePath();c.fill();
  c.fillStyle="#1E2A4A";rrect(c,-s*0.5,s*0.46,s,s*0.16,4);c.fill();
 }else if(type==="barrel"){
  c.fillStyle="#E23B3B";rrect(c,-s*0.42,-s*0.6,s*0.84,s*1.1,8);c.fill();c.strokeStyle="#1E2A4A";c.lineWidth=2.5;c.stroke();
  c.fillStyle="#fff";c.fillRect(-s*0.42,-s*0.18,s*0.84,s*0.16);c.fillRect(-s*0.42,s*0.12,s*0.84,s*0.16);
 }else{ // roca
  c.fillStyle="#8A94A6";c.beginPath();c.moveTo(-s*0.5,s*0.3);c.lineTo(-s*0.3,-s*0.4);c.lineTo(s*0.2,-s*0.5);c.lineTo(s*0.5,s*0.1);c.lineTo(s*0.25,s*0.5);c.lineTo(-s*0.2,s*0.45);c.closePath();c.fill();
  c.strokeStyle="#1E2A4A";c.lineWidth=2.5;c.stroke();
 }
 c.restore();
}
function raceDrawBoom(){
 var c=RC.ctx,t=RC.crashT/0.9,r=RC.W*0.06+t*RC.W*0.32;
 c.save();c.globalAlpha=1-t;
 c.fillStyle="#FF7A1A";c.beginPath();c.arc(RC.crashX,RC.crashY,r,0,Math.PI*2);c.fill();
 c.fillStyle="#FFE08A";c.beginPath();c.arc(RC.crashX,RC.crashY,r*0.6,0,Math.PI*2);c.fill();
 c.globalAlpha=1;c.font="700 "+(RC.W*0.12)+"px sans-serif";c.textAlign="center";c.textBaseline="middle";
 c.fillText("💥",RC.crashX,RC.crashY);c.restore();
}
function raceCrash(o){RC.over=true;RC.crashX=o?o.x:RC.carX;RC.crashY=RC.carY;sNO();}
function raceFinish(){
 try{cancelAnimationFrame(RC.raf);}catch(e){}
 var stars=RC.dist>=400?3:RC.dist>=200?2:1;
 recordAnswer("Ubicación",RC.dist>=200,10);nodeWin(stars,"Ubicación");
}

/* ============ COLOCA EL SIGNO  > < =  (con operaciones, estilo libro) ============ */
let CMP={};
function gameSymbols(){setTheme("kid");CMP={round:0,total:8,ok:0};nextSymbol();}
function symSide(maxv){
 const r=Math.random();
 if(r<0.4){const n=1+rnd(maxv);return{label:String(n),val:n};}
 if(r<0.72){const a=1+rnd(9),b=1+rnd(9);return{label:a+" + "+b,val:a+b};}
 const a=4+rnd(Math.min(maxv,14)),b=1+rnd(a-1);return{label:a+" − "+b,val:a-b};
}
function nextSymbol(){
 if(CMP.round>=CMP.total)return nodeWin(starsFor(CMP.ok,CMP.total),"Mayor y menor");
 const M=(typeof diffMax==="function")?diffMax([10,12,18,25,40]):15;
 let L=symSide(M),R=symSide(M);
 if(Math.random()<0.2)R={label:String(L.val),val:L.val}; // a veces iguales (para el =)
 const sym=L.val>R.val?">":L.val<R.val?"<":"=";
 CMP.cur={L,R,sym};CMP.answered=false;
 renderSymbol();
}
function renderSymbol(){
 const c=CMP.cur;
 const box=v=>'<div style="flex:1;max-width:130px;border:3px solid var(--kid-ink);border-radius:16px;background:#EAF2FF;box-shadow:0 5px 0 rgba(30,42,74,.5);font-family:Fredoka;font-weight:700;font-size:clamp(1.4rem,7vw,2rem);padding:18px 6px;text-align:center">'+v+'</div>';
 render(topbar("exitGame('games')")
  +'<div class="progressdots">'+dots(CMP.total,CMP.round)+'</div>'
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🐊 Coloca el signo</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:12px">El cocodrilo 🐊 abre la boca hacia el lado MÁS GRANDE</p>'
  +'<div style="display:flex;align-items:center;justify-content:center;gap:8px">'
   +box(c.L.label)
   +'<div id="cmpsign" style="font-size:clamp(2rem,11vw,3rem);min-width:50px;text-align:center;font-family:Fredoka;font-weight:700">❓</div>'
   +box(c.R.label)
  +'</div>'
  +'<button class="speaker small" style="margin-top:12px" onclick="speakES(\'¿'+c.L.label.replace("−","menos").replace("+","más")+' es mayor, menor o igual que '+c.R.label.replace("−","menos").replace("+","más")+'?\')">🔊 Leer</button>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:14px">'
   +'<button class="kbtn green" style="font-size:1.9rem" onclick="ansSymbol(\'>\')">&gt;</button>'
   +'<button class="kbtn yellow" style="font-size:1.9rem" onclick="ansSymbol(\'=\')">=</button>'
   +'<button class="kbtn blue" style="font-size:1.9rem" onclick="ansSymbol(\'<\')">&lt;</button>'
  +'</div>'
  +'<p class="center mut" style="margin-top:10px;font-size:.82rem">&gt; mayor que · = igual · &lt; menor que</p>');
}
function ansSymbol(sym){
 if(CMP.answered)return;CMP.answered=true;
 const c=CMP.cur,ok=sym===c.sym;
 const el=document.getElementById("cmpsign");if(el)el.textContent=c.sym;
 recordAnswer("Mayor y menor",ok,12);
 if(ok){sOK();confetti(8);toast("¡Correcto! "+c.L.label+" "+c.sym+" "+c.R.label,true,1500);CMP.ok++;}
 else{sNO();toast("Era: "+c.L.label+" "+c.sym+" "+c.R.label,false,2400);}
 CMP.round++;setTimeout(nextSymbol,ok?1400:2400);
}

/* ============ DICTADO DE FRASES (practica la escritura) ============ */
const DICTADO=["El gato duerme en la cama.","Mi mamá hace una rica sopa.","El sol brilla en el cielo.","Yo tengo un perro pequeño.","La niña juega con la pelota.","Hoy vamos al parque.","Me gusta leer cuentos.","El pez nada en el agua.","Mi amigo corre muy rápido.","La flor es de color rojo.","Vamos a la escuela en bus.","El bebé toma leche caliente.","El árbol tiene muchas hojas.","La luna sale en la noche.","Mi papá lava el carro."];
let DIC={};
function gameDictation(){setTheme("kid");DIC={qs:shuffled(DICTADO).slice(0,5),i:0,ok:0};nextDic();}
function nextDic(){
 if(DIC.i>=DIC.qs.length)return nodeWin(starsFor(DIC.ok,DIC.qs.length),"Ordenar");
 const ph=DIC.qs[DIC.i];DIC.cur=ph;
 const safe=esc(ph).replace(/'/g,"\'");
 render(topbar("screenWritingPick()")
  +'<div class="progressdots">'+dots(DIC.qs.length,DIC.i)+'</div>'
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">✍️ Dictado</h2>'
  +'<p class="center" style="font-size:.95rem;margin-bottom:12px">Escucha la frase y escríbela igualita</p>'
  +'<button class="speaker" onclick="speakES(\''+safe+'\')"><span class="ic">🔊</span> Escuchar la frase</button>'
  +'<input id="dicin" type="text" autocomplete="off" autocapitalize="sentences" style="width:100%;box-sizing:border-box;font-size:1.2rem;padding:14px;border:3px solid var(--kid-ink);border-radius:14px;margin:12px 0;font-family:Nunito;font-weight:700" placeholder="Escribe aquí…">'
  +'<button class="kbtn green" onclick="checkDic()">Revisar ✅</button>'
  +'<button class="kbtn white" onclick="speakES(\''+safe+'\')">🔊 Repetir</button>');
 setTimeout(()=>{const i=document.getElementById("dicin");if(i)i.focus();speakES(ph);},400);
}
function normTxt(s){return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[.,;:!¡¿?]/g,"").replace(/\s+/g," ").trim();}
function checkDic(){
 const inp=document.getElementById("dicin");if(!inp)return;
 const ok=normTxt(inp.value)===normTxt(DIC.cur);
 recordAnswer("Ordenar",ok,30);
 if(ok){sOK();confetti(12);toast("¡Perfecto! Escribiste muy bien 🌟",true,1600);DIC.ok++;}
 else{sNO();toast("Casi… era: "+DIC.cur,false,2800);}
 DIC.i++;setTimeout(nextDic,ok?1500:2900);
}

/* ============ EL CUERPO INTERACTIVO (señala partes en una figura + órganos) ============ */
const BODY_PARTS=[
 {id:"cabeza",nm:"la cabeza",x:100,y:45,r:25},
 {id:"cuello",nm:"el cuello",x:100,y:80,r:11},
 {id:"hombro",nm:"el hombro",x:73,y:100,r:13},
 {id:"pecho",nm:"el pecho",x:100,y:124,r:16},
 {id:"codo",nm:"el codo",x:58,y:150,r:13},
 {id:"mano",nm:"la mano",x:50,y:197,r:14},
 {id:"barriga",nm:"la barriga",x:100,y:172,r:15},
 {id:"rodilla",nm:"la rodilla",x:86,y:285,r:13},
 {id:"pie",nm:"el pie",x:84,y:356,r:14}];
const BODY_ORGANS=[
 {id:"cerebro",nm:"el cerebro",e:"🧠",x:100,y:44,sys:"nervioso (pensar)"},
 {id:"corazon",nm:"el corazón",e:"❤️",x:87,y:120,sys:"circulatorio (bombea la sangre)"},
 {id:"pulmones",nm:"los pulmones",e:"🫁",x:113,y:120,sys:"respiratorio (respirar)"},
 {id:"estomago",nm:"el estómago",e:"🍔",x:100,y:168,sys:"digestivo (digerir la comida)"},
 {id:"huesos",nm:"los huesos",e:"🦴",x:100,y:300,sys:"óseo (sostén del cuerpo)"}];
function bodySVG(hot){
 return '<svg viewBox="0 0 200 380" style="width:100%;max-width:290px;display:block;margin:0 auto">'
  +'<line x1="89" y1="200" x2="84" y2="356" stroke="#4a6fb0" stroke-width="22" stroke-linecap="round"/>'
  +'<line x1="111" y1="200" x2="116" y2="356" stroke="#4a6fb0" stroke-width="22" stroke-linecap="round"/>'
  +'<polyline points="76,104 58,150 50,197" fill="none" stroke="#edb98a" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>'
  +'<polyline points="124,104 142,150 150,197" fill="none" stroke="#edb98a" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>'
  +'<rect x="72" y="90" width="56" height="115" rx="22" fill="#5199e4"/>'
  +'<rect x="92" y="66" width="16" height="20" fill="#edb98a"/>'
  +'<circle cx="100" cy="45" r="27" fill="#edb98a"/>'
  +'<circle cx="91" cy="42" r="3" fill="#222"/><circle cx="109" cy="42" r="3" fill="#222"/><path d="M91 54 Q100 60 109 54" stroke="#222" stroke-width="2" fill="none"/>'
  +(hot||[]).map(p=>'<circle id="bhot_'+p.id+'" cx="'+p.x+'" cy="'+p.y+'" r="'+p.r+'" fill="rgba(255,255,255,0.02)" stroke="rgba(30,42,74,0.30)" stroke-width="2" stroke-dasharray="3 3" style="cursor:pointer" onclick="bodyTap(\''+p.id+'\')"/>').join("")
  +'</svg>';
}
let BD={};
function gameBody(){setTheme("kid");
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">🧍 El cuerpo</h2>'
  +'<p class="center" style="margin-bottom:14px">¿Qué quieres practicar?</p>'
  +'<button class="kbtn red" onclick="bodyStart(\'partes\')">🧍 Señala las partes del cuerpo</button>'
  +'<button class="kbtn green" onclick="bodyStart(\'sistemas\')">🫀 Órganos y sistemas</button>'
  +'<button class="kbtn yellow" onclick="playTopics(\'El cuerpo\',[\'cuerpo_partes\',\'sistemas\',\'cuerpo_es\'],{perTopic:4,topicsPerSession:2,total:8})">❓ Preguntas del cuerpo</button>');
}
function bodyStart(mode){
 BD={mode,round:0,ok:0};
 BD.total=mode==="partes"?7:5;
 const pool=mode==="partes"?BODY_PARTS.map(p=>p.id):BODY_ORGANS.map(o=>o.id);
 BD.queue=shuffled(pool).slice(0,BD.total);
 nextBody();
}
function nextBody(){
 if(BD.round>=BD.total)return nodeWin(starsFor(BD.ok,BD.total),BD.mode==="partes"?"Partes del cuerpo":"Sistemas del cuerpo");
 BD.target=BD.queue[BD.round];BD.answered=false;
 BD.mode==="partes"?renderBodyParts():renderBodyOrg();
}
function renderBodyParts(){
 const t=BODY_PARTS.find(p=>p.id===BD.target);
 render(topbar("exitGame(gameBody)")
  +'<div class="progressdots">'+dots(BD.total,BD.round)+'</div>'
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.4rem);text-align:center;margin-bottom:4px">🧍 Toca: <span style="color:#3B82F6">'+t.nm.toUpperCase()+'</span></h2>'
  +'<button class="speaker small" onclick="speakES(\'Toca '+t.nm+'\')">🔊 Escuchar</button>'
  +'<div class="card" style="padding:10px">'+bodySVG(BODY_PARTS)+'</div>');
 speakES("Toca "+t.nm);
}
function bodyTap(id){
 if(BD.answered)return;BD.answered=true;
 const ok=id===BD.target,t=BODY_PARTS.find(p=>p.id===BD.target);
 recordAnswer("Partes del cuerpo",ok,12);
 const tc=document.getElementById("bhot_"+BD.target);if(tc){tc.setAttribute("fill","rgba(62,201,124,0.55)");tc.setAttribute("stroke","#1E7a44");}
 if(ok){sOK();confetti(8);toast("¡Sí! Esa es "+t.nm+" ✅",true,1300);BD.ok++;}
 else{const wc=document.getElementById("bhot_"+id);if(wc){wc.setAttribute("fill","rgba(255,107,107,0.55)");wc.setAttribute("stroke","#a11");}
  const w=BODY_PARTS.find(p=>p.id===id);sNO();toast("Esa es "+(w?w.nm:"otra parte")+". "+t.nm+" está en verde 💚",false,2500);}
 BD.round++;setTimeout(nextBody,ok?1300:2600);
}
function renderBodyOrg(){
 const t=BODY_ORGANS.find(o=>o.id===BD.target);
 render(topbar("exitGame(gameBody)")
  +'<div class="progressdots">'+dots(BD.total,BD.round)+'</div>'
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.4rem);text-align:center;margin-bottom:2px">🫀 Toca: <span style="color:#DC2626">'+t.nm.toUpperCase()+'</span></h2>'
  +'<p class="center" style="font-size:.82rem;margin-bottom:6px">Sistema '+t.sys+'</p>'
  +'<button class="speaker small" onclick="speakES(\'¿Dónde está '+t.nm+'?\')">🔊 Escuchar</button>'
  +'<div class="card" style="padding:10px"><div style="position:relative;max-width:290px;margin:0 auto">'
   +bodySVG([])
   +BODY_ORGANS.map(o=>'<button id="org_'+o.id+'" onclick="orgTap(\''+o.id+'\')" style="position:absolute;left:'+(o.x/200*100)+'%;top:'+(o.y/380*100)+'%;transform:translate(-50%,-50%);font-size:1.7rem;background:#fff;border:3px solid var(--kid-ink);border-radius:50%;width:46px;height:46px;cursor:pointer;padding:0">'+o.e+'</button>').join("")
  +'</div></div>');
 speakES("¿Dónde está "+t.nm+"?");
}
function orgTap(id){
 if(BD.answered)return;BD.answered=true;
 const ok=id===BD.target,t=BODY_ORGANS.find(o=>o.id===BD.target);
 recordAnswer("Sistemas del cuerpo",ok,12);
 const tb=document.getElementById("org_"+BD.target);if(tb){tb.style.background="#3EC97C";tb.style.borderColor="#1E7a44";}
 if(ok){sOK();confetti(8);toast("¡Sí! "+t.nm+" → sistema "+t.sys+" ✅",true,2000);BD.ok++;}
 else{const wb=document.getElementById("org_"+id);if(wb)wb.style.background="#FF6B6B";sNO();toast(t.nm+" está en verde. Es del sistema "+t.sys,false,2700);}
 BD.round++;setTimeout(nextBody,ok?1900:2800);
}

/* ============ SOCIALES: menú + ADIVINA LA BANDERA ============ */
function screenSocial(){setTheme("kid");
 render(topbar("screenCole()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">🌎 Sociales y trivias</h2>'
  +'<p class="center" style="margin-bottom:14px">Elige una actividad</p>'
  +'<button class="kbtn blue" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="gameFlags()"><span style="font-size:2rem">🏴</span> <span style="flex:1">Adivina la bandera</span></button>'
  +'<button class="kbtn green" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="playTopics(\'Sociales\',[\'geografia\',\'sociales\',\'cultura\',\'informatica\'],{perTopic:4,topicsPerSession:2,total:8})"><span style="font-size:2rem">🧠</span> <span style="flex:1">Trivias: geografía, sociales y cultura</span></button>');
}
let FL={};
function gameFlags(){setTheme("kid");FL={round:0,total:8,ok:0};nextFlag();}
function nextFlag(){
 if(FL.round>=FL.total)return nodeWin(starsFor(FL.ok,FL.total),"Banderas");
 const q=genBandera();FL.cur=q;
 const order=shuffled(q.ops.map((o,i)=>({o,i})));FL.order=order;
 render(topbar("exitGame(screenSocial)")
  +'<div class="progressdots">'+dots(FL.total,FL.round)+'</div>'
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🏴 Adivina la bandera</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:8px">¿De qué país es?</p>'
  +'<div class="card center" style="padding:22px 14px"><div style="font-size:clamp(5rem,30vw,9rem);line-height:1">'+q.pic+'</div></div>'
  +'<div class="choices2">'+order.map((s,vi)=>'<button class="kbtn white" style="font-size:clamp(1.1rem,5vw,1.4rem)" onclick="ansFlag('+vi+')">'+esc(s.o)+'</button>').join("")+'</div>');
}
function ansFlag(vi){
 const ok=FL.order[vi].i===FL.cur.a;
 recordAnswer("Banderas",ok,12);
 if(ok){sOK();confetti(10);toast("¡Correcto! 🎉",true,1200);FL.ok++;}
 else{sNO();toast("Era: "+FL.cur.ops[FL.cur.a],false,1900);}
 FL.round++;setTimeout(nextFlag,ok?1100:1900);
}

/* ============ CARRERA DE NÚMEROS (Canvas: personaje y puertas DIBUJADOS) ============ */
let GR={};
function gameGateRun(){setTheme("kid");
 try{cancelAnimationFrame(GR.raf);}catch(e){}
 render(topbar("exitGame('games')")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🔢 Carrera de números</h2>'
  +'<p class="center" style="font-size:.88rem;margin-bottom:8px">¡Pasa por la puerta que te haga MÁS GRANDE!</p>'
  +'<div style="position:relative;width:100%;max-width:420px;margin:0 auto"><canvas id="grcanvas" style="width:100%;display:block;border:4px solid var(--kid-ink);border-radius:18px;box-shadow:0 8px 18px rgba(30,42,74,.25)"></canvas></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px auto 0;max-width:420px">'
   +'<button class="kbtn blue" onclick="grMove(0)" style="font-size:1.3rem">⬅️</button>'
   +'<button class="kbtn green" onclick="grMove(1)" style="font-size:1.3rem">➡️</button>'
  +'</div>');
 var cv=document.getElementById("grcanvas");
 var cssW=cv.clientWidth||340;var cssH=Math.max(300,Math.min(420,Math.round(window.innerHeight*0.5)));
 var dpr=Math.min(2,window.devicePixelRatio||1);
 cv.style.height=cssH+"px";cv.width=Math.round(cssW*dpr);cv.height=Math.round(cssH*dpr);
 var ctx=cv.getContext("2d");ctx.scale(dpr,dpr);
 GR={ctx:ctx,W:cssW,H:cssH,num:2,lane:0,charX:0,charY:cssH-58,gates:[],done:0,total:8,correct:0,
     speed:130,over:false,spawnAcc:0,spawnEvery:1.15,speedAcc:0,roadOff:0,last:0,popT:0,grow:0};
 GR.charX=grLaneCx(0);grSpawn();
 GR.raf=requestAnimationFrame(grLoop);
}
function grLaneCx(l){return (l+0.5)/2*GR.W;}
function grMove(l){if(GR.over)return;GR.lane=l;beep([520],.05);}
function grMakeOp(){var r=Math.random();
 if(r<0.5){var n=2+rnd(8);return{label:"+"+n,apply:function(x){return x+n;}};}
 if(r<0.82){var n2=2+rnd(2);return{label:"×"+n2,apply:function(x){return x*n2;}};}
 var n3=1+rnd(5);return{label:"−"+n3,apply:function(x){return Math.max(0,x-n3);}};}
function grSpawn(){
 var a=grMakeOp(),b=grMakeOp(),g=0;
 while(a.apply(GR.num)===b.apply(GR.num)&&g++<12)b=grMakeOp();
 GR.gates.push({ops:[a,b],y:-30,applied:false,state:[0,0]});
}
function grLoop(ts){
 if(!GR.last)GR.last=ts;
 var dt=Math.min(0.05,(ts-GR.last)/1000);GR.last=ts;
 if(!GR.over){grUpdate(dt);grDraw();GR.raf=requestAnimationFrame(grLoop);}
 else{grDraw();}
}
function grUpdate(dt){
 GR.roadOff=(GR.roadOff+GR.speed*dt)%56;
 var tx=grLaneCx(GR.lane);GR.charX+=(tx-GR.charX)*Math.min(1,dt*14);
 if(GR.popT>0)GR.popT=Math.max(0,GR.popT-dt);
 for(var i=0;i<GR.gates.length;i++){var p=GR.gates[i];p.y+=GR.speed*dt;
  if(!p.applied&&p.y>=GR.charY-18){p.applied=true;grApply(p);}}
 GR.gates=GR.gates.filter(function(p){return p.y<GR.H+50;});
 if(GR.done>=GR.total)return grEnd();
 GR.spawnAcc+=dt;if(GR.spawnAcc>=GR.spawnEvery&&(GR.done+GR.gates.length)<GR.total){GR.spawnAcc=0;grSpawn();}
 GR.speedAcc+=dt;if(GR.speedAcc>=3){GR.speedAcc=0;GR.speed=Math.min(240,GR.speed+14);GR.spawnEvery=Math.max(0.85,GR.spawnEvery-0.03);}
}
function grApply(p){
 var chosen=p.ops[GR.lane].apply(GR.num);
 var other=p.ops[GR.lane===0?1:0].apply(GR.num);
 var ok=chosen>=other;
 GR.num=chosen;GR.done++;if(ok)GR.correct++;
 p.state[GR.lane]=ok?1:2;p.state[GR.lane===0?1:0]=3;
 GR.popT=0.25;
 recordAnswer("Mate",ok,8);
 if(ok){sOK();confetti(6);}else{sNO();}
}
function grDraw(){
 var c=GR.ctx,W=GR.W,H=GR.H;
 c.fillStyle="#6B7886";c.fillRect(0,0,W,H);
 c.fillStyle="#3EA96B";c.fillRect(0,0,W*0.05,H);c.fillRect(W*0.95,0,W*0.05,H);
 c.strokeStyle="rgba(255,255,255,.85)";c.lineWidth=5;c.setLineDash([26,30]);c.lineDashOffset=-GR.roadOff;
 c.beginPath();c.moveTo(W/2,-10);c.lineTo(W/2,H+10);c.stroke();c.setLineDash([]);
 // puertas
 for(var i=0;i<GR.gates.length;i++){var p=GR.gates[i];
  grDrawGate(c,grLaneCx(0),p.y,W*0.44,p.ops[0].label,p.state[0]);
  grDrawGate(c,grLaneCx(1),p.y,W*0.44,p.ops[1].label,p.state[1]);}
 // personaje
 grDrawChar(c,GR.charX,GR.charY,GR.num,GR.popT>0?1+GR.popT:1);
 // HUD número
 c.fillStyle="rgba(30,42,74,.85)";rrect(c,8,8,W*0.5,32,10);c.fill();
 c.fillStyle="#fff";c.font="800 17px Fredoka, sans-serif";c.textBaseline="middle";c.textAlign="left";
 c.fillText("Tu número: "+GR.num,16,25);
}
function grDrawGate(c,x,y,w,label,state){
 var col=state===1?"#3EC97C":state===2?"#FF6B6B":"#3B82F6";
 c.save();if(state===3)c.globalAlpha=0.35;
 c.fillStyle=col;rrect(c,x-w/2,y-25,w,50,12);c.fill();c.lineWidth=3;c.strokeStyle="#1E2A4A";c.stroke();
 c.fillStyle="#fff";c.font="800 "+(GR.W*0.085)+"px Fredoka, sans-serif";c.textAlign="center";c.textBaseline="middle";
 c.fillText(label,x,y+1);
 c.restore();
}
function grDrawChar(c,x,y,num,pop){
 var s=GR.W*0.11*(1+Math.min(0.45,(num-2)*0.012))*pop;
 c.save();c.translate(x,y);
 c.fillStyle="rgba(0,0,0,.2)";c.beginPath();c.ellipse(0,s*0.85,s*0.75,s*0.28,0,0,Math.PI*2);c.fill();
 c.fillStyle="#FFC93C";rrect(c,-s*0.7,-s*0.8,s*1.4,s*1.5,s*0.45);c.fill();c.lineWidth=3;c.strokeStyle="#1E2A4A";c.stroke();
 c.fillStyle="#fff";c.beginPath();c.arc(-s*0.26,-s*0.35,s*0.18,0,Math.PI*2);c.arc(s*0.26,-s*0.35,s*0.18,0,Math.PI*2);c.fill();
 c.fillStyle="#1E2A4A";c.beginPath();c.arc(-s*0.24,-s*0.32,s*0.09,0,Math.PI*2);c.arc(s*0.28,-s*0.32,s*0.09,0,Math.PI*2);c.fill();
 c.fillStyle="#1E2A4A";c.font="800 "+(s*0.62)+"px Fredoka, sans-serif";c.textAlign="center";c.textBaseline="middle";
 c.fillText(num,0,s*0.38);
 c.restore();
}
function grEnd(){
 GR.over=true;try{cancelAnimationFrame(GR.raf);}catch(e){}
 var stars=GR.correct>=GR.total-1?3:GR.correct>=GR.total*0.6?2:1;
 sWIN();confetti(28);
 toast("¡Tu número final: "+GR.num+"! Elegiste bien "+GR.correct+"/"+GR.total+" 🔢",true,2800);
 setTimeout(function(){nodeWin(stars,"Mate");},800);
}

/* ============ PROBLEMAS MATEMÁTICOS (dedicado, con voz y pista) ============ */
let PB={};
function gameWordProblems(){setTheme("kid");PB={round:0,total:6,ok:0};nextPB2();}
function nextPB2(){
 if(PB.round>=PB.total)return nodeWin(starsFor(PB.ok,PB.total),"Problemas");
 const it=genProblema2();PB.cur=it;
 const order=shuffled(it.ops.map((o,i)=>({o,i})));PB.order=order;PB.a=it.a;
 render(topbar("exitGame('games')")
  +'<div class="progressdots">'+dots(PB.total,PB.round)+'</div>'
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:6px">🧩 Problema '+(PB.round+1)+'/'+PB.total+'</h2>'
  +(it.pic?'<div class="bigpic">'+it.pic+'</div>':'')
  +'<div class="card" style="font-size:clamp(1.15rem,5vw,1.4rem);line-height:1.5;text-align:center;font-family:Fredoka;font-weight:600">'+esc(it.q)+'</div>'
  +'<button class="speaker small" onclick="speakES(\''+esc(it.q).replace(/'/g,"\'")+'\')">🔊 Leer el problema</button>'
  +'<div class="choices2">'+order.map((s,vi)=>'<button class="kbtn white" style="font-size:clamp(1.3rem,6vw,1.7rem)" onclick="ansPB2('+vi+')">'+esc(s.o)+'</button>').join("")+'</div>'
  +(typeof boardBtn==="function"?boardBtn():''));
 setTimeout(()=>speakES(it.q),350);
}
function ansPB2(vi){
 const ok=PB.order[vi].i===PB.a;
 recordAnswer("Problemas",ok,20);
 if(ok){sOK();confetti(10);toast("¡Correcto! 🎉",true,1200);PB.ok++;}
 else{sNO();toast("Era: "+PB.cur.ops[PB.a]+(PB.cur.tip?"  💡 "+PB.cur.tip:""),false,3000);}
 PB.round++;setTimeout(nextPB2,ok?1200:3000);
}

/* ============ SUMAS EN COLUMNA (números uno debajo del otro) ============ */
let CA={};
function gameColumnAdd(){setTheme("kid");CA={round:0,total:6,ok:0};nextCA();}
function nextCA(){
 if(CA.round>=CA.total)return nodeWin(starsFor(CA.ok,CA.total),"Sumas");
 const M=(typeof diffMax==="function")?diffMax([12,20,35,55,80]):30;
 const a=5+rnd(M),b=5+rnd(M),ans=a+b;
 const set=new Set([ans]);while(set.size<3){const d=ans+(1+rnd(5))*(Math.random()<.5?-1:1);if(d>=0)set.add(d);}
 const ops=shuffled([...set]).map(String);CA.a=ops.indexOf(String(ans));CA.ans=ans;
 const col='<div style="display:inline-grid;grid-template-columns:auto auto;gap:2px 14px;font-family:Fredoka;font-weight:800;font-size:clamp(2.6rem,14vw,3.8rem);text-align:right;line-height:1.1;color:var(--kid-ink)">'
  +'<div></div><div>'+a+'</div>'
  +'<div style="color:var(--kid-green)">+</div><div>'+b+'</div>'
  +'<div style="grid-column:1/3;height:6px;background:var(--kid-ink);border-radius:3px;margin:6px 0"></div>'
  +'<div></div><div style="color:var(--kid-blue)">?</div>'
  +'</div>';
 render(topbar("exitGame('games')")
  +'<div class="progressdots">'+dots(CA.total,CA.round)+'</div>'
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">➕ Suma en columna</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:8px">Suma las unidades y luego las decenas</p>'
  +'<div class="card center" style="padding:22px">'+col+'</div>'
  +'<div class="choices2">'+ops.map((o,i)=>'<button class="kbtn white" style="font-size:clamp(1.4rem,7vw,1.9rem)" onclick="ansCA('+i+')">'+o+'</button>').join("")+'</div>'
  +(typeof boardBtn==="function"?boardBtn():''));
}
function ansCA(i){
 const ok=i===CA.a;
 recordAnswer("Sumas",ok,15);
 if(ok){sOK();confetti(10);toast("¡Correcto! "+CA.ans+" 🎉",true,1300);CA.ok++;}
 else{sNO();toast("La respuesta era "+CA.ans,false,1900);}
 CA.round++;setTimeout(nextCA,ok?1200:2000);
}

/* ============ DUELO CONTRA LA IA (retos por niveles, según la materia y la edad) ============ */
let DU={};
function gameDuel(){setTheme("kid");
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:2px">🤖 Duelo contra la IA</h2>'
  +'<p class="center" style="margin-bottom:14px">Compite contra la IA. ¡Gana más puntos para subir de nivel!</p>'
  +'<button class="kbtn green" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="duelStart(\'mate\')"><span style="font-size:2rem">🔢</span> <span style="flex:1">Matemáticas</span></button>'
  +'<button class="kbtn red" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="duelStart(\'ingles\')"><span style="font-size:2rem">🇬🇧</span> <span style="flex:1">Inglés</span></button>'
  +'<button class="kbtn blue" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="duelStart(\'ciencias\')"><span style="font-size:2rem">🌎</span> <span style="flex:1">Ciencias</span></button>');
}
function duelStart(subject){
 var age=(typeof prof==="function"&&prof()&&prof().age)||7;
 DU={subject:subject,age:age,level:1,maxLevel:8,per:5};
 duelLevel();
}
function duelMate(level,age){
 var L=level+(age>=10?2:age>=9?1:0);
 if(L<=2){var M=8+L*8,a=1+rnd(M),b=1+rnd(M);if(L>=2&&Math.random()<.5){if(b>a){var t=a;a=b;b=t;}return mcq(a+" − "+b+" = ?",a-b);}return mcq(a+" + "+b+" = ?",a+b);}
 if(L<=4){var f=2+rnd(Math.min(9,L+3)),n=2+rnd(Math.min(9,L+3));return mcq(f+" × "+n+" = ?",f*n);}
 if(typeof genProblema2==="function"){var r=genProblema2();return{q:r.q,ops:r.ops,a:r.a,pic:r.pic};}
 var x=20+rnd(60),y=20+rnd(60);return mcq(x+" + "+y+" = ?",x+y);
}
function duelIngles(level){
 if(level>=4&&typeof EN_PHRASES!=="undefined"){var p=pick(EN_PHRASES);return enMCQ([[p[0],p[1],"💬"]]);}
 if(typeof EN_VOCAB!=="undefined"){var cats=Object.keys(EN_VOCAB);return enMCQ(EN_VOCAB[cats[rnd(cats.length)]]);}
 return {q:'¿Qué significa "dog"?',ops:["perro","gato","sol"],a:0};
}
function duelCiencias(level){
 var gens=[];
 if(typeof genCuerpoParte==="function")gens.push(genCuerpoParte);
 if(typeof genSistema==="function")gens.push(genSistema);
 if(typeof genGeo==="function")gens.push(genGeo);
 if(typeof genCultura==="function")gens.push(genCultura);
 if(typeof genAlimentos==="function")gens.push(genAlimentos);
 if(typeof genTierra==="function")gens.push(genTierra);
 if(typeof CICLO_AGUA_QS!=="undefined")gens.push(function(){var x=pick(CICLO_AGUA_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};});
 if(typeof NATURA_QS!=="undefined")gens.push(function(){var x=pick(NATURA_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};});
 if(!gens.length)return{q:"¿De qué color es el cielo?",ops:["Azul","Rojo","Verde"],a:0};
 return gens[rnd(gens.length)]();
}
function duelQ(subject,level,age){
 var q=subject==="mate"?duelMate(level,age):subject==="ingles"?duelIngles(level):duelCiencias(level);
 if(q.a===-1&&q.fixAns!==undefined)q.a=q.ops.indexOf(q.fixAns);
 return q;
}
function duelLevel(){
 DU.i=0;DU.kid=0;DU.ai=0;DU.qs=[];
 for(var k=0;k<DU.per;k++)DU.qs.push(duelQ(DU.subject,DU.level,DU.age));
 duelRenderQ();
}
function duelRenderQ(){
 if(DU.i>=DU.per)return duelLevelEnd();
 var q=DU.qs[DU.i];var order=shuffled(q.ops.map(function(o,i){return{o:o,i:i};}));DU.order=order;DU.a=q.a;
 var sc='<div style="display:flex;justify-content:center;gap:18px;font-family:Fredoka;font-weight:800;margin-bottom:8px"><span style="color:var(--kid-blue)">🧒 Tú '+DU.kid+'</span><span style="color:var(--kid-red)">🤖 IA '+DU.ai+'</span></div>';
 render(topbar("gameDuel()")
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:4px">🤖 Duelo · Nivel '+DU.level+'</h2>'
  +sc
  +'<div class="progressdots">'+dots(DU.per,DU.i)+'</div>'
  +(q.pic?'<div class="bigpic">'+q.pic+'</div>':'')
  +'<div class="bigq center">'+esc(q.q)+'</div>'
  +(q.word?'<button class="speaker small" onclick="speakEN(\''+esc(q.word).replace(/'/g,"")+'\')">🔊 '+esc(q.word)+'</button>':'')
  +'<div class="choices2">'+order.map(function(s,vi){return '<button class="kbtn white" style="font-size:clamp(1.15rem,5vw,1.45rem)" onclick="duelAns('+vi+')">'+esc(s.o)+'</button>';}).join("")+'</div>');
 if(q.word)setTimeout(function(){speakEN(q.word.replace(/'/g,""));},300);
}
function duelAns(vi){
 var q=DU.qs[DU.i];var ok=DU.order[vi].i===DU.a;
 var subj=DU.subject==="mate"?"Mate":DU.subject==="ingles"?"Inglés":"La naturaleza";
 recordAnswer(subj,ok,12);
 if(ok){sOK();confetti(6);DU.kid++;}else{sNO();}
 var p=Math.min(0.85,0.42+DU.level*0.05);var aiOk=Math.random()<p;if(aiOk)DU.ai++;
 toast((ok?"¡Bien! ":"Era: "+q.ops[q.a]+" · ")+"🤖 "+(aiOk?"acertó":"falló"),ok,1500);
 DU.i++;setTimeout(duelRenderQ,ok?1150:1750);
}
function duelLevelEnd(){
 var win=DU.kid>DU.ai;
 if(win){
  var p=prof();if(p){p.coins+=DU.level*4;p.xp+=DU.level*8;save();}
  sWIN();confetti(30);
  if(DU.level>=DU.maxLevel){
   return render(topbar("gameDuel()")+'<div class="card endcard"><div class="big">🏆</div><h2>¡Campeón!</h2><p style="font-size:1.1rem;margin:8px 0">¡Venciste a la IA en todos los niveles!</p><button class="kbtn green" onclick="gameDuel()">Jugar otra materia</button><button class="kbtn white" onclick="screenKidMap()">Al mapa 🌍</button></div>');
  }
  DU.level++;
  return render(topbar("gameDuel()")+'<div class="card endcard"><div class="big">🏆</div><h2>¡Ganaste el nivel!</h2><p style="font-size:1.1rem;margin:8px 0">🧒 Tú '+DU.kid+' · 🤖 IA '+DU.ai+'</p><button class="kbtn green" onclick="duelLevel()">Siguiente nivel ('+DU.level+') →</button><button class="kbtn white" onclick="gameDuel()">Cambiar materia</button></div>');
 }
 sNO();
 render(topbar("gameDuel()")+'<div class="card endcard"><div class="big">🤖</div><h2>La IA ganó este nivel</h2><p style="font-size:1.1rem;margin:8px 0">🧒 Tú '+DU.kid+' · 🤖 IA '+DU.ai+'</p><p>¡Casi! Inténtalo otra vez 💪</p><button class="kbtn green" onclick="duelLevel()">Reintentar nivel →</button><button class="kbtn white" onclick="gameDuel()">Cambiar materia</button></div>');
}

/* ============ TRIVIA DIVERTIDA (estilo apps IA para niños, en español, para menores de 9) ============ */
/* Con clave de Gemini genera preguntas nuevas infinitas; sin clave usa un banco fiable. */
const KTRIVIA={
 dino:{ic:"🦕",nm:"Dinosaurios",qs:[
  {q:"¿Qué comía el Tiranosaurio Rex?",ops:["Carne","Flores","Piedras"],a:0},
  {q:"¿Cómo nacían los bebés dinosaurio?",ops:["De huevos","De la nieve","De las nubes"],a:0},
  {q:"¿Qué dinosaurio tenía el cuello muy largo?",ops:["Braquiosaurio","Tiranosaurio","Velociraptor"],a:0},
  {q:"¿Qué tenía el Triceratops en la cabeza?",ops:["Cuernos","Alas","Cabello"],a:0},
  {q:"¿Los dinosaurios viven hoy con nosotros?",ops:["No, se extinguieron","Sí, en la ciudad","Sí, en casa"],a:0},
  {q:"¿Dónde vivían los dinosaurios?",ops:["En la Tierra hace mucho","En la Luna","En el mar de hoy"],a:0},
  {q:"¿Cómo era la piel de muchos dinosaurios?",ops:["Con escamas","De lana","De plumas suaves"],a:0}]},
 animales:{ic:"🐾",nm:"Animales",qs:[
  {q:"¿Qué animal dice 'muu'?",ops:["La vaca","El perro","El gato"],a:0},
  {q:"¿Cuántas patas tiene una araña?",ops:["8","4","2"],a:0},
  {q:"¿Qué animal puede volar?",ops:["El pájaro","El pez","La serpiente"],a:0},
  {q:"¿Dónde vive el pez?",ops:["En el agua","En el árbol","En el desierto"],a:0},
  {q:"¿Quién es el rey de la selva?",ops:["El león","El ratón","El conejo"],a:0},
  {q:"¿Qué animal lleva su casa a cuestas?",ops:["El caracol","El perro","El caballo"],a:0},
  {q:"¿Qué come el conejo?",ops:["Zanahorias","Carne","Piedras"],a:0}]},
 espacio:{ic:"🚀",nm:"El espacio",qs:[
  {q:"¿Qué vemos en el cielo de noche?",ops:["Estrellas","Peces","Flores"],a:0},
  {q:"¿Cómo se llama nuestro planeta?",ops:["La Tierra","Marte","El Sol"],a:0},
  {q:"¿Qué es el Sol?",ops:["Una estrella","Una nube","Una montaña"],a:0},
  {q:"¿Quién viaja al espacio?",ops:["El astronauta","El bombero","El panadero"],a:0},
  {q:"¿En qué viajamos al espacio?",ops:["En un cohete","En bicicleta","En barco"],a:0},
  {q:"¿Cuándo vemos la Luna?",ops:["De noche","En el mar","En la sopa"],a:0}]},
 mar:{ic:"🌊",nm:"El mar",qs:[
  {q:"¿Quién vive en el mar?",ops:["El pez","La vaca","La gallina"],a:0},
  {q:"¿Qué animal enorme vive en el mar?",ops:["La ballena","El elefante","La jirafa"],a:0},
  {q:"¿De qué color se ve el mar?",ops:["Azul","Rojo","Morado"],a:0},
  {q:"¿Qué tiene el pulpo?",ops:["Muchos brazos","Alas","Ruedas"],a:0},
  {q:"¿Dónde encontramos conchas?",ops:["En la playa","En el cielo","En el bosque"],a:0},
  {q:"¿Qué tiene el tiburón en la boca?",ops:["Muchos dientes","Pelos","Zapatos"],a:0}]},
 comida:{ic:"🍎",nm:"La comida",qs:[
  {q:"¿Cuál de estas es una fruta?",ops:["La manzana","La silla","El zapato"],a:0},
  {q:"¿Qué es más sano comer?",ops:["Verduras","Muchos dulces","Piedritas"],a:0},
  {q:"¿De dónde sale la leche?",ops:["De la vaca","Del árbol","Del carro"],a:0},
  {q:"¿Qué fruta es amarilla y curva?",ops:["El banano","La uva","La sandía"],a:0},
  {q:"¿Qué bebemos cuando tenemos sed?",ops:["Agua","Aceite","Barro"],a:0},
  {q:"¿Con qué se hace el pan?",ops:["Con harina","Con arena","Con hojas"],a:0}]},
 colores:{ic:"🌈",nm:"Colores y formas",qs:[
  {q:"¿De qué color es el cielo de día?",ops:["Azul","Negro","Café"],a:0},
  {q:"¿Cuántos lados tiene un triángulo?",ops:["3","4","6"],a:0},
  {q:"¿De qué color es el pasto?",ops:["Verde","Rosado","Azul"],a:0},
  {q:"¿Qué forma tiene una pelota?",ops:["Redonda","Cuadrada","Triángulo"],a:0},
  {q:"Si mezclas azul y amarillo, ¿qué color sale?",ops:["Verde","Rojo","Negro"],a:0},
  {q:"¿De qué color es una naranja?",ops:["Naranja","Azul","Gris"],a:0}]}};
let KT={};
function gameKidTrivia(){setTheme("kid");
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:4px">🧠 Trivia Divertida</h2>'
 +'<p class="center" style="font-size:.95rem;margin-bottom:12px">Elige un tema y responde. '+(S.geminiKey?'La IA inventa preguntas nuevas cada vez 🤖':'¡A ver cuántas aciertas!')+'</p>'
 +Object.keys(KTRIVIA).map(function(k){var c=["green","red","blue","purple","yellow","white"][Object.keys(KTRIVIA).indexOf(k)%6];
   return '<button class="kbtn '+c+'" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="ktStart(\''+k+'\')"><span style="font-size:1.9rem">'+KTRIVIA[k].ic+'</span> <span style="flex:1">'+KTRIVIA[k].nm+'</span></button>';}).join(""));}
async function ktStart(theme){
 KT={theme:theme,i:0,score:0,qs:[]};setTheme("kid");
 if(S.geminiKey){
  render(topbar("gameKidTrivia()")+'<div class="card center" style="padding:22px"><div style="font-size:2.4rem" class="spin">⏳</div><p style="margin-top:8px">La IA está creando preguntas de <b>'+KTRIVIA[theme].nm+'</b>…</p></div>');
  try{
   var seen=aiSeenList("kt_"+theme).slice(-18);
   var obj=await geminiJSON('Crea 6 preguntas de trivia MUY FÁCILES y divertidas para un niño de 6 a 8 años, en español sencillo y alegre, sobre el tema "'+KTRIVIA[theme].nm+'". Cada pregunta con 3 opciones y una sola correcta. Preguntas cortas y claras. NO repitas estas: '+(seen.join(" | ")||"(ninguna)")+'. Responde SOLO JSON: {"qs":[{"q":"...","ops":["..","..",".."],"a":0}]} con exactamente 6 preguntas.');
   var qs=(obj.qs||[]).filter(function(q){return q&&q.q&&q.ops&&q.ops.length>=2&&typeof q.a==="number"&&q.a>=0&&q.a<q.ops.length;});
   if(qs.length>=3){aiRemember("kt_"+theme,qs.map(function(q){return q.q;}));KT.qs=qs.slice(0,6).map(function(q){return {q:q.q,ops:q.ops.slice(),a:q.a};});return ktRender();}
  }catch(e){/* si falla la IA, usamos el banco sin molestar al niño */}
 }
 KT.qs=shuffled(KTRIVIA[theme].qs.slice()).slice(0,6).map(function(q){return {q:q.q,ops:q.ops.slice(),a:q.a};});
 ktRender();}
function ktRender(){
 if(KT.i>=KT.qs.length)return ktEnd();
 var q=KT.qs[KT.i];var order=shuffled(q.ops.map(function(o,idx){return {o:o,idx:idx};}));KT.order=order;KT.a=q.a;
 render(topbar("gameKidTrivia()")
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:4px">'+KTRIVIA[KT.theme].ic+' '+KTRIVIA[KT.theme].nm+'</h2>'
 +'<div class="progressdots">'+dots(KT.qs.length,KT.i)+'</div>'
 +'<div class="bigq center">'+esc(q.q)+'</div>'
 +'<div class="choices2">'+order.map(function(s,vi){return '<button class="kbtn white" style="font-size:clamp(1.1rem,4.8vw,1.4rem)" onclick="ktAns('+vi+')">'+esc(s.o)+'</button>';}).join("")+'</div>');}
function ktAns(vi){
 var q=KT.qs[KT.i];var ok=KT.order[vi].idx===KT.a;
 recordAnswer("Lógica",ok,10);
 if(ok){sOK();confetti(6);KT.score++;toast("¡Correcto! 🎉",true,1100);}else{sNO();toast("Era: "+q.ops[q.a],false,1600);}
 KT.i++;setTimeout(ktRender,ok?1000:1650);}
function ktEnd(){
 var p=prof();if(p){p.coins+=KT.score;p.xp+=KT.score*3;save();}
 sWIN();confetti(24);
 render(topbar("gameKidTrivia()")+'<div class="card endcard"><div class="big">🏆</div><h2>¡'+KT.score+' de '+KT.qs.length+'!</h2><p style="font-size:1.1rem;margin:8px 0">Ganaste '+KT.score+' 🪙</p><button class="kbtn green" onclick="gameKidTrivia()">Otra trivia 🧠</button><button class="kbtn white" onclick="screenKidMap()">Al mapa 🌍</button></div>');}


/* ============ PENALES MATEMATICOS v2 (jugadores originales, niveles que suben, cuenta regresiva) ============ */
let PN={};
const PN_PLAYERS=[
 {n:"Rayo",skin:"#FCD9B6",hair:"#F59E0B",style:"spiky",kit:["#EF4444","#991B1B"]},
 {n:"Toro",skin:"#8D5524",hair:"#111827",style:"short",kit:["#3B82F6","#1E3A8A"]},
 {n:"Kili",skin:"#C68642",hair:"#3B2410",style:"curly",kit:["#22C55E","#15803D"]},
 {n:"Luna",skin:"#FFDFC4",hair:"#7C3AED",style:"pony",kit:["#FACC15","#A16207"]}];
const PN_BUB=[[95,118],[180,112],[265,118]];
/* retrato (busto de frente) para elegir jugador */
function pnBust(p){
 let hair="";
 if(p.style==="spiky")hair='<path d="M-16 -6 L-13 -16 L-8 -8 L-4 -18 L0 -9 L4 -18 L8 -8 L13 -16 L16 -6 L16 0 L-16 0 Z" fill="'+p.hair+'"/>';
 else if(p.style==="short")hair='<path d="M-16 -4 Q-16 -18 0 -18 Q16 -18 16 -4 L16 -2 Q8 -10 0 -10 Q-8 -10 -16 -2 Z" fill="'+p.hair+'"/>';
 else if(p.style==="curly")hair='<circle cx="-10" cy="-10" r="7" fill="'+p.hair+'"/><circle cx="0" cy="-13" r="8" fill="'+p.hair+'"/><circle cx="10" cy="-10" r="7" fill="'+p.hair+'"/><circle cx="-15" cy="-3" r="5" fill="'+p.hair+'"/><circle cx="15" cy="-3" r="5" fill="'+p.hair+'"/>';
 else hair='<path d="M-16 -4 Q-16 -18 0 -18 Q16 -18 16 -4 L16 -2 Q8 -10 0 -10 Q-8 -10 -16 -2 Z" fill="'+p.hair+'"/><ellipse cx="19" cy="8" rx="5" ry="12" fill="'+p.hair+'"/>';
 return '<svg viewBox="-30 -34 60 66" style="width:100%;display:block">'
 +'<rect x="-24" y="14" width="48" height="20" rx="9" fill="'+p.kit[0]+'" stroke="#1E2A4A" stroke-width="2.2"/>'
 +'<rect x="-24" y="24" width="10" height="10" rx="4" fill="'+p.kit[1]+'"/><rect x="14" y="24" width="10" height="10" rx="4" fill="'+p.kit[1]+'"/>'
 +'<text x="0" y="30" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="800" font-size="11" fill="#fff">7</text>'
 +'<circle cx="0" cy="0" r="15" fill="'+p.skin+'" stroke="#1E2A4A" stroke-width="2.2"/>'
 +hair
 +'<circle cx="-5" cy="1" r="1.9" fill="#1E2A4A"/><circle cx="5" cy="1" r="1.9" fill="#1E2A4A"/>'
 +'<path d="M-4 7 Q0 10 4 7" stroke="#1E2A4A" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
 +'<circle cx="-9" cy="5" r="2.4" fill="rgba(244,114,182,.5)"/><circle cx="9" cy="5" r="2.4" fill="rgba(244,114,182,.5)"/>'
 +'</svg>';}
function gamePenalty(){setTheme("kid");if(PN.tick)clearInterval(PN.tick);
 PN={player:PN.player||0,tick:null};
 const card=(i)=>{const p=PN_PLAYERS[i];
  return '<button type="button" id="pnp'+i+'" onclick="pnPick('+i+')" style="border:4px solid '+(i===PN.player?"#1E2A4A":"rgba(30,42,74,.12)")+';background:#fff;border-radius:18px;padding:8px 6px 5px;cursor:pointer;box-shadow:0 4px 0 rgba(30,42,74,.15)">'
  +pnBust(p)+'<div style="font-family:Fredoka;font-weight:800;font-size:.95rem;color:#1E2A4A;margin-top:3px">'+p.n+'</div></button>';};
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:2px">⚽ Penales Matemáticos</h2>'
 +'<p class="center" style="margin-bottom:12px">Elige tu jugador y la dificultad</p>'
 +'<p style="font-family:Fredoka;font-weight:700;margin:4px 2px">Jugador</p>'
 +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:12px">'+[0,1,2,3].map(card).join("")+'</div>'
 +'<p style="font-family:Fredoka;font-weight:700;margin:4px 2px">Dificultad <span style="font-size:.8rem;opacity:.7;font-weight:600">(y dentro del partido va subiendo de nivel)</span></p>'
 +'<button class="kbtn green" onclick="pnStart(0)">🟢 Fácil <span style="opacity:.8;font-size:.85rem">· 1° a 3°</span></button>'
 +'<button class="kbtn yellow" onclick="pnStart(1)">🟡 Intermedio <span style="opacity:.8;font-size:.85rem">· 4° y 5°</span></button>'
 +'<button class="kbtn red" onclick="pnStart(2)">🔴 Difícil <span style="opacity:.8;font-size:.85rem">· ¡reto total!</span></button>');}
function pnPick(i){PN.player=i;for(let k=0;k<4;k++){const el=document.getElementById("pnp"+k);if(el)el.style.borderColor=(k===i)?"#1E2A4A":"rgba(30,42,74,.12)";}}
/* preguntas: la dificultad base la da el modo, y el NIVEL (1-5) las hace crecer */
function pnQ(diff,lvl){
 let a,b,ans,txt;lvl=lvl||1;
 if(diff===0){
  const max=8+lvl*5; // nivel 1: hasta 13 · nivel 5: hasta 33
  if(Math.random()<.5){a=2+rnd(max-4);b=1+rnd(Math.min(max-a,12));ans=a+b;txt=a+" + "+b;}
  else{a=4+rnd(max);b=1+rnd(a-1);ans=a-b;txt=a+" − "+b;}}
 else if(diff===1){const r=rnd(3);
  const top=30+lvl*15;
  if(r===0){a=11+rnd(top);b=10+rnd(top);ans=a+b;txt=a+" + "+b;}
  else if(r===1){a=25+rnd(top+20);b=11+rnd(a-12);ans=a-b;txt=a+" − "+b;}
  else{a=2+rnd(4+lvl);b=2+rnd(7);ans=a*b;txt=a+" × "+b;}}
 else{const r=rnd(3);
  if(r===0){a=8+lvl*3+rnd(10);b=2+rnd(3+Math.min(lvl,4));ans=a*b;txt=a+" × "+b;}
  else if(r===1){b=2+rnd(5+Math.min(lvl,4));ans=2+rnd(7+lvl);a=b*ans;txt=a+" ÷ "+b;}
  else{a=100+lvl*80+rnd(300);b=90+rnd(200+lvl*60);ans=a+b;txt=a+" + "+b;}}
 const set=new Set([ans]);
 while(set.size<3){const d=ans+(1+rnd(Math.max(4,Math.round(ans*0.2))))*(Math.random()<.5?-1:1);if(d>=0&&d!==ans)set.add(d);}
 const ops=shuffled([...set]);
 return{txt,ans,ops,a:ops.indexOf(ans)};}
function pnCrowd(){
 const cols=["#F87171","#FBBF24","#60A5FA","#34D399","#F472B6","#A78BFA","#FDE68A"];let s="";
 for(let r=0;r<3;r++)for(let i=0;i<24;i++){const x=12+i*14.5+(r%2)*7,y=14+r*13;
  s+='<circle cx="'+x+'" cy="'+y+'" r="4.2" fill="'+cols[(i*3+r*5)%7]+'" opacity=".85"/>';}
 return s;}
/* pelo de espaldas segun estilo */
function pnHairBack(p){
 if(p.style==="spiky")return '<path d="M-14 -40 L-11 -52 L-6 -44 L-2 -55 L2 -46 L6 -55 L10 -44 L14 -52 L14 -34 Q0 -46 -14 -34 Z" fill="'+p.hair+'"/>';
 if(p.style==="curly")return '<circle cx="-9" cy="-49" r="7" fill="'+p.hair+'"/><circle cx="0" cy="-52" r="8" fill="'+p.hair+'"/><circle cx="9" cy="-49" r="7" fill="'+p.hair+'"/><circle cx="-13" cy="-42" r="6" fill="'+p.hair+'"/><circle cx="13" cy="-42" r="6" fill="'+p.hair+'"/><circle cx="0" cy="-42" r="8" fill="'+p.hair+'"/>';
 if(p.style==="pony")return '<path d="M-14 -42 Q-14 -56 0 -56 Q14 -56 14 -42 L14 -30 Q0 -40 -14 -30 Z" fill="'+p.hair+'"/><path d="M-3 -44 Q0 -30 -2 -18" stroke="'+p.hair+'" stroke-width="7" fill="none" stroke-linecap="round"/>';
 return '<path d="M-14 -42 Q-14 -56 0 -56 Q14 -56 14 -42 L14 -32 Q0 -44 -14 -32 Z" fill="'+p.hair+'"/>';}
function pnScene(){
 const p=PN_PLAYERS[PN.player];const k=p.kit;
 return '<svg id="pnsvg" viewBox="0 0 360 400" style="width:100%;display:block;border-radius:18px;border:4px solid var(--kid-ink);box-shadow:0 8px 0 rgba(30,42,74,.5)" xmlns="http://www.w3.org/2000/svg">'
 +'<defs>'
 +'<linearGradient id="pnsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7DD3FC"/><stop offset="1" stop-color="#BAE6FD"/></linearGradient>'
 +'<linearGradient id="pngrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4ADE80"/><stop offset="1" stop-color="#22C55E"/></linearGradient>'
 +'<pattern id="pnnet" width="13" height="13" patternUnits="userSpaceOnUse"><path d="M0 0H13M0 0V13" stroke="rgba(255,255,255,.75)" stroke-width="1.6"/></pattern>'
 +'</defs>'
 +'<rect width="360" height="250" fill="url(#pnsky)"/>'
 +'<rect y="0" width="360" height="52" fill="#1E3A5F"/>'+pnCrowd()
 +'<rect y="250" width="360" height="150" fill="url(#pngrass)"/>'
 +[0,1,2,3].map(i=>'<rect y="'+(250+i*38)+'" width="360" height="19" fill="rgba(255,255,255,.07)"/>').join("")
 +'<ellipse cx="180" cy="330" rx="120" ry="12" fill="rgba(0,0,0,.08)"/>'
 +'<rect x="52" y="88" width="256" height="150" fill="url(#pnnet)" opacity=".9"/>'
 +'<rect x="46" y="82" width="10" height="162" rx="4" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>'
 +'<rect x="304" y="82" width="10" height="162" rx="4" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>'
 +'<rect x="46" y="80" width="268" height="10" rx="4" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>'
 /* arquero: naranja, brazos arriba con guantes grandes */
 +'<g id="pnkeeper" style="transition:transform .5s cubic-bezier(.4,1.6,.6,1)"><g transform="translate(180,196)">'
 +'<rect x="-27" y="-34" width="10" height="26" rx="5" fill="#FB923C" stroke="#1E2A4A" stroke-width="2" transform="rotate(18 -22 -21)"/>'
 +'<rect x="17" y="-34" width="10" height="26" rx="5" fill="#FB923C" stroke="#1E2A4A" stroke-width="2" transform="rotate(-18 22 -21)"/>'
 +'<circle cx="-27" cy="-36" r="6.5" fill="#F1F5F9" stroke="#1E2A4A" stroke-width="2"/>'
 +'<circle cx="27" cy="-36" r="6.5" fill="#F1F5F9" stroke="#1E2A4A" stroke-width="2"/>'
 +'<rect x="-16" y="-14" width="32" height="34" rx="9" fill="#FB923C" stroke="#1E2A4A" stroke-width="2.5"/>'
 +'<rect x="-16" y="-14" width="32" height="8" rx="4" fill="rgba(255,255,255,.35)"/>'
 +'<text x="0" y="8" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="800" font-size="13" fill="#fff" stroke="#1E2A4A" stroke-width=".5">1</text>'
 +'<rect x="-13" y="20" width="10" height="16" rx="4" fill="#0F172A"/><rect x="3" y="20" width="10" height="16" rx="4" fill="#0F172A"/>'
 +'<circle cx="0" cy="-26" r="12.5" fill="#EAB995" stroke="#1E2A4A" stroke-width="2.5"/>'
 +'<path d="M-12 -30 Q-12 -42 0 -42 Q12 -42 12 -30 L12 -28 Q0 -36 -12 -28 Z" fill="#1F2937"/>'
 +'<circle cx="-4.5" cy="-26" r="1.8" fill="#1E2A4A"/><circle cx="4.5" cy="-26" r="1.8" fill="#1E2A4A"/>'
 +'<path d="M-3 -20 Q0 -18 3 -20" stroke="#1E2A4A" stroke-width="1.5" fill="none" stroke-linecap="round"/>'
 +'</g></g>'
 +'<g id="pnbubs"></g>'
 /* delantero de espaldas: colores y peinado del jugador elegido */
 +'<g id="pnstriker"><g transform="translate(180,318)">'
 +'<rect x="-19" y="-26" width="38" height="42" rx="11" fill="'+k[0]+'" stroke="#1E2A4A" stroke-width="2.5"/>'
 +'<path d="M-19 -26 L-19 -14 L-8 -26 Z" fill="'+k[1]+'"/><path d="M19 -26 L19 -14 L8 -26 Z" fill="'+k[1]+'"/>'
 +'<text x="0" y="2" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="800" font-size="18" fill="#fff" stroke="#1E2A4A" stroke-width=".6">7</text>'
 +'<rect x="-15" y="16" width="30" height="14" rx="5" fill="'+k[1]+'" stroke="#1E2A4A" stroke-width="2"/>'
 +'<rect x="-12" y="30" width="9" height="15" rx="4" fill="'+p.skin+'"/><rect x="3" y="30" width="9" height="15" rx="4" fill="'+p.skin+'"/>'
 +'<rect x="-13" y="41" width="11" height="11" rx="3" fill="'+k[0]+'" stroke="#1E2A4A" stroke-width="1.8"/><rect x="2" y="41" width="11" height="11" rx="3" fill="'+k[0]+'" stroke="#1E2A4A" stroke-width="1.8"/>'
 +'<rect x="-16" y="50" width="15" height="6" rx="3" fill="#0F172A"/><rect x="1" y="50" width="15" height="6" rx="3" fill="#0F172A"/>'
 +'<rect x="-26" y="-22" width="8" height="24" rx="4" fill="'+k[0]+'" stroke="#1E2A4A" stroke-width="2"/>'
 +'<rect x="18" y="-22" width="8" height="24" rx="4" fill="'+k[0]+'" stroke="#1E2A4A" stroke-width="2"/>'
 +'<circle cx="-22" cy="4" r="4.5" fill="'+p.skin+'"/><circle cx="22" cy="4" r="4.5" fill="'+p.skin+'"/>'
 +'<circle cx="0" cy="-40" r="14" fill="'+p.skin+'" stroke="#1E2A4A" stroke-width="2.5"/>'
 +pnHairBack(p)
 +'</g></g>'
 +'<g id="pnball" style="transition:transform .45s cubic-bezier(.3,.9,.6,1)"><g>'
 +'<circle cx="0" cy="0" r="10" fill="#fff" stroke="#1E2A4A" stroke-width="2.5"/>'
 +'<circle cx="0" cy="0" r="3.4" fill="#1E2A4A"/><circle cx="-6" cy="-4" r="2" fill="#1E2A4A"/><circle cx="6" cy="-4" r="2" fill="#1E2A4A"/><circle cx="-5" cy="5" r="2" fill="#1E2A4A"/><circle cx="5" cy="5" r="2" fill="#1E2A4A"/>'
 +'</g></g>'
 +'</svg>';}
function pnStart(diff){
 if(PN.tick)clearInterval(PN.tick);
 PN.diff=diff;PN.shot=0;PN.goals=0;PN.streak=0;PN.total=10;PN.lock=false;PN.level=1;
 setTheme("kid");
 const pill=(ic,lb,id,v)=>'<div style="flex:1;background:#1E3A5F;border-radius:14px;padding:8px 6px;text-align:center;color:#fff"><div style="font-size:.68rem;letter-spacing:.05em;opacity:.8;font-family:Fredoka;font-weight:700">'+ic+' '+lb+'</div><div id="'+id+'" style="font-family:Fredoka;font-weight:800;font-size:1.25rem">'+v+'</div></div>';
 render(topbar("gamePenalty()")
 +'<div style="display:flex;gap:7px;margin-bottom:8px">'+pill("🏆","GOLES","pngoals",0)+pill("🔥","RACHA","pnstreak",0)+pill("⭐","NIVEL","pnlevel",1)+pill("⏱️","TIEMPO","pntime","–")+'</div>'
 +'<div style="background:#FACC15;border:3px solid var(--kid-ink);border-radius:14px;padding:7px 12px;text-align:center;margin-bottom:6px;box-shadow:0 4px 0 rgba(30,42,74,.4)"><span style="font-size:.68rem;letter-spacing:.08em;font-family:Fredoka;font-weight:700;opacity:.7">RESUELVE · <span id="pnshot">TIRO 1/10</span></span><div id="pnqt" style="font-family:Fredoka;font-weight:800;font-size:1.7rem;line-height:1.1">…</div></div>'
 +'<div class="timerbar" style="background:rgba(30,42,74,.15);height:9px;margin:0 0 8px"><div id="pntb" style="width:100%;height:100%;border-radius:999px;background:linear-gradient(90deg,#22C55E,#FACC15);transition:width .1s linear"></div></div>'
 +pnScene()
 +'<div id="pnbanner" style="display:none;position:fixed;left:50%;top:42%;transform:translate(-50%,-50%);z-index:50;background:#FACC15;border:4px solid var(--kid-ink);border-radius:20px;padding:14px 26px;font-family:Fredoka;font-weight:800;font-size:1.6rem;box-shadow:0 10px 0 rgba(30,42,74,.35);text-align:center"></div>'
 +'<p class="center" style="margin-top:8px;font-size:.85rem">Toca el número correcto para meter gol ⚽</p>');
 pnNext();}
function pnNext(){
 if(PN.tick)clearInterval(PN.tick);
 if(PN.shot>=PN.total)return pnEnd();
 PN.level=1+Math.min(4,Math.floor(PN.goals/2)); // sube de nivel cada 2 goles
 PN.q=pnQ(PN.diff,PN.level);PN.lock=false;
 const qt=document.getElementById("pnqt");if(qt)qt.textContent=PN.q.txt;
 const sh=document.getElementById("pnshot");if(sh)sh.textContent="TIRO "+(PN.shot+1)+"/10";
 const lv=document.getElementById("pnlevel");if(lv)lv.textContent=PN.level;
 const bb=document.getElementById("pnbubs");
 if(bb)bb.innerHTML=PN.q.ops.map((o,i)=>'<g onclick="pnShoot('+i+')" style="cursor:pointer"><circle cx="'+PN_BUB[i][0]+'" cy="'+PN_BUB[i][1]+'" r="24" fill="#FACC15" stroke="#fff" stroke-width="4"/><circle cx="'+PN_BUB[i][0]+'" cy="'+PN_BUB[i][1]+'" r="24" fill="none" stroke="#1E2A4A" stroke-width="2"/><text x="'+PN_BUB[i][0]+'" y="'+(PN_BUB[i][1]+6)+'" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="800" font-size="'+(String(o).length>3?13:16)+'" fill="#1E2A4A">'+o+'</text></g>').join("");
 const ball=document.getElementById("pnball"),kp=document.getElementById("pnkeeper");
 if(ball){ball.style.transition="none";ball.style.transform="translate(180px,332px)";void ball.getBoundingClientRect();ball.style.transition="transform .45s cubic-bezier(.3,.9,.6,1)";}
 if(kp){kp.style.transition="none";kp.style.transform="translate(0,0)";void kp.getBoundingClientRect();kp.style.transition="transform .5s cubic-bezier(.4,1.6,.6,1)";}
 /* cuenta regresiva en segundos (numero) + barra */
 PN.secs=PN.diff===0?12:10;PN.left=PN.secs;
 const tb=document.getElementById("pntb");if(tb)tb.style.width="100%";
 const tm=document.getElementById("pntime");if(tm){tm.textContent=PN.secs;tm.style.color="#fff";}
 PN.tick=setInterval(()=>{PN.left-=0.1;
  const el=document.getElementById("pntb"),t2=document.getElementById("pntime");
  if(!el){clearInterval(PN.tick);return;}
  el.style.width=Math.max(0,PN.left/PN.secs*100)+"%";
  if(t2){const s=Math.max(0,Math.ceil(PN.left));t2.textContent=s;t2.style.color=s<=3?"#F87171":"#fff";}
  if(PN.left<=0){clearInterval(PN.tick);pnTimeout();}},100);}
function pnBanner(txt,ms,cb){const b=document.getElementById("pnbanner");if(!b){if(cb)cb();return;}
 b.innerHTML=txt;b.style.display="block";setTimeout(()=>{b.style.display="none";if(cb)cb();},ms);}
function pnTimeout(){
 if(PN.lock)return;PN.lock=true;PN.streak=0;sNO();recordAnswer("Mate",false,12);
 const st=document.getElementById("pnstreak");if(st)st.textContent=0;
 PN.shot++;pnBanner("⏱️ ¡Tiempo! Era "+PN.q.ans,1500,pnNext);}
function pnShoot(i){
 if(PN.lock)return;PN.lock=true;if(PN.tick)clearInterval(PN.tick);
 const ok=(i===PN.q.a);
 const tx=PN_BUB[i][0],ty=PN_BUB[i][1];
 const ball=document.getElementById("pnball"),kp=document.getElementById("pnkeeper");
 if(ball)ball.style.transform="translate("+tx+"px,"+ty+"px)";
 const wrong=[0,1,2].filter(x=>x!==i);const dive=ok?wrong[rnd(2)]:i;
 const dx=PN_BUB[dive][0]-180,dy=PN_BUB[dive][1]-196+26;
 if(kp)kp.style.transform="translate("+dx*0.82+"px,"+Math.min(0,dy)*0.55+"px) rotate("+(dx<0?-32:dx>0?32:0)+"deg)";
 recordAnswer("Mate",ok,12);
 setTimeout(()=>{
  PN.shot++;
  if(ok){const lvlBefore=PN.level;PN.goals++;PN.streak++;sWIN();confetti(16);
   const g=document.getElementById("pngoals"),s=document.getElementById("pnstreak");
   if(g)g.textContent=PN.goals;if(s)s.textContent=PN.streak;
   const p=prof();if(p){p.coins+=1+(PN.streak>=3?1:0);p.xp+=3+PN.level;save();}
   const lvlAfter=1+Math.min(4,Math.floor(PN.goals/2));
   const up=lvlAfter>lvlBefore?'<br><span style="font-size:1.05rem">⭐ ¡Subes al nivel '+lvlAfter+'!</span>':'';
   pnBanner("¡GOOOOL! ⚽"+(PN.streak>=3?" 🔥x"+PN.streak:"")+up,up?1800:1400,pnNext);}
  else{PN.streak=0;sNO();
   const s=document.getElementById("pnstreak");if(s)s.textContent=0;
   pnBanner("🧤 ¡Atajada! Era "+PN.q.ans,1600,pnNext);}
 },480);}
function pnEnd(){
 if(PN.tick)clearInterval(PN.tick);
 const st=PN.goals>=8?3:PN.goals>=5?2:1;
 if(PN.goals>=5){sWIN();confetti(30);}
 render(topbar("gamePenalty()")+'<div class="card endcard"><div class="big">'+(PN.goals>=8?"🏆":PN.goals>=5?"⚽":"🧤")+'</div>'
 +'<h2>'+PN.goals+' goles de '+PN.total+'</h2>'
 +'<p style="font-size:1.05rem;margin:8px 0">'+(PN.goals>=8?"¡Eres una estrella del fútbol matemático!":PN.goals>=5?"¡Muy buen partido!":"¡Sigue entrenando, campeón!")+' · Llegaste al nivel '+PN.level+'</p>'
 +'<div style="font-size:1.6rem;margin-bottom:10px">'+"⭐".repeat(st)+"☆".repeat(3-st)+'</div>'
 +'<button class="kbtn green" onclick="pnStart('+PN.diff+')">🔁 Jugar otra vez</button>'
 +'<button class="kbtn white" onclick="gamePenalty()">Cambiar jugador o dificultad</button>'
 +'<button class="kbtn white" onclick="exitGame(&quot;games&quot;)">Salir</button></div>');}

/* ============ DETECTIVE DEL IMPOSTOR (deduccion con bots + misiones de preguntas) ============ */
let DT={};
const DT_COLORS=[["#EF4444","Rojo",1],["#3B82F6","Azul",0],["#22C55E","Verde",0],["#FACC15","Amarillo",1],["#A855F7","Morado",0],["#F472B6","Rosado",1]]; // [hex,nombre,esCalido]
const DT_HATS=[["gorra","una gorra"],["sombrero","un sombrero"],["antena","una antena"],["nada","nada en la cabeza"]];
const DT_ITEMS=[["⚽","un balón"],["📘","un libro"],["🍦","un helado"],["🎈","un globo"]];
function dtSuspectSVG(s,dead){
 let hat="";
 if(s.hat==="gorra")hat='<path d="M-13 -21 Q-13 -30 0 -30 Q13 -30 13 -21 Z" fill="#1E3A8A"/><rect x="8" y="-24" width="14" height="5" rx="2.5" fill="#1E3A8A"/>';
 else if(s.hat==="sombrero")hat='<ellipse cx="0" cy="-22" rx="19" ry="5" fill="#78350F"/><path d="M-10 -22 Q-10 -34 0 -34 Q10 -34 10 -22 Z" fill="#92400E"/>';
 else if(s.hat==="antena")hat='<line x1="0" y1="-28" x2="0" y2="-38" stroke="#1E2A4A" stroke-width="2.5"/><circle cx="0" cy="-41" r="4" fill="#FDE047" stroke="#1E2A4A" stroke-width="2"/>';
 return '<svg viewBox="-30 -48 60 82" style="width:100%;display:block'+(dead?';filter:grayscale(1);opacity:.45':'')+'">'
 +'<ellipse cx="0" cy="28" rx="16" ry="4" fill="rgba(0,0,0,.12)"/>'
 +'<path d="M-14 -12 Q-14 -28 0 -28 Q14 -28 14 -12 L14 12 Q14 22 6 22 L-6 22 Q-14 22 -14 12 Z" fill="'+s.color+'" stroke="#1E2A4A" stroke-width="2.5"/>'
 +'<rect x="-9" y="22" width="7" height="6" rx="3" fill="'+s.color+'" stroke="#1E2A4A" stroke-width="2"/>'
 +'<rect x="2" y="22" width="7" height="6" rx="3" fill="'+s.color+'" stroke="#1E2A4A" stroke-width="2"/>'
 +'<circle cx="-5" cy="-10" r="2.6" fill="#1E2A4A"/><circle cx="5" cy="-10" r="2.6" fill="#1E2A4A"/>'
 +(dead?'<path d="M-6 0 Q0 -4 6 0" stroke="#1E2A4A" stroke-width="2" fill="none" stroke-linecap="round" transform="scale(1,-1) translate(0,2)"/>':'<path d="M-5 -2 Q0 2 5 -2" stroke="#1E2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>')
 +hat
 +'<text x="17" y="14" font-size="13" text-anchor="middle">'+s.item+'</text>'
 +(dead?'<text x="0" y="-2" font-size="26" text-anchor="middle">❌</text>':'')
 +'</svg>';}
function gameDetective(){setTheme("kid");
 // crear 6 sospechosos con atributos variados
 const hats=shuffled(["gorra","gorra","sombrero","sombrero","antena","nada"]);
 const items=shuffled(["⚽","⚽","📘","📘","🍦","🎈"]);
 DT={suspects:DT_COLORS.map((c,i)=>({color:c[0],nm:c[1],warm:c[2],hat:hats[i],item:items[i],out:false})),
  clueIdx:0,cluesShown:[],tasksOk:0,tasksTotal:0,over:false};
 DT.imp=rnd(6);
 const im=DT.suspects[DT.imp];
 // pistas: cada una elimina sospechosos; el orden garantiza llegar a 1
 const pool=[];
 pool.push({t:"El impostor lleva "+DT_HATS.find(h=>h[0]===im.hat)[1]+".",f:s=>s.hat!==im.hat});
 pool.push({t:"El impostor tiene "+DT_ITEMS.find(x=>x[0]===im.item)[1]+" "+im.item+".",f:s=>s.item!==im.item});
 pool.push({t:"El impostor es de un color "+(im.warm?"CÁLIDO (rojo, amarillo o rosado)":"FRÍO (azul, verde o morado)")+".",f:s=>s.warm!==im.warm});
 pool.push({t:"¡Pista final! El impostor es de color "+im.nm.toUpperCase()+".",f:s=>s.nm!==im.nm});
 DT.clues=shuffled(pool.slice(0,3)).concat([pool[3]]);
 dtBoard();}
function dtAlive(){return DT.suspects.filter(s=>!s.out).length;}
function dtBoard(msg){
 setTheme("kid");
 const cards=DT.suspects.map((s,i)=>'<button '+(s.out?'disabled':'onclick="dtAccuse('+i+')"')+' style="background:#FFFEF8;border:4px solid '+(s.out?'rgba(30,42,74,.15)':'var(--kid-ink)')+';border-radius:18px;padding:8px 4px 4px;box-shadow:0 5px 0 rgba(30,42,74,'+(s.out?'.1':'.5')+')">'
  +dtSuspectSVG(s,s.out)
  +'<div style="font-family:Fredoka;font-weight:700;font-size:.85rem;color:#1E2A4A;'+(s.out?'text-decoration:line-through;opacity:.5':'')+'">'+s.nm+'</div></button>').join("");
 const clues=DT.cluesShown.length?'<div class="card" style="background:#FFF7E0;border:3px solid #F59E0B"><b style="font-family:Fredoka">🔎 Pistas:</b>'
  +DT.cluesShown.map(c=>'<p style="margin:6px 0;font-size:.95rem;line-height:1.4">• '+c+'</p>').join("")+'</div>':'';
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🕵️ Detective del impostor</h2>'
 +'<p class="center" style="font-size:.9rem;margin-bottom:10px">Hay un impostor entre los 6. Cumple <b>misiones</b> para ganar pistas y ¡acúsalo tocándolo!</p>'
 +(msg?'<div class="card center" style="padding:10px;background:#E8FBF0;border:3px solid #3EC97C;font-family:Fredoka;font-weight:700">'+msg+'</div>':'')
 +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:10px">'+cards+'</div>'
 +clues
 +(DT.clueIdx<DT.clues.length?'<button class="kbtn green" onclick="dtTask()">🛰️ Hacer misión (ganas una pista)</button>':'<p class="center" style="font-family:Fredoka;font-weight:700">¡Ya tienes todas las pistas! Acusa al impostor 👆</p>'));}
function dtGens(){
 const g=[];
 if(typeof genCultura==="function")g.push(genCultura);
 if(typeof genGeo==="function")g.push(genGeo);
 if(typeof genAlimentos==="function")g.push(genAlimentos);
 if(typeof genTierra==="function")g.push(genTierra);
 if(typeof genInfo==="function")g.push(genInfo);
 if(typeof genSistema==="function")g.push(genSistema);
 if(typeof genPoligono==="function")g.push(genPoligono);
 return g;}
function dtTask(){
 const gens=dtGens();const q=gens[rnd(gens.length)]();
 if(q.a===-1&&q.fixAns!==undefined)q.a=q.ops.indexOf(q.fixAns);
 DT.q=q;DT.order=shuffled(q.ops.map((o,i)=>({o:o,i:i})));
 render(topbar("gameDetectiveBack()")
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:4px">🛰️ Misión de conocimiento</h2>'
 +'<p class="center" style="font-size:.9rem;margin-bottom:8px">Responde bien y el detective te da una pista</p>'
 +(q.pic?'<div class="bigpic">'+q.pic+'</div>':'')
 +'<div class="bigq center">'+esc(q.q)+'</div>'
 +'<div class="choices2">'+DT.order.map((s,vi)=>'<button class="kbtn white" style="font-size:clamp(1.05rem,4.6vw,1.35rem)" onclick="dtAns('+vi+')">'+esc(s.o)+'</button>').join("")+'</div>');}
function gameDetectiveBack(){dtBoard();}
function dtAns(vi){
 const ok=DT.order[vi].i===DT.q.a;DT.tasksTotal++;
 recordAnswer("Lógica",ok,12);
 if(ok){DT.tasksOk++;sOK();confetti(8);
  const clue=DT.clues[DT.clueIdx];DT.clueIdx++;
  DT.cluesShown.push(clue.t);
  DT.suspects.forEach(s=>{if(clue.f(s))s.out=true;});
  // no eliminar jamás al impostor por error (f siempre lo respeta)
  setTimeout(()=>dtBoard("✅ ¡Misión cumplida! Nueva pista conseguida 🔎"),900);
  toast("¡Correcto! 🎉",true,850);}
 else{sNO();toast("Era: "+DT.q.ops[DT.q.a]+" — el impostor se escapó esta vez 😼",false,2000);
  setTimeout(()=>dtBoard("❌ Misión fallida. ¡Intenta otra misión!"),1900);}}
function dtAccuse(i){
 if(DT.over)return;
 const s=DT.suspects[i];
 if(!confirm("¿Acusar a "+s.nm+"? ¡Piénsalo bien, detective!"))return;
 DT.over=true;
 const win=(i===DT.imp);
 const im=DT.suspects[DT.imp];
 if(win){sWIN();confetti(30);
  const alive=dtAlive();
  const st=alive>=4?3:alive>=2?2:1; // acusar con menos pistas = más estrellas... al reves: acusar temprano con acierto = crack
  const p=prof();if(p){p.coins+=6+st*2;p.xp+=18;save();}
  render(topbar("exitGame('games')")+'<div class="card endcard"><div class="big">🎉</div><h2>¡Atrapaste al impostor!</h2>'
  +'<div style="max-width:110px;margin:8px auto">'+dtSuspectSVG(im,false)+'</div>'
  +'<p style="font-size:1.05rem;margin:8px 0">Era <b>'+im.nm+'</b> · Misiones: '+DT.tasksOk+'/'+DT.tasksTotal+'</p>'
  +'<div style="font-size:1.5rem;margin-bottom:8px">'+"⭐".repeat(st)+"☆".repeat(3-st)+'</div>'
  +'<button class="kbtn green" onclick="gameDetective()">🔁 Otro caso</button>'
  +'<button class="kbtn white" onclick="exitGame(&quot;games&quot;)">Salir</button></div>');}
 else{sNO();
  render(topbar("exitGame('games')")+'<div class="card endcard"><div class="big">😱</div><h2>¡Ese no era!</h2>'
  +'<p style="font-size:1.05rem;margin:8px 0">El impostor era <b>'+im.nm+'</b>…</p>'
  +'<div style="max-width:110px;margin:8px auto">'+dtSuspectSVG(im,false)+'</div>'
  +'<button class="kbtn green" onclick="gameDetective()">🔁 Nuevo caso</button>'
  +'<button class="kbtn white" onclick="exitGame(&quot;games&quot;)">Salir</button></div>');}}

/* ============ LABERINTO GLOTON (come-puntos con monstruitos; jugabilidad clasica, personajes originales) ============ */
let MZ={};
const MZ_MAP=[
"#############",
"#.....#.....#",
"#.##..#..##.#",
"#..#.....#..#",
"##.#.###.#.##",
"#....#G#....#",
"#.##.#.#.##.#",
"#.....F....G#",
"#.##.###.##.#",
"#..#.....#..#",
"##.#.#.#.#.##",
"#....#.#....#",
"#.##.#.#.##.#",
"#.....P.....#",
"#############"];
const MZ_DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function mzOpen(cx,cy){return MZ_MAP[cy]&&MZ_MAP[cy][cx]&&MZ_MAP[cy][cx]!=="#";}
function gameMaze(){setTheme("kid");
 MZ={score:0,lives:3,over:false,won:false,raf:0,last:0,dots:{},nDots:0,fruit:null,t:0};
 let px=6,py=13;const monsters=[];
 for(let y=0;y<MZ_MAP.length;y++)for(let x=0;x<MZ_MAP[y].length;x++){
  const ch=MZ_MAP[y][x];
  if(ch==="."){MZ.dots[x+","+y]=1;MZ.nDots++;}
  else if(ch==="F")MZ.fruit={x,y};
  else if(ch==="P"){px=x;py=y;}
  else if(ch==="G")monsters.push({x,y});
 }
 MZ.pl={fx:px,fy:py,tx:px,ty:py,t:1,dir:"left",want:"left",speed:3.1};
 MZ.mon=monsters.map((m,i)=>({fx:m.x,fy:m.y,tx:m.x,ty:m.y,t:1,dir:"down",speed:2.2+i*0.15,col:i?"#22D3EE":"#F472B6",home:{x:m.x,y:m.y}}));
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🟡 Laberinto glotón</h2>'
 +'<div style="display:flex;justify-content:center;gap:16px;font-family:Fredoka;font-weight:800;margin-bottom:6px"><span>⭐ <span id="mzscore">0</span></span><span id="mzlives">❤️❤️❤️</span></div>'
 +'<canvas id="mzcv" style="width:100%;max-width:390px;display:block;margin:0 auto;border-radius:14px;border:4px solid var(--kid-ink);touch-action:none;background:#0B1220"></canvas>'
 +'<div style="display:grid;grid-template-columns:repeat(3,64px);gap:7px;justify-content:center;margin-top:10px">'
 +'<span></span><button class="kbtn white" style="min-height:52px;margin:0;font-size:1.3rem" onclick="mzGo(\'up\')">⬆️</button><span></span>'
 +'<button class="kbtn white" style="min-height:52px;margin:0;font-size:1.3rem" onclick="mzGo(\'left\')">⬅️</button>'
 +'<button class="kbtn white" style="min-height:52px;margin:0;font-size:1.3rem" onclick="mzGo(\'down\')">⬇️</button>'
 +'<button class="kbtn white" style="min-height:52px;margin:0;font-size:1.3rem" onclick="mzGo(\'right\')">➡️</button></div>'
 +'<p class="center" style="font-size:.82rem;margin-top:8px">👆 <b>Toca el laberinto hacia donde quieras ir</b> (o desliza, o usa las flechas). ¡Cómete todos los puntos sin que te atrapen!</p>');
 const cv=document.getElementById("mzcv");
 const C=13,R=15,T=26;
 const dpr=Math.min(2,window.devicePixelRatio||1);
 const cssW=Math.min(390,cv.clientWidth||330);
 cv.style.height=Math.round(cssW*R/C)+"px";
 cv.width=Math.round(C*T*dpr*(cssW/(C*T)));cv.height=Math.round(R*T*dpr*(cssW/(C*T)));
 const ctx=cv.getContext("2d");ctx.scale(dpr*cssW/(C*T),dpr*cssW/(C*T));
 MZ.ctx=ctx;MZ.T=T;
 // control por TOQUE: tocas hacia dónde quieres ir (respecto al comelón); también sirve deslizar
 let sx=0,sy=0;
 cv.addEventListener("pointerdown",e=>{sx=e.clientX;sy=e.clientY;});
 cv.addEventListener("pointerup",e=>{
  const dx=e.clientX-sx,dy=e.clientY-sy;
  if(Math.abs(dx)>=14||Math.abs(dy)>=14){ // deslizó
   mzGo(Math.abs(dx)>Math.abs(dy)?(dx>0?"right":"left"):(dy>0?"down":"up"));return;}
  // toque simple: dirección desde el comelón hacia el punto tocado
  const r=cv.getBoundingClientRect();
  const tx=(e.clientX-r.left)/r.width*13,ty=(e.clientY-r.top)/r.height*15;
  const ddx=tx-(MZ.pl.x+0.5),ddy=ty-(MZ.pl.y+0.5);
  mzGo(Math.abs(ddx)>Math.abs(ddy)?(ddx>0?"right":"left"):(ddy>0?"down":"up"));});
 MZ.keyfn=e=>{const m={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"};if(m[e.key]){mzGo(m[e.key]);e.preventDefault();}};
 window.addEventListener("keydown",MZ.keyfn);
 MZ.last=performance.now();
 MZ.raf=requestAnimationFrame(mzLoop);}
function mzGo(d){if(MZ.pl)MZ.pl.want=d;}
function mzStep(e,decide){
 // avanza interpolando de (fx,fy) a (tx,ty)
 if(e.t>=1){e.fx=e.tx;e.fy=e.ty;
  const nd=decide(e);
  if(nd){e.dir=nd;const v=MZ_DIRS[nd];
   if(mzOpen(e.fx+v[0],e.fy+v[1])){e.tx=e.fx+v[0];e.ty=e.fy+v[1];e.t=0;}}
 }
 if(e.t<1)e.t=Math.min(1,e.t+e.speed*MZ.dt);
 e.x=e.fx+(e.tx-e.fx)*e.t;e.y=e.fy+(e.ty-e.fy)*e.t;}
function mzLoop(now){
 if(MZ.over)return;
 MZ.dt=Math.min(0.05,(now-MZ.last)/1000);MZ.last=now;MZ.t+=MZ.dt;
 // jugador
 mzStep(MZ.pl,e=>{
  const w=MZ_DIRS[e.want];
  if(w&&mzOpen(e.fx+w[0],e.fy+w[1]))return e.want;
  const c=MZ_DIRS[e.dir];
  if(c&&mzOpen(e.fx+c[0],e.fy+c[1]))return e.dir;
  return null;});
 // comer
 const key=MZ.pl.fx+","+MZ.pl.fy;
 if(MZ.dots[key]){delete MZ.dots[key];MZ.score++;MZ.nDots--;if(typeof tone==="function"&&MZ.nDots%3===0)tone(620,.04);
  const el=document.getElementById("mzscore");if(el)el.textContent=MZ.score;
  if(MZ.nDots<=0)return mzWin();}
 if(MZ.fruit&&MZ.pl.fx===MZ.fruit.x&&MZ.pl.fy===MZ.fruit.y){MZ.score+=10;MZ.fruit=null;sOK();
  const el=document.getElementById("mzscore");if(el)el.textContent=MZ.score;}
 // monstruos
 MZ.mon.forEach(m=>mzStep(m,e=>{
  const opts=Object.keys(MZ_DIRS).filter(d=>{
   const v=MZ_DIRS[d];if(!mzOpen(e.fx+v[0],e.fy+v[1]))return false;
   const rev={up:"down",down:"up",left:"right",right:"left"}[e.dir];
   return d!==rev;});
  const pool=opts.length?opts:Object.keys(MZ_DIRS).filter(d=>{const v=MZ_DIRS[d];return mzOpen(e.fx+v[0],e.fy+v[1]);});
  if(!pool.length)return null;
  if(Math.random()<0.3)return pool[rnd(pool.length)];
  let best=pool[0],bd=1e9;
  pool.forEach(d=>{const v=MZ_DIRS[d];const dd=Math.abs(e.fx+v[0]-MZ.pl.x)+Math.abs(e.fy+v[1]-MZ.pl.y);if(dd<bd){bd=dd;best=d;}});
  return best;}));
 // choque
 for(const m of MZ.mon){
  if(Math.hypot(m.x-MZ.pl.x,m.y-MZ.pl.y)<0.62){return mzHit();}}
 mzDraw();
 MZ.raf=requestAnimationFrame(mzLoop);}
function mzHit(){
 MZ.lives--;sNO();
 const el=document.getElementById("mzlives");if(el)el.textContent="❤️".repeat(Math.max(0,MZ.lives));
 if(MZ.lives<=0)return mzEnd(false);
 // reset posiciones
 MZ.pl.fx=6;MZ.pl.fy=13;MZ.pl.tx=6;MZ.pl.ty=13;MZ.pl.t=1;MZ.pl.dir="left";MZ.pl.want="left";
 MZ.mon.forEach(m=>{m.fx=m.home.x;m.fy=m.home.y;m.tx=m.home.x;m.ty=m.home.y;m.t=1;});
 mzDraw();
 setTimeout(()=>{if(!MZ.over){MZ.last=performance.now();MZ.raf=requestAnimationFrame(mzLoop);}},700);}
function mzWin(){MZ.won=true;mzEnd(true);}
function mzEnd(win){
 MZ.over=true;cancelAnimationFrame(MZ.raf);window.removeEventListener("keydown",MZ.keyfn);
 const st=win?(MZ.lives>=3?3:MZ.lives===2?2:1):(MZ.score>=40?1:0);
 const p=prof();if(p){p.coins+=Math.round(MZ.score/8)+(win?5:0);p.xp+=win?15:5;save();}
 if(win){sWIN();confetti(28);}
 render(topbar("exitGame('games')")+'<div class="card endcard"><div class="big">'+(win?"🏆":"👾")+'</div>'
 +'<h2>'+(win?"¡Te comiste todo el laberinto!":"¡Te atraparon!")+'</h2>'
 +'<p style="font-size:1.05rem;margin:8px 0">Puntos: '+MZ.score+'</p>'
 +(st?'<div style="font-size:1.5rem;margin-bottom:8px">'+"⭐".repeat(st)+"☆".repeat(3-st)+'</div>':'')
 +'<button class="kbtn green" onclick="gameMaze()">🔁 Jugar otra vez</button>'
 +'<button class="kbtn white" onclick="exitGame(&quot;games&quot;)">Salir</button></div>');}
function mzDraw(){
 const c=MZ.ctx,T=MZ.T;if(!c)return;
 c.fillStyle="#0B1220";c.fillRect(0,0,13*T,15*T);
 // muros
 for(let y=0;y<15;y++)for(let x=0;x<13;x++){
  if(MZ_MAP[y][x]==="#"){
   c.fillStyle="#1D4ED8";c.beginPath();
   if(c.roundRect)c.roundRect(x*T+2,y*T+2,T-4,T-4,5);else c.rect(x*T+2,y*T+2,T-4,T-4);
   c.fill();
   c.fillStyle="rgba(147,197,253,.25)";c.fillRect(x*T+4,y*T+4,T-8,4);
  }}
 // puntos
 c.fillStyle="#FDE047";
 for(const k in MZ.dots){const [x,y]=k.split(",").map(Number);
  c.beginPath();c.arc(x*T+T/2,y*T+T/2,3,0,Math.PI*2);c.fill();}
 // fruta
 if(MZ.fruit){c.font="16px serif";c.textAlign="center";c.textBaseline="middle";
  c.fillText("🍓",MZ.fruit.x*T+T/2,MZ.fruit.y*T+T/2+1);}
 // jugador (bolita amarilla con boca animada segun direccion)
 const p=MZ.pl,pxx=p.x*T+T/2,pyy=p.y*T+T/2;
 const ang={right:0,down:Math.PI/2,left:Math.PI,up:-Math.PI/2}[p.dir]||0;
 const mouth=0.28+0.24*Math.abs(Math.sin(MZ.t*9));
 c.fillStyle="#FDE047";c.beginPath();
 c.moveTo(pxx,pyy);c.arc(pxx,pyy,T/2-3,ang+mouth,ang-mouth+Math.PI*2);c.closePath();c.fill();
 c.strokeStyle="#1E2A4A";c.lineWidth=2;c.stroke();
 const ex=pxx+Math.cos(ang-Math.PI/2)*5,ey=pyy+Math.sin(ang-Math.PI/2)*5;
 c.fillStyle="#1E2A4A";c.beginPath();c.arc(ex,ey,2.2,0,Math.PI*2);c.fill();
 // monstruitos (bolitas con antena y ojos, personajes propios)
 MZ.mon.forEach(m=>{
  const mx=m.x*T+T/2,my=m.y*T+T/2;
  c.fillStyle=m.col;c.beginPath();c.arc(mx,my,T/2-4,0,Math.PI*2);c.fill();
  c.strokeStyle="#1E2A4A";c.lineWidth=2;c.stroke();
  c.beginPath();c.moveTo(mx,my-T/2+4);c.lineTo(mx,my-T/2-2);c.stroke();
  c.fillStyle="#FDE047";c.beginPath();c.arc(mx,my-T/2-4,2.5,0,Math.PI*2);c.fill();
  const v=MZ_DIRS[m.dir]||[0,0];
  c.fillStyle="#fff";
  c.beginPath();c.arc(mx-4,my-2,3.4,0,Math.PI*2);c.fill();c.beginPath();c.arc(mx+4,my-2,3.4,0,Math.PI*2);c.fill();
  c.fillStyle="#1E2A4A";
  c.beginPath();c.arc(mx-4+v[0]*1.6,my-2+v[1]*1.6,1.7,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(mx+4+v[0]*1.6,my-2+v[1]*1.6,1.7,0,Math.PI*2);c.fill();
 });}

/* ============ MUNDO SALTARIN (plataformas: corre, salta, monedas y bandera; personaje original) ============ */
let PL={};
function gamePlatform(world){
 setTheme("kid");world=world||1;
 PL={world:world,hearts:3,coins:0,over:false,raf:0,last:0,t:0,inv:0,win:false};
 // construir nivel
 const speed=140+world*18;
 PL.speed=speed;
 const plats=[],coins=[],foes=[];
 let x=0;const groundY=250;
 plats.push({x:0,y:groundY,w:340,ground:1});x=340;
 let n=0;
 while(x<2500){
  const gap=50+rnd(30)+world*10;
  x+=gap;
  const w=150+rnd(170);
  plats.push({x:x,y:groundY,w:w,ground:1});
  // monedas sobre el hueco (arco)
  coins.push({x:x-gap/2,y:groundY-95-rnd(25),r:9});
  if(w>190){ // plataforma flotante con monedas
   if(n%2===0){const fy=groundY-92;plats.push({x:x+30,y:fy,w:86});coins.push({x:x+52,y:fy-24,r:9},{x:x+82,y:fy-24,r:9});}
   else{foes.push({x:x+w*0.55,y:groundY-18,dir:-1,min:x+30,max:x+w-30,dead:false});}
  }
  coins.push({x:x+40+rnd(Math.max(20,w-80)),y:groundY-28,r:9});
  x+=w;n++;
 }
 const endW=240;plats.push({x:x+70,y:groundY,w:endW,ground:1});
 PL.flagX=x+70+endW-70;
 PL.plats=plats;PL.coins=coins;PL.foes=foes;
 PL.p={x:60,y:groundY-28,vy:0,w:24,h:28,ground:true,jumps:0};
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">⛰️ Mundo Saltarín · Mundo '+world+'</h2>'
 +'<div style="display:flex;justify-content:center;gap:16px;font-family:Fredoka;font-weight:800;margin-bottom:6px"><span id="plh">❤️❤️❤️</span><span>🪙 <span id="plc">0</span></span></div>'
 +'<canvas id="plcv" style="width:100%;max-width:430px;display:block;margin:0 auto;border-radius:14px;border:4px solid var(--kid-ink);touch-action:none"></canvas>'
 +'<button class="kbtn green" style="max-width:430px;display:block;margin:10px auto 0;min-height:58px" onclick="plJump()">⬆️ ¡SALTAR!</button>'
 +'<p class="center" style="font-size:.82rem;margin-top:6px">Corre solo — tú salta los huecos y esquiva o aplasta a los bichos. ¡Llega a la bandera! (también puedes tocar la pantalla del juego)</p>');
 const cv=document.getElementById("plcv");
 const W=360,H=300;
 const dpr=Math.min(2,window.devicePixelRatio||1);
 const cssW=Math.min(430,cv.clientWidth||330);
 cv.style.height=Math.round(cssW*H/W)+"px";
 cv.width=Math.round(W*dpr*cssW/(W));cv.height=Math.round(H*dpr*cssW/(W));
 const ctx=cv.getContext("2d");ctx.scale(dpr*cssW/W,dpr*cssW/W);
 PL.ctx=ctx;PL.W=W;PL.H=H;
 cv.addEventListener("pointerdown",e=>{e.preventDefault();plJump();});
 PL.keyfn=e=>{if(e.key===" "||e.key==="ArrowUp"){plJump();e.preventDefault();}};
 window.addEventListener("keydown",PL.keyfn);
 PL.last=performance.now();
 PL.raf=requestAnimationFrame(plLoop);}
function plJump(){
 const p=PL.p;if(!p||PL.over)return;
 if(p.ground){p.vy=-470;p.ground=false;p.jumps=1;if(typeof tone==="function")tone(500,.06);}
 else if(p.jumps<2){p.vy=-430;p.jumps=2;if(typeof tone==="function")tone(640,.06);}}
function plLoop(now){
 if(PL.over)return;
 const dt=Math.min(0.04,(now-PL.last)/1000);PL.last=now;PL.t+=dt;
 const p=PL.p;
 if(PL.inv>0)PL.inv-=dt;
 p.x+=PL.speed*dt;
 p.vy+=1200*dt;const prevY=p.y;p.y+=p.vy*dt;
 // plataformas
 p.ground=false;
 for(const pl of PL.plats){
  if(p.x+p.w*0.5>pl.x&&p.x-p.w*0.5<pl.x+pl.w){
   if(prevY+p.h<=pl.y+6&&p.y+p.h>=pl.y&&p.vy>=0){p.y=pl.y-p.h;p.vy=0;p.ground=true;p.jumps=0;}
  }}
 // caida
 if(p.y>PL.H+40)return plHurt(true);
 // monedas
 for(const c of PL.coins){if(!c.got&&Math.abs(c.x-p.x)<18&&Math.abs(c.y-(p.y+p.h/2))<24){c.got=true;PL.score=(PL.score||0)+1;
  const el=document.getElementById("plc");if(el)el.textContent=PL.score;if(typeof tone==="function")tone(880,.05);}}
 // enemigos
 for(const f of PL.foes){
  if(f.dead)continue;
  f.x+=f.dir*55*dt;if(f.x<f.min){f.dir=1;}if(f.x>f.max){f.dir=-1;}
  if(Math.abs(f.x-p.x)<20&&Math.abs((f.y)-(p.y+p.h))<16){
   if(p.vy>60){f.dead=true;p.vy=-380;PL.score=(PL.score||0)+3;sOK();const el=document.getElementById("plc");if(el)el.textContent=PL.score;}
   else if(PL.inv<=0)return plHurt(false);
  }}
 // bandera
 if(p.x>=PL.flagX)return plWin();
 plDraw();
 PL.raf=requestAnimationFrame(plLoop);}
function plHurt(fell){
 PL.hearts--;sNO();
 const el=document.getElementById("plh");if(el)el.textContent="❤️".repeat(Math.max(0,PL.hearts));
 if(PL.hearts<=0)return plEnd(false);
 // respawn: plataforma mas cercana hacia atras
 const p=PL.p;let best=PL.plats[0];
 for(const pl of PL.plats){if(pl.x<p.x-10&&pl.x>best.x)best=pl;}
 p.x=best.x+40;p.y=best.y-p.h-2;p.vy=0;p.ground=true;p.jumps=0;PL.inv=1.6;
 PL.last=performance.now();
 PL.raf=requestAnimationFrame(plLoop);}
function plWin(){PL.win=true;plEnd(true);}
function plEnd(win){
 PL.over=true;cancelAnimationFrame(PL.raf);window.removeEventListener("keydown",PL.keyfn);
 const sc=PL.score||0;
 const st=win?(PL.hearts>=3?3:PL.hearts===2?2:1):0;
 const p=prof();if(p){p.coins+=Math.round(sc/2)+(win?6:1);p.xp+=win?14:4;save();}
 if(win){sWIN();confetti(30);}
 const next=PL.world<3?'<button class="kbtn green" onclick="gamePlatform('+(PL.world+1)+')">➡️ Mundo '+(PL.world+1)+'</button>':'';
 render(topbar("exitGame('games')")+'<div class="card endcard"><div class="big">'+(win?(PL.world>=3?"👑":"🚩"):"💔")+'</div>'
 +'<h2>'+(win?(PL.world>=3?"¡Campeón de los 3 mundos!":"¡Llegaste a la bandera!"):"¡Oh no!")+'</h2>'
 +'<p style="font-size:1.05rem;margin:8px 0">🪙 '+sc+' monedas · Mundo '+PL.world+'</p>'
 +(st?'<div style="font-size:1.5rem;margin-bottom:8px">'+"⭐".repeat(st)+"☆".repeat(3-st)+'</div>':'')
 +(win?next:'<button class="kbtn green" onclick="gamePlatform('+PL.world+')">🔁 Reintentar</button>')
 +'<button class="kbtn white" onclick="gamePlatform(1)">Desde el mundo 1</button>'
 +'<button class="kbtn white" onclick="exitGame(&quot;games&quot;)">Salir</button></div>');}
function plDraw(){
 const c=PL.ctx,W=PL.W,H=PL.H,p=PL.p;if(!c)return;
 const cam=Math.max(0,p.x-110);
 // cielo
 const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#7DD3FC");g.addColorStop(1,"#E0F2FE");
 c.fillStyle=g;c.fillRect(0,0,W,H);
 // sol
 c.fillStyle="#FDE047";c.beginPath();c.arc(W-50,42,20,0,Math.PI*2);c.fill();
 // nubes (parallax)
 c.fillStyle="rgba(255,255,255,.9)";
 for(let i=0;i<6;i++){const cx=((i*260-cam*0.35)%(W+240))-120+(i%2)*40;const cy=40+(i%3)*26;
  c.beginPath();c.arc(cx,cy,14,0,Math.PI*2);c.arc(cx+16,cy-6,11,0,Math.PI*2);c.arc(cx+30,cy,12,0,Math.PI*2);c.fill();}
 // colinas
 c.fillStyle="#86EFAC";
 for(let i=0;i<8;i++){const hx=((i*300-cam*0.55)%(W+340))-160;
  c.beginPath();c.arc(hx,H-30,70,Math.PI,0);c.fill();}
 // plataformas
 for(const pl of PL.plats){
  const x=pl.x-cam;if(x>W||x+pl.w<0)continue;
  if(pl.ground){
   c.fillStyle="#92400E";c.fillRect(x,pl.y,pl.w,H-pl.y);
   c.fillStyle="#22C55E";c.fillRect(x,pl.y,pl.w,14);
   c.fillStyle="rgba(255,255,255,.18)";c.fillRect(x,pl.y,pl.w,4);
  }else{
   c.fillStyle="#F97316";c.beginPath();
   if(c.roundRect)c.roundRect(x,pl.y,pl.w,14,7);else c.rect(x,pl.y,pl.w,14);c.fill();
   c.strokeStyle="#7C2D12";c.lineWidth=2;c.stroke();
  }}
 // monedas (giran con escala)
 for(const co of PL.coins){if(co.got)continue;const x=co.x-cam;if(x>W+20||x<-20)continue;
  const sc=Math.abs(Math.sin(PL.t*4+co.x));
  c.fillStyle="#FACC15";c.beginPath();c.ellipse(x,co.y,9*Math.max(0.25,sc),9,0,0,Math.PI*2);c.fill();
  c.strokeStyle="#A16207";c.lineWidth=2;c.stroke();}
 // enemigos (bichos morados)
 for(const f of PL.foes){if(f.dead)continue;const x=f.x-cam;if(x>W+30||x<-30)continue;
  c.fillStyle="#A855F7";c.beginPath();c.ellipse(x,f.y+6,13,11,0,0,Math.PI*2);c.fill();
  c.strokeStyle="#1E2A4A";c.lineWidth=2;c.stroke();
  c.fillStyle="#fff";c.beginPath();c.arc(x-4,f.y+2,3.5,0,Math.PI*2);c.arc(x+4,f.y+2,3.5,0,Math.PI*2);c.fill();
  c.fillStyle="#1E2A4A";c.beginPath();c.arc(x-4+f.dir*1.5,f.y+2,1.8,0,Math.PI*2);c.arc(x+4+f.dir*1.5,f.y+2,1.8,0,Math.PI*2);c.fill();}
 // bandera
 const fx=PL.flagX-cam;
 if(fx<W+40){c.strokeStyle="#64748B";c.lineWidth=4;c.beginPath();c.moveTo(fx,PL.plats[PL.plats.length-1].y);c.lineTo(fx,PL.plats[PL.plats.length-1].y-90);c.stroke();
  c.fillStyle="#22C55E";c.beginPath();c.moveTo(fx,PL.plats[PL.plats.length-1].y-90);c.lineTo(fx+34,PL.plats[PL.plats.length-1].y-76);c.lineTo(fx,PL.plats[PL.plats.length-1].y-62);c.closePath();c.fill();}
 // heroe (redondito turquesa con gorra amarilla hacia atras) — parpadea si invencible
 if(PL.inv<=0||Math.floor(PL.t*10)%2===0){
  const x=p.x-cam,y=p.y;
  const squash=p.ground?1:0.92;
  c.save();c.translate(x,y+p.h/2);c.scale(1,squash);
  c.fillStyle="#14B8A6";c.beginPath();c.ellipse(0,0,p.w/2+2,p.h/2,0,0,Math.PI*2);c.fill();
  c.strokeStyle="#1E2A4A";c.lineWidth=2.5;c.stroke();
  c.fillStyle="#FACC15";c.beginPath();c.arc(0,-p.h/2+3,10,Math.PI,0);c.fill();
  c.fillRect(-14,-p.h/2+1,9,5);
  c.fillStyle="#fff";c.beginPath();c.arc(3,-4,4.5,0,Math.PI*2);c.fill();
  c.fillStyle="#1E2A4A";c.beginPath();c.arc(4.5,-4,2.2,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(-6,2,2,0,Math.PI*2);c.fill(); // mejilla/nariz
  c.fillStyle="#0F766E";c.fillRect(-8,p.h/2-6,7,6);c.fillRect(2,p.h/2-6,7,6);
  c.restore();}
}
