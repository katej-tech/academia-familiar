"use strict";
/* ============ AVATAR DICEBEAR (estilo avataaars) + TIENDA ============ */
/* El personaje se genera con DiceBear (open source, MIT): https://github.com/dicebear/dicebear
   El SVG se descarga una vez y se guarda en el perfil → funciona offline después. */

const DB_API="https://api.dicebear.com/9.x/avataaars/svg";
const AV_SKINS=["614335","ae5d29","d08b5b","edb98a","fd9841","ffdbb4","f8d25c"];
const AV_HAIR_STYLES=[["shortFlat","Clásico"],["shortRound","Redondito"],["shortWaved","Ondulado"],["shortCurly","Rizos cortos"],["theCaesar","César"],["curly","Rizado"],["fro","Afro"],["frizzle","Despeinado"],["bob","Bob"],["bun","Moño"],["longButNotTooLong","Largo"],["dreads01","Rastas"]];
const AV_HAIR_COLORS=["2c1b18","4a312c","724133","a55728","b58143","d6b370","c93305","e8e1e1","ecdcbf","f59797"];
const AV_EYES=[["default","Normal"],["happy","Feliz"],["hearts","Enamorado"],["squint","Pícaro"],["surprised","Sorprendido"],["wink","Guiño"]];
const AV_MOUTHS=[["smile","Sonrisa"],["default","Normal"],["twinkle","Tierna"],["eating","Comiendo"],["tongue","Lengua"],["serious","Serio"]];
const AV_CLOTHES=[["hoodie","Buzo"],["graphicShirt","Camiseta estampada"],["shirtCrewNeck","Camiseta"],["overall","Overol"],["blazerAndShirt","Blazer"],["collarAndSweater","Suéter"]];
const AV_CLOTHES_COLORS=["ff5c5c","5199e4","a7ffc4","ffffb1","ff488e","929598","25557c","ffdeb5"];
const AV_HAT_COLORS=["c93305","2c1b18","4a312c","724133","a55728","b58143","d6b370","e8e1e1","f59797","ecdcbf"];

