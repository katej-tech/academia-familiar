"use strict";
/* ============ EXPOSICIÓN: LOS REINOS DE LA NATURALEZA ============
   Pedido: exposición el martes con material de apoyo (afiche / cartelera) que ayude a entender visualmente.
   · AFICHE en hojas A4 horizontales para imprimir, colorear y pegar en una cartulina: portada, reino animal, vegetal,
     mineral, cuadro comparativo, otros reinos (hongos, protistas, móneras) y el guion.
   · GUION para practicar en voz alta (lee cada frase y el niño la repite), lista para llevar y quiz (unidad «reinos» del Examen).
   expoPosterHTML() no depende del resto de la app: también se usa en exposicion/afiche.html para sacar el PDF. */

const EXPO_NAME_LINE="Nombre: ______________________   Grado: 2.º   Fecha: ____________";
const EXPO_SCRIPT=[
 {cue:"Muestro la portada 🖼️",say:"¡Buenos días, profe y compañeros! Mi nombre es ______ y hoy les voy a hablar de los reinos de la naturaleza."},
 {cue:"Señalo el título 👉",say:"La naturaleza es todo lo que nos rodea y no fue hecho por las personas: los animales, las plantas, las rocas, el agua y el aire. Se organiza en reinos."},
 {cue:"Muestro el reino animal 🐶",say:"El primero es el reino animal. Los animales son seres vivos: se mueven, comen, respiran y tienen crías. Por ejemplo, el perro, el pez, la mariposa y el ave."},
 {cue:"Muestro el reino vegetal 🌳",say:"El segundo es el reino vegetal. Las plantas son seres vivos que no se mueven de su lugar. Tienen raíz, tallo, hojas, flor y fruto. Fabrican su alimento con el sol, el agua y el aire."},
 {cue:"Muestro el reino mineral 🪨",say:"El tercero es el reino mineral. Los minerales no son seres vivos: no nacen, no crecen ni se reproducen. Por ejemplo, las rocas, la sal, el oro y el hierro."},
 {cue:"Muestro el cuadro comparativo 📊",say:"Entonces, los animales y las plantas son seres vivos, pero los minerales no tienen vida. Los animales se mueven y comen; las plantas fabrican su alimento."},
 {cue:"(Opcional) Hoja de otros reinos 🍄",say:"Además hay otros reinos muy pequeñitos: los hongos, los protistas y las móneras, que son las bacterias. Casi no los vemos sin un microscopio."},
 {cue:"Sonrío y miro al público 😊",say:"Todos los reinos son importantes y debemos cuidar la naturaleza. ¡Gracias por escucharme! ¿Tienen alguna pregunta?"}];
const EXPO_QA=[
 ["¿Qué necesitan las plantas para vivir?","Sol, agua, aire y tierra."],
 ["¿Los minerales son seres vivos?","No. No nacen, no crecen, no se alimentan ni se reproducen."],
 ["¿Qué diferencia hay entre un animal y una planta?","El animal se mueve y come otros seres vivos; la planta no se mueve y fabrica su alimento con el sol."],
 ["Dime un ejemplo de cada reino.","Animal: perro. Vegetal: árbol de mango. Mineral: la sal."],
 ["¿Para qué nos sirven las plantas?","Nos dan alimento y oxígeno para respirar, sombra y medicinas."]];
const EXPO_CHECK=["Tengo la cartulina (o 2 pliegos de papel bond) 📜","Imprimí o dibujé las hojas del afiche 🖨️","Coloreé los dibujos con mis colores favoritos 🖍️","Pegué las hojas en la cartulina (título arriba, tres reinos en el medio) 🧷","Leí mi guion y lo practiqué 3 veces en voz alta 🗣️","Practiqué las preguntas que me pueden hacer ❓","Tengo marcadores, colores y pegante 🧴","Alisté el afiche enrollado y sin dañar para llevarlo 🎒"];

