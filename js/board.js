"use strict";
/* ============ PIZARRA (cuaderno digital para resolver a mano) ============
   Un botón flotante ✏️ abre una pizarra a pantalla completa donde el niño
   escribe/dibuja con el dedo para resolver los ejercicios. Puede borrar,
   cambiar de color, limpiar y cerrar. El dibujo se conserva al cerrar y
   volver a abrir (para que no pierda su cuenta). */
let WB={},WB_SAVE=null;
const WB_BG="#FCFBF6";
/* la pizarra ya NO flota siempre: se abre desde los ejercicios de mate (botón) y desde la zona de Arte */
function boardFabHide(){var f=document.getElementById("wbfab");if(f)f.remove();}
/* botón compacto de pizarra para poner dentro de los ejercicios */
function boardBtn(){return '<button class="kbtn white" style="margin-top:6px;min-height:52px;font-size:1rem" onclick="openBoard()">✏️ Abrir pizarra (para resolver)</button>';}
/* ===== ZONA DE ARTE Y DIBUJO (todo el dibujo en un solo lugar) ===== */
function screenArt(){setTheme("kid");
 var sub=(typeof subHeader==="function")?subHeader("🎨 Arte y dibujo"):'<h2 style="text-align:center;margin:2px 0 12px">🎨 Arte y dibujo</h2>';
 render(topbar("screenMyStuff()")+sub
  +'<p class="center" style="margin-bottom:14px">Elige una actividad de dibujo</p>'
  +'<button class="kbtn yellow" onclick="gameAiDraw()">✨ Dibuja con IA</button>'
  +'<button class="kbtn purple" onclick="gameColoring()">🖍️ Colorear</button>'
  +'<button class="kbtn blue" onclick="gameDots()">🔢 Une los puntos</button>'
  +'<button class="kbtn green" onclick="gameDrawLesson()">🎨 Cómo dibujar (paso a paso)</button>'
  +'<button class="kbtn red" onclick="gameCursive()">✍️ Letra cursiva</button>'
  +'<button class="kbtn white" onclick="openBoard()">✏️ Pizarra (dibujo libre)</button>');
}
function openBoard(){
 if(document.getElementById("wbov"))return;
 const btn=(txt,fn,extra)=>'<button type="button" onclick="'+fn+'" style="border:none;background:#fff;border-radius:12px;padding:8px 12px;font-family:Fredoka;font-weight:700;font-size:.95rem;box-shadow:0 3px 8px rgba(30,42,74,.15);cursor:pointer;'+(extra||"")+'">'+txt+'</button>';
 const sw=(c)=>'<button type="button" onclick="boardColor(\''+c+'\')" title="color" style="width:34px;height:34px;border-radius:50%;border:3px solid #fff;background:'+c+';box-shadow:0 2px 6px rgba(30,42,74,.25);cursor:pointer"></button>';
 const ov=document.createElement("div");ov.id="wbov";
 ov.style.cssText="position:fixed;inset:0;z-index:300;background:"+WB_BG+";display:flex;flex-direction:column";
 ov.innerHTML='<div style="display:flex;gap:8px;align-items:center;padding:9px 10px;flex-wrap:wrap;background:#fff;box-shadow:0 2px 12px rgba(30,42,74,.12)">'
  +'<b style="font-family:Fredoka;font-size:1rem;color:#1E2A4A;margin-right:6px">✏️ Pizarra</b>'
  +sw("#1E2A4A")+sw("#3B82F6")+sw("#FF6B6B")+sw("#3EC97C")
  +btn("🧽 Borrador","boardTool(\'erase\')","")
  +'<span style="flex:1"></span>'
  +btn("🗑️ Limpiar","boardClear()","")
  +btn("✖ Cerrar","closeBoard()","background:#1E2A4A;color:#fff")
  +'</div>'
  +'<canvas id="wbcanvas" style="flex:1;width:100%;display:block;touch-action:none;background:'+WB_BG+'"></canvas>';
 document.body.appendChild(ov);
 // marcar el borrador con id para el contorno de activo
 const eraseBtns=ov.querySelectorAll("button");eraseBtns.forEach(b=>{if(b.textContent.indexOf("🧽")>=0)b.id="wberase";});
 const cv=document.getElementById("wbcanvas");
 const rect=cv.getBoundingClientRect();const dpr=Math.min(2,window.devicePixelRatio||1);
 cv.width=Math.round(rect.width*dpr);cv.height=Math.round(rect.height*dpr);
 const ctx=cv.getContext("2d");ctx.scale(dpr,dpr);ctx.lineCap="round";ctx.lineJoin="round";
 WB={ctx,cv,color:"#1E2A4A",erase:false,drawing:false,W:rect.width,H:rect.height};
 // líneas de cuaderno suaves
 boardGrid();
 if(WB_SAVE){const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,rect.width,rect.height);img.src=WB_SAVE;}
 const pos=e=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
 cv.addEventListener("pointerdown",e=>{WB.drawing=true;const p=pos(e);WB.ctx.beginPath();WB.ctx.moveTo(p.x,p.y);try{cv.setPointerCapture(e.pointerId);}catch(_){}} );
 cv.addEventListener("pointermove",e=>{if(!WB.drawing)return;const p=pos(e);
  WB.ctx.strokeStyle=WB.erase?WB_BG:WB.color;WB.ctx.lineWidth=WB.erase?28:4.5;
  WB.ctx.lineTo(p.x,p.y);WB.ctx.stroke();WB.ctx.beginPath();WB.ctx.moveTo(p.x,p.y);});
 const stop=()=>{WB.drawing=false;};
 cv.addEventListener("pointerup",stop);cv.addEventListener("pointercancel",stop);cv.addEventListener("pointerleave",stop);
}
function boardGrid(){
 const c=WB.ctx;if(!c)return;c.save();c.strokeStyle="rgba(59,130,246,.10)";c.lineWidth=1;
 for(let y=34;y<WB.H;y+=34){c.beginPath();c.moveTo(0,y);c.lineTo(WB.W,y);c.stroke();}
 c.restore();
}
function boardColor(c){if(WB.ctx){WB.color=c;WB.erase=false;boardEraseUI();}}
function boardTool(t){if(WB.ctx){WB.erase=(t==="erase");boardEraseUI();}}
function boardEraseUI(){const b=document.getElementById("wberase");if(b)b.style.outline=WB.erase?"3px solid #3EC97C":"none";}
function boardClear(){if(WB.ctx){WB.ctx.clearRect(0,0,WB.W+20,WB.H+20);WB.ctx.fillStyle=WB_BG;WB.ctx.fillRect(0,0,WB.W+20,WB.H+20);boardGrid();}}
function closeBoard(){const ov=document.getElementById("wbov");if(!ov)return;try{if(WB.cv)WB_SAVE=WB.cv.toDataURL();}catch(e){}ov.remove();}

