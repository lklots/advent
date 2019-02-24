#!/usr/local/bin/node

function insertAt(arr, index, value) {
  return arr.slice(0, index).concat(value).concat(arr.slice(index, arr.length));
}

function print(player, circle, current) {
  let out = `${player} `;
  for (let i = 0; i < circle.length; i += 1) {
    if (i === current) {
      out += `(${circle[i]})`;
    } else {
      out += ` ${circle[i]} `;
    }
  }
  console.log(out);
}

function simulate(players, maxMarble) {
  const scores = {};
  for (let i = 1; i <= players; i += 1) {
    scores[i] = 0;
  }

  let current = 0;
  let circle = [0];
  for (let marble = 1; marble <= maxMarble; marble += 1) {
    const player = ((marble - 1) % players) + 1;
    if (marble % 23 === 0) {
      scores[player] += marble;
      // bad but % in js is 
      if (current - 7 < 0) {
        current = (current - 7) + circle.length;
      } else {
        current = (current - 7) % circle.length;
      }
      const removed = circle.splice(current, 1);
      scores[player] += removed[0];
    } else {
      current = (current + 2) % circle.length;
      circle = insertAt(circle, current, marble);
    }
  }
  return Math.max(...Object.values(scores));
}

console.log(`part 1: ${simulate(479, 71035)}`);
