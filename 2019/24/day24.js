const _ = require('lodash');
const readInput = require('../../lib/file');

function neighbors([x, y]) {
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
}

function fromkey(s) {
  return s.split(',').map(x => parseInt(x, 10));
}
function tokey([x, y]) {
  return `${x},${y}`;
}

function minute(grid) {
  const newGrid = _.clone(grid);
  _.map(grid, (v, k) => {
    const coord = fromkey(k);
    const bugs = neighbors(coord).filter(n => grid[tokey(n)] && grid[tokey(n)] === '#').length;
    if (v === '#') {
      newGrid[k] = (bugs === 1) ? '#' : '.';
    } else {
      newGrid[k] = (bugs === 1 || bugs === 2) ? '#' : '.';
    }
  });
  return newGrid;
}

function bio(grid) {
  return _.sum(
    _.range(5).map(i => _.sum(_.range(5).map(j => (grid[tokey([i, j])] === '#') ? 2 ** (5 * i + j) : 0))));
}

async function run() {
  const input = (await readInput('2019/24/')).split('\n').map(x => x.split(''));
  let grid = {};
  input.forEach((x, i) => x.forEach((v, j) => {
    grid[tokey([i, j])] = v;
  }));
  const bios = {};
  while (true) {
    if (bios[bio(grid)]) {
      console.log(bio(grid));
      return bio(grid);
    }
    bios[bio(grid)] = true;
    grid = minute(grid);
  }
}

run();
