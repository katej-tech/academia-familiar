"use strict";
/* ============ JUEGOS v6: ahorcado, sopa de letras, pinta, impostor, mina ============ */

/* ---- AHORCADO (muñeco de nieve que se derrite) ---- */
const HG_ES=[["gato","🐱"],["perro","🐶"],["casa","🏠"],["sol","☀️"],["luna","🌙"],["flor","🌸"],["pez","🐟"],["mano","✋"],["libro","📖"],["tren","🚂"],["nube","☁️"],["pan","🍞"],["silla","🪑"],["arbol","🌳"],["leche","🥛"],["rana","🐸"],["uva","🍇"],["queso","🧀"]];
const HG_MELT=["⛄","⛄","☃️","☃️","🌨️","💦","💧"];
let HG={};
function gameHangman(modo){setTheme("kid");
 HG={modo,round:0,ok:0,total:4};nextHG();}
function nextHG(){
 clearInterval(HG.timer);
 if(HG.round>=HG.total)return nodeWin(starsFor(HG.ok,HG.total),"Ahorcado");
 if(HG.modo==="en"){const pool=Object.values(EN_VOCAB).flat().filter(w=>/^[a-z]{3,7}$/.test(w[0]));
  const w=pick(pool);HG.word=w[0].toUpperCase();HG.hint=w[2];HG.sub=w[1];HG.en=w[0];}
 else{const w=pick(HG_ES);HG.word=w[0].toUpperCase();HG.hint=w[1];HG.sub="";HG.en=null;}
 HG.guessed=[];HG.lives=6;HG.time=100;HG.done=false;renderHG();
 // temporizador: la barra baja despacio; al llegar a 0 se acaba la palabra
 HG.timer=setInterval(()=>{
  HG.time-=1.1;const bar=document.getElementById("hgbar");
  if(bar)bar.style.width=Math.max(0,HG.time)+"%";
  if(HG.time<=0){clearInterval(HG.timer);hgFail();}
 },240);}
function renderHG(){
 const slots=HG.word.split("").map(c=>'<div class="slot'+(HG.guessed.includes(c)?' filled':'')+'">'+(HG.guessed.includes(c)?c:"")+'</div>').join("");
 const keys="ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("").map(c=>'<button class="key'+(HG.guessed.includes(c)||HG.guessed.includes("✗"+c)?' used':'')+'" onclick="guessHG(\''+c+'\')">'+c+'</button>').join("");
 render(topbar("exitGame('games')")
 +'<div class="progressdots">'+dots(HG.total,HG.round)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:6px">🔤 Adivina la palabra</h2>'
 +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">'
 +'<span style="font-size:1.4rem">'+"❤️".repeat(HG.lives)+"🤍".repeat(6-HG.lives)+'</span>'
 +'<div style="flex:1;height:14px;background:#D7DEEA;border:3px solid var(--kid-ink);border-radius:10px;overflow:hidden"><div id="hgbar" style="height:100%;width:'+HG.time+'%;background:var(--kid-green);transition:width .2s"></div></div>'
 +'<span style="font-size:1.2rem">⏳</span></div>'
 +'<div class="card center" style="padding:14px;margin-bottom:12px"><span style="font-family:Fredoka;font-weight:700;font-size:.85rem;opacity:.7">PISTA</span><br><span style="font-size:clamp(3rem,16vw,4.5rem);line-height:1">'+HG.hint+'</span>'+(HG.sub?'<br><span style="font-size:1rem;opacity:.7">('+esc(HG.sub)+')</span>':'')+'</div>'
 +'<div class="letterslots">'+slots+'</div>'
 +'<div class="keys">'+keys+'</div>'
 +'<div style="height:10px"></div>'
 +'<button class="kbtn white" style="min-height:50px;font-size:1rem" onclick="hintHG()">💡 Muéstrame una letra (cuesta 1 ❤️)</button>');}
