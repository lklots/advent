function claim(map, c) {
  let alreadyClaimed = 0;
  for (let i = c.x; i < c.x + c.width; i += 1) {
    for (let j = c.y; j < c.y + c.height; j += 1) {
      const key = `${i},${j}`;
      if (map.has(key)) {
        alreadyClaimed += 1;
        map.set(`${i},${j}`, true);
      } else {
        map.set(`${i},${j}`, false);
      }
    }
  }

  return alreadyClaimed;
}

function allClaims(claims) {
  const map = new Map();
  claims.forEach((c) => {
    claim(map, c);
  });

  let claimed = 0;
  Array.from(map.values()).forEach((v) => {
    if (v) {
      claimed += 1;
    }
  });

  return claimed;
}

module.exports = {
  claim,
  allClaims,
};