const SHOP_ITEMS=[
 // gorros (DiceBear "top") — el color se cambia de verdad con hatColor
 {id:"h_hat",t:"hat",e:"🤠",n:"Sombrero aventurero",pr:40,db:"hat"},
 {id:"h_win1",t:"hat",e:"🥶",n:"Gorro polar",pr:30,db:"winterHat1"},
 {id:"h_win2",t:"hat",e:"🧢",n:"Gorro de lana",pr:30,db:"winterHat02"},
 {id:"h_win3",t:"hat",e:"🎿",n:"Gorro esquiador",pr:35,db:"winterHat03"},
 {id:"h_win4",t:"hat",e:"❄️",n:"Gorro con pompón",pr:35,db:"winterHat04"},
 {id:"h_turb",t:"hat",e:"🧞",n:"Turbante",pr:50,db:"turban"},
 // gafas (DiceBear "accessories") — van en la cara de verdad
 {id:"g_round",t:"face",e:"🤓",n:"Gafas redondas",pr:25,db:"round"},
 {id:"g_sun",t:"face",e:"🕶️",n:"Gafas de sol",pr:30,db:"sunglasses"},
 {id:"g_way",t:"face",e:"😎",n:"Wayfarer",pr:30,db:"wayfarers"},
 {id:"g_p1",t:"face",e:"👓",n:"Gafas clásicas",pr:25,db:"prescription01"},
 {id:"g_p2",t:"face",e:"🧐",n:"Gafas modernas",pr:25,db:"prescription02"},
 {id:"g_kurt",t:"face",e:"🎸",n:"Gafas de rockstar",pr:45,db:"kurt"},
 {id:"g_pirata",t:"face",e:"🏴‍☠️",n:"Parche pirata",pr:40,db:"eyepatch"},
 // compañeros de mano (se muestran junto al personaje)
 {id:"a_guitarra",t:"hand",e:"🎸",n:"Guitarra",pr:45},{id:"a_balon",t:"hand",e:"⚽",n:"Balón",pr:25},
 {id:"a_patineta",t:"hand",e:"🛹",n:"Patineta",pr:40},{id:"a_varita",t:"hand",e:"🪄",n:"Varita mágica",pr:50},
 {id:"a_mochila",t:"hand",e:"🎒",n:"Mochila",pr:20},{id:"a_robot",t:"hand",e:"🤖",n:"Mini robot",pr:60},
 {id:"a_cometa",t:"hand",e:"🪁",n:"Cometa",pr:30},{id:"a_patines",t:"hand",e:"🛼",n:"Patines",pr:40},
 {id:"a_control",t:"hand",e:"🎮",n:"Control de juegos",pr:55},{id:"a_dino",t:"hand",e:"🦖",n:"Dino bebé",pr:70},
 {id:"a_loro",t:"hand",e:"🦜",n:"Loro parlanchín",pr:65},{id:"a_basket",t:"hand",e:"🏀",n:"Balón de básquet",pr:30},
 {id:"a_trompeta",t:"hand",e:"🎺",n:"Trompeta",pr:50},{id:"a_espada",t:"hand",e:"⚔️",n:"Espada de héroe",pr:75},
 {id:"a_globo",t:"hand",e:"🎈",n:"Globo",pr:20},{id:"a_helado",t:"hand",e:"🍦",n:"Helado",pr:25},
 {id:"a_libro",t:"hand",e:"📖",n:"Libro mágico",pr:35},{id:"a_micro",t:"hand",e:"🎤",n:"Micrófono",pr:45},
 {id:"a_camara",t:"hand",e:"📷",n:"Cámara",pr:40},{id:"a_pincel",t:"hand",e:"🖌️",n:"Pincel de artista",pr:35},
 {id:"a_lupa",t:"hand",e:"🔍",n:"Lupa detective",pr:30},{id:"a_cohete2",t:"hand",e:"🚀",n:"Cohete de juguete",pr:80},
 {id:"a_gatito",t:"hand",e:"🐱",n:"Gatito",pr:60},{id:"a_perrito",t:"hand",e:"🐶",n:"Perrito",pr:60},
 // fondos degradados (DiceBear backgroundColor)
 {id:"b_castillo",t:"bg",e:"🏰",n:"Castillo",pr:60,db:["b6e3f4","c0aede"]},
 {id:"b_volcan",t:"bg",e:"🌋",n:"Volcán",pr:70,db:["ffdfbf","ff8a80"]},
 {id:"b_isla",t:"bg",e:"🏝️",n:"Isla",pr:60,db:["a7ffc4","65c9ff"]},
 {id:"b_cohete",t:"bg",e:"🚀",n:"Espacio",pr:90,db:["25557c","c0aede"]},
 {id:"b_arcoiris",t:"bg",e:"🌈",n:"Arcoíris",pr:50,db:["ffafb9","b1e2ff"]},
 {id:"b_campamento",t:"bg",e:"⛺",n:"Campamento",pr:50,db:["d1d4f9","a7ffc4"]},
 {id:"b_bosque",t:"bg",e:"🌲",n:"Bosque",pr:60,db:["a7ffc4","2e7d32"]},
 {id:"b_noche",t:"bg",e:"🌃",n:"Ciudad de noche",pr:80,db:["25557c","1a237e"]},
 {id:"b_desierto",t:"bg",e:"🏜️",n:"Desierto",pr:55,db:["ffdeb5","ff8a80"]},
 {id:"b_oceano",t:"bg",e:"🌊",n:"Fondo del mar",pr:70,db:["65c9ff","25557c"]},
 {id:"b_fuegos",t:"bg",e:"🎆",n:"Fuegos artificiales",pr:100,db:["c0aede","ff488e"]},
 {id:"b_nieve",t:"bg",e:"❄️",n:"Montaña nevada",pr:60,db:["e6f1fb","b5d4f4"]},
 {id:"b_jungla",t:"bg",e:"🌴",n:"Jungla",pr:65,db:["a7ffc4","0f6e56"]},
 {id:"b_galaxia",t:"bg",e:"🌌",n:"Galaxia",pr:110,db:["534ab7","26215c"]},
 {id:"b_dulce",t:"bg",e:"🍭",n:"Mundo de dulces",pr:75,db:["ffafb9","f4c0d1"]},
 {id:"b_estadio",t:"bg",e:"🏟️",n:"Estadio",pr:70,db:["a7ffc4","378add"]},
 {id:"b_atardecer",t:"bg",e:"🌅",n:"Atardecer",pr:80,db:["ffc975","ff488e"]},
 // mascotas legendarias (las más caras toman tiempo)
 {id:"p_uni",t:"pet",e:"🦄",n:"Unicornio Real",pr:200},{id:"p_dragon",t:"pet",e:"🐲",n:"Dragón Celeste",pr:300},
 {id:"p_fenix",t:"pet",e:"🦅",n:"Fénix Dorado",pr:350},{id:"p_lobo",t:"pet",e:"🐺",n:"Lobo Lunar",pr:250},
 {id:"p_leon",t:"pet",e:"🦁",n:"León Estelar",pr:500},
 {id:"p_kraken",t:"pet",e:"🐙",n:"Kraken del Abismo",pr:650},{id:"p_mamut",t:"pet",e:"🦣",n:"Mamut Helado",pr:700},
 {id:"p_ballena",t:"pet",e:"🐳",n:"Ballena Cósmica",pr:850},{id:"p_pavo",t:"pet",e:"🦚",n:"Pavo Real Místico",pr:600},
 {id:"p_tigre",t:"pet",e:"🐯",n:"Tigre de Fuego",pr:900},{id:"p_grifo",t:"pet",e:"🦅",n:"Grifo Dorado",pr:1000},
 {id:"p_panda",t:"pet",e:"🐼",n:"Panda Guardián",pr:400},{id:"p_zorro",t:"pet",e:"🦊",n:"Zorro Místico",pr:300},
 {id:"p_buho",t:"pet",e:"🦉",n:"Búho Sabio",pr:350},{id:"p_serpiente",t:"pet",e:"🐍",n:"Serpiente Esmeralda",pr:450},
 {id:"p_pinguino",t:"pet",e:"🐧",n:"Pingüino Polar",pr:300},{id:"p_rana",t:"pet",e:"🐸",n:"Rana Saltarina",pr:250},
 {id:"p_estrella",t:"pet",e:"🌟",n:"Estrella Viviente",pr:1200},{id:"p_robot",t:"pet",e:"🤖",n:"Robot Compañero",pr:550},
 // PERSONAJES famosos e históricos (tu personaje se convierte en uno) — cuestan MUCHO esfuerzo
 {id:"f_astronauta",t:"famoso",e:"🧑‍🚀",n:"Astronauta",pr:400},
 {id:"f_cientifica",t:"famoso",e:"👩‍🔬",n:"Científica",pr:400},
 {id:"f_artista",t:"famoso",e:"🧑‍🎨",n:"Artista",pr:350},
 {id:"f_explorador",t:"famoso",e:"🧭",n:"Explorador/a",pr:400},
 {id:"f_rey",t:"famoso",e:"🤴",n:"Rey",pr:450},{id:"f_reina",t:"famoso",e:"👸",n:"Reina",pr:450},
 {id:"f_caballero",t:"famoso",e:"🤺",n:"Caballero",pr:450},{id:"f_vaquero",t:"famoso",e:"🤠",n:"Vaquero/a",pr:350},
 {id:"f_doctora",t:"famoso",e:"🧑‍⚕️",n:"Doctor/a",pr:350},{id:"f_piloto",t:"famoso",e:"🧑‍✈️",n:"Piloto",pr:400},
 {id:"f_mago",t:"famoso",e:"🧙",n:"Mago/a",pr:500},{id:"f_detective",t:"famoso",e:"🕵️",n:"Detective",pr:400},
 {id:"f_ninja",t:"famoso",e:"🥷",n:"Ninja",pr:550},{id:"f_superheroe",t:"famoso",e:"🦸",n:"Superhéroe",pr:600},
 {id:"f_superheroina",t:"famoso",e:"🦸‍♀️",n:"Superheroína",pr:600},{id:"f_faraon",t:"famoso",e:"⚱️",n:"Faraón/a",pr:500},
 // estrellas y personajes de pelis/series (originales, sin marcas)
 {id:"f_popstar",t:"famoso",e:"🎤",n:"Estrella del Pop",pr:550},{id:"f_rockstar",t:"famoso",e:"🎸",n:"Estrella del Rock",pr:550},
 {id:"f_dancer",t:"famoso",e:"🕺",n:"Rey del Baile",pr:600},{id:"f_diva",t:"famoso",e:"💃",n:"Diva del Cine",pr:600},
 {id:"f_dj",t:"famoso",e:"🎧",n:"DJ Famoso",pr:500},{id:"f_estrellacine",t:"famoso",e:"🌟",n:"Estrella de Cine",pr:650},
 {id:"f_ogro",t:"famoso",e:"👹",n:"Ogro Simpático",pr:500},{id:"f_carro",t:"famoso",e:"🏎️",n:"Carro Veloz",pr:500},
 {id:"f_perrito",t:"famoso",e:"🐶",n:"Perrito Rescatista",pr:450},{id:"f_payaso",t:"famoso",e:"🤡",n:"Payaso de Circo",pr:400},
 {id:"f_robot2",t:"famoso",e:"🤖",n:"Robot de Película",pr:500},{id:"f_alien",t:"famoso",e:"👽",n:"Extraterrestre Amistoso",pr:500},
 // ACCESORIOS para tu MASCOTA (se le ponen encima)
 {id:"pa_gorro",t:"petacc",e:"🎩",n:"Sombrero",pr:35},{id:"pa_corona",t:"petacc",e:"👑",n:"Corona",pr:90},
 {id:"pa_lazo",t:"petacc",e:"🎀",n:"Lazo",pr:25},{id:"pa_gafas",t:"petacc",e:"🕶️",n:"Gafas",pr:45},
 {id:"pa_bufanda",t:"petacc",e:"🧣",n:"Bufanda",pr:30},{id:"pa_flor",t:"petacc",e:"🌸",n:"Flor",pr:20},
 {id:"pa_gorrito",t:"petacc",e:"🎉",n:"Gorro de fiesta",pr:35},{id:"pa_aureola",t:"petacc",e:"😇",n:"Aureola",pr:70}];
