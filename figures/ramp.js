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
 add(v=>block(-65,-32,62,32,0,6));
 add(v=>block(-60,-28,-35,28,6,11));
 add(v=>block(32,-28,58,28,6,24+v*30));
 const slope=v=>(x,y,z)=>P(x,y,z+(x+35)/70*(14+v*30));
 add(v=>{const [a,b]=rings(-35,-28,35,28,3,.7);return prism(slope(v),front,a,b,7,11)},true);
 line(v=>path([[-57,-24,32],[-35,-24,32],[35,-24,46+v*30],[54,-24,46+v*30]]),'nf sil');
 line(v=>path([[-57,24,32],[-35,24,32],[35,24,46+v*30],[54,24,46+v*30]]),'nf sil');
 for(const y of [-24,24])for(const x of [-51,49])line(v=>path([[x,y,x<0?11:24+v*30],[x,y,x<0?32:46+v*30]]));
 function draw(v){if(last!==null&&Math.abs(last-v)<.00001)return;last=v;for(const p of parts){const q=p.fn(v);if(p.s)put(p.s,q);else p.e.setAttribute('d',q)}}
 draw(sp.x);read.textContent='rest';
 const B=register(stage,dt=>{const moving=stepS(sp,dt);draw(sp.x);return moving});bag.add(B.unregister);
 bag.add(pointer(stage,{move:p=>{sp.t=.15+clamp((p[0]-70)/260,0,1)*reach;read.textContent='incline';B.wake()},leave:()=>{sp.t=.35;read.textContent='rest';B.wake()}}));
 bag.add(()=>svg.replaceChildren());
 return {set:v=>{reach=v},destroy:bag.dispose};
}
hairline({name:'ramp',means:'A ramp changes its incline while keeping its two landings connected.',rules:[1,3,4,5,7,8,9,10],range:[.25,.65,.85],tour:[[120,150],[240,160],[290,190],null],mount});
