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
