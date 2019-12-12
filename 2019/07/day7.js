const _ = require('lodash');
const readInput = require('../../lib/file');

function digit(num, i) {
  return Math.floor((num / (10 ** i)) % 10);
}

function decode(op) {
  const code = parseInt(op, 10);
  return [code % 100, [digit(code, 2), digit(code, 3), digit(code, 4), digit(code, 5)]];
}


class Amplifier {
  constructor(registers, phase) {
    this.registers = registers.slice();
    this.inputs = [phase];
    this.ip = 0;
  }

  exec(input) {
    this.inputs.push(input);
    const OPS = {
      1: (x, y) => x + y,
      2: (x, y) => x * y,
      3: (x) => { this.registers[x] = this.inputs.shift(); },
      4: x => x,
      5: (x, y) => {
        this.ip = x !== 0 ? y : this.ip + 3;
      },
      6: (x, y) => {
        this.ip = x === 0 ? y : this.ip + 3;
      },
      7: (x, y) => +(x < y),
      8: (x, y) => +(x === y),
    };

    const resolve = (mode, index) => (mode ? this.registers[index] : this.registers[this.registers[index]]);
    let opcode;
    let modes;
    let ret;
    while (opcode !== 99) {
      [opcode, modes] = decode(this.registers[this.ip]);
      const op = OPS[opcode];
      switch (opcode) {
        case 1:
        case 2:
        case 7:
        case 8:
          this.registers[this.registers[this.ip + 3]] = op(resolve(modes[0], this.ip + 1), resolve(modes[1], this.ip + 2));
          this.ip += 4;
          break;
        case 3:
          op(this.registers[this.ip + 1]);
          this.ip += 2;
          break;
        case 4:
          ret = op(resolve(modes[0], this.ip + 1));
          this.ip += 2;
          return ret;
        case 5:
        case 6:
          op(resolve(modes[0], this.ip + 1), resolve(modes[1], this.ip + 2));
          break;
        case 99:
          break;
        default:
          throw new Error('unknown');
      }
    }

    return null;
  }
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
  const amplifiers = [];
  _.range(0, 5).forEach((i) => {
    amplifiers[i] = new Amplifier(registers, phases[i]);
  });

  let output = 0;
  _.range(0, 5).forEach((i) => {
    output = amplifiers[i].exec(output);
  });
  return output;
}

function feedback(registers, phases) {
  const amplifiers = [];
  _.range(0, 5).forEach((i) => {
    amplifiers[i] = new Amplifier(registers, phases[i]);
  });

  const outputs = [0];
  while (true) {
    for (let i = 0; i < 5; i += 1) {
      const ret = amplifiers[i].exec(outputs[i]);
      if (ret === null) {
        return outputs[i];
      }
      outputs[(i + 1) % 5] = ret;
    }
  }
  return null;
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

  max = 0;
  permute([9, 8, 7, 6, 5]).forEach((phases) => {
    const signal = feedback(registers, phases);
    if (signal > max) {
      max = signal;
    }
  });
  console.log(max);

}

run();
