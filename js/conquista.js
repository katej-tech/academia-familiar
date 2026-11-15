"use strict";
/* ============ CONQUISTA DEL SABER (juego de las salas en línea) ============
   Pedido: que la sala de juegos sea para todos los perfiles y «un juego como Triviador Mundo».
   Se toma la MECÁNICA de los juegos de trivia con territorios (mapa, castillos, conquistar respondiendo), con mapa,
   nombre y preguntas propios:
   · Mapa de 19 casillas hexagonales. Cada jugador empieza con un castillo 🏰 de 3 vidas.
   · FASE 1 – Expansión: todos responden a la vez una pregunta DE SU NIVEL; quienes aciertan eligen territorio libre
     (primero el más rápido). · FASE 2 – Batallas: por turnos, se ataca un territorio vecino; atacante y defensor
     responden: gana el atacante si acierta y el defensor falla o fue más lento. Un castillo cae al tercer golpe y su
     dueño queda fuera (sus territorios pasan al conquistador).
   · 2 a 4 jugadores; si son menos de 3 se completan con bots. El ANFITRIÓN lleva el estado del juego (campo `g` de la
     sala) y los demás solo escriben su respuesta o su elección. Prefijo conq / CQ. */

const CONQ_COL=["#EF4444","#3B82F6","#22C55E","#F59E0B"];
const CONQ_CELLS=(function(){const out=[];for(let q=-2;q<=2;q++)for(let r=-2;r<=2;r++)if(Math.abs(q+r)<=2)out.push({q:q,r:r});return out;})();
const CONQ_DIRS=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
function conqId(q,r){return CONQ_CELLS.findIndex(function(c){return c.q===q&&c.r===r;});}
const CONQ_ADJ=CONQ_CELLS.map(function(c){return CONQ_DIRS.map(function(d){return conqId(c.q+d[0],c.r+d[1]);}).filter(function(i){return i>=0;});});
const CONQ_CORNERS=[conqId(2,-2),conqId(2,0),conqId(0,2),conqId(-2,2),conqId(-2,0),conqId(0,-2)];
const CONQ_DECO=["🌋","🌴","🏔️","🏜️","🌊","🌲","🗿","⛰️","🌾","🏝️","❄️","🌵","🌳","🏞️","🪨","🌸","🍄","🌻","🦜"];
let CQ={},CQH={};

/* ---------- reglas (las usa el anfitrión y también la pantalla para resaltar) ---------- */
function conqOwned(g,pid){return Object.keys(g.owners).filter(function(k){return g.owners[k]===pid;}).map(Number);}
function conqFree(g){return CONQ_CELLS.map(function(_,i){return i;}).filter(function(i){return g.owners[i]==null;});}
function conqValidPicks(g,pid){
 const mine=conqOwned(g,pid),free=conqFree(g);
 const adj=free.filter(function(i){return CONQ_ADJ[i].some(function(j){return mine.indexOf(j)>=0;});});
 return adj.length?adj:free;}
function conqTargets(g,pid){
 const mine=conqOwned(g,pid),out=[];
 CONQ_CELLS.forEach(function(_,i){const o=g.owners[i];if(o==null||o===pid||g.out[o])return;if(CONQ_ADJ[i].some(function(j){return mine.indexOf(j)>=0;}))out.push(i);});
 return out;}
function conqAlive(g){return g.order.filter(function(p){return !g.out[p];});}

/* ---------- ANFITRIÓN ---------- */
function conqHostStart(){
 if(!SALA.host||!SALA.data)return;
 const P=SALA.data.players||{},patch={};
 let ids=Object.keys(P).filter(function(k){return !P[k].bot;});
 const bots=[["bot1","Rayo"],["bot2","Luna"]];let bi=0;
 const botIds=[];while(ids.length+botIds.length<3&&bi<bots.length){botIds.push(bots[bi][0]);patch["players."+bots[bi][0]]={n:"Bot "+bots[bi][1],e:"🤖",bot:true,s:0};bi++;}
 Object.keys(P).forEach(function(k){if(P[k].bot&&botIds.indexOf(k)<0)patch["players."+k]=SALA.net.delField();});
 const order=shuffled(ids.slice(0,4).concat(botIds)).slice(0,4);
 const cornerSets={2:[0,3],3:[0,2,4],4:[0,2,3,5]}[order.length]||[0,2,4];
 const g={v:1,phase:"q",round:1,order:order,owners:{},base:{},lives:{},pts:{},out:{},qid:1,qfor:order.slice(),qdur:24000,pickQ:[],pickId:0,turnList:[],ti:0,duel:null,msg:"¡Empieza la expansión! Responde para ganar territorios.",bots:botIds};
 order.forEach(function(p,i){const c=CONQ_CORNERS[cornerSets[i]];g.owners[c]=p;g.base[p]=c;g.lives[p]=3;g.pts[p]=0;});
 CQH={dead:Date.now()+g.qdur+2000,bot:{},t:0};conqBotAnswers(g);
 patch.state="play";patch.game="conq";patch.round=(SALA.data.round||0)+1;patch.g=g;
 Object.keys(P).forEach(function(k){if(!P[k].bot){patch["players."+k+".ans"]=null;patch["players."+k+".pick"]=null;}});
 SALA.net.patch(SALA.code,patch).catch(function(e){toast(salaErr(e),false,2600);});
 if(CQH.iv)clearInterval(CQH.iv);CQH.iv=setInterval(conqHostTick,450);}
