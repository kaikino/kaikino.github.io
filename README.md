# kaikino.github.io

Personal site — static HTML/CSS/JS, no framework. Served by GitHub Pages from `main`.

- `index.html` — hero with an animated PCB autorouter canvas, about, interactive die floorplan, selected work
- `projects.html` — filterable catalogue
- `experience.html` — internships drawn as a digital timing diagram (`assets/timeline.js`)
- `lab.html` — a 5-stage RISC-V pipeline simulator (`assets/riscv.js`)

## Editing

Content lives in `assets/data.js` (projects and experience). The shared header, footer, meta
tags, project cards and experience entries are rendered **statically** into the pages by
`build.js`, so the site works without JavaScript and doesn't shift layout when scripts load.

```sh
node build.js                 # after editing assets/data.js or any page
python3 -m http.server 8000   # then open http://localhost:8000
```

Images go in `assets/img/` as WebP with a `-640` variant (`cwebp -q 80 in.jpg -o out.webp`).
The social preview image is rendered from `tools/og.html` with headless Chrome into `assets/og.png`.
