"use strict";
/* ============ JUEGOS v8: Simón Dice + Carrera Obby (estilo Roblox) ============ */

/* ---- SIMÓN DICE (memoria y concentración) ---- */
const SIMON_PADS=[["🔴","#FF6B6B",330],["🔵","#3B82F6",392],["🟢","#3EC97C",494],["🟡","#FFC93C",587]];
let SI={};
function gameSimon(){setTheme("kid");
 SI={seq:[],step:0,round:0,best:0,lock:true};
 render(topbar("screenGamesPick()")
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
 render(topbar("screenGamesPick()")
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
