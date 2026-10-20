(()=>{const figures=[];const hairline=f=>figures.push(f);
(()=>{
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
add(v=>block(-58,-42,58,42,0,8,5));
 for(let j=0;j<3;j++){
  const x=-55+j*37;
  add(v=>block(x,-37,x+34,37,8,24,3),j==1);
  line(v=>poly(rrect(x+3,-34,x+31,34,2,8).map(q=>P(q.u,q.v,24))));
  add(v=>block(x+5,-28,x+29,-13,24,26,2));
  add(v=>block(x+5,4-v*(j+1)*5,x+29,20-v*(j+1)*5,24,28,2));
 }

 function draw(v){if(last!==null&&Math.abs(last-v)<.00001)return;last=v;for(const p of parts){const q=p.fn(v);if(p.s)put(p.s,q);else p.e.setAttribute('d',q)}}
 draw(sp.x);read.textContent='rest';
 const B=register(stage,dt=>{const moving=stepS(sp,dt);draw(sp.x);return moving});bag.add(B.unregister);
 bag.add(pointer(stage,{move:p=>{sp.t=.15+clamp((p[0]-70)/260,0,1)*reach;read.textContent='sorting';B.wake()},leave:()=>{sp.t=.35;read.textContent='rest';B.wake()}}));
 bag.add(()=>svg.replaceChildren());
 return {set:v=>{reach=v},destroy:bag.dispose};
}
hairline({name:'sorting-tray',means:'A divided tray sorts loose cards as its internal stacks slide into place.',rules:[1,3,4,5,7,8,9,10],range:[.25,.65,.85],tour:[[120,150],[240,160],[290,190],null],mount});

})();
(()=>{
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

})();
(()=>{
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

})();
(()=>{
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

})();
(()=>{
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

})();
(()=>{
const {Cam,fit,proj,facing,rings,rrect,circ,prism,solid,put,mk,poly,open,clamp,spring,stepS,pointer,register,disposer}=HL;
function mount({stage,svg,read},value){
 const bag=disposer(),C=Cam(45,.5,2.65);
 fit(C,[[-50,-40,0],[90,40,0],[-50,40,40],[90,-40,40]],200,166);
 const P=proj(C),front=facing(C),g=mk('g',{},svg),sp=spring(.35);
 let reach=value,last=null;
 const parts=[];
 function block(x0,y0,x1,y1,z0,z1,r=3){const [a,b]=rings(x0,y0,x1,y1,r,.7);return prism(P,front,a,b,z0,z1)}
 function disc(x,y,r,z0,z1){const a=rrect(x-r,y-r,x+r,y+r,r,18),b=rrect(x-r+.7,y-r+.7,x+r-.7,y+r-.7,r-.7,18);return prism(P,front,a,b,z0,z1)}
 function path(points){return open(points.map(q=>P(...q)))}
 function add(fn,bright=false){const s=solid(g);parts.push({s,fn});s.sil.classList.toggle('hi',bright)}
 function line(fn,cls='nf lo'){const e=mk('path',{class:cls},g);parts.push({e,fn})}
add(v=>disc(-15,0,34,0,23));
 add(v=>disc(-15,0,24,23,26));
 add(v=>disc(-15,0,8,26,31),true);
 add(v=>block(13,-10,27,10,4,16,3));
 add(v=>block(25,-6,38+v*44,6,5,7,2));
 for(let j=0;j<9;j++)line(v=>{const end=38+v*44,x=28+j*6;return x<end-2?path([[x,-5,7],[x,j%2?-1:2,7]]):''});
 add(v=>block(35+v*44,-7,39+v*44,7,2,12,1.5));

 function draw(v){if(last!==null&&Math.abs(last-v)<.00001)return;last=v;for(const p of parts){const q=p.fn(v);if(p.s)put(p.s,q);else p.e.setAttribute('d',q)}}
 draw(sp.x);read.textContent='rest';
 const B=register(stage,dt=>{const moving=stepS(sp,dt);draw(sp.x);return moving});bag.add(B.unregister);
 bag.add(pointer(stage,{move:p=>{sp.t=.15+clamp((p[0]-70)/260,0,1)*reach;read.textContent='retract';B.wake()},leave:()=>{sp.t=.35;read.textContent='rest';B.wake()}}));
 bag.add(()=>svg.replaceChildren());
 return {set:v=>{reach=v},destroy:bag.dispose};
}
hairline({name:'retracting-reel',means:'A measuring reel extends and retracts its graduated tape.',rules:[1,3,4,5,7,8,9,10],range:[.25,.65,.85],tour:[[120,150],[240,160],[290,190],null],mount});

})();
HL.inject(document);
const descriptions=['分类盒：分类和命名是否帮助用户理解','天平：选择与重点是否清楚','弹簧盒：操作结果是否符合预期','折尺：是否存在不必要的重复和负担','沙漏：过程状态与等待是否清楚','卷线器：能否退出、撤销和恢复'];
for(const [i,f] of figures.entries()){
 const stage=document.querySelector('[data-signal-figure="'+i+'"]');if(!stage)continue;
 stage.setAttribute('data-hairline',f.name);stage.setAttribute('role','img');stage.setAttribute('aria-label',descriptions[i]);
 const svg=HL.mk('svg',{viewBox:'0 0 400 320','aria-hidden':'true'},stage);
 const read=document.createElement('span');read.className='figure-read';stage.append(read);
 f.mount({stage,svg,read},f.range[1]);
}
})();
