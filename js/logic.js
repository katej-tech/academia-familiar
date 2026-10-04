"use strict";
/* ============ LÓGICA VISUAL 3D (juegos) ============
   Pedido: "lógica" y, como siempre, en 3D. Cuatro juegos que nunca se repiten (los puzzles se
   generan con reglas, no son una lista fija) y que suben de nivel solos: 3 aciertos seguidos a la
   primera = nivel siguiente (reusa p.brainLv / p.brainStreak como Cerebro en forma).
   1) Patrones: ¿qué figura 3D sigue?   2) Matriz: completa la cuadrícula 3x3.
   3) Torre de cubos: gírala, cuenta los cubos o elige la vista desde arriba.
   4) Balanzas: deduce cuánto pesa una fruta comparando balanzas.
   Los puzzles de patrones/matriz se tocan dentro del propio canvas 3D (raycast).
   Motor 3D: js/logic3d.js. Prefijos lg/LG/LGX. */

const LG_SHAPES=["esfera","cubo","cono","anillo","estrella","piramide","cilindro"];
const LG_COLORS=["#EF4444","#3B82F6","#FACC15","#22C55E","#A855F7","#F97316"];
const LG_COLOR_NAMES={"#EF4444":"rojo","#3B82F6":"azul","#FACC15":"amarillo","#22C55E":"verde","#A855F7":"morado","#F97316":"naranja"};
const LG_SHAPE_NAMES={esfera:"esfera",cubo:"cubo",cono:"cono",anillo:"anillo",estrella:"estrella",piramide:"pirámide",cilindro:"cilindro"};
const LG_GAMES=[
 {id:"lgpat",ic:"🔷",nm:"Patrones",sub:"¿Qué figura sigue?",max:5,go:"lgStart('lgpat')"},
 {id:"lgmat",ic:"🧱",nm:"Matriz mágica",sub:"Completa la cuadrícula",max:4,go:"lgStart('lgmat')"},
 {id:"lgstack",ic:"🧊",nm:"Torre de cubos",sub:"Gírala, cuenta y mira desde arriba",max:3,go:"lgStart('lgstack')"},
 {id:"lgscale",ic:"⚖️",nm:"Balanzas",sub:"¿Cuánto pesa cada fruta?",max:5,go:"lgStart('lgscale')"}];
const LG_WIN={noWorld:true,replay:"screenLogicLab()",replayLabel:"Más lógica 🧩",backFn:"screenKidMap()",backLabel:"Ir a los mundos 🌍"};
let LGX={};

function lgLv(id){const p=prof();if(!p.brainLv)p.brainLv={};return p.brainLv[id]||1;}
function lgBump(id,ok,max){
 const p=prof();if(!p.brainLv)p.brainLv={};if(!p.brainStreak)p.brainStreak={};
 if(ok){p.brainStreak[id]=(p.brainStreak[id]||0)+1;
  if(p.brainStreak[id]>=3&&(p.brainLv[id]||1)<max){p.brainLv[id]=(p.brainLv[id]||1)+1;p.brainStreak[id]=0;save();return true;}}
 else p.brainStreak[id]=0;
 save();return false;}
function lgKey(it){return it.shape+"|"+it.color+"|"+(it.size||1);}
function lgName(it){return LG_SHAPE_NAMES[it.shape]+" "+LG_COLOR_NAMES[it.color];}
function lgStop(){if(LGX.timer)clearTimeout(LGX.timer);LGX.timer=null;}
function lgCleanup(){lgStop();LGX={};}

/* ---------- menú ---------- */
function screenLogicLab(){setTheme("kid");
 lgCleanup();
 const cards=LG_GAMES.map(function(g){return '<button class="kbtn white" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="'+g.go+'"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">'+g.ic+'</span><span style="flex:1"><span>'+g.nm+'</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">'+g.sub+' · nivel '+lgLv(g.id)+'/'+g.max+'</span></span></button>';}).join("");
 render(topbar("screenKidMap()")+subHeader("🧩 Lógica visual 3D")
  +'<p class="center" style="margin:-4px 0 10px">Puzzles nuevos cada vez. Si aciertas 3 seguidos a la primera, ¡subes de nivel!</p>'+cards
  +(typeof gameLogic==="function"?'<button class="kbtn yellow" style="margin-top:8px" onclick="gameLogic()">🤔 Acertijos y adivinanzas</button>':""));}