/* ---------- el afiche (hojas A4 horizontales) ---------- */
function expoPlantSVG(){return '<svg viewBox="0 0 300 330" style="width:100%;height:100%" xmlns="http://www.w3.org/2000/svg" font-family="Fredoka,Trebuchet MS,Arial,sans-serif" font-weight="700">'
 +'<rect x="0" y="238" width="300" height="92" rx="14" fill="#A16207"/><rect x="0" y="238" width="300" height="16" rx="8" fill="#65A30D"/>'
 +'<g stroke="#78350F" stroke-width="6" fill="none" stroke-linecap="round"><path d="M150 252 C150 280 140 295 118 318"/><path d="M150 252 C152 285 160 300 186 322"/><path d="M150 254 C150 290 150 305 150 326"/><path d="M142 270 C125 276 106 280 92 276"/><path d="M158 272 C176 276 192 286 208 284"/></g>'
 +'<rect x="143" y="104" width="14" height="150" rx="7" fill="#16A34A"/>'
 +'<path d="M150 190 C110 180 84 150 80 120 C116 122 146 146 150 190Z" fill="#22C55E" stroke="#15803D" stroke-width="3"/>'
 +'<path d="M150 160 C190 150 216 124 220 94 C184 96 154 120 150 160Z" fill="#4ADE80" stroke="#15803D" stroke-width="3"/>'
 +'<g transform="translate(150 78)"><g fill="#F472B6" stroke="#BE185D" stroke-width="2.5"><ellipse cx="0" cy="-30" rx="15" ry="22"/><ellipse cx="0" cy="30" rx="15" ry="22"/><ellipse cx="-30" cy="0" rx="22" ry="15"/><ellipse cx="30" cy="0" rx="22" ry="15"/><ellipse cx="-21" cy="-21" rx="15" ry="22" transform="rotate(-45 -21 -21)"/><ellipse cx="21" cy="-21" rx="15" ry="22" transform="rotate(45 21 -21)"/><ellipse cx="-21" cy="21" rx="15" ry="22" transform="rotate(45 -21 21)"/><ellipse cx="21" cy="21" rx="15" ry="22" transform="rotate(-45 21 21)"/></g><circle r="17" fill="#FACC15" stroke="#CA8A04" stroke-width="3"/></g>'
 +'<g stroke="#64748B" stroke-width="2" fill="none"><path d="M200 78 H262"/><path d="M96 126 H34"/><path d="M158 215 H262"/><path d="M120 296 H44"/><path d="M196 140 C 216 160 226 178 232 192"/></g>'
 +'<g font-size="20" fill="#1E293B"><text x="232" y="72">Flor</text><text x="6" y="120">Hojas</text><text x="222" y="219">Tallo</text><text x="6" y="294">Raíz</text></g>'
 +'<path d="M144 214 C126 216 112 212 102 206" stroke="#16A34A" stroke-width="5" fill="none" stroke-linecap="round"/><g transform="translate(90 200)"><circle r="16" fill="#EF4444" stroke="#991B1B" stroke-width="3"/><path d="M0 -16 C0 -26 6 -30 12 -30" stroke="#15803D" stroke-width="4" fill="none" stroke-linecap="round"/></g><path d="M58 200 H72" stroke="#64748B" stroke-width="2"/><text x="6" y="206" font-size="20" fill="#1E293B">Fruto</text>'
 +'</svg>';}
