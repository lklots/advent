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
    this.output = [];
  }

  in(i) {
    this.input.push(i);
  }

  * exec() {
    const OPS = {
      1: (x, y) => x + y,
      2: (x, y) => x * y,
      3: (x) => {
        this.registers[x] = this.input.length > 0 ? this.input.shift() : -1;
      },
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
          if (this.input.length === 0) {
            yield -1;
          }
          break;
        case 4:
          ret = this.resolve(modes[0], this.ip + 1);
          this.ip += 2;
          yield ret;
          break;
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

async function run() {
  const input = await readInput('2019/23/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  const computers = _.range(50).map(() => new Intcode(registers));
  computers.forEach((c, i) => c.in(i));
  while (true) {
    for (let i = 0; i < computers.length; i += 1) {
      const comp = computers[i];
      const index = comp.exec().next().value;
      if (index !== -1) {
        const [x, y] = [comp.exec().next().value, comp.exec().next().value];
        if (index === 255) {
          console.log(y);
          return y;
        }
        computers[index].in(x);
        computers[index].in(y);
      }
    }
  }
}

run();
