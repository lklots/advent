#!/usr/local/bin/node

const readFile = require('../lib/file');

function match(pattern, arr, index) {
  const toMatch = arr.slice(index - 2, index + 3);
  for (let i = 0; i < 5; i += 1) {
    if (pattern[i] !== toMatch[i]) {
      return false;
    }
  }
  return true;
}

function pad(state) {
  const leftMost = state.indexOf('#');
  if (leftMost < 5) {
    for (let i = 0; i < 5 - leftMost; i += 1) {
      state.unshift('.');
      state.zeroPotIndex += 1;
    }
  }
  const rightMost = state.lastIndexOf('#');
  if (state.length - rightMost < 5) {
    const repeat = 5 - (state.length - rightMost);
    for (let i = 0; i <= repeat; i += 1) {
      state.push('.');
    }
  }

  return state;
}

function advance(state, patterns) {
  const newState = ['.', '.'];
  for (let i = 2; i < state.length - 2; i += 1) {
    let isMatched = false;
    patterns.forEach((value, pattern) => {
      if (match(pattern, state, i)) {
        isMatched = true;
        newState[i] = value;
      }
    });
    if (!isMatched) {
      newState[i] = '.';
    }
  }
  newState.zeroPotIndex = state.zeroPotIndex;
  pad(newState);
  return newState;
}

function total(state) {
  let total = 0;
  for (let i = 0; i < state.length; i += 1) {
    if (state[i] === '#') {
      total += (i - state.zeroPotIndex);
    }
  }
  return total;
}

async function run() {
  const patterns = new Map();
  const contents = (await readFile(__dirname)).split('\n');
  let state = contents.shift().match(/initial state: ([.#]+)/)[1];
  state = state.split('');
  contents.shift();
  contents.forEach((l) => {
    const matches = l.match(/([.#]+) => ([.#])/);
    if (matches) {
      patterns.set(matches[1], matches[2]);
    }
  });
  state.zeroPotIndex = state.indexOf('#');
  pad(state);
  for (let i = 0; i < 20; i += 1) {
    state = advance(state, patterns);
  }
  console.log(`${i}=${total(state)}`);
}

run();
