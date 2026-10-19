import math, pathops
from pathops import Path, op, PathOp, LineCap, LineJoin
PHI=(1+5**.5)/2
K=4*(2**.5-1)/3  # cubic circle constant

def ellipse(cx,cy,rx,ry):
    p=Path(); pen=p.getPen()
    # 4 cubic quadrants, y-up, counter-clockwise start at right
    pts=[(cx+rx,cy),(cx,cy+ry),(cx-rx,cy),(cx,cy-ry)]
    pen.moveTo(pts[0])
    for i in range(4):
        a=pts[i]; b=pts[(i+1)%4]
        ang0=i*math.pi/2; ang1=ang0+math.pi/2
        c1=(a[0]-K*rx*math.sin(ang0), a[1]+K*ry*math.cos(ang0))
        c2=(b[0]+K*rx*math.sin(ang1), b[1]-K*ry*math.cos(ang1))
        pen.curveTo(c1,c2,b)
    pen.closePath(); return p
def circle(cx,cy,r): return ellipse(cx,cy,r,r)
def poly(pts):
    p=Path(); pen=p.getPen(); pen.moveTo(pts[0])
    for q in pts[1:]: pen.lineTo(q)
    pen.closePath(); return p
def rect(x0,y0,x1,y1): return poly([(x0,y0),(x1,y0),(x1,y1),(x0,y1)])
def U(*ps):
    r=ps[0]
    for q in ps[1:]: r=op(r,q,PathOp.UNION)
    return r
def D(a,*bs):
    for b in bs: a=op(a,b,PathOp.DIFFERENCE)
    return a
def I(a,b): return op(a,b,PathOp.INTERSECTION)
def move(p,dx,dy,sx=1,sy=1):
    return p.transform(sx,0,0,sy,dx,dy)
def bounds(p): return p.bounds


def fmt(v,nd=2):
    s=f"{v:.{nd}f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0','') else s
def to_d(p, scale=1.0, dx=0, dy=0, flip=True, nd=2):
    q=p.transform(scale,0,0,-scale if flip else scale,dx,dy)
    out=[]
    P=lambda pt: fmt(pt[0],nd)+' '+fmt(pt[1],nd)
    for verb,pts in q.segments:
        if verb=='moveTo': out.append('M'+P(pts[0]))
        elif verb=='lineTo': out.append('L'+P(pts[0]))
        elif verb=='curveTo': out.append('C'+' '.join(P(x) for x in pts))
        elif verb=='qCurveTo': out.append('Q'+' '.join(P(x) for x in pts))
        elif verb=='closePath': out.append('Z')
        elif verb=='endPath': pass
        else: raise Exception(verb)
    return ''.join(out).replace(' -','-')
