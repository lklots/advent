const _ = require('lodash');
const readInput = require('../../lib/file');


function solve(ids, remainders) {
  let a = 0;
  let lcd = 1;
  ids.forEach((id, k) => {
    while ((a + remainders[k]) % id !== 0) {
      a += lcd;
    }
    lcd *= id;
  });

  return a;
}

async function run() {
  const input = await readInput('2020/13');
  const lines = input.split('\n');
  const start = parseInt(lines[0], 10);
  const schedule = lines[1].split(',').map(x => (x !== 'x' && parseInt(x, 10)) || x);
  const mins = schedule.filter(_.isInteger).map(id => [id, (Math.ceil(start / id) * id - start)]);
  console.log(`part1: ${_.reduce(_.minBy(mins, x => x[1]), _.multiply)}`);
  const buses = schedule.map((x, i) => [x, i]).filter(x => _.isInteger(x[0]));
  const solution = solve(buses.map(_.head), buses.map(_.last));
  console.log(`part2: ${solution}`);
}
run();
