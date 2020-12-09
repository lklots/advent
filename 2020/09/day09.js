const _ = require('lodash');
const readInput = require('../../lib/file');

function addsUp(nums, total) {
  return _.some(_.fromPairs(nums.map(n => [n, total - n])), (v, k, obj) => _.has(obj, v));
}

function invalid(nums, window) {
  return _.find(nums.slice(window, nums.length), (n, i) => !addsUp(nums.slice(i, i + window), n));
}

function range(nums, total) {
  let i = 0;
  let j = 0;
  while (_.sum(nums.slice(i, j)) !== total) {
    if (_.sum(nums.slice(i, j)) > total) {
      i += 1;
    } else {
      j += 1;
    }
  }

  return nums[i] + nums[j];
}

async function run() {
  const lines = await readInput('2020/09');
  const nums = lines.split('\n').map(x => parseInt(x, 10));
  console.log(`part1: ${invalid(nums, 25)}`);
  console.log(`part2: ${range(nums, 41682220)}`);
}
run();