function conqBotAnswers(g){CQH.bot={};(g.bots||[]).forEach(function(b){if(g.qfor.indexOf(b)>=0)CQH.bot[b]={ok:Math.random()<.58,ms:3500+Math.random()*9000};});}
function conqWrite(g){g.v=(g.v||0)+1;SALA.net.patch(SALA.code,{g:g}).catch(function(){});}
function conqAsk(g,forPids,duel){g.qid++;g.qfor=forPids;g.phase=duel?"duel":"q";g.qdur=24000;CQH.dead=Date.now()+g.qdur+2000;conqBotAnswers(g);}
function conqShow(g,msg,ms,after){g.phase="show";g.msg=msg;CQH.showUntil=Date.now()+ms;CQH.after=after;}
function conqNextPick(g){
 while(g.pickQ.length&&!conqValidPicks(g,g.pickQ[0]).length)g.pickQ.shift();
 if(!g.pickQ.length||!conqFree(g).length)return conqAfterExpandRound(g);
 g.phase="pick";g.pickId++;CQH.dead=Date.now()+15000;CQH.t=Date.now();
 const who=(SALA.data.players[g.pickQ[0]]||{}).n||"…";g.msg="🗺️ "+who+" elige un territorio";}
function conqAfterExpandRound(g){
 if(!conqFree(g).length||g.round>=9)return conqStartBattle(g);
 g.round++;g.msg="Ronda "+g.round+": ¡responde para ganar territorio!";conqAsk(g,conqAlive(g),false);}
function conqStartBattle(g){
 const alive=conqAlive(g),R=alive.length<=2?4:3;g.turnList=[];for(let r=0;r<R;r++)alive.forEach(function(p){g.turnList.push(p);});
 g.ti=-1;conqShow(g,"⚔️ ¡Empiezan las batallas! Ataca un territorio vecino.",2600,function(g2){conqNextTurn(g2);});}
function conqNextTurn(g){
 for(;;){g.ti++;
  if(g.ti>=g.turnList.length||conqAlive(g).length<=1){g.phase="end";g.msg="🏁 ¡Fin de la partida!";return;}
  const a=g.turnList[g.ti];if(g.out[a]||!conqTargets(g,a).length)continue;
  g.phase="battle";g.pickId++;g.duel=null;CQH.dead=Date.now()+18000;CQH.t=Date.now();
  g.msg="⚔️ Turno de "+((SALA.data.players[a]||{}).n||"…")+": elige a quién atacar";return;}}
function conqResolveDuel(g,ans){
 const d=g.duel,A=ans[d.att]||{ok:false,ms:1e9},D=ans[d.def]||{ok:false,ms:1e9},nm=function(p){return(SALA.data.players[p]||{}).n||"…";};
 const win=A.ok&&(!D.ok||A.ms<D.ms);let msg;
 if(win){
  if(g.base[d.def]===d.cell){g.lives[d.def]--;
   if(g.lives[d.def]<=0){conqOwned(g,d.def).forEach(function(c){g.owners[c]=d.att;});g.out[d.def]=true;g.pts[d.att]+=1000;msg="🏰💥 ¡"+nm(d.att)+" conquistó el castillo de "+nm(d.def)+"!";}
   else{g.pts[d.att]+=300;msg="🏰 ¡"+nm(d.att)+" golpeó el castillo de "+nm(d.def)+"! Le quedan "+g.lives[d.def]+" ❤️";}}
  else{g.owners[d.cell]=d.att;g.pts[d.att]+=400;msg="⚔️ ¡"+nm(d.att)+" conquistó el territorio de "+nm(d.def)+"!";}}
 else{g.pts[d.def]+=100;msg="🛡️ ¡"+nm(d.def)+" defendió su territorio!";}
 g.duel=null;conqShow(g,msg,2800,function(g2){conqNextTurn(g2);});}
