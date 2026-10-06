"use strict";
/* ============ ENGLISH PLAYGROUND (lo de español, también en inglés) ============
   Pedido: "esto también para inglés que no hay que dejarlo de lado" (con una imagen de un pack de
   inglés de tarjetas con solapas: mochila, partes de la casa, familia). Aquí van los equivalentes
   de lo que ya existe en español, a nivel A1 para pasar a 2.º de primaria:
   - LIBROS DE SOLAPAS 3D (js/flaps3d.js): In my backpack I have…, Parts of the house, My family,
     Clothes, Food, Animals. Se explora (tocar la solapa = ver y oír la palabra) y luego se juega a
     "find it" (¿dónde está el lápiz?).
   - Noun / adjective / verb en canastas 3D (reusa grammar3d.js).
   - a o an · uno o varios (plurales) · he/she/it/they (género y número) · am/is/are ·
     sílabas en inglés · rimas.
   Solo se toma el FORMATO de las tarjetas; palabras, dibujos (emojis) y textos son propios.
   Prefijo eg / EGR. */

const EGR_BOOKS=[
 {id:"bag",ic:"🎒",nm:"In my backpack",head:"In my backpack I have…",col:"#F9A8D4",dark:"#BE185D",bg:"#FFF1F2",
  items:[["pencil","✏️","lápiz"],["notebook","📓","cuaderno"],["ruler","📏","regla"],["scissors","✂️","tijeras"],["crayons","🖍️","crayones"],["books","📚","libros"]]},
 {id:"house",ic:"🏠",nm:"Parts of the house",head:"Parts of the house",col:"#FDBA74",dark:"#C2410C",bg:"#FFF7ED",
  items:[["bedroom","🛏️","dormitorio"],["bathroom","🛁","baño"],["kitchen","🍳","cocina"],["living room","🛋️","sala"],["garden","🌳","jardín"],["garage","🚗","garaje"]]},
 {id:"family",ic:"👪",nm:"My family",head:"This is my family",col:"#86EFAC",dark:"#15803D",bg:"#F0FDF4",
  items:[["mom","👩","mamá"],["dad","👨","papá"],["sister","👧","hermana"],["brother","👦","hermano"],["grandma","👵","abuela"],["grandpa","👴","abuelo"],["baby","👶","bebé"],["me","🧒","yo"]]},
 {id:"clothes",ic:"👕",nm:"Clothes",head:"I am wearing…",col:"#93C5FD",dark:"#1D4ED8",bg:"#EFF6FF",
  items:[["shirt","👕","camiseta"],["pants","👖","pantalón"],["dress","👗","vestido"],["shoes","👟","zapatos"],["hat","🧢","gorra"],["socks","🧦","medias"],["jacket","🧥","chaqueta"],["gloves","🧤","guantes"]]},
 {id:"food",ic:"🍎",nm:"Food",head:"I like…",col:"#FCA5A5",dark:"#B91C1C",bg:"#FEF2F2",
  items:[["apple","🍎","manzana"],["banana","🍌","plátano"],["bread","🍞","pan"],["milk","🥛","leche"],["cheese","🧀","queso"],["egg","🥚","huevo"]]},
 {id:"animals",ic:"🐶",nm:"Animals",head:"I see a…",col:"#C4B5FD",dark:"#6D28D9",bg:"#F5F3FF",
  items:[["dog","🐶","perro"],["cat","🐱","gato"],["bird","🐦","pájaro"],["fish","🐟","pez"],["horse","🐴","caballo"],["cow","🐮","vaca"]]}];

const EGR_N=["dog","cat","teacher","school","ball","tree","book","house","girl","boy","mom","river","car","apple","table","bird","pencil","city","friend","window"];
const EGR_A=["big","small","red","happy","tall","fast","slow","blue","funny","hot","soft","new","old","kind","young","yellow","long","clean"];
const EGR_V=["run","jump","eat","sleep","read","write","sing","swim","walk","laugh","listen","open","close","climb","wash","look"];
const EGR_BINS=[
 {k:"n",nm:"NOUN",sub:"person, animal, thing",col:"#3B82F6",dark:"#1D4ED8"},
 {k:"a",nm:"ADJECTIVE",sub:"tells how it is",col:"#22C55E",dark:"#15803D"},
 {k:"v",nm:"VERB",sub:"action word",col:"#EF4444",dark:"#B91C1C"}];
