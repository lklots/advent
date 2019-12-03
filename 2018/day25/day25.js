#!/usr/local/bin/node

const readFile = require('../lib/file');

function distance(p1, p2) {
  let dist = 0;
  for (let i = 0; i < p1.length; i += 1) {
    dist += Math.abs(p1[i] - p2[i]);
  }
  return dist;
}

function tryMatch(group, points) {
  for (let i = 0; i < points.length; i += 1) {
    for (let j = 0; j < group.length; j += 1) {
      if (distance(points[i], group[j]) <= 3) {
        group.push(points.splice(i, 1)[0]);
        return true;
      }
    }
  }
  return false;
}

async function run() {
  const lines = (await readFile(__dirname, 'input.txt')).split('\n').filter(x => x.trim());
  const points = lines.map(x => x.split(',')).map(x => x.map(y => parseInt(y, 10)));
  const groups = [];
  while (points.length) {
    const point = points.shift();
    const group = [point];
    while (tryMatch(group, points));
    groups.push(group);
  }
  console.log(groups.length);
}

run();