const SHOP_CATS=[["famoso","🦸 Personajes famosos e históricos"],["petacc","🐾 Para tu mascota"],["hat","🎩 Gorros (¡con color!)"],["face","🕶️ Gafas"],["hand","🎸 Compañeros"],["bg","🌈 Fondos"],["pet","✨ Mascotas legendarias"]];
/* compras de la versión anterior → su equivalente nuevo */
const SHOP_OLD_MAP={h_gorra:"h_win2",h_corona:"h_hat",h_mago:"h_hat",h_grad:"h_hat",h_casco:"h_win1",h_fiesta:"h_win4",a_gafas:"g_sun"};
function shopItem(id){return SHOP_ITEMS.find(x=>x.id===id);}
function avState(){const p=prof();
 if(!p.avatar)p.avatar={};
 const a=p.avatar;
 if(!a.skin||!AV_SKINS.includes(a.skin))a.skin=AV_SKINS[3];
 if(!a.hairStyle)a.hairStyle=AV_HAIR_STYLES[0][0];
 if(!a.hairColor)a.hairColor=AV_HAIR_COLORS[1];
 if(!a.eyes)a.eyes=AV_EYES[0][0];
 if(!a.mouth)a.mouth=AV_MOUTHS[0][0];
 if(!a.clothing)a.clothing=AV_CLOTHES[0][0];
 if(!a.clothesColor)a.clothesColor=AV_CLOTHES_COLORS[1];
 if(!a.hatColor)a.hatColor=AV_HAT_COLORS[0];
 if(a.hatId===undefined)a.hatId=null;
 if(a.glassId===undefined)a.glassId=null;
 if(a.handId===undefined)a.handId=null;
 if(a.bgId===undefined)a.bgId=null;
 if(!a.kind)a.kind="person";
 if(!a.animal)a.animal="🦊";
 if(!a.famoso)a.famoso="🦸";
 if(!a.robotSeed)a.robotSeed="robi";
 if(!p.owned)p.owned=[];
 // migrar compras viejas al catálogo nuevo
 p.owned=p.owned.map(id=>SHOP_OLD_MAP[id]||id).filter(id=>shopItem(id));
 return a;}
