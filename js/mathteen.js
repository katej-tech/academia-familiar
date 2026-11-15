"use strict";
/* ============ MATEMÁTICAS 9.º → 10.º (perfil adolescente) ============
   Pedido: el perfil de María Fernanda es de grado 9 y pasa a 10: «toca ir ajustando e ir adaptando»; que pueda resolver
   varios ejercicios, «si no la IA también», y «si se equivoca que exista una explicación».
   · Cada tema tiene un GENERADOR local (ejercicios infinitos, sin internet) con 3 niveles que suben o bajan solos según
     los aciertos, y SIEMPRE muestra el paso a paso al responder (acierte o no).
   · Con la clave de Gemini: «✨ Ejercicios nuevos con IA» del tema y «🤖 Explícamelo de otra forma» cuando se equivoca.
   · El grado se cambia con un toque (9.º / 10.º); en 10.º quedan los de 9.º como repaso.
   Usa facPoly/facBin/facGcd/facRnd/facNZ de factor.js. Prefijo mt / MT. */

const MT_TOPICS=[
 {id:"lin",g:9,ic:"⚖️",nm:"Ecuaciones lineales"},
 {id:"sis",g:9,ic:"🔀",nm:"Sistemas de ecuaciones 2×2"},
 {id:"pn",g:9,ic:"✖️",nm:"Productos notables"},
 {id:"fac",g:9,ic:"🧮",nm:"Factorización (7 casos)",link:"screenFactor()"},
 {id:"cuad",g:9,ic:"🎯",nm:"Ecuación cuadrática"},
 {id:"fl",g:9,ic:"📈",nm:"Función lineal"},
 {id:"pot",g:9,ic:"🔢",nm:"Potencias y radicales"},
 {id:"pit",g:9,ic:"📐",nm:"Teorema de Pitágoras"},
 {id:"est",g:9,ic:"📊",nm:"Estadística: media, mediana y moda"},
 {id:"trig",g:10,ic:"📏",nm:"Razones trigonométricas"},
 {id:"ga",g:10,ic:"🗺️",nm:"Geometría analítica"},
 {id:"des",g:10,ic:"↔️",nm:"Desigualdades"},
 {id:"fq",g:10,ic:"🏔️",nm:"Función cuadrática"}];
let MT={};
function mtSt(){const p=prof();if(!p.mt)p.mt={grade:9,t:{}};if(!p.mt.t)p.mt.t={};if(!p.mt.grade)p.mt.grade=9;return p.mt;}
function mtLvl(id){const s=mtSt().t[id];return Math.max(1,Math.min(3,(s&&s.lvl)||1));}

/* ---------- utilidades ---------- */
function mtN(n){return n<0?"−"+Math.abs(n):String(n);}
function mtFrac(n,d){if(d<0){n=-n;d=-d;}const g=facGcd(n,d)||1;n/=g;d/=g;return d===1?mtN(n):(n<0?"−":"")+Math.abs(n)+"/"+d;}
function mtPt(x,y){return "("+mtN(x)+", "+mtN(y)+")";}
function mtOpts(right,wrongs){
 const out=[right];shuffled(wrongs).forEach(function(w){if(out.length<4&&w!=null&&out.indexOf(w)<0)out.push(w);});
 const ops=shuffled(out);return{ops:ops,a:ops.indexOf(right)};}
function mtNum(ans,wrongs){
 const out=[ans];shuffled(wrongs||[]).forEach(function(w){if(out.length<4&&out.indexOf(w)<0)out.push(w);});
 let g=0;while(out.length<4&&g++<40){const w=ans+facNZ(-5,5);if(out.indexOf(w)<0)out.push(w);}
 const ops=shuffled(out);return{ops:ops.map(mtN),a:ops.indexOf(ans)};}
function mtQ(q,o,steps){return{q:q,ops:o.ops,a:o.a,steps:steps};}
function mtTerm(a,v){return(a===1?"":a===-1?"−":mtN(a))+v;}          /* 3x, −x */
function mtSum(parts){ /* [[coef,"x"],[const,""]] → "3x − 5" */
 let s="";parts.forEach(function(p){const c=p[0];if(c===0)return;const body=(Math.abs(c)===1&&p[1]?"":String(Math.abs(c)))+p[1];s+=(s===""?(c<0?"−":""):(c<0?" − ":" + "))+body;});return s||"0";}

