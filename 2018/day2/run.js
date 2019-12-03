#!/usr/bin/env node

const util = require('util');
const path = require('path');
const fs = require('fs');
const { checksum } = require('./checksum');
const { common } = require('./common');

const readFile = util.promisify(fs.readFile);

async function run() {
  const contents = await readFile(path.join(__dirname, 'input.txt'));
  console.log(checksum(contents.toString().split('\n')));

  const contents2 = await readFile(path.join(__dirname, 'input2.txt'));
  console.log(common(contents2.toString().split('\n')));
}

run();
