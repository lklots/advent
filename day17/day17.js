#!/usr/local/bin/node
// WRONG ANSWER
const readFile = require('../lib/file');

function count(map) {
  let total = 0;
  for (let i = 1; i < map.length; i += 1) {
    for (let j = 0; j < map[i].length; j += 1) {
      if (map[i][j] === '|' || map[i][j] === '~' || map[i][j] === '+') {
        total += 1;
      }
    }
  }
  return total;
}

function print(map, minX) {
  let out = '';
  for (let i = 0; i < map.length; i += 1) {
    if (!map[i]) {
      out += 'xxxxxxxxxxxxxxxx';
    } else {
      for (let j = minX; j < map[i].length; j += 1) {
        if (!map[i][j]) {
          out += '.';
        } else {
          out += map[i][j];
        }
      }
    }
    out += '\n';
  }
  console.log(out);
}

function set(arr, x, y, value) {
  if (!arr[y]) {
    arr[y] = [];
  }
  arr[y][x] = value;
}

function get(arr, x, y) {
  if (!arr[y]) {
    return '.';
  }
  if (!arr[y][x]) {
    return '.';
  }
  return arr[y][x];
}

function isFree(square) {
  return square === '.' || square === '|' || square === '+';
}

function isBlocked(square) {
  return square === '#' || square === '~';
}

function fill(map, x1, x2, y) {
  for (let i = x1; i <= x2; i += 1) {
    set(map, i, y, '~');
  }
}

function fillOrSource(map, start, maxY) {
  let [x1, y] = start;
  while (isFree(get(map, x1 - 1, y)) && isBlocked(get(map, x1, y + 1))) {
    x1 -= 1;
    set(map, x1, y, '|');
  }
  const leftBound = isBlocked(get(map, x1, y + 1));

  let [x2] = start;
  while (isFree(get(map, x2 + 1, y)) && isBlocked(get(map, x2, y + 1))) {
    x2 += 1;
    set(map, x2, y, '|');
  }
  const rightBound = isBlocked(get(map, x2, y + 1));

  if (leftBound && rightBound) {
    fill(map, x1, x2, y);
    return [];
  }

  const sources = [];
  if (!rightBound) {
    sources.push([x2, y]);
  }
  if (!leftBound) {
    sources.push([x1, y]);
  }

  return sources;
}

function drop(map, source, maxY) {
  let [x, y] = source;
  while (get(map, x, y) === '.' || get(map, x, y) === '+' || get(map, x, y) === '|') {
    set(map, x, y, '|');
    y += 1;
    if (y > maxY) {
      return null;
    }
  }
  const sources = fillOrSource(map, [x, y - 1], maxY);
  sources.push(source);
  return sources;
}

function unique(arr) {
  const map = new Map();
  for (let i = 0; i < arr.length; i += 1) {
    const [x, y] = arr[i];
    map.set(`${x},${y}`, [x, y]);
  }
  return new Array(...map.values());
}

function stream(map, sources, maxY) {
  while (sources.length) {
    const source = sources.shift();
    const ret = drop(map, source, maxY);
    if (ret === null) {
      // a stream hit maxY.
      return sources;
    }
    sources = unique(sources.concat(ret));
  }
}

async function run() {
  const lines = (await readFile(__dirname, 'input.txt')).split('\n');

  const map = [];
  const mins = [];
  const maxs = [];
  lines.forEach((line) => {
    const matchY = line.match(/x=(\d+), y=(\d+)\.\.(\d+)/);
    const matchX = line.match(/y=(\d+), x=(\d+)\.\.(\d+)/);
    if (matchY) {
      const [_, x, minY, maxY] = matchY.map(n => parseInt(n, 10));
      mins.push(x);
      maxs.push(maxY);
      for (let i = minY; i <= maxY; i += 1) {
        if (!map[i]) {
          map[i] = [];
        }
        map[i][x] = '#';
      }
    } else if (matchX) {
      const [_, y, minX, maxX] = matchX.map(n => parseInt(n, 10));
      mins.push(minX);
      maxs.push(y);
      if (!map[y]) {
        map[y] = [];
      }
      for (let i = minX; i <= maxX; i += 1) {
        map[y][i] = '#';
      }
    }
  });
  const minX = Math.min(...mins);
  const maxY = Math.max(...maxs);
  if (!map[0]) {
    map[0] = [];
  }
  map[0][500] = '+';
  let origins = stream(map, [[500, 0]], maxY);
  // HACK: keep going for a few more iteration to make sure
  //       everything is filled. ideally, the size of the largest
  //       bucket. 
  for (let i = 0; i < 100; i += 1) {
    origins = stream(map, origins, maxY);
  }
  print(map, minX);
  console.log('\n\n\n\n\n\n\n');
  console.log(count(map));
}

run();