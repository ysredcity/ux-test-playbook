from pathlib import Path
R=Path(__file__).parent
names=['index-box','device-stand','trackball']
s='(()=>{const figures=[];const hairline=f=>figures.push(f);\n'
for name in names:s+='(()=>{\n'+(R/'figures'/f'{name}.js').read_text()+'\n})();\n'
s+='''HL.inject(document);
const descriptions=['索引盒：熟悉规则与重新查找','设备支架：不同宿主和终端中的任务延续','轨迹球：不同操作能力与使用环境'];
for(const [i,f] of figures.entries()){
 const stage=document.querySelector('[data-environment-figure="'+i+'"]');if(!stage)continue;
 stage.setAttribute('data-hairline',f.name);stage.setAttribute('role','img');stage.setAttribute('aria-label',descriptions[i]);
 const svg=HL.mk('svg',{viewBox:'0 0 400 320','aria-hidden':'true'},stage);
 const read=document.createElement('span');read.className='figure-read';stage.append(read);
 f.mount({stage,svg,read},f.range[1]);
}
})();
'''
(R/'environment-figures.js').write_text(s)
