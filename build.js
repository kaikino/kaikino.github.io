#!/usr/bin/env node
/* Renders shared chrome + data-driven sections into the HTML pages, in place, between marker comments.
   Run `node build.js` after editing assets/data.js or any page. Idempotent. */
const fs = require('fs');
const SITE = 'https://kaikino.github.io';
const FONTS = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap';
const w = {}; new Function('window', fs.readFileSync('assets/data.js', 'utf8'))(w);
const { PROJECTS, XP, renderProjectCard, renderXP } = w;

const PAGES = {
  'index.html': { title: 'Kai Kinoshita', nav: 'home', path: '/', desc: 'Kai Kinoshita — Computer Engineering at the University of Washington. Taped-out ASICs, a RISC-V core, a Rust kernel, networking tools, and a transit app.' },
  'projects.html': { title: 'Projects · Kai Kinoshita', nav: 'projects', path: '/projects.html', desc: 'Projects by Kai Kinoshita: a protocol-emulator ASIC, a RISC-V CPU, a Rust kernel, an NES emulator, networking tools, and OneBusOnline.' },
  'experience.html': { title: 'Experience · Kai Kinoshita', nav: 'experience', path: '/experience.html', desc: 'Internships and education of Kai Kinoshita: Rakuten, Extreme Networks, Amazon Web Services, University of Washington.' },
  'lab.html': { title: 'Lab · Kai Kinoshita', nav: 'lab', path: '/lab.html', desc: 'An interactive 5-stage RISC-V pipeline simulator: write RV32I assembly, step it, and watch stalls, forwarding and flushes.' },
  '404.html': { title: 'Not found · Kai Kinoshita', nav: '', path: null, desc: 'Page not found.', noindex: true },
};
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
function head(p) {
  const url = p.path ? SITE + p.path : SITE + '/404.html';
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${esc(p.desc)}">
${p.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#070b16">
<meta property="og:type" content="website"><meta property="og:site_name" content="Kai Kinoshita">
<meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/assets/og.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Kai Kinoshita — I build things from the gates up">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.desc)}"><meta name="twitter:image" content="${SITE}/assets/og.png">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
<link rel="stylesheet" href="/assets/style.css">
<script>document.documentElement.classList.remove('no-js')</script>`;
}
function nav(p) {
  const links = [['index.html', 'home'], ['projects.html', 'projects'], ['experience.html', 'experience'], ['lab.html', 'lab']]
    .map(([h, l]) => `<a href="/${h}"${l === p.nav ? ' class="active" aria-current="page"' : ''}>${l}</a>`).join('');
  return `<a class="skip" href="#main">skip to content</a>
<header class="top"><div class="wrap">
  <a class="brand" href="/" aria-label="kai@kinoshita, home"><b>kai</b><span class="at">@</span>kinoshita<span class="full">:~</span><span class="cur" aria-hidden="true"></span></a>
  <nav class="nav" aria-label="Main">${links}</nav>
</div></header>`;
}
const footer = () => `<footer class="status"><div class="wrap">
  <span class="mode" aria-hidden="true">NORMAL</span>
  <span>kaikino.github.io</span>
  <span class="cu">rv64i · 40 MHz</span>
  <span class="spacer"></span>
  <span><a href="https://github.com/kaikino">github</a></span>
  <span><a href="mailto:kai.n.kinoshita@gmail.com">mail</a></span>
  <span>utf-8</span>
  <span>${new Date().getFullYear()}</span>
</div></footer>`;

const fill = (html, name, body) => {
  const re = new RegExp(`<!-- ${name} -->[\\s\\S]*?<!-- /${name} -->`);
  if (!re.test(html)) return html;
  return html.replace(re, `<!-- ${name} -->\n${body}\n<!-- /${name} -->`);
};
for (const [file, p] of Object.entries(PAGES)) {
  let h = fs.readFileSync(file, 'utf8');
  h = fill(h, 'head', head(p));
  h = fill(h, 'nav', nav(p));
  h = fill(h, 'footer', footer());
  h = fill(h, 'featured', PROJECTS.filter(x => x.feat).map(x => renderProjectCard(x, 3)).join('\n'));
  h = fill(h, 'grid', PROJECTS.map(x => renderProjectCard(x, 2)).join('\n'));
  h = fill(h, 'xp', XP.slice().reverse().map(renderXP).join('\n'));
  fs.writeFileSync(file, h);
  console.log('built', file);
}
// sitemap
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.values(PAGES).filter(p => p.path).map(p => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('sitemap.xml, robots.txt');
