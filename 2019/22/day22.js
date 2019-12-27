const _ = require('lodash');
const readInput = require('../../lib/file');

let deck = _.range(10007);
function cut(num) {
  if (num >= 0) {
    const removed = deck.splice(0, num);
    deck = deck.concat(removed);
  } else {
    const removed = deck.splice(deck.length + num, Math.abs(num));
    deck = removed.concat(deck);
  }
  return deck;
}

function increment(num) {
  const newDeck = deck.slice();
  deck.forEach((v, i) => {
    newDeck[(i * num) % deck.length] = v;
  });
  deck = newDeck;
  return deck;
}

function deal() {
  deck.reverse();
  return deck;
}

async function run() {
  const input = await readInput('2019/22/');
  const instructions = input.split('\n').map((line) => {
    if (line.match(/cut/)) {
      return () => cut(parseInt(line.match(/(-?[0-9]+)/)[1], 10));
    }
    if (line.match(/increment/)) {
      return () => increment(parseInt(line.match(/([0-9]+)/)[1], 10));
    }
    if (line.match(/new/)) {
      return () => deal();
    }
  });
  instructions.map(fn => fn());
  console.log(_.findIndex(deck, x => x === 2019));
}

run();
