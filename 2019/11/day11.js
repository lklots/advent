const _ = require('lodash');
const readInput = require('../../lib/file');
const Intcode = require('../../lib/intcode');

let map = new Map();

function paint(x, y, color) {
  const current = map.get(`${x},${y}`) || 0;
  map.set(`${x},${y}`, color);
  // eslint-disable-next-line no-bitwise
  return (current ^ color);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function step(x, y, dir, rotate) {
  if (rotate) {
    dir = (dir + 1) % 4;
  } else {
    dir = mod(dir - 1, 4);
  }
  switch (dir) {
    case 0: return [x, y - 1, dir];
    case 1: return [x + 1, y, dir];
    case 2: return [x, y + 1, dir];
    case 3: return [x - 1, y, dir];
    default: throw new Error(`unknown ${dir}`);
  }
}

function go(comp) {
  let x = 5;
  let y = 5;
  let dir = 0;
  let ret = null;
  const changes = new Map();
  while (true) {
    ret = comp.exec();
    if (ret === null) {
      break;
    }
    if (paint(x, y, ret)) {
      changes.set(`${x},${y}`, true);
    }
    [x, y, dir] = step(x, y, dir, comp.exec());
    comp.in(map.get(`${x},${y}`) || 0);
  }
  return changes;
}

function print() {
  const board = _.range(20).map(() => _.range(50).map(() => '.'));
  map.forEach((v, k) => {
    const [x, y] = k.split(',');
    if (v) {
      board[y][x] = '#';
    }
  });
  console.log(board.map(x => x.join('')).join('\n'));
}

async function run() {
  const input = await readInput('2019/11/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  const comp = new Intcode(registers);
  comp.in(0);
  let changes = go(comp);
  console.log(changes.size);
  map = new Map();
  const comp2 = new Intcode(registers);
  comp2.in(1);
  changes = go(comp2);
  print(changes);
}

run();
