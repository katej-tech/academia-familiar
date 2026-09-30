"use strict";
/* ============ TRUCOS DE MATEMÁTICAS (técnicas de cálculo mental para la edad) ============
   Pedido: "técnicas de aprendizaje matemáticas avanzadas para la edad". No son operaciones más
   difíciles — son las técnicas de cálculo mental que de verdad usan los niños buenos en mate:
     🔟 Hacer diez     — descompone para completar decenas (8+5 = 8+2+3 = 10+3)
     👯 Dobles y casi-dobles — usa 6+6=12 para resolver 6+7=13
     🐇 Conteo salteado — cuenta de 2 en 2, 5 en 5, 10 en 10 para sumar/multiplicar más rápido
     ⬆️ Resta hacia adelante — para restar, cuenta hacia ADELANTE desde el número chico
     🎯 Estimar y redondear — redondea a la decena para saber si una respuesta "suena bien"
   Cada truco: explicación visual paso a paso (marcos de diez con puntos) + práctica de 5
   problemas escribiendo la respuesta (obliga a usar el truco, no solo elegir entre opciones). */

const MT_TRICKS=[
 {id:"diez",ic:"🔟",nm:"Hacer diez",sub:"Completa una decena y el resto es fácil"},
 {id:"dobles",ic:"👯",nm:"Dobles y casi-dobles",sub:"Usa lo que ya sabes (6+6) para lo nuevo (6+7)"},
 {id:"salto",ic:"🐇",nm:"Conteo salteado",sub:"Cuenta de 2, 5 o 10 en 10 para ir más rápido"},
 {id:"restadelante",ic:"⬆️",nm:"Resta hacia adelante",sub:"Para restar, cuenta hacia ADELANTE"},
 {id:"estimar",ic:"🎯",nm:"Estimar y redondear",sub:"Redondea para saber si tu respuesta 'suena bien'"}];
