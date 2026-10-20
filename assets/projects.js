/* project catalogue — rendered on index (featured) and projects.html (all) */
window.PROJECTS = [
  { id: 'core-asic', name: 'Programmable Protocol Emulator ASIC', tags: ['hardware'], feat: true, year: '2026',
    repo: 'core-asic', stack: ['SystemVerilog', 'Python', 'cocotb', 'SymbiYosys', 'LibreLane'],
    blurb: 'A reprogrammable GPIO protocol emulator for Tiny Tapeout on IHP 130 nm, built for the Jane Street protocol-emulator challenge. Two deterministic PIO engines run 16-bit microprograms with cycle-exact timing, so UART, SPI, I²C, JTAG, CAN and 10 Mbit/s Manchester Ethernet are programs, not fixed blocks.',
    bullets: ['Closes timing at 40 MHz with positive setup slack and zero DRC / LVS / antenna violations.',
      'Verified in lock-step against a cycle-exact Python model across RTL, FPGA and gate-level netlists; 8 pin-arbitration safety properties proved by k-induction.',
      'Cut precheck DRC from 7.5 hours to 37 seconds to unblock CI.'] },
  { id: 'onebus', name: 'OneBusOnline', tags: ['web'], feat: true, year: '2025–26',
    repo: 'OneBusOnline', url: 'https://onebus.online', img: ['assets/img/onebus.jpg', 'onebus.online showing live stops across Seattle'], stack: ['TypeScript', 'React', 'Leaflet', 'Express', 'Redis', 'Zod'],
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
    imgs: [['assets/img/filecity-neon-night.jpg', 'Vertical neon filename and scrolling source on a night street'], ['assets/img/filecity-gallery-dusk.jpg', 'Image files as glowing storefront posters at dusk'], ['assets/img/filecity-alley-night.jpg', 'A back alley at night'], ['assets/img/filecity-aerial-day.jpg', 'Daytime rooftops: packed blocks, antennas and district signs']],
    blurb: 'A first-person 3D filesystem explorer. It scans a directory tree and generates a dense Tokyo-inspired city: directories become districts, files become buildings with neon signs bearing their real names, and everything can be read, viewed or thrown around in-engine.',
    bullets: ['Every building is seeded by its file\'s path hash; height scales with file size.',
      'Physically-based atmosphere with an 8-minute day/night cycle.'] },
  { id: 'kpen', name: 'kPen', tags: ['tools'], year: '2026',
    repo: 'kPen', img: ['assets/img/kpen.jpg', 'kPen on macOS editing the app icon'], stack: ['C++17', 'SDL2', 'CMake', 'Homebrew'],
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
    repo: 'sv-snake', img: ['assets/img/sv-snake-diagram.jpg', 'sv-snake block diagram', 'contain'], stack: ['SystemVerilog', 'FPGA'],
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
window.renderProjectCard = function (p) {
  const href = p.url || (p.repo ? `https://github.com/kaikino/${p.repo}` : null);
  const title = href ? `<a href="${href}" target="_blank" rel="noopener">${p.name}</a>` : p.name;
  const links = [];
  if (p.repo) links.push(`<a href="https://github.com/kaikino/${p.repo}" target="_blank" rel="noopener">repo ↗</a>`);
  if (p.url) links.push(`<a href="${p.url}" target="_blank" rel="noopener">live ↗</a>`);
  const shot = ([src, alt, fit]) => `<a class="shot ${fit || ''}" href="${src}" data-alt="${alt}"><img src="${src}" alt="${alt}" loading="lazy"></a>`;
  const media = p.imgs ? `<div class="shots">${p.imgs.map(shot).join('')}</div>` : p.img ? shot(p.img) : '';
  return `<article class="card ${p.feat ? 'feat' : ''}" data-tags="${p.tags.join(' ')}">
    <div class="tag">${p.tags.join(' · ')}</div><span class="corner">${p.year}</span>
    <h3>${title}</h3>${media}<p>${p.blurb}</p>
    ${p.bullets.length ? `<ul>${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    <div class="stack" style="margin-top:12px">${p.stack.map(s => `<span>${s}</span>`).join('')}</div>
    ${links.length ? `<div class="small mono" style="margin-top:12px;display:flex;gap:12px">${links.join('')}</div>` : ''}
  </article>`;
};

/* lightbox for screenshots */
document.addEventListener('click', e => {
  const a = e.target.closest('a.shot'); if (!a) return;
  e.preventDefault();
  let lb = document.getElementById('lightbox');
  if (!lb) { lb = document.createElement('div'); lb.id = 'lightbox'; lb.innerHTML = '<img alt=""><div class="cap"></div>'; document.body.appendChild(lb);
    lb.addEventListener('click', () => lb.classList.remove('on')); document.addEventListener('keydown', k => { if (k.key === 'Escape') lb.classList.remove('on'); }); }
  lb.querySelector('img').src = a.getAttribute('href'); lb.querySelector('.cap').textContent = a.dataset.alt || ''; lb.classList.add('on');
});
