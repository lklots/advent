#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');

const aggFreqs = require('./aggFreqs');

const readFile = util.promisify(fs.readFile);

async function run() {
  const file = await readFile(path.join(__dirname, 'input.txt'));
  const freqs = file.toString().split('\n');
  const total = aggFreqs(freqs);
  console.log(total);
}

run();