/* [palabra, emoji, a|an] */
const EGR_AAN=[["pencil","✏️","a"],["apple","🍎","an"],["egg","🥚","an"],["book","📖","a"],["orange","🍊","an"],["dog","🐶","a"],["elephant","🐘","an"],["banana","🍌","a"],
 ["umbrella","☂️","an"],["cat","🐱","a"],["ice cream","🍦","an"],["house","🏠","a"],["owl","🦉","an"],["car","🚗","a"],["ball","⚽","a"],["onion","🧅","an"],["ant","🐜","an"],["igloo","🛖","an"]];
/* [singular, plural, emoji, regla] */
const EGR_PLURAL=[["pencil","pencils","✏️","Most words just add -s."],["cat","cats","🐱","Most words just add -s."],["box","boxes","📦","After x, s, sh, ch we add -es."],["bus","buses","🚌","After x, s, sh, ch we add -es."],
 ["dish","dishes","🍽️","After x, s, sh, ch we add -es."],["watch","watches","⌚","After x, s, sh, ch we add -es."],["baby","babies","👶","Consonant + y: change y to -ies."],["strawberry","strawberries","🍓","Consonant + y: change y to -ies."],
 ["leaf","leaves","🍃","f changes to -ves."],["tomato","tomatoes","🍅","Some words ending in o add -es."],["child","children","🧒","Irregular: this one changes completely!"],["foot","feet","🦶","Irregular: this one changes completely!"],
 ["mouse","mice","🐭","Irregular: this one changes completely!"],["tooth","teeth","🦷","Irregular: this one changes completely!"],["man","men","👨","Irregular: this one changes completely!"],["woman","women","👩","Irregular: this one changes completely!"]];
/* [quién, emoji, pronombre] */
const EGR_PRON=[["Mom","👩","she"],["Dad","👨","he"],["The dog","🐶","it"],["My friends","👫","they"],["The book","📖","it"],["Tom and Ana","🧒🧒","they"],["The girl","👧","she"],["The boy","👦","he"],
 ["My sister","👧","she"],["The cats","🐱🐱","they"],["My brother","👦","he"],["The sun","☀️","it"],["Grandma","👵","she"],["Grandpa","👴","he"]];
const EGR_BE=[["The cat ___ big.","is"],["The cats ___ big.","are"],["My mom ___ nice.","is"],["The children ___ happy.","are"],["I ___ a student.","am"],["You ___ my friend.","are"],
 ["He ___ tall.","is"],["They ___ in the park.","are"],["The book ___ on the table.","is"],["We ___ friends.","are"],["She ___ my sister.","is"],["The apples ___ red.","are"],["I ___ eight years old.","am"],["It ___ a dog.","is"]];
/* [palabra, emoji, sílabas] */
const EGR_SYL=[["cat","🐱",1],["dog","🐶",1],["apple","🍎",2],["pencil","✏️",2],["spider","🕷️",2],["rainbow","🌈",2],["pizza","🍕",2],["monkey","🐒",2],["rocket","🚀",2],["yellow","💛",2],
 ["banana","🍌",3],["elephant","🐘",3],["butterfly","🦋",3],["computer","💻",3],["umbrella","☂️",3],["dinosaur","🦖",3],["tomato","🍅",3],["kangaroo","🦘",3],["octopus","🐙",3],["strawberry","🍓",3],
 ["watermelon","🍉",4],["helicopter","🚁",4],["alligator","🐊",4],["hippopotamus","🦛",5]];
/* [palabra, emoji, rima, señuelo1, señuelo2] */
const EGR_RHYME=[["cat","🐱","hat","dog","sun"],["dog","🐶","log","cat","bed"],["sun","☀️","bun","moon","star"],["bee","🐝","tree","bird","fish"],["star","⭐","car","moon","bus"],
 ["moon","🌙","spoon","sun","cake"],["fish","🐟","dish","cat","book"],["bed","🛏️","red","bus","dog"],["ball","⚽","wall","bat","tree"],["cake","🎂","snake","pie","car"],
 ["mouse","🐭","house","cheese","cat"],["ring","💍","king","bell","hat"],["bear","🐻","chair","cat","bee"],["boat","⛵","coat","car","sun"],["clock","🕐","sock","watch","bed"]];