/* ---------- generadores ---------- */
const MT_GEN={
 lin:function(l){
  const x=facNZ(-9,9);
  if(l===1){const a=facRnd(2,9),b=facNZ(-12,12),c=a*x+b;
   return mtQ("Resuelve: <b>"+mtSum([[a,"x"],[b,""]])+" = "+mtN(c)+"</b>",mtNum(x,[-x,x+1,x-1,c-b,Math.round((c+b)/a)]),
    ["Pasa "+mtN(b)+" al otro lado con el signo contrario: "+a+"x = "+mtN(c)+(b<0?" + ":" − ")+Math.abs(b)+" = "+mtN(c-b),"Divide entre "+a+": x = "+mtN(c-b)+" ÷ "+a,"<b>x = "+mtN(x)+"</b>"]);}
  if(l===2){let a,c;do{a=facRnd(2,9);c=facRnd(1,8);}while(a===c);const b=facNZ(-12,12),d=(a-c)*x+b;
   return mtQ("Resuelve: <b>"+mtSum([[a,"x"],[b,""]])+" = "+mtSum([[c,"x"],[d,""]])+"</b>",mtNum(x,[-x,x+1,x-1,x+2,d-b]),
    ["Lleva las x a un lado: "+a+"x − "+c+"x = "+mtTerm(a-c,"x"),"Lleva los números al otro: "+mtN(d)+(b<0?" + ":" − ")+Math.abs(b)+" = "+mtN(d-b),mtTerm(a-c,"x")+" = "+mtN(d-b)+" → <b>x = "+mtN(x)+"</b>"]);}
  let a,c;do{a=facRnd(2,6);c=facRnd(1,5);}while(a===c);const b=facNZ(-6,6),d=facNZ(-6,6),e=a*(x+b)-c*(x+d);
  return mtQ("Resuelve: <b>"+a+"(x "+(b<0?"− ":"+ ")+Math.abs(b)+") = "+c+"(x "+(d<0?"− ":"+ ")+Math.abs(d)+") "+(e<0?"− ":"+ ")+Math.abs(e)+"</b>",mtNum(x,[-x,x+1,x-1,x+2,x-2]),
   ["Distribuye: "+mtSum([[a,"x"],[a*b,""]])+" = "+mtSum([[c,"x"],[c*d+e,""]]),"Agrupa: "+mtTerm(a-c,"x")+" = "+mtN(c*d+e-a*b),"<b>x = "+mtN(x)+"</b>"]);},
 sis:function(l){
  const x=facNZ(-6,6),y=facNZ(-6,6);let a1,b1,a2,b2;
  if(l===1){a1=1;b1=1;a2=1;b2=-1;}
  else{const R=l===2?4:7;do{a1=facNZ(1,R);b1=facNZ(-R,R);a2=facNZ(1,R);b2=facNZ(-R,R);}while(a1*b2-a2*b1===0||(Math.abs(b1)===1&&Math.abs(b2)===1&&l===2&&a1===a2));}
  const c1=a1*x+b1*y,c2=a2*x+b2*y;
  const eq=function(a,b,c){return mtSum([[a,"x"],[b,"y"]])+" = "+mtN(c);};
  const o=mtOpts(mtPt(x,y),[x!==y?mtPt(y,x):null,mtPt(x,-y),mtPt(-x,y),mtPt(x+1,y),mtPt(x,y+1),mtPt(-x,-y)]);
  return mtQ("Resuelve el sistema:<br><b>"+eq(a1,b1,c1)+"<br>"+eq(a2,b2,c2)+"</b><br><span style='font-size:.8em;opacity:.8'>¿Cuál es (x, y)?</span>",o,
   [l===1?"Suma las dos ecuaciones: 2x = "+mtN(c1+c2)+" → x = "+mtN(x):"Elimina una letra: multiplica las ecuaciones para que los coeficientes de y sean opuestos y súmalas → x = "+mtN(x),"Reemplaza x en la primera: "+mtN(a1*x)+(b1<0?" − ":" + ")+(Math.abs(b1)===1?"":Math.abs(b1))+"y = "+mtN(c1)+" → y = "+mtN(y),"Comprueba en la segunda: "+mtN(a2)+"("+mtN(x)+") "+(b2<0?"− ":"+ ")+Math.abs(b2)+"("+mtN(y)+") = "+mtN(c2)+" ✔ → <b>"+mtPt(x,y)+"</b>"]);},
 pn:function(l){
  const T=l===1?pick([0,1]):pick([0,1,2]);
  if(T===0){const a=l===1?1:facRnd(1,4),b=facNZ(-7,7),right=facPoly([[a*a,"x",2],[2*a*b,"x",1],[b*b]]);
   return mtQ("Desarrolla: <b>"+facBin(a,"x",b)+"<sup>2</sup></b>",mtOpts(right,[facPoly([[a*a,"x",2],[b*b]]),facPoly([[a*a,"x",2],[-2*a*b,"x",1],[b*b]]),facPoly([[a*a,"x",2],[a*b,"x",1],[b*b]]),facPoly([[a,"x",2],[2*a*b,"x",1],[b*b]]),facPoly([[a*a,"x",2],[2*a*b,"x",1],[-b*b]])]),
    ["Fórmula: (a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup>","a = "+mtTerm(a,"x")+", b = "+mtN(b)+" → 2ab = "+mtTerm(2*a*b,"x"),"<b>"+right+"</b> (¡no olvides el término del medio!)"]);}
  if(T===1){const a=l===1?1:facRnd(1,5),b=facRnd(1,9),right=facPoly([[a*a,"x",2],[-b*b]]);
   return mtQ("Desarrolla: <b>"+facBin(a,"x",b)+facBin(a,"x",-b)+"</b>",mtOpts(right,[facPoly([[a*a,"x",2],[b*b]]),facPoly([[a*a,"x",2],[-2*a*b,"x",1],[b*b]]),facPoly([[a*a,"x",2],[2*a*b,"x",1],[-b*b]]),facPoly([[a,"x",2],[-b*b]]),facPoly([[a*a,"x",2],[-b]])]),
    ["Fórmula: (a + b)(a − b) = a<sup>2</sup> − b<sup>2</sup>","a<sup>2</sup> = "+facPoly([[a*a,"x",2]])+" y b<sup>2</sup> = "+(b*b),"<b>"+right+"</b>"]);}
  let m,n;do{m=facNZ(-8,8);n=facNZ(-8,8);}while(m+n===0);const right=facPoly([[1,"x",2],[m+n,"x",1],[m*n]]);
  return mtQ("Desarrolla: <b>"+facBin(1,"x",m)+facBin(1,"x",n)+"</b>",mtOpts(right,[facPoly([[1,"x",2],[m*n,"x",1],[m+n]]),facPoly([[1,"x",2],[m+n,"x",1],[-m*n]]),facPoly([[1,"x",2],[-(m+n),"x",1],[m*n]]),facPoly([[1,"x",2],[m*n]]),facPoly([[1,"x",2],[m+n+1,"x",1],[m*n]])]),
   ["Fórmula: (x + m)(x + n) = x<sup>2</sup> + (m + n)x + mn","Suma: "+mtN(m)+" + "+(n<0?"("+mtN(n)+")":n)+" = "+mtN(m+n)+" · Producto: "+mtN(m*n),"<b>"+right+"</b>"]);},
 cuad:function(l){
  if(l===1){let m,n;do{m=facNZ(-8,8);n=facNZ(-8,8);}while(m===n||m===-n);
   const sol=function(a,b){const lo=Math.min(a,b),hi=Math.max(a,b);return"x = "+mtN(lo)+"  ó  x = "+mtN(hi);};
   return mtQ("Resuelve: <b>"+facPoly([[1,"x",2],[-(m+n),"x",1],[m*n]])+" = 0</b>",mtOpts(sol(m,n),[sol(-m,-n),sol(m,-n),sol(-m,n),sol(m+1,n),sol(m,n+1)]),
    ["Factoriza: dos números que multiplicados den "+mtN(m*n)+" y sumados den "+mtN(-(m+n)),"→ "+facBin(1,"x",-m)+facBin(1,"x",-n)+" = 0","Cada paréntesis igual a 0: <b>"+sol(m,n)+"</b> (¡el signo cambia!)"]);}
  if(l===2){const p=pick([2,3]);let q,s;do{q=facNZ(-7,7);s=facNZ(-6,6);}while(facGcd(p,q)!==1||q===p*s);
   const sol=function(a,b){return"x = "+a+"  ó  x = "+b;},r1=mtFrac(-q,p),r2=mtN(-s);
   return mtQ("Resuelve: <b>"+facPoly([[p,"x",2],[p*s+q,"x",1],[q*s]])+" = 0</b>",mtOpts(sol(r1,r2),[sol(mtFrac(q,p),mtN(s)),sol(mtFrac(-q,p),mtN(s)),sol(mtFrac(q,p),mtN(-s)),sol(mtN(-q),r2),sol(mtFrac(-p,q),r2)]),
    ["Factoriza (trinomio ax² + bx + c): "+facBin(p,"x",q)+facBin(1,"x",s)+" = 0",mtSum([[p,"x"],[q,""]])+" = 0 → x = "+r1,mtSum([[1,"x"],[s,""]])+" = 0 → x = "+r2+" → <b>"+sol(r1,r2)+"</b>"]);}
  const a=facRnd(1,3),b=facRnd(-8,8),c=facRnd(-6,8),D=b*b-4*a*c;
  const names=["Dos soluciones reales distintas","Una solución real (doble)","Ninguna solución real","Infinitas soluciones"],right=D>0?names[0]:D===0?names[1]:names[2];
  const ops=shuffled(names);
  return{q:"¿Cuántas soluciones reales tiene <b>"+facPoly([[a,"x",2],[b,"x",1],[c]])+" = 0</b>?",ops:ops,a:ops.indexOf(right),
   steps:["Discriminante: Δ = b<sup>2</sup> − 4ac","Δ = ("+mtN(b)+")<sup>2</sup> − 4("+a+")("+mtN(c)+") = "+(b*b)+(4*a*c<0?" + ":" − ")+Math.abs(4*a*c)+" = <b>"+mtN(D)+"</b>","Δ > 0: dos · Δ = 0: una · Δ < 0: ninguna → <b>"+right+"</b>"]};},
 fl:function(l){
  if(l===1){const m=facNZ(-6,6),b=facRnd(-9,9),k=facRnd(-5,5),v=m*k+b;
   return mtQ("Si <b>f(x) = "+mtSum([[m,"x"],[b,""]])+"</b>, ¿cuánto vale <b>f("+mtN(k)+")</b>?",mtNum(v,[m+k+b,m*k-b,-v,m*(k+1)+b]),
    ["Reemplaza x por "+mtN(k)+": f("+mtN(k)+") = "+mtN(m)+"("+mtN(k)+") "+(b<0?"− ":"+ ")+Math.abs(b),"= "+mtN(m*k)+" "+(b<0?"− ":"+ ")+Math.abs(b),"<b>= "+mtN(v)+"</b>"]);}
  if(l===2){const x1=facRnd(-5,5),y1=facRnd(-6,6);let dx,dy;do{dx=facNZ(-5,5);dy=facNZ(-8,8);}while(Math.abs(dx)===Math.abs(dy)&&false);
   const x2=x1+dx,y2=y1+dy,right=mtFrac(dy,dx);
   return mtQ("¿Cuál es la <b>pendiente</b> de la recta que pasa por <b>"+mtPt(x1,y1)+"</b> y <b>"+mtPt(x2,y2)+"</b>?",mtOpts(right,[mtFrac(dx,dy),mtFrac(-dy,dx),mtFrac(dy+1,dx),mtFrac(y2+y1,x2+x1===0?1:x2+x1),mtFrac(dy,dx+1===0?2:dx+1)]),
    ["Fórmula: m = (y<sub>2</sub> − y<sub>1</sub>) / (x<sub>2</sub> − x<sub>1</sub>)","m = ("+mtN(y2)+" − "+(y1<0?"("+mtN(y1)+")":y1)+") / ("+mtN(x2)+" − "+(x1<0?"("+mtN(x1)+")":x1)+") = "+mtN(dy)+" / "+mtN(dx),"<b>m = "+right+"</b>"]);}
  const m=facNZ(-5,5),x1=facNZ(-4,4),y1=facRnd(-6,6),b=y1-m*x1,eqn=function(M,B){return"y = "+mtSum([[M,"x"],[B,""]]);};
  return mtQ("¿Cuál es la ecuación de la recta con pendiente <b>m = "+mtN(m)+"</b> que pasa por <b>"+mtPt(x1,y1)+"</b>?",mtOpts(eqn(m,b),[eqn(m,-b),eqn(-m,b),eqn(m,y1),eqn(m,b+1),eqn(b,m)]),
   ["Usa y = mx + b y reemplaza el punto: "+mtN(y1)+" = "+mtN(m)+"("+mtN(x1)+") + b","b = "+mtN(y1)+(m*x1<0?" + ":" − ")+Math.abs(m*x1)+" = "+mtN(b),"<b>"+eqn(m,b)+"</b>"]);},
 pot:function(l){
  if(l===1){const a=facRnd(2,7),b=facRnd(2,6),T=pick([0,1,2]),P=function(e){return"x<sup>"+e+"</sup>";};
   if(T===0)return mtQ("Simplifica: <b>"+P(a)+" · "+P(b)+"</b>",mtOpts(P(a+b),[P(a*b),P(Math.abs(a-b)||1),"2"+P(a+b),P(a+b+1),P(a+b-1),P(a*b+1)]),["Misma base multiplicando: se <b>suman</b> los exponentes",a+" + "+b+" = "+(a+b),"<b>"+P(a+b)+"</b>"]);
   if(T===1)return mtQ("Simplifica: <b>("+P(a)+")<sup>"+b+"</sup></b>",mtOpts(P(a*b),[P(a+b),P(Math.pow(a,b)>99?a*b+2:Math.pow(a,b)),P(a*b+1),P(a),P(a*b-1),P(2*a*b)]),["Potencia de una potencia: se <b>multiplican</b> los exponentes",a+" · "+b+" = "+(a*b),"<b>"+P(a*b)+"</b>"]);
   const hi=a+b;return mtQ("Simplifica: <b>"+P(hi)+" ÷ "+P(b)+"</b>",mtOpts(P(a),[P(hi+b),P(hi*b),P(a+1),P(b),P(a-1||9),P(hi)]),["Misma base dividiendo: se <b>restan</b> los exponentes",hi+" − "+b+" = "+a,"<b>"+P(a)+"</b>"]);}
  if(l===2){const k=facRnd(2,6),n=pick([2,3,5,6,7]),R=function(K,Nn){return(K===1?"":K)+"√"+Nn;};
   return mtQ("Simplifica: <b>√"+(k*k*n)+"</b>",mtOpts(R(k,n),[R(k+1,n),R(n,k),R(k*k,n),R(k,n+1),R(k-1||5,n)]),
    ["Busca un cuadrado perfecto dentro: "+(k*k*n)+" = "+(k*k)+" · "+n,"√("+(k*k)+" · "+n+") = √"+(k*k)+" · √"+n,"<b>"+R(k,n)+"</b>"]);}
  const T=pick([0,1,2]),a=pick([2,3,4,5]),e=facRnd(2,3);
  if(T===0)return mtQ("Calcula: <b>"+a+"<sup>−"+e+"</sup></b>",mtOpts("1/"+Math.pow(a,e),["−"+Math.pow(a,e),"−1/"+Math.pow(a,e),String(Math.pow(a,e)),"1/"+(a*e)]),["Exponente negativo: a<sup>−n</sup> = 1 / a<sup>n</sup>",a+"<sup>"+e+"</sup> = "+Math.pow(a,e),"<b>1/"+Math.pow(a,e)+"</b>"]);
  if(T===1)return mtQ("Calcula: <b>("+mtN(-a)+")<sup>0</sup> + "+a+"<sup>1</sup></b>",mtNum(1+a,[a,a-1,0,-a+1]),["Todo número (≠ 0) elevado a 0 es <b>1</b>","("+mtN(-a)+")<sup>0</sup> = 1 y "+a+"<sup>1</sup> = "+a,"<b>"+(1+a)+"</b>"]);
  const b=pick([2,3,5].filter(function(z){return z!==a;}));
  return mtQ("Calcula: <b>("+a+"/"+b+")<sup>−1</sup></b>",mtOpts(b+"/"+a,[a+"/"+b,"−"+a+"/"+b,"−"+b+"/"+a,"1"]),["Exponente −1: se <b>invierte</b> la fracción","("+a+"/"+b+")<sup>−1</sup> = "+b+"/"+a,"<b>"+b+"/"+a+"</b>"]);},
 pit:function(l){
  const t=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29],[9,40,41]]),k=l===1?facRnd(1,3):facRnd(1,2),a=t[0]*k,b=t[1]*k,c=t[2]*k;
  if(l===1)return mtQ("En un triángulo rectángulo los catetos miden <b>"+a+"</b> y <b>"+b+"</b>. ¿Cuánto mide la hipotenusa?",mtNum(c,[a+b,c+1,c-1,Math.round(Math.sqrt(Math.abs(b*b-a*a)))]),
   ["c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup> = "+a*a+" + "+b*b+" = "+c*c,"c = √"+c*c,"<b>c = "+c+"</b>"]);
  if(l===2)return mtQ("La hipotenusa mide <b>"+c+"</b> y un cateto mide <b>"+a+"</b>. ¿Cuánto mide el otro cateto?",mtNum(b,[c-a,c+a,b+1,b-1]),
   ["b<sup>2</sup> = c<sup>2</sup> − a<sup>2</sup> = "+c*c+" − "+a*a+" = "+b*b,"b = √"+b*b,"<b>b = "+b+"</b> (en el cateto se RESTA)"]);
  if(c>26)return MT_GEN.pit(l);
  return mtQ("Una escalera de <b>"+c+" m</b> está apoyada en una pared. Su base queda a <b>"+a+" m</b> de la pared. ¿A qué altura llega?",mtNum(b,[c-a,c+a,b+1,b-2]).ops?(function(){const o=mtNum(b,[c-a,c+a,b+1,b-2]);o.ops=o.ops.map(function(x){return x+" m";});return o;})():null,
   ["La escalera es la hipotenusa ("+c+") y la base un cateto ("+a+")","altura<sup>2</sup> = "+c*c+" − "+a*a+" = "+b*b,"<b>altura = "+b+" m</b>"]);},
 est:function(l){
  const n=pick([5,5,7]);let d=[];for(let i=0;i<n;i++)d.push(facRnd(2,12));
  const sorted=function(x){return x.slice().sort(function(p,q){return p-q;});};
  if(l===1){let s=d.reduce(function(p,q){return p+q;},0);while(s%n!==0){d[0]++;s++;}const m=s/n;
   return mtQ("Calcula la <b>media</b> (promedio) de: <b>"+d.join(", ")+"</b>",mtNum(m,[m+1,m-1,sorted(d)[(n-1)/2],Math.round(s/(n-1))]),
    ["Suma todos los datos: "+d.join(" + ")+" = "+s,"Divide entre la cantidad de datos ("+n+")","<b>media = "+m+"</b>"]);}
  if(l===2){const so=sorted(d),med=so[(n-1)/2];
   return mtQ("Calcula la <b>mediana</b> de: <b>"+d.join(", ")+"</b>",mtNum(med,[d[(n-1)/2],so[0],so[n-1],med+1]),
    ["Ordena de menor a mayor: "+so.join(", "),"El dato del centro (posición "+((n+1)/2)+")","<b>mediana = "+med+"</b>"]);}
  const mo=facRnd(3,11);d=d.map(function(x){return x===mo?x+1:x;});d[0]=mo;d[2]=mo;d[4]=mo;const cnt={};d.forEach(function(x){cnt[x]=(cnt[x]||0)+1;});
  if(Object.keys(cnt).some(function(k){return +k!==mo&&cnt[k]>=3;}))return MT_GEN.est(l);
  const sh=shuffled(d),so=sorted(d),T=pick([0,1]);
  if(T===0)return mtQ("¿Cuál es la <b>moda</b> de: <b>"+sh.join(", ")+"</b>?",mtNum(mo,[so[0],so[n-1],so[(n-1)/2]!==mo?so[(n-1)/2]:mo+2]),
   ["La moda es el dato que <b>más se repite</b>","El "+mo+" aparece "+cnt[mo]+" veces","<b>moda = "+mo+"</b>"]);
  const rg=so[n-1]-so[0];
  return mtQ("¿Cuál es el <b>rango</b> de: <b>"+sh.join(", ")+"</b>?",mtNum(rg,[so[n-1],so[0],rg+1,so[n-1]+so[0]]),
   ["Rango = dato mayor − dato menor","= "+so[n-1]+" − "+so[0],"<b>rango = "+rg+"</b>"]);},
 trig:function(l){
  if(l===1){const t=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]),a=t[0],b=t[1],c=t[2],r=pick([["sen","cateto opuesto / hipotenusa",a,c],["cos","cateto adyacente / hipotenusa",b,c],["tan","cateto opuesto / cateto adyacente",a,b]]);
   const right=r[2]+"/"+r[3];
   return mtQ("Triángulo rectángulo: cateto <b>opuesto</b> al ángulo A = <b>"+a+"</b>, cateto <b>adyacente</b> = <b>"+b+"</b>, hipotenusa = <b>"+c+"</b>.<br>¿Cuánto vale <b>"+r[0]+" A</b>?",mtOpts(right,[a+"/"+c,b+"/"+c,a+"/"+b,b+"/"+a,c+"/"+a,c+"/"+b]),
    ["<b>"+r[0]+"</b> = "+r[1]+" (SOH-CAH-TOA)","= "+r[2]+" / "+r[3],"<b>"+right+"</b>"]);}
  if(l===2){const T=[["sen 30°","1/2"],["cos 30°","√3/2"],["tan 30°","√3/3"],["sen 45°","√2/2"],["cos 45°","√2/2"],["tan 45°","1"],["sen 60°","√3/2"],["cos 60°","1/2"],["tan 60°","√3"]],x=pick(T);
   return mtQ("¿Cuánto vale <b>"+x[0]+"</b>?",mtOpts(x[1],["1/2","√3/2","√2/2","1","√3","√3/3","2"]),
    ["Ángulos notables: sen 30° = 1/2 · sen 45° = √2/2 · sen 60° = √3/2","cos es al revés: cos 30° = √3/2 · cos 45° = √2/2 · cos 60° = 1/2","tan = sen / cos → <b>"+x[0]+" = "+x[1]+"</b>"]);}
  const h=2*facRnd(2,9),T=pick([0,1,2]);
  if(T===0)return mtQ("En un triángulo rectángulo la hipotenusa mide <b>"+h+"</b> y un ángulo mide <b>30°</b>. ¿Cuánto mide el cateto <b>opuesto</b> a ese ángulo?",mtNum(h/2,[h,h*2,h/2+1,h-2]),
   ["sen 30° = opuesto / hipotenusa = 1/2","opuesto = "+h+" · 1/2","<b>"+(h/2)+"</b>"]);
  if(T===1)return mtQ("En un triángulo rectángulo la hipotenusa mide <b>"+h+"</b> y un ángulo mide <b>60°</b>. ¿Cuánto mide el cateto <b>adyacente</b> a ese ángulo?",mtNum(h/2,[h,h*2,h/2+1,h-2]),
   ["cos 60° = adyacente / hipotenusa = 1/2","adyacente = "+h+" · 1/2","<b>"+(h/2)+"</b>"]);
  const k=facRnd(2,9);
  return mtQ("En un triángulo rectángulo con un ángulo de <b>45°</b>, cada cateto mide <b>"+k+"</b>. ¿Cuánto mide la hipotenusa?",mtOpts(k+"√2",[k+"√3",String(2*k),k+"/√2",(k+1)+"√2",String(k*k)]),
   ["Con 45° los dos catetos son iguales","c<sup>2</sup> = "+k*k+" + "+k*k+" = "+2*k*k+" → c = √("+k*k+" · 2)","<b>"+k+"√2</b>"]);},
 ga:function(l){
  const x1=facRnd(-5,5),y1=facRnd(-5,5);
  if(l===1){const t=pick([[3,4,5],[5,12,13],[6,8,10],[8,15,17]]),sx=pick([1,-1]),sy=pick([1,-1]),x2=x1+sx*t[0],y2=y1+sy*t[1];
   return mtQ("¿Cuál es la <b>distancia</b> entre <b>"+mtPt(x1,y1)+"</b> y <b>"+mtPt(x2,y2)+"</b>?",mtNum(t[2],[t[0]+t[1],t[2]+1,t[2]-1,Math.abs(t[1]-t[0])]),
    ["d = √[(x<sub>2</sub> − x<sub>1</sub>)<sup>2</sup> + (y<sub>2</sub> − y<sub>1</sub>)<sup>2</sup>]","= √["+t[0]*t[0]+" + "+t[1]*t[1]+"] = √"+t[2]*t[2],"<b>d = "+t[2]+"</b>"]);}
  if(l===2){const x2=x1+2*facNZ(-4,4),y2=y1+2*facNZ(-4,4),mx=(x1+x2)/2,my=(y1+y2)/2;
   return mtQ("¿Cuál es el <b>punto medio</b> entre <b>"+mtPt(x1,y1)+"</b> y <b>"+mtPt(x2,y2)+"</b>?",mtOpts(mtPt(mx,my),[mtPt(x2-x1,y2-y1),mtPt(x1+x2,y1+y2),mtPt(my,mx),mtPt(mx+1,my),mtPt(mx,my-1)]),
    ["Punto medio = promedio de las x y promedio de las y","x: ("+mtN(x1)+" + "+mtN(x2)+") / 2 = "+mtN(mx)+" · y: ("+mtN(y1)+" + "+mtN(y2)+") / 2 = "+mtN(my),"<b>"+mtPt(mx,my)+"</b>"]);}
  let p,q;do{p=facNZ(-5,5);q=facRnd(1,5);}while(facGcd(p,q)!==1||(Math.abs(p)===1&&q===1));const b=facNZ(-6,6),par=Math.random()<.5,right=par?mtFrac(p,q):mtFrac(-q,p);
  return mtQ("La recta <b>y = "+(q===1?mtTerm(p,"x"):"("+mtFrac(p,q)+")x")+" "+(b<0?"− ":"+ ")+Math.abs(b)+"</b>. ¿Cuál es la pendiente de una recta <b>"+(par?"paralela":"perpendicular")+"</b> a ella?",mtOpts(right,[mtFrac(p,q),mtFrac(-p,q),mtFrac(q,p),mtFrac(-q,p),mtN(b),"0",mtFrac(p+1,q)]),
   ["La pendiente de la recta es m = "+mtFrac(p,q),par?"Rectas paralelas: <b>misma</b> pendiente":"Rectas perpendiculares: pendiente <b>inversa y de signo contrario</b> (−1/m)","<b>"+right+"</b>"]);},
 des:function(l){
  const k=facNZ(-8,8),sy=pick(["<",">","≤","≥"]),flip={"<":">",">":"<","≤":"≥","≥":"≤"},H={"<":"&lt;",">":"&gt;","≤":"≤","≥":"≥"};
  const a=l===1?facRnd(2,8):-facRnd(2,8),b=facNZ(-10,10),c=a*k+b,res=a>0?sy:flip[sy];
  const S=function(s,v){return"x "+H[s]+" "+mtN(v);};
  if(l<3)return mtQ("Resuelve: <b>"+mtSum([[a,"x"],[b,""]])+" "+H[sy]+" "+mtN(c)+"</b>",mtOpts(S(res,k),[S(flip[res],k),S(res,-k),S(flip[res],-k),S(res,k+1),S(res,c-b)]),
   ["Pasa "+mtN(b)+": "+mtTerm(a,"x")+" "+H[sy]+" "+mtN(c-b),"Divide entre "+mtN(a)+(a<0?" → como es <b>negativo</b>, el signo de la desigualdad <b>se invierte</b>":""),"<b>"+S(res,k)+"</b>"]);
  let a2,c2;do{a2=facNZ(-7,7);c2=facNZ(-6,6);}while(a2===c2);const d=(a2-c2)*k+b,r2=(a2-c2)>0?sy:flip[sy];
  return mtQ("Resuelve: <b>"+mtSum([[a2,"x"],[b,""]])+" "+H[sy]+" "+mtSum([[c2,"x"],[d,""]])+"</b>",mtOpts(S(r2,k),[S(flip[r2],k),S(r2,-k),S(flip[r2],-k),S(r2,k+1),S(r2,k-1)]),
   ["Agrupa las x: "+mtTerm(a2-c2,"x")+" "+H[sy]+" "+mtN(d-b),"Divide entre "+mtN(a2-c2)+((a2-c2)<0?" → negativo: <b>se invierte</b> el signo":""),"<b>"+S(r2,k)+"</b>"]);},
 fq:function(l){
  if(l===1){const h=facNZ(-6,6),c=facRnd(-8,8),b=-2*h;
   return mtQ("¿En qué valor de x está el <b>vértice</b> de <b>y = "+facPoly([[1,"x",2],[b,"x",1],[c]])+"</b>?",mtNum(h,[-h,b,2*h,h+1]),
    ["x del vértice: h = −b / (2a)","h = −("+mtN(b)+") / (2 · 1) = "+mtN(-b)+" / 2","<b>x = "+mtN(h)+"</b>"]);}
  if(l===2){const a=pick([1,2,-1,-2]),h=facNZ(-4,4),k=facRnd(-6,6),b=-2*a*h,c=a*h*h+k;
   return mtQ("¿Cuál es el <b>vértice</b> de <b>y = "+facPoly([[a,"x",2],[b,"x",1],[c]])+"</b>?",mtOpts(mtPt(h,k),[mtPt(-h,k),mtPt(h,-k),mtPt(k,h),mtPt(h,c),mtPt(h+1,k)]),
    ["h = −b / (2a) = "+mtN(-b)+" / "+mtN(2*a)+" = "+mtN(h),"k = f("+mtN(h)+") = "+mtN(a)+"("+mtN(h)+")<sup>2</sup> "+(b*h<0?"− ":"+ ")+Math.abs(b*h)+" "+(c<0?"− ":"+ ")+Math.abs(c)+" = "+mtN(k),"<b>Vértice "+mtPt(h,k)+"</b>"]);}
  const a=pick([1,2,3,-1,-2,-3]),b=facRnd(-6,6),c=facRnd(-6,6),names=["Abre hacia arriba y tiene un mínimo","Abre hacia abajo y tiene un máximo","Es una línea recta","Abre hacia la derecha"],right=a>0?names[0]:names[1],ops=shuffled(names);
  return{q:"La parábola <b>y = "+facPoly([[a,"x",2],[b,"x",1],[c]])+"</b>…",ops:ops,a:ops.indexOf(right),steps:["Mira el signo de a (el número que acompaña a x<sup>2</sup>): a = "+mtN(a),a>0?"a > 0 → abre hacia <b>arriba</b> 🙂 (el vértice es el punto más bajo)":"a < 0 → abre hacia <b>abajo</b> 🙁 (el vértice es el punto más alto)","<b>"+right+"</b>"]};}};