function legendaryPet(){const p=prof();if(!p||!p.activePet)return null;const it=shopItem(p.activePet);return it?{e:it.e,n:it.n}:null;}
const AV_ANIMALS=["🦊","🐶","🐱","🦁","🐯","🐻","🐼","🐨","🐰","🐹","🐸","🐵","🐮","🐷","🐧","🦄","🐲","🦖","🐢","🦉","🦋","🐝","🐙","🦈","🦓","🦒","🐺","🐔"];
/* URL de DiceBear según el look actual */
function avatarKey(){const a=avState();
 if(a.kind==="robot"){
  const rp=["seed="+encodeURIComponent(a.robotSeed||"robi")];
  const bgR=a.bgId&&shopItem(a.bgId);
  if(bgR)rp.push("backgroundColor="+bgR.db.join(","),"backgroundType=gradientLinear");
  return "https://api.dicebear.com/9.x/bottts/svg?"+rp.join("&");}
 const ps=["seed=academia","eyes="+a.eyes,"mouth="+a.mouth,"skinColor="+a.skin,
  "clothing="+a.clothing,"clothesColor="+a.clothesColor,"eyebrows=default"];
 const hat=a.hatId&&shopItem(a.hatId);
 if(hat){ps.push("top="+hat.db,"hatColor="+a.hatColor);}
 else ps.push("top="+a.hairStyle,"hairColor="+a.hairColor);
 const gl=a.glassId&&shopItem(a.glassId);
 if(gl)ps.push("accessories="+gl.db,"accessoriesProbability=100");
 const bg=a.bgId&&shopItem(a.bgId);
 if(bg)ps.push("backgroundColor="+bg.db.join(","),"backgroundType=gradientLinear");
 return DB_API+"?"+ps.join("&");}