/* [a, b, s|o]  s = same (synonyms) · o = opposite (antonyms) */
const EGR_SO=[["big","large","s"],["big","small","o"],["happy","glad","s"],["happy","sad","o"],["fast","quick","s"],["fast","slow","o"],["hot","cold","o"],["start","begin","s"],
 ["tall","short","o"],["up","down","o"],["little","small","s"],["smart","clever","s"],["clean","dirty","o"],["old","new","o"],["pretty","beautiful","s"],["open","close","o"],
 ["day","night","o"],["stop","go","o"],["easy","hard","o"],["yes","no","o"],["loud","noisy","s"],["sleepy","tired","s"]];
const EGR_SO_BINS=[{k:"s",nm:"SAME",sub:"mean the same",col:"#0EA5E9",dark:"#0369A1"},{k:"o",nm:"OPPOSITE",sub:"mean the contrary",col:"#F97316",dark:"#C2410C"}];
/* [word, emoji, "syl-LA-bles", index of the strong syllable] */
const EGR_STRESS=[["banana","🍌","ba-na-na",1],["apple","🍎","ap-ple",0],["elephant","🐘","el-e-phant",0],["computer","💻","com-pu-ter",1],["umbrella","☂️","um-brel-la",1],["pencil","✏️","pen-cil",0],
 ["potato","🥔","po-ta-to",1],["tomato","🍅","to-ma-to",1],["dinosaur","🦖","di-no-saur",0],["butterfly","🦋","but-ter-fly",0],["window","🪟","win-dow",0],["yellow","💛","yel-low",0],
 ["guitar","🎸","gui-tar",1],["hotel","🏨","ho-tel",1],["police","👮","po-lice",1],["music","🎵","mu-sic",0],["water","💧","wa-ter",0],["orange","🍊","or-ange",0],
 ["giraffe","🦒","gi-raffe",1],["balloon","🎈","bal-loon",1],["monkey","🐒","mon-key",0],["spider","🕷️","spi-der",0],["kangaroo","🦘","kan-ga-roo",2],["octopus","🐙","oc-to-pus",0],["hello","👋","hel-lo",1]];
const EGR_ACTS=[
 {id:"baskets",ic:"🧺",nm:"Noun · Adjective · Verb 3D",sub:"Throw each word into its basket",cls:"blue"},
 {id:"aan",ic:"🅰️",nm:"A or AN?",sub:"a pencil · an apple",cls:"green"},
 {id:"plural",ic:"✖️",nm:"One or many?",sub:"cat → cats · child → children",cls:"purple"},
 {id:"pron",ic:"👫",nm:"He, she, it, they",sub:"Boy or girl? One or many?",cls:"red"},
 {id:"be",ic:"🧩",nm:"Am, is, are",sub:"Complete the sentence",cls:"yellow"},
 {id:"syl",ic:"👏",nm:"Clap the syllables",sub:"How many beats in the word?",cls:"blue"},
 {id:"rhyme",ic:"🎵",nm:"Rhyme time",sub:"Which word sounds the same at the end?",cls:"green"},
 {id:"sameopp",ic:"🔁",nm:"Same or opposite 3D",sub:"big · large  ↔  big · small",cls:"purple"},
 {id:"stress",ic:"🥁",nm:"The strong syllable",sub:"ba-NA-na: which beat is louder?",cls:"red"}];
const EGR_WIN={noWorld:true,replay:"screenEnglishPlay()",replayLabel:"More English 🎒",backFn:"screenEnglishHub()",backLabel:"Volver a Inglés 🇬🇧"};
let EGR={};

