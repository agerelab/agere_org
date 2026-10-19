from glyphs2 import *
from fontTools.pens.statisticsPen import StatisticsPen
ALPHA=56.01215641852108-45.0
def make_symbol(alpha=ALPHA): return symbol(alpha)
SYM,INFO=make_symbol()
WM,WMW=wordmark()
def primary(sym=SYM, wm=WM, gap=Dn/PHI**2):
    b=sym.bounds
    ty=CY-(b[1]+b[3])/2
    s=sym.transform(1,0,0,1,-b[0],ty)
    w=wm.transform(1,0,0,1,(b[2]-b[0])+gap,0)
    return s,w

import agere as _A, glyphs2 as _G
BASE=dict(S=_A.S, SH=_A.SH, BAR=_A.BAR)
def set_weight(S, SH=None, BAR=None):
    SH = SH if SH is not None else 0.9*S
    BAR = BAR if BAR is not None else S/PHI
    for m in (_A,_G):
        m.S=S; m.SH=SH; m.BAR=BAR; m.RX=m.R0-S; m.RY=m.R0-SH
        m.RF_IN=BASE['S']/PHI**4; m.RF_OUT=BASE['S']/PHI**3
def small_wordmark():
    set_weight(BASE['S']*0.9, BAR=BASE['BAR']*0.8)
    g=_G.glyph_e
    import functools
    _G.glyph_e=functools.partial(g, theta_deg=-54)
    wm,w=_G.wordmark(track=Dn/PHI**4, re_k=0.45)
    _G.glyph_e=g
    set_weight(BASE['S'],BASE['SH'],BASE['BAR'])
    return wm,w

def small_symbol():
    """small-size optical variant: L node pushed out so the L–T gap steps up one golden power (0.236 -> 0.382 X)."""
    sym,info=symbol(ALPHA)
    L,T,B=info['L'],info['T'],info['B']
    # move L along direction away from centroid of T,B, keeping node sizes; solve |L'T| = D + D/phi^2
    mx,my=(T[0]+B[0])/2,(T[1]+B[1])/2
    ux,uy=L[0]-mx,L[1]-my; n=math.hypot(ux,uy); ux,uy=ux/n,uy/n
    import numpy as np
    from scipy.optimize import brentq
    target=Dn+Dn/PHI**2
    t=brentq(lambda t: math.hypot(L[0]+ux*t-T[0],L[1]+uy*t-T[1])-target,0,Dn)
    L2=(L[0]+ux*t,L[1]+uy*t)
    rest=D(sym,circle(*L,Dn/2))
    return U(rest,circle(*L2,Dn/2)), dict(info,L=L2)
