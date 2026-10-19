from agere import *
from fillet import fillet, closest
import math
RF_IN = S/PHI**4      # concave (counter) fillet radius  ~ .056 X
RF_OUT= S/PHI**3      # convex / notch fillet radius      ~ .090 X

def glyph_a():
    W=2*R0; outer,cnt=bowl(R0)
    fc=(W-S/2,-OS+S/2)
    stem=U(rect(W-S,-OS+S/2,W,CY), circle(*fc,S/2))
    body=D(U(outer,stem),cnt)
    body,_=fillet(body,('c',R0,CY,R0),('c',fc[0],fc[1],S/2),RF_IN,(W-S*0.8,-OS-RF_IN*0.3),'add')
    return body,W

def glyph_g():
    W=2*R0; outer,cnt=bowl(R0)
    yb=-(DESC+OS); Ro=XH/PHI**2; xt=W*0.30
    stem=rect(W-S,yb+Ro,W,CY)
    hook=U(corner(W-Ro,yb+Ro,Ro,'br'), rect(xt,yb,W-Ro,yb+SH), circle(xt,yb+SH/2,SH/2))
    body=D(U(outer,stem,hook),cnt)
    body,info=fillet(body,('c',R0,CY,R0),('v',W-S),RF_IN,(W-S-RF_IN*1.05,-OS+RF_IN*0.2),'add')
    return body,W

def glyph_e(theta_deg=-48):
    W=2*R0; cx=R0; outer,cnt=bowl(cx)
    ring=D(outer,cnt)
    ytop,ybot=CY+BAR/2,CY-BAR/2
    bar=I(rect(cx-RX-5,ybot,W,ytop), outer)
    th=math.radians(theta_deg)
    rho,rc=e_cap(th)
    C=(cx+rho*math.cos(th), CY+rho*math.sin(th))
    t_out=(cx+(C[0]-cx)*R0/rho, CY+(C[1]-CY)*R0/rho)
    t_in=closest(('e',cx,CY,RX,RY),C)
    dx,dy=t_out[0]-t_in[0],t_out[1]-t_in[1]; L=math.hypot(dx,dy); dx,dy=dx/L,dy/L
    nx,ny=-dy,dx     # left normal (counter-clockwise side = toward bar)
    big=4*W
    half=poly([(t_in[0]-dx*big,t_in[1]-dy*big),(t_in[0]+dx*big,t_in[1]+dy*big),
               (t_in[0]+dx*big+nx*big,t_in[1]+dy*big+ny*big),(t_in[0]-dx*big+nx*big,t_in[1]-dy*big+ny*big)])
    cut=I(half,rect(cx,-big,cx+big,ybot))
    body=U(D(ring,cut),bar,circle(*C,rc))
    E=('e',cx,CY,RX,RY)
    body,_=fillet(body,('h',ytop),E,RF_IN,(cx-RX+RF_IN*1.6,ytop+RF_IN*1.1),'add')
    body,_=fillet(body,('h',ytop),E,RF_IN,(cx+RX-RF_IN*1.6,ytop+RF_IN*1.1),'add')
    body,_=fillet(body,('h',ybot),E,RF_IN,(cx-RX+RF_IN*1.6,ybot-RF_IN*1.1),'add')
    body,_=fillet(body,('h',ybot),('c',cx,CY,R0),RF_OUT,(cx+R0-RF_OUT*1.2,ybot+RF_OUT),'remove')
    return body,W

def glyph_r():
    Wr=XH/PHI+OS; Ro=XH/PHI**2; top=XH+OS; xt=Wr-SH/2
    stem=U(rect(0,-OS+S/2,S,top-Ro), circle(S/2,-OS+S/2,S/2))
    sh=U(corner(Ro,top-Ro,Ro,'tl'), rect(Ro,top-SH,xt,top), circle(xt,top-SH/2,SH/2))
    return U(stem,sh),Wr

GAP_L=Dn/PHI**5
def wordmark(track=GAP_L, re_k=0.3):
    a,wa=glyph_a(); g,wg=glyph_g(); e,we=glyph_e(); rr,wr=glyph_r()
    seq=[(a,wa,track),(g,wg,track),(e,we,track),(rr,wr,track*re_k),(e,we,0)]
    x=0; parts=[]
    for gl,w,adj in seq:
        parts.append(gl.transform(1,0,0,1,x,0)); x+=w+adj
    return U(*parts), x
