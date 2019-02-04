#!/usr/local/bin/node

const readFile = require('../lib/file');

function isCart(char) {
  return char === '>' || char === '<' || char === 'v' || char === '^';
}

function getCartTrack(cart) {
  switch (cart) {
    case '>': return '-';
    case '<': return '-';
    case '^': return '|';
    case 'v': return '|';
    default: throw Error(`invalid cart ${cart}`);
  }
}

function print(map, carts, crash = null) {
  const newMap = map.map(x => x.slice()).slice();
  carts.forEach((cart) => {
    newMap[cart.y][cart.x] = cart.dir;
  });
  if (crash) {
    newMap[crash[1]][crash[0]] = 'X';
  }
  console.log(newMap.map(x => x.join('')).join('\n'));
}

class Cart {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.turn = 'L';
    this.crashed = false;
  }

  setCrashed() {
    this.crashed = true;
  }

  isCrashed() {
    return this.crashed;
  }

  move(track) {
    [this.x, this.y, this.dir] = this.moveHelper(track);
  }

  moveHelper(track) {
    const { x, y } = this;
    if (track === '+') {
      this.changeDirection();
      switch (this.dir) {
        case '>': return [x + 1, y, '>'];
        case '<': return [x - 1, y, '<'];
        case '^': return [x, y - 1, '^'];
        case 'v': return [x, y + 1, 'v'];
        default: throw Error(`invalid direction ${this.dir}`);
      }
    }

    switch (track + this.dir) {
      case '->': return [x + 1, y, '>'];
      case '/>': return [x, y - 1, '^'];
      case '\\>': return [x, y + 1, 'v'];

      case '-<': return [x - 1, y, '<'];
      case '/<': return [x, y + 1, 'v'];
      case '\\<': return [x, y - 1, '^'];

      case '|^': return [x, y - 1, '^'];
      case '/^': return [x + 1, y, '>'];
      case '\\^': return [x - 1, y, '<'];

      case '|v': return [x, y + 1, 'v'];
      case '/v': return [x - 1, y, '<'];
      case '\\v': return [x + 1, y, '>'];

      default:
        throw Error(`invalid track and direction ${track + this.dir}`);
    }
  }

  changeDirection() {
    this.dir = this.newDir();
    this.turn = this.newTurn();
  }

  newDir() {
    switch (this.dir + this.turn) {
      case '>L': return '^';
      case '>S': return '>';
      case '>R': return 'v';

      case '^L': return '<';
      case '^S': return '^';
      case '^R': return '>';

      case '<L': return 'v';
      case '<S': return '<';
      case '<R': return '^';

      case 'vL': return '>';
      case 'vS': return 'v';
      case 'vR': return '<';

      default:
        throw Error(`invalid direction and turn ${this.dir + this.turn}`);
    }
  }

  newTurn() {
    switch (this.turn) {
      case 'L': return 'S';
      case 'S': return 'R';
      case 'R': return 'L';
      default:
        throw Error('invalid turn');
    }
  }
}

function crashed(carts) {
  const locs = new Map();
  for (let i = 0; i < carts.length; i += 1) {
    const cart = carts[i];
    if (!cart.isCrashed()) {
      const hash = `${cart.x},${cart.y}`;
      if (locs.has(hash)) {
        cart.setCrashed();
        locs.get(hash).setCrashed();
        return [cart.x, cart.y];
      }
      locs.set(hash, cart);
    }
  }
  return null;
}

function isLastCart(carts) {
  return carts.filter(c => !c.isCrashed()).length === 1;
}

let FIRST_CRASH = true;
function tick(map, carts) {
  carts.sort((a, b) => (a.y * 10000 + a.x) - (b.y * 10000 + b.x));
  for (let i = 0; i < carts.length; i += 1) {
    const cart = carts[i];
    if (!cart.isCrashed()) {
      cart.move(map[cart.y][cart.x]);
      const loc = crashed(carts);
      if (loc && FIRST_CRASH) {
        FIRST_CRASH = false;
        console.log(`part1: ${loc}`);
      }
      if (isLastCart(carts)) {
        const lastCart = carts.filter(c => !c.isCrashed())[0];
        console.log(`part2: ${lastCart.x},${lastCart.y}`);
        return true;
      }
    }
  }
  return false;
}


async function run() {
  const carts = [];
  const map = (await readFile(__dirname, 'input.txt')).split('\n').map(x => x.split(''));
  for (let i = 0; i < map.length; i += 1) {
    for (let j = 0; j < map[0].length; j += 1) {
      if (isCart(map[i][j])) {
        carts.push(new Cart(j, i, map[i][j]));
        map[i][j] = getCartTrack(map[i][j]);
      }
    }
  }

  while (!tick(map, carts));
}

run();
