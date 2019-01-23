#!/usr/local/bin/node

const SERIAL = 1309;
const WIDTH = 300;
const HEIGHT = 300;

function power(x, y) {
  const rackId = x + 10;
  return (Math.floor(((rackId * y + SERIAL) * rackId) / 100) % 10) - 5;
}

function squareSum(grid, x, y) {
  let total = 0;
  for (let i = x; i < x + 3; i += 1) {
    for (let j = y; j < y + 3; j += 1) {
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
for (let i = 1; i < HEIGHT - 2; i += 1) {
  for (let j = 1; j < WIDTH - 2; j += 1) {
    const score = squareSum(grid, j, i);
    if (maxScore === null || score > maxScore) {
      maxX = j;
      maxY = i;
      maxScore = score;
    }
  }
}

console.log(`${maxX},${maxY}`);
