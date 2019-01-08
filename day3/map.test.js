const { claim, allClaims } = require('./map');

test('test overlapping claims', () => {
  const map = new Map();
  expect(claim(map, {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  })).toEqual(0);
  expect(claim(map, {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  })).toEqual(1);
  expect(Array.from(map.values()).filter(Boolean).length).toEqual(1);
  expect(claim(map, {
    x: 1,
    y: 1,
    width: 1,
    height: 1,
  })).toEqual(0);
  expect(claim(map, {
    x: 0,
    y: 0,
    width: 2,
    height: 2,
  })).toEqual(2);
  expect(Array.from(map.values()).filter(Boolean).length).toEqual(2);
});

test('count number of overlapping claims', () => {
  expect(allClaims([{
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  },
  {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  },
  {
    x: 1,
    y: 1,
    width: 1,
    height: 1,
  },
  {
    x: 0,
    y: 0,
    width: 2,
    height: 2,
  }])).toEqual(2);
});
