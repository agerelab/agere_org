from lockup import *
import cairosvg
OUT='/home/claude/agere-logo'
FONT='font-family="Helvetica Neue, Helvetica, Arial, sans-serif"'
el=[]
add=el.append
def txt(x,y,s,size=12,fill='#6B7280',anchor='start'):
    add(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" letter-spacing="2" {FONT}>{s}</text>')
def place(p,x,y,w=None,h=None,fill='#111111',align='c'):
    """fit path into box (x,y,w,h), centred"""
    b=p.bounds; bw,bh=b[2]-b[0],b[3]-b[1]
    k=min(w/bw if w else 1e9, h/bh if h else 1e9)
    ox=x+(w-bw*k)/2 if w else x; oy=y+(h-bh*k)/2 if h else y
    add(f'<path fill="{fill}" d="{to_d(p,k,ox-b[0]*k,oy+b[3]*k)}"/>')
s,w=primary(); PRI=U(s,w)
from final import s_s,w_s,s_ps,w_ps,ssym
STK=U(s_s,w_s); SMALL=U(s_ps,w_ps)
W,H=1800,920
add(f'<rect width="{W}" height="{H}" fill="#FAFAFA"/>')
# panels
def panel(x,y,w,h,title,fill='#FFFFFF'):
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}"/>')
    if title: txt(x+32,y+44,title,12)
panel(0,0,1100,520,'PRIMARY LOGO'); place(PRI,90,150,920,260)
panel(1101,0,349,520,'ICON MARK'); place(SYM,1161,170,229,229)
panel(1451,0,349,520,'APP ICON')
add(f'<rect x="1505" y="150" width="240" height="240" rx="53.7" fill="#FFFFFF" stroke="#E5E7EB"/>'); place(SYM,1505+240*(1-1/PHI)/2,150,240/PHI,240)
panel(0,521,700,399,'LOGO VARIATIONS')
place(PRI,40,650,260,110); place(STK,340,630,150,150); place(SYM,540,650,110,110)
for x,l in [(170,'HORIZONTAL'),(415,'STACKED'),(595,'SYMBOL')]: txt(x,850,l,11,anchor='middle')
panel(701,521,650,399,'MONOCHROME')
for i,(bg,fg,l) in enumerate([('#FFFFFF','#111111','ON LIGHT'),('#111111','#FFFFFF','ON DARK'),('#E7E5E1','#111111','ON NEUTRAL')]):
    x=733+i*204
    add(f'<rect x="{x}" y="640" width="190" height="150" fill="{bg}" stroke="#E5E7EB"/>'); place(PRI,x+22,690,146,50,fg); txt(x+95,850,l,11,anchor='middle')
panel(1352,521,448,399,'SIZE SYSTEM (WEB)')
xs=1390
for hpx,lab,p in [(34,'48',PRI),(24,'32',PRI),(17,'24',PRI),(12,'16',SMALL)]:
    b=p.bounds; wpx=hpx*(b[2]-b[0])/(b[3]-b[1])
    place(p,xs,715-hpx/2,wpx,hpx)
    txt(xs+wpx/2,780,lab+' px',10,anchor='middle')
    xs+=wpx+14
txt(1384,850,'LOCKUP HEIGHT · SMALL CUT AT 16–23 PX',11)
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'+''.join(el)+'</svg>\n'
open(f'{OUT}/agere-brand-sheet.svg','w').write(svg)
cairosvg.svg2png(bytestring=svg.encode(),write_to=f'{OUT}/agere-brand-sheet.png',output_width=3600)
cairosvg.svg2png(bytestring=svg.encode(),write_to='sheet_prev.png',output_width=1800)