function hintHG(){
 if(HG.done)return;
 if(HG.lives<=1)return toast("¡Es tu última vida! Piensa bien 💭",false,1300);
 const missing=[...new Set(HG.word.split(""))].filter(c=>!HG.guessed.includes(c));
 if(!missing.length)return;
 HG.lives--;guessHG(pick(missing));}
function hgFail(){
 if(HG.done)return;HG.done=true;clearInterval(HG.timer);
 HG.round++;sNO();recordAnswer(HG.modo==="en"?"Inglés":"Letras",false,20);
 toast("⏳ Se acabó el tiempo — era "+HG.word,false,1900);setTimeout(nextHG,2000);}
function guessHG(c){
 if(HG.done||HG.guessed.includes(c)||HG.guessed.includes("✗"+c))return;
 if(HG.word.includes(c)){HG.guessed.push(c);beep([700],.08);
  if(HG.word.split("").every(x=>HG.guessed.includes(x))){
   HG.done=true;clearInterval(HG.timer);
   HG.ok++;HG.round++;sOK();confetti(14);recordAnswer(HG.modo==="en"?"Inglés":"Letras",true,20);
   if(HG.en)speakEN(HG.en);
   toast("✓ ¡"+HG.word+"! 🎉",true,1400);setTimeout(nextHG,1500);return;}
  renderHG();}
 else{HG.guessed.push("✗"+c);HG.lives--;sNO();
  if(HG.lives<=0){HG.done=true;clearInterval(HG.timer);HG.round++;recordAnswer(HG.modo==="en"?"Inglés":"Letras",false,20);
   renderHG();toast("Sin corazones 💔 — era "+HG.word,false,1900);setTimeout(nextHG,2000);return;}
  renderHG();}}

/* ---- SOPA DE LETRAS ---- */
const WS_THEMES=[
 {nm:"Animales",e:"🐾",words:["GATO","PERRO","PEZ","OSO","RANA"]},
 {nm:"Frutas",e:"🍎",words:["UVA","PERA","MANGO","KIWI","PIÑA"]},
 {nm:"Colores",e:"🎨",words:["ROJO","AZUL","VERDE","ROSA","GRIS"]},
 {nm:"La casa",e:"🏠",words:["MESA","CAMA","SILLA","PUERTA","SOFA"]},
 {nm:"El cuerpo",e:"🧍",words:["MANO","OJO","PIE","BOCA","NARIZ"]}];
let WS={};
function gameWordSearch(){setTheme("kid");
 const theme=pick(WS_THEMES),N=8;
 const grid=Array(N*N).fill(null);
 const placed=[];
 for(const w of theme.words){ // colocar horizontal o vertical
  let ok=false;
  for(let t=0;t<200&&!ok;t++){
   const hor=Math.random()<.5,L=w.length;
   const r=rnd(hor?N:N-L+1),c=rnd(hor?N-L+1:N);
   const idxs=[];let fits=true;
   for(let i=0;i<L;i++){const idx=hor?(r*N+c+i):((r+i)*N+c);
    if(grid[idx]&&grid[idx]!==w[i]){fits=false;break;}idxs.push(idx);}
   if(fits){idxs.forEach((idx,i)=>grid[idx]=w[i]);placed.push({w,idxs});ok=true;}
  }}
 const AZ="ABCDEFGHIJKLMNOPRSTUVZ";
 for(let i=0;i<grid.length;i++)if(!grid[i])grid[i]=AZ[rnd(AZ.length)];
 WS={grid,placed:placed,found:[],anchor:null,cur:[],fails:0,N,theme};
 renderWS();}