/* ---------- generadores ---------- */
function lgMutate(it,pool,attrs){
 /* devuelve una copia de it cambiando UN atributo */
 const a=attrs[Math.floor(Math.random()*attrs.length)],c=Object.assign({},it);
 if(a==="shape")c.shape=pick(LG_SHAPES.filter(function(s){return s!==it.shape;}));
 else if(a==="color")c.color=pick(LG_COLORS.filter(function(s){return s!==it.color;}));
 else c.size=Math.max(.6,Math.min(1.4,(it.size||1)+pick([-.3,-.15,.15,.3])));
 return c;}
function lgOptions(correct,attrs,pool){
 const seen={},list=[correct];seen[lgKey(correct)]=1;let guard=0;
 while(list.length<4&&guard++<60){
  /* a veces cambia dos atributos, para que los señuelos no sean tan obvios */
  let d=lgMutate(pool&&Math.random()<.5?pick(pool):correct,pool,attrs);
  if(attrs.length>1&&Math.random()<.4)d=lgMutate(d,pool,attrs);
  const k=lgKey(d);if(seen[k]||k===lgKey(correct))continue;seen[k]=1;list.push(d);}
 return shuffled(list);}

function lgGenPattern(lv){
 const sh=shuffled(LG_SHAPES),co=shuffled(LG_COLORS);let seq=[],hint="",attrs=["shape","color"],ans;
 const mk=function(s,c,z){return{shape:s,color:c,size:z||1};};
 if(lv===1){
  const a=mk(sh[0],co[0]),b=mk(sh[0],co[1]);
  for(let i=0;i<6;i++)seq.push(i%2?b:a);
  ans=a;attrs=["color"];
  hint="Es la misma figura, pero los colores se turnan: "+LG_COLOR_NAMES[a.color]+", "+LG_COLOR_NAMES[b.color]+", "+LG_COLOR_NAMES[a.color]+"…";
 }else if(lv===2){
  const tpl=pick(["AAB","ABB","ABC"]),map={A:mk(sh[0],co[0]),B:mk(sh[1],co[1]),C:mk(sh[2],co[2])},per=tpl.length;
  for(let i=0;i<per*2+1;i++)seq.push(map[tpl[i%per]]);
  ans=map[tpl[seq.length%per]];
  hint="Un grupo de figuras se repite una y otra vez: "+tpl.split("").map(function(l){return lgName(map[l]);}).join(", ")+".";
 }else if(lv===3){
  /* la forma se repite cada 2 y el color cada 3 */
  const S=[sh[0],sh[1]],C=[co[0],co[1],co[2]];
  for(let i=0;i<7;i++)seq.push(mk(S[i%2],C[i%3]));
  ans=mk(S[7%2],C[7%3]);
  hint="Mira la forma y el color por separado: la forma se repite cada 2 y el color cada 3.";
 }else if(lv===4){
  const sizes=[.6,.75,.9,1.05,1.2,1.35];
  for(let i=0;i<5;i++)seq.push(mk(sh[0],i%2?co[1]:co[0],sizes[i]));
  ans=mk(sh[0],co[1],sizes[5]);attrs=["color","size"];
  hint="Las figuras van creciendo y los colores se turnan.";
 }else{
  const m=[mk(sh[0],co[0]),mk(sh[1],co[1]),mk(sh[2],co[2]),mk(sh[3],co[3])];
  seq=[m[0],m[1],m[2],m[3],m[2],m[1]];ans=m[0];
  hint="¡Es un espejo! Va hacia el centro y vuelve por el mismo camino.";
 }
 return{rows:[seq.concat([null])],ans:ans,options:lgOptions(ans,attrs,seq),hint:hint,q:"¿Qué figura sigue?"};}

