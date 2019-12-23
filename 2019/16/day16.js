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

function drop(gen, n) {
  _.times(n, () => gen.next());
  return gen;
}

function round(seq) {
  const ret = seq.map((_d, i, arr) => _.zipWith(arr, take(pattern(i), arr.length), (x, y) => x * y));
  return ret.map(x => Math.abs(_.sum(x)) % 10);
}

function smartround(seq) {
  for (let i = seq.length - 2; i >= 0; i -= 1) {
    seq[i] = (seq[i + 1] + seq[i]) % 10;
  }
  return seq;
}

async function run() {
  const input = await readInput('2019/16/');
  let seq = input.split('').map(x => parseInt(x, 10));
  _.times(100, () => {
    seq = round(seq);
  });
  console.log(`${seq.slice(0, 8).join('')}`);

  seq = input.split('').map(x => parseInt(x, 10));
  const index = parseInt(seq.slice(0, 7).join(''), 10);
  const repeat = 10000;
  seq = take(drop(cycle(seq), index), seq.length * repeat - index);
  _.times(100, () => {
    seq = smartround(seq);
  });
  console.log(seq.slice(0, 8).join(''));
}

run();