function renderWS(){
 const N=WS.N;
 const cells=WS.grid.map((ch,i)=>{
  const foundCell=WS.found.some(f=>f.idxs.includes(i));
  const sel=WS.cur.includes(i);
  return '<button id="ws'+i+'" onclick="tapWS('+i+')" style="aspect-ratio:1;border-radius:8px;border:3px solid var(--kid-ink);font-family:Fredoka;font-weight:700;font-size:clamp(.9rem,3.8vw,1.2rem);background:'+(foundCell?"var(--kid-green);color:#fff":sel?"var(--kid-yellow)":"#fff")+'">'+ch+'</button>';}).join("");
 const list=WS.theme.words.map(w=>{const done=WS.found.some(f=>f.w===w);
  return '<span style="font-family:Fredoka;font-weight:700;padding:4px 10px;border-radius:12px;border:3px solid var(--kid-ink);background:'+(done?"var(--kid-green);color:#fff":"#fff")+';'+(done?"text-decoration:line-through;":"")+'">'+w+'</span>';}).join(" ");
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:2px">🔍 Sopa de letras: '+WS.theme.nm+' '+WS.theme.e+'</h2>'
 +'<p class="center" style="font-size:.92rem;margin-bottom:8px">Toca las letras de la palabra, una por una o de la primera a la última</p>'
 +'<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:10px">'+list+'</div>'
 +'<div style="display:grid;grid-template-columns:repeat('+N+',1fr);gap:5px">'+cells+'</div>');}
function tapWS(i){
 if(WS.found.some(f=>f.idxs.includes(i)))return;
 beep([520],.06);
 if(WS.anchor===null){WS.anchor=i;WS.cur=[i];return renderWS();}
 if(WS.anchor===i){WS.anchor=null;WS.cur=[];return renderWS();} // tocar el inicio de nuevo lo suelta
 const N=WS.N,a=WS.anchor;
 const ra=Math.floor(a/N),ca=a%N,rb=Math.floor(i/N),cb=i%N;
 let idxs=null;
 if(ra===rb){const [c1,c2]=[Math.min(ca,cb),Math.max(ca,cb)];idxs=[];for(let c=c1;c<=c2;c++)idxs.push(ra*N+c);}
 else if(ca===cb){const [r1,r2]=[Math.min(ra,rb),Math.max(ra,rb)];idxs=[];for(let r=r1;r<=r2;r++)idxs.push(r*N+ca);}
 if(!idxs){WS.anchor=i;WS.cur=[i];return renderWS();} // diagonal: empieza de nuevo aquí, sin castigo
 WS.cur=idxs;
 const s=idxs.map(x=>WS.grid[x]).join(""),rev=s.split("").reverse().join("");
 const hit=WS.placed.find(p=>!WS.found.some(f=>f.w===p.w)&&(p.w===s||p.w===rev));
 if(hit){WS.found.push(hit);WS.anchor=null;WS.cur=[];sOK();confetti(10);recordAnswer("Letras",true,15);
  if(WS.found.length===WS.placed.length){renderWS();
   return setTimeout(()=>nodeWin(WS.fails<=2?3:WS.fails<=5?2:1,"Sopa de letras"),800);}
  return renderWS();}
 // si la selección ya es más larga que la palabra pendiente más larga, no era: reinicia
 const maxLen=Math.max(...WS.placed.filter(p=>!WS.found.some(f=>f.w===p.w)).map(p=>p.w.length));
 if(idxs.length>=maxLen){WS.fails++;sNO();recordAnswer("Letras",false,15);WS.anchor=null;WS.cur=[];toast("Esa no es 🤔 — mira la lista",false,1100);}
 renderWS();} // si no, la selección sigue creciendo: el niño puede ir letra por letra

/* ---- PINTA CON NÚMEROS (resuelve la operación y pinta) ---- */
const MP_COLORS=["#FFFFFF","#FF5C5C","#5199E4","#3EC97C","#FFC93C","#C77DD6","#FF8FB1"];
const MP_NAMES={1:"rojo",2:"azul",3:"verde",4:"amarillo",5:"morado",6:"rosado"};
const MP_ART=[
 {nm:"un corazón",pic:"❤️",tpl:["011000110","111101111","111111111","111111111","011111110","001111100","000111000","000010000"]},
 {nm:"una estrella",pic:"⭐",tpl:["000040000","000444000","444444444","044444440","004444400","044444440","040000040","000000000"]},
 {nm:"una flor",pic:"🌸",tpl:["006660000","066466000","064446000","066466000","006360000","000300000","003330000","000000000"]},
 {nm:"un pez",pic:"🐟",tpl:["000222000","002222200","022222220","422222220","422222220","022222220","002222200","000222000"]},
 {nm:"una mariposa",pic:"🦋",tpl:["550000055","555050555","555555555","055535550","000535000","055535550","555555555","550000055"]}];
