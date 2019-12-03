const readInput = require('../../lib/file');

async function run() {
  const input = await readInput('2019/01/');
  const sum = input.split('\n').reduce((total, x) => total + Math.floor(parseInt(x, 10) / 3) - 2, 0);
  console.log(`part1: ${sum}`);
}

run();
