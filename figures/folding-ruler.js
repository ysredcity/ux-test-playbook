const {Cam,fit,proj,facing,rings,rrect,circ,prism,solid,put,mk,poly,open,clamp,spring,stepS,pointer,register,disposer}=HL;
function mount({stage,svg,read},value){
 const bag=disposer(),C=Cam(45,.5,3.3);
 fit(C,[[-75,-55,0],[75,55,0],[-75,55,20],[75,-55,20]],200,166);
 const P=proj(C),front=facing(C),g=mk('g',{},svg),sp=spring(.35);
 let reach=value,last=null;
 const parts=[];
 function block(x0,y0,x1,y1,z0,z1,r=3){const [a,b]=rings(x0,y0,x1,y1,r,.7);return prism(P,front,a,b,z0,z1)}
 function disc(x,y,r,z0,z1){const a=rrect(x-r,y-r,x+r,y+r,r,18),b=rrect(x-r+.7,y-r+.7,x+r-.7,y+r-.7,r-.7,18);return prism(P,front,a,b,z0,z1)}
 function path(points){return open(points.map(q=>P(...q)))}
 function add(fn,bright=false){const s=solid(g);parts.push({s,fn});s.sil.classList.toggle('hi',bright)}
 function line(fn,cls='nf lo'){const e=mk('path',{class:cls},g);parts.push({e,fn})}
const rod=(i,v)=>{
 const a=1.15-v*.95;let x=-62,y=-20;
 for(let j=0;j<i;j++){x+=33*Math.cos(a);y+=33*Math.sin(j%2?-a:a)}
 const angle=i%2?-a:a;
 return (u,w,z)=>P(x+u*Math.cos(angle)-w*Math.sin(angle),y+u*Math.sin(angle)+w*Math.cos(angle),z);
};
 for(let i=0;i<4;i++){
  add(v=>{const [a,b]=rings(0,-6,33,6,3,.7);return prism(rod(i,v),front,a,b,9+i*.8,12+i*.8)},i==1);
  for(let j=1;j<6;j++)line(v=>open([rod(i,v)(j*5,-5,12+i*.8),rod(i,v)(j*5,j%2?-1:1,12+i*.8)]));
  line(v=>poly(circ(1.4,24).map(q=>rod(i,v)(2+q.u,q.v,12.2+i*.8))),'nf');
 }

 function draw(v){if(last!==null&&Math.abs(last-v)<.00001)return;last=v;for(const p of parts){const q=p.fn(v);if(p.s)put(p.s,q);else p.e.setAttribute('d',q)}}
 draw(sp.x);read.textContent='rest';
 const B=register(stage,dt=>{const moving=stepS(sp,dt);draw(sp.x);return moving});bag.add(B.unregister);
 bag.add(pointer(stage,{move:p=>{sp.t=.15+clamp((p[0]-70)/260,0,1)*reach;read.textContent='extend';B.wake()},leave:()=>{sp.t=.35;read.textContent='rest';B.wake()}}));
 bag.add(()=>svg.replaceChildren());
 return {set:v=>{reach=v},destroy:bag.dispose};
}
hairline({name:'folding-ruler',means:'A jointed folding ruler extends as the pointer moves across it.',rules:[1,3,4,5,7,8,9,10],range:[.25,.65,.85],tour:[[120,150],[240,160],[290,190],null],mount});