let MP={};
function gameMathPaint(){setTheme("kid");
 const art=pick(MP_ART);
 const tpl=art.tpl.join("").split("").map(Number);
 const colorsUsed=[...new Set(tpl)].filter(x=>x>0);
 const results={};const usadosR=new Set();
 colorsUsed.forEach(c=>{let r;do{r=2+rnd(diffMax?diffMax([12,15,18,18,18]):17);}while(usadosR.has(r));usadosR.add(r);results[c]=r;});
 const nums=tpl.map(c=>{if(c>0)return results[c];let d;do{d=2+rnd(18);}while(usadosR.has(d));return d;});
 MP={art,tpl,nums,results,colorsUsed,ci:0,painted:Array(tpl.length).fill(false),errs:0,W:9};
 nextMPColor();}
function nextMPColor(){
 if(MP.ci>=MP.colorsUsed.length)return mpFinish();
 const color=MP.colorsUsed[MP.ci],target=MP.results[color];
 const resta=Math.random()<.5&&target<15;
 let q;
 if(resta){const a=target+1+rnd(5);q=a+" − "+(a-target);}
 else{const a=1+rnd(target-1);q=a+" + "+(target-a);}
 MP.q=q;MP.target=target;renderMP();}
function renderMP(){
 const col=MP.colorsUsed[MP.ci];
 const cells=MP.tpl.map((c,i)=>{
  const painted=MP.painted[i];
  const bg=painted?MP_COLORS[MP.tpl[i]]:(MP.tpl[i]===0?"#F0F3F8":"#fff");
  const txt=(painted||MP.tpl[i]===0)?"transparent":"var(--kid-ink)";
  return '<button onclick="tapMP('+i+')" style="aspect-ratio:1;border-radius:9px;border:none;outline:1px solid #DCE3EE;font-family:Fredoka;font-weight:700;font-size:clamp(.8rem,3.4vw,1.05rem);background:'+bg+';color:'+txt+';transition:background .15s">'+(MP.tpl[i]===0?"":MP.nums[i])+'</button>';}).join("");
 const done=MP.painted.filter((p,i)=>MP.tpl[i]>0&&p).length;
 const total=MP.tpl.filter(c=>c>0).length;
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.1rem,5vw,1.35rem);text-align:center;margin-bottom:2px">🎨 Pinta con números</h2>'
 +'<p class="center" style="font-size:.9rem;margin-bottom:8px">Resuelve y toca las casillas con ese resultado para pintarlas de <b>'+MP_NAMES[col]+'</b></p>'
 +'<div class="card center" style="padding:14px;display:flex;align-items:center;justify-content:center;gap:14px">'
 +'<span style="font-family:Fredoka;font-weight:700;font-size:clamp(1.6rem,8vw,2.3rem)">'+MP.q+' = ?</span>'
 +'<span style="display:inline-block;width:34px;height:34px;border-radius:10px;border:3px solid var(--kid-ink);background:'+MP_COLORS[col]+'"></span></div>'
 +'<div style="display:grid;grid-template-columns:repeat('+MP.W+',1fr);gap:4px;max-width:360px;margin:0 auto">'+cells+'</div>'
 +'<p class="center mut" style="margin-top:10px;font-size:.85rem">Pintadas: '+done+'/'+total+' · ¡termina para ver el dibujo sorpresa!</p>');}
function tapMP(i){
 if(MP.painted[i]||MP.tpl[i]===0)return;
 const color=MP.colorsUsed[MP.ci];
 if(MP.nums[i]===MP.target&&MP.tpl[i]===color){
  MP.painted[i]=true;beep([600+rnd(200)],.07);
  const restantes=MP.tpl.some((c,k)=>c===color&&!MP.painted[k]);
  if(!restantes){sOK();confetti(8);MP.ci++;recordAnswer("Mate",true,15);setTimeout(nextMPColor,450);return;}
  renderMP();}
 else{MP.errs++;sNO();toast("Esas no… busca las que dan "+MP.target,false,1100);}}
