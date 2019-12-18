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

function keys(pos, vel) {
  return _.range(3).map(d => pos.map(x => x[d]).join(',') + ',' + vel.map(x => x[d]).join(','));
}

function round(pos, vel) {
  ipairs(vel.length).forEach(([i, j]) => {
    gravity(pos[i], pos[j], vel[i], vel[j]);
  });
  _.range(pos.length).forEach((i) => {
    velocity(pos[i], vel[i]);
  });
}

function repeat(pos, vel) {
  const seen = [{}, {}, {}];
  const ret = [0, 0, 0];
  _.range(1000000).forEach((r) => {
    round(pos, vel);
    keys(pos, vel).forEach((k, i) => {
      if (!ret[i]) {
        if (seen[k]) {
          ret[i] = r;
        } else {
          seen[k] = true;
        }
      }
    });
  });
  return ret;
}

const gcd = (a, b) => (a ? gcd(b % a, a) : b);
const lcm = (a, b) => a * b / gcd(a, b);

async function run() {
  const input = await readInput('2019/12/');
  const pos = input.split('\n').map(x => x.split(',').map(y => parseInt(y.split('=')[1], 10)));
  const vel = _.range(pos.length).map(() => [0, 0, 0]);

  _.range(1000).forEach(() => {
    round(pos, vel);
  });
  console.log(energy(pos, vel));

  const pos2 = input.split('\n').map(x => x.split(',').map(y => parseInt(y.split('=')[1], 10)));
  const vel2 = _.range(pos.length).map(() => [0, 0, 0]);

  console.log(repeat(pos2, vel2).reduce(lcm));
}

run();
