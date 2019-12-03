#!/usr/local/bin/node

function printState(state) {
  const recipes = state.recipes.slice();
  recipes[state.elf1] = `(${recipes[state.elf1]})`;
  recipes[state.elf2] = `[${recipes[state.elf2]}]`;
  console.log(recipes.join('  '));
}

function advance(state) {
  let combo = state.recipes[state.elf1] + state.recipes[state.elf2];
  if (combo < 10) {
    state.recipes.push(combo);
    combo = [combo];
  } else if (combo < 100) {
    combo = [Math.floor(combo / 10), combo % 10];
    state.recipes.push(combo[0]);
    state.recipes.push(combo[1]);
  } else {
    throw new Error('big combo');
  }

  state.elf1 = (state.elf1 + state.recipes[state.elf1] + 1) % state.recipes.length;
  state.elf2 = (state.elf2 + state.recipes[state.elf2] + 1) % state.recipes.length;

  return combo;
}

function checkForSpecialRecipe(recipes, special) {
  if (recipes.length < special.length + 1) {
    return 0;
  }
  let last = recipes.slice(recipes.length - special.length, recipes.length);
  if (last.join('') === special.join('')) {
    return 1;
  }
  last = recipes.slice(recipes.length - special.length - 1, recipes.length - 1);
  if (last.join('') === special.join('')) {
    return 2;
  }
  return 0;
}

const state = {
  recipes: [3, 7],
  elf1: 0,
  elf2: 1,
};

let recipes = [];
const TRAINING_LIMIT = 3301210;
const SPECIAL = '330121';
let specialFound = false;
while (state.recipes.length < TRAINING_LIMIT) {
  recipes = advance(state);
  const index = checkForSpecialRecipe(state.recipes, SPECIAL.split(''));
  if (index && !specialFound) {
    specialFound = true;
    console.log(`answer to part 2: ${state.recipes.length - SPECIAL.length - index + 1}`);
  }
}

// if we created two extra recipes beyond the limit, just keep the last one!
if (state.recipes.length - TRAINING_LIMIT >= 1) {
  recipes = [recipes[1]];
} else {
  recipes = [];
}

for (let i = 0; i < 10; i += 1) {
  recipes = recipes.concat(advance(state));
}
console.log(`part1 : ${recipes.slice(0, 10).join('')}`);