function conqHostTick(){
 if(!SALA.host||!SALA.data||SALA.data.game!=="conq"||SALA.data.state!=="play"){if(CQH.iv){clearInterval(CQH.iv);CQH.iv=null;}return;}
 const g=SALA.data.g;if(!g)return;const P=SALA.data.players||{},now=Date.now();
 /* quien salió de la sala queda fuera del juego */
 let changed=false;g.order.forEach(function(p){if(!g.out[p]&&!P[p]){g.out[p]=true;changed=true;}});
 if(g.phase==="q"||g.phase==="duel"){
  const ans={};let all=true;
  g.qfor.forEach(function(p){if(g.out[p])return;if(CQH.bot[p]){if(now-(CQH.dead-g.qdur-2000)>=CQH.bot[p].ms)ans[p]=CQH.bot[p];else all=false;return;}
   const a=P[p]&&P[p].ans;if(a&&a.id===g.qid)ans[p]=a;else all=false;});
  if(all||now>CQH.dead){
   if(g.phase==="duel")conqResolveDuel(g,ans);
   else{const win=Object.keys(ans).filter(function(p){return ans[p].ok;}).sort(function(a,b){return ans[a].ms-ans[b].ms;});
    if(!win.length)conqShow(g,"😅 Nadie acertó esta vez. ¡Otra pregunta!",1900,function(g2){conqAfterExpandRound(g2);});
    else{g.pickQ=win;g.lastWin=win.slice();conqNextPick(g);}}
   return conqWrite(g);}}
 else if(g.phase==="pick"){
  const who=g.pickQ[0],valid=conqValidPicks(g,who);let cell=null;
  if(P[who]&&P[who].bot){if(now-CQH.t>1400)cell=pick(valid);}
  else{const pk=P[who]&&P[who].pick;if(pk&&pk.id===g.pickId&&valid.indexOf(pk.cell)>=0)cell=pk.cell;else if(now>CQH.dead||g.out[who])cell=pick(valid);}
  if(cell!=null){g.owners[cell]=who;g.pts[who]+=200;g.pickQ.shift();conqNextPick(g);return conqWrite(g);}}
 else if(g.phase==="battle"){
  const a=g.turnList[g.ti],tg=conqTargets(g,a);let cell=null,skip=false;
  if(g.out[a]||!tg.length)skip=true;
  else if(P[a]&&P[a].bot){if(now-CQH.t>1700){const nb=tg.filter(function(c){return Object.keys(g.base).every(function(p){return g.base[p]!==c;});});cell=pick(nb.length?nb:tg);}}
  else{const pk=P[a]&&P[a].pick;if(pk&&pk.id===g.pickId&&tg.indexOf(pk.cell)>=0)cell=pk.cell;else if(now>CQH.dead)skip=true;}
  if(skip){conqNextTurn(g);return conqWrite(g);}
  if(cell!=null){const def=g.owners[cell];g.duel={att:a,def:def,cell:cell};g.msg="⚔️ "+((P[a]||{}).n||"…")+" ataca a "+((P[def]||{}).n||"…")+": ¡los dos responden!";conqAsk(g,[a,def],true);return conqWrite(g);}}
 else if(g.phase==="show"){if(now>CQH.showUntil){const f=CQH.after;CQH.after=null;if(f)f(g);return conqWrite(g);}}
 if(changed)conqWrite(g);}

/* ---------- PANTALLA (todos los jugadores) ---------- */
function conqStop(){if(CQ.iv)clearInterval(CQ.iv);if(CQH.iv)clearInterval(CQH.iv);CQ={};CQH={};}
function conqOnData(d){
 const g=d.g;if(!g)return;
 if(CQ.v===g.v&&document.getElementById("conqMap"))return;
 CQ.v=g.v;
 /* pregunta nueva para mí */
 const me=SALA.pid,mine=(g.phase==="q"||g.phase==="duel")&&g.qfor.indexOf(me)>=0&&!g.out[me];
 if(mine&&CQ.qid!==g.qid){CQ.qid=g.qid;CQ.q=salaQuestion();CQ.qStart=Date.now();CQ.answered=false;CQ.chosen=-1;}
 if(g.phase==="end"&&!CQ.ended){CQ.ended=true;const p=prof(),rank=conqRank(g),pos=rank.indexOf(me);p.coins+=pos===0?15:pos===1?8:4;p.xp+=20;save();try{if(pos===0){sWIN();confetti(30);}}catch(e){}}
 conqDraw(d);
 if(CQ.iv)clearInterval(CQ.iv);
 CQ.iv=setInterval(function(){
  if(!document.getElementById("salaRoot")){conqStop();salaLeave(true);return;}
  const g2=(SALA.data||{}).g;if(!g2)return;
  const bar=document.getElementById("conqT");
  if(bar&&CQ.qid===g2.qid&&!CQ.answered){const left=Math.max(0,1-(Date.now()-CQ.qStart)/g2.qdur);bar.style.width=(left*100)+"%";if(left<=0)conqAns(-1);}},250);}
