const readInput = require('../../lib/file');

function trees(map, slopeX, slopeY) {
  const [height, width] = [map.length, map[0].length];
  let count = 0;
  for (let i = 1; (i * slopeY) < height; i += 1) {
    if (map[i * slopeY][(i * slopeX) % width] === '#') {
      count += 1;
    }
  }
  return count;
}

async function run() {
  const input = await readInput('2020/03');
  const map = input.split('\n').map(x => x.split(''));
  console.log(`part1: ${trees(map, 3, 1)}`);
  const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];
  const part2 = slopes.reduce((acc, [x, y]) => acc * trees(map, x, y), 1);
  console.log(`part2: ${part2}`);
}
run();
