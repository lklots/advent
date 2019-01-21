#!/usr/local/bin/node

const getInput = require('../lib/file');

function last(arr) {
  return arr[arr.length - 1];
}

function toInt(arr) {
  return arr.map(x => parseInt(x, 10));
}

async function run() {
  let input = (await getInput(__dirname)).split(' ');
  input = toInt(input);
  let total = 0;
  const stack = [
    [input.shift(), input.shift()],
  ];
  while (stack.length > 0) {
    if (last(stack)[0] === 0) {
      const [_, numHeaders] = stack.pop();
      for (let i = 0; i < numHeaders; i += 1) {
        total += input.shift();
      }
      if (stack.length > 0) {
        last(stack)[0] -= 1;
      }
    } else {
      stack.push([input.shift(), input.shift()]);
    }
  }

  console.log(total);
}

run();
