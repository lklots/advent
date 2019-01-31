#!/usr/local/bin/node

const readFile = require('../lib/file');

function parseModifiers(line) {
  if (!line || !line.trim()) {
    return {};
  }

  const modifiers = {};
  line.split(';').forEach((part) => {
    const match = part.match(/([a-z]+) to ([a-z, ]+)/);
    const modifier = match[1];
    match[2].split(',').forEach((x) => {
      modifiers[x.trim()] = modifier;
    });
  });

  return modifiers;
}

function parseArmy(lines) {
  const army = [];
  lines.forEach((line) => {
    if (!line[0]) {
      return;
    }
    const match = line.match(/(\d+) units each with (\d+) hit points ?\(?(.*)\)? with an attack that does (\d+) ([a-z]+) damage at initiative (\d+)/);
    const [_, units, hp, modifiers, attack, attackType, initiative] = match;
    army.push({
      units: parseInt(units, 10),
      hp: parseInt(hp, 10),
      attack: parseInt(attack, 10),
      attackType,
      initiative: parseInt(initiative, 10),
      modifiers: parseModifiers(modifiers),
    });
  });
  return army;
}

async function run() {
  const lines = (await readFile(__dirname)).split('\n');
  const index = lines.findIndex(x => x.match(/Infection:/));
  const body = parseArmy(lines.slice(1, index));
  const virus = parseArmy(lines.slice(index + 1, lines.length));
  console.log(body);
  console.log(virus);
}

run();
