#!/usr/bin/env node

const util = require('util');
const path = require('path');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

function topoSort(nodes, depsFromTo, depsToFrom) {
  let sorted = [];
  let frontier = new Array(...nodes).filter(n => !depsFromTo.has(n));
  const visited = new Map();
  while (frontier.length > 0) {
    frontier.sort();
    sorted = sorted.concat(frontier);
    let newFrontier = [];
    frontier.forEach((node) => {
      visited.set(node, true);
    });
    frontier.forEach((node) => {
      let toVisit = depsToFrom.get(node) || [];
      toVisit = toVisit.filter(n => !visited.has(n));
      newFrontier = newFrontier.concat(toVisit);
    });
    frontier = new Array(...new Set(newFrontier));
  }

  return sorted;
}

function addDep(deps, from, to) {
  if (deps.has(from)) {
    deps.set(from, deps.get(from).concat([to]));
  } else {
    deps.set(from, [to]);
  }
}

async function run() {
  const depsFromTo = new Map();
  const depsToFrom = new Map();
  const nodes = new Set();
  const contents = await readFile(path.join(__dirname, 'input.txt'));
  contents.toString().split('\n').forEach((line) => {
    const matches = line.match(/Step ([A-Z]) must be finished before step ([A-Z])/);
    if (matches) {
      const [_, to, from] = matches;
      nodes.add(from).add(to);
      addDep(depsFromTo, from, to);
      addDep(depsToFrom, to, from);
    }
  });

  console.log(topoSort(nodes, depsFromTo, depsToFrom).join(','));
}

run();
