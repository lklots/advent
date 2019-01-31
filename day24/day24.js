#!/usr/local/bin/node

const readFile = require('../lib/file');

const BODY = 'BODY';
const VIRUS = 'VIRUS';

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

function parseArmy(type, lines) {
  const army = [];
  let ID = 1;
  lines.forEach((line) => {
    if (!line || !line.trim()) {
      return;
    }
    const match = line.match(/(\d+) units each with (\d+) hit points ?\(?(.*)\)? with an attack that does (\d+) ([a-z]+) damage at initiative (\d+)/);
    const [_, units, hp, modifiers, attack, attackType, initiative] = match;
    army.push({
      id: ID,
      type,
      units: parseInt(units, 10),
      hp: parseInt(hp, 10),
      attack: parseInt(attack, 10),
      attackType,
      initiative: parseInt(initiative, 10),
      modifiers: parseModifiers(modifiers),
    });
    ID += 1;
  });
  return army;
}

function power(unit) {
  return unit.units * unit.attack;
}

function damage(attacker, b) {
  if (b.modifiers[attacker.attackType] === 'immune') {
    return 0;
  }
  if (b.modifiers[attacker.attackType] === 'weak') {
    return power(attacker) * 2;
  }
  return power(attacker);
}

function target(unit, enemies) {
  if (!enemies.length) {
    return null;
  }
  enemies.forEach((enemy) => {
    // console.log(`${unit.type} group ${unit.id} would deal defending group ${enemy.id} ${damage(unit, enemy)} damage and power ${power(enemy)}`);
  });
  enemies.sort((a, b) => {
    const d = damage(unit, b) - damage(unit, a);
    if (d === 0) {
      const p = power(b) - power(a);
      if (p === 0) {
        return b.initiative - a.initiative;
      }
      return p;
    }
    return d;
  });

  const enemy = enemies[0];
  if (damage(unit, enemy) === 0) {
    return null;
  }

  return enemy;
}

// 20 units, 10 hp. power 50. (20*10-45)/10 = 15.5

function attack(unit, enemy) {
  if (!enemy) {
    return null;
  }
  const remainingHp = (enemy.hp * enemy.units) - damage(unit, enemy);
  if (remainingHp <= 0) {
    // console.log(`${unit.type} group ${unit.id} attacks defending group ${enemy.id}, killing ${enemy.units} units`);
    enemy.units = 0;
    return enemy;
  }
  const unitsRemaining = Math.ceil(remainingHp / enemy.hp);
  // console.log(`${unit.type} group ${unit.id} attacks defending group ${enemy.id}, killing ${enemy.units - unitsRemaining} units`);
  enemy.units = unitsRemaining;
  return enemy;
}


function targetArmies(body, virus) {
  const targets = new Map();
  const all = body.concat(virus);
  all.sort((a, b) => (power(b) * 1000 - power(a) * 1000) + (b.initiative - a.initiative));
  all.forEach((unit) => {
    const army = unit.type === BODY ? virus : body;
    const t = target(unit, army);
    if (t) {
      targets.set(unit, t);
      army.splice(army.findIndex(x => x === t), 1);
    } else {
      targets.set(unit, null);
    }
  });
  return targets;
}

function printArmy(type, army) {
  console.log(type);
  army.forEach((g) => {
    console.log(`Group ${g.id} contains ${g.units}`);
  });
}

function fight(body, virus) {
  const targets = targetArmies(body.slice(), virus.slice());
  const order = new Array(...targets.keys());
  order.sort((a, b) => b.initiative - a.initiative);
  order.forEach((unit) => {
    if (unit.units) {
      const enemy = attack(unit, targets.get(unit));
      if (enemy && enemy.units === 0) {
        const army = enemy.type === BODY ? body : virus;
        army.splice(army.findIndex(x => x === enemy), 1);
      }
    }
  });
}

async function run() {
  const lines = (await readFile(__dirname, 'input.txt')).split('\n');
  const index = lines.findIndex(x => x.match(/Infection:/));
  const body = parseArmy(BODY, lines.slice(1, index));
  const virus = parseArmy(VIRUS, lines.slice(index + 1, lines.length));
  while (body.length && virus.length) {
    fight(body, virus);
  }
  const army = body.length ? body : virus;
  console.log(army.reduce((acc, unit) => acc + unit.units, 0));
}

run();