/* ---------- IA ---------- */
function mtFmt(s){return esc(String(s==null?"":s)).replace(/\^\{?(-?\d+)\}?/g,"<sup>$1</sup>").replace(/sqrt\(([^)]+)\)/g,"√($1)").replace(/\n/g,"<br>");}
async function mtAI(id){
 const t=MT_TOPICS.find(function(x){return x.id===id;}),fb=document.getElementById("mtFb");
 if(fb)fb.innerHTML='<div class="card center"><span class="spin">⏳</span> La IA está creando ejercicios de '+esc(t.nm)+'…</div>';
 try{
  const g=mtSt().grade,lv=mtLvl(id);
  const o=await geminiJSON('Eres profesor de matemáticas de bachillerato en Colombia. Crea 5 ejercicios de opción múltiple del tema "'+t.nm+'" para una estudiante de grado '+g+'°, dificultad '+lv+' de 3. Varía los contextos y los números. '
   +'Para exponentes usa ^ (ej: x^2) y para raíces sqrt( ). Cada ejercicio: enunciado corto, exactamente 4 opciones con UNA sola correcta, el índice de la correcta en "a" (0 a 3, que NO sea siempre 0), y "exp": la solución paso a paso en 2 a 4 pasos cortos separados por saltos de línea. '
   +'ANTES de responder, resuelve cada ejercicio tú mismo y verifica que la opción marcada sea realmente la correcta y que las otras tres sean incorrectas. Responde SOLO JSON válido sin markdown: {"items":[{"q":"...","ops":["...","...","...","..."],"a":0,"exp":"paso 1\\npaso 2"}]}');
  const items=(o.items||[]).filter(function(x){return x&&x.q&&Array.isArray(x.ops)&&x.ops.length===4&&x.a>=0&&x.a<4;}).map(function(x){
   const right=mtFmt(x.ops[x.a]),ops=shuffled(x.ops.map(mtFmt));
   return{q:mtFmt(x.q),ops:ops,a:ops.indexOf(right),steps:String(x.exp||"").split(/\n+/).filter(Boolean).map(mtFmt),ai:true};});
  if(items.length<3)throw new Error("La IA devolvió muy pocos ejercicios. Intenta de nuevo.");
  MT={mode:id,i:0,n:items.length,ok:0,list:items,ai:true};mtNext();
 }catch(e){if(fb)fb.innerHTML='<div class="card" style="border-color:#DC2626">⚠️ '+esc(e.message||"No se pudo generar.")+'</div>';}}