function conqRank(g){return g.order.slice().sort(function(a,b){return(g.out[a]?1:0)-(g.out[b]?1:0)||(g.pts[b]||0)-(g.pts[a]||0);});}
function conqHexPts(cx,cy,s){let p="";for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30);p+=(cx+s*Math.cos(a)).toFixed(1)+","+(cy+s*Math.sin(a)).toFixed(1)+" ";}return p;}
function conqMapSVG(g,sel){
 const s=30,W=s*Math.sqrt(3);let out='<svg id="conqMap" viewBox="-150 -128 300 256" style="width:100%;max-height:46vh;display:block" font-family="Fredoka,Arial,sans-serif">';
 out+='<rect x="-150" y="-128" width="300" height="256" rx="18" fill="#BAE6FD"/>';
 CONQ_CELLS.forEach(function(c,i){
  const cx=W*(c.q+c.r/2),cy=s*1.5*c.r,o=g.owners[i],oi=o!=null?g.order.indexOf(o):-1,col=oi>=0?CONQ_COL[oi]:"#F1F5F9",isSel=sel&&sel.indexOf(i)>=0;
  const isBase=o!=null&&g.base[o]===i,duel=g.duel&&g.duel.cell===i;
  out+='<g'+(isSel?' onclick="conqPick('+i+')" style="cursor:pointer"':'')+'><polygon points="'+conqHexPts(cx,cy,s-1.5)+'" fill="'+col+'" fill-opacity="'+(o!=null&&g.out[o]?.35:o!=null?.88:1)+'" stroke="'+(duel?"#111827":isSel?"#FACC15":"#fff")+'" stroke-width="'+(duel||isSel?4:2)+'"'+(isSel?' stroke-dasharray="6 4"':'')+'/>'
   +'<text x="'+cx+'" y="'+(cy+(isBase?1:6))+'" text-anchor="middle" font-size="'+(isBase?20:15)+'">'+(isBase?"🏰":(o==null?CONQ_DECO[i]:""))+'</text>'
   +(isBase?'<text x="'+cx+'" y="'+(cy+17)+'" text-anchor="middle" font-size="8">'+"❤️".repeat(Math.max(0,g.lives[o]))+'</text>':'')
   +(duel?'<text x="'+cx+'" y="'+(cy-12)+'" text-anchor="middle" font-size="14">⚔️</text>':'')+'</g>';});
 return out+'</svg>';}
