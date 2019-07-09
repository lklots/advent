#!/usr/local/bin/node

const readFile = require('../lib/file');

/*function matchGroup(map, starts, group) {
  const branches = group.split('|');
  let stack = starts.slice();
  while (stack.length) {
    const start = stack.shift();

  }
  const [x, y] = start;
  return [[x, y], [x, y]];
}*/

function get(map, x, y) {
  if (!map[y]) {
    map[y] = [];
    return map[y][x];
  }
  return map[y][x];
}

function set(map, x, y, value) {
  if (!map[y]) {
    map[y] = [];
  }
  map[y][x] = value;
}

function matchDir(map, start, dir) {
  let [x, y] = start;
  const door = {};
  door[dir] = true;
  set(map, x, y, Object.assign({}, get(map, x, y), door));
  switch (dir) {
    case 'N':
      y -= 1;
      break;
    case 'S':
      y += 1;
      break;
    case 'W':
      x -= 1;
      break;
    case 'E':
      x += 1;
      break;
    default:
      throw Error(`uknown direction ${dir}`);
  }

  return [x, y];
}

function isDir(char) {
  return char === 'N' || char === 'S' || char === 'W' || char === 'E';
}

function 

async function run() {
  const regex = (await readFile(__dirname, 'input4.txt')).split('');
  const map = [[]]; // abusing this with negative indexes
  regex.shift();
  const stack = [regex.shift()];
  let [x, y] = [0, 0];
  while (stack.length) {
    const char = stack.shift();
    if (isDir(char)) {
      [x, y] = matchDir(map, [x, y], char);
      stack.push(regex.shift());
    }
  }
  console.log(map);
}

run();
