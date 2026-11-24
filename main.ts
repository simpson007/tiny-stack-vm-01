import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
const I = process.env.MAKEFUN_INPUT_DIR || process.argv[2] || '/input', O = process.env.MAKEFUN_OUTPUT_DIR || process.argv[3] || '/output';
const id = n => 'i' + String(n + 1).padStart(3, '0');
function run(p, inp) {
  let pc = 0, steps = 0, sp = 0, cp = 0, ip = 0;
  const st = new Int32Array(257), cs = new Int32Array(64), mem = new Int32Array(256);
  const out = [];
  while (true) {
    if (steps >= 1000000) return [out, 10];
    if (pc < 0 || pc >= p.length) return [out, 9];
    const op = p[pc];
    let n = 1, im = 0;
    if (op === 1) n = 2;
    else if (op === 2) n = 5;
    else if (op >= 0x30 && op <= 0x33) n = 3;
    else if (!((op <= 7) || (op >= 0x10 && op <= 0x1e) || (op >= 0x20 && op <= 0x22) || op === 0x34 || op === 0x40 || op === 0x41 || (op >= 0x50 && op <= 0x53))) return [out, 5];
    if (pc + n > p.length) return [out, 9];
    steps++;
    if (op === 1) im = (p[pc + 1] << 24) >> 24;
    else if (op === 2) im = p[pc + 1] | p[pc + 2] << 8 | p[pc + 3] << 16 | p[pc + 4] << 24;
    else if (op >= 0x30 && op <= 0x32) { im = p[pc + 1] | p[pc + 2] << 8; if (im >= 32768) im -= 65536; }
    else if (op === 0x33) im = p[pc + 1] | p[pc + 2] << 8;
    const npc = pc + n;
    let a, b;
    switch (op) {
      case 0x00: return [out, 0];
      case 0x01: case 0x02:
        if (sp >= 256) return [out, 3];
        st[sp++] = im; break;
      case 0x03: if (sp < 1) return [out, 2]; sp--; break;
      case 0x04:
        if (sp < 1) return [out, 2]; if (sp >= 256) return [out, 3];
        st[sp] = st[sp - 1]; sp++; break;
      case 0x05:
        if (sp < 2) return [out, 2];
        a = st[sp - 1]; st[sp - 1] = st[sp - 2]; st[sp - 2] = a; break;
      case 0x06:
        if (sp < 2) return [out, 2]; if (sp >= 256) return [out, 3];
        st[sp] = st[sp - 2]; sp++; break;
      case 0x07:
        if (sp < 3) return [out, 2];
        a = st[sp - 3]; st[sp - 3] = st[sp - 2]; st[sp - 2] = st[sp - 1]; st[sp - 1] = a; break;
      case 0x10: case 0x11: case 0x12: case 0x13: case 0x14: case 0x15: case 0x16:
      case 0x18: case 0x19: case 0x1a: case 0x1c: case 0x1d: case 0x1e:
      case 0x20: case 0x21: case 0x22:
        if (sp < 2) return [out, 2];
        b = st[--sp]; a = st[--sp];
        if (op === 0x10) st[sp++] = (a + b) | 0;
        else if (op === 0x11) st[sp++] = (a - b) | 0;
        else if (op === 0x12) st[sp++] = Math.imul(a, b);
        else if (op === 0x13) { if (b === 0) return [out, 4]; st[sp++] = (a / b) | 0; }
        else if (op === 0x14) { if (b === 0) return [out, 4]; st[sp++] = (a % b) | 0; }
        else if (op === 0x15) { if (b === 0) return [out, 4]; st[sp++] = ((a >>> 0) / (b >>> 0)) | 0; }
        else if (op === 0x16) { if (b === 0) return [out, 4]; st[sp++] = ((a >>> 0) % (b >>> 0)) | 0; }
        else if (op === 0x18) st[sp++] = a & b;
        else if (op === 0x19) st[sp++] = a | b;
        else if (op === 0x1a) st[sp++] = a ^ b;
        else if (op === 0x1c) st[sp++] = a << (b & 31);
        else if (op === 0x1d) st[sp++] = a >> (b & 31);
        else if (op === 0x1e) st[sp++] = (a >>> (b & 31)) | 0;
        else if (op === 0x20) st[sp++] = a === b ? 1 : 0;
        else if (op === 0x21) st[sp++] = a < b ? 1 : 0;
        else st[sp++] = (a >>> 0) < (b >>> 0) ? 1 : 0;
        break;
      case 0x17:
        if (sp < 1) return [out, 2];
        st[sp - 1] = (-st[sp - 1]) | 0; break;
      case 0x1b:
        if (sp < 1) return [out, 2];
        st[sp - 1] = ~st[sp - 1]; break;
      case 0x30: pc = npc + im; continue;
      case 0x31:
        if (sp < 1) return [out, 2];
        pc = st[--sp] === 0 ? npc + im : npc; continue;
      case 0x32:
        if (sp < 1) return [out, 2];
        pc = st[--sp] !== 0 ? npc + im : npc; continue;
      case 0x33:
        if (cp >= 64) return [out, 7];
        cs[cp++] = npc; pc = im; continue;
      case 0x34:
        if (cp === 0) return [out, 8];
        pc = cs[--cp]; continue;
      case 0x40:
        if (sp < 1) return [out, 2];
        a = st[--sp]; if (a < 0 || a > 255) return [out, 6];
        st[sp++] = mem[a]; break;
      case 0x41:
        if (sp < 2) return [out, 2];
        a = st[--sp]; b = st[--sp]; if (a < 0 || a > 255) return [out, 6];
        mem[a] = b; break;
      case 0x50: {
        if (sp < 1) return [out, 2];
        const s = String(st[--sp]);
        if (out.length + s.length > 65536) return [out, 11];
        for (let i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
        break;
      }
      case 0x51:
        if (sp < 1) return [out, 2];
        if (out.length >= 65536) return [out, 11];
        out.push(st[--sp] & 255); break;
      case 0x52:
        if (sp >= 256) return [out, 3];
        st[sp++] = ip < inp.length ? inp[ip++] : -1; break;
      case 0x53:
        if (sp < 1) return [out, 2];
        return [out, st[--sp] & 255];
    }
    pc = npc;
  }
}
for (let k = 0; k < 40; k++) {
  const d = id(k);
  const prog = readFileSync(`${I}/${d}/program.bin`);
  const inp = readFileSync(`${I}/${d}/input.bin`);
  const [out, exit] = run(prog, inp);
  mkdirSync(`${O}/${d}`, {recursive: true});
  writeFileSync(`${O}/${d}/stdout.bin`, Buffer.from(out));
  writeFileSync(`${O}/${d}/exit.txt`, String(exit));
}
