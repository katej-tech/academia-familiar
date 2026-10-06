"use strict";
/* ============ GÉNERO Y NÚMERO (2.º de primaria) ============
   Masculino/femenino y singular/plural, y la CONCORDANCIA (el niño alto / las niñas altas).
   Colores fijos: masculino celeste, femenino rosa; el plural usa el tono más fuerte del mismo color.
   Incluye mini lección y 5 actividades: casitas de artículos EL·LA·LOS·LAS en 3D (reusa grammar3d.js),
   cambia el género, completa con el artículo, ¿cuál suena bien? (concordancia) y pasa la oración
   al plural/singular. Prefijo gnr / GNR. */

const GNR_B=[
 {k:"el",nm:"EL",sub:"uno · masculino",col:"#0EA5E9",dark:"#0369A1"},
 {k:"la",nm:"LA",sub:"una · femenina",col:"#EC4899",dark:"#BE185D"},
 {k:"los",nm:"LOS",sub:"varios · masculino",col:"#2563EB",dark:"#1E3A8A"},
 {k:"las",nm:"LAS",sub:"varias · femenino",col:"#C026D3",dark:"#86198F"}];
const GNR_WORDS={
 el:["perro","gato","libro","árbol","carro","niño","sol","pez","lápiz","río","mar","día","mapa","avión","zapato","pájaro"],
 la:["casa","mesa","flor","luna","niña","escuela","silla","mano","luz","nube","ciudad","hormiga","puerta","ventana","mariposa","manzana"],
 los:["perros","gatos","libros","árboles","niños","lápices","peces","aviones","relojes","zapatos","pájaros","carros","ríos","días"],
 las:["casas","mesas","flores","lunas","niñas","sillas","manos","luces","nubes","ciudades","hormigas","puertas","ventanas","mariposas","manzanas"]};
/* masculino / femenino (incluye irregulares: gallo-gallina, toro-vaca, rey-reina) */
const GNR_PAIRS=[["👦","niño","niña"],["🐱","gato","gata"],["🧑‍🏫","maestro","maestra"],["🦁","león","leona"],["🐶","perro","perra"],["👴","abuelo","abuela"],
 ["🤴","rey","reina"],["🩺","doctor","doctora"],["🐓","gallo","gallina"],["🐂","toro","vaca"],["🍳","cocinero","cocinera"],["🧒","primo","prima"],["👬","amigo","amiga"],["🐴","caballo","yegua"],["🎨","pintor","pintora"]];
const GNR_ART=[
 {s:"___ perro ladra mucho.",ok:"el"},{s:"___ casa es muy grande.",ok:"la"},{s:"___ flores huelen rico.",ok:"las"},{s:"___ libros están en la mesa.",ok:"los"},
 {s:"___ niña lee un cuento.",ok:"la"},{s:"___ niños juegan fútbol.",ok:"los"},{s:"___ luna brilla de noche.",ok:"la"},{s:"___ árboles dan sombra.",ok:"los"},
 {s:"___ sillas son cómodas.",ok:"las"},{s:"___ avión vuela muy alto.",ok:"el"},
 {s:"Tengo ___ gata blanca.",ok:"una",set:"i"},{s:"Compré ___ zapatos nuevos.",ok:"unos",set:"i"},{s:"Hay ___ mariposas en el jardín.",ok:"unas",set:"i"},
 {s:"Vi ___ elefante enorme.",ok:"un",set:"i"},{s:"Mi papá tiene ___ carro azul.",ok:"un",set:"i"},{s:"En mi cuarto hay ___ lámpara.",ok:"una",set:"i"}];
/* [correcta, error de género, error de número] */
const GNR_CONC=[
 ["Las niñas bonitas juegan.","Los niñas bonitas juegan.","Las niñas bonita juegan."],
 ["El gato negro duerme.","La gato negro duerme.","El gato negros duerme."],
 ["Los perros pequeños corren.","Las perros pequeños corren.","Los perros pequeño corre."],
 ["La casa blanca es bonita.","El casa blanca es bonita.","La casa blancas es bonita."],
 ["Unas flores amarillas crecen.","Unos flores amarillas crecen.","Unas flores amarilla crecen."],
 ["Mis amigas son simpáticas.","Mis amigas son simpáticos.","Mis amigas es simpática."],
 ["El niño alto corre rápido.","El niño alta corre rápido.","Los niño alto corre rápido."],
 ["La maestra amable explica.","El maestra amable explica.","La maestra amable explican."],
 ["Los pájaros cantan en el árbol.","Las pájaros cantan en el árbol.","Los pájaros canta en el árbol."],
 ["Las mariposas vuelan alto.","Los mariposas vuelan alto.","Las mariposas vuela alto."]];
