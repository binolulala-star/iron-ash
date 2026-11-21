import os
import sys
from PIL import Image, ImageFilter
import numpy as np
from collections import deque
from scipy import ndimage
def cut(path,tol=26,tol2=14,minarea=300):
    im=Image.open(path).convert('RGB');a=np.asarray(im).astype(np.int32);H,W,_=a.shape
    bg=np.median(np.concatenate([a[:8,:8].reshape(-1,3),a[:8,-8:].reshape(-1,3),a[-8:,:8].reshape(-1,3),a[-8:,-8:].reshape(-1,3)]),axis=0)
    d=np.sqrt(((a-bg)**2).sum(2))
    lab,n=ndimage.label(d<tol)
    edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    mask=np.isin(lab,list(edge))
    lab2,n2=ndimage.label(d<tol2)
    sizes=ndimage.sum(np.ones_like(d),lab2,range(1,n2+1))
    big=[i+1 for i,s in enumerate(sizes) if s>=minarea]
    mask|=np.isin(lab2,big)
    alpha=Image.fromarray(np.where(mask,0,255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.8))
    rgba=im.convert('RGBA');rgba.putalpha(alpha);return rgba
def batch(char,files,h=560):
    out={k:cut(p) for k,p in files.items()}
    boxes=[im.getbbox() for im in out.values()]
    x0=min(b[0] for b in boxes);y0=min(b[1] for b in boxes);x1=max(b[2] for b in boxes);y1=max(b[3] for b in boxes)
    for k,im in out.items():
        c=im.crop((x0,y0,x1,y1));w=round(c.width*h/c.height);c=c.resize((w,h),Image.LANCZOS)
        c.save(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'portraits')+f'/{char}_{k}.webp','WEBP',quality=86,method=6)
