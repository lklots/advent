const _ = require('lodash');

const readInput = require('../../lib/file');
const Intcode = require('../../lib/intcode');

function writeLine(comp, l) {
  for (let i = 0; i < l.length; i += 1) {
    comp.in(l.charCodeAt(i));
  }
  comp.in(10);
}

function readLine(comp) {
  let c;
  const l = [];
  do {
    c = comp.exec();
    if (c === null) {
      return null;
    }

    if (c > 10000) {
      return c;
    }
    l.push(String.fromCharCode(c));
  } while (c !== 10);
  l.pop();
  return l.join('');
}

function droid(comp, instructions) {
  instructions.forEach(i => writeLine(comp, i));
  let l;
  do {
    l = readLine(comp);
    console.log(l);
  } while (l !== null && _.isString(l));
  return l;
}

async function run() {
  const input = await readInput('2019/21/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  const instructions = [
    'OR B T',
    'AND C T',
    'NOT T T',
    'AND D T',
    'OR T J',
    'NOT A T',
    'OR T J',
    'WALK',
  ];
  console.log(droid(new Intcode(registers), instructions));

  const instructions2 = [
    'NOT B T',
    'AND D T',
    'AND H T',
    'NOT C J',
    'AND D J',
    'AND H J',
    'OR T J',
    'NOT A T',
    'OR T J',
    'RUN',
  ];
  console.log(droid(new Intcode(registers), instructions2));

}

run();