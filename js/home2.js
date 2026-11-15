"use strict";
/* ============ INICIO MODERNO: personaje animado + «tu siguiente paso» (adaptativo) ============
   La app elige qué conviene practicar ahora según el desempeño guardado (temas con menos aciertos o menos vistos para
   el niño; palabras por repasar o el tema de matemáticas más flojo para la adolescente). */
function kidHeroHTML(){
 const p=prof(),pet=(typeof legendaryPet==="function"&&legendaryPet())||petStage(p.xp);
 return '<div class="hero2"><canvas id="heroM" aria-hidden="true"></canvas>'
  +'<div class="h2t"><h1>¡Hola, '+esc(p.name)+'!</h1><div class="chips"><span>'+pet.e+' '+esc(pet.n)+'</span><span>🎒 '+uniqueCritters()+'/'+CRITTERS.length+'</span></div></div>'
  +'<div onclick="openProfileMenu()" style="position:relative;z-index:1;cursor:pointer">'+(typeof avatarHTML==="function"?avatarHTML(52):"🧒")+'</div>'
  +'<div style="position:relative;z-index:1;font-size:2.2rem;cursor:pointer" onclick="examGo(\'screenTama\')">'+(p.tama?p.tama.sp:"🥚")+'</div></div>';}
function kidNextStepHTML(){
 try{
  const pool=[];KID_WORLDS.forEach(function(w){if(!w.special&&w.topics)w.topics.forEach(function(t){if(KID_TOPICS[t]&&pool.indexOf(t)<0)pool.push(t);});});
  if(!pool.length)return"";
  const m=topicMastery(),seen=pool.filter(function(t){return m[t]&&m[t].n>=3;});
  const tk=weakestTopics(pool,1)[0],tp=KID_TOPICS[tk],s=m[tk];
  const why=s&&s.n>=3?("Vas en "+Math.round(s.ok/s.n*100)+"% · ¡a subirlo!"):(seen.length?"Tema nuevo para ti":"Empecemos por aquí");
  return '<button class="nextstep" onclick="playTopics('+jsStr("Tu siguiente paso").replace(/"/g,"&quot;")+',[\''+tk+'\'])"><span class="ns-ic">'+tp.emoji+'</span><span><b>Tu siguiente paso: '+esc(tp.name)+'</b><span class="s">'+why+' · elegido para ti</span></span><span class="go">▶</span></button>';
 }catch(e){return"";}}
function teenNextStepHTML(){
 try{
  if(typeof enhDue==="function"){const d=enhDue().length;if(d>=3)return '<button class="nextstep" style="background:linear-gradient(135deg,#06B6D4,#6366F1);box-shadow:0 12px 26px rgba(99,102,241,.35)" onclick="enhStudy()"><span class="ns-ic">🧠</span><span><b>Tu siguiente paso: repasar '+Math.min(d,10)+' palabras</b><span class="s">Ya les toca según el repaso espaciado</span></span><span class="go">▶</span></button>';}
  if(typeof mtSt==="function"){const st=mtSt(),ts=MT_TOPICS.filter(function(t){return t.g===st.grade&&!t.link;});
   const sc=function(t){const s=st.t[t.id];return s&&s.tries?s.best:-1;};const t=ts.slice().sort(function(a,b){return sc(a)-sc(b);})[0];
   if(t)return '<button class="nextstep" style="background:linear-gradient(135deg,#8B5CF6,#EC4899);box-shadow:0 12px 26px rgba(139,92,246,.35)" onclick="mtStart(\''+t.id+'\')"><span class="ns-ic">'+t.ic+'</span><span><b>Tu siguiente paso: '+esc(t.nm)+'</b><span class="s">'+(sc(t)<0?"Aún no lo has practicado":"Tu mejor resultado: "+sc(t)+"%")+' · '+st.grade+'.º</span></span><span class="go">▶</span></button>';}
 }catch(e){}return"";}