/* [singular, plural]: art + sustantivo + adjetivo + verbo (siempre 4 palabras) */
const GNR_SP=[
 ["El gato pequeño duerme.","Los gatos pequeños duermen."],["La niña alegre canta.","Las niñas alegres cantan."],["El perro grande corre.","Los perros grandes corren."],
 ["La flor roja crece.","Las flores rojas crecen."],["El pájaro azul vuela.","Los pájaros azules vuelan."],["La mariposa bonita llega.","Las mariposas bonitas llegan."],
 ["El niño valiente salta.","Los niños valientes saltan."],["La luz brillante entra.","Las luces brillantes entran."]];
const GNR_ACTS=[
 {id:"casitas",ic:"🏠",nm:"Casitas EL · LA · LOS · LAS 3D",sub:"Lleva cada palabra a su casita",cls:"blue"},
 {id:"cambia",ic:"🔄",nm:"Niño → niña",sub:"Cambia el género de la palabra",cls:"red"},
 {id:"articulo",ic:"🧩",nm:"El, la, los, las, un, una…",sub:"Completa con el artículo",cls:"green"},
 {id:"concuerda",ic:"👂",nm:"¿Cuál está bien dicha?",sub:"Que todo concuerde",cls:"yellow"},
 {id:"plural",ic:"✖️",nm:"Pasa al plural o al singular",sub:"Cambia TODAS las palabras",cls:"purple"}];
const GNR_WIN={noWorld:true,replay:"screenGender()",replayLabel:"Más género y número 👫",backFn:"screenKidMap()",backLabel:"Ir a los mundos 🌍"};
let GNR={};

