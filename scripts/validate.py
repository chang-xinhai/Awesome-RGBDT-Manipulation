#!/usr/bin/env python3
"""Validate publication boundaries, schema completeness, provenance, and local assets."""
import json,pathlib,re,datetime,collections,sys
R=pathlib.Path(__file__).resolve().parents[1];works=json.loads((R/'data/works.json').read_text());media=json.loads((R/'data/media.json').read_text());errors=[];cutoff=json.loads((R/'data/meta.json').read_text())['reviewed']
def check(ok,message):
 if not ok:errors.append(message)
ids=[w['id']for w in works];check(len(ids)==len(set(ids)),'Duplicate canonical work IDs')
required=['id','name','title','date','year','collections','categories','resourceType','summary','institution','venue','modalities','environments','embodiments','links','release','evidence','caveats','verified']
fields={'benchmark':['simulator','simulatorVersion','taskCount','tasks','taskListScope','capabilities','metrics','robots','sensors','data','protocol','baselines'],'policy':['family','baseModel','modelSize','inputs','outputs','trainingData','trainingTime','trainingHardware','controlRate','trainingMethod','evaluation']}
cat={'benchmark':{'tactile-benchmarks','precision-assembly','dexterous-benchmarks','general-manipulation','robustness-evaluation','supporting-resources'},'policy':{'tactile-il','tactile-foundation','rgbd-3d','visual-precision-rl','generalist-foundation'}}
knownTypes={'benchmark','policy','dataset','simulator','evaluation-tool'}
primary=collections.defaultdict(list)
for w in works:
 id=w['id'];check(all(k in w for k in required),id+': incomplete common fields');check(bool(re.fullmatch('[a-z0-9]+(?:-[a-z0-9]+)*',id)),id+': invalid stable ID');check(w['resourceType']in knownTypes,id+': invalid resource type')
 date=w['date'];check(not date or bool(re.fullmatch(r'\d{4}(?:-\d{2})?(?:-\d{2})?',date)),id+': invalid publication date');check(not date or date<=cutoff,id+': future publication date');check((not date and w['year']==0)or(date and int(date[:4])==w['year']),id+': inconsistent date/year')
 check(bool(re.fullmatch(r'\d{4}-\d{2}-\d{2}',w['verified'])) and w['verified']<=cutoff,id+': unexpected review snapshot');check(bool(w['evidence']),id+': no primary evidence')
 for c in w['collections']:
  check(c in fields,id+': unknown collection');check(any(k in cat.get(c,set())for k in w['categories']),id+': missing collection category');obj=w.get(c,{})
  check(all(k in obj for k in fields.get(c,[])),id+': incomplete '+c+' fields')
  for k,v in obj.items():check(v is not None and (isinstance(v,(str,list))),id+': invalid '+c+'.'+k)
 for k in ['code','weights','data','license','notes']:check(bool(w['release'].get(k)),id+': missing release.'+k)
 for e in w['evidence']:check(bool(re.match('https?://',e.get('url','')))and bool(e.get('label'))and bool(e.get('fields')),id+': incomplete evidence')
 for k,u in w['links'].items():check(bool(re.match('https?://',u)),id+': invalid '+k+' link')
 if w.get('benchmark'):
  check(isinstance(w['benchmark']['tasks'],list),id+': tasks must be a scoped list');check(bool(w['benchmark']['taskListScope']),id+': task list lacks scope')
 check(not any('propose our' in str(v).lower() for v in w.values()),id+': private planning prose')
 paper=w['links'].get('paper','');paper=re.sub(r'v\d+$','',paper.replace('/html/','/abs/'))
 if paper:primary[paper].append(id)
 for target in w.get('relatedIds',[]):check(target in ids and target!=id,id+': missing/self relation '+target)
for url,group in primary.items():check(len(group)==1,'Duplicate canonical paper: '+','.join(group))
for id,contexts in media.items():
 check(id in ids,'Orphan media ID '+id)
 for c,m in contexts.items():
  check(c in ['benchmark','policy'],id+': invalid figure context');check(all(m.get(k) for k in ['path','original','page','credit','alt','kind','reviewed']),id+': incomplete figure provenance')
  path=(R/'website/public'/m.get('path','').lstrip('/')).resolve();check(path.is_relative_to((R/'website/public').resolve()),id+': unsafe asset path');check(path.exists(),id+': missing figure '+str(path))
  if c=='policy':check(m.get('kind')not in ['taxonomy','task-overview'],id+': benchmark figure used for policy')
  if c=='benchmark':check(m.get('kind')not in ['architecture','pipeline'],id+': policy pipeline used for benchmark')
readme=(R/'README.md').read_text()if(R/'README.md').exists()else''
for id in ids:check('<!-- work:'+id+' -->'in readme,id+': missing generated README record')
check((R/'website/public/README.md').read_text()==readme,'Website README is stale')
check(not(R/'.openai/hosting.json').exists(),'Unexpected hosting configuration');check(not(R/'.github/workflows/deploy.yml').exists(),'Unexpected deployment workflow')
if errors:
 print('\n'.join(errors));print(f'FAILED: {len(errors)} data/provenance issues');sys.exit(1)
print(json.dumps({'status':'passed','uniqueRecords':len(works),'benchmarkRecords':sum('benchmark'in w['collections']and'supporting-resources'not in w['categories']for w in works),'policyRecords':sum('policy'in w['collections']for w in works),'supportingRecords':sum('supporting-resources'in w['categories']for w in works),'scopedTaskLabels':sum(len(w.get('benchmark',{}).get('tasks',[]))for w in works),'figures':sum(len(x)for x in media.values()),'primaryEvidenceURLs':len(set(s['url']for w in works for s in w['evidence']))},indent=2))
