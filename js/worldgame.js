"use strict";
/* ============ MI MUNDO DE RETOS (crea tu pista y juégala) ============
   Pedido: que el niño pueda crear su propio mundo, como Minecraft, y jugarlo como una carrera tipo Fall Guys,
   para LÓGICA y RETOS MATEMÁTICOS — y que la academia siga siendo guía de APRENDIZAJE, no de juegos.
   Por eso el juego está al servicio del aprendizaje:
   · para abrir cada PUERTA hay que resolver un reto (suma, resta, tablas, patrones, comparar, lógica o
     preguntas de TUS quizzes); los retos los ELIGE el creador: diseñar problemas también es aprender;
   · un mundo necesita al menos 3 puertas y que se pueda llegar a la meta (se comprueba con un camino
     real: solo se sube 1 escalón por paso) → razonamiento espacial al construir;
   · caerse no tiene castigo (vuelves al último punto seguro) y equivocarse tampoco: se reintenta con pista;
   · cada acierto cuenta para el aprendizaje del día (recordAnswer), construir bloques NO da monedas.
   Motor 3D: js/world3d.js. Prefijo wrl / WRL. */

const WRL_N=10;
const WRL_KINDS=[["sum","➕","Sumas"],["res","➖","Restas"],["tab","✖️","Tablas"],["pat","🔢","Patrones"],["cmp","⚖️","Comparar"],["log","🔷","Lógica"]];
const WRL_KINDS_EN=[["sum","➕","Add"],["res","➖","Subtract"],["tab","✖️","Times tables"],["pat","🔢","Patterns"],["cmp","⚖️","Compare"],["log","🔷","Logic"],["voc","🗣️","Words"],["ear","👂","Listen"],["num","🔟","Number words"]];
function wrlKinds(W){return(W&&W.lang==="en")?WRL_KINDS_EN:WRL_KINDS;}
function wrlFlag(W){return(W&&W.lang==="en")?"🇬🇧":"🇨🇴";}
const WRL_WIN={noWorld:true,replay:"screenWorlds()",replayLabel:"Mis mundos 🌍",backFn:"screenKidMap()",backLabel:"Ir a los mundos 🌍"};
let WRL={timers:[],tool:"up",color:0,gate:{kind:"sum",lv:1,quiz:null}};

/* ---------- datos ---------- */
function wrlList(){const p=prof();if(!p.worlds)p.worlds=[];return p.worlds;}
function wrlFind(id){return wrlList().find(function(w){return w.id===id;});}
function wrlBlank(){
 const W={id:"w"+Date.now(),nm:"Mi mundo",N:WRL_N,h:Array(WRL_N*WRL_N).fill(0),c:Array(WRL_N*WRL_N).fill(0),items:{},start:null,fin:null,ts:Date.now()};
 for(let r=7;r<=8;r++)for(let c=1;c<=3;c++){W.h[r*WRL_N+c]=1;W.c[r*WRL_N+c]=1;}
 W.start=[8,1];return W;}
function wrlSample(){
 const W=wrlBlank();W.nm="Pista de ejemplo";W.h.fill(0);W.c.fill(0);
 const cells=[[8,1,1],[8,2,1],[8,3,1],[8,4,1],[8,5,1],[9,4,1],[7,5,1],[6,5,2],[6,6,1],[6,7,1],[5,5,2],[4,5,3],[4,4,3],[3,5,3],[2,5,3]];
 cells.forEach(function(x){const i=x[0]*WRL_N+x[1];W.h[i]=x[2];W.c[i]=(x[0]+x[1])%6;});
 W.start=[8,1];W.fin=[2,5];
 W.items["8,3"]={t:"gate",g:{kind:"sum",lv:1}};W.items["5,5"]={t:"gate",g:{kind:"pat",lv:1}};W.items["3,5"]={t:"gate",g:{kind:"tab",lv:1}};
 W.items["9,4"]={t:"star"};W.items["4,4"]={t:"star"};W.items["6,7"]={t:"star"};
 return W;}
function wrlClone(W){return JSON.parse(JSON.stringify(W));}
/* ¿se puede llegar de la salida a la meta? (solo se sube 1 escalón por paso; bajar es libre; las puertas se pueden abrir) */
function wrlCheck(W){
 const N=W.N,res={gates:0,stars:0,solvable:false,msgs:[]};
 Object.keys(W.items).forEach(function(k){if(W.items[k].t==="gate")res.gates++;else if(W.items[k].t==="star")res.stars++;});
 if(!W.start)res.msgs.push("Falta poner la 🚩 salida.");
 if(!W.fin)res.msgs.push("Falta poner la 🏁 meta.");
 if(res.gates<3)res.msgs.push("Pon al menos 3 puertas de reto 🚪 (tienes "+res.gates+").");
 if(W.start&&W.fin){
  const seen={},q=[[W.start[0],W.start[1]]];seen[W.start[0]+","+W.start[1]]=1;
  while(q.length){const cur=q.shift();
   [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){const r=cur[0]+d[0],c=cur[1]+d[1];
    if(r<0||c<0||r>=N||c>=N||seen[r+","+c])return;
    const th=W.h[r*N+c],ch=W.h[cur[0]*N+cur[1]];
    if(th>0&&th-ch<=1){seen[r+","+c]=1;q.push([r,c]);}});}
  res.solvable=!!seen[W.fin[0]+","+W.fin[1]];
  if(!res.solvable)res.msgs.push("¡Ojo! No se puede llegar a la meta: revisa los huecos y que cada escalón suba solo 1.");}
 res.ok=!res.msgs.length;return res;}

