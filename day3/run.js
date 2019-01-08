#!/usr/bin/env node

const util = require('util');
const path = require('path');
const fs = require('fs');
const { allClaims } = require('./map');

const readFile = util.promisify(fs.readFile);

function isOverlapping(map, c) {
  for (let i = c.x; i < c.x + c.width; i += 1) {
    for (let j = c.y; j < c.y + c.height; j += 1) {
      const key = `${i},${j}`;
      if (map.get(key)) {
        return true;
      }
    }
  }

  return false;
}

function findNonOverlapping(map, claims) {
  return claims.find(claim => !isOverlapping(map, claim));
}

async function run() {
  const contents = await readFile(path.join(__dirname, 'input.txt'));
  const map = new Map();
  const claims = [];
  contents.toString().split('\n').forEach((line) => {
    const matched = line.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);
    claims.push({
      id: parseInt(matched[1], 10),
      x: parseInt(matched[2], 10),
      y: parseInt(matched[3], 10),
      width: parseInt(matched[4], 10),
      height: parseInt(matched[5], 10),
    });
  });
  console.log(`number of interescting square inches: ${allClaims(map, claims)}`);

  console.log(`id of non-overlapping claim: ${findNonOverlapping(map, claims).id}`);
}

run();
