#!/usr/bin/env node
const _ = require('lodash');
const readInput = require('../lib/file');

class Graph {
  constructor() {
    this.nodes = new Set();
    this.deps = {};
    this.reverseDeps = {};
  }

  addNode(node) {
    this.nodes.add(node);
    if (!this.deps[node]) {
      this.deps[node] = [];
    }
    if (!this.reverseDeps[node]) {
      this.reverseDeps[node] = [];
    }
    return this;
  }

  addDep(from, to) {
    this.deps[from].push(to);
    this.reverseDeps[to].push(from);
    return this;
  }

  getDeps(node) {
    return this.deps[node];
  }

  inDegree(node) {
    return this.reverseDeps[node].length;
  }

  getNodes() {
    return new Array(...this.nodes);
  }
}

function topoSort(graph) {
  let sorted = [];
  const degree = graph.getNodes().reduce((o, n) => Object.assign(o, { [n]: graph.inDegree(n) }), {});
  const queue = _.keys(_.pickBy(degree, (v, k) => v === 0));
  while (queue.length) {
    queue.sort().reverse();
    const node = queue.pop();
    sorted.push(node);
    graph.getDeps(node).forEach((dep) => {
      degree[dep] -= 1;
      if (degree[dep] === 0) {
        queue.push(dep);
      }
    });
  }
  return sorted;
}

async function run() {
  const graph = new Graph();
  (await readInput(__dirname, 'input.txt')).split('\n').forEach((line) => {
    const matches = line.match(/Step ([A-Z]) must be finished before step ([A-Z])/);
    if (matches) {
      const [, from, to] = matches;
      graph.addNode(to).addNode(from);
      graph.addDep(from, to);
    }
  });

  console.log(topoSort(graph).join(''));
}

run();
