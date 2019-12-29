const _ = require('lodash');
const readInput = require('../../lib/file');

function mod(n, m) {
  return ((n % m) + m) % m;
}

function dealir(length, i) {
  return (length - 1 - i) % length;
}

function cutir(length, i, n) {
  return mod(i + n, length);
}

function incrementir(length, i, n) {
  console.log(`${i},${n},${length} => ${(i * (length - n + 1)) % length}`);
  return (i * (length - n)) % length;
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
  // const DECK = 10007;
  const DECK = 10;
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
  let newdeck = _.range(11);

  console.log(newdeck);
  newdeck = increment(newdeck, 5);
  console.log(newdeck);
  console.log(increment(newdeck, ));
  console.log(_.isEqual(_.range(10), increment(newdeck, 3)));
  console.log('END');

  let deck = _.range(DECK);
  deck = instructions.reduce((d, fn) => fn(d), deck);
  console.log(deck);
  console.log(`part1: ${_.findIndex(deck, x => x === 2019)}`);

  const instructions2 = input.split('\n').map((line) => {
    if (line.match(/cut/)) {
      return (l, i) => cutir(l, i, parseInt(line.match(/(-?[0-9]+)/)[1], 10));
    }
    if (line.match(/increment/)) {
      return (l, i) => incrementir(l, i, parseInt(line.match(/([0-9]+)/)[1], 10));
    }
    if (line.match(/new/)) {
      return (l, i) => dealir(l, i);
    }
  });
  instructions2.reverse();
  let ret = 1;
  //for (let i = 0; i < 101741582076661; i += 1) {
  ret = instructions2.reduce((i, fn) => fn(DECK, i), ret);
  //}
  console.log(ret);
  console.log(_.range(DECK).map((fromIndex) => instructions2.reduce((i, fn) => fn(DECK, i), fromIndex)));
}

run();
