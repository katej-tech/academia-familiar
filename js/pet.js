"use strict";
/* ============ MASCOTA INTERACTIVA (estilo Tamagotchi) ============
   Se cuida de verdad: come, juega, se baña y duerme. Sus necesidades bajan
   con el tiempo real, así el niño vuelve cada día. La comida cuesta monedas
   que se ganan estudiando → estudiar = poder cuidar a la mascota. */

const TAMA_STARTERS=[["🐱","Gatito"],["🐶","Perrito"],["🐰","Conejo"],["🐹","Hámster"],["🦊","Zorrito"],["🐲","Dragón"],["🐧","Pingüino"],["🐢","Tortuga"],["🦄","Unicornio"],["🐻","Osito"]];
const TAMA_FOODS=[["🍎","Manzana",5,{hunger:14}],["🥪","Comida",10,{hunger:32}],["🍗","Banquete",18,{hunger:55,happy:6}],["🎂","Pastel rico",16,{hunger:18,happy:20}]];

function tamaState(){const p=prof();return p&&p.tama?p.tama:null;}
function tclamp(v){return Math.max(0,Math.min(100,Math.round(v)));}
function tamaSave(){if(typeof save==="function")save();}
/* las necesidades bajan según las horas reales transcurridas */
function tamaTick(){
 const t=tamaState();if(!t)return;
 const now=Date.now();const hrs=Math.max(0,(now-(t.lastTs||now))/3600000);
 if(hrs<=0.0003){t.lastTs=now;return;}
 t.hunger=tclamp(t.hunger-8*hrs);
 t.happy =tclamp(t.happy -5*hrs);
 t.clean =tclamp(t.clean -3*hrs);
 if(t.sleeping){t.energy=tclamp(t.energy+22*hrs);if(t.energy>=100)t.sleeping=false;}
 else t.energy=tclamp(t.energy-4*hrs);
 t.lastTs=now;tamaSave();
}
function tamaCareLv(t){return Math.floor(Math.sqrt((t.careXp||0)/12))+1;}
function tamaMood(t){
 if(t.sleeping)return{f:"😴",msg:t.name+" está durmiendo… shh"};
 if(t.hunger<=25)return{f:"🍽️",msg:"¡"+t.name+" tiene hambre!"};
 if(t.clean<=25)return{f:"🛁",msg:t.name+" quiere un baño"};
 if(t.energy<=25)return{f:"🥱",msg:t.name+" está cansadito"};
 if(t.happy<=25)return{f:"🥺",msg:t.name+" quiere jugar contigo"};
 if(Math.min(t.hunger,t.happy,t.energy,t.clean)>=70)return{f:"🥰",msg:"¡"+t.name+" está feliz contigo!"};
 return{f:"🙂",msg:t.name+" está bien"};
}

/* ---- pantalla principal ---- */
function screenTama(){setTheme("kid");if(typeof stopGames==="function")stopGames();
 const p=prof();
 if(!p.tama)return tamaAdopt();
 tamaTick();
 const t=p.tama,m=tamaMood(t),lv=tamaCareLv(t);
 const bar=(ic,label,val,color)=>'<div style="margin:7px 0">'
   +'<div style="display:flex;justify-content:space-between;font-size:.82rem;font-family:Fredoka;font-weight:600;margin-bottom:2px"><span>'+ic+' '+label+'</span><span>'+val+'%</span></div>'
   +'<div style="height:14px;border-radius:10px;background:#E6ECF5;border:2px solid var(--kid-ink);overflow:hidden"><div style="height:100%;width:'+val+'%;background:'+color+';transition:width .4s"></div></div></div>';
 const sleeping=t.sleeping;
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🐾 '+esc(t.name)+'</h2>'
  +'<p class="center" style="font-size:.85rem;margin-bottom:8px">Nivel de cariño '+lv+' 💞 · '+(p.coins)+' 🪙</p>'
  +'<div id="tamastage" class="card" style="position:relative;text-align:center;padding:18px 14px;overflow:hidden;background:linear-gradient(180deg,#EAF6FF,#D6ECFF)">'
   +'<div style="font-size:.95rem;font-family:Fredoka;font-weight:700;min-height:1.4em;margin-bottom:6px">'+m.f+' '+esc(m.msg)+'</div>'
   +'<div id="tamapet" class="'+(sleeping?'petsleep':'petidle')+'" style="font-size:clamp(5rem,30vw,8rem);line-height:1;'+(sleeping?'filter:grayscale(.3);opacity:.85':'')+'">'+t.sp+'</div>'
   +(sleeping?'<div class="zzz" style="position:absolute;top:20%;left:58%">💤</div>':'')
  +'</div>'
  +'<div class="card" style="padding:12px 14px">'
   +bar("🍖","Comida",t.hunger,"#FF8A5B")
   +bar("😊","Felicidad",t.happy,"#FFC93C")
   +bar("⚡","Energía",t.energy,"#3EC97C")
   +bar("🫧","Limpieza",t.clean,"#5BC0F8")
  +'</div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px">'
   +'<button class="kbtn yellow" onclick="tamaFeedMenu()">🍎 Alimentar</button>'
   +'<button class="kbtn green" '+(sleeping?'disabled style="opacity:.5"':'')+' onclick="tamaPlay()">🎾 Jugar</button>'
   +'<button class="kbtn blue" '+(sleeping?'disabled style="opacity:.5"':'')+' onclick="tamaBath()">🛁 Bañar</button>'
   +'<button class="kbtn white" onclick="tamaSleep()">'+(sleeping?'☀️ Despertar':'😴 Dormir')+'</button>'
  +'</div>'
  +'<p class="center mut" style="margin-top:12px;font-size:.8rem">Sus necesidades bajan con el tiempo. ¡Vuelve cada día a cuidarlo! 💞</p>');
 if(TAMA_ATE){tamaEatAnim(TAMA_ATE);TAMA_ATE=null;}
}
let TAMA_ATE=null;
function tamaEatAnim(food){
 const stage=document.getElementById("tamastage"),pet=document.getElementById("tamapet");
 if(stage){const f=document.createElement("div");f.className="foodfly";f.textContent=food;
  f.style.cssText="position:absolute;left:50%;top:40%;transform:translateX(-50%);font-size:2.4rem";stage.appendChild(f);
  setTimeout(()=>{if(f.parentNode)f.remove();},700);}
 if(pet){pet.classList.remove("petidle");pet.classList.add("peteat");setTimeout(()=>{if(pet){pet.classList.remove("peteat");pet.classList.add("petidle");}},800);}
}

