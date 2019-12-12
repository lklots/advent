const _ = require('lodash');
const readInput = require('../../lib/file');

function path(tree, a) {
  const s = [a];
  const p = [];
  while (s.length) {
    const n = s.shift();
    p.push(n);
    const children = tree.get(n);
    if (children) {
      children.map(x => s.push(x));
    }
  }
  return p;
}

function common(tree, a, b) {
  const pathA = path(tree, a);
  const pathB = path(tree, b);
  return _.difference(pathA, pathB).concat(_.difference(pathB, pathA));
}

function bfs(tree) {
  let level = ['COM'];
  let next = [];
  let depth = 1;
  let total = 0;
  while (level.length) {
    next = _.flatMap(level.map(n => tree.get(n) || []));
    total += (depth * next.length);
    level = next.slice();
    depth += 1;
  }
  return total;
}

function add(tree, parent, child) {
  if (!tree.get(parent)) {
    tree.set(parent, []);
  }
  tree.get(parent).push(child);
}

async function run() {
  const input = await readInput('2019/06/');
  const orbits = _.map(input.split('\n'), x => x.split(')'));

  const tree = new Map();
  orbits.forEach(([parent, child]) => {
    add(tree, parent, child);
  });
  console.log(bfs(tree));

  const rtree = new Map();
  orbits.forEach(([parent, child]) => {
    add(rtree, child, parent); // reverse child parent relationship
  });
  console.log(common(rtree, 'YOU', 'SAN').length - 2);
}

run();
