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

function visible(map, sta, ast) {
  let [startX, startY] = ast;
  const distX = sta[0] - startX;
  const distY = sta[1] - startY;
  const stepX = distX / gcd(distX, distY);
  const stepY = distY / gcd(distX, distY);

  // process.stdout.write(`(${startX},${startY}): d:(${distX}, ${distY}) s:(${stepX},${stepY}) => (${sta[0]},${sta[1]}) - ${gcd(distX, distY)}`);
  startX += stepX;
  startY += stepY;
  while (!(startX === sta[0] && startY === sta[1])) {
    if (map[startY][startX] === '#') {
      // console.log(` => (${startX}, ${startY})-false`);
      return false;
    }
    startX += stepX;
    startY += stepY;
  }
  // console.log('- true');
  return true;
}

function count(map, sta) {
  let c = 0;
  for (let j = 0; j < map.length; j += 1) {
    for (let i = 0; i < map[0].length; i += 1) {
      if (map[j][i] === '#'
        && !(i === sta[0] && j === sta[1])
        && visible(map, sta, [i, j])) {
        c += 1;
      }
    }
  }
  return c;
}

function max(map) {
  let m = 0;
  for (let j = 0; j < map.length; j += 1) {
    for (let i = 0; i < map[0].length; i += 1) {
      if (map[j][i] === '#') {
        const c = count(map, [i, j]);
        if (c > m) {
          m = c;
        }
      }
    }
  }
  return m;
}

async function run() {
  const input = await readInput('2019/10/');
  const map = input.split('\n').map(x => x.split(''));
  console.log(max(map));
}

run();