/* ---- adopción ---- */
function tamaAdopt(){setTheme("kid");
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🥚 ¡Adopta tu mascota!</h2>'
  +'<p class="center" style="margin-bottom:14px">Elige tu compañero. Tendrás que cuidarlo todos los días.</p>'
  +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">'
  +TAMA_STARTERS.map((s,i)=>'<button onclick="tamaPick('+i+')" style="aspect-ratio:1;border:3px solid var(--kid-ink);border-radius:16px;background:#fff;box-shadow:0 5px 0 rgba(30,42,74,.5);font-size:clamp(1.8rem,9vw,2.6rem)">'+s[0]+'</button>').join("")
  +'</div>');
}
function tamaPick(i){
 const s=TAMA_STARTERS[i];
 let name=null;
 try{name=window.prompt("¿Cómo se llamará tu "+s[1]+"?",s[1]);}catch(e){}
 name=(name||s[1]).toString().trim().slice(0,14)||s[1];
 const p=prof();
 p.tama={name:name,sp:s[0],hunger:80,happy:80,energy:90,clean:90,careXp:0,sleeping:false,lastTs:Date.now(),adopted:Date.now()};
 tamaSave();sWIN();confetti(24);
 toast("¡"+name+" es tuyo! Cuídalo bien 💞",true,2200);
 setTimeout(screenTama,400);
}

