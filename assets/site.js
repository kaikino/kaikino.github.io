/* shared chrome: top bar, status bar, pcb trace canvas */
(function () {
  const pages = [
    ['index.html', 'home'], ['projects.html', 'projects'],
    ['experience.html', 'experience'], ['lab.html', 'lab']
  ];
  const here = (location.pathname.split('/').pop() || 'index.html');
  const nav = pages.map(([h, l]) =>
    `<a href="/${h}" class="${h === here ? 'active' : ''}">${l}</a>`).join('');
  const top = document.createElement('header');
  top.className = 'top';
  top.innerHTML = `<div class="wrap">
    <a class="brand" href="/"><b>kai</b><span class="at">@</span>kinoshita<span class="full">:~</span><span class="cur"></span></a>
    <nav class="nav">${nav}</nav></div>`;
  document.body.prepend(top);

  const foot = document.createElement('footer');
  foot.className = 'status';
  foot.innerHTML = `<div class="wrap">
    <span class="mode">NORMAL</span>
    <span>kaikino.github.io</span>
    <span class="cu">rv64i · 40 MHz</span>
    <span class="spacer"></span>
    <span><a href="https://github.com/kaikino">github</a></span>
    <span><a href="mailto:kai.n.kinoshita@gmail.com">mail</a></span>
    <span>utf-8</span>
    <span>${new Date().getFullYear()}</span></div>`;
  document.body.append(foot);
})();

