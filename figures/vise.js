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
 add(v=>block(-58,-37,47,35,0,8));
 add(v=>block(-48,-24,27,22,8,27));
 add(v=>block(-43,-29,-26,29,27,60));
 add(v=>block(-47,-32,-22,32,56,65),true);
 add(v=>block(10-v*14,-28,29-v*14,28,27,60));
 add(v=>block(6-v*14,-32,33-v*14,32,56,65));
 add(v=>block(-20,-18,-8,16,43,61));
 add(v=>block(29-v*14,-5,68,5,32,41));
 for(let i=0;i<7;i++)line(v=>path([[34+i*4,-4,41],[36+i*4,4,41]]));
 add(v=>block(63,-4,71,4,19+v*9,57+v*9,3));
 function draw(v){if(last!==null&&Math.abs(last-v)<.00001)return;last=v;for(const p of parts){const q=p.fn(v);if(p.s)put(p.s,q);else p.e.setAttribute('d',q)}}
 draw(sp.x);read.textContent='rest';
 const B=register(stage,dt=>{const moving=stepS(sp,dt);draw(sp.x);return moving});bag.add(B.unregister);
 bag.add(pointer(stage,{move:p=>{sp.t=.15+clamp((p[0]-70)/260,0,1)*reach;read.textContent='clamp';B.wake()},leave:()=>{sp.t=.35;read.textContent='rest';B.wake()}}));
 bag.add(()=>svg.replaceChildren());
 return {set:v=>{reach=v},destroy:bag.dispose};
}
hairline({name:'vise',means:'A bench vise closes around a workpiece as the pointer advances.',rules:[1,3,4,5,7,8,9,10],range:[.25,.65,.85],tour:[[120,150],[240,160],[290,190],null],mount});