/* ---------- generadores de retos ---------- */
function rint(a,b){return a+Math.floor(Math.random()*(b-a+1));}
function wrlNums(ans,extra){
 const set={};set[ans]=1;const cand=[ans+1,ans-1,ans+2,ans-2,ans+10,ans-10,ans+3,ans*2,Math.max(1,Math.floor(ans/2))].concat(extra||[]);
 shuffled(cand).forEach(function(v){if(Object.keys(set).length<4&&v>=0&&!set[v])set[v]=1;});
 let g=0;while(Object.keys(set).length<4&&g++<30)set[ans+rint(3,15)]=1;
 return shuffled(Object.keys(set).map(Number)).map(function(n){return{t:String(n),ok:n===ans};});}
/* ---- inglés (gemelo del Mundo de retos): vocabulario con dibujos, escuchar, números en palabras, y los retos de mate/lógica en inglés ---- */
const WRL_VOC=[["🐶","dog","animal"],["🐱","cat","animal"],["🐟","fish","animal"],["🐦","bird","animal"],["🐴","horse","animal"],["🐮","cow","animal"],["🐷","pig","animal"],["🐸","frog","animal"],["🐰","rabbit","animal"],["🐘","elephant","animal"],["🦁","lion","animal"],["🐵","monkey","animal"],["🐢","turtle","animal"],["🦋","butterfly","animal"],
 ["🍎","apple","food"],["🍌","banana","food"],["🍞","bread","food"],["🥛","milk","food"],["🧀","cheese","food"],["🍕","pizza","food"],["🍇","grapes","food"],["🍓","strawberry","food"],["🥕","carrot","food"],["🍪","cookie","food"],
 ["🏠","house","thing"],["🚗","car","thing"],["🚌","bus","thing"],["⚽","ball","thing"],["📖","book","thing"],["✏️","pencil","thing"],["🎒","backpack","thing"],["🪑","chair","thing"],["🛏️","bed","thing"],["☀️","sun","thing"],["🌙","moon","thing"],["⭐","star","thing"],["🌳","tree","thing"],["🌸","flower","thing"],["⏰","clock","thing"],["👟","shoe","thing"],["🎂","cake","thing"],["🚲","bike","thing"],["✈️","plane","thing"],["🚪","door","thing"]];
