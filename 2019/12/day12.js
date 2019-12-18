const _ = require('lodash');
const readInput = require('../../lib/file');

function ipairs(range) {
  return _.flatMap(_.range(range - 1).map(i => _.range(i + 1, range).map(j => [i, j])));
}

function gravity(ap, bp, av, bv) {
  _.range(3).forEach((d) => {
    if (ap[d] !== bp[d]) {
      av[d] += (ap[d] > bp[d]) ? -1 : 1;
      bv[d] += (bp[d] > ap[d]) ? -1 : 1;
    }
  });
}

function velocity(ap, av) {
  _.range(3).forEach((d) => {
    ap[d] += av[d];
  });
}

function energy(pos, vel) {
  return _.sum(_.range(pos.length).map(i => _.sum(pos[i].map(d => Math.abs(d))) * _.sum(vel[i].map(d => Math.abs(d)))));
}

async function run() {
  const input = await readInput('2019/12/');
  const pos = input.split('\n').map(x => x.split(',').map(y => parseInt(y.split('=')[1], 10)));
  const vel = _.range(pos.length).map(() => [0, 0, 0]);

  _.range(1000).forEach(() => {
    ipairs(vel.length).forEach(([i, j]) => {
      gravity(pos[i], pos[j], vel[i], vel[j]);
    });
    _.range(pos.length).forEach((i) => {
      velocity(pos[i], vel[i]);
    });
  });
  console.log(energy(pos, vel));
}

run();