/* explicación personalizada de un error (sirve para cualquier materia del perfil adolescente) */
async function aiExplain(elId,subject,question,correct,chosen){
 const el=document.getElementById(elId);if(!el)return;
 if(!S.geminiKey){el.innerHTML='<div class="card mut">La explicación con IA necesita la clave de Gemini (Panel de padres).</div>';return;}
 el.innerHTML='<div class="card center"><span class="spin">⏳</span> Pensando la explicación…</div>';
 try{
  const g=(prof().mt&&prof().mt.grade)||9;
  const o=await geminiJSON('Eres una tutora paciente y cercana de una estudiante colombiana de grado '+g+'°. Materia: '+subject+'. Ejercicio: "'+stripHTML(String(question)).slice(0,500)+'". Respuesta correcta: "'+stripHTML(String(correct)).slice(0,200)+'". '+(chosen?'Ella respondió: "'+stripHTML(String(chosen)).slice(0,200)+'". ':'')
   +'Explícale en español, con máximo 5 pasos cortos y lenguaje sencillo, cómo se llega a la respuesta correcta y cuál fue probablemente su error. Si es de inglés, da la regla y un ejemplo más. Para exponentes usa ^. Termina con una frase corta de ánimo. Responde SOLO JSON: {"exp":"paso 1\\npaso 2\\n..."}');
  el.innerHTML='<div class="card" style="line-height:1.7;border-color:var(--teen-cyan,#22D3EE)"><b>🤖 Explicación</b><div style="margin-top:6px">'+mtFmt(o.exp||"")+'</div></div>';
 }catch(e){el.innerHTML='<div class="card" style="border-color:#DC2626">⚠️ '+esc(e.message||"No se pudo explicar.")+'</div>';}}

