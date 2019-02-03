#!/usr/local/bin/node

const SERIAL = 1309;
const WIDTH = 300;
const HEIGHT = 300;

function power(x, y) {
  const rackId = x + 10;
  return (Math.floor(((rackId * y + SERIAL) * rackId) / 100) % 10) - 5;
}

function squareTotal(grid, x, y, size) {
  let total = 0;
  for (let j = y; j < y + size; j += 1) {
    for (let i = x; i < x + size; i += 1) {
      total += grid[j][i];
    }
  }
  return total;
}

function makeGrid(width, height, fn) {
  const grid = [];
  for (let i = 1; i < HEIGHT; i += 1) {
    grid[i] = [];
    for (let j = 1; j < WIDTH; j += 1) {
      grid[i][j] = fn(j, i);
    }
  }
  return grid;
}

const grid = makeGrid(WIDTH, HEIGHT, power);

let maxScore = null;
let maxX;
let maxY;
for (let j = 1; j < WIDTH - 3; j += 1) {
  for (let i = 1; i < HEIGHT - 3; i += 1) {
    const score = squareTotal(grid, j, i, 3);
    if (maxScore === null || score > maxScore) {
      maxX = j;
      maxY = i;
      maxScore = score;
    }
  }
}
console.log(`part1: ${maxX},${maxY}`);

maxScore = null;
maxX = null;
maxY = null;
let maxSize = null;
for (let k = 1; k < 300; k += 1) {
  for (let j = 1; j < WIDTH - k; j += 1) {
    for (let i = 1; i < HEIGHT - k; i += 1) {
      const score = squareTotal(grid, j, i, k);
      if (maxScore === null || score > maxScore) {
        maxX = j;
        maxY = i;
        maxScore = score;
        maxSize = k;
      }
    }
  }
}
console.log(`${maxX},${maxY},${maxSize}`);
