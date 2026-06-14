"use strict";
/* ============ INGLÉS POR NIVELES A1→B2 (con IA + exámenes para subir) ============ */
const CEFR=[
 {id:"A1",nm:"A1 · Principiante",ic:"🌱",desc:"To be, saludos, vocabulario básico",
  prompt:"nivel A1 (principiante absoluto): verb to be, this/that, saludos, números, colores, familia, presente simple muy básico"},
 {id:"A2",nm:"A2 · Básico",ic:"🌿",desc:"Pasado simple, rutinas, comparativos",
  prompt:"nivel A2: present simple/continuous, past simple regular e irregular común, comparativos, going to, there is/are, preposiciones"},
 {id:"B1",nm:"B1 · Intermedio",ic:"🌳",desc:"Present perfect, condicional 1, conectores",
  prompt:"nivel B1: present perfect, first conditional, will/going to, conectores (however, although), phrasal verbs comunes, opiniones"},
 {id:"B2",nm:"B2 · Avanzado",ic:"🏆",desc:"Pasiva, condicionales 2/3, reported speech",
  prompt:"nivel B2: passive voice, second and third conditional, reported speech, relative clauses, vocabulario avanzado y matices"}];
/* Banco fijo de respaldo por nivel (funciona sin internet). a = índice correcto. */
const CEFR_BANK={
 A1:[{q:"She ___ my sister.",ops:["is","are","am"],a:0},{q:"___ you happy?",ops:["Are","Is","Am"],a:0},
  {q:"\"Hello\" significa…",ops:["Hola","Adiós","Gracias"],a:0},{q:"I ___ a student.",ops:["am","is","are"],a:0},
  {q:"What color is the sun?",ops:["Yellow","Blue","Green"],a:0},{q:"They ___ my friends.",ops:["are","is","am"],a:0},
  {q:"\"Mother\" significa…",ops:["Madre","Padre","Hermano"],a:0},{q:"This ___ a dog.",ops:["is","are","am"],a:0},
  {q:"How many: 7 =",ops:["seven","six","nine"],a:0},{q:"He ___ ten years old.",ops:["is","are","am"],a:0}],
 A2:[{q:"Past of GO:",ops:["went","goed","gone"],a:0},{q:"She ___ to school every day.",ops:["goes","go","going"],a:0},
  {q:"I ___ TV last night.",ops:["watched","watch","watching"],a:0},{q:"Comparative of BIG:",ops:["bigger","biggest","more big"],a:0},
  {q:"There ___ three books.",ops:["are","is","be"],a:0},{q:"I'm ___ to study tonight.",ops:["going","go","goes"],a:0},
  {q:"Past of BUY:",ops:["bought","buyed","buy"],a:0},{q:"The cat is ___ the table.",ops:["on","in","at"],a:0},
  {q:"\"Borrow\" significa…",ops:["Pedir prestado","Prestar","Comprar"],a:0},{q:"He ___ like coffee.",ops:["doesn't","don't","isn't"],a:0}],
 B1:[{q:"I ___ lived here since 2020.",ops:["have","has","am"],a:0},{q:"If it rains, we ___ stay home.",ops:["will","would","did"],a:0},
  {q:"\"However\" significa…",ops:["Sin embargo","Además","Por eso"],a:0},{q:"She has ___ finished.",ops:["already","yet","ago"],a:0},
  {q:"\"Give up\" significa…",ops:["Rendirse","Empezar","Continuar"],a:0},{q:"I've known him ___ years.",ops:["for","since","from"],a:0},
  {q:"They ___ to Paris twice.",ops:["have been","went","go"],a:0},{q:"\"Although\" introduce…",ops:["Un contraste","Una causa","Un tiempo"],a:0},
  {q:"Choose: He ___ work yesterday.",ops:["didn't","doesn't","isn't"],a:0},{q:"\"Look forward to\" + …",ops:["verb-ing","infinitive","past"],a:0}],
 B2:[{q:"The house ___ built in 1990.",ops:["was","is","has"],a:0},{q:"If I ___ rich, I would travel.",ops:["were","am","will be"],a:0},
  {q:"He said he ___ tired. (reported)",ops:["was","is","will"],a:0},{q:"The book ___ by millions.",ops:["was read","read","reads"],a:0},
  {q:"If I had studied, I ___ passed.",ops:["would have","would","will have"],a:0},{q:"The man ___ car was stolen…",ops:["whose","who","which"],a:0},
  {q:"\"Run out of\" significa…",ops:["Quedarse sin","Correr afuera","Apurarse"],a:0},{q:"She asked me where I ___.",ops:["lived","live","living"],a:0},
  {q:"It ___ have been him; he was away.",ops:["can't","must","should"],a:0},{q:"The bridge is ___ repaired now.",ops:["being","been","be"],a:0}]};
