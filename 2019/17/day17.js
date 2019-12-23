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

function video(comp) {
  let ret;
  let line = [];
  do {
    ret = comp.exec();
    if (ret < 0 || ret > 125) {
      return ret;
    }

  } while (ret !== null);
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

function line(comp, l) {
  _.map(l, (_x, i) => comp.in(l.charCodeAt(i)));
  comp.in(10);
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
  });
  console.log(_.sum(inters));

  registers[0] = 2;
  const comp2 = new Intcode(registers);
  line(comp2, ['A', 'C', 'A', 'C', 'B', 'B', 'C', 'A', 'C', 'B'].join(',')); // main
  line(comp2, ['L', 12, 'L', 10, 'R', 8, 'L', 12].join(','));
  line(comp2, ['L', 10, 'R', 12, 'R', 8].join(','));
  line(comp2, ['R', 8, 'R', 10, 'R', 12].join(','));
  line(comp2, 'y');
  console.log(video(comp2));
}

run();
