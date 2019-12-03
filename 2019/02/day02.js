const _ = require('lodash');
const readInput = require('../../lib/file');

const OPS = {
  1: (x, y) => x + y,
  2: (x, y) => x * y,
};

function exec(registers_, init1, init2) {
  const registers = registers_; // make linter happy
  let index = 0;
  // init registers 1 && 2
  registers[1] = init1;
  registers[2] = init2;
  while (registers[index] !== 99) {
    const opcode = registers[index];
    const arg1 = registers[index + 1];
    const arg2 = registers[index + 2];
    const dest = registers[index + 3];
    registers[dest] = OPS[opcode](registers[arg1], registers[arg2]);
    index += 4;
  }
  return registers[0];
}

async function run() {
  const input = await readInput('2019/02/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  console.log(exec(_.clone(registers), 12, 2));

  const noun = 79;
  const verb = 60;
  exec(_.clone(registers), noun, verb);
  console.log(noun * 100 + verb);
}

run();