function egCleanup(){if(EGR.timer)clearTimeout(EGR.timer);EGR.timer=null;try{window.speechSynthesis.cancel();}catch(e){}EGR={};}
function egLater(fn,ms){if(EGR.timer)clearTimeout(EGR.timer);const k=EGR.kind;EGR.timer=setTimeout(function(){if(EGR.kind===k)fn();},ms);}
function egFb(h,ok){const f=document.getElementById("egFb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:'+(ok?'#16A34A':'#475569')+'">'+h+'</p>';}
function egHeader(label){const a=EGR_ACTS.find(function(x){return x.id===EGR.kind;});return '<div class="progressdots">'+dots(EGR.total,EGR.i)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">'+(a?a.ic+' '+a.nm:label||"")+'</p>';}
function egAnswered(first,delay){
 if(first)EGR.ok++;recordAnswer("Inglés",first,12);sOK();confetti(first?9:4);
 EGR.done=true;EGR.i++;egLater(egNext,delay||1700);}
function egFinish(){const stars=starsFor(EGR.ok,Math.max(1,EGR.total));recordAnswer("Inglés",stars>=2,40);save();nodeWin(stars,"Inglés",EGR_WIN);}

/* ---------- menú ---------- */
function screenEnglishPlay(){setTheme("kid");
 egCleanup();
 const books=EGR_BOOKS.map(function(b){return '<button onclick="egBook(\''+b.id+'\')" style="border:3px solid '+b.dark+';border-radius:18px;background:'+b.col+';padding:10px 4px;cursor:pointer;color:#fff"><div style="font-size:2.4rem;line-height:1.1">'+b.ic+'</div><div style="font-family:Fredoka;font-weight:700;font-size:.82rem;margin-top:2px;text-shadow:0 1px 2px rgba(0,0,0,.35)">'+b.nm+'</div></button>';}).join("");
 const cards=EGR_ACTS.map(function(a){return '<button class="kbtn '+a.cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="egStart(\''+a.id+'\')"><span style="font-size:clamp(2rem,9vw,2.6rem)">'+a.ic+'</span><span style="flex:1"><span>'+a.nm+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+a.sub+'</span></span></button>';}).join("");
 render(topbar("screenEnglishHub()")+subHeader("🎒 English Playground")
  +'<p class="center" style="margin:-4px 0 10px">Lift the flaps, listen and play! 🇬🇧</p>'
  +'<p class="appsec">📖 Flap books (3D)</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">'+books+'</div>'
  +'<p class="appsec">🎮 Grammar games</p>'+cards);}

/* ---------- 📖 libros de solapas ---------- */
function egBook(id){setTheme("kid");
 const b=EGR_BOOKS.find(function(x){return x.id===id;});if(!b)return;
 egCleanup();EGR={kind:"book",book:b,phase:"explore",seen:{},i:0,ok:0,total:b.items.length,tried:false};
 render(topbar("screenEnglishPlay()")
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin:0 0 4px">'+b.ic+' '+b.nm+'</h2>'
  +'<div class="card" id="egInfo" style="padding:8px 12px;text-align:center"></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="egCanvas" style="width:100%;height:clamp(300px,52vh,420px)"></div></div>'
  +'<div id="egFb"></div><div id="egBtns"></div>');
 EGR.c3=renderFlapBook("egCanvas",{head:b.head,col:b.col,dark:b.dark,bg:b.bg,items:b.items.map(function(x){return{w:x[0],e:x[1]};})},egBookTap);
 egBookInfo();}
function egBookInfo(){
 const b=EGR.book,info=document.getElementById("egInfo"),btns=document.getElementById("egBtns");if(!info)return;
 if(EGR.phase==="explore"){
  const n=Object.keys(EGR.seen).length;
  info.innerHTML='<b>👆 Tap a flap to see what is inside</b><br><span class="mut" style="font-size:.85rem">Opened: '+n+' / '+b.items.length+'</span>';
  btns.innerHTML='<button class="kbtn green" onclick="egBookPlay()">🎮 Play: find the word!</button><button class="kbtn white" onclick="screenEnglishPlay()">← Back</button>';
 }else{
  const it=b.items[EGR.order[EGR.i]];
  info.innerHTML='<div class="progressdots" style="margin:0 0 6px">'+dots(EGR.total,EGR.i)+'</div><b style="font-size:1.15rem">🔎 Find the <span style="color:#BE185D">'+esc(it[0])+'</span></b> <button class="speaker small" style="display:inline-block;width:auto;margin:0 0 0 8px;padding:4px 10px" onclick="speakEN(\'Find the '+it[0]+'\')">🔊</button>';
  btns.innerHTML="";}}
function egBookTap(ev,info){
 const b=EGR.book;if(!b)return;
 const it=b.items[info.i];
 if(EGR.phase==="explore"){
  if(info.open){EGR.seen[info.i]=1;speakEN((/^[aeiou]/.test(it[0])?"an ":"a ")+it[0]);egFb('<span style="font-size:1.4rem">'+it[1]+'</span> <b>'+esc(it[0])+'</b> = '+esc(it[2]),true);egBookInfo();}
  return;}
 if(EGR.done||!info.open)return;
 const target=b.items[EGR.order[EGR.i]];
 speakEN(it[0]);
 if(info.i===EGR.order[EGR.i]){
  EGR.done=true;if(!EGR.tried)EGR.ok++;recordAnswer("Inglés",!EGR.tried,8);sOK();confetti(6);egFb("✅ "+it[1]+" "+it[0],true);
  EGR.i++;
  egLater(function(){EGR.done=false;EGR.tried=false;if(EGR.i>=EGR.total)return egFinish();EGR.c3.closeAll();egBookInfo();egFb("",true);setTimeout(function(){if(EGR.book===b&&EGR.order)speakEN("Find the "+b.items[EGR.order[EGR.i]][0]);},300);},1500);
 }else{
  EGR.tried=true;sNO();EGR.c3.shake(info.i);egFb("Not that one 🤔 That is the "+it[0]+". Try again!",false);
  const wi=info.i;setTimeout(function(){if(EGR.c3&&EGR.book===b)EGR.c3.close(wi);},1100);}}
function egBookPlay(){
 const b=EGR.book;EGR.phase="find";EGR.order=shuffled(b.items.map(function(_,i){return i;}));EGR.i=0;EGR.ok=0;EGR.tried=false;EGR.done=false;
 EGR.c3.closeAll();egFb("",true);egBookInfo();setTimeout(function(){speakEN("Find the "+b.items[EGR.order[0]][0]);},400);}

/* ---------- motor de actividades ---------- */
function egStart(kind){
 egCleanup();EGR={kind:kind,i:0,ok:0,total:6,tried:false,done:false};
 const take=function(arr,n){return shuffled(arr).slice(0,n);};
 const bank={
  baskets:function(){return[0,1];},
  aan:function(){return take(EGR_AAN,6);},
  plural:function(){return take(EGR_PLURAL,6);},
  pron:function(){return take(EGR_PRON,6);},
  be:function(){return take(EGR_BE,6);},
  syl:function(){return take(EGR_SYL,6);},
  rhyme:function(){return take(EGR_RHYME,6);},
  sameopp:function(){return[0,1];},
  stress:function(){return take(EGR_STRESS,6);}};
 EGR.items=bank[kind]();
 if(kind==="baskets"||kind==="sameopp"){EGR.total=12;EGR.round=0;}else EGR.total=EGR.items.length;
 egNext();}
function egNext(){
 if(EGR.i>=EGR.total&&EGR.kind!=="baskets"&&EGR.kind!=="sameopp")return egFinish();
 EGR.tried=false;EGR.done=false;
 const k=EGR.kind,it=EGR.items[EGR.i];
 if(k==="baskets")return egBaskets();
 if(k==="aan")return egAan(it);
 if(k==="plural")return egPlural(it);
 if(k==="pron")return egPron(it);
 if(k==="be")return egBe(it);
 if(k==="syl")return egSyl(it);
 if(k==="rhyme")return egRhyme(it);
 if(k==="sameopp")return egSameOpp();
 if(k==="stress")return egStress(it);}
function egOpts(list,fn,cols){
 return '<div style="display:grid;grid-template-columns:repeat('+(cols||list.length)+',1fr);gap:10px;margin-top:8px">'+list.map(function(o,i){return '<button class="kbtn white" id="egO'+i+'" style="margin:0;min-height:60px;font-size:1.35rem" onclick="'+fn+'('+i+')">'+o+'</button>';}).join("")+'</div><div id="egFb"></div>';}
function egCard(e,txt,big){return '<div class="card center" style="padding:10px"><div style="font-size:'+(big||4)+'rem;line-height:1.1">'+e+'</div>'+(txt?'<div style="font-family:Fredoka;font-weight:700;font-size:1.5rem;margin-top:4px">'+txt+'</div>':'')+'</div>';}
function egMark(i,ok){const b=document.getElementById("egO"+i);if(!b)return;if(ok){b.style.background="#86EFAC";}else{b.style.background="#FCA5A5";b.disabled=true;}}

/* ---------- 🧺 noun / adjective / verb ---------- */
function egBaskets(){
 const words=shuffled(shuffled(EGR_N).slice(0,2).map(function(w){return{w:w,k:"n"};}).concat(shuffled(EGR_A).slice(0,2).map(function(w){return{w:w,k:"a"};}),shuffled(EGR_V).slice(0,2).map(function(w){return{w:w,k:"v"};})));
 EGR.tries={};
 render(topbar("screenEnglishPlay()")+'<div class="progressdots">'+dots(2,EGR.round)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">🧺 Noun · Adjective · Verb 3D</p>'
  +'<div class="card" style="padding:8px 12px"><b>Tap a word, then tap its basket</b><br><span class="mut" style="font-size:.82rem">🔵 noun = person, animal, thing · 🟢 adjective = how it is · 🔴 verb = what you do</span></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="egCanvas" style="width:100%;height:clamp(300px,50vh,400px)"></div></div><div id="egFb"></div>');
 const nm={n:"a noun",a:"an adjective",v:"a verb"};
 EGR.c3=renderWordSorter("egCanvas",words,function(ev,info){
  if(ev==="select"){speakEN(info.w);}
  else if(ev==="ok"){const first=!EGR.tries[info.w];if(first)EGR.ok++;recordAnswer("Inglés",first,8);EGR.i++;sOK();confetti(4);egFb("✅ "+info.w+" is "+nm[info.k],true);}
  else if(ev==="wrong"){EGR.tries[info.w]=1;sNO();egFb("🤔 «"+info.w+"» is "+nm[info.right]+". Try another basket!",false);}
  else if(ev==="done"){EGR.round++;if(EGR.round>=2){egFb("🎉 Great job!",true);egLater(egFinish,1200);}else{egFb("🎉 Well done! Next round…",true);egLater(egBaskets,1300);}}},EGR_BINS);}

/* ---------- 🅰️ a / an ---------- */
function egAan(it){
 EGR.cur=it;
 render(topbar("screenEnglishPlay()")+egHeader()+egCard(it[1],'<span style="display:inline-block;min-width:2.4ch;border-bottom:4px solid #22C55E">&nbsp;</span> '+it[0],4)
  +'<button class="speaker small" onclick="speakEN(EGR.cur[0])">🔊 Listen</button>'
  +'<p class="center mut" style="font-size:.85rem;margin:2px 0">Use <b>an</b> before the sounds a, e, i, o, u.</p>'+egOpts(["a","an"],"egAanAns",2));
 speakEN(it[0]);}
function egAanAns(i){
 if(EGR.done)return;const it=EGR.cur,o=["a","an"][i];
 if(o===it[2]){egMark(i,true);egFb("✅ "+o+" "+it[0],true);setTimeout(function(){speakEN(o+" "+it[0]);},300);egAnswered(!EGR.tried,2000);}
 else{EGR.tried=true;egMark(i,false);sNO();egFb("Say the first sound of «"+it[0]+"» 🤔 Is it a vowel sound?",false);}}

/* ---------- ✖️ one or many ---------- */
function egPlural(it){
 const sg=it[0],pl=it[1],bad=[];
 [sg+"s",sg+"es",sg.replace(/y$/,"ies"),sg.replace(/f$/,"ves"),sg+"ies"].forEach(function(x){if(x!==pl&&x!==sg&&bad.indexOf(x)<0)bad.push(x);});
 EGR.cur=it;EGR.opts=shuffled([pl].concat(shuffled(bad).slice(0,2)));
 render(topbar("screenEnglishPlay()")+egHeader()
  +'<div class="card center" style="padding:10px"><div style="display:flex;justify-content:center;gap:26px;align-items:center"><div><div style="font-size:3.2rem">'+it[2]+'</div><b>ONE: '+sg+'</b></div><div><div style="font-size:2.3rem;letter-spacing:2px">'+it[2]+it[2]+it[2]+'</div><b>MANY: ____</b></div></div></div>'
  +egOpts(EGR.opts,"egPluralAns",1));
 speakEN(sg);}
function egPluralAns(i){
 if(EGR.done)return;const it=EGR.cur,o=EGR.opts[i];speakEN(o);
 if(o===it[1]){egMark(i,true);egFb("✅ "+it[0]+" → "+it[1]+" · "+it[3],true);egAnswered(!EGR.tried,2800);}
 else{EGR.tried=true;egMark(i,false);sNO();egFb("Not quite 🤔 Think about how the word ends.",false);}}

/* ---------- 👫 he / she / it / they ---------- */
function egPron(it){
 EGR.cur=it;
 render(topbar("screenEnglishPlay()")+egHeader()+egCard(it[1],it[0],3.6)
  +'<p class="center" style="margin:4px 0"><b>Which word can replace it?</b></p>'+egOpts(["he","she","it","they"],"egPronAns",2));
 speakEN(it[0]);}
function egPronAns(i){
 if(EGR.done)return;const it=EGR.cur,o=["he","she","it","they"][i];
 if(o===it[2]){egMark(i,true);egFb("✅ "+it[0]+" → "+o+(o==="they"?" (more than one)":o==="it"?" (a thing or an animal)":o==="he"?" (a boy or a man)":" (a girl or a woman)"),true);speakEN(o);egAnswered(!EGR.tried,2500);}
 else{EGR.tried=true;egMark(i,false);sNO();egFb("Is it a boy, a girl, a thing… or more than one? 🤔",false);}}

/* ---------- 🧩 am / is / are ---------- */
function egBe(it){
 EGR.cur=it;
 render(topbar("screenEnglishPlay()")+egHeader()
  +'<div class="card center" style="font-size:1.4rem;font-family:Fredoka;font-weight:600;line-height:1.6">'+esc(it[0]).replace("___",'<span style="display:inline-block;min-width:3ch;border-bottom:4px solid #F59E0B">&nbsp;</span>')+'</div>'
  +'<button class="speaker small" onclick="speakEN(EGR.cur[0].replace(\'___\',\'…\'))">🔊 Listen</button>'
  +'<p class="center mut" style="font-size:.85rem;margin:2px 0"><b>I</b> am · <b>he, she, it</b> is · <b>we, you, they</b> are</p>'+egOpts(["am","is","are"],"egBeAns",3));
 speakEN(it[0].replace("___","…"));}
function egBeAns(i){
 if(EGR.done)return;const it=EGR.cur,o=["am","is","are"][i];
 if(o===it[1]){egMark(i,true);const full=it[0].replace("___",o);egFb("✅ "+full,true);setTimeout(function(){speakEN(full);},300);egAnswered(!EGR.tried,2400);}
 else{EGR.tried=true;egMark(i,false);sNO();egFb("Who is the sentence about? One or many? 🤔",false);}}

/* ---------- 👏 syllables ---------- */
function egSyl(it){
 EGR.cur=it;
 render(topbar("screenEnglishPlay()")+egHeader()+egCard(it[1],it[0],4)
  +'<button class="speaker small" onclick="speakEN(EGR.cur[0])">🔊 Listen</button>'
  +'<p class="center" style="margin:4px 0"><b>👏 Clap each beat. How many syllables?</b></p>'+egOpts([1,2,3,4,5],"egSylAns",5));
 speakEN(it[0]);}
function egSylAns(i){
 if(EGR.done)return;const it=EGR.cur,n=i+1;
 if(n===it[2]){egMark(i,true);egFb("✅ "+it[0]+" = "+n,true);speakEN(it[0]);egAnswered(!EGR.tried,2000);}
 else{EGR.tried=true;egMark(i,false);sNO();egFb("Say it slowly and clap: "+it[0]+" 👏",false);}}

/* ---------- 🎵 rhymes ---------- */
function egRhyme(it){
 EGR.cur=it;EGR.opts=shuffled([it[2],it[3],it[4]]);
 render(topbar("screenEnglishPlay()")+egHeader()+egCard(it[1],it[0].toUpperCase(),4)
  +'<button class="speaker small" onclick="speakEN(EGR.cur[0])">🔊 Listen</button>'
  +'<p class="center" style="margin:4px 0"><b>Which word rhymes with <span style="color:#7C3AED">'+it[0]+'</span>?</b></p>'+egOpts(EGR.opts,"egRhymeAns",1));
 speakEN(it[0]);}
function egRhymeAns(i){
 if(EGR.done)return;const it=EGR.cur,o=EGR.opts[i];speakEN(o);
 if(o===it[2]){egMark(i,true);egFb("✅ "+it[0]+" · "+o+" 🎵",true);egAnswered(!EGR.tried,2000);}
 else{EGR.tried=true;egMark(i,false);sNO();egFb("Listen to the END of the words 👂",false);}}

/* ---------- 🔁 same or opposite (3D) ---------- */
function egSameOpp(){
 const all=shuffled(EGR_SO),words=[],used={};
 all.filter(function(r){return r[2]==="s";}).slice(0,3).forEach(function(r){words.push({w:r[0]+" · "+r[1],k:"s"});used[r[0]]=1;});
 all.filter(function(r){return r[2]==="o"&&!used[r[0]];}).slice(0,3).forEach(function(r){words.push({w:r[0]+" · "+r[1],k:"o"});});
 EGR.tries={};
 render(topbar("screenEnglishPlay()")+'<div class="progressdots">'+dots(2,EGR.round)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">🔁 Same or opposite 3D</p>'
  +'<div class="card" style="padding:8px 12px"><b>Tap a pair of words and take it to its basket</b><br><span class="mut" style="font-size:.82rem">🔵 same = synonyms (big · large) · 🟠 opposite = antonyms (big · small)</span></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="egCanvas" style="width:100%;height:clamp(300px,50vh,400px)"></div></div><div id="egFb"></div>');
 EGR.c3=renderWordSorter("egCanvas",shuffled(words),function(ev,info){
  if(ev==="select"){speakEN(info.w.replace(" · "," and "));}
  else if(ev==="ok"){const first=!EGR.tries[info.w];if(first)EGR.ok++;recordAnswer("Inglés",first,8);EGR.i++;sOK();confetti(4);egFb("✅ "+info.w+(info.k==="s"?" · they mean the same":" · they are opposites"),true);}
  else if(ev==="wrong"){EGR.tries[info.w]=1;sNO();egFb("🤔 «"+info.w+"» "+(info.right==="s"?"mean almost the same":"are opposites")+". Try the other basket!",false);}
  else if(ev==="done"){EGR.round++;if(EGR.round>=2){egFb("🎉 Great job!",true);egLater(egFinish,1200);}else{egFb("🎉 Well done! Next round…",true);egLater(egSameOpp,1300);}}},EGR_SO_BINS);}

/* ---------- 🥁 the strong syllable ---------- */
function egStress(it){
 const p=it[2].split("-");EGR.cur=it;
 render(topbar("screenEnglishPlay()")+egHeader()+egCard(it[1],"",4)
  +'<button class="speaker small" onclick="speakEN(EGR.cur[0])">🔊 Listen</button>'
  +'<p class="center" style="margin:6px 0"><b>🥁 Say it slowly. Which syllable is the LOUDEST?</b></p>'
  +'<div style="display:flex;justify-content:center;flex-wrap:wrap;gap:8px">'+p.map(function(s,i){return '<button id="egS'+i+'" onclick="egStressAns('+i+')" style="min-width:64px;padding:12px 14px;border-radius:14px;border:3px solid #CBD5E1;background:#fff;font-family:Fredoka;font-weight:700;font-size:1.5rem;cursor:pointer">'+s+'</button>';}).join("")+'</div><div id="egFb"></div>');
 speakEN(it[0]);}
function egStressAns(i){
 if(EGR.done)return;const it=EGR.cur,b=document.getElementById("egS"+i);
 if(i===it[3]){b.style.background="#EF4444";b.style.borderColor="#B91C1C";b.style.color="#fff";egFb("✅ "+it[2].split("-").map(function(s,k){return k===it[3]?s.toUpperCase():s;}).join(" · "),true);speakEN(it[0]);egAnswered(!EGR.tried,2400);}
 else{EGR.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();egFb("Say it again and feel which beat is stronger 🥁",false);}}
