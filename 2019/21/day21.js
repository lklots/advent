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

async function run() {
  const input = await readInput('2019/21/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  const comp = new Intcode(registers);
  const instructions = [
    'NOT A J',
    'OR B T',
    'AND C T',
    'NOT T T',
    'AND D T',
    'OR T J',
    'WALK',
  ];
  instructions.forEach(i => writeLine(comp, i));
  let l;
  do {
    l = readLine(comp);
  } while (l !== null && _.isString(l));
  console.log(l);
}

run();