function gnrCleanup(){if(GNR.timer)clearTimeout(GNR.timer);GNR.timer=null;GNR={};}
function gnrLater(fn,ms){if(GNR.timer)clearTimeout(GNR.timer);const k=GNR.kind;GNR.timer=setTimeout(function(){if(GNR.kind===k)fn();},ms);}
function gnrFb(h,ok){const f=document.getElementById("gnrFb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:'+(ok?'#16A34A':'#475569')+'">'+h+'</p>';}
function gnrHeader(){const a=GNR_ACTS.find(function(x){return x.id===GNR.kind;});return '<div class="progressdots">'+dots(GNR.total,GNR.i)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">'+a.ic+' '+a.nm+'</p>';}
function gnrAnswered(first,delay){
 if(first)GNR.ok++;recordAnswer("Lenguaje",first,12);sOK();confetti(first?9:4);
 GNR.done=true;GNR.i++;gnrLater(gnrNext,delay||1700);}
function gnrFinish(){const stars=starsFor(GNR.ok,Math.max(1,GNR.total));recordAnswer("Lenguaje",stars>=2,40);save();nodeWin(stars,"Lenguaje",GNR_WIN);}
function gnrCap(s){return s.charAt(0).toUpperCase()+s.slice(1);}

/* ---------- menú y lección ---------- */
function screenGender(){setTheme("kid");
 gnrCleanup();
 const cards=GNR_ACTS.map(function(a){return '<button class="kbtn '+a.cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="gnrStart(\''+a.id+'\')"><span style="font-size:clamp(2rem,9vw,2.6rem)">'+a.ic+'</span><span style="flex:1"><span>'+a.nm+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+a.sub+'</span></span></button>';}).join("");
 render(topbar("screenKidMap()")+subHeader("👫 Género y número")
  +'<p class="center" style="margin:-4px 0 10px">Masculino y femenino, singular y plural, ¡y que todo concuerde!</p>'
  +'<button class="kbtn white" style="display:flex;align-items:center;gap:14px;text-align:left;border-style:dashed" onclick="gnrLesson()"><span style="font-size:2.4rem">📘</span><span style="flex:1"><span>Mini lección</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">Empieza aquí: género y número con ejemplos</span></span></button>'
  +cards);}
function gnrLesson(){setTheme("kid");
 gnrCleanup();
 const chip=function(t,col){return '<button onclick="speakES(\''+t+'\')" style="margin:3px;padding:6px 12px;border-radius:12px;border:2px solid '+col+';background:#fff;color:'+col+';font-weight:800;font-size:1rem;cursor:pointer">🔊 '+t+'</button>';};
 const box=function(col,bg,ic,title,txt,chips){return '<div class="card" style="border:3px solid '+col+';background:'+bg+'"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:2.2rem">'+ic+'</span><div><b style="color:'+col+';font-size:1.25rem">'+title+'</b><br><span style="font-size:.9rem">'+txt+'</span></div></div><div style="margin-top:6px">'+chips+'</div></div>';};
 render(topbar("screenGender()")+subHeader("📘 Género y número")
  +'<p class="appsec">GÉNERO: ¿niño o niña?</p>'
  +box("#0EA5E9","#E0F2FE","👦","Masculino","Va con <b>el, un, los, unos</b>. Muchas palabras terminan en -o.",["el niño","un perro","los gatos","unos libros"].map(function(t){return chip(t,"#0EA5E9");}).join(""))
  +box("#EC4899","#FCE7F3","👧","Femenino","Va con <b>la, una, las, unas</b>. Muchas palabras terminan en -a.",["la niña","una casa","las flores","unas sillas"].map(function(t){return chip(t,"#EC4899");}).join(""))
  +'<p class="appsec" style="margin-top:12px">NÚMERO: ¿uno o varios?</p>'
  +box("#F59E0B","#FEF3C7","🐱","Singular (uno)","Hay <b>uno</b> solo: <i>gato, flor</i>.",["un gato","una flor"].map(function(t){return chip(t,"#F59E0B");}).join(""))
  +box("#7C3AED","#EDE9FE","🐱🐱🐱","Plural (varios)","Hay <b>más de uno</b>. Se agrega <b>-s</b> (gato→gatos) o <b>-es</b> (flor→flores). Si termina en z cambia a c: lápiz→lápices.",["gatos","flores","lápices"].map(function(t){return chip(t,"#7C3AED");}).join(""))
  +'<div class="card"><b>🔑 Concordancia:</b> todas las palabras se ponen de acuerdo.<div style="font-size:1.2rem;line-height:2;margin-top:6px"><span style="background:#FCE7F3;border-radius:8px;padding:2px 8px">Las</span> <span style="background:#FCE7F3;border-radius:8px;padding:2px 8px">niñas</span> <span style="background:#FCE7F3;border-radius:8px;padding:2px 8px">bonitas</span> <span style="background:#EDE9FE;border-radius:8px;padding:2px 8px">juegan</span></div><p class="mut" style="margin:4px 0 0;font-size:.85rem">Todas dicen: femenino y plural.</p></div>'
  +'<button class="kbtn green" onclick="gnrStart(\'casitas\')">🏠 ¡A practicar!</button><button class="kbtn white" onclick="screenGender()">← Volver</button>');}

/* ---------- motor ---------- */
function gnrStart(kind){
 gnrCleanup();GNR={kind:kind,i:0,ok:0,total:6,tried:false,done:false};
 const bank={
  casitas:function(){return[0,1];},
  cambia:function(){return shuffled(GNR_PAIRS).slice(0,6).map(function(p){const toF=Math.random()<.5;return{e:p[0],m:p[1],f:p[2],toF:toF};});},
  articulo:function(){return shuffled(GNR_ART).slice(0,6);},
  concuerda:function(){return shuffled(GNR_CONC).slice(0,6);},
  plural:function(){return shuffled(GNR_SP).slice(0,6).map(function(p){return{s:p[0],p:p[1],toPlural:Math.random()<.6};});}};
 GNR.items=bank[kind]();
 if(kind==="casitas"){GNR.total=12;GNR.round=0;}else GNR.total=GNR.items.length;
 gnrNext();}
function gnrNext(){
 if(GNR.i>=GNR.total&&GNR.kind!=="casitas")return gnrFinish();
 GNR.tried=false;GNR.done=false;
 const k=GNR.kind,it=GNR.items[GNR.i];
 if(k==="casitas")return gnrCasitas();
 if(k==="cambia")return gnrCambia(it);
 if(k==="articulo")return gnrArt(it);
 if(k==="concuerda")return gnrConc(it);
 if(k==="plural")return gnrPlural(it);}

/* ---------- 🏠 casitas 3D ---------- */
function gnrCasitas(){
 const pick1=function(k){return GNR_WORDS[k][Math.floor(Math.random()*GNR_WORDS[k].length)];};
 const used={},words=[];
 ["el","la","los","las"].forEach(function(k){const w=pick1(k);used[w]=1;words.push({w:w,k:k});});
 while(words.length<6){const k=["el","la","los","las"][Math.floor(Math.random()*4)],w=pick1(k);if(!used[w]){used[w]=1;words.push({w:w,k:k});}}
 GNR.tries={};
 render(topbar("screenGender()")+'<div class="progressdots">'+dots(2,GNR.round)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">🏠 Casitas EL · LA · LOS · LAS 3D</p>'
  +'<div class="card" style="padding:8px 12px"><b>¿Con qué artículo va cada palabra?</b><br><span class="mut" style="font-size:.82rem">Toca la palabra y luego su casita. Pregúntate: ¿uno o varios? ¿niño o niña?</span></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="gnrCanvas" style="width:100%;height:clamp(300px,50vh,400px)"></div></div><div id="gnrFb"></div>');
 GNR.c3=renderWordSorter("gnrCanvas",words,function(ev,info){
  if(ev==="select"){speakES(info.w);}
  else if(ev==="ok"){const first=!GNR.tries[info.w];if(first)GNR.ok++;recordAnswer("Lenguaje",first,8);GNR.i++;sOK();confetti(4);gnrFb("✅ "+info.k+" "+info.w,true);speakES(info.k+" "+info.w);}
  else if(ev==="wrong"){GNR.tries[info.w]=1;sNO();const r=info.right;gnrFb("🤔 «"+info.w+"» es "+(r==="el"?"uno y masculino":r==="la"?"una y femenina":r==="los"?"varios y masculino":"varias y femenina")+". ¡Prueba otra casita!",false);}
  else if(ev==="done"){GNR.round++;if(GNR.round>=2){gnrFb("🎉 ¡Todas en su casita!",true);gnrLater(gnrFinish,1200);}else{gnrFb("🎉 ¡Muy bien! Otra ronda…",true);gnrLater(gnrCasitas,1300);}}},GNR_B);}

/* ---------- 🔄 cambia el género ---------- */
function gnrCambia(it){
 const from=it.toF?it.m:it.f,to=it.toF?it.f:it.m;
 const art=function(isF,w){return (isF?"La ":"El ")+w;};
 const bad=[from,to+"s",from+"s"].filter(function(x,i,a){return x!==to&&a.indexOf(x)===i;});
 GNR.cur=it;GNR.to=to;GNR.opts=shuffled([to].concat(bad).slice(0,3));
 render(topbar("screenGender()")+gnrHeader()
  +'<div class="card center" style="padding:10px"><div style="font-size:3.6rem">'+it.e+'</div><div style="font-family:Fredoka;font-weight:700;font-size:1.4rem">'+art(!it.toF,from)+'</div><div style="font-size:1.6rem">⬇️</div><div style="font-family:Fredoka;font-weight:700;font-size:1.4rem">'+(it.toF?"La":"El")+' <span style="display:inline-block;min-width:4ch;border-bottom:4px solid '+(it.toF?"#EC4899":"#0EA5E9")+'">&nbsp;</span></div></div>'
  +'<p class="center" style="margin:6px 0"><b>Escribe el '+(it.toF?'<span style="color:#EC4899">FEMENINO</span>':'<span style="color:#0EA5E9">MASCULINO</span>')+'</b></p>'
  +GNR.opts.map(function(o,i){return '<button class="kbtn white" id="gnrO'+i+'" style="min-height:56px;font-size:1.4rem" onclick="gnrCambiaAns('+i+')">'+o+'</button>';}).join("")+'<div id="gnrFb"></div>');
 speakES(art(!it.toF,from));}
function gnrCambiaAns(i){
 if(GNR.done)return;const o=GNR.opts[i],b=document.getElementById("gnrO"+i);speakES(o);
 if(o===GNR.to){b.style.background="#86EFAC";gnrFb("✅ "+(GNR.cur.toF?"la ":"el ")+o,true);gnrAnswered(!GNR.tried,2000);}
 else{GNR.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();gnrFb("Casi… 🤔 Fíjate si es uno o una, niño o niña.",false);}}

/* ---------- 🧩 el, la, los, las / un, una, unos, unas ---------- */
function gnrArt(it){
 const set=it.set==="i"?["un","una","unos","unas"]:["el","la","los","las"];
 const start=it.s.indexOf("___")===0;
 GNR.cur=it;GNR.opts=shuffled(set);
 render(topbar("screenGender()")+gnrHeader()
  +'<div class="card center" style="font-size:1.35rem;font-family:Fredoka;font-weight:600;line-height:1.6">'+esc(it.s).replace("___",'<span style="display:inline-block;min-width:3ch;border-bottom:4px solid #6366F1">&nbsp;</span>')+'</div>'
  +'<button class="speaker small" onclick="speakES(GNR.cur.s.replace(\'___\',\'…\'))">🔊 Escucha la oración</button>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px">'+GNR.opts.map(function(o,i){return '<button class="kbtn white" id="gnrO'+i+'" style="margin:0;min-height:62px;font-size:1.5rem" onclick="gnrArtAns('+i+')">'+(start?gnrCap(o):o)+'</button>';}).join("")+'</div><div id="gnrFb"></div>');
 speakES(it.s.replace("___","…"));}
function gnrArtAns(i){
 if(GNR.done)return;const it=GNR.cur,o=GNR.opts[i],b=document.getElementById("gnrO"+i);
 if(o===it.ok){b.style.background="#86EFAC";const full=it.s.replace("___",it.s.indexOf("___")===0?gnrCap(o):o);gnrFb("✅ "+full,true);setTimeout(function(){speakES(full);},350);gnrAnswered(!GNR.tried,2600);}
 else{GNR.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();gnrFb("Casi… 🤔 Mira la palabra que sigue: ¿es uno o varios? ¿niño o niña?",false);}}

/* ---------- 👂 ¿cuál está bien dicha? ---------- */
function gnrConc(it){
 GNR.cur=it;GNR.opts=shuffled(it.map(function(t,i){return{t:t,ok:i===0};}));
 render(topbar("screenGender()")+gnrHeader()
  +'<div class="card center"><b>¿Cuál oración está bien? Todas las palabras deben ponerse de acuerdo.</b></div>'
  +GNR.opts.map(function(o,i){return '<button class="kbtn white" id="gnrO'+i+'" style="min-height:58px;font-size:1.15rem;text-align:left" onclick="gnrConcAns('+i+')">🔊 '+esc(o.t)+'</button>';}).join("")+'<div id="gnrFb"></div>');}
function gnrConcAns(i){
 if(GNR.done)return;const o=GNR.opts[i],b=document.getElementById("gnrO"+i);speakES(o.t);
 if(o.ok){b.style.background="#86EFAC";gnrFb("✅ ¡Todo concuerda!",true);gnrAnswered(!GNR.tried,2000);}
 else{GNR.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();gnrFb("Suena raro 🤔 Hay una palabra que no concuerda en género o en número.",false);}}

/* ---------- ✖️ pasa al plural / al singular ---------- */
function gnrPlural(it){
 const S=it.s.replace(/\.$/,"").split(" "),P=it.p.replace(/\.$/,"").split(" ");
 const mix=function(base,other,pos){const c=base.slice();c[pos]=other[pos];return c.join(" ")+".";};
 const good=it.toPlural?it.p:it.s;
 const bads=it.toPlural?[mix(P,S,2),mix(P,S,3)]:[mix(S,P,2),mix(S,P,3)];
 GNR.cur=it;GNR.good=good;GNR.opts=shuffled([good].concat(bads));
 render(topbar("screenGender()")+gnrHeader()
  +'<div class="card center" style="padding:10px"><div style="font-size:1.25rem;font-family:Fredoka;font-weight:600">'+esc(it.toPlural?it.s:it.p)+'</div><div style="margin-top:6px"><b>Escríbela en <span style="color:'+(it.toPlural?"#7C3AED":"#F59E0B")+'">'+(it.toPlural?"PLURAL (varios)":"SINGULAR (uno)")+'</span></b></div></div>'
  +'<button class="speaker small" onclick="speakES(GNR.cur.toPlural?GNR.cur.s:GNR.cur.p)">🔊 Escúchala</button>'
  +GNR.opts.map(function(o,i){return '<button class="kbtn white" id="gnrO'+i+'" style="min-height:58px;font-size:1.1rem;text-align:left" onclick="gnrPluralAns('+i+')">'+esc(o)+'</button>';}).join("")+'<div id="gnrFb"></div>');
 speakES(it.toPlural?it.s:it.p);}
function gnrPluralAns(i){
 if(GNR.done)return;const o=GNR.opts[i],b=document.getElementById("gnrO"+i);
 if(o===GNR.good){b.style.background="#86EFAC";gnrFb("✅ ¡Cambiaste TODAS las palabras!",true);speakES(o);gnrAnswered(!GNR.tried,2400);}
 else{GNR.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();gnrFb("Casi… 🤔 Una palabra se quedó sin cambiar. Revisa el artículo, el adjetivo y el verbo.",false);}}
