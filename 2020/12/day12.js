const _ = require('lodash');
const math = require('mathjs');
const readInput = require('../../lib/file');

function step([dir, pos], [action, num]) {
  switch (action) {
    case 'N':
      return [dir, math.add(pos, math.complex(0, num))];
    case 'S':
      return [dir, math.subtract(pos, math.complex(0, num))];
    case 'W':
      return [dir, math.subtract(pos, num)];
    case 'E':
      return [dir, math.add(pos, num)];
    case 'L':
      return [math.multiply(dir, math.pow(math.complex(0, 1), num / 90)), pos];
    case 'R':
      return [math.multiply(dir, math.pow(math.complex(0, -1), num / 90)), pos];
    case 'F':
      return [dir, math.add(pos, math.multiply(dir, num))];
    default:
      return null;
  }
}

function stepway([pos, way], [action, num]) {
  switch (action) {
    case 'N':
      return [pos, math.add(way, math.complex(0, num))];
    case 'S':
      return [pos, math.subtract(way, math.complex(0, num))];
    case 'W':
      return [pos, math.subtract(way, num)];
    case 'E':
      return [pos, math.add(way, num)];
    case 'L':
      return [pos, math.multiply(way, math.pow(math.complex(0, 1), num / 90)), pos];
    case 'R':
      return [pos, math.multiply(way, math.pow(math.complex(0, -1), num / 90)), pos];
    case 'F':
      return [math.add(pos, math.multiply(num, way)), way];
    default:
      return null;
  }
}


async function run() {
  const input = await readInput('2020/12');
  const insts = input.split('\n').map(i => [i[0], parseInt(i.slice(1), 10)]);
  const start = [math.complex(1, 0), math.complex(0, 0)];
  const [, endPos] = insts.reduce((ship, inst) => step(ship, inst), start);
  console.log(`part1: ${math.abs(endPos.re) + math.abs(endPos.im)}`);

  const waystart = [math.complex(0, 0), math.complex(10, 1)];
  const [endWayPos] = insts.reduce((ship, inst) => stepway(ship, inst), waystart);
  console.log(`part2: ${math.abs(endWayPos.re) + math.abs(endWayPos.im)}`);
}
run();
