const aggFreqs = require('./freq');

test('test frequency aggregation', () => {
  expect(aggFreqs(['+1', '+1', '+1'])).toBe(3);
  expect(aggFreqs(['+1', '+1', '-2'])).toBe(0);
  expect(aggFreqs(['-1', '-2', '-3'])).toBe(-6);
});