function expoPosterHTML(){
 const css='<style>'
 +'.afiwrap{font-family:Fredoka,"Trebuchet MS","Segoe UI",Arial,sans-serif;color:#1E293B}'
 +'.afi{width:100%;aspect-ratio:297/210;container-type:inline-size;position:relative;overflow:hidden;box-sizing:border-box;background:#fff;border-radius:2cqw;margin-bottom:3vw;box-shadow:0 2px 12px rgba(0,0,0,.18)}'
 +'.afi *{box-sizing:border-box}'
 +'.afi .in{position:absolute;inset:2.2cqw;border-radius:2.4cqw;padding:2cqw 2.6cqw;display:flex;flex-direction:column}'
 +'.afi h1{font-size:7.4cqw;line-height:1.05;margin:0;text-align:center;letter-spacing:.2cqw}'
 +'.afi h2{font-size:5.6cqw;line-height:1;margin:0}'
 +'.afi p,.afi li{font-size:2.35cqw;line-height:1.28;margin:0}'
 +'.afi .tag{display:inline-block;border-radius:5cqw;padding:.5cqw 2.2cqw;font-weight:800;font-size:2.4cqw;color:#fff}'
 +'.afi .row{display:flex;gap:2cqw}.afi .col{flex:1;min-width:0}'
 +'.afi .big{font-size:9cqw;line-height:1.1}.afi .mid{font-size:5.4cqw;line-height:1.15}'
 +'.afi .card{background:#fff;border-radius:2cqw;padding:1.1cqw 1.5cqw;text-align:center;box-shadow:0 .2cqw .8cqw rgba(0,0,0,.18);flex:1}'
 +'.afi .card b{display:block;font-size:2.2cqw}.afi .card span{font-size:6cqw;line-height:1.1;display:block}'
 +'.afi .draw{border:.45cqw dashed #94A3B8;border-radius:2cqw;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-size:2.1cqw;text-align:center;padding:1cqw}'
 +'.afi .fact{background:#FEF9C3;border-radius:2cqw;padding:1.2cqw 1.8cqw;font-size:2.15cqw;line-height:1.25}'
 +'.afi table{border-collapse:collapse;width:100%}.afi th,.afi td{border:.3cqw solid #CBD5E1;padding:.9cqw 1.2cqw;text-align:center;font-size:2.3cqw}'
 +'.afi th{font-size:2.8cqw;color:#fff}'
 +'.afi .nm{font-size:1.9cqw;color:#475569;text-align:center;margin-top:auto}'
 +'@media print{@page{size:A4 landscape;margin:0}.afi{width:297mm;height:210mm;aspect-ratio:auto;border-radius:0;box-shadow:none;margin:0;page-break-after:always;break-after:page;-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
 +'</style>';
 const page=function(bg,border,inner){return '<section class="afi" style="background:'+bg+'"><div class="in" style="border:.9cqw solid '+border+';background:rgba(255,255,255,.55)">'+inner+'</div></section>';};
 const ex=function(items){return '<div class="row" style="margin-top:1.4cqw">'+items.map(function(x){return '<div class="card"><span>'+x[0]+'</span><b>'+x[1]+'</b></div>';}).join("")+'</div>';};
 /* 1 portada */
 const p1=page("linear-gradient(135deg,#DBEAFE,#DCFCE7 55%,#FEF9C3)","#16A34A",
  '<div style="text-align:center;font-size:2.6cqw;font-weight:800;color:#0369A1">🔬 CIENCIAS NATURALES · EXPOSICIÓN</div>'
  +'<h1 style="color:#15803D;margin-top:1cqw">LOS REINOS<br>DE LA NATURALEZA</h1>'
  +'<div class="row" style="margin-top:2.2cqw;align-items:stretch">'
  +'<div class="card" style="background:#FEE2E2"><span class="big">🐶</span><b style="font-size:3cqw;color:#B91C1C">Reino ANIMAL</b><p style="font-size:2cqw;margin-top:.5cqw">Se mueven y comen</p></div>'
  +'<div class="card" style="background:#DCFCE7"><span class="big">🌳</span><b style="font-size:3cqw;color:#15803D">Reino VEGETAL</b><p style="font-size:2cqw;margin-top:.5cqw">Fabrican su alimento</p></div>'
  +'<div class="card" style="background:#E0E7FF"><span class="big">💎</span><b style="font-size:3cqw;color:#4338CA">Reino MINERAL</b><p style="font-size:2cqw;margin-top:.5cqw">No tienen vida</p></div></div>'
  +'<div style="text-align:center;font-size:4.4cqw;margin-top:1.6cqw">🌍 🦋 🌸 🪨 🍄 🐟 🌿</div>'
  +'<div class="nm">'+EXPO_NAME_LINE+'</div>');
 /* 2 animal */
 const p2=page("linear-gradient(135deg,#FEE2E2,#FFEDD5)","#EF4444",
  '<div class="row" style="align-items:center"><span class="big">🐾</span><h2 style="color:#B91C1C">REINO ANIMAL</h2><span class="tag" style="background:#EF4444;margin-left:auto">¡Seres VIVOS!</span></div>'
  +'<div class="row" style="margin-top:1.4cqw"><div class="col"><p style="font-size:2.6cqw"><b>Los animales</b> son seres vivos que se mueven, se alimentan, respiran y tienen crías.</p>'
  +'<ul style="padding-left:3cqw;margin:1.2cqw 0 0"><li>🏃 <b>Se mueven</b> de un lugar a otro</li><li>🍽️ <b>Comen</b> plantas u otros animales</li><li>🫁 <b>Respiran</b> aire o agua</li><li>🥚 <b>Nacen</b> y tienen crías</li><li>🌱 <b>Crecen</b> y al final mueren</li></ul></div>'
  +'<div class="col"><div class="draw" style="height:100%;font-size:2.3cqw">✏️ Dibuja aquí tu animal favorito<br>o pega un recorte</div></div></div>'
  +ex([["🐕","Perro"],["🐟","Pez"],["🦋","Mariposa"],["🐦","Ave"],["🐄","Vaca"]])
  +'<div class="fact" style="margin-top:1.4cqw">💡 <b>¿Sabías que?</b> La ballena azul es el animal más grande del mundo: ¡pesa más que 20 elefantes juntos!</div>');
 /* 3 vegetal */
 const p3=page("linear-gradient(135deg,#DCFCE7,#ECFCCB)","#16A34A",
  '<div class="row" style="align-items:center"><span class="big">🌿</span><h2 style="color:#15803D">REINO VEGETAL</h2><span class="tag" style="background:#16A34A;margin-left:auto">¡Seres VIVOS!</span></div>'
  +'<div class="row" style="margin-top:1.2cqw;flex:1;min-height:0"><div style="width:33%;background:#F0F9FF;border-radius:2cqw;padding:.8cqw">'+expoPlantSVG()+'</div>'
  +'<div class="col"><p style="font-size:2.5cqw"><b>Las plantas</b> son seres vivos que <b>no se mueven</b> de su lugar y <b>fabrican su propio alimento</b> con la luz del sol.</p>'
  +'<p style="font-size:2.3cqw;margin-top:1cqw"><b>¿Qué necesitan para vivir?</b></p>'
  +'<div class="row" style="margin-top:.6cqw"><div class="card"><span>☀️</span><b>Sol</b></div><div class="card"><span>💧</span><b>Agua</b></div><div class="card"><span>🌬️</span><b>Aire</b></div><div class="card"><span>🌱</span><b>Tierra</b></div></div>'
  +'<p style="font-size:2.2cqw;margin-top:1cqw">🌰 <b>Nacen</b> de una semilla y <b>crecen</b>.</p></div></div>'
  +ex([["🥭","Mango"],["🌹","Rosa"],["🌽","Maíz"],["🌵","Cactus"],["🌴","Palma"]])
  +'<div class="fact" style="margin-top:1.2cqw">💡 <b>¿Sabías que?</b> Las plantas nos regalan el oxígeno que respiramos. ¡Hay que cuidarlas!</div>');
 /* 4 mineral */
 const p4=page("linear-gradient(135deg,#E0E7FF,#F1F5F9)","#6366F1",
  '<div class="row" style="align-items:center"><span class="big">💎</span><h2 style="color:#4338CA">REINO MINERAL</h2><span class="tag" style="background:#6366F1;margin-left:auto">¡NO tienen vida!</span></div>'
  +'<div class="row" style="margin-top:1.4cqw"><div class="col"><p style="font-size:2.6cqw"><b>Los minerales y las rocas</b> están en la naturaleza, pero <b>no son seres vivos</b>.</p>'
  +'<ul style="padding-left:3cqw;margin:1.2cqw 0 0"><li>❌ No <b>nacen</b></li><li>❌ No <b>crecen</b></li><li>❌ No <b>comen</b> ni <b>respiran</b></li><li>❌ No se <b>reproducen</b> ni <b>mueren</b></li></ul>'
  +'<p style="font-size:2.2cqw;margin-top:1.2cqw">🏗️ Los usamos para construir, hacer joyas, cocinar y fabricar objetos.</p></div>'
  +'<div class="col"><div class="draw" style="height:100%;font-size:2.3cqw">✏️ Dibuja aquí una roca o un mineral<br>o pega un recorte</div></div></div>'
  +ex([["🪨","Roca"],["🧂","Sal"],["🪙","Oro"],["⚙️","Hierro"],["⚫","Carbón"]])
  +'<div class="fact" style="margin-top:1.4cqw">💡 <b>¿Y el agua y el aire?</b> Tampoco tienen vida: son naturaleza no viva.</div>');
 /* 5 cuadro comparativo */
 const yes='<span style="color:#16A34A;font-weight:900">✅ Sí</span>',no='<span style="color:#DC2626;font-weight:900">❌ No</span>';
 const p5=page("linear-gradient(135deg,#FEF9C3,#FCE7F3)","#F59E0B",
  '<h2 style="color:#B45309;text-align:center">📊 Comparamos los 3 reinos</h2>'
  +'<table style="margin-top:1.6cqw"><tr><th style="background:#94A3B8;width:25%"></th><th style="background:#EF4444">🐶 Animal</th><th style="background:#16A34A">🌳 Vegetal</th><th style="background:#6366F1">💎 Mineral</th></tr>'
  +'<tr><td><b>¿Está vivo?</b></td><td>'+yes+'</td><td>'+yes+'</td><td>'+no+'</td></tr>'
  +'<tr><td><b>¿Nace y crece?</b></td><td>'+yes+'</td><td>'+yes+'</td><td>'+no+'</td></tr>'
  +'<tr><td><b>¿Se mueve de lugar?</b></td><td>'+yes+'</td><td>'+no+'</td><td>'+no+'</td></tr>'
  +'<tr><td><b>¿Cómo se alimenta?</b></td><td>Come plantas u otros animales</td><td>Fabrica su alimento con el sol</td><td>No se alimenta</td></tr>'
  +'<tr><td><b>¿Se reproduce?</b></td><td>'+yes+'</td><td>'+yes+' (semillas)</td><td>'+no+'</td></tr>'
  +'<tr><td><b>Ejemplos</b></td><td style="font-size:3.2cqw">🐕 🐟 🦋</td><td style="font-size:3.2cqw">🌳 🌹 🌽</td><td style="font-size:3.2cqw">🪨 🧂 🪙</td></tr></table>'
  +'<div class="fact" style="margin-top:1.6cqw;text-align:center;font-size:2.4cqw">🌍 <b>Los animales y las plantas son seres vivos. Los minerales no.</b></div>');
 /* 6 otros reinos */
 const p6=page("linear-gradient(135deg,#F3E8FF,#FCE7F3)","#A855F7",
  '<div class="row" style="align-items:center"><span class="big">🔬</span><h2 style="color:#7E22CE">OTROS REINOS MUY PEQUEÑITOS</h2></div>'
  +'<p style="margin-top:1.2cqw;font-size:2.4cqw">Los científicos también agrupan a otros seres vivos. Muchos son tan pequeños que solo se ven con un <b>microscopio</b>.</p>'
  +'<div class="row" style="margin-top:1.6cqw;flex:1">'
  +'<div class="card" style="background:#FEF3C7"><span class="big">🍄</span><b style="font-size:3cqw;color:#B45309">HONGOS</b><p style="font-size:2.1cqw;margin-top:.6cqw">No son plantas ni animales. Viven en lugares húmedos y se alimentan de restos.<br><b>Ej.:</b> champiñón, moho del pan.</p></div>'
  +'<div class="card" style="background:#DBEAFE"><span class="big">🦠</span><b style="font-size:3cqw;color:#1D4ED8">PROTISTAS</b><p style="font-size:2.1cqw;margin-top:.6cqw">Seres vivos diminutos que viven en el agua.<br><b>Ej.:</b> ameba, algas.</p></div>'
  +'<div class="card" style="background:#DCFCE7"><span class="big">🧫</span><b style="font-size:3cqw;color:#15803D">MÓNERAS</b><p style="font-size:2.1cqw;margin-top:.6cqw">Las bacterias: los seres vivos más pequeños y sencillos. Algunas son buenas (yogur) y otras enferman: ¡por eso nos lavamos las manos! 🧼</p></div></div>'
  +'<div class="fact" style="margin-top:1.4cqw;text-align:center">✨ Hoja <b>opcional</b>: úsala solo si tu profe pidió más reinos.</div>');
 /* 7 guion */
 const p7=page("linear-gradient(135deg,#F0FDFA,#EFF6FF)","#0D9488",
  '<h2 style="color:#0F766E;text-align:center">🗣️ Mi guion para exponer</h2>'
  +'<ol style="margin:1.2cqw 0 0;padding-left:3.4cqw">'+EXPO_SCRIPT.map(function(s){return '<li style="font-size:1.95cqw;margin-bottom:.55cqw"><i style="color:#0D9488">('+s.cue+')</i> '+s.say+'</li>';}).join("")+'</ol>'
  +'<div class="fact" style="margin-top:auto;font-size:1.9cqw">⭐ <b>Consejos:</b> habla despacio y fuerte · mira a tus compañeros · señala el afiche con la mano · sonríe 😊</div>');
 return css+'<div class="afiwrap">'+[p1,p2,p3,p4,p5,p6,p7].join("")+'</div>';}