function conqDraw(d){
 const g=d.g,P=d.players||{},me=SALA.pid,T=salaTheme();
 let sel=null,panel="";
 const myTurnPick=g.phase==="pick"&&g.pickQ[0]===me,myAttack=g.phase==="battle"&&g.turnList[g.ti]===me;
 if(myTurnPick)sel=conqValidPicks(g,me);else if(myAttack)sel=conqTargets(g,me);
 const chips=g.order.map(function(p,i){const pl=P[p]||{n:"(salió)",e:"👻"};return '<div style="flex:1;min-width:64px;padding:4px 6px;border-radius:12px;border:3px solid '+CONQ_COL[i]+';background:'+(g.out[p]?"rgba(148,163,184,.25)":"rgba(255,255,255,.9)")+';color:#1E293B;font-size:.72rem;font-weight:800;text-align:center;line-height:1.25;opacity:'+(g.out[p]?.55:1)+'">'+esc(pl.e)+' '+esc(pl.n)+(p===me?" (tú)":"")+'<br>'+(g.pts[p]||0)+' pts</div>';}).join("");
 const inQ=(g.phase==="q"||g.phase==="duel")&&g.qfor.indexOf(me)>=0&&!g.out[me];
 if(g.phase==="end"){const rank=conqRank(g);
  panel='<div class="card center"><div style="font-size:2.4rem">'+(rank[0]===me?"🏆":"🏅")+'</div><h2 style="margin:4px 0">'+(rank[0]===me?"¡Ganaste la conquista!":"¡Fin de la partida!")+'</h2><div style="max-width:300px;margin:8px auto;text-align:left">'+rank.map(function(p,i){const pl=P[p]||{n:"(salió)",e:"👻"};return '<div style="display:flex;gap:8px;align-items:center;padding:4px 0;font-weight:'+(p===me?800:600)+'"><span style="font-size:1.2rem">'+(["🥇","🥈","🥉","4."][i])+'</span><span style="width:12px;height:12px;border-radius:50%;background:'+CONQ_COL[g.order.indexOf(p)]+'"></span><span style="flex:1">'+esc(pl.n)+'</span><span>'+(g.pts[p]||0)+' pts</span></div>';}).join("")+'</div></div>'
   +(SALA.host?'<button class="'+T.B+(T.teen?" acc":" green")+'" style="text-align:center" onclick="conqHostStart()">🔁 Otra partida</button><button class="'+T.B+(T.teen?"":" white")+'" style="text-align:center" onclick="salaAgain()">Volver a la sala</button>':'<div class="card center mut">El anfitrión puede iniciar otra partida.</div>');}
 else if(inQ){
  const q=CQ.q;
  panel='<div class="card" style="border:3px solid '+(g.phase==="duel"?"#DC2626":"#6366F1")+'"><b style="font-size:.85rem">'+(g.phase==="duel"?"⚔️ ¡Duelo! Responde bien y rápido":"🗺️ Responde para ganar territorio")+'</b><div style="height:8px;border-radius:6px;background:rgba(148,163,184,.35);overflow:hidden;margin:6px 0"><div id="conqT" style="height:100%;width:100%;background:#6366F1"></div></div>'
   +'<div style="font-family:Fredoka,sans-serif;font-weight:700;font-size:1.15rem;line-height:1.45;text-align:center;margin:6px 0">'+q.q+'</div></div>'
   +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+q.ops.map(function(o,i){let st="";if(CQ.answered){if(o.ok)st="background:#86EFAC;color:#14532D;";else if(i===CQ.chosen)st="background:#FCA5A5;color:#7F1D1D;";}
    return '<button class="'+T.B+(T.teen?" opt":" white")+'" '+(CQ.answered?"disabled":"")+' style="margin:0;min-height:52px;font-size:1rem;'+st+'" onclick="conqAns('+i+')">'+o.h+'</button>';}).join("")+'</div>'
   +(CQ.answered?'<p class="center mut" style="margin-top:8px">⏳ Esperando a los demás…</p>':'');}
 else if(myTurnPick)panel='<div class="card center" style="border:3px solid #FACC15"><b>👉 ¡Acertaste! Toca un territorio resaltado para quedártelo.</b></div>';
 else if(myAttack)panel='<div class="card center" style="border:3px solid #DC2626"><b>⚔️ Tu turno: toca un territorio enemigo resaltado para atacarlo.</b><br><span class="mut" style="font-size:.85rem">Los castillos 🏰 necesitan 3 golpes.</span></div>';
 else panel='<div class="card center mut">'+(g.out[me]?"Quedaste fuera, pero puedes ver cómo termina 👀":"⏳ Espera tu turno…")+'</div>';
 render(topbar("salaLeave()")+'<div id="salaRoot"></div>'
  +'<div style="display:flex;gap:5px;margin-bottom:6px">'+chips+'</div>'
  +'<div class="card" style="padding:6px;margin-bottom:6px">'+conqMapSVG(g,sel)+'</div>'
  +'<div class="card center" style="padding:8px 10px;margin-bottom:6px;font-weight:800;font-size:.95rem;color:#1E293B;background:#FEF9C3">'+esc(g.msg||"")+'</div>'
  +panel);}
function conqAns(i){
 const g=(SALA.data||{}).g;if(!g||CQ.answered||CQ.qid!==g.qid)return;
 CQ.answered=true;CQ.chosen=i;const ok=i>=0&&!!CQ.q.ops[i].ok,ms=Date.now()-CQ.qStart;
 try{recordAnswer("Salas en línea",ok,Math.round(ms/1000));if(ok)sOK();else sNO();}catch(e){}
 const patch={};patch["players."+SALA.pid+".ans"]={id:g.qid,ok:ok,ms:ms};SALA.net.patch(SALA.code,patch).catch(function(){});
 conqDraw(SALA.data);}
function conqPick(cell){
 const g=(SALA.data||{}).g;if(!g)return;
 const patch={};patch["players."+SALA.pid+".pick"]={id:g.pickId,cell:cell};SALA.net.patch(SALA.code,patch).catch(function(){});
 try{sOK();}catch(e){}}
