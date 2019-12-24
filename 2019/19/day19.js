const _ = require('lodash');

const readInput = require('../../lib/file');
const Intcode = require('../../lib/intcode');

function neighbors([x, y]) {
  return [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];
}


async function run() {
  const input = await readInput('2019/19/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  let count = 0;
  _.range(50).forEach((i) => {
    _.range(50).forEach((j) => {
      const comp = new Intcode(registers);
      comp.in(i);
      comp.in(j);
      if (comp.exec()) {
        count += 1;
      }
    });
  });

  console.log(count);
}

run();