/* ---------- pantallas ---------- */
function expoChecks(){const p=prof();if(!p.expoCheck)p.expoCheck={};return p.expoCheck;}
function screenExpo(){setTheme("kid");
 if(typeof stopGames==="function")stopGames();
 const ck=expoChecks(),done=EXPO_CHECK.filter(function(_,i){return ck[i];}).length;
 render(topbar("screenKidMap()")+subHeader("🎤 Exposición: los reinos")
  +'<div class="card" style="background:linear-gradient(135deg,#DCFCE7,#ECFEFF);line-height:1.5"><b>📅 El martes: exposición de los reinos de la naturaleza.</b><br>Aquí tienes tu <b>afiche</b> para imprimir y pegar en la cartulina, tu <b>guion</b> para practicar y un <b>quiz</b>. ¡Vas a salir muy bien! 🌟</div>'
  +'<button class="kbtn green" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="expoPoster()"><span style="font-size:2.2rem">🖼️</span><span style="flex:1"><span>Mi afiche</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">7 hojas para imprimir, colorear y pegar</span></span></button>'
  +'<button class="kbtn purple" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="expoPractice(0)"><span style="font-size:2.2rem">🗣️</span><span style="flex:1"><span>Practicar mi exposición</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Escucha cada parte y dila tú</span></span></button>'
  +'<button class="kbtn yellow" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="expoQA()"><span style="font-size:2.2rem">❓</span><span style="flex:1"><span>Preguntas que me pueden hacer</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Con sus respuestas</span></span></button>'
  +'<button class="kbtn blue" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="startExamUnit(\'reinos\')"><span style="font-size:2.2rem">🧠</span><span style="flex:1"><span>Quiz de los reinos</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">8 preguntas para ver qué tanto sabes</span></span></button>'
  +'<button class="kbtn white" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="expoChecklist()"><span style="font-size:2.2rem">✅</span><span style="flex:1"><span>Lista para llevar el martes</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+done+' de '+EXPO_CHECK.length+' listas</span></span></button>'
  +'<button class="kbtn white" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="expoLayout()"><span style="font-size:2.2rem">📐</span><span style="flex:1"><span>Cómo armar la cartelera</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Dónde pegar cada hoja</span></span></button>');}
