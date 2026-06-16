"use strict";
/* ============ JUEGOS v8: Simón Dice + Carrera Obby (estilo Roblox) ============ */

/* ---- SIMÓN DICE (memoria y concentración) ---- */
const SIMON_PADS=[["🔴","#FF6B6B",330],["🔵","#3B82F6",392],["🟢","#3EC97C",494],["🟡","#FFC93C",587]];
let SI={};
function gameSimon(){setTheme("kid");
 SI={seq:[],step:0,round:0,best:0,lock:true};
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:4px">🎵 Simón Dice</h2>'
 +'<p class="center" style="font-size:.95rem;margin-bottom:12px">Mira la secuencia y repítela tocando los colores</p>'
 +simonGrid()
 +'<div id="simsg" class="center" style="font-family:Fredoka;font-weight:700;font-size:1.2rem;min-height:32px;margin-top:12px">¡Prepárate!</div>'
 +'<button class="kbtn green" id="simstart" onclick="simonNext()">▶️ Empezar</button>');}
function simonGrid(){
 return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:340px;margin:0 auto">'
  +SIMON_PADS.map((p,i)=>'<button id="sim'+i+'" onclick="simonTap('+i+')" style="aspect-ratio:1;border-radius:22px;border:5px solid var(--kid-ink);background:'+p[1]+';box-shadow:0 7px 0 rgba(30,42,74,.7);font-size:clamp(2.4rem,12vw,3.4rem);opacity:.55;transition:opacity .12s,transform .08s">'+p[0]+'</button>').join("")
  +'</div>';}
function simonFlash(i,cb){
 const el=document.getElementById("sim"+i);if(!el){if(cb)cb();return;}
 el.style.opacity="1";el.style.transform="scale(1.06)";tone(SIMON_PADS[i][2],.32);
 setTimeout(()=>{el.style.opacity=".55";el.style.transform="scale(1)";if(cb)cb();},340);}
function simonNext(){
 const btn=document.getElementById("simstart");if(btn)btn.classList.add("hidden");
 SI.round++;SI.seq.push(rnd(4));SI.step=0;SI.lock=true;
 const sg=document.getElementById("simsg");if(sg)sg.textContent="Mira bien… 👀 (ronda "+SI.round+")";
 let i=0;
 const play=()=>{if(i>=SI.seq.length){SI.lock=false;const s=document.getElementById("simsg");if(s)s.textContent="¡Tu turno! 👆";return;}
  simonFlash(SI.seq[i],()=>{i++;setTimeout(play,180);});};
 setTimeout(play,600);}
function simonTap(i){
 if(SI.lock)return;
 simonFlash(i);
 if(i===SI.seq[SI.step]){SI.step++;
  if(SI.step===SI.seq.length){SI.lock=true;sOK();
   recordAnswer("Lógica",true,10);
   if(SI.round>=7){confetti(30);return setTimeout(()=>nodeWin(3,"Lógica"),700);}
   const sg=document.getElementById("simsg");if(sg)sg.textContent="¡Bien! +1 ⭐";
   setTimeout(simonNext,900);}}
 else{SI.lock=true;sNO();recordAnswer("Lógica",false,10);
  const sg=document.getElementById("simsg");if(sg)sg.textContent="¡Casi! Llegaste a la ronda "+SI.round;
  const st=SI.round>=5?3:SI.round>=3?2:1;
  setTimeout(()=>nodeWin(st,"Lógica"),1400);}}

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
 +'<div id="djwrap" style="position:relative;width:300px;height:440px;max-width:100%;margin:0 auto;background:linear-gradient(180deg,#BFE8FF,#E8F7FF);border:4px solid var(--kid-ink);border-radius:16px;overflow:hidden;touch-action:none"></div>'
 +'<div style="display:flex;gap:12px;max-width:320px;margin:12px auto 0">'
 +'<button class="kbtn blue" style="flex:1;margin:0;min-height:62px" onpointerdown="djMove(-1)" onpointerup="djMove(0)" onpointerleave="djMove(0)">⬅️</button>'
 +'<button class="kbtn blue" style="flex:1;margin:0;min-height:62px" onpointerdown="djMove(1)" onpointerup="djMove(0)" onpointerleave="djMove(0)">➡️</button>'
 +'</div>');
 const wrap=document.getElementById("djwrap");
 if(wrap){
  wrap.addEventListener("pointerdown",e=>{const r=wrap.getBoundingClientRect();djMove((e.clientX-r.left)<r.width/2?-1:1);});
  wrap.addEventListener("pointerup",()=>djMove(0));
  wrap.addEventListener("pointerleave",()=>djMove(0));
 }
 djRender();
 requestAnimationFrame(djLoop);}
function djMove(d){DJ.move=d;}
function djLoop(t){
 if(!document.getElementById("djwrap")||!DJ.run)return;
 if(DJ.last==null)DJ.last=t;
 let dt=(t-DJ.last)/16.7;if(dt>3)dt=3;if(dt<0)dt=1;DJ.last=t;
 djStep(dt);djRender();
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
function djRender(){
 const wrap=document.getElementById("djwrap");if(!wrap)return;
 let html='<div style="position:absolute;left:'+DJ.x.toFixed(0)+'px;top:'+DJ.y.toFixed(0)+'px;font-size:30px;transform:translate(-50%,-50%);z-index:2">🐸</div>';
 html+=DJ.plats.map(p=>'<div style="position:absolute;left:'+p.x.toFixed(0)+'px;top:'+p.y.toFixed(0)+'px;width:'+p.w+'px;height:12px;background:#3EC97C;border:3px solid #1E2A4A;border-radius:8px"></div>').join("");
 wrap.innerHTML=html;
 const sc=document.getElementById("djscore");if(sc)sc.textContent="⬆️ "+DJ.score;}

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
  +'<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">'+trayHTML+'</div>');}
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
