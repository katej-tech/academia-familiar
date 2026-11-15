"use strict";
/* ============ CASOS DE FACTORIZACIÓN (perfil adolescente) ============
   Pedido: «para la adolescente me gustaría que se hicieran los casos de factorización».
   7 casos (los del álgebra de bachillerato) + «¿qué caso es?» + mezcla. Cada caso tiene:
   · una explicación corta (cuándo se usa, la fórmula y un ejemplo paso a paso),
   · práctica INFINITA: los ejercicios se generan al azar (coeficientes distintos cada vez),
   · al responder se muestra el paso a paso de ESE ejercicio.
   Cada opción lleva su función numérica (f) para poder comprobar por máquina que solo una es correcta.
   Prefijo fac / FAC. */

const FAC_CASES=[
 {id:"fc",ic:"1️⃣",nm:"Factor común",f:"ab + ac = a(b + c)",
  when:"Cuando TODOS los términos tienen un número o una letra en común.",
  steps:["Busca el mayor número que divide a todos los coeficientes (MCD).","Busca la letra común con el <b>menor</b> exponente.","Escribe ese factor afuera y, dentro del paréntesis, lo que queda al dividir cada término."],
  ex:["6x<sup>3</sup> + 9x<sup>2</sup>","MCD de 6 y 9 = 3 · letra común: x<sup>2</sup>","= 3x<sup>2</sup>(2x + 3)"]},
 {id:"ag",ic:"2️⃣",nm:"Factor común por agrupación",f:"ax + ay + bx + by = (a + b)(x + y)",
  when:"Cuando hay 4 términos y no todos comparten factor, pero por parejas sí.",
  steps:["Agrupa los términos de dos en dos.","Saca factor común de cada grupo.","Queda un paréntesis repetido: sácalo como factor común."],
  ex:["2xy + 6x + 3y + 9","= 2x(y + 3) + 3(y + 3)","= (2x + 3)(y + 3)"]},
 {id:"dc",ic:"3️⃣",nm:"Diferencia de cuadrados",f:"a<sup>2</sup> − b<sup>2</sup> = (a + b)(a − b)",
  when:"Cuando hay 2 términos con raíz cuadrada exacta y están RESTANDO.",
  steps:["Saca la raíz cuadrada de cada término.","Escribe la suma por la diferencia de esas raíces."],
  ex:["9x<sup>2</sup> − 16","√(9x<sup>2</sup>) = 3x · √16 = 4","= (3x + 4)(3x − 4)"]},
 {id:"tcp",ic:"4️⃣",nm:"Trinomio cuadrado perfecto",f:"a<sup>2</sup> ± 2ab + b<sup>2</sup> = (a ± b)<sup>2</sup>",
  when:"Cuando hay 3 términos: el primero y el último tienen raíz cuadrada exacta y el del medio es el doble del producto de esas raíces.",
  steps:["Saca la raíz del primero y del último.","Comprueba: 2 · (raíz 1) · (raíz 2) = término del medio.","Escribe (raíz 1 ± raíz 2)<sup>2</sup> con el signo del término del medio."],
  ex:["4x<sup>2</sup> + 12x + 9","√(4x<sup>2</sup>) = 2x · √9 = 3 · 2(2x)(3) = 12x ✔","= (2x + 3)<sup>2</sup>"]},
 {id:"tx",ic:"5️⃣",nm:"Trinomio x² + bx + c",f:"x<sup>2</sup> + bx + c = (x + m)(x + n)",
  when:"Cuando el primer término es x<sup>2</sup> (coeficiente 1) y hay 3 términos.",
  steps:["Busca dos números que <b>multiplicados</b> den c.","…y que <b>sumados</b> den b.","Escribe (x + m)(x + n)."],
  ex:["x<sup>2</sup> + 7x + 12","3 · 4 = 12 y 3 + 4 = 7","= (x + 3)(x + 4)"]},
 {id:"tax",ic:"6️⃣",nm:"Trinomio ax² + bx + c",f:"ax<sup>2</sup> + bx + c = (px + q)(rx + s)",
  when:"Cuando hay 3 términos y el coeficiente de x<sup>2</sup> NO es 1.",
  steps:["Multiplica a · c.","Busca dos números que multiplicados den a·c y sumados den b.","Parte el término del medio con esos números y factoriza por agrupación."],
  ex:["2x<sup>2</sup> + 7x + 3","a·c = 6 → 6 y 1 (6 + 1 = 7)","2x<sup>2</sup> + 6x + x + 3 = 2x(x + 3) + 1(x + 3)","= (2x + 1)(x + 3)"]},
 {id:"cub",ic:"7️⃣",nm:"Suma o diferencia de cubos",f:"a<sup>3</sup> ± b<sup>3</sup> = (a ± b)(a<sup>2</sup> ∓ ab + b<sup>2</sup>)",
  when:"Cuando hay 2 términos con raíz cúbica exacta.",
  steps:["Saca la raíz cúbica de cada término: a y b.","Primer factor: (a ± b), con el MISMO signo.","Segundo factor: a<sup>2</sup>, el producto ab con signo CONTRARIO, y + b<sup>2</sup>."],
  ex:["x<sup>3</sup> + 8","∛(x<sup>3</sup>) = x · ∛8 = 2","= (x + 2)(x<sup>2</sup> − 2x + 4)"]}];
