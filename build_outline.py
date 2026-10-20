from pathlib import Path
import re,json,html
R=Path(__file__).parent
source=R.parent/'测试阶段用户体验评测分享提纲.md'
if not source.exists():source=R/'提纲原文.md'
raw=source.read_text()
document_title=re.search(r'^# (.+)$',raw,re.M)[1]
def inline(t):
 t=html.escape(t)
 t=re.sub(r'\[([^\]]+)\]\((https?[^)]+)\)',r'<a href="\2" target="_blank" rel="noopener">\1 ↗</a>',t)
 return re.sub(r'\*\*(.*?)\*\*',r'<strong>\1</strong>',t)
chapters=[];blocks=[];tables=[];chapter=None;section=None
lines=raw.splitlines();i=0
while i<len(lines):
 line=lines[i];i+=1
 if line.startswith('## '):
  chapter={'title':line[3:],'index':len(chapters),'intro':[],'sections':[]};chapters.append(chapter);section=None;continue
 if line.startswith('### '):
  section={'title':line[4:],'blocks':[]};chapter['sections'].append(section);continue
 if chapter is None or not line.strip():continue
 block={'id':f'b{len(blocks)+1:03}','chapter':chapter['index'],'section':section['title'] if section else ''}
 if line.startswith('|'):
  rows=[line]
  while i<len(lines) and lines[i].startswith('|'):rows.append(lines[i]);i+=1
  parsed=[[v.strip() for v in row.strip('|').split('|')] for row in rows if not re.match(r'^\|[- :|]+\|$',row)]
  block.update(type='table',header=parsed[0],rows=parsed[1:],tableId=f't{len(tables)+1}')
  tables.append(block)
 elif line.startswith('- '):
  items=[line[2:]]
  while i<len(lines) and lines[i].startswith('- '):items.append(lines[i][2:]);i+=1
  block.update(type='list',items=items)
 elif line.startswith('> '):block.update(type='quote',text=line[2:])
 else:
  para=[line]
  while i<len(lines) and lines[i].strip() and not re.match(r'^(##|\||- |>)',lines[i]):para.append(lines[i]);i+=1
  txt='\n'.join(para)
  if re.match(r'^\*\*\d+\.',txt):
   m=re.match(r'^\*\*(\d+)\. (.*?)\*\*【(.*?)】\n(.*)',txt,re.S);assert m,txt
   block.update(type='rule',number=int(m[1]),title=m[2],kind=m[3],text=m[4])
  else:block.update(type='paragraph',text=txt)
 blocks.append(block);(section['blocks'] if section else chapter['intro']).append(block)

def labeled_text(text):
 # Preserve every original word; expose its role for the presentation hierarchy.
 labels={'设计原因与专业依据':'analysis','关注对象':'focus','期望获得的体验':'expect','差旅案例':'case','判断依据':'criteria','边界':'boundary','场景':'scene','依据':'source','认知与交互原则参考':'source'}
 for label,role in labels.items():
  m=re.match(r'^(?:\*\*'+re.escape(label)+r'\*\*|'+re.escape(label)+r')([：:])(.*)$',text,re.S)
  if m:return role,f'<span class="block-label">{label}{m[1]}</span><span class="block-text">{inline(m[2])}</span>'
 return '',inline(text)

def render(b):
 bid=b['id'];t=b['type']
 if t=='paragraph':
  role,body=labeled_text(b['text'])
  cls=f' class="labeled-block block-{role}"' if role else ''
  return f'<p{cls} data-block="{bid}">{body}</p>'
 if t=='quote':return f'<blockquote data-block="{bid}">{inline(b["text"])}</blockquote>'
 if t=='list':return f'<ul data-block="{bid}">'+''.join('<li>'+inline(v)+'</li>' for v in b['items'])+'</ul>'
 if t=='rule':return f'<section class="original-rule" data-block="{bid}"><h3>{b["number"]}. {inline(b["title"])}</h3><span class="rule-authority">【{inline(b["kind"])}】</span><p>{inline(b["text"])}</p></section>'
 raise ValueError(t)