function lgGenMatrix(lv){
 const S=shuffled(LG_SHAPES).slice(0,3),C=shuffled(LG_COLORS).slice(0,3),Z=[.75,1,1.25];
 const grid=[];
 for(let r=0;r<3;r++){grid.push([]);for(let c=0;c<3;c++){
  let it;
  if(lv===1)it={shape:S[r],color:C[c],size:1};
  else if(lv===2)it={shape:S[(r+c)%3],color:C[c],size:1};
  else if(lv===3)it={shape:S[(r+c)%3],color:C[(r+2*c)%3],size:1};
  else it={shape:S[(r+c)%3],color:C[(r+2*c)%3],size:Z[c]};
  grid[r].push(it);}}
 const mr=lv>=3?Math.floor(Math.random()*3):2,mc=lv>=3?Math.floor(Math.random()*3):2;
 const ans=grid[mr][mc];
 const rows=grid.map(function(row,r){return row.map(function(it,c){return(r===mr&&c===mc)?null:it;});});
 const attrs=lv===1?["shape","color"]:lv===2?["shape","color"]:lv===3?["shape","color"]:["shape","color","size"];
 const hint=lv===1?"Cada fila tiene su figura y cada columna su color.":lv===2?"El color depende de la columna y la figura va cambiando en cada fila.":lv===3?"Ni la figura ni el color se repiten en la misma fila o columna.":"Además, el tamaño crece de izquierda a derecha.";
 return{rows:rows,ans:ans,options:lgOptions(ans,attrs,grid[0].concat(grid[1],grid[2])),hint:hint,q:"¿Qué figura va en el ❓?"};}

function lgGenStack(lv,idx){
 const N=lv===1?2:3,maxH=lv===1?2:lv===2?2:3;
 let H,sum;
 do{H=[];sum=0;for(let r=0;r<N;r++){H.push([]);for(let c=0;c<N;c++){const v=(lv>=2&&Math.random()<.2)?0:1+Math.floor(Math.random()*maxH);H[r].push(v);sum+=v;}}}while(sum<(N===2?4:7));
 const top=lv>=2&&idx%2===1;
 if(!top){
  const ops={};ops[sum]=1;while(Object.keys(ops).length<4){const v=sum+pick([-3,-2,-1,1,2,3]);if(v>0)ops[v]=1;}
  return{kind:"count",H:H,ans:sum,options:shuffled(Object.keys(ops).map(Number)),q:"¿Cuántos cubos tiene la torre en total?",hint:"Cuenta cada columna de abajo hacia arriba y suma. ¡Gira la torre para ver las partes escondidas!"};}
 const key=function(M){return M.map(function(r){return r.join("");}).join("/");};
 const trans=H[0].map(function(_,c){return H.map(function(r){return r[c];});});
 const mirror=H.map(function(r){return r.slice().reverse();});
 const flip=H.slice().reverse();
 const opts={},list=[H];opts[key(H)]=1;
 [trans,mirror,flip].forEach(function(M){if(!opts[key(M)]){opts[key(M)]=1;list.push(M);}});
 let guard=0;while(list.length<4&&guard++<40){const M=H.map(function(r){return r.slice();});const r=Math.floor(Math.random()*N),c=Math.floor(Math.random()*N);M[r][c]=(M[r][c]+1+Math.floor(Math.random()*2))%(maxH+1);if(!opts[key(M)]){opts[key(M)]=1;list.push(M);}}
 const shuf=shuffled(list.slice(0,4));
 return{kind:"top",H:H,ans:key(H),opts:shuf,options:shuf.map(key),q:"¿Cuál es la vista desde ARRIBA? Los números son cuántos cubos hay en cada casilla.",hint:"Toca «Vista de arriba»: el frente de la torre queda abajo. Cada casilla muestra la altura de su columna."};}

