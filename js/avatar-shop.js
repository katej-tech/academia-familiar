"use strict";
/* ============ AVATAR PERSONALIZABLE + TIENDA ============ */
const AV_SKINS=["#FFE0C2","#F1C27D","#C68642","#8D5524"];
const AV_SHIRTS=["#FF6B6B","#3B82F6","#3EC97C","#FFC93C","#A78BFA","#EC4899"];
const SHOP_ITEMS=[
 // sombreros
 {id:"h_gorra",t:"hat",e:"🧢",n:"Gorra",pr:30},{id:"h_corona",t:"hat",e:"👑",n:"Corona",pr:80},
 {id:"h_mago",t:"hat",e:"🎩",n:"Sombrero de mago",pr:50},{id:"h_grad",t:"hat",e:"🎓",n:"Birrete",pr:40},
 {id:"h_casco",t:"hat",e:"⛑️",n:"Casco",pr:35},{id:"h_fiesta",t:"hat",e:"🎉",n:"Gorro de fiesta",pr:30},
 // accesorios
 {id:"a_gafas",t:"acc",e:"🕶️",n:"Gafas geniales",pr:25},{id:"a_guitarra",t:"acc",e:"🎸",n:"Guitarra",pr:45},
 {id:"a_balon",t:"acc",e:"⚽",n:"Balón",pr:25},{id:"a_patineta",t:"acc",e:"🛹",n:"Patineta",pr:40},
 {id:"a_varita",t:"acc",e:"🪄",n:"Varita mágica",pr:50},{id:"a_mochila",t:"acc",e:"🎒",n:"Mochila",pr:20},
 // fondos
 {id:"b_castillo",t:"bg",e:"🏰",n:"Castillo",pr:60},{id:"b_volcan",t:"bg",e:"🌋",n:"Volcán",pr:70},
 {id:"b_isla",t:"bg",e:"🏝️",n:"Isla",pr:60},{id:"b_cohete",t:"bg",e:"🚀",n:"Espacio",pr:90},
 {id:"b_arcoiris",t:"bg",e:"🌈",n:"Arcoíris",pr:50},{id:"b_campamento",t:"bg",e:"⛺",n:"Campamento",pr:50},
 // mascotas legendarias
 {id:"p_uni",t:"pet",e:"🦄",n:"Unicornio Real",pr:200},{id:"p_dragon",t:"pet",e:"🐲",n:"Dragón Celeste",pr:300},
 {id:"p_fenix",t:"pet",e:"🦅",n:"Fénix Dorado",pr:350},{id:"p_lobo",t:"pet",e:"🐺",n:"Lobo Lunar",pr:250},
 {id:"p_leon",t:"pet",e:"🦁",n:"León Estelar",pr:500}];
const SHOP_CATS=[["hat","🎩 Sombreros"],["acc","🎸 Accesorios"],["bg","🌈 Fondos"],["pet","✨ Mascotas legendarias"]];
function shopItem(id){return SHOP_ITEMS.find(x=>x.id===id);}
function avState(){const p=prof();
 if(!p.avatar)p.avatar={};
 const a=p.avatar;
 if(!a.skin)a.skin=AV_SKINS[0];
 if(!a.shirt)a.shirt=AV_SHIRTS[1];
 if(a.hat===undefined)a.hat=null;
 if(a.acc===undefined)a.acc=null;
 if(a.bg===undefined)a.bg=null;
 if(!p.owned)p.owned=[];
 return a;}
