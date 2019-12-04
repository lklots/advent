const _ = require('lodash');

const MIN = 145852;
const MAX = 616942;

function repeat(str) {
  let stack = [];
  for (let i = 0; i < str.length; i += 1) {
    if (stack[stack.length - 1] === str[i]) {
      stack.push(str[i]);
      continue;
    }
    if (stack.length === 2) {
      return true;
    }
    stack = [str[i]];
  }
  return stack.length === 2;
}

function increase(str) {
  let last = 0;
  for (let i = 0; i < str.length; i += 1) {
    if (str.charCodeAt(i) < last) {
      return false;
    }
    last = str.charCodeAt(i);
  }
  return true;
}

function validate(num) {
  const str = `${num}`;
  return repeat(str) && increase(str);
}

async function run() {
  console.log(_.range(MIN, MAX).map(x => validate(x)).filter(x => x).length);
}

run();
