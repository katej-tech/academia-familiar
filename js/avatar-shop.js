"use strict";
/* ============ AVATAR PERSONALIZABLE + TIENDA ============ */
const AV_BASES=["🧒","👦","👧","🧑","🦸","🦹","🧙","🥷","🤖","🦖"];
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
 if(!p.avatar)p.avatar={base:"🧒",hat:null,acc:null,bg:null};
 if(!p.owned)p.owned=[];
 return p.avatar;}
function legendaryPet(){const p=prof();if(!p||!p.activePet)return null;const it=shopItem(p.activePet);return it?{e:it.e,n:it.n}:null;}
function avatarHTML(px){const a=avState();
 return '<span style="position:relative;display:inline-block;width:'+px+'px;height:'+px+'px;line-height:'+px+'px;font-size:'+Math.round(px*0.6)+'px;text-align:center;vertical-align:middle">'
 +(a.bg?'<span style="position:absolute;inset:0;font-size:'+Math.round(px*0.92)+'px;line-height:'+px+'px;opacity:.5">'+a.bg+'</span>':'')
 +'<span style="position:relative;z-index:1">'+a.base+'</span>'
 +(a.hat?'<span style="position:absolute;left:50%;top:-'+Math.round(px*0.16)+'px;transform:translateX(-50%) rotate(-8deg);font-size:'+Math.round(px*0.38)+'px;line-height:1;z-index:2">'+a.hat+'</span>':'')
 +(a.acc?'<span style="position:absolute;right:-'+Math.round(px*0.06)+'px;bottom:0;font-size:'+Math.round(px*0.36)+'px;line-height:1;z-index:2">'+a.acc+'</span>':'')
 +'</span>';}
function screenAvatar(){setTheme("kid");
 const p=prof(),a=avState();
 const ownedBy=t=>p.owned.map(shopItem).filter(x=>x&&x.t===t);
 const eqBtns=(t,key)=>{const its=ownedBy(t);
  if(!its.length)return '<p class="mut" style="font-size:.9rem;margin:4px 0">Aún no tienes — ¡cómpralos en la tienda! 🛍️</p>';
  return '<div style="display:flex;flex-wrap:wrap;gap:10px;margin:6px 0">'+its.map(it=>
   '<button class="kbtn '+(a[key]===it.e?'green':'white')+'" style="display:inline-block;width:auto;margin:0;padding:10px 14px;font-size:1.6rem" onclick="avEquip(\''+it.id+'\')">'+it.e+(a[key]===it.e?' ✓':'')+'</button>').join("")+'</div>';};
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">😎 Mi personaje</h2>'
 +'<div class="card center" style="padding:26px">'+avatarHTML(140)+'</div>'
 +'<div class="card"><b>Tu cara</b><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:6px">'
 +AV_BASES.map(b=>'<button class="kbtn '+(a.base===b?'green':'white')+'" style="display:inline-block;width:auto;margin:0;padding:10px 14px;font-size:1.6rem" onclick="avSetBase(\''+b+'\')">'+b+'</button>').join("")+'</div></div>'
 +'<div class="card"><b>🎩 Sombrero</b>'+eqBtns("hat","hat")+'</div>'
 +'<div class="card"><b>🎸 Accesorio</b>'+eqBtns("acc","acc")+'</div>'
 +'<div class="card"><b>🌈 Fondo</b>'+eqBtns("bg","bg")+'</div>'
 +'<button class="kbtn yellow" onclick="screenShop()">🛍️ Ir a la tienda</button>');}
function avSetBase(b){avState().base=b;save();sOK();screenAvatar();}
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
