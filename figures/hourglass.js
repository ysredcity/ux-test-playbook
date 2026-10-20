const {Cam,fit,proj,facing,rings,rrect,circ,prism,solid,put,mk,poly,open,clamp,spring,stepS,pointer,register,disposer}=HL;
function mount({stage,svg,read},value){
 const bag=disposer(),C=Cam(45,.5,2.35);
 fit(C,[[-30,-30,0],[30,30,0],[-30,30,100],[30,-30,100]],200,166);
 const P=proj(C),front=facing(C),g=mk('g',{},svg),sp=spring(.35);
 let reach=value,last=null;
 const parts=[];
 function block(x0,y0,x1,y1,z0,z1,r=3){const [a,b]=rings(x0,y0,x1,y1,r,.7);return prism(P,front,a,b,z0,z1)}
 function disc(x,y,r,z0,z1){const a=rrect(x-r,y-r,x+r,y+r,r,18),b=rrect(x-r+.7,y-r+.7,x+r-.7,y+r-.7,r-.7,18);return prism(P,front,a,b,z0,z1)}
 function path(points){return open(points.map(q=>P(...q)))}
 function add(fn,bright=false){const s=solid(g);parts.push({s,fn});s.sil.classList.toggle('hi',bright)}
 function line(fn,cls='nf lo'){const e=mk('path',{class:cls},g);parts.push({e,fn})}
const glass=v=>(x,y,z)=>{const a=(v-.35)*.7;return P(x*Math.cos(a)+(z-44)*Math.sin(a),y,44-x*Math.sin(a)+(z-44)*Math.cos(a))};
 for(const z of [0,80])add(v=>{const Q=glass(v),a=rrect(-29,-29,29,29,29,18),b=rrect(-28,-28,28,28,28,18);return prism(Q,front,a,b,z,z+7)},z==80);
 for(const [x,y] of [[-22,-10],[13,-20],[10,22]])add(v=>{const Q=(u,w,z)=>glass(v)(x+u,y+w,z);const [a,b]=rings(-2,-2,2,2,1.9,.5);return prism(Q,front,a,b,7,80)});
 for(const side of [-1,1])line(v=>open([[side*21,0,9],[side*20,0,24],[side*3,0,43],[side*20,0,64],[side*21,0,79]].map(q=>glass(v)(...q))),'nf sil');
 line(v=>poly(circ(21,60).map(q=>glass(v)(q.u,q.v,79))),'nf lo');
 line(v=>poly(circ(21,60).map(q=>glass(v)(q.u,q.v,9))),'nf lo');
 line(v=>open([[-14,0,12],[0,0,26],[14,0,12]].map(q=>glass(v)(...q))),'nf');
 line(v=>open([[0,0,42],[0,0,29]].map(q=>glass(v)(...q))),'nf lo');

 function draw(v){if(last!==null&&Math.abs(last-v)<.00001)return;last=v;for(const p of parts){const q=p.fn(v);if(p.s)put(p.s,q);else p.e.setAttribute('d',q)}}
 draw(sp.x);read.textContent='rest';
 const B=register(stage,dt=>{const moving=stepS(sp,dt);draw(sp.x);return moving});bag.add(B.unregister);
 bag.add(pointer(stage,{move:p=>{sp.t=.15+clamp((p[0]-70)/260,0,1)*reach;read.textContent='tilt';B.wake()},leave:()=>{sp.t=.35;read.textContent='rest';B.wake()}}));
 bag.add(()=>svg.replaceChildren());
 return {set:v=>{reach=v},destroy:bag.dispose};
}
hairline({name:'hourglass',means:'An hourglass tilts with the pointer, its waist and frame staying connected.',rules:[1,3,4,5,7,8,9,10],range:[.25,.65,.85],tour:[[120,150],[240,160],[290,190],null],mount});
