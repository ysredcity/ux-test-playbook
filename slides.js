(()=>{
const art=window.UX_ART,pages=window.UX_OUTLINE_PAGES;
const esc=t=>t.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const cover=`<div class="editorial-cover-top"><span>用户体验评测操作指南</span><span>数质中心体验设计<br>Data and Quality Center UED</span></div><div class="editorial-cover-main"><div class="cover-title"><h1>User Experience<br><em>Evaluation</em><br>Playbook<span class="blue-cursor" aria-hidden="true"></span></h1></div><div class="cover-margin"><p>从操作中的心理感受，<br>追溯界面背后的设计原因。</p><button class="start" data-go="2">进入第一章 ${art.arrow}</button></div></div><div class="editorial-cover-bottom"><span>观察现象 → 理解感受 → 回查依据</span></div>`;
function supporting(p){
 if(p.extra==='approval')return `<a class="approval-recording" href="assets/approval-state.gif" target="_blank" rel="noopener" aria-label="查看审批场景原始录屏"><img src="assets/approval-state.gif" alt="实际审批录屏：左侧机器人显示已同意，右侧H5详情仍为审批中并保留拒绝、同意按钮" width="956" height="692"></a><p class="caption">差旅案例 #12 / #13 · 实际录屏 <a href="assets/approval-state.gif" target="_blank" rel="noopener">查看原图 ↗</a></p>`;
 if(p.extra.startsWith('signal:')){const n=+p.extra.split(':')[1];return `<div class="case-instrument signal-instrument">${art.signal(n)}</div><p class="caption">根据差旅案例重绘 · 非原产品截图</p>`}
 return '';
}
window.UX_SLIDES=pages.map(p=>{const ruleCount=p.kind==='rules'?(p.body.match(/class="original-rule"/g)||[]).length:0;const treatment=ruleCount>=4?' rules-many':ruleCount===1?' rule-solo':'';return {...p,cls:'editorial-page outline-'+p.kind+treatment+(p.extra==='form-demo'?' has-form-demo':''),body:p.kind==='cover'?cover:p.body}});
document.getElementById('deck').innerHTML=window.UX_SLIDES.map((p,i)=>{
 if(p.kind==='cover')return `<article class="page cover" id="p1" data-page="1" aria-label="封面"><div class="page-inner">${cover}</div></article>`;
 if(p.kind==='chapter-intro')return `<article class="page ${p.cls} chapter-divider" id="p${i+1}" tabindex="-1" data-page="${i+1}" data-section="${esc(p.section)}" aria-label="第${i+1}页：${esc(p.title)}"><div class="page-inner"><h2>${esc(p.title)}</h2></div></article>`;
 const colon=p.title.indexOf('：'),displayTitle=colon>=0?`<span class="title-prefix">${esc(p.title.slice(0,colon+1))}</span><wbr>${esc(p.title.slice(colon+1))}`:esc(p.title);
 let illustration=supporting(p);const part=p.kind==='table'?'':p.parts>1?`${p.part} / ${p.parts}`:'';
 let body=p.body;
 if(body.includes('data-case-illustration')){body=body.replace('<div data-case-illustration></div>',`<div class="signal-case-illustration">${illustration}</div>`);illustration='';}
 if(p.extra==='approval')body=body.replace(/<p\b[^>]*class="[^"]*block-scene[^"]*"[^>]*>[\s\S]*?<\/p>/,scene=>{illustration+=scene;return ''});
 if(['path','path-table','judgment'].includes(p.kind))body=body.replace(/<p data-block="([^"]+)"><strong>([^<]+ → [^<]+)<\/strong><\/p>/,(match,id,text)=>`<ol class="original-path" data-block="${id}">${text.split(' → ').map(t=>`<li>${t}</li>`).join('')}</ol>`);
 if(p.kind==='rules')body=body.replace(/<h3>(\d+)\. (.*?)<\/h3>/g,(m,n,t)=>`<h3><span class="rule-number">${n}.</span><span>${t}</span></h3>`);
 const extra=p.extra==='form-demo'?'<button class="text-button" data-demo>体验表单校验 ↗</button>':p.extra==='rule-index'?'<button class="text-button" data-rule="">搜索24条规范 ↗</button>':'';
 return `<article class="page ${p.cls}" id="p${i+1}" tabindex="-1" data-page="${i+1}" data-section="${esc(p.section)}" aria-label="第${i+1}页：${esc(p.title)}"><div class="page-inner"><div class="page-heading"><div class="heading-meta">${p.section?`<p class="outline-chapter">${esc(p.chapter)}</p>`:'<span></span>'}${part?`<span class="part-count">${part}</span>`:''}</div><h2>${displayTitle}</h2></div><div class="outline-layout ${illustration?'with-illustration':''}">${illustration?`<aside class="outline-illustration">${illustration}</aside>`:''}<div class="outline-content">${body}</div></div>${extra}</div></article>`;
}).join('');
})();
