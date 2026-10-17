#!/usr/bin/env python3
"""Validate publication boundaries, schema completeness, provenance, and local assets."""
import json,pathlib,re,datetime,collections,sys
R=pathlib.Path(__file__).resolve().parents[1];works=json.loads((R/'data/works.json').read_text());media=json.loads((R/'data/media.json').read_text());errors=[];cutoff=json.loads((R/'data/meta.json').read_text())['reviewed']
def check(ok,message):
 if not ok:errors.append(message)
ids=[w['id']for w in works];check(len(ids)==len(set(ids)),'Duplicate canonical work IDs')
required=['id','name','title','date','year','collections','categories','resourceType','summary','institution','venue','modalities','environments','embodiments','links','release','evidence','caveats','verified']
fields={'benchmark':['simulator','simulatorVersion','taskCount','tasks','taskListScope','capabilities','metrics','robots','sensors','data','protocol','baselines'],'policy':['family','baseModel','modelSize','inputs','outputs','trainingData','trainingTime','trainingHardware','controlRate','trainingMethod','evaluation']}
survey_fields=['scope','taxonomy','adaptationRegimes','contextSources','evaluationAxes','corpus','reviewMethod','coverageLimits']
cat={'benchmark':{'tactile-benchmarks','precision-assembly','dexterous-benchmarks','general-manipulation','robustness-evaluation','supporting-resources'},'policy':{'tactile-il','tactile-foundation','rgbd-3d','visual-precision-rl','generalist-foundation','agent-rsi-icl'}}
knownTypes={'benchmark','policy','dataset','simulator','evaluation-tool','survey'}
primary=collections.defaultdict(list)
for w in works:
 id=w['id'];check(all(k in w for k in required),id+': incomplete common fields');check(bool(re.fullmatch('[a-z0-9]+(?:-[a-z0-9]+)*',id)),id+': invalid stable ID');check(w['resourceType']in knownTypes,id+': invalid resource type')
 date=w['date'];check(not date or bool(re.fullmatch(r'\d{4}(?:-\d{2})?(?:-\d{2})?',date)),id+': invalid publication date');check(not date or date<=cutoff,id+': future publication date');check((not date and w['year']==0)or(date and int(date[:4])==w['year']),id+': inconsistent date/year')
 check(bool(re.fullmatch(r'\d{4}-\d{2}-\d{2}',w['verified'])) and w['verified']<=cutoff,id+': unexpected review snapshot');check(bool(w['evidence']),id+': no primary evidence')
 if w['resourceType']=='survey':
  check(bool(w.get('survey')) and not w.get('policy') and not w.get('benchmark'),id+': survey must describe literature rather than an executable policy or benchmark')
  check(not w['modalities'] and not w['embodiments'],id+': survey must not claim deployment observations or a robot embodiment')
 else:check(not w.get('survey'),id+': survey fields require the survey resource type')
 for c in w['collections']:
  check(c in fields,id+': unknown collection');check(any(k in cat.get(c,set())for k in w['categories']),id+': missing collection category');obj=w.get('survey'if w['resourceType']=='survey'else c,{})
  check(all(k in obj for k in (survey_fields if w['resourceType']=='survey'else fields.get(c,[]))),id+': incomplete '+c+' fields')
  for k,v in obj.items():check(v is not None and (isinstance(v,(str,list))),id+': invalid '+c+'.'+k)
 for k in ['code','weights','data','license','notes']:check(bool(w['release'].get(k)),id+': missing release.'+k)
 for e in w['evidence']:check(bool(re.match('https?://',e.get('url','')))and bool(e.get('label'))and bool(e.get('fields')),id+': incomplete evidence')
 for k,u in w['links'].items():check(bool(re.match('https?://',u)),id+': invalid '+k+' link')
 if w.get('benchmark'):
  check(isinstance(w['benchmark']['tasks'],list),id+': tasks must be a scoped list');check(bool(w['benchmark']['taskListScope']),id+': task list lacks scope')
 check(not any('propose our' in str(v).lower() for v in w.values()),id+': private planning prose')
 paper=w['links'].get('paper','');arxiv=re.search(r'arxiv\.org/(?:abs|pdf|html)/(\d{4}\.\d{4,5})',paper)
 paper='https://arxiv.org/abs/'+arxiv.group(1)if arxiv else re.sub(r'v\d+$','',paper.replace('/html/','/abs/'))
 if paper:primary[paper].append(id)
 for target in w.get('relatedIds',[]):check(target in ids and target!=id,id+': missing/self relation '+target)