function expoPoster(){setTheme("kid");
 render(topbar("screenExpo()")+subHeader("🖼️ Mi afiche")
  +'<div class="card" style="font-size:.9rem;line-height:1.5"><b>🖨️ Para imprimir:</b> toca el botón y elige <b>«Guardar como PDF»</b> o tu impresora (papel <b>A4 horizontal</b>). Colorea los dibujos, recorta las hojas y pégalas en una cartulina. Las cajas con rayitas son para tus propios dibujos ✏️</div>'
  +'<button class="kbtn green" onclick="expoPrint()">🖨️ Imprimir / guardar PDF</button>'
  +'<div id="afiPrint">'+expoPosterHTML()+'</div>'
  +'<style>@media print{body.printing-afi *{visibility:hidden!important}body.printing-afi #afiPrint,body.printing-afi #afiPrint *{visibility:visible!important}body.printing-afi #afiPrint{position:absolute;left:0;top:0;width:297mm}}</style>');}
function expoPrint(){document.body.classList.add("printing-afi");setTimeout(function(){try{window.print();}catch(e){}setTimeout(function(){document.body.classList.remove("printing-afi");},600);},150);}
function expoPractice(i){setTheme("kid");
 const s=EXPO_SCRIPT[i];if(!s)return screenExpo();
 const last=i===EXPO_SCRIPT.length-1;
 render(topbar("screenExpo()")+'<div class="progressdots">'+dots(EXPO_SCRIPT.length,i)+'</div>'
  +'<p class="center" style="font-family:Fredoka;font-weight:700;margin:2px 0 6px">Parte '+(i+1)+' de '+EXPO_SCRIPT.length+'</p>'
  +'<div class="card center" style="background:#F0FDFA"><div style="font-size:.9rem;color:#0D9488;font-weight:700">'+s.cue+'</div></div>'
  +'<div class="card" style="font-size:1.2rem;line-height:1.55;font-weight:700">'+s.say+'</div>'
  +'<button class="speaker" style="margin:6px auto;display:block" onclick="speakES('+jsStr(s.say)+')">🔊 Escuchar</button>'
  +'<p class="center" style="margin:8px 0;font-weight:700">🗣️ Ahora dilo tú en voz alta, sin leer 😊</p>'
  +(i>0?'<button class="kbtn white" onclick="expoPractice('+(i-1)+')">← Anterior</button>':'')
  +'<button class="kbtn green" onclick="'+(last?"expoDone()":"expoPractice("+(i+1)+")")+'">'+(last?"¡Terminé! 🎉":"Siguiente →")+'</button>');
 setTimeout(function(){try{speakES(s.say);}catch(e){}},450);}
