const { isSimilar, common } = require('./common');

test('test if two strings are similar', () => {
  expect(isSimilar('ab', 'bb')).toBe('b');
  expect(isSimilar('ab', 'bc')).toBeNull();
  expect(isSimilar('abcd', 'abbb')).toBeNull();
  expect(isSimilar('abcd', 'abce')).toBe('abc');
  expect(isSimilar('xbc', 'abc')).toBe('bc');
});

test('find similar strings', () => {
  expect(common(['cc', 'xx', 'ab', 'dd', 'bb'])).toEqual('b');
});
