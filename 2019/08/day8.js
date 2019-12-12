const _ = require('lodash');
const readInput = require('../../lib/file');

function digitX(layer, digit) {
  return _.sum(layer.map(s => s.filter(x => parseInt(x, 10) === digit).length));
}

async function run() {
  const WIDTH = 25;
  const HEIGHT = 6;
  const input = await readInput('2019/08/');
  const layers = _.chunk(input, WIDTH * HEIGHT).map(g => _.chunk(g, WIDTH));
  const zeros = layers.map(x => digitX(x, 0));
  const index = zeros.indexOf(Math.min.apply(null, zeros));
  console.log(digitX(layers[index], 1) * digitX(layers[index], 2));
}

run();