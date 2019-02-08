#!/usr/local/bin/node

const readFile = require('../lib/file');

function mdist(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function minIndexes(arr) {
  let minIdxs = [];
  let minValue = null;
  for (let i = 0; i < arr.length; i += 1) {
    if (minValue === null || arr[i] < minValue) {
      minValue = arr[i];
      minIdxs = [i];
    } else if (arr[i] === minValue) {
      minIdxs.push(i);
    }
  }
  return minIdxs;
}

function distanceToCoords(x, y, coords) {
  let total = 0;
  for (let i = 0; i < coords.length; i += 1) {
    const coord = coords[i];
    total += mdist(x, y, coord[0], coord[1]);
  }
  return total;
}

function closestCoord(x, y, coords) {
  const distances = [];
  for (let i = 0; i < coords.length; i += 1) {
    const coord = coords[i];
    distances[i] = mdist(x, y, coord[0], coord[1]);
  }

  const indexes = minIndexes(distances);
  if (indexes.length > 1) {
    return '.';
  }
  return indexes[0];
}

function area(coord, map, minX, maxX, minY, maxY) {
  const visited = new Map();
  let queue = [coord];
  const name = map[coord[1]][coord[0]];
  let areaC = 0;
  while (queue.length) {
    const [x, y] = queue.shift();
    if (x === minX || x === maxX || y === minY || y === maxY) {
      return Infinity;
    }
    visited.set(`${x},${y}`, true);
    if (map[y][x] === name) {
      areaC += 1;
    }
    let nearby = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    queue = queue.concat(nearby);
    queue = queue.filter(p => p[0] >= minX && p[0] <= maxX && p[1] >= minY && p[1] <= maxY);
    queue = queue.filter(p => map[p[1]][p[0]] === name);
    queue = queue.filter(p => !visited.has(`${p[0]},${p[1]}`));
  }
  return areaC;
}

function print(map) {
  console.log(map.map(x => x.join(' ')).join('\n'));
}

async function run() {
  const lines = (await readFile(__dirname, 'input.txt')).split('\n');
  const coords = [];
  lines.forEach((coord) => {
    if (coord) {
      coords.push(coord.split(',').map(x => parseInt(x, 10)));
    }
  });
  coords.sort((a, b) => (a[1] * 1000 + a[0]) - (b[1] * 1000 - b[0]));

  const minX = Math.min(...coords.map(x => x[0]));
  const maxX = Math.max(...coords.map(x => x[0]));
  const minY = Math.min(...coords.map(y => y[1]));
  const maxY = Math.max(...coords.map(y => y[1]));
  let map = [];
  for (let i = minY; i <= maxY; i += 1) {
    map[i] = [];
    for (let j = minX; j <= maxX; j += 1) {
      map[i][j] = closestCoord(j, i, coords);
    }
  }

  const areas = coords.map(coord => area(coord, map, minX, maxX, minY, maxY));
  console.log(`part 1: ${Math.max(...areas.filter(x => x < Infinity))}`);

  let total = 0;
  for (let i = minY; i <= maxY; i += 1) {
    map[i] = [];
    for (let j = minX; j <= maxX; j += 1) {
      const dist = distanceToCoords(j, i, coords);
      if (dist < 10000) {
        total += 1;
      }
    }
  }
  console.log(`part 2: ${total}`);
}

run();
