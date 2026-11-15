"use strict";
/* ============ ESCENARIO (preguntas dibujadas en CANVAS, no en HTML) ============
   Pedido: «que el contenido no se vea hecho con html sino con canvas», más moderno, fluido y con personajes.
   Un solo lienzo 2D donde vive la pregunta: fondo animado (cielo con nubes y colinas para el niño; espacio con
   estrellas para la adolescente/adulto), un PERSONAJE propio que reacciona (parpadea, mira, salta de alegría, anima
   cuando fallas), la pregunta en un globo de diálogo, las opciones como tarjetas con animación de entrada y de
   pulsación, barra de avance, partículas al acertar y sacudida al fallar.
   Lo usan el motor de retos del niño (CH), el examen (EX) y los quizzes del perfil adolescente (QZ).
   Si una pregunta trae HTML (diagramas, banderas, columnas) el motor que llama usa su pantalla anterior.
   API: Stage.open(id,{theme}) · Stage.ask({...}) · Stage.result({...}) · Stage.say(texto) · Stage.close()
   Pruebas: Stage.step(ms) avanza la animación a mano y Stage.pick(k) simula un toque. */

const Stage=(function(){
 let S0=null; /* estado del escenario activo */
 const FONT='"Fredoka","Nunito","Segoe UI",system-ui,sans-serif';
 const EMO='"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
 const OPT_COL=[["#FDE68A","#F59E0B"],["#BFDBFE","#3B82F6"],["#BBF7D0","#22C55E"],["#FBCFE8","#EC4899"],["#DDD6FE","#8B5CF6"]];
 function rr(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
 function wrap(c,text,maxW){
  const out=[];String(text).split("\n").forEach(function(par){const words=par.split(/\s+/);let line="";
   words.forEach(function(w){const t=line?line+" "+w:w;if(c.measureText(t).width>maxW&&line){out.push(line);line=w;}else line=t;});out.push(line);});
  return out;}
 const ease=function(k){return 1-Math.pow(1-Math.min(1,Math.max(0,k)),3);};
 const back=function(k){k=Math.min(1,Math.max(0,k));const s=1.6;return 1+(s+1)*Math.pow(k-1,3)+s*Math.pow(k-1,2);};

 /* ---------- personajes (dibujados a mano con trazos del lienzo) ---------- */
 function mascotKid(c,x,y,r,t,mood,look){
  const bob=Math.sin(t*2.2)*r*.035,jump=mood==="happy"?-Math.abs(Math.sin(t*9))*r*.28:0,sq=mood==="happy"?1+Math.sin(t*18)*.03:1;
  c.save();c.translate(x,y+bob+jump);
  c.fillStyle="rgba(30,42,74,.16)";c.beginPath();c.ellipse(0,r*1.02-jump-bob,r*.78*(1+jump/(r*2)),r*.16,0,0,7);c.fill();
  /* pies */
  c.fillStyle="#F59E0B";[-1,1].forEach(function(s){c.beginPath();c.ellipse(s*r*.36,r*.92,r*.24,r*.14,0,0,7);c.fill();});
  /* brazos */
  const up=mood==="happy"?-1.9+Math.sin(t*14)*.3:mood==="sad"?.5:.15+Math.sin(t*2.2)*.08;
  [-1,1].forEach(function(s){c.save();c.translate(s*r*.82,r*.12);c.rotate(s*up);c.fillStyle="#FBBF24";c.beginPath();c.ellipse(s*r*.14,r*.14,r*.16,r*.26,0,0,7);c.fill();c.restore();});
  /* cuerpo */
  const g=c.createRadialGradient(-r*.3,-r*.35,r*.1,0,0,r*1.1);g.addColorStop(0,"#FFE08A");g.addColorStop(1,"#FBBF24");
  c.fillStyle=g;c.beginPath();c.ellipse(0,0,r*.94*sq,r*.98/sq,0,0,7);c.fill();
  c.fillStyle="rgba(255,255,255,.55)";c.beginPath();c.ellipse(0,r*.34,r*.5,r*.42,0,0,7);c.fill();
  /* orejas y antena con estrella */
  c.fillStyle="#FBBF24";[-1,1].forEach(function(s){c.beginPath();c.ellipse(s*r*.62,-r*.78,r*.2,r*.26,s*.4,0,7);c.fill();});
  c.strokeStyle="#B45309";c.lineWidth=r*.05;c.lineCap="round";c.beginPath();c.moveTo(0,-r*.95);c.quadraticCurveTo(r*.12,-r*1.25,r*.02,-r*1.42);c.stroke();
  c.save();c.translate(r*.02,-r*1.5);c.rotate(t*1.5);c.fillStyle="#FDE047";c.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5,rad=i%2?r*.07:r*.16;c.lineTo(Math.cos(a)*rad,Math.sin(a)*rad);}c.closePath();c.fill();c.restore();
  /* ojos */
  const blink=(t%3.4)>3.25||mood==="happy"&&false,lx=(look?look[0]:0)*r*.07,ly=(look?look[1]:0)*r*.06;
  [-1,1].forEach(function(s){const ex=s*r*.33,ey=-r*.18;
   if(mood==="happy"){c.strokeStyle="#1E293B";c.lineWidth=r*.07;c.beginPath();c.arc(ex,ey+r*.04,r*.15,Math.PI*1.1,Math.PI*1.9);c.stroke();return;}
   c.fillStyle="#fff";c.beginPath();c.ellipse(ex,ey,r*.2,blink?r*.03:r*.24,0,0,7);c.fill();
   if(!blink){c.fillStyle="#1E293B";c.beginPath();c.arc(ex+lx,ey+ly+(mood==="sad"?r*.05:0),r*.11,0,7);c.fill();c.fillStyle="#fff";c.beginPath();c.arc(ex+lx+r*.04,ey+ly-r*.04,r*.035,0,7);c.fill();}
   if(mood==="sad"){c.strokeStyle="#92400E";c.lineWidth=r*.05;c.beginPath();c.moveTo(ex-s*r*.2,ey-r*.36);c.lineTo(ex+s*r*.14,ey-r*.28);c.stroke();}});
  /* mejillas y boca */
  c.fillStyle="rgba(244,114,182,.55)";[-1,1].forEach(function(s){c.beginPath();c.ellipse(s*r*.56,r*.1,r*.13,r*.09,0,0,7);c.fill();});
  c.strokeStyle="#7C2D12";c.fillStyle="#7C2D12";c.lineWidth=r*.06;c.lineCap="round";c.beginPath();
  if(mood==="happy"){c.arc(0,r*.14,r*.24,0,Math.PI);c.closePath();c.fill();c.fillStyle="#FB7185";c.beginPath();c.ellipse(0,r*.3,r*.12,r*.07,0,0,7);c.fill();}
  else if(mood==="sad"){c.arc(0,r*.36,r*.16,Math.PI*1.15,Math.PI*1.85);c.stroke();}
  else if(mood==="think"){c.ellipse(r*.04,r*.24,r*.07,r*.09,0,0,7);c.fill();}
  else{c.arc(0,r*.14,r*.2,Math.PI*.15,Math.PI*.85);c.stroke();}
  c.restore();}
 function mascotTeen(c,x,y,r,t,mood,look){
  const bob=Math.sin(t*2)*r*.04,jump=mood==="happy"?-Math.abs(Math.sin(t*9))*r*.22:0;
  c.save();c.translate(x,y+bob+jump);
  c.fillStyle="rgba(0,0,0,.35)";c.beginPath();c.ellipse(0,r*1.04-jump-bob,r*.7,r*.13,0,0,7);c.fill();
  /* cuerpo */
  let g=c.createLinearGradient(0,r*.2,0,r);g.addColorStop(0,"#6D28D9");g.addColorStop(1,"#4C1D95");c.fillStyle=g;rr(c,-r*.5,r*.25,r,r*.7,r*.25);c.fill();
  c.fillStyle="#22D3EE";c.beginPath();c.arc(0,r*.58,r*.11+Math.sin(t*4)*r*.015,0,7);c.fill();
  /* cabeza */
  g=c.createLinearGradient(0,-r,0,r*.3);g.addColorStop(0,"#A78BFA");g.addColorStop(1,"#7C3AED");c.fillStyle=g;rr(c,-r*.82,-r*.92,r*1.64,r*1.2,r*.42);c.fill();
  c.fillStyle="#0F0D1A";rr(c,-r*.62,-r*.62,r*1.24,r*.62,r*.26);c.fill();
  c.strokeStyle="#A78BFA";c.lineWidth=r*.06;c.lineCap="round";c.beginPath();c.moveTo(0,-r*.92);c.lineTo(0,-r*1.2);c.stroke();c.fillStyle=mood==="sad"?"#F472B6":"#22D3EE";c.beginPath();c.arc(0,-r*1.27,r*.09,0,7);c.fill();
  const col=mood==="happy"?"#4ADE80":mood==="sad"?"#F472B6":"#22D3EE",lx=(look?look[0]:0)*r*.05;
  c.strokeStyle=col;c.fillStyle=col;c.lineWidth=r*.09;c.shadowColor=col;c.shadowBlur=r*.25;
  const blink=(t%3.8)>3.65;
  [-1,1].forEach(function(s){const ex=s*r*.3+lx,ey=-r*.34;c.beginPath();
   if(mood==="happy"){c.arc(ex,ey+r*.05,r*.13,Math.PI*1.1,Math.PI*1.9);c.stroke();}
   else if(mood==="sad"){c.arc(ex,ey-r*.05,r*.12,Math.PI*.15,Math.PI*.85);c.stroke();}
   else if(blink){c.moveTo(ex-r*.12,ey);c.lineTo(ex+r*.12,ey);c.stroke();}
   else{c.ellipse(ex,ey,r*.1,r*.15,0,0,7);c.fill();}});
  c.beginPath();if(mood==="happy")c.arc(0,-r*.14,r*.12,0,Math.PI);else c.moveTo(-r*.1,-r*.1),c.lineTo(r*.1,-r*.1);c.stroke();
  c.shadowBlur=0;c.restore();}

 /* ---------- fondos ---------- */
 function bgKid(c,W,H,t,st){
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#7CC8FF");g.addColorStop(.55,"#CFEBFF");g.addColorStop(1,"#F0FBF4");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle="rgba(255,236,150,.9)";c.beginPath();c.arc(W-52,54,30+Math.sin(t*1.3)*2,0,7);c.fill();c.fillStyle="rgba(255,236,150,.25)";c.beginPath();c.arc(W-52,54,48+Math.sin(t*1.3)*4,0,7);c.fill();
  st.clouds.forEach(function(cl){const x=((cl.x+t*cl.v)%(W+240))-120;c.fillStyle="rgba(255,255,255,"+cl.a+")";[0,1,2].forEach(function(i){c.beginPath();c.ellipse(x+i*cl.s*.62,cl.y+(i===1?-cl.s*.22:0),cl.s*.55,cl.s*.36,0,0,7);c.fill();});});
  c.fillStyle="rgba(134,239,172,.55)";c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=20)c.lineTo(x,H-44-Math.sin(x*.012+1)*22);c.lineTo(W,H);c.fill();
  c.fillStyle="rgba(74,222,128,.6)";c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=20)c.lineTo(x,H-22-Math.sin(x*.02+3)*14);c.lineTo(W,H);c.fill();}
 function bgTeen(c,W,H,t,st){
  const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,"#1B1433");g.addColorStop(.6,"#0F0D1A");g.addColorStop(1,"#1E1145");c.fillStyle=g;c.fillRect(0,0,W,H);
  st.stars.forEach(function(s){c.fillStyle="rgba(255,255,255,"+(.25+.55*Math.abs(Math.sin(t*s.v+s.p)))+")";c.fillRect(s.x*W,s.y*H,s.r,s.r);});
  const gl=c.createRadialGradient(W*.8,H*.1,10,W*.8,H*.1,W*.7);gl.addColorStop(0,"rgba(139,92,246,.28)");gl.addColorStop(1,"rgba(139,92,246,0)");c.fillStyle=gl;c.fillRect(0,0,W,H);
  const g2=c.createRadialGradient(W*.1,H*.9,10,W*.1,H*.9,W*.6);g2.addColorStop(0,"rgba(34,211,238,.18)");g2.addColorStop(1,"rgba(34,211,238,0)");c.fillStyle=g2;c.fillRect(0,0,W,H);}

 /* ---------- disposición ---------- */
 function layout(st){
  const c=st.ctx,W=st.W,pad=14,teen=st.theme==="teen";
  const m=Math.max(64,Math.min(104,W*.2));st.m=m;
  let y=12;st.barY=y+22;y=st.barY+22;
  /* globo con la pregunta */
  const bx=pad+m*1.05,bw=W-bx-pad,q=st.q||{};
  const qlen=String(q.q||"").length,fs=qlen>110?17:qlen>60?19:qlen>28?21:24;st.qfs=fs;
  c.font="700 "+fs+"px "+FONT;st.qlines=wrap(c,q.q||"",bw-28);
  const picH=q.pic?54:0;
  let bh=Math.max(m*1.15,28+picH+st.qlines.length*fs*1.28);
  st.bub={x:bx,y:y,w:bw,h:bh};st.mx=pad+m*.5;st.my=y+Math.max(m*.62,bh*.5);
  y+=bh+16;
  /* opciones */
  const ops=q.ops||[],ofs=ops.some(function(o){return String(o).length>26;})?16:ops.some(function(o){return String(o).length>12;})?18:21;
  c.font="700 "+ofs+"px "+FONT;
  const two=ops.length>2&&ops.every(function(o){return c.measureText(String(o)).width<(W-pad*2-14)/2-62;});
  const cw=two?(W-pad*2-12)/2:W-pad*2;st.ofs=ofs;st.cards=[];
  let rowY=y,rowH=0;
  ops.forEach(function(o,i){const lines=wrap(c,String(o),cw-62),h=Math.max(58,24+lines.length*ofs*1.25);
   const col=two?i%2:0;if(two&&col===0&&i>0){rowY+=rowH+12;rowH=0;}else if(!two&&i>0){rowY+=rowH+12;rowH=0;}
   rowH=Math.max(rowH,h);st.cards.push({x:pad+col*(cw+12),y:rowY,w:cw,h:h,lines:lines,k:i});});
  if(two)for(let i=0;i<st.cards.length;i+=2){const hh=Math.max(st.cards[i].h,(st.cards[i+1]||{h:0}).h);st.cards[i].h=hh;if(st.cards[i+1])st.cards[i+1].h=hh;}
  y=rowY+rowH+14;
  /* fichas de «¿por qué?» y «seguir» */
  st.chipY=y;y+=st.res&&!st.res.ok?52:0;
  st.H=Math.max(teen?300:320,y+10);}
 function resize(st){
  const el=st.el,W=Math.max(280,el.clientWidth||340);st.W=W;layout(st);
  const d=Math.min(2,window.devicePixelRatio||1);st.cv.width=Math.round(W*d);st.cv.height=Math.round(st.H*d);st.cv.style.height=st.H+"px";st.ctx.setTransform(d,0,0,d,0,0);}

 /* ---------- dibujo ---------- */
 function draw(st,dt){
  const c=st.ctx,W=st.W,H=st.H,t=st.t,teen=st.theme==="teen",q=st.q||{};
  (teen?bgTeen:bgKid)(c,W,H,t,st);
  const tin=(t-st.tAsk);
  /* barra de avance */
  const n=Math.max(1,q.n||1),bx=14,bw=W-28;
  c.fillStyle=teen?"rgba(255,255,255,.12)":"rgba(255,255,255,.7)";rr(c,bx,st.barY,bw,10,5);c.fill();
  st.prog+=((q.i||0)/n-st.prog)*Math.min(1,dt*6);
  const pg=c.createLinearGradient(bx,0,bx+bw,0);pg.addColorStop(0,teen?"#22D3EE":"#34D399");pg.addColorStop(1,teen?"#A78BFA":"#3B82F6");c.fillStyle=pg;rr(c,bx,st.barY,Math.max(10,bw*st.prog),10,5);c.fill();
  c.font="700 14px "+FONT;c.textBaseline="alphabetic";c.textAlign="left";c.fillStyle=teen?"#E9E5FF":"#1E2A4A";c.fillText(q.title||"",bx,st.barY-7);
  c.textAlign="right";c.fillText(((q.i||0)+1)+" / "+n+(q.right!=null?"   "+q.right:""),W-14,st.barY-7);
  /* reloj (opcional) */
  if(q.timer&&st.phase==="ask"){const left=Math.max(0,1-(t-st.tAsk)*1000/q.timer.ms);c.fillStyle=left<.25?"#F87171":(teen?"#F472B6":"#F59E0B");rr(c,bx,st.barY+14,bw*left,4,2);c.fill();if(left<=0&&!st.timedOut){st.timedOut=true;const f=q.timer.onTimeout;setTimeout(function(){if(f)f();},0);}}
  /* personaje */
  const look=st.ptr?[Math.max(-1,Math.min(1,(st.ptr.x-st.mx)/120)),Math.max(-1,Math.min(1,(st.ptr.y-st.my)/120))]:[.6,.2];
  const mood=st.mood||(st.phase==="ask"&&tin<1.2?"think":"idle");
  (teen?mascotTeen:mascotKid)(c,st.mx,st.my,st.m*.42,t,mood,look);
  /* globo */
  const b=st.bub,pop=back(tin/.38),bs=.6+.4*Math.min(1,pop);
  c.save();c.translate(b.x+b.w/2,b.y+b.h/2);c.scale(bs,bs);c.translate(-(b.x+b.w/2),-(b.y+b.h/2));c.globalAlpha=Math.min(1,tin/.2);
  c.shadowColor="rgba(30,42,74,.18)";c.shadowBlur=16;c.shadowOffsetY=6;c.fillStyle=teen?"rgba(28,24,48,.94)":"rgba(255,255,255,.97)";rr(c,b.x,b.y,b.w,b.h,22);c.fill();c.shadowBlur=0;c.shadowOffsetY=0;
  c.beginPath();c.moveTo(b.x+2,b.y+b.h*.5-10);c.lineTo(b.x-12,b.y+b.h*.5+2);c.lineTo(b.x+2,b.y+b.h*.5+12);c.closePath();c.fill();
  if(teen){c.strokeStyle="rgba(167,139,250,.6)";c.lineWidth=1.5;rr(c,b.x,b.y,b.w,b.h,22);c.stroke();}
  let ty=b.y+14;
  if(q.pic){c.font="44px "+EMO;c.textAlign="center";c.textBaseline="top";c.fillStyle="#000";c.fillText(q.pic,b.x+b.w/2,ty);ty+=54;}
  const lines=st.sayLines||st.qlines,fs=st.sayLines?st.sayFs:st.qfs,th=lines.length*fs*1.28;
  ty=Math.max(ty,b.y+(q.pic?68:0)+((b.h-(q.pic?68:0))-th)/2);
  c.font="700 "+fs+"px "+FONT;c.textAlign="center";c.textBaseline="top";c.fillStyle=teen?"#F4F1FF":"#1E2A4A";
  lines.forEach(function(l,i){c.fillText(l,b.x+b.w/2,ty+i*fs*1.28);});
  c.restore();c.globalAlpha=1;
  /* opciones */
  const res=st.res;
  st.cards.forEach(function(cd,i){
   const kin=ease((tin-.18-i*.07)/.34),oy=(1-kin)*34,pr=st.press===i?.96:(st.hover===i&&!res?1.02:1);
   let fill=teen?"rgba(28,24,48,.92)":"#FFFFFF",stroke=teen?"rgba(139,92,246,.45)":"rgba(30,42,74,.08)",txt=teen?"#F4F1FF":"#1E2A4A",shake=0;
   const pal=OPT_COL[i%OPT_COL.length];
   if(res){const rt=t-st.tRes;
    if(i===res.correct){fill="#86EFAC";stroke="#16A34A";txt="#14532D";}
    else if(i===res.chosen&&!res.ok){fill="#FCA5A5";stroke="#DC2626";txt="#7F1D1D";shake=Math.sin(rt*40)*Math.max(0,1-rt*2.5)*8;}
    else c.globalAlpha=.45*kin;}
   else c.globalAlpha=kin;
   c.save();c.translate(cd.x+cd.w/2+shake,cd.y+cd.h/2+oy);c.scale(pr,pr);c.translate(-cd.w/2,-cd.h/2);
   c.shadowColor=teen?"rgba(0,0,0,.5)":"rgba(30,42,74,.16)";c.shadowBlur=12;c.shadowOffsetY=5;c.fillStyle=fill;rr(c,0,0,cd.w,cd.h,18);c.fill();c.shadowBlur=0;c.shadowOffsetY=0;
   c.strokeStyle=stroke;c.lineWidth=2;rr(c,0,0,cd.w,cd.h,18);c.stroke();
   const bg=c.createLinearGradient(0,0,0,cd.h);bg.addColorStop(0,pal[0]);bg.addColorStop(1,pal[1]);c.fillStyle=res&&i===res.correct?"#16A34A":res&&i===res.chosen?"#DC2626":bg;c.beginPath();c.arc(30,cd.h/2,17,0,7);c.fill();
   c.fillStyle="#fff";c.font="800 16px "+FONT;c.textAlign="center";c.textBaseline="middle";c.fillText(res&&i===res.correct?"✓":res&&i===res.chosen?"✗":"ABCDE"[i],30,cd.h/2+1);
   c.fillStyle=txt;c.font="700 "+st.ofs+"px "+FONT;c.textAlign="left";const lh=st.ofs*1.25,y0=cd.h/2-(cd.lines.length-1)*lh/2;
   cd.lines.forEach(function(l,j){c.fillText(l,56,y0+j*lh+1);});
   c.restore();c.globalAlpha=1;});
  /* fichas tras fallar */
  st.chips=[];
  if(res&&!res.ok){const cy=st.chipY,defs=[];if(res.why)defs.push(["🤖 ¿Por qué?","why"]);defs.push(["Seguir ▶","go"]);
   c.font="800 16px "+FONT;let tw=0;const ws=defs.map(function(d){const w=c.measureText(d[0]).width+34;tw+=w;return w;});tw+=(defs.length-1)*10;let x=(W-tw)/2;
   defs.forEach(function(d,i){const w=ws[i],go=d[1]==="go";c.fillStyle=go?(teen?"#8B5CF6":"#3B82F6"):(teen?"rgba(28,24,48,.95)":"#fff");c.shadowColor="rgba(30,42,74,.2)";c.shadowBlur=10;c.shadowOffsetY=4;rr(c,x,cy,w,42,21);c.fill();c.shadowBlur=0;c.shadowOffsetY=0;
    c.fillStyle=go?"#fff":(teen?"#F4F1FF":"#1E2A4A");c.textAlign="center";c.textBaseline="middle";c.fillText(d[0],x+w/2,cy+22);st.chips.push({x:x,y:cy,w:w,h:42,id:d[1]});x+=w+10;});}
  /* partículas */
  for(let i=st.parts.length-1;i>=0;i--){const p=st.parts[i];p.t+=dt;p.vy+=520*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;const a=Math.max(0,1-p.t/1.1);
   if(a<=0){st.parts.splice(i,1);continue;}c.save();c.translate(p.x,p.y);c.rotate(p.r);c.globalAlpha=a;c.fillStyle=p.c;
   if(p.star){c.beginPath();for(let k=0;k<10;k++){const an=k*Math.PI/5,rad=k%2?p.s*.45:p.s;c.lineTo(Math.cos(an)*rad,Math.sin(an)*rad);}c.closePath();c.fill();}else c.fillRect(-p.s/2,-p.s/3,p.s,p.s*.66);
   c.restore();}
  c.globalAlpha=1;}
 function burst(st,x,y){const cols=["#FDE047","#34D399","#60A5FA","#F472B6","#A78BFA","#FB923C"];
  for(let i=0;i<34;i++){const a=Math.random()*6.28,v=140+Math.random()*320;st.parts.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-220,vr:(Math.random()-.5)*10,r:0,t:0,s:5+Math.random()*7,c:cols[i%cols.length],star:i%3===0});}}
 function frame(st,dt){st.t+=dt;
  if(st.res&&st.res.autoMs&&!st.res.fired&&(st.t-st.tRes)*1000>=st.res.autoMs&&!st.res.hold){st.res.fired=true;const f=st.res.onDone;setTimeout(function(){if(f)f();},0);}
  draw(st,dt);}
 function hit(st,x,y){
  for(let i=0;i<(st.chips||[]).length;i++){const c=st.chips[i];if(x>=c.x&&x<=c.x+c.w&&y>=c.y&&y<=c.y+c.h)return{chip:c.id};}
  for(let i=0;i<st.cards.length;i++){const c=st.cards[i];if(x>=c.x&&x<=c.x+c.w&&y>=c.y&&y<=c.y+c.h)return{card:i};}
  return null;}
 function doPick(st,k){if(st.phase!=="ask"||!st.q||!st.q.onPick)return;st.phase="wait";const f=st.q.onPick;f(k);}
 function doChip(st,id){const r=st.res;if(!r)return;
  if(id==="why"&&r.why&&!r.asked){r.asked=true;r.hold=true;api.say("🤔 Pensando…");r.why();}
  else if(id==="go"&&!r.fired){r.fired=true;if(r.onDone)r.onDone();}}

 const api={
  ok:function(q,pic,ops){ /* ¿esta pregunta se puede dibujar en el lienzo? */
   if(typeof document==="undefined")return false;
   const bad=function(s){return /[<>]/.test(String(s==null?"":s));};
   if(bad(q)||bad(pic)||!ops||ops.length<2||ops.length>5||ops.some(bad))return false;
   return String(q).length<=240&&ops.every(function(o){return String(o).length<=90;})&&(!pic||String(pic).length<=8);},
  open:function(id,opts){
   const el=document.getElementById(id);if(!el)return null;api.close();
   const cv=document.createElement("canvas");cv.style.cssText="width:100%;display:block;border-radius:26px;touch-action:manipulation;box-shadow:0 14px 34px rgba(30,42,74,.22)";cv.setAttribute("role","img");
   el.innerHTML="";el.appendChild(cv);
   const st=S0={el:el,cv:cv,ctx:cv.getContext("2d"),theme:(opts&&opts.theme)||"kid",t:0,tAsk:0,prog:0,parts:[],cards:[],phase:"idle",W:340,H:320,
    clouds:[0,1,2,3].map(function(i){return{x:i*170+Math.random()*80,y:30+i*34+Math.random()*20,s:34+Math.random()*26,v:8+Math.random()*10,a:.55+Math.random()*.35};}),
    stars:Array.from({length:70},function(){return{x:Math.random(),y:Math.random(),r:Math.random()*2+.6,v:.6+Math.random()*2,p:Math.random()*6};})};
   const pos=function(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*(st.W/r.width),y:(e.clientY-r.top)*(st.H/r.height)};};
   cv.addEventListener("pointermove",function(e){const p=pos(e);st.ptr=p;const h=hit(st,p.x,p.y);st.hover=h&&h.card!=null?h.card:-1;cv.style.cursor=h?"pointer":"default";});
   cv.addEventListener("pointerdown",function(e){const p=pos(e),h=hit(st,p.x,p.y);st.press=h&&h.card!=null&&st.phase==="ask"?h.card:-1;st.down=h;});
   cv.addEventListener("pointerup",function(e){const p=pos(e),h=hit(st,p.x,p.y),d=st.down;st.press=-1;st.down=null;if(!h||!d)return;
    if(h.chip&&d.chip===h.chip)doChip(st,h.chip);else if(h.card!=null&&d.card===h.card)doPick(st,h.card);});
   cv.addEventListener("pointerleave",function(){st.press=-1;st.hover=-1;});
   st.key=function(e){const t=e.target&&e.target.tagName;if(t==="INPUT"||t==="TEXTAREA")return;const k="1234567".indexOf(e.key);if(k>=0&&k<st.cards.length&&st.phase==="ask"){e.preventDefault();doPick(st,k);}else if((e.key==="Enter"||e.key===" ")&&st.res&&!st.res.ok){e.preventDefault();doChip(st,"go");}};
   document.addEventListener("keydown",st.key);
   if(window.ResizeObserver){st.ro=new ResizeObserver(function(){if(S0===st)resize(st);});st.ro.observe(el);}
   resize(st);let last=performance.now();
   (function loop(){if(S0!==st)return;st.raf=requestAnimationFrame(loop);const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;frame(st,dt);})();
   return api;},
  ask:function(q){const st=S0;if(!st)return;st.q=q;st.res=null;st.sayLines=null;st.mood=null;st.phase="ask";st.tAsk=st.t;st.timedOut=false;st.press=-1;st.hover=-1;
   st.cv.setAttribute("aria-label",String(q.q||"")+". Opciones: "+(q.ops||[]).join(", "));resize(st);},
  result:function(r){const st=S0;if(!st)return;st.res=r;st.tRes=st.t;st.phase="res";st.mood=r.ok?"happy":"sad";
   if(r.ok){const cd=st.cards[r.correct];if(cd)burst(st,cd.x+cd.w/2,cd.y+cd.h/2);}
   resize(st);if(r.msg)api.say(r.msg);},
  say:function(text){const st=S0;if(!st)return;const c=st.ctx,len=String(text).length,fs=len>150?15:len>90?17:len>40?19:22;c.font="700 "+fs+"px "+FONT;st.sayFs=fs;st.sayLines=wrap(c,text,st.bub.w-28);
   const need=28+(st.q&&st.q.pic?54:0)+st.sayLines.length*fs*1.28;if(need>st.bub.h){const dy=need-st.bub.h;st.bub.h=need;st.cards.forEach(function(cd){cd.y+=dy;});st.chipY+=dy;st.H+=dy;const d=Math.min(2,window.devicePixelRatio||1);st.cv.height=Math.round(st.H*d);st.cv.style.height=st.H+"px";st.ctx.setTransform(d,0,0,d,0,0);}},
  mood:function(m){if(S0)S0.mood=m;},
  _m:function(c,theme,x,y,r,t){(theme==="teen"?mascotTeen:mascotKid)(c,x,y,r,t,"idle",[.4,.1]);},
  active:function(){return !!S0;},
  close:function(){const st=S0;if(!st)return;S0=null;try{cancelAnimationFrame(st.raf);if(st.ro)st.ro.disconnect();document.removeEventListener("keydown",st.key);}catch(e){}},
  /* pruebas */
  step:function(ms){const st=S0;if(!st)return;for(let t=0;t<ms;t+=16)frame(st,.016);},
  pick:function(k){if(S0)doPick(S0,k);},
  chip:function(id){if(S0)doChip(S0,id);},
  state:function(){const st=S0;return st?{phase:st.phase,cards:st.cards.length,H:st.H,W:st.W,mood:st.mood,chips:(st.chips||[]).map(function(c){return c.id;}),say:st.sayLines?st.sayLines.join(" "):null}:null;}};
 return api;})();
function stageCleanup(){try{Stage.close();}catch(e){}}
/* dibuja solo el personaje (pantalla de inicio) */
function stageMascot(canvasId,theme){
 const cv=document.getElementById(canvasId);if(!cv)return;const c=cv.getContext("2d"),d=Math.min(2,window.devicePixelRatio||1),W=cv.clientWidth||96,H=cv.clientHeight||96;cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0);
 let t=0,last=performance.now();
 (function loop(){if(!document.body.contains(cv))return;requestAnimationFrame(loop);const now=performance.now();t+=Math.min(.05,(now-last)/1000);last=now;c.clearRect(0,0,W,H);
  Stage._m(c,theme,W/2,H*.58,Math.min(W,H)*.36,t);})();}
