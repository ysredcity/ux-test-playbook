(()=>{
const slides=window.UX_SLIDES,data=window.UX_CONTENT,pages=[...document.querySelectorAll('.page')];
let current=0,raf=0,moving=false,moveTimer,resizeTimer,resizeAnchor=null;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),pad=n=>String(n).padStart(2,'0');
const expand=document.getElementById('expand-sidebar');
const directory=document.getElementById('sidebar-directory'),toggle=document.getElementById('toggle-sidebar'),shade=document.getElementById('sidebar-shade');
function entry(text,page,cls='directory-item'){const b=document.createElement('button');b.className=cls;b.dataset.go=page;const label=document.createElement('span');label.textContent=text;b.append(label);return b}
directory.append(entry('封面',1,'directory-cover directory-item'));
for(let ci=0;ci<5;ci++){
 const group=slides.filter(s=>s.chapterIndex===ci);if(!group.length)continue;
 const section=document.createElement('section');section.className='directory-group';const h=document.createElement('h2'),chapterButton=entry(group[0].chapter,group[0].page,'directory-chapter');chapterButton.dataset.chapter=ci;if(!group[0].section)chapterButton.classList.add('chapter-landing');h.append(chapterButton);section.append(h);
 for(const p of group)if(p.section)section.append(entry(p.section,p.page));directory.append(section);
}
const tocButtons=[...directory.querySelectorAll('[data-go]')];
function keepCurrentVisible(){const active=directory.querySelector('[aria-current="page"]');if(!active||document.body.classList.contains('sidebar-collapsed'))return;const r=active.getBoundingClientRect(),v=directory.getBoundingClientRect();if(r.top<v.top+8)directory.scrollTop-=v.top+8-r.top;else if(r.bottom>v.bottom-8)directory.scrollTop+=r.bottom-v.bottom+8}
function sync(i){if(i<0||i>=pages.length)return;current=i;document.body.classList.toggle('on-cover',i===0);pages.forEach((p,j)=>{p.classList.toggle('is-active',j===i);p.inert=j!==i;p.setAttribute('aria-hidden',String(j!==i))});shade.hidden=i===0||document.body.classList.contains('sidebar-collapsed')||innerWidth>1000;
 for(const b of tocButtons){const isExact=+b.dataset.go===i+1,chapter=b.classList.contains('directory-chapter');const active=isExact&&(!chapter||!slides[i].section);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');b.classList.toggle('in-chapter',chapter&&+b.dataset.chapter===slides[i].chapterIndex)}
 keepCurrentVisible();if(location.hash!==`#p${i+1}`)history.replaceState(null,'',`#p${i+1}`);if(!pages[i].dataset.seen){pages[i].classList.add('arriving');pages[i].dataset.seen='true'}}
let transitionAnimations=[],transitionToken=0,lastFitKey='';
let gestureDistance=0,gesturePreview=null,gestureAnimations=[],gestureGeneration=0;
function go(n,behavior){
 resetGesture();
 const i=Math.max(0,Math.min(pages.length-1,n-1)),changed=i!==current,previous=pages[current],direction=i>current?1:-1,adjacent=Math.abs(i-current)===1;
 const token=++transitionToken;transitionAnimations.forEach(a=>a.cancel());transitionAnimations=[];pages.forEach(p=>p.classList.remove('is-leaving','page-enter'));clearTimeout(moveTimer);
 sync(i);fitPages();if(changed)pages[i].scrollTop=0;
 if(!changed||behavior==='instant'||reduced.matches){moving=false;return}
 moving=true;previous.classList.add('is-leaving');const distance=adjacent?Math.min(96,innerHeight*.11):32,duration=adjacent?420:260,easing='cubic-bezier(.22,.8,.22,1)';
 transitionAnimations=[previous.animate([{transform:'translateY(0)',opacity:1},{transform:`translateY(${-direction*distance*.55}px)`,opacity:0}],{duration,easing,fill:'both'}),pages[i].animate([{transform:`translateY(${direction*distance}px)`,opacity:0},{transform:'translateY(0)',opacity:1}],{duration,easing,fill:'both'})];
 Promise.all(transitionAnimations.map(a=>a.finished)).catch(()=>{}).then(()=>{if(token!==transitionToken)return;previous.classList.remove('is-leaving');transitionAnimations.forEach(a=>a.cancel());transitionAnimations=[];moving=false});
}
function fitPages(){const key=[innerWidth,innerHeight,document.body.classList.contains('on-cover'),document.body.classList.contains('sidebar-collapsed')].join(':');if(key===lastFitKey)return;lastFitKey=key;if(innerWidth<=760){pages.forEach(p=>delete p.dataset.density);return}for(const p of pages){p.dataset.density='regular';for(const level of ['compact','tight']){const cs=getComputedStyle(p),available=innerHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);if(p.querySelector('.page-inner').getBoundingClientRect().height<=available+1)break;p.dataset.density=level}}}
function setCollapsed(collapsed,align=false){document.body.classList.toggle('sidebar-collapsed',collapsed);toggle.setAttribute('aria-expanded',String(!collapsed));toggle.setAttribute('aria-label',collapsed?'展开目录':'收起目录');toggle.title=collapsed?'展开目录':'收起目录';shade.hidden=current===0||collapsed||innerWidth>1000;expand.setAttribute('aria-expanded',String(!collapsed));if(align){fitPages();go(current+1,'instant');keepCurrentVisible()}}
setCollapsed(innerWidth<=1000);toggle.addEventListener('click',()=>setCollapsed(!document.body.classList.contains('sidebar-collapsed'),true));shade.addEventListener('click',()=>setCollapsed(true,true));expand.addEventListener('click',()=>setCollapsed(false,true));
function modal(id){const d=document.getElementById(id);if(!d.open){d.showModal();document.body.style.overflow='hidden'}}
function close(d){d.close();document.body.style.overflow=''}
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('close',()=>document.body.style.overflow='');d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close(d)}})});
function renderRules(q=''){const search=q.trim().toLowerCase(),rules=data.rules.filter(r=>`${r.title} ${r.body}`.toLowerCase().includes(search));document.getElementById('rule-count').textContent=`${rules.length} / 24 个要点`;const list=document.getElementById('rule-list');list.innerHTML='';for(const r of rules){const el=document.createElement('details'),h=document.createElement('summary');h.textContent=`${pad(r.id)}　${r.title}`;el.append(h);const kind=document.createElement('p');kind.className='rule-kind';kind.textContent=r.type;el.append(kind);const body=document.createElement('p');body.textContent=r.body;el.append(body);list.append(el)}if(!rules.length){const p=document.createElement('p');p.className='empty-search';p.textContent='没有匹配的要点。试试“按钮”“表单”或“审批”。';list.append(p)}}
const input=document.getElementById('rule-search');input.addEventListener('input',()=>renderRules(input.value));
document.getElementById('source-body').innerHTML=`<p>案例取自新差旅问题汇总。界面图解根据问题描述重绘；用户感受为可能反应的分析，不等于已采集到的情绪数据。</p><p><a href="reader.html">阅读完整提纲与适用边界 ↗</a></p><ul>${data.sources.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener">${s.title} ↗</a></li>`).join('')}</ul>`;
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){e.preventDefault();const d=g.closest('dialog');if(d)close(d);if(innerWidth<=1000&&g.closest('.presentation-sidebar'))setCollapsed(true);go(+g.dataset.go);if(g.closest('.sidebar-directory,.signal-card-grid'))pages[+g.dataset.go-1].focus({preventScroll:true});return}if(e.target.closest('[data-close]')){close(e.target.closest('dialog'));return}const r=e.target.closest('[data-rule]');if(r){input.value=r.dataset.rule;renderRules(input.value);modal('rules-dialog');return}if(e.target.closest('[data-demo]')){modal('demo-dialog');return}if(e.target.closest('[data-source]'))modal('source-dialog')});
const fs=document.getElementById('fullscreen');if(!document.fullscreenEnabled){fs.hidden=true}else{fs.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{fs.title='当前浏览器不支持全屏，可使用浏览器全屏菜单'}});document.addEventListener('fullscreenchange',()=>{const on=!!document.fullscreenElement;fs.setAttribute('aria-pressed',String(on));fs.setAttribute('aria-label',on?'退出全屏演示':'进入全屏演示');fs.title=on?'退出全屏演示':'全屏演示';fs.querySelector('.tool-label').textContent=on?'退出全屏':'全屏演示';fitPages();go(current+1,'instant')})}

document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey)return;if(e.key==='Escape'&&!document.body.classList.contains('sidebar-collapsed')){setCollapsed(true,true);toggle.focus();return}if(e.target.closest('input,textarea,select,[contenteditable],summary'))return;if(e.target.closest('.presentation-sidebar')&&!e.target.closest('.pager'))return;if(e.target.closest('.original-table-wrap,.priority-carousel')&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;if(e.target.closest('button,a')&&[' ','ArrowLeft','ArrowRight'].includes(e.key))return;if(['ArrowDown','PageDown','ArrowRight',' '].includes(e.key)){e.preventDefault();go(current+2)}else if(['ArrowUp','PageUp','ArrowLeft'].includes(e.key)){e.preventDefault();go(current)}else if(e.key==='Home'){e.preventDefault();go(1)}else if(e.key==='End'){e.preventDefault();go(pages.length)}});
// Wheel and touch move the page directly; crossing the distance commits one turn.
function resetGesture(){
 ++gestureGeneration;gestureAnimations.forEach(a=>a.cancel());gestureAnimations=[];
 pages.forEach(p=>{p.style.removeProperty('transform');p.classList.remove('is-preview')});gestureDistance=0;gesturePreview=null;
}
function gestureThreshold(){return Math.max(120,Math.min(180,innerHeight*.18))}
function renderGesture(distance){
 distance=Math.max(-innerHeight*.8,Math.min(innerHeight*.8,distance));if(Math.abs(distance)<.5){resetGesture();return}
 gestureDistance=distance;const direction=distance>0?1:-1,target=current+direction,exists=target>=0&&target<pages.length,p=pages[current];
 const next=exists?pages[target]:null;if(gesturePreview!==next){if(gesturePreview){gesturePreview.classList.remove('is-preview');gesturePreview.style.removeProperty('transform')}gesturePreview=next;if(next){next.scrollTop=0;next.classList.add('is-preview')}}
 if(reduced.matches){if(exists&&Math.abs(distance)>=gestureThreshold())settleGesture(true);return}
 const offset=exists?-distance:-distance*.2;p.style.transform=`translateY(${offset}px)`;
 if(next)next.style.transform=`translateY(${direction*innerHeight-distance}px)`;
 if(exists&&Math.abs(distance)>=gestureThreshold())settleGesture(true);
}
function settleGesture(commit){
 if(!gestureDistance)return;const distance=gestureDistance,direction=distance>0?1:-1,target=current+direction,p=pages[current],next=gesturePreview;
 commit=commit&&!!next;if(reduced.matches){resetGesture();if(commit)go(target+1,'instant');return}
 moving=true;const generation=++gestureGeneration,duration=commit?380:260,easing=commit?'cubic-bezier(.2,.72,.2,1)':'cubic-bezier(.2,.8,.2,1)';
 const offset=next?-distance:-distance*.2;
 gestureAnimations=[p.animate([{transform:`translateY(${offset}px)`},{transform:`translateY(${commit?-direction*innerHeight:0}px)`}],{duration,easing,fill:'both'})];
 if(next)gestureAnimations.push(next.animate([{transform:`translateY(${direction*innerHeight-distance}px)`},{transform:`translateY(${commit?0:direction*innerHeight}px)`}],{duration,easing,fill:'both'}));
 Promise.all(gestureAnimations.map(a=>a.finished)).catch(()=>{}).then(()=>{if(generation!==gestureGeneration)return;resetGesture();moving=false;if(commit)go(target+1,'instant')});
}
let wheelLatched=false,wheelQuiet,wheelMode=null;
window.addEventListener('wheel',e=>{
 if(e.ctrlKey||e.target.closest('dialog,.presentation-sidebar,.priority-carousel')||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
 e.preventDefault();clearTimeout(wheelQuiet);wheelQuiet=setTimeout(()=>{if(!moving&&gestureDistance)settleGesture(false);wheelLatched=false;wheelMode=null},160);
 if(wheelLatched||moving)return;
 const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1),p=pages[current],down=delta>0,canScroll=down?p.scrollTop+p.clientHeight<p.scrollHeight-2:p.scrollTop>2;
 if(!gestureDistance&&(canScroll||wheelMode==='scroll')){wheelMode='scroll';p.scrollTop+=delta;return}
 renderGesture(gestureDistance+delta*.85);if(moving)wheelLatched=true;
},{passive:false});
let touchStartY=0,touchStartX=0,touchBoundary=false;
window.addEventListener('touchstart',e=>{if(moving||e.touches.length!==1||e.target.closest('dialog,.presentation-sidebar,.priority-carousel')){touchBoundary=false;return}const p=pages[current];touchStartY=e.touches[0].clientY;touchStartX=e.touches[0].clientX;touchBoundary={top:p.scrollTop<=1,bottom:p.scrollTop+p.clientHeight>=p.scrollHeight-2}},{passive:true});
window.addEventListener('touchmove',e=>{if(!touchBoundary||e.touches.length!==1)return;if(moving){e.preventDefault();return}const dy=touchStartY-e.touches[0].clientY,dx=touchStartX-e.touches[0].clientX;if(Math.abs(dy)>Math.abs(dx)&&((dy>0&&touchBoundary.bottom)||(dy<0&&touchBoundary.top))){e.preventDefault();renderGesture(dy*.85)}},{passive:false});
window.addEventListener('touchend',()=>{touchBoundary=false;if(!moving&&gestureDistance)settleGesture(false)},{passive:true});
window.addEventListener('touchcancel',()=>{touchBoundary=false;if(!moving&&gestureDistance)settleGesture(false)},{passive:true});
window.addEventListener('hashchange',()=>{const n=Number(location.hash.replace('#p',''));if(n>=1&&n<=pages.length)go(n)});
window.addEventListener('resize',()=>{if(resizeAnchor===null)resizeAnchor=current;moving=true;clearTimeout(moveTimer);clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const anchor=resizeAnchor;resizeAnchor=null;shade.hidden=current===0||innerWidth>1000||document.body.classList.contains('sidebar-collapsed');fitPages();go(anchor+1,'instant')},120)});
const params=new URLSearchParams(location.search),state=params.get('state'),findPage=(ci,section='')=>slides.find(p=>p.chapterIndex===ci&&(!section||p.section.includes(section)))?.page||1;
const states={cover:1,comparison:findPage(0,'三者分别'),approval:findPage(0,'同一个审批'),logic:findPage(0,'敏感度'),signals:findPage(1),priority:findPage(1,'犹豫'),form:findPage(2,'继续'),feedback:findPage(2,'确认结果'),boundary:findPage(3),ending:slides.length},initial=states[state]||Number(params.get('page'))||Number(location.hash.replace('#p',''))||1;
fitPages();go(initial,'instant');window.addEventListener('load',()=>{fitPages();go(initial,'instant')},{once:true});
document.addEventListener('click',e=>{if(e.target.closest('.mini-form .solid'))requestAnimationFrame(()=>document.querySelector('.mini-form [aria-invalid="true"]')?.focus())});
})();
