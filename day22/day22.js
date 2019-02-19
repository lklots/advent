#!/usr/local/bin/node

const _ = require('lodash');

const astar = require('../lib/astar');

const DEPTH = 6969;
const TARGET = [9, 796];

function erosion(map, x, y) {
  const index = map[y][x];
  if (index === null) {
    throw Error(`missing value at ${x},${y}`);
  }
  return (index + DEPTH) % 20183;
}

function type(map, x, y) {
  const t = erosion(map, x, y) % 3;
  switch (t) {
    case 0: return '.';
    case 1: return '=';
    case 2: return '|';
    default: throw Error(`impossible: ${t}`);
  }
}

function print(map) {
  let out = '';
  for (let i = 0; i < map.length; i += 1) {
    for (let j = 0; j < map[0].length; j += 1) {
      if (i === TARGET[1] && j === TARGET[0]) {
        out += 'T';
      } else if (map[i][j] !== null) {
        out += type(map, j, i);
      } else {
        out += '?';
      }
    }
    out += '\n';
  }
  console.log(out);
}

function gindex(map, x, y) {
  if ((x === 0 && y === 0) || (x === TARGET[0] && y === TARGET[1])) {
    return 0;
  }
  if (y === 0) {
    return x * 16807;
  }
  if (x === 0) {
    return y * 48271;
  }
  return erosion(map, x - 1, y) * erosion(map, x, y - 1);
}

function round(map, x, y) {
  for (let i = x; i < map[0].length; i += 1) {
    map[y][i] = gindex(map, i, y);
  }
  for (let i = y; i < map.length; i += 1) {
    map[i][x] = gindex(map, x, i);
  }
}

const GEAR = 'gear';
const TORCH = 'torch';
const NEITHER = 'neither';
const TOOL_MAPPING = {
  '.': [GEAR, TORCH],
  '=': [GEAR, NEITHER],
  '|': [TORCH, NEITHER],
};
const TOOLS = [GEAR, TORCH, NEITHER];

function neighbors4(x, y) {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ];
}

function mdist(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}


function hFunc(goal, state) {
  const { coord: [x, y], equip } = state;
  const h = mdist(x, y, goal[0], goal[1]);
  if (equip) {
    return h + 7;
  }
  return h;
}

function moves(map, goal, state) {
  const { equiped, coord: [sx, sy] } = state;
  const [gx, gy] = goal;
  const otherTool = TOOL_MAPPING[type(map, sx, sy)].filter(x => x !== equiped);
  return _.flatten(neighbors4(sx, sy).map(([x, y]) => {
    if (x < 0 || y < 0) {
      return [];
    }
    if (gx === x && gy === y && equiped === GEAR) {
      return [];
    }
    const region = type(map, x, y);
    const okTools = TOOL_MAPPING[region];
    if (equiped === okTools[0] || equiped === okTools[1]) {
      return [{
        coord: [x, y],
        equiped,
      }];
    }
    return [];
  }).concat([{
    coord: [sx, sy],
    equip: otherTool[0],
    equiped: otherTool[0],
  }]));
}

function cost(path) {
  return path.map(state => (state.equip ? 7 : 1)).reduce((p, v) => v + p, 0);
}

function run() {
  const [tx, ty] = TARGET;
  const map = [];
  for (let i = 0; i <= ty + 200; i += 1) {
    map[i] = [];
    for (let j = 0; j <= tx + 200; j += 1) {
      map[i][j] = null;
    }
  }
  map[0][0] = gindex(map, 0, 0);
  map[ty][tx] = gindex(map, tx, ty);

  for (let i = 0; i <= Math.min(tx, ty) + 200; i += 1) {
    round(map, i, i);
  }

  let total = 0;
  for (let i = 0; i < ty; i += 1) {
    for (let j = 0; j < tx; j += 1) {
      total += erosion(map, j, i) % 3;
    }
  }
  console.log(`part1: ${total}`);
  const path = astar({
    coord: [0, 0],
    equiped: TORCH,
  }, state => hFunc(TARGET, state), state => moves(map, TARGET, state));
  console.log(`part2: ${cost(path) - 1}`);
}

run();
