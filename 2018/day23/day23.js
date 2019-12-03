#!/usr/local/bin/node

const readFile = require('../lib/file');

function distance(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}

function intersect(bot1, bot2) {
  return distance(bot1, bot2) < bot1.rad + bot2.rad;
}

function intersections(bots) {
  const inters = {};
  for (let i = 0; i < bots.length; i += 1) {
    const bot = bots[i];
    inters[bot] = [];
    for (let j = 0; j < bots.length; j += 1) {
      if (intersect(bot, bot[j])) {
        inters.push(bot[j]);
      }
    }
  }
  return inters;
}

function maxRadId(bots) {
  let value = null;
  let index = null;
  for (let i = 0; i < bots.length; i += 1) {
    const bot = bots[i];
    if (value === null || bot.rad > value) {
      value = bot.rad;
      index = i;
    }
  }
  return index;
}

async function run() {
  const lines = (await readFile(__dirname, 'input.txt')).split('\n');
  const bots = [];
  lines.forEach((line) => {
    if (line.trim()) {
      const match = line.match(/pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/).map(x => parseInt(x, 10));
      bots.push({
        loc: match.slice(1, 4),
        rad: match[4],
      });
    }
  });
  const index = maxRadId(bots);
  const maxBot = bots[index];
  const inRange = bots.filter(bot => distance(maxBot.loc, bot.loc) <= maxBot.rad);
  console.log(inRange.length);
}

run();
