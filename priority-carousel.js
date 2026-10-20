(()=>{
 for(const root of document.querySelectorAll('.priority-carousel')){
 const page=root.closest('.page');
 const rail=root.querySelector('.priority-rail'),slider=root.querySelector('.priority-slider'),button=root.querySelector('.priority-autoplay');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,last=0,position=0,written=0,hovered=false,focused=false,dragging=false,paused=reduced.matches,delay=0,resumeTimer=0;
 const max=()=>Math.max(0,rail.scrollWidth-rail.clientWidth);
 function sync(){slider.value=String(max()?Math.round(rail.scrollLeft/max()*1000):0);slider.setAttribute('aria-valuetext',Math.round(Number(slider.value)/10)+'%');slider.disabled=max()<=0;root.classList.toggle('no-overflow',max()<=0)}
 function label(){button.disabled=reduced.matches;button.title=reduced.matches?'系统已开启减少动态效果，可拖动滑块浏览':paused?'开始自动滚动':'暂停自动滚动';button.innerHTML=paused?'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="m8 5 11 7-11 7Z" fill="currentColor"/></svg>':'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M8 5v14M16 5v14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';button.setAttribute('aria-label',paused?'开始自动滚动':'暂停自动滚动')}
 function allowed(){return page.classList.contains('is-active')&&!document.hidden&&!reduced.matches&&!paused&&!hovered&&!focused&&!dragging&&!document.querySelector('dialog[open]')&&position<max()-.5}
 function stop(){cancelAnimationFrame(frame);frame=0;last=0}
 function tick(now){frame=0;if(!allowed()){stop();return}if(now<delay){frame=requestAnimationFrame(tick);return}if(last)position=Math.min(max(),position+Math.min(now-last,50)*.014);last=now;rail.scrollLeft=position;written=rail.scrollLeft;sync();if(position>=max()-.5){paused=true;label();stop();return}frame=requestAnimationFrame(tick)}
 function start(){sync();if(allowed()&&!frame)frame=requestAnimationFrame(tick)}
 function hold(){delay=performance.now()+4500;position=rail.scrollLeft;stop();clearTimeout(resumeTimer);resumeTimer=setTimeout(start,4500)}
 rail.addEventListener('scroll',()=>{sync();if(Math.abs(rail.scrollLeft-written)>1){position=rail.scrollLeft;hold()}},{passive:true});
 slider.addEventListener('input',()=>{hold();position=Number(slider.value)/1000*max();rail.scrollLeft=position;written=rail.scrollLeft;sync()});
 button.addEventListener('click',()=>{paused=!paused;if(!paused&&position>=max()-.5){position=0;rail.scrollLeft=0;written=0}label();start()});
 root.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;stop()}});
 root.addEventListener('pointerleave',()=>{hovered=false;delay=performance.now()+1200;start()});
 root.addEventListener('focusin',e=>{focused=e.target!==button;if(focused)stop()});
 root.addEventListener('focusout',()=>{queueMicrotask(()=>{focused=root.contains(document.activeElement)&&document.activeElement!==button;position=rail.scrollLeft;start()})});
 root.addEventListener('pointerdown',()=>{dragging=true;hold()});
 window.addEventListener('pointerup',()=>{if(!dragging)return;dragging=false;position=rail.scrollLeft;start()});
 root.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.shiftKey){e.preventDefault();hold();rail.scrollLeft+=e.deltaX||e.deltaY;position=rail.scrollLeft;written=position;sync()}},{passive:false});
 rail.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();hold();const card=rail.querySelector('.original-rule');const step=card.getBoundingClientRect().width+20;position=e.key==='Home'?0:e.key==='End'?max():Math.max(0,Math.min(max(),rail.scrollLeft+(e.key==='ArrowRight'?step:-step)));rail.scrollLeft=position;written=rail.scrollLeft;sync()});
 new MutationObserver(()=>{if(page.classList.contains('is-active')){position=rail.scrollLeft;delay=performance.now()+2200;start()}else stop()}).observe(page,{attributes:true,attributeFilter:['class']});
 new ResizeObserver(()=>{position=Math.min(rail.scrollLeft,max());sync();start()}).observe(rail);
 document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('close',()=>{delay=performance.now()+1200;start()}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});
 reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;label();stop()}else start()});
 label();sync();delay=performance.now()+2200;start();
 }
})();