/* ---- acciones ---- */
function tamaApply(t,eff){for(const k in eff)t[k]=tclamp((t[k]||0)+eff[k]);}
function tamaFeedMenu(){
 const t=tamaState();if(!t)return;const p=prof();
 render(topbar("screenTama()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🍎 Alimentar a '+esc(t.name)+'</h2>'
  +'<p class="center" style="margin-bottom:12px">Tienes <b>'+p.coins+' 🪙</b> · Gana más haciendo actividades</p>'
  +TAMA_FOODS.map((f,i)=>'<button class="kbtn '+(p.coins>=f[2]?"yellow":"white")+'" '+(p.coins<f[2]?'style="opacity:.55"':'')+' onclick="tamaFeed('+i+')"><span style="font-size:1.5rem">'+f[0]+'</span> '+f[1]+' · '+f[2]+' 🪙</button>').join("")
  +'<button class="kbtn white" style="margin-top:10px" onclick="screenTama()">← Volver</button>');
}
function tamaFeed(i){
 const p=prof(),t=p.tama,f=TAMA_FOODS[i];if(!t)return;
 if(p.coins<f[2])return toast("Te faltan monedas — ¡haz actividades para ganar! 🪙",false,2200);
 p.coins-=f[2];tamaApply(t,f[3]);t.careXp=(t.careXp||0)+2;t.lastTs=Date.now();
 tamaSave();sOK();
 TAMA_ATE=f[0]; // dispara la animación de comer al volver a la pantalla
 toast(t.name+" comió "+f[1]+" 😋 +"+f[3].hunger+" comida",true,1300);
 setTimeout(screenTama,250);
}
function tamaBath(){
 const t=tamaState();if(!t||t.sleeping)return;
 const stage=document.getElementById("tamastage"),pet=document.getElementById("tamapet");
 if(pet){pet.classList.remove("petidle");pet.classList.add("pethappy");}
 if(stage){const soaps=["🫧","🧼","💧","✨","🫧"];
  for(let i=0;i<14;i++){const b=document.createElement("div");b.className="bubble";b.textContent=pick(soaps);
   b.style.left=(8+rnd(80))+"%";b.style.bottom="12px";b.style.fontSize=(1.1+Math.random()).toFixed(2)+"rem";
   b.style.animationDuration=(1+Math.random()).toFixed(2)+"s";b.style.animationDelay=(Math.random()*0.7).toFixed(2)+"s";
   stage.appendChild(b);}}
 beep([700,900,1100],.12);
 setTimeout(()=>{tamaApply(t,{clean:45,happy:8});t.careXp=(t.careXp||0)+2;t.lastTs=Date.now();tamaSave();sOK();
  toast(t.name+" quedó limpiecito 🫧✨",true,1300);screenTama();},1500);
}
/* ---- mini-juego: atrapa golosinas para la mascota ---- */
let TG={};
function tamaPlay(){
 const t=tamaState();if(!t||t.sleeping)return;
 if(t.energy<15)return toast(t.name+" está muy cansado para jugar 🥱 Déjalo dormir",false,2200);
 setTheme("kid");TG={score:0,left:18};
 render(topbar("screenTama()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🎾 Juega con '+esc(t.name)+'</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:6px">¡Toca las golosinas que caen para dárselas!</p>'
  +'<div style="display:flex;justify-content:space-between;font-family:Fredoka;font-weight:700;padding:0 6px;margin-bottom:6px"><span id="tgsc">0 🍬</span><span id="tgtime">18s</span></div>'
  +'<div id="tgstage" style="position:relative;height:58vh;max-height:440px;overflow:hidden;border:3px solid var(--kid-ink);border-radius:18px;background:linear-gradient(180deg,#EAF6FF,#CDEBFF)">'
   +'<div id="tgpet" class="petidle" style="position:absolute;bottom:6px;left:50%;transform:translateX(-50%);font-size:clamp(2.8rem,15vw,4rem)">'+t.sp+'</div>'
  +'</div>');
 TG.spawn=setInterval(tgSpawn,720);
 TG.timer=setInterval(tgTick,1000);
}
function tgTick(){TG.left--;const el=document.getElementById("tgtime");if(el)el.textContent=Math.max(0,TG.left)+"s";if(TG.left<=0)tgEnd();}
function tgSpawn(){
 const st=document.getElementById("tgstage");if(!st)return tgEnd();
 const treats=["🍎","🍪","🦴","🧀","🍓","🥕","🍬"];
 const d=document.createElement("div");d.textContent=pick(treats);
 d.style.cssText="position:absolute;top:-46px;font-size:2.1rem;cursor:pointer;left:"+(4+rnd(84))+"%;transition:top 2.7s linear";
 d.onclick=()=>{if(d._got)return;d._got=true;TG.score++;beep([600+TG.score*12],.05);
  const sc=document.getElementById("tgsc");if(sc)sc.textContent=TG.score+" 🍬";
  const pet=document.getElementById("tgpet");if(pet){pet.classList.remove("petidle");pet.classList.add("pethappy");setTimeout(()=>{if(pet){pet.classList.remove("pethappy");pet.classList.add("petidle");}},500);}
  d.textContent="💖";setTimeout(()=>{if(d.parentNode)d.remove();},200);};
 st.appendChild(d);
 requestAnimationFrame(()=>{d.style.top="100%";});
 setTimeout(()=>{if(d&&d.parentNode)d.remove();},2800);
}
function tgEnd(){
 clearInterval(TG.spawn);clearInterval(TG.timer);
 const t=tamaState();if(!t)return screenTama();
 tamaApply(t,{happy:Math.min(42,12+TG.score*2),energy:-12,hunger:-5});t.careXp=(t.careXp||0)+3;t.lastTs=Date.now();tamaSave();
 sWIN();confetti(22);
 toast("¡"+t.name+" jugó contigo! Atrapaste "+TG.score+" golosinas 🍬",true,2400);
 setTimeout(screenTama,600);
}
function tamaSleep(){
 const t=tamaState();if(!t)return;
 t.sleeping=!t.sleeping;t.lastTs=Date.now();tamaSave();beep([320],.18);
 if(t.sleeping)toast("Shh… "+t.name+" se durmió 😴 (recupera energía)",true,1800);
 else toast("¡"+t.name+" despertó! ☀️",true,1200);
 screenTama();
}