function legendaryPet(){const p=prof();if(!p||!p.activePet)return null;const it=shopItem(p.activePet);return it?{e:it.e,n:it.n}:null;}
/* Personaje de CUERPO COMPLETO en SVG: la gorra se ancla a la cabeza y el accesorio a la mano */
function avatarHTML(px){const a=avState();const h=Math.round(px*1.45);
 const svg='<svg viewBox="0 0 120 174" style="width:100%;height:100%;position:relative;z-index:1;display:block">'
 +'<ellipse cx="60" cy="166" rx="34" ry="6" fill="rgba(30,42,74,.18)"/>'
 +'<rect x="44" y="116" width="13" height="36" rx="6" fill="#39466B"/>'
 +'<rect x="63" y="116" width="13" height="36" rx="6" fill="#39466B"/>'
 +'<ellipse cx="50" cy="156" rx="11" ry="6" fill="#1E2A4A"/>'
 +'<ellipse cx="70" cy="156" rx="11" ry="6" fill="#1E2A4A"/>'
 +'<rect x="25" y="72" width="12" height="38" rx="6" fill="'+a.shirt+'" stroke="#1E2A4A" stroke-width="2.5"/>'
 +'<rect x="83" y="72" width="12" height="38" rx="6" fill="'+a.shirt+'" stroke="#1E2A4A" stroke-width="2.5"/>'
 +'<circle cx="31" cy="113" r="7" fill="'+a.skin+'" stroke="#1E2A4A" stroke-width="2.5"/>'
 +'<circle cx="89" cy="113" r="7" fill="'+a.skin+'" stroke="#1E2A4A" stroke-width="2.5"/>'
 +'<rect x="36" y="66" width="48" height="56" rx="16" fill="'+a.shirt+'" stroke="#1E2A4A" stroke-width="3"/>'
 +'<circle cx="60" cy="36" r="27" fill="'+a.skin+'" stroke="#1E2A4A" stroke-width="3"/>'
 +'<circle cx="50" cy="32" r="3.4" fill="#1E2A4A"/><circle cx="70" cy="32" r="3.4" fill="#1E2A4A"/>'
 +'<path d="M50 44 Q60 53 70 44" stroke="#1E2A4A" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
 +'<circle cx="43" cy="40" r="3.2" fill="rgba(255,107,107,.45)"/><circle cx="77" cy="40" r="3.2" fill="rgba(255,107,107,.45)"/>'
 +'</svg>';
 return '<span style="position:relative;display:inline-block;width:'+px+'px;height:'+h+'px;vertical-align:middle">'
 +(a.bg?'<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:'+Math.round(px*0.95)+'px;opacity:.4;z-index:0">'+a.bg+'</span>':'')
 +svg
 +(a.hat?'<span style="position:absolute;left:50%;top:-'+Math.round(h*0.085)+'px;transform:translateX(-50%) rotate(-6deg);font-size:'+Math.round(px*0.42)+'px;line-height:1;z-index:2">'+a.hat+'</span>':'')
 +(a.acc?'<span style="position:absolute;left:'+Math.round(px*0.63)+'px;top:'+Math.round(h*0.57)+'px;font-size:'+Math.round(px*0.38)+'px;line-height:1;z-index:2">'+a.acc+'</span>':'')
 +'</span>';}
function screenAvatar(){setTheme("kid");
 const p=prof(),a=avState();
 const ownedBy=t=>p.owned.map(shopItem).filter(x=>x&&x.t===t);
 const eqBtns=(t,key)=>{const its=ownedBy(t);
  if(!its.length)return '<p class="mut" style="font-size:.9rem;margin:4px 0">Aún no tienes — ¡cómpralos en la tienda! 🛍️</p>';
  return '<div style="display:flex;flex-wrap:wrap;gap:10px;margin:6px 0">'+its.map(it=>
   '<button class="kbtn '+(a[key]===it.e?'green':'white')+'" style="display:inline-block;width:auto;margin:0;padding:10px 14px;font-size:1.6rem" onclick="avEquip(\''+it.id+'\')">'+it.e+(a[key]===it.e?' ✓':'')+'</button>').join("")+'</div>';};
 const swatch=(colors,key,fn)=>'<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:6px">'
  +colors.map(c=>'<button onclick="'+fn+'(\''+c.replace("#","%23")+'\')" style="width:52px;height:52px;border-radius:50%;border:4px solid var(--kid-ink);background:'+c+';box-shadow:0 4px 0 rgba(30,42,74,.7);'+(a[key]===c?'outline:4px solid var(--kid-green);':'')+'"></button>').join("")+'</div>';
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">😎 Mi personaje</h2>'
 +'<div class="card center" style="padding:20px">'+avatarHTML(150)+'</div>'
 +'<div class="card"><b>🖐️ Tu piel</b>'+swatch(AV_SKINS,"skin","avSetSkin")+'</div>'
 +'<div class="card"><b>👕 Tu camiseta</b>'+swatch(AV_SHIRTS,"shirt","avSetShirt")+'</div>'
 +'<div class="card"><b>🎩 Sombrero</b>'+eqBtns("hat","hat")+'</div>'
 +'<div class="card"><b>🎸 Accesorio</b>'+eqBtns("acc","acc")+'</div>'
 +'<div class="card"><b>🌈 Fondo</b>'+eqBtns("bg","bg")+'</div>'
 +'<button class="kbtn yellow" onclick="screenShop()">🛍️ Ir a la tienda</button>');}
