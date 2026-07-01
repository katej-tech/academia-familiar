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
