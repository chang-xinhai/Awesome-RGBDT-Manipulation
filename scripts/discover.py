#!/usr/bin/env python3
"""Fetch unreviewed paper candidates from the official arXiv API; never curate automatically."""
import argparse,datetime,json,pathlib,re,time,urllib.parse,urllib.request,xml.etree.ElementTree as ET
R=pathlib.Path(__file__).resolve().parents[1]
NS={'a':'http://www.w3.org/2005/Atom'}
QUERIES=[
 '(cat:cs.RO OR cat:cs.AI) AND (all:tactile OR all:visuotactile OR all:"visuo-tactile")',
 'cat:cs.RO AND (all:"precision manipulation" OR all:"robotic assembly" OR all:"contact-rich" OR all:"3D policy" OR all:"RGB-D")',
 'cat:cs.RO AND (all:"manipulation benchmark" OR all:"world action" OR all:"vision-language-action")',
]
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--since',default=json.loads((R/'data/meta.json').read_text())['reviewed']);p.add_argument('--output',required=True);p.add_argument('--max-results',type=int,default=100);args=p.parse_args()
 datetime.date.fromisoformat(args.since)
 known={re.search(r'(\d{4}\.\d{4,5})',w['links'].get('paper','')).group(1) for w in json.loads((R/'data/works.json').read_text()) if re.search(r'(\d{4}\.\d{4,5})',w['links'].get('paper',''))}
 found={};errors=[]
 for i,q in enumerate(QUERIES):
  if i:time.sleep(3.1)
  params={'search_query':q+' AND submittedDate:['+args.since.replace('-','')+'0000 TO 299912312359]','start':0,'max_results':min(max(args.max_results,1),300),'sortBy':'submittedDate','sortOrder':'descending'}
  url='https://export.arxiv.org/api/query?'+urllib.parse.urlencode(params)
  try:
   req=urllib.request.Request(url,headers={'User-Agent':'AwesomeRGBDTResearchAtlas/1.0 (local candidate review)'})
   with urllib.request.urlopen(req,timeout=45)as res:root=ET.fromstring(res.read())
   for e in root.findall('a:entry',NS):
    u=e.findtext('a:id','',NS);match=re.search(r'(\d{4}\.\d{4,5})',u)
    if not match or match.group(1)in known:continue
    id=match.group(1);found[id]={'arxiv':id,'title':' '.join(e.findtext('a:title','',NS).split()),'published':e.findtext('a:published','',NS),'updated':e.findtext('a:updated','',NS),'url':u,'authors':[x.findtext('a:name','',NS)for x in e.findall('a:author',NS)],'abstract':' '.join(e.findtext('a:summary','',NS).split()),'reviewStatus':'Unreviewed candidate'}
  except Exception as e:
   errors.append({'source':url,'error':str(e)})
   if getattr(e,'code',None)==429:break
 out={'since':args.since,'source':'Official arXiv API','scope':'Discovery candidates only; not added to the public catalog','candidates':sorted(found.values(),key=lambda x:x['published'],reverse=True),'errors':errors}
 pathlib.Path(args.output).expanduser().write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'candidateCount':len(found),'sourceErrors':len(errors),'output':args.output},indent=2))
 if errors:raise SystemExit(1)
if __name__=='__main__':main()
