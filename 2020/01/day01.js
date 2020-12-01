const _ = require('lodash');
const readInput = require('../../lib/file');

function find2 (nums) {
  for (let i = 0; i < nums.length - 1; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      if (nums[i] + nums[j] === 2020) {
        return [nums[i], nums[j]];
      }
    }
  }
}

function find3 (nums) {
  for (let i = 0; i < nums.length - 2; i += 1) {
    for (let j = i + 1; j < nums.length - 1; j += 1) {
      for (let k = i + 2; k < nums.length; k += 1) {
        if (nums[i] + nums[j] + nums[k] === 2020) {
          return [nums[i], nums[j], nums[k]];
        }
      }
    }
  }
}

async function run() {
  const input = await readInput('2020/01');
  const nums = input.split('\n').map(x => parseInt(x, 10));
  const [x, y] = find2(nums);
  console.log(`part1: ${x * y}`);
  console.log(`part2: ${find3(nums).reduce((a, b) => a * b)}`);
}
run();
