from pathlib import Path
import re,json,html
r=Path(__file__).parent
src=r.parent/'测试阶段用户体验评测分享提纲.md'
if not src.exists():src=r/'提纲原文.md'
s=src.read_text()
part=s[s.index('## 三、'):s.index('## 四、')]
rules=[]
for m in re.finditer(r'\*\*(\d+)\. (.*?)\*\*【(.*?)】\n(.*?)(?=\n\n\*\*\d+\.|\n\n### |\Z)',part,re.S):
 rules.append(dict(id=int(m[1]),title=m[2].rstrip('。'),type=m[3],body=m[4].strip()))
assert len(rules)==24
links=[dict(title=m[1],url=m[2]) for m in re.finditer(r'\[([^\]]+)\]\((https?[^)]+)\)',s)]
(r/'content.js').write_text('window.UX_CONTENT = '+json.dumps(dict(rules=rules,sources=list({a['url']:a for a in links}.values()),markdown=s),ensure_ascii=False)+';\n')
(r/'提纲原文.md').write_text(s)
# Small renderer for the source's headings, paragraphs, lists, tables and links.
def inline(t):
 t=html.escape(t)
 t=re.sub(r'\[([^\]]+)\]\((https?[^)]+)\)',r'<a href="\2" target="_blank" rel="noopener">\1 ↗</a>',t)
 return re.sub(r'\*\*(.*?)\*\*',r'<strong>\1</strong>',t)
lines=s.splitlines(); out=[]; i=0
while i<len(lines):
 t=lines[i];i+=1
 if not t.strip():continue
 if t.startswith('#'):
  m=re.match(r'(#+) (.*)',t);lvl=len(m[1]);out.append(f'<h{lvl}>{inline(m[2])}</h{lvl}>')
 elif t.startswith('|'):
  rows=[t]
  while i<len(lines) and lines[i].startswith('|'):rows.append(lines[i]);i+=1
  out.append('<div class="table-wrap"><table>')
  for j,row in enumerate(rows):
   if re.match(r'^\|[- :|]+\|$',row):continue
   tag='th' if j==0 else 'td'
   out.append('<tr>'+''.join(f'<{tag}>{inline(v.strip())}</{tag}>' for v in row.strip('|').split('|'))+'</tr>')
  out.append('</table></div>')
 elif t.startswith('- '):
  out.append('<ul><li>'+inline(t[2:])+'</li>')
  while i<len(lines) and lines[i].startswith('- '):out.append('<li>'+inline(lines[i][2:])+'</li>');i+=1
  out.append('</ul>')
 elif t.startswith('> '):out.append('<blockquote>'+inline(t[2:])+'</blockquote>')
 else:
  p=[t]
  while i<len(lines) and lines[i].strip() and not re.match(r'^(#|\||- |>)',lines[i]):p.append(lines[i]);i+=1
  out.append('<p>'+inline(' '.join(p))+'</p>')
(r/'reader.html').write_text('''<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>User Experience Evaluation Playbook · 完整提纲</title><link rel="stylesheet" href="layout.css"><link rel="stylesheet" href="style.css"><body class="reading"><header class="reader-bar"><a href="index.html">← 返回演示</a><span>完整提纲</span><a href="提纲原文.md" download>下载 Markdown ↓</a></header><main class="reader">'''+''.join(out)+'</main></body></html>')
print('24条规范、完整提纲与来源已生成')

# The deck now follows the same Markdown source as the reading edition.
import subprocess,sys
subprocess.run([sys.executable,str(r/"build_outline.py")],check=True)

subprocess.run([sys.executable,str(r/"refresh_assets.py")],check=True)
