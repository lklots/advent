const readInput = require('../../lib/file');

function seat(pattern) {
  const row = pattern.slice(0, 7).split('').map(x => x === 'B').reduce((res, x) => res << 1 | x);
  const col = pattern.slice(7).split('').map(x => x === 'R').reduce((res, x) => res << 1 | x);
  return row * 8 + col;
}

function gap(arr) {
  for (let i = 1; i < arr.length; i += 1) {
    if (arr[i] - arr[i - 1] !== 1) {
      return arr[i - 1] + 1;
    }
  }
  return 0;
}

async function run() {
  const input = await readInput('2020/05');
  const lines = input.split(/\n/);
  const seats = lines.map(x => seat(x));
  console.log(`part1: ${Math.max(...seats)}`);
  seats.sort((a, b) => a - b);
  console.log(`part2: ${gap(seats)}`);
}
run();
