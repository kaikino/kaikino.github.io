/* experience as a digital timing diagram */
(function () {
  const XP = [
    { id: 'uw', sig: 'uw_ce', col: '#6ea8ff', from: '2024-09', to: '2028-06', org: 'University of Washington', role: 'B.S. Computer Engineering · expected June 2028', where: 'Seattle, WA',
      when: 'Jun 2028 (expected)', bullets: ['3.94 GPA, Dean\'s List every quarter.', 'Coursework: Distributed Systems, Operating Systems, Computer Architecture, Networks, Database Systems.'] },
    { id: 'aws', sig: 'aws', col: '#f2c14e', from: '2025-06', to: '2025-09', org: 'Amazon Web Services', role: 'Cloud Support Intern', where: 'Seattle, WA', when: 'Jun 2025 – Sep 2025',
      bullets: ['Built a serverless document-ingestion pipeline of 9 Python Lambda functions orchestrated by Step Functions with parallel branches, catch states, and a Textract-to-Rekognition fallback so no upload is dropped; deployed as infrastructure-as-code via AWS SAM.',
        'Routed S3 EventBridge triggers through SQS for asynchronous Textract polling, summarized long documents with Comprehend, and persisted text and metadata idempotently in DynamoDB across 10 file formats.',
        'Isolated the data tier behind a multi-VPC design with private subnets and peering, enforced least-privilege IAM roles, and monitored the pipeline with CloudWatch dashboards and alarms.'] },
    { id: 'ext', sig: 'extreme', col: '#7bd3b5', from: '2026-06', to: '2026-08', org: 'Extreme Networks', role: 'Systems Engineering Intern', where: 'Remote', when: 'Jun 2026 – Aug 2026',
      bullets: ['Built a Cisco IOS → Extreme EXOS config transpiler as a scanner, parser, validator and generator pipeline covering VLANs, link aggregation, ACL policies and SPAN mirrors. 125 tests plus validation on physical switch stacks cut Layer 2 migration from hours to minutes per device; documented in English and Japanese for partner engineers.',
        'Published xiq-client to PyPI: a typed ExtremeCloud IQ client with 130+ API operations, token auth, rate-limit-aware retries and pagination. 93 tests in CI on Python 3.9–3.13, replacing ~200 lines each across 20+ production scripts.'] },
    { id: 'rak', sig: 'rakuten', col: '#cf3a52', from: '2026-08', to: null, org: 'Rakuten Group, Inc.', role: 'Software Engineer Intern', where: 'Tokyo, Japan', when: 'Aug 2026 – present',
      bullets: ['Designed asynchronous REST APIs with FastAPI, Pydantic and SQLAlchemy; used SQL reflection to expose schema metadata dynamically and reduce bulk CRUD workflows from minutes to seconds.',
        'Modeled a distributed CockroachDB backend with SQLModel and automated schema migrations with Alembic for microservices on Kubernetes.',
        'Refactored the data-access layer onto functional dependency injection with AsyncSession and rebuilt the async test suite on pytest and httpx.AsyncClient, clearing context-management bottlenecks.'] },
  ];
  const host = document.getElementById('timing'), tip = document.getElementById('tip'), list = document.getElementById('xp');
  if (!host) return;

  // ---- entries list
  list.innerHTML = XP.slice().reverse().map(x => `<div class="xp" id="xp-${x.id}">
    <div class="when"><b>${x.when}</b>${x.where}</div>
    <div><h3>${x.org} <span>· ${x.role}</span></h3><ul>${x.bullets.map(b => `<li>${b}</li>`).join('')}</ul></div></div>`).join('');

  // ---- diagram
  const NS = 'http://www.w3.org/2000/svg';
  const now = new Date();
  const T0 = 2025 + 0 / 12, T1 = 2027 + 0 / 12;            // window: Jan 2025 – Jan 2027
  const toT = s => { if (!s) return now.getFullYear() + now.getMonth() / 12; const [y, m] = s.split('-').map(Number); return y + (m - 1) / 12; };
  const L = 120, R = 48, W = 960, rowH = 44, top = 34;
  const H = top + rowH * (XP.length + 1) + 24;
  const X = t => L + (Math.min(Math.max(t, T0), T1) - T0) / (T1 - T0) * (W - L - R);
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const el = (n, a, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
  const txt = (x, y, s, cls, extra) => { const t = el('text', Object.assign({ x, y, class: cls || '' }, extra || {})); t.textContent = s; return t; };

  // grid: years solid, quarters dashed
  for (let t = T0; t <= T1 + 1e-9; t += 0.25) {
    const x = X(t), isY = Math.abs(t - Math.round(t)) < 1e-9;
    el('line', { x1: x, y1: top - 8, x2: x, y2: H - 20, class: isY ? 'grid' : 'gridq' });
    if (isY) txt(x + 4, top - 12, String(Math.round(t)), 'lbl');
    else txt(x + 3, top - 12, 'Q' + (Math.round((t % 1) * 4) + 1), '', { style: 'font-size:9px;fill:#5c6888' });
  }
  // clk row: one pulse per quarter
  let y = top + rowH * 0.5; txt(8, y + 4, 'clk', 'lbl');
  let d = ''; const hi = y - 10, lo = y + 10;
  for (let t = T0; t < T1 - 1e-9; t += 0.25) { const a = X(t), b = X(t + 0.125), c = X(t + 0.25); d += `${t === T0 ? 'M' : 'L'}${a} ${lo} L${a} ${hi} L${b} ${hi} L${b} ${lo} L${c} ${lo} `; }
  el('path', { d, class: 'clk' });

  XP.forEach((x, i) => {
    y = top + rowH * (i + 1.5);
    const g = el('g', { class: 'row', 'data-id': x.id, style: `color:${x.col}` });
    txt(8, y + 4, x.sig, 'lbl', { fill: x.col }).setAttribute('style', `fill:${x.col}`);
    const a = X(toT(x.from)), b = X(toT(x.to)), hi = y - 12, lo = y + 12, s = 5;
    const startClip = toT(x.from) < T0, endClip = (x.to === null) || toT(x.to) > T1;
    const pathHi = `${startClip ? `M${a} ${hi}` : `M${X(T0)} ${lo} L${a - s} ${lo} L${a + s} ${hi}`} L${endClip ? b : b - s} ${hi} ${endClip ? '' : `L${b + s} ${lo} L${X(T1)} ${lo}`}`;
    el('rect', { x: a, y: hi, width: Math.max(0, b - a), height: lo - hi, fill: x.col, class: 'sigfill' }, g);
    el('rect', { x: a, y: hi - 6, width: Math.max(2, b - a), height: lo - hi + 12, class: 'hit' }, g);
    const p = el('path', { d: pathHi, class: 'sigline', stroke: x.col }, g);
    // draw-in animation
    const len = 2000; p.setAttribute('stroke-dasharray', len); p.setAttribute('stroke-dashoffset', len);
    p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 1400, delay: 150 * i, fill: 'forwards', easing: 'ease-out' });
    txt(a + 6, hi - 6, `${x.org}`, '', { style: `font-size:10px;fill:${x.col};opacity:.9` });
    const on = () => { tip.innerHTML = `<b>${x.org}</b> — ${x.role} · ${x.when} · ${x.where}`; document.querySelectorAll('.xp').forEach(e => e.classList.toggle('on', e.id === 'xp-' + x.id)); g.classList.add('on'); };
    const off = () => { g.classList.remove('on'); };
    g.addEventListener('mouseenter', on); g.addEventListener('mouseleave', off);
    g.addEventListener('click', () => { on(); document.getElementById('xp-' + x.id).scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  });
  // now marker
  const nx = X(toT(null));
  el('line', { x1: nx, y1: top - 8, x2: nx, y2: H - 20, class: 'now' });
  txt(nx + 4, H - 8, 'now', '', { style: 'fill:#cf3a52;font-size:10px' });
  host.appendChild(svg);
})();
