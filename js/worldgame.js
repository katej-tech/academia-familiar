"use strict";
/* ============ MUNDOS Y CARRERAS (carreras con bots + crea tu propio mundo) ============
   Pedido: algo tipo Fall Guys / Minecraft, más amplio y dinámico, con bots para ganar el puesto 1°, retos de
   TODOS los temas (no solo mates), mundos ya diseñados Y la opción de crear el tuyo, con trampas que hacen retroceder.
   La academia sigue siendo guía de APRENDIZAJE: para pasar cada PUERTA 🚪 hay que resolver un reto del cole
   (mates, lenguaje, ciencias, sociales, tiempo, inglés, lógica o mezcla, con el mismo banco de preguntas de «Aprender»);
   los bots también se frenan en las puertas; equivocarse nunca castiga (se reintenta con pista).
   · Carreras ya diseñadas (WRL_PRE) + «Crear mi mundo» (tamaño y estilo a elección, se construye tocando/arrastrando).
   · Objetos: ⭐ estrella · 🚪 puerta · 🔙 trampa (te devuelve 3 casillas) · ⚡ pinchos (suben y bajan) · 🦘 trampolín (salta 2) · 🚩 · 🏁
   · Control: tocar una casilla (camina solo, esquivando trampas) o flechas relativas a la cámara.
   Motor 3D: js/world3d.js. Prefijo wrl / WRL. */

const WRL_MAXW=10;
const WRL_TOPICS=[["mate","🔢","Mates","#EF4444"],["leng","📚","Lenguaje","#F59E0B"],["cien","🌎","Ciencias","#10B981"],["soc","🏛️","Sociales","#3B82F6"],["tiempo","📅","Tiempo","#8B5CF6"],["eng","🇬🇧","English","#14B8A6"],["logi","🧩","Lógica","#EC4899"],["mix","🎲","Mezcla","#F97316"]];
/* temas del banco de «Aprender» (KID_TOPICS) que usa cada puerta */
const WRL_SRC={
 mate:["sumas2","restas2","restapres","multi","mayorMenor","decenas","numpalabra","palabra_num","problemas2"],
 leng:["sustantivos","silabas","ortografia","narracion"],
 cien:["ciclo_agua","cuerpo_es","cuerpo_partes","sistemas","natura","alimentos","tierra"],
 soc:["geografia","sociales","cultura","informatica","capitales"],
 tiempo:["tiempo","diasES","mesesES","ordinales"],
 eng:["en_animals","en_colors","en_body","en_house","en_numbers","en_days","en_phrases"],
 logi:["logica","secuencias","izqder","acertijos"]};
/* nombre de materia que entiende el panel de padres (core.js recordAnswer) */
const WRL_SUBJ={mate:"Mate",leng:"Letras",cien:"La naturaleza",soc:"Sociales",tiempo:"El tiempo",eng:"Inglés",logi:"Lógica"};
const WRL_LEGACY={sum:"mate",res:"mate",tab:"mate",pat:"mate",cmp:"mate",log:"logi",voc:"eng",ear:"eng",num:"eng"};
const WRL_DIRS=[[0,1],[1,0],[0,-1],[-1,0]]; // este, sur, oeste, norte (dirección del trampolín)
const WRL_ARROW=["➡️","⬇️","⬅️","⬆️"];
const WRL_WIN={noWorld:true,replay:"screenWorlds()",replayLabel:"Más carreras 🏁",backFn:"screenKidMap()",backLabel:"Ir a los mundos 🌍"};
let WRL={timers:[],tool:"build",color:0,gate:{topic:"mate",lv:1},undo:[]};

/* ---------- mundos ya diseñados ----------
   rects [fila0,col0,fila1,col1,altura] se pintan en orden; items [fila,col,tipo,extra]:
   S salida · F meta · G puerta (temas en orden) · * estrella · T trampa · P pinchos · B trampolín(dirección 0 este,1 sur,2 oeste,3 norte) */
const WRL_PRE=[
 {id:"pre_mate",nm:"Pradera de los números",ic:"🔢",theme:"grass",topics:["mate"],lv:1,diff:1,N:12,desc:"Sumas, restas y números. ¡La carrera más fácil!",
  rects:[[8,0,10,3,1],[9,4,9,5,1],[7,6,10,8,1],[6,7,6,7,2],[5,7,5,7,2],[2,5,4,9,2],[3,2,3,4,3],[1,0,4,2,3],[1,0,1,2,4]],
  items:[[9,1,"S"],[1,1,"F"],[9,5,"G"],[5,7,"G"],[3,3,"G"],[10,8,"*"],[2,9,"*"],[4,0,"*"],[8,7,"T"],[3,7,"T"]]},
 {id:"pre_leng",nm:"Selva de las palabras",ic:"📚",theme:"jungle",topics:["leng"],lv:1,diff:2,N:12,desc:"Sílabas, ortografía y sustantivos. ¡Cuidado con los pinchos!",
  rects:[[8,0,10,2,1],[9,3,9,9,1],[6,9,10,11,1],[3,10,5,10,2],[1,6,3,11,2],[2,3,2,5,3],[2,0,6,2,3],[6,0,6,1,4]],
  items:[[9,1,"S"],[6,0,"F"],[9,8,"G"],[4,10,"G"],[2,4,"G"],[9,5,"P"],[2,3,"P"],[8,10,"T"],[2,8,"T"],[10,0,"*"],[6,11,"*"],[1,11,"*"],[4,0,"*"]]},
 {id:"pre_cien",nm:"Isla de la ciencia",ic:"🌎",theme:"sand",topics:["cien","soc"],lv:1,diff:2,N:12,desc:"Cuerpo, naturaleza y mundo. ¡Usa los trampolines 🦘 para saltar el mar!",
  rects:[[8,0,10,2,1],[7,4,10,6,1],[9,7,9,8,1],[7,9,10,11,2],[2,8,5,11,2],[4,5,4,7,3],[2,1,5,4,3],[1,1,1,2,4]],
  items:[[9,1,"S"],[1,1,"F"],[9,2,"B",0],[9,7,"G"],[9,8,"G"],[7,10,"B",3],[4,6,"G"],[4,5,"P"],[10,2,"*"],[10,11,"*"],[2,11,"*"],[5,1,"*"],[3,9,"T"],[5,9,"T"],[8,5,"T"]]},
 {id:"pre_eng",nm:"Cumbre helada (English)",ic:"🇬🇧",theme:"ice",topics:["eng"],lv:1,diff:2,N:12,desc:"Escucha y aprende inglés subiendo la montaña de hielo.",
  rects:[[9,0,10,2,1],[9,3,9,4,2],[9,5,9,5,3],[7,6,9,8,3],[6,8,6,8,4],[3,6,5,9,4],[4,3,4,5,5],[1,1,5,3,5],[1,1,1,2,6]],
  items:[[10,1,"S"],[1,1,"F"],[9,4,"G"],[6,8,"G"],[4,5,"G"],[4,4,"P"],[8,7,"T"],[4,7,"T"],[10,0,"*"],[7,8,"*"],[3,9,"*"],[5,1,"*"]]},
 {id:"pre_tiempo",nm:"Dulcelandia: tiempo y mundo",ic:"🍭",theme:"candy",topics:["tiempo","soc"],lv:1,diff:2,N:12,desc:"Días, meses, orden y geografía en el país de los dulces.",
  rects:[[8,0,10,2,1],[9,3,9,6,1],[7,7,10,9,1],[3,6,5,10,1],[4,3,4,5,2],[2,0,5,2,2],[1,0,1,1,3]],
  items:[[9,1,"S"],[1,0,"F"],[9,4,"G"],[9,5,"G"],[7,8,"B",3],[4,4,"G"],[9,6,"P"],[8,8,"T"],[4,8,"T"],[10,9,"*"],[3,10,"*"],[5,2,"*"]]},
 {id:"pre_mix",nm:"Galaxia mezcla",ic:"🪐",theme:"space",topics:["mate","eng","cien","logi","leng","soc"],lv:2,diff:3,N:14,desc:"De todo un poco y más trampas. ¡Solo para campeones!",
  rects:[[11,0,13,2,1],[10,4,13,6,1],[12,7,12,9,1],[9,10,13,12,2],[4,8,7,12,2],[5,5,5,7,3],[2,2,6,4,3],[1,3,1,3,4],[0,3,0,3,5]],
  items:[[12,1,"S"],[0,3,"F"],[12,2,"B",0],[12,7,"P"],[12,8,"G"],[12,9,"G"],[9,11,"B",3],[5,6,"G"],[5,5,"P"],[1,3,"G"],[11,5,"T"],[11,11,"T"],[6,9,"T"],[4,3,"T"],[13,0,"*"],[10,4,"*"],[13,12,"*"],[4,12,"*"],[6,2,"*"]]}];
