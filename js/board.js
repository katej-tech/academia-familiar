"use strict";
/* ============ PIZARRA (cuaderno digital para resolver a mano) ============
   Un botón flotante ✏️ abre una pizarra a pantalla completa donde el niño
   escribe/dibuja con el dedo para resolver los ejercicios. Puede borrar,
   cambiar de color, limpiar y cerrar. El dibujo se conserva al cerrar y
   volver a abrir (para que no pierda su cuenta). */
let WB={},WB_SAVE=null;
const WB_BG="#FCFBF6";
/* botón flotante: aparece solo en las pantallas del niño */
function boardFab(theme){
 let f=document.getElementById("wbfab");
 if(!f){
  f=document.createElement("button");f.id="wbfab";f.type="button";
  f.innerHTML='<span style="font-size:1.5rem">✏️</span>';
  f.setAttribute("aria-label","Pizarra");f.onclick=openBoard;
  f.style.cssText="position:fixed;right:14px;bottom:16px;z-index:150;width:58px;height:58px;border-radius:50%;border:none;"
   +"background-color:var(--kid-yellow);background-image:linear-gradient(180deg,rgba(255,255,255,.3),rgba(0,0,0,.06));"
   +"box-shadow:0 6px 16px rgba(30,42,74,.32);cursor:pointer;display:flex;align-items:center;justify-content:center";
  document.body.appendChild(f);
 }
 f.style.display=(theme==="kid")?"flex":"none";
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
  '<polygon class="cr" points="150,100 188,66 188,134" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<ellipse class="cr" cx="94" cy="100" rx="62" ry="40" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<polygon class="cr" points="80,62 110,50 110,72" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<circle cx="66" cy="90" r="7" fill="#1E2A4A"/>'},
 {name:"⭐ Estrella",inner:
  '<polygon class="cr" points="'+starPts(100,102,72,30,5)+'" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'},
 {name:"🏠 Casa",inner:
  '<rect class="cr" x="45" y="92" width="110" height="90" rx="4" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<polygon class="cr" points="33,92 100,34 167,92" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="88" y="130" width="28" height="52" rx="3" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="56" y="106" width="26" height="26" rx="3" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="118" y="106" width="26" height="26" rx="3" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'},
 {name:"🤖 Robot",inner:
  '<line x1="100" y1="42" x2="100" y2="22" stroke="#1E2A4A" stroke-width="3"/><circle class="cr" cx="100" cy="18" r="7" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="40" y="100" width="16" height="46" rx="6" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="144" y="100" width="16" height="46" rx="6" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="72" y="160" width="18" height="30" rx="5" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="110" y="160" width="18" height="30" rx="5" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="58" y="94" width="84" height="66" rx="12" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="66" y="42" width="68" height="52" rx="10" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<circle class="cr" cx="86" cy="66" r="9" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<circle class="cr" cx="114" cy="66" r="9" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'},
 {name:"🏎️ Carro",inner:
  '<circle class="cr" cx="62" cy="150" r="22" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<circle class="cr" cx="140" cy="150" r="22" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="26" y="112" width="150" height="42" rx="16" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<polygon class="cr" points="68,112 88,80 128,80 148,112" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'},
 {name:"🦕 Dino",inner:
  '<polygon class="cr" points="52,120 12,96 48,146" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<rect class="cr" x="70" y="140" width="16" height="34" rx="5" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<rect class="cr" x="112" y="140" width="16" height="34" rx="5" fill="#fff" stroke="#1E2A4A" stroke-width="3"/>'
  +'<ellipse class="cr" cx="100" cy="120" rx="56" ry="40" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<circle class="cr" cx="150" cy="86" r="28" fill="#fff" stroke="#1E2A4A" stroke-width="4"/>'
  +'<circle cx="158" cy="80" r="5" fill="#1E2A4A"/>'}
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
