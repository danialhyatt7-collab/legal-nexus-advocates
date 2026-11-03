"""Builds index.html and the logo SVGs from the redrawn logo parts.
Run from the repo root:  python3 src/build.py"""
import pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))
from logo_parts import FEATHER, FLOURISH, CENTER, nib_svg

GRAD = ('<linearGradient id="goldgrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a87f3c"/>'
        '<stop offset=".5" stop-color="#ecd29a"/><stop offset="1" stop-color="#c9a35b"/></linearGradient>')

def mark(uid):
    return (f'<defs>{GRAD}</defs><path fill="#fff" d="{FEATHER}"/>{nib_svg(uid)}'
            f'<path fill="url(#goldgrad)" d="{FLOURISH}"/>')

html = (ROOT / "src/index.template.html").read_text()
html = (html.replace("%%FEATHER%%", FEATHER).replace("%%FLOURISH%%", FLOURISH)
            .replace("%%CENTER%%", CENTER).replace("%%NIB_PRE%%", nib_svg("nibpre"))
            .replace("%%NIB_HERO%%", nib_svg("nibhero")))
assert "%%" not in html
(ROOT / "index.html").write_text(html)

A = ROOT / "assets"
(A / "logo-mark.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="410 310 320 290">{mark("m")}</svg>')
(A / "favicon.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="380 290 360 320">'
                               f'<rect x="380" y="290" width="360" height="320" rx="60" fill="#0b0b0c"/>{mark("f")}</svg>')
(A / "logo.svg").write_text(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="220 300 600 420"><rect x="220" y="300" width="600" height="420" fill="#000"/>'
    f'{mark("l")}<text x="521" y="655" text-anchor="middle" font-family="Cinzel, Trajan Pro, serif" font-weight="700" '
    f'font-size="62" letter-spacing="3" fill="#fff">LEGAL NEXUS</text><text x="521" y="700" text-anchor="middle" '
    f'font-family="Cinzel, Trajan Pro, serif" font-size="28" letter-spacing="14" fill="#C9A35B">ADVOCATES</text></svg>')
print("built index.html + assets")