function wrlBuildPre(d){
 const N=d.N,W={id:d.id,nm:d.nm,N:N,theme:d.theme,h:Array(N*N).fill(0),c:Array(N*N).fill(0),items:{},start:null,fin:null,pre:true,ts:0,seed:7,ic:d.ic,desc:d.desc,diff:d.diff};
 d.rects.forEach(function(x){for(let r=x[0];r<=x[2];r++)for(let c=x[1];c<=x[3];c++)W.h[r*N+c]=x[4];});
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){const i=r*N+c;if(W.h[i])W.c[i]=W.h[i]>=4?3+((r+c)%3):((r>>1)+(c>>1))%3;}
 let gi=0;
 d.items.forEach(function(x){const k=x[0]+","+x[1];
  if(x[2]==="S")W.start=[x[0],x[1]];else if(x[2]==="F")W.fin=[x[0],x[1]];
  else if(x[2]==="G"){W.items[k]={t:"gate",g:{topic:d.topics[gi%d.topics.length],lv:d.lv}};gi++;}
  else if(x[2]==="*")W.items[k]={t:"star"};else if(x[2]==="T")W.items[k]={t:"trap"};else if(x[2]==="P")W.items[k]={t:"spike"};
  else if(x[2]==="B")W.items[k]={t:"boost",d:x[3]||0};});
 return W;}
let WRL_PREW=null;
function wrlPre(){if(!WRL_PREW)WRL_PREW=WRL_PRE.map(wrlBuildPre);return WRL_PREW;}


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
 return wrlGate("sum",lv);}



/* ---------- mundos guardados ---------- */
function wrlList(){const p=prof();if(!p.worlds)p.worlds=[];return p.worlds;}
function wrlGet(id){return wrlList().find(function(w){return w.id===id;})||wrlPre().find(function(w){return w.id===id;});}
function wrlClone(W){return JSON.parse(JSON.stringify(W));}
function wrlColorAt(r,c,h){return h>=4?3+((r+c)%3):((r>>1)+(c>>1))%3;}
/* terreno inicial: "sea" (mar vacío con una plataforma), "island" (isla) o "flat" (llanura) */
function wrlBlank(N,theme,terrain){
 const W={id:"w"+Date.now(),nm:"Mi mundo",N:N,theme:theme||"grass",h:Array(N*N).fill(0),c:Array(N*N).fill(0),items:{},start:null,fin:null,ts:Date.now(),seed:Math.floor(Math.random()*90)+1};
 const mid=(N-1)/2;
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){let h=0;
  if(terrain==="flat")h=1;
  else if(terrain==="island"){const d=Math.hypot((c-mid)/(N*.36),(r-mid)/(N*.3));if(d<1)h=d<.55&&((r*7+c*3)%5<2)?2:1;}
  else if(r>=N-3&&r<=N-2&&c>=Math.floor(mid)-1&&c<=Math.floor(mid)+1)h=1;
  if(h){W.h[r*N+c]=h;W.c[r*N+c]=wrlColorAt(r,c,h);}}
 let sr=N-2,sc=Math.floor(mid);
 if(terrain==="island"){sr=-1;for(let r=N-1;r>=0&&sr<0;r--)if(W.h[r*N+sc]>0)sr=r;if(sr<0)sr=Math.floor(mid);}
 if(!W.h[sr*N+sc])W.h[sr*N+sc]=1;
 W.start=[sr,sc];return W;}
/* ---------- caminos ---------- */
function wrlCan(W,r,c,r2,c2){const N=W.N;return r2>=0&&c2>=0&&r2<N&&c2<N&&W.h[r2*N+c2]>0&&W.h[r2*N+c2]-W.h[r*N+c]<=1;}
/* vecinos a los que se llega desde (r,c): caminando ("w") o saltando desde un trampolín ("j") */
function wrlNbrs(W,r,c){
 const N=W.N,it=W.items[r+","+c];
 if(it&&it.t==="boost"){const d=WRL_DIRS[it.d||0],r2=r+d[0]*2,c2=c+d[1]*2;
  if(r2>=0&&c2>=0&&r2<N&&c2<N&&W.h[r2*N+c2]>0&&W.h[r2*N+c2]-W.h[r*N+c]<=2&&!(W.items[r2+","+c2]&&W.items[r2+","+c2].t==="gate"))return[[r2,c2,"j"]];}
 const out=[];WRL_DIRS.forEach(function(d){const r2=r+d[0],c2=c+d[1];if(wrlCan(W,r,c,r2,c2))out.push([r2,c2,"w"]);});return out;}
/* ruta más barata (Dijkstra): las trampas y los pinchos "cuestan" más para esquivarlos; noise = bots con rutas distintas */
function wrlDijkstra(W,from,pen,noise,seed){
 const N=W.N,dist=new Array(N*N).fill(Infinity),prev=new Array(N*N).fill(-1),done=new Array(N*N).fill(false);
 dist[from[0]*N+from[1]]=0;
 for(;;){let b=-1,bd=Infinity;for(let i=0;i<N*N;i++)if(!done[i]&&dist[i]<bd){bd=dist[i];b=i;}
  if(b<0)break;done[b]=true;const r=Math.floor(b/N),c=b%N;
  wrlNbrs(W,r,c).forEach(function(n){const j=n[0]*N+n[1],it=W.items[n[0]+","+n[1]];
   let cost=1+(it?(pen[it.t]||0):0);if(noise)cost+=hash2(n[0],n[1],seed)*noise;
   if(dist[b]+cost<dist[j]){dist[j]=dist[b]+cost;prev[j]=b;}});}
 return{dist:dist,prev:prev};}
function hash2(r,c,s){let x=(r*73856093)^(c*19349663)^((s||1)*83492791);x=(x^(x>>>13))*1274126177;return((x^(x>>>16))>>>0)%1000/1000;}
function wrlPathTo(D,N,to){const out=[];let j=to[0]*N+to[1];if(D.dist[j]===Infinity)return null;while(j>=0){out.unshift([Math.floor(j/N),j%N]);j=D.prev[j];}return out;}
function wrlCheck(W){
 const N=W.N,res={gates:0,stars:0,traps:0,solvable:false,msgs:[]};
 Object.keys(W.items).forEach(function(k){const t=W.items[k].t;if(t==="gate")res.gates++;else if(t==="star")res.stars++;else if(t==="trap"||t==="spike")res.traps++;});
 if(!W.start)res.msgs.push("Falta poner la 🚩 salida.");
 if(!W.fin)res.msgs.push("Falta poner la 🏁 meta.");
 if(res.gates<3)res.msgs.push("Pon al menos 3 puertas de reto 🚪 (tienes "+res.gates+").");
 if(W.start&&W.fin){const D=wrlDijkstra(W,W.start,{},0);res.solvable=D.dist[W.fin[0]*N+W.fin[1]]<Infinity;
  if(!res.solvable)res.msgs.push("¡Ojo! No se puede llegar a la meta: revisa los huecos y que cada escalón suba solo 1.");}
 res.ok=!res.msgs.length;return res;}



/* ---------- retos de las puertas (todos los temas) ---------- */
function wrlTopicInfo(g){let t=(g&&g.topic)||(g&&WRL_LEGACY[g.kind])||"mate";return WRL_TOPICS.find(function(x){return x[0]===t;})||WRL_TOPICS[0];}
function wrlGateStyle(g){const t=wrlTopicInfo(g);return{col:t[3],emo:t[1]};}
function wrlItemQ(t){
 const keys=WRL_SRC[t];if(!keys)return null;
 for(let k=0;k<4;k++){
  const tk=pick(weakestTopics(keys,3));let it;
  try{it=KID_TOPICS[tk].fallback();}catch(e){continue;}
  if(!it||!Array.isArray(it.ops))continue;
  let ans=it.a>=0?it.ops[it.a]:it.fixAns;if(ans==null)continue;
  const ops=shuffled(it.ops.slice());let marked=false;
  const o=ops.map(function(x){const ok=!marked&&x===ans;if(ok)marked=true;return{t:x,ok:ok};});
  if(!marked)continue;
  return{q:it.q,pic:it.pic||"",ops:o,hint:it.hint||it.tip||"Piensa con calma, tú puedes 💪",subj:WRL_SUBJ[t],topicKey:tk,word:it.en?(it.word||null):null,lang:"es"};}
 return null;}
function wrlQ(g,W){
 g=g||{topic:"mix",lv:1};const lv=g.lv||1;
 if(g.kind&&!g.topic)return wrlGate(g.kind,lv,null,W&&W.lang);
 let t=g.topic||"mix";if(t==="mix")t=pick(["mate","leng","cien","soc","tiempo","eng","logi"]);
 let q=null;
 if(t==="mate"&&Math.random()<.4)q=wrlGate(pick(lv===1?["sum","res","cmp"]:["sum","res","tab","pat","cmp"]),lv,null,"es");
 else if(t==="logi"&&Math.random()<.35)q=wrlGate("log",lv,null,"es");
 else if(t==="eng"&&Math.random()<.5)q=wrlGate(pick(["voc","ear","num"]),lv,null,"en");
 if(!q)q=wrlItemQ(t);
 if(!q)q=wrlGate("sum",lv,null,"es");
 q.topic=t;return q;}
