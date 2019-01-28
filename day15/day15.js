#!/usr/local/bin/node

const readFile = require('../lib/file');

function readingOrder(a, b) {
  return (a.y - b.y) * 1000 + (a.x - b.x);
}

function minPath(paths) {
  let min = null;
  let minId = null;
  for (let i = 0; i < paths.length; i += 1) {
    if (paths[i] !== null && (min === null || paths[i] < min)) {
      min = paths[i];
      minId = i;
    }
  }
  return minId;
}

function nearbyCoord(coord) {
  return [
    [coord[0], coord[1] - 1],
    [coord[0] - 1, coord[1]],
    [coord[0] + 1, coord[1]],
    [coord[0], coord[1] + 1],
  ];
}

function nearbyUnit(unit) {
  return nearbyCoord([unit.x, unit.y]);
}

function serialize(coord) {
  return `${coord[0]},${coord[1]}`;
}

// HACK
function dedupe(arr) {
  const map = new Map();
  arr.forEach((coord) => {
    map.set(`${coord[0]},${coord[1]}`, coord);
  });
  return new Array(...map.values())
}

function printGrid(grid, units, coords = []) {
  const newGrid = grid.map(x => x.slice()).slice();
  coords.forEach((coord) => {
    newGrid[coord[1]][coord[0]] = '?';
  });
  units.forEach((unit) => {
    newGrid[unit.y] = newGrid[unit.y].concat(`  ${unit}(${unit.hp}) `);
  });
  console.log(newGrid.map(x => x.join('')).join('\n'));
}

function bfs(grid, start, ends) {
  const terminals = ends.map(serialize);
  let q = [start];
  const visited = {};
  let length = 0;
  while (q.length) {
    q.forEach((node) => {
      visited[serialize(node)] = true;
    });

    if (q.some(n => terminals.find(x => x === serialize(n)))) {
      return length;
    }

    q = q.map(n => nearbyCoord(n)).flat();
    q = q.filter(coord => grid[coord[1]][coord[0]] === '.' && !visited[serialize(coord)]);
    q = dedupe(q);
    length += 1;
  }
  return null;
}

class Unit {
  constructor(x, y, enemy) {
    this.x = x;
    this.y = y;
    this.hp = 200;
    this.attack = 3;
    this.enemy = enemy;
  }

  isDead() {
    return this.hp <= 0;
  }
}

class Goblin extends Unit {
  constructor(x, y) {
    super(x, y, Elf);
  }

  toString() {
    return 'G';
  }
}

class Elf extends Unit {
  constructor(x, y) {
    super(x, y, Goblin);
  }

  toString() {
    return 'E';
  }
}

class Grid {
  constructor(grid, units) {
    this.grid = grid;
    this.units = units;
    this.r = 1;
  }

  round() {
    console.log(`==== Round ${this.r} ====`);
    this.r += 1;
    this.sortUnits();
    for (let i = 0; i < this.units.length; i += 1) {
      const unit = this.units[i];
      if (unit && !unit.isDead()) {
        if (!this.act(unit)) {
          console.log(`${unit} at (${unit.x},${unit.y}) could not act.`);
          if (this.units.every(u => u instanceof Elf) ||
              this.units.every(u => u instanceof Goblin)) {
            return false;
          }
        }
      }
    }
    this.sortUnits();
    printGrid(this.grid, this.units);
    return true;
  }

  act(unit) {
    if (!this.attack(unit)) {
      if (!this.move(unit)) {
        return false;
      }
      this.attack(unit);
    }
    return true;
  }

  kill(unit) {
    console.log(`${unit} at (${unit.x},${unit.y}) is dead.`);
    this.grid[unit.y][unit.x] = '.';
    delete this.units[this.units.indexOf(unit)];
  }

  move(unit) {
    const enemies = this.units.filter(x => x instanceof unit.enemy);
    const range = enemies.map(u => nearbyUnit(u).filter(coord => this.grid[coord[1]][coord[0]] === '.')).flat();
    if (!range.length) {
      return false;
    }
    const nextMoves = nearbyUnit(unit).filter(coord => this.grid[coord[1]][coord[0]] === '.');
    const shortestPaths = nextMoves.map(coord => bfs(this.grid, coord, range));

    const minp = minPath(shortestPaths);
    if (minp === null) {
      return false;
    }

    const nextMove = nextMoves[minp];
    console.log(`unit ${unit} at (${unit.x},${unit.y}) moved to (${nextMove[0]}, ${nextMove[1]})`);
    this.grid[unit.y][unit.x] = '.';
    this.grid[nextMove[1]][nextMove[0]] = unit;
    unit.x = nextMove[0];
    unit.y = nextMove[1];
    return true;
  }

  attack(unit) {
    const nearby = nearbyUnit(unit);
    const enemies = [];
    for (let coord of nearby) {
      if (this.grid[coord[1]][coord[0]] instanceof unit.enemy) {
        enemies.push(this.grid[coord[1]][coord[0]]);
      }
    }
    if (!enemies.length) {
      return false;
    }

    enemies.sort((a, b) => {
      if (a.hp === b.hp) {
        return readingOrder(a, b);
      }
      return a.hp - b.hp;
    });

    const enemy = enemies[0];
    console.log(`${unit} at (${unit.x},${unit.y}) attacked ${enemy} at (${enemy.x},${enemy.y}).`);
    enemy.hp -= unit.attack;
    if (enemy.isDead()) {
      this.kill(enemy);
    }
    return true;
  }

  sortUnits() {
    this.units.sort(readingOrder);
  }

  toString() {
    return this.grid.map(x => x.join('')).join('\n');
  }
}

function findUnits(grid) {
  const units = [];
  for (let i = 0; i < grid.length; i += 1) {
    for (let j = 0; j < grid[0].length; j += 1) {
      if (grid[i][j] === 'E') {
        const unit = new Elf(j, i);
        units.push(unit);
        grid[i][j] = unit;
      } else if (grid[i][j] === 'G') {
        const unit = new Goblin(j, i);
        units.push(unit);
        grid[i][j] = unit;
      }
    }
  }
  return units;
}

async function run() {
  const contents = await readFile(__dirname, 'input.txt');
  const gridMap = [];
  contents.split("\n").forEach((row, index) => {
    gridMap[index] = row.split('');
  });
  const units = findUnits(gridMap);
  const grid = new Grid(gridMap, units);

  printGrid(gridMap, units);

  while (grid.round());

  const lastFullRound = grid.r - 2;
  const remainingHp = grid.units.reduce((sum, unit) => sum + unit.hp, 0);
  console.log(`last full round: ${lastFullRound}`);
  console.log(`remaining hp ${remainingHp}`);
  console.log(`answer: ${lastFullRound * remainingHp}`);
}

run();