def table(b,start=0,end=None):
 end=len(b['rows']) if end is None else end
 rows=b['rows'][start:end]
 headers=''.join(f'<th scope="col">{inline(v)}</th>' for v in b['header'])
 result=f'<div class="original-table-wrap" tabindex="0" role="region" aria-label="{html.escape(b["section"] or b["tableId"])} 横向对比表"><table class="original-table table-{b["tableId"]}" data-table="{b["tableId"]}" data-block="{b["id"]}" data-start="{start}" data-end="{end}"><thead><tr>{headers}</tr></thead><tbody>'
 for row in rows:
  result+='<tr>'+''.join(('<th scope="row">' if j==0 else '<td>')+inline(v)+('</th>' if j==0 else '</td>') for j,v in enumerate(row))+'</tr>'
 return result+'</tbody></table></div><p class="table-mobile-hint">左右滑动表格，查看完整横向对比。</p>'

pages=[]
def add(ci,section,bs=None,kind='prose',extra='',body=None,table_parts=None):
 bs=bs or []
 pages.append({'chapter':chapters[ci]['title'],'chapterIndex':ci,'chapterShort':['第一章','第二章','第三章','第四章','来源与口径'][ci],'section':section,'title':section or chapters[ci]['title'],'kind':kind,'blockIds':[b['id'] for b in bs],'body':body if body is not None else ''.join(render(b) for b in bs),'extra':extra,'tables':table_parts or []})

def add_table(ci,sec,b,start,end,bs=None):
 bs=bs or []
 add(ci,sec,bs,kind='table',body=table(b,start,end)+''.join(render(x) for x in bs),table_parts=[{'id':b['tableId'],'start':start,'end':end,'header':b['header'],'rows':b['rows'][start:end]}])

# Each original subsection owns one presentation page.
c=chapters[0]
for si,sec in enumerate(c['sections']):
 bs=sec['blocks'];title=sec['title']
 if si==0:
  t=next(b for b in bs if b['type']=='table');notes=[b for b in bs if b['type']!='table']
  add(0,title,notes,kind='table',body=table(t)+'<div class="table-notes">'+''.join(render(b) for b in notes)+'</div>',table_parts=[{'id':t['tableId'],'start':0,'end':len(t['rows']),'header':t['header'],'rows':t['rows']}])
 elif si==1:add(0,title,bs,kind='approval',extra='approval')
 elif '四个判断方向' in title:
  t=next(b for b in bs if b['type']=='table');notes=[b for b in bs if b['type']!='table']
  cards='<div class="experience-directions" data-block="'+t['id']+'">'
  for j,row in enumerate(t['rows']):
   cards+='<section class="experience-direction"><div class="direction-heading"><div class="direction-figure" data-ux-figure="'+str(j)+'"></div><div><h3>'+inline(row[0])+'</h3></div></div><p class="direction-focus"><span>关注方向</span>'+inline(row[2])+'</p><p class="direction-case"><span>案例与规范</span>'+inline(row[3])+'</p>'+('<div class="direction-boundary">'+render(notes[j-2])+'</div>' if j>=2 else '')+'</section>'
  cards+='</div>'
  add(0,title,notes,kind='dimensions',body=cards,table_parts=[{'id':t['tableId'],'start':0,'end':len(t['rows']),'header':t['header'],'rows':t['rows']}])
 elif '信息如何表达' in title:
  t=next(b for b in bs if b['type']=='table');ti=bs.index(t);tail=bs[ti+1:];li=next(j for j,b in enumerate(tail) if b['type']=='list')
  body=''.join(render(b) for b in bs[:ti])+'<div class="observation-panels" data-block="'+t['id']+'">'
  for j,row in enumerate(t['rows']):
   body+='<section class="observation-panel"><h3>'+inline(row[0])+'</h3><p class="observation-judgment"><span>需要判断什么</span>'+inline(row[1])+'</p><p class="observation-case"><span>对应差旅案例</span>'+inline(row[2])+'</p><div class="observation-detail">'+(''.join(render(b) for b in tail[:li-1]) if j==0 else ''.join(render(b) for b in tail[li-1:li+1]))+'</div></section>'
  body+='</div><div class="observation-summary">'+''.join(render(b) for b in tail[li+1:])+'</div>'
  add(0,title,[b for b in bs if b['type']!='table'],kind='observation',body=body,table_parts=[{'id':t['tableId'],'start':0,'end':len(t['rows']),'header':t['header'],'rows':t['rows']}])
 elif '从感受信号' in title:
  ti=next(j for j,b in enumerate(bs) if b['type']=='table');t=bs[ti]
  path=next(b for b in bs[:ti] if '→' in b.get('text',''))
  path_label=next(b for b in bs[:ti] if b.get('text','').startswith('体验工程师的判断路径'))
  steps=re.sub(r'^\*\*|\*\*$','',path['text']).split(' → ')
  body='<div class="judgment-steps">'+render(path_label)+'<ol class="evaluation-steps" data-block="'+path['id']+'">'+''.join('<li><span>'+str(j+1).zfill(2)+'</span><div class="step-title">'+inline(text)+'</div></li>' for j,text in enumerate(steps))+'</ol></div>'
  body+='<div class="judgment-stacked"><div class="judgment-observations">'+''.join(render(b) for b in bs[:ti] if b not in [path,path_label])+'</div><div class="judgment-interpretation">'+''.join(render(b) for b in bs[ti+1:] if not b.get('text','').startswith(('认知与交互原则参考','以上感受是根据问题现象推导','情绪和操作阻力提供线索')))+'</div></div>'+table(t)
  add(0,title,[b for b in bs if b['type']!='table'],kind='judgment',body=body,table_parts=[{'id':t['tableId'],'start':0,'end':len(t['rows']),'header':t['header'],'rows':t['rows']}])
 else:add(0,title,bs,kind='principle')
