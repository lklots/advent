const _ = require('lodash');
const readInput = require('../../lib/file');

let map;
function neighbors([x, y]) {
  return [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ].filter(([a, b]) => a >= 0 && b >= 0 && map[b] && map[b][a] && map[b][a] !== '#');
}

function moves(node, teleports) {
  const ports = (teleports[key(node)] ? [teleports[key(node)]] : []);
  return ports.concat(neighbors(node).filter(([a, b]) => map[b][a] === '.'));
}

function key([x, y]) {
  return `${x},${y}`;
}

function unkey(s) {
  return s.split(',');
}

function port([x, y]) {
  const char1 = map[y][x];
  const [a, b] = _.head(neighbors([x, y]).filter(([i, j]) => map[j] && map[j][i] && map[j][i].match(/[A-Z]/)));
  const char2 = map[b][a];
  const name = (x < a) ? char1 + char2 : ((y < b) ? char1 + char2 : char2 + char1);
  return {
    loc: _.head(neighbors([x, y]).concat(neighbors([a, b])).filter(([i, j]) => map[j] && map[j][i] && map[j][i] === '.')),
    name,
  };
}

function bfs(start, end, teleports) {
  const q = [start];
  const visited = { [key(start)]: true };
  const depth = { [key(start)]: 0 };
  while (q.length) {
    const step = q.shift();
    const mvs = moves(step, teleports);
    for (let i = 0; i < mvs.length; i += 1) {
      const n = mvs[i];
      if (key(end) === key(step)) {
        return depth[key(step)];
      }

      if (!visited[key(n)]) {
        visited[key(n)] = true;
        depth[key(n)] = depth[key(step)] + 1;
        q.push(n);
      }
    }
  }
  throw new Error('could not find path');
}

function init() {
  const ports = {};
  for (let i = 0; i < map.length; i += 1) {
    for (let j = 0; j < map[2].length + 2; j += 1) {
      if (map[i] && map[i][j] && map[i][j].match(/[A-Z]/)) {
        const { name, loc } = port([j, i]);
        if (!ports[name]) {
          ports[name] = [loc];
        } else if (!_.find(ports[name], ([a, b]) => a === loc[0] && b === loc[1])) {
          ports[name].push(loc);
        }
      }
    }
  }
  const ts = {};
  _.values(ports).forEach((ps) => {
    if (ps.length === 2) {
      const [a, b] = ps;
      ts[key(a)] = b;
      ts[key(b)] = a;
    }
  });
  return {
    start: ports.AA[0],
    end: ports.ZZ[0],
    teleports: ts,
  };
}

async function run() {
  const input = await readInput('2019/20/');
  map = input.split('\n').map(x => x.split(''));
  const { start, end, teleports } = init();
  console.log(bfs(start, end, teleports));
}
run();
