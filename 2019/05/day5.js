const _ = require('lodash');
const readInput = require('../../lib/file');

function digit(num, i) {
  return Math.floor((num / (10 ** i)) % 10);
}

function decode(op) {
  const code = parseInt(op, 10);
  return [code % 100, [digit(code, 2), digit(code, 3), digit(code, 4), digit(code, 5)]];
}

function exec(registers_) {
  const inputs = [1];
  const registers = registers_; // make linter happy
  let ip = 0;

  const OPS = {
    1: (x, y) => x + y,
    2: (x, y) => x * y,
    3: (x) => { registers[x] = inputs.shift(); },
    4: x => console.log(`val ${registers[x]}`),
  };

  const resolve = (mode, index) => (mode ? registers[index] : registers[registers[index]]);
  let opcode;
  let modes;
  while (opcode !== 99) {
    [opcode, modes] = decode(registers[ip]);
    const op = OPS[opcode];
    switch (opcode) {
      case 1:
      case 2:
        registers[registers[ip + 3]] = op(resolve(modes[0], ip + 1), resolve(modes[1], ip + 2));
        ip += 4;
        break;
      case 3:
      case 4:
        op(registers[ip + 1]);
        ip += 2;
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
  const input = await readInput('2019/05/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  exec(_.clone(registers), 12, 2);
}

run();