function mpFinish(){
 const stars=MP.errs<=2?3:MP.errs<=5?2:1;
 const p=prof();p.coins+=stars*5;p.xp+=stars*10;
 try{touchDay().games=(touchDay().games||0)+1;}catch(e){}
 recordAnswer("Mate",true,20);save();
 sWIN();confetti(36);
 const got=(stars>=2&&typeof maybeCritter==="function")?maybeCritter():null;
 if(got)setTimeout(()=>confetti(24),400);
 const critterHTML=got?'<div class="card" style="background:linear-gradient(180deg,#FFF3C4,#FFE08A);margin-top:12px;text-align:center"><div style="font-size:clamp(3rem,15vw,4rem)">'+got.e+'</div><b>'+(got.isNew?"¡Capturaste a "+got.name+"!":got.evolved?"¡"+got.name+" evolucionó! 🌟":"¡"+got.name+" subió de nivel!")+'</b></div>':'';
 const cells=MP.tpl.map((c)=>'<div style="aspect-ratio:1;border-radius:9px;background:'+(c===0?"transparent":MP_COLORS[c])+'"></div>').join("");
 render(topbar("exitGame('games')")
 +'<div class="card endcard"><div style="font-size:clamp(3.5rem,18vw,5rem)">'+MP.art.pic+'</div>'
 +'<h2>¡Es '+MP.art.nm+'!</h2>'
 +'<div style="display:grid;grid-template-columns:repeat('+MP.W+',1fr);gap:3px;max-width:280px;margin:12px auto">'+cells+'</div>'
 +'<p style="font-size:1.1rem;margin-bottom:6px">Ganaste <b>+'+(stars*5)+' 🪙</b></p>'
 +'<button class="kbtn green" onclick="gameMathPaint()">Pintar otro 🔁</button>'
 +'<button class="kbtn white" onclick="screenGamesPick()">Volver a los juegos</button></div>'
 +critterHTML);}

/* ---- EL IMPOSTOR (encuentra al que dice mentiras) ---- */
const IM_FACTS=[
 ["2 + 2 = 4","2 + 2 = 5"],["5 + 5 = 10","5 + 5 = 12"],["10 − 5 = 5","10 − 5 = 7"],["3 + 3 = 6","3 + 3 = 8"],
 ["Los peces viven en el agua","Los peces vuelan por el cielo"],["El sol sale de día","El sol sale solo de noche"],
 ["Los perros ladran","Los perros maúllan"],["El hielo es frío","El hielo es caliente"],
 ["La semana tiene 7 días","La semana tiene 2 días"],["5 es mayor que 3","3 es mayor que 5"],
 ["Las plantas necesitan agua","Las plantas comen dulces"],["La luna se ve de noche","La luna es de queso"],
 ["Las vacas dan leche","Las vacas ponen huevos"],["El fuego quema","El fuego es de hielo"],
 ["Caminamos con los pies","Caminamos con las orejas"],["Los pájaros tienen alas","Los pájaros tienen 4 patas"]];
const IM_COLORS=[["#FF6B6B","Rojo"],["#3B82F6","Azul"],["#3EC97C","Verde"],["#FFC93C","Amarillo"]];
let IM={};
function gameImpostor(){setTheme("kid");
 IM={round:0,ok:0,total:5,usados:new Set()};nextIM();}
function nextIM(){
 if(IM.round>=IM.total)return nodeWin(starsFor(IM.ok,IM.total),"Lógica");
 let facts=shuffled(IM_FACTS.filter((f,i)=>!IM.usados.has(i)));
 if(facts.length<4){IM.usados=new Set();facts=shuffled(IM_FACTS);}
 const four=facts.slice(0,4);four.forEach(f=>IM.usados.add(IM_FACTS.indexOf(f)));
 const impostorIdx=rnd(4);
 IM.crew=shuffled(IM_COLORS).map((c,i)=>({color:c[0],nm:c[1],txt:i===impostorIdx?four[i][1]:four[i][0],imp:i===impostorIdx}));
 IM.done=false;renderIM();}