function wrlQHTML(q){
 const pic=q.pic?(String(q.pic).charAt(0)==="<"?'<div style="text-align:center;margin:4px 0">'+q.pic+'</div>':'<div style="text-align:center;font-size:2.4rem;line-height:1.2">'+q.pic+'</div>'):"";
 return pic+'<div style="font-family:Fredoka;font-weight:700;font-size:'+(q.q.length>60?'1.08rem':'1.3rem')+';line-height:1.45;margin:6px 0;text-align:center">'+q.q.replace(/[<>]/g,"")+'</div>';}
function wrlSayQ(q){
 if(!q)return;
 if(q.lang==="en")speakEN(q.say||q.q);
 else if(q.word)speakEN(q.word);
 else speakES(String(q.q).replace(/[❓➕➖✖️÷×−]/g," ").replace(/_{2,}/g," ... "));}

/* ---------- pantalla principal ---------- */
function wrlMedal(id){const pl=(prof().wrlPlace||{})[id];return pl===1?"🥇":pl===2?"🥈":pl?"🥉":"";}
function wrlTopicChips(topics){return topics.map(function(t){const x=WRL_TOPICS.find(function(y){return y[0]===t;});return x?'<span title="'+x[2]+'">'+x[1]+'</span>':"";}).join(" ");}
function screenWorlds(){setTheme("kid");
 wrlCleanup();
 const l=wrlList(),bean=prof().beanColor||0;
 render(topbar("screenKidMap()")+subHeader("🏁 Mundos y carreras")
  +'<div class="card" style="background:linear-gradient(135deg,#ECFEFF,#FEF9C3);font-size:.92rem;line-height:1.5"><b>🏆 ¡Llega de primero!</b> Corre contra los bots 🤖 y resuelve los retos de las <b>puertas 🚪</b>: mates, lenguaje, ciencias, inglés y más. Cuidado con las trampas 🔙 y los pinchos ⚡.</div>'
  +'<p class="appsec">🏁 Carreras listas para jugar</p>'
  +wrlPre().map(function(w){const pre=WRL_PRE.find(function(x){return x.id===w.id;});const b=(prof().wrlBest||{})[w.id];
   return '<div class="card" style="padding:10px 12px;margin-bottom:8px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:2.2rem">'+pre.ic+'</span><div style="flex:1;line-height:1.3"><b>'+esc(w.nm)+'</b> '+wrlMedal(w.id)+'<br><span class="mut" style="font-size:.78rem">'+esc(pre.desc)+'</span><br><span style="font-size:.85rem">'+wrlTopicChips(pre.topics.filter(function(t,i,a){return a.indexOf(t)===i;}))+' · '+"⭐".repeat(pre.diff)+'<span class="mut"> '+["","fácil","medio","reto"][pre.diff]+'</span></span></div></div>'
    +'<div style="display:flex;gap:6px;margin-top:8px"><button class="kbtn green" style="margin:0;min-height:46px;font-size:.95rem;flex:3" onclick="wrlStart(\''+w.id+'\')">🏁 Carrera con bots</button><button class="kbtn white" style="margin:0;min-height:46px;font-size:.85rem;flex:2" onclick="wrlStart(\''+w.id+'\',true)">🧘 Sin bots</button></div></div>';}).join("")
  +'<p class="appsec" style="margin-top:12px">🧱 Crea tu propio mundo</p>'
  +'<button class="kbtn yellow" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="wrlNewScreen()"><span style="font-size:2.2rem">🧱</span><span style="flex:1"><span>Crear un mundo nuevo</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Elige el tamaño y el estilo; construye tocando y arrastrando</span></span></button>'
  +(l.length?'<p class="appsec" style="margin-top:8px">Mis mundos ('+l.length+')</p>':'')
  +l.map(function(w){const ch=wrlCheck(w),b=(prof().wrlBest||{})[w.id],th=(window.WORLD_THEMES||{})[w.theme||"grass"]||{ic:"🌍"};
   return '<div class="card" style="padding:10px 12px;margin-bottom:8px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:1.9rem">'+th.ic+'</span><div style="flex:1;line-height:1.3"><b>'+esc(w.nm)+'</b> '+wrlMedal(w.id)+'<br><span class="mut" style="font-size:.8rem">'+w.N+'×'+w.N+' · 🚪 '+ch.gates+' · ⭐ '+ch.stars+(ch.ok?" · ✅ lista":" · 🔧 por terminar")+'</span></div></div><div style="display:flex;gap:6px;margin-top:8px"><button class="kbtn green" style="margin:0;min-height:44px;font-size:.88rem;flex:3" onclick="wrlStart(\''+w.id+'\')">🏁 Carrera</button><button class="kbtn white" style="margin:0;min-height:44px;font-size:.85rem;flex:2" onclick="wrlEdit(\''+w.id+'\')">🧱 Editar</button><button class="kbtn white" style="margin:0;min-height:44px;flex:1" onclick="wrlShare(\''+w.id+'\')" aria-label="Compartir">📤</button><button class="kbtn white" style="margin:0;min-height:44px;flex:1" onclick="wrlDel(\''+w.id+'\')" aria-label="Borrar">🗑️</button></div></div>';}).join("")
  +(typeof screenLudo==="function"?'<p class="appsec" style="margin-top:12px">🎲 Juegos de mesa</p><button class="kbtn purple" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="screenLudo()"><span style="font-size:2.2rem">🎲</span><span style="flex:1"><span>Ludo con retos</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Aprende a jugar Ludo contra bots y gana fichas de ayuda</span></span></button>':'')
  +'<div class="card" style="padding:8px 12px;margin-top:10px"><b style="font-size:.9rem">Mi frijolito:</b> '+(window.WORLD_PAL||[]).map(function(c,i){return '<button onclick="wrlBean('+i+')" aria-label="color" style="width:34px;height:34px;border-radius:50%;border:4px solid '+(i===bean?"#1E293B":"#fff")+';box-shadow:0 0 0 2px #CBD5E1;background:'+c+';margin:2px;cursor:pointer"></button>';}).join("")+'</div>'
  +'<button class="kbtn white" style="min-height:44px;font-size:.9rem;margin-top:6px" onclick="wrlImportScreen()">📥 Importar un mundo con código</button>');}
function wrlBeanColor(){const P=window.WORLD_PAL||["#F472B6"];return P[(prof().beanColor||0)%P.length];}
function wrlBean(i){prof().beanColor=i;save();screenWorlds();}
function wrlDel(id){if(!confirm("¿Borrar este mundo?"))return;const l=wrlList(),k=l.findIndex(function(w){return w.id===id;});if(k>=0){l.splice(k,1);save();}screenWorlds();}

/* ---------- crear un mundo: tamaño, estilo y terreno ---------- */
function wrlNewScreen(){setTheme("kid");
 if(wrlList().length>=WRL_MAXW){toast("Máximo "+WRL_MAXW+" mundos: borra uno para crear otro 🙂",false,2400);return;}
 WRL.nw=WRL.nw||{N:14,theme:"grass",terrain:"island"};wrlNewDraw();}
function wrlNewDraw(){
 const nw=WRL.nw,chip=function(on,onclick,t){return '<button onclick="'+onclick+'" style="margin:3px;padding:9px 14px;border-radius:14px;border:3px solid '+(on?"#7C3AED":"#E2E8F0")+';background:'+(on?"#EDE9FE":"#fff")+';font-weight:700;cursor:pointer;color:#1E293B;font-size:.95rem">'+t+'</button>';};
 render(topbar("screenWorlds()")+subHeader("🧱 Crear un mundo")
  +'<div class="card"><b>1. Tamaño</b><div>'+[[10,"Pequeño"],[14,"Mediano"],[18,"Grande"]].map(function(x){return chip(nw.N===x[0],"WRL.nw.N="+x[0]+";wrlNewDraw()",x[1]+" ("+x[0]+"×"+x[0]+")");}).join("")+'</div>'
  +'<b style="display:block;margin-top:8px">2. Estilo</b><div>'+Object.keys(window.WORLD_THEMES).map(function(k){const t=window.WORLD_THEMES[k];return chip(nw.theme===k,"WRL.nw.theme='"+k+"';wrlNewDraw()",t.ic+" "+t.nm);}).join("")+'</div>'
  +'<b style="display:block;margin-top:8px">3. Empieza con…</b><div>'+[["island","🏝️ Una isla"],["flat","🟩 Llanura"],["sea","🌊 Mar vacío"]].map(function(x){return chip(nw.terrain===x[0],"WRL.nw.terrain='"+x[0]+"';wrlNewDraw()",x[1]);}).join("")+'</div></div>'
  +'<button class="kbtn green" onclick="wrlNewCreate()">🧱 ¡A construir!</button>');}
