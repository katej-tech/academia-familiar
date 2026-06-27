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

/* ============ CARRERA IZQUIERDA / DERECHA (esquiva por carriles) ============ */
let RC={};
function gameRace(){setTheme("kid");
 try{if(typeof RC!=="undefined"&&RC.loop)clearInterval(RC.loop);}catch(e){}
 RC={lane:1,nlanes:3,dist:0,speed:5,over:false,tick:0,obs:[],gap:1,waveEvery:26};
 render(topbar("exitGame('games')")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🏎️ Carrera izquierda y derecha</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:4px">Esquiva los obstáculos moviéndote con los botones</p>'
  +'<div style="text-align:center;font-family:Fredoka;font-weight:700;margin-bottom:6px" id="rcsc">0 m</div>'
  +'<div id="rcroad" style="position:relative;height:54vh;max-height:420px;overflow:hidden;border:3px solid var(--kid-ink);border-radius:18px;background:#5a6b7a">'
   +'<div class="roadline" style="left:33.3%"></div><div class="roadline" style="left:66.6%"></div>'
   +'<div id="rccar" style="position:absolute;bottom:10px;font-size:clamp(2.2rem,12vw,3.2rem);transform:translateX(-50%) rotate(90deg);z-index:3;transition:left .12s ease">🏎️</div>'
  +'</div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px">'
   +'<button class="kbtn blue" onclick="raceMove(-1)" style="font-size:1.25rem">⬅️ Izquierda</button>'
   +'<button class="kbtn green" onclick="raceMove(1)" style="font-size:1.25rem">Derecha ➡️</button>'
  +'</div>');
 RC.road=document.getElementById("rcroad");RC.car=document.getElementById("rccar");
 raceCarPos();
 RC.loop=setInterval(raceStep,60);
}
function laneX(lane,n){return ((lane+0.5)/n*100);}
function raceCarPos(){if(RC.car)RC.car.style.left=laneX(RC.lane,RC.nlanes)+"%";}
function raceMove(dir){if(RC.over)return;const old=RC.lane;RC.lane=Math.max(0,Math.min(RC.nlanes-1,RC.lane+dir));if(RC.lane!==old){raceCarPos();beep([520],.05);}}
function raceSpawnWave(){
 const road=RC.road;
 // Regla de justicia: una ola bloquea 1 carril, o los DOS carriles de los bordes (deja el centro).
 // Nunca bloquea un par de carriles pegados → siempre hay un carril seguro a 1 movimiento, sin cruzar.
 let blocked;
 if(RC.dist>450&&Math.random()<0.35){blocked=[0,2];} // pasillo central (el del medio siempre se alcanza en 1 paso)
 else{blocked=[rnd(3)];}
 blocked.forEach(lane=>{
  const e=document.createElement("div");e.textContent=pick(["🛢️","🚧","🪵","🧱","🪨","🦔"]);
  e.style.cssText="position:absolute;top:-44px;font-size:clamp(2rem,11vw,3rem);transform:translateX(-50%);z-index:2;left:"+laneX(lane,RC.nlanes)+"%";
  road.appendChild(e);RC.obs.push({el:e,lane,y:-44,hit:false});
 });
}
function raceStep(){
 if(RC.over)return;const road=RC.road;if(!road)return;
 RC.tick++;RC.dist++;
 if(RC.tick%5===0){const sc=document.getElementById("rcsc");if(sc)sc.textContent=RC.dist+" m";}
 const H=road.clientHeight,carTop=H-70;
 RC.obs.forEach(o=>{o.y+=RC.speed;o.el.style.top=o.y+"px";});
 for(const o of RC.obs){if(!o.hit&&o.lane===RC.lane&&o.y>=carTop-26&&o.y<=carTop+34){o.hit=true;return raceCrash();}}
 RC.obs=RC.obs.filter(o=>{if(o.y>H+40){o.el.remove();return false;}return true;});
 if(RC.tick%RC.waveEvery===0)raceSpawnWave();
 // sube dificultad poco a poco: más rápido y olas más seguidas (con tope para que siga siendo pasable)
 if(RC.tick%200===0){RC.speed=Math.min(11,RC.speed+0.7);RC.waveEvery=Math.max(20,RC.waveEvery-1);}
}
function raceCrash(){
 RC.over=true;clearInterval(RC.loop);sNO();
 if(RC.car)RC.car.textContent="💥";
 setTimeout(()=>{const stars=RC.dist>=600?3:RC.dist>=300?2:1;recordAnswer("Ubicación",RC.dist>=300,10);nodeWin(stars,"Ubicación");},850);
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

/* ============ CARRERA DE NÚMEROS (puertas matemáticas, estilo "hazte más grande") ============ */
let GR={};
function gameGateRun(){setTheme("kid");
 try{if(typeof GR!=="undefined"&&GR.loop)clearInterval(GR.loop);}catch(e){}
 GR={num:2,lane:0,over:false,tick:0,gates:[],done:0,total:8,correct:0,speed:5,nextAt:18};
 render(topbar("exitGame('games')")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🔢 Carrera de números</h2>'
  +'<p class="center" style="font-size:.88rem;margin-bottom:6px">¡Pasa por la puerta que te haga MÁS GRANDE!</p>'
  +'<div style="text-align:center;font-family:Fredoka;font-weight:800;font-size:1.5rem;margin-bottom:6px">Tu número: <span id="grnum" style="color:var(--kid-green)">2</span></div>'
  +'<div id="grroad" style="position:relative;height:50vh;max-height:380px;overflow:hidden;border:3px solid var(--kid-ink);border-radius:18px;background:#5a6b7a">'
   +'<div class="roadline" style="left:50%"></div>'
   +'<div id="grchar" style="position:absolute;bottom:8px;font-size:clamp(2rem,11vw,3rem);transform:translateX(-50%);z-index:3;transition:left .12s ease">🏃</div>'
  +'</div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px">'
   +'<button class="kbtn blue" onclick="grMove(0)" style="font-size:1.2rem">⬅️ Izquierda</button>'
   +'<button class="kbtn green" onclick="grMove(1)" style="font-size:1.2rem">Derecha ➡️</button>'
  +'</div>');
 GR.road=document.getElementById("grroad");GR.char=document.getElementById("grchar");
 grCharPos();
 GR.loop=setInterval(grStep,60);
}
function grMove(l){if(GR.over)return;GR.lane=l;grCharPos();beep([520],.05);}
function grCharPos(){if(GR.char)GR.char.style.left=laneX(GR.lane,2)+"%";}
function grMakeOp(){var r=Math.random();
 if(r<0.5){var n=2+rnd(8);return{label:"+ "+n,apply:function(x){return x+n;}};}
 if(r<0.82){var n2=2+rnd(2);return{label:"× "+n2,apply:function(x){return x*n2;}};}
 var n3=1+rnd(5);return{label:"− "+n3,apply:function(x){return Math.max(0,x-n3);}};}
function grSpawn(){
 var road=GR.road;var a=grMakeOp(),b=grMakeOp(),g=0;
 while(a.apply(GR.num)===b.apply(GR.num)&&g++<12)b=grMakeOp();
 var pair={ops:[a,b],y:-60,applied:false,els:[]};
 [0,1].forEach(function(l){var e=document.createElement("div");
  e.textContent=pair.ops[l].label;
  e.style.cssText="position:absolute;top:-60px;width:40%;height:54px;display:flex;align-items:center;justify-content:center;font-family:Fredoka;font-weight:800;font-size:1.5rem;color:#fff;border:3px solid var(--kid-ink);border-radius:12px;background:rgba(59,130,246,.88);transform:translateX(-50%);left:"+laneX(l,2)+"%";
  road.appendChild(e);pair.els[l]=e;});
 GR.gates.push(pair);
}
function grStep(){
 if(GR.over)return;var road=GR.road;if(!road)return;
 GR.tick++;
 var H=road.clientHeight,charTop=H-66;
 GR.gates.forEach(function(p){p.y+=GR.speed;p.els.forEach(function(e){e.style.top=p.y+"px";});});
 for(var i=0;i<GR.gates.length;i++){var p=GR.gates[i];if(!p.applied&&p.y>=charTop-20){p.applied=true;grApply(p);}}
 GR.gates=GR.gates.filter(function(p){if(p.y>H+60){p.els.forEach(function(e){e.remove();});return false;}return true;});
 if(GR.done>=GR.total)return grEnd();
 if(GR.tick%GR.nextAt===0 && (GR.done+GR.gates.length)<GR.total)grSpawn();
 if(GR.tick%180===0)GR.speed=Math.min(9,GR.speed+0.6);
}
function grApply(p){
 var chosen=p.ops[GR.lane].apply(GR.num);
 var other=p.ops[GR.lane===0?1:0].apply(GR.num);
 var ok=chosen>=other;
 GR.num=chosen;GR.done++;if(ok)GR.correct++;
 recordAnswer("Mate",ok,8);
 var el=document.getElementById("grnum");if(el)el.textContent=GR.num;
 var ge=p.els[GR.lane];if(ge)ge.style.background=ok?"rgba(62,201,124,.95)":"rgba(255,107,107,.95)";
 var oe=p.els[GR.lane===0?1:0];if(oe)oe.style.opacity=".35";
 if(ok){sOK();confetti(6);}else{sNO();}
 var ch=GR.char;if(ch){ch.style.fontSize="clamp(2.4rem,13vw,3.6rem)";setTimeout(function(){if(ch)ch.style.fontSize="clamp(2rem,11vw,3rem)";},220);}
}
function grEnd(){
 GR.over=true;clearInterval(GR.loop);
 var stars=GR.correct>=GR.total-1?3:GR.correct>=GR.total*0.6?2:1;
 sWIN();confetti(28);
 toast("¡Tu número final: "+GR.num+"! Elegiste bien "+GR.correct+"/"+GR.total+" 🔢",true,2800);
 setTimeout(function(){nodeWin(stars,"Mate");},800);
}
