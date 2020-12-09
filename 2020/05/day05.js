const _ = require('lodash');
const readInput = require('../../lib/file');

function seat(pattern) {
  const row = pattern.slice(0, 7).split('').map(x => x === 'B').reduce((res, x) => res << 1 | x);
  const col = pattern.slice(7).split('').map(x => x === 'R').reduce((res, x) => res << 1 | x);
  return row * 8 + col;
}

function gap(arr) {
  return _.find(arr, (v, i) => arr[i + 1] !== v + 1) + 1;
}

async function run() {
  const input = await readInput('2020/05');
  const seats = input.split(/\n/).map(x => seat(x));
  console.log(`part1: ${Math.max(...seats)}`);
  seats.sort((a, b) => a - b);
  console.log(`part2: ${gap(seats)}`);
}
run();
