const _ = require('lodash');
const readInput = require('../../lib/file');

function freq(char, str) {
  return _.reduce(str, (acc, c) => ((c === char) ? acc + 1 : acc), 0);
}

function valid(a, b, char, pattern) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  const x = freq(char, pattern);
  return x >= min && x <= max;
}

function valid2(a, b, char, pattern) {
  return (pattern[a - 1] === char || pattern[b - 1] === char) && !((pattern[a - 1] === char && pattern[b - 1] === char));
}

async function run() {
  const input = await readInput('2020/02');
  const patterns = input.split('\n').map(x => _.slice(x.match(/(\d+)-(\d+) ([a-z]): ([a-z]+)/), 1));
  const part1 = _(patterns)
    .map(p => valid(parseInt(p[0], 10), parseInt(p[1], 10), p[2], p[3]))
    .reduce((acc, c) => (c ? acc + 1 : acc), 0);
  const part2 = _(patterns)
    .map(p => valid2(parseInt(p[0], 10), parseInt(p[1], 10), p[2], p[3]))
    .reduce((acc, c) => (c ? acc + 1 : acc), 0);
  console.log(`part1: ${part1}`);
  console.log(`part2: ${part2}`);
}
run();
