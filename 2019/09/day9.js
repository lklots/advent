const _ = require('lodash');
const readInput = require('../../lib/file');

function digit(num, i) {
  return Math.floor((num / (10 ** i)) % 10);
}

function decode(op) {
  const code = parseInt(op, 10);
  return [code % 100, [digit(code, 2), digit(code, 3), digit(code, 4), digit(code, 5)]];
}

function exec(registers_, input) {
  const registers = registers_; // make linter happy
  let ip = 0;
  let base = 0;
  const OPS = {
    1: (x, y) => x + y,
    2: (x, y) => x * y,
    3: (x) => { registers[x] = input; },
    4: x => console.log(`${x}`),
    5: (x, y) => {
      ip = x !== 0 ? y : ip + 3;
    },
    6: (x, y) => {
      ip = x === 0 ? y : ip + 3;
    },
    7: (x, y) => +(x < y),
    8: (x, y) => +(x === y),
    9: (x) => {
      base += x;
    },
  };

  const resolve = (mode, index) => {
    if (mode === 0) {
      return _.get(registers, _.get(registers, index, 0), 0);
    }
    if (mode === 1) {
      return _.get(registers, index, 0);
    }
    if (mode === 2) {
      return _.get(registers, base + _.get(registers, index, 0));
    }
    return null;
  };

  const dest = (mode, index) => {
    if (mode === 2) {
      return base + registers[index];
    }
    return registers[index];
  }

  let opcode;
  let modes;
  while (opcode !== 99) {
    [opcode, modes] = decode(registers[ip]);
    const op = OPS[opcode];
    if (opcode === 99) { break; }
    switch (opcode) {
      case 1:
      case 2:
      case 7:
      case 8:
        // console.log(`${ip}: [${modes.join(',')}] ${registers[ip + 3]} = ${opcode}(${resolve(modes[0], ip + 1)}, ${resolve(modes[1], ip + 2)}):\t\t ${registers}`);
        registers[dest(modes[2], ip + 3)] = op(resolve(modes[0], ip + 1), resolve(modes[1], ip + 2));
        ip += 4;
        break;
      case 3:
        // console.log(`${ip}: ${base} ${modes}, ${opcode}(${registers[ip + 1]}):\t\t ${registers}`);
        op(dest(modes[0], ip + 1));
        ip += 2;
        break;
      case 4:
      case 9:
        // console.log(`${ip}: ${opcode}(${registers[ip + 1]}):\t\t ${registers}`);
        op(resolve(modes[0], ip + 1));
        ip += 2;
        break;
      case 5:
      case 6:
        // console.log(`${ip}: ip = ${opcode}(${resolve(modes[0], ip + 1)}, ${resolve(modes[1], ip + 2)}):\t\t ${registers}`);
        op(resolve(modes[0], ip + 1), resolve(modes[1], ip + 2));
        break;
      case 99:
        break;
      default:
        throw new Error('unknown');
    }
  }

  return registers[0];
}

async function run() {
  const input = await readInput('2019/09/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  exec(_.clone(registers), 1);
  exec(_.clone(registers), 2);
}

run();
