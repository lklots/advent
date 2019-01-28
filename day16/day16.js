#!/usr/local/bin/node

const readFile = require('../lib/file');

function parse(before, op, after) {
  const beforem = before.match(/(\d), (\d), (\d), (\d)/);
  const opm = op.match(/(\d) (\d) (\d) (\d)/);
  const afterm = after.match(/(\d), (\d), (\d), (\d)/);

  return [
    [beforem[1], beforem[2], beforem[3], beforem[4]].map(x => parseInt(x, 10)),
    [opm[1], opm[2], opm[3], opm[4]].map(x => parseInt(x, 10)),
    [afterm[1], afterm[2], afterm[3], afterm[4]].map(x => parseInt(x, 10)),
  ];
}

let REGISTERS = [0, 0, 0, 0];

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


function cmp(got, expected) {
  for (let i = 0; i < got.length; i += 1) {
    if (got[i] !== expected[i]) {
      return false;
    }
  }
  return true;
}

function test(before, op, after) {
  const _ = op.shift();
  const a = op.shift();
  const b = op.shift();
  const c = op.shift();

  const behaving = Object.keys(OPCODES).map((opcode) => {
    REGISTERS = before.slice();
    REGISTERS[c] = OPCODES[opcode](a, b);
    return cmp(REGISTERS, after);
  });
  return behaving.filter(x => x).length;
}

async function run() {
  const contents = (await readFile(__dirname, 'input.txt')).split('\n');
  const tests = [];
  while (contents.length) {
    tests.push(parse(contents.shift(), contents.shift(), contents.shift()));
    contents.shift();
    if (!contents[0].trim().length) {
      break;
    }
  }
  const results = tests.map(t => test(...t));
  console.log(`number of tests that match at least 3 op codes ${results.filter(x => x >= 3).length}`);
}

run();
