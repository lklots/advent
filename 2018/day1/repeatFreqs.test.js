const repeatFreqs = require('./repeatFreqs');

test('test frequency repetition', () => {
  expect(repeatFreqs(['+1', '-1'])).toBe(0);
  expect(repeatFreqs(['+3', '+3', '+4', '-2', '-4'])).toBe(10);
  expect(repeatFreqs(['-6', '+3', '+8', '+5', '-6'])).toBe(5);
  expect(repeatFreqs(['+7', '+7', '-2', '-7', '-4'])).toBe(14);
});
