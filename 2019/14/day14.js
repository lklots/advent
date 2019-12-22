const _ = require('lodash');
const readInput = require('../../lib/file');

function demand(node, outputs, consumers, producers, fuel) {
  if (node === 'FUEL') { return fuel; }
  const sum = _.sum(producers[node].map(consumer => demand(consumer, outputs, consumers, producers, fuel) * consumers[consumer][node]));
  return Math.ceil(sum / outputs[node]);
}

function bsearch(min, max, func, goal) {
  if (min === max || max - min === 1) {
    return min;
  }

  const guess = Math.floor((max + min) / 2);
  const res = func(guess);

  if (res > goal) {
    return bsearch(min, guess, func, goal);
  }

  return bsearch(guess, max, func, goal);
}

async function run() {
  const lines = (await readInput('2019/14/')).split('\n');
  const parse = lines.map(x => x.match(/([0-9]+ [A-Z]+)/g));
  const list = parse.map(x => x.map((y) => {
    const [num, name] = y.split(' ');
    return [parseInt(num, 10), name];
  }));

  const outputs = { ORE: 1 };
  const consumers = {};
  const producers = {};
  list.forEach((reaction) => {
    const [[outputNum, outputName], ...rest] = reaction.reverse();
    outputs[outputName] = outputNum;
    consumers[outputName] = _.zipObject(_.map(rest, 1), _.map(rest, 0));
    rest.forEach(([, name]) => {
      if (!producers[name]) producers[name] = [];
      producers[name].push(outputName);
    });
  });
  console.log(demand('ORE', outputs, consumers, producers, 1));
  const goal = 1000000000000;
  console.log(bsearch(0, goal, x => demand('ORE', outputs, consumers, producers, x), goal));
}
run();