function cefrState(){const p=prof();if(!p.cefr)p.cefr={lvl:0,passed:[false,false,false,false],best:{}};return p.cefr;}
function isTeen(){return profType()==="teen";}
function elBtn(){return isTeen()?"tbtn":"kbtn";}
function elTheme(){setTheme(isTeen()?"teen":"kid");}
function screenLevelsEN(){elTheme();const c=cefrState();const cls=elBtn();
 const back=isTeen()?"screenAcademyTeen()":"screenEnglishHub()";
 const path=CEFR.map((lv,i)=>{
  const unlocked=i<=c.lvl;const passed=c.passed[i];
  return '<button class="'+cls+(isTeen()?'':' '+(passed?'green':unlocked?'yellow':'white'))+'" style="'+(unlocked?'':'opacity:.5;')+'text-align:left;display:flex;align-items:center;gap:14px" onclick="'+(unlocked?"screenLevelDetail("+i+")":"toast('Aprueba el examen del nivel anterior 🔒',false,1600)")+'">'
   +'<span style="font-size:clamp(2rem,9vw,2.6rem)">'+(unlocked?lv.ic:"🔒")+'</span>'
   +'<span style="flex:1"><span style="font-size:clamp(1.05rem,5vw,1.3rem)">'+lv.nm+(passed?' ✓':'')+'</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">'+lv.desc+'</span></span></button>';
 }).join("");
 render(topbar(back)
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">📈 Inglés por niveles</h2>'
  +'<p class="'+(isTeen()?'mut':'')+' center" style="margin-bottom:14px">Practica y aprueba el examen (80%) para subir de A1 a B2</p>'
  +path
  +(S.geminiKey?'':'<p class="'+(isTeen()?'mut':'audiotip')+'" style="margin-top:12px">💡 Con la clave de Gemini activa, la IA crea lecciones y exámenes nuevos sin fin. Sin ella, usa un banco fijo.</p>'));}
