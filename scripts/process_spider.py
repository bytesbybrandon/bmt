import sys
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(sys.argv[1])
DST = Path(sys.argv[2])

img = Image.open(SRC).convert("RGB")
a = np.asarray(img).astype(np.float32)

lum = a.max(axis=2)
coverage = np.clip((lum - 5.0) / 55.0, 0.0, 1.0) ** 0.85
safe = np.maximum(coverage, 1e-3)[..., None]
rgb = np.clip(a / safe, 0, 255)

out = np.dstack([rgb, coverage * 255.0]).astype(np.uint8)

alpha = out[..., 3]
ys, xs = np.where(alpha > 10)
pad = 18
y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, out.shape[0])
x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, out.shape[1])
out = out[y0:y1, x0:x1]

h, w = out.shape[:2]
side = max(h, w)
canvas = np.zeros((side, side, 4), dtype=np.uint8)
oy, ox = (side - h) // 2, (side - w) // 2
canvas[oy : oy + h, ox : ox + w] = out

Image.fromarray(canvas, "RGBA").save(DST)
print(f"SAVED {DST} {side}x{side}")
