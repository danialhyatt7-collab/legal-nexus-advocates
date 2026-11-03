# Legal Nexus Advocates: website

A static, animated landing site for Legal Nexus Advocates (Islamabad & Rawalpindi).
Plain HTML, CSS and JavaScript: no build tools or framework needed to host it.

## Files
- `index.html`: the page (generated, see below)
- `styles.css`: all styling and animations
- `script.js`: interactions (preloader, scroll reveals, counters, cursor, magnetic buttons, hero particles, WhatsApp form)
- `assets/`: the logo with its background removed. `mark-pen.webp` and `mark-ink.webp` are the two animated layers; `logo-full.png` is the full logo; `mark-160.png` is used in the header and footer; `favicon.png` is the tab icon. The earlier vector redraw (`logo.svg`, `logo-mark.svg`) is kept as a backup.
- `src/`: the HTML template, the logo vector parts and the build script

## Before going live, edit these
1. **Phone & WhatsApp number**: top of `script.js` (`CONTACT`). This updates every call/WhatsApp button.
2. **Email**: search `info@legalnexusadvocates.com` in `src/index.template.html`.
3. **Courts list** in the Twin Cities section: confirm it matches where the firm actually appears.
4. Check the copy against your Bar Council's advertising rules.

## Editing the page
Edit `src/index.template.html`, then rebuild (this inlines the logo paths):

```bash
python3 src/build.py
```

## Previewing
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.