for url,group in primary.items():check(len(group)==1,'Duplicate canonical paper: '+','.join(group))
for id,contexts in media.items():
 check(id in ids,'Orphan media ID '+id)
 for c,m in contexts.items():
  check(c in ['benchmark','policy'],id+': invalid figure context');check(all(m.get(k) for k in ['path','original','page','credit','alt','kind','reviewed']),id+': incomplete figure provenance')
  check(all(isinstance(m.get(k),str)for k in ['path','original','page','credit','alt','kind','reviewed']),id+': figure provenance must use strings')
  check(all(bool(re.match('https?://',str(m.get(k,''))))for k in ['page','original']),id+': figure source must be a primary URL')
  check(isinstance(m.get('reviewed'),str) and bool(re.fullmatch(r'\d{4}-\d{2}-\d{2}',m.get('reviewed',''))) and m['reviewed']<=cutoff,id+': invalid figure review date')
  path=(R/'website/public'/m.get('path','').lstrip('/')).resolve();check(path.is_relative_to((R/'website/public').resolve()),id+': unsafe asset path');check(path.exists(),id+': missing figure '+str(path))
  if c=='policy'and next((w['resourceType']for w in works if w['id']==id),None)!='survey':check(m.get('kind')not in ['taxonomy','task-overview'],id+': benchmark figure used for policy')
  if c=='benchmark':check(m.get('kind')not in ['architecture','pipeline'],id+': policy pipeline used for benchmark')
readme=(R/'README.md').read_text()if(R/'README.md').exists()else''
for id in ids:check('<!-- work:'+id+' -->'in readme,id+': missing generated README record')
check((R/'website/public/README.md').read_text()==readme,'Website README is stale')
audit=json.loads((R/'data/policy-source-audit.json').read_text())
check(audit['reviewed']==cutoff,'Policy roster audit has a different review date')
check(bool(audit['sources']),'Policy roster audit is empty')
check(len({s['id']for s in audit['sources']})==len(audit['sources']),'Duplicate policy roster source IDs')
for source in audit['sources']:
 check(source['kind']in ['paper-baselines','leaderboard','adapter-registry'],'Unexpected policy roster source type')
 check(all(source.get(k)for k in ['label','url','scope','entries']),'Incomplete policy roster source '+source['id'])
 check(bool(re.match('https?://',source['url'])),'Invalid policy roster source URL')
 check(not source.get('benchmarkId')or source['benchmarkId']in ids,'Policy roster benchmark does not exist')
 for entry in source['entries']:
  target=next((w for w in works if w['id']==entry.get('workId')),None)
  check(bool(entry.get('name')),'Unnamed source alias in '+source['id'])
  check(bool(target and 'policy'in target['collections'])if entry.get('workId')else bool(entry.get('note')),'Unmapped policy alias without qualification: '+entry['name'])
check(json.loads((R/'website/public/policy-source-audit.json').read_text())==audit,'Website policy roster audit is stale')
survey_audit=json.loads((R/'data/survey-source-audit.json').read_text())
check(survey_audit['reviewed']==cutoff,'Survey reference audit has a different review date')
survey_sources=survey_audit['sources'];check(bool(survey_sources),'Survey reference audit is empty')
check(len({s['id']for s in survey_sources})==len(survey_sources),'Duplicate survey audit source IDs')
for source in survey_sources:
 survey=next((w for w in works if w['id']==source.get('workId')),None)
 check(bool(survey and survey['resourceType']=='survey'),'Survey audit source must link to a survey record')
 check(all(source.get(k)for k in ['label','url','referencesUrl','corpusUrl','snapshot','scope','entries']),'Incomplete survey audit source')
 check(all(bool(re.match('https?://',source.get(k,'')))for k in ['url','referencesUrl','corpusUrl']),'Invalid survey audit source URL')
 check(len({e['key']for e in source['entries']})==len(source['entries']),'Duplicate survey reference key')
 for entry in source['entries']:
  check(entry.get('status')in ['indexed','outside-scope','background','adjacent-resource','candidate'],'Unknown survey reference disposition')
  check(bool(entry.get('title')and entry.get('note')and re.match('https?://',entry.get('url',''))),'Incomplete survey reference evidence')
  check(entry.get('workId')in ids if entry['status']=='indexed'else not entry.get('workId'),'Invalid survey citation mapping: '+entry['key'])
for w in works:
 if w.get('surveyAuditId'):check(any(s['id']==w['surveyAuditId']and s['workId']==w['id']for s in survey_sources),'Missing survey citation audit: '+w['id'])
check(json.loads((R/'website/public/survey-source-audit.json').read_text())==survey_audit,'Website survey reference audit is stale')
check(not(R/'.openai/hosting.json').exists(),'Unexpected hosting configuration');check(not(R/'.github/workflows/deploy.yml').exists(),'Unexpected deployment workflow')
if errors:
 print('\n'.join(errors));print(f'FAILED: {len(errors)} data/provenance issues');sys.exit(1)
print(json.dumps({'status':'passed','uniqueRecords':len(works),'benchmarkRecords':sum('benchmark'in w['collections']and'supporting-resources'not in w['categories']and w['resourceType']!='survey'for w in works),'policyRecords':sum('policy'in w['collections']and w['resourceType']!='survey'for w in works),'surveyRecords':sum(w['resourceType']=='survey'for w in works),'supportingRecords':sum('supporting-resources'in w['categories']for w in works),'scopedTaskLabels':sum(len(w.get('benchmark',{}).get('tasks',[]))for w in works),'figures':sum(len(x)for x in media.values()),'primaryEvidenceURLs':len(set(s['url']for w in works for s in w['evidence']))},indent=2))