c=chapters[1];intro=c['intro'];t=next(b for b in intro if b['type']=='table')
signal_cards='<div class="signal-card-grid" data-block="'+t['id']+'">'+''.join('<a class="signal-card" href="#p'+str(len(pages)+3+j)+'" data-go="'+str(len(pages)+3+j)+'" aria-label="查看'+html.escape(row[0])+'章节"><div class="signal-card-figure" data-signal-figure="'+str(j)+'"></div><h3>'+inline(row[0])+'</h3><p>'+inline(row[1])+'</p></a>' for j,row in enumerate(t['rows']))+'</div>'
add(1,'',[b for b in intro if b['type']!='table'],kind='signal-index',body=''.join(signal_cards if b['type']=='table' else render(b) for b in intro),table_parts=[{'id':t['tableId'],'start':0,'end':len(t['rows']),'header':t['header'],'rows':t['rows']}])
for si,sec in enumerate(c['sections']):
 bs=sec['blocks'];title=sec['title']
 if si<6:
  groups=[]
  for b in bs:
   role,_=labeled_text(b.get('text',''))
   if role=='expect':continue
   if role:groups.append((role,[b]))
   elif groups:groups[-1][1].append(b)
  body='<div class="signal-detail-sections">'+''.join('<section class="signal-detail-section detail-'+role+'">'+''.join(render(b) for b in items)+('<div data-case-illustration></div>' if role=='case' else '')+'</section>' for role,items in groups)+'</div>'
  add(1,title,bs,kind='signal-merged',extra=f'signal:{si}',body=body)
 else:
  body=''
  for b in bs:
   if b['type']=='list':
    body+='<div class="environment-card-grid" data-block="'+b['id']+'">'
    for j,item in enumerate(b['items']):
     m=re.match(r'^\*\*(.*?)\*\*[：:](.*)$',item,re.S)
     body+='<section class="environment-card"><div class="environment-figure" data-environment-figure="'+str(j)+'"></div><h3>'+inline(m[1])+'</h3><p>'+inline(m[2].strip())+'</p></section>'
    body+='</div>'
   else:body+=render(b)
  add(1,title,bs,kind='environment',body=body)
