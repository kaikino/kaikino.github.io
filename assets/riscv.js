/* tiny RV32I subset + 5-stage pipeline visualiser */
(function () {
  const ABI = ['zero', 'ra', 'sp', 'gp', 'tp', 't0', 't1', 't2', 's0', 's1', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7',
    's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 't3', 't4', 't5', 't6'];
  const REG = {}; ABI.forEach((n, i) => { REG[n] = i; REG['x' + i] = i; }); REG.fp = 8;
  const MEMW = 64;

  const PRESETS = {
    sum: `# sum 1..10 into a0
    li   a0, 0          # acc
    li   t0, 1          # i
    li   t1, 10         # n
loop:
    add  a0, a0, t0
    addi t0, t0, 1
    bge  t1, t0, loop   # resolved in EX -> 1 squashed fetch
    ecall               # halt`,
    fib: `# fib(0..9) -> mem[0..36]
    li   t0, 0          # a
    li   t1, 1          # b
    li   t2, 0          # ptr
    li   t3, 40         # end
loop:
    sw   t0, 0(t2)
    add  t4, t0, t1
    mv   t0, t1
    mv   t1, t4
    addi t2, t2, 4
    bne  t2, t3, loop
    lw   a0, -4(t2)     # load ...
    addi a0, a0, 0      # ... use: 1-cycle stall
    ecall`,
    hazard: `# hazards: forwarding vs load-use
    li   t0, 7
    addi t1, t0, 1      # RAW on t0 -> forwarded from EX/MEM
    add  t2, t1, t0     # forwarded again
    sw   t2, 0(x0)
    lw   t3, 0(x0)      # load ...
    addi t4, t3, 1      # ... use: must stall one cycle
    xor  t5, t4, t4
    ecall`,
    gcd: `# gcd(1071, 462) by subtraction -> a0
    li   a0, 1071
    li   a1, 462
loop:
    beq  a0, a1, done
    blt  a0, a1, less
    sub  a0, a0, a1
    j    loop
less:
    sub  a1, a1, a0
    j    loop
done:
    ecall`,
  };

  // ---------- assembler ----------
  const R = { add: '+', sub: '-', and: '&', or: '|', xor: '^', sll: '<<', srl: '>>>', sra: '>>', slt: 'lt', sltu: 'ltu' };
  const I = { addi: '+', andi: '&', ori: '|', xori: '^', slli: '<<', srli: '>>>', srai: '>>', slti: 'lt', sltiu: 'ltu' };
  const B = { beq: (a, b) => a === b, bne: (a, b) => a !== b, blt: (a, b) => a < b, bge: (a, b) => a >= b, bltu: (a, b) => (a >>> 0) < (b >>> 0), bgeu: (a, b) => (a >>> 0) >= (b >>> 0) };
  function reg(s, ln) { s = s.trim().toLowerCase(); if (!(s in REG)) throw `line ${ln}: unknown register '${s}'`; return REG[s]; }
  function imm(s, ln) { s = s.trim(); const v = /^-?0x[0-9a-f]+$/i.test(s) ? parseInt(s, 16) : parseInt(s, 10); if (Number.isNaN(v)) throw `line ${ln}: bad immediate '${s}'`; return v | 0; }
  function assemble(src) {
    const lines = src.split('\n'), prog = [], labels = {}, fix = [];
    lines.forEach((raw, i) => {
      let s = raw.replace(/(#|\/\/).*$/, '').trim(); if (!s) return;
      const lm = s.match(/^([A-Za-z_.][\w.]*)\s*:\s*(.*)$/); if (lm) { labels[lm[1]] = prog.length; s = lm[2].trim(); if (!s) return; }
      const m = s.match(/^(\S+)\s*(.*)$/); const op = m[1].toLowerCase(); const args = m[2] ? m[2].split(',').map(a => a.trim()) : [];
      const ln = i + 1, ins = { op, text: s.replace(/\s+/g, ' '), ln, rd: 0, rs1: 0, rs2: 0, imm: 0, cls: 'alu' };
      const need = n => { if (args.length !== n) throw `line ${ln}: ${op} expects ${n} operands`; };
      if (op in R) { need(3); ins.rd = reg(args[0], ln); ins.rs1 = reg(args[1], ln); ins.rs2 = reg(args[2], ln); ins.fn = R[op]; }
      else if (op in I) { need(3); ins.rd = reg(args[0], ln); ins.rs1 = reg(args[1], ln); ins.imm = imm(args[2], ln); ins.fn = I[op]; ins.useImm = true; }
      else if (op === 'li') { need(2); ins.op = 'addi'; ins.rd = reg(args[0], ln); ins.imm = imm(args[1], ln); ins.fn = '+'; ins.useImm = true; }
      else if (op === 'mv') { need(2); ins.op = 'addi'; ins.rd = reg(args[0], ln); ins.rs1 = reg(args[1], ln); ins.fn = '+'; ins.useImm = true; }
      else if (op === 'nop') { need(0); ins.op = 'addi'; ins.fn = '+'; ins.useImm = true; }
      else if (op === 'lui' || op === 'auipc') { need(2); ins.rd = reg(args[0], ln); ins.imm = imm(args[1], ln); ins.cls = op; }
      else if (op === 'lw' || op === 'sw') {
        need(2); const mm = args[1].match(/^(-?\w+)?\s*\(\s*(\w+)\s*\)$/); if (!mm) throw `line ${ln}: expected imm(reg)`;
        ins.imm = mm[1] ? imm(mm[1], ln) : 0; ins.rs1 = reg(mm[2], ln); ins.cls = op;
        if (op === 'lw') ins.rd = reg(args[0], ln); else ins.rs2 = reg(args[0], ln);
      }
      else if (op in B) { need(3); ins.rs1 = reg(args[0], ln); ins.rs2 = reg(args[1], ln); ins.cls = 'br'; ins.cmp = B[op]; fix.push([ins, args[2]]); }
      else if (op === 'jal') { if (args.length === 1) args.unshift('ra'); need(2); ins.rd = reg(args[0], ln); ins.cls = 'jal'; fix.push([ins, args[1]]); }
      else if (op === 'j') { need(1); ins.op = 'jal'; ins.cls = 'jal'; fix.push([ins, args[0]]); }
      else if (op === 'jalr') { if (args.length === 1) { args.unshift('ra'); args.push('0'); } if (args.length === 2) args.push('0'); need(3); ins.rd = reg(args[0], ln); ins.rs1 = reg(args[1], ln); ins.imm = imm(args[2], ln); ins.cls = 'jalr'; }
      else if (op === 'ret') { need(0); ins.op = 'jalr'; ins.rs1 = 1; ins.cls = 'jalr'; }
      else if (op === 'ecall' || op === 'ebreak') { need(0); ins.cls = 'halt'; }
      else throw `line ${ln}: unknown instruction '${op}'`;
      ins.pc = prog.length * 4; prog.push(ins);
    });
    for (const [ins, lab] of fix) {
      if (lab in labels) ins.target = labels[lab] * 4;
      else if (/^-?\d+$/.test(lab)) ins.target = ins.pc + parseInt(lab, 10);
      else throw `line ${ins.ln}: unknown label '${lab}'`;
    }
    if (!prog.length) throw 'nothing to run';
    return prog;
  }

  // ---------- machine ----------
  let prog = [], regs, mem, pc, cycle, pipe, hist, trace, halted, done, seq, timer = null, regHot, memHot;
  const el = id => document.getElementById(id);
  const ui = { src: el('src'), err: el('err'), pipe: el('pipe'), regs: el('regs'), mem: el('mem'), wave: el('wave'), stat: el('stat'),
    step: el('b-step'), run: el('b-run'), reset: el('b-reset'), speed: el('speed'), preset: el('preset'), hex: el('hex') };

  function reset() {
    stop(); ui.err.textContent = '';
    try { prog = assemble(ui.src.value); } catch (e) { ui.err.textContent = String(e); prog = []; }
    regs = new Int32Array(32); mem = new Int32Array(MEMW); pc = 0; cycle = 0; seq = 0;
    pipe = { IF: null, ID: null, EX: null, MEM: null, WB: null }; hist = []; trace = []; halted = false; done = !prog.length;
    regHot = new Int32Array(32).fill(-1); memHot = new Int32Array(MEMW).fill(-1);
    if (prog.length) { cycle = 1; pipe.IF = fetch(); mark(pipe.IF, 'IF'); trace.push({ c: 1, pc: pipe.IF.pc, stall: 0, flush: 0 }); }
    render();
  }
  function fetch() { if (halted || pc < 0 || pc >= prog.length * 4) return null; const ins = prog[pc / 4]; const inst = { ...ins, seq: seq++, stages: {} }; pc += 4; return inst; }
  function mark(inst, st) { if (!inst) return; inst.stages[cycle] = st; if (!hist.includes(inst)) hist.push(inst); }
  const src = (inst, r) => r !== 0 && (inst.rs1 === r || (inst.rs2 === r && (inst.cls === 'alu' && !inst.useImm || inst.cls === 'br' || inst.cls === 'sw')));
  const writesRd = inst => inst && inst.rd !== 0 && ['alu', 'lw', 'lui', 'auipc', 'jal', 'jalr'].includes(inst.cls);
  const alu = (fn, a, b) => {
    switch (fn) {
      case '+': return (a + b) | 0; case '-': return (a - b) | 0; case '&': return a & b; case '|': return a | b; case '^': return a ^ b;
      case '<<': return a << (b & 31); case '>>>': return a >>> (b & 31) | 0; case '>>': return a >> (b & 31);
      case 'lt': return a < b ? 1 : 0; case 'ltu': return (a >>> 0) < (b >>> 0) ? 1 : 0;
    } return 0;
  };
  function setReg(r, v) { if (r === 0) return; regs[r] = v | 0; regHot[r] = cycle; }
  function doEX(inst) {           // returns redirect target or null
    const a = regs[inst.rs1], b = inst.useImm ? inst.imm : regs[inst.rs2];
    switch (inst.cls) {
      case 'alu': setReg(inst.rd, alu(inst.fn, a, b)); return null;
      case 'lui': setReg(inst.rd, (inst.imm << 12) | 0); return null;
      case 'auipc': setReg(inst.rd, (inst.pc + (inst.imm << 12)) | 0); return null;
      case 'lw': case 'sw': inst.addr = (a + inst.imm) | 0; return null;
      case 'br': inst.taken = inst.cmp(a, regs[inst.rs2]); return inst.taken ? inst.target : null;
      case 'jal': setReg(inst.rd, inst.pc + 4); return inst.target;
      case 'jalr': { const t = (a + inst.imm) & ~1; setReg(inst.rd, inst.pc + 4); return t; }
      case 'halt': halted = true; return null;
    }
  }
  function doMEM(inst) {
    if (inst.cls !== 'lw' && inst.cls !== 'sw') return;
    const w = inst.addr >> 2;
    if (inst.addr & 3 || w < 0 || w >= MEMW) throw `cycle ${cycle}: ${inst.op} address 0x${(inst.addr >>> 0).toString(16)} out of range (0..${MEMW * 4 - 4}, word-aligned)`;
    if (inst.cls === 'lw') setReg(inst.rd, mem[w]); else { mem[w] = regs[inst.rs2]; memHot[w] = cycle; }
  }
  function step() {
    if (done) return;
    cycle++;
    const o = pipe, n = { IF: null, ID: null, EX: null, MEM: null, WB: null };
    let stall = 0, flush = 0;
    try {
      n.WB = o.MEM; mark(n.WB, 'WB');
      n.MEM = o.EX; if (n.MEM) { doMEM(n.MEM); mark(n.MEM, 'MEM'); }
      // load-use hazard: ID needs a register that the load in EX hasn't produced yet
      if (o.ID && o.EX && o.EX.cls === 'lw' && o.EX.rd !== 0 && src(o.ID, o.EX.rd)) {
        stall = 1; n.ID = o.ID; mark(o.ID, 'stall'); n.IF = o.IF; mark(o.IF, 'stall');
      } else {
        n.EX = o.ID;
        if (n.EX) {
          const fwd = (writesRd(o.EX) && src(n.EX, o.EX.rd)) || (writesRd(o.MEM) && src(n.EX, o.MEM.rd));
          const target = doEX(n.EX); mark(n.EX, fwd ? 'EX fwd' : 'EX');
          if (target !== null) { flush = 1; pc = target; mark(o.IF, 'flush'); n.IF = fetch(); mark(n.IF, 'IF'); }
          else if (n.EX.cls === 'halt') { mark(o.IF, 'flush'); n.IF = null; }
        }
        if (!flush && !(n.EX && n.EX.cls === 'halt')) { n.ID = o.IF; mark(n.ID, 'ID'); n.IF = fetch(); mark(n.IF, 'IF'); }
      }
    } catch (e) { ui.err.textContent = String(e); stop(); done = true; render(); return; }
    pipe = n;
    trace.push({ c: cycle, pc: n.IF ? n.IF.pc : null, stall, flush });
    if (!n.IF && !n.ID && !n.EX && !n.MEM && !n.WB) done = true;
    if (cycle > 4000) { ui.err.textContent = 'stopped after 4000 cycles (infinite loop?)'; done = true; }
    render();
  }
  function run() { if (timer) return stop(); if (done) reset(); timer = setInterval(() => { step(); if (done) stop(); }, 1000 / +ui.speed.value); ui.run.textContent = '⏸ pause'; }
  function stop() { if (timer) clearInterval(timer); timer = null; ui.run.textContent = '▶ run'; }

  // ---------- render ----------
  const fmt = v => ui.hex.checked ? '0x' + (v >>> 0).toString(16).padStart(8, '0') : String(v);
  function render() {
    const CW = 22, RW = 20;
    const c0 = Math.max(1, cycle - CW + 1), rows = hist.filter(h => Object.keys(h.stages).some(c => +c >= c0)).slice(-RW);
    let h = '<table class="pipe-t"><caption class="sr-only">Pipeline stage of each instruction per cycle</caption><tr><th scope="col" style="text-align:left">instruction</th>';
    for (let c = c0; c <= cycle; c++) h += `<th scope="col" class="${c === cycle ? 'cur' : ''}"><span class="sr-only">cycle </span>${c}</th>`;
    h += '</tr>';
    for (const r of rows) {
      h += `<tr><td class="ins"><span class="pc">${r.pc.toString(16).padStart(3, '0')}</span>${r.text}</td>`;
      for (let c = c0; c <= cycle; c++) {
        const s = r.stages[c]; const cls = s ? s.split(' ')[0] : '';
        h += `<td class="${c === cycle ? 'cur' : ''}">${s ? `<span class="st ${cls} ${s.includes('fwd') ? 'fwd' : ''}" title="${cls === 'stall' ? 'stalled' : cls === 'flush' ? 'squashed' : cls}${s.includes('fwd') ? ', operand forwarded' : ''}">${cls === 'stall' ? '· ·' : cls === 'flush' ? 'X' : cls}</span>` : ''}</td>`;
      }
      h += '</tr>';
    }
    ui.pipe.innerHTML = h + '</table>';
    ui.regs.innerHTML = Array.from(regs, (v, i) => `<div class="${regHot[i] === cycle ? 'hot' : ''}" title="x${i}"><span>${ABI[i]}</span><span>${fmt(v)}</span></div>`).join('');
    ui.mem.innerHTML = Array.from(mem.slice(0, 32), (v, i) => `<div class="${memHot[i] >= 0 ? 'hot' : ''}"><span>${(i * 4).toString(16).padStart(2, '0')}</span><span>${fmt(v)}</span></div>`).join('');
    const insts = hist.filter(x => Object.values(x.stages).includes('WB')).length;
    ui.stat.innerHTML = `<span>cycle <b>${cycle}</b></span><span>retired <b>${insts}</b></span><span>CPI <b>${insts ? (cycle / insts).toFixed(2) : '–'}</b></span>
      <span>stalls <b>${trace.filter(t => t.stall).length}</b></span><span>flushes <b>${trace.filter(t => t.flush).length}</b></span>
      <span>pc <b>0x${pc.toString(16).padStart(3, '0')}</b></span><span>${done ? '<b class="ox">halted</b>' : halted ? 'draining' : 'running'}</span>`;
    ui.step.disabled = done; renderWave(c0);
  }
  function renderWave(c0) {
    const t = trace.filter(x => x.c >= c0); const n = Math.max(t.length, 1), cw = 36, L = 44, W = L + n * cw + 8, rowH = 26, H = rowH * 4 + 10;
    const sig = (name, y, get, col) => {
      let d = '', prev = null;
      t.forEach((x, i) => { const v = get(x) ? 1 : 0, yy = y + (v ? -8 : 8), xa = L + i * cw; d += (i === 0 ? `M${xa} ${yy}` : (prev !== v ? `L${xa} ${y + (prev ? -8 : 8)} L${xa} ${yy}` : '')) + ` L${xa + cw} ${yy}`; prev = v; });
      return `<text x="4" y="${y + 4}">${name}</text><path class="w" stroke="${col}" d="${d}"/>`;
    };
    let clk = ''; t.forEach((x, i) => { const a = L + i * cw; clk += `${i ? 'L' : 'M'}${a} ${rowH + 8} L${a} ${rowH - 8} L${a + cw / 2} ${rowH - 8} L${a + cw / 2} ${rowH + 8} L${a + cw} ${rowH + 8} `; });
    let bus = '', y = rowH * 4;
    t.forEach((x, i) => { const a = L + i * cw; const v = x.pc === null ? '–' : x.pc.toString(16); bus += `<path class="bus" d="M${a + 3} ${y} L${a + 6} ${y - 8} L${a + cw - 6} ${y - 8} L${a + cw - 3} ${y} L${a + cw - 6} ${y + 8} L${a + 6} ${y + 8} Z"/><text class="busv" x="${a + cw / 2}" y="${y + 3}" text-anchor="middle">${v}</text>`; });
    ui.wave.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><text x="4" y="${rowH + 4}">clk</text><path class="w" stroke="#8e9ab7" d="${clk}"/>
      ${sig('stall', rowH * 2, x => x.stall, '#f2c14e')}${sig('flush', rowH * 3, x => x.flush, '#cf3a52')}<text x="4" y="${y + 4}">pc</text>${bus}</svg>`;
  }

  // ---------- wire up ----------
  ui.step.onclick = () => { if (!prog.length || done) reset(); step(); };
  ui.run.onclick = run; ui.reset.onclick = reset;
  ui.preset.onchange = () => { ui.src.value = PRESETS[ui.preset.value]; reset(); };
  ui.src.addEventListener('input', () => { stop(); done = true; ui.err.textContent = 'edited — press reset or step to reassemble'; });
  ui.hex.onchange = render;
  ui.src.addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); const s = ui.src.selectionStart; ui.src.setRangeText('    ', s, ui.src.selectionEnd, 'end'); } });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select,button,a,summary,[tabindex]') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === ' ') { e.preventDefault(); ui.step.click(); } else if (e.key === 'r') ui.reset.click(); else if (e.key === 'Enter') ui.run.click();
  });
  ui.src.value = PRESETS.sum; reset();
})();
