const {Cam,fit,proj,facing,rings,rrect,circ,prism,solid,put,mk,poly,open,clamp,spring,stepS,pointer,register,disposer}=HL;
function mount({stage,svg,read},value){
 const bag=disposer(),C=Cam(45,.5,1.95);
 fit(C,[[-75,-55,0],[75,55,0],[-75,55,110],[75,-55,110]],200,166);
 const P=proj(C),front=facing(C),g=mk('g',{},svg),sp=spring(.35);
 let reach=value,last=null;
 const parts=[];
 function block(x0,y0,x1,y1,z0,z1,r=3){const [a,b]=rings(x0,y0,x1,y1,r,.7);return prism(P,front,a,b,z0,z1)}
 function disc(x,y,r,z0,z1){const a=rrect(x-r,y-r,x+r,y+r,r,18),b=rrect(x-r+.7,y-r+.7,x+r-.7,y+r-.7,r-.7,18);return prism(P,front,a,b,z0,z1)}
 function path(points){return open(points.map(q=>P(...q)))}
 function add(fn,bright=false){const s=solid(g);parts.push({s,fn});s.sil.classList.toggle('hi',bright)}
 function line(fn,cls='nf lo'){const e=mk('path',{class:cls},g);parts.push({e,fn})}
add(v=>block(-37,-31,37,31,0,32,5));
 line(v=>poly(rrect(-31,-25,31,25,3,8).map(q=>P(q.u,q.v,32))));
 const lid=v=>(x,y,z)=>P(x,-31+(y+31)*Math.cos(.8+v*.7),32+(y+31)*Math.sin(.8+v*.7)+z);
 add(v=>{const [a,b]=rings(-37,-31,37,31,4,.7);return prism(lid(v),front,a,b,0,4)},true);
 line(v=>path(Array.from({length:161},(_,j)=>{const a=j/160*Math.PI*10;return [10*Math.cos(a),10*Math.sin(a),33+j/160*(12+v*25)]})),'nf sil');
 add(v=>disc(0,0,12,45+v*25,49+v*25));
 add(v=>block(-8,30,8,34,12,21,3));

 function draw(v){if(last!==null&&Math.abs(last-v)<.00001)return;last=v;for(const p of parts){const q=p.fn(v);if(p.s)put(p.s,q);else p.e.setAttribute('d',q)}}
 draw(sp.x);read.textContent='rest';
 const B=register(stage,dt=>{const moving=stepS(sp,dt);draw(sp.x);return moving});bag.add(B.unregister);
 bag.add(pointer(stage,{move:p=>{sp.t=.15+clamp((p[0]-70)/260,0,1)*reach;read.textContent='spring';B.wake()},leave:()=>{sp.t=.35;read.textContent='rest';B.wake()}}));
 bag.add(()=>svg.replaceChildren());
 return {set:v=>{reach=v},destroy:bag.dispose};
}
hairline({name:'spring-box',means:'A spring rises from a box as its hinged lid opens.',rules:[1,3,4,5,7,8,9,10],range:[.25,.65,.85],tour:[[120,150],[240,160],[290,190],null],mount});
