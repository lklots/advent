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

function innerNeighbor(level, x, y) {
  const top = _.range(5).map(i => [level + 1, i, 0]);
  const bottom = _.range(5).map(i => [level + 1, i, 4]);
  const left = _.range(5).map(i => [level + 1, 0, i]);
  const right = _.range(5).map(i => [level + 1, 4, i]);
  if (x === 2 && y === 1) {
    return top;
  }
  if (x === 2 && y === 3) {
    return bottom;
  }
  if (x === 1 && y === 2) {
    return left;
  }
  if (x === 3 && y === 2) {
    return right;
  }
}

function rneighbors([level, a, b]) {
  return _.flatMap(neighbors([a, b]).map(([x, y]) => {
    let ns = [];
    if (y === -1) {
      ns.push([level - 1, 2, 1]);
    } else if (y === 5) {
      ns.push([level - 1, 2, 3]);
    }

    if (x === -1) {
      ns.push([level - 1, 1, 2]);
    } else if (x === 5) {
      ns.push([level - 1, 3, 2]);
    }

    if (x === 2 && y === 2) {
      ns = ns.concat(innerNeighbor(level, a, b));
    } else if (x >= 0 && x <= 4 && y >= 0 && y <= 4) {
      ns.push([level, x, y]);
    }
    return ns;
  }));
}


function fromkey(s) {
  return s.split(',').map(x => parseInt(x, 10));
}
function tokey(node) {
  return node.join(',');
}

function minute(grid, neighborsFunc) {
  const newGrid = _.clone(grid);
  _.map(grid, (v, k) => {
    const coord = fromkey(k);
    const bugs = neighborsFunc(coord).filter(n => grid[tokey(n)] && grid[tokey(n)] === '#').length;
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

function findRepeat(grid) {
  const bios = {};
  while (true) {
    if (bios[bio(grid)]) {
      return bio(grid);
    }
    bios[bio(grid)] = true;
    grid = minute(grid, neighbors);
  }
}

async function run() {
  const input = (await readInput('2019/24/')).split('\n').map(x => x.split(''));
  const grid = {};
  input.forEach((x, i) => x.forEach((v, j) => {
    grid[tokey([i, j])] = v;
  }));
  console.log(findRepeat(grid));

  const ITERATIONS = 200;
  let rgrid = {};
  input.forEach((x, i) => x.forEach((v, j) => {
    if (!(i === 2 && j === 2)) {
      rgrid[tokey([0, i, j])] = v;
      _.range(1, ITERATIONS).forEach((n) => {
        rgrid[tokey([n, i, j])] = '.';
        rgrid[tokey([-n, i, j])] = '.';
      });
    }
  }));

  _.range(ITERATIONS).forEach(() => {
    rgrid = minute(rgrid, rneighbors);
  });
  console.log(_.values(rgrid).filter(x => x === '#').length);
}

run();