/* ============ LETRA CURSIVA (repasar letras guía con el dedo) ============ */
let CU={};
function gameCursive(){setTheme("kid");
 const p=(typeof prof==="function")?prof():null;
 const base=["a","e","i","o","u","m","p","s","l","t","d","n","r","c"];
 const words=["mamá","papá","casa","sol","luna","oso","amo"];
 const name=(p&&p.name)?String(p.name).toLowerCase().slice(0,10):null;
 CU={items:base.concat(words).concat(name?[name]:[]),i:0};
 renderCursive();
}
function renderCursive(){
 const it=CU.items[CU.i];
 render(topbar("screenWritingPick()")
  +'<div class="progressdots">'+dots(CU.items.length,CU.i)+'</div>'
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">✍️ Letra cursiva</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:8px">Pasa el dedo por encima de la letra gris</p>'
  +'<div style="position:relative;width:100%;max-width:460px;margin:0 auto"><canvas id="cucanvas" style="width:100%;display:block;border:2px solid rgba(30,42,74,.1);border-radius:16px;box-shadow:0 8px 20px rgba(30,42,74,.1);touch-action:none;background:#FCFBF6"></canvas></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;max-width:460px;margin:12px auto 0">'
   +'<button class="kbtn white" onclick="speakES(\''+esc(it)+'\')" style="font-size:1rem;min-height:54px">🔊 Oír</button>'
   +'<button class="kbtn yellow" onclick="cuClear()" style="font-size:1rem;min-height:54px">🧽 Limpiar</button>'
   +'<button class="kbtn green" onclick="cuNext()" style="font-size:1rem;min-height:54px">Siguiente →</button>'
  +'</div>');
 const cv=document.getElementById("cucanvas");
 const cssW=cv.clientWidth||360,cssH=Math.round(cssW*0.5);
 const dpr=Math.min(2,window.devicePixelRatio||1);
 cv.style.height=cssH+"px";cv.width=Math.round(cssW*dpr);cv.height=Math.round(cssH*dpr);
 const ctx=cv.getContext("2d");ctx.scale(dpr,dpr);ctx.lineCap="round";ctx.lineJoin="round";
 CU.ctx=ctx;CU.cv=cv;CU.W=cssW;CU.H=cssH;CU.drawing=false;
 cuGuide(it);
 if(window.FontFace&&document.fonts&&document.fonts.load){document.fonts.load("700 40px 'Dancing Script'").then(()=>{if(CU.items[CU.i]===it)cuGuide(it);}).catch(()=>{});}
 const pos=e=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
 cv.addEventListener("pointerdown",e=>{CU.drawing=true;const p=pos(e);ctx.strokeStyle="#3B82F6";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p.x,p.y);try{cv.setPointerCapture(e.pointerId);}catch(_){}} );
 cv.addEventListener("pointermove",e=>{if(!CU.drawing)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);});
 const stop=()=>{CU.drawing=false;};
 cv.addEventListener("pointerup",stop);cv.addEventListener("pointercancel",stop);cv.addEventListener("pointerleave",stop);
 speakES(it);
}
function cuGuide(text){
 const c=CU.ctx,W=CU.W,H=CU.H;if(!c)return;
 c.fillStyle="#FCFBF6";c.fillRect(0,0,W,H);
 const top=H*0.30,mid=H*0.52,base=H*0.74;
 c.strokeStyle="rgba(59,130,246,.30)";c.lineWidth=1.5;
 [top,base].forEach(y=>{c.beginPath();c.moveTo(6,y);c.lineTo(W-6,y);c.stroke();});
 c.setLineDash([6,7]);c.strokeStyle="rgba(59,130,246,.20)";c.beginPath();c.moveTo(6,mid);c.lineTo(W-6,mid);c.stroke();c.setLineDash([]);
 c.fillStyle="rgba(30,42,74,.15)";c.textAlign="center";c.textBaseline="alphabetic";
 let size=H*0.55;c.font="700 "+size+"px 'Dancing Script', cursive";
 let w=c.measureText(text).width;
 while(w>W*0.88&&size>18){size-=4;c.font="700 "+size+"px 'Dancing Script', cursive";w=c.measureText(text).width;}
 c.fillText(text,W/2,base);
}
function cuClear(){if(CU.ctx)cuGuide(CU.items[CU.i]);}
function cuNext(){
 if(typeof recordAnswer==="function")recordAnswer("Letras",true,15);
 sOK();CU.i++;
 if(CU.i>=CU.items.length){confetti(20);toast("¡Terminaste de repasar! ✍️🌟",true,2000);
  if(typeof nodeWin==="function")return setTimeout(()=>nodeWin(3,"Letras"),400);
  return setTimeout(screenWritingPick,600);}
 renderCursive();
}