let FAC={};

/* ---------- escritura de polinomios ---------- */
function facPow(v,e){return e===0?"":e===1?v:v+"<sup>"+e+"</sup>";}
/* términos: [[coef,"x",exp,"y",exp]…] → "6x² − 9xy + 4" */
function facPoly(ts){
 let out="";
 ts.forEach(function(t,i){const c=t[0];if(c===0)return;
  let vars="";for(let k=1;k<t.length;k+=2)vars+=facPow(t[k],t[k+1]);
  const abs=Math.abs(c),num=(abs===1&&vars)?"":String(abs);
  out+=(out===""?(c<0?"−":""):(c<0?" − ":" + "))+num+vars;});
 return out||"0";}
function facBin(a,v,b){return "("+facPoly([[a,v,1],[b]])+")";}
function facGcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t;}return a;}
function facRnd(a,b){return a+Math.floor(Math.random()*(b-a+1));}
function facNZ(a,b){let v=0;while(v===0)v=facRnd(a,b);return v;}
/* arma la pregunta: opción correcta + distractores distintos (por valor numérico) */
function facMake(caseId,exprHTML,exprF,right,wrongs,steps){
 const pts=[[2,3],[-1.5,2.5],[3,-2],[0.5,1.5],[-2,-3]];
 const same=function(f,g){return pts.every(function(p){return Math.abs(f(p[0],p[1])-g(p[0],p[1]))<1e-6;});};
 const ops=[right];
 shuffled(wrongs).forEach(function(w){if(ops.length>=4)return;if(ops.some(function(o){return o.h===w.h||same(o.f,w.f);}))return;ops.push(w);});
 const sh=shuffled(ops);
 return{caseId:caseId,q:exprHTML,f:exprF,ops:sh,a:sh.indexOf(right),steps:steps};}