function renderIM(){
 const cards=IM.crew.map((c,i)=>
  '<button onclick="tapIM('+i+')" style="width:100%;text-align:left;display:flex;align-items:center;gap:14px;background:#FFFEF8;border:4px solid var(--kid-ink);border-radius:20px;box-shadow:0 6px 0 rgba(30,42,74,.8);padding:12px 14px;margin-bottom:12px">'
  +'<span style="width:54px;height:54px;flex:none;border-radius:50% 50% 42% 42%;border:4px solid var(--kid-ink);background:'+c.color+';position:relative"><span style="position:absolute;top:10px;left:8px;width:30px;height:16px;border-radius:8px;background:#BFE8FF;border:3px solid var(--kid-ink)"></span></span>'
  +'<span style="font-family:Fredoka;font-weight:600;font-size:clamp(1rem,4.4vw,1.2rem)">'+esc(c.txt)+'</span></button>').join("");
 render(topbar("exitGame('games')")
 +'<div class="progressdots">'+dots(IM.total,IM.round)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:2px">🚀 ¿Quién es el impostor?</h2>'
 +'<p class="center" style="font-size:.95rem;margin-bottom:10px">Tres dicen la verdad… ¡uno MIENTE! Tócalo</p>'
 +cards);}
function tapIM(i){
 if(IM.done)return;IM.done=true;
 const c=IM.crew[i];
 recordAnswer("Lógica",c.imp,15);
 if(c.imp){IM.ok++;sOK();confetti(14);toast("🚀 ¡"+c.nm+" era el IMPOSTOR! Expulsado",true,1500);}
 else{sNO();const real=IM.crew.find(x=>x.imp);toast("¡"+c.nm+" decía la verdad! El impostor era "+real.nm,false,1900);}
 IM.round++;setTimeout(nextIM,1900);}

/* ---- CRUCIGRAMA (con pistas de emoji) ---- */
const CW_PUZZLES=[
 {size:8,words:[
  {w:"GATO",r:0,c:0,d:"A",clue:"🐱"},
  {w:"TAZA",r:0,c:2,d:"D",clue:"🍵"},
  {w:"ZORRO",r:2,c:2,d:"A",clue:"🦊"},
  {w:"OSO",r:2,c:3,d:"D",clue:"🐻"},
  {w:"SOPA",r:3,c:3,d:"A",clue:"🍲"}]},
 {size:8,words:[
  {w:"LUNA",r:0,c:0,d:"A",clue:"🌙"},
  {w:"NUBE",r:0,c:2,d:"D",clue:"☁️"},
  {w:"BOCA",r:2,c:2,d:"A",clue:"👄"},
  {w:"CASA",r:2,c:4,d:"D",clue:"🏠"},
  {w:"SAPO",r:4,c:4,d:"A",clue:"🐸"}]},
 {size:8,words:[
  {w:"PERRO",r:0,c:0,d:"A",clue:"🐶"},
  {w:"RANA",r:0,c:3,d:"D",clue:"🐸"},
  {w:"NIDO",r:2,c:3,d:"A",clue:"🪺"},
  {w:"DEDO",r:2,c:5,d:"D",clue:"☝️"},
  {w:"CODO",r:4,c:3,d:"A",clue:"💪"}]}];
let CW={};
function cwCells(word){const out=[];for(let i=0;i<word.w.length;i++)out.push(word.d==="A"?(word.r*CW.N+word.c+i):((word.r+i)*CW.N+word.c));return out;}
function gameCrossword(){setTheme("kid");
 const pz=pick(CW_PUZZLES);
 CW={N:pz.size,words:pz.words,fill:{},locked:new Set(),solved:new Set(),active:0,errs:0};
 // celdas que pertenecen a alguna palabra
 CW.used=new Set();
 pz.words.forEach(w=>cwCells(w).forEach(i=>CW.used.add(i)));
 renderCW();}
