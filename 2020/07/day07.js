const _ = require('lodash');
const readInput = require('../../lib/file');

function count(tree, root) {
  if (!_.has(tree, root)) {
    throw new Error(`could not find ${root} in ${tree}`);
  }

  if (_.isEmpty(tree[root])) {
    return 0;
  }

  return _.sum(_.map(tree[root], (num, bag) => num + num * count(tree, bag)));
}

function dfs(tree, root) {
  let visited = [];
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    if (tree[n]) {
      visited = _.uniq(visited.concat(tree[n]));
      tree[n].forEach(x => stack.push(x));
    }
  }
  return visited.length;
}

async function run() {
  const lines = await readInput('2020/06');
  const table = lines.split('\n').reduce((acc, l) => {
    const [src, desc] = l.split('bags contain');
    if (desc.includes('no other bags')) {
      acc[src.trim()] = {};
    } else {
      const matches = desc.matchAll(/(\d)\s(\b[a-z]+\s[a-z]+)\sbags?/g);
      acc[src.trim()] = _.fromPairs(Array.from(matches).map(m => [m[2], parseInt(m[1], 10)]));
    }
    return acc;
  }, {});

  const contains = _.reduce(table, (acc, bags, container) => {
    _.forEach(bags, (_, b) => (acc[b] ? acc[b].push(container) : acc[b] = [container]));
    return acc;
  }, {});
  console.log(`part1: ${dfs(contains, 'shiny gold')}`);
  console.log(`part2: ${count(table, 'shiny gold')}`);
}
run();
