const _ = require('lodash');

const readInput = require('../../lib/file');
const astar = require('../../lib/astar');

function toCoord(key) {
  return key.split(',').map(x => parseInt(x, 10));
}

function toKey(node) {
  return node.join(',');
}

function neighbors([x, y]) {
  return [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];
}
let memo = {};

function gotomem(map, start, end) {
  const memk = start.concat(end).join(',');
  if (memo[memk]) { return memo[memk]; }
  memo[memk] = gotoHelper(map, start, end);
  return memo[memk];
}
function gotoHelper(map, start, end) {
  const q = [start];
  const visited = {};
  const depths = { [toKey(start)]: 0 };
  while (q.length) {
    const node = q.shift();
    if (visited[toKey(node)]) {
      continue;
    }
    visited[toKey(node)] = true;
    if (toKey(node) === toKey(end)) {
      return depths[toKey(node)];
    }
    neighbors(node).forEach((n) => {
      const tile = map[toKey(n)];
      if (tile && tile !== '#') {
        q.push(n);
        depths[toKey(n)] = depths[toKey(node)] + 1;
      }
    });
  }

  return depths[toKey(end)];
}

function reachable(map, start, startKeys) {
  const q = [start];
  const newKeys = [];
  const keys = startKeys.slice();
  const visited = {};

  function add(n) {
    if (!visited[toKey(n)]) {
      q.push(n);
    }
  }

  while (q.length > 0) {
    const node = q.shift();
    visited[toKey(node)] = true;
    neighbors(node).forEach((n) => {
      const tile = map[toKey(n)];
      if (tile === '.' || tile === '@') {
        add(n);
      } else if (tile !== '#') {
        if (_.toLower(tile) === tile) {
          newKeys.push(tile);
        }
        if (_.find(keys, x => x === _.toLower(tile))) {
          add(n);
        }
      }
    });
  }
  return _.uniq(_.difference(newKeys, startKeys));
}

function getCoord(map, key) {
  return toCoord(_.findKey(map, x => x === key));
}

function pathLength(map, path) {
  const [coord] = path.shift();
  if (path.length === 0) {
    return 0;
  }
  return gotomem(map, coord, path[0][0]) + pathLength(map, path);
}

function part1(map) {
  const start = toCoord(_.findKey(map, x => x === '@'));
  const allKeys = _.values(map).filter(k => k.match(/[a-z]/));
  const path = astar([start, []],
    ([, keys]) => (allKeys.length === keys.length ? 0 : 1),
    ([coord, keys]) => reachable(map, coord, keys).map(k => [getCoord(map, k), keys.concat([k]).sort()]),
    ([coord1], [coord2]) => gotomem(map, coord1, coord2),
  );
  console.log(pathLength(map, path));
}

function moves(map, starts, keys) {
  const mvs = [];
  for (let i = 0; i < starts.length; i += 1) {
    const coord = starts[i];
    const ks = reachable(map, coord, keys);
    ks.forEach((k) => {
      mvs.push([
        starts.slice(0, i).concat([getCoord(map, k)]).concat(starts.slice(i + 1, starts.length)),
        keys.concat([k]).sort(),
      ]);
    });
  }
  return mvs;
}

function pathLength2(map, path) {
  const [coords] = path.shift();
  if (path.length === 0) {
    return 0;
  }
  return distance(map, coords, path[0][0]) + pathLength2(map, path);
}

function distance(map, coords1, coords2) {
  return _.zip(coords1, coords2).reduce((total, [coord1, coord2]) => total + gotomem(map, coord1, coord2), 0);
}

function part2(map) {
  const starts = _.toPairs(map).filter(([, v]) => v === '@').map(x => toCoord(x[0]));
  const allKeys = _.values(map).filter(k => k.match(/[a-z]/));
  const path = astar([starts, []],
    ([, keys]) => (allKeys.length === keys.length ? 0 : 1),
    ([coords, keys]) => moves(map, coords, keys),
    ([coords1], [coords2]) => distance(map, coords1, coords2),
  );
  console.log(pathLength2(map, path));
}

async function run() {
  const input = await readInput('2019/18/');
  const tiles = _.map(input.split('\n'), x => x.split(''));
  const map = {};
  tiles.forEach((v, i) => v.forEach((w, j) => map[`${j},${i}`] = w));
  part2(map);
}
run();
