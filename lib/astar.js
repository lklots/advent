function set(map, key, value) {
  map.set(JSON.stringify(key), value);
}

function get(map, key) {
  return map.get(JSON.stringify(key));
}

function has(map, key) {
  return map.has(JSON.stringify(key));
}

function path(previous, step) {
  if (!step) {
    return [];
  }
  return path(previous, get(previous, step)).concat([step]);
}

function astar(start, hFunc, movesFunc, distanceFunc) {
  const frontier = [[hFunc(start), start]];
  const previous = new Map();
  set(previous, start, null);
  const pathCost = new Map();
  set(pathCost, start, 0);

  while (frontier.length) {
    frontier.sort((a, b) => a[0] - b[0]);
    const [, step] = frontier.shift();
    if (hFunc(step) === 0) {
      return path(previous, step);
    }
    movesFunc(step).forEach((move) => {
      const newCost = get(pathCost, step) + distanceFunc(step, move);
      if (!has(pathCost, move) || newCost < get(pathCost, move)) {
        frontier.unshift([newCost + hFunc(move), move]);
        set(pathCost, move, newCost);
        set(previous, move, step);
      }
    });
  }
  return { failed: true };
}

module.exports = astar;
