#!/usr/bin/env node

const util = require('util');
const path = require('path');
const fs = require('fs');
const { allClaims } = require('./map');

const readFile = util.promisify(fs.readFile);

async function run() {
  const contents = await readFile(path.join(__dirname, 'input.txt'));
  const claims = [];
  contents.toString().split('\n').forEach((line) => {
    const matched = line.match(/#\d+ @ (\d+),(\d+): (\d+)x(\d+)/);
    claims.push({
      x: parseInt(matched[1], 10),
      y: parseInt(matched[2], 10),
      width: parseInt(matched[3], 10),
      height: parseInt(matched[4], 10),
    });
  });
  console.log(claims);
  console.log(allClaims(claims));
}

run();
