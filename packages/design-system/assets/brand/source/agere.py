import math
from geo import *

# ---------- base unit ----------
Dn=1000.0                 # node diameter = 1 X (internal units; SVG output scales 1/10 -> X = 100)
r=Dn/2
# golden gaps between nodes (edge to edge): 1/phi^3, 1/phi^2, 1/phi  (note .236+.382=.618)
gLT, gTB, gLB = Dn/PHI**3, Dn/PHI**2, Dn/PHI
dLT, dTB, dLB = Dn+gLT, Dn+gTB, Dn+gLB   # centre distances 1.236, 1.382, 1.618

def symbol(alpha_deg):
    """alpha = angle of L->B axis below horizontal. y-up coords, L at origin."""
    a=math.radians(alpha_deg)
    L=(0.0,0.0)
    B=(dLB*math.cos(a), -dLB*math.sin(a))
    # angle at L between LB and LT
    angL=math.acos((dLT**2+dLB**2-dTB**2)/(2*dLT*dLB))
    T=(dLT*math.cos(angL-a), dLT*math.sin(angL-a))
    # bridge T-B: fillet circles radius f = r (negative nodes), centres at distance r+f from T and B
    f=r
    mx,my=(T[0]+B[0])/2,(T[1]+B[1])/2
    ux,uy=(B[0]-T[0])/dTB,(B[1]-T[1])/dTB
    h=math.sqrt((r+f)**2-(dTB/2)**2)
    F1=(mx-uy*h, my+ux*h); F2=(mx+uy*h, my-ux*h)
    quad=poly([T,F1,B,F2])
    bridge=D(quad,circle(*F1,f),circle(*F2,f))
    shape=U(circle(*L,r),circle(*T,r),circle(*B,r),bridge)
    info=dict(L=L,T=T,B=B,F1=F1,F2=F2,waist=2*(h-f),angL=math.degrees(angL))
    return shape,info

# ---------- wordmark ----------
XH=2*Dn/PHI            # x-height 1.236 X  (= L–T centre distance)
S=330.0                # vertical stem weight 0.330X (A2, optically set between X/phi^2.5 steps)
SH=0.9*S               # horizontal weight (optical thinning of horizontals)
BAR=S/PHI              # e crossbar = stem/phi = 0.204X
OS=0.012*XH            # overshoot for round forms
DESC=XH/PHI**2         # descender
R0=XH/2+OS             # bowl outer radius
CY=XH/2
RX,RY=R0-S,R0-SH       # counter ellipse

def bowl(cx):
    return circle(cx,CY,R0), ellipse(cx,CY,RX,RY)

def glyph_a():
    W=2*R0; outer,cnt=bowl(R0)
    stem=U(rect(W-S,-OS+S/2,W,CY), circle(W-S/2,-OS+S/2,S/2))
    return D(U(outer,stem),cnt), W

def corner(cx,cy,Ro,quad):
    """quarter ring: outer circle Ro, inner ellipse (Ro-S, Ro-SH); quad: 'br' bottom-right, 'tl' top-left"""
    ring=D(circle(cx,cy,Ro),ellipse(cx,cy,Ro-S,Ro-SH))
    big=4*Ro
    q={'br':rect(cx,cy-big,cx+big,cy),'tl':rect(cx-big,cy,cx,cy+big)}[quad]
    return I(ring,q)

def glyph_g():
    W=2*R0; outer,cnt=bowl(R0)
    yb=-(DESC+OS)                 # outer bottom of hook
    Ro=S*PHI                      # hook outer corner radius .618 X
    xt=W*0.30                     # terminal centre
    stem=rect(W-S,yb+Ro,W,CY)
    hook=U(corner(W-Ro,yb+Ro,Ro,'br'), rect(xt,yb,W-Ro,yb+SH), circle(xt,yb+SH/2,SH/2))
    return D(U(outer,stem,hook),cnt), W

def e_cap(theta):
    """disk inscribed in e ring (tangent to outer circle & counter ellipse) centred on ray theta"""
    import numpy as np
    from scipy.optimize import brentq, minimize_scalar
    def dist_ell(px,py):
        # min distance from point to ellipse (centre origin)
        res=minimize_scalar(lambda t: (RX*math.cos(t)-px)**2+(RY*math.sin(t)-py)**2, bounds=(theta-1.2,theta+1.2), method='bounded',options={'xatol':1e-10})
        return math.sqrt(res.fun)
    def fn(rho):
        px,py=rho*math.cos(theta),rho*math.sin(theta)
        return (R0-rho) - dist_ell(px,py)
    rho=brentq(fn, RX*0.9+1, R0-1)
    return rho, R0-rho

def glyph_e(theta_deg=-48):
    W=2*R0; cx=R0; outer,cnt=bowl(cx)
    ring=D(outer,cnt)
    bar=I(rect(cx-RX-5,CY-BAR/2,W,CY+BAR/2), outer)
    th=math.radians(theta_deg)
    rho,rc=e_cap(th)
    ccx,ccy=cx+rho*math.cos(th), CY+rho*math.sin(th)
    # cut: remove ring beyond the chord through the cap centre, perpendicular-ish (radial line through cap centre)
    big=3*W
    ybar=CY-BAR/2
    # region between radial ray at theta and the bar underside, on the right
    far=(cx+big*math.cos(th), CY+big*math.sin(th))
    p0=(cx+(CY-ybar)/math.tan(-th), ybar)
    cut=poly([p0,far,(cx+big,far[1]),(cx+big,ybar)])
    body=U(D(ring,cut),bar,circle(ccx,ccy,rc))
    return body, W, dict(cap=(ccx,ccy,rc),ybar=ybar)

def glyph_r():
    Wr=XH/PHI+OS
    Ro=XH/PHI**2          # shoulder outer radius
    top=XH+OS
    xt=Wr-SH/2
    stem=U(rect(0,-OS+S/2,S,top-Ro), circle(S/2,-OS+S/2,S/2))
    sh=U(corner(Ro,top-Ro,Ro,'tl'), rect(Ro,top-SH,xt,top), circle(xt,top-SH/2,SH/2))
    return U(stem,sh), Wr
