#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');

const aggFreqs = require('./aggFreqs');
const repeatFreqs = require('./repeatFreqs');

const readFile = util.promisify(fs.readFile);

async function run() {
  const file = await readFile(path.join(__dirname, 'input.txt'));
  const freqs = file.toString().split('\n');
  const total = aggFreqs(freqs);
  console.log(total);

  const file2 = await readFile(path.join(__dirname, 'input2.txt'));
  const freqs2 = file2.toString().split('\n');
  const repeating = repeatFreqs(freqs2);
  console.log(repeating);
}

run();