const WRL_UNITS=["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const WRL_TENS=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
function wrlNumWord(n){return n<20?WRL_UNITS[n]:WRL_TENS[Math.floor(n/10)]+(n%10?"-"+WRL_UNITS[n%10]:"");}
const WRL_TR=[[/Suma primero las unidades y después las decenas\./,"Add the ones first, then the tens."],[/Cuenta hacia atrás desde el número mayor\./,"Count back from the bigger number."],
 [/Piensa en (\d+) grupos de (\d+)\./,"Think of $1 groups of $2."],[/¿Qué número multiplicado por (\d+) da (\d+)\?/,"What number times $1 makes $2?"],
 [/Mira por cuánto se multiplica cada número\./,"Look at what each number is multiplied by."],[/Mira cuánto cambia de un número al siguiente\./,"Look at how much it changes each time."],
 [/¿Cuál es MAYOR\?/,"Which is BIGGER?"],[/¿Cuál da MÁS\?/,"Which gives MORE?"],[/Son iguales/,"They are equal"],[/ {2}o {2}/,"  or  "],[/Mira primero las decenas\./,"Look at the tens first."],
 [/Resuelve cada lado y compara los resultados\./,"Solve each side and compare the results."],[/Se turnan: uno, otro, uno, otro…/,"They take turns: one, then the other…"],
 [/Un grupito de 3 se repite una y otra vez\./,"A group of 3 repeats again and again."],[/Se repite un grupo de 3 figuras distintas\./,"A group of 3 different shapes repeats."]];
function wrlTr(t){let o=String(t);WRL_TR.forEach(function(x){o=o.replace(x[0],x[1]);});return o;}
/* texto para leer en voz alta en inglés: símbolos → palabras, sin emojis */
function wrlSayEN(t){return String(t).replace(/❓/g," what ").replace(/\+/g," plus ").replace(/−/g," minus ").replace(/×/g," times ").replace(/÷/g," divided by ").replace(/=/g," equals ").replace(/[\u{1F000}-\u{1FFFF}\u2B50\u2600-\u27BF\uFE0F]/gu," ").replace(/\s+/g," ").trim();}
function wrlGateEN(kind,lv,quizId){
 const base={lang:"en",subj:"Inglés"};
 if(kind==="voc"){
  const pool=lv===1?WRL_VOC.filter(function(x){return x[2]!=="thing";}):WRL_VOC;
  if(lv===3){const cat=pick(["animal","food","thing"]),right=pick(pool.filter(function(x){return x[2]===cat;})),wrong=shuffled(pool.filter(function(x){return x[2]!==cat;})).slice(0,3);
   return Object.assign(base,{q:"Which one is "+(cat==="animal"?"an ANIMAL":cat==="food"?"FOOD":"a THING")+"?",say:"Which one is "+(cat==="animal"?"an animal":cat==="food"?"food":"a thing")+"?",ops:shuffled([{t:right[1],ok:true}].concat(wrong.map(function(x){return{t:x[1],ok:false};}))),hint:"Think: can you eat it? Does it move? Is it an object?"});}
  const right=pick(pool),n=lv===1?2:3,wrong=shuffled(pool.filter(function(x){return x!==right;})).slice(0,n);
  return Object.assign(base,{q:"What is this?  "+right[0],say:"What is this?",ops:shuffled([{t:right[1],ok:true}].concat(wrong.map(function(x){return{t:x[1],ok:false};}))),hint:"Say it out loud: "+right[1].charAt(0)+"…"});}
 if(kind==="ear"){
  const right=pick(WRL_VOC),n=lv===1?2:3,same=lv>=2?WRL_VOC.filter(function(x){return x!==right&&x[2]===right[2];}):WRL_VOC.filter(function(x){return x!==right&&x[2]!==right[2];}),wrong=shuffled(same).slice(0,n);
  const say=lv===3?pick(["I like ","I see a ","I have a "])+right[1]:right[1];
  return Object.assign(base,{q:"👂 Listen and choose the picture",say:say,big:true,ops:shuffled([{t:right[0],ok:true}].concat(wrong.map(function(x){return{t:x[0],ok:false};}))),hint:"Press 🔊 Listen again, slowly."});}
 if(kind==="num"){
  const hi=lv===1?10:lv===2?20:99,ans=lv===3?rint(21,hi):rint(1,hi);
  return Object.assign(base,{q:"Which number is “"+wrlNumWord(ans)+"”?",say:"Which number is "+wrlNumWord(ans)+"?",ops:wrlNums(ans,[lv===3?(ans%10)*10+Math.floor(ans/10):ans+1]),hint:lv===3?"Tens first, then ones: twenty, thirty, forty…":"Count: one, two, three…"});}
 if(kind==="quiz"&&quizId&&typeof myqRandomQuestion==="function"){const x=myqRandomQuestion(quizId);if(x)return{q:x.q,say:x.q,lang:x.lang||"en",subj:x.subj||"Inglés",ops:x.ops,hint:x.exp||"Read again slowly."};}
 return null;}
function wrlGate(kind,lv,quizId,lang){
 lv=lv||1;
 if(lang==="en"){
  const x=wrlGateEN(kind,lv,quizId);if(x)return x;
  const y=wrlGate(kind==="voc"||kind==="ear"||kind==="num"||kind==="quiz"?"sum":kind,lv,null,"es");
  const out={q:wrlTr(y.q),ops:y.ops.map(function(o){return{t:wrlTr(o.t),ok:o.ok};}),hint:wrlTr(y.hint),subj:"Inglés",lang:"en"};
  if(kind==="log")out.q="What comes next?  "+out.q;
  out.say=kind==="log"?"What comes next?":wrlSayEN(out.q);return out;}
 if(kind==="voc"||kind==="ear"||kind==="num")kind="sum";
 if(kind==="sum"){const a=lv===1?rint(2,9):lv===2?rint(12,58):rint(120,480),b=lv===1?rint(2,9):lv===2?rint(14,39):rint(110,390);return{q:a+" + "+b+" = ❓",ops:wrlNums(a+b),hint:"Suma primero las unidades y después las decenas.",subj:"Mate"};}
 if(kind==="res"){const a=lv===1?rint(6,18):lv===2?rint(30,99):rint(200,900),b=lv===1?rint(1,a-1):lv===2?rint(11,a-1):rint(100,a-50);return{q:a+" − "+b+" = ❓",ops:wrlNums(a-b),hint:"Cuenta hacia atrás desde el número mayor.",subj:"Mate"};}
 if(kind==="tab"){const t=pick(lv===1?[2,5,10]:lv===2?[3,4,6]:[7,8,9]),n=rint(2,10);
  if(lv===3&&Math.random()<.35)return{q:(t*n)+" ÷ "+t+" = ❓",ops:wrlNums(n),hint:"¿Qué número multiplicado por "+t+" da "+(t*n)+"?",subj:"Mate"};
  return{q:t+" × "+n+" = ❓",ops:wrlNums(t*n),hint:"Piensa en "+n+" grupos de "+t+".",subj:"Mate"};}
 if(kind==="pat"){
  let a,s,seq=[],geo=false;
  if(lv<3){s=pick(lv===1?[1,2,5,10]:[3,4,6,7,9]);a=rint(1,9);for(let i=0;i<5;i++)seq.push(a+s*i);}
  else if(Math.random()<.5){geo=true;s=pick([2,3]);a=rint(1,4);for(let i=0;i<5;i++)seq.push(a*Math.pow(s,i));}
  else{s=pick([11,12,15,25]);a=rint(5,40);for(let i=0;i<5;i++)seq.push(a+s*i);}
  const ans=seq[4];return{q:seq.slice(0,4).join(", ")+", ❓",ops:wrlNums(ans,[seq[3]]),hint:geo?"Mira por cuánto se multiplica cada número.":"Mira cuánto cambia de un número al siguiente.",subj:"Mate"};}
 if(kind==="cmp"){
  if(lv===1){let a=rint(10,99),b=rint(10,99);while(a===b)b=rint(10,99);const ans=Math.max(a,b);return{q:"¿Cuál es MAYOR?  "+a+"  o  "+b,ops:shuffled([{t:String(a),ok:a===ans},{t:String(b),ok:b===ans},{t:"Son iguales",ok:false}]),hint:"Mira primero las decenas.",subj:"Mate"};}
  const mk=function(){const k=rint(0,2);if(k===0){const x=rint(3,12),y=rint(3,12);return{s:x+" + "+y,v:x+y};}if(k===1){const x=rint(2,9),y=rint(2,9);return{s:x+" × "+y,v:x*y};}const x=rint(15,40),y=rint(2,14);return{s:x+" − "+y,v:x-y};};
  let A=mk(),B=mk(),g=0;while((A.v===B.v||A.s===B.s)&&g++<20)B=mk();
  const ans=A.v>B.v?A.s:B.s;return{q:"¿Cuál da MÁS?  "+A.s+"  o  "+B.s,ops:shuffled([{t:A.s,ok:A.s===ans},{t:B.s,ok:B.s===ans},{t:"Son iguales",ok:A.v===B.v}]),hint:"Resuelve cada lado y compara los resultados.",subj:"Mate"};}
 if(kind==="log"){
  const S=shuffled(["🔴","🔵","🟡","🟢","🟣","🟠","⭐","🌙","🍎","🐱"]).slice(0,4);let seq,ans,hint;
  if(lv===1){seq=[S[0],S[1],S[0],S[1],S[0]];ans=S[1];hint="Se turnan: uno, otro, uno, otro…";}
  else if(lv===2){const t=pick([[0,0,1],[0,1,1]]);seq=[];for(let i=0;i<7;i++)seq.push(S[t[i%3]]);ans=S[t[7%3]];hint="Un grupito de 3 se repite una y otra vez.";}
  else{seq=[];for(let i=0;i<8;i++)seq.push(S[i%3]);ans=S[8%3];hint="Se repite un grupo de 3 figuras distintas.";}
  const others=S.filter(function(x){return x!==ans;}).slice(0,3).concat(["❔"]).slice(0,3);
  return{q:seq.join(" ")+" ❓",ops:shuffled([{t:ans,ok:true}].concat(others.map(function(t){return{t:t,ok:false};}))),hint:hint,subj:"Lógica"};}
 if(kind==="quiz"&&quizId&&typeof myqRandomQuestion==="function"){const x=myqRandomQuestion(quizId);if(x)return{q:x.q,ops:x.ops,hint:x.exp||"Lee otra vez con calma.",subj:x.subj||"Mis quizzes",lang:x.lang};}
 return wrlGate("sum",lv);}

/* ---------- lista de mundos ---------- */
function wrlCleanup(){if(WRL.timers)WRL.timers.forEach(clearTimeout);WRL.timers=[];if(WRL.key){document.removeEventListener("keydown",WRL.key);WRL.key=null;}}
function screenWorlds(){setTheme("kid");
 wrlCleanup();
 const l=wrlList(),best=prof().wrlBest||{},bean=prof().beanColor||0;
 render(topbar("screenKidMap()")+subHeader("🌍 Mi mundo de retos")
  +'<div class="card" style="background:#ECFEFF;font-size:.92rem;line-height:1.5"><b>🧠 Aprender creando.</b> Construye tu pista con bloques (en 🇨🇴 español o 🇬🇧 English: palabras, escuchar y números en inglés). Para abrir cada <b>puerta 🚪</b> hay que resolver un reto, <b>¡y los retos los eliges tú!</b> Un buen creador de mundos es un buen profe.</div>'
  +'<button class="kbtn green" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="wrlNew()"><span style="font-size:2.2rem">🧱</span><span style="flex:1"><span>Crear un mundo nuevo</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Bloques, escalones, huecos, estrellas y puertas de reto</span></span></button>'
  +'<button class="kbtn yellow" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="wrlCopySample()"><span style="font-size:2.2rem">🏁</span><span style="flex:1"><span>Probar la pista de ejemplo</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Para ver cómo funciona y cambiarla a tu gusto</span></span></button>'
  +'<button class="kbtn yellow" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="wrlCopySample(\'en\')"><span style="font-size:2.2rem">🇬🇧</span><span style="flex:1"><span>Try the English track</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Words, listening and number words in English</span></span></button>'
  +'<div class="card" style="padding:8px 12px"><b style="font-size:.9rem">Mi frijolito:</b> '+(window.WORLD_PAL||[]).map(function(c,i){return '<button onclick="wrlBean('+i+')" aria-label="color" style="width:34px;height:34px;border-radius:50%;border:4px solid '+(i===bean?"#1E293B":"#fff")+';box-shadow:0 0 0 2px #CBD5E1;background:'+c+';margin:2px;cursor:pointer"></button>';}).join("")+'</div>'
  +(l.length?'<p class="appsec" style="margin-top:10px">Mis mundos ('+l.length+')</p>':"")
  +l.map(function(w){const ch=wrlCheck(w),b=best[w.id];return '<div class="card" style="padding:10px 12px;margin-bottom:8px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:1.9rem">🌍</span><div style="flex:1;line-height:1.3"><b>'+wrlFlag(w)+' '+esc(w.nm)+'</b><br><span class="mut" style="font-size:.8rem">🚪 '+ch.gates+' · ⭐ '+ch.stars+(ch.ok?" · ✅ lista":" · 🔧 por terminar")+(b?" · mejor "+"⭐".repeat(b):"")+'</span></div></div><div style="display:flex;gap:6px;margin-top:8px"><button class="kbtn green" style="margin:0;min-height:44px;font-size:.9rem;flex:2" onclick="wrlPlay(\''+w.id+'\')">▶ Jugar</button><button class="kbtn white" style="margin:0;min-height:44px;font-size:.9rem;flex:2" onclick="wrlEdit(\''+w.id+'\')">🧱 Editar</button><button class="kbtn white" style="margin:0;min-height:44px;font-size:.9rem;flex:1" onclick="wrlShare(\''+w.id+'\')" aria-label="Compartir">📤</button><button class="kbtn white" style="margin:0;min-height:44px;font-size:.9rem;flex:1" onclick="wrlDel(\''+w.id+'\')" aria-label="Borrar">🗑️</button></div></div>';}).join("")
  +'<button class="kbtn white" style="min-height:44px;font-size:.9rem;margin-top:6px" onclick="wrlImportScreen()">📥 Importar un mundo con código</button>');}
function wrlBean(i){prof().beanColor=i;save();screenWorlds();}
function wrlNew(){const W=wrlBlank();const l=wrlList();if(l.length>=8){toast("Máximo 8 mundos: borra uno para crear otro 🙂",false,2200);return;}l.unshift(W);save();wrlEdit(W.id);}
function wrlCopySample(lang){const l=wrlList();if(l.length>=8){toast("Máximo 8 mundos: borra uno primero 🙂",false,2200);return;}const W=wrlSample();
 if(lang==="en"){W.lang="en";W.nm="Example track";W.items["8,3"].g={kind:"voc",lv:1};W.items["5,5"].g={kind:"ear",lv:1};W.items["3,5"].g={kind:"num",lv:1};}l.unshift(W);save();wrlPlay(W.id);}
function wrlDel(id){if(!confirm("¿Borrar este mundo?"))return;const l=wrlList(),k=l.findIndex(function(w){return w.id===id;});if(k>=0){l.splice(k,1);save();}screenWorlds();}

/* ---------- compartir ---------- */
function wrlEncode(W){const o={n:W.nm,l:W.lang==="en"?"en":"es",h:W.h.join(""),c:W.c.join(""),i:Object.keys(W.items).map(function(k){const it=W.items[k];return[k,it.t,it.g?it.g.kind:"",it.g?it.g.lv:0];}),s:W.start,f:W.fin};return "AFW1:"+btoa(unescape(encodeURIComponent(JSON.stringify(o))));}
function wrlDecode(code){
 const m=/^AFW1:([A-Za-z0-9+/=]+)$/.exec(String(code||"").trim());if(!m)throw new Error("El código no es válido");
 const o=JSON.parse(decodeURIComponent(escape(atob(m[1]))));
 const N=WRL_N;if(typeof o.h!=="string"||o.h.length!==N*N||typeof o.c!=="string"||o.c.length!==N*N)throw new Error("El mundo del código no es compatible");
 const W={id:"w"+Date.now(),nm:String(o.n||"Mundo importado").replace(/[<>]/g,"").slice(0,24),lang:o.l==="en"?"en":"es",N:N,h:o.h.split("").map(function(x){return Math.max(0,Math.min(3,+x||0));}),c:o.c.split("").map(function(x){return Math.max(0,Math.min(5,+x||0));}),items:{},start:null,fin:null,ts:Date.now()};
 (o.i||[]).forEach(function(x){if(Array.isArray(x)&&/^\d,\d$/.test(x[0])){if(x[1]==="star")W.items[x[0]]={t:"star"};else if(x[1]==="gate"&&WRL_KINDS_EN.some(function(k){return k[0]===x[2];}))W.items[x[0]]={t:"gate",g:{kind:x[2],lv:Math.max(1,Math.min(3,+x[3]||1))}};}});
 if(Array.isArray(o.s)&&o.s.length===2)W.start=[+o.s[0],+o.s[1]];if(Array.isArray(o.f)&&o.f.length===2)W.fin=[+o.f[0],+o.f[1]];
 return W;}
function wrlShare(id){const W=wrlFind(id);if(!W)return;const code=wrlEncode(W);
 const done=function(){toast("Código copiado 📋 Pásalo a un amigo para que juegue tu mundo (sus puertas de «Mi quiz» usarán sus propios quizzes)",true,3200);};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(code).then(done,function(){wrlFallback(code,done);});else wrlFallback(code,done);}
function wrlFallback(t,done){const a=document.createElement("textarea");a.value=t;a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();try{document.execCommand("copy");done();}catch(e){prompt("Copia este código:",t);}a.remove();}
function wrlImportScreen(){setTheme("kid");
 render(topbar("screenWorlds()")+subHeader("📥 Importar un mundo")
  +'<div class="card"><b>Pega el código</b> <span class="mut" style="font-size:.82rem">(empieza con AFW1:)</span><textarea id="wrlCode" rows="4" style="width:100%;padding:8px;border-radius:12px;border:2px solid #E2E8F0;margin-top:6px;box-sizing:border-box;font-size:.85rem"></textarea></div><button class="kbtn green" onclick="wrlImport()">Importar</button><div id="wrlFb"></div>');}
function wrlImport(){
 try{const W=wrlDecode((document.getElementById("wrlCode")||{}).value);const l=wrlList();if(l.length>=8)throw new Error("Ya tienes 8 mundos: borra uno primero");l.unshift(W);save();toast("Mundo importado 🌍",true,1600);screenWorlds();}
 catch(e){const f=document.getElementById("wrlFb");if(f)f.innerHTML='<div class="card" style="background:#FEE2E2">⚠️ '+esc(e.message)+'</div>';}}

/* ---------- EDITOR ---------- */
function wrlEdit(id){setTheme("kid");
 const W=wrlFind(id);if(!W)return;
 wrlCleanup();
 WRL.W=W;WRL.tool="up";WRL.gate=WRL.gate||{kind:"sum",lv:1,quiz:null};
 render(topbar("screenWorlds()")
  +'<div class="card" style="padding:8px 12px"><input id="wrlName" value="'+esc(W.nm)+'" maxlength="24" oninput="WRL.W.nm=this.value" style="width:100%;font-family:Fredoka;font-weight:700;font-size:1.15rem;border:0;border-bottom:3px solid #CBD5E1;padding:4px;box-sizing:border-box" aria-label="Nombre del mundo"><div id="wrlLangRow" style="margin-top:4px"></div></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="wrlCanvas" style="width:100%;height:clamp(250px,40vh,370px)"></div></div>'
  +'<div id="wrlTools" style="margin-top:6px"></div><div id="wrlPanel"></div>'
  +'<div id="wrlStatus" class="card" style="margin-top:6px;font-size:.9rem;line-height:1.5"></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="kbtn green" style="margin:0" onclick="wrlSaveEdit(false)">💾 Guardar</button><button class="kbtn yellow" style="margin:0" onclick="wrlSaveEdit(true)">▶ Probar</button></div>');
 WRL.c3=renderWorld3D("wrlCanvas",W,{mode:"edit"},wrlTap);
 wrlLangDraw();wrlToolsDraw();wrlStatus();}
function wrlLangDraw(){const el=document.getElementById("wrlLangRow");if(!el||!WRL.W)return;
 el.innerHTML='<span class="mut" style="font-size:.8rem">Idioma de los retos / Language:</span> '+[["es","🇨🇴 Español"],["en","🇬🇧 English"]].map(function(x){const on=(WRL.W.lang||"es")===x[0];return '<button onclick="wrlSetLang(\''+x[0]+'\')" style="margin:2px;padding:4px 10px;border-radius:12px;border:3px solid '+(on?"#7C3AED":"#E2E8F0")+';background:'+(on?"#EDE9FE":"#fff")+';font-weight:700;font-size:.82rem;cursor:pointer;color:#1E293B">'+x[1]+'</button>';}).join("");}
function wrlSetLang(l){const W=WRL.W;if(!W)return;W.lang=l;if(!wrlKinds(W).some(function(k){return k[0]===WRL.gate.kind;}))WRL.gate.kind="sum";WRL.gate.quiz=null;
 Object.keys(W.items).forEach(function(k){const it=W.items[k];if(it.t==="gate"&&!wrlKinds(W).some(function(x){return x[0]===it.g.kind;}))it.g.kind="sum";});
 wrlLangDraw();wrlToolsDraw();if(WRL.c3&&WRL.c3.refresh)WRL.c3.refresh(W);}
function wrlQuizzes(){const W=WRL.W||{},lg=W.lang==="en"?"en":"es";return(typeof myqList==="function"?myqList():[]).filter(function(q){return(q.lang==="en"?"en":"es")===lg;});}
function wrlToolsDraw(){
 const T=[["up","⬆️","Subir"],["down","⬇️","Bajar"],["color","🎨","Pintar"],["star","⭐","Estrella"],["gate","🚪","Reto"],["start","🚩","Salida"],["fin","🏁","Meta"],["erase","🧽","Borrar"]];
 const el=document.getElementById("wrlTools");if(!el)return;
 el.innerHTML='<div style="display:flex;gap:6px;overflow-x:auto;padding:2px 2px 6px">'+T.map(function(t){const on=WRL.tool===t[0];return '<button onclick="wrlTool(\''+t[0]+'\')" style="flex:0 0 auto;min-width:62px;padding:6px 8px;border-radius:14px;border:3px solid '+(on?"#3B82F6":"#E2E8F0")+';background:'+(on?"#DBEAFE":"#fff")+';cursor:pointer;color:#1E293B;font-weight:700;font-size:.78rem;text-align:center"><span style="font-size:1.4rem">'+t[1]+'</span><br>'+t[2]+'</button>';}).join("")+'</div>';
 const pn=document.getElementById("wrlPanel");if(!pn)return;
 let h="";
 if(WRL.tool==="up"||WRL.tool==="color"){h='<div class="card" style="padding:8px 10px;margin-top:0"><b style="font-size:.85rem">Color del bloque:</b> '+(window.WORLD_PAL||[]).map(function(c,i){return '<button onclick="WRL.color='+i+';wrlToolsDraw()" aria-label="color" style="width:32px;height:32px;border-radius:8px;border:4px solid '+(i===WRL.color?"#1E293B":"#fff")+';box-shadow:0 0 0 2px #CBD5E1;background:'+c+';margin:2px;cursor:pointer"></button>';}).join("")+'</div>';}
 else if(WRL.tool==="gate"){
  const qz=wrlQuizzes();
  h='<div class="card" style="padding:8px 10px;margin-top:0"><b style="font-size:.85rem">¿Qué reto tendrá la puerta?</b><div style="display:flex;flex-wrap:wrap;gap:4px;margin:6px 0">'+wrlKinds(WRL.W).map(function(k){const on=WRL.gate.kind===k[0];return '<button onclick="WRL.gate.kind=\''+k[0]+'\';wrlToolsDraw()" style="padding:6px 10px;border-radius:12px;border:3px solid '+(on?(window.WORLD_KIND_COL||{})[k[0]]:"#E2E8F0")+';background:'+(on?"#F8FAFC":"#fff")+';cursor:pointer;font-weight:700;font-size:.82rem;color:#1E293B">'+k[1]+' '+k[2]+'</button>';}).join("")+'</div>'
   +(WRL.gate.kind==="quiz"?(qz.length?'<select onchange="WRL.gate.quiz=this.value" style="width:100%;padding:8px;border-radius:10px;border:2px solid #E2E8F0;margin-bottom:6px">'+qz.map(function(q){return '<option value="'+q.id+'"'+(WRL.gate.quiz===q.id?" selected":"")+'>'+esc(q.ic+" "+q.ti)+'</option>';}).join("")+'</select>':'<p class="mut" style="font-size:.82rem;margin:0 0 6px">Aún no tienes quizzes en este idioma: créalos en «📝 Mis quizzes».</p>'):'<b style="font-size:.85rem">Nivel:</b> '+[1,2,3].map(function(l){const on=WRL.gate.lv===l;return '<button onclick="WRL.gate.lv='+l+';wrlToolsDraw()" style="padding:6px 12px;border-radius:12px;border:3px solid '+(on?"#7C3AED":"#E2E8F0")+';background:'+(on?"#EDE9FE":"#fff")+';cursor:pointer;font-weight:700;margin-left:4px">'+["","🌱 Fácil","🌿 Medio","🌳 Reto"][l]+'</button>';}).join(""))
   +'<p class="mut" style="font-size:.78rem;margin:6px 0 0">Toca una casilla con bloque para poner la puerta.</p></div>';}
 else{h='<p class="mut" style="font-size:.82rem;margin:2px 4px">'+({down:"Toca un bloque para bajarlo. Si lo bajas del todo, ¡queda un hueco y se cae al mar!",star:"Toca un bloque para poner o quitar una estrella.",start:"Toca un bloque para poner la salida.",fin:"Toca un bloque para poner la meta.",erase:"Toca para borrar lo que haya encima (estrella, puerta, salida o meta)."})[WRL.tool]+'</p>';}
 pn.innerHTML=h;}
function wrlTool(t){WRL.tool=t;wrlToolsDraw();}
function wrlStatus(){
 const W=WRL.W,ch=wrlCheck(W),el=document.getElementById("wrlStatus");if(!el)return;
 el.innerHTML='🚪 Retos: <b>'+ch.gates+'</b> (mínimo 3) · ⭐ Estrellas: <b>'+ch.stars+'</b> · '+(ch.ok?'<span style="color:#16A34A;font-weight:800">✅ ¡Tu mundo está listo para jugar!</span>':'<span style="color:#B45309">🔧 '+ch.msgs.map(esc).join(" ")+'</span>');}
function wrlTap(ev,info){
 if(ev!=="tap"||!WRL.W)return;
 const W=WRL.W,N=W.N,r=info.r,c=info.c,i=r*N+c,key=r+","+c,t=WRL.tool;
 const clearCell=function(){delete W.items[key];if(W.start&&W.start[0]===r&&W.start[1]===c)W.start=null;if(W.fin&&W.fin[0]===r&&W.fin[1]===c)W.fin=null;};
 if(t==="up"){if(W.h[i]>=3){toast("¡Eso ya es lo más alto! (3)",false,1000);return;}W.h[i]++;if(W.h[i]===1)W.c[i]=WRL.color;sOK();}
 else if(t==="down"){if(W.h[i]===0)return;W.h[i]--;if(W.h[i]===0)clearCell();sOK();}
 else if(t==="color"){if(W.h[i]>0)W.c[i]=WRL.color;}
 else if(t==="star"){if(!W.h[i]||(W.start&&W.start[0]===r&&W.start[1]===c)||(W.fin&&W.fin[0]===r&&W.fin[1]===c)||(W.items[key]&&W.items[key].t==="gate")){sNO();return;}if(W.items[key]&&W.items[key].t==="star")delete W.items[key];else W.items[key]={t:"star"};sOK();}
 else if(t==="gate"){if(!W.h[i]||(W.start&&W.start[0]===r&&W.start[1]===c)||(W.fin&&W.fin[0]===r&&W.fin[1]===c)){sNO();toast("Pon la puerta en un bloque que no sea la salida ni la meta",false,1800);return;}
  if(WRL.gate.kind==="quiz"){const qz=wrlQuizzes();if(!qz.length){toast("Primero crea un quiz en este idioma, en «Mis quizzes»",false,2400);return;}if(!qz.some(function(q){return q.id===WRL.gate.quiz;}))WRL.gate.quiz=qz[0].id;}
  W.items[key]={t:"gate",g:{kind:WRL.gate.kind,lv:WRL.gate.lv,quiz:WRL.gate.kind==="quiz"?WRL.gate.quiz:null}};sOK();}
 else if(t==="start"){if(!W.h[i]){sNO();return;}if(W.start){const o=W.start;W.start=null;WRL.c3.setCell(o[0],o[1]);}delete W.items[key];if(W.fin&&W.fin[0]===r&&W.fin[1]===c)W.fin=null;W.start=[r,c];sOK();}
 else if(t==="fin"){if(!W.h[i]){sNO();return;}if(W.fin){const o=W.fin;W.fin=null;WRL.c3.setCell(o[0],o[1]);}delete W.items[key];if(W.start&&W.start[0]===r&&W.start[1]===c)W.start=null;W.fin=[r,c];sOK();}
 else if(t==="erase"){clearCell();}
 WRL.c3.setCell(r,c);wrlStatus();}
function wrlSaveEdit(thenPlay){
 const W=WRL.W;W.nm=(W.nm||"").replace(/[<>]/g,"").trim().slice(0,24)||"Mi mundo";W.ts=Date.now();save();
 if(thenPlay){const ch=wrlCheck(W);if(!ch.ok){toast("Aún no se puede jugar: "+ch.msgs[0],false,2800);return;}return wrlPlay(W.id);}
 toast("Mundo guardado 💾",true,1200);}

/* ---------- JUEGO ---------- */
function wrlPlay(id){setTheme("kid");
 const src=wrlFind(id);if(!src)return;
 const ch=wrlCheck(src);if(!ch.ok){toast("Este mundo todavía no está listo: "+ch.msgs[0],false,2800);return wrlEdit(id);}
 wrlCleanup();
 const W=wrlClone(src);
 WRL.play={id:id,W:W,gatesTotal:ch.gates,starsTotal:ch.stars,solved:0,firstOk:0,tries:0,falls:0,t0:Date.now(),gateOpen:null};
 render(topbar("screenWorlds()")
  +'<div style="display:flex;justify-content:space-between;align-items:center;font-family:Fredoka;font-weight:700;margin-bottom:4px"><span>'+esc(src.nm)+'</span><span id="wrlHud"></span></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="wrlCanvas" style="width:100%;height:clamp(250px,42vh,380px)"></div></div>'
  +'<div id="wrlMsg" style="min-height:1.6rem;text-align:center;font-weight:800;margin:4px 0"></div>'
  +'<div id="wrlQ"></div>'
  +'<div id="wrlPad" style="display:grid;grid-template-columns:repeat(3,64px);grid-template-rows:repeat(2,58px);gap:6px;justify-content:center;margin:6px 0">'
   +'<span></span><button class="kbtn blue" style="margin:0;min-height:0;font-size:1.5rem" onclick="wrlGo(-1,0)" aria-label="Arriba">⬆️</button><span></span>'
   +'<button class="kbtn blue" style="margin:0;min-height:0;font-size:1.5rem" onclick="wrlGo(0,-1)" aria-label="Izquierda">⬅️</button><button class="kbtn blue" style="margin:0;min-height:0;font-size:1.5rem" onclick="wrlGo(1,0)" aria-label="Abajo">⬇️</button><button class="kbtn blue" style="margin:0;min-height:0;font-size:1.5rem" onclick="wrlGo(0,1)" aria-label="Derecha">➡️</button></div>'
  +'<p class="center mut" style="font-size:.8rem;margin:0">Sube de a 1 escalón. ¡Si te caes al mar, vuelves y sigues! 🌊</p>');
 WRL.c3=renderWorld3D("wrlCanvas",W,{mode:"play",bean:(window.WORLD_PAL||[])[prof().beanColor||0]},wrlEvent);
 WRL.key=function(e){const m={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]}[e.key];if(m){e.preventDefault();wrlGo(m[0],m[1]);}};
 document.addEventListener("keydown",WRL.key);
 wrlHud();}