function wrlNewCreate(){const nw=WRL.nw||{N:14,theme:"grass",terrain:"island"};const W=wrlBlank(nw.N,nw.theme,nw.terrain);W.nm="Mi mundo "+(wrlList().length+1);wrlList().unshift(W);save();wrlEdit(W.id);}

/* ---------- compartir ---------- */
function wrlEncode(W){
 const o={n:W.nm,N:W.N,t:W.theme||"grass",h:W.h.join(""),c:W.c.join(""),i:Object.keys(W.items).map(function(k){const it=W.items[k];return[k,it.t,it.g?(it.g.topic||it.g.kind):"",it.g?it.g.lv:(it.d||0)];}),s:W.start,f:W.fin};
 return "AFW2:"+btoa(unescape(encodeURIComponent(JSON.stringify(o))));}
function wrlDecode(code){
 const m=/^AFW([12]):([A-Za-z0-9+/=]+)$/.exec(String(code||"").trim());if(!m)throw new Error("El código no es válido");
 const o=JSON.parse(decodeURIComponent(escape(atob(m[2]))));
 const N=m[1]==="1"?10:Math.max(8,Math.min(20,+o.N||0));
 if(typeof o.h!=="string"||o.h.length!==N*N||typeof o.c!=="string"||o.c.length!==N*N)throw new Error("El mundo del código no es compatible");
 const W={id:"w"+Date.now(),nm:String(o.n||"Mundo importado").replace(/[<>]/g,"").slice(0,24),N:N,theme:(window.WORLD_THEMES||{})[o.t]?o.t:"grass",h:o.h.split("").map(function(x){return Math.max(0,Math.min(window.WORLD_HMAX||6,+x||0));}),c:o.c.split("").map(function(x){return Math.max(0,Math.min(5,+x||0));}),items:{},start:null,fin:null,ts:Date.now(),seed:5};
 (o.i||[]).forEach(function(x){if(!Array.isArray(x)||!/^\d+,\d+$/.test(x[0]))return;const p=x[0].split(",").map(Number);if(p[0]>=N||p[1]>=N||!W.h[p[0]*N+p[1]])return;
  if(x[1]==="star")W.items[x[0]]={t:"star"};else if(x[1]==="trap")W.items[x[0]]={t:"trap"};else if(x[1]==="spike")W.items[x[0]]={t:"spike"};
  else if(x[1]==="boost")W.items[x[0]]={t:"boost",d:Math.max(0,Math.min(3,+x[3]||0))};
  else if(x[1]==="gate"){const tp=String(x[2]);const lv=Math.max(1,Math.min(3,+x[3]||1));
   if(WRL_TOPICS.some(function(t){return t[0]===tp;}))W.items[x[0]]={t:"gate",g:{topic:tp,lv:lv}};else if(WRL_LEGACY[tp])W.items[x[0]]={t:"gate",g:{kind:tp,lv:lv}};}});
 if(Array.isArray(o.s)&&o.s.length===2&&W.h[o.s[0]*N+o.s[1]])W.start=[+o.s[0],+o.s[1]];if(Array.isArray(o.f)&&o.f.length===2&&W.h[o.f[0]*N+o.f[1]])W.fin=[+o.f[0],+o.f[1]];
 return W;}
function wrlShare(id){const W=wrlGet(id);if(!W)return;const code=wrlEncode(W);
 const done=function(){toast("Código copiado 📋 Pásalo a un amigo para que corra en tu mundo",true,3000);};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(code).then(done,function(){wrlFallback(code,done);});else wrlFallback(code,done);}
function wrlFallback(t,done){const a=document.createElement("textarea");a.value=t;a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();try{document.execCommand("copy");done();}catch(e){prompt("Copia este código:",t);}a.remove();}
function wrlImportScreen(){setTheme("kid");
 render(topbar("screenWorlds()")+subHeader("📥 Importar un mundo")
  +'<div class="card"><b>Pega el código</b> <span class="mut" style="font-size:.82rem">(empieza con AFW)</span><textarea id="wrlCode" rows="4" style="width:100%;padding:8px;border-radius:12px;border:2px solid #E2E8F0;margin-top:6px;box-sizing:border-box;font-size:.85rem"></textarea></div><button class="kbtn green" onclick="wrlImport()">Importar</button><div id="wrlFb"></div>');}
function wrlImport(){
 try{const W=wrlDecode((document.getElementById("wrlCode")||{}).value);const l=wrlList();if(l.length>=WRL_MAXW)throw new Error("Ya tienes "+WRL_MAXW+" mundos: borra uno primero");l.unshift(W);save();toast("Mundo importado 🌍",true,1600);screenWorlds();}
 catch(e){const f=document.getElementById("wrlFb");if(f)f.innerHTML='<div class="card" style="background:#FEE2E2">⚠️ '+esc(e.message)+'</div>';}}


/* ---------- EDITOR: construir tocando y arrastrando ---------- */
const WRL_TOOLS=[["build","🧱","Poner"],["erase","⛏️","Quitar"],["paint","🎨","Pintar"],["star","⭐","Estrella"],["gate","🚪","Reto"],["trap","🔙","Trampa"],["spike","⚡","Pinchos"],["boost","🦘","Salto"],["start","🚩","Salida"],["fin","🏁","Meta"],["clear","🧽","Borrar"],["cam","🖐️","Mover"]];
const WRL_PAINT={build:1,erase:1,paint:1,star:1,trap:1,spike:1,clear:1};
function wrlSnap(W){return JSON.stringify({h:W.h,c:W.c,items:W.items,start:W.start,fin:W.fin});}
function wrlUndoPush(){const u=WRL.undo;u.push(wrlSnap(WRL.W));while(u.length>30)u.shift();}
function wrlUndo(){const u=WRL.undo;if(!u.length){toast("No hay nada que deshacer",false,1000);return;}const s=JSON.parse(u.pop()),W=WRL.W;W.h=s.h;W.c=s.c;W.items=s.items;W.start=s.start;W.fin=s.fin;WRL.c3.refresh(W);save();wrlStatus();}
function wrlEdit(id){setTheme("kid");
 const W=wrlGet(id);if(!W||W.pre)return;
 wrlCleanup();
 WRL.W=W;WRL.tool="build";WRL.undo=[];WRL.stroke=null;
 render(topbar("screenWorlds()")
  +'<div class="card" style="padding:6px 12px"><input id="wrlName" value="'+esc(W.nm)+'" maxlength="24" oninput="WRL.W.nm=this.value" style="width:100%;font-family:Fredoka;font-weight:700;font-size:1.1rem;border:0;border-bottom:3px solid #CBD5E1;padding:4px;box-sizing:border-box" aria-label="Nombre del mundo"></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px;position:relative"><div id="wrlCanvas" style="width:100%;height:clamp(300px,50vh,470px)"></div>'
   +'<div style="position:absolute;right:6px;top:6px;display:flex;flex-direction:column;gap:6px">'
   +'<button class="wrlfab" onclick="wrlUndo()" aria-label="Deshacer">↩️</button><button class="wrlfab" onclick="WRL.c3.cam.th+=.6;WRL.c3.cam.touched=true" aria-label="Girar">⟳</button><button class="wrlfab" onclick="WRL.c3.view(\'reset\')" aria-label="Ver todo">🔭</button></div></div>'
  +'<div id="wrlTools" style="margin-top:6px"></div><div id="wrlPanel"></div>'
  +'<div id="wrlStatus" class="card" style="margin-top:6px;font-size:.88rem;line-height:1.5"></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px"><button class="kbtn green" style="margin:0;font-size:.9rem" onclick="wrlSaveEdit(0)">💾 Guardar</button><button class="kbtn white" style="margin:0;font-size:.9rem" onclick="wrlSaveEdit(1)">🧘 Probar</button><button class="kbtn yellow" style="margin:0;font-size:.9rem" onclick="wrlSaveEdit(2)">🏁 Carrera</button></div>'
  +'<style>.wrlfab{width:42px;height:42px;border-radius:50%;border:3px solid #fff;background:rgba(30,41,59,.62);color:#fff;font-size:1.25rem;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.3)}</style>');
 WRL.c3=renderWorld3D("wrlCanvas",W,{mode:"edit",gateStyle:wrlGateStyle,paint:function(){return !!WRL_PAINT[WRL.tool];}},wrlEv);
 wrlToolsDraw();wrlStatus();}