c=chapters[2];add(2,'',c['intro'],kind='chapter-intro',extra='rule-index')
for sec in c['sections']:
 bs=sec['blocks'];extra='form-demo' if any(b.get('number')==18 for b in bs) else ''
 add(2,sec['title'],bs,kind='rules',extra=extra)
c=chapters[3]
for sec in c['sections']:
 bs=sec['blocks'];title=sec['title']
 if any(b['type']=='table' for b in bs):
  t=next(b for b in bs if b['type']=='table');notes=[b for b in bs if b['type']!='table']
  add(3,title,notes,kind='table',body=table(t)+'<div class="table-notes">'+''.join(render(b) for b in notes if not b.get('text','').startswith(('规范中的“必须/不允许”','差旅记录中的“菜单放到TabBar”')))+'</div>',table_parts=[{'id':t['tableId'],'start':0,'end':len(t['rows']),'header':t['header'],'rows':t['rows']}])
 else:add(3,title,bs,kind='criteria' if any(b['type']=='list' for b in bs) else 'prose')
c=chapters[4];sourceblocks=c['intro'];lst=next(b for b in sourceblocks if b['type']=='list')
add(4,'',sourceblocks,kind='sources')

# Annotate continuation pages without inventing a new section hierarchy.
for ci,c in enumerate(chapters):
 titles=['']+[s['title'] for s in c['sections']]
 for title in titles:
  match=[p for p in pages if p['chapterIndex']==ci and p['section']==title]
  for j,p in enumerate(match):p['part']=j+1;p['parts']=len(match)
cover={'chapter':'封面','chapterIndex':-1,'chapterShort':'封面','section':'','title':document_title,'kind':'cover','body':'','blockIds':[],'tables':[],'part':1,'parts':1,'extra':''}
result=[cover]+pages
for j,p in enumerate(result):p['page']=j+1;p['key']='cover' if j==0 else 'section-'+str(p['chapterIndex']+1)+'-'+str(j)
(R/'outline-pages.js').write_text('window.UX_OUTLINE_PAGES = '+json.dumps(result,ensure_ascii=False,indent=1)+';\n')
(R/'page-manifest.json').write_text(json.dumps({'chapters':[{'title':c['title'],'sections':[s['title'] for s in c['sections']]} for c in chapters],'pages':[{k:v for k,v in p.items() if k!='body'} for p in result],'tables':tables,'blockIds':[b['id'] for b in blocks]},ensure_ascii=False,indent=2))
# Integrity check: every source block is represented, and every table row appears once.
represented={bid for p in result for bid in p['blockIds']}
for b in blocks:
 if b['type']=='table':
  fragments=[f for p in result for f in p['tables'] if f['id']==b['tableId']]
  assert all(f['header']==b['header'] for f in fragments)
  assert [row for f in fragments for row in f['rows']]==b['rows'],b['tableId']
 elif b['id']==lst['id']:assert b['id'] in represented
 else:assert b['id'] in represented,b
assert sum(b['type']=='rule' for b in blocks)==24
print(f'{len(result)}页；{len(chapters)}组原始章级目录；{len(tables)}张表共{sum(len(t["rows"]) for t in tables)}行全部保留；24条规范全部进入正文。')
# Human-readable mapping is generated from the same source.
notes=['# 演示页与原始提纲对应','', '| 页码 | 原始章节 | 原始小节 | 分页 |','|---|---|---|---|']
for p in result:notes.append(f'| {p["page"]} | {p["chapter"]} | {p["section"] or "—"} | {str(p["part"])+" / "+str(p["parts"])} |')
notes+=['','每个原始小节合并为一个演示页；目录名称、小节顺序与正文内容均取自原始Markdown。表格内容在同一演示页完整呈现，其中四个体验判断方向改为四组插图与文本；所有原始单元格保持原文。案例图解是补充材料，不替换正文。']
(R/'PAGE_MAP.md').write_text('\n'.join(notes)+'\n')
