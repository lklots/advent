const _ = require('lodash');
const readInput = require('../../lib/file');
const Intcode = require('../../lib/intcode');

async function run() {
  const input = await readInput('2019/13/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  const comp = new Intcode(registers);
  const map = {};
  while (true) {
    const [x, y, tile] = [comp.exec(), comp.exec(), comp.exec()];
    if (x === null) {
      console.log(_.values(map).filter(t => t === 2).length);
      return;
    }
    map[`${x},${y}`] = tile;
  }
}

run();
