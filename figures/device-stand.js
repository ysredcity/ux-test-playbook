const {Cam,fit,proj,facing,rings,rrect,circ,prism,solid,put,mk,poly,open,clamp,spring,stepS,pointer,register,disposer}=HL;
function mount({stage,svg,read},value){
 const bag=disposer(),C=Cam(45,.5,1.95);
 fit(C,[[-75,-55,0],[75,55,0],[-75,55,85],[75,-55,85]],200,166);
 const P=proj(C),front=facing(C),g=mk('g',{},svg),sp=spring(.35);
 let reach=value,last=null;
 const parts=[];
 function block(x0,y0,x1,y1,z0,z1,r=3){const [a,b]=rings(x0,y0,x1,y1,r,.7);return prism(P,front,a,b,z0,z1)}
 function disc(x,y,r,z0,z1){const a=rrect(x-r,y-r,x+r,y+r,r,18),b=rrect(x-r+.7,y-r+.7,x+r-.7,y+r-.7,r-.7,18);return prism(P,front,a,b,z0,z1)}
 function path(points){return open(points.map(q=>P(...q)))}
 function add(fn,bright=false){const s=solid(g);parts.push({s,fn});s.sil.classList.toggle('hi',bright)}
 function line(fn,cls='nf lo'){const e=mk('path',{class:cls},g);parts.push({e,fn})}
const pivot=(x,y,z,v)=>{const a=v*.5,c=Math.cos(a),s=Math.sin(a);return P(x*c-y*s,x*s+y*c,z)};
 add(v=>block(-66,-42,66,47,0,6,7));
 function rotatedBlock(x0,y0,x1,y1,z0,z1,v,r=3){const [a,b]=rings(x0,y0,x1,y1,r,.7);return prism((x,y,z)=>pivot(x,y,z,v),front,a,b,z0,z1)}
 add(v=>rotatedBlock(-42,-24,22,27,6,9,v));
 const screen=(x,y,v)=>pivot(x,-24+y*.24,9+y,v);
 const outer=rrect(-42,0,22,48,3,10),inner=rrect(-38,4,18,44,2,10);
 line(v=>poly(outer.map(q=>screen(q.u,q.v,v))),'sil');
 line(v=>poly(inner.map(q=>screen(q.u,q.v,v))));
 line(v=>poly(rrect(-20,-1,0,13,2,8).map(q=>pivot(q.u,q.v,9,v))));
 for(let j=0;j<3;j++)line(v=>open([pivot(-35,-17+j*4,9,v),pivot(15,-17+j*4,9,v)]));
 add(v=>rotatedBlock(32,-5,58,34,6,10,-v,4));
 const phone=rrect(32,0,58,49,4,12),display=rrect(35,6,55,43,2,10);
 const ph=(q,v)=>pivot(q.u,8+q.v*.18,12+q.v,-v);
 line(v=>poly(phone.map(q=>ph(q,v))),'sil hi');
 line(v=>poly(display.map(q=>ph(q,v))));
 line(v=>open([ph({u:41,v:46},v),ph({u:49,v:46},v)]));
 function draw(v){if(last!==null&&Math.abs(last-v)<.00001)return;last=v;for(const p of parts){const q=p.fn(v);if(p.s)put(p.s,q);else p.e.setAttribute('d',q)}}
 draw(sp.x);read.textContent='rest';
 const B=register(stage,dt=>{const moving=stepS(sp,dt);draw(sp.x);return moving});bag.add(B.unregister);
 bag.add(pointer(stage,{move:p=>{sp.t=clamp((p[0]-200)/130,-1,1)*reach;read.textContent=p[0]<200?'laptop':'phone';B.wake()},leave:()=>{sp.t=.35;read.textContent='rest';B.wake()}}));
 bag.add(()=>svg.replaceChildren());
 return {set:v=>{reach=v},destroy:bag.dispose};
}
hairline({name:'device-stand',means:'A laptop and phone share a stand and gently turn toward the pointer.',rules:[1,3,4,5,7,8,9,10],range:[.25,.65,.85],tour:[[120,150],[240,160],[290,190],null],mount});
