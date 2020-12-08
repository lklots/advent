const _ = require('lodash');
const readInput = require('../../lib/file');

function decode(inst) {
  return [inst.slice(0, 3), parseInt(inst.slice(3), 10)];
}

class Console {
  constructor() {
    this.ip = 0;
    this.acc = 0;
    this.visited = {};
  }

  exec(ops) {
    while (!_.has(this.visited, this.ip) && this.ip < ops.length) {
      const [op, arg] = ops[this.ip];
      this.visited[this.ip] = true;
      switch (op) {
        case 'nop':
          this.ip += 1;
          break;
        case 'jmp':
          this.ip += arg;
          break;
        case 'acc':
          this.acc += arg;
          this.ip += 1;
          break;
        default:
          throw new Error(`unknown ${op} with arg ${arg}`);
      }
    }

    return [_.has(this.visited, this.ip), this.acc];
  }
}

function working(perms) {
  for (let i = 0; i < perms.length; i += 1) {
    const c = new Console();
    const [loops, acc] = c.exec(perms[i]);
    if (!loops) {
      return acc;
    }
  }
  throw new Error('everything loops;')
}

async function run() {
  const lines = await readInput('2020/08');
  const insts = lines.split('\n');
  const ops = insts.map(decode);
  const c = new Console();
  const [, acc] = c.exec(ops);
  console.log(`part1: ${acc}`);

  const perms = ops.map(([op, arg], i) => {
    const newOps = ops.slice();
    if (op === 'jmp') {
      newOps[i] = ['nop', arg];
      return newOps;
    }
    if (op === 'nop') {
      newOps[i] = ['jmp', arg];
      return newOps;
    }
    return null;
  }).filter(x => x);

  console.log(`part2: ${working(perms)}`);
}
run();
