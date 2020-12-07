const _ = require('lodash');
const readInput = require('../../lib/file');

async function run() {
  const input = await readInput('2020/06');
  const groups = input.split(/\n\n/);
  console.log(`part1: ${_.sum(groups.map(g => _.uniq(g.split('')).length - 1)) + 1}`);
  console.log(`part2: ${_.sum(groups.map(g => _.filter(_.omit(_.countBy(g.split('')), '\n'), x => x === g.split('\n').length).length))}`);
}
run();
