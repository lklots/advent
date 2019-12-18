const _ = require('lodash');
const readInput = require('../../lib/file');

function gcd(a_, b_) {
  if (a_ === 0) {
    return Math.abs(b_);
  }
  if (b_ === 0) {
    return Math.abs(a_);
  }
  let r = 0;
  let a = Math.abs(a_);
  let b = Math.abs(b_);
  while ((a % b) > 0) {
    r = a % b;
    a = b;
    b = r;
  }
  return b;
}

function visit(map, func) {
  for (let j = 0; j < map.length; j += 1) {
    for (let i = 0; i < map[0].length; i += 1) {
      func(map[j][i], [i, j]);
    }
  }
}

function blocking(map, sta, ast) {
  let [startX, startY] = ast;
  const distX = sta[0] - startX;
  const distY = sta[1] - startY;
  const stepX = distX / gcd(distX, distY);
  const stepY = distY / gcd(distX, distY);

  startX += stepX;
  startY += stepY;
  let blocks = 0;
  while (!(startX === sta[0] && startY === sta[1])) {
    if (map[startY][startX] === '#') {
      blocks += 1;
    }
    startX += stepX;
    startY += stepY;
  }
  return blocks;
}

function asteroids(map) {
  const asts = [];
  visit(map, (thing, coord) => {
    if (thing === '#') {
      asts.push(coord);
    }
  });
  return asts;
}

function count(map, sta) {
  return _.sum(asteroids(map).map((ast) => {
    if (!(ast[0] === sta[0] && ast[1] === sta[1]) && !blocking(map, sta, ast)) {
      return 1;
    }
    return 0;
  }));
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function angle(a, b) {
  let rad = Math.atan2(a[1] - b[1], a[0] - b[0]);
  rad = (rad < 0) ? rad + 2 * Math.PI : rad;
  const deg = rad / Math.PI * 180;
  return mod(deg - 90, 360);
}

function vaporize(map, sta) {
  const vis = asteroids(map).filter(ast => !(ast[0] === sta[0] && ast[1] === sta[1]));
  vis.sort((a, b) => (angle(sta, a) + blocking(map, sta, a) * 360) - (angle(sta, b) + blocking(map, sta, b) * 360));
  return vis;
}

async function run() {
  const input = await readInput('2019/10/');
  const map = input.split('\n').map(x => x.split(''));
  const asts = asteroids(map);
  const index = asts.reduce((iMax, coord, i, arr) => (count(map, coord) > count(map, arr[iMax]) ? i : iMax), 0);
  console.log(count(map, asts[index]));
  const last = vaporize(map, asts[index])[199];
  console.log(last[0] * 100 + last[1]);
}

run();