/* ---------- generadores ---------- */
const FAC_GEN={
 fc:function(){
  const g=pick([2,3,4,5,6,7]),k=pick([1,1,2]),e=pick([1,1,2]);let a,b;do{a=facRnd(1,7);b=facRnd(1,7);}while(facGcd(a,b)!==1||(a===1&&b===1));
  const s=pick([1,-1]);
  const expr=facPoly([[g*a,"x",k+e],[s*g*b,"x",k]]),F=function(x){return g*a*Math.pow(x,k+e)+s*g*b*Math.pow(x,k);};
  const mk=function(co,kk,p,q,ee){return{h:(co===1?"":co)+facPow("x",kk)+"("+facPoly([[p,"x",ee],[q]])+")",f:function(x){return co*Math.pow(x,kk)*(p*Math.pow(x,ee)+q);}};};
  const right=mk(g,k,a,s*b,e);
  return facMake("fc",expr,F,right,[mk(g,k,a,-s*b,e),mk(g,0,a,s*b,e+k>2?e:e+k),mk(1,k,g*a,s*b,e),mk(g,k,a,s*b,e+1),mk(g,k+1,a,s*b,e),mk(g,k,b,s*a,e)],
   ["MCD de "+(g*a)+" y "+(g*b)+" = <b>"+g+"</b>","Letra común con el menor exponente: <b>"+facPow("x",k)+"</b>","= <b>"+right.h+"</b>"]);},
 ag:function(){
  let p,q,r,s;do{p=facRnd(1,3);q=facNZ(-5,5);r=facRnd(1,3);s=facRnd(1,5);}while(facGcd(p,q)!==1||facGcd(r,s)!==1);
  const expr=facPoly([[p*r,"x",1,"y",1],[p*s,"x",1],[q*r,"y",1],[q*s]]),F=function(x,y){return(p*x+q)*(r*y+s);};
  const mk=function(P,Q,R,S2){return{h:facBin(P,"x",Q)+facBin(R,"y",S2),f:function(x,y){return(P*x+Q)*(R*y+S2);}};};
  const right=mk(p,q,r,s);
  return facMake("ag",expr,F,right,[mk(p,-q,r,s),mk(p,s,r,q),mk(p,q,r,-s),mk(r,q,p,s),mk(p,q,r,s+1),mk(p,q+1,r,s)],
   ["Agrupa: ("+facPoly([[p*r,"x",1,"y",1],[p*s,"x",1]])+") + ("+facPoly([[q*r,"y",1],[q*s]])+")","= "+(p===1?"":p)+"x"+facBin(r,"y",s)+(q<0?" − ":" + ")+Math.abs(q)+facBin(r,"y",s),"Factor común "+facBin(r,"y",s)+" → <b>"+right.h+"</b>"]);},
 dc:function(){
  let a,b;do{a=facRnd(1,7);b=facRnd(1,9);}while(facGcd(a,b)!==1);const withY=Math.random()<.3;
  const expr=withY?facPoly([[a*a,"x",2],[-b*b,"y",2]]):facPoly([[a*a,"x",2],[-b*b]]);
  const F=function(x,y){return a*a*x*x-b*b*(withY?y*y:1);};
  const bn=function(A,B){return withY?"("+facPoly([[A,"x",1],[B,"y",1]])+")":facBin(A,"x",B);};
  const mk=function(A1,B1,A2,B2){return{h:bn(A1,B1)+bn(A2,B2),f:function(x,y){const Y=withY?y:1;return(A1*x+B1*Y)*(A2*x+B2*Y);}};};
  const sq=function(A,B){return{h:bn(A,B)+"<sup>2</sup>",f:function(x,y){const Y=withY?y:1;return Math.pow(A*x+B*Y,2);}};};
  const right=mk(a,b,a,-b);
  return facMake("dc",expr,F,right,[sq(a,-b),sq(a,b),mk(a*a,b,1,-b),mk(a,b*b,a,-1),mk(a,b+1,a,-(b+1)),mk(a+1,b,a+1,-b)],
   ["√("+facPoly([[a*a,"x",2]])+") = <b>"+facPoly([[a,"x",1]])+"</b> · √("+(withY?facPoly([[b*b,"y",2]]):b*b)+") = <b>"+(withY?facPoly([[b,"y",1]]):b)+"</b>","Suma por diferencia → <b>"+right.h+"</b>"]);},
 tcp:function(){
  let a,b;do{a=facRnd(1,4);b=facRnd(1,7);}while(facGcd(a,b)!==1);const s=pick([1,-1]);
  const expr=facPoly([[a*a,"x",2],[s*2*a*b,"x",1],[b*b]]),F=function(x){return Math.pow(a*x+s*b,2);};
  const sq=function(A,B){return{h:facBin(A,"x",B)+"<sup>2</sup>",f:function(x){return Math.pow(A*x+B,2);}};};
  const mk=function(A1,B1,A2,B2){return{h:facBin(A1,"x",B1)+facBin(A2,"x",B2),f:function(x){return(A1*x+B1)*(A2*x+B2);}};};
  const right=sq(a,s*b);
  return facMake("tcp",expr,F,right,[sq(a,-s*b),mk(a,b,a,-b),sq(a,s*b*b),sq(a*a,s*b),sq(a,s*(b+1)),mk(a,s*b,a,s*2*b)],
   ["√("+facPoly([[a*a,"x",2]])+") = <b>"+facPoly([[a,"x",1]])+"</b> · √"+(b*b)+" = <b>"+b+"</b>","Comprueba: 2 · "+facPoly([[a,"x",1]])+" · "+b+" = "+facPoly([[2*a*b,"x",1]])+" ✔","Signo del medio: "+(s>0?"+":"−")+" → <b>"+right.h+"</b>"]);},
 tx:function(){
  let m,n;do{m=facNZ(-9,9);n=facNZ(-9,9);}while(m+n===0||Math.abs(m*n)>48);
  const expr=facPoly([[1,"x",2],[m+n,"x",1],[m*n]]),F=function(x){return(x+m)*(x+n);};
  const mk=function(M,N){const lo=Math.min(M,N),hi=Math.max(M,N);return{h:facBin(1,"x",hi)+facBin(1,"x",lo),f:function(x){return(x+M)*(x+N);}};};
  const right=mk(m,n);
  const alts=[mk(-m,-n),mk(m,-n),mk(-m,n),mk(m+1,n-1),mk(m*n,1),mk(m-1,n+1),mk(m+n,1)];
  return facMake("tx",expr,F,right,alts,
   ["Dos números que multiplicados den <b>"+(m*n)+"</b> y sumados den <b>"+(m+n)+"</b>","Son <b>"+m+"</b> y <b>"+n+"</b>: ("+m+")("+n+") = "+(m*n)+" y ("+m+") + ("+n+") = "+(m+n),"→ <b>"+right.h+"</b>"]);},
 tax:function(){
  let p,q,r,s;do{p=pick([2,3,5]);r=pick([1,1,2,3]);q=facNZ(-7,7);s=facNZ(-7,7);}while(facGcd(p,q)!==1||facGcd(r,s)!==1||facGcd(facGcd(p*r,p*s+q*r),q*s)!==1||p*s+q*r===0||(p===r&&q===s));
  const expr=facPoly([[p*r,"x",2],[p*s+q*r,"x",1],[q*s]]),F=function(x){return(p*x+q)*(r*x+s);};
  const mk=function(P,Q,R,S2){return{h:facBin(P,"x",Q)+facBin(R,"x",S2),f:function(x){return(P*x+Q)*(R*x+S2);}};};
  const right=mk(p,q,r,s),ac=p*r*q*s,n1=p*s,n2=q*r;
  return facMake("tax",expr,F,right,[mk(p,s,r,q),mk(p,-q,r,-s),mk(p,q,r,-s),mk(p,-q,r,s),mk(p*r,q,1,s),mk(p,q+1,r,s),mk(p,q,r,s+1)],
   ["a · c = "+(p*r)+" · "+(q*s<0?"("+(q*s)+")":q*s)+" = <b>"+ac+"</b>","Dos números que multiplicados den "+ac+" y sumados den "+(n1+n2)+": <b>"+n1+"</b> y <b>"+n2+"</b>","Parte el término del medio y agrupa → <b>"+right.h+"</b>"]);},
 cub:function(){
  let a,b;do{a=pick([1,1,2,3]);b=facRnd(1,5);}while(facGcd(a,b)!==1);const s=pick([1,-1]);
  const expr=facPoly([[a*a*a,"x",3],[s*b*b*b]]),F=function(x){return Math.pow(a*x,3)+s*Math.pow(b,3);};
  const mk=function(S1,mid,last,cube){return{h:cube?facBin(a,"x",S1*b)+"<sup>3</sup>":facBin(a,"x",S1*b)+"("+facPoly([[a*a,"x",2],[mid,"x",1],[last]])+")",
   f:function(x){return cube?Math.pow(a*x+S1*b,3):(a*x+S1*b)*(a*a*x*x+mid*x+last);}};};
  const right=mk(s,-s*a*b,b*b);
  return facMake("cub",expr,F,right,[mk(s,s*a*b,b*b),mk(-s,-s*a*b,b*b),mk(s,0,b*b),mk(s,0,0,true),mk(s,-s*2*a*b,b*b),mk(s,-s*a*b,-b*b)],
   ["∛("+facPoly([[a*a*a,"x",3]])+") = <b>"+facPoly([[a,"x",1]])+"</b> · ∛"+(b*b*b)+" = <b>"+b+"</b>","Primer factor con el mismo signo: <b>"+facBin(a,"x",s*b)+"</b>","Segundo factor: cuadrado, producto con signo contrario y cuadrado → <b>"+right.h+"</b>"]);}};