/* ---------- pantallas ---------- */
function screenMathTeen(){setTheme("teen");
 const st=mtSt(),g=st.grade;
 const row=function(t){const s=st.t[t.id]||{},lv=mtLvl(t.id);
  if(t.link){const fs=(prof().fac||{}).mix;return '<div class="card" style="padding:12px 14px;margin-bottom:10px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:1.5rem">'+t.ic+'</span><div style="flex:1"><b>'+t.nm+'</b><br><span class="mut" style="font-size:.82rem">'+(fs?"mezcla: "+fs.best+"%":"7 casos con explicación")+'</span></div></div><button class="tbtn acc" style="text-align:center;margin:10px 0 0" onclick="'+t.link+'">Abrir →</button></div>';}
  return '<div class="card" style="padding:12px 14px;margin-bottom:10px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:1.5rem">'+t.ic+'</span><div style="flex:1"><b>'+t.nm+'</b><br><span class="mut" style="font-size:.82rem">Nivel '+"⭐".repeat(lv)+(s.tries?" · mejor "+s.best+"%":" · nuevo")+'</span></div></div>'
   +'<div style="display:flex;gap:8px;margin-top:10px"><button class="tbtn acc" style="flex:2;margin:0;text-align:center" onclick="mtStart(\''+t.id+'\')">✏️ Practicar</button>'+(S.geminiKey?'<button class="tbtn" style="flex:1;margin:0;text-align:center" onclick="mtAI(\''+t.id+'\')">✨ IA</button>':'')+'</div></div>';};
 const cur=MT_TOPICS.filter(function(t){return t.g===g;}),prev=MT_TOPICS.filter(function(t){return t.g<g;});
 const done9=MT_TOPICS.filter(function(t){return t.g===9&&!t.link;}),ok9=done9.filter(function(t){return(st.t[t.id]||{}).best>=80;}).length;
 render(topbar("screenTeenHome()")
  +'<h2 style="margin-bottom:6px">🧮 Matemáticas</h2>'
  +'<div class="card"><b>Mi grado</b><div style="display:flex;gap:8px;margin-top:8px">'+[9,10].map(function(n){const on=g===n;return '<button onclick="mtGrade('+n+')" style="flex:1;padding:10px;border-radius:14px;border:2px solid '+(on?"var(--teen-cyan)":"#322B52")+';background:'+(on?"rgba(34,211,238,.14)":"transparent")+';color:inherit;font-weight:800;font-size:1.05rem;cursor:pointer">'+n+'.º</button>';}).join("")+'</div>'
  +'<p class="mut" style="margin-top:8px;font-size:.85rem;line-height:1.5">Los ejercicios cambian cada vez y el nivel sube solo cuando aciertas. Siempre verás el <b>paso a paso</b>'+(S.geminiKey?', y la IA puede crear ejercicios nuevos o explicarte de otra forma':'')+'.</p></div>'
  +(g===9&&ok9>=done9.length-1&&done9.length?'<div class="card" style="border-color:#16A34A">🎓 ¡Ya dominas casi todo 9.º! Prueba los temas de <b>10.º</b> cuando quieras.</div>':'')
  +'<button class="tbtn acc" style="text-align:center" onclick="mtStart(\'mix\')">🎯 Reto mixto de '+g+'.º</button>'
  +'<div id="mtFb"></div>'
  +'<p class="tsection">Temas de '+g+'.º</p>'+cur.map(row).join("")
  +(prev.length?'<details style="margin-top:6px"><summary style="cursor:pointer;font-weight:800;padding:8px 2px">🔁 Repaso de 9.º ('+prev.length+' temas)</summary>'+prev.map(row).join("")+'</details>':''));}
