#!/usr/local/bin/node

function insertAt(arr, index, value) {
  return arr.slice(0, index).concat(value).concat(arr.slice(index, arr.length));
}

function print(circle, current) {
  let out = '';
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
  let circle = [0];
  const scores = {};

  for (let i = 0; i < players; i += 1) {
    scores[i] = 0;
  }

  let marble = 1;
  let current = 0;
  while (marble <= maxMarble) {
    if (marble % 23 === 0) {
      scores[marble % players] += marble;
      const removed = circle.splice((current - 7) % circle.length, 1);
      scores[marble % players] += removed[0];
      current -= 7;
      marble += 1;
    } else {
      current = (current + 2) % circle.length;
      if (current === 0) {
        current = circle.length;
      }
      circle = insertAt(circle, current, marble);
      marble += 1;
    }
  }
  console.log(Math.max(...Object.values(scores)));
}

simulate(10, 1618); // 8317
simulate(13, 7999); // 146373
simulate(17, 1104); // 2764
simulate(21, 6111); // 54718
simulate(30, 5807); // 37305
simulate(479, 71035); // 373678?
