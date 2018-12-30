const { checksum, counts } = require('./checksum');


test('combinations of counts', () => {
  expect(counts('abcdef')).toBe([0, 0]);
  expect(counts('bababc')).toBe([1, 1]);
  expect(counts('abbcde')).toBe([1, 0]);
  expect(counts('abcccd')).toBe([0, 1]);
  expect(counts('aabcdd')).toBe([1, 0]);
  expect(counts('abcdee')).toBe([1, 0]);
  expect(counts('ababab')).toBe([0, 1]);
});

test('checksum of ids', () => {
  expect(checksum([
    'abcdef',
    'bababc',
    'abbcde',
    'abcccd',
    'aabcdd',
    'abcdee',
    'ababab',
  ])).toBe(12);
});
