#!/usr/local/bin/node

const readFile = require('../lib/file');

function advance(map, steps) {
  const newMap = new Map();
  map.forEach((value, key) => {
    const [x, y] = key;
    const [vx, vy] = value;
    newMap.set([x + (vx * steps), y + (vy * steps)], [vx, vy]);
  });
  return newMap;
}

function printMap(map) {
  const minX = 100;
  const maxX = 300;
  const minY = 100;
  const maxY = 125;
  const printArr = [];
  for (let i = minY; i < maxY; i += 1) {
    printArr[i] = [];
    for (let j = minX; j < maxX; j += 1) {
      printArr[i][j] = '.';
    }
  }
  let skipped = 0;
  map.forEach((value, key) => {
    const [x, y] = key;
    if (x < maxX && x >= minX && y < maxY && y >= minY) {
      printArr[y][x] = '#';
    } else {
      skipped += 1;
    }
  });
  printArr.forEach(arr => console.log(`${arr.join('')}`));
  console.log(`skipped: ${skipped}`);
}

async function run() {
  const map = new Map();
  (await readFile(__dirname)).split('\n').forEach((line) => {
    const matches = line.match(/position=< ?(-?\d+),  ?(-?\d+)> velocity=< ?(-?\d),[ ]*(-?\d)>/);
    if (matches) {
      let [_, x, y, vx, vy] = matches;
      x = parseInt(x, 10);
      y = parseInt(y, 10);
      vx = parseInt(vx, 10);
      vy = parseInt(vy, 10);
      map.set([x, y], [vx, vy]);
    } else {
      console.log(line);
    }
  });
  printMap(advance(map, 10886));
}

run();