function wrlHud(){const P=WRL.play,h=document.getElementById("wrlHud");if(!P||!h)return;h.textContent="⭐ "+(WRL.c3?WRL.c3.state().got:0)+"/"+P.starsTotal+"  🚪 "+P.solved+"/"+P.gatesTotal;}
function wrlMsg(t,col){const m=document.getElementById("wrlMsg");if(m){m.textContent=t||"";m.style.color=col||"#1E293B";}}
function wrlGo(dr,dc){const P=WRL.play;if(!P||P.gateOpen||!WRL.c3)return;WRL.c3.move(dr,dc);}
function wrlEvent(ev,info){
 const P=WRL.play;if(!P)return;
 if(ev==="fall"){P.falls++;wrlMsg("🌊 ¡Splash! Volvemos al último punto seguro 😄","#0369A1");}
 else if(ev==="blocked"){wrlMsg(info.why==="edge"?"Ahí se acaba el mundo 🌍":"¡Muy alto! Busca cómo subir de a 1 escalón 🪜","#B45309");sNO();}
 else if(ev==="star"){sOK();confetti(5);wrlMsg("⭐ ¡Estrella!","#CA8A04");wrlHud();}
 else if(ev==="moved"){wrlMsg("");wrlHud();}
 else if(ev==="gate"){wrlOpenGate(info);}
 else if(ev==="finish"){wrlFinish();}}