function mtDone(){const p=prof();return p.mathTricksDone||{};}
function screenMathTricks(){setTheme("kid");const done=mtDone();
 const cards=MT_TRICKS.map(function(t){const ok=done[t.id];
  return '<button class="kbtn '+(ok?"yellow":"white")+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="mtLesson(\''+t.id+'\')"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">'+t.ic+'</span><span style="flex:1"><span>'+t.nm+(ok?" ⭐":"")+'</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">'+t.sub+'</span></span></button>';}).join("");
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🧮✨ Trucos de matemáticas</h2>'
  +'<p class="center" style="margin-bottom:12px">Así calculan rápido los que son buenos en mate — no es magia, ¡es una técnica que puedes aprender!</p>'
  +cards);}

/* marco de diez: placeholder que se rellena con render3DTenFrame() (cubos 3D) tras el render */
function tenSlot(){return '<div id="mtTen" style="width:100%;height:150px"></div>';}

let MTQ={};
function mtLesson(id){setTheme("kid");MTQ.id=id;
 const T={
  diez:function(){
   const a=8,b=5,need=10-a,rest=b-need;
   return{title:"Hacer diez",tens:{0:{n:a},1:{n:10}},steps:[
    '<p>Para sumar <b>'+a+' + '+b+'</b>, primero completamos una decena.</p>'+tenSlot()+'<p class="center">Al '+a+' le faltan <b>'+need+'</b> para llegar a 10.</p>',
    '<p>Le quitamos '+need+' al '+b+': '+b+' = '+need+' + '+rest+'.</p>'+tenSlot()+'<p class="center"><b>'+a+' + '+need+' = 10</b>, y nos queda <b>'+rest+'</b> por sumar.</p>',
    '<p class="center" style="font-size:1.3rem"><b>10 + '+rest+' = '+(10+rest)+'</b></p><p>¡Sumar con una decena redonda es mucho más fácil que sumar '+a+' + '+b+' directo!</p>'],
   gen:function(){const a=pick([7,8,9]),b=2+rnd(7);return{q:a+" + "+b,a:a+b};}};},
  dobles:function(){
   return{title:"Dobles y casi-dobles",steps:[
    '<p>Los <b>dobles</b> se aprenden de memoria rapidito: 1+1, 2+2, 3+3… hasta 9+9.</p><p class="center" style="font-size:1.3rem"><b>6 + 6 = 12</b></p>',
    '<p>Un <b>casi-doble</b> es un doble +1 o −1. Por ejemplo <b>6 + 7</b> es como 6+6, pero uno más.</p><p class="center" style="font-size:1.3rem"><b>6 + 6 = 12</b>, entonces <b>6 + 7 = 13</b></p>',
    '<p>¡Así te aprendes UN doble y resuelves DOS sumas! Funciona igual para 7+8 (doble de 7, +1) o 8+7 (doble de 8, −1).</p>'],
   gen:function(){const d=2+rnd(8),plus=Math.random()<.5;const a=d,b=plus?d+1:d-1;return{q:a+" + "+b,a:a+b};}};},
  salto:function(){
   return{title:"Conteo salteado",steps:[
    '<p>Contar de 1 en 1 es lento. ¡Salta de <b>2 en 2</b>, de <b>5 en 5</b> o de <b>10 en 10</b>!</p><p class="center" style="font-size:1.25rem">2 → 4 → 6 → 8 → 10</p>',
    '<p>Sirve para sumar rápido varias veces el mismo número. <b>4 grupos de 5</b> es: 5 → 10 → 15 → 20.</p><p class="center" style="font-size:1.3rem"><b>5+5+5+5 = 20</b></p>',
    '<p>La próxima vez que sumes el mismo número varias veces, ¡prueba saltando en vez de contar de 1 en 1!</p>'],
   gen:function(){const n=pick([2,5,10]),t=2+rnd(4);return{q:Array(t).fill(n).join(" + "),a:n*t};}};},
  restadelante:function(){
   const a=15,b=8;
   return{title:"Resta hacia adelante",tens:{1:{n:10-b,color:"#F59E0B"}},steps:[
    '<p>Para <b>'+a+' − '+b+'</b>, en vez de restar, ¡cuenta hacia ADELANTE desde '+b+' hasta '+a+'!</p>',
    '<p>De '+b+' a 10 hay <b>'+(10-b)+'</b>. De 10 a '+a+' hay <b>'+(a-10)+'</b> más.</p>'+tenSlot()+'<p class="center">'+(10-b)+' + '+(a-10)+' = <b>'+(a-b)+'</b></p>',
    '<p class="center" style="font-size:1.3rem"><b>'+a+' − '+b+' = '+(a-b)+'</b></p><p>Contar hacia adelante es más fácil que restar cuando los números están cerca.</p>'],
   gen:function(){const b=6+rnd(4),a=b+2+rnd(8);return{q:a+" - "+b,a:a-b};}};},
  estimar:function(){
   return{title:"Estimar y redondear",steps:[
    '<p>Antes de calcular, <b>redondea</b> a la decena más cercana para adivinar más o menos cuánto va a dar.</p>',
    '<p><b>38 + 22</b>: redondeamos 38→40 y 22→20. 40+20=<b>60</b>. La respuesta real debe ser cercana a 60.</p>',
    '<p>Si al calcular te da algo muy distinto (como 250), ¡sabes que te equivocaste en algo! Estimar te ayuda a revisar.</p>'],
   gen:function(){const a=(2+rnd(8))*10+pick([-2,-1,1,2,0]),b=(2+rnd(8))*10+pick([-2,-1,1,2,0]);return{q:"Redondea y estima: "+a+" + "+b,a:Math.round(a/10)*10+Math.round(b/10)*10,est:true};}};}
 }[id]();
 MTQ.data=T;MTQ.step=0;mtRenderStep();}
function mtRenderStep(){
 const T=MTQ.data;
 render(topbar("screenMathTricks()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">'+T.title+'</h2>'
  +'<div class="progressdots">'+dots(T.steps.length,MTQ.step)+'</div>'
  +'<div class="card" style="line-height:1.5">'+T.steps[MTQ.step]+'</div>'
  +'<button class="kbtn '+(MTQ.step<T.steps.length-1?"blue":"green")+'" onclick="mtNextStep()">'+(MTQ.step<T.steps.length-1?"Siguiente →":"🎯 ¡A practicar!")+'</button>');
 const tf=T.tens&&T.tens[MTQ.step];
 if(tf&&typeof render3DTenFrame==="function")render3DTenFrame("mtTen",tf.n,tf.color);
 else if(typeof dispose3DTen==="function")dispose3DTen();
 speakES(MTQ.step===0?T.title:"");}
function mtNextStep(){
 if(MTQ.step<MTQ.data.steps.length-1){MTQ.step++;return mtRenderStep();}
 mtPracticeStart();}
function mtPracticeStart(){MTQ.round=0;MTQ.total=5;MTQ.ok=0;mtPracticeNext();}
function mtPracticeNext(){
 if(MTQ.round>=MTQ.total)return mtPracticeEnd();
 const it=MTQ.data.gen();MTQ.cur=it;MTQ.typed="";
 render(topbar("screenMathTricks()")
  +'<div class="progressdots">'+dots(MTQ.total,MTQ.round)+'</div>'
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:8px">'+MTQ.data.title+'</h2>'
  +'<div class="card center"><b style="font-size:1.4rem">'+it.q+' = ?</b></div>'
  +'<div class="numdisp" id="mtTyped">'+(MTQ.typed||"&nbsp;")+'</div>'
  +'<div class="numpad">'+[1,2,3,4,5,6,7,8,9].map(function(d){return '<button class="key" onclick="mtTap(\''+d+'\')">'+d+'</button>';}).join("")
  +'<button class="key" onclick="mtBack()">⌫</button><button class="key" onclick="mtTap(\'0\')">0</button><button class="key okk" onclick="mtCheck()">✓</button></div>');}
function mtTap(d){if(MTQ.typed.length<3){MTQ.typed+=d;beep([560],.04);document.getElementById("mtTyped").textContent=MTQ.typed;}}
function mtBack(){MTQ.typed=MTQ.typed.slice(0,-1);document.getElementById("mtTyped").innerHTML=MTQ.typed||"&nbsp;";}
function mtCheck(){
 if(!MTQ.typed)return;
 const v=parseInt(MTQ.typed,10),it=MTQ.cur;
 const ok=it.est?Math.abs(v-it.a)<=10:v===it.a;
 recordAnswer("Trucos de mate",ok,15);
 if(ok){sOK();confetti(10);MTQ.ok++;toast(it.est?"¡Buena estimación! 🎯":"¡Correcto! 🎉",true,1200);}
 else{sNO();toast("Era "+it.a+(it.est?" (o cerca)":""),false,1800);}
 MTQ.round++;setTimeout(mtPracticeNext,ok?1200:2200);}
function mtPracticeEnd(){
 const p=prof();if(MTQ.ok>=4){if(!p.mathTricksDone)p.mathTricksDone={};p.mathTricksDone[MTQ.id]=true;}
 p.coins+=2+MTQ.ok;p.xp+=8;save();
 if(MTQ.ok>=4){sWIN();confetti(20);}
 nodeWin(starsFor(MTQ.ok,MTQ.total),MTQ.data.title);}
