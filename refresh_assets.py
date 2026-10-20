"""Give local assets content-based URLs, so updated editions cannot mix cached scripts."""
from pathlib import Path
from hashlib import sha256
import re
R=Path(__file__).parent
for name in ['index.html','reader.html']:
 p=R/name
 if not p.exists():continue
 def version(m):
  prefix,url,suffix=m.groups();asset=url.split('?')[0]
  f=R/asset
  if f.suffix not in ['.js','.css'] or not f.is_file():return m[0]
  return prefix+asset+'?v='+sha256(f.read_bytes()).hexdigest()[:12]+suffix
 s=p.read_text()
 s=re.sub(r'((?:src|href)=")([^"\s]+)(")',version,s)
 p.write_text(s)