/* ============ COLOREAR (pinta las zonas sin salirte) ============ */
let CO={color:"#FF6B6B",picIdx:0};
const COLOR_PALETTE=["#FF6B6B","#FF9F1C","#FFC93C","#3EC97C","#3B82F6","#A78BFA","#F472B6","#8B5E3C","#1E2A4A","#FFFFFF"];
function starPts(cx,cy,ro,ri,n){var s="";for(var i=0;i<n*2;i++){var a=Math.PI/n*i-Math.PI/2;var r=(i%2===0)?ro:ri;s+=(cx+r*Math.cos(a)).toFixed(1)+","+(cy+r*Math.sin(a)).toFixed(1)+" ";}return s.trim();}
const COLOR_PICS=[
 {name:"🍎 Manzana",inner:
  '<ellipse class="cr" cx="100" cy="118" rx="60" ry="62" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="95" y="46" width="10" height="28" rx="4" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<ellipse class="cr" cx="126" cy="56" rx="20" ry="10" fill="#fff" stroke="#1E2A4A" stroke-width="3" transform="rotate(-20 126 56)"/>'},
 {name:"🍊 Naranja",inner:
  '<circle class="cr" cx="100" cy="110" r="64" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<ellipse class="cr" cx="120" cy="46" rx="18" ry="9" fill="#fff" stroke="#1E2A4A" stroke-width="3" transform="rotate(-20 120 46)"/>'},
 {name:"🌳 Árbol",inner:
  '<ellipse class="cr" cx="100" cy="185" rx="82" ry="12" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="88" y="115" width="24" height="66" rx="4" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<circle class="cr" cx="100" cy="78" r="56" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'},
 {name:"🌸 Flor",inner:
  '<rect class="cr" x="95" y="108" width="10" height="76" rx="4" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<ellipse class="cr" cx="72" cy="150" rx="22" ry="11" fill="#fff" stroke="#1E2A4A" stroke-width="3" transform="rotate(30 72 150)"/>'
  +[[140,90],[120,126],[80,126],[60,90],[80,54],[120,54]].map(function(p){return '<circle class="cr" cx="'+p[0]+'" cy="'+p[1]+'" r="24" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>';}).join("")
  +'<circle class="cr" cx="100" cy="90" r="24" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'},
 {name:"🐟 Pez",inner:
  '<polygon class="cr" points="150,100 190,64 190,136" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<ellipse class="cr" cx="92" cy="100" rx="64" ry="42" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<polygon class="cr" points="78,60 112,48 108,74" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<polygon class="cr" points="80,140 112,152 106,126" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<path d="M60,72 Q50,100 60,128" fill="none" stroke="#1E2A4A" stroke-width="2.5"/>'
  +'<circle cx="52" cy="90" r="6" fill="#1E2A4A"/>'
  +'<circle class="cr" cx="24" cy="58" r="7" fill="#fff" stroke="#1E2A4A" stroke-width="2.5"/><circle class="cr" cx="13" cy="80" r="5" fill="#fff" stroke="#1E2A4A" stroke-width="2.5"/>'},
 {name:"⭐ Estrella",inner:
  '<polygon class="cr" points="'+starPts(100,102,72,30,5)+'" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'},
 {name:"🏠 Casa",inner:
  '<rect class="cr" x="42" y="94" width="116" height="90" rx="4" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="128" y="48" width="18" height="42" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<polygon class="cr" points="30,94 100,36 170,94" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="86" y="132" width="30" height="52" rx="3" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<circle class="cr" cx="109" cy="158" r="3.5" fill="#fff" stroke="#1E2A4A" stroke-width="2"/>'
  +'<rect class="cr" x="54" y="108" width="30" height="30" rx="3" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="116" y="108" width="30" height="30" rx="3" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<line x1="69" y1="108" x2="69" y2="138" stroke="#1E2A4A" stroke-width="2"/><line x1="54" y1="123" x2="84" y2="123" stroke="#1E2A4A" stroke-width="2"/>'
  +'<line x1="131" y1="108" x2="131" y2="138" stroke="#1E2A4A" stroke-width="2"/><line x1="116" y1="123" x2="146" y2="123" stroke="#1E2A4A" stroke-width="2"/>'},
 {name:"🤖 Robot",inner:
  '<line x1="100" y1="42" x2="100" y2="22" stroke="#1E2A4A" stroke-width="3"/><circle class="cr" cx="100" cy="18" r="7" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="40" y="100" width="16" height="46" rx="6" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="144" y="100" width="16" height="46" rx="6" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="72" y="160" width="18" height="30" rx="5" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="110" y="160" width="18" height="30" rx="5" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="58" y="94" width="84" height="66" rx="12" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="66" y="42" width="68" height="52" rx="10" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<circle class="cr" cx="86" cy="66" r="9" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<circle class="cr" cx="114" cy="66" r="9" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="82" y="80" width="36" height="8" rx="4" fill="#fff" stroke="#1E2A4A" stroke-width="2.5"/>'
  +'<rect class="cr" x="76" y="112" width="48" height="30" rx="6" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<circle class="cr" cx="88" cy="127" r="5" fill="#fff" stroke="#1E2A4A" stroke-width="2"/><circle class="cr" cx="112" cy="127" r="5" fill="#fff" stroke="#1E2A4A" stroke-width="2"/>'},
 {name:"🏎️ Carro",inner:
  '<circle class="cr" cx="60" cy="152" r="24" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<circle class="cr" cx="142" cy="152" r="24" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="20" y="108" width="162" height="48" rx="16" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<polygon class="cr" points="60,108 82,74 128,74 150,108" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<polygon class="cr" points="70,106 86,80 101,80 101,106" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<polygon class="cr" points="109,106 109,80 124,80 140,106" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<circle class="cr" cx="60" cy="152" r="10" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<circle class="cr" cx="142" cy="152" r="10" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<circle class="cr" cx="176" cy="120" r="6" fill="#fff" stroke="#1E2A4A" stroke-width="2.5"/>'
  +'<circle class="cr" cx="26" cy="120" r="6" fill="#fff" stroke="#1E2A4A" stroke-width="2.5"/>'},
 {name:"🚂 Tren",inner:
  '<circle class="cr" cx="60" cy="158" r="18" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<circle class="cr" cx="110" cy="158" r="18" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<circle class="cr" cx="158" cy="158" r="14" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="30" y="96" width="150" height="52" rx="8" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="30" y="58" width="52" height="40" rx="4" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="42" y="68" width="28" height="20" rx="3" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="140" y="66" width="18" height="32" rx="3" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<circle class="cr" cx="149" cy="52" r="10" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<circle class="cr" cx="167" cy="40" r="8" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<circle class="cr" cx="176" cy="112" r="7" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<circle class="cr" cx="60" cy="158" r="7" fill="#fff" stroke="#1E2A4A" stroke-width="2.5"/>'
  +'<circle class="cr" cx="110" cy="158" r="7" fill="#fff" stroke="#1E2A4A" stroke-width="2.5"/>'
  +'<rect class="cr" x="96" y="106" width="24" height="24" rx="3" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'},
 {name:"🦕 Dino",inner:
  '<polygon class="cr" points="52,120 10,92 46,150" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="68" y="140" width="16" height="36" rx="5" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="112" y="140" width="16" height="36" rx="5" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<ellipse class="cr" cx="100" cy="118" rx="58" ry="42" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<ellipse class="cr" cx="100" cy="134" rx="34" ry="20" fill="#fff" stroke="#1E2A4A" stroke-width="2.5"/>'
  +'<circle class="cr" cx="152" cy="84" r="28" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<polygon class="cr" points="70,80 82,58 94,80" fill="#fff" stroke="#1E2A4A" stroke-width="2.5"/><polygon class="cr" points="96,78 108,54 120,78" fill="#fff" stroke="#1E2A4A" stroke-width="2.5"/>'
  +'<circle cx="160" cy="78" r="5" fill="#1E2A4A"/>'}
];
function gameColoring(){setTheme("kid");if(!CO)CO={color:"#FF6B6B",picIdx:0};CO.color="#FF6B6B";renderColoring();}
function renderColoring(){
 var pic=COLOR_PICS[CO.picIdx%COLOR_PICS.length];
 var pal=COLOR_PALETTE.map(function(c){return '<button type="button" onclick="colorSet(\''+c+'\')" aria-label="color" style="width:38px;height:38px;border-radius:50%;border:3px solid '+(CO.color===c?"#1E2A4A":"#fff")+';background:'+c+';box-shadow:0 3px 8px rgba(30,42,74,.2);cursor:pointer"></button>';}).join("");
 render(topbar("screenMyStuff()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:2px">🖍️ Colorear</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:8px">'+pic.name+' — toca un color y pinta cada zona</p>'
  +'<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:10px">'+pal+'</div>'
  +'<div class="card" style="padding:12px"><svg viewBox="0 0 200 200" onclick="colorTap(event)" style="width:100%;max-width:340px;display:block;margin:0 auto;background:#fff;border-radius:12px">'+pic.inner+'</svg></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:360px;margin:0 auto">'
   +'<button class="kbtn yellow" onclick="colorClear()" style="min-height:52px">🧽 Limpiar</button>'
   +'<button class="kbtn green" onclick="colorNext()" style="min-height:52px">Otro dibujo →</button>'
  +'</div>');
}
function colorSet(c){CO.color=c;var btns=document.querySelectorAll('[aria-label="color"]');btns.forEach(function(b,i){b.style.borderColor=(COLOR_PALETTE[i]===CO.color)?"#1E2A4A":"#fff";});}
function colorTap(e){var t=e.target;if(t&&t.classList&&t.classList.contains("cr")){t.setAttribute("fill",CO.color);if(typeof beep==="function")beep([620],.04);}}
function colorClear(){document.querySelectorAll("svg .cr").forEach(function(el){el.setAttribute("fill","#fff");});}
function colorNext(){CO.picIdx=(CO.picIdx+1)%COLOR_PICS.length;renderColoring();}

/* ============ UNE LOS PUNTOS (toca 1,2,3… y se arma la figura) ============ */
let DP={figIdx:0};
const DOT_FIGS=[
 {name:"⭐ Estrella",fill:"#FFC93C",pts:[[100,22],[146,163],[26,76],[174,76],[54,163]]},
 {name:"🏠 Casa",fill:"#FF9F1C",pts:[[42,182],[42,92],[100,42],[158,92],[158,182]]},
 {name:"🐟 Pez",fill:"#3B82F6",pts:[[40,100],[105,62],[150,80],[186,54],[186,146],[150,120],[105,138]]},
 {name:"🚀 Cohete",fill:"#FF6B6B",pts:[[100,24],[128,74],[128,150],[152,182],[128,155],[72,155],[48,182],[72,150],[72,74]]},
 {name:"🚂 Tren",fill:"#3EC97C",pts:[[34,150],[34,98],[60,98],[60,68],[106,68],[106,98],[172,98],[172,150]],wheels:[[64,150,16],[142,150,16]]},
 {name:"🚗 Carro",fill:"#A78BFA",pts:[[28,150],[28,120],[54,120],[78,88],[122,88],[146,120],[172,120],[172,150]],wheels:[[60,150,17],[142,150,17]]}
];
function gameDots(){setTheme("kid");if(!DP)DP={};if(DP.figIdx==null)DP.figIdx=0;startDots();}
function startDots(){
 var fig=DOT_FIGS[DP.figIdx%DOT_FIGS.length];
 render(topbar("screenMyStuff()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:2px">🔢 Une los puntos</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:8px">'+fig.name+' — toca los puntos en orden: 1, 2, 3…</p>'
  +'<div class="card" style="padding:10px"><canvas id="dpcanvas" onclick="dotsTap(event)" style="width:100%;max-width:360px;display:block;margin:0 auto;background:#FCFBF6;border-radius:12px;touch-action:manipulation"></canvas></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:360px;margin:0 auto">'
   +'<button class="kbtn yellow" onclick="startDots()" style="min-height:52px">🔄 Reiniciar</button>'
   +'<button class="kbtn green" onclick="dotsNext()" style="min-height:52px">Otra figura →</button>'
  +'</div>');
 var cv=document.getElementById("dpcanvas");
 var cssW=Math.min(360,cv.clientWidth||320);var dpr=Math.min(2,window.devicePixelRatio||1);
 cv.style.height=cssW+"px";cv.width=Math.round(cssW*dpr);cv.height=Math.round(cssW*dpr);
 var ctx=cv.getContext("2d");ctx.scale(dpr*cssW/200,dpr*cssW/200);ctx.lineCap="round";ctx.lineJoin="round";
 DP.ctx=ctx;DP.cv=cv;DP.S=cssW;DP.fig=fig;DP.next=1;DP.done=false;
 dotsDraw();
}
function dotsDraw(){
 var c=DP.ctx,fig=DP.fig;if(!c)return;
 c.clearRect(0,0,200,200);
 // líneas ya trazadas
 c.strokeStyle="#3B82F6";c.lineWidth=4;
 for(var i=1;i<DP.next&&i<fig.pts.length;i++){c.beginPath();c.moveTo(fig.pts[i-1][0],fig.pts[i-1][1]);c.lineTo(fig.pts[i][0],fig.pts[i][1]);c.stroke();}
 if(DP.done){ // cerrar y rellenar
  c.beginPath();c.moveTo(fig.pts[0][0],fig.pts[0][1]);for(var k=1;k<fig.pts.length;k++)c.lineTo(fig.pts[k][0],fig.pts[k][1]);c.closePath();
  c.fillStyle=fig.fill;c.globalAlpha=.85;c.fill();c.globalAlpha=1;c.stroke();
  if(fig.wheels)fig.wheels.forEach(function(w){c.beginPath();c.arc(w[0],w[1],w[2],0,Math.PI*2);c.fillStyle="#1E2A4A";c.fill();c.fillStyle="#8A94A6";c.beginPath();c.arc(w[0],w[1],w[2]*0.5,0,Math.PI*2);c.fill();});
 }
 // puntos
 for(var j=0;j<fig.pts.length;j++){var p=fig.pts[j];var n=j+1;var isNext=(n===DP.next);var doneP=(n<DP.next);
  c.beginPath();c.arc(p[0],p[1],isNext?11:9,0,Math.PI*2);
  c.fillStyle=doneP?"#3EC97C":(isNext?"#FF6B6B":"#fff");c.fill();c.lineWidth=2.5;c.strokeStyle="#1E2A4A";c.stroke();
  c.fillStyle=doneP?"#fff":"#1E2A4A";c.font="700 11px Fredoka, sans-serif";c.textAlign="center";c.textBaseline="middle";c.fillText(n,p[0],p[1]+0.5);
 }
}
function dotsTap(e){
 if(DP.done)return;var cv=DP.cv;if(!cv)return;
 var r=cv.getBoundingClientRect();var x=(e.clientX-r.left)/r.width*200,y=(e.clientY-r.top)/r.height*200;
 var fig=DP.fig,exp=DP.next-1;var p=fig.pts[exp];
 if(!p)return;
 if(Math.hypot(x-p[0],y-p[1])<22){ // acertó el punto esperado
  DP.next++;if(typeof beep==="function")beep([500+DP.next*60],.05);
  if(DP.next>fig.pts.length){DP.done=true;dotsDraw();sWIN();confetti(22);if(typeof recordAnswer==="function")recordAnswer("Secuencias",true,15);toast("¡Lo lograste! "+fig.name,true,1800);}
  else dotsDraw();
 }
}
function dotsNext(){DP.figIdx=(DP.figIdx+1)%DOT_FIGS.length;startDots();}

/* ============ CLASES DE DIBUJO PASO A PASO (copia la parte azul) ============ */
let DL={figIdx:0,step:0};
const DRAW_FIGS=[
 {name:"🚗 Carro",steps:[
   [{t:"rect",x:30,y:98,w:140,h:44,rx:16}],
   [{t:"poly",p:[[68,98],[88,70],[128,70],[148,98]]}],
   [{t:"line",a:[108,70],b:[108,98]}],
   [{t:"circle",x:62,y:144,r:18},{t:"circle",x:138,y:144,r:18}],
   [{t:"circle",x:40,y:112,r:5},{t:"line",a:[95,105],b:[95,135]}]
 ]},
 {name:"🚂 Tren",steps:[
   [{t:"rect",x:34,y:96,w:150,h:48,rx:6}],
   [{t:"rect",x:34,y:66,w:46,h:32,rx:4}],
   [{t:"rect",x:150,y:70,w:16,h:26,rx:2},{t:"circle",x:158,y:60,r:8}],
   [{t:"circle",x:66,y:146,r:15},{t:"circle",x:150,y:146,r:15}],
   [{t:"rect",x:44,y:74,w:20,h:16,rx:2},{t:"rect",x:96,y:106,w:22,h:22,rx:2}]
 ]},
 {name:"🤖 Robot",steps:[
   [{t:"rect",x:66,y:44,w:68,h:52,rx:10}],
   [{t:"rect",x:58,y:98,w:84,h:64,rx:12}],
   [{t:"line",a:[100,44],b:[100,26]},{t:"circle",x:100,y:22,r:6},{t:"circle",x:86,y:68,r:8},{t:"circle",x:114,y:68,r:8}],
   [{t:"rect",x:40,y:104,w:16,h:44,rx:6},{t:"rect",x:144,y:104,w:16,h:44,rx:6}],
   [{t:"rect",x:72,y:162,w:18,h:30,rx:5},{t:"rect",x:110,y:162,w:18,h:30,rx:5}]
 ]},
 {name:"🐱 Gato",steps:[
   [{t:"circle",x:100,y:54,r:34}],
   [{t:"tri",p:[[72,40],[80,12],[98,38]]},{t:"tri",p:[[128,40],[120,12],[102,38]]}],
   [{t:"poly",p:[[72,78],[66,158],[134,158],[128,78]]},{t:"line",a:[132,150],b:[170,116]}],
   [{t:"circle",x:90,y:52,r:4},{t:"circle",x:110,y:52,r:4},{t:"tri",p:[[96,60],[104,60],[100,68]]},{t:"arc",x:92,y:68,r:9,s:0,e:Math.PI},{t:"arc",x:108,y:68,r:9,s:0,e:Math.PI}],
   [{t:"line",a:[38,56],b:[80,60]},{t:"line",a:[38,66],b:[80,65]},{t:"line",a:[162,56],b:[120,60]},{t:"line",a:[162,66],b:[120,65]},{t:"circle",x:86,y:156,r:9},{t:"circle",x:114,y:156,r:9}]
 ]}
];
function dlShape(c,sh){
 c.beginPath();
 if(sh.t==="circle")c.arc(sh.x,sh.y,sh.r,0,Math.PI*2);
 else if(sh.t==="rect")rrect(c,sh.x,sh.y,sh.w,sh.h,sh.rx||0);
 else if(sh.t==="line"){c.moveTo(sh.a[0],sh.a[1]);c.lineTo(sh.b[0],sh.b[1]);}
 else if(sh.t==="poly"){c.moveTo(sh.p[0][0],sh.p[0][1]);for(var i=1;i<sh.p.length;i++)c.lineTo(sh.p[i][0],sh.p[i][1]);}
 else if(sh.t==="tri"){c.moveTo(sh.p[0][0],sh.p[0][1]);c.lineTo(sh.p[1][0],sh.p[1][1]);c.lineTo(sh.p[2][0],sh.p[2][1]);c.closePath();}
 else if(sh.t==="arc")c.arc(sh.x,sh.y,sh.r,sh.s,sh.e);
 c.stroke();
}
function gameDrawLesson(){setTheme("kid");if(!DL)DL={};if(DL.figIdx==null)DL.figIdx=0;DL.step=0;startDrawLesson();}
function startDrawLesson(){
 var fig=DRAW_FIGS[DL.figIdx%DRAW_FIGS.length];
 render(topbar("screenMyStuff()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:2px">🎨 Cómo dibujar</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:8px">'+fig.name+' — Paso <b><span id="dlstep">1</span> de '+fig.steps.length+'</b>. Copia la parte <span style="color:#3B82F6;font-weight:800">azul</span>.</p>'
  +'<div style="position:relative;width:100%;max-width:340px;margin:0 auto"><canvas id="dlguide" style="width:100%;display:block;border:2px solid rgba(30,42,74,.1);border-radius:14px;background:#FCFBF6"></canvas><canvas id="dldraw" style="position:absolute;left:0;top:0;width:100%;height:100%;touch-action:none"></canvas></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:340px;margin:12px auto 0">'
   +'<button class="kbtn white" onclick="dlPrev()" style="min-height:50px">◀ Atrás</button>'
   +'<button class="kbtn blue" onclick="dlNext()" style="min-height:50px">Siguiente ▶</button>'
   +'<button class="kbtn yellow" onclick="dlClear()" style="min-height:50px">🧽 Limpiar</button>'
   +'<button class="kbtn green" onclick="dlOther()" style="min-height:50px">Otro dibujo →</button>'
  +'</div>');
 var gc=document.getElementById("dlguide"),dc=document.getElementById("dldraw");
 var W=Math.min(340,gc.clientWidth||320),dpr=Math.min(2,window.devicePixelRatio||1);
 gc.style.height=W+"px";dc.style.height=W+"px";
 gc.width=Math.round(W*dpr);gc.height=Math.round(W*dpr);dc.width=Math.round(W*dpr);dc.height=Math.round(W*dpr);
 var gctx=gc.getContext("2d");gctx.scale(dpr*W/200,dpr*W/200);gctx.lineCap="round";gctx.lineJoin="round";
 var dctx=dc.getContext("2d");dctx.scale(dpr,dpr);dctx.lineCap="round";dctx.lineJoin="round";
 DL.gctx=gctx;DL.dctx=dctx;DL.dc=dc;DL.W=W;DL.fig=fig;DL.drawing=false;
 dlGuide();
 var pos=function(e){var r=dc.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
 dc.addEventListener("pointerdown",function(e){DL.drawing=true;var p=pos(e);dctx.strokeStyle="#1E2A4A";dctx.lineWidth=4;dctx.beginPath();dctx.moveTo(p.x,p.y);try{dc.setPointerCapture(e.pointerId);}catch(_){}} );
 dc.addEventListener("pointermove",function(e){if(!DL.drawing)return;var p=pos(e);dctx.lineTo(p.x,p.y);dctx.stroke();dctx.beginPath();dctx.moveTo(p.x,p.y);});
 var stop=function(){DL.drawing=false;};
 dc.addEventListener("pointerup",stop);dc.addEventListener("pointercancel",stop);dc.addEventListener("pointerleave",stop);
}
function dlGuide(){
 var c=DL.gctx,fig=DL.fig;if(!c)return;c.clearRect(0,0,200,200);
 for(var s=0;s<=DL.step;s++){var hi=(s===DL.step);
  c.strokeStyle=hi?"rgba(59,130,246,.95)":"rgba(30,42,74,.16)";c.lineWidth=hi?4:3;
  fig.steps[s].forEach(function(sh){dlShape(c,sh);});
 }
 var el=document.getElementById("dlstep");if(el)el.textContent=DL.step+1;
}
function dlPrev(){if(DL.step>0){DL.step--;dlGuide();}}
function dlNext(){
 if(DL.step<DL.fig.steps.length-1){DL.step++;dlGuide();beep([560],.05);}
 else{confetti(20);if(typeof recordAnswer==="function")recordAnswer("Ordenar",true,15);toast("¡Terminaste tu dibujo! 🎨🌟",true,2000);}
}
function dlClear(){if(DL.dctx&&DL.dc)DL.dctx.clearRect(0,0,DL.W+10,DL.W+10);}
function dlOther(){DL.figIdx=(DL.figIdx+1)%DRAW_FIGS.length;DL.step=0;startDrawLesson();}

/* ============ DIBUJA CON IA (escribe/di algo y Gemini crea el dibujo para colorear) ============ */
let AI={color:"#FF6B6B",erase:false};
function gameAiDraw(){setTheme("kid");
 if(!S.geminiKey){
  return render(topbar("screenMyStuff()")
   +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">✨ Dibuja con IA</h2>'
   +'<div class="card center"><div style="font-size:3rem">🔒</div><p style="font-size:1.05rem;line-height:1.5;margin-top:8px">Este juego crea dibujos nuevos con Inteligencia Artificial.<br>Papá o mamá puede <b>activar la IA</b> aquí mismo (con su correo y contraseña).</p>'
   +(typeof afSetKeyWithParent==="function"?'<button class="kbtn green" style="margin-top:12px" onclick="screenChildAiKey()">🔑 Activar IA</button>':'')
   +'<button class="kbtn white" onclick="screenMyStuff()">Volver</button></div>');
 }
 const chips=["un dinosaurio","un carro de carreras","un gato astronauta","un robot","un tren","un dragón"];
 render(topbar("screenMyStuff()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">✨ Dibuja con IA</h2>'
  +'<p class="center" style="margin-bottom:12px">Escribe qué quieres colorear y la IA lo dibuja</p>'
  +'<input id="aiprompt" type="text" placeholder="Un dinosaurio con sombrero..." style="width:100%;box-sizing:border-box;font-size:1.15rem;padding:14px;border:2px solid rgba(30,42,74,.15);border-radius:14px;font-family:Nunito;font-weight:700;margin-bottom:10px">'
  +'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">'+chips.map(function(c){return '<button class="kbtn white" style="width:auto;display:inline-block;margin:0;padding:8px 14px;font-size:.95rem;min-height:auto" onclick="document.getElementById(\'aiprompt\').value=\''+c+'\'">'+c+'</button>';}).join("")+'</div>'
  +'<div style="display:grid;grid-template-columns:'+(micAvailable?"2fr 1fr":"1fr")+';gap:10px">'
   +'<button class="kbtn green" onclick="aiCreate()">✨ Crear dibujo</button>'
   +(micAvailable()?'<button class="kbtn blue" onclick="aiMic()">🎤 Decirlo</button>':'')
  +'</div>');
}
function aiMic(){
 if(!micAvailable())return;
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition;var rec=new SR();rec.lang="es-CO";rec.interimResults=false;rec.maxAlternatives=1;
 var inp=document.getElementById("aiprompt");if(inp)inp.value="🎤 Escuchando…";
 rec.onresult=function(e){var t=e.results[0][0].transcript;if(inp)inp.value=t;setTimeout(aiCreate,300);};
 rec.onerror=function(){if(inp)inp.value="";};
 try{rec.start();}catch(_){}
}
async function aiCreate(){
 var inp=document.getElementById("aiprompt");var what=inp?(inp.value||"").trim():"";
 if(!what||what.indexOf("🎤")>=0){toast("Escribe qué quieres dibujar 🙂",false,1800);return;}
 setTheme("kid");
 render(topbar("gameAiDraw()")+'<div class="card center" style="padding:44px"><div class="spin" style="font-size:3rem">✨</div><h2 style="margin-top:10px">Dibujando "'+esc(what)+'"…</h2><p class="mut">La IA está creando tu dibujo</p></div>');
 try{
  var url=await geminiImage("Black and white line art coloring page for young children of: "+what+". Show the FULL BODY / complete figure (not just the face or head), whole character visible and centered. Thick clean black outlines only, NO color, NO shading, NO gray, pure white background, simple cute cartoon style, no text or letters.");
  aiShow(url,what);
 }catch(e){toast("No se pudo crear, intenta otra vez",false,2200);gameAiDraw();}
}
function aiShow(url,what){
 setTheme("kid");AI={color:"#FF6B6B",erase:false};
 var pal=COLOR_PALETTE.map(function(c){return '<button type="button" onclick="aiSet(\''+c+'\')" aria-label="aicolor" style="width:34px;height:34px;border-radius:50%;border:3px solid '+(AI.color===c?"#1E2A4A":"#fff")+';background:'+c+';box-shadow:0 2px 6px rgba(30,42,74,.25);cursor:pointer"></button>';}).join("");
 render(topbar("gameAiDraw()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🖍️ Colorea: '+esc(what)+'</h2>'
  +'<p class="center" style="font-size:.85rem;margin-bottom:8px">Toca un color y pinta con el dedo</p>'
  +'<div style="display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin-bottom:8px">'+pal+'<button type="button" onclick="aiEraser()" id="aierase" style="border:none;background:#fff;border-radius:10px;padding:6px 10px;font-family:Fredoka;font-weight:700;box-shadow:0 2px 6px rgba(30,42,74,.2);cursor:pointer">🧽</button></div>'
  +'<div class="card" style="padding:8px"><div id="aistage" style="position:relative;max-width:340px;margin:0 auto"><img id="aiimg" src="'+url+'" alt="dibujo" style="width:100%;display:block;border-radius:10px"><canvas id="aidraw" style="position:absolute;left:0;top:0;width:100%;height:100%;mix-blend-mode:multiply;touch-action:none"></canvas></div></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:340px;margin:0 auto">'
   +'<button class="kbtn yellow" onclick="aiClearPaint()" style="min-height:50px">🧽 Limpiar</button>'
   +'<button class="kbtn green" onclick="gameAiDraw()" style="min-height:50px">✨ Otro dibujo</button>'
  +'</div>');
 var img=document.getElementById("aiimg");
 var setup=function(){var cv=document.getElementById("aidraw");if(!cv||!img)return;var w=img.clientWidth||300,h=img.clientHeight||300;var dpr=Math.min(2,window.devicePixelRatio||1);
  cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);var ctx=cv.getContext("2d");ctx.scale(dpr,dpr);ctx.lineCap="round";ctx.lineJoin="round";AI.ctx=ctx;AI.cv=cv;AI.w=w;AI.h=h;
  var pos=function(e){var r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*w,y:(e.clientY-r.top)/r.height*h};};
  cv.addEventListener("pointerdown",function(e){AI.drawing=true;var p=pos(e);ctx.globalCompositeOperation=AI.erase?"destination-out":"source-over";ctx.strokeStyle=AI.color;ctx.lineWidth=AI.erase?26:16;ctx.beginPath();ctx.moveTo(p.x,p.y);try{cv.setPointerCapture(e.pointerId);}catch(_){}} );
  cv.addEventListener("pointermove",function(e){if(!AI.drawing)return;var p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);});
  var stop=function(){AI.drawing=false;};cv.addEventListener("pointerup",stop);cv.addEventListener("pointercancel",stop);cv.addEventListener("pointerleave",stop);
 };
 if(img.complete&&img.clientWidth)setup();else img.onload=setup;
}
function aiSet(c){AI.color=c;AI.erase=false;var b=document.getElementById("aierase");if(b)b.style.outline="none";document.querySelectorAll('[aria-label="aicolor"]').forEach(function(el,i){el.style.borderColor=(COLOR_PALETTE[i]===c)?"#1E2A4A":"#fff";});}
function aiEraser(){AI.erase=true;var b=document.getElementById("aierase");if(b)b.style.outline="3px solid #3EC97C";}
function aiClearPaint(){if(AI.ctx&&AI.cv){AI.ctx.save();AI.ctx.globalCompositeOperation="destination-out";AI.ctx.fillRect(0,0,AI.w+20,AI.h+20);AI.ctx.restore();}}
