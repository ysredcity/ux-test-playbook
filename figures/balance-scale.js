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
add(v=>block(-43,-27,43,27,0,8,5));
 add(v=>disc(0,0,12,8,15));
 add(v=>block(-5,-5,5,5,15,72,4));
 const height=(x,v)=>65+x*(v-.35)*.65;
 const tilt=v=>(x,y,z)=>P(x,y,z+x*(v-.35)*.65);
 add(v=>{const [a,b]=rings(-57,-5,57,5,3,.7);return prism(tilt(v),front,a,b,64,69)},true);
 for(const x of [-47,47]){
  line(v=>path([[x,0,height(x,v)],[x-13,0,height(x,v)-34],[x+13,0,height(x,v)-34],[x,0,height(x,v)]]),'nf');
  add(v=>disc(x,0,19,height(x,v)-38,height(x,v)-34));
  add(v=>disc(x,0,8,height(x,v)-34,height(x,v)-25));
 }

 function draw(v){if(last!==null&&Math.abs(last-v)<.00001)return;last=v;for(const p of parts){const q=p.fn(v);if(p.s)put(p.s,q);else p.e.setAttribute('d',q)}}
 draw(sp.x);read.textContent='rest';
 const B=register(stage,dt=>{const moving=stepS(sp,dt);draw(sp.x);return moving});bag.add(B.unregister);
 bag.add(pointer(stage,{move:p=>{sp.t=.15+clamp((p[0]-70)/260,0,1)*reach;read.textContent='balance';B.wake()},leave:()=>{sp.t=.35;read.textContent='rest';B.wake()}}));
 bag.add(()=>svg.replaceChildren());
 return {set:v=>{reach=v},destroy:bag.dispose};
}
hairline({name:'balance-scale',means:'A balance tilts toward the pointer while its two hanging pans stay connected.',rules:[1,3,4,5,7,8,9,10],range:[.25,.65,.85],tour:[[120,150],[240,160],[290,190],null],mount});