function mtGrade(n){mtSt().grade=n;save();screenMathTeen();}
function mtNewQ(mode){
 let id=mode;
 if(mode==="mix"){const g=mtSt().grade;id=pick(MT_TOPICS.filter(function(t){return t.g===g&&!t.link;})).id;}
 const q=MT_GEN[id](mtLvl(id));q.topic=id;return q;}
function mtStart(mode){setTheme("teen");MT={mode:mode,i:0,n:6,ok:0,seen:{},lvl:mode==="mix"?0:mtLvl(mode)};mtNext();}
function mtNext(){
 if(MT.i>=MT.n)return mtEnd();
 let q;
 if(MT.list)q=MT.list[MT.i];
 else{let g=0;do{q=mtNewQ(MT.mode);g++;}while(MT.seen[q.q]&&g<12);MT.seen[q.q]=1;}
 MT.q=q;MT.done=false;MT.qt=Date.now();
 const t=MT_TOPICS.find(function(x){return x.id===(q.topic||MT.mode);});
 render(topbar("screenMathTeen()")
  +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b>'+(t?t.ic+" "+t.nm:"🎯 Reto mixto")+(MT.ai?" · ✨ IA":"")+' · '+(MT.i+1)+'/'+MT.n+'</b><b style="color:var(--teen-cyan)">'+MT.ok+' ✓</b></div>'
  +'<div class="card" style="text-align:center;font-size:clamp(1.05rem,4.6vw,1.3rem);line-height:1.7;border-color:var(--teen-cyan)">'+q.q+'</div>'
  +(typeof boardBtn==="function"?boardBtn():"")
  +q.ops.map(function(o,k){return '<button class="tbtn opt" id="mo'+k+'" style="font-size:1.1rem" onclick="mtAns('+k+')">'+o+'</button>';}).join("")
  +'<div id="mtFb"></div>');}