function renderCW(){
 const N=CW.N,act=CW.words[CW.active],actCells=act?cwCells(act):[];
 let html="";
 for(let i=0;i<N*N;i++){
  if(!CW.used.has(i)){html+='<span></span>';continue;}
  const ch=CW.fill[i]||"";
  const lock=CW.locked.has(i);
  const sel=actCells.includes(i);
  html+='<button onclick="tapCWCell('+i+')" style="aspect-ratio:1;border-radius:7px;border:3px solid var(--kid-ink);font-family:Fredoka;font-weight:700;font-size:clamp(.85rem,3.6vw,1.15rem);background:'+(lock?"var(--kid-green);color:#fff":sel?"var(--kid-yellow)":"#fff")+'">'+ch+'</button>';}
 const clues=CW.words.map((w,k)=>{
  const done=CW.solved.has(k);
  return '<button onclick="CW.active='+k+';renderCW()" style="font-family:Fredoka;font-weight:700;font-size:1.1rem;padding:6px 12px;border-radius:14px;border:3px solid var(--kid-ink);background:'+(done?"var(--kid-green)":k===CW.active?"var(--kid-yellow)":"#fff")+';'+(done?"opacity:.7;":"")+'">'+w.clue+' '+(w.d==="A"?"➡️":"⬇️")+(done?" ✓":"")+'</button>';}).join("");
 const keys="ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("").map(c=>'<button class="key" onclick="tapCWKey(\''+c+'\')">'+c+'</button>').join("");
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:2px">📝 Crucigrama</h2>'
 +'<p class="center" style="font-size:.9rem;margin-bottom:8px">Toca una pista y escribe la palabra del dibujo</p>'
 +'<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:10px">'+clues+'</div>'
 +'<div style="display:grid;grid-template-columns:repeat('+N+',1fr);gap:4px;margin-bottom:10px">'+html+'</div>'
 +'<div class="keys">'+keys+'</div>'
 +'<div style="height:8px"></div>'
 +'<button class="kbtn white" onclick="cwClear()">🧽 Borrar palabra</button>');}
function tapCWCell(i){
 const k=CW.words.findIndex((w,idx)=>!CW.solved.has(idx)&&cwCells(w).includes(i));
 if(k>=0){CW.active=k;beep([520],.06);renderCW();}}
function tapCWKey(c){
 const w=CW.words[CW.active];
 if(!w||CW.solved.has(CW.active))return;
 const cells=cwCells(w);
 const empty=cells.find(i=>!CW.locked.has(i)&&!CW.fill[i]);
 if(empty===undefined)return;
 CW.fill[empty]=c;beep([560],.06);
 // ¿palabra completa?
 if(cells.every(i=>CW.fill[i]||CW.locked.has(i))){
  const guess=cells.map(i=>CW.fill[i]).join("");
  if(guess===w.w){
   CW.solved.add(CW.active);cells.forEach(i=>CW.locked.add(i));
   sOK();confetti(10);recordAnswer("Letras",true,20);
   if(CW.solved.size===CW.words.length){renderCW();
    return setTimeout(()=>nodeWin(CW.errs<=1?3:CW.errs<=3?2:1,"Crucigrama"),800);}
   // pasar a la siguiente pista pendiente
   CW.active=CW.words.findIndex((x,idx)=>!CW.solved.has(idx));
   return renderCW();}
  CW.errs++;sNO();recordAnswer("Letras",false,20);
  toast("Mmm, fíjate en el dibujo "+w.clue,false,1300);
  cells.forEach(i=>{if(!CW.locked.has(i))delete CW.fill[i];});
 }
 renderCW();}
function cwClear(){const w=CW.words[CW.active];if(!w)return;
 cwCells(w).forEach(i=>{if(!CW.locked.has(i))delete CW.fill[i];});renderCW();}

