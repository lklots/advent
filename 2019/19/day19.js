const _ = require('lodash');

const readInput = require('../../lib/file');
const Intcode = require('../../lib/intcode');

let registers = null;

function area(size, x, y) {
  let count = 0;
  _.range(size).forEach((i) => {
    _.range(size).forEach((j) => {
      const comp = new Intcode(registers);
      comp.in(x + j);
      comp.in(y + i);
      const ret = comp.exec();
      if (ret) {
        count += 1;
      }
    });
  });
  return count;
}

function print(size, x, y) {
  const DIFF = 50;
  _.range(size + 2 * DIFF).forEach((i) => {
    _.range(size + 2 * DIFF).forEach((j) => {
      const comp = new Intcode(registers);
      const x2 = x + j - DIFF;
      const y2 = y + i - DIFF;
      comp.in(x2);
      comp.in(y2);
      if (x === x2 && y === y2) {
        process.stdout.write('@');
      } else if (x2 >= x && x2 < x + size && y2 >= y && y2 < y + size) {
        process.stdout.write(tile(x2, y2) ? 'O' : '?');
      } else {
        process.stdout.write(comp.exec() ? '#' : '.');
      }
    });
    process.stdout.write('\n');
  });
}

// row 20: index: 23, length: 4 => (25,20)
// row 71: index: 81, length: 15 => (88.5,71) => (88.5-25)/(71-20) => gradient 1.245
// row 72: index: 83, length: 14 => (90, 72)
// gradient = 1.25
// 20 => 257,206
async function run() {
  const input = await readInput('2019/19/');
  registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));

  console.log(area(50, 0, 0));
  const SIZE = 100;
  let [x, y] = search(SIZE);
  console.log(10000 * x + y);
}

function search(size) {
  let min = [0, 0];
  let max = [12500, 10000];
  while (max[0] - min[0] > 1) {
    const middle = [Math.floor((max[0] + min[0]) / 2), Math.floor((max[1] + min[1]) / 2)];
    if (fits(size, ...middle)) {
      max = middle;
    } else {
      min = middle;
    }
  }

  let [x, y] = max;
  for (let i = x - size; i <= x; i += 1) {
    for (let j = y - size; j <= y; j += 1) {
      if (tile(i, j) && fits(size, i, j)) {
        return [i, j];
      }
    }
  }

  return [x, y];
}


function tile(x, y) {
  const comp = new Intcode(registers);
  comp.in(x);
  comp.in(y);
  return comp.exec();
}

function fits(size, x, y) {
  return tile(x, y) && tile(x + size - 1, y) && tile(x, y + size - 1);
}

run();
