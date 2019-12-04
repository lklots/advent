const _ = require('lodash');
const readInput = require('../../lib/file');

function mdist(x, y) {
  return Math.abs(x) + Math.abs(y);
}

function step(dir, x, y) {
  switch (dir) {
    case 'U': return { x, y: y + 1 };
    case 'R': return { x: x + 1, y };
    case 'L': return { x: x - 1, y };
    case 'D': return { x, y: y - 1 };
    default: throw new Error(`unknown direction ${dir}`);
  }
}

class Panel {
  constructor() {
    this.map = new Map();
    this.x = 0;
    this.y = 0;
  }

  place(wire, check) {
    this.x = 0;
    this.y = 0;
    const checks = [];
    wire.forEach((inst) => {
      const dir = inst[0];
      const steps = parseInt(inst.slice(1), 10);
      _.range(0, steps).forEach(() => {
        ({ x: this.x, y: this.y } = step(dir, this.x, this.y));
        if (check) {
          if (this.map.get(`${this.x},${this.y}`)) {
            checks.push(mdist(this.x, this.y));
          }
        } else {
          this.map.set(`${this.x},${this.y}`, true);
        }
      });
    });
    return checks;
  }
}

async function run() {
  const [wire1, wire2] = (await readInput('2019/03/')).split('\n').map(x => x.split(','));

  const panel = new Panel();
  panel.place(wire1, false);
  console.log(Math.min(...panel.place(wire2, true)));
}

run();