/* ¿qué caso es? */
function facWhich(){
 const c=pick(FAC_CASES),g=FAC_GEN[c.id](),others=shuffled(FAC_CASES.filter(function(x){return x.id!==c.id;})).slice(0,3);
 const ops=shuffled([c].concat(others));
 return{caseId:"which",q:g.q,which:true,ops:ops.map(function(x){return{h:x.nm};}),a:ops.indexOf(c),steps:[c.when,"Fórmula: <b>"+c.f+"</b>","Queda: <b>"+g.ops[g.a].h+"</b>"]};}

/* ---------- pantallas ---------- */
function facState(){const p=prof();if(!p.fac)p.fac={};return p.fac;}
function screenFactor(){setTheme("teen");
 const st=facState();
 const badge=function(id){const s=st[id];return s?(s.best>=80?"🌟 ":"")+s.best+"%":"nuevo";};
 render(topbar("screenTeenHome()")
  +'<h2 style="margin-bottom:4px">🧮 Casos de factorización</h2>'
  +'<p class="mut" style="margin-bottom:12px">Factorizar es escribir una expresión como una <b>multiplicación</b>. Cada caso tiene su truco: apréndelo y practica con ejercicios que cambian cada vez.</p>'
  +'<button class="tbtn acc" onclick="facStart(\'mix\')">🎯 Mezcla de todos los casos <span class="mut">· '+badge("mix")+'</span></button>'
  +'<button class="tbtn" onclick="facStart(\'which\')">🔍 ¿Qué caso es? <span class="mut">· '+badge("which")+'</span></button>'
  +'<p class="tsection">Los 7 casos</p>'
  +FAC_CASES.map(function(c){return '<div class="card" style="padding:12px 14px;margin-bottom:10px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:1.5rem">'+c.ic+'</span><div style="flex:1"><b>'+c.nm+'</b><br><span class="mut" style="font-size:.9rem">'+c.f+'</span></div><span class="mut" style="font-size:.82rem">'+badge(c.id)+'</span></div>'
   +'<div style="display:flex;gap:8px;margin-top:10px"><button class="tbtn" style="flex:1;margin:0;text-align:center" onclick="facLesson(\''+c.id+'\')">📖 Aprender</button><button class="tbtn acc" style="flex:1;margin:0;text-align:center" onclick="facStart(\''+c.id+'\')">✏️ Practicar</button></div></div>';}).join(""));}