/* descarga el SVG una vez y lo guarda en el perfil (offline después) */
function avatarEnsure(cb){const p=prof();
 const k=avState().kind;if(k==="animal"||k==="famoso")return; // emoji, no necesitan descarga
 const key=avatarKey();
 if(p.avatarSvg&&p.avatarKey===key)return;
 fetch(key).then(r=>r.text()).then(t=>{
  if(t&&t.indexOf("<svg")>=0){p.avatarSvg=t;p.avatarKey=key;save();if(cb)cb();}
 }).catch(()=>{});}
/* escena grande con el fondo comprado bien visible + el personaje encima */
function avatarScene(px){const a=avState();
 const bg=a.bgId&&shopItem(a.bgId);
 if(!bg)return '<div style="display:flex;justify-content:center">'+avatarHTML(px)+'</div>';
 const [c1,c2]=bg.db;
 const deco=Array.from({length:8},(_,i)=>'<span style="position:absolute;font-size:'+(18+(i%3)*10)+'px;left:'+(6+i*12)+'%;top:'+(8+((i*37)%70))+'%;opacity:.5">'+bg.e+'</span>').join("");
 return '<div style="position:relative;border-radius:20px;overflow:hidden;border:4px solid var(--kid-ink);box-shadow:0 6px 0 rgba(30,42,74,.7);background:linear-gradient(160deg,#'+c1+',#'+c2+');padding:16px 0;display:flex;justify-content:center">'
  +deco+'<div style="position:relative;z-index:1">'+avatarHTML(px)+'</div></div>';}
function avatarHTML(px){const p=prof();const a=avState();
 const hand=a.handId&&shopItem(a.handId);
 let face;
 if(a.kind==="animal"||a.kind==="famoso"){
  const em=a.kind==="famoso"?(a.famoso||"🦸"):(a.animal||"🦊");
  face='<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:'+Math.round(px*0.62)+'px;border-radius:18px;overflow:hidden;border:3px solid var(--kid-ink);box-shadow:0 4px 0 rgba(30,42,74,.6);background:#EAF2FF">'+em+'</span>';
 }else{
  const ready=p.avatarSvg&&p.avatarKey===avatarKey();
  const inner=ready
   ?p.avatarSvg.replace("<svg",'<svg style="width:100%;height:100%;display:block" ')
   :'<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:'+Math.round(px*0.5)+'px;background:#EAF2FF;border-radius:18px">'+(a.kind==="robot"?"🤖":"🙂")+'</div>';
  face='<span style="position:absolute;inset:0;border-radius:18px;overflow:hidden;border:3px solid var(--kid-ink);box-shadow:0 4px 0 rgba(30,42,74,.6);background:#fff">'+inner+'</span>';
 }
 return '<span style="position:relative;display:inline-block;width:'+px+'px;height:'+px+'px;vertical-align:middle;border-radius:18px;overflow:visible">'
 +face
 +(hand?'<span style="position:absolute;right:-'+Math.round(px*0.08)+'px;bottom:-'+Math.round(px*0.05)+'px;font-size:'+Math.round(px*0.34)+'px;line-height:1;z-index:2;filter:drop-shadow(0 2px 0 rgba(30,42,74,.5))">'+hand.e+'</span>':'')
 +'</span>';}
