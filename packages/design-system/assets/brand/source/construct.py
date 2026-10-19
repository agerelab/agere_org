import math, json
from lockup import *
import cairosvg
OUT='/home/claude/agere-logo/construction'
GUIDE='#9AA3AF'; DIM='#E5484D'; INKC='#111111'; GHOST='#DCDFE5'; LABEL='#4B5563'
FONT='font-family="Helvetica Neue, Helvetica, Arial, sans-serif"'
el=[]
def add(s): el.append(s)
def txt(x,y,s,size=13,fill=LABEL,anchor='start',ls=1.2,weight=400):
    add(f'<text x="{x:.2f}" y="{y:.2f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" letter-spacing="{ls}" font-weight="{weight}" {FONT}>{s}</text>')
def line(x1,y1,x2,y2,stroke=GUIDE,w=1,dash=None):
    da=f' stroke-dasharray="{dash}"' if dash else ''
    add(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{stroke}" stroke-width="{w}"{da}/>')
def circ(cx,cy,r,stroke=GUIDE,w=1,dash=None,fill='none'):
    da=f' stroke-dasharray="{dash}"' if dash else ''
    add(f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"{da}/>')
def dot(x,y,r=2.5,fill=DIM): add(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r}" fill="{fill}"/>')
def rectc(x,y,w,h,stroke=GUIDE,dash=None,fill='none',sw=1):
    da=f' stroke-dasharray="{dash}"' if dash else ''
    add(f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{da}/>')
def shape(p,k,ox,oy,fill):
    add(f'<path fill="{fill}" d="{to_d(p,k,ox,oy)}"/>')
def dimh(x1,x2,y,label,col=DIM,above=True,tick=6):
    line(x1,y,x2,y,col,1); line(x1,y-tick,x1,y+tick,col,1); line(x2,y-tick,x2,y+tick,col,1)
    txt((x1+x2)/2, y-8 if above else y+18, label, 12, col, 'middle')
def dimv(x,y1,y2,label,col=DIM,right=True,tick=6):
    line(x,y1,x,y2,col,1); line(x-tick,y1,x+tick,y1,col,1); line(x-tick,y2,x+tick,y2,col,1)
    txt(x+10 if right else x-10,(y1+y2)/2+4,label,12,col,'start' if right else 'end')

W,H=1600,1500
add(f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>')
txt(60,58,'AGERE — LOGO CONSTRUCTION',15,INKC,ls=3,weight=600)
txt(W-60,58,'BASE UNIT 1X = NODE DIAMETER · φ = 1.618',12,LABEL,'end',ls=2)
line(60,76,W-60,76,'#E5E7EB')

# ---------------- Panel A: symbol ----------------
txt(60,118,'01  SYMBOL',12,INKC,ls=2.5,weight=600)
k=175/Dn
b=SYM.bounds
ox=150; oy=190
X=lambda x: ox+(x-b[0])*k
Y=lambda y: oy+(b[3]-y)*k
L,T,B,F1,F2=[INFO[n] for n in ('L','T','B','F1','F2')]
# 45deg axis
ext=1.25*Dn
line(X(L[0]-ext*0.7071),Y(L[1]-ext*0.7071),X(T[0]+ext*0.35),Y(T[1]+ext*0.35),GUIDE,1,'2 4')
# bounding box
rectc(X(b[0]),Y(b[3]),(b[2]-b[0])*k,(b[3]-b[1])*k,GUIDE,'1 3')
shape(SYM,k,ox-b[0]*k,oy+b[3]*k,GHOST)
for c in (L,T,B): circ(X(c[0]),Y(c[1]),Dn/2*k,INKC,1.2)
for c in (F1,F2): circ(X(c[0]),Y(c[1]),Dn/2*k,DIM,1,'4 3')
# triangle of centres
add(f'<polygon points="{X(L[0]):.2f},{Y(L[1]):.2f} {X(T[0]):.2f},{Y(T[1]):.2f} {X(B[0]):.2f},{Y(B[1]):.2f}" fill="none" stroke="{GUIDE}" stroke-width="1"/>')
for c in (L,T,B): dot(X(c[0]),Y(c[1]),3,INKC)
for c in (F1,F2): dot(X(c[0]),Y(c[1]),2.5,DIM)
# gap segments (edge to edge) along centre lines
def gapseg(P,Q,lab,off=(0,0),anchor='middle'):
    d=math.dist(P,Q); ux,uy=(Q[0]-P[0])/d,(Q[1]-P[1])/d
    a=(P[0]+ux*Dn/2,P[1]+uy*Dn/2); z=(Q[0]-ux*Dn/2,Q[1]-uy*Dn/2)
    line(X(a[0]),Y(a[1]),X(z[0]),Y(z[1]),DIM,3)
    mx,my=X((a[0]+z[0])/2),Y((a[1]+z[1])/2)
    txt(mx+off[0],my+off[1],lab,12,DIM,anchor)
gapseg(L,T,'gap 0.236X',(-14,-10),'end')
gapseg(L,B,'gap 0.618X',(0,22))
# T-B gap: show on the axis (inside bridge) with label outside to the right
gapseg(T,B,'gap 0.382X',(-14,4),'end')
# waist
h=math.dist(F1,F2); ux,uy=(F2[0]-F1[0])/h,(F2[1]-F1[1])/h
w1=(F1[0]+ux*Dn/2,F1[1]+uy*Dn/2); w2=(F2[0]-ux*Dn/2,F2[1]-uy*Dn/2)
line(X(w1[0]),Y(w1[1]),X(w2[0]),Y(w2[1]),INKC,1.4)
txt(X(F2[0])-6,Y(F2[1])+Dn/2*k+20,'negative nodes, r = 0.5X',12,DIM,'middle')

txt(X(w1[0])+10,Y(w1[1])-8,'waist 0.446X',12,INKC,'start')
txt(X(L[0]-ext*0.7071)+4,Y(L[1]-ext*0.7071)+16,'45°',12,LABEL)
# overall dims
dimh(X(b[0]),X(b[2]),Y(b[1])+40,'2.588X',LABEL,above=False)
dimv(X(b[2])+34,Y(b[3]),Y(b[1]),'2.183X',LABEL)
# unit scale
ux0=X(b[0]); uy0=Y(b[3])-34
dimh(ux0,ux0+Dn*k,uy0,'1X',INKC)
# legend
ly=Y(b[1])+100
for i,s in enumerate(['Three equal nodes, Ø 1X.',
    'Edge-to-edge gaps follow the golden sequence 0.236X : 0.382X : 0.618X',
    '(each = previous × φ, and 0.236 + 0.382 = 0.618).',
    'Centre distances: L–T 1.236X · T–B 1.382X · L–B 1.618X.',
    'L–T axis sits on the 45° diagonal. The T–B bridge is carved by two',
    'negative nodes identical to the positive ones (r = 0.5X).']):
    txt(60,ly+i*20,s,12.5,LABEL,ls=0.2)

# ---------------- Panel B: wordmark ----------------
bx=760
txt(bx,118,'02  WORDMARK',12,INKC,ls=2.5,weight=600)
k2=98/Dn
wb=WM.bounds
wox=bx+20; base=380
WX=lambda x: wox+x*k2
WY=lambda y: base-y*k2
# metric lines
right=WX(WMW)+20
for yv,lab,col in [(XH+OS,'overshoot +1.2%',GUIDE),(XH,'x-height 1.236X',DIM),(CY,'',GUIDE),(0,'baseline',DIM),(-OS,'',GUIDE),(-(DESC),'descender 0.472X',DIM)]:
    line(wox-14,WY(yv),right,WY(yv),col,1,None if col==DIM else '2 3')
    if lab: txt(right+8,WY(yv)+(-6 if 'overshoot' in lab else (14 if 'x-height' in lab else 4)),lab,12,col if col==DIM else LABEL)
shape(WM,k2,wox,base,GHOST)
# bowl circles & counters for a
circ(WX(R0),WY(CY),R0*k2,INKC,1)
add(f'<ellipse cx="{WX(R0):.2f}" cy="{WY(CY):.2f}" rx="{RX*k2:.2f}" ry="{RY*k2:.2f}" fill="none" stroke="{INKC}" stroke-width="1"/>')
# stem
aw=2*R0
dimh(WX(aw-S),WX(aw),WY(XH+OS)-16,'stem 0.330X',DIM)
# horizontal weight
dimv(WX(R0)+4,WY(XH+OS),WY(XH+OS-SH),'0.9 × stem',LABEL)
# e bar (first e)
ex=2*(2*R0+Dn/PHI**5)
dimv(WX(ex+R0*2)+12,WY(CY+BAR/2),WY(CY-BAR/2),'bar 0.204X',DIM)
circ(WX(ex+R0),WY(CY),R0*k2,INKC,1,'3 3')
# tracking
dimh(WX(aw),WX(aw+Dn/PHI**5),WY(-DESC)+34,'',DIM,tick=4)
txt(WX(aw)-4,WY(-DESC)+52,'letter gap 0.090X (1X/φ⁵)',12,DIM)
# r terminal circle
rx0=3*(2*R0+Dn/PHI**5)
lg=[ 'Monoline geometric construction: every bowl is a circle Ø x-height + overshoot,',
     'every terminal is a full circle (the same idea as the symbol’s nodes).',
     'x-height = 2X/φ = 1.236X (equals the L–T centre distance).',
     'Stem 0.330X (optical weight). Bar = stem/φ = 0.204X. Horizontals 0.9 × stem.',
     'Descender = x-height/φ². Corner radii: r shoulder and g hook = x-height/φ².']
for i,s in enumerate(lg): txt(bx,WY(-DESC)+100+i*20,s,12.5,LABEL,ls=0.2)

# ---------------- Panel C: lockup & clear space ----------------
cy0=880
line(60,cy0-40,W-60,cy0-40,'#E5E7EB')
txt(60,cy0,'03  PRIMARY LOCKUP · CLEAR SPACE',12,INKC,ls=2.5,weight=600)
s,wm=primary(); P=U(s,wm); pb=P.bounds
k3=120/Dn
cs=Dn  # clear space 1X
total_w=(pb[2]-pb[0]+2*cs)*k3
lox=(W-total_w)/2+cs*k3; loy=cy0+60+cs*k3
LX=lambda x: lox+(x-pb[0])*k3
LY=lambda y: loy+(pb[3]-y)*k3
# clear space rect
rectc(LX(pb[0]-cs),LY(pb[3]+cs),(pb[2]-pb[0]+2*cs)*k3,(pb[3]-pb[1]+2*cs)*k3,DIM,'5 4',sw=1)
rectc(LX(pb[0]),LY(pb[3]),(pb[2]-pb[0])*k3,(pb[3]-pb[1])*k3,GUIDE,'1 3')
# corner unit nodes
for (x,y) in [(pb[0]-cs/2,pb[3]+cs/2),(pb[2]+cs/2,pb[3]+cs/2),(pb[0]-cs/2,pb[1]-cs/2),(pb[2]+cs/2,pb[1]-cs/2)]:
    circ(LX(x),LY(y),cs/2*k3,DIM,1,None,fill='#FDECEC')
txt(LX(pb[0]-cs/2),LY(pb[3]+cs/2)+4,'1X',11,DIM,'middle')
# metric lines
for yv in (XH,0,CY):
    line(LX(pb[0])-10,LY(yv),LX(pb[2])+10,LY(yv),GUIDE,1,'2 3')
shape(P,k3,lox-pb[0]*k3,loy+pb[3]*k3,INKC)
sbx=SYM.bounds; sw=(sbx[2]-sbx[0])
dimh(LX(sw),LX(sw+Dn/PHI**2),LY(pb[3])-14,'0.382X',DIM)
txt(LX(pb[2])+14,LY(CY)+4,'symbol centred on x-height',11,LABEL)
dimh(LX(pb[0]),LX(pb[2]),LY(pb[1]-cs)+26,'9.11X  (symbol 2.588X · gap 0.382X · wordmark 6.139X)',LABEL,above=False)
dimv(LX(pb[0]-cs)-18,LY(pb[3]),LY(pb[1]),'2.197X',LABEL,right=False)

svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'+''.join(el)+'</svg>\n'
open(f'{OUT}/agere-construction.svg','w').write(svg)
cairosvg.svg2png(bytestring=svg.encode(),write_to=f'{OUT}/agere-construction.png',output_width=3200)
cairosvg.svg2png(bytestring=svg.encode(),write_to='/home/claude/work/cons_preview.png',output_width=1600)