function facLesson(id){setTheme("teen");
 const c=FAC_CASES.find(function(x){return x.id===id;});if(!c)return screenFactor();
 render(topbar("screenFactor()")
  +'<h2 style="margin-bottom:8px">'+c.ic+' '+c.nm+'</h2>'
  +'<div class="card" style="text-align:center;font-size:1.25rem;line-height:1.7;border-color:var(--teen-cyan)"><b>'+c.f+'</b></div>'
  +'<div class="card" style="line-height:1.6"><b>¿Cuándo se usa?</b><br>'+c.when+'</div>'
  +'<div class="card" style="line-height:1.7"><b>Pasos</b><ol style="margin:6px 0 0 20px">'+c.steps.map(function(s){return '<li>'+s+'</li>';}).join("")+'</ol></div>'
  +'<div class="card" style="line-height:1.9"><b>Ejemplo</b><div style="font-size:1.15rem;margin-top:6px">'+c.ex.map(function(l,i){return '<div'+(i===c.ex.length-1?' style="color:var(--teen-cyan);font-weight:800"':'')+'>'+l+'</div>';}).join("")+'</div></div>'
  +'<button class="tbtn acc" style="text-align:center" onclick="facStart(\''+id+'\')">✏️ Practicar este caso</button>');}
function facNewQ(mode){
 if(mode==="which")return facWhich();
 const id=mode==="mix"?pick(FAC_CASES).id:mode;return FAC_GEN[id]();}
function facStart(mode){setTheme("teen");
 FAC={mode:mode,i:0,n:8,ok:0,t0:Date.now(),seen:{}};facNext();}