/* ---- Pantalla MI PERSONAJE ---- */
const AV_FIELD_ARRS={hairStyle:()=>AV_HAIR_STYLES,eyes:()=>AV_EYES,mouth:()=>AV_MOUTHS,clothing:()=>AV_CLOTHES};
function avCycle(field,dir){const a=avState();
 const vals=AV_FIELD_ARRS[field]().map(x=>x[0]);
 let i=vals.indexOf(a[field]);i=(i+dir+vals.length)%vals.length;
 a[field]=vals[i];save();beep([560],.06);avatarEnsure(screenAvatar);screenAvatar();}
function avSet(field,v){const a=avState();a[field]=v;save();sOK();avatarEnsure(screenAvatar);screenAvatar();}
function avSetKind(k){const a=avState();a.kind=k;save();sOK();avatarEnsure(screenAvatar);screenAvatar();}
function avSetAnimal(e){const a=avState();a.animal=e;save();sOK();screenAvatar();}
function avShuffleRobot(){const a=avState();a.robotSeed="r"+Math.floor(Math.random()*1000000);save();beep([560],.06);avatarEnsure(screenAvatar);screenAvatar();}
function screenAvatar(){setTheme("kid");
 const p=prof(),a=avState();
 avatarEnsure(screenAvatar);
 const cyc=(label,field,arr)=>{
  const cur=arr.find(x=>x[0]===a[field]);
  return '<div style="display:flex;align-items:center;gap:10px;margin:8px 0"><b style="flex:1">'+label+'</b>'
  +'<button class="kbtn white" style="display:inline-block;width:auto;margin:0;padding:8px 16px;min-height:44px" onclick="avCycle(\''+field+'\',-1)">◀</button>'
  +'<span style="font-family:Fredoka;font-weight:600;min-width:110px;text-align:center">'+(cur?cur[1]:a[field])+'</span>'
  +'<button class="kbtn white" style="display:inline-block;width:auto;margin:0;padding:8px 16px;min-height:44px" onclick="avCycle(\''+field+'\',1)">▶</button></div>';};
 const swatch=(hexes,field)=>'<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">'
  +hexes.map(c=>'<button onclick="avSet(\''+field+'\',\''+c+'\')" style="width:44px;height:44px;border-radius:50%;border:3px solid var(--kid-ink);background:#'+c+';box-shadow:0 3px 0 rgba(30,42,74,.6);'+(a[field]===c?'outline:4px solid var(--kid-green);':'')+'"></button>').join("")+'</div>';
 const ownedBy=t=>p.owned.map(shopItem).filter(x=>x&&x.t===t);
 const eqBtns=(t,key)=>{const its=ownedBy(t);
  if(!its.length)return '<p class="mut" style="font-size:.9rem;margin:4px 0">Aún no tienes — ¡míralos en la tienda! 🛍️</p>';
  return '<div style="display:flex;flex-wrap:wrap;gap:10px;margin:6px 0">'+its.map(it=>
   '<button class="kbtn '+(a[key]===it.id?'green':'white')+'" style="display:inline-block;width:auto;margin:0;padding:10px 14px;font-size:1rem" onclick="avEquip(\''+it.id+'\')">'+it.e+' '+it.n+(a[key]===it.id?' ✓':'')+'</button>').join("")+'</div>';};
 const kindBtn=(k,label)=>'<button class="kbtn '+(a.kind===k?'green':'white')+'" style="display:inline-block;width:auto;margin:0 6px 6px 0;padding:8px 14px;font-size:1rem" onclick="avSetKind(\''+k+'\')">'+label+'</button>';
 const animalGrid='<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:8px">'
  +AV_ANIMALS.map(e=>'<button onclick="avSetAnimal(\''+e+'\')" style="aspect-ratio:1;border-radius:14px;border:3px solid var(--kid-ink);background:'+(a.animal===e?"var(--kid-green)":"#fff")+';box-shadow:0 3px 0 rgba(30,42,74,.6);font-size:clamp(1.3rem,6vw,1.8rem)">'+e+'</button>').join("")+'</div>';
 let personaCards="";
 if(a.kind==="person"){
  personaCards='<div class="card">'+cyc("💇 Peinado","hairStyle",AV_HAIR_STYLES)+cyc("👀 Ojos","eyes",AV_EYES)+cyc("👄 Boca","mouth",AV_MOUTHS)+cyc("👕 Ropa","clothing",AV_CLOTHES)+'</div>'
   +'<div class="card"><b>🖐️ Color de piel</b>'+swatch(AV_SKINS,"skin")+'</div>'
   +'<div class="card"><b>💇 Color de pelo</b>'+swatch(AV_HAIR_COLORS,"hairColor")+'</div>'
   +'<div class="card"><b>👕 Color de ropa</b>'+swatch(AV_CLOTHES_COLORS,"clothesColor")+'</div>'
   +'<div class="card"><b>🎩 Gorro</b>'+eqBtns("hat","hatId")+(a.hatId?'<p style="font-size:.85rem;margin-top:6px;font-weight:600">Color del gorro:</p>'+swatch(AV_HAT_COLORS,"hatColor"):'')+'</div>'
   +'<div class="card"><b>🕶️ Gafas</b>'+eqBtns("face","glassId")+'</div>';
 }else if(a.kind==="animal"){
  personaCards='<div class="card"><b>🐾 Elige tu animalito</b>'+animalGrid+'</div>';
 }else if(a.kind==="famoso"){
  const fams=p.owned.map(shopItem).filter(x=>x&&x.t==="famoso");
  personaCards='<div class="card"><b>🦸 Tus personajes famosos</b>'+(fams.length
   ?'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:8px">'+fams.map(it=>'<button onclick="avSetFamoso(\''+it.e+'\')" title="'+it.n+'" style="aspect-ratio:1;border-radius:14px;border:3px solid var(--kid-ink);background:'+(a.famoso===it.e?"var(--kid-green)":"#fff")+';box-shadow:0 3px 0 rgba(30,42,74,.6);font-size:clamp(1.3rem,6vw,1.8rem)">'+it.e+'</button>').join("")+'</div>'
   :'<p class="mut" style="margin-top:6px">Aún no tienes personajes famosos. ¡Cómpralos en la tienda! 🛍️ Cuestan bastante esfuerzo (400-600 🪙).</p>')+'</div>';
 }else{
  personaCards='<div class="card center"><b>🤖 Tu robot</b><p class="mut" style="margin:6px 0 10px">Cada toque crea un robot nuevo</p><button class="kbtn blue" onclick="avShuffleRobot()">🎲 Cambiar robot</button></div>';
 }
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">😎 Mi personaje</h2>'
 +'<div class="card center" style="padding:14px">'+avatarScene(180)+'</div>'
 +'<div class="card"><b>¿Qué quieres ser?</b><div style="margin-top:8px">'+kindBtn("person","🧑 Persona")+kindBtn("animal","🦊 Animalito")+kindBtn("robot","🤖 Robot")+kindBtn("famoso","🦸 Famoso")+'</div>'
 +(a.kind==="person"?'<p class="mut" style="font-size:.85rem;margin-top:6px">Para niña: elige un peinado largo (Bob, Moño o Largo) 👧</p>':'')+'</div>'
 +personaCards
 +'<div class="card"><b>🎸 Compañero</b>'+eqBtns("hand","handId")+'</div>'
 +'<div class="card"><b>🌈 Fondo</b>'+eqBtns("bg","bgId")+'</div>'
 +'<p class="audiotip">💡 Cambiar el look necesita internet una vez; después tu personaje queda guardado y se ve sin conexión.</p>'
 +'<button class="kbtn yellow" onclick="screenShop()">🛍️ Ir a la tienda</button>');}
