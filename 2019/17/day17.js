const _ = require('lodash');

const readInput = require('../../lib/file');
const Intcode = require('../../lib/intcode');

function neighbors([x, y]) {
  return [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];
}

function print(map, coord) {
  const board = _.range(70).map(() => _.range(70).map(() => ' '));
  _.map(map, (v, k) => {
    const [x, y] = k.split(',');
    board[y][x] = String.fromCharCode(v);
  });
  console.log(board.map(x => x.join('')).join('\n'));
}

function parse(comp) {
  const map = {};
  let ret;
  let x = 0;
  let y = 0;
  do {
    ret = comp.exec();
    if (ret === 10) {
      x = 0;
      y += 1;
    } else {
      map[`${x},${y}`] = ret;
      x += 1;
    }
  } while (ret !== null);
  return map;
}

async function run() {
  const input = await readInput('2019/17/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  const comp = new Intcode(registers);
  const map = parse(comp);
  const inters = _.keys(map).map((key) => {
    const [x, y] = key.split(',').map(k => parseInt(k, 10));
    if (_.every(neighbors([x, y]).map(coord => map[coord.join(',')] === 35))) {
      return x * y;
    }
    return 0;
  })

  console.log(_.sum(inters));
}

run();