function mtAns(k){
 if(MT.done)return;MT.done=true;
 const q=MT.q,ok=k===q.a,g=mtSt().grade;
 recordAnswer("Mate "+g+"°",ok,Math.round((Date.now()-MT.qt)/1000));
 document.querySelectorAll(".opt").forEach(function(b){b.disabled=true;});
 const b=document.getElementById("mo"+k),r=document.getElementById("mo"+q.a);
 if(r){r.style.borderColor="#16A34A";r.style.color="#86EFAC";}
 if(ok){MT.ok++;sOK();prof().coins+=1;}else{sNO();if(b){b.style.borderColor="#DC2626";b.style.color="#FCA5A5";}}
 save();MT.chosen=q.ops[k];
 const fb=document.getElementById("mtFb");
 if(fb){fb.innerHTML='<div class="card" style="line-height:1.75;border-color:'+(ok?"#16A34A":"#DC2626")+'"><b>'+(ok?"✅ ¡Correcto! Así se hace:":"❌ Casi. Mira el paso a paso:")+'</b>'+(q.steps&&q.steps.length?q.steps.map(function(s){return '<div style="margin-top:4px">• '+s+'</div>';}).join(""):'<div style="margin-top:4px">La respuesta correcta es <b>'+q.ops[q.a]+'</b></div>')+(q.ai?'<div class="mut" style="font-size:.78rem;margin-top:6px">Ejercicio creado por IA: si algo no cuadra, resuélvelo en la pizarra y cuéntale a tu profe.</div>':'')+'</div>'
  +'<div id="mtAI"></div>'
  +(!ok&&S.geminiKey?'<button class="tbtn" style="text-align:center" onclick="aiExplain(\'mtAI\',\'Matemáticas\',MT.q.q,MT.q.ops[MT.q.a],MT.chosen)">🤖 Explícamelo de otra forma</button>':'')
  +'<button class="tbtn acc" style="text-align:center" onclick="MT.i++;mtNext()">'+(MT.i+1>=MT.n?"Ver resultado →":"Siguiente →")+'</button>';
  fb.scrollIntoView({behavior:"smooth",block:"nearest"});}}
