#!/usr/bin/env node

const util = require('util');
const path = require('path');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

function combust(str) {
  const stack = [];
  for (let i = 0; i < str.length; i += 1) {
    if (!stack.length) {
      stack.push(str[i]);
    } else if (Math.abs(stack[stack.length - 1].charCodeAt(0) - str.charCodeAt(i)) === 32) {
      stack.pop();
    } else {
      stack.push(str[i]);
    }
  }

  console.log(stack.length);
}

async function run() {
  const contents = await readFile(path.join(__dirname, 'input.txt'));
  combust(contents.toString());
}

run();
