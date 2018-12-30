const { checksum, counts } = require('./checksum');


test('combinations of counts', () => {
  expect(counts('abcdef')).toEqual([0, 0]);
  expect(counts('bababc')).toEqual([1, 1]);
  expect(counts('abbcde')).toEqual([1, 0]);
  expect(counts('abcccd')).toEqual([0, 1]);
  expect(counts('aabcdd')).toEqual([1, 0]);
  expect(counts('abcdee')).toEqual([1, 0]);
  expect(counts('ababab')).toEqual([0, 1]);
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
