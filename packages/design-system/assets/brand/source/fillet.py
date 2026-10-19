import math, numpy as np
from scipy.optimize import fsolve, minimize_scalar
from geo import *

def _ell_closest(cx,cy,rx,ry,P):
    ts=np.linspace(0,2*math.pi,721)
    d=(cx+rx*np.cos(ts)-P[0])**2+(cy+ry*np.sin(ts)-P[1])**2
    t0=ts[np.argmin(d)]
    res=minimize_scalar(lambda t:(cx+rx*math.cos(t)-P[0])**2+(cy+ry*math.sin(t)-P[1])**2,bounds=(t0-0.02,t0+0.02),method='bounded',options={'xatol':1e-12})
    t=res.x; return (cx+rx*math.cos(t), cy+ry*math.sin(t))
def closest(c,P):
    k=c[0]
    if k=='h': return (P[0],c[1])
    if k=='v': return (c[1],P[1])
    if k=='c':
        _,cx,cy,R=c; d=math.dist(P,(cx,cy)); return (cx+(P[0]-cx)*R/d, cy+(P[1]-cy)*R/d)
    if k=='e': return _ell_closest(*c[1:],P)
def dist(c,P): return math.dist(P,closest(c,P))
def inter(c1,c2,guess):
    # intersection point of two curves near guess: minimise dist to both
    f=lambda p:[ (dist(c1,p)), (dist(c2,p))]
    from scipy.optimize import minimize
    r=minimize(lambda p: dist(c1,p)**2+dist(c2,p)**2, guess, method='Nelder-Mead',options={'xatol':1e-9,'fatol':1e-14,'maxiter':20000})
    return tuple(r.x)
def fillet(shape,c1,c2,rf,Cguess,mode,m=60):
    C=fsolve(lambda p:[dist(c1,p)-rf, dist(c2,p)-rf], Cguess, xtol=1e-12)
    C=(float(C[0]),float(C[1]))
    t1=closest(c1,C); t2=closest(c2,C)
    corner=inter(c1,c2,((t1[0]+t2[0])/2*2-C[0]*1, (t1[1]+t2[1])/2*2-C[1]))
    u=lambda a,b: ((b[0]-a[0])/math.dist(a,b),(b[1]-a[1])/math.dist(a,b))
    n1=u(C,t1); n2=u(C,t2); nc=u(C,corner)
    P1=(t1[0]+m*0.02*n1[0],t1[1]+m*0.02*n1[1]); P2=(t2[0]+m*n2[0],t2[1]+m*n2[1])
    Pc=(corner[0]+m*nc[0],corner[1]+m*nc[1])
    P1=(t1[0]+m*n1[0],t1[1]+m*n1[1])
    patch=D(poly([C,P1,Pc,P2]),circle(*C,rf))
    return (U(shape,patch) if mode=='add' else D(shape,patch)), dict(C=C,t1=t1,t2=t2,corner=corner)