function lgGenScale(lv){
 const fr=shuffled(["🍎","🍌","🍇","🍓","🍊","🍐","🍒","🍉"]).slice(0,3),A=fr[0],B=fr[1],G=fr[2];
 const rep=function(e,n){return Array(n).fill(e);};
 let sc=[],q,ans,hint;
 if(lv===1){const x=2+Math.floor(Math.random()*3);sc=[{L:[A],R:rep(G,x)}];q={L:[A,A]};ans=2*x;hint="1 "+A+" pesa lo mismo que "+x+" "+G+". Entonces 2 "+A+" pesan el doble.";}
 else if(lv===2){const x=2+Math.floor(Math.random()*2),y=2+Math.floor(Math.random()*2);sc=[{L:[A],R:rep(G,x)},{L:[B],R:rep(A,y)}];q={L:[B]};ans=x*y;hint="1 "+B+" = "+y+" "+A+", y cada "+A+" = "+x+" "+G+". Entonces "+y+" × "+x+".";}
 else if(lv===3){const k=3+Math.floor(Math.random()*3);sc=[{L:[A,G],R:[B]},{L:[B],R:rep(G,k)}];q={L:[A]};ans=k-1;hint=A+" + "+G+" pesa como "+B+", y "+B+" pesa "+k+" "+G+". A "+k+" le quitas 1 "+G+".";}
 else if(lv===4){const k=pick([4,6,8]),m=pick([1,3]);sc=[{L:[A,A],R:[B]},{L:[B],R:rep(G,k)}];q={L:rep(A,m)};ans=m*k/2;hint="2 "+A+" = 1 "+B+" = "+k+" "+G+". Entonces 1 "+A+" = "+(k/2)+" "+G+".";}
 else{const k=2+Math.floor(Math.random()*3);sc=[{L:[A],R:[B,G]},{L:[B],R:rep(G,k)}];q={L:[A,A]};ans=2*(k+1);hint="1 "+A+" = 1 "+B+" + 1 "+G+" = "+(k+1)+" "+G+". Dos "+A+" pesan el doble.";}
 const ops={};ops[ans]=1;while(Object.keys(ops).length<4){const v=ans+pick([-3,-2,-1,1,2,3,4]);if(v>0)ops[v]=1;}
 return{scales:sc.map(function(s){return{L:s.L,R:s.R};}).concat([{L:q.L,R:[],unknown:true}]),ans:ans,G:G,options:shuffled(Object.keys(ops).map(Number)),q:"Para equilibrar la última balanza, ¿cuántas "+G+" hacen falta?",hint:hint};}

/* ---------- motor común ---------- */
function lgStart(kind){
 lgCleanup();
 LGX={kind:kind,i:0,ok:0,total:6,lv:lgLv(kind),game:LG_GAMES.find(function(g){return g.id===kind;}),leveled:false};
 lgNext();}
function lgHeader(){
 return '<div class="progressdots">'+dots(LGX.total,LGX.i)+'</div>'
  +'<p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">'+LGX.game.ic+' '+LGX.game.nm+' · nivel '+LGX.lv+'</p>';}
function lgNext(){
 lgStop();
 if(LGX.i>=LGX.total){
  const stars=starsFor(LGX.ok,LGX.total);recordAnswer("Lógica",stars>=2,40);save();nodeWin(stars,"Lógica",LG_WIN);return;}
 LGX.lv=lgLv(LGX.kind);LGX.tried=false;LGX.done=false;LGX.t0=Date.now();
 const k=LGX.kind;
 if(k==="lgpat"||k==="lgmat"){
  const P=LGX.P=k==="lgpat"?lgGenPattern(LGX.lv):lgGenMatrix(LGX.lv);
  render(topbar("screenLogicLab()")+lgHeader()
   +'<div class="card" style="padding:10px 12px"><b>'+P.q+'</b><br><span class="mut" style="font-size:.85rem">Toca la figura de abajo que completa el patrón 👇</span></div>'
   +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="lgCanvas" style="width:100%;height:'+(k==="lgpat"?'clamp(210px,36vh,280px)':'clamp(340px,56vh,430px)')+'"></div></div>'
   +'<div id="lgFb"></div>');
  LGX.c3=render3DPuzzle("lgCanvas",{rows:P.rows,options:P.options,onPick:lgPickPuzzle});
 }else if(k==="lgstack"){
  const P=LGX.P=lgGenStack(LGX.lv,LGX.i);
  render(topbar("screenLogicLab()")+lgHeader()
   +'<div class="card" style="padding:10px 12px"><b>'+P.q+'</b></div>'
   +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="lgCanvas" style="width:100%;height:clamp(230px,38vh,310px)"></div></div>'
   +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:6px 0"><button class="kbtn white" style="margin:0;min-height:44px;font-size:.85rem;padding:4px" onclick="LGX.c3.top()">👆 Vista de arriba</button><button class="kbtn white" style="margin:0;min-height:44px;font-size:.85rem;padding:4px" onclick="LGX.c3.front()">👀 De frente</button><button class="kbtn white" style="margin:0;min-height:44px;font-size:.85rem;padding:4px" onclick="LGX.c3.home()">🔄 Girar</button></div>'
   +'<p class="center mut" style="font-size:.8rem;margin:0 0 6px">Arrastra la torre con el dedo para girarla</p>'
   +'<div id="lgOpts" style="display:grid;grid-template-columns:'+(P.kind==="top"?'1fr 1fr':'1fr 1fr')+';gap:8px">'+lgStackOptsHtml(P)+'</div>'
   +'<div id="lgFb"></div>');
  LGX.c3=render3DStack("lgCanvas",P.H);
 }else{
  const P=LGX.P=lgGenScale(LGX.lv);
  render(topbar("screenLogicLab()")+lgHeader()
   +'<div class="card" style="padding:10px 12px"><b>'+P.q+'</b><br><span class="mut" style="font-size:.85rem">Las balanzas de arriba están equilibradas ⚖️</span></div>'
   +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="lgCanvas" style="width:100%;height:clamp(300px,52vh,420px)"></div></div>'
   +'<div id="lgOpts" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">'+P.options.map(function(o,i){return '<button class="kbtn white" id="lgO'+i+'" style="margin:0;min-height:56px;font-size:1.3rem" onclick="lgPickNum('+i+')">'+o+' '+P.G+'</button>';}).join("")+'</div>'
   +'<div id="lgFb"></div>');
  LGX.c3=render3DScales("lgCanvas",P.scales);}}