function screenLevelDetail(i){elTheme();const lv=CEFR[i],c=cefrState(),cls=elBtn();
 render(topbar("screenLevelsEN()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">'+lv.ic+' '+lv.nm+'</h2>'
  +'<p class="'+(isTeen()?'mut':'')+' center" style="margin-bottom:14px">'+lv.desc+'</p>'
  +'<button class="'+cls+(isTeen()?'':' blue')+'" onclick="startLevelPractice('+i+')">📚 Practicar</button>'
  +'<button class="'+cls+(isTeen()?' acc':' green')+'" onclick="startLevelExam('+i+')">📝 Examen del nivel'+(c.passed[i]?' (aprobado ✓)':'')+'</button>'
  +(c.best['ex'+i]?'<p class="'+(isTeen()?'mut':'')+' center" style="margin-top:10px">Mejor examen: '+c.best['ex'+i]+'%</p>':''));}
let EL2={};
async function elGen(i,n,exam){
 const lv=CEFR[i];
 if(S.geminiKey){
  try{
   const aud=isTeen()?"una adolescente de 14 años":"un niño de 7-8 años";
   const obj=await geminiJSON('Crea '+n+' preguntas de opción múltiple de INGLÉS '+lv.prompt+', para '+aud+'. '+(exam?'Es un EXAMEN para evaluar el nivel.':'Es práctica.')+' Mezcla gramática y vocabulario. El enunciado puede estar en inglés; las preguntas de significado en español. Responde SOLO JSON válido sin markdown: {"items":[{"q":"...","ops":["correcta","mala","mala"],"a":0}]} con '+n+' items.');
   if(obj.items&&obj.items.length)return obj.items.map(it=>{
    const q=stripHTML(it.q),ops=(it.ops||[]).map(o=>stripHTML(o));const correct=ops[it.a];const sh=shuffled(ops);
    return{q,ops:sh,a:sh.indexOf(correct)};});
  }catch(e){}
 }
 // fallback
 const bank=shuffled(CEFR_BANK[lv.id]);const out=[];
 for(let k=0;k<n;k++){const it=bank[k%bank.length];const sh=shuffled(it.ops.slice());out.push({q:it.q,ops:sh,a:sh.indexOf(it.ops[it.a])});}
 return out;}
async function startLevelPractice(i){elTheme();
 render(topbar("screenLevelsEN()")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando práctica…</h2></div>');
 const items=await elGen(i,8,false);
 EL2={i,items,k:0,ok:0,exam:false};elNext();}
async function startLevelExam(i){elTheme();
 render(topbar("screenLevelsEN()")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando el examen…</h2></div>');
 const items=await elGen(i,10,true);
 EL2={i,items,k:0,ok:0,exam:true};elNext();}
function elNext(){
 EL2.lock=false;
 const it=EL2.items[EL2.k];
 if(!it)return elFinish();
 const order=shuffled(it.ops.map((o,idx)=>({o,idx})));EL2.order=order;
 const cls=elBtn();
 render(topbar("screenLevelsEN()")
  +'<div class="progressdots">'+dots(EL2.items.length,EL2.k)+'</div>'
  +'<p class="center" style="font-family:Fredoka;font-weight:600;margin-bottom:8px">'+(EL2.exam?"📝 Examen":"📚 Práctica")+' '+CEFR[EL2.i].id+' · '+(EL2.k+1)+'/'+EL2.items.length+'</p>'
  +'<div class="bigq center">'+esc(it.q)+'</div>'
  +order.map((s,vi)=>'<button class="'+cls+(isTeen()?' opt':' white')+'" onclick="elAns('+vi+')">'+esc(s.o)+'</button>').join(""));}
function elAns(vi){
 if(EL2.lock)return;EL2.lock=true;
 const it=EL2.items[EL2.k],ok=EL2.order[vi].idx===it.a;
 recordAnswer("Inglés",ok,15);
 if(ok){EL2.ok++;sOK();if(!EL2.exam)confetti(6);toast("✓",true,700);}
 else{sNO();toast("Era: "+esc(it.ops[it.a]),false,1600);}
 EL2.k++;setTimeout(elNext,ok?750:1650);}
function elFinish(){
 const pct=Math.round(EL2.ok/EL2.items.length*100);
 const c=cefrState();const cls=elBtn();
 const p=prof();p.coins+=EL2.exam?20:8;p.xp+=EL2.exam?25:10;
 let msg;
 if(EL2.exam){
  c.best['ex'+EL2.i]=Math.max(c.best['ex'+EL2.i]||0,pct);
  if(pct>=80){
   c.passed[EL2.i]=true;
   if(EL2.i+1<CEFR.length&&c.lvl<EL2.i+1)c.lvl=EL2.i+1;
   sWIN();confetti(34);
   const nextTxt=EL2.i+1<CEFR.length?'¡Desbloqueaste '+CEFR[EL2.i+1].id+'! 🔓':'¡Llegaste a B2, el nivel máximo! 🏆';
   msg='<div class="big" style="font-size:3rem">🎉</div><h2>¡Aprobaste '+CEFR[EL2.i].id+'! ('+pct+'%)</h2><p style="margin-bottom:12px">'+nextTxt+'</p>';
  }else{sNO();msg='<div class="big" style="font-size:3rem">💪</div><h2>'+pct+'% — casi</h2><p style="margin-bottom:12px">Necesitas 80% para aprobar. ¡Practica y vuelve a intentar!</p>';}
 }else{if(pct>=70)sWIN();msg='<div class="big" style="font-size:3rem">'+(pct>=70?"🌟":"📚")+'</div><h2>Práctica: '+pct+'%</h2><p style="margin-bottom:12px">'+EL2.ok+'/'+EL2.items.length+' correctas</p>';}
 save();
 const card=isTeen()?'<div class="card endcard">':'<div class="card endcard">';
 render(topbar("screenLevelsEN()")
  +card+msg
  +'<button class="'+cls+(isTeen()?' acc':' green')+'" onclick="screenLevelDetail('+EL2.i+')">'+(EL2.exam&&EL2.ok/EL2.items.length>=0.8?'Seguir':'Intentar de nuevo')+'</button>'
  +'<button class="'+cls+(isTeen()?'':' white')+'" style="text-align:center" onclick="screenLevelsEN()">Ver niveles</button></div>');}