function wrlToolsDraw(){
 const el=document.getElementById("wrlTools");if(!el)return;
 el.innerHTML='<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px">'+WRL_TOOLS.map(function(t){const on=WRL.tool===t[0];return '<button onclick="wrlTool(\''+t[0]+'\')" style="padding:5px 2px;border-radius:12px;border:3px solid '+(on?"#3B82F6":"#E2E8F0")+';background:'+(on?"#DBEAFE":"#fff")+';cursor:pointer;color:#1E293B;font-weight:700;font-size:.68rem;text-align:center;line-height:1.15"><span style="font-size:1.35rem">'+t[1]+'</span><br>'+t[2]+'</button>';}).join("")+'</div>';
 const pn=document.getElementById("wrlPanel");if(!pn)return;
 const cols=(window.WORLD_THEMES[WRL.W.theme]||window.WORLD_THEMES.grass).top;
 const colorRow='<div style="margin-top:4px"><b style="font-size:.82rem">Color:</b> '+cols.map(function(c,i){return '<button onclick="WRL.color='+i+';wrlToolsDraw()" aria-label="color" style="width:32px;height:32px;border-radius:8px;border:4px solid '+(i===WRL.color?"#1E293B":"#fff")+';box-shadow:0 0 0 2px #CBD5E1;background:'+c+';margin:2px;cursor:pointer"></button>';}).join("")+'</div>';
 const hint=function(t){return '<p class="mut" style="font-size:.82rem;margin:2px 4px;line-height:1.4">'+t+'</p>';};
 let h="";const t=WRL.tool;
 if(t==="build")h='<div class="card" style="padding:8px 10px;margin:4px 0 0">'+hint("<b>Toca arriba</b> de un bloque para subirlo, o <b>toca un lado</b> para poner otro al lado. <b>¡Arrastra el dedo para dibujar caminos!</b> Con 2 dedos haces zoom 🔍.")+colorRow+'</div>';
 else if(t==="paint")h='<div class="card" style="padding:8px 10px;margin:4px 0 0">'+hint("Toca o arrastra sobre los bloques para pintarlos.")+colorRow+'</div>';
 else if(t==="gate"){
  const g=WRL.gate;
  h='<div class="card" style="padding:8px 10px;margin:4px 0 0"><b style="font-size:.85rem">¿Qué reto tendrá la puerta?</b><div style="display:flex;flex-wrap:wrap;gap:4px;margin:6px 0">'+WRL_TOPICS.map(function(k){const on=g.topic===k[0];return '<button onclick="WRL.gate.topic=\''+k[0]+'\';wrlToolsDraw()" style="padding:6px 10px;border-radius:12px;border:3px solid '+(on?k[3]:"#E2E8F0")+';background:'+(on?"#F8FAFC":"#fff")+';cursor:pointer;font-weight:700;font-size:.82rem;color:#1E293B">'+k[1]+' '+k[2]+'</button>';}).join("")+'</div>'
   +'<b style="font-size:.85rem">Nivel:</b> '+[1,2,3].map(function(l){const on=g.lv===l;return '<button onclick="WRL.gate.lv='+l+';wrlToolsDraw()" style="padding:6px 12px;border-radius:12px;border:3px solid '+(on?"#7C3AED":"#E2E8F0")+';background:'+(on?"#EDE9FE":"#fff")+';cursor:pointer;font-weight:700;margin-left:4px;color:#1E293B">'+["","🌱 Fácil","🌿 Medio","🌳 Reto"][l]+'</button>';}).join("")
   +hint("Toca un bloque para poner la puerta (ponla en un camino angosto para que no la esquiven). Para cambiarla, toca otra vez con otro reto.")+'</div>';}
 else if(t==="boost")h=hint("Toca un bloque para poner un trampolín 🦘. <b>Toca otra vez</b> para girarlo: salta 2 casillas hacia donde apunta la flecha (¡sirve para cruzar el mar!).");
 else h=hint(({erase:"Toca o arrastra para quitar bloques de arriba. Si quitas el último, queda un hueco y quien pase se cae al mar 🌊.",star:"Toca o arrastra para poner o quitar estrellas ⭐.",trap:"Toca o arrastra para poner trampas 🔙: quien las pise retrocede 3 casillas. ¡Déjale un camino para esquivarlas!",spike:"Toca o arrastra para poner pinchos ⚡ que suben y bajan: hay que cruzar cuando están abajo.",start:"Toca un bloque para poner la salida 🚩.",fin:"Toca un bloque para poner la meta 🏁.",clear:"Toca o arrastra para borrar lo que haya encima (estrella, puerta, trampa, salida o meta).",cam:"Arrastra para girar la cámara. Con 2 dedos: zoom y mover."})[t]||"");
 pn.innerHTML=h;}
function wrlTool(t){WRL.tool=t;wrlToolsDraw();}
function wrlStatus(){
 const W=WRL.W,ch=wrlCheck(W),el=document.getElementById("wrlStatus");if(!el)return;
 el.innerHTML='🚪 Retos: <b>'+ch.gates+'</b> (mínimo 3) · ⭐ <b>'+ch.stars+'</b> · ⚠️ Trampas: <b>'+ch.traps+'</b> · '+(ch.ok?'<span style="color:#16A34A;font-weight:800">✅ ¡Tu mundo está listo para correr!</span>':'<span style="color:#B45309">🔧 '+ch.msgs.map(esc).join(" ")+'</span>');}
function wrlClearCell(W,r,c){delete W.items[r+","+c];if(W.start&&W.start[0]===r&&W.start[1]===c)W.start=null;if(W.fin&&W.fin[0]===r&&W.fin[1]===c)W.fin=null;}
function wrlIsSF(W,r,c){return(W.start&&W.start[0]===r&&W.start[1]===c)||(W.fin&&W.fin[0]===r&&W.fin[1]===c);}
function wrlSetH(r,c,h,col){
 const W=WRL.W,N=W.N,i=r*N+c,old=W.h[i];h=Math.max(0,Math.min(window.WORLD_HMAX||6,h));if(h===old)return false;
 W.h[i]=h;if(old===0&&h>0)W.c[i]=col;
 if(h===0){wrlClearCell(W,r,c);W.c[i]=0;}
 WRL.c3.setCell(r,c);WRL.c3.flash(r,c,"#ffffff");return true;}
/* una pincelada sobre una casilla; first=true en el primer toque del trazo */
function wrlApply(info,first){
 const W=WRL.W,N=W.N,t=WRL.tool,S=WRL.stroke||(WRL.stroke={}),r=info.r,c=info.c,i=r*N+c,key=r+","+c;
 const fx=function(){WRL.c3.setCell(r,c);WRL.c3.flash(r,c,"#FDE047");};
 if(t==="build"){
  if(first){let rr=r,cc=c,lv;
   if(info.face==="top"||info.h===0)lv=Math.min(window.WORLD_HMAX||6,(info.h||0)+1);
   else{const d={n:[-1,0],s:[1,0],e:[0,1],w:[0,-1]}[info.face];rr=r+d[0];cc=c+d[1];if(rr<0||cc<0||rr>=N||cc>=N){toast("Ahí se acaba el mundo 🌍",false,900);return;}
    const nh=W.h[rr*N+cc];lv=nh>=info.k+1?Math.min(window.WORLD_HMAX||6,nh+1):info.k+1;}
   S.level=lv;wrlSetH(rr,cc,lv,WRL.color);sOK();}
  else if(S.level&&W.h[i]<S.level)wrlSetH(r,c,S.level,WRL.color);}
 else if(t==="erase"){
  if(first){S.level=Math.max(0,(W.h[i]||0)-1);if(W.h[i]>0){wrlSetH(r,c,S.level,0);sOK();}}
  else if(W.h[i]>S.level)wrlSetH(r,c,S.level,0);}
 else if(t==="paint"){if(W.h[i]>0&&W.c[i]!==WRL.color){W.c[i]=WRL.color;fx();}}
 else if(t==="star"||t==="trap"||t==="spike"){
  const ty=t;if(first)S.mode=(W.items[key]&&W.items[key].t===ty)?"del":"add";
  if(S.mode==="del"){if(W.items[key]&&W.items[key].t===ty){delete W.items[key];fx();}}
  else if(W.h[i]>0&&!wrlIsSF(W,r,c)&&!W.items[key]){W.items[key]={t:ty};fx();if(first)sOK();}
  else if(first){sNO();}}
 else if(t==="clear"){if(W.items[key]||wrlIsSF(W,r,c)){wrlClearCell(W,r,c);fx();}}}
function wrlTapTool(info){
 const W=WRL.W,N=W.N,t=WRL.tool,r=info.r,c=info.c,i=r*N+c,key=r+","+c;
 if(t==="cam")return;
 if(!W.h[i]){sNO();toast("Pon primero un bloque ahí 🧱",false,1000);return;}
 wrlUndoPush();
 if(t==="gate"){if(wrlIsSF(W,r,c)){sNO();toast("Pon la puerta en otro bloque (no la salida ni la meta)",false,1500);return;}
  const ex=W.items[key],g=WRL.gate;
  if(ex&&ex.t==="gate"&&ex.g&&ex.g.topic===g.topic&&ex.g.lv===g.lv)delete W.items[key];else if(ex&&ex.t!=="gate"&&ex.t!=="star"){sNO();return;}else W.items[key]={t:"gate",g:{topic:g.topic,lv:g.lv}};sOK();}
 else if(t==="boost"){if(wrlIsSF(W,r,c)){sNO();return;}const ex=W.items[key];
  if(ex&&ex.t==="boost")ex.d=((ex.d||0)+1)%4;else if(ex&&ex.t!=="star"){sNO();return;}else W.items[key]={t:"boost",d:0};sOK();}
 else if(t==="start"||t==="fin"){const o=W[t];if(o){W[t]=null;WRL.c3.setCell(o[0],o[1]);}delete W.items[key];
  const other=t==="start"?"fin":"start";if(W[other]&&W[other][0]===r&&W[other][1]===c)W[other]=null;W[t]=[r,c];sOK();}
 WRL.c3.setCell(r,c);WRL.c3.flash(r,c,"#FDE047");wrlStatus();save();}
