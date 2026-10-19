import os, math, json
from lockup import *
from fontTools.pens.statisticsPen import StatisticsPen
import cairosvg
from PIL import Image

OUT='/home/claude/agere-logo'
for d in ('svg','png','favicon','construction'): os.makedirs(f'{OUT}/{d}',exist_ok=True)
SC=0.1                     # 1 X (node diameter) = 100 SVG units
INK='#111111'; PAPER='#FFFFFF'

def cen(p):
    sp=StatisticsPen(); p.draw(sp); return sp.meanX, sp.meanY

def fit(parts):
    """parts: list of (id, path) in internal y-up units. returns (list of (id,d)), w, h  with origin at top-left of bbox"""
    allp=U(*[p for _,p in parts]); x0,y0,x1,y1=allp.bounds
    out=[(i,to_d(p,SC,-x0*SC,y1*SC)) for i,p in parts]
    return out, round((x1-x0)*SC,2), round((y1-y0)*SC,2)

def svg_file(name, parts, mode='black', pad=0, title='agere'):
    ds,w,h=fit(parts)
    W,H=round(w+2*pad,2),round(h+2*pad,2)
    fill={'black':INK,'white':PAPER,'reversed':PAPER,'mono':'currentColor'}[mode]
    bg=f'<rect width="{W}" height="{H}" fill="{INK}"/>' if mode=='reversed' else ''
    tr=f' transform="translate({pad} {pad})"' if pad else ''
    paths=''.join(f'<path id="{i}"{tr} fill="{fill}" d="{d}"/>' for i,d in ds)
    s=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{title}">'
       f'<title>{title}</title>{bg}{paths}</svg>\n')
    open(f'{OUT}/svg/{name}.svg','w').write(s); return s

# ---------- compose lockups ----------
s_p,w_p=primary()                                  # horizontal
sb=SYM.bounds; sym_w=sb[2]-sb[0]; sym_h=sb[3]-sb[1]

def stacked(sym=SYM, wm=WM, wmw=WMW):
    k=PHI                                           # symbol scaled up one golden step
    sy=sym.transform(k,0,0,k,0,0); b=sy.bounds
    cx,_=cen(sy)
    gap=Dn/PHI*1.0                                  # 0.618 X from symbol bottom to x-height line
    wm_cx=wmw/2
    sy=sy.transform(1,0,0,1,wm_cx-cx, XH+gap-b[1])
    return sy, wm

s_s,w_s=stacked()
swm,swmw=small_wordmark(); ssym,sinfo=small_symbol()
s_ps,w_ps=primary(ssym,swm)

variants={
 'agere-primary':[('symbol',s_p),('wordmark',w_p)],
 'agere-stacked':[('symbol',s_s),('wordmark',w_s)],
 'agere-symbol':[('symbol',SYM)],
 'agere-wordmark':[('wordmark',WM)],
}
PAD_REV=Dn*SC   # reversed files carry 1 X clear space on the dark field
for name,parts in variants.items():
    svg_file(name,parts,'black')
    svg_file(name+'-white',parts,'white')
    svg_file(name+'-mono',parts,'mono')
    svg_file(name+'-reversed',parts,'reversed',pad=PAD_REV)
svg_file('agere-primary-small',[('symbol',s_ps),('wordmark',w_ps)],'black')
svg_file('agere-primary-small-white',[('symbol',s_ps),('wordmark',w_ps)],'white')
svg_file('agere-symbol-small',[('symbol',ssym)],'black')

# ---------- favicon / app icon ----------
def square_icon(sym, side_ratio, tile=None, fg=INK, bg=None, adaptive=False, name=None, grid=None):
    b=sym.bounds; w=(b[2]-b[0]); h=(b[3]-b[1])
    side=w*side_ratio
    cx,cy=cen(sym)
    # optical centring: average of bbox centre and mass centre
    ox=((b[0]+b[2])/2+cx)/2; oy=((b[1]+b[3])/2+cy)/2
    p=sym.transform(1,0,0,1,side/2-ox,side/2-oy)
    scale=(grid or side*SC)/side
    d=to_d(p,scale,0,side*scale)
    S_=float(fmt(side*scale,3))
    S_=int(S_) if S_==int(S_) else S_
    parts=''
    if tile=='round':
        r=S_*0.2237
        parts+=f'<rect width="{S_}" height="{S_}" rx="{round(r,3)}" fill="{bg}"/>'
    elif tile=='square' and bg:
        parts+=f'<rect width="{S_}" height="{S_}" fill="{bg}"/>'
    style=''
    if adaptive:
        style='<style>path{fill:#111}@media (prefers-color-scheme:dark){path{fill:#fff}}</style>'
        parts+=f'<path d="{d}"/>'
    else:
        parts+=f'<path fill="{fg}" d="{d}"/>'
    s=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S_} {S_}" width="{S_}" height="{S_}" role="img" aria-label="agere">'
       f'<title>agere</title>{style}{parts}</svg>\n')
    if name: open(name,'w').write(s)
    return s

fav=square_icon(ssym,1.08,adaptive=True,name=f'{OUT}/favicon/favicon.svg',grid=16)
fav_light=square_icon(ssym,1.08,fg=INK,grid=16)
fav_dark_tile=square_icon(ssym,1.30,tile='round',bg=INK,fg=PAPER,grid=32)
# app icon: symbol width = tile / phi
app_light=square_icon(SYM,PHI,tile='round',bg=PAPER,fg=INK,name=f'{OUT}/svg/agere-app-icon.svg',grid=1024)
app_dark=square_icon(SYM,PHI,tile='round',bg=INK,fg=PAPER,name=f'{OUT}/svg/agere-app-icon-dark.svg',grid=1024)

def png(svgstr,fn,w=None,h=None,bg=None):
    cairosvg.svg2png(bytestring=svgstr.encode(),write_to=fn,output_width=w,output_height=h,background_color=bg)
for n in (16,24,32,48,64,128,256,512):
    png(fav_light,f'{OUT}/favicon/favicon-{n}.png',w=n,h=n)
png(app_light,f'{OUT}/favicon/apple-touch-icon.png',w=180,h=180)
ims=[Image.open(f'{OUT}/favicon/favicon-{n}.png').convert('RGBA') for n in (16,32,48)]
ims[2].save(f'{OUT}/favicon/favicon.ico',sizes=[(16,16),(32,32),(48,48)],append_images=ims[:2])

# ---------- PNG exports ----------
for name in ('agere-primary','agere-stacked','agere-symbol','agere-wordmark'):
    s=open(f'{OUT}/svg/{name}.svg').read()
    png(s,f'{OUT}/png/{name}-2048.png',w=2048)
    s=open(f'{OUT}/svg/{name}-reversed.svg').read()
    png(s,f'{OUT}/png/{name}-reversed-2048.png',w=2048)
png(app_light,f'{OUT}/png/agere-app-icon-1024.png',w=1024)
png(app_dark,f'{OUT}/png/agere-app-icon-dark-1024.png',w=1024)

json.dump(dict(sym_bounds=sb, sym_w=sym_w/Dn, sym_h=sym_h/Dn, info={k:v for k,v in INFO.items()},
  prim=U(s_p,w_p).bounds, stack=U(s_s,w_s).bounds, wmw=WMW, XH=XH, S=S, SH=SH, BAR=BAR, DESC=DESC, OS=OS, R0=R0,
  small_L=sinfo['L']), open('dims.json','w'), indent=1, default=float)
print('done')
