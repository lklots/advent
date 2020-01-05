const _ = require('lodash');
const readInput = require('../../lib/file');

function inverse(a, n) {
  let t = 0;
  let newt = 1;
  let r = n;
  let newr = a;

  while (newr !== 0) {
    const quotient = Math.floor(r / newr);
    [t, newt] = [newt, t - quotient * newt];
    [r, newr] = [newr, r - quotient * newr];
  }

  if (r > 1) {
    throw Error("a is not invertible");
  }
  if (t < 0) {
    t += n;
  }

  return t;
}
function mod(n, m) {
  return ((n % m) + m) % m;
}

function dealir(length, i) {
  return (-(i + 1)) % length;
}

function cutir(length, i, n) {
  return mod(i + n, length);
}

function incrementir(length, i, n) {
  return (i * inverse(n, length)) % length;
}

function deali(length, i) {
  return mod(-i - 1, length);
}

function cuti(length, i, n) {
  return mod(i - n, length);
}

function incrementi(length, i, n) {
  return (i * n) % length;
}

function cut(deck, num) {
  if (num >= 0) {
    const removed = deck.splice(0, num);
    return deck.concat(removed);
  }
  const removed = deck.splice(deck.length + num, Math.abs(num));
  return removed.concat(deck);
}

function increment(deck, num) {
  const newDeck = deck.slice();
  deck.forEach((v, i) => {
    newDeck[(i * num) % deck.length] = v;
  });
  return newDeck;
}

function deal(deck) {
  deck.reverse();
  return deck;
}

async function run() {
  const DECK = 10007;
  const input = await readInput('2019/22/');
  const instructions = input.split('\n').map((line) => {
    if (line.match(/cut/)) {
      return d => cut(d, parseInt(line.match(/(-?[0-9]+)/)[1], 10));
    }
    if (line.match(/increment/)) {
      return d => increment(d, parseInt(line.match(/([0-9]+)/)[1], 10));
    }
    if (line.match(/new/)) {
      return d => deal(d);
    }
  });
  let deck = _.range(DECK);
  deck = instructions.reduce((d, fn) => fn(d), deck);
  deck = instructions.reduce((d, fn) => fn(d), deck);
  deck = instructions.reduce((d, fn) => fn(d), deck);

  console.log(`part1: ${_.findIndex(deck, x => x === 2019)}`);
  console.log(`part2: ${deck[2019]}`);
  let a = 0;
  let b = 1;
  let sign = 1;
  const instructions2 = input.split('\n').reverse().map((line) => {
    if (line.match(/cut/)) {
      const n = parseInt(line.match(/(-?[0-9]+)/)[1], 10);
      a += n;
      a = mod(a, DECK);
      return (l, i) => cutir(l, i, n);
    }
    if (line.match(/increment/)) {
      const n = parseInt(line.match(/([0-9]+)/)[1], 10);
      b *= inverse(n, DECK);
      a *= inverse(n, DECK);
      a = mod(a, DECK);
      b = mod(b, DECK);
      return (l, i) => incrementir(l, i, n);
    }
    if (line.match(/new/)) {
      a += 1;
      a *= -1;
      sign *= -1;
      return (l, i) => dealir(l, i);
    }
  });
  console.log(mod((sign * (mod(b, DECK)) ** 3) * 2019 + mod(a, DECK) * geometricMod(b, 3, DECK), DECK));
}

function geometric(r, n) {
  return ((r ** n) - 1) / (r - 1);
}

function geometricMod(r, n, m) {
  return ((expAndMod(r, n, m) - 1) * inverse(r - 1, m)) % m;
}

function expAndMod(r, n, m) {
  if (n === 0) {
    return 1;
  }
  if (n === 1) {
    return r % m;
  }

  if (n % 2 === 0) {
    return expAndMod((r % m) * (r % m), n / 2, m);
  }
  return ((r % m) * expAndMod((r % m) * (r % m), (n - 1) / 2, m)) % m;
}


run();