function wrlEv(ev,info){
 if(!WRL.W||!WRL.c3)return;
 if(ev==="stroke"){
  if(info.phase==="start"){wrlUndoPush();WRL.stroke={};wrlApply(info,true);}
  else if(info.phase==="move"){wrlApply(info,false);}
  else if(info.phase==="end"){WRL.stroke=null;wrlStatus();save();}}
 else if(ev==="tap"){wrlTapTool(info);}}
function wrlSaveEdit(mode){
 const W=WRL.W;W.nm=(W.nm||"").replace(/[<>]/g,"").trim().slice(0,24)||"Mi mundo";W.ts=Date.now();save();
 if(!mode){toast("Mundo guardado 💾",true,1200);return;}
 const ch=wrlCheck(W);if(!ch.ok){toast("Aún no se puede correr: "+ch.msgs[0],false,2800);return;}
 wrlStart(W.id,mode===1);}


/* ---------- CARRERA ---------- */
function wrlCleanup(){
 if(WRL.timers)WRL.timers.forEach(clearTimeout);WRL.timers=[];
 if(WRL.key){document.removeEventListener("keydown",WRL.key);WRL.key=null;}
 try{window.speechSynthesis.cancel();}catch(e){}}
function wrlLater(fn,ms){const t=setTimeout(fn,ms);WRL.timers.push(t);return t;}
const WRL_BOTS=[["Rayo","#3B82F6","party",.07],["Luna","#A78BFA","beanie",0],["Pepa","#FB923C","cap",-.08]];
function wrlStart(id,practice){setTheme("kid");
 const src=wrlGet(id);if(!src)return;
 const ch=wrlCheck(src);if(!ch.ok){toast("Este mundo todavía no está listo: "+ch.msgs[0],false,2800);return src.pre?null:wrlEdit(id);}
 wrlCleanup();
 const W=wrlClone(src),N=W.N;
 const R=WRL.R={id:id,W:W,src:src,items0:wrlClone(src).items,practice:!!practice,go:false,over:false,t:0,hudT:0,gatesTotal:ch.gates,starsTotal:ch.stars,bots:[],fin:[],place:0,
  P:{B:null,hist:[],cp:[W.start[0],W.start[1]],target:null,gate:null,stars:0,solved:0,firstOk:0,tries:0,falls:0,done:false,tDone:0,spkHit:0}};
 const D0=wrlDijkstra(W,W.start,{},0);R.dS=D0.dist;R.dFin=D0.dist[W.fin[0]*N+W.fin[1]]||1;
 render(topbar("screenWorlds()")
  +'<div style="display:flex;justify-content:space-between;align-items:center;font-family:Fredoka;font-weight:700;margin-bottom:4px;gap:6px"><span style="font-size:.95rem">'+esc(src.nm)+'</span><span id="wrlHud" style="font-size:.9rem"></span></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px;position:relative"><div id="wrlCanvas" style="width:100%;height:clamp(280px,46vh,440px)"></div>'
   +'<div id="wrlCount" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Fredoka;font-weight:900;font-size:5rem;color:#fff;text-shadow:0 4px 0 #1E293B,0 0 22px rgba(0,0,0,.4);pointer-events:none"></div>'
   +'<div id="wrlMsg" style="position:absolute;left:8px;right:8px;top:8px;text-align:center;font-weight:800;font-size:.95rem;text-shadow:0 1px 3px #fff;pointer-events:none"></div>'
   +'<div id="wrlPad" style="position:absolute;right:8px;bottom:8px;display:grid;grid-template-columns:repeat(3,46px);grid-template-rows:repeat(2,46px);gap:5px"><span></span><button class="wrlpd" onclick="wrlPad(\'up\')" aria-label="Arriba">⬆️</button><span></span><button class="wrlpd" onclick="wrlPad(\'left\')" aria-label="Izquierda">⬅️</button><button class="wrlpd" onclick="wrlPad(\'down\')" aria-label="Abajo">⬇️</button><button class="wrlpd" onclick="wrlPad(\'right\')" aria-label="Derecha">➡️</button></div>'
   +'<button class="wrlpd" style="position:absolute;left:8px;bottom:8px;width:auto;padding:0 12px;font-size:.85rem" onclick="wrlView()">👁️ Vista</button></div>'
  +'<div id="wrlRank"></div><div id="wrlQ"></div>'
  +'<p class="center mut" style="font-size:.78rem;margin:4px 0">Toca una casilla y tu frijolito va solo 👆 · o usa las flechas · arrastra para girar la cámara</p>'
  +'<style>.wrlpd{width:46px;height:46px;border-radius:14px;border:3px solid #fff;background:rgba(30,41,59,.58);color:#fff;font-size:1.3rem;cursor:pointer;font-weight:700}</style>');
 const c3=WRL.c3=renderWorld3D("wrlCanvas",W,{mode:"play",gateStyle:wrlGateStyle},wrlPlayEv);
 const P=R.P;P.B=c3.addBean({color:wrlBeanColor(),name:"TÚ",me:true,hat:"cap"});P.B.place(W.start[0],W.start[1]);P.hist=[[W.start[0],W.start[1]]];c3.follow(P.B);
 if(!practice){
  /* los bots arrancan en casillas libres junto a la salida */
  const starts=[],seen={};seen[W.start]=1;const q=[[W.start[0],W.start[1]]];
  while(q.length&&starts.length<3){const cur=q.shift();wrlNbrs(W,cur[0],cur[1]).forEach(function(n){const k=n[0]+","+n[1];if(seen[k]||n[2]!=="w")return;seen[k]=1;q.push([n[0],n[1]]);
   if(!W.items[k]&&!(W.fin[0]===n[0]&&W.fin[1]===n[1])&&starts.length<3&&wrlCan(W,n[0],n[1],n[0],n[1]))starts.push([n[0],n[1]]);});}
  while(starts.length<3)starts.push([W.start[0],W.start[1]]);
  const base=Math.max(.5,Math.min(1,(prof().raceSkill||.68)));
  WRL_BOTS.forEach(function(b,i){
   const B=c3.addBean({color:b[1],name:b[0],hat:b[2]});B.place(starts[i][0],starts[i][1]);
   const D=wrlDijkstra(W,starts[i],{trap:9,spike:2.2,gate:1.2},.6,i+3);
   R.bots.push({B:B,name:b[0],col:b[1],skill:Math.max(.45,Math.min(1.05,base+b[3])),route:wrlPathTo(D,N,W.fin)||[starts[i]],idx:0,wait:0,tn:.4+i*.15,passed:{},done:false,t:0});});}
 c3.onTick(wrlTick);
 WRL.key=function(e){const m={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"}[e.key];if(m){e.preventDefault();wrlPad(m);}};
 document.addEventListener("keydown",WRL.key);
 wrlHud();wrlRankDraw();
 /* cuenta regresiva */
 const cnt=function(t,ms,fn){wrlLater(function(){const el=document.getElementById("wrlCount");if(el)el.textContent=t;if(fn)fn();},ms);};
 cnt("3",300);cnt("2",1300);cnt("1",2300);cnt("¡YA!",3300,function(){R.go=true;sOK();});cnt("",4400);}
function wrlMsg(t,col){const m=document.getElementById("wrlMsg");if(m){m.textContent=t||"";m.style.color=col||"#1E293B";}
 if(WRL.msgT)clearTimeout(WRL.msgT);if(t)WRL.msgT=setTimeout(function(){const m2=document.getElementById("wrlMsg");if(m2)m2.textContent="";},2600);}
function wrlView(){const c3=WRL.c3,R=WRL.R;if(!c3||!R)return;R.top=!R.top;if(R.top)c3.view("top");else{c3.view("follow");c3.follow(R.P.B);}}
function wrlPad(name){const R=WRL.R;if(!R||!R.go||R.over||!WRL.c3)return;const d=WRL.c3.dir(name);R.P.target=null;wrlStep(d[0],d[1]);}
/* toque en el mundo: ir solo hasta esa casilla (esquivando trampas) */
function wrlPlayEv(ev,info){
 const R=WRL.R;if(!R||ev!=="tap"||!R.go||R.over)return;
 const W=R.W,N=W.N,P=R.P;
 if(P.gate)return;
 const D=wrlDijkstra(W,[P.B.r,P.B.c],{trap:9,spike:3,gate:1.2},0);
 let tgt=[info.r,info.c];
 if(!(D.dist[tgt[0]*N+tgt[1]]<Infinity)){ // casilla inalcanzable → la más cercana a la que sí se llega
  let best=null,bd=1e9;for(let i=0;i<N*N;i++)if(D.dist[i]<Infinity){const dd=Math.abs(Math.floor(i/N)-info.r)+Math.abs(i%N-info.c);if(dd<bd||(dd===bd&&D.dist[i]<D.dist[best])){bd=dd;best=i;}}
  if(best==null)return;tgt=[Math.floor(best/N),best%N];wrlMsg("No se llega directo… ¡voy lo más cerca! 🙂","#B45309");}
 P.target=tgt;WRL.c3.flash(tgt[0],tgt[1],"#38BDF8");}
function wrlPump(){
 const R=WRL.R,P=R.P,B=P.B;if(!P.target||B.busy()||P.gate||P.opening||!R.go||R.over)return;
 if(B.r===P.target[0]&&B.c===P.target[1]){P.target=null;return;}
 const D=wrlDijkstra(R.W,[B.r,B.c],{trap:9,spike:3,gate:1.2},0),path=wrlPathTo(D,R.W.N,P.target);
 if(!path||path.length<2){P.target=null;return;}
 const n=path[1],dr=n[0]-B.r,dc=n[1]-B.c;
 if(Math.abs(dr)+Math.abs(dc)!==1){P.target=null;return;}
 wrlStep(dr,dc);}
function wrlStep(dr,dc){
 const R=WRL.R;if(!R||!R.go||R.over)return;const P=R.P,B=P.B;if(B.busy()||P.gate||P.opening)return;
 const W=R.W,N=W.N,nr=B.r+dr,nc=B.c+dc;B.setFace(dr,dc);
 if(nr<0||nc<0||nr>=N||nc>=N){B.bump(dr,dc);P.target=null;wrlMsg("Ahí se acaba el mundo 🌍","#B45309");return;}
 const th=W.h[nr*N+nc],ch=W.h[B.r*N+B.c];
 if(th===0){P.target=null;B.fall(nr,nc,P.cp[0],P.cp[1],function(){P.falls++;wrlTrimHist();wrlMsg("🌊 ¡Splash! Volvemos al último punto seguro 😄","#0369A1");});return;}
 if(th-ch>1){B.bump(dr,dc);P.target=null;sNO();wrlMsg("¡Muy alto! Sube de a 1 escalón 🪜","#B45309");return;}
 const it=W.items[nr+","+nc];
 if(it&&it.t==="gate"){B.bump(dr,dc,function(){wrlOpenGate(nr,nc,it);});return;}
 B.hop(nr,nc,wrlArrive);}
function wrlTrimHist(){const P=WRL.R.P,k=P.cp[0]+","+P.cp[1];let at=-1;P.hist.forEach(function(h,i){if(h[0]+","+h[1]===k)at=i;});P.hist=at>=0?P.hist.slice(0,at+1):[[P.cp[0],P.cp[1]]];}
function wrlPushBack(n,msg){
 const R=WRL.R,P=R.P,B=P.B;const k=Math.max(0,P.hist.length-1-n),tg=P.hist[k]||R.W.start;P.hist.length=k+1;P.hist[k]=[tg[0],tg[1]];
 P.target=null;sNO();wrlMsg(msg,"#C2410C");B.slide(tg[0],tg[1]);}
function wrlArrive(){
 const R=WRL.R;if(!R)return;const P=R.P,B=P.B,W=R.W,key=B.r+","+B.c,it=W.items[key],c3=WRL.c3;
 if(!P.hist.length||P.hist[P.hist.length-1][0]!==B.r||P.hist[P.hist.length-1][1]!==B.c)P.hist.push([B.r,B.c]);
 if(P.hist.length>80)P.hist.shift();
 if(it){
  if(it.t==="star"){c3.removeItem(B.r,B.c);c3.burst(B.r,B.c,"#FACC15",16);P.stars++;sOK();confetti(4);wrlMsg("⭐ ¡Estrella!","#CA8A04");}
  else if(it.t==="trap"){wrlPushBack(3,"🔙 ¡Trampa! Retrocedes 3 casillas");return;}
  else if(it.t==="spike"&&c3.spikeUp(B.r,B.c)){wrlPushBack(2,"⚡ ¡Pinchos! Cruza cuando bajen");return;}
  else if(it.t==="boost"){wrlBoost(it);return;}}
 if(W.fin[0]===B.r&&W.fin[1]===B.c){wrlPlayerFinish();return;}
 wrlHud();}
function wrlBoost(it){
 const R=WRL.R,P=R.P,B=P.B,W=R.W,N=W.N,d=WRL_DIRS[it.d||0],r2=B.r+d[0]*2,c2=B.c+d[1]*2;
 if(r2>=0&&c2>=0&&r2<N&&c2<N&&W.h[r2*N+c2]>0&&W.h[r2*N+c2]-W.h[B.r*N+B.c]<=2&&!(W.items[r2+","+c2]&&W.items[r2+","+c2].t==="gate")){wrlMsg("🦘 ¡Boing!","#16A34A");sOK();P.target=null;B.hop(r2,c2,wrlArrive,.5);}
 else{wrlHud();}}
function wrlOpenGate(r,c,it){
 const R=WRL.R;if(!R)return;const P=R.P;P.target=null;
 P.gate={r:r,c:c,it:it,q:wrlQ(it.g,R.W),wrong:0,t0:Date.now()};wrlGateDraw();wrlLater(function(){if(WRL.R&&WRL.R.P.gate)wrlSayQ(WRL.R.P.gate.q);},350);}
function wrlGateDraw(){
 const R=WRL.R,G=R.P.gate,pnl=document.getElementById("wrlQ");if(!G||!pnl)return;
 const pad=document.getElementById("wrlPad");if(pad)pad.style.display="none";
 const st=wrlGateStyle(G.it.g),en=G.q.lang==="en";
 pnl.style.cssText="position:fixed;left:0;right:0;bottom:0;z-index:60;max-height:66vh;overflow:auto;background:#F8FAFC;padding:8px 14px 18px;border-radius:22px 22px 0 0;box-shadow:0 -8px 26px rgba(0,0,0,.28);max-width:600px;margin:0 auto";
 const two=G.q.ops.length>3&&!G.q.big;
 pnl.innerHTML='<div class="card" style="border:3px solid '+st.col+';margin-top:6px"><b style="font-size:.88rem">'+st.emo+(en?' Challenge door! Solve it to open it · ¡Resuélvelo para abrirla!':' ¡Puerta de reto! Resuélvela para abrirla')+'</b>'+wrlQHTML(G.q)
  +'<div style="text-align:center"><button class="speaker small" onclick="wrlSayQ(WRL.R.P.gate.q)">🔊 '+(en?"Listen":"Léemelo")+'</button></div></div>'
  +'<div style="display:grid;grid-template-columns:'+(G.q.ops.length>2&&G.q.ops.every(function(o){return String(o.t).length<14;})?"1fr 1fr":"1fr")+';gap:8px">'+G.q.ops.map(function(o,i){return '<button class="kbtn white" id="wrlO'+i+'" style="margin:0;min-height:54px;font-size:'+(G.q.big?"2.2rem":"1.12rem")+'" onclick="wrlAns('+i+')">'+esc(o.t)+'</button>';}).join("")+'</div><div id="wrlHint"></div>';}
function wrlAns(i){
 const R=WRL.R;if(!R)return;const P=R.P,G=P.gate;if(!G)return;
 const o=G.q.ops[i],b=document.getElementById("wrlO"+i),first=G.wrong===0;P.tries++;
 if(o.ok){
  recordAnswer(G.q.subj||"Mate",first,Math.round((Date.now()-G.t0)/1000));if(G.q.topicKey&&typeof recordTopic==="function")recordTopic(G.q.topicKey,first);
  if(first)P.firstOk++;P.solved++;sOK();confetti(first?10:4);if(b)b.style.background="#86EFAC";
  const r=G.r,c=G.c;P.gate=null;P.opening=true;P.cp=[r,c];
  wrlLater(function(){const pnl=document.getElementById("wrlQ");if(pnl){pnl.innerHTML="";pnl.style.cssText="";}const pad=document.getElementById("wrlPad");if(pad)pad.style.display="grid";wrlMsg(first?"🚪 ¡Puerta abierta!":"🚪 ¡Puerta abierta! Lo lograste 💪","#16A34A");
   WRL.c3.openGate(r,c,function(){P.opening=false;P.B.hop(r,c,wrlArrive);});wrlHud();},650);
 }else{
  G.wrong++;recordAnswer(G.q.subj||"Mate",false,5);if(G.q.topicKey&&typeof recordTopic==="function")recordTopic(G.q.topicKey,false);sNO();if(b){b.style.background="#FCA5A5";b.disabled=true;}
  const h=document.getElementById("wrlHint"),en=G.q.lang==="en";
  if(h)h.innerHTML='<p style="text-align:center;font-weight:700;margin-top:8px">'+(en?'Almost… 🤔 ':'Casi… 🤔 ')+(G.wrong>=2?'<span style="color:#7C3AED">'+(en?'Hint: ':'Pista: ')+esc(G.q.hint)+'</span>':(en?'Try again, no rush!':'Inténtalo otra vez, sin prisa.'))+'</p>';}}
/* pinchos: si estás parado encima cuando suben, te devuelven */
function wrlTick(dt){
 const R=WRL.R;if(!R||R.over)return;
 if(R.go){R.t+=dt;
  const P=R.P,B=P.B;
  wrlPump();
  const it=R.W.items[B.r+","+B.c];
  if(it&&it.t==="spike"&&!B.busy()&&!P.gate&&WRL.c3.spikeUp(B.r,B.c)){if(!P.spkHit){P.spkHit=1;wrlPushBack(2,"⚡ ¡Pinchos! Cruza cuando bajen");}}else P.spkHit=0;
  R.bots.forEach(function(b){wrlBotTick(b,dt);});
  R.hudT+=dt;if(R.hudT>.3){R.hudT=0;wrlHud();wrlRankDraw();}}}
/* ---------- bots ---------- */
function wrlBotTick(b,dt){
 const R=WRL.R,B=b.B,c3=WRL.c3;if(b.done||R.over||B.busy())return;
 if(b.wait>0){b.wait-=dt;if(b.wait>0)return;B.think(false);b.wait=0;}
 if(b.tn>0){b.tn-=dt;return;}
 const nxt=b.route[b.idx+1];if(!nxt)return;
 const key=nxt[0]+","+nxt[1],it=R.items0[key];
 if(it&&it.t==="gate"&&!b.passed[key]){b.passed[key]=1;b.wait=(5+Math.random()*7)/b.skill+(Math.random()<(1-b.skill)*.7+.08?3:0);B.think(true);return;}
 if(it&&it.t==="spike"&&c3.spikeUp(nxt[0],nxt[1])&&Math.random()<.85){b.tn=.18;return;}
 const jump=Math.abs(nxt[0]-B.r)+Math.abs(nxt[1]-B.c)>1;
 b.tn=(.1+Math.random()*.12)/b.skill;
 B.hop(nxt[0],nxt[1],function(){
  b.idx++;
  if(it&&it.t==="trap"){b.idx=Math.max(0,b.idx-3);B.slide(b.route[b.idx][0],b.route[b.idx][1]);b.tn=.9;B.say("😵");wrlLater(function(){B.say(null);},900);}
  else if(it&&it.t==="spike"&&c3.spikeUp(nxt[0],nxt[1])){b.idx=Math.max(0,b.idx-2);B.slide(b.route[b.idx][0],b.route[b.idx][1]);b.tn=.9;B.say("😵");wrlLater(function(){B.say(null);},900);}
  else if(Math.random()<.018*(1.3-b.skill)&&b.idx>2){b.idx-=2;B.slide(b.route[b.idx][0],b.route[b.idx][1]);b.tn=.8;B.say("🙈");wrlLater(function(){B.say(null);},900);}
  if(R.W.fin[0]===B.r&&R.W.fin[1]===B.c){b.done=true;b.t=R.t;R.fin.push(b);B.cheer();}
 },jump?.5:.3/b.skill*.9);}
/* ---------- puestos ---------- */
function wrlProg(B){const R=WRL.R,d=R.dS[B.r*R.W.N+B.c];return Math.min(1,(d<Infinity?d:0)/R.dFin);}
function wrlStandings(){
 const R=WRL.R,P=R.P;
 const list=[{n:"TÚ",col:wrlBeanColor(),me:true,done:P.done,t:P.tDone,p:P.done?1:wrlProg(P.B)}].concat(R.bots.map(function(b){return{n:b.name,col:b.col,done:b.done,t:b.t,p:b.done?1:wrlProg(b.B)};}));
 list.sort(function(a,b){if(a.done&&b.done)return a.t-b.t;if(a.done)return -1;if(b.done)return 1;return b.p-a.p;});
 return list;}
function wrlHud(){
 const R=WRL.R,h=document.getElementById("wrlHud");if(!R||!h)return;
 const m=Math.floor(R.t/60),s=Math.floor(R.t%60);
 let pl="";if(!R.practice){const st=wrlStandings();const k=st.findIndex(function(x){return x.me;});pl=["🥇","🥈","🥉","4️⃣"][k]+" "+(k+1)+".º · ";}
 h.textContent=pl+"⭐ "+R.P.stars+"/"+R.starsTotal+" · 🚪 "+R.P.solved+"/"+R.gatesTotal+" · ⏱ "+m+":"+String(s).padStart(2,"0");}
function wrlRankDraw(){
 const R=WRL.R,el=document.getElementById("wrlRank");if(!R||!el)return;if(R.practice){el.innerHTML="";return;}
 el.innerHTML='<div style="display:grid;gap:3px;margin-top:6px">'+wrlStandings().map(function(x,i){return '<div style="display:flex;align-items:center;gap:6px;font-size:.78rem;font-weight:700"><span style="width:18px">'+(i+1)+'</span><span style="width:46px;overflow:hidden;white-space:nowrap">'+esc(x.n)+'</span><div style="flex:1;height:10px;border-radius:6px;background:#E2E8F0;overflow:hidden"><div style="height:100%;width:'+Math.round(x.p*100)+'%;background:'+x.col+'"></div></div><span style="width:20px;text-align:right">'+(x.done?"🏁":"")+'</span></div>';}).join("")+'</div>';}
function wrlPlayerFinish(){
 const R=WRL.R;if(!R||R.over)return;const P=R.P;P.done=true;P.tDone=R.t;R.over=true;P.target=null;
 const c3=WRL.c3;P.B.cheer();c3.burst(P.B.r,P.B.c,"#FACC15",30);sOK();confetti(14);
 const ok=P.firstOk,total=R.gatesTotal;
 let stars,place=0,list=null;
 if(R.practice){stars=starsFor(ok,Math.max(1,total));}
 else{list=wrlStandings();place=list.findIndex(function(x){return x.me;})+1;stars=place===1?3:place===2?2:1;
  const p=prof();p.raceSkill=Math.max(.5,Math.min(1,(p.raceSkill||.78)+(place===1?.04:place>=4?-.06:place===3?-.02:0)));}
 const p=prof();if(!p.wrlBest)p.wrlBest={};p.wrlBest[R.id]=Math.max(p.wrlBest[R.id]||0,stars);
 if(place){if(!p.wrlPlace)p.wrlPlace={};p.wrlPlace[R.id]=Math.min(p.wrlPlace[R.id]||9,place);}
 save();
 wrlLater(function(){wrlResults(stars,place,list,ok,total);},1500);}
function wrlResults(stars,place,list,ok,total){
 const pnl=document.getElementById("wrlQ");if(!pnl){nodeWin(stars,"Mundos y carreras",WRL_WIN);return;}
 const pad=document.getElementById("wrlPad");if(pad)pad.style.display="none";
 const head=!place?'🧘 ¡Terminaste el recorrido!':place===1?'🏆 ¡Primer lugar! ¡Campeón!':place===2?'🥈 ¡Segundo lugar! ¡Muy bien!':'🏅 ¡Llegaste a la meta! ¡Buen intento!';
 pnl.innerHTML='<div class="card center" style="margin-top:8px;background:linear-gradient(135deg,#FEF9C3,#ECFEFF)"><div style="font-family:Fredoka;font-weight:800;font-size:1.35rem">'+head+'</div>'
  +(list?'<div style="margin:8px auto;max-width:280px;text-align:left">'+list.map(function(x,i){return '<div style="display:flex;gap:8px;align-items:center;padding:3px 0;font-weight:'+(x.me?800:600)+'"><span style="font-size:1.3rem">'+["🥇","🥈","🥉","4️⃣"][i]+'</span><span style="width:12px;height:12px;border-radius:50%;background:'+x.col+'"></span>'+esc(x.n)+'</div>';}).join("")+'</div>':'')
  +'<p style="font-size:.92rem;margin:4px 0">🚪 Retos a la primera: <b>'+ok+' de '+total+'</b> · ⭐ Estrellas: <b>'+WRL.R.P.stars+'/'+WRL.R.starsTotal+'</b></p>'
  +(place>=3?'<p style="font-size:.88rem">Cada carrera te hace más rápido y listo. ¡La revancha es tuya! 💪</p>':'')
  +'</div><button class="kbtn green" onclick="wrlToWin('+stars+')">Continuar ➜</button><button class="kbtn yellow" onclick="wrlStart(WRL.R.id,WRL.R.practice)">🔁 Revancha</button>';}
function wrlToWin(stars){nodeWin(stars,"Mundos y carreras",WRL_WIN);}

