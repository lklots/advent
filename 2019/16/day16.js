const _ = require('lodash');
const readInput = require('../../lib/file');

const PATTERN = [0, 1, 0, -1];

function* cycle(arr) {
  let index = 0;
  while (true) {
    yield arr[index];
    index = (index + 1) % arr.length;
  }
}

function pattern(i) {
  const p = _.flatMap(PATTERN, x => _.times(i + 1, () => x));
  const gen = cycle(p);
  gen.next();
  return gen;
}

function take(gen, n) {
  const ret = [];
  _.times(n, () => ret.push(gen.next().value));
  return ret;
}

function round(seq) {
  const ret = seq.map((_d, i, arr) => _.zipWith(arr, take(pattern(i), arr.length), (x, y) => x * y));
  return ret.map(x => Math.abs(_.sum(x)) % 10);
}

async function run() {
  const input = await readInput('2019/16/');
  let seq = input.split('').map(x => parseInt(x, 10));

  _.times(100, () => {
    seq = round(seq);
  });
  console.log(_.take(seq, 8).join(''));
}

run();
