const readInput = require('../../lib/file');

const cache = {};
function count(arr) {
  if (arr.length <= 2) {
    return 1;
  }

  if (_.has(cache, JSON.stringify(arr))) {
    return cache[JSON.stringify(arr)];
  }

  const x = _.head(arr);
  let total = count(arr.slice(1));
  if (arr[2] - x <= 3) {
    total += count(arr.slice(2));
  }
  if (arr[3] - x <= 3) {
    total += count(arr.slice(3));
  }

  cache[JSON.stringify(arr)] = total;

  return total;
}

async function run() {
  const lines = await readInput('2020/10');
  const adapters = lines.split('\n').map(x => parseInt(x, 10));
  adapters.sort((a, b) => a - b);
  const { 1: ones, 3: threes } = _.countBy(_.map(_.zip(adapters.slice(0, adapters.length - 1), adapters.slice(1)), ([a, b]) => (b - a)));
  console.log(`part1: ${(ones + 1) * (threes + 1)}`);
  adapters.unshift(0);
  adapters.push(_.last(adapters) + 3);
  console.log(`part2: ${count(adapters)}`);
}
run();
