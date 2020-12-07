const _ = require('lodash');
const readInput = require('../../lib/file');

const validators = {
  byr: x => parseInt(x, 10) >= 1920 && parseInt(x, 10) <= 2002,
  iyr: x => parseInt(x, 10) >= 2010 && parseInt(x, 10) <= 2020,
  eyr: x => parseInt(x, 10) >= 2020 && parseInt(x, 10) <= 2030,
  hcl: x => /#([0-9a-f]){6}/.test(x),
  ecl: x => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(x),
  pid: x => /[0-9]{9}/.test(x),
  hgt: x => (_.endsWith(x, 'cm') && parseInt(x, 10) >= 150 && parseInt(x, 10) <= 193)
    || (_.endsWith(x, 'in') && parseInt(x, 10) >= 59 && parseInt(x, 10) <= 76),
};

function validKeys(record) {
  return _.every(_.keys(validators), _.partial(_.has, record));
}

function validValues(record) {
  return validKeys(record) && _.every(_.map(validators, (fun, k) => fun(record[k])));
}

async function run() {
  const input = await readInput('2020/04');
  const groups = input.split(/\n\n/);
  const matches = groups.map(g => g.matchAll(/([a-z]+:\S+)+/g));
  const records = matches.map(m => _.fromPairs(Array.from(m).map(x => x[0].split(':'))));
  console.log(`part1: ${records.filter(validKeys).length}`);
  console.log(`part2: ${records.filter(validValues).length}`);
}
run();
