"""Independent reference checks for the design examples; no game implementation imports."""
from pathlib import Path
import json

fixtures = json.loads(Path(__file__).with_name('rules-fixtures.json').read_text())

def coords(a):
    return [(x, y) for y, row in enumerate(a) for x, c in enumerate(row) if c != '.']

def component(a, start):
    w, h = len(a[0]), len(a)
    x, y = start
    colour = a[y][x]
    seen = set()
    todo = [(x, y)] if colour != '.' else []
    while todo:
        p = todo.pop()
        if p in seen:
            continue
        seen.add(p)
        x, y = p
        for q in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
            qx, qy = q
            if 0 <= qx < w and 0 <= qy < h and a[qy][qx] == colour and q not in seen:
                todo.append(q)
    return seen

def lines(a, diagonal=False):
    w, h = len(a[0]), len(a)
    result = set()
    for x, y in coords(a):
        for dx, dy in [(1,0),(0,1)] + ([(1,1),(1,-1)] if diagonal else []):
            run = []
            xx, yy = x, y
            while 0 <= xx < w and 0 <= yy < h and a[yy][xx] == a[y][x]:
                run.append((xx,yy)); xx += dx; yy += dy
            if len(run) >= 3:
                result.update(run)
    return result

def groups(a, minimum):
    seen = set(); result = set()
    for p in coords(a):
        if p not in seen:
            group = component(a,p); seen.update(group)
            if len(group) >= minimum: result.update(group)
    return result

def remove_and_fall(a, cleared, compress=False):
    a = [list(row) for row in a]
    w, h = len(a[0]), len(a)
    for x,y in cleared:a[y][x]='.'
    columns = []
    for x in range(w):
        values = [a[y][x] for y in range(h) if a[y][x] != '.']
        columns.append(['.']*(h-len(values))+values)
    if compress:
        columns = [c for c in columns if any(v!='.' for v in c)]
        columns += [['.']*h for _ in range(w-len(columns))]
    return [''.join(columns[x][y] for x in range(w)) for y in range(h)]

def pointset(value):return {tuple(p) for p in value}

for case in fixtures['cases']:
    kind = case['kernel']
    if kind in ('line-resolution','component-resolution'):
        a = case['board']; total = 0
        for i, wave in enumerate(case['expectedWaves'],1):
            found = lines(a,True) if kind=='line-resolution' else groups(a,4)
            assert found == pointset(wave['cleared']), case['id']
            points = len(found)*10*i*case['pieceLevel']
            assert points==wave['points'],case['id']
            total += points; a=remove_and_fall(a,found)
        assert a==case['expectedBoard'],case['id']
        assert not (lines(a,True) if kind=='line-resolution' else groups(a,4)),case['id']
        bonus=case.get('expectedAllClearBonus',0)
        if bonus:assert not coords(a) and bonus==500*case['pieceLevel']
        assert total+bonus==case['expectedScore'],case['id']
    elif kind=='line-match':
        found=lines(case['board'],True)
        assert found==pointset(case['expectedCleared']) and len(found)*10==case['expectedPoints'],case['id']
    elif kind=='cycle':
        a=case['piece']
        assert a[-1:]+a[:-1]==case['forward'] and a[1:]+a[:1]==case['backward']
    elif kind in ('group-remove-compress','component'):
        found=component(case['board'],case['select'])
        assert found==pointset(case['expectedGroup']),case['id']
        if kind=='component':assert (len(found)>=2)==case['expectedLegal']
        else:
            after=remove_and_fall(case['board'],found,True)
            assert after==case['expectedBoard'],case['id']
            points=5*len(found)*(len(found)-1)
            assert points==case['expectedPoints'],case['id']
            if 'expectedBonus' in case:assert not coords(after) and points+1000==case['expectedScore']
    elif kind=='pair-landing':
        settled=[[x,case['columnTops'][str(x)]-1] for x,y in case['rigidCells']]
        assert settled==case['expectedSettled'],case['id']
    elif kind=='rotation':
        px,py=case['pivot']; occupied=pointset(case['occupied']); answer=None
        for dx,dy in [(0,0),(-1,0),(1,0),(0,-1)]:
            pivot=(px+dx,py+dy);satellite=(pivot[0]-1,pivot[1])
            if all(0<=x<case['width'] and -3<=y<case['height'] and (x,y) not in occupied for x,y in [pivot,satellite]):
                answer=(pivot,satellite);break
        assert answer==(tuple(case['expectedPivot']),tuple(case['expectedSatellite'])),case['id']
    elif kind=='swap-before-refill':
        a=[list(row) for row in case['board']];px,py=case['source'];qx,qy=case['target']
        assert abs(px-qx)+abs(py-qy)==1
        a[py][px],a[qy][qx]=a[qy][qx],a[py][px]
        matched=lines(a)
        assert bool(matched)==case['expectedLegal'] and matched==pointset(case['expectedCleared']),case['id']
        assert len(matched)*10==case['expectedPoints'],case['id']
        if case.get('expectedBoardUnchanged'):
            a[py][px],a[qy][qx]=a[qy][qx],a[py][px]
            assert [''.join(row) for row in a]==case['board']
    elif kind=='combo-geometry':
        cx,cy=case['centre']; w,h=case['width'],case['height']
        matched={(x,y) for y in range(h) for x in range(w) if (x==cx or y==cy) if case['combo']=='beam+beam'} if case['combo']=='beam+beam' else {(x,y) for y in range(h) for x in range(w) if max(abs(x-cx),abs(y-cy))<=2}
        assert len(matched)==case['expectedUniqueCleared'] and len(matched)*10==case['expectedPoints'],case['id']
    elif kind=='random-vector':
        x=case['initialState']; states=[]
        for _ in case['expectedNextStates']:
            x^=(x<<13)&0xffffffff;x^=x>>17;x^=(x<<5)&0xffffffff;x&=0xffffffff;states.append(x)
        assert states==case['expectedNextStates'],case['id']
    else:raise AssertionError('Unknown kernel: '+kind)
    print('PASS',case['id'])
print(f"Verified {len(fixtures['cases'])} independent design examples.")