function avEquip(id){const it=shopItem(id),a=avState();
 if(!it)return;
 const key=it.t==="hat"?"hatId":it.t==="face"?"glassId":it.t==="hand"?"handId":"bgId";
 a[key]=a[key]===id?null:id; // tocar de nuevo lo quita
 save();beep([600],.08);avatarEnsure(screenAvatar);screenAvatar();}
/* ---- TIENDA ---- */
function screenShop(){setTheme("kid");
 const p=prof();avState();avatarEnsure(screenShop);
 const cats=SHOP_CATS.map(([t,title])=>{
  const items=SHOP_ITEMS.filter(x=>x.t===t).map(it=>{
   const owned=p.owned.includes(it.id)||(p.legendaries||[]).includes(it.id);
   const active=p.activePet===it.id;
   let btn;
   const a=avState();const famActive=it.t==="famoso"&&a.kind==="famoso"&&a.famoso===it.e;
   const accActive=it.t==="petacc"&&p.tama&&p.tama.accId===it.id;
   if(!owned)btn='<button class="kbtn yellow" style="margin:8px 0 0;min-height:48px;font-size:1rem" onclick="shopBuy(\''+it.id+'\')">Comprar · '+it.pr+' 🪙</button>';
   else if(it.t==="pet")btn='<button class="kbtn '+(active?'green':'white')+'" style="margin:8px 0 0;min-height:48px;font-size:1rem" onclick="shopPet(\''+it.id+'\')">'+(active?'✓ Te acompaña':'Llevar conmigo')+'</button>';
   else if(it.t==="famoso")btn='<button class="kbtn '+(famActive?'green':'white')+'" style="margin:8px 0 0;min-height:48px;font-size:1rem" onclick="avEquipFromShop(\''+it.id+'\')">'+(famActive?'✓ Eres tú':'Ser este 🦸')+'</button>';
   else if(it.t==="petacc")btn='<button class="kbtn '+(accActive?'green':'white')+'" style="margin:8px 0 0;min-height:48px;font-size:1rem" onclick="avEquipFromShop(\''+it.id+'\')">'+(accActive?'✓ Puesto':'Ponérselo 🐾')+'</button>';
   else btn='<button class="kbtn white" style="margin:8px 0 0;min-height:48px;font-size:1rem" onclick="avEquipFromShop(\''+it.id+'\')">Equipar 😎</button>';
   return '<div style="text-align:center;padding:12px;border-radius:18px;border:4px solid var(--kid-ink);background:'+(owned?"#EFFFF3":"#FFF")+';box-shadow:0 5px 0 rgba(30,42,74,.7)">'
    +'<div style="font-size:clamp(2.4rem,11vw,3.2rem)">'+it.e+'</div>'
    +'<div style="font-family:Fredoka;font-weight:700;font-size:.85rem">'+it.n+'</div>'+btn+'</div>';}).join("");
  return '<div class="card"><b style="font-size:1.1rem">'+title+'</b><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:10px">'+items+'</div></div>';}).join("");
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:2px">🛍️ La tienda</h2>'
 +'<p class="center" style="margin-bottom:12px">Tienes <b>'+p.coins+' 🪙</b> — gana más jugando y aprendiendo</p>'
 +'<div class="card center" style="padding:14px">'+avatarHTML(110)+'<br><button class="kbtn blue" style="margin-top:12px" onclick="screenAvatar()">😎 Personalizar mi personaje</button></div>'
 +cats);}
