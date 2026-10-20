from pathlib import Path
import subprocess,sys
from zipfile import ZipFile, ZIP_DEFLATED
r=Path(__file__).parent
subprocess.run([sys.executable,str(r/'refresh_assets.py')],check=True)
out=r.parent/'体验观察-Playbook演示网页.zip'
files=['index.html','outline-pages.js','visuals.js','page-manifest.json','build_outline.py','refresh_assets.py','style.css','layout.css','focus.css','content-layout.css','slides.js','app.js','content.js','reader.html','提纲原文.md','favicon.svg','README.md','DESIGN.md','PAGE_MAP.md','检查记录.md','build_content.py','export.py','environment-figures.js','build_environment_figures.py','signal-figures.js','build_signal_figures.py','dimension-figures.js','assets/approval-state.gif','vendor/alpine.min.js','vendor/LICENSE-Alpine.txt','review/round-1.md','review/round-2.md']
with ZipFile(out,'w',ZIP_DEFLATED) as z:
 files += [str(p.relative_to(r)) for p in (r/'figures').glob('*') if p.suffix in ['.js','.html','.md']]
 for f in files:z.write(r/f,'体验观察-Playbook/'+f)
print(f'{out} ({out.stat().st_size:,} bytes)')
