const readInput = require('../../lib/file');

function fuel(x) {
  if (x <= 0) {
    return 0;
  }
  const s = Math.max(Math.floor(x / 3) - 2, 0);
  return s + fuel(s);
}

async function run() {
  const input = await readInput('2019/01/');
  const sum = input.split('\n').reduce((total, x) => total + Math.floor(parseInt(x, 10) / 3) - 2, 0);
  console.log(`part1: ${sum}`);
  const sum2 = input.split('\n').reduce((total, x) => total + fuel(parseInt(x, 10)), 0);
  console.log(`part2: ${sum2}`);
}

run();
