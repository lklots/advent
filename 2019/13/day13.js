const _ = require('lodash');

const readInput = require('../../lib/file');
const Intcode = require('../../lib/intcode');

function tile(t) {
  switch (t) {
    case 0: return '.';
    case 1: return '#';
    case 2: return '%';
    case 3: return '=';
    case 4: return 'o';
    default: throw new Error(`unknown ${t}`);
  }
}

function print(map) {
  const board = _.range(30).map(() => _.range(50).map(() => ' '));
  _.map(map, (v, k) => {
    const [x, y] = k.split(',');
    board[y][x] = tile(v);
  });
  console.log(board.map(x => x.join('')).join('\n'));
}


function part1(registers) {
  const comp = new Intcode(registers);
  const map = {};
  while (true) {
    const [x, y, t] = [comp.exec(), comp.exec(), comp.exec()];
    if (x === null) {
      console.log(_.values(map).filter(v => v === 2).length);
      break;
    }
    map[`${x},${y}`] = t;
  }
}

async function part2(registers) {
  const map = {};
  registers[0] = 2;
  const comp = new Intcode(registers);
  let score = null;
  let paddlex = 0;
  let ballx = 0;
  while (true) {
    const [x, y, t] = [comp.exec(), comp.exec(), comp.exec()];
    if (x === null) {
      break;
    } else if (x === -1) {
      score = t;
    } else {
      map[`${x},${y}`] = t;
    }
    if (t === 4) {
      ballx = x;
    } else if (t === 3) {
      paddlex = x;
    }
    if (score !== null) {
      if (t === 4) {
        comp.in(ballx - paddlex);
      }
    }
  }
  console.log(score);
}

async function run() {
  const input = await readInput('2019/13/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  part1(registers);
  part2(registers);
}

run();
