const _ = require('lodash');

const readInput = require('../../lib/file');
const Intcode = require('../../lib/intcode');

function neighbors([x, y]) {
  return [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y]
  ];
}

function opposite(dir) {
  switch (dir) {
    case 1: return 2;
    case 2: return 1;
    case 3: return 4;
    case 4: return 3;
    default:
      throw new Error('unknown');
  }
}

function step([x, y], dir) {
  switch (dir) {
    case 1: return [x, y - 1];
    case 2: return [x, y + 1];
    case 3: return [x - 1, y];
    case 4: return [x + 1, y];
    default:
      throw new Error('unknown');
  }
}

function explore(comp, coord, map) {
  _.range(1, 5).forEach((dir) => {
    if (!_.has(map, step(coord, dir).join(','))) {
      comp.in(dir);
      const code = comp.exec();
      map[step(coord, dir).join(',')] = code;
      if (code !== 0) {
        explore(comp, step(coord, dir), map);
        comp.in(opposite(dir));
        comp.exec();
      }
    }
  });
  return map;
}

function tile(v) {
  switch(v) {
    case 0: return '#';
    case 1: return '.';
    case 2: return 'x';
    default: throw new Error('eee');
  }
}

function print(map, coord) {
  const board = _.range(70).map(() => _.range(70).map(() => ' '));
  _.map(map, (v, k) => {
    const [x, y] = k.split(',');
    board[y][x] = tile(v);
  });
  console.log(board.map(x => x.join('')).join('\n'));
}

function depths(map, start) {
  const visited = { [start.join(',')]: true };
  const depth = { [start.join(',')]: 0 };
  const q = [start];
  while (q.length) {
    const coord = q.shift();
    neighbors(coord).forEach((next) => {
      if (!visited[next.join(',')] && map[next.join(',')] !== 0) {
        q.push(next);
        depth[next.join(',')] = depth[coord.join(',')] + 1;
        visited[next.join(',')] = true;
      }
    });
  }
  return depth;
}

async function run() {
  const input = await readInput('2019/15/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  const comp = new Intcode(registers);
  const map = { '50,50': 1 };
  explore(comp, [50, 50], map);
  const tank = _.findKey(map, v => v === 2).split(',').map(x => parseInt(x, 10));
  console.log(depths(map, [50, 50])[tank.join(',')]);
  console.log(_.max(_.values(depths(map, tank))));
}

run();
