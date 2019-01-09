#!/usr/bin/env node

const util = require('util');
const path = require('path');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

async function run() {
  const file = await readFile(path.join(__dirname, 'input.txt'));
  const records = file.toString().split('\n');
  records.sort();

  const guards = {};
  let currentGuard = null;
  let currentAsleep = null;
  for (let i = 0; i < records.length; i += 1) {
    const shift = records[i].match(/Guard #(\d+) begins shift/);
    const wakeup = records[i].match(/00:(\d\d)] wakes up/);
    const asleep = records[i].match(/00:(\d\d)] falls asleep/);
    if (shift) {
      currentGuard = parseInt(shift[1], 10);
      currentAsleep = null;
      if (!guards[currentGuard]) {
        guards[currentGuard] = {
          total: 0,
          minutes: {},
        };
      }
    } else if (asleep) {
      currentAsleep = parseInt(asleep[1], 10);
    } else if (wakeup) {
      const currentWakeup = parseInt(wakeup[1], 10);
      guards[currentGuard].total += currentWakeup - currentAsleep;
      for (let j = currentAsleep; j < currentWakeup; j++) {
        if (!guards[currentGuard].minutes[j]) {
          guards[currentGuard].minutes[j] = 1;
        } else {
          guards[currentGuard].minutes[j] += 1;
        }
      }
      currentAsleep = null;
    }
  }
  const maxGuardId = Object.keys(guards).reduce((a, b) => {
    return guards[a].total > guards[b].total ? a : b;
  });
  const maxGuard = guards[maxGuardId];
  const maxMinute = Object.keys(maxGuard.minutes).reduce((a, b) => {
    return maxGuard.minutes[a] > maxGuard.minutes[b] ? a : b;
  });

  console.log(`${maxGuardId} * ${maxMinute}=${maxMinute * maxGuardId}`);
}

run();