/* ---------- PCB autorouter background ---------- */
(function () {
  const c = document.getElementById('traces');
  if (!c) return;
  const ctx = c.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = 16;                       // routing grid
  const COLORS = ['#d9a066', '#d9a066', '#d9a066', '#7bd3b5', '#cf3a52', '#6ea8ff'];
  let W = 0, H = 0, traces = [], last = 0, target = 0;

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = c.clientWidth; H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    target = Math.max(10, Math.floor((W * H) / 24000));
  }
  const snap = v => Math.round(v / G) * G;
  const rnd = (a, b) => a + Math.random() * (b - a);

  function newTrace() {
    const side = Math.floor(Math.random() * 4);
    let x, y, dir;
    if (side === 0) { x = snap(rnd(0, W)); y = -G; dir = Math.PI / 2; }
    else if (side === 1) { x = W + G; y = snap(rnd(0, H)); dir = Math.PI; }
    else if (side === 2) { x = snap(rnd(0, W)); y = H + G; dir = -Math.PI / 2; }
    else { x = -G; y = snap(rnd(0, H)); dir = 0; }
    const pts = [{ x, y }];
    const segs = 5 + Math.floor(Math.random() * 9);
    let total = 0;
    for (let i = 0; i < segs; i++) {
      const L = G * (2 + Math.floor(Math.random() * 14));
      const nx = x + Math.round(Math.cos(dir)) * L, ny = y + Math.round(Math.sin(dir)) * L;
      if (nx < G || nx > W - G || ny < G || ny > H - G) break;
      total += Math.hypot(nx - x, ny - y);
      x = nx; y = ny; pts.push({ x, y });
      // 45° turns only, like a real autorouter
      dir += (Math.random() < 0.5 ? -1 : 1) * Math.PI / 4;
      if (Math.random() < 0.35) dir += (Math.random() < 0.5 ? -1 : 1) * Math.PI / 4;
    }
    if (pts.length < 2) return null;
    return {
      pts, total, prog: 0, speed: rnd(90, 220), alpha: 0, life: 0,
      hold: rnd(2.5, 6), col: COLORS[Math.floor(Math.random() * COLORS.length)],
      pad: Math.random() < 0.7 ? 'via' : 'pad', dead: false
    };
  }

  function pointAt(t, dist) {
    const p = t.pts; let d = dist;
    for (let i = 1; i < p.length; i++) {
      const L = Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
      if (d <= L) { const k = d / L; return { x: p[i - 1].x + (p[i].x - p[i - 1].x) * k, y: p[i - 1].y + (p[i].y - p[i - 1].y) * k, i }; }
      d -= L;
    }
    return { ...p[p.length - 1], i: p.length - 1 };
  }

  function drawTrace(t) {
    const head = pointAt(t, Math.min(t.prog, t.total));
    ctx.globalAlpha = t.alpha;
    ctx.strokeStyle = t.col; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(t.pts[0].x, t.pts[0].y);
    for (let i = 1; i < head.i; i++) ctx.lineTo(t.pts[i].x, t.pts[i].y);
    ctx.lineTo(head.x, head.y); ctx.stroke();
    // via at start
    ctx.fillStyle = '#070b16'; ctx.beginPath(); ctx.arc(t.pts[0].x, t.pts[0].y, 3.2, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(t.pts[0].x, t.pts[0].y, 3.2, 0, 7); ctx.stroke();
    if (t.prog >= t.total) {
      const e = t.pts[t.pts.length - 1];
      if (t.pad === 'via') { ctx.fillStyle = '#070b16'; ctx.beginPath(); ctx.arc(e.x, e.y, 3.2, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(e.x, e.y, 3.2, 0, 7); ctx.stroke(); }
      else { ctx.fillStyle = t.col; ctx.fillRect(e.x - 4, e.y - 4, 8, 8); }
    } else {
      ctx.globalAlpha = Math.min(1, t.alpha * 2);
      ctx.fillStyle = '#fff'; ctx.shadowColor = t.col; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(head.x, head.y, 2, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  function frame(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
    ctx.clearRect(0, 0, W, H);
    while (traces.length < target) { const t = newTrace(); if (t) traces.push(t); else break; }
    for (const t of traces) {
      t.life += dt;
      if (t.prog < t.total) { t.prog += t.speed * dt; t.alpha = Math.min(0.55, t.alpha + dt); }
      else { t.hold -= dt; if (t.hold < 0) t.alpha -= dt * 0.5; }
      if (t.alpha <= 0 && t.prog >= t.total) t.dead = true;
      drawTrace(t);
    }
    traces = traces.filter(t => !t.dead);
    if (!reduced) requestAnimationFrame(frame);
  }
  resize(); addEventListener('resize', () => { resize(); });
  if (reduced) {   // draw a static board
    for (let i = 0; i < target; i++) { const t = newTrace(); if (t) { t.prog = t.total; t.alpha = 0.4; traces.push(t); } }
    traces.forEach(drawTrace);
  } else requestAnimationFrame(frame);
})();

/* ---------- die floorplan (home) ---------- */
(function () {
  const svg = document.getElementById('die');
  const info = document.getElementById('floor-info');
  if (!svg || !info) return;
  const NS = 'http://www.w3.org/2000/svg';
  const blocks = [
    { id: 'rtl', x: 40, y: 40, w: 150, h: 120, name: 'RTL / ASIC', tag: 'hardware',
      text: 'SystemVerilog from the ground up: a 64-bit RISC-V core, a programmable protocol-emulator ASIC taped out through Tiny Tapeout on IHP 130 nm, cocotb lock-step verification, formal safety proofs with SymbiYosys, and timing sign-off.',
      links: [['core-asic', 'https://github.com/kaikino/core-asic'], ['KAISC-V', 'https://github.com/kaikino/KAISC-V'], ['sv-delay-inject', 'https://github.com/kaikino/sv-delay-inject']] },
    { id: 'kernel', x: 200, y: 40, w: 160, h: 70, name: 'KERNEL / SYSTEMS', tag: 'systems',
      text: 'An xv6-style kernel for RISC-V rewritten in Rust, a cycle-stepped NES emulator in C++, and a first-person 3D filesystem explorer built on Bevy. I like the layer where software meets the machine.',
      links: [['kv6', 'https://github.com/kaikino/kv6'], ['NES-emulator', 'https://github.com/kaikino/NES-emulator'], ['file-city', 'https://github.com/kaikino/file-city']] },
    { id: 'dist', x: 200, y: 120, w: 160, h: 40, name: 'DISTRIBUTED', tag: 'systems',
      text: 'A sharded key-value store on MultiPaxos, a small SQL engine, and production work on CockroachDB-backed microservices at Rakuten.',
      links: [['experience →', 'experience.html']] },
    { id: 'net', x: 40, y: 170, w: 110, h: 90, name: 'NETWORKS', tag: 'networks',
      text: 'A Cisco IOS → Extreme EXOS config transpiler, a typed ExtremeCloud IQ client on PyPI, a hand-rolled BGP speaker peering with FRR, and netlab: 23 hands-on Linux networking labs graded from live kernel state.',
      links: [['netlab', 'https://github.com/kaikino/netlab'], ['bgp-lab', 'https://github.com/kaikino/bgp-lab'], ['xiq-client', 'https://github.com/kaikino/xiq-client']] },
    { id: 'cloud', x: 160, y: 170, w: 110, h: 90, name: 'CLOUD', tag: 'cloud',
      text: 'AWS Certified Solutions Architect – Professional, plus Developer, Data Engineer and ML Engineer Associate. Built a serverless document pipeline (Lambda, Step Functions, Textract, DynamoDB) as an AWS intern.',
      links: [['experience →', 'experience.html']] },
    { id: 'web', x: 280, y: 170, w: 80, h: 90, name: 'WEB', tag: 'web',
      text: 'OneBusOnline: a live Puget Sound transit PWA on React + Leaflet with a Zod-validated Express BFF and a three-tier cache (SWR, Redis, IndexedDB).',
      links: [['onebus.online', 'https://onebus.online'], ['OneBusOnline', 'https://github.com/kaikino/OneBusOnline']] },
    { id: 'tools', x: 40, y: 270, w: 320, h: 50, name: 'TOOLS & RELEASES', tag: 'tools',
      text: 'kPen, a C++/SDL2 raster editor with 10 cross-platform releases and a Homebrew tap; Neovim + tmux dotfiles; small CLIs for the things I keep doing by hand.',
      links: [['kPen', 'https://github.com/kaikino/kPen'], ['dotfiles', 'https://github.com/kaikino/dotfiles']] },
  ];
  const el = (n, a, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
  // pad ring
  for (let i = 0; i < 26; i++) {
    const p = 14 + i * 14.3;
    el('rect', { class: 'pad', x: p, y: 6, width: 8, height: 14 });
    el('rect', { class: 'pad', x: p, y: 380, width: 8, height: 14 });
    el('rect', { class: 'pad', x: 6, y: p, width: 14, height: 8 });
    el('rect', { class: 'pad', x: 380, y: p, width: 14, height: 8 });
  }
  el('rect', { class: 'core', x: 32, y: 32, width: 336, height: 336, rx: 2 });
  // a few decorative wires
  for (let i = 0; i < 12; i++) {
    const y = 40 + i * 28, x1 = 32, x2 = 368;
    el('path', { class: 'wire', d: `M${x1} ${y + 6} h${18 + (i * 37) % 60} l8 8 h${40 + (i * 53) % 80}` });
    el('path', { class: 'wire', d: `M${x2} ${y + 14} h-${22 + (i * 41) % 70} l-8 -8 h-${30 + (i * 29) % 60}` });
  }
  const groups = {};
  for (const b of blocks) {
    const g = el('g', { 'data-id': b.id });
    const r = el('rect', { class: 'blk', x: b.x, y: b.y, width: b.w, height: b.h, rx: 2 }, g);
    const t = el('text', { x: b.x + 8, y: b.y + 16 }, g); t.textContent = b.name;
    // fake standard-cell rows
    for (let y = b.y + 26; y < b.y + b.h - 6; y += 7)
      el('rect', { x: b.x + 8, y, width: b.w - 16, height: 3, fill: '#1e2b4a' }, g);
    groups[b.id] = r;
    const show = () => {
      Object.values(groups).forEach(x => x.classList.remove('on')); r.classList.add('on');
      info.innerHTML = `<h3>${b.name}</h3><p>${b.text}</p><div class="links">${
        b.links.map(([n, h]) => `<a class="btn sm" href="${h}" ${h.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${n}</a>`).join('')
      }<a class="btn sm" href="projects.html?tag=${b.tag}">all ${b.tag} projects</a></div>`;
    };
    g.addEventListener('mouseenter', show); g.addEventListener('click', show); g.addEventListener('focus', show);
    g.setAttribute('tabindex', '0');
  }
  el('text', { x: 40, y: 345, style: 'font-size:8px;fill:#5c6888' }).textContent = 'KAI KINOSHITA · DIE REV A · 2026';
  groups.rtl.dispatchEvent(new Event('mouseenter'));
  groups.rtl.parentNode.dispatchEvent(new Event('mouseenter'));
})();