function expoDone(){const p=prof();p.expoPractice=(p.expoPractice||0)+1;p.coins+=5;save();confetti(20);sWIN();toast("¡Practicaste toda tu exposición! +5 🪙",true,2400);screenExpo();}
function expoQA(){setTheme("kid");
 render(topbar("screenExpo()")+subHeader("❓ Preguntas que me pueden hacer")
  +EXPO_QA.map(function(x){return '<details class="card" style="padding:10px 14px"><summary style="cursor:pointer;font-weight:800">'+x[0]+'</summary><p style="margin-top:6px;line-height:1.45;color:#15803D"><b>'+x[1]+'</b></p><button class="speaker small" onclick="speakES('+jsStr(x[0]+" "+x[1])+')">🔊</button></details>';}).join("")
  +'<button class="kbtn green" onclick="startExamUnit(\'reinos\')">🧠 Hacer el quiz</button>');}
function expoChecklist(){setTheme("kid");
 const ck=expoChecks();
 render(topbar("screenExpo()")+subHeader("✅ Lista para el martes")
  +EXPO_CHECK.map(function(t,i){return '<button onclick="expoToggle('+i+')" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:3px solid '+(ck[i]?"#86EFAC":"#E2E8F0")+';background:'+(ck[i]?"#F0FDF4":"#fff")+';border-radius:16px;padding:12px;margin-bottom:8px;cursor:pointer;font-size:1rem;color:#1E293B;font-weight:700"><span style="font-size:1.6rem">'+(ck[i]?"✅":"⬜")+'</span><span style="flex:1">'+t+'</span></button>';}).join(""));}
