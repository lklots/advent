#!/usr/local/bin/node

const readFile = require('../lib/file');

let REGISTERS = [1, 0, 0, 0, 0, 0];

function register(reg) {
  return REGISTERS[reg];
}

const OPCODES = {
  addr: (a, b) => register(a) + register(b),
  addi: (a, b) => register(a) + b,
  mulr: (a, b) => register(a) * register(b),
  muli: (a, b) => register(a) * b,
  banr: (a, b) => register(a) & register(b),
  bani: (a, b) => register(a) & b,
  borr: (a, b) => register(a) | register(b),
  bori: (a, b) => register(a) | b,
  setr: (a, b) => register(a),
  seti: (a, b) => a,
  gtir: (a, b) => (a > register(b) ? 1 : 0),
  gtri: (a, b) => (register(a) > b ? 1 : 0),
  gtrr: (a, b) => (register(a) > register(b) ? 1 : 0),
  eqir: (a, b) => (a === register(b) ? 1 : 0),
  eqri: (a, b) => (register(a) === b ? 1 : 0),
  eqrr: (a, b) => (register(a) === register(b) ? 1 : 0),
};

async function run() {
  const lines = (await readFile(__dirname, 'input.txt')).split('\n');

  const ipregister = parseInt(lines.shift().match(/#ip (\d)/)[1], 10);
  const instructions = lines.map(x => x.split(' '));
  let sample = 0;
  while (REGISTERS[ipregister] < instructions.length) {
    let [opcode, a, b, c] = instructions[REGISTERS[ipregister]];
    a = parseInt(a, 10);
    b = parseInt(b, 10);
    c = parseInt(c, 10);
    const before = REGISTERS.slice();
    REGISTERS[c] = OPCODES[opcode](a, b);
    if (sample % 1 === 100) {
      console.log(`ip=${before[ipregister]} [${before.join(',')}] ${opcode} ${a} ${b} ${c} [${REGISTERS.join(',')}]`);
    }
    sample += 1;
    if (sample >= 10000000000) {
      return;
    }
    REGISTERS[ipregister] += 1;
  }

  console.log(REGISTERS[0]);
}

run();