import json,sys,urllib.parse,urllib.request,time
terms=sys.argv[1:]
out={}
for t in terms:
    u="https://itunes.apple.com/search?"+urllib.parse.urlencode({'term':t,'country':'vn','entity':'software','limit':200})
    d=json.load(urllib.request.urlopen(u))['results']
    out[t]=[(i+1,a['trackId'],a['trackName'],a.get('userRatingCount',0)) for i,a in enumerate(d)]
    me=[r for r in out[t] if r[1]==6758169645]
    print(f"\n== {t!r}: {len(d)} results | our rank: {me[0][0] if me else 'not in top '+str(len(d))}")
    for r in out[t][:8]: print(f"  {r[0]:>2}. {r[2]}  ({r[3]} ratings)")
    time.sleep(1)
json.dump(out,open('ranks.json','w'),ensure_ascii=False)