function shopBuy(id){const it=shopItem(id),p=prof();
 if(!it)return;
 if(!p.owned)p.owned=[];
 if(p.coins<it.pr){sNO();toast("Te faltan "+(it.pr-p.coins)+" 🪙 — ¡sigue jugando!",false,1800);return;}
 p.coins-=it.pr;
 if(it.t==="pet"){if(!p.legendaries)p.legendaries=[];p.legendaries.push(id);p.activePet=id;}
 else p.owned.push(id);
 save();sWIN();confetti(24);toast("¡"+it.n+" es tuyo! 🎉",true,1500);
 setTimeout(screenShop,600);}
function shopPet(id){const p=prof();p.activePet=p.activePet===id?null:id;save();beep([600],.08);screenShop();}
function avEquipFromShop(id){const it=shopItem(id),a=avState();
 if(it.t==="famoso"){a.kind="famoso";a.famoso=it.e;save();sOK();toast("¡Ahora eres "+it.n+"! 🎉",true,1300);screenShop();return;}
 if(it.t==="petacc"){petToggle(id);screenShop();return;}
 const key=it.t==="hat"?"hatId":it.t==="face"?"glassId":it.t==="hand"?"handId":"bgId";
 a[key]=id;save();sOK();toast("¡Equipado! 😎",true,1000);avatarEnsure(screenShop);screenShop();}
function avSetFamoso(e){const a=avState();a.kind="famoso";a.famoso=e;save();sOK();screenAvatar();}
/* accesorios de la MASCOTA: se le ponen encima (toggle) */
function petToggle(id){const p=prof(),it=shopItem(id);
 if(!p.tama){toast("Primero adopta una mascota 🥚 (en Mi mascota)",false,2200);return false;}
 if(p.tama.accId===id){p.tama.accId=null;p.tama.acc=null;}
 else{p.tama.accId=id;p.tama.acc=it?it.e:null;}
 save();sOK();return true;}
function petEquipFromPet(id){if(petToggle(id))screenTama();}
