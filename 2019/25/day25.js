/* eslint-disable no-restricted-syntax */
const _ = require('lodash');

const readline = require('readline');
const readInput = require('../../lib/file');

function digit(num, i) {
  return Math.floor((num / (10 ** i)) % 10);
}

function decode(op) {
  const code = parseInt(op, 10);
  return [code % 100, [digit(code, 2), digit(code, 3), digit(code, 4), digit(code, 5)]];
}

class Intcode {
  constructor(registers) {
    this.ip = 0;
    this.base = 0;
    this.registers = registers.slice();
    this.input = [];
  }

  in(i) {
    this.input.push(i);
  }

  * exec() {
    const OPS = {
      1: (x, y) => x + y,
      2: (x, y) => x * y,
      3: (x) => { this.registers[x] = this.input.shift(); },
      5: (x, y) => {
        this.ip = x !== 0 ? y : this.ip + 3;
      },
      6: (x, y) => {
        this.ip = x === 0 ? y : this.ip + 3;
      },
      7: (x, y) => +(x < y),
      8: (x, y) => +(x === y),
      9: (x) => {
        this.base += x;
      },
    };

    let opcode;
    let modes;
    let ret;
    while (opcode !== 99) {
      [opcode, modes] = decode(this.registers[this.ip]);
      const op = OPS[opcode];
      if (opcode === 99) { return null; }
      switch (opcode) {
        case 1:
        case 2:
        case 7:
        case 8:
          this.registers[this.dest(modes[2], this.ip + 3)] = op(this.resolve(modes[0], this.ip + 1), this.resolve(modes[1], this.ip + 2));
          this.ip += 4;
          break;
        case 3:
          if (this.input.length === 0) {
            return null;
          }
          op(this.dest(modes[0], this.ip + 1));
          this.ip += 2;
          break;
        case 4:
          ret = this.resolve(modes[0], this.ip + 1);
          this.ip += 2;
          yield ret;
          break;
        case 9:
          op(this.resolve(modes[0], this.ip + 1));
          this.ip += 2;
          break;
        case 5:
        case 6:
          op(this.resolve(modes[0], this.ip + 1), this.resolve(modes[1], this.ip + 2));
          break;
        case 99:
          break;
        default:
          throw new Error('unknown');
      }
    }

    return null;
  }

  dest(mode, index) {
    if (mode === 2) {
      return this.base + this.registers[index];
    }
    return this.registers[index];
  }

  resolve(mode, index) {
    if (mode === 0) {
      return _.get(this.registers, _.get(this.registers, index, 0), 0);
    }
    if (mode === 1) {
      return _.get(this.registers, index, 0);
    }
    if (mode === 2) {
      return _.get(this.registers, this.base + _.get(this.registers, index, 0));
    }
    return null;
  }
}

function writeLine(comp, l) {
  for (let i = 0; i < l.length; i += 1) {
    comp.in(l.charCodeAt(i));
  }
  comp.in(10);
}

function coord([x, y], dir) {
  switch (dir) {
    case 'north': return [x, y - 1];
    case 'south': return [x, y + 1];
    case 'west': return [x - 1, y];
    case 'east': return [x + 1, y];
    default: throw new Error('unknown');
  }
}

function tokey(k) {
  return k.join(',');
}

function fromkey(k) {
  return k.split(',').map(x => parseInt(x, 10));
}

const grid = {};
let current = [10, 10];
function printGrid() {
  const m = _.range(20).map(() => _.range(20).map(() => '?'));
  _.keys(grid).forEach((k) => {
    m[fromkey(k)[1]][fromkey(k)[0]] = grid[k];
  });
  m[10][10] = 's';
  console.log(m.map(x => x.join('')).join('\n'));
}

function go(comp, dir) {
  writeLine(comp, dir);
  grid[tokey(current)] = '.';
  current = coord(current, dir);
  grid[tokey(current)] = '@';
}

function read(comp) {
  const l = [];
  for (const c of comp.exec()) {
    l.push(String.fromCharCode(c));
  }

  return l.join('');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function command() {
  return new Promise((resolve) => {
    rl.question('?', (name) => { resolve(name); });
  });
}

function opposite(dir) {
  return ({
    north: 'south',
    south: 'north',
    west: 'east',
    east: 'west',
  }[dir]);
}

function scan(report) {
  const stuff = (report.match(/- ([ a-z]+)/g) || []).map(x => x.split(' ').slice(1).join(' '));
  if (stuff.length) {
    return {
      dirs: stuff.filter(x => _.find(['north', 'south', 'west', 'east'], y => y === x)),
      items: stuff.filter(x => !_.find(['north', 'south', 'west', 'east'], y => y === x)),
      loc: (report.match(/==([ a-zA-Z]+)==/) || [])[1],
    };
  }
  return {};
}

const visited = {};
const ignore = ['escape pod', 'giant electromagnet', 'infinite loop', 'photons', 'molten lava'];
function dfs(comp, fromDir = null) {
  const r = read(comp);
  const { dirs, items, loc } = scan(r);
  if (!loc) {
    return;
  }
  if (visited[loc]) {
    return;
  }
  visited[loc] = true;
  items.forEach((i) => {
    if (!_.find(ignore, x => x === i)) {
      writeLine(comp, `take ${i}`);
      read(comp);
    }
  });
  dirs.forEach((dir) => {
    if (dir !== fromDir) {
      go(comp, dir);
      dfs(comp, opposite(dir));
      go(comp, opposite(dir));
      read(comp);
    }
  });
}

function powerset(arr) {
  const results = [[]];
  for (const value of arr) {
    const copy = results.slice(); // See note below.
    for (const prefix of copy) {
      results.push(prefix.concat(value));
    }
  }
  return results;
}

function attempt(comp, items) {
  writeLine(comp, 'inv');
  const { items: inventory } = scan(read(comp));
  _.difference(items, inventory).forEach((i) => {
    writeLine(comp, `take ${i}`);
    read(comp);
  });
  _.difference(inventory, items).forEach((i) => {
    writeLine(comp, `drop ${i}`);
    read(comp);
  });
  go(comp, 'west');
  const ret = read(comp);
  return ret.match(/([0-9]+)/g);
}

const attempts = {};
function security(comp, combos) {
  for (let i = 0; i < combos.length; i += 1) {
    const ret = attempt(comp, combos[i]);
    if (ret) {
      return ret[0];
    }
    attempts[combos[i].join(',')] = false;
  }
  return null;
}

async function run() {
  const input = await readInput('2019/25/');
  const registers = _.flatMap(input.split('\n'), x => x.split(',').map(y => parseInt(y, 10)));
  const comp = new Intcode(registers);
  dfs(comp);
  go(comp, 'north');
  read(comp);
  go(comp, 'north');
  read(comp);
  go(comp, 'west');
  read(comp);
  go(comp, 'west');
  read(comp);
  writeLine(comp, 'inv');
  const { items } = scan(read(comp));
  writeLine(comp, 'drop shell');
  read(comp);
  console.log(security(comp, powerset(items).filter(x => x.length >= 2)));
  process.exit(1);
}

run();
