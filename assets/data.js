/* site data: projects + experience. Rendered statically by build.js and used by the browser scripts. */
window.PROJECTS = [
  { id: 'core-asic', name: 'Programmable Protocol Emulator ASIC', tags: ['hardware'], feat: true, year: '2026',
    repo: 'core-asic', stack: ['SystemVerilog', 'Python', 'cocotb', 'SymbiYosys', 'LibreLane'],
    blurb: 'A reprogrammable GPIO protocol emulator for Tiny Tapeout on IHP 130 nm, built for the Jane Street protocol-emulator challenge. Two deterministic PIO engines run 16-bit microprograms with cycle-exact timing, so UART, SPI, I²C, JTAG, CAN and 10 Mbit/s Manchester Ethernet are programs, not fixed blocks.',
    bullets: ['Closes timing at 40 MHz with positive setup slack and zero DRC / LVS / antenna violations.',
      'Verified in lock-step against a cycle-exact Python model across RTL, FPGA and gate-level netlists; 8 pin-arbitration safety properties proved by k-induction.',
      'Cut precheck DRC from 7.5 hours to 37 seconds to unblock CI.'] },
  { id: 'onebus', name: 'OneBusOnline', tags: ['web'], feat: true, year: '2025–26',
    repo: 'OneBusOnline', url: 'https://onebus.online', img: ['assets/img/onebus.webp', 'onebus.online showing live stops across Seattle', '', 1280, 708], stack: ['TypeScript', 'React', 'Leaflet', 'Express', 'Redis', 'Zod'],
    blurb: 'A live Puget Sound transit PWA. React + Leaflet client over an Express backend-for-frontend that exposes 9 Zod-validated endpoints and keeps the upstream API key server-side.',
    bullets: ['Three-tier cache: HTTP stale-while-revalidate, Redis, and client IndexedDB.',
      'Cache keys are bounding boxes quantized to integer ticks so client and server always agree.'] },
  { id: 'kaiscv', name: 'KAISC-V', tags: ['hardware'], feat: true, year: '2026',
    repo: 'KAISC-V', stack: ['SystemVerilog'],
    blurb: 'A simple 64-bit RISC-V CPU in SystemVerilog. The pipeline simulator on the lab page of this site is a toy cousin of it.',
    bullets: [] },
  { id: 'kv6', name: 'kv6', tags: ['systems'], feat: true, year: '2026',
    repo: 'kv6', stack: ['Rust', 'RISC-V'],
    blurb: 'An xv6-based teaching kernel for RISC-V, in Rust. Traps, paging, scheduling and syscalls without the C.',
    bullets: [] },
  { id: 'nes', name: 'NES Emulator', tags: ['systems'], feat: true, year: '2026',
    repo: 'NES-emulator', stack: ['C++17', 'SDL2'],
    blurb: 'A Nintendo Entertainment System emulator with SDL2 video and audio. Runs NROM (mapper 0) cartridges; the 6502 core passes the Klaus Dormann functional test suite.',
    bullets: [] },
  { id: 'filecity', name: 'File City', tags: ['systems', 'tools'], feat: true, year: '2026',
    repo: 'file-city', stack: ['Rust', 'Bevy', 'wgpu', 'Avian'],
    imgs: [['assets/img/filecity-neon-night.webp', 'Vertical neon filename and scrolling source on a night street', '', 1280, 720], ['assets/img/filecity-gallery-dusk.webp', 'Image files as glowing storefront posters at dusk', '', 1280, 720], ['assets/img/filecity-alley-night.webp', 'A back alley at night', '', 1280, 720], ['assets/img/filecity-aerial-day.webp', 'Daytime rooftops: packed blocks, antennas and district signs', '', 1280, 720]],
    blurb: 'A first-person 3D filesystem explorer. It scans a directory tree and generates a dense Tokyo-inspired city: directories become districts, files become buildings with neon signs bearing their real names, and everything can be read, viewed or thrown around in-engine.',
    bullets: ['Every building is seeded by its file\'s path hash; height scales with file size.',
      'Physically-based atmosphere with an 8-minute day/night cycle.'] },
  { id: 'kpen', name: 'kPen', tags: ['tools'], year: '2026',
    repo: 'kPen', img: ['assets/img/kpen.webp', 'kPen on macOS editing the app icon', '', 1200, 779], stack: ['C++17', 'SDL2', 'CMake', 'Homebrew'],
    blurb: 'A lightweight raster drawing app. 10 cross-platform releases for macOS, Windows and Linux, installable with brew install --cask kaikino/kpen/kpen.',
    bullets: [] },
  { id: 'netlab', name: 'netlab', tags: ['networks', 'tools'], year: '2026',
    repo: 'netlab', stack: ['Python', 'Docker', 'Linux netns'],
    blurb: '23 hands-on Linux networking labs inside one container. Hosts, routers and switches are network namespaces, cables are veth pairs, and lab check grades you by inspecting live kernel state.',
    bullets: ['Covers addressing, bridging, routing, sockets, packet capture, iptables/NAT and multi-fault troubleshooting.',
      'Values are randomised per run; a self-test builds every lab, confirms it fails, applies the solution and confirms it passes.'] },
  { id: 'exos', name: 'Cisco → EXOS Translator', tags: ['networks'], year: '2026',
    repo: 'cisco-exos-translator', stack: ['Python', 'pytest'],
    blurb: 'A Cisco IOS to Extreme EXOS config transpiler built as a scanner → parser → validator → generator pipeline, covering VLANs, link aggregation, ACL policies and SPAN mirrors. Built during my Extreme Networks internship.',
    bullets: ['125 tests plus validation on physical switch stacks; cut Layer 2 migration from hours to minutes per device.',
      'Documented in English and Japanese for partner engineers.'] },
  { id: 'xiq', name: 'xiq-client', tags: ['networks', 'tools'], year: '2026',
    repo: 'xiq-client', stack: ['Python', 'PyPI', 'GitHub Actions'],
    blurb: 'A typed ExtremeCloud IQ client with 130+ API operations, token auth, rate-limit-aware retries and pagination. Published to PyPI; 93 tests in CI on Python 3.9–3.13.',
    bullets: [] },
  { id: 'bgp', name: 'bgp-lab', tags: ['networks'], year: '2026',
    repo: 'bgp-lab', stack: ['Python', 'FRR', 'Docker'],
    blurb: 'A minimal BGP speaker in Python that peers with FRRouting in Docker: OPEN, KEEPALIVE, UPDATE by hand.',
    bullets: [] },
  { id: 'svdelay', name: 'sv-delay-inject', tags: ['hardware', 'tools'], year: '2026',
    repo: 'sv-delay-inject', stack: ['Python', 'SystemVerilog'],
    blurb: 'A script for injecting gate delays into SystemVerilog modules, for watching glitches and races in simulation.',
    bullets: [] },
  { id: 'svsnake', name: 'sv-snake', tags: ['hardware'], year: '2026',
    repo: 'sv-snake', img: ['assets/img/sv-snake-diagram.webp', 'sv-snake block diagram', 'contain', 1200, 812], stack: ['SystemVerilog', 'FPGA'],
    blurb: 'Snake & apples, entirely in hardware.',
    bullets: [] },
  { id: 'dance', name: 'Dance Trainer', tags: ['hardware', 'systems'], year: '2026 · WIP',
    repo: 'dance-trainer', stack: ['Firmware', 'Android', 'ML'],
    blurb: 'An ankle-worn sensor node, an Android app and a small ML classifier that score choreography presets. Work in progress.',
    bullets: [] },
  { id: 'paxos', name: 'MultiPaxos KV Store', tags: ['systems', 'coursework'], year: '2026',
    stack: ['Java'],
    blurb: 'A sharded key-value store built on MultiPaxos for UW Distributed Systems: leader election, log replication, reconfiguration and shard movement under a model checker. (private, coursework)',
    bullets: [] },
  { id: 'dbengine', name: 'Simple DB Engine', tags: ['systems', 'coursework'], year: '2026',
    stack: ['Java'],
    blurb: 'A small database management system with SQL-like operations, a buffer pool, and a query executor. (private, coursework)',
    bullets: [] },
  { id: 'aws-ide', name: 'Intelligent Document Explorer', tags: ['cloud'], year: '2025',
    stack: ['Python', 'AWS Lambda', 'Step Functions', 'Textract', 'DynamoDB', 'SAM'],
    blurb: 'A serverless document-ingestion pipeline built as an AWS intern: 9 Lambdas orchestrated by Step Functions with parallel branches, catch states and a Textract → Rekognition fallback so no upload is dropped. (private)',
    bullets: ['S3 → EventBridge → SQS for async Textract polling; Comprehend summaries; idempotent DynamoDB writes across 10 file formats.',
      'Multi-VPC isolation with private subnets and peering, least-privilege IAM, CloudWatch dashboards and alarms.'] },
];
window.renderProjectCard = function (p, level) {
  const H = 'h' + (level || 3);
  const href = p.url || (p.repo ? `https://github.com/kaikino/${p.repo}` : null);
  const title = href ? `<a href="${href}" target="_blank" rel="noopener">${p.name}</a>` : p.name;
  const links = [];
  if (p.repo) links.push(`<a href="https://github.com/kaikino/${p.repo}" target="_blank" rel="noopener" aria-label="${p.name} repository on GitHub">repo ↗</a>`);
  if (p.url) links.push(`<a href="${p.url}" target="_blank" rel="noopener" aria-label="${p.name} live site">live ↗</a>`);
  const shot = ([src, alt, fit, w, h]) => { const small = src.replace(/\.webp$/, '-640.webp');
    return `<a class="shot ${fit || ''}" href="${src}" data-alt="${alt}" aria-label="Enlarge: ${alt}"><img src="${small}" srcset="${small} 640w, ${src} ${w}w" sizes="(max-width: 700px) 90vw, 520px" width="${w}" height="${h}" alt="${alt}" loading="lazy"></a>`; };
  const media = p.imgs ? `<div class="shots">${p.imgs.map(shot).join('')}</div>` : p.img ? shot(p.img) : '';
  return `<article class="card ${p.feat ? 'feat' : ''}" data-tags="${p.tags.join(' ')}">
    <div class="tag">${p.tags.join(' · ')}</div><span class="corner">${p.year}</span>
    <${H}>${title}</${H}>${media}<p>${p.blurb}</p>
    ${p.bullets.length ? `<ul>${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    <div class="stack" style="margin-top:12px">${p.stack.map(s => `<span>${s}</span>`).join('')}</div>
    ${links.length ? `<div class="small mono" style="margin-top:12px;display:flex;gap:12px">${links.join('')}</div>` : ''}
  </article>`;
};

/* lightbox for screenshots */
if (typeof document !== 'undefined') document.addEventListener('click', e => {
  const a = e.target.closest('a.shot'); if (!a) return;
  e.preventDefault();
  let lb = document.getElementById('lightbox'), opener = a;
  if (!lb) {
    lb = document.createElement('div'); lb.id = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Screenshot');
    lb.innerHTML = '<img alt=""><div class="cap"></div><button type="button" class="close" aria-label="Close">esc ✕</button>'; document.body.appendChild(lb);
    const close = () => { lb.classList.remove('on'); if (lb._opener) lb._opener.focus(); };
    lb.addEventListener('click', close); document.addEventListener('keydown', k => { if (k.key === 'Escape' && lb.classList.contains('on')) close(); });
  }
  lb._opener = opener;
  const img = lb.querySelector('img'); img.src = a.getAttribute('href'); img.alt = a.dataset.alt || '';
  lb.querySelector('.cap').textContent = a.dataset.alt || ''; lb.classList.add('on'); lb.querySelector('button').focus();
});

window.XP = [
    { id: 'uw', sig: 'uw_ce', col: '#6ea8ff', from: '2024-09', to: '2028-06', org: 'University of Washington', role: 'B.S. Computer Engineering', where: 'Seattle, WA',
      when: 'expected June 2028', bullets: ['3.94 GPA, Dean\'s List every quarter.', 'Coursework: Distributed Systems, Operating Systems, Computer Architecture, Networks, Database Systems.'] },
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

window.renderXP = function (x) {
  return `<article class="xp" id="xp-${x.id}">
    <div class="when"><b>${x.when}</b>${x.where}</div>
    <div><h2>${x.org} <span>· ${x.role}</span></h2><ul>${x.bullets.map(b => `<li>${b}</li>`).join('')}</ul></div></article>`;
};