function facNext(){
 if(FAC.i>=FAC.n)return facEnd();
 let q,g=0;do{q=facNewQ(FAC.mode);g++;}while(FAC.seen[q.q]&&g<12);FAC.seen[q.q]=1;
 FAC.q=q;FAC.done=false;FAC.qt=Date.now();
 const c=FAC_CASES.find(function(x){return x.id===FAC.mode;});
 render(topbar("screenFactor()")
  +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b>'+(FAC.mode==="mix"?"🎯 Mezcla":FAC.mode==="which"?"🔍 ¿Qué caso es?":c.ic+" "+c.nm)+' · '+(FAC.i+1)+'/'+FAC.n+'</b><b style="color:var(--teen-cyan)">'+FAC.ok+' ✓</b></div>'
  +'<p class="mut" style="margin-bottom:4px">'+(q.which?"¿Qué caso de factorización se usa aquí?":"Factoriza:")+'</p>'
  +'<div class="card" style="text-align:center;font-size:clamp(1.3rem,6vw,1.7rem);font-weight:800;line-height:1.6;border-color:var(--teen-cyan)">'+q.q+'</div>'
  +(typeof boardBtn==="function"?boardBtn():"")
  +q.ops.map(function(o,k){return '<button class="tbtn opt" id="fo'+k+'" style="font-size:1.12rem" onclick="facAns('+k+')">'+o.h+'</button>';}).join("")
  +'<div id="facFb"></div>');}
function facAns(k){
 if(FAC.done)return;FAC.done=true;
 const q=FAC.q,ok=k===q.a;
 recordAnswer("Factorización",ok,Math.round((Date.now()-FAC.qt)/1000));
 document.querySelectorAll(".opt").forEach(function(b){b.disabled=true;});
 const b=document.getElementById("fo"+k),r=document.getElementById("fo"+q.a);
 if(r){r.style.borderColor="#16A34A";r.style.color="#86EFAC";}
 if(ok){FAC.ok++;sOK();prof().coins+=1;}else{sNO();if(b){b.style.borderColor="#DC2626";b.style.color="#FCA5A5";}}
 save();
 const fb=document.getElementById("facFb");
 if(fb)fb.innerHTML='<div class="card" style="line-height:1.75;border-color:'+(ok?"#16A34A":"#DC2626")+'"><b>'+(ok?"✅ ¡Correcto!":"❌ Casi. Mira el paso a paso:")+'</b>'+q.steps.map(function(s){return '<div style="margin-top:4px">• '+s+'</div>';}).join("")+'</div>'
  +'<button class="tbtn acc" style="text-align:center" onclick="FAC.i++;facNext()">'+(FAC.i+1>=FAC.n?"Ver resultado →":"Siguiente →")+'</button>';
 if(fb)fb.scrollIntoView({behavior:"smooth",block:"nearest"});}
function facEnd(){
 const pct=Math.round(FAC.ok/FAC.n*100),st=facState(),prev=st[FAC.mode]||{best:0,tries:0};
 st[FAC.mode]={best:Math.max(prev.best,pct),tries:prev.tries+1};
 const p=prof();p.coins+=Math.round(pct/10);p.xp+=Math.round(pct/4);save();
 if(pct>=70){sWIN();confetti(26);}
 const weak=pct<70&&FAC.mode!=="mix"&&FAC.mode!=="which";
 render(topbar("screenFactor()")
  +'<div class="card endcard"><div class="big">'+(pct>=80?"🏆":pct>=50?"🌟":"💪")+'</div><h2>'+pct+'%</h2>'
  +'<p class="mut" style="margin-bottom:12px">'+FAC.ok+' de '+FAC.n+' correctas'+(pct>=80?" · ¡caso dominado!":"")+'</p>'
  +(weak?'<button class="tbtn" style="text-align:center" onclick="facLesson(\''+FAC.mode+'\')">📖 Repasar la explicación</button>':'')
  +'<button class="tbtn acc" style="text-align:center" onclick="facStart(\''+FAC.mode+'\')">🔁 Otra ronda (ejercicios nuevos)</button>'
  +'<button class="tbtn" style="text-align:center" onclick="screenFactor()">Ver todos los casos</button></div>');}
