#!/usr/local/bin/node

const readFile = require('../lib/file');

function nearby(map, x, y) {
  let coords = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],

    [x - 1, y],
    [x + 1, y],

    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ];
  coords = coords.filter(coord => coord[0] >= 0 && coord[1] >= 0 && coord[1] < map.length && coord[0] < map[0].length);
  const ret = {
    trees: 0,
    lumber: 0,
    open: 0,
  };

  for (let i = 0; i < coords.length; i += 1) {
    const [x1, y1] = coords[i];
    switch (map[y1][x1]) {
      case '#':
        ret.lumber += 1;
        break;
      case '|':
        ret.trees += 1;
        break;
      case '.':
        ret.open += 1;
        break;
      default:
        console.error(map);
        throw Error(`uknown type ${x1},${y1}: ${map[y1][x1]}`);
    }
  }
  return ret;
}

function change(current, counts) {
  switch (current) {
    case '#':
      if (counts.lumber >= 1 && counts.trees >= 1) {
        return '#';
      }
      return '.';
    case '|':
      if (counts.lumber >= 3) {
        return '#';
      }
      return '|';
    case '.':
      if (counts.trees >= 3) {
        return '|';
      }
      return '.';
    default:
      throw Error(`unknown type ${current}`);
  }
}

function tick(map) {
  const newMap = map.map(x => x.slice()).slice();
  for (let i = 0; i < newMap.length; i += 1) {
    for (let j = 0; j < newMap[0].length; j += 1) {
      const counts = nearby(map, j, i);
      newMap[i][j] = change(map[i][j], counts);
    }
  }

  return newMap;
}

function total(map) {
  const counts = {
    lumber: 0,
    trees: 0,
  };

  for (let i = 0; i < map.length; i += 1) {
    for (let j = 0; j < map[0].length; j += 1) {
      if (map[i][j] === '|') {
        counts.trees += 1;
      } else if (map[i][j] === '#') {
        counts.lumber += 1;
      }
    }
  }
  return counts;
}

// repeats every 28 generations
async function run() {
  let sample = 0;
  let map = (await readFile(__dirname, 'input.txt')).split('\n').map(x => x.split('')).filter(x => x.length);
  let generations = {};
  for (let i = 0; i < 2000; i += 1) {
    sample += 1;
    map = tick(map);
    const counts = total(map);
    generations[i] = counts.trees * counts.lumber;
    console.log(`${i+1},${counts.trees * counts.lumber}`);
  }
  console.log(`part 1: lumber * trees = ${generations[9]}`);

  const STEP = 1000000000;
  const generation = (STEP - 1 - 1000) % 28;
  console.log(`part2: generation ${STEP}: ${generations[1000 + generation]}`);
}

run();