/* ---- MINA DE BLOQUES (responde para picar) ---- */
let MN={};
function gameMine(){setTheme("kid");
 const cells=Array(25).fill("⬛");
 shuffled([...Array(25).keys()]).slice(0,4).forEach(i=>cells[i]="💎");
 shuffled(cells.map((c,i)=>i).filter(i=>cells[i]==="⬛")).slice(0,4).forEach(i=>cells[i]="🪙");
 MN={cells,revealed:Array(25).fill(false),picks:12,gems:0,coins:0,sel:null,ok:0,n:0};
 renderMN();}
function renderMN(){
 const grid=MN.cells.map((c,i)=>{
  const rev=MN.revealed[i];
  return '<button onclick="tapMN('+i+')" style="aspect-ratio:1;border-radius:8px;border:3px solid #5B4632;font-size:clamp(1.2rem,5.5vw,1.7rem);background:'+(rev?"#2B2B2B":"linear-gradient(180deg,#A9744F,#8B5A2B)")+';'+(MN.sel===i?"outline:4px solid var(--kid-yellow);":"")+'">'+(rev?c:"🟫")+'</button>';}).join("");
 let qHTML="";
 if(MN.sel!==null&&MN.q){
  qHTML='<div class="card center"><b style="font-family:Fredoka;font-size:clamp(1.3rem,6vw,1.7rem)">'+MN.q.q+'</b>'
  +'<div class="choices2" style="margin-top:10px">'+MN.q.ops.map((o,k)=>'<button class="kbtn yellow" onclick="ansMN('+k+')">'+o+'</button>').join("")+'</div></div>';}
 render(topbar("exitGame('games')")
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:2px">⛏️ La mina de bloques</h2>'
 +'<p class="center" style="font-size:.95rem;margin-bottom:8px">Encuentra <b>3 💎</b> — responde bien para picar</p>'
 +'<div style="display:flex;justify-content:center;gap:14px;margin-bottom:10px;font-family:Fredoka;font-weight:700">'
 +'<span class="pill">⛏️ '+MN.picks+'</span><span class="pill">💎 '+MN.gems+'/3</span><span class="pill">🪙 +'+MN.coins+'</span></div>'
 +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-bottom:10px">'+grid+'</div>'
 +qHTML);}
function tapMN(i){
 if(MN.revealed[i]||MN.q)return;
 MN.sel=i;
 const resta=Math.random()<.5;
 let a,b,ans;
 if(resta){a=5+rnd(15);b=1+rnd(a-1);ans=a-b;MN.q={q:a+" − "+b+" = ?"};}
 else{a=1+rnd(10);b=1+rnd(10);ans=a+b;MN.q={q:a+" + "+b+" = ?"};}
 const set=new Set([ans]);while(set.size<3){const d=ans+(1+rnd(4))*(Math.random()<.5?-1:1);if(d>=0)set.add(d);}
 MN.q.opsV=shuffled([...set]);MN.q.ops=MN.q.opsV.map(String);MN.q.ans=ans;
 beep([440],.07);renderMN();}
function ansMN(k){
 const ok=MN.q.opsV[k]===MN.q.ans;
 recordAnswer("Mate",ok,10);MN.n++;if(ok)MN.ok++;
 MN.picks--;
 if(ok){const i=MN.sel;MN.revealed[i]=true;beep([300,500],.1);
  const c=MN.cells[i];
  if(c==="💎"){MN.gems++;sOK();confetti(12);toast("¡Un diamante! 💎",true,1100);}
  else if(c==="🪙"){MN.coins+=3;prof().coins+=3;save();sOK();toast("+3 monedas 🪙",true,1000);}
 }else{sNO();toast("Era "+MN.q.ans+" — el bloque resistió 🪨",false,1300);}
 MN.q=null;MN.sel=null;
 if(MN.gems>=3){renderMN();return setTimeout(()=>nodeWin(3,"Mate"),900);}
 if(MN.picks<=0){renderMN();return setTimeout(()=>nodeWin(MN.gems>=2?2:1,"Mate"),1200);}
 renderMN();}
