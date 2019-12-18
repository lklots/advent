const _ = require('lodash');
const readInput = require('../../lib/file');

function digit(num, i) {
  return Math.floor((num / (10 ** i)) % 10);
}

function decode(op) {
  const code = parseInt(op, 10);
  return [code % 100, [digit(code, 2), digit(code, 3), digit(code, 4), digit(code, 5)]];
}

class Intcode {
  constructor(registers) {
    this.ip = 0;
    this.base = 0;
    this.registers = registers.slice();
    this.input = [];
  }

  in(i) {
    this.input.push(i);
  }

  exec() {
    const OPS = {
      1: (x, y) => x + y,
      2: (x, y) => x * y,
      3: (x) => { this.registers[x] = this.input.shift(); },
      5: (x, y) => {
        this.ip = x !== 0 ? y : this.ip + 3;
      },
      6: (x, y) => {
        this.ip = x === 0 ? y : this.ip + 3;
      },
      7: (x, y) => +(x < y),
      8: (x, y) => +(x === y),
      9: (x) => {
        this.base += x;
      },
    };

    let opcode;
    let modes;
    let ret;
    while (opcode !== 99) {
      [opcode, modes] = decode(this.registers[this.ip]);
      const op = OPS[opcode];
      if (opcode === 99) { break; }
      switch (opcode) {
        case 1:
        case 2:
        case 7:
        case 8:
          this.registers[this.dest(modes[2], this.ip + 3)] = op(this.resolve(modes[0], this.ip + 1), this.resolve(modes[1], this.ip + 2));
          this.ip += 4;
          break;
        case 3:
          op(this.dest(modes[0], this.ip + 1));
          this.ip += 2;
          break;
        case 4:
          ret = this.resolve(modes[0], this.ip + 1);
          this.ip += 2;
          return ret;
        case 9:
          op(this.resolve(modes[0], this.ip + 1));
          this.ip += 2;
          break;
        case 5:
        case 6:
          op(this.resolve(modes[0], this.ip + 1), this.resolve(modes[1], this.ip + 2));
          break;
        case 99:
          break;
        default:
          throw new Error('unknown');
      }
    }

    return null;
  }

  dest(mode, index) {
    if (mode === 2) {
      return this.base + this.registers[index];
    }
    return this.registers[index];
  }

  resolve(mode, index) {
    if (mode === 0) {
      return _.get(this.registers, _.get(this.registers, index, 0), 0);
    }
    if (mode === 1) {
      return _.get(this.registers, index, 0);
    }
    if (mode === 2) {
      return _.get(this.registers, this.base + _.get(this.registers, index, 0));
    }
    return null;
  }
}

const map = new Map();

function paint(x, y, color) {
  const current = map.get(`${x},${y}`) || 0;
  map.set(`${x},${y}`, color);
  // eslint-disable-next-line no-bitwise
  return (current ^ color);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function step(x, y, dir, rotate) {
  if (rotate) {
    dir = (dir + 1) % 4;
  } else {
    dir = mod(dir - 1, 4);
  }
  switch (dir) {
    case 0: return [x, y - 1, dir];
    case 1: return [x + 1, y, dir];
    case 2: return [x, y + 1, dir];
    case 3: return [x - 1, y, dir];
    default: throw new Error(`unknown ${dir}`);
  }
}

async function run() {
  const input = await readInput('2019/11/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  const comp = new Intcode(registers);
  comp.in(0);

  let x = 0;
  let y = 0;
  let dir = 0;
  let ret = null;
  const changes = new Map();
  while (true) {
    ret = comp.exec();
    if (ret === null) {
      break;
    }
    if (paint(x, y, ret)) {
      changes.set(`${x},${y}`, true);
    }
    [x, y, dir] = step(x, y, dir, comp.exec());
    comp.in(map.get(`${x},${y}`) || 0);
  }
  console.log(changes.size);
}

run();