function mtEnd(){
 const pct=Math.round(MT.ok/MT.n*100),st=mtSt();let msg="";
 if(MT.mode!=="mix"){const s=st.t[MT.mode]||{lvl:1,best:0,tries:0};s.tries=(s.tries||0)+1;s.best=Math.max(s.best||0,pct);
  if(!MT.ai){const lv=s.lvl||1;if(pct>=80&&lv<3){s.lvl=lv+1;msg="⬆️ ¡Subes al nivel "+"⭐".repeat(s.lvl)+"!";}else if(pct<40&&lv>1){s.lvl=lv-1;msg="Bajamos un nivel para afianzar 💪";}}
  st.t[MT.mode]=s;}
 const p=prof();p.coins+=Math.round(pct/10);p.xp+=Math.round(pct/4);save();
 if(pct>=70){sWIN();confetti(26);}
 const mode=MT.mode;
 render(topbar("screenMathTeen()")
  +'<div class="card endcard"><div class="big">'+(pct>=80?"🏆":pct>=50?"🌟":"💪")+'</div><h2>'+pct+'%</h2>'
  +'<p class="mut" style="margin-bottom:8px">'+MT.ok+' de '+MT.n+' correctas</p>'+(msg?'<p style="margin-bottom:12px;font-weight:800">'+msg+'</p>':'')
  +'<button class="tbtn acc" style="text-align:center" onclick="mtStart(\''+mode+'\')">🔁 Otra ronda (ejercicios nuevos)</button>'
  +(S.geminiKey&&mode!=="mix"?'<button class="tbtn" style="text-align:center" onclick="screenMathTeen();mtAI(\''+mode+'\')">✨ Ejercicios nuevos con IA</button>':'')
  +'<button class="tbtn" style="text-align:center" onclick="screenMathTeen()">Ver todos los temas</button></div>');}
