#!/usr/bin/env python3
"""Pixel probe for visual-regression: scan columns for color runs.

Usage: pixel_probe.py IMAGE [--col X] [--rows Y0 Y1 STEP] [--mode gold|s2|s1|all]
Prints y-ranges where the column matches the requested color classes.
"""
import sys
from PIL import Image


def classify(px):
    r, g, b = px[0], px[1], px[2]
    if r > 180 and g > 140 and b < 140:
        return "gold"
    if 14 <= r <= 20 and 14 <= g <= 20 and 28 <= b <= 36:
        return "s2"
    if 7 <= r <= 13 and 7 <= g <= 13 and 18 <= b <= 28:
        return "s1"
    if r <= 6 and g <= 6 and b <= 12:
        return "bg"
    if r > 150 and g < 110 and b < 80:
        return "orange"
    return "other"


def runs(im, x, y0, y1, step, modes):
    out = []
    cur = None
    start = None
    for y in range(y0, y1, step):
        c = classify(im.getpixel((min(x, im.width - 1), min(y, im.height - 1))))
        want = c in modes
        if want and cur is None:
            cur, start = c, y
        elif (not want or c != cur) and cur is not None:
            out.append((cur, start, y - step))
            cur = start = None
            if want:
                cur, start = c, y
    if cur is not None:
        out.append((cur, start, y1 - step))
    return out


def main():
    path = sys.argv[1]
    im = Image.open(path).convert("RGB")
    args = sys.argv[2:]
    x = im.width // 2
    y0, y1, step = 0, im.height, 5
    modes = {"gold", "orange", "s2", "s1"}
    i = 0
    while i < len(args):
        if args[i] == "--col":
            x = int(args[i + 1]); i += 2
        elif args[i] == "--rows":
            y0, y1, step = int(args[i + 1]), int(args[i + 2]), int(args[i + 3]); i += 4
        elif args[i] == "--mode":
            modes = set(args[i + 1].split(",")); i += 2
        else:
            i += 1
    print(f"{path}  {im.width}x{im.height}  column x={x}  modes={sorted(modes)}")
    for kind, a, b in runs(im, x, y0, y1, step, modes):
        print(f"  {kind:6} y{a}..{b}")


if __name__ == "__main__":
    main()