function lgStackOptsHtml(P){
 if(P.kind==="count")return P.options.map(function(o,i){return '<button class="kbtn white" id="lgO'+i+'" style="margin:0;min-height:56px;font-size:1.4rem" onclick="lgPickNum('+i+')">'+o+' 🧊</button>';}).join("");
 return P.opts.map(function(M,i){
  return '<button id="lgO'+i+'" onclick="lgPickNum('+i+')" style="border:3px solid #1E2A4A;border-radius:14px;background:#fff;padding:8px;cursor:pointer"><div style="display:grid;grid-template-columns:repeat('+M.length+',1fr);gap:3px">'
   +M.map(function(row){return row.map(function(v){return '<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:6px;font-family:Fredoka;font-weight:800;font-size:1.2rem;background:'+(v?["#BFDBFE","#BBF7D0","#FEF08A","#FBCFE8"][(v-1)%4]:"#F1F5F9")+'">'+v+'</div>';}).join("");}).join("")
   +'</div></button>';}).join("");}

/* ---------- respuestas ---------- */
function lgResult(ok,msg){
 const first=!LGX.tried;
 const f=document.getElementById("lgFb");
 if(ok){
  if(first)LGX.ok++;
  const up=lgBump(LGX.kind,first,LGX.game.max);
  recordAnswer("Lógica",first,Math.round((Date.now()-LGX.t0)/1000));
  sOK();confetti(first?10:4);
  if(f)f.innerHTML='<p style="text-align:center;font-weight:800;color:#16A34A;margin-top:8px">'+(first?'✅ ¡Excelente!':'✅ ¡Lo lograste!')+(up?' · ⬆️ ¡Subiste al nivel '+lgLv(LGX.kind)+'!':'')+'</p>';
  LGX.done=true;LGX.i++;LGX.timer=setTimeout(lgNext,up?2200:1500);
 }else{
  if(!LGX.tried)lgBump(LGX.kind,false,LGX.game.max);
  LGX.tried=true;sNO();
  if(f)f.innerHTML='<div class="card" style="background:#FEF3C7;margin-top:8px">💡 <b>Pista:</b> '+esc(LGX.P.hint)+'</div>';
 }}
function lgPickPuzzle(i){
 if(LGX.done||!LGX.c3)return;
 const P=LGX.P,ok=lgKey(P.options[i])===lgKey(P.ans);
 LGX.c3.mark(i,ok);
 if(ok){LGX.c3.lock(true);LGX.c3.reveal(P.ans);}
 lgResult(ok);}
function lgPickNum(i){
 if(LGX.done)return;
 const P=LGX.P,b=document.getElementById("lgO"+i);
 const ok=P.kind==="top"?P.options[i]===P.ans:P.options[i]===P.ans;
 if(b)b.style.background=ok?"#86EFAC":"#FCA5A5";
 if(ok&&LGX.kind==="lgscale"&&LGX.c3)LGX.c3.solve(Array(P.ans).fill(P.G));
 if(ok&&LGX.kind==="lgstack"&&LGX.c3)LGX.c3.top();
 if(!ok&&b)b.disabled=true;
 lgResult(ok);}