function wrlOpenGate(info){
 const P=WRL.play,g=info.item.g||{kind:"sum",lv:1};
 P.gateOpen={r:info.r,c:info.c,g:g,q:wrlGate(g.kind,g.lv,g.quiz,P.W.lang),wrong:0,t0:Date.now()};
 wrlGateDraw();if(P.gateOpen.q.lang==="en")setTimeout(wrlSayGate,350);}
function wrlSayGate(){const G=WRL.play&&WRL.play.gateOpen;if(!G)return;if(G.q.lang==="en")speakEN(G.q.say||G.q.q);else speakES(G.q.q.replace(/[❓➕➖✖️÷×−]/g," "));}
function wrlGateDraw(){
 const P=WRL.play,G=P.gateOpen,pnl=document.getElementById("wrlQ");if(!G||!pnl)return;
 const pad=document.getElementById("wrlPad");if(pad)pad.style.display="none";
 const emo=(window.WORLD_KIND_EMO||{})[G.g.kind]||"🚪",en=G.q.lang==="en";
 pnl.innerHTML='<div class="card" style="border:3px solid '+((window.WORLD_KIND_COL||{})[G.g.kind]||"#6366F1")+'"><b>'+emo+(en?' A challenge door! Solve it to open it · ¡Resuélvelo para abrirla!':' ¡Una puerta de reto! Resuélvelo para abrirla')+'</b><div style="font-family:Fredoka;font-weight:700;font-size:1.35rem;line-height:1.5;margin:8px 0;text-align:center">'+esc(G.q.q)+'</div><button class="speaker small" onclick="wrlSayGate()">🔊 '+(en?"Listen":"Léemelo")+'</button></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+G.q.ops.map(function(o,i){return '<button class="kbtn white" id="wrlO'+i+'" style="margin:0;min-height:56px;font-size:'+(G.q.big?"2.2rem":"1.25rem")+'" onclick="wrlAns('+i+')">'+esc(o.t)+'</button>';}).join("")+'</div><div id="wrlHint"></div>';}
function wrlAns(i){
 const P=WRL.play,G=P.gateOpen;if(!G)return;
 const o=G.q.ops[i],b=document.getElementById("wrlO"+i),first=G.wrong===0;
 P.tries++;
 if(o.ok){
  recordAnswer(G.q.subj||"Mate",first,Math.round((Date.now()-G.t0)/1000));
  if(first)P.firstOk++;P.solved++;sOK();confetti(first?10:4);if(b)b.style.background="#86EFAC";
  const r=G.r,c=G.c;P.gateOpen=null;
  setTimeout(function(){const pnl=document.getElementById("wrlQ");if(pnl)pnl.innerHTML="";const pad=document.getElementById("wrlPad");if(pad)pad.style.display="grid";wrlMsg(first?"🚪 ¡Puerta abierta!":"🚪 ¡Puerta abierta! Lo lograste","#16A34A");wrlHud();if(WRL.c3)WRL.c3.openGate(r,c);},700);
 }else{
  G.wrong++;recordAnswer(G.q.subj||"Mate",false,5);sNO();if(b){b.style.background="#FCA5A5";b.disabled=true;}
  const h=document.getElementById("wrlHint");if(h)h.innerHTML='<p style="text-align:center;font-weight:700;margin-top:8px">'+(G.q.lang==="en"?'Almost… 🤔 '+(G.wrong>=2?'<span style="color:#7C3AED">Hint: '+esc(G.q.hint)+'</span>':'Try again, no rush!'):'Casi… 🤔 '+(G.wrong>=2?'<span style="color:#7C3AED">Pista: '+esc(G.q.hint)+'</span>':'Inténtalo otra vez, sin prisa.'))+'</p>';}}
function wrlFinish(){
 const P=WRL.play;if(!P)return;
 const p=prof(),stars=starsFor(P.firstOk,Math.max(1,P.gatesTotal)),st=WRL.c3?WRL.c3.state().got:0;
 if(!p.wrlBest)p.wrlBest={};p.wrlBest[P.id]=Math.max(p.wrlBest[P.id]||0,stars);save();wrlCleanup();
 toast("🏁 ¡Meta! Estrellas "+st+"/"+P.starsTotal+" · Retos "+P.firstOk+"/"+P.gatesTotal+" a la primera",true,2800);
 nodeWin(stars,"Mundo de retos",WRL_WIN);}
