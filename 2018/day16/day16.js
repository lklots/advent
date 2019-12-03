#!/usr/local/bin/node
const _ = require('lodash');
const readFile = require('../lib/file');

function parse(before, op, after) {
  const beforem = before.match(/(\d), (\d), (\d), (\d)/);
  const opm = op.match(/(\d+) (\d) (\d) (\d)/);
  const afterm = after.match(/(\d), (\d), (\d), (\d)/);

  return [
    [beforem[1], beforem[2], beforem[3], beforem[4]].map(x => parseInt(x, 10)),
    [opm[1], opm[2], opm[3], opm[4]].map(x => parseInt(x, 10)),
    [afterm[1], afterm[2], afterm[3], afterm[4]].map(x => parseInt(x, 10)),
  ];
}

let REGISTERS = [0, 0, 0, 0];

function reset() {
  REGISTERS = [0, 0, 0, 0];
}

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
  setr: a => register(a),
  seti: a => a,
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
  const [, a, b, c] = op;

  const behaving = Object.keys(OPCODES).map((opcode) => {
    REGISTERS = before.slice();
    REGISTERS[c] = OPCODES[opcode](a, b);
    return cmp(REGISTERS, after);
  });
  return behaving;
}

function mapOpCodes(tests, results) {
  const groupByCode = [];
  for (let i = 0; i < tests.length; i += 1) {
    const opCode = tests[i][1][0];
    if (!groupByCode[opCode]) {
      groupByCode[opCode] = [results[i]];
    } else {
      groupByCode[opCode].push(results[i]);
    }
  }
  let possible = groupByCode.map(group => _.zip(...group).map(list => list.every(x => x)));
  possible = possible.map(list => _.zipObject(Object.keys(OPCODES), list));

  const mapping = {};
  while (possible.filter(x => !_.isEmpty(x)).length) {
    const decisions = possible.map(obj => _.pickBy(obj));
    for (let i = 0; i < decisions.length; i += 1) {
      const decision = decisions[i];
      if (_.keys(decision).length === 1) {
        mapping[i] = _.keys(decision)[0];
        possible = possible.map(obj => _.omit(obj, _.keys(decision)[0]));
      }
    }
  }

  return mapping;
}

function doCommands(commands, mapping) {
  reset();
  while (commands.length) {
    const [op, a, b, c] = commands.shift();
    REGISTERS[c] = OPCODES[mapping[op]](a, b);
  }
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
  console.log(`part 1: ${results.map(list => list.filter(x => x)).filter(list => list.length >= 3).length}`);


  const mapping = mapOpCodes(tests, results);
  const commands = [];
  while (contents.length) {
    const line = contents.shift();
    if (line.trim().length) {
      commands.push(line.split(' ').map(x => parseInt(x, 10)));
    }
  }

  doCommands(commands, mapping);
  console.log(`part2: ${REGISTERS[0]}`);
}

run();
