const _ = require('lodash');
const readInput = require('../../lib/file');

function digit(num, i) {
  return Math.floor((num / (10 ** i)) % 10);
}

function decode(op) {
  const code = parseInt(op, 10);
  return [code % 100, [digit(code, 2), digit(code, 3), digit(code, 4), digit(code, 5)]];
}

function exec(registers_, inputs) {
  const registers = registers_; // make linter happy
  let ip = 0;
  const OPS = {
    1: (x, y) => x + y,
    2: (x, y) => x * y,
    3: (x) => { registers[x] = inputs.shift(); },
    4: x => x,
    5: (x, y) => {
      ip = x !== 0 ? y : ip + 3;
    },
    6: (x, y) => {
      ip = x === 0 ? y : ip + 3;
    },
    7: (x, y) => +(x < y),
    8: (x, y) => +(x === y),
  };

  const resolve = (mode, index) => (mode ? registers[index] : registers[registers[index]]);
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
        registers[registers[ip + 3]] = op(resolve(modes[0], ip + 1), resolve(modes[1], ip + 2));
        ip += 4;
        break;
      case 3:
        // console.log(`${ip}: ${opcode}(${registers[ip + 1]}):\t\t ${registers}`);
        op(registers[ip + 1]);
        ip += 2;
        break;
      case 4:
        // console.log(`${ip}: ${opcode}(${registers[ip + 1]}):\t\t ${registers}`);
        return op(resolve(modes[0], ip + 1));
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

function permute(set) {
  if (set.length === 1) {
    return [set];
  }

  let total = [];
  for (let i = 0; i < set.length; i += 1) {
    const m = set.slice(i, i + 1);
    let ret = permute(set.slice(0, i).concat(set.slice(i + 1, set.length)));
    ret = ret.map(x => x.concat(m));
    total = total.concat(ret);
  }

  return total;
}

function compute(registers, phases) {
  let output = 0;
  _.range(0, 5).forEach((i) => {
    output = exec(_.clone(registers), [phases[i], output]);
  });
  return output;
}

async function run() {
  const input = await readInput('2019/07/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  let max = 0;
  permute([0, 1, 2, 3, 4]).forEach((phases) => {
    const signal = compute(registers, phases);
    if (signal > max) {
      max = signal;
    }
  });
  console.log(max);
}

run();
