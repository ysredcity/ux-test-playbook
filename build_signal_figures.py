from pathlib import Path
R=Path(__file__).parent
names=['sorting-tray','balance-scale','spring-box','folding-ruler','hourglass','retracting-reel']
s='(()=>{const figures=[];const hairline=f=>figures.push(f);\n'
for name in names:s+='(()=>{\n'+(R/'figures'/f'{name}.js').read_text()+'\n})();\n'
s+='''HL.inject(document);
const descriptions=['分类盒：分类和命名是否帮助用户理解','天平：选择与重点是否清楚','弹簧盒：操作结果是否符合预期','折尺：是否存在不必要的重复和负担','沙漏：过程状态与等待是否清楚','卷线器：能否退出、撤销和恢复'];
for(const [i,f] of figures.entries()){
 const stage=document.querySelector('[data-signal-figure="'+i+'"]');if(!stage)continue;
 stage.setAttribute('data-hairline',f.name);stage.setAttribute('role','img');stage.setAttribute('aria-label',descriptions[i]);
 const svg=HL.mk('svg',{viewBox:'0 0 400 320','aria-hidden':'true'},stage);
 const read=document.createElement('span');read.className='figure-read';stage.append(read);
 f.mount({stage,svg,read},f.range[1]);
}
})();
'''
(R/'signal-figures.js').write_text(s)
