"use strict";
/* ============ CUENTOS EN INGLÉS para el niño (toca la palabra → traducción + audio) ============ */
const CUENTOS_EN=[
 {title:"The Little Cat",scene:"🐱🏠",
  text:"This is Max. Max is a little cat. Max lives in a big house. Max likes milk and fish. In the day, Max plays with a red ball. At night, Max sleeps on the bed. Good night, Max!",
  words:{this:"este/esto",is:"es",little:"pequeño",cat:"gato",lives:"vive",big:"grande",house:"casa",likes:"le gusta",milk:"leche",fish:"pescado",day:"día",plays:"juega",red:"roja",ball:"pelota",night:"noche",sleeps:"duerme",bed:"cama",good:"buenas"},
  qs:[{q:"¿Qué es Max?",ops:["Un gato 🐱","Un perro 🐶","Un pez 🐟"],a:0},{q:"¿Dónde duerme Max?",ops:["En la cama 🛏️","En el árbol 🌳","En el carro 🚗"],a:0},{q:"¿Qué le gusta a Max?",ops:["Leche y pescado 🥛🐟","Pizza 🍕","Manzanas 🍎"],a:0}]},
 {title:"My Red Ball",scene:"⚽❤️",
  text:"I have a red ball. The ball is big. I play with my ball in the park. My dog runs with me. We jump and we laugh. I love my red ball!",
  words:{i:"yo",have:"tengo",red:"roja",ball:"pelota",the:"la/el",big:"grande",play:"juego",with:"con",my:"mi",park:"parque",dog:"perro",runs:"corre",me:"mí",we:"nosotros",jump:"saltamos",laugh:"reímos",love:"amo"},
  qs:[{q:"¿De qué color es la pelota?",ops:["Roja 🔴","Azul 🔵","Verde 🟢"],a:0},{q:"¿Quién corre con el niño?",ops:["El perro 🐶","El gato 🐱","La abuela 👵"],a:0}]},
 {title:"The Sun and the Rain",scene:"☀️🌧️",
  text:"Today the sun is yellow and hot. The birds sing in the tree. But look! A gray cloud comes. Now it rains. The flowers drink the water. They are happy. After the rain, we see a rainbow!",
  words:{today:"hoy",sun:"sol",yellow:"amarillo",hot:"caliente",birds:"pájaros",sing:"cantan",tree:"árbol",gray:"gris",cloud:"nube",comes:"viene",rains:"llueve",flowers:"flores",drink:"beben",water:"agua",happy:"felices",after:"después",see:"vemos",rainbow:"arcoíris"},
  qs:[{q:"¿Qué beben las flores?",ops:["Agua 💧","Leche 🥛","Jugo 🧃"],a:0},{q:"¿Qué se ve después de la lluvia?",ops:["Un arcoíris 🌈","Una estrella ⭐","Un avión ✈️"],a:0}]}];
