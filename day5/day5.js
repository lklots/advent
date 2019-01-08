#!/usr/bin/env node

const util = require('util');
const path = require('path');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

function combustButIgnore(str, ignoreChars) {
  const stack = [];
  for (let i = 0; i < str.length; i += 1) {
    if (!(ignoreChars.includes(str[i]))) {
      if (!stack.length) {
        stack.push(str[i]);
      } else if (Math.abs(stack[stack.length - 1].charCodeAt(0) - str.charCodeAt(i)) === 32) {
        stack.pop();
      } else {
        stack.push(str[i]);
      }
    }
  }

  return stack.length;
}

async function run() {
  const contents = await readFile(path.join(__dirname, 'input.txt'));
  console.log(`comubsted squence length is: ${combustButIgnore(contents.toString(), [])}`);

  const lengths = [];
  for (let i = 65; i < 65 + 26; i += 1) {
    const ignore = [String.fromCharCode(i), String.fromCharCode(i + 32)];
    const length = combustButIgnore(contents.toString(), ignore);
    console.log(`${ignore}: ${length}`);
    lengths.push(length);
  }

  console.log(`min length: ${Math.min(...lengths)}`);
}

run();
