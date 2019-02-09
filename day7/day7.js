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

const MAX_WORK_Q = 5;

function fillWork(work, workQ, queue) {
  while (workQ.length < MAX_WORK_Q && queue.length) {
    queue.sort().reverse();
    const node = queue.pop();
    if (work[node] > 0) {
      if (workQ.length >= MAX_WORK_Q) {
        queue.push(node);
      } else {
        workQ.push(node);
      }
    }
  }
}

function topoSortAndWait(graph) {
  const sorted = [];
  const degree = graph.getNodes().reduce((o, n) => Object.assign(o, { [n]: graph.inDegree(n) }), {});
  const work = _.zipObject(graph.getNodes(), graph.getNodes().map(char => char.charCodeAt(0) - 64 + 60));
  console.log(work);
  const queue = _.keys(_.pickBy(degree, v => v === 0));
  queue.sort().reverse();
  const workQ = queue.splice(0, Math.min(MAX_WORK_Q, queue.length));
  let clock = 0;
  do {
    console.log(`${clock}:\t${workQ.join(',')}\t\t${sorted.join(',')}`);
    fillWork(work, workQ, queue);
    workQ.forEach((node) => {
      work[node] -= 1;
    });
    workQ.forEach((node) => {
      if (work[node] === 0) {
        sorted.push(node);
        graph.getDeps(node).forEach((dep) => {
          degree[dep] -= 1;
          if (degree[dep] === 0) {
            queue.push(dep);
          }
        });
        delete work[node];
        workQ.splice(workQ.findIndex(c => c === node), 1);
        fillWork(work, workQ, queue);
      }
    });
    clock += 1;
  } while (Object.keys(work).length);

  return clock;
}

function topoSort(graph) {
  const sorted = [];
  const degree = graph.getNodes().reduce((o, n) => Object.assign(o, { [n]: graph.inDegree(n) }), {});
  const queue = _.keys(_.pickBy(degree, v => v === 0));
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

  console.log(`part 1: ${topoSort(graph).join('')}`);
  console.log(`part 2: ${topoSortAndWait(graph)}`);

}

run();