function enStories(){if(!S.aiBank.kidEN)S.aiBank.kidEN=[];return CUENTOS_EN.concat(S.aiBank.kidEN);}
let EST={};
function screenStoryEN(){setTheme("kid");
 render(topbar("screenStoryPick()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🇬🇧 Cuentos en inglés</h2>'
 +'<p class="center" style="margin-bottom:12px">Toca una palabra punteada y verás qué significa</p>'
 +enStories().map((c,i)=>'<button class="kbtn blue" onclick="openStoryEN('+i+')"><span style="font-size:1.5rem">'+c.scene+'</span> '+esc(c.title)+'</button>').join("")
 +(S.geminiKey?'<button class="kbtn green" onclick="aiStoryEN()">✨ Cuento nuevo en inglés con IA</button>':''));}
function openStoryEN(i){setTheme("kid");
 const c=enStories()[i];EST={c,i};
 const html=stripHTML(c.text).split(/(\s+)/).map(tok=>{
  const clean=tok.toLowerCase().replace(/[^a-z']/g,"");
  if(c.words&&c.words[clean])return '<span class="word" style="border-bottom:3px dotted var(--kid-blue);cursor:pointer" onclick="tapWordEN(\''+clean+'\')">'+esc(tok)+'</span>';
  return esc(tok);}).join("");
 render(topbar("screenStoryEN()")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);margin-bottom:4px">'+c.scene+' '+esc(c.title)+'</h2>'
 +'<p class="center" style="font-size:.9rem;margin-bottom:8px">Toca las palabras punteadas para traducirlas 👆</p>'
 +(hasVoice()?'<button class="speaker" onclick="speakEN(\''+esc(stripHTML(c.text)).replace(/'/g,"")+'\')"><span class="ic">🔊</span> Escuchar el cuento</button>':'')
 +'<div class="card storytext" style="line-height:2">'+html+'</div>'
 +'<div id="enwordbox"></div>'
 +'<button class="kbtn green" onclick="quizStoryEN()">Responder preguntas →</button>');}
function tapWordEN(w){
 const c=EST.c;beep([880],.07);
 if(hasVoice())speakEN(w);
 const box=document.getElementById("enwordbox");
 if(box)box.innerHTML='<div class="card" style="border-color:var(--kid-blue);text-align:center"><b style="color:var(--kid-blue);font-size:1.3rem;font-family:Fredoka">'+esc(w)+'</b> = <span style="font-size:1.15rem">'+esc(c.words[w])+'</span></div>';}
function quizStoryEN(){EST.qi=0;EST.ok=0;nextQuizEN();}
function nextQuizEN(){
 const c=EST.c,q=c.qs[EST.qi];
 if(!q)return nodeWin(starsFor(EST.ok,c.qs.length),"Inglés");
 const order=shuffled(q.ops.map((o,i)=>({o,i})));EST.order=order;
 render(topbar("screenStoryEN()")
 +'<div class="progressdots">'+dots(c.qs.length,EST.qi)+'</div>'
 +'<div class="bigpic">'+c.scene+'</div>'
 +'<div class="bigq center">'+esc(q.q)+'</div>'
 +order.map((it,k)=>'<button class="kbtn white" onclick="ansQuizEN('+k+')">'+esc(it.o)+'</button>').join(""));}
function ansQuizEN(k){
 const q=EST.c.qs[EST.qi],ok=EST.order[k].i===q.a;
 recordAnswer("Inglés",ok,20);
 if(ok){sOK();confetti(8);toast("¡Muy bien! 🎉",true,1000);EST.ok++;}
 else{sNO();toast("Era: "+q.ops[q.a],false,1700);}
 EST.qi++;setTimeout(nextQuizEN,ok?1000:1750);}
async function aiStoryEN(){setTheme("kid");
 render(topbar("screenStoryEN()")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Creando un cuento en inglés…</h2></div>');
 try{
  const obj=await geminiJSON('Crea un cuento MUY corto en inglés nivel principiante absoluto (A0-A1) para un niño de 7 años que apenas empieza inglés: frases de 4-7 palabras, presente simple, vocabulario básico. Responde SOLO JSON: {"title":"título en inglés","scene":"2 emojis","text":"60-90 palabras en inglés","words":{"palabra_en_minúscula":"traducción al español (incluye TODAS las palabras no obvias del texto, mínimo 12)"},"qs":[{"q":"pregunta EN ESPAÑOL sobre el cuento","ops":["correcta","mala","mala"],"a":0},{"q":"otra","ops":["correcta","mala","mala"],"a":0}]}');
  obj.title=stripHTML(obj.title||"Story");obj.scene=stripHTML(obj.scene||"📖");obj.text=stripHTML(obj.text||"");
  const w={};Object.keys(obj.words||{}).forEach(k=>{w[stripHTML(k).toLowerCase()]=stripHTML(obj.words[k]);});obj.words=w;
  obj.qs=(obj.qs||[]).map(q=>({q:stripHTML(q.q),ops:(q.ops||[]).map(o=>stripHTML(o)),a:q.a||0}));
  if(!S.aiBank.kidEN)S.aiBank.kidEN=[];
  S.aiBank.kidEN.push(obj);save();
  openStoryEN(enStories().length-1);
 }catch(e){toast(e.message||"No se pudo crear, intenta de nuevo",false,2200);screenStoryEN();}}