function avSetSkin(c){avState().skin=decodeURIComponent(c);save();sOK();screenAvatar();}
function avSetShirt(c){avState().shirt=decodeURIComponent(c);save();sOK();screenAvatar();}
function avEquip(id){const it=shopItem(id),a=avState();
 if(!it)return;
 const key=it.t==="hat"?"hat":it.t==="acc"?"acc":"bg";
 a[key]=a[key]===it.e?null:it.e; // tocar de nuevo lo quita
 save();beep([600],.08);screenAvatar();}
function screenShop(){setTheme("kid");
 const p=prof();avState();
 const cats=SHOP_CATS.map(([t,title])=>{
  const items=SHOP_ITEMS.filter(x=>x.t===t).map(it=>{
   const owned=p.owned.includes(it.id)||(p.legendaries||[]).includes(it.id);
   const active=p.activePet===it.id;
   let btn;
   if(!owned)btn='<button class="kbtn yellow" style="margin:8px 0 0;min-height:48px;font-size:1rem" onclick="shopBuy(\''+it.id+'\')">Comprar · '+it.pr+' 🪙</button>';
   else if(it.t==="pet")btn='<button class="kbtn '+(active?'green':'white')+'" style="margin:8px 0 0;min-height:48px;font-size:1rem" onclick="shopPet(\''+it.id+'\')">'+(active?'✓ Te acompaña':'Llevar conmigo')+'</button>';
   else btn='<button class="kbtn white" style="margin:8px 0 0;min-height:48px;font-size:1rem" onclick="avEquipFromShop(\''+it.id+'\')">Equipar 😎</button>';
   return '<div style="text-align:center;padding:12px;border-radius:18px;border:4px solid var(--kid-ink);background:'+(owned?"#EFFFF3":"#FFF")+';box-shadow:0 5px 0 rgba(30,42,74,.7)">'
    +'<div style="font-size:clamp(2.4rem,11vw,3.2rem)">'+it.e+'</div>'
    +'<div style="font-family:Fredoka;font-weight:700;font-size:.85rem">'+it.n+'</div>'+btn+'</div>';}).join("");
  return '<div class="card"><b style="font-size:1.1rem">'+title+'</b><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:10px">'+items+'</div></div>';}).join("");
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:2px">🛍️ La tienda</h2>'
 +'<p class="center" style="margin-bottom:12px">Tienes <b>'+p.coins+' 🪙</b> — gana más jugando y aprendiendo</p>'
 +'<div class="card center" style="padding:14px">'+avatarHTML(90)+'<br><button class="kbtn blue" style="margin-top:10px" onclick="screenAvatar()">😎 Personalizar mi personaje</button></div>'
 +cats);}
function shopBuy(id){const it=shopItem(id),p=prof();
 if(!it)return;
 if(p.coins<it.pr){sNO();toast("Te faltan "+(it.pr-p.coins)+" 🪙 — ¡sigue jugando!",false,1800);return;}
 p.coins-=it.pr;
 if(it.t==="pet"){if(!p.legendaries)p.legendaries=[];p.legendaries.push(id);p.activePet=id;}
 else p.owned.push(id);
 save();sWIN();confetti(24);toast("¡"+it.n+" es tuyo! 🎉",true,1500);
 setTimeout(screenShop,600);}
function shopPet(id){const p=prof();p.activePet=p.activePet===id?null:id;save();beep([600],.08);screenShop();}
function avEquipFromShop(id){const it=shopItem(id),a=avState();
 const key=it.t==="hat"?"hat":it.t==="acc"?"acc":"bg";
 a[key]=it.e;save();sOK();toast("¡Equipado! 😎",true,1000);screenShop();}
