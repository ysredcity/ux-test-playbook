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
add(v=>block(-49,-62,49,59,0,15,25));
 add(v=>block(-40,-49,-3,-13,15,18,8));
 add(v=>block(3,-49,40,-13,15,18,8));
 const center=P(0,13,32),R=42;
 line(v=>poly(Array.from({length:97},(_,i)=>{const a=i*Math.PI/48;return [center[0]+R*Math.cos(a),center[1]+R*Math.sin(a)]})),'sil hi');
 for(const offset of [-.6,.6])line(v=>open(Array.from({length:65},(_,i)=>{const t=-Math.PI/2+i*Math.PI/64,a=v*1.7+offset;return [center[0]+R*Math.sin(t),center[1]+R*Math.cos(t)*Math.sin(a)]})));
 add(v=>block(-5,-46,5,-21,18,22,4));
 line(v=>open([P(-35,44,15),P(-17,49,15),P(17,49,15),P(35,44,15)]));
 function draw(v){if(last!==null&&Math.abs(last-v)<.00001)return;last=v;for(const p of parts){const q=p.fn(v);if(p.s)put(p.s,q);else p.e.setAttribute('d',q)}}
 draw(sp.x);read.textContent='rest';
 const B=register(stage,dt=>{const moving=stepS(sp,dt);draw(sp.x);return moving});bag.add(B.unregister);
 bag.add(pointer(stage,{move:p=>{sp.t=clamp((p[0]-200)/130,-1,1)*reach;read.textContent=p[0]<200?'roll left':'roll right';B.wake()},leave:()=>{sp.t=.35;read.textContent='rest';B.wake()}}));
 bag.add(()=>svg.replaceChildren());
 return {set:v=>{reach=v},destroy:bag.dispose};
}
hairline({name:'trackball',means:'A trackball rolls its exposed sphere while the shaped palm rest and paired buttons stay still.',rules:[1,3,4,5,7,8,9,10],range:[.25,.65,.85],tour:[[120,150],[240,160],[290,190],null],mount});
