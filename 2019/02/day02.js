const _ = require('lodash');
const readInput = require('../../lib/file');

const OPS = {
  1: (x, y) => x + y,
  2: (x, y) => x * y,
};

async function run() {
  const input = await readInput('2019/02/');
  const registers = _.flatMap(input.split('\n'), (x) => x.split(',').map((y) => parseInt(y, 10)));
  let index = 0;
  while (registers[index] !== 99) {
    const opcode = registers[index];
    const arg1 = registers[index + 1];
    const arg2 = registers[index + 2];
    const dest = registers[index + 3];
    registers[dest] = OPS[opcode](registers[arg1], registers[arg2]);
    index += 4;
  }
  console.log(registers[0]);
}

run();
