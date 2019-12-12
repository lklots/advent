const _ = require('lodash');
const readInput = require('../../lib/file');

function digitX(layer, digit) {
  return _.sum(layer.map(s => s.filter(x => parseInt(x, 10) === digit).length));
}

function decode(arr) {
  return _.find(arr, x => parseInt(x, 10) !== 2);
}

async function run() {
  const WIDTH = 25;
  const HEIGHT = 6;
  const input = await readInput('2019/08/');
  const layers = _.chunk(input, WIDTH * HEIGHT).map(g => _.chunk(g, WIDTH));
  const zeros = layers.map(x => digitX(x, 0));
  const index = zeros.indexOf(Math.min.apply(null, zeros));
  console.log(digitX(layers[index], 1) * digitX(layers[index], 2));

  const image = [];
  for (let j = 0; j < HEIGHT; j += 1) {
    for (let i = 0; i < WIDTH; i += 1) {
      const pixels = [];
      for (let l = 0; l < layers.length; l += 1) {
        pixels.push(layers[l][j][i]);
      }
      if (!image[j]) {
        image[j] = [];
      }
      image[j][i] = decode(pixels);
    }
  }

  console.log(image.map(x => x.join('')).join('\n').replace(/0/g, ' ').replace(/1/g, '*'));
}

run();