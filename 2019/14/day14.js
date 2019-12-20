const _ = require('lodash');
const readInput = require('../../lib/file');

function topoSort(graph) {
  const visited = {};
  const ret = [];

  function dfs(u) {
    visited[u] = true;
    (graph[u] || []).forEach((v) => {
      if (!visited[v]) {
        dfs(v);
      }
    });
    ret.push(u);
  }

  _.keys(graph).forEach((u) => {
    if (!visited[u]) {
      dfs(u);
    }
  });

  return ret;
}

function demand(node, outputs, consumers, producers, demands) {
  if (!producers[node]) { return 1; }
  const sum = _.sum(producers[node].map(consumer => demands[consumer] * consumers[consumer][node]));
  return Math.ceil(sum / outputs[node]);
}

function part1(outputs, consumers, producers) {
  const demands = {};
  topoSort(producers).forEach((node) => {
    demands[node] = demand(node, outputs, consumers, producers, demands);
  });

  return demands.ORE;
}

async function run() {
  const lines = (await readInput('2019/14/')).split('\n');
  const parse = lines.map(x => x.match(/([0-9]+ [A-Z]+)/g));
  const list = parse.map(x => x.map((y) => {
    const [num, name] = y.split(' ');
    return [parseInt(num, 10), name];
  }));

  const outputs = { ORE: 1 };
  const consumers = {};
  const producers = {};
  list.forEach((reaction) => {
    const [[outputNum, outputName], ...rest] = reaction.reverse();
    outputs[outputName] = outputNum;
    consumers[outputName] = _.zipObject(_.map(rest, 1), _.map(rest, 0));
    rest.forEach(([, name]) => {
      if (!producers[name]) producers[name] = [];
      producers[name].push(outputName);
    });
  });
  console.log(part1(outputs, consumers, producers));
}

run();