function expoToggle(i){const ck=expoChecks();ck[i]=!ck[i];save();if(ck[i])sOK();expoChecklist();}
function expoLayout(){setTheme("kid");
 render(topbar("screenExpo()")+subHeader("📐 Cómo armar la cartelera")
  +'<div class="card"><svg viewBox="0 0 320 220" style="width:100%" font-family="Fredoka,Arial,sans-serif" font-weight="700"><rect x="4" y="4" width="312" height="212" rx="10" fill="#FEF3C7" stroke="#F59E0B" stroke-width="4"/>'
  +'<rect x="70" y="12" width="180" height="46" rx="8" fill="#DCFCE7" stroke="#16A34A" stroke-width="3"/><text x="160" y="40" text-anchor="middle" font-size="13" fill="#15803D">1. PORTADA (título)</text>'
  +'<rect x="12" y="68" width="92" height="72" rx="8" fill="#FEE2E2" stroke="#EF4444" stroke-width="3"/><text x="58" y="108" text-anchor="middle" font-size="11" fill="#B91C1C">2. ANIMAL 🐶</text>'
  +'<rect x="114" y="68" width="92" height="72" rx="8" fill="#DCFCE7" stroke="#16A34A" stroke-width="3"/><text x="160" y="108" text-anchor="middle" font-size="11" fill="#15803D">3. VEGETAL 🌳</text>'
  +'<rect x="216" y="68" width="92" height="72" rx="8" fill="#E0E7FF" stroke="#6366F1" stroke-width="3"/><text x="262" y="108" text-anchor="middle" font-size="11" fill="#4338CA">4. MINERAL 💎</text>'
  +'<rect x="40" y="150" width="130" height="58" rx="8" fill="#FEF9C3" stroke="#F59E0B" stroke-width="3"/><text x="105" y="184" text-anchor="middle" font-size="11" fill="#B45309">5. CUADRO 📊</text>'
  +'<rect x="182" y="150" width="100" height="58" rx="8" fill="#F3E8FF" stroke="#A855F7" stroke-width="3" stroke-dasharray="6 4"/><text x="232" y="184" text-anchor="middle" font-size="10" fill="#7E22CE">6. OTROS (opcional)</text></svg></div>'
  +'<div class="card" style="line-height:1.6;font-size:.95rem"><b>Pasos:</b><ol style="margin:4px 0 0 18px"><li>Colorea los dibujos de cada hoja 🖍️</li><li>Recorta las hojas dejando un borde</li><li>Pega primero la <b>portada</b> arriba y luego los <b>tres reinos</b> en fila</li><li>Abajo, el <b>cuadro comparativo</b> (y la hoja opcional)</li><li>Pega con cuidado y deja secar antes de enrollar 🧴</li><li>¡El guion no se pega! Es para practicar 😉</li></ol></div>');}
